#!/usr/bin/env node

/**
 * AI Navigation Improvement Automation
 *
 * Audits ziontechgroup.com navigation and footer using OpenRouter LLM.
 * Suggests improvements and optionally applies safe fixes.
 *
 * Usage:
 *   OPENROUTER_API_KEY=xxx node automation/ai-navigation-improvement-automation.cjs run
 *   node automation/ai-navigation-improvement-automation.cjs audit
 *   OPENROUTER_API_KEY=xxx node automation/ai-navigation-improvement-automation.cjs run --apply
 *
 * Env: OPENROUTER_API_KEY, OPENROUTER_MODEL (default: meta-llama/llama-3.2-3b-instruct:free)
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'app');
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const BASE_URL = process.env.BASE_URL || 'https://ziontechgroup.com';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

function log(msg, level = 'INFO') {
  const ts = new Date().toISOString();
  console.log(`[NavImprove] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function fetchUrl(url) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  return new Promise((resolve, reject) => {
    const req = https.get(fullUrl, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body, url: fullUrl }));
    });
    req.on('error', reject);
  });
}

function discoverRoutes() {
  const routes = new Set();
  const scan = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name.startsWith('[')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath, `${prefix}/${entry.name}`);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
        routes.add(prefix || '/');
      }
    }
  };
  scan(APP_DIR);
  return routes;
}

function extractNavLinksFromConstants() {
  const navPath = path.join(APP_DIR, 'constants', 'navigation.ts');
  const content = fs.readFileSync(navPath, 'utf8');
  const links = [];
  const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const url = m[1].split('?')[0].split('#')[0];
    if (url.startsWith('/')) links.push(url);
  }
  return [...new Set(links)];
}

function extractFooterLinks() {
  const footerPath = path.join(APP_DIR, 'components', 'Footer.tsx');
  const content = fs.readFileSync(footerPath, 'utf8');
  const links = [];
  const hrefRegex = /href=["']([^"']+)["']/g;
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const url = m[1].split('?')[0].split('#')[0];
    if (url.startsWith('/') && !url.startsWith('//')) links.push(url);
  }
  return [...new Set(links)];
}

async function callOpenRouter(prompt, systemPrompt = null) {
  if (!OPENROUTER_API_KEY) return null;
  return new Promise((resolve) => {
    const messages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      { role: 'user', content: prompt },
    ];
    const body = JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    });
    const req = https.request(
      {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.message?.content;
            resolve(text || null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function audit() {
  ensureDirs();
  log('Starting navigation improvement audit...');

  const routes = discoverRoutes();
  const navLinks = extractNavLinksFromConstants();
  const footerLinks = extractFooterLinks();

  const broken = [];
  for (const href of [...navLinks, ...footerLinks]) {
    const normalized = href.split('?')[0].split('#')[0];
    if (!normalized.startsWith('/')) continue;
    if (!routes.has(normalized) && !routes.has(normalized + '/')) {
      broken.push({ href: normalized });
    }
  }

  let liveHtml = '';
  try {
    const res = await fetchUrl('/');
    liveHtml = res.body || '';
  } catch (err) {
    log(`Failed to fetch live site: ${err.message}`);
  }

  const auditResult = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalRoutes: routes.size,
    navLinksCount: navLinks.length,
    footerLinksCount: footerLinks.length,
    broken,
  };

  const reportPath = path.join(REPORTS_DIR, 'navigation-improvement-audit-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResult, null, 2));
  log(`Report written to ${reportPath}`);

  if (broken.length > 0) {
    log(`❌ Broken links: ${broken.length}`);
    broken.forEach((b) => log(`   - ${b.href}`));
  } else {
    log('✅ No broken internal links');
  }

  return { auditResult, liveHtml, routes, navLinks, footerLinks };
}

async function getLLMSuggestions(auditResult, liveHtml) {
  const systemPrompt = `You are a UX/IA expert auditing navigation for ziontechgroup.com, an AI solutions platform.
Provide 3-5 concise, actionable suggestions to improve navigation and footer. Focus on:
- Missing high-value pages (e.g. Consultation, Automation, Micro SAAS)
- Consistency between nav and footer
- Link order and grouping
- Conversion paths (e.g. Contact, Consultation)
Format as a numbered list. Be specific.`;

  const prompt = `Audit the Zion Tech Group site navigation:

- Total routes: ${auditResult.totalRoutes}
- Nav links: ${auditResult.navLinksCount}
- Footer links: ${auditResult.footerLinksCount}
- Broken links: ${JSON.stringify(auditResult.broken)}

${liveHtml ? `Live homepage HTML snippet (first 3000 chars):\n${liveHtml.slice(0, 3000)}` : ''}

Provide 3-5 actionable suggestions to improve navigation. Numbered list.`;

  return callOpenRouter(prompt, systemPrompt);
}

async function run(applyFixes = false) {
  const { auditResult, liveHtml } = await audit();

  if (OPENROUTER_API_KEY) {
    log('Fetching LLM suggestions...');
    const suggestions = await getLLMSuggestions(auditResult, liveHtml);
    if (suggestions) {
      log('LLM suggestions:');
      console.log(suggestions);
      auditResult.llmSuggestions = suggestions;
      const reportPath = path.join(REPORTS_DIR, 'navigation-improvement-audit-latest.json');
      fs.writeFileSync(reportPath, JSON.stringify({ ...auditResult, llmSuggestions: suggestions }, null, 2));
    }
  } else {
    log('Set OPENROUTER_API_KEY for LLM suggestions.');
  }

  if (applyFixes && auditResult.broken.length === 0) {
    log('No broken links to fix. Apply fixes manually if needed.');
  }

  return auditResult;
}

const args = process.argv.slice(2);
const applyFixes = args.includes('--apply');

if (args.includes('audit')) {
  audit().then((r) => console.log(JSON.stringify(r.auditResult, null, 2)));
} else {
  run(applyFixes).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
