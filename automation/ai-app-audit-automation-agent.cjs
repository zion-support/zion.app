#!/usr/bin/env node

/**
 * AI App Audit Automation Agent
 *
 * Audits the live production site (ziontechgroup.com) using OpenRouter LLM
 * to generate actionable improvement suggestions. Fetches key pages, extracts
 * content, and uses AI to identify:
 * - Content improvements (copy, CTAs, clarity)
 * - UX/UI enhancements
 * - SEO opportunities
 * - Performance suggestions
 * - Conversion optimization
 * - New feature ideas
 *
 * Uses OPENROUTER_API_KEY (or openrouter-free models).
 * Runs: Weekly via cron, or workflow_dispatch
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-audit-automation-latest.json');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const CONFIG_FILE = path.join(AUTOMATION_DIR, 'app-audit.config.json');

const SITE_URL = 'https://ziontechgroup.com';
const { loadPages } = require('./lib/pages-to-visit.cjs');
const { recordAutomationEvent } = require('./lib/automation-brain-types.cjs');
const PAGES_TO_AUDIT = loadPages({ includeExtended: true, includeAuditOnly: true }).map((p) => ({
  path: p.path,
  name: p.label,
}));

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppAudit] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function loadConfig() {
  const defaultConfig = {
    enabledCategories: ['content', 'ux', 'seo', 'performance', 'conversion', 'feature'],
    minPriority: 'medium',
    maxSuggestions: 40,
    quickWinsPerPage: 5,
  };

  if (!fs.existsSync(CONFIG_FILE)) {
    return defaultConfig;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...parsed,
      enabledCategories: parsed.enabledCategories || defaultConfig.enabledCategories,
    };
  } catch (e) {
    log(`Failed to load config, using defaults: ${e.message}`);
    return defaultConfig;
  }
}

function fetchPage(url, redirectCount = 0) {
  const MAX_REDIRECTS = 5;
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
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && redirectCount < MAX_REDIRECTS) {
        const loc = res.headers.location;
        const nextUrl = loc.startsWith('http') ? loc : `https://${u.hostname}${loc.startsWith('/') ? loc : '/' + loc}`;
        return fetchPage(nextUrl, redirectCount + 1).then(resolve).catch(reject);
      }
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
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 8000);
}

function extractMeta(html) {
  const meta = { title: '', description: '' };
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1].trim();
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (descMatch) meta.description = descMatch[1].trim();
  return meta;
}

async function fetchAllPages() {
  const results = [];
  for (const p of PAGES_TO_AUDIT) {
    const url = SITE_URL + p.path;
    try {
      log(`Fetching ${p.name}: ${url}`);
      const { statusCode, body } = await fetchPage(url);
      const text = stripHtml(body);
      const meta = extractMeta(body);
      results.push({
        name: p.name,
        path: p.path,
        url,
        statusCode,
        meta,
        textSample: text.slice(0, 3000),
      });
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      log(`Failed to fetch ${url}: ${e.message}`);
      results.push({ name: p.name, path: p.path, url, error: e.message });
    }
  }
  return results;
}

const FALLBACK_AUDIT = {
  summary: 'No LLM available. Start Ollama (npm run llm:install) or set OPENROUTER_API_KEY for AI audit.',
  suggestions: [
    { id: 'meta-check', category: 'seo', priority: 'medium', title: 'Verify meta tags', description: 'Ensure title and description on key pages', page: 'site-wide', impact: 'SEO' },
    { id: 'cta-clarity', category: 'conversion', priority: 'medium', title: 'Clarify CTAs', description: 'Review call-to-action visibility and copy', page: '/', impact: 'Conversion' },
  ],
  quickWins: ['Add schema.org markup to key pages', 'Improve mobile CTA visibility', 'Review meta descriptions'],
  newIdeas: ['A/B test hero CTAs', 'Add industry-specific case study filters'],
};

async function runLLMAudit(pageData, config) {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient();

  if (!llm.isConfigured()) {
    return FALLBACK_AUDIT;
  }

  const pageSummaries = pageData
    .filter((p) => p.textSample)
    .map((p) => `## ${p.name} (${p.path})\nTitle: ${p.meta?.title || 'N/A'}\nDescription: ${p.meta?.description || 'N/A'}\n\nContent sample:\n${p.textSample}`)
    .join('\n\n---\n\n');

  const systemPrompt = `You are an expert web strategist and UX consultant auditing the Zion Tech Group website (https://ziontechgroup.com).
Zion Tech Group is an AI solutions company offering industry-specific AI platforms, consulting, and engineering services.
Your task: Analyze the provided page content and metadata, then output a JSON object with improvement suggestions.
Focus especially on:
- Copy quality (clarity, reduction of jargon, alignment with executive and technical buyers)
- Conversion and UX (visibility of key CTAs such as Start a Project, Contact, pricing and solution discovery paths)
- Technical SEO (titles, descriptions, headings hierarchy, internal links, canonical intent)

Output ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "summary": "2-3 sentence overall assessment",
  "suggestions": [
    {
      "id": "unique-id",
      "category": "content|ux|seo|performance|conversion|feature",
      "priority": "high|medium|low",
      "title": "Short title",
      "description": "Specific actionable description",
      "page": "path or 'site-wide'",
      "impact": "Expected benefit"
    }
  ],
  "quickWins": ["List 3-5 quick wins that can be implemented immediately"],
  "newIdeas": ["List 2-4 innovative ideas for app evolution"]
}

Be specific and actionable. Focus on real improvements, not generic advice.`;

  const userPrompt = `Audit these pages from ziontechgroup.com and provide improvement suggestions based on this configuration:

Enabled categories: ${Array.isArray(config.enabledCategories) ? config.enabledCategories.join(', ') : 'content, ux, seo, performance, conversion, feature'}
Minimum priority to focus on: ${config.minPriority || 'medium'}
Maximum suggestions (soft limit): ${config.maxSuggestions || 40}

Now audit the following pages and prioritize concrete, high-impact suggestions:\n\n${pageSummaries}`;

  const response = await llm.chat(userPrompt, {
    systemPrompt,
    maxTokens: 4096,
    temperature: 0.5,
    timeout: 120000,
  });

  let parsed;
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = { summary: response.slice(0, 500), suggestions: [], quickWins: [], newIdeas: [] };
    }
  } catch (e) {
    log(`LLM response parse error: ${e.message}`);
    parsed = {
      summary: 'Parse failed - raw response used',
      suggestions: [],
      quickWins: [],
      newIdeas: [],
      rawResponse: response.slice(0, 2000),
    };
  }

  return parsed;
}

async function run() {
  ensureDirs();
  log('Starting app audit automation...');

  const config = loadConfig();

  const pageData = await fetchAllPages();
  const fetchReport = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    pages: pageData.map((p) => ({
      name: p.name,
      path: p.path,
      statusCode: p.statusCode,
      hasContent: !!p.textSample,
      error: p.error,
    })),
  };

  let auditResult = { summary: 'No LLM analysis', suggestions: [], quickWins: [], newIdeas: [] };
  try {
    auditResult = await runLLMAudit(pageData, config);
  } catch (e) {
    log(`LLM audit failed: ${e.message}`);
    auditResult.llmError = e.message;
  }

  const priorityWeight = (priority) => {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    if (priority === 'low') return 1;
    return 1;
  };

  const minPriorityWeight = priorityWeight(config.minPriority || 'medium');

  const filteredSuggestions = (auditResult.suggestions || [])
    .filter((s) =>
      !config.enabledCategories ||
      config.enabledCategories.includes((s.category || 'content').toLowerCase()),
    )
    .filter((s) => priorityWeight((s.priority || 'medium').toLowerCase()) >= minPriorityWeight)
    .slice(0, config.maxSuggestions || 40);

  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    fetch: fetchReport,
    audit: {
      ...auditResult,
      suggestions: filteredSuggestions,
    },
    summary: {
      totalSuggestions: filteredSuggestions.length,
      byCategory: filteredSuggestions.reduce((acc, s) => {
        acc[s.category || 'other'] = (acc[s.category || 'other'] || 0) + 1;
        return acc;
      }, {}),
      byPriority: filteredSuggestions.reduce((acc, s) => {
        acc[s.priority || 'medium'] = (acc[s.priority || 'medium'] || 0) + 1;
        return acc;
      }, {}),
      config: {
        enabledCategories: config.enabledCategories,
        minPriority: config.minPriority,
        maxSuggestions: config.maxSuggestions,
        quickWinsPerPage: config.quickWinsPerPage,
      },
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  const suggestionsPath = path.join(DATA_DIR, 'app-audit-suggestions.json');
  fs.writeFileSync(
    suggestionsPath,
    JSON.stringify(
      {
        updatedAt: report.timestamp,
        suggestions: filteredSuggestions,
        quickWins: auditResult.quickWins || [],
        newIdeas: auditResult.newIdeas || [],
      },
      null,
      2
    )
  );

  log(`Report: ${REPORT_FILE}`);
  log(`Suggestions: ${suggestionsPath}`);
  log(`Total suggestions: ${report.summary.totalSuggestions}`);

  // Emit an AutomationEvent summarizing this audit run
  recordAutomationEvent({
    id: `app-audit-${report.timestamp}`,
    timestamp: report.timestamp,
    agent: 'ai-app-audit-automation-agent',
    category: 'audit',
    decision: 'info',
    summary: `App audit generated ${report.summary.totalSuggestions} filtered suggestions (categories: ${Object.keys(
      report.summary.byCategory || {},
    ).join(', ') || 'none'}).`,
    meta: {
      summary: report.summary,
    },
  });

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
  console.log('Usage: node ai-app-audit-automation-agent.cjs [run|summary]');
  process.exit(1);
}
