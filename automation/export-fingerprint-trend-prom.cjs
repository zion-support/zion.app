#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Export fingerprint digest metrics to Prometheus text format.
 *
 * Inputs:
 *  - automation/reports/automation-fingerprint-incidents-latest.json
 *  - automation/reports/automation-fingerprint-incidents-trend.json
 *
 * Output:
 *  - automation/reports/automation-fingerprint-incidents-metrics.prom
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const reportsDir = path.join(root, 'automation', 'reports');
const latestPath = path.join(reportsDir, 'automation-fingerprint-incidents-latest.json');
const trendPath = path.join(reportsDir, 'automation-fingerprint-incidents-trend.json');
const outPath = path.join(reportsDir, 'automation-fingerprint-incidents-metrics.prom');

function readJsonMaybe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function severityToLevel(sev) {
  if (sev === 'critical') return 2;
  if (sev === 'warning') return 1;
  return 0;
}

function main() {
  const latest = readJsonMaybe(latestPath) || {};
  const trend = readJsonMaybe(trendPath) || {};
  const history = Array.isArray(trend.history) ? trend.history : [];
  const last = history.length ? history[history.length - 1] : {};

  const lines = [];
  lines.push('# HELP automation_fingerprint_open_incidents Open automation fingerprint incidents in latest digest.');
  lines.push('# TYPE automation_fingerprint_open_incidents gauge');
  lines.push(`automation_fingerprint_open_incidents ${Number(latest.openWithFingerprintLabel || 0)}`);
  lines.push('');
  lines.push('# HELP automation_fingerprint_delta_new New incidents in latest digest delta.');
  lines.push('# TYPE automation_fingerprint_delta_new gauge');
  lines.push(`automation_fingerprint_delta_new ${Number((latest.delta && latest.delta.newIssues && latest.delta.newIssues.length) || 0)}`);
  lines.push('');
  lines.push('# HELP automation_fingerprint_delta_resolved Resolved incidents in latest digest delta.');
  lines.push('# TYPE automation_fingerprint_delta_resolved gauge');
  lines.push(
    `automation_fingerprint_delta_resolved ${Number((latest.delta && latest.delta.resolved && latest.delta.resolved.length) || 0)}`
  );
  lines.push('');
  lines.push('# HELP automation_fingerprint_severity_level Digest severity mapped to none=0, warning=1, critical=2.');
  lines.push('# TYPE automation_fingerprint_severity_level gauge');
  lines.push(`automation_fingerprint_severity_level ${severityToLevel(latest.escalationSeverity || 'none')}`);
  lines.push('');
  lines.push('# HELP automation_fingerprint_registry_ema Suppression registry EMA value from latest digest/trend.');
  lines.push('# TYPE automation_fingerprint_registry_ema gauge');
  const ema =
    latest.registry && latest.registry.emaOpenIncidents != null
      ? Number(latest.registry.emaOpenIncidents)
      : last && last.registryEma != null
        ? Number(last.registryEma)
        : 0;
  lines.push(`automation_fingerprint_registry_ema ${Number.isFinite(ema) ? ema : 0}`);
  lines.push('');
  lines.push('# HELP automation_fingerprint_trend_rows Number of rows retained in trend history.');
  lines.push('# TYPE automation_fingerprint_trend_rows gauge');
  lines.push(`automation_fingerprint_trend_rows ${history.length}`);
  lines.push('');
  lines.push('# HELP automation_fingerprint_last_snapshot_open Last trend snapshot open count.');
  lines.push('# TYPE automation_fingerprint_last_snapshot_open gauge');
  lines.push(`automation_fingerprint_last_snapshot_open ${Number(last.open || 0)}`);

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Fingerprint metrics -> ${path.relative(root, outPath)}`);
}

main();
