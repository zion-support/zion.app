const fs = require('fs');

// Read existing services
const servicesPath = 'app/data/servicesData.json';
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const contactInfo = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown DE 19709'
};

const newServices = [
  // V281-V285 Email Intelligence
  {
    id: 'email-sentiment-evolution-v281',
    name: 'Email Sentiment Evolution Tracker V281',
    description: 'Track sentiment changes throughout email threads with mood shift detection and conversation outcome prediction',
    category: 'email-intelligence',
    price: 199,
    icon: '🧠',
    features: ['Sentiment tracking', 'Mood shift detection', 'Outcome prediction', 'Reply-all enforcement']
  },
  {
    id: 'sentiment-analysis-platform',
    name: 'Sentiment Analysis Platform',
    description: 'Analyze emotional tone and sentiment in customer communications with AI-powered insights',
    category: 'ai',
    price: 159,
    icon: '💭',
    features: ['Real-time analysis', 'Emotion detection', 'Trend tracking', 'Customer insights']
  },
  {
    id: 'conversation-outcome-predictor',
    name: 'Conversation Outcome Predictor',
    description: 'Predict email conversation outcomes based on sentiment patterns and engagement signals',
    category: 'ai',
    price: 179,
    icon: '🔮',
    features: ['ML predictions', 'Pattern recognition', 'Success probability', 'Early warnings']
  },
  {
    id: 'emotional-escalation-detector',
    name: 'Emotional Escalation Detector',
    description: 'Detect emotional escalation in email threads and trigger proactive intervention',
    category: 'automation',
    price: 139,
    icon: '⚠️',
    features: ['Escalation detection', 'Early warnings', 'Intervention triggers', 'Trend analysis']
  },
  {
    id: 'customer-mood-analytics',
    name: 'Customer Mood Analytics',
    description: 'Track and analyze customer mood across all communication channels',
    category: 'data',
    price: 229,
    icon: '📊',
    features: ['Multi-channel tracking', 'Mood scoring', 'Historical trends', 'Team dashboards']
  },
  
  // V282 Compliance Guardian Pro
  {
    id: 'compliance-guardian-pro-v282',
    name: 'Email Compliance Guardian Pro V282',
    description: 'Real-time compliance checking for GDPR, HIPAA, SOX, CCPA with auto-redaction and audit trails',
    category: 'email-intelligence',
    price: 299,
    icon: '⚖️',
    features: ['Multi-framework compliance', 'Auto-redaction', 'Audit trails', 'Reply-all enforcement']
  },
  {
    id: 'gdpr-compliance-automator',
    name: 'GDPR Compliance Automator',
    description: 'Automate GDPR compliance with data detection, consent tracking, and right-to-erasure workflows',
    category: 'compliance',
    price: 399,
    icon: '🇪🇺',
    features: ['Data detection', 'Consent tracking', 'Erasure workflows', 'Audit logging']
  },
  {
    id: 'hipaa-email-guardian',
    name: 'HIPAA Email Guardian',
    description: 'Protect PHI in emails with automatic detection, encryption, and BAA-compliant handling',
    category: 'compliance',
    price: 449,
    icon: '🏥',
    features: ['PHI detection', 'Auto-encryption', 'BAA compliance', 'Audit trails']
  },
  {
    id: 'sox-financial-compliance',
    name: 'SOX Financial Compliance Suite',
    description: 'Ensure SOX compliance in financial communications with retention policies and audit controls',
    category: 'compliance',
    price: 499,
    icon: '💰',
    features: ['Financial data detection', '7-year retention', 'Audit controls', 'Access logging']
  },
  {
    id: 'ccpa-privacy-protector',
    name: 'CCPA Privacy Protector',
    description: 'Protect California consumer privacy with automated CCPA compliance and data subject rights',
    category: 'compliance',
    price: 349,
    icon: '🌴',
    features: ['Privacy detection', 'Opt-out management', 'Data deletion', 'Disclosure tracking']
  },
  
  // V283 Knowledge Graph Builder
  {
    id: 'knowledge-graph-builder-v283',
    name: 'Email Knowledge Graph Builder V283',
    description: 'Build knowledge graphs from email conversations with relationship mapping and semantic search',
    category: 'email-intelligence',
    price: 249,
    icon: '🕸️',
    features: ['Entity extraction', 'Relationship mapping', 'Semantic search', 'Reply-all enforcement']
  },
  {
    id: 'organizational-knowledge-map',
    name: 'Organizational Knowledge Map',
    description: 'Map organizational knowledge and expertise from email communications',
    category: 'ai',
    price: 279,
    icon: '🗺️',
    features: ['Expertise mapping', 'Knowledge discovery', 'Skill identification', 'Team insights']
  },
  {
    id: 'project-relationship-tracker',
    name: 'Project Relationship Tracker',
    description: 'Track project relationships, dependencies, and stakeholder connections from emails',
    category: 'micro-saas',
    price: 189,
    icon: '🔗',
    features: ['Project mapping', 'Dependency tracking', 'Stakeholder analysis', 'Timeline visualization']
  },
  {
    id: 'semantic-email-search',
    name: 'Semantic Email Search Engine',
    description: 'Search emails by meaning and context, not just keywords',
    category: 'ai',
    price: 199,
    icon: '🔍',
    features: ['Semantic search', 'Context understanding', 'Relevance ranking', 'Natural language queries']
  },
  {
    id: 'email-knowledge-base',
    name: 'Email Knowledge Base Generator',
    description: 'Automatically generate knowledge base articles from email conversations',
    category: 'automation',
    price: 169,
    icon: '📚',
    features: ['Auto-generation', 'FAQ extraction', 'Article creation', 'Knowledge organization']
  },
  
  // V284 Priority Decay Engine
  {
    id: 'priority-decay-engine-v284',
    name: 'Email Priority Decay Engine V284',
    description: 'Dynamic priority adjustment with automatic escalation for aging emails',
    category: 'email-intelligence',
    price: 179,
    icon: '⏰',
    features: ['Priority decay', 'Auto-escalation', 'Reminder generation', 'Reply-all enforcement']
  },
  {
    id: 'smart-priority-manager',
    name: 'Smart Priority Manager',
    description: 'Intelligently manage email priorities based on context, urgency, and business impact',
    category: 'automation',
    price: 149,
    icon: '🎯',
    features: ['Context-aware prioritization', 'Business impact scoring', 'Dynamic adjustment', 'Priority rules']
  },
  {
    id: 'email-aging-monitor',
    name: 'Email Aging Monitor',
    description: 'Monitor email age and trigger actions for emails that need attention',
    category: 'micro-saas',
    price: 99,
    icon: '⏳',
    features: ['Age tracking', 'Escalation rules', 'Reminder scheduling', 'Dashboard alerts']
  },
  {
    id: 'executive-email-prioritizer',
    name: 'Executive Email Prioritizer',
    description: 'Prioritize executive emails based on sender importance and business context',
    category: 'ai',
    price: 249,
    icon: '👔',
    features: ['VIP detection', 'Context scoring', 'Priority boost', 'Executive workflows']
  },
  {
    id: 'deadline-aware-scheduler',
    name: 'Deadline-Aware Email Scheduler',
    description: 'Schedule email responses based on deadlines and time sensitivity',
    category: 'automation',
    price: 129,
    icon: '📅',
    features: ['Deadline detection', 'Time-based scheduling', 'Urgency routing', 'Calendar integration']
  },
  
  // V285 Intelligence Orchestrator
  {
    id: 'intelligence-orchestrator-v285',
    name: 'Email Intelligence Orchestrator V285',
    description: 'Coordinate multiple email engines with intelligent routing and unified intelligence',
    category: 'email-intelligence',
    price: 399,
    icon: '🎭',
    features: ['Multi-engine coordination', 'Intelligent routing', 'Unified dashboard', 'Reply-all enforcement']
  },
  {
    id: 'email-processing-pipeline',
    name: 'Email Processing Pipeline',
    description: 'Build custom email processing pipelines with multiple AI engines',
    category: 'automation',
    price: 329,
    icon: '⚙️',
    features: ['Visual pipeline builder', 'Engine chaining', 'Conditional logic', 'Performance monitoring']
  },
  {
    id: 'unified-email-dashboard',
    name: 'Unified Email Intelligence Dashboard',
    description: 'Single dashboard for all email intelligence metrics and insights',
    category: 'data',
    price: 299,
    icon: '📊',
    features: ['Real-time metrics', 'Custom widgets', 'Team insights', 'Export capabilities']
  },
  {
    id: 'intelligent-email-router',
    name: 'Intelligent Email Router',
    description: 'Route emails to optimal processing engines based on content and context',
    category: 'ai',
    price: 259,
    icon: '🔀',
    features: ['Content analysis', 'Context routing', 'Load balancing', 'Performance optimization']
  },
  {
    id: 'email-orchestration-platform',
    name: 'Email Orchestration Platform',
    description: 'Enterprise platform for orchestrating email intelligence at scale',
    category: 'integration',
    price: 599,
    icon: '🏗️',
    features: ['Enterprise scale', 'Multi-tenant', 'API access', 'Custom integrations']
  },
  
  // Additional services
  {
    id: 'email-thread-analyzer',
    name: 'Email Thread Analyzer',
    description: 'Analyze email threads for key decisions, action items, and conversation flow',
    category: 'ai',
    price: 149,
    icon: '🧵',
    features: ['Thread visualization', 'Decision extraction', 'Action items', 'Flow analysis']
  },
  {
    id: 'email-response-quality-scorer',
    name: 'Email Response Quality Scorer',
    description: 'Score email response quality based on completeness, clarity, and professionalism',
    category: 'ai',
    price: 119,
    icon: '⭐',
    features: ['Quality scoring', 'Improvement suggestions', 'Benchmarking', 'Team analytics']
  }
];

// Add contact info to all new services
newServices.forEach(service => {
  service.contactInfo = contactInfo;
});

// Add new services to existing array
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`✅ Added ${newServices.length} new services. Total: ${services.length}`);
