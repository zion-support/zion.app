#!/usr/bin/env node

/**
 * AI Master Orchestrator - Coordinates all AI development agents
 * 
 * This master system:
 * - Runs the AI Development Agent periodically
 * - Uses AI Code Generator for complex improvements
 * - Manages the improvement queue
 * - Prioritizes tasks
 * - Commits and pushes changes
 * - Monitors system health
 * - Generates reports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIMasterOrchestrator {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'ai-master-orchestrator.log');
    this.stateFile = path.join(this.logsDir, 'orchestrator-state.json');
    this.reportFile = path.join(this.logsDir, 'orchestrator-report.json');
    
    this.ensureDirectories();
    this.state = this.loadState();
    
    this.agents = {
      development: path.join(__dirname, 'ai-development-agent.cjs'),
      codeGenerator: path.join(__dirname, 'ai-code-generator.cjs'),
      contentOptimization: path.join(__dirname, 'ai-content-optimization-automation.cjs')
    };
    
    this.config = {
      runInterval: parseInt(process.env.ORCHESTRATION_INTERVAL) || (process.env.FAST_MODE === 'true' ? 120000 : 3600000), // 2 min in fast mode, 1 hour default
      maxConcurrentTasks: parseInt(process.env.MAX_CONCURRENT_TASKS) || 10,
      autoCommit: process.env.AUTO_COMMIT !== 'false',
      autoPush: process.env.AUTO_PUSH !== 'false',
      enabledAgents: ['development', 'codeGenerator', 'contentOptimization'],
      priorities: {
        critical: ['security', 'bugs', 'errors'],
        high: ['performance', 'accessibility'],
        medium: ['code_quality', 'testing'],
        low: ['documentation', 'optimization']
      },
      fastMode: process.env.FAST_MODE === 'true',
      continuousMode: process.env.CONTINUOUS_MODE === 'true'
    };
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(message);
    
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  loadState() {
    if (fs.existsSync(this.stateFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      } catch (error) {
        this.log(`Error loading state: ${error.message}`, 'WARN');
      }
    }
    
    return {
      lastRun: null,
      totalRuns: 0,
      totalImprovements: 0,
      totalCommits: 0,
      taskQueue: [],
      completedTasks: [],
      failedTasks: [],
      healthHistory: []
    };
  }

  saveState() {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      this.log(`Error saving state: ${error.message}`, 'ERROR');
    }
  }

  async runDevelopmentAgent() {
    this.log('🔧 Running AI Development Agent...');
    
    try {
      const output = execSync(`node ${this.agents.development} run`, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.log('Development Agent completed successfully', 'SUCCESS');
      
      // Read the report
      const reportPath = path.join(this.logsDir, 'ai-development-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        return report;
      }
      
      return null;
    } catch (error) {
      this.log(`Development Agent failed: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async generateFeatureSuggestions() {
    this.log('💡 Generating feature suggestions...');
    
    try {
      const output = execSync(`node ${this.agents.codeGenerator} features`, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parse suggestions from output
      const suggestionsPath = path.join(__dirname, 'generated', 'feature-suggestions.json');
      if (fs.existsSync(suggestionsPath)) {
        const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, 'utf8'));
        return suggestions;
      }
      
      return [];
    } catch (error) {
      this.log(`Feature generation failed: ${error.message}`, 'ERROR');
      return [];
    }
  }

  async analyzeCodeQuality() {
    this.log('📊 Analyzing code quality...');
    
    const metrics = {
      lintErrors: 0,
      typeErrors: 0,
      securityIssues: 0,
      testCoverage: 0,
      bundleSize: 0,
      performanceScore: 0,
      accessibilityScore: 0
    };
    
    try {
      // Check linting
      try {
        execSync('npm run lint:check', {
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        const output = error.stdout?.toString() || '';
        metrics.lintErrors = (output.match(/error/gi) || []).length;
      }
      
      // Check types
      try {
        execSync('npm run type-check', {
          cwd: this.projectRoot,
          stdio: 'pipe'
        });
      } catch (error) {
        const output = error.stdout?.toString() || '';
        metrics.typeErrors = (output.match(/error TS/gi) || []).length;
      }
      
      // Check security
      try {
        const audit = execSync('npm audit --json', {
          cwd: this.projectRoot,
          encoding: 'utf8'
        });
        const auditData = JSON.parse(audit);
        metrics.securityIssues = auditData.metadata?.vulnerabilities?.total || 0;
      } catch (error) {
        // Audit returns non-zero on vulnerabilities
      }
      
      // Check bundle size
      const nextDir = path.join(this.projectRoot, '.next');
      if (fs.existsSync(nextDir)) {
        metrics.bundleSize = this.getDirectorySize(nextDir) / 1024 / 1024; // MB
      }
      
    } catch (error) {
      this.log(`Error analyzing quality: ${error.message}`, 'ERROR');
    }
    
    return metrics;
  }

  getDirectorySize(dir) {
    let size = 0;
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          size += this.getDirectorySize(fullPath);
        } else {
          size += stat.size;
        }
      });
    } catch (error) {
      // Ignore errors
    }
    
    return size;
  }

  prioritizeTasks(tasks) {
    this.log('📋 Prioritizing tasks...');
    
    const prioritized = tasks.map(task => {
      let priority = 100;
      
      // Assign priority based on type
      if (this.config.priorities.critical.some(p => task.category?.includes(p))) {
        priority = 1;
      } else if (this.config.priorities.high.some(p => task.category?.includes(p))) {
        priority = 2;
      } else if (this.config.priorities.medium.some(p => task.category?.includes(p))) {
        priority = 3;
      } else if (this.config.priorities.low.some(p => task.category?.includes(p))) {
        priority = 4;
      }
      
      return { ...task, priority };
    });
    
    // Sort by priority
    return prioritized.sort((a, b) => a.priority - b.priority);
  }

  async executeTasks(tasks) {
    this.log(`🚀 Executing ${tasks.length} tasks...`);
    
    let executed = 0;
    let failed = 0;
    
    for (const task of tasks.slice(0, this.config.maxConcurrentTasks)) {
      try {
        this.log(`Executing: ${task.title || task.description}`);
        
        if (task.command) {
          execSync(task.command, {
            cwd: this.projectRoot,
            stdio: 'inherit'
          });
        }
        
        executed++;
        this.state.completedTasks.push({
          ...task,
          completedAt: new Date().toISOString()
        });
        
        // Commit changes
        if (this.config.autoCommit) {
          await this.commitChanges(task.title || 'Task completed');
        }
        
      } catch (error) {
        this.log(`Task failed: ${error.message}`, 'ERROR');
        failed++;
        this.state.failedTasks.push({
          ...task,
          error: error.message,
          failedAt: new Date().toISOString()
        });
      }
    }
    
    return { executed, failed };
  }

  async commitChanges(message) {
    this.log(`💾 Committing changes: ${message}`);
    
    try {
      // Check for changes
      const status = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      }).trim();
      
      if (!status) {
        this.log('No changes to commit', 'INFO');
        return false;
      }
      
      // Stage changes
      execSync('git add .', { cwd: this.projectRoot });
      
      // Commit
      const commitMsg = `🤖 AI Master Orchestrator: ${message}\n\n[Automated improvement by AI system]`;
      execSync(`git commit -m "${commitMsg}"`, {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      this.state.totalCommits++;
      this.log('✅ Changes committed', 'SUCCESS');
      
      // Push if configured
      if (this.config.autoPush) {
        await this.pushChanges();
      }
      
      return true;
    } catch (error) {
      this.log(`Commit failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async pushChanges() {
    this.log('📤 Pushing changes to remote...');
    
    try {
      execSync('git push origin main', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      this.log('✅ Changes pushed successfully', 'SUCCESS');
      return true;
    } catch (error) {
      this.log(`Push failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  calculateHealthScore(metrics) {
    let score = 100;
    
    score -= metrics.lintErrors * 2;
    score -= metrics.typeErrors * 3;
    score -= metrics.securityIssues * 5;
    score -= Math.max(0, (metrics.bundleSize - 50)) * 0.5;
    
    return Math.max(0, Math.min(100, score));
  }

  generateReport(metrics, developmentReport, featureSuggestions, taskResults) {
    const healthScore = this.calculateHealthScore(metrics);
    
    const report = {
      timestamp: new Date().toISOString(),
      orchestrator: {
        totalRuns: this.state.totalRuns,
        totalImprovements: this.state.totalImprovements,
        totalCommits: this.state.totalCommits,
        lastRun: this.state.lastRun
      },
      metrics,
      healthScore,
      developmentReport: developmentReport?.summary || null,
      featureSuggestions: featureSuggestions.slice(0, 5),
      tasks: {
        executed: taskResults?.executed || 0,
        failed: taskResults?.failed || 0,
        queued: this.state.taskQueue.length
      },
      recommendations: this.generateRecommendations(metrics, healthScore)
    };
    
    try {
      fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
      this.log(`Report saved to ${this.reportFile}`);
    } catch (error) {
      this.log(`Error saving report: ${error.message}`, 'ERROR');
    }
    
    return report;
  }

  generateRecommendations(metrics, healthScore) {
    const recommendations = [];
    
    if (healthScore < 70) {
      recommendations.push({
        priority: 'high',
        message: 'System health is below optimal. Immediate attention required.'
      });
    }
    
    if (metrics.lintErrors > 0) {
      recommendations.push({
        priority: 'high',
        message: `Fix ${metrics.lintErrors} linting errors`,
        action: 'npm run lint:fix'
      });
    }
    
    if (metrics.typeErrors > 0) {
      recommendations.push({
        priority: 'high',
        message: `Fix ${metrics.typeErrors} TypeScript errors`,
        action: 'Manual fix required'
      });
    }
    
    if (metrics.securityIssues > 0) {
      recommendations.push({
        priority: 'critical',
        message: `Address ${metrics.securityIssues} security vulnerabilities`,
        action: 'npm audit fix'
      });
    }
    
    if (metrics.bundleSize > 100) {
      recommendations.push({
        priority: 'medium',
        message: `Bundle size is large (${Math.round(metrics.bundleSize)}MB)`,
        action: 'Consider code splitting and optimization'
      });
    }
    
    return recommendations;
  }

  async orchestrate() {
    this.log('🎯 Starting orchestration cycle...');
    
    try {
      // Update state
      this.state.lastRun = new Date().toISOString();
      this.state.totalRuns++;
      
      // Run development agent
      const developmentReport = await this.runDevelopmentAgent();
      
      // Analyze code quality
      const metrics = await this.analyzeCodeQuality();
      
      // Generate feature suggestions (periodically - more frequent in fast mode)
      let featureSuggestions = [];
      const suggestionInterval = this.config.fastMode ? 12 : 24; // Every 12 runs in fast mode, 24 runs (daily) in normal mode
      if (this.state.totalRuns % suggestionInterval === 0) {
        featureSuggestions = await this.generateFeatureSuggestions();
      }
      
      // Build task queue from improvements
      if (developmentReport?.analysis?.improvements) {
        const prioritized = this.prioritizeTasks(developmentReport.analysis.improvements);
        this.state.taskQueue.push(...prioritized);
      }
      
      // Execute high-priority tasks
      let taskResults = null;
      if (this.state.taskQueue.length > 0) {
        taskResults = await this.executeTasks(this.state.taskQueue);
        this.state.taskQueue = this.state.taskQueue.slice(taskResults.executed);
        this.state.totalImprovements += taskResults.executed;
      }
      
      // Generate and save report
      const report = this.generateReport(
        metrics,
        developmentReport,
        featureSuggestions,
        taskResults
      );
      
      // Update health history
      this.state.healthHistory.push({
        timestamp: new Date().toISOString(),
        score: report.healthScore,
        metrics
      });
      
      // Keep only last 30 days
      if (this.state.healthHistory.length > 720) { // 30 days * 24 hours
        this.state.healthHistory = this.state.healthHistory.slice(-720);
      }
      
      // Save state
      this.saveState();
      
      // Print summary
      this.log('\n📊 Orchestration Summary:');
      this.log(`   Health Score: ${report.healthScore}/100`);
      this.log(`   Lint Errors: ${metrics.lintErrors}`);
      this.log(`   Type Errors: ${metrics.typeErrors}`);
      this.log(`   Security Issues: ${metrics.securityIssues}`);
      this.log(`   Tasks Executed: ${taskResults?.executed || 0}`);
      this.log(`   Tasks Failed: ${taskResults?.failed || 0}`);
      this.log(`   Tasks Queued: ${this.state.taskQueue.length}`);
      
      if (report.recommendations.length > 0) {
        this.log('\n💡 Recommendations:');
        report.recommendations.forEach(rec => {
          this.log(`   [${rec.priority.toUpperCase()}] ${rec.message}`);
        });
      }
      
      return report;
      
    } catch (error) {
      this.log(`Orchestration failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async runContinuous() {
    const mode = this.config.fastMode ? '⚡⚡⚡ ULTRA-FAST CONTINUOUS' : '🔄 CONTINUOUS';
    const interval = this.config.runInterval;
    const intervalSeconds = interval / 1000;
    
    this.log(`${mode} Starting continuous orchestration mode...`);
    this.log(`Interval: ${intervalSeconds}s`);
    this.log(`Max concurrent tasks: ${this.config.maxConcurrentTasks}`);
    this.log(`Fast mode: ${this.config.fastMode ? 'ENABLED' : 'DISABLED'}`);
    
    // Optimized immediate execution
    const executeCycle = async () => {
      try {
        const startTime = Date.now();
        this.log(`\n⏰ Orchestration cycle starting... (${new Date().toISOString()})`);
        await this.orchestrate();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        this.log(`⚡ Orchestration completed in ${duration}s - Next run in ${intervalSeconds}s`);
      } catch (error) {
        this.log(`❌ Error in orchestration cycle: ${error.message}`, 'ERROR');
        // Continue running even if one cycle fails
      }
    };
    
    // Run immediately without waiting
    executeCycle();
    
    // Schedule periodic runs immediately (no delay)
    setInterval(executeCycle, interval);
    
    // Keep process alive indefinitely
    this.log('✅ Continuous orchestration ACTIVE - running AUTONOMOUSLY');
    this.log('💡 Process will run indefinitely until manually stopped');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('\n🛑 Shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      this.log('\n🛑 Received SIGTERM, shutting down...');
      process.exit(0);
    });
    
    // Prevent process from exiting
    setInterval(() => {
      // Keep-alive heartbeat
      if (this.config.fastMode) {
        this.log(`💓 Orchestrator heartbeat: ${new Date().toISOString()}`, 'DEBUG');
      }
    }, 60000); // Every minute
  }

  async run() {
    this.log('🚀 AI Master Orchestrator Starting...');
    
    try {
      await this.orchestrate();
      this.log('\n✅ Orchestration completed successfully');
      process.exit(0);
    } catch (error) {
      this.log(`\n❌ Orchestration failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const orchestrator = new AIMasterOrchestrator();
  const command = process.argv[2];

  switch (command) {
    case 'run':
      orchestrator.run();
      break;
    case 'continuous':
      orchestrator.runContinuous();
      break;
    default:
      console.log('AI Master Orchestrator - Coordinates all AI development agents');
      console.log('\nUsage:');
      console.log('  node ai-master-orchestrator.cjs run        - Run one orchestration cycle');
      console.log('  node ai-master-orchestrator.cjs continuous - Run continuously');
      console.log('\nThe orchestrator will:');
      console.log('  - Run development agent');
      console.log('  - Analyze code quality');
      console.log('  - Generate feature suggestions');
      console.log('  - Execute high-priority tasks');
      console.log('  - Commit and push changes');
      console.log('  - Generate reports');
  }
}

module.exports = AIMasterOrchestrator;

