#!/usr/bin/env node
/**
 * cost-benefit-analysis.js – Calculate ROI for automation tasks.
 *
 * This script evaluates the cost-benefit of implementing automation ideas.
 * It takes a list of tasks with:
 *   - Estimated labor hours (manual effort)
 *   - Estimated cost of manual execution
 *   - Expected savings (time, money, risk reduction)
 *   - Implementation cost (development effort)
 *
 * Outputs a markdown report with:
 *   - ROI ratio (savings / cost)
 *   - Payback period (months)
 *   - Recommendation (adopt / monitor / defer)
 *
 * Usage:
 *   REPO_OWNER=Zion-support REPO_NAME=zion.app node cost-benefit-analysis.js > reports/cost-analysis.md
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const {
  REPO_OWNER,
  REPO_NAME,
  NODE_ENV = 'development',
} = process.env;

if (!REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars: REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function fetchRepoInfo() {
  try {
    const { data } = await octokit.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    return {
      defaultBranch: data.default_branch,
      description: data.description,
    };
  } catch (err) {
    console.error('❌ Failed to fetch repo info:', err.message);
    process.exit(1);
  }
}

// Example task definitions (could be read from a config file)
const tasks = [
  {
    name: 'Self-Healing CI Pipelines',
    laborHours: 120,
    laborCost: 2400, // $20/hr * 120h
    expectedSavings: 4800, // saved effort per quarter
    implementationCost: 800, // dev hours to build
    frequency: 'quarterly', // how often savings realized
  },
  {
    name: 'Automated Dependency Updates',
    laborHours: 8,
    laborCost: 160,
    expectedSavings: 600,
    implementationCost: 200,
    frequency: 'monthly',
  },
  {
    name: 'Dashboard Generation Automation',
    laborHours: 24,
    laborCost: 480,
    expectedSavings: 1200,
    implementationCost: 400,
    frequency: 'weekly',
  },
];

async function main() {
  console.log(`📊 Cost-Benefit Analysis: ${process.env.REPO_OWNER}/${process.env.REPO_NAME}`);
  console.log(`Generated on: ${new Date().toISOString().split('T')[0]}\n`);

  tasks.forEach(async (task, index) => {
    const { name, laborHours, laborCost, expectedSavings, implementationCost, frequency } = task;

    // Calculate metrics
    const roi = task.expectedSavings / task.implementationCost;
    const paybackPeriodMonths = implementationCost / (expectedSavings / 4); // assuming quarterly savings
    const recommendation = roi > 1 && implementationCost < 1000 ? '✅ ADOPT' : roi > 0.5 ? '✅ CONSIDER' : '❌ DEFER';

    console.log(`## ${task.name}\n`);
    console.log(`- **Labor Cost:** $${laborCost.toFixed(2)}`);
    console.log(`- **Expected Savings:** $${task.expectedSavings.toFixed(2)}`);
    console.log(`- **Implementation Cost:** $${implementationCost}\n`);
    console.log(`- **ROI:** ${roi.toFixed(2)}\n`);
    console.log(`- **Payback Period:** ${paybackPeriodMonths.toFixed(1)} months\n`);
    console.log(`- **Recommendation:** ${recommendation}\n\n`);
  });
}

main().catch(err => {
  console.error('❌ Error generating cost-benefit report:', err.message);
  process.exit(1);
});