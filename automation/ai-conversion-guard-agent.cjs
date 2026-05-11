#!/usr/bin/env node

/**
 * AI Conversion Guard Agent (non-LLM)
 *
 * Crawls a focused set of high-value routes and asserts:
 * - Presence of primary CTAs pointing to /contact?topic=project or /pricing
 * - Basic hero/funnel health (at least one clear contact/pricing path)
 *
 * Outputs a summary report to automation/reports/conversion-guard-latest.json
 * and emits AutomationEvents for the Automation Brain.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { recordAutomationEvent } = require('./lib/automation-brain-types.cjs');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'conversion-guard-latest.json');

const SITE_URL = 'https://ziontechgroup.com';

const ROUTES = [
  '/',
  '/ai-services',
  '/solutions',
  '/contact',
  '/pricing',
  '/consultation',
  '/zion-ai-chatbot-builder',
  '/zion-ai-customer-support-pro',
  '/zion-ai-lead-scoring',
  '/zion-ai-seo-optimizer',
  '/zion-ai-supply-chain-optimizer',
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ConversionGuard] ${ts} | ${msg}`);
}

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    const url = new URL(SITE_URL + route);
    const options = {
      hostname: url.hostname,
      path: url.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-ConversionGuard/1.0' },
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

function hasStartProjectCTA(html) {
  const pattern = /href=[\"']\/contact\?[^\"']*topic=project[^\"']*[\"'][^>]*>([^<]*Start a Project[^<]*)</i;
  return pattern.test(html);
}

function hasPricingLink(html) {
  const pattern = /href=[\"']\/pricing[^\"']*[\"'][^>]*>([^<]*(Pricing|View Pricing)[^<]*)</i;
  return pattern.test(html);
}

function hasContactCTA(html) {
  const pattern = /href=[\"']\/contact[^\"']*[\"'][^>]*>([^<]*(Contact|Talk to Sales|Book (a )?Call)[^<]*)</i;
  return pattern.test(html);
}

function evaluateRoute(route, html, statusCode) {
  if (statusCode !== 200) {
    return {
      route,
      statusCode,
      ok: false,
      reason: `HTTP ${statusCode}`,
      checks: [],
    };
  }

  const checks = [];

  if (hasStartProjectCTA(html)) {
    checks.push({ id: 'start_project_cta', ok: true });
  } else {
    checks.push({ id: 'start_project_cta', ok: false });
  }

  if (hasPricingLink(html)) {
    checks.push({ id: 'pricing_cta', ok: true });
  } else {
    checks.push({ id: 'pricing_cta', ok: false });
  }

  if (hasContactCTA(html)) {
    checks.push({ id: 'contact_cta', ok: true });
  } else {
    checks.push({ id: 'contact_cta', ok: false });
  }

  const failing = checks.filter((c) => !c.ok);

  return {
    route,
    statusCode,
    ok: failing.length === 0,
    checks,
  };
}

async function main() {
  ensureReportsDir();
  const startedAt = new Date().toISOString();
  log('Starting Conversion Guard scan...');

  const results = [];

  for (const route of ROUTES) {
    try {
      log(`Fetching ${route}`);
      const { statusCode, body } = await fetchRoute(route);
      const evaluation = evaluateRoute(route, body || '', statusCode || 0);
      results.push(evaluation);
      // Small delay to be polite
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      log(`Failed to fetch ${route}: ${e.message}`);
      results.push({
        route,
        statusCode: 0,
        ok: false,
        reason: e.message,
        checks: [],
      });
    }
  }

  const failingRoutes = results.filter((r) => !r.ok);
  const passedRoutes = results.filter((r) => r.ok);

  const summary = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    totalRoutes: results.length,
    passed: passedRoutes.length,
    failing: failingRoutes.length,
    routes: results,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(summary, null, 2));
  log(`Report written to ${REPORT_FILE}`);

  const finishedAt = summary.timestamp;

  recordAutomationEvent({
    id: `conversion-guard-${startedAt}`,
    timestamp: finishedAt,
    agent: 'ai-conversion-guard-agent',
    category: 'conversion_guard',
    decision: failingRoutes.length === 0 ? 'info' : 'needs_review',
    summary:
      failingRoutes.length === 0
        ? `Conversion Guard: all ${results.length} routes passed CTA checks.`
        : `Conversion Guard found CTA issues on ${failingRoutes.length}/${results.length} routes.`,
    meta: {
      totalRoutes: results.length,
      failingRoutes: failingRoutes.map((r) => r.route),
    },
  });
}

if (require.main === module) {
  main().catch((e) => {
    log(`Fatal error in Conversion Guard: ${e.message}`);
    recordAutomationEvent({
      id: `conversion-guard-error-${new Date().toISOString()}`,
      timestamp: new Date().toISOString(),
      agent: 'ai-conversion-guard-agent',
      category: 'conversion_guard',
      decision: 'needs_review',
      summary: 'Conversion Guard agent crashed.',
      meta: { error: e.message },
    });
    process.exit(1);
  });
}

