#!/usr/bin/env node
/**
 * Escalates GitHub issue severity when domain breach streaks stay high;
 * removes autonomy-severity-critical when streaks recover (symmetry with auto-close).
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REGISTRY = path.join(__dirname, 'reports', 'incident-suppression-registry-latest.json');
const LABEL = 'autonomy-severity-critical';
const THRESHOLD = 3;

/** Title fragments for gh search (matches PM2 SLO + legacy title). */
const DOMAIN_TITLES = {
  pm2Slo: ['PM2 SLO critical breach detected', 'PM2 SLO breach detected'],
  pm2Restart: ['PM2 restart guardian alert'],
  openclawIncident: ['Openclaw incident: sustained unhealthy autonomous cycles'],
  openclawSla: ['Openclaw freshness SLA breach'],
};

function readRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  } catch {
    return null;
  }
}

function ensureLabel() {
  try {
    execFileSync(
      'gh',
      [
        'label',
        'create',
        LABEL,
        '--color',
        'D93F0B',
        '--description',
        'Escalated: sustained breach streak (automation)',
      ],
      { stdio: 'ignore' },
    );
  } catch {
    /* exists */
  }
}

function findOpenIssue(titleFragment) {
  try {
    const out = execFileSync(
      'gh',
      [
        'issue',
        'list',
        '--state',
        'open',
        '--search',
        `in:title "${String(titleFragment).replace(/"/g, '')}"`,
        '--json',
        'number,labels',
        '--limit',
        '5',
      ],
      { encoding: 'utf8' },
    );
    const rows = JSON.parse(out || '[]');
    return rows[0] || null;
  } catch {
    return null;
  }
}

function hasLabel(row, name) {
  return (row.labels || []).some((l) => l.name === name);
}

function escalate(titleFragment) {
  const row = findOpenIssue(titleFragment);
  if (!row || !row.number) {
    return;
  }
  if (hasLabel(row, LABEL)) {
    return;
  }
  execFileSync('gh', ['issue', 'edit', String(row.number), '--add-label', LABEL], { stdio: 'inherit' });
  const bodyPath = path.join(os.tmpdir(), `severity-comment-${row.number}-${Date.now()}.md`);
  fs.writeFileSync(
    bodyPath,
    '**Automation:** severity escalated after sustained breach streak (see incident suppression registry).',
    'utf8',
  );
  execFileSync('gh', ['issue', 'comment', String(row.number), '--body-file', bodyPath], {
    stdio: 'inherit',
  });
  try {
    fs.unlinkSync(bodyPath);
  } catch {
    /* ignore */
  }
}

function deescalateTitles(titleFragments) {
  for (const tf of titleFragments) {
    const row = findOpenIssue(tf);
    if (!row || !row.number || !hasLabel(row, LABEL)) {
      continue;
    }
    execFileSync('gh', ['issue', 'edit', String(row.number), '--remove-label', LABEL], {
      stdio: 'inherit',
    });
    const bodyPath = path.join(os.tmpdir(), `severity-downgrade-${row.number}-${Date.now()}.md`);
    fs.writeFileSync(
      bodyPath,
      '**Automation:** removed `autonomy-severity-critical` after breach streak cleared in suppression registry.',
      'utf8',
    );
    execFileSync('gh', ['issue', 'comment', String(row.number), '--body-file', bodyPath], {
      stdio: 'inherit',
    });
    try {
      fs.unlinkSync(bodyPath);
    } catch {
      /* ignore */
    }
  }
}

function main() {
  const reg = readRegistry();
  if (!reg || !reg.domains) {
    console.log('No registry domains; skip severity orchestration.');
    process.exit(0);
  }
  const d = reg.domains;
  ensureLabel();

  const sPm2 = Number(d.pm2Slo?.breachStreak || 0);
  if (sPm2 >= THRESHOLD) {
    escalate('PM2 SLO critical breach detected');
  } else {
    deescalateTitles(DOMAIN_TITLES.pm2Slo);
  }

  const sRestart = Number(d.pm2Restart?.breachStreak || 0);
  if (sRestart >= THRESHOLD) {
    escalate('PM2 restart guardian alert');
  } else {
    deescalateTitles(DOMAIN_TITLES.pm2Restart);
  }

  const sOc = Number(d.openclawIncident?.breachStreak || 0);
  if (sOc >= THRESHOLD) {
    escalate('Openclaw incident: sustained unhealthy autonomous cycles');
  } else {
    deescalateTitles(DOMAIN_TITLES.openclawIncident);
  }

  const sSla = Number(d.openclawSla?.breachStreak || 0);
  if (sSla >= THRESHOLD) {
    escalate('Openclaw freshness SLA breach');
  } else {
    deescalateTitles(DOMAIN_TITLES.openclawSla);
  }
}

main();
