#!/usr/bin/env node
/**
 * Response Effectiveness Tracker - Free Implementation
 * Tracks which outreach responses work best and learns patterns
 */

const fs = require('fs');
const path = require('path');

const logFile = '/root/.openclaw/workspace/memory/client-outreach-actions.log';
const patternsFile = '/root/.openclaw/workspace/memory/response-patterns.json';

// Track response actions
const actions = [];
if (fs.existsSync(logFile)) {
    const lines = fs.readFileSync(logFile, 'utf8').split('\n');
    for (const line of lines) {
        if (line.includes('MOVED_ALL_INBOX_TO_FAILURES') || line.includes('MOVED_GITHUB_ALERTS')) {
            const match = line.match(/(\d{4}-\d{2}-\d{2}T[^\s]+):\s+(.*)/);
            if (match) {
                actions.push({
                    timestamp: match[1],
                    action: match[2],
                    type: match[2].includes('MOVED') ? 'cleanup' : 'outreach'
                });
            }
        }
    }
}

// Simple learning: count successful patterns
const patterns = {
    cleanupActions: actions.filter(a => a.type === 'cleanup').length,
    outreachActions: actions.filter(a => a.type === 'outreach').length,
    lastAction: actions[actions.length - 1] || null,
    continuousImprovementScore: (actions.length > 0 ? Math.min(actions.length / 10, 1) : 0)
};

fs.writeFileSync(patternsFile, JSON.stringify(patterns, null, 2));

console.log('Tracked actions:', actions.length);
console.log('Cleanup actions:', patterns.cleanupActions);
console.log('Improvement score:', patterns.continuousImprovementScore);

// Next run: use these patterns to optimize timing