#!/usr/bin/env node
/**
 * AI Lab Integrity Guard
 * Verifies that all AI Lab tools and pages are properly configured.
 */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const aiLabDir = path.join(appDir, 'ai-lab');

let errors = 0;
let warnings = 0;

// Check that ai-lab directory exists
if (!fs.existsSync(aiLabDir)) {
  console.error('❌ AI Lab directory not found');
  process.exit(1);
}

// Check that all referenced tools have pages
const aiLabRoutes = [
  'autonomous-funnel-orchestrator',
  'autonomous-incident-commander',
  'autonomous-rag-knowledge-workspace',
  'autonomous-media-prompt-studio',
];

for (const route of aiLabRoutes) {
  const pagePath = path.join(aiLabDir, route, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    console.log(`✅ ${route}: page.tsx exists`);
  } else {
    console.error(`❌ ${route}: page.tsx missing`);
    errors++;
  }
}

// Check globals.css exists
const globalsPath = path.join(appDir, 'globals.css');
if (fs.existsSync(globalsPath)) {
  const content = fs.readFileSync(globalsPath, 'utf8');
  if (content.includes('@tailwind')) {
    console.log('✅ globals.css: Tailwind directives present');
  } else {
    console.error('❌ globals.css: Missing Tailwind directives');
    errors++;
  }
} else {
  console.error('❌ globals.css: File not found');
  errors++;
}

if (errors > 0) {
  console.error(`\n❌ AI Lab integrity check FAILED with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`\n✅ AI Lab integrity check PASSED (${aiLabRoutes.length} routes verified)`);
  process.exit(0);
}
