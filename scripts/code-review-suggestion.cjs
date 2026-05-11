#!/usr/bin/env node
/**
 * code-review-suggestion.cjs – Automatically generates code review suggestions
 * for pull requests using OpenAI.
 *
 * Environment variables:
 *   GITHUB_TOKEN
 *   OPENAI_API_KEY
 *   REPO_OWNER
 *   REPO_NAME
 *   PR_NUMBER
 *   OPENAI_MODEL (default: gpt-4o-mini)
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
  OPENAI_MODEL = 'gpt-4o-mini',
} = process.env;

if (!GITHUB_TOKEN || !OPENAI_API_KEY || !REPO_OWNER || !REPO_NAME || !PR_NUMBER) {
  console.error('Missing required env vars');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function fetchPRDiff() {
  const { data } = await octokit.pulls.get({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    pull_number: Number(PR_NUMBER),
    mediaType: { format: 'diff' },
  });
  return data;
}

async function generateSuggestions(diff) {
  const prompt = `You are an experienced senior developer. Review the following pull request diff. Provide concise, constructive feedback covering style, logic, performance, potential bugs, and any relevant best‑practice suggestions. Output in Markdown with headings.\n\nDiff:\n${diff}`;
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
      max_tokens: 1024,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }
  const json = await response.json();
  return json.choices[0].message.content.trim();
}

async function postComment(body) {
  await octokit.issues.createComment({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: Number(PR_NUMBER),
    body,
  });
}

(async () => {
  try {
    const diff = await fetchPRDiff();
    const suggestions = await generateSuggestions(diff);
    await postComment(`🛠️ *Automated Code Review Assistant*\n\n${suggestions}`);
    console.log('✅ Comment posted on PR');
  } catch (e) {
    console.error('🚨 Error:', e.message);
    process.exit(1);
  }
})();
