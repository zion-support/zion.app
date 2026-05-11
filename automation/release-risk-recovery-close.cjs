#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Closes deduped release-risk-elevated issue after consecutive low-risk runs.
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   RELEASE_RISK_RECOVERY_MAX_SCORE (default 55) — risk at or below counts as healthy
 *   RELEASE_RISK_RECOVERY_STREAK (default 2) — consecutive healthy runs before close
 *   RELEASE_RISK_RECOVERY_DRY_RUN
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const SCORE = path.join(REPORTS, 'release-risk-score-latest.json');
const STATE = path.join(REPORTS, 'release-risk-recovery-state.json');
const FP = 'release-risk-elevated';

const MAX_SCORE = Math.min(100, Math.max(0, Number(process.env.RELEASE_RISK_RECOVERY_MAX_SCORE ?? 55)));
const STREAK_NEED = Math.max(1, Number(process.env.RELEASE_RISK_RECOVERY_STREAK ?? 2));
const DRY = ['1', 'true', 'yes'].includes(String(process.env.RELEASE_RISK_RECOVERY_DRY_RUN || '').toLowerCase());

function readJson(p, fb) {
  try {
    if (!fs.existsSync(p)) return fb;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function main() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token && !DRY) {
    console.log('[release-risk-recovery-close] no token; skip.');
    process.exit(0);
  }

  const score = readJson(SCORE, null);
  if (!score || typeof score.riskScore !== 'number') {
    console.log('[release-risk-recovery-close] no score file; skip.');
    process.exit(0);
  }

  const risk = Number(score.riskScore);
  const healthy = risk <= MAX_SCORE;

  let st = readJson(STATE, { consecutiveHealthy: 0 });
  if (healthy) st.consecutiveHealthy = Number(st.consecutiveHealthy || 0) + 1;
  else st.consecutiveHealthy = 0;
  st.lastCheckedAt = new Date().toISOString();
  st.lastRiskScore = risk;
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify(st, null, 2));

  if (st.consecutiveHealthy < STREAK_NEED) {
    console.log(
      `[release-risk-recovery-close] healthy=${healthy} streak=${st.consecutiveHealthy}/${STREAK_NEED} (need ${STREAK_NEED}); no close.`,
    );
    process.exit(0);
  }

  if (DRY) {
    console.log('[release-risk-recovery-close] DRY_RUN: would close fingerprint issues for', FP);
    process.exit(0);
  }

  process.env.ISSUE_FINGERPRINT = FP;
  process.env.CLOSE_COMMENT =
    process.env.CLOSE_COMMENT ||
    `Auto-closing: release risk score stayed at or below ${MAX_SCORE} for ${STREAK_NEED} consecutive runs (latest: ${risk}).`;

  const r = spawnSync('node', ['scripts/automation/gh-issue-close-on-recovery.cjs'], {
    encoding: 'utf8',
    env: process.env,
    cwd: ROOT,
  });
  if (r.status !== 0) console.warn('[release-risk-recovery-close]', r.stderr || r.stdout);
  else {
    st.consecutiveHealthy = 0;
    st.lastClosedAt = new Date().toISOString();
    fs.writeFileSync(STATE, JSON.stringify(st, null, 2));
    console.log('[release-risk-recovery-close] done.');
  }
}

main();
