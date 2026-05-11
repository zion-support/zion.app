#!/usr/bin/env node
/**
 * AI Dependency Health & Freshness Monitor
 * Proactively checks for outdated dependencies, vulnerabilities, and license issues
 */
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running Dependency Health & Freshness Check...');

try {
  // 1. Check for outdated packages
  console.log('📦 Checking for outdated dependencies...');
  const outdated = execSync('npm outdated --json 2>/dev/null || true', { encoding: 'utf8' });
  let outdatedCount = 0;
  let outdatedPackages = [];
  
  if (outdated && outdated.trim()) {
    try {
      const outdatedData = JSON.parse(outdated);
      outdatedCount = Object.keys(outdatedData).length;
      outdatedPackages = Object.entries(outdatedData).map(([name, info]) => ({
        name,
        current: info.current || 'unknown',
        wanted: info.wanted || 'unknown',
        latest: info.latest || 'unknown',
        location: info.location || 'unknown'
      }));
    } catch (e) {}
  }
  
  // 2. Check for vulnerabilities
  console.log('🛡️ Checking for vulnerabilities...');
  const audit = execSync('npm audit --json 2>/dev/null || true', { encoding: 'utf8' });
  let vulnerabilityCount = 0;
  let vulnerabilities = [];
  
  if (audit && audit.trim()) {
    try {
      const auditData = JSON.parse(audit);
      vulnerabilityCount = auditData.metadata?.vulnerabilities?.total || 0;
      vulnerabilities = auditData.vulnerabilities || {};
    } catch (e) {}
  }
  
  // 3. Check for license compliance
  console.log('📜 Checking license compliance...');
  const licenseScript = execSync('node scripts/check-license-compliance.cjs 2>&1 || true', { encoding: 'utf8' });
  const licenseCompliant = !licenseScript.includes('ERROR') && !licenseScript.includes('Violations');
  
  // 4. Generate health report
  const healthReport = {
    timestamp: new Date().toISOString(),
    outdatedDependencies: {
      count: outdatedCount,
      severity: outdatedCount > 10 ? 'high' : outdatedCount > 5 ? 'medium' : 'low',
      packages: outdatedPackages.slice(0, 20) // Top 20 outdated
    },
    vulnerabilities: {
      count: vulnerabilityCount,
      severity: vulnerabilityCount > 5 ? 'critical' : vulnerabilityCount > 2 ? 'high' : vulnerabilityCount > 0 ? 'medium' : 'low',
      types: Object.keys(vulnerabilities)
    },
    licenseCompliance: {
      compliant: licenseCompliant,
      severity: licenseCompliant ? 'low' : 'critical'
    },
    overallHealth: 'healthy' // Will be determined below
  };
  
  // Calculate overall health score
  let healthScore = 100;
  if (outdatedCount > 10) healthScore -= 25;
  if (outdatedCount > 5) healthScore -= 15;
  if (vulnerabilityCount > 2) healthScore -= 30;
  if (vulnerabilityCount > 0) healthScore -= 20;
  if (!licenseCompliant) healthScore -= 40;
  
  healthReport.healthScore = Math.max(0, healthScore);
  healthReport.overallHealth = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';
  
  // Save report
  const reportPath = 'automation/reports/dependency-health-latest.json';
  fs.mkdirSync('automation/reports', { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(healthReport, null, 2));
  
  console.log(`\n📊 Health Score: ${healthScore}/100 (${healthReport.overallHealth.toUpperCase()})`);
  console.log(`📦 Outdated dependencies: ${outdatedCount}`);
  console.log(`🛡️  Vulnerabilities: ${vulnerabilityCount}`);
  console.log(`📜 License compliance: ${licenseCompliant ? '✅' : '❌'}`);
  
  // Create issue if health is critical or warning with significant issues
  if (healthScore < 70) {
    const severity = healthScore < 50 ? 'critical' : 'warning';
    const body = `Dependency Health Alert: ${severity.toUpperCase()}\n\n` +
      `**Health Score:** ${healthScore}/100\n` +
      `**Outdated Dependencies:** ${outdatedCount}\n` +
      `**Vulnerabilities:** ${vulnerabilityCount}\n` +
      `**License Compliance:** ${licenseCompliant ? '✅' : '❌'}\n\n` +
      `See [dependency-health-latest.json](${reportPath}) for details.`;
    
    try {
      execSync(`gh issue create --title "[${severity.toUpperCase()}] Dependency Health Alert" --body "${body}" --label "dependencies,health,${severity}"`, { stdio: 'inherit' });
    } catch (e) {
      console.log('Could not create GitHub issue');
    }
  }
  
  console.log('✅ Dependency health check complete');
  
  // Exit with error if health is critical
  if (healthScore < 50) {
    process.exit(1);
  }
  
} catch (err) {
  console.error('Health check failed:', err.message);
  process.exit(1);
}
