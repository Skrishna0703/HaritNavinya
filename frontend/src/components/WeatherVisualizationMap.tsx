import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  CloudRain, 
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface WeatherMapProps {
  onBack: () => void;
}

export function WeatherVisualizationMap({ onBack }: WeatherMapProps) {
  const [selectedParameter, setSelectedParameter] = useState<'temperature' | 'pressure' | 'wind' | 'precipitation' | 'humidity' | 'clouds'>('temperature');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [latLon, setLatLon] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const API_BASE = import.meta.env.PROD ? 'https://haritnavinya.onrender.com' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

  // Mock rainfall forecast data
  const rainfallForecast = [
    { date: 'Today', probability: 20, amount: '0-2mm' },
    { date: 'Tomorrow', probability: 45, amount: '5-10mm' },
    { date: 'Day 3', probability: 65, amount: '10-15mm' },
    { date: 'Day 4', probability: 35, amount: '2-5mm' },
    { date: 'Day 5', probability: 15, amount: '0-2mm' },
  ];

  useEffect(() => {
    // Request user location
    if (!navigator.geolocation) {
      const fallback = { lat: 18.5204, lon: 73.8567 };
      setLatLon(fallback);
      fetchWeather(fallback.lat, fallback.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLatLon(coords);
        fetchWeather(coords.lat, coords.lon);
      },
      (err) => {
        console.warn('Geolocation failed, using fallback');
        const fallback = { lat: 18.5204, lon: 73.8567 };
        setLatLon(fallback);
        fetchWeather(fallback.lat, fallback.lon);
      }
    );

    // Update time every minute
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function fetchWeather(lat: number, lon: number) {
    try {
      const url = `${API_BASE}/api/weather?lat=${lat}&lon=${lon}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCurrentWeather(data.currentWeather || {
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          pressure: 1013,
          visibility: 10,
          feelsLike: 30
        });
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setCurrentWeather({
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        visibility: 10,
        feelsLike: 30
      });
    } finally {
      setLoading(false);
    }
  }

  const parameters = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#ef4444' },
    { id: 'pressure', label: 'Pressure', icon: Gauge, color: '#3b82f6' },
    { id: 'wind', label: 'Wind speed', icon: Wind, color: '#8b5cf6' },
    { id: 'precipitation', label: 'Precipitation', icon: CloudRain, color: '#06b6d4' },
    { id: 'humidity', label: 'Humidity', icon: Droplets, color: '#3b82f6' },
    { id: 'clouds', label: 'Clouds', icon: Cloud, color: '#6b7280' },
  ];

  const mapCenter: LatLngExpression = latLon ? [latLon.lat, latLon.lon] : [20, 78];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-white">Weather & Rainfall Forecast</h1>
            </div>
            <div className="text-white/70 text-sm">
              {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto h-[calc(100vh-80px)]">
        
        {/* Left Sidebar - Parameters */}
        <motion.div 
          className="lg:col-span-2 space-y-2 overflow-y-auto"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {parameters.map((param, index) => {
            const IconComponent = param.icon;
            const isSelected = selectedParameter === param.id;
            return (
              <motion.button
                key={param.id}
                onClick={() => setSelectedParameter(param.id as any)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, translateX: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">{param.label}</span>
              </motion.button>
            );
          })}

          {/* Wind Particles Toggle */}
          <motion.div 
            className="bg-white/10 rounded-lg p-3 border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Wind particles</span>
              <motion.div 
                className="w-8 h-5 bg-white/20 rounded-full cursor-pointer relative"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Center - Map Visualization */}
        <motion.div 
          className="lg:col-span-8 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <motion.div 
              className="w-full h-full flex items-center justify-center bg-blue-800"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-white text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Cloud className="w-12 h-12 mx-auto mb-4" />
                </motion.div>
                <p className="font-medium">Loading weather data...</p>
              </div>
            </motion.div>
          ) : latLon ? (
            <MapContainer center={mapCenter} zoom={5} className="w-full h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {latLon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                >
                  <Marker position={[latLon.lat, latLon.lon]}>
                    <Popup>
                      <motion.div 
                        className="font-medium"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Your Location
                      </motion.div>
                      <div className="text-sm">{latLon.lat.toFixed(4)}°, {latLon.lon.toFixed(4)}°</div>
                    </Popup>
                  </Marker>
                </motion.div>
              )}
            </MapContainer>
          ) : null}

          {/* Weather Legend */}
          <motion.div 
            className="absolute bottom-4 left-4 bg-black/40 backdrop-blur text-white px-4 py-2 rounded-lg text-xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="text-center">
              <motion.span 
                className="text-orange-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ━━━━━ 20°C
              </motion.span>
              <span className="mx-2">━━━━━</span>
              <span className="text-red-400">35°C ━━━━━</span>
            </div>
            <div className="text-center text-white/70 text-xs mt-1">
              Temperature Scale
            </div>
          </div>
        </div>

        {/* Right Sidebar - Weather Details & Rainfall */}
        <motion.div 
          className="lg:col-span-2 space-y-4 overflow-y-auto"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          
          {/* Current Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-0 bg-white/10 backdrop-blur text-white rounded-xl">
              <CardContent className="p-4">
                <motion.div 
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3 className="text-sm font-medium text-white/70 mb-2">राइमुर</h3>
                  <p className="text-xs text-white/60">19.62, 74.66</p>
                </motion.div>
                
                <motion.div 
                  className="text-center py-4 border-b border-white/10"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <motion.div 
                    className="text-5xl font-bold mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentWeather?.temperature ?? 28}°C
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity }}>
                      <Cloud className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm">{currentWeather?.condition || 'Partly Cloudy'}</span>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-2 gap-3 mt-4 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {[
                    { label: 'Feels like', value: currentWeather?.feelsLike ?? 30, unit: '°C' },
                    { label: 'Wind', value: currentWeather?.windSpeed ?? 12, unit: ' m/s' },
                    { label: 'Direction', value: '298° WNW ⤴', unit: '' },
                    { label: 'Humidity', value: currentWeather?.humidity ?? 65, unit: '%' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                    >
                      <div className="text-white/60 mb-1">{item.label}</div>
                      <div className="font-bold text-lg">{item.value}{item.unit}</div>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="col-span-2"
                  >
                    <div className="text-white/60 mb-1">Clouds</div>
                    <div className="font-bold">{36}%</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.75 }}
                    className="col-span-2"
                  >
                    <div className="text-white/60 mb-1">Pressure</div>
                    <div className="font-bold">{currentWeather?.pressure ?? 1011} hPa</div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rainfall Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border-0 bg-white/10 backdrop-blur text-white rounded-xl">
              <CardContent className="p-4">
                <h3 className="font-bold mb-4 text-sm">Rainfall Forecast</h3>
                
                <div className="space-y-2">
                  {rainfallForecast.map((day, idx) => (
                    <motion.div 
                      key={idx} 
                      className="bg-white/5 rounded-lg p-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.45 + idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{day.date}</span>
                        <span className="text-xs text-blue-300">{day.amount}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${day.probability}%` }}
                          transition={{ duration: 0.6, delay: 0.5 + idx * 0.08 }}
                        ></motion.div>
                      </div>
                      <div className="text-right text-xs text-white/60 mt-1">{day.probability}%</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Date/Time Navigation */}
          <motion.div 
            className="bg-white/10 backdrop-blur rounded-xl p-3 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>
            <div className="text-center text-white text-xs">
              <div className="font-medium">2026-05-23</div>
              <div className="text-white/60">07:00</div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Attribution */}
          <motion.div 
            className="text-xs text-white/50 text-center p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div>OpenWeatherMap ©</div>
            <div>OpenStreetMap Contributors</div>
          </motion.div>
        </motion.div>
                  <div className="font-bold text-lg">{currentWeather?.humidity ?? 65}%</div>
                </div>
                <div className="col-span-2">
                  <div className="text-white/60 mb-1">Clouds</div>
                  <div className="font-bold">{36}%</div>
                </div>
                <div className="col-span-2">
                  <div className="text-white/60 mb-1">Pressure</div>
                  <div className="font-bold">{currentWeather?.pressure ?? 1011} hPa</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rainfall Forecast */}
          <Card className="border-0 bg-white/10 backdrop-blur text-white rounded-xl">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4 text-sm">Rainfall Forecast</h3>
              
              <div className="space-y-2">
                {rainfallForecast.map((day, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{day.date}</span>
                      <span className="text-xs text-blue-300">{day.amount}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
                        style={{ width: `${day.probability}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-white/60 mt-1">{day.probability}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date/Time Navigation */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center text-white text-xs">
              <div className="font-medium">2026-05-23</div>
              <div className="text-white/60">07:00</div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Attribution */}
          <div className="text-xs text-white/50 text-center p-2">
            <div>OpenWeatherMap ©</div>
            <div>OpenStreetMap Contributors</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherVisualizationMap;
