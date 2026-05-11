#!/usr/bin/env node
/**
 * stale-issue-labeler.cjs – Automatically labels and closes stale issues.
 *
 * This script:
 *   1. Fetches open issues older than STALE_DAYS (default 30).
 *   2. Adds the "stale" label and posts a comment.
 *   3. After STALE_CLOSE_DAYS (default 7), closes the issue.
 *
 * Environment variables:
 *   GITHUB_TOKEN   – GitHub token with repo scope
 *   REPO_OWNER
 *   REPO_NAME
 *   STALE_DAYS    – Days before labeling stale (default 30)
 *   STALE_CLOSE_DAYS – Days before closing stale (default 7)
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  STALE_DAYS = '30',
  STALE_CLOSE_DAYS = '7',
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function run() {
  const staleAfter = Date.now() - parseInt(STALE_DAYS, 10) * 24 * 60 * 60 * 1000;
  const closeAfter = Date.now() - parseInt(STALE_CLOSE_DAYS, 10) * 24 * 60 * 60 * 1000;

  const { data: issues } = await octokit.issues.listForRepo({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: 'open',
    per_page: 100,
  });

  for (const issue of issues) {
    const created = new Date(issue.created_at).getTime();
    const hasStaleLabel = issue.labels.some(l => l.name === 'stale');

    if (created < closeAfter && hasStaleLabel) {
      console.log(`🔒 Closing stale issue #${issue.number}: ${issue.title}`);
      await octokit.issues.createComment({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: issue.number,
        body: 'This issue has been automatically closed due to inactivity.',
      });
      await octokit.issues.update({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: issue.number,
        state: 'closed',
      });
    } else if (created < staleAfter && !hasStaleLabel) {
      console.log(`⏰ Labeling stale issue #${issue.number}: ${issue.title}`);
      await octokit.issues.addLabels({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: issue.number,
        labels: ['stale'],
      });
      await octokit.issues.createComment({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: issue.number,
        body: 'This issue has been marked as stale due to inactivity. It will be closed in 7 days if no further activity occurs.',
      });
    }
  }
  console.log('✅ Stale issue labeling complete.');
}

run().catch(err => {
  console.error('🚨 Error:', err.message);
  process.exit(1);
});