#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS_DIR, 'artifact-freshness-mesh-latest.json');
const MAX_AGE_HOURS = Math.max(1, Number.parseInt(process.env.ARTIFACT_FRESHNESS_MAX_AGE_HOURS || '30', 10));
const AUTO_HEAL = process.env.ARTIFACT_FRESHNESS_AUTO_HEAL === '1';
const GH_REPO = process.env.GITHUB_REPOSITORY || '';

const TARGETS = [
  {
    key: 'openclawAutonomous',
    file: 'openclaw-autonomous-app-improver-latest.json',
    workflow: 'ai-openclaw-autonomous-cycle.yml',
  },
  {
    key: 'openclawAuthRuntime',
    file: 'openclaw-auth-runtime-diagnostic-latest.json',
    workflow: 'ai-openclaw-auth-runtime-diagnostic.yml',
  },
  {
    key: 'openclawPromptQuality',
    file: 'openclaw-prompt-quality-score-latest.json',
    workflow: 'ai-openclaw-autonomous-cycle.yml',
  },
  {
    key: 'aggregateDashboard',
    file: 'aggregate-dashboard.json',
    workflow: 'ai-report-aggregator.yml',
  },
  {
    key: 'pm2Slo',
    file: 'pm2-slo-latest.json',
    workflow: 'ai-pm2-slo-agent.yml',
  },
];

function run(command) {
  return execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function ageHours(filePath) {
  const stat = fs.statSync(filePath);
  return Number(((Date.now() - stat.mtimeMs) / (1000 * 60 * 60)).toFixed(2));
}

function tryDispatch(workflow) {
  try {
    if (!AUTO_HEAL || !GH_REPO) return { attempted: false, ok: false, reason: 'auto_heal_disabled_or_missing_repo' };
    run(`gh workflow run ${workflow}`);
    return { attempted: true, ok: true };
  } catch (err) {
    return { attempted: true, ok: false, reason: String(err.message || err).slice(0, 200) };
  }
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const results = [];
  for (const target of TARGETS) {
    const full = path.join(REPORTS_DIR, target.file);
    if (!fs.existsSync(full)) {
      results.push({
        key: target.key,
        file: target.file,
        exists: false,
        stale: true,
        ageHours: null,
        workflow: target.workflow,
        dispatch: tryDispatch(target.workflow),
      });
      continue;
    }
    const age = ageHours(full);
    const stale = age > MAX_AGE_HOURS;
    results.push({
      key: target.key,
      file: target.file,
      exists: true,
      stale,
      ageHours: age,
      workflow: target.workflow,
      dispatch: stale ? tryDispatch(target.workflow) : { attempted: false, ok: false, reason: 'not_stale' },
    });
  }

  const staleCount = results.filter((item) => item.stale).length;
  const payload = {
    generatedAt: new Date().toISOString(),
    maxAgeHours: MAX_AGE_HOURS,
    autoHeal: AUTO_HEAL,
    staleCount,
    status: staleCount === 0 ? 'ok' : staleCount <= 2 ? 'warning' : 'critical',
    results,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  console.log(`Artifact freshness mesh report: ${OUTPUT}`);
  if (staleCount > 0) process.exitCode = 1;
}

main();
