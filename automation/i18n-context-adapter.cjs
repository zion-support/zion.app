#!/usr/bin/env node
/**
 * i18n Context Adapter (Prototype)
 * --------------------------------
 * Scans the `app/` directory for Next.js pages and generates locale JSON files
 * under `locales/<lang>/` based on extracted static strings. This allows automatic
 * localization for newly added UI components.
 *
 * The script runs as a daily GitHub Actions job and commits the generated files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration – languages to generate
const LANGUAGES = ['en', 'pt', 'es'];
const APP_DIR = path.join(process.cwd(), 'app');
const LOCALES_ROOT = path.join(process.cwd(), 'locales');

// Simple extractor: looks for backticked strings in page components
function extractStrings(fileContent) {
  const regex = /`([^`]+)`/g;
  const matches = [];
  let m;
  while ((m = regex.exec(fileContent)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateLocaleFiles() {
  ensureDir(LOCALES_ROOT);
  const pages = [];
  // Recursively walk APP_DIR for .tsx/.jsx files
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && /\.(tsx|jsx|js|ts)$/.test(entry.name)) {
        pages.push(full);
      }
    }
  }
  walk(APP_DIR);

  const allStrings = new Set();
  for (const file of pages) {
    const content = fs.readFileSync(file, 'utf8');
    const strs = extractStrings(content);
    strs.forEach(s => allStrings.add(s));
  }

  LANGUAGES.forEach(lang => {
    const localeDir = path.join(LOCALES_ROOT, lang);
    ensureDir(localeDir);
    const outPath = path.join(localeDir, 'common.json');
    const dict = {};
    let idx = 0;
    for (const str of allStrings) {
      dict[`key${idx++}`] = str; // placeholder translation key
    }
    fs.writeFileSync(outPath, JSON.stringify(dict, null, 2));
    console.log(`[i18n] Generated ${outPath}`);
  });
}

function commitChanges() {
  try {
    execSync('git add locales', { stdio: 'ignore' });
    execSync('git commit -m "chore: update i18n locale files (auto)"', { stdio: 'ignore' });
    execSync('git push origin main', { stdio: 'ignore' });
    console.log('[i18n] Locale changes committed and pushed');
  } catch (e) {
    console.log('[i18n] No changes to commit');
  }
}

if (require.main === module) {
  generateLocaleFiles();
  commitChanges();
}
