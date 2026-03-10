const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Stats must come before :id routes
router.get('/stats/overview', vehicleController.getStats);

// CRUD
router.get('/', vehicleController.getAllVehicles);
router.post('/', vehicleController.createVehicle);
router.get('/:id', vehicleController.getVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

// Telemetry
router.post('/:id/telemetry', vehicleController.pushTelemetry);
router.get('/:id/history', vehicleController.getHistory);

module.exports = router;
