#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Post or update a single PM2 drift summary comment on a PR (stable marker).
 *
 * Env:
 *   PR_NUMBER — required
 *   GITHUB_REPOSITORY — owner/repo
 *   GITHUB_TOKEN or GH_TOKEN
 *
 * Marker: <!-- zion-pm2-drift-guard-automation --> (do not remove; used for upsert)
 *
 * Reads: automation/reports/pm2-config-drift-guard-latest.json
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'pm2-config-drift-guard-latest.json');
const MARKER = '<!-- zion-pm2-drift-guard-automation -->';

function readReport() {
  try {
    if (!fs.existsSync(REPORT)) return null;
    return JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  } catch {
    return null;
  }
}

function ghApiJson(args) {
  const res = spawnSync('gh', args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: process.env,
  });
  if (res.status !== 0) {
    return { ok: false, err: res.stderr || res.stdout };
  }
  try {
    return { ok: true, data: JSON.parse(res.stdout || '[]') };
  } catch {
    return { ok: true, data: res.stdout };
  }
}

function findExistingCommentId(owner, repo, prNum) {
  const pathArg = `repos/${owner}/${repo}/issues/${prNum}/comments`;
  const res = ghApiJson(['api', '-F', 'per_page=100', pathArg]);
  if (!res.ok || !Array.isArray(res.data)) return null;
  const hit = res.data.find((c) => typeof c.body === 'string' && c.body.includes(MARKER));
  return hit ? hit.id : null;
}

function main() {
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!pr) {
    console.error('ai-pm2-pr-drift-comment: PR_NUMBER missing');
    process.exit(2);
  }
  if (!repoFull || !repoFull.includes('/')) {
    console.error('ai-pm2-pr-drift-comment: GITHUB_REPOSITORY missing');
    process.exit(2);
  }

  const [owner, repo] = repoFull.split('/');

  const r = readReport();
  const lines = ['### PM2 config drift guard (CI)', ''];
  if (!r) {
    lines.push('_No drift report found — drift guard may not have run._');
  } else {
    const n = Number(r.driftCount || 0);
    lines.push(`**Drift count:** ${n}`);
    if (n > 0) {
      lines.push('');
      lines.push('Align `package.json` PM2 scripts with `ecosystem.config.cjs` app names before merge.');
    } else {
      lines.push('');
      lines.push('No npm/ecosystem PM2 drift detected in this run.');
    }
  }

  const body = `${lines.join('\n')}\n\n${MARKER}`;
  const tmpJson = path.join(ROOT, '.pm2-drift-pr-comment.json');
  fs.writeFileSync(tmpJson, JSON.stringify({ body }));

  const existingId = findExistingCommentId(owner, repo, pr);
  let res;
  if (existingId) {
    res = spawnSync(
      'gh',
      ['api', '-X', 'PATCH', `repos/${owner}/${repo}/issues/comments/${existingId}`, '--input', tmpJson],
      { cwd: ROOT, encoding: 'utf8', env: process.env },
    );
  } else {
    res = spawnSync(
      'gh',
      ['api', '-X', 'POST', `repos/${owner}/${repo}/issues/${pr}/comments`, '--input', tmpJson],
      { cwd: ROOT, encoding: 'utf8', env: process.env },
    );
  }

  try {
    fs.unlinkSync(tmpJson);
  } catch {
    /* ignore */
  }

  if (res.status !== 0) {
    console.error(res.stderr || res.stdout || 'gh api comment failed');
    process.exit(1);
  }
  console.log(`${existingId ? 'Updated' : 'Created'} PM2 drift comment on PR #${pr}`);
}

main();
