#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOOLS_PATH = path.join(ROOT, 'app', 'ai-lab', 'ai-lab-tools.ts');
const REPORT_DIR = path.join(ROOT, 'automation', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'autonomous-idea-guarded-cycle-latest.json');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseToolItems(content) {
  const regex =
    /id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?shortDescription:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'[\s\S]*?href:\s*'([^']+)'/g;
  const items = [];
  let match = regex.exec(content);
  while (match) {
    items.push({
      id: match[1],
      title: match[2],
      shortDescription: match[3],
      status: match[4],
      href: match[5],
    });
    match = regex.exec(content);
  }
  return items;
}

function scoreIdea(item) {
  const title = item.title.toLowerCase();
  const description = item.shortDescription.toLowerCase();
  const reliabilityBonus = title.includes('incident') || description.includes('rollback') ? 8 : 0;
  const conversionBonus = title.includes('conversion') || description.includes('growth') ? 6 : 0;
  const autonomyBonus = description.includes('autonomous') ? 7 : 0;
  const liveBonus = item.status === 'live' ? 12 : 4;

  const score = Math.min(100, 50 + reliabilityBonus + conversionBonus + autonomyBonus + liveBonus);
  return {
    ...item,
    score,
    priority: score >= 72 ? 'high' : score >= 62 ? 'medium' : 'low',
    reason:
      score >= 72
        ? 'High signal for near-term autonomous promotion and safe deploy velocity.'
        : 'Useful candidate for incremental evolution cycle with gated validation.',
  };
}

function main() {
  const toolsContent = read(TOOLS_PATH);
  const tools = parseToolItems(toolsContent);
  const ranked = tools.map(scoreIdea).sort((a, b) => b.score - a.score).slice(0, 8);

  const report = {
    timestamp: new Date().toISOString(),
    source: 'ai-autonomous-idea-guarded-cycle',
    selectedCount: ranked.length,
    nextWave: ranked,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`[guarded-cycle] wrote report: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`[guarded-cycle] top candidate: ${ranked[0]?.id ?? 'none'}`);
}

main();
