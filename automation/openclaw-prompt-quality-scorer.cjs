#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'automation', 'reports', 'openclaw-autonomous-app-improver-latest.json');
const OUTPUT = path.join(ROOT, 'automation', 'reports', 'openclaw-prompt-quality-score-latest.json');

function safeRead(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function isActionSchemaValid(action) {
  if (!action || typeof action !== 'object') return false;
  if (typeof action.summary !== 'string' || !action.summary.trim()) return false;
  if (action.command && typeof action.command !== 'string') return false;
  if (action.targetPath && typeof action.targetPath !== 'string') return false;
  return true;
}

function scoreWorker(result) {
  const actions = Array.isArray(result.actions) ? result.actions : [];
  if (!result.ok) return 0;
  if (actions.length === 0) {
    return 10;
  }
  const validCount = actions.filter((a) => isActionSchemaValid(a)).length;
  const withCommand = actions.filter((a) => typeof a.command === 'string' && a.command.trim()).length;
  const withTargetPath = actions.filter((a) => typeof a.targetPath === 'string' && a.targetPath.trim()).length;
  const confidenceValues = actions
    .map((a) => Number(a.confidence))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 1);
  const avgConfidence = confidenceValues.length > 0 ? confidenceValues.reduce((acc, n) => acc + n, 0) / confidenceValues.length : 0.5;
  const schemaScore = (validCount / actions.length) * 40;
  const commandScore = (withCommand / actions.length) * 25;
  const targetScore = (withTargetPath / actions.length) * 15;
  const confidenceScore = avgConfidence * 20;
  return Math.max(0, Math.min(100, Math.round(schemaScore + commandScore + targetScore + confidenceScore)));
}

function main() {
  const report = safeRead(INPUT);
  if (!report || !Array.isArray(report.lastResults)) {
    console.error('Cannot score prompts: report missing or invalid.');
    process.exit(1);
  }

  const workers = report.lastResults.map((r) => {
    const actions = Array.isArray(r.actions) ? r.actions : [];
    return {
      worker: r.worker,
      ok: r.ok,
      actionCount: actions.length,
      validActionCount: actions.filter((a) => isActionSchemaValid(a)).length,
      score: scoreWorker(r),
    };
  });

  const successWorkers = workers.filter((w) => w.ok);
  const avgScore = successWorkers.length
    ? Math.round(successWorkers.reduce((acc, w) => acc + w.score, 0) / successWorkers.length)
    : 0;

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceReport: INPUT,
    successRate: report.promptsSent ? Number((report.successes / report.promptsSent).toFixed(2)) : 0,
    averageQualityScore: avgScore,
    schemaValidityRate:
      workers.reduce((acc, w) => acc + w.actionCount, 0) > 0
        ? Number(
            (
              workers.reduce((acc, w) => acc + w.validActionCount, 0) /
              workers.reduce((acc, w) => acc + w.actionCount, 0)
            ).toFixed(2)
          )
        : 0,
    parseFailureRate:
      report.promptsSent > 0 ? Number((Number(report.parseFailures || 0) / Number(report.promptsSent || 1)).toFixed(2)) : 0,
    workers,
    recommendation:
      avgScore >= 75
        ? 'Action quality is strong; cautiously increase cadence for highest-yield workers.'
        : 'Action quality is moderate; improve schema-valid actions with explicit command and targetPath fields.',
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`OpenClaw prompt quality score generated: ${OUTPUT}`);
}

main();
