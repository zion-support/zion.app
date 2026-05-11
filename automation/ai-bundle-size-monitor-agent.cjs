#!/usr/bin/env node

/**
 * AI Bundle Size Monitor Agent
 *
 * Builds the app, measures output size, stores history, and detects regressions.
 * Alerts when bundle size increases by more than threshold (default 10%).
 * Complements PR bundle-size workflow with scheduled/main-branch tracking.
 *
 * Runs: Weekly Friday 5 AM via cron | On-demand
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'bundle-size-monitor-latest.json');
const DATA_DIR = path.join(ROOT, 'automation', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'bundle-size-history.json');
const REGRESSION_THRESHOLD = parseFloat(process.env.BUNDLE_REGRESSION_THRESHOLD || '10'); // percent

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[BundleSizeMonitor] ${ts} | ${msg}`);
}

function ensureDirs() {
  [REPORTS_DIR, DATA_DIR].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function measureBuild() {
  const outDir = path.join(ROOT, 'out');
  const nextDir = path.join(ROOT, '.next');

  if (fs.existsSync(outDir)) {
    const size = execSync(`du -sb "${outDir}" 2>/dev/null | awk '{print $1}'`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    const jsSize = execSync(
      `find "${outDir}" -name '*.js' -exec du -cb {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo 0`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    const cssSize = execSync(
      `find "${outDir}" -name '*.css' -exec du -cb {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo 0`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    const htmlCount = execSync(`find "${outDir}" -name '*.html' 2>/dev/null | wc -l`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return {
      totalBytes: parseInt(size, 10) || 0,
      jsBytes: parseInt(jsSize, 10) || 0,
      cssBytes: parseInt(cssSize, 10) || 0,
      htmlCount: parseInt(htmlCount, 10) || 0,
      outputDir: 'out',
    };
  }

  if (fs.existsSync(nextDir)) {
    const size = execSync(`du -sb "${nextDir}" 2>/dev/null | awk '{print $1}'`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    const jsSize = execSync(
      `find "${nextDir}" -name '*.js' -exec du -cb {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo 0`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    const cssSize = execSync(
      `find "${nextDir}" -name '*.css' -exec du -cb {} + 2>/dev/null | tail -1 | awk '{print $1}' || echo 0`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim();
    const htmlCount = execSync(`find "${nextDir}" -name '*.html' 2>/dev/null | wc -l`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return {
      totalBytes: parseInt(size, 10) || 0,
      jsBytes: parseInt(jsSize, 10) || 0,
      cssBytes: parseInt(cssSize, 10) || 0,
      htmlCount: parseInt(htmlCount, 10) || 0,
      outputDir: '.next',
    };
  }

  return null;
}

function run() {
  ensureDirs();
  log('Building project...');

  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
  } catch (e) {
    log('Build failed. Skipping measurement.');
    const report = {
      timestamp: new Date().toISOString(),
      success: false,
      error: e.message,
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    return report;
  }

  const metrics = measureBuild();
  if (!metrics) {
    log('No build output found (out/ or .next/)');
    return { success: false };
  }

  const totalMb = (metrics.totalBytes / (1024 * 1024)).toFixed(2);
  const jsMb = (metrics.jsBytes / (1024 * 1024)).toFixed(2);
  const cssKb = (metrics.cssBytes / 1024).toFixed(2);

  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch {}
  }

  const prev = history.length > 0 ? history[history.length - 1] : null;
  let regression = null;
  if (prev && prev.totalBytes) {
    const pct = ((metrics.totalBytes - prev.totalBytes) / prev.totalBytes) * 100;
    if (pct > REGRESSION_THRESHOLD) {
      regression = {
        percent: pct.toFixed(1),
        previousBytes: prev.totalBytes,
        currentBytes: metrics.totalBytes,
      };
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    success: true,
    totalBytes: metrics.totalBytes,
    totalMb: parseFloat(totalMb),
    jsMb: parseFloat(jsMb),
    cssKb: parseFloat(cssKb),
    htmlCount: metrics.htmlCount,
    outputDir: metrics.outputDir,
    regression,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  history.push({
    timestamp: report.timestamp,
    totalBytes: metrics.totalBytes,
    totalMb: parseFloat(totalMb),
  });
  if (history.length > 52) history = history.slice(-52); // ~1 year weekly
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  log(`Bundle: ${totalMb} MB total, ${jsMb} MB JS, ${cssKb} KB CSS`);
  if (regression) log(`Regression: +${regression.percent}%`);

  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log(JSON.stringify(r.success ? { totalMb: r.totalMb, regression: r.regression } : r, null, 2));
} else {
  console.log('Usage: node ai-bundle-size-monitor-agent.cjs [run|summary]');
  process.exit(1);
}
