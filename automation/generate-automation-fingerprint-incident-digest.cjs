#!/usr/bin/env node
/**
 * Summarize open GitHub issues that carry automation fingerprint labels (automation-fp-*).
 * Writes JSON + Markdown under automation/reports/ for humans and other agents.
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN — required on CI; if missing, writes empty digest and exits 0
 *   DIGEST_LIMIT — max issues to scan (default 300)
 *   DIGEST_NOTIFY_TELEGRAM — if "1"/"true" and open count > 0, send Telegram (needs TELEGRAM_* secrets)
 *   AUTOMATION_DIGEST_SLACK_WEBHOOK — optional; posts plain-text summary when open count > 0
 *   AUTOMATION_DIGEST_DISCORD_WEBHOOK — optional; posts { content: text } when open count > 0
 *   DIGEST_DELTA_NOTIFY_ONLY — if "1"/"true", only notify Slack/Discord/Telegram when delta (new/resolved) since last run
 *   DIGEST_ROLLUP_ISSUE — if "1"/"true", create/update rolling digest issue (needs issues: write)
 *   DIGEST_ROLLUP_AUTO_CLOSE — if "1"/"true", close rollup issue when fp issue count is 0; reopen on next incident
 *   DIGEST_ROLLUP_ASSIGNEE — optional GitHub username to assign when creating rollup issue
 *   DIGEST_ESCALATION_MIN_COUNT — optional; escalate when open fp issues >= this count (warning tier)
 *   DIGEST_ESCALATION_STALE_DAYS — optional; escalate when any issue updatedAt older than this many days (warning)
 *   DIGEST_ESCALATION_CRITICAL_MIN_COUNT — optional; critical tier when count >= this
 *   DIGEST_ESCALATION_CRITICAL_STALE_DAYS — optional; critical tier when any issue older than this many days
 *   DIGEST_ESCALATION_COOLDOWN_HOURS — optional; min hours between escalation sends (default 24)
 *   DIGEST_ESCALATION_GENERIC_WEBHOOK / DIGEST_ESCALATION_SLACK_WEBHOOK — warning-tier Slack webhook
 *   DIGEST_ESCALATION_PAGERDUTY_ROUTING_KEY — warning-tier PagerDuty
 *   DIGEST_ESCALATION_CRITICAL_GENERIC_WEBHOOK / DIGEST_ESCALATION_CRITICAL_SLACK_WEBHOOK — critical-tier webhook
 *   DIGEST_ESCALATION_CRITICAL_PAGERDUTY_ROUTING_KEY — critical-tier PagerDuty
 *   DIGEST_EXTRAS_CONFIG — optional path to JSON (default: automation/config/automation-fingerprint-digest-extras.json)
 *   DIGEST_AUTO_ASSIGN_SUGGESTED — if "1"/"true", `gh issue edit --add-assignee` using extras.json assigneeRules (skips if already assigned)
 *   DIGEST_ROLLUP_CRITICAL_COMMENT — if "1"/"true", comment on rollup when severity is critical and there are new issues this run
 *   DIGEST_SLACK_USE_BLOCKS — if "1"/"true", post Slack incoming webhook with Block Kit (still includes fallback text)
 *   DIGEST_DISCORD_USE_EMBEDS — if "1"/"true", post Discord webhook with embeds (shorter plain fallback)
 *   DIGEST_PROJECT_OWNER — optional org or user login for `gh project item-add`
 *   DIGEST_PROJECT_NUMBER — optional project number (classic / new CLI) for new issues in delta
 *   DIGEST_EMA_SIBLING_COMMENT — if "1"/"true", comment on hottest issue when registry EMA exceeds threshold
 *   DIGEST_EMA_SIBLING_THRESHOLD — default 3 (uses incident-suppression-registry-latest.json noise.emaOpenIncidents)
 *   DIGEST_USE_CODEOWNERS — if "1"/"true", fallback assignee from .github/CODEOWNERS (DIGEST_CODEOWNERS_LOGICAL_PATH)
 *   DIGEST_PROJECT_V2_NODE_ID — Projects v2 GraphQL project node id (fallback if gh project item-add fails)
 *   DIGEST_CRITICAL_PR_COMMENT — if "1"/"true", comment on open PRs touching automation/ when severity is critical (workflow_dispatch only)
 *   DIGEST_SLACK_INCLUDE_TREND — if "1"/"true", append last rows from trend JSON to Slack blocks
 *   DIGEST_CLUSTER_COMPACT_NOTIFY — "1"/"true" forces compact cluster rollup in Slack/Discord/Telegram; "0"/"false" disables auto mode
 *   DIGEST_CLUSTER_COMPACT_MIN_OPEN — when DIGEST_CLUSTER_COMPACT_NOTIFY is unset, use compact rollup when open fp issues >= N (default 6)
 *   DIGEST_DRY_RUN — if "1"/"true", generate digest/trend output but skip all external mutations (comments/webhooks/labels/project writes)
 *   DIGEST_APPLY_DELTA_LABEL — if "1"/"true", add DIGEST_DELTA_LABEL_NAME (default automation-fp-delta-seen) to each issue in this run's new delta
 *   DIGEST_DELTA_LABEL_NAME — optional label name for DIGEST_APPLY_DELTA_LABEL
 *   GITHUB_OUTPUT — when set, writes has_fp_incidents=true|false for downstream steps
 *   DIGEST_MESH_DISABLE — if "1"/"true", skip writing automation-fp-digest to incident-cooldown-mesh
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const https = require('https');
const { spawnSync } = require('child_process');
const { recordEscalation } = require('./lib/incident-cooldown-mesh.cjs');

const root = process.cwd();
const reportsDir = path.join(root, 'automation', 'reports');
const jsonPath = path.join(reportsDir, 'automation-fingerprint-incidents-latest.json');
const mdPath = path.join(reportsDir, 'automation-fingerprint-incidents-latest.md');
const escalationStatePath = path.join(reportsDir, 'automation-fingerprint-incidents-escalation-state.json');
const digestLastStatePath = path.join(reportsDir, 'automation-fingerprint-incidents-digest-last.json');
const hotnessStatePath = path.join(reportsDir, 'automation-fingerprint-incidents-hotness-state.json');
const trendPath = path.join(reportsDir, 'automation-fingerprint-incidents-trend.json');
const rollupCriticalSignaturePath = path.join(
  reportsDir,
  'automation-fingerprint-incidents-rollup-critical-delta-last.json'
);
const rollupRunnerAnomalySignaturePath = path.join(
  reportsDir,
  'automation-fingerprint-incidents-rollup-runner-anomaly-last.json'
);
const registryPath = path.join(root, 'automation', 'reports', 'incident-suppression-registry-latest.json');
const defaultExtrasPath = path.join(root, 'automation', 'config', 'automation-fingerprint-digest-extras.json');

const ROLLUP_TITLE = 'Automation fingerprint incidents — rolling digest';
const ROLLUP_LABEL = 'automation-fp-digest-rollup';

const MS_H = 3600000;
const MS_D = 86400000;

function gh(args) {
  return spawnSync('gh', args, {
    encoding: 'utf8',
    env: process.env,
  });
}

function truthy(v) {
  return ['1', 'true', 'yes'].includes(String(v || '').toLowerCase());
}

function recordDigestMesh(reason, extra = {}) {
  if (truthy(process.env.DIGEST_MESH_DISABLE)) return;
  try {
    recordEscalation('automation-fp-digest', {
      meta: { reason, ...extra, at: new Date().toISOString() },
    });
  } catch (e) {
    console.warn('recordDigestMesh:', e.message);
  }
}

function notifySlack(webhookUrl, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ text: text.slice(0, 4000) });
    const u = new URL(webhookUrl);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function notifyDiscord(webhookUrl, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ content: text.slice(0, 2000) });
    const u = new URL(webhookUrl);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function postJsonUrl(url, bodyObj) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const body = JSON.stringify(bodyObj);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          res.on('data', () => {});
          res.on('end', () => resolve(res.statusCode));
        }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

function appendGithubOutput(key, value) {
  const p = process.env.GITHUB_OUTPUT;
  if (!p) return;
  fs.appendFileSync(p, `${key}=${value}\n`);
}

function readJsonMaybe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function classifyRunnerReason(reason) {
  const r = String(reason || '').toLowerCase();
  if (r.includes('policy') || r.includes('approved') || r.includes('stale handoff')) return 'policy';
  if (r.includes('missing') || r.includes('not found') || r.includes('artifact')) return 'artifact';
  if (r.includes('exec') || r.includes('runner')) return 'runner';
  return 'unknown';
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function computeRunnerSloDigestSummary() {
  const p = path.join(root, 'automation', 'reports', 'openclaw-runner-history.json');
  const j = readJsonMaybe(p);
  const entries = Array.isArray(j && j.entries) ? j.entries : [];
  if (!entries.length) {
    return {
      present: false,
      sampleCount: 0,
      failureCount: 0,
      failureRatePct: null,
      mttrHours: null,
      topReasonClass: null,
    };
  }

  const sample = entries.slice(-40);
  const failureRows = sample.filter((e) => Number(e.exitCode || 0) !== 0);
  const failureRatePct = sample.length ? Math.round((failureRows.length / sample.length) * 1000) / 10 : null;

  const reasonCounts = {};
  for (const row of failureRows) {
    const cls = classifyRunnerReason(row.reason);
    reasonCounts[cls] = (reasonCounts[cls] || 0) + 1;
  }
  const topReasonClass =
    Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .map((x) => x[0])[0] || null;

  const recoveryDurations = [];
  let openFailureStart = null;
  for (const row of sample) {
    const ts = row && row.timestampIso ? Date.parse(row.timestampIso) : NaN;
    if (!Number.isFinite(ts)) continue;
    const failed = Number(row.exitCode || 0) !== 0;
    if (failed && openFailureStart == null) {
      openFailureStart = ts;
      continue;
    }
    if (!failed && openFailureStart != null) {
      const h = (ts - openFailureStart) / MS_H;
      if (h >= 0) recoveryDurations.push(h);
      openFailureStart = null;
    }
  }
  const mttrRaw = median(recoveryDurations);
  const mttrHours = mttrRaw == null ? null : Math.round(mttrRaw * 10) / 10;

  return {
    present: true,
    sampleCount: sample.length,
    failureCount: failureRows.length,
    failureRatePct,
    mttrHours,
    topReasonClass,
  };
}

function computeRunnerAnomalyDigestSummary() {
  const p = path.join(root, 'automation', 'reports', 'openclaw-runner-anomaly-latest.json');
  const j = readJsonMaybe(p);
  if (!j || typeof j !== 'object') {
    return {
      present: false,
      anomalyDetected: false,
      alerts: [],
      summary: null,
      generatedAt: null,
    };
  }
  const alerts = Array.isArray(j.alerts) ? j.alerts : [];
  return {
    present: true,
    anomalyDetected: Boolean(j.anomalyDetected),
    alerts,
    summary: typeof j.summary === 'string' ? j.summary : null,
    generatedAt: typeof j.generatedAt === 'string' ? j.generatedAt : null,
  };
}

function loadExtras() {
  const p = process.env.DIGEST_EXTRAS_CONFIG || defaultExtrasPath;
  const abs = path.isAbsolute(p) ? p : path.join(root, p);
  const j = readJsonMaybe(abs);
  if (!j) return { assigneeRules: [], runbookRules: [] };
  return {
    assigneeRules: Array.isArray(j.assigneeRules) ? j.assigneeRules : [],
    runbookRules: Array.isArray(j.runbookRules) ? j.runbookRules : [],
  };
}

function resolveRunbookForIssue(issue, extras) {
  const title = String(issue.title || '');
  const rules = extras.runbookRules || [];
  for (const r of rules) {
    if (r.default) continue;
    const subs = r.matchTitleContains || [];
    if (subs.some((s) => title.includes(s))) return r.url || '';
  }
  const def = rules.find((r) => r.default);
  return def && def.url ? def.url : '';
}

function resolveAssigneeFromExtras(issue, extras) {
  const title = String(issue.title || '');
  for (const r of extras.assigneeRules || []) {
    const subs = r.matchTitleContains || [];
    if (!subs.length) continue;
    if (subs.some((s) => title.includes(s))) {
      const a = String(r.assignee || '').trim();
      if (a) return a;
    }
  }
  return '';
}

function normalizeCodeownersPattern(p) {
  return String(p || '').trim().replace(/^\//, '');
}

function codeownersPatternMatches(pattern, logicalPath) {
  const p = normalizeCodeownersPattern(pattern);
  const lp = String(logicalPath || '').replace(/^\//, '');
  if (p === '*') return true;
  if (!p) return false;
  if (p.endsWith('/')) return lp.startsWith(p) || lp.startsWith(p.slice(0, -1) + '/');
  return lp === p || lp.startsWith(`${p}/`);
}

let codeownersRulesCache = null;
function parseCodeowners() {
  if (codeownersRulesCache) return codeownersRulesCache;
  const p = path.join(root, '.github', 'CODEOWNERS');
  if (!fs.existsSync(p)) {
    codeownersRulesCache = [];
    return codeownersRulesCache;
  }
  const rules = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s+/);
    const pat = parts[0];
    const owners = parts.slice(1).filter((x) => x.startsWith('@'));
    if (pat && owners.length) rules.push({ pattern: pat, owners });
  }
  codeownersRulesCache = rules;
  return rules;
}

function resolveAssigneeFromCodeowners() {
  const logical = String(
    process.env.DIGEST_CODEOWNERS_LOGICAL_PATH || 'automation/reports/incident-suppression-registry-latest.json'
  );
  const rules = parseCodeowners();
  const matches = [];
  for (const rule of rules) {
    if (codeownersPatternMatches(rule.pattern, logical)) matches.push(rule);
  }
  if (!matches.length) return '';
  const last = matches[matches.length - 1];
  const owner = last.owners[0].replace(/^@/, '');
  return owner;
}

function resolveAssigneeForIssue(issue, extras) {
  const fromExtras = resolveAssigneeFromExtras(issue, extras);
  if (fromExtras) return fromExtras;
  if (truthy(process.env.DIGEST_USE_CODEOWNERS)) {
    return resolveAssigneeFromCodeowners();
  }
  return '';
}

function ageBucketMs(updatedAt) {
  const t = new Date(updatedAt).getTime();
  if (!Number.isFinite(t)) return 'unknown';
  const age = Date.now() - t;
  if (age < 24 * MS_H) return 'lt24h';
  if (age < 7 * MS_D) return 'd1_7';
  return 'gt7d';
}

function hotnessScore(issue, counts) {
  const t = new Date(issue.updatedAt).getTime();
  const hours = Number.isFinite(t) ? (Date.now() - t) / MS_H : 0;
  const n = counts[String(issue.number)] || 0;
  return hours * 1.5 + n * 3;
}

function bumpHotnessCounts(openIssues, prevState) {
  const counts = { ...(prevState && prevState.counts ? prevState.counts : {}) };
  for (const i of openIssues) {
    const k = String(i.number);
    counts[k] = (counts[k] || 0) + 1;
  }
  return { counts, updatedAt: new Date().toISOString() };
}

function readHotnessCounts() {
  const s = readJsonMaybe(hotnessStatePath);
  return s && s.counts ? s.counts : {};
}

function writeHotnessState(state) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(hotnessStatePath, JSON.stringify(state, null, 2));
}

function sortByHotness(fpIssues, counts) {
  return [...fpIssues].sort((a, b) => hotnessScore(b, counts) - hotnessScore(a, counts));
}

function computeDigestDelta(currentNumbers, lastState) {
  if (!lastState || !lastState.generatedAt) {
    return { newIssues: [], resolved: [], hadPrevious: false };
  }
  const prev = Array.isArray(lastState.issueNumbers) ? lastState.issueNumbers : [];
  const cur = new Set(currentNumbers);
  const pre = new Set(prev);
  const newIssues = [...cur].filter((n) => !pre.has(n));
  const resolved = [...pre].filter((n) => !cur.has(n));
  return { newIssues, resolved, hadPrevious: true };
}

function writeDigestLastState(issueNumbers, generatedAt) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    digestLastStatePath,
    JSON.stringify({ issueNumbers, generatedAt }, null, 2)
  );
}

function ensureRollupLabel() {
  const r = gh([
    'label',
    'create',
    ROLLUP_LABEL,
    '--color',
    '0366d6',
    '--description',
    'Rolling digest issue for automation fingerprint incidents',
  ]);
  if (r.status !== 0 && !/already exists/i.test(r.stderr || '')) {
    console.warn('gh label create rollup (non-fatal):', r.stderr || r.stdout);
  }
}

function findRollupIssue() {
  const list = gh([
    'issue',
    'list',
    '--state',
    'all',
    '--label',
    ROLLUP_LABEL,
    '--json',
    'number,title,state',
    '--limit',
    '30',
  ]);
  if (list.status !== 0) return null;
  try {
    const arr = JSON.parse(list.stdout || '[]');
    return arr.find((i) => i.title === ROLLUP_TITLE) || null;
  } catch {
    return null;
  }
}

function buildRollupBody(fpIssuesSorted, generatedAt, extras) {
  const lines = [
    '<!-- automation-fp-digest-rollup -->',
    '',
    `_Last updated: ${generatedAt}_`,
    '',
    `Open issues with an \`automation-fp-*\` label: **${fpIssuesSorted.length}**`,
    '',
  ];

  if (fpIssuesSorted.length === 0) {
    lines.push('_No open fingerprint-tagged incidents._');
    lines.push('');
  } else {
    const byBucket = { lt24h: [], d1_7: [], gt7d: [], unknown: [] };
    for (const i of fpIssuesSorted) {
      const b = ageBucketMs(i.updatedAt);
      if (byBucket[b]) byBucket[b].push(i);
      else byBucket.unknown.push(i);
    }

    const section = (title, hint, items) => {
      if (!items.length) return;
      lines.push(`### ${title}`);
      lines.push('');
      lines.push(`_${hint}_`);
      lines.push('');
      for (const i of items) {
        const rb = resolveRunbookForIssue(i, extras);
        const rbLine = rb ? ` · [Runbook](${rb})` : '';
        const staleHint =
          ageBucketMs(i.updatedAt) === 'gt7d'
            ? ' _(stale / needs ownership)_'
            : ageBucketMs(i.updatedAt) === 'd1_7'
              ? ' _(1–7d quiet)_'
              : '';
        lines.push(`- [ ] [#${i.number}](${i.url}) — ${i.title}${staleHint}${rbLine}`);
      }
      lines.push('');
    };

    section('Fresh (< 24h since update)', 'Recently touched; still hot contextually.', byBucket.lt24h);
    section('1–7 days', 'Review soon — triage or close if obsolete.', byBucket.d1_7);
    section('> 7 days (stale)', 'Prioritize or close; likely need owner attention.', byBucket.gt7d);
    if (byBucket.unknown.length) {
      section('Unknown age', 'Check timestamps.', byBucket.unknown);
    }

    lines.push('### Priority (hotness — older + recurring first)');
    lines.push('');
    for (const i of fpIssuesSorted.slice(0, 15)) {
      const rb = resolveRunbookForIssue(i, extras);
      const rbLine = rb ? ` · [Runbook](${rb})` : '';
      lines.push(`1. [#${i.number}](${i.url}) — ${i.title}${rbLine}`);
    }
    if (fpIssuesSorted.length > 15) {
      lines.push(`_… +${fpIssuesSorted.length - 15} more (see SLA sections above)._`);
    }
    lines.push('');
  }

  lines.push('_Maintained by workflow `ai-automation-fingerprint-digest-weekly`._');
  return lines.join('\n');
}

function upsertRollupIssue(fpIssuesSorted, generatedAt, extras) {
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) return null;
  ensureRollupLabel();
  const body = buildRollupBody(fpIssuesSorted, generatedAt, extras);
  const autoClose = truthy(process.env.DIGEST_ROLLUP_AUTO_CLOSE);
  const assignee = String(process.env.DIGEST_ROLLUP_ASSIGNEE || '').trim();
  const tmp = path.join(os.tmpdir(), `fp-digest-rollup-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(tmp, body, 'utf8');
  try {
    const existing = findRollupIssue();
    if (existing) {
      if (existing.state === 'closed' && fpIssuesSorted.length > 0) {
        const reopen = gh(['issue', 'reopen', String(existing.number)]);
        if (reopen.status !== 0) {
          console.warn('Rollup issue reopen failed:', reopen.stderr || reopen.stdout);
        }
      }
      const r = gh(['issue', 'edit', String(existing.number), '--body-file', tmp]);
      if (r.status !== 0) {
        console.warn('Rollup issue edit failed:', r.stderr || r.stdout);
      } else {
        console.log(`Updated rollup issue #${existing.number}.`);
        if (fpIssuesSorted.length > 0) {
          recordDigestMesh('rollup-issue-edit', { rollup: existing.number });
        }
      }
      if (autoClose && fpIssuesSorted.length === 0 && existing.state === 'open') {
        const closed = gh([
          'issue',
          'close',
          String(existing.number),
          '--comment',
          'Auto-closing rollup: no open automation fingerprint incidents remain.',
        ]);
        if (closed.status !== 0) {
          console.warn('Rollup issue close failed:', closed.stderr || closed.stdout);
        } else {
          console.log(`Closed rollup issue #${existing.number} (no open incidents).`);
        }
      }
    } else {
      const args = [
        'issue',
        'create',
        '--title',
        ROLLUP_TITLE,
        '--body-file',
        tmp,
        '--label',
        ROLLUP_LABEL,
      ];
      if (assignee) {
        args.push('--assignee', assignee);
      }
      const r = gh(args);
      if (r.status !== 0) {
        console.warn('Rollup issue create failed:', r.stderr || r.stdout);
      } else {
        console.log('Created rollup issue:', (r.stdout || '').trim());
        recordDigestMesh('rollup-issue-create', {});
      }
    }
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
  const rollup = findRollupIssue();
  return rollup ? rollup.number : null;
}

function shouldEscalate(fpIssues) {
  const minCount = parseInt(String(process.env.DIGEST_ESCALATION_MIN_COUNT || '0'), 10);
  const staleDays = parseFloat(String(process.env.DIGEST_ESCALATION_STALE_DAYS || '0'));
  if (!fpIssues.length) return false;
  if (Number.isFinite(minCount) && minCount > 0 && fpIssues.length >= minCount) return true;
  if (Number.isFinite(staleDays) && staleDays > 0) {
    const threshold = Date.now() - staleDays * MS_D;
    for (const i of fpIssues) {
      const t = new Date(i.updatedAt).getTime();
      if (Number.isFinite(t) && t < threshold) return true;
    }
  }
  return false;
}

function escalationSeverity(fpIssues) {
  const critMin = parseInt(String(process.env.DIGEST_ESCALATION_CRITICAL_MIN_COUNT || '0'), 10);
  const critStale = parseFloat(String(process.env.DIGEST_ESCALATION_CRITICAL_STALE_DAYS || '0'));
  if (!fpIssues.length) return null;
  if (Number.isFinite(critMin) && critMin > 0 && fpIssues.length >= critMin) return 'critical';
  if (Number.isFinite(critStale) && critStale > 0) {
    const threshold = Date.now() - critStale * MS_D;
    for (const i of fpIssues) {
      const t = new Date(i.updatedAt).getTime();
      if (Number.isFinite(t) && t < threshold) return 'critical';
    }
  }
  if (shouldEscalate(fpIssues)) return 'warning';
  return null;
}

function escalationCooldownHours() {
  const n = parseFloat(String(process.env.DIGEST_ESCALATION_COOLDOWN_HOURS || '24'));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

function escalationCooldownAllows(nowIso) {
  const coolH = escalationCooldownHours();
  if (coolH <= 0) return true;
  const state = readJsonMaybe(escalationStatePath);
  const last = state && state.lastEscalatedAt ? Date.parse(state.lastEscalatedAt) : 0;
  if (!last) return true;
  const ageH = (Date.parse(nowIso) - last) / MS_H;
  if (ageH < coolH) {
    console.log(`Escalation cooldown active (${ageH.toFixed(2)}h < ${coolH}h); skipping.`);
    return false;
  }
  return true;
}

function writeEscalationState(nowIso, fpIssues, severity) {
  const state = {
    lastEscalatedAt: nowIso,
    lastSeverity: severity || null,
    openWithFingerprintLabel: fpIssues.length,
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(escalationStatePath, JSON.stringify(state, null, 2));
}

async function notifyEscalation(fpIssues, severity) {
  let sent = false;
  const sorted = sortByHotness(fpIssues, readHotnessCounts());
  const lines = [
    `Automation fingerprint ESCALATION [${severity}]: ${fpIssues.length} open incident(s)`,
    ...sorted.slice(0, 15).map((i) => `#${i.number} ${i.title} ${i.url}`),
    fpIssues.length > 15 ? `… +${fpIssues.length - 15} more` : '',
  ].filter(Boolean);
  const plain = lines.join('\n').slice(0, 4000);

  const slackUrl =
    severity === 'critical'
      ? process.env.DIGEST_ESCALATION_CRITICAL_SLACK_WEBHOOK ||
        process.env.DIGEST_ESCALATION_CRITICAL_GENERIC_WEBHOOK ||
        process.env.DIGEST_ESCALATION_SLACK_WEBHOOK ||
        process.env.DIGEST_ESCALATION_GENERIC_WEBHOOK
      : process.env.DIGEST_ESCALATION_SLACK_WEBHOOK || process.env.DIGEST_ESCALATION_GENERIC_WEBHOOK;

  const pdKey =
    severity === 'critical'
      ? process.env.DIGEST_ESCALATION_CRITICAL_PAGERDUTY_ROUTING_KEY || process.env.DIGEST_ESCALATION_PAGERDUTY_ROUTING_KEY
      : process.env.DIGEST_ESCALATION_PAGERDUTY_ROUTING_KEY;

  if (slackUrl) {
    try {
      await notifySlack(slackUrl, plain);
      console.log('Escalation webhook sent.');
      sent = true;
    } catch (e) {
      console.warn('Escalation slack/generic failed:', e.message);
    }
  }

  if (pdKey) {
    const pdBody = {
      routing_key: pdKey,
      event_action: 'trigger',
      payload: {
        summary: plain.slice(0, 1024),
        source: 'zion-automation-fp-digest',
        severity: severity === 'critical' ? 'critical' : 'warning',
      },
    };
    try {
      const code = await postJsonUrl('https://events.pagerduty.com/v2/enqueue', pdBody);
      console.log('PagerDuty escalation:', code);
      sent = true;
    } catch (e) {
      console.warn('PagerDuty escalation failed:', e.message);
    }
  }

  if (sent) {
    recordDigestMesh('digest-escalation-webhook', { severity });
  }
}

function formatDeltaPlain(delta, issueByNumber) {
  const parts = [];
  if (delta.newIssues.length) {
    parts.push(
      `New: ${delta.newIssues
        .map((n) => {
          const i = issueByNumber.get(n);
          return i ? `#${n} ${i.title}` : `#${n}`;
        })
        .join('; ')}`
    );
  }
  if (delta.resolved.length) {
    parts.push(`Resolved (no longer open): ${delta.resolved.map((n) => `#${n}`).join(', ')}`);
  }
  return parts.join('\n');
}

function buildSiblingLookup(fpIssues) {
  const byLabel = new Map();
  for (const issue of fpIssues) {
    for (const label of issue.automationFpLabels || []) {
      if (!byLabel.has(label)) byLabel.set(label, []);
      byLabel.get(label).push(issue.number);
    }
  }
  const out = new Map();
  for (const issue of fpIssues) {
    const s = new Set();
    for (const label of issue.automationFpLabels || []) {
      for (const n of byLabel.get(label) || []) {
        if (n !== issue.number) s.add(n);
      }
    }
    out.set(
      issue.number,
      [...s]
        .sort((a, b) => a - b)
        .slice(0, 4)
        .map((n) => `#${n}`),
    );
  }
  return out;
}

/** Connected components: issues sharing any automation-fp-* label are one cluster. */
function computeLabelClusters(fpIssues) {
  const parent = new Map();
  function find(x) {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  }
  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }
  for (const i of fpIssues) find(i.number);
  const byLabel = new Map();
  for (const i of fpIssues) {
    for (const lab of i.automationFpLabels || []) {
      if (!byLabel.has(lab)) byLabel.set(lab, []);
      byLabel.get(lab).push(i.number);
    }
  }
  for (const [, nums] of byLabel) {
    if (nums.length < 2) continue;
    for (let k = 1; k < nums.length; k++) union(nums[0], nums[k]);
  }
  const groups = new Map();
  for (const i of fpIssues) {
    const r = find(i.number);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(i);
  }
  return [...groups.values()].map((members) => {
    const labelSet = new Set();
    for (const m of members) {
      for (const l of m.automationFpLabels || []) labelSet.add(l);
    }
    const sorted = [...members].sort((a, b) => a.number - b.number);
    return { members: sorted, labels: [...labelSet].sort() };
  });
}

