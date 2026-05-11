#!/usr/bin/env node
/**
 * AI Observability Dashboard
 * Aggregates metrics from all AI automation modules and generates an HTML status report.
 * Runs autonomously as part of the Minimal CI Pipeline (First option).
 */

const fs = require('fs');
const path = require('path');

// Directory where individual module reports are stored
const REPORTS_DIR = path.join(__dirname, 'reports');
const DASHBOARD_HTML = path.join(__dirname, 'reports', 'ai-observability-dashboard.html');

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function collectModuleData() {
  const modules = [];
  const files = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    const fullPath = path.join(REPORTS_DIR, file);
    const data = loadJSON(fullPath);
    if (data) {
      modules.push({
        name: file.replace('-latest.json', ''),
        data
      });
    }
  });
  return modules;
}

function generateHTML(modules) {
  const now = new Date().toISOString();
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Observability Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background:#f9f9f9; }
    h1 { color: #333; }
    .module { background:#fff; border:1px solid #ddd; margin-bottom:15px; padding:10px; border-radius:4px; }
    .module h2 { margin-top:0; font-size:1.2em; color:#555; }
    .status { font-weight:bold; }
    .timestamp { color:#888; font-size:0.9em; }
  </style>
</head>
<body>
  <h1>AI Observability Dashboard</h1>
  <p class="timestamp">Generated at: ${now}</p>
`;

  modules.forEach(mod => {
    html += `<div class="module">
      <h2>${mod.name}</h2>
      <pre>${JSON.stringify(mod.data, null, 2)}</pre>
    </div>`;
  });

  html += `</body>
</html>`;
  return html;
}

function main() {
  console.log('AI Observability Dashboard generating report...');
  const modules = collectModuleData();
  const html = generateHTML(modules);
  const outDir = path.dirname(DASHBOARD_HTML);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(DASHBOARD_HTML, html);
  console.log(`Dashboard written to ${DASHBOARD_HTML}`);
}

main();
