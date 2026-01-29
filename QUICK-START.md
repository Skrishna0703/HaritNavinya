# Disaster Monitoring System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Terminal 1 - Start Backend Server
```powershell
cd c:\Users\shrik\Desktop\Project\HaritNavinya\backend
npm run dev
```
**Expected Output:**
```
✅ Disaster Monitoring System initialized
📡 HTTP Server running on http://localhost:4000
🔗 Socket.IO listening for real-time connections
```

### Step 2: Terminal 2 - Start Frontend
```powershell
cd c:\Users\shrik\Desktop\Project\HaritNavinya\frontend
npm run dev
```
**Expected Output:**
```
VITE ready in XXX ms
➜  Local: http://localhost:3001/
```

### Step 3: Open Browser
```
http://localhost:3001
```

Navigate to "Disaster Alerts" section to see:
- 🗺️ Interactive Leaflet map with alert markers
- 📊 Live alert list from backend
- 🟢 Connection status indicator

---

## 🔄 Live Testing Flow

### Terminal 3 - Create Test Alert
```powershell
$body = @{
    type = "flood"
    severity = "High"
    region = "pune"
    latitude = 18.5204
    longitude = 73.8567
    description = "Test: Heavy rainfall alert"
    affectedArea = 150
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/disaster/alerts" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body
```

### Expected Result
✨ **New alert appears on map in real-time!**
- Red marker appears at coordinates
- Alert list updates immediately
- Count increments: "5 Active Alerts"
- No page refresh needed!

---

## 📡 Socket.IO Connection Details

**Frontend connects to:**
```
WebSocket: ws://localhost:4000/socket.io/?...
HTTP Fallback: http://localhost:4000/socket.io/?...
```

**Real-Time Events:**
- `subscribe_region` → Join region-specific room (e.g., `region:pune`)
- `alert:new` → Broadcast to region subscribers
- `alert:update` → Update existing alert
- `alert:delete` → Remove alert

---

## 🗺️ Map Features

| Feature | Details |
|---------|---------|
| **Base Map** | OpenStreetMap tiles |
| **Center** | Maharashtra, India (19.07°N, 72.87°E) |
| **Zoom** | Level 7 (regional view) |
| **Markers** | Color-coded by severity |
| **Popups** | Alert details on marker click |
| **Live Updates** | Markers appear/disappear in real-time |

**Marker Colors:**
- 🔴 Red = High Severity
- 🟡 Yellow = Medium Severity
- 🟢 Green = Low Severity

---

## 🔧 Troubleshooting

### Issue: "Connection Refused" on map
**Solution:** Ensure backend is running on port 4000
```powershell
# Check if port 4000 is in use
netstat -ano | findstr :4000
```

### Issue: Leaflet map shows blank
**Solution:** Wait for tiles to load (can take 2-5 seconds)
- Check browser console for CORS errors
- Verify network tab shows OpenStreetMap requests

### Issue: New alerts don't appear
**Solution:** Check browser console for Socket.IO errors
- Verify WebSocket connection is green in DevTools
- Check Network tab shows Socket.IO handshake

---

## 📊 API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/disaster/health` | GET | Check server status |
| `/api/disaster/alerts` | GET | List all alerts |
| `/api/disaster/alerts` | POST | Create alert (triggers Socket.IO) |
| `/api/disaster/alerts?region=pune` | GET | Filter by region |
| `/api/disaster/regions` | GET | List regions |
| `/api/disaster/users/:id/checklist` | GET | Get preparedness checklist |

---

## 💡 Sample Alert Payloads

### Flood Alert
```json
{
  "type": "flood",
  "severity": "High",
  "region": "pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Heavy rainfall expected. Risk of waterlogging.",
  "affectedArea": 250
}
```

### Drought Alert
```json
{
  "type": "drought",
  "severity": "Medium",
  "region": "marathwada",
  "latitude": 19.8762,
  "longitude": 75.3519,
  "description": "Prolonged dry spell. Irrigation recommended.",
  "affectedArea": 1200
}
```

### Storm Alert
```json
{
  "type": "storm",
  "severity": "High",
  "region": "coastal",
  "latitude": 16.8661,
  "longitude": 73.3342,
  "description": "Cyclonic storm formation. Strong winds expected.",
  "affectedArea": 500
}
```

---

## 🎯 Key Architecture

```
DisasterAlerts.tsx (Frontend)
         ↓
[Socket.IO Client] ← WebSocket → [Socket.IO Server]
         ↓                              ↓
[Leaflet Map]                    [Express Backend]
[Real-time State]                [In-Memory Data]
         ↓                              ↓
      Markers                    API Routes
      Alerts                     Controllers
```

---

## 🧪 Test Scenarios

### Scenario 1: New Alert Notification
1. Create alert via curl
2. Observe: New marker appears on map
3. Observe: Alert list updates
4. Observe: Count increments

### Scenario 2: Alert Update
1. Update existing alert severity: HIGH → CRITICAL
2. Observe: Marker color changes (red → darker red)
3. Observe: Alert details update in list

### Scenario 3: Region Filtering
1. Change selected region: Pune → Nashik
2. Observe: Only Nashik alerts show
3. Observe: Zoom centers on region

### Scenario 4: Offline/Online Switching
1. Pause backend server
2. Observe: Connection status → red "Connecting..."
3. Resume backend
4. Observe: Auto-reconnects, status → green

---

## 📱 Browser DevTools Inspection

### Console
- Check for Socket.IO connection messages
- Look for API fetch errors
- Verify no CORS warnings

### Network
- WebSocket connection under "WS" tab
- Socket.IO frames showing `alert:new` events
- OpenStreetMap tile requests

### Elements
- Search for "leaflet-container" to find map div
- Inspect SVG markers for severity colors

---

## 🔐 Production Checklist

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Implement authentication (JWT)
- [ ] Add rate limiting
- [ ] Enable HTTPS/WSS
- [ ] Add error logging
- [ ] Set up monitoring
- [ ] Configure environment variables
- [ ] Add request validation
- [ ] Implement alert history
- [ ] Add admin dashboard

---

## 📞 Quick Help Commands

```powershell
# Check ports in use
netstat -ano | findstr :4000
netstat -ano | findstr :3001

# Kill process on port (PowerShell Admin)
Stop-Process -Id <PID> -Force

# View backend logs (while running)
# Just watch the terminal output

# Test API endpoint
curl http://localhost:4000/api/disaster/health

# List all alerts
curl http://localhost:4000/api/disaster/alerts

# Get region-specific alerts
curl http://localhost:4000/api/disaster/alerts?region=pune
```

---

**System Status:** ✅ Ready for Testing
**Last Updated:** November 24, 2025
