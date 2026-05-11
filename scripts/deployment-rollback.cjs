#!/usr/bin/env node
/**
 * deployment-rollback.cjs – Automatic rollback to the last successful deployment tag.
 *
 * This script is intended to be run when a deployment workflow fails. It:
 *   1. Retrieves the most recent successful deployment tag (assumes tags follow `v*`).
 *   2. Resets the main branch to that tag.
 *   3. Pushes the rollback to the remote.
 *   4. Posts a comment on the failing workflow run with details.
 *
 * Environment variables:
 *   GITHUB_TOKEN   – GitHub token with repo scope
 *   REPO_OWNER
 *   REPO_NAME
 *   FAILED_RUN_ID  – The GitHub Actions run ID that failed (optional, for comment)
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const { execSync } = require('child_process');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  FAILED_RUN_ID,
} = process.env;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('❌ Missing required env vars');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getLastSuccessfulTag() {
  const { data: tags } = await octokit.repos.listTags({ owner: REPO_OWNER, repo: REPO_NAME, per_page: 100 });
  for (const tag of tags) {
    const runs = await octokit.actions.listWorkflowRunsForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      branch: tag.name,
      status: 'completed',
      conclusion: 'success',
      per_page: 5,
    });
    if (runs.data.workflow_runs.length > 0) {
      return tag.name;
    }
  }
  return null;
}

async function commentOnRun(message) {
  if (!FAILED_RUN_ID) return;
  try {
    await octokit.request('POST /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations', {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      check_run_id: FAILED_RUN_ID,
      annotations: [{
        path: 'deployment.yml',
        start_line: 1,
        end_line: 1,
        annotation_level: 'failure',
        message,
      }],
    });
  } catch (_) {}
}

(async () => {
  try {
    const tag = await getLastSuccessfulTag();
    if (!tag) {
      console.log('⚠️ No successful deployment tag found.');
      process.exit(0);
    }

    console.log(`🔄 Rolling back to tag ${tag}...`);

    execSync('git fetch --tags', { stdio: 'inherit' });
    execSync(`git checkout ${tag}`, { stdio: 'inherit' });
    execSync('git push --force-with-lease origin main', { stdio: 'inherit' });

    console.log(`✅ Rolled back to ${tag}`);
    await commentOnRun(`Deployment failed. Rolled back to ${tag}.`);
  } catch (err) {
    console.error('🚨 Rollback failed:', err.message);
    process.exit(1);
  }
})();