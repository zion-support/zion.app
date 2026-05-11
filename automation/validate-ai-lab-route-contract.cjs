#!/usr/bin/env node
/**
 * Ensures AI Lab catalog hrefs, pages-to-visit aiLab paths, and smoke routes stay aligned.
 * Exits 1 on mismatch with actionable stderr.
 *
 * Flags / env:
 *   --fix  or  AI_LAB_ROUTE_CONTRACT_AUTOFIX=1  — run smoke:routes:generate once then re-validate
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const TOOLS_TS = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const PAGES = path.join(ROOT, 'automation', 'data', 'pages-to-visit.json');
const SMOKE = path.join(ROOT, 'config', 'smoke-routes.txt');
const GEN = path.join(ROOT, 'scripts', 'automation', 'generate-smoke-routes.cjs');

function extractToolHrefs() {
  const text = fs.readFileSync(TOOLS_TS, 'utf8');
  const hrefs = new Set();
  const re = /href:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) {
    const h = m[1];
    if (h.startsWith('/ai-lab/')) hrefs.add(h);
  }
  return hrefs;
}

function loadPagesVisit() {
  const j = JSON.parse(fs.readFileSync(PAGES, 'utf8'));
  const ai = Array.isArray(j.aiLab) ? j.aiLab : [];
  return new Set(ai.map((x) => x.path).filter(Boolean));
}

function loadSmokeRoutes() {
  const raw = fs.readFileSync(SMOKE, 'utf8');
  return new Set(
    raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#')),
  );
}

function diffSet(a, labelA, b, labelB) {
  const onlyA = [...a].filter((x) => !b.has(x)).sort();
  const onlyB = [...b].filter((x) => !a.has(x)).sort();
  if (onlyA.length || onlyB.length) {
    console.error(`[ai-lab-route-contract] mismatch ${labelA} vs ${labelB}`);
    if (onlyA.length) console.error(`  only in ${labelA}:`, onlyA.join(', '));
    if (onlyB.length) console.error(`  only in ${labelB}:`, onlyB.join(', '));
    return false;
  }
  return true;
}

function runValidate() {
  if (!fs.existsSync(TOOLS_TS) || !fs.existsSync(PAGES) || !fs.existsSync(SMOKE)) {
    console.error('[ai-lab-route-contract] missing input file(s)');
    return false;
  }

  const tools = extractToolHrefs();
  const pages = loadPagesVisit();
  const smoke = loadSmokeRoutes();

  let ok = true;
  ok = diffSet(tools, 'ai-lab-tools hrefs', pages, 'pages-to-visit aiLab') && ok;

  const missingSmoke = [...tools].filter((h) => !smoke.has(h)).sort();
  if (missingSmoke.length) {
    ok = false;
    console.error('[ai-lab-route-contract] tool routes missing from config/smoke-routes.txt:', missingSmoke.join(', '));
    console.error('  Fix: npm run smoke:routes:generate (and commit config/smoke-routes.txt)');
  }

  if (ok) {
    console.log(
      `[ai-lab-route-contract] ok (${tools.size} tools, smoke covers catalog)`
    );
  }
  return ok;
}

function main() {
  const wantFix = process.argv.includes('--fix') || String(process.env.AI_LAB_ROUTE_CONTRACT_AUTOFIX || '') === '1';
  let ok = runValidate();
  if (!ok && wantFix) {
    console.log('[ai-lab-route-contract] auto-fix: running smoke route generator...');
    const r = spawnSync(process.execPath, [GEN], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) process.exit(1);
    ok = runValidate();
    if (ok) {
      console.log('[ai-lab-route-contract] auto-fix succeeded; commit config/smoke-routes.txt if changed.');
    }
  }
  if (!ok) process.exit(1);
}

main();
