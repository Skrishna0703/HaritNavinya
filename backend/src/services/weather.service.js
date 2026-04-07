import apiClient from '../utils/apiClient.js';

function safeNum(v, fallback = 0) {
  return typeof v === 'number' ? v : fallback;
}

async function fetchWeatherByCoords(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('OPENWEATHER_API_KEY not set');

  try {
    // Fetch current weather
    const currentParams = {
      lat,
      lon,
      units: 'metric',
      appid: apiKey
    };

    const currentUrl = `/weather`;
    const currentResp = await apiClient.get(currentUrl, { params: currentParams });
    const current = currentResp.data;

    // Fetch forecast (5-day / 3-hour)
    const forecastUrl = `/forecast`;
    const forecastResp = await apiClient.get(forecastUrl, { params: currentParams });
    const forecast = forecastResp.data;

    // Map current weather
    const currentWeather = {
      temperature: safeNum(current.main?.temp),
      condition: (current.weather && current.weather[0] && current.weather[0].description) || 'N/A',
      humidity: safeNum(current.main?.humidity),
      windSpeed: safeNum(current.wind?.speed),
      visibility: safeNum(current.visibility) / 1000 || 10, // convert to km
      uvIndex: 6, // mock value since basic API doesn't include UV
      pressure: safeNum(current.main?.pressure),
      feelsLike: safeNum(current.main?.feels_like),
      sunrise: current.sys?.sunrise || null,
      sunset: current.sys?.sunset || null
    };

    // Process hourly forecast (every 3 hours from forecast data)
    const hourly = (forecast.list || []).slice(0, 8).map(h => ({
      time: new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: safeNum(h.main?.temp),
      rainProbability: safeNum(h.pop * 100),
      weather: (h.weather && h.weather[0] && h.weather[0].description) || '',
      icon: (h.weather && h.weather[0] && h.weather[0].icon) || ''
    }));

    // Process daily forecast (5 days, one entry per day at noon)
    const dailyMap = {};
    const today = new Date();
    let currentDayIndex = 0;
    
    (forecast.list || []).forEach((item, idx) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyMap[date]) {
        dailyMap[date] = [];
      }
      dailyMap[date].push(item);
    });

    const daily = Object.entries(dailyMap).slice(0, 7).map(([apiDate, items], idx) => {
      // Generate current date starting from today
      const forecastDate = new Date(today);
      forecastDate.setDate(forecastDate.getDate() + idx);
      const currentDate = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      console.log(`[Weather] Processing day ${idx}: API date=${apiDate}, Current date being used=${currentDate}, Server today=${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
      
      const temps = items.map(i => i.main?.temp).filter(t => t);
      const rains = items.map(i => i.pop || 0);
      const conditions = items.map(i => i.weather?.[0]?.description || '');
      
      return {
        date: currentDate,
        temp: Math.round((Math.max(...temps) + Math.min(...temps)) / 2),
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        condition: conditions[0] || 'N/A',
        rain: items.reduce((s, i) => s + (i.rain?.['3h'] || 0), 0) || 0,
        snow: items.reduce((s, i) => s + (i.snow?.['3h'] || 0), 0) || 0,
        rainProbability: Math.round((rains.reduce((a, b) => a + b, 0) / rains.length) * 100)
      };
    });

    // Build rainfallData for chart with current dates
    const rainfallData = Object.entries(dailyMap).slice(0, 15).map(([apiDate, items], idx) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(forecastDate.getDate() + idx);
      const currentDate = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        date: currentDate,
        rainfall: items.reduce((s, i) => s + (i.rain?.['3h'] || 0), 0),
        temperature: safeNum(items[0]?.main?.temp)
      };
    });

    // Mock alerts (OpenWeather 2.5 doesn't include alerts)
    const alerts = [];

    // Simple farming advice heuristics
    const farmingAdvice = [];
    const highRainDays = daily.filter(d => d.rainProbability >= 60);
    if (highRainDays.length > 0) {
      farmingAdvice.push({
        icon: 'Umbrella',
        title: 'Postpone Spraying',
        description: 'Avoid pesticide/fertilizer spraying due to expected rainfall',
        priority: 'High'
      });
      farmingAdvice.push({
        icon: 'Droplets',
        title: 'Check Drainage',
        description: 'Ensure proper drainage systems are clear to prevent waterlogging',
        priority: 'High'
      });
    }

    // Wind advisory
    const windySpeeds = hourly.filter(h => h.wind && h.wind > 20);
    if (windySpeeds.length > 0 || currentWeather.windSpeed > 20) {
      farmingAdvice.push({
        icon: 'Wind',
        title: 'Secure Equipment',
        description: 'Strong winds possible. Secure farm equipment and temporary structures',
        priority: 'Medium'
      });
    }

    // Fallback advice
    if (farmingAdvice.length === 0) {
      farmingAdvice.push({
        icon: 'Calendar',
        title: 'Plan Operations',
        description: 'Weather looks stable for near-term operations',
        priority: 'Low'
      });
    }

    return {
      currentWeather,
      hourlyForecast: hourly,
      weeklyForecast: daily,
      rainfallData,
      weatherAlerts: alerts,
      farmingAdvice
    };
  } catch (err) {
    console.error('Service error:', err.response?.data || err.message);
    throw err;
  }
}

export { fetchWeatherByCoords };

