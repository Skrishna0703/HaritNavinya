# Frontend Deployment Guide

## Status
✅ Frontend updated to use backend at: `https://haritnavinya.onrender.com`
✅ Environment variables configured in `.env`
✅ Build complete in `build/` folder

## Backend API URLs Configured
- **Weather API**: `https://haritnavinya.onrender.com/api/weather`
- **Dashboard/Mandi API**: `https://haritnavinya.onrender.com/api/dashboard`
- **Disaster Alerts**: `https://haritnavinya.onrender.com/api/disaster/alerts`
- **Chatbot API**: `https://haritnavinya.onrender.com/api/chatbot/chat`

## Deployment Options

### Option 1: Deploy to Render (Recommended)
Render offers free static hosting and is already used for the backend.

**Steps:**
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Static Site"
4. Connect your GitHub repository (HaritNavinya)
5. Configure the build:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/build`
6. Set Environment Variables if using .env:
   - Add any variables you need (optional for frontend)
7. Deploy!

### Option 2: Deploy to Vercel
**Steps:**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your repository
4. Select root directory: `frontend`
5. Configure:
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add environment variables:
   - `VITE_API_BASE_URL=https://haritnavinya.onrender.com`
7. Deploy!

### Option 3: Deploy to Netlify
**Steps:**
1. Go to https://netlify.com
2. Sign in with GitHub
3. Deploy new site → GitHub
4. Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Set environment variables:
   - `VITE_API_BASE_URL=https://haritnavinya.onrender.com`
7. Deploy!

### Option 4: Manual Deployment (Using Render CLI)
```bash
# Install Render CLI
npm install -g @render/render-cli

# Build (already done)
npm run build

# Deploy the build folder
render deploy --path ./build
```

## Environment Variables

The frontend is configured with `.env` file that defaults to your backend:

```env
VITE_API_BASE_URL=https://haritnavinya.onrender.com
```

If you need to use a different backend URL, update this before building.

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure the backend has CORS enabled for your frontend URL.

Update backend CORS settings:
```javascript
// In backend app.js
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

### API Not Responding
1. Verify backend is running: https://haritnavinya.onrender.com
2. Check network tab in browser DevTools
3. Verify `VITE_API_BASE_URL` in `.env`
4. Check backend logs for errors

### Build Issues
```bash
# Clear cache and rebuild
rm -rf build node_modules package-lock.json
npm install
npm run build
```

## Files Modified

- ✅ `App.tsx` - Updated weather and dashboard API calls
- ✅ `components/SoilDataInsights.tsx` - Updated soil API base URL
- ✅ `components/MarketPriceForecast.tsx` - Updated all market API calls
- ✅ `components/DisasterAlerts.tsx` - Updated disaster API calls
- ✅ `components/DisasterAlertsClean.tsx` - Updated disaster API calls
- ✅ `components/AIChatbot.tsx` - Updated chatbot API call
- ✅ `.env` - Added with backend URL configuration
- ✅ `.env.example` - Documentation for environment variables

## Next Steps

1. Choose a deployment platform from the options above
2. Follow the deployment steps
3. Test all features with the live backend URL
4. Monitor backend logs for any connectivity issues
