const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, '../app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  {
    id: 'ai-email-translation-engine',
    name: 'AI Email Translation Engine',
    category: 'AI Services',
    description: 'Real-time email translation into 50+ languages with context-aware tone preservation and cultural adaptation.',
    price: '$199/month',
    features: ['50+ language support', 'Tone preservation', 'Cultural adaptation', 'RTL language support', 'Bilingual responses', 'Industry terminology'],
    icon: '🌐'
  },
  {
    id: 'professional-email-templates',
    name: 'Professional Email Templates',
    category: 'Micro SaaS',
    description: 'AI-generated email templates tailored to your industry, tone, and use case with personalization tokens.',
    price: '$149/month',
    features: ['Industry-specific templates', 'Personalization tokens', 'Tone customization', 'Template library', 'A/B variants', 'Quality scoring'],
    icon: '📝'
  },
  {
    id: 'email-ab-testing-platform',
    name: 'Email A/B Testing Platform',
    category: 'AI Services',
    description: 'Test subject lines, CTAs, and content variations with statistical significance to optimize performance.',
    price: '$249/month',
    features: ['Subject line testing', 'CTA optimization', 'Statistical analysis', 'Winner detection', 'Performance tracking', 'Variant generation'],
    icon: '🧪'
  },
  {
    id: 'smart-notification-system',
    name: 'Smart Notification System',
    category: 'AI Services',
    description: 'AI prioritizes notifications by urgency: push for critical, email for important, digest for low priority.',
    price: '$179/month',
    features: ['Priority scoring', 'Multi-channel routing', 'Smart batching', 'Fatigue detection', 'Quiet hours', 'Context awareness'],
    icon: '🔔'
  },
  {
    id: 'email-collaboration-hub',
    name: 'Email Collaboration Hub',
    category: 'Micro SaaS',
    description: 'Real-time co-editing, @mentions, shared drafts, and team approval workflows for collaborative email composition.',
    price: '$299/month',
    features: ['Shared drafts', '@mentions', 'Approval workflows', 'Version control', 'Comments', 'Activity tracking'],
    icon: '👥'
  },
  {
    id: 'multilingual-customer-support',
    name: 'Multilingual Customer Support',
    category: 'AI Services',
    description: 'Provide customer support in 50+ languages with automatic translation and cultural sensitivity.',
    price: '$399/month',
    features: ['Auto-translation', 'Cultural adaptation', 'Tone matching', 'Response templates', 'Quality assurance', 'Agent assistance'],
    icon: '🌍'
  },
  {
    id: 'sales-outreach-templates',
    name: 'Sales Outreach Templates',
    category: 'Micro SaaS',
    description: 'AI-generated cold outreach templates with A/B variants optimized for your industry and target audience.',
    price: '$199/month',
    features: ['Cold outreach templates', 'Follow-up sequences', 'Personalization', 'A/B testing', 'Performance tracking', 'Industry optimization'],
    icon: '🎯'
  },
  {
    id: 'email-performance-analytics',
    name: 'Email Performance Analytics',
    category: 'AI Services',
    description: 'Track open rates, click-through rates, and conversion metrics with AI-powered optimization recommendations.',
    price: '$229/month',
    features: ['Open rate tracking', 'CTR analysis', 'Conversion metrics', 'A/B test results', 'Optimization tips', 'Performance scoring'],
    icon: '📊'
  },
  {
    id: 'notification-fatigue-prevention',
    name: 'Notification Fatigue Prevention',
    category: 'AI Services',
    description: 'Detect and prevent notification fatigue with intelligent batching, quiet hours, and priority-based routing.',
    price: '$159/month',
    features: ['Fatigue detection', 'Smart batching', 'Quiet hours', 'Priority routing', 'Digest mode', 'User preferences'],
    icon: '😌'
  },
  {
    id: 'team-email-approval-workflow',
    name: 'Team Email Approval Workflow',
    category: 'Micro SaaS',
    description: 'Streamline email approvals with multi-stage workflows, version control, and audit trails.',
    price: '$269/month',
    features: ['Multi-stage approval', 'Version control', 'Audit trails', 'Automated routing', 'Status tracking', 'Compliance logging'],
    icon: '✅'
  },
  {
    id: 'global-communication-platform',
    name: 'Global Communication Platform',
    category: 'AI Services',
    description: 'Unified platform for multilingual email communication with real-time translation and cultural intelligence.',
    price: '$449/month',
    features: ['Real-time translation', 'Cultural intelligence', 'Tone adaptation', 'Business phrases', 'RTL support', 'Global templates'],
    icon: '🌏'
  },
  {
    id: 'email-template-optimizer',
    name: 'Email Template Optimizer',
    category: 'AI Services',
    description: 'AI analyzes and optimizes your email templates for better engagement, clarity, and conversion rates.',
    price: '$189/month',
    features: ['Template analysis', 'Quality scoring', 'Optimization tips', 'A/B testing', 'Performance tracking', 'Best practices'],
    icon: '⚡'
  },
  {
    id: 'email-campaign-optimizer',
    name: 'Email Campaign Optimizer',
    category: 'AI Services',
    description: 'Optimize email campaigns with A/B testing, statistical analysis, and AI-powered recommendations.',
    price: '$329/month',
    features: ['Campaign A/B testing', 'Statistical significance', 'Winner detection', 'Performance analytics', 'Optimization tips', 'ROI tracking'],
    icon: '🚀'
  },
  {
    id: 'intelligent-alert-system',
    name: 'Intelligent Alert System',
    category: 'AI Services',
    description: 'AI-powered alert system that routes notifications based on priority, context, and user preferences.',
    price: '$219/month',
    features: ['Priority-based routing', 'Context awareness', 'Multi-channel alerts', 'Smart batching', 'Escalation rules', 'Alert analytics'],
    icon: '🚨'
  },
  {
    id: 'collaborative-email-editor',
    name: 'Collaborative Email Editor',
    category: 'Micro SaaS',
    description: 'Real-time collaborative email editing with comments, suggestions, and team approval workflows.',
    price: '$279/month',
    features: ['Real-time editing', 'Comments & suggestions', '@mentions', 'Version history', 'Approval workflows', 'Activity feed'],
    icon: '✏️'
  },
  {
    id: 'cross-cultural-communication',
    name: 'Cross-Cultural Communication AI',
    category: 'AI Services',
    description: 'AI ensures culturally appropriate communication with sensitivity checks and adaptation recommendations.',
    price: '$259/month',
    features: ['Cultural sensitivity', 'Tone adaptation', 'Formality adjustment', 'Regional norms', 'Business etiquette', 'Inclusive language'],
    icon: '🤝'
  },
  {
    id: 'email-content-generator',
    name: 'Email Content Generator',
    category: 'AI Services',
    description: 'Generate professional email content with AI based on context, tone, and personalization requirements.',
    price: '$169/month',
    features: ['AI content generation', 'Context awareness', 'Tone matching', 'Personalization', 'Multiple variants', 'Quality assurance'],
    icon: '📧'
  },
  {
    id: 'email-metrics-dashboard',
    name: 'Email Metrics Dashboard',
    category: 'Micro SaaS',
    description: 'Comprehensive dashboard tracking all email metrics with AI-powered insights and recommendations.',
    price: '$289/month',
    features: ['Real-time metrics', 'Performance tracking', 'A/B test results', 'Trend analysis', 'AI insights', 'Custom reports'],
    icon: '📈'
  },
  {
    id: 'smart-alert-manager',
    name: 'Smart Alert Manager',
    category: 'AI Services',
    description: 'Manage alerts intelligently with priority scoring, batching, and fatigue prevention.',
    price: '$199/month',
    features: ['Priority scoring', 'Smart batching', 'Fatigue prevention', 'Quiet hours', 'Multi-channel routing', 'Alert analytics'],
    icon: '🔕'
  },
  {
    id: 'team-collaboration-suite',
    name: 'Team Collaboration Suite',
    category: 'Micro SaaS',
    description: 'Complete suite for team email collaboration with shared drafts, approvals, and activity tracking.',
    price: '$349/month',
    features: ['Shared drafts', 'Approval workflows', 'Activity tracking', 'Comments', 'Version control', 'Team analytics'],
    icon: '👨‍💼'
  },
  {
    id: 'email-localization-service',
    name: 'Email Localization Service',
    category: 'AI Services',
    description: 'Professional email localization with cultural adaptation, tone preservation, and regional compliance.',
    price: '$379/month',
    features: ['50+ languages', 'Cultural adaptation', 'Tone preservation', 'Regional compliance', 'Quality assurance', 'Glossary management'],
    icon: '🗺️'
  },
  {
    id: 'dynamic-email-builder',
    name: 'Dynamic Email Builder',
    category: 'Micro SaaS',
    description: 'Build dynamic emails with AI-generated content, personalization tokens, and conditional logic.',
    price: '$239/month',
    features: ['Dynamic content', 'Personalization tokens', 'Conditional logic', 'Template library', 'A/B testing', 'Performance tracking'],
    icon: '🎨'
  },
  {
    id: 'email-optimization-engine',
    name: 'Email Optimization Engine',
    category: 'AI Services',
    description: 'AI-powered engine that continuously optimizes email performance through testing and learning.',
    price: '$319/month',
    features: ['Continuous optimization', 'A/B testing', 'Statistical analysis', 'Performance tracking', 'AI recommendations', 'ROI improvement'],
    icon: '⚙️'
  },
  {
    id: 'context-aware-notifications',
    name: 'Context-Aware Notifications',
    category: 'AI Services',
    description: 'Notifications that adapt to context, time, and user behavior for optimal engagement.',
    price: '$189/month',
    features: ['Context awareness', 'Behavioral adaptation', 'Time optimization', 'Priority routing', 'Fatigue prevention', 'Engagement analytics'],
    icon: '💡'
  }
];

// Add new services
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log(`✅ Added ${newServices.length} new services. Total: ${services.length}`);
