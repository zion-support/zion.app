#!/usr/bin/env node
/**
 * Validates GitHub Actions workflows that call gh-issue-dedupe-or-create.cjs:
 * - Each step containing the dedupe script must set ISSUE_TITLE and ISSUE_FINGERPRINT
 *   (export ...= or YAML env key).
 * - ISSUE_FINGERPRINT strings must be unique repo-wide (one thread per guard).
 *
 * Exit 1 on violation. Used by automation:preflight.
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const wfDir = path.join(root, '.github', 'workflows');
const DEDUPE = 'gh-issue-dedupe-or-create.cjs';

function listWorkflowFiles() {
  if (!fs.existsSync(wfDir)) return [];
  return fs
    .readdirSync(wfDir)
    .filter((n) => n.endsWith('.yml') || n.endsWith('.yaml'))
    .map((n) => path.join(wfDir, n));
}

/** Split workflow text into step-sized chunks (best-effort: lines starting with "  - name:" under steps). */
function stepChunks(content) {
  const parts = content.split(/\n(?=\s+-\s+name:\s)/);
  return parts;
}

function chunkHasDedupe(chunk) {
  return chunk.includes(DEDUPE);
}

function chunkHasIssueTitle(chunk) {
  return /\bISSUE_TITLE\s*[=:]/.test(chunk) || /export\s+ISSUE_TITLE=/.test(chunk);
}

function chunkHasFingerprint(chunk) {
  return /\bISSUE_FINGERPRINT\s*[=:]/.test(chunk) || /export\s+ISSUE_FINGERPRINT=/.test(chunk);
}

/** Last export ISSUE_FINGERPRINT= in a shell segment (escalation fingerprint is typically the final export before `node ... dedupe`). */
function lastExportedFingerprint(segment) {
  const re = /export\s+ISSUE_FINGERPRINT="([^"]+)"/g;
  let last = null;
  let m;
  while ((m = re.exec(segment)) !== null) {
    last = m[1];
  }
  return last;
}

function validateFile(filePath) {
  const rel = path.relative(root, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const chunks = stepChunks(content);

  let stepIndex = 0;
  for (const chunk of chunks) {
    if (!chunkHasDedupe(chunk)) continue;

    const nameMatch = chunk.match(/-\s+name:\s*(.+)/);
    const stepName = nameMatch ? nameMatch[1].trim() : `(step ${stepIndex})`;

    if (!chunkHasIssueTitle(chunk)) {
      errors.push(`${rel}: step "${stepName}" uses ${DEDUPE} but ISSUE_TITLE is not set in the same step block.`);
    }
    if (!chunkHasFingerprint(chunk)) {
      errors.push(`${rel}: step "${stepName}" uses ${DEDUPE} but ISSUE_FINGERPRINT is not set in the same step block.`);
    }
    stepIndex++;
  }

  return errors;
}

function main() {
  const files = listWorkflowFiles();
  const allErrors = [];
  /** @type {Map<string, string[]>} */
  const fpToFiles = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes(DEDUPE)) continue;

    allErrors.push(...validateFile(file));

    const rel = path.relative(root, file);
    const marker = 'node scripts/automation/gh-issue-dedupe-or-create.cjs';
    const chunks = stepChunks(content);
    for (const chunk of chunks) {
      if (!chunkHasDedupe(chunk)) continue;
      let start = 0;
      let idx = 0;
      while ((idx = chunk.indexOf(marker, start)) !== -1) {
        const segment = chunk.slice(start, idx);
        const fp = lastExportedFingerprint(segment);
        if (!fp) {
          allErrors.push(
            `${rel}: escalation step has ${marker} but no export ISSUE_FINGERPRINT="..." before this invocation.`
          );
        } else {
          if (!fpToFiles.has(fp)) fpToFiles.set(fp, []);
          fpToFiles.get(fp).push(rel);
        }
        start = idx + marker.length;
      }
    }
  }

  for (const [fp, locations] of fpToFiles) {
    const uniqueFiles = [...new Set(locations)];
    if (uniqueFiles.length > 1) {
      allErrors.push(
        `Duplicate ISSUE_FINGERPRINT "${fp}" across workflows:\n  - ${uniqueFiles.join('\n  - ')}`
      );
    }
  }

  if (allErrors.length > 0) {
    console.error('Workflow issue-dedupe contract validation failed:\n');
    for (const e of allErrors) {
      console.error(` - ${e}\n`);
    }
    process.exit(1);
  }

  console.log('Workflow issue-dedupe contract: OK.');
  process.exit(0);
}

main();
