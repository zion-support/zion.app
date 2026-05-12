#!/usr/bin/env node
/**
 * AI Code Review Assistant
 * Uses a free LLM (OpenRouter) to analyze pull requests and provide inline suggestions.
 * The script can be run in a GitHub Actions `pull_request_target` job.
 * It posts a comment with a short bullet‑point summary of key suggestions.
 */
const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration – all free tokens / providers
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''; // free tier

if (!GITHUB_TOKEN) {
  console.error('Missing GITHUB_TOKEN environmental variable');
  process.exit(1);
}

// Helper to get PR files
async function getModifiedFiles(octokit, owner, repo, prNumber) {
  const files = [];
  let page = 1;
  while (true) {
    const res = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
      page,
    });
    files.push(...res.data);
    if (res.data.length < 100) break;
    page++;
  }
  return files;
}

async function main() {
  const [,, prNumberStr] = process.argv;
  const prNumber = Number(prNumberStr);
  if (!prNumber) {
    console.error('Usage: ai-code-review.js <PR_NUMBER>');
    process.exit(1);
  }

  const repoUrl = process.env.GITHUB_REPOSITORY || process.argv[2];
  const [owner, repo] = repoUrl.split('/');

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  console.log(`Fetching modified files for PR #${prNumber}…`);
  const files = await getModifiedFiles(octokit, owner, repo, prNumber);

  // Build a prompt for the LLM – concise but descriptive
  const prompt = `You are a senior backend engineer. Review the following code changes:

` + files
    .map(f => `${f.filename} (${f.status})`)
    .join('\n')
    + `

For each change, list 1-3 concise suggestions or concerns, focusing on security, performance, and code quality. Give the suggestions in markdown bullet points. Do not provide code unless you are sure the change is trivial.
`;

  console.log('Calling OpenRouter…');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-1', // free tier
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`OpenRouter error: ${response.status} ${err}`);
    process.exit(1);
  }

  const data = await response.json();
  const review = data.choices[0].message.content.trim();

  console.log('Posting comment…');
  await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner,
    repo,
    issue_number: prNumber,
    body: `### ✅ Code Review Auto‑Suggester
${review}`,
  });

  console.log('Comment posted!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});