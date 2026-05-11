#!/usr/bin/env node

/**
 * AI Lighthouse Production Audit
 *
 * Audits the live production site (https://ziontechgroup.com) using Lighthouse,
 * stores scores for trend analysis, and optionally fails if scores drop below thresholds.
 *
 * Usage:
 *   node ai-lighthouse-production-audit.cjs run     - One-time audit
 *   node ai-lighthouse-production-audit.cjs run --threshold=80  - Fail if any score < 80
 *
 * Environment variables:
 *   LIGHTHOUSE_URL     - URL to audit (default: https://ziontechgroup.com)
 *   PERF_THRESHOLD     - Min performance score (0-100)
 *   A11Y_THRESHOLD     - Min accessibility score
 *   BP_THRESHOLD       - Min best-practices score
 *   SEO_THRESHOLD      - Min SEO score
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const LOGS_DIR = path.join(ROOT, 'automation', 'logs');
const REPORT_FILE = path.join(REPORTS_DIR, 'lighthouse-production-latest.json');
const LOG_FILE = path.join(LOGS_DIR, 'lighthouse-production-audit.log');

const DEFAULT_URL = process.env.LIGHTHOUSE_URL || 'https://ziontechgroup.com';
const PERF_THRESHOLD = parseInt(process.env.PERF_THRESHOLD || '50', 10);
const A11Y_THRESHOLD = parseInt(process.env.A11Y_THRESHOLD || '80', 10);
const BP_THRESHOLD = parseInt(process.env.BP_THRESHOLD || '80', 10);
const SEO_THRESHOLD = parseInt(process.env.SEO_THRESHOLD || '80', 10);

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[LighthouseAudit] ${ts} | ${msg}`;
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

function runAudit() {
  log(`=== Production Lighthouse Audit Started ===`);
  log(`URL: ${DEFAULT_URL}`);

  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const outputPath = path.join(REPORTS_DIR, 'lighthouse-production-temp');
  let report;

  try {
    execSync(
      `npx lighthouse "${DEFAULT_URL}" ` +
        `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" ` +
        `--output=json ` +
        `--output-path=${outputPath} ` +
        `--only-categories=performance,accessibility,best-practices,seo ` +
        `--quiet`,
      {
        cwd: ROOT,
        stdio: 'pipe',
        timeout: 120000,
      }
    );

    const jsonPath = outputPath + '.report.json';
    const altPath = outputPath;
    const foundPath = fs.existsSync(jsonPath) ? jsonPath : fs.existsSync(altPath) ? altPath : null;
    if (!foundPath) {
      throw new Error(`Lighthouse report not found at ${jsonPath} or ${altPath}`);
    }

    report = JSON.parse(fs.readFileSync(foundPath, 'utf8'));
    try {
      fs.unlinkSync(foundPath);
    } catch {
      /* ignore cleanup errors */
    }
  } catch (err) {
    log(`Audit failed: ${err.message}`, 'ERROR');
    throw err;
  }

  const categories = report.categories || {};
  const perf = Math.round((categories.performance?.score || 0) * 100);
  const a11y = Math.round((categories.accessibility?.score || 0) * 100);
  const bp = Math.round((categories['best-practices']?.score || 0) * 100);
  const seo = Math.round((categories.seo?.score || 0) * 100);

  const result = {
    timestamp: new Date().toISOString(),
    url: DEFAULT_URL,
    scores: {
      performance: perf,
      accessibility: a11y,
      bestPractices: bp,
      seo,
    },
    thresholds: {
      performance: PERF_THRESHOLD,
      accessibility: A11Y_THRESHOLD,
      bestPractices: BP_THRESHOLD,
      seo: SEO_THRESHOLD,
    },
    passed: perf >= PERF_THRESHOLD && a11y >= A11Y_THRESHOLD && bp >= BP_THRESHOLD && seo >= SEO_THRESHOLD,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(result, null, 2));
  log(`Scores: Perf=${perf} A11y=${a11y} BP=${bp} SEO=${seo}`);
  log(`Passed: ${result.passed}`);
  log(`=== Audit Complete ===`);

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'run';

  if (cmd !== 'run') {
    console.log('Usage: node ai-lighthouse-production-audit.cjs run');
    process.exit(0);
  }

  const thresholdArg = args.find((a) => a.startsWith('--threshold='));
  const overrideThreshold = thresholdArg ? parseInt(thresholdArg.split('=')[1], 10) : null;

  if (overrideThreshold !== null) {
    process.env.PERF_THRESHOLD = String(overrideThreshold);
    process.env.A11Y_THRESHOLD = String(overrideThreshold);
    process.env.BP_THRESHOLD = String(overrideThreshold);
    process.env.SEO_THRESHOLD = String(overrideThreshold);
  }

  try {
    const result = runAudit();
    process.exit(result.passed ? 0 : 1);
  } catch (err) {
    log(`Fatal: ${err.message}`, 'ERROR');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runAudit };
