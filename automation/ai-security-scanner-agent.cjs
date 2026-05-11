#!/usr/bin/env node

/**
 * AI Security Scanner Agent - Continuous Security Monitoring
 * 
 * Features:
 * - Scans for security vulnerabilities
 * - Checks dependencies for known issues
 * - Detects insecure code patterns
 * - Auto-fixes common security issues
 * - Monitors environment variables
 * - Checks API security
 * - Generates security reports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AISecurityScannerAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.logsDir = path.join(__dirname, 'logs');
    this.logFile = path.join(this.logsDir, 'security-scanner.log');
    this.reportFile = path.join(this.logsDir, 'security-report.json');
    
    this.securityPatterns = [
      { pattern: /eval\(/g, severity: 'HIGH', message: 'Use of eval() is dangerous' },
      { pattern: /innerHTML\s*=/g, severity: 'MEDIUM', message: 'innerHTML can lead to XSS' },
      { pattern: /document\.write/g, severity: 'MEDIUM', message: 'document.write is unsafe' },
      { pattern: /dangerouslySetInnerHTML/g, severity: 'LOW', message: 'Ensure HTML is sanitized' },
      { pattern: /process\.env\.\w+/g, severity: 'INFO', message: 'Environment variable usage detected' },
      { pattern: /password\s*=\s*['"]/gi, severity: 'CRITICAL', message: 'Hardcoded password detected' },
      { pattern: /api[_-]?key\s*=\s*['"]/gi, severity: 'CRITICAL', message: 'Hardcoded API key detected' },
      { pattern: /secret\s*=\s*['"]/gi, severity: 'CRITICAL', message: 'Hardcoded secret detected' },
    ];
    
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
    console.log(`[SEC-SCAN] ${message}`);
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  async scanDependencies() {
    this.log('🔍 Scanning dependencies for vulnerabilities...');
    
    const vulnerabilities = {
      critical: [],
      high: [],
      moderate: [],
      low: []
    };
    
    try {
      const auditOutput = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities) {
        for (const [name, vuln] of Object.entries(auditData.vulnerabilities)) {
          const severity = vuln.severity.toLowerCase();
          if (vulnerabilities[severity]) {
            vulnerabilities[severity].push({
              name,
              severity: vuln.severity,
              via: vuln.via,
              fixAvailable: vuln.fixAvailable
            });
          }
        }
      }
      
      const total = Object.values(vulnerabilities).reduce((sum, arr) => sum + arr.length, 0);
      this.log(`Found ${total} vulnerabilities`);
      
    } catch (error) {
      this.log('Dependency scan completed with warnings', 'WARN');
    }
    
    return vulnerabilities;
  }

  async scanCodeForSecurityIssues() {
    this.log('🔒 Scanning code for security patterns...');
    
    const issues = [];
    const srcDir = path.join(this.projectRoot, 'src');
    
    if (!fs.existsSync(srcDir)) {
      this.log('Source directory not found', 'WARN');
      return issues;
    }
    
    const files = this.getAllFiles(srcDir);
    
    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fileIssues = this.scanFileContent(file, content);
        issues.push(...fileIssues);
      } catch (error) {
        this.log(`Failed to scan ${file}: ${error.message}`, 'ERROR');
      }
    }
    
    this.log(`Found ${issues.length} security issues in code`);
    return issues;
  }

  getAllFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          this.getAllFiles(fullPath, files);
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  scanFileContent(filePath, content) {
    const issues = [];
    const lines = content.split('\n');
    
    for (const pattern of this.securityPatterns) {
      let match;
      while ((match = pattern.pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        
        issues.push({
          file: filePath,
          line: lineNumber,
          severity: pattern.severity,
          message: pattern.message,
          code: lines[lineNumber - 1]?.trim()
        });
      }
      
      // Reset regex
      pattern.pattern.lastIndex = 0;
    }
    
    return issues;
  }

  async checkEnvironmentVariables() {
    this.log('🔑 Checking environment variable security...');
    
    const envIssues = [];
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    for (const envFile of envFiles) {
      const envPath = path.join(this.projectRoot, envFile);
      
      if (fs.existsSync(envPath)) {
        envIssues.push({
          severity: 'CRITICAL',
          message: `${envFile} file found in repository - should be in .gitignore`,
          file: envPath
        });
      }
    }
    
    // Check if sensitive env vars are used correctly
    const srcFiles = this.getAllFiles(path.join(this.projectRoot, 'src'));
    
    for (const file of srcFiles) {
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) continue;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for client-side usage of server-only vars
        if (file.includes('components') || file.includes('pages')) {
          const serverVars = content.match(/process\.env\.(?!NEXT_PUBLIC_)\w+/g);
          if (serverVars && !content.includes('getServerSideProps') && !content.includes('getStaticProps')) {
            envIssues.push({
              severity: 'HIGH',
              message: 'Server-side env var used in client component',
              file,
              details: serverVars.join(', ')
            });
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return envIssues;
  }

  async fixSecurityIssues(issues) {
    this.log('🔧 Attempting to auto-fix security issues...');
    
    const fixed = [];
    
    for (const issue of issues) {
      if (issue.severity === 'CRITICAL' || issue.severity === 'HIGH') {
        try {
          const result = await this.autoFixIssue(issue);
          if (result) {
            fixed.push(issue);
          }
        } catch (error) {
          this.log(`Failed to fix issue in ${issue.file}: ${error.message}`, 'ERROR');
        }
      }
    }
    
    this.log(`Auto-fixed ${fixed.length} security issues`);
    return fixed;
  }

  async autoFixIssue(issue) {
    const content = fs.readFileSync(issue.file, 'utf8');
    let fixed = content;
    
    // Fix innerHTML to use textContent where appropriate
    if (issue.message.includes('innerHTML')) {
      fixed = fixed.replace(
        /\.innerHTML\s*=\s*([^;]+);/g,
        '.textContent = $1;'
      );
    }
    
    // Fix eval usage
    if (issue.message.includes('eval')) {
      // Add comment warning
      const lines = fixed.split('\n');
      lines[issue.line - 1] = '// SECURITY WARNING: eval() usage detected\n' + lines[issue.line - 1];
      fixed = lines.join('\n');
    }
    
    if (fixed !== content) {
      fs.writeFileSync(issue.file, fixed);
      return true;
    }
    
    return false;
  }

  async fixVulnerabilities(vulnerabilities) {
    this.log('🛠️ Attempting to fix vulnerabilities...');
    
    const critical = vulnerabilities.critical || [];
    const high = vulnerabilities.high || [];
    
    const toFix = [...critical, ...high].filter(v => v.fixAvailable);
    
    if (toFix.length === 0) {
      this.log('No auto-fixable vulnerabilities found');
      return false;
    }
    
    try {
      this.log(`Attempting to fix ${toFix.length} vulnerabilities...`);
      execSync('npm audit fix', { stdio: 'inherit' });
      this.log('✅ Vulnerabilities fixed');
      return true;
    } catch (error) {
      this.log('Some vulnerabilities require manual intervention', 'WARN');
      
      try {
        execSync('npm audit fix --force', { stdio: 'inherit' });
        this.log('✅ Force-fixed vulnerabilities');
        return true;
      } catch (forceError) {
        this.log('Could not auto-fix vulnerabilities', 'ERROR');
        return false;
      }
    }
  }

  async generateSecurityReport(vulnerabilities, codeIssues, envIssues) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalVulnerabilities: Object.values(vulnerabilities).reduce((sum, arr) => sum + arr.length, 0),
        criticalVulnerabilities: vulnerabilities.critical.length,
        highVulnerabilities: vulnerabilities.high.length,
        codeIssues: codeIssues.length,
        environmentIssues: envIssues.length,
        overallRisk: this.calculateRiskLevel(vulnerabilities, codeIssues, envIssues)
      },
      vulnerabilities,
      codeIssues: codeIssues.slice(0, 50), // Limit to top 50
      environmentIssues: envIssues,
      recommendations: this.generateRecommendations(vulnerabilities, codeIssues, envIssues)
    };
    
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));
    this.log(`Security report saved to ${this.reportFile}`);
    
    return report;
  }

  calculateRiskLevel(vulnerabilities, codeIssues, envIssues) {
    const criticalCount = (vulnerabilities.critical?.length || 0) + 
      codeIssues.filter(i => i.severity === 'CRITICAL').length +
      envIssues.filter(i => i.severity === 'CRITICAL').length;
    
    const highCount = (vulnerabilities.high?.length || 0) +
      codeIssues.filter(i => i.severity === 'HIGH').length +
      envIssues.filter(i => i.severity === 'HIGH').length;
    
    if (criticalCount > 0) return 'CRITICAL';
    if (highCount > 5) return 'HIGH';
    if (highCount > 0) return 'MEDIUM';
    return 'LOW';
  }

  generateRecommendations(vulnerabilities, codeIssues, envIssues) {
    const recommendations = [];
    
    if (vulnerabilities.critical?.length > 0) {
      recommendations.push('URGENT: Update dependencies with critical vulnerabilities immediately');
    }
    
    if (codeIssues.some(i => i.severity === 'CRITICAL')) {
      recommendations.push('Remove hardcoded credentials from code');
    }
    
    if (envIssues.length > 0) {
      recommendations.push('Review environment variable usage and security');
    }
    
    if (codeIssues.some(i => i.message.includes('innerHTML'))) {
      recommendations.push('Replace innerHTML with safer alternatives or sanitize input');
    }
    
    recommendations.push('Enable GitHub security alerts for the repository');
    recommendations.push('Implement Content Security Policy (CSP) headers');
    recommendations.push('Regular security audits every sprint');
    
    return recommendations;
  }

  async commitChanges(message) {
    try {
      execSync('git add .', { stdio: 'ignore' });
      execSync(`git commit -m "${message}"`, { stdio: 'ignore' });
      execSync('git push origin main', { stdio: 'ignore' });
      this.log('✅ Security fixes committed and pushed');
      return true;
    } catch (error) {
      this.log(`Failed to commit: ${error.message}`, 'WARN');
      return false;
    }
  }

  async run() {
    this.log('🚀 AI Security Scanner Agent started');
    
    try {
      // Scan dependencies
      const vulnerabilities = await this.scanDependencies();
      
      // Scan code
      const codeIssues = await this.scanCodeForSecurityIssues();
      
      // Check environment variables
      const envIssues = await this.checkEnvironmentVariables();
      
      // Generate report
      const report = await this.generateSecurityReport(vulnerabilities, codeIssues, envIssues);
      
      this.log(`Security scan complete - Risk level: ${report.summary.overallRisk}`);
      
      // Auto-fix if enabled
      if (process.env.AUTO_FIX_SECURITY === 'true') {
        const vulnFixed = await this.fixVulnerabilities(vulnerabilities);
        const codeFixed = await this.fixSecurityIssues(codeIssues);
        
        if (vulnFixed || codeFixed.length > 0) {
          await this.commitChanges('security: auto-fix security issues [AI-Security-Agent]');
        }
      }
      
      this.log('✅ Security scan complete');
    } catch (error) {
      this.log(`Security scan failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async continuous() {
    this.log('🔄 Starting continuous security monitoring...');
    
    const interval = parseInt(process.env.SECURITY_SCAN_INTERVAL || '60') * 60 * 1000;
    
    while (true) {
      try {
        await this.run();
      } catch (error) {
        this.log(`Continuous cycle failed: ${error.message}`, 'ERROR');
      }
      this.log(`Waiting ${interval / 60000} minutes until next scan...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

// CLI
const agent = new AISecurityScannerAgent();
const command = process.argv[2] || 'run';

if (command === 'continuous') {
  agent.continuous().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else {
  agent.run().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

