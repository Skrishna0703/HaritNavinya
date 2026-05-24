#!/usr/bin/env node

/**
 * HaritNavinya Disaster Alerts - Testing & Debugging Utility
 * 
 * Usage:
 * node test-disaster-alerts.js [state] [command]
 * 
 * Examples:
 * node test-disaster-alerts.js maharashtra health
 * node test-disaster-alerts.js maharashtra fetch
 * node test-disaster-alerts.js goa states
 */

import Parser from 'rss-parser';
import fetch from 'node-fetch';

const parser = new Parser();

// Supported states configuration
const SUPPORTED_STATES = {
  maharashtra: 'maharashtra',
  goa: 'goa',
  karnataka: 'karnataka',
  gujarat: 'gujarat'
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + colors.bright + colors.cyan);
  console.log('═'.repeat(60));
  console.log(`  ${title}`);
  console.log('═'.repeat(60) + colors.reset + '\n');
}

// Test 1: Check if backend server is running
async function testServerHealth() {
  logSection('TEST 1: Backend Server Health');
  
  try {
    log('Checking http://localhost:5000/api/disaster/health...', 'blue');
    const response = await fetch('http://localhost:5000/api/disaster/health');
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Server is running!', 'green');
      console.log(JSON.stringify(data, null, 2));
      return true;
    } else {
      log(`❌ Server returned status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot connect to server: ${error.message}`, 'red');
    log('   Start the server with: npm run dev', 'yellow');
    return false;
  }
}

// Test 2: Check supported states
async function testSupportedStates() {
  logSection('TEST 2: Supported States');
  
  try {
    log('Fetching http://localhost:5000/api/disaster/supported-states...', 'blue');
    const response = await fetch('http://localhost:5000/api/disaster/supported-states');
    
    if (response.ok) {
      const data = await response.json();
      log('✅ States retrieved successfully!', 'green');
      console.log(JSON.stringify(data, null, 2));
      return true;
    } else {
      log(`❌ Failed with status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Direct RSS feed parsing (bypasses backend)
async function testRSSFeedDirect(state = 'maharashtra') {
  logSection(`TEST 3: Direct RSS Feed Parsing (${state})`);
  
  if (!SUPPORTED_STATES[state]) {
    log(`❌ Invalid state: ${state}`, 'red');
    return false;
  }

  const feedUrl = `https://sachet.ndma.gov.in/cap_public_website/rss/${state}/en/`;
  
  try {
    log(`Parsing RSS feed: ${feedUrl}`, 'blue');
    const feed = await parser.parseURL(feedUrl);
    
    log(`✅ Feed parsed successfully!`, 'green');
    log(`Title: ${feed.title || 'N/A'}`, 'cyan');
    log(`Description: ${feed.description || 'N/A'}`, 'cyan');
    log(`Items found: ${feed.items.length}`, 'cyan');
    
    if (feed.items.length > 0) {
      log('\nFirst 3 alerts:', 'yellow');
      feed.items.slice(0, 3).forEach((item, idx) => {
        console.log(`\n  Alert ${idx + 1}:`);
        console.log(`  Title: ${item.title}`);
        console.log(`  Date: ${item.pubDate}`);
        console.log(`  Link: ${item.link}`);
      });
    } else {
      log('⚠️  No alerts found in feed (this is normal if there are no active alerts)', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Failed to parse feed: ${error.message}`, 'red');
    
    if (error.message.includes('404')) {
      log('   Feed URL may be incorrect or NDMA server returned 404', 'yellow');
    }
    
    return false;
  }
}

// Test 4: Backend API endpoint
async function testBackendAPI(state = 'maharashtra') {
  logSection(`TEST 4: Backend API Endpoint (${state})`);
  
  if (!SUPPORTED_STATES[state]) {
    log(`❌ Invalid state: ${state}`, 'red');
    return false;
  }

  try {
    const url = `http://localhost:5000/api/disaster/alerts?state=${state}`;
    log(`Calling ${url}...`, 'blue');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      log('✅ API call successful!', 'green');
      log(`State: ${data.state}`, 'cyan');
      log(`Alert count: ${data.alertCount}`, 'cyan');
      log(`Feed URL: ${data.feedUrl}`, 'cyan');
      
      if (data.alerts && data.alerts.length > 0) {
        log('\nFirst alert:', 'yellow');
        const alert = data.alerts[0];
        console.log(`  Title: ${alert.title}`);
        console.log(`  Description: ${alert.description}`);
        console.log(`  Date: ${alert.date}`);
        console.log(`  Link: ${alert.link}`);
      } else {
        log('⚠️  No active alerts', 'yellow');
      }
      
      return true;
    } else {
      log(`❌ API returned error: ${data.error}`, 'red');
      log(`   Message: ${data.message}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Failed to call API: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: All states
async function testAllStates() {
  logSection('TEST 5: Testing All Supported States');
  
  const results = {};
  
  for (const [state, _] of Object.entries(SUPPORTED_STATES)) {
    try {
      log(`Testing ${state}...`, 'blue');
      const url = `http://localhost:5000/api/disaster/alerts?state=${state}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        log(`  ✅ ${state}: ${data.alertCount} alerts`, 'green');
        results[state] = { success: true, count: data.alertCount };
      } else {
        log(`  ❌ ${state}: ${data.error}`, 'red');
        results[state] = { success: false, error: data.error };
      }
    } catch (error) {
      log(`  ❌ ${state}: ${error.message}`, 'red');
      results[state] = { success: false, error: error.message };
    }
  }
  
  log('\nSummary:', 'cyan');
  console.log(JSON.stringify(results, null, 2));
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const state = args[0] || 'maharashtra';
  const command = args[1] || 'test';

  logSection('HaritNavinya Disaster Alerts - Test Utility');
  log(`State: ${state}`, 'cyan');
  log(`Command: ${command}`, 'cyan');

  try {
    switch (command) {
      case 'health':
        await testServerHealth();
        break;
      
      case 'states':
        await testSupportedStates();
        break;
      
      case 'direct':
        await testRSSFeedDirect(state);
        break;
      
      case 'api':
        await testBackendAPI(state);
        break;
      
      case 'all':
        await testAllStates();
        break;
      
      case 'test':
      default:
        // Run all tests
        const serverOk = await testServerHealth();
        if (serverOk) {
          await testSupportedStates();
          await testRSSFeedDirect(state);
          await testBackendAPI(state);
        }
        break;
    }
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }

  logSection('Tests Complete');
  log('For detailed integration guide, see: DISASTER_ALERTS_INTEGRATION.md', 'cyan');
}

main();
