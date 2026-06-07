import { Service } from './serviceTypes';

// Wave 225 — Micro-SaaS, AI, IT & Security Services
// Micro-SaaS: Board Meeting Management, Contract Lifecycle Tracker, Employee Pulse Surveys
// AI: Multilingual Document Translation, Voice-to-CRM Auto-Logging
// Security: Cloud-Native Application Protection Platform (CNAPP)
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave225MicroSaasBoardMgmtServices: Service[] = [
  {
    id: 'microsaas-board-meeting-manager',
    title: 'Micro-SaaS Board Meeting Management & Governance Portal',
    description: 'Complete board management platform for generating board books, tracking action items, managing approvals, and maintaining governance records. Secure role-based access with e-signatures, voting, and audit trails. Designed for SMBs and non-profits.',
    features: ['Drag-and-drop board book builder', 'Automated meeting agenda creation', 'Secure document distribution with role-based access', 'E-signatures and resolution voting', 'Action item tracking and follow-up reminders', 'Governance record archive with full audit trail'],
    benefits: ['Cut board prep time by 80%', 'Eliminate printing and mailing board books', 'Track every action item to completion', 'Maintain audit-ready governance records', 'Secure access from any device'],
    pricing: {basic: '$99/mo', pro: '$249/mo', enterprise: '$499/mo'},
    contactInfo: {website: '/services/microsaas-board-meeting-manager', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🏛️',
    href: '/services/microsaas-board-meeting-manager',
    popular: true,
    category: 'micro-saas',
    industry: 'Corporate Governance',
    stage: 'published',
  },
  {
    id: 'microsaas-contract-lifecycle-tracker',
    title: 'Micro-SaaS Contract Lifecycle Management (CLM)',
    description: 'Simple, affordable CLM for small and mid-size businesses. Track contract milestones, auto-renewal deadlines, deliverables, and obligations. No enterprise complexity — just the features growing businesses need to stay on top of contracts.',
    features: ['Contract repository with full-text search', 'Auto-renewal deadline alerts', 'Milestone and deliverables tracking', 'Obligation compliance monitoring', 'Approval workflows and e-signatures', 'Vendor performance scorecards'],
    benefits: ['Never miss a renewal deadline', 'Track all obligations in one place', 'Get alerts 30/60/90 days before key dates', 'Simple setup in under 30 minutes', '100x cheaper than enterprise CLM'],
    pricing: {basic: '$39/mo', pro: '$99/mo', enterprise: '$249/mo'},
    contactInfo: {website: '/services/microsaas-contract-lifecycle-tracker', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📋',
    href: '/services/microsaas-contract-lifecycle-tracker',
    popular: true,
    category: 'micro-saaS',
    industry: 'Legal & Compliance',
    stage: 'published',
  },
  {
    id: 'microsaas-employee-pulse',
    title: 'Micro-SaaS Employee Pulse & Culture Analytics',
    description: 'Weekly pulse surveys with AI-powered sentiment analysis, culture benchmarking, and engagement trend tracking. Quick 1-5 minute surveys keep a finger on organizational health. Manager-level dashboards with anonymized team insights.',
    features: ['Weekly pulse surveys (1-5 minutes to complete)', 'AI sentiment analysis on open responses', 'Culture and engagement benchmarking', 'Manager dashboards with team insights', 'Anonymous feedback channel', 'Action recommendation engine'],
    benefits: ['Track culture and engagement weekly', 'Identify teams needing support before burnout', 'Benchmark against industry standards', 'Anonymous channels encourage honest feedback', 'AI recommends actions for managers'],
    pricing: {basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo'},
    contactInfo: {website: '/services/microsaas-employee-pulse', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '💡',
    href: '/services/microsaas-employee-pulse',
    popular: true,
    category: 'micro-saas',
    industry: 'Human Resources',
    stage: 'published',
  },
];

export const wave225AiTranslationServices: Service[] = [
  {
    id: 'ai-multilingual-document-translation',
    title: 'AI Multilingual Document Translation Engine',
    description: 'Enterprise-grade document translation that preserves formatting across 100+ languages. Handles PDFs, Word docs, presentations, and HTML with context-aware AI translation. Industry-specific models for legal, medical, financial, and technical content.',
    features: ['Format-preserving translation (PDF, DOCX, PPTX, HTML)', '100+ language pairs with quality scoring', 'Industry-specific models (legal, medical, financial, technical)', 'Terminology glossary enforcement', 'Human review workflow integration', 'API for batch and real-time translation'],
    benefits: ['Translate documents 50x faster than manual', 'Preserve complex formatting automatically', 'Industry-specific accuracy, not generic translation', 'Enforce brand terminology automatically', 'Scale translation without hiring translators'],
    pricing: {basic: '$0.02/page', pro: '$0.05/page', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-multilingual-document-translation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🌐',
    href: '/services/ai-multilingual-document-translation',
    popular: true,
    category: 'ai',
    industry: 'Enterprise AI',
    stage: 'published',
  },
  {
    id: 'ai-voice-to-crm-logger',
    title: 'AI Voice-to-CRM Auto-Logging Assistant',
    description: 'Automatically logs sales calls, meetings, and voice notes into your CRM. AI transcribes conversations, extracts action items, identifies deal signals, and creates CRM records. Works with Zoom, Teams, Google Meet, and phone calls.',
    features: ['Automatic call transcription (Zoom, Teams, Meet, phone)', 'AI extraction of action items, deals, contacts', 'CRM record auto-creation (Salesforce, HubSpot, Dynamics)', 'Deal signal detection (budget, timeline, authority)', 'Follow-up email drafts from call notes', 'Compliance recording and archiving'],
    benefits: ['Eliminate manual CRM data entry', 'Never lose a detail from a sales call', 'Capture deal signals automatically', 'Follow up faster with AI-drafted emails', 'Full call archive for compliance and training'],
    pricing: {basic: '$49/mo', pro: '$149/mo', enterprise: '$399/mo'},
    contactInfo: {website: '/services/ai-voice-to-crm-logger', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎙️',
    href: '/services/ai-voice-to-crm-logger',
    popular: true,
    category: 'ai',
    industry: 'Sales Automation',
    stage: 'published',
  },
];

export const wave225SecurityCnappServices: Service[] = [
  {
    id: 'security-cnapp-platform',
    title: 'Cloud-Native Application Protection Platform (CNAPP)',
    description: 'Unified cloud security platform that combines CSPM, CWPP, CIEM, and container security into a single dashboard. Scans IaC templates in CI/CD, protects cloud workloads at runtime, and maps attack paths across your entire cloud estate.',
    features: ['Cloud Security Posture Management (CSPM)', 'Cloud Workload Protection (CWPP)', 'Cloud Infrastructure Entitlement Management (CIEM)', 'Container and Kubernetes security scanning', 'IaC security scanning in CI/CD pipelines', 'Attack path analysis and prioritization'],
    benefits: ['One platform for all cloud security needs', 'Shift-left security into development', 'Prioritize fixes with attack path analysis', 'Reduce misconfigurations by 90%', 'Meet cloud compliance frameworks (CSFS, SOC 2, PCI)'],
    pricing: {basic: '$999/mo', pro: '$2,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/security-cnapp-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '☁️',
    href: '/services/security-cnapp-platform',
    popular: true,
    category: 'security',
    industry: 'Cloud Security',
    stage: 'published',
  },
];

export const wave225DataCatalogAiServices: Service[] = [
  {
    id: 'data-ai-catalog-discovery',
    title: 'AI-Powered Data Catalog & Discovery Platform',
    description: 'Automatically discover, classify, and catalog all data assets across your organization. AI infers data types, detects PII, maps lineage, and makes data searchable. Self-service data discovery for analysts with built-in quality metrics.',
    features: ['Automated data discovery across databases and warehouses', 'AI classification and PII detection', 'Auto-mapped data lineage', 'Self-service search and discovery portal', 'Data quality scoring per asset', 'Business glossary and data dictionary'],
    benefits: ['Discover shadow data you did not know existed', 'Find the data you need in seconds, not days', 'Detect and protect PII automatically', 'Trust data with quality scores', 'Meet data governance requirements'],
    pricing: {basic: '$499/mo', pro: '$1,199/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/data-ai-catalog-discovery', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📚',
    href: '/services/data-ai-catalog-discovery',
    popular: true,
    category: 'data',
    industry: 'Data Governance',
    stage: 'published',
  },
];
