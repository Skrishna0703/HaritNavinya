import axios from 'axios';

const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

function safeNum(v, fallback = 0) {
  return typeof v === 'number' ? v : fallback;
}

function getWeatherCondition(code) {
  // WMO Weather interpretation codes
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return conditions[code] || 'Unknown';
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    // Fetch from Open-Meteo (no API key required)
    const response = await axios.get(OPENMETEO_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_temperature_0cm',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        forecast_days: 7,
        timezone: 'auto'
      }
    });

    const data = response.data;
    const current = data.current_weather;
    const hourly = data.hourly;
    const daily = data.daily;

    // Build current weather
    const currentWeather = {
      temperature: safeNum(current?.temperature),
      condition: getWeatherCondition(current?.weather_code || 0),
      humidity: safeNum(hourly?.relative_humidity_2m?.[0]),
      windSpeed: safeNum(current?.wind_speed),
      visibility: 10, // Open-Meteo doesn't provide visibility
      uvIndex: 6, // Mock value
      pressure: 1013, // Mock value
      feelsLike: safeNum(current?.temperature), // Approximation
      sunrise: null,
      sunset: null
    };

    // Build hourly forecast
    const hourlyForecast = (hourly.time || []).slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: safeNum(hourly.temperature_2m[index]),
      rainProbability: safeNum(hourly.precipitation[index] > 0 ? 75 : 0),
      weather: getWeatherCondition(0), // Simplified
      icon: 'cloud'
    }));

    // Build daily forecast
    const weeklyForecast = (daily.time || []).slice(0, 7).map((time, index) => ({
      date: new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temp: Math.round((safeNum(daily.temperature_2m_max[index]) + safeNum(daily.temperature_2m_min[index])) / 2),
      minTemp: safeNum(daily.temperature_2m_min[index]),
      maxTemp: safeNum(daily.temperature_2m_max[index]),
      condition: getWeatherCondition(daily.weather_code[index]),
      rain: safeNum(daily.precipitation_sum[index]),
      snow: 0,
      rainProbability: safeNum(daily.precipitation_sum[index]) > 0 ? 60 : 20
    }));

    // Build rainfall data for chart
    const rainfallData = (daily.time || []).slice(0, 15).map((time, index) => ({
      date: new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rainfall: safeNum(daily.precipitation_sum[index]),
      temperature: Math.round((safeNum(daily.temperature_2m_max[index]) + safeNum(daily.temperature_2m_min[index])) / 2)
    }));

    // Generate weather alerts based on Open-Meteo data
    const alerts = [];

    hourly.time.forEach((time, index) => {
      const rain = hourly.precipitation[index];
      const temp = hourly.temperature_2m[index];
      const wind = hourly.wind_speed_10m[index];
      const humidity = hourly.relative_humidity_2m[index];

      /* RAIN ALERTS */
      if (rain > 25) {
        alerts.push({
          type: 'Heavy Rain',
          severity: 'Red',
          recommendation: 'Avoid fertilizer spraying',
          time
        });
      } else if (rain > 10) {
        alerts.push({
          type: 'Moderate Rain',
          severity: 'Orange',
          recommendation: 'Delay pesticide spraying',
          time
        });
      } else if (rain > 5) {
        alerts.push({
          type: 'Light Rain',
          severity: 'Yellow',
          recommendation: 'Monitor crop conditions',
          time
        });
      }

      /* HEATWAVE */
      if (temp > 38) {
        alerts.push({
          type: 'Heatwave',
          severity: 'Orange',
          recommendation: 'Increase irrigation',
          time
        });
      }

      /* STRONG WIND */
      if (wind > 40) {
        alerts.push({
          type: 'Strong Wind',
          severity: 'Yellow',
          recommendation: 'Protect crops from wind damage',
          time
        });
      }

      /* LOW HUMIDITY */
      if (humidity < 30) {
        alerts.push({
          type: 'Low Humidity',
          severity: 'Yellow',
          recommendation: 'Increase watering frequency',
          time
        });
      }
    });

    // Generate farming advice
    const farmingAdvice = [];
    const highRainDays = weeklyForecast.filter(d => d.rainProbability >= 60);
    
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
    const highWindDays = weeklyForecast.filter(d => {
      const hourlyForDay = hourlyForecast.filter(h => 
        h.time.includes('PM') || h.time.includes('AM')
      );
      return hourlyForDay.some(h => h.rainProbability > 50);
    });

    if (highWindDays.length > 0 || currentWeather.windSpeed > 20) {
      farmingAdvice.push({
        icon: 'Wind',
        title: 'Secure Equipment',
        description: 'Strong winds possible. Secure farm equipment and temporary structures',
        priority: 'Medium'
      });
    }

    // Soil moisture advice based on soil temperature
    const soilTemp = hourly.soil_temperature_0cm?.[0];
    if (soilTemp && soilTemp > 25) {
      farmingAdvice.push({
        icon: 'Thermometer',
        title: 'Optimize Watering',
        description: 'Soil temperature is high. Adjust irrigation schedule accordingly',
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
      success: true,
      currentWeather,
      hourlyForecast,
      weeklyForecast,
      rainfallData,
      weatherAlerts: alerts,
      farmingAdvice,
      provider: 'Open-Meteo',
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error('Weather Service Error:', err.message);
    throw new Error(`Failed to fetch weather data: ${err.message}`);
  }
}

export { fetchWeatherByCoords };

