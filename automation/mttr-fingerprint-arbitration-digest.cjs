#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const EXPLAIN = path.join(REPORTS, 'mttr-fingerprint-suppression-explainability-latest.json');
const REG = path.join(REPORTS, 'mttr-fingerprint-regression-latest.json');
const OUT_JSON = path.join(REPORTS, 'mttr-fingerprint-arbitration-digest-latest.json');
const OUT_MD = path.join(REPORTS, 'mttr-fingerprint-arbitration-digest-latest.md');

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
function writeText(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${text}\n`, 'utf8');
}
function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}

function main() {
  const explain = readJson(EXPLAIN, {});
  const reg = readJson(REG, {});
  const suppressed = Array.isArray(explain?.suppressed) ? explain.suppressed : [];
  const observed = Array.isArray(reg?.observed) ? reg.observed : [];
  const escalated = Array.isArray(reg?.escalated) ? reg.escalated : [];

  const byWinner = {};
  for (const row of suppressed) {
    const fp = row?.suppressionWinnerFingerprint || 'unknown';
    const cur = byWinner[fp] || { winnerFingerprint: fp, count: 0, labels: [], maxWinnerPriority: null };
    cur.count += 1;
    if (row?.label) cur.labels.push(row.label);
    const p = Number(row?.suppressedByPriority);
    if (Number.isFinite(p)) cur.maxWinnerPriority = cur.maxWinnerPriority == null ? p : Math.max(cur.maxWinnerPriority, p);
    byWinner[fp] = cur;
  }

  const winnerGroups = Object.values(byWinner)
    .map((g) => ({
      ...g,
      labels: g.labels.slice(0, 8),
      maxWinnerPriority: g.maxWinnerPriority == null ? null : round2(g.maxWinnerPriority),
    }))
    .sort((a, b) => b.count - a.count || String(a.winnerFingerprint).localeCompare(String(b.winnerFingerprint)))
    .slice(0, 10);

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceGeneratedAt: explain?.generatedAt || null,
    totals: {
      observed: Number(explain?.summary?.observed ?? observed.length ?? 0),
      suppressed: Number(explain?.summary?.suppressed ?? suppressed.length ?? 0),
      escalated: Number(explain?.summary?.escalated ?? escalated.length ?? 0),
      recovered: Number(explain?.summary?.recovered ?? 0),
    },
    suppressionRate:
      Number(explain?.summary?.observed || 0) > 0
        ? round2((Number(explain?.summary?.suppressed || 0) / Number(explain.summary.observed)) * 100)
        : 0,
    topSuppressionWinners: winnerGroups,
    topSuppressedLabels: suppressed.slice(0, 10).map((r) => ({
      label: r.label || null,
      severity: r.severity || null,
      suppressionReason: r.suppressionReason || null,
      winnerFingerprint: r.suppressionWinnerFingerprint || null,
      suppressedByPriority: Number.isFinite(Number(r.suppressedByPriority)) ? round2(Number(r.suppressedByPriority)) : null,
      priorityScore: Number.isFinite(Number(r.priorityScore)) ? round2(Number(r.priorityScore)) : null,
    })),
  };

  const md = [
    '# MTTR fingerprint arbitration digest',
    '',
    `- generatedAt: ${payload.generatedAt}`,
    `- observed: ${payload.totals.observed}`,
    `- suppressed: ${payload.totals.suppressed}`,
    `- escalated: ${payload.totals.escalated}`,
    `- recovered: ${payload.totals.recovered}`,
    `- suppressionRate: ${payload.suppressionRate}%`,
    '',
    '## Top suppression winners',
    ...(payload.topSuppressionWinners.length
      ? payload.topSuppressionWinners.map(
          (g) =>
            `- ${g.winnerFingerprint}: ${g.count} suppressed (max winner priority: ${g.maxWinnerPriority ?? 'n/a'})`,
        )
      : ['- none']),
    '',
    '## Top suppressed labels',
    ...(payload.topSuppressedLabels.length
      ? payload.topSuppressedLabels.map(
          (r) =>
            `- ${r.label}: ${r.severity || 'n/a'} | by ${r.winnerFingerprint || 'n/a'} (${r.suppressedByPriority ?? 'n/a'})`,
        )
      : ['- none']),
  ].join('\n');

  writeJson(OUT_JSON, payload);
  writeText(OUT_MD, md);
  console.log(
    'mttr-fingerprint-arbitration-digest:',
    JSON.stringify({
      observed: payload.totals.observed,
      suppressed: payload.totals.suppressed,
      winners: payload.topSuppressionWinners.length,
    }),
  );
}

main();
