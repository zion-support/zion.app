#!/usr/bin/env node

/**
 * Comprehensive Continuous Automation System
 * Zion Tech Group - Advanced Automation Orchestrator
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

class ComprehensiveContinuousAutomation {
  constructor() {
    this.projectRoot = process.cwd();
    this.reportsDir = path.join(this.projectRoot, 'automation-reports');
    this.logsDir = path.join(this.projectRoot, 'automation/logs');
    this.ensureDirectories();
    this.automationTasks = [];
    this.isRunning = false;
    this.runningJobs = new Set();
  }

  ensureDirectories() {
    [this.reportsDir, this.logsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    const logFile = path.join(this.logsDir, `continuous-automation-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage + '\n');
  }

  async runCommand(command, description, timeout = 300000) {
    this.log(`🚀 Running: ${description}`);
    try {
      const result = execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        timeout: timeout,
        maxBuffer: 10 * 1024 * 1024,
      });
      this.log(`✅ Completed: ${description}`, 'success');
      return { success: true, output: result, description };
    } catch (error) {
      const stdout = error.stdout ? String(error.stdout) : '';
      const stderr = error.stderr ? String(error.stderr) : '';
      const firstDiagnosticLine = (stderr || stdout).trim().split('\n')[0] || 'No command output';
      this.log(`❌ Failed: ${description} - ${error.message} | ${firstDiagnosticLine}`, 'error');
      return {
        success: false,
        error: error.message,
        stdout,
        stderr,
        description,
      };
    }
  }

  async runGuarded(jobName, work) {
    if (this.runningJobs.has(jobName)) {
      this.log(`⏭️ Skipping ${jobName}: previous run is still active`, 'warn');
      return { skipped: true, reason: 'already_running', jobName };
    }

    this.runningJobs.add(jobName);
    try {
      return await work();
    } finally {
      this.runningJobs.delete(jobName);
    }
  }

  async runPM2Command(command, description) {
    return this.runCommand(`pm2 ${command}`, description);
  }

  async runNPMCommand(command, description) {
    return this.runCommand(`npm run ${command}`, description);
  }

  async runNodeScript(scriptPath, description) {
    return this.runCommand(`node ${scriptPath}`, description);
  }

  async executeAutomationTask(task) {
    this.log(`🎯 Executing automation task: ${task.name}`);
    
    const results = [];
    for (const command of task.commands) {
      const result = await this.runCommand(command.cmd, command.desc, command.timeout);
      results.push(result);
      
      if (!result.success && task.stopOnError) {
        this.log(`🛑 Stopping task ${task.name} due to error`, 'error');
        break;
      }
    }
    
    return {
      task: task.name,
      results: results,
      success: results.every(r => r.success),
      timestamp: new Date().toISOString()
    };
  }

  async runHealthChecks() {
    this.log('🏥 Running health checks...');
    
    const healthChecks = [
      {
        name: 'PM2 Status Check',
        commands: [
          { cmd: 'pm2 status', desc: 'Check PM2 process status', timeout: 30000 }
        ],
        stopOnError: false
      },
      {
        name: 'Build Health Check',
        commands: [
          { cmd: 'npm run build', desc: 'Test build process', timeout: 300000 }
        ],
        stopOnError: false
      },
      {
        name: 'Lint Health Check',
        commands: [
          { cmd: 'npm run lint:check', desc: 'Check code quality', timeout: 120000 }
        ],
        stopOnError: false
      }
    ];

    const results = [];
    for (const check of healthChecks) {
      const result = await this.executeAutomationTask(check);
      results.push(result);
    }

    return results;
  }

  async runErrorPrevention() {
    this.log('🛡️ Running error prevention tasks...');
    
    const errorPreventionTasks = [
      {
        name: 'Syntax Error Fixing',
        commands: [
          { cmd: 'node scripts/automation/syntax-fixer.cjs', desc: 'Fix syntax errors', timeout: 120000 }
        ],
        stopOnError: false
      },
      {
        name: 'Automated Code Fixing',
        commands: [
          { cmd: 'AUTO_FIX=true node scripts/automation/auto-fixer.cjs', desc: 'Run automated code fixes', timeout: 180000 }
        ],
        stopOnError: false
      },
      {
        name: 'TypeScript Health Validation',
        commands: [
          { cmd: 'npm run type-check', desc: 'Validate TypeScript health', timeout: 120000 }
        ],
        stopOnError: false
      }
    ];

    const results = [];
    for (const task of errorPreventionTasks) {
      const result = await this.executeAutomationTask(task);
      results.push(result);
    }

    return results;
  }

  async runPerformanceOptimization() {
    this.log('⚡ Running performance optimization...');
    
    const performanceTasks = [
      {
        name: 'Build Monitoring',
        commands: [
          { cmd: 'node scripts/automation/build-monitor.cjs', desc: 'Monitor build artifacts and freshness', timeout: 120000 }
        ],
        stopOnError: false
      },
      {
        name: 'Runtime Performance Checks',
        commands: [
          { cmd: 'npm run perf', desc: 'Run performance checks', timeout: 180000 }
        ],
        stopOnError: false
      }
    ];

    const results = [];
    for (const task of performanceTasks) {
      const result = await this.executeAutomationTask(task);
      results.push(result);
    }

    return results;
  }

  async runSecurityAudit() {
    this.log('🔒 Running security audit...');
    
    const securityTasks = [
      {
        name: 'Security Monitoring',
        commands: [
          { cmd: 'node automation/ai-security-scanner-agent.cjs run', desc: 'Run security scanner agent', timeout: 180000 }
        ],
        stopOnError: false
      },
      {
        name: 'Dependency Security Check',
        commands: [
          { cmd: 'npm audit --audit-level moderate', desc: 'Check dependency vulnerabilities', timeout: 90000 }
        ],
        stopOnError: false
      }
    ];

    const results = [];
    for (const task of securityTasks) {
      const result = await this.executeAutomationTask(task);
      results.push(result);
    }

    return results;
  }

  async runMarketingAutomation() {
    this.log('📢 Running marketing automation...');
    
    const marketingTasks = [
      {
        name: 'LinkedIn Automation',
        commands: [
          { cmd: 'node automation/ai-social-media-automation.cjs generate aiInsight', desc: 'Generate LinkedIn-ready content', timeout: 120000 }
        ],
        stopOnError: false
      },
      {
        name: 'Content Generation',
        commands: [
          { cmd: 'node automation/ai-content-generator-automation.cjs generate blog', desc: 'Generate website content', timeout: 180000 }
        ],
        stopOnError: false
      }
    ];

    const results = [];
    for (const task of marketingTasks) {
      const result = await this.executeAutomationTask(task);
      results.push(result);
    }

    return results;
  }

  async runComprehensiveAutomation() {
    this.log('🎯 Starting comprehensive automation cycle...');
    
    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      cycle: {
        healthChecks: await this.runHealthChecks(),
        errorPrevention: await this.runErrorPrevention(),
        performanceOptimization: await this.runPerformanceOptimization(),
        securityAudit: await this.runSecurityAudit(),
        marketingAutomation: await this.runMarketingAutomation()
      },
      summary: {
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 0,
        duration: 0
      }
    };

    // Calculate summary
    Object.values(results.cycle).forEach(category => {
      category.forEach(task => {
        results.summary.totalTasks++;
        if (task.success) {
          results.summary.successfulTasks++;
        } else {
          results.summary.failedTasks++;
        }
      });
    });

    results.summary.duration = Date.now() - startTime;

    // Save report
    const reportPath = path.join(this.reportsDir, `comprehensive-automation-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    
    this.log(`📊 Comprehensive automation completed in ${results.summary.duration}ms`);
    this.log(`📈 Success rate: ${results.summary.successfulTasks}/${results.summary.totalTasks} tasks`);
    
    return results;
  }

  setupCronJobs() {
    this.log('⏰ Setting up cron jobs for continuous automation...');
    
    // Every 15 minutes - Health checks and error prevention
    cron.schedule('*/15 * * * *', async () => {
      await this.runGuarded('scheduled-health-and-prevention', async () => {
        this.log('🔄 Running scheduled health checks...');
        await this.runHealthChecks();
        await this.runErrorPrevention();
      });
    });

    // Every hour - Performance optimization
    cron.schedule('0 * * * *', async () => {
      await this.runGuarded('scheduled-performance-optimization', async () => {
        this.log('🔄 Running scheduled performance optimization...');
        await this.runPerformanceOptimization();
      });
    });

    // Every 6 hours - Security audit
    cron.schedule('0 */6 * * *', async () => {
      await this.runGuarded('scheduled-security-audit', async () => {
        this.log('🔄 Running scheduled security audit...');
        await this.runSecurityAudit();
      });
    });

    // Every 12 hours - Marketing automation
    cron.schedule('0 */12 * * *', async () => {
      await this.runGuarded('scheduled-marketing-automation', async () => {
        this.log('🔄 Running scheduled marketing automation...');
        await this.runMarketingAutomation();
      });
    });

    // Daily at 2 AM - Comprehensive automation
    cron.schedule('0 2 * * *', async () => {
      await this.runGuarded('scheduled-daily-comprehensive-cycle', async () => {
        this.log('🔄 Running daily comprehensive automation...');
        await this.runComprehensiveAutomation();
      });
    });

    this.log('✅ Cron jobs setup completed');
  }

  async startContinuousMode() {
    this.log('🚀 Starting continuous automation mode...');
    this.isRunning = true;
    
    // Setup cron jobs
    this.setupCronJobs();
    
    // Run initial comprehensive automation
    await this.runGuarded('initial-comprehensive-cycle', async () => this.runComprehensiveAutomation());
    
    // Keep the process alive
    this.log('🔄 Continuous automation mode active. Press Ctrl+C to stop.');
    
    const shutdown = (signal) => {
      this.log(`🛑 Received ${signal}. Stopping continuous automation...`);
      this.isRunning = false;
    };

    process.on('SIGINT', () => {
      shutdown('SIGINT');
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      shutdown('SIGTERM');
      process.exit(0);
    });

    // Keep alive loop
    while (this.isRunning) {
      await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
    }
  }

  async run() {
    this.log('🎯 Starting Comprehensive Continuous Automation System...');
    
    try {
      const runContinuously =
        process.argv.includes('--continuous') ||
        process.env.RUN_CONTINUOUSLY === 'true';

      if (runContinuously) {
        await this.startContinuousMode();
      } else {
        await this.runComprehensiveAutomation();
      }
    } catch (error) {
      this.log(`❌ Automation system error: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Run the automation
if (require.main === module) {
  const automation = new ComprehensiveContinuousAutomation();
  automation.run().catch(console.error);
}

module.exports = ComprehensiveContinuousAutomation;
