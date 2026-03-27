/**
 * Production-Ready Node.js Backend Server
 * Agricultural Market Intelligence API
 * 
 * Features:
 * - Express.js setup with CORS
 * - Real-time market price data from Agmarknet API
 * - Dashboard with today's prices, top gainers/losers, and price trends
 * - Comprehensive error handling and logging
 * - Response caching for performance optimization
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mandiRoutes from './routes/mandiRoutes.js';

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
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',');
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
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
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',');
  
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
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
    message: 'Agricultural Market Intelligence API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

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
    message: 'Welcome to Agricultural Market Intelligence API',
    version: '1.0.0',
    description: 'Real-time agricultural market prices and trends powered by Agmarknet',
    endpoints: {
      dashboard: '/api/dashboard?state=Maharashtra&commodity=All',
      trends: '/api/trends?commodity=Onion&state=Maharashtra&days=7',
      states: '/api/available-states',
      commodities: '/api/available-commodities?state=Maharashtra',
      marketData: '/api/market-data?state=Maharashtra&limit=20',
      health: '/api/health'
    },
    documentation: {
      dashboard: 'Get summary of today\'s prices, top gainers/losers, and trends',
      trends: 'Get 7-day price trend for specific commodity',
      states: 'Get list of available states',
      commodities: 'Get list of available commodities for a state',
      marketData: 'Get detailed market data with records'
    }
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
 * SERVER STARTUP
 * ============================================
 */

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Agricultural Market Intelligence API             ║
║   Status: ✅ Running                               ║
╠════════════════════════════════════════════════════╣
║   Port    : ${PORT.toString().padEnd(45)}║
║   Env     : ${(process.env.NODE_ENV || 'development').padEnd(45)}║
║   API Key : ${(process.env.API_KEY ? '✅ Configured' : '❌ Missing').padEnd(45)}║
╠════════════════════════════════════════════════════╣
║   Available Endpoints:                             ║
║   • GET  /api/dashboard                            ║
║   • GET  /api/trends                               ║
║   • GET  /api/available-states                     ║
║   • GET  /api/available-commodities                ║
║   • GET  /api/market-data                          ║
║   • GET  /api/health                               ║
╚════════════════════════════════════════════════════╝
  `);

  // Validate environment variables
  if (!process.env.API_KEY) {
    console.warn(`⚠️  Warning: API_KEY not set in environment variables`);
  }
});

/**
 * ============================================
 * GRACEFUL SHUTDOWN
 * ============================================
 */

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Gracefully shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
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
