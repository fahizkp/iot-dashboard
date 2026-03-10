const mongoose = require('mongoose');
const connectDB = require('./src/config/database');
const Vehicle = require('./src/models/Vehicle');
const TelemetryLog = require('./src/models/TelemetryLog');
const seedDatabase = require('./src/seed');
require('dotenv').config({ path: './.env' });

async function run() {
  await connectDB();
  console.log('Dropping collections...');
  try { await Vehicle.collection.drop(); } catch (e) {}
  try { await TelemetryLog.collection.drop(); } catch (e) {}
  console.log('Seeding...');
  await seedDatabase();
  console.log('Done.');
  process.exit(0);
}

run();
