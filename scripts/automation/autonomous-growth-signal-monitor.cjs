#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { AUTONOMY_AGENT_CONFIG } = require('./autonomy-agent-config.cjs');

const ROOT = process.cwd();
const cfg = AUTONOMY_AGENT_CONFIG.growthSignal;
const BASE_URL = process.env.GROWTH_SIGNAL_BASE_URL || 'https://ziontechgroup.com';
const STRICT_MODE = process.argv.includes('--strict');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'autonomous-growth-signal-latest.json');
const MD_REPORT = path.join(REPORT_DIR, 'autonomous-growth-signal-latest.md');

function runNodeScript(relativePath) {
  const result = spawnSync('node', [relativePath], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 5 * 60 * 1000,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    ok: result.status === 0,
    exitCode: result.status,
    output: `${result.stdout || ''}\n${result.stderr || ''}`.trim(),
  };
}

function extractHomepagePromotedRoutes() {
  const homepage = path.join(ROOT, 'app', 'page.tsx');
  if (!fs.existsSync(homepage)) return [];
  const src = fs.readFileSync(homepage, 'utf8');
  const routes = new Set();
  const regex = /href="(\/[^"#?]+)"/g;
  let match = regex.exec(src);
  while (match) {
    const route = match[1].trim();
    if (!route.startsWith('/_') && !route.startsWith('/api/')) routes.add(route);
    match = regex.exec(src);
  }
  return Array.from(routes);
}

async function fetchStatus(route) {
  try {
    const response = await fetch(`${BASE_URL}${route}`, { redirect: 'follow' });
    return response.status;
  } catch {
    return 0;
  }
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Autonomous Growth Signal Monitor');
  lines.push('');
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Severity: \`${report.severity}\``);
  lines.push(`- Promoted routes: \`${report.promotedRouteCount}\``);
  lines.push(`- Live unhealthy routes: \`${report.liveUnhealthyCount}\``);
  lines.push(`- Sync check: \`${report.homepageAiSync.ok ? 'pass' : 'fail'}\``);
  lines.push(`- Promotion route check: \`${report.promotionsRouteCheck.ok ? 'pass' : 'fail'}\``);
  lines.push('');
  if (report.liveUnhealthyRoutes.length) {
    lines.push('## Live unhealthy routes');
    lines.push('');
    for (const route of report.liveUnhealthyRoutes) {
      lines.push(`- ${route.route} (${route.status})`);
    }
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  const homepageAiSync = runNodeScript('scripts/automation/check-homepage-ai-sync.cjs');
  const promotionsRouteCheck = runNodeScript('scripts/automation/validate-promoted-routes.cjs');
  const promotedRoutes = extractHomepagePromotedRoutes();
  const liveChecks = [];
  for (const route of promotedRoutes.slice(0, cfg.maxLiveRoutesToCheck)) {
    const status = await fetchStatus(route);
    liveChecks.push({ route, status, healthy: status === 200 });
  }
  const liveUnhealthyRoutes = liveChecks.filter((item) => !item.healthy);
  const severe =
    promotedRoutes.length < cfg.minPromotedRoutes ||
    !homepageAiSync.ok ||
    !promotionsRouteCheck.ok ||
    liveUnhealthyRoutes.length >= cfg.liveUnhealthyThreshold;
  const severity = severe ? 'warning' : 'ok';

  const report = {
    generatedAt: new Date().toISOString(),
    promotedRouteCount: promotedRoutes.length,
    liveCheckedCount: liveChecks.length,
    liveUnhealthyCount: liveUnhealthyRoutes.length,
    liveUnhealthyRoutes,
    homepageAiSync,
    promotionsRouteCheck,
    severity,
    thresholds: {
      minPromotedRoutes: cfg.minPromotedRoutes,
      liveUnhealthyThreshold: cfg.liveUnhealthyThreshold,
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));
  fs.writeFileSync(MD_REPORT, toMarkdown(report));
  console.log(`Growth signal report written to ${JSON_REPORT}`);

  if (STRICT_MODE && severity !== 'ok') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[autonomous-growth-signal-monitor] ${error.message}`);
  process.exit(1);
});
