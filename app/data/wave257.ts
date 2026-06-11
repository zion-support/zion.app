import { Service } from './serviceTypes';

// Wave 257 — Real Micro-SaaS, IT & AI Services
// Research by OWL Agent — 2026-06-19

export const wave257MicroSaasServices: Service[] = [
  {
    id: 'crm-for-small-business',
    title: 'CRM for Small Business',
    description: 'Simple yet powerful CRM designed for small businesses and solopreneurs. Contact management, deal tracking, email sequences, appointment scheduling, and invoicing in one affordable platform.',
    category: 'micro-saas',
    icon: '👥',
    href: '/services/crm-for-small-business',
    industry: 'Sales',
    stage: 'published',
    pricing: { basic: '$19/user/mo (1,000 contacts)', pro: '$39/user/mo (10,000 contacts, automation)', enterprise: '$79/user/mo (unlimited, API, priority support)' },
    contactInfo: { website: '/services/crm-for-small-business', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Contact management with custom fields and tags',
      'Deal pipeline with drag-and-drop stages and probability scoring',
      'Email sequences and templates with open/click tracking',
      'Appointment scheduling with calendar sync (Google, Outlook)',
      'Invoicing and payment collection via Stripe integration',
      'Task management with reminders and recurring tasks',
      'Mobile app for iOS and Android with offline mode',
      'Import/export from CSV, HubSpot, Salesforce migration tools'
    ],
    benefits: [
      'Close 35% more deals with visual pipeline management',
      'Reduce admin time by 60% with automated follow-ups',
      'Affordable alternative to HubSpot/Salesforce at 1/5 the cost',
      'Get started in under 10 minutes with guided onboarding'
    ]
  },
  {
    id: 'knowledge-base-platform',
    title: 'Internal Knowledge Base Platform',
    description: 'Self-hosted knowledge base and documentation platform with AI-powered search, version control, and team collaboration. Reduce support tickets by enabling customers to self-serve answers.',
    category: 'micro-saas',
    icon: '📚',
    href: '/services/knowledge-base-platform',
    industry: 'Customer Support',
    stage: 'published',
    pricing: { basic: '$49/mo (3 users, 100 articles)', pro: '$149/mo (25 users, unlimited articles)', enterprise: '$399/mo (unlimited, SSO, API, analytics)' },
    contactInfo: { website: '/services/knowledge-base-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'WYSIWYG editor with markdown support and media embedding',
      'AI-powered search with natural language understanding',
      'Category organization with nested sections and tagging',
      'Version history with diff comparison and rollback',
      'Team collaboration: comments, suggestions, approvals',
      'Analytics: popular articles, search queries, deflection rate',
      'Custom branding: logo, colors, custom domain, SSL',
      'Integration with Intercom, Zendesk, Slack, and help desks'
    ],
    benefits: [
      'Reduce support tickets by 40% with self-service answers',
      'Decrease onboarding time by 50% with documented processes',
      'Improve answer consistency across your entire team',
      'Find any document in under 3 seconds with AI search'
    ]
  }
];

