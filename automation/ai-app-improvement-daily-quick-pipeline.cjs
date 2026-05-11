#!/usr/bin/env node

/**
 * AI App Improvement Daily Quick Pipeline
 *
 * Lightweight daily run: site visit + UX audit + auto-fixes + CTA tracking + backlog implement.
 * No content burst, no LLM-heavy steps. Fast feedback loop for continuous improvement.
 *
 * Pipeline:
 * 1. Site visit (health check)
 * 2. System intelligence audit
 * 3. Live site UX audit
 * 4. UX auto-fix (when score < 85)
 * 5. System intelligence auto-fix
 * 6. CTA tracking implementation
 * 7. Evolution backlog implementor
 * 8. Report aggregator
 * 9. Optional: Commit & deploy
 *
 * Environment:
 *   AUTO_COMMIT=1    - Commit and push after improvements
 *   TRIGGER_DEPLOY=1 - Call NETLIFY_BUILD_HOOK after push
 *
 * Run: npm run app:improvement-daily-quick
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-improvement-daily-quick-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';

const { loadPages } = require('./lib/pages-to-visit.cjs');
const PAGES_TO_VISIT = loadPages({ coreOnly: true });

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[DailyQuick] ${ts} | ${msg}`);
}

function run(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname || '/',
        method: 'GET',
        headers: { 'User-Agent': 'ZionTechGroup-DailyQuick/1.0' },
      },
      (res) => {
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          const loc = res.headers.location;
          const nextUrl = loc.startsWith('http') ? loc : `https://${u.hostname}${loc.startsWith('/') ? loc : '/' + loc}`;
          return fetchPage(nextUrl).then(resolve).catch(reject);
        }
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function visitSite() {
  log('Visiting ziontechgroup.com...');
  const results = [];
  for (const { path: p, label } of PAGES_TO_VISIT) {
    const url = `${SITE_URL}${p}`;
    try {
      const { statusCode } = await fetchPage(url);
      results.push({ page: label, url, statusCode, ok: statusCode === 200 });
    } catch (e) {
      results.push({ page: label, url, ok: false, error: e.message });
    }
  }
  const okCount = results.filter((r) => r.ok).length;
  log(`  ${okCount}/${PAGES_TO_VISIT.length} pages OK`);
  return results;
}

function hasChanges() {
  try {
    execSync('git diff --quiet 2>/dev/null', { cwd: ROOT });
    return false;
  } catch {
    return true;
  }
}

function triggerDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set. Skipping deploy trigger.');
    return Promise.resolve({ ok: false, reason: 'no_hook' });
  }
  return new Promise((resolve) => {
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
  });
}

async function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  log('=== App Improvement Daily Quick Pipeline Started ===');

  const results = [];

  const visitResults = await visitSite();
  results.push({ step: 'site_visit', ok: visitResults.every((r) => r.ok), details: visitResults });

  results.push({
    step: 'system_intelligence_audit',
    ok: run('node automation/ai-system-intelligence-audit-agent.cjs', 'System Intelligence Audit').ok,
  });

  results.push({
    step: 'live_site_ux_audit',
    ok: run('node automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit').ok,
  });

  results.push({
    step: 'layout_design_intel',
    ok: run('node automation/ai-layout-design-intelligence-agent.cjs', 'Layout & Design Intelligence').ok,
  });

  let shouldRunUxFix = true;
  try {
    const uxReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json'), 'utf8'));
    if (uxReport.score >= 85) shouldRunUxFix = false;
  } catch (_) {}

  if (shouldRunUxFix) {
    results.push({
      step: 'ux_auto_fix',
      ok: run('node automation/ai-live-site-ux-auto-fix-agent.cjs', 'UX Auto-Fix').ok,
    });
    results.push({
      step: 'system_intelligence_auto_fix',
      ok: run('node automation/ai-system-intelligence-auto-fix-agent.cjs', 'System Intelligence Auto-Fix').ok,
    });
    results.push({
      step: 'cta_tracking_implement',
      ok: run('MAX_FILES=10 node automation/ai-cta-tracking-implementation-agent.cjs', 'CTA Tracking').ok,
    });
  }

  results.push({
    step: 'backlog_implementor',
    ok: run('AUTO_APPLY=1 MAX_APPLY=3 node automation/ai-evolution-backlog-implementor-agent.cjs', 'Backlog Implementor').ok,
  });

  results.push({
    step: 'report_aggregator',
    ok: run('node automation/ai-report-aggregator-agent.cjs', 'Report Aggregator').ok,
  });

  const report = {
    timestamp: new Date().toISOString(),
    url: SITE_URL,
    pipeline: results,
    summary: {
      totalSteps: results.length,
      successCount: results.filter((r) => r.ok).length,
      failedSteps: results.filter((r) => !r.ok).map((r) => r.step),
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  if (AUTO_COMMIT && hasChanges()) {
    log('Committing changes...');
    execSync('git add -A', { cwd: ROOT });
    execSync('git commit -m "chore(app): daily quick improvement audit and fixes"', { cwd: ROOT });
    execSync('git pull --rebase origin main', { cwd: ROOT, stdio: 'inherit' });
    execSync('git push origin HEAD:main', { cwd: ROOT, stdio: 'inherit' });
    log('Pushed to main');
    if (TRIGGER_DEPLOY) await triggerDeploy();
  } else if (AUTO_COMMIT && !hasChanges()) {
    log('No changes to commit.');
  }

  log('=== App Improvement Daily Quick Pipeline Finished ===');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
