#!/usr/bin/env node
/**
 * Startup Verification Script
 * Checks if soil testing centers data is properly loaded
 * Run this on deployment to verify everything is working
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  Soil Testing Centers - Deployment Verification   ║');
console.log('╚════════════════════════════════════════════════════╝\n');

// Check current working directory
console.log('📍 Environment Information:');
console.log(`   Current Directory: ${process.cwd()}`);
console.log(`   Node Version: ${process.version}`);
console.log(`   Script Directory: ${__dirname}`);
console.log('');

// Check for JSON files in various locations
const locationsToCheck = [
  { path: 'soil-testing-centers.json', desc: 'App Root' },
  { path: 'backend/soil-testing-centers.json', desc: 'Backend Directory' },
  { path: path.join(__dirname, '../../soil-testing-centers.json'), desc: 'Services Dir (../../)' },
  { path: path.join(__dirname, '../soil-testing-centers.json'), desc: 'Services Dir (../)' },
  { path: path.join(__dirname, '../../backend/soil-testing-centers.json'), desc: 'Services Dir (../../backend/)' },
];

console.log('🔍 Searching for soil-testing-centers.json:');
let foundPath = null;

for (const location of locationsToCheck) {
  const fullPath = path.resolve(location.path);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${location.desc}: ${fullPath}`);
  
  if (exists && !foundPath) {
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        foundPath = fullPath;
        console.log(`      → Contains ${data.length} entries`);
      }
    } catch (e) {
      console.log(`      → Error: Invalid JSON`);
    }
  }
}

console.log('');

// Summary
if (foundPath) {
  console.log('✅ SUCCESS: soil-testing-centers.json located and valid');
  console.log(`   Path: ${foundPath}`);
  
  try {
    const data = JSON.parse(fs.readFileSync(foundPath, 'utf-8'));
    console.log(`   Entries: ${data.length}`);
    
    // Sample check
    if (data[0]) {
      const keys = Object.keys(data[0]);
      console.log(`   Fields: ${keys.join(', ')}`);
    }
  } catch (e) {
    console.log(`   ⚠️  Error reading JSON: ${e.message}`);
  }
} else {
  console.log('❌ FAILURE: soil-testing-centers.json not found in any expected location');
  console.log('   This will cause the API to return empty results');
  console.log('   Action: Ensure .npmignore is configured and file is included in build');
}

console.log('\n');
