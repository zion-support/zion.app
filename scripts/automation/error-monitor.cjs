#!/usr/bin/env node

/**
 * Error Monitor - Continuous error detection and logging
 * Runs every 5 minutes to detect and report errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ErrorMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.scanInterval = parseInt(process.env.SCAN_INTERVAL || '5', 10);
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

  async scanForErrors() {
    this.log('🔍 Starting error scan...', 'INFO');
    
    const errors = [];

    try {
      // Check for TypeScript errors
      this.log('Checking TypeScript errors...', 'INFO');
      try {
        execSync('npx tsc --noEmit', { 
          cwd: this.projectRoot, 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        this.log('✅ No TypeScript errors found', 'SUCCESS');
      } catch (error) {
        const errorOutput = error.stdout || error.stderr || error.message;
        this.log(`⚠️ TypeScript errors detected`, 'WARN');
        errors.push({ type: 'TypeScript', count: (errorOutput.match(/error TS/g) || []).length });
      }

      // Check for ESLint errors
      this.log('Checking ESLint errors...', 'INFO');
      try {
        execSync('npm run lint:check', { 
          cwd: this.projectRoot, 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        this.log('✅ No ESLint errors found', 'SUCCESS');
      } catch (error) {
        const errorOutput = error.stdout || error.stderr || error.message;
        this.log(`⚠️ ESLint errors detected`, 'WARN');
        errors.push({ type: 'ESLint', count: (errorOutput.match(/error/g) || []).length });
      }

      // Check build logs for errors
      this.log('Scanning build logs for errors...', 'INFO');
      const logFiles = fs.readdirSync(this.logsDir).filter(f => f.endsWith('.log'));
      let logErrors = 0;
      
      logFiles.forEach(logFile => {
        try {
          const content = fs.readFileSync(path.join(this.logsDir, logFile), 'utf8');
          const errorCount = (content.match(/error|Error|ERROR|fatal|Fatal|FATAL/gi) || []).length;
          if (errorCount > 0) {
            logErrors += errorCount;
          }
        } catch (err) {
          // Skip unreadable log files
        }
      });

      if (logErrors > 0) {
        this.log(`⚠️ Found ${logErrors} error mentions in logs`, 'WARN');
        errors.push({ type: 'Logs', count: logErrors });
      } else {
        this.log('✅ No critical errors in logs', 'SUCCESS');
      }

      // Generate report
      const report = {
        timestamp: new Date().toISOString(),
        errors: errors,
        totalErrors: errors.reduce((sum, e) => sum + e.count, 0),
        scanInterval: this.scanInterval,
        status: errors.length === 0 ? 'healthy' : 'issues_detected'
      };

      const reportPath = path.join(this.logsDir, 'error-monitor-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      this.log(`📊 Error scan complete. Total errors: ${report.totalErrors}`, 
        report.totalErrors === 0 ? 'SUCCESS' : 'WARN');

      return report;

    } catch (error) {
      this.log(`❌ Error during scan: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async run() {
    this.log('🚀 Error Monitor starting...', 'INFO');
    this.log(`Scan interval: ${this.scanInterval} minutes`, 'INFO');
    
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.scanForErrors();
      this.log('✅ Error monitor completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping error monitor...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.scanInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Error monitor failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the monitor
const monitor = new ErrorMonitor();
monitor.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

