#!/usr/bin/env node
/**
 * Converts queued autonomous fix-agent tasks into a compact markdown execution plan.
 * This is intentionally non-destructive and cloud-safe.
 */
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(process.cwd(), 'automation', 'reports');
const QUEUE = path.join(REPORT_DIR, 'autonomous-fix-agent-queue.json');
const PLAN_MD = path.join(REPORT_DIR, 'autonomous-fix-agent-plan-latest.md');
const PLAN_JSON = path.join(REPORT_DIR, 'autonomous-fix-agent-plan-latest.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function main() {
  const queue = readJson(QUEUE);
  const items = Array.isArray(queue?.items) ? queue.items : [];
  const queued = items.filter((x) => x.status === 'queued').slice(0, 25);

  const bySeverity = queued.reduce(
    (acc, item) => {
      const key = item.severity === 'critical' ? 'critical' : 'warning';
      acc[key].push(item);
      return acc;
    },
    { critical: [], warning: [] },
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    queuedCount: queued.length,
    criticalCount: bySeverity.critical.length,
    warningCount: bySeverity.warning.length,
    items: queued,
  };
  writeJson(PLAN_JSON, payload);

  const lines = [
    '# Autonomous fix-agent plan',
    '',
    `Generated: ${payload.generatedAt}`,
    `Queued items: ${payload.queuedCount}`,
    `Critical: ${payload.criticalCount} | Warning: ${payload.warningCount}`,
    '',
    '## Planned tasks',
    '',
  ];
  if (!queued.length) {
    lines.push('- No queued tasks. Factory is healthy.');
  } else {
    for (const item of queued) {
      lines.push(
        `- [${item.severity}] ${item.title} — ${item.targetFile || 'repo'} — suggested: \`${item.suggestedCommand}\``,
      );
    }
  }
  lines.push('');
  fs.writeFileSync(PLAN_MD, lines.join('\n'), 'utf8');

  console.log(`autonomous-fix-agent-factory: queued=${queued.length}`);
}

main();
