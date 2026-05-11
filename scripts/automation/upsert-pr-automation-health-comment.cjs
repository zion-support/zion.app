#!/usr/bin/env node
/**
 * Upsert a PR comment with latest main-branch automation-health snapshot (severity, SLO, deltas).
 * Intended for GitHub Actions on pull_request. Idempotent via HTML marker.
 *
 * Env:
 *   GITHUB_TOKEN — required
 *   GITHUB_REPOSITORY — owner/repo
 *   PR_NUMBER — pull request number
 *   GITHUB_BASE_REF — optional base ref name (default main)
 */
const { spawnSync } = require('child_process');

const MARKER = '<!-- automation-health-pr -->';

const MAIN_IMPACT_PREFIXES = [
  'app/',
  'automation/',
  'scripts/automation/',
  '.github/workflows/',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
];
const MAIN_IMPACT_FILES = new Set(['next.config.ts', 'next.config.mjs', 'next.config.js', 'tsconfig.json', 'eslint.config.mjs']);

function ghApi(method, pathUrl, bodyObj) {
  const args =
    method === 'GET' ? ['api', pathUrl] : ['api', '-X', method, pathUrl];
  if (bodyObj && method !== 'GET') {
    args.push('--input', '-');
  }
  const r = spawnSync('gh', args, {
    encoding: 'utf8',
    input: bodyObj ? JSON.stringify(bodyObj) : undefined,
    env: process.env,
  });
  if (r.status !== 0) {
    console.warn('gh api failed:', pathUrl, r.stderr || r.stdout);
    return null;
  }
  try {
    return JSON.parse(r.stdout || '{}');
  } catch {
    return r.stdout;
  }
}

function touchesMainImpact(files) {
  return files.some((f) => {
    if (MAIN_IMPACT_FILES.has(f)) return true;
    return MAIN_IMPACT_PREFIXES.some((p) => f === p || f.startsWith(p));
  });
}

function listChangedFiles(base) {
  const mergeBase = spawnSync('git', ['merge-base', `origin/${base}`, 'HEAD'], { encoding: 'utf8' });
  const mb = (mergeBase.stdout || '').trim();
  if (mergeBase.status !== 0 || !mb) {
    const r = spawnSync('git', ['diff', '--name-only', `origin/${base}...HEAD`], { encoding: 'utf8' });
    return (r.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
  }
  const r = spawnSync('git', ['diff', '--name-only', mb, 'HEAD'], { encoding: 'utf8' });
  return (r.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function readMainHealthSnapshot() {
  const r = spawnSync(
    'git',
    ['show', `origin/main:automation/reports/automation-health-latest.json`],
    { encoding: 'utf8' },
  );
  if (r.status !== 0) {
    console.warn('Could not read main snapshot:', r.stderr || r.stdout);
    return null;
  }
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

function fmtDelta(d) {
  if (d == null || Number.isNaN(Number(d))) return 'n/a';
  const n = Number(d);
  if (n > 0) return `+${n}`;
  return String(n);
}

function buildBody(snap) {
  if (!snap) {
    return `${MARKER}

### Automation health (main)
_Snapshot not available on \`main\` — run \`npm run automation:health:snapshot\` in CI or merge reports._
`;
  }
  const slo = snap.sloScore != null ? snap.sloScore : 'n/a';
  const d = fmtDelta(snap.sloDeltaFromPrevious);
  const sev = snap.severity ?? 'n/a';
  const gen = snap.generatedAt ?? 'n/a';
  return `${MARKER}

### Automation health (latest \`main\` snapshot)
| | |
|---|---|
| **Severity** | \`${sev}\` |
| **SLO score** (0–100) | **${slo}** |
| **Δ vs prior snapshot** | ${d} |
| **EMA open** | ${snap.emaOpenIncidents ?? 'n/a'} |
| **Preview unhealthy routes** | ${snap.previewUnhealthyCount ?? 'n/a'} |
| **Open FP issues** | ${snap.openFingerprintIssues ?? 'n/a'} |
| **Snapshot time** | ${gen} |

_Use this as context when changing deploy, automation, or app surfaces. Does not block merge._
`;
}

function findExistingCommentId(owner, repo, issueNumber) {
  const data = ghApi(
    'GET',
    `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`,
    null,
  );
  if (!Array.isArray(data)) return null;
  const bot = (data || []).find((c) => String(c.body || '').includes(MARKER));
  return bot ? bot.id : null;
}

function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  const base = process.env.GITHUB_BASE_REF || 'main';

  if (!token || !repo || !pr) {
    console.log('upsert-pr-automation-health-comment: skip (missing GITHUB_TOKEN, GITHUB_REPOSITORY, or PR_NUMBER)');
    process.exit(0);
  }

  const files = listChangedFiles(base);
  if (!touchesMainImpact(files)) {
    console.log('No main-impacting paths in PR; skipping comment.');
    process.exit(0);
  }

  const fetch = spawnSync('git', ['fetch', 'origin', base], { encoding: 'utf8', env: process.env });
  if (fetch.status !== 0) {
    console.warn('git fetch failed:', fetch.stderr || fetch.stdout);
  }

  const snap = readMainHealthSnapshot();
  const body = buildBody(snap);
  const [owner, name] = repo.split('/');
  const issueNumber = String(pr);
  const existingId = findExistingCommentId(owner, name, issueNumber);

  if (existingId) {
    const u = ghApi('PATCH', `/repos/${owner}/${repo}/issues/comments/${existingId}`, { body });
    if (u) console.log('Updated automation-health comment', existingId);
    else process.exit(1);
  } else {
    const c = ghApi('POST', `/repos/${owner}/${repo}/issues/${issueNumber}/comments`, { body });
    if (c) console.log('Posted automation-health comment');
    else process.exit(1);
  }
}

main();
