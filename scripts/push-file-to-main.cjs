const fs = require('fs');
const https = require('https');
const path = require('path');

const repo = 'Zion-support/zion-support.github.io';
const branch = 'main';
const token = fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, '.gh_token'), 'utf8').trim();

function api(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Hermes-Agent',
        ...(payload ? { 'Content-Type': 'application/json' } : {}),
      },
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getRef() {
  return api('GET', `/repos/${repo}/git/ref/heads/${branch}`);
}

async function getCommitTree(commitSha) {
  return api('GET', `/repos/${repo}/git/commits/${commitSha}`).then(c => c.tree.sha);
}

async function createBlob(filePath) {
  const content = Buffer.from(fs.readFileSync(filePath, 'utf8')).toString('base64');
  return api('POST', `/repos/${repo}/git/blobs`, { content, encoding: 'base64' });
}

async function createTree(baseTreeSha, items) {
  return api('POST', `/repos/${repo}/git/trees`, { base_tree: baseTreeSha, tree: items });
}

async function createCommit(treeSha, parentSha, message) {
  return api('POST', `/repos/${repo}/git/commits`, {
    message,
    tree: treeSha,
    parents: [parentSha],
  });
}

async function updateRef(commitSha) {
  return api('PATCH', `/repos/${repo}/git/refs/heads/${branch}`, { sha: commitSha, force: false });
}

async function pushFileToMain(relPath, absolutePath, message) {
  const ref = await getRef();
  const head = ref?.object?.sha;
  if (!head) throw new Error('missing remote ref');

  const baseTree = await getCommitTree(head);
  const blob = await createBlob(absolutePath);
  const items = [{ path: relPath, mode: '100644', type: 'blob', sha: blob.sha }];
  const tree = await createTree(baseTree, items);
  const commit = await createCommit(tree.sha, head, message);
  const updated = await updateRef(commit.sha);
  return { commitSha: commit.sha, refSha: updated.object.sha, path: relPath };
}

async function main() {
  const files = [
    { rel: 'scripts/push-file-to-main.cjs', msg: 'Add reusable GitHub API push helper' },
    { rel: 'scripts/git-wrapper.sh', msg: 'Add git/github wrapper with logging and fallback' },
  ];

  for (const f of files) {
    const result = await pushFileToMain(f.rel, path.join('C:/Users/Zion/zion-support.github.io', f.rel), f.msg);
    console.log(`pushed ${result.path}: commit=${result.commitSha} ref=${result.refSha}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
