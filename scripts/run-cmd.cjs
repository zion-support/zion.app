#!/usr/bin/env node
/**
 * run-cmd.cjs – Execute a shell command and exit with clear status.
 *
 * This helper is used to keep automation steps independent and robust.
 * If the command exits with a non-zero code, the script throws an error.
 *
 * Example:
 *   node scripts/run-cmd.cjs "cd /workspace && npm ci"
 */

const { execSync } = require('child_process');
const cmd = process.argv.slice(2).join(' ');

if (!cmd) {
  console.error('Usage: node scripts/run-cmd.cjs "<command>"');
  process.exit(1);
}

try {
  const out = execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Command completed:', cmd);
  process.exit(0);
} catch (err) {
  console.error('❌ Command failed:', cmd);
  console.error(err && err.stderr ? err.stderr.toString() : err.message);
  process.exit(1);
}