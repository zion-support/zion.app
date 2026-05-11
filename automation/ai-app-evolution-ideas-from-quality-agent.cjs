#!/usr/bin/env node

/**
 * AI App Evolution Ideas from Quality Agent
 *
 * Reads quality reports (Lighthouse, performance regression, live-site accessibility)
 * and generates evolution ideas for the app improvement backlog.
 * Merges actionable suggestions into app-evolution-backlog.json.
 *
 * Outputs:
 *   automation/reports/evolution-ideas-from-quality-latest.json
 *   Merges into automation/data/app-evolution-backlog.json
 *
 * Run: npm run app:evolution-ideas-from-quality
 * Env: MERGE_TO_BACKLOG=1 (default) - merge ideas into backlog
 *      DRY_RUN=1 - preview only, do not write backlog
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const LIGHTHOUSE_PATH = path.join(REPORTS_DIR, 'lighthouse-production-latest.json');
const PERF_REGRESSION_PATH = path.join(REPORTS_DIR, 'performance-regression-latest.json');
const A11Y_PATH = path.join(REPORTS_DIR, 'live-site-accessibility-audit-latest.json');
const BACKLOG_PATH = path.join(DATA_DIR, 'app-evolution-backlog.json');
const REPORT_PATH = path.join(REPORTS_DIR, 'evolution-ideas-from-quality-latest.json');

const MERGE_TO_BACKLOG = process.env.MERGE_TO_BACKLOG !== '0';
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[EvolutionFromQuality] ${ts} | ${msg}`);
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Could not read ${p}: ${e.message}`);
  }
  return def;
}

function generateIdeasFromLighthouse(lh) {
  const ideas = [];
  const scores = lh?.scores || (() => {
    const c = lh?.categories;
    if (!c) return null;
    return {
      performance: c.performance != null ? Math.round((c.performance.score ?? 0) * 100) : null,
      accessibility: c.accessibility != null ? Math.round((c.accessibility.score ?? 0) * 100) : null,
      bestPractices: c['best-practices'] != null ? Math.round((c['best-practices'].score ?? 0) * 100) : null,
      seo: c.seo != null ? Math.round((c.seo.score ?? 0) * 100) : null,
    };
  })();
  if (!scores) return ideas;

  const perf = scores.performance ?? scores.perf ?? null;
  const a11y = scores.accessibility ?? scores.a11y ?? null;
  const bp = scores['best-practices'] ?? scores.bestPractices ?? null;
  const seo = scores.seo ?? null;

  if (perf != null && perf < 80) {
    ideas.push({
      id: 'quality-perf-low',
      category: 'performance',
      priority: 'high',
      title: 'Improve Lighthouse performance score',
      description: `Performance score ${perf}/100. Optimize LCP, CLS, FID. Use next/image, lazy load below-fold.`,
      page: 'site-wide',
      impact: 'Faster load, better Core Web Vitals',
      safeToAutoApply: false,
      source: 'lighthouse',
    });
  }
  if (a11y != null && a11y < 90) {
    ideas.push({
      id: 'quality-a11y-low',
      category: 'accessibility',
      priority: 'high',
      title: 'Improve Lighthouse accessibility score',
      description: `Accessibility score ${a11y}/100. Add alt text, labels, ARIA, contrast.`,
      page: 'site-wide',
      impact: 'WCAG compliance, inclusive UX',
      safeToAutoApply: false,
      source: 'lighthouse',
    });
  }
  if (bp != null && bp < 90) {
    ideas.push({
      id: 'quality-bp-low',
      category: 'best-practices',
      priority: 'medium',
      title: 'Improve Lighthouse best-practices score',
      description: `Best-practices score ${bp}/100. Fix console errors, HTTPS, deprecated APIs.`,
      page: 'site-wide',
      impact: 'Security and reliability',
      safeToAutoApply: false,
      source: 'lighthouse',
    });
  }
  if (seo != null && seo < 90) {
    ideas.push({
      id: 'quality-seo-low',
      category: 'seo',
      priority: 'medium',
      title: 'Improve Lighthouse SEO score',
      description: `SEO score ${seo}/100. Meta tags, structured data, crawlability.`,
      page: 'site-wide',
      impact: 'Search visibility',
      safeToAutoApply: false,
      source: 'lighthouse',
    });
  }
  return ideas;
}

function generateIdeasFromPerfRegression(pr) {
  const ideas = [];
  if (!pr?.regressions?.length) return ideas;

  for (const r of pr.regressions) {
    const cat = r.category || 'unknown';
    ideas.push({
      id: `quality-perf-regression-${String(cat).replace(/\s+/g, '-')}`,
      category: 'performance',
      priority: 'high',
      title: `Performance regression: ${cat} dropped`,
      description: r.message || `Score dropped from ${r.previous} to ${r.current}`,
      page: 'site-wide',
      impact: 'Restore performance baseline',
      safeToAutoApply: false,
      source: 'performance_regression',
    });
  }
  return ideas;
}

function generateIdeasFromA11y(a11yReport) {
  const ideas = [];
  const totalViolations = a11yReport?.totalViolations ?? (a11yReport?.violations || []).length;

  if (totalViolations > 0) {
    ideas.push({
      id: 'quality-a11y-violations',
      category: 'accessibility',
      priority: 'high',
      title: 'Fix live-site accessibility violations',
      description: `${totalViolations} axe-core violation(s) on production. Run a11y:live for details.`,
      page: 'site-wide',
      impact: 'WCAG 2.1 compliance',
      safeToAutoApply: false,
      source: 'live_site_accessibility',
    });
  }
  return ideas;
}

function mergeIntoBacklog(backlog, newIdeas, newQuickWins, newNewIdeas) {
  const tasks = backlog.implementationTasks || [];
  const existingIds = new Set(tasks.map((t) => t.id));

  for (const idea of newIdeas) {
    if (!existingIds.has(idea.id)) {
      tasks.push(idea);
      existingIds.add(idea.id);
    }
  }

  const quickWins = [...new Set([...(backlog.quickWins || []), ...(newQuickWins || [])])];
  const newIdeasList = [...new Set([...(backlog.newIdeas || []), ...(newNewIdeas || [])])];

  return {
    ...backlog,
    ideas: backlog.ideas || [],
    quickWins,
    newIdeas: newIdeasList,
    implementationTasks: tasks,
    quickWinsPrioritized: backlog.quickWinsPrioritized || quickWins.slice(0, 5),
    evolutionRoadmap: backlog.evolutionRoadmap || [],
    updatedAt: new Date().toISOString(),
    evolutionIdeasFromQualityRun: new Date().toISOString(),
  };
}

function run() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  log('Reading quality reports...');
  const lh = readJsonSafe(LIGHTHOUSE_PATH);
  const pr = readJsonSafe(PERF_REGRESSION_PATH);
  const a11y = readJsonSafe(A11Y_PATH);

  const ideasFromLh = generateIdeasFromLighthouse(lh);
  const ideasFromPr = generateIdeasFromPerfRegression(pr);
  const ideasFromA11y = generateIdeasFromA11y(a11y);

  const allIdeas = [...ideasFromLh, ...ideasFromPr, ...ideasFromA11y];
  const newQuickWins = [];
  const newNewIdeas = [];

  if (ideasFromLh.length > 0) {
    newNewIdeas.push('Address low Lighthouse scores (run lighthouse:production for details)');
  }
  if (ideasFromPr.length > 0) {
    newNewIdeas.push('Investigate performance regression and restore baseline');
  }
  if (ideasFromA11y.length > 0) {
    newNewIdeas.push('Fix live-site accessibility violations (run a11y:live)');
  }

  const report = {
    timestamp: new Date().toISOString(),
    sources: {
      lighthouse: !!lh,
      performanceRegression: !!pr,
      liveSiteAccessibility: !!a11y,
    },
    ideasGenerated: allIdeas.length,
    ideas: allIdeas,
    newQuickWins,
    newNewIdeas,
    mergedToBacklog: false,
  };

  if (allIdeas.length === 0) {
    log('No evolution ideas generated from quality reports.');
    report.message = 'No actionable ideas; quality reports may be missing or scores acceptable.';
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    return report;
  }

  log(`Generated ${allIdeas.length} evolution idea(s).`);

  if (MERGE_TO_BACKLOG && !DRY_RUN) {
    const backlog = readJsonSafe(BACKLOG_PATH, {});
    const merged = mergeIntoBacklog(backlog, allIdeas, newQuickWins, newNewIdeas);
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
