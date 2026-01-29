const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// GET /api/weather?lat=..&lon=..
router.get('/', weatherController.getWeatherByCoords);

module.exports = router;
