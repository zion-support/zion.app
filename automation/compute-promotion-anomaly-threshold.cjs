#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const HISTORY_FILE = path.join(REPORTS_DIR, 'promotion-confidence-history.json');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'promotion-anomaly-threshold-latest.json');

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDev(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = mean(values.map((value) => (value - m) ** 2));
  return Math.sqrt(variance);
}

function main() {
  if (!fs.existsSync(HISTORY_FILE)) {
    console.log('No promotion confidence history found; skipping threshold computation.');
    process.exit(0);
  }

  const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  const points = Array.isArray(history) ? history : [];
  const recent = points.slice(-30).map((item) => Number(item.avgScore || 0));
  const baseline = points.slice(-90).map((item) => Number(item.avgScore || 0));

  const recentStd = stdDev(recent);
  const baselineStd = stdDev(baseline);
  const adaptiveThreshold = Math.max(
    10,
    Math.min(22, Math.round(10 + recentStd / 3 + baselineStd / 6)),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    dataPoints: points.length,
    recentWindow: recent.length,
    baselineWindow: baseline.length,
    recentStd: Number(recentStd.toFixed(2)),
    baselineStd: Number(baselineStd.toFixed(2)),
    adaptiveThreshold,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`Promotion anomaly threshold report written: ${OUTPUT_FILE}`);
}

main();

