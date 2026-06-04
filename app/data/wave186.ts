// Wave 186 services - OWL
// 6 new services across 6 categories

import { Service } from './serviceTypes';

export const wave186AiServices: Service[] = [
  {
    id: 'ai-code-review-assistant',
    title: 'AI Code Review Assistant',
    description: 'Automated code review using AI to detect bugs, security vulnerabilities, and code quality issues.',
    features: ['Bug Detection', 'Security Scanning', 'Style Enforcement', 'PR Automation', 'Multi-Language'],
    benefits: ['80% faster reviews', 'Catch bugs pre-merge'],
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-code-review-assistant', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖', href: '/services/ai-code-review-assistant', popular: true, category: 'ai', industry: 'Technology',
  },
];

export const wave186DataServices: Service[] = [
  {
    id: 'data-customer-churn-analytics',
    title: 'Customer Churn Analytics',
    description: 'Predictive analytics platform to identify at-risk customers and recommend retention strategies.',
    features: ['Churn Prediction', 'Risk Scoring', 'Retention Automation', 'Customer Segmentation', 'Real-Time Alerts'],
    benefits: ['Reduce churn 35%', 'Increase LTV'],
    pricing: { basic: '$299/mo', pro: '$799/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: '/services/data-customer-churn-analytics', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊', href: '/services/data-customer-churn-analytics', popular: false, category: 'data', industry: 'SaaS',
  },
];

export const wave186SecurityServices: Service[] = [
  {
    id: 'security-zero-trust-network',
    title: 'Security Zero Trust Network Access',
    description: 'ZTNA solution replacing VPN with identity-aware micro-segmented access to internal applications.',
    features: ['Identity-Aware Access', 'Micro-Segmentation', 'No VPN Required', 'Device Posture', 'Audit Logs'],
    benefits: ['60% fewer breaches', 'Seamless remote access'],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: '$1,999/mo' },
    contactInfo: { website: '/services/security-zero-trust-network', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️', href: '/services/security-zero-trust-network', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave186AutomationServices: Service[] = [
  {
    id: 'automation-intelligent-document',
    title: 'Automation Intelligent Document Processing',
    description: 'AI-powered document processing that extracts, classifies, and routes documents automatically.',
    features: ['OCR + AI Extraction', 'Document Classification', 'Workflow Routing', 'ERP Integration', '99.5% Accuracy'],
    benefits: ['90% less manual data entry', 'Process 10x faster'],
    pricing: { basic: '$499/mo', pro: '$1,299/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/automation-intelligent-document', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📄', href: '/services/automation-intelligent-document', popular: false, category: 'automation', industry: 'Finance',
  },
];

export const wave186ItServices: Service[] = [
  {
    id: 'it-managed-detection-response',
    title: 'IT Managed Detection and Response',
    description: '24/7 managed SOC service with threat detection, incident response, and forensic analysis.',
    features: ['24/7 Monitoring', 'Threat Hunting', 'Incident Response', 'Forensics', 'Compliance Reporting'],
    benefits: ['Detect threats in minutes', 'Meet compliance'],
    pricing: { basic: '$2,999/mo', pro: '$5,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-managed-detection-response', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍', href: '/services/it-managed-detection-response', popular: true, category: 'it', industry: 'Technology',
  },
];

export const wave186MicroSaasServices: Service[] = [
  {
    id: 'microsaas-feature-voting',
    title: 'Feature Voting Board',
    description: 'Customer feedback and feature voting platform to democratize your product roadmap.',
    features: ['Public Roadmap', 'Feature Voting', 'Changelog', 'User Segmentation', 'Analytics Dashboard'],
    benefits: ['Build what users want', 'Reduce churn 20%'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/microsaas-feature-voting', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗳️', href: '/services/microsaas-feature-voting', popular: false, category: 'micro-saas', industry: 'SaaS',
  },
];

export const wave186CloudServices: Service[] = [];
