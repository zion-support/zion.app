#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Append release risk snapshot into bounded history.
 * Input: automation/reports/release-risk-score-latest.json
 * Output: automation/reports/release-risk-history.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const LATEST = path.join(REPORTS, 'release-risk-score-latest.json');
const HISTORY = path.join(REPORTS, 'release-risk-history.json');
const MAX = Math.max(50, Number.parseInt(process.env.RELEASE_RISK_HISTORY_MAX || '600', 10));

function readJson(p, fallback) {
  try {
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function keyOf(p) {
  return `${p.generatedAt || ''}|${p.riskScore || 0}|${p.band || ''}|${p.smokeStreak || 0}`;
}

function main() {
  const latest = readJson(LATEST, null);
  if (!latest || typeof latest.riskScore !== 'number') {
    console.log('[release-risk-history] no latest score snapshot; skip.');
    process.exit(0);
  }

  const point = {
    generatedAt: latest.generatedAt || new Date().toISOString(),
    riskScore: Number(latest.riskScore || 0),
    healthScore: Number(latest.healthScore || 0),
    band: String(latest.band || 'unknown'),
    smokeStreak: Number(latest?.detail?.smokeStreak || 0),
    regression: Number(latest?.components?.regression || 0),
    routeDrift: Number(latest?.components?.routeDrift || 0),
    smoke: Number(latest?.components?.smoke || 0),
  };

  const prev = readJson(HISTORY, { points: [] });
  const points = Array.isArray(prev.points) ? prev.points : [];
  if (points.length > 0 && keyOf(points[points.length - 1]) === keyOf(point)) {
    console.log('[release-risk-history] duplicate tail snapshot; skip write.');
    process.exit(0);
  }

  const next = {
    generatedAt: new Date().toISOString(),
    points: [...points, point].slice(-MAX),
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(HISTORY, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  console.log(`[release-risk-history] appended -> ${HISTORY} (points=${next.points.length})`);
}

main();
