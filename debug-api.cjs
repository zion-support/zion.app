// debug-api.cjs — Debug GitHub API access
const https = require('https');
const PAT = 'github...5B0x';

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
  // Check what branches exist
  console.log('=== Branches ===');
  const branches = await api('GET', '/repos/Zion-support/zion-support.github.io/branches?per_page=20');
  if (branches.status === 200) {
    branches.data.forEach(b => console.log(`  ${b.name}${b.protected ? ' (protected)' : ''}`));
  } else {
    console.log('  Error:', branches.status, JSON.stringify(branches.data).substring(0, 200));
  }

  // Check Pages settings
  console.log('\n=== Pages ===');
  const pages = await api('GET', '/repos/Zion-support/zion-support.github.io/pages');
  console.log('  Status:', pages.status);
  if (pages.status === 200) {
    console.log('  Source:', JSON.stringify(pages.data.source));
    console.log('  URL:', pages.data.html_url);
  } else {
    console.log('  Error:', JSON.stringify(pages.data).substring(0, 200));
  }

  // Check if gh-pages branch exists specifically
  console.log('\n=== gh-pages ref ===');
  const ref = await api('GET', '/repos/Zion-support/zion-support.github.io/git/refs/heads/gh-pages');
  console.log('  Status:', ref.status);
  if (ref.status === 200) {
    console.log('  SHA:', ref.data.object.sha.substring(0, 8));
  } else {
    console.log('  Not found');
  }
}

main().catch(e => console.error(e.message));
