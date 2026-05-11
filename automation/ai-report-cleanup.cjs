#!/usr/bin/env node

/**
 * AI Report Cleanup Agent
 *
 * Manages report retention in automation/reports/ by removing stale files
 * while preserving *-latest-* files and the most recent N reports per type.
 *
 * Environment variables:
 *   KEEP_DAYS       — delete reports older than this (default 7)
 *   KEEP_LATEST     — always keep *-latest-* files (default true)
 *   KEEP_PER_TYPE   — keep this many most-recent reports per prefix (default 5)
 *   DRY_RUN         — log what would be deleted without actually deleting (default false)
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(process.cwd(), 'automation', 'reports');
const LOGS_DIR = path.join(process.cwd(), 'automation', 'logs');

const KEEP_DAYS = parseInt(process.env.KEEP_DAYS || '7', 10);
const KEEP_LATEST = process.env.KEEP_LATEST !== 'false';
const KEEP_PER_TYPE = parseInt(process.env.KEEP_PER_TYPE || '5', 10);
const DRY_RUN = process.env.DRY_RUN === 'true';

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[ReportCleanup] ${ts} | ${msg}`;
  console.log(line);
}

function getPrefix(filename) {
  const match = filename.match(/^(.+?)-\d+\.json$/);
  return match ? match[1] : null;
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) {
    log('Reports directory does not exist. Nothing to clean.');
    return;
  }

  const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.json'));
  const cutoff = Date.now() - KEEP_DAYS * 86400000;
  let deleted = 0;
  let kept = 0;

  const latestFiles = new Set(files.filter(f => f.includes('-latest')));

  const prefixGroups = {};
  for (const f of files) {
    if (latestFiles.has(f)) continue;
    const prefix = getPrefix(f);
    if (!prefix) continue;
    if (!prefixGroups[prefix]) prefixGroups[prefix] = [];
    const stat = fs.statSync(path.join(REPORTS_DIR, f));
    prefixGroups[prefix].push({ name: f, mtime: stat.mtimeMs });
  }

  const protectedFiles = new Set(latestFiles);
  for (const [prefix, group] of Object.entries(prefixGroups)) {
    group.sort((a, b) => b.mtime - a.mtime);
    const toKeep = group.slice(0, KEEP_PER_TYPE);
    toKeep.forEach(item => protectedFiles.add(item.name));
  }

  for (const f of files) {
    if (KEEP_LATEST && protectedFiles.has(f)) {
      kept++;
      continue;
    }

    const filepath = path.join(REPORTS_DIR, f);
    const stat = fs.statSync(filepath);

    if (stat.mtimeMs < cutoff) {
      if (DRY_RUN) {
        log(`[DRY RUN] Would delete: ${f}`);
      } else {
        fs.unlinkSync(filepath);
        deleted++;
      }
    } else {
      kept++;
    }
  }

  log(`Cleanup complete: deleted=${deleted}, kept=${kept}, dry_run=${DRY_RUN}`);

  const logDir = path.join(process.cwd(), 'automation', 'logs');
  if (fs.existsSync(logDir)) {
    const logFiles = fs.readdirSync(logDir).filter(f => f.endsWith('.log'));
    let logsCleaned = 0;
    for (const f of logFiles) {
      const filepath = path.join(logDir, f);
      const stat = fs.statSync(filepath);
      if (stat.mtimeMs < cutoff && stat.size > 0) {
        if (DRY_RUN) {
          log(`[DRY RUN] Would truncate log: ${f}`);
        } else {
          fs.truncateSync(filepath, 0);
          logsCleaned++;
        }
      }
    }
    log(`Log cleanup: truncated=${logsCleaned} old log files`);
  }
}

try {
  run();
} catch (err) {
  log(`Error: ${err.message}`);
  process.exit(1);
}
