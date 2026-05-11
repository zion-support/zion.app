#!/usr/bin/env node

/**
 * AI Layout & Design Audit Agent
 *
 * Audits https://ziontechgroup.com layout and design using OpenRouter LLM.
 * Fetches live site HTML, analyzes codebase layout files, and generates
 * actionable improvement suggestions. Optionally applies fixes via LLM-generated code.
 *
 * Features:
 * - Fetches live production HTML for visual/layout audit
 * - Analyzes app/layout.tsx, key components, globals.css
 * - Uses OpenRouter (openrouter/auto:free) for LLM-powered audit
 * - Generates JSON report with prioritized suggestions
 * - Optional AUTO_APPLY=1 to apply safe fixes
 *
 * Environment:
 *   Ollama (primary): ollama serve, ollama pull llama3.2:3b
 *   OPENROUTER_API_KEY - Fallback when Ollama unavailable
 *   LAYOUT_AUDIT_URL   - URL to audit (default: https://ziontechgroup.com)
 *   AUTO_APPLY         - Set to 1 to apply fixes (default: 0)
 *
 * Runs: Weekly via cron | On-demand
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const LOGS_DIR = path.join(ROOT, 'automation', 'logs');
const REPORT_FILE = path.join(REPORTS_DIR, 'layout-design-audit-latest.json');
const LOG_FILE = path.join(LOGS_DIR, 'layout-design-audit.log');

const SITE_URL = process.env.LAYOUT_AUDIT_URL || 'https://ziontechgroup.com';
const AUTO_APPLY = process.env.AUTO_APPLY === '1';

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[LayoutDesignAudit] ${ts} | ${msg}`;
  console.log(line);
  try {
    if (!fs.existsSync(path.dirname(LOG_FILE))) {
      fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    }
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (err) {
    console.error('Failed to write log:', err.message);
  }
}

function ensureDirs() {
  [REPORTS_DIR, LOGS_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname || '/',
      method: 'GET',
      headers: { 'User-Agent': 'Zion-Layout-Audit/1.0' },
      timeout: 15000,
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

function readFileSafe(p, def = '') {
  try {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return def;
  }
  return def;
}

function collectCodebaseContext() {
  const files = [
    ['app/layout.tsx', 'Root layout'],
    ['app/page.tsx', 'Homepage'],
    ['app/components/Navigation.tsx', 'Navigation component'],
    ['app/components/Header.tsx', 'Header component'],
    ['app/components/Footer.tsx', 'Footer component'],
    ['app/globals.css', 'Global styles'],
  ];
  const context = [];
  for (const [relPath, label] of files) {
    const fullPath = path.join(ROOT, relPath);
    const content = readFileSafe(fullPath);
    if (content) {
      context.push(`\n--- ${label} (${relPath}) ---\n${content.slice(0, 6000)}`);
    }
  }
  return context.join('\n');
}

/** If present, load live-site UX audit report and return a string for prompt context. */
function loadLiveSiteUXContext() {
  const uxReportPath = path.join(REPORTS_DIR, 'live-site-ux-audit-latest.json');
  if (!fs.existsSync(uxReportPath)) return '';
  try {
    const data = JSON.parse(fs.readFileSync(uxReportPath, 'utf8'));
    if (data.error) return '';
    const lines = [
      '## Live-site UX audit (recent run):',
      `Score: ${data.score ?? 'N/A'}/100 (${data.passed ?? 0}/${data.total ?? 0} checks)`,
      ...(data.ideas && data.ideas.length ? ['Ideas:', ...data.ideas.map((i) => `- ${i}`)] : []),
      ...(data.checks && data.checks.length
        ? ['Checks:', ...data.checks.filter((c) => !c.ok).map((c) => `- ${c.id}: ${c.detail}`)]
        : []),
    ];
    return lines.join('\n');
  } catch (e) {
    return '';
  }
}

