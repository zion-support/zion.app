#!/usr/bin/env node

/**
 * AI Daily Automation Pipeline
 *
 * Orchestrates key automation agents in sequence for a full daily run.
 * Use via cron (e.g. 6 AM) or GitHub Actions.
 *
 * Pipeline order:
 * 1. Ecosystem intelligence (generate suggestions)
 * 2. Suggestion importer (apply safe suggestions)
 * 3. Broken link audit
 * 4. Site link audit
 * 5. Automation audit
 * 6. Automation self-healing (when issues found)
 * 7. Content freshness
 * 8. SEO content refresh
 * 9. Report aggregator
 * 10. Telegram digest (optional, respects quiet hours)
 * 11. Deploy trigger (when TRIGGER_DEPLOY=1)
 *
 * Environment:
 *   SKIP_TELEGRAM=1 - Skip Telegram digest
 *   DRY_RUN=1 - Log steps only, don't execute
 *   TRIGGER_DEPLOY=1 - Trigger Netlify build after pipeline (NETLIFY_BUILD_HOOK)
 *   AUTO_COMMIT=1 - Commit and push changes (requires TRIGGER_DEPLOY for deploy)
 */

const { execSync } = require('child_process');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const DRY_RUN = process.env.DRY_RUN === '1';
const SKIP_TELEGRAM = process.env.SKIP_TELEGRAM === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DailyPipeline] ${ts} | ${msg}`);
}

function run(cmd, label) {
  log(`Running: ${label}`);
  if (DRY_RUN) {
    log(`  [DRY] ${cmd}`);
    return { ok: true };
  }
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

const steps = [
  ['node automation/ai-ecosystem-intelligence-agent.cjs run', 'Ecosystem Intelligence'],
  ['node automation/ai-system-intelligence-audit-agent.cjs', 'System Intelligence Audit'],
  ['node automation/ai-suggestion-importer-agent.cjs run', 'Suggestion Importer'],
  ['node automation/ai-broken-link-page-automation.cjs audit', 'Broken Link Audit'],
  ['node automation/ai-site-link-audit-automation.cjs audit', 'Site Link Audit'],
  ['node automation/ai-automation-audit-agent.cjs run', 'Automation Audit'],
  ['node automation/ai-automation-self-healing-agent.cjs run', 'Automation Self-Healing'],
  ['node automation/ai-content-freshness-agent.cjs run', 'Content Freshness'],
  ['node automation/ai-seo-content-refresh-agent.cjs run', 'SEO Content Refresh'],
  ['node automation/ai-report-aggregator-agent.cjs', 'Report Aggregator'],
];

if (!SKIP_TELEGRAM) {
  steps.push(['node automation/ai-telegram-notification-agent.cjs digest', 'Telegram Digest']);
}

function triggerDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set. Skipping deploy trigger.');
    return Promise.resolve({ ok: false, reason: 'no_hook' });
  }
  return new Promise((resolve) => {
    try {
      const u = new URL(hook);
      const req = https.request(
        { hostname: u.hostname, path: u.pathname + u.search, method: 'POST' },
        (res) => {
          log(`Deploy trigger: ${res.statusCode}`);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 400 });
        }
      );
      req.on('error', (e) => {
        log(`Deploy trigger failed: ${e.message}`);
        resolve({ ok: false, error: e.message });
      });
      req.end();
    } catch (e) {
      log(`Deploy trigger error: ${e.message}`);
      resolve({ ok: false, error: e.message });
    }
  });
}

async function main() {
  log('=== Daily Automation Pipeline Started ===');
  const results = [];
  for (const [cmd, label] of steps) {
    const r = run(cmd, label);
    results.push({ step: label, ok: r.ok });
    if (!r.ok && !DRY_RUN) {
      log(`Pipeline stopped after failure: ${label}`);
      break;
    }
  }

  if (TRIGGER_DEPLOY && !DRY_RUN) {
    log('Triggering Netlify deploy...');
    const deployR = await triggerDeploy();
    results.push({ step: 'Deploy Trigger', ok: deployR.ok });
  }

  log('=== Daily Automation Pipeline Finished ===');
  return results;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
