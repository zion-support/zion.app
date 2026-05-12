#!/usr/bin/env node
/**
 * Log Rotation & Storage Cost Optimizer
 * Prunes old logs, reports, artifacts; manages GitHub Actions artifact retention
 * Dry-run by default; safe deletion with configurable policies
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const STATE_DIR = path.join(ROOT, '.hermes', 'memory', 'log-retention');
const LOG_FILE = path.join(STATE_DIR, 'retention-manager.log');
const REPORT_FILE = path.join(STATE_DIR, 'latest-report.json');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '8435383377';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Retention policies (days)
const RETENTION = {
  dailyLogs: 30,        // automation/reports/*.log, daily JSONL
  weeklyReports: 90,    // automation/reports/*.json (compressed or weekly aggregates)
  monthlyArchives: 365, // yearly snapshots, old artifact backups
  historyFiles: 90,     // .hermes/memory/*/history.json
  artifacts: 30,        // GitHub Actions artifacts (via API)
};

// Override via env
const envRetention = process.env.RETENTION_DAYS_DAILY ? parseInt(process.env.RETENTION_DAYS_DAILY) : null;
if (envRetention) RETENTION.dailyLogs = envRetention;
const envArtifacts = process.env.RETENTION_DAYS_ARTIFACTS ? parseInt(process.env.RETENTION_DAYS_ARTIFACTS) : null;
if (envArtifacts) RETENTION.artifacts = envArtifacts;

const DRY_RUN = process.env.RETENTION_DRY_RUN !== 'false'; // default true
const MIN_FREE_SPACE_GB = 20; // skip deletion if free space > threshold
const SAFETY_AGE_H = 24; // never delete files modified < 24h ago

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function humanBytes(bytes) {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(2) + ' TB';
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
  return bytes + ' B';
}

function getDirSize(dir) {
  let size = 0;
  try {
    const files = execSync(`find ${dir} -type f -not -path '*/node_modules/*' 2>/dev/null || true`, { shell: true }).toString().trim().split('\n').filter(Boolean);
    for (const f of files) {
      try { size += fs.statSync(f).size; } catch (e) {}
    }
  } catch (e) {}
  return size;
}

function listFiles(dir, pattern = '*') {
  try {
    const cmd = `find ${dir} -type f -name "${pattern}" -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null || true`;
    return execSync(cmd, { shell: true }).toString().trim().split('\n').filter(Boolean);
  } catch { return []; }
}

function isOlderThanDays(filePath, days) {
  try {
    const mtime = fs.statSync(filePath).mtime;
    const ageMs = Date.now() - mtime.getTime();
    return ageMs > days * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

function deleteFile(file) {
  if (DRY_RUN) return false;
  try {
    fs.unlinkSync(file);
    return true;
  } catch (e) {
    log(`⚠️ Failed to delete ${file}: ${e.message}`);
    return false;
  }
}

function cleanupDirectory(dir, ageDays, pattern = '*') {
  const files = listFiles(dir, pattern);
  let deleted = 0;
  let bytesFreed = 0;

  for (const file of files) {
    // Protect retention manager's own state files
    try {
      const rel = path.relative(STATE_DIR, file);
      if (!rel.startsWith('..') && !rel.startsWith(path.sep)) {
        // file is inside STATE_DIR — never delete
        continue;
      }
    } catch {}

    // Never delete latest report snapshots (current state)
    const basename = path.basename(file);
    if (basename === 'latest-report.json' || basename.endsWith('-latest.json')) {
      continue;
    }

    // Safety: skip if modified recently
    if (!isOlderThanDays(file, SAFETY_AGE_H / 24)) continue; // skip <24h old
    if (!isOlderThanDays(file, ageDays)) continue; // keep within retention

    const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
    if (deleteFile(file)) {
      deleted++;
      bytesFreed += size;
      log(`🗑️ Deleted ${file} (${humanBytes(size)})`);
    }
  }

  return { deleted, bytesFreed };
}

async function cleanupGitHubArtifacts() {
  if (!GITHUB_TOKEN) {
    log('⚠️ GITHUB_TOKEN missing; skipping artifact cleanup');
    return { deleted: 0, bytesFreed: 0 };
  }

  // List artifacts for this repo via GitHub API
  // We'll use gh CLI if available, else REST API
  try {
    const repo = 'Zion-support/zion.app';
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION.artifacts);

    // Get all workflow runs (paginated)
    const runs = [];
    let page = 1;
    while (true) {
      const cmd = `gh api repos/${repo}/actions/runs -X GET -F per_page=100 -F page=${page} 2>/dev/null`;
      try {
        const out = execSync(cmd, { stdio: 'pipe' }).toString();
        const data = JSON.parse(out);
        if (!data.workflow_runs || data.workflow_runs.length === 0) break;
        runs.push(...data.workflow_runs);
        if (data.workflow_runs.length < 100) break;
        page++;
      } catch (e) {
        break;
      }
    }

    log(`📦 Found ${runs.length} workflow runs to check`);

    let deleted = 0;
    let bytesFreed = 0;

    for (const run of runs) {
      const runDate = new Date(run.created_at);
      if (runDate > cutoffDate) continue; // too recent

      // List artifacts for this run
      const artifactsJson = execSync(`gh api repos/${repo}/actions/runs/${run.id}/artifacts -X GET 2>/dev/null`, { stdio: 'pipe' }).toString();
      const artifacts = JSON.parse(artifactsJson);
      if (!artifacts.artifacts) continue;

      for (const art of artifacts.artifacts) {
        const artCreated = new Date(art.created_at);
        if (artCreated > cutoffDate) continue;

        // Delete artifact
        if (!DRY_RUN) {
          execSync(`gh api repos/${repo}/actions/artifacts/${art.id} -X DELETE 2>/dev/null`, { stdio: 'pipe' }).toString();
        }
        deleted++;
        bytesFreed += art.size_in_bytes || 0;
        log(`🗑️ Deleted artifact ${art.id} from run ${run.id} (${humanBytes(art.size_in_bytes)})`);
      }
    }

    return { deleted, bytesFreed };
  } catch (e) {
    log('⚠️ GitHub artifact cleanup failed: ' + e.message);
    return { deleted: 0, bytesFreed: 0 };
  }
}

async function sendTelegram(report) {
  const https = require('https');
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  let text = `🧹 *Log Retention & Storage Cleanup* — ${now}\n\n`;

  if (report.dryRun) {
    text += '⚠️ **Dry-run mode** — no files deleted. Set `RETENTION_DRY_RUN=false` to enable.\n\n';
  }

  text += `📊 Space freed: ${humanBytes(report.totalBytesFreed)}\n`;
  text += `🗑️ Files removed: ${report.totalDeleted}\n\n`;

  if (report.details.length > 0) {
    text += 'Top categories:\n';
    const grouped = {};
    for (const d of report.details) {
      if (!grouped[d.category]) grouped[d.category] = { files: 0, bytes: 0 };
      grouped[d.category].files += d.deleted;
      grouped[d.category].bytes += d.bytesFreed;
    }
    Object.entries(grouped).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 5).forEach(([cat, stats]) => {
      text += `• ${cat}: ${stats.files} files (${humanBytes(stats.bytes)})\n`;
    });
  }

  text += `\nNext cleanup: daily at 02:00 UTC`;
  text += `\nDetails: .hermes/memory/log-retention/latest-report.json`;

  const payload = new URLSearchParams({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });

  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': payload.byteLength },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => (res.statusCode === 200 ? resolve() : reject(new Error(`HTTP ${res.statusCode}: ${body}`))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
  log('✅ Telegram alert sent');
}

