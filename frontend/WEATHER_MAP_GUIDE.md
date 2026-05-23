# Weather Map Integration Guide

## Overview

The Weather Forecast component now includes an **interactive weather map** displaying real-time weather data from **OpenWeatherMap API**. The map shows multiple weather layers including temperature, precipitation, wind speed, cloud coverage, and atmospheric pressure.

## Features

✅ **Interactive Weather Map** - Display weather conditions on a geographic map
✅ **Multiple Weather Layers** - Toggle between:
   - 🌡️ Temperature visualization
   - 🌧️ Precipitation patterns
   - 💨 Wind speed overlay
   - ☁️ Cloud coverage
   - 🔵 Atmospheric pressure

✅ **User Location Marker** - Shows your current location on the map
✅ **Dynamic Legend** - Context-aware legend based on selected layer
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Setup

### 1. Get OpenWeatherMap API Key

1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Get your free API key from the dashboard
4. Note: Free tier includes historical weather data and map overlays

### 2. Configure Environment Variables

**Frontend (.env or .env.local):**
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**Backend (.env):**
```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Install Dependencies

Dependencies are already included in your project:
- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet

If missing, install:
```bash
npm install leaflet react-leaflet
```

## Usage

The map is automatically displayed in the WeatherForecast component:

```tsx
import { WeatherMap } from './WeatherMap';

<WeatherMap 
  lat={latitude}
  lon={longitude}
  apiKey={process.env.VITE_OPENWEATHER_API_KEY}
  mapType="temperature"
/>
```

### Props

```typescript
interface WeatherMapProps {
  lat: number;              // Latitude coordinate
  lon: number;              // Longitude coordinate
  apiKey?: string;          // OpenWeatherMap API key
  mapType?: 'temperature'   // Default map type
           | 'precipitation'
           | 'wind'
           | 'clouds'
           | 'pressure';
}
```

## Weather Layers

### Temperature Layer (🌡️)
- **Blue** → Cold temperatures
- **Cyan** → Cool
- **Green** → Mild
- **Yellow** → Warm
- **Red** → Hot

### Precipitation Layer (🌧️)
- **Yellow** → Light rainfall
- **Light Blue** → Moderate rainfall
- **Dark Blue** → Heavy rainfall
- **Purple** → Very heavy rainfall

### Wind Speed Layer (💨)
- **Cyan** → Calm winds
- **Yellow** → Moderate wind
- **Orange** → Strong wind
- **Red** → Very strong wind

### Cloud Coverage Layer (☁️)
- **Light Blue** → Clear skies
- **Medium Gray** → Cloudy
- **Dark Gray** → Overcast

### Pressure Layer (🔵)
- **Purple** → Low pressure
- **Green** → Normal pressure
- **Red** → High pressure

## API Endpoints Used

The map uses OpenWeatherMap tile layers:

```
Temperature:  https://tile.openweathermap.org/data/temp_new/{z}/{x}/{y}.png
Precipitation: https://tile.openweathermap.org/data/precipitation_new/{z}/{x}/{y}.png
Wind: https://tile.openweathermap.org/data/wind_new/{z}/{x}/{y}.png
Clouds: https://tile.openweathermap.org/data/clouds_new/{z}/{x}/{y}.png
Pressure: https://tile.openweathermap.org/data/pressure_new/{z}/{x}/{y}.png
```

## Troubleshooting

### Map Not Displaying

**Issue:** Map appears blank or tiles won't load

**Solutions:**
1. Verify API key is correct
2. Check if API key has sufficient permissions (free tier supports maps)
3. Ensure `VITE_OPENWEATHER_API_KEY` environment variable is set
4. Clear browser cache and reload
5. Check browser console for errors

### Tiles Not Loading

**Issue:** Map shows base layer but weather overlay is missing

**Solutions:**
1. API key might not be configured
2. Network connectivity issue
3. OpenWeatherMap service temporarily unavailable
4. Try a different map layer (they may have different availability)

### Performance Issues

**Issue:** Map is slow or laggy

**Solutions:**
1. Reduce map zoom level
2. Disable animations if not needed
3. Use production build instead of development
4. Update to latest version of leaflet

## Development

### Component Structure

```
WeatherMap.tsx
├── Map Container (Leaflet)
├── Tile Layers
│   ├── Base Layer (OpenStreetMap)
│   └── Weather Overlay (OpenWeatherMap)
├── User Marker
├── Layer Selector
└── Legend
```

### Customization

To modify the weather layers, edit `WeatherMap.tsx`:

```typescript
const layerUrls = {
  temperature: `https://tile.openweathermap.org/data/temp_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
  // Add more layers here
};

const layerLabels = {
  temperature: '🌡️ Temperature',
  // Add corresponding labels
};
```

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Map is rendered only when location data is available
- Tiles are cached by browser for better performance
- Recommended zoom level: 4-8 for regional view
- Free tier has rate limits (60 requests/minute)

## Future Enhancements

Potential improvements:
- [ ] Multi-layer overlay support
- [ ] Historical weather data timeline
- [ ] Weather alerts on map
- [ ] Custom region selection
- [ ] Export map as image
- [ ] Weather station markers
- [ ] Satellite imagery option

## Resources

- [OpenWeatherMap Documentation](https://openweathermap.org/api)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet Guide](https://react-leaflet.js.org/)

## Support

For issues or questions:
1. Check OpenWeatherMap API status: https://status.openweathermap.org/
2. Review API documentation: https://openweathermap.org/api
3. Check browser console for errors
4. Verify API key permissions
