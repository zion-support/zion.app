import { Service } from './serviceTypes';

// Wave 235 — 5 real services across AI, IT, and Micro-SaaS
// Contact: kleber@ziontechgroup.com | +1 302 464 0950

// ── AI Services ──────────────────────────────────────────────

export const wave235AiServices: Service[] = [
  {
    id: 'ai-powered-video-content-moderation',
    title: 'AI-Powered Video Content Moderation',
    description:
      'Real-time video analysis, inappropriate content detection, age verification, and copyright detection powered by advanced computer vision and machine learning. Helps platforms maintain safe, compliant content at scale without manual review bottlenecks.',
    features: [
      'Real-time video stream analysis processing thousands of concurrent feeds with sub-second latency',
      'Inappropriate content detection covering violence, nudity, hate symbols, and graphic material with 96% accuracy',
      'Automated age verification using facial analysis to restrict underage access to age-gated content',
      'Copyright detection engine that identifies unauthorized use of protected video, audio, and image assets',
      'Custom content policy builder with granular rules, whitelists, and category-specific thresholds',
      'Moderation dashboard with flagged content queue, appeal workflows, and detailed audit logs',
    ],
    benefits: [
      'Reduces manual moderation workload by up to 90% through automated content screening',
      'Protects brand reputation by catching policy violations before they reach end users',
      'Ensures regulatory compliance with COPPA, GDPR, and platform-specific content regulations',
      'Scales effortlessly from thousands to millions of video uploads without adding headroom',
      'Provides detailed analytics on content trends, violation patterns, and moderation performance',
    ],
    pricing: {
      basic: '$1,299/mo',
      pro: '$3,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Video',
    href: '/services/ai-powered-video-content-moderation',
    popular: true,
    category: 'ai',
    industry: 'Media/Social',
    stage: 'published',
  },
  {
    id: 'ai-predictive-maintenance-manufacturing',
    title: 'AI Predictive Maintenance for Manufacturing',
    description:
      'IoT sensor analysis, failure prediction, maintenance scheduling, and spare parts optimization powered by machine learning. Helps manufacturers minimize unplanned downtime, extend equipment life, and optimize maintenance budgets.',
    features: [
      'IoT sensor data ingestion and analysis from vibration, temperature, pressure, and acoustic sensors',
      'Failure prediction models that identify equipment degradation weeks before breakdown occurs',
      'Intelligent maintenance scheduling that optimizes technician routes, parts availability, and production windows',
      'Spare parts inventory optimization using demand forecasting to reduce carrying costs while preventing stockouts',
      'Digital twin simulation for testing maintenance scenarios and predicting equipment behavior under stress',
      'Executive dashboard with OEE tracking, MTBF/MTTR trends, and cost-savings analytics',
    ],
    benefits: [
      'Reduces unplanned downtime by up to 50% through early failure detection and proactive intervention',
      'Extends critical equipment lifespan by 20-30% with condition-based maintenance strategies',
      'Cuts maintenance costs by optimizing spare parts inventory and reducing emergency repairs',
      'Improves production planning with reliable equipment availability forecasts and risk scoring',
      'Integrates with existing SCADA, MES, and ERP systems via standard industrial protocols and APIs',
    ],
    pricing: {
      basic: '$2,499/mo',
      pro: '$5,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Cpu',
    href: '/services/ai-predictive-maintenance-manufacturing',
    popular: false,
    category: 'ai',
    industry: 'Manufacturing',
    stage: 'published',
  },
];

// ── IT Services ──────────────────────────────────────────────

export const wave235ItServices: Service[] = [
  {
    id: 'data-loss-prevention-dlp-service',
    title: 'Data Loss Prevention (DLP) Service',
    description:
      'Endpoint DLP, cloud DLP, email DLP, policy enforcement, and incident reporting in a unified platform. Protects sensitive data across all channels with real-time monitoring, automated policy enforcement, and comprehensive compliance reporting.',
    features: [
      'Endpoint DLP monitoring all data movement on workstations including USB, clipboard, print, and screen capture',
      'Cloud DLP integration with Google Workspace, Microsoft 365, AWS, and SaaS applications for data-at-rest protection',
      'Email DLP scanning outbound messages and attachments for sensitive data patterns, PII, and regulated content',
      'Centralized policy engine with 200+ pre-built templates for HIPAA, PCI-DSS, GDPR, and custom regulations',
      'Automated incident reporting with severity classification, root-cause analysis, and remediation workflows',
      'Data discovery and classification engine that scans repositories to identify and tag sensitive information',
    ],
    benefits: [
      'Prevents data breaches by blocking unauthorized transfers of sensitive information in real time',
      'Achieves compliance with major regulatory frameworks using pre-built policy templates and audit reports',
      'Reduces incident response time with automated alerts, playbooks, and forensic evidence collection',
      'Provides complete visibility into data movement across endpoints, cloud, and email from a single console',
      'Minimizes false positives with machine learning models tuned to your organization\'s data patterns',
    ],
    pricing: {
      basic: '$5/user/mo',
      pro: '$10/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'ShieldCheck',
    href: '/services/data-loss-prevention-dlp-service',
    popular: true,
    category: 'it',
    industry: 'Data Security',
    stage: 'published',
  },
];

// ── Micro-SaaS Services ──────────────────────────────────────

export const wave235MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-seo-rank-tracker-auditor',
    title: 'Micro-SaaS SEO Rank Tracker & Auditor',
    description:
      'Daily rank tracking, technical SEO audits, competitor analysis, and backlink monitoring in one streamlined platform. Purpose-built for agencies and marketers who need actionable SEO insights without enterprise tool complexity.',
    features: [
      'Daily rank tracking across Google, Bing, and Yahoo for unlimited keywords with historical trend visualization',
      'Automated technical SEO audits covering crawlability, site speed, mobile usability, schema markup, and Core Web Vitals',
      'Competitor analysis engine that tracks rival rankings, content strategies, and keyword gaps in real time',
      'Backlink monitoring with new/lost link alerts, domain authority scoring, and toxic link identification',
      'Content optimization suggestions with keyword density analysis, readability scoring, and SERP feature targeting',
      'White-label reporting dashboard with scheduled PDF exports, client branding, and performance summaries',
    ],
    benefits: [
      'Identifies ranking opportunities by surfacing keyword gaps competitors haven\'t targeted yet',
      'Cuts technical SEO audit time from days to minutes with automated crawl and analysis',
      'Protects domain authority by detecting toxic backlinks before they trigger search engine penalties',
      'Improves client retention with professional, white-label reports that demonstrate measurable ROI',
      'Scales from a single site to hundreds of client properties without changing workflows or pricing tiers',
    ],
    pricing: {
      basic: '$49/mo',
      pro: '$129/mo',
      enterprise: '$299/mo',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Search',
    href: '/services/micro-saas-seo-rank-tracker-auditor',
    popular: false,
    category: 'micro-saas',
    industry: 'Digital Marketing',
    stage: 'published',
  },
  {
    id: 'micro-saas-client-onboarding-automation',
    title: 'Micro-SaaS Client Onboarding Automation',
    description:
      'Automated welcome sequences, document collection, task checklists, and progress tracking in one streamlined platform. Designed for SaaS companies and professional services firms that want to deliver a polished, consistent onboarding experience at scale.',
    features: [
      'Automated welcome email and SMS sequences with personalized messaging, timing rules, and conditional branching',
      'Secure document collection portal with e-signature support, file type validation, and automatic reminders',
      'Customizable task checklists with role-based assignments, due dates, dependencies, and completion tracking',
      'Real-time progress tracking dashboard showing onboarding stage, bottlenecks, and time-to-completion metrics',
      'CRM and project management integrations with HubSpot, Salesforce, Asana, Monday.com, and Slack',
      'Client-facing portal with branded experience, status updates, and self-service resource access',
    ],
    benefits: [
      'Reduces onboarding time by 60% with automated workflows that eliminate manual follow-ups',
      'Improves client satisfaction with a professional, consistent experience from day one',
      'Increases completion rates with automated reminders and a clear, guided onboarding path',
      'Frees up team capacity by replacing repetitive onboarding tasks with self-service automation',
      'Provides visibility into onboarding bottlenecks with analytics that drive continuous process improvement',
    ],
    pricing: {
      basic: '$59/mo',
      pro: '$149/mo',
      enterprise: '$349/mo',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'UserPlus',
    href: '/services/micro-saas-client-onboarding-automation',
    popular: false,
    category: 'micro-saas',
    industry: 'SaaS/Professional Services',
    stage: 'published',
  },
];
