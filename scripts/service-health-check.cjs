#!/usr/bin/env node
/**
 * Service Health Checker — autonomous monitoring for all service pages
 * Scans servicesData.ts, probes each page (HEAD requests), records metrics
 * Outputs JSON report to automation/reports/health-<date>.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const REPORT_DIR = path.join(process.cwd(), 'automation', 'reports');
const SERVICES_FILE = path.join(process.cwd(), 'app', 'data', 'servicesData.ts');

fs.mkdirSync(REPORT_DIR, { recursive: true });

function parseServices() {
  const content = fs.readFileSync(SERVICES_FILE, 'utf8');
  const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
  const titleMatches = [...content.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);

  return idMatches.map((id, idx) => ({
    id,
    title: titleMatches[idx] || `Service-${id}`,
    url: `${BASE_URL}/ai-services/${id}`
  }));
}

function checkUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.request(url, { method: 'HEAD', timeout }, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400, responseTime: Date.now() - start });
    });
    req.on('error', (err) => resolve({ status: 0, ok: false, error: err.message, responseTime: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, ok: false, error: 'timeout', responseTime: timeout }); });
    req.end();
  });
}

async function runHealthCheck() {
  console.log(`🔍 Health check started at ${new Date().toISOString()}`);
  const services = parseServices();
  console.log(`📦 Loaded ${services.length} services`);

  const results = [];
  let up = 0, down = 0;

  for (const svc of services) {
    try {
      const result = await checkUrl(svc.url, 8000);
      if (result.ok) up++;
      else down++;

      results.push({
        id: svc.id, title: svc.title, url: svc.url,
        status: result.status, ok: result.ok,
        responseTimeMs: result.responseTime,
        error: result.error || null,
        checkedAt: new Date().toISOString()
      });
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      down++;
      results.push({ id: svc.id, title: svc.title, url: svc.url, status: 0, ok: false, error: e.message, responseTimeMs: 0, checkedAt: new Date().toISOString() });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    total: services.length,
    healthy: up, unhealthy: down, errors: down,
    uptimePercent: ((up / services.length) * 100).toFixed(2),
    avgResponseTimeMs: Math.round(results.reduce((a, b) => a + (b.responseTimeMs || 0), 0) / results.length),
    results
  };

  const dateStamp = new Date().toISOString().slice(0, 10);
  const outPath = path.join(REPORT_DIR, `health-${dateStamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`✅ Report: ${outPath}`);
  console.log(`📊 Uptime: ${report.uptimePercent}% | Avg: ${report.avgResponseTimeMs}ms | Up: ${up} | Down: ${down}`);
  return report;
}

runHealthCheck().catch(err => { console.error('❌ Failed:', err); process.exit(1); });
