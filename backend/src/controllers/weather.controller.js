import axios from 'axios';

const getWeatherAlerts = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'lat and lon query parameters are required'
      });
    }

    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly:
            'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_temperature_0cm',
          forecast_days: 1
        }
      }
    );

    const data = response.data;
    const hourly = data.hourly;
    let alerts = [];

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

    res.json({
      success: true,
      current: data.current_weather,
      alerts,
      hourly
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data'
    });
  }
};

export { getWeatherAlerts };
