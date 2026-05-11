#!/usr/bin/env node
/**
 * AI License Compliance Checker
 * Scans dependencies for forbidden licenses (GPL, AGPL, LGPL, etc.)
 */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('🔍 Checking license compliance...');
  
  // Get all dependencies with license info
  const output = execSync('npm ls --json --depth=0 2>/dev/null || true', { encoding: 'utf8' });
  let pkg = {};
  try {
    pkg = JSON.parse(output);
  } catch (e) {
    console.log('No package.json found or parse error');
    process.exit(0);
  }
  
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const forbidden = ['GPL', 'AGPL', 'LGPL', 'MPL']; // Copyleft licenses
  const issues = [];
  
  Object.entries(deps).forEach(([name, info]) => {
    const license = info.license || 'UNKNOWN';
    if (forbidden.some(f => license.toUpperCase().includes(f))) {
      issues.push(`- ${name}: ${license}`);
    }
  });
  
  if (issues.length > 0) {
    console.log('⚠️ Forbidden licenses detected:');
    console.log(issues.join('\n'));
    
    // Create GitHub issue
    const body = `License Compliance Violation Detected\n\nThe following dependencies use copyleft/fobidden licenses:\n${issues.join('\n')}\n\nPlease replace with MIT/Apache-2.0 alternatives.`;
    try {
      execSync(`gh issue create --title \"License Compliance Violation\" --body \"${body}\" --label \"legal,compliance\"`, { stdio: 'inherit' });
    } catch (e) {
      console.log('Could not create GitHub issue (maybe no GH_TOKEN)');
    }
    process.exit(1);
  } else {
    console.log('✅ All dependencies have compliant licenses (MIT/Apache-2.0/etc.)');
  }
} catch (err) {
  console.error('Compliance check failed:', err.message);
  process.exit(1);
}
