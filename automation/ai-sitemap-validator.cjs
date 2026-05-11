#!/usr/bin/env node

/**
 * AI Sitemap Validator
 * Validates that all App Router pages are included in the sitemap,
 * checks for orphan URLs, and verifies sitemap structure.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class AISitemapValidator {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'sitemap-validator.log');
    this.reportFile = path.join(__dirname, 'reports', 'sitemap-report.json');
    this.appDir = path.join(process.cwd(), 'app');
    this.pagesDir = path.join(process.cwd(), 'pages');
    this.baseUrl = 'https://ziontechgroup.com';
    this.ensureDirectories();
  }

  ensureDirectories() {
    for (const dir of [path.dirname(this.logFile), path.dirname(this.reportFile)]) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const ts = new Date().toISOString();
    const entry = `[${ts}] [${level}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, entry);
  }

  discoverRoutes() {
    const routes = [];
    const scanApp = (dir, prefix = '') => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('_') || entry.name.startsWith('.') || entry.name.startsWith('[')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (prefix === '' && entry.name === 'api') continue;
          scanApp(fullPath, `${prefix}/${entry.name}`);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
          routes.push(prefix || '/');
        }
      }
    };
    const scanPages = (dir, prefix = '') => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'api') continue;
          scanPages(fullPath, `${prefix}/${entry.name}`);
        } else {
          if (entry.name.startsWith('_')) continue;
          if (!/\.(tsx|ts|js|jsx)$/.test(entry.name)) continue;
          const base = entry.name.replace(/\.(tsx|ts|js|jsx)$/, '');
          if (base.startsWith('[')) continue;
          routes.push(base === 'index' ? prefix || '/' : `${prefix}/${base}`);
        }
      }
    };
    scanApp(this.appDir);
    scanPages(this.pagesDir);
    const normalized = routes
      .map((r) => r.replace(/\/$/, '') || '/')
      .filter((r) => !['/404', '/_not-found', '/SimpleErrorBoundary', '/500'].includes(r));
    return [...new Set(normalized)].sort();
  }

  fetchSitemap() {
    return new Promise((resolve) => {
      const url = `${this.baseUrl}/sitemap.xml`;
      https.get(url, { timeout: 15000 }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ ok: true, content: body });
          } else {
            resolve({ ok: false, statusCode: res.statusCode });
          }
        });
      }).on('error', (err) => {
        resolve({ ok: false, error: err.message });
      });
    });
  }

  parseSitemapUrls(xml) {
    const urls = [];
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  }

  async validate() {
    this.log('=== Sitemap Validation Started ===');

    const appRoutes = this.discoverRoutes();
    this.log(`Discovered ${appRoutes.length} routes from app/ directory`);

    const sitemapResult = await this.fetchSitemap();
    if (!sitemapResult.ok) {
      this.log(`Could not fetch sitemap: ${sitemapResult.error || `HTTP ${sitemapResult.statusCode}`}`, 'WARNING');
    }

    let sitemapUrls = [];
    if (sitemapResult.ok) {
      sitemapUrls = this.parseSitemapUrls(sitemapResult.content);
      this.log(`Found ${sitemapUrls.length} URLs in sitemap`);
    }

    const sitemapPaths = sitemapUrls.map((url) => {
      try {
        const u = new URL(url);
        return u.pathname.replace(/\/$/, '') || '/';
      } catch {
        return url;
      }
    });

    const normalizedRoutes = appRoutes.map((r) => r.replace(/\/$/, '') || '/');

    const missingFromSitemap = normalizedRoutes.filter((r) => {
      return !sitemapPaths.some((sp) => sp === r || sp === `${r}/`);
    });

    const orphanInSitemap = sitemapPaths.filter((sp) => {
      return !normalizedRoutes.some((r) => r === sp || `${r}/` === sp);
    });

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        appRoutes: appRoutes.length,
        sitemapUrls: sitemapUrls.length,
        missingFromSitemap: missingFromSitemap.length,
        orphanInSitemap: orphanInSitemap.length,
        coverage: appRoutes.length > 0
          ? Math.round(((appRoutes.length - missingFromSitemap.length) / appRoutes.length) * 100)
          : 0,
      },
      missingFromSitemap,
      orphanInSitemap,
      allRoutes: normalizedRoutes,
    };

    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.log(`Coverage: ${report.summary.coverage}%`);
    if (missingFromSitemap.length > 0) {
      this.log(`${missingFromSitemap.length} routes missing from sitemap:`, 'WARNING');
      missingFromSitemap.slice(0, 20).forEach((r) => this.log(`  - ${r}`, 'WARNING'));
      if (missingFromSitemap.length > 20) this.log(`  ... and ${missingFromSitemap.length - 20} more`, 'WARNING');
    }
    if (orphanInSitemap.length > 0) {
      this.log(`${orphanInSitemap.length} orphan URLs in sitemap (no matching route):`, 'WARNING');
      orphanInSitemap.slice(0, 10).forEach((r) => this.log(`  - ${r}`, 'WARNING'));
    }

    this.log('=== Sitemap Validation Complete ===');
    return report;
  }

  async startContinuousValidation() {
    const intervalMs = parseInt(process.env.SITEMAP_CHECK_INTERVAL_MS) || 43200000;
    this.log(`Starting continuous sitemap validation (interval: ${intervalMs}ms)`);
    await this.validate();
    setInterval(async () => {
      try { await this.validate(); }
      catch (err) { this.log(`Validation error: ${err.message}`, 'ERROR'); }
    }, intervalMs);
  }
}

if (require.main === module) {
  const validator = new AISitemapValidator();
  const cmd = process.argv[2] || 'start';
  const strict = process.env.SITEMAP_VALIDATE_STRICT === '1';

  switch (cmd) {
    case 'start':
      validator.startContinuousValidation();
      break;
    case 'validate':
      validator.validate().then((report) => {
        console.log(`\nCoverage: ${report.summary.coverage}% | Missing: ${report.summary.missingFromSitemap}`);
        process.exit(strict && report.summary.missingFromSitemap > 0 ? 1 : 0);
      });
      break;
    case 'routes':
      console.log(JSON.stringify(validator.discoverRoutes(), null, 2));
      break;
    default:
      console.log('Commands: start | validate | routes');
  }
}

module.exports = AISitemapValidator;
