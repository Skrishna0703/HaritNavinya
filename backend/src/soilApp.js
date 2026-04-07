import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import soilRoutes from './routes/soilRoutes.js';
import { loadSoilDataFromCSV } from './services/csvDataParser.js';
import { initializeSoilData } from './services/soilService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create Express app with middleware
 */
export function createSoilApp() {
  const app = express();

  // Middleware
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://haritnavinya.netlify.app',
      'https://haritnavinya.onrender.com'
    ],
    credentials: true
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  // Mount soil routes
  app.use('/api/soil', soilRoutes);

  // Root endpoint
  app.get('/api/soil/', (req, res) => {
    res.json({
      message: 'Soil Fertility Map API v1.0',
      documentation: '/api/soil/health',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not found',
    });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  });

  return app;
}

/**
 * Initialize database and load CSV data
 */
export async function initializeSoilAPI(mongodbUri) {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Load CSV data into cache
    console.log('📂 Loading CSV data...');
    const csvPath = path.join(__dirname, '..', '..', 'Nutrient.csv');
    await loadSoilDataFromCSV(csvPath);
    console.log('✅ CSV data loaded into cache');

    // Initialize soil database
    console.log('🔄 Initializing soil database...');
    const result = await initializeSoilData();
    console.log(`✅ Database initialized: ${result.recordCount} records`);

    return { success: true, recordCount: result.recordCount };
  } catch (error) {
    console.error('❌ Error initializing Soil API:', error.message);
    throw error;
  }
}

/**
 * Create and start server
 */
export async function startSoilServer(port = 5000, mongodbUri = 'mongodb://localhost:27017/haritnavinya') {
  try {
    // Initialize API
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🌱 Soil Fertility Map API - Starting Initialization');
    console.log('═══════════════════════════════════════════════════════════\n');

    await initializeSoilAPI(mongodbUri);

    // Create app
    const app = createSoilApp();

    // Start server
    const server = app.listen(port, () => {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log(`🚀 Soil API Server running on port ${port}`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('\n📚 Available Endpoints:');
      console.log('  ✓ GET  /api/soil/health - Health check');
      console.log('  ✓ GET  /api/soil/soil-data - Get soil data');
      console.log('  ✓ GET  /api/soil/soil-insights - Get insights');
      console.log('  ✓ GET  /api/soil/states - List all states');
      console.log('  ✓ GET  /api/soil/districts - Get districts');
      console.log('  ✓ GET  /api/soil/compare - Compare states');
      console.log('  ✓ GET  /api/soil/statistics/:state - State statistics');
      console.log('  ✓ POST /api/soil/filter - Filter soil data');
      console.log('  ✓ GET  /api/soil/crops - Get crop recommendations');
      console.log('  ✓ POST /api/soil/init - Initialize database\n');
      console.log('═══════════════════════════════════════════════════════════\n');
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}
