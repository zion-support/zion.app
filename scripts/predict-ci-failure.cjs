#!/usr/bin/env node
/**
 * predict-ci-failure.cjs – Simple predictive model for CI failure risk.
 *
 * This script fetches recent workflow runs from the repository, extracts basic
 * features (duration, status, changed files count) and computes a very naive risk
 * score. The goal is to provide early warnings for upcoming runs or PRs.
 *
 * For a production‑grade model you would replace the heuristic with a trained
 * ML model (e.g. XGBoost via the `xgboost-node` package) and store the model
 * artifact. Here we keep the implementation lightweight and dependency‑free.
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  PREDICTION_OUTPUT = 'prediction-results.json',
  PREDICTION_RUN_COUNT = '100',
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars: GITHUB_TOKEN, REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/** Fetch recent workflow runs (both success and failure). */
async function fetchRuns(limit) {
  const runs = [];
  let page = 1;
  const perPage = 30;
  while (runs.length < limit) {
    const { data } = await octokit.actions.listWorkflowRunsForRepo({
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

/** Simple heuristic risk score (0‑1). */
function riskScore(run, medianDuration, medianChanges) {
  const duration = new Date(run.run_started_at).getTime();
  const finish = new Date(run.updated_at).getTime();
  const elapsedSec = (finish - duration) / 1000;
  const changes = run.head_commit?.added?.length + run.head_commit?.modified?.length + run.head_commit?.removed?.length || 0;
  // higher duration or more changes increase risk
  const durationFactor = elapsedSec > medianDuration ? 0.6 : 0.3;
  const changeFactor = changes > medianChanges ? 0.4 : 0.2;
  // failure history factor
  const failureFactor = run.conclusion === 'failure' ? 0.5 : 0.0;
  return Math.min(1, durationFactor + changeFactor + failureFactor);
}

async function main() {
  const limit = parseInt(PREDICTION_RUN_COUNT, 10) || 100;
  const runs = await fetchRuns(limit);
  if (runs.length === 0) {
    console.log('⚠️ No workflow runs fetched.');
    return;
  }

  // compute median duration & changes for baseline
  const durations = runs.map(r => (new Date(r.updated_at) - new Date(r.run_started_at)) / 1000);
  const changesArr = runs.map(r => {
    const c = r.head_commit?.added?.length + r.head_commit?.modified?.length + r.head_commit?.removed?.length || 0;
    return c;
  });
  const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  const medianDuration = median(durations);
  const medianChanges = median(changesArr);

  const predictions = runs.map(run => ({
    id: run.id,
    name: run.name,
    url: run.html_url,
    created_at: run.created_at,
    conclusion: run.conclusion,
    riskScore: riskScore(run, medianDuration, medianChanges),
  }));

  const outPath = path.resolve(process.cwd(), PREDICTION_OUTPUT);
  fs.writeFileSync(outPath, JSON.stringify(predictions, null, 2));
  console.log(`✅ Prediction results written to ${outPath}`);
}

main().catch(err => {
  console.error('🚨 Error during prediction:', err);
  process.exit(1);
});
