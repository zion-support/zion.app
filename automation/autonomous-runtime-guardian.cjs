#!/usr/bin/env node
/**
 * Autonomous Runtime Guardian (cloud-safe, additive)
 * - Verifies PM2 and git-hook runtime contracts from repo files.
 * - Emits findings and a fix-agent queue for follow-up workers.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const OUT = path.join(REPORT_DIR, 'autonomous-runtime-guardian-latest.json');
const QUEUE = path.join(REPORT_DIR, 'autonomous-runtime-fix-agent-queue.json');
const HISTORY = path.join(REPORT_DIR, 'autonomous-runtime-guardian-history.json');
const WARN_ISSUE_STATE = path.join(REPORT_DIR, 'autonomous-runtime-guardian-warning-state.json');
const HISTORY_LIMIT = Number(process.env.RUNTIME_GUARDIAN_HISTORY_LIMIT || 1440);
const WARN_ESCALATE_STREAK = Number(process.env.RUNTIME_GUARDIAN_WARN_ESCALATE_STREAK || 6);

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

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

function makeId(x) {
  return crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
}

function auditPackageScripts(findings) {
  const pkg = read(path.join(ROOT, 'package.json'));
  const requiredScripts = ['git:hooks:install', 'validate:pm2-singleton-ecosystem', 'pm2:restart-guardian'];
  for (const scriptName of requiredScripts) {
    if (!new RegExp(`"${scriptName}"\\s*:`).test(pkg)) {
      findings.push({
        type: 'missing-required-script',
        severity: 'critical',
        file: 'package.json',
        detail: `Missing npm script: ${scriptName}`,
      });
    }
  }
}

function auditGitHooks(findings) {
  const hookDir = path.join(ROOT, 'scripts', 'git-hooks');
  const required = ['pre-commit', 'pre-push'];
  for (const f of required) {
    const p = path.join(hookDir, f);
    if (!fs.existsSync(p)) {
      findings.push({
        type: 'missing-git-hook',
        severity: 'critical',
        file: path.relative(ROOT, p),
        detail: `Required git hook missing: ${f}`,
      });
    }
  }
}

function auditPm2Config(findings) {
  const ecoPath = path.join(ROOT, 'ecosystem.config.cjs');
  const eco = read(ecoPath);
  if (!eco) {
    findings.push({
      type: 'missing-pm2-ecosystem',
      severity: 'critical',
      file: 'ecosystem.config.cjs',
      detail: 'PM2 ecosystem config missing',
    });
    return;
  }
  const names = Array.from(eco.matchAll(/name:\s*['"`]([^'"`]+)['"`]/g)).map((m) => m[1]);
  if (!names.includes('ai-pm2-restart-guardian')) {
    findings.push({
      type: 'missing-pm2-restart-guardian-process',
      severity: 'warning',
      file: 'ecosystem.config.cjs',
      detail: 'No ai-pm2-restart-guardian process entry found',
    });
  }
  const countByName = new Map();
  for (const n of names) countByName.set(n, (countByName.get(n) || 0) + 1);
  for (const [n, c] of countByName.entries()) {
    if (c > 1) {
      findings.push({
        type: 'duplicate-pm2-name',
        severity: 'critical',
        file: 'ecosystem.config.cjs',
        detail: `Duplicate PM2 process name "${n}" appears ${c} times`,
      });
    }
  }
}

function auditContactRouting(findings) {
  const seo = read(path.join(ROOT, 'app', 'utils', 'seoConstants.ts'));
  if (!seo.includes("email: 'commercial@ziontechgroup.com'")) {
    findings.push({
      type: 'contact-routing-mismatch',
      severity: 'critical',
      file: 'app/utils/seoConstants.ts',
      detail: 'commercial contact routing missing from CONTACT_INFO.email',
    });
  }
}

function queueFromFindings(findings) {
  return findings.map((f) => ({
    id: makeId({ type: f.type, file: f.file, detail: f.detail }),
    createdAt: new Date().toISOString(),
    status: 'queued',
    severity: f.severity,
    title: `Resolve ${f.type}`,
    targetFile: f.file,
    detail: f.detail,
    suggestedCommand:
      f.type.includes('pm2')
        ? 'npm run validate:pm2-singleton-ecosystem'
        : f.type.includes('hook')
          ? 'npm run git:hooks:install'
          : 'npm run type-check',
  }));
}

function main() {
  const findings = [];
  auditPackageScripts(findings);
  auditGitHooks(findings);
  auditPm2Config(findings);
  auditContactRouting(findings);

  const critical = findings.filter((f) => f.severity === 'critical').length;
  const warning = findings.filter((f) => f.severity === 'warning').length;
  const score = Math.max(0, 100 - critical * 35 - warning * 10);
  const status = critical > 0 ? 'critical' : warning > 0 ? 'warning' : 'nominal';
  const queue = queueFromFindings(findings);
  const nowIso = new Date().toISOString();

  const history = readJson(HISTORY, { points: [] });
  const points = Array.isArray(history.points) ? history.points : [];
  points.push({
    at: nowIso,
    status,
    score,
    critical,
    warning,
    findings: findings.length,
  });
  const trimmed = points.slice(-Math.max(12, HISTORY_LIMIT));
  writeJson(HISTORY, { generatedAt: nowIso, points: trimmed });

  const warningStreak = (() => {
    let streak = 0;
    for (let i = trimmed.length - 1; i >= 0; i -= 1) {
      if (trimmed[i].status === 'warning') streak += 1;
      else break;
    }
    return streak;
  })();

  const warnState = readJson(WARN_ISSUE_STATE, { warningIssueOpen: false, lastEscalatedAt: null });
  const shouldEscalateWarning = warningStreak >= WARN_ESCALATE_STREAK && !warnState.warningIssueOpen;
  const shouldCloseWarning = warningStreak === 0 && Boolean(warnState.warningIssueOpen);

  if (shouldEscalateWarning) {
    writeJson(WARN_ISSUE_STATE, {
      updatedAt: nowIso,
      warningIssueOpen: true,
      lastEscalatedAt: nowIso,
      lastClosedAt: warnState.lastClosedAt || null,
      warningStreak,
    });
  } else if (shouldCloseWarning) {
    writeJson(WARN_ISSUE_STATE, {
      updatedAt: nowIso,
      warningIssueOpen: false,
      lastEscalatedAt: warnState.lastEscalatedAt || null,
      lastClosedAt: nowIso,
      warningStreak,
    });
  } else {
    writeJson(WARN_ISSUE_STATE, {
      updatedAt: nowIso,
      warningIssueOpen: Boolean(warnState.warningIssueOpen),
      lastEscalatedAt: warnState.lastEscalatedAt || null,
      lastClosedAt: warnState.lastClosedAt || null,
      warningStreak,
    });
  }

  const report = {
    generatedAt: nowIso,
    score,
    status,
    counts: { total: findings.length, critical, warning },
    findings,
    queueSize: queue.length,
    warningStreak,
    warningEscalation: {
      requiredStreak: WARN_ESCALATE_STREAK,
      shouldEscalateWarning,
      shouldCloseWarning,
      warningIssueOpen: shouldEscalateWarning ? true : shouldCloseWarning ? false : Boolean(warnState.warningIssueOpen),
    },
  };
  writeJson(OUT, report);
  writeJson(QUEUE, { generatedAt: new Date().toISOString(), items: queue });

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `runtime_status=${status}\n`, 'utf8');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `runtime_score=${score}\n`, 'utf8');
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_warning_escalate=${shouldEscalateWarning ? 'true' : 'false'}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_warning_close=${shouldCloseWarning ? 'true' : 'false'}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_warning_streak=${warningStreak}\n`,
      'utf8',
    );
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `runtime_report=${path.relative(ROOT, OUT)}\n`,
      'utf8',
    );
  }
  console.log(`autonomous-runtime-guardian: status=${status} score=${score} findings=${findings.length}`);
}

main();
