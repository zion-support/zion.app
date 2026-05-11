const { execSync } = require('child_process');
const fs = require('fs');

const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
let logs = execSync(`git log ${tag}..HEAD --pretty=format:'- %s (%an)'`, { encoding: 'utf-8' }).trim();
if (!logs) {
  console.log('No new commits since last tag.');
  process.exit(0);
}
const changelog = `## ${new Date().toISOString().split('T')[0]}
${logs}
`;
fs.appendFileSync('CHANGELOG.md', changelog);
console.log('Changelog updated.');
