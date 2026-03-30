import SoilFertility from '../models/Soil.js';
import {
  getSoilDataByLocation,
  bulkFetchSoilData,
  fetchAndStoreSoilData,
  updateSoilData,
  getSoilStatistics,
  generateMockSoilData
} from '../services/soilDataService.js';
import {
  formatSoilDataForFrontend,
  generateRecommendations,
  validateSoilData
} from '../utils/soilCalculations.js';

/**
 * GET /api/soil-map
 * Get soil fertility data by state and optional district
 */
export const getSoilMapData = async (req, res) => {
  try {
    const { state, district, nutrient } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    console.log(`📍 Request: State=${state}, District=${district}, Nutrient=${nutrient}`);

    const soilData = await getSoilDataByLocation(state, district);

    if (!soilData) {
      return res.status(404).json({
        success: false,
        error: 'Soil data not found for the specified location'
      });
    }

    const formattedData = formatSoilDataForFrontend(soilData);

    res.status(200).json({
      success: true,
      data: formattedData,
      message: 'Soil fertility data retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error in getSoilMapData:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch soil map data',
      message: error.message
    });
  }
};

/**
 * POST /api/fetch-and-store
 * Fetch soil data from external API and store in database
 */
export const fetchAndStoreSoilDataHandler = async (req, res) => {
  try {
    const { state, district } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State is required'
      });
    }

    console.log(`🔄 Fetching and storing: State=${state}, District=${district}`);

    const soilData = await fetchAndStoreSoilData(state, district);
    const formattedData = formatSoilDataForFrontend(soilData);

    res.status(201).json({
      success: true,
      data: formattedData,
      message: 'Soil data fetched and stored successfully'
    });
  } catch (error) {
    console.error('❌ Error in fetchAndStoreSoilDataHandler:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch and store soil data',
      message: error.message
    });
  }
};

/**
 * GET /api/soil-insights
 * Get comprehensive soil insights with recommendations
 */
export const getSoilInsights = async (req, res) => {
  try {
    const { state, district } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    console.log(`💡 Getting insights: State=${state}, District=${district}`);

    const soilData = await getSoilDataByLocation(state, district);

    if (!soilData) {
      return res.status(404).json({
        success: false,
        error: 'Soil data not found'
      });
    }

    const nutrients = {
      nitrogen: soilData.nutrients.nitrogen.value,
      phosphorus: soilData.nutrients.phosphorus.value,
      potassium: soilData.nutrients.potassium.value,
      pH: soilData.nutrients.pH.value,
      organicCarbon: soilData.nutrients.organicCarbon.value
    };

    const recommendations = generateRecommendations(nutrients);
    const comparison = soilData.compareWithOptimal();
    const methods = soilData.getRecommendations();

    res.status(200).json({
      success: true,
      data: {
        location: {
          state: soilData.state,
          district: soilData.district
        },
        nutrients,
        fertilityScore: soilData.fertilityScore,
        category: soilData.overallCategory,
        recommendations,
        detailedRecommendations: methods,
        comparison,
        cycle: soilData.cycle,
        lastUpdated: soilData.lastUpdated
      },
      message: 'Soil insights retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error in getSoilInsights:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get soil insights',
      message: error.message
    });
  }
};

/**
 * GET /api/soil-by-state/:state
 * Get all soil data for a specific state
 */
export const getSoilByState = async (req, res) => {
  try {
    const { state } = req.params;
    const { limit = 50, page = 1 } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    console.log(`🗺️  Getting soil data for state: ${state}`);

    const skip = (page - 1) * limit;

    const [soilDataList, totalCount] = await Promise.all([
      SoilFertility.find({ state, status: 'active' })
        .sort({ lastUpdated: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SoilFertility.countDocuments({ state, status: 'active' })
    ]);

    const formattedData = soilDataList.map(doc => formatSoilDataForFrontend(doc));

    res.status(200).json({
      success: true,
      data: formattedData,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      },
      message: `Retrieved ${soilDataList.length} soil records for ${state}`
    });
  } catch (error) {
    console.error('❌ Error in getSoilByState:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get soil data by state',
      message: error.message
    });
  }
};

/**
 * POST /api/soil-bulk-fetch
 * Bulk fetch soil data for multiple states
 */
