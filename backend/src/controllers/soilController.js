import {
  getSoilDataByLocation,
  getSoilInsights,
  getAllStates,
  getDistrictsByState,
  compareSoilData,
  getSoilStatistics,
  filterSoilDataByNutrients,
  getRecommendedCrops,
} from '../services/soilService.js';

/**
 * Get soil data for a location
 * GET /api/soil-data?state=&district=
 */
export async function getSoilData(req, res) {
  try {
    const { state, district } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
      });
    }

    const soilData = await getSoilDataByLocation(state, district);

    res.status(200).json({
      success: true,
      data: soilData,
    });
  } catch (error) {
    console.error('Error in getSoilData:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get comprehensive soil insights
 * GET /api/soil-insights?state=&district=
 */
export async function getSoilInsightsHandler(req, res) {
  try {
    const { state, district } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
      });
    }

    const insights = await getSoilInsights(state, district);

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Error in getSoilInsights:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get all available states
 * GET /api/states
 */
export async function getStates(req, res) {
  try {
    const states = await getAllStates();

    res.status(200).json({
      success: true,
      data: states,
      count: states.length,
    });
  } catch (error) {
    console.error('Error in getStates:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get districts for a state
 * GET /api/districts?state=
 */
export async function getDistricts(req, res) {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
      });
    }

    const districts = await getDistrictsByState(state);

    res.status(200).json({
      success: true,
      data: {
        state,
        districts,
        count: districts.length,
      },
    });
  } catch (error) {
    console.error('Error in getDistricts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Compare soil data across states
 * GET /api/compare?states=Maharashtra,Gujarat
 */
export async function compareSoilDataHandler(req, res) {
  try {
    const { states } = req.query;

    if (!states) {
      return res.status(400).json({
        success: false,
        error: 'States parameter is required (comma-separated)',
      });
    }

    const stateArray = states.split(',').map((s) => s.trim());
    const comparison = await compareSoilData(stateArray);

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error in compareSoilData:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get soil statistics for a state
 * GET /api/statistics/:state
 */
export async function getStatistics(req, res) {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
      });
    }

    const statistics = await getSoilStatistics(state);

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in getStatistics:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Filter soil data by nutrient ranges
 * POST /api/filter
 */
export async function filterSoilData(req, res) {
  try {
    const { nitrogenMin, nitrogenMax, phosphorusMin, phosphorusMax, fertilityMin, fertilityMax, category } =
      req.body;

    const filters = {
      nitrogenMin: nitrogenMin ? parseInt(nitrogenMin) : undefined,
      nitrogenMax: nitrogenMax ? parseInt(nitrogenMax) : undefined,
      phosphorusMin: phosphorusMin ? parseInt(phosphorusMin) : undefined,
      phosphorusMax: phosphorusMax ? parseInt(phosphorusMax) : undefined,
      fertilityMin: fertilityMin ? parseInt(fertilityMin) : undefined,
      fertilityMax: fertilityMax ? parseInt(fertilityMax) : undefined,
      category,
    };

    const results = await filterSoilDataByNutrients(filters);

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error in filterSoilData:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get recommended crops for a state
 * GET /api/crops?state=
 */
export async function getRecommendedCropsHandler(req, res) {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
      });
    }

    const crops = await getRecommendedCrops(state);

    res.status(200).json({
      success: true,
      data: crops,
    });
  } catch (error) {
    console.error('Error in getRecommendedCrops:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Health check
 * GET /api/health
 */
export async function healthCheck(req, res) {
  res.status(200).json({
    success: true,
    message: 'Soil API service is running',
    timestamp: new Date(),
    endpoints: {
      dataEndpoint: 'GET /api/soil-data?state=&district=',
      insightsEndpoint: 'GET /api/soil-insights?state=&district=',
      statesEndpoint: 'GET /api/states',
      districtsEndpoint: 'GET /api/districts?state=',
      compareEndpoint: 'GET /api/compare?states=State1,State2',
      statisticsEndpoint: 'GET /api/statistics/:state',
      filterEndpoint: 'POST /api/filter',
      cropsEndpoint: 'GET /api/crops?state=',
    },
  });
}
