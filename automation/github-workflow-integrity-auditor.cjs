#!/usr/bin/env node
/* eslint-disable no-console */
/** Exits 1 when status is not healthy unless --no-fail or WORKFLOW_INTEGRITY_AUDIT_NO_FAIL=1 (for scheduled report+escalation jobs). */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORT = path.join(ROOT, 'automation', 'reports', 'github-workflow-integrity-audit-latest.json');

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
function listWorkflowFiles() {
  try {
    return fs
      .readdirSync(WORKFLOWS_DIR)
      .filter((f) => /\.(ya?ml)$/i.test(f))
      .map((f) => path.join(WORKFLOWS_DIR, f))
      .sort();
  } catch {
    return [];
  }
}
function normalizeWorkflowText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim();
}
function sha12(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);
}

function main() {
  const noFail =
    process.argv.includes('--no-fail') || process.env.WORKFLOW_INTEGRITY_AUDIT_NO_FAIL === '1';

  const files = listWorkflowFiles();
  const entries = files.map((abs) => {
    const rel = path.relative(ROOT, abs);
    const text = read(abs);
    const normalized = normalizeWorkflowText(text);
    const nameMatches = [...normalized.matchAll(/^name:\s*(.+)$/gm)];
    const workflowName = nameMatches.length ? String(nameMatches[0][1]).trim() : path.basename(abs);
    return {
      file: rel,
      workflowName,
      digest: sha12(normalized),
      nameCount: nameMatches.length,
      duplicateNameHeaders: nameMatches.length > 1,
      lines: normalized.split('\n').length,
    };
  });

  const byName = {};
  const byDigest = {};
  for (const e of entries) {
    byName[e.workflowName] = byName[e.workflowName] || [];
    byName[e.workflowName].push(e.file);
    byDigest[e.digest] = byDigest[e.digest] || [];
    byDigest[e.digest].push(e.file);
  }

  const duplicateNames = Object.entries(byName)
    .filter(([, filesForName]) => filesForName.length > 1)
    .map(([name, filesForName]) => ({ name, files: filesForName }));

  const duplicateBodies = Object.entries(byDigest)
    .filter(([, filesForDigest]) => filesForDigest.length > 1)
    .map(([digest, filesForDigest]) => ({ digest, files: filesForDigest }));

  const malformed = entries
    .filter((e) => e.duplicateNameHeaders)
    .map((e) => ({
      file: e.file,
      issue: 'multiple-name-headers',
      detail: `File contains ${e.nameCount} top-level name headers (likely duplicated block merge).`,
    }));

  const findings = [
    ...duplicateNames.map((d) => ({
      type: 'duplicate-workflow-name',
      severity: 'warning',
      name: d.name,
      files: d.files,
    })),
    ...duplicateBodies.map((d) => ({
      type: 'duplicate-workflow-body',
      severity: 'warning',
      digest: d.digest,
      files: d.files,
    })),
    ...malformed.map((m) => ({
      type: m.issue,
      severity: 'critical',
      file: m.file,
      detail: m.detail,
    })),
  ];

  const critical = findings.filter((f) => f.severity === 'critical').length;
  const warning = findings.filter((f) => f.severity === 'warning').length;
  const status = critical > 0 ? 'critical' : warning > 0 ? 'warning' : 'healthy';

  const payload = {
    generatedAt: new Date().toISOString(),
    workflowCount: entries.length,
    status,
    counts: { critical, warning, totalFindings: findings.length },
    findings,
    sample: entries.slice(0, 40),
  };
  writeJson(REPORT, payload);
  console.log('github-workflow-integrity-auditor:', JSON.stringify({ status, findings: findings.length }));

  if (status !== 'healthy' && !noFail) {
    process.exit(1);
  }
}

main();
