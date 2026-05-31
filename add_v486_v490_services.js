#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read existing services
const servicesPath = path.join(__dirname, 'app', 'data', 'servicesData.json');
const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

// V486-V490 Services
const newServices = [
  {
    "id": "email-tone-adapter",
    "title": "Email Tone Adapter",
    "description": "Intelligently adapts email tone based on recipient relationship, context, and communication history. Ensures professional and appropriate communication.",
    "category": "Email Intelligence",
    "price": 89,
    "features": [
      "Relationship-based tone adjustment",
      "Formality level detection",
      "Professional language suggestions",
      "Cultural context awareness",
      "Communication history analysis"
    ],
    "benefits": [
      "Improve professional communication",
      "Build stronger relationships",
      "Avoid tone misunderstandings",
      "Maintain consistent brand voice"
    ]
  },
  {
    "id": "email-followup-chain-optimizer",
    "title": "Email Follow-up Chain Optimizer",
    "description": "Creates intelligent follow-up sequences with optimal timing, content suggestions, and response tracking to maximize engagement rates.",
    "category": "Email Intelligence",
    "price": 99,
    "features": [
      "Automated follow-up sequences",
      "Optimal timing calculations",
      "Content variation suggestions",
      "Response rate tracking",
      "A/B testing for follow-ups"
    ],
    "benefits": [
      "Increase response rates by 40%",
      "Save time on manual follow-ups",
      "Never miss important conversations",
      "Improve conversion rates"
    ]
  },
  {
    "id": "email-context-memory-system",
    "title": "Email Context Memory System",
    "description": "Remembers previous conversations and provides intelligent context suggestions, helping you maintain continuity and build on past discussions.",
    "category": "Email Intelligence",
    "price": 109,
    "features": [
      "Conversation history tracking",
      "Context-aware suggestions",
      "Topic relationship mapping",
      "Previous decision recall",
      "Continuity recommendations"
    ],
    "benefits": [
      "Never lose conversation context",
      "Build on previous discussions",
      "Improve decision continuity",
      "Enhance professional relationships"
    ]
  },
  {
    "id": "email-urgency-escalation-engine",
    "title": "Email Urgency Escalation Engine",
    "description": "Automatically detects urgent emails and escalates them through appropriate channels with SLA tracking and notification management.",
    "category": "Email Intelligence",
    "price": 119,
    "features": [
      "Urgency level detection",
      "Automatic escalation rules",
      "SLA tracking and alerts",
      "Multi-channel notifications",
      "Escalation path management"
    ],
    "benefits": [
      "Never miss critical emails",
      "Ensure timely responses",
      "Improve customer satisfaction",
      "Reduce response time by 60%"
    ]
  },
  {
    "id": "email-response-time-predictor",
    "title": "Email Response Time Predictor",
    "description": "Predicts when recipients will respond based on historical patterns, helping you set expectations and plan follow-ups effectively.",
    "category": "Email Intelligence",
    "price": 79,
    "features": [
      "Response time predictions",
      "Historical pattern analysis",
      "Recipient behavior modeling",
      "Optimal send time suggestions",
      "Expectation management"
    ],
    "benefits": [
      "Set realistic expectations",
      "Plan follow-ups effectively",
      "Reduce email anxiety",
      "Improve time management"
    ]
  }
];

// Add new services
let addedCount = 0;
newServices.forEach(service => {
  const exists = servicesData.services.find(s => s.id === service.id);
  if (!exists) {
    servicesData.services.push(service);
    addedCount++;
    console.log(`✅ Added: ${service.title}`);
  } else {
    console.log(`⚠️  Skipped (already exists): ${service.title}`);
  }
});

// Save updated services
fs.writeFileSync(servicesPath, JSON.stringify(servicesData, null, 2));
console.log(`\n📊 Total services: ${servicesData.services.length}`);
console.log(`✨ Added ${addedCount} new services (V486-V490)`);
