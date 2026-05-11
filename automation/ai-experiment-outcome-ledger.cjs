#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const PRIORITY_REPORT = path.join(REPORT_DIR, 'openclaw-skill-auto-tuner-latest.json');
const OPENCLAW_REPORT = path.join(REPORT_DIR, 'openclaw-autonomous-app-improver-latest.json');
const LEDGER_LATEST = path.join(REPORT_DIR, 'experiment-outcome-ledger-latest.json');
const LEDGER_HISTORY = path.join(REPORT_DIR, 'experiment-outcome-ledger-history.json');

const HISTORY_LIMIT = Number(process.env.EXPERIMENT_LEDGER_HISTORY_LIMIT || 120);
const FAIL_ON_DEGRADATION = String(process.env.EXPERIMENT_LEDGER_FAIL_ON_DEGRADATION || '0') === '1';

function readJsonSafe(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, payload) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function computeSignal(entry) {
  const confidence = toNumber(entry?.confidence, 0);
  const successRate = toNumber(entry?.successRate, 0);
  const outputYield = toNumber(entry?.actionsPerCycle, 0);
  return Number((confidence * 0.5 + successRate * 0.3 + outputYield * 20).toFixed(2));
}

function main() {
  const priority = readJsonSafe(PRIORITY_REPORT, {});
  const openclaw = readJsonSafe(OPENCLAW_REPORT, {});
  const history = readJsonSafe(LEDGER_HISTORY, []);
  const safeHistory = Array.isArray(history) ? history : [];

  const cycles = toNumber(openclaw.cycles, 0);
  const successes = toNumber(openclaw.successes, 0);
  const failures = toNumber(openclaw.failures, 0);
  const actionsFound = toNumber(openclaw.actionsFound, 0);
  const successRate = cycles > 0 ? Number((successes / cycles).toFixed(4)) : 0;
  const actionsPerCycle = cycles > 0 ? Number((actionsFound / cycles).toFixed(4)) : 0;
  const confidence = toNumber(priority?.inputs?.confidence, 0);
  const mode = String(priority?.decision?.mode || 'unknown');

  const entry = {
    at: new Date().toISOString(),
    confidence,
    mode,
    cycles,
    successes,
    failures,
    successRate,
    actionsFound,
    actionsPerCycle,
    signal: computeSignal({ confidence, successRate, actionsPerCycle }),
  };

  const nextHistory = [...safeHistory, entry].slice(-HISTORY_LIMIT);
  const prev = nextHistory.length >= 2 ? nextHistory[nextHistory.length - 2] : null;
  const deltaSignal = prev ? Number((entry.signal - toNumber(prev.signal)).toFixed(2)) : 0;
  const status = deltaSignal < -5 || (entry.successRate < 0.45 && entry.cycles >= 10) ? 'degraded' : 'healthy';

  const latest = {
    generatedAt: new Date().toISOString(),
    status,
    signal: entry.signal,
    deltaSignal,
    recommendation:
      status === 'degraded'
        ? 'Stabilize experiment throughput, reduce parallel risk, and focus on deterministic remediation loops.'
        : 'Keep current autonomous experiment cadence and continue collecting outcome evidence.',
    entry,
    trend: {
      points: nextHistory.length,
      avgSignalLast7:
        nextHistory.length > 0
          ? Number(
              (
                nextHistory
                  .slice(-7)
                  .reduce((acc, item) => acc + toNumber(item.signal, 0), 0) / Math.min(7, nextHistory.length)
              ).toFixed(2),
            )
          : 0,
    },
    files: {
      priorityReport: path.relative(ROOT, PRIORITY_REPORT),
      openclawReport: path.relative(ROOT, OPENCLAW_REPORT),
      history: path.relative(ROOT, LEDGER_HISTORY),
    },
  };

  writeJson(LEDGER_HISTORY, nextHistory);
  writeJson(LEDGER_LATEST, latest);
  console.log(`[experiment-outcome-ledger] status=${status} signal=${latest.signal} delta=${deltaSignal}`);

  if (FAIL_ON_DEGRADATION && status === 'degraded') {
    process.exit(1);
  }
}

main();
