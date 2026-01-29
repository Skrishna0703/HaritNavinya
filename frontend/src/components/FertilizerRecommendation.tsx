import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Droplets, 
  ArrowLeft,
  Beaker,
  Calculator,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface FertilizerRecommendationProps {
  onBack: () => void;
}

export function FertilizerRecommendation({ onBack }: FertilizerRecommendationProps) {
  const [soilData, setSoilData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    organicMatter: '',
    cropType: 'wheat'
  });
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setSoilData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const fertilizerRecommendations = [
    {
      type: "NPK 10-26-26",
      quantity: "50 kg per acre",
      cost: "₹2,400",
      application: "Base dose before sowing",
      priority: "High",
      description: "Balanced fertilizer for overall plant growth",
      nutrients: { N: 10, P: 26, K: 26 }
    },
    {
      type: "Urea (46% N)",
      quantity: "25 kg per acre",
      cost: "₹650",
      application: "Top dressing after 30 days",
      priority: "Medium",
      description: "Nitrogen supplement for vegetative growth",
      nutrients: { N: 46, P: 0, K: 0 }
    },
    {
      type: "Zinc Sulfate",
      quantity: "5 kg per acre",
      cost: "₹350",
      application: "Soil application with irrigation",
      priority: "Low",
      description: "Micronutrient for enzyme activation",
      nutrients: { Zn: 21, S: 10.5 }
    }
  ];

  const applicationSchedule = [
    {
      week: "Week 1",
      fertilizer: "NPK 10-26-26",
      method: "Broadcasting",
      timing: "Before sowing",
      amount: "50 kg/acre",
      status: "pending"
    },
    {
      week: "Week 4",
      fertilizer: "Urea",
      method: "Side dressing",
      timing: "After first irrigation",
      amount: "25 kg/acre",
      status: "pending"
    },
    {
      week: "Week 8",
      fertilizer: "Potash",
      method: "Broadcasting",
      timing: "Flowering stage",
      amount: "20 kg/acre",
      status: "pending"
    },
    {
      week: "Week 12",
      fertilizer: "Micronutrients",
      method: "Foliar spray",
      timing: "Grain filling",
      amount: "2 kg/acre",
      status: "pending"
    }
  ];

  const totalCost = fertilizerRecommendations.reduce((sum, fert) => 
    sum + parseInt(fert.cost.replace('₹', '').replace(',', '')), 0
  );

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg">
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
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Fertilizer Recommendation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Precision Nutrient Management
          </h2>
          <p className="text-xl text-gray-600">
            Get customized fertilizer recommendations based on your soil's NPK levels and pH
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Soil Input Form */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Soil Analysis Input</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nitrogen (N) - ppm</label>
                  <Input
                    type="number"
                    placeholder="e.g., 280"
                    value={soilData.nitrogen}
                    onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Available nitrogen in soil</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phosphorus (P) - ppm</label>
                  <Input
                    type="number"
                    placeholder="e.g., 45"
                    value={soilData.phosphorus}
                    onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Available phosphorus in soil</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Potassium (K) - ppm</label>
                  <Input
                    type="number"
                    placeholder="e.g., 220"
                    value={soilData.potassium}
                    onChange={(e) => handleInputChange('potassium', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Available potassium in soil</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Soil pH</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 6.5"
                    value={soilData.ph}
                    onChange={(e) => handleInputChange('ph', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Soil acidity/alkalinity level</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Organic Matter (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={soilData.organicMatter}
                    onChange={(e) => handleInputChange('organicMatter', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of organic content</p>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3"
                  disabled={!soilData.nitrogen || !soilData.phosphorus || !soilData.potassium}
                >
                  <Beaker className="w-5 h-5 mr-2" />
                  Analyze & Recommend
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!showResults ? (
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Beaker className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-xl font-medium text-gray-600 mb-2">
                    Ready for Analysis
                  </h4>
                  <p className="text-gray-500">
                    Enter your soil NPK values to get personalized fertilizer recommendations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Fertilizer Recommendations */}
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Recommended Fertilizers</h3>
                    
                    <div className="space-y-4">
                      {fertilizerRecommendations.map((fert, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-6 border border-orange-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center">
                                <Droplets className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg">{fert.type}</h4>
                                <p className="text-sm text-gray-600">{fert.description}</p>
                              </div>
                            </div>
                            <Badge className={`${
                              fert.priority === 'High' ? 'bg-red-100 text-red-700' :
                              fert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {fert.priority} Priority
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-bold">{fert.quantity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Cost</p>
                              <p className="font-bold text-green-600">{fert.cost}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Application</p>
                              <p className="font-bold">{fert.application}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Nutrients</p>
                              <div className="flex gap-1">
                                {Object.entries(fert.nutrients).map(([key, value]) => (
                                  <span key={key} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                                    {key}: {value}%
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Application Timeline */}
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Application Schedule</h3>
                    
                    <div className="space-y-4">
                      {applicationSchedule.map((schedule, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{schedule.week}</h4>
                              <Badge variant="outline">{schedule.method}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">{schedule.fertilizer}</span> - {schedule.amount}
                            </p>
                            <p className="text-xs text-gray-500">{schedule.timing}</p>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full border-2 border-orange-300 flex items-center justify-center">
                            {schedule.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Calculator */}
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-yellow-50">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Calculator className="w-6 h-6 text-green-600" />
                      Cost Estimation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <DollarSign className="w-8 h-8 text-green-500" />
                          <div>
                            <h4 className="font-bold">Total Cost</h4>
                            <p className="text-sm text-gray-600">Per acre</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-green-600">₹{totalCost.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp className="w-8 h-8 text-blue-500" />
                          <div>
                            <h4 className="font-bold">Expected Yield</h4>
                            <p className="text-sm text-gray-600">Increase</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">+25%</p>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <Calendar className="w-8 h-8 text-purple-500" />
                          <div>
                            <h4 className="font-bold">ROI Timeline</h4>
                            <p className="text-sm text-gray-600">Break-even</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">45 days</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-100 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-blue-800 mb-1">Pro Tip</h5>
                          <p className="text-sm text-blue-700">
                            Apply fertilizers in split doses for better nutrient efficiency. 
                            Combine with organic matter to improve soil health long-term.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}