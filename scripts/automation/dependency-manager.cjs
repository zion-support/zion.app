#!/usr/bin/env node

/**
 * Dependency Manager - Automated dependency monitoring
 * Runs hourly to check for dependency issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.autoUpdate = process.env.AUTO_UPDATE === 'true';
    this.checkInterval = parseInt(process.env.CHECK_INTERVAL || '60', 10);
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

  async checkDependencies() {
    this.log('📦 Checking dependencies...', 'INFO');
    
    const issues = [];

    // Check for outdated packages
    try {
      this.log('Checking for outdated packages...', 'INFO');
      const output = execSync('npm outdated --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      if (output) {
        const outdated = JSON.parse(output);
        const count = Object.keys(outdated).length;
        if (count > 0) {
          this.log(`⚠️ Found ${count} outdated packages`, 'WARN');
          issues.push({ type: 'outdated', count, packages: Object.keys(outdated) });
        }
      }
    } catch (error) {
      // npm outdated exits with code 1 when there are outdated packages
      if (error.stdout) {
        try {
          const outdated = JSON.parse(error.stdout);
          const count = Object.keys(outdated).length;
          if (count > 0) {
            this.log(`⚠️ Found ${count} outdated packages`, 'WARN');
            issues.push({ type: 'outdated', count, packages: Object.keys(outdated) });
          }
        } catch (parseError) {
          // Ignore parse errors
        }
      }
    }

    // Check for security vulnerabilities
    try {
      this.log('Checking for security vulnerabilities...', 'INFO');
      const output = execSync('npm audit --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const audit = JSON.parse(output);
      if (audit.metadata && audit.metadata.vulnerabilities) {
        const vulns = audit.metadata.vulnerabilities;
        const total = vulns.critical + vulns.high + vulns.moderate + vulns.low;
        
        if (total > 0) {
          this.log(`⚠️ Found ${total} vulnerabilities (Critical: ${vulns.critical}, High: ${vulns.high})`, 'WARN');
          issues.push({ 
            type: 'vulnerabilities', 
            total, 
            critical: vulns.critical,
            high: vulns.high,
            moderate: vulns.moderate,
            low: vulns.low
          });
        } else {
          this.log('✅ No security vulnerabilities found', 'SUCCESS');
        }
      }
    } catch (error) {
      // npm audit exits with code 1 when there are vulnerabilities
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout);
          if (audit.metadata && audit.metadata.vulnerabilities) {
            const vulns = audit.metadata.vulnerabilities;
            const total = vulns.critical + vulns.high + vulns.moderate + vulns.low;
            
            if (total > 0) {
              this.log(`⚠️ Found ${total} vulnerabilities (Critical: ${vulns.critical}, High: ${vulns.high})`, 'WARN');
              issues.push({ 
                type: 'vulnerabilities', 
                total, 
                critical: vulns.critical,
                high: vulns.high,
                moderate: vulns.moderate,
                low: vulns.low
              });
            }
          }
        } catch (parseError) {
          // Ignore parse errors
        }
      }
    }

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      autoUpdate: this.autoUpdate,
      issues: issues,
      totalIssues: issues.length,
      status: issues.length === 0 ? 'healthy' : 'needs_attention'
    };

    const reportPath = path.join(this.logsDir, 'dependency-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`📊 Dependency check complete. Found ${issues.length} issues`, 
      issues.length === 0 ? 'SUCCESS' : 'WARN');

    return report;
  }

  async run() {
    this.log('🚀 Dependency Manager starting...', 'INFO');
    this.log(`Auto-update: ${this.autoUpdate}`, 'INFO');
    
    this.log(`Check interval: ${this.checkInterval} minutes`, 'INFO');
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.checkDependencies();
      this.log('✅ Dependency manager completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping dependency manager...`, 'WARN');
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
      this.log(`❌ Dependency manager failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the dependency manager
const manager = new DependencyManager();
manager.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

