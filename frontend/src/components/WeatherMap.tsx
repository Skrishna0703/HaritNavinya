import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from './ui/card';

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

  // OpenWeatherMap API key from environment (if provided) or from props
  const owmApiKey = apiKey || import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY';

  // OpenWeatherMap tile URLs for different layers
  const layerUrls = {
    temperature: `https://tile.openweathermap.org/data/temp_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    precipitation: `https://tile.openweathermap.org/data/precipitation_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    wind: `https://tile.openweathermap.org/data/wind_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    clouds: `https://tile.openweathermap.org/data/clouds_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
    pressure: `https://tile.openweathermap.org/data/pressure_new/{z}/{x}/{y}.png?appid=${owmApiKey}`,
  };

  const layerLabels = {
    temperature: '🌡️ Temperature',
    precipitation: '🌧️ Precipitation',
    wind: '💨 Wind Speed',
    clouds: '☁️ Cloud Coverage',
    pressure: '🔵 Pressure',
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Layer Selector */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🗺️ Interactive Weather Map</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(layerLabels) as Array<keyof typeof layerLabels>).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedLayer === layer
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {layerLabels[layer]}
                </button>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-96 md:h-[500px]">
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

              {/* Weather Overlay Layer */}
              <TileLayer
                url={layerUrls[selectedLayer]}
                attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                maxZoom={19}
                opacity={0.7}
              />

              {/* User Location Marker */}
              <Marker position={[lat, lon]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">📍 Your Location</p>
                    <p className="text-sm text-gray-600">
                      {lat.toFixed(4)}°, {lon.toFixed(4)}°
                    </p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* API Key Warning */}
            {owmApiKey === 'YOUR_API_KEY' && (
              <div className="absolute top-4 left-4 z-20 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                ⚠️ Add VITE_OPENWEATHER_API_KEY to .env
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3">📊 Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {selectedLayer === 'temperature' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Cold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                    <span>Cool</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Mild</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Warm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Hot</span>
                  </div>
                </>
              )}
              {selectedLayer === 'precipitation' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span>Light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Heavy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span>Very Heavy</span>
                  </div>
                </>
              )}
              {selectedLayer === 'wind' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-300 rounded"></div>
                    <span>Calm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Strong</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Very Strong</span>
                  </div>
                </>
              )}
              {selectedLayer === 'clouds' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    <span>Clear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Cloudy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span>Overcast</span>
                  </div>
                </>
              )}
              {selectedLayer === 'pressure' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>High</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500">
              💡 Tip: Click on the map to view detailed weather data. The colored overlay shows {layerLabels[selectedLayer].toLowerCase()} across the region.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
