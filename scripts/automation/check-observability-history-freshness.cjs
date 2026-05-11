#!/usr/bin/env node
/**
 * Verify observability EMA/FP history is fresh; escalate if stale.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const HISTORY = path.join(ROOT, 'automation', 'reports', 'observability-ema-fp-history.json');
const MAX_HOURS = Math.max(1, Number(process.env.OBSERVABILITY_HISTORY_MAX_STALE_HOURS || 48));

function main() {
  let rows = [];
  try {
    rows = JSON.parse(fs.readFileSync(HISTORY, 'utf8'));
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  if (rows.length === 0) {
    console.log('observability-history-freshness: no rows yet');
    process.exit(0);
  }
  const latest = rows[rows.length - 1];
  const ts = new Date(latest.timestamp || latest.generatedAt || 0).getTime();
  if (!Number.isFinite(ts) || ts <= 0) {
    console.log('observability-history-freshness: invalid latest timestamp');
    process.exit(0);
  }
  const ageH = (Date.now() - ts) / 3600000;
  if (ageH <= MAX_HOURS) {
    console.log(`observability-history-freshness: ok (${ageH.toFixed(1)}h old)`);
    process.exit(0);
  }
  const body = [
    '## Observability history freshness breached',
    '',
    '- **Dedupe key:** `observability-history-stale`',
    `- Max age threshold: ${MAX_HOURS}h`,
    `- Latest point age: ${ageH.toFixed(1)}h`,
    `- Latest point timestamp: ${latest.timestamp || 'n/a'}`,
  ].join('\n');
  const bodyFile = path.join(ROOT, 'automation', 'reports', 'observability-history-stale-body.md');
  fs.writeFileSync(bodyFile, `${body}\n`, 'utf8');
  const r = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      ISSUE_TITLE: 'Observability EMA/FP history has gone stale',
      ISSUE_BODY_FILE: bodyFile,
      ISSUE_LABELS: 'automation,bug',
      ISSUE_FINGERPRINT: 'observability-history-stale',
      COOLDOWN_HOURS: '24',
    },
  });
  if (r.status !== 0) {
    console.warn('observability-history-freshness: escalation failed', r.stderr || r.stdout);
    process.exit(1);
  }
  console.log('observability-history-freshness: escalation ensured');
  process.exit(1);
}

main();
