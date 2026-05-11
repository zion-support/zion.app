#!/usr/bin/env node
/**
 * lighthouse-ci.cjs – Run Lighthouse CI on the deployed site and output a JSON report.
 *
 * Requires:
 *   npm i -D @lhci/cli@0.13 (or a compatible version)
 *   The site must be publicly accessible (e.g., Netlify, Vercel) and the URL
 *   is provided via LITHE_URL env var.
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { LITHE_URL = 'https://ziontechgroup.com' } = process.env;

if (!LITHE_URL) {
  console.error('❌ LITHE_URL env var not set');
  process.exit(1);
}

// Ensure @lhci/cli is installed
try {
  execSync('npx lhci --version', { stdio: 'ignore' });
} catch (_) {
  console.error('❌ @lhci/cli not installed. Run: npm i -D @lhci/cli');
  process.exit(1);
}

// Run Lighthouse CI collect
console.log(`🚀 Running Lighthouse CI against ${LITHE_URL}`);
try {
  execSync(`npx lhci collect --url=${LITHE_URL} --outputDir=lhci_reports --numberOfRuns=1`, { stdio: 'inherit' });
  execSync('npx lhci upload --target temporary-public-storage', { stdio: 'inherit' });
  console.log('✅ Lighthouse CI completed. Reports stored in lhci_reports/');
} catch (err) {
  console.error('🚨 Lighthouse CI failed:', err.message);
  process.exit(1);
}
