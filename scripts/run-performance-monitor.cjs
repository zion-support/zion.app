#!/usr/bin/env node
/**
 * Performance monitor wrapper - runs perf check and creates issue on regression.
 */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('🚀 Running performance check...');
  const output = execSync('node scripts/performance-check.js 2>&1', { encoding: 'utf8' });
  console.log(output);
  
  // Simple regression detection: look for "failed" or "performance" warning
  const hasRegression = output.includes('performance regression') || output.includes('⚠️');
  
  if (hasRegression) {
    console.log('⚠️ Performance regression detected!');
    try {
      execSync('gh issue create --title "Performance Regression Detected" --body "Automated performance check detected potential regression.\\n\\n```\\n' + output.slice(0, 2000) + '\\n```" --label "performance"');
    } catch (e) {
      console.log('Could not create GitHub issue (maybe no GH_TOKEN)');
    }
    process.exit(1);
  } else {
    console.log('✅ Performance check passed');
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}