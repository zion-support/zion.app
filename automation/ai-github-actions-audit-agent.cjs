#!/usr/bin/env node

/**
 * AI GitHub Actions Audit Agent
 *
 * Audits all GitHub Actions workflows and the live ziontechgroup.com app
 * using OpenRouter LLM (meta-llama/llama-3.2-3b-instruct:free) to generate actionable
 * improvement suggestions and new automation ideas.
 *
 * Outputs:
 * - Workflow improvements (consistency, permissions, triggers)
 * - New workflow suggestions
 * - App improvement automations to implement
 *
 * Requires: OPENROUTER_API_KEY
 * Run: OPENROUTER_API_KEY=sk-or-v1-... npm run actions:audit
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORT_FILE = path.join(REPORTS_DIR, 'github-actions-audit-latest.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'github-actions-audit-suggestions.json');

const SITE_URL = 'https://ziontechgroup.com';
const PAGES_TO_FETCH = [
  { path: '/', name: 'Homepage' },
  { path: '/services', name: 'Services' },
  { path: '/solutions', name: 'Solutions' },
  { path: '/contact', name: 'Contact' },
  { path: '/about', name: 'About' },
  { path: '/blog', name: 'Blog' },
  { path: '/industries', name: 'Industries' },
  { path: '/consultation', name: 'Consultation' },
  { path: '/automation', name: 'Automation' },
  { path: '/micro-saas-services', name: 'Micro SAAS Services' },
  { path: '/ai-services', name: 'AI Services' },
  { path: '/products', name: 'Products' },
  { path: '/case-studies', name: 'Case Studies' },
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[GitHubActionsAudit] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function readWorkflows() {
  const workflows = [];
  if (!fs.existsSync(WORKFLOWS_DIR)) return workflows;
  const files = fs.readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  for (const f of files) {
    const filepath = path.join(WORKFLOWS_DIR, f);
    const content = fs.readFileSync(filepath, 'utf8');
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const onMatch = content.match(/^on:\s*([\s\S]*?)(?=\n\w|\njobs|$)/m);
    const cronMatch = content.match(/cron:\s*['"]?([^'"\n]+)['"]?/g);
    workflows.push({
      file: f,
      name: nameMatch ? nameMatch[1].trim() : f,
      triggers: onMatch ? onMatch[1].trim().slice(0, 500) : '',
      crons: cronMatch || [],
      lineCount: content.split('\n').length,
    });
  }
  return workflows;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-AuditBot/1.0' },
      timeout: 15000,
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);
}

async function fetchSitePages() {
  const results = [];
  for (const p of PAGES_TO_FETCH) {
    const url = SITE_URL + p.path;
    try {
      log(`Fetching ${p.name}: ${url}`);
      const { statusCode, body } = await fetchPage(url);
      results.push({
        name: p.name,
        path: p.path,
        statusCode,
        textSample: stripHtml(body).slice(0, 2000),
      });
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      log(`Failed ${url}: ${e.message}`);
      results.push({ name: p.name, path: p.path, error: e.message });
    }
  }
  return results;
}

async function runLLMAudit(workflows, sitePages) {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient({ appName: 'Zion GitHub Actions Audit' });

  if (!llm.isConfigured()) {
    return null;
  }

  const workflowsSummary = JSON.stringify(workflows, null, 2).slice(0, 6000);
  const siteSummary = sitePages
    .filter((p) => p.textSample)
    .map((p) => `## ${p.name} (${p.path})\n${p.textSample}`)
    .join('\n\n---\n\n')
    .slice(0, 5000);

  const systemPrompt = `You are an expert DevOps and CI/CD consultant auditing GitHub Actions and a Next.js static site (ziontechgroup.com).
Zion Tech Group is an AI solutions company. The repo has many AI automation workflows.

Your task: Analyze the workflows and site content, then output a JSON object with improvement suggestions.

Output ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "summary": "2-3 sentence overall assessment of workflows and app",
  "workflowImprovements": [
    {
      "id": "unique-id",
      "workflow": "filename.yml",
      "priority": "high|medium|low",
      "title": "Short title",
      "description": "Specific actionable change",
      "impact": "Expected benefit"
    }
  ],
  "newWorkflowSuggestions": [
    {
      "id": "new-workflow-id",
      "name": "Workflow display name",
      "trigger": "schedule or event",
      "purpose": "What it does",
      "priority": "high|medium|low",
      "yamlSnippet": "Optional: minimal YAML structure if applicable"
    }
  ],
  "appAutomationIdeas": [
    {
      "id": "app-auto-id",
      "title": "Automation idea",
      "description": "What to automate for the app",
      "implementation": "Brief how-to",
      "priority": "high|medium|low"
    }
  ],
  "quickWins": ["3-5 quick wins for workflows or app"],
  "consolidationOpportunities": ["Ways to consolidate or deduplicate workflows"]
}

Be specific and actionable. Focus on real improvements.`;

  const userPrompt = `## Current GitHub Workflows (${workflows.length} files)

${workflowsSummary}

## Live Site Content Sample

${siteSummary}

---

Audit the workflows and app. Suggest workflow improvements, new workflows to add, and app automation ideas.`;

  const response = await llm.chat(userPrompt, {
    systemPrompt,
    maxTokens: 4096,
    temperature: 0.5,
  });

  let parsed;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = {
        summary: response.slice(0, 500),
        workflowImprovements: [],
        newWorkflowSuggestions: [],
        appAutomationIdeas: [],
        quickWins: [],
        consolidationOpportunities: [],
      };
    }
  } catch (e) {
    log(`LLM parse error: ${e.message}`);
    parsed = {
      summary: 'Parse failed',
      workflowImprovements: [],
      newWorkflowSuggestions: [],
      appAutomationIdeas: [],
      quickWins: [],
      consolidationOpportunities: [],
      rawResponse: response.slice(0, 1500),
    };
  }

  return parsed;
}

async function run() {
  ensureDirs();
  log('Starting GitHub Actions + App audit...');

  const workflows = readWorkflows();
  log(`Found ${workflows.length} workflows`);

  const sitePages = await fetchSitePages();
  log(`Fetched ${sitePages.filter((p) => p.textSample).length} site pages`);

  let auditResult = {
    summary: 'No LLM analysis',
    workflowImprovements: [],
    newWorkflowSuggestions: [],
    appAutomationIdeas: [],
    quickWins: [],
    consolidationOpportunities: [],
  };

  try {
    const llmResult = await runLLMAudit(workflows, sitePages);
    if (llmResult) {
      auditResult = llmResult;
    } else {
      log('No LLM available. Using heuristic fallback.');
      auditResult = {
        summary: 'Heuristic fallback: Start Ollama (npm run llm:install) or set OPENROUTER_API_KEY for AI audit.',
        workflowImprovements: [],
        newWorkflowSuggestions: [],
        appAutomationIdeas: [
          { id: 'fallback-1', title: 'Add OPENROUTER_API_KEY', description: 'Set for LLM-powered workflow audits', implementation: 'Add to GitHub secrets', priority: 'medium' },
        ],
        quickWins: ['Ensure .env sourced in cron for LLM jobs', 'Add workflow_dispatch to key workflows'],
        consolidationOpportunities: [],
      };
    }
  } catch (e) {
    log(`LLM audit failed: ${e.message}`);
    auditResult.llmError = e.message;
  }

  const report = {
    timestamp: new Date().toISOString(),
    workflowsAudited: workflows.length,
    sitePagesFetched: sitePages.filter((p) => p.textSample).length,
    workflows: workflows.map((w) => ({ file: w.file, name: w.name, crons: w.crons })),
    audit: auditResult,
    summary: {
      workflowImprovements: (auditResult.workflowImprovements || []).length,
      newWorkflowSuggestions: (auditResult.newWorkflowSuggestions || []).length,
      appAutomationIdeas: (auditResult.appAutomationIdeas || []).length,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  const suggestions = {
    updatedAt: report.timestamp,
    workflowImprovements: auditResult.workflowImprovements || [],
    newWorkflowSuggestions: auditResult.newWorkflowSuggestions || [],
    appAutomationIdeas: auditResult.appAutomationIdeas || [],
    quickWins: auditResult.quickWins || [],
    consolidationOpportunities: auditResult.consolidationOpportunities || [],
  };
  fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));

  log(`Report: ${REPORT_FILE}`);
  log(`Suggestions: ${SUGGESTIONS_FILE}`);
  log(`Workflow improvements: ${report.summary.workflowImprovements}`);
  log(`New workflow ideas: ${report.summary.newWorkflowSuggestions}`);
  log(`App automation ideas: ${report.summary.appAutomationIdeas}`);

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
    if (data.audit?.summary) console.log('\nSummary:', data.audit.summary);
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-github-actions-audit-agent.cjs [run|summary]');
  process.exit(1);
}
