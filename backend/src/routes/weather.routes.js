import express from 'express';
import { getWeatherAlerts } from '../controllers/weather.controller.js';

const router = express.Router();

// GET /api/weather?lat=..&lon=..
router.get('/', getWeatherAlerts);

export default router;
