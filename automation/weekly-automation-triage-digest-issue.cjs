#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Opens/updates deduped GitHub issue with weekly triage digest markdown.
 * Requires: weekly-automation-triage-digest-latest.md (from weekly-automation-triage-digest.cjs)
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   WEEKLY_TRIAGE_DIGEST_DRY_RUN (alias: RELEASE_RISK_TRIAGE_DIGEST_DRY_RUN)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const BODY = path.join(REPORTS, 'weekly-automation-triage-digest-latest.md');
const FP = 'weekly-automation-triage-digest';

const DRY = ['1', 'true', 'yes'].includes(
  String(
    process.env.WEEKLY_TRIAGE_DIGEST_DRY_RUN || process.env.RELEASE_RISK_TRIAGE_DIGEST_DRY_RUN || '',
  ).toLowerCase(),
);

function main() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token && !DRY) {
    console.log('[weekly-triage-digest-issue] no token; skip.');
    process.exit(0);
  }

  if (!fs.existsSync(BODY)) {
    console.log('[weekly-triage-digest-issue] no markdown body; skip.');
    process.exit(0);
  }

  if (DRY) {
    console.log('[weekly-triage-digest-issue] DRY_RUN: would upsert issue for', FP);
    process.exit(0);
  }

  process.env.ISSUE_TITLE = process.env.ISSUE_TITLE || 'Weekly automation triage digest';
  process.env.ISSUE_FINGERPRINT = FP;
  process.env.ISSUE_LABELS = process.env.ISSUE_LABELS || 'automation,automation-digest';
  process.env.ISSUE_BODY_FILE = BODY;
  process.env.COOLDOWN_HOURS = process.env.COOLDOWN_HOURS || '0';

  const r = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    encoding: 'utf8',
    env: process.env,
    cwd: ROOT,
  });
  if (r.status !== 0) console.warn('[weekly-triage-digest-issue]', r.stderr || r.stdout);
  else console.log('[weekly-triage-digest-issue] done.');
}

main();
