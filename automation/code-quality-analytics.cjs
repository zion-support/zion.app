#!/usr/bin/env node
/**
 * Code Quality & Complexity Analytics
 * Static analysis of codebase: cyclomatic complexity, LOC, duplication, maintainability
 * Uses ESLint programmatic API + custom metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'code-quality');
const LOG_FILE = path.join(STATE_DIR, 'code-quality.log');
const HISTORY_FILE = path.join(STATE_DIR, 'history.json');
const REPORT_FILE = path.join(STATE_DIR, 'latest-report.json');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '8435383377';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Thresholds
const MAX_COMPLEXITY_PER_FUNCTION = 15; // warning
const CRITICAL_COMPLEXITY_PER_FUNCTION = 25; // fail
const MAX_FILE_LOC = 500; // warning
const CRITICAL_FILE_LOC = 1000; // fail
const MAX_DUPLICATE_BLOCKS = 3; // issue if >3 similar blocks
const MAINTAINABILITY_INDEX_DROP_WARN = 5; // points drop
const MAINTAINABILITY_INDEX_DROP_CRITICAL = 10;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function ensureFiles() {
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify({ files: {}, global: {} }, null, 2));
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch { return { files: {}, global: {} }; }
}

function saveHistory(hist) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2));
}

// Get all code files to analyze
function getCodeFiles() {
  const patterns = [
    'app/**/*.ts',
    'app/**/*.tsx',
    'components/**/*.ts',
    'components/**/*.tsx',
    'automation/**/*.cjs',
    'scripts/**/*.sh',
    'lib/**/*.js',
  ];
  const files = [];
  for (const pattern of patterns) {
    try {
      const found = execSync(`find ${ROOT}/${pattern} -type f 2>/dev/null || true`, { shell: true }).toString().trim().split('\n').filter(Boolean);
      files.push(...found.map(f => f.replace(ROOT + '/', '')));
    } catch (e) { /* ignore */ }
  }
  return files.filter(f => !f.includes('node_modules') && !f.includes('.next'));
}

// Cyclomatic complexity per function (approximation)
function analyzeComplexity(content) {
  // Count decision points: if, for, while, do, switch, catch, ?:, ||, &&
  const decisionPoints = (content.match(/\b(if|for|while|do|switch|catch)\b/g) || []).length;
  const ternaryOps = (content.match(/\?|:/g) || []).length; // approximate
  const logicalOps = (content.match(/(&&|\|\|)/g) || []).length;
  const complexity = 1 + decisionPoints + Math.floor(ternaryOps / 2) + Math.floor(logicalOps / 2);

  // Count functions
  const functionMatches = content.match(/\b(function|const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|export\s+async\s+function|export\s+function)\b/g) || [];
  const functionCount = functionMatches.length;

  // LOC (non-blank, non-comment)
  const lines = content.split('\n');
  const codeLines = lines.filter(l => l.trim() !== '' && !l.trim().startsWith('//') && !l.trim().startsWith('#')).length;

  return { complexity, functionCount, codeLines };
}

// Duplicate detection via fingerprinting (simplified)
function detectDuplicates(files) {
  // Read all files, create fingerprints of blocks (e.g., 5-line windows)
  const blockSize = 5;
  const fingerprints = new Map(); // hash → {files: [], count}
  const fileHashes = new Map(); // file → Set of block hashes

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      const lines = content.split('\n');
      if (lines.length < blockSize) continue;

      const fileBlocks = new Set();
      for (let i = 0; i <= lines.length - blockSize; i++) {
        const block = lines.slice(i, i + blockSize).map(l => l.trim()).join('|');
        // Simple hash: length + first 50 chars
        const hash = `${block.length}:${block.slice(0, 50)}`;
        if (!fingerprints.has(hash)) fingerprints.set(hash, { files: [], count: 0 });
        fingerprints.get(hash).files.push(file);
        fingerprints.get(hash).count++;
        fileBlocks.add(hash);
      }
      fileHashes.set(file, fileBlocks);
    } catch (e) {
      // ignore unreadable
    }
  }

  // Find blocks that appear in multiple files or multiple times within same file
  const duplicates = [];
  for (const [hash, data] of fingerprints.entries()) {
    if (data.count > 1) {
      // Count distinct files
      const distinctFiles = [...new Set(data.files)];
      duplicates.push({ hash, count: data.count, files: distinctFiles });
    }
  }

  // Filter to significant ones (appear in ≥2 files or ≥3 times total)
  return duplicates.filter(d => d.files.length >= 2 || d.count >= 3);
}

