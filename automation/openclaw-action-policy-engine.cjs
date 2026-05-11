#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const INPUT_QUEUE = path.join(REPORTS, 'openclaw-action-queue-latest.json');
const OUTPUT = path.join(REPORTS, 'openclaw-action-policy-latest.json');
const APPROVED_QUEUE = path.join(REPORTS, 'openclaw-action-approved-queue-latest.json');
const POLICY_HISTORY = path.join(REPORTS, 'openclaw-action-policy-history.json');

const MIN_CONFIDENCE = Number.parseFloat(process.env.OPENCLAW_POLICY_MIN_CONFIDENCE || '0.6');
const ALLOW_HIGH_SEVERITY = process.env.OPENCLAW_POLICY_ALLOW_HIGH === '1';
const MAX_APPROVED = Math.max(1, Number.parseInt(process.env.OPENCLAW_POLICY_MAX_APPROVED || '12', 10));
const ALLOWLIST = new Set(
  String(
    process.env.OPENCLAW_POLICY_ALLOWLIST_COMMANDS ||
      'npm run lint:check,npm run type-check,npm run test:ci,npm run reports:aggregate,npm run seo:audit,npm run automation:audit-summary,npm run build:lock:check,npm run build:lock:heal'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

/** Commands considered safe on section_scoped hot files (read-only / bounded). */
const ULTRA_SAFE_HOT = /npm run (lint:check|type-check|test:ci|build:lock:check|build:lock:heal)\b/;
/** Extra safe commands for append_only_preferred hot files. */
const MEDIUM_SAFE_HOT =
  /npm run (reports:aggregate|seo:audit|automation:audit-summary|smoke:routes:check|ai-lab:integrity-check)\b/;
const IGNORE_PATCH_MODE = process.env.OPENCLAW_POLICY_IGNORE_PATCH_MODE === '1';

function readJson(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function scorePriority(item) {
  const severity = String(item.severity || 'unknown');
  const severityScore = severity === 'critical' ? 40 : severity === 'high' ? 30 : severity === 'medium' ? 20 : severity === 'low' ? 10 : 5;
  const confidence = Number.isFinite(Number(item.confidence)) ? Number(item.confidence) : 0;
  return severityScore + confidence * 50;
}

function evaluate(item) {
  const reasons = [];
  const command = String(item.recommendedCommand || '').trim();
  const confidence = Number.isFinite(Number(item.confidence)) ? Number(item.confidence) : 0;
  const severity = String(item.severity || 'unknown').toLowerCase();

  if (!command) reasons.push('missing_command');
  if (command && !ALLOWLIST.has(command)) reasons.push('command_not_allowlisted');
  if (confidence < MIN_CONFIDENCE) reasons.push('confidence_below_threshold');
  if ((severity === 'critical' || severity === 'high') && !ALLOW_HIGH_SEVERITY) reasons.push('high_severity_requires_override');
  if (String(item.source || '') === 'legacy-snippet') reasons.push('legacy_snippet_requires_review');

  const patchMode = String(item.patchMode || '').trim();
  if (!IGNORE_PATCH_MODE && patchMode && item.targetPath) {
    if (patchMode === 'section_scoped') {
      if (!ULTRA_SAFE_HOT.test(command)) {
        reasons.push('hot_file_section_scoped');
      }
    } else if (patchMode === 'append_only_preferred') {
      if (!ULTRA_SAFE_HOT.test(command) && !MEDIUM_SAFE_HOT.test(command)) {
        reasons.push('hot_file_append_only_preferred');
      }
    }
  }

  return {
    id: item.id,
    ok: reasons.length === 0,
    reasons,
    command,
    severity,
    confidence,
    score: scorePriority(item),
  };
}

function main() {
  const queueData = readJson(INPUT_QUEUE, { queue: [] });
  const queue = Array.isArray(queueData.queue) ? queueData.queue : [];
  const evaluations = queue.map((item) => ({ item, policy: evaluate(item) }));

  const approved = evaluations
    .filter((entry) => entry.policy.ok)
    .sort((a, b) => b.policy.score - a.policy.score)
    .slice(0, MAX_APPROVED)
    .map((entry) => ({ ...entry.item, policyScore: entry.policy.score, policyApprovedAt: new Date().toISOString() }));

  const denied = evaluations
    .filter((entry) => !entry.policy.ok)
    .map((entry) => ({
      id: entry.item.id,
      sourceWorker: entry.item.sourceWorker,
      summary: entry.item.summary,
      reasons: entry.policy.reasons,
      command: entry.policy.command,
      severity: entry.policy.severity,
      confidence: entry.policy.confidence,
    }));

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceQueue: INPUT_QUEUE,
    patchModeEnforcement: !IGNORE_PATCH_MODE,
    minConfidence: MIN_CONFIDENCE,
    allowHighSeverity: ALLOW_HIGH_SEVERITY,
    allowlistSize: ALLOWLIST.size,
    totalInput: queue.length,
    totalApproved: approved.length,
    totalDenied: denied.length,
    approvedIds: approved.map((item) => item.id),
    denied,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));

  try {
    const reasonCounts = {};
    for (const d of denied) {
      for (const r of d.reasons || []) {
        reasonCounts[r] = (reasonCounts[r] || 0) + 1;
      }
    }
    const hist = readJson(POLICY_HISTORY, { entries: [] });
    const entries = Array.isArray(hist.entries) ? hist.entries : [];
    entries.push({
      at: payload.generatedAt,
      totalInput: payload.totalInput,
      totalApproved: payload.totalApproved,
      totalDenied: payload.totalDenied,
      reasonCounts,
    });
    const keep = Math.max(20, Number.parseInt(process.env.OPENCLAW_POLICY_HISTORY_MAX || '200', 10));
    fs.writeFileSync(
      POLICY_HISTORY,
      JSON.stringify({ entries: entries.slice(-keep) }, null, 2),
    );
  } catch {
    /* non-fatal */
  }

  fs.writeFileSync(
    APPROVED_QUEUE,
    JSON.stringify(
      {
        generatedAt: payload.generatedAt,
        sourcePolicy: OUTPUT,
        totalQueued: approved.length,
        queue: approved,
      },
      null,
      2
    )
  );
  console.log(`Openclaw action policy report: ${OUTPUT}`);
  console.log(`Openclaw approved queue: ${APPROVED_QUEUE} (${approved.length} items)`);
}

main();
