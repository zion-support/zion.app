#!/usr/bin/env node

/**
 * AI App Evolution Ideas Agent
 *
 * Fetches live ziontechgroup.com content, reads evolution backlog, and uses LLM
 * to generate NEW deployable evolution ideas. Enriches the backlog with innovative
 * suggestions for app improvement and evolution. Runs as part of app improvement
 * orchestrator or standalone.
 *
 * Output: Merges new ideas into app-evolution-backlog.json
 *
 * Environment:
 *   OPENROUTER_API_KEY - For LLM-powered ideas (optional, uses fallback when unset)
 *   SKIP_LLM=1 - Use heuristic fallback ideas only
 *
 * Runs: With app improvement orchestrator (EVOLUTION_IDEAS=1) or standalone
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-evolution-ideas-latest.json');
const EVOLUTION_BACKLOG = path.join(DATA_DIR, 'app-evolution-backlog.json');
const SITE_URL = 'https://ziontechgroup.com';

const PAGES_TO_FETCH = ['/', '/services', '/solutions', '/blog', '/contact', '/about', '/ai-services', '/industries'];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[EvolutionIdeas] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-EvolutionIdeas/1.0' },
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

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

const FALLBACK_IDEAS = {
  newIdeas: [
    'Add testimonials section with social proof',
    'Implement dark mode toggle for accessibility',
    'Add industry-specific landing page templates',
    'Create interactive ROI calculator',
    'Add newsletter signup with value proposition',
  ],
  quickWins: [
    'Add schema.org FAQ markup to key pages',
    'Improve mobile CTA visibility',
    'Add breadcrumb to blog posts',
  ],
  evolutionRoadmap: [
    'A/B test hero CTAs',
    'Add industry-specific case study filters',
    'Implement progressive web app features',
  ],
};

async function runLLMIdeas(siteContent, backlog) {
  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient({ appName: 'Zion Evolution Ideas' });

  if (!llm.isConfigured()) {
    log('No LLM available. Using fallback ideas.');
    return FALLBACK_IDEAS;
  }

  const systemPrompt = `You are an expert product strategist for Zion Tech Group (ziontechgroup.com), an AI solutions and engineering services company.
Given live site content and existing evolution backlog, generate NEW deployable ideas for app improvement and evolution.
Focus on: innovative features, UX improvements, conversion optimization, content ideas, technical enhancements.
Output ONLY valid JSON (no markdown, no extra text):
{
  "newIdeas": ["5-7 specific new ideas not already in backlog"],
  "quickWins": ["3-5 quick wins implementable in <1 day"],
  "evolutionRoadmap": ["2-4 strategic evolution items for next quarter"]
}
Be specific and actionable. Avoid duplicating existing backlog items.`;

  const userPrompt = `Live site content sample:\n${siteContent}\n\nExisting backlog (evolutionRoadmap):\n${JSON.stringify(backlog?.evolutionRoadmap || [], null, 2)}\n\nGenerate NEW evolution ideas.`;

  try {
    const response = await llm.chat(userPrompt, {
      systemPrompt,
      maxTokens: 2048,
      temperature: 0.6,
      timeout: 60000,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        newIdeas: parsed.newIdeas || FALLBACK_IDEAS.newIdeas,
        quickWins: parsed.quickWins || FALLBACK_IDEAS.quickWins,
        evolutionRoadmap: parsed.evolutionRoadmap || FALLBACK_IDEAS.evolutionRoadmap,
      };
    }
  } catch (e) {
    log(`LLM ideas failed: ${e.message}`);
  }
  return FALLBACK_IDEAS;
}

async function run() {
  ensureDirs();
  log('Starting app evolution ideas...');

  // Fetch live site
  const pages = [];
  for (const p of PAGES_TO_FETCH) {
    try {
      const { body } = await fetchPage(SITE_URL + p);
      const text = stripHtml(body);
      pages.push({ path: p, text: text.slice(0, 1500) });
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      log(`Failed to fetch ${p}: ${e.message}`);
    }
  }

  const siteContent = pages.map((p) => `--- ${p.path} ---\n${p.text}`).join('\n\n');
  const backlog = readJsonSafe(EVOLUTION_BACKLOG, {});

  const ideas = process.env.SKIP_LLM === '1' ? FALLBACK_IDEAS : await runLLMIdeas(siteContent, backlog);

  // Merge into backlog
  const merged = {
    ...backlog,
    updatedAt: new Date().toISOString(),
    evolutionIdeasRun: new Date().toISOString(),
    newIdeas: [...new Set([...(backlog.newIdeas || []), ...(ideas.newIdeas || [])])],
    quickWins: [...new Set([...(backlog.quickWins || []), ...(ideas.quickWins || [])])],
    evolutionRoadmap: [...new Set([...(backlog.evolutionRoadmap || []), ...(ideas.evolutionRoadmap || [])])],
  };

  fs.writeFileSync(EVOLUTION_BACKLOG, JSON.stringify(merged, null, 2));
  log(`Backlog updated: ${EVOLUTION_BACKLOG}`);

  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    pagesFetched: pages.length,
    ideas: ideas,
    mergedCount: {
      newIdeas: merged.newIdeas?.length || 0,
      quickWins: merged.quickWins?.length || 0,
      evolutionRoadmap: merged.evolutionRoadmap?.length || 0,
    },
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
    console.log(JSON.stringify(data.mergedCount || data, null, 2));
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-app-evolution-ideas-agent.cjs [run|summary]');
  process.exit(1);
}
