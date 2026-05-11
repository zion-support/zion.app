#!/usr/bin/env node
/**
 * Auto-generate CHANGELOG.md from commit history
 * Runs autonomously and commits changes
 */

const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Get commits since last tag
  const tags = execSync('git tag --sort=-creatordate').toString().trim().split('\n');
  const lastTag = tags[0] || '';
  const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
  
  // Get commit messages
  const log = execSync(`git log ${range} --pretty=format:"%h %s" --no-merges`).toString();
  const lines = log.split('\n').filter(l => l.trim());
  
  if (lines.length === 0) {
    console.log('No new commits since last tag. Skipping changelog update.');
    process.exit(0);
  }
  
  // Parse commits into categories
  const features = [];
  const fixes = [];
  const chores = [];
  
  lines.forEach(line => {
    const match = line.match(/^(\w+)\s+(.*)/);
    if (!match) return;
    const [, hash, msg] = match;
    if (msg.startsWith('feat')) features.push(`- ${msg} (${hash})`);
    else if (msg.startsWith('fix')) fixes.push(`- ${msg} (${hash})`);
    else if (msg.startsWith('chore') || msg.startsWith('ci')) chores.push(`- ${msg} (${hash})`);
  });
  
  // Read existing changelog
  let changelog = '';
  if (fs.existsSync('CHANGELOG.md')) {
    changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  }
  
  // Build new entry
  const date = new Date().toISOString().split('T')[0];
  let newEntry = `## [Unreleased] - ${date}\n\n`;
  if (features.length) newEntry += '### Features\n' + features.join('\n') + '\n\n';
  if (fixes.length) newEntry += '### Fixes\n' + fixes.join('\n') + '\n\n';
  if (chores.length) newEntry += '### Chores\n' + chores.join('\n') + '\n\n';
  
  // Prepend to changelog
  const updated = newEntry + '\n' + changelog;
  fs.writeFileSync('CHANGELOG.md', updated);
  
  console.log('CHANGELOG.md updated successfully.');
} catch (err) {
  console.error('Error generating changelog:', err.message);
  process.exit(1);
}
