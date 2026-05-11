#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const OUTPUT_JSON = path.join(REPORTS_DIR, 'report-size-budget-guard-latest.json');
const OUTPUT_MD = path.join(REPORTS_DIR, 'report-size-budget-guard-latest.md');

const MAX_FILE_KB = Number(process.env.REPORT_SIZE_MAX_FILE_KB || 1536);
const MAX_TOTAL_MB = Number(process.env.REPORT_SIZE_MAX_TOTAL_MB || 8);

function bytesToKb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}

function bytesToMb(bytes) {
  return Number((bytes / (1024 * 1024)).toFixed(2));
}

function listReportFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json') || name.endsWith('.md'))
    .map((name) => path.join(dir, name));
}

function run() {
  const files = listReportFiles(REPORTS_DIR);
  const details = [];
  let totalBytes = 0;

  for (const filePath of files) {
    const stat = fs.statSync(filePath);
    totalBytes += stat.size;
    details.push({
      path: path.relative(ROOT, filePath),
      sizeBytes: stat.size,
      sizeKb: bytesToKb(stat.size),
    });
  }

  details.sort((a, b) => b.sizeBytes - a.sizeBytes);
  const oversizedFiles = details.filter((f) => f.sizeKb > MAX_FILE_KB);
  const totalMb = bytesToMb(totalBytes);
  const totalExceeded = totalMb > MAX_TOTAL_MB;

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      maxFileKb: MAX_FILE_KB,
      maxTotalMb: MAX_TOTAL_MB,
    },
    totals: {
      files: details.length,
      totalBytes,
      totalMb,
    },
    oversizedFiles,
    oversizedCount: oversizedFiles.length,
    totalExceeded,
    failed: oversizedFiles.length > 0 || totalExceeded,
    topLargest: details.slice(0, 20),
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2));

  const lines = [];
  lines.push('# Report Size Budget Guard');
  lines.push('');
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Files scanned: ${report.totals.files}`);
  lines.push(`- Total report size: ${report.totals.totalMb} MB (budget: ${MAX_TOTAL_MB} MB)`);
  lines.push(`- Oversized files: ${report.oversizedCount} (budget/file: ${MAX_FILE_KB} KB)`);
  lines.push('');

  if (report.failed) {
    lines.push('## Status');
    lines.push('FAILED');
    lines.push('');
  } else {
    lines.push('## Status');
    lines.push('PASS');
    lines.push('');
  }

  lines.push('## Largest Files');
  for (const item of report.topLargest) {
    lines.push(`- ${item.path}: ${item.sizeKb} KB`);
  }
  lines.push('');

  if (oversizedFiles.length > 0) {
    lines.push('## Oversized Files');
    for (const item of oversizedFiles) {
      lines.push(`- ${item.path}: ${item.sizeKb} KB (>${MAX_FILE_KB} KB)`);
    }
    lines.push('');
  }

  fs.writeFileSync(OUTPUT_MD, lines.join('\n'));

  if (report.failed) {
    console.error(
      `Report size budget exceeded (oversized=${report.oversizedCount}, totalExceeded=${report.totalExceeded}).`
    );
    process.exit(1);
  }

  console.log(`Report size budget guard passed (${report.totals.files} files, ${report.totals.totalMb} MB total).`);
}

run();
