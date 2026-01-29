import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Filter,
  Wheat,
  Apple,
  Carrot
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MarketPriceForecastProps {
  onBack: () => void;
}

export function MarketPriceForecast({ onBack }: MarketPriceForecastProps) {
  const [selectedLocation, setSelectedLocation] = useState("mumbai");
  const [selectedCrop, setSelectedCrop] = useState("all");

  const priceData = [
    { date: 'Jan', wheat: 2100, rice: 2800, maize: 1750, potato: 1100 },
    { date: 'Feb', wheat: 2150, rice: 2850, maize: 1800, potato: 1200 },
    { date: 'Mar', wheat: 2200, rice: 2900, maize: 1850, potato: 1350 },
    { date: 'Apr', wheat: 2180, rice: 2780, maize: 1900, potato: 1180 },
    { date: 'May', wheat: 2250, rice: 2950, maize: 1950, potato: 1250 },
    { date: 'Jun', wheat: 2300, rice: 3000, maize: 2000, potato: 1300 }
  ];

  const forecastData = [
    { date: 'Jul', wheat: 2320, rice: 3050, maize: 2050, potato: 1320 },
    { date: 'Aug', wheat: 2350, rice: 3100, maize: 2100, potato: 1380 },
    { date: 'Sep', wheat: 2380, rice: 3150, maize: 2150, potato: 1400 },
    { date: 'Oct', wheat: 2400, rice: 3200, maize: 2200, potato: 1450 }
  ];

  const todayPrices = [
    { 
      crop: "Wheat", 
      price: 2150, 
      change: +2.3, 
      icon: Wheat,
      color: "from-yellow-400 to-orange-500",
      volume: "2,450 quintals"
    },
    { 
      crop: "Rice", 
      price: 2890, 
      change: +0.8, 
      icon: Apple,
      color: "from-green-400 to-emerald-500",
      volume: "1,850 quintals"
    },
    { 
      crop: "Maize", 
      price: 1850, 
      change: -1.2, 
      icon: Carrot,
      color: "from-blue-400 to-cyan-500",
      volume: "3,200 quintals"
    },
    { 
      crop: "Potato", 
      price: 1200, 
      change: +5.1, 
      icon: Apple,
      color: "from-purple-400 to-pink-500",
      volume: "1,650 quintals"
    },
    { 
      crop: "Onion", 
      price: 3200, 
      change: -2.8, 
      icon: Apple,
      color: "from-red-400 to-orange-500",
      volume: "980 quintals"
    },
    { 
      crop: "Tomato", 
      price: 4500, 
      change: +12.3, 
      icon: Apple,
      color: "from-indigo-400 to-purple-500",
      volume: "1,120 quintals"
    }
  ];

  const topGainers = [
    { crop: "Tomato", change: +12.3, price: 4500 },
    { crop: "Potato", change: +5.1, price: 1200 },
    { crop: "Wheat", change: +2.3, price: 2150 }
  ];

  const topLosers = [
    { crop: "Onion", change: -2.8, price: 3200 },
    { crop: "Maize", change: -1.2, price: 1850 },
    { crop: "Cotton", change: -0.5, price: 5200 }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Market Price Forecast</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Real-time Market Intelligence
          </h2>
          <p className="text-xl text-gray-600">
            Track prices, analyze trends, and make informed selling decisions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai, Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi NCR</SelectItem>
                <SelectItem value="bangalore">Bangalore, Karnataka</SelectItem>
                <SelectItem value="pune">Pune, Maharashtra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Price Trends & Forecast</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Historical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-green-300"></div>
                    <span className="text-sm text-gray-600">Forecast</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...priceData, ...forecastData]}>
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
                    <Line 
                      type="monotone" 
                      dataKey="wheat" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rice" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maize" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-green-700">Top Gainers Today</h4>
                <div className="space-y-3">
                  {topGainers.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.crop}</span>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-bold">+{item.change}%</span>
                        </div>
                        <div className="text-xs text-gray-600">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-red-700">Top Losers Today</h4>
                <div className="space-y-3">
                  {topLosers.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.crop}</span>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-bold">{item.change}%</span>
                        </div>
                        <div className="text-xs text-gray-600">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Prices Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Today's Market Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayPrices.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card 
                  key={index}
                  className="border-0 shadow-xl rounded-3xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${item.color.replace('from-', '').replace(' to-', ', ')})` }}
                >
                  <CardContent className="p-6 text-white relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <Badge 
                          className={`${
                            item.change > 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                          } border-0`}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                      
                      <h4 className="text-xl font-bold mb-2">{item.crop}</h4>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                          <span className="text-sm opacity-80">per quintal</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-80">
                          <BarChart3 className="w-4 h-4" />
                          <span>Volume: {item.volume}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">AI Market Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">Best Time to Sell</h4>
                <p className="text-gray-600 mb-3">Tomatoes are showing strong upward trend. Sell within next 3-5 days for maximum profit.</p>
                <Badge className="bg-green-100 text-green-700">High Confidence</Badge>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">Seasonal Forecast</h4>
                <p className="text-gray-600 mb-3">Wheat prices expected to rise by 8-12% during harvest season due to export demand.</p>
                <Badge className="bg-blue-100 text-blue-700">Medium Confidence</Badge>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">Regional Alert</h4>
                <p className="text-gray-600 mb-3">Delhi NCR showing higher prices for onions. Consider transportation costs for arbitrage.</p>
                <Badge className="bg-yellow-100 text-yellow-700">Market Alert</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}