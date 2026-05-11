#!/usr/bin/env node
/**
 * When exact-template migrator has candidates, apply, validate, and open a draft PR.
 * Env: GH_TOKEN, GITHUB_REPOSITORY (actions), GIT_AUTHOR_NAME / EMAIL optional.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'ai-lab-safe-scaffold-migrator-latest.json');
const MIGRATOR = path.join(ROOT, 'automation', 'ai-lab-safe-scaffold-migrator.cjs');

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  return r;
}

function shOutput(cmd, args) {
  const r = run(cmd, args);
  return { status: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function main() {
  if (process.env.AI_LAB_SAFE_SCAFFOLD_PR_DISABLE === '1') {
    console.log('[ai-lab-safe-scaffold-open-pr] disabled via AI_LAB_SAFE_SCAFFOLD_PR_DISABLE');
    process.exit(0);
  }

  const dry = process.env.AI_LAB_SAFE_SCAFFOLD_PR_DRY_RUN === '1';

  let r0 = run(process.execPath, [MIGRATOR]);
  process.stdout.write(r0.stdout || '');
  process.stderr.write(r0.stderr || '');
  if (r0.status !== 0) process.exit(r0.status);

  if (!fs.existsSync(REPORT)) {
    console.log('[ai-lab-safe-scaffold-open-pr] no migrator report');
    process.exit(0);
  }
  const rep = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  const n = Number(rep.exactTemplateCandidates || 0);
  if (n <= 0) {
    console.log('[ai-lab-safe-scaffold-open-pr] no exact-template candidates');
    process.exit(0);
  }

  const r1 = run(process.execPath, [MIGRATOR, '--apply']);
  process.stdout.write(r1.stdout || '');
  process.stderr.write(r1.stderr || '');
  if (r1.status !== 0) process.exit(r1.status);

  const lintNpm = run('npm', ['run', 'lint:check'], { ...process.env });
  if (lintNpm.status !== 0) {
    console.error('[ai-lab-safe-scaffold-open-pr] lint failed');
    process.exit(lintNpm.status);
  }
  const tc = run('npm', ['run', 'type-check'], { ...process.env });
  if (tc.status !== 0) {
    console.error('[ai-lab-safe-scaffold-open-pr] type-check failed');
    process.exit(tc.status);
  }

  const st = shOutput('git', ['status', '--porcelain']);
  if (st.status !== 0) {
    console.error(st.err);
    process.exit(1);
  }
  if (!st.out) {
    console.log('[ai-lab-safe-scaffold-open-pr] no file changes after apply');
    process.exit(0);
  }

  const branch = `ai-lab-safe-scaffold-migrate-${Date.now()}`;
  if (dry) {
    console.log('[ai-lab-safe-scaffold-open-pr] dry-run: would create branch', branch);
    process.exit(0);
  }

  const gh = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!gh) {
    console.error('[ai-lab-safe-scaffold-open-pr] GH_TOKEN / GITHUB_TOKEN required for PR creation');
    process.exit(1);
  }

  const gitCfg = [
    ['git', ['checkout', '-b', branch]],
    ['git', ['add', 'app/ai-lab', 'automation/reports/ai-lab-safe-scaffold-migrator-latest.json']],
    [
      'git',
      [
        'commit',
        '-m',
        'chore(ai-lab): safe scaffold migrator (exact-template)',
        '-m',
        `Migrator report: ${n} candidate(s). Automated by ai-lab-safe-scaffold-open-pr.cjs`,
      ],
    ],
    ['git', ['push', '-u', 'origin', branch]],
  ];

  for (const [cmd, args] of gitCfg) {
    const rr = run(cmd, args);
    if (rr.stdout) process.stdout.write(rr.stdout);
    if (rr.stderr) process.stderr.write(rr.stderr);
    if (rr.status !== 0) {
      console.error(`[ai-lab-safe-scaffold-open-pr] failed: ${cmd} ${args.join(' ')}`);
      process.exit(rr.status);
    }
  }

  const repo = process.env.GITHUB_REPOSITORY || '';
  const pr = run('gh', [
    'pr',
    'create',
    '--draft',
    '--title',
    'chore(ai-lab): safe legacy scaffold migration (exact-template)',
    '--body',
    [
      'Automated PR from `automation/ai-lab-safe-scaffold-open-pr.cjs`.',
      '',
      '- Exact-template pages only (see migrator markers).',
      '- Lint + type-check passed in workflow.',
      '',
      `Candidates processed: ${n}`,
    ].join('\n'),
    ...(repo ? ['--repo', repo] : []),
  ]);
  if (pr.stdout) process.stdout.write(pr.stdout);
  if (pr.stderr) process.stderr.write(pr.stderr);
  process.exit(pr.status ?? 0);
}

main();
