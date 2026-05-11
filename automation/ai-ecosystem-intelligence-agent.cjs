#!/usr/bin/env node

/**
 * AI Ecosystem Intelligence Agent
 *
 * Analyzes the Zion Tech Group automation ecosystem and generates
 * actionable suggestions for new automations, cron jobs, and improvements.
 * Makes the ecosystem more intelligent and autonomous over time.
 *
 * Features:
 * - Scans existing agents, workflows, and cron jobs
 * - Identifies gaps and improvement opportunities
 * - Suggests new automation ideas
 * - Proposes new cron jobs
 * - Recommends agent enhancements
 * - Generates implementation-ready suggestions
 *
 * Runs: Weekly via GitHub Actions, daily via cron
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const CRON_FILE = path.join(AUTOMATION_DIR, 'cron', 'automation.cron');
const REPORT_FILE = path.join(REPORTS_DIR, 'ecosystem-intelligence-latest.json');

const SUGGESTIONS_FILE = path.join(AUTOMATION_DIR, 'data', 'ecosystem-suggestions.json');

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[EcosystemIntel] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, path.join(AUTOMATION_DIR, 'data')].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext));
}

function readFileSafe(p, def = '') {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return def;
  }
}

function analyzeEcosystem() {
  const agents = listFiles(AUTOMATION_DIR, '.cjs').filter((f) => f.startsWith('ai-'));
  const workflows = listFiles(WORKFLOWS_DIR, '.yml');
  const cronContent = readFileSafe(CRON_FILE);
  const packageJson = JSON.parse(readFileSafe(path.join(ROOT, 'package.json'), '{}'));
  const scripts = Object.keys(packageJson.scripts || {});

  return {
    agents: agents.length,
    agentNames: agents,
    workflows: workflows.length,
    workflowNames: workflows,
    cronJobs: (cronContent.match(/^[^#].*$/gm) || []).filter(Boolean).length,
    npmScripts: scripts.filter((s) => s.includes(':') || s.includes('ai:') || s.includes('automation:')).length,
  };
}

function generateSuggestions(analysis, cronContent = '') {
  const suggestions = [];

  // 1. Content Freshness - check if we have a content freshness agent
  if (!analysis.agentNames.some((a) => a.includes('freshness') || a.includes('content-age'))) {
    suggestions.push({
      id: 'content-freshness-agent',
      type: 'new_agent',
      priority: 'high',
      title: 'Content Freshness Agent',
      description: 'Agent that scans blog posts, case studies, and service pages for stale content (e.g. >12 months) and suggests updates or regeneration.',
      implementation: 'Create automation/ai-content-freshness-agent.cjs',
      cron: '0 4 * * 1',
      benefit: 'Keeps website content relevant and SEO-strong',
    });
  }

  // 2. Dependency outdated agent
  if (!analysis.agentNames.some((a) => a.includes('dependency-outdated'))) {
    suggestions.push({
      id: 'dependency-outdated-agent',
      type: 'new_agent',
      priority: 'medium',
      title: 'Dependency Outdated Agent',
      description: 'Lightweight agent that runs npm outdated and reports major/minor/patch updates.',
      implementation: 'Create automation/ai-dependency-outdated-agent.cjs',
      cron: '0 5 * * 4',
      benefit: 'Visibility into available dependency updates',
    });
  }

  // 3. Bundle size monitor
  if (!analysis.agentNames.some((a) => a.includes('bundle-size-monitor'))) {
    suggestions.push({
      id: 'bundle-size-monitor-agent',
      type: 'new_agent',
      priority: 'medium',
      title: 'Bundle Size Monitor Agent',
      description: 'Tracks bundle size over time and alerts on regressions.',
      implementation: 'Create automation/ai-bundle-size-monitor-agent.cjs',
      cron: '0 5 * * 5',
      benefit: 'Prevents bundle size regressions',
    });
  }

  // 4. Dead code detector
  if (!analysis.agentNames.some((a) => a.includes('dead-code-detector'))) {
    suggestions.push({
      id: 'dead-code-detector-agent',
      type: 'new_agent',
      priority: 'low',
      title: 'Dead Code Detector Agent',
      description: 'Uses depcheck to find unused dependencies.',
      implementation: 'Create automation/ai-dead-code-detector-agent.cjs',
      cron: '0 4 * * 4',
      benefit: 'Reduces bundle size and maintenance burden',
    });
  }

  // 5. Broken external links - enhance existing (skip if already has external link history)
  const brokenLinkPath = path.join(AUTOMATION_DIR, 'ai-broken-link-fixer.cjs');
  const brokenLinkContent = readFileSafe(brokenLinkPath);
  if (analysis.agentNames.some((a) => a.includes('broken-link')) && !brokenLinkContent.includes('external-link-history')) {
    suggestions.push({
      id: 'broken-link-external',
      type: 'enhancement',
      priority: 'medium',
      title: 'External Link Monitoring',
      description: 'Extend broken-link-fixer to track external link health over time and alert on repeated failures.',
      implementation: 'Add external link history to ai-broken-link-fixer.cjs',
      benefit: 'Proactive link maintenance',
    });
  }

  // 6. Test coverage agent
  if (!analysis.agentNames.some((a) => a.includes('test-coverage') || a.includes('coverage-improvement'))) {
    suggestions.push({
      id: 'test-coverage-agent',
      type: 'new_agent',
      priority: 'medium',
      title: 'Test Coverage Improvement Agent',
      description: 'Agent that identifies untested critical paths and suggests or generates tests.',
      implementation: 'Create automation/ai-test-coverage-agent.cjs',
      cron: '0 5 * * 2',
      benefit: 'Improves test coverage from current baseline',
    });
  }

  // 7. Dependency security auto-fix (skip if already in cron)
  if (!cronContent.includes('npm audit fix') && !cronContent.includes('deps-security')) {
    suggestions.push({
      id: 'deps-security-auto',
      type: 'cron_job',
      priority: 'high',
      title: 'Weekly Dependency Security Audit',
      description: 'Run npm audit and auto-fix low-risk vulnerabilities, report high/critical.',
      implementation: 'Add to cron: 0 3 * * 0 cd $ZION_ROOT && npm audit fix --audit-level=low',
      benefit: 'Keeps dependencies secure with minimal risk',
    });
  }

  // 8. Sitemap sync with build (skip if ci-cd.yml already runs sitemap:validate)
  const ciCdPath = path.join(ROOT, '.github', 'workflows', 'ci-cd.yml');
  const ciCdContent = readFileSafe(ciCdPath);
  if (!ciCdContent.includes('sitemap:validate')) {
    suggestions.push({
      id: 'sitemap-on-deploy',
      type: 'workflow',
      priority: 'medium',
      title: 'Sitemap Validation on Deploy',
      description: 'Add sitemap validation step to CI/CD pipeline before deploy.',
      implementation: 'Add npm run sitemap:validate to ci-cd.yml',
      benefit: 'Prevents broken sitemaps in production',
    });
  }

  // 9. Ecosystem intelligence self-schedule (skip if daily pipeline runs it)
  if (!cronContent.includes('ecosystem-intelligence') && !cronContent.includes('daily-automation-pipeline')) {
    suggestions.push({
      id: 'ecosystem-intel-cron',
      type: 'cron_job',
      priority: 'medium',
      title: 'Daily Ecosystem Intelligence Run',
      description: 'Run ecosystem intelligence agent daily to capture suggestions.',
      implementation: 'Add to cron: 0 6 * * * cd $ZION_ROOT && node automation/ai-ecosystem-intelligence-agent.cjs run',
      benefit: 'Continuous improvement suggestions',
    });
  }

  // 10. Report aggregation (skip if agent exists)
  if (!analysis.agentNames.some((a) => a.includes('report-aggregator'))) {
    suggestions.push({
      id: 'report-aggregator',
      type: 'new_agent',
      priority: 'low',
      title: 'Report Aggregator Agent',
      description: 'Agent that aggregates all automation reports into a single dashboard JSON/HTML.',
      implementation: 'Create automation/ai-report-aggregator.cjs',
      cron: '0 7 * * *',
      benefit: 'Single view of ecosystem health',
    });
  }

  // 11. Outdated content detection in blog (skip if content-freshness has metadata-check)
  if (!analysis.agentNames.some((a) => a.includes('content-freshness'))) {
    suggestions.push({
      id: 'blog-date-check',
      type: 'enhancement',
      priority: 'medium',
      title: 'Blog Date Metadata Check',
      description: 'Ensure all blog posts have valid date metadata and suggest updates for posts >18 months old.',
      implementation: 'Add to ai-content-organizer or create dedicated script',
      benefit: 'Content relevance signals for SEO',
    });
  }

  // 12. Code hygiene agent (proactive lint/type fixes)
  if (!analysis.agentNames.some((a) => a.includes('code-hygiene'))) {
    suggestions.push({
      id: 'code-hygiene-agent',
      type: 'new_agent',
      priority: 'medium',
      title: 'Code Hygiene Agent',
      description: 'Proactive daily agent that runs lint:fix and type-check, commits auto-fixable changes.',
      implementation: 'Create automation/ai-code-hygiene-agent.cjs',
      cron: '30 5 * * *',
      benefit: 'Catches issues before CI',
    });
  }

  // 13. Cron health monitor
  if (!analysis.agentNames.some((a) => a.includes('cron-health'))) {
    suggestions.push({
      id: 'cron-health-monitor',
      type: 'new_agent',
      priority: 'low',
      title: 'Cron Health Monitor Agent',
      description: 'Verifies cron jobs have run recently by checking log file mtimes.',
      implementation: 'Create automation/ai-cron-health-monitor-agent.cjs',
      cron: '0 8 * * *',
      benefit: 'Detects missed cron runs',
    });
  }

  // 14. Documentation sync agent
  if (!analysis.agentNames.some((a) => a.includes('documentation-sync'))) {
    suggestions.push({
      id: 'documentation-sync-agent',
      type: 'new_agent',
      priority: 'low',
      title: 'Documentation Sync Agent',
      description: 'Keeps AI-SYSTEMS-OVERVIEW in sync with actual agents and workflows.',
      implementation: 'Create automation/ai-documentation-sync-agent.cjs',
      cron: '0 6 * * 5',
      benefit: 'Docs stay current with automation',
    });
  }

  // 15. Changelog generator
  if (!analysis.agentNames.some((a) => a.includes('changelog-generator'))) {
    suggestions.push({
      id: 'changelog-generator-agent',
      type: 'new_agent',
      priority: 'low',
      title: 'Changelog Generator Agent',
      description: 'Auto-generates CHANGELOG from git commits (conventional commits).',
      implementation: 'Create automation/ai-changelog-generator-agent.cjs',
      cron: '0 7 * * 5',
      benefit: 'Automated release notes',
    });
  }

  // 16. Dependency vulnerability alert
  if (!analysis.agentNames.some((a) => a.includes('dependency-vulnerability-alert'))) {
    suggestions.push({
      id: 'dependency-vulnerability-alert-agent',
      type: 'new_agent',
      priority: 'medium',
      title: 'Dependency Vulnerability Alert Agent',
      description: 'Runs npm audit, sends Telegram alert for high/critical vulnerabilities.',
      implementation: 'Create automation/ai-dependency-vulnerability-alert-agent.cjs',
      cron: '30 3 * * 0',
      benefit: 'Immediate visibility on critical vulns',
    });
  }

  // 17. Memory consolidation (per AGENTS.md)
  if (!analysis.agentNames.some((a) => a.includes('memory-consolidation'))) {
    suggestions.push({
      id: 'memory-consolidation-agent',
      type: 'new_agent',
      priority: 'low',
      title: 'Memory Consolidation Agent',
      description: 'Reads memory/YYYY-MM-DD.md files, updates MEMORY.md with distilled learnings.',
      implementation: 'Create automation/ai-memory-consolidation-agent.cjs',
      cron: '0 9 * * 0',
      benefit: 'Long-term memory maintenance',
    });
  }

  return suggestions;
}

function run() {
  ensureDirs();
  log('Starting ecosystem intelligence analysis...');

  const analysis = analyzeEcosystem();
  const cronContent = readFileSafe(CRON_FILE);
  const suggestions = generateSuggestions(analysis, cronContent);

  const report = {
    timestamp: new Date().toISOString(),
    analysis: {
      totalAgents: analysis.agents,
      totalWorkflows: analysis.workflows,
      totalCronJobs: analysis.cronJobs,
      automationScripts: analysis.npmScripts,
    },
    suggestions,
    summary: {
      totalSuggestions: suggestions.length,
      byPriority: {
        high: suggestions.filter((s) => s.priority === 'high').length,
        medium: suggestions.filter((s) => s.priority === 'medium').length,
        low: suggestions.filter((s) => s.priority === 'low').length,
      },
      byType: {
        new_agent: suggestions.filter((s) => s.type === 'new_agent').length,
        enhancement: suggestions.filter((s) => s.type === 'enhancement').length,
        cron_job: suggestions.filter((s) => s.type === 'cron_job').length,
        workflow: suggestions.filter((s) => s.type === 'workflow').length,
      },
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify({ suggestions, updatedAt: report.timestamp }, null, 2));

  log(`Analysis complete. ${suggestions.length} suggestions generated.`);
  log(`Report: ${REPORT_FILE}`);
  log(`Suggestions: ${SUGGESTIONS_FILE}`);

  return report;
}

// CLI
const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'suggestions') {
  const data = JSON.parse(readFileSafe(SUGGESTIONS_FILE, '{"suggestions":[]}'));
  console.log(JSON.stringify(data.suggestions, null, 2));
} else if (cmd === 'summary') {
  const report = JSON.parse(readFileSafe(REPORT_FILE, '{}'));
  console.log(JSON.stringify(report.summary, null, 2));
} else {
  console.log('Usage: node ai-ecosystem-intelligence-agent.cjs [run|suggestions|summary]');
  process.exit(1);
}
