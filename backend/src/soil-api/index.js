/**
 * Soil API Module Exports
 * Central entry point for the soil fertility map API
 */

// Models
export { default as SoilFertility } from './models/Soil.js';

// Services
export {
  fetchSoilDataFromAPI,
  normalizeSoilData,
  fetchAndStoreSoilData,
  getSoilDataByLocation,
  generateMockSoilData,
  bulkFetchSoilData,
  updateSoilData,
  getSoilStatistics
} from './services/soilDataService.js';

// Controllers
export {
  getSoilMapData,
  fetchAndStoreSoilDataHandler,
  getSoilInsights,
  getSoilByState,
  bulkFetchSoilDataHandler,
  getSoilStatisticsHandler,
  updateSoilDataHandler,
  compareSoilData,
  getSoilHealthStatus
} from './controllers/soilController.js';

// Routes
export { default as soilRoutes } from './routes/soilRoutes.js';

// Middleware
export {
  validateSoilQuery,
  validateFetchAndStoreRequest,
  validateBulkFetchRequest,
  validateUpdateRequest,
  validateComparisonQuery,
  errorHandler,
  asyncHandler,
  rateLimiter
} from './middleware/validation.js';

// Utilities
export {
  categorizeNutrient,
  normalizeNutrientValue,
  calculateFertilityScore,
  getFertilityCategory,
  generateRecommendations,
  estimateWaterRetention,
  getSuitableCrops,
  formatSoilDataForFrontend,
  validateSoilData
} from './utils/soilCalculations.js';

export {
  refreshAllSoilData,
  getRefreshStatus,
  setupScheduledRefresh,
  cleanupOldData,
  getSchedulerHealth
} from './utils/scheduler.js';

// Database
export {
  connectMongoDB,
  disconnectMongoDB,
  getDBStats,
  createIndexes
} from './config/database.js';

// App
export {
  createSoilApp,
  initializeSoilAPI
} from './soilApp.js';

// Version info
export const soilAPIInfo = {
  name: 'Soil Fertility Map API',
  version: '1.0.0',
  description: 'Production-ready backend for Soil Health Card Cycle-II data integration',
  author: 'HaritNavinya Team',
  cycle: 'Cycle-II',
  features: [
    'Real-time soil data fetching from SHC portal',
    'MongoDB persistent storage',
    'Automatic fertility score calculation',
    'AI-powered recommendations engine',
    'Multi-state support',
    'Bulk operations',
    'Data caching and optimization',
    'Rate limiting and validation',
    'Statistical analysis',
    'Production-ready error handling'
  ],
  dataPoints: [
    'Nitrogen (N) - mg/kg',
    'Phosphorus (P) - mg/kg',
    'Potassium (K) - mg/kg',
    'Organic Carbon (OC) - %',
    'pH Level',
    'Electrical Conductivity (EC) - dS/m'
  ]
};

export default soilAPIInfo;
