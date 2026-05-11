#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Fails if any *-history.json under automation/reports exceeds size/line budget.
 * Wired into npm run reports:hygiene:check.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const MAX_BYTES = Math.max(50_000, Number.parseInt(process.env.REPORT_HISTORY_MAX_BYTES || '2000000', 10));
const MAX_LINES = Math.max(500, Number.parseInt(process.env.REPORT_HISTORY_MAX_LINES || '25000', 10));
const DRY = process.env.REPORT_HISTORY_CAP_DRY === '1' || process.env.REPORT_HISTORY_CAP_DRY === 'true';

function main() {
  if (!fs.existsSync(REPORTS)) {
    process.exit(0);
  }
  const bad = [];
  const skip = new Set(['merge-ledger-history.json']);
  for (const name of fs.readdirSync(REPORTS)) {
    if (!/-history\.json$/i.test(name)) continue;
    if (skip.has(name)) continue;
    const full = path.join(REPORTS, name);
    const st = fs.statSync(full);
    if (st.size > MAX_BYTES) {
      bad.push({ file: name, reason: 'size', value: st.size, limit: MAX_BYTES });
      continue;
    }
    const text = fs.readFileSync(full, 'utf8');
    const lines = text.split('\n').length;
    if (lines > MAX_LINES) {
      bad.push({ file: name, reason: 'lines', value: lines, limit: MAX_LINES });
    }
  }
  if (bad.length === 0) {
    console.log('[report-history-cap] OK');
    process.exit(0);
  }
  console.error('[report-history-cap] Oversized history files:');
  for (const b of bad) {
    console.error(` - ${b.file} ${b.reason}=${b.value} limit=${b.limit}`);
  }
  if (DRY) {
    console.warn('[report-history-cap] DRY_RUN: exiting 0');
    process.exit(0);
  }
  process.exit(1);
}

main();
