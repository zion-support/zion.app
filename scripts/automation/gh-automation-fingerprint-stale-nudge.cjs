#!/usr/bin/env node
/**
 * Comment on open issues that have automation-fp-* labels and have been quiet for STALE_NUDGE_DAYS.
 * Posting a comment updates the issue, so the same issue is not nudged again until another quiet period.
 *
 * Env:
 *   STALE_NUDGE_DAYS — required; minimum days since last update before nudging (e.g. 14). If 0 or unset, exits 0.
 *   STALE_NUDGE_COOLDOWN_DAYS — optional; if set (>0), skip nudge when the last comment containing
 *     <!-- automation-fp-stale-nudge --> is newer than this many days (reduces duplicate nudges).
 *   GH_TOKEN / GITHUB_TOKEN
 *   ISSUE_LIST_LIMIT — default 200
 */

const { spawnSync } = require('child_process');

function gh(args) {
  return spawnSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
  });
}

const STALE_MARKER = '<!-- automation-fp-stale-nudge -->';

function lastStaleNudgeCommentTimeMs(issueNumber) {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) return null;
  const [owner, name] = repo.split('/');
  if (!owner || !name) return null;
  const path = `repos/${owner}/${name}/issues/${issueNumber}/comments?per_page=100`;
  const r = gh(['api', path]);
  if (r.status !== 0) {
    return null;
  }
  let comments;
  try {
    comments = JSON.parse(r.stdout || '[]');
  } catch {
    return null;
  }
  if (!Array.isArray(comments)) return null;
  let latest = 0;
  for (const c of comments) {
    if (c && typeof c.body === 'string' && c.body.includes(STALE_MARKER) && c.created_at) {
      const t = Date.parse(c.created_at);
      if (Number.isFinite(t) && t > latest) latest = t;
    }
  }
  return latest > 0 ? latest : null;
}

function main() {
  const days = parseFloat(String(process.env.STALE_NUDGE_DAYS || '0'));
  if (!Number.isFinite(days) || days <= 0) {
    console.log('gh-automation-fingerprint-stale-nudge: STALE_NUDGE_DAYS not set or 0; skipping.');
    process.exit(0);
  }

  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    console.log('No GitHub token; skipping.');
    process.exit(0);
  }

  const limit = String(process.env.ISSUE_LIST_LIMIT || '200');
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--limit',
    limit,
    '--json',
    'number,title,labels,updatedAt,url',
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

  const thresholdMs = days * 86400000;
  const cooldownDays = parseFloat(String(process.env.STALE_NUDGE_COOLDOWN_DAYS || '0'), 10);
  const cooldownMs =
    Number.isFinite(cooldownDays) && cooldownDays > 0 ? cooldownDays * 86400000 : 0;
  const now = Date.now();
  let nudged = 0;

  for (const issue of issues) {
    const fpLabels = (issue.labels || [])
      .map((l) => (typeof l === 'string' ? l : l.name))
      .filter((name) => name && name.startsWith('automation-fp-'));
    if (fpLabels.length === 0) continue;

    const updated = new Date(issue.updatedAt).getTime();
    if (!Number.isFinite(updated) || now - updated < thresholdMs) continue;

    if (cooldownMs > 0) {
      const lastNudge = lastStaleNudgeCommentTimeMs(issue.number);
      if (lastNudge != null && now - lastNudge < cooldownMs) {
        continue;
      }
    }

    const body = [
      STALE_MARKER,
      '',
      '**Stale incident nudge (automation)**',
      '',
      `This issue has an \`automation-fp-*\` label and has been quiet for **${days}+** days (by \`updatedAt\`).`,
      'If this is still actionable, add a short update; if resolved, close the issue.',
      '',
      `_Workflow: fingerprint stale nudge_`,
    ].join('\n');

    const tmp = require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'fp-nudge-'));
    const f = require('path').join(tmp, 'body.md');
    require('fs').writeFileSync(f, body);

    const comment = gh(['issue', 'comment', String(issue.number), '--body-file', f]);
    try {
      require('fs').rmSync(tmp, { recursive: true, force: true });
    } catch {
      /* ignore */
    }

    if (!comment.ok) {
      console.warn(`Comment on #${issue.number} failed:`, comment.stderr || comment.stdout);
      continue;
    }
    console.log(`Nudged #${issue.number} (${issue.title.slice(0, 60)}…)`);
    nudged++;
  }

  console.log(`Stale nudge complete: ${nudged} issue(s) commented.`);
}

main();
