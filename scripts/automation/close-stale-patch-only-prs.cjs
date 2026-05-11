#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Closes stale draft patch-only PRs created by automation.
 * Matches title prefix: "chore(deps): patch-only bumps (automation)".
 */
const { spawnSync } = require('child_process');

const DAYS = Math.max(1, Number.parseInt(process.env.PATCH_ONLY_STALE_DAYS || '10', 10));
const TITLE_PREFIX = 'chore(deps): patch-only bumps (automation)';

function gh(args) {
  return spawnSync('gh', args, { encoding: 'utf8', env: process.env });
}

function main() {
  const list = gh([
    'pr',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,isDraft,updatedAt,url',
    '--limit',
    '100',
  ]);

  if (list.status !== 0) {
    console.error('gh pr list failed:', list.stderr || list.stdout);
    process.exit(1);
  }

  let prs = [];
  try {
    prs = JSON.parse(list.stdout || '[]');
  } catch {
    console.error('Failed to parse gh pr list output.');
    process.exit(1);
  }

  const now = Date.now();
  const staleMs = DAYS * 24 * 3600 * 1000;
  const targets = prs.filter((pr) => {
    if (!pr || !pr.isDraft) return false;
    if (!String(pr.title || '').startsWith(TITLE_PREFIX)) return false;
    const updatedMs = new Date(pr.updatedAt).getTime();
    if (!Number.isFinite(updatedMs)) return false;
    return now - updatedMs >= staleMs;
  });

  if (targets.length === 0) {
    console.log(`No stale patch-only draft PRs older than ${DAYS} day(s).`);
    process.exit(0);
  }

  let closed = 0;
  for (const pr of targets) {
    const comment = gh([
      'pr',
      'comment',
      String(pr.number),
      '--body',
      `Auto-closing stale patch-only draft PR after ${DAYS}+ days without updates. This can be reopened or regenerated.`,
    ]);
    if (comment.status !== 0) {
      console.warn(`Failed to comment on PR #${pr.number}:`, comment.stderr || comment.stdout);
    }
    const close = gh(['pr', 'close', String(pr.number)]);
    if (close.status === 0) {
      closed += 1;
      console.log(`Closed stale patch-only draft PR #${pr.number}: ${pr.url}`);
    } else {
      console.warn(`Failed to close PR #${pr.number}:`, close.stderr || close.stdout);
    }
  }

  console.log(`Stale patch-only PR cleanup done: closed=${closed}, scanned=${prs.length}`);
}

main();
