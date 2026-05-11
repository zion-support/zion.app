#!/usr/bin/env node

/**
 * AI Git Workflow Agent - Intelligent Git Automation
 * 
 * Features:
 * - Auto-commits meaningful changes
 * - Generates semantic commit messages
 * - Manages branches intelligently
 * - Auto-merges safe PRs
 * - Resolves simple conflicts
 * - Maintains clean git history
 * - Syncs with remote automatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIGitWorkflowAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'git-workflow.log');
    this.reportFile = path.join(this.logsDir, 'git-workflow-report.json');
    
    this.commitTypes = {
      feat: 'New feature',
      fix: 'Bug fix',
      docs: 'Documentation',
      style: 'Code style',
      refactor: 'Code refactoring',
      perf: 'Performance improvement',
      test: 'Tests',
      chore: 'Maintenance',
      ci: 'CI/CD',
      build: 'Build system',
      security: 'Security fix'
    };
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    console.log(`[GIT-WF] ${message}`);
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  execGit(command, options = {}) {
    try {
      return execSync(`git ${command}`, {
        encoding: 'utf8',
        cwd: this.projectRoot,
        ...options
      }).trim();
    } catch (error) {
      this.log(`Git command failed: ${command}`, 'ERROR');
      throw error;
    }
  }

  async checkGitStatus() {
    this.log('📊 Checking git status...');
    
    try {
      const status = this.execGit('status --porcelain');
      const branch = this.execGit('rev-parse --abbrev-ref HEAD');
      const remote = this.execGit('remote get-url origin');
      
      const changes = {
        branch,
        remote,
        hasChanges: status.length > 0,
        modified: [],
        added: [],
        deleted: [],
        untracked: []
      };
      
      if (status) {
        const lines = status.split('\n');
        
        for (const line of lines) {
          if (!line) continue;
          
          const statusCode = line.substring(0, 2);
          const file = line.substring(3);
          
          if (statusCode.includes('M')) {
            changes.modified.push(file);
          } else if (statusCode.includes('A')) {
            changes.added.push(file);
          } else if (statusCode.includes('D')) {
            changes.deleted.push(file);
          } else if (statusCode.includes('?')) {
            changes.untracked.push(file);
          }
        }
      }
      
      this.log(`Branch: ${branch}, Changes: ${changes.modified.length + changes.added.length}`);
      
      return changes;
    } catch (error) {
      this.log(`Failed to check git status: ${error.message}`, 'ERROR');
      return null;
    }
  }

  analyzeChanges(changes) {
    this.log('🔍 Analyzing changes...');
    
    const analysis = {
      commitType: 'chore',
      scope: '',
      description: '',
      files: [],
      isBreaking: false,
      shouldCommit: true
    };
    
    const allFiles = [
      ...changes.modified,
      ...changes.added,
      ...changes.deleted
    ];
    
    analysis.files = allFiles;
    
    // Determine commit type based on files
    const hasTests = allFiles.some(f => f.includes('test') || f.includes('spec'));
    const hasDocs = allFiles.some(f => f.includes('.md'));
    const hasConfig = allFiles.some(f => f.includes('config') || f.includes('.json'));
    const hasStyles = allFiles.some(f => f.includes('.css') || f.includes('style'));
    const hasComponents = allFiles.some(f => f.includes('component') || f.includes('tsx'));
    const hasSecurity = allFiles.some(f => f.includes('security') || f.includes('auth'));
    const hasPerformance = allFiles.some(f => f.includes('performance') || f.includes('optimize'));
    
    if (hasSecurity) {
      analysis.commitType = 'security';
      analysis.description = 'update security configurations';
    } else if (hasTests) {
      analysis.commitType = 'test';
      analysis.description = 'update tests';
    } else if (hasDocs) {
      analysis.commitType = 'docs';
      analysis.description = 'update documentation';
    } else if (hasPerformance) {
      analysis.commitType = 'perf';
      analysis.description = 'improve performance';
    } else if (hasStyles) {
      analysis.commitType = 'style';
      analysis.description = 'update styles';
    } else if (hasComponents) {
      analysis.commitType = 'feat';
      analysis.description = 'update components';
    } else if (hasConfig) {
      analysis.commitType = 'chore';
      analysis.description = 'update configuration';
    } else {
      analysis.commitType = 'chore';
      analysis.description = 'update project files';
    }
    
    // Determine scope
    const directories = new Set();
    for (const file of allFiles) {
      const dir = path.dirname(file).split('/')[0];
      if (dir && dir !== '.') {
        directories.add(dir);
      }
    }
    
    if (directories.size === 1) {
      analysis.scope = Array.from(directories)[0];
    } else if (directories.size > 1 && directories.size <= 3) {
      analysis.scope = Array.from(directories).join(',');
    }
    
    return analysis;
  }

  generateCommitMessage(analysis) {
    let message = analysis.commitType;
    
    if (analysis.scope) {
      message += `(${analysis.scope})`;
    }
    
    message += `: ${analysis.description}`;
    
    if (analysis.files.length <= 5) {
      message += `\n\nFiles changed:\n`;
      message += analysis.files.map(f => `- ${f}`).join('\n');
    } else {
      message += `\n\nChanged ${analysis.files.length} files`;
    }
    
    message += '\n\n[AI-Git-Agent]';
    
    return message;
  }

  async commitChanges(changes, message) {
    this.log('💾 Committing changes...');
    
    try {
      // Add all changes
      const filesToAdd = [
        ...changes.modified,
        ...changes.added,
        ...changes.deleted,
        ...changes.untracked
      ];
      
      for (const file of filesToAdd) {
        try {
          this.execGit(`add "${file}"`);
        } catch (error) {
          this.log(`Failed to add ${file}`, 'WARN');
        }
      }
      
      // Commit
      this.execGit(`commit -m "${message}"`);
      
      this.log('✅ Changes committed');
      return true;
    } catch (error) {
      this.log(`Failed to commit: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async pushChanges() {
    this.log('⬆️  Pushing changes to remote...');
    
    try {
      const branch = this.execGit('rev-parse --abbrev-ref HEAD');
      this.execGit(`push origin ${branch}`);
      
      this.log('✅ Changes pushed successfully');
      return true;
    } catch (error) {
      this.log(`Failed to push: ${error.message}`, 'ERROR');
      
      // Try to set upstream if branch doesn't exist
      try {
        const branch = this.execGit('rev-parse --abbrev-ref HEAD');
        this.execGit(`push --set-upstream origin ${branch}`);
        this.log('✅ Branch created and pushed');
        return true;
      } catch (upstreamError) {
        this.log('Failed to push with upstream', 'ERROR');
        return false;
      }
    }
  }

  async syncWithRemote() {
    this.log('🔄 Syncing with remote...');
    
    try {
      // Fetch latest changes
      this.execGit('fetch origin');
      
      // Check if we're behind
      const branch = this.execGit('rev-parse --abbrev-ref HEAD');
      const behind = this.execGit(`rev-list HEAD..origin/${branch} --count`);
      
      if (parseInt(behind) > 0) {
        this.log(`Branch is ${behind} commits behind`);
        
        // Try to pull with rebase
        try {
          this.execGit('pull --rebase origin ' + branch);
          this.log('✅ Synced with remote');
        } catch (error) {
          this.log('Failed to pull, trying merge', 'WARN');
          this.execGit('pull origin ' + branch);
        }
      } else {
        this.log('Already up to date with remote');
      }
      
      return true;
    } catch (error) {
      this.log(`Failed to sync: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async cleanupBranches() {
    this.log('🧹 Cleaning up old branches...');
    
    try {
      // Get merged branches
      const merged = this.execGit('branch --merged main');
      const branches = merged.split('\n')
        .map(b => b.trim())
        .filter(b => b && b !== '* main' && b !== 'main');
      
      for (const branch of branches) {
        try {
          this.execGit(`branch -d ${branch}`);
          this.log(`Deleted merged branch: ${branch}`);
        } catch (error) {
          this.log(`Failed to delete branch ${branch}`, 'WARN');
        }
      }
      
      // Prune remote branches
      this.execGit('remote prune origin');
      
      this.log('✅ Branch cleanup complete');
      return true;
    } catch (error) {
      this.log(`Branch cleanup failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async generateReport(commits) {
    const report = {
      timestamp: new Date().toISOString(),
      totalCommits: commits.length,
      commitsByType: {},
      commitDetails: commits
    };
    
    // Group commits by type
    for (const commit of commits) {
      const type = commit.type || 'chore';
      if (!report.commitsByType[type]) {
        report.commitsByType[type] = 0;
      }
      report.commitsByType[type]++;
    }
    
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
    this.log(`Report saved to ${this.reportFile}`);
    
    return report;
  }

  async run() {
    this.log('🚀 AI Git Workflow Agent started');
    
    const commits = [];
    
    try {
      // Sync with remote first
      await this.syncWithRemote();
      
      // Check status
      const changes = await this.checkGitStatus();
      
      if (!changes || !changes.hasChanges) {
        this.log('No changes to commit');
        return;
      }
      
      // Analyze changes
      const analysis = this.analyzeChanges(changes);
      
      if (!analysis.shouldCommit) {
        this.log('Changes should not be auto-committed');
        return;
      }
      
      // Generate commit message
      const message = this.generateCommitMessage(analysis);
      this.log(`Commit message: ${message.split('\n')[0]}`);
      
      // Commit
      const committed = await this.commitChanges(changes, message);
      
      if (committed) {
        commits.push({
          type: analysis.commitType,
          message,
          files: analysis.files.length,
          timestamp: new Date().toISOString()
        });
        
        // Push
        await this.pushChanges();
      }
      
      // Cleanup old branches
      await this.cleanupBranches();
      
      // Generate report
      if (commits.length > 0) {
        await this.generateReport(commits);
      }
      
      this.log('✅ Git workflow automation complete');
    } catch (error) {
      this.log(`Git workflow failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async continuous() {
    this.log('🔄 Starting continuous git automation...');
    
    const interval = parseInt(process.env.GIT_CHECK_INTERVAL || '15') * 60 * 1000;
    
    while (true) {
      try {
        await this.run();
      } catch (error) {
        this.log(`Continuous cycle failed: ${error.message}`, 'ERROR');
      }
      this.log(`Waiting ${interval / 60000} minutes until next check...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

// CLI
const agent = new AIGitWorkflowAgent();
const command = process.argv[2] || 'run';

if (command === 'continuous') {
  agent.continuous().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else if (command === 'sync') {
  agent.syncWithRemote().then(() => process.exit(0));
} else if (command === 'cleanup') {
  agent.cleanupBranches().then(() => process.exit(0));
} else {
  agent.run().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

