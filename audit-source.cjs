// audit-source.cjs — Audit source code for issues
const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\Zion\\zion-support.github.io\\app';
const issues = [];
let fileCount = 0;

function walkDir(dir) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === 'node_modules' || item === '.next') continue;
      const full = path.join(dir, item);
      try {
        if (fs.statSync(full).isDirectory()) {
          walkDir(full);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          fileCount++;
          checkFile(full);
        }
      } catch (e) {}
    }
  } catch (e) {}
}

function checkFile(f) {
  try {
    const content = fs.readFileSync(f, 'utf-8');
    const rel = f.replace(base + '\\', '');

    // Placeholder descriptions
    if (/professional AI platform delivered by Zion Tech Group/i.test(content)) {
      issues.push({ file: rel, issue: 'Placeholder description', severity: 'high' });
    }
    if (/professional AI framework delivered by Zion Tech Group/i.test(content)) {
      issues.push({ file: rel, issue: 'Placeholder description', severity: 'high' });
    }
    if (/comprehensive managed service with expert support/i.test(content)) {
      issues.push({ file: rel, issue: 'Placeholder description', severity: 'medium' });
    }

    // Placeholder features
    if (/["']Core functionality["']/.test(content) && /["']Professional support["']/.test(content)) {
      issues.push({ file: rel, issue: 'Placeholder features (generic)', severity: 'medium' });
    }

    // Placeholder benefits
    const benefitMatches = content.match(/Reduce overhead by \d+%/g);
    if (benefitMatches && benefitMatches.length > 3) {
      issues.push({ file: rel, issue: `Generic benefits (${benefitMatches.length} occurrences)`, severity: 'low' });
    }

    // TODO/FIXME
    if (/TODO|FIXME|XXX/.test(content)) {
      issues.push({ file: rel, issue: 'TODO/FIXME comment', severity: 'low' });
    }

    // console.log
    if (/console\.log\(/.test(content)) {
      issues.push({ file: rel, issue: 'console.log in production code', severity: 'low' });
    }

    // Empty paragraphs
    if (/<p>\s*<\/p>/.test(content) || /<p>[\s\n]*<\/p>/.test(content)) {
      issues.push({ file: rel, issue: 'Empty paragraph tags', severity: 'medium' });
    }

    // Missing alt text on images
    const imgWithoutAlt = content.match(/<img[^>]*>/g) || [];
    const missingAlt = imgWithoutAlt.filter(img => !img.includes('alt='));
    if (missingAlt.length > 0) {
      issues.push({ file: rel, issue: `Images without alt text (${missingAlt.length})`, severity: 'medium' });
    }

  } catch (e) {}
}

walkDir(base);

console.log(`\n=== SOURCE CODE AUDIT ===`);
console.log(`Files scanned: ${fileCount}`);
console.log(`Issues found: ${issues.length}\n`);

// Group by severity
const high = issues.filter(i => i.severity === 'high');
const medium = issues.filter(i => i.severity === 'medium');
const low = issues.filter(i => i.severity === 'low');

console.log(`HIGH (${high.length}):`);
high.forEach(i => console.log(`  [${i.severity}] ${i.file}: ${i.issue}`));

console.log(`\nMEDIUM (${medium.length}):`);
medium.slice(0, 20).forEach(i => console.log(`  [${i.severity}] ${i.file}: ${i.issue}`));
if (medium.length > 20) console.log(`  ... and ${medium.length - 20} more`);

console.log(`\nLOW (${low.length}):`);
low.slice(0, 10).forEach(i => console.log(`  [${i.severity}] ${i.file}: ${i.issue}`));
if (low.length > 10) console.log(`  ... and ${low.length - 10} more`);
