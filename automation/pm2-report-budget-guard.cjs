#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Size guard for PM2-related JSON reports under automation/reports/
 * (pm2-*.json, pm2-*.md) to avoid unbounded growth from agents.
 *
 * Env:
 *   PM2_REPORT_MAX_FILE_KB — per-file budget (default 768)
 *   PM2_REPORT_BUDGET_FAIL_ON_EXCEED=0 — warn only (default 1 = exit 1 on breach)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'pm2-report-budget-guard-latest.json');
const MAX_KB = Number(process.env.PM2_REPORT_MAX_FILE_KB || '768');
const FAIL_ON_EXCEED = !(
  process.env.PM2_REPORT_BUDGET_FAIL_ON_EXCEED === '0' ||
  process.env.PM2_REPORT_BUDGET_FAIL_ON_EXCEED === 'false'
);

function listPm2Reports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs.readdirSync(REPORTS_DIR).filter((name) => /^pm2-.*\.(json|md)$/.test(name));
}

function run() {
  const names = listPm2Reports();
  const details = [];
  let breached = false;

  for (const name of names) {
    const filePath = path.join(REPORTS_DIR, name);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      continue;
    }
    const kb = stat.size / 1024;
    const tooBig = kb > MAX_KB;
    if (tooBig) breached = true;
    details.push({
      path: path.relative(ROOT, filePath),
      sizeKb: Number(kb.toFixed(2)),
      exceeded: tooBig,
    });
  }

  details.sort((a, b) => b.sizeKb - a.sizeKb);

  const report = {
    generatedAt: new Date().toISOString(),
    maxFileKb: MAX_KB,
    scanned: details.length,
    oversize: details.filter((d) => d.exceeded),
    failed: breached && FAIL_ON_EXCEED,
    details,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  if (report.oversize.length > 0) {
    console.error(
      `PM2 report budget: ${report.oversize.length} file(s) exceed ${MAX_KB} KB:`,
      report.oversize.map((d) => d.path).join(', '),
    );
    if (FAIL_ON_EXCEED) process.exit(1);
    process.exit(0);
  }

  console.log(`PM2 report budget OK (${details.length} scanned, max ${MAX_KB} KB/file).`);
}

run();
