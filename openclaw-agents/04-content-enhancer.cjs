#!/usr/bin/env node
/**
 * OpenClaw Agent: Content Enhancer
 * Role: Improve SEO, content quality, and marketing copy
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace/zion.app';
const FINDINGS_FILE = '/root/.openclaw/workspace/zion.app/openclaw-agents/shared/findings.json';

const report = {
  timestamp: new Date().toISOString(),
  agent: 'content-enhancer',
  seoIssues: [],
  contentOpportunities: [],
  suggestions: []
};

console.log('📝 Content Enhancer analyzing...\n');

function getFiles(dir, exts) {
  const files = [];
  const ignore = ['node_modules', '.next'];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...getFiles(full, exts));
    else if (exts.some(e => item.name.endsWith(e))) files.push(full);
  }
  return files;
}

const pages = getFiles(path.join(WORKSPACE, 'app'), ['.tsx']);
console.log(`  Scanning ${pages.length} pages...`);

let missingMeta = 0;
let missingOG = 0;
let shortDescriptions = 0;
let duplicateTitles = 0;
const titles = new Set();

for (const file of pages) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(WORKSPACE, file);
  
  // Check for metadata
  if (!content.includes('generateMetadata') && !content.includes('metadata =')) {
    missingMeta++;
    report.seoIssues.push({ file: relPath, issue: 'missing-metadata' });
  }
  
  // Check for Open Graph tags
  if (content.includes('metadata =') && !content.includes('openGraph:')) {
    missingOG++;
  }
  
  // Check description length
  const descMatch = content.match(/description:\s*['"]([^'"]+)['"]/);
  if (descMatch && descMatch[1].length < 50) {
    shortDescriptions++;
    report.seoIssues.push({ file: relPath, issue: 'short-description' });
  }
  
  // Check for duplicate titles
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  if (titleMatch) {
    if (titles.has(titleMatch[1])) {
      duplicateTitles++;
    }
    titles.add(titleMatch[1]);
  }
  
  // Check for missing CTAs
  if (relPath.includes('page') && !content.includes('Contact') && !content.includes('Get started')) {
    report.contentOpportunities.push({ file: relPath, opportunity: 'missing-cta' });
  }
}

console.log(`\n📊 Content Analysis:`);
console.log(`  Pages missing metadata: ${missingMeta}`);
console.log(`  Pages missing OG tags: ${missingOG}`);
console.log(`  Short descriptions: ${shortDescriptions}`);
console.log(`  Duplicate titles: ${duplicateTitles}`);
console.log(`  CTA opportunities: ${report.contentOpportunities.length}`);

// Content score
const contentScore = Math.max(0, 100 - (missingMeta * 5) - (missingOG * 3) - (shortDescriptions * 2));
console.log(`  Content Score: ${contentScore}/100`);

report.score = contentScore;

// Save
const sharedDir = path.join(WORKSPACE, 'openclaw-agents', 'shared');
fs.mkdirSync(sharedDir, { recursive: true });

let existing = {};
try { existing = JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf8')); } catch (e) {}

fs.writeFileSync(FINDINGS_FILE, JSON.stringify({ ...existing, content: report }, null, 2));
console.log('\n✅ Content report saved');
