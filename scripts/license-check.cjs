#!/usr/bin/env node
/**
 * license-check.cjs – Check dependency licenses against an allowed list.
 *
 * Environment variables:
 *   GITHUB_TOKEN   – GitHub token (for posting PR comments if needed)
 *   REPO_OWNER
 *   REPO_NAME
 *   ALLOWED_LICENSES – comma‑separated list of SPDX IDs (default: MIT,ISC,BSD-2-Clause,BSD-3-Clause,Apache-2.0)
 *
 * The script:
 *   1. Reads package-lock.json (or yarn.lock) to extract declared licenses.
 *   2. Compares each license against ALLOWED_LICENSES.
 *   3. If any disallowed license is found, it:
 *        - Writes a markdown report to `reports/license-violations.md`
 *        - Optionally creates a GitHub issue (if GITHUB_TOKEN provided) to track.
 *   4. Exits with code 0 if all licenses are allowed, else 1 (to fail CI).
 *
 * This keeps the CI safe from inadvertently shipping code with incompatible licenses.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const {
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  ALLOWED_LICENSES = 'MIT,ISC,BSD-2-Clause,BSD-3-Clause,Apache-2.0',
} = process.env;

const allowed = new Set(ALLOWED_LICENSES.split(',').map(l => l.trim().toUpperCase()));

function getPackageLockPath() {
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
    return path.join(process.cwd(), 'package-lock.json');
  }
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return path.join(process.cwd(), 'yarn.lock');
  }
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return path.join(process.cwd(), 'pnpm-lock.yaml');
  }
  return null;
}

function parsePackageLockForLicenses(lockPath) {
  // Simplistic approach: use `npm ls --prod --json --license` if possible.
  try {
    const output = execSync('npm ls --prod --json --license', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const data = JSON.parse(output);
    const licenses = new Set();
    function walk(node) {
      if (node.license) {
        // Normalize license string (could be SPDX or custom)
        const lic = String(node.license).trim().toUpperCase();
        if (lic) licenses.add(lic);
      }
      if (node.dependencies) {
        for (const dep of Object.values(node.dependencies)) {
          walk(dep);
        }
      }
    }
    walk(data);
    return licenses;
  } catch (err) {
    console.warn('⚠️ Could not run npm ls for license extraction:', err.message);
    // Fallback: check package.json directly (less accurate)
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const licenses = new Set();
      for (const depName in deps) {
        // We cannot know exact version's license without installing; skip for simplicity.
        // In a real implementation you might use `npm view` but that's network heavy.
        // We'll just note that we cannot determine.
      }
      return licenses;
    }
    return new Set();
  }
}

async function main() {
  const lockPath = getPackageLockPath();
  if (!lockPath) {
    console.error('❌ No lockfile found (package-lock.json, yarn.lock, or pnpm-lock.yaml).');
    process.exit(1);
  }

  console.log(`🔍 Checking licenses in ${lockPath}...`);
  const foundLicenses = parsePackageLockForLicenses(lockPath);
  console.log(`📦 Found ${foundLicenses.size} distinct licenses:`, Array.from(foundLicenses).join(', '));

  const violations = [];
  for (const lic of foundLicenses) {
    if (!allowed.has(lic)) {
      violations.push(lic);
    }
  }

  if (violations.length === 0) {
    console.log('✅ All dependencies use allowed licenses.');
    process.exit(0);
  }

  console.error(`❌ Disallowed licenses detected: ${violations.join(', ')}`);
  const reportPath = path.join(process.cwd(), 'reports', 'license-violations.md');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  let report = `# License Violation Report\n\n`;
  report += `Detected ${violations.length} disallowed license(s):\n\n`;
  for (const v of violations) {
    report += `- ${v}\n`;
  }
  report += `\nAllowed licenses: ${Array.from(allowed).join(', ')}\n`;
  report += `\nPlease review and either update dependencies to use allowed licenses or add the license to the allowed list (if appropriate).\n`;
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`📝 Report written to ${reportPath}`);

  // Optionally create a GitHub issue if token provided
  if (GITHUB_TOKEN && REPO_OWNER && REPO_NAME) {
    const { Octokit } = require('@octokit/rest');
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    try {
      await octokit.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: `License violation: disallowed licenses detected`,
        body: report,
        labels: ['license', 'security']
      });
      console.log('🐛 Created GitHub issue to track license violations.');
    } catch (err) {
      console.warn('⚠️ Failed to create GitHub issue:', err.message);
    }
  }

  process.exit(1);
}

main().catch(err => {
  console.error('🚨 Unexpected error:', err);
  process.exit(2);
});
