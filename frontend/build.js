#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building with Vite (Node-only approach)...');
console.log('Frontend dir:', __dirname);

try {
  // Use require.resolve to find vite's CLI entry point
  // This avoids shell execution entirely
  let viteCli = null;
  
  try {
    // Try to resolve vite's ES module entry point directly
    viteCli = require.resolve('vite/bin/vite.js');
  } catch (e) {
    console.warn('Could not resolve vite via require.resolve, checking filesystem...');
    
    // Fallback: check filesystem
    const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    if (fs.existsSync(vitePath)) {
      viteCli = vitePath;
    }
  }
  
  if (!viteCli) {
    throw new Error('Vite CLI not found. Try: npm install vite --save-dev');
  }
  
  console.log('✅ Found vite at:', viteCli);
  console.log('\n🏗️  Running vite build (using execFile, no shell)...\n');
  
  // Use execFileSync to run Node directly without shell
  // This completely bypasses the shell permission issue
  execFileSync('node', [viteCli, 'build'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('\n✅ Build completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  if (error.stderr) console.error('STDERR:', error.stderr.toString());
  if (error.stdout) console.error('STDOUT:', error.stdout.toString());
  process.exit(1);
}
