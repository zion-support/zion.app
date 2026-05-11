#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { AUTONOMY_AGENT_CONFIG } = require('./autonomy-agent-config.cjs');

const ROOT = process.cwd();
const cfg = AUTONOMY_AGENT_CONFIG.releaseGuardian;
const BASE_URL = process.env.RELEASE_GUARDIAN_BASE_URL || 'https://ziontechgroup.com';
const ROUTES_FILE = process.env.RELEASE_GUARDIAN_ROUTES_FILE || 'config/smoke-routes.txt';
const MAX_ROUTES = Number(process.env.RELEASE_GUARDIAN_MAX_ROUTES || cfg.maxRoutesToCheck);
const ATTEMPTS = Number(process.env.RELEASE_GUARDIAN_ATTEMPTS || cfg.attempts);
const INTERVAL_MS = Number(process.env.RELEASE_GUARDIAN_INTERVAL_MS || cfg.intervalMs);
const STRICT_MODE = process.argv.includes('--strict');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'autonomous-release-guardian-latest.json');
const MD_REPORT = path.join(REPORT_DIR, 'autonomous-release-guardian-latest.md');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readRoutes() {
  const fullPath = path.join(ROOT, ROUTES_FILE);
  if (!fs.existsSync(fullPath)) return ['/'];
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

function toMarkdown(report) {
  const lines = [];
  lines.push('# Autonomous Release Guardian');
  lines.push('');
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Base URL: \`${report.baseUrl}\``);
  lines.push(`- Checked routes: \`${report.checkedCount}\``);
  lines.push(`- Unhealthy routes: \`${report.unhealthyCount}\``);
  lines.push(`- Severity: \`${report.severity}\``);
  lines.push(`- Rollback recommended: \`${report.rollbackRecommended ? 'yes' : 'no'}\``);
  lines.push('');
  if (report.unhealthyRoutes.length) {
    lines.push('## Unhealthy routes');
    lines.push('');
    for (const route of report.unhealthyRoutes) {
      lines.push(`- ${route}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  const routes = readRoutes();
  const results = [];
  for (const route of routes) {
    const result = await checkRoute(route);
    results.push(result);
    const status = result.attempts[result.attempts.length - 1].status;
    console.log(`${result.healthy ? 'OK' : 'FAIL'} ${route} (${status})`);
  }

  const unhealthyRoutes = results.filter((r) => !r.healthy).map((r) => r.route);
  const unhealthyCount = unhealthyRoutes.length;
  const rollbackRecommended = unhealthyCount >= cfg.strictFailureThreshold;
  const severity =
    unhealthyCount >= cfg.strictFailureThreshold
      ? 'critical'
      : unhealthyCount >= cfg.unhealthyRoutesAlertThreshold
        ? 'warning'
        : 'ok';

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    checkedCount: results.length,
    unhealthyCount,
    unhealthyRoutes,
    severity,
    rollbackRecommended,
    thresholds: {
      unhealthyRoutesAlertThreshold: cfg.unhealthyRoutesAlertThreshold,
      strictFailureThreshold: cfg.strictFailureThreshold,
    },
    results,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));
  fs.writeFileSync(MD_REPORT, toMarkdown(report));
  console.log(`Release guardian report written to ${JSON_REPORT}`);

  if (STRICT_MODE && unhealthyCount >= cfg.strictFailureThreshold) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[autonomous-release-guardian] ${error.message}`);
  process.exit(1);
});
