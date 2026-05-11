#!/usr/bin/env node

/**
 * AI Content Ideas to Deploy Pipeline
 *
 * Audits live site, generates content ideas, expands front page (LLM), runs
 * template burst, then commits and deploys. Maximum content velocity with
 * deploy-on-success.
 *
 * Pipeline order:
 * 1. Content ideation (LLM - fetches live site, suggests blog/industry/case study ideas)
 * 2. Content audit ideas (LLM - gap analysis)
 * 3. Front page content expansion (LLM - 2 industries, 2 case studies, 1 bundle, etc.)
 * 4. Content burst (template-only - blog, case studies, industry pages, services advertiser)
 * 5. Homepage industry sync
 * 6. Commit + push + deploy (when AUTO_COMMIT=1, TRIGGER_DEPLOY=1)
 *
 * Options:
 *   AUTO_COMMIT=1           - Commit and push after generation
 *   TRIGGER_DEPLOY=1        - Call NETLIFY_BUILD_HOOK after commit
 *   SKIP_IDEATION=1         - Skip ideation step
 *   SKIP_FRONT_PAGE=1       - Skip front page expansion (LLM)
 *   SKIP_BURST=1            - Skip content burst (template)
 *   MAX_TEMPLATE_BLOG=6     - Template blog posts per burst
 *   MAX_TEMPLATE_CASE_STUDIES=6 - Template case studies per burst
 *   MAX_INDUSTRY_PAGES=4    - Industry solution pages per burst
 *   MAX_ADD=5               - Apps to promote to front page
 *
 * Run: npm run content:ideas-deploy
 *      AUTO_COMMIT=1 TRIGGER_DEPLOY=1 npm run content:ideas-deploy
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const { execSync } = require('child_process');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const SKIP_IDEATION = process.env.SKIP_IDEATION === '1';
const SKIP_FRONT_PAGE = process.env.SKIP_FRONT_PAGE === '1';
const SKIP_BURST = process.env.SKIP_BURST === '1';
const MAX_TEMPLATE_BLOG = process.env.MAX_TEMPLATE_BLOG || '6';
const MAX_TEMPLATE_CASE_STUDIES = process.env.MAX_TEMPLATE_CASE_STUDIES || '6';
const MAX_INDUSTRY_PAGES = process.env.MAX_INDUSTRY_PAGES || '4';
const MAX_ADD = process.env.MAX_ADD || '5';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ContentIdeasDeploy] ${ts} | ${msg}`);
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
  log('=== AI Content Ideas to Deploy Pipeline ===');
  const start = Date.now();

  // Phase 1: Ideation (LLM - optional, continue on failure)
  if (!SKIP_IDEATION) {
    const r1 = run('node automation/ai-content-ideation-agent.cjs', 'Content Ideation');
    if (!r1.ok) log('Ideation failed; continuing with front page + burst.');
    const r2 = run('node automation/ai-content-audit-ideas-agent.cjs', 'Content Audit Ideas');
    if (!r2.ok) log('Audit ideas failed; continuing.');
  }

  // Phase 2: Front page expansion (LLM)
  if (!SKIP_FRONT_PAGE) {
    const r = run('node automation/ai-front-page-content-expansion-agent.cjs run', 'Front Page Expansion');
    if (!r.ok) log('Front page expansion failed (LLM may be unavailable); continuing.');
  }

  // Phase 3: Content burst (template-only)
  if (!SKIP_BURST) {
    const burstEnv = `MAX_TEMPLATE_BLOG=${MAX_TEMPLATE_BLOG} MAX_TEMPLATE_CASE_STUDIES=${MAX_TEMPLATE_CASE_STUDIES} MAX_INDUSTRY_PAGES=${MAX_INDUSTRY_PAGES} MAX_ADD=${MAX_ADD}`;
    run(`${burstEnv} node automation/ai-content-burst-agent.cjs`, 'Content Burst');
    run('node automation/ai-homepage-industry-sync-agent.cjs run --apply', 'Homepage Industry Sync');
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`Pipeline completed in ${elapsed}s`);

  if (AUTO_COMMIT) {
    log('Committing changes...');
    try {
      const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
      if (status.trim()) {
        execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
        execSync(
          'git commit -m "chore(content): ideas to deploy - ideation + front page + template burst"',
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

  log('=== Content Ideas to Deploy Complete ===');
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