export const wave257ItServices: Service[] = [
  {
    id: 'cloud-cost-optimization',
    title: 'Multi-Cloud Cost Optimization Service',
    description: 'Ongoing cloud cost optimization across AWS, Azure, and GCP. Right-sizing, reserved instance planning, idle resource detection, and FinOps governance. Average 35% cost reduction.',
    category: 'it',
    icon: '☁️',
    href: '/services/cloud-cost-optimization',
    industry: 'Cloud Operations',
    stage: 'published',
    pricing: { basic: '$499/mo (single cloud, up to $5K spend)', pro: '$1,499/mo (multi-cloud, up to $50K spend)', enterprise: '$3,999/mo (unlimited, FinOps team, SLA)' },
    contactInfo: { website: '/services/cloud-cost-optimization', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automated rightsizing recommendations for compute, storage, database',
      'Reserved instance and savings plan portfolio optimization',
      'Idle resource detection and cleanup automation',
      'Tag governance and chargeback/showback reporting',
      'Anomaly detection for unexpected cost spikes',
      'Monthly FinOps reviews with engineering teams',
      'Custom dashboards with unit economics (cost per transaction)',
      'Integration with CloudHealth, Spot.io, and native billing APIs'
    ],
    benefits: [
      'Reduce cloud spend by 35% on average within 90 days',
      'Eliminate waste from unused resources automatically',
      'Improve cost visibility with department-level chargeback',
      'Optimize reserved capacity saving $100K+ annually'
    ]
  },
  {
    id: 'disaster-recovery-planning',
    title: 'Disaster Recovery & Business Continuity Planning',
    description: 'Comprehensive DR/BC planning including risk assessment, RTO/RPO definition, runbook creation, backup strategy, and quarterly testing. Ensure your business survives any outage.',
    category: 'it',
    icon: '🔄',
    href: '/services/disaster-recovery-planning',
    industry: 'IT Resilience',
    stage: 'published',
    pricing: { basic: '$2,999 (assessment + DR plan document)', pro: '$7,499 (full plan + implementation + 1 test)', enterprise: '$14,999 (multi-site, quarterly testing, 24/7 support)' },
    contactInfo: { website: '/services/disaster-recovery-planning', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Business impact analysis and risk assessment',
      'RTO/RPO definition for all critical systems',
      'DR architecture design: hot/warm/cold standby strategies',
      'Automated backup and replication configuration',
      'Detailed runbooks for every failure scenario',
      'Quarterly DR testing with documented results',
      'Cloud-based DR as a Service (DRaaS) options',
      'Compliance documentation for auditors and regulators'
    ],
    benefits: [
      'Achieve RTO under 1 hour for critical systems',
      'Avoid $300K+ average cost of unplanned downtime',
      'Meet regulatory requirements for business continuity',
      'Test and validate DR procedures quarterly, not just annually'
    ]
  }
];

export const wave257AiServices: Service[] = [
  {
    id: 'ai-anomaly-detection-iot',
    title: 'AI Anomaly Detection for IoT Fleets',
    description: 'Real-time anomaly detection for IoT device fleets using edge ML models. Detect equipment failures, security breaches, and operational anomalies before they cause downtime.',
    category: 'ai',
    icon: '📡',
    href: '/services/ai-anomaly-detection-iot',
    industry: 'IoT & Edge',
    stage: 'published',
    pricing: { basic: '$399/mo (100 devices, cloud processing)', pro: '$1,199/mo (1,000 devices, edge inference)', enterprise: '$3,499/mo (10K+ devices, custom models, SLA)' },
    contactInfo: { website: '/services/ai-anomaly-detection-iot', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time telemetry processing from MQTT, AMQP, HTTP protocols',
      'Unsupervised anomaly detection: no labeled data required',
      'Edge ML inference on NVIDIA Jetson, Raspberry Pi, ARM devices',
      'Custom alerting rules via SMS, email, Slack, PagerDuty',
      'Digital twin visualization of device fleet health',
      'Predictive maintenance scoring per device',
      'OTA model updates for edge deployed ML models',
      'Integration with AWS IoT, Azure IoT Hub, Google Cloud IoT'
    ],
    benefits: [
      'Detect equipment failures 48 hours in advance on average',
      'Reduce unplanned downtime by 65% with predictive alerts',
      'Scale monitoring from 100 to 100,000 devices effortlessly',
      'Cut cloud processing costs by 80% with edge inference'
    ]
  },
  {
    id: 'ai-content-moderation',
    title: 'AI Content Moderation & Safety Platform',
    description: 'Real-time AI content moderation for text, images, and video. Detects toxic content, spam, CSAM, violence, and policy violations with sub-second latency. Protect your platform and users.',
    category: 'ai',
    icon: '🛡️',
    href: '/services/ai-content-moderation',
    industry: 'Trust & Safety',
    stage: 'published',
    pricing: { basic: '$299/mo (100K API calls)', pro: '$999/mo (1M calls, image + video)', enterprise: '$2,999/mo (10M+ calls, custom policies, SLA)' },
    contactInfo: { website: '/services/ai-content-moderation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-modal moderation: text, image, video, and audio',
      'Toxicity detection: hate speech, threats, harassment, self-harm',
      'Spam and fraud detection: fake accounts, scams, phishing',
      'CSAM detection with hash matching and classification',
      'Custom policy rules and blocklists per category',
      'Human-in-the-loop review queue with priority scoring',
      'Real-time API with p99 latency under 200ms',
      'Compliance reporting for DSA, Online Safety Act, GDPR'
    ],
    benefits: [
      'Protect users from harmful content with 97% detection accuracy',
      'Reduce moderation costs by 80% vs. manual review teams',
      'Scale moderation to millions of posts without adding headcount',
      'Meet regulatory requirements with automated compliance reporting'
    ]
  }
];
