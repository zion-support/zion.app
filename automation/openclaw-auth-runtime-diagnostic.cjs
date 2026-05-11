#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'openclaw-auth-runtime-diagnostic-latest.json');
const CONTRACT_TOKEN = process.env.OPENCLAW_PREFLIGHT_TOKEN || 'AUTH_OK';
const TIMEOUT_SECONDS = Math.max(20, Number.parseInt(process.env.OPENCLAW_AUTH_DIAG_TIMEOUT_SECONDS || '90', 10));

function parseJsonCandidate(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractEnvelopeText(output) {
  const raw = String(output || '').trim();
  if (!raw) {
    return { text: '', shape: 'empty' };
  }
  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
  const candidates = [];
  if (lines.length > 0) {
    candidates.push(lines[lines.length - 1]);
  }
  candidates.push(raw);
  for (const candidate of candidates) {
    const parsed = parseJsonCandidate(candidate);
    if (!parsed) {
      continue;
    }
    const fields = [parsed.text, parsed.content, parsed.response, parsed.output];
    for (const field of fields) {
      if (typeof field === 'string' && field.trim()) {
        return { text: field.trim(), shape: 'json-envelope' };
      }
    }
    return { text: candidate.trim(), shape: 'json-other' };
  }
  return { text: raw, shape: 'plain-text' };
}

function runBash(command) {
  return spawnSync('bash', ['-lc', command], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: TIMEOUT_SECONDS * 1000,
  });
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const checks = [];

  const node22 = runBash('source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && node -v');
  checks.push({
    name: 'node22_runtime',
    ok: node22.status === 0,
    output: `${node22.stdout || ''}${node22.stderr || ''}`.trim().slice(0, 500),
  });

  const cli = runBash('source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && command -v openclaw');
  checks.push({
    name: 'openclaw_cli_available',
    ok: cli.status === 0,
    output: `${cli.stdout || ''}${cli.stderr || ''}`.trim().slice(0, 500),
  });

  const authCommand =
    `source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && ` +
    `openclaw agent --agent main --message ${JSON.stringify(`Reply with exactly: ${CONTRACT_TOKEN}`)} --thinking low --timeout ${TIMEOUT_SECONDS} --json`;
  const auth = runBash(authCommand);
  const authOutput = `${auth.stdout || ''}${auth.stderr || ''}`.trim();
  const parsedAuth = extractEnvelopeText(authOutput);
  checks.push({
    name: 'openclaw_auth_contract',
    ok: auth.status === 0 && parsedAuth.text === CONTRACT_TOKEN,
    output: authOutput.slice(0, 500),
    parsedToken: parsedAuth.text.slice(0, 80),
    responseShape: parsedAuth.shape,
  });

  const failing = checks.filter((c) => !c.ok).map((c) => c.name);
  const payload = {
    generatedAt: new Date().toISOString(),
    status: failing.length === 0 ? 'ok' : 'warning',
    failingChecks: failing,
    checks,
    recommendations:
      failing.length === 0
        ? ['Openclaw auth/runtime path is healthy.']
        : [
            'Ensure Node 22 and Openclaw CLI are available in runtime environment.',
            'Re-authenticate Openclaw/OpenRouter if auth contract checks fail.',
            'Run npm run openclaw:autonomous-once after remediation.',
          ],
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Openclaw auth/runtime diagnostic report: ${REPORT_PATH}`);

  if (failing.length > 0) {
    process.exitCode = 1;
  }
}

main();
