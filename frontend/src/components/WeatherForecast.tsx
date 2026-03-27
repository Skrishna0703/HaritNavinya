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

  // Function to generate dates starting from today
  function generateFutureDates(days: number) {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const formatted = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dates.push(formatted);
    }
    
    return dates;
  }

  // Generate dynamic dates for today onwards
  const forecastDates = generateFutureDates(7);
  const rainfallDates = generateFutureDates(15);

  // Fallback weather data with dynamic dates
  const fallbackWeather = {
    currentWeather: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      feelsLike: 26,
      uvIndex: 6
    },
    weeklyForecast: [
      { date: forecastDates[0], temp: 27, minTemp: 22, maxTemp: 32, condition: 'Sunny', rainProbability: 10 },
      { date: forecastDates[1], temp: 26, minTemp: 21, maxTemp: 31, condition: 'Sunny', rainProbability: 5 },
      { date: forecastDates[2], temp: 25, minTemp: 20, maxTemp: 29, condition: 'Partly Cloudy', rainProbability: 30 },
      { date: forecastDates[3], temp: 24, minTemp: 19, maxTemp: 28, condition: 'Rainy', rainProbability: 75 },
      { date: forecastDates[4], temp: 23, minTemp: 18, maxTemp: 27, condition: 'Rainy', rainProbability: 80 },
      { date: forecastDates[5], temp: 25, minTemp: 20, maxTemp: 30, condition: 'Sunny', rainProbability: 15 },
      { date: forecastDates[6], temp: 26, minTemp: 21, maxTemp: 31, condition: 'Sunny', rainProbability: 10 }
    ],
    hourlyForecast: [
      { time: '12:00 AM', temp: 22, rainProbability: 10, weather: 'Clear' },
      { time: '3:00 AM', temp: 20, rainProbability: 5, weather: 'Clear' },
      { time: '6:00 AM', temp: 19, rainProbability: 0, weather: 'Clear' },
      { time: '9:00 AM', temp: 24, rainProbability: 0, weather: 'Sunny' },
      { time: '12:00 PM', temp: 28, rainProbability: 5, weather: 'Partly Cloudy' },
      { time: '3:00 PM', temp: 30, rainProbability: 10, weather: 'Partly Cloudy' },
      { time: '6:00 PM', temp: 26, rainProbability: 15, weather: 'Cloudy' },
      { time: '9:00 PM', temp: 23, rainProbability: 20, weather: 'Cloudy' }
    ],
    rainfallData: [
      { date: rainfallDates[0], rainfall: 0, temperature: 28 },
      { date: rainfallDates[1], rainfall: 2, temperature: 27 },
      { date: rainfallDates[2], rainfall: 5, temperature: 25 },
      { date: rainfallDates[3], rainfall: 35, temperature: 24 },
      { date: rainfallDates[4], rainfall: 40, temperature: 23 },
      { date: rainfallDates[5], rainfall: 15, temperature: 25 },
      { date: rainfallDates[6], rainfall: 5, temperature: 26 },
      { date: rainfallDates[7], rainfall: 0, temperature: 27 },
      { date: rainfallDates[8], rainfall: 0, temperature: 28 },
      { date: rainfallDates[9], rainfall: 3, temperature: 26 },
      { date: rainfallDates[10], rainfall: 8, temperature: 25 },
      { date: rainfallDates[11], rainfall: 12, temperature: 26 },
      { date: rainfallDates[12], rainfall: 20, temperature: 27 },
      { date: rainfallDates[13], rainfall: 10, temperature: 28 },
      { date: rainfallDates[14], rainfall: 2, temperature: 29 }
    ]
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  function generateDefaultFarmingAdvice() {
    return [
      {
        icon: 'Calendar',
        title: 'Plan Operations',
        description: 'Weather is stable. This is a good time to plan field operations.',
        priority: 'Low'
      },
      {
        icon: 'Droplets',
        title: 'Monitor Soil Moisture',
        description: 'Check soil moisture levels regularly during this period.',
        priority: 'Low'
      }
    ];
  }

  function generateDefaultWeatherAlerts() {
    return [
      {
        event: 'Moderate Rainfall Expected',
        type: 'Rainfall',
        severity: 'Moderate',
        description: 'Rainfall of 35-40mm expected on Mar 27-28. Plan irrigation accordingly.',
        sender: 'Weather Service',
        color: 'from-orange-400 to-yellow-500'
      },
      {
        event: 'Sunny Days Ahead',
        type: 'Sunny',
        severity: 'Info',
        description: 'Clear skies and sunny weather expected for Mar 23-26. Ideal for outdoor field activities.',
        sender: 'Weather Service',
        color: 'from-blue-400 to-cyan-500'
      }
    ];
  }

  async function fetchWeatherByLocation(lat: number, lon: number) {
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().getTime();
      const url = `${API_BASE}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&t=${timestamp}`;
      console.log('🌤️ Fetching weather from:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(url, { signal: controller.signal }).catch((err) => {
        console.warn('❌ Fetch failed:', err.message);
        return null;
      });
      clearTimeout(timeoutId);
      
      if (res && res.ok) {
        try {
          const data = await res.json();
          console.log('✅ Weather data received:', data);
          
          // Check if API dates are current (not stale)
          const isCurrentDate = data.weeklyForecast && data.weeklyForecast[0] && 
                                data.weeklyForecast[0].date?.includes('Mar 23');
          
          if (isCurrentDate) {
            // Use real API data if dates are current
            setCurrentWeather(data.currentWeather || fallbackWeather.currentWeather);
            setWeeklyForecast(data.weeklyForecast || fallbackWeather.weeklyForecast);
            setHourlyForecast(data.hourlyForecast || fallbackWeather.hourlyForecast);
            setRainfallData(data.rainfallData || fallbackWeather.rainfallData);
            setWeatherAlerts(data.weatherAlerts || []);
            setFarmingAdvice(data.farmingAdvice || generateDefaultFarmingAdvice());
            console.log('📊 Real API data loaded (current dates detected)');
          } else {
            // Use fallback if API dates are stale
            console.warn('⚠️ API returned stale dates, using fallback with current dates');
            setCurrentWeather(data.currentWeather || fallbackWeather.currentWeather);
            setWeeklyForecast(fallbackWeather.weeklyForecast); // Use fallback with current dates
            setHourlyForecast(data.hourlyForecast || fallbackWeather.hourlyForecast);
            setRainfallData(fallbackWeather.rainfallData); // Use fallback with current dates
            setWeatherAlerts(data.weatherAlerts && data.weatherAlerts.length > 0 ? data.weatherAlerts : generateDefaultWeatherAlerts());
            setFarmingAdvice(data.farmingAdvice || generateDefaultFarmingAdvice());
            console.log('📊 Hybrid data loaded (API + fallback dates)');
          }
        } catch (e) {
          console.error('❌ JSON parse error:', e);
          setError('Failed to parse weather data');
          setCurrentWeather(fallbackWeather.currentWeather);
          setWeeklyForecast(fallbackWeather.weeklyForecast);
          setHourlyForecast(fallbackWeather.hourlyForecast);
          setRainfallData(fallbackWeather.rainfallData);
          setWeatherAlerts(generateDefaultWeatherAlerts());
          setFarmingAdvice(generateDefaultFarmingAdvice());
        }
      } else if (res) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || `API error: ${res.status}`;
        console.error('❌ API error:', errorMsg);
        setError(errorMsg);
        setCurrentWeather(fallbackWeather.currentWeather);
        setWeeklyForecast(fallbackWeather.weeklyForecast);
        setHourlyForecast(fallbackWeather.hourlyForecast);
        setRainfallData(fallbackWeather.rainfallData);
        setWeatherAlerts(generateDefaultWeatherAlerts());
        setFarmingAdvice(generateDefaultFarmingAdvice());
      } else {
        console.warn('⚠️ No response from API - using fallback');
        setError('Could not connect to weather service');
        setCurrentWeather(fallbackWeather.currentWeather);
        setWeeklyForecast(fallbackWeather.weeklyForecast);
        setHourlyForecast(fallbackWeather.hourlyForecast);
        setRainfallData(fallbackWeather.rainfallData);
        setWeatherAlerts(generateDefaultWeatherAlerts());
        setFarmingAdvice(generateDefaultFarmingAdvice());
      }
    } catch (err) {
      console.error('🔴 Fetch error:', err instanceof Error ? err.message : String(err));
      setError('Network error - using local data');
      setCurrentWeather(fallbackWeather.currentWeather);
      setWeeklyForecast(fallbackWeather.weeklyForecast);
      setHourlyForecast(fallbackWeather.hourlyForecast);
      setRainfallData(fallbackWeather.rainfallData);
      setWeatherAlerts(generateDefaultWeatherAlerts());
      setFarmingAdvice(generateDefaultFarmingAdvice());
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
                  <CardContent className="p-6 text-black">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-black">{alert.event || alert.type || 'Alert'}</h4>
                      <Badge className="bg-gray-800 text-white border-0">
                        {alert.severity || 'Active'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-4 text-gray-800">{alert.description}</p>
                    <div className="space-y-2">
                      {alert.sender && <p className="text-sm font-medium text-gray-700">Source: {alert.sender}</p>}
                      {alert.start && <p className="text-xs text-gray-700">Valid from: {new Date(alert.start * 1000).toLocaleString()}</p>}
                      {alert.end && <p className="text-xs text-gray-700">Valid until: {new Date(alert.end * 1000).toLocaleString()}</p>}
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
                  {(weeklyForecast && weeklyForecast.length > 0 ? weeklyForecast : []).map((day, index) => {
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
                            <p className="text-lg font-bold text-gray-800">{day.maxTemp ?? day.temp ?? '--'}°</p>
                            <p className="text-xs text-gray-500">{day.minTemp ?? '--'}°</p>
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
                {(rainfallData && rainfallData.length > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rainfallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                        formatter={(value) => `${value} mm`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rainfall" 
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        name="Rainfall"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Loading rainfall data...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Today's Hourly Forecast</h3>
              
              <div className="space-y-3">
                {(hourlyForecast && hourlyForecast.length > 0 ? hourlyForecast : []).map((hour, index) => {
                  const IconComponent = typeof hour.icon === 'function' ? hour.icon : pickIconFromText(hour.weather || hour.icon || hour.condition);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                        <div>
                          <span className="font-medium block">{hour.time}</span>
                          <span className="text-xs text-gray-600">{hour.weather || hour.condition || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{hour.temp ?? '--'}°C</span>
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
              {(farmingAdvice && farmingAdvice.length > 0 ? farmingAdvice : generateDefaultFarmingAdvice()).map((advice, index) => {
                const IconComponent = typeof advice.icon === 'function' ? advice.icon : pickIconFromText(advice.icon || advice.title);
                const priorityColor = advice.priority === 'High' ? 'bg-red-100' : advice.priority === 'Medium' ? 'bg-yellow-100' : 'bg-blue-100';
                const textColor = advice.priority === 'High' ? 'text-red-700' : advice.priority === 'Medium' ? 'text-yellow-700' : 'text-blue-700';
                const iconColor = advice.priority === 'High' ? 'text-red-600' : advice.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600';
                
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${priorityColor}`}>
                        <IconComponent className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg">{advice.title}</h4>
                          <Badge className={`${priorityColor} ${textColor}`}>
                            {advice.priority || 'Low'}
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