// push-gh-pages.cjs — Push to gh-pages branch using GitHub API
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PAT = 'github...5B0x';
const REPO = 'Zion-support/zion-support.github.io';
const DEPLOY_DIR = 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp';

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path, method,
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'User-Agent': 'Zion-Deploy/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
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
  console.log('Pushing to gh-pages via GitHub API...');

  // 1. Get the current gh-pages branch SHA (or main if gh-pages doesn't exist)
  let baseSha;
  try {
    const ghPages = await api('GET', `/repos/${REPO}/git/refs/heads/gh-pages`);
    if (ghPages.status === 200) {
      baseSha = ghPages.body.object.sha;
      console.log('  gh-pages SHA:', baseSha.substring(0, 8));
    }
  } catch (e) {}

  if (!baseSha) {
    const main = await api('GET', `/repos/${REPO}/git/refs/heads/main`);
    baseSha = main.body.object.sha;
    console.log('  main SHA:', baseSha.substring(0, 8));
  }

  // 2. Get the current commit's tree
  const commit = await api('GET', `/repos/${REPO}/git/commits/${baseSha}`);
  const baseTree = commit.body.tree.sha;
  console.log('  base tree:', baseTree.substring(0, 8));

  // 3. Build tree entries from the deploy temp directory
  console.log('  Building tree from deploy directory...');
  const treeEntries = [];
  
  function walkDir(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.git') continue;
      const full = path.join(dir, item);
      const rel = prefix + item;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkDir(full, rel + '/');
      } else {
        treeEntries.push(rel);
      }
    }
  }
  
  walkDir(DEPLOY_DIR);
  console.log(`  Found ${treeEntries.length} files`);

  // 4. Create blobs and tree entries in batches
  const BATCH_SIZE = 50;
  const allTreeEntries = [];
  
  for (let i = 0; i < treeEntries.length; i += BATCH_SIZE) {
    const batch = treeEntries.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (filePath) => {
      const fullPath = path.join(DEPLOY_DIR, filePath);
      const content = fs.readFileSync(fullPath);
      const blob = await api('POST', `/repos/${REPO}/git/blobs`, {
        content: content.toString('base64'),
        encoding: 'base64',
      });
      if (blob.status === 201) {
        return { path: filePath, mode: '100644', type: 'blob', sha: blob.body.sha };
      }
      return null;
    });
    
    const results = await Promise.all(promises);
    results.filter(Boolean).forEach(e => allTreeEntries.push(e));
    
    if ((i + BATCH_SIZE) % 200 === 0 || i + BATCH_SIZE >= treeEntries.length) {
      console.log(`  Blobs: ${allTreeEntries.length}/${treeEntries.length}`);
    }
  }

  console.log(`  Created ${allTreeEntries.length} blobs`);

  // 5. Create tree
  console.log('  Creating tree...');
  const tree = await api('POST', `/repos/${REPO}/git/trees`, {
    base_tree: baseTree,
    tree: allTreeEntries,
  });
  
  if (tree.status !== 201) {
    console.error('  Tree error:', JSON.stringify(tree.body).substring(0, 200));
    process.exit(1);
  }
  console.log('  Tree SHA:', tree.body.sha.substring(0, 8));

  // 6. Create commit
  console.log('  Creating commit...');
  const newCommit = await api('POST', `/repos/${REPO}/git/commits`, {
    message: `deploy: ${new Date().toISOString().slice(0,19)} - 602 service pages + SEO fixes`,
    tree: tree.body.sha,
    parents: [baseSha],
  });
  
  if (newCommit.status !== 201) {
    console.error('  Commit error:', JSON.stringify(newCommit.body).substring(0, 200));
    process.exit(1);
  }
  console.log('  Commit SHA:', newCommit.body.sha.substring(0, 8));

  // 7. Create or update gh-pages ref
  console.log('  Updating gh-pages ref...');
  const existing = await api('GET', `/repos/${REPO}/git/refs/heads/gh-pages`);
  
  if (existing.status === 200) {
    // Update existing
    const update = await api('PATCH', `/repos/${REPO}/git/refs/heads/gh-pages`, {
      sha: newCommit.body.sha,
      force: true,
    });
    if (update.status === 200) {
      console.log('  ✓ gh-pages updated');
    } else {
      console.error('  Update error:', JSON.stringify(update.body).substring(0, 200));
      process.exit(1);
    }
  } else {
    // Create new
    const create = await api('POST', `/repos/${REPO}/git/refs`, {
      ref: 'refs/heads/gh-pages',
      sha: newCommit.body.sha,
    });
    if (create.status === 201) {
      console.log('  ✓ gh-pages created');
    } else {
      console.error('  Create error:', JSON.stringify(create.body).substring(0, 200));
      process.exit(1);
    }
  }

  console.log('\n✅ Deployed to GitHub Pages!');
  console.log('https://ziontechgroup.com should update within 1-2 minutes.');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