function shouldUseClusterCompact(fpIssues) {
  const raw = process.env.DIGEST_CLUSTER_COMPACT_NOTIFY;
  if (raw != null && String(raw).trim() !== '') {
    if (truthy(raw)) return true;
    if (['0', 'false', 'no', 'off'].includes(String(raw).toLowerCase())) return false;
  }
  const n = parseInt(String(process.env.DIGEST_CLUSTER_COMPACT_MIN_OPEN || '6'), 10);
  return fpIssues.length >= (Number.isFinite(n) ? n : 6);
}

function formatClusterCompactSummary(clusters) {
  const multi = clusters.filter((c) => c.members.length > 1);
  const singles = clusters.filter((c) => c.members.length === 1);
  const lines = [];
  for (const c of multi.slice(0, 14)) {
    const nums = c.members.map((m) => `#${m.number}`).join(', ');
    const labels = c.labels.slice(0, 4).join(', ');
    const top = c.members[0];
    const title = String(top.title || '').slice(0, 100);
    lines.push(`Cluster (${c.members.length} issues · ${labels}): ${nums} — ${title}`);
  }
  if (multi.length > 14) lines.push(`… +${multi.length - 14} more clusters`);
  const singleNums = singles.flatMap((c) => c.members.map((m) => m.number));
  if (singleNums.length) {
    const shown = singleNums
      .slice(0, 24)
      .map((n) => `#${n}`)
      .join(', ');
    lines.push(`Singles (${singleNums.length}): ${shown}${singleNums.length > 24 ? ' …' : ''}`);
  }
  return lines.join('\n');
}

