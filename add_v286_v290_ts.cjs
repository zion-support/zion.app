// Add V286-V290 services to servicesData.ts
const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, 'app/data/servicesData.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

const newServices = [
  {
    id: 'v286-language-style-adapter',
    name: 'V286 Language Style Adapter',
    description: 'AI-powered email style adaptation that detects communication preferences and adjusts tone automatically',
    category: 'ai',
    price: 89,
    features: ['Style detection (formal/casual/technical)', 'Tone adaptation', 'Learning from communications', 'Reply-all enforcement'],
    icon: '🎨'
  },
  {
    id: 'v287-engagement-analytics',
    name: 'V287 Email Engagement Analytics',
    description: 'Comprehensive email performance tracking with A/B testing and optimal send time identification',
    category: 'data',
    price: 129,
    features: ['Open rate tracking', 'Response time analysis', 'A/B testing', 'Optimal send times', 'Reply-all enforcement'],
    icon: '📊'
  },
  {
    id: 'v288-security-sentinel',
    name: 'V288 Email Security Sentinel',
    description: 'Enterprise-grade email security with advanced phishing detection and malware protection',
    category: 'security',
    price: 199,
    features: ['Phishing detection', 'Malware scanning', 'SPF/DKIM/DMARC validation', 'Link analysis', 'Safe email reply-all'],
    icon: '🛡️'
  },
  {
    id: 'v289-auto-responder-ai',
    name: 'V289 Intelligent Auto-Responder',
    description: 'Context-aware automated email responses with smart escalation for complex inquiries',
    category: 'ai',
    price: 149,
    features: ['Context-aware responses', 'Routine inquiry handling', 'Smart escalation', 'Learning system', 'Reply-all enforcement'],
    icon: '🤖'
  },
  {
    id: 'v290-performance-predictor',
    name: 'V290 Email Performance Predictor',
    description: 'Pre-send email optimization with success prediction and improvement suggestions',
    category: 'ai',
    price: 159,
    features: ['Success prediction', 'Subject line optimization', 'Content improvement', 'Response forecasting', 'Reply-all enforcement'],
    icon: '📈'
  },
  {
    id: 'smart-meeting-scheduler',
    name: 'Smart Meeting Scheduler Pro',
    description: 'AI-powered meeting scheduling that finds optimal times across multiple timezones',
    category: 'micro-saas',
    price: 49,
    features: ['Multi-timezone support', 'Calendar integration', 'Conflict detection', 'Automated reminders', 'Reply-all for meeting invites'],
    icon: '📅'
  },
  {
    id: 'document-signature-hub',
    name: 'Document Signature Hub',
    description: 'Secure electronic signature platform with workflow automation and compliance tracking',
    category: 'micro-saas',
    price: 79,
    features: ['E-signatures', 'Workflow automation', 'Audit trails', 'Template library', 'Multi-party signing'],
    icon: '✍️'
  },
  {
    id: 'team-knowledge-base',
    name: 'Team Knowledge Base AI',
    description: 'AI-powered knowledge management that learns from team communications',
    category: 'micro-saas',
    price: 99,
    features: ['Auto-knowledge extraction', 'Smart search', 'Team collaboration', 'Version control', 'Email integration'],
    icon: '📚'
  },
  {
    id: 'cloud-infrastructure-monitor',
    name: 'Cloud Infrastructure Monitor Pro',
    description: 'Comprehensive cloud monitoring with predictive alerts and cost optimization',
    category: 'it',
    price: 299,
    features: ['Multi-cloud support', 'Predictive alerts', 'Cost optimization', 'Performance monitoring', 'Security scanning'],
    icon: '☁️'
  },
  {
    id: 'devops-automation-suite',
    name: 'DevOps Automation Suite',
    description: 'End-to-end DevOps automation with CI/CD pipelines and infrastructure as code',
    category: 'it',
    price: 399,
    features: ['CI/CD pipelines', 'Infrastructure as Code', 'Automated testing', 'Deployment automation', 'Monitoring integration'],
    icon: '⚙️'
  },
  {
    id: 'network-security-ops',
    name: 'Network Security Operations Center',
    description: '24/7 network security monitoring with threat detection and incident response',
    category: 'it',
    price: 599,
    features: ['24/7 monitoring', 'Threat detection', 'Incident response', 'Vulnerability scanning', 'Compliance reporting'],
    icon: '🔒'
  },
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator Pro',
    description: 'AI-powered content creation for marketing, documentation, and communications',
    category: 'ai',
    price: 179,
    features: ['Blog posts', 'Marketing copy', 'Documentation', 'Email campaigns', 'Multi-language support'],
    icon: '✏️'
  },
  {
    id: 'ai-data-analyst',
    name: 'AI Data Analyst',
    description: 'Automated data analysis and insights generation with natural language queries',
    category: 'ai',
    price: 249,
    features: ['Natural language queries', 'Automated insights', 'Data visualization', 'Predictive analytics', 'Report generation'],
    icon: '📊'
  },
  {
    id: 'ai-customer-support',
    name: 'AI Customer Support Assistant',
    description: 'Intelligent customer support with ticket routing and automated resolution',
    category: 'ai',
    price: 199,
    features: ['Ticket routing', 'Auto-resolution', 'Sentiment analysis', 'Knowledge base integration', 'Multi-channel support'],
    icon: '💬'
  },
  {
    id: 'invoice-automation',
    name: 'Invoice Automation Pro',
    description: 'Automated invoicing with smart payment reminders and accounting integration',
    category: 'micro-saas',
    price: 59,
    features: ['Auto-invoicing', 'Payment reminders', 'Accounting sync', 'Multi-currency', 'Tax calculation'],
    icon: '💰'
  },
  {
    id: 'project-time-tracker',
    name: 'Project Time Tracker AI',
    description: 'AI-powered time tracking with automatic categorization and project insights',
    category: 'micro-saas',
    price: 39,
    features: ['Auto time tracking', 'Project categorization', 'Productivity insights', 'Team analytics', 'Billing integration'],
    icon: '⏱️'
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager AI',
    description: 'AI-powered social media management with content scheduling and analytics',
    category: 'micro-saas',
    price: 89,
    features: ['Content scheduling', 'AI content generation', 'Analytics dashboard', 'Multi-platform', 'Engagement tracking'],
    icon: '📱'
  },
  {
    id: 'database-optimization',
    name: 'Database Optimization Service',
    description: 'Expert database performance tuning and optimization for MySQL, PostgreSQL, and MongoDB',
    category: 'it',
    price: 449,
    features: ['Performance tuning', 'Query optimization', 'Index analysis', 'Scaling strategy', '24/7 monitoring'],
    icon: '🗄️'
  },
  {
    id: 'api-management-platform',
    name: 'API Management Platform',
    description: 'Complete API lifecycle management with security, analytics, and developer portal',
    category: 'it',
    price: 349,
    features: ['API gateway', 'Security policies', 'Usage analytics', 'Developer portal', 'Rate limiting'],
    icon: '🔌'
  },
  {
    id: 'ai-video-analytics',
    name: 'AI Video Analytics Platform',
    description: 'Computer vision and video analytics for security, retail, and manufacturing',
    category: 'ai',
    price: 499,
    features: ['Object detection', 'People counting', 'Behavior analysis', 'Anomaly detection', 'Real-time alerts'],
    icon: '🎥'
  },
  {
    id: 'ai-translation-service',
    name: 'AI Translation Service Pro',
    description: 'Professional AI translation with human review for 100+ languages',
    category: 'ai',
    price: 129,
    features: ['100+ languages', 'Human review', 'Industry terminology', 'API access', 'Batch processing'],
    icon: '🌐'
  },
  {
    id: 'compliance-management',
    name: 'Compliance Management Platform',
    description: 'Automated compliance tracking for GDPR, HIPAA, SOC 2, and more',
    category: 'micro-saas',
    price: 299,
    features: ['Multi-framework support', 'Automated audits', 'Evidence collection', 'Risk assessment', 'Continuous monitoring'],
    icon: '✅'
  },
  {
    id: 'hr-automation-suite',
    name: 'HR Automation Suite',
    description: 'Complete HR workflow automation from hiring to offboarding',
    category: 'micro-saas',
    price: 199,
    features: ['Applicant tracking', 'Onboarding automation', 'Performance reviews', 'Time-off management', 'Document management'],
    icon: '👥'
  },
  {
    id: 'sales-pipeline-optimizer',
    name: 'Sales Pipeline Optimizer AI',
    description: 'AI-powered sales pipeline management with predictive analytics',
    category: 'ai',
    price: 279,
    features: ['Pipeline analytics', 'Deal prediction', 'Activity tracking', 'Email integration', 'Revenue forecasting'],
    icon: '🎯'
  },
  {
    id: 'backup-disaster-recovery',
    name: 'Backup & Disaster Recovery',
    description: 'Enterprise backup and disaster recovery with automated failover',
    category: 'it',
    price: 499,
    features: ['Automated backups', 'Disaster recovery', 'Failover automation', 'Data encryption', 'Compliance ready'],
    icon: '💾'
  },
  {
    id: 'email-marketing-automation',
    name: 'Email Marketing Automation Pro',
    description: 'Advanced email marketing with AI-powered personalization and analytics',
    category: 'ai',
    price: 149,
    features: ['Email campaigns', 'AI personalization', 'A/B testing', 'Analytics', 'Automation workflows'],
    icon: '📧'
  },
  {
    id: 'customer-feedback-platform',
    name: 'Customer Feedback Platform',
    description: 'Collect and analyze customer feedback with AI-powered insights',
    category: 'micro-saas',
    price: 119,
    features: ['Survey creation', 'NPS tracking', 'Sentiment analysis', 'Action items', 'Integration hub'],
    icon: '📝'
  },
  {
    id: 'it-asset-management',
    name: 'IT Asset Management Pro',
    description: 'Complete IT asset lifecycle management with automated discovery',
    category: 'it',
    price: 249,
    features: ['Asset discovery', 'Lifecycle management', 'License tracking', 'Cost optimization', 'Compliance reporting'],
    icon: '🏷️'
  }
];

// Find the end of the services array (before the closing bracket)
const lines = tsContent.split('\n');
let insertIndex = -1;

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '];') {
    insertIndex = i;
    break;
  }
}

if (insertIndex === -1) {
  console.error('Could not find services array closing bracket');
  process.exit(1);
}

// Generate TypeScript entries
const tsEntries = newServices.map(service => {
  const featuresStr = service.features.map(f => `    '${f}'`).join(',\n');
  return `  {
    id: '${service.id}',
    name: '${service.name}',
    description: '${service.description}',
    category: '${service.category}',
    price: ${service.price},
    features: [
${featuresStr}
    ],
    icon: '${service.icon}',
    contactInfo: {
      phone: '+1 302 464 0950',
      email: 'kleber@ziontechgroup.com',
      address: '364 E Main St STE 1008, Middletown DE 19709'
    }
  }`;
}).join(',\n');

// Insert before the closing bracket
lines.splice(insertIndex, 0, tsEntries + ',');

// Write back
fs.writeFileSync(tsPath, lines.join('\n'));

console.log(`Added ${newServices.length} services to TypeScript file`);
