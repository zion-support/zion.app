#!/usr/bin/env node
/**
 * audit-app.cjs
 * Comprehensive audit script for the Zion Tech Group application.
 *
 * Executes:
 *   - lint (ESLint)
 *   - type-check (TypeScript)
 *   - test (Jest)
 *   - security audit (npm audit)
 *   - dependency outdated check (npm outdated)
 *   - license compliance (check licenses)
 *   - E2E health check (basic fetch of /)
 *
 * Outputs a markdown report at ./audit/report.md.
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to run a command and capture stdout/stderr
function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch (e) {
    console.error(`❌ Command failed: ${cmd}\n${e.stderr}`);
    process.exit(1);
  }
}

// Determine current versions
const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = pkgJson.version;
const date = new Date().toISOString().split('T')[0];

// Initialize markdown report
const reportPath = path.join(__dirname, '..', 'audit', 'report.md');
fs.mkdirSync(path.join(path.join(__dirname, '..'), 'audit'), { recursive: true });
let report = `# 📋 App Audit Report\n\n*Generated on ${date}*\n*Version:* ${version}\n\n`;

const sections = [];

// 1️⃣ Lint Check
try {
  const lintOut = run('npm run lint:check');
  sections.push(`## 🔍 Lint Check\n\n\`\`\`\n${lintOut}\n\`\`\`\n`);
} catch (_) {
  sections.push(`## 🔍 Lint Check\n\n❌ Lint step failed – see above.\n`);
}

// 2️⃣ Type‑Check
try {
  const typeOut = run('npm run type-check');
  sections.push(`## 🧩 Type‑Check\n\n\`\`\`\n${typeOut}\n\`\`\`\n`);
} catch (_) {
  sections.push(`## 🧩 Type‑Check\n\n❌ Type‑check failed – see above.\n`);
}

// 3️⃣ Test Suite
try {
  const testOut = run('npm test -- --ci --coverage --watchAll=false');
  sections.push(`## ✅ Test Suite\n\n\`\`\`\n${testOut}\n\`\`\`\n`);
} catch (_) {
  sections.push(`## ✅ Test Suite\n\n❌ Tests failed – see above.\n`);
}

// 4️⃣ Security Audit
try {
  const auditOut = run('npm audit --audit-level moderate');
  sections.push(`## 🔐 Security Audit (npm audit)\n\n\`\`\`\n${auditOut}\n\`\`\`\n`);
} catch (_) {
  sections.push(`## 🔐 Security Audit\n\n❌ Security audit failed – see above.\n`);
}

// 5️⃣ Dependency Outdated Check
try {
  const outdatedOut = run('npm outdated --json');
  const outdatedObj = JSON.parse(outdatedOut);
  const outdatedPkgs = Object.keys(outdatedObj);
  if (outdatedPkgs.length === 0) {
    sections.push(`## 📦 Dependency Outdated Check\n\nAll dependencies are up‑to‑date! 🎉`);
  } else {
    const outdatedRows = outdatedPkgs.map(pkg => {
      const info = outdatedObj[pkg];
      return `- ${pkg}: ${info.current} → ${info.latest} (${info.title})`;
    });
    sections.push(`## 📦 Dependency Outdated Check\n\n${outdatedRows.join('\n')}`);
  }
} catch (_) {
  sections.push(`## 📦 Dependency Outdated Check\n\n❌ Outdated check failed – see above.\n`);
}

// 5️⃣ License compliance (quick check)
try {
  const licenseCheck = run('npx license-checker --json | jq -r \".dependencies | to_entries[] | \\\"\(.name): \(.licenses | join(\\~/\\/))\\(. | ascii_escape)\\\"\"');
  sections.push(`## 📄 License Compliance\n\n\`\`\`\n${licenseCheck}\n\`\`\`\n`);
} catch (_) {
  sections.push(`## 📄 License Compliance\n\n❌ License check failed – see above.\n`);
}

// 6️⃣ E2E Health Check (basic HTTP ping)
try {
  const healthResp = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', stdio: 'pipe').trim();
  const healthStatus = healthResp === '200' ? '✅ Healthy' : `⚠️  HTTP ${healthResp}`;
  sections.push(`## 🌐 E2E Health Check\n\n${healthStatus}`);
} catch (_) {
  sections.push(`## 🌐 E2E Health Check\n\n⚠️ Unable to reach the application – is the server running?`);
}

// Append sections to report
report += sections.join('\n\n');

// Write report
fs.writeFileSync(reportPath, report);
console.log(`📝 Audit report written to ${reportPath}`);
