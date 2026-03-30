import React, { useState, useEffect } from 'react';
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
  Lightbulb,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

interface SoilDataInsightsProps {
  onBack: () => void;
}

interface SoilData {
  fertilityScore: number;
  overallCategory: string;
  nutrients: {
    nitrogen: { value: number; category: string };
    phosphorus: { value: number; category: string };
    potassium: { value: number; category: string };
    organicCarbon: { value: number; category: string };
    pH: { value: number; category: string };
  };
  micronutrients?: any;
  recommendations?: Array<any>;
}

export function SoilDataInsights({ onBack }: SoilDataInsightsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [states, setStates] = useState<string[]>([]);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:5000/api/soil';

  // Fetch available states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${API_BASE}/states`);
        const data = await res.json();
        if (data.success) {
          setStates(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
        // Fallback states
        setStates(['Maharashtra', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Uttar Pradesh']);
      }
    };

    fetchStates();
  }, []);

  // Fetch soil insights for selected state
  useEffect(() => {
    const fetchSoilInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/soil-insights?state=${encodeURIComponent(selectedState)}`);
        const data = await res.json();

        if (data.success) {
          setSoilData(data.data);
        } else {
          setError(data.error || 'Failed to fetch soil data');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch soil data');
      } finally {
        setLoading(false);
      }
    };

    if (selectedState) {
      fetchSoilInsights();
    }
  }, [selectedState]);

  // Get recommendations from API
  const recommendations = soilData?.recommendations || [];

  // Build nutrient data array
  const nutrientData = soilData && soilData.nutrients
    ? [
        { name: 'Nitrogen', current: soilData.nutrients.nitrogen?.value || 0, unit: 'mg/kg', category: soilData.nutrients.nitrogen?.category || 'Unknown' },
        { name: 'Phosphorus', current: soilData.nutrients.phosphorus?.value || 0, unit: 'mg/kg', category: soilData.nutrients.phosphorus?.category || 'Unknown' },
        { name: 'Potassium', current: soilData.nutrients.potassium?.value || 0, unit: 'mg/kg', category: soilData.nutrients.potassium?.category || 'Unknown' },
        { name: 'Organic Carbon', current: soilData.nutrients.organicCarbon?.value || 0, unit: '%', category: soilData.nutrients.organicCarbon?.category || 'Unknown' },
        { name: 'pH Level', current: soilData.nutrients.pH?.value || 0, unit: '', category: soilData.nutrients.pH?.category || 'Unknown' },
      ]
    : [];

  // Build micronutrient data array
  const micronutrientData = soilData?.micronutrients 
    ? Object.entries(soilData.micronutrients).map(([key, value]: [string, any]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        sufficiency: value.sufficiencyPercent || 0,
        category: value.category || 'Unknown'
      }))
    : [];

  const getStatusColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-amber-600 bg-amber-100';
      case 'sufficient': return 'text-green-600 bg-green-100';
      case 'deficient': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return 'text-gray-500';
    const lower = category.toLowerCase();
    if (lower === 'high' || lower === 'sufficient') return 'text-green-600';
    if (lower === 'medium') return 'text-yellow-600';
    if (lower === 'low' || lower === 'deficient') return 'text-red-600';
    return 'text-gray-600';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white font-['Poppins',sans-serif] flex items-center justify-center">
        <Card className="border-2 border-red-200 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Error loading soil data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Make sure the backend server is running on port 5000</p>
            <Button onClick={onBack} className="w-full">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Soil Data & Fertility Insights</h1>
            </div>
            <div className="w-32">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-gray-800 rounded-lg text-sm"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && soilData === null ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading soil data for {selectedState}...</p>
            </div>
          </div>
        ) : soilData ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Comprehensive Soil Health Analysis
              </h2>
              <p className="text-xl text-gray-600">
                Deep insights into {selectedState}'s soil fertility, nutrient levels, and crop suitability
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
                          <span className="text-3xl font-bold text-gray-800">{soilData.fertilityScore}</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-100 text-green-700">{soilData.overallCategory}</Badge>
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
                        <p className="text-2xl font-bold">{soilData.nutrients.pH.value}</p>
                        <p className="text-xs text-gray-500">{soilData.nutrients.pH.category}</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium">Organic Carbon</span>
                        </div>
                        <p className="text-2xl font-bold">{soilData.nutrients.organicCarbon.value.toFixed(2)}%</p>
                        <p className="text-xs text-gray-500">{soilData.nutrients.organicCarbon.category}</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-medium">Nitrogen</span>
                        </div>
                        <p className="text-2xl font-bold">{soilData.nutrients.nitrogen.value}</p>
                        <p className="text-xs text-gray-500">mg/kg</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium">Phosphorus</span>
                        </div>
                        <p className="text-2xl font-bold">{soilData.nutrients.phosphorus.value}</p>
                        <p className="text-xs text-gray-500">mg/kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Nutrients</TabsTrigger>
                <TabsTrigger value="micronutrients">Micronutrients</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              {/* Nutrient Analysis Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Macronutrient Levels</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {nutrientData.map((nutrient, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold">{nutrient.name}</h4>
                            <Badge className={getStatusColor(nutrient.category)}>
                              {nutrient.category}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="text-3xl font-bold text-gray-800">
                              {nutrient.current} <span className="text-lg text-gray-600">{nutrient.unit}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Micronutrients Tab */}
              <TabsContent value="micronutrients" className="space-y-6">
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Micronutrient Status</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {micronutrientData.map((micro, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-l-blue-500">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-lg">{micro.name}</h4>
                            <Badge className={getStatusColor(micro.category)}>
                              {micro.category}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Sufficiency:</span>
                              <span className={`text-xl font-bold ${getCategoryColor(micro.category)}`}>
                                {micro.sufficiency}%
                              </span>
                            </div>
                            <Progress value={micro.sufficiency} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-6">
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">AI-Generated Recommendations</h3>

                    {recommendations && recommendations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-l-orange-400">
                            <div className="flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                rec.priority === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                              }`}>
                                <AlertCircle className={`w-5 h-5 ${
                                  rec.priority === 'High' ? 'text-red-600' : 'text-yellow-600'
                                }`} />
                              </div>

                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-1">{rec.parameter}</h4>
                                <p className="text-gray-600 text-sm mb-2">{rec.issue}</p>
                                <p className="text-green-700 font-medium text-sm mb-1">{rec.recommendation}</p>
                                <p className="text-gray-500 text-xs">📊 Dosage: {rec.dosage}</p>
                                <Badge className="mt-2" variant="outline">{rec.priority} Priority</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">No specific recommendations needed for this soil.</p>
                        <p className="text-sm">Soil nutrients are within acceptable ranges.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </div>
  );
}