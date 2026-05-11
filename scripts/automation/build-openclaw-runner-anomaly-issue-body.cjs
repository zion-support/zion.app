#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Build a markdown issue body for runner anomaly critical incidents.
 *
 * Env:
 *   ANOMALY_FILE — default automation/reports/openclaw-runner-anomaly-latest.json
 *   ISSUE_BODY_FILE — default automation/reports/openclaw-runner-anomaly-issue.md
 */
const fs = require('fs');
const path = require('path');

function readJsonMaybe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const root = process.cwd();
  const anomalyFile = path.isAbsolute(process.env.ANOMALY_FILE || '')
    ? process.env.ANOMALY_FILE
    : path.join(root, process.env.ANOMALY_FILE || 'automation/reports/openclaw-runner-anomaly-latest.json');
  const outFile = path.isAbsolute(process.env.ISSUE_BODY_FILE || '')
    ? process.env.ISSUE_BODY_FILE
    : path.join(root, process.env.ISSUE_BODY_FILE || 'automation/reports/openclaw-runner-anomaly-issue.md');

  const j = readJsonMaybe(anomalyFile) || {};
  const severity = String(j.severity || (j.anomalyDetected ? 'info' : 'none')).toLowerCase();
  const alerts = Array.isArray(j.alerts) ? j.alerts : [];
  const lines = [
    '## OpenClaw runner anomaly critical incident',
    '',
    `- Severity: \`${severity}\``,
    `- Anomaly detected: \`${j.anomalyDetected === true}\``,
    `- Generated at: \`${j.generatedAt || 'unknown'}\``,
    `- Critical consecutive runs: \`${Number.parseInt(String(process.env.ANOMALY_CRITICAL_CONSECUTIVE || j.criticalConsecutive || 0), 10) || 0}\``,
    '',
    '### Signals',
    '',
    ...(alerts.length ? alerts.map((a) => `- ${a}`) : ['- none']),
    '',
    '### Why this issue exists',
    '',
    '- Anomaly severity reached `critical` in bounded runner history heuristics.',
    '- This issue is fingerprint-deduped and auto-closed when severity clears.',
  ];

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
  console.log(`openclaw-runner-anomaly-issue-body -> ${outFile}`);
}

main();
