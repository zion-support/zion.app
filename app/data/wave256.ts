import { Service } from './serviceTypes';

// Wave 256 — Real Micro-SaaS, IT & AI Services
// Research by OWL Agent — 2026-06-19

export const wave256MicroSaasServices: Service[] = [
  {
    id: 'project-management-suite',
    title: 'Project Management Suite',
    description: 'All-in-one project management platform with Gantt charts, Kanban boards, time tracking, resource planning, and client portals. Built for agencies and IT teams managing multiple concurrent projects.',
    category: 'micro-saas',
    icon: '📊',
    href: '/services/project-management-suite',
    industry: 'Productivity',
    stage: 'published',
    pricing: { basic: '$29/mo (5 users, 10 projects)', pro: '$79/mo (25 users, unlimited projects)', enterprise: '$199/mo (unlimited users, SSO, API)' },
    contactInfo: { website: '/services/project-management-suite', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Gantt charts with critical path analysis and dependency mapping',
      'Kanban boards with WIP limits, swimlanes, and automation rules',
      'Time tracking with billable hours, timesheets, and payroll export',
      'Resource planning with capacity forecasting and workload balancing',
      'Client portal with branded sharing, approval workflows, and comments',
      'Custom fields, templates, and automation recipes',
      'Integrations: Slack, GitHub, Google Drive, Zapier, 50+ more',
      'Advanced reporting: burndown charts, velocity, ROI tracking'
    ],
    benefits: [
      'Deliver projects 30% faster with visual planning and automation',
      'Reduce meeting time by 40% with async client collaboration',
      'Increase billable utilization by 25% with accurate time tracking',
      'Scale from 5 to 500 users without switching platforms'
    ]
  },
  {
    id: 'email-delivery-platform',
    title: 'Transactional Email Delivery Platform',
    description: 'High-deliverability transactional email service with API, SMTP relay, template engine, real-time analytics, and automatic bounce/complaint handling. Built for SaaS companies who need reliable email infrastructure.',
    category: 'micro-saas',
    icon: '📧',
    href: '/services/email-delivery-platform',
    industry: 'Developer Tools',
    stage: 'published',
    pricing: { basic: '$19/mo (50K emails)', pro: '$79/mo (500K emails, dedicated IP)', enterprise: '$249/mo (5M emails, custom domain, SLA)' },
    contactInfo: { website: '/services/email-delivery-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'REST API and SMTP relay with sub-100ms delivery',
      'Drag-and-drop template editor with dynamic variables',
      'Real-time analytics: delivery rate, opens, clicks, bounces',
      'Automatic bounce handling, suppression list management',
      'Webhook notifications for delivery events',
      'Dedicated IP addresses with warm-up automation',
      'SPF, DKIM, DMARC setup and monitoring',
      'A/B testing for subject lines and content'
    ],
    benefits: [
      'Achieve 99.5% email deliverability with optimized infrastructure',
      'Reduce email infrastructure costs by 60% vs. building in-house',
      'Scale from 1K to 10M emails without architecture changes',
      'Ensure compliance with automatic bounce and complaint handling'
    ]
  },
  {
    id: 'url-shortener-analytics',
    title: 'URL Shortener & Link Analytics',
    description: 'Branded URL shortener with deep link analytics, QR code generation, retargeting pixel support, and custom domains. Perfect for marketing teams tracking campaign performance across channels.',
    category: 'micro-saas',
    icon: '🔗',
    href: '/services/url-shortener-analytics',
    industry: 'Marketing',
    stage: 'published',
    pricing: { basic: '$9/mo (5K clicks/mo)', pro: '$39/mo (100K clicks, custom domain)', enterprise: '$149/mo (1M clicks, API, team seats)' },
    contactInfo: { website: '/services/url-shortener-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Branded short links with custom domains (e.g., your.co/link)',
      'Click analytics: geo, device, referrer, time-series',
      'QR code generation with logo, colors, and error correction',
      'Retargeting pixel injection for Facebook, Google, LinkedIn',
      'Link expiration, password protection, and geo-routing',
      'Bulk link import via CSV and API',
      'UTM parameter builder and auto-tagging',
      'Team collaboration with role-based access'
    ],
    benefits: [
      'Track every click across all marketing channels in one dashboard',
      'Increase CTR by 40% with branded vs. generic short links',
      'Retarget visitors who clicked but didn\'t convert',
      'Replace multiple tools with a single link management platform'
    ]
  }
];

