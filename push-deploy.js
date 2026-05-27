// push-deploy.js — Push gh-pages branch using token from environment
const { execSync } = require('child_process');

// Read PAT from environment or prompt
const pat = process.env.GITHUB_PAT;
if (!pat) {
  console.error('Set GITHUB_PAT environment variable');
  process.exit(1);
}

const repo = 'Zion-support/zion-support.github.io';
const remoteUrl = `https://Zion-support:${pat}@github.com/${repo}.git`;

try {
  // Update remote URL with actual PAT
  execSync(`git remote set-url origin "${remoteUrl}"`, { 
    cwd: 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp',
    encoding: 'utf-8'
  });
  
  // Push
  execSync('git push origin gh-pages --force', {
    cwd: 'C:\\Users\\Zion\\zion-support.github.io\\.deploy-temp',
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ Pushed to gh-pages!');
} catch (e) {
  console.error('Push failed:', e.message);
  process.exit(1);
}
