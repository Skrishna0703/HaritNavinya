import express from 'express';
import { getWeatherByCoords } from '../controllers/weather.controller.js';

const router = express.Router();

// GET /api/weather?lat=..&lon=..
router.get('/', getWeatherByCoords);

export default router;
