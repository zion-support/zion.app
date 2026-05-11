#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const MAX_POINTS = Number(process.env.TELEMETRY_COMPACT_MAX_POINTS || 240);

const TARGET_FILES = [
  'promotion-confidence-history.json',
  'pm2-slo-history.json',
  'pm2-restart-guardian-history.json',
  'pm2-config-drift-guard-history.json',
];

function compactArray(data) {
  if (!Array.isArray(data) || data.length <= MAX_POINTS) return data;
  return data.slice(-MAX_POINTS);
}

function main() {
  const summary = [];
  for (const file of TARGET_FILES) {
    const full = path.join(REPORTS_DIR, file);
    if (!fs.existsSync(full)) continue;
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch {
      continue;
    }
    const before = Array.isArray(parsed) ? parsed.length : 0;
    const compacted = compactArray(parsed);
    const after = Array.isArray(compacted) ? compacted.length : before;
    if (after !== before) {
      fs.writeFileSync(full, JSON.stringify(compacted, null, 2));
    }
    summary.push({ file, before, after });
  }
  console.log(`Telemetry compaction summary: ${JSON.stringify(summary)}`);
}

main();

