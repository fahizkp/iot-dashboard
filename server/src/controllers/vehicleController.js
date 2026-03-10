const Vehicle = require('../models/Vehicle');
const TelemetryLog = require('../models/TelemetryLog');

// GET /api/vehicles - List all vehicles
exports.getAllVehicles = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['active', 'inactive', 'maintenance'].includes(status)) {
      filter.status = status;
    }

    const vehicles = await Vehicle.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

// GET /api/vehicles/:id - Get single vehicle
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.id }).lean();
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// POST /api/vehicles - Create a vehicle
exports.createVehicle = async (req, res, next) => {
  try {
    const { vehicleId, name, licensePlate, driverName, driverPhone, iotDeviceId, status } = req.body;

    const vehicle = await Vehicle.create({
      vehicleId,
      name,
      licensePlate,
      driverName,
      driverPhone,
      iotDeviceId,
      status: status || 'active'
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/vehicles/:id - Update vehicle info
exports.updateVehicle = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'licensePlate', 'driverName', 'driverPhone', 'status', 'iotDeviceId'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId: req.params.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/vehicles/:id - Delete vehicle
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ vehicleId: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Also delete telemetry logs
    await TelemetryLog.deleteMany({ vehicleId: req.params.id });

    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/vehicles/:id/telemetry - IoT device pushes location & temperature
exports.pushTelemetry = async (req, res, next) => {
  try {
    const { lat, lng, temperature } = req.body;

    if (lat === undefined || lng === undefined || temperature === undefined) {
      return res.status(400).json({
        success: false,
        message: 'lat, lng, and temperature are required'
      });
    }

    const now = new Date();

    // Update the vehicle's last known location and temperature
    const vehicle = await Vehicle.findOneAndUpdate(
      { vehicleId: req.params.id },
      {
        lastLocation: { lat, lng, updatedAt: now },
        lastTemperature: { value: temperature, unit: '°C', updatedAt: now }
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Log the telemetry
    await TelemetryLog.create({
      vehicleId: req.params.id,
      lat,
      lng,
      temperature,
      timestamp: now
    });

    res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// GET /api/vehicles/:id/history - Get telemetry history
exports.getHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    const logs = await TelemetryLog.find({ vehicleId: req.params.id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// GET /api/vehicles/stats/overview - Dashboard stats
exports.getStats = async (req, res, next) => {
  try {
    const total = await Vehicle.countDocuments();
    const active = await Vehicle.countDocuments({ status: 'active' });
    const inactive = await Vehicle.countDocuments({ status: 'inactive' });
    const maintenance = await Vehicle.countDocuments({ status: 'maintenance' });

    // Get vehicles with temperature alerts (above -10°C for frozen goods)
    const tempAlerts = await Vehicle.countDocuments({
      status: 'active',
      'lastTemperature.value': { $gt: -10 }
    });

    // Average temperature of active vehicles
    const avgTempResult = await Vehicle.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, avgTemp: { $avg: '$lastTemperature.value' } } }
    ]);
    const avgTemp = avgTempResult.length > 0 ? Math.round(avgTempResult[0].avgTemp * 10) / 10 : 0;

    res.json({
      success: true,
      data: { total, active, inactive, maintenance, tempAlerts, avgTemp }
    });
  } catch (error) {
    next(error);
  }
};
