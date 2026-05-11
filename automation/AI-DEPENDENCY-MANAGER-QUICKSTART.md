# 🚀 AI Smart Dependency Manager - Quick Start

## What It Does

The AI Smart Dependency Manager is an autonomous agent that keeps your project dependencies secure, optimized, and healthy. It runs automatically every 6 hours and:

✅ **Detects and fixes security vulnerabilities**  
✅ **Removes unused dependencies**  
✅ **Identifies duplicate packages**  
✅ **Analyzes bundle size**  
✅ **Suggests lighter alternatives**  
✅ **Generates health score (0-100)**  
✅ **Auto-commits improvements**

## Quick Commands

### Check Dependency Health (No Changes)
```bash
npm run deps:check
```

### Fix Issues Automatically
```bash
npm run deps:fix
```

### Generate Full Report
```bash
npm run deps:report
```

### Run Full Analysis + Auto-Fix
```bash
npm run deps:run
```

### View Health Summary
```bash
npm run deps:status
```

## PM2 Management

### Start Automated Agent (Runs Every 6 Hours)
```bash
npm run deps:start
# or
pm2 start ecosystem.config.cjs --only ai-smart-dependency-manager
```

### View Real-time Logs
```bash
npm run deps:logs
# or
pm2 logs ai-smart-dependency-manager
```

### Stop Agent
```bash
npm run deps:stop
# or
pm2 stop ai-smart-dependency-manager
```

### Check Status
```bash
pm2 status ai-smart-dependency-manager
```

## Understanding the Health Score

The agent calculates a health score from 0-100 based on:

- **100** = Perfect (no issues)
- **85+** = Healthy (minor optimizations possible)
- **70-84** = Good (some improvements needed)
- **50-69** = Fair (multiple issues to address)
- **< 50** = Poor (immediate attention required)

### Score Deductions:
- Critical vulnerability: **-10 points**
- High vulnerability: **-5 points**
- Moderate vulnerability: **-2 points**
- Unused dependency: **-2 points**
- Duplicate package: **-3 points**
- Bundle over threshold: **-15 points**

## Example Output

```
============================================================
📊 DEPENDENCY HEALTH REPORT
============================================================

🎯 Health Score: 85/100

🔒 Security:
   - Total Vulnerabilities: 0
   - Critical: 0

📦 Dependencies:
   - Unused: 0
   - Duplicates: 0
   - Outdated: 5

💡 Optimizations:
   - Lighter Alternatives: 0
   - Bundle Size: 313.28 MB

✅ Actions Taken: 0

============================================================
```

## Reports Location

All reports are saved in `automation/reports/`:

- `dependency-report.json` - Latest full report
- `dependency-history.json` - Historical tracking

## Configuration

Edit settings in `automation/ai-smart-dependency-manager.cjs`:

```javascript
config: {
  autoFix: true,              // Auto-fix vulnerabilities
  autoUpdate: false,          // Don't auto-update packages (safe default)
  autoRemoveUnused: true,     // Remove unused dependencies
  securityThreshold: 'moderate', // Fix moderate+ vulnerabilities
  maxBundleSize: 5242880,     // 5MB threshold
  checkInterval: 86400000,    // Check every 24 hours
}
```

## What Gets Auto-Fixed

✅ **Security vulnerabilities** (moderate and above)  
✅ **Unused dependencies** (confirmed unused)  
❌ **Outdated packages** (manual review recommended)  
❌ **Breaking changes** (requires testing)

## Safety Features

1. **Conservative defaults** - Won't auto-update packages
2. **Detailed logging** - Complete audit trail
3. **Git history** - Easy rollback via git
4. **No breaking changes** - Only safe operations

## Troubleshooting

### Issue: Large Bundle Size Warning
**Solution**: Check the `largestPackages` in the report and consider:
- Splitting large packages (like `next`) into chunks
- Using tree-shakeable alternatives (like `lodash-es` instead of `lodash`)
- Lazy-loading heavy dependencies

### Issue: Agent Not Running
**Solution**:
```bash
pm2 status ai-smart-dependency-manager
pm2 restart ai-smart-dependency-manager
pm2 logs ai-smart-dependency-manager
```

### Issue: Want to Disable Auto-Fix
**Solution**: Edit `ecosystem.config.cjs`:
```javascript
env: {
  AUTO_FIX: 'false',  // Change to false
  AUTO_REMOVE_UNUSED: 'false',
}
```

## Best Practices

1. ✅ **Review reports weekly** - Check health trends
2. ✅ **Target 85+ score** - Maintain healthy dependencies
3. ✅ **Fix criticals immediately** - Don't ignore security
4. ✅ **Test after auto-fixes** - Always verify changes
5. ✅ **Monitor bundle size** - Keep it under control

## Integration with Other Agents

Works seamlessly with:
- **AI Development Agent** - Fixes code issues
- **AI Master Orchestrator** - Coordinates all agents  
- **AI PM2 Optimization** - Optimizes automation itself
- **AI Continuous Improvement** - Overall codebase health

## Advanced Usage

### Manual Run with Custom Settings
```bash
node automation/ai-smart-dependency-manager.cjs run
```

### Check Only (No Fixes)
```bash
node automation/ai-smart-dependency-manager.cjs check
```

### View Raw Report
```bash
cat automation/reports/dependency-report.json | jq '.'
```

### View Historical Data
```bash
cat automation/reports/dependency-history.json | jq '.checks[-5:]'
```

## What's Next?

After the agent runs, it will:
1. Generate comprehensive report
2. Fix critical/high vulnerabilities
3. Remove unused dependencies
4. Commit changes with descriptive message
5. Push to main branch
6. Trigger Netlify rebuild

All automatically, every 6 hours. 🎉

---

**Created**: 2025-11-03  
**Status**: ✅ Active and Running  
**Maintainer**: AI Development System  

For detailed documentation, see [README-DEPENDENCY-MANAGER.md](README-DEPENDENCY-MANAGER.md)


