/**
 * Helper Functions for Mandi/Market Data Processing
 */

/**
 * Get the last N days from a given date
 * @param {number} days - Number of days to go back
 * @param {Date} fromDate - Starting date (default: today)
 * @returns {Date[]} Array of dates for the last N days
 */
export function getLastNDays(days, fromDate = new Date()) {
  const dates = [];
  const currentDate = new Date(fromDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates.reverse();
}

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Parse date string in various formats
 * @param {string} dateStr - Date string to parse
 * @returns {Date} Parsed Date object
 */
export function parseDate(dateStr) {
  if (!dateStr) return formatDate(new Date());
  
  // Handle DD/MM/YYYY format (Agmarknet API format)
  if (dateStr.includes('/') && dateStr.split('/')[0].length === 2) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  
  // Handle DD-MM-YYYY format
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  }
  
  // Handle YYYY-MM-DD format
  return new Date(dateStr);
}

/**
 * Group data by commodity
 * @param {Array} data - Array of price records
 * @returns {Object} Records grouped by commodity
 */
export function groupByCommodity(data) {
  return data.reduce((grouped, record) => {
    const commodity = record.commodity || 'Unknown';
    
    if (!grouped[commodity]) {
      grouped[commodity] = [];
    }
    
    grouped[commodity].push(record);
    return grouped;
  }, {});
}

/**
 * Calculate percentage change between two prices
 * @param {number} oldPrice - Previous price
 * @param {number} newPrice - Current price
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(oldPrice, newPrice) {
  if (!oldPrice || oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

/**
 * Format percentage change with +/- notation
 * @param {number} percentChange - Percentage change value
 * @returns {string} Formatted string with +/- and % symbol
 */
export function formatPercentChange(percentChange) {
  const sign = percentChange >= 0 ? '+' : '';
  return `${sign}${percentChange.toFixed(2)}%`;
}

/**
 * Get average price from a group of records
 * @param {Array} records - Array of price records
 * @returns {number} Average price
 */
export function getAveragePrice(records) {
  if (!records || records.length === 0) return 0;
  
  const sum = records.reduce((total, record) => {
    const price = parseFloat(record.modal_price || record.price || 0);
    return total + price;
  }, 0);
  
  return sum / records.length;
}

/**
 * Get modal/average price and volume information
 * @param {Array} records - Array of records for a commodity
 * @returns {Object} Price info with volume
 */
export function getPriceInfo(records) {
  if (!records || records.length === 0) {
    return { price: 0, volume: 0 };
  }
  
  const price = getAveragePrice(records);
  const volume = records.reduce((total, record) => {
    return total + (parseInt(record.arrival_quantity || 0));
  }, 0);
  
  return { price, volume };
}

/**
 * Get top gainers and losers
 * @param {Object} todayData - Today's price data grouped by commodity
 * @param {Object} yesterdayData - Yesterday's price data grouped by commodity
 * @param {number} limit - Number of top gainers/losers to return
 * @returns {Object} Object with topGainers and topLosers arrays
 */
export function getTopGainersLosers(todayData, yesterdayData, limit = 3) {
  const changes = [];
  
  // Calculate price changes
  for (const commodity in todayData) {
    if (yesterdayData[commodity]) {
      const todayPrice = getAveragePrice(todayData[commodity]);
      const yesterdayPrice = getAveragePrice(yesterdayData[commodity]);
      
      if (todayPrice > 0 && yesterdayPrice > 0) {
        const percentChange = calculatePercentageChange(yesterdayPrice, todayPrice);
        
        changes.push({
          commodity,
          price: Math.round(todayPrice),
          change: formatPercentChange(percentChange),
          percentValue: percentChange
        });
      }
    }
  }
  
  // Sort by percentage change
  const sortedByChange = changes.sort((a, b) => b.percentValue - a.percentValue);
  
  return {
    topGainers: sortedByChange.slice(0, limit),
    topLosers: sortedByChange.slice(-limit).reverse()
  };
}

/**
 * Clean and normalize a single record from API
 * @param {Object} record - Raw record from Agmarknet API
 * @returns {Object} Cleaned record
 */
export function cleanRecord(record) {
  return {
    // Map from API's PascalCase to our camelCase
    commodity: (record.Commodity || 'Unknown').trim(),
    market: (record.Market || 'N/A').trim(),
    state: (record.State || 'N/A').trim(),
    district: (record.District || 'N/A').trim(),
    variety: (record.Variety || 'N/A').trim(),
    modalPrice: parseFloat(record.Modal_Price || record.price || 0),
    minPrice: parseFloat(record.Min_Price || 0),
    maxPrice: parseFloat(record.Max_Price || 0),
    price: parseFloat(record.Modal_Price || record.price || 0),
    // API returns date in DD/MM/YYYY format
    arrivalDate: record.Arrival_Date ? parseDate(record.Arrival_Date) : formatDate(new Date()),
    arrivalQuantity: parseInt(record.Arrival_Quantity || 0),
    timestamp: new Date().toISOString(),
    // Keep original fields for reference
    original: record
  };
}

/**
 * Filter data for a specific date
 * @param {Array} data - Array of records
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Array} Filtered records for that date
 */
export function filterByDate(data, dateStr) {
  return data.filter(record => record.arrivalDate === dateStr);
}

/**
 * Get price trends for a commodity
 * @param {Array} data - Array of price records
 * @param {string} commodity - Commodity name
 * @param {number} days - Number of days to include
 * @returns {Object} Commodity trend data
 */
export function getPriceTrendForCommodity(data, commodity, days = 7) {
  const commodityData = data.filter(record => 
    record.commodity.toLowerCase() === commodity.toLowerCase()
  );
  
  if (commodityData.length === 0) {
    return { commodity, data: [] };
  }
  
  // Group by date
  const byDate = {};
  commodityData.forEach(record => {
    const date = record.arrivalDate;
    if (!byDate[date]) {
      byDate[date] = [];
    }
    byDate[date].push(record);
  });
  
  // Get average price per date
  const trendData = Object.keys(byDate)
    .sort()
    .map(date => ({
      date,
      price: Math.round(getAveragePrice(byDate[date]))
    }))
    .slice(-days);
  
  return {
    commodity,
    data: trendData
  };
}

/**
 * Validate required query parameters
 * @param {Object} queryParams - Query parameters from request
 * @param {Array} requiredParams - Array of required parameter names
 * @returns {string|null} Error message if validation fails, null otherwise
 */
export function validateQueryParams(queryParams, requiredParams) {
  for (const param of requiredParams) {
    if (!queryParams[param]) {
      return `Missing required parameter: ${param}`;
    }
  }
  return null;
}

/**
 * Cache data with expiration
 * @param {Map} cache - Cache storage
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export function setCacheWithTTL(cache, key, value, ttl = 300000) { // 5 minutes default
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl
  });
}

/**
 * Get cached data if not expired
 * @param {Map} cache - Cache storage
 * @param {string} key - Cache key
 * @returns {*|null} Cached value or null if expired/not found
 */
export function getCacheIfValid(cache, key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return cached.value;
}

/**
 * Handle API errors gracefully
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Standardized error response
 */
export function handleAPIError(error, context = 'API Call') {
  console.error(`❌ Error in ${context}:`, error.message);
  
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (error.response) {
    // API response error
    statusCode = error.response.status || 500;
    message = error.response.data?.message || error.response.statusText || 'API Error';
  } else if (error.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'External API service unavailable';
  } else if (error.message.includes('timeout')) {
    statusCode = 504;
    message = 'Request timeout';
  }
  
  return {
    success: false,
    error: message,
    statusCode,
    context
  };
}
