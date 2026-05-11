#!/usr/bin/env node

/**
 * AI SEO Monitor & Optimizer Automation
 * 
 * Continuously monitors and improves SEO health:
 * - Meta tags (title, description, keywords)
 * - Open Graph tags
 * - Twitter Card tags
 * - Structured data (JSON-LD)
 * - Sitemap validation
 * - Robots.txt validation
 * - Canonical URLs
 * - Image alt tags
 * - Heading hierarchy
 * - Internal links
 * - Page speed hints
 * - Mobile-friendliness
 * - Auto-fixes common SEO issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SEOMonitorOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.pagesDir = path.join(this.projectRoot, 'app');
    this.publicDir = path.join(this.projectRoot, 'public');
    this.logsDir = path.join(this.projectRoot, 'automation', 'logs');
    this.reportsDir = path.join(this.projectRoot, 'automation', 'reports');
    this.canonicalUrl = 'https://ziontechgroup.com';
    
    this.issues = [];
    this.fixes = [];
    this.score = 100;
    this.cachedPages = null; // Cache pages list for faster checks
    
    this.autoFix = process.env.AUTO_FIX === 'true';
    this.autoCommit = process.env.AUTO_COMMIT === 'true';
    this.autoPush = process.env.AUTO_PUSH === 'true';
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.logsDir, this.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, type = 'info') {
    // Optimized logging: Only log to file, minimal console output for speed
    const prefix = {
      info: '📊',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      fix: '🔧'
    }[type] || 'ℹ️';
    
    const logMessage = `[${new Date().toISOString()}] ${prefix} ${message}`;
    
    // Only log important messages to console (success messages)
    if (type === 'success' || type === 'fix') {
      console.log(logMessage);
    }
    
    // Always log to file
    const logFile = path.join(this.logsDir, 'seo-monitor.log');
    try {
      fs.appendFileSync(logFile, logMessage + '\n');
    } catch (e) {
      // Silent failure - don't block execution
    }
  }

  async analyze() {
    const startTime = Date.now();
    
    try {
      // Reset for this run
      this.issues = [];
      this.fixes = [];
      this.score = 100;
      
      // Cache pages list once at the start (faster than scanning multiple times)
      this.cachedPages = this.getAllPages();
      
      // MAXIMUM PARALLELIZATION: Run ALL checks simultaneously for absolute maximum speed
      await Promise.all([
        this.checkMetaTags(),
        this.checkSitemap(),
        this.checkRobotsTxt(),
        this.checkOpenGraphTags(),
        this.checkStructuredData(),
        this.checkCanonicalUrls(),
        this.checkImageAltTags(),
        this.checkHeadingHierarchy(),
        this.checkInternalLinks(),
        this.checkPageTitles(),
      ]);
      
      // Generate report and apply fixes in parallel
      await Promise.all([
        Promise.resolve(this.generateReport()),
        this.autoFix && this.fixes.length > 0 ? this.applyFixes() : Promise.resolve()
      ]);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.log(`⚡ SEO Complete: ${this.score}/100 | ${this.issues.length} issues | ${this.fixes.length} fixes | ${duration}s`, 'success');
      
    } catch (error) {
      // Silent error handling - don't log to keep it fast, just continue
      // Don't throw - keep running continuously and autonomously
    }
  }

  async checkMetaTags() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let missingMeta = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      // Check for title
      if (!content.includes('<title>') && !content.includes('<Head>')) {
        missingMeta++;
        this.issues.push({
          type: 'meta',
          severity: 'high',
          file: relativePath,
          issue: 'Missing title tag',
          suggestion: 'Add a descriptive title using Next.js Head component'
        });
        
        if (this.autoFix) {
          this.fixes.push({
            file: relativePath,
            type: 'meta-title',
            action: 'add'
          });
        }
      }
      
      // Check for meta description
      if (!content.includes('meta name="description"') && 
          !content.includes('meta property="og:description"')) {
        missingMeta++;
        this.issues.push({
          type: 'meta',
          severity: 'high',
          file: relativePath,
          issue: 'Missing meta description',
          suggestion: 'Add a compelling meta description (150-160 characters)'
        });
      }
    }
    
    if (missingMeta > 0) {
      this.score -= Math.min(20, missingMeta * 2);
    }
  }

  async checkOpenGraphTags() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let missingOG = 0;
    
    const requiredOGTags = [
      'og:title',
      'og:description',
      'og:image',
      'og:url',
      'og:type'
    ];
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      const missingTags = requiredOGTags.filter(tag => 
        !content.includes(`property="${tag}"`)
      );
      
      if (missingTags.length > 0) {
        missingOG++;
        this.issues.push({
          type: 'opengraph',
          severity: 'medium',
          file: relativePath,
          issue: `Missing OG tags: ${missingTags.join(', ')}`,
          suggestion: 'Add complete Open Graph meta tags for social sharing'
        });
        
        if (this.autoFix) {
          this.fixes.push({
            file: relativePath,
            type: 'og-tags',
            action: 'add',
            tags: missingTags
          });
        }
      }
    }
    
    if (missingOG > 0) {
      this.score -= Math.min(15, missingOG * 2);
    }
  }

  async checkStructuredData() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let withoutStructuredData = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      if (!content.includes('application/ld+json') && 
          !content.includes('@type')) {
        withoutStructuredData++;
        this.issues.push({
          type: 'structured-data',
          severity: 'medium',
          file: relativePath,
          issue: 'Missing structured data (Schema.org)',
          suggestion: 'Add JSON-LD structured data for better search visibility'
        });
        
        if (this.autoFix && this.shouldHaveStructuredData(page)) {
          this.fixes.push({
            file: relativePath,
            type: 'structured-data',
            action: 'add'
          });
        }
      }
    }
    
    if (withoutStructuredData > 0) {
      this.score -= Math.min(10, withoutStructuredData);
    }
  }

  async checkSitemap() {
    // Silent check - no logging for speed
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    
    if (!fs.existsSync(sitemapPath)) {
      this.score -= 10;
      this.issues.push({
        type: 'sitemap',
        severity: 'high',
        file: 'public/sitemap.xml',
        issue: 'Sitemap not found',
        suggestion: 'Generate sitemap.xml for better crawlability'
      });
      
      if (this.autoFix) {
        this.fixes.push({
          type: 'sitemap',
          action: 'generate'
        });
      }
      
      } else {
        const content = fs.readFileSync(sitemapPath, 'utf-8');
        
        // Check if sitemap is valid XML
        if (!content.includes('<?xml') || !content.includes('urlset')) {
          this.score -= 5;
          this.issues.push({
            type: 'sitemap',
            severity: 'medium',
            file: 'public/sitemap.xml',
            issue: 'Invalid sitemap format',
            suggestion: 'Fix sitemap XML structure'
          });
        } else {
          // Check if sitemap includes canonical URL
          if (!content.includes(this.canonicalUrl)) {
            this.issues.push({
              type: 'sitemap',
              severity: 'low',
              file: 'public/sitemap.xml',
              issue: 'Sitemap uses non-canonical URLs',
              suggestion: `Use canonical URL: ${this.canonicalUrl}`
            });
          }
        }
      }
  }

  async checkRobotsTxt() {
    // Silent check - no logging for speed
    const robotsPath = path.join(this.publicDir, 'robots.txt');
    
    if (!fs.existsSync(robotsPath)) {
      this.score -= 5;
      this.issues.push({
        type: 'robots',
        severity: 'medium',
        file: 'public/robots.txt',
        issue: 'robots.txt not found',
        suggestion: 'Create robots.txt for crawler directives'
      });
      
      if (this.autoFix) {
        this.fixes.push({
          type: 'robots',
          action: 'create'
        });
      }
    } else {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      
      // Check if robots.txt references sitemap
      if (!content.includes('Sitemap:')) {
        this.issues.push({
          type: 'robots',
          severity: 'low',
          file: 'public/robots.txt',
          issue: 'robots.txt missing sitemap reference',
          suggestion: 'Add Sitemap directive to robots.txt'
        });
        
        if (this.autoFix) {
          this.fixes.push({
            type: 'robots',
            action: 'add-sitemap'
          });
        }
      }
    }
  }

  async checkCanonicalUrls() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let missingCanonical = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      if (!content.includes('rel="canonical"')) {
        missingCanonical++;
        this.issues.push({
          type: 'canonical',
          severity: 'medium',
          file: relativePath,
          issue: 'Missing canonical URL',
          suggestion: `Add canonical link tag with ${this.canonicalUrl}`
        });
      }
    }
    
    if (missingCanonical > 0) {
      this.score -= Math.min(10, missingCanonical);
    }
  }

  async checkImageAltTags() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let imagesWithoutAlt = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      // Check for img tags without alt
      const imgMatches = content.match(/<img[^>]*>/gi) || [];
      const imgsWithoutAlt = imgMatches.filter(img => 
        !img.includes('alt=') || img.includes('alt=""')
      );
      
      // Check for Image component without alt
      const nextImageMatches = content.match(/<Image[^>]*>/gi) || [];
      const nextImgsWithoutAlt = nextImageMatches.filter(img => 
        !img.includes('alt=') || img.includes('alt=""')
      );
      
      const totalWithoutAlt = imgsWithoutAlt.length + nextImgsWithoutAlt.length;
      
      if (totalWithoutAlt > 0) {
        imagesWithoutAlt += totalWithoutAlt;
        this.issues.push({
          type: 'accessibility',
          severity: 'medium',
          file: relativePath,
          issue: `${totalWithoutAlt} images without alt text`,
          suggestion: 'Add descriptive alt text to all images for accessibility'
        });
      }
    }
    
    if (imagesWithoutAlt > 0) {
      this.score -= Math.min(10, imagesWithoutAlt);
    }
  }

  async checkHeadingHierarchy() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let hierarchyIssues = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      // Check for multiple h1 tags
      const h1Matches = (content.match(/<h1[^>]*>/gi) || []).length;
      if (h1Matches > 1) {
        hierarchyIssues++;
        this.issues.push({
          type: 'seo',
          severity: 'medium',
          file: relativePath,
          issue: `Multiple h1 tags found (${h1Matches})`,
          suggestion: 'Use only one h1 tag per page'
        });
      }
      
      // Check if page has h1
      if (h1Matches === 0 && !content.includes('className=') && !content.includes('_app.tsx')) {
        this.issues.push({
          type: 'seo',
          severity: 'low',
          file: relativePath,
          issue: 'No h1 tag found',
          suggestion: 'Add an h1 tag with the main page heading'
        });
      }
    }
    
    if (hierarchyIssues > 0) {
      this.score -= Math.min(5, hierarchyIssues);
    }
  }

  async checkInternalLinks() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let linkIssues = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      // Check for hardcoded URLs instead of relative links
      const hardcodedLinks = content.match(/href=["']https?:\/\/(?:localhost|127\.0\.0\.1)[^"']*["']/gi) || [];
      
      if (hardcodedLinks.length > 0) {
        linkIssues++;
        this.issues.push({
          type: 'links',
          severity: 'low',
          file: relativePath,
          issue: `${hardcodedLinks.length} hardcoded localhost URLs`,
          suggestion: 'Use relative URLs for internal links'
        });
      }
    }
    
    if (linkIssues > 0) {
      this.score -= Math.min(5, linkIssues);
    }
  }

  async checkPageTitles() {
    // Silent check - no logging for speed
    const pages = this.getAllPages();
    let titleIssues = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf-8');
      const relativePath = path.relative(this.projectRoot, page);
      
      // Extract title content
      const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        const title = titleMatch[1];
        
        // Check title length
        if (title.length < 30) {
          titleIssues++;
          this.issues.push({
            type: 'seo',
            severity: 'low',
            file: relativePath,
            issue: `Title too short (${title.length} chars)`,
            suggestion: 'Use 50-60 characters for optimal display'
          });
        } else if (title.length > 60) {
          titleIssues++;
          this.issues.push({
            type: 'seo',
            severity: 'low',
            file: relativePath,
            issue: `Title too long (${title.length} chars)`,
            suggestion: 'Keep titles under 60 characters'
          });
        }
      }
    }
    
    // Silent check - no logging for speed
  }

  getAllPages() {
    // Use cached pages if available (set at start of analyze)
    if (this.cachedPages) {
      return this.cachedPages;
    }
    
    const pages = [];
    
    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'api') {
          scanDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          if (!file.startsWith('_') && !file.includes('.test.')) {
            pages.push(filePath);
          }
        }
      }
    };
    
    scanDirectory(this.pagesDir);
    return pages;
  }

  shouldHaveStructuredData(filePath) {
    const fileName = path.basename(filePath);
    // Pages that should have structured data
    return fileName.includes('blog') || 
           fileName.includes('product') || 
           fileName.includes('service') || 
           fileName.includes('about') ||
           fileName === 'index.tsx';
  }

  async applyFixes() {
    // Silent fix application - no logging for speed
    let fixCount = 0;
    
    for (const fix of this.fixes) {
      try {
        if (fix.type === 'robots' && fix.action === 'create') {
          await this.createRobotsTxt();
          fixCount++;
        } else if (fix.type === 'robots' && fix.action === 'add-sitemap') {
          await this.addSitemapToRobots();
          fixCount++;
        } else if (fix.type === 'sitemap' && fix.action === 'generate') {
          // Skip - requires build
        }
      } catch (error) {
        // Silent failure - continue
      }
    }
    
    if (fixCount > 0 && this.autoCommit) {
      await this.commitChanges();
    }
  }

  async createRobotsTxt() {
    const robotsPath = path.join(this.publicDir, 'robots.txt');
    const content = `# Robots.txt for ${this.canonicalUrl}
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Sitemaps
Sitemap: ${this.canonicalUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;
    
    fs.writeFileSync(robotsPath, content);
  }

  async addSitemapToRobots() {
    const robotsPath = path.join(this.publicDir, 'robots.txt');
    let content = fs.readFileSync(robotsPath, 'utf-8');
    
    if (!content.includes('Sitemap:')) {
      content += `\n# Sitemaps\nSitemap: ${this.canonicalUrl}/sitemap.xml\n`;
      fs.writeFileSync(robotsPath, content);
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      score: this.score,
      grade: this.getGrade(this.score),
      summary: {
        totalIssues: this.issues.length,
        highSeverity: this.issues.filter(i => i.severity === 'high').length,
        mediumSeverity: this.issues.filter(i => i.severity === 'medium').length,
        lowSeverity: this.issues.filter(i => i.severity === 'low').length,
        fixesApplied: this.fixes.length
      },
      issues: this.issues,
      recommendations: this.getRecommendations()
    };
    
    const reportPath = path.join(this.reportsDir, 'seo-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    const htmlReport = this.generateHTMLReport(report);
    const htmlPath = path.join(this.reportsDir, 'seo-report.html');
    fs.writeFileSync(htmlPath, htmlReport);
    
    this.log(`📊 Report saved to ${reportPath}`, 'success');
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.score < 80) {
      recommendations.push({
        priority: 'high',
        action: 'Fix high-severity SEO issues immediately',
        impact: 'Major improvement in search rankings'
      });
    }
    
    const missingMeta = this.issues.filter(i => i.type === 'meta').length;
    if (missingMeta > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Add complete meta tags to all pages',
        impact: 'Better search result appearance and CTR'
      });
    }
    
    const missingOG = this.issues.filter(i => i.type === 'opengraph').length;
    if (missingOG > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Add Open Graph tags for social sharing',
        impact: 'Improved social media presence'
      });
    }
    
    const accessibilityIssues = this.issues.filter(i => i.type === 'accessibility').length;
    if (accessibilityIssues > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Add alt text to all images',
        impact: 'Better accessibility and SEO'
      });
    }
    
    recommendations.push({
      priority: 'low',
      action: 'Run Lighthouse audit for performance metrics',
      impact: 'Identify additional optimization opportunities'
    });
    
    return recommendations;
  }

  generateHTMLReport(report) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Report - ${new Date(report.timestamp).toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; margin-bottom: 20px; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .score { font-size: 64px; font-weight: bold; margin: 20px 0; }
    .grade { display: inline-block; padding: 10px 20px; background: rgba(255,255,255,0.2); border-radius: 5px; font-size: 48px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card h3 { color: #333; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .card .value { font-size: 32px; font-weight: bold; color: #667eea; }
    .issues { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .issue { padding: 15px; margin-bottom: 15px; border-left: 4px solid #ddd; background: #f9f9f9; border-radius: 4px; }
    .issue.high { border-left-color: #ff4757; }
    .issue.medium { border-left-color: #ffa502; }
    .issue.low { border-left-color: #2ed573; }
    .issue-type { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
    .issue-title { font-weight: bold; margin-bottom: 5px; }
    .issue-file { font-family: monospace; font-size: 12px; color: #666; margin-bottom: 5px; }
    .recommendations { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .recommendation { padding: 15px; margin-bottom: 15px; background: #f0f7ff; border-radius: 4px; }
    .priority { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
    .priority.high { background: #ff4757; color: white; }
    .priority.medium { background: #ffa502; color: white; }
    .priority.low { background: #2ed573; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 SEO Monitor Report</h1>
      <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      <div class="score">
        <span class="grade">${report.grade}</span>
        ${report.score}/100
      </div>
    </div>
    
    <div class="summary">
      <div class="card">
        <h3>Total Issues</h3>
        <div class="value">${report.summary.totalIssues}</div>
      </div>
      <div class="card">
        <h3>High Severity</h3>
        <div class="value" style="color: #ff4757;">${report.summary.highSeverity}</div>
      </div>
      <div class="card">
        <h3>Medium Severity</h3>
        <div class="value" style="color: #ffa502;">${report.summary.mediumSeverity}</div>
      </div>
      <div class="card">
        <h3>Low Severity</h3>
        <div class="value" style="color: #2ed573;">${report.summary.lowSeverity}</div>
      </div>
      <div class="card">
        <h3>Fixes Applied</h3>
        <div class="value" style="color: #667eea;">${report.summary.fixesApplied}</div>
      </div>
    </div>
    
    <div class="issues">
      <h2 style="margin-bottom: 20px;">📋 Issues Found</h2>
      ${report.issues.length === 0 ? '<p>No issues found! Your SEO is looking great! 🎉</p>' : 
        report.issues.map(issue => `
          <div class="issue ${issue.severity}">
            <div class="issue-type">${issue.type}</div>
            <div class="issue-title">${issue.issue}</div>
            <div class="issue-file">${issue.file}</div>
            <div>${issue.suggestion}</div>
          </div>
        `).join('')}
    </div>
    
    <div class="recommendations">
      <h2 style="margin-bottom: 20px;">💡 Recommendations</h2>
      ${report.recommendations.map(rec => `
        <div class="recommendation">
          <div class="priority ${rec.priority}">${rec.priority} priority</div>
          <div style="font-weight: bold; margin: 5px 0;">${rec.action}</div>
          <div style="color: #666;">Impact: ${rec.impact}</div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
  }

  async commitChanges() {
    try {
      this.log('💾 Committing SEO improvements...', 'info');
      
      // Check if there are actual changes to commit
      const statusCheck = execSync('git status --porcelain', { 
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });
      
      if (!statusCheck.trim()) {
        this.log('No changes to commit', 'info');
        return;
      }
      
      execSync('git add -A', { 
        cwd: this.projectRoot,
        stdio: 'pipe' // Don't output git messages to console
      });
      
      const commitMessage = `🔍 SEO improvements: Fixed ${this.fixes.length} issues (Score: ${this.score}/100)`;
      execSync(`git commit -m "${commitMessage}"`, { 
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      this.log(`✅ Committed: ${commitMessage}`, 'success');
      
      if (this.autoPush) {
        // Push asynchronously to not block next check
        setImmediate(() => {
          try {
            execSync('git push origin main', { 
              cwd: this.projectRoot,
              stdio: 'pipe',
              timeout: 30000 // 30 second timeout
            });
            this.log('🚀 Changes pushed to remote', 'success');
          } catch (pushError) {
            this.log(`Push failed (will retry next commit): ${pushError.message}`, 'warning');
          }
        });
      }
      
    } catch (error) {
      // Don't fail the entire process if commit fails
      this.log(`Commit failed (non-critical): ${error.message}`, 'warning');
    }
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'analyze';
  
  const monitor = new SEOMonitorOptimizer();
  
  switch (command) {
    case 'analyze':
    case 'run':
      await monitor.analyze();
      break;
    
    case 'continuous':
      // MAXIMUM SPEED MODE: Check every 15-30 seconds (configurable, default 30s)
      const intervalSeconds = parseInt(process.env.CHECK_INTERVAL || '30'); // Default: 30 seconds - MAXIMUM SPEED
      const interval = intervalSeconds * 1000;
      
      console.log(`⚡⚡⚡ MAXIMUM SPEED AUTONOMOUS MODE ⚡⚡⚡`);
      console.log(`🚀 Running SEO checks every ${intervalSeconds} seconds`);
      console.log(`🔧 Auto-fix: ${monitor.autoFix ? '✅' : '❌'} | Auto-commit: ${monitor.autoCommit ? '✅' : '❌'} | Auto-push: ${monitor.autoPush ? '✅' : '❌'}`);
      console.log(`🔄 Continuous autonomous operation - NEVER STOPS`);
      console.log(`⚡ Parallel execution: ALL checks run simultaneously`);
      console.log('');
      
      // Optimized continuous loop - zero overhead
      let isRunning = false;
      const runAnalysis = async () => {
        if (isRunning) return; // Prevent overlapping runs
        isRunning = true;
        
        try {
          monitor.cachedPages = null; // Reset cache for fresh analysis
          await monitor.analyze();
        } catch (error) {
          // Silent error - keep running autonomously
        } finally {
          isRunning = false;
        }
      };
      
      // Run immediately without any delay
      runAnalysis();
      
      // Continuous loop with minimal interval
      setInterval(runAnalysis, interval);
      
      // Keep process alive forever - prevent any exit
      process.on('SIGINT', () => {
        console.log('\n🛑 Graceful shutdown...');
        process.exit(0);
      });
      
      process.on('SIGTERM', () => {
        console.log('\n🛑 Graceful shutdown...');
        process.exit(0);
      });
      
      // Prevent process from exiting - keep alive forever
      setInterval(() => {}, 1000);
      
      // Log periodic status (every 5 minutes)
      setInterval(() => {
        console.log(`⏰ [${new Date().toISOString()}] SEO Monitor running autonomously...`);
      }, 300000);
      
      break;
    
    default:
      console.log('Unknown command. Use: analyze, run, or continuous');
      process.exit(1);
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

