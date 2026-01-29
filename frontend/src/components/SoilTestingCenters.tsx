import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  ArrowLeft,
  Phone,
  Calendar,
  Navigation,
  Star,
  Clock,
  Filter,
  Search,
  Map,
  List,
  User,
  CheckCircle
} from "lucide-react";

interface SoilTestingCentersProps {
  onBack: () => void;
}

export function SoilTestingCenters({ onBack }: SoilTestingCentersProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('distance');

  const testingCenters = [
    {
      name: "Pune Agricultural Research Center",
      address: "Shivajinagar, Pune, Maharashtra 411005",
      distance: 2.5,
      rating: 4.8,
      contact: "+91 20 2553 4567",
      email: "pune.agri@gov.in",
      timings: "9:00 AM - 5:00 PM",
      services: ["Soil pH Testing", "NPK Analysis", "Micronutrient Testing", "Organic Matter"],
      price: "₹150 - ₹500",
      waitTime: "2-3 days",
      availability: "Available",
      type: "Government",
      features: ["Online Booking", "Home Collection", "Digital Reports"]
    },
    {
      name: "Maharashtra Soil Testing Laboratory",
      address: "Aundh, Pune, Maharashtra 411007",
      distance: 4.2,
      rating: 4.5,
      contact: "+91 20 2588 9012",
      email: "soiltest.mh@gmail.com",
      timings: "8:30 AM - 6:00 PM",
      services: ["Complete Soil Analysis", "Water Testing", "Fertilizer Recommendation"],
      price: "₹200 - ₹800",
      waitTime: "1-2 days",
      availability: "Available",
      type: "Government",
      features: ["Express Service", "Multilingual Reports", "Expert Consultation"]
    },
    {
      name: "Krishi Vigyan Kendra - Pune",
      address: "Ganeshkhind, Pune, Maharashtra 411007",
      distance: 6.8,
      rating: 4.6,
      contact: "+91 20 2569 1234",
      email: "kvk.pune@icar.gov.in",
      timings: "9:00 AM - 4:30 PM",
      services: ["Soil Health Card", "Nutrient Management", "Crop Advisory"],
      price: "₹100 - ₹400",
      waitTime: "3-4 days",
      availability: "Busy",
      type: "Research",
      features: ["Free for Small Farmers", "Training Programs", "Follow-up Support"]
    },
    {
      name: "AgroTech Soil Labs",
      address: "Baner, Pune, Maharashtra 411045",
      distance: 8.1,
      rating: 4.3,
      contact: "+91 98765 43210",
      email: "info@agrotechsoil.com",
      timings: "8:00 AM - 7:00 PM",
      services: ["Advanced Soil Testing", "Precision Agriculture", "GPS Mapping"],
      price: "₹300 - ₹1200",
      waitTime: "Same Day",
      availability: "Available",
      type: "Private",
      features: ["Drone Sampling", "AI Analysis", "Mobile Lab Service"]
    },
    {
      name: "Rural Development Center",
      address: "Hadapsar, Pune, Maharashtra 411028",
      distance: 12.3,
      rating: 4.2,
      contact: "+91 20 2668 5678",
      email: "rdc.hadapsar@maharashtra.gov.in",
      timings: "10:00 AM - 5:00 PM",
      services: ["Basic Soil Testing", "Farmer Education", "Subsidy Programs"],
      price: "₹80 - ₹300",
      waitTime: "4-5 days",
      availability: "Available",
      type: "Government",
      features: ["Subsidized Rates", "Group Testing", "Field Visits"]
    },
    {
      name: "Green Valley Laboratories",
      address: "Kothrud, Pune, Maharashtra 411038",
      distance: 15.7,
      rating: 4.7,
      contact: "+91 98901 23456",
      email: "contact@greenvalleylabs.in",
      timings: "7:00 AM - 8:00 PM",
      services: ["Comprehensive Analysis", "Organic Certification", "Research Support"],
      price: "₹400 - ₹1500",
      waitTime: "1 day",
      availability: "Available",
      type: "Private",
      features: ["24/7 Support", "International Standards", "Research Collaboration"]
    }
  ];

  const filteredCenters = testingCenters
    .filter(center => 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (filterBy) {
        case 'distance': return a.distance - b.distance;
        case 'rating': return b.rating - a.rating;
        case 'price': return parseInt(a.price.split('₹')[1]) - parseInt(b.price.split('₹')[1]);
        default: return 0;
      }
    });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Busy': return 'bg-yellow-100 text-yellow-700';
      case 'Unavailable': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'bg-blue-100 text-blue-700';
      case 'Private': return 'bg-purple-100 text-purple-700';
      case 'Research': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-500 text-white shadow-lg">
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
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Nearest Soil Testing Centers</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Find Soil Testing Centers Near You
          </h2>
          <p className="text-xl text-gray-600">
            Locate government and private labs for comprehensive soil analysis and testing services
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  onClick={() => setViewMode('map')}
                  className="flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  Map View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        {viewMode === 'map' ? (
          // Map View
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Interactive Map View</h4>
                  <p className="text-gray-500">Soil testing centers in Pune region with pinned locations</p>
                </div>
                
                {/* Simulated map markers */}
                <div className="absolute top-20 left-32 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-24 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-24 left-20 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-40 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                
                {/* Location labels */}
                <div className="absolute top-16 left-40 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                  Pune Agricultural Research
                </div>
                <div className="absolute top-36 right-32 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                  Aundh Lab
                </div>
                <div className="absolute bottom-20 left-28 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                  KVK Pune
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // List View
          <div className="space-y-6">
            {filteredCenters.map((center, index) => (
              <Card key={index} className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Center Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{center.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{center.address}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{center.rating}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{center.distance} km away</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge className={getAvailabilityColor(center.availability)}>
                            {center.availability}
                          </Badge>
                          <Badge className={getTypeColor(center.type)}>
                            {center.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-bold text-sm text-gray-700 mb-2">Services Offered</h5>
                          <div className="flex flex-wrap gap-1">
                            {center.services.slice(0, 3).map((service, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {center.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{center.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-gray-700 mb-2">Special Features</h5>
                          <div className="flex flex-wrap gap-1">
                            {center.features.slice(0, 2).map((feature, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600">Price Range</p>
                          <p className="font-bold text-green-600">{center.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Turnaround</p>
                          <p className="font-bold">{center.waitTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timings</p>
                          <p className="font-bold text-sm">{center.timings}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-bold text-sm">{center.contact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      
                      <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Slot
                      </Button>
                      
                      <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>

                      {center.features.includes("Home Collection") && (
                        <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                          <User className="w-4 h-4 mr-2" />
                          Home Collection
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Info Section */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mt-8 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6">What to Expect from Soil Testing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">What Gets Tested</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• pH level and nutrient content</li>
                  <li>• NPK (Nitrogen, Phosphorus, Potassium)</li>
                  <li>• Organic matter and micronutrients</li>
                  <li>• Soil texture and water retention</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">Testing Process</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sample collection from multiple points</li>
                  <li>• Laboratory analysis (1-5 days)</li>
                  <li>• Digital report with recommendations</li>
                  <li>• Expert consultation available</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">What You'll Get</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Detailed soil health report</li>
                  <li>• Fertilizer recommendations</li>
                  <li>• Crop suitability analysis</li>
                  <li>• Follow-up guidance support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}