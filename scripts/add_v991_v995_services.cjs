const fs = require('fs');
const path = require('path');

// V991-V995 New Services
const newServices = [
  // V991 - DNA Fingerprinting (6 services)
  {
    id: 'dna-duplicate-detector',
    name: 'DNA Duplicate Detector',
    description: 'Detects duplicate emails using SHA-256 content fingerprinting and fuzzy matching algorithms',
    category: 'Email Security',
    price: '$15/month',
    features: [
      'SHA-256 content hashing',
      'Fuzzy matching for similar content',
      'Automatic duplicate flagging',
      'Duplicate statistics tracking',
      'Configurable similarity threshold'
    ],
    badge: 'V991'
  },
  {
    id: 'dna-forgery-analyzer',
    name: 'DNA Forgery Analyzer',
    description: 'Analyzes email structure and metadata patterns to detect potential forgeries and spoofed messages',
    category: 'Email Security',
    price: '$25/month',
    features: [
      'Header integrity verification',
      'Sender authentication checks',
      'Metadata pattern analysis',
      'Forgery risk scoring',
      'Suspicious indicator alerts'
    ],
    badge: 'V991'
  },
  {
    id: 'dna-lineage-tracker',
    name: 'DNA Lineage Tracker',
    description: 'Traces email thread lineage and conversation ancestry using DNA fingerprint relationships',
    category: 'Email Management',
    price: '$20/month',
    features: [
      'Thread ancestry mapping',
      'Conversation tree visualization',
      'Reply chain tracking',
      'Fork detection',
      'Lineage reports'
    ],
    badge: 'V991'
  },
  {
    id: 'dna-content-authenticator',
    name: 'DNA Content Authenticator',
    description: 'Verifies email content authenticity using digital fingerprinting and integrity checks',
    category: 'Email Security',
    price: '$22/month',
    features: [
      'Content integrity verification',
      'Tamper detection',
      'Authenticity scoring',
      'Digital signature support',
      'Verification certificates'
    ],
    badge: 'V991'
  },
  {
    id: 'dna-similarity-search',
    name: 'DNA Similarity Search',
    description: 'Search for similar emails across your inbox using DNA fingerprint similarity algorithms',
    category: 'Email Search',
    price: '$18/month',
    features: [
      'Similarity-based search',
      'Fuzzy content matching',
      'Related email discovery',
      'Similarity scoring',
      'Batch similarity analysis'
    ],
    badge: 'V991'
  },
  {
    id: 'dna-fingerprint-dashboard',
    name: 'DNA Fingerprint Dashboard',
    description: 'Comprehensive dashboard for email DNA fingerprint statistics, duplicates, and security insights',
    category: 'Email Analytics',
    price: '$28/month',
    features: [
      'Fingerprint statistics',
      'Duplicate trends',
      'Security alerts',
      'Forgery detection reports',
      'Historical analysis'
    ],
    badge: 'V991'
  },

  // V992 - Flow Optimizer (6 services)
  {
    id: 'flow-efficiency-analyzer',
    name: 'Flow Efficiency Analyzer',
    description: 'Analyzes email flow patterns and identifies bottlenecks to optimize response times',
    category: 'Email Productivity',
    price: '$20/month',
    features: [
      'Flow pattern analysis',
      'Bottleneck identification',
      'Efficiency scoring',
      'Response time tracking',
      'Optimization recommendations'
    ],
    badge: 'V992'
  },
  {
    id: 'flow-batch-processor',
    name: 'Flow Batch Processor',
    description: 'Intelligently batches similar emails for efficient bulk processing and response',
    category: 'Email Productivity',
    price: '$18/month',
    features: [
      'Smart batching algorithms',
      'Similarity-based grouping',
      'Batch processing workflows',
      'Priority-aware batching',
      'Batch statistics'
    ],
    badge: 'V992'
  },
  {
    id: 'flow-congestion-monitor',
    name: 'Flow Congestion Monitor',
    description: 'Monitors email flow congestion and provides real-time alerts when bottlenecks occur',
    category: 'Email Management',
    price: '$22/month',
    features: [
      'Real-time congestion detection',
      'Bottleneck alerts',
      'Flow rate monitoring',
      'Congestion reports',
      'Automatic escalation'
    ],
    badge: 'V992'
  },
  {
    id: 'flow-routing-optimizer',
    name: 'Flow Routing Optimizer',
    description: 'Optimizes email routing paths to reduce latency and improve delivery efficiency',
    category: 'Email Management',
    price: '$25/month',
    features: [
      'Route optimization',
      'Latency reduction',
      'Path analysis',
      'Routing rules',
      'Performance metrics'
    ],
    badge: 'V992'
  },
  {
    id: 'flow-predictive-scheduler',
    name: 'Flow Predictive Scheduler',
    description: 'Predicts optimal times for email processing based on historical flow patterns',
    category: 'Email Productivity',
    price: '$24/month',
    features: [
      'Pattern-based prediction',
      'Optimal timing suggestions',
      'Workload balancing',
      'Schedule optimization',
      'Predictive analytics'
    ],
    badge: 'V992'
  },
  {
    id: 'flow-analytics-suite',
    name: 'Flow Analytics Suite',
    description: 'Comprehensive analytics suite for email flow metrics, trends, and performance insights',
    category: 'Email Analytics',
    price: '$30/month',
    features: [
      'Flow metrics dashboard',
      'Trend analysis',
      'Performance reports',
      'Custom analytics',
      'Export capabilities'
    ],
    badge: 'V992'
  },

  // V993 - Email Coaching (6 services)
  {
    id: 'coaching-tone-analyzer',
    name: 'Coaching Tone Analyzer',
    description: 'Analyzes email tone and provides coaching to improve communication effectiveness',
    category: 'Email Intelligence',
    price: '$18/month',
    features: [
      'Tone detection',
      'Sentiment analysis',
      'Tone improvement suggestions',
      'Professional tone coaching',
      'Tone consistency checks'
    ],
    badge: 'V993'
  },
  {
    id: 'coaching-clarity-coach',
    name: 'Clarity Coach',
    description: 'Coaches users to write clearer, more concise emails with actionable improvement suggestions',
    category: 'Email Intelligence',
    price: '$20/month',
    features: [
      'Clarity scoring',
      'Conciseness analysis',
      'Improvement suggestions',
      'Readability metrics',
      'Writing tips'
    ],
    badge: 'V993'
  },
  {
    id: 'coaching-persuasion-advisor',
    name: 'Persuasion Advisor',
    description: 'Provides coaching on persuasive writing techniques to improve email effectiveness',
    category: 'Email Intelligence',
    price: '$22/month',
    features: [
      'Persuasion scoring',
      'Technique identification',
      'Improvement coaching',
      'Call-to-action analysis',
      'Impact optimization'
    ],
    badge: 'V993'
  },
  {
    id: 'coaching-professionalism-checker',
    name: 'Professionalism Checker',
    description: 'Checks emails for professional standards and provides coaching on business etiquette',
    category: 'Email Intelligence',
    price: '$16/month',
    features: [
      'Professionalism scoring',
      'Etiquette checks',
      'Formality analysis',
      'Improvement suggestions',
      'Business writing tips'
    ],
    badge: 'V993'
  },
  {
    id: 'coaching-empathy-trainer',
    name: 'Empathy Trainer',
    description: 'Trains users to write more empathetic emails with emotional intelligence coaching',
    category: 'Email Intelligence',
    price: '$21/month',
    features: [
      'Empathy scoring',
      'Emotional intelligence analysis',
      'Empathy improvement tips',
      'Tone matching',
      'Relationship building'
    ],
    badge: 'V993'
  },
  {
    id: 'coaching-writing-improvement-tracker',
    name: 'Writing Improvement Tracker',
    description: 'Tracks writing improvement over time with personalized coaching insights and progress metrics',
    category: 'Email Analytics',
    price: '$25/month',
    features: [
      'Progress tracking',
      'Improvement metrics',
      'Personalized insights',
      'Goal setting',
      'Achievement badges'
    ],
    badge: 'V993'
  },

  // V994 - Predictive Router (6 services)
  {
    id: 'router-expertise-matcher',
    name: 'Expertise Matcher',
    description: 'Matches emails to team members based on expertise analysis and historical performance',
    category: 'Email Routing',
    price: '$24/month',
    features: [
      'Expertise analysis',
      'Skill matching',
      'Performance tracking',
      'Automatic assignment',
      'Matching accuracy reports'
    ],
    badge: 'V994'
  },
  {
    id: 'router-workload-balancer',
    name: 'Workload Balancer',
    description: 'Balances email assignments across team members based on current workload and capacity',
    category: 'Email Routing',
    price: '$22/month',
    features: [
      'Workload analysis',
      'Capacity tracking',
      'Balanced assignments',
      'Overload prevention',
      'Team utilization metrics'
    ],
    badge: 'V994'
  },
  {
    id: 'router-priority-aware-assigner',
    name: 'Priority-Aware Assigner',
    description: 'Assigns emails based on priority levels and team member availability and expertise',
    category: 'Email Routing',
    price: '$20/month',
    features: [
      'Priority-based routing',
      'Availability checking',
      'Smart assignment',
      'Escalation rules',
      'Priority reports'
    ],
    badge: 'V994'
  },
  {
    id: 'router-team-performance-analyzer',
    name: 'Team Performance Analyzer',
    description: 'Analyzes team performance metrics to optimize email routing and improve response times',
    category: 'Email Analytics',
    price: '$28/month',
    features: [
      'Performance metrics',
      'Response time analysis',
      'Team efficiency reports',
      'Bottleneck identification',
      'Optimization suggestions'
    ],
    badge: 'V994'
  },
  {
    id: 'router-intelligent-escalation',
    name: 'Intelligent Escalation',
    description: 'Automatically escalates emails based on priority, complexity, and response time thresholds',
    category: 'Email Routing',
    price: '$26/month',
    features: [
      'Automatic escalation',
      'Priority-based rules',
      'Time-based escalation',
      'Escalation paths',
      'Escalation reports'
    ],
    badge: 'V994'
  },
  {
    id: 'router-routing-analytics',
    name: 'Routing Analytics',
    description: 'Comprehensive analytics for email routing performance, accuracy, and team efficiency',
    category: 'Email Analytics',
    price: '$30/month',
    features: [
      'Routing metrics',
      'Accuracy tracking',
      'Efficiency reports',
      'Custom dashboards',
      'Export capabilities'
    ],
    badge: 'V994'
  },

  // V995 - Workflow Builder (6 services)
  {
    id: 'workflow-visual-builder',
    name: 'Visual Workflow Builder',
    description: 'Drag-and-drop visual interface for building automated email workflows without coding',
    category: 'Email Automation',
    price: '$35/month',
    features: [
      'Visual workflow editor',
      'Drag-and-drop interface',
      'Pre-built templates',
      'Workflow testing',
      'Version control'
    ],
    badge: 'V995'
  },
  {
    id: 'workflow-template-library',
    name: 'Workflow Template Library',
    description: 'Library of pre-built workflow templates for common email automation scenarios',
    category: 'Email Automation',
    price: '$25/month',
    features: [
      'Template library',
      'Customizable templates',
      'Industry-specific templates',
      'Template sharing',
      'Template ratings'
    ],
    badge: 'V995'
  },
  {
    id: 'workflow-conditional-logic',
    name: 'Conditional Logic Engine',
    description: 'Advanced conditional logic engine for complex email workflow automation',
    category: 'Email Automation',
    price: '$30/month',
    features: [
      'Conditional branching',
      'Complex logic rules',
      'Variable support',
      'Logic testing',
      'Debug tools'
    ],
    badge: 'V995'
  },
  {
    id: 'workflow-execution-monitor',
    name: 'Workflow Execution Monitor',
    description: 'Real-time monitoring and analytics for email workflow execution and performance',
    category: 'Email Automation',
    price: '$28/month',
    features: [
      'Real-time monitoring',
      'Execution logs',
      'Performance metrics',
      'Error tracking',
      'Alert notifications'
    ],
    badge: 'V995'
  },
  {
    id: 'workflow-integration-hub',
    name: 'Workflow Integration Hub',
    description: 'Integration hub for connecting email workflows with external systems and services',
    category: 'Email Automation',
    price: '$32/month',
    features: [
      'API integrations',
      'Webhook support',
      'Third-party connections',
      'Custom integrations',
      'Integration testing'
    ],
    badge: 'V995'
  },
  {
    id: 'workflow-optimization-advisor',
    name: 'Workflow Optimization Advisor',
    description: 'AI-powered advisor that analyzes workflows and suggests optimizations for better performance',
    category: 'Email Automation',
    price: '$38/month',
    features: [
      'Workflow analysis',
      'Optimization suggestions',
      'Performance recommendations',
      'Bottleneck detection',
      'Efficiency scoring'
    ],
    badge: 'V995'
  }
];

// Load existing services
const servicesPath = path.join(__dirname, '..', 'app', 'data', 'servicesData.json');
let services = [];

try {
  const existing = fs.readFileSync(servicesPath, 'utf8');
  services = JSON.parse(existing);
  console.log(`Loaded ${services.length} existing services`);
} catch (e) {
  console.log('No existing services file, starting fresh');
}

// Add new services (check for duplicates)
let added = 0;
newServices.forEach(newService => {
  const exists = services.some(s => s.id === newService.id);
  if (!exists) {
    services.push(newService);
    added++;
    console.log(`Added: ${newService.name}`);
  } else {
    console.log(`Skipped (exists): ${newService.name}`);
  }
});

// Save updated services
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log(`\n✅ Added ${added} new services. Total: ${services.length}`);
