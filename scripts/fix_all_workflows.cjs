#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const workflowDir = path.join(process.cwd(), '.github', 'workflows');

function fixWorkflowFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    let obj = yaml.load(content);
    
    // If parsing returned false (empty file) or string, treat as empty
    if (obj === false || typeof obj === 'string') {
      obj = {};
    }
    
    // Ensure it's an object
    if (typeof obj !== 'object' || obj === null) {
      obj = {};
    }
    
    // Fix missing 'on' trigger
    if (!obj.hasOwnProperty('on')) {
      obj.on = ['push', 'pull_request'];
    }
    
    // Fix missing jobs or empty jobs
    if (!obj.hasOwnProperty('jobs') || typeof obj.jobs !== 'object' || obj.jobs === null || Object.keys(obj.jobs).length === 0) {
      obj.jobs = {
        'default': {
          'runs-on': 'ubuntu-latest',
          'steps': [
            {
              'name': 'No-op',
              'run': 'echo "No operations defined"'
            }
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
              {
                'name': 'No-op',
                'run': 'echo "No operations defined"'
              }
            ]
          };
        } else if (!jobDef.hasOwnProperty('steps') || !Array.isArray(jobDef.steps) || jobDef.steps.length === 0) {
          jobDef.steps = [
            {
              'name': 'No-op',
              'run': 'echo "No operations defined"'
            }
          ];
        }
      }
    }
    
    // Write back with proper formatting
    const fixedContent = yaml.dump(obj, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping for better readability
      noRefs: true,  // Disable references
      noCompatMode: true // Disable YAML 1.1 compatibility
    });
    
    // Ensure file ends with newline
    if (!fixedContent.endsWith('\n')) {
      fs.writeFileSync(filepath, fixedContent + '\n');
    } else {
      fs.writeFileSync(filepath, fixedContent);
    }
    
    console.log(`Fixed: ${path.relative(process.cwd(), filepath)}`);
    return true;
  } catch (err) {
    console.error(`Error processing ${filepath}:`, err.message);
    return false;
  }
}

// Process all workflow files
const files = fs.readdirSync(workflowDir)
  .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  .map(f => path.join(workflowDir, f));

let successCount = 0;
let failCount = 0;

for (const file of files) {
  if (fixWorkflowFile(file)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\nProcessed ${files.length} workflow files:`);
console.log(`  Success: ${successCount}`);
console.log(`  Failed:  ${failCount}`);