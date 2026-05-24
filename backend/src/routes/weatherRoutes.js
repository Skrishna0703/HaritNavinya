import express from 'express';
import { fetchWeatherByCoords } from '../services/weather.service.js';

const router = express.Router();

/**
 * GET /api/weather
 * Get weather data by latitude and longitude
 * Query params:
 *   - lat: Latitude (REQUIRED)
 *   - lon: Longitude (REQUIRED)
 * Returns: Current weather, hourly forecast, weekly forecast, rainfall data
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Latitude (lat) and Longitude (lon) query parameters are required'
      });
    }

    // Validate lat/lon are valid numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Latitude and Longitude must be valid numbers'
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Latitude must be between -90 and 90'
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Longitude must be between -180 and 180'
      });
    }

    console.log(`🌤️ Fetching weather for lat=${latitude}, lon=${longitude}`);

    // Fetch weather data from service
    const data = await fetchWeatherByCoords(latitude, longitude);

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      location: { lat: latitude, lon: longitude }
    });
  } catch (error) {
    console.error('❌ Weather API error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch weather data from Open-Meteo API',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
