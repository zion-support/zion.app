#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Fails if tracked files contain unresolved git merge conflict markers.
 * Uses `git grep` so only indexed content is checked.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..', '..');

function main() {
  const r = spawnSync('git', ['grep', '-n', '^<<<<<<<', '--', '.'], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });

  if (r.error) {
    console.warn('check-merge-conflict-markers: git unavailable, skip:', r.error.message);
    process.exit(0);
  }

  if (r.status === 0 && r.stdout && r.stdout.trim()) {
    console.error(
      'Unresolved merge conflict markers (^<<<<<<<) in tracked files:\n\n' + r.stdout.trim() + '\n'
    );
    process.exit(1);
  }

  if (r.status === 1) {
    process.exit(0);
  }

  console.error('check-merge-conflict-markers: unexpected git grep exit', r.status, r.stderr || '');
  process.exit(1);
}

main();
