#!/usr/bin/env node

/**
 * Intelligent Automation Orchestrator - Master coordination
 * Runs every 20 minutes to coordinate all automations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntelligentOrchestrator {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.orchestrateContinuously = process.env.ORCHESTRATE_CONTINUOUSLY === 'true';
    this.optimizationMode = process.env.OPTIMIZATION_MODE || 'balanced';
    this.orchestrateInterval = parseInt(process.env.ORCHESTRATE_INTERVAL || '20', 10);
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

  async collectReports() {
    this.log('📊 Collecting automation reports...', 'INFO');
    
    const reports = {};
    const reportFiles = [
      'error-monitor-report.json',
      'health-check-report.json',
      'auto-fixer-report.json',
      'syntax-fixer-report.json',
      'dependency-report.json',
      'build-monitor-report.json'
    ];

    reportFiles.forEach(file => {
      const reportPath = path.join(this.logsDir, file);
      if (fs.existsSync(reportPath)) {
        try {
          const content = fs.readFileSync(reportPath, 'utf8');
          reports[file.replace('-report.json', '')] = JSON.parse(content);
        } catch (error) {
          this.log(`⚠️ Could not read ${file}: ${error.message}`, 'WARN');
        }
      }
    });

    return reports;
  }

  async analyzeSystemHealth(reports) {
    this.log('🔍 Analyzing system health...', 'INFO');
    
    const issues = [];
    const recommendations = [];

    // Check error monitor
    if (reports['error-monitor'] && reports['error-monitor'].totalErrors > 0) {
      issues.push(`${reports['error-monitor'].totalErrors} errors detected`);
      recommendations.push('Run auto-fixer to address errors');
    }

    // Check health status
    if (reports['health-check'] && reports['health-check'].status !== 'healthy') {
      issues.push(`System health: ${reports['health-check'].status}`);
      if (reports['health-check'].issues) {
        issues.push(...reports['health-check'].issues);
      }
    }

    // Check dependencies
    if (reports['dependency'] && reports['dependency'].totalIssues > 0) {
      issues.push(`${reports['dependency'].totalIssues} dependency issues`);
      recommendations.push('Review dependency report');
    }

    // Check build status
    if (reports['build-monitor'] && reports['build-monitor'].status === 'missing') {
      issues.push('Build is missing');
      recommendations.push('Run build to generate dist');
    }

    return { issues, recommendations };
  }

  async orchestrate() {
    this.log('🎯 Starting orchestration...', 'INFO');
    this.log(`Optimization mode: ${this.optimizationMode}`, 'INFO');
    
    const reports = await this.collectReports();
    const analysis = await this.analyzeSystemHealth(reports);

    // Generate orchestration report
    const orchestrationReport = {
      timestamp: new Date().toISOString(),
      optimizationMode: this.optimizationMode,
      orchestrateContinuously: this.orchestrateContinuously,
      reportsCollected: Object.keys(reports).length,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      overallHealth: analysis.issues.length === 0 ? 'healthy' : 'needs_attention'
    };

    const reportPath = path.join(this.logsDir, 'orchestrator-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(orchestrationReport, null, 2));

    this.log(`📊 Orchestration complete. Health: ${orchestrationReport.overallHealth}`, 
      orchestrationReport.overallHealth === 'healthy' ? 'SUCCESS' : 'WARN');

    if (analysis.issues.length > 0) {
      this.log('⚠️ Issues detected:', 'WARN');
      analysis.issues.forEach(issue => this.log(`  - ${issue}`, 'WARN'));
    }

    if (analysis.recommendations.length > 0) {
      this.log('💡 Recommendations:', 'INFO');
      analysis.recommendations.forEach(rec => this.log(`  - ${rec}`, 'INFO'));
    }

    return orchestrationReport;
  }

  async run() {
    this.log('🚀 Intelligent Orchestrator starting...', 'INFO');
    
    this.log(`Orchestrate continuously: ${this.orchestrateContinuously}`, 'INFO');
    this.log(`Orchestrate interval: ${this.orchestrateInterval} minutes`, 'INFO');
    const runOnce = async () => {
      await this.orchestrate();
      this.log('✅ Orchestrator completed successfully', 'SUCCESS');
    };

    try {
      if (!this.orchestrateContinuously) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping intelligent orchestrator...`, 'WARN');
        active = false;
      };
      process.on('SIGINT', () => stop('SIGINT'));
      process.on('SIGTERM', () => stop('SIGTERM'));

      while (active) {
        await runOnce();
        if (!active) break;
        await new Promise((resolve) => setTimeout(resolve, this.orchestrateInterval * 60 * 1000));
      }
      process.exit(0);
    } catch (error) {
      this.log(`❌ Orchestrator failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the orchestrator
const orchestrator = new IntelligentOrchestrator();
orchestrator.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

