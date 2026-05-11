#!/usr/bin/env node

/**
 * AI Services & Content Automation
 *
 * Orchestrates content creation for ziontechgroup.com:
 * 1. Content ideation (audit + ideas)
 * 2. Front page expansion (industries, case studies, bundles)
 * 3. Blog generation
 * 4. Product page creator (new Zion AI product pages)
 *
 * Uses local LLM (Ollama primary, OpenRouter fallback).
 * Falls back to predefined content when LLM unavailable (e.g. CI without Ollama).
 * Services advertiser and product creator work without LLM (heuristic/template fallback).
 *
 * Options:
 *   AUTO_COMMIT=1     - Commit and push after generation
 *   SKIP_BLOG=1      - Skip blog generation
 *   SKIP_FRONT_PAGE=1 - Skip front page expansion
 *   SKIP_IDEATION=1  - Skip ideation
 *   SKIP_SERVICES_ADVERTISE=1 - Skip services advertiser
 *   SKIP_PRODUCT_PAGES=1 - Skip product page creator
 *   SKIP_TEMPLATE_BLOG=1 - Skip template blog creation
 *   SKIP_TEMPLATE_CASE_STUDIES=1 - Skip template case studies
 *   SKIP_APP_COLLECTIONS=1 - Skip app collections advertiser
 *   SKIP_INDUSTRY_DISCOVERY=1 - Skip industry solution discovery
 *   SKIP_INDUSTRY_AUTO_CREATOR=1 - Skip industry solution auto-creator
 *   SKIP_LIVE_SITE_AUDIT=1 - Skip live-site UX audit (audit runs first when enabled)
 *   MAX_PRODUCT_PAGES=4 - New product pages to create (default 4)
 *   MAX_ADD=8 - Max apps to promote to front page per run (default 8)
 *   MAX_TEMPLATE_BLOG=2 - Template blog posts per run (default 2)
 *   MAX_TEMPLATE_CASE_STUDIES=2 - Template case studies per run (default 2)
 *
 * Run: npm run content:services-and-content
 *      (Ollama: ollama serve, ollama pull llama3.2:3b — or set OPENROUTER_API_KEY)
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
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_TEMPLATE_BLOG = process.env.SKIP_TEMPLATE_BLOG === '1';
const SKIP_TEMPLATE_CASE_STUDIES = process.env.SKIP_TEMPLATE_CASE_STUDIES === '1';
const SKIP_APP_COLLECTIONS = process.env.SKIP_APP_COLLECTIONS === '1';
const SKIP_INDUSTRY_DISCOVERY = process.env.SKIP_INDUSTRY_DISCOVERY === '1';
const SKIP_INDUSTRY_AUTO_CREATOR = process.env.SKIP_INDUSTRY_AUTO_CREATOR === '1';
const SKIP_LIVE_SITE_AUDIT = process.env.SKIP_LIVE_SITE_AUDIT === '1';
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '6', 10);
const MAX_ADD = process.env.MAX_ADD || '12';
const MAX_TEMPLATE_BLOG = parseInt(process.env.MAX_TEMPLATE_BLOG || '4', 10);
const MAX_TEMPLATE_CASE_STUDIES = parseInt(process.env.MAX_TEMPLATE_CASE_STUDIES || '4', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ServicesContent] ${ts} | ${msg}`);
}

function runSync(cmd, label) {
  log(`Running: ${label}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch (e) {
    log(`  Failed: ${e.message}`);
    return false;
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

async function runIdeation() {
  if (SKIP_IDEATION) {
    log('Skipping ideation (SKIP_IDEATION=1)');
    return { ok: true, skipped: true };
  }
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('Skipping ideation (no LLM: start Ollama or set OPENROUTER_API_KEY)');
    return { ok: true, skipped: true };
  }
  log('Running content ideation...');
  return runAsync('automation/ai-content-ideation-agent.cjs', 'Ideation');
}

async function runFrontPageExpansion() {
  if (SKIP_FRONT_PAGE) {
    log('Skipping front page (SKIP_FRONT_PAGE=1)');
    return { ok: true, skipped: true };
  }
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('Skipping front page expansion (no LLM: start Ollama or set OPENROUTER_API_KEY)');
    return { ok: true, skipped: true };
  }
  log('Expanding front page (LLM)...');
  return runAsync('automation/ai-front-page-content-expansion-agent.cjs', 'Front Page');
}

async function runServicesAdvertiser() {
  if (SKIP_SERVICES_ADVERTISE) {
    log('Skipping services advertiser (SKIP_SERVICES_ADVERTISE=1)');
    return { ok: true, skipped: true };
  }
  log('Promoting services to front page...');
  return runAsync('automation/ai-front-page-services-advertiser-agent.cjs', 'Services Advertiser', {
    MAX_ADD,
  });
}

async function runBlogGenerator() {
  if (SKIP_BLOG) {
    log('Skipping blog (SKIP_BLOG=1)');
    return { ok: true, skipped: true };
  }
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('Skipping blog (no LLM: start Ollama or set OPENROUTER_API_KEY)');
    return { ok: true, skipped: true };
  }
  log('Generating blog posts (LLM)...');
  return runAsync('automation/openrouter-content-generator.cjs', 'Blog', {
    MAX_POSTS: '2',
    MAX_CONCURRENCY: '2',
  });
}

async function runProductPageCreator() {
  if (SKIP_PRODUCT_PAGES) {
    log('Skipping product page creator (SKIP_PRODUCT_PAGES=1)');
    return { ok: true, skipped: true };
  }
  log('Creating new Zion AI product page(s)...');
  return runAsync('automation/ai-zion-product-page-creator-agent.cjs', 'Product Creator', {
    MAX_PAGES: String(MAX_PRODUCT_PAGES),
  });
}

async function runTemplateBlog() {
  if (SKIP_TEMPLATE_BLOG) {
    log('Skipping template blog (SKIP_TEMPLATE_BLOG=1)');
    return { ok: true, skipped: true };
  }
  log('Creating template blog posts...');
  return runAsync('automation/ai-template-blog-creator-agent.cjs', 'Template Blog', {
    MAX_POSTS: String(MAX_TEMPLATE_BLOG),
  });
}

async function runTemplateCaseStudies() {
  if (SKIP_TEMPLATE_CASE_STUDIES) {
    log('Skipping template case studies (SKIP_TEMPLATE_CASE_STUDIES=1)');
    return { ok: true, skipped: true };
  }
  log('Creating template case studies...');
  return runAsync('automation/ai-template-case-study-creator-agent.cjs', 'Template Case Studies', {
    MAX_CASE_STUDIES: String(MAX_TEMPLATE_CASE_STUDIES),
  });
}

async function runAppCollectionsAdvertiser() {
  if (SKIP_APP_COLLECTIONS) {
    log('Skipping app collections advertiser (SKIP_APP_COLLECTIONS=1)');
    return { ok: true, skipped: true };
  }
  log('Promoting apps to app collections...');
  return runAsync('automation/ai-app-collections-advertiser-agent.cjs', 'App Collections Advertiser', {
    MAX_ADD: process.env.MAX_APP_COLLECTIONS_ADD || process.env.MAX_ADD || '5',
  });
}

async function runIndustryDiscovery() {
  if (SKIP_INDUSTRY_DISCOVERY) {
    log('Skipping industry discovery (SKIP_INDUSTRY_DISCOVERY=1)');
    return { ok: true, skipped: true };
  }
  log('Running industry solution discovery...');
  return runAsync('automation/ai-industry-solution-discovery-agent.cjs', 'Industry Discovery');
}

async function runIndustryAutoCreator() {
  if (SKIP_INDUSTRY_AUTO_CREATOR) {
    log('Skipping industry auto-creator (SKIP_INDUSTRY_AUTO_CREATOR=1)');
    return { ok: true, skipped: true };
  }
  log('Creating new industry solution pages...');
  return runAsync('automation/ai-industry-solution-auto-creator-agent.cjs', 'Industry Auto Creator', {
    MAX_PAGES: process.env.MAX_INDUSTRY_PAGES || process.env.MAX_PAGES || '2',
  });
}

async function runLiveSiteAudit() {
  if (SKIP_LIVE_SITE_AUDIT) {
    log('Skipping live-site audit (SKIP_LIVE_SITE_AUDIT=1)');
    return { ok: true, skipped: true };
  }
  log('Running live-site UX audit (ziontechgroup.com)...');
  return runAsync('automation/ai-live-site-ux-audit-agent.cjs', 'Live Site UX Audit');
}

async function main() {
  log('=== AI Services & Content Automation ===');

  const start = Date.now();

  // Optional: audit live site first to inform content ideas (no write, report only)
  const liveSiteResult = await runLiveSiteAudit();

  const [ideationResult, frontResult, blogResult, servicesResult, productResult, templateBlogResult, templateCaseResult, appCollectionsResult, industryDiscoveryResult, industryAutoCreatorResult] = await Promise.all([
    runIdeation(),
    runFrontPageExpansion(),
    runBlogGenerator(),
    runServicesAdvertiser(),
    runProductPageCreator(),
    runTemplateBlog(),
    runTemplateCaseStudies(),
    runAppCollectionsAdvertiser(),
    runIndustryDiscovery(),
    runIndustryAutoCreator(),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  // Content cascade: sync homepage industry links when new solution/product pages exist
  runSync('node automation/ai-homepage-industry-sync-agent.cjs run --apply', 'Homepage Industry Sync');
  runSync('node automation/ai-front-page-core-services-sync-agent.cjs run', 'Front Page Core Services Sync');
  runSync('node automation/ai-front-page-advanced-ai-sync-agent.cjs run', 'Front Page Advanced AI Sync');

  const anyOk = ideationResult.ok || frontResult.ok || blogResult.ok || servicesResult.ok || productResult.ok || templateBlogResult.ok || templateCaseResult.ok || appCollectionsResult.ok || industryDiscoveryResult.ok || industryAutoCreatorResult.ok;
  const anySkipped = ideationResult.skipped || frontResult.skipped || blogResult.skipped || servicesResult.skipped || productResult.skipped || templateBlogResult.skipped || templateCaseResult.skipped || appCollectionsResult.skipped || industryDiscoveryResult.skipped || industryAutoCreatorResult.skipped;

  if (!anyOk && !anySkipped) {
    log('All steps failed or were skipped.');
    process.exit(1);
  }

  if (AUTO_COMMIT && (blogResult.ok || frontResult.ok || servicesResult.ok || productResult.ok || templateBlogResult.ok || templateCaseResult.ok || appCollectionsResult.ok || industryAutoCreatorResult.ok)) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): AI services and content automation - industries, case studies, blog"`,
          { cwd: ROOT, stdio: 'inherit' }
        );
        execSync('git push', { cwd: ROOT, stdio: 'inherit' });
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

  log('=== Services & Content Automation Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
