/**
 * Security Middleware
 * Implements best practices for securing the backend
 */

import cors from 'cors';

/**
 * Configure CORS with proper security settings
 */
export function setupCORS(app, corsOrigin) {
  const allowedOrigins = Array.isArray(corsOrigin) ? corsOrigin : (corsOrigin || '').split(',').map(o => o.trim());
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or server-side requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is allowed
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));
}

/**
 * Add security headers
 */
export function setupSecurityHeaders(app, isDevelopment = false) {
  // Content Security Policy
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=*, camera=(), microphone=()');
    
    if (!isDevelopment) {
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    }
    
    next();
  });
}

/**
 * Request validation middleware
 */
export function validateRequest(req, res, next) {
  // Limit request size
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentLength = req.get('content-length');
    if (contentLength && contentLength > 50 * 1024 * 1024) { // 50MB limit
      return res.status(413).json({
        success: false,
        message: 'Request payload too large'
      });
    }
  }
  
  next();
}

/**
 * Sanitize error responses
 */
export function sanitizeErrorResponse(err, isDevelopment = false) {
  const response = {
    success: false,
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  };
  
  // Include stack trace only in development
  if (isDevelopment && err.stack) {
    response.stack = err.stack.split('\n');
  }
  
  // Don't expose internal error details in production
  if (isDevelopment) {
    response.error = err;
  }
  
  return response;
}

/**
 * Request logging middleware
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function (data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    // Log in JSON format for production
    console.log(JSON.stringify(log));
    
    return originalSend.call(this, data);
  };
  
  next();
}

/**
 * Rate limiting helper (basic implementation)
 * For production, use express-rate-limit package
 */
export function basicRateLimiter(windowMs = 15 * 60 * 1000, maxRequests = 100) {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const window = requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = window.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    next();
  };
}
