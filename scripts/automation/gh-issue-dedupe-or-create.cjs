#!/usr/bin/env node
/**
 * Reusable GitHub issue dedupe for autonomous workflows.
 *
 * Env:
 *   ISSUE_TITLE        - Stable exact title for dedupe (required)
 *   ISSUE_BODY_FILE    - Path to body markdown file (required)
 *   ISSUE_LABEL        - Label for new issues (default: bug)
 *   ISSUE_LABELS       - Comma-separated labels (e.g. bug,automation)
 *   ISSUE_FINGERPRINT  - Stable string; adds label automation-fp-<sha12> and matches open issues with that label first
 *   COOLDOWN_HOURS     - If matching issue was updated within this many hours, skip comment/create (default: 0)
 *   SKIP_IF_OPEN       - If "1" or "true", skip create+comment when a matching open issue exists (default: false)
 *   ISSUE_LIST_LIMIT   - Max open issues to scan for title match (default: 200)
 *   ISSUE_NO_CORRELATION - If "1"/"true", do not prepend Actions correlation block to body
 *   ISSUE_APPEND_REGISTRY_CORRELATION - If "0"/"false"/"no", skip footer from incident-suppression-registry-latest.json (default: append when file exists)
 *
 * GitHub Actions output (when GITHUB_OUTPUT is set):
 *   dedupe_result — commented | created | skipped_cooldown | skipped_open
 *   issue_number — issue touched or skipped (when applicable)
 *
 * When GITHUB_RUN_ID or GITHUB_SHA is set (Actions), prepends a short correlation block to the body.
 * When ISSUE_FINGERPRINT is set, adds label `automation-incident` for cross-filtering.
 *
 * Requires: gh CLI + GITHUB_TOKEN or GH_TOKEN in env (GitHub Actions sets these).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function gh(args, input) {
  const res = spawnSync('gh', args, {
    encoding: 'utf8',
    input: input || undefined,
    env: process.env,
  });
  return {
    ok: res.status === 0,
    status: res.status,
    stdout: (res.stdout || '').trim(),
    stderr: (res.stderr || '').trim(),
  };
}

function parseLabels() {
  const raw = process.env.ISSUE_LABEL || process.env.ISSUE_LABELS || 'bug';
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function fingerprintLabelName() {
  const fp = process.env.ISSUE_FINGERPRINT;
  if (!fp) return null;
  const hash = crypto.createHash('sha256').update(String(fp)).digest('hex').slice(0, 12);
  return `automation-fp-${hash}`;
}

function ensureFingerprintLabel(labelName) {
  const r = gh([
    'label',
    'create',
    labelName,
    '--color',
    'ededed',
    '--description',
    'Automation issue dedupe fingerprint',
  ]);
  if (!r.ok && !/already exists/i.test(r.stderr)) {
    console.warn('gh label create (non-fatal):', r.stderr || r.stdout);
  }
}

function ensureAutomationIncidentLabel() {
  const r = gh([
    'label',
    'create',
    'automation-incident',
    '--color',
    'FBCA04',
    '--description',
    'Autonomous workflow incident (fingerprint dedupe)',
  ]);
  if (!r.ok && !/already exists/i.test(r.stderr)) {
    console.warn('gh label create automation-incident (non-fatal):', r.stderr || r.stdout);
  }
}

function buildCorrelationBlock() {
  if (['1', 'true', 'yes'].includes(String(process.env.ISSUE_NO_CORRELATION || '').toLowerCase())) {
    return '';
  }
  const runId = process.env.GITHUB_RUN_ID;
  const sha = process.env.GITHUB_SHA;
  if (!runId && !sha) {
    return '';
  }
  const repo = process.env.GITHUB_REPOSITORY || '';
  const server = (process.env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, '');
  const registryCorrelationId = readRegistryCorrelationId();
  const explicitCorrelationId = (process.env.ISSUE_CORRELATION_ID || '').trim();
  const correlationId = explicitCorrelationId || registryCorrelationId;
  const lines = ['### Correlation', ''];
  if (runId && repo) {
    lines.push(`- **Actions run:** ${server}/${repo}/actions/runs/${runId}`);
  }
  if (sha) {
    lines.push(`- **Commit:** \`${sha.slice(0, 7)}\` (full \`${sha}\`)`);
  }
  if (process.env.GITHUB_WORKFLOW) {
    lines.push(`- **Workflow:** \`${process.env.GITHUB_WORKFLOW}\``);
  }
  if (process.env.GITHUB_REF) {
    lines.push(`- **Ref:** \`${process.env.GITHUB_REF}\``);
  }
  if (correlationId) {
    lines.push(`- **Correlation ID:** \`${correlationId}\``);
  }
  lines.push('');
  return lines.join('\n');
}

function readRegistryCorrelationId() {
  const p = path.join(process.cwd(), 'automation', 'reports', 'incident-suppression-registry-latest.json');
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return String(j?.correlation?.correlationId || '').trim();
  } catch {
    return '';
  }
}

function findIssueByLabel(labelName) {
  const res = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    labelName,
    '--json',
    'number,title,updatedAt',
    '--limit',
    '50',
  ]);
  if (!res.ok) {
    console.error('gh issue list by label failed:', res.stderr);
    return null;
  }
  try {
    const arr = JSON.parse(res.stdout || '[]');
    return arr[0] || null;
  } catch {
    return null;
  }
}

function shouldAppendRegistryCorrelation() {
  const v = String(process.env.ISSUE_APPEND_REGISTRY_CORRELATION ?? '1').toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(v);
}

function readRegistryCorrelationMd() {
  if (!shouldAppendRegistryCorrelation()) {
    return '';
  }
  const p = path.join(process.cwd(), 'automation', 'reports', 'incident-suppression-registry-latest.json');
  let j;
  try {
    j = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return '';
  }
  const c = j.correlation || {};
  const lines = ['', '---', '### Automation correlation'];
  if (c.correlationId) {
    lines.push(`- **correlationId:** \`${c.correlationId}\``);
  }
  if (c.workflowRunUrl) {
    lines.push(`- **Suppression registry run:** ${c.workflowRunUrl}`);
  }
  if (c.commitSha) {
    lines.push(`- **Registry snapshot SHA:** \`${String(c.commitSha).slice(0, 12)}\``);
  }
  if (j.noise && j.noise.emaOpenIncidents != null) {
    lines.push(`- **EMA open incidents (registry):** ${j.noise.emaOpenIncidents}`);
  }
  if (lines.length <= 3) {
    return '';
  }
  return lines.join('\n');
}

function buildFinalBodyPath(absBody) {
  const base = fs.readFileSync(absBody, 'utf8');
  const prefix = buildCorrelationBlock();
  const suffix = readRegistryCorrelationMd();
  const skipSuffix = !suffix || base.includes('### Automation correlation');
  const effectiveSuffix = skipSuffix ? '' : suffix;
  const skipPrefix = !prefix || base.includes('### Correlation');

  let combined = base;
  if (!skipPrefix) {
    combined = `${prefix}${combined}`;
  }
  if (effectiveSuffix) {
    combined = `${combined}${effectiveSuffix}`;
  }

  if (combined === base) {
    return { path: absBody, cleanup: null };
  }

  const tmp = path.join(os.tmpdir(), `gh-dedupe-body-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(tmp, combined, 'utf8');
  return {
    path: tmp,
    cleanup: () => {
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
    },
  };
}

function appendGithubOutput(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (!out || value === undefined || value === null) return;
  const esc = String(value).replace(/\r/g, '').replace(/\n/g, '%0A');
  fs.appendFileSync(out, `${key}=${esc}\n`, 'utf8');
}

function issueNumberFromCreateStdout(stdout) {
  const m = String(stdout || '').match(/\/issues\/(\d+)/);
  return m ? m[1] : '';
}

function listOpenIssues(limit) {
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,updatedAt',
    '--limit',
    String(limit),
  ]);
  if (!list.ok) {
    console.error('gh issue list failed:', list.stderr || list.stdout);
    process.exit(1);
  }
  try {
    return JSON.parse(list.stdout || '[]');
  } catch {
    return [];
  }
}

function main() {
  const title = process.env.ISSUE_TITLE;
  const bodyFile = process.env.ISSUE_BODY_FILE;
  const labelList = parseLabels();
  const cooldownHours = parseFloat(process.env.COOLDOWN_HOURS || '0') || 0;
  const skipIfOpen = ['1', 'true', 'yes'].includes(String(process.env.SKIP_IF_OPEN || '').toLowerCase());
  const listLimit = String(process.env.ISSUE_LIST_LIMIT || '200');

  if (!title || !bodyFile) {
    console.error('gh-issue-dedupe-or-create: ISSUE_TITLE and ISSUE_BODY_FILE are required.');
    process.exit(2);
  }

  const absBody = path.isAbsolute(bodyFile) ? bodyFile : path.join(process.cwd(), bodyFile);
  if (!fs.existsSync(absBody)) {
    console.error(`gh-issue-dedupe-or-create: body file not found: ${absBody}`);
    process.exit(2);
  }

  const fpLabel = fingerprintLabelName();
  if (fpLabel) {
    ensureFingerprintLabel(fpLabel);
    ensureAutomationIncidentLabel();
  }

  let matched = null;
  if (fpLabel) {
    matched = findIssueByLabel(fpLabel);
  }

  const issues = listOpenIssues(listLimit);
  if (!matched) {
    matched = issues.find((i) => i.title === title);
  }

  if (matched) {
    const updated = new Date(matched.updatedAt).getTime();
    const ageHours = (Date.now() - updated) / 3600000;
    if (skipIfOpen) {
      console.log(`Open issue #${matched.number} matches; SKIP_IF_OPEN set — skipping.`);
      appendGithubOutput('dedupe_result', 'skipped_open');
      appendGithubOutput('issue_number', String(matched.number));
      process.exit(0);
    }
    if (cooldownHours > 0 && ageHours < cooldownHours) {
      console.log(
        `Cooldown active for issue #${matched.number} (updated ${ageHours.toFixed(2)}h ago < ${cooldownHours}h); skipping.`
      );
      appendGithubOutput('dedupe_result', 'skipped_cooldown');
      appendGithubOutput('issue_number', String(matched.number));
      process.exit(0);
    }
    const bodyForGh = buildFinalBodyPath(absBody);
    const comment = gh(['issue', 'comment', String(matched.number), '--body-file', bodyForGh.path]);
    if (!comment.ok) {
      if (bodyForGh.cleanup) {
        bodyForGh.cleanup();
      }
      console.error('gh issue comment failed:', comment.stderr);
      process.exit(1);
    }
    if (bodyForGh.cleanup) {
      bodyForGh.cleanup();
    }
    console.log(`Commented on existing issue #${matched.number}.`);
    appendGithubOutput('dedupe_result', 'commented');
    appendGithubOutput('issue_number', String(matched.number));

    const labelsToEnsure = [...new Set([...labelList, ...(fpLabel ? [fpLabel, 'automation-incident'] : [])])];
    if (labelsToEnsure.length) {
      const editArgs = ['issue', 'edit', String(matched.number)];
      for (const l of labelsToEnsure) {
        editArgs.push('--add-label', l);
      }
      const edited = gh(editArgs);
      if (!edited.ok) {
        console.warn('gh issue edit --add-label (non-fatal):', edited.stderr || edited.stdout);
      }
    }

    process.exit(0);
  }

  const bodyForGh = buildFinalBodyPath(absBody);
  const createArgs = ['issue', 'create', '--title', title, '--body-file', bodyForGh.path];
  const allLabels = [...new Set([...labelList, ...(fpLabel ? [fpLabel, 'automation-incident'] : [])])];
  for (const l of allLabels) {
    createArgs.push('--label', l);
  }

  const create = gh(createArgs, null);
  if (!create.ok) {
    if (bodyForGh.cleanup) {
      bodyForGh.cleanup();
    }
    console.error('gh issue create failed:', create.stderr);
    process.exit(1);
  }
  if (bodyForGh.cleanup) {
    bodyForGh.cleanup();
  }
  console.log(create.stdout || 'Issue created.');
  const createdNum = issueNumberFromCreateStdout(create.stdout);
  appendGithubOutput('dedupe_result', 'created');
  if (createdNum) {
    appendGithubOutput('issue_number', createdNum);
  }
  process.exit(0);
}

main();
