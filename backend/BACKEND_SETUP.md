# HaritNavinya Backend - Fully Functional Setup

## System Overview

The backend is a **multi-module Express.js server** running on **port 5000** with:

### 1. **Soil Fertility Map API** (`/api/soil/*`)
- Reads from CSV: `backend/Nutrient.csv`
- Provides soil data for 32 Indian states
- Endpoints:
  - `GET /api/soil/states` - List all states
  - `GET /api/soil/soil-data?state=Maharashtra` - Soil data for a state
  - `GET /api/soil/soil-insights?state=Maharashtra` - Soil insights
  - `GET /api/soil/statistics/Maharashtra` - State statistics

### 2. **Market Price API (Mandi)** (`/api/*`)
- Fetches real-time data from Agmarknet API
- Provides market prices, trends, and commodities
- Endpoints:
  - `GET /api/dashboard?state=Maharashtra` - Today's prices & top gainers/losers
  - `GET /api/available-states` - List all 36 Indian states
  - `GET /api/available-commodities` - List commodities
  - `GET /api/trends?commodity=Onion&state=Maharashtra` - Price trends
  - `GET /api/market-data` - Raw market data

### 3. **Weather API** (`/api/weather`)
- Real-time weather from OpenWeatherMap
- Endpoint: `GET /api/weather?lat=19.07&lon=72.87`

### 4. **Health Check** (`/api/health`)
- Status: `GET /api/health`

---

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm ci --legacy-peer-deps
npm install
```

### 2. Environment Variables
Create `.env` in backend directory:

```env
# Server Configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://haritnavinya-frontend.onrender.com,https://haritnavinya.onrender.com,https://haritnavinya.netlify.app

# External APIs
AGMARKNET_API_KEY=your_api_key_here
OPENWEATHER_API_KEY=your_api_key_here
GEMINI_API_KEY=your_api_key_here

# Logging
LOG_LEVEL=info

# Request Timeout
REQUEST_TIMEOUT=30000
```

### 3. CSV Data
- Soil data CSV must be at: `backend/Nutrient.csv`
- Server will load this automatically on startup
- Contains soil health card data for Indian states

---

## Running the Backend

### Development
```bash
npm run dev
# or with auto-reload:
npm run dev:watch
```

### Production (Render/Deployment)
```bash
npm start
```

### Expected Output
```
🌱 Initializing Soil Fertility Map API...
📂 Loading CSV data...
✅ Successfully parsed 32 states from CSV
✅ Soil API initialized successfully

╔════════════════════════════════════════════════════╗
║   HaritNavinya Backend - Production Ready          ║
║   Status: ✅ Running                               ║
╠════════════════════════════════════════════════════╣
║   Port    : 5000                                   ║
║   Env     : production                             ║
║   Storage : CSV-based                              ║
╠════════════════════════════════════════════════════╣
║   🌱 Soil API Endpoints:                           ║
║   • GET  /api/soil/states                          ║
║   • GET  /api/soil/soil-data?state=                ║
║   • GET  /api/soil/soil-insights?state=            ║
║                                                    ║
║   💹 Market API Endpoints:                          ║
║   • GET  /api/dashboard?state=                     ║
║   • GET  /api/available-states                     ║
║   • GET  /api/available-commodities                ║
║   • GET  /api/trends?commodity=                    ║
╚════════════════════════════════════════════════════╝
```

---

## API Endpoints Reference

### Soil API
```bash
# Get available states
GET /api/soil/states

# Get soil data for Maharashtra
GET /api/soil/soil-data?state=Maharashtra

# Get soil insights
GET /api/soil/soil-insights?state=Maharashtra

# Get state statistics
GET /api/soil/statistics/Maharashtra

# Compare multiple states
GET /api/soil/compare?states=Maharashtra,Gujarat,Punjab

# Crop recommendations
GET /api/soil/crops?state=Maharashtra

# Custom filter
POST /api/soil/filter
Body: { "state": "Maharashtra", "pH_min": 6.0, "pH_max": 7.5 }
```

### Market API
```bash
# Get today's prices and top gainers/losers
GET /api/dashboard?state=Maharashtra

# Get available states
GET /api/available-states

