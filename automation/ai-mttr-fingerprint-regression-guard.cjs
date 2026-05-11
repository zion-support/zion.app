#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'automation-open-issues-index-latest.json');
const STATE = path.join(ROOT, 'automation', 'reports', 'mttr-fingerprint-regression-state.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'mttr-fingerprint-regression-latest.json');
const EXPLAIN = path.join(
  ROOT,
  'automation',
  'reports',
  'mttr-fingerprint-suppression-explainability-latest.json',
);
const BODY = path.join(ROOT, 'automation', 'reports', 'mttr-fingerprint-regression-body.md');
const EXTRAS = path.join(ROOT, 'automation', 'config', 'automation-fingerprint-digest-extras.json');
let meshHelpers = null;
try {
  meshHelpers = require('./lib/incident-cooldown-mesh.cjs');
} catch {
  meshHelpers = null;
}

function readJson(p, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}
function writeJson(p, payload) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}
const round2 = (n) => Math.round(n * 100) / 100;
const toSlug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
const hoursSince = (iso) => {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? (Date.now() - t) / 3600000 : Infinity;
};
function runNode(script, env) {
  return spawnSync('node', [script], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env } });
}
function runGh(args) {
  return spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8', env: process.env });
}
function scorePriority({ severity, deltaHours, regressionStreak }) {
  const sev = severity === 'critical' ? 200 : 100;
  const delta = Math.max(0, Number(deltaHours || 0)) * 10;
  const streak = Math.max(0, Number(regressionStreak || 0)) * 8;
  return round2(sev + delta + streak);
}
function syncIssueSeverityLabels(issueFingerprint, severity) {
  const listed = runGh([
    'issue',
    'list',
    '--state',
    'open',
    '--search',
    issueFingerprint,
    '--json',
    'number,labels',
    '--limit',
    '1',
  ]);
  if (listed.status !== 0) return { ok: false, reason: 'list-failed' };
  let rows = [];
  try {
    rows = JSON.parse(listed.stdout || '[]');
  } catch {
    return { ok: false, reason: 'parse-failed' };
  }
  if (!Array.isArray(rows) || rows.length === 0) return { ok: true, reason: 'no-open-issue' };
  const issue = rows[0];
  const labels = new Set((issue.labels || []).map((l) => l.name));
  const add = severity === 'critical' ? 'automation-slo-critical' : 'automation-slo-warning';
  const remove = severity === 'critical' ? 'automation-slo-warning' : 'automation-slo-critical';
  const args = ['issue', 'edit', String(issue.number)];
  if (!labels.has(add)) args.push('--add-label', add);
  if (labels.has(remove)) args.push('--remove-label', remove);
  if (args.length <= 3) return { ok: true, reason: 'already-synced' };
  const edited = runGh(args);
  return { ok: edited.status === 0, reason: edited.status === 0 ? 'updated' : 'edit-failed' };
}
function getOpenIssueNumberByFingerprint(issueFingerprint) {
  const listed = runGh([
    'issue',
    'list',
    '--state',
    'open',
    '--search',
    issueFingerprint,
    '--json',
    'number',
    '--limit',
    '1',
  ]);
  if (listed.status !== 0) return null;
  try {
    const rows = JSON.parse(listed.stdout || '[]');
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return Number(rows[0].number || 0) || null;
  } catch {
    return null;
  }
}
function commentSeverityTransition(issueNumber, fromSeverity, toSeverity, details = {}) {
  if (!issueNumber || !fromSeverity || !toSeverity || fromSeverity === toSeverity) return;
  const body = [
    '### MTTR severity transition',
    '',
    `- from: **${fromSeverity}**`,
    `- to: **${toSeverity}**`,
    details.deltaHours != null ? `- delta: ${details.deltaHours > 0 ? '+' : ''}${details.deltaHours}h` : '',
    details.regressionStreak != null ? `- regression streak: ${details.regressionStreak}` : '',
    details.priorityScore != null ? `- priority score: ${details.priorityScore}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  runGh(['issue', 'comment', String(issueNumber), '--body', body]);
}
function loadExtras() {
  const j = readJson(EXTRAS, {});
  return { runbookRules: Array.isArray(j?.runbookRules) ? j.runbookRules : [] };
}
function resolveRunbookForLabel(label, extras) {
  const lower = String(label || '').toLowerCase();
  let fallback = null;
  for (const r of extras.runbookRules || []) {
    if (!r || !r.url) continue;
    if (r.default) fallback = r.url;
    const terms = Array.isArray(r.matchTitleContains) ? r.matchTitleContains : [];
    if (terms.some((x) => lower.includes(String(x || '').toLowerCase()))) return r.url;
  }
  return fallback;
}

function main() {
  const deltaThreshold = Math.max(0.5, Number(process.env.MTTR_FP_REGRESSION_DELTA_HOURS || 6));
  const streakThreshold = Math.max(1, Number(process.env.MTTR_FP_REGRESSION_STREAK || 2));
  const minSamples = Math.max(1, Number(process.env.MTTR_FP_MIN_SAMPLES || 3));
  const topLimit = Math.max(1, Number(process.env.MTTR_FP_TOP_LIMIT || 12));
  const maxEscalations = Math.max(1, Number(process.env.MTTR_FP_MAX_ESCALATIONS_PER_RUN || 3));
  const cooldownHours = Math.max(1, Number(process.env.MTTR_FP_COOLDOWN_HOURS || 24));
  const meshSuppressionHours = Math.max(1, Number(process.env.MTTR_FP_MESH_SUPPRESSION_HOURS || 8));
  const criticalDeltaHours = Math.max(deltaThreshold, Number(process.env.MTTR_FP_CRITICAL_DELTA_HOURS || 18));
  const criticalStreak = Math.max(streakThreshold, Number(process.env.MTTR_FP_CRITICAL_STREAK || 3));

  const idx = readJson(REPORT, {});
  const rows = (Array.isArray(idx?.mttr?.byFingerprint) ? idx.mttr.byFingerprint : [])
    .filter((r) => typeof r?.label === 'string' && Number(r.samples || 0) >= minSamples && Number.isFinite(Number(r.avgHours)))
    .slice(0, topLimit)
    .map((r) => ({ label: r.label, avgHours: Number(r.avgHours), samples: Number(r.samples || 0) }));

  const prev = readJson(STATE, { entries: {} });
  const entries = prev?.entries && typeof prev.entries === 'object' ? prev.entries : {};
  const extras = loadExtras();
  const mesh = meshHelpers?.loadMesh ? meshHelpers.loadMesh() : { fingerprints: {} };
  const observed = [];
  const escalated = [];
  const recovered = [];
  let escalationBudget = maxEscalations;

  for (const row of rows) {
    const prior = entries[row.label] || {};
    const priorAvg = Number(prior.lastAvgHours);
    const hasPrior = Number.isFinite(priorAvg);
    const deltaHours = hasPrior ? round2(row.avgHours - priorAvg) : null;
    const worsening = deltaHours != null && deltaHours >= deltaThreshold;
    const prevStreak = Number(prior.regressionStreak || 0);
    const streak = worsening ? prevStreak + 1 : 0;
    const issueFingerprint = `automation-mttr-fp-regression|${toSlug(row.label)}|v1`;
    const meshFingerprint = `automation-mttr-fp-regression|${toSlug(row.label)}`;
    const runbookUrl = resolveRunbookForLabel(row.label, extras);
    const priorOpen = prevStreak >= streakThreshold;
    const nowOpen = streak >= streakThreshold;
    const severity = deltaHours != null && deltaHours >= criticalDeltaHours && streak >= criticalStreak ? 'critical' : 'warning';
    const priorityScore = scorePriority({ severity, deltaHours, regressionStreak: streak });

    entries[row.label] = {
      label: row.label,
      lastAvgHours: row.avgHours,
      lastSamples: row.samples,
      lastDeltaHours: deltaHours,
      regressionStreak: streak,
      issueFingerprint,
      runbookUrl: runbookUrl || null,
      lastEscalatedAt: prior.lastEscalatedAt || null,
      lastUpdatedAt: new Date().toISOString(),
      lastSeverity: severity,
    };
    observed.push({
      label: row.label,
      avgHours: row.avgHours,
      prevAvgHours: hasPrior ? priorAvg : null,
      deltaHours,
      samples: row.samples,
      regressionStreak: streak,
      runbookUrl: runbookUrl || null,
      severity,
      priorityScore,
      status: nowOpen ? 'regressing' : 'stable',
    });

    if (!nowOpen && priorOpen && prior.issueFingerprint) {
      const closeRes = runNode('scripts/automation/gh-issue-close-on-recovery.cjs', {
        ISSUE_FINGERPRINT: prior.issueFingerprint,
        CLOSE_COMMENT: `Auto-closing: MTTR fingerprint recovered/stabilized for ${row.label}.`,
      });
      if (closeRes.status === 0) recovered.push({ label: row.label, issueFingerprint: prior.issueFingerprint });
    }

    if (!nowOpen || escalationBudget <= 0) continue;
    const priorSeverity = String(prior.lastSeverity || '');
    const syncRes = syncIssueSeverityLabels(issueFingerprint, severity);
    observed[observed.length - 1].labelSync = syncRes.reason;
    if (priorSeverity && priorSeverity !== severity) {
      const issueNumber = getOpenIssueNumberByFingerprint(issueFingerprint);
      commentSeverityTransition(issueNumber, priorSeverity, severity, {
        deltaHours,
        regressionStreak: streak,
        priorityScore,
      });
      observed[observed.length - 1].severityTransition = `${priorSeverity}->${severity}`;
    }
    if (hoursSince(prior.lastEscalatedAt) < cooldownHours) continue;
    const suppression = meshHelpers?.shouldSuppressEscalation
      ? meshHelpers.shouldSuppressEscalation(meshFingerprint, {
          windowHours: meshSuppressionHours,
          currentPriority: priorityScore,
        })
      : { suppress: false };
    if (suppression?.suppress) {
      observed[observed.length - 1].status = 'suppressed';
      observed[observed.length - 1].suppressionReason = suppression.reason || 'mesh';
      observed[observed.length - 1].suppressedByPriority = suppression.competingPriority ?? null;
      const winnerFp = String(suppression.reason || '').startsWith('mesh:')
        ? String(suppression.reason).slice(5)
        : null;
      const winnerRow = winnerFp ? mesh?.fingerprints?.[winnerFp] : null;
      observed[observed.length - 1].suppressionWinnerFingerprint = winnerFp;
      observed[observed.length - 1].suppressionWinnerAt = winnerRow?.lastEscalationAt || null;
      observed[observed.length - 1].suppressionWinnerMeta = winnerRow?.meta || null;
      continue;
    }

    const body = [
      '## MTTR fingerprint regression',
      '',
      `- **Fingerprint label:** \`${row.label}\``,
      `- **Dedupe key:** \`${issueFingerprint}\``,
      `- **Current MTTR:** ${row.avgHours}h`,
      `- **Previous MTTR:** ${hasPrior ? `${priorAvg}h` : 'n/a'}`,
      `- **Delta:** ${deltaHours == null ? 'n/a' : `${deltaHours > 0 ? '+' : ''}${deltaHours}h`}`,
      `- **Samples:** ${row.samples}`,
      `- **Regression streak:** ${streak} (threshold ${streakThreshold})`,
      '',
      runbookUrl ? `- **Runbook:** ${runbookUrl}` : '- **Runbook:** n/a',
    ].join('\n');
    fs.writeFileSync(BODY, `${body}\n`, 'utf8');

    const issueRes = runNode('scripts/automation/gh-issue-dedupe-or-create.cjs', {
      ISSUE_TITLE: `Automation MTTR fingerprint regression: ${row.label}`,
      ISSUE_BODY_FILE: BODY,
      ISSUE_FINGERPRINT: issueFingerprint,
      ISSUE_LABELS:
        severity === 'critical'
          ? 'bug,automation,automation-slo-critical'
          : 'bug,automation,automation-slo-warning',
      COOLDOWN_HOURS: String(cooldownHours),
    });
    if (issueRes.status === 0) {
      entries[row.label].lastEscalatedAt = new Date().toISOString();
      escalated.push({ label: row.label, deltaHours, regressionStreak: streak, issueFingerprint, severity });
      if (meshHelpers?.recordEscalation) {
        meshHelpers.recordEscalation(meshFingerprint, {
          meta: { label: row.label, severity, deltaHours, regressionStreak: streak, priorityScore },
        });
      }
      escalationBudget -= 1;
    }
  }

  for (const [label, prior] of Object.entries(entries)) {
    const stillPresent = rows.some((r) => r.label === label);
    if (stillPresent) continue;
    const wasOpen = Number(prior?.regressionStreak || 0) >= streakThreshold;
    entries[label] = { ...prior, regressionStreak: 0, lastUpdatedAt: new Date().toISOString() };
    if (wasOpen && prior?.issueFingerprint) {
      const closeRes = runNode('scripts/automation/gh-issue-close-on-recovery.cjs', {
        ISSUE_FINGERPRINT: prior.issueFingerprint,
        CLOSE_COMMENT: `Auto-closing: MTTR fingerprint recovered/stabilized for ${label}.`,
      });
      if (closeRes.status === 0) recovered.push({ label, issueFingerprint: prior.issueFingerprint });
    }
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    config: {
      deltaHoursThreshold: deltaThreshold,
      streakThreshold,
      minSamples,
      topLimit,
      maxEscalations,
      cooldownHours,
      meshSuppressionHours,
      criticalDeltaHours,
      criticalStreak,
    },
    observed,
    escalated,
    recovered,
  };
  writeJson(STATE, { updatedAt: snapshot.generatedAt, config: snapshot.config, entries });
  writeJson(OUT, snapshot);
  const suppressed = observed.filter((x) => x.status === 'suppressed');
  writeJson(EXPLAIN, {
    generatedAt: snapshot.generatedAt,
    summary: {
      observed: observed.length,
      suppressed: suppressed.length,
      escalated: escalated.length,
      recovered: recovered.length,
    },
    suppressed: suppressed.map((r) => ({
      label: r.label,
      severity: r.severity,
      priorityScore: r.priorityScore ?? null,
      suppressionReason: r.suppressionReason ?? null,
      suppressedByPriority: r.suppressedByPriority ?? null,
      suppressionWinnerFingerprint: r.suppressionWinnerFingerprint ?? null,
      suppressionWinnerAt: r.suppressionWinnerAt ?? null,
      suppressionWinnerMeta: r.suppressionWinnerMeta ?? null,
      deltaHours: r.deltaHours ?? null,
      regressionStreak: r.regressionStreak ?? null,
    })),
  });
  console.log('mttr-fp-regression-guard:', JSON.stringify({ observed: observed.length, escalated: escalated.length, recovered: recovered.length }));
}

main();
