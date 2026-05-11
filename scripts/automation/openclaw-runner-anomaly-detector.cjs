#!/usr/bin/env node
/**
 * Flags abrupt shifts in OpenClaw runner guard history (bounded cache).
 * Writes automation/reports/openclaw-runner-anomaly-latest.json
 *
 * Env:
 *   HISTORY_FILE — default automation/reports/openclaw-runner-history.json
 *   OUT_FILE — default automation/reports/openclaw-runner-anomaly-latest.json
 *   TREND_FILE — default automation/reports/openclaw-runner-anomaly-history.json
 *   TREND_MAX — default 180
 *
 * Writes GITHUB_OUTPUT when set:
 *   anomaly_detected=true|false
 *   anomaly_summary=<short string>
 *   anomaly_critical_consecutive=<number>
 */

const fs = require('fs');
const path = require('path');

const REPORTS = path.join(process.cwd(), 'automation', 'reports');
const historyPath = process.env.HISTORY_FILE || path.join(REPORTS, 'openclaw-runner-history.json');
const outPath = process.env.OUT_FILE || path.join(REPORTS, 'openclaw-runner-anomaly-latest.json');
const trendPath = process.env.TREND_FILE || path.join(REPORTS, 'openclaw-runner-anomaly-history.json');

function classifyReason(reason) {
  const r = String(reason || '').toLowerCase();
  if (r.includes('policy') || r.includes('approved') || r.includes('stale handoff')) return 'policy';
  if (r.includes('missing') || r.includes('not found') || r.includes('artifact')) return 'artifact';
  if (r.includes('exec') || r.includes('runner')) return 'runner';
  return 'unknown';
}

function failRate(entries) {
  if (!entries.length) return 0;
  const fails = entries.filter((e) => Number(e.exitCode || 0) !== 0).length;
  return fails / entries.length;
}

function median(values) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mttrHours(entries) {
  const durations = [];
  let openFailureStart = null;
  for (const row of entries) {
    const ts = row && row.timestampIso ? Date.parse(row.timestampIso) : NaN;
    if (!Number.isFinite(ts)) continue;
    const failed = Number(row.exitCode || 0) !== 0;
    if (failed && openFailureStart == null) {
      openFailureStart = ts;
      continue;
    }
    if (!failed && openFailureStart != null) {
      const h = (ts - openFailureStart) / 3600000;
      if (h >= 0) durations.push(h);
      openFailureStart = null;
    }
  }
  return median(durations);
}

function topReasonClass(entries) {
  const fails = entries.filter((e) => Number(e.exitCode || 0) !== 0);
  const counts = {};
  for (const row of fails) {
    const c = classifyReason(row.reason);
    counts[c] = (counts[c] || 0) + 1;
  }
  return (
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null
  );
}

function appendGithubOutput(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) return;
  fs.appendFileSync(out, `${key}=${value}\n`, 'utf8');
}

function readJsonArraySafe(p) {
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function trailingCriticalCount(rows) {
  let n = 0;
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    if (String(rows[i]?.severity || '').toLowerCase() !== 'critical') break;
    n += 1;
  }
  return n;
}

function main() {
  let history;
  try {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch {
    history = { entries: [] };
  }
  const all = Array.isArray(history.entries) ? history.entries : [];
  const alerts = [];

  if (all.length >= 10) {
    const last5 = all.slice(-5);
    const prev5 = all.slice(-10, -5);
    const frLast = failRate(last5);
    const frPrev = failRate(prev5);
    if (frPrev < 0.2 && frLast >= 0.6) {
      alerts.push(`fail-rate jump: ${(frPrev * 100).toFixed(0)}% → ${(frLast * 100).toFixed(0)}% (last 5 vs prior 5)`);
    }
  }

  if (all.length >= 14) {
    const a = all.slice(-7);
    const b = all.slice(-14, -7);
    const mA = mttrHours(a);
    const mB = mttrHours(b);
    if (mB != null && mB > 0 && mA != null && mA / mB >= 2.5) {
      alerts.push(`MTTR spike: ${mB.toFixed(2)}h → ${mA.toFixed(2)}h (median last 7 vs prior 7)`);
    }
  }

  if (all.length >= 6) {
    const last3 = all.slice(-3);
    const prev3 = all.slice(-6, -3);
    const tLast = topReasonClass(last3.filter((e) => Number(e.exitCode || 0) !== 0));
    const tPrev = topReasonClass(prev3.filter((e) => Number(e.exitCode || 0) !== 0));
    if (tLast && tPrev && tLast !== tPrev) {
      alerts.push(`reason-class shift: ${tPrev} → ${tLast} (failure-heavy windows)`);
    }
  }

  const detected = alerts.length > 0;
  const alertCount = alerts.length;
  const severity = !detected ? 'none' : alertCount >= 3 ? 'critical' : alertCount === 2 ? 'warning' : 'info';
  const summary = detected ? `[${severity}] ${alerts.join(' | ')}` : 'no anomaly thresholds crossed';

  const payload = {
    generatedAt: new Date().toISOString(),
    anomalyDetected: detected,
    severity,
    alerts,
    summary,
    thresholds: {
      failRateJump: 'prev5<20% and last5>=60%',
      mttrSpike: 'last7 >= 2.5x prior7 median',
      reasonShift: 'top failure class differs last3 vs prev3',
    },
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const trend = readJsonArraySafe(trendPath);
  trend.push({
    generatedAt: payload.generatedAt,
    anomalyDetected: detected,
    severity,
    alertCount,
  });
  const criticalConsecutive = trailingCriticalCount(trend);
  payload.criticalConsecutive = criticalConsecutive;
  payload.criticalOpenThreshold = Math.max(1, Number.parseInt(String(process.env.ANOMALY_CRITICAL_OPEN_STREAK || '2'), 10) || 2);
  const max = Math.max(60, Number.parseInt(String(process.env.TREND_MAX || '180'), 10) || 180);
  const clipped = trend.length > max ? trend.slice(trend.length - max) : trend;
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(trendPath, JSON.stringify(clipped, null, 2), 'utf8');

  appendGithubOutput('anomaly_detected', detected ? 'true' : 'false');
  appendGithubOutput('anomaly_summary', summary.replace(/\n/g, ' ').slice(0, 500));
  appendGithubOutput('anomaly_severity', severity);
  appendGithubOutput('anomaly_critical_consecutive', String(criticalConsecutive));

  console.log(`[openclaw-runner-anomaly-detector] ${summary}`);
}

main();
