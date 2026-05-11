#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Reads app-route-sitemap-drift-latest.json; opens/updates deduped issue when
 * sitemap fetch fails or inAppNotSitemap count >= ROUTE_DRIFT_ISSUE_THRESHOLD (default 5).
 * Env: GH_TOKEN, ROUTE_DRIFT_ISSUE_THRESHOLD, ISSUE_FINGERPRINT (default route-sitemap-drift)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'automation', 'reports', 'app-route-sitemap-drift-latest.json');
const THRESH = Math.max(1, Number.parseInt(process.env.ROUTE_DRIFT_ISSUE_THRESHOLD || '5', 10));
const FP = process.env.ISSUE_FINGERPRINT || 'route-sitemap-drift';

function main() {
  if (!fs.existsSync(REPORT)) {
    console.log('[route-sitemap-drift-escalate] No report file; skip.');
    process.exit(0);
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  } catch {
    console.warn('[route-sitemap-drift-escalate] Invalid JSON; skip.');
    process.exit(0);
  }
  const err = data.sitemapError;
  const count = data.counts && typeof data.counts.inAppNotSitemap === 'number' ? data.counts.inAppNotSitemap : 0;
  const escalate = Boolean(err) || count >= THRESH;
  if (!escalate) {
    console.log(`[route-sitemap-drift-escalate] OK (inAppNotSitemap=${count}, threshold=${THRESH}); no issue.`);
    process.exit(0);
  }

  const bodyFile = path.join(ROOT, 'route-sitemap-drift-body.md');
  const lines = [];
  lines.push('## Route vs production sitemap drift');
  lines.push('');
  lines.push(`- **Dedupe key:** \`${FP}\``);
  lines.push(`- **Threshold:** ${THRESH} (in-app routes missing from sitemap)`);
  lines.push(`- **Sitemap URL:** ${data.sitemapUrl || '(env)'}`);
  if (err) lines.push(`- **Sitemap fetch error:** \`${err}\``);
  lines.push(`- **inAppNotSitemap count:** ${count}`);
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(data, null, 2).slice(0, 12000));
  lines.push('```');
  fs.writeFileSync(bodyFile, lines.join('\n'));

  process.env.ISSUE_TITLE = process.env.ISSUE_TITLE || 'Route vs sitemap drift threshold exceeded';
  process.env.ISSUE_BODY_FILE = bodyFile;
  process.env.ISSUE_FINGERPRINT = FP;
  process.env.ISSUE_LABELS = process.env.ISSUE_LABELS || 'bug,automation';

  const script = path.join(ROOT, 'scripts', 'automation', 'gh-issue-dedupe-or-create.cjs');
  const r = spawnSync(process.execPath, [script], { stdio: 'inherit', cwd: ROOT, env: process.env });
  if (r.status !== 0) console.warn('[route-sitemap-drift-escalate] gh-issue-dedupe exited non-zero (non-fatal).');
  process.exit(0);
}

main();
