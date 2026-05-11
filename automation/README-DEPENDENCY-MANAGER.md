# 🔧 AI Smart Dependency Manager

An autonomous AI agent that continuously monitors, analyzes, and optimizes project dependencies for security, performance, and maintainability.

## 🌟 Features

### Security Monitoring
- ✅ **Vulnerability Detection** - Continuously scans for security vulnerabilities
- 🔒 **Automated Patching** - Automatically fixes security issues
- 🎯 **Severity-based Actions** - Prioritizes critical and high-severity issues
- 📊 **Security Reports** - Detailed vulnerability analysis and tracking

### Dependency Optimization
- 🧹 **Unused Detection** - Identifies and removes unused dependencies
- 🔄 **Duplicate Detection** - Finds packages with multiple versions
- 📦 **Bundle Analysis** - Tracks total dependency size and impact
- 💡 **Alternative Suggestions** - Recommends lighter, modern alternatives

### Health Monitoring
- 📈 **Health Score** - Overall dependency health rating (0-100)
- 📊 **Comprehensive Reports** - Detailed analysis and recommendations
- 📜 **Historical Tracking** - Monitors trends over time
- 🔔 **Actionable Insights** - Clear recommendations for improvements

### Automation
- 🤖 **Autonomous Operation** - Runs automatically on schedule
- 🔄 **Auto-commit** - Commits and pushes fixes automatically
- 📝 **Detailed Logging** - Complete audit trail of all actions
- 🎯 **Smart Actions** - Only takes safe, tested actions

## 🚀 Quick Start

### Run Continuously (RECOMMENDED - Auto-fixes every 5 minutes)
```bash
node automation/ai-smart-dependency-manager.cjs continuous
# or via PM2
pm2 start ecosystem.config.cjs --only ai-smart-dependency-manager
```

### Run Full Analysis and Auto-fix (One Time)
```bash
node automation/ai-smart-dependency-manager.cjs run
```

### Check Only (No Fixes)
```bash
node automation/ai-smart-dependency-manager.cjs check
```

### Fix Issues
```bash
node automation/ai-smart-dependency-manager.cjs fix
```

### Generate Report
```bash
node automation/ai-smart-dependency-manager.cjs report
```

## 📊 What It Checks

### 1. Security Vulnerabilities
- Scans all dependencies for known vulnerabilities
- Uses `npm audit` for comprehensive security analysis
- Prioritizes fixes based on severity level
- Tracks fix success and provides recommendations

### 2. Unused Dependencies
- Analyzes actual code usage with `depcheck`
- Identifies dependencies that are installed but never imported
- Safely removes unused packages to reduce bundle size
- Distinguishes between runtime and dev dependencies

### 3. Outdated Packages
- Checks for available updates
- Shows current, wanted, and latest versions
- Helps maintain up-to-date dependencies
- Tracks update history

### 4. Duplicate Dependencies
- Detects packages with multiple versions in dependency tree
- Identifies potential conflicts
- Suggests consolidation strategies
- Reduces bundle size by eliminating duplicates

### 5. Bundle Size Analysis
- Calculates total dependency size
- Identifies largest packages
- Tracks size trends over time
- Alerts when size exceeds thresholds

### 6. Lighter Alternatives
- Suggests modern, smaller alternatives to heavy packages
- Examples:
  - `moment` → `date-fns` (~97% smaller)
  - `lodash` → `lodash-es` (tree-shakeable)
  - `axios` → `ky` (~15KB smaller)
  - `uuid` → `nanoid` (~80% smaller)

## 📈 Health Score

The agent calculates a health score (0-100) based on:
- **Critical vulnerabilities**: -10 points each
- **High vulnerabilities**: -5 points each
- **Moderate vulnerabilities**: -2 points each
- **Unused dependencies**: -2 points each
- **Duplicate packages**: -3 points each
- **Outdated packages**: -0.2 points each (max -10)
- **Bundle size over threshold**: -15 points

Target: **85+ for healthy projects**

## ⚙️ Configuration

### Environment Variables (PM2)

Set via PM2 ecosystem configuration or environment:

```javascript
CONTINUOUS_MODE: 'true',      // Run continuously
FAST_MODE: 'true',            // Check every 5 minutes (default: 60 min)
INTERVAL_MINUTES: '5',        // Check interval in minutes
AUTO_FIX: 'true',             // Auto-fix vulnerabilities
AUTO_REMOVE_UNUSED: 'true',   // Auto-remove unused dependencies
AUTO_UPDATE: 'false',         // Don't auto-update packages (safe default)
SECURITY_THRESHOLD: 'moderate', // Minimum severity to auto-fix
AUTO_COMMIT: 'true',          // Auto-commit changes
AUTO_PUSH: 'true',            // Auto-push to repository
```

### Default Configuration

```javascript
config = {
  autoFix: true,                    // Automatically fix issues
  autoUpdate: false,                // Auto-update packages (keep false for safety)
  autoRemoveUnused: true,          // Auto-remove unused dependencies
  securityThreshold: 'moderate',   // Minimum severity to auto-fix
  maxBundleSize: 5 * 1024 * 1024, // 5MB threshold
  checkInterval: 300000,           // 5 minutes in fast mode, 60 min normal
  enableNotifications: true,       // Enable alerts
  continuousMode: true,            // Run continuously
  fastMode: true,                  // Ultra-fast checks every 5 minutes
  maxRunsPerCycle: 1000           // Max iterations before restart
}
```

