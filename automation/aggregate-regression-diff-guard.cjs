#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Detects worsening aggregate regression vs previous snapshot and writes:
 *   automation/reports/aggregate-regression-diff-latest.json
 *   automation/reports/aggregate-regression-diff-state.json
 *
 * A run is "worsened" when:
 * - alertCount increases, or
 * - new alert types appear.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const CUR = path.join(REPORTS, 'aggregate-dashboard-regression-latest.json');
const STATE = path.join(REPORTS, 'aggregate-regression-diff-state.json');
const OUT = path.join(REPORTS, 'aggregate-regression-diff-latest.json');

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function alertTypes(obj) {
  const alerts = Array.isArray(obj && obj.alerts) ? obj.alerts : [];
  return new Set(alerts.map((a) => String(a && a.type ? a.type : 'unknown')));
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  const cur = readJson(CUR, null);
  if (!cur) {
    const payload = {
      generatedAt: new Date().toISOString(),
      skipped: true,
      reason: 'missing aggregate-dashboard-regression-latest.json',
      worsened: false,
    };
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
    console.log('[aggregate-regression-diff] no current regression report; skip.');
    process.exit(0);
  }

  const prevState = readJson(STATE, {});
  const prev = prevState.last || null;
  const curCount = Number(cur.alertCount || 0);
  const prevCount = Number(prev && prev.alertCount ? prev.alertCount : 0);
  const curTypes = alertTypes(cur);
  const prevTypes = alertTypes(prev);

  const newTypes = [...curTypes].filter((t) => !prevTypes.has(t));
  const worsened = curCount > prevCount || newTypes.length > 0;
  const recovered = curCount === 0;

  const payload = {
    generatedAt: new Date().toISOString(),
    worsened,
    recovered,
    previous: {
      alertCount: prevCount,
      alertTypes: [...prevTypes],
    },
    current: {
      alertCount: curCount,
      alertTypes: [...curTypes],
      summaryStatus: cur.summaryStatus || 'unknown',
    },
    deltas: {
      alertCount: curCount - prevCount,
      newAlertTypes: newTypes,
    },
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));

  const nextState = {
    updatedAt: new Date().toISOString(),
    last: {
      alertCount: curCount,
      alerts: Array.isArray(cur.alerts) ? cur.alerts : [],
      summaryStatus: cur.summaryStatus || 'unknown',
    },
  };
  fs.writeFileSync(STATE, JSON.stringify(nextState, null, 2));

  console.log(
    `[aggregate-regression-diff] worsened=${worsened} recovered=${recovered} current=${curCount} previous=${prevCount}`,
  );

  const strict = process.env.AGGREGATE_REGRESSION_DIFF_STRICT === '1' || process.env.AGGREGATE_REGRESSION_DIFF_STRICT === 'true';
  if (strict && worsened) process.exit(1);
}

main();
