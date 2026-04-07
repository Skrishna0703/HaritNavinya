#!/usr/bin/env node

/**
 * Quick Test Script for Agriculture Chatbot API
 * 
 * Usage: node test-chatbot.js
 * 
 * This script tests the chatbot API endpoints and verifies:
 * - Server is running
 * - Endpoints are accessible
 * - API key is configured
 * - Responses are valid
 */

// Using native fetch available in Node 18+
// No need for node-fetch import

const API_BASE_URL = 'http://localhost:5001/api/chatbot';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function separator() {
  console.log('\n' + '='.repeat(60) + '\n');
}

async function testHealthEndpoint() {
  try {
    log(COLORS.blue, '🔍 Testing Health Check Endpoint...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(COLORS.green, '✓ Health check passed');
      console.log('  Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      log(COLORS.red, '✗ Health check failed');
      return false;
    }
  } catch (error) {
    log(COLORS.red, `✗ Health endpoint error: ${error.message}`);
    return false;
  }
}

async function testInfoEndpoint() {
  try {
    log(COLORS.blue, '\n📋 Testing Info Endpoint...');
    const response = await fetch(`${API_BASE_URL}/info`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      log(COLORS.green, '✓ Info endpoint passed');
      console.log('  Chatbot Name:', data.chatbot.name);
      console.log('  Model:', data.chatbot.model);
      console.log('  Capabilities:', data.chatbot.capabilities.length);
      return true;
    } else {
      log(COLORS.red, '✗ Info endpoint failed');
      return false;
    }
  } catch (error) {
    log(COLORS.red, `✗ Info endpoint error: ${error.message}`);
    return false;
  }
}

async function testChatEndpoint() {
  try {
    log(COLORS.blue, '\n💬 Testing Chat Endpoint...');
    
    const testMessage = 'What is the best fertilizer for wheat in loamy soil?';
    log(COLORS.cyan, `  Sending message: "${testMessage}"`);
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: testMessage,
        conversationHistory: []
      })
    });

    const data = await response.json();

    if (response.status === 500 && data.error.includes('API key')) {
      log(COLORS.yellow, '⚠ Chat endpoint accessible but GEMINI_API_KEY not configured');
      log(COLORS.yellow, '  Error: ' + data.error);
      log(COLORS.yellow, '  → Set GEMINI_API_KEY in .env file to use chatbot');
      return false;
    }

    if (response.ok && data.success) {
      log(COLORS.green, '✓ Chat endpoint passed');
      console.log('  Response Preview:', data.reply.substring(0, 100) + '...');
      console.log('  Full Response:');
      console.log('  ' + data.reply.replace(/\n/g, '\n  '));
      return true;
    } else {
      log(COLORS.red, `✗ Chat endpoint failed: ${data.error}`);
      return false;
    }
  } catch (error) {
    log(COLORS.red, `✗ Chat endpoint error: ${error.message}`);
    return false;
  }
}

async function testErrorHandling() {
  try {
    log(COLORS.blue, '\n🛡️  Testing Error Handling...');
    
    log(COLORS.cyan, '  Testing with empty message...');
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '',
        conversationHistory: []
      })
    });

    const data = await response.json();

    if (response.status === 400 && !data.success) {
      log(COLORS.green, '✓ Error handling works correctly');
      console.log('  Error Response:', data.error);
      return true;
    } else {
      log(COLORS.red, '✗ Error handling not working as expected');
      return false;
    }
  } catch (error) {
    log(COLORS.red, `✗ Error handling test failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  separator();
  log(COLORS.cyan, '🚀 Agriculture Chatbot API - Test Suite');
  log(COLORS.cyan, '🔗 Testing endpoint: ' + API_BASE_URL);
  separator();

  const results = [];

  // Check if server is running
  try {
    const response = await fetch('http://localhost:5001');
    log(COLORS.green, '✓ Server is running at http://localhost:5001');
  } catch (error) {
    log(COLORS.red, `✗ Server not running. Start it with: npm run chatbot:dev`);
    log(COLORS.red, `  Error: ${error.message}`);
    separator();
    return;
  }

  // Run all tests
  results.push({
    name: 'Health Check',
    passed: await testHealthEndpoint()
  });

  results.push({
    name: 'Info Endpoint',
    passed: await testInfoEndpoint()
  });

  results.push({
    name: 'Error Handling',
    passed: await testErrorHandling()
  });

  results.push({
    name: 'Chat Endpoint',
    passed: await testChatEndpoint()
  });

  // Summary
  separator();
  log(COLORS.cyan, '📊 Test Summary');
  log(COLORS.cyan, '═'.repeat(60));

  let passedCount = 0;
  results.forEach(result => {
    if (result.passed) {
      log(COLORS.green, `  ✓ ${result.name}`);
      passedCount++;
    } else {
      log(COLORS.red, `  ✗ ${result.name}`);
    }
  });

  separator();
  const totalTests = results.length;
  const passPercentage = ((passedCount / totalTests) * 100).toFixed(0);

  if (passedCount === totalTests) {
    log(COLORS.green, `✓ All tests passed! (${passedCount}/${totalTests})`);
  } else if (passedCount >= totalTests - 1) {
    log(COLORS.yellow, `⚠ Most tests passed. (${passedCount}/${totalTests}) - ${passPercentage}%`);
    log(COLORS.yellow, '  Note: If Chat test failed, ensure GEMINI_API_KEY is set in .env');
  } else {
    log(COLORS.red, `✗ Some tests failed. (${passedCount}/${totalTests}) - ${passPercentage}%`);
  }

  separator();
  
  if (passedCount < totalTests) {
    log(COLORS.yellow, '📝 Setup Instructions:');
    console.log(`
  1. Create .env file in backend directory:
     GEMINI_API_KEY=your_actual_key_here
     CHATBOT_PORT=5001

  2. Get your API key from: https://makersuite.google.com/app/apikey

  3. Start server: npm run chatbot:dev

  4. Run tests again: node test-chatbot.js
    `);
  }
}

// Run tests
runTests().catch(console.error);
