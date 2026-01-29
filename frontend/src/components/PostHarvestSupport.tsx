import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Package, 
  ArrowLeft,
  Warehouse,
  Truck,
  TrendingUp,
  Users,
  Calculator,
  MapPin,
  Phone,
  Star,
  Clock,
  DollarSign,
  Lightbulb,
  Shield,
  Calendar
} from "lucide-react";

interface PostHarvestSupportProps {
  onBack: () => void;
}

export function PostHarvestSupport({ onBack }: PostHarvestSupportProps) {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [storageQuantity, setStorageQuantity] = useState("");

  const storageRecommendations = [
    {
      crop: "Wheat",
      method: "Covered Storage",
      duration: "6-8 months",
      temperature: "Below 35°C",
      humidity: "Below 14%",
      packaging: "Jute bags or bulk storage",
      precautions: ["Regular fumigation", "Pest monitoring", "Moisture control"],
      cost: "₹50-80 per quintal",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMHN0b3JhZ2V8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      crop: "Rice",
      method: "Warehouse Storage",
      duration: "8-12 months",
      temperature: "Below 30°C",
      humidity: "Below 12%",
      packaging: "Vacuum-sealed bags",
      precautions: ["Temperature monitoring", "Regular inspection", "Rodent control"],
      cost: "₹70-100 per quintal",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwc3RvcmFnZXxlbnwxfHx8fDE3NTkwMjkxNDl8MA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      crop: "Onion",
      method: "Ventilated Storage",
      duration: "3-4 months",
      temperature: "25-30°C",
      humidity: "65-70%",
      packaging: "Mesh bags or crates",
      precautions: ["Good ventilation", "No direct sunlight", "Regular sorting"],
      cost: "₹30-50 per quintal",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmlvbiUyMHN0b3JhZ2V8ZW58MXx8fHwxNzU5MDI5MTQ5fDA&ixlib=rb-4.1.0&q=80&w=400"
    }
  ];

  const buyers = [
    {
      name: "Maharashtra State Cooperative",
      type: "Government",
      crops: ["Wheat", "Rice", "Cotton", "Sugarcane"],
      rating: 4.8,
      contact: "+91 20 2552 1234",
      location: "Pune",
      paymentTerms: "Immediate payment",
      capacity: "Unlimited",
      priceOffered: "MSP + 5%",
      reliability: "Very High"
    },
    {
      name: "AgroMart Solutions",
      type: "Private Trader",
      crops: ["Vegetables", "Fruits", "Grains"],
      rating: 4.5,
      contact: "+91 98765 43210",
      location: "Mumbai",
      paymentTerms: "Payment in 2-3 days",
      capacity: "500 tons/month",
      priceOffered: "Market rate",
      reliability: "High"
    },
    {
      name: "Fresh Produce Direct",
      type: "Export Company",
      crops: ["Fruits", "Vegetables", "Spices"],
      rating: 4.6,
      contact: "+91 87654 32109",
      location: "Nashik",
      paymentTerms: "Advance payment available",
      capacity: "200 tons/month",
      priceOffered: "Premium rates",
      reliability: "High"
    },
    {
      name: "Local Wholesale Market",
      type: "Mandi",
      crops: ["All crops"],
      rating: 4.2,
      contact: "+91 76543 21098",
      location: "Local Area",
      paymentTerms: "Same day payment",
      capacity: "100 tons/day",
      priceOffered: "Current market rate",
      reliability: "Medium"
    }
  ];

  const logisticsProviders = [
    {
      name: "FarmTrans Logistics",
      service: "Farm to Market Transport",
      vehicles: ["Mini Trucks", "Refrigerated Vehicles"],
      coverage: "Pan-Maharashtra",
      rating: 4.7,
      contact: "+91 98765 11111",
      pricing: "₹3-5 per km per quintal",
      features: ["GPS Tracking", "Insurance Coverage", "Temperature Control"]
    },
    {
      name: "AgriMove Express",
      service: "Cold Chain Transport",
      vehicles: ["Refrigerated Trucks", "Insulated Containers"],
      coverage: "Western India",
      rating: 4.5,
      contact: "+91 87654 22222",
      pricing: "₹4-7 per km per quintal",
      features: ["Cold Storage", "Quality Assurance", "Door-to-Door Service"]
    },
    {
      name: "QuickHaul Services",
      service: "General Cargo Transport",
      vehicles: ["Open Trucks", "Covered Vehicles"],
      coverage: "Local & Regional",
      rating: 4.3,
      contact: "+91 76543 33333",
      pricing: "₹2-4 per km per quintal",
      features: ["Fast Delivery", "Flexible Scheduling", "Load Tracking"]
    }
  ];

  const profitTips = [
    {
      icon: TrendingUp,
      title: "Optimal Selling Time",
      description: "Sell wheat during October-November when demand peaks and prices are 15-20% higher than harvest time.",
      impact: "High",
      savings: "₹3,000-5,000 per acre"
    },
    {
      icon: Users,
      title: "Group Selling",
      description: "Form farmer groups to sell collectively. Bulk sales attract better prices and reduce individual marketing costs.",
      impact: "Medium",
      savings: "₹1,500-3,000 per acre"
    },
    {
      icon: Package,
      title: "Value Addition",
      description: "Clean, grade, and package your produce. Value-added products fetch 20-30% premium in the market.",
      impact: "High",
      savings: "₹2,000-4,000 per acre"
    },
    {
      icon: Shield,
      title: "Quality Maintenance",
      description: "Proper storage prevents 15-20% post-harvest losses. Invest in good storage for better returns.",
      impact: "Very High",
      savings: "₹4,000-8,000 per acre"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'bg-blue-100 text-blue-700';
      case 'Private Trader': return 'bg-green-100 text-green-700';
      case 'Export Company': return 'bg-purple-100 text-purple-700';
      case 'Mandi': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-lg">
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
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Post-Harvest Support</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Maximize Your Harvest Value
          </h2>
          <p className="text-xl text-gray-600">
            Storage solutions, market connections, and logistics support for better farm profits
          </p>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="storage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="storage">Storage Guide</TabsTrigger>
            <TabsTrigger value="buyers">Find Buyers</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="profits">Profit Tips</TabsTrigger>
          </TabsList>

          {/* Storage Recommendations Tab */}
          <TabsContent value="storage" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Crop-Specific Storage Recommendations</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {storageRecommendations.map((storage, index) => (
                    <Card key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={storage.image} 
                          alt={`${storage.crop} storage`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold mb-3">{storage.crop}</h4>
                        
                        <div className="space-y-3 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Method:</p>
                              <p className="font-medium">{storage.method}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Duration:</p>
                              <p className="font-medium">{storage.duration}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Temperature:</p>
                              <p className="font-medium">{storage.temperature}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Humidity:</p>
                              <p className="font-medium">{storage.humidity}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 text-sm">Packaging:</p>
                            <p className="font-medium">{storage.packaging}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600 text-sm mb-2">Precautions:</p>
                            <ul className="text-sm space-y-1">
                              {storage.precautions.map((precaution, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {precaution}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Storage Cost:</span>
                            <span className="font-bold text-green-600">{storage.cost}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Storage Calculator */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-yellow-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-green-500" />
                  Storage Cost Calculator
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Crop</label>
                    <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="onion">Onion</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity (Quintals)</label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={storageQuantity}
                      onChange={(e) => setStorageQuantity(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-600 text-white">
                      Calculate Cost
                    </Button>
                  </div>
                </div>
                
                {storageQuantity && (
                  <div className="mt-6 p-4 bg-white rounded-xl">
                    <h4 className="font-bold mb-2">Estimated Storage Cost</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">₹{(parseInt(storageQuantity || '0') * 65).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Cost</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">6</p>
                        <p className="text-sm text-gray-600">Months Storage</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">₹{Math.round(parseInt(storageQuantity || '0') * 65 / 6)}</p>
                        <p className="text-sm text-gray-600">Per Month</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyers Directory Tab */}
          <TabsContent value="buyers" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Buyer & Wholesaler Directory</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {buyers.map((buyer, index) => (
                    <Card key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold">{buyer.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getTypeColor(buyer.type)}>
                                {buyer.type}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{buyer.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Reliability</p>
                            <p className="font-bold text-green-600">{buyer.reliability}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Crops Accepted:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {buyer.crops.slice(0, 3).map((crop, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                              {buyer.crops.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{buyer.crops.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Payment Terms:</p>
                              <p className="font-medium">{buyer.paymentTerms}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Capacity:</p>
                              <p className="font-medium">{buyer.capacity}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Price Offered:</p>
                              <p className="font-medium text-green-600">{buyer.priceOffered}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Location:</p>
                              <p className="font-medium">{buyer.location}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-yellow-600 text-white">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            <MapPin className="w-4 h-4 mr-1" />
                            Location
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                            Get Quote
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Transportation & Logistics Services</h3>
                
                <div className="space-y-6">
                  {logisticsProviders.map((provider, index) => (
                    <Card key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold">{provider.name}</h4>
                            <p className="text-blue-600 font-medium">{provider.service}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{provider.rating}</span>
                              <span className="text-gray-500 ml-2">•</span>
                              <span className="text-gray-600">{provider.coverage}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Pricing</p>
                            <p className="font-bold text-green-600">{provider.pricing}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Available Vehicles:</p>
                            <div className="flex flex-wrap gap-1">
                              {provider.vehicles.map((vehicle, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {vehicle}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Special Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {provider.features.map((feature, i) => (
                                <Badge key={i} className="bg-green-100 text-green-700 text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-yellow-600 text-white">
                            <Phone className="w-4 h-4 mr-1" />
                            Call Now
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            <Truck className="w-4 h-4 mr-1" />
                            Book Vehicle
                          </Button>
                          <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                            <Calendar className="w-4 h-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profit Tips Tab */}
          <TabsContent value="profits" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  AI-Powered Profit Optimization Tips
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profitTips.map((tip, index) => {
                    const IconComponent = tip.icon;
                    return (
                      <Card key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-lg">{tip.title}</h4>
                                <Badge className={getImpactColor(tip.impact)}>
                                  {tip.impact} Impact
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{tip.description}</p>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-green-600">Potential Savings: {tip.savings}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Profit Calculator */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-yellow-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Profit Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Current Season</h4>
                    <p className="text-3xl font-bold text-green-600">₹45,000</p>
                    <p className="text-sm text-gray-600">Projected profit per acre</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Loss Prevention</h4>
                    <p className="text-3xl font-bold text-blue-600">₹12,000</p>
                    <p className="text-sm text-gray-600">Savings from good storage</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Value Addition</h4>
                    <p className="text-3xl font-bold text-purple-600">₹8,000</p>
                    <p className="text-sm text-gray-600">Extra income from processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}