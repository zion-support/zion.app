#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Single artifact for agents/LLM: action queue + patch router + deploy gate + policy snapshots.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'openclaw-autonomy-handoff-latest.json');

const FILES = {
  actionQueue: path.join(REPORTS, 'openclaw-action-queue-latest.json'),
  patchRouter: path.join(REPORTS, 'openclaw-hot-file-patch-router-latest.json'),
  deployGate: path.join(REPORTS, 'openclaw-deploy-confidence-gate-latest.json'),
  regressionMemory: path.join(REPORTS, 'openclaw-regression-memory-latest.json'),
  actionPolicy: path.join(REPORTS, 'openclaw-action-policy-latest.json'),
  approvedQueue: path.join(REPORTS, 'openclaw-action-approved-queue-latest.json'),
  mergeLedger: path.join(REPORTS, 'merge-ledger-latest.json'),
  conflictPredictor: path.join(REPORTS, 'openclaw-conflict-predictor-latest.json'),
};

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const actionQueue = readJson(FILES.actionQueue);
  const patchRouter = readJson(FILES.patchRouter);
  const deployGate = readJson(FILES.deployGate);
  const regressionMemory = readJson(FILES.regressionMemory);
  const actionPolicy = readJson(FILES.actionPolicy);
  const approvedQueue = readJson(FILES.approvedQueue);
  const mergeLedger = readJson(FILES.mergeLedger);
  const conflictPredictor = readJson(FILES.conflictPredictor);

  const q = Array.isArray(actionQueue?.queue) ? actionQueue.queue : [];
  const withPatchHints = q.filter((i) => i && i.patchMode).length;

  const handoff = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 2,
    sources: FILES,
    actionQueue,
    patchRouter,
    deployGate,
    regressionMemory,
    actionPolicy,
    approvedQueue,
    mergeLedgerSnapshot: mergeLedger
      ? {
          generatedAt: mergeLedger.generatedAt,
          totalFiles: mergeLedger.totalFiles,
          trackedPrefixes: mergeLedger.trackedPrefixes,
        }
      : null,
    conflictPredictorSummary: conflictPredictor
      ? {
          generatedAt: conflictPredictor.generatedAt,
          files: Array.isArray(conflictPredictor.files) ? conflictPredictor.files.length : 0,
        }
      : null,
    summary: {
      queueLength: q.length,
      queueItemsWithPatchHints: withPatchHints,
      hotHighRisk: patchRouter?.summary?.highRiskCount ?? null,
      hotMediumRisk: patchRouter?.summary?.mediumRiskCount ?? null,
      deployDecision: deployGate?.decision ?? null,
      deployBand: deployGate?.band ?? null,
      policyApproved: approvedQueue?.totalQueued ?? actionPolicy?.totalApproved ?? null,
      policyDenied: actionPolicy?.totalDenied ?? null,
      regressionIncidents: Array.isArray(regressionMemory?.incidents) ? regressionMemory.incidents.length : null,
    },
    guidance: {
      patchModes:
        'Queue items may include patchMode (section_scoped | append_only_preferred | full_edit_ok) from hot-file router; honor when executing edits.',
      deploy:
        deployGate?.decision === 'hold_deploy'
          ? 'Deploy gate recommends hold; avoid production deploy until signals recover.'
          : 'Deploy gate not holding; still run normal quality gates.',
    },
  };

  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(handoff, null, 2));
  console.log(`OpenClaw autonomy handoff written: ${OUT}`);
}

main();
