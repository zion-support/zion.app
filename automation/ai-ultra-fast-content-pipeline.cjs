#!/usr/bin/env node

/**
 * AI Ultra-Fast Content Pipeline
 *
 * Maximum-velocity content generation for ziontechgroup.com.
 * Runs template-based content (industry solutions) first (no LLM), then
 * ideas-to-implementation with higher throughput. Designed for 3x daily runs.
 *
 * Phase 0: Industry discovery + auto-create solution pages (no LLM)
 * Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
 * Phase 2: Blog + Front Page + Product Creator + Services Advertiser (parallel)
 * Phase 3: Commit & Deploy
 *
 * Options:
 *   AUTO_COMMIT=1           - Commit and push after generation
 *   TRIGGER_DEPLOY=1        - Call NETLIFY_BUILD_HOOK after commit
 *   MAX_BLOG_POSTS=8       - Blog posts per run (default 8)
 *   MAX_CONCURRENCY=8      - Parallel LLM calls
 *   MAX_PRODUCT_PAGES=2    - New product pages to create
 *   MAX_INDUSTRY_PAGES=2   - New industry solution pages (template-based)
 *   SKIP_INDUSTRY_PAGES=1  - Skip industry discovery + auto-create
 *   SKIP_IDEATION=1        - Skip ideation
 *   SKIP_BLOG=1            - Skip blog
 *   SKIP_FRONT_PAGE=1      - Skip front page expansion
 *   SKIP_PRODUCT_PAGES=1    - Skip product page creator
 *   SKIP_SERVICES_ADVERTISE=1 - Skip services advertiser
 *
 * Run: npm run content:ultra-fast
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
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '10', 10);
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '10', 10);
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '3', 10);
const MAX_INDUSTRY_PAGES = parseInt(process.env.MAX_INDUSTRY_PAGES || '3', 10);
const MAX_TEMPLATE_BLOG = parseInt(process.env.MAX_TEMPLATE_BLOG || '5', 10);
const MAX_TEMPLATE_CASE_STUDIES = parseInt(process.env.MAX_TEMPLATE_CASE_STUDIES || '5', 10);
const SKIP_INDUSTRY_PAGES = process.env.SKIP_INDUSTRY_PAGES === '1';
const SKIP_TEMPLATE_BLOG = process.env.SKIP_TEMPLATE_BLOG === '1';
const SKIP_TEMPLATE_CASE_STUDIES = process.env.SKIP_TEMPLATE_CASE_STUDIES === '1';
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_EVOLUTION_IDEAS = process.env.SKIP_EVOLUTION_IDEAS === '1';
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[UltraFast] ${ts} | ${msg}`);
}

function runSync(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return { ok: true };
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return { ok: false };
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
  const tasks = [];
  if (!SKIP_INDUSTRY_PAGES) {
    tasks.push(() => {
      log('Phase 0a: Industry discovery + auto-create (no LLM)...');
      runSync('node automation/ai-industry-solution-discovery-agent.cjs run', 'Industry Discovery');
      return runSync(
        `MAX_PAGES=${MAX_INDUSTRY_PAGES} node automation/ai-industry-solution-auto-creator-agent.cjs run`,
        'Industry Auto-Creator'
      );
    });
  }
  if (!SKIP_TEMPLATE_BLOG) {
    tasks.push(() => {
      log('Phase 0b: Template blog creator (no LLM)...');
      return runSync(
        `MAX_POSTS=${MAX_TEMPLATE_BLOG} node automation/ai-template-blog-creator-agent.cjs run`,
        'Template Blog'
      );
    });
  }
  if (!SKIP_TEMPLATE_CASE_STUDIES) {
    tasks.push(() => {
      log('Phase 0c: Template case study creator (no LLM)...');
      return runSync(
        `MAX_CASE_STUDIES=${MAX_TEMPLATE_CASE_STUDIES} node automation/ai-template-case-study-creator-agent.cjs run`,
        'Template Case Studies'
      );
    });
  }
  if (tasks.length === 0) {
    log('Phase 0 skipped (all disabled)');
    return { ok: true, skipped: true };
  }
  for (const t of tasks) {
    t();
  }
  return { ok: true, skipped: false };
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
    return { ok: true, skipped: true };
  }
  log('Phase 1: Ideation + Audit Ideas + Evolution Ideas (parallel)...');
  const results = await Promise.all(tasks);
  return { ok: results.some((r) => r.ok), skipped: false };
}

async function runPhase2() {
  const tasks = [];

  if (!SKIP_BLOG) {
    const ideasPath = path.join(ROOT, 'automation', 'reports', 'content-audit-ideas-latest.json');
    const ideationPath = path.join(ROOT, 'automation', 'reports', 'content-ideation-latest.json');
    const topicsPath = fs.existsSync(ideasPath) ? ideasPath : ideationPath;
    const env = {
      MAX_POSTS: String(MAX_BLOG_POSTS),
      MAX_CONCURRENCY: String(MAX_CONCURRENCY),
    };
    if (fs.existsSync(topicsPath)) env.IDEATION_REPORT_PATH = topicsPath;
    tasks.push(runAsync('automation/openrouter-content-generator.cjs', 'Blog', env));
  }

  if (!SKIP_FRONT_PAGE) {
    tasks.push(runAsync('automation/ai-front-page-content-expansion-agent.cjs', 'Front Page'));
  }

  if (!SKIP_PRODUCT_PAGES) {
    tasks.push(
      runAsync('automation/ai-zion-product-page-creator-agent.cjs', 'Product Creator', {
        MAX_PAGES: String(MAX_PRODUCT_PAGES),
      })
    );
  }

  if (!SKIP_SERVICES_ADVERTISE) {
    tasks.push(
      runAsync('automation/ai-front-page-services-advertiser-agent.cjs', 'Services Advertiser', {
        MAX_ADD: process.env.MAX_ADD || '5',
      })
    );
  }

  if (tasks.length === 0) {
    log('Phase 2 skipped (all disabled)');
    return [];
  }

  log('Phase 2: Blog + Front Page + Product Creator + Services Advertiser (parallel)...');
  return Promise.all(tasks);
}

async function main() {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient();
  const needsLLM = !SKIP_IDEATION || !SKIP_EVOLUTION_IDEAS || !SKIP_BLOG || !SKIP_FRONT_PAGE || !SKIP_PRODUCT_PAGES;
  if (needsLLM && !llm.isConfigured()) {
    log('WARNING: No LLM. Phase 0 (industry pages) will run; Phase 1-2 LLM steps may fail (use fallbacks where available).');
  }
  if (llm.isConfigured()) {
    const info = llm.getProviderInfo();
    log(`LLM: ${info.provider || 'unknown'} (${info.model || 'n/a'})`);
  }

  log('=== AI Ultra-Fast Content Pipeline ===');
  log(`Blog: ${MAX_BLOG_POSTS} | Concurrency: ${MAX_CONCURRENCY} | Products: ${MAX_PRODUCT_PAGES} | Industry: ${MAX_INDUSTRY_PAGES} | Template Blog: ${MAX_TEMPLATE_BLOG} | Template Case Studies: ${MAX_TEMPLATE_CASE_STUDIES}`);

  const start = Date.now();

  await runPhase0();
  await runPhase1();
  const phase2Results = await runPhase2();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): ultra-fast pipeline - industry pages + blog + front page + products"`,
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

  log('=== Ultra-Fast Pipeline Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