// Maintainability Index (MI) approximation: MI = 171 - 0.69*log(cyclomatic complexity) - 0.32*log(LOC) - 0.23*log(comment density)
function calculateMI(complexity, loc, commentDensity) {
  // Avoid log(0)
  const c = Math.max(1, complexity);
  const l = Math.max(1, loc);
  const d = Math.max(0.01, commentDensity);
  const mi = 171 - 0.69 * Math.log(c) - 0.32 * Math.log(l) - 0.23 * Math.log(d * 100 + 1); // scaling
  return Math.max(0, Math.min(100, mi));
}

async function main() {
  ensureFiles();
  log('🔧 Starting Code Quality Analytics...');

  const files = getCodeFiles();
  log(`📁 Analyzing ${files.length} code files`);

  const results = [];
  let totalComplexity = 0;
  let totalLOC = 0;
  let totalFunctions = 0;
  let highComplexityFiles = 0;
  let largeFiles = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      const analysis = analyzeComplexity(content);
      const commentLines = content.split('\n').filter(l => l.trim().startsWith('//') || l.trim().startsWith('#')).length;
      const commentDensity = content.split('\n').length > 0 ? commentLines / content.split('\n').length : 0;
      const mi = calculateMI(analysis.complexity, analysis.codeLines, commentDensity);

      const fileResult = {
        file,
        complexity: analysis.complexity,
        functions: analysis.functionCount,
        loc: analysis.codeLines,
        commentDensity: Math.round(commentDensity * 100),
        maintainabilityIndex: Math.round(mi),
      };

      results.push(fileResult);

      totalComplexity += analysis.complexity;
      totalLOC += analysis.codeLines;
      totalFunctions += analysis.functionCount;

      if (analysis.complexity * (analysis.functionCount || 1) > CRITICAL_COMPLEXITY_PER_FUNCTION) highComplexityFiles++;
      if (analysis.codeLines > CRITICAL_FILE_LOC) largeFiles++;
    } catch (e) {
      log(`⚠️ Error reading ${file}: ${e.message}`);
    }
  }

  // Duplicate detection (expensive, run on all files)
  log('🔍 Scanning for code duplication...');
  const duplicates = detectDuplicates(files);
  log(`   Found ${duplicates.length} duplicate blocks`);

  // Aggregate metrics
  const avgComplexity = totalFunctions > 0 ? (totalComplexity / totalFunctions).toFixed(2) : 0;
  const avgMI = results.length > 0 ? (results.reduce((a, b) => a + b.maintainabilityIndex, 0) / results.length).toFixed(1) : 0;

  log(`📊 Total LOC: ${totalLOC}, Functions: ${totalFunctions}`);
  log(`   Avg cyclomatic complexity: ${avgComplexity}`);
  log(`   Avg Maintainability Index: ${avgMI}`);
  log(`   High-complexity files: ${highComplexityFiles}, Large files (>${CRITICAL_FILE_LOC}LOC): ${largeFiles}`);

  // Update history
  const history = loadHistory();
  const todayKey = new Date().toISOString().slice(0, 10);

  // Global snapshot
  history.global[todayKey] = {
    files: results.length,
    totalLOC: totalLOC,
    totalFunctions,
    avgComplexity: parseFloat(avgComplexity),
    avgMI: parseFloat(avgMI),
    highComplexityFiles,
    largeFiles,
    duplicateBlocks: duplicates.length,
  };

  // Per-file history (only keep summary)
  for (const r of results) {
    if (!history.files[r.file]) history.files[r.file] = { firstSeen: todayKey, history: {} };
    history.files[r.file].history[todayKey] = {
      complexity: r.complexity,
      loc: r.loc,
      mi: r.maintainabilityIndex,
    };
    // Keep last 90 days
    const days = Object.keys(history.files[r.file].history).sort();
    if (days.length > 90) {
      const toRemove = days.slice(0, days.length - 90);
      for (const d of toRemove) delete history.files[r.file].history[d];
    }
  }

  // Keep global last 365 days
  const globalDays = Object.keys(history.global).sort();
  if (globalDays.length > 365) {
    const toRemove = globalDays.slice(0, globalDays.length - 365);
    for (const d of toRemove) delete history.global[d];
  }

  saveHistory(history);

  // Build report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesAnalyzed: results.length,
      totalLOC,
      totalFunctions,
      avgComplexity: parseFloat(avgComplexity),
      avgMaintainabilityIndex: parseFloat(avgMI),
      highComplexityFiles,
      largeFiles,
      duplicateBlocks: duplicates.length,
    },
    files: results.sort((a, b) => b.complexity - a.complexity), // highest complexity first
    duplicates: duplicates.slice(0, 20), // top 20 duplicate blocks
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // Alerts
  if (TELEGRAM_TOKEN) {
    await sendTelegram(report);
  }

  // GitHub issue for degradation
  const shouldIssue = report.summary.highComplexityFiles >= 3 || report.summary.largeFiles >= 2 || report.summary.duplicateBlocks >= MAX_DUPLICATE_BLOCKS;
  if (shouldIssue && GITHUB_TOKEN) {
    await createGitHubIssue(report);
  }

  log('✅ Code quality analytics complete');
}

