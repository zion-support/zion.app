const { execSync } = require('child_process');
const fs = require('fs');

// Get the most recent tag (or fallback to initial commit)
let tag;
try {
  tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
} catch (_) {
  // No tags yet, use the first commit
  tag = execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf-8' }).trim();
}

// Generate commit list since last tag
const logs = execSync(`git log ${tag}..HEAD --pretty=format:'- %s (%an)'`, { encoding: 'utf-8' }).trim();
if (!logs) {
  console.log('No new commits since last tag.');
  process.exit(0);
}

const date = new Date().toISOString().split('T')[0];
const changelogEntry = `## ${date}\n${logs}\n\n`;

fs.appendFileSync('CHANGELOG.md', changelogEntry);
console.log('Changelog updated.');
