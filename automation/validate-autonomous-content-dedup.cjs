#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'autonomous-dedup-latest.json');

function read(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function getSingleQuotedValues(content, key) {
  const regex = new RegExp(`${key}:\\s*'([^']+)'`, 'g');
  const values = [];
  let match = regex.exec(content);
  while (match) {
    values.push(match[1]);
    match = regex.exec(content);
  }
  return values;
}

function getDoubleQuotedValues(content, key) {
  const regex = new RegExp(`${key}:\\s*"([^"]+)"`, 'g');
  const values = [];
  let match = regex.exec(content);
  while (match) {
    values.push(match[1]);
    match = regex.exec(content);
  }
  return values;
}

function getJsxHrefValues(content) {
  const regex = /href=\s*"([^"]+)"/g;
  const values = [];
  let match = regex.exec(content);
  while (match) {
    values.push(match[1]);
    match = regex.exec(content);
  }
  return values;
}

function findDuplicates(values) {
  const seen = new Set();
  const dup = new Set();
  for (const value of values) {
    if (seen.has(value)) dup.add(value);
    seen.add(value);
  }
  return Array.from(dup);
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function assertNoDuplicates(values, label) {
  const duplicates = findDuplicates(values);
  if (duplicates.length) {
    throw new Error(`${label} duplicates found: ${duplicates.join(', ')}`);
  }
}

function assertInternalRoutesExist(values, routes, label) {
  const missing = values.filter((value) => value.startsWith('/ai-lab/') && !routes.includes(value));
  if (missing.length) {
    throw new Error(`${label} routes missing from AI Lab registry: ${missing.join(', ')}`);
  }
}

function getBacklogIdeaStrings(backlogJson) {
  const ideas = [];
  if (Array.isArray(backlogJson.newIdeas)) ideas.push(...backlogJson.newIdeas);
  if (Array.isArray(backlogJson.evolutionRoadmap)) ideas.push(...backlogJson.evolutionRoadmap);
  if (Array.isArray(backlogJson.implementationTasks)) {
    for (const task of backlogJson.implementationTasks) {
      if (typeof task?.title === 'string') ideas.push(task.title);
    }
  }
  return ideas;
}

function main() {
  const aiLabTools = read('app/ai-lab/ai-lab-tools.ts');
  const featuredItems = read('app/features/featuredItems.ts');
  const homepage = read('app/page.tsx');
  const navigation = read('app/constants/navigation.ts');
  const backlogRaw = read('automation/data/app-evolution-backlog.json');
  const backlog = JSON.parse(backlogRaw);

  const aiLabIds = getSingleQuotedValues(aiLabTools, 'id');
  const aiLabHrefs = getSingleQuotedValues(aiLabTools, 'href');
  const aiLabSlugs = getSingleQuotedValues(aiLabTools, 'slug');
  const featuredIds = getSingleQuotedValues(featuredItems, 'id');
  const featuredHrefs = getSingleQuotedValues(featuredItems, 'href');
  const homepageHrefs = getJsxHrefValues(homepage).filter((href) => href.startsWith('/ai-lab/'));
  const navNames = getSingleQuotedValues(navigation, 'name');
  const aiLabTitles = getSingleQuotedValues(aiLabTools, 'title');
  const backlogIdeas = getBacklogIdeaStrings(backlog);

  const existingIndex = new Set([...aiLabTitles, ...navNames].map(normalizeText).filter(Boolean));
  const duplicateBacklogIdeas = backlogIdeas.filter((idea) => existingIndex.has(normalizeText(idea)));
  const duplicateBacklogWithinIdeas = findDuplicates(backlogIdeas.map(normalizeText));

  assertNoDuplicates(aiLabIds, 'AI Lab tool id');
  assertNoDuplicates(aiLabHrefs, 'AI Lab tool href');
  assertNoDuplicates(aiLabSlugs, 'AI Lab tool slug');
  assertNoDuplicates(featuredIds, 'Featured item id');
  assertNoDuplicates(featuredHrefs, 'Featured item href');
  assertInternalRoutesExist(homepageHrefs, aiLabHrefs, 'Homepage');

  const report = {
    generatedAt: new Date().toISOString(),
    checks: {
      aiLabIds: aiLabIds.length,
      aiLabHrefs: aiLabHrefs.length,
      featuredIds: featuredIds.length,
      featuredHrefs: featuredHrefs.length,
      homepageAiLabRoutes: homepageHrefs.length,
      backlogIdeas: backlogIdeas.length,
      duplicateBacklogIdeasWithinBacklog: duplicateBacklogWithinIdeas,
      duplicateBacklogIdeasAgainstCatalog: duplicateBacklogIdeas,
    },
  };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  if (duplicateBacklogWithinIdeas.length > 0) {
    console.warn(
      `[dedup-guard] warning: duplicate backlog concepts found: ${duplicateBacklogWithinIdeas.join(', ')}`,
    );
  }

  if (duplicateBacklogIdeas.length > 0) {
    throw new Error(
      `Backlog ideas duplicate existing AI catalog/navigation concepts: ${duplicateBacklogIdeas.join(', ')}`,
    );
  }

  console.log('Dedup guard passed: IDs/hrefs/slugs/routes and backlog idea collisions are clean.');
}

try {
  main();
} catch (error) {
  console.error(`[dedup-guard] ${error.message}`);
  process.exit(1);
}
