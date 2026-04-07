import { fetchWeatherByCoords } from '../services/weather.service.js';

async function getWeatherByCoords(req, res) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon query parameters are required' });
    }

    const data = await fetchWeatherByCoords(lat, lon);
    return res.json(data);
  } catch (err) {
    console.error('Weather controller error:', err);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}

export { getWeatherByCoords };
