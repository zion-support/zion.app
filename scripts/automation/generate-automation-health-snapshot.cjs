#!/usr/bin/env node
/**
 * Generate a compact automation health snapshot used by homepage and AI lab views.
 * Appends to automation-health-history.json for SLO trend (bounded).
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'automation-health-latest.json');
const HIST = path.join(REPORTS, 'automation-health-history.json');
const STATIC_DIR = path.join(ROOT, 'public', 'api');
const MAX_POINTS = Math.min(500, Math.max(30, Number(process.env.AUTOMATION_HEALTH_HISTORY_MAX || 180)));

function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(REPORTS, name), 'utf8'));
  } catch {
    return null;
  }
}

function sev(ema, unhealthy, fp) {
  if (ema >= 6 || unhealthy > 2 || fp >= 8) return 'critical';
  if (ema >= 4 || unhealthy > 0 || fp >= 4) return 'warning';
  return 'nominal';
}

/** Single 0–100 score: higher is healthier */
function sloScore(ema, unhealthy, fp) {
  let s = 100;
  s -= Math.min(36, Number(ema || 0) * 6);
  s -= Math.min(36, Number(unhealthy || 0) * 12);
  s -= Math.min(28, Number(fp || 0) * 3);
  return Math.max(0, Math.min(100, Math.round(s)));
}

function appendHistory(point) {
  let data = { points: [] };
  try {
    data = JSON.parse(fs.readFileSync(HIST, 'utf8'));
  } catch {
    data = { points: [] };
  }
  if (!Array.isArray(data.points)) data.points = [];
  data.points.push(point);
  if (data.points.length > MAX_POINTS) {
    data.points = data.points.slice(data.points.length - MAX_POINTS);
  }
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(HIST, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/** Last ISO timestamp from a JSON array file (e.g. observability / smoke history). */
function lastTimestampFromJsonArray(fileName) {
  const j = readJson(fileName);
  if (!Array.isArray(j) || !j.length) return null;
  const last = j[j.length - 1];
  const t = last && (last.timestamp || last.generatedAt);
  return typeof t === 'string' ? t : null;
}

/** Last automation-health-history point timestamp (after append). */
function lastAutomationHealthHistoryTs() {
  try {
    const data = JSON.parse(fs.readFileSync(HIST, 'utf8'));
    const pts = data && Array.isArray(data.points) ? data.points : [];
    if (!pts.length) return null;
    const t = pts[pts.length - 1].timestamp;
    return typeof t === 'string' ? t : null;
  } catch {
    return null;
  }
}

function main() {
  const reg = readJson('incident-suppression-registry-latest.json');
  const dep = readJson('deploy-status-latest.json');
  const smoke = readJson('netlify-preview-smoke-latest.json');
  const idx = readJson('automation-open-issues-index-latest.json');
  const ema = Number(reg?.noise?.emaOpenIncidents ?? 0);
  const unhealthy = Number(smoke?.unhealthyCount ?? 0);
  const fp = Number(idx?.openAutomationFingerprintIssues ?? 0);
  const severity = sev(ema, unhealthy, fp);
  const score = sloScore(ema, unhealthy, fp);

  let prevScore = null;
  try {
    const h = JSON.parse(fs.readFileSync(HIST, 'utf8'));
    const pts = Array.isArray(h.points) ? h.points : [];
    if (pts.length) prevScore = Number(pts[pts.length - 1].sloScore);
  } catch {
    /* ignore */
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    severity,
    sloScore: score,
    sloDeltaFromPrevious: prevScore == null || Number.isNaN(prevScore) ? null : score - prevScore,
    emaOpenIncidents: ema,
    previewUnhealthyCount: unhealthy,
    openFingerprintIssues: fp,
    deployStatus: dep?.status || 'unknown',
    deploySha: dep?.sha || null,
    netlifyDeployUrl: dep?.netlifyDeployUrl || null,
    registryGeneratedAt: reg?.generatedAt || null,
    telemetryFreshness: {
      suppressionRegistryAt: reg?.generatedAt || null,
      deployStatusAt: dep?.generatedAt || null,
      previewSmokeAt: smoke?.generatedAt || null,
      issueIndexAt: idx?.generatedAt || null,
      observabilityEmaFpHistoryAt: lastTimestampFromJsonArray('observability-ema-fp-history.json'),
      smokeHealthHistoryAt: lastTimestampFromJsonArray('smoke-health-history.json'),
      automationHealthHistoryAt: null,
    },
  };

  appendHistory({
    timestamp: payload.generatedAt,
    sloScore: score,
    severity,
    ema,
    previewUnhealthy: unhealthy,
    fp,
  });

  payload.telemetryFreshness.automationHealthHistoryAt = lastAutomationHealthHistoryTs();

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(STATIC_DIR, 'automation-health.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  try {
    const histJson = JSON.parse(fs.readFileSync(HIST, 'utf8'));
    fs.writeFileSync(
      path.join(STATIC_DIR, 'automation-health-history.json'),
      `${JSON.stringify(histJson, null, 2)}\n`,
      'utf8',
    );
  } catch {
    /* no history yet */
  }

  console.log('Wrote', OUT, 'sloScore=', score);
}

main();