# Get available commodities
GET /api/available-commodities?state=Maharashtra

# Get price trends
GET /api/trends?commodity=Onion&state=Maharashtra&days=7

# Get all market data
GET /api/market-data?state=Maharashtra&limit=20

# Health check
GET /api/health
```

### Weather API
```bash
# Get weather for coordinates
GET /api/weather?lat=19.0760&lon=72.8777
# Mumbai coordinates: 19.0760, 72.8777
# Delhi coordinates: 28.7041, 77.1025
```

---

## Key Features

### ✅ Error Handling
- Comprehensive try-catch blocks
- Graceful fallback to mock data if API unavailable
- Detailed error messages
- HTTP status codes (200, 400, 404, 500)

### ✅ Performance
- **In-memory caching** (5-minute TTL)
- **Sequential API requests** (prevents timeout)
- **30-second API timeout** (for external services)
- **CSV data pre-loaded** on startup

### ✅ Reliability
- Health check endpoint
- Request logging
- Auto-reconnect capabilities
- Mock data fallback

### ✅ Scalability
- Modular route structure
- Separate controllers for each domain
- Services for business logic
- Utilities for reusable functions

---

## Troubleshooting

### 1. CSV Data Not Loading
```
Error: Cannot find module 'Nutrient.csv'
```
**Solution**: Ensure `Nutrient.csv` exists in backend directory
```bash
ls -la backend/Nutrient.csv
```

### 2. CORS Errors
```
Access to fetch at 'https://backend.com/api/...' blocked by CORS
```
**Solution**: Check CORS_ORIGIN env var includes frontend domain:
```env
CORS_ORIGIN=https://your-frontend.onrender.com
```

### 3. 404 on /api/dashboard
```
GET /api/dashboard 404 (Not Found)
```
**Solution**: Ensure you're calling the main server (port 5000), not disaster server (port 4000)

### 4. Timeout on "All India" Data
```
Error: signal timed out
```
**Solution**: 
- Frontend now uses sequential requests (not concurrent)
- Backend timeout set to 30 seconds
- Should complete in 5-10 minutes for all 36 states

### 5. API Key Errors
```
Error: API_KEY not configured
```
**Solution**: Ensure .env has AGMARKNET_API_KEY:
```bash
echo "AGMARKNET_API_KEY=your_key" >> backend/.env
```

---

## Deployment to Render

### 1. Update `render.yaml`
```yaml
- type: web_service
  name: haritnavinya-backend
  startCommand: cd backend && npm start
  healthCheckPath: /api/health
  envVars:
    - key: PORT
      value: "5000"
    - key: HOST
      value: "0.0.0.0"
    - key: AGMARKNET_API_KEY
      sync: false
```

### 2. Push Changes
```bash
git add .
git commit -m "Fully functional backend with all APIs"
git push origin main
```

### 3. Verify Deployment
```bash
# Wait 5-10 minutes for deployment
curl https://haritnavinya-backend.onrender.com/api/health
# Expected: {"success":true, "message":"HaritNavinya Backend APIs running"...}
```

---

## Testing Locally

```bash
# Start backend
npm start

# In another terminal, test endpoints:

# Test health
curl http://localhost:5000/api/health

# Test soil data
curl http://localhost:5000/api/soil/states

# Test market data
curl http://localhost:5000/api/available-states

# Test dashboard
curl "http://localhost:5000/api/dashboard?state=Maharashtra"
```

---

## Performance Monitoring

Monitor requests in console:
```
[2026-05-22T13:45:30.123Z] GET /api/dashboard
[2026-05-22T13:45:35.456Z] GET /api/soil/states
[2026-05-22T13:45:40.789Z] GET /api/available-states
```

Each request shows:
- Timestamp
- HTTP method
- Endpoint path
- Duration (implicit in timestamp differences)

---

## Summary

Your backend is now **fully functional** with:
- ✅ Soil data (CSV-based, 32 states)
- ✅ Market prices (Agmarknet API)
- ✅ Weather data (OpenWeatherMap)
- ✅ Error handling & caching
- ✅ CORS configured for production
- ✅ Health checks
- ✅ Request logging
- ✅ Production-ready on port 5000

**Start with**: `npm start` or `npm run dev`
