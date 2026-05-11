#!/usr/bin/env node

/**
 * AI Observability EMA Local Guard
 *
 * Local PM2 companion guard that watches observability report freshness and
 * automation health signals, then writes a compact machine-readable report.
 *
 * Env:
 *   CONTINUOUS_MODE=true
 *   INTERVAL_MINUTES=60
 *   EMA_STALE_HOURS=30
 *   HEALTH_STALE_HOURS=8
 *
 * Output:
 *   automation/reports/observability-ema-local-guard-latest.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'observability-ema-local-guard-latest.json');
const CONTINUOUS = process.env.CONTINUOUS_MODE === 'true' || process.env.CONTINUOUS_MODE === '1';
const INTERVAL_MINUTES = Math.max(15, parseInt(process.env.INTERVAL_MINUTES || '60', 10));
const EMA_STALE_HOURS = Math.max(6, parseInt(process.env.EMA_STALE_HOURS || '30', 10));
const HEALTH_STALE_HOURS = Math.max(1, parseInt(process.env.HEALTH_STALE_HOURS || '8', 10));

const INPUTS = {
  emaState: path.join(REPORTS, 'observability-webhook-state.json'),
  emaHistory: path.join(REPORTS, 'observability-ema-fp-history.json'),
  healthLatest: path.join(REPORTS, 'automation-health-latest.json'),
  healthHistory: path.join(REPORTS, 'automation-health-history.json'),
  openIssues: path.join(REPORTS, 'automation-open-issues-index-latest.json'),
};

function log(msg) {
  console.log(`[EmaLocalGuard] ${new Date().toISOString()} | ${msg}`);
}

function ensureDir() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
}

function safeReadJson(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function toTs(value) {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function hoursSince(ts) {
  if (!ts) return null;
  return (Date.now() - ts) / 36e5;
}

function inferLastEmaTs(emaState, emaHistory) {
  const candidates = [];
  if (emaState) {
    candidates.push(toTs(emaState.updatedAt));
    candidates.push(toTs(emaState.timestamp));
    candidates.push(toTs(emaState.lastSentAt));
    candidates.push(toTs(emaState.lastDigestAt));
  }
  if (emaHistory) {
    const arr = Array.isArray(emaHistory.history) ? emaHistory.history : Array.isArray(emaHistory) ? emaHistory : [];
    const last = arr[arr.length - 1];
    if (last) {
      candidates.push(toTs(last.timestamp));
      candidates.push(toTs(last.at));
    }
  }
  return candidates.filter(Boolean).sort((a, b) => b - a)[0] || null;
}

function inferHealthTs(healthLatest, healthHistory) {
  const candidates = [];
  if (healthLatest) {
    candidates.push(toTs(healthLatest.timestamp));
    candidates.push(toTs(healthLatest.at));
    candidates.push(toTs(healthLatest.generatedAt));
  }
  if (healthHistory) {
    const arr = Array.isArray(healthHistory) ? healthHistory : Array.isArray(healthHistory.history) ? healthHistory.history : [];
    const last = arr[arr.length - 1];
    if (last) {
      candidates.push(toTs(last.timestamp));
      candidates.push(toTs(last.at));
    }
  }
  return candidates.filter(Boolean).sort((a, b) => b - a)[0] || null;
}

function healthRisk(healthLatest) {
  if (!healthLatest || typeof healthLatest !== 'object') return { tier: 'unknown', reasons: ['missing_health_latest'] };
  const reasons = [];
  const score = Number(healthLatest.healthScore ?? healthLatest.score ?? 100);
  const openFp = Number(healthLatest.openFingerprintIssues ?? healthLatest.openFpIssues ?? 0);
  const unhealthy = Number(healthLatest.unhealthyWorkflows ?? 0);
  if (Number.isFinite(score) && score < 70) reasons.push(`low_health_score:${score}`);
  if (Number.isFinite(openFp) && openFp >= 8) reasons.push(`open_fp_high:${openFp}`);
  if (Number.isFinite(unhealthy) && unhealthy >= 3) reasons.push(`unhealthy_workflows:${unhealthy}`);
  if (reasons.length >= 2) return { tier: 'critical', reasons };
  if (reasons.length === 1) return { tier: 'warning', reasons };
  return { tier: 'ok', reasons: [] };
}

function openIssueHint(openIssues) {
  if (!openIssues || typeof openIssues !== 'object') return { openCount: null, tier: 'unknown' };
  const candidates = [openIssues.totalOpenIssues, openIssues.openIssues, openIssues.count];
  const count = candidates.find((v) => Number.isFinite(Number(v)));
  const n = Number(count);
  if (!Number.isFinite(n)) return { openCount: null, tier: 'unknown' };
  if (n >= 20) return { openCount: n, tier: 'critical' };
  if (n >= 10) return { openCount: n, tier: 'warning' };
  return { openCount: n, tier: 'ok' };
}

function runOnce() {
  ensureDir();
  const emaState = safeReadJson(INPUTS.emaState);
  const emaHistory = safeReadJson(INPUTS.emaHistory);
  const healthLatest = safeReadJson(INPUTS.healthLatest);
  const healthHistory = safeReadJson(INPUTS.healthHistory);
  const openIssues = safeReadJson(INPUTS.openIssues);

  const emaTs = inferLastEmaTs(emaState, emaHistory);
  const healthTs = inferHealthTs(healthLatest, healthHistory);
  const emaAge = hoursSince(emaTs);
  const healthAge = hoursSince(healthTs);

  const emaStale = emaAge == null ? true : emaAge > EMA_STALE_HOURS;
  const healthStale = healthAge == null ? true : healthAge > HEALTH_STALE_HOURS;
  const health = healthRisk(healthLatest);
  const issueHint = openIssueHint(openIssues);

  let tier = 'ok';
  const reasons = [];
  if (emaStale) reasons.push(`ema_stale>${EMA_STALE_HOURS}h`);
  if (healthStale) reasons.push(`health_stale>${HEALTH_STALE_HOURS}h`);
  if (health.tier === 'warning' || issueHint.tier === 'warning') tier = 'warning';
  if (health.tier === 'critical' || issueHint.tier === 'critical') tier = 'critical';
  if (emaStale && healthStale) tier = 'critical';
  reasons.push(...health.reasons);

  const report = {
    at: new Date().toISOString(),
    tier,
    reasons: [...new Set(reasons)],
    freshness: {
      emaLastAt: emaTs ? new Date(emaTs).toISOString() : null,
      emaAgeHours: emaAge == null ? null : Number(emaAge.toFixed(2)),
      healthLastAt: healthTs ? new Date(healthTs).toISOString() : null,
      healthAgeHours: healthAge == null ? null : Number(healthAge.toFixed(2)),
      thresholds: {
        emaStaleHours: EMA_STALE_HOURS,
        healthStaleHours: HEALTH_STALE_HOURS,
      },
    },
    health: {
      tier: health.tier,
      details: health.reasons,
    },
    issuePressure: issueHint,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  log(`wrote ${path.relative(ROOT, OUT)} tier=${tier}`);
  return report;
}

async function main() {
  if (CONTINUOUS) {
    log(`continuous every ${INTERVAL_MINUTES}m`);
    for (;;) {
      runOnce();
      await new Promise((r) => setTimeout(r, INTERVAL_MINUTES * 60 * 1000));
    }
  }
  const r = runOnce();
  process.exit(r.tier === 'critical' ? 1 : 0);
}

main().catch((e) => {
  log(`fatal: ${e.message}`);
  process.exit(1);
});
