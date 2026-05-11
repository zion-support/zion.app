#!/usr/bin/env node
/**
 * Upsert one consolidated PR comment with:
 * - automation health snapshot from main
 * - derived automation risk label rationale for this PR
 * - release risk snapshot from main
 */
const { spawnSync } = require('child_process');

const MARKER = '<!-- automation-pr-context -->';

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
  const args = method === 'GET' ? ['api', pathUrl] : ['api', '-X', method, pathUrl];
  if (bodyObj && method !== 'GET') args.push('--input', '-');
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

function listChangedFiles(base) {
  const mergeBase = spawnSync('git', ['merge-base', `origin/${base}`, 'HEAD'], { encoding: 'utf8' });
  const mb = (mergeBase.stdout || '').trim();
  const diffArgs = mb ? ['diff', '--name-only', mb, 'HEAD'] : ['diff', '--name-only', `origin/${base}...HEAD`];
  const r = spawnSync('git', diffArgs, { encoding: 'utf8' });
  return (r.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function touchesMainImpact(files) {
  return files.some((f) => MAIN_IMPACT_FILES.has(f) || MAIN_IMPACT_PREFIXES.some((p) => f === p || f.startsWith(p)));
}

function readMainJson(base, filePath) {
  const r = spawnSync('git', ['show', `origin/${base}:${filePath}`], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

function sloSparkline(history) {
  const points = Array.isArray(history?.points) ? history.points : [];
  const vals = points
    .slice(-10)
    .map((p) => Number(p?.sloScore))
    .filter((n) => Number.isFinite(n));
  if (!vals.length) return 'n/a';
  const max = Math.max(...vals, 1);
  return vals
    .map((v) => {
      const ratio = v / max;
      if (ratio < 0.2) return '.';
      if (ratio < 0.4) return ':';
      if (ratio < 0.6) return '*';
      if (ratio < 0.8) return 'o';
      return '#';
    })
    .join('');
}

function releaseRiskTrendTail(history) {
  const points = Array.isArray(history?.points) ? history.points : [];
  if (points.length < 2) return 'n/a';
  const out = [];
  const tail = points.slice(-10);
  for (let i = 1; i < tail.length; i += 1) {
    const d = Number(tail[i].riskScore || 0) - Number(tail[i - 1].riskScore || 0);
    if (!Number.isFinite(d)) out.push('?');
    else if (d >= 3) out.push('!');
    else if (d > 0) out.push('+');
    else if (d < 0) out.push('v');
    else out.push('.');
  }
  return out.join('');
}

function findExistingCommentId(owner, repo, issueNumber) {
  const data = ghApi('GET', `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`, null);
  if (!Array.isArray(data)) return null;
  const existing = data.find((c) => String(c.body || '').includes(MARKER));
  return existing ? existing.id : null;
}

function scoreRisk(files, health) {
  let score = 0;
  const reasons = [];
  const sev = String(health?.severity || '');
  if (sev === 'critical') {
    score += 45;
    reasons.push('main automation health critical');
  } else if (sev === 'warning') {
    score += 25;
    reasons.push('main automation health warning');
  }

  const workflowCount = files.filter((f) => f.startsWith('.github/workflows/')).length;
  const automationCount = files.filter((f) => f.startsWith('automation/') || f.startsWith('scripts/automation/')).length;
  const appCount = files.filter((f) => f.startsWith('app/')).length;
  if (workflowCount > 0) score += 18;
  if (automationCount > 0) score += 16;
  if (appCount > 0) score += 10;
  if (files.length >= 35) score += 14;
  else if (files.length >= 15) score += 8;
  if (workflowCount > 0) reasons.push('workflow changes');
  if (automationCount > 0) reasons.push('automation changes');
  if (appCount > 0) reasons.push('app changes');
  if (files.length >= 15) reasons.push(`files=${files.length}`);

  if (score >= 60) return { label: 'automation-risk-high', score, reasons };
  if (score >= 28) return { label: 'automation-risk-medium', score, reasons };
  return { label: 'automation-risk-low', score, reasons };
}

function fmtDelta(d) {
  if (d == null || Number.isNaN(Number(d))) return 'n/a';
  const n = Number(d);
  if (n > 0) return `+${n}`;
  return String(n);
}

function buildBody({ health, healthHistory, releaseRisk, releaseRiskHistory, risk, filesChanged }) {
  const healthSlo = health?.sloScore ?? 'n/a';
  const healthDelta = fmtDelta(health?.sloDeltaFromPrevious);
  const healthSev = health?.severity ?? 'n/a';
  const healthAt = health?.generatedAt ?? 'n/a';
  const healthSloSpark = sloSparkline(healthHistory);

  const rrComp = releaseRisk?.components || {};
  const rrScore = releaseRisk?.riskScore ?? 'n/a';
  const rrBand = releaseRisk?.band ?? 'n/a';
  const rrHealth = releaseRisk?.healthScore ?? 'n/a';
  const rrAt = releaseRisk?.generatedAt ?? 'n/a';
  const rrTrend = releaseRiskTrendTail(releaseRiskHistory);

  return `${MARKER}

### PR automation context (latest \`main\` baselines)
| | |
|---|---|
| **Automation health severity** | \`${healthSev}\` |
| **Automation health SLO** | **${healthSlo}** (Δ ${healthDelta}) |
| **Automation health trend (10)** | \`${healthSloSpark}\` |
| **Automation risk label (derived)** | \`${risk.label}\` (score **${risk.score}**) |
| **Automation risk signals** | ${risk.reasons.length ? risk.reasons.join('; ') : 'baseline'} |
| **Release risk** | **${rrScore}** / ${rrBand} (health ${rrHealth}) |
| **Release risk components** | reg ${rrComp.regression ?? '—'} · route ${rrComp.routeDrift ?? '—'} · smoke ${rrComp.smoke ?? '—'} |
| **Release risk trend (10)** | \`${rrTrend}\` (\`!\` strong up, \`+\` up, \`.\` flat, \`v\` down) |
| **Files changed in PR** | ${filesChanged} |
| **Snapshots** | health ${healthAt} · release ${rrAt} |

_Advisory context only; this does not block merge._
`;
}

function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.PR_NUMBER || process.env.GITHUB_PR_NUMBER;
  const base = process.env.GITHUB_BASE_REF || 'main';
  if (!token || !repo || !pr) {
    console.log('upsert-pr-automation-context-comment: skip (missing env)');
    process.exit(0);
  }

  const fetch = spawnSync('git', ['fetch', 'origin', base], { encoding: 'utf8', env: process.env });
  if (fetch.status !== 0) console.warn('git fetch failed:', fetch.stderr || fetch.stdout);

  const files = listChangedFiles(base);
  if (!touchesMainImpact(files)) {
    console.log('No main-impacting paths in PR; skipping context comment.');
    process.exit(0);
  }

  const health = readMainJson(base, 'automation/reports/automation-health-latest.json');
  const healthHistory = readMainJson(base, 'automation/reports/automation-health-history.json');
  const releaseRisk = readMainJson(base, 'automation/reports/release-risk-score-latest.json');
  const releaseRiskHistory = readMainJson(base, 'automation/reports/release-risk-history.json');
  const risk = scoreRisk(files, health);
  const body = buildBody({
    health,
    healthHistory,
    releaseRisk,
    releaseRiskHistory,
    risk,
    filesChanged: files.length,
  });

  const [owner, name] = repo.split('/');
  const issueNumber = String(pr);
  const existingId = findExistingCommentId(owner, name, issueNumber);
  if (existingId) {
    const ok = ghApi('PATCH', `/repos/${owner}/${name}/issues/comments/${existingId}`, { body });
    if (!ok) process.exit(1);
    console.log('Updated consolidated automation context comment', existingId);
    return;
  }
  const created = ghApi('POST', `/repos/${owner}/${name}/issues/${issueNumber}/comments`, { body });
  if (!created) process.exit(1);
  console.log('Posted consolidated automation context comment');
}

main();
