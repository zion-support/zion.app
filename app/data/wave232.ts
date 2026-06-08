// Wave 232 — 5 new innovative services (AI, IT, Micro-SaaS)
// Generated 2026-06-07

import { Service } from './serviceTypes';

export const wave232Services: Service[] = [
  {
    id: 'ai-code-quality-security-scan',
    title: 'AI Code Quality & Security Scanning Platform',
    description: 'Comprehensive SAST/DAST scanning, vulnerability detection, code quality metrics, and auto-fix suggestions for Python, JavaScript, Go, and Java. Integrates into CI/CD pipelines to catch bugs and security flaws before they reach production.',
    features: [
      'Static Application Security Testing (SAST) for Python, JS, Go, and Java',
      'Dynamic Application Security Testing (DAST) for running applications',
      'Code quality metrics: complexity, duplication, maintainability scoring',
      'AI-powered auto-fix suggestions with one-click patch application',
      'CI/CD pipeline integration with GitHub Actions, GitLab CI, Jenkins, and CircleCI',
      'Compliance reporting for OWASP Top 10, CWE, and custom security policies'
    ],
    benefits: [
      'Catch security vulnerabilities before deployment with automated scanning',
      'Reduce code review time by 60% with AI-powered quality insights',
      'Auto-fix suggestions accelerate developer remediation workflows',
      'Unified dashboard for security and quality across all repositories',
      'Compliance-ready reports for SOC 2, ISO 27001, and internal audits'
    ],
    pricing: { basic: '$299/mo', pro: '$799/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-code-quality-security-scan', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍',
    href: '/services/ai-code-quality-security-scan',
    popular: true,
    category: 'ai',
    industry: 'Software Development',
    stage: 'published'
  },
  {
    id: 'pci-dss-compliance-monitoring',
    title: 'PCI DSS Compliance Monitoring & Reporting Service',
    description: 'Continuous PCI DSS compliance scanning, automated evidence collection, gap analysis, and audit-ready reporting. Stay compliant year-round with real-time monitoring of all 12 PCI DSS requirements across your cardholder data environment.',
    features: [
      'Continuous compliance scanning across all 12 PCI DSS requirements',
      'Automated evidence collection from firewalls, servers, and network devices',
      'Gap analysis with prioritized remediation roadmaps',
      'Audit-ready report generation for QSA and internal assessments',
      'Real-time alerting on compliance drift and configuration changes',
      'Support for PCI DSS v4.0 with legacy v3.2.1 transition tracking'
    ],
    benefits: [
      'Eliminate manual evidence collection saving 200+ hours per audit cycle',
      'Continuous monitoring ensures compliance between annual assessments',
      'Gap analysis provides clear remediation priorities with effort estimates',
      'Audit-ready reports reduce QSA fees and accelerate certification',
      'Real-time alerts prevent compliance drift before it becomes a finding'
    ],
    pricing: { basic: '$1,799/mo', pro: '$4,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/pci-dss-compliance-monitoring', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/pci-dss-compliance-monitoring',
    popular: true,
    category: 'it',
    industry: 'Financial Services',
    stage: 'published'
  },
  {
    id: 'project-time-tracking-invoicing',
    title: 'Micro-SaaS Project Time Tracking & Invoicing',
    description: 'All-in-one team time tracking, client billing, automated invoicing, and profitability reports. Built for small agencies and freelancers who need professional billing without enterprise complexity. Integrates with Stripe and PayPal for seamless payment collection.',
    features: [
      'Team time tracking with project and task-level granularity',
      'Automated client billing with customizable hourly and fixed-rate models',
      'Invoice generation and delivery with payment reminders',
      'Profitability reports by project, client, and team member',
      'Stripe and PayPal integration for online payment collection',
      'Client portal for timesheet review, invoice approval, and payment'
    ],
    benefits: [
      'Reduce billing cycle time from days to minutes with automated invoicing',
      'Profitability reports reveal which projects and clients drive margin',
      'Integrated payments get you paid faster with fewer follow-ups',
      'Client portal reduces back-and-forth emails by 80%',
      'Simple setup gets your team tracking time in under 15 minutes'
    ],
    pricing: { basic: '$39/mo', pro: '$99/mo', enterprise: '$249/mo' },
    contactInfo: { website: '/services/project-time-tracking-invoicing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⏱️',
    href: '/services/project-time-tracking-invoicing',
    popular: true,
    category: 'micro-saas',
    industry: 'Professional Services',
    stage: 'published'
  },
  {
    id: 'ai-knowledge-base-faq-chatbot',
    title: 'AI-Powered Knowledge Base & FAQ Chatbot',
    description: 'NLP-based chatbot that automatically builds and maintains your knowledge base. Generates FAQs from existing content, supports 50+ languages, and integrates with Slack and Microsoft Teams for instant employee and customer support.',
    features: [
      'NLP-powered conversational chatbot with context-aware responses',
      'Automatic FAQ generation from documents, tickets, and knowledge articles',
      'Multi-language support for 50+ languages with auto-translation',
      'Analytics dashboard with query volume, resolution rate, and sentiment tracking',
      'Slack and Microsoft Teams integration for in-workflow support',
      'Self-learning engine that improves answers from user feedback and new content'
    ],
    benefits: [
      'Deflect 70% of repetitive support tickets with instant AI answers',
      'Automatic FAQ generation keeps knowledge base current without manual effort',
      'Multi-language support enables global customer and employee self-service',
      'Analytics reveal knowledge gaps and trending support topics',
      'Slack and Teams integration puts answers where people already work'
    ],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-knowledge-base-faq-chatbot', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-knowledge-base-faq-chatbot',
    popular: true,
    category: 'ai',
    industry: 'Customer Support',
    stage: 'published'
  },
  {
    id: 'zero-trust-remote-access-vpn',
    title: 'Zero-Trust Remote Access VPN Service',
    description: 'Identity-based zero-trust remote access replacing legacy VPN. Device posture verification, split tunneling, full audit logging, and MFA enforcement ensure secure access from any device, anywhere. No network-level trust — every session is verified.',
    features: [
      'Identity-based access control integrated with Okta, Entra ID, and Google Workspace',
      'Device posture verification: OS patch level, disk encryption, EDR status',
      'Split tunneling for optimal performance with corporate and internet traffic routing',
      'Full audit logging of all access events with SIEM integration',
      'Maptive multi-factor authentication enforcement per application and per session',
      'Per-application access policies with no lateral network movement'
    ],
    benefits: [
      'Replace legacy VPN with modern zero-trust architecture',
      'Device posture checks block non-compliant devices before access is granted',
      'Split tunneling improves user experience and reduces bandwidth costs',
      'Complete audit trail supports compliance and incident investigation',
      'Per-application access eliminates lateral movement attack surface'
    ],
    pricing: { basic: '$8/user/mo', pro: '$15/user/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/zero-trust-remote-access-vpn', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔐',
    href: '/services/zero-trust-remote-access-vpn',
    popular: true,
    category: 'it',
    industry: 'Cybersecurity',
    stage: 'published'
  }
];
