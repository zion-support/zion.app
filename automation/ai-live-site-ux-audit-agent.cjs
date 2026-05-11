#!/usr/bin/env node

/**
 * AI Live Site UX Audit Agent
 *
 * Fetches live ziontechgroup.com homepage and performs heuristic UX/SEO checks.
 * No LLM required. Generates actionable improvement ideas for evolution backlog.
 * Runs as part of app evolution audit or standalone.
 *
 * Checks: meta description, og:image, viewport, schema.org, CTA presence,
 * mobile viewport, h1 presence, internal link count.
 *
 * Output: automation/reports/live-site-ux-audit-latest.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
const SITE_URL = 'https://ziontechgroup.com';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LiveSiteUX] ${ts} | ${msg}`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-LiveSiteUX/1.0' },
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

function auditHtml(html) {
  const checks = [];
  const ideas = [];

  // Meta description
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (metaDesc && metaDesc[1].length >= 50 && metaDesc[1].length <= 160) {
    checks.push({ id: 'meta_description', ok: true, detail: `Length ${metaDesc[1].length}` });
  } else {
    checks.push({ id: 'meta_description', ok: false, detail: metaDesc ? `Length ${metaDesc[1].length} (target 50-160)` : 'Missing' });
    ideas.push('Add or optimize meta description (50-160 chars) for SEO');
  }

  // og:image
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImage && ogImage[1]) {
    checks.push({ id: 'og_image', ok: true, detail: 'Present' });
  } else {
    checks.push({ id: 'og_image', ok: false, detail: 'Missing' });
    ideas.push('Add og:image for social sharing');
  }

  // Viewport
  const viewport = html.match(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i);
  if (viewport && viewport[1].includes('width')) {
    checks.push({ id: 'viewport', ok: true, detail: 'Mobile-friendly' });
  } else {
    checks.push({ id: 'viewport', ok: false, detail: 'Missing or invalid' });
    ideas.push('Add viewport meta for mobile responsiveness');
  }

  // Schema.org
  const schema = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (schema && schema[1].trim()) {
    checks.push({ id: 'schema_org', ok: true, detail: 'Structured data present' });
  } else {
    checks.push({ id: 'schema_org', ok: false, detail: 'Missing' });
    ideas.push('Add JSON-LD structured data (Organization, WebSite)');
  }

  // H1
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1].trim()) {
    checks.push({ id: 'h1', ok: true, detail: 'Present' });
  } else {
    checks.push({ id: 'h1', ok: false, detail: 'Missing' });
    ideas.push('Ensure single H1 on homepage for SEO');
  }

  // CTA presence (text heuristics + canonical Start a Project pattern)
  const ctaPattern =
    /(Start|Contact|Get|Book|Request|Schedule|Try|Sign|Learn)\s*(a|your|free)?\s*(Project|Demo|Call|Quote|Trial|Up)/gi;
  const ctaFound = html.match(ctaPattern);

  const startProjectPattern = /href=["']\/contact\?[^"']*topic=project[^"']*["'][^>]*>([^<]*Start a Project[^<]*)</i;
  const startProjectMatch = html.match(startProjectPattern);

  if (ctaFound && ctaFound.length >= 1) {
    checks.push({
      id: 'cta',
      ok: true,
      detail: `${ctaFound.length} CTA-like phrases`,
    });
  } else {
    checks.push({ id: 'cta', ok: false, detail: 'Weak or missing CTA' });
    ideas.push('Add clear primary CTA (Start a Project, Book a Call)');
  }

  if (startProjectMatch) {
    checks.push({
      id: 'cta_start_project',
      ok: true,
      detail: 'Primary Start a Project CTA links to /contact?topic=project',
    });
  } else {
    checks.push({
      id: 'cta_start_project',
      ok: false,
      detail: 'Missing canonical Start a Project CTA pointing to /contact?topic=project',
    });
    ideas.push(
      'Ensure the homepage hero or navigation includes a Start a Project CTA linking to /contact?topic=project&source=nav-desktop or hero',
    );
  }

  // Internal links
  const internalLinks = (html.match(/href=["'](\/[^"']*)/g) || []).length;
  if (internalLinks >= 5) {
    checks.push({ id: 'internal_links', ok: true, detail: `${internalLinks} internal links` });
  } else {
    checks.push({ id: 'internal_links', ok: false, detail: `${internalLinks} internal links` });
    ideas.push('Add more internal links for SEO and navigation');
  }

  // Title
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title && title[1].trim().length >= 30 && title[1].trim().length <= 60) {
    checks.push({ id: 'title', ok: true, detail: `Length ${title[1].trim().length}` });
  } else {
    checks.push({ id: 'title', ok: false, detail: title ? `Length ${title[1].trim().length} (target 30-60)` : 'Missing' });
    ideas.push('Optimize title tag (30-60 chars)');
  }

  // Layout: container / max-width
  const hasContainer = /(?:container|max-w-|mx-auto)/.test(html);
  if (hasContainer) {
    checks.push({ id: 'layout_container', ok: true, detail: 'Container/max-width present' });
  } else {
    checks.push({ id: 'layout_container', ok: false, detail: 'Missing container or max-width' });
    ideas.push('Use container or max-w-* for consistent content width');
  }

  // Layout: responsive breakpoints
  const hasBreakpoints = /(?:sm:|md:|lg:|xl:|2xl:)/.test(html);
  if (hasBreakpoints) {
    checks.push({ id: 'layout_responsive', ok: true, detail: 'Responsive breakpoints present' });
  } else {
    checks.push({ id: 'layout_responsive', ok: false, detail: 'Missing responsive breakpoints' });
    ideas.push('Add sm:, md:, lg: breakpoints for mobile-first design');
  }

  // Layout: semantic structure (main, section)
  const hasMain = /<main[\s>]/.test(html);
  const hasSection = /<section[\s>]/.test(html);
  if (hasMain && hasSection) {
    checks.push({ id: 'layout_semantic', ok: true, detail: 'main + section present' });
  } else if (hasMain) {
    checks.push({ id: 'layout_semantic', ok: true, detail: 'main present' });
  } else {
    checks.push({ id: 'layout_semantic', ok: false, detail: 'Missing semantic main/section' });
    ideas.push('Use semantic HTML: main, section for accessibility');
  }

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return {
    checks,
    ideas,
    score,
    passed,
    total,
    timestamp: new Date().toISOString(),
    url: SITE_URL,
  };
}

async function main() {
  log('Fetching live site...');
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  try {
    const { statusCode, body } = await fetchPage(SITE_URL);
    if (statusCode !== 200) {
      log(`HTTP ${statusCode}`);
      fs.writeFileSync(
        REPORT_FILE,
        JSON.stringify(
          {
            error: `HTTP ${statusCode}`,
            timestamp: new Date().toISOString(),
            url: SITE_URL,
          },
          null,
          2
        )
      );
      process.exit(1);
    }

    const result = auditHtml(body);
    fs.writeFileSync(REPORT_FILE, JSON.stringify(result, null, 2));

    log(`UX score: ${result.score}/100 (${result.passed}/${result.total} checks)`);
    if (result.ideas.length > 0) {
      log(`Ideas: ${result.ideas.join('; ')}`);
    }

    log(`Report: ${REPORT_FILE}`);
  } catch (e) {
    log(`Error: ${e.message}`);
    fs.writeFileSync(
      REPORT_FILE,
      JSON.stringify(
        {
          error: e.message,
          timestamp: new Date().toISOString(),
          url: SITE_URL,
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}

main();
