#!/usr/bin/env node
/**
 * performance-regression-detector.cjs – Detects significant increases in CI workflow duration.
 *
 * This script:
 *   1. Fetches the last N workflow runs (default 50) for the default workflow (or all workflows).
 *   2. Computes the median duration of the first half vs second half (or uses exponential moving average).
 *   3. If the recent median duration exceeds the historical median by a threshold (e.g., 20%), it:
 *        - Creates a GitHub issue alerting of a possible performance regression.
 *        - Optionally comments on the issue with details.
 *
 * Environment variables:
 *   GITHUB_TOKEN   – GitHub token with repo scope
 *   REPO_OWNER
 *   REPO_NAME
 *   WORKFLOW_NAME  – optional, name of workflow to monitor (if not set, monitor all)
 *   THRESHOLD_PCT  – optional, percentage increase to trigger alert (default 20)
 *   RUN_COUNT      – optional, number of recent runs to analyze (default 50)
 *
 * The script is intended to run on a schedule (e.g., daily) via GitHub Actions.
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  WORKFLOW_NAME,
  THRESHOLD_PCT = '20',
  RUN_COUNT = '50',
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars: GITHUB_TOKEN, REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getWorkflowId() {
  if (!WORKFLOW_NAME) return null;
  try {
    const { data } = await octokit.actions.listWorkflowsForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    const wf = data.workflows.find(w => w.name === WORKFLOW_NAME);
    return wf ? wf.id : null;
  } catch (err) {
    console.warn('⚠️ Could not fetch workflow list:', err.message);
    return null;
  }
}

async function fetchRuns(workflowId, limit) {
  const runs = [];
  let page = 1;
  const perPage = 30;
  while (runs.length < limit) {
    const { data } = workflowId
      ? await octokit.actions.listWorkflowRuns({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          workflow_id: workflowId,
          per_page: perPage,
          page,
        })
      : await octokit.actions.listWorkflowRunsForRepo({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          per_page: perPage,
          page,
        });
    runs.push(...data.workflow_runs);
    if (data.workflow_runs.length < perPage) break;
    page++;
  }
  return runs.slice(0, limit);
}

function computeMedianDuration(runs) {
  const durations = runs
    .map(r => {
      const start = new Date(r.run_started_at).getTime();
      const end = new Date(r.updated_at).getTime();
      return (end - start) / 1000; // seconds
    })
    .filter(d => !isNaN(d) && d > 0);
  if (durations.length === 0) return 0;
  const sorted = durations.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

async function checkForRegression() {
  const workflowId = await getWorkflowId();
  const limit = parseInt(RUN_COUNT, 10) || 50;
  const threshold = parseFloat(THRESHOLD_PCT) / 100;

  console.log(`🔍 Fetching last ${limit} workflow runs${WORKFLOW_NAME ? ` for workflow "${WORKFLOW_NAME}"` : ''}...`);
  const runs = await fetchRuns(workflowId, limit);
  if (runs.length < 10) {
    console.log('⚠️ Not enough runs to analyze (need at least 10).');
    return;
  }

  // Split into two halves: older half and newer half
  const half = Math.floor(runs.length / 2);
  const olderHalf = runs.slice(0, half);
  const newerHalf = runs.slice(half);

  const olderMedian = computeMedianDuration(olderHalf);
  const newerMedian = computeMedianDuration(newerHalf);

  console.log(`📊 Older half median duration: ${olderMedian.toFixed(2)}s`);
  console.log(`📊 Newer half median duration: ${newerMedian.toFixed(2)}s`);

  const increase = newerMedian - olderMedian;
  const pctIncrease = olderMedian > 0 ? increase / olderMedian : 0;

  console.log(`📈 Percentage change: ${(pctIncrease * 100).toFixed(2)}%`);

  if (pctIncrease > threshold && newerMedian > olderMedian) {
    console.log(`🚨 Performance regression detected (exceeds ${THRESHOLD_PCT}% threshold).`);
    const issueTitle = `⚠️ Performance regression detected: CI duration increased by ${pctIncrease * 100}%`;
    const issueBody = `
**Performance Regression Alert**

The median CI workflow duration has increased significantly in the last ${limit} runs.

- **Older half (first ${half} runs) median duration**: ${olderMedian.toFixed(2)} seconds
- **Newer half (last ${runs.length - half} runs) median duration**: ${newerMedian.toFixed(2)} seconds
- **Increase**: ${increase.toFixed(2)} seconds (${(pctIncrease * 100).toFixed(2)}%)

**Threshold**: ${THRESHOLD_PCT}%

**Possible causes**:
- New dependencies with heavier initialization
- Additional test steps or slower tests
- Changes in container/image size
- Infrastructure changes

**Suggested actions**:
- Review recent changes in workflow files (\`.github/workflows/*.yml\`)
- Check for newly added npm packages with large install times
- Consider caching strategies or parallelization
- Investigate any external service calls that may have slowed down

_This issue was generated automatically by the performance-regression-detector workflow._
    `.trim();

    try {
      // Check if an open issue with a similar title already exists to avoid duplicates
      const { data: existingIssues } = await octokit.issues.listForRepo({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        state: 'open',
        per_page: 100,
      });
      const similar = existingIssues.some(issue =>
        issue.title.includes('Performance regression detected') &&
        issue.body.includes('median CI workflow duration')
      );
      if (!similar) {
        const { data } = await octokit.issues.create({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          title: issueTitle,
          body: issueBody,
          labels: ['performance', 'regression', 'automated'],
        });
        console.log(`✅ Created issue ${data.number}: ${data.title}`);
      } else {
        console.log('ℹ️ Similar open issue already exists; skipping creation.');
      }
    } catch (err) {
      console.error('❌ Failed to create issue:', err.message);
      process.exit(1);
    }
  } else {
    console.log('✅ No significant performance regression detected.');
  }
}

checkForRegression().catch(err => {
  console.error('🚨 Unexpected error:', err);
  process.exit(1);
});
