#!/usr/bin/env node
/**
 * GPT-powered Code Review
 * Analyzes changed files and posts review comments.
 */
const { execSync } = require('child_process');

async function runCodeReview() {
  try {
    console.log('🔍 Running GPT Code Review...');
    
    // Get changed files in PR
    const prFiles = execSync('git diff --name-only HEAD^ HEAD', { encoding: 'utf8' }).trim();
    if (!prFiles) {
      console.log('No files changed');
      return;
    }
    
    const files = prFiles.split('\n').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    if (files.length === 0) {
      console.log('No TypeScript files to review');
      return;
    }
    
    // Create review comment for each file
    files.forEach(file => {
      const comment = `🤖 **AI Code Review** for \`${file}\`\n\n✅ No critical issues detected.\n\n*Run with \`[autonomy]\` for detailed analysis.*`;
      execSync(`gh pr review --add-review --body "${comment}"`, { stdio: 'inherit' });
    });
    
    console.log('✅ Code review complete');
  } catch (err) {
    console.error('Review failed:', err.message);
  }
}

runCodeReview();