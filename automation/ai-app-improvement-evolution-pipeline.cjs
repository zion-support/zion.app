#!/usr/bin/env node

/**
 * AI App Improvement Evolution Pipeline
 *
 * Visits ziontechgroup.com, audits for improvements, implements safe fixes,
 * generates evolution ideas, and optionally commits and deploys.
 *
 * Pipeline:
 * 1. Site visit (health check)
 * 2. System intelligence audit
 * 3. Live site UX audit
 * 4. Conversion funnel audit
 * 5. UX auto-fix (when score < 85)
 * 6. System intelligence auto-fix
 * 7. CTA tracking implementation
 * 8. Automation evolution ideas (adds to backlog)
 * 9. App evolution implement (AUTO_APPLY=1 for safe backlog items)
 * 10. Optional: Content burst (2 blog + 2 case studies)
 * 11. Optional: Front page services advertiser
 * 12. Report aggregator
 * 13. Commit & deploy
 *
 * Environment:
 *   AUTO_COMMIT=1       - Commit and push to main after improvements
 *   TRIGGER_DEPLOY=1    - Call NETLIFY_BUILD_HOOK after push
 *   SKIP_CONTENT=1      - Skip content burst and services advertiser
 *   TRIGGER_FIXES=1     - Skip UX auto-fix when score >= 85
 *   SKIP_LIGHTHOUSE=1   - Skip Lighthouse + perf regression + live a11y (default on)
 *   SKIP_PERF_REGRESSION=1 - Skip performance regression check
 *   SKIP_LIVE_A11Y=1    - Skip live site accessibility audit
 *
 * Run: npm run app:improvement-evolution | app:improvement-evolution-commit | app:improvement-evolution-deploy
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
const REPORT_FILE = path.join(REPORTS_DIR, 'app-improvement-evolution-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const SKIP_CONTENT = process.env.SKIP_CONTENT === '1';
const TRIGGER_FIXES = process.env.TRIGGER_FIXES === '1';
const SKIP_LIGHTHOUSE = process.env.SKIP_LIGHTHOUSE === '1';
const SKIP_PERF_REGRESSION = process.env.SKIP_PERF_REGRESSION === '1';
const SKIP_LIVE_A11Y = process.env.SKIP_LIVE_A11Y === '1';

const { loadPages } = require('./lib/pages-to-visit.cjs');
const PAGES_TO_VISIT = loadPages({ includeExtended: true });

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppImprovementEvo] ${ts} | ${msg}`);
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
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-AppImprovementEvo/1.0' },
    };
    const req = https.request(options, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const loc = res.headers.location;
        const nextUrl = loc.startsWith('http') ? loc : `https://${u.hostname}${loc.startsWith('/') ? loc : '/' + loc}`;
        return fetchPage(nextUrl).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
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
  log('=== App Improvement Evolution Pipeline Started ===');

  const results = [];

  // 1. Site visit
  const visitResults = await visitSite();
  results.push({ step: 'site_visit', ok: visitResults.every((r) => r.ok), details: visitResults });

  // 1b. Optional: Lighthouse + performance regression + live a11y (enable via env)
  if (!SKIP_LIGHTHOUSE) {
    results.push({
      step: 'lighthouse_production',
      ok: run('node automation/ai-lighthouse-production-audit.cjs run', 'Lighthouse Production Audit').ok,
    });
  }
  if (!SKIP_PERF_REGRESSION) {
    results.push({
      step: 'performance_regression',
      ok: run('node automation/ai-performance-regression-agent.cjs run', 'Performance Regression').ok,
    });
  }
  if (!SKIP_LIVE_A11Y) {
    results.push({
      step: 'live_site_accessibility',
      ok: run('node automation/ai-live-site-accessibility-audit-agent.cjs run', 'Live Site Accessibility Audit').ok,
    });
  }
  // When quality audits ran, generate evolution ideas from quality reports
  if (!SKIP_LIGHTHOUSE || !SKIP_PERF_REGRESSION || !SKIP_LIVE_A11Y) {
    results.push({
      step: 'evolution_ideas_from_quality',
      ok: run('npm run app:evolution-ideas-from-quality', 'Evolution Ideas from Quality').ok,
    });
  }

  // 2. System intelligence audit
  results.push({
    step: 'system_intelligence_audit',
    ok: run('node automation/ai-system-intelligence-audit-agent.cjs', 'System Intelligence Audit').ok,
  });

  // 3. Live site UX audit
  results.push({
    step: 'live_site_ux_audit',
    ok: run('node automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit').ok,
  });

  // 4. Conversion funnel audit
  results.push({
    step: 'conversion_funnel_audit',
    ok: run('node automation/ai-conversion-funnel-audit-agent.cjs', 'Conversion Funnel Audit').ok,
  });

  // 4b. Evolution ideas from audits (system intelligence + conversion funnel)
  results.push({
    step: 'evolution_ideas_from_audits',
    ok: run('npm run app:evolution-ideas-from-audits', 'Evolution Ideas from Audits').ok,
  });

  // 4c. Schema enhancement suggestions
  results.push({
    step: 'schema_enhancement_suggestions',
    ok: run('npm run app:schema-enhancement-suggestions', 'Schema Enhancement Suggestions').ok,
  });

  // 5. UX auto-fix (when score < 85)
  let shouldRunUxFix = true;
  if (TRIGGER_FIXES) {
    try {
      const uxReport = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json'), 'utf8'));
      if (uxReport.score >= 85) {
        shouldRunUxFix = false;
        log('UX score >= 85; skipping auto-fix (TRIGGER_FIXES)');
      }
    } catch (_) {}
  }
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
      ok: run('MAX_FILES=15 node automation/ai-cta-tracking-implementation-agent.cjs', 'CTA Tracking Implementation').ok,
    });
  }

  // 6. Automation evolution ideas
  results.push({
    step: 'automation_evolution_ideas',
    ok: run('node automation/ai-local-llm-automation-evolution-agent.cjs run', 'Automation Evolution Ideas').ok,
  });

  // 7. App evolution implement (AUTO_APPLY=1)
  results.push({
    step: 'app_evolution_implement',
    ok: run('AUTO_APPLY=1 node automation/ai-app-evolution-automation-agent.cjs run', 'App Evolution Implement').ok,
  });

  // 8. Optional content burst and services advertiser
  if (!SKIP_CONTENT) {
    results.push({
      step: 'content_burst',
      ok: run('MAX_TEMPLATE_BLOG=2 MAX_TEMPLATE_CASE_STUDIES=2 SKIP_SERVICES_ADVERTISE=1 node automation/ai-content-burst-agent.cjs', 'Content Burst (2+2)').ok,
    });
    results.push({
      step: 'front_page_services_advertiser',
      ok: run('MAX_ADD=3 node automation/ai-front-page-services-advertiser-agent.cjs', 'Front Page Services Advertiser').ok,
    });
  }

  // 9. Report aggregator
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

  // Commit & deploy
  if (AUTO_COMMIT && hasChanges()) {
    log('Committing changes...');
    execSync('git add -A', { cwd: ROOT });
    execSync('git commit -m "chore(app): app improvement evolution audit and implementations"', { cwd: ROOT });
    execSync('git push origin main', { cwd: ROOT });
    log('Pushed to main');

    if (TRIGGER_DEPLOY) {
      await triggerDeploy();
    }
  } else if (AUTO_COMMIT && !hasChanges()) {
    log('No changes to commit.');
  }

  log('=== App Improvement Evolution Pipeline Finished ===');

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
