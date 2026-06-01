const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, '../app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const contactInfo = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown DE 19709'
};

const newServices = [
  // V1056: Emotional Intelligence Services
  {
    id: 'emotional-intelligence-email-analysis',
    name: 'Emotional Intelligence Email Analysis',
    category: 'AI Email Intelligence',
    description: 'Detect emotional state of email senders with AI-powered sentiment analysis. Adapt response tone to match emotional context and de-escalate angry customers with empathy-first responses.',
    price: 549,
    features: [
      '8 emotion detection (anger, frustration, excitement, confusion, anxiety, satisfaction, sadness, urgency)',
      'Emotional intensity scoring (0-100)',
      'Empathetic response templates',
      'De-escalation strategies',
      'Escalation risk assessment',
      'Relationship preservation tips'
    ],
    icon: '💝',
    tags: ['emotional intelligence', 'sentiment analysis', 'customer service', 'de-escalation'],
    contactInfo
  },
  {
    id: 'customer-de-escalation-ai',
    name: 'Customer De-Escalation AI',
    category: 'AI Email Intelligence',
    description: 'Automatically detect angry or frustrated customers and generate empathetic, solution-focused responses. Prevent escalations and preserve business relationships.',
    price: 649,
    features: [
      'Real-time anger detection',
      'Empathy-first response generation',
      'Escalation prevention alerts',
      'Manager notification system',
      'Customer retention strategies',
      'Follow-up scheduling'
    ],
    icon: '🕊️',
    tags: ['de-escalation', 'customer retention', 'conflict resolution', 'empathy'],
    contactInfo
  },
  {
    id: 'empathy-response-generator',
    name: 'Empathy Response Generator',
    category: 'AI Email Intelligence',
    description: 'Generate empathetic, emotionally-aware responses for customer support, sales, and internal communications. Match tone to emotional context automatically.',
    price: 479,
    features: [
      'Context-aware empathy phrases',
      'Tone matching algorithms',
      'Emotional validation techniques',
      'Personalization engine',
      'Cultural sensitivity filters',
      'Response quality scoring'
    ],
    icon: '❤️',
    tags: ['empathy', 'customer support', 'tone matching', 'personalization'],
    contactInfo
  },
  {
    id: 'emotional-trend-analytics',
    name: 'Emotional Trend Analytics',
    category: 'Analytics Services',
    description: 'Track emotional trends across email conversations. Identify patterns in customer sentiment, team morale, and relationship health over time.',
    price: 599,
    features: [
      'Historical emotion tracking',
      'Trend visualization dashboards',
      'Team emotional health metrics',
      'Customer satisfaction trends',
      'Predictive sentiment analysis',
      'Executive emotion reports'
    ],
    icon: '📊',
    tags: ['analytics', 'trends', 'sentiment tracking', 'dashboards'],
    contactInfo
  },
  {
    id: 'crisis-communication-assistant',
    name: 'Crisis Communication Assistant',
    category: 'AI Email Intelligence',
    description: 'AI-powered crisis communication assistant for high-stakes situations. Detect critical emotional states and generate appropriate responses to prevent PR disasters.',
    price: 899,
    features: [
      'Critical emotion detection',
      'Crisis response templates',
      'Legal compliance checks',
      'Executive approval workflows',
      'Public statement generation',
      'Stakeholder notification'
    ],
    icon: '🚨',
    tags: ['crisis management', 'PR', 'communication', 'risk mitigation'],
    contactInfo
  },

  // V1057: Documentation Services
  {
    id: 'email-to-api-documentation',
    name: 'Email-to-API Documentation',
    category: 'IT Services',
    description: 'Automatically extract API requirements from email threads and generate comprehensive API documentation with code examples, endpoints, and specifications.',
    price: 649,
    features: [
      'API endpoint extraction',
      'Code snippet detection',
      'Parameter identification',
      'Response format parsing',
      'Markdown/HTML export',
      'Swagger/OpenAPI generation'
    ],
    icon: '📘',
    tags: ['API documentation', 'technical writing', 'automation', 'developer tools'],
    contactInfo
  },
  {
    id: 'automated-user-guide-generator',
    name: 'Automated User Guide Generator',
    category: 'IT Services',
    description: 'Transform email conversations into step-by-step user guides. Extract instructions, requirements, and procedures to create comprehensive documentation automatically.',
    price: 579,
    features: [
      'Step extraction algorithms',
      'Requirement parsing',
      'Procedure structuring',
      'Screenshot integration',
      'Multi-format export',
      'Version control integration'
    ],
    icon: '📖',
    tags: ['user guides', 'documentation', 'automation', 'knowledge base'],
    contactInfo
  },
  {
    id: 'sop-documentation-automation',
    name: 'SOP Documentation Automation',
    category: 'IT Services',
    description: 'Generate Standard Operating Procedures from email workflows. Automatically structure processes, identify requirements, and create compliant SOP documentation.',
    price: 699,
    features: [
      'Process flow extraction',
      'Requirement identification',
      'Compliance formatting',
      'Approval workflows',
      'Version tracking',
      'Audit trail generation'
    ],
    icon: '📋',
    tags: ['SOP', 'process documentation', 'compliance', 'automation'],
    contactInfo
  },
  {
    id: 'knowledge-base-builder',
    name: 'Knowledge Base Builder',
    category: 'IT Services',
    description: 'Automatically build knowledge bases from email conversations. Extract FAQs, troubleshooting guides, and best practices to create searchable documentation.',
    price: 549,
    features: [
      'FAQ extraction',
      'Troubleshooting guide generation',
      'Best practice compilation',
      'Search optimization',
      'Category organization',
      'Continuous learning'
    ],
    icon: '🧠',
    tags: ['knowledge base', 'FAQ', 'documentation', 'self-service'],
    contactInfo
  },
  {
    id: 'technical-writing-assistant',
    name: 'Technical Writing Assistant',
    category: 'AI Services',
    description: 'AI-powered technical writing assistant that transforms rough email notes into polished technical documentation, manuals, and guides.',
    price: 629,
    features: [
      'Technical jargon enhancement',
      'Structure optimization',
      'Code example integration',
      'Diagram suggestions',
      'Multi-language support',
      'Style guide compliance'
    ],
    icon: '✍️',
    tags: ['technical writing', 'documentation', 'AI assistant', 'content creation'],
    contactInfo
  },

  // V1058: Accessibility Services
  {
    id: 'wcag-email-compliance',
    name: 'WCAG Email Compliance Checker',
    category: 'Compliance Services',
    description: 'Ensure all emails meet WCAG 2.1 AA accessibility standards. Check alt text, color contrast, heading structure, and link descriptions automatically.',
    price: 399,
    features: [
      'WCAG 2.1 AA compliance checking',
      'Alt text validation',
      'Color contrast analysis',
      'Heading hierarchy checks',
      'Link text evaluation',
      'Screen reader compatibility'
    ],
    icon: '♿',
    tags: ['accessibility', 'WCAG', 'compliance', 'inclusive design'],
    contactInfo
  },
  {
    id: 'screen-reader-optimization',
    name: 'Screen Reader Optimization',
    category: 'Accessibility Services',
    description: 'Optimize emails for screen readers and assistive technologies. Ensure content is properly structured, labeled, and navigable for visually impaired users.',
    price: 449,
    features: [
      'Screen reader testing',
      'ARIA label optimization',
      'Semantic HTML validation',
      'Navigation structure checks',
      'Audio preview generation',
      'Compliance reporting'
    ],
    icon: '🔊',
    tags: ['screen reader', 'accessibility', 'assistive technology', 'inclusive design'],
    contactInfo
  },
  {
    id: 'color-contrast-analyzer',
    name: 'Color Contrast Analyzer',
    category: 'Design Services',
    description: 'Analyze email color schemes for accessibility compliance. Ensure text meets WCAG contrast ratios and suggest accessible color alternatives.',
    price: 299,
    features: [
      'Contrast ratio calculation',
      'WCAG compliance checking',
      'Color suggestion engine',
      'Colorblind simulation',
      'Brand color adaptation',
      'Real-time preview'
    ],
    icon: '🎨',
    tags: ['color contrast', 'accessibility', 'design', 'WCAG'],
    contactInfo
  },
  {
    id: 'accessible-email-templates',
    name: 'Accessible Email Templates',
    category: 'Design Services',
    description: 'Pre-built accessible email templates that meet WCAG 2.1 AA standards. Responsive, screen-reader friendly, and customizable for your brand.',
    price: 349,
    features: [
      '50+ accessible templates',
      'Responsive design',
      'Screen reader optimized',
      'High contrast options',
      'Brand customization',
      'Regular updates'
    ],
    icon: '📧',
    tags: ['templates', 'accessibility', 'email design', 'responsive'],
    contactInfo
  },
  {
    id: 'accessibility-audit-service',
    name: 'Accessibility Audit Service',
    category: 'Compliance Services',
    description: 'Comprehensive accessibility audit for email campaigns. Detailed reports, remediation guidance, and compliance certification for ADA/WCAG standards.',
    price: 799,
    features: [
      'Full accessibility audit',
      'Detailed compliance reports',
      'Remediation guidance',
      'Certification preparation',
      'Legal compliance review',
      'Quarterly re-audits'
    ],
    icon: '🔍',
    tags: ['audit', 'accessibility', 'compliance', 'certification'],
    contactInfo
  },

  // V1059: Deliverability Services
  {
    id: 'email-deliverability-guardian',
    name: 'Email Deliverability Guardian',
    category: 'Email Marketing Services',
    description: 'Monitor and optimize email deliverability across all major ISPs. Detect spam triggers, authentication issues, and reputation problems before they impact inbox placement.',
    price: 699,
    features: [
      'Real-time deliverability monitoring',
      'Spam trigger word detection',
      'Authentication status checking (SPF/DKIM/DMARC)',
      'Reputation score tracking',
      'ISP-specific optimization',
      'Blacklist monitoring'
    ],
    icon: '📬',
    tags: ['deliverability', 'email marketing', 'spam prevention', 'reputation'],
    contactInfo
  },
  {
    id: 'spam-filter-optimization',
    name: 'Spam Filter Optimization',
    category: 'Email Marketing Services',
    description: 'Optimize email content to avoid spam filters. Analyze subject lines, body content, and sender reputation to maximize inbox placement rates.',
    price: 549,
    features: [
      'Spam score calculation',
      'Trigger word identification',
      'Content optimization suggestions',
      'Subject line A/B testing',
      'Sender reputation monitoring',
      'Inbox placement prediction'
    ],
    icon: '🛡️',
    tags: ['spam filter', 'email optimization', 'deliverability', 'marketing'],
    contactInfo
  },
  {
    id: 'email-authentication-setup',
    name: 'Email Authentication Setup',
    category: 'IT Services',
    description: 'Professional setup and configuration of email authentication protocols (SPF, DKIM, DMARC) to improve deliverability and prevent spoofing.',
    price: 499,
    features: [
      'SPF record configuration',
      'DKIM key generation and setup',
      'DMARC policy implementation',
      'DNS record validation',
      'Authentication monitoring',
      'Troubleshooting support'
    ],
    icon: '🔐',
    tags: ['authentication', 'SPF', 'DKIM', 'DMARC', 'security'],
    contactInfo
  },
  {
    id: 'reputation-monitoring-service',
    name: 'Reputation Monitoring Service',
    category: 'Email Marketing Services',
    description: 'Continuous monitoring of sender reputation across all major ISPs and blacklists. Real-time alerts and remediation guidance to maintain high deliverability.',
    price: 599,
    features: [
      '24/7 reputation monitoring',
      'Blacklist detection and removal',
      'ISP feedback loop management',
      'Reputation score tracking',
      'Alert notifications',
      'Remediation assistance'
    ],
    icon: '📊',
    tags: ['reputation', 'monitoring', 'blacklist', 'deliverability'],
    contactInfo
  },
  {
    id: 'inbox-placement-testing',
    name: 'Inbox Placement Testing',
    category: 'Email Marketing Services',
    description: 'Test email inbox placement across Gmail, Outlook, Yahoo, and other major providers. Get detailed reports on deliverability performance.',
    price: 449,
    features: [
      'Multi-ISP testing',
      'Inbox vs spam folder tracking',
      'Detailed placement reports',
      'Historical trend analysis',
      'Competitor benchmarking',
      'Optimization recommendations'
    ],
    icon: '✅',
    tags: ['inbox placement', 'testing', 'deliverability', 'analytics'],
    contactInfo
  },

  // V1060: Voice Integration Services
  {
    id: 'voice-email-assistant',
    name: 'Voice Email Assistant',
    category: 'AI Services',
    description: 'Compose, read, and manage emails using voice commands. Natural language processing for hands-free email management with smart summarization.',
    price: 479,
    features: [
      'Voice-to-email composition',
      'Smart email summarization',
      'Voice search and filtering',
      'Scheduled sending via voice',
      'Priority management',
      'Multi-platform support (Siri, Alexa, Google)'
    ],
    icon: '🎙️',
    tags: ['voice assistant', 'hands-free', 'productivity', 'AI'],
    contactInfo
  },
  {
    id: 'email-text-to-speech',
    name: 'Email Text-to-Speech',
    category: 'Accessibility Services',
    description: 'Convert emails to natural-sounding speech. Listen to emails while driving, exercising, or multitasking with customizable voice profiles.',
    price: 349,
    features: [
      'Natural voice synthesis',
      'Multiple voice options',
      'Speed control',
      'Smart summarization',
      'Playlist creation',
      'Offline listening'
    ],
    icon: '🔊',
    tags: ['text-to-speech', 'accessibility', 'productivity', 'audio'],
    contactInfo
  },
  {
    id: 'voice-command-automation',
    name: 'Voice Command Automation',
    category: 'AI Services',
    description: 'Automate email workflows using voice commands. Schedule, forward, label, and prioritize emails hands-free with natural language processing.',
    price: 529,
    features: [
      'Custom voice commands',
      'Workflow automation',
      'Multi-step actions',
      'Conditional logic',
      'Integration with CRM/calendar',
      'Voice command training'
    ],
    icon: '🗣️',
    tags: ['automation', 'voice commands', 'productivity', 'workflows'],
    contactInfo
  },
  {
    id: 'executive-voice-digest',
    name: 'Executive Voice Digest',
    category: 'AI Services',
    description: 'Daily email digest delivered as audio briefing. AI summarizes important emails and presents key information in executive-friendly format.',
    price: 599,
    features: [
      'Daily audio briefings',
      'Priority email summaries',
      'Action item extraction',
      'Customizable digest length',
      'Scheduled delivery',
      'Follow-up reminders'
    ],
    icon: '📻',
    tags: ['executive', 'digest', 'audio briefing', 'productivity'],
    contactInfo
  },
  {
    id: 'multilingual-voice-support',
    name: 'Multilingual Voice Support',
    category: 'AI Services',
    description: 'Voice email assistant with support for 25+ languages. Compose, read, and manage emails in your preferred language with accurate translation.',
    price: 649,
    features: [
      '25+ language support',
      'Real-time translation',
      'Accent recognition',
      'Cultural context awareness',
      'Language switching',
      'Pronunciation optimization'
    ],
    icon: '🌍',
    tags: ['multilingual', 'translation', 'voice', 'global'],
    contactInfo
  }
];

// Add new services to existing array
services.push(...newServices);

// Save back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`✅ Added ${newServices.length} new services`);
console.log(`📊 Total services: ${services.length}`);
console.log(`📁 Updated: ${servicesPath}`);
