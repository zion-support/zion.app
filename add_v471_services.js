// add_v471_services.js
const fs = require('fs');
const path = require('path');

const servicesFilePath = path.join(__dirname, 'app', 'data', 'servicesData.json');

// Read existing services
let services = [];
try {
  const data = fs.readFileSync(servicesFilePath, 'utf8');
  services = JSON.parse(data);
  console.log(`✓ Loaded ${services.length} existing services`);
} catch (error) {
  console.error('Error reading services file:', error.message);
  process.exit(1);
}

// Define new V471-V475 services
const newServices = [
  // V471 - Email Sentiment Tracking Over Time
  {
    id: 'email-sentiment-tracking',
    name: 'Email Sentiment Tracking Over Time',
    description: 'Track sentiment evolution across email threads to identify relationship health and escalation risks.',
    category: 'Email Intelligence',
    icon: '📊',
    price: 49,
    features: [
      'Sentiment timeline analysis',
      'Relationship health scoring',
      'Escalation risk prediction',
      'Trend analysis and alerts',
      'Historical sentiment tracking'
    ],
    benefits: [
      'Prevent customer churn',
      'Improve relationship management',
      'Early warning for escalations',
      'Data-driven communication strategy'
    ]
  },
  
  // V472 - Email Priority Queue Manager
  {
    id: 'email-priority-queue-manager',
    name: 'Email Priority Queue Manager',
    description: 'AI-powered email prioritization that automatically sorts inbox by urgency, importance, and business value.',
    category: 'Productivity',
    icon: '🎯',
    price: 39,
    features: [
      'Smart priority scoring (0-100)',
      'Urgency detection',
      'Importance analysis',
      'Business value assessment',
      'Queue position management',
      'Response time recommendations'
    ],
    benefits: [
      'Focus on what matters most',
      'Never miss critical emails',
      'Improve response times',
      'Reduce email overwhelm'
    ]
  },
  
  // V473 - Email Auto-Responder Intelligence
  {
    id: 'email-auto-responder-intelligence',
    name: 'Email Auto-Responder Intelligence',
    description: 'Smart out-of-office and auto-reply system with context-aware responses and intelligent routing.',
    category: 'Automation',
    icon: '🤖',
    price: 35,
    features: [
      'Context-aware auto-replies',
      'Business hours detection',
      'Vacation mode management',
      'Emergency escalation routing',
      'Professional response templates'
    ],
    benefits: [
      'Maintain professional communication 24/7',
      'Automatic emergency routing',
      'Customized responses by context',
      'Never leave customers without response'
    ]
  },
  
  // V474 - Email Integration Hub
  {
    id: 'email-integration-hub',
    name: 'Email Integration Hub',
    description: 'Connects email with CRM, project management, and business tools for seamless workflow automation.',
    category: 'Integration',
    icon: '🔗',
    price: 59,
    features: [
      'CRM synchronization',
      'Project management integration',
      'Task creation automation',
      'Webhook triggers',
      'Multi-platform support (Salesforce, Jira, Asana, etc.)'
    ],
    benefits: [
      'Eliminate manual data entry',
      'Seamless workflow automation',
      'Connect all business tools',
      'Save hours of repetitive work'
    ]
  },
  
  // V475 - Email Compliance Checker
  {
    id: 'email-compliance-checker',
    name: 'Email Compliance Checker',
    description: 'Real-time email compliance validation for GDPR, HIPAA, PCI-DSS, SOX, and other regulations.',
    category: 'Security & Compliance',
    icon: '🛡️',
    price: 79,
    features: [
      'PII detection and redaction',
      'Multi-framework compliance (GDPR, HIPAA, PCI-DSS, SOX, CCPA)',
      'Compliance scoring (0-100)',
      'Auto-redaction recommendations',
      'Audit trail generation',
      'External recipient warnings'
    ],
    benefits: [
      'Avoid compliance violations',
      'Protect sensitive data',
      'Maintain audit trails',
      'Reduce legal risk',
      'Automated compliance checking'
    ]
  }
];

// Add new services
let addedCount = 0;
newServices.forEach(newService => {
  const exists = services.some(s => s.id === newService.id);
  if (!exists) {
    services.push(newService);
    addedCount++;
    console.log(`✓ Added: ${newService.name}`);
  } else {
    console.log(`- Skipped (already exists): ${newService.name}`);
  }
});

// Write back to file
try {
  fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2), 'utf8');
  console.log(`\n✅ Successfully added ${addedCount} new services`);
  console.log(`📊 Total services: ${services.length}`);
} catch (error) {
  console.error('Error writing services file:', error.message);
  process.exit(1);
}

console.log('\n🎉 V471-V475 services added successfully!');
