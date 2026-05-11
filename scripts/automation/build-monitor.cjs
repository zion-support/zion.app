#!/usr/bin/env node

/**
 * Build Monitor - Continuous build monitoring
 * Runs every 10 minutes to monitor build status
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class BuildMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.monitorContinuously = process.env.MONITOR_CONTINUOUSLY === 'true';
    this.monitorInterval = parseInt(process.env.MONITOR_INTERVAL || '10', 10);
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

  checkBuildStatus() {
    this.log('🔍 Checking build status...', 'INFO');
    
    const buildCandidates = [
      { type: 'next', dir: path.join(this.projectRoot, '.next') },
      { type: 'dist', dir: path.join(this.projectRoot, 'dist') }
    ];
    const activeBuild = buildCandidates.find(candidate => fs.existsSync(candidate.dir));

    const buildInfo = {
      exists: false,
      type: null,
      directory: null,
      lastModified: null,
      age: null,
      size: null
    };

    if (activeBuild) {
      const stats = fs.statSync(activeBuild.dir);
      buildInfo.exists = true;
      buildInfo.type = activeBuild.type;
      buildInfo.directory = activeBuild.dir;
      buildInfo.lastModified = stats.mtime;
      buildInfo.age = Date.now() - stats.mtime.getTime();
      
      // Calculate directory size
      try {
        const output = execSync(`du -sh "${activeBuild.dir}"`, {
          encoding: 'utf8',
          stdio: 'pipe'
        });
        buildInfo.size = output.split('\t')[0];
      } catch (error) {
        buildInfo.size = 'unknown';
      }

      const ageHours = buildInfo.age / (1000 * 60 * 60);
      this.log(
        `✅ Build exists (${buildInfo.type}). Age: ${ageHours.toFixed(1)} hours, Size: ${buildInfo.size}`,
        'SUCCESS'
      );
    } else {
      this.log('⚠️ No build found in .next or dist directories', 'WARN');
    }

    return buildInfo;
  }

  async monitorBuild() {
    this.log('📊 Starting build monitoring...', 'INFO');
    
    const buildStatus = this.checkBuildStatus();
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      build: buildStatus,
      monitorContinuously: this.monitorContinuously,
      status: buildStatus.exists ? 'available' : 'missing'
    };

    // Add warnings if build is old
    if (buildStatus.exists && buildStatus.age > 24 * 60 * 60 * 1000) {
      report.warnings = ['Build is older than 24 hours'];
      this.log('⚠️ Warning: Build is older than 24 hours', 'WARN');
    }

    const reportPath = path.join(this.logsDir, 'build-monitor-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log('📊 Build monitoring complete', 'SUCCESS');
    
    return report;
  }

  async run() {
    this.log('🚀 Build Monitor starting...', 'INFO');
    this.log(`Monitor continuously: ${this.monitorContinuously}`, 'INFO');
    
    this.log(`Monitor interval: ${this.monitorInterval} minutes`, 'INFO');
    const runOnce = async () => {
      await this.monitorBuild();
      this.log('✅ Build monitor completed successfully', 'SUCCESS');
    };

    try {
      if (!this.monitorContinuously) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping build monitor...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.monitorInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Build monitor failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the build monitor
const monitor = new BuildMonitor();
monitor.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

