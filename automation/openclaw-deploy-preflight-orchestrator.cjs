#!/usr/bin/env node
/* eslint-disable no-console */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'openclaw-deploy-preflight-latest.json');

function run(command) {
  try {
    execSync(command, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
    return { ok: true, command };
  } catch (error) {
    return {
      ok: false,
      command,
      error: String(error?.stderr || error?.message || 'unknown error').slice(0, 500),
    };
  }
}

function readJson(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  const checks = [
    run('npm run openclaw:prompt:score'),
    run('npm run openclaw:actions:queue'),
    run('npm run openclaw:actions:policy'),
    run('npm run openclaw:pr:route'),
    run('npm run openclaw:confidence:trend'),
    run('npm run openclaw:deploy:gate'),
    run('npm run openclaw:regression:memory'),
  ];

  const gate = readJson(path.join(ROOT, 'automation', 'reports', 'openclaw-deploy-confidence-gate-latest.json'), {});
  const passed = checks.every((c) => c.ok) && gate.decision === 'allow_deploy';

  const payload = {
    generatedAt: new Date().toISOString(),
    passed,
    gateDecision: gate.decision || 'unknown',
    checks,
  };
  fs.writeFileSync(REPORT, JSON.stringify(payload, null, 2));
  console.log(`OpenClaw deploy preflight report: ${REPORT}`);
  if (!passed) process.exit(1);
}

main();
