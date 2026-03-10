const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const TelemetryLog = require('./models/TelemetryLog');

const sampleVehicles = [
  {
    vehicleId: 'TRK-001',
    name: 'DEMO VEHICLE',
    licensePlate: 'KL-07-AE-1234',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98765 43210',
    iotDeviceId: '1234567890',
    status: 'active',
    lastLocation: { lat: 10.8505, lng: 76.2711, updatedAt: new Date() },
    lastTemperature: { value: -18.5, unit: '°C', updatedAt: new Date() }
  }
];

async function seedDatabase() {
  const count = await Vehicle.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} vehicles. Skipping seed.`);
    return;
  }

  console.log('Seeding database with sample vehicles...');
  await Vehicle.insertMany(sampleVehicles);

  // Create some initial telemetry logs for each vehicle
  const logs = [];
  for (const vehicle of sampleVehicles) {
    for (let i = 0; i < 10; i++) {
      const hoursAgo = i * 0.5;
      const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      logs.push({
        vehicleId: vehicle.vehicleId,
        lat: vehicle.lastLocation.lat + (Math.random() - 0.5) * 0.1,
        lng: vehicle.lastLocation.lng + (Math.random() - 0.5) * 0.1,
        temperature: vehicle.lastTemperature.value + (Math.random() - 0.5) * 3,
        timestamp
      });
    }
  }
  await TelemetryLog.insertMany(logs);

  console.log(`Seeded ${sampleVehicles.length} vehicles and ${logs.length} telemetry logs.`);
}

module.exports = seedDatabase;
