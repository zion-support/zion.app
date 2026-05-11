#!/usr/bin/env node

/**
 * AI Changelog Generator Agent
 *
 * Auto-generates CHANGELOG.md from git commits (conventional commits).
 * Parses commits since last tag or last N days, groups by type (feat, fix, chore, etc.).
 *
 * Environment:
 *   CHANGELOG_DAYS - Number of days to look back (default: 30)
 *   CHANGELOG_OUTPUT - Output path (default: CHANGELOG.md)
 *   AUTO_COMMIT - If 1, commits the changelog
 *
 * Runs: Weekly via cron | Before releases
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'changelog-generator-latest.json');

const DAYS = parseInt(process.env.CHANGELOG_DAYS || '30', 10);
const AUTO_COMMIT = process.env.AUTO_COMMIT === '1';

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[ChangelogGen] ${ts} | ${msg}`);
}

function getCommits(days) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const iso = since.toISOString().slice(0, 10);
  try {
    const out = execSync(
      `git log --since="${iso}" --pretty=format:"%h|%s|%ad" --date=short`,
      { cwd: ROOT, encoding: 'utf8' }
    );
    return out.trim().split('\n').filter(Boolean).map((line) => {
      const [hash, subject, date] = line.split('|');
      return { hash, subject, date };
    });
  } catch {
    return [];
  }
}

function parseConventional(subject) {
  const m = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  if (m) return { type: m[1].toLowerCase(), scope: m[2] || '', message: m[3] };
  return { type: 'other', scope: '', message: subject };
}

function groupByType(commits) {
  const groups = {};
  const order = ['feat', 'fix', 'docs', 'chore', 'refactor', 'perf', 'test', 'ci', 'build', 'style', 'other'];
  for (const c of commits) {
    const { type, scope, message } = parseConventional(c.subject);
    const key = order.includes(type) ? type : 'other';
    if (!groups[key]) groups[key] = [];
    groups[key].push({ scope, message, hash: c.hash, date: c.date });
  }
  return groups;
}

function generateMarkdown(groups, since) {
  const lines = [
    '# Changelog',
    '',
    `## [Unreleased] - ${since} to present`,
    '',
  ];
  const labels = {
    feat: '### Added',
    fix: '### Fixed',
    docs: '### Documentation',
    chore: '### Chore',
    refactor: '### Refactored',
    perf: '### Performance',
    test: '### Tests',
    ci: '### CI/CD',
    build: '### Build',
    style: '### Style',
    other: '### Other',
  };
  for (const type of Object.keys(labels)) {
    const items = groups[type];
    if (!items || items.length === 0) continue;
    lines.push(labels[type]);
    for (const item of items) {
      const scope = item.scope ? ` (${item.scope})` : '';
      lines.push(`- ${item.message}${scope}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function run() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const commits = getCommits(DAYS);
  const groups = groupByType(commits);
  const since = new Date();
  since.setDate(since.getDate() - DAYS);
  const sinceStr = since.toISOString().slice(0, 10);

  const markdown = generateMarkdown(groups, sinceStr);
  const existing = fs.existsSync(CHANGELOG_PATH) ? fs.readFileSync(CHANGELOG_PATH, 'utf8') : '';

  const report = {
    timestamp: new Date().toISOString(),
    commitsProcessed: commits.length,
    days: DAYS,
    groups: Object.keys(groups).reduce((acc, k) => {
      acc[k] = groups[k].length;
      return acc;
    }, {}),
  };

  if (markdown.trim().length > 50 && commits.length > 0) {
    let updated;
    if (existing && existing.includes('## [Unreleased]')) {
      const nextH2 = existing.indexOf('\n## ', existing.indexOf('## [Unreleased]') + 1);
      const end = nextH2 >= 0 ? nextH2 : existing.length;
      const before = existing.slice(0, existing.indexOf('## [Unreleased]'));
      const after = existing.slice(end);
      updated = (before || '# Changelog\n\n') + markdown.trim() + (after ? '\n\n' + after.trim() : '');
    } else {
      updated = markdown + (existing ? '\n\n' + existing : '');
    }
    fs.writeFileSync(CHANGELOG_PATH, updated);
    log(`Updated ${CHANGELOG_PATH}`);
    report.updated = true;

    if (AUTO_COMMIT) {
      try {
        execSync('git add CHANGELOG.md', { cwd: ROOT });
        execSync('git diff --staged --quiet || git commit -m "chore: update changelog from commits"', { cwd: ROOT });
        log('Committed changelog');
      } catch (e) {
        log(`Auto-commit failed: ${e.message}`);
      }
    }
  } else {
    report.updated = false;
    report.reason = commits.length === 0 ? 'No commits in range' : 'No new content';
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`Processed ${commits.length} commits. Report: ${REPORT_FILE}`);
  return report;
}

const cmd = process.argv[2] || 'run';
if (cmd === 'run') {
  run();
} else if (cmd === 'summary') {
  if (!fs.existsSync(REPORT_FILE)) {
    console.log(JSON.stringify({ updated: false, reason: 'No report yet' }, null, 2));
  } else {
    const r = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(r, null, 2));
  }
} else {
  console.log('Usage: node ai-changelog-generator-agent.cjs [run|summary]');
  process.exit(1);
}
