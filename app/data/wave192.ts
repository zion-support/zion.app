// Wave 192 services - OWL
// 10 new services — Cybersecurity, FinTech, HealthTech, Logistics, PropTech, CleanTech

import { Service } from './serviceTypes';

export const wave192AiServices: Service[] = [
  {
    id: 'ai-fraud-detection',
    title: 'AI Fraud Detection System',
    description: 'Real-time fraud detection using graph neural networks, anomaly detection, and behavioral biometrics.',
    features: ['Graph Neural Networks', 'Anomaly Detection', 'Behavioral Biometrics', 'Real-Time Scoring', 'Case Management'],
    benefits: ['Detect fraud in <100ms', 'Reduce false positives 90%'],
    pricing: { basic: '$999/mo', pro: '$2,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-fraud-detection', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🕵️', href: '/services/ai-fraud-detection', popular: true, category: 'ai', industry: 'Finance',
  },
  {
    id: 'ai-regulatory-compliance',
    title: 'AI Regulatory Compliance Engine',
    description: 'Automated regulatory compliance monitoring, reporting, and risk assessment across jurisdictions.',
    features: ['RegChange Monitoring', 'Risk Assessment', 'Auto Reporting', 'Multi-Jurisdiction', 'Audit Trail'],
    benefits: ['Stay compliant automatically', 'Reduce compliance costs 60%'],
    pricing: { basic: '$799/mo', pro: '$2,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-regulatory-compliance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️', href: '/services/ai-regulatory-compliance', popular: false, category: 'ai', industry: 'Compliance',
  },
];

export const wave192CloudServices: Service[] = [
  {
    id: 'cloud-multi-cloud-networking',
    title: 'Multi-Cloud Networking Fabric',
    description: 'Unified networking across AWS, Azure, and GCP with SD-WAN, service mesh, and traffic optimization.',
    features: ['AWS + Azure + GCP', 'SD-WAN', 'Service Mesh', 'Traffic Optimization', 'Zero Trust'],
    benefits: ['Connect any cloud', 'Reduce latency 50%'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/cloud-multi-cloud-networking', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐', href: '/services/cloud-multi-cloud-networking', popular: false, category: 'cloud', industry: 'Technology',
  },
];

export const wave192SecurityServices: Service[] = [
  {
    id: 'security-pen-testing',
    title: 'Automated Penetration Testing',
    description: 'Continuous automated pen testing with vulnerability scanning, exploit validation, and remediation guidance.',
    features: ['Vulnerability Scanning', 'Exploit Validation', 'Remediation Guidance', 'Compliance Reports', 'API Coverage'],
    benefits: ['Find vulnerabilities 24/7', 'Meet SOC 2 / PCI DSS'],
    pricing: { basic: '$299/mo', pro: '$899/mo', enterprise: '$2,999/mo' },
    contactInfo: { website: '/services/security-pen-testing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯', href: '/services/security-pen-testing', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave192DataServices: Service[] = [
  {
    id: 'data-observability-platform',
    title: 'Data Observability Platform',
    description: 'End-to-end data observability with freshness, volume, schema, and lineage monitoring.',
    features: ['Freshness Monitoring', 'Volume Anomalies', 'Schema Drift', 'Lineage Tracking', 'SLAs'],
    benefits: ['Find data issues before users', 'Reduce MTTR 80%'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-observability-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👁️', href: '/services/data-observability-platform', popular: true, category: 'data', industry: 'Technology',
  },
];

export const wave192AutomationServices: Service[] = [
  {
    id: 'automation-test-automation',
    title: 'Test Automation Platform',
    description: 'AI-powered test automation with self-healing tests, visual testing, and cross-browser coverage.',
    features: ['Self-Healing Tests', 'Visual Testing', 'Cross-Browser', 'API Testing', 'CI/CD Integration'],
    benefits: ['10x faster test creation', 'Reduce flaky tests 95%'],
    pricing: { basic: '$299/mo', pro: '$899/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: '/services/automation-test-automation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧪', href: '/services/automation-test-automation', popular: false, category: 'automation', industry: 'Technology',
  },
];

export const wave192ItServices: Service[] = [
  {
    id: 'it-siem-correlation',
    title: 'SIEM Log Correlation Engine',
    description: 'Advanced log correlation with rule-based and ML-powered threat detection and response automation.',
    features: ['Log Correlation', 'Rule Engine', 'ML Threat Detection', 'Playbook Automation', 'Threat Intel'],
    benefits: ['Detect threats others miss', 'Automate response'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-siem-correlation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡', href: '/services/it-siem-correlation', popular: false, category: 'it', industry: 'Security',
  },
];

export const wave192MicroSaasServices: Service[] = [
  {
    id: 'microsaas-booking-scheduler',
    title: 'Booking & Scheduler Pro',
    description: 'Online booking and scheduling system with payments, reminders, and calendar sync for service businesses.',
    features: ['Online Booking', 'Payment Processing', 'SMS Reminders', 'Calendar Sync', 'Multi-Staff'],
    benefits: ['Fill schedule automatically', 'Reduce no-shows 80%'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/microsaas-booking-scheduler', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📅', href: '/services/microsaas-booking-scheduler', popular: true, category: 'micro-saas', industry: 'Services',
  },
  {
    id: 'microsaas-reputation-manager',
    title: 'Reputation Manager',
    description: 'Monitor and manage online reviews across Google, Yelp, and social media with AI response suggestions.',
    features: ['Review Monitoring', 'AI Response Suggestions', 'Review Generation', 'Sentiment Analysis', 'Multi-Location'],
    benefits: ['4.5+ stars everywhere', 'Respond 10x faster'],
    pricing: { basic: '$39/mo', pro: '$99/mo', enterprise: '$299/mo' },
    contactInfo: { website: '/services/microsaas-reputation-manager', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⭐', href: '/services/microsaas-reputation-manager', popular: false, category: 'micro-saas', industry: 'Marketing',
  },
];
