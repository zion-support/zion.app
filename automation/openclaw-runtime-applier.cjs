#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const TUNER_REPORT = path.join(REPORT_DIR, 'openclaw-skill-auto-tuner-latest.json');
const OVERRIDES = path.join(REPORT_DIR, 'openclaw-runtime-overrides.json');
const HISTORY = path.join(REPORT_DIR, 'openclaw-runtime-overrides-history.json');
const OUT = path.join(REPORT_DIR, 'openclaw-runtime-applier-latest.json');

const DEFAULT_FREQUENCY = Number(process.env.OPENCLAW_RUNTIME_DEFAULT_FREQUENCY_SECONDS || 20);
const DEFAULT_PARALLEL = Number(process.env.OPENCLAW_RUNTIME_DEFAULT_MAX_PARALLEL || 2);
const MIN_FREQUENCY = Number(process.env.OPENCLAW_RUNTIME_MIN_FREQUENCY_SECONDS || 15);
const MAX_FREQUENCY = Number(process.env.OPENCLAW_RUNTIME_MAX_FREQUENCY_SECONDS || 180);
const MIN_PARALLEL = Number(process.env.OPENCLAW_RUNTIME_MIN_PARALLEL || 1);
const MAX_PARALLEL = Number(process.env.OPENCLAW_RUNTIME_MAX_PARALLEL || 6);
const MAX_FREQ_DELTA = Number(process.env.OPENCLAW_RUNTIME_MAX_FREQ_DELTA || 25);
const MAX_PARALLEL_DELTA = Number(process.env.OPENCLAW_RUNTIME_MAX_PARALLEL_DELTA || 1);
const HISTORY_LIMIT = Number(process.env.OPENCLAW_RUNTIME_HISTORY_LIMIT || 60);
const EXECUTE_PM2 = String(process.env.OPENCLAW_RUNTIME_APPLIER_EXECUTE || '0') === '1';

function readJsonSafe(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function boundedStep(target, current, maxStep) {
  if (!Number.isFinite(target)) return current;
  if (!Number.isFinite(current)) return target;
  if (Math.abs(target - current) <= maxStep) return target;
  return current + Math.sign(target - current) * maxStep;
}

function toRuntimeShape(input, fallback) {
  const freq = Number(input?.frequencySeconds);
  const par = Number(input?.maxParallel);
  return {
    frequencySeconds: Number.isFinite(freq) ? freq : fallback.frequencySeconds,
    maxParallel: Number.isFinite(par) ? par : fallback.maxParallel,
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function restartPm2Targets() {
  const targets = ['openclaw-autonomous-prompts', 'openclaw-autonomous-guardian'];
  const output = [];
  for (const target of targets) {
    try {
      const line = execSync(`pm2 restart ${target} --update-env`, {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8',
      });
      output.push({ target, ok: true, output: String(line || '').trim() });
    } catch (err) {
      output.push({ target, ok: false, error: err.message || String(err) });
    }
  }
  return output;
}

function main() {
  const fallback = { frequencySeconds: DEFAULT_FREQUENCY, maxParallel: DEFAULT_PARALLEL };
  const tuner = readJsonSafe(TUNER_REPORT, {});
  const previousOverrides = readJsonSafe(OVERRIDES, {});
  const previousRuntime = toRuntimeShape(previousOverrides.runtime, fallback);
  const recommended = toRuntimeShape(tuner?.decision?.recommended, previousRuntime);
  const mode = String(tuner?.decision?.mode || 'unknown');

  const stepped = {
    frequencySeconds: boundedStep(recommended.frequencySeconds, previousRuntime.frequencySeconds, MAX_FREQ_DELTA),
    maxParallel: boundedStep(recommended.maxParallel, previousRuntime.maxParallel, MAX_PARALLEL_DELTA),
  };
  const runtime = {
    frequencySeconds: clamp(Math.round(stepped.frequencySeconds), MIN_FREQUENCY, MAX_FREQUENCY),
    maxParallel: clamp(Math.round(stepped.maxParallel), MIN_PARALLEL, MAX_PARALLEL),
  };

  const decisionPresent =
    fs.existsSync(TUNER_REPORT) && Number.isFinite(Number(tuner?.decision?.recommended?.frequencySeconds));
  const changed =
    runtime.frequencySeconds !== previousRuntime.frequencySeconds || runtime.maxParallel !== previousRuntime.maxParallel;
  const applyAllowed = decisionPresent && ['stabilize', 'steady', 'accelerate'].includes(mode);
  const applied = applyAllowed && changed;

  const overridesPayload = {
    generatedAt: new Date().toISOString(),
    source: path.relative(ROOT, TUNER_REPORT),
    mode,
    runtime,
    previousRuntime,
  };
  if (applied) {
    writeJson(OVERRIDES, overridesPayload);
  }

  const history = readJsonSafe(HISTORY, []);
  const nextHistory = Array.isArray(history) ? history : [];
  nextHistory.push({
    at: new Date().toISOString(),
    mode,
    applyAllowed,
    applied,
    previousRuntime,
    recommended,
    runtime,
  });
  writeJson(HISTORY, nextHistory.slice(-HISTORY_LIMIT));

  const pm2Restarts = applied && EXECUTE_PM2 ? restartPm2Targets() : [];
  const report = {
    generatedAt: new Date().toISOString(),
    status: applied ? 'applied' : applyAllowed ? 'no-change' : 'skipped',
    mode,
    applyAllowed,
    applied,
    executePm2: EXECUTE_PM2,
    files: {
      tunerReport: path.relative(ROOT, TUNER_REPORT),
      overrides: path.relative(ROOT, OVERRIDES),
      history: path.relative(ROOT, HISTORY),
    },
    before: previousRuntime,
    recommended,
    after: runtime,
    pm2Restarts,
    guardrails: {
      minFrequencySeconds: MIN_FREQUENCY,
      maxFrequencySeconds: MAX_FREQUENCY,
      minParallel: MIN_PARALLEL,
      maxParallel: MAX_PARALLEL,
      maxFrequencyDeltaPerRun: MAX_FREQ_DELTA,
      maxParallelDeltaPerRun: MAX_PARALLEL_DELTA,
    },
  };
  writeJson(OUT, report);
  console.log(
    `[openclaw-runtime-applier] status=${report.status} mode=${mode} freq=${runtime.frequencySeconds}s parallel=${runtime.maxParallel}`,
  );

  if (String(process.env.OPENCLAW_RUNTIME_APPLIER_FAIL_ON_SKIP || '0') === '1' && report.status === 'skipped') {
    process.exit(1);
  }
}

main();
