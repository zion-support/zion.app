import { Service } from './serviceTypes';

// Wave 224 — Real AI/IT/Micro-SaaS Services
// AI: Edge AI for Manufacturing QC, Predictive Customer Health Scoring
// IT: Unified Endpoint Detection & Response (UEDR), Hybrid Identity Governance
// Data: Real-Time Fraud Graph Analytics, Data Mesh-as-a-Service
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave224AiManufacturingQcServices: Service[] = [
  {
    id: 'ai-ai-manufacturing-qc',
    title: 'AI Edge Manufacturing Quality Control System',
    description: 'Deploy AI-powered visual inspection at the edge for real-time defect detection on production lines. Deep learning models analyze product images at line speed (up to 500 units/minute), catching defects invisible to the human eye. Integrates with PLCs and MES systems for automatic reject routing.',
    features: ['Real-time visual defect detection at line speed', 'Edge GPU deployment (NVIDIA Jetson, Intel Movidius)', 'Custom model training per product/SKU', 'PLC/MES integration for automatic reject routing', 'Defect classification and trend analytics', 'SPC (Statistical Process Control) dashboards'],
    benefits: ['Catch 99.5% of defects vs 80% manual inspection', 'Reduce scrap rates by 30-50%', 'Eliminate costly recalls and warranty claims', 'Inspect 100% of production, not just samples', 'Payback period typically under 6 months'],
    pricing: {basic: '$1,999/mo', pro: '$4,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-ai-manufacturing-qc', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🏭',
    href: '/services/ai-ai-manufacturing-qc',
    popular: true,
    category: 'ai',
    industry: 'Manufacturing',
    stage: 'published',
  },
  {
    id: 'ai-predictive-customer-health',
    title: 'AI Predictive Customer Health & Churn Scoring',
    description: 'Predict customer churn and expansion revenue with AI. Analyzes product usage, support tickets, NPS responses, engagement patterns, and billing data to generate per-customer health scores. Triggers automated playbooks to at-risk accounts and identifies upsell opportunities.',
    features: ['Multi-signal health scoring (usage, support, NPS, billing)', 'Churn prediction 30/60/90 days ahead', 'Automated intervention playbooks', 'Revenue expansion opportunity identification', 'CRM integration (Salesforce, HubSpot, Gainsight)', 'Account-level and segment-level dashboards'],
    benefits: ['Reduce churn by 20-35% with early intervention', 'Increase expansion revenue by 15-25%', 'Prioritize CS team effort on at-risk accounts', 'Identify silent churners before they leave', 'Data-driven customer success at scale'],
    pricing: {basic: '$499/mo', pro: '$1,299/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-predictive-customer-health', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '❤️',
    href: '/services/ai-predictive-customer-health',
    popular: true,
    category: 'ai',
    industry: 'Customer Success',
    stage: 'published',
  },
];

export const wave224ItUedrServices: Service[] = [
  {
    id: 'it-unified-endpoint-detection',
    title: 'Unified Endpoint Detection & Response (UEDR)',
    description: 'Next-gen endpoint security that unifies EDR, EPP, and vulnerability management in one agent. AI-powered threat detection, automated response playbooks, and zero-trust enforcement across Windows, macOS, Linux, and cloud workloads.',
    features: ['Unified EDR + EPP + vulnerability management', 'AI behavioral threat detection (no signatures needed)', 'Automated response and isolation playbooks', 'Zero-trust enforcement per endpoint', 'Cross-platform (Win/macOS/Linux/Cloud)', 'Managed detection option with 24/7 SOC'],
    benefits: ['One agent for complete endpoint security', 'Stop zero-day attacks with behavioral AI', 'Reduce response time from hours to seconds', 'Cut security tool sprawl and licensing costs', '24/7 monitoring with managed option'],
    pricing: {basic: '$8/device/mo', pro: '$15/device/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-unified-endpoint-detection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔍',
    href: '/services/it-unified-endpoint-detection',
    popular: true,
    category: 'it',
    industry: 'Cybersecurity',
    stage: 'published',
  },
  {
    id: 'it-hybrid-identity-governance',
    title: 'Hybrid Identity Governance & Administration (IGA)',
    description: 'Unified identity governance across on-premises Active Directory, Azure AD, and cloud IAM. Automated access certifications, segregation-of-duties enforcement, and privileged access management. Full audit trail for SOX, HIPAA, and GDPR compliance.',
    features: ['Unified identity governance (AD, Azure AD, cloud IAM)', 'Automated access reviews and certifications', 'Segregation-of-duties (SoD) enforcement', 'Privileged access management (PAM)', 'Identity lifecycle automation (joiner/mover/leaver)', 'Compliance reporting (SOX/HIPAA/GDPR)'],
    benefits: ['Govern identities across hybrid environments', 'Pass audits with automated access reviews', 'Eliminate excessive privileges', 'Automate 90% of access certifications', 'Detect and prevent SoD violations'],
    pricing: {basic: '$6/user/mo', pro: '$14/user/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-hybrid-identity-governance', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🪪',
    href: '/services/it-hybrid-identity-governance',
    popular: true,
    category: 'it',
    industry: 'Identity Management',
    stage: 'published',
  },
];

export const wave224DataFraudGraphServices: Service[] = [
  {
    id: 'data-real-time-fraud-graph',
    title: 'Real-Time Fraud Graph Analytics Engine',
    description: 'Detect complex fraud rings and money laundering networks using graph analytics and AI. Analyzes relationships between entities (accounts, devices, IPs, transactions) in real-time to uncover hidden patterns that rule-based systems miss.',
    features: ['Graph-based entity relationship analysis', 'Real-time fraud ring detection', 'Money laundering pattern recognition', 'Device fingerprinting and link analysis', 'Risk propagation across connected entities', 'Case management and investigation workflows'],
    benefits: ['Detect fraud rings rule-based systems miss', 'Reduce false positives by 50%', 'Uncover organized fraud in real-time', 'Meet AML/BSA compliance requirements', 'Resolve investigations 5x faster'],
    pricing: {basic: '$2,499/mo', pro: '$5,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/data-real-time-fraud-graph', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🕸️',
    href: '/services/data-real-time-fraud-graph',
    popular: true,
    category: 'data',
    industry: 'Financial Crime',
    stage: 'published',
  },
  {
    id: 'data-mesh-as-a-service',
    title: 'Data Mesh-as-a-Service Platform',
    description: 'Accelerate your data mesh transformation with a managed platform. Domain-oriented data product creation, self-serve data discovery, federated governance, and automated data quality monitoring. Turns decentralized data into a scalable, governed ecosystem.',
    features: ['Self-serve data product creation for domains', 'Automated data discovery and cataloging', 'Federated governance with central policies', 'Data quality monitoring per data product', 'Domain-oriented access control', 'Built-in data marketplace and sharing'],
    benefits: ['Enable data mesh without building from scratch', 'Self-serve data access for analysts', 'Federated governance scales with your org', 'Domain teams own their data products', 'Discover and share data across the organization'],
    pricing: {basic: '$999/mo', pro: '$2,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/data-mesh-as-a-service', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🕸️',
    href: '/services/data-mesh-as-a-service',
    popular: true,
    category: 'data',
    industry: 'Data Architecture',
    stage: 'published',
  },
];
