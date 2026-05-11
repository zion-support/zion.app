#!/usr/bin/env node
/**
 * Runtime Fix-Agent Factory
 * Creates a compact execution plan from runtime guardian queue.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const QUEUE = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-queue.json');
const PLAN_JSON = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-plan-latest.json');
const PLAN_MD = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-plan-latest.md');

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const queue = readJson(QUEUE, { items: [] });
  const items = Array.isArray(queue.items) ? queue.items : [];
  const critical = items.filter((i) => i.severity === 'critical');
  const warning = items.filter((i) => i.severity === 'warning');

  const payload = {
    generatedAt: new Date().toISOString(),
    total: items.length,
    critical: critical.length,
    warning: warning.length,
    items,
  };
  writeJson(PLAN_JSON, payload);

  const lines = [
    '# Autonomous runtime fix-agent plan',
    '',
    `Generated: ${payload.generatedAt}`,
    `Total: ${payload.total} | Critical: ${payload.critical} | Warning: ${payload.warning}`,
    '',
    '## Actions',
    '',
  ];
  if (!items.length) {
    lines.push('- No runtime fix actions queued.');
  } else {
    for (const i of items) {
      lines.push(`- [${i.severity}] ${i.title} — ${i.targetFile} — \`${i.suggestedCommand}\``);
    }
  }
  lines.push('');
  fs.writeFileSync(PLAN_MD, lines.join('\n'), 'utf8');
  console.log(`autonomous-runtime-fix-agent-factory: queued=${items.length}`);
}

main();
