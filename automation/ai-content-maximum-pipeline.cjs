#!/usr/bin/env node

/**
 * AI Content Maximum Pipeline
 *
 * Ultra-fast content generation for ziontechgroup.com:
 * 1. Ideation + Content Audit Ideas in parallel (feed dynamic topics to blog)
 * 2. Blog (with ideation topics) + Front Page + Case Studies in parallel
 * 3. Higher concurrency, more posts, auto-commit, optional deploy trigger
 *
 * Options:
 *   AUTO_COMMIT=1       - Commit and push after generation
 *   TRIGGER_DEPLOY=1   - Call NETLIFY_BUILD_HOOK after commit (if set)
 *   MAX_BLOG_POSTS=6   - Blog posts per run (default 6)
 *   MAX_CONCURRENCY=6  - Parallel LLM calls for blog
 *   SKIP_IDEATION=1    - Skip ideation (use cached ideas)
 *   SKIP_BLOG=1        - Skip blog generation
 *   SKIP_FRONT_PAGE=1  - Skip front page expansion
 *
 * Run: npm run content:maximum
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
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '6', 10);
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '6', 10);
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_EVOLUTION_IDEAS = process.env.SKIP_EVOLUTION_IDEAS === '1';
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';
const SKIP_ADVANCED_AI = process.env.SKIP_ADVANCED_AI === '1';
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '1', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentMax] ${ts} | ${msg}`);
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
    return;
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
  const tasks = [];
  if (!SKIP_IDEATION) {
    tasks.push(runAsync('automation/ai-content-ideation-agent.cjs', 'Ideation'));
    tasks.push(runAsync('automation/ai-content-audit-ideas-agent.cjs', 'Audit Ideas'));
  }
  if (!SKIP_EVOLUTION_IDEAS) {
    tasks.push(runAsync('automation/ai-app-evolution-ideas-agent.cjs', 'Evolution Ideas'));
  }
  if (tasks.length === 0) {
    log('Skipping ideation (all disabled)');
    return { ok: true, skipped: true };
  }
  log('Running ideation + content audit ideas + evolution ideas in parallel...');
  const results = await Promise.all(tasks);
  return { ok: results.some((r) => r.ok), skipped: false };
}

async function runAdvancedAIOrchestrator() {
  if (SKIP_ADVANCED_AI) {
    log('Skipping advanced-AI orchestrator (SKIP_ADVANCED_AI=1)');
    return { ok: true, skipped: true };
  }
  log('Running advanced-AI content orchestrator (blog + page refresh)...');
  return runAsync('automation/ai-advanced-ai-content-orchestrator.cjs', 'AdvancedAI');
}

async function runBlogGenerator() {
  if (SKIP_BLOG) {
    log('Skipping blog (SKIP_BLOG=1)');
    return { ok: true, skipped: true };
  }
  const ideasPath = path.join(ROOT, 'automation', 'reports', 'content-audit-ideas-latest.json');
  const ideationPath = path.join(ROOT, 'automation', 'reports', 'content-ideation-latest.json');
  const topicsPath = fs.existsSync(ideasPath) ? ideasPath : ideationPath;

  log('Generating blog posts (LLM, dynamic topics when available)...');
  const env = {
    MAX_POSTS: String(MAX_BLOG_POSTS),
    MAX_CONCURRENCY: String(MAX_CONCURRENCY),
  };
  if (fs.existsSync(topicsPath)) {
    env.IDEATION_REPORT_PATH = topicsPath;
  }
  return runAsync('automation/openrouter-content-generator.cjs', 'Blog', env);
}

async function runFrontPageExpansion() {
  if (SKIP_FRONT_PAGE) {
    log('Skipping front page (SKIP_FRONT_PAGE=1)');
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
  return runAsync('automation/ai-front-page-services-advertiser-agent.cjs', 'Services Advertiser');
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

async function main() {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('ERROR: No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  log('=== AI Content Maximum Pipeline ===');
  log(`Max blog: ${MAX_BLOG_POSTS} | Concurrency: ${MAX_CONCURRENCY}`);

  const start = Date.now();

  // Phase 0: Advanced-AI focused content (new posts + page refresh)
  const advancedResult = await runAdvancedAIOrchestrator();

  // Phase 1: Ideation (feeds dynamic topics to generic blog generator)
  await runIdeation();

  // Phase 2: Parallel content generation (blog uses ideation output)
  const [blogResult, frontResult, productResult, servicesResult] = await Promise.all([
    runBlogGenerator(),
    runFrontPageExpansion(),
    runProductPageCreator(),
    runServicesAdvertiser(),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  const advancedOk = advancedResult.ok || advancedResult.skipped;
  const blogOk = blogResult.ok || blogResult.skipped;
  const frontOk = frontResult.ok || frontResult.skipped;
  const productOk = productResult.ok || productResult.skipped;
  const servicesOk = servicesResult.ok || servicesResult.skipped;

  if (!advancedOk) log('Advanced-AI orchestrator had issues');
  if (!blogOk) log('Blog generation had issues');
  if (!frontOk) log('Front page expansion had issues');
  if (!productOk) log('Product page creator had issues');
  if (!servicesOk) log('Services advertiser had issues');

  if (AUTO_COMMIT && (advancedOk || blogOk || frontOk || productOk || servicesOk)) {
    log('Running quality checks before commit (lint + type-check)...');
    try {
      execSync('npm run lint:check', { cwd: ROOT, stdio: 'inherit' });
      execSync('npm run type-check', { cwd: ROOT, stdio: 'inherit' });
    } catch (e) {
      log(`Quality checks failed, skipping commit: ${e.message}`);
      try {
        const failureReportPath = path.join(
          __dirname,
          'reports',
          'advanced-ai-content-failures.json'
        );
        const existing = fs.existsSync(failureReportPath)
          ? JSON.parse(fs.readFileSync(failureReportPath, 'utf8'))
          : { runs: [] };
        existing.runs.push({
          timestamp: new Date().toISOString(),
          context: 'ai-content-maximum-pipeline',
          error: e.message,
        });
        fs.writeFileSync(failureReportPath, JSON.stringify(existing, null, 2));
      } catch (_) {}
      return;
    }

    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): AI maximum pipeline - blog + front page expansion"`,
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

  log('=== Maximum Pipeline Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
