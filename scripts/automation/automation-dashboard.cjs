#!/usr/bin/env node

/**
 * Automation Dashboard - Real-time monitoring dashboard
 * Provides a simple monitoring interface
 */

const fs = require('fs');
const path = require('path');

class AutomationDashboard {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'automation', 'logs');
    this.reportsDir = path.join(this.projectRoot, 'automation', 'reports');
    this.dashboardPort = parseInt(process.env.DASHBOARD_PORT || '3002', 10);
    this.refreshInterval = parseInt(process.env.REFRESH_INTERVAL || '30', 10);
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

  async collectAllReports() {
    this.log('📊 Collecting all reports for dashboard...', 'INFO');
    
    const dashboard = {
      timestamp: new Date().toISOString(),
      refreshInterval: this.refreshInterval,
      reports: {}
    };

    const reportFiles = fs.readdirSync(this.logsDir)
      .filter(f => f.endsWith('-report.json'));

    reportFiles.forEach(file => {
      const reportPath = path.join(this.logsDir, file);
      try {
        const content = fs.readFileSync(reportPath, 'utf8');
        const reportName = file.replace('-report.json', '');
        dashboard.reports[reportName] = JSON.parse(content);
      } catch (error) {
        this.log(`⚠️ Could not read ${file}: ${error.message}`, 'WARN');
      }
    });

    return dashboard;
  }

  async generateDashboard() {
    this.log('📊 Generating dashboard...', 'INFO');
    
    const dashboard = await this.collectAllReports();
    
    // Save dashboard data
    const dashboardPath = path.join(this.logsDir, 'automation-dashboard.json');
    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));

    this.log(`✅ Dashboard generated with ${Object.keys(dashboard.reports).length} reports`, 'SUCCESS');
    
    // Print summary to console
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'INFO');
    this.log('           AUTOMATION DASHBOARD SUMMARY', 'INFO');
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'INFO');
    
    Object.entries(dashboard.reports).forEach(([name, report]) => {
      const status = report.status || report.overallHealth || 'unknown';
      const icon = status === 'healthy' || status === 'success' ? '✅' : 
                   status === 'warning' ? '⚠️' : '❌';
      this.log(`${icon} ${name.padEnd(25)}: ${status}`, 'INFO');
    });
    
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'INFO');
    
    return dashboard;
  }

  async run() {
    this.log('🚀 Automation Dashboard starting...', 'INFO');
    this.log(`Refresh interval: ${this.refreshInterval} seconds`, 'INFO');
    
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.generateDashboard();
      this.log('✅ Dashboard completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping automation dashboard...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.refreshInterval * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Dashboard failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the dashboard
const dashboard = new AutomationDashboard();
dashboard.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

