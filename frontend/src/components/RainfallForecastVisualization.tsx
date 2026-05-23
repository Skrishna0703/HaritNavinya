import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Droplets,
  TrendingUp,
  Calendar,
  Wind,
  Gauge,
  ArrowLeft,
  Cloud,
  Sun
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts';

interface RainfallForecastProps {
  onBack: () => void;
}

export function RainfallForecastVisualization({ onBack }: RainfallForecastProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [timeRange, setTimeRange] = useState<'7day' | '15day' | 'monthly'>('7day');

  // Mock data for 15-day rainfall forecast
  const rainfallData15 = [
    { day: 'May 23', rainfall: 2, probability: 10, humidity: 45, windSpeed: 8, pressure: 1013 },
    { day: 'May 24', rainfall: 12, probability: 65, humidity: 72, windSpeed: 15, pressure: 1008 },
    { day: 'May 25', rainfall: 28, probability: 85, humidity: 85, windSpeed: 18, pressure: 1001 },
    { day: 'May 26', rainfall: 15, probability: 55, humidity: 68, windSpeed: 12, pressure: 1005 },
    { day: 'May 27', rainfall: 5, probability: 25, humidity: 50, windSpeed: 7, pressure: 1012 },
    { day: 'May 28', rainfall: 0, probability: 5, humidity: 35, windSpeed: 5, pressure: 1015 },
    { day: 'May 29', rainfall: 8, probability: 40, humidity: 60, windSpeed: 10, pressure: 1010 },
    { day: 'May 30', rainfall: 22, probability: 75, humidity: 80, windSpeed: 16, pressure: 1002 },
    { day: 'May 31', rainfall: 18, probability: 70, humidity: 75, windSpeed: 14, pressure: 1004 },
    { day: 'Jun 1', rainfall: 3, probability: 15, humidity: 48, windSpeed: 6, pressure: 1013 },
    { day: 'Jun 2', rainfall: 0, probability: 5, humidity: 40, windSpeed: 4, pressure: 1016 },
    { day: 'Jun 3', rainfall: 10, probability: 45, humidity: 65, windSpeed: 11, pressure: 1009 },
    { day: 'Jun 4', rainfall: 25, probability: 80, humidity: 82, windSpeed: 17, pressure: 1000 },
    { day: 'Jun 5', rainfall: 20, probability: 72, humidity: 78, windSpeed: 15, pressure: 1003 },
    { day: 'Jun 6', rainfall: 6, probability: 30, humidity: 55, windSpeed: 9, pressure: 1011 },
  ];

  const selectedDayData = rainfallData15[selectedDay];

  // Weekly summary
  const weeklySummary = [
    { week: 'Week 1', totalRainfall: 65, rainyDays: 4, avgProbability: 57 },
    { week: 'Week 2', totalRainfall: 64, rainyDays: 4, avgProbability: 56 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <CloudRain className="w-8 h-8 text-cyan-400" />
                  Rainfall Forecast Intelligence
                </h1>
                <p className="text-white/60 text-sm mt-1">15-day detailed precipitation prediction for crop planning</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Time Range Selector */}
        <div className="flex gap-3">
          {(['7day', '15day', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {range === '7day' ? '7 Days' : range === '15day' ? '15 Days' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Main Rainfall Chart */}
        <Card className="border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-cyan-400" />
              Rainfall Trend Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Rainfall */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">Total Rainfall</span>
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-4xl font-bold text-white">215 mm</div>
                <div className="text-xs text-white/60 mt-2">Forecasted for 15 days</div>
              </div>

              {/* Rainy Days */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">Rainy Days</span>
                  <Cloud className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-4xl font-bold text-white">8 days</div>
                <div className="text-xs text-white/60 mt-2">53% chance on average</div>
              </div>

              {/* Avg Rainfall */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">Avg per Day</span>
                  <Droplets className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-4xl font-bold text-white">14.3 mm</div>
                <div className="text-xs text-white/60 mt-2">Average daily precipitation</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={rainfallData15} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value} mm`, 'Rainfall']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rainfall" 
                    fill="url(#rainGradient)" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    isAnimationActive
                  />
                  <Bar 
                    dataKey="probability" 
                    fill="rgba(139, 92, 246, 0.3)" 
                    yAxisId="right"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Details - Interactive Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Day Selector */}
          <Card className="border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden lg:col-span-2">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">15-Day Forecast</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {rainfallData15.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`p-3 rounded-lg transition-all border ${
                      selectedDay === idx
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{day.day}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-white/80">{day.rainfall}mm</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">{day.probability}% prob</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-cyan-400/20">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-white mb-6">Detailed Forecast</h3>

              <div className="space-y-4">
                {/* Date */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </span>
                    <span className="text-white font-bold">{selectedDayData?.day}</span>
                  </div>
                </div>

                {/* Rainfall Amount */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <CloudRain className="w-4 h-4" />
                      Expected Rainfall
                    </span>
                    <span className="text-white font-bold text-xl">{selectedDayData?.rainfall} mm</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-400 h-full"
                      style={{ width: `${(selectedDayData?.rainfall || 0) / 30 * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Probability */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Probability</span>
                    <span className="text-white font-bold">{selectedDayData?.probability}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-full rounded-full"
                      style={{ width: `${selectedDayData?.probability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Humidity
                    </span>
                    <span className="text-white font-bold">{selectedDayData?.humidity}%</span>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      Wind Speed
                    </span>
                    <span className="text-white font-bold">{selectedDayData?.windSpeed} m/s</span>
                  </div>
                </div>

                {/* Pressure */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Pressure
                    </span>
                    <span className="text-white font-bold">{selectedDayData?.pressure} hPa</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-4 border border-emerald-400/30 mt-6">
                  <div className="text-sm font-medium text-white mb-2">🌾 Farming Recommendation</div>
                  <div className="text-xs text-white/80">
                    {selectedDayData?.rainfall && selectedDayData.rainfall > 20
                      ? '💧 Heavy rainfall expected. Avoid field operations and reduce irrigation.'
                      : selectedDayData?.rainfall && selectedDayData.rainfall > 5
                      ? '🌧️ Moderate rainfall. Light irrigation recommended.'
                      : '☀️ Dry conditions. Ensure adequate irrigation.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Weekly Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklySummary.map((week, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">{week.week}</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Total Rainfall</span>
                      <span className="text-white font-bold text-lg">{week.totalRainfall} mm</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Rainy Days</span>
                      <span className="text-white font-bold text-lg">{week.rainyDays} days</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Avg Probability</span>
                      <span className="text-white font-bold text-lg">{week.avgProbability}%</span>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 mt-4 border border-cyan-400/20">
                      <p className="text-xs text-white/80">
                        <strong>Outlook:</strong> Typical monsoon pattern with periodic heavy rainfall. Plan irrigation and crop protection accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default RainfallForecastVisualization;
