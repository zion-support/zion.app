#!/usr/bin/env node

/**
 * AI System Intelligence Audit Agent
 *
 * Audits ziontechgroup.com to make systems more intelligent:
 * - UX/SEO patterns, conversion funnel, engagement signals
 * - Accessibility, performance hints, navigation intelligence
 * - Optional LLM analysis for deeper insights
 *
 * Output: automation/reports/system-intelligence-audit-latest.json
 *
 * Run: npm run system:intelligence-audit
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'system-intelligence-audit-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

const { loadPages } = require('./lib/pages-to-visit.cjs');
const PAGES_TO_AUDIT = loadPages({ includeExtended: true });

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SystemIntel] ${ts} | ${msg}`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-SystemIntel/1.0' },
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
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function auditPage(html, url, label) {
  const checks = [];
  const ideas = [];

  // Meta description
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (metaDesc && metaDesc[1].length >= 50 && metaDesc[1].length <= 160) {
    checks.push({ id: 'meta_description', ok: true, page: label, detail: `Length ${metaDesc[1].length}` });
  } else {
    checks.push({ id: 'meta_description', ok: false, page: label, detail: metaDesc ? `Length ${metaDesc[1].length} (target 50-160)` : 'Missing' });
    ideas.push({ page: label, idea: 'Add or optimize meta description (50-160 chars)' });
  }

  // Title
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title && title[1].trim().length >= 30 && title[1].trim().length <= 60) {
    checks.push({ id: 'title', ok: true, page: label, detail: `Length ${title[1].trim().length}` });
  } else {
    checks.push({ id: 'title', ok: false, page: label, detail: title ? `Length ${title[1].trim().length} (target 30-60)` : 'Missing' });
    ideas.push({ page: label, idea: 'Optimize title tag (30-60 chars)' });
  }

  // Schema.org
  const schema = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (schema && schema.length >= 1) {
    checks.push({ id: 'schema_org', ok: true, page: label, detail: `${schema.length} schema block(s)` });
  } else {
    checks.push({ id: 'schema_org', ok: false, page: label, detail: 'Missing' });
    ideas.push({ page: label, idea: 'Add JSON-LD structured data (Organization, WebSite, BreadcrumbList)' });
  }

  // CTA presence
  const ctaPattern = /(Start|Contact|Get|Book|Request|Schedule|Try|Sign|Learn)\s*(a|your|free)?\s*(Project|Demo|Call|Quote|Trial|Up)/gi;
  const ctaFound = html.match(ctaPattern);
  if (ctaFound && ctaFound.length >= 1) {
    checks.push({ id: 'cta', ok: true, page: label, detail: `${ctaFound.length} CTA-like phrases` });
  } else {
    checks.push({ id: 'cta', ok: false, page: label, detail: 'Weak or missing CTA' });
    ideas.push({ page: label, idea: 'Add clear primary CTA (Start a Project, Book a Call)' });
  }

  // Form presence (contact page)
  const hasForm = /<form[\s>]/.test(html) || /type=["'](?:email|tel|submit)["']/.test(html);
  if (label === 'Contact' && hasForm) {
    checks.push({ id: 'contact_form', ok: true, page: label, detail: 'Form present' });
  } else if (label === 'Contact' && !hasForm) {
    checks.push({ id: 'contact_form', ok: false, page: label, detail: 'Missing form' });
    ideas.push({ page: label, idea: 'Add contact form or engagement form' });
  }

  // Internal links
  const internalLinks = (html.match(/href=["'](\/[^"']*)/g) || []).length;
  if (internalLinks >= 5) {
    checks.push({ id: 'internal_links', ok: true, page: label, detail: `${internalLinks} internal links` });
  } else {
    checks.push({ id: 'internal_links', ok: false, page: label, detail: `${internalLinks} internal links` });
    ideas.push({ page: label, idea: 'Add more internal links for SEO and navigation' });
  }

  // Semantic structure
  const hasMain = /<main[\s>]/.test(html);
  const hasSection = /<section[\s>]/.test(html);
  if (hasMain && hasSection) {
    checks.push({ id: 'semantic', ok: true, page: label, detail: 'main + section present' });
  } else if (hasMain) {
    checks.push({ id: 'semantic', ok: true, page: label, detail: 'main present' });
  } else {
    checks.push({ id: 'semantic', ok: false, page: label, detail: 'Missing semantic main/section' });
    ideas.push({ page: label, idea: 'Use semantic HTML: main, section for accessibility' });
  }

  // Accessibility: alt on images
  const imgs = html.match(/<img[^>]+>/gi) || [];
  const imgsWithoutAlt = imgs.filter((img) => !/alt=["'][^"']*["']/.test(img) && !/alt=["']["']/.test(img));
  if (imgs.length === 0 || imgsWithoutAlt.length === 0) {
    checks.push({ id: 'img_alt', ok: true, page: label, detail: imgs.length ? 'All images have alt' : 'No images' });
  } else {
    checks.push({ id: 'img_alt', ok: false, page: label, detail: `${imgsWithoutAlt.length}/${imgs.length} images missing alt` });
    ideas.push({ page: label, idea: 'Add alt text to all images for accessibility' });
  }

  // Performance: font-display
  const fontDisplay = /font-display:\s*(swap|optional)/.test(html) || !/<link[^>]+fonts/.test(html);
  if (fontDisplay) {
    checks.push({ id: 'font_display', ok: true, page: label, detail: 'Font display optimized or no external fonts' });
  } else {
    checks.push({ id: 'font_display', ok: false, page: label, detail: 'Consider font-display: swap' });
    ideas.push({ page: label, idea: 'Add font-display: swap for web fonts' });
  }

  // Engagement: social proof / trust
  const trustSignals = /(case study|testimonial|client|trusted|partner|award|certified|\d+\+|\d+%|years)/gi;
  const trustFound = html.match(trustSignals);
  if (trustFound && trustFound.length >= 2) {
    checks.push({ id: 'trust_signals', ok: true, page: label, detail: `${trustFound.length} trust/social proof signals` });
  } else {
    checks.push({ id: 'trust_signals', ok: false, page: label, detail: trustFound ? `${trustFound.length} signals` : 'Missing' });
    if (label === 'Homepage') ideas.push({ page: label, idea: 'Add trust signals (case studies, testimonials, stats)' });
  }

  // Navigation: breadcrumbs
  const hasBreadcrumb = /breadcrumb|BreadcrumbList|aria-label=["'][^"']*breadcrumb/i.test(html);
  if (label !== 'Homepage' && hasBreadcrumb) {
    checks.push({ id: 'breadcrumb', ok: true, page: label, detail: 'Breadcrumb present' });
  } else if (label !== 'Homepage' && !hasBreadcrumb) {
    checks.push({ id: 'breadcrumb', ok: false, page: label, detail: 'Missing' });
    ideas.push({ page: label, idea: 'Add breadcrumbs for navigation and SEO' });
  }

  // Conversion tracking
  const hasGtag = /gtag\s*\(|data-cta-event|data-event-name/.test(html);
  if (hasGtag) {
    checks.push({ id: 'conversion_tracking', ok: true, page: label, detail: 'Tracking present' });
  } else {
    checks.push({ id: 'conversion_tracking', ok: false, page: label, detail: 'No gtag/data-cta-event' });
    ideas.push({ page: label, idea: 'Add GA4/gtag event tracking for CTAs' });
  }

  return { checks, ideas };
}

async function runLLMAnalysis(summary) {
  try {
    const llmPath = path.join(ROOT, 'automation', 'lib', 'llm-client.cjs');
    if (!fs.existsSync(llmPath)) return null;
    const { createLLMClient } = require(llmPath);
    const llm = createLLMClient();
    if (!llm.isConfigured()) return null;

    const prompt = `You are auditing ziontechgroup.com for system intelligence. Current heuristic summary:
${JSON.stringify(summary, null, 2)}

Provide 3-5 concise, actionable recommendations to make the site more intelligent (UX, conversion, engagement, accessibility, performance). Output JSON array of strings only, no markdown.`;

    const response = await llm.chat(prompt);
    if (!response || typeof response !== 'string') return null;
    const cleaned = response.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']') + 1;
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end));
    }
    return null;
  } catch (_) {
    return null;
  }
}

async function main() {
  log('Starting system intelligence audit...');
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const allChecks = [];
  const allIdeas = [];
  const pageResults = [];

  for (const { path: p, label } of PAGES_TO_AUDIT) {
    const url = `${SITE_URL}${p}`;
    try {
      log(`Fetching ${label}...`);
      const { statusCode, body } = await fetchPage(url);
      if (statusCode !== 200) {
        log(`  HTTP ${statusCode}`);
        pageResults.push({ page: label, url, ok: false, statusCode });
        continue;
      }
      const { checks, ideas } = auditPage(body, url, label);
      allChecks.push(...checks);
      allIdeas.push(...ideas);
      pageResults.push({ page: label, url, ok: true, checks: checks.length, ideas: ideas.length });
    } catch (e) {
      log(`  Error: ${e.message}`);
      pageResults.push({ page: label, url, ok: false, error: e.message });
    }
  }

  const passed = allChecks.filter((c) => c.ok).length;
  const total = allChecks.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  const summary = {
    score,
    passed,
    total,
    pagesAudited: PAGES_TO_AUDIT.length,
    pagesOk: pageResults.filter((r) => r.ok).length,
    ideasCount: allIdeas.length,
  };

  let llmRecommendations = null;
  if (process.env.SKIP_LLM !== '1') {
    log('Running optional LLM analysis...');
    llmRecommendations = await runLLMAnalysis(summary);
    if (llmRecommendations && Array.isArray(llmRecommendations)) {
      log(`  LLM: ${llmRecommendations.length} recommendations`);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    url: SITE_URL,
    summary,
    checks: allChecks,
    ideas: allIdeas,
    pageResults,
    llmRecommendations: llmRecommendations || [],
    suggestions: [
      ...allIdeas.map((i) => `${i.page}: ${i.idea}`),
      ...(llmRecommendations || []),
    ].filter(Boolean),
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Score: ${score}/100 (${passed}/${total} checks)`);
  log(`Ideas: ${allIdeas.length}`);
  log(`Report: ${REPORT_FILE}`);

  return report;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
