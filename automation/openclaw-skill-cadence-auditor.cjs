#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ECO = path.join(ROOT, 'ecosystem.config.cjs');
const SKILLS = path.join(ROOT, 'automation', 'config', 'openclaw-agent-skills.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'openclaw-skill-cadence-audit-latest.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadEcosystemApps() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const mod = require(ECO);
  return Array.isArray(mod?.apps) ? mod.apps : [];
}

function toNumber(val, fallback) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function main() {
  const apps = loadEcosystemApps();
  const skills = readJson(SKILLS);
  const workers = Array.isArray(skills?.workers) ? skills.workers : [];
  const enabledWorkers = workers.filter((w) => w && w.enabled !== false);

  const openclawPrompt = apps.find((app) => app?.name === 'openclaw-autonomous-prompts');
  const openclawGuardian = apps.find((app) => app?.name === 'openclaw-autonomous-guardian');
  const trendAgent = apps.find((app) => app?.name === 'openclaw-confidence-trend-adapter');
  const regressionAgent = apps.find((app) => app?.name === 'openclaw-regression-memory-agent');

  const expectedCadence = Math.round(
    enabledWorkers.reduce((sum, w) => sum + toNumber(w.cadenceSeconds, 60), 0) / Math.max(enabledWorkers.length, 1),
  );
  const configuredPromptCadence = toNumber(openclawPrompt?.env?.OPENCLAW_FREQUENCY_SECONDS, 20);
  const configuredParallel = toNumber(openclawPrompt?.env?.OPENCLAW_MAX_PARALLEL, 2);
  const maxWorkerCadence = Math.max(...enabledWorkers.map((w) => toNumber(w.cadenceSeconds, 60)), 60);

  const checks = {
    promptRunnerExists: Boolean(openclawPrompt),
    guardianExists: Boolean(openclawGuardian),
    trendAdapterExists: Boolean(trendAgent),
    regressionMemoryExists: Boolean(regressionAgent),
    promptCadenceNotTooSlow: configuredPromptCadence <= maxWorkerCadence,
    promptCadenceNotTooFast: configuredPromptCadence >= 10,
    parallelismConfigured: configuredParallel >= 1 && configuredParallel <= 6,
    minEnabledWorkers: enabledWorkers.length >= 6,
  };

  const failingChecks = Object.entries(checks)
    .filter(([, ok]) => ok !== true)
    .map(([name]) => name);

  const report = {
    generatedAt: new Date().toISOString(),
    status: failingChecks.length === 0 ? 'ok' : 'warn',
    failingChecks,
    summary: {
      enabledWorkerCount: enabledWorkers.length,
      expectedCadenceSeconds: expectedCadence,
      maxWorkerCadenceSeconds: maxWorkerCadence,
      openclawFrequencySeconds: configuredPromptCadence,
      openclawMaxParallel: configuredParallel,
    },
    checks,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(
    `[openclaw-skill-cadence-auditor] status=${report.status} workers=${enabledWorkers.length} cadence=${configuredPromptCadence}s`,
  );

  const failOnWarn = String(process.env.OPENCLAW_SKILL_AUDIT_FAIL_ON_WARN || '0') === '1';
  if (failOnWarn && report.status !== 'ok') process.exit(1);
}

main();
