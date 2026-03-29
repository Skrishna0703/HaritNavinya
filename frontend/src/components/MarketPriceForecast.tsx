import React, { useState, useEffect } from 'react';
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
  Carrot,
  Loader
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MarketPrice {
  market: string;
  state: string;
  commodity: string;
  price: number;
  min_price: number;
  max_price: number;
  date: string;
  change?: string | number;
  volume?: number;
  unit?: string;
}

interface StateData {
  state: string;
  prices: MarketPrice[];
  topGainers: any[];
  topLosers: any[];
}

interface MarketPriceForecastProps {
  onBack: () => void;
}

const DEFAULT_STATES = [
  // States
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry", "Ladakh"
];

const DEFAULT_COMMODITIES = [
  "Onion", "Potato", "Rice", "Wheat", "Chilli", 
  "Garlic", "Ginger", "Tomato", "Cabbage", "Carrot"
];

export function MarketPriceForecast({ onBack }: MarketPriceForecastProps) {
  const [viewMode, setViewMode] = useState<'all-india' | 'single-state' | 'all-crops'>('all-india'); // Toggle between views
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(""); // For single state view
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [top5Crops, setTop5Crops] = useState<Array<{ commodity: string; maxPrice: number; avgPrice: number; records: number }>>([]);
  const [top5Loading, setTop5Loading] = useState(false);
  
  // All India view states
  const [allStatesData, setAllStatesData] = useState<StateData[]>([]);
  const [allIndiaLoading, setAllIndiaLoading] = useState(false);
  
  // All crops view states
  const [allCropsData, setAllCropsData] = useState<{ [state: string]: MarketPrice[] }>({});
  const [allCropsLoading, setAllCropsLoading] = useState(false);

  //  Fetch available states and commodities on mount
  useEffect(() => {
    fetchAvailableData();
    fetchAllIndiaData(); // Fetch All India data on mount
    // Don't fetch all crops on mount - only when user clicks the tab
  }, []);

  // Fetch commodities for the newly selected state
  useEffect(() => {
    if (selectedState) {
      fetchCommoditiesForState(selectedState);
    }
  }, [selectedState]);

  // Fetch real mandi prices when state or commodity changes
  useEffect(() => {
    // Don't fetch if state or commodity haven't been set yet
    if (selectedState && selectedCommodity) {
      fetchMandiPrices();
    }
  }, [selectedState, selectedCommodity]);

  // Fetch top 5 crops for the state
  useEffect(() => {
    if (selectedState && availableCommodities.length > 0) {
      fetchTop5Crops();
    }
  }, [selectedState, availableCommodities]);

  // Fetch all crops data only when user clicks "All Crops Prices" tab
  useEffect(() => {
    if (viewMode === 'all-crops' && Object.keys(allCropsData).length === 0) {
      fetchAllCrops();
    }
  }, [viewMode]);

  const fetchAvailableData = async () => {
    try {
      // Fetch available states
      const statesRes = await fetch('http://localhost:5000/api/available-states', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      let states = DEFAULT_STATES;
      let selectedStateValue = 'Maharashtra';
      
      if (statesRes.ok) {
        const statesData = await statesRes.json();
        if (statesData.states && statesData.states.length > 0) {
          states = statesData.states;
          selectedStateValue = states[0]; // Use first available state from API
        }
      }
      setAvailableStates(states);
      setSelectedState(selectedStateValue);

      // Fetch available commodities for the selected state
      const commoditiesRes = await fetch(`http://localhost:5000/api/available-commodities?state=${selectedStateValue}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      let commodities = DEFAULT_COMMODITIES;
      let selectedCommodityValue = 'Onion';
      
      if (commoditiesRes.ok) {
        const commoditiesData = await commoditiesRes.json();
        if (commoditiesData.commodities && commoditiesData.commodities.length > 0) {
          commodities = commoditiesData.commodities;
          selectedCommodityValue = commodities[0]; // Use first available commodity
        }
      }
      setAvailableCommodities(commodities);
      setSelectedCommodity(selectedCommodityValue);
    } catch (err) {
      console.warn('Could not fetch available data, using defaults:', err);
      setAvailableStates(DEFAULT_STATES);
      setAvailableCommodities(DEFAULT_COMMODITIES);
      setSelectedState('Maharashtra');
      setSelectedCommodity('Onion');
    }
  }

  const fetchCommoditiesForState = async (state: string) => {
    try {
      const commoditiesRes = await fetch(`http://localhost:5000/api/available-commodities?state=${state}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      let commodities = DEFAULT_COMMODITIES;
      
      if (commoditiesRes.ok) {
        const commoditiesData = await commoditiesRes.json();
        if (commoditiesData.commodities && commoditiesData.commodities.length > 0) {
          commodities = commoditiesData.commodities;
          setSelectedCommodity(commodities[0]); // Select first commodity for new state
        }
      }
      setAvailableCommodities(commodities);
    } catch (err) {
      console.warn(`Could not fetch commodities for state ${state}:`, err);
      setAvailableCommodities(DEFAULT_COMMODITIES);
      setSelectedCommodity('Onion');
    }
  }

  const fetchMandiPrices = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Use the new dashboard endpoint on port 5000
      const apiUrl = `http://localhost:5000/api/dashboard?state=${selectedState}&commodity=${selectedCommodity}`;
      console.log("🔍 Fetching from:", apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ Dashboard data received:", data);
      
      // Parse the new response format: todayPrices, topGainers, topLosers, priceTrends
      if (data.success && data.todayPrices) {
        setPrices(data.todayPrices);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      let errorMsg = "Failed to fetch prices - ";
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMsg += "Request timeout (API took too long)";
        } else {
          errorMsg += err.message;
        }
      } else {
        errorMsg += "Unknown error occurred";
      }
      
      setError(errorMsg);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTop5Crops = async () => {
    try {
      setTop5Loading(true);
      
      // Skip if no commodities available yet
      if (!availableCommodities || availableCommodities.length === 0) {
        setTop5Crops([]);
        return;
      }
      
      // Fetch all commodities for this state using market-data endpoint
      const cropsData: { [key: string]: { maxPrice: number; avgPrice: number; records: number; prices: number[] } } = {};
      
      for (const commodity of availableCommodities) {
        try {
          // Use the new market-data endpoint on port 5000
          const apiUrl = `http://localhost:5000/api/market-data?state=${selectedState}&commodity=${commodity}&limit=100`;
          console.log(`🔍 Fetching ${commodity} data...`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Response for ${commodity}:`, data);
            
            // Parse the new response format
            const marketData = data.data || [];
            console.log(`${commodity} raw data:`, marketData);
            
            // Extract and convert prices to numbers
            const priceList = marketData
              .map((record: any) => {
                // Handle both modalPrice and price fields
                const priceValue = record.modalPrice || record.price || 0;
                const parsed = typeof priceValue === 'string' 
                  ? parseFloat(priceValue.toString().replace(/,/g, ''))
                  : Number(priceValue);
                return !isNaN(parsed) && parsed > 0 ? parsed : null;
              })
              .filter((p: number | null): p is number => p !== null && p > 0);
            
            console.log(`${commodity} converted prices:`, priceList);
            
            if (priceList.length > 0) {
              const maxPrice = Math.max(...priceList);
              const avgPrice = priceList.reduce((a: number, b: number) => a + b, 0) / priceList.length;
              cropsData[commodity] = {
                maxPrice,
                avgPrice,
                records: priceList.length,
                prices: priceList
              };
              console.log(`${commodity}: Max=${maxPrice}, Avg=${avgPrice.toFixed(2)}, Records=${priceList.length}`);
            }
          } else {
            console.warn(`API returned status ${response.status} for ${commodity}`);
          }
        } catch (err) {
          console.warn(`Could not fetch ${commodity}:`, err instanceof Error ? err.message : err);
        }
      }
      
      console.log("All crops data:", cropsData);
      
      // Get top 5 by max price
      const sortedCrops = Object.entries(cropsData)
        .map(([commodity, data]) => ({
          commodity,
          maxPrice: data.maxPrice,
          avgPrice: Math.round(data.avgPrice),
          records: data.records
        }))
        .sort((a, b) => b.maxPrice - a.maxPrice)
        .slice(0, 5);
      
      console.log("Top 5 crops:", sortedCrops);
      setTop5Crops(sortedCrops);
    } catch (err) {
      console.error("Error fetching top 5 crops:", err instanceof Error ? err.message : err);
      setTop5Crops([]);
    } finally {
      setTop5Loading(false);
    }
  };

  const fetchAllIndiaData = async () => {
    try {
      setAllIndiaLoading(true);
      
      // Get list of available states first
      const statesRes = await fetch('http://localhost:5000/api/available-states', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!statesRes.ok) {
        throw new Error('Failed to fetch available states');
      }
      
      const statesData = await statesRes.json();
      const states = statesData.states || [];
      
      console.log(`📍 Fetching data for ${states.length} states...`);
      
      // Fetch data for each state
      const stateDataPromises = states.map(async (state: string) => {
        try {
          const response = await fetch(`http://localhost:5000/api/dashboard?state=${state}&commodity=All`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          });
          
          if (response.ok) {
            const data = await response.json();
            return {
              state,
              prices: data.todayPrices || [],
              topGainers: data.topGainers || [],
              topLosers: data.topLosers || []
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch data for ${state}:`, err);
        }
        
        return {
          state,
          prices: [],
          topGainers: [],
          topLosers: []
        };
      });
      
      const allData = await Promise.all(stateDataPromises);
      setAllStatesData(allData.filter(d => d.prices.length > 0));
    } catch (err) {
      console.error("Error fetching all India data:", err instanceof Error ? err.message : err);
      setAllStatesData([]);
    } finally {
      setAllIndiaLoading(false);
    }
  };

  const fetchAllCrops = async () => {
    try {
      setAllCropsLoading(true);
      const cropsDataByState: { [state: string]: MarketPrice[] } = {};
      
      // Get list of available states
      const statesRes = await fetch('http://localhost:5000/api/available-states', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!statesRes.ok) {
        throw new Error('Failed to fetch available states');
      }
      
      const statesData = await statesRes.json();
      const states = statesData.states || [];
      
      console.log(`🌾 Fetching all crops for ${states.length} states...`);
      
      // Fetch data for each state using dashboard endpoint (more efficient)
      const stateDataPromises = states.map(async (state: string) => {
        try {
          // Use dashboard endpoint to get all commodities for a state at once
          const dashboardRes = await fetch(
            `http://localhost:5000/api/dashboard?state=${state}&commodity=All`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(15000)
            }
          );
          
          if (!dashboardRes.ok) {
            console.warn(`Dashboard fetch failed for ${state}`);
            return { state, data: [] };
          }
          
          const dashboardData = await dashboardRes.json();
          const todayPrices = dashboardData.todayPrices || [];
          
          if (todayPrices.length > 0) {
            console.log(`✅ State: ${state}, Commodities: ${todayPrices.length}`);
            return { state, data: todayPrices };
          }
          
          // Fallback: if dashboard doesn't return prices, fetch commodities and get market data
          const commoditiesRes = await fetch(
            `http://localhost:5000/api/available-commodities?state=${state}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(10000)
            }
          );
          
          if (!commoditiesRes.ok) {
            return { state, data: [] };
          }
          
          const commoditiesData = await commoditiesRes.json();
          const commodities = commoditiesData.commodities || [];
          
          console.log(`📦 State: ${state}, Commodities: ${commodities.length}`);
          
          const stateAllPrices: MarketPrice[] = [];
          
          // Fetch prices for multiple commodities in parallel (limit to 10 at a time)
          const commodityBatches = [];
          for (let i = 0; i < commodities.length; i += 10) {
            commodityBatches.push(commodities.slice(i, i + 10));
          }
          
          for (const batch of commodityBatches) {
            const batchPromises = batch.map(async (commodity: string) => {
              try {
                const pricesRes = await fetch(
                  `http://localhost:5000/api/market-data?state=${state}&commodity=${commodity}&limit=100`,
                  {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(8000)
                  }
                );
                
                if (pricesRes.ok) {
                  const pricesData = await pricesRes.json();
                  const records = pricesData.data || [];
                  
                  if (records.length > 0) {
                    // Get the latest record
                    const record = records[records.length - 1];
                    const price = typeof record.modalPrice === 'string' 
                      ? parseFloat(record.modalPrice.replace(/,/g, ''))
                      : record.modalPrice || record.price || 0;
                    
                    return {
                      market: record.market || 'N/A',
                      state: state,
                      commodity: commodity,
                      price: Math.round(price),
                      min_price: record.minPrice || 0,
                      max_price: record.maxPrice || 0,
                      date: record.date || new Date().toISOString().split('T')[0]
                    };
                  }
                }
              } catch (err) {
                console.warn(`Could not fetch ${commodity} for ${state}:`, err);
              }
              return null;
            });
            
            const batchResults = await Promise.all(batchPromises);
            stateAllPrices.push(...batchResults.filter((p): p is MarketPrice => p !== null));
          }
          
          return { state, data: stateAllPrices };
        } catch (err) {
          console.error(`Error fetching data for ${state}:`, err);
          return { state, data: [] };
        }
      });
      
      // Execute all state fetches in parallel with promise batching
      const stateResults = await Promise.all(stateDataPromises);
      
      // Process results
      stateResults.forEach(({ state, data }) => {
        if (data.length > 0) {
          cropsDataByState[state] = data.sort((a: MarketPrice, b: MarketPrice) => b.price - a.price);
        }
      });
      
      setAllCropsData(cropsDataByState);
      console.log("✅ All crops data fetched:", cropsDataByState);
    } catch (err) {
      console.error("Error fetching all crops:", err instanceof Error ? err.message : err);
      setAllCropsData({});
    } finally {
      setAllCropsLoading(false);
    }
  };

  // Transform prices to chart data from the new response format
  const priceData = prices.slice(0, 6).map((p: MarketPrice, i: number) => ({
    date: `Day ${i + 1}`,
    price: p.price || 0
  }));

  // Helper function to parse the change percentage from format "+2.94%" or "-1.23%"
  const parseChangePercent = (changeStr: any): number => {
    if (!changeStr) return 0;
    if (typeof changeStr === 'number') return changeStr;
    // Remove +, -, and % characters and parse
    const cleaned = changeStr.toString().replace(/[+%]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Get statistics from the new prices format
  const todayPricesDisplay = prices.slice(0, 6).map((p: MarketPrice, index: number) => ({
    crop: p.commodity || 'Unknown',
    market: p.market || "N/A",
    price: p.price || 0,
    min: p.min_price || (p.price * 0.95), // Use min_price if available
    max: p.max_price || (p.price * 1.05), // Use max_price if available
    change: parseChangePercent(p.change),
    icon: Wheat,
    color: ["from-yellow-400 to-orange-500", "from-green-400 to-emerald-500", "from-blue-400 to-cyan-500", 
            "from-purple-400 to-pink-500", "from-red-400 to-orange-500", "from-indigo-400 to-purple-500"][index % 6],
    volume: p.volume && p.volume > 0 ? `${p.volume} ${p.unit || 'Tonnes'}` : "N/A"
  }));

  // Top gainers and losers from the new response
  const topGainers = prices
    .filter((p: MarketPrice) => parseChangePercent(p.change) > 0)
    .slice(0, 3)
    .map((p: MarketPrice) => ({
      crop: p.commodity || 'Unknown',
      change: parseChangePercent(p.change),
      price: p.price || 0
    }));

  const topLosers = prices
    .filter((p: MarketPrice) => parseChangePercent(p.change) < 0)
    .slice(0, 3)
    .map((p: MarketPrice) => ({
      crop: p.commodity || 'Unknown',
      change: parseChangePercent(p.change),
      price: p.price || 0
    }));

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

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <Button
            onClick={() => setViewMode('all-india')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              viewMode === 'all-india'
                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MapPin className="w-4 h-4 mr-2 inline-block" />
            All India Overview
          </Button>
          <Button
            onClick={() => setViewMode('all-crops')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              viewMode === 'all-crops'
                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Wheat className="w-4 h-4 mr-2 inline-block" />
            All Crops Prices
          </Button>
          <Button
            onClick={() => setViewMode('single-state')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              viewMode === 'single-state'
                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-2 inline-block" />
            State-wise Details
          </Button>
        </div>

        {/* Filters - Only show for single state view */}
        {viewMode === 'single-state' && (
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map((state: string) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Commodity" />
              </SelectTrigger>
              <SelectContent>
                {availableCommodities.map((commodity: string) => (
                  <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="w-full text-center text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>
        )}

        {/* All India View */}
        {viewMode === 'all-india' && (
        <div>
          {allIndiaLoading ? (
            <div className="flex justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : allStatesData.length > 0 ? (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center mb-8">State-wise Market Prices Across India</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allStatesData.map((stateData) => (
                  <Card key={stateData.state} className="border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-gray-800">{stateData.state}</h4>
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-semibold">Top Commodity</p>
                          {stateData.prices.length > 0 && (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg">
                              <p className="font-bold text-lg text-gray-800">{stateData.prices[0].commodity}</p>
                              <p className="text-2xl font-bold text-orange-600">₹{stateData.prices[0].price.toLocaleString()}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Change: <span className={stateData.prices[0].change?.includes('-') ? 'text-red-600' : 'text-green-600'}>
                                  {stateData.prices[0].change}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-semibold">Top Gainer</p>
                          {stateData.topGainers.length > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                              <p className="font-bold text-gray-800">{stateData.topGainers[0].commodity}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-bold">{stateData.topGainers[0].change}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2 font-semibold">Total Commodities</p>
                          <p className="text-2xl font-bold text-blue-600">{stateData.prices.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p>Loading all India data...</p>
            </div>
          )}
        </div>
        )}

        {/* All Crops View - Table of all crops and their prices by state */}
        {viewMode === 'all-crops' && (
        <div className="w-full">
          <h3 className="text-3xl font-bold text-center mb-8">All Crops - State-wise Market Prices</h3>
          
          {allCropsLoading ? (
            <div className="text-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading all crops data for all states...</p>
            </div>
          ) : Object.keys(allCropsData).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(allCropsData).map(([state, crops]) => (
                <Card key={state} className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {state}
                      <Badge className="ml-auto bg-blue-100 text-blue-700">{crops.length} crops</Badge>
                    </h4>
                    
                    {/* Responsive table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Commodity</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Market Price (₹)</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Min Price (₹)</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Max Price (₹)</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Market</th>
                          </tr>
                        </thead>
                        <tbody>
                          {crops.map((crop, idx) => (
                            <tr key={`${state}-${crop.commodity}-${idx}`} className="border-b border-gray-200 hover:bg-gray-50 transition">
                              <td className="py-3 px-4 font-medium text-gray-800">{crop.commodity}</td>
                              <td className="text-right py-3 px-4">
                                <span className="font-bold text-lg text-orange-600">
                                  ₹{(crop.price || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="text-right py-3 px-4 text-gray-600">₹{(crop.min_price || 0).toLocaleString()}</td>
                              <td className="text-right py-3 px-4 text-gray-600">₹{(crop.max_price || 0).toLocaleString()}</td>
                              <td className="text-center py-3 px-4">
                                <Badge variant="outline" className="text-xs">{crop.market || 'N/A'}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p>Loading crop prices...</p>
            </div>
          )}
        </div>
        )}

        {/* Price Chart - Only show for single state view */}
        {viewMode === 'single-state' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Current Market Prices</h3>
                  {loading && <Loader className="w-5 h-5 animate-spin text-blue-600" />}
                </div>
                
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading market prices...</p>
                    </div>
                  </div>
                ) : priceData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceData}>
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
                          dataKey="price" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-4 text-green-700">Top Gainers Today</h4>
                  <div className="space-y-3">
                    {topGainers.map((item: any, index: number) => (
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
                    {topLosers.map((item: any, index: number) => (
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
            <h3 className="text-2xl font-bold mb-6 text-center">Top 5 Highest Prices by Crop - {selectedState}</h3>
            {top5Loading ? (
              <div className="flex justify-center py-16">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : top5Crops.length > 0 ? (
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-8">
                <CardContent className="p-8">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={top5Crops}
                      margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="commodity" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip 
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        contentStyle={{ 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px'
                        }}
                        formatter={(value: any) => `₹${value}`}
                      />
                      <Bar 
                        dataKey="maxPrice" 
                        fill="#f59e0b" 
                        radius={[8, 8, 0, 0]}
                        name="Max Price (Last 7 Days)"
                      />
                      <Bar 
                        dataKey="avgPrice" 
                        fill="#10b981" 
                        radius={[8, 8, 0, 0]}
                        name="Avg Price"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {top5Crops.map((crop, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-2xl border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-gray-800">{crop.commodity}</h4>
                        <Badge className="bg-orange-100 text-orange-700">#{idx + 1}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Max Price:</span>
                          <span className="font-bold text-orange-600">₹{crop.maxPrice.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Avg Price:</span>
                          <span className="font-bold text-green-600">₹{crop.avgPrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Records:</span>
                          <span>{crop.records} markets</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16 text-gray-500">
              No price data available for {selectedState}
            </div>
          )}
        </div>

        {/* Today's Prices Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Today's Market Prices - {selectedState}</h3>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : todayPricesDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayPricesDisplay.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={index}
                    className="border-0 shadow-xl rounded-3xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)` } as any}
                  >
                    <CardContent className="p-6 text-gray-900 relative">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-gray-800" />
                          </div>
                          <Badge 
                            className={`${
                              item.change > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            } border-0`}
                          >
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <h4 className="text-xl font-bold mb-1">{item.crop}</h4>
                        <p className="text-xs opacity-80 mb-3">{item.market}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                            <span className="text-sm opacity-70">per qt</span>
                          </div>
                          <div className="text-xs opacity-70">
                            Min: ₹{Math.round(item.min)} | Max: ₹{Math.round(item.max)}
                          </div>
                          <div className="flex items-center gap-2 text-sm opacity-70">
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
          ) : (
            <div className="text-center py-16 text-gray-500">
              No prices available for {selectedCommodity} in {selectedState}
            </div>
          )}
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
        )}
      </div>
    </div>
  );
}