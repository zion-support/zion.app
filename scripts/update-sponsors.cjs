#!/usr/bin/env node
/**
 * update-sponsors.cjs
 * Fetches public GitHub Sponsors for the organization/user and writes to public/sponsors.json
 * Requires GITHUB_TOKEN with `read:org` scope (or public read for user).
 */
const fs = require('fs');
const path = require('path');

async function fetchSponsors() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN not set');
    process.exit(1);
  }
  const org = 'ZionTechGroup'; // adjust if needed
  const url = `https://api.github.com/orgs/${org}/sponsors`;
  const resp = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!resp.ok) {
    console.error('Failed to fetch sponsors:', resp.status, resp.statusText);
    process.exit(1);
  }
  const data = await resp.json();
  // Map to simple fields
  const sponsors = data.map(s => ({ login: s.login, avatar_url: s.avatar_url, url: s.html_url }));
  return sponsors;
}

(async () => {
  try {
    const sponsors = await fetchSponsors();
    const outPath = path.join(__dirname, '..', 'public', 'sponsors.json');
    fs.writeFileSync(outPath, JSON.stringify(sponsors, null, 2));
    console.log('Sponsors updated:', sponsors.length);
  } catch (err) {
    console.error('Error updating sponsors:', err);
    process.exit(1);
  }
})();
