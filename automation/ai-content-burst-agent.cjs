#!/usr/bin/env node

/**
 * AI Content Burst Agent
 *
 * Maximum-velocity template-only content generation. No LLM required.
 * Runs template blog, template case studies, and industry discovery + auto-create
 * in parallel for fastest possible content creation.
 *
 * Use when you need content as fast as possible without API calls.
 * Integrates with ultra-fast pipeline or runs standalone.
 *
 * Options:
 *   MAX_TEMPLATE_BLOG=10      - New blog posts per run (default 10)
 *   MAX_TEMPLATE_CASE_STUDIES=10 - New case studies per run (default 10)
 *   MAX_INDUSTRY_PAGES=6     - New industry solution pages (default 6)
 *   MAX_ADD=5                - Max apps to promote to front page (default 5)
 *   SKIP_SERVICES_ADVERTISE=1 - Skip front page services advertiser
 *   AUTO_COMMIT=1            - Commit and push after generation
 *   TRIGGER_DEPLOY=1         - Call NETLIFY_BUILD_HOOK after commit
 *
 * Run: npm run content:burst
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
const MAX_TEMPLATE_BLOG = parseInt(process.env.MAX_TEMPLATE_BLOG || '10', 10);
const MAX_TEMPLATE_CASE_STUDIES = parseInt(process.env.MAX_TEMPLATE_CASE_STUDIES || '10', 10);
const MAX_INDUSTRY_PAGES = parseInt(process.env.MAX_INDUSTRY_PAGES || '6', 10);
const MAX_ADD = process.env.MAX_ADD || '6';
const MAX_PRODUCT_PAGES = parseInt(process.env.MAX_PRODUCT_PAGES || '3', 10);
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';
const SKIP_PRODUCT_PAGES = process.env.SKIP_PRODUCT_PAGES === '1';
const SKIP_APP_COLLECTIONS = process.env.SKIP_APP_COLLECTIONS === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentBurst] ${ts} | ${msg}`);
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
  return new Promise((resolve) => {
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
    child.on('error', (err) => resolve({ ok: false, err }));
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

async function main() {
  log('=== AI Content Burst (Template-Only, No LLM) ===');
  log(`Blog: ${MAX_TEMPLATE_BLOG} | Case Studies: ${MAX_TEMPLATE_CASE_STUDIES} | Industry: ${MAX_INDUSTRY_PAGES} | Product Pages: ${MAX_PRODUCT_PAGES}`);

  const start = Date.now();

  // Industry discovery must run first (auto-creator reads its output)
  runSync('node automation/ai-industry-solution-discovery-agent.cjs run', 'Industry Discovery');

  // Run template blog, case studies, industry auto-create, and services advertiser in parallel
  const burstTasks = [
    runAsync('automation/ai-template-blog-creator-agent.cjs', 'Template Blog', {
      MAX_POSTS: String(MAX_TEMPLATE_BLOG),
    }),
    runAsync('automation/ai-template-case-study-creator-agent.cjs', 'Template Case Studies', {
      MAX_CASE_STUDIES: String(MAX_TEMPLATE_CASE_STUDIES),
    }),
    runAsync('automation/ai-industry-solution-auto-creator-agent.cjs', 'Industry Auto-Creator', {
      MAX_PAGES: String(MAX_INDUSTRY_PAGES),
    }),
  ];
  if (!SKIP_SERVICES_ADVERTISE) {
    burstTasks.push(
      runAsync('automation/ai-front-page-services-advertiser-agent.cjs', 'Front Page Services Advertiser', {
        MAX_ADD: String(MAX_ADD),
      })
    );
  }
  if (!SKIP_APP_COLLECTIONS) {
    burstTasks.push(
      runAsync('automation/ai-app-collections-advertiser-agent.cjs', 'App Collections Advertiser', {
        MAX_ADD: '3',
      })
    );
  }
  if (!SKIP_PRODUCT_PAGES && MAX_PRODUCT_PAGES > 0) {
    burstTasks.push(
      runAsync('automation/ai-zion-product-page-creator-agent.cjs', 'Product Page Creator', {
        MAX_PAGES: String(MAX_PRODUCT_PAGES),
      })
    );
  }

  const results = await Promise.all(burstTasks);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Content burst completed in ${elapsed}s`);

  // Content cascade: sync homepage industry links when new solution pages exist
  runSync('node automation/ai-homepage-industry-sync-agent.cjs run --apply', 'Homepage Industry Sync');

  const anyOk = results.some((r) => r?.ok);
  if (!anyOk) {
    log('Some steps failed; check logs.');
  }

  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        const msg = SKIP_SERVICES_ADVERTISE
          ? 'chore(content): content burst - template blog + case studies + industry pages'
          : 'chore(content): content burst - template blog + case studies + industry pages + front page services';
        execSync(`git commit -m "${msg}"`, { cwd: ROOT, stdio: 'inherit' });
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

  log('=== Content Burst Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
