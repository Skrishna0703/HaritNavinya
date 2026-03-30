/**
 * Validation and Error Handling Middleware
 * Production-ready middleware for soil API
 */

/**
 * Validate request parameters
 */
export const validateSoilQuery = (req, res, next) => {
  const { state, district } = req.query;

  const errors = [];

  if (!state) {
    errors.push('State parameter is required');
  }

  if (state && typeof state !== 'string') {
    errors.push('State must be a string');
  }

  if (district && typeof district !== 'string') {
    errors.push('District must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate request body for fetch-and-store
 */
export const validateFetchAndStoreRequest = (req, res, next) => {
  const { state, district } = req.body;

  const errors = [];

  if (!state) {
    errors.push('State is required in request body');
  }

  if (state && typeof state !== 'string') {
    errors.push('State must be a string');
  }

  if (state && state.trim().length === 0) {
    errors.push('State cannot be empty');
  }

  if (district && typeof district !== 'string') {
    errors.push('District must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate bulk fetch request
 */
export const validateBulkFetchRequest = (req, res, next) => {
  const { states } = req.body;

  const errors = [];

  if (!states) {
    errors.push('States array is required');
  }

  if (!Array.isArray(states)) {
    errors.push('States must be an array');
  }

  if (Array.isArray(states) && states.length === 0) {
    errors.push('States array cannot be empty');
  }

  if (Array.isArray(states)) {
    states.forEach((state, index) => {
      if (typeof state !== 'string') {
        errors.push(`State at index ${index} must be a string`);
      }
      if (state.trim().length === 0) {
        errors.push(`State at index ${index} cannot be empty`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate soil update request
 */
export const validateUpdateRequest = (req, res, next) => {
  const { state, district } = req.params;
  const updateData = req.body;

  const errors = [];

  if (!state || typeof state !== 'string') {
    errors.push('Valid state parameter required');
  }

  if (!district || typeof district !== 'string') {
    errors.push('Valid district parameter required');
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    errors.push('Update data is required');
  }

  // Validate nutrient values if provided
  if (updateData.nutrients) {
    if (updateData.nutrients.nitrogen?.value !== undefined) {
      const nValue = updateData.nutrients.nitrogen.value;
      if (typeof nValue !== 'number' || nValue < 0 || nValue > 1000) {
        errors.push('Nitrogen value must be between 0 and 1000');
      }
    }

    if (updateData.nutrients.pH?.value !== undefined) {
      const phValue = updateData.nutrients.pH.value;
      if (typeof phValue !== 'number' || phValue < 0 || phValue > 14) {
        errors.push('pH value must be between 0 and 14');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate comparison request
 */
export const validateComparisonQuery = (req, res, next) => {
  const { states } = req.query;

  const errors = [];

  if (!states || typeof states !== 'string') {
    errors.push('States query parameter required (comma-separated)');
  }

  if (states && states.split(',').length < 2) {
    errors.push('Provide at least 2 states for comparison');
  }

  if (states && states.split(',').length > 10) {
    errors.push('Maximum 10 states allowed for comparison');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: messages
    });
  }

  // MongoDB cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // API timeout
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
    return res.status(504).json({
      success: false,
      error: 'Request timeout',
      message: 'External API took too long to respond'
    });
  }

  // Network error
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Network error',
      message: 'Cannot reach external data source'
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Rate limiting check (simple in-memory implementation)
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 100;

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    });
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  next();
};

/**
 * CORS headers middleware
 */
export const setCORSHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📊 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

export default {
  validateSoilQuery,
  validateFetchAndStoreRequest,
  validateBulkFetchRequest,
  validateUpdateRequest,
  validateComparisonQuery,
  errorHandler,
  asyncHandler,
  rateLimiter,
  setCORSHeaders,
  requestLogger
};
