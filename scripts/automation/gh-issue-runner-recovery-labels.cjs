#!/usr/bin/env node
/**
 * Remove runner-incident severity / reason labels from open fingerprint-matched issues
 * before auto-close on recovery (keeps open-issue views clean).
 *
 * Env:
 *   ISSUE_FINGERPRINT (required) — same as gh-issue-dedupe-or-create
 *   DRY_RUN — if "1"/"true", log only
 *
 * Removes: automation-slo-warning, automation-slo-critical, and labels matching /^openclaw-runner-reason-/
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

const STATIC_REMOVE = ['automation-slo-warning', 'automation-slo-critical'];

function labelsToRemoveFromIssue(labelsJson) {
  const names = (labelsJson || []).map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean);
  const out = new Set(STATIC_REMOVE.filter((s) => names.includes(s)));
  for (const n of names) {
    if (/^openclaw-runner-reason-/.test(n)) out.add(n);
  }
  return [...out];
}

function main() {
  const fp = process.env.ISSUE_FINGERPRINT;
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());

  if (!fp) {
    console.error('gh-issue-runner-recovery-labels: ISSUE_FINGERPRINT is required.');
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
    console.log(`No open issues with label ${label}; nothing to strip.`);
    process.exit(0);
  }

  for (const issue of issues) {
    const n = issue.number;
    const view = gh(['issue', 'view', String(n), '--json', 'labels']);
    if (view.status !== 0) {
      console.warn(`issue view failed #${n}:`, view.stderr);
      continue;
    }
    let labels;
    try {
      labels = JSON.parse(view.stdout || '{}').labels;
    } catch {
      labels = [];
    }
    const remove = labelsToRemoveFromIssue(labels);
    if (remove.length === 0) {
      console.log(`#${n}: no runner severity/reason labels to remove.`);
      continue;
    }
    if (dry) {
      console.log(`DRY_RUN: would remove from #${n}: ${remove.join(', ')}`);
      continue;
    }
    const args = ['issue', 'edit', String(n)];
    for (const l of remove) {
      args.push('--remove-label', l);
    }
    const ed = gh(args);
    if (ed.status !== 0) {
      console.warn(`gh issue edit remove-label failed #${n}:`, ed.stderr || ed.stdout);
      continue;
    }
    console.log(`Removed labels from #${n}: ${remove.join(', ')}`);
  }
}

main();
