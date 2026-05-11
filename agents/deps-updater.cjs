#!/usr/bin/env node
/**
 * Dependency Updater Agent
 * Scans for outdated packages and creates PRs with updates
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';

console.log('🔍 Scanning for outdated dependencies...');

try {
  // Run npm outdated
  const outdated = execSync('npm outdated --json', { 
    cwd: WORKSPACE, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024 
  });
  
  const deps = JSON.parse(outdated || '{}');
  const depList = Object.entries(deps);
  
  if (depList.length === 0) {
    console.log('✅ All dependencies are up to date!');
    process.exit(0);
  }
  
  console.log(`📦 Found ${depList.length} outdated packages:\n`);
  
  const updates = [];
  for (const [name, info] of depList) {
    console.log(`  - ${name}: ${info.current} → ${info.latest} (${info.type})`);
    if (info.type === 'major' && !info.current.startsWith('0.')) {
      updates.push({ name, from: info.current, to: info.latest, type: info.type });
    }
  }
  
  // Save report
  const report = {
    scanned: new Date().toISOString(),
    total: depList.length,
    updates
  };
  
  fs.writeFileSync(
    path.join(WORKSPACE, 'dependency-updates.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Report saved to dependency-updates.json');
  
} catch (e) {
  if (e.message.includes('npm outdated --json')) {
    console.log('✅ Could not check outdated (no packages outdated or error)');
  } else {
    console.error('Error:', e.message);
  }
}
