import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const PORT = 4000; // Weather service port
app.listen(PORT, () => {
  console.log(`Weather backend listening on port ${PORT}`);
});
