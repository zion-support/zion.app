const fs = require('fs');
let ts = fs.readFileSync('app/data/servicesData.ts', 'utf8');
const hasCRLF = ts.includes('\r\n');
ts = ts.replace(/\r\n/g, '\n');

const newAI = `
  {
    id: 'ai-thread-summarizer-pro-v221',
    title: 'AI Thread Summarizer Pro (V221)',
    description: 'Executive summaries of long email threads with key decisions, action items, and sentiment overview.',
    features: ['Executive summaries', 'Decision extraction', 'Action item tracking', 'Question detection', 'Sentiment overview', 'Participant analysis', 'Date range tracking', 'Reply-all enforcement'],
    benefits: ['Catch up in 30 seconds', 'Never miss decisions', 'Track all actions', 'Understand sentiment'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: '/services/ai-thread-summarizer-pro-v221', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📝', href: '/services/ai-thread-summarizer-pro-v221', popular: true, category: 'ai', industry: 'Productivity',
  },
  {
    id: 'ai-tone-adapter-v223',
    title: 'AI Email Tone Adapter (V223)',
    description: 'Automatically adjust email tone based on recipient relationship, urgency, and cultural context.',
    features: ['5 recipient profiles', 'Formality adaptation', 'Directness adjustment', 'Urgency calibration', 'Cultural matching', 'Real-time suggestions', 'Tone fit scoring', 'Reply-all enforcement'],
    benefits: ['Perfect tone always', 'Adapt to any recipient', 'Avoid missteps', 'Better communication'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/ai-tone-adapter-v223', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎨', href: '/services/ai-tone-adapter-v223', popular: true, category: 'ai', industry: 'Communication',
  },
  {
    id: 'ai-meeting-scheduler-v224',
    title: 'AI Meeting Scheduler Intelligence (V224)',
    description: 'Detect scheduling intent, propose optimal times across timezones, and generate calendar invites.',
    features: ['Intent detection', 'Timezone proposals', 'Duration optimization', 'Meeting type classification', 'Calendar invites', 'Agenda suggestions', 'Conflict detection', 'Reply-all enforcement'],
    benefits: ['Schedule 10x faster', 'No timezone confusion', 'Optimal duration', 'Never double-book'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/ai-meeting-scheduler-v224', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📅', href: '/services/ai-meeting-scheduler-v224', popular: true, category: 'ai', industry: 'Productivity',
  },
  {
    id: 'ai-email-complete-suite-v221-v225',
    title: 'AI Email Complete Suite (V221-V225)',
    description: 'All 5 new engines: Summarizer, Compliance, Tone, Scheduler, and Attachment Intelligence.',
    features: ['V221 Thread Summarizer', 'V222 Compliance Checker', 'V223 Tone Adapter', 'V224 Meeting Scheduler', 'V225 Attachment Intel', 'Case-by-case analysis', 'Reply-all guaranteed', 'Enterprise compliance'],
    benefits: ['Complete email AI', 'Compliance guaranteed', 'Perfect tone always', 'Max productivity'],
    pricing: { basic: '$999/mo', pro: '$2299/mo', enterprise: '$5999/mo' },
    contactInfo: { website: '/services/ai-email-complete-suite-v221-v225', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👑', href: '/services/ai-email-complete-suite-v221-v225', popular: true, category: 'ai', industry: 'Enterprise AI',
  },
  {
    id: 'ai-digital-twin-platform',
    title: 'AI Digital Twin Platform',
    description: 'Virtual replicas of physical systems for simulation, optimization, and predictive maintenance.',
    features: ['3D modeling', 'Real-time sensor sync', 'Predictive simulation', 'What-if analysis', 'Performance optimization', 'Anomaly detection', 'Energy modeling', 'IoT integration'],
    benefits: ['Simulate before building', 'Optimize 30%', 'Predict failures', 'Reduce downtime 50%'],
    pricing: { basic: '$799/mo', pro: '$1699/mo', enterprise: '$4499/mo' },
    contactInfo: { website: '/services/ai-digital-twin-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏭', href: '/services/ai-digital-twin-platform', popular: true, category: 'ai', industry: 'Industrial AI',
  },
  {
    id: 'ai-workforce-planning',
    title: 'AI Workforce Planning & Optimization',
    description: 'Predict staffing needs, optimize schedules, forecast attrition, and align capacity with demand.',
    features: ['Demand forecasting', 'Schedule optimization', 'Attrition prediction', 'Skills gap analysis', 'Capacity planning', 'Scenario modeling', 'Cost optimization', 'HRIS integration'],
    benefits: ['Right-size workforce', 'Reduce overtime 25%', 'Predict attrition', 'Optimize costs'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-workforce-planning', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👥', href: '/services/ai-workforce-planning', popular: true, category: 'ai', industry: 'HR Technology',
  },
  {
    id: 'ai-content-moderation-suite',
    title: 'AI Content Moderation Suite',
    description: 'Automated content moderation for UGC and social media with multi-language and custom policies.',
    features: ['Text moderation', 'Image moderation', 'Video moderation', 'Custom policies', '40+ languages', 'Appeals workflow', 'Dashboard', 'Real-time filtering'],
    benefits: ['Moderate at scale', 'Reduce review 80%', 'Custom policies', 'Brand safety'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1799/mo' },
    contactInfo: { website: '/services/ai-content-moderation-suite', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️', href: '/services/ai-content-moderation-suite', popular: true, category: 'ai', industry: 'Trust & Safety',
  },
  {
    id: 'ai-pricing-optimization',
    title: 'AI Dynamic Pricing Optimization',
    description: 'Real-time pricing optimization using demand signals, competitor monitoring, and revenue maximization.',
    features: ['Dynamic pricing', 'Competitor monitoring', 'Elasticity modeling', 'Demand forecasting', 'Revenue optimization', 'A/B testing', 'Margin protection', 'Multi-channel'],
    benefits: ['Increase revenue 15-25%', 'Auto-optimize margins', 'React to market', 'Outprice competitors'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/ai-pricing-optimization', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💲', href: '/services/ai-pricing-optimization', popular: true, category: 'ai', industry: 'Revenue Optimization',
  },
  {
    id: 'ai-customer-journey-orchestration',
    title: 'AI Customer Journey Orchestration',
    description: 'Orchestrate personalized customer journeys with real-time decisioning and next-best-action.',
    features: ['Journey mapping', 'Real-time decisioning', 'Next-best-action', 'Cross-channel', 'Journey analytics', 'A/B testing', 'Segmentation', 'Personalization'],
    benefits: ['Personalize interactions', 'Increase conversion 40%', 'Reduce churn 25%', 'Orchestrate cross-channel'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/ai-customer-journey-orchestration', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗺️', href: '/services/ai-customer-journey-orchestration', popular: true, category: 'ai', industry: 'Customer Experience',
  },`;

