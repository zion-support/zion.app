#!/usr/bin/env node

/**
 * Validates automation/config/pm2-singleton-policy.json (unique non-empty app names).
 * Exit 0 on success, 1 on failure.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT = path.join(ROOT, 'automation', 'config', 'pm2-singleton-policy.json');

function main() {
  const policyPath = process.argv[2] || DEFAULT;
  if (!fs.existsSync(policyPath)) {
    console.error(`[validate-pm2-singleton-policy] Missing file: ${policyPath}`);
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  } catch (e) {
    console.error(`[validate-pm2-singleton-policy] Invalid JSON: ${e.message}`);
    process.exit(1);
  }
  const apps = data.singletonApps;
  if (!Array.isArray(apps) || apps.length === 0) {
    console.error('[validate-pm2-singleton-policy] singletonApps must be a non-empty array');
    process.exit(1);
  }
  const seen = new Set();
  for (const name of apps) {
    if (typeof name !== 'string' || !name.trim()) {
      console.error('[validate-pm2-singleton-policy] Invalid entry in singletonApps');
      process.exit(1);
    }
    if (seen.has(name)) {
      console.error(`[validate-pm2-singleton-policy] Duplicate app name: ${name}`);
      process.exit(1);
    }
    seen.add(name);
  }
  console.log(`[validate-pm2-singleton-policy] OK (${apps.length} singletons)`);
}

main();
