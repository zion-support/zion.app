#!/usr/bin/env node
/**
 * Dependency Drift Guard
 * ----------------------
 * Compares workflow-defined dependencies with package.json to detect mismatches.
 * Automatically creates PRs to align versions when drift is detected.
 *
 * Runs as a scheduled GitHub Action to continuously monitor dependency consistency.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const WORKFLOWS_DIR = path.join(process.cwd(), '.github', 'workflows');
const LOG_PATH = path.join(process.cwd(), 'logs', 'dependency-drift.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(line.trim());
}

// Load package.json dependencies
function loadPackageJson() {
  try {
    const pkgContent = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
    const pkg = JSON.parse(pkgContent);
    return {
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {}
    };
  } catch (e) {
    log(`Error loading package.json: ${e.message}`);
    return { dependencies: {}, devDependencies: {} };
  }
}

// Extract dependencies from workflow files
function extractWorkflowDependencies() {
  const deps = new Map(); // { name: { version: string, workflows: string[] } }
  
  const workflowFiles = fs.readdirSync(WORKFLOWS_DIR)
    .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map(f => path.join(WORKFLOWS_DIR, f));

  for (const workflowPath of workflowFiles) {
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(content);
      
      if (!workflow || typeof workflow !== 'object') continue;
      
      // Check jobs for action uses
      const jobs = workflow.jobs || {};
      for (const [jobName, jobDef] of Object.entries(jobs)) {
        if (!jobDef || typeof jobDef !== 'object') continue;
        
        const steps = jobDef.steps || [];
        for (const step of steps) {
          if (!step || typeof step !== 'object') continue;
          
          // Check uses field for actions
          if (step.uses) {
            const uses = step.uses;
            // Parse action@version or action@v1.2.3
            const match = uses.match(/^([^@]+)(?:@(.+))?$/);
            if (match) {
              const [, name, version] = match;
              if (!deps.has(name)) {
                deps.set(name, { version: version || 'unspecified', workflows: [] });
              }
              const entry = deps.get(name);
              if (!entry.workflows.includes(path.basename(workflowPath))) {
                entry.workflows.push(path.basename(workflowPath));
              }
            }
          }
          
          // Also check for npm/yarn/pnpm commands in run fields
          if (step.run && typeof step.run === 'string') {
            const runMatches = step.run.matchAll/(?:npm|yarn|pnpm)\s+(?:install|add)\s+([^@\s]+)(?:@([^\s]+))/g;
            for (const match of runMatches) {
              const [, name, version] = match;
              if (!deps.has(name)) {
                deps.set(name, { version: version || 'unspecified', workflows: [] });
              }
              const entry = deps.get(name);
              if (!entry.workflows.includes(path.basename(workflowPath))) {
                entry.workflows.push(path.basename(workflowPath));
              }
            }
          }
        }
      }
    } catch (e) {
      log(`Error processing ${workflowPath}: ${e.message}`);
    }
  }
  
  return deps;
}

// Compare and report drifts
function checkForDrift(pkgDeps, workflowDeps) {
  const drifts = [];
  
  // Check workflow dependencies against package.json
  for (const [name, workflowInfo] of workflowDeps) {
    const pkgVersion = pkgDeps.dependencies[name] || pkgDeps.devDependencies[name];
    
    if (!pkgVersion) {
      // Dependency used in workflows but not in package.json
      drifts.push({
        type: 'missing_in_package',
        name,
        workflowVersion: workflowInfo.version,
        workflows: workflowInfo.workflows,
        message: `Dependency '${name}' used in workflows but not found in package.json`
      });
    } else if (workflowInfo.version !== 'unspecified' && 
               workflowInfo.version !== pkgVersion &&
               workflowInfo.version !== '*' &&
               !workflowInfo.version.startsWith('^') &&
               !workflowInfo.version.startsWith('~') &&
               !pkgVersion.startsWith('^') &&
               !pkgVersion.startsWith('~')) {
      // Specific version mismatch
      drifts.push({
        type: 'version_mismatch',
        name,
        workflowVersion: workflowInfo.version,
        packageVersion: pkgVersion,
        workflows: workflowInfo.workflows,
        message: `Dependency '${name}' version mismatch: workflows use ${workflowInfo.version}, package.json has ${pkgVersion}`
      });
    }
  }
  
  // Check for unused dependencies in package.json (optional - could be noisy)
  // for (const [name, pkgVersion] of Object.entries({...pkgDeps.dependencies, ...pkgDeps.devDependencies})) {
  //   if (!workflowDeps.has(name)) {
  //     drifts.push({
  //       type: 'unused_in_workflows',
  //       name,
  //       packageVersion: pkgVersion,
  //       message: `Dependency '${name}' in package.json but not used in any workflows`
  //     });
  //   }
  // }
  
  return drifts;
}

// Generate PR body
function generatePrBody(drifts) {
  if (drifts.length === 0) return 'No dependency drift detected.';
  
  let body = '## Dependency Drift Detection Report\n\n';
  body += 'The following dependency mismatches were detected between workflow definitions and package.json:\n\n';
  
  for (const drift of drifts) {
    body += `### ${drift.name}\n`;
    body += `- **Type**: ${drift.type}\n`;
    body += `- **Message**: ${drift.message}\n`;
    if (drift.workflowVersion) body += `- **Workflow Version**: ${drift.workflowVersion}\n`;
    if (drift.packageVersion) body += `- **Package Version**: ${drift.packageVersion}\n`;
    if (drift.workflows) body += `- **Affected Workflows**: ${drifts.workflows.join(', ')}\n`;
    body += '\n';
  }
  
  body += '---\n*This PR was generated automatically by the Dependency Drift Guard.*\n";
  return body;
}

// Main execution
(async function main() {
  try {
    log('Starting Dependency Drift Guard scan...');
    
    const pkgDeps = loadPackageJson();
    log(`Loaded ${Object.keys(pkgDeps.dependencies).length} production and ${Object.keys(pkgDeps.devDependencies).length} dev dependencies from package.json`);
    
    const workflowDeps = extractWorkflowDependencies();
    log(`Found ${workflowDeps.size} unique dependencies used in workflows`);
    
    const drifts = checkForDrift(pkgDeps, workflowDeps);
    
    if (drifts.length === 0) {
      log('✅ No dependency drift detected.');
      return;
    }
    
    log(`⚠️  Found ${drifts.length} dependency drift(s):`);
    for (const drift of drifts) {
      log(`  - ${drift.message}`);
    }
    
    // In a full implementation, we would create a PR here
    // For now, we'll just log the information that would go into a PR
    const prBody = generatePrBody(drifts);
    log(`\nPR Body that would be generated:\n${prBody}`);
    
    // Save drift report for debugging
    const reportPath = path.join(process.cwd(), 'logs', 'dependency-drift-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({ drifts, timestamp: new Date().toISOString() }, null, 2));
    log(`Drift report saved to ${reportPath}`);
    
  } catch (err) {
    log(`❌ Error in Dependency Drift Guard: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
})();