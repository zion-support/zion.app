#!/usr/bin/env node

/**
 * Syntax Fixer - Automated syntax error fixing
 * Runs every 15 minutes to fix syntax errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SyntaxFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.fixOnDetect = process.env.FIX_ON_DETECT === 'true';
    this.fixInterval = parseInt(process.env.FIX_INTERVAL || '15', 10);
    this.continuousMode =
      process.argv.includes('--continuous') ||
      process.env.RUN_CONTINUOUSLY === 'true' ||
      process.env.CONTINUOUS_MODE === 'true';
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

  async detectSyntaxErrors() {
    this.log('🔍 Detecting syntax errors...', 'INFO');
    
    const errors = [];

    try {
      // Check TypeScript syntax
      execSync('npx tsc --noEmit', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      this.log('✅ No TypeScript syntax errors', 'SUCCESS');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const errorLines = output.split('\n').filter(line => line.includes('error TS'));
      errors.push(...errorLines.map(line => ({ type: 'TypeScript', line })));
      this.log(`⚠️ Found ${errorLines.length} TypeScript syntax errors`, 'WARN');
    }

    return errors;
  }

  async fixSyntaxErrors() {
    this.log('🔧 Starting syntax fixing routine...', 'INFO');

    const errors = await this.detectSyntaxErrors();

    if (errors.length === 0) {
      this.log('✅ No syntax errors to fix', 'SUCCESS');
      return;
    }

    if (!this.fixOnDetect) {
      this.log(`⚠️ Found ${errors.length} syntax errors but auto-fix is disabled`, 'WARN');
      this.log('Set FIX_ON_DETECT=true to enable automatic fixing', 'INFO');
      return;
    }

    // Apply ESLint auto-fix
    try {
      this.log('🔧 Running ESLint auto-fix...', 'INFO');
      execSync('npm run lint', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      this.log('✅ ESLint auto-fix completed', 'SUCCESS');
      this.fixesApplied.push({
        description: 'ESLint auto-fix',
        success: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.log('⚠️ ESLint auto-fix had warnings/errors', 'WARN');
      this.fixesApplied.push({
        description: 'ESLint auto-fix',
        success: false,
        error: 'Some errors could not be auto-fixed',
        timestamp: new Date().toISOString()
      });
    }

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      fixOnDetect: this.fixOnDetect,
      errorsDetected: errors.length,
      fixesApplied: this.fixesApplied,
      status: this.fixesApplied.some(f => f.success) ? 'fixed' : 'needs_manual_attention'
    };

    const reportPath = path.join(this.logsDir, 'syntax-fixer-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`📊 Syntax fixing complete. Applied ${this.fixesApplied.length} fixes`, 'SUCCESS');
  }

  async run() {
    this.log('🚀 Syntax Fixer starting...', 'INFO');
    this.log(`Fix on detect: ${this.fixOnDetect}`, 'INFO');
    
    this.log(`Fix interval: ${this.fixInterval} minutes`, 'INFO');
    this.log(`Continuous mode: ${this.continuousMode}`, 'INFO');
    const runOnce = async () => {
      await this.fixSyntaxErrors();
      this.log('✅ Syntax fixer completed successfully', 'SUCCESS');
    };

    try {
      if (!this.continuousMode) {
        await runOnce();
        process.exit(0);
      }

      let active = true;
      const stop = (signal) => {
        this.log(`🛑 Received ${signal}. Stopping syntax fixer...`, 'WARN');
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
      this.log(`❌ Syntax fixer failed: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Run the syntax fixer
const fixer = new SyntaxFixer();
fixer.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

