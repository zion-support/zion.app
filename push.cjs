const https = require('https');
const fs = require('fs');

// Read token from .git-credentials file
let token = null;
try {
  const creds = fs.readFileSync('C:\\Users\\Zion\\.git-credentials', 'utf8');
  const match = creds.match(/https:\/\/([^:]+):([^@]+)@github\.com/);
  if (match) token = match[2];
} catch(e) {}

if (!token) {
  // Try environment
  token = process.env.GITHUB_TOKEN;
}

if (!token) {
  console.error('No token found');
  process.exit(1);
}

console.log('Token:', token.substring(0, 8) + '...');

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Zion-Deploy'
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  // Get latest commit
  const ref = await api('GET', '/repos/Zion-support/zion-support.github.io/git/refs/heads/main');
  const baseSha = ref.object.sha;
  console.log('Base:', baseSha.substring(0, 12));
  
  // Get base tree
  const commit = await api('GET', '/repos/Zion-support/zion-support.github.io/git/commits/' + baseSha);
  const treeSha = commit.tree.sha;
  
  // Read servicesData.json
  const content = fs.readFileSync('app/data/servicesData.json');
  const blob = await api('POST', '/repos/Zion-support/zion-support.github.io/git/blobs', {
    content: content.toString('base64'),
    encoding: 'base64'
  });
  console.log('Blob:', blob.sha.substring(0, 12));
  
  // Create tree with just this file
  const tree = await api('POST', '/repos/Zion-support/zion-support.github.io/git/trees', {
    base_tree: treeSha,
    tree: [{ path: 'app/data/servicesData.json', mode: '100644', type: 'blob', sha: blob.sha }]
  });
  console.log('Tree:', tree.sha.substring(0, 12));
  
  // Create commit
  const newCommit = await api('POST', '/repos/Zion-support/zion-support.github.io/git/commits', {
    message: 'v19: 12 new services (Micro-SaaS/AI/IT) — 726 total, 10 categories',
    tree: tree.sha,
    parents: [baseSha]
  });
  console.log('Commit:', newCommit.sha.substring(0, 12));
  
  // Update ref
  const update = await api('PATCH', '/repos/Zion-support/zion-support.github.io/git/refs/heads/main', {
    sha: newCommit.sha
  });
  console.log('✅ Pushed:', update.object.sha.substring(0, 12));
}

main().catch(e => { console.error(e); process.exit(1); });
