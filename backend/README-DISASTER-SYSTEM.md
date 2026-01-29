# Disaster Monitoring System - Backend Setup & Testing Guide

## System Architecture

The disaster monitoring backend is a modular Express.js + Socket.IO server providing real-time disaster alerts for agricultural regions.

### Folder Structure

```
backend/src/disaster/
├── app.js                 # Express app configuration (CORS, middleware)
├── server.js              # HTTP + Socket.IO server initialization (port 4000)
├── controllers/           # Request handlers with business logic
│   ├── alerts.controller.js
│   ├── regions.controller.js
│   └── users.controller.js
├── routes/               # API endpoint definitions
│   ├── alerts.routes.js
│   ├── regions.routes.js
│   └── users.routes.js
├── data/                 # In-memory data stores (mock database)
│   ├── alerts.js         # Disaster alerts CRUD
│   ├── regions.js        # Geographic regions database
│   ├── users.js          # User profiles & assignments
│   ├── notifications.js  # Notification preferences (SMS/WhatsApp/etc)
│   └── checklist.js      # Preparedness checklist items
└── sockets/              # Real-time event handlers
    └── alert.socket.js   # Socket.IO connection management
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

Key packages:
- `express` - HTTP server framework
- `socket.io` - Real-time bidirectional communication
- `cors` - Cross-Origin Resource Sharing
- `nodemon` - Development auto-reload (devDependency)

### 2. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Expected output:**
```
✅ Disaster Monitoring System initialized
📡 HTTP Server running on http://localhost:4000
🔗 Socket.IO listening for real-time connections
```

## API Endpoints

### Health Check
```bash
GET /api/disaster/health
```
Response: `{ success: true, message: "...", timestamp: "..." }`

### Alerts API

#### Get All Alerts (optionally filtered by region)
```bash
GET /api/disaster/alerts
GET /api/disaster/alerts?region=pune
```

#### Get Alert by ID
```bash
GET /api/disaster/alerts/:id
```

#### Create New Alert (triggers Socket.IO broadcast)
```bash
POST /api/disaster/alerts
Content-Type: application/json

{
  "type": "flood",
  "severity": "High",
  "region": "pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "description": "Heavy flooding reported in downtown area"
}
```

#### Update Alert (triggers Socket.IO update broadcast)
```bash
PUT /api/disaster/alerts/:id
Content-Type: application/json

{
  "severity": "Critical",
  "description": "Updated severity level"
}
```

#### Delete Alert (triggers Socket.IO delete broadcast)
```bash
DELETE /api/disaster/alerts/:id
```

### Regions API

#### Get All Regions
```bash
GET /api/disaster/regions
```

#### Get Region by Name
```bash
GET /api/disaster/regions/pune
```

#### Get Alerts for Specific Region
```bash
GET /api/disaster/regions/pune/alerts
```

### Users API

#### Get User Profile
```bash
GET /api/disaster/users/:id
```

#### Get User Notifications Settings
```bash
GET /api/disaster/users/:id/notifications
```

#### Update Notification Preferences
```bash
PUT /api/disaster/users/:id/notifications
Content-Type: application/json

{
  "sms": true,
  "whatsapp": false,
  "phone": true,
  "push": true
}
```

#### Get Preparedness Checklist
```bash
GET /api/disaster/users/:id/checklist
```

#### Update Checklist Item
```bash
PUT /api/disaster/users/:id/checklist/:itemId
Content-Type: application/json

{
  "completed": true,
  "notes": "Supplies purchased"
}
```

#### Add Checklist Item
```bash
POST /api/disaster/users/:id/checklist
Content-Type: application/json

{
  "task": "Check emergency contact numbers",
  "priority": "High"
}
```

## Socket.IO Events

### Client → Server

#### Subscribe to Region Alerts
```javascript
socket.emit('subscribe_region', { region: 'pune' });
```

#### Unsubscribe from Region
```javascript
socket.emit('unsubscribe_region', { region: 'pune' });
```

#### Subscribe to All Alerts (admin)
```javascript
socket.emit('subscribe_all_alerts');
```

#### Get Region Alerts
```javascript
socket.emit('get_region_alerts', { region: 'pune' }, (response) => {
  console.log(response);
});
```

### Server → Client

#### Alert Events (broadcast to subscribed regions)
- **`alert:new`** - New disaster alert created
  ```json
  { "id": "...", "type": "flood", "region": "pune", ... }
  ```

- **`alert:update`** - Existing alert updated
  ```json
  { "id": "...", "severity": "Critical", ... }
  ```

- **`alert:delete`** - Alert removed
  ```json
  { "id": "..." }
  ```

#### Connection Events
- **`subscribed`** - Confirmation of region subscription
- **`subscribed_all`** - Confirmation of all-alerts subscription
- **`disconnect`** - Client connection closed

## Testing with curl/Postman

### Get All Alerts
```bash
curl http://localhost:4000/api/disaster/alerts
```

### Get Alerts for Pune Region
```bash
curl http://localhost:4000/api/disaster/alerts?region=pune
```

### Get All Regions
```bash
curl http://localhost:4000/api/disaster/regions
```

### Create New Alert
```bash
curl -X POST http://localhost:4000/api/disaster/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "earthquake",
    "severity": "High",
    "region": "marathwada",
    "latitude": 19.8762,
    "longitude": 75.3519,
    "description": "Earthquake tremors detected",
    "affectedArea": 50
  }'
```

### Get User Notifications
```bash
curl http://localhost:4000/api/disaster/users/user1/notifications
```

### Get Checklist
```bash
curl http://localhost:4000/api/disaster/users/user1/checklist
```

## Sample Data (In-Memory)

### Regions (Pre-populated)
- **Pune** (18.5204, 73.8567) - Risk: Medium
- **Nashik** (19.9975, 73.7898) - Risk: Low
- **Marathwada** (19.8762, 75.3519) - Risk: High
- **Coastal** (16.8661, 73.3342) - Risk: High
- **Vidarbha** (21.1458, 78.9855) - Risk: Medium

### Sample Alerts
- Flood in Pune (High severity)
- Drought in Marathwada (Medium severity)
- Storm in Coastal (High severity)
- Hailstorm in Vidarbha (Low severity)

### Sample Users
- user1, user2, user3 (with regional assignments)

## Environment Variables (Optional)

```bash
# .env file
DISASTER_PORT=4000
HOST=localhost
NODE_ENV=development
```

## Troubleshooting

### Server Won't Start
1. Check if port 4000 is already in use: `netstat -ano | findstr :4000`
2. Verify ES Modules are enabled in package.json: `"type": "module"`
3. Check for syntax errors: `node --check src/disaster-server.js`

### Socket.IO Connection Failed
1. Ensure CORS is properly configured for your frontend origin
2. Check firewall settings for port 4000
3. Verify Socket.IO is installed: `npm ls socket.io`

### Routes Not Found
1. Verify routes are mounted in server.js
2. Check endpoint URLs match API documentation
3. Ensure JSON payloads have correct Content-Type header

## Next Steps

1. **Frontend Integration**
   - Connect to Socket.IO using `socket.io-client`
   - Implement Leaflet map for alert visualization
   - Build real-time dashboard in DisasterAlerts.tsx

2. **Database Integration**
   - Replace in-memory data with MongoDB/PostgreSQL
   - Add authentication/authorization
   - Implement data persistence

3. **Advanced Features**
   - Add SMS/WhatsApp integration
   - Implement alert history & analytics
   - Build admin dashboard
   - Add push notifications
