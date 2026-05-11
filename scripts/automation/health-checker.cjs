#!/usr/bin/env node

/**
 * Health Checker - Continuous system health monitoring
 * Runs every 3 minutes to check system health
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class HealthChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.checkInterval = parseInt(process.env.CHECK_INTERVAL || '3', 10);
    this.continuousMode =
      process.argv.includes('--continuous') ||
      process.env.RUN_CONTINUOUSLY === 'true' ||
      process.env.CONTINUOUS_MODE === 'true';
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(logMessage);
  }

  getSystemMetrics() {
    return {
      cpuUsage: os.loadavg()[0],
      memoryUsage: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        percentage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
      },
      uptime: os.uptime()
    };
  }

  checkPM2Status() {
    try {
      const output = execSync('pm2 jlist', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const processes = JSON.parse(output);
      
      return {
        total: processes.length,
        online: processes.filter(p => p.pm2_env.status === 'online').length,
        stopped: processes.filter(p => p.pm2_env.status === 'stopped').length,
        errored: processes.filter(p => p.pm2_env.status === 'errored').length,
        processes: processes.map(p => ({
          name: p.name,
          status: p.pm2_env.status,
          cpu: p.monit.cpu,
          memory: p.monit.memory,
          restarts: p.pm2_env.restart_time
        }))
      };
    } catch (error) {
      this.log(`⚠️ Could not get PM2 status: ${error.message}`, 'WARN');
      return { error: error.message };
    }
  }

  checkBuildHealth() {
    try {
      const distDir = path.join(this.projectRoot, 'dist');
      if (fs.existsSync(distDir)) {
        const stats = fs.statSync(distDir);
        return {
          exists: true,
          lastModified: stats.mtime,
          age: Date.now() - stats.mtime.getTime()
        };
      }
      return { exists: false };
    } catch (error) {
      return { error: error.message };
    }
  }

  checkDiskSpace() {
    try {
      const output = execSync('df -h .', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const lines = output.split('\n');
      if (lines.length > 1) {
        const parts = lines[1].split(/\s+/);
        return {
          total: parts[1],
          used: parts[2],
          available: parts[3],
          percentage: parts[4]
        };
      }
    } catch (error) {
      this.log(`⚠️ Could not check disk space: ${error.message}`, 'WARN');
    }
    return { error: 'Could not determine disk space' };
  }

  async performHealthCheck() {
    this.log('🏥 Starting health check...', 'INFO');
    
    const health = {
      timestamp: new Date().toISOString(),
      system: this.getSystemMetrics(),
      pm2: this.checkPM2Status(),
      build: this.checkBuildHealth(),
      disk: this.checkDiskSpace(),
      checkInterval: this.checkInterval
    };

    // Determine overall health status
    let status = 'healthy';
    const issues = [];

    // Check memory usage
    if (health.system.memoryUsage.percentage > 90) {
      status = 'warning';
      issues.push('High memory usage');
    }

    // Check PM2 processes
    if (health.pm2 && health.pm2.errored > 0) {
      status = 'critical';
      issues.push(`${health.pm2.errored} PM2 processes in error state`);
    }

    // Check build freshness (warn if older than 24 hours)
    if (health.build.exists && health.build.age > 24 * 60 * 60 * 1000) {
      status = status === 'healthy' ? 'warning' : status;
      issues.push('Build is older than 24 hours');
    }

    health.status = status;
    health.issues = issues;

    // Save health report
    const reportPath = path.join(this.logsDir, 'health-check-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(health, null, 2));

    this.log(`📊 Health check complete. Status: ${status}`, 
      status === 'healthy' ? 'SUCCESS' : status === 'warning' ? 'WARN' : 'ERROR');
    
    if (issues.length > 0) {
      issues.forEach(issue => this.log(`⚠️ ${issue}`, 'WARN'));
    } else {
      this.log('✅ All systems healthy', 'SUCCESS');
    }

    return health;
  }

  async run() {
    this.log('🚀 Health Checker starting...', 'INFO');
    this.log(`Check interval: ${this.checkInterval} minutes`, 'INFO');
    
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.performHealthCheck();
      this.log('✅ Health check completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping health checker...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.checkInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Health check failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the health checker
const checker = new HealthChecker();
checker.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

