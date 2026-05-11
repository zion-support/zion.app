#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Flags workflows that run npm ci/install without setup-node npm cache when package-lock.json exists.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WF = path.join(ROOT, '.github', 'workflows');
const OUT = path.join(ROOT, 'automation', 'reports', 'gha-npm-cache-audit-latest.json');

function main() {
  const findings = [];
  if (!fs.existsSync(WF)) {
    process.exit(0);
  }
  for (const name of fs.readdirSync(WF)) {
    if (!name.endsWith('.yml') && !name.endsWith('.yaml')) continue;
    const text = fs.readFileSync(path.join(WF, name), 'utf8');
    if (!/npm\s+ci\b/.test(text) && !/npm\s+install\b/.test(text)) continue;
    if (!/package-lock\.json/.test(text) && !fs.existsSync(path.join(ROOT, 'package-lock.json'))) continue;
    const usesSetupNode = /uses:\s*actions\/setup-node@/.test(text);
    const hasCache = /cache:\s*npm/.test(text) || /cache-dependency-path:\s*package-lock/.test(text);
    if (usesSetupNode && !hasCache) {
      findings.push({
        file: name,
        issue: 'setup-node without npm cache while npm ci/install present',
      });
    }
    if (!usesSetupNode && /npm\s+ci\b/.test(text)) {
      findings.push({ file: name, issue: 'npm ci without actions/setup-node (cannot attach cache)' });
    }
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    findings,
    count: findings.length,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`GHA npm cache audit: ${findings.length} finding(s) -> ${OUT}`);
  if (process.env.GHA_NPM_CACHE_AUDIT_STRICT === '1' && findings.length > 0) {
    process.exit(1);
  }
}

main();
