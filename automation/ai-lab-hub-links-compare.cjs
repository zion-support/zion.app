#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PROD_REPORT = path.join(ROOT, process.env.PROD_REPORT || 'automation/reports/ai-lab-hub-links-smoke-prod.json');
const PREVIEW_REPORT = path.join(
  ROOT,
  process.env.PREVIEW_REPORT || 'automation/reports/ai-lab-hub-links-smoke-preview.json',
);
const OUT_REPORT = path.join(
  ROOT,
  process.env.OUT_REPORT || 'automation/reports/ai-lab-hub-links-smoke-compare-latest.json',
);
const HISTORY_REPORT = path.join(
  ROOT,
  process.env.HISTORY_REPORT || 'automation/reports/ai-lab-hub-links-smoke-compare-history.json',
);
const FLAKE_STATE = path.join(
  ROOT,
  process.env.FLAKE_STATE || 'automation/reports/ai-lab-hub-links-flake-state.json',
);

function readJsonSafe(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function failedSet(report) {
  const rows = Array.isArray(report?.results) ? report.results : [];
  return new Set(rows.filter((r) => r.ok !== true).map((r) => String(r.path)));
}

function readJsonSafeArray(p) {
  const j = readJsonSafe(p);
  return Array.isArray(j) ? j : [];
}

function updateFlakeState(prodFailed, previewFailed) {
  const prev = readJsonSafe(FLAKE_STATE) || { routes: {} };
  const routes = prev.routes && typeof prev.routes === 'object' ? prev.routes : {};
  const all = new Set([...Object.keys(routes), ...prodFailed, ...previewFailed]);
  for (const route of all) {
    const row = routes[route] || { hits: 0, misses: 0, prodFails: 0, previewFails: 0 };
    const inProd = prodFailed.has(route);
    const inPrev = previewFailed.has(route);
    if (inProd || inPrev) row.hits += 1;
    else row.misses += 1;
    if (inProd) row.prodFails += 1;
    if (inPrev) row.previewFails += 1;
    row.samples = row.hits + row.misses;
    row.flakeScore = row.samples > 0 ? Math.round((row.hits / row.samples) * 1000) / 1000 : 0;
    routes[route] = row;
  }
  const next = { updatedAt: new Date().toISOString(), routes };
  fs.mkdirSync(path.dirname(FLAKE_STATE), { recursive: true });
  fs.writeFileSync(FLAKE_STATE, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  const top = Object.entries(routes)
    .map(([route, row]) => ({ route, ...row }))
    .filter((r) => r.samples >= 3 && r.flakeScore > 0)
    .sort((a, b) => b.flakeScore - a.flakeScore || b.samples - a.samples)
    .slice(0, 10);
  return top;
}

function main() {
  const prod = readJsonSafe(PROD_REPORT);
  const preview = readJsonSafe(PREVIEW_REPORT);
  const prodFailed = failedSet(prod);
  const previewFailed = failedSet(preview);

  const regressedInPreview = [...previewFailed].filter((p) => !prodFailed.has(p)).sort();
  const improvedInPreview = [...prodFailed].filter((p) => !previewFailed.has(p)).sort();
  const regressedInProd = [...prodFailed].filter((p) => !previewFailed.has(p)).sort();
  const flakyRoutes = updateFlakeState(prodFailed, previewFailed);
  const out = {
    generatedAt: new Date().toISOString(),
    prodPresent: Boolean(prod),
    previewPresent: Boolean(preview),
    prodFailedCount: prodFailed.size,
    previewFailedCount: previewFailed.size,
    regressedInPreview,
    regressedInProd,
    improvedInPreview,
    flakyRoutes,
    severity: prodFailed.size > 0 ? 'critical' : regressedInPreview.length > 0 ? 'warning' : 'none',
    ok: regressedInPreview.length === 0,
  };
  fs.mkdirSync(path.dirname(OUT_REPORT), { recursive: true });
  fs.writeFileSync(OUT_REPORT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  const hist = readJsonSafeArray(HISTORY_REPORT);
  hist.push({
    generatedAt: out.generatedAt,
    prodFailedCount: out.prodFailedCount,
    previewFailedCount: out.previewFailedCount,
    regressedInPreviewCount: out.regressedInPreview.length,
    regressedInProdCount: out.regressedInProd.length,
    recoveredCount: out.improvedInPreview.length,
  });
  const max = Math.max(60, Number(process.env.AI_LAB_HUB_COMPARE_HISTORY_MAX || 240));
  const clipped = hist.length > max ? hist.slice(hist.length - max) : hist;
  fs.writeFileSync(HISTORY_REPORT, `${JSON.stringify(clipped, null, 2)}\n`, 'utf8');
  console.log(
    `[ai-lab-hub-links-compare] prodFailed=${out.prodFailedCount} previewFailed=${out.previewFailedCount} regressionsPreview=${out.regressedInPreview.length} severity=${out.severity}`,
  );
  const failOn = String(process.env.AI_LAB_HUB_COMPARE_FAIL_ON_REGRESSION || '1') !== '0';
  if (failOn && out.regressedInPreview.length > 0) process.exit(1);
}

main();
