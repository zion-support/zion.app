const fs = require('fs');
const path = require('path');

const servicesDataPath = path.join(__dirname, '..', 'app', 'data', 'servicesData.ts');
let content = fs.readFileSync(servicesDataPath, 'utf8');

const newServices = [
  // V1016 - Email Design Optimizer Services
  {
    id: 'email-design-optimizer',
    name: 'Email Design Optimizer',
    category: 'Email Intelligence',
    description: 'AI-powered email design analysis that optimizes HTML/CSS layout, colors, fonts, and responsive design for maximum engagement.',
    price: 89,
    features: ['Responsive design check', 'Accessibility compliance', 'Font optimization', 'CTA analysis', 'Mobile optimization'],
    benefits: ['+15% mobile engagement', '+10% accessibility', '+25% click-through rate'],
    icon: '🎨'
  },
  {
    id: 'email-accessibility-audit',
    name: 'Email Accessibility Audit',
    category: 'Email Intelligence',
    description: 'Comprehensive accessibility audit ensuring emails meet WCAG standards and work with screen readers.',
    price: 129,
    features: ['WCAG compliance', 'Screen reader testing', 'Alt text optimization', 'Color contrast check', 'Keyboard navigation'],
    benefits: ['ADA compliance', '+20% reach', 'Legal protection'],
    icon: '♿'
  },
  {
    id: 'responsive-email-builder',
    name: 'Responsive Email Builder',
    category: 'Email Intelligence',
    description: 'Build mobile-optimized emails with AI assistance that adapt perfectly to all screen sizes.',
    price: 149,
    features: ['Mobile-first design', 'Auto-responsive layouts', 'Cross-client testing', 'Preview on 50+ devices', 'Template library'],
    benefits: ['Perfect mobile display', '+30% mobile engagement', 'Save 5 hours/week'],
    icon: '📱'
  },
  {
    id: 'email-cta-optimizer',
    name: 'Email CTA Optimizer',
    category: 'Email Intelligence',
    description: 'AI analyzes and optimizes call-to-action buttons for maximum click-through rates.',
    price: 79,
    features: ['CTA placement analysis', 'Color optimization', 'Text optimization', 'A/B testing', 'Heat map analysis'],
    benefits: ['+40% CTR', 'Higher conversions', 'Data-driven decisions'],
    icon: '🎯'
  },
  {
    id: 'email-rendering-tester',
    name: 'Email Rendering Tester',
    category: 'Email Intelligence',
    description: 'Test how emails render across 50+ email clients and devices before sending.',
    price: 99,
    features: ['50+ client testing', 'Screenshot comparison', 'Issue detection', 'Fix suggestions', 'Automated testing'],
    benefits: ['Perfect rendering', 'Fewer support tickets', 'Professional appearance'],
    icon: '🖥️'
  },

  // V1017 - Smart Scheduling Assistant Services
  {
    id: 'smart-scheduling-assistant',
    name: 'Smart Scheduling Assistant',
    category: 'Email Intelligence',
    description: 'AI finds optimal meeting times across timezones, checks calendar availability, and sends invites automatically.',
    price: 119,
    features: ['Timezone intelligence', 'Calendar integration', 'Auto-scheduling', 'Conflict resolution', 'Smart suggestions'],
    benefits: ['Eliminate back-and-forth', 'Save 3 hours/week', 'Perfect timing'],
    icon: '📅'
  },
  {
    id: 'meeting-coordinator-pro',
    name: 'Meeting Coordinator Pro',
    category: 'Email Intelligence',
    description: 'Coordinate complex multi-person meetings with intelligent scheduling and conflict resolution.',
    price: 159,
    features: ['Multi-timezone support', 'Availability matching', 'Priority scheduling', 'Auto-rescheduling', 'Reminder system'],
    benefits: ['90% less scheduling time', 'Zero conflicts', 'Happy participants'],
    icon: '🤝'
  },
  {
    id: 'calendar-intelligence',
    name: 'Calendar Intelligence',
    category: 'Email Intelligence',
    description: 'AI analyzes calendar patterns to suggest optimal meeting times and protect focus time.',
    price: 99,
    features: ['Pattern analysis', 'Focus time protection', 'Meeting optimization', 'Energy level matching', 'Productivity insights'],
    benefits: ['+25% productivity', 'Better work-life balance', 'Optimal meeting times'],
    icon: '🧠'
  },
  {
    id: 'timezone-meeting-optimizer',
    name: 'Timezone Meeting Optimizer',
    category: 'Email Intelligence',
    description: 'Find the perfect meeting time for global teams across multiple timezones.',
    price: 89,
    features: ['Global timezone support', 'Fair rotation', 'Working hours respect', 'Auto-suggestions', 'Visual timeline'],
    benefits: ['Global team harmony', 'Respect work-life balance', 'Perfect timing'],
    icon: '🌍'
  },
  {
    id: 'meeting-agenda-generator',
    name: 'Meeting Agenda Generator',
    category: 'Email Intelligence',
    description: 'AI generates structured meeting agendas based on participants, context, and goals.',
    price: 69,
    features: ['Auto-agenda creation', 'Context awareness', 'Time allocation', 'Action item tracking', 'Follow-up generation'],
    benefits: ['Productive meetings', 'Clear objectives', 'Accountability'],
    icon: '📋'
  },

  // V1018 - Email Search Intelligence Services
  {
    id: 'email-search-intelligence',
    name: 'Email Search Intelligence',
    category: 'Email Intelligence',
    description: 'Semantic search across all emails with AI understanding context, not just keywords.',
    price: 139,
    features: ['Semantic search', 'Natural language queries', 'Context understanding', 'Smart filtering', 'Instant results'],
    benefits: ['Find any email in seconds', '90% time savings', 'Never lose important info'],
    icon: '🔍'
  },
  {
    id: 'email-knowledge-base',
    name: 'Email Knowledge Base',
    category: 'Email Intelligence',
    description: 'Transform emails into a searchable knowledge base with AI-powered organization.',
    price: 179,
    features: ['Auto-categorization', 'Knowledge extraction', 'Smart tagging', 'Relationship mapping', 'Quick retrieval'],
    benefits: ['Organized knowledge', 'Team collaboration', 'Institutional memory'],
    icon: '📚'
  },
  {
    id: 'email-thread-summarizer',
    name: 'Email Thread Summarizer',
    category: 'Email Intelligence',
    description: 'AI summarizes long email threads into key points, decisions, and action items.',
    price: 89,
    features: ['Thread analysis', 'Key point extraction', 'Decision tracking', 'Action items', 'Quick summaries'],
    benefits: ['Save 2 hours/day', 'Never miss decisions', 'Quick catch-up'],
    icon: '📝'
  },
  {
    id: 'email-attachment-search',
    name: 'Email Attachment Search',
    category: 'Email Intelligence',
    description: 'Search inside email attachments (PDFs, docs, images) with AI-powered content extraction.',
    price: 119,
    features: ['Content extraction', 'OCR for images', 'Full-text search', 'Smart filtering', 'Preview generation'],
    benefits: ['Find hidden content', 'Search attachments', 'Complete visibility'],
    icon: '📎'
  },
  {
    id: 'email-timeline-view',
    name: 'Email Timeline View',
    category: 'Email Intelligence',
    description: 'Visualize email conversations and projects on an interactive timeline.',
    price: 99,
    features: ['Visual timeline', 'Project tracking', 'Conversation flow', 'Milestone marking', 'Export capabilities'],
    benefits: ['Clear project history', 'Better tracking', 'Easy reporting'],
    icon: '📊'
  },

  // V1019 - Email ROI Tracker Services
  {
    id: 'email-roi-tracker',
    name: 'Email ROI Tracker',
    category: 'Email Intelligence',
    description: 'Track revenue generated from email campaigns, calculate ROI, and optimize for profitability.',
    price: 199,
    features: ['Revenue tracking', 'ROI calculation', 'Campaign analytics', 'Conversion tracking', 'Profitability insights'],
    benefits: ['Prove email value', 'Optimize spend', 'Maximize ROI'],
    icon: '💰'
  },
  {
    id: 'email-attribution-engine',
    name: 'Email Attribution Engine',
    category: 'Email Intelligence',
    description: 'Attribute revenue and conversions to specific email campaigns with multi-touch attribution.',
    price: 229,
    features: ['Multi-touch attribution', 'Revenue mapping', 'Campaign performance', 'Customer journey', 'ROI optimization'],
    benefits: ['Accurate attribution', 'Better decisions', 'Maximize revenue'],
    icon: '🎯'
  },
  {
    id: 'email-campaign-analytics',
    name: 'Email Campaign Analytics',
    category: 'Email Intelligence',
    description: 'Comprehensive analytics for email campaigns with actionable insights and recommendations.',
    price: 169,
    features: ['Advanced metrics', 'Performance tracking', 'A/B test analysis', 'Segment performance', 'Predictive insights'],
    benefits: ['Data-driven decisions', 'Continuous improvement', 'Higher ROI'],
    icon: '📈'
  },
  {
    id: 'email-revenue-dashboard',
    name: 'Email Revenue Dashboard',
    category: 'Email Intelligence',
    description: 'Real-time dashboard showing email-driven revenue, conversions, and business impact.',
    price: 189,
    features: ['Real-time tracking', 'Revenue visualization', 'Goal monitoring', 'Trend analysis', 'Custom reports'],
    benefits: ['Instant insights', 'Track goals', 'Prove value'],
    icon: '📊'
  },
  {
    id: 'email-cost-optimizer',
    name: 'Email Cost Optimizer',
    category: 'Email Intelligence',
    description: 'Analyze email marketing costs and optimize spend for maximum ROI.',
    price: 149,
    features: ['Cost analysis', 'Spend optimization', 'Budget allocation', 'Efficiency metrics', 'Waste reduction'],
    benefits: ['Reduce costs 20%', 'Better allocation', 'Higher efficiency'],
    icon: '💵'
  },

  // V1020 - Email Security Guardian Services
  {
    id: 'email-security-guardian',
    name: 'Email Security Guardian',
    category: 'Email Intelligence',
    description: 'Enterprise-grade email security with advanced phishing detection, malware scanning, and data loss prevention.',
    price: 249,
    features: ['Phishing detection', 'Malware scanning', 'Link verification', 'Spoofing protection', 'Data loss prevention'],
    benefits: ['Block 99.9% threats', 'Protect data', 'Enterprise security'],
    icon: '🛡️'
  },
  {
    id: 'phishing-detection-pro',
    name: 'Phishing Detection Pro',
    category: 'Email Intelligence',
    description: 'Advanced AI-powered phishing detection that catches sophisticated attacks before they reach users.',
    price: 199,
    features: ['AI detection', 'Pattern recognition', 'Real-time scanning', 'Threat intelligence', 'Zero-day protection'],
    benefits: ['99.9% detection rate', 'Zero breaches', 'Peace of mind'],
    icon: '🎣'
  },
  {
    id: 'email-malware-scanner',
    name: 'Email Malware Scanner',
    category: 'Email Intelligence',
    description: 'Scan all email attachments for malware, viruses, and malicious code with AI-powered detection.',
    price: 179,
    features: ['Attachment scanning', 'Sandbox analysis', 'Virus detection', 'Zero-day protection', 'Quarantine system'],
    benefits: ['100% protection', 'No infections', 'Safe attachments'],
    icon: '🦠'
  },
  {
    id: 'email-dlp-solution',
    name: 'Email DLP Solution',
    category: 'Email Intelligence',
    description: 'Data Loss Prevention for emails - detect and block sensitive data from leaving via email.',
    price: 269,
    features: ['Sensitive data detection', 'Policy enforcement', 'Auto-blocking', 'Compliance monitoring', 'Audit trails'],
    benefits: ['Prevent data leaks', 'Compliance', 'Risk reduction'],
    icon: '🔒'
  },
  {
    id: 'email-authentication-checker',
    name: 'Email Authentication Checker',
    category: 'Email Intelligence',
    description: 'Verify email authenticity with SPF, DKIM, and DMARC checks to prevent spoofing.',
    price: 129,
    features: ['SPF verification', 'DKIM validation', 'DMARC checking', 'Spoofing detection', 'Authentication reports'],
    benefits: ['Verify senders', 'Block spoofing', 'Trust emails'],
    icon: '✅'
  }
];

// Find the position to insert new services (before the closing export)
const exportIndex = content.lastIndexOf('export const allServices');
if (exportIndex === -1) {
  console.error('Could not find export statement');
  process.exit(1);
}

// Convert services to TypeScript format
const servicesCode = newServices.map(service => `  {
    id: '${service.id}',
    name: '${service.name}',
    category: '${service.category}',
    description: \`${service.description}\`,
    price: ${service.price},
    features: [${service.features.map(f => `'${f}'`).join(', ')}],
    benefits: [${service.benefits.map(b => `'${b}'`).join(', ')}],
    icon: '${service.icon}'
  }`).join(',\n');

// Insert new services before the export statement
const insertPosition = content.lastIndexOf('];', exportIndex);
if (insertPosition === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

const newContent = content.slice(0, insertPosition) + ',\n' + servicesCode + content.slice(insertPosition);

fs.writeFileSync(servicesDataPath, newContent, 'utf8');

console.log(`✅ Added ${newServices.length} new services to catalog`);
console.log(`Total services now: ${newServices.length + 1010} (estimated)`);
