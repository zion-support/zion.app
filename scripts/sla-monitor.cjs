#!/usr/bin/env node
/**
 * AI SLA Monitor
 * Checks endpoint response times against SLA thresholds.
 */
const { execSync } = require('child_process');
const fs = require('fs');

const SLA_MS = process.env.SLA_MS || 2000; // 2 seconds default
const ENDPOINT = process.env.SLA_ENDPOINT || 'https://ziontechgroup.com';

console.log(`🔍 Checking SLA for ${ENDPOINT} (threshold: ${SLA_MS}ms)...`);

try {
  const start = Date.now();
  const output = execSync(`curl -o /dev/null -s -w "%{http_code} %{time_total}" ${ENDPOINT}`, { encoding: 'utf8' });
  const duration = Date.now() - start;
  const [statusCode, timeTotal] = output.trim().split(' ');
  const timeMs = Math.round(parseFloat(timeTotal) * 1000);

  console.log(`HTTP ${statusCode}, Time: ${timeMs}ms`);

  if (statusCode !== '200') {
    console.error(`⚠️ Endpoint returned non-200 status: ${statusCode}`);
    createIssue(`SLA Breach: Non-200 status ${statusCode}`, `Endpoint ${ENDPOINT} returned ${statusCode}.`);
    process.exit(1);
  }

  if (timeMs > SLA_MS) {
    console.error(`⚠️ SLA Breach: ${timeMs}ms > ${SLA_MS}ms`);
    createIssue(`SLA Breach: Response time ${timeMs}ms`, `Endpoint ${ENDPOINT} took ${timeMs}ms, exceeding SLA of ${SLA_MS}ms.`);
    process.exit(1);
  }

  console.log(`✅ SLA OK: ${timeMs}ms <= ${SLA_MS}ms`);
} catch (err) {
  console.error('SLA check failed:', err.message);
  createIssue('SLA Check Failed', `Error checking SLA: ${err.message}`);
  process.exit(1);
}

function createIssue(title, body) {
  try {
    execSync(`gh issue create --title "${title}" --body "${body}" --label "sla,performance"`, { stdio: 'inherit' });
  } catch (e) {
    console.log('Could not create GitHub issue');
  }
}