async function runLLMAudit(htmlSnippet, codebaseContext) {
  const llm = createLLMClient();

  if (!llm.isConfigured()) {
    return null; // Caller will fallback to heuristic
  }

  const systemPrompt = `You are an expert UI/UX and frontend design auditor for a Next.js 15 App Router website.
Your task is to audit the layout and design of ziontechgroup.com and provide actionable, prioritized improvement suggestions.
Focus on: layout structure, responsive design, spacing/typography consistency, visual hierarchy, accessibility (a11y),
mobile-first design, CSS/Tailwind usage, component structure, and performance (CLS, layout shifts).
Be specific: reference file paths, component names, and provide concrete code-level suggestions.
Output valid JSON only, no markdown code fences.`;

  const userPrompt = `Audit the layout and design of this website.

## Live homepage HTML (first ~8000 chars):
${htmlSnippet}

## Codebase context (layout and key components):
${codebaseContext}
${loadLiveSiteUXContext() ? '\n' + loadLiveSiteUXContext() + '\n' : ''}

Return a JSON object with this exact structure:
{
  "summary": "1-2 sentence overall assessment",
  "healthScore": 0-100,
  "suggestions": [
    {
      "id": "unique-id",
      "priority": "critical|high|medium|low",
      "category": "layout|responsive|typography|spacing|accessibility|performance|visual-hierarchy|css",
      "title": "Short title",
      "description": "Detailed description",
      "file": "path/to/file or null",
      "action": "Specific actionable fix",
      "codeSnippet": "Optional code fix if applicable"
    }
  ]
}`;

  const response = await llm.chat(userPrompt, {
    systemPrompt,
    maxTokens: 4096,
    temperature: 0.3,
  });

  // Parse JSON from response (handle markdown code blocks if present)
  let jsonStr = response.trim();
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) jsonStr = jsonMatch[0];
  return JSON.parse(jsonStr);
}

/**
 * Local heuristic audit when LLM is unavailable.
 * Analyzes codebase for common layout/design issues.
 */
function runLocalHeuristicAudit(codebaseContext) {
  const suggestions = [];
  let healthScore = 85;

  const layoutPath = path.join(ROOT, 'app', 'layout.tsx');
  const globalsPath = path.join(ROOT, 'app', 'globals.css');
  const tailwindPath = path.join(ROOT, 'tailwind.config.ts');

  const layoutContent = readFileSafe(layoutPath);
  const globalsContent = readFileSafe(globalsPath);
  const tailwindContent = readFileSafe(tailwindPath);

  // Font display swap
  if (layoutContent && !layoutContent.includes("display: 'swap'") && layoutContent.includes('Inter(')) {
    suggestions.push({
      id: 'font-display-swap',
      priority: 'high',
      category: 'performance',
      title: 'Add font display swap',
      description: 'Prevent FOUT by adding display: swap to Inter font',
      file: 'app/layout.tsx',
      action: "Add display: 'swap' to Inter({ subsets: ['latin'] })",
      codeSnippet: "Inter({ subsets: ['latin'], display: 'swap' })",
    });
    healthScore -= 3;
  }

  // Section spacing token
  if (tailwindContent && !tailwindContent.includes("section:")) {
    suggestions.push({
      id: 'section-spacing-token',
      priority: 'medium',
      category: 'spacing',
      title: 'Add section spacing token',
      description: 'Add consistent section spacing (4rem) to Tailwind theme',
      file: 'tailwind.config.ts',
      action: 'Add spacing.section: 4rem to theme.extend',
      codeSnippet: "spacing: { section: '4rem' }",
    });
    healthScore -= 2;
  }

  // Typography scale in globals
  if (globalsContent && !globalsContent.includes('--font-size-base') && !globalsContent.includes('--line-height-tight')) {
    suggestions.push({
      id: 'typography-scale',
      priority: 'medium',
      category: 'typography',
      title: 'Add typography scale variables',
      description: 'Add CSS custom properties for consistent typography',
      file: 'app/globals.css',
      action: 'Add --font-size-* and --line-height-* to :root',
      codeSnippet: null,
    });
    healthScore -= 2;
  }

  // Image aspect-ratio for CLS
  if (globalsContent && !globalsContent.includes('aspect-ratio')) {
    suggestions.push({
      id: 'image-aspect-ratio',
      priority: 'low',
      category: 'performance',
      title: 'Add image aspect-ratio defaults',
      description: 'Reduce CLS by reserving space for images',
      file: 'app/globals.css',
      action: 'Add img { aspect-ratio: auto } or container defaults',
      codeSnippet: null,
    });
    healthScore -= 1;
  }

  // Container padding consistency
  const hasContainerUtility = globalsContent && globalsContent.includes('.container-page');
  if (codebaseContext && (codebaseContext.includes('px-2 ') || codebaseContext.includes('px-3 '))) {
    suggestions.push({
      id: 'container-padding',
      priority: 'low',
      category: 'layout',
      title: hasContainerUtility
        ? 'Prefer shared container-page utility for primary layout wrappers'
        : 'Standardize container padding',
      description: hasContainerUtility
        ? 'Use the .container-page utility for main page containers instead of ad-hoc px-2/px-3 padding where appropriate.'
        : 'Use consistent px-4 sm:px-6 lg:px-8 for main containers',
      file: hasContainerUtility ? 'app/globals.css' : null,
      action: hasContainerUtility
        ? 'Audit sections using small horizontal padding (px-2/px-3) and migrate primary wrappers to the .container-page utility.'
        : 'Audit components for inconsistent padding and converge on a standard container pattern.',
      codeSnippet: hasContainerUtility ? 'className=\"container-page ...\"' : null,
    });
    healthScore -= 1;
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 'audit-ok',
      priority: 'low',
      category: 'layout',
      title: 'Layout design in good shape',
      description: 'Local heuristic found no critical issues. Start Ollama or set OPENROUTER_API_KEY for LLM audit.',
      file: null,
      action: null,
      codeSnippet: null,
    });
  }

  return {
    summary: `Local heuristic audit: ${suggestions.length} suggestion(s). Start Ollama or set OPENROUTER_API_KEY for LLM audit.`,
    healthScore: Math.max(0, Math.min(100, healthScore)),
    suggestions,
  };
}

