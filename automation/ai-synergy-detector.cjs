#!/usr/bin/env node
/**
 * AI Synergy Detector
 * Identifies synergies between AI workflows and suggests combined improvements
 * Runs autonomously as part of the AI automation ecosystem
 */

const fs = require('fs');
const path = require('path');

const SYNERGY_REPORT = path.join(__dirname, 'reports/ai-synergy-detector-latest.json');
const WORKFLOW_DIR = __dirname;

function scanWorkflows() {
  console.log('AI Synergy Detector scanning workflows...');
  const workflows = [];
  
  try {
    const files = fs.readdirSync(WORKFLOW_DIR).filter(f => f.endsWith('.cjs'));
    
    for (const file of files) {
      const filePath = path.join(WORKFLOW_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      
      // Extract workflow metadata
      const workflow = {
        name: file,
        path: filePath,
        size: stats.size,
        lines: content.split('\n').length,
        lastModified: stats.mtime,
        hasHttp: content.includes('http') || content.includes('fetch'),
        hasGit: content.includes('git') || content.includes('execSync'),
        hasAnalysis: content.includes('analysis') || content.includes('analyze'),
        hasOptimization: content.includes('optim') || content.includes('improve'),
        imports: (content.match(/require\(/g) || []).length
      };
      
      workflows.push(workflow);
    }
  } catch (err) {
    console.error('Error scanning workflows:', err.message);
  }
  
  return workflows;
}

function detectSynergies(workflows) {
  const synergies = [];
  
  // Group workflows by capabilities
  const capabilityGroups = {
    'http_enabled': workflows.filter(w => w.hasHttp),
    'git_enabled': workflows.filter(w => w.hasGit),
    'analysis_enabled': workflows.filter(w => w.hasAnalysis),
    'optimization_enabled': workflows.filter(w => w.hasOptimization)
  };
  
  // Detect cross-capability synergies
  for (const [cap1, group1] of Object.entries(capabilityGroups)) {
    for (const [cap2, group2] of Object.entries(capabilityGroups)) {
      if (cap1 >= cap2) continue; // Avoid duplicates
      
      const overlap = group1.filter(w1 => 
        group2.some(w2 => w1.name !== w2.name)
      );
      
      if (overlap.length > 0) {
        synergies.push({
          type: 'capability_synergy',
          capabilities: [cap1, cap2],
          workflowCount: overlap.length,
          workflows: overlap.map(w => w.name),
          synergyScore: overlap.length * 0.1,
          suggestion: `Combine ${cap1} and ${cap2} capabilities for enhanced automation`
        });
      }
    }
  }
  
  // Detect size-based synergies (large workflows that could share utilities)
  const largeWorkflows = workflows.filter(w => w.lines > 300);
  if (largeWorkflows.length >= 2) {
    synergies.push({
      type: 'size_based_synergy',
      workflowCount: largeWorkflows.length,
      workflows: largeWorkflows.map(w => w.name),
      synergyScore: largeWorkflows.length * 0.05,
      suggestion: 'Extract common utilities from large workflows to reduce duplication'
    });
  }
  
  // Detect import-based synergies
  const highImportWorkflows = workflows.filter(w => w.imports > 8);
  if (highImportWorkflows.length >= 2) {
    synergies.push({
      type: 'import_based_synergy',
      workflowCount: highImportWorkflows.length,
      workflows: highImportWorkflows.map(w => w.name),
      synergyScore: highImportWorkflows.length * 0.08,
      suggestion: 'Create shared library for commonly imported modules'
    });
  }
  
  return synergies;
}

function generateImprovementTasks(synergies) {
  const tasks = [];
  
  // Sort by synergy score
  const sortedSynergies = synergies.sort((a, b) => b.synergyScore - a.synergyScore);
  
  for (const synergy of sortedSynergies.slice(0, 3)) { // Top 3 synergies
    tasks.push({
      title: `Implement ${synergy.type.replace(/_/g, ' ')}`,
      description: synergy.suggestion,
      priority: synergy.synergyScore > 0.3 ? 'high' : synergy.synergyScore > 0.15 ? 'medium' : 'low',
      affectedWorkflows: synergy.workflows,
      estimatedImpact: synergy.synergyScore
    });
  }
  
  return tasks;
}

function main() {
  console.log('Starting AI Synergy Detector...');
  
  const workflows = scanWorkflows();
  console.log(`Scanned ${workflows.length} workflows`);
  
  const synergies = detectSynergies(workflows);
  console.log(`Detected ${synergies.length} potential synergies`);
  
  const improvementTasks = generateImprovementTasks(synergies);
  console.log(`Generated ${improvementTasks.length} improvement tasks`);
  
  const report = {
    timestamp: new Date().toISOString(),
    workflowsScanned: workflows.length,
    synergiesDetected: synergies.length,
    improvementTasksGenerated: improvementTasks.length,
    topSynergies: synergies.slice(0, 5),
    improvementTasks
  };
  
  // Save report
  const reportDir = path.dirname(SYNERGY_REPORT);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(SYNERGY_REPORT, JSON.stringify(report, null, 2));
  console.log(`Synergy detection complete. Report saved to ${SYNERGY_REPORT}`);
  
  // Output top tasks
  if (improvementTasks.length > 0) {
    console.log('\nTop improvement tasks:');
    improvementTasks.forEach((task, i) => {
      console.log(`${i + 1}. [${task.priority}] ${task.title}: ${task.description}`);
    });
  }
}

main();