async function sendTelegram(report) {
  const https = require('https');
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `🔧 *Code Quality Analytics* — ${now}\n`;
  text += `Repo: ${ROOT.split('/').pop()}\n\n`;

  text += `📊 Files: ${report.summary.filesAnalyzed} | LOC: ${report.summary.totalLOC}\n`;
  text += `   Avg complexity: ${report.summary.avgComplexity} | MI: ${report.summary.avgMaintainabilityIndex}/100\n`;

  if (report.summary.highComplexityFiles > 0) text += `🚨 High-complexity files: ${report.summary.highComplexityFiles}\n`;
  if (report.summary.largeFiles > 0) text += `📏 Large files (>${CRITICAL_FILE_LOC}LOC): ${report.summary.largeFiles}\n`;
  if (report.summary.duplicateBlocks > 0) text += `📋 Duplicate code blocks: ${report.summary.duplicateBlocks}\n`;

  text += '\nTop 5 most complex files:\n';
  report.files.slice(0, 5).forEach(f => {
    text += `• ${f.file}: comp=${f.complexity}, LOC=${f.loc}, MI=${f.maintainabilityIndex}\n`;
  });

  text += '\nDetails: .hermes/memory/code-quality/latest-report.json';

  const payload = new URLSearchParams({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.byteLength },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`HTTP ${res.statusCode}: ${body}`))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
  log('✅ Telegram alert sent');
}

async function createGitHubIssue(report) {
  const title = `🚨 Code Quality Degradation — ${new Date().toLocaleDateString()} — ${report.summary.highComplexityFiles} complex, ${report.summary.largeFiles} large, ${report.summary.duplicateBlocks} duplicates`;
  const body = [
    '## Code Quality Analytics Report',
    '',
    `**Run:** ${new Date().toISOString()}`,
    `**Files analyzed:** ${report.summary.filesAnalyzed}`,
    `**Total LOC:** ${report.summary.totalLOC}`,
    `**Average Maintainability Index:** ${report.summary.avgMaintainabilityIndex}/100`,
    '',
    '### Issues Detected',
    report.summary.highComplexityFiles > 0 ? `- **${report.summary.highComplexityFiles}** files with high cyclomatic complexity (functions >15)` : '',
    report.summary.largeFiles > 0 ? `- **${report.summary.largeFiles}** files exceeding ${CRITICAL_FILE_LOC} LOC` : '',
    report.summary.duplicateBlocks > 0 ? `- **${report.summary.duplicateBlocks}** duplicate code blocks detected` : '',
    '',
    '### Most Complex Files',
    ...report.files.slice(0, 10).map(f => `- [${f.file}](${BASE_URL}blob/main/${f.file}): complexity=${f.complexity}, LOC=${f.loc}, MI=${f.maintainabilityIndex}`),
    '',
    '### Remediation',
    '- **Refactor high-complexity functions**: split into smaller units, reduce branching',
    '- **Break up large files**: extract modules, single responsibility',
    '- **Eliminate duplication**: extract shared utilities',
    '- **Add comments** to complex logic to improve maintainability',
    '- Consider introducing unit tests for complex functions',
    '',
    '---',
    '*Generated by automation/code-quality-analytics.cjs*',
  ].join('\n');

  try {
    const escaped = body.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    execSync(`gh issue create --title "${title}" --body "${escaped}" --label "automation,code-quality,tech-debt"`, { stdio: 'pipe' });
    log('✅ GitHub issue created');
  } catch (e) {
    log('⚠️ gh CLI failed; issue not created: ' + e.message);
  }
}

main().catch(err => {
  console.error('❌ Code quality analytics failed:', err);
  process.exit(1);
});
