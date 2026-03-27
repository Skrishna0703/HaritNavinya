# Agricultural Market Intelligence API Documentation

## Overview

A production-ready Node.js backend using Express.js that provides real-time agricultural market intelligence including price trends, today's prices, top gainers, and top losers. The API integrates with the Agmarknet API to fetch live market data for Indian agricultural commodities.

**API Source**: [Agmarknet API](https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24)

---

## Features

✅ **Real-time Market Data** - Live price updates from Agmarknet  
✅ **Dashboard Endpoint** - Summary of today's prices, trends, and gainers/losers  
✅ **Trend Analysis** - 7-day price trends for any commodity  
✅ **Smart Filtering** - Filter by state, market, and commodity  
✅ **Response Caching** - 5-minute cache for improved performance  
✅ **Error Handling** - Comprehensive error handling with meaningful messages  
✅ **CORS Enabled** - Ready for frontend integration  
✅ **Production Ready** - Graceful shutdown, logging, and monitoring  

---

## Setup Instructions

### 1. Prerequisites

- Node.js 14+ installed
- npm or yarn
- Agmarknet API key (get from [data.gov.in](https://data.gov.in/))

### 2. Install Dependencies

All required dependencies are already in `package.json`:
- `express` - Web framework
- `axios` - HTTP client for API calls
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management
- `nodemon` - Development auto-reload (dev dependency)

### 3. Environment Configuration

1. Copy the template file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
API_KEY=your_agmarknet_api_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 4. Start the Server

**Development with auto-reload:**
```bash
npm run mandi:dev
# or
npm run server:dev
```

**Production:**
```bash
npm run mandi:start
# or
npm run server
```

The server will start on `http://localhost:5000`

---

## API Endpoints

### 1. Dashboard Endpoint
**GET** `/api/dashboard`

Returns today's prices, top gainers, top losers, and price trends.

**Query Parameters:**
- `state` (string, default: `Maharashtra`) - State name
- `market` (string, optional) - Market name
- `commodity` (string, default: `All`) - Specific commodity or "All"

**Example Request:**
```bash
GET /api/dashboard?state=Maharashtra&commodity=All
GET /api/dashboard?state=Punjab&market=Jalandhar&commodity=Wheat
GET /api/dashboard?state=Tamil%20Nadu&commodity=Onion
```

**Response Format:**
```json
{
  "success": true,
  "state": "Maharashtra",
  "market": "All Markets",
  "commodity": "All",
  "generatedAt": "2026-03-23T10:30:00.000Z",
  "stats": {
    "totalCommodities": 45,
    "topGainersCount": 3,
    "topLosersCount": 3,
    "trendsTracked": 10
  },
  "todayPrices": [
    {
      "commodity": "Wheat",
      "price": 2150,
      "change": "+2.3%",
      "volume": 2450,
      "unit": "Tonnes"
    }
  ],
  "topGainers": [
    {
      "commodity": "Tomato",
      "price": 4500,
      "change": "+12.3%",
      "percentValue": 12.34
    }
  ],
  "topLosers": [
    {
      "commodity": "Onion",
      "price": 3200,
      "change": "-2.8%",
      "percentValue": -2.80
    }
  ],
  "priceTrends": [
    {
      "commodity": "Wheat",
      "data": [
        {
          "date": "2026-03-15",
          "price": 2100
        },
        {
          "date": "2026-03-16",
          "price": 2150
        }
      ]
    }
  ]
}
```

---

### 2. Trends Endpoint (Bonus)
**GET** `/api/trends`

Get price trends for a specific commodity over the last N days.

**Query Parameters:**
- `commodity` (string, **REQUIRED**) - Commodity name
- `state` (string, default: `Maharashtra`) - State name
- `days` (number, default: `7`) - Number of days to include
- `market` (string, optional) - Market name

**Example Requests:**
```bash
GET /api/trends?commodity=Onion&state=Maharashtra&days=7
GET /api/trends?commodity=Wheat&state=Punjab&days=14
GET /api/trends?commodity=Tomato&state=Karnataka&market=Bangalore&days=30
```

**Response Format:**
```json
{
  "success": true,
  "commodity": "Onion",
  "state": "Maharashtra",
  "market": "All Markets",
  "period": "Last 7 days",
  "generatedAt": "2026-03-23T10:30:00.000Z",
  "statistics": {
    "averagePrice": 3200,
    "minPrice": 3050,
    "maxPrice": 3450,
    "priceChange": 150,
    "percentChange": "4.69%"
  },
  "trends": [
    {
      "date": "2026-03-15",
      "price": 3000
    },
    {
      "date": "2026-03-16",
      "price": 3050
    }
  ]
}
```

---

### 3. Available States
**GET** `/api/available-states`

Get list of all available states in the database.

**Example Request:**
```bash
GET /api/available-states
```

**Response Format:**
```json
{
  "success": true,
  "states": ["Andhra Pradesh", "Assam", "Gujarat", "Maharashtra", "Punjab"],
  "count": 28
}
```

---

### 4. Available Commodities
**GET** `/api/available-commodities`

Get list of commodities available in a state.

**Query Parameters:**
- `state` (string, optional) - State name (default: all states)

**Example Requests:**
```bash
GET /api/available-commodities
GET /api/available-commodities?state=Maharashtra
```

**Response Format:**
```json
{
  "success": true,
  "commodities": ["Onion", "Rice", "Tomato", "Wheat"],
  "count": 42,
  "state": "Maharashtra"
}
```

---

### 5. Market Data
**GET** `/api/market-data`

Get detailed raw market data with all records.

**Query Parameters:**
- `state` (string, default: `Maharashtra`)
- `commodity` (string, optional)
- `market` (string, optional)
- `limit` (number, default: `20`)

**Example Request:**
```bash
GET /api/market-data?state=Maharashtra&limit=20
GET /api/market-data?state=Punjab&commodity=Wheat
```

---

### 6. Health Check
**GET** `/api/health`

Check if the API is running.

**Response Format:**
```json
{
  "success": true,
  "message": "Mandi API is running",
  "timestamp": "2026-03-23T10:30:00.000Z"
}
```

---

## Backend Logic & Implementation

### Data Processing Flow

```
1. API Request
   ↓
2. Fetch Data from Agmarknet (with caching)
   ↓
3. Clean & Normalize Records
   ↓
4. Process Based on Endpoint Type:
   - Group by commodity
   - Calculate prices & changes
   - Identify top gainers/losers
   - Build trends
   ↓
5. Format Response → Send to Frontend
```

### Helper Functions in `utils/helpers.js`

- `getLastNDays(days)` - Get date range
- `groupByCommodity(data)` - Group records by commodity
- `calculatePercentageChange(old, new)` - Price change %
- `getAveragePrice(records)` - Average price
- `getTopGainersLosers(today, yesterday)` - Gainers/losers
- `cleanRecord(record)` - Normalize API data
- `getPriceTrendForCommodity(data, commodity, days)` - Trend extraction
- `getCacheIfValid(cache, key)` / `setCacheWithTTL()` - Caching

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error Category",
  "message": "Detailed error message"
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Bad Request | Check required parameters |
| 500 | Server Error | Check API key and logs |
| 503 | Service Unavailable | Agmarknet API down |
| 504 | Timeout | Increase timeout or check connection |

---

## Performance Optimization

- **Caching**: 5-minute TTL (configurable)
- **Max Records**: 200 per request
- **Request Timeout**: 10 seconds
- **CORS Cache**: 24 hours

---

## Frontend Integration

### Example React
```javascript
const [dashboard, setDashboard] = useState(null);

useEffect(() => {
  fetch('http://localhost:5000/api/dashboard?state=Maharashtra')
    .then(res => res.json())
    .then(data => setDashboard(data));
}, []);
```

### Example Vanilla JavaScript
```javascript
fetch('http://localhost:5000/api/dashboard')
  .then(res => res.json())
  .then(data => {
    console.log('Prices:', data.todayPrices);
    console.log('Gainers:', data.topGainers);
    console.log('Losers:', data.topLosers);
  });
```

---

## File Structure

```
backend/
├── src/
│   ├── server.js                 # Main server
│   ├── controllers/
│   │   └── mandiController.js    # API logic
│   ├── routes/
│   │   └── mandiRoutes.js        # Routes
│   └── utils/
│       └── helpers.js            # Helpers
├── .env.example                  # Config template
├── package.json                  # Dependencies
└── README-MANDI-API.md          # This file
```

---

## Testing

```bash
# Test dashboard
curl "http://localhost:5000/api/dashboard"

# Test trends
curl "http://localhost:5000/api/trends?commodity=Onion"

# Test states
curl "http://localhost:5000/api/available-states"

# Test health
curl "http://localhost:5000/api/health"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API Key Error | Verify in `.env` and data.gov.in account |
| CORS Error | Update `CORS_ORIGIN` in `.env` |
| Timeout | Increase `REQUEST_TIMEOUT` in `.env` |
| No Data | Verify state/commodity names exist |

---

## Production Deployment

1. Set `NODE_ENV=production`
2. Update `CORS_ORIGIN` with your domain
3. Use PM2: `pm2 start src/server.js`
4. Setup Redis for distributed caching
5. Add health checks and monitoring

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: March 23, 2026
