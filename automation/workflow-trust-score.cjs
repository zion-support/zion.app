#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'automation', 'reports');
const INTEGRITY = path.join(REPORTS, 'github-workflow-integrity-audit-latest.json');
const OUT = path.join(REPORTS, 'workflow-trust-score-latest.json');

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function main() {
  const audit = readJson(INTEGRITY, null);
  if (!audit) {
    console.log('[workflow-trust-score] missing integrity audit input; skip');
    process.exit(0);
  }
  const c = audit.counts || {};
  const total = Math.max(1, Number(audit.workflowCount || 0));
  const critical = Number(c.critical || 0);
  const warning = Number(c.warning || 0);
  const duplicateBody = (audit.findings || []).filter((f) => f.type === 'duplicate-workflow-body').length;
  const duplicateName = (audit.findings || []).filter((f) => f.type === 'duplicate-workflow-name').length;

  const penalty =
    Math.min(80, critical * 15 + warning * 4) +
    Math.min(20, duplicateBody * 2 + duplicateName * 3) +
    Math.max(0, Math.round((warning / total) * 12));
  const trustScore = Math.max(0, Math.min(100, 100 - penalty));
  const band = trustScore >= 90 ? 'high' : trustScore >= 70 ? 'medium' : trustScore >= 45 ? 'low' : 'critical';

  const payload = {
    generatedAt: new Date().toISOString(),
    trustScore,
    band,
    factors: {
      workflowCount: total,
      criticalFindings: critical,
      warningFindings: warning,
      duplicateBodies: duplicateBody,
      duplicateNames: duplicateName,
    },
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log('[workflow-trust-score]', JSON.stringify({ trustScore, band }));
}

main();
