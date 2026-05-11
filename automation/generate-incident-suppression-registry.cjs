#!/usr/bin/env node
/**
 * Cross-workflow incident suppression registry v3: open-issue counts, breach streaks,
 * EMA-smoothed cooldown hours, deploy/Git correlation, and domain hints for severity orchestration.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'reports', 'incident-suppression-registry-latest.json');
const EMA_ALPHA = Number(process.env.REGISTRY_EMA_ALPHA || 0.35);

function ghIssueCount(titleFragment) {
  try {
    const out = execFileSync(
      'gh',
      [
        'issue',
        'list',
        '--state',
        'open',
        '--search',
        `in:title "${String(titleFragment).replace(/"/g, '')}"`,
        '--json',
        'number',
        '--jq',
        'length',
      ],
      { encoding: 'utf8' },
    );
    return Math.max(0, parseInt(String(out).trim(), 10) || 0);
  } catch {
    return 0;
  }
}

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function readDeployStatus() {
  const p = path.join(__dirname, 'reports', 'deploy-status-latest.json');
  return readJsonSafe(p);
}

function buildCorrelation(prev) {
  const ds = readDeployStatus();
  const shaRaw = process.env.GITHUB_SHA || ds?.sha || prev?.correlation?.commitSha || null;
  const commitSha = shaRaw && String(shaRaw) !== 'unknown' ? String(shaRaw) : null;
  const runId = process.env.GITHUB_RUN_ID || null;
  const repo = process.env.GITHUB_REPOSITORY || null;
  const workflow = process.env.GITHUB_WORKFLOW || null;
  const server = (process.env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, '');
  const runUrl = repo && runId ? `${server}/${repo}/actions/runs/${runId}` : null;

  return {
    correlationId: runId ? `suppression-reg-${runId}` : `suppression-reg-local-${Date.now()}`,
    registryWorkflowRunId: runId,
    registryWorkflow: workflow || 'AI Incident Suppression Registry',
    repository: repo,
    commitSha,
    workflowRunUrl: runUrl,
    deployStatusSnapshot: ds
      ? {
          source: ds.source ?? null,
          status: ds.status ?? null,
          sha: ds.sha && ds.sha !== 'unknown' ? ds.sha : null,
          runId: ds.runId ?? null,
          workflow: ds.workflow ?? null,
          netlifyDeployId: ds.netlifyDeployId ?? ds.netlify_deploy_id ?? null,
          netlifyDeployUrl: ds.netlifyDeployUrl ?? ds.netlify_deploy_url ?? null,
        }
      : null,
  };
}

function pm2SloUnhealthy() {
  const p = path.join(__dirname, 'reports', 'pm2-slo-latest.json');
  const j = readJsonSafe(p);
  if (!j) return false;
  return Number(j.unhealthyCount || 0) > 0 || Number(j.criticalCount || 0) > 0;
}

function pm2RestartUnhealthy() {
  const p = path.join(__dirname, 'reports', 'pm2-restart-guardian-latest.json');
  const j = readJsonSafe(p);
  if (!j) return false;
  return Number(j.unhealthyCount || 0) > 0;
}

function openclawUnhealthy() {
  const p = path.join(__dirname, 'reports', 'openclaw-autonomous-app-improver-latest.json');
  const j = readJsonSafe(p);
  if (!j) return false;
  const checks = [
    Number(j.contractFailures || 0) >= 1,
    Number(j.lowValueCycles || 0) >= 8,
    Number(j.parseFailures || 0) >= 8,
    Number(j.failures || 0) > Number(j.successes || 0) + 8,
  ];
  return checks.some(Boolean);
}

function openclawSlaBreached() {
  const p = path.join(__dirname, 'reports', 'openclaw-autonomous-app-improver-latest.json');
  const j = readJsonSafe(p);
  if (!j) {
    return true;
  }
  const ts = Date.parse(j.updatedAt || '');
  if (!Number.isFinite(ts)) {
    return true;
  }
  const ageSeconds = Math.floor((Date.now() - ts) / 1000);
  const failures = Number(j.failures || 0);
  const successes = Number(j.successes || 0);
  const failureOk = failures <= successes + 5;
  return !(ageSeconds <= 5400 && failureOk);
}

function streak(prev, unhealthy) {
  const n = Number(prev || 0);
  if (unhealthy) {
    return n + 1;
  }
  return 0;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function main() {
  const prev = readJsonSafe(OUT) || {};
  const prevDomains = prev.domains || {};

  const openIssueCounts = {
    openclaw: ghIssueCount('Openclaw incident: sustained unhealthy autonomous cycles'),
    pm2:
      ghIssueCount('PM2 SLO critical breach detected') +
      ghIssueCount('PM2 SLO warnings (non-critical)') +
      ghIssueCount('PM2 restart guardian alert'),
    sla: ghIssueCount('Openclaw freshness SLA breach'),
  };

  const totalOpen =
    openIssueCounts.openclaw + openIssueCounts.pm2 + openIssueCounts.sla;

  const dPm2Slo = {
    breachStreak: streak(prevDomains.pm2Slo?.breachStreak, pm2SloUnhealthy()),
    openIssueCount: ghIssueCount('PM2 SLO critical breach detected'),
  };
  const dPm2Restart = {
    breachStreak: streak(prevDomains.pm2Restart?.breachStreak, pm2RestartUnhealthy()),
    openIssueCount: ghIssueCount('PM2 restart guardian alert'),
  };
  const dOpenclaw = {
    breachStreak: streak(prevDomains.openclawIncident?.breachStreak, openclawUnhealthy()),
    openIssueCount: ghIssueCount('Openclaw incident: sustained unhealthy autonomous cycles'),
  };
  const dSla = {
    breachStreak: streak(prevDomains.openclawSla?.breachStreak, openclawSlaBreached()),
    openIssueCount: ghIssueCount('Openclaw freshness SLA breach'),
  };

  const maxStreak = Math.max(
    dPm2Slo.breachStreak,
    dPm2Restart.breachStreak,
    dOpenclaw.breachStreak,
    dSla.breachStreak,
  );

  const prevEma = prev.noise?.emaOpenIncidents;
  const emaOpen =
    prevEma == null || !Number.isFinite(Number(prevEma))
      ? totalOpen
      : EMA_ALPHA * totalOpen + (1 - EMA_ALPHA) * Number(prevEma);

  let fromEma = 4 + Math.round(emaOpen * 1.35);
  fromEma = clamp(fromEma, 4, 22);
  if (maxStreak >= 3) {
    fromEma = Math.max(fromEma, 12);
  }
  if (totalOpen >= 6) {
    fromEma = Math.min(24, fromEma + 2);
  }

  const prevRec = Number(prev.recommendedCooldownHours || prev.cooldownHours || 6);
  const safePrev = Number.isFinite(prevRec) && prevRec > 0 ? prevRec : 6;
  let recommended = clamp(Math.round(0.42 * fromEma + 0.58 * safePrev), 4, 24);

  const noiseLevel =
    emaOpen >= 5 ? 'high' : emaOpen >= 2.5 ? 'medium' : 'low';

  const openclawCooldownHours = clamp(Math.max(recommended, 12), 4, 24);
  const slaCooldownHours = clamp(Math.max(recommended, 12), 4, 24);

  const correlation = buildCorrelation(prev);

  const next = {
    version: 3,
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    correlation,
    noise: {
      emaOpenIncidents: Number(emaOpen.toFixed(3)),
      emaAlpha: EMA_ALPHA,
      rawOpenTotal: totalOpen,
    },
    openIssueCounts,
    totalOpenIncidents: totalOpen,
    recommendedCooldownHours: recommended,
    cooldownHours: recommended,
    openclawCooldownHours,
    slaCooldownHours,
    domains: {
      pm2Slo: dPm2Slo,
      pm2Restart: dPm2Restart,
      openclawIncident: dOpenclaw,
      openclawSla: dSla,
    },
    tuning: {
      noiseLevel,
      maxBreachStreak: maxStreak,
      reason:
        maxStreak >= 3
          ? 'Sustained breach streak — elevated cooldown floor.'
          : emaOpen > (prev.noise?.emaOpenIncidents ?? 0)
            ? 'EMA open-incident load increased — slightly longer cooldown.'
            : emaOpen < (prev.noise?.emaOpenIncidents ?? emaOpen)
              ? 'EMA open-incident load decreased — cooldown easing.'
              : 'Steady EMA state.',
    },
    notes:
      'v3: EMA-smoothed cooldowns, workflow/deploy correlation, Netlify fields via deploy-status-latest.json when present.',
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  console.log('Wrote', OUT, 'recommendedCooldownHours=', recommended, 'emaOpen=', emaOpen);
}

main();
