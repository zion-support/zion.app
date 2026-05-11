#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { AUTONOMY_AGENT_CONFIG } = require('./autonomy-agent-config.cjs');

const cfg = AUTONOMY_AGENT_CONFIG.queueGuard;
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY || '';
const [owner, repo] = repository.split('/');
const currentRunId = process.env.GITHUB_RUN_ID || '';
const branch = process.env.QUEUE_GUARD_BRANCH || 'main';
const strict = process.argv.includes('--strict');
const waitMode = process.argv.includes('--wait');
const cancelStale = process.argv.includes('--cancel-stale');
const waitMaxMinutes = Math.max(1, parseInt(process.env.QUEUE_GUARD_WAIT_MAX_MINUTES || '30', 10));
const waitPollSeconds = Math.max(10, parseInt(process.env.QUEUE_GUARD_WAIT_POLL_SECONDS || '30', 10));
const maxConcurrentWriters = Math.max(
  1,
  parseInt(process.env.QUEUE_GUARD_MAX_CONCURRENT_WRITERS || `${cfg.maxConcurrentWriters || 1}`, 10),
);
const failOpen = process.env.QUEUE_GUARD_FAIL_OPEN === '1';
const apiRetryMax = Math.max(0, parseInt(process.env.QUEUE_GUARD_API_RETRY_MAX || '2', 10));
const apiRetryBaseMs = Math.max(100, parseInt(process.env.QUEUE_GUARD_API_RETRY_BASE_MS || '1200', 10));
const staleRunMinutes = Math.max(
  10,
  parseInt(process.env.QUEUE_GUARD_STALE_RUN_MINUTES || `${cfg.staleRunMinutes || 90}`, 10),
);
const reportDir = path.join(process.cwd(), 'automation', 'reports');
const jsonReport = path.join(reportDir, 'autonomous-writer-queue-guard-latest.json');
const mdReport = path.join(reportDir, 'autonomous-writer-queue-guard-latest.md');

async function api(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'zion-autonomous-writer-queue-guard',
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

async function apiDelete(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'zion-autonomous-writer-queue-guard',
    },
  });
  return response.ok;
}

