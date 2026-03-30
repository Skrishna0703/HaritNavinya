# 🚀 Soil Fertility Map API - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies

```bash
cd backend
npm install mongoose axios cors morgan node-cron
```

### 2. Configure Environment

Edit `backend/.env`:

```env
# MongoDB (local or cloud)
MONGODB_URI=mongodb://localhost:27017/haritnavinya-soil

# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/haritnavinya-soil

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 3. Ensure MongoDB is Running

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Add to Your Server

In `src/disaster-server.js`, add these imports at the top:

```javascript
import { connectMongoDB } from './soil-api/config/database.js';
import soilRoutes from './soil-api/routes/soilRoutes.js';
```

After creating the Express app, add:

```javascript
// Connect MongoDB
await connectMongoDB();

// Mount soil API routes
app.use('/api/soil', soilRoutes);
```

### 5. Start Your Server

```bash
node src/disaster-server.js
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:5000
📍 Base API: http://localhost:5000/api/soil
```

### 6. Test It!

```bash
# Get soil data
curl http://localhost:5000/api/soil/map?state=Maharashtra

# Get insights
curl http://localhost:5000/api/soil/insights?state=Maharashtra

# Get health check
curl http://localhost:5000/api/soil/health
```

---

## 📚 API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/soil/map` | GET | Fetch soil data |
| `/api/soil/insights` | GET | Get recommendations |
| `/api/soil/fetch-and-store` | POST | Fetch from API & save |
| `/api/soil/by-state/:state` | GET | Get all state data |
| `/api/soil/statistics/:state` | GET | Get statistics |
| `/api/soil/health-status/:state` | GET | Health check |
| `/api/soil/compare` | GET | Compare states |

---

## 🎯 Common Tasks

### Fetch Data for Maharashtra

```javascript
const response = await fetch('http://localhost:5000/api/soil/map?state=Maharashtra');
const data = await response.json();
console.log(data.data);
```

### Get Recommendations

```javascript
const response = await fetch('http://localhost:5000/api/soil/insights?state=Maharashtra');
const { recommendations } = (await response.json()).data;
recommendations.forEach(rec => console.log(rec.suggestion));
```

### Bulk Fetch Multiple States

```javascript
const response = await fetch('http://localhost:5000/api/soil/bulk-fetch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ states: ['Maharashtra', 'Gujarat', 'Punjab'] })
});
```

---

## 🔍 Response Format

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
    "recommendations": [
      {
        "nutrient": "Nitrogen",
        "suggestion": "Nitrogen adequate for most crops"
      },
      {
        "nutrient": "Phosphorus",
        "suggestion": "Add DAP (50-75 kg/hectare)"
      }
    ]
  }
}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Ensure `mongod` is running |
| Port already in use | Change PORT in .env or kill process on port |
| Routes not found | Verify import and mounting in server file |
| CORS errors | Check CORS_ORIGIN matches frontend URL |
| Timeout errors | Increase timeout or check internet connection |

---

## 📊 Features Summary

✅ **Real-time Data** - Fetches from Soil Health Card portal
✅ **Local Storage** - MongoDB for fast queries
✅ **Automatic Analysis** - Fertility score & recommendations
✅ **State Coverage** - All 36 Indian states
✅ **Caching** - Smart 24-hour caching
✅ **Error Handling** - Fallback data on API failure
✅ **Validation** - Input validation & sanitization
✅ **Rate Limiting** - Fair usage protection
✅ **Production Ready** - Error handling, logging, monitoring

---

## 🎓 Learning Path

1. **Beginner**: Get started with docs
2. **Intermediate**: Integrate into your backend
3. **Advanced**: Setup MongoDB Atlas & production deployment
4. **Expert**: Customize scheduler & add features

---

## 🔗 Useful Links

- 📖 [Full Documentation](./README.md)
- 🔗 [Integration Guide](./INTEGRATION_GUIDE.md)
- 🌾 [Soil Health Card Portal](https://www.soilhealth.dac.gov.in)
- 🔐 [MongoDB Documentation](https://docs.mongodb.com)
- ⚡ [Express.js Guide](https://expressjs.com)

---

## ✨ What's Next?

- [ ] Integrate with frontend
- [ ] Connect to [SoilDataInsights.tsx](#)
- [ ] Setup scheduled data refresh
- [ ] Deploy to production
- [ ] Configure backups
- [ ] Setup monitoring

---

**Built with ❤️ for HaritNavinya**

*Empowering farmers with data-driven soil science*

🌱 **Happy Farming!** 🌾
