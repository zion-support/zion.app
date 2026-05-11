#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Gated patch-only dependency PR: reads npm-patch-only-latest.json, runs npm update on listed
 * packages (bounded), npm run test:ci, then opens a draft PR. Requires PATCH_ONLY_AUTO_PR=1
 * and GH_TOKEN / GITHUB_TOKEN with contents + pull-requests write (Actions).
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'npm-patch-only-latest.json');

function run(cmd, opts = {}) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function main() {
  const enabled = process.env.PATCH_ONLY_AUTO_PR === '1' || process.env.PATCH_ONLY_AUTO_PR === 'true';
  if (!enabled) {
    console.log('[patch-only-auto-pr] PATCH_ONLY_AUTO_PR not set; skip.');
    process.exit(0);
  }
  if (!fs.existsSync(REPORT)) {
    console.error('[patch-only-auto-pr] Missing npm-patch-only-latest.json. Run npm run deps:patch-only:report first.');
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  } catch {
    console.error('[patch-only-auto-pr] Invalid JSON in report.');
    process.exit(1);
  }
  const patchOnly = Array.isArray(data.patchOnly) ? data.patchOnly : [];
  const max = Math.min(25, Math.max(1, Number.parseInt(process.env.MAX_PATCH_ONLY_PACKAGES || '12', 10)));
  const pkgs = patchOnly.slice(0, max).map((p) => p.name).filter(Boolean);
  if (pkgs.length === 0) {
    console.log('[patch-only-auto-pr] No patch-only packages; nothing to do.');
    process.exit(0);
  }

  console.log(`[patch-only-auto-pr] npm update ${pkgs.join(' ')}`);
  const u = spawnSync('npm', ['update', ...pkgs], { cwd: ROOT, stdio: 'inherit' });
  if (u.status !== 0) process.exit(u.status || 1);

  const dirty = sh('git status --porcelain package.json package-lock.json');
  if (!dirty) {
    console.log('[patch-only-auto-pr] No package changes after npm update; exit.');
    process.exit(0);
  }

  run('npm run test:ci');

  const branch = `automation/patch-only-${Date.now()}`;
  const userName = process.env.GIT_AUTHOR_NAME || 'github-actions[bot]';
  const userEmail = process.env.GIT_AUTHOR_EMAIL || 'github-actions[bot]@users.noreply.github.com';
  run(`git config user.name ${JSON.stringify(userName)}`);
  run(`git config user.email ${JSON.stringify(userEmail)}`);

  run(`git checkout -b ${branch}`);
  run('git add package.json package-lock.json');
  const msg = `chore(deps): patch-only updates (${pkgs.slice(0, 8).join(', ')}${pkgs.length > 8 ? ', …' : ''})`;
  run(`git commit -m ${JSON.stringify(msg)}`);

  const remote = process.env.PATCH_ONLY_PUSH_REMOTE || 'origin';
  run(`git push ${remote} HEAD:${branch}`);

  const bodyPath = path.join(ROOT, 'patch-only-pr-body.md');
  const lines = [
    'Automated patch-only dependency updates within existing semver ranges.',
    '',
    '**Packages touched:**',
    '',
    pkgs.map((p) => `- \`${p}\``).join('\n'),
    '',
    'Review lockfile diff and merge when CI is green.',
  ];
  fs.writeFileSync(bodyPath, lines.join('\n'));

  const title = 'chore(deps): patch-only bumps (automation)';
  run(
    `gh pr create --draft --base main --head ${branch} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyPath)}`,
  );
  console.log('[patch-only-auto-pr] Draft PR created.');
}

main();
