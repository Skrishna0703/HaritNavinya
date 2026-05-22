# Production Configuration Guide

## Backend Production Setup

### Required Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.7.0",
    "mongoose": "^7.6.0",
    "morgan": "^1.10.1",
    "socket.io": "^4.8.1",
    "@google/generative-ai": "^0.3.1",
    "csv-parser": "^3.2.0"
  }
}
```

### Recommended Additional Packages for Production

```bash
# Security
npm install helmet express-validator express-rate-limit

# Logging
npm install winston

# Monitoring
npm install sentry

# Performance
npm install compression
```

## Environment Variables by Environment

### Development (.env)
```
NODE_ENV=development
PORT=5000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/haritnavinya
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
LOG_LEVEL=debug
```

### Production (.env in Render)
```
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
MONGODB_URI=<Render database connection string>
CORS_ORIGIN=https://haritnavinya-frontend.onrender.com
LOG_LEVEL=info
GEMINI_API_KEY=<your key>
OPENWEATHER_API_KEY=<your key>
AGMARKNET_API_KEY=<your key>
```

## Database Configuration

### MongoDB Connection Pool Settings
```javascript
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(MONGODB_URI, mongooseOptions);
```

### Connection Monitoring
```javascript
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});
```

## API Configuration

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Request Validation
```javascript
import { body, validationResult } from 'express-validator';

const validateRequest = [
  body('state').trim().isLength({ min: 2 }),
  body('commodity').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

## Error Handling

### Centralized Error Handler
```javascript
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  // Log error
  logger.error({
    status,
    message,
    path: req.path,
    timestamp: new Date()
  });
  
  // Send sanitized response
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

## Logging Configuration

### Winston Logger Setup
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Performance Optimization

### Enable Compression
```javascript
import compression from 'compression';

app.use(compression());
```

### Enable Caching
```javascript
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  } else {
    res.set('Cache-Control', 'no-cache');
  }
  next();
});
```

### Response Time Monitoring
```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms - ${res.statusCode}`);
  });
  next();
});
```

## Security Headers

### Helmet Configuration
```javascript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
  }
}));
```

## Graceful Shutdown

```javascript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB:', err);
    }
    
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});
```

## Frontend Production Setup

### Build Configuration (vite.config.ts)
```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Set to true for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          leaflet: ['leaflet', 'react-leaflet']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### Environment Variables (.env.production)
```
VITE_API_BASE_URL=https://haritnavinya-backend.onrender.com
VITE_SOCKET_URL=https://haritnavinya-backend.onrender.com
NODE_ENV=production
```

### Static File Caching
```javascript
// In server (for static files)
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

## Monitoring & Observability

### Health Check Endpoint
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});
```

### Metrics Collection
```javascript
let requestCount = 0;
let errorCount = 0;

app.get('/api/metrics', (req, res) => {
  res.json({
    requests: requestCount,
    errors: errorCount,
    errorRate: (errorCount / requestCount * 100).toFixed(2) + '%',
    uptime: process.uptime()
  });
});
```

## Database Indexes

Recommended indexes for production:

```javascript
// Soil API indexes
db.soils.createIndex({ state: 1, district: 1 });
db.soils.createIndex({ createdAt: 1 });

// Mandi API indexes
db.mandis.createIndex({ state: 1, commodity: 1 });
db.mandis.createIndex({ date: -1 });

// Disaster API indexes
db.alerts.createIndex({ status: 1, createdAt: -1 });
db.alerts.createIndex({ region: 1 });
```

## Load Testing

Before production, test with:
```bash
# Using artillery
artillery run load-test.yml

# Using Apache Bench
ab -n 1000 -c 10 https://api.example.com/api/health
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

## Checklist Before Going Live

- [ ] All environment variables set
- [ ] Database backups configured
- [ ] Error tracking setup (Sentry)
- [ ] Logging configured
- [ ] Security headers enabled
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Health check endpoint working
- [ ] Monitoring/alerts setup
- [ ] Graceful shutdown configured
- [ ] Documentation updated
- [ ] Load tested
- [ ] Security audit completed
- [ ] Disaster recovery plan in place
