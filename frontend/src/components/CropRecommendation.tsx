import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  Wheat, 
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Droplets,
  TrendingUp,
  Leaf,
  Sun,
  Target,
  BarChart3,
  GitCompare
} from "lucide-react";

interface CropRecommendationProps {
  onBack: () => void;
}

export function CropRecommendation({ onBack }: CropRecommendationProps) {
  const [formData, setFormData] = useState({
    soilType: '',
    season: '',
    location: '',
    budget: '',
    area: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const toggleCropSelection = (cropName: string) => {
    setSelectedCrops(prev => {
      if (prev.includes(cropName)) {
        return prev.filter(c => c !== cropName);
      } else if (prev.length < 2) {
        return [...prev, cropName];
      }
      return prev;
    });
  };

  const recommendedCrops = [
    {
      name: "Tomato",
      profitPotential: "High",
      profitAmount: "₹45,000 - ₹65,000",
      waterRequirement: "Medium",
      fertilizerNeed: "High",
      season: "Rabi & Kharif",
      growthPeriod: "3-4 months",
      suitability: 95,
      advantages: ["High market demand", "Year-round cultivation", "Good export potential"],
      risks: ["Disease susceptible", "Market price volatility"]
    },
    {
      name: "Wheat",
      profitPotential: "Medium-High",
      profitAmount: "₹25,000 - ₹35,000",
      waterRequirement: "Low-Medium",
      fertilizerNeed: "Medium",
      season: "Rabi",
      growthPeriod: "4-5 months",
      suitability: 88,
      advantages: ["Government support", "Stable prices", "Low water requirement"],
      risks: ["Weather dependent", "Storage challenges"]
    },
    {
      name: "Sugarcane",
      profitPotential: "Very High",
      profitAmount: "₹80,000 - ₹120,000",
      waterRequirement: "High",
      fertilizerNeed: "High",
      season: "Year-round",
      growthPeriod: "12-18 months",
      suitability: 78,
      advantages: ["Highest profit margin", "Multiple income sources", "Industrial demand"],
      risks: ["High investment", "Long growth cycle", "Water intensive"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
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
                <Wheat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Crop Recommendation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            AI-Powered Crop Selection
          </h2>
          <p className="text-xl text-gray-600">
            Get personalized crop recommendations based on your soil, climate, and investment capacity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Farm Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Soil Type</label>
                  <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay Soil</SelectItem>
                      <SelectItem value="sandy">Sandy Soil</SelectItem>
                      <SelectItem value="loamy">Loamy Soil</SelectItem>
                      <SelectItem value="black">Black Cotton Soil</SelectItem>
                      <SelectItem value="red">Red Soil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Season</label>
                  <Select value={formData.season} onValueChange={(value) => handleInputChange('season', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                      <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                      <SelectItem value="perennial">Perennial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Farm Area (Acres)</label>
                  <Input
                    type="number"
                    placeholder="Enter farm area"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Investment Budget</label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">₹10,000 - ₹50,000</SelectItem>
                      <SelectItem value="medium">₹50,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="high">₹2,00,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="premium">₹5,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3"
                  disabled={!formData.soilType || !formData.season}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Get Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!showResults ? (
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wheat className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-xl font-medium text-gray-600 mb-2">
                    Ready for Recommendations
                  </h4>
                  <p className="text-gray-500">
                    Fill in your farm details to get AI-powered crop recommendations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Top 3 Recommended Crops</h3>
                  <Button
                    onClick={() => setCompareMode(!compareMode)}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <GitCompare className="w-5 h-5 mr-2" />
                    {compareMode ? 'Exit Compare' : 'Compare Mode'}
                  </Button>
                </div>

                {/* Crop Cards */}
                <div className="grid grid-cols-1 gap-6">
                  {recommendedCrops.map((crop, index) => (
                    <Card 
                      key={index}
                      className={`border-0 shadow-xl rounded-3xl overflow-hidden cursor-pointer transition-all ${
                        compareMode ? (selectedCrops.includes(crop.name) ? 'ring-4 ring-blue-400' : 'opacity-70') : ''
                      }`}
                      onClick={() => compareMode && toggleCropSelection(crop.name)}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${
                              index === 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              index === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                              'bg-gradient-to-r from-purple-400 to-pink-500'
                            }`}>
                              <Leaf className="w-8 h-8" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold">{crop.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${
                                  crop.profitPotential === 'Very High' ? 'bg-green-100 text-green-700' :
                                  crop.profitPotential === 'High' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {crop.profitPotential} Profit
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Target className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{crop.suitability}% Suitable</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {compareMode && (
                            <div className={`w-6 h-6 rounded-full border-2 ${
                              selectedCrops.includes(crop.name) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {selectedCrops.includes(crop.name) && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Profit/Acre</span>
                            </div>
                            <p className="text-green-700 font-bold">{crop.profitAmount}</p>
                          </div>
                          
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Droplets className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Water Need</span>
                            </div>
                            <p className="text-blue-700 font-bold">{crop.waterRequirement}</p>
                          </div>
                          
                          <div className="bg-orange-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Leaf className="w-5 h-5 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">Fertilizer</span>
                            </div>
                            <p className="text-orange-700 font-bold">{crop.fertilizerNeed}</p>
                          </div>
                          
                          <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <span className="text-sm font-medium text-purple-800">Duration</span>
                            </div>
                            <p className="text-purple-700 font-bold">{crop.growthPeriod}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-bold text-green-700 mb-2">✓ Advantages</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {crop.advantages.map((advantage, i) => (
                                <li key={i}>• {advantage}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-bold text-red-700 mb-2">⚠ Considerations</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {crop.risks.map((risk, i) => (
                                <li key={i}>• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Comparison Panel */}
                {compareMode && selectedCrops.length === 2 && (
                  <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardContent className="p-8">
                      <h4 className="text-xl font-bold mb-6 text-center">Side-by-Side Comparison</h4>
                      
                      <div className="grid grid-cols-2 gap-8">
                        {selectedCrops.map((cropName) => {
                          const crop = recommendedCrops.find(c => c.name === cropName);
                          return (
                            <div key={cropName} className="space-y-4">
                              <h5 className="text-lg font-bold text-center">{crop?.name}</h5>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Profit Potential:</span>
                                  <span className="font-medium">{crop?.profitPotential}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Water Requirement:</span>
                                  <span className="font-medium">{crop?.waterRequirement}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Growth Period:</span>
                                  <span className="font-medium">{crop?.growthPeriod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Suitability:</span>
                                  <span className="font-medium">{crop?.suitability}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}