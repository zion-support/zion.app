#!/usr/bin/env node
/**
 * check-coverage-gate.cjs – Fail the CI if overall test coverage is below a threshold.
 *
 * Env vars:
 *   COVERAGE_THRESHOLD (default 90)
 *   COVERAGE_SUMMARY_PATH (default ./reports/coverage-summary.json)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const {
  COVERAGE_THRESHOLD = '90',
  COVERAGE_SUMMARY_PATH = path.join(process.cwd(), 'reports', 'coverage-summary.json'),
} = process.env;

function loadCoverage() {
  if (!fs.existsSync(COVERAGE_SUMMARY_PATH)) {
    console.error(`❌ Coverage summary not found at ${COVERAGE_SUMMARY_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(COVERAGE_SUMMARY_PATH, 'utf8');
  const data = JSON.parse(raw);
  // Assuming Jest's coverage-summary format: total.lines.pct etc.
  const total = data.total || {};
  const coveragePct = total.lines?.pct || total.statements?.pct || 0;
  return coveragePct;
}

function main() {
  const coverage = loadCoverage();
  const threshold = parseFloat(COVERAGE_THRESHOLD);
  console.log(`🔍 Coverage: ${coverage}% (threshold: ${threshold}%)`);
  if (coverage < threshold) {
    console.error(`❌ Coverage below threshold. Failing CI.`);
    process.exit(1);
  }
  console.log('✅ Coverage meets threshold.');
  process.exit(0);
}

main();
