# 🔍 AI SEO Monitor & Optimizer

An intelligent PM2 automation that continuously monitors and optimizes your website's SEO health.

## 🚀 Features

### Automated SEO Checks
- **Meta Tags**: Validates title, description, and keyword tags
- **Open Graph Tags**: Ensures proper social media sharing tags
- **Twitter Cards**: Checks Twitter-specific meta tags
- **Structured Data**: Validates JSON-LD schema markup
- **Sitemap**: Monitors sitemap.xml health and validity
- **Robots.txt**: Validates crawler directives
- **Canonical URLs**: Ensures proper canonical link tags
- **Image Alt Tags**: Checks all images have descriptive alt text
- **Heading Hierarchy**: Validates proper h1-h6 structure
- **Internal Links**: Checks for link issues
- **Page Titles**: Validates title length and quality

### Automated Fixes
- Creates robots.txt if missing
- Adds sitemap reference to robots.txt
- Suggests fixes for common SEO issues
- Generates detailed reports

### Intelligent Scoring
- SEO score out of 100
- Letter grade (A-F)
- Severity classification (high/medium/low)
- Prioritized recommendations

## 📊 How It Works

### Continuous Monitoring
The SEO Monitor runs every **30 minutes** (configurable) and:

1. Scans all pages in `src/pages/`
2. Analyzes SEO elements
3. Generates a comprehensive report
4. Auto-fixes issues (if enabled)
5. Commits improvements (if enabled)
6. Tracks score over time

### Scoring System
- **90-100 (A)**: Excellent SEO
- **80-89 (B)**: Good SEO
- **70-79 (C)**: Fair SEO
- **60-69 (D)**: Poor SEO
- **0-59 (F)**: Critical issues

### Issue Severity
- **High**: Critical issues affecting search rankings
- **Medium**: Important issues that should be addressed
- **Low**: Minor improvements for optimization

## 🎯 Quick Start

### Start with PM2
```bash
# Start SEO monitor
pm2 start ecosystem.config.cjs --only ai-seo-monitor

# View logs
pm2 logs ai-seo-monitor

# Monitor status
pm2 status ai-seo-monitor

# Stop monitor
pm2 stop ai-seo-monitor
```

### Manual Analysis
```bash
# Run single analysis
node automation/ai-seo-monitor-optimizer.cjs analyze

# Run continuous monitoring
node automation/ai-seo-monitor-optimizer.cjs continuous
```

### NPM Scripts
Add to your `package.json`:
```json
{
  "scripts": {
    "seo:check": "node automation/ai-seo-monitor-optimizer.cjs analyze",
    "seo:monitor": "node automation/ai-seo-monitor-optimizer.cjs continuous",
    "seo:report": "open automation/reports/seo-report.html"
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Enable/disable features
AUTO_FIX=true              # Auto-fix issues
AUTO_COMMIT=true           # Auto-commit fixes
AUTO_PUSH=true             # Auto-push commits
CHECK_INTERVAL=30          # Check every 30 minutes
NODE_ENV=production        # Environment
```

### PM2 Configuration

Edit `ecosystem.config.cjs`:

```javascript
{
  name: 'ai-seo-monitor',
  script: './automation/ai-seo-monitor-optimizer.cjs',
  args: 'continuous',
  env: {
    AUTO_FIX: 'true',           // Enable auto-fixes
    AUTO_COMMIT: 'true',        // Enable auto-commits
    AUTO_PUSH: 'true',          // Enable auto-push
    CHECK_INTERVAL: '30',       // Minutes between checks
  },
  cron_restart: '*/30 * * * *', // Every 30 minutes
}
```

### Customize Check Frequency

- **Fast**: `*/15 * * * *` (Every 15 minutes)
- **Normal**: `*/30 * * * *` (Every 30 minutes)
- **Slow**: `0 * * * *` (Every hour)
- **Daily**: `0 0 * * *` (Once per day)

## 📈 Reports

### JSON Report
Location: `automation/reports/seo-report.json`

```json
{
  "timestamp": "2025-11-03T...",
  "score": 85,
  "grade": "B",
  "summary": {
    "totalIssues": 12,
    "highSeverity": 2,
    "mediumSeverity": 5,
    "lowSeverity": 5,
    "fixesApplied": 3
  },
  "issues": [...],
  "recommendations": [...]
}
```

### HTML Report
Location: `automation/reports/seo-report.html`

Beautiful, interactive HTML report with:
- Visual score display
- Color-coded issues
- Prioritized recommendations
- Detailed analysis

Open in browser:
```bash
open automation/reports/seo-report.html
```

## 🎨 Report Features

### Dashboard View
- SEO Score (0-100)
- Letter Grade (A-F)
- Total Issues Count
- Severity Breakdown
- Fixes Applied Count

### Issues List
- Categorized by severity
- File location
- Specific issue description
- Actionable suggestions

