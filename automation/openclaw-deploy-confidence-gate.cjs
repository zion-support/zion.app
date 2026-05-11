#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PROMPT_SCORE = path.join(ROOT, 'automation', 'reports', 'openclaw-prompt-quality-score-latest.json');
const AUTONOMOUS_REPORT = path.join(ROOT, 'automation', 'reports', 'openclaw-autonomous-app-improver-latest.json');
const ACTION_QUEUE = path.join(ROOT, 'automation', 'reports', 'openclaw-action-queue-latest.json');
const OUTPUT = path.join(ROOT, 'automation', 'reports', 'openclaw-deploy-confidence-gate-latest.json');
const HISTORY = path.join(ROOT, 'automation', 'reports', 'openclaw-deploy-confidence-gate-history.json');

const MIN_SUCCESS_RATE = Number.parseFloat(process.env.OPENCLAW_GATE_MIN_SUCCESS_RATE || '0.6');
const MIN_QUALITY = Number.parseInt(process.env.OPENCLAW_GATE_MIN_QUALITY || '60', 10);
const CAUTION_SUCCESS_RATE = Number.parseFloat(process.env.OPENCLAW_GATE_CAUTION_SUCCESS_RATE || '0.75');
const CAUTION_QUALITY = Number.parseInt(process.env.OPENCLAW_GATE_CAUTION_QUALITY || '72', 10);
const HISTORY_RETENTION = Math.max(20, Number.parseInt(process.env.OPENCLAW_GATE_HISTORY_RETENTION || '150', 10));

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  const score = readJson(PROMPT_SCORE);
  const report = readJson(AUTONOMOUS_REPORT);
  const queue = readJson(ACTION_QUEUE);
  const previous = readJson(OUTPUT);

  const successRate = score?.successRate ?? 0;
  const quality = score?.averageQualityScore ?? 0;
  const schemaValidityRate = score?.schemaValidityRate ?? 0;
  const failures = report?.failures ?? 0;
  const successes = report?.successes ?? 0;
  const total = report?.promptsSent ?? 0;
  const contractFailures = report?.contractFailures ?? 0;
  const parseFailures = report?.parseFailures ?? 0;
  const queued = queue?.totalQueued ?? 0;

  const reasons = [];
  if (successRate < MIN_SUCCESS_RATE) reasons.push(`success_rate_below_threshold(${successRate} < ${MIN_SUCCESS_RATE})`);
  if (quality < MIN_QUALITY) reasons.push(`quality_below_threshold(${quality} < ${MIN_QUALITY})`);
  if (schemaValidityRate < 0.6) reasons.push(`schema_validity_low(${schemaValidityRate} < 0.6)`);
  if (failures > successes + 2) reasons.push('failure_burst_detected');
  if (contractFailures > 0) reasons.push('contract_failures_detected');
  if (parseFailures > successes + 2) reasons.push('parse_failures_burst_detected');
  if (total === 0) reasons.push('no_prompt_activity');

  let band = 'allow';
  if (
    reasons.length > 0 ||
    successRate < MIN_SUCCESS_RATE ||
    quality < MIN_QUALITY ||
    schemaValidityRate < 0.6 ||
    queued === 0
  ) {
    band = 'hold';
  } else if (successRate < CAUTION_SUCCESS_RATE || quality < CAUTION_QUALITY || schemaValidityRate < 0.75) {
    band = 'caution';
  }
  if (previous && previous.band === 'hold' && band === 'caution') {
    band = 'hold';
    reasons.push('hysteresis_hold_until_allow');
  }
  const decision = band === 'allow' ? 'allow_deploy' : 'hold_deploy';
  const confidence = Math.max(
    0,
    Math.min(
      100,
      Math.round(successRate * 35 + (quality / 100) * 35 + schemaValidityRate * 20 + (queued > 0 ? 10 : 0))
    )
  );
  const payload = {
    generatedAt: new Date().toISOString(),
    thresholds: { minSuccessRate: MIN_SUCCESS_RATE, minQuality: MIN_QUALITY, cautionSuccessRate: CAUTION_SUCCESS_RATE, cautionQuality: CAUTION_QUALITY },
    inputs: { successRate, quality, schemaValidityRate, failures, successes, total, queued, contractFailures, parseFailures },
    confidence,
    band,
    decision,
    reasons,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  const history = Array.isArray(readJson(HISTORY)) ? readJson(HISTORY) : [];
  history.push({ generatedAt: payload.generatedAt, confidence, band, decision, reasons, inputs: payload.inputs });
  const bounded = history.length > HISTORY_RETENTION ? history.slice(history.length - HISTORY_RETENTION) : history;
  fs.writeFileSync(HISTORY, JSON.stringify(bounded, null, 2));
  console.log(`OpenClaw deploy confidence decision: ${decision}`);
  console.log(`Report: ${OUTPUT}`);
}

main();
