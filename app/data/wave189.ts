// Wave 189 services - OWL
// 7 new services across 7 categories - Web3, EdTech, Supply Chain, Manufacturing, Legal

import { Service } from './serviceTypes';

export const wave189AiServices: Service[] = [
  {
    id: 'ai-smart-contract-lifecycle',
    title: 'Smart Contract Lifecycle Platform',
    description: 'IDE, testing, deployment, and monitoring for smart contracts on EVM chains.',
    features: ['Solidity IDE', 'Automated Testing', 'Gas Optimization', 'Multi-Chain Deploy', 'Audit Reports'],
    benefits: ['Ship contracts faster', 'Reduce vulnerabilities 80%'],
    pricing: { basic: '$199/mo', pro: '$499/mo', enterprise: '$1,499/mo' },
    contactInfo: { website: '/services/ai-smart-contract-lifecycle', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📋', href: '/services/ai-smart-contract-lifecycle', popular: false, category: 'ai', industry: 'Blockchain',
  },
];

export const wave189DataServices: Service[] = [
  {
    id: 'data-mdm-platform',
    title: 'Data Master Data Management Platform',
    description: 'Master data management for consistent, governed golden records across enterprise systems.',
    features: ['Golden Record', 'Data Stewardship', 'Workflow Engine', 'Quality Rules', 'Multi-domain'],
    benefits: ['Single source of truth', '60% less data errors'],
    pricing: { basic: '$799/mo', pro: '$2,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-mdm-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📇', href: '/services/data-mdm-platform', popular: false, category: 'data', industry: 'Enterprise',
  },
  {
    id: 'data-supply-chain-analytics',
    title: 'Supply Chain Predictive Analytics',
    description: 'AI-powered supply chain analytics for inventory optimization, demand forecasting, and logistics.',
    features: ['Inventory Optimization', 'Demand Forecasting', 'Logistics Analytics', 'Supplier Risk', 'What-If Scenarios'],
    benefits: ['Reduce inventory 25%', 'Prevent stockouts'],
    pricing: { basic: '$599/mo', pro: '$1,499/mo', enterprise: '$4,999/mo' },
    contactInfo: { website: '/services/data-supply-chain-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔗', href: '/services/data-supply-chain-analytics', popular: false, category: 'data', industry: 'Supply Chain',
  },
];

export const wave189CloudServices: Service[] = [
  {
    id: 'cloud-hybrid-cloud-management',
    title: 'Hybrid Cloud Management Platform',
    description: 'Unified management across on-premises, private, and public cloud infrastructure.',
    features: ['Unified Dashboard', 'Cost Allocation', 'Policy Enforcement', 'Auto-Scaling', 'Multi-Cloud K8s'],
    benefits: ['Reduce complexity 70%', 'Single pane of glass'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/cloud-hybrid-cloud-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '☁️', href: '/services/cloud-hybrid-cloud-management', popular: false, category: 'cloud', industry: 'Technology',
  },
];

export const wave189SecurityServices: Service[] = [
  {
    id: 'security-identity-governance',
    title: 'Security Identity Governance & Administration',
    description: 'IGA platform for access certification, role management, and identity lifecycle automation.',
    features: ['Access Certification', 'Role Mining', 'Lifecycle Automation', 'Policy Violation', 'Audit Ready'],
    benefits: ['Reduce access risk 80%', 'Automate compliance'],
    pricing: { basic: '$349/mo', pro: '$899/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: '/services/security-identity-governance', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔐', href: '/services/security-identity-governance', popular: true, category: 'security', industry: 'Technology',
  },
];

export const wave189AutomationServices: Service[] = [
  {
    id: 'automation-smart-manufacturing',
    title: 'Smart Manufacturing Automation',
    description: 'Industry 4.0 automation connecting IoT sensors, digital twins, and production optimization.',
    features: ['IoT Integration', 'Digital Twins', 'Predictive Maintenance', 'Production Optimization', 'MES Connect'],
    benefits: ['30% less downtime', '20% higher throughput'],
    pricing: { basic: '$1,999/mo', pro: '$4,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/automation-smart-manufacturing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏭', href: '/services/automation-smart-manufacturing', popular: false, category: 'automation', industry: 'Manufacturing',
  },
];

export const wave189ItServices: Service[] = [
  {
    id: 'it-edtech-learning-platform',
    title: 'EdTech Learning Platform',
    description: 'Modern LMS with AI personalization, gamification, and virtual classroom capabilities.',
    features: ['AI Personalization', 'Gamification', 'Virtual Classroom', 'Certification Paths', 'Analytics'],
    benefits: ['40% better completion', 'Scalable to millions'],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: '$1,999/mo' },
    contactInfo: { website: '/services/it-edtech-learning-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎓', href: '/services/it-edtech-learning-platform', popular: true, category: 'it', industry: 'Education',
  },
];

export const wave189MicroSaasServices: Service[] = [
  {
    id: 'microsaas-legal-document',
    title: 'Legal Document Automation',
    description: 'AI-powered legal document creation, review, and lifecycle management for law firms.',
    features: ['Document Generation', 'Clause Library', 'E-Signature', 'Contract Analytics', 'Version Control'],
    benefits: ['Draft 10x faster', 'Reduce review time 70%'],
    pricing: { basic: '$79/mo', pro: '$199/mo', enterprise: '$599/mo' },
    contactInfo: { website: '/services/microsaas-legal-document', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️', href: '/services/microsaas-legal-document', popular: false, category: 'micro-saas', industry: 'Legal',
  },
];
