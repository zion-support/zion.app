#!/usr/bin/env node
/**
 * Upsert PR comment summarizing aggregate regression diff status from main.
 * Marker-based and idempotent.
 */
const { spawnSync } = require('child_process');

const MARKER = '<!-- aggregate-regression-diff-pr -->';
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

function ensureLabels(owner, repo, labels) {
  for (const name of labels) {
    spawnSync(
      'gh',
      ['label', 'create', name, '--color', '5319E7', '--description', 'Automation aggregate regression diff', '--repo', `${owner}/${repo}`],
      { encoding: 'utf8', env: process.env },
    );
  }
}

function ghPrRemoveLabel(owner, repo, prNum, label) {
  spawnSync(
    'gh',
    ['pr', 'edit', String(prNum), '--repo', `${owner}/${repo}`, '--remove-label', label],
    { encoding: 'utf8', env: process.env },
  );
}

function ghPrAddLabel(owner, repo, prNum, label) {
  const r = spawnSync(
    'gh',
    ['pr', 'edit', String(prNum), '--repo', `${owner}/${repo}`, '--add-label', label],
    { encoding: 'utf8', env: process.env },
  );
  if (r.status !== 0) {
    console.warn('gh pr add-label', label, r.stderr || r.stdout);
  }
}

function applyRegressionLabels(owner, repo, prNum, diff) {
  if (!diff || diff.skipped) return;
  const worsened = Boolean(diff.worsened);
  const recovered = Boolean(diff.recovered);
  const labels = ['automation-regression-worsened', 'automation-regression-recovered'];
  ensureLabels(owner, repo, labels);
  ghPrRemoveLabel(owner, repo, prNum, 'automation-regression-worsened');
  ghPrRemoveLabel(owner, repo, prNum, 'automation-regression-recovered');
  if (worsened) ghPrAddLabel(owner, repo, prNum, 'automation-regression-worsened');
  else if (recovered) ghPrAddLabel(owner, repo, prNum, 'automation-regression-recovered');
}

function buildBody(diff, history) {
  if (!diff) {
    return `${MARKER}

### Aggregate Regression Diff (main)
Snapshot not available on \`main\` yet.
`;
  }
  const worsened = diff.worsened ? 'yes' : 'no';
  const recovered = diff.recovered ? 'yes' : 'no';
  const cur = diff.current || {};
  const deltas = diff.deltas || {};
  const points = Array.isArray(history && history.points) ? history.points : [];
  const tail = points.slice(-8).map((p) => (p.worsened ? '!' : p.recovered ? 'r' : '.')).join('');
  const newTypes = Array.isArray(deltas.newAlertTypes) && deltas.newAlertTypes.length
    ? deltas.newAlertTypes.map((x) => `\`${x}\``).join(', ')
    : 'none';
  return `${MARKER}

### Aggregate Regression Diff (latest \`main\`)
| | |
|---|---|
| **Worsened** | **${worsened}** |
| **Recovered** | ${recovered} |
| **Current alertCount** | ${cur.alertCount ?? 'n/a'} |
| **Alert delta** | ${deltas.alertCount ?? 'n/a'} |
| **New alert types** | ${newTypes} |
| **Summary status** | \`${cur.summaryStatus ?? 'unknown'}\` |
| **Snapshot time** | ${diff.generatedAt ?? 'n/a'} |

Recent trend (oldest→newest): \`${tail || 'n/a'}\`  
Legend: \`!\` worsened, \`r\` recovered, \`.\` stable.
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
  const diff = readMainJson('automation/reports/aggregate-regression-diff-latest.json');
  const hist = readMainJson('automation/reports/aggregate-regression-diff-history.json');
  const body = buildBody(diff, hist);
  const [owner, name] = repo.split('/');
  const existingId = findExistingCommentId(owner, name, String(pr));
  if (existingId) {
    ghApi('PATCH', `/repos/${owner}/${name}/issues/comments/${existingId}`, { body });
  } else {
    ghApi('POST', `/repos/${owner}/${name}/issues/${pr}/comments`, { body });
  }
  applyRegressionLabels(owner, name, pr, diff);
}

main();
