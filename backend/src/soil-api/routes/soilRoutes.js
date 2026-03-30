import express from 'express';
import {
  getSoilMapData,
  fetchAndStoreSoilDataHandler,
  getSoilInsights,
  getSoilByState,
  bulkFetchSoilDataHandler,
  getSoilStatisticsHandler,
  updateSoilDataHandler,
  compareSoilData,
  getSoilHealthStatus
} from '../controllers/soilController.js';
import {
  validateSoilQuery,
  validateFetchAndStoreRequest,
  validateBulkFetchRequest,
  validateUpdateRequest,
  validateComparisonQuery,
  asyncHandler
} from '../middleware/validation.js';

const router = express.Router();

/**
 * Soil Fertility Map API Routes
 * Cycle-II Data from Soil Health Card Scheme
 */

/**
 * GET /api/soil/map
 * Fetch soil fertility data for a state/district
 * Query params: state, district, nutrient
 */
router.get('/map', validateSoilQuery, asyncHandler(getSoilMapData));

/**
 * POST /api/soil/fetch-and-store
 * Fetch from SHC API and store in database
 * Body: { state, district }
 */
router.post(
  '/fetch-and-store',
  validateFetchAndStoreRequest,
  asyncHandler(fetchAndStoreSoilDataHandler)
);

/**
 * GET /api/soil/insights
 * Get comprehensive soil analysis and recommendations
 * Query params: state, district
 */
router.get('/insights', validateSoilQuery, asyncHandler(getSoilInsights));

/**
 * GET /api/soil/by-state/:state
 * Get all soil records for a state
 * Query params: limit, page
 */
router.get('/by-state/:state', asyncHandler(getSoilByState));

/**
 * POST /api/soil/bulk-fetch
 * Fetch multiple states in one request
 * Body: { states: [array], district }
 */
router.post(
  '/bulk-fetch',
  validateBulkFetchRequest,
  asyncHandler(bulkFetchSoilDataHandler)
);

/**
 * GET /api/soil/statistics/:state
 * Get soil statistics for a state
 */
router.get('/statistics/:state', asyncHandler(getSoilStatisticsHandler));

/**
 * PUT /api/soil/update/:state/:district
 * Update soil data for a location
 */
router.put(
  '/update/:state/:district',
  validateUpdateRequest,
  asyncHandler(updateSoilDataHandler)
);

/**
 * GET /api/soil/compare
 * Compare soil data across states
 * Query params: states (comma-separated)
 */
router.get(
  '/compare',
  validateComparisonQuery,
  asyncHandler(compareSoilData)
);

/**
 * GET /api/soil/health-status/:state
 * Get overall soil health status
 */
router.get('/health-status/:state', asyncHandler(getSoilHealthStatus));

/**
 * Health check endpoint
 * GET /api/soil/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Soil API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Info endpoint
 * GET /api/soil/info
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Soil Fertility Map API',
    description: 'Production-ready API for Soil Health Card Cycle-II data',
    version: '1.0.0',
    baseUrl: '/api/soil',
    endpoints: {
      getMap: {
        path: '/map',
        method: 'GET',
        description: 'Fetch soil fertility data',
        queryParams: ['state', 'district', 'nutrient']
      },
      fetchAndStore: {
        path: '/fetch-and-store',
        method: 'POST',
        description: 'Fetch from external API and store in DB',
        bodyParams: ['state', 'district']
      },
      getInsights: {
        path: '/insights',
        method: 'GET',
        description: 'Get comprehensive soil analysis',
        queryParams: ['state', 'district']
      },
      getSoilByState: {
        path: '/by-state/:state',
        method: 'GET',
        description: 'Get all soil data for a state',
        queryParams: ['limit', 'page']
      },
      bulkFetch: {
        path: '/bulk-fetch',
        method: 'POST',
        description: 'Fetch multiple states',
        bodyParams: ['states']
      },
      getStatistics: {
        path: '/statistics/:state',
        method: 'GET',
        description: 'Get state-level statistics'
      },
      updateSoil: {
        path: '/update/:state/:district',
        method: 'PUT',
        description: 'Update soil data'
      },
      compareSoil: {
        path: '/compare',
        method: 'GET',
        description: 'Compare soil data across states',
        queryParams: ['states']
      },
      getHealthStatus: {
        path: '/health-status/:state',
        method: 'GET',
        description: 'Get soil health status'
      }
    },
    documentation: 'https://www.soilhealth.dac.gov.in',
    cycle: 'Cycle-II',
    lastUpdated: new Date().toISOString()
  });
});

export default router;
