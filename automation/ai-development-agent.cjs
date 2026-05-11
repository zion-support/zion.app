#!/usr/bin/env node

/**
 * AI Development Agent - Autonomous code development and improvement system
 * 
 * This agent uses AI to:
 * - Analyze codebase for improvements
 * - Identify and fix bugs
 * - Implement new features
 * - Optimize performance
 * - Improve code quality
 * - Manage technical debt
 * - Create commits and push changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIDevelopmentAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'ai-development.log');
    this.reportFile = path.join(this.logsDir, 'ai-development-report.json');
    this.configFile = path.join(__dirname, 'config', 'ai-development-config.json');
    
    this.ensureDirectories();
    this.config = this.loadConfig();
    this.analysisHistory = [];
    this.improvementQueue = [];
  }

  ensureDirectories() {
    [this.logsDir, path.join(__dirname, 'config')].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
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

  loadConfig() {
    const defaultConfig = {
      enabledFeatures: {
        bugFixes: true,
        performance: true,
        codeQuality: true,
        newFeatures: true,
        testing: true,
        documentation: true,
        security: true,
        accessibility: true,
        seo: true
      },
      priorities: {
        critical: ['security', 'bugFixes'],
        high: ['performance', 'accessibility'],
        medium: ['codeQuality', 'testing'],
        low: ['documentation', 'seo']
      },
      autoCommit: process.env.AUTO_COMMIT !== 'false',
      autoPush: process.env.AUTO_PUSH !== 'false',
      maxChangesPerRun: parseInt(process.env.MAX_CHANGES_PER_RUN) || 20,
      analysisInterval: parseInt(process.env.ANALYSIS_INTERVAL) || (process.env.FAST_MODE === 'true' ? 120000 : 3600000), // 2 min in fast mode, 1 hour default
      featureSuggestions: true,
      aiProvider: 'anthropic', // or 'openai'
      repository: 'https://github.com/Zion-Holdings/zion.app',
      canonicalUrl: 'https://ziontechgroup.com',
      continuousMode: process.env.CONTINUOUS_MODE === 'true',
      fastMode: process.env.FAST_MODE === 'true'
    };

    if (fs.existsSync(this.configFile)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        return { ...defaultConfig, ...userConfig };
      } catch (error) {
        this.log(`Error loading config: ${error.message}`, 'WARN');
      }
    }

    // Save default config
    fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  async analyzeCodebase() {
    this.log('🔍 Starting codebase analysis...');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {},
      improvements: []
    };

    try {
      // Check for linting errors
      analysis.errors.push(...this.checkLinting());
      
      // Check for type errors
      analysis.errors.push(...this.checkTypeErrors());
      
      // Check for security vulnerabilities
      analysis.warnings.push(...this.checkSecurity());
      
      // Check for performance issues
      analysis.suggestions.push(...this.checkPerformance());
      
      // Check for accessibility issues
      analysis.suggestions.push(...this.checkAccessibility());
      
      // Check for code quality
      analysis.suggestions.push(...this.checkCodeQuality());
      
      // Check for missing tests
      analysis.suggestions.push(...this.checkTestCoverage());
      
      // Analyze dependencies
      analysis.warnings.push(...this.checkDependencies());
      
      // Calculate metrics
      analysis.metrics = this.calculateMetrics();
      
      // Generate improvement suggestions
      analysis.improvements = this.generateImprovements(analysis);
      
    } catch (error) {
      this.log(`Error during analysis: ${error.message}`, 'ERROR');
      analysis.errors.push({
        type: 'analysis_error',
        message: error.message,
        severity: 'high'
      });
    }

    this.analysisHistory.push(analysis);
    this.saveReport(analysis);
    
    return analysis;
  }

  checkLinting() {
    this.log('Checking linting errors...');
    const errors = [];
    
    try {
      execSync('npm run lint:check', { 
        cwd: this.projectRoot,
        stdio: 'pipe',
        encoding: 'utf8'
      });
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const errorLines = output.split('\n').filter(line => 
        line.includes('error') || line.includes('warning')
      );
      
      errorLines.forEach(line => {
        errors.push({
          type: 'lint',
          message: line.trim(),
          severity: line.includes('error') ? 'high' : 'medium',
          fixable: true
        });
      });
    }
    
    return errors;
  }

  checkTypeErrors() {
    this.log('Checking type errors...');
    const errors = [];
    
    try {
      execSync('npm run type-check', { 
        cwd: this.projectRoot,
        stdio: 'pipe',
        encoding: 'utf8'
      });
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const errorLines = output.split('\n').filter(line => 
        line.includes('error TS')
      );
      
      errorLines.forEach(line => {
        errors.push({
          type: 'typescript',
          message: line.trim(),
          severity: 'high',
          fixable: true
        });
      });
    }
    
    return errors;
  }

  checkSecurity() {
    this.log('Checking security vulnerabilities...');
    const warnings = [];
    
    try {
      const output = execSync('npm audit --json', { 
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      const audit = JSON.parse(output);
      
      if (audit.metadata && audit.metadata.vulnerabilities) {
        const vulns = audit.metadata.vulnerabilities;
        
        Object.entries(vulns).forEach(([severity, count]) => {
          if (count > 0) {
            warnings.push({
              type: 'security',
              message: `Found ${count} ${severity} severity vulnerabilities`,
              severity: severity === 'critical' || severity === 'high' ? 'high' : 'medium',
              fixable: true
            });
          }
        });
      }
    } catch (error) {
      // npm audit returns non-zero if vulnerabilities found
      this.log('Security check completed with vulnerabilities', 'WARN');
    }
    
    return warnings;
  }

  checkPerformance() {
    this.log('Checking performance issues...');
    const suggestions = [];
    
    // Check for large bundle sizes
    const pagesDir = path.join(this.projectRoot, 'pages');
    if (fs.existsSync(pagesDir)) {
      const pages = this.getAllFiles(pagesDir, ['.tsx', '.ts', '.jsx', '.js']);
      
      pages.forEach(page => {
        const stats = fs.statSync(page);
        if (stats.size > 100000) { // > 100KB
          suggestions.push({
            type: 'performance',
            message: `Large file detected: ${path.relative(this.projectRoot, page)} (${Math.round(stats.size / 1024)}KB)`,
            severity: 'medium',
            fixable: true,
            suggestion: 'Consider code splitting or lazy loading'
          });
        }
      });
    }
    
    return suggestions;
  }

  checkAccessibility() {
    this.log('Checking accessibility issues...');
    const suggestions = [];
    
    // Check for missing alt attributes in images
    const componentDirs = [
      path.join(this.projectRoot, 'pages'),
      path.join(this.projectRoot, 'app'),
      path.join(this.projectRoot, 'src', 'components')
    ];
    
    componentDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.getAllFiles(dir, ['.tsx', '.jsx']);
        
        files.forEach(file => {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for images without alt
          const imgMatches = content.match(/<img[^>]*>/gi) || [];
          imgMatches.forEach(img => {
            if (!img.includes('alt=')) {
              suggestions.push({
                type: 'accessibility',
                message: `Missing alt attribute in ${path.relative(this.projectRoot, file)}`,
                severity: 'medium',
                fixable: true,
                suggestion: 'Add descriptive alt text to images'
              });
            }
          });
          
          // Check for missing labels on inputs
          const inputMatches = content.match(/<input[^>]*>/gi) || [];
          inputMatches.forEach(input => {
            if (!input.includes('aria-label') && !input.includes('id=')) {
              suggestions.push({
                type: 'accessibility',
                message: `Input without label in ${path.relative(this.projectRoot, file)}`,
                severity: 'medium',
                fixable: true,
                suggestion: 'Add aria-label or associate with label element'
              });
            }
          });
        });
      }
    });
    
    return suggestions;
  }

  checkCodeQuality() {
    this.log('Checking code quality...');
    const suggestions = [];
    
    // Check for console.log statements
    const srcDir = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      const files = this.getAllFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const consoleMatches = content.match(/console\.(log|warn|error)/g) || [];
        
        if (consoleMatches.length > 0) {
          suggestions.push({
            type: 'code_quality',
            message: `Found ${consoleMatches.length} console statements in ${path.relative(this.projectRoot, file)}`,
            severity: 'low',
            fixable: true,
            suggestion: 'Remove or replace with proper logging'
          });
        }
        
        // Check for TODO comments
        const todoMatches = content.match(/\/\/\s*TODO:/gi) || [];
        if (todoMatches.length > 0) {
          suggestions.push({
            type: 'code_quality',
            message: `Found ${todoMatches.length} TODO comments in ${path.relative(this.projectRoot, file)}`,
            severity: 'low',
            fixable: false,
            suggestion: 'Address TODO items'
          });
        }
      });
    }
    
    return suggestions;
  }

  checkTestCoverage() {
    this.log('Checking test coverage...');
    const suggestions = [];
    
    // Check if test files exist for source files
    const srcDir = path.join(this.projectRoot, 'src');
    const testDir = path.join(this.projectRoot, '__tests__');
    
    if (fs.existsSync(srcDir)) {
      const sourceFiles = this.getAllFiles(srcDir, ['.tsx', '.ts'])
        .filter(file => !file.includes('.test.') && !file.includes('.spec.'));
      
      sourceFiles.forEach(file => {
        const fileName = path.basename(file, path.extname(file));
        const testFile = path.join(testDir, `${fileName}.test.ts`);
        const testFile2 = path.join(testDir, `${fileName}.test.tsx`);
        
        if (!fs.existsSync(testFile) && !fs.existsSync(testFile2)) {
          suggestions.push({
            type: 'testing',
            message: `Missing test file for ${path.relative(this.projectRoot, file)}`,
            severity: 'medium',
            fixable: true,
            suggestion: 'Create test file with basic tests'
          });
        }
      });
    }
    
    return suggestions;
  }

  checkDependencies() {
    this.log('Checking dependencies...');
    const warnings = [];
    
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
      );
      
      // Check for outdated dependencies
      try {
        const outdated = execSync('npm outdated --json', {
          cwd: this.projectRoot,
          encoding: 'utf8'
        });
        
        const outdatedDeps = JSON.parse(outdated);
        
        Object.entries(outdatedDeps).forEach(([name, info]) => {
          warnings.push({
            type: 'dependency',
            message: `Outdated dependency: ${name} (${info.current} → ${info.latest})`,
            severity: 'low',
            fixable: true,
            suggestion: 'Update to latest version'
          });
        });
      } catch (error) {
        // npm outdated returns non-zero when outdated packages exist
      }
    } catch (error) {
      this.log(`Error checking dependencies: ${error.message}`, 'ERROR');
    }
    
    return warnings;
  }

  calculateMetrics() {
    this.log('Calculating codebase metrics...');
    
    const metrics = {
      totalFiles: 0,
      totalLines: 0,
      totalComponents: 0,
      totalPages: 0,
      testCoverage: 0,
      bundleSize: 0,
      buildTime: 0
    };
    
    try {
      const srcDir = path.join(this.projectRoot, 'src');
      
      if (fs.existsSync(srcDir)) {
        const files = this.getAllFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
        metrics.totalFiles = files.length;
        
        files.forEach(file => {
          const content = fs.readFileSync(file, 'utf8');
          metrics.totalLines += content.split('\n').length;
          
          if (file.includes('/components/')) {
            metrics.totalComponents++;
          }
          if (file.includes('/pages/')) {
            metrics.totalPages++;
          }
        });
      }
      
      // Check build output size
      const nextDir = path.join(this.projectRoot, '.next');
      if (fs.existsSync(nextDir)) {
        const buildSize = this.getDirectorySize(nextDir);
        metrics.bundleSize = Math.round(buildSize / 1024 / 1024); // MB
      }
    } catch (error) {
      this.log(`Error calculating metrics: ${error.message}`, 'ERROR');
    }
    
    return metrics;
  }

  generateImprovements(analysis) {
    this.log('Generating improvement suggestions...');
    
    const improvements = [];
    
    // Prioritize critical errors
    const criticalErrors = analysis.errors.filter(e => 
      e.severity === 'high' && e.fixable
    );
    
    if (criticalErrors.length > 0) {
      improvements.push({
        category: 'critical',
        title: 'Fix Critical Errors',
        description: `Found ${criticalErrors.length} critical errors that need immediate attention`,
        priority: 1,
        estimatedEffort: 'high',
        autoFixable: true,
        actions: criticalErrors.map(e => ({
          type: e.type,
          message: e.message,
          fix: this.suggestFix(e)
        }))
      });
    }
    
    // Security improvements
    const securityIssues = analysis.warnings.filter(w => w.type === 'security');
    if (securityIssues.length > 0) {
      improvements.push({
        category: 'security',
        title: 'Security Improvements',
        description: 'Address security vulnerabilities',
        priority: 2,
        estimatedEffort: 'medium',
        autoFixable: true,
        actions: [
          { type: 'command', command: 'npm audit fix' },
          { type: 'command', command: 'npm audit fix --force' }
        ]
      });
    }
    
    // Performance improvements
    const perfIssues = analysis.suggestions.filter(s => s.type === 'performance');
    if (perfIssues.length > 0) {
      improvements.push({
        category: 'performance',
        title: 'Performance Optimization',
        description: 'Optimize large files and improve loading times',
        priority: 3,
        estimatedEffort: 'medium',
        autoFixable: false,
        actions: perfIssues.map(s => ({
          type: 'suggestion',
          message: s.message,
          suggestion: s.suggestion
        }))
      });
    }
    
    // Accessibility improvements
    const a11yIssues = analysis.suggestions.filter(s => s.type === 'accessibility');
    if (a11yIssues.length > 0) {
      improvements.push({
        category: 'accessibility',
        title: 'Accessibility Improvements',
        description: 'Fix accessibility issues for better user experience',
        priority: 4,
        estimatedEffort: 'low',
        autoFixable: true,
        actions: a11yIssues.slice(0, 10).map(s => ({
          type: 'fix',
          message: s.message,
          suggestion: s.suggestion
        }))
      });
    }
    
    // Code quality improvements
    const qualityIssues = analysis.suggestions.filter(s => s.type === 'code_quality');
    if (qualityIssues.length > 0) {
      improvements.push({
        category: 'quality',
        title: 'Code Quality Improvements',
        description: 'Clean up code and improve maintainability',
        priority: 5,
        estimatedEffort: 'low',
        autoFixable: true,
        actions: qualityIssues.slice(0, 10).map(s => ({
          type: 'fix',
          message: s.message,
          suggestion: s.suggestion
        }))
      });
    }
    
    // Testing improvements
    const testIssues = analysis.suggestions.filter(s => s.type === 'testing');
    if (testIssues.length > 0) {
      improvements.push({
        category: 'testing',
        title: 'Test Coverage Improvements',
        description: 'Add missing tests to improve coverage',
        priority: 6,
        estimatedEffort: 'medium',
        autoFixable: false,
        actions: testIssues.slice(0, 5).map(s => ({
          type: 'create_test',
          message: s.message,
          suggestion: s.suggestion
        }))
      });
    }
    
    return improvements;
  }

  suggestFix(error) {
    switch (error.type) {
      case 'lint':
        return { command: 'npm run lint:fix' };
      case 'typescript':
        return { description: 'Fix type errors manually or update type definitions' };
      case 'security':
        return { command: 'npm audit fix' };
      default:
        return { description: 'Manual fix required' };
    }
  }

  async implementImprovements(improvements) {
    this.log('🛠️ Implementing improvements...');
    
    const implemented = [];
    let changesCount = 0;
    
    for (const improvement of improvements.slice(0, this.config.maxChangesPerRun)) {
      if (!improvement.autoFixable) {
        this.log(`Skipping non-auto-fixable: ${improvement.title}`, 'INFO');
        continue;
      }
      
      try {
        this.log(`Implementing: ${improvement.title}`);
        
        if (improvement.category === 'critical') {
          // Fix critical errors
          try {
            execSync('npm run lint:fix', { cwd: this.projectRoot, stdio: 'inherit' });
            implemented.push(improvement);
            changesCount++;
          } catch (error) {
            this.log(`Failed to fix linting errors: ${error.message}`, 'ERROR');
          }
        } else if (improvement.category === 'security') {
          // Fix security vulnerabilities
          try {
            execSync('npm audit fix', { cwd: this.projectRoot, stdio: 'inherit' });
            implemented.push(improvement);
            changesCount++;
          } catch (error) {
            this.log(`Failed to fix security issues: ${error.message}`, 'ERROR');
          }
        } else if (improvement.category === 'accessibility' || improvement.category === 'quality') {
          // These would require more sophisticated AI-powered fixes
          this.log(`AI-powered fix needed for: ${improvement.title}`, 'INFO');
          // Add to queue for future AI implementation
          this.improvementQueue.push(improvement);
        }
        
        // Commit changes if configured
        if (this.config.autoCommit && changesCount > 0) {
          await this.commitChanges(improvement.title);
        }
        
      } catch (error) {
        this.log(`Error implementing ${improvement.title}: ${error.message}`, 'ERROR');
      }
    }
    
    return { implemented, changesCount };
  }

  async commitChanges(message) {
    this.log(`📝 Committing changes: ${message}`);
    
    try {
      // Check if there are changes to commit
      const status = execSync('git status --porcelain', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      }).trim();
      
      if (!status) {
        this.log('No changes to commit', 'INFO');
        return false;
      }
      
      // Stage all changes
      execSync('git add .', { cwd: this.projectRoot });
      
      // Commit with descriptive message
      const commitMessage = `🤖 AI Agent: ${message}\n\n[Automated by AI Development Agent]`;
      execSync(`git commit -m "${commitMessage}"`, { 
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      this.log('✅ Changes committed', 'SUCCESS');
      
      // Push if configured
      if (this.config.autoPush) {
        await this.pushChanges();
      }
      
      return true;
    } catch (error) {
      this.log(`Error committing changes: ${error.message}`, 'ERROR');
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
      this.log(`Error pushing changes: ${error.message}`, 'ERROR');
      return false;
    }
  }

  saveReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      analysis,
      config: this.config,
      improvementQueue: this.improvementQueue,
      summary: {
        totalErrors: analysis.errors.length,
        totalWarnings: analysis.warnings.length,
        totalSuggestions: analysis.suggestions.length,
        totalImprovements: analysis.improvements.length,
        healthScore: this.calculateHealthScore(analysis)
      }
    };
    
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
    this.log(`Report saved to ${this.reportFile}`);
  }

  calculateHealthScore(analysis) {
    let score = 100;
    
    // Deduct points for issues
    score -= analysis.errors.filter(e => e.severity === 'high').length * 10;
    score -= analysis.errors.filter(e => e.severity === 'medium').length * 5;
    score -= analysis.warnings.length * 2;
    score -= analysis.suggestions.length * 0.5;
    
    return Math.max(0, Math.min(100, score));
  }

  getAllFiles(dir, extensions) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            if (!item.startsWith('.') && item !== 'node_modules') {
              files = files.concat(this.getAllFiles(fullPath, extensions));
            }
          } else if (stat.isFile()) {
            const ext = path.extname(fullPath);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        } catch (error) {
          // Skip files we can't access
        }
      });
    } catch (error) {
      this.log(`Error reading directory ${dir}: ${error.message}`, 'ERROR');
    }
    
    return files;
  }

  getDirectorySize(dir) {
    let size = 0;
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            size += this.getDirectorySize(fullPath);
          } else {
            size += stat.size;
          }
        } catch (error) {
          // Skip
        }
      });
    } catch (error) {
      // Skip
    }
    
    return size;
  }

  async run(shouldExit = true) {
    this.log('🚀 AI Development Agent Starting...');
    this.log(`Repository: ${this.config.repository}`);
    this.log(`Canonical URL: ${this.config.canonicalUrl}`);
    
    try {
      // Analyze codebase
      const analysis = await this.analyzeCodebase();
      
      this.log(`\n📊 Analysis Complete:`);
      this.log(`   Errors: ${analysis.errors.length}`);
      this.log(`   Warnings: ${analysis.warnings.length}`);
      this.log(`   Suggestions: ${analysis.suggestions.length}`);
      this.log(`   Improvements: ${analysis.improvements.length}`);
      this.log(`   Health Score: ${this.calculateHealthScore(analysis)}/100`);
      
      // Implement improvements
      if (analysis.improvements.length > 0) {
        const result = await this.implementImprovements(analysis.improvements);
        this.log(`\n✅ Implemented ${result.changesCount} improvements`);
      } else {
        this.log('\n✨ No improvements needed - codebase is healthy!');
      }
      
      this.log('\n🎉 AI Development Agent completed successfully');
      
      if (shouldExit) {
        process.exit(0);
      }
      
    } catch (error) {
      this.log(`\n❌ AI Development Agent failed: ${error.message}`, 'ERROR');
      if (shouldExit) {
        process.exit(1);
      }
      // In continuous mode, just log the error and continue
      throw error;
    }
  }

  async runContinuous() {
    const mode = this.config.fastMode ? '⚡⚡⚡ ULTRA-FAST CONTINUOUS' : '🔄 CONTINUOUS';
    const interval = this.config.analysisInterval;
    const intervalSeconds = interval / 1000;
    
    this.log(`${mode} Starting continuous development mode...`);
    this.log(`Analysis interval: ${intervalSeconds}s`);
    this.log(`Max changes per run: ${this.config.maxChangesPerRun}`);
    this.log(`Fast mode: ${this.config.fastMode ? 'ENABLED' : 'DISABLED'}`);
    
    // Optimized immediate execution
    const executeCycle = async () => {
      try {
        const startTime = Date.now();
        this.log(`\n⏰ Cycle starting... (${new Date().toISOString()})`);
        await this.run(false); // Don't exit process
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        this.log(`⚡ Cycle completed in ${duration}s - Next run in ${intervalSeconds}s`);
      } catch (error) {
        this.log(`❌ Error in cycle: ${error.message}`, 'ERROR');
        // Continue running even if one cycle fails
      }
    };
    
    // Run immediately without waiting
    executeCycle();
    
    // Schedule periodic runs immediately (no delay)
    setInterval(executeCycle, interval);
    
    // Keep process alive indefinitely
    this.log('✅ Continuous mode ACTIVE - agent running AUTONOMOUSLY');
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
        this.log(`💓 Heartbeat: ${new Date().toISOString()}`, 'DEBUG');
      }
    }, 60000); // Every minute
  }
}

// CLI interface
if (require.main === module) {
  const agent = new AIDevelopmentAgent();
  const command = process.argv[2];

  switch (command) {
    case 'run':
      agent.run();
      break;
    case 'continuous':
      agent.runContinuous();
      break;
    case 'analyze':
      agent.analyzeCodebase().then(analysis => {
        console.log('\nAnalysis Results:');
        console.log(JSON.stringify(analysis, null, 2));
        process.exit(0);
      });
      break;
    default:
      console.log('AI Development Agent - Autonomous code development system');
      console.log('\nUsage:');
      console.log('  node ai-development-agent.js run        - Run one-time analysis and improvements');
      console.log('  node ai-development-agent.js continuous - Run continuously with periodic analysis');
      console.log('  node ai-development-agent.js analyze    - Run analysis only (no changes)');
      console.log('\nConfiguration:');
      console.log('  Edit automation/config/ai-development-config.json to customize behavior');
  }
}

module.exports = AIDevelopmentAgent;

