#!/usr/bin/env node

/**
 * AI Memory Consolidation Agent
 *
 * Reads memory/YYYY-MM-DD.md files, extracts significant events and learnings,
 * and updates MEMORY.md with distilled content. Keeps long-term memory curated.
 *
 * Features:
 * - Scans memory/ for daily files (YYYY-MM-DD.md)
 * - Extracts significant patterns (Added, Fixed, Merged, Decision, Lesson)
 * - Appends distilled entries to MEMORY.md with date prefix
 * - Trims MEMORY.md to last N entries (default 100)
 *
 * Runs: Weekly Sunday 9 AM via cron
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MEMORY_DIR = path.join(ROOT, 'memory');
const MEMORY_FILE = path.join(ROOT, 'MEMORY.md');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'memory-consolidation-latest.json');
const MAX_ENTRIES = parseInt(process.env.MEMORY_MAX_ENTRIES || '100', 10);
const DAYS_BACK = parseInt(process.env.MEMORY_DAYS_BACK || '14', 10);
const DRY_RUN = process.env.DRY_RUN === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[MemoryConsolidation] ${ts} | ${msg}`);
}

function ensureDirs() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  if (!fs.existsSync(MEMORY_DIR)) {
    log('memory/ directory not found. Skipping.');
    return false;
  }
  return true;
}

function parseDateFromFilename(name) {
  const m = name.match(/^(\d{4})-(\d{2})-(\d{2})\.md$/);
  if (!m) return null;
  return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
}

function getDailyFiles() {
  if (!fs.existsSync(MEMORY_DIR)) return [];
  const files = fs.readdirSync(MEMORY_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => ({ name: f, path: path.join(MEMORY_DIR, f), date: parseDateFromFilename(f) }))
    .filter((x) => x.date);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS_BACK);
  return files.filter((x) => x.date >= cutoff).sort((a, b) => a.date - b.date);
}

const SIGNIFICANT_PATTERNS = [
  /\*\*Added\*\*/i,
  /\*\*Fixed\*\*/i,
  /\*\*Merged\*\*/i,
  /\*\*Updated\*\*/i,
  /\*\*Enhanced\*\*/i,
  /\*\*Decision\*\*/i,
  /\*\*Lesson\*\*/i,
  /\*\*Remember\*\*/i,
  /^##\s+/,
  /^###\s+/,
  /-\s+\*\*[^*]+\*\*:/,
  /merged.*main/i,
  /pushed.*main/i,
  /critical|important|key\s+change/i,
];

function extractSignificant(content) {
  const lines = content.split('\n');
  const extracted = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 20) continue;
    if (SIGNIFICANT_PATTERNS.some((p) => p.test(trimmed))) {
      extracted.push(trimmed);
    }
  }
  return extracted;
}

function readMemoryMd() {
  try {
    return fs.readFileSync(MEMORY_FILE, 'utf8');
  } catch {
    return '';
  }
}

function parseMemoryEntries(content) {
  const entries = [];
  const lines = content.split('\n');
  let current = null;
  for (const line of lines) {
    const match = line.match(/^-\s+\[([^\]]+)\]\s+([^|]+)\s*\|\s*(.*)$/);
    if (match) {
      current = { prefix: match[1], date: match[2].trim(), text: match[3].trim(), raw: line };
      entries.push(current);
    } else if (current && (line.startsWith('  ') || line.startsWith('\t'))) {
      current.text += '\n' + line.trim();
      current.raw += '\n' + line;
    }
  }
  return entries;
}

function appendToMemory(newEntries, dateStr) {
  const existing = readMemoryMd();
  const entries = parseMemoryEntries(existing);
  const seen = new Set(entries.map((e) => e.text.slice(0, 80)));
  let added = 0;
  for (const text of newEntries) {
    const key = text.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    const line = `- [MemoryConsolidation] ${dateStr} | ${text}\n`;
    if (!DRY_RUN) fs.appendFileSync(MEMORY_FILE, line);
    added++;
  }
  return added;
}

function trimMemory(maxEntries) {
  const content = readMemoryMd();
  const entries = parseMemoryEntries(content);
  if (entries.length <= maxEntries) return 0;
  const toKeep = entries.slice(-maxEntries);
  const headerLines = content.split('\n').filter((l) => l.startsWith('#') || l.startsWith('---') || l.trim() === '');
  const header = headerLines.length > 0 ? headerLines.join('\n') + '\n' : '';
  const newContent = header + toKeep.map((e) => e.raw).join('\n') + '\n';
  if (!DRY_RUN) fs.writeFileSync(MEMORY_FILE, newContent.trim() + '\n');
  return entries.length - maxEntries;
}

function run() {
  if (!ensureDirs()) {
    const report = { timestamp: new Date().toISOString(), status: 'skipped', reason: 'no_memory_dir' };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    return report;
  }

  log('=== Memory Consolidation Started ===');
  const dailyFiles = getDailyFiles();
  log(`Found ${dailyFiles.length} daily files (last ${DAYS_BACK} days)`);

  let totalExtracted = 0;
  let totalAppended = 0;

  for (const { name, path: filePath, date } of dailyFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const extracted = extractSignificant(content);
    if (extracted.length === 0) continue;
    totalExtracted += extracted.length;
    const dateStr = date.toISOString().slice(0, 10);
    const appended = appendToMemory(extracted, dateStr);
    totalAppended += appended;
  }

  const trimmed = DRY_RUN ? 0 : trimMemory(MAX_ENTRIES);
  if (trimmed > 0) log(`Trimmed ${trimmed} old entries from MEMORY.md`);

  const report = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    dailyFilesScanned: dailyFiles.length,
    entriesExtracted: totalExtracted,
    entriesAppended: totalAppended,
    entriesTrimmed: trimmed,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Done. Extracted ${totalExtracted}, appended ${totalAppended}.`);
  return report;
}

function summary() {
  const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  console.log(JSON.stringify(data, null, 2));
}

const cmd = process.argv[2] || 'run';
if (cmd === 'summary') {
  summary();
} else {
  run();
}