function bucketCounts(fpIssues) {
  const c = { lt24h: 0, d1_7: 0, gt7d: 0, unknown: 0 };
  for (const i of fpIssues) {
    const b = ageBucketMs(i.updatedAt);
    if (Object.prototype.hasOwnProperty.call(c, b)) c[b]++;
    else c.unknown++;
  }
  return c;
}

function appendTrendSnapshot(row) {
  const prev = readJsonMaybe(trendPath) || { history: [] };
  prev.history = Array.isArray(prev.history) ? prev.history : [];
  prev.history.push(row);
  if (prev.history.length > 104) prev.history = prev.history.slice(-104);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(trendPath, JSON.stringify(prev, null, 2));
}

function readRegistryEma() {
  const j = readJsonMaybe(registryPath);
  const ema = j && j.noise && j.noise.emaOpenIncidents != null ? Number(j.noise.emaOpenIncidents) : null;
  return { ema: Number.isFinite(ema) ? ema : null, correlationId: j && j.correlation && j.correlation.correlationId };
}

function applySuggestedAssignees(fpIssues, extras) {
  if (!truthy(process.env.DIGEST_AUTO_ASSIGN_SUGGESTED)) return;
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) return;
  for (const issue of fpIssues) {
    const a = resolveAssigneeForIssue(issue, extras);
    if (!a) continue;
    const view = gh(['issue', 'view', String(issue.number), '--json', 'assignees']);
    if (view.status !== 0) continue;
    try {
      const j = JSON.parse(view.stdout || '{}');
      const existing = (j.assignees || []).map((x) => x.login);
      if (existing.includes(a)) continue;
    } catch {
      /* ignore */
    }
    const r = gh(['issue', 'edit', String(issue.number), '--add-assignee', a]);
    if (r.status !== 0) {
      console.warn(`assignee ${a} on #${issue.number} (non-fatal):`, r.stderr || r.stdout);
    } else {
      console.log(`Added assignee @${a} to #${issue.number}.`);
    }
  }
}

