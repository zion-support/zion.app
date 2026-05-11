#!/usr/bin/env node
/**
 * Builds a lightweight index of open GitHub issues that carry automation fingerprint labels.
 * Includes MTTR metrics from recently closed fingerprint issues.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'reports', 'automation-open-issues-index-latest.json');
const MTTR_HISTORY_OUT = path.join(__dirname, 'reports', 'automation-issue-mttr-history.json');

function ghJson(args) {
  const res = spawnSync('gh', args, { encoding: 'utf8', env: process.env });
  if (res.status !== 0) {
    console.error('gh failed:', res.stderr || res.stdout);
    return null;
  }
  try {
    return JSON.parse(res.stdout || '[]');
  } catch {
    return null;
  }
}

function hoursBetween(aIso, bIso) {
  const a = new Date(aIso || 0).getTime();
  const b = new Date(bIso || 0).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return null;
  return (b - a) / 3600000;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function classifyMttr(avgHours) {
  if (avgHours == null) return 'unknown';
  if (avgHours >= 48) return 'critical';
  if (avgHours >= 24) return 'warning';
  return 'healthy';
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function mttrSummary(closedRows, fpPrefix) {
  const groups = new Map();
  for (const row of closedRows || []) {
    const fpLabels = (row.labels || [])
      .map((l) => l.name)
      .filter((n) => typeof n === 'string' && n.startsWith(fpPrefix));
    if (fpLabels.length === 0) continue;
    const mttr = hoursBetween(row.createdAt, row.closedAt);
    if (mttr == null) continue;
    for (const lab of fpLabels) {
      const cur = groups.get(lab) || { label: lab, count: 0, totalHours: 0 };
      cur.count += 1;
      cur.totalHours += mttr;
      groups.set(lab, cur);
    }
  }

  const byFingerprint = [...groups.values()]
    .map((x) => ({
      label: x.label,
      samples: x.count,
      avgHours: round2(x.totalHours / Math.max(1, x.count)),
    }))
    .sort((a, b) => b.samples - a.samples || a.label.localeCompare(b.label));

  const totals = byFingerprint.reduce(
    (acc, row) => {
      acc.samples += row.samples;
      acc.weightedHours += row.avgHours * row.samples;
      return acc;
    },
    { samples: 0, weightedHours: 0 },
  );

  return {
    samples: totals.samples,
    avgHours: totals.samples ? round2(totals.weightedHours / totals.samples) : null,
    band: classifyMttr(totals.samples ? round2(totals.weightedHours / totals.samples) : null),
    byFingerprint: byFingerprint.slice(0, 30),
  };
}

function main() {
  const fpPrefix = 'automation-fp-';

  const openRows = ghJson([
    'issue',
    'list',
    '--state',
    'open',
    '--json',
    'number,title,url,labels,updatedAt,createdAt',
    '--limit',
    '300',
  ]);
  if (!openRows) {
    process.exit(1);
  }

  const closedRows =
    ghJson([
      'issue',
      'list',
      '--state',
      'closed',
      '--json',
      'number,title,url,labels,createdAt,closedAt',
      '--limit',
      '300',
    ]) || [];

  const indexed = openRows
    .map((row) => {
      const fpLabels = (row.labels || [])
        .map((l) => l.name)
        .filter((n) => typeof n === 'string' && n.startsWith(fpPrefix));
      if (fpLabels.length === 0) return null;
      const ageH = hoursBetween(row.createdAt, new Date().toISOString());
      return {
        number: row.number,
        title: row.title,
        url: row.url,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        ageHours: ageH == null ? null : round2(ageH),
        fingerprintLabels: fpLabels,
      };
    })
    .filter(Boolean);

  const mttr = mttrSummary(closedRows, fpPrefix);
  const mttrHistory = readJson(MTTR_HISTORY_OUT, []);
  const historyArr = Array.isArray(mttrHistory) ? mttrHistory : [];
  historyArr.push({
    generatedAt: new Date().toISOString(),
    openCount: indexed.length,
    avgHours: mttr.avgHours,
    samples: mttr.samples,
    band: mttr.band,
  });
  while (historyArr.length > 60) historyArr.shift();

  const prev = historyArr.length >= 2 ? historyArr[historyArr.length - 2] : null;
  const deltaHours =
    prev && typeof prev.avgHours === 'number' && typeof mttr.avgHours === 'number'
      ? round2(mttr.avgHours - prev.avgHours)
      : null;

  const mttrWithTrend = {
    ...mttr,
    trend: {
      previousAvgHours: prev && typeof prev.avgHours === 'number' ? prev.avgHours : null,
      deltaHours,
      direction: deltaHours == null ? 'n/a' : deltaHours > 0 ? 'worse' : deltaHours < 0 ? 'better' : 'flat',
    },
    history: historyArr.slice(-30),
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    openAutomationFingerprintIssues: indexed.length,
    issues: indexed,
    mttr: mttrWithTrend,
    githubIssuesQueryHint:
      'is:open label:bug automation OR is:open label:automation (adjust per repo conventions)',
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.mkdirSync(path.dirname(MTTR_HISTORY_OUT), { recursive: true });
  fs.writeFileSync(MTTR_HISTORY_OUT, `${JSON.stringify(historyArr, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    'Wrote',
    OUT,
    'open=',
    indexed.length,
    'mttr.samples=',
    mttr.samples,
    'band=',
    mttr.band,
  );
}

main();
