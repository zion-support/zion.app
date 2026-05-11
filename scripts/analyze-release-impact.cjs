#!/usr/bin/env node
/**
 * Release Impact Analyzer
 * Analyzes merge payload to predict regressions.
 */
const { execSync } = require('child_process');
const fs = require('fs');

async function analyzeMerge() {
  try {
    console.log('🔍 Analyzing merge impact...');
    
    // Get merge files
    const mergeFiles = execSync('git diff --name-only HEAD^ HEAD', { encoding: 'utf8' }).trim();
    if (!mergeFiles) {
      console.log('No changes to analyze');
      return;
    }
    
    // Simple analysis (could integrate ML model later)
    const highRiskPattern = /api\/|security\/|cache\/|db\/|frontend/ig;
    const changes = mergeFiles.split('\n').filter(f => highRiskPattern.test(f));
    
    if (changes.length > 0) {
      console.log('🚨 High-risk files detected:');
      console.log(changes.join('\n'));
      
      const body = `Risk Analysis:\n- High-risk changes detected in:\n\n${changes.join('\n')}\n\nRecommended: Review thoroughly before merging`;
      
      try {
        execSync('gh pr comment --body "${body}"', { stdio: 'inherit' });
      } catch (e) {
        console.error('Could not add comment:', e.message);
      }
    }
  } catch (err) {
    console.error('Analysis failed:', err.message);
  }
}

analyzeMerge();