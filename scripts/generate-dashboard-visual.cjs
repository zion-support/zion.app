#!/usr/bin/env node
/**
 * Generate a simple visual dashboard from automation reports.
 * Reads JSON files in automation/reports and creates an HTML dashboard
 * with a basic table and placeholder bar charts.
 */
const fs = require('fs');
const path = require('path');

const reportsDir = path.resolve('automation', 'reports');
if (!fs.existsSync(reportsDir)) {
  console.error('Reports directory not found');
  process.exit(1);
}

const reportFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
let rows = '';
reportFiles.forEach(file => {
  const fullPath = path.join(reportsDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const title = data.title || file.replace('.json', '');
    const score = data.autonomyScore || data.riskScore || data.mttrHours || '';
    rows += `<tr><td>${title}</td><td>${score}</td></tr>`;
  } catch (e) {
    rows += `<tr><td>${file}</td><td colspan="2">Error parsing</td></tr>`;
  }
});

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Automation Dashboard Visual</title>
<style>
body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;}
th,td{border:1px solid #ddd;padding:8px;vertical-align:top;}
th{background:#f4f4f4;}
.bar{height:20px;background:#4caf50;margin-bottom:5px;}
</style></head><head><head><body>
<h1>Automation Dashboard Visual</h1>
<p>Generated at ${new Date().toISOString()}</p>
<table>
<thead><tr><th>Report</th><th>Score</th></tr></thead>
<tbody>${rows}</tbody></table>
</body></html>`;

const outDir = path.resolve('dashboard-visual');
fs.mkdirSync(outDir, {recursive:true});
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('Visual dashboard generated at dashboard-visual/index.html');