#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const workflowDir = path.join(process.cwd(), '.github', 'workflows');

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let obj = yaml.load(content);
    if (obj === false) obj = {}; // empty file
    if (typeof obj !== 'object' || obj === null) obj = {};

    // Ensure required top-level fields
    if (!obj.hasOwnProperty('name')) {
      // Generate a name from filename if missing
      const base = path.basename(filePath, path.extname(filePath));
      obj.name = base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    if (!obj.hasOwnProperty('on')) {
      obj.on = {
        push: { branches: ['main'] },
        pull_request: { branches: ['main'] }
      };
    }
    if (!obj.hasOwnProperty('jobs') || typeof obj.jobs !== 'object' || obj.jobs === null) {
      obj.jobs = {
        'default': {
          'runs-on': 'ubuntu-latest',
          'steps': [
            { 'name': 'No-op', 'run': 'echo "No operations defined"' }
          ]
        }
      };
    } else {
      // Ensure each job has steps
      for (const [jobName, jobDef] of Object.entries(obj.jobs)) {
        if (typeof jobDef !== 'object' || jobDef === null) {
          obj.jobs[jobName] = {
            'runs-on': 'ubuntu-latest',
            'steps': [
              { 'name': 'No-op', 'run': 'echo "No operations defined"' }
            ]
          };
        } else if (!jobDef.hasOwnProperty('steps') || !Array.isArray(jobDef.steps) || jobDef.steps.length === 0) {
          jobDef.steps = [
            { 'name': 'No-op', 'run': 'echo "No operations defined"' }
          ];
        }
      }
    }

    const fixed = yaml.dump(obj, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      noCompatMode: true
    });
    if (!fixed.endsWith('\n')) {
      fs.writeFileSync(filePath, fixed + '\n');
    } else {
      fs.writeFileSync(filePath, fixed);
    }
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
    return true;
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
    return false;
  }
}

const files = fs.readdirSync(workflowDir)
  .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  .map(f => path.join(workflowDir, f));

let fixed = 0;
for (const f of files) {
  if (processFile(f)) fixed++;
}
console.log(`\nProcessed ${files.length} workflow files, fixed ${fixed}.`);
if (fixed > 0) {
  const { execSync } = require('child_process');
  execSync('git add .github/workflows', { stdio: 'inherit' });
  execSync(`git commit -m "🔧 fix: add missing 'on' triggers and ensure structure for ${fixed} workflows"`, { stdio: 'inherit' });
  console.log('✅ Changes committed');
}