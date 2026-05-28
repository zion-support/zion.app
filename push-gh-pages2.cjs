// push-gh-pages2.cjs — Simpler approach: use git with PAT encoded in URL
const { execSync } = require('child_process');
const fs = require('fs');

const PAT = 'github...5B0x';
const REPO = 'Zion-support/zion-support.github.io';

// Create a proper basic auth header for git
// Git uses Basic auth with username:token (base64 encoded)
const auth = Buffer.from(`Zion-support:${PAT}`).toString('base64');

// Write a custom credential helper script
fs.writeFileSync('C:\\Users\\Zion\\zion-support.github.io\\.git\\credential-helper.bat', `
@echo off
echo username=Zion-support
echo password=${PAT}
`);

// Use git with extra header for auth
const DEPLOY_DIR = 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp';

try {
  // Set the remote URL with embedded credentials
  execSync(`git remote set-url origin "https://Zion-support:${PAT}@github.com/${REPO}.git"`, {
    cwd: DEPLOY_DIR,
    encoding: 'utf-8'
  });

  // Try pushing with verbose output
  const result = execSync('git push origin gh-pages --force --verbose', {
    cwd: DEPLOY_DIR,
    encoding: 'utf-8',
    env: {
      ...process.env,
      GIT_CONFIG_PARAMETERS: `'credential.helper=store'`,
    },
    timeout: 120000,
  });
  console.log(result);
  console.log('✅ Pushed!');
} catch (e) {
  console.error('Error:', e.message);
  if (e.stderr) console.error('stderr:', e.stderr);
  if (e.stdout) console.error('stdout:', e.stdout);
}
