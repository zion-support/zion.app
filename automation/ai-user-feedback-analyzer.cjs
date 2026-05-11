#!/usr/bin/env node
/**
 * AI User Feedback Analyzer
 * Analyzes user feedback from various channels and converts to improvement tasks
 * Runs autonomously as part of the AI workflow system
 */

const fs = require('fs');
const path = require('path');

const FEEDBACK_LOG = path.join(__dirname, '../automation/reports/ai-user-feedback-analyzer-latest.json');
const FEEDBACK_SOURCES = [
  path.join(__dirname, '../memory/'), // Check memory files for feedback patterns
  path.join(__dirname, '../HEARTBEAT.md'), // Check heartbeat for user requests
  path.join(__dirname, '../USER.md'), // Check user preferences
  path.join(__dirname, '../SOUL.md') // Check soul for guiding principles
];

function analyzeFeedback() {
  console.log('Starting AI User Feedback Analyzer...');
  const analysis = {
    timestamp: new Date().toISOString(),
    feedbackSources: [],
    detectedPatterns: [],
    suggestedImprovements: [],
    priority: 'medium'
  };

  // Analyze each feedback source
  for (const source of FEEDBACK_SOURCES) {
    try {
      if (fs.existsSync(source)) {
        const stats = fs.statSync(source);
        let content = '';
        if (stats.isDirectory()) {
          // For directories, check recent files
          const files = fs.readdirSync(source).filter(f => f.endsWith('.md') || f.endsWith('.json'));
          content = files.slice(0, 5).join(', ');
        } else {
          content = fs.readFileSync(source, 'utf8').slice(0, 1000); // First 1000 chars
        }
        
        analysis.feedbackSources.push({
          source: source,
          lastModified: stats.mtime,
          size: stats.size,
          contentPreview: content
        });
      }
    } catch (err) {
      console.warn(`Could not analyze ${source}:`, err.message);
    }
  }

  // Detect patterns indicating user priorities
  const feedbackText = analysis.feedbackSources.map(s => s.contentPreview || '').join(' ').toLowerCase();
  
  // Look for common request patterns
  const patterns = [
    { keyword: 'fast', improvement: 'Optimize response times', priority: 'high' },
    { keyword: 'autonomous', improvement: 'Enhance self-healing capabilities', priority: 'high' },
    { keyword: 'new ideas', improvement: 'Accelerate idea implementation pipeline', priority: 'medium' },
    { keyword: 'monitor', improvement: 'Improve observability dashboards', priority: 'medium' },
    { keyword: 'report', improvement: 'Enhance reporting and analytics', priority: 'low' },
    { keyword: 'fix', improvement: 'Increase automated bug fixing', priority: 'high' },
    { keyword: 'deploy', improvement: 'Streamline deployment processes', priority: 'medium' }
  ];

  for (const pattern of patterns) {
    if (feedbackText.includes(pattern.keyword)) {
      analysis.detectedPatterns.push(pattern.keyword);
      analysis.suggestedImprovements.push({
        description: pattern.improvement,
        priority: pattern.priority,
        source: 'user_feedback_pattern'
      });
    }
  }

  // Remove duplicates and prioritize
  const uniqueImprovements = [];
  const seen = new Set();
  for (const imp of analysis.suggestedImprovements) {
    const key = imp.description;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueImprovements.push(imp);
    }
  }
  analysis.suggestedImprovements = uniqueImprovements;

  // Save results
  const reportDir = path.dirname(FEEDBACK_LOG);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(FEEDBACK_LOG, JSON.stringify(analysis, null, 2));
  console.log(`Feedback analysis complete. Found ${analysis.suggestedImprovements.length} improvement suggestions.`);
  
  return analysis;
}

function main() {
  try {
    const result = analyzeFeedback();
    // Trigger appropriate actions based on analysis
    if (result.suggestedImprovements.length > 0) {
      console.log('Suggested improvements:', result.suggestedImprovements.map(i => i.description));
      // In a full implementation, this would trigger the idea implementation pipeline
    }
  } catch (err) {
    console.error('Error in AI User Feedback Analyzer:', err);
    process.exit(1);
  }
}

main();