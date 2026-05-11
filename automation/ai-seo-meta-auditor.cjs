#!/usr/bin/env node

/**
 * AI SEO Meta Tag Auditor
 * Scans all App Router pages for missing or incomplete meta tags,
 * validates Open Graph data, and generates improvement reports.
 */

const fs = require('fs');
const path = require('path');

class AISEOMetaAuditor {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'seo-meta-auditor.log');
    this.reportFile = path.join(__dirname, 'reports', 'seo-meta-report.json');
    this.appDir = path.join(process.cwd(), 'app');
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

  scanPages() {
    const pages = [];
    const scan = (dir, routePrefix = '') => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(fullPath, `${routePrefix}/${entry.name}`);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.js') {
          pages.push({ route: routePrefix || '/', filePath: fullPath });
        }
      }
    };
    scan(this.appDir);
    return pages;
  }

  auditPage(pageInfo) {
    const content = fs.readFileSync(pageInfo.filePath, 'utf8');
    const issues = [];
    const meta = { title: null, description: null, ogTitle: null, ogDescription: null, ogUrl: null, twitterCard: null, keywords: null };

    const metadataMatch = content.match(/export\s+(?:const\s+)?metadata[\s:=]/);
    const generateMetadataMatch = content.match(/export\s+(?:async\s+)?function\s+generateMetadata/);
    const hasMetadata = !!(metadataMatch || generateMetadataMatch);

    if (!hasMetadata) {
      issues.push({ severity: 'error', message: 'No metadata export found', fix: 'Add export const metadata: Metadata = { ... }' });
      return { ...pageInfo, hasMetadata, meta, issues, score: 0 };
    }

    const titleMatch = content.match(/title\s*[:=]\s*['"`]([^'"`]+)['"`]/);
    if (titleMatch) {
      meta.title = titleMatch[1];
      if (meta.title.length < 20) issues.push({ severity: 'warning', message: `Title too short (${meta.title.length} chars, recommend 30-60)` });
      if (meta.title.length > 70) issues.push({ severity: 'warning', message: `Title too long (${meta.title.length} chars, recommend 30-60)` });
    } else {
      issues.push({ severity: 'error', message: 'Missing title in metadata' });
    }

    const descMatch = content.match(/description\s*[:=]\s*['"`]([^'"`]+)['"`]/);
    if (descMatch) {
      meta.description = descMatch[1];
      if (meta.description.length < 50) issues.push({ severity: 'warning', message: `Description too short (${meta.description.length} chars, recommend 120-160)` });
      if (meta.description.length > 170) issues.push({ severity: 'warning', message: `Description too long (${meta.description.length} chars, recommend 120-160)` });
    } else {
      issues.push({ severity: 'error', message: 'Missing description in metadata' });
    }

    if (content.includes('openGraph')) {
      const ogTitleMatch = content.match(/openGraph[\s\S]*?title\s*[:=]\s*['"`]([^'"`]+)['"`]/);
      if (ogTitleMatch) meta.ogTitle = ogTitleMatch[1];
      const ogDescMatch = content.match(/openGraph[\s\S]*?description\s*[:=]\s*['"`]([^'"`]+)['"`]/);
      if (ogDescMatch) meta.ogDescription = ogDescMatch[1];
    } else {
      issues.push({ severity: 'warning', message: 'Missing Open Graph metadata' });
    }

    if (!content.includes('twitter')) {
      issues.push({ severity: 'info', message: 'Missing Twitter card metadata' });
    }

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, 100 - errorCount * 25 - warningCount * 10);

    return { ...pageInfo, hasMetadata, meta, issues, score };
  }

  async runAudit() {
    this.log('=== SEO Meta Tag Audit Started ===');
    const pages = this.scanPages();
    this.log(`Found ${pages.length} pages to audit`);

    const results = pages.map((p) => this.auditPage(p));

    const totalScore = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
      : 0;
    const pagesWithErrors = results.filter((r) => r.issues.some((i) => i.severity === 'error'));
    const pagesWithWarnings = results.filter((r) => r.issues.some((i) => i.severity === 'warning'));

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: results.length,
        averageScore: totalScore,
        pagesWithErrors: pagesWithErrors.length,
        pagesWithWarnings: pagesWithWarnings.length,
        perfectPages: results.filter((r) => r.score === 100).length,
      },
      pages: results.map((r) => ({
        route: r.route,
        score: r.score,
        hasMetadata: r.hasMetadata,
        issues: r.issues,
      })),
    };

    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.log(`Average SEO score: ${totalScore}/100`);
    this.log(`Pages with errors: ${pagesWithErrors.length}/${results.length}`);
    this.log(`Pages with warnings: ${pagesWithWarnings.length}/${results.length}`);
    this.log(`Perfect pages: ${report.summary.perfectPages}/${results.length}`);

    for (const page of pagesWithErrors) {
      for (const issue of page.issues.filter((i) => i.severity === 'error')) {
        this.log(`ERROR ${page.route}: ${issue.message}`, 'WARNING');
      }
    }

    this.log('=== SEO Meta Tag Audit Complete ===');
    return report;
  }

  async startContinuousAudit() {
    const intervalMs = parseInt(process.env.SEO_AUDIT_INTERVAL_MS) || 21600000;
    this.log(`Starting continuous SEO auditing (interval: ${intervalMs}ms)`);
    await this.runAudit();
    setInterval(async () => {
      try { await this.runAudit(); }
      catch (err) { this.log(`Audit error: ${err.message}`, 'ERROR'); }
    }, intervalMs);
  }
}

if (require.main === module) {
  const auditor = new AISEOMetaAuditor();
  const cmd = process.argv[2] || 'start';

  switch (cmd) {
    case 'start':
      auditor.startContinuousAudit();
      break;
    case 'audit':
      auditor.runAudit().then((report) => {
        console.log(`\nSEO Score: ${report.summary.averageScore}/100`);
        process.exit(report.summary.pagesWithErrors > 0 ? 1 : 0);
      });
      break;
    default:
      console.log('Commands: start | audit');
  }
}

module.exports = AISEOMetaAuditor;