export const wave256ItServices: Service[] = [
  {
    id: 'it-asset-management',
    title: 'IT Asset Management & Lifecycle Tracking',
    description: 'Comprehensive IT asset management platform tracking hardware, software licenses, and cloud resources across their full lifecycle. Automated discovery, compliance reporting, and cost optimization.',
    category: 'it',
    icon: '🖥️',
    href: '/services/it-asset-management',
    industry: 'IT Operations',
    stage: 'published',
    pricing: { basic: '$149/mo (250 assets)', pro: '$399/mo (2,500 assets, auto-discovery)', enterprise: '$999/mo (unlimited, CMDB, API)' },
    contactInfo: { website: '/services/it-asset-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automated network discovery and inventory scanning',
      'Software license tracking with compliance alerts',
      'Hardware lifecycle: procurement → deployment → retirement',
      'Cloud resource tracking across AWS, Azure, GCP',
      'Contract and warranty management with renewal alerts',
      'Depreciation tracking and financial reporting',
      'Integration with ITSM tools (ServiceNow, Jira, Freshdesk)',
      'Custom dashboards and executive summary reports'
    ],
    benefits: [
      'Reduce software overspend by 30% with license optimization',
      'Eliminate manual asset tracking and audit preparation time',
      'Ensure 100% license compliance and avoid audit penalties',
      'Optimize cloud spend with visibility into unused resources'
    ]
  },
  {
    id: 'network-penetration-testing',
    title: 'Network Penetration Testing & Security Assessment',
    description: 'Professional penetration testing services covering network, web application, API, and social engineering vectors. Detailed reports with risk ratings, remediation guidance, and retesting.',
    category: 'it',
    icon: '🛡️',
    href: '/services/network-penetration-testing',
    industry: 'Cybersecurity',
    stage: 'published',
    pricing: { basic: '$2,499 (external network, up to 256 IPs)', pro: '$4,999 (internal + external, web apps)', enterprise: '$9,999 (full scope, social engineering, retest)' },
    contactInfo: { website: '/services/network-penetration-testing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'External and internal network penetration testing',
      'Web application and API security assessment',
      'Social engineering campaigns (phishing, vishing, physical)',
      'Wireless network security evaluation',
      'Detailed findings report with CVSS risk ratings',
      'Step-by-step remediation guidance for each finding',
      'Retesting of remediated vulnerabilities included',
      'Executive summary for board-level reporting'
    ],
    benefits: [
      'Identify critical vulnerabilities before attackers do',
      'Meet compliance requirements (PCI-DSS, HIPAA, SOC 2)',
      'Prioritize remediation by actual business risk',
      'Demonstrate security diligence to customers and partners'
    ]
  },
  {
    id: 'data-center-relocation',
    title: 'Data Center Migration & Relocation Services',
    description: 'End-to-end data center migration planning and execution. From assessment and design to physical move, cloud migration, and post-move validation. Minimize downtime and risk.',
    category: 'it',
    icon: '🏗️',
    href: '/services/data-center-relocation',
    industry: 'Infrastructure',
    stage: 'published',
    pricing: { basic: '$4,999 (assessment + migration plan)', pro: '$14,999 (full migration, up to 50 servers)', enterprise: 'Custom (large-scale, multi-site, hybrid cloud)' },
    contactInfo: { website: '/services/data-center-relocation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Complete infrastructure assessment and dependency mapping',
      'Migration strategy: lift-and-shift, re-platform, re-architect',
      'Physical server packing, transport, and reinstallation',
      'Cloud migration to AWS, Azure, or GCP with optimization',
      'Network reconfiguration and DNS cutover planning',
      'Rollback procedures and contingency planning',
      'Post-migration validation and performance testing',
      'Documentation update and knowledge transfer'
    ],
    benefits: [
      'Reduce migration downtime to under 4 hours with proven methodology',
      'Avoid data loss with verified backup and checksum validation',
      'Optimize infrastructure costs by 40% with right-sized cloud resources',
      'Complete migration 50% faster with experienced project management'
    ]
  }
];

