const mongoose = require('mongoose');

const telemetryLogSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    index: true
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, default: null },
  rawEventId: { type: Number, default: null },   // API's "id" field
  rawEventTime: { type: Date, default: null },    // API's "eventTime"
  organization: { type: String, default: null },
  device: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

// Auto-delete logs older than 7 days
telemetryLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
telemetryLogSchema.index({ vehicleId: 1, timestamp: -1 });
// Deduplication index — prevent double-inserting the same event
telemetryLogSchema.index({ vehicleId: 1, rawEventId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('TelemetryLog', telemetryLogSchema);
