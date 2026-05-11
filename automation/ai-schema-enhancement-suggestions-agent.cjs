#!/usr/bin/env node

/**
 * AI Schema Enhancement Suggestions Agent
 *
 * Scans key pages for missing JSON-LD structured data (Organization, WebSite,
 * BreadcrumbList, Article, FAQPage) and generates evolution ideas for the backlog.
 *
 * Outputs:
 *   automation/reports/schema-enhancement-suggestions-latest.json
 *   Merges into automation/data/app-evolution-backlog.json
 *
 * Run: npm run app:schema-enhancement-suggestions
 * Env: MERGE_TO_BACKLOG=1 (default) - merge ideas into backlog
 *      DRY_RUN=1 - preview only, do not write backlog
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const APP_DIR = path.join(ROOT, 'app');
const BACKLOG_PATH = path.join(DATA_DIR, 'app-evolution-backlog.json');
const REPORT_PATH = path.join(REPORTS_DIR, 'schema-enhancement-suggestions-latest.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

const SCHEMA_TYPES = {
  Organization: { pattern: /"@type"\s*:\s*"Organization"/, page: 'layout', priority: 'high' },
  WebSite: { pattern: /"@type"\s*:\s*"WebSite"/, page: 'layout', priority: 'high' },
  BreadcrumbList: { pattern: /"@type"\s*:\s*"BreadcrumbList"/, page: 'any', priority: 'medium' },
  Article: { pattern: /"@type"\s*:\s*"Article"/, page: 'blog', priority: 'medium' },
  FAQPage: { pattern: /"@type"\s*:\s*"FAQPage"/, page: 'any', priority: 'low' },
};

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[SchemaEnhancement] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function findTsxFiles(dir, files = []) {
  if (!dir || !fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      findTsxFiles(full, files);
    } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

function scanForSchema(content, relPath) {
  const findings = [];
  const hasLayout = relPath.includes('layout');
  const isBlog = relPath.includes('blog');

  for (const [type, { pattern, page, priority }] of Object.entries(SCHEMA_TYPES)) {
    const matches = content.match(pattern);
    if (!matches && (page === 'any' || (page === 'layout' && hasLayout) || (page === 'blog' && isBlog))) {
      findings.push({ type, priority, path: relPath });
    }
  }
  return findings;
}

function generateIdeas(findings) {
  const missingTypes = new Set(findings.map((f) => f.type));
  const ideas = [];

  if (missingTypes.has('Organization')) {
    ideas.push({
      id: 'schema-organization',
      category: 'seo',
      priority: 'high',
      title: 'Add Organization JSON-LD to layout',
      description: 'Add Organization structured data to root layout for brand recognition in search.',
      page: 'app/layout.tsx',
      impact: 'Rich snippets, knowledge panel eligibility',
      safeToAutoApply: false,
      source: 'schema_enhancement',
    });
  }
  if (missingTypes.has('WebSite')) {
    ideas.push({
      id: 'schema-website',
      category: 'seo',
      priority: 'high',
      title: 'Add WebSite JSON-LD with SearchAction',
      description: 'Add WebSite structured data with potentialAction SearchAction for sitelinks search box.',
      page: 'app/layout.tsx',
      impact: 'Sitelinks search box in Google',
      safeToAutoApply: false,
      source: 'schema_enhancement',
    });
  }
  if (missingTypes.has('BreadcrumbList')) {
    ideas.push({
      id: 'schema-breadcrumb-pages',
      category: 'seo',
      priority: 'medium',
      title: 'Add BreadcrumbList to key pages',
      description: 'Add BreadcrumbList JSON-LD to solution, blog, and product pages for SEO.',
      page: 'site-wide',
      impact: 'Breadcrumb rich snippets in search',
      safeToAutoApply: false,
      source: 'schema_enhancement',
    });
  }
  if (missingTypes.has('Article')) {
    ideas.push({
      id: 'schema-article-blog',
      category: 'seo',
      priority: 'medium',
      title: 'Add Article JSON-LD to blog posts',
      description: 'Ensure Article structured data on all blog posts for rich results.',
      page: 'app/blog/[slug]',
      impact: 'Article rich snippets in search',
      safeToAutoApply: false,
      source: 'schema_enhancement',
    });
  }
  if (missingTypes.has('FAQPage')) {
    ideas.push({
      id: 'schema-faq-page',
      category: 'seo',
      priority: 'low',
      title: 'Add FAQPage schema where FAQ exists',
      description: 'Add FAQPage JSON-LD to pages with FAQ sections.',
      page: 'site-wide',
      impact: 'FAQ rich snippets in search',
      safeToAutoApply: false,
      source: 'schema_enhancement',
    });
  }

  return ideas;
}

function mergeIntoBacklog(backlog, newIdeas) {
  const tasks = backlog.implementationTasks || [];
  const existingIds = new Set(tasks.map((t) => t.id));

  for (const idea of newIdeas) {
    if (!existingIds.has(idea.id)) {
      tasks.push(idea);
      existingIds.add(idea.id);
    }
  }

  const newIdeasList = [...new Set([...(backlog.newIdeas || []), 'Add missing JSON-LD structured data for SEO'])];

  return {
    ...backlog,
    ideas: backlog.ideas || [],
    quickWins: backlog.quickWins || [],
    newIdeas: newIdeasList,
    implementationTasks: tasks,
    quickWinsPrioritized: backlog.quickWinsPrioritized || [],
    evolutionRoadmap: backlog.evolutionRoadmap || [],
    updatedAt: new Date().toISOString(),
    schemaEnhancementRun: new Date().toISOString(),
  };
}

function run() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  log('Scanning app for schema coverage...');
  const appDir = path.join(ROOT, 'app');
  const files = findTsxFiles(appDir);
  const allFindings = [];

  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const rel = path.relative(ROOT, f);
    const findings = scanForSchema(content, rel);
    allFindings.push(...findings.map((x) => ({ ...x, path: rel })));
  }

  const ideas = generateIdeas(allFindings);

  const report = {
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    findingsCount: allFindings.length,
    ideasGenerated: ideas.length,
    ideas,
    mergedToBacklog: false,
  };

  if (ideas.length === 0) {
    log('No schema enhancement ideas; coverage looks good.');
    report.message = 'No missing schema types detected.';
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    return report;
  }

  log(`Generated ${ideas.length} schema enhancement idea(s).`);

  if (MERGE_TO_BACKLOG && !DRY_RUN) {
    const backlog = readJsonSafe(BACKLOG_PATH, {});
    const merged = mergeIntoBacklog(backlog, ideas);
    fs.writeFileSync(BACKLOG_PATH, JSON.stringify(merged, null, 2));
    report.mergedToBacklog = true;
    log(`Merged into ${BACKLOG_PATH}`);
  } else if (DRY_RUN) {
    log('DRY_RUN: skipping backlog merge.');
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_PATH}`);
  return report;
}

const cmd = process.argv[2];
if (cmd === 'summary') {
  const r = readJsonSafe(REPORT_PATH);
  if (r) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log('No report. Run with "run" first.');
  }
} else {
  run();
}
