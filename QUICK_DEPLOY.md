# Quick Production Deployment Reference

## 🚀 Deploy in 5 Minutes

### Step 1: Navigate to Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Select Backend Service
- Click on `haritnavinya-backend`
- Go to **Settings** tab
- Scroll to **Environment** section

### Step 3: Verify Environment Variables
```
✓ NODE_ENV=production
✓ PORT=5000
✓ HOST=0.0.0.0
✓ MONGODB_URI=(auto-filled)
✓ CORS_ORIGIN=https://haritnavinya-frontend.onrender.com
✓ GEMINI_API_KEY=(your key)
✓ OPENWEATHER_API_KEY=(your key)
✓ AGMARKNET_API_KEY=(your key)
✓ LOG_LEVEL=info
✓ DISASTER_PORT=4000
```

### Step 4: Clear Build Cache & Deploy
1. Click **Settings** → **Build Cache**
2. Click **Clear Build Cache**
3. Click **Manual Deploy**
4. Click **Deploy**

### Step 5: Repeat for Frontend
- Select `haritnavinya-frontend`
- Go to **Settings** → **Build Cache**
- Click **Clear Build Cache**
- Click **Deploy**

### Step 6: Verify Deployment
```bash
# Test backend health
curl https://haritnavinya-backend.onrender.com/api/health

# Expected response:
{
  "success": true,
  "message": "HaritNavinya Backend APIs running",
  "version": "1.0.0"
}
```

### Step 7: Monitor Logs
- Go to **Logs** tab
- Watch for any errors
- Verify "Server running on port 5000" message

---

## ⚠️ Common Issues & Fixes

### Issue: Deployment Fails
```
Fix:
1. Check build logs in Render
2. Verify all environment variables are set
3. Clear build cache (Settings → Build Cache)
4. Try deploying again
```

### Issue: Cannot find module errors
```
Fix:
1. This was already fixed (axios v1.7.0)
2. npm ci --legacy-peer-deps ensures correct install
3. Clear cache and redeploy
```

### Issue: CORS errors in frontend
```
Fix:
1. Verify CORS_ORIGIN in backend settings
2. Should be: https://haritnavinya-frontend.onrender.com
3. Restart backend service
```

### Issue: Slow response times
```
Fix:
1. Monitor database connections
2. Check if MongoDB is responding
3. Upgrade Render plan if needed
```

---

## 🔑 Required API Keys

Get from these services and set in Render:

1. **GEMINI_API_KEY**
   - Get from: https://ai.google.dev
   - Click "Get API Key"
   - Create new project
   - Copy key

2. **OPENWEATHER_API_KEY**
   - Get from: https://openweathermap.org/api
   - Sign up free account
   - Go to API Keys section
   - Copy key

3. **AGMARKNET_API_KEY**
   - Get from: https://data.gov.in
   - Search for "Agmarknet"
   - Get API key from resource page

---

## 📊 After Deployment Checklist

- [ ] Backend responds to /api/health
- [ ] Frontend loads without errors
- [ ] Can make API requests from frontend
- [ ] Database connected
- [ ] No errors in logs
- [ ] Response times acceptable (<1 second)
- [ ] All features working (soil, mandi, weather)

---

## 🔄 Production Entry Points

After deployment, access your app at:

```
Frontend: https://haritnavinya-frontend.onrender.com
Backend:  https://haritnavinya-backend.onrender.com

API Health:       https://haritnavinya-backend.onrender.com/api/health
Soil API:         https://haritnavinya-backend.onrender.com/api/soil/health
Mandi API:        https://haritnavinya-backend.onrender.com/api/health
Disaster API:     https://haritnavinya-backend.onrender.com/api/disaster/health
```

---

## 📱 Testing on Production

### Test Soil API:
```bash
curl https://haritnavinya-backend.onrender.com/api/soil/health
```

### Test Mandi API:
```bash
curl https://haritnavinya-backend.onrender.com/api/health
```

### Test Disaster API:
```bash
curl https://haritnavinya-backend.onrender.com/api/disaster/health
```

### View Application Logs:
- Go to Render Dashboard
- Select service
- Click **Logs** tab
- Watch real-time logs

---

## 🛑 Emergency Rollback

If something goes wrong:

1. Go to Render Dashboard
2. Select service
3. Click **Deployments**
4. Select previous working deployment
5. Click **Redeploy**

---

## 📞 Troubleshooting Quick Links

- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Production Config:** [PRODUCTION_CONFIG.md](PRODUCTION_CONFIG.md)
- **Checklist:** [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
- **Render Docs:** https://render.com/docs

---

## ⏱️ Expected Deployment Time

```
Frontend:  2-3 minutes
Backend:   3-5 minutes
Propagation: 5-10 minutes total
```

---

## ✅ Success Indicators

You'll know deployment succeeded when:

1. ✅ No errors in Render logs
2. ✅ API health endpoints return 200
3. ✅ Frontend loads without console errors
4. ✅ Can click around the app
5. ✅ Can fetch data from APIs
6. ✅ Response times are reasonable

---

**You're ready to deploy! 🚀**

Go to: https://dashboard.render.com

Clear cache → Deploy → Monitor logs → Test

Questions? Check the full deployment guide.
