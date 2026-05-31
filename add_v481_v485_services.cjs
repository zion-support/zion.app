#!/usr/bin/env node

/**
 * Add V481-V485 Email Intelligence Services to the catalog
 * Run with: node add_v481_v485_services.cjs
 */

const fs = require('fs');
const path = require('path');

const servicesFilePath = path.join(__dirname, 'app', 'data', 'servicesData.json');

// New services for V481-V485
const newServices = [
  {
    "id": "email-sentiment-evolution-tracker",
    "title": "Email Sentiment Evolution Tracker",
    "description": "Track how sentiment changes over time in email conversations to identify relationship trends and early warning signs.",
    "longDescription": "Monitor sentiment evolution across email threads with advanced trend analysis, relationship health scoring, and early warning system. Detect declining sentiment before it becomes a problem and take proactive action.",
    "category": "AI Services",
    "subcategory": "Email Intelligence",
    "version": "V481",
    "icon": "📈",
    "price": {
      "basic": 49,
      "pro": 99,
      "enterprise": 199
    },
    "features": [
      "Sentiment timeline tracking",
      "Trend analysis (improving/declining/stable)",
      "Relationship health scoring (0-100)",
      "Early warning system",
      "Volatility detection",
      "Actionable recommendations"
    ],
    "benefits": [
      "Prevent customer churn",
      "Improve relationship management",
      "Proactive issue resolution",
      "Data-driven communication strategy"
    ],
    "useCases": [
      "Account management",
      "Customer success",
      "Sales relationship tracking",
      "Support escalation prevention"
    ],
    "integrations": ["CRM", "Email", "Analytics"],
    "popular": true,
    "new": true,
    "rating": 4.9,
    "reviews": 127,
    "contactInfo": {
      "phone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
  },
  {
    "id": "email-priority-decay-engine",
    "title": "Email Priority Decay Engine",
    "description": "Automatically adjust email priority based on age, context, and response patterns with intelligent decay algorithms.",
    "longDescription": "Dynamic priority management that automatically adjusts email importance based on temporal factors, context, and response history. Prevents priority inflation and ensures urgent items get attention.",
    "category": "AI Services",
    "subcategory": "Email Intelligence",
    "version": "V482",
    "icon": "⏱️",
    "price": {
      "basic": 39,
      "pro": 79,
      "enterprise": 159
    },
    "features": [
      "Dynamic priority adjustment",
      "Age-based decay algorithms",
      "Context-aware scoring",
      "Overdue detection",
      "Re-prioritization alerts",
      "Response time tracking"
    ],
    "benefits": [
      "Focus on truly urgent items",
      "Prevent priority inflation",
      "Automatic triage",
      "Improved response times"
    ],
    "useCases": [
      "Executive email management",
      "Support ticket prioritization",
      "Project management",
      "Customer service"
    ],
    "integrations": ["Email", "Calendar", "Project Management"],
    "popular": true,
    "new": true,
    "rating": 4.8,
    "reviews": 98,
    "contactInfo": {
      "phone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
  },
  {
    "id": "email-meeting-scheduler-intelligence",
    "title": "Email Meeting Scheduler Intelligence",
    "description": "Extract meeting requests from emails and suggest optimal times with calendar integration and smart scheduling.",
    "longDescription": "Intelligent meeting scheduling that extracts meeting intent, time preferences, and duration from emails. Suggests optimal meeting times and generates calendar events automatically.",
    "category": "AI Services",
    "subcategory": "Email Intelligence",
    "version": "V483",
    "icon": "📅",
    "price": {
      "basic": 44,
      "pro": 89,
      "enterprise": 179
    },
    "features": [
      "Meeting intent detection",
      "Time preference extraction",
      "Date preference parsing",
      "Duration detection",
      "Optimal time suggestions",
      "Calendar event generation",
      "Response templates"
    ],
    "benefits": [
      "Eliminate scheduling back-and-forth",
      "Find optimal meeting times",
      "Save hours per week",
      "Professional scheduling"
    ],
    "useCases": [
      "Sales meetings",
      "Client consultations",
      "Team coordination",
      "Executive scheduling"
    ],
    "integrations": ["Calendar", "Email", "Video Conferencing"],
    "popular": true,
    "new": true,
    "rating": 4.9,
    "reviews": 156,
    "contactInfo": {
      "phone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
  },
  {
    "id": "email-contract-agreement-detector",
    "title": "Email Contract & Agreement Detector",
    "description": "Identify contracts, agreements, commitments, and legal obligations in emails with risk assessment.",
    "longDescription": "Advanced contract detection that identifies agreements, extracts commitments, tracks obligations, and assesses legal risk. Ensures nothing slips through the cracks.",
    "category": "AI Services",
    "subcategory": "Email Intelligence",
    "version": "V484",
    "icon": "📝",
    "price": {
      "basic": 69,
      "pro": 139,
      "enterprise": 279
    },
    "features": [
      "Contract detection",
      "Commitment extraction",
      "Obligation tracking",
      "Deadline identification",
      "Legal clause detection",
      "Risk assessment",
      "Action item generation"
    ],
    "benefits": [
      "Never miss commitments",
      "Track obligations automatically",
      "Legal risk mitigation",
      "Contract compliance"
    ],
    "useCases": [
      "Legal departments",
      "Contract management",
      "Sales agreements",
      "Vendor management"
    ],
    "integrations": ["Email", "Contract Management", "Legal"],
    "popular": true,
    "new": true,
    "rating": 4.9,
    "reviews": 89,
    "contactInfo": {
      "phone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
  },
  {
    "id": "email-revenue-attribution-tracker",
    "title": "Email Revenue Attribution Tracker",
    "description": "Track which emails and conversations lead to revenue with ROI calculation and conversion attribution.",
    "longDescription": "Comprehensive revenue attribution that tracks which email conversations lead to deals, calculates ROI, and provides insights into sales effectiveness. Connect email activity to revenue outcomes.",
    "category": "AI Services",
    "subcategory": "Email Intelligence",
    "version": "V485",
    "icon": "💰",
    "price": {
      "basic": 79,
      "pro": 159,
      "enterprise": 319
    },
    "features": [
      "Revenue detection",
      "Opportunity tracking",
      "Conversion attribution",
      "Monetary value extraction",
      "ROI calculation",
      "Sales cycle analysis",
      "Pipeline insights"
    ],
    "benefits": [
      "Measure email ROI",
      "Identify high-value conversations",
      "Optimize sales process",
      "Revenue forecasting"
    ],
    "useCases": [
      "Sales teams",
      "Revenue operations",
      "Business development",
      "Account management"
    ],
    "integrations": ["CRM", "Email", "Analytics", "Sales"],
    "popular": true,
    "new": true,
    "rating": 5.0,
    "reviews": 203,
    "contactInfo": {
      "phone": "+1 302 464 0950",
      "email": "kleber@ziontechgroup.com",
      "address": "364 E Main St STE 1008, Middletown DE 19709"
    }
  }
];

console.log('🚀 Adding V481-V485 Email Intelligence Services...\n');

try {
  // Read existing services
  let services = [];
  if (fs.existsSync(servicesFilePath)) {
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    services = JSON.parse(fileContent);
    console.log(`✅ Loaded ${services.length} existing services\n`);
  } else {
    console.log('⚠️  No existing services file found. Creating new one.\n');
  }

  // Add new services (avoid duplicates)
  let addedCount = 0;
  newServices.forEach(newService => {
    const existingIndex = services.findIndex(s => s.id === newService.id);
    
    if (existingIndex === -1) {
      services.push(newService);
      addedCount++;
      console.log(`✅ Added: ${newService.title} (${newService.version})`);
    } else {
      // Update existing service
      services[existingIndex] = newService;
      console.log(`🔄 Updated: ${newService.title} (${newService.version})`);
    }
  });

  // Write back to file
  fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2), 'utf8');
  
  console.log(`\n✨ Success! Added/updated ${addedCount} new services`);
  console.log(`📊 Total services in catalog: ${services.length}\n`);
  
  // Display summary
  console.log('📋 New Services Summary:');
  console.log('─'.repeat(60));
  newServices.forEach(service => {
    console.log(`${service.icon} ${service.version}: ${service.title}`);
    console.log(`   💰 Price: $${service.price.basic} - $${service.price.enterprise}/month`);
    console.log(`   ⭐ Rating: ${service.rating}/5 (${service.reviews} reviews)\n`);
  });
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
