# Frontend Integration Guide - Mandi Price API

## Complete Example Code for Frontend

### 1. React Hook for Fetching Mandi Prices

```typescript
// hooks/useMandiPrices.ts

import { useState, useCallback } from 'react';

interface MandiRecord {
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  price: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  date: string;
  arrival_quantity: string;
}

interface MandiResponse {
  success: boolean;
  data: MandiRecord[];
  total: number;
  count: number;
  limit: number;
  offset: number;
  filters: {
    state: string | null;
    commodity: string | null;
  };
}

interface UseMandiPricesOptions {
  state?: string;
  commodity?: string;
  limit?: number;
  offset?: number;
}

export function useMandiPrices() {
  const [prices, setPrices] = useState<MandiRecord[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:4000/api/mandi';

  // Fetch prices with filters
  const fetchPrices = useCallback(async (options: UseMandiPricesOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.state) params.append('state', options.state);
      if (options.commodity) params.append('commodity', options.commodity);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: MandiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch prices');
      }

      setPrices(data.data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching mandi prices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch available states
  const fetchStates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/states`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch states');
      }

      setStates(data.data);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch commodities (optionally filtered by state)
  const fetchCommodities = useCallback(async (state?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = state 
        ? `${API_BASE}/commodities?state=${encodeURIComponent(state)}`
        : `${API_BASE}/commodities`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch commodities');
      }

      setCommodities(data.data);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get price trends
  const fetchTrends = useCallback(async (state: string, commodity: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        state,
        commodity
      });

      const response = await fetch(`${API_BASE}/trends?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch trends');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prices,
    states,
    commodities,
    loading,
    error,
    fetchPrices,
    fetchStates,
    fetchCommodities,
    fetchTrends
  };
}
```

---

### 2. Mandi Price Display Component

```typescript
// components/MandiPrices.tsx

import { useState, useEffect } from 'react';
import { useMandiPrices } from '../hooks/useMandiPrices';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MandiPrices() {
  const { prices, states, commodities, loading, error, fetchPrices, fetchStates, fetchCommodities } = useMandiPrices();
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');

  // Load states on mount
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Load commodities when state changes
  useEffect(() => {
    if (selectedState) {
      fetchCommodities(selectedState);
    }
  }, [selectedState, fetchCommodities]);

  // Fetch prices when filters change
  useEffect(() => {
    fetchPrices({
      state: selectedState,
      commodity: selectedCommodity,
      limit: 50
    });
  }, [selectedState, selectedCommodity, fetchPrices]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Agricultural Mandi Prices</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Select State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- All States --</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Commodity Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Commodity</label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- All Commodities --</option>
            {commodities.map((commodity) => (
              <option key={commodity} value={commodity}>
                {commodity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">⏳</div>
          <p className="ml-2">Loading prices...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Price List */}
      {!loading && prices.length > 0 && (
        <div className="space-y-4">
          <p className="text-gray-600">Showing {prices.length} prices</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((price, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{price.market}</h3>
                      <p className="text-sm text-gray-600">{price.district}, {price.state}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {price.commodity}
                    </Badge>
                  </div>

                  {/* Prices */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-3xl font-bold text-green-700 mb-2">
                      ₹{price.price}
                    </p>
                    <p className="text-sm text-gray-600">Modal Price</p>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <p className="text-gray-600">Min</p>
                        <p className="font-semibold text-red-600">₹{price.min_price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Max</p>
                        <p className="font-semibold text-green-600">₹{price.max_price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{price.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{price.arrival_quantity} qt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && prices.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600">No prices found for the selected filters</p>
          <p className="text-sm text-gray-500">Try selecting different state or commodity</p>
        </div>
      )}
    </div>
  );
}
```

---

### 3. Price Trends Chart Component

```typescript
// components/PriceTrendsChart.tsx

import { useState, useEffect } from 'react';
import { useMandiPrices } from '../hooks/useMandiPrices';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from './ui/card';

interface PriceTrendProps {
  state: string;
  commodity: string;
}

export function PriceTrendsChart({ state, commodity }: PriceTrendProps) {
  const { fetchTrends, loading, error } = useMandiPrices();
  const [trends, setTrends] = useState<any>(null);

  useEffect(() => {
    if (state && commodity) {
      loadTrends();
    }
  }, [state, commodity]);

  const loadTrends = async () => {
    const data = await fetchTrends(state, commodity);
    if (data) {
      setTrends(data);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading trends...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">{error}</div>;
  }

  if (!trends) {
    return null;
  }

  const chartData = trends.data.map((item: any) => ({
    date: item.date,
    price: parseInt(item.price),
    minPrice: parseInt(item.min_price),
    maxPrice: parseInt(item.max_price)
  }));

  return (
    <Card className="border-0 shadow-lg rounded-xl">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6">
          Price Trends: {commodity} in {state}
        </h3>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Latest</p>
            <p className="text-2xl font-bold text-blue-600">₹{trends.statistics.latest}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Highest</p>
            <p className="text-2xl font-bold text-green-600">₹{trends.statistics.highest}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Lowest</p>
            <p className="text-2xl font-bold text-orange-600">₹{trends.statistics.lowest}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-2xl font-bold text-purple-600">₹{trends.statistics.average}</p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Modal Price"
            />
            <Line 
              type="monotone" 
              dataKey="minPrice" 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              name="Min Price"
            />
            <Line 
              type="monotone" 
              dataKey="maxPrice" 
              stroke="#10b981" 
              strokeDasharray="5 5"
              name="Max Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

### 4. Usage in App

```typescript
// App.tsx or your main component

import { MandiPrices } from './components/MandiPrices';
import { PriceTrendsChart } from './components/PriceTrendsChart';
import { useState } from 'react';

export function App() {
  const [showTrends, setShowTrends] = useState(false);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedCommodity, setSelectedCommodity] = useState('Onion');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">HaritNavinya - Mandi Prices</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <button
            onClick={() => setShowTrends(!showTrends)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showTrends ? 'Show Prices' : 'Show Trends'}
          </button>
        </div>

        {showTrends ? (
          <PriceTrendsChart state={selectedState} commodity={selectedCommodity} />
        ) : (
          <MandiPrices />
        )}
      </main>
    </div>
  );
}
```

---

## Testing the Integration

### Using curl
```bash
# Get all prices
curl "http://localhost:4000/api/mandi?limit=5"

# Get Maharashtra onion prices
curl "http://localhost:4000/api/mandi?state=Maharashtra&commodity=Onion"

# Get available states
curl "http://localhost:4000/api/mandi/states"

# Get commodities in Maharashtra
curl "http://localhost:4000/api/mandi/commodities?state=Maharashtra"

# Get price trends
curl "http://localhost:4000/api/mandi/trends?state=Maharashtra&commodity=Onion"
```

### In Browser Console
```javascript
// Fetch prices
fetch('http://localhost:4000/api/mandi?state=Maharashtra&commodity=Onion')
  .then(r => r.json())
  .then(d => console.log(d))

// Get states
fetch('http://localhost:4000/api/mandi/states')
  .then(r => r.json())
  .then(d => console.log(d.data))
```

---

## Key Points

1. **Hook Pattern**: The `useMandiPrices` hook encapsulates all API logic
2. **Error Handling**: All components handle loading, error, and empty states
3. **Flexibility**: Supports filtering by state, commodity, or both
4. **Responsive**: Components work on mobile and desktop
5. **Reusable**: Can be used throughout the application

---

**Created**: March 23, 2026
**Version**: 1.0.0
