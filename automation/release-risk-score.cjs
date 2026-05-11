#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Unified release risk score from local automation reports (no network).
 * Writes automation/reports/release-risk-score-latest.json
 *
 * riskScore: 0–100 (higher = more risk). healthScore = 100 - riskScore (clamped).
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'release-risk-score-latest.json');

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function consecutiveProdFails(hist) {
  if (!Array.isArray(hist) || hist.length === 0) return 0;
  let n = 0;
  for (let i = hist.length - 1; i >= 0; i -= 1) {
    const ok = hist[i].prodOk;
    if (ok === false) n += 1;
    else if (ok === true) break;
    else break;
  }
  return n;
}

function bandForRisk(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

/** @param {string} name @param {number} def */
function numEnv(name, def) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v >= 0 ? v : def;
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  const diff = readJson(path.join(REPORTS, 'aggregate-regression-diff-latest.json'), null);
  const drift = readJson(path.join(REPORTS, 'app-route-sitemap-drift-latest.json'), null);
  const smoke = readJson(path.join(REPORTS, 'scheduled-production-smoke-latest.json'), null);
  const smokeHist = readJson(path.join(REPORTS, 'smoke-health-history.json'), []);

  let regression = 0;
  const regressionFactors = [];
  if (diff && !diff.skipped) {
    if (diff.worsened) {
      regression += 35;
      regressionFactors.push('aggregate_regression_worsened');
    }
    const newTypes = Array.isArray(diff.deltas && diff.deltas.newAlertTypes) ? diff.deltas.newAlertTypes : [];
    const nt = Math.min(newTypes.length * 8, 40);
    if (nt > 0) {
      regression += nt;
      regressionFactors.push(`new_alert_types:${newTypes.length}`);
    }
    const dAlert = Number(diff.deltas && diff.deltas.alertCount ? diff.deltas.alertCount : 0);
    if (dAlert > 0) {
      const p = Math.min(dAlert * 5, 25);
      regression += p;
      regressionFactors.push(`alert_count_delta:+${dAlert}`);
    }
    const curCount = Number(diff.current && diff.current.alertCount ? diff.current.alertCount : 0);
    if (curCount > 0) {
      const p = Math.min(curCount * 3, 30);
      regression += p;
      regressionFactors.push(`current_alerts:${curCount}`);
    }
  }

  let routeDrift = 0;
  const routeFactors = [];
  if (drift) {
    if (drift.sitemapError) {
      routeDrift += 20;
      routeFactors.push('sitemap_fetch_error');
    }
    const n = Number(drift.counts && drift.counts.inAppNotSitemap ? drift.counts.inAppNotSitemap : 0);
    if (n > 0) {
      const p = Math.min(n * 2, 30);
      routeDrift += p;
      routeFactors.push(`in_app_not_sitemap:${n}`);
    }
    if (drift.status === 'warning') {
      routeDrift += 10;
      routeFactors.push('status_warning');
    }
  }

  let smokeRisk = 0;
  const smokeFactors = [];
  if (smoke) {
    if (smoke.allOk === false) {
      smokeRisk += 30;
      smokeFactors.push('scheduled_prod_smoke_fail');
    }
  }
  const streak = consecutiveProdFails(smokeHist);
  if (streak > 0) {
    const p = Math.min(streak * 8, 32);
    smokeRisk += p;
    smokeFactors.push(`consecutive_prod_smoke_fail_streak:${streak}`);
  }

  const scaleReg = numEnv('RELEASE_RISK_SCALE_REGRESSION', 1);
  const scaleRoute = numEnv('RELEASE_RISK_SCALE_ROUTE', 1);
  const scaleSmoke = numEnv('RELEASE_RISK_SCALE_SMOKE', 1);
  const raw = regression * scaleReg + routeDrift * scaleRoute + smokeRisk * scaleSmoke;
  const riskScore = Math.min(100, Math.max(0, Math.round(raw)));
  const healthScore = Math.min(100, Math.max(0, 100 - riskScore));

  const payload = {
    generatedAt: new Date().toISOString(),
    riskScore,
    healthScore,
    band: bandForRisk(riskScore),
    components: {
      regression: Math.min(100, regression),
      routeDrift: Math.min(100, routeDrift),
      smoke: Math.min(100, smokeRisk),
    },
    weights: {
      scaleRegression: scaleReg,
      scaleRoute: scaleRoute,
      scaleSmoke: scaleSmoke,
    },
    detail: {
      regressionFactors,
      routeFactors,
      smokeFactors,
      aggregateRegressionDiff: diff
        ? {
            worsened: Boolean(diff.worsened),
            recovered: Boolean(diff.recovered),
            skipped: Boolean(diff.skipped),
          }
        : null,
      routeSitemap: drift
        ? {
            status: drift.status ?? null,
            inAppNotSitemap: drift.counts ? drift.counts.inAppNotSitemap : null,
            sitemapError: Boolean(drift.sitemapError),
          }
        : null,
      scheduledSmoke: smoke
        ? { allOk: smoke.allOk, failedCount: smoke.failedCount ?? null }
        : null,
      smokeStreak: streak,
    },
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(
    `[release-risk-score] risk=${riskScore} health=${healthScore} band=${payload.band} -> ${OUT}`,
  );

  const strict = process.env.RELEASE_RISK_SCORE_STRICT === '1' || process.env.RELEASE_RISK_SCORE_STRICT === 'true';
  if (strict && riskScore >= 75) process.exit(1);
}

main();
