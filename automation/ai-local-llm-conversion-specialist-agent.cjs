#!/usr/bin/env node

/**
 * AI Local LLM Conversion Specialist Agent
 *
 * Fetches live ziontechgroup.com, uses local LLM (Ollama primary, OpenRouter fallback)
 * to suggest conversion improvements: CTAs, forms, trust signals, friction reduction.
 * Outputs actionable report for app evolution pipeline.
 *
 * Run: npm run automation:local-llm-conversion
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
const REPORT_FILE = path.join(REPORTS_DIR, 'local-llm-conversion-specialist-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

const PAGES = ['/', '/services', '/solutions', '/contact', '/about', '/ai-services'];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LocalLLM-Conversion] ${ts} | ${msg}`);
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
      headers: { 'User-Agent': 'ZionTechGroup-ConversionSpecialist/1.0' },
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
  ctaSuggestions: [
    { page: '/', issue: 'Hero CTA visibility', suggestion: 'Make primary CTA more prominent above fold' },
    { page: '/', issue: 'Secondary CTAs', suggestion: 'Add CTAs in mid-page sections' },
  ],
  trustSignals: ['Add testimonials section', 'Add client logos', 'Add case study highlights'],
  frictionReduction: ['Simplify contact form', 'Add quick contact options', 'Reduce form fields'],
  quickWins: ['Add sticky CTA on mobile', 'Improve form labels', 'Add trust badges'],
};

async function run() {
  ensureDirs();
  log('Starting conversion specialist audit...');

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
  const llm = createLLMClient({ appName: 'Zion Conversion Specialist' });

  let result = FALLBACK;
  if (llm.isConfigured()) {
    log(`LLM: ${llm.getProviderInfo().provider || 'ollama'}`);
    const prompt = `You are a conversion rate optimization expert for Zion Tech Group (ziontechgroup.com), an AI solutions and engineering services company.

Audit this site content for conversion opportunities:

${siteContent.slice(0, 12000)}

Suggest improvements for: CTAs, trust signals, forms, friction reduction. Return ONLY valid JSON (no markdown):

{
  "ctaSuggestions": [
    { "page": "/path", "issue": "Brief issue", "suggestion": "Specific fix" }
  ],
  "trustSignals": ["Suggestions for social proof, testimonials, logos"],
  "frictionReduction": ["Suggestions to reduce friction in conversion"],
  "quickWins": ["3-5 actionable items"]
}

Be specific and actionable. Focus on above-the-fold CTAs, form clarity, trust elements.`;

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
  console.log('Usage: node ai-local-llm-conversion-specialist-agent.cjs [run|summary]');
  process.exit(1);
}
