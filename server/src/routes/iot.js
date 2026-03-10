const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// Inbound webhook — IoT platform pushes data here
// POST /api/iot/ingest
router.post('/ingest', iotController.ingest);

// Simulate a telemetry event — for testing without a live API
// POST /api/iot/simulate
router.post('/simulate', iotController.simulate);

module.exports = router;
