#!/usr/bin/env node

/**
 * AI Test Coverage Improvement Agent
 *
 * Runs coverage, identifies untested critical paths (app/, components, key pages),
 * and generates actionable suggestions for improvement.
 * Complements ai-test-automation-agent.cjs (which generates tests).
 *
 * Runs: Weekly Tuesday 5 AM via cron
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'test-coverage-improvement-latest.json');

const CRITICAL_PATHS = [
  'app/',
  'components/',
  'lib/',
  'src/',
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[TestCoverageImprovement] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function runCoverage() {
  try {
    execSync('npm run test:coverage 2>&1', {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      cwd: ROOT,
    });
    return true;
  } catch (e) {
    log(`Coverage run failed: ${e.message}`);
    return false;
  }
}

function isCriticalPath(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return CRITICAL_PATHS.some((p) => rel.startsWith(p));
}

function collectSourceFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== '__tests__') {
      collectSourceFiles(full, acc);
    } else if (e.isFile() && /\.(tsx?|jsx?)$/.test(e.name) && !e.name.endsWith('.test.') && !e.name.endsWith('.spec.')) {
      acc.push(full);
    }
  }
  return acc;
}

function parseCoverageFromLcov() {
  const lcovPath = path.join(ROOT, 'coverage', 'lcov.info');
  if (!fs.existsSync(lcovPath)) return null;
  const content = fs.readFileSync(lcovPath, 'utf8');
  const byFile = {};
  let current = null;
  for (const line of content.split('\n')) {
    if (line.startsWith('SF:')) {
      current = line.slice(3).trim();
      byFile[current] = { total: 0, covered: 0 };
    } else if (current && line.startsWith('LF:')) {
      byFile[current].total = parseInt(line.slice(3), 10) || 0;
    } else if (current && line.startsWith('LH:')) {
      byFile[current].covered = parseInt(line.slice(3), 10) || 0;
    }
  }
  const withPct = {};
  for (const [fp, d] of Object.entries(byFile)) {
    const pct = d.total > 0 ? Math.round((d.covered / d.total) * 1000) / 10 : 0;
    withPct[path.relative(ROOT, fp).replace(/\\/g, '/')] = { total: d.total, covered: d.covered, pct };
  }
  const totalLines = Object.values(byFile).reduce((a, d) => a + d.total, 0);
  const totalCovered = Object.values(byFile).reduce((a, d) => a + d.covered, 0);
  return {
    byFile: withPct,
    total: {
      lines: { total: totalLines, covered: totalCovered, pct: totalLines > 0 ? Math.round((totalCovered / totalLines) * 1000) / 10 : 0 },
    },
  };
}

function run() {
  log('Running coverage...');
  ensureDirs();

  const ok = runCoverage();
  const summary = parseCoverageFromLcov();

  const report = {
    timestamp: new Date().toISOString(),
    coverageRan: ok,
    totalCoverage: null,
    untestedCritical: [],
    lowCoverageCritical: [],
    suggestions: [],
  };

  if (summary && summary.total) {
    report.totalCoverage = {
      lines: summary.total.lines?.pct ?? null,
    };
  }

  const criticalSources = [];
  for (const p of CRITICAL_PATHS) {
    const full = path.join(ROOT, p);
    collectSourceFiles(full, criticalSources);
  }

  const byFile = summary?.byFile ?? {};

  for (const src of criticalSources) {
    const rel = path.relative(ROOT, src).replace(/\\/g, '/');
    const entry = byFile[rel];
    const pct = entry ? entry.pct : null;

    if (pct === null || pct === undefined) {
      report.untestedCritical.push({ path: rel, suggestion: 'Add __tests__ or .test.tsx' });
    } else if (pct < 50) {
      report.lowCoverageCritical.push({ path: rel, coverage: pct, suggestion: 'Increase coverage for critical paths' });
    }
  }

  report.suggestions = [
    ...report.untestedCritical.slice(0, 10).map((u) => `Add tests for ${u.path}`),
    ...report.lowCoverageCritical.slice(0, 5).map((l) => `Improve ${l.path} (${l.coverage}% → 80%+)`),
  ];

  report.summary = {
    untestedCount: report.untestedCritical.length,
    lowCoverageCount: report.lowCoverageCritical.length,
    criticalPathsTotal: criticalSources.length,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Wrote ${REPORT_FILE}`);
  log(`Untested critical: ${report.untestedCritical.length}, Low coverage: ${report.lowCoverageCritical.length}`);

  return report;
}

run();
