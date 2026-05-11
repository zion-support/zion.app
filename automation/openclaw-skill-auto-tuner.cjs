#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONF_TREND = path.join(ROOT, 'automation', 'reports', 'openclaw-confidence-trend-latest.json');
const SKILL_AUDIT = path.join(ROOT, 'automation', 'reports', 'openclaw-skill-cadence-audit-latest.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'openclaw-skill-auto-tuner-latest.json');

function readJsonSafe(file, fallback = null) {
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

function main() {
  const trend = readJsonSafe(CONF_TREND, {});
  const audit = readJsonSafe(SKILL_AUDIT, {});
  const confidence = Number(trend.confidence || 0);
  const currentFreq = Number(trend?.suggestedRuntime?.frequencySeconds || 45);
  const currentParallel = Number(trend?.suggestedRuntime?.maxParallel || 2);
  const auditHealthy = String(audit.status || 'warn') === 'ok';
  const failingChecks = Array.isArray(audit.failingChecks) ? audit.failingChecks : [];

  let targetFreq = currentFreq;
  let targetParallel = currentParallel;
  let mode = 'steady';

  if (!auditHealthy || confidence < 55) {
    mode = 'stabilize';
    targetFreq = clamp(currentFreq + 20, 20, 300);
    targetParallel = clamp(currentParallel - 1, 1, 6);
  } else if (confidence >= 78) {
    mode = 'accelerate';
    targetFreq = clamp(currentFreq - 10, 15, 300);
    targetParallel = clamp(currentParallel + 1, 1, 6);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    inputs: {
      confidence,
      auditHealthy,
      failingChecks,
      currentSuggested: {
        frequencySeconds: currentFreq,
        maxParallel: currentParallel,
      },
    },
    decision: {
      mode,
      recommended: {
        frequencySeconds: targetFreq,
        maxParallel: targetParallel,
      },
      envHints: {
        OPENCLAW_FREQUENCY_SECONDS: String(targetFreq),
        OPENCLAW_MAX_PARALLEL: String(targetParallel),
      },
    },
    recommendation:
      mode === 'accelerate'
        ? 'Increase OpenClaw cadence and parallelism gradually while confidence remains high.'
        : mode === 'stabilize'
          ? 'Reduce OpenClaw pressure and focus on remediation until confidence and skill audit recover.'
          : 'Keep current OpenClaw runtime settings and continue monitoring trend deltas.',
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(
    `[openclaw-skill-auto-tuner] mode=${mode} freq=${targetFreq}s parallel=${targetParallel} confidence=${confidence}`,
  );

  if (String(process.env.OPENCLAW_SKILL_AUTO_TUNER_FAIL_ON_STABILIZE || '0') === '1' && mode === 'stabilize') {
    process.exit(1);
  }
}

main();
