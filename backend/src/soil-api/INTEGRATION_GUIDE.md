# 🔗 Soil API Integration Guide

## Quick Integration into Existing Express Server

### Step 1: Install Required Dependencies

```bash
npm install mongoose axios cors morgan dotenv node-cron
```

### Step 2: Update Your Main Server File

File: `src/disaster-server.js`

```javascript
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { createApp, mountRoutes } from './disaster/app.js';
import { setupAlertSocket } from './sockets/alert.socket.js';
import { setupAlertsRoutes } from './routes/alerts.routes.js';
import { setupRegionsRoutes } from './routes/regions.routes.js';
import { setupUsersRoutes } from './routes/users.routes.js';
import { weatherRouter } from './routes/weather.routes.js';
import mandiRoutes from './routes/mandiRoutes.js';

// ===== ADD SOIL API IMPORTS =====
import { createSoilApp, initializeSoilAPI } from './soil-api/soilApp.js';
import soilRoutes from './soil-api/routes/soilRoutes.js';
import { connectMongoDB } from './soil-api/config/database.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
console.log('🔧 Loading .env from:', envPath);
dotenv.config({ path: envPath });

const PORT = process.env.DISASTER_PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Create Express app
const app = createApp();

// ===== SETUP SOIL API =====
// Connect to MongoDB first
try {
  await connectMongoDB();
  console.log('✅ MongoDB connected for Soil API');
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  // Continue without soil API if connection fails
}

// Mount Soil API routes
app.use('/api/soil', soilRoutes);

// ===== REST OF YOUR EXISTING CODE =====
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

app.locals.io = io;

// ... rest of your setup code ...

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n✅ Server running on http://${HOST}:${PORT}`);
  console.log(`📍 Soil API available at http://${HOST}:${PORT}/api/soil`);
});
```

### Step 3: With Scheduler (Optional - Production)

To enable automatic data refresh, add to your server file:

```javascript
import { setupScheduledRefresh } from './soil-api/utils/scheduler.js';

// After MongoDB connection
// Setup weekly refresh at 2 AM every Sunday
setupScheduledRefresh('0 2 * * 0');
```

### Step 4: Verify Integration

Test the API:

```bash
# Test soil API
curl http://localhost:5000/api/soil/health

# Fetch soil data
curl http://localhost:5000/api/soil/map?state=Maharashtra

# Get insights
curl http://localhost:5000/api/soil/insights?state=Maharashtra
```

---

## 📋 One-Off Integration Checklist

- [ ] Install dependencies: `npm install mongoose axios cors morgan`
- [ ] Add soil API imports to main server file
- [ ] Connect to MongoDB in server initialization
- [ ] Mount soil routes: `app.use('/api/soil', soilRoutes)`
- [ ] Update `.env` with `MONGODB_URI`
- [ ] Restart server and test endpoints
- [ ] Verify MongoDB collections created
- [ ] Check logs for "Soil API initialized"

---

## 🧪 Testing the Integration

### Test 1: Get Soil Map Data

```bash
curl -X GET "http://localhost:5000/api/soil/map?state=Maharashtra&district=Pune"
```

### Test 2: Fetch and Store Data

```bash
curl -X POST http://localhost:5000/api/soil/fetch-and-store \
  -H "Content-Type: application/json" \
  -d '{"state":"Maharashtra","district":"Pune"}'
```

### Test 3: Get Insights

```bash
curl -X GET "http://localhost:5000/api/soil/insights?state=Maharashtra"
```

### Test 4: Bulk Fetch

```bash
curl -X POST http://localhost:5000/api/soil/bulk-fetch \
  -H "Content-Type: application/json" \
  -d '{"states":["Maharashtra","Gujarat","Punjab"]}'
```

---

## 🖼️ Frontend Integration

### React Example

```typescript
import axios from 'axios';
import { useEffect, useState } from 'react';

