#!/usr/bin/env node
/**
 * generate-release-notes.cjs – Create release notes for a new tag using OpenAI.
 *
 * Expected env vars:
 *   GITHUB_TOKEN   – repo‑scoped token
 *   OPENAI_API_KEY – OpenAI key
 *   REPO_OWNER
 *   REPO_NAME
 *   TAG_NAME       – the tag that triggered the workflow
 */

require('dotenv').config();
const fetch = require('node-fetch');
const { Octokit } = require('@octokit/rest');

const {
  GITHUB_TOKEN,
  OPENAI_API_KEY,
  REPO_OWNER,
  REPO_NAME,
  TAG_NAME,
  OPENAI_MODEL = 'gpt-4o-mini',
} = process.env;

if (!GITHUB_TOKEN || !OPENAI_API_KEY || !REPO_OWNER || !REPO_NAME || !TAG_NAME) {
  console.error('❌ Missing required env vars');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getPreviousTag() {
  const { data } = await octokit.repos.listTags({ owner: REPO_OWNER, repo: REPO_NAME, per_page: 100 });
  const tags = data.map(t => t.name).filter(t => t !== TAG_NAME);
  return tags[0]; // most recent previous tag
}

async function getCommitsSince(prevTag) {
  const { data } = await octokit.repos.compareCommits({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    base: prevTag,
    head: TAG_NAME,
  });
  return data.commits.map(c => `- ${c.commit.message.split('\n')[0]} (${c.sha.substring(0,7)})`).join('\n');
}

async function generateNotes(changelog) {
  const prompt = `Create professional release notes for the following changelog. Include a brief summary of new features, bug fixes, and any breaking changes. Keep it under 250 words.\n\n${changelog}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });
  const json = await response.json();
  return json.choices[0].message.content.trim();
}

async function postReleaseNotes(notes) {
  await octokit.repos.createRelease({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tag_name: TAG_NAME,
    name: `Release ${TAG_NAME}`,
    body: notes,
    draft: false,
    prerelease: false,
  });
  console.log('✅ Release notes posted');
}

(async () => {
  try {
    const prevTag = await getPreviousTag();
    const changelog = await getCommitsSince(prevTag);
    const notes = await generateNotes(changelog);
    await postReleaseNotes(notes);
  } catch (e) {
    console.error('🚨 Error generating release notes', e);
    process.exit(1);
  }
})();
