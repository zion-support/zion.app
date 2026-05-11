# AI PM2 Optimization Agent

## Overview

The **AI PM2 Optimization Agent** is a meta-automation system that continuously monitors, analyzes, and improves your PM2 ecosystem. It's an AI that optimizes other AI agents and automations.

## What It Does

This agent provides **self-optimizing infrastructure** for your PM2 processes:

### 🔍 Monitoring & Analysis
- Collects real-time metrics from all PM2 processes
- Tracks memory usage, CPU usage, restarts, and errors
- Analyzes historical trends across time
- Identifies performance patterns and issues

### 🎯 Optimization
- Automatically adjusts memory limits based on actual usage
- Optimizes restart strategies and policies
- Improves cron schedules for better efficiency
- Reduces unnecessary process restarts
- Prevents memory leaks through periodic restarts
- Enhances error handling

### 🚀 Automation Management
- Identifies redundant or underperforming automations
- Suggests new useful automations based on system needs
- Creates new automation scripts automatically
- Removes unnecessary automations
- Optimizes log management and rotation

### 📊 Reporting
- Generates comprehensive optimization reports
- Tracks system health scores
- Maintains historical metrics
- Provides actionable recommendations

## Features

### Automatic Optimizations
- ✅ Memory limit adjustments (increase when near capacity, reduce when overprovisioned)
- ✅ Stability improvements (min_uptime, restart_delay)
- ✅ Cron schedule optimization
- ✅ PMX monitoring enablement
- ✅ Log merging and rotation
- ✅ New automation creation

### Analysis Capabilities
- Process performance metrics
- Memory usage trends
- Restart patterns
- Error frequency analysis
- CPU usage monitoring
- Configuration validation

### Health Scoring
The agent calculates a system health score (0-100) based on:
- Process status (running, stopped, errored)
- Restart frequency
- Error counts
- Resource usage

## Installation & Setup

### 1. Run the agent directly (not PM2-managed in current ecosystem)

```javascript
npm run pm2:optimize
```

### 2. Start the agent

```bash
# One-time optimization
npm run pm2:optimize

# Continuous optimization loop
npm run pm2:optimize-continuous
```

### 3. Verify it's running

```bash
npm run pm2:metrics
```

## Usage

### Quick Commands

```bash
# One-time optimization run
npm run pm2:optimize

# Run continuously
npm run pm2:optimize-continuous

# View current PM2 metrics
npm run pm2:metrics

# View optimization report
npm run pm2:optimize-report
```

### PM2 Management

```bash
# Start (continuous mode)
npm run pm2:optimize:start

# Stop the agent
npm run pm2:optimize:stop

# View logs
npm run pm2:optimize:logs

# Latest report
npm run pm2:optimize-report
```

### Manual Execution

```bash
# One-time run
node automation/ai-pm2-optimization-agent.cjs run

# Continuous mode (runs every 2 hours)
node automation/ai-pm2-optimization-agent.cjs continuous

# View metrics only
node automation/ai-pm2-optimization-agent.cjs metrics
```

## How It Works

### 1. Metrics Collection
```
Every 2 hours, the agent:
- Queries PM2 for all process details
- Reads error logs
- Collects memory, CPU, restart counts
- Analyzes process health
```

### 2. Analysis
```
- Compares current metrics vs historical data
- Identifies trends (memory increase, frequent restarts)
- Detects issues (high errors, stopped processes)
- Evaluates ecosystem.config.cjs
```

### 3. Optimization
```
- Generates optimization recommendations
- Automatically implements safe fixes
- Updates ecosystem.config.cjs
- Creates new automation scripts if needed
```

### 4. Reporting
```
- Saves detailed report to logs/pm2-optimization-report.json
- Tracks metrics history in logs/pm2-metrics.json
- Logs all actions to logs/pm2-optimization.log
```

## Output Files

### Reports
- `automation/logs/pm2-optimization-report.json` - Latest optimization report
- `automation/logs/pm2-metrics.json` - Historical metrics (last 100 snapshots)
- `automation/logs/pm2-optimization.log` - Agent activity log

### Report Structure
```json
{
  "timestamp": "2025-11-03T...",
  "metrics": {
    "processes": [...],
    "systemHealth": {
      "totalProcesses": 15,
      "runningProcesses": 14,
      "totalMemory": 2048000000,
      "totalRestarts": 23
    }
  },
  "optimizations": [
    {
      "category": "memory",
      "priority": "high",
      "title": "Increase Memory Limit",
      "actions": [...]
    }
  ],
  "summary": {
    "systemHealthScore": 85,
    "changesImplemented": 3
  }
}
```

## Configuration

The agent uses these environment variables (set in ecosystem.config.cjs):

```javascript
env: {
  NODE_ENV: 'production',
  AUTO_OPTIMIZE: 'true',      // Enable automatic optimizations
  AUTO_COMMIT: 'true',         // Commit changes to git
  AUTO_PUSH: 'true',           // Push changes to remote
}
```

### Scheduling

**Default: Runs continuously every 1 minute** (ULTRA-FAST mode enabled)

