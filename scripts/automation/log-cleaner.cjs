#!/usr/bin/env node

/**
 * Log Cleaner - Daily log cleanup
 * Runs daily at 2 AM to clean old logs
 */

const fs = require('fs');
const path = require('path');

class LogCleaner {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.keepDays = parseInt(process.env.KEEP_DAYS || '7', 10);
    this.cleanInterval = parseInt(process.env.CLEAN_INTERVAL || '1440', 10);
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

  async cleanLogs() {
    this.log('🧹 Starting log cleanup...', 'INFO');
    this.log(`Keeping logs from the last ${this.keepDays} days`, 'INFO');
    
    const cutoffTime = Date.now() - (this.keepDays * 24 * 60 * 60 * 1000);
    const logFiles = fs.readdirSync(this.logsDir);
    
    let deletedCount = 0;
    let deletedSize = 0;
    let keptCount = 0;
    
    logFiles.forEach(file => {
      const filePath = path.join(this.logsDir, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        // Don't delete directories or report files
        if (stats.isDirectory() || file.includes('report.json')) {
          keptCount++;
          return;
        }
        
        if (stats.mtime.getTime() < cutoffTime) {
          deletedSize += stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          this.log(`🗑️  Deleted old log: ${file}`, 'INFO');
        } else {
          keptCount++;
        }
      } catch (error) {
        this.log(`⚠️ Could not process ${file}: ${error.message}`, 'WARN');
      }
    });

    const deletedSizeMB = (deletedSize / (1024 * 1024)).toFixed(2);
    
    this.log(`✅ Cleanup complete. Deleted ${deletedCount} files (${deletedSizeMB} MB), kept ${keptCount} files`, 'SUCCESS');
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      keepDays: this.keepDays,
      deletedCount,
      deletedSize: deletedSizeMB + ' MB',
      keptCount
    };

    const reportPath = path.join(this.logsDir, 'log-cleaner-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  async run() {
    this.log('🚀 Log Cleaner starting...', 'INFO');
    
    this.log(`Clean interval: ${this.cleanInterval} minutes`, 'INFO');
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.cleanLogs();
      this.log('✅ Log cleaner completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping log cleaner...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.cleanInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Log cleaner failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the log cleaner
const cleaner = new LogCleaner();
cleaner.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

