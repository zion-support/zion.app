#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Export release risk snapshot as Prometheus textfile metrics.
 * Input: automation/reports/release-risk-score-latest.json
 * Output: automation/reports/release-risk-metrics.prom
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const SCORE = path.join(REPORTS, 'release-risk-score-latest.json');
const OUT = path.join(REPORTS, 'release-risk-metrics.prom');

function asNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function bandNumber(band) {
  const s = String(band || '').toLowerCase();
  if (s === 'critical') return 3;
  if (s === 'high') return 2;
  if (s === 'medium') return 1;
  return 0;
}

function main() {
  if (!fs.existsSync(SCORE)) {
    console.log('[release-risk-prom] no score file; skip.');
    process.exit(0);
  }
  let j;
  try {
    j = JSON.parse(fs.readFileSync(SCORE, 'utf8'));
  } catch {
    console.log('[release-risk-prom] invalid score json; skip.');
    process.exit(0);
  }

  const lines = [
    '# HELP zion_release_risk_score Unified release risk score (0-100, higher is worse).',
    '# TYPE zion_release_risk_score gauge',
    `zion_release_risk_score ${asNum(j.riskScore)}`,
    '# HELP zion_release_health_score Derived release health score (0-100, higher is better).',
    '# TYPE zion_release_health_score gauge',
    `zion_release_health_score ${asNum(j.healthScore)}`,
    '# HELP zion_release_risk_band Risk band enum: low=0, medium=1, high=2, critical=3.',
    '# TYPE zion_release_risk_band gauge',
    `zion_release_risk_band ${bandNumber(j.band)}`,
    '# HELP zion_release_risk_component_regression Regression component (0-100 raw points).',
    '# TYPE zion_release_risk_component_regression gauge',
    `zion_release_risk_component_regression ${asNum(j?.components?.regression)}`,
    '# HELP zion_release_risk_component_route Route drift component (0-100 raw points).',
    '# TYPE zion_release_risk_component_route gauge',
    `zion_release_risk_component_route ${asNum(j?.components?.routeDrift)}`,
    '# HELP zion_release_risk_component_smoke Smoke component (0-100 raw points).',
    '# TYPE zion_release_risk_component_smoke gauge',
    `zion_release_risk_component_smoke ${asNum(j?.components?.smoke)}`,
    '# HELP zion_release_risk_smoke_streak Consecutive production smoke failure streak.',
    '# TYPE zion_release_risk_smoke_streak gauge',
    `zion_release_risk_smoke_streak ${asNum(j?.detail?.smokeStreak)}`,
    '',
  ];

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log('[release-risk-prom] wrote', OUT);
}

main();
