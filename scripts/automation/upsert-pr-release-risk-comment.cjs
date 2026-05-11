#!/usr/bin/env node
/**
 * Upsert PR comment with release risk score from main (marker-based).
 */
const { spawnSync } = require('child_process');

const MARKER = '<!-- release-risk-pr -->';
const MAIN_IMPACT_PREFIXES = ['automation/', 'scripts/automation/', '.github/workflows/', 'app/'];
const MAIN_IMPACT_FILES = new Set(['package.json', 'package-lock.json', 'tsconfig.json', 'eslint.config.mjs']);

function ghApi(method, pathUrl, bodyObj) {
  const args = method === 'GET' ? ['api', pathUrl] : ['api', '-X', method, pathUrl];
  if (bodyObj && method !== 'GET') args.push('--input', '-');
  const r = spawnSync('gh', args, {
    encoding: 'utf8',
    input: bodyObj ? JSON.stringify(bodyObj) : undefined,
    env: process.env,
  });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout || '{}');
  } catch {
    return r.stdout;
  }
}

function listChangedFiles(base) {
  const m = spawnSync('git', ['merge-base', `origin/${base}`, 'HEAD'], { encoding: 'utf8' });
  const mb = (m.stdout || '').trim();
  const cmd = mb ? ['diff', '--name-only', mb, 'HEAD'] : ['diff', '--name-only', `origin/${base}...HEAD`];
  const r = spawnSync('git', cmd, { encoding: 'utf8' });
  return (r.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function touchesMainImpact(files) {
  return files.some((f) => MAIN_IMPACT_FILES.has(f) || MAIN_IMPACT_PREFIXES.some((p) => f === p || f.startsWith(p)));
}

function readMainJson(filePath) {
  const r = spawnSync('git', ['show', `origin/main:${filePath}`], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

function findExistingCommentId(owner, repo, issueNumber) {
  const data = ghApi('GET', `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`, null);
  if (!Array.isArray(data)) return null;
  const bot = data.find((c) => String(c.body || '').includes(MARKER));
  return bot ? bot.id : null;
}

function buildBody(snap) {
  if (!snap) {
    return `${MARKER}

### Release risk (main)
No \`release-risk-score-latest.json\` on \`main\` yet.
`;
  }
  const c = snap.components || {};
  return `${MARKER}

### Release risk (latest \`main\`)
| | |
|---|---|
| **riskScore** | **${snap.riskScore ?? 'n/a'}** / ${snap.band ?? 'n/a'} |
| **healthScore** | ${snap.healthScore ?? 'n/a'} |
| **Components** | reg ${c.regression ?? '—'} · route ${c.routeDrift ?? '—'} · smoke ${c.smoke ?? '—'} |
| **Smoke streak** | ${snap.detail?.smokeStreak ?? 'n/a'} |
| **Snapshot** | ${snap.generatedAt ?? 'n/a'} |
`;
}

function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  const base = process.env.GITHUB_BASE_REF || 'main';
  if (!token || !repo || !pr) return;

  const files = listChangedFiles(base);
  if (!touchesMainImpact(files)) return;

  spawnSync('git', ['fetch', 'origin', base], { encoding: 'utf8', env: process.env });
  const snap = readMainJson('automation/reports/release-risk-score-latest.json');
  const body = buildBody(snap);
  const [owner, name] = repo.split('/');
  const existingId = findExistingCommentId(owner, name, String(pr));
  if (existingId) {
    ghApi('PATCH', `/repos/${owner}/${name}/issues/comments/${existingId}`, { body });
  } else {
    ghApi('POST', `/repos/${owner}/${name}/issues/${pr}/comments`, { body });
  }
}

main();
