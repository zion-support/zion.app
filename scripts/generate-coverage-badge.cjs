#!/usr/bin/env node
/**
 * generate-coverage-badge.cjs – Generate a coverage badge for the dashboard.
 *
 * This script:
 *   1. Reads the latest coverage summary JSON (`reports/coverage-summary.json`).
 *   2. Extracts the total coverage percentage.
 *   2. Generates a shields.io-style badge URL.
 *   3. Writes a markdown badge file (`public/badges/coverage-badge.md`).
 *   3. Commits the badge file to the repository (if --commit is set).
 *
 * Usage:
 *   node scripts/generate-coverage-badge.cjs [--output <path>] [--commit]
 *
 * Environment variables:
 *   GITHUB_TOKEN   – GitHub token with repo scope
 *   REPO_OWNER
 *   REPO_NAME
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  OUTPUT_PATH = path.join(__dirname, '..', 'public', 'badges', 'coverage-badge.md'),
  COMMIT = 'false' === process.env.COMMIT,
} = process.env;

if (!REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars: REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = require('@octokit/rest')({ auth: process.env.GITHUB_TOKEN });

async function readCoverageSummary() {
  const summaryPath = path.join(__dirname, '..', 'reports', 'coverage-summary.json');
  if (!fs.existsSync(summaryPath)) {
    console.error('❌ Coverage summary file not found at', summaryPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(summaryPath, 'utf8');
  const data = JSON.parse(raw);
  return data.total?.percent || 0;
}

function generateBadge(percentage) {
  // Construct a shields.io badge URL
  const encodedPct = encodeURIComponent(percentage.toString());
  return `https://img.shields.io/badge/coverage-${percentage.toFixed(1)}%25-brightgreen.svg`;
}

function generateMarkdown(percentage) {
  const badgeUrl = generateBadge(percentage);
  return `# Coverage Badge\n\n[![Coverage](https://img.shields.io/badge/coverage-${percentage.toFixed(1)}%25-brightgreen.svg)](${generateBadge(percentage)})\n\n_${percentage.toFixed(1)}% code coverage_`;
}

async function commitBadge(content) {
  if (!COMMIT || !REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
    console.log('⚠️  Commit step skipped (COM... not set)');
    return;
  }
  // Commit the badge file
  const { execSync } = require('child_process');
  try {
    execSync(`git add ${OUTPUT_PATH}`);
    execSync(`git commit -m "chore: update coverage badge"`, { stdio: 'inherit' });
    execSync(`git push origin HEAD:${process.env.GITHUB_REF || 'main'}`);
  } catch (err) {
    console.error('❌ Failed to commit badge:', err.message);
    process.exit(1);
  }
}

(async () => {
  try {
    const coveragePct = await (async () => {
      // read coverage summary
      const summaryPath = path.join(__dirname, '..', 'reports', 'coverage-summary.json');
      const raw = fs.readFileSync(summaryPath, 'utf8');
      const data = JSON.parse(raw);
      return data.total?.percent || 0;
    })();

    const markdown = generateMarkdown(coveragePct);
    await fs.writeFile(OUTPUT_PATH, content, 'utf8');

    console.log(`✅ Coverage badge generated and written to ${OUTPUT_PATH}`);

    if (COMMIT === 'true') {
      await commitBadge(OUTPUT_PATH);
    } else {
      console.log(`Badge written to ${OUTPUT_PATH}`);
    }
  } catch (err) {
    console.error('🚨 Error generating coverage badge:', err.message);
    process.exit(1);
  }
})();