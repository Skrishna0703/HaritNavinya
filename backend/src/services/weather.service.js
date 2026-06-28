import axios from 'axios';

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

// ─── WMO / OWM icon → condition text ────────────────────────────────────────
function owmCondition(icon = '', description = '') {
  // Use the OWM description directly (already in English)
  if (!description) return 'Unknown';
  return description.charAt(0).toUpperCase() + description.slice(1);
}

// ─── Safe number helper ───────────────────────────────────────────────────────
function n(v, fallback = 0) {
  const num = parseFloat(v);
  return isNaN(num) ? fallback : num;
}

// ─── Unix timestamp → "6:15 AM" format ───────────────────────────────────────
function unixToTime(unix, tzOffsetSec = 0) {
  const date = new Date((unix + tzOffsetSec) * 1000);
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ─── Unix timestamp → "Jun 28" format ────────────────────────────────────────
function unixToDate(unix, tzOffsetSec = 0) {
  const date = new Date((unix + tzOffsetSec) * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

// ─── Unix timestamp → "12 PM" hour label ─────────────────────────────────────
function unixToHourLabel(unix, tzOffsetSec = 0) {
  const date = new Date((unix + tzOffsetSec) * 1000);
  const h = date.getUTCHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:00 ${ampm}`;
}

// ─── Generate farming advice from weather data ────────────────────────────────
function buildFarmingAdvice(current, daily5) {
  const advice = [];

  // Rainfall check across next 5 days
  const rainyDays = daily5.filter(d => n(d.rain) > 5 || d.rainProbability >= 60);
  if (rainyDays.length > 0) {
    advice.push({
      icon: 'Umbrella',
      title: 'Postpone Spraying',
      description: 'Avoid pesticide/fertilizer spraying due to expected rainfall',
      priority: 'High'
    });
    advice.push({
      icon: 'Droplets',
      title: 'Check Drainage',
      description: 'Ensure proper drainage systems are clear to prevent waterlogging',
      priority: 'High'
    });
  }

  // Wind
  if (n(current.windSpeed) > 20) {
    advice.push({
      icon: 'Wind',
      title: 'Secure Equipment',
      description: 'Strong winds possible. Secure farm equipment and temporary structures',
      priority: 'Medium'
    });
  }

  // Heat
  if (n(current.temperature) > 38) {
    advice.push({
      icon: 'Thermometer',
      title: 'Increase Irrigation',
      description: 'High temperatures expected. Increase irrigation frequency and water crops in early morning/evening',
      priority: 'High'
    });
  }

  // Low humidity
  if (n(current.humidity) < 30) {
    advice.push({
      icon: 'Droplets',
      title: 'Monitor Soil Moisture',
      description: 'Low humidity detected. Check soil moisture and increase watering frequency',
      priority: 'Medium'
    });
  }

  // Fallback
  if (advice.length === 0) {
    advice.push({
      icon: 'Calendar',
      title: 'Plan Operations',
      description: 'Weather looks stable for near-term farming activities',
      priority: 'Low'
    });
  }

  return advice;
}

// ─── Main fetch function ──────────────────────────────────────────────────────
async function fetchWeatherByCoords(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not set in environment variables');
  }

  const commonParams = {
    lat,
    lon,
    appid: apiKey,
    units: 'metric'   // Celsius, km/h
  };

  // Fetch current weather + 5-day/3-hour forecast in parallel
  const [currentRes, forecastRes] = await Promise.all([
    axios.get(`${OWM_BASE}/weather`, { params: commonParams, timeout: 15000 }),
    axios.get(`${OWM_BASE}/forecast`, { params: { ...commonParams, cnt: 40 }, timeout: 15000 })
  ]);

  const cw = currentRes.data;          // current weather object
  const fc = forecastRes.data;         // forecast object { list: [...], city: {...} }
  const tzOffset = n(cw.timezone, 0);  // timezone offset in seconds

  // ── Current Weather ──────────────────────────────────────────────────────
  const currentWeather = {
    temperature:  Math.round(n(cw.main?.temp)),
    feelsLike:    Math.round(n(cw.main?.feels_like)),
    condition:    owmCondition(cw.weather?.[0]?.icon, cw.weather?.[0]?.description),
    humidity:     n(cw.main?.humidity),
    windSpeed:    Math.round(n(cw.wind?.speed) * 3.6),   // m/s → km/h
    pressure:     n(cw.main?.pressure, 1013),
    visibility:   Math.round(n(cw.visibility, 10000) / 1000),  // m → km
    uvIndex:      0,   // OWM free tier doesn't include UV index
    sunrise:      unixToTime(n(cw.sys?.sunrise), tzOffset),
    sunset:       unixToTime(n(cw.sys?.sunset), tzOffset),
    location:     cw.name || 'Current Location',
    icon:         cw.weather?.[0]?.icon || '01d'
  };

  // ── Hourly Forecast (next 24 hours → 8 slots × 3h) ───────────────────────
  const next8 = (fc.list || []).slice(0, 8);
  const hourlyForecast = next8.map(slot => ({
    time:            unixToHourLabel(slot.dt, tzOffset),
    temp:            Math.round(n(slot.main?.temp)),
    rainProbability: Math.round(n(slot.pop) * 100),        // 0–1 → 0–100%
    weather:         owmCondition(slot.weather?.[0]?.icon, slot.weather?.[0]?.description),
    icon:            slot.weather?.[0]?.icon || '01d'
  }));

  // ── Daily Forecast (group 3h slots by date, max 7 days) ──────────────────
  const dayMap = {};
  for (const slot of (fc.list || [])) {
    const dateKey = unixToDate(slot.dt, tzOffset);
    if (!dayMap[dateKey]) {
      dayMap[dateKey] = {
        date: dateKey,
        temps: [],
        rain: 0,
        pops: [],
        conditions: [],
        icons: []
      };
    }
    dayMap[dateKey].temps.push(n(slot.main?.temp));
    dayMap[dateKey].rain += n(slot.rain?.['3h'], 0);
    dayMap[dateKey].pops.push(n(slot.pop, 0));
    dayMap[dateKey].conditions.push(slot.weather?.[0]?.description || '');
    dayMap[dateKey].icons.push(slot.weather?.[0]?.icon || '01d');
  }

  const weeklyForecast = Object.values(dayMap).slice(0, 7).map(day => {
    const maxTemp = Math.round(Math.max(...day.temps));
    const minTemp = Math.round(Math.min(...day.temps));
    const avgTemp = Math.round(day.temps.reduce((s, v) => s + v, 0) / day.temps.length);
    const maxPop  = Math.round(Math.max(...day.pops) * 100);
    // Pick most common condition
    const condCount = {};
    day.conditions.forEach(c => { condCount[c] = (condCount[c] || 0) + 1; });
    const topCond = Object.entries(condCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const topIcon = day.icons[0] || '01d';

    return {
      date:            day.date,
      temp:            avgTemp,
      minTemp,
      maxTemp,
      condition:       owmCondition(topIcon, topCond),
      rain:            Math.round(day.rain * 10) / 10,
      rainProbability: maxPop,
      windSpeed:       Math.round(n(currentWeather.windSpeed)),
      humidity:        n(currentWeather.humidity)
    };
  });

  // ── Rainfall Chart Data (15 day slots from forecast + extrapolated) ────────
  const rainfallData = Object.values(dayMap).slice(0, 7).map(day => ({
    date:        day.date,
    rainfall:    Math.round(day.rain * 10) / 10,
    temperature: Math.round(day.temps.reduce((s, v) => s + v, 0) / day.temps.length)
  }));

  // Pad to 15 days with linear-ish extrapolation if needed
  if (rainfallData.length < 15) {
    const lastDate = new Date();
    for (let i = rainfallData.length; i < 15; i++) {
      lastDate.setDate(lastDate.getDate() + 1);
      rainfallData.push({
        date:        lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rainfall:    0,
        temperature: currentWeather.temperature
      });
    }
  }

  // ── Weather Alerts (from OWM precipitation data) ─────────────────────────
  const weatherAlerts = [];
  for (const slot of next8) {
    const rain3h = n(slot.rain?.['3h'], 0);
    const temp   = n(slot.main?.temp);
    const wind   = n(slot.wind?.speed) * 3.6;   // km/h
    const time   = unixToHourLabel(slot.dt, tzOffset);

    if (rain3h > 25) {
      weatherAlerts.push({ type: 'Heavy Rain',    severity: 'Red',    recommendation: 'Avoid fertilizer spraying', time });
    } else if (rain3h > 10) {
      weatherAlerts.push({ type: 'Moderate Rain', severity: 'Orange', recommendation: 'Delay pesticide spraying',  time });
    } else if (rain3h > 3) {
      weatherAlerts.push({ type: 'Light Rain',    severity: 'Yellow', recommendation: 'Monitor crop conditions',   time });
    }
    if (temp > 38) {
      weatherAlerts.push({ type: 'Heatwave',      severity: 'Orange', recommendation: 'Increase irrigation',       time });
    }
    if (wind > 40) {
      weatherAlerts.push({ type: 'Strong Wind',   severity: 'Yellow', recommendation: 'Protect crops from wind',   time });
    }
  }

  // ── Farming Advice ────────────────────────────────────────────────────────
  const farmingAdvice = buildFarmingAdvice(currentWeather, weeklyForecast);

  return {
    success:        true,
    currentWeather,
    hourlyForecast,
    weeklyForecast,
    rainfallData,
    weatherAlerts,
    farmingAdvice,
    provider:       'OpenWeatherMap',
    lastUpdated:    new Date().toISOString()
  };
}

export { fetchWeatherByCoords };
