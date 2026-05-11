#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Autonomy intelligence planner:
 * - reads core observability/autonomy reports
 * - computes a bounded autonomy score (0-100)
 * - emits prioritized next actions for autonomous agents
 *
 * Output: automation/reports/autonomy-intelligence-plan-latest.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORTS, 'autonomy-intelligence-plan-latest.json');

function readJson(name) {
  const p = path.join(REPORTS, name);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function pushAction(actions, action) {
  actions.push(action);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function main() {
  const digest = readJson('observability-digest-latest.json') || {};
  const releaseRisk = readJson('release-risk-score-latest.json') || {};
  const workflowTrust = readJson('workflow-trust-score-latest.json') || {};
  const leadRouting = readJson('lead-form-routing-guard-latest.json') || {};
  const aggregateRegression = readJson('aggregate-dashboard-regression-latest.json') || {};
  const runnerAnomaly = readJson('openclaw-runner-anomaly-latest.json') || {};

  let score = 100;
  const actions = [];
  const signals = [];

  const smokeFailed = digest?.summary?.productionSmokeOk === false;
  if (smokeFailed) {
    score -= 20;
    signals.push('production_smoke_failed');
    pushAction(actions, {
      priority: 100,
      category: 'reliability',
      command: 'npm run smoke:production:sample',
      reason: 'Production sample smoke has failing routes.',
      suggestedWorkflow: 'ai-production-smoke-scheduled.yml',
    });
  }

  const routeDrift = Number(digest?.summary?.routeDriftInAppNotSitemap ?? 0);
  if (routeDrift >= 5) {
    score -= 15;
    signals.push('route_sitemap_drift_high');
    pushAction(actions, {
      priority: 90,
      category: 'seo',
      command: 'npm run routes:drift:sitemap',
      reason: `Route vs sitemap drift is high (${routeDrift} missing app routes).`,
      suggestedWorkflow: 'ai-route-sitemap-drift-scheduled.yml',
    });
  }

  const ghaCacheFindings = Number(digest?.summary?.ghaNpmCacheFindings ?? 0);
  if (ghaCacheFindings > 0) {
    score -= Math.min(10, ghaCacheFindings * 2);
    signals.push('gha_cache_misconfig');
    pushAction(actions, {
      priority: 80,
      category: 'ci_efficiency',
      command: 'npm run gha:audit:npm-cache',
      reason: `Detected ${ghaCacheFindings} workflow(s) missing npm cache wiring.`,
      suggestedWorkflow: 'ai-gha-npm-cache-audit-scheduled.yml',
    });
  }

  const riskBand = String(releaseRisk?.band || '').toLowerCase();
  if (riskBand === 'critical' || riskBand === 'high') {
    score -= 20;
    signals.push('release_risk_high');
    pushAction(actions, {
      priority: 95,
      category: 'release',
      command: 'npm run release:risk:score:refresh',
      reason: `Release-risk band is ${riskBand || 'high'}.`,
      suggestedWorkflow: 'ai-release-risk-score.yml',
    });
  }

  const trust = Number(workflowTrust?.trustScore ?? 100);
  if (Number.isFinite(trust) && trust < 70) {
    score -= 10;
    signals.push('workflow_trust_low');
    pushAction(actions, {
      priority: 70,
      category: 'governance',
      command: 'npm run automation:workflow-integrity:audit',
      reason: `Workflow trust score is low (${trust}/100).`,
      suggestedWorkflow: 'ai-workflow-integrity-audit.yml',
    });
  }

  const leadHealthy = String(leadRouting?.status || '').toLowerCase() === 'healthy';
  if (!leadHealthy && leadRouting?.status != null) {
    score -= 10;
    signals.push('lead_routing_unhealthy');
    pushAction(actions, {
      priority: 75,
      category: 'business',
      command: 'npm run automation:lead-form-routing:guard',
      reason: 'Lead-routing guard is not healthy; commercial routing may degrade.',
      suggestedWorkflow: 'ai-lead-routing-guard-daily.yml',
    });
  }

  const aggregateAlerts = Number(aggregateRegression?.alertCount ?? 0);
  if (aggregateAlerts > 0) {
    score -= Math.min(15, aggregateAlerts * 3);
    signals.push('aggregate_regression_alerts');
    pushAction(actions, {
      priority: 85,
      category: 'regression',
      command: 'npm run aggregate:regression:check',
      reason: `Aggregate dashboard reports ${aggregateAlerts} regression alert(s).`,
      suggestedWorkflow: 'ai-aggregate-dashboard-regression.yml',
    });
  }

  const runnerCritical = String(runnerAnomaly?.severity || '').toLowerCase() === 'critical';
  if (runnerCritical) {
    score -= 12;
    signals.push('openclaw_runner_anomaly_critical');
    pushAction(actions, {
      priority: 88,
      category: 'autonomy',
      command: 'npm run openclaw:runner',
      reason: 'OpenClaw runner anomaly is critical; autonomy execution reliability degraded.',
      suggestedWorkflow: 'ai-openclaw-runner-guard.yml',
    });
  }

  const sortedActions = actions.sort((a, b) => b.priority - a.priority).slice(0, 8);
  const autonomyScore = clamp(Math.round(score), 0, 100);
  const autonomyBand =
    autonomyScore >= 85 ? 'healthy' : autonomyScore >= 70 ? 'watch' : autonomyScore >= 50 ? 'degraded' : 'critical';

  const payload = {
    generatedAt: new Date().toISOString(),
    autonomyScore,
    autonomyBand,
    signals,
    topActions: sortedActions,
    snapshot: {
      productionSmokeOk: digest?.summary?.productionSmokeOk ?? null,
      ghaNpmCacheFindings: ghaCacheFindings,
      routeDriftInAppNotSitemap: routeDrift,
      releaseRiskBand: releaseRisk?.band ?? null,
      workflowTrustScore: Number.isFinite(trust) ? trust : null,
      leadRoutingStatus: leadRouting?.status ?? null,
      aggregateAlertCount: aggregateAlerts,
      openclawRunnerAnomalySeverity: runnerAnomaly?.severity ?? null,
    },
  };

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(
    `[autonomy-intelligence-planner] score=${payload.autonomyScore} band=${payload.autonomyBand} actions=${payload.topActions.length} -> ${OUT}`,
  );
}

main();