### Recommendations
- Priority-based
- Impact assessment
- Actionable steps

## 🔄 Integration

### CI/CD Pipeline
Add to GitHub Actions:

```yaml
name: SEO Check
on: [push, pull_request]

jobs:
  seo-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run SEO Analysis
        run: node automation/ai-seo-monitor-optimizer.cjs analyze
      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: seo-report
          path: automation/reports/seo-report.html
```

### Pre-commit Hook
Add to `.husky/pre-commit`:

```bash
#!/bin/sh
node automation/ai-seo-monitor-optimizer.cjs analyze
```

### Netlify Build
Add to `netlify.toml`:

```toml
[build]
  command = "npm run build && npm run seo:check"
```

## 📋 Common Issues & Fixes

### Missing Meta Tags
**Issue**: Pages without title or description
**Fix**: Add Next.js Head component with meta tags
```tsx
import Head from 'next/head';

<Head>
  <title>Page Title</title>
  <meta name="description" content="Page description" />
</Head>
```

### Missing Open Graph Tags
**Issue**: Poor social media sharing appearance
**Fix**: Add OG meta tags
```tsx
<Head>
  <meta property="og:title" content="Title" />
  <meta property="og:description" content="Description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/page" />
</Head>
```

### Missing Alt Tags
**Issue**: Images without alt text
**Fix**: Add descriptive alt attributes
```tsx
<img src="/image.jpg" alt="Descriptive text" />
<Image src="/image.jpg" alt="Descriptive text" />
```

### Multiple H1 Tags
**Issue**: More than one h1 per page
**Fix**: Use only one h1, use h2-h6 for subheadings
```tsx
<h1>Main Page Heading</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>
```

## 🎯 Best Practices

### Meta Tags
- **Title**: 50-60 characters, include main keyword
- **Description**: 150-160 characters, compelling summary
- **Keywords**: Focus on 3-5 relevant keywords

### Images
- Always include descriptive alt text
- Use meaningful file names
- Optimize image size for performance

### Headings
- One h1 per page (main heading)
- Logical hierarchy (h1 → h2 → h3)
- Don't skip levels

### Internal Links
- Use relative URLs (`/page` not `http://localhost:3000/page`)
- Add descriptive anchor text
- Check for broken links

### Structured Data
- Add JSON-LD for rich snippets
- Use appropriate schema types
- Validate with Google's Rich Results Test

## 📊 Monitoring Dashboard

### View Real-time Status
```bash
pm2 monit
```

### Check Logs
```bash
# All logs
pm2 logs ai-seo-monitor

# Last 100 lines
pm2 logs ai-seo-monitor --lines 100

# Follow logs
pm2 logs ai-seo-monitor --follow
```

### Performance Stats
```bash
pm2 show ai-seo-monitor
```

## 🔧 Troubleshooting

### Monitor Not Starting
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs ai-seo-monitor --err

# Restart monitor
pm2 restart ai-seo-monitor
```

### No Issues Found But Score Low
- Check previous reports in `automation/reports/`
- Review logs in `automation/logs/seo-monitor.log`
- Run manual analysis for detailed output

### Auto-fixes Not Working
- Ensure `AUTO_FIX=true` in environment
- Check write permissions
- Review error logs for specific failures

### Reports Not Generating
- Ensure `automation/reports/` directory exists
- Check disk space
- Verify write permissions

## 🚀 Advanced Usage

### Custom Checks
Extend the `SEOMonitorOptimizer` class:

```javascript
async checkCustomSEO() {
  // Your custom SEO checks
  this.log('Running custom checks...', 'info');
  
  // Add issues
  this.issues.push({
    type: 'custom',
    severity: 'medium',
    file: 'path/to/file',
    issue: 'Custom issue description',
    suggestion: 'How to fix it'
  });
}
```

### Integration with Analytics
Track SEO improvements over time:

```javascript
const report = JSON.parse(
  fs.readFileSync('automation/reports/seo-report.json', 'utf-8')
);

// Log to analytics
analytics.track('seo_score', {
  score: report.score,
  grade: report.grade,
  issues: report.summary.totalIssues
});
```

## 📝 Report History

Reports are timestamped and can be archived:

```bash
# Archive reports
mkdir -p automation/reports/archive
mv automation/reports/seo-report-*.json automation/reports/archive/

# Compare reports
node scripts/compare-seo-reports.js \
  automation/reports/archive/seo-report-old.json \
  automation/reports/seo-report.json
```

## 🎓 Learning Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)

## 🤝 Contributing

Found a bug or have an improvement?
1. Fork the repository
2. Make your changes
3. Submit a pull request

## 📄 License

Part of the Zion Tech Group automation suite.

---

**Created**: November 2025  
**Version**: 1.0.0  
**Canonical URL**: https://ziontechgroup.com  
**Repository**: https://github.com/Zion-Holdings/zion.app

