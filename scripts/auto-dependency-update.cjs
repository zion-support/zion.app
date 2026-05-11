#!/usr/bin/env node
/**
 * Auto-update dependencies and create PR
 */
const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Updating dependencies...');
  execSync('npm update --save', { stdio: 'inherit' });
  execSync('npm audit fix --force', { stdio: 'inherit' });
  
  // Check if there are changes
  const status = execSync('git status --porcelain').toString();
  if (!status.trim()) {
    console.log('No dependency updates available.');
    process.exit(0);
  }
  
  console.log('Changes detected, creating PR...');
  execSync('git config user.name "OpenClaw Bot"');
  execSync('git config user.email "bot@openclaw.ai"');
  execSync('git checkout -b auto-dependency-update');
  execSync('git add package.json package-lock.json');
  execSync('git commit -m "[ci] Auto-update dependencies"');
  execSync('git push origin auto-dependency-update');
  
  // Create PR using gh
  const prUrl = execSync('gh pr create --title "Auto-dependency update" --body "Automated dependency updates" --label "dependencies"').toString();
  console.log('PR created:', prUrl);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
