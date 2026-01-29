const weatherService = require('../services/weather.service');

async function getWeatherByCoords(req, res) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon query parameters are required' });
    }

    const data = await weatherService.fetchWeatherByCoords(lat, lon);
    return res.json(data);
  } catch (err) {
    console.error('Weather controller error:', err);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}

module.exports = { getWeatherByCoords };
