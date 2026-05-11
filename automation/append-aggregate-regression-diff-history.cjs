#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Append aggregate regression diff snapshot into bounded history.
 * Input: automation/reports/aggregate-regression-diff-latest.json
 * Output: automation/reports/aggregate-regression-diff-history.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const LATEST = path.join(REPORTS, 'aggregate-regression-diff-latest.json');
const HISTORY = path.join(REPORTS, 'aggregate-regression-diff-history.json');
const MAX = Math.max(50, Number.parseInt(process.env.AGGREGATE_DIFF_HISTORY_MAX || '600', 10));

function readJson(p, fallback) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function keyOf(x) {
  return `${x.generatedAt || ''}|${x.worsened ? '1' : '0'}|${x.recovered ? '1' : '0'}|${x.currentAlertCount || 0}`;
}

function main() {
  const latest = readJson(LATEST, null);
  if (!latest) {
    console.log('[aggregate-regression-diff-history] no latest snapshot; skip.');
    process.exit(0);
  }

  const cur = {
    generatedAt: latest.generatedAt || new Date().toISOString(),
    worsened: Boolean(latest.worsened),
    recovered: Boolean(latest.recovered),
    currentAlertCount: Number(latest.current && latest.current.alertCount ? latest.current.alertCount : 0),
    deltaAlertCount: Number(latest.deltas && latest.deltas.alertCount ? latest.deltas.alertCount : 0),
    newAlertTypes: Array.isArray(latest.deltas && latest.deltas.newAlertTypes) ? latest.deltas.newAlertTypes : [],
    summaryStatus: String((latest.current && latest.current.summaryStatus) || 'unknown'),
  };

  const prev = readJson(HISTORY, { points: [] });
  const points = Array.isArray(prev.points) ? prev.points : [];
  if (points.length > 0 && keyOf(points[points.length - 1]) === keyOf(cur)) {
    console.log('[aggregate-regression-diff-history] duplicate tail snapshot; skip write.');
    process.exit(0);
  }

  const next = {
    generatedAt: new Date().toISOString(),
    points: [...points, cur].slice(-MAX),
  };
  fs.writeFileSync(HISTORY, JSON.stringify(next, null, 2));
  console.log(`[aggregate-regression-diff-history] appended -> ${HISTORY} (points=${next.points.length})`);
}

main();