const newSecurity = `
  {
    id: 'ai-compliance-auto-checker-v222',
    title: 'AI Compliance Auto-Checker (V222)',
    description: 'Check emails against GDPR, HIPAA, SOC2, PCI-DSS with PII detection and consent verification.',
    features: ['GDPR checking', 'HIPAA PHI detection', 'SOC2 scanning', 'PCI-DSS detection', 'PII detection', 'Risk scoring', 'Remediation', 'Reply-all enforcement'],
    benefits: ['Prevent violations', 'Detect PII early', 'Meet requirements', 'Reduce legal risk'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-compliance-auto-checker-v222', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔒', href: '/services/ai-compliance-auto-checker-v222', popular: true, category: 'security', industry: 'Compliance',
  },
  {
    id: 'ai-attachment-intelligence-v225',
    title: 'AI Attachment Intelligence (V225)',
    description: 'Scan attachments for sensitive data, detect malware risks, and suggest cloud alternatives.',
    features: ['Malware detection', 'Sensitive data scanning', 'Size optimization', 'Cloud alternatives', 'PII detection', 'Risk assessment', 'File analysis', 'Reply-all enforcement'],
    benefits: ['Prevent malware', 'Detect data leaks', 'Reduce size 60%', 'Secure sharing'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$1099/mo' },
    contactInfo: { website: '/services/ai-attachment-intelligence-v225', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📎', href: '/services/ai-attachment-intelligence-v225', popular: true, category: 'security', industry: 'Email Security',
  },
  {
    id: 'security-ransomware-protection',
    title: 'Ransomware Protection Platform',
    description: 'Multi-layer ransomware protection with behavioral detection and automated rollback.',
    features: ['Behavioral detection', 'File integrity', 'Auto rollback', 'Threat intel', 'Network segmentation', 'Backup protection', 'Endpoint isolation', 'Incident response'],
    benefits: ['Prevent attacks', 'Auto-rollback files', 'Protect backups', 'Minimize blast radius'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/security-ransomware-protection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔐', href: '/services/security-ransomware-protection', popular: true, category: 'security', industry: 'Cybersecurity',
  },
  {
    id: 'security-browser-isolation',
    title: 'Browser Isolation Platform',
    description: 'Isolate web browsing in secure containers to prevent malware and phishing.',
    features: ['Remote isolation', 'Container-based', 'Phishing protection', 'Malware prevention', 'DLP', 'Policy enforcement', 'Session recording', 'Zero-trust'],
    benefits: ['Eliminate browser attacks', 'Prevent phishing', 'Stop exfiltration', 'Zero-trust browsing'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$1099/mo' },
    contactInfo: { website: '/services/security-browser-isolation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐', href: '/services/security-browser-isolation', popular: true, category: 'security', industry: 'Endpoint Security',
  },`;

