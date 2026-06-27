/**
 * HaritNavinya Disaster Alert Routes
 * Uses Open-Meteo API for real-time weather-based disaster alerts
 * 
 * Sources:
 * - Open-Meteo Forecast API (free, no API key required)
 * - Generates alerts from: heavy rainfall, heatwaves, storms, high winds, flooding risk
 * 
 * Endpoints:
 * - GET /api/disaster/alerts?state=maharashtra
 * - GET /api/disaster/supported-states
 * - GET /api/disaster/health
 */

import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * State coordinates (capital/major city) for weather lookups
 */
const STATE_DATA = {
  'andhra pradesh':     { lat: 16.5062, lon: 80.6480, capital: 'Amaravati' },
  'arunachal pradesh':  { lat: 27.0844, lon: 93.6053, capital: 'Itanagar' },
  'assam':              { lat: 26.1445, lon: 91.7362, capital: 'Dispur' },
  'bihar':              { lat: 25.6093, lon: 85.1376, capital: 'Patna' },
  'chhattisgarh':       { lat: 21.2514, lon: 81.6296, capital: 'Raipur' },
  'goa':                { lat: 15.4909, lon: 73.8278, capital: 'Panaji' },
  'gujarat':            { lat: 23.2156, lon: 72.6369, capital: 'Gandhinagar' },
  'haryana':            { lat: 30.7333, lon: 76.7794, capital: 'Chandigarh' },
  'himachal pradesh':   { lat: 31.1048, lon: 77.1734, capital: 'Shimla' },
  'jharkhand':          { lat: 23.3441, lon: 85.3096, capital: 'Ranchi' },
  'karnataka':          { lat: 12.9716, lon: 77.5946, capital: 'Bengaluru' },
  'kerala':             { lat: 8.5241,  lon: 76.9366, capital: 'Thiruvananthapuram' },
  'madhya pradesh':     { lat: 23.2599, lon: 77.4126, capital: 'Bhopal' },
  'maharashtra':        { lat: 19.0760, lon: 72.8777, capital: 'Mumbai' },
  'manipur':            { lat: 24.8170, lon: 93.9368, capital: 'Imphal' },
  'meghalaya':          { lat: 25.5788, lon: 91.8933, capital: 'Shillong' },
  'mizoram':            { lat: 23.1645, lon: 92.9376, capital: 'Aizawl' },
  'nagaland':           { lat: 25.6751, lon: 94.1086, capital: 'Kohima' },
  'odisha':             { lat: 20.2961, lon: 85.8245, capital: 'Bhubaneswar' },
  'punjab':             { lat: 30.7333, lon: 76.7794, capital: 'Chandigarh' },
  'rajasthan':          { lat: 26.9124, lon: 75.7873, capital: 'Jaipur' },
  'sikkim':             { lat: 27.3389, lon: 88.6065, capital: 'Gangtok' },
  'tamil nadu':         { lat: 13.0827, lon: 80.2707, capital: 'Chennai' },
  'telangana':          { lat: 17.3850, lon: 78.4867, capital: 'Hyderabad' },
  'tripura':            { lat: 23.8315, lon: 91.2868, capital: 'Agartala' },
  'uttar pradesh':      { lat: 26.8467, lon: 80.9462, capital: 'Lucknow' },
  'uttarakhand':        { lat: 30.3165, lon: 78.0322, capital: 'Dehradun' },
  'west bengal':        { lat: 22.5726, lon: 88.3639, capital: 'Kolkata' },
  // Union Territories
  'andaman & nicobar':  { lat: 11.7401, lon: 92.6586, capital: 'Port Blair' },
  'chandigarh':         { lat: 30.7333, lon: 76.7794, capital: 'Chandigarh' },
  'delhi':              { lat: 28.7041, lon: 77.1025, capital: 'New Delhi' },
  'jammu & kashmir':    { lat: 34.0837, lon: 74.7973, capital: 'Srinagar' },
  'ladakh':             { lat: 34.1526, lon: 77.5771, capital: 'Leh' },
  'puducherry':         { lat: 11.9416, lon: 79.8083, capital: 'Puducherry' },
};

