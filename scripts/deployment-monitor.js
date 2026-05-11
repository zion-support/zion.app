#!/usr/bin/env node

/**
 * GitHub Pages Deployment Monitor & Auto-Deployer
 * Runs autonomously to ensure continuous deployment
 */

const { exec } = require('child_process');
const https = require('https');

const SITE_URL = 'https://zion.app';
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

function checkSite(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    });
    req.on('error', () => resolve({ status: 0, ok: false }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, ok: false });
    });
  });
}

function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: '/Users/kleberalcatrao/.openclaw/workspace' }, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
}

async function deploy() {
  console.log('🚀 Starting deployment...');
  
  const { err, stdout, stderr } = await runCommand('npm run build');
  if (err) {
    console.error('❌ Build failed:', stderr);
    return false;
  }
  console.log('✅ Build complete');
  
  const { err: pushErr } = await runCommand('git add . && git commit -m "autonomous: deployment trigger" --allow-empty');
  if (pushErr) console.log('Commit note:', pushErr);
  
  const { err: pushError } = await runCommand('git push');
  if (pushError) {
    console.error('❌ Push failed');
    return false;
  }
  
  console.log('✅ Deployed to GitHub Pages');
  return true;
}

async function monitor() {
  console.log(`🔍 Checking ${SITE_URL}...`);
  
  const result = await checkSite(SITE_URL);
  console.log(`Status: ${result.status}`);
  
  if (!result.ok) {
    console.log('⚠️ Site not responding, triggering deployment...');
    await deploy();
  } else {
    console.log('✅ Site is live and healthy');
  }
}

// Run immediately then schedule
(async () => {
  await monitor();
  setInterval(monitor, CHECK_INTERVAL);
})();

console.log('📡 Deployment monitor started');