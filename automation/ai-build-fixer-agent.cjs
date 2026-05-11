#!/usr/bin/env node

/**
 * AI Build Fixer Agent
 * 
 * A specialized autonomous agent that continuously monitors and fixes build errors.
 * This agent runs independently and focuses exclusively on keeping the build healthy.
 * 
 * Features:
 * - Continuous build monitoring
 * - Automatic error detection
 * - Intelligent error fixing
 * - Auto-commit and push fixes
 * - Build health reporting
 * - Error pattern learning
 * 
 * @author AI Development Team
 * @license MIT
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  rootDir: process.cwd(),
  logsDir: path.join(process.cwd(), 'automation', 'logs'),
  reportsDir: path.join(process.cwd(), 'automation', 'reports'),
  
  // Build monitoring settings - ULTRA-FAST MODE
  continuous: process.env.CONTINUOUS_BUILD_FIXER !== 'false',
  intervalMinutes: parseInt(process.env.BUILD_CHECK_INTERVAL || '1', 10), // Every 1 minute
  
  // Auto-commit settings
  autoCommit: process.env.AUTO_COMMIT !== 'false',
  autoPush: process.env.AUTO_PUSH !== 'false',
  
  // Fix settings - OPTIMIZED FOR SPEED
  maxFixAttempts: parseInt(process.env.MAX_FIX_ATTEMPTS || '10', 10),
  cleanBuildOnFail: process.env.CLEAN_BUILD_ON_FAIL !== 'false',
  fastMode: process.env.FAST_MODE !== 'false',
  parallelFixes: process.env.PARALLEL_FIXES !== 'false' || process.argv.includes('PROFILING'),
  
  // Repository settings
  repository: 'https://github.com/Zion-support/zion.app',
  canonicalUrl: 'https://ziontechgroup.com',
};

// Logger
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
  }
  
  async log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
    
    console.log(logLine.trim());
    
    try {
      await fs.appendFile(this.logFile, logLine);
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
  
  info(message, data) { return this.log('info', message, data); }
  warn(message, data) { return this.log('warn', message, data); }
  error(message, data) { return this.log('error', message, data); }
  success(message, data) { return this.log('success', message, data); }
}

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [CONFIG.logsDir, CONFIG.reportsDir];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
  }
}

// Execute command safely
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: CONFIG.rootDir,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer for build output
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message, 
      output: error.stdout || error.stderr || '',
      code: error.status
    };
  }
}

// Build Error Analyzer
class BuildErrorAnalyzer {
  constructor(logger) {
    this.logger = logger;
    this.errorPatterns = this.loadErrorPatterns();
  }
  
  loadErrorPatterns() {
    return {
      // TypeScript errors
      typescript: [
        { pattern: /TS\d+:/, type: 'typescript', fixable: true },
        { pattern: /Type '.+' is not assignable to type/, type: 'type-mismatch', fixable: true },
        { pattern: /Cannot find name/, type: 'missing-import', fixable: true },
        { pattern: /Property '.+' does not exist/, type: 'property-error', fixable: true },
      ],
      
      // Module errors
      module: [
        { pattern: /Module not found/, type: 'missing-module', fixable: true },
        { pattern: /Can't resolve/, type: 'module-resolution', fixable: true },
        { pattern: /Cannot find module/, type: 'import-error', fixable: true },
      ],
      
      // Syntax errors
      syntax: [
        { pattern: /Unexpected token/, type: 'syntax-error', fixable: true },
        { pattern: /Unexpected end of input/, type: 'parse-error', fixable: true },
        { pattern: /SyntaxError:/, type: 'syntax-error', fixable: true },
      ],
      
      // Build process errors
      build: [
        { pattern: /ENOSPC:/, type: 'disk-space', fixable: false },
        { pattern: /ENOMEM:/, type: 'memory-error', fixable: false },
        { pattern: /heap out of memory/, type: 'memory-error', fixable: false },
      ],
      
      // Linting errors that block build
      lint: [
        { pattern: /Error:.+\(eslint\)/, type: 'eslint-error', fixable: true },
        { pattern: /warning.+\(eslint\)/, type: 'eslint-warning', fixable: true },
      ],
    };
  }
  
  async analyzeBuild() {
    await this.logger.info('🔍 Checking build status...');
    
    // First, try a clean build check
    const buildResult = execCommand('npm run build', { silent: true });
    
    const analysis = {
      timestamp: new Date().toISOString(),
      success: buildResult.success,
      output: buildResult.output,
      errors: [],
      warnings: [],
      fixable: false,
      errorTypes: new Set(),
    };
    
    if (!buildResult.success) {
      await this.logger.warn('❌ Build failed, analyzing errors...');
      analysis.errors = this.parseErrors(buildResult.output);
      analysis.fixable = analysis.errors.some(e => e.fixable);
      analysis.errors.forEach(e => analysis.errorTypes.add(e.type));
      
      await this.logger.info(`Found ${analysis.errors.length} errors`, {
        fixable: analysis.errors.filter(e => e.fixable).length,
        types: Array.from(analysis.errorTypes),
      });
    } else {
      await this.logger.success('✅ Build successful!');
    }
    
    return analysis;
  }
  
  parseErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    // Check against all error patterns
    for (const category in this.errorPatterns) {
      const patterns = this.errorPatterns[category];
      
      for (const patternDef of patterns) {
        lines.forEach((line, index) => {
          if (patternDef.pattern.test(line)) {
            errors.push({
              category,
              type: patternDef.type,
              line: line.trim(),
              lineNumber: index,
              fixable: patternDef.fixable,
              context: this.extractContext(lines, index),
            });
          }
        });
      }
    }
    
    return errors;
  }
  
  extractContext(lines, errorLine) {
    const start = Math.max(0, errorLine - 2);
    const end = Math.min(lines.length, errorLine + 3);
    return lines.slice(start, end).join('\n');
  }
}

// Build Fixer Engine
class BuildFixerEngine {
  constructor(logger) {
    this.logger = logger;
    this.fixAttempts = 0;
  }
  
  async fixBuildErrors(analysis) {
    if (analysis.success) {
      await this.logger.info('No fixes needed - build is passing');
      return { fixed: false, attempts: 0, changes: [] };
    }
    
    await this.logger.info('🔧 Starting automated build fixes...');
    
    const changes = [];
    const errorTypes = Array.from(analysis.errorTypes);
    
    // Try fixes in order of priority
    for (const errorType of errorTypes) {
      if (this.fixAttempts >= CONFIG.maxFixAttempts) {
        await this.logger.warn('⚠️  Max fix attempts reached');
        break;
      }
      
      const result = await this.attemptFix(errorType, analysis);
      if (result.success) {
        changes.push(result);
        this.fixAttempts++;
      }
    }
    
    // If nothing worked and we should clean build, try that
    if (changes.length === 0 && CONFIG.cleanBuildOnFail) {
      await this.logger.info('Attempting clean build...');
      const cleanResult = await this.cleanAndBuild();
      if (cleanResult.success) {
        changes.push(cleanResult);
      }
    }
    
    return { 
      fixed: changes.length > 0, 
      attempts: this.fixAttempts, 
      changes 
    };
  }
  
  async attemptFix(errorType, analysis) {
    await this.logger.info(`Attempting to fix: ${errorType}`);
    
    try {
      switch (errorType) {
        case 'eslint-error':
        case 'eslint-warning':
          return await this.fixLintErrors();
        
        case 'typescript':
        case 'type-mismatch':
        case 'property-error':
          return await this.fixTypeErrors(analysis);
        
        case 'missing-module':
        case 'module-resolution':
        case 'import-error':
          return await this.fixModuleErrors(analysis);
        
        case 'syntax-error':
        case 'parse-error':
          return await this.fixSyntaxErrors(analysis);
        
        case 'missing-import':
          return await this.fixMissingImports(analysis);
        
        default:
          return { success: false, type: errorType, message: 'Unknown error type' };
      }
    } catch (error) {
      await this.logger.error(`Fix failed for ${errorType}`, { error: error.message });
      return { success: false, type: errorType, error: error.message };
    }
  }
  
  async fixLintErrors() {
    await this.logger.info('Running ESLint auto-fix...');
    const result = execCommand('npm run lint:fix', { silent: true });
    
    if (result.success || result.output.includes('fixed')) {
      await this.logger.success('✅ Lint errors fixed');
      return { 
        success: true, 
        type: 'lint', 
        message: 'Auto-fixed linting errors',
        hasChanges: true
      };
    }
    
    return { success: false, type: 'lint', message: 'Could not auto-fix lint errors' };
  }
  
  async fixTypeErrors(analysis) {
    await this.logger.info('Analyzing TypeScript errors...');
    
    // Try type-checking first
    const typeCheckResult = execCommand('npm run type-check', { silent: true });
    
    if (!typeCheckResult.success) {
      // Common fixes for TypeScript errors
      const fixes = [
        // Fix missing React imports (in case of old React code)
        async () => {
          const result = execCommand(
            'find src -type f \\( -name "*.tsx" -o -name "*.jsx" \\) -exec grep -L "import.*React" {} \\; | head -5',
            { silent: true }
          );
          
          if (result.success && result.output.trim()) {
            const files = result.output.trim().split('\n');
            for (const file of files.slice(0, 3)) {
              try {
                const content = await fs.readFile(file, 'utf8');
                if (!content.includes('import React') && (content.includes('useState') || content.includes('useEffect'))) {
                  const newContent = `import React from 'react';\n${content}`;
                  await fs.writeFile(file, newContent);
                }
              } catch (err) {
                // Skip file
              }
            }
            return true;
          }
          return false;
        },
      ];
      
      for (const fix of fixes) {
        if (await fix()) {
          return { success: true, type: 'type-error', message: 'Applied TypeScript fixes', hasChanges: true };
        }
      }
    }
    
    return { success: false, type: 'type-error', message: 'Manual TypeScript fixes required' };
  }
  
  async fixModuleErrors(analysis) {
    await this.logger.info('Fixing module resolution errors...');
    
    // Extract missing module names from errors
    const moduleErrors = analysis.errors.filter(e => 
      e.type === 'missing-module' || e.type === 'module-resolution'
    );
    
    const missingModules = new Set();
    moduleErrors.forEach(error => {
      const match = error.line.match(/Cannot find module ['"](.+?)['"]/);
      if (match) {
        missingModules.add(match[1]);
      }
    });
    
    if (missingModules.size > 0) {
      await this.logger.info(`Found ${missingModules.size} missing modules`);
      
      // Try reinstalling dependencies
      await this.logger.info('Reinstalling dependencies...');
      execCommand('npm ci', { silent: false });
      
      return { 
        success: true, 
        type: 'module-error', 
        message: `Reinstalled dependencies for ${missingModules.size} modules`,
        hasChanges: false // npm ci doesn't change code
      };
    }
    
    return { success: false, type: 'module-error', message: 'No fixable module errors found' };
  }
  
  async fixSyntaxErrors(analysis) {
    await this.logger.info('Attempting to fix syntax errors...');
    
    // Syntax errors are usually harder to auto-fix, but we can try common patterns
    const syntaxErrors = analysis.errors.filter(e => 
      e.type === 'syntax-error' || e.type === 'parse-error'
    );
    
    // Extract file paths from errors
    const files = new Set();
    syntaxErrors.forEach(error => {
      const match = error.line.match(/([^\s]+\.(ts|tsx|js|jsx)):/);
      if (match) {
        files.add(path.join(CONFIG.rootDir, match[1]));
      }
    });
    
    let fixed = false;
    
    for (const file of Array.from(files).slice(0, 3)) {
      try {
        if (fsSync.existsSync(file)) {
          const content = await fs.readFile(file, 'utf8');
          
          // Try to fix common syntax issues
          let newContent = content;
          
          // Fix missing semicolons in problematic areas
          newContent = newContent.replace(/(\w+)\n(\s*[)}])/g, '$1;$2');
          
          // Fix unclosed braces (basic detection)
          const openBraces = (newContent.match(/{/g) || []).length;
          const closeBraces = (newContent.match(/}/g) || []).length;
          
          if (openBraces > closeBraces) {
            newContent += '\n}'.repeat(openBraces - closeBraces);
            fixed = true;
          }
          
          if (newContent !== content) {
            await fs.writeFile(file, newContent);
            fixed = true;
          }
        }
      } catch (err) {
        await this.logger.warn(`Could not fix ${file}`, { error: err.message });
      }
    }
    
    if (fixed) {
      return { success: true, type: 'syntax-error', message: 'Fixed syntax errors', hasChanges: true };
    }
    
    return { success: false, type: 'syntax-error', message: 'Manual syntax fixes required' };
  }
  
  async fixMissingImports(analysis) {
    await this.logger.info('Fixing missing imports...');
    
    // This is a placeholder - real implementation would use AST analysis
    // For now, just run lint fix which often helps with imports
    return await this.fixLintErrors();
  }
  
  async cleanAndBuild() {
    await this.logger.info('Performing clean build...');
    
    // Remove build artifacts
    execCommand('rm -rf .next', { silent: true });
    execCommand('rm -rf node_modules/.cache', { silent: true });
    
    // Try building again
    const buildResult = execCommand('npm run build', { silent: true });
    
    if (buildResult.success) {
      await this.logger.success('✅ Clean build successful!');
      return { 
        success: true, 
        type: 'clean-build', 
        message: 'Clean build resolved issues',
        hasChanges: false
      };
    }
    
    return { success: false, type: 'clean-build', message: 'Clean build failed' };
  }
}

// Git Manager
class GitManager {
  constructor(logger) {
    this.logger = logger;
  }
  
  async hasChanges() {
    const result = execCommand('git status --porcelain', { silent: true });
    return result.success && result.output.trim().length > 0;
  }
  
  async commitAndPush(message, changes = []) {
    if (!CONFIG.autoCommit) {
      await this.logger.info('Auto-commit disabled, skipping');
      return { success: false, message: 'Auto-commit disabled' };
    }
    
    try {
      if (!(await this.hasChanges())) {
        await this.logger.info('No changes to commit');
        return { success: true, message: 'No changes' };
      }
      
      // Stage all changes
      execCommand('git add .');
      
      // Create commit message
      const commitMsg = `🔨 AI Build Fixer: ${message}

${changes.length > 0 ? 'Fixes applied:\n' + changes.map(c => `- ${c.message}`).join('\n') : ''}

Automated by AI Build Fixer Agent
Timestamp: ${new Date().toISOString()}
Repository: ${CONFIG.repository}`;
      
      // Commit
      const commitResult = execCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { silent: true });
      
      if (commitResult.success) {
        await this.logger.success('✅ Changes committed');
        
        // Push if enabled
        if (CONFIG.autoPush) {
          const pushResult = execCommand('git push origin main', { silent: true });
          if (pushResult.success) {
            await this.logger.success('✅ Changes pushed to main');
            return { success: true, message: 'Committed and pushed' };
          } else {
            await this.logger.warn('⚠️  Failed to push changes');
            return { success: false, message: 'Commit succeeded, push failed' };
          }
        }
        
        return { success: true, message: 'Committed (push disabled)' };
      }
      
      return { success: false, message: 'Commit failed' };
    } catch (error) {
      await this.logger.error('Failed to commit', { error: error.message });
      return { success: false, error: error.message };
    }
  }
}

// Main AI Build Fixer Agent
class AIBuildFixerAgent {
  constructor() {
    const logFile = path.join(CONFIG.logsDir, 'ai-build-fixer.log');
    this.logger = new Logger(logFile);
    this.analyzer = new BuildErrorAnalyzer(this.logger);
    this.fixer = new BuildFixerEngine(this.logger);
    this.gitManager = new GitManager(this.logger);
    this.isRunning = false;
    this.runCount = 0;
  }
  
  async run() {
    const startTime = Date.now();
    this.runCount++;
    
    await this.logger.info('═══════════════════════════════════════════════════');
    await this.logger.info(`🚀 AI Build Fixer Agent - Run #${this.runCount}`);
    await this.logger.info('═══════════════════════════════════════════════════');
    
    try {
      // Step 1: Analyze build
      const analysis = await this.analyzer.analyzeBuild();
      
      if (analysis.success) {
        await this.logger.success('✅ Build is healthy - no fixes needed!');
        await this.saveReport({ analysis, fixes: [], success: true, runtime: Date.now() - startTime });
        return { success: true, buildFixed: false };
      }
      
      // Step 2: Apply fixes
      const fixResult = await this.fixer.fixBuildErrors(analysis);
      
      // Step 3: Verify build after fixes
      let buildFixed = false;
      if (fixResult.fixed) {
        await this.logger.info('🔍 Verifying build after fixes...');
        const verifyResult = await this.analyzer.analyzeBuild();
        buildFixed = verifyResult.success;
        
        if (buildFixed) {
          await this.logger.success('🎉 Build fixed successfully!');
        } else {
          await this.logger.warn('⚠️  Build still failing after fixes');
        }
      }
      
      // Step 4: Commit changes if fixes were applied
      const changesToCommit = fixResult.changes.filter(c => c.hasChanges);
      if (changesToCommit.length > 0) {
        await this.gitManager.commitAndPush(
          buildFixed ? 'Fixed build errors' : 'Applied build fixes (build still needs work)',
          changesToCommit
        );
      }
      
      // Step 5: Save report
      const runtime = Date.now() - startTime;
      await this.saveReport({ 
        analysis, 
        fixes: fixResult.changes, 
        success: buildFixed, 
        runtime 
      });
      
      await this.logger.info(`⏱️  Run completed in ${(runtime / 1000).toFixed(2)}s`);
      
      return { success: true, buildFixed };
      
    } catch (error) {
      await this.logger.error('❌ Build fixer failed', { error: error.message, stack: error.stack });
      return { success: false, error: error.message };
    }
  }
  
  async runContinuously() {
    this.isRunning = true;
    await this.logger.info('⚡ Starting ULTRA-FAST continuous build monitoring mode...');
    await this.logger.info(`Will check build every ${CONFIG.intervalMinutes} minute(s) - MAXIMUM SPEED`);
    
    // Convert interval to milliseconds
    const waitMs = CONFIG.intervalMinutes * 60 * 1000;
    
    while (this.isRunning) {
      try {
        const startTime = Date.now();
        await this.run();
        const runtime = Date.now() - startTime;
        
        // Calculate wait time, but ensure we don't wait if run took longer than interval
        const nextWait = Math.max(1000, waitMs - runtime); // Minimum 1 second wait
        
        await this.logger.info(`⚡ Next check in ${Math.round(nextWait / 1000)}s (runtime: ${Math.round(runtime / 1000)}s)`);
        await new Promise(resolve => setTimeout(resolve, nextWait));
      } catch (error) {
        await this.logger.error('Error in continuous loop', { error: error.message });
        // Fast retry on error - only wait 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  async saveReport(data) {
    const report = {
      timestamp: new Date().toISOString(),
      runNumber: this.runCount,
      buildStatus: data.analysis.success ? 'passing' : 'failing',
      errorCount: data.analysis.errors.length,
      fixesAttempted: data.fixes.length,
      fixesSuccessful: data.fixes.filter(f => f.success).length,
      buildFixed: data.success,
      runtime: data.runtime,
      errors: data.analysis.errors,
      fixes: data.fixes,
      config: CONFIG,
    };
    
    try {
      // Save timestamped report
      const reportPath = path.join(CONFIG.reportsDir, `build-fixer-${Date.now()}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      
      // Save as latest
      const latestPath = path.join(CONFIG.reportsDir, 'build-fixer-latest.json');
      await fs.writeFile(latestPath, JSON.stringify(report, null, 2));
      
      await this.logger.info(`📊 Report saved to ${reportPath}`);
    } catch (error) {
      await this.logger.error('Failed to save report', { error: error.message });
    }
  }
  
  stop() {
    this.isRunning = false;
    this.logger.info('🛑 Stopping continuous build monitoring...');
  }
}

// CLI Interface
async function main() {
  await ensureDirectories();
  
  const agent = new AIBuildFixerAgent();
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  switch (command) {
    case 'run':
      await agent.run();
      break;
    
    case 'continuous':
      await agent.runContinuously();
      break;
    
    case 'check':
      const analyzer = new BuildErrorAnalyzer(agent.logger);
      const analysis = await analyzer.analyzeBuild();
      console.log(JSON.stringify(analysis, null, 2));
      process.exit(analysis.success ? 0 : 1);
      break;
    
    default:
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║           AI Build Fixer Agent                                  ║
║           Autonomous Build Error Detection & Fixing             ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  node ai-build-fixer-agent.cjs [command]

Commands:
  run         Run one build check and fix cycle (default)
  continuous  Run continuously with periodic build checks
  check       Check build status only (no fixes)

Environment Variables:
  CONTINUOUS_BUILD_FIXER=true   Enable continuous mode
  BUILD_CHECK_INTERVAL=1        Minutes between checks (default: 1)
  AUTO_COMMIT=true             Auto-commit fixes (default: true)
  AUTO_PUSH=true               Auto-push to main (default: true)
  MAX_FIX_ATTEMPTS=10          Max fixes per cycle (default: 10)
  CLEAN_BUILD_ON_FAIL=true     Try clean build if fixes fail (default: true)

Examples:
  node ai-build-fixer-agent.cjs run
  CONTINUOUS_BUILD_FIXER=true node ai-build-fixer-agent.cjs continuous
  node ai-build-fixer-agent.cjs check

Repository: ${CONFIG.repository}
Canonical URL: ${CONFIG.canonicalUrl}
      `);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { AIBuildFixerAgent, CONFIG };

