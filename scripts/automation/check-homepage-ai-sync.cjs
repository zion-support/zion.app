#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOOLS_PATH = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const CATALOG_PATH = path.join(ROOT, 'app', 'config', 'aiCatalog.ts');

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file missing: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function getLiveToolIds(source) {
  const liveIds = new Set();
  const toolBlockRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'[\s\S]*?\}/g;
  let match;
  while ((match = toolBlockRegex.exec(source))) {
    if (match[2] === 'live') {
      liveIds.add(match[1]);
    }
  }
  return liveIds;
}

function parseConstArray(source, arrayName) {
  const regex = new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const;`, 'm');
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Array not found: ${arrayName}`);
  }
  const idRegex = /'([^']+)'/g;
  const ids = [];
  let idMatch;
  while ((idMatch = idRegex.exec(match[1]))) {
    ids.push(idMatch[1]);
  }
  return ids;
}

function getDuplicates(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function main() {
  const toolsSource = readRequired(TOOLS_PATH);
  const catalogSource = readRequired(CATALOG_PATH);
  const liveToolIds = getLiveToolIds(toolsSource);
  const targetArrays = ['HOMEPAGE_LAB_IDS', 'LIVE_NOW_IDS', 'HERO_CTA_IDS'];
  const errors = [];

  for (const arrayName of targetArrays) {
    const ids = parseConstArray(catalogSource, arrayName);
    const duplicates = getDuplicates(ids);
    if (duplicates.length > 0) {
      errors.push(`${arrayName}: duplicate ids -> ${duplicates.join(', ')}`);
    }

    const unknownIds = ids.filter((id) => !liveToolIds.has(id));
    if (unknownIds.length > 0) {
      errors.push(`${arrayName}: ids not found as live tools -> ${unknownIds.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    console.error('[Homepage AI Sync Check] FAILED');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `[Homepage AI Sync Check] PASS (${targetArrays.length} arrays validated against ${liveToolIds.size} live tools).`,
  );
}

main();
