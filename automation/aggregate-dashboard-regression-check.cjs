#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Summarizes aggregate-dashboard.json for regressions (critical status, Openclaw signals).
 * Writes automation/reports/aggregate-dashboard-regression-latest.json
 * Exit 1 if AGGREGATE_REGRESSION_STRICT=1 and alerts.length > 0
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AGG = path.join(ROOT, 'automation', 'reports', 'aggregate-dashboard.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'aggregate-dashboard-regression-latest.json');

function main() {
  const alerts = [];
  if (!fs.existsSync(AGG)) {
    const payload = { generatedAt: new Date().toISOString(), skipped: true, reason: 'no aggregate-dashboard.json' };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
    console.log('[aggregate-regression] No aggregate file; skip.');
    process.exit(0);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(AGG, 'utf8'));
  } catch {
    const payload = { generatedAt: new Date().toISOString(), error: 'invalid JSON' };
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
    process.exit(0);
  }
  const summary = data.summary || {};
  const status = summary.status || 'unknown';
  if (status === 'critical') alerts.push({ type: 'aggregate_status_critical', detail: status });
  const issues = Array.isArray(summary.issues) ? summary.issues : [];
  for (const id of issues) {
    if (String(id).includes('openclaw')) {
      alerts.push({ type: 'openclaw_issue_flag', detail: id });
    }
  }
  if (Number(summary.openclawFailures) > 0) {
    alerts.push({ type: 'openclaw_failures', detail: summary.openclawFailures });
  }
  if (Number(summary.openclawContractFailures) > 0) {
    alerts.push({ type: 'openclaw_contract_failures', detail: summary.openclawContractFailures });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    summaryStatus: status,
    alerts,
    alertCount: alerts.length,
    issues,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`[aggregate-regression] alerts=${alerts.length} -> ${OUT}`);

  const strict = process.env.AGGREGATE_REGRESSION_STRICT === '1' || process.env.AGGREGATE_REGRESSION_STRICT === 'true';
  if (strict && alerts.length > 0) {
    console.error('[aggregate-regression] Strict mode: failing due to alerts.');
    process.exit(1);
  }
  process.exit(0);
}

main();
