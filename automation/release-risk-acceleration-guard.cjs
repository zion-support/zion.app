#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Detect release-risk acceleration (consecutive worsening) from history.
 *
 * Inputs:
 *   automation/reports/release-risk-score-latest.json
 *   automation/reports/release-risk-history.json
 *
 * Behavior:
 * - Opens/updates deduped issue (fingerprint: release-risk-acceleration-worsening)
 *   when last N deltas are all >= MIN_DELTA and score >= MIN_SCORE.
 * - Auto-closes that issue on recovery condition (non-worsening deltas + lower score).
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   RELEASE_RISK_ACCEL_MIN_STREAK (default 3)
 *   RELEASE_RISK_ACCEL_MIN_DELTA (default 3)
 *   RELEASE_RISK_ACCEL_MIN_SCORE (default 50)
 *   RELEASE_RISK_ACCEL_RECOVERY_MAX_SCORE (default 45)
 *   RELEASE_RISK_ACCEL_DRY_RUN (1/true)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const LATEST = path.join(REPORTS, 'release-risk-score-latest.json');
const HIST = path.join(REPORTS, 'release-risk-history.json');
const FP = 'release-risk-acceleration-worsening';

const MIN_STREAK = Math.max(2, Number(process.env.RELEASE_RISK_ACCEL_MIN_STREAK || 3));
const MIN_DELTA = Math.max(1, Number(process.env.RELEASE_RISK_ACCEL_MIN_DELTA || 3));
const MIN_SCORE = Math.max(20, Number(process.env.RELEASE_RISK_ACCEL_MIN_SCORE || 50));
const RECOVERY_MAX_SCORE = Math.max(0, Number(process.env.RELEASE_RISK_ACCEL_RECOVERY_MAX_SCORE || 45));
const DRY = ['1', 'true', 'yes'].includes(String(process.env.RELEASE_RISK_ACCEL_DRY_RUN || '').toLowerCase());

function readJson(p, fb) {
  try {
    if (!fs.existsSync(p)) return fb;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fb;
  }
}

function deltas(points) {
  const out = [];
  for (let i = 1; i < points.length; i += 1) {
    out.push(Number(points[i].riskScore || 0) - Number(points[i - 1].riskScore || 0));
  }
  return out;
}

function main() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token && !DRY) {
    console.log('[release-risk-acceleration] no token; skip.');
    process.exit(0);
  }

  const latest = readJson(LATEST, null);
  const hist = readJson(HIST, { points: [] });
  const points = Array.isArray(hist.points) ? hist.points : [];
  if (!latest || points.length < MIN_STREAK + 1) {
    console.log('[release-risk-acceleration] insufficient data; skip.');
    process.exit(0);
  }

  const d = deltas(points);
  const tail = d.slice(-MIN_STREAK);
  const score = Number(latest.riskScore || 0);
  const worsening = tail.length === MIN_STREAK && tail.every((x) => Number.isFinite(x) && x >= MIN_DELTA) && score >= MIN_SCORE;
  const recovering = tail.length === MIN_STREAK && tail.every((x) => Number.isFinite(x) && x <= 0) && score <= RECOVERY_MAX_SCORE;

  if (worsening) {
    const payload = {
      generatedAt: new Date().toISOString(),
      riskScore: score,
      band: latest.band || 'unknown',
      minStreak: MIN_STREAK,
      minDelta: MIN_DELTA,
      tailDeltas: tail,
      historyTail: points.slice(-Math.max(8, MIN_STREAK + 1)),
    };
    const bodyFile = path.join(REPORTS, 'release-risk-acceleration-body.md');
    fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(
      bodyFile,
      `## Release risk acceleration detected\n\n- **Dedupe key:** \`${FP}\`\n- **Current score:** ${score} (${latest.band || 'n/a'})\n- **Trigger:** last ${MIN_STREAK} deltas all >= ${MIN_DELTA}\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n`,
      'utf8',
    );
    if (DRY) {
      console.log('[release-risk-acceleration] DRY_RUN: would escalate', { score, tail });
      process.exit(0);
    }
    process.env.ISSUE_TITLE = `Release risk acceleration detected (${score})`;
    process.env.ISSUE_FINGERPRINT = FP;
    process.env.ISSUE_LABELS = 'automation,bug';
    process.env.ISSUE_BODY_FILE = bodyFile;
    const r = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
      encoding: 'utf8',
      env: process.env,
      cwd: ROOT,
    });
    if (r.status !== 0) console.warn('[release-risk-acceleration] escalate failed:', r.stderr || r.stdout);
    else console.log('[release-risk-acceleration] escalated.');
    process.exit(0);
  }

  if (recovering) {
    if (DRY) {
      console.log('[release-risk-acceleration] DRY_RUN: would close recovery issue');
      process.exit(0);
    }
    process.env.ISSUE_FINGERPRINT = FP;
    process.env.CLOSE_COMMENT =
      process.env.CLOSE_COMMENT ||
      `Auto-closing after release-risk acceleration recovered (score ${score}, deltas ${tail.join(', ')}).`;
    const r = spawnSync('node', ['scripts/automation/gh-issue-close-on-recovery.cjs'], {
      encoding: 'utf8',
      env: process.env,
      cwd: ROOT,
    });
    if (r.status !== 0) console.warn('[release-risk-acceleration] close failed:', r.stderr || r.stdout);
    else console.log('[release-risk-acceleration] recovery close complete.');
    process.exit(0);
  }

  console.log('[release-risk-acceleration] no acceleration/recovery trigger', { score, tail });
}

main();
