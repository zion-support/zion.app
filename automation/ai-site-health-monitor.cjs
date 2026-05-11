#!/usr/bin/env node

/**
 * AI Site Health Monitor
 * Monitors uptime, SSL certificate expiry, response times, and page availability
 * for https://ziontechgroup.com
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class AISiteHealthMonitor {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'site-health-monitor.log');
    this.reportFile = path.join(__dirname, 'reports', 'site-health-report.json');
    this.dataDir = path.join(__dirname, 'data');
    this.historyFile = path.join(this.dataDir, 'health-history.json');
    this.baseUrl = 'ziontechgroup.com';
    this.ensureDirectories();
    this.history = this.loadHistory();

    this.criticalPages = [
      '/',
      '/solutions/',
      '/about/',
      '/contact/',
      '/case-studies/',
      '/blog/',
      '/pricing/',
      '/privacy/',
      '/terms/',
      '/consultation/',
    ];
  }

  ensureDirectories() {
    for (const dir of [path.dirname(this.logFile), path.dirname(this.reportFile), this.dataDir]) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const ts = new Date().toISOString();
    const entry = `[${ts}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, entry);
  }

  loadHistory() {
    if (fs.existsSync(this.historyFile)) {
      try { return JSON.parse(fs.readFileSync(this.historyFile, 'utf8')); }
      catch { return { checks: [], alerts: [] }; }
    }
    return { checks: [], alerts: [] };
  }

  saveHistory() {
    const maxEntries = 1000;
    this.history.checks = this.history.checks.slice(-maxEntries);
    this.history.alerts = this.history.alerts.slice(-maxEntries);
    fs.writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
  }

  checkPage(pagePath) {
    return new Promise((resolve) => {
      const start = Date.now();
      const url = `https://${this.baseUrl}${pagePath}`;

      const req = https.get(url, { timeout: 15000 }, (res) => {
        const duration = Date.now() - start;
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve({
            url,
            path: pagePath,
            statusCode: res.statusCode,
            responseTime: duration,
            contentLength: body.length,
            headers: {
              contentType: res.headers['content-type'],
              cacheControl: res.headers['cache-control'],
              server: res.headers['server'],
            },
            ok: res.statusCode >= 200 && res.statusCode < 400,
            timestamp: new Date().toISOString(),
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          url,
          path: pagePath,
          statusCode: 0,
          responseTime: Date.now() - start,
          error: err.message,
          ok: false,
          timestamp: new Date().toISOString(),
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          path: pagePath,
          statusCode: 0,
          responseTime: Date.now() - start,
          error: 'Request timed out',
          ok: false,
          timestamp: new Date().toISOString(),
        });
      });
    });
  }

  checkSSL() {
    return new Promise((resolve) => {
      const req = https.get(`https://${this.baseUrl}`, { timeout: 10000 }, (res) => {
        const cert = res.socket.getPeerCertificate();
        if (cert && cert.valid_to) {
          const expiryDate = new Date(cert.valid_to);
          const daysUntilExpiry = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
          resolve({
            valid: true,
            issuer: cert.issuer ? cert.issuer.O : 'Unknown',
            expiryDate: expiryDate.toISOString(),
            daysUntilExpiry,
            subject: cert.subject ? cert.subject.CN : 'Unknown',
          });
        } else {
          resolve({ valid: false, error: 'No certificate found' });
        }
      });
      req.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ valid: false, error: 'Connection timed out' });
      });
    });
  }

  async runHealthCheck() {
    this.log('=== Site Health Check Started ===');
    const startTime = Date.now();

    const ssl = await this.checkSSL();
    this.log(`SSL: ${ssl.valid ? 'Valid' : 'INVALID'} | Expires in ${ssl.daysUntilExpiry ?? 'N/A'} days`);

    if (ssl.valid && ssl.daysUntilExpiry < 30) {
      this.addAlert('SSL_EXPIRY_WARNING', `SSL certificate expires in ${ssl.daysUntilExpiry} days`);
    }

    const pageResults = [];
    for (const page of this.criticalPages) {
      const result = await this.checkPage(page);
      pageResults.push(result);
      const status = result.ok ? 'OK' : 'FAIL';
      this.log(`${status} ${result.path} - ${result.statusCode} (${result.responseTime}ms)`);

      if (!result.ok) {
        this.addAlert('PAGE_DOWN', `${result.path} returned ${result.statusCode || result.error}`);
      } else if (result.responseTime > 5000) {
        this.addAlert('SLOW_RESPONSE', `${result.path} took ${result.responseTime}ms`);
      }
    }

    const totalTime = Date.now() - startTime;
    const okCount = pageResults.filter((r) => r.ok).length;
    const avgResponseTime = Math.round(
      pageResults.reduce((sum, r) => sum + r.responseTime, 0) / pageResults.length,
    );

    const report = {
      timestamp: new Date().toISOString(),
      duration: totalTime,
      ssl,
      pages: {
        total: pageResults.length,
        ok: okCount,
        failed: pageResults.length - okCount,
        avgResponseTime,
        results: pageResults,
      },
      uptime: okCount === pageResults.length ? 100 : Math.round((okCount / pageResults.length) * 100),
    };

    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.history.checks.push({
      timestamp: report.timestamp,
      uptime: report.uptime,
      avgResponseTime,
      pagesOk: okCount,
      pagesTotal: pageResults.length,
      sslDaysLeft: ssl.daysUntilExpiry,
    });
    this.saveHistory();

    this.log(`=== Health Check Complete | Uptime: ${report.uptime}% | Avg: ${avgResponseTime}ms | ${totalTime}ms total ===`);
    return report;
  }

  addAlert(type, message) {
    this.log(`ALERT [${type}]: ${message}`, 'WARNING');
    this.history.alerts.push({
      type,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  async startContinuousMonitoring() {
    const intervalMs = parseInt(process.env.HEALTH_CHECK_INTERVAL_MS) || 600000;
    this.log(`Starting continuous monitoring (interval: ${intervalMs}ms)`);

    await this.runHealthCheck();

    setInterval(async () => {
      try {
        await this.runHealthCheck();
      } catch (err) {
        this.log(`Health check error: ${err.message}`, 'ERROR');
      }
    }, intervalMs);
  }
}

if (require.main === module) {
  const monitor = new AISiteHealthMonitor();
  const cmd = process.argv[2] || 'start';

  switch (cmd) {
    case 'start':
      monitor.startContinuousMonitoring();
      break;
    case 'check':
      monitor.runHealthCheck().then((report) => {
        console.log(`\nUptime: ${report.uptime}% | Avg response: ${report.pages.avgResponseTime}ms`);
        process.exit(report.uptime === 100 ? 0 : 1);
      });
      break;
    case 'ssl':
      monitor.checkSSL().then((ssl) => {
        console.log(JSON.stringify(ssl, null, 2));
        process.exit(ssl.valid ? 0 : 1);
      });
      break;
    default:
      console.log('Commands: start | check | ssl');
  }
}

module.exports = AISiteHealthMonitor;
