#!/usr/bin/env node
/**
 * auto-reviewer-assigner.cjs – Automatically assigns reviewers to PRs based on CODEOWNERS.
 *
 * This script:
 *   1. Lists open PRs without reviewers.
 *   2. Determines appropriate reviewers from CODEOWNERS (or fallback team).
 *   3. Requests reviews via the GitHub API.
 *
 * Environment variables:
 *   GITHUB_TOKEN – GitHub token with repo scope
 *   REPO_OWNER
 *   REPO_NAME
 *   FALLBACK_REVIEWERS – comma-separated GitHub usernames to use if CODEOWNERS not found
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, FALLBACK_REVIEWERS = '' } = process.env;
if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const fallback = FALLBACK_REVIEWERS.split(',').filter(Boolean);

async function getCodeowners() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'CODEOWNERS',
    });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const lines = content.split('\n').filter(l => l && !l.startsWith('#'));
    const owners = {};
    for (const line of lines) {
      const [pattern, ...users] = line.trim().split(/\s+/);
      owners[pattern] = users.map(u => u.replace(/^@/, ''));
    }
    return owners;
  } catch (err) {
    console.warn('⚠️ Could not read CODEOWNERS, using fallback reviewers');
    return {};
  }
}

function matchPath(pattern, path) {
  // Very simple glob: * matches any chars, ** matches any path segment
  const regex = new RegExp('^' + pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*') + '$');
  return regex.test(path);
}

async function assignReviewers() {
  const owners = await getCodeowners();
  const { data: prs } = await octokit.pulls.list({ owner: REPO_OWNER, repo: REPO_NAME, state: 'open' });
  for (const pr of prs) {
    const { data: reviews } = await octokit.pulls.listReviews({ owner: REPO_OWNER, repo: REPO_NAME, pull_number: pr.number });
    const existingReviewers = new Set(reviews.map(r => r.user.login));
    if (existingReviewers.size > 0) continue; // already has reviewers
    // Fetch changed files to match CODEOWNERS
    const { data: files } = await octokit.pulls.listFiles({ owner: REPO_OWNER, repo: REPO_NAME, pull_number: pr.number });
    const candidateOwners = new Set();
    for (const file of files) {
      for (const pattern in owners) {
        if (matchPath(pattern, file.filename)) {
          owners[pattern].forEach(u => candidateOwners.add(u));
        }
      }
    }
    const reviewers = candidateOwners.size ? Array.from(candidateOwners) : fallback;
    if (reviewers.length === 0) continue; // nothing to assign
    console.log(`🛠️ Assigning reviewers to PR #${pr.number}: ${reviewers.join(', ')}`);
    await octokit.pulls.requestReviewers({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pr.number,
      reviewers,
    });
  }
}

assignReviewers().catch(err => {
  console.error('🚨 Error:', err.message);
  process.exit(1);
});
