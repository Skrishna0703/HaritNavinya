# Agricultural Market Intelligence API - Quick Start Guide

## 🚀 Get Up & Running in 2 Minutes

### Step 1: Setup Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
NODE_ENV=development
API_KEY=your_agmarknet_api_key_here
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**Get API Key**: https://data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24

### Step 2: Start the Server

```bash
cd backend
npm install
npm run server:dev
```

Server will start on **http://localhost:5000** ✅

### Step 3: Test the API

**Open in browser or use curl:**

```bash
# Dashboard - Today's prices & trends
http://localhost:5000/api/dashboard?state=Maharashtra

# Trends - Specific commodity
http://localhost:5000/api/trends?commodity=Onion&state=Maharashtra&days=7

# Available states
http://localhost:5000/api/available-states

# Health check
http://localhost:5000/api/health
```

---

## 📊 Main Endpoints

### GET /api/dashboard
Returns today's prices, top gainers/losers, and 7-day trends.

**Query Params**: `state`, `market`, `commodity`

```bash
curl "http://localhost:5000/api/dashboard?state=Maharashtra"
curl "http://localhost:5000/api/dashboard?commodity=Wheat"
```

**Response includes**:
- `todayPrices` - Current commodity prices with % change
- `topGainers` - Top 3 commodities with price increase
- `topLosers` - Top 3 commodities with price decrease  
- `priceTrends` - Last 7 days price data for charts

---

### GET /api/trends?commodity=Onion
Get price trends for a specific commodity.

**Query Params**: `commodity` (required), `state`, `days`, `market`

```bash
curl "http://localhost:5000/api/trends?commodity=Onion&days=14"
```

**Response includes**:
- `trends` - Array of date/price points
- `statistics` - Min, max, average, percent change

---

### GET /api/available-states
List all available states.

```bash
curl "http://localhost:5000/api/available-states"
```

---

### GET /api/available-commodities
List commodities for a state.

```bash
curl "http://localhost:5000/api/available-commodities?state=Maharashtra"
```

---

## 🔧 File Structure

```
backend/
├── src/
│   ├── server.js                 # Main Express app
│   ├── controllers/
│   │   └── mandiController.js    # API logic (getDashboard, getTrends, etc)
│   ├── routes/
│   │   └── mandiRoutes.js        # Endpoint routing
│   └── utils/
│       └── helpers.js            # Helper functions (groupByCommodity, etc)
├── .env.example                  # Environment template
├── .env                          # Your config (create this)
└── package.json
```

---

## 📝 Helper Functions Used

**In `utils/helpers.js`:**

- `cleanRecord()` - Normalize API data
- `groupByCommodity()` - Group records by commodity  
- `calculatePercentageChange()` - Compute price % change
- `getAveragePrice()` - Average price from records
- `getTopGainersLosers()` - Find top 3 gainers/losers
- `getPriceTrendForCommodity()` - Extract 7-day trend
- `getCacheIfValid()` / `setCacheWithTTL()` - Caching

---

## ⚙️ Backend Logic (Dashboard Flow)

```
1. GET /api/dashboard?state=Maharashtra
   ↓
2. Fetch 200 records from Agmarknet API (cached for 5 min)
   ↓
3. Clean data (normalize prices, dates, quantities)
   ↓
4. Split by today's date vs yesterday
   ↓
5. Group by commodity
   ↓
6. Calculate:
   - Today's average prices
   - % change from yesterday
   - Top 3 gainers/losers
   - Last 7 days trends
   ↓
7. Return formatted JSON response
```

---

## 📱 Frontend Usage Example

### React Hook
```javascript
import { useState, useEffect } from 'react';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('Maharashtra');

  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard?state=${state}`)
      .then(r => r.json())
      .then(data => setData(data));
  }, [state]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.state} Market Prices</h1>
      
      {/* Price Cards */}
      {data.todayPrices.map(item => (
        <div key={item.commodity}>
          <h3>{item.commodity}</h3>
          <p>₹{item.price} ({item.change})</p>
        </div>
      ))}

      {/* Gainers */}
      <h2>Top Gainers</h2>
      {data.topGainers.map(item => (
        <div key={item.commodity}>{item.commodity}: {item.change}</div>
      ))}

      {/* Chart Data */}
      {data.priceTrends.map(trend => (
        <div key={trend.commodity}>
          <h3>{trend.commodity} Trend</h3>
          {/* Plot trend.data on chart */}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔍 Testing Commands

```bash
# Test in terminal using curl

# Get dashboard
curl "http://localhost:5000/api/dashboard?state=Maharashtra"

# Get trends for Onion
curl "http://localhost:5000/api/trends?commodity=Onion"

# Get all states
curl "http://localhost:5000/api/available-states"

# Get commodities in Punjab
curl "http://localhost:5000/api/available-commodities?state=Punjab"

# Health check
curl "http://localhost:5000/api/health"
```

---

## ✅ Checklist

- [ ] Create `.env` file with API_KEY
- [ ] Run `npm install` in backend
- [ ] Run `npm run server:dev`
- [ ] Server running on port 5000
- [ ] Test `/api/health` endpoint
- [ ] Test `/api/dashboard` with state param
- [ ] Connect frontend to API
- [ ] Display prices on dashboard
- [ ] Show trends on chart
- [ ] Update state filters

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API_KEY not set" | Create `.env` with `API_KEY=your_key` |
| CORS error in browser | Add frontend URL to `CORS_ORIGIN` in `.env` |
| "Cannot reach API" | Check Agmarknet API status, verify API key |
| No data returned | Verify state name exists, check available-states endpoint |
| Timeout errors | Increase `REQUEST_TIMEOUT` in code or check internet |

---

## 📚 Full Documentation

See [README-MANDI-API.md](./README-MANDI-API.md) for complete API documentation.

---

## 🎯 Quick Stats

- **Response Time**: ~500ms (cached), ~2-3s (first request)
- **Cache Duration**: 5 minutes
- **Max Records**: 200 per request
- **Endpoints**: 6 main + health check
- **Data Source**: Agmarknet (data.gov.in)

---

## 📞 Support

- API Issues → Check .env configuration
- Data Issues → Verify state/commodity names
- Integration Issues → Review CORS settings

---

**Ready to build?** Start with `/api/dashboard` endpoint! 🚀