function applyDeltaIssueLabels(delta) {
  if (!truthy(process.env.DIGEST_APPLY_DELTA_LABEL)) return;
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) return;
  if (!delta.newIssues.length) return;
  const label = String(process.env.DIGEST_DELTA_LABEL_NAME || 'automation-fp-delta-seen').trim();
  if (!label) return;
  const rCreate = gh([
    'label',
    'create',
    label,
    '--color',
    'C5DEF5',
    '--description',
    'Automation issue appeared in fingerprint digest new-delta',
  ]);
  if (rCreate.status !== 0 && !/already exists/i.test(String(rCreate.stderr || ''))) {
    console.warn('gh label create (non-fatal):', rCreate.stderr || rCreate.stdout);
  }
  for (const n of delta.newIssues) {
    const r = gh(['issue', 'edit', String(n), '--add-label', label]);
    if (r.status !== 0) {
      console.warn(`delta label ${label} on #${n} (non-fatal):`, r.stderr || r.stdout);
    } else {
      console.log(`Added label ${label} to #${n} (new delta).`);
    }
  }
}

function rollupCriticalDeltaSignature(delta) {
  const sorted = [...delta.newIssues].sort((a, b) => a - b);
  return crypto.createHash('sha256').update(sorted.join(',')).digest('hex');
}

