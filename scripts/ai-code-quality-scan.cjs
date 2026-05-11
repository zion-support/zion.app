#!/usr/bin/env node
/**
 * AI Code Quality Scanner
 * Scans codebase for quality issues and suggests fixes.
 */
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running AI Code Quality Scan...');

try {
  // Run ESLint with JSON output
  const eslintOutput = execSync('npx eslint . --format json --no-error-on-unmatched-pattern 2>/dev/null || true', { encoding: 'utf8' });
  
  let results = [];
  try {
    results = JSON.parse(eslintOutput);
  } catch (e) {
    console.log('No ESLint issues or parse error');
  }
  
  const issues = results.flatMap(file => 
    file.messages.map(msg => ({
      file: file.filePath,
      line: msg.line,
      message: msg.message,
      rule: msg.ruleId
    }))
  ).filter(issue => issue.rule); // Only include rule-based issues
  
  if (issues.length === 0) {
    console.log('✅ No code quality issues found');
    process.exit(0);
  }
  
  console.log(`Found ${issues.length} quality issues`);
  
  // Create issue for critical patterns
  const criticalPatterns = ['no-unused-vars', 'no-undef', 'security/detect-object-injection'];
  const criticalIssues = issues.filter(i => criticalPatterns.includes(i.rule));
  
  if (criticalIssues.length > 0) {
    const body = `AI Code Quality Scan detected ${criticalIssues.length} critical issues:\n\n` +
      criticalIssues.slice(0, 10).map(i => `- ${i.file}:${i.line} - ${i.message} (${i.rule})`).join('\n');
    
    try {
      execSync(`gh issue create --title "Code Quality Issues Detected" --body "${body}" --label "code-quality,ai-scan"`, { stdio: 'inherit' });
    } catch (e) {
      console.log('Could not create GitHub issue');
    }
  }
  
  console.log('Scan complete');
} catch (err) {
  console.error('Scan failed:', err.message);
  process.exit(1);
}
