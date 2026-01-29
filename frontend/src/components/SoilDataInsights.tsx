import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Globe, 
  ArrowLeft,
  Beaker,
  BarChart3,
  Droplets,
  Leaf,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

interface SoilDataInsightsProps {
  onBack: () => void;
}

export function SoilDataInsights({ onBack }: SoilDataInsightsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const soilHealthData = {
    fertilityScore: 78,
    ph: 6.8,
    organicMatter: 2.4,
    nitrogen: 280,
    phosphorus: 45,
    potassium: 220,
    moisture: 65,
    temperature: 24
  };

  const nutrientData = [
    { name: 'Nitrogen (N)', current: 280, optimal: 300, unit: 'ppm', status: 'good' },
    { name: 'Phosphorus (P)', current: 45, optimal: 55, unit: 'ppm', status: 'low' },
    { name: 'Potassium (K)', current: 220, optimal: 200, unit: 'ppm', status: 'high' },
    { name: 'Organic Matter', current: 2.4, optimal: 3.0, unit: '%', status: 'low' },
    { name: 'pH Level', current: 6.8, optimal: 6.5, unit: '', status: 'good' }
  ];

  const cropSuitability = [
    { crop: 'Wheat', suitability: 92, season: 'Rabi', profitPotential: 'High' },
    { crop: 'Rice', suitability: 78, season: 'Kharif', profitPotential: 'Medium' },
    { crop: 'Maize', suitability: 85, season: 'Kharif', profitPotential: 'High' },
    { crop: 'Sugarcane', suitability: 70, season: 'Year-round', profitPotential: 'Very High' },
    { crop: 'Cotton', suitability: 65, season: 'Kharif', profitPotential: 'Medium' },
    { crop: 'Soybean', suitability: 88, season: 'Kharif', profitPotential: 'Medium-High' }
  ];

  const irrigationRecommendations = [
    { method: 'Drip Irrigation', efficiency: 95, waterSaving: 40, suitability: 'Excellent' },
    { method: 'Sprinkler', efficiency: 75, waterSaving: 25, suitability: 'Good' },
    { method: 'Furrow', efficiency: 50, waterSaving: 0, suitability: 'Not Recommended' },
    { method: 'Micro-sprinkler', efficiency: 85, waterSaving: 30, suitability: 'Very Good' }
  ];

  const soilInsights = [
    {
      type: 'positive',
      title: 'Good Nitrogen Levels',
      description: 'Your soil has adequate nitrogen for most crops. Continue current practices.',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'warning',
      title: 'Low Phosphorus Content',
      description: 'Consider adding DAP fertilizer or bone meal to boost phosphorus levels.',
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      type: 'action',
      title: 'Organic Matter Deficit',
      description: 'Add compost or farmyard manure to improve soil structure and fertility.',
      icon: Lightbulb,
      color: 'text-blue-600'
    },
    {
      type: 'positive',
      title: 'Optimal pH Range',
      description: 'Your soil pH is perfect for most crops. Maintain current levels.',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'from-green-400 to-emerald-500';
    if (suitability >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-green-600 text-white shadow-lg">
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
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Soil Data & Fertility Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Comprehensive Soil Health Analysis
          </h2>
          <p className="text-xl text-gray-600">
            Deep insights into your soil's fertility, nutrient levels, and crop suitability
          </p>
        </div>

        {/* Soil Health Score Card */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-amber-50 to-green-50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full bg-gradient-to-r from-amber-400 to-green-500 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">{soilHealthData.fertilityScore}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold">Fertility Score</h3>
                <p className="text-gray-600">Overall soil health</p>
              </div>

              <div className="md:col-span-3">
                <h4 className="text-lg font-bold mb-4">Quick Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Beaker className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium">pH Level</span>
                    </div>
                    <p className="text-2xl font-bold">{soilHealthData.ph}</p>
                    <p className="text-xs text-gray-500">Slightly Alkaline</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Organic Matter</span>
                    </div>
                    <p className="text-2xl font-bold">{soilHealthData.organicMatter}%</p>
                    <p className="text-xs text-gray-500">Needs Improvement</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-cyan-500" />
                      <span className="text-sm font-medium">Moisture</span>
                    </div>
                    <p className="text-2xl font-bold">{soilHealthData.moisture}%</p>
                    <p className="text-xs text-gray-500">Optimal Range</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold">{soilHealthData.temperature}°C</p>
                    <p className="text-xs text-gray-500">Favorable</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Nutrient Analysis</TabsTrigger>
            <TabsTrigger value="crops">Crop Suitability</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation Guide</TabsTrigger>
          </TabsList>

          {/* Nutrient Analysis Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nutrient Chart */}
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Nutrient Levels</h3>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={nutrientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px'
                          }}
                        />
                        <Bar dataKey="current" fill="#10b981" name="Current Level" />
                        <Bar dataKey="optimal" fill="#3b82f6" name="Optimal Level" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrient Details */}
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
                  
                  <div className="space-y-4">
                    {nutrientData.map((nutrient, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{nutrient.name}</h4>
                          <Badge className={getStatusColor(nutrient.status)}>
                            {nutrient.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-600">Current:</span>
                          <span className="font-medium">{nutrient.current} {nutrient.unit}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-sm text-gray-600">Optimal:</span>
                          <span className="font-medium">{nutrient.optimal} {nutrient.unit}</span>
                        </div>
                        
                        <Progress 
                          value={(nutrient.current / nutrient.optimal) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Crop Suitability Tab */}
          <TabsContent value="crops" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Recommended Crops for Your Soil</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cropSuitability.map((crop, index) => (
                    <Card 
                      key={index}
                      className="border-0 shadow-lg rounded-2xl overflow-hidden"
                      style={{ 
                        background: `linear-gradient(135deg, ${getSuitabilityColor(crop.suitability).replace('from-', '').replace(' to-', ', ')})` 
                      }}
                    >
                      <CardContent className="p-6 text-white relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold">{crop.crop}</h4>
                            <Badge className="bg-white/20 text-white border-0">
                              {crop.suitability}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="text-sm opacity-80">Season:</span>
                              <span className="text-sm font-medium">{crop.season}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm opacity-80">Profit:</span>
                              <span className="text-sm font-medium">{crop.profitPotential}</span>
                            </div>
                          </div>
                          
                          <Progress 
                            value={crop.suitability} 
                            className="h-2 bg-white/20"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Irrigation Guide Tab */}
          <TabsContent value="irrigation" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Irrigation Recommendations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {irrigationRecommendations.map((method, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold">{method.method}</h4>
                        <Badge className={
                          method.suitability === 'Excellent' ? 'bg-green-100 text-green-700' :
                          method.suitability === 'Very Good' ? 'bg-blue-100 text-blue-700' :
                          method.suitability === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {method.suitability}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Efficiency:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={method.efficiency} className="w-20 h-2" />
                            <span className="font-medium">{method.efficiency}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Water Saving:</span>
                          <span className="font-medium text-blue-600">{method.waterSaving}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Insights */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-green-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              AI-Generated Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {soilInsights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        insight.type === 'positive' ? 'bg-green-100' :
                        insight.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${insight.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                        <p className="text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-green-100 rounded-xl">
              <h5 className="font-bold text-amber-800 mb-2">💡 Your soil is best suited for:</h5>
              <p className="text-amber-700">
                <strong>Wheat</strong> (92% match), <strong>Maize</strong> (85% match), and <strong>Soybean</strong> (88% match) 
                based on current nutrient levels and pH. Consider crop rotation for optimal soil health.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}