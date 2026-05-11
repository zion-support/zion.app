#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * MTTR SLO guard for automation fingerprint incidents.
 *
 * Reads:
 *  - automation/reports/automation-open-issues-index-latest.json
 * Writes:
 *  - automation/reports/mttr-slo-guard-state.json
 *  - automation/reports/mttr-slo-guard-latest.json
 *  - automation/reports/automation-mttr-slo-metrics.prom
 *
 * Env:
 *  - MTTR_SLO_CRITICAL_HOURS (default: 48)
 *  - MTTR_SLO_WARNING_HOURS (default: 24)
 *  - MTTR_SLO_CRITICAL_STREAK (default: 2)
 *  - MTTR_SLO_PD_MIN_OPEN_FP — min open automation-fp issues to allow PagerDuty (default: 3)
 *  - MTTR_SLO_PD_COOLDOWN_HOURS — min hours between PD events (default: 24)
 *  - MTTR_SLO_FP_REGRESSION_HOURS — min worsening vs last run to flag a fingerprint (default: 6)
 *  - MTTR_SLO_PAGERDUTY_ROUTING_KEY — optional; falls back to PAGERDUTY_ROUTING_KEY
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'automation-open-issues-index-latest.json');
const STATE = path.join(ROOT, 'automation', 'reports', 'mttr-slo-guard-state.json');
const OUT = path.join(ROOT, 'automation', 'reports', 'mttr-slo-guard-latest.json');
const PROM = path.join(ROOT, 'automation', 'reports', 'automation-mttr-slo-metrics.prom');
const BODY = path.join(ROOT, 'automation', 'reports', 'mttr-slo-critical-body.md');

let meshHelpers = null;
try {
  meshHelpers = require('./lib/incident-cooldown-mesh.cjs');
} catch {
  meshHelpers = null;
}

function readJson(p, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(p, payload) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function classify(avgHours, warning, critical) {
  if (avgHours == null || !Number.isFinite(avgHours)) return 'unknown';
  if (avgHours >= critical) return 'critical';
  if (avgHours >= warning) return 'warning';
  return 'healthy';
}

function runNode(script, extraEnv) {
  return spawnSync('node', [script], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...(extraEnv || {}) },
  });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function compositeScore({ band, openCount, avgHours, consecutiveCritical }) {
  let s = 100;
  if (band === 'critical') s -= 25;
  else if (band === 'warning') s -= 10;
  s -= Math.min(30, (openCount || 0) * 3);
  if (avgHours != null && Number.isFinite(avgHours) && avgHours > 24) {
    s -= Math.min(20, (avgHours - 24) * 0.5);
  }
  if (consecutiveCritical >= 2) s -= 10;
  return Math.max(0, Math.round(s));
}

function fingerprintRegressions(top, prevMap, deltaMin) {
  const out = [];
  if (!top || !prevMap) return out;
  for (const row of top) {
    const label = row.label;
    const cur = Number(row.avgHours);
    const prev = prevMap[label];
    if (prev == null || !Number.isFinite(cur) || !Number.isFinite(prev)) continue;
    const d = round2(cur - prev);
    if (d >= deltaMin) {
      out.push({ label, prevAvgHours: prev, avgHours: cur, deltaHours: d });
    }
  }
  return out.sort((a, b) => b.deltaHours - a.deltaHours);
}

function topFingerprintMap(top) {
  const m = {};
  for (const row of top || []) {
    if (row && row.label != null && typeof row.avgHours === 'number') {
      m[row.label] = row.avgHours;
    }
  }
  return m;
}

function hoursSince(iso) {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return Infinity;
  return (Date.now() - t) / 3600000;
}

function pagerDutyRoutingKey() {
  return (
    process.env.MTTR_SLO_PAGERDUTY_ROUTING_KEY ||
    process.env.PAGERDUTY_ROUTING_KEY ||
    ''
  ).trim();
}