// In-memory cache for alerts (TTL: 15 minutes)
let alertCache = {};
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Generate alerts from Open-Meteo weather data
 */
function generateAlertsFromWeather(weatherData, state, stateInfo) {
  const alerts = [];
  const now = new Date();
  const capitalizedState = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const current = weatherData.current;
  const hourly = weatherData.hourly;
  const daily = weatherData.daily;

  if (!current) return alerts;

  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const rain = current.rain || 0;
  const weatherCode = current.weather_code;

  // Calculate next 24h max rain from hourly data
  let max24hRain = 0;
  let total24hRain = 0;
  if (hourly && hourly.rain) {
    const next24 = Math.min(24, hourly.rain.length);
    for (let i = 0; i < next24; i++) {
      total24hRain += hourly.rain[i] || 0;
      max24hRain = Math.max(max24hRain, hourly.rain[i] || 0);
    }
  }

  // Get daily max temperature
  let maxTemp = temp;
  if (daily && daily.temperature_2m_max && daily.temperature_2m_max.length > 0) {
    maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 3));
  }

  // Get daily min temperature
  let minTemp = temp;
  if (daily && daily.temperature_2m_min && daily.temperature_2m_min.length > 0) {
    minTemp = Math.min(...daily.temperature_2m_min.slice(0, 3));
  }

  // Get max wind gust
  let maxWindGust = windSpeed;
  if (hourly && hourly.wind_gusts_10m) {
    const next24 = Math.min(24, hourly.wind_gusts_10m.length);
    for (let i = 0; i < next24; i++) {
      maxWindGust = Math.max(maxWindGust, hourly.wind_gusts_10m[i] || 0);
    }
  }

  // --- ALERT: Heavy Rainfall ---
  if (total24hRain >= 115) {
    alerts.push({
      title: `Extremely Heavy Rainfall Alert - ${capitalizedState}`,
      description: `Extremely heavy rainfall of ${total24hRain.toFixed(1)}mm expected in next 24 hours near ${stateInfo.capital}. Risk of flash floods, waterlogging, and landslides. Avoid low-lying areas and river banks.`,
      severity: 'High',
      type: 'flood',
      date: now.toISOString(),
    });
  } else if (total24hRain >= 64) {
    alerts.push({
      title: `Heavy Rainfall Warning - ${capitalizedState}`,
      description: `Heavy rainfall of ${total24hRain.toFixed(1)}mm expected in next 24 hours near ${stateInfo.capital}. Possible waterlogging in low-lying areas. Take precautions for crops and livestock.`,
      severity: 'Medium',
      type: 'flood',
      date: now.toISOString(),
    });
  } else if (total24hRain >= 15) {
    alerts.push({
      title: `Moderate Rainfall Advisory - ${capitalizedState}`,
      description: `Moderate rainfall of ${total24hRain.toFixed(1)}mm expected in next 24 hours near ${stateInfo.capital}. Adequate drainage recommended for agricultural fields.`,
      severity: 'Low',
      type: 'rain',
      date: now.toISOString(),
    });
  }

  // --- ALERT: Heatwave ---
  if (maxTemp >= 45) {
    alerts.push({
      title: `Severe Heatwave Alert - ${capitalizedState}`,
      description: `Extreme temperatures up to ${maxTemp.toFixed(1)}°C expected near ${stateInfo.capital}. Stay indoors between 11 AM - 4 PM. Keep livestock hydrated. Risk of crop damage.`,
      severity: 'High',
      type: 'heatwave',
      date: now.toISOString(),
    });
  } else if (maxTemp >= 42) {
    alerts.push({
      title: `Heatwave Warning - ${capitalizedState}`,
      description: `High temperatures up to ${maxTemp.toFixed(1)}°C forecasted near ${stateInfo.capital}. Avoid outdoor farming during peak hours. Ensure adequate irrigation.`,
      severity: 'Medium',
      type: 'heatwave',
      date: now.toISOString(),
    });
  } else if (maxTemp >= 40) {
    alerts.push({
      title: `Heat Advisory - ${capitalizedState}`,
      description: `Above-normal temperatures of ${maxTemp.toFixed(1)}°C expected near ${stateInfo.capital}. Increase watering frequency for crops. Stay hydrated.`,
      severity: 'Low',
      type: 'heatwave',
      date: now.toISOString(),
    });
  }

  // --- ALERT: Cold Wave ---
  if (minTemp <= 2) {
    alerts.push({
      title: `Severe Cold Wave Alert - ${capitalizedState}`,
      description: `Temperatures dropping to ${minTemp.toFixed(1)}°C near ${stateInfo.capital}. Frost damage likely for Rabi crops. Protect nursery plants and livestock.`,
      severity: 'High',
      type: 'coldwave',
      date: now.toISOString(),
    });
  } else if (minTemp <= 6) {
    alerts.push({
      title: `Cold Wave Advisory - ${capitalizedState}`,
      description: `Low temperatures of ${minTemp.toFixed(1)}°C forecasted near ${stateInfo.capital}. Cover vulnerable crops. Provide warm shelter for livestock.`,
      severity: 'Medium',
      type: 'coldwave',
      date: now.toISOString(),
    });
  }

  // --- ALERT: High Wind / Storm ---
  if (maxWindGust >= 90) {
    alerts.push({
      title: `Severe Storm Warning - ${capitalizedState}`,
      description: `Wind gusts up to ${maxWindGust.toFixed(0)} km/h expected near ${stateInfo.capital}. Risk of structural damage, uprooted trees, and crop flattening. Secure loose objects and stay indoors.`,
      severity: 'High',
      type: 'storm',
      date: now.toISOString(),
    });
  } else if (maxWindGust >= 60) {
    alerts.push({
      title: `Strong Wind Warning - ${capitalizedState}`,
      description: `Wind gusts up to ${maxWindGust.toFixed(0)} km/h forecasted near ${stateInfo.capital}. Protect standing crops, especially tall varieties. Secure farm equipment.`,
      severity: 'Medium',
      type: 'storm',
      date: now.toISOString(),
    });
  } else if (windSpeed >= 40) {
    alerts.push({
      title: `Wind Advisory - ${capitalizedState}`,
      description: `Sustained winds of ${windSpeed.toFixed(0)} km/h near ${stateInfo.capital}. Light crop damage possible. Monitor farm structures.`,
      severity: 'Low',
      type: 'storm',
      date: now.toISOString(),
    });
  }

  // --- ALERT: Thunderstorm (from weather code) ---
  // WMO Weather Codes: 95=thunderstorm, 96=thunderstorm w/ hail, 99=severe thunderstorm w/ hail
  if (weatherCode >= 95) {
    alerts.push({
      title: weatherCode >= 96
        ? `Thunderstorm with Hail Warning - ${capitalizedState}`
        : `Thunderstorm Warning - ${capitalizedState}`,
      description: `Active thunderstorm activity detected near ${stateInfo.capital} (WMO code: ${weatherCode}). ${weatherCode >= 96 ? 'Hailstorm risk — protect crops with nets/covers.' : 'Lightning risk — avoid open fields and tall trees.'}`,
      severity: weatherCode >= 96 ? 'High' : 'Medium',
      type: 'thunderstorm',
      date: now.toISOString(),
    });
  }

  // --- ALERT: Dense Fog (from weather code) ---
  // WMO: 45=fog, 48=depositing rime fog
  if (weatherCode === 45 || weatherCode === 48) {
    alerts.push({
      title: `Dense Fog Advisory - ${capitalizedState}`,
      description: `Dense fog conditions near ${stateInfo.capital}. Visibility severely reduced. Avoid road travel. May impact crop drying and harvest operations.`,
      severity: 'Low',
      type: 'fog',
      date: now.toISOString(),
    });
  }

  // --- ALERT: High Humidity + Heat (agriculture-specific) ---
  if (temp >= 35 && humidity >= 80) {
    alerts.push({
      title: `Crop Disease Risk Alert - ${capitalizedState}`,
      description: `Hot and humid conditions (${temp.toFixed(1)}°C, ${humidity}% humidity) near ${stateInfo.capital}. High risk of fungal infections in crops. Apply preventive fungicide sprays. Monitor paddy, cotton, and vegetable crops.`,
      severity: 'Medium',
      type: 'disease_risk',
      date: now.toISOString(),
    });
  }

  // --- ALERT: Current rain activity ---
  if (rain > 5 && total24hRain < 35) {
    alerts.push({
      title: `Ongoing Rainfall - ${capitalizedState}`,
      description: `Active rainfall of ${rain.toFixed(1)}mm/hr currently near ${stateInfo.capital}. Monitor field drainage. Delay pesticide application.`,
      severity: 'Low',
      type: 'rain',
      date: now.toISOString(),
    });
  }

  // --- WEATHER ADVISORY: Always provide current conditions summary ---
  // Determine the current month for seasonal context
  const month = now.getMonth(); // 0-11
  const isMonsoon = month >= 5 && month <= 9; // June-October
  const isWinter = month >= 10 || month <= 1; // November-February
  const isSummer = month >= 2 && month <= 4; // March-May

  // Generate seasonal advisory if no extreme alerts exist
  if (alerts.length === 0) {
    if (isMonsoon && total24hRain >= 7) {
      alerts.push({
        title: `Monsoon Rain Advisory - ${capitalizedState}`,
        description: `Monsoon rainfall of ${total24hRain.toFixed(1)}mm expected in next 24 hours near ${stateInfo.capital}. Temperature: ${temp.toFixed(1)}°C, Humidity: ${humidity}%. Ensure proper field drainage. Good conditions for Kharif sowing.`,
        severity: 'Low',
        type: 'rain',
        date: now.toISOString(),
      });
    } else if (isMonsoon && humidity >= 70) {
      alerts.push({
        title: `Monsoon Weather Update - ${capitalizedState}`,
        description: `High humidity (${humidity}%) with temperature ${temp.toFixed(1)}°C near ${stateInfo.capital}. Rain expected: ${total24hRain.toFixed(1)}mm in 24hrs. Wind: ${windSpeed.toFixed(0)} km/h. Monitor crops for moisture stress and fungal growth.`,
        severity: 'Low',
        type: 'advisory',
        date: now.toISOString(),
      });
    } else if (isSummer && temp >= 35) {
      alerts.push({
        title: `Summer Heat Advisory - ${capitalizedState}`,
        description: `High temperature of ${temp.toFixed(1)}°C near ${stateInfo.capital}. Humidity: ${humidity}%. Increase irrigation frequency. Best to farm during early morning and late evening hours.`,
        severity: 'Low',
        type: 'heatwave',
        date: now.toISOString(),
      });
    } else if (isWinter && minTemp <= 12) {
      alerts.push({
        title: `Winter Weather Advisory - ${capitalizedState}`,
        description: `Cool temperatures (min ${minTemp.toFixed(1)}°C) near ${stateInfo.capital}. Current: ${temp.toFixed(1)}°C, Humidity: ${humidity}%. Good conditions for Rabi crop growth. Monitor for frost if temperature drops further.`,
        severity: 'Low',
        type: 'coldwave',
        date: now.toISOString(),
      });
    } else {
      // General weather advisory — always show something
      alerts.push({
        title: `Weather Update - ${capitalizedState}`,
        description: `Current conditions near ${stateInfo.capital}: ${temp.toFixed(1)}°C, Humidity: ${humidity}%, Wind: ${windSpeed.toFixed(0)} km/h. Expected rain: ${total24hRain.toFixed(1)}mm in 24hrs. ${total24hRain > 0 ? 'Plan farm operations around rainfall.' : 'Favorable conditions for outdoor farming activities.'}`,
        severity: 'Low',
        type: 'advisory',
        date: now.toISOString(),
      });
    }
  }

  return alerts;
}

