#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Escalate/close issue for AI Lab hub-links smoke failures.
 * Reads compare report first, then falls back to production report.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawnSync } = require('child_process');
const { recordEscalation } = require('./lib/incident-cooldown-mesh.cjs');

const ROOT = process.cwd();
const COMPARE = path.join(ROOT, 'automation', 'reports', 'ai-lab-hub-links-smoke-compare-latest.json');
const PROD = path.join(ROOT, 'automation', 'reports', 'ai-lab-hub-links-smoke-prod.json');
const DEDUPE = path.join(ROOT, 'scripts', 'automation', 'gh-issue-dedupe-or-create.cjs');
const CLOSE = path.join(ROOT, 'scripts', 'automation', 'gh-issue-close-on-recovery.cjs');
const BODY = path.join(ROOT, 'automation', 'reports', '.runtime', 'ai-lab-hub-links-smoke-body.md');
const FP = 'ai-lab-hub-links-smoke-failing|v1';

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function runNode(script, env) {
  return spawnSync(process.execPath, [script], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function postJson(urlStr, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyObj);
    const u = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode));
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function remediationHints(routes) {
  const hints = new Set();
  for (const route of routes) {
    if (route.startsWith('/ai-lab/')) {
      hints.add('Verify tool page exists under `app/ai-lab/**/page.tsx` and route is exported statically.');
      hints.add('Re-run `npm run validate:ai-lab-route-contract -- --fix` and commit `config/smoke-routes.txt` if changed.');
    }
    if (route === '/ai-lab') {
      hints.add('Check AI Lab hub card links against `app/ai-lab/ai-lab-tools.ts` href list.');
    }
  }
  return [...hints];
}

function shouldSuppressByFlake(cmp, failed, severity) {
  if (severity !== 'warning') return { suppress: false, reason: 'severity-not-warning' };
  const rows = Array.isArray(cmp?.flakyRoutes) ? cmp.flakyRoutes : [];
  if (rows.length === 0) return { suppress: false, reason: 'no-flake-data' };
  const minScore = Number(process.env.AI_LAB_HUB_FLAKE_SUPPRESS_SCORE || 0.65);
  const minSamples = Number(process.env.AI_LAB_HUB_FLAKE_SUPPRESS_SAMPLES || 5);
  const map = new Map(rows.map((r) => [String(r.route), r]));
  const onlyFlaky = failed.every((route) => {
    const x = map.get(route);
    return x && Number(x.samples || 0) >= minSamples && Number(x.flakeScore || 0) >= minScore;
  });
  if (!onlyFlaky) return { suppress: false, reason: 'contains-non-flaky-route' };
  return { suppress: true, reason: `flake-suppressed(score>=${minScore},samples>=${minSamples})` };
}