The agent runs in **continuous mode** with:
- ⚡ **Fast Mode**: Enabled (skips heavy operations for speed)
- ⚡ **Interval**: 1 minute between optimization cycles
- ⚡ **No Cron**: Runs continuously in a loop (no cron restart needed)
- ⚡ **Auto-Restart**: PM2 auto-restarts on crashes

To change the interval, edit `ecosystem.config.cjs`:

```javascript
env: {
  INTERVAL_MINUTES: '1', // Change this (1 = fastest, 5 = balanced, 10+ = conservative)
  FAST_MODE: 'true',      // Enable fast mode (skip heavy operations)
  CONTINUOUS_MODE: 'true', // Run continuously
}
```

## Example Optimizations

### 1. Memory Limit Adjustment
```
Issue: Process using 95% of memory limit
Action: Increase limit from 512MB → 768MB
Result: Prevents OOM restarts
```

### 2. Stability Improvement
```
Issue: Process restarting 50 times
Action: Increase min_uptime from 10s → 30s
Result: Reduces restart frequency
```

### 3. New Automation Creation
```
Issue: High error count detected
Action: Creates log-analyzer automation
Result: Automated error pattern detection
```

### 4. Resource Optimization
```
Issue: Process using only 20% of 2GB limit
Action: Reduce limit to 512MB
Result: Frees up system resources
```

## Integration with Other Agents

The PM2 Optimization Agent works alongside:

- **AI Development Agent** - Improves code quality
- **AI Master Orchestrator** - Coordinates all agents
- **AI Continuous Improvement** - Fast-cycle improvements
- **Error Monitor** - Detects errors
- **Health Checker** - System health monitoring

Together, these create a **self-optimizing development environment**.

## Monitoring & Troubleshooting

### Check Agent Status
```bash
npm run pm2:metrics
```

### View Real-Time Logs
```bash
npm run pm2:optimize-continuous
```

### View Latest Report
```bash
cat automation/logs/pm2-optimization-report.json | jq '.'
```

### Check Health Score
```bash
cat automation/logs/pm2-optimization-report.json | jq '.summary.systemHealthScore'
```

### Common Issues

#### Agent Not Running
```bash
# Run directly
npm run pm2:optimize

# Continuous mode
npm run pm2:optimize-continuous

# Check generated report
npm run pm2:optimize-report
```

#### No Optimizations Applied
- Check AUTO_OPTIMIZE is 'true' in ecosystem.config.cjs
- Verify the agent has permissions to write to files
- Review logs for errors

#### High Restart Count
- The agent itself may need optimization
- Check logs for crash reasons
- Increase memory limit if needed

## Safety Features

### Automatic Safeguards
- ✅ Only auto-fixes safe, reversible changes
- ✅ Non-auto-fixable issues require manual review
- ✅ Limits to 5 optimizations per run
- ✅ Maintains 100 snapshots of historical data
- ✅ All changes logged

### Manual Review Required For
- Cron schedule changes (can impact timing)
- Process deletion
- Major configuration restructuring

## Advanced Usage

### Custom Optimization Frequency

Edit `ecosystem.config.cjs` to run more/less frequently:

```javascript
// More aggressive (every hour)
cron_restart: '0 * * * *'

// Conservative (every 6 hours)
cron_restart: '0 */6 * * *'

// Daily optimization
cron_restart: '0 2 * * *'
```

### Disable Auto-Commit

If you want to review changes before committing:

```javascript
env: {
  AUTO_COMMIT: 'false',
  AUTO_PUSH: 'false',
}
```

Then manually review and commit after optimization runs.

### Integration with CI/CD

Add to your deployment pipeline:

```bash
# After deploying new code
npm run pm2:optimize

# Apply any optimizations
pm2 reload ecosystem.config.cjs
```

## Metrics Tracked

### Per Process
- Name, PID, Status
- Uptime, Restart count
- Memory usage vs limit
- CPU usage
- Error count
- Cron schedule
- Autorestart settings

### System-Wide
- Total processes
- Running/stopped/errored counts
- Total memory usage
- Average CPU
- Total restarts
- Total errors

### Trends (Historical)
- Memory usage over time
- Restart patterns
- Performance degradation
- Process stability

## Benefits

### Performance
- 🚀 Optimal resource allocation
- 🚀 Reduced unnecessary restarts
- 🚀 Better memory management
- 🚀 Improved process stability

### Automation
- 🤖 Self-optimizing infrastructure
- 🤖 Automatic problem detection
- 🤖 Proactive issue resolution
- 🤖 Continuous improvement

### Maintenance
- 📉 Reduced manual intervention
- 📉 Automated configuration updates
- 📉 Self-healing capabilities
- 📉 Better resource utilization

## Future Enhancements

Planned improvements:
- [ ] Machine learning for predictive optimization
- [ ] Automatic load balancing across instances
- [ ] Integration with monitoring services (Datadog, New Relic)
- [ ] Slack/email notifications for critical issues
- [ ] A/B testing of optimization strategies
- [ ] Cost optimization recommendations
- [ ] Performance regression detection

## Support & Contributing

This agent is part of the Zion Tech Group autonomous development system.

For issues or suggestions:
1. Check logs: `automation/logs/pm2-optimization.log`
2. Review report: `automation/logs/pm2-optimization-report.json`
3. Submit issue to repository

## License

Part of the Zion Tech Group project.

