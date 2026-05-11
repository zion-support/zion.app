#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SCORE_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-prompt-quality-score-latest.json');
const GATE_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-deploy-confidence-gate-latest.json');
const OUTPUT_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-confidence-trend-latest.json');
const HISTORY_FILE = path.join(ROOT, 'automation', 'reports', 'openclaw-confidence-trend-history.json');

const BASE_FREQUENCY = Number.parseInt(process.env.OPENCLAW_BASE_FREQUENCY_SECONDS || '45', 10);

function readJson(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, payload) {
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function main() {
  const score = readJson(SCORE_FILE, {});
  const gate = readJson(GATE_FILE, {});
  const history = readJson(HISTORY_FILE, { entries: [] });

  const successRate = Number(score.successRate || 0);
  const quality = Number(score.averageQualityScore || 0);
  const blocked = gate.decision === 'hold_deploy';

  const confidence = clamp(Math.round(successRate * 50 + quality * 0.5), 0, 100);
  const suggestedFrequencySeconds = blocked
    ? clamp(BASE_FREQUENCY + 30, 30, 300)
    : clamp(BASE_FREQUENCY - 10, 20, 300);
  const suggestedParallelism = confidence >= 75 ? 3 : confidence >= 55 ? 2 : 1;

  const payload = {
    generatedAt: new Date().toISOString(),
    inputs: { successRate, quality, deployDecision: gate.decision || 'unknown' },
    confidence,
    mode: blocked ? 'conservative' : 'normal',
    suggestedRuntime: {
      frequencySeconds: suggestedFrequencySeconds,
      maxParallel: suggestedParallelism,
    },
    recommendation: blocked
      ? 'Keep conservative mode and improve prompt quality before increasing cadence.'
      : 'Confidence trend is acceptable; maintain or slightly increase cadence.',
  };

  const nextHistory = {
    entries: [...history.entries.slice(-119), { at: payload.generatedAt, confidence, blocked }],
  };

  writeJson(OUTPUT_FILE, payload);
  writeJson(HISTORY_FILE, nextHistory);
  console.log(`OpenClaw confidence trend report generated: ${OUTPUT_FILE}`);
}

main();
