// push-gh-pages3.cjs — Use git credential helper with PAT
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PAT = 'github...5x';
const DEPLOY_DIR = 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp';

// Write credentials file
const credsFile = path.join(process.env.HOME || process.env.USERPROFILE, '.git-credentials-zion');
fs.writeFileSync(credsFile, `https://Zion-support:${PAT}@github.com\n`);
console.log('Credentials file written');

try {
  // Configure git to use the credential file
  execSync(`git config credential.helper "store --file=${credsFile}"`, {
    cwd: DEPLOY_DIR,
    encoding: 'utf-8'
  });

  // Set remote URL without credentials
  execSync('git remote set-url origin "https://github.com/Zion-support/zion-support.github.io.git"', {
    cwd: DEPLOY_DIR,
    encoding: 'utf-8'
  });

  // Push
  console.log('Pushing...');
  const result = execSync('git push origin gh-pages --force', {
    cwd: DEPLOY_DIR,
    encoding: 'utf-8',
    timeout: 180000,
  });
  console.log(result);
  console.log('✅ Pushed to gh-pages!');
} catch (e) {
  console.error('Error:', e.message);
  if (e.stderr) console.error(e.stderr);
} finally {
  // Clean up credentials file
  try { fs.unlinkSync(credsFile); } catch {}
}
