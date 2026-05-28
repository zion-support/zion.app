// push-final.cjs — Push to gh-pages using GitHub API with PAT from env
const https = require('https');
const fs = require('fs');
const path = require('path');

const PAT = process.env.GITHUB_PAT;
if (!PAT) {
  console.error('ERROR: Set GITHUB_PAT env var first');
  process.exit(1);
}
console.log('Token length:', PAT.length);

const REPO = 'Zion-support/zion-support.github.io';

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
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  // Test token
  const test = await api('GET', `/repos/${REPO}`);
  if (test.status !== 200) {
    console.error('Auth failed:', test.status, JSON.stringify(test.data).substring(0, 200));
    process.exit(1);
  }
  console.log('✓ Auth OK');

  // Get main branch SHA (more reliable than gh-pages)
  const mainRef = await api('GET', `/repos/${REPO}/git/refs/heads/main`);
  if (mainRef.status !== 200) {
    console.error('Cannot get main ref:', mainRef.status);
    process.exit(1);
  }
  const mainSha = mainRef.data.object.sha;
  console.log('main SHA:', mainSha.substring(0, 8));

  // Get commit tree
  const commit = await api('GET', `/repos/${REPO}/git/commits/${mainSha}`);
  const baseTree = commit.data.tree.sha;

  // Build tree from deploy temp
  const DEPLOY_DIR = 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp';
  const treeEntries = [];
  
  function walkDir(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.git') continue;
      const full = path.join(dir, item);
      const rel = prefix + item;
      if (fs.statSync(full).isDirectory()) {
        walkDir(full, rel + '/');
      } else {
        treeEntries.push(rel);
      }
    }
  }
  walkDir(DEPLOY_DIR);
  console.log(`Found ${treeEntries.length} files`);

  // Create blobs in batches of 20 (rate limit aware)
  const allEntries = [];
  for (let i = 0; i < treeEntries.length; i += 20) {
    const batch = treeEntries.slice(i, i + 20);
    const results = await Promise.all(batch.map(async (fp) => {
      const content = fs.readFileSync(path.join(DEPLOY_DIR, fp));
      const blob = await api('POST', `/repos/${REPO}/git/blobs`, {
        content: content.toString('base64'),
        encoding: 'base64',
      });
      return blob.status === 201 
        ? { path: fp, mode: '100644', type: 'blob', sha: blob.data.sha }
        : null;
    }));
    results.filter(Boolean).forEach(e => allEntries.push(e));
    process.stdout.write(`\rBlobs: ${allEntries.length}/${treeEntries.length}`);
  }
  console.log(`\n✓ ${allEntries.length} blobs`);

  // Create tree
  const tree = await api('POST', `/repos/${REPO}/git/trees`, {
    base_tree: baseTree, tree: allEntries,
  });
  if (tree.status !== 201) {
    console.error('Tree error:', JSON.stringify(tree.data).substring(0, 200));
    process.exit(1);
  }

  // Create commit
  const newCommit = await api('POST', `/repos/${REPO}/git/commits`, {
    message: `deploy: ${new Date().toISOString().slice(0,19)} - service pages + SEO`,
    tree: tree.data.sha, parents: [mainSha],
  });
  if (newCommit.status !== 201) {
    console.error('Commit error:', JSON.stringify(newCommit.data).substring(0, 200));
    process.exit(1);
  }
  console.log('Commit:', newCommit.data.sha.substring(0, 8));

  // Update gh-pages ref
  const existing = await api('GET', `/repos/${REPO}/git/refs/heads/gh-pages`);
  if (existing.status === 200) {
    const upd = await api('PATCH', `/repos/${REPO}/git/refs/heads/gh-pages`, {
      sha: newCommit.data.sha, force: true,
    });
    console.log('gh-pages updated:', upd.status === 200 ? '✓' : '✗');
  } else {
    const cre = await api('POST', `/repos/${REPO}/git/refs`, {
      ref: 'refs/heads/gh-pages', sha: newCommit.data.sha,
    });
    console.log('gh-pages created:', cre.status === 201 ? '✓' : '✗');
  }

  console.log('\n✅ Deployed! https://ziontechgroup.com');
}

main().catch(e => { console.error(e); process.exit(1); });
