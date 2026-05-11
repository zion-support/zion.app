#!/usr/bin/env node
/**
 * Cross-link open automation incidents that share the same registry correlationId in the body.
 * Rate-limited via automation/reports/sibling-crosslink-state.json
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STATE = path.join(__dirname, 'reports', 'sibling-crosslink-state.json');
const COOLDOWN_H = Number(process.env.SIBLING_CROSSLINK_COOLDOWN_HOURS || 168);

function gh(args) {
  return spawnSync('gh', args, { encoding: 'utf8', env: process.env });
}

function extractCorrelationId(body) {
  const m = String(body || '').match(/\*\*correlationId:\*\*\s*`([^`]+)`/);
  return m ? m[1].trim() : null;
}

function main() {
  const list = gh([
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    'automation-incident',
    '--json',
    'number',
    '--limit',
    '200',
  ]);
  if (list.status !== 0) {
    console.error(list.stderr);
    process.exit(1);
  }
  let nums;
  try {
    nums = JSON.parse(list.stdout || '[]').map((x) => x.number);
  } catch {
    process.exit(1);
  }

  const byCorr = new Map();
  for (const num of nums) {
    const v = gh(['issue', 'view', String(num), '--json', 'body']);
    if (v.status !== 0) continue;
    let body;
    try {
      body = JSON.parse(v.stdout || '{}').body;
    } catch {
      continue;
    }
    const cid = extractCorrelationId(body);
    if (!cid) continue;
    if (!byCorr.has(cid)) {
      byCorr.set(cid, []);
    }
    byCorr.get(cid).push(num);
  }

  let state = {};
  try {
    state = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    state = { pairs: {} };
  }
  state.pairs = state.pairs || {};
  const now = Date.now();

  for (const [cid, issueNums] of byCorr) {
    if (issueNums.length < 2) continue;
    const key = issueNums.sort((a, b) => a - b).join('-');
    const last = state.pairs[key];
    if (last && (now - new Date(last).getTime()) / 3600000 < COOLDOWN_H) {
      continue;
    }

    const others = issueNums.map((n) => `#${n}`).join(', ');
    const body = `**Automation:** sibling incidents sharing correlation \`${cid}\`: ${others}`;
    for (const num of issueNums) {
      const peerLine = issueNums
        .filter((n) => n !== num)
        .map((n) => `- #${n}`)
        .join('\n');
      const commentBody = `${body}\n\nRelated:\n${peerLine}`;
      const f = path.join(require('os').tmpdir(), `sibling-${num}-${Date.now()}.md`);
      fs.writeFileSync(f, commentBody, 'utf8');
      const r = gh(['issue', 'comment', String(num), '--body-file', f]);
      try {
        fs.unlinkSync(f);
      } catch {
        /* ignore */
      }
      if (r.status !== 0) {
        console.warn('comment failed', num, r.stderr);
      }
    }
    state.pairs[key] = new Date().toISOString();
  }

  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  console.log('sibling-crosslink done');
}

main();
