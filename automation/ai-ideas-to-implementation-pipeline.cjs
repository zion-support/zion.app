#!/usr/bin/env node

/**
 * AI Ideas to Implementation Pipeline
 *
 * Maximum-velocity pipeline for ziontechgroup.com: ideation → content → deploy.
 * Runs ideation, evolution ideas, content audit ideas in parallel, then blog,
 * front page, product page creator, and services advertiser in parallel.
 * Auto-commits and triggers deploy for fastest content velocity.
 *
 * Options:
 *   AUTO_COMMIT=1           - Commit and push after generation
 *   TRIGGER_DEPLOY=1        - Call NETLIFY_BUILD_HOOK after commit (if set)
 *   MAX_BLOG_POSTS=6        - Blog posts per run (default 6)
 *   MAX_CONCURRENCY=6       - Parallel LLM calls for blog
 *   MAX_PRODUCT_PAGES=1     - New Zion AI product pages to create (default 1)
 *   SKIP_IDEATION=1         - Skip ideation (use cached ideas)
 *   SKIP_EVOLUTION_IDEAS=1   - Skip evolution ideas
 *   SKIP_BLOG=1             - Skip blog generation
 *   SKIP_FRONT_PAGE=1       - Skip front page expansion
 *   SKIP_PRODUCT_PAGES=1    - Skip product page creator
 *   SKIP_SERVICES_ADVERTISE=1 - Skip services advertiser
 *   ENFORCE_QUALITY_GATES=1 - Run lint/type-check and dedup guard before push
 *
 * Run: npm run content:ideas-implementation
 *   Local: Ollama (ollama serve, ollama pull llama3.2:3b) — primary
 *   Fallback: OPENROUTER_API_KEY in .env or env
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { createLLMClient } = require('./lib/openrouter-client.cjs');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const EXECUTION_PLAN_REPORT = path.join(REPORTS_DIR, 'ideas-implementation-selection-latest.json');
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '6', 10);
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '6', 10);
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '1', 10);
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_EVOLUTION_IDEAS = process.env.SKIP_EVOLUTION_IDEAS === '1';
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';
const ENFORCE_QUALITY_GATES = process.env.ENFORCE_QUALITY_GATES !== '0';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[IdeasImpl] ${ts} | ${msg}`);
}

function writeJsonReport(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function buildExecutionPlan() {
  const candidates = [
    {
      id: 'blog-generation',
      enabled: !SKIP_BLOG,
      impact: 82,
      risk: 38,
      owner: 'openrouter-content-generator',
      reason: SKIP_BLOG ? 'disabled by SKIP_BLOG=1' : 'high acquisition + SEO potential',
    },
    {
      id: 'front-page-expansion',
      enabled: !SKIP_FRONT_PAGE,
      impact: 79,
      risk: 36,
      owner: 'ai-front-page-content-expansion-agent',
      reason: SKIP_FRONT_PAGE ? 'disabled by SKIP_FRONT_PAGE=1' : 'high visibility on homepage conversion paths',
    },
    {
      id: 'product-page-creator',
      enabled: !SKIP_PRODUCT_PAGES,
      impact: 74,
      risk: 44,
      owner: 'ai-zion-product-page-creator-agent',
      reason: SKIP_PRODUCT_PAGES ? 'disabled by SKIP_PRODUCT_PAGES=1' : 'expands catalog discoverability',
    },
    {
      id: 'services-advertiser',
      enabled: !SKIP_SERVICES_ADVERTISE,
      impact: 72,
      risk: 32,
      owner: 'ai-front-page-services-advertiser-agent',
      reason: SKIP_SERVICES_ADVERTISE
        ? 'disabled by SKIP_SERVICES_ADVERTISE=1'
        : 'promotes under-exposed offerings with low implementation risk',
    },
  ];

  const scored = candidates.map((candidate) => ({
    ...candidate,
    score: Math.round(candidate.impact * 0.7 + (100 - candidate.risk) * 0.3),
  }));

  const selected = scored.filter((candidate) => candidate.enabled).sort((a, b) => b.score - a.score);
  const skipped = scored.filter((candidate) => !candidate.enabled).sort((a, b) => b.score - a.score);

  const report = {
    generatedAt: new Date().toISOString(),
    policy: {
      scoreFormula: 'impact*0.7 + (100-risk)*0.3',
      maxBlogPosts: MAX_BLOG_POSTS,
      maxProductPages: MAX_PRODUCT_PAGES,
      enforceQualityGates: ENFORCE_QUALITY_GATES,
    },
    selected,
    skipped,
  };
  writeJsonReport(EXECUTION_PLAN_REPORT, report);
  log(`Selection report written: ${path.relative(ROOT, EXECUTION_PLAN_REPORT)}`);
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

  log('Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)...');
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
  return Promise.all(tasks);
}

async function main() {
  const llm = createLLMClient();
  if (!llm.isConfigured()) {
    log('ERROR: No LLM available. Start Ollama (npm run llm:install) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }
  const info = llm.getProviderInfo();
  log(`LLM: ${info.provider || 'unknown'} (${info.model || 'n/a'})`);

  log('=== AI Ideas to Implementation Pipeline ===');
  log(`Max blog: ${MAX_BLOG_POSTS} | Concurrency: ${MAX_CONCURRENCY} | Product pages: ${MAX_PRODUCT_PAGES}`);
  buildExecutionPlan();

  const start = Date.now();

  // Phase 1: Ideation + Content Audit Ideas + Evolution Ideas (parallel)
  await runPhase1();

  // Phase 2: Content generation (parallel)
  const phase2Results = await runPhase2();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  // Content cascade: sync homepage industry links when new solution pages exist
  try {
    execSync('node automation/ai-homepage-industry-sync-agent.cjs run --apply', { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    log(`Cascade skipped: ${e.message}`);
  }

  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        if (ENFORCE_QUALITY_GATES) {
          log('Running quality gates before direct-to-main push...');
          execSync('node automation/validate-autonomous-content-dedup.cjs', { cwd: ROOT, stdio: 'inherit' });
          execSync('npm run lint:check', { cwd: ROOT, stdio: 'inherit' });
          execSync('npm run type-check', { cwd: ROOT, stdio: 'inherit' });
        } else {
          log('Quality gates disabled via ENFORCE_QUALITY_GATES=0');
        }

        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): AI ideas to implementation - blog + front page + product pages"`,
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

  log('=== Ideas to Implementation Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
