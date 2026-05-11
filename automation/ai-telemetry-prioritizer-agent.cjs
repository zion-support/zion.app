#!/usr/bin/env node

/**
 * AI Telemetry Prioritizer Agent
 *
 * Reads live-site and automation telemetry and re-scores evolution backlog
 * implementation tasks so that the highest-impact items are surfaced first.
 *
 * Inputs:
 *   - automation/reports/app-intelligence-latest.json
 *   - automation/reports/live-site-ux-audit-latest.json
 *   - automation/reports/system-intelligence-audit-latest.json
 *   - automation/reports/lighthouse-production-latest.json (optional)
 *   - automation/reports/live-site-accessibility-audit-latest.json (optional)
 *   - automation/reports/site-link-audit-latest.json (optional)
 *   - automation/reports/conversion-funnel-audit-latest.json (optional)
 *   - automation/data/app-evolution-backlog.json
 *
 * Outputs:
 *   - Updates automation/data/app-evolution-backlog.json:
 *       - Adds/updates fields on each implementation task:
 *           - priorityScore (0–100)
 *           - telemetrySignals (object)
 *           - lastEvaluatedAt (ISO timestamp)
 *       - Marks a small subset as nextUp=true to guide implementors.
 *
 * Env:
 *   MAX_NEXT_UP=3        - How many tasks to flag as nextUp (default 3)
 *   DRY_RUN=1            - Do not write backlog, just print summary
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');

const MAX_NEXT_UP = parseInt(process.env.MAX_NEXT_UP || '3', 10);
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg, data) {
  const ts = new Date().toISOString();
   
  console.log(
    `[TelemetryPrioritizer] ${ts} | ${msg}${
      data ? ' ' + JSON.stringify(data) : ''
    }`,
  );
}

function readJsonSafe(filePath, def = null) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    log(`Could not read ${path.relative(ROOT, filePath)}`, { error: e.message });
  }
  return def;
}

function loadTelemetry() {
  const appIntel = readJsonSafe(
    path.join(REPORTS_DIR, 'app-intelligence-latest.json'),
  );
  const ux = readJsonSafe(
    path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json'),
  );
  const systemIntel = readJsonSafe(
    path.join(REPORTS_DIR, 'system-intelligence-audit-latest.json'),
  );
  const lighthouse = readJsonSafe(
    path.join(REPORTS_DIR, 'lighthouse-production-latest.json'),
  );
  const a11y = readJsonSafe(
    path.join(REPORTS_DIR, 'live-site-accessibility-audit-latest.json'),
  );
  const siteLinks = readJsonSafe(
    path.join(REPORTS_DIR, 'site-link-audit-latest.json'),
  );
  const conversion = readJsonSafe(
    path.join(REPORTS_DIR, 'conversion-funnel-audit-latest.json'),
  );

  const uxScore = ux?.score ?? appIntel?.insights?.uxScore ?? null;
  const systemIntelScore =
    systemIntel?.summary?.score ?? appIntel?.insights?.systemIntelScore ?? null;

  const lighthouseScores = (() => {
    if (!lighthouse) return null;
    if (lighthouse.scores) return lighthouse.scores;
    const c = lighthouse.categories;
    if (!c) return null;
    return {
      performance:
        c.performance != null
          ? Math.round(((c.performance.score ?? 0) || 0) * 100)
          : null,
      accessibility:
        c.accessibility != null
          ? Math.round(((c.accessibility.score ?? 0) || 0) * 100)
          : null,
      bestPractices:
        c['best-practices'] != null
          ? Math.round(((c['best-practices'].score ?? 0) || 0) * 100)
          : null,
      seo:
        c.seo != null ? Math.round(((c.seo.score ?? 0) || 0) * 100) : null,
    };
  })();

  const totalBrokenLinks = siteLinks?.broken ?? 0;
  const totalLinks = siteLinks?.totalLinks ?? siteLinks?.total ?? 0;

  const a11yViolations =
    a11y?.totalViolations ??
    (Array.isArray(a11y?.results)
      ? a11y.results.reduce(
          (sum, r) => sum + (r.violations || r.details || []).length,
          0,
        )
      : 0);

  const untrackedCtas = conversion?.untrackedCount ?? conversion?.untracked ?? 0;

  return {
    appIntel,
    uxScore,
    systemIntelScore,
    lighthouseScores,
    totalBrokenLinks,
    totalLinks,
    a11yViolations,
    untrackedCtas,
  };
}

function baseWeightForTask(task) {
  const priority = (task.priority || '').toLowerCase();
  switch (priority) {
    case 'critical':
      return 90;
    case 'high':
      return 75;
    case 'medium':
      return 55;
    case 'low':
      return 40;
    default:
      return 50;
  }
}

function routeWeight(page) {
  if (!page) return 1;
  if (page === '/' || page === 'homepage') return 1.5;
  if (
    page.startsWith('/ai-services') ||
    page.startsWith('/solutions') ||
    page.startsWith('/pricing')
  )
    return 1.3;
  if (page.startsWith('/contact')) return 1.4;
  return 1;
}

function categoryWeight(category, telemetry) {
  const cat = (category || '').toLowerCase();
  const {
    lighthouseScores,
    a11yViolations,
    totalBrokenLinks,
    untrackedCtas,
  } = telemetry;

  if (cat === 'performance') {
    const perf = lighthouseScores?.performance ?? null;
    if (perf != null && perf < 80) return 1.5;
    return 1.1;
  }
  if (cat === 'accessibility' || cat === 'ux') {
    if (a11yViolations > 0) return 1.5;
    return 1.1;
  }
  if (cat === 'seo') {
    const seo = lighthouseScores?.seo ?? null;
    if (seo != null && seo < 90) return 1.3;
    return 1.05;
  }
  if (cat === 'conversion') {
    if (untrackedCtas > 0) return 1.4;
    return 1.1;
  }
  if (cat === 'navigation' || cat === 'links') {
    if (totalBrokenLinks > 0) return 1.4;
    return 1.1;
  }
  return 1;
}

function computePriorityScore(task, telemetry) {
  const base = baseWeightForTask(task);
  const rWeight = routeWeight(task.page || task.route || '');
  const cWeight = categoryWeight(task.category, telemetry);

  let score = base * rWeight * cWeight;

  if (telemetry.uxScore != null && telemetry.uxScore < 70) {
    score *= 1.1;
  }
  if (telemetry.systemIntelScore != null && telemetry.systemIntelScore < 80) {
    score *= 1.05;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
}

function prioritizeBacklog(backlog, telemetry) {
  const tasks = Array.isArray(backlog.implementationTasks)
    ? backlog.implementationTasks
    : [];

  const now = new Date().toISOString();

  const scoredTasks = tasks.map((task) => {
    const score = computePriorityScore(task, telemetry);
    const telemetrySignals = {
      uxScore: telemetry.uxScore,
      systemIntelScore: telemetry.systemIntelScore,
      lighthouse: telemetry.lighthouseScores,
      a11yViolations: telemetry.a11yViolations,
      brokenLinks: telemetry.totalBrokenLinks,
      untrackedCtas: telemetry.untrackedCtas,
    };
    return {
      ...task,
      priorityScore: score,
      telemetrySignals,
      lastEvaluatedAt: now,
      nextUp: false,
    };
  });

  scoredTasks
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, Math.max(1, MAX_NEXT_UP))
    .forEach((t) => {
      t.nextUp = true;
    });

  return {
    ...backlog,
    implementationTasks: scoredTasks,
    telemetryPrioritizedAt: now,
  };
}

function main() {
  const telemetry = loadTelemetry();
  log('Loaded telemetry snapshot', {
    uxScore: telemetry.uxScore,
    systemIntelScore: telemetry.systemIntelScore,
    lighthouse: telemetry.lighthouseScores,
    a11yViolations: telemetry.a11yViolations,
    brokenLinks: telemetry.totalBrokenLinks,
    untrackedCtas: telemetry.untrackedCtas,
  });

  const backlog = readJsonSafe(BACKLOG_FILE, null);
  if (!backlog) {
    log('No app-evolution-backlog.json found; nothing to prioritize.');
    process.exit(0);
  }

  const prioritized = prioritizeBacklog(backlog, telemetry);

  const tasks = prioritized.implementationTasks || [];
  const top = [...tasks]
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, Math.max(1, MAX_NEXT_UP));

  log('Top candidates', {
    maxNextUp: MAX_NEXT_UP,
    candidates: top.map((t) => ({
      id: t.id,
      title: t.title,
      priorityScore: t.priorityScore,
      category: t.category,
      page: t.page,
    })),
  });

  if (DRY_RUN) {
    log('DRY_RUN=1, skipping backlog write');
    process.exit(0);
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(BACKLOG_FILE, JSON.stringify(prioritized, null, 2));
  log('Backlog updated with telemetry-driven priority scores');
}

if (require.main === module) {
  main();
}

module.exports = { prioritizeBacklog, computePriorityScore };

