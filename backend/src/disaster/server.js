import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { createApp, mountRoutes } from './app.js';
import { setupAlertSocket } from './sockets/alert.socket.js';
import { setupAlertsRoutes } from './routes/alerts.routes.js';
import { setupRegionsRoutes } from './routes/regions.routes.js';
import { setupUsersRoutes } from './routes/users.routes.js';
import { weatherRouter } from './routes/weather.routes.js';
import mandiRoutes from '../routes/mandiRoutes.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
console.log('🔧 Loading .env from:', envPath);
dotenv.config({ path: envPath });

const PORT = process.env.DISASTER_PORT || 4000;
const HOST = process.env.HOST || 'localhost';

// Create Express app
const app = createApp();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 1e6
});

// Store io instance in app for access from routes
app.locals.io = io;

// Setup Socket.IO handlers
setupAlertSocket(io);

// Mount routes
setupAlertsRoutes(app, io);
setupRegionsRoutes(app);
setupUsersRoutes(app);
app.use(weatherRouter);
app.use('/api/mandi', mandiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /api/disaster/health',
      'GET /api/disaster/alerts',
      'POST /api/disaster/alerts',
      'GET /api/disaster/alerts/:id',
      'PUT /api/disaster/alerts/:id',
      'DELETE /api/disaster/alerts/:id',
      'GET /api/disaster/regions',
      'GET /api/disaster/regions/:name/alerts',
      'GET /api/weather (by lat/lon parameters)',
      'GET /api/weather/region/:name',
      'GET /api/disaster/users/:id',
      'GET /api/disaster/users/:id/notifications',
      'PUT /api/disaster/users/:id/notifications',
      'GET /api/disaster/users/:id/checklist',
      'POST /api/disaster/users/:id/checklist',
      'PUT /api/disaster/users/:id/checklist/:itemId',
      'GET /api/mandi (fetch prices with state & commodity filters)',
      'GET /api/mandi/states (available states)',
      'GET /api/mandi/commodities (available commodities)',
      'GET /api/mandi/trends (price trends)'
    ]
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n✅ Disaster Monitoring System initialized`);
  console.log(`📡 HTTP Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Socket.IO listening for real-time connections`);
  console.log(`📍 Check health: curl http://${HOST}:${PORT}/api/disaster/health`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  Alerts: GET/POST /api/disaster/alerts`);
  console.log(`  Regions: GET /api/disaster/regions`);
  console.log(`  Weather: GET /api/weather?lat=<lat>&lon=<lon>`);
  console.log(`  Mandi Prices: GET /api/mandi?state=<state>&commodity=<commodity>`);
  console.log(`  Users: GET /api/disaster/users/:id`);
  console.log(`\n🌾 Mandi API examples:`);
  console.log(`  http://${HOST}:${PORT}/api/mandi (all prices)`);
  console.log(`  http://${HOST}:${PORT}/api/mandi?state=Maharashtra&commodity=Onion`);
  console.log(`  http://${HOST}:${PORT}/api/mandi/states (list all states)`);
  console.log(`  http://${HOST}:${PORT}/api/mandi/commodities (list all commodities)`);
  console.log(`  http://${HOST}:${PORT}/api/mandi/trends?state=Maharashtra&commodity=Onion`);
  console.log(`\n🌍 Weather API examples:`);
  console.log(`  http://${HOST}:${PORT}/api/weather?lat=19.0760&lon=72.8777 (Mumbai)`);
  console.log(`  http://${HOST}:${PORT}/api/weather?lat=28.7041&lon=77.1025 (Delhi)`);
  console.log(`\n`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down Disaster Monitoring System...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
  
  // Force close after 5 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default server;