/**
 * GET /api/disaster/alerts
 * Fetches real-time weather-based disaster alerts using Open-Meteo API
 */
router.get('/alerts', async (req, res) => {
  try {
    const state = req.query.state?.toLowerCase() || 'maharashtra';

    if (!STATE_DATA[state]) {
      return res.status(400).json({
        success: false,
        error: `Invalid state: ${state}`,
        supportedStates: Object.keys(STATE_DATA)
      });
    }

    // Check cache
    const cached = alertCache[state];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log(`[DISASTER] Returning cached alerts for ${state} (${cached.alerts.length} alerts)`);
      return res.json({
        success: true,
        state,
        source: 'Open-Meteo (cached)',
        timestamp: new Date(cached.timestamp).toISOString(),
        alertCount: cached.alerts.length,
        alerts: cached.alerts
      });
    }

    const stateInfo = STATE_DATA[state];
    const { lat, lon } = stateInfo;

    console.log(`[DISASTER] Fetching weather for ${state} (${stateInfo.capital}: ${lat}, ${lon})`);

    // Fetch from Open-Meteo API
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m,wind_gusts_10m',
        hourly: 'temperature_2m,rain,weather_code,wind_gusts_10m',
        daily: 'temperature_2m_max,temperature_2m_min,rain_sum,wind_gusts_10m_max,weather_code',
        timezone: 'Asia/Kolkata',
        forecast_days: 3
      },
      timeout: 20000
    });

    const weatherData = response.data;
    const alerts = generateAlertsFromWeather(weatherData, state, stateInfo);

    // Cache the result
    alertCache[state] = { alerts, timestamp: Date.now() };

    console.log(`[DISASTER] Generated ${alerts.length} alerts for ${state}`);

    res.json({
      success: true,
      state,
      source: 'Open-Meteo',
      location: stateInfo.capital,
      timestamp: new Date().toISOString(),
      currentWeather: {
        temperature: weatherData.current?.temperature_2m,
        humidity: weatherData.current?.relative_humidity_2m,
        rain: weatherData.current?.rain,
        windSpeed: weatherData.current?.wind_speed_10m,
        weatherCode: weatherData.current?.weather_code
      },
      alertCount: alerts.length,
      alerts
    });

  } catch (error) {
    console.error('[DISASTER] Open-Meteo Error:', error.message);

    // Retry once with a fresh request (handles cold-start latency on free hosting)
    try {
      const stateInfo = STATE_DATA[req.query.state?.toLowerCase() || 'maharashtra'];
      const retryResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: stateInfo.lat,
          longitude: stateInfo.lon,
          current: 'temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m,wind_gusts_10m',
          hourly: 'temperature_2m,rain,weather_code,wind_gusts_10m',
          daily: 'temperature_2m_max,temperature_2m_min,rain_sum,wind_gusts_10m_max,weather_code',
          timezone: 'Asia/Kolkata',
          forecast_days: 3
        },
        timeout: 15000
      });
      const state = req.query.state?.toLowerCase() || 'maharashtra';
      const retryAlerts = generateAlertsFromWeather(retryResponse.data, state, stateInfo);
      alertCache[state] = { alerts: retryAlerts, timestamp: Date.now() };
      console.log(`[DISASTER] Retry succeeded: ${retryAlerts.length} alerts for ${state}`);
      return res.json({
        success: true,
        state,
        source: 'Open-Meteo (retry)',
        location: stateInfo.capital,
        timestamp: new Date().toISOString(),
        alertCount: retryAlerts.length,
        alerts: retryAlerts
      });
    } catch (retryError) {
      console.error('[DISASTER] Retry also failed:', retryError.message);
    }

    res.status(200).json({
      success: true,
      state: req.query.state?.toLowerCase() || 'maharashtra',
      source: 'Open-Meteo',
      timestamp: new Date().toISOString(),
      alertCount: 0,
      alerts: [],
      notice: 'Weather service temporarily unavailable. Will retry automatically.'
    });
  }
});

/**
 * GET /api/disaster/supported-states
 */
router.get('/supported-states', (req, res) => {
  res.json({
    success: true,
    supportedStates: Object.keys(STATE_DATA),
    description: 'Real-time weather-based disaster alerts via Open-Meteo API (free, no key required)'
  });
});

/**
 * GET /api/disaster/health
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Disaster Alerts',
    status: 'operational',
    source: 'Open-Meteo Weather API',
    supportedStates: Object.keys(STATE_DATA),
    endpoint: '/api/disaster/alerts',
    cacheInfo: {
      ttl: `${CACHE_TTL / 1000}s`,
      cachedStates: Object.keys(alertCache).length
    }
  });
});

export default router;
