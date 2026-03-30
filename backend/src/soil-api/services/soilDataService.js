import axios from 'axios';
import SoilFertility from '../models/Soil.js';
import { categorizeNutrient, calculateFertilityScore } from '../utils/soilCalculations.js';

const SOIL_HEALTH_CARD_API = 'https://www.soilhealth.dac.gov.in/api/GetMapData';

// In-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached data if valid
 */
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`✅ Using cached data for: ${key}`);
    return cached.data;
  }
  cache.delete(key);
  return null;
};

/**
 * Set cache
 */
const setCacheData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetch soil data from Soil Health Card API
 * The actual API endpoint from SHC portal
 */
export const fetchSoilDataFromAPI = async (state, district = null, nutrient = 'NPK') => {
  try {
    console.log(`🔄 Fetching soil data: State=${state}, District=${district}, Nutrient=${nutrient}`);

    const cacheKey = `shc_${state}_${district}_${nutrient}`;
    const cachedResponse = getCachedData(cacheKey);
    if (cachedResponse) return cachedResponse;

    // Prepare request payload for SHC API
    const payload = {
      stateName: state,
      districtName: district || '',
      nutrient: nutrient, // NPK, N, P, K, OC, pH
      format: 'json'
    };

    console.log('📤 API Request:', payload);

    // Make POST request to SHC API
    const response = await axios.post(SOIL_HEALTH_CARD_API, payload, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HaritNavinya-SoilAPI/1.0'
      }
    });

    if (response.status === 200 && response.data) {
      console.log(`✅ Received data from SHC API`);
      setCacheData(cacheKey, response.data);
      return response.data;
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('❌ API Fetch Error:', error.message);
    throw new Error(`Failed to fetch from SHC API: ${error.message}`);
  }
};

/**
 * Normalize API response to database schema
 */
export const normalizeSoilData = (rawData, state, district) => {
  try {
    console.log('🔄 Normalizing soil data...');

    // Parse the response based on SHC API format
    const normalizedData = {
      state: state,
      district: district,
      nutrients: {
        nitrogen: {
          value: rawData.nitrogen || 0,
          category: categorizeNutrient(rawData.nitrogen || 0, 'nitrogen'),
          unit: 'mg/kg'
        },
        phosphorus: {
          value: rawData.phosphorus || 0,
          category: categorizeNutrient(rawData.phosphorus || 0, 'phosphorus'),
          unit: 'mg/kg'
        },
        potassium: {
          value: rawData.potassium || 0,
          category: categorizeNutrient(rawData.potassium || 0, 'potassium'),
          unit: 'mg/kg'
        },
        organicCarbon: {
          value: rawData.organicCarbon || rawData.OC || 0,
          category: categorizeNutrient(rawData.organicCarbon || rawData.OC || 0, 'organicCarbon'),
          unit: '%'
        },
        pH: {
          value: rawData.pH || rawData.ph || 6.5,
          category: getPHCategory(rawData.pH || rawData.ph || 6.5),
          unit: 'pH'
        },
        electricalConductivity: {
          value: rawData.EC || rawData.electricalConductivity || 0,
          unit: 'dS/m'
        }
      },
      cycle: 'Cycle-II',
      source: {
        provider: 'SoilHealthCard-DAC',
        apiUrl: SOIL_HEALTH_CARD_API,
        fetchedAt: new Date(),
        dataUrl: `https://www.soilhealth.dac.gov.in/NutrientMapCycleII`
      },
      block: rawData.block || '',
      village: rawData.village || ''
    };

    console.log('✅ Data normalized successfully');
    return normalizedData;
  } catch (error) {
    console.error('❌ Normalization Error:', error.message);
    throw new Error(`Failed to normalize soil data: ${error.message}`);
  }
};

/**
 * Get pH category
 */
const getPHCategory = (pH) => {
  if (pH < 6.0) return 'Acidic';
  if (pH > 7.5) return 'Alkaline';
  return 'Neutral';
};

/**
 * Fetch and store soil data in MongoDB
 */
export const fetchAndStoreSoilData = async (state, district = null) => {
  try {
    console.log(`🌱 Fetching and storing soil data for ${state}/${district}`);

    // Fetch from API
    const apiData = await fetchSoilDataFromAPI(state, district);
    
    // Normalize the data
    const normalizedData = normalizeSoilData(apiData, state, district);

    // Create or update in database
    const soilDoc = await SoilFertility.findOneAndUpdate(
      { state: state, district: district || null },
      normalizedData,
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`💾 Data stored for ${state}/${district}`);
    return soilDoc;
  } catch (error) {
    console.error('❌ Fetch & Store Error:', error.message);
    throw error;
  }
};

