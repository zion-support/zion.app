#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const MARKER = '<!-- zion-ai-lab-route-contract-comment -->';
const STREAK_MARKER = '<!-- zion-ai-lab-route-contract-green-streak:';
const TOOLS_TS = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const PAGES = path.join(ROOT, 'automation', 'data', 'pages-to-visit.json');
const SMOKE = path.join(ROOT, 'config', 'smoke-routes.txt');

function ghApiJson(args) {
  const r = spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8', env: process.env });
  if (r.status !== 0) return { ok: false, err: r.stderr || r.stdout };
  try {
    return { ok: true, data: JSON.parse(r.stdout || '[]') };
  } catch {
    return { ok: true, data: r.stdout || '' };
  }
}

function extractToolHrefs() {
  const text = fs.readFileSync(TOOLS_TS, 'utf8');
  const out = new Set();
  const re = /href:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1].startsWith('/ai-lab/')) out.add(m[1]);
  }
  return out;
}

function loadPagesAiLab() {
  const j = JSON.parse(fs.readFileSync(PAGES, 'utf8'));
  const ai = Array.isArray(j.aiLab) ? j.aiLab : [];
  return new Set(ai.map((x) => x.path).filter(Boolean));
}

function loadSmokeRoutes() {
  const raw = fs.readFileSync(SMOKE, 'utf8');
  return new Set(
    raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#')),
  );
}

function main() {
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  const repoFull = process.env.GITHUB_REPOSITORY;
  const contractOk = String(process.env.CONTRACT_OK || '').toLowerCase() === 'true';
  const cleanupThreshold = Math.max(2, Number(process.env.CONTRACT_GREEN_STREAK_DELETE || 3));
  if (!pr || !repoFull || !repoFull.includes('/')) {
    console.error('upsert-pr-ai-lab-contract-comment: PR_NUMBER/GITHUB_REPOSITORY required');
    process.exit(2);
  }
  const [owner, repo] = repoFull.split('/');

  const tools = extractToolHrefs();
  const pages = loadPagesAiLab();
  const smoke = loadSmokeRoutes();
  const onlyTools = [...tools].filter((x) => !pages.has(x)).sort();
  const onlyPages = [...pages].filter((x) => !tools.has(x)).sort();
  const missingSmoke = [...tools].filter((x) => !smoke.has(x)).sort();

  const lines = [
    '### AI Lab route contract (CI)',
    '',
    `- Result: **${contractOk ? 'pass' : 'fail'}**`,
    `- Tool hrefs: ${tools.size}`,
    `- pages-to-visit.aiLab: ${pages.size}`,
    `- Missing in smoke routes: ${missingSmoke.length}`,
  ];
  if (onlyTools.length || onlyPages.length || missingSmoke.length) {
    lines.push('', '#### Drift details');
    if (onlyTools.length) lines.push(`- In tools only: ${onlyTools.slice(0, 10).join(', ')}`);
    if (onlyPages.length) lines.push(`- In pages only: ${onlyPages.slice(0, 10).join(', ')}`);
    if (missingSmoke.length) lines.push(`- Missing smoke routes: ${missingSmoke.slice(0, 10).join(', ')}`);
  }
  lines.push('', MARKER);
  const body = lines.join('\n');
  const tmp = path.join(ROOT, '.ai-lab-contract-pr-comment.json');

  const list = ghApiJson(['api', '-F', 'per_page=100', `repos/${owner}/${repo}/issues/${pr}/comments`]);
  const existing =
    list.ok && Array.isArray(list.data)
      ? list.data.find((c) => typeof c.body === 'string' && c.body.includes(MARKER))
      : null;
  const prevBody = typeof existing?.body === 'string' ? existing.body : '';
  const m = prevBody.match(/zion-ai-lab-route-contract-green-streak:(\d+)/);
  const prevStreak = m ? Number(m[1]) : 0;
  const nextStreak = contractOk && missingSmoke.length === 0 && onlyTools.length === 0 && onlyPages.length === 0 ? prevStreak + 1 : 0;

  if (existing && nextStreak >= cleanupThreshold) {
    const del = spawnSync('gh', ['api', '-X', 'DELETE', `repos/${owner}/${repo}/issues/comments/${existing.id}`], {
      cwd: ROOT,
      encoding: 'utf8',
      env: process.env,
    });
    if (del.status !== 0) {
      console.error(del.stderr || del.stdout || 'failed to delete cleanup comment');
      process.exit(1);
    }
    console.log(`Deleted AI Lab route contract comment on PR #${pr} after ${nextStreak} green runs`);
    return;
  }

  const streakBody = `${body}\n${STREAK_MARKER}${nextStreak} -->`;
  fs.writeFileSync(tmp, JSON.stringify({ body: streakBody }));
  const r = existing
    ? spawnSync('gh', ['api', '-X', 'PATCH', `repos/${owner}/${repo}/issues/comments/${existing.id}`, '--input', tmp], {
        cwd: ROOT,
        encoding: 'utf8',
        env: process.env,
      })
    : spawnSync('gh', ['api', '-X', 'POST', `repos/${owner}/${repo}/issues/${pr}/comments`, '--input', tmp], {
        cwd: ROOT,
        encoding: 'utf8',
        env: process.env,
      });
  try {
    fs.unlinkSync(tmp);
  } catch {
    // ignore
  }
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || 'failed to upsert PR comment');
    process.exit(1);
  }
  console.log(`${existing ? 'Updated' : 'Created'} AI Lab route contract comment on PR #${pr} (green streak=${nextStreak})`);
}

main();
