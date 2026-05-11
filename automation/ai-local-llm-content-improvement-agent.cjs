#!/usr/bin/env node

/**
 * AI Local LLM Content Improvement Agent
 *
 * Fetches live ziontechgroup.com pages, uses local LLM (Ollama primary, OpenRouter fallback)
 * to suggest content improvements: clarity, engagement, gaps, industry coverage.
 * Outputs actionable report for app evolution pipeline.
 *
 * Run: npm run automation:local-llm-content-improvement
 * Env: OLLAMA_ENABLED, OLLAMA_URL, OLLAMA_MODEL, OPENROUTER_API_KEY
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'local-llm-content-improvement-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

const PAGES = ['/', '/services', '/solutions', '/blog', '/contact', '/about', '/ai-services', '/industries'];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LocalLLM-Content] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-ContentImprovement/1.0' },
      timeout: 15000,
    };
    const req = https.request(options, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const loc = res.headers.location;
        const nextUrl = loc.startsWith('http') ? loc : `https://${u.hostname}${loc.startsWith('/') ? loc : '/' + loc}`;
        return fetchPage(nextUrl).then(resolve).catch(reject);
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
    .trim()
    .slice(0, 2000);
}

const FALLBACK = {
  clarityImprovements: [
    { page: '/', issue: 'Value proposition', suggestion: 'Clarify unique value in hero section' },
  ],
  engagementSuggestions: ['Add more specific examples', 'Include industry-specific use cases'],
  contentGaps: ['Add FAQ section', 'Add comparison guides', 'Add implementation guides'],
  industryIdeas: ['Expand industry coverage', 'Add vertical-specific case studies'],
  quickWins: ['Improve headlines', 'Add bullet lists for readability', 'Add internal links'],
};

async function run() {
  ensureDirs();
  log('Starting content improvement audit...');

  const pages = [];
  for (const p of PAGES) {
    try {
      const { body } = await fetchPage(SITE_URL + p);
      const text = stripHtml(body);
      pages.push({ path: p, text: text.slice(0, 1500) });
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      log(`Failed to fetch ${p}: ${e.message}`);
    }
  }

  const siteContent = pages.map((p) => `--- ${p.path} ---\n${p.text}`).join('\n\n');
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient({ appName: 'Zion Content Improvement' });

  let result = FALLBACK;
  if (llm.isConfigured()) {
    log(`LLM: ${llm.getProviderInfo().provider || 'ollama'}`);
    const prompt = `You are a content strategist for Zion Tech Group (ziontechgroup.com), an AI solutions and engineering services company.

Audit this site content for improvement opportunities:

${siteContent.slice(0, 12000)}

Suggest improvements for: clarity, engagement, content gaps, industry coverage. Return ONLY valid JSON (no markdown):

{
  "clarityImprovements": [
    { "page": "/path", "issue": "Brief issue", "suggestion": "Specific fix" }
  ],
  "engagementSuggestions": ["Ways to improve engagement"],
  "contentGaps": ["Missing content types or topics"],
  "industryIdeas": ["Industry verticals or content to add"],
  "quickWins": ["3-5 actionable items"]
}

Be specific and actionable. Focus on value proposition clarity, engagement, and content gaps.`;

    try {
      const response = await llm.chat(prompt, { maxTokens: 2048, temperature: 0.5 });
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      log(`LLM failed: ${e.message}`);
    }
  } else {
    log('No LLM available. Using fallback suggestions.');
  }

  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    pagesAudited: pages.length,
    llmProvider: llm.isConfigured() ? llm.getProviderInfo().provider : null,
    suggestions: result,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
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
    console.log(JSON.stringify(data.suggestions || data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-local-llm-content-improvement-agent.cjs [run|summary]');
  process.exit(1);
}
