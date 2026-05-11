#!/usr/bin/env node
 
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const appDir = path.join(repoRoot, 'app');
const reportDir = path.join(repoRoot, 'automation', 'reports');
const reportPath = path.join(reportDir, 'autonomous-opportunity-radar-latest.json');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function routeFromPagePath(filePath) {
  const relative = path.relative(appDir, filePath).replace(/\\/g, '/');
  const withoutPage = relative.replace(/\/page\.(ts|tsx|js|jsx)$/, '');
  return withoutPage ? `/${withoutPage}` : '/';
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const appFiles = walk(appDir).filter((filePath) => /\/page\.(ts|tsx|js|jsx)$/.test(filePath));
  const routes = appFiles.map(routeFromPagePath);

  const aiLabToolsPath = path.join(appDir, 'ai-lab', 'ai-lab-tools.ts');
  const aiLabSource = safeRead(aiLabToolsPath);
  const aiToolMatches = aiLabSource.match(/id:\s*'[^']+'/g) || [];

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      appRoutes: routes.length,
      aiLabTools: aiToolMatches.length,
    },
    topOpportunities: [
      {
        title: 'Expand autonomous in-browser advisors for high-intent product pages',
        rationale: 'High route count creates strong targeting potential for contextual AI experiences.',
      },
      {
        title: 'Increase cross-linking from homepage into AI Lab tools',
        rationale: 'Additional AI Lab tools exist and can be promoted aggressively in conversion zones.',
      },
      {
        title: 'Prioritize rollout/governance assistants for enterprise pages',
        rationale: 'Enterprise audience benefits from guided readiness and risk workflows.',
      },
    ],
  };

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Generated ${reportPath}`);
}

main();
