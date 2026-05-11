#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY || '';
const [owner, repo] = repository.split('/');
const branch = process.env.FLAKE_BRANCH || 'main';
const lookbackDays = Number(process.env.FLAKE_LOOKBACK_DAYS || 14);
const maxWorkflows = Number(process.env.FLAKE_MAX_WORKFLOWS || 40);
const reportDir = path.join(process.cwd(), 'automation', 'reports');
const reportPath = path.join(reportDir, 'workflow-flakes-latest.json');

function isFailure(conclusion) {
  return ['failure', 'timed_out', 'cancelled', 'startup_failure'].includes(conclusion || '');
}

async function api(pathname) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'zion-workflow-flake-detector',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function detectFlakes(runs) {
  const flakes = [];
  for (let i = 0; i < runs.length - 1; i += 1) {
    const current = runs[i];
    const next = runs[i + 1];
    if (isFailure(current.conclusion) && next.conclusion === 'success') {
      flakes.push({
        failedRunId: current.id,
        failedAt: current.created_at,
        recoveredRunId: next.id,
        recoveredAt: next.created_at,
      });
    }
  }
  return flakes;
}

async function main() {
  if (!token) throw new Error('GITHUB_TOKEN or GH_TOKEN is required.');
  if (!owner || !repo) throw new Error('GITHUB_REPOSITORY must be owner/repo.');

  const workflowsData = await api(`/repos/${owner}/${repo}/actions/workflows?per_page=100`);
  const workflows = (workflowsData.workflows || []).slice(0, maxWorkflows);
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;

  const summary = [];
  for (const wf of workflows) {
    const runsData = await api(
      `/repos/${owner}/${repo}/actions/workflows/${wf.id}/runs?branch=${encodeURIComponent(branch)}&per_page=100`,
    );
    const runs = (runsData.workflow_runs || []).filter((run) => {
      const ts = new Date(run.created_at).getTime();
      return Number.isFinite(ts) && ts >= cutoff;
    });
    if (!runs.length) continue;
    const flakes = detectFlakes(runs);
    summary.push({
      id: wf.id,
      name: wf.name,
      totalRuns: runs.length,
      flakeCount: flakes.length,
      flaky: flakes.length > 0,
      flakes,
    });
  }

  summary.sort((a, b) => b.flakeCount - a.flakeCount);
  const flagged = summary.filter((wf) => wf.flaky);
  const report = {
    generatedAt: new Date().toISOString(),
    repository,
    branch,
    lookbackDays,
    workflowCount: summary.length,
    flaggedCount: flagged.length,
    workflows: summary,
    flagged,
  };

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Workflow flake report generated: ${reportPath}`);
  console.log(`Flagged workflows: ${flagged.length}`);
}

main().catch((error) => {
  console.error(`[workflow-flake-detector] ${error.message}`);
  process.exit(1);
});
