import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { AILabToolLayout } from '../../components/ai-lab/AILabToolLayout';

type DeployStatus = {
  generatedAt?: string;
  status?: string;
  sha?: string;
  workflow?: string;
  runId?: string | number | null;
  netlifyDeployId?: string | null;
  netlifyDeployUrl?: string | null;
};

type SuppressionRegistry = {
  version?: number;
  generatedAt?: string;
  correlation?: {
    correlationId?: string;
    workflowRunUrl?: string | null;
    commitSha?: string | null;
    repository?: string | null;
    deployStatusSnapshot?: {
      sha?: string | null;
      netlifyDeployId?: string | null;
      netlifyDeployUrl?: string | null;
    } | null;
  };
  noise?: { emaOpenIncidents?: number; rawOpenTotal?: number };
  recommendedCooldownHours?: number;
};

type AutomationIssueIndex = {
  generatedAt?: string;
  openAutomationFingerprintIssues?: number;
  issues?: Array<{
    number: number;
    title: string;
    url: string;
    fingerprintLabels?: string[];
  }>;
  mttr?: {
    samples?: number;
    avgHours?: number | null;
    band?: string;
    trend?: { previousAvgHours?: number | null; deltaHours?: number | null; direction?: string };
    history?: Array<{ generatedAt?: string; avgHours?: number | null; samples?: number; band?: string }>;
    byFingerprint?: Array<{ label: string; samples: number; avgHours: number }>;
  };
};

type DeployWatchdog = {
  timestamp?: string;
  healthy?: boolean;
  unhealthyCount?: number;
  unhealthyRoutes?: string[];
};
type NetlifyPreviewSmoke = {
  generatedAt?: string;
  skipped?: boolean;
  baseUrl?: string;
  unhealthyCount?: number;
  routes?: Array<{ path: string; status: number; ok: boolean }>;
};
type NetlifyPreviewSmokeState = {
  updatedAt?: string;
  consecutiveFailures?: number;
  latestUnhealthyCount?: number;
};

type PromotionConfidence = {
  generatedAt?: string;
  gatedThreshold?: number;
  routeScores?: Array<{ route: string; score: number; status: string }>;
};
type PromotionConfidenceHistoryEntry = {
  timestamp: string;
  avgScore: number;
  lowCount: number;
  watchOrLowCount: number;
};
type ObservabilityHistoryEntry = {
  timestamp: string;
  ema: number;
  fpCount: number;
  emaBreached?: boolean;
  fpBreached?: boolean;
};

type SmokeHealthEntry = {
  timestamp: string;
  prodOk: boolean | null;
  prodTargetSource?: string | null;
  previewSkipped?: boolean | null;
  previewOk?: boolean | null;
  previewFailureClass?: string | null;
};

type AggregateRegressionDiffHistory = {
  generatedAt?: string;
  points?: Array<{
    generatedAt?: string;
    worsened?: boolean;
    recovered?: boolean;
    currentAlertCount?: number;
    summaryStatus?: string;
  }>;
};

type ReleaseRiskScore = {
  generatedAt?: string;
  riskScore?: number;
  healthScore?: number;
  band?: string;
  components?: { regression?: number; routeDrift?: number; smoke?: number };
  detail?: {
    smokeStreak?: number;
    scheduledSmoke?: { allOk?: boolean; failedCount?: number | null };
  };
};

type AutonomyIntelligencePlan = {
  generatedAt?: string;
  autonomyScore?: number;
  autonomyBand?: string;
  signals?: string[];
  topActions?: Array<{
    priority?: number;
    category?: string;
    command?: string;
    reason?: string;
    suggestedWorkflow?: string;
  }>;
};

function smokeRollupSpark(entries: SmokeHealthEntry[], mode: 'prod' | 'preview'): string {
  if (entries.length === 0) return 'n/a';
  return entries
    .map((e) => {
      if (mode === 'prod') {
        if (e.prodOk === null) return '~';
        return e.prodOk ? '|' : '.';
      }
      if (e.previewSkipped === true) return 's';
      if (e.previewOk === null) return '~';
      return e.previewOk ? '|' : '.';
    })
    .join('');
}

function tinySparkline(values: number[]): string {
  if (values.length === 0) return 'n/a';
  const max = Math.max(...values, 1);
  return values
    .map((v) => {
      const ratio = v / max;
      if (ratio < 0.2) return '.';
      if (ratio < 0.4) return ':';
      if (ratio < 0.6) return '*';
      if (ratio < 0.8) return 'o';
      return '#';
    })
    .join('');
}

function freshnessMeta(timestamp?: string | null): {
  badge: string;
  badgeClass: string;
  ageLabel: string;
} {
  if (!timestamp) {
    return { badge: 'n/a', badgeClass: 'bg-slate-800 text-slate-300', ageLabel: 'n/a' };
  }
  const t = new Date(timestamp).getTime();
  if (!Number.isFinite(t)) {
    return { badge: 'invalid', badgeClass: 'bg-rose-900/70 text-rose-200', ageLabel: 'invalid timestamp' };
  }
  const ageHours = (Date.now() - t) / 3600000;
  const ageLabel = ageHours < 1 ? `${Math.round(ageHours * 60)}m` : `${ageHours.toFixed(1)}h`;
  if (ageHours <= 12) {
    return { badge: 'fresh', badgeClass: 'bg-emerald-900/70 text-emerald-200', ageLabel };
  }
  if (ageHours <= 36) {
    return { badge: 'aging', badgeClass: 'bg-amber-900/70 text-amber-100', ageLabel };
  }
  return { badge: 'stale', badgeClass: 'bg-rose-900/70 text-rose-100', ageLabel };
}

function runnerExitSpark(entries: Array<{ exitCode?: number }>): string {
  if (!entries.length) return 'n/a';
  return entries
    .map((e) => {
      const code = Number(e.exitCode ?? 0);
      if (code === 0) return '|';
      if (code === 1) return '.';
      return '!';
    })
    .join('');
}

function calculateRunnerMttrHours(
  entries: Array<{ timestampIso?: string; exitCode?: number }>,
): { avgHours: number | null; samples: number } {
  if (entries.length < 2) return { avgHours: null, samples: 0 };
  const durations: number[] = [];
  let openFailureStart: Date | null = null;
  for (const e of entries) {
    const ts = e.timestampIso ? new Date(e.timestampIso) : null;
    if (!ts || Number.isNaN(ts.getTime())) continue;
    const code = Number(e.exitCode ?? 0);
    if (code !== 0 && !openFailureStart) {
      openFailureStart = ts;
      continue;
    }
    if (code === 0 && openFailureStart) {
      const hours = (ts.getTime() - openFailureStart.getTime()) / 3600000;
      if (hours >= 0) durations.push(hours);
      openFailureStart = null;
    }
  }
  if (!durations.length) return { avgHours: null, samples: 0 };
  const avg = durations.reduce((sum, v) => sum + v, 0) / durations.length;
  return { avgHours: Math.round(avg * 10) / 10, samples: durations.length };
}

type ScheduledSmokeReport = {
  generatedAt?: string;
  baseUrl?: string;
  targetSource?: string;
  allOk?: boolean;
  failedCount?: number;
};

type NetlifyPreviewSmokeReport = {
  generatedAt?: string;
  baseUrl?: string;
  skipped?: boolean;
  reason?: string;
  unhealthyCount?: number;
  failureClass?: string;
};

type AggregateRegressionReport = {
  generatedAt?: string;
  summaryStatus?: string;
  alertCount?: number;
  alerts?: Array<{ type?: string; detail?: string | number }>;
};

