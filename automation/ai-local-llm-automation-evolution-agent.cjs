#!/usr/bin/env node

/**
 * AI Local LLM Automation Evolution Agent
 *
 * Uses local LLM (Ollama primary, OpenRouter fallback) to generate new automation ideas
 * for app improvement and evolution. Scans existing agents, workflows, backlog, and
 * live site to propose deployable automation enhancements.
 *
 * Outputs to app-evolution-backlog.json and automation-evolution-ideas.json.
 *
 * Run: npm run automation:local-llm-evolution-ideas
 * Env: OLLAMA_ENABLED, OLLAMA_URL, OLLAMA_MODEL, OPENROUTER_API_KEY
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'local-llm-automation-evolution-latest.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');
const SITE_URL = 'https://ziontechgroup.com';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LocalLLM-AutoEvo] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
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

function listAgents() {
  if (!fs.existsSync(AUTOMATION_DIR)) return [];
  return fs.readdirSync(AUTOMATION_DIR).filter((f) => f.startsWith('ai-') && f.endsWith('.cjs'));
}

function listWorkflows() {
  const wfDir = path.join(ROOT, '.github', 'workflows');
  if (!fs.existsSync(wfDir)) return [];
  return fs.readdirSync(wfDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-AutomationEvolution/1.0' },
      timeout: 15000,
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

const FALLBACK = {
  newAutomationIdeas: [
    { id: 'fallback-1', title: 'Add accessibility audit automation', description: 'Weekly a11y check with axe-core', priority: 'medium' },
    { id: 'fallback-2', title: 'Add performance regression automation', description: 'Lighthouse score tracking', priority: 'medium' },
  ],
  pipelineImprovements: ['Add local LLM specialists to daily pipeline', 'Add auto-commit for safe quick wins'],
  quickWins: ['Run local LLM specialists weekly', 'Merge evolution backlog into implementation pipeline'],
};

async function run() {
  ensureDirs();
  log('Starting automation evolution ideas...');

  const agents = listAgents();
  const workflows = listWorkflows();
  const backlog = readJsonSafe(BACKLOG_FILE, {});
  let siteSample = '';
  try {
    const { body } = await fetchPage(SITE_URL + '/');
    siteSample = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1500);
  } catch (e) {
    log(`Failed to fetch site: ${e.message}`);
  }

  const context = {
    agentCount: agents.length,
    agentNames: agents.slice(0, 30),
    workflowCount: workflows.length,
    workflowNames: workflows.slice(0, 20),
    backlogIdeas: (backlog.ideas || []).length,
    backlogQuickWins: (backlog.quickWins || []).length,
    newIdeas: (backlog.newIdeas || []).slice(0, 10),
    siteSample: siteSample.slice(0, 2000),
  };

  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient({ appName: 'Zion Automation Evolution' });

  let result = FALLBACK;
  if (llm.isConfigured()) {
    log(`LLM: ${llm.getProviderInfo().provider || 'ollama'}`);
    const prompt = `You are an automation architect for Zion Tech Group (ziontechgroup.com), a Next.js static site with extensive AI automation.

Current state:
- ${context.agentCount} automation agents (ai-*.cjs)
- ${context.workflowCount} GitHub workflows
- Backlog: ${context.backlogIdeas} ideas, ${context.backlogQuickWins} quick wins
- Existing new ideas: ${JSON.stringify(context.newIdeas)}

Site sample: ${context.siteSample}

Generate NEW automation ideas to improve and evolve the app. Focus on:
1. New agents or pipelines that use local LLM (Ollama/OpenRouter)
2. Automation that automates app improvement (content, UX, SEO, conversion)
3. Ideas that can be implemented without external APIs
4. Consolidation or optimization of existing automations

Return ONLY valid JSON (no markdown):

{
  "newAutomationIdeas": [
    {
      "id": "unique-id",
      "title": "Short title",
      "description": "What it does",
      "implementation": "Brief how-to",
      "priority": "high|medium|low"
    }
  ],
  "pipelineImprovements": ["Suggestions to improve existing pipelines"],
  "quickWins": ["3-5 actionable automation improvements"]
}

Be specific and deployable. Prefer free local LLM over paid APIs.`;

    try {
      const response = await llm.chat(prompt, { maxTokens: 2048, temperature: 0.6 });
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      log(`LLM failed: ${e.message}`);
    }
  } else {
    log('No LLM available. Using fallback ideas.');
  }

  const report = {
    timestamp: new Date().toISOString(),
    context: { agentCount: context.agentCount, workflowCount: context.workflowCount },
    llmProvider: llm.isConfigured() ? llm.getProviderInfo().provider : null,
    ideas: result,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  // Merge new ideas into backlog
  const newIdeas = result.newAutomationIdeas || [];
  if (newIdeas.length > 0) {
    const merged = {
      ...backlog,
      updatedAt: new Date().toISOString(),
      newIdeas: [...new Set([...(backlog.newIdeas || []), ...newIdeas.map((i) => i.title || i.description)])],
    };
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(merged, null, 2));
    log(`Merged ${newIdeas.length} ideas into ${BACKLOG_FILE}`);
  }

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
    console.log(JSON.stringify(data.ideas || data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-local-llm-automation-evolution-agent.cjs [run|summary]');
  process.exit(1);
}
