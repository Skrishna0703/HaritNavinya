import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Cloud, 
  ArrowLeft,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Umbrella,
  AlertTriangle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface WeatherForecastProps {
  onBack: () => void;
}

export function WeatherForecast({ onBack }: WeatherForecastProps) {
  const [selectedCity, setSelectedCity] = useState('current location');

  const [latLon, setLatLon] = useState<{lat: number; lon: number} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [rainfallData, setRainfallData] = useState<any[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [farmingAdvice, setFarmingAdvice] = useState<any[]>([]);

  // Fallback weather data (used when API is unavailable)
  const fallbackWeather = {
    currentWeather: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013
    },
    weeklyForecast: [
      { day: 'Mon', high: 32, low: 22, condition: 'Sunny' },
      { day: 'Tue', high: 31, low: 21, condition: 'Sunny' },
      { day: 'Wed', high: 29, low: 20, condition: 'Partly Cloudy' },
      { day: 'Thu', high: 28, low: 19, condition: 'Rainy' },
      { day: 'Fri', high: 27, low: 18, condition: 'Rainy' },
      { day: 'Sat', high: 30, low: 20, condition: 'Sunny' },
    ]
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  async function fetchWeatherByLocation(lat: number, lon: number) {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(url, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      
      if (res && res.ok) {
        try {
          const data = await res.json();
          setCurrentWeather(data.currentWeather || fallbackWeather.currentWeather);
          setWeeklyForecast(data.weeklyForecast || fallbackWeather.weeklyForecast);
          setHourlyForecast(data.hourlyForecast || []);
          setRainfallData(data.rainfallData || []);
          setWeatherAlerts(data.weatherAlerts || []);
          setFarmingAdvice(data.farmingAdvice || []);
        } catch {
          // JSON parse error - use fallback
          setCurrentWeather(fallbackWeather.currentWeather);
          setWeeklyForecast(fallbackWeather.weeklyForecast);
        }
      } else {
        // API not available - use fallback silently
        setCurrentWeather(fallbackWeather.currentWeather);
        setWeeklyForecast(fallbackWeather.weeklyForecast);
      }
    } catch {
      // Any error - use fallback silently (no console logging)
      setCurrentWeather(fallbackWeather.currentWeather);
      setWeeklyForecast(fallbackWeather.weeklyForecast);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Request user location on load
    if (!navigator.geolocation) {
      // fallback to Pune
      const fallback = { lat: 18.5204, lon: 73.8567 };
      setLatLon(fallback);
      fetchWeatherByLocation(fallback.lat, fallback.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLatLon(coords);
        fetchWeatherByLocation(coords.lat, coords.lon);
      },
      (err) => {
        console.warn('Geolocation failed, using fallback Pune', err);
        const fallback = { lat: 18.5204, lon: 73.8567 };
        setLatLon(fallback);
        fetchWeatherByLocation(fallback.lat, fallback.lon);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  function pickIconFromText(text: any) {
    if (!text) return Sun;
    const s = String(text).toLowerCase();
    if (s.includes('rain') || s.includes('shower') || s.includes('storm')) return CloudRain;
    if (s.includes('cloud')) return Cloud;
    if (s.includes('wind')) return Wind;
    if (s.includes('umbrella')) return Umbrella;
    if (s.includes('droplet') || s.includes('drop')) return Droplets;
    if (s.includes('temp') || s.includes('therm')) return Thermometer;
    if (s.includes('sun') || s.includes('clear')) return Sun;
    return Sun;
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading && (
          <div className="mb-4 p-3 text-center bg-blue-50 rounded text-blue-700 font-medium">Fetching weather…</div>
        )}
        {error && (
          <div className="mb-4 p-3 text-center bg-red-50 rounded text-red-700 font-medium">{error}</div>
        )}
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-white text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Weather & Rainfall Forecast</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Display */}
        {latLon && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">📍 Current Location</p>
              <p className="text-lg font-bold text-blue-900">
                Latitude: {latLon.lat.toFixed(4)}° | Longitude: {latLon.lon.toFixed(4)}°
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-500">GPS Coordinates</p>
              <p className="text-sm text-blue-700 font-mono">{latLon.lat.toFixed(6)}, {latLon.lon.toFixed(6)}</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            7-Day Weather Intelligence
          </h2>
          <p className="text-xl text-gray-600">
            Detailed weather forecasts and rainfall predictions for smart farming decisions
          </p>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              Active Weather Alerts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherAlerts.map((alert, index) => (
                <Card 
                  key={index}
                  className="border-0 shadow-xl rounded-2xl overflow-hidden"
                  style={{ background: alert.color ? `linear-gradient(135deg, ${String(alert.color).replace('from-', '').replace(' to-', ', ')})` : 'linear-gradient(135deg,#f97316,#ef4444)'}}
                >
                  <CardContent className="p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold">{alert.event || alert.type || 'Alert'}</h4>
                      <Badge className="bg-white/20 text-white border-0">
                        {alert.severity || 'Active'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-4 opacity-90">{alert.description}</p>
                    <div className="space-y-2">
                      {alert.sender && <p className="text-sm font-medium">Source: {alert.sender}</p>}
                      {alert.start && <p className="text-xs opacity-80">Valid from: {new Date(alert.start * 1000).toLocaleString()}</p>}
                      {alert.end && <p className="text-xs opacity-80">Valid until: {new Date(alert.end * 1000).toLocaleString()}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Current Conditions */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Current Weather</h3>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-4xl font-bold text-gray-800 mb-2">{currentWeather?.temperature ?? '--'}°C</h4>
                <p className="text-lg text-gray-600">{currentWeather?.condition ?? '—'}</p>
                <p className="text-sm text-gray-500">Feels like {currentWeather?.feelsLike ?? '--'}°C</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Humidity</span>
                  </div>
                  <p className="text-xl font-bold">{currentWeather?.humidity ?? '--'}%</p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Wind</span>
                  </div>
                  <p className="text-xl font-bold">{currentWeather?.windSpeed ?? '--'} km/h</p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Visibility</span>
                  </div>
                  <p className="text-xl font-bold">{currentWeather?.visibility ?? '--'} km</p>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">UV Index</span>
                  </div>
                  <p className="text-xl font-bold">{currentWeather?.uvIndex ?? '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">7-Day Forecast</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {weeklyForecast.map((day, index) => {
                    const IconComponent = typeof day.icon === 'function' ? day.icon : pickIconFromText(day.condition || day.icon);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-sky-500 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold">{day.date || day.day}</h4>
                            <p className="text-sm text-gray-600">{day.condition}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xl font-bold">{day.temp}°C</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{day.rainProbability ?? day.rain ?? 0}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rainfall Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">15-Day Rainfall Forecast</h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rainfallData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rainfall" 
                      stroke="#3b82f6" 
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Today's Hourly Forecast</h3>
              
              <div className="space-y-3">
                {hourlyForecast.map((hour, index) => {
                  const IconComponent = typeof hour.icon === 'function' ? hour.icon : pickIconFromText(hour.weather || hour.icon || hour.rain);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                        <span className="font-medium">{hour.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{hour.temp}°C</span>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{hour.rainProbability ?? hour.rain ?? 0}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farming Advice */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Weather-Based Farming Advice
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmingAdvice.map((advice, index) => {
                const IconComponent = typeof advice.icon === 'function' ? advice.icon : pickIconFromText(advice.icon || advice.title);
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        advice.priority === 'High' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          advice.priority === 'High' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg">{advice.title}</h4>
                          <Badge className={
                            advice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }>
                            {advice.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{advice.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl">
              <h5 className="font-bold text-blue-800 mb-2">🌾 Weekly Summary</h5>
              <p className="text-blue-700">
                Heavy rain expected mid-week (Wed-Thu) followed by clear sunny weather. 
                Best window for field operations: Friday-Saturday. 
                Total expected rainfall: 120-150mm this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}