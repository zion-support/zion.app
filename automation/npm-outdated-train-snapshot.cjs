#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Captures `npm outdated --json` for CI train artifacts.
 * Output: automation/reports/npm-outdated-train-latest.json
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'automation', 'reports', 'npm-outdated-train-latest.json');

function main() {
  let raw = '{}';
  try {
    raw = execSync('npm outdated --json', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    raw = e.stdout || '{}';
  }
  let data;
  try {
    data = JSON.parse(raw || '{}');
  } catch {
    data = {};
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    outdatedCount: Object.keys(data).length,
    packages: data,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`npm outdated train snapshot: ${payload.outdatedCount} pkg -> ${OUT}`);
}

main();
