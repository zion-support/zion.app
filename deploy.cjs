#!/usr/bin/env node
/**
 * deploy.cjs — Deploy out/ to GitHub Pages
 * Reads PAT from ~/.git-credentials or env GITHUB_TOKEN
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'out');
const REPO = 'Zion-support/zion-support.github.io';

function getPat() {
  // Try env first
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  
  // Try ~/.git-credentials
  try {
    const creds = fs.readFileSync(path.join(process.env.HOME || process.env.USERPROFILE, '.git-credentials'), 'utf-8');
    const m = creds.match(/https:\/\/[^:]+:([^@]+)@github\.com/);
    if (m) return m[1];
  } catch (e) {}
  
  // Try git remote URL
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    const m = url.match(/https:\/\/[^:]+:([^@]+)@github\.com/);
    if (m) return m[1];
  } catch (e) {}
  
  return null;
}

function api(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path, method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Zion-Deploy/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': body ? Buffer.byteLength(body) : 0,
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const pat = getPat();
  if (!pat) {
    console.error('ERROR: No GitHub PAT found. Set GITHUB_TOKEN env var or configure git credentials.');
    process.exit(1);
  }
  console.log('✓ PAT found');

  if (!fs.existsSync(OUT_DIR)) {
    console.error('ERROR: out/ not found. Build first.');
    process.exit(1);
  }

  // Get main branch SHA
  console.log('Fetching main ref...');
  const refRes = await api('GET', `/repos/${REPO}/git/refs/heads/main`, null, pat);
  const mainSha = refRes.body.object.sha;

  // Get base tree
  const commitRes = await api('GET', `/repos/${REPO}/git/commits/${mainSha}`, null, pat);
  const baseTree = commitRes.data.tree.sha;

  // Build tree entries
  console.log('Building file tree from out/...');
  const treeEntries = [];
  let blobCount = 0;
  
  async function processDir(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.git') continue;
      const full = path.join(dir, item);
      const rel = prefix + item;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        await processDir(full, rel + '/');
      } else {
        const content = fs.readFileSync(full);
        const blobRes = await api('POST', `/repos/${REPO}/git/blobs`, {
          content: content.toString('base64'),
          encoding: 'base64',
        }, pat);
        if (blobRes.status === 201) {
          treeEntries.push({ path: rel, mode: '100644', type: 'blob', sha: blobRes.body.sha });
        }
        blobCount++;
        if (blobCount % 100 === 0) console.log(`  ${blobCount} blobs...`);
      }
    }
  }

  await processDir(OUT_DIR);
  console.log(`✓ ${blobCount} blobs created`);

  // Create tree
  console.log('Creating tree...');
  const treeRes = await api('POST', `/repos/${REPO}/git/trees`, {
    base_tree: baseTree, tree: treeEntries,
  }, pat);
  if (treeRes.status !== 201) {
    console.error('Tree error:', treeRes.body);
    process.exit(1);
  }

  // Create commit
  console.log('Creating commit...');
  const newSha = treeRes.data.sha;
  const commitRes2 = await api('POST', `/repos/${REPO}/git/commits`, {
    message: `deploy: ${new Date().toISOString().slice(0,19)} - 602 service pages + SEO`,
    tree: newSha, parents: [mainSha],
  }, pat);
  if (commitRes2.status !== 201) {
    console.error('Commit error:', commitRes2.body);
    process.exit(1);
  }

  // Create/update gh-pages
  console.log('Pushing to gh-pages...');
  const refRes2 = await api('POST', `/repos/${REPO}/git/refs`, {
    ref: 'refs/heads/gh-pages', sha: commitRes2.body.sha,
  }, pat);
  
  if (refRes2.status === 422) {
    // Exists — force update
    await api('PATCH', `/repos/${REPO}/git/refs/heads/gh-pages`, {
      sha: commitRes2.body.sha, force: true,
    }, pat);
  }

  console.log('\n✅ Deployed!');
  console.log('https://ziontechgroup.com should update in 1-2 min');
}

main().catch(e => { console.error(e); process.exit(1); });
