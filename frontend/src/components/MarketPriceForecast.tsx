import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  ArrowLeft,
  MapPin,
  Wheat,
  Loader,
  AlertTriangle
} from "lucide-react";

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

export function MarketPriceForecast({ onBack }: MarketPriceForecastProps) {
  const [viewMode, setViewMode] = useState<'all-india' | 'all-crops'>('all-india'); // Toggle between views
  const [allStatesData, setAllStatesData] = useState<StateData[]>([]);
  const [allIndiaLoading, setAllIndiaLoading] = useState(false);
  const [allIndiaError, setAllIndiaError] = useState("");
  
  // All crops view states
  const [allCropsData, setAllCropsData] = useState<{ [state: string]: MarketPrice[] }>({});
  const [allCropsLoading, setAllCropsLoading] = useState(false);
  const [allCropsError, setAllCropsError] = useState("");

  // Fetch All India data on mount
  useEffect(() => {
    fetchAllIndiaData(); // Fetch All India data on mount
    // Don't fetch all crops on mount - only when user clicks the tab
  }, []);

  // Fetch all crops data only when user clicks "All Crops Prices" tab
  useEffect(() => {
    if (viewMode === 'all-crops' && Object.keys(allCropsData).length === 0) {
      fetchAllCrops();
    }
  }, [viewMode]);

  const fetchAllIndiaData = async () => {
    try {
      setAllIndiaLoading(true);
      
      // Get list of available states first
      const statesRes = await fetch('http://localhost:5000/api/available-states', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!statesRes.ok) {
        throw new Error('Failed to fetch available states');
      }
      
      const statesData = await statesRes.json();
      let states = statesData.states || [];
      
      // Load all states (no filtering)
      console.log(`📍 Fetching data for ${states.length} states...`);
      
      // Fetch data for each state with longer timeout for all 36 states
      const stateDataPromises = states.map(async (state: string) => {
        try {
          const response = await fetch(`http://localhost:5000/api/dashboard?state=${state}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(45000)
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
      setAllIndiaError("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch data from server";
      console.error("Error fetching all India data:", errorMsg);
      setAllIndiaError(errorMsg);
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
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!statesRes.ok) {
        throw new Error('Failed to fetch available states');
      }
      
      const statesData = await statesRes.json();
      let states = statesData.states || [];
      
      // Load all states
      console.log(`🌾 Fetching all crops for ${states.length} states...`);
      
      // Fetch data for each state
      const stateDataPromises = states.map(async (state: string) => {
        try {
          // Use dashboard endpoint to get all commodities for a state
          const mandiRes = await fetch(
            `http://localhost:5000/api/dashboard?state=${state}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(45000)
            }
          );
          
          if (!mandiRes.ok) {
            console.warn(`Mandi fetch failed for ${state}`);
            return { state, data: [] };
          }
          
          const mandiData = await mandiRes.json();
          const prices = mandiData.todayPrices || [];
          
          if (prices.length > 0) {
            console.log(`✅ State: ${state}, Commodities: ${prices.length}`);
            return { state, data: prices };
          }
          
          return { state, data: [] };
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
      setAllCropsError("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch data from server";
      console.error("Error fetching all crops:", errorMsg);
      setAllCropsError(errorMsg);
      setAllCropsData({});
    } finally {
      setAllCropsLoading(false);
    }
  };

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
                ? 'bg-blue-600 text-black shadow-lg hover:bg-blue-700'
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
                ? 'bg-blue-600 text-Green shadow-lg hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Wheat className="w-4 h-4 mr-2 inline-block" />
            All Crops Prices
          </Button>

        </div>



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
            <div className="text-center py-16">
              {allIndiaError ? (
                <div className="text-red-600">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
                  <p className="font-semibold">Failed to fetch data from server</p>
                  <p className="text-sm mt-2">{allIndiaError}</p>
                  <Button 
                    onClick={() => fetchAllIndiaData()} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p>Loading all India data...</p>
                </>
              )}
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
            <div className="text-center py-16">
              {allCropsError ? (
                <div className="text-red-600">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
                  <p className="font-semibold">Failed to fetch crop data from server</p>
                  <p className="text-sm mt-2">{allCropsError}</p>
                  <Button 
                    onClick={() => fetchAllCrops()} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading crop prices...</p>
                </>
              )}
            </div>
          )}
        </div>
        )}


      </div>
    </div>
  );
}