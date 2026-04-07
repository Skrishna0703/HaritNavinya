#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building with Vite...');
console.log('Current dir:', process.cwd());
console.log('Frontend dir:', __dirname);

// First, ensure vite is properly installed
try {
  const viteBinPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  if (!fs.existsSync(viteBinPath)) {
    console.error('❌ Vite not found in node_modules/.bin');
    console.log('Files in node_modules/.bin:');
    const binDir = path.join(__dirname, 'node_modules', '.bin');
    if (fs.existsSync(binDir)) {
      console.log(fs.readdirSync(binDir));
    }
    
    // Try alternative approach
    console.log('\n📦 Attempting to install vite...');
    execSync('npm install vite', { stdio: 'inherit', cwd: __dirname });
  }
  
  // Run vite using npx which properly resolves from node_modules
  console.log('\n🏗️  Running vite build...');
  execSync('npx vite build', {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
