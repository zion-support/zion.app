#!/usr/bin/env node

/**
 * AI Local LLM Specialists Orchestrator
 *
 * Runs multiple local LLM specialist agents in parallel:
 * - SEO Specialist (meta, schema, keywords)
 * - Conversion Specialist (CTAs, trust, forms)
 * - Content Improvement (clarity, engagement, gaps)
 *
 * Aggregates results into unified report and optionally merges quick wins into
 * app evolution backlog for implementation pipeline.
 *
 * Run: npm run automation:local-llm-specialists
 *      npm run automation:local-llm-specialists-commit  (AUTO_COMMIT=1)
 *      npm run automation:local-llm-specialists-deploy  (AUTO_COMMIT=1 TRIGGER_DEPLOY=1)
 *
 * Env:
 *   AUTO_COMMIT=1      - Commit and push after run
 *   TRIGGER_DEPLOY=1   - Call NETLIFY_BUILD_HOOK after push
 *   MERGE_TO_BACKLOG=1 - Merge quick wins into app-evolution-backlog.json
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const https = require('https');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'local-llm-specialists-orchestrator-latest.json');
const EVOLUTION_BACKLOG = path.join(DATA_DIR, 'app-evolution-backlog.json');

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_DEPLOY = process.env.TRIGGER_DEPLOY === '1';
const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG === '1';

const AGENTS = [
  { name: 'SEO Specialist', script: 'ai-local-llm-seo-specialist-agent.cjs', reportKey: 'seo' },
  { name: 'Conversion Specialist', script: 'ai-local-llm-conversion-specialist-agent.cjs', reportKey: 'conversion' },
  { name: 'Content Improvement', script: 'ai-local-llm-content-improvement-agent.cjs', reportKey: 'content' },
  { name: 'Accessibility Specialist', script: 'ai-local-llm-accessibility-specialist-agent.cjs', reportKey: 'accessibility' },
  { name: 'Performance Specialist', script: 'ai-local-llm-performance-specialist-agent.cjs', reportKey: 'performance' },
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LocalLLM-Specialists] ${ts} | ${msg}`);
}

function runAgent(scriptPath) {
  return new Promise((resolve) => {
    const child = spawn('node', [scriptPath, 'run'], {
      cwd: ROOT,
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
    child.on('error', (e) => {
      resolve({ ok: false, error: e.message });
    });
  });
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function hasChanges() {
  try {
    const { execSync } = require('child_process');
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
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  log('=== Local LLM Specialists Orchestrator ===');
  log('Running 5 specialist agents in parallel...');

  const start = Date.now();
  const results = await Promise.all(
    AGENTS.map(async (a) => {
      const r = await runAgent(path.join(AUTOMATION_DIR, a.script));
      return { agent: a.name, ok: r.ok };
    })
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log(`All agents completed in ${elapsed}s`);

  // Aggregate reports
  const seoReport = readJsonSafe(path.join(REPORTS_DIR, 'local-llm-seo-specialist-latest.json'));
  const conversionReport = readJsonSafe(path.join(REPORTS_DIR, 'local-llm-conversion-specialist-latest.json'));
  const contentReport = readJsonSafe(path.join(REPORTS_DIR, 'local-llm-content-improvement-latest.json'));
  const accessibilityReport = readJsonSafe(path.join(REPORTS_DIR, 'local-llm-accessibility-specialist-latest.json'));
  const performanceReport = readJsonSafe(path.join(REPORTS_DIR, 'local-llm-performance-specialist-latest.json'));

  const allQuickWins = [
    ...(seoReport?.suggestions?.quickWins || []),
    ...(conversionReport?.suggestions?.quickWins || []),
    ...(contentReport?.suggestions?.quickWins || []),
    ...(accessibilityReport?.suggestions?.quickWins || []),
    ...(performanceReport?.suggestions?.quickWins || []),
  ].filter(Boolean);

  const report = {
    timestamp: new Date().toISOString(),
    elapsedSeconds: parseFloat(elapsed),
    agents: results,
    summary: {
      totalAgents: results.length,
      successCount: results.filter((r) => r.ok).length,
      failedAgents: results.filter((r) => !r.ok).map((r) => r.agent),
    },
    aggregated: {
      seo: seoReport?.suggestions || null,
      conversion: conversionReport?.suggestions || null,
      content: contentReport?.suggestions || null,
      accessibility: accessibilityReport?.suggestions || null,
      performance: performanceReport?.suggestions || null,
      allQuickWins: [...new Set(allQuickWins)],
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  // Merge quick wins into backlog if requested
  if (MERGE_TO_BACKLOG && report.aggregated.allQuickWins.length > 0) {
    const backlog = readJsonSafe(EVOLUTION_BACKLOG, {});
    const merged = {
      ...backlog,
      updatedAt: new Date().toISOString(),
      quickWins: [...new Set([...(backlog.quickWins || []), ...report.aggregated.allQuickWins])],
    };
    fs.writeFileSync(EVOLUTION_BACKLOG, JSON.stringify(merged, null, 2));
    log(`Merged ${report.aggregated.allQuickWins.length} quick wins into ${EVOLUTION_BACKLOG}`);
  }

  // Commit & Deploy
  if (AUTO_COMMIT && hasChanges()) {
    log('Committing and pushing...');
    try {
      const { execSync } = require('child_process');
      execSync('git config user.name "github-actions[bot]"', { cwd: ROOT });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { cwd: ROOT });
      execSync('git add -A', { cwd: ROOT });
      execSync(
        'git diff --staged --quiet || git commit -m "chore(automation): local LLM specialists - SEO, conversion, content improvements"',
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

  log('=== Local LLM Specialists Orchestrator Complete ===');
  return report;
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
  console.log('Usage: node ai-local-llm-specialists-orchestrator.cjs [run|summary]');
  process.exit(1);
}
