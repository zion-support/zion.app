#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Cooldown-aware escalation for elevated release risk.
 * Reads automation/reports/release-risk-score-latest.json
 * State: automation/reports/release-risk-escalate-state.json
 *
 * Env:
 *   GH_TOKEN / GITHUB_TOKEN
 *   RELEASE_RISK_ESCALATE_MIN (default 75)
 *   RELEASE_RISK_ESCALATE_COOLDOWN_HOURS (default 24)
 *   RELEASE_RISK_ESCALATE_DRY_RUN (1 = no gh)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const SCORE = path.join(REPORTS, 'release-risk-score-latest.json');
const STATE = path.join(REPORTS, 'release-risk-escalate-state.json');
const FP = 'release-risk-elevated';

const MIN = Math.min(100, Math.max(50, Number(process.env.RELEASE_RISK_ESCALATE_MIN || 75)));
const COOLDOWN_MS =
  Math.max(1, Number(process.env.RELEASE_RISK_ESCALATE_COOLDOWN_HOURS || 24)) * 3600000;
const DRY = process.env.RELEASE_RISK_ESCALATE_DRY_RUN === '1' || process.env.RELEASE_RISK_ESCALATE_DRY_RUN === 'true';

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
    console.log('[release-risk-escalate] no token; skip.');
    process.exit(0);
  }

  const score = readJson(SCORE, null);
  if (!score || typeof score.riskScore !== 'number') {
    console.log('[release-risk-escalate] no release-risk-score-latest.json; skip.');
    process.exit(0);
  }

  const risk = Number(score.riskScore);
  if (risk < MIN) {
    console.log(`[release-risk-escalate] risk ${risk} < min ${MIN}; no escalate.`);
    const st = readJson(STATE, {});
    st.lastCheckedAt = new Date().toISOString();
    st.lastRiskScore = risk;
    st.escalated = false;
    fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(STATE, JSON.stringify(st, null, 2));
    process.exit(0);
  }

  const prev = readJson(STATE, {});
  const lastEsc = prev.lastEscalatedAt ? new Date(prev.lastEscalatedAt).getTime() : 0;
  const now = Date.now();
  if (lastEsc && now - lastEsc < COOLDOWN_MS) {
    console.log(
      `[release-risk-escalate] cooldown active (${Math.round((now - lastEsc) / 3600000)}h since last); skip notify.`,
    );
    const st = { ...prev, lastCheckedAt: new Date().toISOString(), lastRiskScore: risk, skippedCooldown: true };
    fs.mkdirSync(REPORTS, { recursive: true });
    fs.writeFileSync(STATE, JSON.stringify(st, null, 2));
    process.exit(0);
  }

  const bodyFile = path.join(REPORTS, 'release-risk-elevated-body.md');
  fs.writeFileSync(
    bodyFile,
    `## Release risk elevated\n\n- **Dedupe key:** \`${FP}\`\n- **riskScore:** ${risk} (band: ${score.band || 'n/a'})\n\n\`\`\`json\n${JSON.stringify(score, null, 2)}\n\`\`\`\n`,
  );

  if (DRY) {
    console.log('[release-risk-escalate] DRY_RUN: would escalate', risk);
    process.exit(0);
  }

  process.env.ISSUE_TITLE = `Release risk elevated (${risk})`;
  process.env.ISSUE_FINGERPRINT = FP;
  process.env.ISSUE_LABELS = 'bug,automation';
  process.env.ISSUE_BODY_FILE = bodyFile;

  const r = spawnSync('node', ['scripts/automation/gh-issue-dedupe-or-create.cjs'], {
    encoding: 'utf8',
    env: process.env,
    cwd: ROOT,
  });
  if (r.status !== 0) console.warn('[release-risk-escalate] gh-issue-dedupe-or-create:', r.stderr || r.stdout);

  const st = {
    lastEscalatedAt: new Date().toISOString(),
    lastRiskScore: risk,
    lastCheckedAt: new Date().toISOString(),
    escalated: true,
  };
  fs.writeFileSync(STATE, JSON.stringify(st, null, 2));
  console.log('[release-risk-escalate] done.');
}

main();
