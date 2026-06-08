import { Service } from './serviceTypes';

// Wave 222 — Micro-SaaS Appointment CRM, IT Patch Management, Security SOC AI Copilot,
// Data Contract Enforcement, Automation Email Campaign Orchestrator, 
// Micro-SaaS Feedback Loop Analytics, AI Competitive Intelligence Monitor
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave222MicroSaasAppointmentCrmServices: Service[] = [
  {
    id: 'microsaas-appointment-crm',
    title: 'Micro-SaaS Appointment & CRM Suite',
    description: 'Lightweight appointment booking with built-in CRM for service businesses (salons, clinics, consultants). Online scheduling, automated reminders, client history, and payment collection in one simple app. No bloated features, just what small businesses need.',
    features: ['Online self-service booking page', 'Automated SMS/email reminders (reduces no-shows 40%)', 'Client history and notes', 'Stripe/Square payment collection at booking', 'Calendar sync (Google, Outlook)', 'Simple analytics: bookings, revenue, retention'],
    benefits: ['Reduce no-shows by 40% with automated reminders', 'Collect payments at time of booking', 'All client info in one place', 'Set up in under 15 minutes', 'No complex CRM learning curve'],
    pricing: {basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo'},
    contactInfo: {website: '/services/microsaas-appointment-crm', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📅',
    href: '/services/microsaas-appointment-crm',
    popular: true,
    category: 'micro-saas',
    industry: 'Small Business',
    stage: 'published',
  },
];

export const wave222ItPatchManagementServices: Service[] = [
  {
    id: 'it-patch-management-automation',
    title: 'IT Patch Management & Compliance Automation',
    description: 'Automate OS and application patching across Windows, Linux, and macOS endpoints. Test patches in staging, enforce SLA timelines, generate compliance reports for SOC 2, HIPAA, and PCI DSS. Zero-touch patching for critical CVEs.',
    features: ['Cross-platform patch deployment (Win/Linux/Mac)', 'Staging ring testing before production', 'Critical CVE auto-patch within 24h SLA', 'Patch compliance reporting (SOC 2/HIPAA/PCI)', 'Third-party app patching (Chrome, Java, etc.)', 'Rollback capability for failed patches'],
    benefits: ['Close critical vulnerabilities within 24 hours', 'Eliminate manual patch tracking spreadsheets', 'Pass compliance audits with automated reports', 'Reduce patch-related incidents by 90%', 'Test before deploying to production'],
    pricing: {basic: '$3/device/mo', pro: '$6/device/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-patch-management-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🩹',
    href: '/services/it-patch-management-automation',
    popular: true,
    category: 'it',
    industry: 'IT Operations',
    stage: 'published',
  },
];

export const wave222SecuritySocAiCopilotServices: Service[] = [
  {
    id: 'security-soc-ai-copilot',
    title: 'Security SOC AI Copilot — Analyst Force Multiplier',
    description: 'AI copilot for Security Operations Center analysts. Automatically triages alerts, enriches with threat intel, suggests investigation steps, and drafts incident reports. Reduces MTTD by 60% and analyst fatigue by 50%.',
    features: ['AI alert triage and prioritization', 'Threat intelligence enrichment (VirusTotal, Shodan, MITRE)', 'Step-by-step investigation guidance', 'Auto-drafted incident reports', 'Playbook recommendations based on alert type', 'Integration with Sentinel, Splunk, QRadar, Demisto'],
    benefits: ['Reduce mean-time-to-detect by 60%', 'Cut analyst alert fatigue by 50%', 'Junior analysts perform like seniors', 'Consistent investigation quality every time', 'Free analysts for proactive threat hunting'],
    pricing: {basic: '$999/mo', pro: '$2,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/security-soc-ai-copilot', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🛡️',
    href: '/services/security-soc-ai-copilot',
    popular: true,
    category: 'security',
    industry: 'Cybersecurity',
    stage: 'published',
  },
];

export const wave222DataContractEnforcementServices: Service[] = [
  {
    id: 'data-contract-enforcement-platform',
    title: 'Data Contract Enforcement Platform',
    description: 'Define, enforce, and monitor data contracts between producers and consumers. Prevent breaking schema changes, validate data quality SLAs, and auto-generate documentation. Essential for data mesh and platform engineering teams.',
    features: ['Schema versioning and contract definitions', 'Breaking change detection and blocking', 'Data quality SLA enforcement per contract', 'Auto-generated API documentation', 'Contract testing in CI/CD pipelines', 'Consumer notification on contract changes'],
    benefits: ['Eliminate downstream data breakages', 'Enforce data quality at the source', 'Auto-document APIs and schemas', 'Shift-left data quality into CI/CD', 'Build trust between data teams'],
    pricing: {basic: '$499/mo', pro: '$1,199/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/data-contract-enforcement-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📜',
    href: '/services/data-contract-enforcement-platform',
    popular: true,
    category: 'data',
    industry: 'Data Platform Engineering',
    stage: 'published',
  },
];

export const wave222AutomationEmailCampaignServices: Service[] = [
  {
    id: 'automation-email-campaign-orchestrator',
    title: 'Email Campaign Orchestrator & Deliverability Suite',
    description: 'End-to-end email campaign automation with AI-powered content generation, send-time optimization, deliverability monitoring, and A/B testing. Warm up new domains, manage sender reputation, and stay out of spam.',
    features: ['AI subject line and body generation', 'Send-time optimization per recipient', 'Deliverability monitoring (spam score, bounce rate)', 'Domain warm-up and reputation management', 'A/B testing with statistical significance', 'List segmentation and suppression management'],
    benefits: ['Improve open rates by 35% with AI-optimized sends', 'Protect sender reputation automatically', 'Never land in spam with deliverability monitoring', 'Generate email content in seconds', 'Reach inbox at the right time for each contact'],
    pricing: {basic: '$99/mo', pro: '$299/mo', enterprise: '$799/mo'},
    contactInfo: {website: '/services/automation-email-campaign-orchestrator', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📧',
    href: '/services/automation-email-campaign-orchestrator',
    popular: true,
    category: 'automation',
    industry: 'Email Marketing',
    stage: 'published',
  },
];

export const wave222MicroSaasFeedbackServices: Service[] = [
  {
    id: 'microsaas-feedback-loop-analytics',
    title: 'Micro-SaaS Customer Feedback Loop Analytics',
    description: 'Collect in-app feedback, NPS, CSAT, and feature requests with AI-powered sentiment analysis and trend detection. Auto-route feedback to product teams, link to support tickets, and track sentiment over time.',
    features: ['In-app feedback widget (React, Vue, mobile SDKs)', 'NPS/CSAT/eNPS survey campaigns', 'AI sentiment analysis and topic clustering', 'Feature request voting board', 'Auto-routing to Jira/Linear/Asana', 'Sentiment trend dashboards'],
    benefits: ['Understand customer sentiment in real time', 'Prioritize features with data, not guesses', 'Catch churn signals before they escalate', 'Close the loop: respond to feedback automatically', 'Link feedback directly to product roadmap'],
    pricing: {basic: '$49/mo', pro: '$149/mo', enterprise: '$399/mo'},
    contactInfo: {website: '/services/microsaas-feedback-loop-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '💬',
    href: '/services/microsaas-feedback-loop-analytics',
    popular: true,
    category: 'micro-saas',
    industry: 'Product Management',
    stage: 'published',
  },
];

export const wave222AiCompetitiveIntelServices: Service[] = [
  {
    id: 'ai-competitive-intelligence-monitor',
    title: 'AI Competitive Intelligence Monitor',
    description: 'AI-powered competitor tracking that monitors pricing changes, feature launches, hiring patterns, SEO shifts, and market positioning. Delivers weekly strategic briefings with actionable recommendations for your business.',
    features: ['Competitor website and pricing change monitoring', 'Feature launch detection from changelogs and press', 'Hiring pattern analysis (LinkedIn, job boards)', 'SEO and ad spend shift tracking', 'Market positioning and messaging changes', 'Weekly AI-generated strategic briefings'],
    benefits: ['Never miss a competitor move', 'Get AI-recommended counter-strategies', 'Track 10+ competitors automatically', 'Weekly briefings save hours of research', 'Data-driven competitive response decisions'],
    pricing: {basic: '$399/mo', pro: '$999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-competitive-intelligence-monitor', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎯',
    href: '/services/ai-competitive-intelligence-monitor',
    popular: true,
    category: 'ai',
    industry: 'Business Strategy',
    stage: 'published',
  },
];