type OpenClawRunnerSnapshot = {
  exitCode?: number;
  reason?: string;
  timestamp?: string;
  dryRunPlanned?: unknown[];
  executed?: unknown[];
  skippedHold?: unknown[];
};

type OpenClawRunnerHistory = {
  version?: number;
  generatedAt?: string;
  entries?: Array<{
    timestampIso?: string;
    exitCode?: number;
    reason?: string;
    runId?: string;
  }>;
};

type OpenClawRunnerGuardState = {
  consecutiveHealthy?: number;
  lastExitCode?: number | null;
  lastReason?: string | null;
  lastUpdatedAt?: string;
};

type ObservabilityDigest = {
  generatedAt?: string;
  summary?: {
    productionSmokeOk?: boolean;
    productionSmokeFailedCount?: number;
    ghaNpmCacheFindings?: number;
    routeDriftInAppNotSitemap?: number;
    routeDriftStatus?: string;
    fingerprintDigestPresent?: boolean;
    fingerprintDigestOpen?: number | null;
    fingerprintDigestSeverity?: string | null;
    fingerprintDigestGeneratedAt?: string | null;
    fingerprintTrendLastOpen?: number | null;
    fingerprintTrendLastNewCount?: number | null;
    fingerprintTrendLastSeverity?: string | null;
    fingerprintTrendLastRegistryEma?: number | null;
    openclawRunnerAnomalyDetected?: boolean;
    openclawRunnerAnomalySeverity?: string | null;
    openclawRunnerAnomalyAlertCount?: number | null;
    openclawRunnerAnomalySummary?: string | null;
    openclawRunnerAnomalyGeneratedAt?: string | null;
  };
};
type WorkflowTrustScore = {
  generatedAt?: string;
  trustScore?: number;
  band?: string;
  factors?: {
    workflowCount?: number;
    criticalFindings?: number;
    warningFindings?: number;
    duplicateBodies?: number;
    duplicateNames?: number;
  };
};
type LeadFormRoutingGuard = {
  generatedAt?: string;
  status?: string;
  targetEmail?: string;
  findings?: Array<{ type?: string; severity?: string; file?: string; detail?: string }>;
};
type WorkflowTrustHistory = {
  points?: Array<{ generatedAt?: string; trustScore?: number; band?: string }>;
};
type LeadRoutingSyntheticTrend = {
  generatedAt?: string;
  status?: string;
  score?: number;
  warnLikeStreak?: number;
  streakThreshold?: number;
  shouldEscalate?: boolean;
  issueOpen?: boolean;
};
type AutomationHealth = {
  generatedAt?: string;
  severity?: string;
  emaOpenIncidents?: number;
  previewUnhealthyCount?: number;
  openFingerprintIssues?: number;
  sloScore?: number;
  sloDeltaFromPrevious?: number | null;
  telemetryFreshness?: {
    suppressionRegistryAt?: string;
    deployStatusAt?: string;
    previewSmokeAt?: string;
    issueIndexAt?: string;
    observabilityEmaFpHistoryAt?: string;
    smokeHealthHistoryAt?: string;
    automationHealthHistoryAt?: string;
  };
};

type AutomationHealthHistoryFile = {
  points?: Array<{ sloScore?: number }>;
};

type FingerprintTrendFile = {
  history?: Array<{
    generatedAt?: string;
    open?: number;
    newCount?: number;
    resolvedCount?: number;
    severity?: string;
    registryEma?: number | null;
  }>;
};

type AiLabIntegrityReport = {
  at?: string;
  ok?: boolean;
  totalTools?: number;
  missingCount?: number;
  remediatedCount?: number;
  smokeRoutesSynced?: boolean;
};

type Pm2DuplicateHealerReport = {
  at?: string;
  ok?: boolean;
  duplicates?: Array<{ name?: string; count?: number }>;
  healed?: unknown[];
  deployLockActive?: boolean;
  healSkippedForDeployLock?: boolean;
};

type LegacyScaffoldWatchdog = {
  at?: string;
  count?: number;
  threshold?: number;
  thresholdMode?: string;
  historySamples?: number;
  escalated?: boolean;
  meshSuppressed?: boolean;
  meshReason?: string | null;
  meshLastAt?: string | null;
  withinThreshold?: boolean;
};
type LegacyScaffoldScanHistoryEntry = { at?: string; count?: number };
type AiLabHubLinksCompare = {
  generatedAt?: string;
  prodFailedCount?: number;
  previewFailedCount?: number;
  regressedInPreview?: string[];
  regressedInProd?: string[];
  severity?: string;
};
type AiLabHubLinksCompareHistoryEntry = {
  generatedAt?: string;
  prodFailedCount?: number;
  previewFailedCount?: number;
  regressedInPreviewCount?: number;
  regressedInProdCount?: number;
  recoveredCount?: number;
};
type IncidentCooldownMesh = {
  updatedAt?: string;
  fingerprints?: Record<string, { lastEscalationAt?: string; meta?: { reason?: string } }>;
};

type MttrSloGuardSnapshot = {
  generatedAt?: string;
  openAutomationFingerprintIssues?: number;
  mttr?: { avgHours?: number | null; samples?: number; band?: string };
  consecutiveCritical?: number;
  automationHealthScore?: number;
  fingerprintRegressions?: Array<{
    label: string;
    prevAvgHours: number;
    avgHours: number;
    deltaHours: number;
  }>;
  pagerDuty?: {
    eligible?: boolean;
    sent?: boolean;
    skippedReason?: string | null;
    minOpenFp?: number;
    cooldownHours?: number;
    lastPagerDutyAt?: string | null;
  };
};

type MttrFingerprintRegressionSnapshot = {
  generatedAt?: string;
  config?: {
    deltaHoursThreshold?: number;
    streakThreshold?: number;
    minSamples?: number;
    meshSuppressionHours?: number;
    criticalDeltaHours?: number;
    criticalStreak?: number;
  };
  observed?: Array<{
    label: string;
    avgHours: number;
    prevAvgHours?: number | null;
    deltaHours?: number | null;
    samples: number;
    regressionStreak: number;
    runbookUrl?: string | null;
    severity?: string;
    priorityScore?: number;
    status?: string;
    suppressionReason?: string;
    suppressedByPriority?: number | null;
    labelSync?: string;
    severityTransition?: string;
  }>;
  escalated?: Array<{ label: string; deltaHours?: number | null; regressionStreak?: number; severity?: string }>;
  recovered?: Array<{ label: string }>;
};
type MttrFingerprintSuppressionExplainability = {
  generatedAt?: string;
  summary?: {
    observed?: number;
    suppressed?: number;
    escalated?: number;
    recovered?: number;
  };
};

type OpenClawRunnerAnomalyReport = {
  generatedAt?: string;
  anomalyDetected?: boolean;
  severity?: string;
  criticalConsecutive?: number;
  summary?: string;
  alerts?: string[];
};
type OpenClawRunnerAnomalyHistoryEntry = {
  generatedAt?: string;
  anomalyDetected?: boolean;
  severity?: string;
  alertCount?: number;
};

function readJson<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

