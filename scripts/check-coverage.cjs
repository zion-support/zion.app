#!/usr/bin/env node
/**
 * Check test coverage threshold.
 * Reads coverage/coverage-summary.json and exits with 1 if below threshold.
 */
const fs = require('fs');
const path = require('path');

const threshold = process.env.COVERAGE_THRESHOLD || 80;
const coverageFile = path.resolve('coverage', 'coverage-summary.json');

if (!fs.existsSync(coverageFile)) {
  console.error('Coverage file not found. Run tests with --coverage first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const total = summary.total;
const linesPct = total.lines.pct;
const branchesPct = total.branches.pct;
const functionsPct = total.functions.pct;
const statementsPct = total.statements.pct;

console.log(`Coverage: lines ${linesPct}%, branches ${branchesPct}%, functions ${functionsPct}%, statements ${statementsPct}%`);

if (linesPct < threshold || branchesPct < threshold || functionsPct < threshold || statementsPct < threshold) {
  console.error(`Coverage below threshold (${threshold}%).`);
  process.exit(1);
} else {
  console.log('Coverage OK.');
  process.exit(0);
}