async function main() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  log('🧹 Starting Log Retention & Storage Cleanup...');
  log(`   Mode: ${DRY_RUN ? 'DRY-RUN (no deletion)' : 'LIVE (deleting old files)'}`);
  log(`   Policies: daily=${RETENTION.dailyLogs}d, weekly=${RETENTION.weeklyReports}d, monthly=${RETENTION.monthlyArchives}d, artifacts=${RETENTION.artifacts}d`);

  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    details: [],
    totalDeleted: 0,
    totalBytesFreed: 0,
  };

  // 1. Check free space (skip if plenty)
  try {
    const stat = fs.statfsSync(ROOT);
    const freeGB = (stat.bfree * stat.bsize) / 1e9;
    if (freeGB > MIN_FREE_SPACE_GB) {
      log(`✅ Skipping cleanup — free space ${freeGB.toFixed(1)}GB > ${MIN_FREE_SPACE_GB}GB threshold`);
      report.skippedFreeSpace = true;
    } else {
      // 2. Cleanup directories
      const categories = [
        { dir: path.join(ROOT, 'automation', 'reports'), age: RETENTION.dailyLogs, pattern: '*.log', category: 'logs' },
        { dir: path.join(ROOT, 'automation', 'reports'), age: RETENTION.dailyLogs, pattern: '*.jsonl', category: 'logs' },
        { dir: path.join(ROOT, '.hermes', 'memory'), age: RETENTION.historyFiles, pattern: '*.json', category: 'history' },
        { dir: path.join(ROOT, '.hermes', 'memory'), age: RETENTION.dailyLogs, pattern: '*.log', category: 'logs' },
      ];

      for (const cat of categories) {
        if (!fs.existsSync(cat.dir)) continue;
        const result = cleanupDirectory(cat.dir, cat.age, cat.pattern);
        report.details.push({ category: cat.category, ...result });
        report.totalDeleted += result.deleted;
        report.totalBytesFreed += result.bytesFreed;
      }

      // 3. GitHub Artifact cleanup
      log('📦 Checking GitHub Actions artifacts...');
      const artResult = await cleanupGitHubArtifacts();
      report.details.push({ category: 'github-artifacts', ...artResult });
      report.totalDeleted += artResult.deleted;
      report.totalBytesFreed += artResult.bytesFreed;
    }
  } catch (e) {
    log('⚠️ Error during cleanup: ' + e.message);
  }

  // 4. Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`✅ Cleanup complete — freed ${humanBytes(report.totalBytesFreed)}`);

  // 5. Alert
  if (TELEGRAM_TOKEN && (report.totalDeleted > 0 || report.dryRun)) {
    await sendTelegram(report);
  }
}

main().catch(err => {
  console.error('❌ Retention manager failed:', err);
  process.exit(1);
});
