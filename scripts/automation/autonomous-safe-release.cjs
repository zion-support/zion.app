#!/usr/bin/env node
 
const { execSync } = require('child_process');

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pushWithRebase({
  branch = 'main',
  retries = 3,
}) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      console.log(`[safe-release] Syncing with origin/${branch} (attempt ${attempt}/${retries})`);
      run(`git pull --rebase origin ${branch}`);
      run(`git push origin HEAD:${branch}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const waitMs = attempt * 2500;
        console.warn(`[safe-release] Push attempt ${attempt} failed, retrying in ${waitMs}ms...`);
        await sleep(waitMs);
      }
    }
  }
  throw lastError || new Error('Failed to push after retries');
}

async function triggerDeployHook({ hookUrl, retries = 3 }) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      run(`curl --fail --silent --show-error --max-time 30 -X POST -d '{}' "${hookUrl}"`);
      console.log('[safe-release] Deploy hook triggered successfully.');
      return;
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
      const waitMs = attempt * 2000;
      console.warn(`[safe-release] Deploy hook attempt ${attempt} failed, retrying in ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }
}

async function main() {
  const commitMessage = process.env.COMMIT_MESSAGE?.trim();
  if (!commitMessage) {
    throw new Error('COMMIT_MESSAGE is required.');
  }

  const gitName = process.env.GIT_AUTHOR_NAME || 'github-actions[bot]';
  const gitEmail = process.env.GIT_AUTHOR_EMAIL || 'github-actions[bot]@users.noreply.github.com';
  const runBuild = process.env.RUN_BUILD === '1';
  const targetBranch = process.env.TARGET_BRANCH || 'main';
  const pushRetries = Number(process.env.PUSH_RETRIES || 3);
  const triggerDeploy = process.env.TRIGGER_DEPLOY === '1';
  const deployHook = process.env.NETLIFY_BUILD_HOOK || '';

  run('git add -A');
  const staged = execSync('git diff --staged --name-only', { encoding: 'utf8' }).trim();
  if (!staged) {
    console.log('[safe-release] No changes to commit.');
    return;
  }

  if (runBuild) {
    console.log('[safe-release] Running build check before commit...');
    run('npm run build');
  }

  const escapedCommitMessage = commitMessage.replace(/"/g, '\\"');
  run(`git -c user.name="${gitName}" -c user.email="${gitEmail}" commit -m "${escapedCommitMessage}"`);

  await pushWithRebase({
    branch: targetBranch,
    retries: Number.isFinite(pushRetries) && pushRetries > 0 ? pushRetries : 3,
  });

  if (triggerDeploy) {
    if (!deployHook.trim()) {
      throw new Error('TRIGGER_DEPLOY=1 but NETLIFY_BUILD_HOOK is missing.');
    }
    await triggerDeployHook({ hookUrl: deployHook });
  }
}

main().catch((error) => {
  console.error(`[safe-release] ${error.message}`);
  process.exit(1);
});
