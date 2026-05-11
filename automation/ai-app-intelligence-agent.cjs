#!/usr/bin/env node

/**
 * AI App Intelligence Agent
 *
 * Makes the app improvement systems more intelligent by:
 * - Aggregating audit insights (UX, automation, site links, conversion funnel)
 * - Tracking score history for trend detection
 * - Auto-suggesting improvements based on recurring patterns
 * - Triggering remedial actions when thresholds are breached
 * - Feeding new ideas into evolution backlog
 *
 * No LLM required. Runs as part of automation improvements or standalone.
 *
 * Options:
 *   AUTO_COMMIT=1     - Merge insights into evolution backlog when new ideas found
 *   TRIGGER_FIXES=1   - Run UX auto-fix when UX score < 85
 *
 * Output: automation/reports/app-intelligence-latest.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-intelligence-latest.json');
const HISTORY_FILE = path.join(DATA_DIR, 'app-intelligence-history.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'app-evolution-backlog.json');

const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';
const TRIGGER_FIXES = process.env.TRIGGER_FIXES === '1';
const UX_SCORE_THRESHOLD = parseInt(process.env.UX_SCORE_THRESHOLD || '85', 10);

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppIntelligence] ${ts} | ${msg}`);
}

function readJsonSafe(filePath, def = null) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    return def;
  }
  return def;
}

function loadHistory() {
  const data = readJsonSafe(HISTORY_FILE, { entries: [], maxEntries: 100 });
  return data;
}

function appendHistory(entry) {
  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
  const data = loadHistory();
  data.entries = data.entries || [];
  data.entries.unshift({
    timestamp: new Date().toISOString(),
    ...entry,
  });
  const max = data.maxEntries || 100;
  data.entries = data.entries.slice(0, max);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

function collectInsights() {
  const ux = readJsonSafe(path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json'));
  const automation = readJsonSafe(path.join(REPORTS_DIR, 'automation-audit-latest.json'));
  const siteLinks = readJsonSafe(path.join(REPORTS_DIR, 'site-link-audit-latest.json'));
  const conversion = readJsonSafe(path.join(REPORTS_DIR, 'conversion-funnel-audit-latest.json'));
  const automationImprovements = readJsonSafe(path.join(REPORTS_DIR, 'automation-improvements-pipeline-latest.json'));
  const systemIntelligence = readJsonSafe(path.join(REPORTS_DIR, 'system-intelligence-audit-latest.json'));

  return {
    ux,
    automation,
    siteLinks,
    conversion,
    automationImprovements,
    systemIntelligence,
  };
}

function analyzeTrends(history) {
  const entries = (history.entries || []).slice(0, 7);
  if (entries.length < 2) return { trend: 'unknown', direction: 'stable' };

  const scores = entries.map((e) => e.uxScore).filter((s) => s != null);
  if (scores.length < 2) return { trend: 'unknown', direction: 'stable' };

  const recent = scores[0];
  const older = scores[scores.length - 1];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  let direction = 'stable';
  if (recent > older + 2) direction = 'improving';
  else if (recent < older - 2) direction = 'declining';

  return {
    trend: recent >= 90 ? 'healthy' : recent >= 80 ? 'acceptable' : 'needs_attention',
    direction,
    avgScore: Math.round(avg * 10) / 10,
    recentScore: recent,
  };
}

function generateSuggestions(insights) {
  const suggestions = [];

  if (insights.ux) {
    const score = insights.ux.score ?? 0;
    const failedChecks = (insights.ux.checks || []).filter((c) => !c.ok);
    if (score < UX_SCORE_THRESHOLD) {
      suggestions.push({
        id: 'ux-score-low',
        priority: 'high',
        title: 'UX score below threshold',
        description: `Current UX score ${score}/100. Run UX auto-fix or manually address failed checks.`,
        action: 'npm run app:ux-auto-fix',
        autoFixable: true,
      });
    }
    if (failedChecks.some((c) => c.id === 'meta_description')) {
      suggestions.push({
        id: 'meta-description-optimize',
        priority: 'medium',
        title: 'Optimize meta description',
        description: 'Meta description should be 50-160 chars for SEO.',
        action: 'Update homepage metadata in app/page.tsx or app/layout.tsx',
        autoFixable: true,
      });
    }
    if (failedChecks.some((c) => c.id === 'title')) {
      suggestions.push({
        id: 'title-optimize',
        priority: 'medium',
        title: 'Optimize title tag',
        description: 'Title should be 30-60 chars for SEO.',
        action: 'Update homepage metadata',
        autoFixable: true,
      });
    }
  }

  if (insights.siteLinks && (insights.siteLinks.broken ?? 0) > 0) {
    suggestions.push({
      id: 'broken-links',
      priority: 'high',
      title: 'Fix broken links',
      description: `${insights.siteLinks.broken} broken link(s) detected.`,
      action: 'npm run links:audit-fix',
      autoFixable: true,
    });
  }

  if (insights.automation && insights.automation.summary?.totalIssues > 0) {
    suggestions.push({
      id: 'automation-issues',
      priority: 'medium',
      title: 'Address automation issues',
      description: `${insights.automation.summary.totalIssues} automation issue(s) found.`,
      action: 'npm run automation:audit-summary',
      autoFixable: false,
    });
  }

  if (insights.conversion && insights.conversion.suggestions?.length > 0) {
    const ctaCount = insights.conversion.suggestions.filter((s) => s.type === 'cta_tracking').length;
    if (ctaCount > 0) {
      suggestions.push({
        id: 'conversion-funnel-cta',
        priority: 'low',
        title: 'Add GA4 CTA tracking',
        description: `${ctaCount} CTA(s) could benefit from GA4 event tracking.`,
        action: 'Review conversion-funnel-audit-latest.json',
        autoFixable: false,
      });
    }
  }

  return suggestions;
}

function mergeIntoBacklog(ideas) {
  if (ideas.length === 0) return;
  try {
    const backlog = readJsonSafe(BACKLOG_FILE, { newIdeas: [], ideas: [] });
    backlog.newIdeas = backlog.newIdeas || [];
    backlog.ideas = backlog.ideas || [];
    for (const idea of ideas) {
      const text = idea.title + (idea.description ? ': ' + idea.description : '');
      if (!backlog.newIdeas.includes(text) && !backlog.ideas.includes(text)) {
        backlog.newIdeas.push(text);
      }
    }
    backlog.updatedAt = new Date().toISOString();
    backlog.appIntelligenceMerge = new Date().toISOString();
    fs.mkdirSync(path.dirname(BACKLOG_FILE), { recursive: true });
    fs.writeFileSync(BACKLOG_FILE, JSON.stringify(backlog, null, 2));
    log(`Merged ${ideas.length} idea(s) into evolution backlog`);
  } catch (e) {
    log(`Failed to merge backlog: ${e.message}`);
  }
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  log('Collecting audit insights...');
  const insights = collectInsights();

  const uxScore = insights.ux?.score ?? null;
  const automationIssues = insights.automation?.summary?.totalIssues ?? 0;
  const brokenLinks = insights.siteLinks?.broken ?? 0;
  const totalLinks = insights.siteLinks?.totalLinks ?? insights.siteLinks?.total ?? 0;

  const history = loadHistory();
  appendHistory({
    uxScore,
    automationIssues,
    brokenLinks,
    totalLinks,
  });

  const trends = analyzeTrends(history);
  const suggestions = generateSuggestions(insights);

  const systemIntelScore = insights.systemIntelligence?.summary?.score ?? null;
  if (TRIGGER_FIXES && uxScore != null && uxScore < UX_SCORE_THRESHOLD) {
    log(`UX score ${uxScore} below threshold ${UX_SCORE_THRESHOLD}; triggering UX auto-fix...`);
    try {
      execSync('node automation/ai-live-site-ux-auto-fix-agent.cjs', {
        cwd: ROOT,
        stdio: 'inherit',
      });
    } catch (e) {
      log(`UX auto-fix failed: ${e.message}`);
    }
  }
  if (TRIGGER_FIXES && systemIntelScore != null && systemIntelScore < UX_SCORE_THRESHOLD) {
    log(`System intelligence score ${systemIntelScore} below threshold ${UX_SCORE_THRESHOLD}; triggering system intelligence auto-fix...`);
    try {
      execSync('node automation/ai-system-intelligence-auto-fix-agent.cjs', {
        cwd: ROOT,
        stdio: 'inherit',
      });
    } catch (e) {
      log(`System intelligence auto-fix failed: ${e.message}`);
    }
  }

  const backlogIdeas = suggestions
    .filter((s) => !s.autoFixable || s.id === 'ux-score-low')
    .map((s) => ({ title: s.title, description: s.description }));

  if (AUTO_COMMIT && backlogIdeas.length > 0) {
    mergeIntoBacklog(backlogIdeas);
  }

  const report = {
    timestamp: new Date().toISOString(),
    insights: {
      uxScore,
      automationIssues,
      brokenLinks,
      totalLinks,
      conversionSuggestions: insights.conversion?.suggestions?.length ?? 0,
    },
    trends,
    suggestions,
    summary: {
      totalSuggestions: suggestions.length,
      highPriority: suggestions.filter((s) => s.priority === 'high').length,
      autoFixable: suggestions.filter((s) => s.autoFixable).length,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);
  log(`UX: ${uxScore ?? 'N/A'}/100 | Automation issues: ${automationIssues} | Broken links: ${brokenLinks}`);
  log(`Suggestions: ${suggestions.length} (${suggestions.filter((s) => s.priority === 'high').length} high)`);

  process.exit(0);
}

main();
