#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'package-script-duplicates-latest.json');

function extractScriptsObjectText(source) {
  const keyMatch = /"scripts"\s*:\s*\{/.exec(source);
  if (!keyMatch) return null;
  const openBraceIndex = keyMatch.index + keyMatch[0].lastIndexOf('{');
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = openBraceIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;

    if (depth === 0) {
      return source.slice(openBraceIndex + 1, i);
    }
  }

  return null;
}

function decodeJsonString(raw) {
  return JSON.parse(`"${raw}"`);
}

function findDuplicateScriptKeys(scriptsBody) {
  const keyRegex = /"((?:\\.|[^"\\])*)"\s*:/g;
  const counts = new Map();
  const duplicates = [];
  let match;
  while ((match = keyRegex.exec(scriptsBody)) !== null) {
    const key = decodeJsonString(match[1]);
    const current = counts.get(key) || 0;
    const next = current + 1;
    counts.set(key, next);
    if (next === 2) duplicates.push(key);
  }
  return duplicates.sort();
}

function writeReport(report) {
  const reportsDir = path.dirname(REPORT_PATH);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
}

function main() {
  const report = {
    timestamp: new Date().toISOString(),
    packageJsonPath: 'package.json',
    duplicates: [],
    duplicateCount: 0,
  };

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error('package.json not found');
    process.exit(1);
  }

  const source = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
  const scriptsBody = extractScriptsObjectText(source);
  if (scriptsBody === null) {
    console.error('Could not locate scripts object in package.json');
    process.exit(1);
  }

  report.duplicates = findDuplicateScriptKeys(scriptsBody);
  report.duplicateCount = report.duplicates.length;
  writeReport(report);

  if (report.duplicateCount > 0) {
    console.error(`Duplicate npm script keys detected (${report.duplicateCount}): ${report.duplicates.join(', ')}`);
    process.exit(1);
  }

  console.log('No duplicate npm script keys detected.');
}

main();
