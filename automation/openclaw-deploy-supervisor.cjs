#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Runs deploy:local with phased quiescing and retries on failure.
 * Env:
 *   DEPLOY_SUPERVISOR_RETRIES=1 (default max extra attempts after first failure)
 *   DEPLOY_SUPERVISOR_QUIESCE_OPENCLAW=1 — open commit window before deploy
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUTPUT = path.join(REPORTS, 'openclaw-deploy-supervisor-latest.json');

const QUIESCE_APPS = String(
  process.env.DEPLOY_SUPERVISOR_QUIESCE_APPS ||
    'openclaw-autonomous-prompts,openclaw-merge-ledger-agent,openclaw-conflict-predictor,openclaw-report-write-coalescer',
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function sh(command) {
  return execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function pm2StopApps() {
  const stopped = [];
  for (const app of QUIESCE_APPS) {
    try {
      sh(`pm2 stop ${app}`);
      stopped.push(app);
    } catch {
      /* ignore */
    }
  }
  return stopped;
}

function pm2StartApps(apps) {
  for (const app of apps) {
    try {
      sh(`pm2 start ${app}`);
    } catch {
      /* ignore */
    }
  }
}

function runDeploy() {
  const r = spawnSync('npm', ['run', 'deploy:local'], { cwd: ROOT, stdio: 'inherit', env: process.env });
  return { status: r.status === null ? 1 : r.status, signal: r.signal };
}

function main() {
  if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

  const maxExtraAttempts = Number.parseInt(process.env.DEPLOY_SUPERVISOR_RETRIES || '1', 10);
  const useOpenclawWindow = process.env.DEPLOY_SUPERVISOR_QUIESCE_OPENCLAW === '1';

  let quiesced = [];
  let retriesUsed = 0;

  try {
    if (useOpenclawWindow) {
      try {
        execSync('npm run openclaw:commit:window:open', { cwd: ROOT, stdio: 'inherit' });
      } catch {
        /* best-effort */
      }
    }

    execSync('npm run build:lock:heal', { cwd: ROOT, stdio: 'inherit' });

    let last = runDeploy();

    while (last.status !== 0 && retriesUsed < maxExtraAttempts) {
      retriesUsed += 1;
      console.warn(
        `\n[deploy-supervisor] Deploy failed (status ${last.status}). Retry ${retriesUsed}/${maxExtraAttempts} after heal + PM2 quiesce...`,
      );
      execSync('npm run build:lock:heal', { cwd: ROOT, stdio: 'inherit' });
      quiesced = pm2StopApps();
      execSync('npm run build:lock:heal', { cwd: ROOT, stdio: 'inherit' });
      last = runDeploy();
      pm2StartApps(quiesced);
      quiesced = [];
    }

    if (useOpenclawWindow) {
      try {
        execSync('npm run openclaw:commit:window:close', { cwd: ROOT, stdio: 'inherit' });
      } catch {
        /* best-effort */
      }
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      exitStatus: last.status,
      signal: last.signal,
      retriesUsed,
      maxExtraAttempts,
      quiesceOpenclaw: useOpenclawWindow,
    };
    fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));

    process.exitCode = last.status === 0 ? 0 : last.status;
  } catch (e) {
    pm2StartApps(quiesced);
    if (useOpenclawWindow) {
      try {
        execSync('npm run openclaw:commit:window:close', { cwd: ROOT, stdio: 'inherit' });
      } catch {
        /* ignore */
      }
    }
    console.error(e);
    process.exitCode = 1;
  }
}

main();
