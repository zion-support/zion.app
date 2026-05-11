#!/usr/bin/env node
/**
 * Automated Rollback Guardian
 * Triggers rollback on Netlify or deployment failures.
 */
const { execSync } = require('child_process');

async function checkDeploymentHealth() {
  try {
    console.log('🔍 Checking deployment health...');
    // Check if site is responding
    const curlOutput = execSync('curl -s -o /dev/null -w "%{http_code}" https://ziontechgroup.com', { encoding: 'utf8' });
    const statusCode = curlOutput.trim();
    console.log(`HTTP Status: ${statusCode}`);
    
    if (statusCode !== '200') {
      console.log('⚠️ Deployment failure detected!');
      execSync('gh issue create --title "Deployment Failure Detected - Rollback Initiated" --body "Site returned ${statusCode}. Auto-rollback triggered." --label "critical,rollback"', { stdio: 'inherit' });
      // Trigger Netlify rollback via build hook if available
      const hook = process.env.NETLIFY_ROLLBACK_HOOK;
      if (hook) {
        execSync(`curl -X POST -d '{}' ${hook}`);
        console.log('Rollback hook triggered');
      }
      process.exit(1);
    } else {
      console.log('✅ Deployment healthy');
    }
  } catch (err) {
    console.error('Health check failed:', err.message);
    process.exit(1);
  }
}

checkDeploymentHealth();