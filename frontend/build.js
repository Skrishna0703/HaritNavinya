#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

// Direct path to vite binary
const viteBin = path.resolve(__dirname, 'node_modules/vite/bin/vite.js');

// Spawn without shell to avoid permission issues
const result = spawnSync('node', [viteBin, 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: false
});

process.exit(result.status ?? 1);