export default function DeployDriftDashboardPage() {
  const reportsDir = path.join(process.cwd(), 'automation', 'reports');
  const deployStatus = readJson<DeployStatus>(path.join(reportsDir, 'deploy-status-latest.json'));
  const suppression = readJson<SuppressionRegistry>(
    path.join(reportsDir, 'incident-suppression-registry-latest.json'),
  );
  const issueIndex = readJson<AutomationIssueIndex>(
    path.join(reportsDir, 'automation-open-issues-index-latest.json'),
  );
  const mttrSloGuard = readJson<MttrSloGuardSnapshot>(
    path.join(reportsDir, 'mttr-slo-guard-latest.json'),
  );
  const mttrFingerprintGuard = readJson<MttrFingerprintRegressionSnapshot>(
    path.join(reportsDir, 'mttr-fingerprint-regression-latest.json'),
  );
  const mttrFingerprintExplainability = readJson<MttrFingerprintSuppressionExplainability>(
    path.join(reportsDir, 'mttr-fingerprint-suppression-explainability-latest.json'),
  );
  const incidentCooldownMesh = readJson<IncidentCooldownMesh>(
    path.join(reportsDir, 'automation-incident-cooldown-mesh.json'),
  );
  const watchdog = readJson<DeployWatchdog>(path.join(reportsDir, 'deploy-watchdog-latest.json'));
  const previewSmoke = readJson<NetlifyPreviewSmoke>(
    path.join(reportsDir, 'netlify-preview-smoke-latest.json'),
  );
  const previewSmokeState = readJson<NetlifyPreviewSmokeState>(
    path.join(reportsDir, 'netlify-preview-smoke-state.json'),
  );
  const observabilityHistory = readJson<ObservabilityHistoryEntry[]>(
    path.join(reportsDir, 'observability-ema-fp-history.json'),
  ) ?? [];
  const confidence = readJson<PromotionConfidence>(
    path.join(reportsDir, 'promotion-confidence-latest.json'),
  );
  const scheduledSmoke = readJson<ScheduledSmokeReport>(
    path.join(reportsDir, 'scheduled-production-smoke-latest.json'),
  );
  const netlifyPreviewSmoke = readJson<NetlifyPreviewSmokeReport>(
    path.join(reportsDir, 'netlify-preview-smoke-latest.json'),
  );
  const openclawRunner = readJson<OpenClawRunnerSnapshot>(
    path.join(reportsDir, 'openclaw-runner-latest.json'),
  );
  const openclawRunnerHistory = readJson<OpenClawRunnerHistory>(
    path.join(reportsDir, 'openclaw-runner-history.json'),
  );
  const openclawRunnerGuardState = readJson<OpenClawRunnerGuardState>(
    path.join(reportsDir, 'openclaw-runner-guard-state.json'),
  );
  const openclawRunnerAnomaly = readJson<OpenClawRunnerAnomalyReport>(
    path.join(reportsDir, 'openclaw-runner-anomaly-latest.json'),
  );
  const openclawRunnerAnomalyHistory = readJson<OpenClawRunnerAnomalyHistoryEntry[]>(
    path.join(reportsDir, 'openclaw-runner-anomaly-history.json'),
  ) ?? [];
  const smokeHealthHistory = readJson<SmokeHealthEntry[]>(
    path.join(reportsDir, 'smoke-health-history.json'),
  ) ?? [];
  const aggregateRegression = readJson<AggregateRegressionReport>(
    path.join(reportsDir, 'aggregate-dashboard-regression-latest.json'),
  );
  const aggregateRegressionDiffHistory = readJson<AggregateRegressionDiffHistory>(
    path.join(reportsDir, 'aggregate-regression-diff-history.json'),
  );
  const releaseRiskScore = readJson<ReleaseRiskScore>(
    path.join(reportsDir, 'release-risk-score-latest.json'),
  );
  const workflowTrustScore = readJson<WorkflowTrustScore>(
    path.join(reportsDir, 'workflow-trust-score-latest.json'),
  );
  const leadRoutingGuard = readJson<LeadFormRoutingGuard>(
    path.join(reportsDir, 'lead-form-routing-guard-latest.json'),
  );
  const workflowTrustHistory = readJson<WorkflowTrustHistory>(
    path.join(reportsDir, 'workflow-trust-history.json'),
  );
  const leadRoutingSyntheticTrend = readJson<LeadRoutingSyntheticTrend>(
    path.join(reportsDir, 'lead-routing-synthetic-trend-v3-latest.json'),
  );
  const observabilityDigest = readJson<ObservabilityDigest>(
    path.join(reportsDir, 'observability-digest-latest.json'),
  );
  const autonomyIntelligencePlan = readJson<AutonomyIntelligencePlan>(
    path.join(reportsDir, 'autonomy-intelligence-plan-latest.json'),
  );
  const automationHealth = readJson<AutomationHealth>(
    path.join(reportsDir, 'automation-health-latest.json'),
  );
  const automationHealthHistory = readJson<AutomationHealthHistoryFile>(
    path.join(reportsDir, 'automation-health-history.json'),
  );
  const sloHistPts = Array.isArray(automationHealthHistory?.points)
    ? automationHealthHistory.points.slice(-24)
    : [];
  const sloSpark = tinySparkline(sloHistPts.map((p) => Number(p.sloScore ?? 0)));
  const fpTrend = readJson<FingerprintTrendFile>(
    path.join(reportsDir, 'automation-fingerprint-incidents-trend.json'),
  );
  const aiLabIntegrity = readJson<AiLabIntegrityReport>(
    path.join(reportsDir, 'ai-lab-integrity-latest.json'),
  );
  const pm2DuplicateHealer = readJson<Pm2DuplicateHealerReport>(
    path.join(reportsDir, 'pm2-duplicate-healer-latest.json'),
  );
  const legacyScaffoldWatchdog = readJson<LegacyScaffoldWatchdog>(
    path.join(reportsDir, 'ai-lab-legacy-scaffold-watchdog-latest.json'),
  );
  const legacyScaffoldHistory = readJson<LegacyScaffoldScanHistoryEntry[]>(
    path.join(reportsDir, 'ai-lab-legacy-scaffold-scan-history.json'),
  ) ?? [];
  const aiLabHubLinksCompare = readJson<AiLabHubLinksCompare>(
    path.join(reportsDir, 'ai-lab-hub-links-smoke-compare-latest.json'),
  );
  const aiLabHubLinksCompareHistory = readJson<AiLabHubLinksCompareHistoryEntry[]>(
    path.join(reportsDir, 'ai-lab-hub-links-smoke-compare-history.json'),
  ) ?? [];
  const confidenceHistory = readJson<PromotionConfidenceHistoryEntry[]>(
    path.join(reportsDir, 'promotion-confidence-history.json'),
  ) ?? [];
  const last7 = confidenceHistory.slice(-7);
  const last30 = confidenceHistory.slice(-30);
  const smokeHistLast30 = smokeHealthHistory.slice(-30);
  const prodSmokeSpark = smokeRollupSpark(smokeHistLast30, 'prod');
  const previewSmokeSpark = smokeRollupSpark(smokeHistLast30, 'preview');
  const obsLast30 = observabilityHistory.slice(-30);
  const avg = (arr: PromotionConfidenceHistoryEntry[]) =>
    arr.length ? Math.round(arr.reduce((sum, item) => sum + item.avgScore, 0) / arr.length) : null;
  const trend7 = avg(last7);
  const trend30 = avg(last30);
  const emaSeries = obsLast30.map((x) => Number(x.ema || 0));
  const fpSeries = obsLast30.map((x) => Number(x.fpCount || 0));
  const emaSpark = tinySparkline(emaSeries);
  const fpSpark = tinySparkline(fpSeries);
  const fpTrendHist = (fpTrend?.history ?? []).slice(-30);
  const fpDigestOpenSpark = tinySparkline(fpTrendHist.map((x) => Number(x.open ?? 0)));
  const fpDigestEmaSpark = tinySparkline(fpTrendHist.map((x) => Number(x.registryEma ?? 0)));
  const legacyHistLast24 = legacyScaffoldHistory.slice(-24);
  const legacyCountSpark = tinySparkline(legacyHistLast24.map((x) => Number(x.count ?? 0)));
  const aiLabHubLast30 = aiLabHubLinksCompareHistory.slice(-30);
  const aiLabHubLast7 = aiLabHubLinksCompareHistory.slice(-7);
  const aiLabHubProdSpark = tinySparkline(aiLabHubLast30.map((x) => Number(x.prodFailedCount ?? 0)));
  const aiLabHubPreviewSpark = tinySparkline(aiLabHubLast30.map((x) => Number(x.previewFailedCount ?? 0)));
  const aiLabHubNewRegressions7 = aiLabHubLast7.reduce(
    (sum, row) => sum + Number(row.regressedInPreviewCount ?? 0) + Number(row.regressedInProdCount ?? 0),
    0,
  );
  const aiLabHubRecovered7 = aiLabHubLast7.reduce((sum, row) => sum + Number(row.recoveredCount ?? 0), 0);
  const meshRows = Object.entries(incidentCooldownMesh?.fingerprints ?? {})
    .map(([fingerprint, row]) => ({ fingerprint, at: row?.lastEscalationAt ?? null, reason: row?.meta?.reason ?? null }))
    .filter((r) => Boolean(r.at))
    .sort((a, b) => new Date(String(b.at)).getTime() - new Date(String(a.at)).getTime())
    .slice(0, 5);
  const aggDiffHistPts = (aggregateRegressionDiffHistory?.points ?? []).slice(-30);
  const aggDiffSpark = tinySparkline(
    aggDiffHistPts.map((p) => (p.worsened ? 90 : p.recovered ? 12 : 48)),
  );
  const lowConfidence = (confidence?.routeScores ?? [])
    .filter((item) => item.score < (confidence?.gatedThreshold ?? 60))
    .slice(0, 8);
  const runnerHistEntries = openclawRunnerHistory?.entries ?? [];
  const runnerHistLast30 = runnerHistEntries.slice(-30);
  const runnerExitTrend = runnerExitSpark(runnerHistLast30);
  const runnerMttr = calculateRunnerMttrHours(runnerHistEntries);
  const runnerAnomalyDetected =
    openclawRunnerAnomaly?.anomalyDetected === true ||
    observabilityDigest?.summary?.openclawRunnerAnomalyDetected === true;
  const runnerAnomalySummary =
    openclawRunnerAnomaly?.summary ||
    observabilityDigest?.summary?.openclawRunnerAnomalySummary ||
    'n/a';
  const runnerAnomalySeverity =
    openclawRunnerAnomaly?.severity ||
    observabilityDigest?.summary?.openclawRunnerAnomalySeverity ||
    (runnerAnomalyDetected ? 'info' : 'none');
  const runnerAnomalyLast30 = openclawRunnerAnomalyHistory.slice(-30);
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const runnerAnomalyCritical24h = openclawRunnerAnomalyHistory.filter((x) => {
    const ts = x.generatedAt ? Date.parse(String(x.generatedAt)) : NaN;
    return Number.isFinite(ts) && ts >= dayAgo && String(x.severity || '').toLowerCase() === 'critical';
  }).length;
  const runnerAnomalyCriticalConsecutive = Number.parseInt(String(openclawRunnerAnomaly?.criticalConsecutive ?? '0'), 10) || 0;
  const runnerAnomalyTrendTier =
    runnerAnomalyCritical24h >= 5 ? 'critical' : runnerAnomalyCritical24h >= 3 ? 'warning' : 'clear';
  const runnerAnomalySpark = tinySparkline(
    runnerAnomalyLast30.map((x) => {
      const sev = String(x.severity || '').toLowerCase();
      if (sev === 'critical') return 100;
      if (sev === 'warning') return 70;
      if (sev === 'info') return 40;
      return x.anomalyDetected ? 40 : 10;
    }),
  );
  const releaseSignals = {
    deployOk: deployStatus?.status === 'success',
    watchdogOk: watchdog?.healthy === true,
    obsOk: observabilityDigest?.summary?.productionSmokeOk !== false,
    fpCritical: observabilityDigest?.summary?.fingerprintDigestSeverity === 'critical',
  };
  const releaseHealth =
    !releaseSignals.deployOk || !releaseSignals.watchdogOk || releaseSignals.fpCritical
      ? 'degraded'
      : releaseSignals.obsOk
        ? 'healthy'
        : 'watch';
  const workflowTrustBand = String(workflowTrustScore?.band || 'n/a').toLowerCase();
  const workflowTrustClass =
    workflowTrustBand === 'high'
      ? 'text-emerald-300'
      : workflowTrustBand === 'medium'
        ? 'text-amber-200'
        : workflowTrustBand === 'low'
          ? 'text-amber-300'
          : 'text-rose-300';
  const leadRoutingStatus = String(leadRoutingGuard?.status || 'n/a').toLowerCase();
  const leadRoutingClass = leadRoutingStatus === 'healthy' ? 'text-emerald-300' : 'text-rose-300';
  const workflowTrustSpark = tinySparkline(
    (workflowTrustHistory?.points ?? []).slice(-30).map((p) => Number(p.trustScore ?? 0)),
  );
  const leadSyntheticStatus = String(leadRoutingSyntheticTrend?.status || 'n/a').toLowerCase();

  const corr = suppression?.correlation;
  const repoSlug =
    corr?.repository ||
    process.env.NEXT_PUBLIC_GITHUB_REPOSITORY ||
    'Zion-support/zion.app';
  const issuesSearchUrl = `https://github.com/${repoSlug}/issues?q=is%3Aopen+label%3Aautomation-incident`;
  const runnerFingerprint = 'openclaw-runner-guard|dry-run-fail|v2';
  const runnerIssueSearchUrl = `https://github.com/${repoSlug}/issues?q=is%3Aissue+${encodeURIComponent(runnerFingerprint)}`;
  const runnerAnomalyCriticalFingerprint = 'openclaw-runner-anomaly|critical|v1';
  const runnerAnomalyIssueSearchUrl = `https://github.com/${repoSlug}/issues?q=is%3Aissue+${encodeURIComponent(runnerAnomalyCriticalFingerprint)}`;
  const runnerAnomalyTrendWarnFingerprint = 'openclaw-runner-anomaly-trend-breach|24h|v1';
  const runnerAnomalyTrendCritFingerprint = 'openclaw-runner-anomaly-trend-breach|24h|critical|v1';
  const runnerAnomalyTrendIssueSearchUrl = `https://github.com/${repoSlug}/issues?q=is%3Aissue+${encodeURIComponent(`${runnerAnomalyTrendWarnFingerprint} OR ${runnerAnomalyTrendCritFingerprint}`)}`;

  return (
    <div className="bg-slate-950/95">
      <AILabToolLayout
        title="Deploy Drift Dashboard"
        subtitle="Visibility into deploy status, route-health drift, and autonomous release confidence."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Latest deploy status</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{deployStatus?.status ?? 'unknown'}</p>
            <p className="mt-2 text-xs text-slate-300">
              SHA: {(deployStatus?.sha ?? 'unknown').slice(0, 8)} | {deployStatus?.generatedAt ?? 'n/a'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Watchdog health</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {watchdog?.healthy ? 'healthy' : 'degraded'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              Unhealthy routes: {watchdog?.unhealthyCount ?? 0} | {watchdog?.timestamp ?? 'n/a'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Release health (cross-workflow)</p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                releaseHealth === 'healthy'
                  ? 'text-emerald-300'
                  : releaseHealth === 'watch'
                    ? 'text-amber-300'
                    : 'text-rose-300'
              }`}
            >
              {releaseHealth}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              deploy:{releaseSignals.deployOk ? 'ok' : 'bad'} · watchdog:{releaseSignals.watchdogOk ? 'ok' : 'bad'} ·
              obs:{releaseSignals.obsOk ? 'ok' : 'bad'} · fp-critical:{releaseSignals.fpCritical ? 'yes' : 'no'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Workflow trust score</p>
            <p className={`mt-2 text-2xl font-semibold ${workflowTrustClass}`}>
              {workflowTrustScore?.trustScore ?? 'n/a'}
              {workflowTrustScore?.trustScore != null ? '/100' : ''}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              band: {workflowTrustScore?.band ?? 'n/a'} · critical:{' '}
              {workflowTrustScore?.factors?.criticalFindings ?? 'n/a'} · warning:{' '}
              {workflowTrustScore?.factors?.warningFindings ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              workflows: {workflowTrustScore?.factors?.workflowCount ?? 'n/a'} · dup-name:{' '}
              {workflowTrustScore?.factors?.duplicateNames ?? 'n/a'} · dup-body:{' '}
              {workflowTrustScore?.factors?.duplicateBodies ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">Updated: {workflowTrustScore?.generatedAt ?? 'n/a'}</p>
            <p className="mt-1 font-mono text-xs text-cyan-200">trend: {workflowTrustSpark}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Lead form routing guard</p>
            <p className={`mt-2 text-2xl font-semibold ${leadRoutingClass}`}>
              {leadRoutingStatus === 'healthy' ? 'healthy' : leadRoutingGuard ? 'degraded' : 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              target: {leadRoutingGuard?.targetEmail ?? 'n/a'} · findings: {leadRoutingGuard?.findings?.length ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              top finding:{' '}
              {leadRoutingGuard?.findings && leadRoutingGuard.findings.length > 0
                ? `${leadRoutingGuard.findings[0]?.type ?? 'unknown'} @ ${leadRoutingGuard.findings[0]?.file ?? 'n/a'}`
                : 'none'}
            </p>
            <p className="mt-1 text-xs text-slate-400">Updated: {leadRoutingGuard?.generatedAt ?? 'n/a'}</p>
            <p className="mt-1 text-xs text-slate-400">
              synthetic v3: {leadSyntheticStatus} · streak {leadRoutingSyntheticTrend?.warnLikeStreak ?? 'n/a'}/
              {leadRoutingSyntheticTrend?.streakThreshold ?? 'n/a'} · issue-open:{' '}
              {leadRoutingSyntheticTrend?.issueOpen ? 'yes' : 'no'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">OpenClaw runner anomaly</p>
            <p className={`mt-2 text-2xl font-semibold ${runnerAnomalyDetected ? 'text-rose-300' : 'text-emerald-300'}`}>
              {runnerAnomalyDetected ? 'detected' : 'clear'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              {String(runnerAnomalySummary || 'n/a').slice(0, 170)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              severity: {runnerAnomalySeverity} | alerts:{' '}
              {openclawRunnerAnomaly?.alerts?.length ?? observabilityDigest?.summary?.openclawRunnerAnomalyAlertCount ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              critical-24h: {runnerAnomalyCritical24h} | critical-streak: {runnerAnomalyCriticalConsecutive}
            </p>
            <p className="mt-1 text-xs text-slate-400">trend tier (24h): {runnerAnomalyTrendTier}</p>
            <p className="mt-1 font-mono text-xs text-cyan-200">trend: {runnerAnomalySpark}</p>
            <p className="mt-1 text-xs text-slate-400">
              report:{' '}
              {(openclawRunnerAnomaly?.generatedAt ||
                observabilityDigest?.summary?.openclawRunnerAnomalyGeneratedAt ||
                'n/a')
                .toString()
                .slice(0, 19)}
            </p>
            <p className="mt-1 text-xs text-cyan-300">
              <a className="underline decoration-dotted" href={runnerAnomalyIssueSearchUrl} target="_blank" rel="noreferrer">
                view critical anomaly incidents
              </a>
            </p>
            <p className="mt-1 text-xs text-cyan-300">
              <a className="underline decoration-dotted" href={runnerAnomalyTrendIssueSearchUrl} target="_blank" rel="noreferrer">
                view trend breach incidents
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Incident cooldown mesh</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">
              {meshRows.length > 0 ? `${meshRows.length} active fingerprints` : 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Updated: {incidentCooldownMesh?.updatedAt?.slice(0, 19) ?? 'n/a'}
            </p>
            <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
              {meshRows.length === 0 ? (
                <li>- none</li>
              ) : (
                meshRows.map((row) => (
                  <li key={row.fingerprint}>
                    - {row.fingerprint}: {(row.at ?? 'n/a').slice(0, 19)}
                    {row.reason ? ` (${row.reason})` : ''}
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">AI Lab integrity guardian</p>
            <p className="mt-2 text-2xl font-semibold text-sky-300">
              {aiLabIntegrity?.ok ? 'ok' : aiLabIntegrity ? 'action needed' : 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              Tools: {aiLabIntegrity?.totalTools ?? 'n/a'} | Missing: {aiLabIntegrity?.missingCount ?? 'n/a'} | Remediated
              (last run): {aiLabIntegrity?.remediatedCount ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Smoke routes synced: {aiLabIntegrity?.smokeRoutesSynced ? 'yes' : 'no'} |{' '}
              {aiLabIntegrity?.at?.slice(0, 19) ?? 'n/a'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">PM2 duplicate healer</p>
            <p className="mt-2 text-2xl font-semibold text-violet-300">
              {pm2DuplicateHealer?.ok ? 'ok' : pm2DuplicateHealer ? 'review' : 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              Duplicate groups: {pm2DuplicateHealer?.duplicates?.length ?? 0} | Healed entries:{' '}
              {pm2DuplicateHealer?.healed?.length ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Deploy lock at run: {pm2DuplicateHealer?.deployLockActive ? 'yes' : 'no'}
              {pm2DuplicateHealer?.healSkippedForDeployLock ? ' (heal skipped)' : ''} |{' '}
              {pm2DuplicateHealer?.at?.slice(0, 19) ?? 'n/a'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">AI Lab legacy scaffold watchdog</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">
              {legacyScaffoldWatchdog == null
                ? 'n/a'
                : legacyScaffoldWatchdog.meshSuppressed
                  ? 'suppressed (mesh)'
                  : legacyScaffoldWatchdog.withinThreshold !== false
                    ? 'within threshold'
                    : legacyScaffoldWatchdog.escalated
                      ? 'escalated'
                      : 'action'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              Count: {legacyScaffoldWatchdog?.count ?? 'n/a'} | Threshold: {legacyScaffoldWatchdog?.threshold ?? 'n/a'} (
              {legacyScaffoldWatchdog?.thresholdMode ?? 'n/a'})
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Mesh: {legacyScaffoldWatchdog?.meshSuppressed ? legacyScaffoldWatchdog.meshReason ?? 'yes' : 'no'} |{' '}
              {legacyScaffoldWatchdog?.at?.slice(0, 19) ?? 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Scan history spark (last {legacyHistLast24.length}, low→high):{' '}
              <span className="font-mono text-cyan-200">{legacyCountSpark}</span>
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">AI Lab hub-link smoke compare</p>
            <p
              className={`mt-2 text-2xl font-semibold ${
                aiLabHubLinksCompare?.severity === 'critical'
                  ? 'text-rose-300'
                  : aiLabHubLinksCompare?.severity === 'warning'
                    ? 'text-amber-300'
                    : 'text-emerald-300'
              }`}
            >
              {aiLabHubLinksCompare?.severity ?? 'n/a'}
            </p>
            <p className="mt-2 text-xs text-slate-300">
              prod failed: {aiLabHubLinksCompare?.prodFailedCount ?? 0} | preview failed:{' '}
              {aiLabHubLinksCompare?.previewFailedCount ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              preview-only regressions: {aiLabHubLinksCompare?.regressedInPreview?.length ?? 0} | prod regressions:{' '}
              {aiLabHubLinksCompare?.regressedInProd?.length ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              7-run deltas: new regressions {aiLabHubNewRegressions7} | recovered {aiLabHubRecovered7}
            </p>
            <p className="mt-2 text-xs text-slate-400">Trend (last {aiLabHubLast30.length}):</p>
            <p className="mt-1 font-mono text-xs text-cyan-200">prod: {aiLabHubProdSpark}</p>
            <p className="mt-1 font-mono text-xs text-violet-200">preview: {aiLabHubPreviewSpark}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Latest smoke target</p>
            <p className="mt-2 text-sm text-slate-200">
              Prod sample:{' '}
              {scheduledSmoke ? `${scheduledSmoke.allOk ? 'pass' : 'fail'} (${scheduledSmoke.failedCount ?? 0} failed)` : 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-300">Base: {scheduledSmoke?.baseUrl ?? 'n/a'}</p>
            <p className="mt-1 text-xs text-slate-400">
              Prod target source: {scheduledSmoke?.targetSource ?? 'n/a'} (production vs netlify)
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Smoke history (last {smokeHistLast30.length}, | pass · . fail · ~ n/a · s skipped):
            </p>
            <p className="mt-1 font-mono text-xs text-cyan-200">prod: {prodSmokeSpark}</p>
            <p className="mt-1 font-mono text-xs text-violet-200">preview: {previewSmokeSpark}</p>
            <p className="mt-2 text-sm text-slate-200">
              Netlify preview:{' '}
              {netlifyPreviewSmoke?.skipped
                ? `skipped (${netlifyPreviewSmoke.reason ?? 'no deploy URL'})`
                : `${(netlifyPreviewSmoke?.unhealthyCount ?? 0) === 0 ? 'pass' : 'fail'} (${netlifyPreviewSmoke?.unhealthyCount ?? 0} failed)`}
            </p>
            <p className="mt-1 text-xs text-slate-300">Preview base: {netlifyPreviewSmoke?.baseUrl ?? 'n/a'}</p>
            <p className="mt-1 text-xs text-slate-400">
              Preview failure class: {netlifyPreviewSmoke?.failureClass ?? 'n/a'}
            </p>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Automation health snapshot</p>
            <p className="mt-2 text-sm text-slate-200">
              Severity:{' '}
              <span
                className={
                  automationHealth?.severity === 'critical'
                    ? 'text-rose-300'
                    : automationHealth?.severity === 'warning'
                      ? 'text-amber-300'
                      : 'text-emerald-300'
                }
              >
                {automationHealth?.severity ?? 'n/a'}
              </span>
              {typeof automationHealth?.sloScore === 'number' ? (
                <>
                  {' '}
                  · SLO{' '}
                  <span className="font-mono text-sky-300">{automationHealth.sloScore}</span>
                  {automationHealth.sloDeltaFromPrevious != null ? (
                    <span
                      className={
                        automationHealth.sloDeltaFromPrevious > 0
                          ? 'text-emerald-300'
                          : automationHealth.sloDeltaFromPrevious < 0
                            ? 'text-rose-300'
                            : 'text-slate-400'
                      }
                    >
                      {' '}
                      ({automationHealth.sloDeltaFromPrevious > 0 ? '+' : ''}
                      {automationHealth.sloDeltaFromPrevious})
                    </span>
                  ) : null}
                </>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              EMA {automationHealth?.emaOpenIncidents ?? 'n/a'} · Preview unhealthy {automationHealth?.previewUnhealthyCount ?? 'n/a'} ·
              FP {automationHealth?.openFingerprintIssues ?? 'n/a'}
            </p>
            {sloSpark !== 'n/a' ? (
              <p className="mt-1 font-mono text-[11px] text-slate-500">
                SLO trend (recent): <span className="text-cyan-200">{sloSpark}</span>
              </p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">Updated: {automationHealth?.generatedAt ?? 'n/a'}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Telemetry freshness</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>
                Suppression registry:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.suppressionRegistryAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.suppressionRegistryAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                Deploy status:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.deployStatusAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.deployStatusAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                Preview smoke:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.previewSmokeAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.previewSmokeAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                Issue index:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.issueIndexAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.issueIndexAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                EMA/FP history row:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.observabilityEmaFpHistoryAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.observabilityEmaFpHistoryAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                Smoke health history:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.smokeHealthHistoryAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.smokeHealthHistoryAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
              <li>
                Automation health history:{' '}
                <span className="font-mono text-slate-300">
                  {automationHealth?.telemetryFreshness?.automationHealthHistoryAt ?? 'n/a'}
                </span>
                {(() => {
                  const m = freshnessMeta(automationHealth?.telemetryFreshness?.automationHealthHistoryAt ?? null);
                  return (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.badgeClass}`}>
                      {m.badge} · {m.ageLabel}
                    </span>
                  );
                })()}
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Fingerprint digest trend (CI)</p>
            <p className="mt-2 text-xs text-slate-400">
              From <code className="text-slate-300">automation-fingerprint-incidents-trend.json</code> — last{' '}
              {fpTrendHist.length} digest runs (ASCII spark: . : * o #)
            </p>
            <p className="mt-2 font-mono text-xs text-cyan-200">open count: {fpDigestOpenSpark}</p>
            <p className="mt-1 font-mono text-xs text-amber-200">registry EMA: {fpDigestEmaSpark}</p>
            <p className="mt-2 text-xs text-slate-500">
              Latest row:{' '}
              {fpTrendHist.length
                ? `${fpTrendHist[fpTrendHist.length - 1]?.generatedAt?.slice(0, 19) ?? 'n/a'} · open ${fpTrendHist[fpTrendHist.length - 1]?.open ?? 'n/a'}`
                : 'no history yet'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Observability digest</p>
            <p className="mt-2 text-sm text-slate-200">
              Smoke:{' '}
              {observabilityDigest?.summary?.productionSmokeOk == null
                ? 'n/a'
                : observabilityDigest.summary.productionSmokeOk
                  ? 'pass'
                  : 'fail'}
              {' | '}GHA cache findings: {observabilityDigest?.summary?.ghaNpmCacheFindings ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Route drift: {observabilityDigest?.summary?.routeDriftStatus ?? 'n/a'} (
              {observabilityDigest?.summary?.routeDriftInAppNotSitemap ?? 'n/a'})
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Fingerprint digest (merged):{' '}
              {observabilityDigest?.summary?.fingerprintDigestPresent
                ? `open ${observabilityDigest.summary.fingerprintDigestOpen ?? '—'} · sev ${observabilityDigest.summary.fingerprintDigestSeverity ?? '—'} · trend open ${observabilityDigest.summary.fingerprintTrendLastOpen ?? '—'}`
                : 'no local snapshot (run weekly digest or observability merge on a machine with reports)'}
            </p>
            <p className="mt-1 text-xs text-slate-400">Updated: {observabilityDigest?.generatedAt ?? 'n/a'}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Autonomy intelligence plan</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">
              {autonomyIntelligencePlan?.autonomyScore ?? 'n/a'}
              <span className="text-sm font-normal text-slate-400"> /100 autonomy</span>
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Band: {autonomyIntelligencePlan?.autonomyBand ?? 'n/a'} | Signals:{' '}
              {autonomyIntelligencePlan?.signals?.length ?? 0}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              {(autonomyIntelligencePlan?.topActions ?? []).slice(0, 3).map((item, idx) => (
                <li key={`${String(item.command || 'cmd')}-${idx}`}>
                  {item.priority ?? 'n/a'} · {item.category ?? 'general'} · <code>{item.command ?? 'n/a'}</code>
                </li>
              ))}
              {(autonomyIntelligencePlan?.topActions ?? []).length === 0 ? (
                <li>No planner actions yet (run `autonomy:intelligence:plan`).</li>
              ) : null}
            </ul>
            <p className="mt-1 text-xs text-slate-500">
              Updated: {autonomyIntelligencePlan?.generatedAt ?? 'n/a'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Release risk (merged reports)</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">
              {releaseRiskScore?.riskScore != null ? `${releaseRiskScore.riskScore}` : 'n/a'}
              <span className="text-sm font-normal text-slate-400"> /100 risk</span>
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Band: {releaseRiskScore?.band ?? 'n/a'} | Health: {releaseRiskScore?.healthScore ?? 'n/a'} | Smoke streak:{' '}
              {releaseRiskScore?.detail?.smokeStreak ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Components (raw): reg {releaseRiskScore?.components?.regression ?? '—'} · route{' '}
              {releaseRiskScore?.components?.routeDrift ?? '—'} · smoke {releaseRiskScore?.components?.smoke ?? '—'}
            </p>
            <p className="mt-1 text-xs text-slate-500">Updated: {releaseRiskScore?.generatedAt ?? 'run release-risk-score job'}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Aggregate regression</p>
            <p className="mt-2 text-sm text-slate-200">
              Status: {aggregateRegression?.summaryStatus ?? 'n/a'} | Alerts:{' '}
              {aggregateRegression?.alertCount ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Diff history spark (risk↑): <span className="font-mono text-slate-300">{aggDiffSpark}</span>
              {aggDiffHistPts.length ? (
                <span className="text-slate-500"> · {aggDiffHistPts.length} pts</span>
              ) : null}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              {(aggregateRegression?.alerts ?? []).slice(0, 4).map((item, idx) => (
                <li key={`${String(item.type || 'alert')}-${idx}`}>
                  - {item.type ?? 'alert'}: {String(item.detail ?? 'n/a')}
                </li>
              ))}
              {(aggregateRegression?.alerts ?? []).length === 0 ? <li>No active regression alerts.</li> : null}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">OpenClaw runner (CI / guard)</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">
              {(openclawRunner?.exitCode ?? 0) === 0 ? 'dry-run ok' : `exit ${openclawRunner?.exitCode ?? '—'}`}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Reason: {openclawRunner?.reason ?? 'n/a'} | Planned: {openclawRunner?.dryRunPlanned?.length ?? 0} |
              Executed: {openclawRunner?.executed?.length ?? 0} | Hold skips:{' '}
              {openclawRunner?.skippedHold?.length ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Guard streak (cached in Actions): {openclawRunnerGuardState?.consecutiveHealthy ?? 'n/a'} healthy | Last
              update: {openclawRunnerGuardState?.lastUpdatedAt ?? openclawRunner?.timestamp ?? 'n/a'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Exit trend (last {runnerHistLast30.length}, | pass, . exit1, ! other):{' '}
              <span className="font-mono text-slate-300">{runnerExitTrend}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Runner MTTR: {runnerMttr.avgHours ?? 'n/a'}h | samples: {runnerMttr.samples}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={runnerIssueSearchUrl}
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/20"
                target="_blank"
                rel="noreferrer"
              >
                Search runner-guard incidents
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">Autonomous actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/ai-lab/deployment-readiness-console"
                className="rounded-full border border-indigo-300/60 bg-indigo-400/20 px-3 py-1.5 text-xs font-semibold text-indigo-100"
              >
                Readiness console
              </a>
              <a
                href="/automation"
                className="rounded-full border border-violet-300/60 bg-violet-400/20 px-3 py-1.5 text-xs font-semibold text-violet-100"
              >
                Automation center
              </a>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Incident suppression correlation</p>
          <p className="mt-2 text-sm text-slate-200">
            Registry v{suppression?.version ?? '—'} | EMA open load:{' '}
            {suppression?.noise?.emaOpenIncidents ?? 'n/a'} | Cooldown rec:{' '}
            {suppression?.recommendedCooldownHours ?? 'n/a'}h
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            <li>
              correlationId:{' '}
              <span className="font-mono text-slate-300">{corr?.correlationId ?? 'n/a'}</span>
            </li>
            {corr?.workflowRunUrl ? (
              <li>
                <a href={corr.workflowRunUrl} className="text-cyan-200 underline" target="_blank" rel="noreferrer">
                  Latest registry workflow run
                </a>
              </li>
            ) : (
              <li>Latest registry workflow run: n/a</li>
            )}
            {corr?.commitSha ? (
              <li>
                Snapshot SHA:{' '}
                <span className="font-mono text-slate-300">{String(corr.commitSha).slice(0, 12)}</span>
              </li>
            ) : null}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">OpenClaw runner history (bounded, from guard cache)</p>
          <p className="mt-2 text-xs text-slate-400">
            Last {Math.min(8, openclawRunnerHistory?.entries?.length ?? 0)} of{' '}
            {openclawRunnerHistory?.entries?.length ?? 0} entries (max 50 in CI cache).
          </p>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-slate-300">
            {(openclawRunnerHistory?.entries ?? []).length === 0 ? (
              <li>No local history yet — populated when `ai-openclaw-runner-guard` runs in GitHub Actions.</li>
            ) : (
              (openclawRunnerHistory?.entries ?? [])
                .slice(-8)
                .reverse()
                .map((row, idx) => (
                  <li key={`${row.timestampIso ?? idx}-${idx}`}>
                    {row.timestampIso ?? '—'} | exit {row.exitCode ?? '—'} | {row.reason ?? '—'}{' '}
                    {row.runId ? <span className="text-slate-500">run {row.runId}</span> : null}
                  </li>
                ))
            )}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">MTTR SLO guard (daily CI)</p>
          <p className="mt-2 text-sm text-slate-200">
            Composite health score:{' '}
            <span className="font-semibold text-cyan-300">{mttrSloGuard?.automationHealthScore ?? 'n/a'}</span>
            {' · '}
            Guard band: {mttrSloGuard?.mttr?.band ?? 'unknown'}
            {' · '}
            Critical streak: {mttrSloGuard?.consecutiveCritical ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Open automation-fp issues (index): {mttrSloGuard?.openAutomationFingerprintIssues ?? 'n/a'} | PagerDuty
            eligible: {mttrSloGuard?.pagerDuty?.eligible ? 'yes' : 'no'}
            {mttrSloGuard?.pagerDuty?.sent ? ' (sent this run)' : ''}
            {mttrSloGuard?.pagerDuty?.skippedReason
              ? ` · PD skip: ${mttrSloGuard.pagerDuty.skippedReason}`
              : ''}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Last PD: {mttrSloGuard?.pagerDuty?.lastPagerDutyAt ?? 'never'} | Snapshot:{' '}
            {mttrSloGuard?.generatedAt ?? 'n/a'}
          </p>
          {(mttrSloGuard?.fingerprintRegressions ?? []).length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-amber-200/90">
              {(mttrSloGuard?.fingerprintRegressions ?? [])
                .slice(0, 5)
                .map((r: NonNullable<MttrSloGuardSnapshot['fingerprintRegressions']>[number]) => (
                <li key={r.label}>
                  {r.label}: {r.prevAvgHours}h → {r.avgHours}h (+{r.deltaHours}h vs prior guard)
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No per-fingerprint MTTR regressions vs last guard run.</p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Prometheus: <code className="text-slate-400">automation/reports/automation-mttr-slo-metrics.prom</code>
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">MTTR fingerprint regression guard</p>
          <p className="mt-2 text-sm text-slate-200">
            Observed: {mttrFingerprintGuard?.observed?.length ?? 0}
            {' · '}Escalated this run: {mttrFingerprintGuard?.escalated?.length ?? 0}
            {' · '}Recovered: {mttrFingerprintGuard?.recovered?.length ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Delta threshold: {mttrFingerprintGuard?.config?.deltaHoursThreshold ?? 'n/a'}h
            {' · '}streak: {mttrFingerprintGuard?.config?.streakThreshold ?? 'n/a'}
            {' · '}min samples: {mttrFingerprintGuard?.config?.minSamples ?? 'n/a'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Critical band: {mttrFingerprintGuard?.config?.criticalDeltaHours ?? 'n/a'}h &amp; streak{' '}
            {mttrFingerprintGuard?.config?.criticalStreak ?? 'n/a'}
            {' · '}mesh suppression: {mttrFingerprintGuard?.config?.meshSuppressionHours ?? 'n/a'}h
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Suppression explainability: observed {mttrFingerprintExplainability?.summary?.observed ?? 0}
            {' · '}suppressed {mttrFingerprintExplainability?.summary?.suppressed ?? 0}
            {' · '}escalated {mttrFingerprintExplainability?.summary?.escalated ?? 0}
          </p>
          {(mttrFingerprintGuard?.observed ?? []).length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              {(mttrFingerprintGuard?.observed ?? [])
                .slice(0, 6)
                .map((row: NonNullable<MttrFingerprintRegressionSnapshot['observed']>[number]) => (
                <li key={row.label}>
                  {row.label}: {row.avgHours}h
                  {row.deltaHours != null ? ` (${row.deltaHours > 0 ? '+' : ''}${row.deltaHours}h)` : ''}
                  {' · '}severity {row.severity ?? 'warning'}
                  {' · '}streak {row.regressionStreak}
                  {row.priorityScore != null ? ` · score ${row.priorityScore}` : ''}
                  {row.status === 'suppressed' ? ` · suppressed (${row.suppressionReason ?? 'mesh'})` : ''}
                  {row.suppressedByPriority != null ? ` by ${row.suppressedByPriority}` : ''}
                  {row.labelSync ? ` · labels ${row.labelSync}` : ''}
                  {row.severityTransition ? ` · transition ${row.severityTransition}` : ''}
                  {row.runbookUrl ? (
                    <>
                      {' · '}
                      <a href={row.runbookUrl} className="text-cyan-300 underline" target="_blank" rel="noreferrer">
                        runbook
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">No fingerprint regression observations yet.</p>
          )}
          <p className="mt-1 text-xs text-slate-500">Source: <code className="text-slate-400">automation/reports/mttr-fingerprint-regression-latest.json</code></p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Automation incidents (fingerprint index)</p>
          <p className="mt-2 text-sm text-slate-200">
            Open issues with <code className="text-slate-300">automation-fp-*</code> labels:{' '}
            {issueIndex?.openAutomationFingerprintIssues ?? 0}{' '}
            <span className="text-slate-500">(weekly refresh)</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            MTTR (recent closed fingerprint issues): {issueIndex?.mttr?.avgHours ?? 'n/a'}h
            {' | '}samples: {issueIndex?.mttr?.samples ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            MTTR band: {issueIndex?.mttr?.band ?? 'unknown'}
            {' | '}trend: {issueIndex?.mttr?.trend?.direction ?? 'n/a'}
            {issueIndex?.mttr?.trend?.deltaHours != null ? ` (${issueIndex.mttr.trend.deltaHours > 0 ? '+' : ''}${issueIndex.mttr.trend.deltaHours}h)` : ''}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            MTTR spark: <code className="text-cyan-300">{tinySparkline((issueIndex?.mttr?.history ?? []).map((h) => Number(h.avgHours ?? 0)))}</code>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={issuesSearchUrl}
              className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700"
              target="_blank"
              rel="noreferrer"
            >
              Open automation-incident issues on GitHub
            </a>
          </div>
          {(issueIndex?.mttr?.byFingerprint ?? []).length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {(issueIndex?.mttr?.byFingerprint ?? []).slice(0, 5).map((row) => (
                <li key={row.label}>
                  {row.label}: {row.avgHours}h avg ({row.samples} samples)
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs text-slate-300">
            {(issueIndex?.issues ?? []).length === 0 ? (
              <li>No indexed rows yet (run weekly workflow or add secrets for gh).</li>
            ) : (
              (issueIndex?.issues ?? []).slice(0, 12).map((row) => (
                <li key={row.number}>
                  <a href={row.url} className="text-cyan-200 underline" target="_blank" rel="noreferrer">
                    #{row.number}
                  </a>{' '}
                  {row.title}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Unhealthy routes (watchdog)</p>
          <ul className="mt-3 space-y-1 text-sm text-slate-200">
            {(watchdog?.unhealthyRoutes ?? []).length === 0 ? (
              <li>No unhealthy routes reported.</li>
            ) : (
              (watchdog?.unhealthyRoutes ?? []).map((route) => <li key={route}>- {route}</li>)
            )}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Netlify preview smoke</p>
          <p className="mt-2 text-sm text-slate-200">
            {previewSmoke?.skipped
              ? 'Skipped (no preview URL in deploy status)'
              : `Unhealthy routes: ${previewSmoke?.unhealthyCount ?? 0}`}
          </p>
          {previewSmoke?.baseUrl ? (
            <p className="mt-1 text-xs text-slate-400">
              Base: <a className="text-cyan-200 underline" href={previewSmoke.baseUrl}>{previewSmoke.baseUrl}</a>
            </p>
          ) : null}
          <p className="mt-1 text-xs text-slate-400">
            Consecutive preview failures: {previewSmokeState?.consecutiveFailures ?? 0}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Observability trend (EMA / FP)</p>
          <p className="mt-2 text-sm text-slate-200">
            EMA: <code className="text-cyan-300">{emaSpark}</code>
          </p>
          <p className="mt-1 text-sm text-slate-200">
            FP: <code className="text-violet-300">{fpSpark}</code>
          </p>
          <p className="mt-1 text-xs text-slate-400">Last points: {obsLast30.length} (max 30 shown)</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase">
            <span className="rounded-full bg-emerald-900/80 px-2 py-0.5 text-emerald-200">Nominal: &lt;4 EMA and &lt;4 FP</span>
            <span className="rounded-full bg-amber-900/80 px-2 py-0.5 text-amber-200">Warning: EMA ≥4 or FP ≥4</span>
            <span className="rounded-full bg-rose-900/80 px-2 py-0.5 text-rose-200">Critical: EMA ≥6 or FP ≥8</span>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Promotion confidence gate (threshold {confidence?.gatedThreshold ?? 60})
          </p>
          <ul className="mt-3 space-y-1 text-sm text-slate-200">
            {lowConfidence.length === 0 ? (
              <li>No low-confidence promoted routes.</li>
            ) : (
              lowConfidence.map((item) => (
                <li key={item.route}>
                  - {item.route} ({item.score}/100, {item.status})
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Confidence trend snapshots</p>
          <p className="mt-2 text-sm text-slate-200">
            7-point avg: {trend7 ?? 'n/a'} | 30-point avg: {trend30 ?? 'n/a'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Points captured: {confidenceHistory.length}
          </p>
        </section>
      </AILabToolLayout>
    </div>
  );
}

