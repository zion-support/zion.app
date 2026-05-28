// test-pat.js — Test PAT token and push via GitHub API
const https = require('https');
const pat = 'github...5B0x';

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path, method,
      headers: {
        'Authorization': `token ${pat}`,
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
  // Test token
  console.log('Testing PAT token...');
  const repo = await api('GET', '/repos/Zion-support/zion-support.github.io');
  console.log('Status:', repo.status);
  if (repo.status === 200) {
    console.log('✓ Token valid');
    console.log('  Repo:', repo.body.full_name);
    console.log('  Has Pages:', repo.body.has_pages);
    console.log('  Default branch:', repo.body.default_branch);
  } else {
    console.log('✗ Token invalid:', JSON.stringify(repo.body).substring(0, 200));
    return;
  }

  // Check if gh-pages branch exists
  console.log('\nChecking gh-pages branch...');
  const branch = await api('GET', '/repos/Zion-support/zion-support.github.io/git/refs/heads/gh-pages');
  console.log('gh-pages exists:', branch.status === 200);
  
  if (branch.status === 200) {
    console.log('  Current SHA:', branch.body.object.sha.substring(0, 8));
  }
}

main().catch(e => console.error('Error:', e.message));
