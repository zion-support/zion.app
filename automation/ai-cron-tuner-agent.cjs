#!/usr/bin/env node

/**
 * AI Cron Tuner Agent
 *
 * Lightweight, heuristic analyzer for GitHub Actions cron schedules.
 * - Scans .github/workflows for schedule.cron entries
 * - Detects "hot spots" where many jobs fire at the same minute
 * - Suggests alternative minutes to spread load
 *
 * Output:
 * - automation/reports/cron-tuner-latest.json
 *
 * This agent is intentionally conservative and read-only: it proposes
 * schedule tweaks but does not modify workflow files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'cron-tuner-latest.json');

function log(message) {
  const ts = new Date().toISOString();
  console.log(`[CronTuner] ${ts} | ${message}`);
}

function parseCronExpression(expr) {
  // Very small parser that only cares about "minute hour" positions.
  // Example: "0 6 * * *" => { minute: 0, hour: 6 }
  const parts = (expr || '').trim().split(/\s+/);
  if (parts.length < 2) {
    return null;
  }

  const minuteRaw = parts[0];
  const hourRaw = parts[1];

  const minute = minuteRaw === '*' ? '*' : Number(minuteRaw);
  const hour = hourRaw === '*' ? '*' : Number(hourRaw);

  if (
    minute !== '*' &&
    (Number.isNaN(minute) || minute < 0 || minute > 59)
  ) {
    return null;
  }
  if (
    hour !== '*' &&
    (Number.isNaN(hour) || hour < 0 || hour > 23)
  ) {
    return null;
  }

  return { minute, hour, raw: expr };
}

function collectSchedules() {
  const entries = [];

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    return entries;
  }

  const files = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'));

  for (const file of files) {
    const fullPath = path.join(WORKFLOWS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/cron:\s*['"]([^'"]+)['"]/);
      if (!match) continue;

      const expr = match[1];
      const parsed = parseCronExpression(expr);
      entries.push({
        file,
        cron: expr,
        parsed,
        line: i + 1,
      });
    }
  }

  return entries;
}

function buildHotspots(entries) {
  const buckets = new Map();

  for (const entry of entries) {
    if (!entry.parsed) continue;
    const { minute, hour } = entry.parsed;

    // We only care about fixed minutes; "*" or "*/5" etc are ignored for now.
    if (minute === '*' || typeof minute !== 'number') continue;

    const key = `${minute}`;
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(entry);
  }

  const hotspots = [];
  const THRESHOLD = 4; // more than 4 jobs on the same minute is considered crowded

  for (const [minuteKey, list] of buckets.entries()) {
    if (list.length <= THRESHOLD) continue;

    hotspots.push({
      minute: Number(minuteKey),
      jobCount: list.length,
      jobs: list.map((e) => ({
        file: e.file,
        cron: e.cron,
        line: e.line,
      })),
    });
  }

  hotspots.sort((a, b) => b.jobCount - a.jobCount || a.minute - b.minute);
  return hotspots;
}

function proposeSpread(hotspots) {
  // Simple proposal: suggest alternative minutes for jobs in each hot bucket.
  // We keep the first few as-is and stagger the rest by +5, +10, +15, etc.
  const suggestions = [];

  for (const hotspot of hotspots) {
    const { minute, jobCount, jobs } = hotspot;
    const baseMinute = minute;

    const spreadMinutes = [0, 5, 10, 15, 20, 25, 30].map(
      (delta) => (baseMinute + delta) % 60,
    );

    jobs.forEach((job, index) => {
      const targetMinute = spreadMinutes[index % spreadMinutes.length];
      if (targetMinute === baseMinute) {
        // keep as-is for first N
        return;
      }

      suggestions.push({
        file: job.file,
        originalCron: job.cron,
        suggestedMinute: targetMinute,
        note:
          'Consider shifting this workflow to a less crowded minute to reduce contention with other scheduled jobs.',
      });
    });
  }

  return suggestions;
}

function run() {
  log('=== Cron Tuner Started ===');
  const entries = collectSchedules();

  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const hotspots = buildHotspots(entries);
  const suggestions = proposeSpread(hotspots);

  const report = {
    timestamp: new Date().toISOString(),
    totalWorkflowsWithCron: entries.length,
    hotspots,
    suggestions,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(
    `Analyzed ${entries.length} cron entries. Hotspots: ${hotspots.length}. Suggestions: ${suggestions.length}.`,
  );
  log(`Report written to ${REPORT_FILE}`);
  log('=== Cron Tuner Finished ===');

  return report;
}

function summary() {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log(
      JSON.stringify(
        {
          status: 'no_report',
          message: 'Run cron:tuner first to generate a report.',
        },
        null,
        2,
      ),
    );
    return;
  }

  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  const { totalWorkflowsWithCron, hotspots = [], suggestions = [] } = report;

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        totalWorkflowsWithCron,
        hotspotCount: hotspots.length,
        suggestionCount: suggestions.length,
        busiestMinutes: hotspots.map((h) => ({
          minute: h.minute,
          jobCount: h.jobCount,
        })),
      },
      null,
      2,
    ),
  );
}

const cmd = process.argv[2] || 'run';

if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  summary();
} else {
  console.log('Usage: node ai-cron-tuner-agent.cjs [run|summary]');
  process.exit(1);
}

