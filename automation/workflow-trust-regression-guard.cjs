#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const HIST = path.join(REPORTS, 'workflow-trust-history.json');
const OUT = path.join(REPORTS, 'workflow-trust-regression-latest.json');
const FP = 'workflow-trust-regression-sustained';

const WINDOW = Math.max(3, Number(process.env.WORKFLOW_TRUST_REG_WINDOW || 6));
const DROP = Math.max(5, Number(process.env.WORKFLOW_TRUST_REG_DROP_MIN || 12));
const RECOVERY_SCORE = Math.max(65, Number(process.env.WORKFLOW_TRUST_REG_RECOVERY_MIN || 85));

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  const hist = readJson(HIST, { points: [] });
  const points = Array.isArray(hist.points) ? hist.points : [];
  if (points.length < WINDOW + 1) {
    console.log('[workflow-trust-regression] insufficient history');
    process.exit(0);
  }
  const tail = points.slice(-(WINDOW + 1));
  const start = Number(tail[0].trustScore || 0);
  const end = Number(tail[tail.length - 1].trustScore || 0);
  const delta = end - start;
  const sustainedDrop = delta <= -DROP;
  const recovering = end >= RECOVERY_SCORE && delta >= 0;

  const payload = {
    generatedAt: new Date().toISOString(),
    window: WINDOW,
    dropThreshold: DROP,
    recoveryMinScore: RECOVERY_SCORE,
    startScore: start,
    endScore: end,
    delta,
    sustainedDrop,
    recovering,
    trend: tail.map((p) => ({ at: p.generatedAt, trustScore: p.trustScore, band: p.band })),
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('[workflow-trust-regression] no token; report only');
    process.exit(0);
  }
  if (sustainedDrop) {
    const body = path.join(REPORTS, 'workflow-trust-regression-body.md');
    fs.writeFileSync(
      body,
      `## Workflow trust regression detected\n\n- Start: ${start}\n- End: ${end}\n- Delta: ${delta}\n- Window: ${WINDOW}\n`,
      'utf8',
    );
    process.env.ISSUE_TITLE = `Workflow trust regressed (${start} -> ${end})`;
    process.env.ISSUE_FINGERPRINT = FP;
    process.env.ISSUE_LABELS = 'automation,ci,automation-slo-warning';
    process.env.ISSUE_BODY_FILE = body;
    process.env.COOLDOWN_HOURS = process.env.COOLDOWN_HOURS || '12';
    spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
      cwd: ROOT,
      env: process.env,
      encoding: 'utf8',
    });
  } else if (recovering) {
    process.env.ISSUE_FINGERPRINT = FP;
    process.env.CLOSE_COMMENT = `Auto-closing: workflow trust recovered to ${end} with non-negative trend.`;
    spawnSync('node', ['scripts/automation/gh-issue-close-on-recovery.cjs'], {
      cwd: ROOT,
      env: process.env,
      encoding: 'utf8',
    });
  }
  console.log('[workflow-trust-regression] done', { sustainedDrop, recovering, delta });
}

main();
