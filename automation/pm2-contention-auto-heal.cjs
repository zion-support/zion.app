#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Host-side helper: if deploy contention stays "high" for N consecutive checks,
 * run `npm run build:lock:heal` (bounded by cooldown).
 *
 * Intended for cron/PM2 on a dev/build machine — not for GitHub Actions.
 *
 * Env:
 *   PM2_CONTENTION_AUTO_HEAL=1 — required to perform heal (safety gate)
 *   PM2_CONTENTION_HIGH_STREAK=3 — consecutive high readings (default 3)
 *   PM2_CONTENTION_HEAL_COOLDOWN_MINUTES=30 — min gap between heals (default 30)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'pm2-deploy-contention-latest.json');
const STATE_PATH = path.join(ROOT, 'automation', 'reports', 'pm2-contention-auto-heal-state.json');

const STREAK = Math.max(2, parseInt(process.env.PM2_CONTENTION_HIGH_STREAK || '3', 10));
const COOLDOWN_MS = Math.max(5, parseInt(process.env.PM2_CONTENTION_HEAL_COOLDOWN_MINUTES || '30', 10)) * 60 * 1000;

function readJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function main() {
  if (process.env.PM2_CONTENTION_AUTO_HEAL !== '1' && process.env.PM2_CONTENTION_AUTO_HEAL !== 'true') {
    console.log('[contention-auto-heal] PM2_CONTENTION_AUTO_HEAL not set; no-op.');
    process.exit(0);
  }

  const report = readJson(REPORT_PATH);
  if (!report || typeof report.riskScore !== 'number') {
    console.log('[contention-auto-heal] No contention report.');
    process.exit(0);
  }

  if (report.blockOnRisk === true) {
    console.log('[contention-auto-heal] blockOnRisk=true — let operator unblock first.');
    process.exit(0);
  }

  const state = readJson(STATE_PATH) || { readings: [], lastHealAt: null };
  const readings = Array.isArray(state.readings) ? state.readings : [];
  const entry = {
    at: new Date().toISOString(),
    riskLevel: report.riskLevel,
    riskScore: report.riskScore,
  };
  readings.push(entry);
  state.readings = readings.slice(-30);

  const lastN = state.readings.slice(-STREAK);
  const allHigh =
    lastN.length >= STREAK && lastN.every((r) => r.riskLevel === 'high' || r.riskScore >= (report.threshold || 50));

  if (!allHigh) {
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    console.log(`[contention-auto-heal] Streak ${lastN.length}/${STREAK}, no heal.`);
    process.exit(0);
  }

  const lastHeal = state.lastHealAt ? Date.parse(state.lastHealAt) : 0;
  if (lastHeal && Date.now() - lastHeal < COOLDOWN_MS) {
    console.log('[contention-auto-heal] Cooldown since last heal; skipping.');
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    process.exit(0);
  }

  console.log('[contention-auto-heal] Running npm run build:lock:heal ...');
  try {
    execSync('npm run build:lock:heal', { cwd: ROOT, stdio: 'inherit', env: process.env });
    state.lastHealAt = new Date().toISOString();
    state.readings = [];
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    console.log('[contention-auto-heal] Heal completed; streak reset.');
  } catch (e) {
    console.error('[contention-auto-heal] Heal failed:', e.message);
    fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    process.exit(1);
  }
}

main();
