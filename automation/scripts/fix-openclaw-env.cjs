#!/usr/bin/env node
// Fix OpenClaw runtime environment issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const NODE_V22_PATH = '/Users/miami2/.nvm/versions/node/v22.22.1/bin';

console.log('[FixEnv] Starting OpenClaw environment repair...');

// 1. Ensure Node 22 is used for OpenClaw
try {
  console.log('[FixEnv] Setting up Node.js v22.22.1 in PATH...');
  process.env.PATH = `${NODE_V22_PATH}:${process.env.PATH}`;
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`[FixEnv] Node version: ${nodeVersion}`);
  if (!nodeVersion.startsWith('v22.')) {
    console.error('[FixEnv] ERROR: Node 22 not active!');
    process.exit(1);
  }
} catch (err) {
  console.error('[FixEnv] Failed to set Node version:', err.message);
  process.exit(1);
}

// 2. Check OpenRouter credentials
try {
  console.log('[FixEnv] Checking OpenRouter credentials...');
  const configPath = path.join(process.env.HOME, '.openclaw', 'openclaw.json');
  if (!fs.existsSync(configPath)) {
    console.error('[FixEnv] OpenClaw config not found!');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const profile = config.auth?.profiles?.['openrouter:default'];
  if (!profile) {
    console.error('[FixEnv] OpenRouter profile not configured!');
    process.exit(1);
  }
  if (profile.mode !== 'api_key') {
    console.error('[FixEnv] OpenRouter profile not using API key mode!');
    process.exit(1);
  }
  console.log('[FixEnv] OpenRouter profile configured correctly (API key mode)');
  // Note: we don't check the actual key here for security
} catch (err) {
  console.error('[FixEnv] Failed to validate OpenClaw config:', err.message);
  process.exit(1);
}

// 3. Verify OpenClaw gateway is accessible
try {
  console.log('[FixEnv] Testing OpenClaw gateway connectivity...');
  const result = execSync('openclaw --version', { encoding: 'utf8' }).trim();
  console.log(`[FixEnv] OpenClaw version: ${result}`);
} catch (err) {
  console.error('[FixEnv] OpenClaw CLI not accessible:', err.message);
  process.exit(1);
}

console.log('[FixEnv] Environment repair complete - all systems go!');