/**
 * Get soil data by state and district (with fallback to mock data)
 */
export const getSoilDataByLocation = async (state, district = null) => {
  try {
    console.log(`📍 Getting soil data for ${state}/${district}`);

    // First try to get from database
    let soilData = await SoilFertility.findOne({
      state: state,
      ...(district && { district: district })
    });

    // If not found, fetch from API and store
    if (!soilData) {
      console.log('📥 Data not in DB, fetching from API...');
      soilData = await fetchAndStoreSoilData(state, district);
    } else {
      console.log('✅ Found in database');
    }

    return soilData;
  } catch (error) {
    console.error('❌ Get Soil Data Error:', error.message);
    
    // Return mock data on API failure
    console.log('📦 Returning mock data as fallback...');
    return generateMockSoilData(state, district);
  }
};

/**
 * Generate mock soil data for development/testing
 */
export const generateMockSoilData = (state, district) => {
  const soilData = {
    state: state,
    district: district || 'Central District',
    nutrients: {
      nitrogen: {
        value: 280 + Math.random() * 100,
        category: 'Medium',
        unit: 'mg/kg'
      },
      phosphorus: {
        value: 45 + Math.random() * 30,
        category: 'Low',
        unit: 'mg/kg'
      },
      potassium: {
        value: 220 + Math.random() * 80,
        category: 'High',
        unit: 'mg/kg'
      },
      organicCarbon: {
        value: 2.4 + Math.random() * 1,
        category: 'Medium',
        unit: '%'
      },
      pH: {
        value: 6.8 + Math.random() * 0.5,
        category: 'Neutral',
        unit: 'pH'
      },
      electricalConductivity: {
        value: 0.5 + Math.random() * 0.3,
        unit: 'dS/m'
      }
    },
    fertilityScore: 65 + Math.random() * 20,
    overallCategory: 'Medium',
    cycle: 'Cycle-II',
    source: {
      provider: 'MockData-Development',
      fetchedAt: new Date()
    }
  };

  return soilData;
};

/**
 * Bulk fetch soil data for multiple states
 */
export const bulkFetchSoilData = async (states, district = null) => {
  console.log(`📊 Bulk fetching soil data for ${states.length} states`);

  const results = [];
  const errors = [];

  for (const state of states) {
    try {
      const soilData = await getSoilDataByLocation(state, district);
      results.push({
        state,
        status: 'success',
        data: soilData
      });
    } catch (error) {
      errors.push({
        state,
        error: error.message
      });
      results.push({
        state,
        status: 'failed',
        error: error.message
      });
    }
  }

  return {
    successful: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'failed').length,
    results,
    errors
  };
};

/**
 * Update soil data for a location
 */
export const updateSoilData = async (state, district, updateData) => {
  try {
    console.log(`🔄 Updating soil data for ${state}/${district}`);

    const soilDoc = await SoilFertility.findOneAndUpdate(
      { state, district },
      updateData,
      { new: true, runValidators: true }
    );

    if (!soilDoc) {
      throw new Error('Soil data not found');
    }

    console.log('✅ Data updated successfully');
    return soilDoc;
  } catch (error) {
    console.error('❌ Update Error:', error.message);
    throw error;
  }
};

/**
 * Get soil data statistics
 */
export const getSoilStatistics = async (state) => {
  try {
    const stats = await SoilFertility.aggregate([
      { $match: { state: state } },
      {
        $group: {
          _id: '$state',
          avgFertilityScore: { $avg: '$fertilityScore' },
          avgNitrogen: { $avg: '$nutrients.nitrogen.value' },
          avgPhosphorus: { $avg: '$nutrients.phosphorus.value' },
          avgPotassium: { $avg: '$nutrients.potassium.value' },
          avgPH: { $avg: '$nutrients.pH.value' },
          totalLocations: { $sum: 1 },
          highFertilityCount: {
            $sum: { $cond: [{ $gte: ['$fertilityScore', 70] }, 1, 0] }
          },
          mediumFertilityCount: {
            $sum: { $cond: [{ $gte: ['$fertilityScore', 40] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || null;
  } catch (error) {
    console.error('❌ Statistics Error:', error.message);
    throw error;
  }
};

export default {
  fetchSoilDataFromAPI,
  normalizeSoilData,
  fetchAndStoreSoilData,
  getSoilDataByLocation,
  generateMockSoilData,
  bulkFetchSoilData,
  updateSoilData,
  getSoilStatistics
};
