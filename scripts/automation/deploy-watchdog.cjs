#!/usr/bin/env node
 
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = process.env.DEPLOY_WATCHDOG_BASE_URL || 'https://ziontechgroup.com';
const ROUTES_FILE = process.env.DEPLOY_WATCHDOG_ROUTES_FILE || 'config/smoke-routes.txt';
const MAX_ROUTES = Number(process.env.DEPLOY_WATCHDOG_MAX_ROUTES || 25);
const ATTEMPTS = Number(process.env.DEPLOY_WATCHDOG_ATTEMPTS || 4);
const INTERVAL_MS = Number(process.env.DEPLOY_WATCHDOG_INTERVAL_MS || 30000);
const FAIL_ON_UNHEALTHY = process.argv.includes('--strict');
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'deploy-watchdog-latest.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readRoutes() {
  const fullPath = path.join(ROOT, ROUTES_FILE);
  if (!fs.existsSync(fullPath)) {
    return ['/'];
  }
  return fs
    .readFileSync(fullPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .slice(0, MAX_ROUTES);
}

async function fetchStatus(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    return response.status;
  } catch {
    return 0;
  }
}

async function checkRoute(route) {
  const url = `${BASE_URL}${route}`;
  const attempts = [];
  for (let i = 1; i <= ATTEMPTS; i += 1) {
    const status = await fetchStatus(url);
    attempts.push({ attempt: i, status });
    if (status === 200) {
      return { route, healthy: true, attempts };
    }
    if (i < ATTEMPTS) {
      await sleep(INTERVAL_MS);
    }
  }
  return { route, healthy: false, attempts };
}

async function main() {
  const routes = readRoutes();
  const results = [];
  for (const route of routes) {
    const result = await checkRoute(route);
    results.push(result);
    const last = result.attempts[result.attempts.length - 1];
    console.log(`${result.healthy ? 'OK' : 'FAIL'} ${route} (${last.status})`);
  }

  const unhealthy = results.filter((result) => !result.healthy).map((result) => result.route);
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    attempts: ATTEMPTS,
    checkedCount: results.length,
    unhealthyCount: unhealthy.length,
    healthy: unhealthy.length === 0,
    unhealthyRoutes: unhealthy,
    results,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Deploy watchdog report written to ${REPORT_PATH}`);

  if (FAIL_ON_UNHEALTHY && unhealthy.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[deploy-watchdog] ${error.message}`);
  process.exit(1);
});
