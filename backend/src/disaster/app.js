import express from 'express';
import cors from 'cors';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware to attach io to requests (optional - for accessing Socket.IO from controllers)
  app.use((req, res, next) => {
    req.io = app.locals.io;
    next();
  });

  // Health check endpoint
  app.get('/api/disaster/health', (req, res) => {
    res.json({ success: true, message: 'Disaster monitoring system is running', timestamp: new Date() });
  });

  // Routes will be mounted in server.js
  app.locals.routes = [];

  return app;
};

export const mountRoutes = (app, routes) => {
  routes.forEach(setupRoute => {
    setupRoute(app, app.locals.io);
  });
};
