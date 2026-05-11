#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Merges latest smoke, GHA npm-cache audit, route/sitemap drift, optional release-risk score,
 * fingerprint incident digest / trend JSON, and OpenClaw runner anomaly JSON (when present)
 * into one digest for dashboards / agents.
 * Writes automation/reports/observability-digest-latest.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'observability-digest-latest.json');

function readJson(name) {
  const p = path.join(REPORTS, name);
  if (!fs.existsSync(p)) return { missing: true, path: name };
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { error: true, path: name };
  }
}

function main() {
  const digest = {
    generatedAt: new Date().toISOString(),
    productionSmoke: readJson('scheduled-production-smoke-latest.json'),
    ghaNpmCacheAudit: readJson('gha-npm-cache-audit-latest.json'),
    routeSitemapDrift: readJson('app-route-sitemap-drift-latest.json'),
    releaseRiskScore: readJson('release-risk-score-latest.json'),
    automationFingerprintIncidents: readJson('automation-fingerprint-incidents-latest.json'),
    automationFingerprintTrend: readJson('automation-fingerprint-incidents-trend.json'),
    openClawRunnerAnomaly: readJson('openclaw-runner-anomaly-latest.json'),
    summary: {},
  };
  const sm = digest.productionSmoke;
  if (sm && !sm.missing && !sm.error) {
    digest.summary.productionSmokeOk = Boolean(sm.allOk);
    digest.summary.productionSmokeFailedCount = sm.failedCount;
  }
  const gha = digest.ghaNpmCacheAudit;
  if (gha && gha.count != null) digest.summary.ghaNpmCacheFindings = gha.count;
  const drift = digest.routeSitemapDrift;
  if (drift && drift.counts) {
    digest.summary.routeDriftInAppNotSitemap = drift.counts.inAppNotSitemap;
    digest.summary.routeDriftStatus = drift.status;
  }
  const rr = digest.releaseRiskScore;
  if (rr && !rr.missing && !rr.error && typeof rr.riskScore === 'number') {
    digest.summary.releaseRiskScore = rr.riskScore;
    digest.summary.releaseRiskBand = rr.band || null;
    digest.summary.releaseRiskHealthScore =
      typeof rr.healthScore === 'number' ? rr.healthScore : null;
  }
  const fp = digest.automationFingerprintIncidents;
  if (fp && !fp.missing && !fp.error && !fp.skipped) {
    digest.summary.fingerprintDigestPresent = true;
    digest.summary.fingerprintDigestOpen = fp.openWithFingerprintLabel;
    digest.summary.fingerprintDigestSeverity = fp.escalationSeverity || null;
    digest.summary.fingerprintDigestGeneratedAt = fp.generatedAt || null;
  } else {
    digest.summary.fingerprintDigestPresent = false;
  }
  const tr = digest.automationFingerprintTrend;
  if (tr && !tr.missing && !tr.error && Array.isArray(tr.history) && tr.history.length) {
    const last = tr.history[tr.history.length - 1];
    digest.summary.fingerprintTrendLastOpen = last.open != null ? last.open : null;
    digest.summary.fingerprintTrendLastNewCount = last.newCount != null ? last.newCount : null;
    digest.summary.fingerprintTrendLastSeverity = last.severity || null;
    digest.summary.fingerprintTrendLastRegistryEma =
      last.registryEma != null && Number.isFinite(Number(last.registryEma)) ? Number(last.registryEma) : null;
  }
  const oa = digest.openClawRunnerAnomaly;
  if (oa && !oa.missing && !oa.error && typeof oa === 'object') {
    digest.summary.openclawRunnerAnomalyDetected = Boolean(oa.anomalyDetected);
    digest.summary.openclawRunnerAnomalySeverity =
      typeof oa.severity === 'string' ? oa.severity : (oa.anomalyDetected ? 'info' : 'none');
    digest.summary.openclawRunnerAnomalyAlertCount =
      Array.isArray(oa.alerts) ? oa.alerts.length : null;
    digest.summary.openclawRunnerAnomalySummary =
      typeof oa.summary === 'string' ? oa.summary.slice(0, 500) : null;
    digest.summary.openclawRunnerAnomalyGeneratedAt =
      typeof oa.generatedAt === 'string' ? oa.generatedAt : null;
  }
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(digest, null, 2));
  console.log(`Observability digest -> ${OUT}`);
}

main();
