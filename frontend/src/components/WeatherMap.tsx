import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';

interface WeatherMapProps {
  lat: number;
  lon: number;
  apiKey?: string;
  mapType?: 'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure';
}

// Fix for Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function WeatherMap({ lat, lon, apiKey, mapType = 'temperature' }: WeatherMapProps) {
  const [selectedLayer, setSelectedLayer] = useState<'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure'>(mapType);

  // ✅ Primary weather data source: Open-Meteo (backend /api/weather endpoint)
  // Optional: OpenWeatherMap API key for advanced map visualization layers
  const owmApiKey = apiKey || import.meta.env.VITE_OPENWEATHER_API_KEY;
  const hasMapTiles = owmApiKey && owmApiKey !== 'YOUR_API_KEY';

  // OpenWeatherMap tile URLs for different layers (optional enhancement)
  const layerUrls = hasMapTiles ? {
    temperature: `https://tile.openweathermap.org/data/temp_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    precipitation: `https://tile.openweathermap.org/data/precipitation_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    wind: `https://tile.openweathermap.org/data/wind_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    clouds: `https://tile.openweathermap.org/data/clouds_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    pressure: `https://tile.openweathermap.org/data/pressure_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
  } : {};

  const layerLabels = {
    temperature: '🌡️ Temperature',
    precipitation: '🌧️ Precipitation',
    wind: '💨 Wind Speed',
    clouds: '☁️ Cloud Coverage',
    pressure: '🔵 Pressure',
  };

  // Legend data for each layer
  const legendData = {
    temperature: [
      { label: 'Cold', color: 'bg-blue-600' },
      { label: 'Cool', color: 'bg-cyan-500' },
      { label: 'Mild', color: 'bg-green-500' },
      { label: 'Warm', color: 'bg-yellow-500' },
      { label: 'Hot', color: 'bg-red-600' }
    ],
    precipitation: [
      { label: 'Light', color: 'bg-yellow-300' },
      { label: 'Moderate', color: 'bg-blue-400' },
      { label: 'Heavy', color: 'bg-blue-600' },
      { label: 'Very Heavy', color: 'bg-purple-600' }
    ],
    wind: [
      { label: 'Calm', color: 'bg-cyan-300' },
      { label: 'Moderate', color: 'bg-yellow-400' },
      { label: 'Strong', color: 'bg-orange-500' },
      { label: 'Very Strong', color: 'bg-red-600' }
    ],
    clouds: [
      { label: 'Clear', color: 'bg-blue-300' },
      { label: 'Cloudy', color: 'bg-gray-400' },
      { label: 'Overcast', color: 'bg-gray-600' }
    ],
    pressure: [
      { label: 'Low', color: 'bg-purple-600' },
      { label: 'Normal', color: 'bg-green-500' },
      { label: 'High', color: 'bg-red-600' }
    ]
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Layer Selector */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100"
          >
            <motion.h3 
              className="text-xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              🗺️ Interactive Weather Map
            </motion.h3>
            {hasMapTiles ? (
              <div className="flex flex-wrap gap-2">
                {(Object.keys(layerLabels) as Array<keyof typeof layerLabels>).map((layer, index) => (
                  <motion.button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLayer === layer
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {layerLabels[layer]}
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                ℹ️ Weather data is provided by <strong>Open-Meteo</strong>. 
                Add an OpenWeatherMap API key to enable advanced map visualization layers.
              </p>
            )}
          </motion.div>

          {/* Map Container */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-96 md:h-[500px]"
          >
            <MapContainer
              center={[lat, lon]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              className="z-10"
            >
              {/* Base Layer - OpenStreetMap */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />

              {/* Weather Overlay Layer - Only if API key available */}
              {hasMapTiles && (
                <motion.div
                  key={selectedLayer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TileLayer
                    url={layerUrls[selectedLayer]}
                    attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                    maxZoom={19}
                    opacity={0.7}
                  />
                </motion.div>
              )}

              {/* User Location Marker with Spring Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
              >
                <Marker position={[lat, lon]}>
                  <Popup>
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.p 
                        className="font-bold text-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📍 Your Location
                      </motion.p>
                      <p className="text-sm text-gray-600">
                        {lat.toFixed(4)}°, {lon.toFixed(4)}°
                      </p>
                    </motion.div>
                  </Popup>
                </Marker>
              </motion.div>
            </MapContainer>

            {/* API Key Warning - Optional Enhancement */}
            {!hasMapTiles && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-4 left-4 z-20 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-2 rounded-lg text-sm"
              >
                ℹ️ Weather data from <strong>Open-Meteo</strong> | Add VITE_OPENWEATHER_API_KEY for map visualization
              </motion.div>
            )}
          </motion.div>

          {/* Legend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 bg-gray-50 border-t border-gray-200"
          >
            <motion.h4 
              className="font-bold text-gray-700 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              📊 Legend
            </motion.h4>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {legendData[selectedLayer].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-white transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                  whileHover={{ translateX: 4 }}
                >
                  <motion.div 
                    className={`w-4 h-4 ${item.color} rounded flex-shrink-0`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                  ></motion.div>
                  <span className="text-gray-700">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="px-6 pb-6"
          >
            <p className="text-xs text-gray-500">
              💡 Tip: Click on the map to view detailed weather data. The colored overlay shows {layerLabels[selectedLayer].toLowerCase()} across the region.
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
