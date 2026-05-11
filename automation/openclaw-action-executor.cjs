#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'openclaw-autonomous-app-improver-latest.json');
const OUTPUT_PATH = path.join(ROOT, 'automation', 'reports', 'openclaw-action-queue-latest.json');
const PATCH_ROUTER_PATH = path.join(ROOT, 'automation', 'reports', 'openclaw-hot-file-patch-router-latest.json');

const CATEGORY_HINTS = [
  { category: 'quality', regex: /(lint|type|test|regression|typescript|eslint)/i, command: 'npm run app:improvement-cycle' },
  { category: 'performance', regex: /(performance|core web vitals|bundle|lcp|cls|fcp)/i, command: 'npm run perf:optimize' },
  { category: 'seo', regex: /(seo|metadata|schema|internal links|serp)/i, command: 'npm run seo:audit' },
  { category: 'automation', regex: /(workflow|automation|ci|pipeline|guard|watchdog)/i, command: 'npm run automation:audit-summary' },
];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function categorize(text) {
  for (const hint of CATEGORY_HINTS) {
    if (hint.regex.test(text)) return hint;
  }
  return { category: 'general', command: 'npm run app:improve-summary' };
}

function normalizeRepoPath(p) {
  return String(p || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '');
}

function loadPatchRouter() {
  const data = readJson(PATCH_ROUTER_PATH);
  const routes = Array.isArray(data?.routes) ? data.routes : [];
  const byFile = new Map();
  for (const r of routes) {
    if (r && typeof r.file === 'string') {
      byFile.set(normalizeRepoPath(r.file), r);
    }
  }
  return { routes, byFile };
}

function patchHintsForTarget(router, targetPath) {
  if (!targetPath || !router.byFile.size) {
    return null;
  }
  const key = normalizeRepoPath(targetPath);
  const row = router.byFile.get(key);
  if (!row) {
    return null;
  }
  return {
    patchMode: row.patchMode,
    patchGuidance: row.guidance,
    hotFileRisk: row.risk,
  };
}

function main() {
  const report = readJson(REPORT_PATH);
  if (!report || !Array.isArray(report.lastResults)) {
    console.error('OpenClaw report is missing or invalid.');
    process.exit(1);
  }

  const router = loadPatchRouter();
  const now = new Date().toISOString();
  const dedupe = new Set();
  const queue = [];
  for (const result of report.lastResults.filter((r) => r && r.ok)) {
    const actions = Array.isArray(result.actions) ? result.actions : [];
    if (actions.length > 0) {
      for (const action of actions) {
        const summary = String(action.summary || result.snippet || '').slice(0, 200);
        if (!summary) {
          continue;
        }
        const hint = categorize([summary, action.command, action.targetPath].filter(Boolean).join(' '));
        const stableKey = `${result.worker}|${summary}|${action.targetPath || ''}|${action.command || ''}`;
        const id = `${hint.category}-${crypto.createHash('sha1').update(stableKey).digest('hex').slice(0, 12)}`;
        if (dedupe.has(id)) {
          continue;
        }
        dedupe.add(id);
        queue.push({
          id,
          createdAt: now,
          sourceWorker: result.worker,
          category: hint.category,
          recommendedCommand: action.command || hint.command,
          summary,
          targetPath: action.targetPath || '',
          severity: action.severity || 'unknown',
          confidence: Number.isFinite(Number(action.confidence)) ? Number(action.confidence) : null,
          actionType: action.type || 'suggestion',
          status: 'queued',
          source: 'structured-action',
        });
      }
      continue;
    }
    const hint = categorize(result.snippet || '');
    const summary = (result.snippet || '').slice(0, 200);
    if (!summary) {
      continue;
    }
    const id = `${hint.category}-${crypto.createHash('sha1').update(`${result.worker}|${summary}`).digest('hex').slice(0, 12)}`;
    if (dedupe.has(id)) {
      continue;
    }
    dedupe.add(id);
    queue.push({
      id,
      createdAt: now,
      sourceWorker: result.worker,
      category: hint.category,
      recommendedCommand: hint.command,
      summary,
      status: 'queued',
      source: 'legacy-snippet',
    });
  }

  const payload = {
    generatedAt: now,
    sourceReport: REPORT_PATH,
    totalQueued: queue.length,
    queue,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`OpenClaw action queue generated: ${OUTPUT_PATH} (${queue.length} items)`);
}

main();
