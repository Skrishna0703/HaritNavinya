# NDMA SACHET Disaster Alerts Integration - Implementation Summary

## ✅ What Has Been Implemented

### 1. **Package Installation**
- Installed `rss-parser` (v3.13.0+) to parse NDMA SACHET RSS feeds

### 2. **Backend Route: `/api/disaster/alerts`**
Location: [src/routes/disasterRoutes.js](src/routes/disasterRoutes.js)

**Endpoints Created:**
```
GET /api/disaster/alerts?state=maharashtra
GET /api/disaster/supported-states
GET /api/disaster/health
```

**Features:**
- Dynamic state parameter support (maharashtra, goa, karnataka, gujarat)
- Automatic RSS feed URL construction
- Error handling with detailed responses
- Comprehensive logging

### 3. **Server Integration**
Modified [src/server.js](src/server.js):
- Imported disaster routes
- Mounted routes at `/api/disaster`
- Updated health check endpoint
- Updated root API documentation

## 📋 Supported States & Feeds

| State       | Feed URL                                           |
| ----------- | -------------------------------------------------- |
| Maharashtra | `https://sachet.ndma.gov.in/cap_public_website/rss/maharashtra/en/` |
| Goa         | `https://sachet.ndma.gov.in/cap_public_website/rss/goa/en/`         |
| Karnataka   | `https://sachet.ndma.gov.in/cap_public_website/rss/karnataka/en/`   |
| Gujarat     | `https://sachet.ndma.gov.in/cap_public_website/rss/gujarat/en/`     |

## 🔧 API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/disaster/health
```

Response:
```json
{
  "success": true,
  "service": "Disaster Alerts",
  "status": "operational",
  "source": "NDMA SACHET RSS Feed",
  "supportedStates": ["maharashtra", "goa", "karnataka", "gujarat"],
  "endpoint": "/api/disaster/alerts"
}
```

### Supported States
```bash
GET http://localhost:5000/api/disaster/supported-states
```

Response:
```json
{
  "success": true,
  "supportedStates": ["maharashtra", "goa", "karnataka", "gujarat"],
  "description": "Disaster alerts available for these states via NDMA SACHET RSS feeds"
}
```

### Get Alerts
```bash
GET http://localhost:5000/api/disaster/alerts?state=maharashtra
```

Response:
```json
{
  "success": true,
  "state": "maharashtra",
  "feedUrl": "https://sachet.ndma.gov.in/cap_public_website/rss/maharashtra/en/",
  "timestamp": "2026-05-24T12:00:00.000Z",
  "alertCount": 5,
  "alerts": [
    {
      "title": "Heavy Rainfall Warning",
      "description": "Heavy rainfall expected in Konkan region during next 48 hours",
      "link": "https://sachet.ndma.gov.in/...",
      "date": "2026-05-24T12:30:00Z",
      "guid": "unique-alert-id"
    }
  ]
}
```

## 🚀 Production Deployment

For Render.com deployment, call:
```
https://haritnavinya.onrender.com/api/disaster/alerts?state=maharashtra
```

## 📱 Frontend Integration

See [DISASTER_ALERTS_INTEGRATION.md](DISASTER_ALERTS_INTEGRATION.md) for complete React examples including:
- Basic fetch implementation
- Custom hooks
- Error handling with retry logic
- Component examples
- Auto-refresh functionality

### Quick React Example
```jsx
import { useState, useEffect } from 'react';

function DisasterAlerts({ state = 'maharashtra' }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`/api/disaster/alerts?state=${state}`)
      .then(r => r.json())
      .then(data => setAlerts(data.alerts || []))
      .catch(err => console.error(err));
  }, [state]);

  return (
    <div>
      {alerts.map((alert, i) => (
        <div key={i}>
          <h3>{alert.title}</h3>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🌊 Alert Types Covered

The NDMA SACHET feed includes alerts for:
- ⛈️ Heavy Rainfall
- 🌊 Flood Warnings
- 🌀 Cyclones
- ⚡ Lightning Alerts
- 🔥 Heatwaves
- 🏚️ Earthquakes

## ⚙️ Technical Details

### Dependencies
```json
{
  "rss-parser": "^3.13.0"
}
```

### Route Structure
```
backend/
├── src/
│   ├── routes/
│   │   └── disasterRoutes.js  (NEW)
│   └── server.js  (UPDATED)
```

### Error Handling
- **400**: Invalid state parameter
- **500**: RSS feed parsing error or network issue
- **200**: Success with alerts

### Logging
All requests are logged with timestamp:
```
[DISASTER] Fetching alerts from: https://sachet.ndma.gov.in/...
[DISASTER] Successfully fetched 5 alerts for maharashtra
[DISASTER] RSS Parser Error: Network timeout
```

## 🔗 NDMA Resources

- **SACHET Portal**: https://sachet.ndma.gov.in
- **RSS Feed Info**: https://sachet.ndma.gov.in/CapFeed
- **Android App**: https://play.google.com/store/apps/details?id=com.cdotindia.capsachet

## ✨ Next Steps

1. **Frontend Integration**: Use [DISASTER_ALERTS_INTEGRATION.md](DISASTER_ALERTS_INTEGRATION.md) to add components to React app
2. **Display Alerts**: Show real-time disaster alerts in the dashboard
3. **Notifications**: Add push notifications for critical alerts
4. **Caching**: Implement Redis caching to reduce API calls
5. **Webhooks**: Set up WebSocket for real-time updates

## 📝 Notes

- Feeds update automatically from NDMA SACHET
- No authentication required for RSS feeds
- All alerts in English language
- Timestamps are in ISO 8601 format (UTC)
- Empty feed is returned gracefully (no alerts in `alertCount: 0`)

## 🐛 Troubleshooting

If you get a 404 error when fetching alerts:
1. Check NDMA SACHET website is accessible
2. Verify state parameter spelling (lowercase)
3. Check backend logs for detailed error
4. Test RSS feed directly in browser

If the server won't start:
1. Ensure `rss-parser` is installed: `npm install rss-parser`
2. Check for port conflicts on 5000
3. Verify Node.js version is 14+
