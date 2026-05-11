#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Auto-open draft PR when route-contract autofix changes smoke routes.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();

function run(cmd, args, extraEnv = {}) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });
}

function must(cmd, args, extraEnv = {}) {
  const r = run(cmd, args, extraEnv);
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) process.exit(r.status || 1);
  return r;
}

function resolveCodeownersAssignee(logicalPath = 'config/smoke-routes.txt') {
  const p = path.join(ROOT, '.github', 'CODEOWNERS');
  if (!fs.existsSync(p)) return '';
  const lp = String(logicalPath).replace(/^\//, '');
  const rules = fs
    .readFileSync(p, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const parts = line.split(/\s+/);
      return { pattern: parts[0], owners: parts.slice(1).filter((x) => x.startsWith('@')) };
    })
    .filter((r) => r.pattern && r.owners.length > 0);
  const matches = rules.filter((r) => {
    const pat = r.pattern.replace(/^\//, '');
    if (pat === '*') return true;
    if (pat.endsWith('/')) return lp.startsWith(pat);
    return lp === pat || lp.startsWith(`${pat}/`);
  });
  if (matches.length === 0) return '';
  return String(matches[matches.length - 1].owners[0] || '').replace(/^@/, '').trim();
}

function main() {
  must(process.execPath, ['automation/validate-ai-lab-route-contract.cjs', '--fix']);

  const st = run('git', ['status', '--porcelain', '--', 'config/smoke-routes.txt']);
  if ((st.stdout || '').trim() === '') {
    console.log('[ai-lab-route-contract-auto-pr] no route contract drift to fix');
    return;
  }

  const branch = `ai-lab-route-contract-autofix-${Date.now()}`;
  must('git', ['checkout', '-b', branch]);
  must('git', ['add', 'config/smoke-routes.txt']);
  must('git', ['commit', '-m', 'chore(ai-lab): auto-fix route contract smoke routes']);
  must('git', ['push', '-u', 'origin', branch]);

  const body = [
    'Automated route-contract drift fix.',
    '',
    '- Ran `validate-ai-lab-route-contract --fix`',
    '- Updated `config/smoke-routes.txt` to restore AI Lab contract alignment',
  ].join('\n');
  const created = must('gh', [
    'pr',
    'create',
    '--draft',
    '--title',
    'chore(ai-lab): auto-fix route-contract smoke routes',
    '--body',
    body,
  ]);
  const assignee = process.env.AI_LAB_ROUTE_CONTRACT_ASSIGNEE || resolveCodeownersAssignee('config/smoke-routes.txt');
  if (assignee) {
    const prUrl = (created.stdout || '').trim();
    if (prUrl) {
      const r = run('gh', ['pr', 'edit', prUrl, '--add-assignee', assignee]);
      if (r.status !== 0) {
        console.warn(`[ai-lab-route-contract-auto-pr] unable to assign @${assignee}:`, r.stderr || r.stdout);
      } else {
        console.log(`[ai-lab-route-contract-auto-pr] assigned @${assignee}`);
      }
    }
  }
}

main();
