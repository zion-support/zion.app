import { Service } from './serviceTypes';

// Wave 227 — Real AI/IT/Micro-SaaS Services
// Micro-SaaS: Simple CRM, Project Time Tracker, Invoice Generator
// AI: AI Social Media Content Calendar, AI Property Valuation
// IT: Managed Print Services, VoIP Phone System Management
// Security: Email Security & DMARC Management
// Data: Customer Data Platform (CDP) Setup
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave227MicroSaasSimpleCrmServices: Service[] = [
  {
    id: 'microsaas-simple-crm',
    title: 'Micro-SaaS Lightweight CRM for Small Teams',
    description: 'A clean, fast CRM designed for small sales teams and startups. Contact management, deal pipeline, email tracking, and activity logging — none of the enterprise bloat. Set up in 5 minutes, start selling immediately.',
    features: ['Visual sales pipeline (drag-and-drop)', 'Contact management with activity timeline', 'Email sync and tracking', 'Task and follow-up reminders', 'Basic reporting (win rate, pipeline value)', 'Import from CSV / other CRMs'],
    benefits: ['Set up in 5 minutes, no training needed', 'Affordable alternative to Salesforce', 'Track every customer interaction', 'See your pipeline at a glance', 'Grows with your team up to 50 users'],
    pricing: {basic: '$15/user/mo', pro: '$35/user/mo', enterprise: '$59/user/mo'},
    contactInfo: {website: '/services/microsaas-simple-crm', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '👥',
    href: '/services/microsaas-simple-crm',
    popular: true,
    category: 'micro-saas',
    industry: 'Sales',
    stage: 'published',
  },
  {
    id: 'microsaas-time-tracker',
    title: 'Micro-SaaS Project Time Tracker & Reporting',
    description: 'Simple time tracking for agencies and consultants. Track time by project and client, generate invoices from tracked hours, and report on profitability. Integrates with popular project management tools.',
    features: ['One-click time tracking (desktop + mobile)', 'Project and client categorization', 'Billable vs non-billable hour tracking', 'Invoice generation from tracked hours', 'Team utilization and profitability reports', 'Integration with Trello, Asana, Jira, Monday'],
    benefits: ['Bill every billable hour — nothing slips through', 'Generate invoices in one click', 'Know which projects are profitable', 'Track team utilization in real-time', 'Simplify timesheets for your team'],
    pricing: {basic: '$7/user/mo', pro: '$15/user/mo', enterprise: '$29/user/mo'},
    contactInfo: {website: '/services/microsaas-time-tracker', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '⏱️',
    href: '/services/microsaas-time-tracker',
    popular: true,
    category: 'micro-saas',
    industry: 'Project Management',
    stage: 'published',
  },
  {
    id: 'microsaas-invoice-generator',
    title: 'Micro-SaaS Smart Invoice Generator & Payment Hub',
    description: 'Create and send professional invoices in seconds. Auto-calculate taxes, accept online payments, send reminders, and reconcile with bank feeds. AI suggests optimal send times for faster payment.',
    features: ['Smart invoice builder with templates', 'Auto tax calculation by jurisdiction', 'Online payment acceptance (Stripe, PayPal, ACH)', 'AI-optimized send-time for faster payment', 'Automated payment reminders', 'Bank reconciliation and financial reports'],
    benefits: ['Get paid up to 30% faster with AI send-time', 'Accept payments online in any currency', 'Automate payment reminders — stop chasing', 'Reconcile invoices with bank feeds', 'Look professional with branded invoices'],
    pricing: {basic: '$19/mo', pro: '$49/mo', enterprise: '$99/mo'},
    contactInfo: {website: '/services/microsaas-invoice-generator', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🧾',
    href: '/services/microsaas-invoice-generator',
    popular: true,
    category: 'micro-saaS',
    industry: 'Finance',
    stage: 'published',
  },
  {
    id: 'microsaas-employee-onboarding',
    title: 'Micro-SaaS Employee Onboarding & Offboarding Checklist',
    description: 'Automate employee onboarding with customizable checklists. Assign tasks to HR, IT, and managers. Track completion, send reminders, and ensure nothing is missed. Offboarding mode ensures secure exit procedures.',
    features: ['Customizable onboarding templates by role', 'Automated task assignment (HR, IT, Managers)', 'Progress tracking dashboard', 'Welcome email and resource sequence', 'Offboarding mode with access revocation', 'Integration with HRIS (BambooHR, Gusto)'],
    benefits: ['Onboard new hires in days, not weeks', 'Nothing falls through the cracks', 'Consistent experience for every new hire', 'Automated offboarding reduces security risk', 'Track onboarding satisfaction with surveys'],
    pricing: {basic: '$29/mo', pro: '$69/mo', enterprise: '$149/mo'},
    contactInfo: {website: '/services/microsaas-employee-onboarding', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎯',
    href: '/services/microsaas-employee-onboarding',
    popular: true,
    category: 'micro-saas',
    industry: 'Human Resources',
    stage: 'published',
  },
];

export const wave227AiSocialMediaCalendarServices: Service[] = [
  {
    id: 'ai-social-media-content-calendar',
    title: 'AI Social Media Content Calendar & Scheduler',
    description: 'AI-powered social media management that creates content ideas, writes posts, generates hashtags, and schedules publishing across platforms. Analyzes performance to optimize future content. Works with Instagram, LinkedIn, X/Twitter, Facebook.',
    features: ['AI content idea generation', 'Post writing with brand voice', 'Hashtag and keyword optimization', 'Multi-platform scheduling', 'Performance analytics and optimization', 'Team approval workflows'],
    benefits: ['Generate a month of content ideas in minutes', 'Post at optimal times for engagement', 'Consistent brand voice across all platforms', 'Reach 3x more engagement with AI optimization', 'Manage all platforms from one dashboard'],
    pricing: {basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo'},
    contactInfo: {website: '/services/ai-social-media-content-calendar', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📱',
    href: '/services/ai-social-media-content-calendar',
    popular: true,
    category: 'ai',
    industry: 'Marketing',
    stage: 'published',
  },
  {
    id: 'ai-property-valuation',
    title: 'AI Property Valuation & Market Analysis Tool',
    description: 'AI-powered property valuations using comparable sales, market trends, neighborhood data, and property characteristics. Generates appraisal-grade reports for investors, agents, and homeowners. Covers residential and commercial properties.',
    features: ['AI valuation engine (comparable sales + market trends)', 'Neighborhood and school district analysis', 'Rental income and cap rate projections', 'Market trend forecasting (6-12 months)', 'Appraisal-grade PDF reports', 'API for integration with real estate platforms'],
    benefits: ['Get accurate valuations instantly', 'Identify undervalued investment opportunities', 'Project rental income and ROI', 'Up-to-date market trend forecasts', 'Professional reports for investors and lenders'],
    pricing: {basic: '$49/mo', pro: '$149/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-property-valuation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🏠',
    href: '/services/ai-property-valuation',
    popular: true,
    category: 'ai',
    industry: 'Real Estate',
    stage: 'published',
  },
];

export const wave227ItManagedPrintServices: Service[] = [
  {
    id: 'it-managed-print-services',
    title: 'Managed Print Services & Print Fleet Optimization',
    description: 'Full managed print service — we supply, monitor, optimize, and maintain your printing fleet. Remote monitoring, automatic toner replenishment, print policy enforcement, and detailed usage reporting. Reduce print costs by 30%.',
    features: ['Remote printer fleet monitoring', 'Automatic toner and supply replenishment', 'Print policy enforcement (duplex, B/W default)', 'Usage tracking by department/user', 'Secure print release (pull printing)', 'Break-fix support with 4-hour response'],
    benefits: ['Reduce print costs by 30%', 'Never run out of toner again', 'Secure sensitive documents with pull printing', 'Track and control printing by department', 'Predictable monthly costs, no surprises'],
    pricing: {basic: '$50/mo per device', pro: '$85/mo per device', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-managed-print-services', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🖨️',
    href: '/services/it-managed-print-services',
    popular: true,
    category: 'it',
    industry: 'IT Operations',
    stage: 'published',
  },
  {
    id: 'it-voip-phone-system',
    title: 'VoIP Phone System Management & Deployment',
    description: 'Cloud VoIP phone system deployment and management for businesses of all sizes. Auto-attendant, call routing, voicemail-to-email, call recording, CRM integration, and mobile apps. Replace expensive PBX systems with modern cloud telephony.',
    features: ['Cloud PBX with unlimited extensions', 'Auto-attendant and IVR menu builder', 'Call routing, queues, and ring groups', 'Voicemail-to-email transcription', 'Call recording and analytics', 'CRM integration (Salesforce, HubSpot, Zoho)'],
    benefits: ['Save 50-70% vs traditional phone systems', 'Work from anywhere with mobile apps', 'Never miss a call with smart routing', 'Know call volume and agent performance', 'Scale up or down instantly'],
    pricing: {basic: '$15/user/mo', pro: '$25/user/mo', enterprise: '$45/user/mo'},
    contactInfo: {website: '/services/it-voip-phone-system', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '☎️',
    href: '/services/it-voip-phone-system',
    popular: true,
    category: 'it',
    industry: 'Telecommunications',
    stage: 'published',
  },
];

export const wave227SecurityEmailDmarcServices: Service[] = [
  {
    id: 'security-email-dmarc',
    title: 'Email Security, DMARC & Deliverability Management',
    description: 'Protect your domain from phishing and spoofing with DMARC, SPF, and DKIM management. Monitor email deliverability, investigate threats, and ensure legitimate emails reach the inbox. Full visibility into who is sending email using your domain.',
    features: ['DMARC policy configuration and monitoring', 'SPF and DKIM record management', 'Email threat investigation dashboard', 'Domain spoofing detection', 'Deliverability monitoring for legitimate email', 'Compliance reports (BIMI, MTA-STS)'],
    benefits: ['Stop phishers from spoofing your domain', 'Ensure your legitimate email reaches the inbox', 'See everyone sending email using your domain', 'Meet compliance with DMARC enforcement', 'Protect brand reputation and customer trust'],
    pricing: {basic: '$99/mo', pro: '$249/mo', enterprise: '$499/mo'},
    contactInfo: {website: '/services/security-email-dmarc', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📧',
    href: '/services/security-email-dmarc',
    popular: true,
    category: 'security',
    industry: 'Email Security',
    stage: 'published',
  },
];

export const wave227DataCdpSetupServices: Service[] = [
  {
    id: 'data-cdp-setup',
    title: 'Customer Data Platform (CDP) Setup & Integration',
    description: 'Implement and configure a Customer Data Platform that unifies customer data from all touchpoints. Single customer view across web, email, CRM, support, and advertising. Enable personalized marketing and analytics without engineering overhead.',
    features: ['CDP deployment (Segment, mParticle, or open-source)', 'Data source integration (web, mobile, CRM, email, ads)', 'Identity resolution across devices and channels', 'Audience segmentation builder', 'Activation to marketing and analytics tools', 'Data governance and consent management'],
    benefits: ['Unify customer data from all sources', 'Create a single customer view', 'Enable personalized marketing at scale', 'Reduce data engineering dependency', 'Meet privacy consent requirements'],
    pricing: {basic: '$1,999/mo', pro: '$4,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/data-cdp-setup', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔗',
    href: '/services/data-cdp-setup',
    popular: true,
    category: 'data',
    industry: 'Marketing Technology',
    stage: 'published',
  },
];
