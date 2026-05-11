#!/usr/bin/env node

/**
 * AI SEO Content Optimizer
 *
 * Uses OpenRouter LLM to analyze page components and improve:
 * - Meta titles and descriptions
 * - Heading hierarchy (h1–h6)
 * - Image alt text coverage
 * - Internal link density
 * - Structured data recommendations
 *
 * Outputs a report to automation/reports/ and optionally applies fixes.
 */

const fs = require('fs');
const path = require('path');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const CONFIG = {
  projectRoot: process.cwd(),
  appDir: path.join(process.cwd(), 'app'),
  reportsDir: path.join(process.cwd(), 'automation', 'reports'),
  logsDir: path.join(process.cwd(), 'automation', 'logs'),
  maxPagesPerRun: parseInt(process.env.SEO_MAX_PAGES || '15', 10),
  autoFix: process.env.SEO_AUTO_FIX === 'true',
  autoCommit: process.env.AUTO_COMMIT !== 'false',
  intervalMs: parseInt(process.env.SEO_INTERVAL_MS || '86400000', 10),
  canonical: 'https://ziontechgroup.com',
};

function ensureDirs() {
  [CONFIG.reportsDir, CONFIG.logsDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function log(msg, level = 'INFO') {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(
      path.join(CONFIG.logsDir, 'ai-seo-content-optimizer.log'),
      line + '\n',
    );
  } catch {
    /* ignore */
  }
}

function findPageFiles(dir, depth = 0) {
  if (depth > 4) return [];
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        results.push(...findPageFiles(full, depth + 1));
      }
      if (e.isFile() && e.name === 'page.tsx') {
        results.push(full);
      }
    }
  } catch {
    /* ignore */
  }
  return results;
}

function extractMeta(content) {
  const issues = [];

  const hasMetadata = /export\s+(const|async\s+function)\s+metadata/i.test(content) ||
    /generateMetadata/i.test(content);
  if (!hasMetadata) issues.push('missing_metadata_export');

  const titleMatch = content.match(/title:\s*['"`]([^'"`]*)['"`]/);
  if (!titleMatch) {
    issues.push('missing_title');
  } else if (titleMatch[1].length < 30 || titleMatch[1].length > 65) {
    issues.push(`title_length_${titleMatch[1].length}`);
  }

  const descMatch = content.match(/description:\s*['"`]([^'"`]*)['"`]/);
  if (!descMatch) {
    issues.push('missing_description');
  } else if (descMatch[1].length < 70 || descMatch[1].length > 160) {
    issues.push(`description_length_${descMatch[1].length}`);
  }

  const imgCount = (content.match(/<(?:Image|img)\s/g) || []).length;
  const altCount = (content.match(/alt\s*=\s*["'][^"']+["']/g) || []).length;
  if (imgCount > altCount) issues.push(`missing_alt_text_${imgCount - altCount}`);

  const h1Count = (content.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) issues.push('no_h1');
  if (h1Count > 1) issues.push(`multiple_h1_${h1Count}`);

  const hasOG = /openGraph/i.test(content);
  if (!hasOG) issues.push('missing_open_graph');

  return {
    hasMetadata,
    title: titleMatch ? titleMatch[1] : null,
    description: descMatch ? descMatch[1] : null,
    imgCount,
    altCount,
    h1Count,
    hasOG,
    issues,
  };
}

async function analyzeWithLLM(llm, pagePath, content, meta) {
  if (!llm.isConfigured()) return null;
  if (meta.issues.length === 0) return null;

  const relPath = path.relative(CONFIG.projectRoot, pagePath);
  const snippet = content.slice(0, 3000);

  const prompt = `Analyze this Next.js page for SEO issues and provide fixes.
Page: ${relPath}
Current issues detected: ${meta.issues.join(', ')}

Code snippet (first 3000 chars):
\`\`\`tsx
${snippet}
\`\`\`

Return a JSON object with:
- "suggestedTitle": optimal page title (50-60 chars)
- "suggestedDescription": optimal meta description (120-155 chars)  
- "recommendations": array of specific actionable recommendations
Keep it concise. Return ONLY valid JSON, no markdown fences.`;

  try {
    const raw = await llm.chat(prompt, {
      maxTokens: 1024,
      systemPrompt: 'You are an SEO specialist. Return only valid JSON.',
    });
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    log(`LLM analysis failed for ${relPath}: ${err.message}`, 'WARN');
    return null;
  }
}

async function run() {
  ensureDirs();
  log('🔍 AI SEO Content Optimizer starting...');

  const llm = createLLMClient({ appName: 'Zion SEO Optimizer' });
  log(`LLM provider: ${llm.getProviderInfo().provider} (configured: ${llm.isConfigured()})`);

  const pages = findPageFiles(CONFIG.appDir).slice(0, CONFIG.maxPagesPerRun);
  log(`Found ${pages.length} page files to analyze`);

  const report = {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    pagesWithIssues: 0,
    totalIssues: 0,
    issueBreakdown: {},
    pages: [],
  };

  for (const pagePath of pages) {
    const relPath = path.relative(CONFIG.projectRoot, pagePath);
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const meta = extractMeta(content);

      let llmSuggestions = null;
      if (meta.issues.length > 0) {
        report.pagesWithIssues++;
        report.totalIssues += meta.issues.length;
        meta.issues.forEach((i) => {
          const key = i.replace(/_\d+$/, '');
          report.issueBreakdown[key] = (report.issueBreakdown[key] || 0) + 1;
        });

        llmSuggestions = await analyzeWithLLM(llm, pagePath, content, meta);
      }

      report.pages.push({
        path: relPath,
        ...meta,
        llmSuggestions,
      });
    } catch (err) {
      log(`Error analyzing ${relPath}: ${err.message}`, 'ERROR');
    }
  }

  const reportPath = path.join(CONFIG.reportsDir, 'seo-content-optimizer-latest.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`✅ SEO report written to ${reportPath}`);
  log(`   Pages analyzed: ${report.totalPages}`);
  log(`   Pages with issues: ${report.pagesWithIssues}`);
  log(`   Total issues: ${report.totalIssues}`);

  return report;
}

if (require.main === module) {
  run()
    .then((r) => {
      log(`🏁 SEO Content Optimizer complete. ${r.totalIssues} issues found across ${r.pagesWithIssues} pages.`);
      process.exit(0);
    })
    .catch((err) => {
      log(`Fatal error: ${err.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { run };
