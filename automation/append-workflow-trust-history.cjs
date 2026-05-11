#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const SRC = path.join(REPORTS, 'workflow-trust-score-latest.json');
const OUT = path.join(REPORTS, 'workflow-trust-history.json');
const MAX_POINTS = Math.max(60, Number(process.env.WORKFLOW_TRUST_HISTORY_MAX || 600));

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  const latest = readJson(SRC, null);
  if (!latest) {
    console.log('[workflow-trust-history] missing latest trust score; skip');
    process.exit(0);
  }
  const hist = readJson(OUT, { points: [] });
  const points = Array.isArray(hist.points) ? hist.points : [];
  points.push({
    generatedAt: new Date().toISOString(),
    trustScore: Number(latest.trustScore || 0),
    band: String(latest.band || 'unknown'),
    factors: latest.factors || {},
  });
  const payload = { generatedAt: new Date().toISOString(), points: points.slice(-MAX_POINTS) };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log('[workflow-trust-history] points=', payload.points.length);
}

main();
