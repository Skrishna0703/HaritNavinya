import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather.routes.js';

dotenv.config();

const app = express();

// CORS configuration - supports both environment variable and hardcoded list
const allowedOriginsList = (process.env.CORS_ORIGIN || 
  'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://haritnavinya.netlify.app,https://haritnavinya.onrender.com,https://haritnavinya-backend.onrender.com,https://haritnavinya-frontend.onrender.com')
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow localhost
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Check against allowed origins
    if (allowedOriginsList.includes(origin)) {
      return callback(null, true);
    }
    
    // Development mode
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    console.warn(`CORS: Rejected weather API request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});