const Vehicle = require('../models/Vehicle');
const TelemetryLog = require('../models/TelemetryLog');

/**
 * Processes a single IoT telemetry payload (the exact format from the real API).
 * Handles field name quirks (lattitude with double-t).
 * Can be called by the ingest endpoint OR by the polling service.
 *
 * @param {object} payload - Raw IoT API payload
 * @returns {object|null} - Updated vehicle or null if not matched
 */
async function processTelemetryPayload(payload) {
  const {
    id,
    organization,
    device,
    temperature,
    humidity,
    lattitude,   // Note: API typo — double 't'
    longitude,
    eventTime,
    additionalParam1,
    additionalParam2,
  } = payload;

  // Normalise lat — handle both "lattitude" (API typo) and "latitude" (correct)
  const lat = lattitude ?? payload.latitude;
  const lng = longitude;

  if (lat === undefined || lng === undefined || temperature === undefined) {
    throw new Error('Missing required fields: lat/lattitude, longitude, temperature');
  }

  const now = new Date();
  const eventTimestamp = eventTime ? new Date(eventTime) : now;

  // Match device to a vehicle using iotDeviceId.
  // The API's numeric "id" is stored as a string in iotDeviceId.
  // We try matching by: id (numeric → string), then device field.
  const deviceIdStr = String(id);
  const vehicle = await Vehicle.findOneAndUpdate(
    {
      $or: [
        { iotDeviceId: deviceIdStr },
        ...(device ? [{ iotDeviceId: typeof device === 'object' && device.deviceUniqueID ? device.deviceUniqueID : String(device) }] : []),
      ]
    },
    {
      lastLocation: { lat, lng, updatedAt: eventTimestamp },
      lastTemperature: { value: temperature, unit: '°C', updatedAt: eventTimestamp },
      lastHumidity: { value: humidity ?? null, updatedAt: eventTimestamp },
    },
    { new: true }
  );

  if (!vehicle) {
    console.warn(`[IoT] No vehicle matched for device id=${id} device=${typeof device === 'object' ? JSON.stringify(device) : device}`);
    return null;
  }

  // Store telemetry log — use upsert to deduplicate by rawEventId
  try {
    await TelemetryLog.findOneAndUpdate(
      { vehicleId: vehicle.vehicleId, rawEventId: id },
      {
        $setOnInsert: {
          vehicleId: vehicle.vehicleId,
          lat,
          lng,
          temperature,
          humidity: humidity ?? null,
          rawEventId: id,
          rawEventTime: eventTimestamp,
          organization: typeof organization === 'object' ? JSON.stringify(organization) : (organization ?? null),
          device: device ? (typeof device === 'object' && device.deviceUniqueID ? device.deviceUniqueID : String(device)) : null,
          timestamp: eventTimestamp,
        }
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    // Dedup conflict is OK — skip silently
    if (err.code !== 11000) throw err;
  }

  return vehicle;
}

/**
 * POST /api/iot/ingest
 * The IoT platform calls this endpoint with the telemetry payload.
 * Can accept a single object OR an array of objects.
 */
exports.ingest = async (req, res, next) => {
  try {
    const body = req.body;
    const payloads = Array.isArray(body) ? body : [body];

    const results = [];
    const errors = [];

    for (const payload of payloads) {
      try {
        const vehicle = await processTelemetryPayload(payload);
        results.push({
          eventId: payload.id,
          matched: !!vehicle,
          vehicleId: vehicle?.vehicleId ?? null,
        });
      } catch (err) {
        errors.push({ eventId: payload.id, error: err.message });
      }
    }

    res.json({
      success: true,
      processed: results.length,
      matched: results.filter(r => r.matched).length,
      results,
      errors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/iot/simulate
 * Simulates a telemetry push for a vehicle — useful for testing before live API.
 * Accepts optional vehicleId to simulate a specific truck.
 */
exports.simulate = async (req, res, next) => {
  try {
    const { vehicleId } = req.body;

    // Pick a random active vehicle or a specific one
    let vehicle;
    if (vehicleId) {
      vehicle = await Vehicle.findOne({ vehicleId }).lean();
    } else {
      const vehicles = await Vehicle.find({ status: 'active' }).lean();
      if (!vehicles.length) {
        return res.status(404).json({ success: false, message: 'No active vehicles to simulate' });
      }
      vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Generate realistic random drift around current position
    const latDrift = (Math.random() - 0.5) * 0.01;
    const lngDrift = (Math.random() - 0.5) * 0.01;
    const tempDrift = (Math.random() - 0.5) * 2;

    const simulatedPayload = {
      id: Date.now(),                                   // unique fake event id
      organization: 'ColdChain Corp',
      device: vehicle.iotDeviceId,
      temperature: parseFloat(((vehicle.lastTemperature?.value ?? -18) + tempDrift).toFixed(2)),
      humidity: parseFloat((60 + Math.random() * 20).toFixed(2)),
      lattitude: parseFloat(((vehicle.lastLocation?.lat ?? 10.89) + latDrift).toFixed(6)),
      longitude: parseFloat(((vehicle.lastLocation?.lng ?? 76.05) + lngDrift).toFixed(6)),
      eventTime: new Date().toISOString(),
      additionalParam1: '',
      additionalParam2: '',
    };

    const updated = await processTelemetryPayload(simulatedPayload);

    res.json({
      success: true,
      simulated: simulatedPayload,
      vehicle: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Export the processor so the poller can reuse it
exports.processTelemetryPayload = processTelemetryPayload;