function run() {
  ensureDirs();
  log('Starting layout & design audit...');
  log(`URL: ${SITE_URL}`);

  return (async () => {
    let htmlSnippet = '';
    try {
      htmlSnippet = await fetchUrl(SITE_URL);
      htmlSnippet = htmlSnippet.slice(0, 8000);
      log('Fetched live HTML');
    } catch (err) {
      log(`Warning: Could not fetch live HTML: ${err.message}`);
      htmlSnippet = '(Live fetch failed - using codebase only)';
    }

    const codebaseContext = collectCodebaseContext();
    log('Collected codebase context');

    let auditResult;
    try {
      auditResult = await runLLMAudit(htmlSnippet, codebaseContext);
      if (auditResult) {
        log('LLM audit complete');
      } else {
        log('No LLM available. Running local heuristic audit fallback...');
        auditResult = runLocalHeuristicAudit(codebaseContext);
      }
    } catch (err) {
      log(`LLM audit failed: ${err.message}`);
      log('Running local heuristic audit fallback...');
      auditResult = runLocalHeuristicAudit(codebaseContext);
    }

    const report = {
      timestamp: new Date().toISOString(),
      url: SITE_URL,
      summary: auditResult.summary,
      healthScore: auditResult.healthScore,
      suggestions: auditResult.suggestions || [],
      autoApply: AUTO_APPLY,
      appliedFixes: [],
    };

    if (AUTO_APPLY && auditResult.suggestions?.length > 0) {
      log('AUTO_APPLY=1: Applying safe fixes...');
      for (const s of auditResult.suggestions.slice(0, 5)) {
        if (s.priority === 'critical' || s.priority === 'high') {
          if (s.file && s.codeSnippet) {
            try {
              const fullPath = path.join(ROOT, s.file);
              if (fs.existsSync(fullPath)) {
                // For now, we only log - full code application would need careful parsing
                log(`Would apply fix to ${s.file}: ${s.title}`);
                report.appliedFixes.push({ file: s.file, title: s.title, status: 'logged' });
              }
            } catch (e) {
              log(`Could not apply fix: ${e.message}`);
            }
          }
        }
      }
    }

    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    log(`Report saved: ${REPORT_FILE}`);
    log(`Health: ${report.healthScore ?? 'N/A'}, Suggestions: ${report.suggestions.length}`);
    return report;
  })();
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run()
    .then((r) => {
      if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
    })
    .catch((err) => {
      log(`Fatal: ${err.message}`);
      process.exit(1);
    });
} else if (cmd === 'summary') {
  let data = {};
  try {
    if (fs.existsSync(REPORT_FILE)) {
      data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    }
  } catch (e) {
    /* ignore */
  }
  console.log(
    JSON.stringify(
      {
        healthScore: data.healthScore,
        summary: data.summary,
        suggestionCount: (data.suggestions || []).length,
      },
      null,
      2
    )
  );
} else {
  console.log(`
AI Layout & Design Audit Agent

Usage:
  node ai-layout-design-audit-agent.cjs run        - Run full audit
  node ai-layout-design-audit-agent.cjs run --json - Run and output JSON
  node ai-layout-design-audit-agent.cjs summary    - Show summary of latest report

Environment:
  Ollama (primary) or OPENROUTER_API_KEY - For LLM audit
  LAYOUT_AUDIT_URL    - URL to audit (default: https://ziontechgroup.com)
  AUTO_APPLY=1        - Apply fixes (experimental)
`);
  process.exit(1);
}
