#!/usr/bin/env node

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

/**
 * AI Content Turbo Pipeline
 *
 * Ultra-fast content generation: ideation → blog + front page + case studies in parallel.
 * Uses local LLM (Ollama primary, OpenRouter fallback).
 *
 * Options:
 *   AUTO_COMMIT=1     - Commit and push after generation
 *   MAX_BLOG_POSTS=4 - Blog posts per run (default 4)
 *   SKIP_IDEATION=1  - Skip ideation step
 *   SKIP_BLOG=1      - Skip blog generation
 *   SKIP_FRONT_PAGE=1 - Skip front page expansion
 *
 * Run: npm run content:turbo
 *      (Ollama: ollama serve, ollama pull llama3.2:3b — or set OPENROUTER_API_KEY)
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '4', 10);
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_SERVICES_ADVERTISE = process.env.SKIP_SERVICES_ADVERTISE === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentTurbo] ${ts} | ${msg}`);
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

async function runIdeation() {
  if (SKIP_IDEATION) {
    log('Skipping ideation (SKIP_IDEATION=1)');
    return { ok: true, skipped: true };
  }
  log('Running content ideation...');
  return runAsync('automation/ai-content-ideation-agent.cjs', 'Ideation');
}

async function runBlogGenerator() {
  if (SKIP_BLOG) {
    log('Skipping blog (SKIP_BLOG=1)');
    return { ok: true, skipped: true };
  }
  log('Generating blog posts (LLM)...');
  const env = {
    MAX_POSTS: String(MAX_BLOG_POSTS),
    MAX_CONCURRENCY: '4',
  };
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

async function main() {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('ERROR: No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  log('=== AI Content Turbo Pipeline ===');
  log(`Max blog: ${MAX_BLOG_POSTS}`);

  const start = Date.now();

  // Phase 1: Ideation (quick, informs future runs)
  const ideationResult = await runIdeation();

  // Phase 2: Parallel content generation
  const [blogResult, frontResult, servicesResult] = await Promise.all([
    runBlogGenerator(),
    runFrontPageExpansion(),
    runServicesAdvertiser(),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  const blogOk = blogResult.ok || blogResult.skipped;
  const frontOk = frontResult.ok || frontResult.skipped;
  const servicesOk = servicesResult.ok || servicesResult.skipped;

  if (!blogOk) log('Blog generation had issues');
  if (!frontOk) log('Front page expansion had issues');
  if (!servicesOk) log('Services advertiser had issues');

  if (AUTO_COMMIT && (blogOk || frontOk || servicesOk)) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): AI turbo pipeline - blog + front page expansion"`,
          { cwd: ROOT, stdio: 'inherit' }
        );
        execSync('git push', { cwd: ROOT, stdio: 'inherit' });
        log('Commit and push complete.');
      } else {
        log('No changes to commit.');
      }
    } catch (e) {
      log(`Commit failed: ${e.message}`);
    }
  }

  log('=== Turbo Pipeline Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
