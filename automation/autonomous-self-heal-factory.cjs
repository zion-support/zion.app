#!/usr/bin/env node
/**
 * Autonomous Self-Heal Factory
 * - Audits workflow hygiene, merge markers, PM2 naming collisions, and contact routing.
 * - Emits machine-readable findings and queues "fix-agent" tasks when needed.
 *
 * This script is intentionally dependency-free for cloud cron reliability.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const WORKFLOWS_DIR = path.join(ROOT, '.github', 'workflows');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const LATEST_REPORT = path.join(REPORT_DIR, 'autonomous-self-heal-factory-latest.json');
const FIX_QUEUE = path.join(REPORT_DIR, 'autonomous-fix-agent-queue.json');

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.next' || e.name === 'out') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function readTextSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function stableId(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function writeQueueItems(items) {
  writeJson(FIX_QUEUE, { generatedAt: new Date().toISOString(), items });
}

function auditWorkflows() {
  const findings = [];
  if (!fs.existsSync(WORKFLOWS_DIR)) return findings;
  const wfFiles = fs.readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  const byName = new Map();
  for (const f of wfFiles) {
    const p = path.join(WORKFLOWS_DIR, f);
    const t = readTextSafe(p) || '';
    const m = t.match(/^name:\s*(.+)$/m);
    const n = m ? m[1].trim() : '(missing-name)';
    const arr = byName.get(n) || [];
    arr.push(f);
    byName.set(n, arr);

    const useLines = t.split('\n').filter((line) => /^\s*uses:\s*.+@.+/.test(line));
    const unpinned = useLines.filter((line) => {
      const mUse = line.match(/uses:\s*([^\s]+)@([^\s#]+)/);
      if (!mUse) return false;
      const ref = mUse[2];
      return !/^[a-f0-9]{40}$/i.test(ref);
    });
    if (unpinned.length) {
      findings.push({
        type: 'workflow-unpinned-actions',
        severity: 'warning',
        file: `.github/workflows/${f}`,
        detail: `Found ${unpinned.length} unpinned uses@refs`,
      });
    }
  }
  for (const [name, files] of byName.entries()) {
    if (files.length > 1) {
      findings.push({
        type: 'workflow-duplicate-name',
        severity: 'warning',
        detail: `Workflow name "${name}" appears in ${files.length} files`,
        files: files.map((f) => `.github/workflows/${f}`),
      });
    }
  }
  return findings;
}

function auditMergeMarkers() {
  const findings = [];
  const files = walk(ROOT).filter((f) => {
    const rel = path.relative(ROOT, f);
    if (rel.startsWith('automation/reports/')) return false;
    return /\.(ts|tsx|js|cjs|mjs|json|md|yml|yaml)$/i.test(rel);
  });
  for (const f of files) {
    const t = readTextSafe(f);
    if (!t) continue;
    // Detect true conflict-marker lines, not string literals that mention markers.
    if (/^\s*<{7} .*$/m.test(t) || /^\s*={7}$/m.test(t) || /^\s*>{7} .*$/m.test(t)) {
      findings.push({
        type: 'merge-conflict-marker',
        severity: 'critical',
        file: path.relative(ROOT, f),
        detail: 'Unresolved merge conflict markers found',
      });
    }
  }
  return findings;
}

function auditPm2DuplicateNames() {
  const findings = [];
  const eco = readTextSafe(path.join(ROOT, 'ecosystem.config.cjs'));
  if (!eco) return findings;
  const names = Array.from(eco.matchAll(/name:\s*['"`]([^'"`]+)['"`]/g)).map((m) => m[1]);
  const counts = new Map();
  for (const n of names) counts.set(n, (counts.get(n) || 0) + 1);
  for (const [name, count] of counts.entries()) {
    if (count > 1) {
      findings.push({
        type: 'pm2-duplicate-process-name',
        severity: 'critical',
        file: 'ecosystem.config.cjs',
        detail: `PM2 process name "${name}" appears ${count} times`,
      });
    }
  }
  return findings;
}

function auditContactRouting() {
  const findings = [];
  const seo = readTextSafe(path.join(ROOT, 'app', 'utils', 'seoConstants.ts')) || '';
  if (!seo.includes("email: 'commercial@ziontechgroup.com'")) {
    findings.push({
      type: 'contact-routing-missing',
      severity: 'critical',
      file: 'app/utils/seoConstants.ts',
      detail: 'CONTACT_INFO.email is not commercial@ziontechgroup.com',
    });
  }
  return findings;
}

function auditRobotsMeta() {
  const findings = [];
  const seo = readTextSafe(path.join(ROOT, 'app', 'utils', 'seoConstants.ts')) || '';
  const m = seo.match(/ROBOTS:\s*['"`]([^'"`]+)['"`]/);
  if (m && /\b_index\b/.test(m[1])) {
    findings.push({
      type: 'seo-robots-invalid-token',
      severity: 'warning',
      file: 'app/utils/seoConstants.ts',
      detail: `ROBOTS value "${m[1]}" contains invalid "_index" token`,
    });
  }
  return findings;
}

function toFixAgentTasks(findings) {
  return findings.map((f) => ({
    id: stableId({ type: f.type, file: f.file, detail: f.detail }),
    createdAt: new Date().toISOString(),
    status: 'queued',
    title: `Fix ${f.type}`,
    severity: f.severity,
    targetFile: f.file || null,
    rationale: f.detail,
    suggestedCommand:
      f.type === 'workflow-unpinned-actions'
        ? 'npm run pin-actions:strict'
        : f.type === 'merge-conflict-marker'
          ? 'npm run check:merge-conflicts'
          : f.type === 'pm2-duplicate-process-name'
            ? 'npm run validate:pm2-singleton-ecosystem'
            : 'npm run type-check',
  }));
}

function main() {
  const findings = [
    ...auditWorkflows(),
    ...auditMergeMarkers(),
    ...auditPm2DuplicateNames(),
    ...auditContactRouting(),
    ...auditRobotsMeta(),
  ];
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const warning = findings.filter((f) => f.severity === 'warning').length;
  const score = Math.max(0, 100 - critical * 30 - warning * 10);

  const report = {
    generatedAt: new Date().toISOString(),
    score,
    status: critical > 0 ? 'critical' : warning > 0 ? 'warning' : 'nominal',
    counts: { critical, warning, total: findings.length },
    findings,
    queuedFixAgents: toFixAgentTasks(findings),
  };

  writeJson(LATEST_REPORT, report);
  writeQueueItems(report.queuedFixAgents);

  console.log(`autonomous-self-heal-factory: score=${score} findings=${findings.length}`);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `factory_score=${score}\n`, 'utf8');
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `factory_status=${report.status}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `report_path=${path.relative(ROOT, LATEST_REPORT)}\n`,
      'utf8',
    );
  }
}

main();
