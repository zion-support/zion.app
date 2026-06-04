// Wave 188 services - OWL
// 7 new services across 7 categories

import { Service } from './serviceTypes';

export const wave188DataServices: Service[] = [
  {
    id: 'data-catalog-governance',
    title: 'Data Catalog & Governance Platform',
    description: 'Enterprise data catalog with automated discovery, lineage tracking, and governance policies.',
    features: ['Auto Discovery', 'Data Lineage', 'Policy Engine', 'Quality Scoring', 'Business Glossary'],
    benefits: ['Find data instantly', 'Ensure compliance'],
    pricing: { basic: '$599/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-catalog-governance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📚', href: '/services/data-catalog-governance', popular: true, category: 'data', industry: 'Technology',
  },
];

export const wave188CloudServices: Service[] = [
  {
    id: 'cloud-finops-cost-optimization',
    title: 'Cloud FinOps Cost Optimization',
    description: 'Comprehensive FinOps platform for multi-cloud cost visibility, optimization, and governance.',
    features: ['Multi-Cloud Visibility', 'Anomaly Detection', 'Right-Sizing', 'Reserved Instance Mgmt', 'Chargeback'],
    benefits: ['Save 40% cloud costs', 'Real-time visibility'],
    pricing: { basic: '$399/mo', pro: '$999/mo', enterprise: '$2,999/mo' },
    contactInfo: { website: '/services/cloud-finops-cost-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💰', href: '/services/cloud-finops-cost-optimization', popular: true, category: 'cloud', industry: 'Finance',
  },
];

export const wave188SecurityServices: Service[] = [
  {
    id: 'security-cloud-posture-management',
    title: 'Security Cloud Security Posture Management',
    description: 'Continuous multi-cloud security posture assessment with auto-remediation and compliance mapping.',
    features: ['CSPM', 'Auto-Remediation', 'Compliance Mapping', 'Risk Prioritization', 'Drift Detection'],
    benefits: ['Reduce misconfigurations 95%', 'Continuous compliance'],
    pricing: { basic: '$449/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/security-cloud-posture-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️', href: '/services/security-cloud-posture-management', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave188AiServices: Service[] = [
  {
    id: 'ai-multimodal-search',
    title: 'AI Multimodal Search Engine',
    description: 'Search across text, images, audio, and video using natural language queries and embedding-based retrieval.',
    features: ['Text + Image + Audio', 'Natural Language Queries', 'Embedding Search', 'Real-Time Indexing', 'API-First'],
    benefits: ['10x better relevance', 'Search everything'],
    pricing: { basic: '$299/mo', pro: '$899/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-multimodal-search', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔎', href: '/services/ai-multimodal-search', popular: true, category: 'ai', industry: 'Technology',
  },
];

export const wave188MicroSaasServices: Service[] = [
  {
    id: 'microsaas-churn-prediction',
    title: 'Churn Prediction Suite',
    description: 'ML-powered churn prediction with automated retention campaigns and health scoring.',
    features: ['ML Churn Models', 'Health Scoring', 'Automated Campaigns', 'Cohort Analysis', 'Revenue Forecasting'],
    benefits: ['Predict churn 90% accuracy', 'Save at-risk accounts'],
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/microsaas-churn-prediction', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊', href: '/services/microsaas-churn-prediction', popular: false, category: 'micro-saas', industry: 'SaaS',
  },
];

export const wave188HealthcareItServices: Service[] = [
  {
    id: 'healthcare-clinical-trial-management',
    title: 'Healthcare Clinical Trial Management',
    description: 'End-to-end clinical trial management with patient recruitment, eConsent, and regulatory compliance.',
    features: ['Patient Recruitment', 'eConsent', 'Protocol Management', 'Regulatory Docs', 'Data Analytics'],
    benefits: ['30% faster recruitment', 'Audit-ready compliance'],
    pricing: { basic: '$1,999/mo', pro: '$4,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/healthcare-clinical-trial-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧬', href: '/services/healthcare-clinical-trial-management', popular: true, category: 'it', industry: 'Healthcare',
  },
];

export const wave188ItServices: Service[] = [
  {
    id: 'it-itsm-platform',
    title: 'IT ITSM Platform',
    description: 'Modern IT service management with asset discovery, change management, and self-service portal.',
    features: ['Asset Discovery', 'Change Mgmt', 'Self-Service Portal', 'SLA Tracking', 'CMDB'],
    benefits: ['50% faster resolution', 'Full asset visibility'],
    pricing: { basic: '$149/mo', pro: '$449/mo', enterprise: '$1,499/mo' },
    contactInfo: { website: '/services/it-itsm-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎫', href: '/services/it-itsm-platform', popular: true, category: 'it', industry: 'Technology',
  },
];

export const wave188AutomationServices: Service[] = [];
