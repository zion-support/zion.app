// Wave 190 services - OWL
// 10 new services — EnergyTech, GovTech, InsurTech, RealEstate, SpaceTech, SportsTech

import { Service } from './servicesData';

export const wave190AiServices: Service[] = [
  {
    id: 'ai-predictive-maintenance',
    title: 'AI Predictive Maintenance Platform',
    description: 'IoT sensor analysis and ML models to predict equipment failures before they happen.',
    features: ['IoT Sensor Analysis', 'Failure Prediction', 'Maintenance Scheduling', 'Parts Inventory', 'Digital Twin'],
    benefits: ['60% less unplanned downtime', 'Extend asset life 25%'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-predictive-maintenance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔧', href: '/services/ai-predictive-maintenance', popular: true, category: 'ai', industry: 'Manufacturing',
  },
  {
    id: 'ai-nlp-document-summarizer',
    title: 'AI NLP Document Summarizer',
    description: 'Automated summarization of legal, financial, and technical documents with key extraction.',
    features: ['Multi-Document Summary', 'Key Clause Extraction', 'Multi-Language', 'Custom Templates', 'API Access'],
    benefits: ['Summarize 100 pages in seconds', 'Never miss critical clauses'],
    pricing: { basic: '$149/mo', pro: '$449/mo', enterprise: '$1,499/mo' },
    contactInfo: { website: '/services/ai-nlp-document-summarizer', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📝', href: '/services/ai-nlp-document-summarizer', popular: false, category: 'ai', industry: 'Legal',
  },
];

export const wave190CloudServices: Service[] = [
  {
    id: 'cloud-edge-computing',
    title: 'Edge Computing Platform',
    description: 'Deploy and manage workloads at the edge with low-latency processing for IoT and real-time apps.',
    features: ['Edge Node Management', 'Low Latency <10ms', 'IoT Integration', 'Container Orchestration', 'Zero-Touch Provisioning'],
    benefits: ['Process data locally', 'Reduce bandwidth 80%'],
    pricing: { basic: '$299/mo', pro: '$899/mo', enterprise: '$2,999/mo' },
    contactInfo: { website: '/services/cloud-edge-computing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡', href: '/services/cloud-edge-computing', popular: false, category: 'cloud', industry: 'Technology',
  },
];

export const wave190SecurityServices: Service[] = [
  {
    id: 'security-siem-socaas',
    title: 'Security SIEM & SOC as a Service',
    description: 'Cloud-native SIEM with managed SOC, threat intelligence, and incident response.',
    features: ['Log Aggregation', 'Threat Intelligence', 'Managed SOC', 'Incident Response', 'Compliance Dashboards'],
    benefits: ['Enterprise SOC at 10% cost', 'Detect threats in minutes'],
    pricing: { basic: '$1,499/mo', pro: '$4,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/security-siem-socaas', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️', href: '/services/security-siem-socaas', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave190DataServices: Service[] = [
  {
    id: 'data-data-mesh-platform',
    title: 'Data Mesh Platform',
    description: 'Decentralized data architecture with domain ownership, self-serve infrastructure, and federated governance.',
    features: ['Domain Ownership', 'Self-Serve Platform', 'Federated Governance', 'Data Contracts', 'Product Thinking'],
    benefits: ['Scale analytics 10x', 'Empower domain teams'],
    pricing: { basic: '$799/mo', pro: '$2,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-data-mesh-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🕸️', href: '/services/data-data-mesh-platform', popular: true, category: 'data', industry: 'Technology',
  },
];

export const wave190AutomationServices: Service[] = [
  {
    id: 'automation-bpm-suite',
    title: 'Business Process Management Suite',
    description: 'Enterprise BPM with visual process design, RPA integration, and real-time analytics.',
    features: ['Visual Process Designer', 'RPA Integration', 'Real-Time Analytics', 'Mobile Approvals', 'SLA Monitoring'],
    benefits: ['Automate 80% manual processes', 'Real-time visibility'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/automation-bpm-suite', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️', href: '/services/automation-bpm-suite', popular: false, category: 'automation', industry: 'Enterprise',
  },
];

export const wave190ItServices: Service[] = [
  {
    id: 'it-digital-workspace',
    title: 'Digital Workspace Platform',
    description: 'Unified workspace with VDI, app virtualization, endpoint management, and zero trust access.',
    features: ['VDI', 'App Virtualization', 'Endpoint Management', 'Zero Trust Access', 'SSO'],
    benefits: ['Work from anywhere', 'Reduce endpoint costs 40%'],
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: '$999/mo' },
    contactInfo: { website: '/services/it-digital-workspace', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💻', href: '/services/it-digital-workspace', popular: true, category: 'it', industry: 'Technology',
  },
];

export const wave190MicroSaasServices: Service[] = [
  {
    id: 'microsaas-customer-feedback',
    title: 'Customer Feedback Analytics',
    description: 'Collect, analyze, and act on customer feedback from surveys, reviews, and support tickets.',
    features: ['NPS Surveys', 'Sentiment Analysis', 'Review Aggregation', 'Action Workflows', 'Real-Time Alerts'],
    benefits: ['Improve NPS 30%', 'Close feedback loop'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$499/mo' },
    contactInfo: { website: '/services/microsaas-customer-feedback', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💬', href: '/services/microsaas-customer-feedback', popular: false, category: 'Micro-SaaS', industry: 'SaaS',
  },
  {
    id: 'microsaas-invoice-builder',
    title: 'Invoice Builder & Payments',
    description: 'Professional invoicing with payment tracking, recurring billing, and multi-currency support.',
    features: ['Invoice Templates', 'Payment Tracking', 'Recurring Billing', 'Multi-Currency', 'Tax Compliance'],
    benefits: ['Get paid 2x faster', 'Automate billing'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/microsaas-invoice-builder', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧾', href: '/services/microsaas-invoice-builder', popular: false, category: 'Micro-SaaS', industry: 'Finance',
  },
];
