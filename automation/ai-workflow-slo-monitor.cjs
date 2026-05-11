#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY || '';
const [owner, repo] = repository.split('/');
const branch = process.env.SLO_BRANCH || 'main';
const lookbackDays = Number(process.env.SLO_LOOKBACK_DAYS || 14);
const maxWorkflows = Number(process.env.SLO_MAX_WORKFLOWS || 40);
const minRunsForAlert = Number(process.env.SLO_MIN_RUNS_FOR_ALERT || 5);
const failureRateAlert = Number(process.env.SLO_FAILURE_RATE_ALERT || 0.15);
const p95MinutesAlert = Number(process.env.SLO_P95_MINUTES_ALERT || 20);

const REPORT_DIR = path.join(process.cwd(), 'automation', 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'workflow-slo-latest.json');
const MD_REPORT = path.join(REPORT_DIR, 'workflow-slo-latest.md');

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function minutesFromRun(run) {
  const start = new Date(run.run_started_at || run.created_at).getTime();
  const end = new Date(run.updated_at).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(0, (end - start) / 60000);
}

async function api(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'zion-workflow-slo-monitor',
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 300)}`);
  }
  return response.json();
}

function toMd(report) {
  const lines = [];
  lines.push('# Workflow SLO Report');
  lines.push('');
  lines.push(`- Repository: \`${report.repository}\``);
  lines.push(`- Branch: \`${report.branch}\``);
  lines.push(`- Lookback days: \`${report.lookbackDays}\``);
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Workflows analyzed: \`${report.workflowCount}\``);
  lines.push(`- Flagged workflows: \`${report.flagged.length}\``);
  lines.push('');
  lines.push('## Top Workflows by p95 Duration');
  lines.push('');
  lines.push('| Workflow | Runs | Success % | Failure % | p95 min |');
  lines.push('|---|---:|---:|---:|---:|');
  for (const wf of report.workflows.slice(0, 15)) {
    lines.push(
      `| ${wf.name} | ${wf.totalRuns} | ${(wf.successRate * 100).toFixed(1)} | ${(wf.failureRate * 100).toFixed(1)} | ${wf.p95Minutes.toFixed(2)} |`,
    );
  }
  if (report.flagged.length) {
    lines.push('');
    lines.push('## Flagged Workflows');
    lines.push('');
    for (const wf of report.flagged) {
      lines.push(
        `- **${wf.name}**: failure ${(wf.failureRate * 100).toFixed(1)}%, p95 ${wf.p95Minutes.toFixed(2)} min, runs ${wf.totalRuns}`,
      );
    }
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!token) {
    throw new Error('GITHUB_TOKEN or GH_TOKEN is required.');
  }
  if (!owner || !repo) {
    throw new Error('GITHUB_REPOSITORY must be set (owner/repo).');
  }

  const workflowsData = await api(`/repos/${owner}/${repo}/actions/workflows?per_page=100`);
  const workflows = (workflowsData.workflows || []).slice(0, maxWorkflows);
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;

  const analyzed = [];
  for (const wf of workflows) {
    const runsData = await api(
      `/repos/${owner}/${repo}/actions/workflows/${wf.id}/runs?branch=${encodeURIComponent(branch)}&per_page=100`,
    );
    const recentRuns = (runsData.workflow_runs || []).filter((run) => {
      const runTs = new Date(run.created_at).getTime();
      return Number.isFinite(runTs) && runTs >= cutoff;
    });
    if (!recentRuns.length) continue;

    const durations = recentRuns.map(minutesFromRun).filter((value) => value > 0);
    const success = recentRuns.filter((run) => run.conclusion === 'success').length;
    const failed = recentRuns.filter((run) =>
      ['failure', 'timed_out', 'cancelled', 'startup_failure'].includes(run.conclusion),
    ).length;

    const totalRuns = recentRuns.length;
    analyzed.push({
      id: wf.id,
      name: wf.name,
      path: wf.path,
      totalRuns,
      successRate: totalRuns ? success / totalRuns : 0,
      failureRate: totalRuns ? failed / totalRuns : 0,
      p95Minutes: percentile(durations, 95),
      p50Minutes: percentile(durations, 50),
      medianMinutes: percentile(durations, 50),
    });
  }

  analyzed.sort((a, b) => b.p95Minutes - a.p95Minutes);
  const flagged = analyzed.filter(
    (wf) =>
      wf.totalRuns >= minRunsForAlert &&
      (wf.failureRate >= failureRateAlert || wf.p95Minutes >= p95MinutesAlert),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    repository,
    branch,
    lookbackDays,
    workflowCount: analyzed.length,
    thresholds: {
      minRunsForAlert,
      failureRateAlert,
      p95MinutesAlert,
    },
    workflows: analyzed,
    flagged,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));
  fs.writeFileSync(MD_REPORT, toMd(report));

  console.log(`Workflow SLO report generated: ${JSON_REPORT}`);
  console.log(`Flagged workflows: ${flagged.length}`);
}

main().catch((error) => {
  console.error(`[workflow-slo-monitor] ${error.message}`);
  process.exit(1);
});