function isLikelyWriter(run) {
  const lower = `${run.name || ''} ${run.path || ''}`.toLowerCase();
  if (Array.isArray(cfg.writerWorkflowFiles) && cfg.writerWorkflowFiles.length > 0) {
    const runPath = String(run.path || '').toLowerCase();
    if (cfg.writerWorkflowFiles.some((f) => runPath.includes(String(f).toLowerCase()))) return true;
  }
  return (cfg.writerWorkflowKeywords || []).some((keyword) => lower.includes(String(keyword).toLowerCase()));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apiWithRetry(pathname) {
  let lastError = null;
  for (let attempt = 0; attempt <= apiRetryMax; attempt++) {
    try {
      if (attempt > 0) {
        const backoffMs = apiRetryBaseMs * Math.pow(2, attempt - 1);
        await sleep(backoffMs);
      }
      return await api(pathname);
    } catch (error) {
      lastError = error;
      console.warn(
        `[autonomous-writer-queue-guard] api retry ${attempt + 1}/${apiRetryMax + 1} failed: ${error.message}`,
      );
    }
  }
  throw lastError || new Error('GitHub API failed without explicit error');
}

async function apiDeleteWithRetry(pathname) {
  for (let attempt = 0; attempt <= apiRetryMax; attempt++) {
    try {
      if (attempt > 0) {
        const backoffMs = apiRetryBaseMs * Math.pow(2, attempt - 1);
        await sleep(backoffMs);
      }
      return await apiDelete(pathname);
    } catch (error) {
      console.warn(
        `[autonomous-writer-queue-guard] delete retry ${attempt + 1}/${apiRetryMax + 1} failed: ${error.message}`,
      );
    }
  }
  return false;
}

function startedAgeMinutes(run) {
  const t = Date.parse(run.run_started_at || run.created_at || '');
  if (!Number.isFinite(t)) return 0;
  return (Date.now() - t) / 1000 / 60;
}

function summarizeRuns(runs) {
  return runs.map((run) => ({
    id: run.id,
    name: run.name,
    path: run.path,
    run_number: run.run_number,
    status: run.status,
    ageMinutes: Math.round(startedAgeMinutes(run)),
    html_url: run.html_url,
  }));
}

async function loadActiveWriterRuns() {
  const runsData = await apiWithRetry(
    `/repos/${owner}/${repo}/actions/runs?branch=${encodeURIComponent(branch)}&per_page=100`,
  );
  const allRuns = runsData.workflow_runs || [];
  const activeRuns = allRuns.filter((run) => ['queued', 'in_progress'].includes(run.status));
  const activeWriterRuns = activeRuns
    .filter((run) => isLikelyWriter(run))
    .filter((run) => String(run.id) !== String(currentRunId));
  return { activeRuns, activeWriterRuns };
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Autonomous Writer Queue Guard');
  lines.push('');
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Branch: \`${report.branch}\``);
  lines.push(`- Writer runs active: \`${report.activeWriterRuns.length}\``);
  lines.push(`- Allowed max: \`${report.thresholds.maxConcurrentWriters}\``);
  lines.push(`- Severity: \`${report.severity}\``);
  lines.push(`- Wait mode: \`${report.options.waitMode}\``);
  lines.push(`- Cancel stale: \`${report.options.cancelStale}\``);
  lines.push(`- Stale threshold: \`${report.options.staleRunMinutes}m\``);
  lines.push(`- Waited seconds: \`${report.waitedSeconds}\``);
  if (Array.isArray(report.cancelledRuns) && report.cancelledRuns.length > 0) {
    lines.push(`- Cancelled stale runs: \`${report.cancelledRuns.length}\``);
  }
  lines.push('');
  if (report.activeWriterRuns.length) {
    lines.push('## Active writer runs');
    lines.push('');
    for (const run of report.activeWriterRuns) {
      lines.push(`- ${run.name} (#${run.run_number}, ${run.status}, age=${run.ageMinutes}m)`);
    }
  }
  if (Array.isArray(report.cancelledRuns) && report.cancelledRuns.length) {
    lines.push('');
    lines.push('## Cancelled stale runs');
    lines.push('');
    for (const run of report.cancelledRuns) {
      lines.push(`- ${run.name} (#${run.run_number}, age=${run.ageMinutes}m)`);
    }
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!token) throw new Error('GITHUB_TOKEN or GH_TOKEN is required');
  if (!owner || !repo) throw new Error('GITHUB_REPOSITORY must be set');

  const startedAt = Date.now();
  const maxWaitMs = waitMaxMinutes * 60 * 1000;
  const cancelledRuns = [];

  while (true) {
    let { activeRuns, activeWriterRuns } = await loadActiveWriterRuns();

    if (cancelStale && activeWriterRuns.length > 0) {
      for (const run of activeWriterRuns) {
        if (startedAgeMinutes(run) >= staleRunMinutes) {
          const ok = await apiDeleteWithRetry(`/repos/${owner}/${repo}/actions/runs/${run.id}/cancel`);
          if (ok) cancelledRuns.push(run);
        }
      }
      const refreshed = await loadActiveWriterRuns();
      activeRuns = refreshed.activeRuns;
      activeWriterRuns = refreshed.activeWriterRuns;
    }

    const violation = activeWriterRuns.length >= maxConcurrentWriters;
    const report = {
      generatedAt: new Date().toISOString(),
      repository,
      branch,
      activeRunCount: activeRuns.length,
      activeWriterRuns: summarizeRuns(activeWriterRuns),
      cancelledRuns: summarizeRuns(cancelledRuns),
      waitedSeconds: Math.round((Date.now() - startedAt) / 1000),
      severity: violation ? 'warning' : 'ok',
      options: {
        waitMode,
        cancelStale,
        staleRunMinutes,
        waitMaxMinutes,
        waitPollSeconds,
      },
      thresholds: {
        maxConcurrentWriters,
      },
    };

    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(jsonReport, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(mdReport, toMarkdown(report));
    console.log(`Queue guard report written to ${jsonReport}`);

    if (!violation) return;
    if (!waitMode) {
      if (strict) process.exit(1);
      return;
    }
    if (Date.now() - startedAt >= maxWaitMs) {
      if (strict) process.exit(1);
      return;
    }
    await sleep(waitPollSeconds * 1000);
  }
}

main().catch((error) => {
  const report = {
    generatedAt: new Date().toISOString(),
    repository,
    branch,
    activeRunCount: 0,
    activeWriterRuns: [],
    cancelledRuns: [],
    waitedSeconds: 0,
    severity: failOpen ? 'warning' : 'critical',
    options: {
      waitMode,
      cancelStale,
      staleRunMinutes,
      waitMaxMinutes,
      waitPollSeconds,
      failOpen,
      apiRetryMax,
      apiRetryBaseMs,
    },
    thresholds: {
      maxConcurrentWriters,
    },
    error: String(error && error.message ? error.message : error),
    decision: failOpen ? 'continue' : 'block',
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(jsonReport, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(mdReport, toMarkdown(report));
  console.error(`[autonomous-writer-queue-guard] ${error.message}`);
  process.exit(failOpen ? 0 : 1);
});
