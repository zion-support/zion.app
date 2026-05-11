#!/usr/bin/env node

/**
 * AI Content Fast Pipeline
 *
 * Uses local LLM (Ollama primary, OpenRouter fallback).
 * Runs blog generation and front-page expansion in parallel.
 *
 * Run: npm run content:fast
 *      (Ollama: ollama serve, ollama pull llama3.2:3b — or set OPENROUTER_API_KEY)
 *
 * Options:
 *   AUTO_COMMIT=1 - Commit and push changes after generation
 *   MAX_BLOG_POSTS=2 - Limit blog posts per run (default: 2 for speed)
 *   SKIP_BLOG=1 - Skip blog generation
 *   SKIP_FRONT_PAGE=1 - Skip front page expansion
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const MAX_BLOG_POSTS = parseInt(process.env.MAX_BLOG_POSTS || '2', 10);
const SKIP_BLOG = process.env.SKIP_BLOG === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentFast] ${ts} | ${msg}`);
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
      if (code === 0) {
        resolve({ ok: true, stdout, stderr });
      } else {
        resolve({ ok: false, code, stdout, stderr });
      }
    });
    child.on('error', reject);
  });
}

async function runBlogGenerator() {
  if (SKIP_BLOG) {
    log('Skipping blog generation (SKIP_BLOG=1)');
    return { ok: true, skipped: true };
  }
  log('Starting blog generation (LLM)...');
  const env = {};
  if (MAX_BLOG_POSTS > 0) env.MAX_POSTS = String(MAX_BLOG_POSTS);
  const result = await runAsync('automation/openrouter-content-generator.cjs', 'Blog Generator', env);
  return result;
}

async function runFrontPageExpansion() {
  if (SKIP_FRONT_PAGE) {
    log('Skipping front page expansion (SKIP_FRONT_PAGE=1)');
    return { ok: true, skipped: true };
  }
  log('Starting front page expansion (LLM)...');
  const result = await runAsync(
    'automation/ai-front-page-content-expansion-agent.cjs',
    'Front Page Expansion'
  );
  return result;
}

async function main() {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  if (!createLLMClient().isConfigured()) {
    log('ERROR: No LLM available. Start Ollama (ollama serve, ollama pull llama3.2:3b) or set OPENROUTER_API_KEY.');
    process.exit(1);
  }

  log('=== AI Content Fast Pipeline ===');
  log(`Max blog posts: ${MAX_BLOG_POSTS}`);

  const start = Date.now();

  const [blogResult, frontResult] = await Promise.all([
    runBlogGenerator(),
    runFrontPageExpansion(),
  ]);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  const blogOk = blogResult.ok || blogResult.skipped;
  const frontOk = frontResult.ok || frontResult.skipped;

  if (!blogOk) log('Blog generation had issues');
  if (!frontOk) log('Front page expansion had issues');

  if (AUTO_COMMIT && (blogOk || frontOk)) {
    log('Checking for changes to commit...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          `git commit -m "chore(content): AI-generated content via OpenRouter pipeline"`,
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

  log('=== Pipeline Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
