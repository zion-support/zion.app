#!/usr/bin/env node

/**
 * AI Navigation & Pages Audit Automation
 *
 * Orchestrates:
 * 1. Navigation audit (nav constants vs routes, broken links)
 * 2. Site link audit (live site crawl, HTTP status validation)
 * 3. Optional: create missing pages via OpenRouter LLM
 *
 * Usage:
 *   node automation/ai-navigation-pages-audit-automation.cjs run
 *   node automation/ai-navigation-pages-audit-automation.cjs run --create-pages
 *   node automation/ai-navigation-pages-audit-automation.cjs audit
 *
 * Env: OPENROUTER_API_KEY for LLM page creation
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');

function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[NavPages] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function runNavAudit() {
  log('Running navigation audit...');
  const r = spawnSync('node', ['automation/ai-navigation-audit-agent.cjs', 'scan'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    log(`Nav audit stderr: ${r.stderr}`);
  }
  return r.status === 0;
}

function runNavFix() {
  log('Applying safe navigation fixes (sync footer to nav)...');
  const r = spawnSync('node', ['automation/ai-navigation-audit-agent.cjs', 'fix'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return r.status === 0;
}

function runIndustryDiscovery(createPages = false) {
  log('Running industry solution discovery...');
  const args = ['automation/ai-industry-solution-discovery-agent.cjs', 'run'];
  if (createPages) args.push('--create-pages');
  const r = spawnSync('node', args, {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return r.status === 0;
}

function runSolutionsPageSync(apply = false) {
  log('Running solutions page sync (industries → solutions)...');
  const args = ['automation/ai-solutions-page-sync-agent.cjs', 'run'];
  if (apply) args.push('--apply');
  const r = spawnSync('node', args, {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return r.status === 0;
}

function runHomepageSync() {
  log('Running homepage platform spotlight sync (generic → dedicated solution links)...');
  const r = spawnSync('node', ['automation/ai-navigation-homepage-sync-agent.cjs', 'run', '--apply'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return r.status === 0;
}

function runHomepageIndustrySync() {
  log('Running homepage industrySolutions sync (generic → dedicated solution links)...');
  const r = spawnSync('node', ['automation/ai-homepage-industry-sync-agent.cjs', 'run', '--apply'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return r.status === 0;
}

function runLiveNavAudit() {
  log('Running live navigation audit (live site)...');
  const r = spawnSync('node', ['automation/ai-live-navigation-audit.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    log(`Live nav audit exited with code ${r.status}`);
  }
  return r.status === 0;
}

function runLiveNavSyncSuggestions() {
  log('Generating live navigation sync suggestions from live site crawl...');
  const r = spawnSync('node', ['automation/ai-live-nav-sync-suggestions.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    log(`Live nav sync suggestions exited with code ${r.status}`);
  }
  return r.status === 0;
}

async function runSiteLinkAudit(createPages = false) {
  log(createPages ? 'Running site link audit with create-pages...' : 'Running site link audit...');
  const args = ['automation/ai-site-link-audit-automation.cjs', 'run'];
  if (createPages) args.push('--create-pages');
  return new Promise((resolve) => {
    const child = require('child_process').spawn('node', args, {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    });
    child.on('close', (code) => resolve(code === 0));
  });
}

async function runNavImprove() {
  log('Running navigation improvement audit (LLM suggestions)...');
  return new Promise((resolve) => {
    const child = require('child_process').spawn(
      'node',
      ['automation/ai-navigation-improvement-automation.cjs', 'run'],
      { cwd: ROOT, stdio: 'inherit', env: { ...process.env } }
    );
    child.on('close', (code) => resolve(code === 0));
  });
}

async function aggregateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    navAudit: null,
    siteLinkAudit: null,
    liveNavAudit: null,
    liveNavSyncSuggestions: null,
    summary: { navOk: false, siteLinksOk: false, liveNavOk: null, liveNavSuggestions: null },
  };

  try {
    const navPath = path.join(REPORTS_DIR, 'navigation-audit-latest.json');
    if (fs.existsSync(navPath)) {
      report.navAudit = JSON.parse(fs.readFileSync(navPath, 'utf8'));
      report.summary.navOk = !report.navAudit.broken || report.navAudit.broken.length === 0;
    }
  } catch (_) {}

  try {
    const sitePath = path.join(REPORTS_DIR, 'site-link-audit-latest.json');
    if (fs.existsSync(sitePath)) {
      report.siteLinkAudit = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
      const broken = report.siteLinkAudit.broken ?? report.siteLinkAudit.brokenLinks?.length ?? 0;
      report.summary.siteLinksOk = broken === 0;
    }
  } catch (_) {}

  try {
    const liveNavPath = path.join(REPORTS_DIR, 'live-navigation-audit-latest.json');
    if (fs.existsSync(liveNavPath)) {
      report.liveNavAudit = JSON.parse(fs.readFileSync(liveNavPath, 'utf8'));
      const okFlag =
        report.liveNavAudit.summary?.ok ??
        (report.liveNavAudit.navBrokenCount === 0 &&
          (report.liveNavAudit.failedFetches?.length ?? 0) === 0);
      report.summary.liveNavOk = !!okFlag;
    }
  } catch (_) {}

  try {
    const syncPath = path.join(REPORTS_DIR, 'live-nav-sync-suggestions-latest.json');
    if (fs.existsSync(syncPath)) {
      report.liveNavSyncSuggestions = JSON.parse(fs.readFileSync(syncPath, 'utf8'));
      const suggestedCount =
        report.liveNavSyncSuggestions.suggestedAdditions?.length ??
        report.liveNavSyncSuggestions.liveNotInNavCount ??
        0;
      report.summary.liveNavSuggestions = suggestedCount;
    }
  } catch (_) {}

  const outPath = path.join(REPORTS_DIR, 'navigation-pages-audit-latest.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  log(`Aggregated report: ${outPath}`);
  return report;
}

async function run(createPages = false) {
  ensureDirs();
  log('Starting navigation & pages audit...');

  const navOk = runNavAudit();
  runNavFix();
  runIndustryDiscovery(createPages);
  runSolutionsPageSync(true);
  runHomepageSync();
  runHomepageIndustrySync();
  const siteOk = await runSiteLinkAudit(createPages);

  const liveNavOk = runLiveNavAudit();
  runLiveNavSyncSuggestions();

  if (process.env.OPENROUTER_API_KEY) {
    await runNavImprove();
  } else {
    log('Set OPENROUTER_API_KEY for LLM navigation suggestions.');
  }

  const report = await aggregateReport();

  log('--- Summary ---');
  log(`Nav audit: ${navOk && report.summary.navOk ? '✅ OK' : '❌ Issues'}`);
  log(`Site links: ${siteOk && report.summary.siteLinksOk ? '✅ OK' : '❌ Issues'}`);
  if (report.summary.liveNavOk !== null) {
    log(
      `Live navigation: ${
        report.summary.liveNavOk ? '✅ OK (constants match routes)' : '❌ Issues (see live-navigation-audit-latest.json)'
      }`,
    );
  }
  if (report.summary.liveNavSuggestions !== null) {
    log(
      `Live nav sync suggestions: ${
        report.summary.liveNavSuggestions || 0
      } link(s) on live site not in nav constants (see live-nav-sync-suggestions-latest.json)`,
    );
  }

  return report;
}

async function auditOnly() {
  ensureDirs();
  runNavAudit();
  await runSiteLinkAudit(false);
  return aggregateReport();
}

const args = process.argv.slice(2);
const createPages = args.includes('--create-pages');

if (args.includes('audit')) {
  auditOnly().then((r) => console.log(JSON.stringify(r, null, 2)));
} else {
  run(createPages).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
