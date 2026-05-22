import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather.routes.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'https://haritnavinya.netlify.app',
    'https://haritnavinya.onrender.com',
    'https://haritnavinya-frontend.onrender.com'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});