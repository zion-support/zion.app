// Wave 233 — 5 new innovative services (AI, IT, Micro-SaaS)
// Generated 2026-06-07

import { Service } from './serviceTypes';

export const wave233AiServices: Service[] = [
  {
    id: 'ai-financial-fraud-detection',
    title: 'AI-Powered Financial Fraud Detection System',
    description: 'Real-time transaction monitoring, anomaly detection, behavioral biometrics, and network analysis to prevent fraud before it happens. Machine learning models continuously adapt to emerging fraud patterns across payment channels, reducing false positives while catching sophisticated attack vectors.',
    features: [
      'Real-time transaction monitoring with sub-second scoring across all payment channels',
      'AI-driven anomaly detection using ensemble models trained on billions of transactions',
      'Behavioral biometrics analysis: keystroke dynamics, mouse patterns, and device interaction profiling',
      'Network analysis and graph-based detection to uncover organized fraud rings',
      'Adaptive machine learning models that self-tune to emerging fraud patterns',
      'Case management workflow with investigator dashboards and regulatory reporting'
    ],
    benefits: [
      'Reduce fraud losses by up to 85% with real-time detection and blocking',
      'Cut false positive rates by 60% using behavioral biometrics and adaptive ML',
      'Uncover organized fraud rings through network graph analysis',
      'Stay ahead of emerging threats with continuously learning detection models',
      'Regulatory-ready reporting simplifies compliance with PCI DSS and AML requirements'
    ],
    pricing: { basic: '$2,999/mo', pro: '$7,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-financial-fraud-detection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/ai-financial-fraud-detection',
    popular: true,
    category: 'ai',
    industry: 'Financial Services',
    stage: 'published'
  },
  {
    id: 'ai-clinical-trial-matching',
    title: 'AI Clinical Trial Matching & Recruitment Platform',
    description: 'Match patients to clinical trials using NLP on electronic health records, automated eligibility screening, and intelligent site selection. Accelerates recruitment timelines and improves match accuracy for pharmaceutical companies, CROs, and research hospitals.',
    features: [
      'NLP-powered parsing of electronic health records to extract eligibility criteria',
      'Automated patient-to-trial matching with confidence scoring and ranking',
      'Intelligent site selection based on enrollment history, demographics, and geographic reach',
      'Real-time eligibility screening with protocol-specific criteria engines',
      'Patient engagement portal with consent management and scheduling integration',
      'Analytics dashboard with enrollment forecasting, dropout prediction, and diversity metrics'
    ],
    benefits: [
      'Reduce patient recruitment timelines by 40% with AI-powered matching',
      'Improve enrollment quality with automated eligibility pre-screening',
      'Optimize site selection using historical performance and demographic data',
      'Increase trial diversity with broad EHR data coverage and inclusive matching',
      'Lower per-patient recruitment costs by up to 50% through automation'
    ],
    pricing: { basic: '$1,799/mo', pro: '$4,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-clinical-trial-matching', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧬',
    href: '/services/ai-clinical-trial-matching',
    popular: true,
    category: 'ai',
    industry: 'Healthcare/Pharma',
    stage: 'published'
  }
];

export const wave233ItServices: Service[] = [
  {
    id: 'it-asset-management-lifecycle',
    title: 'IT Asset Management & Lifecycle Service',
    description: 'Full IT asset management covering hardware and software tracking, license compliance, refresh planning, and end-of-life disposition. Centralized visibility into your entire IT estate with automated discovery, audit-ready reporting, and cost optimization recommendations.',
    features: [
      'Automated hardware and software asset discovery across on-premises and cloud environments',
      'Software license compliance tracking with usage metering and entitlement reconciliation',
      'Lifecycle management: procurement, deployment, maintenance, and end-of-life disposition',
      'Refresh planning with budget forecasting, performance scoring, and vendor comparison',
      'Audit-ready reports for SAM audits, ISO 27001, and regulatory compliance',
      'Integration with ITSM platforms including ServiceNow, Jira, and Freshservice'
    ],
    benefits: [
      'Eliminate overspending on unused software licenses with real-time usage tracking',
      'Reduce audit risk with continuous license compliance monitoring',
      'Optimize refresh cycles with data-driven lifecycle recommendations',
      'Centralize IT asset visibility across hybrid and multi-cloud environments',
      'Cut IT procurement costs by 20% through better asset utilization insights'
    ],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-asset-management-lifecycle', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💻',
    href: '/services/it-asset-management-lifecycle',
    popular: true,
    category: 'it',
    industry: 'IT Management',
    stage: 'published'
  }
];

export const wave233MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-survey-nps-platform',
    title: 'Micro-SaaS Survey & NPS Platform',
    description: 'Create beautiful surveys, collect NPS and CSAT scores, analyze results with AI-powered insights, and automate follow-up workflows. Built for teams that need enterprise-grade feedback tools without enterprise complexity or pricing.',
    features: [
      'Drag-and-drop survey builder with 30+ question types and conditional logic',
      'NPS, CSAT, and CES scoring with trend analysis and benchmark comparisons',
      'AI-powered sentiment analysis and open-text categorization',
      'Automated follow-up workflows triggered by score thresholds or response patterns',
      'Multi-channel distribution: email, SMS, in-app, QR code, and web embed',
      'Real-time analytics dashboard with segment filtering and exportable reports'
    ],
    benefits: [
      'Launch professional surveys in minutes with intuitive drag-and-drop builder',
      'AI sentiment analysis turns open-text responses into actionable insights',
      'Automated follow-ups close the feedback loop without manual effort',
      'Benchmark NPS scores against industry standards to gauge performance',
      'Multi-channel distribution maximizes response rates across customer touchpoints'
    ],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/micro-saas-survey-nps-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/micro-saas-survey-nps-platform',
    popular: true,
    category: 'micro-saas',
    industry: 'Customer Experience',
    stage: 'published'
  },
  {
    id: 'micro-saas-appointment-booking',
    title: 'Micro-SaaS Appointment Booking & Reminders',
    description: 'Online booking, automated SMS and email reminders, calendar sync, and payment collection in one simple platform. Designed for professional services — consultants, salons, clinics, and tutors — who need to reduce no-shows and streamline scheduling.',
    features: [
      'Online booking page with customizable availability, buffer times, and service types',
      'Automated SMS and email reminders with configurable timing and templates',
      'Two-way calendar sync with Google Calendar, Outlook, and Apple Calendar',
      'Integrated payment collection via Stripe and PayPal at the time of booking',
      'Client management with appointment history, notes, and recurring booking support',
      'No-show tracking with automated follow-up and rescheduling workflows'
    ],
    benefits: [
      'Reduce no-shows by 75% with automated SMS and email reminders',
      'Eliminate back-and-forth scheduling with self-service online booking',
      'Get paid upfront with integrated Stripe and PayPal payment collection',
      'Calendar sync prevents double-bookings and keeps your schedule organized',
      'Recurring booking support retains clients with effortless repeat scheduling'
    ],
    pricing: { basic: '$39/mo', pro: '$99/mo', enterprise: '$249/mo' },
    contactInfo: { website: '/services/micro-saas-appointment-booking', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📅',
    href: '/services/micro-saas-appointment-booking',
    popular: true,
    category: 'micro-saas',
    industry: 'Professional Services',
    stage: 'published'
  }
];
