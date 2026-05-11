#!/usr/bin/env node
// sync-repos.cjs – Cross‑repo issue synchronizer
// Uses Octokit to sync issues from SOURCE to TARGET with auto‑labeling

// ──────────────────────────────────────────────────────────────
// 1️⃣  Load environment configuration
// ──────────────────────────────────────────────────────────────

require('dotenv').config(); // Load .env (dotenv is now a dependency)

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Load config from .env (never commit real secrets)
const {
  GITHUB_TOKEN,
  SOURCE_OWNER,
  SOURCE_REPO,
  TARGET_OWNER,
  TARGET_REPO,
  SYNC_LABEL = 'cross-repo-sync',
  DRY_RUN = 'false',
} = process.env;

if (
  !GITHUB_TOKEN ||
  !SOURCE_OWNER ||
  !SOURCE_REPO ||
  !TARGET_OWNER ||
  !TARGET_REPO
) {
  console.error('❌ Missing required environment variables.');
  console.error('Check your .env file or environment for:');
  console.error('  GITHUB_TOKEN, SOURCE_OWNER, SOURCE_REPO, TARGET_OWNER, TARGET_REPO');
  process.exit(1);
}

// ──────────────────────────────────────────────────────────────
// 2️⃣  Initialize Octokit client
// ──────────────────────────────────────────────────────────────
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Helper – log with prefix according to DRY_RUN flag
const log = (...msg) => {
  const prefix = DRY_RUN === 'true' ? '[DRY RUN] ' : '';
  console.log(`${prefix}${msg.join(' ')}`);
};

// ──────────────────────────────────────────────────────────────
// 3️⃣  Helper functions
// ──────────────────────────────────────────────────────────────

// Fetch all open issues from a repo (handles pagination)
async function fetchOpenIssues(owner, repo) {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: perPage,
      page,
    });

    issues.push(...response.data);
    if (response.data.length < perPage) break;
    page++;
  }

  return issues;
}

// Fetch all issues (open + closed) – used for deduplication
async function fetchAllIssues(owner, repo) {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: perPage,
      page,
    });

    issues.push(...response.data);
    if (response.data.length < perPage) break;
    page++;
  }

  return issues;
}

// Build a quick lookup map of issue titles → issue objects for a repo
async function buildTitleMap(owner, repo) {
  const allIssues = await fetchAllIssues(owner, repo);
  return new Map(allIssues.map(issue => [issue.title.trim(), issue]));
}

// Determine whether an issue already exists in the target based on title
async function issueExists(targetOwner, targetRepo, title) {
  const map = await buildTitleMap(targetOwner, targetRepo);
  return map.has(title.trim());
}

// Create a new issue in the target repo
async function createIssueInTarget(
  title,
  body,
  labels,
  sourceLabels,
  state = 'open'
) {
  const finalLabels = [...sourceLabels, SYNC_LABEL].filter(Boolean);
  const response = await octokit.issues.create({
    owner: TARGET_OWNER,
    repo: TARGET_REPO,
    title,
    body: body || '',
    labels: finalLabels,
    // We keep the original `state` field to preserve closed→open migrations
    state,
  });
  return response.data;
}

// ──────────────────────────────────────────────────────────────
// 4️⃣  Main sync routine
// ──────────────────────────────────────────────────────────────

async function runSync() {
  try {
    log('🔎 Fetching open issues from SOURCE:', `${SOURCE_OWNER}/${SOURCE_REPO}`);
    const sourceIssues = await fetchOpenIssues(SOURCE_OWNER, SOURCE_REPO);
    log(`📦 Retrieved ${sourceIssues.length} open issues from ${SOURCE_OWNER}/${SOURCE_REPO}`);

    log('🔎 Fetching existing issue titles from TARGET for deduplication');
    const targetIssueMap = await buildTitleMap(TARGET_OWNER, TARGET_REPO);

    log('🔄 Starting synchronization loop...');
    for (const issue of sourceIssues) {
      const { title, body, labels = [] } = issue;
      const cleanTitle = title.trim();

      // Skip if target already has an issue with the same title
      if (await issueExists(TARGET_OWNER, TARGET_REPO, cleanTitle)) {
        log(`⏭️  Skipping existing issue in TARGET: ${cleanTitle}`);
        continue;
      }

      // Prepare label set (source labels + our sync label)
      const sourceLabelNames = labels.map(l => l.name);
      log(`🏷️  Adding label(s) ${sourceLabelNames.concat(SYNC_LABEL).join(', ')} to new issue`);

      // Create the issue in the target repo
      const createdIssue = await createIssueInTarget(
        cleanTitle,
        body,
        sourceLabelNames,
        labels
      );

      log(`✅ Created issue in TARGET: ${createdIssue.html_url}`);
    }

    log('🎉 Synchronization completed.');
  } catch (err) {
    console.error('🚨 Sync failed:', err.message);
    process.exit(1);
  }
}

// Run the sync
runSync();
