import express from 'express';
import {
  getSoilData,
  getSoilInsightsHandler,
  getStates,
  getDistricts,
  compareSoilDataHandler,
  getStatistics,
  filterSoilData,
  getRecommendedCropsHandler,
  healthCheck,
} from '../controllers/soilController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Main endpoints
router.get('/soil-data', getSoilData);
router.get('/soil-insights', getSoilInsightsHandler);

// State and districts
router.get('/states', getStates);
router.get('/districts', getDistricts);

// Analysis endpoints
router.get('/compare', compareSoilDataHandler);
router.get('/statistics/:state', getStatistics);
router.post('/filter', filterSoilData);
router.get('/crops', getRecommendedCropsHandler);

export default router;
