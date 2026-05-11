#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const DEPLOY_STATUS = path.join(REPORT_DIR, 'deploy-status-latest.json');
const OUT = path.join(REPORT_DIR, 'deploy-freshness-sla-latest.json');
const HISTORY = path.join(REPORT_DIR, 'deploy-freshness-sla-history.json');
const ROUTES_FILE = path.join(ROOT, 'config', 'smoke-routes.txt');

const BASE_URL = process.env.DEPLOY_FRESHNESS_BASE_URL || 'https://ziontechgroup.com';
const MAX_ROUTES = Number(process.env.DEPLOY_FRESHNESS_MAX_ROUTES || 20);
const MAX_AGE_SECONDS = Number(process.env.DEPLOY_FRESHNESS_MAX_AGE_SECONDS || 5400);
const ATTEMPTS = Number(process.env.DEPLOY_FRESHNESS_ATTEMPTS || 3);
const RETRY_DELAY_MS = Number(process.env.DEPLOY_FRESHNESS_RETRY_DELAY_MS || 15000);
const HISTORY_LIMIT = Number(process.env.DEPLOY_FRESHNESS_HISTORY_LIMIT || 96);
const FAIL_ON_BREACH = String(process.env.DEPLOY_FRESHNESS_FAIL_ON_BREACH || '0') === '1';

function readJsonSafe(file, fallback = null) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, payload) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function readRoutes() {
  if (!fs.existsSync(ROUTES_FILE)) return ['/'];
  return fs
    .readFileSync(ROUTES_FILE, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .filter((line) => line.startsWith('/'))
    .slice(0, MAX_ROUTES);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkRoute(route) {
  const attempts = [];
  for (let i = 1; i <= ATTEMPTS; i += 1) {
    let status = 0;
    let error = null;
    try {
      const response = await fetch(`${BASE_URL}${route}`, { redirect: 'follow' });
      status = Number(response.status || 0);
    } catch (err) {
      error = err.message || String(err);
    }
    attempts.push({ attempt: i, status, error });
    if (status >= 200 && status < 400) {
      return { route, ok: true, attempts };
    }
    if (i < ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }
  return { route, ok: false, attempts };
}

function deployAgeSeconds(status) {
  const stamp = Date.parse(status?.generatedAt || status?.updatedAt || '');
  if (!Number.isFinite(stamp)) return 999999;
  return Math.max(0, Math.floor((Date.now() - stamp) / 1000));
}

async function main() {
  const status = readJsonSafe(DEPLOY_STATUS, {});
  const routes = readRoutes();
  const routeResults = [];
  for (const route of routes) {
    const result = await checkRoute(route);
    routeResults.push(result);
    const last = result.attempts[result.attempts.length - 1];
    console.log(`${result.ok ? 'OK' : 'FAIL'} ${route} (${last.status || 'ERR'})`);
  }

  const ageSeconds = deployAgeSeconds(status);
  const failing = routeResults.filter((route) => !route.ok).map((route) => route.route);
  const staleDeploy = ageSeconds > MAX_AGE_SECONDS;
  const statusOk = String(status?.status || 'unknown') === 'success';
  const healthy = statusOk && !staleDeploy && failing.length === 0;

  const report = {
    generatedAt: new Date().toISOString(),
    status: healthy ? 'healthy' : 'breach',
    checks: {
      deployStatus: String(status?.status || 'unknown'),
      deployAgeSeconds: ageSeconds,
      deployFreshnessWithinSla: !staleDeploy,
      routesChecked: routes.length,
      failingRoutes: failing.length,
    },
    config: {
      baseUrl: BASE_URL,
      maxAgeSeconds: MAX_AGE_SECONDS,
      attempts: ATTEMPTS,
      retryDelayMs: RETRY_DELAY_MS,
      maxRoutes: MAX_ROUTES,
    },
    deploy: {
      source: status?.source || 'unknown',
      sha: status?.sha || null,
      runId: status?.runId || null,
      workflow: status?.workflow || null,
      generatedAt: status?.generatedAt || null,
      netlifyDeployId: status?.netlifyDeployId || null,
      netlifyDeployUrl: status?.netlifyDeployUrl || null,
    },
    failingRoutes: failing,
    routeResults,
  };
  writeJson(OUT, report);

  const history = readJsonSafe(HISTORY, []);
  const safeHistory = Array.isArray(history) ? history : [];
  safeHistory.push({
    at: report.generatedAt,
    status: report.status,
    deployAgeSeconds: ageSeconds,
    failingRoutes: failing.length,
    sha: report.deploy.sha,
  });
  writeJson(HISTORY, safeHistory.slice(-HISTORY_LIMIT));

  console.log(
    `[deploy-freshness-sla] status=${report.status} age=${ageSeconds}s failing=${failing.length} deploy=${statusOk ? 'success' : 'non-success'}`,
  );
  if (FAIL_ON_BREACH && !healthy) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[deploy-freshness-sla] ${error.message}`);
  process.exit(1);
});
