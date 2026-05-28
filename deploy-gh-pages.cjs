#!/usr/bin/env node
/**
 * deploy-gh-pages.cjs — Deploy out/ directory to gh-pages branch
 * Uses existing git credentials (from ~/.git-credentials or remote URL)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', timeout: 120000, ...opts });
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error('ERROR: out/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Get the remote URL from the current repo (which has the PAT)
  const remoteUrl = run(`git remote get-url origin`).trim();
  console.log(`Remote: ${remoteUrl.replace(/:[^:]+@/, ':****@')}`);

  const tempDir = path.join(__dirname, '.gh-pages-temp');
  
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);

    // Init and set remote
    run(`git init`, { cwd: tempDir });
    run(`git remote add origin ${remoteUrl}`, { cwd: tempDir });

    // Try to get existing gh-pages
    try {
      run(`git fetch origin gh-pages --depth=1`, { cwd: tempDir });
      run(`git checkout gh-pages`, { cwd: tempDir });
    } catch (e) {
      console.log('Creating new orphan gh-pages branch...');
      run(`git checkout --orphan gh-pages`, { cwd: tempDir });
    }

    // Clean existing files
    fs.readdirSync(tempDir)
      .filter(f => f !== '.git')
      .forEach(f => fs.rmSync(path.join(tempDir, f), { recursive: true, force: true }));

    // Copy out/ content
    console.log('Copying out/ files...');
    fs.readdirSync(OUT_DIR).forEach(f => {
      fs.cpSync(path.join(OUT_DIR, f), path.join(tempDir, f), { recursive: true });
    });

    // Ensure CNAME exists
    if (!fs.existsSync(path.join(tempDir, 'CNAME'))) {
      fs.writeFileSync(path.join(tempDir, 'CNAME'), 'ziontechgroup.com\n');
      console.log('Added CNAME file');
    }

    // Commit and push
    run(`git add -A`, { cwd: tempDir });
    
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      run(`git commit -m "deploy: ${ts} - 602 service pages + SEO fixes" --no-verify`, { cwd: tempDir });
    } catch (e) {
      console.log('Commit skipped (nothing changed or error)');
    }
    
    run(`git push origin gh-pages --force`, { cwd: tempDir });

    console.log('\n✅ Deployed to gh-pages branch!');
    console.log('https://ziontechgroup.com should update within 1-2 minutes.');

  } catch (e) {
    console.error('\n❌ Deploy failed:', e.message);
    if (e.stderr) console.error(e.stderr);
    process.exit(1);
  } finally {
    // Clean up temp
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) { /* ignore cleanup errors */ }
  }
}

main();
