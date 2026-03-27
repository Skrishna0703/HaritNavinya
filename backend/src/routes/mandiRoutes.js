import express from 'express';
import {
  getDashboard,
  getTrends,
  getAvailableStates,
  getAvailableCommodities,
  getMarketData,
  getDebug,
  healthCheck
} from '../controllers/mandiController.js';

const router = express.Router();

/**
 * GET /api/dashboard
 * Main dashboard endpoint with today's prices, trends, gainers & losers
 * Query params:
 *   - state: State name (default: Maharashtra)
 *   - market: Market name (optional)
 *   - commodity: Filter by commodity (default: All)
 */
router.get('/dashboard', getDashboard);

/**
 * GET /api/trends
 * Get price trends for a specific commodity (last 7 days by default)
 * Query params:
 *   - commodity: Commodity name (REQUIRED)
 *   - state: State name (default: Maharashtra)
 *   - days: Number of days to include (default: 7)
 *   - market: Market name (optional)
 */
router.get('/trends', getTrends);

/**
 * GET /api/available-states
 * Get list of available states in the database
 */
router.get('/available-states', getAvailableStates);

/**
 * GET /api/available-commodities
 * Get list of available commodities
 * Query params:
 *   - state: Filter commodities by state (optional)
 */
router.get('/available-commodities', getAvailableCommodities);

/**
 * GET /api/market-data
 * Get raw market data with detailed information
 * Query params:
 *   - state: State name (default: Maharashtra)
 *   - commodity: Commodity name (optional)
 *   - market: Market name (optional)
 *   - limit: Number of records to return (default: 20)
 */
router.get('/market-data', getMarketData);

/**
 * GET /api/mandi/debug
 * Debug endpoint for troubleshooting data availability
 * Fetches raw data without filters and logs structure
 */
router.get('/debug', getDebug);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', healthCheck);

export default router;
