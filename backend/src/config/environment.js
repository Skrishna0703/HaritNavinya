/**
 * Environment Variable Validator
 * Validates all required environment variables on startup
 */

const REQUIRED_VARS = {
  production: [
    'NODE_ENV',
    'PORT',
    'CORS_ORIGIN'
  ],
  development: [
    'NODE_ENV'
  ]
};

const OPTIONAL_VARS = [
  'GEMINI_API_KEY',
  'OPENWEATHER_API_KEY',
  'AGMARKNET_API_KEY',
  'LOG_LEVEL',
  'SESSION_SECRET'
];

/**
 * Validate environment variables
 * @throws {Error} If required variables are missing
 */
export function validateEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const required = REQUIRED_VARS[nodeEnv] || REQUIRED_VARS.development;
  
  const missing = [];
  const warnings = [];
  
  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // Check optional variables
  OPTIONAL_VARS.forEach(varName => {
    if (!process.env[varName] && nodeEnv === 'production') {
      warnings.push(`Optional variable ${varName} is not set`);
    }
  });
  
  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️  Environment Warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  }
  
  // Throw error if required variables missing
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment variables validated');
  
  return {
    nodeEnv,
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN,
    geminiApiKey: process.env.GEMINI_API_KEY ? '***SET***' : 'NOT_SET',
    openweatherApiKey: process.env.OPENWEATHER_API_KEY ? '***SET***' : 'NOT_SET',
    agmarknetApiKey: process.env.AGMARKNET_API_KEY ? '***SET***' : 'NOT_SET'
  };
}

/**
 * Get environment configuration object
 */
export function getEnvConfig() {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    port: parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || 'localhost',
    corsOrigin: (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()),
    geminiApiKey: process.env.GEMINI_API_KEY,
    openweatherApiKey: process.env.OPENWEATHER_API_KEY,
    agmarknetApiKey: process.env.AGMARKNET_API_KEY,
    logLevel: process.env.LOG_LEVEL || 'info',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100')
  };
}
