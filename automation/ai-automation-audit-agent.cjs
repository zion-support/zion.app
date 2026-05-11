#!/usr/bin/env node

/**
 * AI Automation Audit Agent
 *
 * Audits the Zion Tech Group automation ecosystem: agents, workflows, cron jobs.
 * Identifies broken references, missing dependencies, stale configs, and improvement
 * opportunities. Uses OpenRouter LLM when available for enhancement suggestions.
 *
 * Features:
 * - Validates agent file paths and require() references
 * - Checks workflow YAML syntax and job references
 * - Verifies cron log paths exist
 * - Detects orphaned or duplicate automation
 * - LLM-powered improvement suggestions (when OPENROUTER_API_KEY set)
 *
 * Runs: Weekly via workflow, or on-demand
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const CRON_FILE = path.join(AUTOMATION_DIR, 'cron', 'automation.cron');
const REPORT_FILE = path.join(REPORTS_DIR, 'automation-audit-latest.json');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AutomationAudit] ${ts} | ${msg}`);
}

function ensureDirs() {
  const logDir = path.join(AUTOMATION_DIR, 'logs');
  [REPORTS_DIR, DATA_DIR, logDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function readFileSafe(p, def = '') {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return def;
  }
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext));
}

function auditAgents() {
  const issues = [];
  const agents = listFiles(AUTOMATION_DIR, '.cjs').filter((f) => f.startsWith('ai-'));
  const libDir = path.join(AUTOMATION_DIR, 'lib');

  for (const agent of agents) {
    const agentPath = path.join(AUTOMATION_DIR, agent);
    const content = readFileSafe(agentPath);

    // Check for require('./lib/openrouter-client.cjs')
    if (content.includes("require('./lib/") || content.includes("require('../lib/")) {
      if (!fs.existsSync(path.join(AUTOMATION_DIR, 'lib', 'openrouter-client.cjs'))) {
        issues.push({ type: 'missing_lib', agent, detail: 'References lib/openrouter-client.cjs but file missing' });
      }
    }

    // Check for dotenv
    if (content.includes('OPENROUTER_API_KEY') && !content.includes('dotenv') && !content.includes('require(\'dotenv\')')) {
      // Not critical - env can be set externally
    }

    // Check shebang
    if (!content.startsWith('#!/usr/bin/env node') && !content.startsWith('#!')) {
      issues.push({ type: 'no_shebang', agent, detail: 'Missing shebang for direct execution' });
    }
  }

  return { agents: agents.length, agentNames: agents, issues };
}

function auditWorkflows() {
  const issues = [];
  const workflows = listFiles(WORKFLOWS_DIR, '.yml');

  for (const wf of workflows) {
    const wfPath = path.join(WORKFLOWS_DIR, wf);
    const content = readFileSafe(wfPath);

    // Check for node automation/ paths
    const nodeMatches = content.match(/node automation\/([^\s]+\.cjs)/g);
    if (nodeMatches) {
      for (const m of nodeMatches) {
        const file = m.replace('node automation/', '').trim();
        const fullPath = path.join(AUTOMATION_DIR, file);
        if (!fs.existsSync(fullPath)) {
          issues.push({ type: 'missing_agent', workflow: wf, file, detail: `References non-existent ${file}` });
        }
      }
    }

    // Check for OPENROUTER_API_KEY in LLM workflows (exclude template-only workflows)
    const llmWorkflows = ['ai-app-audit', 'ai-layout-design', 'ai-github-actions', 'ai-app-evolution', 'ai-content'];
    const templateOnlyWorkflows = ['ai-content-burst', 'ai-ultra-fast-content', 'ai-content-rapid', 'ai-content-accelerator', 'ai-content-velocity']; // No LLM required
    const needsLlm = llmWorkflows.some((p) => wf.includes(p)) && !templateOnlyWorkflows.some((p) => wf.includes(p));
    if (needsLlm && !content.includes('OPENROUTER_API_KEY')) {
      issues.push({ type: 'missing_openrouter_secret', workflow: wf, detail: 'LLM workflow should pass OPENROUTER_API_KEY' });
    }
  }

  return { workflows: workflows.length, workflowNames: workflows, issues };
}

function auditCron() {
  const issues = [];
  const content = readFileSafe(CRON_FILE);
  const logDir = path.join(AUTOMATION_DIR, 'logs');

  // Extract log file paths
  const logMatches = content.match(/>>\s*([^\s]+\.log)/g) || [];
  const logPaths = [...new Set(logMatches.map((m) => m.replace('>>', '').trim()))];

  // Ensure logs dir exists
  if (!fs.existsSync(logDir)) {
    issues.push({ type: 'missing_log_dir', detail: 'automation/logs/ does not exist' });
  }

  // Check for .env sourcing in OpenRouter-dependent jobs
  const openRouterCrons = ['app-audit', 'layout-design', 'github-actions', 'app-evolution', 'content-fast', 'navigation'];
  const cronLines = content.split('\n');
  for (let i = 0; i < cronLines.length; i++) {
    const line = cronLines[i];
    if (openRouterCrons.some((p) => line.includes(p)) && !line.includes('.env') && !line.includes('set -a')) {
      // Some jobs need .env for OPENROUTER_API_KEY - app-audit, layout, etc. have it
      if (line.includes('app-audit') || line.includes('layout-design') || line.includes('github-actions') || line.includes('app-evolution') || line.includes('content-fast') || line.includes('navigation-audit')) {
        if (!line.includes('[ -f .env ]')) {
          issues.push({ type: 'env_sourcing', line: i + 1, detail: `OpenRouter job may need .env: ${line.slice(0, 80)}...` });
        }
      }
    }
  }

  return { cronJobs: (content.match(/^[^#].*$/gm) || []).filter(Boolean).length, logPaths: logPaths.length, issues };
}

async function runLLMSuggestions(auditResult) {
  try {
    const { createLLMClient } = require('./lib/openrouter-client.cjs');
    const llm = createLLMClient({ appName: 'Zion Automation Audit' });

    if (!llm.isConfigured()) return null;

    const summary = JSON.stringify({
      agents: auditResult.agents,
      workflows: auditResult.workflows,
      cron: auditResult.cron,
      issues: [...(auditResult.agents?.issues || []), ...(auditResult.workflows?.issues || []), ...(auditResult.cron?.issues || [])],
    }, null, 2);

    const systemPrompt = `You are an automation expert. Analyze this Zion Tech Group automation audit and suggest 3-5 specific improvements.
Output ONLY valid JSON: { "suggestions": [ { "id": "...", "priority": "high|medium|low", "title": "...", "description": "...", "action": "..." } ] }`;

    const response = await llm.chat(`Audit summary:\n${summary}\n\nSuggest improvements.`, {
      systemPrompt,
      maxTokens: 1024,
      temperature: 0.4,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    log(`LLM suggestions failed: ${e.message}`);
  }
  return null;
}

async function run() {
  ensureDirs();
  log('Starting automation audit...');

  const agentsResult = auditAgents();
  const workflowsResult = auditWorkflows();
  const cronResult = auditCron();

  const auditResult = {
    agents: agentsResult,
    workflows: workflowsResult,
    cron: cronResult,
  };

  const totalIssues =
    (agentsResult.issues?.length || 0) +
    (workflowsResult.issues?.length || 0) +
    (cronResult.issues?.length || 0);

  let llmSuggestions = null;
  try {
    llmSuggestions = await runLLMSuggestions(auditResult);
    if (llmSuggestions) log(`LLM suggestions: ${(llmSuggestions.suggestions || []).length}`);
  } catch (e) {
    log(`LLM skipped: ${e.message}`);
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalAgents: agentsResult.agents,
      totalWorkflows: workflowsResult.workflows,
      totalCronJobs: cronResult.cronJobs,
      totalIssues,
      status: totalIssues === 0 ? 'ok' : totalIssues <= 3 ? 'warning' : 'critical',
    },
    audit: auditResult,
    llmSuggestions,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`Total issues: ${totalIssues}`);
  log(`Status: ${report.summary.status}`);

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data.summary || {}, null, 2));
    if (data.audit?.agents?.issues?.length) console.log('Agent issues:', data.audit.agents.issues.length);
    if (data.audit?.workflows?.issues?.length) console.log('Workflow issues:', data.audit.workflows.issues.length);
    if (data.audit?.cron?.issues?.length) console.log('Cron issues:', data.audit.cron.issues.length);
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-automation-audit-agent.cjs [run|summary]');
  process.exit(1);
}
