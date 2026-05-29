const https = require('https');
const fs = require('fs');

// Read token from git credential
let token = null;
try {
  const { execSync } = require('child_process');
  // Try to get token via git credential fill
  const cred = execSync('git credential fill', {
    input: 'protocol=https\nhost=github.com\n\n',
    timeout: 15000,
    encoding: 'utf8'
  });
  const match = cred.match(/^password=(.+)/m);
  if (match) token = match[1].trim();
} catch(e) {
  console.error('git credential failed:', e.message);
}

if (!token) {
  // Try reading from .git-credentials
  try {
    const creds = fs.readFileSync('C:\\Users\\Zion\\.git-credentials', 'utf8');
    const m = creds.match(/https:\/\/([^:]+):([^@]+)@github\.com/);
    if (m) token = m[2];
  } catch(e) {}
}

if (!token) { console.error('No token'); process.exit(1); }
console.log('Token:', token.substring(0, 8) + '...');

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const opts = {
      hostname: 'api.github.com', path, method,
      headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'Zion-Deploy' }
    };
    if (body) opts.headers['Content-Length'] = Buffer.byteLength(body);
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const ref = await api('GET', '/repos/Zion-support/zion-support.github.io/git/refs/heads/main');
  const baseSha = ref.object.sha;
  console.log('Base:', baseSha.substring(0, 12));
  
  const commit = await api('GET', '/repos/Zion-support/zion-support.github.io/git/commits/' + baseSha);
  const treeSha = commit.tree.sha;
  
  const content = fs.readFileSync('app/data/servicesData.json');
  const blob = await api('POST', '/repos/Zion-support/zion-support.github.io/git/blobs', {
    content: content.toString('base64'), encoding: 'base64'
  });
  console.log('Blob:', blob.sha.substring(0, 12));
  
  const tree = await api('POST', '/repos/Zion-support/zion-support.github.io/git/trees', {
    base_tree: treeSha,
    tree: [{ path: 'app/data/servicesData.json', mode: '100644', type: 'blob', sha: blob.sha }]
  });
  console.log('Tree:', tree.sha.substring(0, 12));
  
  const newCommit = await api('POST', '/repos/Zion-support/zion-support.github.io/git/commits', {
    message: 'v20: 17 new Micro-SaaS/AI/IT services, FAQ schema for SEO, contact details',
    tree: tree.sha, parents: [baseSha]
  });
  console.log('Commit:', newCommit.sha.substring(0, 12));
  
  const update = await api('PATCH', '/repos/Zion-support/zion-support.github.io/git/refs/heads/main', { sha: newCommit.sha });
  console.log('✅ Pushed:', update.object.sha.substring(0, 12));
}
main().catch(e => { console.error(e); process.exit(1); });