async function notifySeverityChannels(severity, summary, failed) {
  const text = [
    `[Zion automation] AI Lab hub-links ${severity.toUpperCase()}`,
    summary,
    ...failed.slice(0, 12).map((r) => `- ${r}`),
  ].join('\n');

  const warningSlack = process.env.AI_LAB_HUB_WARNING_SLACK_WEBHOOK;
  const warningDiscord = process.env.AI_LAB_HUB_WARNING_DISCORD_WEBHOOK;
  const criticalSlack =
    process.env.AI_LAB_HUB_CRITICAL_SLACK_WEBHOOK || process.env.AI_LAB_HUB_WARNING_SLACK_WEBHOOK;
  const criticalDiscord =
    process.env.AI_LAB_HUB_CRITICAL_DISCORD_WEBHOOK || process.env.AI_LAB_HUB_WARNING_DISCORD_WEBHOOK;
  const criticalPd = process.env.AI_LAB_HUB_CRITICAL_PAGERDUTY_ROUTING_KEY;

  const tasks = [];
  if (severity === 'critical') {
    if (criticalSlack) tasks.push(postJson(criticalSlack, { text }));
    if (criticalDiscord) tasks.push(postJson(criticalDiscord, { content: text.slice(0, 1800) }));
    if (criticalPd) {
      tasks.push(
        postJson('https://events.pagerduty.com/v2/enqueue', {
          routing_key: criticalPd,
          event_action: 'trigger',
          payload: {
            summary: text.slice(0, 1024),
            source: 'zion-ai-lab-hub-links-smoke',
            severity: 'critical',
          },
        }),
      );
    }
  } else if (severity === 'warning') {
    if (warningSlack) tasks.push(postJson(warningSlack, { text }));
    if (warningDiscord) tasks.push(postJson(warningDiscord, { content: text.slice(0, 1800) }));
  }
  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

function closeRecovered() {
  const r = runNode(CLOSE, {
    ISSUE_FINGERPRINT: FP,
    CLOSE_COMMENT: 'Auto-closing: AI Lab hub-links smoke recovered.',
  });
  if (r.status !== 0) {
    console.warn('[ai-lab-hub-links-escalate] close-on-recovery non-fatal:', r.stderr || r.stdout);
  }
}

async function main() {
  const cmp = readJsonSafe(COMPARE);
  const prod = readJsonSafe(PROD);

  let failed = [];
  let severity = 'none';
  let routeClass = 'unknown';
  let summary = 'No report data available.';
  if (cmp && Array.isArray(cmp.regressedInPreview)) {
    const prodOnly = Array.isArray(cmp.regressedInProd) ? cmp.regressedInProd : [];
    const prevOnly = cmp.regressedInPreview;
    if (prodOnly.length > 0) {
      failed = prodOnly.slice(0, 40);
      severity = 'critical';
      routeClass = 'prod-regression';
      summary = `Production regressions: ${prodOnly.length}`;
    } else {
      failed = prevOnly.slice(0, 40);
      severity = prevOnly.length > 0 ? 'warning' : 'none';
      routeClass = prevOnly.length > 0 ? 'preview-regression' : 'healthy';
      summary = `Preview regressions vs production: ${prevOnly.length}`;
    }
  } else if (prod && Array.isArray(prod.results)) {
    failed = prod.results.filter((r) => r.ok !== true).map((r) => r.path).slice(0, 40);
    severity = failed.length > 0 ? 'critical' : 'none';
    routeClass = failed.length > 0 ? 'prod-failure' : 'healthy';
    summary = `Production failures: ${failed.length}`;
  }

  if (failed.length === 0) {
    console.log('[ai-lab-hub-links-escalate] healthy; attempting close-on-recovery');
    closeRecovered();
    return;
  }
  const flake = shouldSuppressByFlake(cmp, failed, severity);
  if (flake.suppress) {
    console.log(`[ai-lab-hub-links-escalate] ${flake.reason}; skipping issue escalation`);
    return;
  }

  const lines = [
    'AI Lab hub-links smoke reported failures.',
    '',
    `- Summary: ${summary}`,
    `- Severity: ${severity}`,
    `- Route class: ${routeClass}`,
    `- Flake suppression: ${flake.reason}`,
    `- Compare report: ${path.relative(ROOT, COMPARE)}`,
    `- Prod report: ${path.relative(ROOT, PROD)}`,
    '',
    '## Failing routes',
    ...failed.map((p) => `- \`${p}\``),
    '',
    '## Remediation hints',
    ...remediationHints(failed).map((h) => `- ${h}`),
  ];
  fs.mkdirSync(path.dirname(BODY), { recursive: true });
  fs.writeFileSync(BODY, `${lines.join('\n')}\n`, 'utf8');

  const r = runNode(DEDUPE, {
    ISSUE_TITLE: '[automation] AI Lab hub links smoke failing',
    ISSUE_BODY_FILE: BODY,
    ISSUE_LABELS: `automation,ai-lab,${severity === 'critical' ? 'automation-slo-critical' : 'automation-slo-warning'},${routeClass},hub-links-smoke`,
    ISSUE_FINGERPRINT: FP,
    COOLDOWN_HOURS: String(process.env.COOLDOWN_HOURS || '12'),
  });
  process.stdout.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  if (r.status !== 0) process.exit(r.status);

  try {
    await notifySeverityChannels(severity, summary, failed);
  } catch (e) {
    console.warn('[ai-lab-hub-links-escalate] channel notify non-fatal:', e.message);
  }
  recordEscalation('ai-lab-hub-links-smoke', { meta: { failedCount: failed.length, severity, routeClass } });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
