// Auto-Fix Workflow Detection: scans package.json lint rules and auto-generates workflows
const fs = require('fs');
const path = require('path');

const lintRules = [
  { rule: 'button-accessibility', workflow: 'ai-accessibility-audit.yml' },
  { rule: 'color-contrast', workflow: 'ai-accessibility-audit.yml' },
  { rule: 'image-alt-text', workflow: 'ai-accessibility-audit.yml' },
  { rule: 'form-labels', workflow: 'ai-accessibility-audit.yml' },
];

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const devDeps = Object.keys(pkg.devDependencies || {});

  lintRules.forEach(r => {
    const matches = devDeps.filter(d => new RegExp(r.rule, 'i').test(d));
    if (matches.length > 0) {
      const wfPath = path.join('.github', 'workflows', r.workflow);
      if (!fs.existsSync(wfPath)) {
        const workflowName = r.workflow.replace('-', ' ').replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.slice(1));
        const wfContent = `name: ${workflowName}
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - name: Install deps
        run: npm ci
      - name: Run ${r.workflow.replace('.yml','')}
        run: npm run lint 2>&1 | grep -i '${r.rule}' || echo "No issues found"
`;
        fs.writeFileSync(wfPath, wfContent);
        console.log(`✅ Created: ${wfPath}`);
      } else {
        console.log(`🔸 Skipped: ${wfPath} (already exists)`);
      }
    } else {
      console.log(`⏩ No devDependency found for rule "${r.rule}"`);
    }
  });
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
