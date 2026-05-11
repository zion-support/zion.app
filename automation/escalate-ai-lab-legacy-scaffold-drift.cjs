#!/usr/bin/env node

/**
 * Escalate when AI Lab legacy scaffold candidate count is above threshold.
 * - Threshold: AI_LAB_LEGACY_SCAFFOLD_THRESHOLD unset / empty / "auto" → rolling dynamic from scan history
 * - Cross-workflow cooldown: optional mesh + observability-webhook-state (see automation/lib/incident-cooldown-mesh.cjs)
 * Uses deduped GitHub issues via scripts/automation/gh-issue-dedupe-or-create.cjs.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  recordEscalation,
  shouldSuppressLegacyEscalation,
} = require('./lib/incident-cooldown-mesh.cjs');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'ai-lab-legacy-scaffold-scan-latest.json');
const HISTORY = path.join(ROOT, 'automation', 'reports', 'ai-lab-legacy-scaffold-scan-history.json');
const WATCHDOG = path.join(ROOT, 'automation', 'reports', 'ai-lab-legacy-scaffold-watchdog-latest.json');
const DEDUPE = path.join(ROOT, 'scripts', 'automation', 'gh-issue-dedupe-or-create.cjs');

function runNode(args, env) {
  return spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function readHistoryCounts() {
  try {
    const rows = JSON.parse(fs.readFileSync(HISTORY, 'utf8'));
    if (!Array.isArray(rows)) return [];
    return rows.map((r) => Number(r.count ?? 0));
  } catch {
    return [];
  }
}

function computeDynamicThreshold(counts) {
  const win = Math.max(3, Number(process.env.AI_LAB_LEGACY_DYNAMIC_WINDOW || 14));
  const slice = counts.slice(-win);
  if (slice.length < 3) {
    return Math.max(0, Number(process.env.AI_LAB_LEGACY_SCAFFOLD_THRESHOLD_DEFAULT || 8));
  }
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / slice.length;
  const std = Math.sqrt(variance);
  const raw = mean + 1.5 * std;
  const floor = Number(process.env.AI_LAB_LEGACY_DYNAMIC_MIN || 3);
  const ceil = Number(process.env.AI_LAB_LEGACY_DYNAMIC_MAX || 48);
  return Math.min(ceil, Math.max(floor, Math.ceil(raw)));
}

function resolveThreshold() {
  const raw = process.env.AI_LAB_LEGACY_SCAFFOLD_THRESHOLD;
  if (raw === undefined || raw === '' || /^auto$/i.test(String(raw))) {
    const counts = readHistoryCounts();
    const t = computeDynamicThreshold(counts);
    return { value: t, mode: 'dynamic', historySamples: counts.length };
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    console.warn('[ai-lab-legacy-scaffold-drift] invalid AI_LAB_LEGACY_SCAFFOLD_THRESHOLD; falling back to dynamic');
    const counts = readHistoryCounts();
    return { value: computeDynamicThreshold(counts), mode: 'dynamic-fallback', historySamples: counts.length };
  }
  return { value: n, mode: 'fixed', historySamples: readHistoryCounts().length };
}

function writeWatchdog(payload) {
  fs.mkdirSync(path.dirname(WATCHDOG), { recursive: true });
  const row = {
    at: new Date().toISOString(),
    ...payload,
  };
  fs.writeFileSync(WATCHDOG, `${JSON.stringify(row, null, 2)}\n`, 'utf8');
}

function closeOnRecovery(threshold) {
  const closer = path.join(ROOT, 'scripts', 'automation', 'gh-issue-close-on-recovery.cjs');
  const res = runNode([closer], {
    ISSUE_FINGERPRINT: 'ai-lab-legacy-scaffold-drift',
    CLOSE_COMMENT: `Auto-closing: AI Lab legacy scaffold drift is back within threshold (${threshold}).`,
  });
  if (res.status !== 0) {
    console.warn('[ai-lab-legacy-scaffold-drift] close-on-recovery skipped/non-fatal');
  }
}

function main() {
  if (!fs.existsSync(REPORT)) {
    console.error('[ai-lab-legacy-scaffold-drift] Missing report:', REPORT);
    process.exit(1);
  }
  if (!fs.existsSync(DEDUPE)) {
    console.error('[ai-lab-legacy-scaffold-drift] Missing dedupe script:', DEDUPE);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  const count = Number(report.count || 0);
  const { value: THRESHOLD, mode: thresholdMode, historySamples } = resolveThreshold();

  if (count <= THRESHOLD) {
    console.log(
      `[ai-lab-legacy-scaffold-drift] within threshold (${count} <= ${THRESHOLD}, mode=${thresholdMode}); attempting close-on-recovery`
    );
    writeWatchdog({
      count,
      threshold: THRESHOLD,
      thresholdMode,
      historySamples,
      escalated: false,
      meshSuppressed: false,
      withinThreshold: true,
    });
    closeOnRecovery(THRESHOLD);
    return;
  }

  const mesh = shouldSuppressLegacyEscalation('ai-lab-legacy-scaffold-drift');
  if (mesh.suppress) {
    console.log(
      `[ai-lab-legacy-scaffold-drift] mesh suppressed escalation (${mesh.reason} @ ${mesh.lastAt || 'n/a'})`
    );
    writeWatchdog({
      count,
      threshold: THRESHOLD,
      thresholdMode,
      historySamples,
      escalated: false,
      meshSuppressed: true,
      meshReason: mesh.reason,
      meshLastAt: mesh.lastAt || null,
      withinThreshold: false,
    });
    return;
  }

  const title = '[automation] AI Lab legacy scaffold drift above threshold';
  const rows = Array.isArray(report.candidates) ? report.candidates.slice(0, 30) : [];
  const detail = rows.map((r) => `- \`${r.path || r.file || 'unknown'}\``).join('\n');
  const body = [
    'AI Lab legacy scaffold scan is above threshold.',
    '',
    `- Threshold: ${THRESHOLD} (${thresholdMode})`,
    `- Current count: ${count}`,
    `- Report at: ${report.at || 'n/a'}`,
    '',
    '## Top candidates',
    detail || '- none',
    '',
    'Runbook: migrate safe candidates with `npm run ai-lab:legacy-scaffold-migrate:apply` (exact-template only).',
  ].join('\n');

  const tmp = path.join(ROOT, 'automation', 'reports', '.runtime', 'ai-lab-legacy-scaffold-drift-body.md');
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  fs.writeFileSync(tmp, `${body}\n`, 'utf8');

  const res = runNode([DEDUPE], {
    ISSUE_TITLE: title,
    ISSUE_BODY_FILE: tmp,
    ISSUE_LABELS: 'automation,ai-lab',
    ISSUE_FINGERPRINT: 'ai-lab-legacy-scaffold-drift',
    COOLDOWN_HOURS: String(process.env.COOLDOWN_HOURS || '12'),
  });

  process.stdout.write(res.stdout || '');
  process.stderr.write(res.stderr || '');
  if (res.status !== 0) {
    writeWatchdog({
      count,
      threshold: THRESHOLD,
      thresholdMode,
      historySamples,
      escalated: false,
      meshSuppressed: false,
      dedupeExit: res.status,
      error: true,
    });
    process.exit(res.status);
  }

  recordEscalation('ai-lab-legacy-scaffold-drift', {
    meta: { count, threshold: THRESHOLD },
  });
  writeWatchdog({
    count,
    threshold: THRESHOLD,
    thresholdMode,
    historySamples,
    escalated: true,
    meshSuppressed: false,
    withinThreshold: false,
  });
}

main();