async function triggerPagerDuty(summary, { severity = 'critical' } = {}) {
  const key = pagerDutyRoutingKey();
  if (!key) return { ok: false, reason: 'no-routing-key' };
  const body = {
    routing_key: key,
    event_action: 'trigger',
    payload: {
      summary: summary.slice(0, 1024),
      source: 'zion-automation-mttr-slo-guard',
      severity,
    },
  };
  try {
    const r = await fetch('https://events.pagerduty.com/v2/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const t = await r.text();
      return { ok: false, reason: `http-${r.status}`, detail: t.slice(0, 200) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'fetch-error', detail: String(e) };
  }
}

function writePrometheus({
  avgHours,
  samples,
  band,
  openFp,
  consecutiveCritical,
  streakThreshold,
  pdEligible,
  healthScore,
}) {
  const safe = (n) => (Number.isFinite(n) ? n : 0);
  const bandVal = band === 'critical' ? 2 : band === 'warning' ? 1 : 0;
  const lines = [
    '# HELP zion_automation_mttr_slo_avg_hours Weighted average MTTR (hours) for closed automation-fp issues.',
    '# TYPE zion_automation_mttr_slo_avg_hours gauge',
    `zion_automation_mttr_slo_avg_hours ${safe(avgHours)}`,
    '',
    '# HELP zion_automation_mttr_slo_samples Number of closed samples in MTTR window.',
    '# TYPE zion_automation_mttr_slo_samples gauge',
    `zion_automation_mttr_slo_samples ${safe(samples)}`,
    '',
    '# HELP zion_automation_mttr_slo_band Ordinal: 0=healthy,1=warning,2=critical.',
    '# TYPE zion_automation_mttr_slo_band gauge',
    `zion_automation_mttr_slo_band ${bandVal}`,
    '',
    '# HELP zion_automation_mttr_slo_open_fp_issues Open issues with automation-fp-* labels.',
    '# TYPE zion_automation_mttr_slo_open_fp_issues gauge',
    `zion_automation_mttr_slo_open_fp_issues ${safe(openFp)}`,
    '',
    '# HELP zion_automation_mttr_slo_critical_streak Consecutive critical-band runs.',
    '# TYPE zion_automation_mttr_slo_critical_streak gauge',
    `zion_automation_mttr_slo_critical_streak ${safe(consecutiveCritical)}`,
    '',
    '# HELP zion_automation_mttr_slo_critical_streak_threshold Streak required before deduped GitHub issue.',
    '# TYPE zion_automation_mttr_slo_critical_streak_threshold gauge',
    `zion_automation_mttr_slo_critical_streak_threshold ${safe(streakThreshold)}`,
    '',
    '# HELP zion_automation_mttr_slo_pd_gate Eligible for PagerDuty this run (1=yes).',
    '# TYPE zion_automation_mttr_slo_pd_gate gauge',
    `zion_automation_mttr_slo_pd_gate ${pdEligible ? 1 : 0}`,
    '',
    '# HELP zion_automation_mttr_slo_health_score Composite 0-100 automation health score from guard.',
    '# TYPE zion_automation_mttr_slo_health_score gauge',
    `zion_automation_mttr_slo_health_score ${safe(healthScore)}`,
    '',
  ];
  fs.mkdirSync(path.dirname(PROM), { recursive: true });
  fs.writeFileSync(PROM, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  const criticalHours = Math.max(1, Number(process.env.MTTR_SLO_CRITICAL_HOURS || 48));
  const warningHours = Math.max(1, Number(process.env.MTTR_SLO_WARNING_HOURS || 24));
  const streakThreshold = Math.max(1, Number(process.env.MTTR_SLO_CRITICAL_STREAK || 2));
  const pdMinOpen = Math.max(0, Number(process.env.MTTR_SLO_PD_MIN_OPEN_FP || 3));
  const pdCooldownH = Math.max(1, Number(process.env.MTTR_SLO_PD_COOLDOWN_HOURS || 24));
  const fpRegressionDelta = Math.max(0, Number(process.env.MTTR_SLO_FP_REGRESSION_HOURS || 6));

  const idx = readJson(REPORT, {});
  const mttr = idx?.mttr || {};
  const avgHours = typeof mttr.avgHours === 'number' ? mttr.avgHours : null;
  const samples = Number(mttr.samples || 0);
  const band = classify(avgHours, warningHours, criticalHours);
  const openFp = Number(idx?.openAutomationFingerprintIssues ?? 0);

  const prev = readJson(STATE, {
    consecutiveCritical: 0,
    consecutiveHealthyOrWarning: 0,
    lastTopFingerprints: {},
    lastPagerDutyAt: null,
  });

  const prevTopMap = prev.lastTopFingerprints && typeof prev.lastTopFingerprints === 'object'
    ? prev.lastTopFingerprints
    : {};

  const consecutiveCritical = band === 'critical' ? Number(prev.consecutiveCritical || 0) + 1 : 0;
  const consecutiveHealthyOrWarning = band !== 'critical' ? Number(prev.consecutiveHealthyOrWarning || 0) + 1 : 0;

  const top = Array.isArray(mttr.byFingerprint) ? mttr.byFingerprint.slice(0, 8) : [];
  const fingerprintRegressionsList = fingerprintRegressions(top, prevTopMap, fpRegressionDelta);

  const healthScore = compositeScore({
    band,
    openCount: openFp,
    avgHours,
    consecutiveCritical,
  });

  const criticalIssueReady = band === 'critical' && consecutiveCritical >= streakThreshold;

  const pdKeyPresent = !!pagerDutyRoutingKey();
  const pdCooldownOk = hoursSince(prev.lastPagerDutyAt) >= pdCooldownH;
  const pdLoadOk = openFp >= pdMinOpen;
  const pdEligible =
    criticalIssueReady &&
    pdKeyPresent &&
    pdCooldownOk &&
    pdLoadOk;

  let pdSent = false;
  let pdSkippedReason = null;

  if (criticalIssueReady && pdKeyPresent) {
    if (!pdCooldownOk) pdSkippedReason = 'pagerduty-cooldown';
    else if (!pdLoadOk) pdSkippedReason = `open-fp-low(${openFp}<${pdMinOpen})`;
  } else if (!criticalIssueReady) {
    pdSkippedReason = 'not-critical-streak';
  } else if (!pdKeyPresent) {
    pdSkippedReason = 'no-pagerduty-key';
  }

  let lastPagerDutyAt = prev.lastPagerDutyAt || null;

  const snapshot = {
    generatedAt: new Date().toISOString(),
    warningHours,
    criticalHours,
    streakThreshold,
    openAutomationFingerprintIssues: openFp,
    mttr: { avgHours, samples, band },
    consecutiveCritical,
    consecutiveHealthyOrWarning,
    topFingerprints: top,
    fingerprintRegressions: fingerprintRegressionsList,
    automationHealthScore: healthScore,
    pagerDuty: {
      eligible: pdEligible,
      sent: false,
      skippedReason: pdSkippedReason,
      minOpenFp: pdMinOpen,
      cooldownHours: pdCooldownH,
      lastPagerDutyAt,
    },
  };

  if (pdEligible) {
    const summary = [
      `[Zion] MTTR SLO critical: avg ${avgHours ?? 'n/a'}h`,
      `open=${openFp} streak=${consecutiveCritical}`,
      `samples=${samples}`,
    ].join(' | ');
    const res = await triggerPagerDuty(summary, { severity: 'critical' });
    if (res.ok) {
      pdSent = true;
      lastPagerDutyAt = new Date().toISOString();
      snapshot.pagerDuty.sent = true;
      snapshot.pagerDuty.lastPagerDutyAt = lastPagerDutyAt;
      if (meshHelpers?.recordEscalation) {
        meshHelpers.recordEscalation('automation-mttr-slo-pagerduty', {
          meta: { avgHours, openFp, consecutiveCritical },
        });
      }
      console.log('mttr-slo-guard: PagerDuty triggered');
    } else {
      console.warn('mttr-slo-guard: PagerDuty failed', res);
      snapshot.pagerDuty.error = res;
    }
  } else {
    snapshot.pagerDuty.lastPagerDutyAt = lastPagerDutyAt;
  }

  writeJson(STATE, {
    updatedAt: snapshot.generatedAt,
    warningHours,
    criticalHours,
    consecutiveCritical,
    consecutiveHealthyOrWarning,
    lastBand: band,
    lastAvgHours: avgHours,
    lastTopFingerprints: topFingerprintMap(top),
    lastPagerDutyAt,
  });
  writeJson(OUT, snapshot);

  writePrometheus({
    avgHours,
    samples,
    band,
    openFp,
    consecutiveCritical,
    streakThreshold,
    pdEligible,
    healthScore,
  });

  if (criticalIssueReady) {
    const body = [
      '## MTTR SLO critical breach',
      '',
      '- **Dedupe key:** `automation-mttr-slo-critical`',
      `- **Avg MTTR:** ${avgHours ?? 'n/a'}h`,
      `- **Samples:** ${samples}`,
      `- **Critical threshold:** ${criticalHours}h`,
      `- **Critical streak:** ${consecutiveCritical} (threshold ${streakThreshold})`,
      `- **Open automation-fp issues:** ${openFp}`,
      fingerprintRegressionsList.length
        ? [
            '',
            '### Fingerprint MTTR regressions (vs last guard run)',
            ...fingerprintRegressionsList.map(
              (r) => `- ${r.label}: ${r.prevAvgHours}h → ${r.avgHours}h (+${r.deltaHours}h)`,
            ),
          ].join('\n')
        : '',
      '',
      '### Top MTTR fingerprints',
      top.length ? top.map((r) => `- ${r.label}: ${r.avgHours}h (${r.samples} samples)`).join('\n') : '- none',
      '',
      pagerDutyRoutingKey()
        ? `- **PagerDuty:** ${pdSent ? 'triggered this run' : `skipped (${pdSkippedReason || 'n/a'})`}`
        : '- **PagerDuty:** not configured',
      '',
      `- Workflow run: ${(process.env.GITHUB_SERVER_URL || 'https://github.com')}/${process.env.GITHUB_REPOSITORY || ''}/actions/runs/${process.env.GITHUB_RUN_ID || ''}`,
    ].join('\n');
    fs.writeFileSync(BODY, `${body}\n`, 'utf8');

    const res = runNode('scripts/automation/gh-issue-dedupe-or-create.cjs', {
      ISSUE_TITLE: 'Automation MTTR SLO critical breach',
      ISSUE_BODY_FILE: BODY,
      ISSUE_FINGERPRINT: 'automation-mttr-slo-critical',
      ISSUE_LABELS: 'bug,automation,automation-slo-critical',
      COOLDOWN_HOURS: '12',
    });
    if (res.status !== 0) {
      console.warn('mttr-slo-guard: issue dedupe failed', res.stderr || res.stdout);
    } else {
      console.log('mttr-slo-guard: critical issue ensured');
    }
  }

  if (band !== 'critical' && consecutiveHealthyOrWarning >= 2) {
    const res = runNode('scripts/automation/gh-issue-close-on-recovery.cjs', {
      ISSUE_FINGERPRINT: 'automation-mttr-slo-critical',
      CLOSE_COMMENT: `Auto-closing: MTTR SLO recovered to ${band} (${avgHours ?? 'n/a'}h).`,
    });
    if (res.status !== 0) {
      console.warn('mttr-slo-guard: close-on-recovery failed', res.stderr || res.stdout);
    }
  }

  console.log(
    'mttr-slo-guard:',
    JSON.stringify({
      band,
      avgHours,
      samples,
      consecutiveCritical,
      consecutiveHealthyOrWarning,
      pdEligible,
      pdSent,
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
