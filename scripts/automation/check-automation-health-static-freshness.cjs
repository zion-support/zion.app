#!/usr/bin/env node
/**
 * Guard static automation-health API freshness.
 *
 * Reads:
 *   public/api/automation-health.json
 *
 * Writes:
 *   automation/reports/automation-health-static-freshness-latest.json
 *   GITHUB_OUTPUT: static_health_fresh=true|false
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const HEALTH_JSON = path.join(ROOT, 'public', 'api', 'automation-health.json');
const REPORT = path.join(ROOT, 'automation', 'reports', 'automation-health-static-freshness-latest.json');
const MAX_HOURS = Math.max(1, Number(process.env.AUTOMATION_HEALTH_STATIC_MAX_HOURS || 36));

function appendGithubOutput(key, value) {
  const p = process.env.GITHUB_OUTPUT;
  if (!p) return;
  fs.appendFileSync(p, `${key}=${value}\n`);
}

function main() {
  const now = Date.now();
  let generatedAt = null;
  let ageHours = null;
  let fresh = false;
  let reason = '';

  if (!fs.existsSync(HEALTH_JSON)) {
    reason = 'public/api/automation-health.json missing';
  } else {
    try {
      const json = JSON.parse(fs.readFileSync(HEALTH_JSON, 'utf8'));
      generatedAt = typeof json.generatedAt === 'string' ? json.generatedAt : null;
      const ts = generatedAt ? new Date(generatedAt).getTime() : NaN;
      if (!Number.isFinite(ts)) {
        reason = 'generatedAt missing or invalid';
      } else {
        ageHours = (now - ts) / 3600000;
        fresh = ageHours <= MAX_HOURS;
        reason = fresh ? 'within freshness threshold' : `stale: ${ageHours.toFixed(1)}h > ${MAX_HOURS}h`;
      }
    } catch (e) {
      reason = `invalid JSON: ${e.message}`;
    }
  }

  const report = {
    generatedAt: new Date(now).toISOString(),
    path: HEALTH_JSON,
    healthGeneratedAt: generatedAt,
    ageHours: ageHours == null ? null : Math.round(ageHours * 10) / 10,
    maxHours: MAX_HOURS,
    fresh,
    reason,
  };

  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  appendGithubOutput('static_health_fresh', fresh ? 'true' : 'false');
  console.log(`automation-health static freshness: ${fresh ? 'fresh' : 'stale'} — ${reason}`);
}

main();
