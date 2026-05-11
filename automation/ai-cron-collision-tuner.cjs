#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const JSON_REPORT = path.join(REPORT_DIR, 'cron-collision-latest.json');
const MD_REPORT = path.join(REPORT_DIR, 'cron-collision-latest.md');
const DENSITY_THRESHOLD = Number(process.env.CRON_DENSITY_THRESHOLD || 4);

function listWorkflowFiles() {
  if (!fs.existsSync(WORKFLOWS_DIR)) return [];
  return fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .map((name) => path.join(WORKFLOWS_DIR, name));
}

function parseCrons(content) {
  const matches = content.match(/cron:\s*['"]([^'"]+)['"]/g) || [];
  return matches
    .map((line) => line.match(/cron:\s*['"]([^'"]+)['"]/)?.[1]?.trim())
    .filter(Boolean);
}

function minuteHourKey(cronExpr) {
  const parts = cronExpr.split(/\s+/);
  if (parts.length < 5) return null;
  return `${parts[0]} ${parts[1]}`;
}

function toMd(report) {
  const lines = [];
  lines.push('# Cron Collision Report');
  lines.push('');
  lines.push(`- Generated at: \`${report.generatedAt}\``);
  lines.push(`- Workflow files scanned: \`${report.workflowCount}\``);
  lines.push(`- Total scheduled expressions: \`${report.totalSchedules}\``);
  lines.push(`- Exact collisions: \`${report.exactCollisions.length}\``);
  lines.push(`- Dense minute-hour windows: \`${report.denseWindows.length}\``);
  lines.push('');

  if (report.exactCollisions.length) {
    lines.push('## Exact cron collisions');
    lines.push('');
    for (const item of report.exactCollisions) {
      lines.push(`- \`${item.cron}\` used by ${item.occurrences.length} workflows`);
      for (const occ of item.occurrences) {
        lines.push(`  - ${occ.workflow}`);
      }
    }
    lines.push('');
  }

  if (report.denseWindows.length) {
    lines.push('## Dense minute-hour windows');
    lines.push('');
    for (const item of report.denseWindows) {
      lines.push(`- \`${item.window}\` has ${item.occurrences.length} schedules`);
      for (const occ of item.occurrences.slice(0, 8)) {
        lines.push(`  - ${occ.workflow} -> ${occ.cron}`);
      }
      if (item.occurrences.length > 8) {
        lines.push(`  - ... ${item.occurrences.length - 8} more`);
      }
    }
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const files = listWorkflowFiles();
  const entries = [];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const workflow = path.basename(file);
    const crons = parseCrons(source);
    for (const cron of crons) {
      entries.push({ workflow, cron, minuteHour: minuteHourKey(cron) });
    }
  }

  const byCron = new Map();
  const byWindow = new Map();
  for (const entry of entries) {
    if (!byCron.has(entry.cron)) byCron.set(entry.cron, []);
    byCron.get(entry.cron).push(entry);
    if (!entry.minuteHour) continue;
    if (!byWindow.has(entry.minuteHour)) byWindow.set(entry.minuteHour, []);
    byWindow.get(entry.minuteHour).push(entry);
  }

  const exactCollisions = [...byCron.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([cron, occurrences]) => ({ cron, occurrences }))
    .sort((a, b) => b.occurrences.length - a.occurrences.length);

  const denseWindows = [...byWindow.entries()]
    .filter(([, occurrences]) => occurrences.length >= DENSITY_THRESHOLD)
    .map(([window, occurrences]) => ({ window, occurrences }))
    .sort((a, b) => b.occurrences.length - a.occurrences.length);

  const report = {
    generatedAt: new Date().toISOString(),
    workflowCount: files.length,
    totalSchedules: entries.length,
    densityThreshold: DENSITY_THRESHOLD,
    exactCollisions,
    denseWindows,
    recommendation:
      exactCollisions.length || denseWindows.length
        ? 'Stagger minute fields and spread heavy workflows across different hour windows.'
        : 'Cron distribution looks healthy; no immediate staggering required.',
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));
  fs.writeFileSync(MD_REPORT, toMd(report));

  console.log(`Cron collision report generated: ${JSON_REPORT}`);
  console.log(`Exact collisions: ${exactCollisions.length}`);
  console.log(`Dense windows: ${denseWindows.length}`);
}

main();
