# AI Build Fixer Agent

An autonomous AI agent that continuously monitors and fixes build errors in the Zion Tech Group application.

## Overview

The AI Build Fixer Agent is a specialized automation system that:
- 🔍 **Monitors** build status continuously
- 🔧 **Detects** and analyzes build errors automatically
- 🛠️ **Fixes** common build issues without human intervention
- 📊 **Reports** on build health and fix attempts
- 🚀 **Commits & Pushes** fixes automatically to keep the build green

## Features

### Intelligent Error Detection
- TypeScript compilation errors
- ESLint linting errors
- Module resolution issues
- Syntax errors
- Import/export problems
- Build configuration issues

### Automated Fixes
- Auto-fix ESLint errors
- Fix missing imports
- Resolve module dependencies
- Clean build artifacts
- Fix common TypeScript issues
- Syntax error repairs

### Continuous Operation
- Runs on schedule (every 2 hours by default)
- Triggers on CI/CD build failures
- Can run continuously in the background
- Automatic commit and push of fixes

### Smart Reporting
- Detailed error analysis
- Fix success/failure tracking
- Build health scores
- Historical reports
- GitHub Issues integration

## Usage

### Quick Start

```bash
# Run a single build check and fix cycle
npm run ai:build-fix

# Check build status only (no fixes)
npm run ai:build-check

# Run continuously with periodic checks
npm run ai:build-fix-continuous
```

### Manual Execution

```bash
# One-time fix
node automation/ai-build-fixer-agent.cjs run

# Continuous mode (checks every 5 minutes)
node automation/ai-build-fixer-agent.cjs continuous

# Check only
node automation/ai-build-fixer-agent.cjs check
```

### GitHub Actions

The agent runs automatically via GitHub Actions:
- **Schedule**: Every 2 hours
- **On Build Failure**: Automatically triggered when CI/CD fails
- **Manual**: Via workflow_dispatch

To manually trigger:
1. Go to Actions tab in GitHub
2. Select "AI Build Fixer" workflow
3. Click "Run workflow"

## Configuration

Configure the agent using environment variables:

```bash
# Enable continuous mode
CONTINUOUS_BUILD_FIXER=true

# Check interval in minutes (default: 5)
BUILD_CHECK_INTERVAL=5

# Auto-commit fixes (default: true)
AUTO_COMMIT=true

# Auto-push to main (default: true)
AUTO_PUSH=true

# Max fix attempts per run (default: 5)
MAX_FIX_ATTEMPTS=5

# Try clean build if fixes fail (default: true)
CLEAN_BUILD_ON_FAIL=true
```

### Example with Custom Settings

```bash
# Run with custom settings
BUILD_CHECK_INTERVAL=10 MAX_FIX_ATTEMPTS=10 \
  node automation/ai-build-fixer-agent.cjs continuous
```

## How It Works

### 1. Build Analysis Phase
- Runs `npm run build`
- Captures all error output
- Parses and categorizes errors
- Identifies fixable vs. non-fixable issues

### 2. Fix Application Phase
- Attempts automated fixes based on error type
- Runs fixes in priority order:
  1. Linting errors (auto-fixable)
  2. Module/import errors
  3. TypeScript errors (where possible)
  4. Syntax errors
- Limits fixes to prevent infinite loops

### 3. Verification Phase
- Re-runs build after fixes
- Verifies fixes were successful
- Reports on build status

### 4. Commit Phase
- Stages all changes
- Creates descriptive commit message
- Commits to current branch
- Pushes to remote (if enabled)

### 5. Reporting Phase
- Generates detailed JSON report
- Saves to `automation/reports/`
- Uploads as GitHub Action artifact
- Updates GitHub Issues if needed

## Reports

Reports are saved in `automation/reports/`:
- `build-fixer-latest.json` - Most recent run
- `build-fixer-[timestamp].json` - Historical runs

### Report Structure

