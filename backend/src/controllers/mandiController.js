import axios from 'axios';
import {
  getLastNDays,
  formatDate,
  parseDate,
  groupByCommodity,
  cleanRecord,
  filterByDate,
  getTopGainersLosers,
  getAveragePrice,
  getPriceInfo,
  getPriceTrendForCommodity,
  getCacheIfValid,
  setCacheWithTTL,
  handleAPIError,
  calculatePercentageChange,
  formatPercentChange
} from '../utils/helpers.js';

// In-memory cache for API responses (consider moving to Redis in production)
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AGMARKNET_API_BASE = 'https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24';

// All Indian states and union territories
const ALL_INDIAN_STATES = [
  // States (28)
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories (8)
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry", "Ladakh"
];

/**
 * Fetch data from Agmarknet API with caching
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} API response data
 */
async function fetchAgmarknetData(filters = {}) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured in environment variables');
    }

    // Build cache key from filters
    const cacheKey = JSON.stringify(filters);
    
    // Check cache first
    const cachedData = getCacheIfValid(apiCache, cacheKey);
    if (cachedData) {
      console.log('✅ Using cached data');
      return cachedData;
    }

    console.log('🔄 Fetching fresh data from Agmarknet API...');

    const params = {
      'api-key': apiKey,
      'format': 'json',
      'limit': 200,
      ...filters
    };

    const response = await axios.get(AGMARKNET_API_BASE, { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data || !response.data.records) {
      throw new Error('Invalid API response structure');
    }

    // Cache the response
    setCacheWithTTL(apiCache, cacheKey, response.data.records, CACHE_TTL);

    console.log(`✅ Fetched ${response.data.records.length} records from Agmarknet`);
    return response.data.records;

  } catch (error) {
    const errorInfo = handleAPIError(error, 'Agmarknet API Fetch');
    throw new Error(`Failed to fetch Agmarknet data: ${errorInfo.error}`);
  }
}

/**
 * GET /api/dashboard
 * Main dashboard endpoint returning today's prices, trends, gainers & losers
 */
