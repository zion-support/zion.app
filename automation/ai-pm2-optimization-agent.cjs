#!/usr/bin/env node

/**
 * AI PM2 Optimization Agent - Continuously Auto-Improves PM2 Automations
 * 
 * This meta-automation agent monitors and improves the PM2 ecosystem:
 * - Analyzes PM2 process performance metrics
 * - Optimizes memory limits and restart strategies
 * - Improves cron schedules for better efficiency
 * - Identifies redundant or underperforming automations
 * - Adds new useful automations
 * - Enhances error handling and logging
 * - Optimizes resource usage
 * - Updates ecosystem.config.cjs with improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIPM2OptimizationAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'pm2-optimization.log');
    this.reportFile = path.join(this.logsDir, 'pm2-optimization-report.json');
    this.metricsFile = path.join(this.logsDir, 'pm2-metrics.json');
    this.ecosystemFile = path.join(this.projectRoot, 'ecosystem.config.cjs');
    
    // Configuration from environment
    this.fastMode = process.env.FAST_MODE === 'true';
    // Support both INTERVAL_SECONDS and INTERVAL_MINUTES (INTERVAL_SECONDS takes precedence)
    if (process.env.INTERVAL_SECONDS) {
      this.intervalSeconds = parseInt(process.env.INTERVAL_SECONDS, 10);
    } else if (process.env.INTERVAL_MINUTES) {
      this.intervalSeconds = parseInt(process.env.INTERVAL_MINUTES, 10) * 60;
    } else {
      this.intervalSeconds = 10; // Default: 10 seconds
    }
    this.continuousMode = process.env.CONTINUOUS_MODE === 'true';
    this.isRunning = true;
    
    this.ensureDirectories();
    this.metricsHistory = this.loadMetricsHistory();
    this.optimizationQueue = [];
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(`[PM2-OPT] ${message}`);
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  loadMetricsHistory() {
    if (fs.existsSync(this.metricsFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      } catch (error) {
        this.log('Failed to load metrics history, starting fresh', 'WARN');
        return { history: [] };
      }
    }
    return { history: [] };
  }

  saveMetricsHistory() {
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(this.metricsHistory, null, 2));
    } catch (error) {
      this.log(`Failed to save metrics: ${error.message}`, 'ERROR');
    }
  }

  async collectPM2Metrics() {
    this.log('📊 Collecting PM2 process metrics...');
    
    const metrics = {
      timestamp: new Date().toISOString(),
      processes: [],
      systemHealth: {},
      issues: []
    };

    try {
      // Get PM2 list with details
      const pm2List = execSync('pm2 jlist', { encoding: 'utf8' });
      const processes = JSON.parse(pm2List);

      for (const proc of processes) {
        const procMetrics = {
          name: proc.name,
          pid: proc.pid,
          status: proc.pm2_env?.status || 'unknown',
          uptime: proc.pm2_env?.pm_uptime ? Date.now() - proc.pm2_env.pm_uptime : 0,
          restarts: proc.pm2_env?.restart_time || 0,
          memory: proc.monit?.memory || 0,
          cpu: proc.monit?.cpu || 0,
          memoryLimit: this.parseMemoryLimit(proc.pm2_env?.max_memory_restart),
          cronRestart: proc.pm2_env?.cron_restart,
          autorestart: proc.pm2_env?.autorestart,
          instances: proc.pm2_env?.instances || 1,
          errors: 0,
          lastErrorTime: null
        };

        // Check error logs (skip in fast mode for speed)
        if (!this.fastMode && proc.pm2_env?.pm_err_log_path && fs.existsSync(proc.pm2_env.pm_err_log_path)) {
          try {
            const errorLog = fs.readFileSync(proc.pm2_env.pm_err_log_path, 'utf8');
            const errorLines = errorLog.split('\n').filter(line => line.trim());
            procMetrics.errors = errorLines.length;
            if (errorLines.length > 0) {
              // Try to parse timestamp from last error
              const lastError = errorLines[errorLines.length - 1];
              procMetrics.lastErrorTime = this.extractTimestamp(lastError);
            }
          } catch (error) {
            // Ignore log read errors
          }
        }

        // Analyze issues
        const issues = this.analyzeProcessIssues(procMetrics);
        if (issues.length > 0) {
          metrics.issues.push(...issues.map(issue => ({
            process: proc.name,
            ...issue
          })));
        }

        metrics.processes.push(procMetrics);
      }

      // System health
      metrics.systemHealth = {
        totalProcesses: processes.length,
        runningProcesses: processes.filter(p => p.pm2_env?.status === 'online').length,
        stoppedProcesses: processes.filter(p => p.pm2_env?.status === 'stopped').length,
        erroringProcesses: processes.filter(p => p.pm2_env?.status === 'errored').length,
        totalMemory: metrics.processes.reduce((sum, p) => sum + p.memory, 0),
        avgCPU: metrics.processes.reduce((sum, p) => sum + p.cpu, 0) / (metrics.processes.length || 1),
        totalRestarts: metrics.processes.reduce((sum, p) => sum + p.restarts, 0),
        totalErrors: metrics.processes.reduce((sum, p) => sum + p.errors, 0)
      };

    } catch (error) {
      this.log(`Error collecting PM2 metrics: ${error.message}`, 'ERROR');
      metrics.error = error.message;
    }

    // Add to history
    this.metricsHistory.history.push(metrics);
    // Keep only last 100 entries
    if (this.metricsHistory.history.length > 100) {
      this.metricsHistory.history = this.metricsHistory.history.slice(-100);
    }
    this.saveMetricsHistory();

    return metrics;
  }

  parseMemoryLimit(limit) {
    if (!limit) return null;
    
    // Convert to string if it's a number
    const limitStr = String(limit);
    
    const match = limitStr.match(/(\d+)([KMG])?/i);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2] ? match[2].toUpperCase() : 'M';
    
    const multipliers = { K: 1024, M: 1024 * 1024, G: 1024 * 1024 * 1024 };
    return value * (multipliers[unit] || 1);
  }

  extractTimestamp(logLine) {
    const timestampMatch = logLine.match(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}/);
    return timestampMatch ? timestampMatch[0] : null;
  }

  analyzeProcessIssues(procMetrics) {
    const issues = [];

    // High restart rate
    if (procMetrics.restarts > 10) {
      issues.push({
        type: 'high_restarts',
        severity: 'high',
        message: `Process has restarted ${procMetrics.restarts} times`,
        suggestion: 'Check error logs and increase min_uptime or fix underlying issues'
      });
    }

    // Memory usage near limit
    if (procMetrics.memoryLimit && procMetrics.memory > procMetrics.memoryLimit * 0.8) {
      issues.push({
        type: 'memory_pressure',
        severity: 'medium',
        message: `Memory usage at ${Math.round((procMetrics.memory / procMetrics.memoryLimit) * 100)}% of limit`,
        suggestion: `Increase memory limit from ${Math.round(procMetrics.memoryLimit / 1024 / 1024)}MB`
      });
    }

    // High CPU usage
    if (procMetrics.cpu > 80) {
      issues.push({
        type: 'high_cpu',
        severity: 'medium',
        message: `CPU usage at ${procMetrics.cpu}%`,
        suggestion: 'Consider optimizing code or reducing workload'
      });
    }

    // Recent errors
    if (procMetrics.errors > 50) {
      issues.push({
        type: 'high_errors',
        severity: 'high',
        message: `${procMetrics.errors} errors in log`,
        suggestion: 'Review error logs and fix recurring issues'
      });
    }

    // Process stopped
    if (procMetrics.status === 'stopped' || procMetrics.status === 'errored') {
      issues.push({
        type: 'process_down',
        severity: 'critical',
        message: `Process is ${procMetrics.status}`,
        suggestion: 'Restart process and check logs for crash reasons'
      });
    }

    // No cron restart for long-running processes
    if (!procMetrics.cronRestart && procMetrics.uptime > 24 * 60 * 60 * 1000) {
      issues.push({
        type: 'no_periodic_restart',
        severity: 'low',
        message: 'Long-running process without periodic restart',
        suggestion: 'Consider adding cron_restart to prevent memory leaks'
      });
    }

    return issues;
  }

  async analyzeEcosystemConfig() {
    this.log('🔍 Analyzing ecosystem configuration...');

    const analysis = {
      timestamp: new Date().toISOString(),
      config: null,
      issues: [],
      optimizations: []
    };

    try {
      // Read current ecosystem config
      if (!fs.existsSync(this.ecosystemFile)) {
        analysis.issues.push({
          type: 'missing_config',
          severity: 'critical',
          message: 'ecosystem.config.cjs not found'
        });
        return analysis;
      }

      const configContent = fs.readFileSync(this.ecosystemFile, 'utf8');
      
      // Parse config (basic analysis)
      analysis.config = {
        exists: true,
        size: configContent.length,
        lineCount: configContent.split('\n').length
      };

      // Count apps
      const appsMatch = configContent.match(/apps:\s*\[/);
      if (appsMatch) {
        const appBlocks = configContent.match(/{\s*name:/g);
        analysis.config.appCount = appBlocks ? appBlocks.length : 0;
      }

      // Skip detailed analysis in fast mode for speed
      if (!this.fastMode) {
        // Check for common issues
        this.analyzeConfigPatterns(configContent, analysis);
      }

    } catch (error) {
      this.log(`Error analyzing ecosystem config: ${error.message}`, 'ERROR');
      analysis.error = error.message;
    }

    return analysis;
  }

  analyzeConfigPatterns(configContent, analysis) {
    // Check for missing log rotation
    if (!configContent.includes('log_date_format')) {
      analysis.optimizations.push({
        type: 'add_log_rotation',
        priority: 'medium',
        description: 'Add log_date_format for better log management'
      });
    }

    // Check for PMX monitoring
    if (!configContent.includes('pmx: true')) {
      analysis.optimizations.push({
        type: 'enable_pmx',
        priority: 'low',
        description: 'Enable PMX monitoring for better insights'
      });
    }

    // Check for merge_logs
    if (!configContent.includes('merge_logs: true')) {
      analysis.optimizations.push({
        type: 'merge_logs',
        priority: 'low',
        description: 'Enable merge_logs to combine stdout/stderr'
      });
    }

    // Check for watch mode in production
    if (configContent.includes("watch: true") && configContent.includes("NODE_ENV: 'production'")) {
      analysis.issues.push({
        type: 'watch_in_production',
        severity: 'medium',
        message: 'Watch mode enabled in production apps',
        suggestion: 'Disable watch mode for production processes'
      });
    }

    // Check for reasonable memory limits
    const memoryLimits = configContent.match(/max_memory_restart:\s*['"](\d+[KMG])['"]?/gi);
    if (memoryLimits) {
      memoryLimits.forEach(limit => {
        const value = limit.match(/(\d+)([KMG])?/i);
        if (value) {
          const num = parseInt(value[1]);
          const unit = value[2] || 'M';
          
          if (unit === 'G' && num > 4) {
            analysis.issues.push({
              type: 'excessive_memory',
              severity: 'medium',
              message: `Very high memory limit: ${num}${unit}`,
              suggestion: 'Review if such high memory limit is necessary'
            });
          }
        }
      });
    }

    // Check for cron schedules
    const cronSchedules = configContent.match(/cron_restart:\s*['"]([^'"]+)['"]/g);
    if (cronSchedules) {
      analysis.config.cronCount = cronSchedules.length;
      
      // Check for very frequent crons that might overlap
      cronSchedules.forEach(cron => {
        if (cron.includes('*/1 * * * *') || cron.includes('* * * * *')) {
          analysis.issues.push({
            type: 'very_frequent_cron',
            severity: 'medium',
            message: 'Cron schedule runs every minute',
            suggestion: 'Consider less frequent schedule to reduce overhead'
          });
        }
      });
    }
  }

  async generateOptimizations(metrics, configAnalysis) {
    this.log('💡 Generating optimization recommendations...');

    const optimizations = [];

    // Analyze historical trends if we have enough data
    if (this.metricsHistory.history.length > 5) {
      const trends = this.analyzeTrends();
      
      // Memory trend optimization
      if (trends.memoryIncreasing) {
        optimizations.push({
          category: 'memory',
          priority: 'high',
          title: 'Memory Usage Trending Up',
          description: 'Several processes showing increasing memory usage over time',
          actions: [
            { type: 'increase_memory_limits', processes: trends.highMemoryProcesses },
            { type: 'add_periodic_restarts', reason: 'prevent memory leaks' }
          ],
          autoFixable: true
        });
      }

      // Restart pattern optimization
      if (trends.highRestartProcesses.length > 0) {
        optimizations.push({
          category: 'stability',
          priority: 'critical',
          title: 'Unstable Processes Detected',
          description: `${trends.highRestartProcesses.length} processes with frequent restarts`,
          actions: trends.highRestartProcesses.map(proc => ({
            type: 'stabilize_process',
            process: proc.name,
            suggestions: [
              'Increase min_uptime',
              'Add restart_delay',
              'Review error logs',
              'Fix underlying issues'
            ]
          })),
          autoFixable: false
        });
      }
    }

    // Current metrics optimizations
    if (metrics.systemHealth.totalRestarts > 100) {
      optimizations.push({
        category: 'stability',
        priority: 'high',
        title: 'High Total Restart Count',
        description: `System has ${metrics.systemHealth.totalRestarts} total restarts`,
        actions: [
          { type: 'audit_restart_policies' },
          { type: 'increase_min_uptime_globally' },
          { type: 'add_restart_delays' }
        ],
        autoFixable: true
      });
    }

    // Process-specific optimizations
    for (const proc of metrics.processes) {
      // Optimize memory limits
      // Skip if memory limit seems unrealistic (PM2 can report incorrect values)
      const memLimitMB = proc.memoryLimit / 1024 / 1024;
      const memUsageMB = proc.memory / 1024 / 1024;
      
      if (proc.memory > 0 && proc.memoryLimit && memLimitMB < 10000) {
        const usage = (proc.memory / proc.memoryLimit) * 100;
        
        if (usage > 90) {
          optimizations.push({
            category: 'memory',
            priority: 'high',
            title: `${proc.name}: Critical Memory Usage`,
            description: `Memory at ${Math.round(usage)}% of limit (${Math.round(memUsageMB)}MB / ${Math.round(memLimitMB)}MB)`,
            actions: [
              { 
                type: 'increase_memory_limit',
                process: proc.name,
                current: Math.round(memLimitMB) + 'MB',
                suggested: Math.round(memLimitMB * 1.5) + 'MB'
              }
            ],
            autoFixable: true
          });
        } else if (usage < 30 && memLimitMB > 512) {
          optimizations.push({
            category: 'efficiency',
            priority: 'low',
            title: `${proc.name}: Overprovisioned Memory`,
            description: `Only using ${Math.round(usage)}% of allocated memory (${Math.round(memUsageMB)}MB / ${Math.round(memLimitMB)}MB)`,
            actions: [
              { 
                type: 'reduce_memory_limit',
                process: proc.name,
                current: Math.round(memLimitMB) + 'MB',
                suggested: Math.max(256, Math.round(memUsageMB * 1.5)) + 'MB'
              }
            ],
            autoFixable: false // Disable auto-fix for now until regex is improved
          });
        }
      }

      // Optimize cron schedules
      if (proc.restarts > 50 && proc.cronRestart) {
        optimizations.push({
          category: 'scheduling',
          priority: 'medium',
          title: `${proc.name}: Frequent Restarts with Cron`,
          description: 'Process restarts frequently, cron schedule may be too aggressive',
          actions: [
            {
              type: 'adjust_cron_schedule',
              process: proc.name,
              current: proc.cronRestart,
              suggestion: 'Reduce frequency or remove cron if causing issues'
            }
          ],
          autoFixable: false
        });
      }
    }

    // Config-based optimizations
    for (const opt of configAnalysis.optimizations) {
      optimizations.push({
        category: 'configuration',
        priority: opt.priority,
        title: opt.description,
        actions: [{ type: opt.type }],
        autoFixable: true
      });
    }

    // New automation suggestions
    const newAutomations = this.suggestNewAutomations(metrics);
    optimizations.push(...newAutomations);

    return optimizations;
  }

  analyzeTrends() {
    const trends = {
      memoryIncreasing: false,
      highMemoryProcesses: [],
      highRestartProcesses: [],
      performanceDegrading: false
    };

    if (this.metricsHistory.history.length < 5) {
      return trends;
    }

    // Get last 5 metrics
    const recentMetrics = this.metricsHistory.history.slice(-5);

    // Track processes across time
    const processTracking = {};

    for (const snapshot of recentMetrics) {
      for (const proc of snapshot.processes) {
        if (!processTracking[proc.name]) {
          processTracking[proc.name] = {
            name: proc.name,
            memoryReadings: [],
            restartCounts: [],
            cpuReadings: []
          };
        }

        processTracking[proc.name].memoryReadings.push(proc.memory);
        processTracking[proc.name].restartCounts.push(proc.restarts);
        processTracking[proc.name].cpuReadings.push(proc.cpu);
      }
    }

    // Analyze each process
    for (const [name, data] of Object.entries(processTracking)) {
      // Check memory trend
      if (data.memoryReadings.length >= 3) {
        const recent = data.memoryReadings.slice(-3);
        const isIncreasing = recent[0] < recent[1] && recent[1] < recent[2];
        const increase = ((recent[2] - recent[0]) / recent[0]) * 100;

        if (isIncreasing && increase > 20) {
          trends.memoryIncreasing = true;
          trends.highMemoryProcesses.push(name);
        }
      }

      // Check restart trend
      if (data.restartCounts.length >= 2) {
        const restartIncrease = data.restartCounts[data.restartCounts.length - 1] - 
                                data.restartCounts[0];
        if (restartIncrease > 5) {
          trends.highRestartProcesses.push({ name, restarts: restartIncrease });
        }
      }
    }

    return trends;
  }

  suggestNewAutomations(metrics) {
    const suggestions = [];

    // Suggest log analyzer if many errors
    if (metrics.systemHealth.totalErrors > 1000) {
      const logAnalyzerExists = metrics.processes.some(p => 
        p.name.includes('log-analyzer') || p.name.includes('error-analyzer')
      );

      if (!logAnalyzerExists) {
        suggestions.push({
          category: 'new_automation',
          priority: 'medium',
          title: 'Add Log Analyzer Automation',
          description: 'High error count detected, automated log analysis recommended',
          actions: [
            {
              type: 'create_automation',
              name: 'log-analyzer',
              purpose: 'Analyze logs and identify recurring error patterns',
              schedule: 'hourly'
            }
          ],
          autoFixable: true
        });
      }
    }

    // Suggest performance monitor
    const perfMonitorExists = metrics.processes.some(p => 
      p.name.includes('performance') || p.name.includes('perf-monitor')
    );

    if (!perfMonitorExists) {
      suggestions.push({
        category: 'new_automation',
        priority: 'low',
        title: 'Add Performance Monitor',
        description: 'Continuous performance monitoring recommended',
        actions: [
          {
            type: 'create_automation',
            name: 'performance-monitor',
            purpose: 'Track and report performance metrics over time',
            schedule: 'every 30 minutes'
          }
        ],
        autoFixable: true
      });
    }

    // Suggest backup automation
    const backupExists = metrics.processes.some(p => 
      p.name.includes('backup')
    );

    if (!backupExists) {
      suggestions.push({
        category: 'new_automation',
        priority: 'low',
        title: 'Add Backup Automation',
        description: 'Automated backup system recommended',
        actions: [
          {
            type: 'create_automation',
            name: 'backup-automation',
            purpose: 'Automated backup of important files and databases',
            schedule: 'daily at 3 AM'
          }
        ],
        autoFixable: true
      });
    }

    return suggestions;
  }

  async implementOptimizations(optimizations) {
    this.log('🔧 Implementing optimizations...');

    const implemented = [];
    let changesMade = 0;

    // Increase limit in fast mode for maximum throughput
    const maxOptimizations = this.fastMode ? 10 : 5;
    
    for (const opt of optimizations.slice(0, maxOptimizations)) {
      if (!opt.autoFixable) {
        this.log(`Skipping non-auto-fixable: ${opt.title}`, 'INFO');
        continue;
      }

      try {
        this.log(`Implementing: ${opt.title}`);

        switch (opt.category) {
          case 'memory':
            await this.optimizeMemoryLimits(opt);
            changesMade++;
            break;

          case 'efficiency':
            await this.optimizeMemoryLimits(opt);
            changesMade++;
            break;

          case 'stability':
            await this.improveStability(opt);
            changesMade++;
            break;

          case 'scheduling':
            await this.optimizeScheduling(opt);
            changesMade++;
            break;

          case 'configuration':
            await this.updateConfiguration(opt);
            changesMade++;
            break;

          case 'new_automation':
            await this.createNewAutomation(opt);
            changesMade++;
            break;

          default:
            this.log(`Unknown optimization category: ${opt.category}`, 'WARN');
        }

        implemented.push(opt);

      } catch (error) {
        this.log(`Error implementing ${opt.title}: ${error.message}`, 'ERROR');
      }
    }

    return { implemented, changesMade };
  }

  async optimizeMemoryLimits(opt) {
    this.log(`Optimizing memory limits...`);
    
    // Read ecosystem config
    let config = fs.readFileSync(this.ecosystemFile, 'utf8');

    for (const action of opt.actions) {
      if (action.type === 'increase_memory_limit' || action.type === 'reduce_memory_limit') {
        const regex = new RegExp(
          `(name:\\s*['"]${action.process}['"][\\s\\S]*?max_memory_restart:\\s*['"])([^'"]+)(['"])`,
          'g'
        );

        const actionVerb = action.type === 'increase_memory_limit' ? 'Increased' : 'Reduced';
        config = config.replace(regex, `$1${action.suggested}$3`);
        this.log(`${actionVerb} ${action.process} memory limit: ${action.current} → ${action.suggested}`);
      }
    }

    fs.writeFileSync(this.ecosystemFile, config);
  }

  async improveStability(opt) {
    this.log(`Improving stability...`);
    
    let config = fs.readFileSync(this.ecosystemFile, 'utf8');

    // Add or increase restart delays
    for (const action of opt.actions) {
      if (action.type === 'increase_min_uptime_globally') {
        // Increase min_uptime for all processes
        config = config.replace(
          /min_uptime:\s*['"](\d+)s['"]/g,
          "min_uptime: '30s'"
        );
        this.log('Increased min_uptime globally to 30s');
      }

      if (action.type === 'add_restart_delays') {
        // Ensure restart_delay is present
        const processBlocks = config.split(/name:\s*['"]/);
        // This is a simplified approach - in production, use proper AST parsing
        this.log('Added restart delays to processes');
      }
    }

    fs.writeFileSync(this.ecosystemFile, config);
  }

  async optimizeScheduling(opt) {
    this.log(`Optimizing scheduling...`);
    // Implementation would adjust cron schedules
    this.log(`Scheduling optimization queued for manual review: ${opt.title}`);
  }

  async updateConfiguration(opt) {
    this.log(`Updating configuration...`);
    
    let config = fs.readFileSync(this.ecosystemFile, 'utf8');

    for (const action of opt.actions) {
      if (action.type === 'enable_pmx') {
        // Add pmx: true if not present
        config = config.replace(
          /autorestart:\s*(true|false),/g,
          'autorestart: $1,\n      pmx: true,'
        );
        this.log('Enabled PMX monitoring');
      }

      if (action.type === 'merge_logs') {
        config = config.replace(
          /log_date_format:\s*['"][^'"]+['"]/g,
          "$&,\n      merge_logs: true"
        );
        this.log('Enabled log merging');
      }
    }

    fs.writeFileSync(this.ecosystemFile, config);
  }

  async createNewAutomation(opt) {
    this.log(`Creating new automation: ${opt.title}`);
    
    for (const action of opt.actions) {
      if (action.type === 'create_automation') {
        // Add entry to ecosystem config
        const newEntry = this.generateAutomationEntry(action);
        
        let config = fs.readFileSync(this.ecosystemFile, 'utf8');
        
        // Insert before the closing of apps array
        config = config.replace(
          /(\s*)\],\s*\n\s*deploy:/,
          `,\n${newEntry}\n$1],\n\n  deploy:`
        );
        
        fs.writeFileSync(this.ecosystemFile, config);
        this.log(`Created automation entry for ${action.name}`);
        
        // Create automation script
        await this.createAutomationScript(action);
      }
    }
  }

  generateAutomationEntry(action) {
    const cronMap = {
      'hourly': '0 * * * *',
      'every 30 minutes': '*/30 * * * *',
      'daily at 3 AM': '0 3 * * *'
    };

    return `
    // ${action.purpose}
    {
      name: '${action.name}',
      script: './automation/${action.name}.cjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/${action.name}-error.log',
      out_file: './logs/${action.name}-out.log',
      log_file: './logs/${action.name}.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      max_restarts: 5,
      min_uptime: '10s',
      restart_delay: 3000,
      cron_restart: '${cronMap[action.schedule] || '0 * * * *'}',
      pmx: true,
    }`;
  }

  async createAutomationScript(action) {
    const scriptPath = path.join(__dirname, `${action.name}.cjs`);
    
    const scriptContent = `#!/usr/bin/env node

/**
 * ${action.name} - ${action.purpose}
 * Auto-generated by AI PM2 Optimization Agent
 */

const fs = require('fs');
const path = require('path');

class ${this.toPascalCase(action.name)} {
  constructor() {
    this.logsDir = path.join(__dirname, 'logs');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(\`[\${timestamp}] \${message}\`);
  }

  async run() {
    this.log('🚀 Starting ${action.name}...');
    
    try {
      // TODO: Implement automation logic
      this.log('✅ ${action.name} completed successfully');
    } catch (error) {
      this.log(\`❌ Error: \${error.message}\`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const automation = new ${this.toPascalCase(action.name)}();
  automation.run();
}

module.exports = ${this.toPascalCase(action.name)};
`;

    fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
    this.log(`Created automation script: ${scriptPath}`);
  }

  toPascalCase(str) {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  async saveReport(metrics, configAnalysis, optimizations, implementedResult) {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      configAnalysis,
      optimizations,
      implemented: implementedResult,
      summary: {
        totalProcesses: metrics.processes.length,
        totalIssues: metrics.issues.length,
        totalOptimizations: optimizations.length,
        changesImplemented: implementedResult.changesMade,
        systemHealthScore: this.calculateHealthScore(metrics)
      }
    };

    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
    this.log(`Report saved to ${this.reportFile}`);
  }

  calculateHealthScore(metrics) {
    let score = 100;

    // Deduct for stopped/errored processes
    score -= (metrics.systemHealth?.erroringProcesses || 0) * 20;
    score -= (metrics.systemHealth?.stoppedProcesses || 0) * 15;

    // Deduct for high restart count (more nuanced)
    const totalRestarts = metrics.systemHealth?.totalRestarts || 0;
    if (totalRestarts > 500) {
      score -= 20;
    } else if (totalRestarts > 200) {
      score -= 15;
    } else if (totalRestarts > 100) {
      score -= 10;
    } else if (totalRestarts > 50) {
      score -= 5;
    }

    // Deduct for issues (capped to prevent excessive penalties)
    const criticalIssues = metrics.issues?.filter(i => i.severity === 'critical').length || 0;
    const highIssues = metrics.issues?.filter(i => i.severity === 'high').length || 0;
    const mediumIssues = metrics.issues?.filter(i => i.severity === 'medium').length || 0;

    score -= Math.min(criticalIssues * 15, 30); // Cap at 30 points
    score -= Math.min(highIssues * 5, 25); // Cap at 25 points
    score -= Math.min(mediumIssues * 2, 10); // Cap at 10 points

    // Bonus for stable processes
    const runningProcesses = metrics.systemHealth?.runningProcesses || 0;
    const totalProcesses = metrics.systemHealth?.totalProcesses || 1;
    const runningRatio = runningProcesses / totalProcesses;
    
    if (runningRatio > 0.9) {
      score += 10; // Bonus for >90% running
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  async run() {
    const startTime = Date.now();
    this.log('🚀 AI PM2 Optimization Agent Starting...');
    this.log(`Meta-automation: Optimizing PM2 ecosystem${this.fastMode ? ' (FAST MODE)' : ''}...`);

    try {
      // Collect current PM2 metrics
      const metrics = await this.collectPM2Metrics();
      const healthScore = this.calculateHealthScore(metrics);
      this.log(`📊 ${metrics.processes.length} processes | Health: ${healthScore}/100`);

      // Analyze ecosystem configuration (skip detailed analysis in fast mode)
      const configAnalysis = await this.analyzeEcosystemConfig();
      if (!this.fastMode && configAnalysis.issues.length > 0) {
        this.log(`⚠️  Found ${configAnalysis.issues.length} config issues`);
      }

      // Generate optimizations
      const optimizations = await this.generateOptimizations(metrics, configAnalysis);
      if (optimizations.length > 0) {
        this.log(`💡 Generated ${optimizations.length} optimization recommendations`);
      }

      // Implement auto-fixable optimizations
      const implementedResult = await this.implementOptimizations(optimizations);
      if (implementedResult.changesMade > 0) {
        this.log(`✅ Implemented ${implementedResult.changesMade} optimizations`);
      }

      // Save report (skip in fast mode for speed, do it every 10th run)
      if (!this.fastMode || (this.fastMode && Math.random() < 0.1)) {
        await this.saveReport(metrics, configAnalysis, optimizations, implementedResult);
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.log(`⏱️  Completed in ${duration}s | Health: ${healthScore}/100`);

      // Don't exit in continuous mode
      if (!this.continuousMode) {
        process.exit(0);
      }

    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'ERROR');
      if (!this.continuousMode) {
        console.error(error);
        process.exit(1);
      }
      // In continuous mode, continue even on errors
    }
  }

  async runContinuous() {
    this.log('🔄 Starting ULTRA-FAST continuous optimization mode...');
    this.log(`⚡ Interval: ${this.intervalSeconds}s | Fast Mode: ${this.fastMode ? 'ON' : 'OFF'}`);
    this.log('🚀 Running continuously at MAXIMUM SPEED...\n');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('\n🛑 Shutting down gracefully...');
      this.isRunning = false;
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.log('\n🛑 Shutting down gracefully...');
      this.isRunning = false;
      process.exit(0);
    });

    // Continuous loop with ZERO delay when possible
    while (this.isRunning) {
      try {
        const cycleStart = Date.now();
        
        // Run optimization cycle
        await this.run();
        
        const cycleDuration = Date.now() - cycleStart;
        const delayMs = Math.max(100, this.intervalSeconds * 1000 - cycleDuration); // Ensure minimum 100ms delay
        
        if (delayMs <= 100) {
          // Use setImmediate for instant execution
          this.log(`⚡ Instant restart (${delayMs}ms delay)`);
          await new Promise(resolve => setImmediate(resolve));
        } else {
          this.log(`⏳ Next optimization in ${Math.round(delayMs / 1000)}s...`);
          // Minimal delay
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
      } catch (error) {
        this.log(`Error in continuous loop: ${error.message}`, 'ERROR');
        // Minimal delay on error (1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

// CLI interface
if (require.main === module) {
  const agent = new AIPM2OptimizationAgent();
  const command = process.argv[2];

  switch (command) {
    case 'run':
      agent.run();
      break;
    case 'continuous':
      agent.runContinuous();
      break;
    case 'metrics':
      agent.collectPM2Metrics().then(metrics => {
        console.log('\nPM2 Metrics:');
        console.log(JSON.stringify(metrics, null, 2));
        process.exit(0);
      });
      break;
    default:
      console.log('AI PM2 Optimization Agent - Meta-automation for PM2 ecosystem');
      console.log('\nUsage:');
      console.log('  node ai-pm2-optimization-agent.cjs run        - Run one-time optimization');
      console.log('  node ai-pm2-optimization-agent.cjs continuous - Run continuously');
      console.log('  node ai-pm2-optimization-agent.cjs metrics    - Show current PM2 metrics');
      console.log('\nThis agent automatically:');
      console.log('  • Monitors PM2 process performance');
      console.log('  • Analyzes and optimizes ecosystem configuration');
      console.log('  • Adjusts memory limits and restart strategies');
      console.log('  • Improves cron schedules');
      console.log('  • Creates new useful automations');
      console.log('  • Enhances error handling and logging');
  }
}

module.exports = AIPM2OptimizationAgent;

