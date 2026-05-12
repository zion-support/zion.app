#!/usr/bin/env node
/**
 * Lighthouse Evaluation Helper
 * Compares a baseline report with a new report and exits with non‑zero
 * if the performance score drops more than the allowed threshold.
 */
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: lighthouse-eval.js <baseline.json> <new.json>');
  process.exit(2);
}

const baselinePath = path.resolve(process.argv[2]);
const newPath = path.resolve(process.argv[3]);

function loadReport(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error(`Failed to read ${p}: ${e.message}`);
    process.exit(2);
  }
}

const baseline = loadReport(baselinePath);
const latest = loadReport(newPath);

// Extract overall performance score (0‑1 range). Use categories.performance.score if available.
function getPerfScore(report) {
  if (report && report.categories && report.categories.performance && typeof report.categories.performance.score === 'number') {
    return report.categories.performance.score;
  }
  // Fallback to lighthouseResult if present
  if (report.lhr && report.lhr.categories && report.lhr.categories.performance) {
    return report.lhr.categories.performance.score;
  }
  return null;
}

const baseScore = getPerfScore(baseline);
const newScore = getPerfScore(latest);

if (baseScore === null || newScore === null) {
  console.error('Could not locate performance scores in reports');
  process.exit(2);
}

const diffPercent = ((baseScore - newScore) / baseScore) * 100;
const threshold = 10; // % drop allowed

console.log(`Baseline score: ${(baseScore * 100).toFixed(1)}%`);
console.log(`New score:      ${(newScore * 100).toFixed(1)}%`);
console.log(`Drop:           ${diffPercent.toFixed(1)}%`);

if (diffPercent > threshold) {
  console.error(`❌ Performance regression exceeds ${threshold}% threshold`);
  process.exit(1);
} else {
  console.log('✅ Performance within acceptable range');
  process.exit(0);
}
