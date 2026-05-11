#!/usr/bin/env node

/**
 * AI Experiences Health Agent
 *
 * Lightweight production checker for flagship in-browser AI experiences:
 * - /ai-experiments
 * - /ai/solutions-configurator
 * - /ai/url-audit-assistant
 *
 * Uses a similar pattern to the AI Site Health Monitor and Daily Quick pipeline:
 * - Simple HTTPS checks against https://ziontechgroup.com
 * - Captures status code and response time
 * - Writes a JSON report under automation/reports
 *
 * Intended to run from GitHub Actions on a schedule and as a local sanity check.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, 'ai-experiences-health-latest.json');
const LOG_FILE = path.join(ROOT, 'automation', 'logs', 'ai-experiences-health.log');

const BASE_URL = 'ziontechgroup.com';

/** Key in-browser AI experiences to monitor in production */
const EXPERIENCES = [
  {
    id: 'ai-experiments',
    path: '/ai-experiments/',
    label: 'AI Experiments Hub',
  },
  {
    id: 'solutions-configurator',
    path: '/ai/solutions-configurator/',
    label: 'AI Solutions Configurator',
  },
  {
    id: 'url-audit-assistant',
    path: '/ai/url-audit-assistant/',
    label: 'AI URL Audit Assistant',
  },
];

function ensureDirs() {
  for (const dir of [REPORTS_DIR, path.dirname(LOG_FILE)]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

function log(message, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {
    // best-effort logging
  }
  console.log(line.trim());
}

function checkExperience(exp) {
  return new Promise((resolve) => {
    const start = Date.now();
    const url = `https://${BASE_URL}${exp.path}`;

    const req = https.get(
      url,
      {
        timeout: 15000,
        headers: {
          'User-Agent': 'ZionTechGroup-AI-Experiences-Health/1.0',
        },
      },
      (res) => {
        const duration = Date.now() - start;
        // We don't need the full body, just basic health, so end early.
        res.resume();
        resolve({
          id: exp.id,
          label: exp.label,
          url,
          statusCode: res.statusCode,
          responseTimeMs: duration,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          timestamp: new Date().toISOString(),
        });
      }
    );

    req.on('error', (err) => {
      const duration = Date.now() - start;
      resolve({
        id: exp.id,
        label: exp.label,
        url,
        statusCode: 0,
        responseTimeMs: duration,
        ok: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const duration = Date.now() - start;
      resolve({
        id: exp.id,
        label: exp.label,
        url,
        statusCode: 0,
        responseTimeMs: duration,
        ok: false,
        error: 'Request timed out',
        timestamp: new Date().toISOString(),
      });
    });
  });
}

async function main() {
  ensureDirs();
  log('=== AI Experiences Health Check Started ===');

  const startedAt = new Date().toISOString();
  const results = [];

  for (const exp of EXPERIENCES) {
    const r = await checkExperience(exp);
    results.push(r);
    if (r.ok) {
      log(
        `OK  | ${exp.label} (${exp.path}) -> ${r.statusCode} in ${r.responseTimeMs}ms`
      );
    } else {
      log(
        `FAIL| ${exp.label} (${exp.path}) -> status=${r.statusCode} error=${r.error ?? 'unknown'} in ${r.responseTimeMs}ms`,
        'WARN'
      );
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  const avgResponseTime =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.responseTimeMs || 0), 0) / results.length
        )
      : 0;

  const summary = {
    startedAt,
    finishedAt: new Date().toISOString(),
    baseUrl: `https://${BASE_URL}`,
    okCount,
    total: results.length,
    avgResponseTimeMs: avgResponseTime,
    experiences: results,
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(summary, null, 2));
  log(`Report written to ${REPORT_FILE}`);

  const anyFailures = results.some((r) => !r.ok);
  if (anyFailures) {
    log('One or more AI experiences failed health checks', 'WARN');
    process.exitCode = 1;
  } else {
    log('All AI experiences healthy');
  }
}

if (require.main === module) {
  main().catch((err) => {
    log(`Fatal error: ${err.message}`, 'ERROR');
    process.exit(1);
  });
}

