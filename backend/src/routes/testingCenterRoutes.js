import express from 'express';
import {
  getAllCenters,
  getCentersByState,
  getCentersByLocation,
  searchCenters,
  getStates,
  getDistricts,
  getCenterById,
  createCenter,
  bulkCreateCenters,
  updateCenter,
  deleteCenter,
  getCentersCount,
  getPaginatedCenters,
  healthCheck
} from '../controllers/testingCenterController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// GET endpoints
router.get('/count', getCentersCount);
router.get('/states', getStates);
router.get('/districts', getDistricts);
router.get('/search', searchCenters);
router.get('/paginated', getPaginatedCenters);
router.get('/location', getCentersByLocation);
router.get('/state', getCentersByState);
router.get('/:id', getCenterById);
router.get('/', getAllCenters);

// POST endpoints
router.post('/bulk', bulkCreateCenters);
router.post('/', createCenter);

// PUT endpoints
router.put('/:id', updateCenter);

// DELETE endpoints
router.delete('/:id', deleteCenter);

export default router;
