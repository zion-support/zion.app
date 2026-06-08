import { Service } from './serviceTypes';

// Wave 226 — Additional Real AI/IT/Micro-SaaS Services
// Micro-SaaS: Invoice & Expense Tracker, Client Portal Builder, Knowledge Base Builder
// AI: AI Meeting Summarizer, AI Code Review Assistant
// IT: IT Service Desk Automation, Network Digital Twin
// Security: Data Loss Prevention (DLP) as a Service
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave226MicroSaasInvoiceTrackerServices: Service[] = [
  {
    id: 'microsaas-invoice-expense-tracker',
    title: 'Micro-SaaS Invoice & Expense Tracker for Freelancers',
    description: 'All-in-one invoicing and expense tracking for freelancers and solopreneurs. Create professional invoices, track expenses by category, auto-calculate taxes, and get paid online. Integrates with Stripe, PayPal, and bank feeds.',
    features: ['Professional invoice builder with custom branding', 'Expense tracking with receipt scanning (OCR)', 'Auto tax calculation and quarterly estimates', 'Online payment collection (Stripe, PayPal, ACH)', 'Bank feed integration for auto-import', 'Profit/loss reports and tax-ready summaries'],
    benefits: ['Get paid faster with online payment links', 'Never lose a receipt — scan and auto-categorize', 'Know your tax liability in real-time', 'Generate tax-ready reports in one click', 'Look professional with branded invoices'],
    pricing: {basic: '$19/mo', pro: '$49/mo', enterprise: '$99/mo'},
    contactInfo: {website: '/services/microsaas-invoice-expense-tracker', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '💰',
    href: '/services/microsaas-invoice-expense-tracker',
    popular: true,
    category: 'micro-saas',
    industry: 'Finance',
    stage: 'published',
  },
  {
    id: 'microsaas-client-portal-builder',
    title: 'Micro-SaaS Client Portal & Collaboration Hub',
    description: 'Build a branded client portal in minutes. Share files, track project status, collect feedback, and communicate with clients — all in one white-labeled space. Perfect for agencies, consultants, and service businesses.',
    features: ['Drag-and-drop portal builder', 'File sharing with version control', 'Project status tracking and milestones', 'In-portal messaging and comments', 'Custom branding (logo, colors, domain)', 'Client feedback and approval workflows'],
    benefits: ['Impress clients with a professional portal', 'Reduce email clutter with in-portal messaging', 'Track all client communication in one place', 'White-label with your brand in minutes', 'Collect approvals and feedback without back-and-forth'],
    pricing: {basic: '$49/mo', pro: '$129/mo', enterprise: '$299/mo'},
    contactInfo: {website: '/services/microsaas-client-portal-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🏢',
    href: '/services/microsaas-client-portal-builder',
    popular: true,
    category: 'micro-saas',
    industry: 'Client Management',
    stage: 'published',
  },
  {
    id: 'microsaas-knowledge-base-builder',
    title: 'Micro-SaaS Knowledge Base & Help Center Builder',
    description: 'Create a searchable, AI-powered knowledge base for your customers or internal team. Drag-and-drop editor, AI article suggestions, analytics on what customers search for, and seamless embedding in your website.',
    features: ['Drag-and-drop article editor', 'AI article suggestions from support tickets', 'Full-text search with AI understanding', 'Analytics: popular articles, failed searches', 'Embeddable widget for any website', 'Multi-language support with AI translation'],
    benefits: ['Reduce support tickets by 40% with self-service', 'AI suggests articles from real support questions', 'Know what customers struggle with via search analytics', 'Embed anywhere with a simple code snippet', 'Translate to any language automatically'],
    pricing: {basic: '$39/mo', pro: '$99/mo', enterprise: '$249/mo'},
    contactInfo: {website: '/services/microsaas-knowledge-base-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📖',
    href: '/services/microsaas-knowledge-base-builder',
    popular: true,
    category: 'micro-saaS',
    industry: 'Customer Support',
    stage: 'published',
  },
];

export const wave226AiMeetingSummarizerServices: Service[] = [
  {
    id: 'ai-meeting-summarizer',
    title: 'AI Meeting Summarizer & Action Item Extractor',
    description: 'Automatically transcribe, summarize, and extract action items from meetings. Works with Zoom, Teams, Google Meet, and in-person recordings. AI identifies decisions, owners, and deadlines. Integrates with Slack, email, and project management tools.',
    features: ['Real-time transcription (Zoom, Teams, Meet, in-person)', 'AI-generated meeting summaries', 'Action item extraction with owners and deadlines', 'Decision and key point identification', 'Auto-send summaries to Slack, email, or Teams', 'Searchable meeting archive'],
    benefits: ['Never take meeting notes again', 'Ensure nothing falls through the cracks', 'Search past meetings instantly', 'Auto-notify action item owners', 'Reduce meeting follow-up time by 80%'],
    pricing: {basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo'},
    contactInfo: {website: '/services/ai-meeting-summarizer', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📝',
    href: '/services/ai-meeting-summarizer',
    popular: true,
    category: 'ai',
    industry: 'Productivity',
    stage: 'published',
  },
  {
    id: 'ai-code-review-assistant',
    title: 'AI Code Review Assistant for Engineering Teams',
    description: 'Automated code review that catches bugs, security vulnerabilities, and style issues before merge. AI explains issues in plain English, suggests fixes, and learns your team coding standards. Integrates with GitHub, GitLab, and Bitbucket.',
    features: ['Automated PR review with AI explanations', 'Security vulnerability detection (OWASP Top 10)', 'Code style and best practice enforcement', 'Plain-English issue explanations', 'One-click fix suggestions', 'Custom rule configuration per team'],
    benefits: ['Catch bugs and vulnerabilities before production', 'Speed up code review by 60%', 'Junior devs learn from AI explanations', 'Consistent code quality across the team', 'Reduce security incidents from code defects'],
    pricing: {basic: '$49/mo', pro: '$149/mo', enterprise: '$399/mo'},
    contactInfo: {website: '/services/ai-code-review-assistant', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔍',
    href: '/services/ai-code-review-assistant',
    popular: true,
    category: 'ai',
    industry: 'Developer Tools',
    stage: 'published',
  },
];

export const wave226ItServiceDeskAutomationServices: Service[] = [
  {
    id: 'it-service-desk-automation',
    title: 'IT Service Desk Automation & Self-Service Portal',
    description: 'Transform your IT helpdesk with AI-powered ticket routing, auto-resolution for common issues, and a self-service portal. AI handles password resets, software requests, and FAQ answers — freeing your team for complex issues.',
    features: ['AI ticket classification and auto-routing', 'Auto-resolution for common issues (password resets, access requests)', 'Self-service portal with knowledge base', 'SLA tracking and escalation automation', 'Integration with Active Directory, Okta, ServiceNow', 'User satisfaction surveys and analytics'],
    benefits: ['Auto-resolve 40-60% of Tier 1 tickets', 'Reduce average resolution time by 50%', '24/7 self-service for common requests', 'Never miss an SLA with automated escalation', 'Measure and improve user satisfaction'],
    pricing: {basic: '$199/mo', pro: '$499/mo', enterprise: '$1,299/mo'},
    contactInfo: {website: '/services/it-service-desk-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎧',
    href: '/services/it-service-desk-automation',
    popular: true,
    category: 'it',
    industry: 'IT Service Management',
    stage: 'published',
  },
  {
    id: 'it-network-digital-twin',
    title: 'Network Digital Twin & Simulation Platform',
    description: 'Create a virtual replica of your entire network infrastructure. Simulate changes, test failover scenarios, and predict bottlenecks before they impact production. AI recommends optimal configurations and identifies single points of failure.',
    features: ['Automated network topology discovery', 'Virtual network replica with real-time data', 'Change simulation (what-if analysis)', 'Failover and disaster scenario testing', 'AI configuration optimization recommendations', 'Single point of failure identification'],
    benefits: ['Test network changes without risk', 'Predict bottlenecks before they impact users', 'Validate failover procedures automatically', 'Optimize network performance with AI', 'Reduce unplanned outages by 70%'],
    pricing: {basic: '$999/mo', pro: '$2,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-network-digital-twin', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🌐',
    href: '/services/it-network-digital-twin',
    popular: true,
    category: 'it',
    industry: 'Network Management',
    stage: 'published',
  },
];

export const wave226SecurityDlpServices: Service[] = [
  {
    id: 'security-dlp-as-a-service',
    title: 'Data Loss Prevention (DLP) as a Service',
    description: 'Cloud-native DLP that monitors and protects sensitive data across email, cloud storage, endpoints, and SaaS apps. AI classifies data, detects policy violations, and auto-remediates. No hardware or complex deployment needed.',
    features: ['AI-powered data classification and discovery', 'Policy enforcement across email, cloud, endpoints', 'Real-time violation detection and auto-remediation', 'Integration with Microsoft 365, Google Workspace, Slack', 'Insider threat detection and behavioral analytics', 'Compliance reporting (GDPR, HIPAA, PCI DSS, CCPA)'],
    benefits: ['Prevent data leaks before they happen', 'Auto-classify sensitive data with AI', 'Enforce policies across all channels', 'Meet compliance requirements automatically', 'Detect insider threats with behavioral analytics'],
    pricing: {basic: '$5/user/mo', pro: '$12/user/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/security-dlp-as-a-service', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔒',
    href: '/services/security-dlp-as-a-service',
    popular: true,
    category: 'security',
    industry: 'Data Security',
    stage: 'published',
  },
];
