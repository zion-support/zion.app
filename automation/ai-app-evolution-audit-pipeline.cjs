#!/usr/bin/env node

/**
 * AI App Evolution Audit Pipeline
 *
 * Unified pipeline for ziontechgroup.com: visit → audit → implement → deploy.
 * Orchestrates automation health, site link validation, ideation, evolution ideas,
 * content generation, and optional commit/deploy. Automates app improvement and evolution.
 *
 * Pipeline:
 *   Phase 0: Automation audit + Site link audit (ensure automations and links healthy)
 *   Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
 *   Phase 1.5: Evolution automation (AUTO_APPLY=1) - implement safe backlog items
 *   Phase 2: Blog + Front Page + Product Creator + Services Advertiser (parallel)
 *   Phase 3: Commit & Deploy (when AUTO_COMMIT=1)
 *
 * Options:
 *   AUTO_COMMIT=1           - Commit and push after generation
 *   TRIGGER_DEPLOY=1        - Call NETLIFY_BUILD_HOOK after commit (if set)
 *   SKIP_UX_AUDIT=1         - Skip Phase 0 live site UX audit
 *   SKIP_AUTOMATION_AUDIT=1 - Skip Phase 0 automation audit
 *   SKIP_SITE_LINKS=1       - Skip Phase 0 site link audit
 *   SKIP_IDEATION=1         - Skip ideation
 *   SKIP_EVOLUTION_IDEAS=1  - Skip evolution ideas
 *   SKIP_BLOG=1             - Skip blog generation
 *   SKIP_FRONT_PAGE=1       - Skip front page expansion
 *   SKIP_PRODUCT_PAGES=1    - Skip product page creator
 *   SKIP_SERVICES_ADVERTISE=1 - Skip services advertiser
 *   SKIP_EVOLUTION_APPLY=1    - Skip evolution backlog apply (AUTO_APPLY=1)
 *   MAX_BLOG_POSTS=6        - Blog posts per run
 *   MAX_PRODUCT_PAGES=1     - New product pages to create
 *
 * Run: OPENROUTER_API_KEY=sk-or-v1-... npm run app:evolution-audit
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const SKIP_UX_AUDIT = process.env.SKIP_UX_AUDIT === '1';
const SKIP_UX_AUTO_FIX = process.env.SKIP_UX_AUTO_FIX === '1';
const SKIP_LAYOUT_DESIGN = process.env.SKIP_LAYOUT_DESIGN === '1';
const SKIP_AUTOMATION_AUDIT = process.env.SKIP_AUTOMATION_AUDIT === '1';
const SKIP_SITE_LINKS = process.env.SKIP_SITE_LINKS === '1';
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_EVOLUTION_IDEAS = process.env.SKIP_EVOLUTION_IDEAS === '1';
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';
const SKIP_EVOLUTION_APPLY = process.env.SKIP_EVOLUTION_APPLY === '1';
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '6', 10);
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '1', 10);
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '6', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[EvolutionAudit] ${ts} | ${msg}`);
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

function runAsync(scriptPath, label, env = {}) {
  return new Promise((resolve, reject) => {
    const fullEnv = { ...process.env, ...env };
    const child = spawn('node', [scriptPath], {
      cwd: ROOT,
      env: fullEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => {
      stdout += d.toString();
      process.stdout.write(d);
    });
    child.stderr?.on('data', (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });

    child.on('close', (code) => {
      resolve({ ok: code === 0, code, stdout, stderr });
    });
    child.on('error', reject);
  });
}

function triggerNetlifyDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set, skipping deploy trigger');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    https
      .get(hook, (res) => {
        log(`Deploy triggered: ${res.statusCode}`);
        resolve();
      })
      .on('error', (err) => {
        log(`Deploy trigger failed: ${err.message}`);
        resolve();
      });
  });
}

async function runPhase0() {
  const results = [];

  if (!SKIP_UX_AUDIT) {
    const r = run('node automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit');
    results.push({ step: 'live_site_ux', ok: r.ok });
    if (r.ok) {
      run('node automation/merge-live-app-ideas-to-backlog.cjs', 'Merge live UX ideas to backlog');
      run('node automation/ai-automation-ideas-from-live-audit.cjs', 'Automation ideas from live audit');
    }
    const si = run('node automation/ai-system-intelligence-audit-agent.cjs', 'System Intelligence Audit');
    results.push({ step: 'system_intelligence', ok: si.ok });
    if (r.ok && !SKIP_UX_AUTO_FIX) {
      const fix = run('node automation/ai-live-site-ux-auto-fix-agent.cjs', 'Live Site UX Auto-Fix');
      results.push({ step: 'live_site_ux_fix', ok: fix.ok });
    }
  }

  if (!SKIP_LAYOUT_DESIGN) {
    const r = run('npm run layout:audit', 'Layout Design Audit');
    results.push({ step: 'layout_audit', ok: r.ok });
    const r2 = run('node automation/ai-layout-design-implementation-agent.cjs run', 'Layout Design Implementation');
    results.push({ step: 'layout_apply', ok: r2.ok });
  }

  if (!SKIP_AUTOMATION_AUDIT) {
    const r = run('node automation/ai-automation-audit-agent.cjs run', 'Automation Audit');
    results.push({ step: 'automation_audit', ok: r.ok });
  }

  if (!SKIP_SITE_LINKS) {
    const r = run('node automation/ai-site-link-audit-automation.cjs audit', 'Site Link Audit');
    results.push({ step: 'site_link_audit', ok: r.ok });
  }

  if (results.length === 0) {
    log('Phase 0 skipped (all disabled)');
    return { ok: true };
  }

  const failed = results.filter((r) => !r.ok);
  return { ok: failed.length === 0 };
}

async function runPhase1() {
  const tasks = [];
  if (!SKIP_IDEATION) {
    tasks.push(runAsync('automation/ai-content-ideation-agent.cjs', 'Ideation'));
    tasks.push(runAsync('automation/ai-content-audit-ideas-agent.cjs', 'Audit Ideas'));
  }
  if (!SKIP_EVOLUTION_IDEAS) {
    tasks.push(runAsync('automation/ai-app-evolution-ideas-agent.cjs', 'Evolution Ideas'));
  }

  if (tasks.length === 0) {
    log('Phase 1 skipped (all disabled)');
    return { ok: true };
  }

  log('Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)...');
  const results = await Promise.all(tasks);
  return { ok: results.some((r) => r.ok) };
}

async function runPhase1_5() {
  if (SKIP_EVOLUTION_APPLY) {
    log('Phase 1.5 skipped (SKIP_EVOLUTION_APPLY=1)');
    return { ok: true };
  }
  log('Phase 1.5: Evolution automation (AUTO_APPLY=1) - implement safe backlog items...');
  const r = await runAsync('automation/ai-app-evolution-automation-agent.cjs', 'Evolution Apply', {
    AUTO_APPLY: '1',
  });
  return { ok: r.ok };
}

async function runPhase2() {
  const tasks = [];

  if (!SKIP_BLOG) {
    const ideasPath = path.join(ROOT, 'automation', 'reports', 'content-audit-ideas-latest.json');
    const ideationPath = path.join(ROOT, 'automation', 'reports', 'content-ideation-latest.json');
    const topicsPath = fs.existsSync(ideasPath) ? ideasPath : ideationPath;
    const env = {
      OPENROUTER_MODEL: 'openrouter/free',
      MAX_POSTS: String(MAX_BLOG_POSTS),
      MAX_CONCURRENCY: String(MAX_CONCURRENCY),
    };
    if (fs.existsSync(topicsPath)) env.IDEATION_REPORT_PATH = topicsPath;
    tasks.push(runAsync('automation/openrouter-content-generator.cjs', 'Blog', env));
  }

  if (!SKIP_FRONT_PAGE) {
    tasks.push(
      runAsync('automation/ai-front-page-content-expansion-agent.cjs', 'Front Page', {
        OPENROUTER_MODEL: 'openrouter/free',
      })
    );
  }

  if (!SKIP_PRODUCT_PAGES) {
    tasks.push(
      runAsync('automation/ai-zion-product-page-creator-agent.cjs', 'Product Creator', {
        MAX_PAGES: String(MAX_PRODUCT_PAGES),
      })
    );
  }

  if (!SKIP_SERVICES_ADVERTISE) {
    tasks.push(runAsync('automation/ai-front-page-services-advertiser-agent.cjs', 'Services Advertiser'));
  }

  if (tasks.length === 0) {
    log('Phase 2 skipped (all disabled)');
    return [];
  }

  log('Phase 2: Blog + Front Page + Product Creator + Services Advertiser (parallel)...');
  const phase2Results = await Promise.all(tasks);
  return phase2Results;
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    log('WARN: OPENROUTER_API_KEY not set. Phase 1/2 may use fallback heuristics.');
  }

  log('=== AI App Evolution Audit Pipeline ===');
  log(`Phases: 0=audit 1=ideas 2=content 3=commit/deploy`);

  const start = Date.now();

  // Phase 0: Automation + Site link audit
  const phase0 = await runPhase0();
  if (!phase0.ok) {
    log('Phase 0 had failures; continuing with content pipeline.');
  }

  // Phase 1: Ideation + Evolution Ideas
  await runPhase1();

  // Phase 1.5: Apply safe evolution backlog items (AUTO_APPLY=1)
  await runPhase1_5();

  // Phase 2: Content generation
  await runPhase2();

  run('node automation/ai-front-page-core-services-sync-agent.cjs run', 'Front Page Core Services Sync');

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  // Write report before commit so it can be included
  const reportPath = path.join(ROOT, 'automation', 'reports', 'app-evolution-audit-pipeline-latest.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        elapsedSeconds: parseFloat(elapsed),
        phase0: phase0.ok,
        autoCommit: AUTO_COMMIT,
        triggerDeploy: TRIGGER_DEPLOY,
      },
      null,
      2
    )
  );
  log(`Report: ${reportPath}`);

  // Phase 3: Commit & Deploy
  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(app): evolution audit - automation + site links + content improvements"`,
          { cwd: ROOT, stdio: 'inherit' }
        );
        execSync('git push origin HEAD:main', { cwd: ROOT, stdio: 'inherit' });
        log('Commit and push complete.');

        if (TRIGGER_DEPLOY) {
          await triggerNetlifyDeploy();
        }
      } else {
        log('No changes to commit.');
      }
    } catch (e) {
      log(`Commit failed: ${e.message}`);
    }
  }

  log('=== App Evolution Audit Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
