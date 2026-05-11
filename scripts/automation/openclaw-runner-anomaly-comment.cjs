#!/usr/bin/env node
/**
 * If anomaly file reports detection, comment on open fingerprint runner incident.
 *
 * Env:
 *   ISSUE_FINGERPRINT (required)
 *   ANOMALY_FILE — default automation/reports/openclaw-runner-anomaly-latest.json
 *   DRY_RUN
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function gh(args) {
  return spawnSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
  });
}

function fingerprintLabel(fp) {
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function main() {
  const fp = process.env.ISSUE_FINGERPRINT;
  const anomalyPath =
    process.env.ANOMALY_FILE || path.join(process.cwd(), 'automation', 'reports', 'openclaw-runner-anomaly-latest.json');
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());

  if (!fp) {
    console.error('openclaw-runner-anomaly-comment: ISSUE_FINGERPRINT is required.');
    process.exit(2);
  }

  let j;
  try {
    j = JSON.parse(fs.readFileSync(anomalyPath, 'utf8'));
  } catch {
    console.log('No anomaly file; skip.');
    process.exit(0);
  }

  if (!j.anomalyDetected || !Array.isArray(j.alerts) || j.alerts.length === 0) {
    console.log('No anomaly; skip comment.');
    process.exit(0);
  }

  const label = fingerprintLabel(fp);
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    label,
    '--json',
    'number',
    '--limit',
    '1',
  ]);
  if (list.status !== 0) {
    console.warn('issue list failed:', list.stderr);
    process.exit(0);
  }
  let issues;
  try {
    issues = JSON.parse(list.stdout || '[]');
  } catch {
    issues = [];
  }
  const num = issues[0]?.number;
  if (!num) {
    console.log('No open fingerprint issue; skip anomaly comment.');
    process.exit(0);
  }

  const body = [
    '### OpenClaw runner anomaly detector',
    '',
    'Heuristic signals (bounded history):',
    ...j.alerts.map((a) => `- ${a}`),
    '',
    `_Generated: ${j.generatedAt || 'unknown'}_`,
  ].join('\n');

  if (dry) {
    console.log(`DRY_RUN: would comment on #${num}`);
    process.exit(0);
  }

  const tmp = path.join(require('os').tmpdir(), `runner-anomaly-${process.pid}.md`);
  fs.writeFileSync(tmp, body, 'utf8');
  const c = gh(['issue', 'comment', String(num), '--body-file', tmp]);
  try {
    fs.unlinkSync(tmp);
  } catch {
    /* ignore */
  }
  if (c.status !== 0) {
    console.warn('issue comment failed:', c.stderr || c.stdout);
    process.exit(0);
  }
  console.log(`Posted anomaly comment on #${num}.`);
}

main();
