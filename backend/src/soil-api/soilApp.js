import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectMongoDB, createIndexes } from './config/database.js';
import soilRoutes from './routes/soilRoutes.js';
import {
  setCORSHeaders,
  requestLogger,
  errorHandler,
  rateLimiter
} from './middleware/validation.js';

dotenv.config();

/**
 * Create and configure Express app for Soil Fertility Map API
 * Production-ready setup with middleware, routes, and error handling
 */
export const createSoilApp = () => {
  const app = express();

  // ==================== MIDDLEWARE ====================

  // CORS Configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));
  app.use(setCORSHeaders);

  // Body Parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }
  app.use(requestLogger);

  // Rate limiting
  app.use(rateLimiter);

  // ==================== ROUTES ====================

  // Health check
  app.get('/api/soil/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Soil API is running',
      timestamp: new Date().toISOString()
    });
  });

  // Main soil routes
  app.use('/api/soil', soilRoutes);

  // API info
  app.get('/api/soil/info', (req, res) => {
    res.status(200).json({
      success: true,
      name: 'Soil Fertility Map API - v1.0',
      description: 'Production-ready backend for Soil Health Card Cycle-II integration',
      version: '1.0.0',
      cycle: 'Cycle-II'
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'HaritNavinya Soil Fertility Backend',
      endpoints: {
        soil: '/api/soil',
        health: '/api/soil/health',
        info: '/api/soil/info'
      }
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      path: req.path,
      method: req.method
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
};

/**
 * Initialize soil API with database connection
 */
export const initializeSoilAPI = async (app) => {
  try {
    console.log('\n🌱 Initializing Soil Fertility Map API...\n');

    // Connect to MongoDB
    await connectMongoDB();

    // Create indexes
    await createIndexes();

    // Start listening
    const PORT = process.env.SOIL_API_PORT || process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Soil API Server running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🔗 Base API: http://localhost:${PORT}/api/soil`);
      console.log('\n📚 Available endpoints:');
      console.log('   GET  /api/soil/map           - Get soil data');
      console.log('   POST /api/soil/fetch-and-store - Fetch and store');
      console.log('   GET  /api/soil/insights      - Get insights');
      console.log('   GET  /api/soil/by-state/:state - Get by state');
      console.log('   POST /api/soil/bulk-fetch    - Bulk fetch');
      console.log('   GET  /api/soil/statistics/:state');
      console.log('   GET  /api/soil/health-status/:state');
      console.log('   GET  /api/soil/compare       - Compare states');
      console.log('\n');
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to initialize Soil API:', error.message);
    process.exit(1);
  }
};

export default {
  createSoilApp,
  initializeSoilAPI
};
