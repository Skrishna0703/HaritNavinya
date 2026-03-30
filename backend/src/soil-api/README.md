# 🌱 Soil Fertility Map API - Production-Ready Backend

**Cycle-II Data Integration from Soil Health Card Scheme (India)**

A complete, production-ready Node.js/Express backend for integrating soil fertility data from the Soil Health Card portal. Provides real-time soil analysis, district-wise mapping, and AI-powered recommendations.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Usage Examples](#usage-examples)
- [Recommendations Engine](#recommendations-engine)
- [Production Deployment](#production-deployment)

---

## ✨ Features

✅ **Soil Health Card Integration** - Fetches real-time Cycle-II data from official SHC portal
✅ **MongoDB Storage** - Persistent data storage with indexing for fast queries
✅ **Fertility Score Calculation** - Automatic NPK-based soil fertility assessment
✅ **Smart Recommendations** - AI-powered fertilizer and amendments suggestions
✅ **Multi-State Support** - Handle entire country or specific regions
✅ **Bulk Operations** - Fetch data for multiple states simultaneously
✅ **Caching System** - 24-hour cache to minimize API calls
✅ **Statistics & Analytics** - State-level soil analysis and trends
✅ **Error Handling** - Comprehensive error handling with fallback data
✅ **Rate Limiting** - Built-in rate limiting for fair API usage
✅ **Request Validation** - Thorough input validation and sanitization
✅ **CORS Enabled** - Ready for frontend integration
✅ **Logging & Monitoring** - Morgan logs and detailed console output

---

## 🏗️ Architecture

```
backend/src/soil-api/
├── models/
│   └── Soil.js                 # MongoDB schema for soil data
├── services/
│   └── soilDataService.js      # External API integration & data normalization
├── controllers/
│   └── soilController.js       # Route handlers & business logic
├── routes/
│   └── soilRoutes.js           # API endpoint definitions
├── middleware/
│   └── validation.js           # Validation, error handling, rate limiting
├── utils/
│   └── soilCalculations.js    # Calculations, recommendations, formatting
├── config/
│   └── database.js             # MongoDB connection setup
└── soilApp.js                  # Express app setup & initialization
```

---

## 🚀 Installation

### Prerequisites

- Node.js 14+
- MongoDB 4.4+
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install mongoose axios cors morgan dotenv
```

### Step 2: Environment Configuration

Create `.env` file in `/backend`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/haritnavinya-soil

# Server Configuration
PORT=5000
SOIL_API_PORT=5000
NODE_ENV=development

# CORS Setup
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# API Configuration
API_KEY=579b464db66ec23bdd0000017954c766c08b48836cca314f2ac28314
```

### Step 3: Start MongoDB

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Initialize Soil API

Add to your main server file (`src/disaster-server.js`):

```javascript
import { createSoilApp, initializeSoilAPI } from './soil-api/soilApp.js';

const soilApp = createSoilApp();
await initializeSoilAPI(soilApp);
```

---

## ⚙️ Configuration

### MongoDB Setup

Ensure MongoDB is running and accessible:

```bash
# Test connection
mongo --eval "db.adminCommand('ping')"
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | localhost:27017 |
| PORT | Server port | 5000 |
| SOIL_API_PORT | Soil API port | 5000 |
| NODE_ENV | Environment | development |
| CORS_ORIGIN | Allowed origins | localhost:3000 |

---

## 📡 API Endpoints

### 1. Get Soil Map Data

```http
GET /api/soil/map?state=Maharashtra&district=Pune
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "state": "Maharashtra",
      "district": "Pune"
    },
    "nutrients": {
      "nitrogen": { "value": 280, "category": "Medium" },
      "phosphorus": { "value": 45, "category": "Low" },
      "potassium": { "value": 220, "category": "High" },
      "pH": { "value": 6.8, "category": "Neutral" }
    },
    "fertilityScore": 78,
    "overallCategory": "Medium",
    "recommendations": [...]
  }
}
```

### 2. Fetch and Store Data

```http
POST /api/soil/fetch-and-store
Content-Type: application/json

{
  "state": "Maharashtra",
  "district": "Pune"
}
```

Fetches from SHC API and stores in database.

### 3. Get Soil Insights

```http
GET /api/soil/insights?state=Maharashtra
```

Returns comprehensive analysis with recommendations.

### 4. Get All State Data

```http
GET /api/soil/by-state/Maharashtra?limit=50&page=1
```

### 5. Bulk Fetch Multiple States

```http
POST /api/soil/bulk-fetch
Content-Type: application/json

{
  "states": ["Maharashtra", "Gujarat", "Punjab"]
}
```

### 6. Get State Statistics

```http
GET /api/soil/statistics/Maharashtra
```

### 7. Update Soil Data

```http
PUT /api/soil/update/Maharashtra/Pune
Content-Type: application/json

