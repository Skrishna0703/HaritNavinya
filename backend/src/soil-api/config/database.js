import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MongoDB Connection Setup
 * Production-ready database connection
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/haritnavinya-soil';

export const connectMongoDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 Database URL:', MONGODB_URI.replace(/\/\/.*@/, '//***@'));

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2
    });

    console.log('✅ MongoDB connected successfully');

    // Connection event handlers
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please ensure MongoDB is running and the connection string is correct.');
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Get database statistics
 */
export const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      databases: stats.databases,
      collections: stats.collections,
      indexes: stats.indexes,
      storageSize: stats.storageSize,
      dataSize: stats.dataSize
    };
  } catch (error) {
    console.error('❌ Error getting DB stats:', error.message);
    return null;
  }
};

/**
 * Create indexes for soil collection
 */
export const createIndexes = async () => {
  try {
    console.log('📑 Creating database indexes...');

    // Import model to trigger index creation
    const SoilFertility = (await import('../models/Soil.js')).default;

    await SoilFertility.collection.createIndex({ state: 1, district: 1 });
    await SoilFertility.collection.createIndex({ lastUpdated: -1 });
    await SoilFertility.collection.createIndex({ 
      'nutrients.nitrogen.category': 1,
      'nutrients.phosphorus.category': 1
    });

    console.log('✅ Indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

export default {
  connectMongoDB,
  disconnectMongoDB,
  getDBStats,
  createIndexes,
  MONGODB_URI
};
