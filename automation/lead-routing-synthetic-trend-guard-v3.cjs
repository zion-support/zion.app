#!/usr/bin/env node
/**
 * Lead Routing Synthetic Trend Guard v3
 * - Tracks rolling history from v2 synthetic report
 * - Escalates on sustained warning/critical streak
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const INPUT = path.join(REPORT_DIR, 'lead-routing-synthetic-intelligence-v2-latest.json');
const HISTORY = path.join(REPORT_DIR, 'lead-routing-synthetic-trend-v3-history.json');
const STATE = path.join(REPORT_DIR, 'lead-routing-synthetic-trend-v3-state.json');
const OUT_JSON = path.join(REPORT_DIR, 'lead-routing-synthetic-trend-v3-latest.json');
const OUT_MD = path.join(REPORT_DIR, 'lead-routing-synthetic-trend-v3-latest.md');

const STREAK_THRESHOLD = Number(process.env.LEAD_ROUTING_STREAK_THRESHOLD || 6);
const HISTORY_LIMIT = Number(process.env.LEAD_ROUTING_HISTORY_LIMIT || 360);

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const nowIso = new Date().toISOString();
  const base = readJson(INPUT, null);
  if (!base) {
    const payload = {
      generatedAt: nowIso,
      status: 'warning',
      reason: 'missing lead routing v2 report',
      shouldEscalate: false,
      shouldClose: false,
    };
    writeJson(OUT_JSON, payload);
    fs.writeFileSync(
      OUT_MD,
      '# Lead routing synthetic trend v3\n\nMissing input report.\n',
      'utf8',
    );
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'lead_routing_trend_status=warning\n', 'utf8');
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'lead_routing_trend_escalate=false\n', 'utf8');
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'lead_routing_trend_close=false\n', 'utf8');
    }
    return;
  }

  const status = String(base.status || 'warning');
  const hist = readJson(HISTORY, { points: [] });
  const points = Array.isArray(hist.points) ? hist.points : [];
  points.push({
    at: nowIso,
    status,
    score: Number(base.score || 0),
    findings: Number(base?.counts?.total || 0),
  });
  const trimmed = points.slice(-Math.max(24, HISTORY_LIMIT));
  writeJson(HISTORY, { generatedAt: nowIso, points: trimmed });

  let warnLikeStreak = 0;
  for (let i = trimmed.length - 1; i >= 0; i -= 1) {
    const s = String(trimmed[i].status || 'warning');
    if (s === 'warning' || s === 'critical') warnLikeStreak += 1;
    else break;
  }

  const state = readJson(STATE, {
    issueOpen: false,
    lastEscalatedAt: null,
    lastClosedAt: null,
  });
  const shouldEscalate = warnLikeStreak >= STREAK_THRESHOLD && !state.issueOpen;
  const shouldClose = warnLikeStreak === 0 && Boolean(state.issueOpen);
  const nextState = {
    updatedAt: nowIso,
    issueOpen: shouldEscalate ? true : shouldClose ? false : Boolean(state.issueOpen),
    lastEscalatedAt: shouldEscalate ? nowIso : state.lastEscalatedAt || null,
    lastClosedAt: shouldClose ? nowIso : state.lastClosedAt || null,
    warnLikeStreak,
  };
  writeJson(STATE, nextState);

  const payload = {
    generatedAt: nowIso,
    status,
    score: Number(base.score || 0),
    warnLikeStreak,
    streakThreshold: STREAK_THRESHOLD,
    shouldEscalate,
    shouldClose,
    issueOpen: nextState.issueOpen,
  };
  writeJson(OUT_JSON, payload);

  const md = [
    '# Lead routing synthetic trend v3',
    '',
    `Generated: ${nowIso}`,
    `Status: **${status}**`,
    `Warn-like streak: **${warnLikeStreak}** / threshold ${STREAK_THRESHOLD}`,
    `Escalate: **${shouldEscalate ? 'YES' : 'NO'}**`,
    `Close: **${shouldClose ? 'YES' : 'NO'}**`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `lead_routing_trend_status=${status}\n`, 'utf8');
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `lead_routing_trend_escalate=${shouldEscalate ? 'true' : 'false'}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `lead_routing_trend_close=${shouldClose ? 'true' : 'false'}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `lead_routing_trend_streak=${warnLikeStreak}\n`,
      'utf8',
    );
  }

  console.log(
    `lead-routing-synthetic-trend-v3: status=${status} streak=${warnLikeStreak} escalate=${shouldEscalate} close=${shouldClose}`,
  );
}

main();
