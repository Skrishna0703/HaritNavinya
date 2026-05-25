import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  ArrowLeft,
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Footer } from './Footer';

// Leaflet Popup Styles
const popupStyles = `
  .soil-popup .leaflet-popup-content-wrapper {
    background: white !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    padding: 0 !important;
  }
  .soil-popup .leaflet-popup-content {
    margin: 0 !important;
    width: 100% !important;
  }
  .soil-popup .leaflet-popup-tip {
    background: white !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = popupStyles;
  document.head.appendChild(styleTag);
}

// Custom marker icon
const createMarkerIcon = () => L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRUYwMDAwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEyIDJDNy4wMyAyIDMgNi4wMyAzIDExYzAgNS4yNSA5IDEzIDkgMTNzOSAtNy43NSA5IC0xM2MwIC00Ljk3IC00LjAzIC05IC05IC05em0wIDcuNWMtMC44MjggMCAtMS41IC0wLjY3MiAtMS41IC0xLjVzMC42NzIgLTEuNSAxLjUgLTEuNXMxLjUgMC42NzIgMS41IDEuNXMtMC42NzIgMS41IC0xLjUgMS41eiIvPjwvc3ZnPg==',
  iconSize: [32, 41],
  iconAnchor: [16, 41],
  popupAnchor: [0, -41],
  shadowUrl: undefined,
});

interface SoilTestingCentersProps {
  onBack: () => void;
}

export function SoilTestingCenters({ onBack }: SoilTestingCentersProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'coming-soon'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('distance');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [testingCenters, setTestingCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from MongoDB via API
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch from backend API instead of static JSON
        const apiUrl = import.meta.env.PROD ? 'https://haritnavinya.onrender.com' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        const response = await fetch(`${apiUrl}/api/testing-centers`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch testing centers from API');
        }
        
        const result = await response.json();
        const rawData = result.data || []; // API returns { success, data, count }
        
        // Transform the raw data to match component requirements
        const transformedData = rawData.map((center: any, index: number) => {
          // Parse state and district from database fields
          let district = center.district || 'Unknown';
          let state = center.state || 'Unknown';
          
          // Generate mock coordinates based on state (already in DB, but use them)
          const stateCoordinates: any = {
            'ARUNACHAL PRADESH': { lat: 28.2180, lng: 94.7278 },
            'ASSAM': { lat: 26.1445, lng: 91.7362 },
            'BIHAR': { lat: 25.0961, lng: 85.3131 },
            'CHHATTISGARH': { lat: 21.2787, lng: 81.8661 },
            'GOA': { lat: 15.2993, lng: 73.8243 },
            'GUJARAT': { lat: 22.2587, lng: 71.1924 },
            'HARYANA': { lat: 29.0588, lng: 77.0745 },
            'HIMACHAL PRADESH': { lat: 31.7433, lng: 77.1205 },
            'JHARKHAND': { lat: 23.6102, lng: 85.2799 },
            'KARNATAKA': { lat: 15.3173, lng: 75.7139 },
            'KERALA': { lat: 10.8505, lng: 76.2711 },
            'MADHYA PRADESH': { lat: 22.9375, lng: 78.6553 },
            'MAHARASHTRA': { lat: 19.7515, lng: 75.7139 },
            'MANIPUR': { lat: 24.6637, lng: 93.9063 },
            'MEGHALAYA': { lat: 25.4670, lng: 91.3662 },
            'MIZORAM': { lat: 23.1815, lng: 92.9789 },
            'NAGALAND': { lat: 26.1584, lng: 94.5624 },
            'ODISHA': { lat: 20.9517, lng: 85.0985 },
            'PUNJAB': { lat: 31.5497, lng: 74.3436 },
            'RAJASTHAN': { lat: 27.0238, lng: 74.2179 },
            'SIKKIM': { lat: 27.5330, lng: 88.5122 },
            'TAMIL NADU': { lat: 11.1271, lng: 78.6569 },
            'TELANGANA': { lat: 18.1124, lng: 79.0193 },
            'TRIPURA': { lat: 23.9408, lng: 91.9882 },
            'UTTAR PRADESH': { lat: 26.8467, lng: 80.9462 },
            'UTTARAKHAND': { lat: 30.0668, lng: 79.0193 },
            'WEST BENGAL': { lat: 24.8735, lng: 88.3063 }
          };
          
          const coords = stateCoordinates[state] || { lat: 20.5934, lng: 78.9629 };
          
          return {
            id: center._id || index + 1,
            name: center.name || 'Unknown Laboratory',
            state: state,
            district: district,
            address: center.address || 'Address not available',
            pincode: center.pincode || 'N/A',
            contact: center.phone || center.email || 'Contact not available',
            email: center.email || 'N/A',
            phone: center.phone || 'N/A',
            latitude: center.latitude || coords.lat,
            longitude: center.longitude || coords.lng,
            rating: center.rating || 4.5,
            services: center.services || [
              'Soil pH Testing',
              'Nutrient Testing',
              'Organic Matter Analysis',
              'Heavy Metal Testing'
            ],
            features: ['Certified Laboratory', 'Government Accredited'],
            price: '₹150 - ₹600',
            turnaround: '2-3 days',
            timings: center.operatingHours?.open + ' - ' + center.operatingHours?.close || '9:00 AM - 5:00 PM',
            type: 'Government',
            availability: Math.random() > 0.3 ? 'Available' : 'Busy',
            distance: Math.floor(Math.random() * 50) + 5,
            waitTime: Math.floor(Math.random() * 3) + 1 + ' days'
          };
        });
        
        setTestingCenters(transformedData);
      } catch (error) {
        console.error('Error loading soil testing centers:', error);
        setTestingCenters([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique states
  const states = Array.from(new Set(testingCenters.map(center => center.state))).sort();

  // Get unique districts for selected state
  const districts = selectedState 
    ? Array.from(new Set(
        testingCenters
          .filter(center => center.state === selectedState)
          .map(center => center.district)
      )).sort()
    : [];

  const filteredCenters = testingCenters
    .filter(center => {
      const matchesSearch = 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = !selectedState || center.state === selectedState;
      const matchesDistrict = !selectedDistrict || center.district === selectedDistrict;
      
      return matchesSearch && matchesState && matchesDistrict;
    })
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
    <div className="flex flex-col min-h-screen bg-white font-['Poppins',sans-serif]">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading Soil Testing Centers Across India...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
          </div>
        </div>
      )}
      
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
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
            <div className="flex flex-col gap-4">
              {/* First Row: Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Second Row: Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-3 items-center flex-wrap">
                  {/* State Filter */}
                  <div className="flex items-center gap-2 min-w-max">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <Select value={selectedState} onValueChange={(value: string) => {
                      setSelectedState(value);
                      setSelectedDistrict(''); // Reset district when state changes
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Filter */}
                  {selectedState && (
                    <div className="flex items-center gap-2 min-w-max">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Sort Filter */}
                  <div className="flex items-center gap-2 min-w-max">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  {(selectedState || selectedDistrict || searchQuery) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedState('');
                        setSelectedDistrict('');
                        setSearchQuery('');
                      }}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* View Mode Buttons */}
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
                  <Button
                    variant={viewMode === 'coming-soon' ? 'default' : 'outline'}
                    onClick={() => setViewMode('coming-soon')}
                    className="flex items-center gap-2"
                  >
                    <span className="text-base">⭐</span>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium">Total Centers</p>
              <p className="text-2xl font-bold text-blue-600">{testingCenters.length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-medium">States/UTs</p>
              <p className="text-2xl font-bold text-green-600">{states.length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-medium">Showing</p>
              <p className="text-2xl font-bold text-purple-600">{filteredCenters.length}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-orange-600">
                {testingCenters.length > 0 
                  ? (testingCenters.reduce((sum, c) => sum + c.rating, 0) / testingCenters.length).toFixed(1)
                  : '0'}
              </p>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(selectedState || selectedDistrict || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-blue-200 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {searchQuery && (
                <Badge className="bg-blue-500 text-white">Search: "{searchQuery}"</Badge>
              )}
              {selectedState && (
                <Badge className="bg-green-500 text-white">{selectedState}</Badge>
              )}
              {selectedDistrict && (
                <Badge className="bg-purple-500 text-white">{selectedDistrict}</Badge>
              )}
            </div>
          )}
          
          {filteredCenters.length === 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-red-500 font-semibold text-center">❌ No centers found. Try adjusting your filters.</p>
            </div>
          )}
        </div>

        {/* Content Area */}
        {viewMode === 'coming-soon' ? (
          // Coming Soon View
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-12">
              <div className="text-center max-w-2xl mx-auto py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">⭐</span>
                </div>
                
                <h3 className="text-4xl font-bold text-gray-900 mb-3">Featured Centers Coming Soon!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  We're curating the best soil testing centers with premium features and enhanced services for you.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
                  <p className="text-gray-700 mb-4 font-medium">Coming features:</p>
                  <ul className="text-left space-y-3 text-gray-600 max-w-lg mx-auto">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Premium & certified testing centers nationwide
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Real-time booking & appointment system
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Home sample collection service
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Instant digital report delivery
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-600">🏥</p>
                    <p className="text-sm text-gray-600">Premium Labs</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-600">🚗</p>
                    <p className="text-sm text-gray-600">Home Pickup</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-600">📄</p>
                    <p className="text-sm text-gray-600">Quick Reports</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setViewMode('list')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 text-lg rounded-lg hover:shadow-lg transition-all"
                >
                  Explore Available Centers
                </Button>

                <p className="text-sm text-gray-500 mt-6">
                  🚀 Premium features launching very soon • Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'map' ? (
          // Interactive Leaflet Map View
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-0 h-full">
              <div style={{ width: '100%', height: '600px', borderRadius: '1.5rem', overflow: 'hidden' }}>
                <MapContainer 
                  center={[20.5934, 78.9629]} 
                  zoom={5} 
                  style={{ width: '100%', height: '100%' }}
                  className="rounded-2xl"
                >
                  {/* Street Map Tiles */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Markers for each testing center */}
                  {filteredCenters.map((center, index) => (
                    <Marker 
                      key={index}
                      position={[center.latitude, center.longitude]}
                      icon={createMarkerIcon()}
                    >
                      <Popup className="soil-popup">
                        <div className="w-64 p-2">
                          <p className="font-bold text-lg text-gray-800">{center.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{center.address}</p>
                          <p className="text-sm text-gray-600">{center.district}, {center.state} {center.pincode}</p>
                          
                          <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-bold text-green-600">{center.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-600">Type: {center.type}</span>
                          </div>

                          {center.phone && center.phone !== 'N/A' && (
                            <p className="text-sm font-semibold text-gray-700 mt-2">
                              📞 {center.phone}
                            </p>
                          )}
                          {center.email && center.email !== 'N/A' && (
                            <p className="text-sm text-gray-600">
                              ✉️ {center.email}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            💰 {center.price} | ⏱️ {center.turnaround}
                          </p>

                          <button
                            onClick={() => window.open(`https://www.google.com/maps/search/${center.name}/@${center.latitude},${center.longitude},15z`, '_blank')}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" />
                            Get Directions
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Info Bar Below Map */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-t border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-gray-800">{filteredCenters.length} Centers Showing</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Across {states.length} States/UTs</span> across All India
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">📍 Click on markers to view details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // List View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header with Name and Location */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{center.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{center.district}, {center.state}</span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      {/* Phone */}
                      {center.phone && center.phone !== 'N/A' && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-green-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.797l.291 2.055a1 1 0 01-.471 1.023l-1.97 1.318a8 8 0 007.467 7.467l1.318-1.97a1 1 0 011.023-.471l2.055.291a1 1 0 01.797.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                          </div>
                          <a href={`tel:${center.phone}`} className="text-sm font-medium text-gray-700 hover:text-green-600">
                            {center.phone}
                          </a>
                        </div>
                      )}

                      {/* Email */}
                      {center.email && center.email !== 'N/A' && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                          </div>
                          <a href={`mailto:${center.email}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 break-all">
                            {center.email}
                          </a>
                        </div>
                      )}

                      {/* Address */}
                      <div className="flex gap-3">
                        <div className="w-5 h-5 text-red-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{center.address}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Additional Info and Button */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="text-gray-600">Rating</div>
                          <div className="font-bold text-blue-600 flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {center.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <div className="text-gray-600">Type</div>
                          <div className="font-bold text-green-600">{center.type}</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => window.open(`https://www.google.com/maps/search/${center.name}/@${center.latitude},${center.longitude},15z`, '_blank')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}