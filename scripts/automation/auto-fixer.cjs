#!/usr/bin/env node

/**
 * Auto Fixer - Automated error fixing
 * Runs every 10 minutes to automatically fix common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.fixInterval = parseInt(process.env.FIX_INTERVAL || '10', 10);
    this.continuousMode =
      process.argv.includes('--continuous') ||
      process.env.RUN_CONTINUOUSLY === 'true' ||
      process.env.CONTINUOUS_MODE === 'true';
    this.autoFix = process.env.AUTO_FIX === 'true';
    this.ensureDirectories();
    this.fixesApplied = [];
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

  async runFix(command, description) {
    this.log(`🔧 Applying fix: ${description}`, 'INFO');
    try {
      const output = execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 120000 // 2 minute timeout
      });
      this.log(`✅ Fix applied: ${description}`, 'SUCCESS');
      this.fixesApplied.push({ description, success: true, timestamp: new Date().toISOString() });
      return { success: true, output };
    } catch (error) {
      this.log(`❌ Fix failed: ${description} - ${error.message}`, 'ERROR');
      this.fixesApplied.push({ description, success: false, error: error.message, timestamp: new Date().toISOString() });
      return { success: false, error: error.message };
    }
  }

  async applyFixes() {
    this.log('🔧 Starting auto-fix routine...', 'INFO');

    if (!this.autoFix) {
      this.log('⚠️ Auto-fix is disabled. Set AUTO_FIX=true to enable.', 'WARN');
      return;
    }

    // Fix 1: Auto-format code with ESLint
    await this.runFix('npm run lint', 'ESLint auto-fix');

    // Fix 2: Remove node_modules/.cache if it exists
    const cacheDir = path.join(this.projectRoot, 'node_modules', '.cache');
    if (fs.existsSync(cacheDir)) {
      await this.runFix(`rm -rf ${cacheDir}`, 'Clear node_modules cache');
    }

    // Fix 3: Clear Next.js cache
    const nextCache = path.join(this.projectRoot, '.next', 'cache');
    if (fs.existsSync(nextCache)) {
      await this.runFix(`rm -rf ${nextCache}`, 'Clear Next.js cache');
    }

    // Fix 4: Check and fix file permissions
    await this.runFix('find scripts -name "*.sh" -exec chmod +x {} \\;', 'Fix script permissions');

    // Fix 5: Clean up old log files (older than 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const logFiles = fs.readdirSync(this.logsDir);
    let cleanedLogs = 0;
    
    logFiles.forEach(file => {
      const filePath = path.join(this.logsDir, file);
      try {
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          cleanedLogs++;
        }
      } catch (error) {
        // Skip files we can't access
      }
    });

    if (cleanedLogs > 0) {
      this.log(`🧹 Cleaned up ${cleanedLogs} old log files`, 'SUCCESS');
      this.fixesApplied.push({ 
        description: 'Clean old logs', 
        success: true, 
        count: cleanedLogs,
        timestamp: new Date().toISOString() 
      });
    }

    // Generate fix report
    const report = {
      timestamp: new Date().toISOString(),
      fixInterval: this.fixInterval,
      autoFixEnabled: this.autoFix,
      fixesApplied: this.fixesApplied,
      successfulFixes: this.fixesApplied.filter(f => f.success).length,
      failedFixes: this.fixesApplied.filter(f => !f.success).length
    };

    const reportPath = path.join(this.logsDir, 'auto-fixer-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`📊 Auto-fix complete. Applied ${report.successfulFixes} fixes, ${report.failedFixes} failed`, 
      report.failedFixes === 0 ? 'SUCCESS' : 'WARN');
  }

  async run() {
    this.log('🚀 Auto Fixer starting...', 'INFO');
    this.log(`Fix interval: ${this.fixInterval} minutes`, 'INFO');
    this.log(`Auto-fix enabled: ${this.autoFix}`, 'INFO');
    
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.applyFixes();
      this.log('✅ Auto fixer completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping auto fixer...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.fixInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Auto fixer failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the auto fixer
const fixer = new AutoFixer();
fixer.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