function commentRollupCriticalDelta(rollupNumber, sev, delta, issueByNumber) {
  if (!rollupNumber || !truthy(process.env.DIGEST_ROLLUP_CRITICAL_COMMENT)) return;
  if (sev !== 'critical' || !delta.newIssues.length) return;
  const sig = rollupCriticalDeltaSignature(delta);
  const prev = readJsonMaybe(rollupCriticalSignaturePath);
  if (prev && prev.signature === sig) {
    console.log('Rollup critical-delta: same new-issue set as last comment; skipping.');
    return;
  }
  const marker = '<!-- fp-digest-critical-delta -->';
  const lines = [
    marker,
    '',
    '**Critical-tier digest delta** — new incidents this run:',
    '',
    ...delta.newIssues.map((n) => {
      const i = issueByNumber.get(n);
      return `- [ ] [#${n}](${i ? i.url : '#'}) — ${i ? i.title : '?'}`;
    }),
  ];
  const tmp = path.join(os.tmpdir(), `fp-critical-delta-${process.pid}.md`);
  fs.writeFileSync(tmp, lines.join('\n'), 'utf8');
  try {
    const r = gh(['issue', 'comment', String(rollupNumber), '--body-file', tmp]);
    if (r.status !== 0) {
      console.warn('Rollup critical-delta comment failed:', r.stderr || r.stdout);
    } else {
      console.log(`Posted critical-delta comment on rollup #${rollupNumber}.`);
      fs.mkdirSync(reportsDir, { recursive: true });
      fs.writeFileSync(
        rollupCriticalSignaturePath,
        JSON.stringify(
          {
            signature: sig,
            at: new Date().toISOString(),
            issueNumbers: delta.newIssues,
          },
          null,
          2
        )
      );
    }
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

function commentRollupRunnerAnomaly(rollupNumber, runnerAnomaly) {
  if (!rollupNumber || !runnerAnomaly || !runnerAnomaly.present || !runnerAnomaly.anomalyDetected) return;
  const sigSrc = JSON.stringify({
    summary: runnerAnomaly.summary || '',
    alerts: Array.isArray(runnerAnomaly.alerts) ? runnerAnomaly.alerts : [],
  });
  const sig = crypto.createHash('sha256').update(sigSrc).digest('hex');
  const prev = readJsonMaybe(rollupRunnerAnomalySignaturePath);
  if (prev && prev.signature === sig) {
    console.log('Rollup runner-anomaly: unchanged signature; skipping.');
    return;
  }
  const marker = '<!-- fp-digest-runner-anomaly -->';
  const lines = [
    marker,
    '',
    '### OpenClaw runner anomaly detector',
    '',
    `Summary: **${runnerAnomaly.summary || 'n/a'}**`,
    ...(Array.isArray(runnerAnomaly.alerts) ? runnerAnomaly.alerts.slice(0, 8).map((a) => `- ${a}`) : []),
    '',
    `_Generated: ${runnerAnomaly.generatedAt || 'unknown'}_`,
  ];
  const tmp = path.join(os.tmpdir(), `fp-runner-anomaly-${process.pid}.md`);
  fs.writeFileSync(tmp, lines.join('\n'), 'utf8');
  try {
    const r = gh(['issue', 'comment', String(rollupNumber), '--body-file', tmp]);
    if (r.status !== 0) {
      console.warn('Rollup runner-anomaly comment failed:', r.stderr || r.stdout);
      return;
    }
    console.log(`Posted runner-anomaly comment on rollup #${rollupNumber}.`);
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(
      rollupRunnerAnomalySignaturePath,
      JSON.stringify(
        {
          signature: sig,
          at: new Date().toISOString(),
          summary: runnerAnomaly.summary || null,
        },
        null,
        2
      )
    );
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

function getIssueNodeId(issueNumber) {
  const r = gh(['issue', 'view', String(issueNumber), '--json', 'id']);
  if (r.status !== 0) return null;
  try {
    const j = JSON.parse(r.stdout || '{}');
    return j.id || null;
  } catch {
    return null;
  }
}

function graphqlAddProjectV2Item(projectNodeId, issueNumber) {
  const contentId = getIssueNodeId(issueNumber);
  if (!contentId) {
    console.warn(`GraphQL project add: could not resolve node id for #${issueNumber}`);
    return false;
  }
  const payload = JSON.stringify({
    query:
      'mutation($input:AddProjectV2ItemByIdInput!){addProjectV2ItemById(input:$input){projectV2Item{id}}}',
    variables: { input: { projectId: projectNodeId, contentId: contentId } },
  });
  const r = spawnSync('gh', ['api', 'graphql', '--input', '-'], {
    encoding: 'utf8',
    input: payload,
    env: process.env,
  });
  if (r.status !== 0) {
    console.warn(`GraphQL addProjectV2Item #${issueNumber}:`, r.stderr || r.stdout);
    return false;
  }
  try {
    const j = JSON.parse(r.stdout || '{}');
    if (j.errors && j.errors.length) {
      console.warn(`GraphQL errors for #${issueNumber}:`, JSON.stringify(j.errors));
      return false;
    }
    return Boolean(j.data && j.data.addProjectV2ItemById);
  } catch {
    return false;
  }
}

function addDeltaIssuesToProject(delta, issueByNumber) {
  const owner = String(process.env.DIGEST_PROJECT_OWNER || '').trim();
  const pnum = String(process.env.DIGEST_PROJECT_NUMBER || '').trim();
  const v2Id = String(process.env.DIGEST_PROJECT_V2_NODE_ID || '').trim();
  if (!delta.newIssues.length) return;
  for (const n of delta.newIssues) {
    const i = issueByNumber.get(n);
    if (!i || !i.url) continue;
    let cliOk = false;
    if (owner && pnum) {
      const r = gh(['project', 'item-add', pnum, '--owner', owner, '--url', i.url]);
      if (r.status === 0) {
        console.log(`Added #${n} to project ${owner}/${pnum}.`);
        cliOk = true;
      } else {
        console.warn(`project item-add #${n} (non-fatal):`, r.stderr || r.stdout);
      }
    }
    if (!cliOk && v2Id) {
      if (graphqlAddProjectV2Item(v2Id, n)) {
        console.log(`GraphQL: added #${n} to Projects v2 board.`);
      }
    }
  }
}

function commentOpenAutomationPrsOnCritical(sev) {
  if (sev !== 'critical') return;
  if (!truthy(process.env.DIGEST_CRITICAL_PR_COMMENT)) return;
  if (String(process.env.GITHUB_EVENT_NAME || '') !== 'workflow_dispatch') return;
  const r = gh(['pr', 'list', '--state', 'open', '--limit', '50', '--json', 'number']);
  if (r.status !== 0) {
    console.warn('critical PR comment: gh pr list failed:', r.stderr || r.stdout);
    return;
  }
  let prs;
  try {
    prs = JSON.parse(r.stdout || '[]');
  } catch {
    return;
  }
  const marker = '<!-- fp-digest-critical-pr -->';
  const body = `${marker}\n\n**Fingerprint digest:** this run escalated to **critical**. Please review impact on \`automation/\` for open PRs.`;
  for (const pr of prs) {
    const num = pr.number;
    const d = gh(['pr', 'diff', String(num), '--name-only']);
    if (d.status !== 0) continue;
    const names = (d.stdout || '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);
    if (!names.some((line) => line.startsWith('automation/'))) continue;
    const c = gh(['pr', 'comment', String(num), '--body', body]);
    if (c.status === 0) console.log(`Posted critical notice on PR #${num}`);
    else console.warn(`PR comment on #${num}:`, c.stderr || c.stdout);
  }
}

function maybeEmaSiblingComment(fpSorted, registryEma) {
  if (!truthy(process.env.DIGEST_EMA_SIBLING_COMMENT)) return;
  const thr = parseFloat(String(process.env.DIGEST_EMA_SIBLING_THRESHOLD || '3'));
  if (!Number.isFinite(thr) || registryEma == null || registryEma < thr) return;
  const top = fpSorted[0];
  if (!top) return;
  const others = fpSorted.slice(1, 6);
  const lines = [
    '<!-- fp-digest-ema-sibling -->',
    '',
    `**Suppression registry EMA (open incidents):** ${registryEma.toFixed(2)} (threshold ≥ ${thr}).`,
    '',
    'Other open fingerprint issues in this digest:',
    ...others.map((i) => `- [#${i.number}](${i.url}) — ${i.title}`),
  ];
  if (!others.length) lines.push('_No other issues in digest._');
  const tmp = path.join(os.tmpdir(), `fp-ema-sibling-${process.pid}.md`);
  fs.writeFileSync(tmp, lines.join('\n'), 'utf8');
  try {
    const r = gh(['issue', 'comment', String(top.number), '--body-file', tmp]);
    if (r.status !== 0) {
      console.warn('EMA sibling comment failed:', r.stderr || r.stdout);
    } else {
      console.log(`Posted EMA sibling context on #${top.number}.`);
    }
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

function buildSlackDigestPayload(fpIssues, delta, issueByNumber, siblings) {
  const buckets = bucketCounts(fpIssues);
  const deltaPlain =
    delta && (delta.newIssues.length || delta.resolved.length) ? formatDeltaPlain(delta, issueByNumber) : '';
  const clusters = computeLabelClusters(fpIssues);
  const compact = shouldUseClusterCompact(fpIssues);
  const clusterText = compact ? formatClusterCompactSummary(clusters) : '';

  const fallback = (
    compact
      ? [
          deltaPlain ? `${deltaPlain}\n\n` : '',
          `Automation fingerprint incidents: ${fpIssues.length} open (cluster rollup)`,
          clusterText,
        ]
      : [
          deltaPlain ? `${deltaPlain}\n\n` : '',
          `Automation fingerprint incidents: ${fpIssues.length} open`,
          ...fpIssues.slice(0, 12).map((i) => {
            const sib = siblings.get(i.number) || [];
            return `#${i.number} ${i.title} ${i.url}${sib.length ? ` | siblings: ${sib.join(',')}` : ''}`;
          }),
        ]
  )
    .filter(Boolean)
    .join('\n')
    .slice(0, 3900);

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'Automation fingerprint digest', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Open:*\n${fpIssues.length}` },
        {
          type: 'mrkdwn',
          text: `*SLA buckets:*\n<24h: ${buckets.lt24h} · 1–7d: ${buckets.d1_7} · >7d: ${buckets.gt7d}`,
        },
      ],
    },
  ];
  if (compact) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Clusters:*\n${clusters.filter((c) => c.members.length > 1).length}` },
        { type: 'mrkdwn', text: `*Mode:*\ncompact rollup` },
      ],
    });
  }
  if (deltaPlain) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*Delta*\n${deltaPlain.slice(0, 2800)}` } });
  }
  if (compact) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Cluster summary*\n\`\`\`${clusterText.slice(0, 2800)}\`\`\``,
      },
    });
  } else {
    const topLines = fpIssues.slice(0, 8).map((i) => {
      const sib = siblings.get(i.number) || [];
      return `• <${i.url}|#${i.number}> ${i.title}${sib.length ? ` _(${sib.join(', ')})_` : ''}`;
    });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Top (hotness)*\n${topLines.join('\n') || '—'}` },
    });
  }
  if (truthy(process.env.DIGEST_SLACK_INCLUDE_TREND)) {
    const t = readJsonMaybe(trendPath);
    const hist = t && Array.isArray(t.history) ? t.history.slice(-6) : [];
    if (hist.length) {
      const text = hist
        .map((h) => {
          const d = h.generatedAt ? String(h.generatedAt).slice(0, 10) : '?';
          const o = h.open != null ? h.open : '—';
          const nc = h.newCount != null ? h.newCount : '—';
          const e =
            h.registryEma != null && Number.isFinite(Number(h.registryEma))
              ? Number(h.registryEma).toFixed(2)
              : '—';
          return `${d}  open=${o}  Δ=${nc}  EMA=${e}`;
        })
        .join('\n');
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Trend (last ${hist.length} runs)*\n\`\`\`${text.slice(0, 2800)}\`\`\``,
        },
      });
    }
  }
  return { text: fallback, blocks };
}

