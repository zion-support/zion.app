#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const GATE_FILE = path.join(REPORTS, 'openclaw-deploy-confidence-gate-latest.json');
const TREND_FILE = path.join(REPORTS, 'openclaw-confidence-trend-latest.json');
const OUT_FILE = path.join(REPORTS, 'openclaw-regression-memory-latest.json');
const HISTORY_FILE = path.join(REPORTS, 'openclaw-regression-memory-history.json');

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

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

  const gate = readJson(GATE_FILE, {});
  const trend = readJson(TREND_FILE, {});
  const history = readJson(HISTORY_FILE, { entries: [] });

  const reasons = Array.isArray(gate.reasons) ? gate.reasons : [];
  const repeatedReasons = reasons.filter((reason) =>
    history.entries.slice(-5).some((entry) => Array.isArray(entry.reasons) && entry.reasons.includes(reason))
  );
  const lowTrend = Number(trend.confidence || 0) < 55;
  const incidents = [];
  if (repeatedReasons.length > 0) incidents.push('repeated_gate_reasons');
  if (lowTrend) incidents.push('low_confidence_trend');

  const preventionChecks = [];
  if (reasons.includes('no_prompt_activity')) preventionChecks.push('ensure_openclaw_autonomous_prompts_online');
  if (reasons.find((r) => r.startsWith('success_rate_below_threshold'))) preventionChecks.push('reduce_worker_parallelism_and_retry_auth');
  if (reasons.find((r) => r.startsWith('quality_below_threshold'))) preventionChecks.push('tighten_prompt_actionability_rules');
  if (reasons.includes('failure_burst_detected')) preventionChecks.push('run_guardian_restart_and_cooldown_cycle');
  if (lowTrend) preventionChecks.push('decrease_frequency_until_confidence_recovers');

  const payload = {
    generatedAt: new Date().toISOString(),
    incidents,
    reasons,
    repeatedReasons,
    preventionChecks,
    recommendation:
      incidents.length > 0
        ? 'Enter conservative mode: keep deploys gated and run preflight orchestrator before release.'
        : 'No major regression trend detected.',
  };

  const nextHistory = {
    entries: [...history.entries.slice(-99), { at: payload.generatedAt, reasons, incidents }],
  };

  writeJson(OUT_FILE, payload);
  writeJson(HISTORY_FILE, nextHistory);
  console.log(`OpenClaw regression memory generated: ${OUT_FILE}`);
}

main();
