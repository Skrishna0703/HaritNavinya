# HaritNavinya - Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Set all required environment variables in Render Dashboard
- [ ] Verify MongoDB URI is correct
- [ ] Verify all API keys are set (Gemini, OpenWeather, Agmarknet)
- [ ] Set CORS_ORIGIN to production domains only

```
Required Variables:
- NODE_ENV=production
- PORT=5000
- MONGODB_URI=<connection string>
- CORS_ORIGIN=https://haritnavinya-frontend.onrender.com
```

### 2. Render Configuration Verification
In [Render Dashboard](https://dashboard.render.com):

**Backend Service:**
- Root Directory: `backend`
- Build Command: `npm ci --legacy-peer-deps && npm install`
- Start Command: `npm start`
- Environment: Node.js 20
- Restart Policy: Standard

**Frontend Service:**
- Root Directory: `frontend`
- Build Command: `npm ci --legacy-peer-deps && npm run build`
- Publish Directory: `build` or `dist`
- Environment: Node.js 20

### 3. Pre-Deployment Testing (Local)

```bash
# Test backend build
cd backend
npm ci --legacy-peer-deps
npm start

# Test frontend build
cd frontend
npm ci --legacy-peer-deps
npm run build
```

### 4. Database Setup
- [ ] MongoDB database created on Render or MongoDB Atlas
- [ ] Connection string added to environment variables
- [ ] Database user credentials secured
- [ ] Backup strategy in place

## Deployment Steps

### Step 1: Clear Build Cache (IMPORTANT!)

1. Go to Render Dashboard
2. Select backend service
3. Click "Settings" → "Build Cache"
4. Click "Clear Build Cache"
5. Click "Deploy" to redeploy with fresh build

**Same for frontend service**

### Step 2: Verify Deployment

After deployment completes:

1. Check backend health:
   ```
   https://haritnavinya-backend.onrender.com/api/health
   ```

2. Check logs for errors:
   - Render Dashboard → Logs
   - Watch for any error messages
   - Verify all services started

3. Test main endpoints:
   ```
   https://haritnavinya-backend.onrender.com/
   https://haritnavinya-backend.onrender.com/api/soil/health
   https://haritnavinya-backend.onrender.com/api/disaster/health
   ```

### Step 3: Monitor First Hour

After deployment:
- [ ] Monitor application logs for errors
- [ ] Check response times
- [ ] Verify database connectivity
- [ ] Monitor memory/CPU usage
- [ ] Test all critical features

## Post-Deployment

### 1. Verify Features Working

```bash
# Test Soil API
curl https://haritnavinya-backend.onrender.com/api/soil/health

# Test Market API
curl https://haritnavinya-backend.onrender.com/api/health

# Test Disaster API
curl https://haritnavinya-backend.onrender.com/api/disaster/health
```

### 2. Set Up Monitoring

- [ ] Enable Render alerts for deployment failures
- [ ] Set up error tracking (Sentry)
- [ ] Monitor response times
- [ ] Monitor error rates
- [ ] Set up uptime monitoring

### 3. Documentation Updates

- [ ] Update API documentation with production URLs
- [ ] Update user guides
- [ ] Create incident response procedures
- [ ] Document rollback procedures

## Troubleshooting

### Deployment Fails
1. Check build logs in Render
2. Verify environment variables are set
3. Clear build cache and retry
4. Check for syntax errors in code

### Application Not Starting
1. Check application logs
2. Verify MongoDB URI is correct
3. Verify all API keys are set
4. Check port availability

### Slow Response Times
1. Check database query performance
2. Enable caching where possible
3. Monitor API response times
4. Check for memory leaks

### High Error Rates
1. Check application logs for errors
2. Verify API keys are valid
3. Check database connectivity
4. Verify external API availability

## Rollback Procedure

If deployment causes critical issues:

1. Go to Render Dashboard
2. Select the service
3. Click "Deployments"
4. Select previous working deployment
5. Click "Redeploy"

## Performance Optimization

After successful deployment:

1. **Enable Compression:**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Add Caching Headers:**
   ```javascript
   app.use((req, res, next) => {
     if (req.method === 'GET') {
       res.set('Cache-Control', 'public, max-age=300');
     }
     next();
   });
   ```

3. **Optimize Database Queries:**
   - Add indexes on frequently queried fields
   - Implement query result caching
   - Use database query analysis tools

4. **Frontend Optimization:**
   - Enable gzip compression
   - Minimize CSS/JS
   - Lazy load images
   - Enable service worker

## Security Best Practices

1. **Never commit secrets:**
   - Use .env files (not in git)
   - Store secrets in Render environment variables

2. **HTTPS Enforcement:**
   - Render auto-provides HTTPS
   - Enable HTTPS redirect in Render settings

3. **Database Security:**
   - Use strong passwords
   - Enable IP whitelisting if available
   - Regular backups

4. **API Security:**
   - Rate limiting enabled
   - Input validation enabled
   - CORS properly configured
   - Security headers set

## Monitoring and Alerts

### Set Up Alerts For:
- [ ] High error rate (>1% 4xx/5xx)
- [ ] High response time (>2 seconds)
- [ ] Application crash/restart
- [ ] Database connection failures
- [ ] Memory usage spike

### Daily Checks:
- [ ] Application running
- [ ] No critical errors in logs
- [ ] Response times normal
- [ ] All features working

### Weekly Tasks:
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backups
- [ ] Update dependencies (non-breaking)

### Monthly Tasks:
- [ ] Review security logs
- [ ] Check for vulnerabilities
- [ ] Performance optimization review
- [ ] Database maintenance

## Scaling Considerations

When application grows:

1. **Database:**
   - Migrate to MongoDB Atlas (paid tier)
   - Enable connection pooling
   - Optimize indexes
   - Archive old data

2. **Backend:**
   - Upgrade from free to paid Render plan
   - Increase memory/CPU
   - Enable auto-scaling
   - Implement caching layer

3. **Frontend:**
   - Use CDN for static files
   - Enable aggressive caching
   - Optimize images
   - Code splitting

## Disaster Recovery

1. **Regular Backups:**
   - Enable MongoDB backups
   - Export critical data weekly
   - Test restore process monthly

2. **Redundancy:**
   - Use production database backup
   - Keep database backups separate
   - Document recovery steps

3. **Incident Response:**
   - Have incident response plan
   - Document all incidents
   - Post-mortem analysis
   - Continuous improvement

## Support & Resources

- **Render Documentation:** https://render.com/docs
- **Node.js Docs:** https://nodejs.org/docs
- **Express.js Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com
- **GitHub Issues:** Report issues on GitHub

## Contact & Support

For issues or questions:
1. Check application logs
2. Review deployment guide
3. Check GitHub issues
4. Create new issue with logs
