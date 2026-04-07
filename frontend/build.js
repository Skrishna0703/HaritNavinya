#!/usr/bin/env node

// Custom build script to bypass shell permission issues on Render
const { spawn } = require('child_process');
const path = require('path');

const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const args = process.argv.slice(2);

const proc = spawn('node', [viteBin, ...args], {
  stdio: 'inherit'
});

proc.on('exit', (code) => {
  process.exit(code);
});

proc.on('error', (err) => {
  console.error('Failed to start vite:', err);
  process.exit(1);
});
