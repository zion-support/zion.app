#!/usr/bin/env ts-node

/**
 * Revert Last Automation
 *
 * Helper script that identifies the most recent commit on main that was
 * created by an automation workflow (based on commit message heuristics)
 * and prints a suggested git revert command. By default this script does
 * not execute the revert; it only guides a human operator.
 */

import { execSync } from 'child_process';

type Commit = {
  hash: string;
  subject: string;
};

function run(cmd: string): string {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
}

function getAutomationCommits(limit = 20): Commit[] {
  const format = '%H|%s';
  const raw = run(`git log -n ${limit} --pretty=format:${format}`);
  const lines = raw.split('\n');

  const automationPatterns = [
    'feat(automation):',
    'chore(automation):',
    'AI App Improvement',
    'AI Site Improvement Agent',
    'ai-content',
    'ai-app-improvement',
    'ai-app-evolution',
  ];

  const commits: Commit[] = [];

  for (const line of lines) {
    const [hash, subject] = line.split('|');
    if (!hash || !subject) continue;
    const isAutomation = automationPatterns.some((p) => subject.includes(p));
    if (isAutomation) {
      commits.push({ hash, subject });
    }
  }

  return commits;
}

function main() {
  const commits = getAutomationCommits(40);

  if (commits.length === 0) {
    console.log('No recent automation commits found on this branch.');
    return;
  }

  const latest = commits[0];

  console.log('Most recent automation-related commit:');
  console.log(`  ${latest.hash}  ${latest.subject}`);
  console.log('');
  console.log('To revert this commit locally, run:');
  console.log('');
  console.log(`  git revert ${latest.hash}`);
  console.log('');
  console.log(
    'After verifying the revert locally (lint, type-check, tests), push to main or open a PR as appropriate.',
  );
}

main();