export async function getDashboard(req, res) {
  try {
    const { state = 'Maharashtra', market, commodity = 'All' } = req.query;

    console.log(`📊 Dashboard request - State: ${state}, Market: ${market}, Commodity: ${commodity}`);

    // Build API filters
    const filters = {};
    if (state) {
      filters['filters[state]'] = state;
    }
    if (market) {
      filters['filters[market]'] = market;
    }

    // Fetch raw data from Agmarknet
    const rawData = await fetchAgmarknetData(filters);

    // Clean all records
    const cleanedData = rawData.map(cleanRecord);

    if (cleanedData.length === 0) {
      return res.status(200).json({
        success: true,
        state,
        message: 'No data available for the selected filters',
        todayPrices: [],
        topGainers: [],
        topLosers: [],
        priceTrends: []
      });
    }

    // Get today and yesterday's dates
    // IMPORTANT: Since the API may have legacy data, find the latest date in the dataset
    // instead of assuming today's date exists
    
    // Group data by date
    const dataByDate = {};
    cleanedData.forEach(record => {
      const date = record.arrivalDate;
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }
      dataByDate[date].push(record);
    });

    // Get the latest date available in the dataset
    const availableDates = Object.keys(dataByDate).sort().reverse();
    if (availableDates.length === 0) {
      return res.status(200).json({
        success: true,
        state,
        message: 'No data available for the selected filters after date-based filtering',
        todayPrices: [],
        topGainers: [],
        topLosers: [],
        priceTrends: []
      });
    }

    const latestDate = availableDates[0];
    const previousDate = availableDates.length > 1 ? availableDates[1] : null;

    // Get latest and previous data
    const todayData = dataByDate[latestDate] || [];
    const yesterdayData = previousDate ? dataByDate[previousDate] : [];

    console.log(`📅 Latest date in dataset: ${latestDate}, Records: ${todayData.length}`);
    if (previousDate) {
      console.log(`📅 Previous date in dataset: ${previousDate}, Records: ${yesterdayData.length}`);
    }

    // Get today's prices grouped by commodity
    const todayGrouped = groupByCommodity(todayData);
    const yesterdayGrouped = groupByCommodity(yesterdayData);

    // Build today's prices array
    const todayPrices = Object.entries(todayGrouped)
      .map(([commodityName, records]) => {
        const { price, volume } = getPriceInfo(records);
        const yesterdayPrice = getAveragePrice(yesterdayGrouped[commodityName] || []);
        const percentChange = calculatePercentageChange(yesterdayPrice, price);

        return {
          commodity: commodityName,
          price: Math.round(price),
          change: formatPercentChange(percentChange),
          volume,
          unit: 'Tonnes' // Default unit
        };
      })
      .filter(item => {
        // Filter by commodity if specific one requested
        if (commodity !== 'All' && commodity) {
          return item.commodity.toLowerCase() === commodity.toLowerCase();
        }
        return true;
      })
      .sort((a, b) => b.price - a.price);

    // Get top gainers and losers
    const { topGainers, topLosers } = getTopGainersLosers(todayGrouped, yesterdayGrouped, 3);

    // Get price trends for last 7 days
    const priceTrends = Object.keys(todayGrouped)
      .map(commodityName => {
        if (commodity !== 'All' && commodity && commodityName.toLowerCase() !== commodity.toLowerCase()) {
          return null;
        }
        return getPriceTrendForCommodity(cleanedData, commodityName, 7);
      })
      .filter(trend => trend !== null && trend.data.length > 0);

    // Build response
    const dashboard = {
      success: true,
      state,
      market: market || 'All Markets',
      commodity: commodity || 'All',
      dataDate: latestDate, // Show which date this data is from
      generatedAt: new Date().toISOString(),
      stats: {
        totalCommodities: todayPrices.length,
        topGainersCount: topGainers.length,
        topLosersCount: topLosers.length,
        trendsTracked: priceTrends.length
      },
      todayPrices,
      topGainers,
      topLosers,
      priceTrends
    };

    res.status(200).json(dashboard);

  } catch (error) {
    console.error('❌ Dashboard error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
}

/**
 * GET /api/trends?commodity=Onion
 * Get price trends for a specific commodity (last 7 days by default)
 */
export async function getTrends(req, res) {
  try {
    const { commodity, state = 'Maharashtra', days = 7, market } = req.query;

    if (!commodity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: commodity'
      });
    }

    console.log(`📈 Trends request - Commodity: ${commodity}, State: ${state}, Days: ${days}`);

    // Fetch data
    const filters = {};
    if (state) {
      filters['filters[state]'] = state;
    }
    if (market) {
      filters['filters[market]'] = market;
    }

    const rawData = await fetchAgmarknetData(filters);
    const cleanedData = rawData.map(cleanRecord);

    if (cleanedData.length === 0) {
      return res.status(200).json({
        success: true,
        commodity,
        state,
        message: 'No data available',
        trends: []
      });
    }

    // Get trends for the commodity
    const trends = getPriceTrendForCommodity(cleanedData, commodity, parseInt(days) || 7);

    if (trends.data.length === 0) {
      return res.status(200).json({
        success: true,
        commodity,
        state,
        message: `No price data found for commodity: ${commodity}`,
        trends: []
      });
    }

    // Calculate statistics
    const prices = trends.data.map(d => d.price);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceChange = prices.length > 1 ? prices[prices.length - 1] - prices[0] : 0;

    res.status(200).json({
      success: true,
      commodity,
      state,
      market: market || 'All Markets',
      period: `Last ${days} days`,
      generatedAt: new Date().toISOString(),
      statistics: {
        averagePrice: avgPrice,
        minPrice,
        maxPrice,
        priceChange,
        percentChange: ((priceChange / prices[0]) * 100).toFixed(2) + '%'
      },
      trends: trends.data
    });

  } catch (error) {
    console.error('❌ Trends error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trend data',
      message: error.message
    });
  }
}

/**
 * GET /api/available-states
 * Get list of states available in the database
 */
export async function getAvailableStates(req, res) {
  try {
    console.log('🌍 Fetching available states...');
    
    // Return all Indian states and union territories
    res.status(200).json({
      success: true,
      states: ALL_INDIAN_STATES,
      count: ALL_INDIAN_STATES.length
    });
  } catch (error) {
    console.error('❌ States fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
      message: error.message
    });
  }
}

/**
 * GET /api/available-commodities
 * Get list of commodities (optionally filtered by state)
 */
