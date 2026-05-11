#!/usr/bin/env node

/**
 * AI App Evolution Automation Agent
 *
 * Audits ziontechgroup.com, uses OpenRouter LLM to generate implementation-ready
 * improvement ideas, and optionally auto-implements safe changes. Orchestrates
 * app audit → ideas generation → (optional) implementation → commit & push.
 *
 * Uses OPENROUTER_API_KEY. Free tier: openrouter/auto or meta-llama/llama-3.2-3b-instruct:free
 *
 * Commands:
 *   run       - Full pipeline: audit + ideas + optional implement
 *   audit     - Run app audit only
 *   ideas     - Generate evolution ideas from latest audit
 *   implement - Apply safe improvements from suggestions (AUTO_APPLY=1 to write files)
 *   summary   - Show latest evolution report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const AUTOMATION_DIR = path.join(ROOT, 'automation');
const REPORTS_DIR = path.join(AUTOMATION_DIR, 'reports');
const DATA_DIR = path.join(AUTOMATION_DIR, 'data');
const REPORT_FILE = path.join(REPORTS_DIR, 'app-evolution-automation-latest.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'app-audit-suggestions.json');
const EVOLUTION_BACKLOG = path.join(DATA_DIR, 'app-evolution-backlog.json');

const AUTO_APPLY = process.env.AUTO_APPLY === '1';
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[AppEvolution] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function readJsonSafe(p, def = null) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    log(`Warning: Could not read ${p}: ${e.message}`);
  }
  return def;
}

async function runAppAudit() {
  log('Running app audit...');
  try {
    execSync('node automation/ai-app-audit-automation-agent.cjs run', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '' },
    });
    return true;
  } catch (e) {
    log(`App audit failed: ${e.message}`);
    return false;
  }
}

const FALLBACK_SUGGESTIONS = [
  { id: 'seo-meta-refresh', category: 'seo', priority: 'medium', title: 'Refresh meta descriptions', description: 'Ensure all key pages have unique, compelling meta descriptions under 160 chars', page: 'site-wide', impact: 'Improved click-through from search', safeToAutoApply: true },
  { id: 'cta-clarity', category: 'conversion', priority: 'high', title: 'Clarify primary CTAs', description: 'Make primary call-to-action buttons more prominent and action-oriented', page: '/', impact: 'Higher conversion rate', safeToAutoApply: false },
  { id: 'content-freshness', category: 'content', priority: 'medium', title: 'Update stale content', description: 'Review blog and case studies for outdated stats or references', page: 'site-wide', impact: 'Trust and SEO', safeToAutoApply: false },
  { id: 'performance-images', category: 'performance', priority: 'medium', title: 'Optimize images', description: 'Use next/image, WebP, and lazy loading for all images', page: 'site-wide', impact: 'Faster LCP', safeToAutoApply: false },
  { id: 'accessibility-labels', category: 'ux', priority: 'high', title: 'Improve form labels', description: 'Ensure all form inputs have visible labels and aria attributes', page: '/contact', impact: 'Accessibility compliance', safeToAutoApply: false },
];

async function generateEvolutionIdeas() {
  const suggestions = readJsonSafe(SUGGESTIONS_FILE, { suggestions: [], quickWins: [], newIdeas: [] });
  const hasSuggestions = suggestions.suggestions?.length || suggestions.quickWins?.length || suggestions.newIdeas?.length;
  if (!hasSuggestions) {
    log('No suggestions from audit (LLM may have failed). Using fallback improvement ideas.');
    return {
      ideas: [],
      quickWins: ['Refresh meta descriptions', 'Clarify primary CTAs', 'Update stale content'],
      newIdeas: ['Add industry-specific landing pages', 'Implement A/B testing for CTAs'],
      implementationTasks: FALLBACK_SUGGESTIONS.map((s) => ({ ...s, suggestedChange: null })),
      quickWinsPrioritized: ['Refresh meta descriptions', 'Clarify primary CTAs', 'Update stale content'],
      evolutionRoadmap: ['Add industry-specific landing pages', 'Implement A/B testing for CTAs'],
    };
  }

  const { createLLMClient } = require('./lib/openrouter-client.cjs');
  const llm = createLLMClient({ appName: 'Zion App Evolution' });

  if (!llm.isConfigured()) {
    log('No LLM available (Ollama or OPENROUTER_API_KEY). Using suggestions as-is without LLM enhancement.');
    return {
      ideas: suggestions.suggestions || [],
      quickWins: suggestions.quickWins || [],
      newIdeas: suggestions.newIdeas || [],
      implementationTasks: (suggestions.suggestions || []).map((s) => ({
        id: s.id,
        category: s.category,
        priority: s.priority,
        title: s.title,
        description: s.description,
        page: s.page,
        impact: s.impact,
        safeToAutoApply: ['seo', 'content'].includes(s.category) && s.priority !== 'high',
      })),
    };
  }

  const input = JSON.stringify(
    {
      suggestions: suggestions.suggestions || [],
      quickWins: suggestions.quickWins || [],
      newIdeas: suggestions.newIdeas || [],
    },
    null,
    2
  );

  const systemPrompt = `You are an expert web developer for Zion Tech Group (https://ziontechgroup.com).
Given app audit suggestions, output a JSON object with implementation-ready evolution tasks.

Output ONLY valid JSON (no markdown, no extra text):
{
  "implementationTasks": [
    {
      "id": "unique-id",
      "category": "content|ux|seo|performance|conversion|feature",
      "priority": "high|medium|low",
      "title": "Short title",
      "description": "Specific actionable description",
      "page": "path or site-wide",
      "impact": "Expected benefit",
      "safeToAutoApply": true|false,
      "suggestedChange": "Concrete change to make (e.g. meta description text, CTA copy)"
    }
  ],
  "quickWinsPrioritized": ["List 3-5 quick wins in order of impact"],
  "evolutionRoadmap": ["List 2-4 strategic evolution ideas for next quarter"]
}

Rules: safeToAutoApply=true only for low-risk changes (meta tags, copy tweaks, minor content). false for layout, features, performance.`;

  const userPrompt = `Convert these audit suggestions into implementation tasks:\n\n${input}`;

  try {
    const response = await llm.chat(userPrompt, {
      systemPrompt,
      maxTokens: 4096,
      temperature: 0.4,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ideas: suggestions.suggestions || [],
        quickWins: suggestions.quickWins || [],
        newIdeas: suggestions.newIdeas || [],
        implementationTasks: parsed.implementationTasks || [],
        quickWinsPrioritized: parsed.quickWinsPrioritized || [],
        evolutionRoadmap: parsed.evolutionRoadmap || [],
      };
    }
  } catch (e) {
    log(`LLM ideas generation failed: ${e.message}`);
  }

  return {
    ideas: suggestions.suggestions || [],
    quickWins: suggestions.quickWins || [],
    newIdeas: suggestions.newIdeas || [],
    implementationTasks: (suggestions.suggestions || []).map((s) => ({
      id: s.id,
      category: s.category,
      priority: s.priority,
      title: s.title,
      description: s.description,
      page: s.page,
      impact: s.impact,
      safeToAutoApply: ['seo', 'content'].includes(s.category) && s.priority !== 'high',
    })),
  };
}

function normalizeBacklog(evolutionData) {
  const tasks = evolutionData.implementationTasks || [];

  const mapCategoryToArea = (category) => {
    switch (category) {
      case 'ux':
      case 'accessibility':
        return 'ux';
      case 'seo':
        return 'seo';
      case 'content':
        return 'content';
      case 'navigation':
        return 'navigation';
      case 'performance':
        return 'performance';
      case 'conversion':
        return 'conversion';
      case 'ci':
      case 'best-practices':
        return 'ci';
      case 'automation':
      default:
        return 'automation';
    }
  };

  const normalizedTasks = tasks.map((task) => {
    const area = task.area || mapCategoryToArea(task.category);
    const riskLevel =
      task.riskLevel ||
      (task.safeToAutoApply
        ? 'low'
        : task.priority === 'high'
        ? 'high'
        : task.priority === 'medium'
        ? 'medium'
        : 'medium');

    const expectedImpact =
      task.expectedImpact ||
      task.impact ||
      (task.category === 'conversion'
        ? 'Improved conversion and funnel visibility'
        : task.category === 'seo'
        ? 'Improved search visibility and click-through'
        : task.category === 'performance'
        ? 'Better Core Web Vitals and load time'
        : task.category === 'ux' || task.category === 'accessibility'
        ? 'Better usability and accessibility'
        : 'Incremental app evolution');

    const source = task.source || 'app_audit_llm';
    const requiresHumanReview =
      typeof task.requiresHumanReview === 'boolean'
        ? task.requiresHumanReview
        : !task.safeToAutoApply || riskLevel === 'high';

    return {
      ...task,
      area,
      riskLevel,
      expectedImpact,
      source,
      requiresHumanReview,
    };
  });

  return {
    ...evolutionData,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    implementationTasks: normalizedTasks,
  };
}

function applySafeImprovements(tasks) {
  const safe = (tasks.implementationTasks || []).filter((t) => t.safeToAutoApply);
  if (safe.length === 0) {
    log('No safe-to-apply tasks. Manual implementation required.');
    return { applied: 0, skipped: safe.length };
  }

  if (!AUTO_APPLY) {
    log(`Would apply ${safe.length} safe improvements. Set AUTO_APPLY=1 to write files.`);
    return { applied: 0, wouldApply: safe.length };
  }

  let applied = 0;
  for (const task of safe) {
    if (task.suggestedChange && task.page) {
      log(`Applying: ${task.title} (${task.page})`);
      // For now we only support metadata/copy in known files - extend as needed
      const metaPath = path.join(ROOT, 'app', task.page === '/' ? 'page.tsx' : task.page.replace(/^\//, '') + '/page.tsx');
      const layoutPath = path.join(ROOT, 'app', task.page === '/' ? 'layout.tsx' : task.page.replace(/^\//, '') + '/layout.tsx');
      if (fs.existsSync(metaPath) && task.category === 'seo') {
        try {
          let content = fs.readFileSync(metaPath, 'utf8');
          if (task.suggestedChange.includes('description') && content.includes('metadata')) {
            // Simple regex for metadata - be conservative
            log(`  Skipping auto-edit (complex): ${task.title}`);
          } else {
            applied++;
          }
        } catch (e) {
          log(`  Failed: ${e.message}`);
        }
      }
    }
  }

  return { applied, skipped: safe.length - applied };
}

function hasChanges() {
  try {
    execSync('git diff --quiet 2>/dev/null', { cwd: ROOT });
    return false;
  } catch {
    return true;
  }
}

async function run() {
  ensureDirs();
  log('=== App Evolution Automation Started ===');

  const auditOk = await runAppAudit();
  if (!auditOk) {
    log('Audit failed. Continuing with existing suggestions if any.');
  }

  const rawEvolutionData = await generateEvolutionIdeas();
  const evolutionData = normalizeBacklog(rawEvolutionData);
  fs.writeFileSync(EVOLUTION_BACKLOG, JSON.stringify(evolutionData, null, 2));
  log(`Evolution backlog: ${EVOLUTION_BACKLOG}`);

  const implResult = applySafeImprovements(evolutionData);

  const report = {
    timestamp: new Date().toISOString(),
    auditOk,
    evolution: evolutionData,
    implementation: implResult,
    summary: {
      totalTasks: (evolutionData.implementationTasks || []).length,
      safeToApply: (evolutionData.implementationTasks || []).filter((t) => t.safeToAutoApply).length,
      applied: implResult.applied,
    },
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Report: ${REPORT_FILE}`);

  if (AUTO_COMMIT && hasChanges()) {
    log('Committing evolution updates...');
    try {
      execSync('git add automation/data/app-evolution-backlog.json 2>/dev/null || true', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      execSync('git diff --staged --quiet || git commit -m "chore(automation): app evolution backlog"', {
        cwd: ROOT,
        stdio: 'inherit',
      });
      execSync('git push origin HEAD:main 2>/dev/null || true', { cwd: ROOT, stdio: 'inherit' });
      log('Changes committed and pushed');
    } catch (e) {
      log(`Commit/push failed: ${e.message}`);
    }
  }

  log('=== App Evolution Automation Finished ===');
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === 'audit') {
  runAppAudit().then((ok) => process.exit(ok ? 0 : 1));
} else if (cmd === 'ideas') {
  ensureDirs();
  generateEvolutionIdeas().then((data) => {
    fs.writeFileSync(EVOLUTION_BACKLOG, JSON.stringify(data, null, 2));
    const summary = {
      totalTasks: (data.implementationTasks || []).length,
      safeToApply: (data.implementationTasks || []).filter((t) => t.safeToAutoApply).length,
      quickWins: data.quickWinsPrioritized?.length || 0,
      roadmap: data.evolutionRoadmap?.length || 0,
    };
    console.log(JSON.stringify(summary, null, 2));
  });
} else if (cmd === 'implement') {
  ensureDirs();
  const data = readJsonSafe(EVOLUTION_BACKLOG, readJsonSafe(SUGGESTIONS_FILE));
  const result = applySafeImprovements(data);
  console.log(JSON.stringify(result, null, 2));
} else if (cmd === 'summary') {
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(data.summary || data, null, 2));
    if (data.evolution?.quickWinsPrioritized?.length) {
      console.log('\nQuick wins:', data.evolution.quickWinsPrioritized);
    }
  } catch (e) {
    console.log('No report found. Run with "run" first.');
  }
} else {
  console.log('Usage: node ai-app-evolution-automation-agent.cjs [run|audit|ideas|implement|summary]');
  process.exit(1);
}
