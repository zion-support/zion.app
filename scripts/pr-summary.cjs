#!/usr/bin/env node
/**
 * pr-summary.cjs – Generate a concise summary of a Pull Request using OpenAI.
 *
 * This script expects the following environment variables:
 *   GITHUB_TOKEN       – GitHub API token with repo scope
 *   OPENAI_API_KEY     – OpenAI API key for the completion endpoint
 *   REPO_OWNER         – Owner of the repository (e.g., Zion-support)
 *   REPO_NAME          – Repository name (e.g., zion.app)
 *   PR_NUMBER          – Pull request number to summarize
 *
 * The script fetches the PR diff, sends it to OpenAI's chat/completions API
 * with a short instruction, and posts the resulting summary as a comment on the PR.
 *
 * For production use you would add more robust error handling, rate‑limit
 * management, and possibly cache summaries. This minimal version keeps the
 * dependency footprint low (node-fetch only).
 */

require('dotenv').config();
const fetch = require('node-fetch');
const { Octokit } = require('@octokit/rest');

const {
  GITHUB_TOKEN,
  OPENAI_API_KEY,
  REPO_OWNER,
  REPO_NAME,
  PR_NUMBER,
  OPENAI_MODEL = 'gpt-4o-mini', // fast, cheap model for summaries
} = process.env;

if (!GITHUB_TOKEN || !OPENAI_API_KEY || !REPO_OWNER || !REPO_NAME || !PR_NUMBER) {
  console.error('❌ Missing required env vars (GITHUB_TOKEN, OPENAI_API_KEY, REPO_OWNER, REPO_NAME, PR_NUMBER)');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function fetchPRDiff(prNumber) {
  const { data } = await octokit.pulls.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: Number(prNumber),
    mediaType: { format: 'diff' },
  });
  return data;
}

async function summarize(diffText) {
  const prompt = `Summarize the following GitHub pull request diff in bullet points, focusing on functional changes, API surface changes, and any potential breaking changes. Keep the summary ≤ 200 words.\n\nDiff:\n${diffText}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const result = await response.json();
  return result.choices[0].message.content.trim();
}

async function postComment(prNumber, summary) {
  await octokit.issues.createComment({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: Number(prNumber),
    body: `📝 **Automated PR Summary**\n\n${summary}`,
  });
}

(async () => {
  try {
    const diff = await fetchPRDiff(PR_NUMBER);
    const summary = await summarize(diff);
    await postComment(PR_NUMBER, summary);
    console.log(`✅ Summary posted to PR #${PR_NUMBER}`);
  } catch (err) {
    console.error('🚨 Error generating PR summary:', err.message);
    process.exit(1);
  }
})();