export function SoilDataComponent() {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSoilData = async (state: string) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/soil/map', {
        params: { state }
      });
      setSoilData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch soil data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => fetchSoilData('Maharashtra')}>
        Load Maharashtra Data
      </button>
      
      {loading && <p>Loading...</p>}
      
      {soilData && (
        <div>
          <h2>{soilData.location.state} - {soilData.location.district}</h2>
          <p>Fertility Score: {soilData.fertilityScore}/100</p>
          <p>Category: {soilData.overallCategory}</p>
          
          <h3>Nutrients:</h3>
          <ul>
            <li>Nitrogen: {soilData.nutrients.nitrogen.value} ({soilData.nutrients.nitrogen.category})</li>
            <li>Phosphorus: {soilData.nutrients.phosphorus.value} ({soilData.nutrients.phosphorus.category})</li>
            <li>Potassium: {soilData.nutrients.potassium.value} ({soilData.nutrients.potassium.category})</li>
            <li>pH: {soilData.nutrients.pH.value} ({soilData.nutrients.pH.category})</li>
          </ul>
          
          <h3>Recommendations:</h3>
          <ul>
            {soilData.recommendations.map((rec, i) => (
              <li key={i}>{rec.suggestion}: {rec.quantity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Advanced Configuration

### MongoDB Atlas (Cloud)

```env
# In .env
MONGODB_URI=mongodb+srv://username:password@cluster-xxxxx.mongodb.net/haritnavinya-soil?retryWrites=true&w=majority
```

### Custom Cron Schedule

```javascript
// Daily update
setupScheduledRefresh('0 2 * * *');        // 2 AM every day

// Multiple times per week
setupScheduledRefresh('0 2 * * 1,3,5');    // Mon, Wed, Fri at 2 AM

// Every 6 hours
setupScheduledRefresh('0 */6 * * *');      // Every 6 hours
```

### Rate Limiting Configuration

Edit `middleware/validation.js`:

```javascript
const MAX_REQUESTS_PER_MINUTE = 300;  // Increase for production
const RATE_LIMIT_WINDOW = 60 * 1000;  // 1 minute
```

---

## 📊 Monitoring & Health Checks

### Get System Status

```bash
curl http://localhost:5000/api/soil/health
```

### Check Scheduler Status

Add endpoint to routes:

```javascript
router.get('/scheduler-status', (req, res) => {
  const status = getSchedulerHealth();
  res.json(status);
});
```

---

## 🔒 Security Considerations

1. **Environment Variables**: Keep API keys in `.env`, never commit to git
2. **CORS**: Configure `CORS_ORIGIN` for your frontend URL only
3. **Rate Limiting**: Enable rate limiting in production
4. **MongoDB**: Use strong passwords, enable authentication
5. **Validation**: All inputs are validated (already implemented)

---

## 📝 Logging & Debugging

Enable detailed logging:

```env
# .env
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
```

Check logs:

```bash
# All logs
tail -f server.log

# Soil API logs only
grep "soil" server.log
```

---

## 🐛 Common Issues

### Issue: "Cannot find module 'soil-api'"
**Solution**: Ensure import path is relative to where file is located:
```javascript
import soilRoutes from './soil-api/routes/soilRoutes.js';
```

### Issue: MongoDB connection failed
**Solution**: 
1. Verify MongoDB is running: `mongod`
2. Check MONGODB_URI in .env
3. Test connection: `mongo --eval "db.adminCommand('ping')"`

### Issue: API returns 404
**Solution**: Ensure soil routes are mounted: `app.use('/api/soil', soilRoutes);`

### Issue: CORS errors in browser
**Solution**: Update CORS_ORIGIN to match frontend URL in .env

---

## 🎯 Next Steps

1. ✅ Complete integration
2. ✅ Test all endpoints
3. ✅ Connect frontend components
4. ✅ Setup MongoDB backup strategy
5. ✅ Configure production deployment
6. ✅ Setup monitoring and alerts

---

## 📞 Support

For integration help:
1. Check logs for error messages
2. Verify all imports and paths
3. Ensure MongoDB is accessible
4. Check that ports are not in use
5. Verify .env configuration

---

**Integration Complete!** 🎉

Your Soil Fertility Map API is now integrated and ready for use!
