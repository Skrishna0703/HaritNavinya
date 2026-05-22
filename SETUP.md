# HaritNavinya - Complete Setup & Deployment Guide

## Project Overview

HaritNavinya is a full-stack agricultural platform with:
- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Node.js Express with 4 microservices:
  - Mandi/Soil API (Port 5000)
  - Weather API (Port 4001)
  - Chatbot API (Port 5001)
  - Disaster Alert System (Port 4000)
- **Database**: MongoDB (required for soil health data)

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 20+ ([Download](https://nodejs.org/))
- MongoDB running locally ([Install](https://docs.mongodb.com/manual/installation/))
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Skrishna0703/HaritNavinya.git
cd HaritNavinya
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys:
# - OPENWEATHER_API_KEY
# - GEMINI_API_KEY
# - AGMARKNET_API_KEY
npm install --legacy-peer-deps
```

### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env
# For local development, .env defaults to localhost - no changes needed
npm install --legacy-peer-deps
```

### 4. Start Development Servers

**Option A: Run all backends + frontend (Terminal 1)**
```bash
cd backend
npm run dev:all
```

**Option B: Run individual services**
```bash
# Terminal 1 - Mandi/Soil API
cd backend && npm run mandi:dev

# Terminal 2 - Chatbot API
cd backend && npm run chatbot:dev

# Terminal 3 - Weather API
cd backend && npm run weather:dev

# Terminal 4 - Disaster API
cd backend && npm run disaster:dev

# Terminal 5 - Frontend
cd frontend && npm run dev
```

**Frontend should now be running at:** `http://localhost:5173`

---

## 📋 Environment Variables

### Backend (.env)
Create `backend/.env` from `backend/.env.example`:

```env
# REQUIRED: Get from API providers
OPENWEATHER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
AGMARKNET_API_KEY=your_key_here

# Server Configuration
PORT=5000                    # Mandi/Soil API
WEATHER_API_PORT=4001        # Weather API
CHATBOT_PORT=5001            # Chatbot API
DISASTER_PORT=4000           # Disaster alerts
MONGODB_URI=mongodb://localhost:27017/haritnavinya-soil

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)
Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WEATHER_API_PORT=4001
VITE_DASHBOARD_API_PORT=5000
VITE_CHATBOT_API_PORT=5001
VITE_DISASTER_API_PORT=4000
```

---

## 📦 NPM Scripts

### Backend
```bash
npm start                # Run Mandi/Soil API (default)
npm run dev              # Run Mandi/Soil API with nodemon
npm run start:all        # Run all 4 services
npm run dev:all          # Run all 4 services with nodemon

npm run mandi            # Mandi API only
npm run weather          # Weather API only
npm run chatbot          # Chatbot API only
npm run disaster         # Disaster API only

npm run mandi:dev        # With nodemon
npm run weather:dev
npm run chatbot:dev
npm run disaster:dev
```

### Frontend
```bash
npm run dev              # Start Vite dev server (localhost:5173)
npm run build            # Build for production
npm start                # Preview production build
```

---

## 🌐 Deployment - Render.com

### Prerequisites
- GitHub account with HaritNavinya repository
- Render.com account (free tier available)

### Deployment Steps

1. **Connect GitHub to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select `HaritNavinya` repo

2. **Create Backend Service**
   - Service name: `haritnavinya-backend`
   - Branch: `main`
   - Build command: `cd backend && npm ci --legacy-peer-deps`
   - Start command: `cd backend && npm start`
   - Plan: Free
   - Environment variables: (see .env.example)

3. **Create Frontend Service**
   - Type: "Static Site"
   - Service name: `haritnavinya-frontend`
   - Branch: `main`
   - Build command: `cd frontend && npm ci --legacy-peer-deps && npm run build`
   - Publish directory: `frontend/build`
   - Environment variables:
     - `VITE_API_BASE_URL=https://haritnavinya-backend.onrender.com`
     - `NODE_VERSION=20`

4. **Add MongoDB Database**
   - In Render dashboard, click "New +" → "MongoDB"
   - Select free plan
   - Connect to backend via `MONGODB_URI`

5. **Add Environment Variables**
   - Set all required API keys in backend service settings
   - Do NOT commit `.env` files to git!

6. **Deploy**
   - Push changes to `main` branch
   - Render automatically deploys (`autoDeployOnPush: true`)
   - Monitor deployment in dashboard

**URLs after deployment:**
- Frontend: `https://haritnavinya-frontend-xxxxx.onrender.com`
- Backend: `https://haritnavinya-backend-xxxxx.onrender.com`

---

## ⚠️ Important Security Notes

### ❌ Never Commit `.env` Files
```bash
# Already ignored in .gitignore:
.env
.env.local
.env.*.local
```

### ✅ Always Use `.env.example`
1. Create `.env.example` with all required variables (no secrets)
2. Commit `.env.example` to git
3. Create `.env` locally from `.env.example`
4. Add secrets only to local `.env`

### 🔒 API Keys
- Keep all API keys in environment variables only
- Never log or print sensitive data
- Rotate keys if compromised

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB locally or use MongoDB Atlas connection string in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Kill existing process or change PORT in `.env`

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `CORS_ORIGIN` in backend `.env` includes frontend URL

### `npm ci` Fails with Peer Deps
```
npm error code ERESOLVE
```
**Solution:** Use `npm install --legacy-peer-deps` or `npm ci --legacy-peer-deps`

---

## 📚 Additional Resources

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Chatbot Setup](./backend/CHATBOT_QUICK_START.md)
- [Mandi API Guide](./backend/README-MANDI-API.md)
- [Disaster System](./backend/README-DISASTER-SYSTEM.md)

---

## 📞 Support

For issues, check:
1. `.env` file is correctly configured
2. All ports are available
3. MongoDB is running
4. Node.js version is 20+

Good luck! 🌾
