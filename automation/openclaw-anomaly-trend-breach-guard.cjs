#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Escalate when critical runner anomalies cluster in a rolling window.
 *
 * Env:
 *   HISTORY_FILE (default automation/reports/openclaw-runner-anomaly-history.json)
 *   WINDOW_HOURS (default 24)
 *   BREACH_WARN_MIN_CRITICAL (default 3)
 *   BREACH_CRIT_MIN_CRITICAL (default 5)
 *   ISSUE_TITLE_WARN (default: [automation] OpenClaw anomaly trend breach)
 *   ISSUE_LABELS_WARN (default: automation,openclaw,automation-slo-warning)
 *   ISSUE_FINGERPRINT_WARN (default: openclaw-runner-anomaly-trend-breach|24h|v1)
 *   ISSUE_TITLE_CRIT (default: [automation] OpenClaw anomaly trend breach critical)
 *   ISSUE_LABELS_CRIT (default: automation,openclaw,automation-slo-critical)
 *   ISSUE_FINGERPRINT_CRIT (default: openclaw-runner-anomaly-trend-breach|24h|critical|v1)
 *   WARN_WEBHOOK_URL (optional)
 *   CRIT_WEBHOOK_URL (optional)
 *   DRY_RUN
 *
 * Requires GH_TOKEN/GITHUB_TOKEN when not DRY_RUN.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const https = require('https');
const http = require('http');

function readJsonArraySafe(p) {
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function postWebhook(url, payload) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(payload);
    const isHttp = u.protocol === 'http:';
    const lib = isHttp ? http : https;
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port ? Number(u.port) : isHttp ? 80 : 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.statusCode || 0));
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function openOrUpdateIssue({ title, labels, fingerprint, bodyFile, cooldownHours = '6' }) {
  const res = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      ISSUE_TITLE: title,
      ISSUE_LABELS: labels,
      ISSUE_FINGERPRINT: fingerprint,
      COOLDOWN_HOURS: cooldownHours,
      ISSUE_BODY_FILE: bodyFile,
    },
  });
  if (res.status !== 0) {
    console.warn('openclaw-anomaly-trend-breach: dedupe/create failed:', res.stderr || res.stdout);
  }
}

function closeIssueByFingerprint(fingerprint, summary) {
  const close = spawnSync('node', ['scripts/automation/gh-issue-close-on-recovery.cjs'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      ISSUE_FINGERPRINT: fingerprint,
      CLOSE_COMMENT: `Auto-closing: anomaly trend breach recovered (${summary}).`,
    },
  });
  if (close.status !== 0) {
    console.warn('openclaw-anomaly-trend-breach: close-on-recovery failed:', close.stderr || close.stdout);
  }
}

async function main() {
  const root = process.cwd();
  const historyFile = path.isAbsolute(process.env.HISTORY_FILE || '')
    ? process.env.HISTORY_FILE
    : path.join(root, process.env.HISTORY_FILE || 'automation/reports/openclaw-runner-anomaly-history.json');
  const windowHours = Math.max(1, Number.parseInt(String(process.env.WINDOW_HOURS || '24'), 10) || 24);
  const warnMin = Math.max(1, Number.parseInt(String(process.env.BREACH_WARN_MIN_CRITICAL || '3'), 10) || 3);
  const critMin = Math.max(warnMin, Number.parseInt(String(process.env.BREACH_CRIT_MIN_CRITICAL || '5'), 10) || 5);
  const issueTitleWarn = String(process.env.ISSUE_TITLE_WARN || '[automation] OpenClaw anomaly trend breach');
  const issueLabelsWarn = String(process.env.ISSUE_LABELS_WARN || 'automation,openclaw,automation-slo-warning');
  const issueFingerprintWarn = String(process.env.ISSUE_FINGERPRINT_WARN || 'openclaw-runner-anomaly-trend-breach|24h|v1');
  const issueTitleCrit = String(process.env.ISSUE_TITLE_CRIT || '[automation] OpenClaw anomaly trend breach critical');
  const issueLabelsCrit = String(process.env.ISSUE_LABELS_CRIT || 'automation,openclaw,automation-slo-critical');
  const issueFingerprintCrit = String(
    process.env.ISSUE_FINGERPRINT_CRIT || 'openclaw-runner-anomaly-trend-breach|24h|critical|v1',
  );
  const warnWebhookUrl = String(process.env.WARN_WEBHOOK_URL || '').trim();
  const critWebhookUrl = String(process.env.CRIT_WEBHOOK_URL || '').trim();
  const dry = ['1', 'true', 'yes'].includes(String(process.env.DRY_RUN || '').toLowerCase());

  const rows = readJsonArraySafe(historyFile);
  const since = Date.now() - windowHours * 3600000;
  const criticalRows = rows.filter((r) => {
    const ts = r && r.generatedAt ? Date.parse(String(r.generatedAt)) : NaN;
    return Number.isFinite(ts) && ts >= since && String(r.severity || '').toLowerCase() === 'critical';
  });
  const criticalCount = criticalRows.length;
  const breachLevel = criticalCount >= critMin ? 'critical' : criticalCount >= warnMin ? 'warning' : 'none';
  const summary = `critical anomalies in last ${windowHours}h: ${criticalCount} (warning>=${warnMin}, critical>=${critMin})`;
  console.log(`[openclaw-anomaly-trend-breach] ${summary}`);

  if (dry) process.exit(0);

  if (breachLevel !== 'none') {
    const bodyFile = path.join(os.tmpdir(), `openclaw-anomaly-trend-breach-${process.pid}.md`);
    const lines = [
      '## OpenClaw anomaly trend breach',
      '',
      `- Window: \`${windowHours}h\``,
      `- Critical anomaly count: \`${criticalCount}\``,
      `- Breach level: \`${breachLevel}\``,
      `- Warning threshold: \`${warnMin}\``,
      `- Critical threshold: \`${critMin}\``,
      `- History file: \`${path.relative(root, historyFile)}\``,
      '',
      '### Latest critical anomaly points',
      '',
      ...criticalRows.slice(-8).map((r) => `- ${String(r.generatedAt || 'unknown')} · alerts=${Number(r.alertCount || 0)}`),
    ];
    fs.writeFileSync(bodyFile, `${lines.join('\n')}\n`, 'utf8');
    try {
      if (breachLevel === 'critical') {
        openOrUpdateIssue({
          title: issueTitleCrit,
          labels: issueLabelsCrit,
          fingerprint: issueFingerprintCrit,
          bodyFile,
        });
        closeIssueByFingerprint(issueFingerprintWarn, summary);
        if (critWebhookUrl) {
          postWebhook(critWebhookUrl, {
            text: `[critical] OpenClaw anomaly trend breach\n${summary}`,
          }).catch((e) => console.warn('crit webhook failed:', e && e.message ? e.message : e));
        }
      } else {
        openOrUpdateIssue({
          title: issueTitleWarn,
          labels: issueLabelsWarn,
          fingerprint: issueFingerprintWarn,
          bodyFile,
        });
        closeIssueByFingerprint(issueFingerprintCrit, summary);
        if (warnWebhookUrl) {
          postWebhook(warnWebhookUrl, {
            text: `[warning] OpenClaw anomaly trend breach\n${summary}`,
          }).catch((e) => console.warn('warn webhook failed:', e && e.message ? e.message : e));
        }
      }
    } finally {
      try {
        fs.unlinkSync(bodyFile);
      } catch {
        /* ignore */
      }
    }
    process.exit(0);
  }

  closeIssueByFingerprint(issueFingerprintWarn, summary);
  closeIssueByFingerprint(issueFingerprintCrit, summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
