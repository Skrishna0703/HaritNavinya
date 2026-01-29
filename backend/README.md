# HaritNavinya — Weather Backend

This Express backend provides weather data from OpenWeather API (2.5 - Free tier).
It exposes:

GET /api/weather?lat=LAT&lon=LON

Response JSON contains:
- currentWeather (temperature, condition, humidity, wind, visibility, pressure, etc.)
- hourlyForecast (8 x 3-hour intervals)
- weeklyForecast (5-7 days)
- rainfallData (daily rainfall amounts)
- weatherAlerts (empty for 2.5 API, can be populated from other sources)
- farmingAdvice (generated based on weather conditions)

## Setup

1. Copy `.env` and set your OpenWeather API key:

   OPENWEATHER_API_KEY=your_openweather_api_key_here
   PORT=5000

   You can get a free API key from: https://openweathermap.org/api

2. Install dependencies and run in dev:

   npm install
   npm run dev

The server will start on the port from `.env` (default 5000).

## API Usage

Example request:
```
GET http://localhost:5000/api/weather?lat=18.5204&lon=73.8567
```

Example response (partial):
```json
{
  "currentWeather": {
    "temperature": 24.07,
    "condition": "few clouds",
    "humidity": 72,
    "windSpeed": 1.4,
    "visibility": 10,
    "pressure": 1016
  },
  "hourlyForecast": [...],
  "weeklyForecast": [...],
  "farmingAdvice": [...]
}
```

## Notes
- Uses OpenWeather API 2.5 (free tier) with `/weather` and `/forecast` endpoints
- Make sure your API key is valid and enabled
- The service returns cleaned and normalized data suitable for the frontend

