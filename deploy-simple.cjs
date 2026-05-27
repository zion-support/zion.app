#!/usr/bin/env node
/**
 * deploy-simple.cjs — Deploy out/ to gh-pages branch using a temp git repo
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, 'out');
const TEMP_DIR = path.join(__dirname, '.deploy-temp');

function run(cmd, cwd) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function main() {
  // Clean up
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  try {
    // Get remote URL with PAT from current repo
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    console.log(`Deploying to: ${remoteUrl.replace(/:[^:@]+@/, ':****@')}`);

    // Init temp repo
    fs.mkdirSync(TEMP_DIR);
    run('git init', TEMP_DIR);
    run(`git remote add origin "${remoteUrl}"`, TEMP_DIR);
    run('git config user.name "Zion Deploy"', TEMP_DIR);
    run('git config user.email "deploy@ziontechgroup.com"', TEMP_DIR);

    // Fetch existing gh-pages
    try {
      run('git fetch origin gh-pages --depth=1', TEMP_DIR);
      run('git checkout gh-pages', TEMP_DIR);
    } catch {
      run('git checkout --orphan gh-pages', TEMP_DIR);
    }

    // Remove old files (keep .git)
    fs.readdirSync(TEMP_DIR)
      .filter(f => f !== '.git')
      .forEach(f => fs.rmSync(path.join(TEMP_DIR, f), { recursive: true, force: true }));

    // Copy out/ content using rsync/cp
    console.log('Copying files...');
    const items = fs.readdirSync(OUT_DIR).filter(f => f !== '.git');
    for (const item of items) {
      const src = path.join(OUT_DIR, item);
      const dest = path.join(TEMP_DIR, item);
      fs.cpSync(src, dest, { recursive: true });
    }

    // Ensure CNAME
    const cnamePath = path.join(TEMP_DIR, 'CNAME');
    if (!fs.existsSync(cnamePath)) {
      fs.writeFileSync(cnamePath, 'ziontechgroup.com\n');
    }

    // Commit and push
    run('git add -A', TEMP_DIR);
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      run(`git commit -m "deploy: ${ts}" --no-verify`, TEMP_DIR);
    } catch {
      console.log('(nothing new to commit)');
    }
    run('git push origin gh-pages --force', TEMP_DIR);

    console.log('\n✅ Deployed to gh-pages!');
    console.log('https://ziontechgroup.com should update in 1-2 minutes.');

  } catch (e) {
    console.error('\n❌ Error:', e.message);
    if (e.stderr) console.error(e.stderr);
    process.exit(1);
  } finally {
    // Clean up
    try { fs.rmSync(TEMP_DIR, { recursive: true, force: true }); } catch {}
  }
}

main();
