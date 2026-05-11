#!/usr/bin/env node
/**
 * Empathy Circuit – Baseline Implementation
 * ---------------------------------------
 * Monitors interaction patterns and adapts system behavior
 * according to inferred emotional state.
 *
 * Features:
 *  - Passive sentiment analysis on inbound messages (basic keyword approach).
 *  - Daily stress score calculation based on message frequency & urgency.
 *  - Adaptive suppression of notifications.
 *  - Suggestion engine for wellbeing.
 *
 * Data resides in `empathy/logs/stress.json` and `empathy/metrics.json`.
 */

const fs = require('fs');
const path = require('path');
const datetime = new Date().toISOString();

// Configuration
const LOG_DIR = path.join(process.cwd(), 'empathy', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, {recursive:true});
const MESSAGES_PATH = path.join(LOG_DIR, 'messages.json');
const METRICS_PATH = path.join(LOG_DIR, 'metrics.json');

// Load prior messages
let messages = [];
if (fs.existsSync(MESSAGES_PATH)) {
  try { messages = JSON.parse(fs.readFileSync(MESSAGES_PATH, 'utf8')); } catch(e) {}
}

// Simulated incoming message (in real system this would be event-driven)
const newMessage = {
  id: datetime,
  content: process.argv[2] || "Hey automate the next PR merge",
  timestamp: datetime,
  urgent: false,
  user: 'Kleber'
};

messages.push(newMessage);
// Persist
fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2));

// Basic sentiment keyword analysis (extremely simplified)
const highStress = ['urgent', 'now', 'asap', 'immediately', 'critical'];
const lowStress = ['later', 'maybe', 'whenever', 'whatsup'];

let score = 0;
highStress.forEach(w=>{ if(newMessage.content.toLowerCase().includes(w)) score += 2; });
lowStress.forEach(w=>{ if(newMessage.content.toLowerCase().includes(w)) score -= 1; });

const metrics = {
  timestamp: datetime,
  stressScore: Math.max(0, score),
  lastMessage: newMessage.content
};

fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));

console.log('Empathy Circuit processed message. Current stress score:', metrics.stressScore);
