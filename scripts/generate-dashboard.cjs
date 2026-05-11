#!/usr/bin/env node
/**
 * Generate a simple HTML dashboard from automation reports.
 * Reads JSON files in automation/reports and creates an index.html
 * that lists each report with a summary.
 */
const fs = require('fs');
const path = require('path');

const reportsDir = path.resolve('automation','reports');
if (!fs.existsSync(reportsDir)) {
  console.error('Reports directory not found');
  process.exit(1);
}

const reportFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
let rows = '';
reportFiles.forEach(file => {
  const fullPath = path.join(reportsDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(fullPath,'utf8'));
    const title = data.title || file.replace('.json','');
    const score = data.autonomyScore || data.riskScore || data.mttrHours || '';
    rows += `<tr><td>${title}</td><td>${score}</td><td><pre>${JSON.stringify(data,null,2).substring(0,200)}...</pre></td></tr>`;
  } catch(e) {
    rows += `<tr><td>${file}</td><td colspan="2">Failed to parse JSON</td></tr>`;
  }
});

const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>AI Automation Dashboard</title>
<style>body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;vertical-align:top;}th{background:#f4f4f4;}</style>
</head>
<body>
<h1>AI Automation Dashboard</h1>
<p>Generated at ${new Date().toISOString()}</p>
<table>
  <thead><tr><th>Report</th><th>Key Score</th><th>Sample JSON</th></tr></thead>
  <tbody>
    ${rows}
  </tbody>
</table>
</body>
</html>`;

fs.mkdirSync('dashboard', {recursive:true});
fs.writeFileSync('dashboard/index.html', html);
console.log('Dashboard generated at dashboard/index.html');
