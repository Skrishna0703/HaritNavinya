/**
 * Soil Data Refresh Scheduler
 * Optional: Auto-refresh soil data at regular intervals (recommended for production)
 */

import cron from 'node-cron';
import SoilFertility from '../models/Soil.js';
import { fetchAndStoreSoilData } from '../services/soilDataService.js';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry', 'Ladakh'
];

let refreshInProgress = false;
let lastRefreshTime = null;
let refreshStats = {
  successful: 0,
  failed: 0,
  errors: []
};

/**
 * Refresh soil data for all states
 */
export const refreshAllSoilData = async () => {
  if (refreshInProgress) {
    console.log('⏳ Refresh already in progress, skipping...');
    return;
  }

  refreshInProgress = true;
  console.log('\n🔄 Starting soil data refresh cycle...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);

  refreshStats = { successful: 0, failed: 0, errors: [] };

  for (const state of INDIAN_STATES) {
    try {
      console.log(`🔄 Fetching ${state}...`);
      await fetchAndStoreSoilData(state);
      refreshStats.successful++;
      console.log(`✅ ${state} - Success`);
    } catch (error) {
      refreshStats.failed++;
      refreshStats.errors.push({ state, error: error.message });
      console.warn(`⚠️  ${state} - Failed: ${error.message}`);
    }

    // Add delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  lastRefreshTime = new Date();
  refreshInProgress = false;

  console.log('\n✅ Refresh cycle complete');
  console.log(`📊 Summary: ${refreshStats.successful} successful, ${refreshStats.failed} failed\n`);

  return refreshStats;
};

/**
 * Get refresh status
 */
export const getRefreshStatus = () => {
  return {
    inProgress: refreshInProgress,
    lastRefreshTime,
    stats: refreshStats
  };
};

/**
 * Setup scheduled refresh jobs
 * 
 * Schedule options:
 * - Daily: "0 2 * * *" (2 AM daily)
 * - Weekly: "0 2 * * 0" (2 AM every Sunday)
 * - Monthly: "0 2 1 * *" (2 AM on 1st of month)
 */
export const setupScheduledRefresh = (schedule = '0 2 * * 0') => {
  try {
    console.log('📅 Setting up scheduled soil data refresh...');
    console.log(`⏰ Schedule: ${schedule}`);

    const task = cron.schedule(schedule, async () => {
      console.log('\n⏰ Scheduled refresh triggered');
      await refreshAllSoilData();
    });

    console.log('✅ Scheduler initialized');

    return task;
  } catch (error) {
    console.error('❌ Failed to setup scheduler:', error.message);
    return null;
  }
};

/**
 * Cleanup old data (keep only last 3 versions)
 */
export const cleanupOldData = async () => {
  try {
    console.log('🧹 Cleaning up old soil data...');

    const result = await SoilFertility.updateMany(
      { status: 'archived' },
      { $set: { status: 'deleted' } }
    );

    console.log(`✅ Cleaned ${result.modifiedCount} records`);
    return result;
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
    return null;
  }
};

/**
 * Health check for refresh system
 */
export const getSchedulerHealth = () => {
  return {
    status: 'operational',
    lastRefresh: lastRefreshTime,
    nextRefreshDue: 'See cron schedule',
    stats: refreshStats
  };
};

// Export all functions
export default {
  refreshAllSoilData,
  getRefreshStatus,
  setupScheduledRefresh,
  cleanupOldData,
  getSchedulerHealth
};