const newIT = `
  {
    id: 'it-service-mesh-platform',
    title: 'Service Mesh Platform',
    description: 'Deploy and manage service mesh with traffic management, security, and observability.',
    features: ['Traffic management', 'mTLS encryption', 'Circuit breaking', 'Rate limiting', 'Distributed tracing', 'Canary deploys', 'Multi-cluster', 'Policy enforcement'],
    benefits: ['Secure microservices', 'Zero-trust networking', 'Observe all traffic', 'Deploy safely'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/it-service-mesh-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🕸️', href: '/services/it-service-mesh-platform', popular: true, category: 'it', industry: 'Cloud Native',
  },
  {
    id: 'it-serverless-platform',
    title: 'Serverless Computing Platform',
    description: 'Deploy functions without managing infrastructure. Auto-scaling and pay-per-use.',
    features: ['FaaS', 'Event-driven', 'Auto-scaling', 'Multi-runtime', 'Cold start optimization', 'Monitoring', 'Cost optimization', 'CI/CD'],
    benefits: ['Zero infrastructure', 'Scale to zero', 'Pay per use', 'Deploy in seconds'],
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/it-serverless-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚡', href: '/services/it-serverless-platform', popular: true, category: 'it', industry: 'Cloud Computing',
  },
  {
    id: 'it-api-monetization',
    title: 'API Monetization & Developer Portal',
    description: 'Monetize APIs with usage-based billing, developer portal, and analytics.',
    features: ['Usage billing', 'Developer portal', 'API marketplace', 'Analytics', 'Rate limiting', 'Onboarding', 'Revenue tracking', 'Self-service'],
    benefits: ['APIs as revenue', 'Attract developers', 'Track economics', 'Scale API business'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1799/mo' },
    contactInfo: { website: '/services/it-api-monetization', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💰', href: '/services/it-api-monetization', popular: true, category: 'it', industry: 'API Economy',
  },`;

const newData = `
  {
    id: 'data-lakehouse-platform',
    title: 'Data Lakehouse Platform',
    description: 'Unified lakehouse combining lake flexibility with warehouse performance.',
    features: ['ACID transactions', 'Schema enforcement', 'Time travel', 'Batch/streaming', 'Data versioning', 'Query optimization', 'Multi-engine', 'Governance'],
    benefits: ['One platform for all data', 'ACID reliability', 'Query history', 'Optimize performance'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/data-lakehouse-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏗️', href: '/services/data-lakehouse-platform', popular: true, category: 'data', industry: 'Data Architecture',
  },
  {
    id: 'data-mlops-platform',
    title: 'MLOps Platform',
    description: 'End-to-end ML lifecycle with experiment tracking, model registry, and deployment pipelines.',
    features: ['Experiment tracking', 'Model registry', 'Auto retraining', 'Deployment pipelines', 'Model monitoring', 'A/B testing', 'Feature store', 'Drift detection'],
    benefits: ['Ship ML faster', 'Track experiments', 'Automate retraining', 'Monitor performance'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/data-mlops-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧪', href: '/services/data-mlops-platform', popular: true, category: 'data', industry: 'MLOps',
  },`;

