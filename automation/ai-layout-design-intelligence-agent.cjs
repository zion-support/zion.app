#!/usr/bin/env node

/**
 * AI Layout & Design Intelligence Agent
 *
 * Fetches the live Zion Tech Group homepage and computes simple layout
 * and visual hierarchy heuristics. Generates design-focused suggestions
 * and optionally merges them into the app evolution backlog so other
 * pipelines can act on them over time.
 *
 * No LLM required.
 *
 * Environment:
 *   AUTO_COMMIT=1  - Merge layout/design suggestions into app-evolution-backlog.json
 *
 * Output: automation/reports/layout-design-intelligence-latest.json
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'layout-design-intelligence-latest.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');
const SITE_URL = 'https://ziontechgroup.com';

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[LayoutDesignIntel] ${ts} | ${msg}`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'ZionTechGroup-LayoutDesignIntel/1.0' },
    };
    const req = https.request(options, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const loc = res.headers.location;
        const nextUrl = loc.startsWith('http')
          ? loc
          : `https://${u.hostname}${loc.startsWith('/') ? loc : '/' + loc}`;
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

function analyzeLayout(html) {
  const heroSlice = html.slice(0, 8000);

  const sectionCount = (html.match(/<section[\s>]/g) || []).length;
  const mainCount = (html.match(/<main[\s>]/g) || []).length;
  const h2Count = (html.match(/<h2[\s>]/g) || []).length;
  const h3Count = (html.match(/<h3[\s>]/g) || []).length;
  const listCount = (html.match(/<ul[\s>]/g) || []).length;

  const heroCtaMatches =
    heroSlice.match(
      /(Start a Project|View Pricing|Explore Solutions|Request a tailored ROI workshop|Discuss (?:this )?plan)/gi
    ) || [];

  const heroLinkCount =
    (heroSlice.match(/<a\s+[^>]*href=["'](\/[^"']*)["'][^>]*>/gi) || []).length;

  const hasMaxWidth = /max-w-[\w-]+/.test(heroSlice) || /max-w-[\w-]+/.test(html);
  const hasConsistentContainer = /(max-w-7xl[^<]+mx-auto)/.test(html);

  const suggestions = [];
  const diagnostics = [];

  let score = 95;

  diagnostics.push({
    id: 'structure',
    detail: `sections=${sectionCount}, main=${mainCount}, h2=${h2Count}, h3=${h3Count}, lists=${listCount}`,
  });

  diagnostics.push({
    id: 'hero',
    detail: `heroCtas=${heroCtaMatches.length}, heroLinks=${heroLinkCount}`,
  });

  diagnostics.push({
    id: 'containers',
    detail: `hasMaxWidth=${hasMaxWidth}, hasConsistentContainer=${hasConsistentContainer}`,
  });

  if (heroCtaMatches.length > 4) {
    score -= 5;
    suggestions.push({
      id: 'hero-cta-focus',
      priority: 'medium',
      title: 'Streamline hero CTAs for clearer focus',
      description:
        'The hero section contains several competing primary CTAs. Consider emphasizing one or two primary actions (e.g., "Start a Project" and "View Pricing") and treating the rest as secondary links.',
    });
  }

  if (heroLinkCount > 12) {
    score -= 5;
    suggestions.push({
      id: 'hero-link-density',
      priority: 'low',
      title: 'Reduce link density above the fold',
      description:
        'There are many links in the top portion of the page. Group related actions into concise clusters so the primary narrative and CTA are easier to scan, especially on mobile.',
    });
  }

  if (sectionCount > 30 || h2Count > 35) {
    score -= 10;
    suggestions.push({
      id: 'page-length',
      priority: 'medium',
      title: 'Consider grouping or summarizing lower-page sections',
      description:
        'The homepage contains a large number of sections and headings. Consider turning some repeated patterns into carousels, tabs, or collapsible sections so decision-makers can scan the page more comfortably.',
    });
  }

  if (!hasMaxWidth || !hasConsistentContainer) {
    score -= 10;
    suggestions.push({
      id: 'max-width-consistency',
      priority: 'high',
      title: 'Ensure consistent max-width containers',
      description:
        'Not all content appears to be wrapped in a consistent max-width container. Use a shared layout wrapper (e.g., max-w-7xl mx-auto px-4) to keep content readable on large screens.',
    });
  }

  if (listCount > 40) {
    score -= 5;
    suggestions.push({
      id: 'bullet-density',
      priority: 'low',
      title: 'Break up very dense bullet sections',
      description:
        'There are many bullet lists on the homepage. Consider grouping related bullets into cards or columns to improve visual rhythm and scanning.',
    });
  }

  if (mainCount === 0) {
    score -= 10;
    suggestions.push({
      id: 'semantic-main',
      priority: 'high',
      title: 'Confirm semantic main content region',
      description:
        'The live HTML did not include a <main> element. Ensure the primary content is wrapped in a semantic main region for accessibility and layout clarity.',
    });
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    metrics: {
      sectionCount,
      mainCount,
      h2Count,
      h3Count,
      listCount,
      heroCtaCount: heroCtaMatches.length,
      heroLinkCount,
      hasMaxWidth,
      hasConsistentContainer,
    },
    diagnostics,
    suggestions,
  };
}

function readJsonSafe(filePath, def = null) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    log(`Warning: Could not read ${filePath}: ${e.message}`);
  }
  return def;
}

function mergeIntoBacklog(suggestions) {
  if (!AUTO_COMMIT || suggestions.length === 0) return;

  try {
    const backlog = readJsonSafe(BACKLOG_FILE, {
      ideas: [],
      newIdeas: [],
      quickWins: [],
      implementationTasks: [],
    });
    backlog.newIdeas = backlog.newIdeas || [];
    backlog.ideas = backlog.ideas || [];

    for (const s of suggestions) {
      const text =
        '[Layout/Design] ' +
        s.title +
        (s.description ? ': ' + s.description : '');
      if (!backlog.newIdeas.includes(text) && !backlog.ideas.includes(text)) {
        backlog.newIdeas.push(text);
      }
    }

    backlog.updatedAt = new Date().toISOString();
    backlog.layoutDesignIntelMerge = new Date().toISOString();

    fs.mkdirSync(path.dirname(BACKLOG_FILE), { recursive: true });
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(backlog, null, 2));
    log(`Merged ${suggestions.length} layout/design idea(s) into evolution backlog`);
  } catch (e) {
    log(`Failed to merge layout/design ideas into backlog: ${e.message}`);
  }
}

async function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  log('Fetching live homepage for layout/design analysis...');
  const { statusCode, body } = await fetchPage(SITE_URL);
  if (statusCode !== 200) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      url: SITE_URL,
      error: `HTTP ${statusCode}`,
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(errorReport, null, 2));
    log(`HTTP ${statusCode} when fetching homepage`);
    process.exit(1);
  }

  const analysis = analyzeLayout(body);

  const report = {
    timestamp: new Date().toISOString(),
    url: SITE_URL,
    score: analysis.score,
    metrics: analysis.metrics,
    diagnostics: analysis.diagnostics,
    suggestions: analysis.suggestions,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Layout/design score: ${analysis.score}/100`);
  log(`Report: ${REPORT_FILE}`);

  mergeIntoBacklog(analysis.suggestions);

  process.exit(0);
}

main().catch((err) => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});