export const bulkFetchSoilDataHandler = async (req, res) => {
  try {
    const { states, district } = req.body;

    if (!states || !Array.isArray(states) || states.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Array of states is required'
      });
    }

    console.log(`📊 Bulk fetching for ${states.length} states`);

    const result = await bulkFetchSoilData(states, district);

    res.status(200).json({
      success: true,
      data: result,
      message: `Processed ${result.successful} states successfully, ${result.failed} failed`
    });
  } catch (error) {
    console.error('❌ Error in bulkFetchSoilDataHandler:', error.message);
    res.status(500).json({
      success: false,
      error: 'Bulk fetch operation failed',
      message: error.message
    });
  }
};

/**
 * GET /api/soil-statistics/:state
 * Get soil fertility statistics for a state
 */
export const getSoilStatisticsHandler = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    console.log(`📈 Getting statistics for state: ${state}`);

    const stats = await getSoilStatistics(state);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'No statistics found for the state'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        state,
        ...stats,
        healthAssessment: stats.avgFertilityScore >= 70 ? 'Healthy' : 
                         stats.avgFertilityScore >= 40 ? 'Moderate' : 'Poor'
      },
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error in getSoilStatisticsHandler:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get soil statistics',
      message: error.message
    });
  }
};

/**
 * PUT /api/soil-update/:state/:district
 * Update soil data for a location
 */
export const updateSoilDataHandler = async (req, res) => {
  try {
    const { state, district } = req.params;
    const updateData = req.body;

    if (!state || !district) {
      return res.status(400).json({
        success: false,
        error: 'State and district are required'
      });
    }

    console.log(`🔄 Updating soil data for ${state}/${district}`);

    const soilData = await updateSoilData(state, district, updateData);
    const formattedData = formatSoilDataForFrontend(soilData);

    res.status(200).json({
      success: true,
      data: formattedData,
      message: 'Soil data updated successfully'
    });
  } catch (error) {
    console.error('❌ Error in updateSoilDataHandler:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update soil data',
      message: error.message
    });
  }
};

/**
 * GET /api/soil-compare
 * Compare soil data across multiple states
 */
export const compareSoilData = async (req, res) => {
  try {
    const { states } = req.query;

    if (!states || typeof states !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'States parameter required (comma-separated)'
      });
    }

    const stateList = states.split(',').map(s => s.trim());
    console.log(`📊 Comparing soil data for: ${stateList.join(', ')}`);

    const comparisonData = await Promise.all(
      stateList.map(state => getSoilDataByLocation(state))
    );

    const formatted = comparisonData.map(data => data ? formatSoilDataForFrontend(data) : null);

    res.status(200).json({
      success: true,
      data: formatted,
      message: 'Comparison data retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error in compareSoilData:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to compare soil data',
      message: error.message
    });
  }
};

/**
 * GET /api/soil-health-status/:state
 * Get overall soil health status for a state
 */
export const getSoilHealthStatus = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    const soilData = await getSoilDataByLocation(state);

    if (!soilData) {
      return res.status(404).json({
        success: false,
        error: 'Soil data not found'
      });
    }

    const healthStatus = {
      state: state,
      fertilityScore: soilData.fertilityScore,
      healthStatus: soilData.fertilityScore >= 70 ? 'Excellent' :
                   soilData.fertilityScore >= 50 ? 'Good' :
                   soilData.fertilityScore >= 30 ? 'Fair' : 'Poor',
      nutrients: {
        nitrogen: {
          value: soilData.nutrients.nitrogen.value,
          status: soilData.nutrients.nitrogen.value >= 250 ? 'Adequate' : 'Deficient'
        },
        phosphorus: {
          value: soilData.nutrients.phosphorus.value,
          status: soilData.nutrients.phosphorus.value >= 25 ? 'Adequate' : 'Deficient'
        },
        potassium: {
          value: soilData.nutrients.potassium.value,
          status: soilData.nutrients.potassium.value >= 150 ? 'Adequate' : 'Deficient'
        }
      },
      nextUpdateDue: new Date(soilData.lastUpdated.getTime() + 30 * 24 * 60 * 60 * 1000)
    };

    res.status(200).json({
      success: true,
      data: healthStatus,
      message: 'Health status retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error in getSoilHealthStatus:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get health status',
      message: error.message
    });
  }
};

export default {
  getSoilMapData,
  fetchAndStoreSoilDataHandler,
  getSoilInsights,
  getSoilByState,
  bulkFetchSoilDataHandler,
  getSoilStatisticsHandler,
  updateSoilDataHandler,
  compareSoilData,
  getSoilHealthStatus
};
