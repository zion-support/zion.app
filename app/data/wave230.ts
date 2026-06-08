import { Service } from './serviceTypes';

// Wave 230 — Real AI/IT/Micro-SaaS Services (Batch 3)
// AI: AI-Powered Legal Document Review & Contract Analysis, AI Customer Churn Prediction & Prevention Platform, AI-Powered Recruitment Screening & Candidate Matching
// IT: Managed Detection & Response (MDR) Cybersecurity Service
// Micro-SaaS: Micro-SaaS Client Portal & Ticketing System
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave230AiLegalDocReviewServices: Service[] = [
  {
    id: 'ai-legal-document-review-contract-analysis',
    title: 'AI-Powered Legal Document Review & Contract Analysis',
    description: 'Automate legal document review and contract analysis with NLP-based AI. Clause extraction, risk scoring, deviation detection, and obligation tracking. Reduce contract review time from days to minutes while improving accuracy. Supports NDAs, MSAs, SOWs, employment agreements, and procurement contracts.',
    features: ['NLP-based clause extraction and categorization', 'Risk scoring per clause and overall contract', 'Deviation detection against standard templates', 'Obligation and deadline tracking', 'Multi-language contract support (EN, ES, FR, DE, PT)', 'Integration with CLM platforms (Ironclad, DocuSign, Agiloft)'],
    benefits: ['Review contracts 20x faster than manual', 'Catch 95% of non-standard clauses', 'Eliminate human oversight in routine reviews', 'Standardize legal review workflows', 'Reduce external counsel costs by 40%'],
    pricing: {basic: '$1,999/mo', pro: '$4,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-legal-document-review-contract-analysis', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '⚖️',
    href: '/services/ai-legal-document-review-contract-analysis',
    popular: true,
    category: 'ai',
    industry: 'Legal Technology',
    stage: 'published',
  },
  {
    id: 'ai-customer-churn-prediction-prevention',
    title: 'AI Customer Churn Prediction & Prevention Platform',
    description: 'Predict and prevent customer churn with machine learning models that analyze behavioral signals, usage patterns, support interactions, and billing history. Identify at-risk customers 60 days before they leave and trigger automated retention campaigns.',
    features: ['ML-based churn prediction (60-day lookahead)', 'Customer health scoring (0-100 scale)', 'Automated retention campaign triggers', 'Root cause churn analysis (feature-level)', 'Integration with CRM (Salesforce, HubSpot)', 'A/B testing for retention strategies'],
    benefits: ['Reduce churn by 25-40% within 6 months', 'Increase customer lifetime value by 30%', 'Prioritize at-risk accounts for CSMs', 'Quantify impact of product changes on retention', 'Automate win-back campaigns at scale'],
    pricing: {basic: '$799/mo', pro: '$2,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-customer-churn-prediction-prevention', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📊',
    href: '/services/ai-customer-churn-prediction-prevention',
    popular: true,
    category: 'ai',
    industry: 'Customer Success',
    stage: 'published',
  },
  {
    id: 'ai-recruitment-screening-candidate-matching',
    title: 'AI-Powered Recruitment Screening & Candidate Matching',
    description: 'Transform your hiring process with AI that parses resumes, ranks candidates against job criteria, detects screening bias, and automates interview scheduling. Reduce time-to-hire while improving candidate quality and diversity.',
    features: ['AI resume parsing (PDF, DOCX, LinkedIn)', 'Intelligent candidate ranking against job criteria', 'Bias detection in screening decisions', 'Automated interview scheduling (Calendlo integration)', 'ATS integration (Greenhouse, Lever, Workable)', 'Diversity analytics and reporting dashboard'],
    benefits: ['Screen 1000+ resumes in under 5 minutes', 'Reduce time-to-hire by 50%', 'Unbiased candidate evaluation', 'Improve quality-of-hire scores', 'Free recruiters from manual screening tasks'],
    pricing: {basic: '$499/mo', pro: '$1,299/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-recruitment-screening-candidate-matching', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🧑‍💼',
    href: '/services/ai-recruitment-screening-candidate-matching',
    popular: true,
    category: 'ai',
    industry: 'Human Resources',
    stage: 'published',
  },
];

export const wave230ItMdrCybersecurityServices: Service[] = [
  {
    id: 'it-managed-detection-response-cybersecurity',
    title: 'Managed Detection & Response (MDR) Cybersecurity Service',
    description: '24/7 managed security operations center (SOC) providing continuous threat monitoring, proactive threat hunting, endpoint detection and response (EDR), and rapid incident response. Expert analysts backed by AI-driven threat detection protect your organization around the clock.',
    features: ['24/7/365 SOC monitoring by certified analysts', 'Proactive threat hunting across endpoints and network', 'Endpoint Detection & Response (EDR) management', 'Incident response with <30 minute SLA', 'Threat intelligence integration and correlation', 'Monthly security posture reports and recommendations'],
    benefits: ['Enterprise-grade security at 1/3 the cost of in-house SOC', 'Detect threats that automated tools miss', 'Respond to incidents in minutes, not hours', 'Meet SOX, HIPAA, PCI-DSS compliance requirements', 'Sleep knowing experts are watching your environment'],
    pricing: {basic: '$3,999/mo', pro: '$8,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-managed-detection-response-cybersecurity', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🛡️',
    href: '/services/it-managed-detection-response-cybersecurity',
    popular: true,
    category: 'it',
    industry: 'Cybersecurity',
    stage: 'published',
  },
];

export const wave230MicroSaasClientPortalServices: Service[] = [
  {
    id: 'microsaas-client-portal-ticketing',
    title: 'Micro-SaaS Client Portal & Ticketing System',
    description: 'White-label client portal with integrated support ticketing, knowledge base, and SLA tracking. Give your clients a professional self-service experience while streamlining your support operations. Fully brandable and deployable in under 48 hours.',
    features: ['White-label client portal with custom branding', 'Support ticketing with priority and category routing', 'Self-service knowledge base (articles, FAQs, guides)', 'SLA tracking with automated escalation', 'Client onboarding workflows and task lists', 'Analytics dashboard (ticket volume, CSAT, resolution time)'],
    benefits: ['Launch a professional client portal in 48 hours', 'Reduce support ticket volume by 35% with self-service', 'Meet SLA commitments with automated escalation', 'Improve NPS with transparent ticket tracking', 'Scale support without proportional headcount growth'],
    pricing: {basic: '$79/mo', pro: '$199/mo', enterprise: '$499/mo'},
    contactInfo: {website: '/services/microsaas-client-portal-ticketing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🏢',
    href: '/services/microsaas-client-portal-ticketing',
    popular: false,
    category: 'micro-saas',
    industry: 'Customer Support',
    stage: 'published',
  },
];