const newAuto = `
  {
    id: 'micro-saas-crm-lightweight',
    title: 'Lightweight CRM for Startups',
    description: 'Simple, fast CRM for startups with pipeline management and deal analytics.',
    features: ['Pipeline management', 'Contact tracking', 'Email integration', 'Deal analytics', 'Task management', 'Team collaboration', 'Mobile app', 'API access'],
    benefits: ['Simple and fast', 'Built for startups', 'Track every deal', 'Collaborate easily'],
    pricing: { basic: '$19/mo', pro: '$49/mo', enterprise: '$99/mo' },
    contactInfo: { website: '/services/micro-saas-crm-lightweight', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯', href: '/services/micro-saas-crm-lightweight', popular: true, category: 'micro-saas', industry: 'Sales',
  },
  {
    id: 'micro-saas-form-builder',
    title: 'Smart Form Builder & Analytics',
    description: 'Build forms with conditional logic, payments, and conversion analytics.',
    features: ['Drag-and-drop', 'Conditional logic', 'File uploads', 'Payments', 'Conversion analytics', 'GDPR compliant', 'Webhooks', 'Custom branding'],
    benefits: ['Build in minutes', 'Increase conversions', 'Collect payments', 'GDPR compliant'],
    pricing: { basic: '$19/mo', pro: '$49/mo', enterprise: '$129/mo' },
    contactInfo: { website: '/services/micro-saas-form-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📋', href: '/services/micro-saas-form-builder', popular: true, category: 'micro-saas', industry: 'Forms & Surveys',
  },
  {
    id: 'micro-saas-link-shortener',
    title: 'Link Shortener & Analytics',
    description: 'Shorten links with custom domains, UTM tracking, and detailed click analytics.',
    features: ['Custom domains', 'UTM tracking', 'QR codes', 'Click analytics', 'Geo data', 'Device detection', 'A/B testing', 'API access'],
    benefits: ['Track every click', 'Custom branding', 'QR codes included', 'Detailed analytics'],
    pricing: { basic: '$9/mo', pro: '$29/mo', enterprise: '$79/mo' },
    contactInfo: { website: '/services/micro-saas-link-shortener', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔗', href: '/services/micro-saas-link-shortener', popular: true, category: 'micro-saas', industry: 'Marketing',
  },
  {
    id: 'micro-saas-time-tracking',
    title: 'Time Tracking & Invoicing',
    description: 'Track time, generate invoices, and manage team productivity.',
    features: ['Time tracking', 'Project management', 'Auto-invoicing', 'Team management', 'Reports', 'Integrations', 'Mobile app', 'Client portal'],
    benefits: ['Track effortlessly', 'Invoice automatically', 'Manage projects', 'Boost productivity'],
    pricing: { basic: '$9/mo', pro: '$29/mo', enterprise: '$69/mo' },
    contactInfo: { website: '/services/micro-saas-time-tracking', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⏱️', href: '/services/micro-saas-time-tracking', popular: true, category: 'micro-saas', industry: 'Productivity',
  },
  {
    id: 'micro-saas-social-proof',
    title: 'Social Proof & Testimonials Widget',
    description: 'Display real-time social proof to increase conversions.',
    features: ['Real-time notifications', 'Testimonial carousel', 'Trust badges', 'Star ratings', 'Analytics', 'Custom styling', 'A/B testing', 'No-code embed'],
    benefits: ['Increase conversions 15%', 'Build trust instantly', 'Real social proof', 'No-code'],
    pricing: { basic: '$19/mo', pro: '$49/mo', enterprise: '$129/mo' },
    contactInfo: { website: '/services/micro-saas-social-proof', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⭐', href: '/services/micro-saas-social-proof', popular: true, category: 'micro-saas', industry: 'Conversion Optimization',
  },
  {
    id: 'micro-saas-survey-platform',
    title: 'Customer Survey & NPS Platform',
    description: 'Beautiful surveys with NPS, CSAT, CES templates and automated insights.',
    features: ['NPS/CSAT/CES templates', 'Logic branching', 'Automated insights', 'Analytics', 'Multi-channel', 'White-label', 'API access', 'Integrations'],
    benefits: ['Measure satisfaction', 'Actionable insights', 'Automate collection', 'Track trends'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/micro-saas-survey-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊', href: '/services/micro-saas-survey-platform', popular: true, category: 'micro-saas', industry: 'Customer Feedback',
  },
  {
    id: 'micro-saas-waiting-list',
    title: 'Waiting List & Launch Platform',
    description: 'Build viral waiting lists with referral tracking and launch analytics.',
    features: ['Viral referrals', 'Leaderboard', 'Automated emails', 'Launch analytics', 'Custom branding', 'Segments', 'A/B testing', 'API access'],
    benefits: ['Go viral pre-launch', 'Build anticipation', 'Track referrals', 'Launch with impact'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/micro-saas-waiting-list', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚀', href: '/services/micro-saas-waiting-list', popular: true, category: 'micro-saas', industry: 'Product Launch',
  },`;

let count = 0;
let idx = ts.indexOf('];\n\nexport const itServices');
if (idx > -1) { ts = ts.slice(0, idx) + newAI + '\n' + ts.slice(idx); count += 9; console.log('✓ 9 AI'); }
idx = ts.indexOf('];\n\nexport const cloudServices');
if (idx > -1) { ts = ts.slice(0, idx) + newIT + '\n' + ts.slice(idx); count += 3; console.log('✓ 3 IT'); }
idx = ts.indexOf('];\n\nexport const dataServices');
if (idx > -1) { ts = ts.slice(0, idx) + newSecurity + '\n' + ts.slice(idx); count += 4; console.log('✓ 4 Security'); }
idx = ts.indexOf('];\n\nexport const automationServices');
if (idx > -1) { ts = ts.slice(0, idx) + newData + '\n' + ts.slice(idx); count += 2; console.log('✓ 2 Data'); }
idx = ts.indexOf('];\n\nexport const allServices');
if (idx > -1) { ts = ts.slice(0, idx) + newAuto + '\n' + ts.slice(idx); count += 7; console.log('✓ 7 Micro-SaaS'); }
if (hasCRLF) ts = ts.replace(/\n/g, '\r\n');
fs.writeFileSync('app/data/servicesData.ts', ts);
console.log('Total added:', count, 'services to TS');