{
  "nutrients": {
    "nitrogen": { "value": 300, "category": "High" }
  }
}
```

### 8. Compare States

```http
GET /api/soil/compare?states=Maharashtra,Gujarat,Punjab
```

### 9. Get Health Status

```http
GET /api/soil/health-status/Maharashtra
```

---

## 📊 Data Models

### Soil Fertility Schema

```javascript
{
  state: String,                    // State name
  district: String,                 // District name
  block: String,                    // Block name
  village: String,                  // Village name
  
  nutrients: {
    nitrogen: {
      value: Number,                // mg/kg
      category: 'Low'|'Medium'|'High',
      unit: 'mg/kg'
    },
    phosphorus: {
      value: Number,                // mg/kg
      category: 'Low'|'Medium'|'High'
    },
    potassium: {
      value: Number,                // mg/kg
      category: 'Low'|'Medium'|'High'
    },
    organicCarbon: {
      value: Number,                // %
      category: 'Low'|'Medium'|'High'
    },
    pH: {
      value: Number,                // 0-14
      category: 'Acidic'|'Neutral'|'Alkaline'
    }
  },
  
  fertilityScore: Number,           // 0-100
  overallCategory: String,          // Low/Medium/High
  cycle: 'Cycle-II',
  lastUpdated: Date
}
```

---

## 📖 Usage Examples

### JavaScript/Node.js

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/soil';

// Get soil data
async function getSoilData() {
  try {
    const response = await axios.get(`${API_URL}/map?state=Maharashtra`);
    console.log('Soil Data:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get insights
async function getInsights() {
  const response = await axios.get(`${API_URL}/insights?state=Maharashtra`);
  const { nutrients, recommendations } = response.data.data;
  
  console.log('Fertility Score:', response.data.data.fertilityScore);
  recommendations.forEach(rec => {
    console.log(`${rec.nutrient}: ${rec.recommendation}`);
  });
}

// Fetch bulk data
async function bulkFetch() {
  const response = await axios.post(`${API_URL}/bulk-fetch`, {
    states: ['Maharashtra', 'Gujarat', 'Punjab']
  });
  
  console.log(`Successfully fetched: ${response.data.data.successful} states`);
}
```

### React/TypeScript

```typescript
import axios from 'axios';

interface SoilData {
  state: string;
  district: string;
  fertilityScore: number;
  nutrients: Record<string, any>;
  recommendations: Array<any>;
}

async function fetchSoilData(state: string): Promise<SoilData> {
  const response = await axios.get('/api/soil/map', {
    params: { state }
  });
  return response.data.data;
}

// Usage in component
const [soilData, setSoilData] = useState<SoilData | null>(null);

useEffect(() => {
  fetchSoilData('Maharashtra').then(setSoilData);
}, []);
```

---

## 🤖 Recommendations Engine

### Nutrient Analysis

```javascript
Nitrogen (N):
  < 50 mg/kg    → "Add Urea (100-150 kg/ha)"
  50-250 mg/kg  → "Adequate, monitor"
  > 250 mg/kg   → "Sufficient"

Phosphorus (P):
  < 30 mg/kg    → "Add DAP (50-75 kg/ha)"
  30-60 mg/kg   → "Good level"
  > 60 mg/kg    → "High, reduce applications"

Potassium (K):
  < 40 mg/kg    → "Add MOP (40-50 kg/ha)"
  40-200 mg/kg  → "Adequate"
  > 200 mg/kg   → "High"
```

### pH Management

```javascript
pH < 6.0      → Acidic    → "Add Agricultural Lime (2-4 tons/ha)"
pH 6.0-7.5    → Neutral   → "Optimal - maintain"
pH > 7.5      → Alkaline  → "Add Sulfur (1-2 tons/ha)"
```

### Organic Matter

```javascript
< 0.5%   → "Very Low - Add 15-20 tons FYM/ha"
0.5-1.0% → "Low - Add 10-15 tons FYM/ha"
> 1.0%   → "Good - Maintain with crop residues"
```

---

## 🔒 Production Deployment

### Prerequisites

- Docker or cloud platform (AWS/Azure/GCP)
- MongoDB Atlas for cloud database
- Nginx reverse proxy
- SSL certificate

### Docker Setup

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/soil-api/soilApp.js"]
```

### Environment for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/soil
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

### Performance Optimization

```javascript
// Enable caching headers
res.set('Cache-Control', 'public, max-age=3600');

// Use MongoDB connection pooling
maxPoolSize: 10

// Enable gzip compression
app.use(compression());

// Rate limiting
100 requests/minute per IP
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB
mongod
```

### Port Already in Use

```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Issues

Check `CORS_ORIGIN` environment variable matches frontend URL.

### Timeout on API Calls

Increase timeout in `.env`:
```env
API_TIMEOUT=30000
```

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error description",
  "details": ["Field error 1", "Field error 2"]
}
```

---

## 📚 References

- [Soil Health Card Portal](https://www.soilhealth.dac.gov.in)
- [Nutrient Management in India](https://www.icar.org.in)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs for detailed errors

---

## 📄 License

This project is part of HaritNavinya - Agricultural Support System

**Created**: March 2026
**Version**: 1.0.0

---

🌾 **Building a data-driven agricultural future with soil science!**