```json
{
  "timestamp": "2025-11-03T10:00:00Z",
  "runNumber": 42,
  "buildStatus": "passing",
  "errorCount": 3,
  "fixesAttempted": 3,
  "fixesSuccessful": 3,
  "buildFixed": true,
  "runtime": 45000,
  "errors": [...],
  "fixes": [...]
}
```

## Integration with CI/CD

The build fixer integrates seamlessly with the existing CI/CD pipeline:

1. **CI/CD runs** and detects a build failure
2. **Build Fixer is triggered** automatically
3. **Analyzes and fixes** the errors
4. **Commits fixes** to main branch
5. **CI/CD re-runs** with the fixes
6. **Build passes** ✅

## Error Types and Fixes

### ESLint Errors
- **Detection**: Parsing ESLint output
- **Fix**: `npm run lint:fix`
- **Success Rate**: High

### TypeScript Errors
- **Detection**: TypeScript compiler output
- **Fix**: Type annotations, imports
- **Success Rate**: Medium (some require manual fixes)

### Module Errors
- **Detection**: "Cannot find module" messages
- **Fix**: `npm ci` to reinstall dependencies
- **Success Rate**: High

### Syntax Errors
- **Detection**: Parse errors
- **Fix**: Brace matching, semicolon fixes
- **Success Rate**: Medium

### Build Configuration
- **Detection**: Build process failures
- **Fix**: Clean build, cache clearing
- **Success Rate**: High

## Troubleshooting

### Build still failing after fixes
- Check the latest report in `automation/reports/build-fixer-latest.json`
- Review the GitHub Actions logs
- Some errors may require manual intervention
- Check for recently introduced breaking changes

### Agent not running automatically
- Verify GitHub Actions workflow is enabled
- Check repository permissions for the workflow
- Ensure `GH_TOKEN` secret is configured

### Fixes not being committed
- Verify `AUTO_COMMIT=true` and `AUTO_PUSH=true`
- Check Git configuration in workflow
- Review agent logs for commit errors

### Too many false positives
- Adjust `MAX_FIX_ATTEMPTS` to limit fixes per run
- Review error patterns in the agent code
- Consider adding error type filters

## Logs

Logs are saved to:
- `automation/logs/ai-build-fixer.log`

View logs in real-time:
```bash
tail -f automation/logs/ai-build-fixer.log
```

## Safety Features

- **Max Attempts Limit**: Prevents infinite fix loops
- **Error Pattern Learning**: Avoids repeating failed fixes
- **Clean Build Fallback**: Last resort fix attempt
- **Report Generation**: Full audit trail
- **GitHub Issues**: Alerts for persistent failures

## Best Practices

1. **Let it run automatically** - The agent works best when left to operate autonomously
2. **Review reports regularly** - Check reports to understand common issues
3. **Update error patterns** - Enhance the agent with new error patterns as you discover them
4. **Monitor the logs** - Logs provide insights into what the agent is doing
5. **Commit related changes together** - This helps the agent understand context

## Advanced Usage

### Custom Error Patterns

Edit `ai-build-fixer-agent.cjs` to add new error patterns:

```javascript
{
  pattern: /Your custom error pattern/,
  type: 'your-error-type',
  fixable: true
}
```

### Custom Fix Functions

Add new fix functions in the `BuildFixerEngine` class:

```javascript
async fixYourErrorType(analysis) {
  // Your fix logic here
  return { success: true, type: 'your-error-type', message: 'Fixed!', hasChanges: true };
}
```

## Repository Information

- **Repository**: https://github.com/Zion-Holdings/zion.app
- **Canonical URL**: https://ziontechgroup.com

## Related Automation

- **AI Development Agent** - General code improvements
- **AI Continuous Improvement Agent** - Comprehensive code analysis
- **AI Content Generator** - Content automation

## Support

For issues or questions:
1. Check the logs and reports
2. Review GitHub Issues with label `ai-build-fixer`
3. Examine workflow run details in GitHub Actions

---

**Powered by Zion Tech Group Autonomous AI Systems**