export async function getAvailableCommodities(req, res) {
  try {
    const { state } = req.query;
    console.log(`🌾 Fetching commodities${state ? ` for state: ${state}` : ''}...`);

    // Fetch all data and filter in JavaScript
    const rawData = await fetchAgmarknetData();
    
    // Filter by state if specified
    const filtered = state 
      ? rawData.filter(record => record.State && record.State.toLowerCase() === state.toLowerCase())
      : rawData;
    
    const commodities = [...new Set(filtered.map(record => record.Commodity).filter(Boolean))];

    res.status(200).json({
      success: true,
      commodities: commodities.sort(),
      count: commodities.length,
      state: state || 'All States'
    });
  } catch (error) {
    console.error('❌ Commodities fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commodities',
      message: error.message
    });
  }
}

/**
 * GET /api/market-data
 * Get raw market data for a specific commodity and state
 */
export async function getMarketData(req, res) {
  try {
    const { state = 'Maharashtra', commodity, market, limit = 20 } = req.query;

    const filters = {};
    if (state) {
      filters['filters[state]'] = state;
    }
    if (market) {
      filters['filters[market]'] = market;
    }
    if (commodity) {
      filters['filters[commodity]'] = commodity;
    }

    const rawData = await fetchAgmarknetData(filters);
    const cleanedData = rawData
      .map(cleanRecord)
      .sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate))
      .slice(0, parseInt(limit) || 20);

    res.status(200).json({
      success: true,
      state,
      commodity: commodity || 'All',
      market: market || 'All Markets',
      count: cleanedData.length,
      data: cleanedData
    });
  } catch (error) {
    console.error('❌ Market data fetch error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: error.message
    });
  }
}

/**
 * GET /api/mandi/debug
 * Debug endpoint to fetch raw data and log available records
 * Useful for troubleshooting data availability
 */
export async function getDebug(req, res) {
  try {
    console.log('🐛 Debug endpoint called - Fetching raw data without filters...');

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'API_KEY not configured',
        message: 'API_KEY not found in environment variables'
      });
    }

    // Fetch raw data with minimal filters
    const params = {
      'api-key': apiKey,
      'format': 'json',
      'limit': 100
    };

    console.log('📡 Calling Agmarknet API with params:', params);
    const response = await axios.get(AGMARKNET_API_BASE, { 
      params,
      timeout: 45000 // 45 second timeout for debug - API can be slow
    });

    // Log raw response structure
    console.log('📊 Raw API Response:');
    console.log('  - Record count:', response.data.records?.length || 0);
    if (response.data.records && response.data.records.length > 0) {
      console.log('  - First record:', JSON.stringify(response.data.records[0], null, 2));
      console.log('  - Available fields:', Object.keys(response.data.records[0]));
    }

    const records = response.data.records;

    // Handle empty data
    if (!records || records.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No data found from API',
        recordCount: 0,
        data: []
      });
    }

    // Get latest available date from dataset
    const latestDate = records.reduce((latest, item) => {
      const itemDate = new Date(item.Arrival_Date);
      const latestDateObj = new Date(latest);
      return itemDate > latestDateObj ? item.Arrival_Date : latest;
    }, records[0].Arrival_Date);

    console.log('📅 Latest available date in dataset:', latestDate);

    // Filter records by latest date
    const latestData = records.filter(item => item.Arrival_Date === latestDate);

    console.log(`✅ Found ${latestData.length} records for latest date (${latestDate})`);

    // Clean and simplify data
    const simplifiedData = latestData.map(item => ({
      commodity: item.Commodity,
      market: item.Market,
      price: Number(item.Modal_Price),
      date: item.Arrival_Date,
      state: item.State,
      min_price: Number(item.Min_Price),
      max_price: Number(item.Max_Price),
      arrival_date: item.Arrival_Date
    }));

    res.status(200).json({
      success: true,
      message: 'Debug data fetched successfully',
      latestDate,
      recordCount: simplifiedData.length,
      totalRecordsFetched: records.length,
      data: simplifiedData.slice(0, 20) // Return first 20 for preview
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error.message);
    
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status
    };

    if (error.response?.data) {
      errorDetails.apiResponse = error.response.data;
    }

    res.status(500).json({
      success: false,
      error: 'Debug fetch failed',
      details: errorDetails
    });
  }
}

/**
 * GET /api/health
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: 'Mandi API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
}
