#!/usr/bin/env node
/**
 * auto-merge.cjs – Automatically merge pull requests whose status checks have passed.
 * This builds on the current CI flow. It polls open PRs, checks the status of
 * required checks (GitHub _check_suite_), and if all are successful it merges
 * the PR. User must set `MERGE_LABEL` to flag PRs that are allowed to be auto‑
 * merged.
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  MERGE_LABEL = 'automerge',
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing env vars: GITHUB_TOKEN, REPO_OWNER, REPO_NAME');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getOpenPRs() {
  const prs = [];
  let page = 1;
  const perPage = 30;
  while (true) {
    const { data } = await octokit.pulls.list({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: perPage,
      page,
    });
    prs.push(...data);
    if (data.length < perPage) break;
    page++;
  }
  return prs;
}

async function checksPassed(pr) {
  const { data } = await octokit.checks.listForRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: pr.head.sha,
  });
  return data.check_suites.every(cs => {
    const appCheck = data.check_runs.filter(cr => cr.check_suite_id === cs.id); // narrow
    return cs.status === 'completed' && cs.conclusion === 'success' &&
      appCheck.every(cr => cr.status === 'completed' && cr.conclusion === 'success');
  });
}

async function mergePR(pr) {
  await octokit.pulls.merge({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: pr.number,
    merge_method: 'squash',
  });
  console.log(`✅ Merged PR #${pr.number} – ${pr.title}`);
}

(async () => {
  const prs = await getOpenPRs();
  for (const pr of prs) {
    const hasLabel = pr.labels.some(l => l.name === MERGE_LABEL);
    if (!hasLabel) continue;
    if (await checksPassed(pr)) {
      await mergePR(pr);
    } else {
      console.log(`⛔️ PR #${pr.number} not eligible; checks are not passing`);
    }
  }
})();