export const wave256AiServices: Service[] = [
  {
    id: 'ai-customer-churn-prediction',
    title: 'AI Customer Churn Prediction & Prevention',
    description: 'Machine learning platform that predicts which customers are at risk of churning and recommends targeted retention actions. Integrates with your CRM and billing system for real-time scoring.',
    category: 'ai',
    icon: '🎯',
    href: '/services/ai-customer-churn-prediction',
    industry: 'Customer Success',
    stage: 'published',
    pricing: { basic: '$299/mo (1,000 customers)', pro: '$799/mo (10,000 customers, auto-actions)', enterprise: '$2,499/mo (unlimited, custom models, API)' },
    contactInfo: { website: '/services/ai-customer-churn-prediction', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time churn probability scoring for every customer',
      'Root cause analysis: why each customer is at risk',
      'Automated retention campaigns triggered by churn signals',
      'Integration with Salesforce, HubSpot, Stripe, Zendesk',
      'Custom model training on your historical churn data',
      'A/B testing for retention offer effectiveness',
      'Executive dashboard with revenue-at-risk metrics',
      'API for embedding churn scores in your product'
    ],
    benefits: [
      'Reduce churn by 25% with early intervention',
      'Increase customer lifetime value by 35%',
      'Save $50K+ annually per 1,000 customers retained',
      'Automate retention workflows that previously required manual analysis'
    ]
  },
  {
    id: 'ai-invoice-fraud-detection',
    title: 'AI Invoice Fraud Detection & AP Automation',
    description: 'AI-powered accounts payable automation that detects fraudulent invoices, duplicate payments, and policy violations. Processes invoices from any format with 99.7% accuracy.',
    category: 'ai',
    icon: '🧾',
    href: '/services/ai-invoice-fraud-detection',
    industry: 'FinTech',
    stage: 'published',
    pricing: { basic: '$199/mo (500 invoices/mo)', pro: '$499/mo (5,000 invoices, fraud rules)', enterprise: '$1,499/mo (unlimited, custom models, ERP integration)' },
    contactInfo: { website: '/services/ai-invoice-fraud-detection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'OCR extraction from PDF, email, scanned paper, and EDI',
      'Fraud detection: fake vendors, altered amounts, duplicate invoices',
      'Three-way matching: PO → receipt → invoice',
      'Approval workflow routing based on amount and vendor',
      'Integration with QuickBooks, NetSuite, SAP, Xero',
      'Audit trail with every action logged and timestamped',
      'Vendor risk scoring based on historical patterns',
      'Real-time alerts for suspicious invoice patterns'
    ],
    benefits: [
      'Prevent 99% of invoice fraud with AI-powered detection',
      'Reduce AP processing costs by 70% through automation',
      'Eliminate duplicate payments saving average $45K/year',
      'Cut invoice processing time from 15 minutes to 30 seconds'
    ]
  },
  {
    id: 'ai-meeting-summarizer',
    title: 'AI Meeting Summarizer & Action Item Tracker',
    description: 'Automatically transcribes, summarizes, and extracts action items from video meetings. Integrates with Zoom, Teams, and Google Meet. Generates shareable summaries in seconds.',
    category: 'ai',
    icon: '📝',
    href: '/services/ai-meeting-summarizer',
    industry: 'Productivity',
    stage: 'published',
    pricing: { basic: '$15/user/mo (20 meetings)', pro: '$35/user/mo (unlimited, action items)', enterprise: '$65/user/mo (API, custom integrations, SSO)' },
    contactInfo: { website: '/services/ai-meeting-summarizer', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time transcription with speaker identification',
      'AI-generated summaries: key decisions, discussion points, action items',
      'Automatic action item extraction with assignee and due date',
      'Integration with Zoom, Microsoft Teams, Google Meet',
      'Search across all meeting transcripts and summaries',
      'Export to Slack, Jira, Asana, Notion, Confluence',
      'Custom vocabulary for industry-specific terminology',
      'Multi-language support: 30+ languages with translation'
    ],
    benefits: [
      'Save 5 hours per week per team on meeting notes',
      'Ensure 100% action item follow-through with tracking',
      'Make meetings searchable and accessible to absent team members',
      'Reduce miscommunication with accurate, shared records'
    ]
  }
];
