#!/usr/bin/env node
/**
 * Close open GitHub issue(s) that match an automation ISSUE_FINGERPRINT label.
 * Use when a guard returns healthy so incident threads do not stay open forever.
 *
 * Env:
 *   ISSUE_FINGERPRINT (required) — same stable string used with gh-issue-dedupe-or-create.cjs
 *   CLOSE_COMMENT (optional) — defaults to recovery message
 *   DRY_RUN — if "1"/"true", only log what would be closed
 *
 * Requires: gh + GH_TOKEN or GITHUB_TOKEN
 */

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
  const comment =
    process.env.CLOSE_COMMENT ||
    'Auto-closing: guard recovered in latest run (fingerprint-matched issue).';
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());

  if (!fp) {
    console.error('gh-issue-close-on-recovery: ISSUE_FINGERPRINT is required.');
    process.exit(2);
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
    'number,title',
    '--limit',
    '50',
  ]);

  if (list.status !== 0) {
    console.error('gh issue list failed:', list.stderr || list.stdout);
    process.exit(1);
  }

  let issues;
  try {
    issues = JSON.parse(list.stdout || '[]');
  } catch {
    issues = [];
  }

  if (issues.length === 0) {
    console.log(`No open issues with label ${label}.`);
    process.exit(0);
  }

  for (const issue of issues) {
    const n = issue.number;
    if (dry) {
      console.log(`DRY_RUN: would close #${n} (${issue.title})`);
      continue;
    }
    const close = gh(['issue', 'close', String(n), '--comment', comment]);
    if (close.status !== 0) {
      console.error(`Failed to close #${n}:`, close.stderr || close.stdout);
      process.exit(1);
    }
    console.log(`Closed issue #${n}.`);
  }
}

main();
