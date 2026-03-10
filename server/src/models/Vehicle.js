const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  driverName: {
    type: String,
    trim: true,
    default: ''
  },
  driverPhone: {
    type: String,
    trim: true,
    default: ''
  },
  iotDeviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
  },
  lastTemperature: {
    value: { type: Number, default: -18 },
    unit: { type: String, default: '°C' },
    updatedAt: { type: Date, default: Date.now }
  },
  lastHumidity: {
    value: { type: Number, default: null },
    updatedAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

vehicleSchema.index({ status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
