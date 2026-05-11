/**
 * Contract tests for openclaw-approved-action-runner.cjs (fixture mode).
 */
const { mkdtempSync, writeFileSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const RUNNER = path.join(__dirname, '..', 'automation', 'openclaw-approved-action-runner.cjs');

function runFixture(dir, extraEnv = {}) {
  return execFileSync(process.execPath, [RUNNER], {
    encoding: 'utf8',
    env: { ...process.env, OPENCLAW_RUNNER_FIXTURE_DIR: dir, ...extraEnv },
  });
}

function readTelemetry(dir) {
  const fs = require('fs');
  const p = path.join(dir, 'openclaw-runner-latest.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

describe('openclaw-approved-action-runner fixtures', () => {
  let dir;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'oc-runner-'));
  });

  afterEach(() => {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it('exits 0 with empty queue and writes telemetry', () => {
    writeFileSync(
      path.join(dir, 'openclaw-action-approved-queue-latest.json'),
      JSON.stringify({ queue: [] }),
    );
    runFixture(dir);
    const tel = readTelemetry(dir);
    expect(tel.exitCode).toBe(0);
    expect(tel.reason).toBe('empty_queue');
  });

  it('exits 1 when id not in policy.approvedIds', () => {
    writeFileSync(
      path.join(dir, 'openclaw-action-approved-queue-latest.json'),
      JSON.stringify({
        queue: [{ id: 'x1', recommendedCommand: 'npm run lint:check' }],
      }),
    );
    writeFileSync(
      path.join(dir, 'openclaw-action-policy-latest.json'),
      JSON.stringify({ approvedIds: ['other'], denied: [] }),
    );
    expect(() => runFixture(dir)).toThrow();
    const tel = readTelemetry(dir);
    expect(tel.exitCode).toBe(1);
    expect(tel.reason).toBe('id_not_in_approvedIds');
  });

  it('dry-run succeeds when id is approved', () => {
    writeFileSync(
      path.join(dir, 'openclaw-action-approved-queue-latest.json'),
      JSON.stringify({
        queue: [{ id: 'quality-abc', recommendedCommand: 'npm run lint:check' }],
      }),
    );
    writeFileSync(
      path.join(dir, 'openclaw-action-policy-latest.json'),
      JSON.stringify({ approvedIds: ['quality-abc'], denied: [] }),
    );
    runFixture(dir);
    const tel = readTelemetry(dir);
    expect(tel.exitCode).toBe(0);
    expect(tel.reason).toBe('dry_run_complete');
    expect(tel.dryRunPlanned.length).toBe(1);
  });
});
