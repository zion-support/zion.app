#!/usr/bin/env node

/**
 * AI Changelog Generator
 *
 * Reads recent git commits and uses OpenRouter LLM to produce
 * human-readable, categorized changelogs for releases.
 *
 * Categories: Features, Fixes, Performance, Security, Automation, Docs, Chores
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLLMClient } = require('./lib/openrouter-client.cjs');

const CONFIG = {
  projectRoot: process.cwd(),
  reportsDir: path.join(process.cwd(), 'automation', 'reports'),
  logsDir: path.join(process.cwd(), 'automation', 'logs'),
  maxCommits: parseInt(process.env.CHANGELOG_MAX_COMMITS || '50', 10),
  sinceDays: parseInt(process.env.CHANGELOG_SINCE_DAYS || '7', 10),
  outputFile: process.env.CHANGELOG_OUTPUT || 'CHANGELOG_LATEST.md',
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
      path.join(CONFIG.logsDir, 'ai-changelog-generator.log'),
      line + '\n',
    );
  } catch {
    /* ignore */
  }
}

function getRecentCommits() {
  const since = new Date();
  since.setDate(since.getDate() - CONFIG.sinceDays);
  const sinceStr = since.toISOString().split('T')[0];

  try {
    const raw = execSync(
      `git log --since="${sinceStr}" --pretty=format:"%h|%s|%an|%ai" -n ${CONFIG.maxCommits}`,
      { cwd: CONFIG.projectRoot, encoding: 'utf8', timeout: 15000 },
    );
    if (!raw.trim()) return [];

    return raw
      .trim()
      .split('\n')
      .map((line) => {
        const [hash, subject, author, date] = line.split('|');
        return { hash, subject, author, date };
      });
  } catch (err) {
    log(`Git log failed: ${err.message}`, 'ERROR');
    return [];
  }
}

function categorizeLocally(commits) {
  const categories = {
    features: [],
    fixes: [],
    performance: [],
    security: [],
    automation: [],
    docs: [],
    chores: [],
  };

  for (const c of commits) {
    const s = c.subject.toLowerCase();
    if (s.startsWith('feat')) categories.features.push(c);
    else if (s.startsWith('fix')) categories.fixes.push(c);
    else if (s.includes('perf') || s.includes('optim')) categories.performance.push(c);
    else if (s.includes('secur') || s.includes('vuln')) categories.security.push(c);
    else if (s.includes('automat') || s.includes('agent') || s.includes('ci')) categories.automation.push(c);
    else if (s.startsWith('doc') || s.includes('readme')) categories.docs.push(c);
    else categories.chores.push(c);
  }
  return categories;
}

function buildBasicChangelog(categories, dateRange) {
  const lines = [`# Changelog — ${dateRange}\n`];
  const icons = {
    features: '🚀 Features',
    fixes: '🐛 Bug Fixes',
    performance: '⚡ Performance',
    security: '🔒 Security',
    automation: '🤖 Automation',
    docs: '📝 Documentation',
    chores: '🔧 Chores',
  };

  for (const [key, label] of Object.entries(icons)) {
    const items = categories[key];
    if (items.length === 0) continue;
    lines.push(`\n## ${label}\n`);
    for (const c of items) {
      lines.push(`- ${c.subject} (\`${c.hash}\`)`);
    }
  }

  return lines.join('\n') + '\n';
}

async function enhanceWithLLM(llm, commits, basicChangelog) {
  if (!llm.isConfigured() || commits.length === 0) return null;

  const commitList = commits
    .map((c) => `${c.hash} ${c.subject}`)
    .join('\n');

  const prompt = `You are a technical writer. Given these git commits, produce a polished, user-facing changelog in Markdown.

Group into: Features, Bug Fixes, Performance, Security, Automation, Documentation, Other.
For each item write a clear one-sentence summary (no commit hashes). Add a brief intro paragraph.

Commits:
${commitList}

Return ONLY the Markdown changelog, no fences.`;

  try {
    const enhanced = await llm.chat(prompt, {
      maxTokens: 2048,
      systemPrompt:
        'You are a release-notes writer for Zion Tech Group. Write concise, professional changelogs.',
    });
    return enhanced;
  } catch (err) {
    log(`LLM enhancement failed: ${err.message}`, 'WARN');
    return null;
  }
}

async function run() {
  ensureDirs();
  log('📝 AI Changelog Generator starting...');

  const llm = createLLMClient({ appName: 'Zion Changelog Generator' });
  const commits = getRecentCommits();
  log(`Found ${commits.length} commits in the last ${CONFIG.sinceDays} days`);

  if (commits.length === 0) {
    log('No commits found in the date range. Exiting.');
    return;
  }

  const categories = categorizeLocally(commits);
  const today = new Date().toISOString().split('T')[0];
  const since = new Date();
  since.setDate(since.getDate() - CONFIG.sinceDays);
  const dateRange = `${since.toISOString().split('T')[0]} to ${today}`;

  const basicChangelog = buildBasicChangelog(categories, dateRange);
  const enhanced = await enhanceWithLLM(llm, commits, basicChangelog);

  const finalChangelog = enhanced || basicChangelog;
  const outPath = path.join(CONFIG.projectRoot, CONFIG.outputFile);
  fs.writeFileSync(outPath, finalChangelog);
  log(`✅ Changelog written to ${outPath}`);

  const reportPath = path.join(CONFIG.reportsDir, 'changelog-generator-latest.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        dateRange,
        totalCommits: commits.length,
        categories: Object.fromEntries(
          Object.entries(categories).map(([k, v]) => [k, v.length]),
        ),
        llmEnhanced: !!enhanced,
      },
      null,
      2,
    ),
  );

  log(`📊 Report saved to ${reportPath}`);
}

if (require.main === module) {
  run()
    .then(() => {
      log('🏁 Changelog generation complete.');
      process.exit(0);
    })
    .catch((err) => {
      log(`Fatal error: ${err.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { run };