### Security Threshold Options
- `low` - Fix all vulnerabilities
- `moderate` - Fix moderate and above (default)
- `high` - Fix only high and critical
- `critical` - Fix only critical

## 📁 Output Files

### Reports Directory (`automation/reports/`)
- `dependency-report.json` - Latest comprehensive report
- `dependency-history.json` - Historical tracking data

### Logs Directory (`automation/logs/`)
- `dependency-manager.log` - Detailed execution logs

## 📊 Sample Report

```json
{
  "timestamp": "2025-11-03T10:00:00.000Z",
  "vulnerabilities": [
    {
      "package": "example-pkg",
      "severity": "high",
      "fixAvailable": true
    }
  ],
  "unusedDependencies": [],
  "duplicates": [],
  "updates": [],
  "bundleAnalysis": {
    "totalSizeFormatted": "12.5 MB",
    "packageCount": 1250,
    "largestPackages": []
  },
  "summary": {
    "healthScore": 92,
    "totalVulnerabilities": 1,
    "criticalVulnerabilities": 0,
    "unusedDependencies": 0,
    "duplicatePackages": 0,
    "outdatedPackages": 5,
    "totalActions": 1
  }
}
```

## 🔄 PM2 Integration

The agent runs automatically via PM2:

```bash
# Start with PM2
pm2 start ecosystem.config.cjs --only ai-smart-dependency-manager

# View logs
pm2 logs ai-smart-dependency-manager

# Check status
pm2 status

# Restart
pm2 restart ai-smart-dependency-manager
```

## 🎯 Use Cases

### Continuous Security Monitoring
Automatically detect and fix security vulnerabilities before they become issues.

### Bundle Size Optimization
Keep your application lean by removing unused dependencies and suggesting lighter alternatives.

### Dependency Hygiene
Maintain a clean, up-to-date dependency tree without manual intervention.

### Technical Debt Reduction
Systematically address outdated and problematic dependencies.

### Compliance & Auditing
Maintain detailed logs and reports for security audits and compliance requirements.

## 🛡️ Safety Features

### Conservative Defaults
- Auto-update is **disabled by default** to prevent breaking changes
- Only removes dependencies confirmed as unused
- Creates detailed logs before taking any action

### Rollback Support
- All changes are committed separately with descriptive messages
- Easy to revert via git if needed
- Historical tracking for troubleshooting

### Testing Integration
- Can be run in check-only mode for CI/CD pipelines
- Generates reports without making changes
- Safe for production use

## 📝 NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "deps:check": "node automation/ai-smart-dependency-manager.cjs check",
    "deps:fix": "node automation/ai-smart-dependency-manager.cjs fix",
    "deps:report": "node automation/ai-smart-dependency-manager.cjs report",
    "deps:run": "node automation/ai-smart-dependency-manager.cjs run"
  }
}
```

## 🔍 Troubleshooting

### Issue: depcheck not found
**Solution**: The agent automatically uses `npx --yes depcheck` which installs it temporarily.

### Issue: npm audit fails
**Solution**: Ensure npm is up to date: `npm install -g npm@latest`

### Issue: Large bundle size
**Solution**: Review `largestPackages` in the report and consider suggested alternatives.

### Issue: Can't remove dependency
**Solution**: Check if the package is actually used. Review logs for details.

## 🤝 Integration with Other AI Agents

This agent works alongside:
- **AI Development Agent** - Fixes code-level issues
- **AI Code Generator** - Creates new features with optimal dependencies
- **AI Master Orchestrator** - Coordinates all AI agents
- **AI Performance Monitor** - Tracks runtime performance

## 📊 Best Practices

1. **Run daily** - Schedule automated checks via PM2 cron
2. **Review reports** - Check reports regularly for trends
3. **Test updates** - Always test after dependency changes
4. **Monitor health score** - Aim for 85+ health score
5. **Address criticals immediately** - Don't ignore critical vulnerabilities
6. **Keep bundle size low** - Regularly review largest packages

## 🎓 Advanced Usage

### Custom Health Checks
Extend the agent by adding custom checks in the `run()` method.

### Integration with CI/CD
```bash
# In your CI pipeline
npm run deps:check
if [ $? -ne 0 ]; then
  echo "Dependency issues found!"
  exit 1
fi
```

### Webhook Notifications
Modify the agent to send webhook notifications on critical issues.

## 📚 Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [depcheck documentation](https://github.com/depcheck/depcheck)
- [Bundle size best practices](https://web.dev/reduce-javascript-payloads-with-code-splitting/)

## 🚀 Future Enhancements

- [ ] Slack/Discord notifications
- [ ] Automatic PR creation for updates
- [ ] Machine learning for update safety prediction
- [ ] Integration with Snyk/Dependabot
- [ ] Visual dependency graphs
- [ ] Cost analysis (bundle size impact on hosting)
- [ ] Dependency license compliance checking

---

**Made with ❤️ by Zion Tech Group**

For more AI automation tools, see [automation/README.md](README.md)