function buildDiscordEmbedPayload(fpIssues, delta, issueByNumber, siblings) {
  const buckets = bucketCounts(fpIssues);
  const deltaPlain =
    delta && (delta.newIssues.length || delta.resolved.length) ? formatDeltaPlain(delta, issueByNumber) : '';
  const clusters = computeLabelClusters(fpIssues);
  const compact = shouldUseClusterCompact(fpIssues);
  const clusterText = compact ? formatClusterCompactSummary(clusters) : '';
  const desc = compact
    ? clusterText.slice(0, 3800)
    : fpIssues
        .slice(0, 10)
        .map((i) => {
          const sib = siblings.get(i.number) || [];
          return `**#${i.number}** ${i.title}\n${i.url}${sib.length ? `\n_siblings: ${sib.join(', ')}_` : ''}`;
        })
        .join('\n\n')
        .slice(0, 3800);
  return {
    content: '\u200b',
    embeds: [
      {
        title: 'Automation fingerprint digest',
        color: 0x0366d6,
        fields: [
          { name: 'Open', value: String(fpIssues.length), inline: true },
          {
            name: 'SLA buckets',
            value: `<24h: ${buckets.lt24h} · 1–7d: ${buckets.d1_7} · >7d: ${buckets.gt7d}`,
            inline: true,
          },
          ...(deltaPlain
            ? [{ name: 'Delta', value: deltaPlain.slice(0, 1000), inline: false }]
            : []),
          { name: compact ? 'Cluster summary' : 'Issues', value: desc || '—', inline: false },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

async function notifyChannels(report, fpIssues, delta, issueByNumber) {
  const n = fpIssues.length;
  if (n === 0) return;
  const siblings = buildSiblingLookup(fpIssues);
  const clusters = computeLabelClusters(fpIssues);
  const compact = shouldUseClusterCompact(fpIssues);
  const clusterText = compact ? formatClusterCompactSummary(clusters) : '';
  const runnerSloLine =
    report && report.runnerSlo && report.runnerSlo.present
      ? `Runner SLO: failRate=${report.runnerSlo.failureRatePct ?? 'n/a'}% · mttr=${report.runnerSlo.mttrHours ?? 'n/a'}h · topReason=${report.runnerSlo.topReasonClass || 'n/a'}`
      : '';
  const runnerAnomalyLine =
    report && report.runnerAnomaly && report.runnerAnomaly.present && report.runnerAnomaly.anomalyDetected
      ? `Runner anomaly: ${String(report.runnerAnomaly.summary || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 220)}`
      : '';
  const runnerTelemetryLine = [runnerSloLine, runnerAnomalyLine].filter(Boolean).join(' · ');

  const deltaPlain =
    delta && (delta.newIssues.length || delta.resolved.length)
      ? formatDeltaPlain(delta, issueByNumber)
      : '';

  const lines = compact
    ? [
        `<b>Automation fingerprint incidents</b>`,
        deltaPlain ? `<pre>${escapeHtml(deltaPlain)}</pre>` : '',
        `Open: <b>${n}</b> (cluster rollup)`,
        runnerTelemetryLine ? escapeHtml(runnerTelemetryLine) : '',
        `<pre>${escapeHtml(clusterText)}</pre>`,
      ]
    : [
        `<b>Automation fingerprint incidents</b>`,
        deltaPlain ? `<pre>${escapeHtml(deltaPlain)}</pre>` : '',
        `Open: <b>${n}</b>`,
        runnerTelemetryLine ? escapeHtml(runnerTelemetryLine) : '',
        ...fpIssues.slice(0, 8).map((i) => {
          const sib = siblings.get(i.number) || [];
          return `${`#${i.number}`} — ${escapeHtml(i.title)}${sib.length ? ` (siblings: ${sib.join(', ')})` : ''}`;
        }),
        n > 8 ? `… +${n - 8} more` : '',
      ];
  const html = lines.filter(Boolean).join('\n');

  if (truthy(process.env.DIGEST_NOTIFY_TELEGRAM)) {
    const r = spawnSync(process.execPath, [path.join(root, 'automation', 'ai-telegram-notification-agent.cjs'), 'send', html], {
      encoding: 'utf8',
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (r.status !== 0) {
      console.warn('Telegram notify:', r.stderr || r.stdout || 'failed');
    }
  }

  const slackUrl = process.env.AUTOMATION_DIGEST_SLACK_WEBHOOK;
  if (slackUrl) {
    try {
      if (truthy(process.env.DIGEST_SLACK_USE_BLOCKS)) {
        const payload = buildSlackDigestPayload(fpIssues, delta, issueByNumber, siblings);
        const code = await postJsonUrl(slackUrl, { text: payload.text, blocks: payload.blocks });
        console.log('Slack blocks notify:', code);
      } else {
        const plain = compact
          ? `${deltaPlain ? `${deltaPlain}\n\n` : ''}Automation fingerprint incidents: ${n} open (cluster rollup)\n${
              runnerTelemetryLine ? `${runnerTelemetryLine}\n` : ''
            }${clusterText}`
          : `${deltaPlain ? `${deltaPlain}\n\n` : ''}Automation fingerprint incidents: ${n} open${
              runnerTelemetryLine ? `\n${runnerTelemetryLine}` : ''
            }\n${fpIssues
              .slice(0, 12)
              .map((i) => {
                const sib = siblings.get(i.number) || [];
                return `#${i.number} ${i.title} ${i.url}${sib.length ? ` | siblings: ${sib.join(',')}` : ''}`;
              })
              .join('\n')}`;
        await notifySlack(slackUrl, plain);
      }
    } catch (e) {
      console.warn('Slack notify failed:', e.message);
    }
  }

  const discordUrl = process.env.AUTOMATION_DIGEST_DISCORD_WEBHOOK;
  if (discordUrl) {
    try {
      if (truthy(process.env.DIGEST_DISCORD_USE_EMBEDS)) {
        const payload = buildDiscordEmbedPayload(fpIssues, delta, issueByNumber, siblings);
        const code = await postJsonUrl(discordUrl, payload);
        console.log('Discord embed notify:', code);
      } else {
        const plain = compact
          ? `${deltaPlain ? `${deltaPlain}\n\n` : ''}Automation fingerprint incidents: ${n} open (cluster rollup)\n${
              runnerTelemetryLine ? `${runnerTelemetryLine}\n` : ''
            }${clusterText}`
          : `${deltaPlain ? `${deltaPlain}\n\n` : ''}Automation fingerprint incidents: ${n} open${
              runnerTelemetryLine ? `\n${runnerTelemetryLine}` : ''
            }\n${fpIssues
              .slice(0, 12)
              .map((i) => {
                const sib = siblings.get(i.number) || [];
                return `#${i.number} ${i.title} ${i.url}${sib.length ? ` | siblings: ${sib.join(',')}` : ''}`;
              })
              .join('\n')}`;
        await notifyDiscord(discordUrl, plain);
      }
    } catch (e) {
      console.warn('Discord notify failed:', e.message);
    }
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function main() {
  const extras = loadExtras();
  const dryRun = truthy(process.env.DIGEST_DRY_RUN);

  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    const stub = {
      generatedAt: new Date().toISOString(),
      skipped: true,
      reason: 'No GH_TOKEN/GITHUB_TOKEN; digest not generated locally.',
      issues: [],
    };
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(stub, null, 2));
    fs.writeFileSync(
      mdPath,
      '# Automation fingerprint incidents\n\n_Skipped: no GitHub token in environment._\n'
    );
    appendGithubOutput('has_fp_incidents', 'false');
    console.log('Digest skipped (no token).');
    return;
  }

  const limit = String(process.env.DIGEST_LIMIT || '300');
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

  const fpIssues = issues
    .map((issue) => {
      const fpLabels = (issue.labels || [])
        .map((l) => (typeof l === 'string' ? l : l.name))
        .filter((name) => name && name.startsWith('automation-fp-'));
      return fpLabels.length ? { ...issue, automationFpLabels: fpLabels } : null;
    })
    .filter(Boolean);

  const lastDigestState = readJsonMaybe(digestLastStatePath);
  const currentNumbers = fpIssues.map((i) => i.number);
  const delta = computeDigestDelta(currentNumbers, lastDigestState);
  const issueByNumber = new Map(fpIssues.map((i) => [i.number, i]));

  const prevHotness = readJsonMaybe(hotnessStatePath);
  const counts = bumpHotnessCounts(fpIssues, prevHotness).counts;
  const fpSorted = sortByHotness(fpIssues, counts);
  const sev = escalationSeverity(fpIssues);
  const { ema: registryEma } = readRegistryEma();
  const runnerSlo = computeRunnerSloDigestSummary();
  const runnerAnomaly = computeRunnerAnomalyDigestSummary();

  const report = {
    generatedAt: new Date().toISOString(),
    openWithFingerprintLabel: fpIssues.length,
    escalationSeverity: sev,
    registry: {
      emaOpenIncidents: registryEma,
    },
    delta: {
      newIssues: delta.newIssues,
      resolved: delta.resolved,
      hadPrevious: delta.hadPrevious,
    },
    runnerSlo,
    runnerAnomaly,
    issues: fpSorted.map((i) => ({
      number: i.number,
      title: i.title,
      url: i.url,
      updatedAt: i.updatedAt,
      automationFpLabels: i.automationFpLabels,
      ageBucket: ageBucketMs(i.updatedAt),
      hotnessScore: hotnessScore(i, counts),
      suggestedAssignee: resolveAssigneeForIssue(i, extras) || null,
      runbookUrl: resolveRunbookForIssue(i, extras) || null,
    })),
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  appendTrendSnapshot({
    generatedAt: report.generatedAt,
    open: fpIssues.length,
    newCount: delta.newIssues.length,
    resolvedCount: delta.resolved.length,
    severity: sev || 'none',
    registryEma: registryEma != null ? registryEma : null,
  });

  const lines = [
    '# Automation fingerprint incidents',
    '',
    `_Generated: ${report.generatedAt}_`,
    '',
    `Open issues with an \`automation-fp-*\` label: **${fpIssues.length}**`,
    '',
  ];

  if (delta.newIssues.length || delta.resolved.length) {
    lines.push('## Delta since last run');
    lines.push('');
    for (const n of delta.newIssues) {
      const i = issueByNumber.get(n);
      lines.push(`- **New:** [#${n}](${i ? i.url : '#'}) — ${i ? i.title : '?'}`);
    }
    for (const n of delta.resolved) {
      lines.push(`- **Resolved / closed:** #${n}`);
    }
    lines.push('');
  }

  if (runnerSlo.present) {
    lines.push('## OpenClaw runner SLO (cache-backed history)');
    lines.push('');
    lines.push(`- Samples considered: **${runnerSlo.sampleCount}** (latest bounded window)`);
    lines.push(`- Failure rate: **${runnerSlo.failureRatePct ?? 'n/a'}%** (${runnerSlo.failureCount}/${runnerSlo.sampleCount})`);
    lines.push(`- Median recovery (MTTR): **${runnerSlo.mttrHours ?? 'n/a'}h**`);
    lines.push(`- Top recurring reason class: **${runnerSlo.topReasonClass || 'n/a'}**`);
    lines.push('');
  }

  if (runnerAnomaly.present && runnerAnomaly.anomalyDetected) {
    lines.push('## OpenClaw runner anomaly (latest evaluation)');
    lines.push('');
    lines.push(`- Summary: **${runnerAnomaly.summary || 'n/a'}**`);
    if (runnerAnomaly.generatedAt) {
      lines.push(`- Report time: \`${runnerAnomaly.generatedAt}\``);
    }
    for (const a of runnerAnomaly.alerts.slice(0, 8)) {
      lines.push(`- ${a}`);
    }
    lines.push('');
  }

  for (const i of report.issues) {
    lines.push(`- [#${i.number}](${i.url}) — ${i.title}`);
    lines.push(`  - Labels: ${i.automationFpLabels.join(', ')}`);
    lines.push(`  - Updated: ${i.updatedAt} · bucket: \`${i.ageBucket}\` · hotness: ${i.hotnessScore.toFixed(1)}`);
    if (i.runbookUrl) lines.push(`  - Runbook: ${i.runbookUrl}`);
    if (i.suggestedAssignee) lines.push(`  - Suggested assignee (config): @${i.suggestedAssignee}`);
    lines.push('');
  }

  if (fpIssues.length === 0) {
    lines.push('_No open fingerprint-tagged incidents._');
    lines.push('');
  }

  if (registryEma != null) {
    lines.push(`_Suppression registry EMA (open): **${registryEma.toFixed(2)}**_`);
    lines.push('');
  }

  fs.writeFileSync(mdPath, lines.join('\n'));
  console.log(`Wrote ${path.relative(root, jsonPath)} (${fpIssues.length} issue(s)).`);

  appendGithubOutput('has_fp_incidents', fpIssues.length > 0 ? 'true' : 'false');

  writeHotnessState({ counts, updatedAt: report.generatedAt });

  if (!dryRun) {
    applySuggestedAssignees(fpIssues, extras);
    applyDeltaIssueLabels(delta);
    addDeltaIssuesToProject(delta, issueByNumber);
  } else {
    console.log('DIGEST_DRY_RUN: skipping assignee/project/label mutations.');
  }

  const deltaSkip =
    truthy(process.env.DIGEST_DELTA_NOTIFY_ONLY) &&
    delta.hadPrevious &&
    delta.newIssues.length === 0 &&
    delta.resolved.length === 0;

  if (!dryRun && !deltaSkip) {
    try {
      await notifyChannels(report, fpSorted, delta, issueByNumber);
    } catch (e) {
      console.warn('notifyChannels:', e.message);
    }
  } else if (dryRun) {
    console.log('DIGEST_DRY_RUN: skipping Slack/Discord/Telegram notifications.');
  } else {
    console.log('DIGEST_DELTA_NOTIFY_ONLY: no new/resolved delta; skipping Slack/Discord/Telegram.');
  }

  let rollupNumber = null;
  if (!dryRun && truthy(process.env.DIGEST_ROLLUP_ISSUE)) {
    try {
      rollupNumber = upsertRollupIssue(fpSorted, report.generatedAt, extras);
    } catch (e) {
      console.warn('upsertRollupIssue:', e.message);
    }
  }

  if (!dryRun) {
    commentRollupRunnerAnomaly(rollupNumber, report.runnerAnomaly);
    commentRollupCriticalDelta(rollupNumber, sev, delta, issueByNumber);
    maybeEmaSiblingComment(fpSorted, registryEma);
    commentOpenAutomationPrsOnCritical(sev);
  } else {
    console.log('DIGEST_DRY_RUN: skipping rollup + issue/PR comments.');
  }

  const escalationConfigured =
    process.env.DIGEST_ESCALATION_SLACK_WEBHOOK ||
    process.env.DIGEST_ESCALATION_GENERIC_WEBHOOK ||
    process.env.DIGEST_ESCALATION_PAGERDUTY_ROUTING_KEY ||
    process.env.DIGEST_ESCALATION_CRITICAL_SLACK_WEBHOOK ||
    process.env.DIGEST_ESCALATION_CRITICAL_GENERIC_WEBHOOK ||
    process.env.DIGEST_ESCALATION_CRITICAL_PAGERDUTY_ROUTING_KEY;

  if (!dryRun && fpIssues.length > 0 && sev && escalationConfigured && escalationCooldownAllows(report.generatedAt)) {
    try {
      await notifyEscalation(fpIssues, sev);
      writeEscalationState(report.generatedAt, fpIssues, sev);
    } catch (e) {
      console.warn('notifyEscalation:', e.message);
    }
  } else if (dryRun) {
    console.log('DIGEST_DRY_RUN: skipping escalation webhooks.');
  }

  writeDigestLastState(currentNumbers, report.generatedAt);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
