#!/usr/bin/env node

/**
 * Validates automation/config/pm2-singleton-policy.json and ensures every
 * listed singleton name exists as a PM2 app in ecosystem.config.cjs.
 *
 * Exit 0 on success, 1 on failure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const POLICY = path.join(ROOT, 'automation', 'config', 'pm2-singleton-policy.json');
const ECOSYSTEM = path.join(ROOT, 'ecosystem.config.cjs');

function main() {
  execSync(`node ${path.join(ROOT, 'automation', 'validate-pm2-singleton-policy.cjs')}`, {
    cwd: ROOT,
    stdio: 'inherit',
  });

  if (!fs.existsSync(POLICY)) {
    console.error('[validate-pm2-singleton-ecosystem] Missing policy file');
    process.exit(1);
  }
  if (!fs.existsSync(ECOSYSTEM)) {
    console.error('[validate-pm2-singleton-ecosystem] Missing ecosystem.config.cjs');
    process.exit(1);
  }

  const policy = JSON.parse(fs.readFileSync(POLICY, 'utf8'));
  const apps = policy.singletonApps;
  delete require.cache[require.resolve(ECOSYSTEM)];
  const eco = require(ECOSYSTEM);
  const pm2Names = new Set((eco.apps || []).map((a) => a && a.name).filter(Boolean));

  const missing = [];
  for (const name of apps) {
    if (!pm2Names.has(name)) missing.push(name);
  }

  if (missing.length) {
    console.error(
      '[validate-pm2-singleton-ecosystem] Policy singleton(s) not found in ecosystem.config.cjs:',
    );
    for (const m of missing) console.error(`  - ${m}`);
    process.exit(1);
  }

  console.log(
    `[validate-pm2-singleton-ecosystem] OK (${apps.length} policy singletons match ecosystem apps)`,
  );
}

main();
