import express from 'express';

const router = express.Router();

// Sample weather data for Indian locations
const weatherDatabase = {
  'maharashtra': {
    temperature: 28,
    feelsLike: 26,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    uvIndex: 6,
    rainfall: 2.5
  },
  'tamil-nadu': {
    temperature: 32,
    feelsLike: 30,
    condition: 'Sunny',
    humidity: 55,
    windSpeed: 15,
    visibility: 12,
    pressure: 1012,
    uvIndex: 8,
    rainfall: 0
  },
  'kerala': {
    temperature: 26,
    feelsLike: 24,
    condition: 'Rainy',
    humidity: 80,
    windSpeed: 18,
    visibility: 8,
    pressure: 1011,
    uvIndex: 3,
    rainfall: 25
  },
  'delhi': {
    temperature: 22,
    feelsLike: 20,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 8,
    visibility: 15,
    pressure: 1015,
    uvIndex: 5,
    rainfall: 0
  },
  'rajasthan': {
    temperature: 35,
    feelsLike: 33,
    condition: 'Hot & Clear',
    humidity: 30,
    windSpeed: 20,
    visibility: 20,
    pressure: 1010,
    uvIndex: 9,
    rainfall: 0
  }
};

// Generate dynamic weekly forecast starting from today
function generateWeeklyForecast() {
  const today = new Date();
  const template = [
    { high: 32, low: 22, condition: 'Sunny', rainProbability: 0, temp: 28 },
    { high: 31, low: 21, condition: 'Sunny', rainProbability: 5, temp: 27 },
    { high: 29, low: 20, condition: 'Partly Cloudy', rainProbability: 20, temp: 25 },
    { high: 28, low: 19, condition: 'Rainy', rainProbability: 80, temp: 23 },
    { high: 27, low: 18, condition: 'Rainy', rainProbability: 70, temp: 22 },
    { high: 30, low: 20, condition: 'Sunny', rainProbability: 10, temp: 26 },
    { high: 33, low: 23, condition: 'Sunny', rainProbability: 0, temp: 29 }
  ];
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return template.map((item, idx) => {
    const forecastDate = new Date(today);
    forecastDate.setDate(forecastDate.getDate() + idx);
    const dateStr = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStr = days[forecastDate.getDay()];
    return {
      day: dayStr,
      date: dateStr,
      ...item
    };
  });
}

// Generate dynamic rainfall forecast starting from today
function generateRainfallForecast() {
  const today = new Date();
  const template = [0, 2, 5, 45, 38, 8, 0, 2, 12, 25, 15, 3, 0, 0, 5];
  
  return template.map((rainfall, idx) => {
    const forecastDate = new Date(today);
    forecastDate.setDate(forecastDate.getDate() + idx);
    const dateStr = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { date: dateStr, rainfall };
  });
}

// Weekly forecast template
const weeklyForecastTemplate = generateWeeklyForecast();

// Hourly forecast template
const hourlyForecastTemplate = [
  { time: '12:00 PM', temp: 28, rainProbability: 0, weather: 'Sunny' },
  { time: '01:00 PM', temp: 29, rainProbability: 0, weather: 'Sunny' },
  { time: '02:00 PM', temp: 30, rainProbability: 5, weather: 'Partly Cloudy' },
  { time: '03:00 PM', temp: 30, rainProbability: 10, weather: 'Partly Cloudy' },
  { time: '04:00 PM', temp: 28, rainProbability: 20, weather: 'Cloudy' },
  { time: '05:00 PM', temp: 26, rainProbability: 15, weather: 'Cloudy' },
  { time: '06:00 PM', temp: 25, rainProbability: 5, weather: 'Partly Cloudy' },
  { time: '07:00 PM', temp: 23, rainProbability: 0, weather: 'Clear' }
];

// 15-day rainfall forecast
const rainfallForecastTemplate = generateRainfallForecast();

// Weather alerts
const weatherAlertsTemplate = [
  {
    event: 'Heavy Rainfall',
    type: 'RAINFALL_WARNING',
    severity: 'High',
    description: 'Heavy to very heavy rainfall expected in next 48 hours. Accumulation may exceed 100mm.',
    sender: 'India Meteorological Department',
    start: Date.now() / 1000,
    end: (Date.now() + 48 * 60 * 60 * 1000) / 1000,
    color: 'from-blue-500 to-blue-600'
  },
  {
    event: 'Heat Wave',
    type: 'HEAT_ALERT',
    severity: 'Medium',
    description: 'Temperature expected to rise above 40°C. Stay hydrated and avoid outdoor work during peak hours.',
    sender: 'India Meteorological Department',
    start: Date.now() / 1000,
    end: (Date.now() + 24 * 60 * 60 * 1000) / 1000,
    color: 'from-red-500 to-orange-600'
  }
];

// Farming advice based on weather
const farmingAdviceTemplate = [
  {
    title: 'Irrigation Scheduling',
    description: 'Reduce irrigation by 30% due to expected rainfall in next 48 hours. Monitor soil moisture levels.',
    priority: 'High',
    icon: 'CloudRain'
  },
  {
    title: 'Pesticide Application',
    description: 'Hold off on pesticide spraying until after rainfall. Apply 24-48 hours after rain stops.',
    priority: 'High',
    icon: 'Umbrella'
  },
  {
    title: 'Harvest Planning',
    description: 'Accelerate harvesting for ready crops. Weather will improve by weekend for field operations.',
    priority: 'Medium',
    icon: 'TrendingUp'
  },
  {
    title: 'Soil Preparation',
    description: 'Prepare beds for post-monsoon planting. Expected moisture will be beneficial for germination.',
    priority: 'Medium',
    icon: 'Cloud'
  }
];

// GET weather by coordinates
router.get('/api/weather', (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: 'Missing latitude or longitude parameters'
    });
  }

  // Determine region based on coordinates (simplified)
  let region = 'maharashtra'; // default
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  // Simple region detection based on coordinates
  if (latitude > 28 && longitude > 77) region = 'delhi';
  else if (latitude > 26 && latitude < 28) region = 'rajasthan';
  else if (latitude > 11 && latitude < 13) region = 'tamil-nadu';
  else if (latitude > 8 && latitude < 12 && longitude > 74) region = 'kerala';
  else if (latitude > 19 && latitude < 21) region = 'maharashtra';

  const currentWeather = weatherDatabase[region] || weatherDatabase['maharashtra'];

  res.json({
    success: true,
    location: {
      latitude,
      longitude,
      region: region.toUpperCase()
    },
    currentWeather,
    weeklyForecast: weeklyForecastTemplate,
    hourlyForecast: hourlyForecastTemplate,
    rainfallData: rainfallForecastTemplate,
    weatherAlerts: weatherAlertsTemplate,
    farmingAdvice: farmingAdviceTemplate,
    timestamp: new Date().toISOString()
  });
});

// GET weather for specific region
router.get('/api/weather/region/:name', (req, res) => {
  const { name } = req.params;
  const regionKey = name.toLowerCase().replace(/\s+/g, '-');
  const currentWeather = weatherDatabase[regionKey] || weatherDatabase['maharashtra'];

  res.json({
    success: true,
    region: name,
    currentWeather,
    weeklyForecast: weeklyForecastTemplate,
    hourlyForecast: hourlyForecastTemplate,
    rainfallData: rainfallForecastTemplate,
    weatherAlerts: weatherAlertsTemplate,
    farmingAdvice: farmingAdviceTemplate,
    timestamp: new Date().toISOString()
  });
});

export { router as weatherRouter };
