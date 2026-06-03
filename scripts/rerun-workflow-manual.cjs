const https = require('https');
const http = require('http');

function api(method, urlPath, authToken, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const mod = urlPath.startsWith('https') ? https : http;
    const req = mod.request(
      urlPath,
      {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Hermes-Agent',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(payload ? { 'Content-Type': 'application/json' } : {}),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  const token = process.argv[2];
  const repo = process.argv[3];
  const runId = process.argv[4];

  if (!token || !repo || !runId) {
    console.log('Usage: node rerun-workflow-manual.cjs <TOKEN> <owner/repo> <runId>');
    process.exit(1);
  }

  const url = `https://api.github.com/repos/${repo}/actions/runs/${runId}/rerun`;
  const result = await api('POST', url, token);

  if (result && result.status) {
    console.log(`Triggered rerun for ${repo} run ${runId}: ${result.status}`);
  } else if (result && result.message) {
    console.log(`GitHub API response for rerun: ${result.message}`);
  } else {
    console.log('Rerun request sent. Verify in Actions UI.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
