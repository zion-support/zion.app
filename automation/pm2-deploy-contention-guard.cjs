#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Pre-deploy PM2 / Next contention scorer.
 * Writes automation/reports/pm2-deploy-contention-latest.json
 *
 * Env:
 * - PM2_DEPLOY_CONTENTION_THRESHOLD: numeric score above which risk is "high" (default 50)
 * - DEPLOY_BLOCK_ON_LOCK_RISK=1: exit 1 when riskScore >= threshold (default off)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'pm2-deploy-contention-latest.json');
const LOCK_PATH = path.join(ROOT, '.next', 'lock');

const THRESHOLD = parseInt(process.env.PM2_DEPLOY_CONTENTION_THRESHOLD || '50', 10);
const BLOCK = process.env.DEPLOY_BLOCK_ON_LOCK_RISK === '1' || process.env.DEPLOY_BLOCK_ON_LOCK_RISK === 'true';

function safeExec(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function listNextPids() {
  const out = safeExec("ps -Ao pid,command 2>/dev/null || true");
  if (!out) return [];
  return out
    .split('\n')
    .filter((line) => line.includes('next build --webpack') || line.includes('next dev'))
    .map((line) => line.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function scorePm2Churn() {
  const raw = safeExec('pm2 jlist');
  if (!raw) return { score: 0, highChurnApps: [], pm2Available: false };
  let list;
  try {
    list = JSON.parse(raw);
  } catch {
    return { score: 0, highChurnApps: [], pm2Available: false };
  }
  if (!Array.isArray(list)) return { score: 0, highChurnApps: [], pm2Available: true };

  const highChurnApps = [];
  let score = 0;
  for (const proc of list) {
    const name = proc?.name;
    const restarts = proc?.pm2_env?.restart_time ?? 0;
    if (typeof name !== 'string') continue;
    if (restarts >= 100) {
      score += 25;
      highChurnApps.push({ name, restart_time: restarts, note: 'restart_time>=100' });
    } else if (restarts >= 30) {
      score += 10;
      highChurnApps.push({ name, restart_time: restarts, note: 'restart_time>=30' });
    }
  }
  return { score, highChurnApps, pm2Available: true };
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const blockers = [];
  let riskScore = 0;

  if (fs.existsSync(LOCK_PATH)) {
    riskScore += 40;
    blockers.push({ type: 'next_lock', detail: '.next/lock exists' });
  }

  const nextPids = listNextPids();
  if (nextPids.length > 0) {
    riskScore += Math.min(60, nextPids.length * 20);
    blockers.push({
      type: 'next_process',
      detail: `Found ${nextPids.length} next dev/build process(es)`,
      pids: nextPids.slice(0, 20),
    });
  }

  const churn = scorePm2Churn();
  riskScore += churn.score;
  if (churn.highChurnApps.length > 0) {
    blockers.push({
      type: 'pm2_churn',
      detail: 'High PM2 restart counts detected',
      apps: churn.highChurnApps.slice(0, 30),
    });
  }

  const riskLevel = riskScore >= THRESHOLD ? 'high' : riskScore >= Math.floor(THRESHOLD / 2) ? 'medium' : 'low';

  const payload = {
    generatedAt: new Date().toISOString(),
    riskScore,
    riskLevel,
    threshold: THRESHOLD,
    blockOnRisk: BLOCK,
    pm2Available: churn.pm2Available,
    blockers,
    recommendation:
      riskLevel === 'high'
        ? 'Pause zion-website, run npm run build:lock:heal, or use DEPLOY_QUIET_MODE=1 before deploy:local.'
        : 'Contention looks acceptable for local build.',
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2));
  console.log(`PM2 deploy contention report: ${REPORT_PATH}`);
  console.log(`riskScore=${riskScore} level=${riskLevel} (threshold=${THRESHOLD})`);

  if (BLOCK && riskScore >= THRESHOLD) {
    console.error('\nDeploy blocked: lock/build contention risk too high.');
    console.error(JSON.stringify(blockers, null, 2));
    process.exitCode = 1;
  }
}

main();
