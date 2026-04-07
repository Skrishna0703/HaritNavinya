/**
 * HaritNavinya Production-Ready Backend Server
 * Integrated Agricultural Intelligence Platform
 * 
 * Features:
 * - Express.js setup with CORS
 * - Soil Fertility Map API with MongoDB integration
 * - Real-time market price data from Agmarknet  
 * - Dashboard with today's prices, top gainers/losers, and trends
 * - Comprehensive error handling and logging
 * - CSV data processing for Soil Health Card dataset
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mandiRoutes from './routes/mandiRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import { loadSoilDataFromCSV } from './services/csvDataParser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ============================================
 * MIDDLEWARE SETUP
 * ============================================
 */

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173').split(',');
    // Allow any localhost origin in development
    if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Additional CORS headers for better compatibility
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173').split(',');
  
  // Allow any localhost origin in development
  if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * ============================================
 * ROUTES
 * ============================================
 */

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HaritNavinya Backend APIs running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    modules: [
      { name: 'Soil Fertility Map', endpoint: '/api/soil', status: '✅' },
      { name: 'Market Data', endpoint: '/api/mandi', status: '✅' }
    ]
  });
});

// Soil API routes
app.use('/api/soil', soilRoutes);

// Mandi/Market API routes
app.use('/api', mandiRoutes);

/**
 * ============================================
 * ROOT ENDPOINT
 * ============================================
 */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to HaritNavinya Backend APIs',
    version: '1.0.0',
    description: 'Agricultural intelligence platform with market data and soil analysis',
    modules: {
      soil: {
        description: 'Soil Fertility Map & Analysis (Cycle-II Data)',
        startHere: 'GET /api/soil/health',
        endpoints: {
          'Get Soil Data': 'GET /api/soil/soil-data?state=Maharashtra',
          'Get Insights': 'GET /api/soil/soil-insights?state=Maharashtra',
          'List States': 'GET /api/soil/states',
          'Get Districts': 'GET /api/soil/districts?state=Maharashtra',
          'Compare States': 'GET /api/soil/compare?states=Maharashtra,Gujarat',
          'Statistics': 'GET /api/soil/statistics/Maharashtra',
          'Crop Recommendations': 'GET /api/soil/crops?state=Maharashtra',
          'Filter': 'POST /api/soil/filter'
        }
      },
      market: {
        description: 'Market Price & Commodity Data',
        startHere: 'GET /api/health',
        endpoints: {
          'Dashboard': 'GET /api/dashboard?state=Maharashtra&commodity=All',
          'Trends': 'GET /api/trends?commodity=Onion&state=Maharashtra&days=7',
          'States': 'GET /api/available-states',
          'Commodities': 'GET /api/available-commodities?state=Maharashtra',
          'Market Data': 'GET /api/market-data?state=Maharashtra&limit=20'
        }
      }
    },
    health: '/api/health',
    documentation: 'Visit https://github.com/yourusername/HaritNavinya'
  });
});

/**
 * ============================================
 * ERROR HANDLING
 * ============================================
 */

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: {
      dashboard: '/api/dashboard',
      trends: '/api/trends',
      states: '/api/available-states',
      commodities: '/api/available-commodities',
      marketData: '/api/market-data',
      health: '/api/health'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ❌ Error:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: 'Server Error',
    message,
    timestamp,
    url: req.url
  });
});

/**
 * ============================================
 * INITIALIZE SOIL API
 * ============================================
 */

async function initializeSoilAPI() {
  try {
    console.log('\n🌱 Initializing Soil Fertility Map API...');

    // Load CSV data
    const csvPath = path.join(__dirname, '..', 'Nutrient.csv');
    console.log('📂 Loading CSV data...');
    await loadSoilDataFromCSV(csvPath);

    console.log('✅ Soil API initialized successfully\n');
    return true;
  } catch (error) {
    console.warn(`⚠️  Soil API initialization warning: ${error.message}`);
    console.warn('⚠️  Soil API will work with CSV cache only\n');
    return false;
  }
}

/**
 * ============================================
 * SERVER STARTUP
 * ============================================
 */

async function startServer() {
  try {
    // Initialize Soil API
    await initializeSoilAPI();

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║   HaritNavinya Backend - Production Ready          ║
║   Status: ✅ Running                               ║
╠════════════════════════════════════════════════════╣
║   Port    : ${PORT.toString().padEnd(45)}║
║   Env     : ${(process.env.NODE_ENV || 'development').padEnd(45)}║
║   Storage : CSV-based                              ║
╠════════════════════════════════════════════════════╣
║   🌱 Soil API Endpoints:                           ║
║   • GET  /api/soil/health                          ║
║   • GET  /api/soil/soil-data?state=                ║
║   • GET  /api/soil/soil-insights?state=            ║
║   • GET  /api/soil/states                          ║
║   • GET  /api/soil/districts?state=                ║
║   • GET  /api/soil/compare?states=                 ║
║   • GET  /api/soil/statistics/:state               ║
║   • POST /api/soil/filter                          ║
║   • GET  /api/soil/crops?state=                    ║
║                                                    ║
║   💹 Market API Endpoints:                          ║
║   • GET  /api/dashboard                            ║
║   • GET  /api/trends                               ║
║   • GET  /api/available-states                     ║
║   • GET  /api/available-commodities                ║
║   • GET  /api/market-data                          ║
╚════════════════════════════════════════════════════╝
      `);

      // Validate environment variables
      if (!process.env.API_KEY) {
        console.warn(`⚠️  Warning: API_KEY not set in environment variables`);
      }
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
let server;
startServer().then(srv => {
  server = srv;
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

/**
 * ============================================
 * GRACEFUL SHUTDOWN
 * ============================================
 */

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Gracefully shutting down...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
