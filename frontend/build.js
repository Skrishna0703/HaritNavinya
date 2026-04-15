#!/usr/bin/env node
const { execFileSync } = require('child_process');
const path = require('path');
try {
  execFileSync(process.execPath, [path.join(__dirname, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
} catch (e) {
  process.exit(1);
}
