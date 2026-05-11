#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const JSON_REPORT = path.join(REPORTS_DIR, 'ai-launch-digest-latest.json');
const MD_REPORT = path.join(REPORTS_DIR, 'ai-launch-digest-latest.md');

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function main() {
  const commitsRaw = run('git log --since=\"14 days ago\" --pretty=format:\"%h|%s\" -- app/ai-lab app/page.tsx app/config/aiCatalog.ts');
  const commits = commitsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sha, subject] = line.split('|');
      return { sha, subject };
    });

  const weeklyHighlights = commits.slice(0, 8).map((item) => item.subject);

  const report = {
    generatedAt: new Date().toISOString(),
    windowDays: 14,
    totalLaunchCommits: commits.length,
    weeklyHighlights,
    commits,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify(report, null, 2));

  const lines = [
    '# AI Launch Digest',
    '',
    `- Generated at: \`${report.generatedAt}\``,
    `- Window: last ${report.windowDays} days`,
    `- Launch commits: ${report.totalLaunchCommits}`,
    '',
    '## Weekly highlights',
    '',
    ...weeklyHighlights.map((item) => `- ${item}`),
    '',
    '## Recent launch-related commits',
    '',
    ...commits.map((c) => `- \`${c.sha}\` ${c.subject}`),
    '',
  ];
  fs.writeFileSync(MD_REPORT, lines.join('\n'));

  console.log(`AI launch digest generated: ${JSON_REPORT}`);
}

main();

