# 🚀 AI Agents Quick Start Guide

Get your AI development agents up and running in minutes!

## Prerequisites

1. **Node.js 18+** installed
2. **Git** configured with commit access
3. **PM2** for process management (optional but recommended)

## Quick Setup

### 1. Install PM2 (if not already installed)

```bash
npm install -g pm2
```

### 2. Set Environment Variables

For AI Code Generator features, set at least one API key:

```bash
# Option 1: Anthropic Claude (Recommended)
export ANTHROPIC_API_KEY="your_anthropic_api_key"

# Option 2: OpenAI GPT
export OPENAI_API_KEY="your_openai_api_key"
```

For Netlify deployment, add these to your Netlify environment variables:
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- `GH_TOKEN` (for GitHub Actions)

### 3. Start AI Agents

#### Option A: Start All Agents (Recommended)

```bash
cd automation
./start-ai-agents.sh
```

#### Option B: Start Individual Agents

```bash
# Start AI Development Agent (runs every 6 hours)
pm2 start ecosystem.config.cjs --only ai-development-agent

# Start AI Code Generator (runs weekly)
pm2 start ecosystem.config.cjs --only ai-code-generator

# Start AI Master Orchestrator (runs hourly)
pm2 start ecosystem.config.cjs --only ai-master-orchestrator
```

#### Option C: Manual One-Time Run

```bash
# Run development agent once
node automation/ai-development-agent.cjs run

# Generate feature suggestions
node automation/ai-code-generator.cjs features

# Run orchestrator once
node automation/ai-master-orchestrator.cjs run
```

## Common Commands

### View Status

```bash
pm2 status
```

### View Logs

```bash
# Real-time logs
pm2 logs ai-development-agent

# All AI agent logs
pm2 logs

# Last 100 lines
pm2 logs ai-development-agent --lines 100
```

### Monitor Performance

```bash
pm2 monit
```

### Stop Agents

```bash
# Stop specific agent
pm2 stop ai-development-agent

# Stop all agents
pm2 stop all
```

### Restart Agents

```bash
# Restart specific agent
pm2 restart ai-development-agent

# Restart all agents
pm2 restart all
```

### Delete Agents

```bash
# Delete specific agent
pm2 delete ai-development-agent

# Delete all agents
pm2 delete all
```

## What Each Agent Does

### 🔧 AI Development Agent
- **Runs:** Every 6 hours
- **Function:** Analyzes codebase, fixes errors, improves code quality
- **Output:** `automation/logs/ai-development-report.json`

### 🎨 AI Code Generator
- **Runs:** Weekly (Sunday midnight)
- **Function:** Generates feature suggestions using AI
- **Output:** `automation/generated/feature-suggestions.json`
- **Requires:** API key (ANTHROPIC_API_KEY or OPENAI_API_KEY)

### 🎯 AI Master Orchestrator
- **Runs:** Every hour
- **Function:** Coordinates all agents, prioritizes tasks, manages improvements
- **Output:** `automation/logs/orchestrator-report.json`

## Verify Everything Is Working

### 1. Check Agent Status

```bash
pm2 status
```

You should see:
- `ai-development-agent` - online
- `ai-code-generator` - online (or stopped - runs on schedule)
- `ai-master-orchestrator` - online

### 2. Check Logs

```bash
pm2 logs --lines 50
```

Look for:
- `✅` success messages
- No `❌` error messages
- Scheduled execution times

### 3. Check Reports

```bash
# View latest analysis
cat automation/logs/ai-development-report.json | json_pp

# View orchestrator status
cat automation/logs/orchestrator-report.json | json_pp
```

### 4. Test Manual Run

```bash
# Run a quick analysis
node automation/ai-development-agent.cjs analyze
```

Expected output: JSON report with code analysis

## Troubleshooting

### Issue: "require is not defined"
**Solution:** Files should have `.cjs` extension (not `.js`)

### Issue: Agent not starting
**Solution:** 
1. Check PM2 logs: `pm2 logs ai-development-agent`
2. Verify ecosystem.config.cjs exists
3. Ensure Node.js 18+ installed

### Issue: No changes being committed
**Solution:**
1. Verify `autoCommit: true` in config
2. Check git credentials: `git config user.name`
3. Check if there are actual issues to fix

### Issue: AI Code Generator fails
**Solution:**
1. Verify API key is set: `echo $ANTHROPIC_API_KEY`
2. Check API key validity
3. Ensure sufficient API credits

### Issue: High memory usage
**Solution:**
1. Increase memory limit in ecosystem.config.cjs
2. Reduce `maxChangesPerRun` in config
3. Run agents less frequently

## Configuration

### Customize Agent Behavior

Edit `automation/config/ai-development-config.json`:

```json
{
  "autoCommit": true,
  "autoPush": true,
  "maxChangesPerRun": 5,
  "analysisInterval": 3600000,
  "priorities": {
    "critical": ["security", "bugFixes"],
    "high": ["performance", "accessibility"],
    "medium": ["codeQuality", "testing"],
    "low": ["documentation", "seo"]
  }
}
```

### Adjust Schedule

Edit `ecosystem.config.cjs`:

```javascript
{
  name: 'ai-development-agent',
  cron_restart: '0 */6 * * *', // Change schedule
}
```

Cron examples:
- `'0 * * * *'` - Every hour
- `'0 */2 * * *'` - Every 2 hours
- `'0 0 * * *'` - Daily at midnight
- `'0 0 * * 0'` - Weekly on Sunday

## Save PM2 Configuration

To auto-start agents on system reboot:

```bash
# Save current PM2 configuration
pm2 save

# Setup auto-start
pm2 startup
```

## Monitor Health

### View Health Score

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('automation/logs/orchestrator-report.json')).healthScore)"
```

### View Recent Improvements

```bash
pm2 logs ai-development-agent --lines 20 | grep "✅"
```

### View Commits Made by AI

```bash
git log --author="AI" --oneline -20
```

## Next Steps

1. **Monitor for a Week** - Let agents run and observe their behavior
2. **Review Reports** - Check daily reports for insights
3. **Adjust Configuration** - Fine-tune based on your needs
4. **Set Up Alerts** - Configure PM2 to alert on failures
5. **Integrate with CI/CD** - Use GitHub Actions for automated runs

## Advanced Usage

### Generate a Component

```bash
node automation/ai-code-generator.cjs component "LoginForm" "A login form with email and password"
```

### Refactor Code

```bash
node automation/ai-code-generator.cjs refactor src/utils/api.ts "Convert to async/await"
```

### Generate Tests

```bash
node automation/ai-code-generator.cjs tests src/components/Button.tsx
```

### Fix Bugs

```bash
node automation/ai-code-generator.cjs fix src/pages/dashboard.tsx "Memory leak in useEffect"
```

## Support & Documentation

- **Full Documentation:** `automation/README.md`
- **Reports Location:** `automation/logs/`
- **Generated Files:** `automation/generated/`
- **Configuration:** `automation/config/`

## Tips for Success

1. ✅ Start with `autoCommit: false` to review changes manually
2. ✅ Monitor logs daily for the first week
3. ✅ Keep API keys secure (use environment variables only)
4. ✅ Review automated commits regularly
5. ✅ Adjust `maxChangesPerRun` based on your comfort level
6. ✅ Use PM2 monitoring dashboard
7. ✅ Set up log rotation to manage log sizes

---

**🤖 Happy Coding! Your AI agents are now working to improve your codebase 24/7!**

