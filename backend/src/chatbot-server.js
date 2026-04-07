/**
 * Agriculture Chatbot Server
 * Backend API for AI-powered farming assistance using Google Gemini
 * 
 * Usage:
 * 1. Set GEMINI_API_KEY in .env file or environment variables
 * 2. Run: node src/chatbot-server.js
 * 3. Server will start on http://localhost:5001
 * 
 * Endpoints:
 * - POST /api/chatbot/chat - Send chat message
 * - GET /api/chatbot/health - Health check
 * - GET /api/chatbot/info - Chatbot information
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.CHATBOT_PORT || 5001;

// ===== MIDDLEWARE =====

// CORS configuration - Allow requests from frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Agriculture Chatbot API - Google Gemini Powered',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      chat: 'POST /api/chatbot/chat',
      health: 'GET /api/chatbot/health',
      info: 'GET /api/chatbot/info'
    },
    documentation: '/api/docs (if available)'
  });
});

// Chatbot API routes
app.use('/api/chatbot', chatbotRoutes);

// ===== ERROR HANDLING =====

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      chat: 'POST /api/chatbot/chat',
      health: 'GET /api/chatbot/health',
      info: 'GET /api/chatbot/info'
    }
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ===== SERVER START =====

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   Agriculture Chatbot API - Google Gemini Powered      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🌱 Server running at: http://localhost:${PORT}
║  📡 Environment: ${process.env.NODE_ENV || 'development'}
║  🤖 Model: gemini-1.5-flash                            ║
║  🔑 API Key Status: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}
║                                                        ║
║  Available Endpoints:                                   ║
║  • POST   /api/chatbot/chat  - Send message            ║
║  • GET    /api/chatbot/health - Health check           ║
║  • GET    /api/chatbot/info  - Chatbot info            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);

  // Warn if API key is missing
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
    console.warn('⚠️  Set GEMINI_API_KEY in .env file or environment to use the chatbot');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
