#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workflowDir = '.github/workflows';
const files = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

for (const file of files) {
  const filePath = path.join(workflowDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  // Ensure file ends with a newline
  if (!content.endsWith('\n')) {
    fs.writeFileSync(filePath, content + '\n');
  }
  console.log(`Fixed line ending: ${file}`);
}
