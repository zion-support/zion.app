#!/usr/bin/env node

/**
 * Weekly GitHub Action pinning audit.
 *
 * This script reports workflow actions that are not SHA-pinned.
 * Set PIN_ACTIONS_STRICT=true to fail when unpinned actions are found.
 */

const fs = require('fs');
const path = require('path');

const WORKFLOWS_DIR = path.join(process.cwd(), '.github', 'workflows');
const REPORTS_DIR = path.join(process.cwd(), 'automation', 'reports');
const REPORT_PATH = path.join(REPORTS_DIR, 'pin-actions-weekly-report.json');

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function getWorkflowFiles() {
  if (!fs.existsSync(WORKFLOWS_DIR)) return [];

  return fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .map((name) => path.join(WORKFLOWS_DIR, name));
}

function parseUsesReferences(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const results = [];
  const usesPattern = /^\s*uses:\s*([^\s#]+)\s*(?:#.*)?$/;

  lines.forEach((line, index) => {
    const match = line.match(usesPattern);
    if (!match) return;

    const reference = match[1];
    if (reference.startsWith('./')) return; // local action

    const [action, ref] = reference.split('@');
    const isShaPinned = /^[a-f0-9]{40}$/i.test(ref || '');

    results.push({
      file: path.relative(process.cwd(), filePath),
      line: index + 1,
      reference,
      action,
      ref: ref || null,
      isShaPinned
    });
  });

  return results;
}

function main() {
  ensureReportsDir();

  const workflows = getWorkflowFiles();
  const references = workflows.flatMap(parseUsesReferences);
  const unpinned = references.filter((item) => !item.isShaPinned);

  const report = {
    generatedAt: new Date().toISOString(),
    workflowCount: workflows.length,
    totalExternalActions: references.length,
    pinnedActions: references.length - unpinned.length,
    unpinnedActions: unpinned.length,
    strictMode: process.env.PIN_ACTIONS_STRICT === 'true',
    findings: {
      unpinned
    }
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`Analyzed ${workflows.length} workflow files.`);
  console.log(`External actions: ${references.length}`);
  console.log(`SHA-pinned: ${report.pinnedActions}`);
  console.log(`Unpinned: ${report.unpinnedActions}`);
  console.log(`Report: ${path.relative(process.cwd(), REPORT_PATH)}`);

  if (report.strictMode && unpinned.length > 0) {
    console.error('Strict mode enabled and unpinned actions were found.');
    process.exit(1);
  }
}

main();
