#!/usr/bin/env node

/**
 * AI Local LLM App Automation Pipeline
 *
 * Orchestrates app improvement and evolution using local LLM (Ollama primary,
 * OpenRouter fallback). Fetches live ziontechgroup.com, generates ideas via LLM,
 * implements improvements, and optionally commits/deploys.
 *
 * Pipeline:
 * 1. Site link audit (validate links, CREATE_PAGES=1 to create missing)
 * 2. Evolution ideas (LLM: new deployable ideas from live site)
 * 3. Content audit ideas (LLM: content opportunities)
 * 4. App audit (LLM: UX, SEO, conversion suggestions)
 * 5. App evolution (uses audit suggestions)
 * 6. App audit implementation (apply safe changes)
 * 7. Optional: commit & push, trigger deploy
 *
 * Environment:
 *   AUTO_COMMIT=1      - Commit and push to main
 *   TRIGGER_DEPLOY=1   - Call NETLIFY_BUILD_HOOK after push
 *   CREATE_PAGES=1     - Create missing pages when site link audit finds broken
 *   SKIP_LLM=1        - Skip LLM steps (use existing reports only)
 *
 * LLM: Ollama (ollama serve, ollama pull llama3.2:3b) primary, or OPENROUTER_API_KEY
 *
 * Run: npm run automation:local-llm
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'local-llm-app-automation-latest.json');

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const CREATE_PAGES = process.env.CREATE_PAGES === '1';
const SKIP_LLM = process.env.SKIP_LLM === '1';
const SKIP_SPECIALISTS = process.env.SKIP_SPECIALISTS === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LocalLLMAutomation] ${ts} | ${msg}`);
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

function hasChanges() {
  try {
    execSync('git diff --quiet 2>/dev/null', { cwd: ROOT });
    return false;
  } catch {
    return true;
  }
}

function triggerDeploy() {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    log('NETLIFY_BUILD_HOOK not set. Skipping deploy trigger.');
    return Promise.resolve({ ok: false, reason: 'no_hook' });
  }
  return new Promise((resolve) => {
    const u = new URL(hook);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method: 'POST' },
      (res) => {
        log(`Deploy trigger: ${res.statusCode}`);
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400 });
      }
    );
    req.on('error', (e) => {
      log(`Deploy trigger failed: ${e.message}`);
      resolve({ ok: false, error: e.message });
    });
    req.end();
  });
}

async function main() {
  const llm = createLLMClient();
  const llmAvailable = llm.isConfigured();
  const info = llmAvailable ? llm.getProviderInfo() : { provider: null, model: null };
  if (llmAvailable) {
    log(`LLM: ${info.provider || 'ollama'} (${info.model || 'llama3.2:3b'})`);
  } else {
    log('No LLM available. LLM steps will use heuristic fallbacks.');
  }

  ensureDirs();
  log('=== Local LLM App Automation Pipeline Started ===');

  const results = [];

  // 1. Site link audit
  const siteLinkCmd = CREATE_PAGES
    ? 'node automation/ai-site-link-audit-automation.cjs run --create-pages'
    : 'node automation/ai-site-link-audit-automation.cjs audit';
  results.push({ step: 'site_link_audit', ok: run(siteLinkCmd, 'Site Link Audit').ok });

  // 1b. Local LLM specialists (SEO, conversion, content, accessibility, performance) - merge quick wins to backlog
  if (!SKIP_SPECIALISTS) {
    results.push({
      step: 'local_llm_specialists',
      ok: run('MERGE_TO_BACKLOG=1 node automation/ai-local-llm-specialists-orchestrator.cjs run', 'Local LLM Specialists').ok,
    });
  }

  // 1c. Automation evolution ideas (LLM generates new automation ideas for app improvement)
  if (!SKIP_LLM) {
    results.push({
      step: 'automation_evolution_ideas',
      ok: run('node automation/ai-local-llm-automation-evolution-agent.cjs run', 'Automation Evolution Ideas').ok,
    });
  }

  // 2. Evolution ideas (LLM or heuristic)
  if (!SKIP_LLM) {
    results.push({ step: 'evolution_ideas', ok: run('node automation/ai-app-evolution-ideas-agent.cjs run', 'Evolution Ideas').ok });
  }

  // 3. Content audit ideas
  if (!SKIP_LLM) {
    results.push({ step: 'content_audit_ideas', ok: run('node automation/ai-content-audit-ideas-agent.cjs', 'Content Audit Ideas').ok });
  }

  // 4. App audit
  if (!SKIP_LLM) {
    results.push({ step: 'app_audit', ok: run('node automation/ai-app-audit-automation-agent.cjs run', 'App Audit').ok });
  }

  // 5. App evolution (uses audit suggestions)
  if (!SKIP_LLM) {
    results.push({ step: 'app_evolution', ok: run('node automation/ai-app-evolution-automation-agent.cjs run', 'App Evolution').ok });
  }

  // 6. App audit implementation
  results.push({ step: 'app_implementation', ok: run('node automation/ai-app-audit-implementation-agent.cjs run', 'App Audit Implementation').ok });

  const report = {
    timestamp: new Date().toISOString(),
    llmProvider: info.provider,
    llmModel: info.model,
    pipeline: results,
    summary: {
      totalSteps: results.length,
      successCount: results.filter((r) => r.ok).length,
      failedSteps: results.filter((r) => !r.ok).map((r) => r.step),
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  if (AUTO_COMMIT && hasChanges()) {
    log('Committing and pushing...');
    try {
      execSync('git config user.name "github-actions[bot]"', { cwd: ROOT });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd: ROOT });
      execSync('git add -A', { cwd: ROOT });
      execSync(
        'git diff --staged --quiet || git commit -m "chore(automation): local LLM app improvement - evolution, audit, implementation"',
        { cwd: ROOT, stdio: 'inherit' }
      );
      execSync('git push origin HEAD:main 2>/dev/null || true', { cwd: ROOT, stdio: 'inherit' });
      report.committed = true;
      log('Changes committed and pushed');

      if (TRIGGER_DEPLOY) {
        const deployResult = await triggerDeploy();
        report.deployTriggered = deployResult.ok;
      }
    } catch (e) {
      log(`Commit/push failed: ${e.message}`);
      report.commitError = e.message;
    }
  }

  log('=== Local LLM App Automation Pipeline Finished ===');
  return report;
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data.summary || data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-local-llm-app-automation-pipeline.cjs [run|summary]');
  process.exit(1);
}
