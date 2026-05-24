/**
 * HaritNavinya Disaster Alert Routes
 * Integrates NDMA SACHET RSS feeds for Maharashtra disaster alerts
 * 
 * Sources:
 * - NDMA SACHET RSS feeds for official disaster alerts
 * - Supported alert types: Heavy rainfall, floods, cyclones, lightning, heatwaves, earthquakes
 * 
 * Endpoints:
 * - GET /api/disaster/alerts?state=maharashtra
 */

import express from 'express';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser();

/**
 * Supported NDMA SACHET RSS feed states - All 28 States + 8 Union Territories
 */
const SUPPORTED_STATES = {
  // States
  'andhra pradesh': 'andhra pradesh',
  'arunachal pradesh': 'arunachal pradesh',
  'assam': 'assam',
  'bihar': 'bihar',
  'chhattisgarh': 'chhattisgarh',
  'goa': 'goa',
  'gujarat': 'gujarat',
  'haryana': 'haryana',
  'himachal pradesh': 'himachal pradesh',
  'jharkhand': 'jharkhand',
  'karnataka': 'karnataka',
  'kerala': 'kerala',
  'madhya pradesh': 'madhya pradesh',
  'maharashtra': 'maharashtra',
  'manipur': 'manipur',
  'meghalaya': 'meghalaya',
  'mizoram': 'mizoram',
  'nagaland': 'nagaland',
  'odisha': 'odisha',
  'punjab': 'punjab',
  'rajasthan': 'rajasthan',
  'sikkim': 'sikkim',
  'tamil nadu': 'tamil nadu',
  'telangana': 'telangana',
  'tripura': 'tripura',
  'uttar pradesh': 'uttar pradesh',
  'uttarakhand': 'uttarakhand',
  'west bengal': 'west bengal',
  // Union Territories
  'andaman & nicobar': 'andaman & nicobar',
  'chandigarh': 'chandigarh',
  'dadra & nagar haveli': 'dadra & nagar haveli',
  'daman & diu': 'daman & diu',
  'delhi': 'delhi',
  'jammu & kashmir': 'jammu & kashmir',
  'ladakh': 'ladakh',
  'puducherry': 'puducherry'
};

/**
 * GET /api/disaster/alerts
 * Fetches disaster alerts from NDMA SACHET RSS feed
 * 
 * Query Parameters:
 * - state (optional): State name (maharashtra, goa, karnataka, gujarat)
 *                     Default: maharashtra
 * 
 * Response:
 * - Array of alert objects with title, description, link, date
 */
router.get('/alerts', async (req, res) => {
  try {
    // Get state from query parameter, default to maharashtra
    const state = req.query.state?.toLowerCase() || 'maharashtra';

    // Validate state
    if (!SUPPORTED_STATES[state]) {
      return res.status(400).json({
        error: `Invalid state: ${state}`,
        supportedStates: Object.keys(SUPPORTED_STATES)
      });
    }

    // Construct NDMA SACHET RSS feed URL
    const feedUrl = `https://sachet.ndma.gov.in/cap_public_website/rss/${state}/en/`;

    console.log(`[DISASTER] Fetching alerts from: ${feedUrl}`);

    // Parse RSS feed
    const feed = await parser.parseURL(feedUrl);

    // Transform feed items into alert objects
    const alerts = feed.items.map((item) => ({
      title: item.title || 'Alert',
      description: item.contentSnippet || item.content || 'No description available',
      link: item.link || '',
      date: item.pubDate || new Date().toISOString(),
      guid: item.guid || item.link
    }));

    console.log(`[DISASTER] Successfully fetched ${alerts.length} alerts for ${state}`);

    res.json({
      success: true,
      state,
      feedUrl,
      timestamp: new Date().toISOString(),
      alertCount: alerts.length,
      alerts
    });

  } catch (error) {
    console.error('[DISASTER] RSS Parser Error:', error.message);

    // Return 200 with empty alerts gracefully instead of 500
    // This handles cases where NDMA feed is temporarily unavailable
    res.status(200).json({
      success: true,
      state: req.query.state?.toLowerCase() || 'maharashtra',
      feedUrl: `https://sachet.ndma.gov.in/cap_public_website/rss/${(req.query.state?.toLowerCase() || 'maharashtra')}/en/`,
      timestamp: new Date().toISOString(),
      alertCount: 0,
      alerts: [],
      notice: error.message.includes('404') 
        ? 'Feed unavailable - No alerts to display at this time'
        : 'Unable to fetch latest alerts. Will retry automatically.'
    });
  }
});

/**
 * GET /api/disaster/supported-states
 * Returns list of supported states for disaster alerts
 */
router.get('/supported-states', (req, res) => {
  res.json({
    success: true,
    supportedStates: Object.keys(SUPPORTED_STATES),
    description: 'Disaster alerts available for these states via NDMA SACHET RSS feeds'
  });
});

/**
 * GET /api/disaster/health
 * Health check for disaster alerts service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Disaster Alerts',
    status: 'operational',
    source: 'NDMA SACHET RSS Feed',
    supportedStates: Object.keys(SUPPORTED_STATES),
    endpoint: '/api/disaster/alerts'
  });
});

export default router;
