// Wave 191 services - OWL
// 10 new services — MarTech, PropTech, GovTech, Philanthropy, Travel, Entertainment

import { Service } from './servicesData';

export const wave191AiServices: Service[] = [
  {
    id: 'ai-customer-segmentation',
    title: 'AI Customer Segmentation Engine',
    description: 'ML-powered customer segmentation using behavioral, demographic, and transactional data for hyper-targeted marketing.',
    features: ['Behavioral Clustering', 'Lookalike Audiences', 'Predictive Segments', 'Real-Time Updates', 'CRM Sync'],
    benefits: ['3x campaign ROI', 'Reduce CAC 40%'],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: '$1,999/mo' },
    contactInfo: { website: '/services/ai-customer-segmentation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯', href: '/services/ai-customer-segmentation', popular: true, category: 'ai', industry: 'Marketing',
  },
  {
    id: 'ai-pricing-optimization',
    title: 'AI Dynamic Pricing Optimization',
    description: 'Real-time pricing engine using demand signals, competitor data, and elasticity models to maximize revenue.',
    features: ['Demand Sensing', 'Competitor Monitoring', 'Elasticity Modeling', 'A/B Testing', 'Revenue Analytics'],
    benefits: ['Increase margin 15%', 'React to market in minutes'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-pricing-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💲', href: '/services/ai-pricing-optimization', popular: false, category: 'ai', industry: 'Retail',
  },
];

export const wave191DataServices: Service[] = [
  {
    id: 'data-data-quality-platform',
    title: 'Data Quality Platform',
    description: 'Automated data quality monitoring, cleansing, and enrichment with ML-powered anomaly detection.',
    features: ['Quality Scoring', 'Auto Cleansing', 'Anomaly Detection', 'Enrichment', 'Data Observability'],
    benefits: ['Trust your data', 'Reduce errors 90%'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-data-quality-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏅', href: '/services/data-data-quality-platform', popular: true, category: 'data', industry: 'Technology',
  },
];

export const wave191CloudServices: Service[] = [
  {
    id: 'cloud-database-optimization',
    title: 'Cloud Database Optimization Service',
    description: 'Expert database tuning, query optimization, and migration service for PostgreSQL, MySQL, and MongoDB.',
    features: ['Query Optimization', 'Index Strategy', 'Migration Planning', 'Performance Monitoring', 'Cost Reduction'],
    benefits: ['5x faster queries', 'Reduce DB costs 50%'],
    pricing: { basic: '$2,000/mo', pro: '$5,000/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/cloud-database-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗄️', href: '/services/cloud-database-optimization', popular: false, category: 'cloud', industry: 'Technology',
  },
];

export const wave191SecurityServices: Service[] = [
  {
    id: 'security-data-loss-prevention',
    title: 'Data Loss Prevention Platform',
    description: 'DLP platform that discovers, classifies, and protects sensitive data across endpoints, cloud, and email.',
    features: ['Data Discovery', 'Content Inspection', 'Endpoint DLP', 'Cloud DLP', 'Email DLP'],
    benefits: ['Prevent data leaks', 'Meet GDPR/HIPAA'],
    pricing: { basic: '$299/mo', pro: '$899/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: '/security-data-loss-prevention', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔒', href: '/services/security-data-loss-prevention', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave191AutomationServices: Service[] = [
  {
    id: 'automation-workflow-orchestration',
    title: 'Workflow Orchestration Engine',
    description: 'Low-code workflow orchestration with 200+ integrations, conditional logic, and human-in-the-loop approvals.',
    features: ['200+ Integrations', 'Conditional Logic', 'Human-in-the-Loop', 'Version Control', 'Audit Trail'],
    benefits: ['Automate any workflow', '10x faster than custom code'],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: '$1,499/mo' },
    contactInfo: { website: '/services/automation-workflow-orchestration', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄', href: '/services/automation-workflow-orchestration', popular: true, category: 'automation', industry: 'Enterprise',
  },
];

export const wave191ItServices: Service[] = [
  {
    id: 'it-api-management',
    title: 'API Management Platform',
    description: 'Full lifecycle API management with gateway, developer portal, analytics, and monetization.',
    features: ['API Gateway', 'Developer Portal', 'Rate Limiting', 'Analytics', 'Monetization'],
    benefits: ['Launch APIs in days', 'Monetize API assets'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-api-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔌', href: '/services/it-api-management', popular: false, category: 'it', industry: 'Technology',
  },
];

export const wave191MicroSaasServices: Service[] = [
  {
    id: 'microsaas-social-media-scheduler',
    title: 'Social Media Scheduler Pro',
    description: 'Multi-platform social media scheduling with AI content suggestions, analytics, and team collaboration.',
    features: ['Multi-Platform', 'AI Content Suggestions', 'Analytics Dashboard', 'Team Collaboration', 'Bulk Scheduling'],
    benefits: ['10x faster scheduling', 'Grow engagement 3x'],
    pricing: { basic: '$19/mo', pro: '$49/mo', enterprise: '$149/mo' },
    contactInfo: { website: '/services/microsaas-social-media-scheduler', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📱', href: '/services/microsaas-social-media-scheduler', popular: false, category: 'Micro-SaaS', industry: 'Marketing',
  },
  {
    id: 'microsaas-employee-onboarding',
    title: 'Employee Onboarding Platform',
    description: 'Automated employee onboarding with task tracking, document collection, and training workflows.',
    features: ['Task Checklists', 'Document Collection', 'E-Signature', 'Training Modules', 'Progress Tracking'],
    benefits: ['Onboard 2x faster', '98% completion rate'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$499/mo' },
    contactInfo: { website: '/services/microsaas-employee-onboarding', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👋', href: '/services/microsaas-employee-onboarding', popular: false, category: 'Micro-SaaS', industry: 'HR',
  },
];
