#!/usr/bin/env node

/**
 * PM2 Duplicate Process Healer
 *
 * Detects duplicate PM2 process names and auto-heals singleton apps by
 * deleting extra process ids. Writes report to automation/reports.
 *
 * Env:
 *   CONTINUOUS_MODE=true
 *   INTERVAL_MINUTES=30
 *   PM2_DUPLICATE_AUTO_HEAL=1
 *   PM2_SINGLETON_POLICY_FILE=./automation/config/pm2-singleton-policy.json  (default)
 *   PM2_SINGLETON_APPS=...  (optional override; comma list replaces policy file when set)
 *   PM2_DUPLICATE_SKIP_DEPLOY_LOCK=1  (default) — skip auto-heal while deploy lock exists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'pm2-duplicate-healer-latest.json');
const DEPLOY_LOCK_PATH = path.join(ROOT, 'automation', '.deploy-in-progress.lock');
const DEFAULT_POLICY = path.join(ROOT, 'automation', 'config', 'pm2-singleton-policy.json');
const CONTINUOUS = process.env.CONTINUOUS_MODE === 'true' || process.env.CONTINUOUS_MODE === '1';
const INTERVAL_MINUTES = Math.max(10, parseInt(process.env.INTERVAL_MINUTES || '30', 10));
const AUTO_HEAL = process.env.PM2_DUPLICATE_AUTO_HEAL === '1';
const SKIP_HEAL_ON_DEPLOY_LOCK = process.env.PM2_DUPLICATE_SKIP_DEPLOY_LOCK !== '0';

function loadSingletonApps() {
  const envOverride = process.env.PM2_SINGLETON_APPS;
  if (envOverride && envOverride.trim()) {
    return envOverride
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const policyFile = process.env.PM2_SINGLETON_POLICY_FILE
    ? path.resolve(ROOT, process.env.PM2_SINGLETON_POLICY_FILE)
    : DEFAULT_POLICY;
  if (fs.existsSync(policyFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
      if (Array.isArray(data.singletonApps) && data.singletonApps.length) {
        return data.singletonApps.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch (e) {
      console.warn(`[PM2DuplicateHealer] warn: could not read policy ${policyFile}: ${e.message}`);
    }
  }
  return ['openclaw-autonomous-prompts'];
}

function log(msg) {
  console.log(`[PM2DuplicateHealer] ${new Date().toISOString()} | ${msg}`);
}

function ensureDir() {
  const d = path.dirname(REPORT_PATH);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function getPm2List() {
  const raw = execSync('pm2 jlist', { cwd: ROOT, encoding: 'utf8' });
  return JSON.parse(raw);
}

function groupByName(list) {
  const map = new Map();
  for (const p of list) {
    if (!map.has(p.name)) map.set(p.name, []);
    map.get(p.name).push({
      id: p.pm_id,
      status: p.pm2_env && p.pm2_env.status,
      pm_uptime: p.pm2_env && p.pm2_env.pm_uptime ? p.pm2_env.pm_uptime : 0,
    });
  }
  return map;
}

function chooseKeeper(items) {
  const sorted = [...items].sort((a, b) => b.pm_uptime - a.pm_uptime);
  return sorted[0];
}

function runOnce() {
  ensureDir();
  const SINGLETON_APPS = loadSingletonApps();
  const deployLockActive = fs.existsSync(DEPLOY_LOCK_PATH);
  const healAllowed = AUTO_HEAL && (!SKIP_HEAL_ON_DEPLOY_LOCK || !deployLockActive);

  const list = getPm2List();
  const byName = groupByName(list);
  const duplicates = [];
  const healed = [];

  for (const name of SINGLETON_APPS) {
    const items = byName.get(name) || [];
    if (items.length <= 1) continue;
    const keeper = chooseKeeper(items);
    const extras = items.filter((i) => i.id !== keeper.id).map((i) => i.id);
    duplicates.push({ name, count: items.length, keeperId: keeper.id, extraIds: extras });
    if (healAllowed && extras.length > 0) {
      for (const id of extras) {
        try {
          execSync(`pm2 delete ${id}`, { cwd: ROOT, stdio: 'ignore' });
          healed.push({ name, deletedId: id, keptId: keeper.id });
        } catch (_) {}
      }
    }
  }

  const report = {
    at: new Date().toISOString(),
    ok: duplicates.length === 0 || healed.length > 0,
    autoHeal: AUTO_HEAL,
    deployLockActive,
    healSkippedForDeployLock: deployLockActive && AUTO_HEAL && SKIP_HEAL_ON_DEPLOY_LOCK && duplicates.length > 0,
    singletonPolicyFile: process.env.PM2_SINGLETON_POLICY_FILE || './automation/config/pm2-singleton-policy.json',
    singletonApps: SINGLETON_APPS,
    duplicates,
    healed,
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(
    `duplicates=${duplicates.length} healed=${healed.length} deployLock=${deployLockActive} healAllowed=${healAllowed}`
  );
  return report;
}

async function main() {
  if (!CONTINUOUS) {
    runOnce();
    return;
  }
  log(`Continuous mode: every ${INTERVAL_MINUTES} minutes`);
  for (;;) {
    runOnce();
    await new Promise((r) => setTimeout(r, INTERVAL_MINUTES * 60 * 1000));
  }
}

main().catch((e) => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});

