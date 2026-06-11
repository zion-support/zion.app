import { Service } from './serviceTypes';

// Wave 263: Real AI + Micro-SaaS + IT Services
// Research by OWL Agent — 2026-06-19

export const wave263AiServices: Service[] = [
  {
    id: 'ai-real-estate-valuation',
    title: 'AI Real Estate Valuation & Investment Analysis',
    description: 'AI-powered property valuation engine that analyzes comparable sales, market trends, neighborhood data, rental yields, and economic indicators to deliver accurate property valuations in seconds. Investment analysis includes cash-on-cash return, cap rate projections, and risk scoring. Used by investors, lenders, and real estate professionals. Covers residential and commercial properties across the US.',
    category: 'ai',
    icon: '🏠',
    href: '/services/ai-real-estate-valuation',
    industry: 'Real Estate',
    stage: 'published',
    pricing: { basic: '$149/mo (50 reports)', pro: '$399/mo (200 reports)', enterprise: '$999/mo (unlimited)' },
    contactInfo: { website: '/services/ai-real-estate-valuation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Instant AI property valuations (AVM)',
      'Comparable sales analysis & adjustments',
      'Rental yield & cash flow projections',
      'Neighborhood trend & school district scoring',
      'Investment risk scoring (1-100)',
      'Portfolio analysis for multi-property owners',
      'Market timing indicators by zip code',
      'API access for lending platforms'
    ],
    benefits: [
      'Value properties in seconds vs days',
      'Make data-driven investment decisions',
      'Identify undervalued markets automatically',
      'Reduce appraisal costs by 60%',
      'Scale due diligence for high-volume investors'
    ]
  },
  {
    id: 'ai-energy-optimization',
    title: 'AI Energy Management & Carbon Reduction Platform',
    description: 'AI-powered energy optimization for commercial buildings, factories, and data centers. Monitors energy consumption in real-time, predicts demand, optimizes HVAC and lighting schedules, and identifies waste. Integrates with smart meters, BMS, and IoT sensors. Reduces energy costs by 20-35% and carbon emissions by 25%. ESG reporting included.',
    category: 'ai',
    icon: '⚡',
    href: '/services/ai-energy-optimization',
    industry: 'Energy, Facilities',
    stage: 'published',
    pricing: { basic: '$499/mo (1 facility)', pro: '$1,299/mo (5 facilities)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-energy-optimization', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time energy consumption monitoring',
      'AI demand forecasting & load optimization',
      'HVAC & lighting schedule optimization',
      'Anomaly detection for energy waste',
      'Carbon footprint tracking & reduction planning',
      'ESG & sustainability report generation',
      'Integration with smart meters, BMS, IoT',
      'Utility bill analysis & rate optimization'
    ],
    benefits: [
      'Reduce energy costs by 20-35%',
      'Cut carbon emissions by 25%',
      'Automate ESG reporting for stakeholders',
      'Identify equipment failures before they happen',
      'Optimize demand to avoid peak rate charges'
    ]
  },
  {
    id: 'ai-multilingual-translation',
    title: 'AI Multilingual Document Translation Engine',
    description: 'Enterprise-grade AI document translation that preserves formatting, context, and domain-specific terminology. Supports 100+ languages with custom glossary support for legal, medical, technical, and financial domains. Translates PDFs, Word docs, presentations, and websites while maintaining layout. 10x faster than human translation with 98% accuracy.',
    category: 'ai',
    icon: '🌐',
    href: '/services/ai-multilingual-translation',
    industry: 'Cross-Industry',
    stage: 'published',
    pricing: { basic: '$0.05/word', pro: '$0.03/word (volume)', enterprise: 'Custom pricing' },
    contactInfo: { website: '/services/ai-multilingual-translation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '100+ language pairs supported',
      'Format-preserving translation (PDF, PPTX, DOCX)',
      'Custom glossary & terminology management',
      'Domain-specific models (legal, medical, tech)',
      'Batch translation for large document sets',
      'Website localization with CMS integration',
      'Human-in-the-loop review workflow',
      'Translation memory for consistency'
    ],
    benefits: [
      'Translate 10x faster than human translators',
      'Reduce translation costs by 70%',
      'Maintain brand voice across all languages',
      'Scale global content without scaling team',
      'Ensure terminology consistency with glossaries'
    ]
  },
  {
    id: 'ai-predictive-maintenance',
    title: 'AI Predictive Maintenance for Industrial Equipment',
    description: 'Predict equipment failures before they happen using AI analysis of sensor data, vibration patterns, thermal imaging, and operational logs. Reduces unplanned downtime by 50%, extends equipment life by 20%, and cuts maintenance costs by 30%. Works with SCADA, PLC, and IoT sensor networks. Deployed in manufacturing, oil & gas, utilities, and transportation.',
    category: 'ai',
    icon: '⚙️',
    href: '/services/ai-predictive-maintenance',
    industry: 'Manufacturing, Industrial',
    stage: 'published',
    pricing: { basic: '$999/mo (up to 50 sensors)', pro: '$2,499/mo (250 sensors)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-predictive-maintenance', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time sensor data ingestion & analysis',
      'Failure prediction with time-to-failure estimates',
      'Vibration, thermal & acoustic anomaly detection',
      'Maintenance scheduling optimization',
      'Spare parts inventory forecasting',
      'SCADA, PLC & IoT platform integration',
      'Root cause analysis for recurring issues',
      'Mobile alerts for field technicians'
    ],
    benefits: [
      'Reduce unplanned downtime by 50%',
      'Extend equipment life by 20%',
      'Cut maintenance costs by 30%',
      'Optimize spare parts inventory',
      'Improve worker safety with early warnings'
    ]
  },
  {
    id: 'ai-revenue-recognition',
    title: 'AI Revenue Recognition & ASC 606 Compliance',
    description: 'Automate revenue recognition for complex multi-element arrangements, subscriptions, usage-based pricing, and milestone contracts. AI handles contract analysis, performance obligation identification, variable consideration estimation, and journal entry generation. Fully compliant with ASC 606 and IFRS 15. Reduces close time for revenue by 80%.',
    category: 'ai',
    icon: '📊',
    href: '/services/ai-revenue-recognition',
    industry: 'Finance, SaaS',
    stage: 'published',
    pricing: { basic: '$499/mo', pro: '$1,299/mo', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-revenue-recognition', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automated contract analysis & obligation identification',
      'Variable consideration estimation (usage, bonuses)',
      'Revenue schedule generation & journal entries',
      'Multi-element arrangement allocation',
      'ASC 606 / IFRS 15 compliance reporting',
      'Audit trail & disclosure report generation',
      'Integration with ERP (NetSuite, SAP, QuickBooks)',
      'Real-time revenue dashboards & forecasting'
    ],
    benefits: [
      'Reduce revenue close time by 80%',
      'Ensure ASC 606 / IFRS 15 compliance',
      'Eliminate spreadsheet-based revenue tracking',
      'Automate complex multi-element allocations',
      'Pass revenue audits with full documentation'
    ]
  }
];

export const wave263MicroSaasServices: Service[] = [
  {
    id: 'microsaas-community-platform',
    title: 'Branded Community & Membership Platform',
    description: 'Launch a branded online community for your customers, members, or fans. Includes discussion forums, member directories, event management, content libraries, and monetization (paid memberships, subscriptions). White-labeled with your domain and branding. Alternative to Facebook Groups and Slack with full data ownership.',
    category: 'micro-saas',
    icon: '👥',
    href: '/services/microsaas-community-platform',
    industry: 'Community, SaaS',
    stage: 'published',
    pricing: { basic: '$79/mo (500 members)', pro: '$199/mo (5,000 members)', enterprise: '$499/mo (unlimited)' },
    contactInfo: { website: '/services/microsaas-community-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Discussion forums with moderation tools',
      'Member profiles & directory',
      'Event management (virtual & in-person)',
      'Content library & resource sharing',
      'Paid membership & subscription billing',
      'Gamification (badges, points, leaderboards)',
      'Email digests & notification preferences',
      'Custom domain & white-label branding'
    ],
    benefits: [
      'Own your community data (not Facebook/Slack)',
      'Monetize with paid memberships',
      'Increase customer retention by 35%',
      'Build brand advocacy and peer support',
      'Launch in days, not months'
    ]
  },
  {
    id: 'microsaas-form-builder',
    title: 'Advanced Form Builder & Workflow Automation',
    description: 'Drag-and-drop form builder with conditional logic, calculations, file uploads, e-signatures, and multi-step workflows. Routes submissions to the right team, triggers automations, and updates databases. Replaces Typeform, JotForm, and paper processes. HIPAA and GDPR compliant options available.',
    category: 'micro-saas',
    icon: '📝',
    href: '/services/microsaas-form-builder',
    industry: 'Cross-Industry',
    stage: 'published',
    pricing: { basic: '$29/mo (1,000 submissions)', pro: '$79/mo (10,000 submissions)', enterprise: '$199/mo (unlimited)' },
    contactInfo: { website: '/services/microsaas-form-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Drag-and-drop form builder (no code)',
      'Conditional logic & branching',
      'Calculations & formula fields',
      'File uploads with cloud storage',
      'E-signature capture',
      'Workflow routing & approval chains',
      'Integration with 50+ apps (Zapier, native)',
      'HIPAA/GDPR compliance options'
    ],
    benefits: [
      'Replace paper forms and manual processes',
      'Automate approval workflows end-to-end',
      'Collect e-signatures without DocuSign costs',
      'Route submissions to the right team instantly',
      'Ensure compliance with built-in safeguards'
    ]
  }
];

export const wave263ItServices: Service[] = [
  {
    id: 'it-disaster-recovery',
    title: 'Disaster Recovery as a Service (DRaaS)',
    description: 'Fully managed disaster recovery solution with automated failover, continuous data replication, and guaranteed RTO/RPO. Protects on-premises, cloud, and hybrid environments. Includes DR planning, runbook development, regular testing, and 24/7 monitoring. Achieve enterprise-grade DR at 60% less than traditional DR sites.',
    category: 'it',
    icon: '🔄',
    href: '/services/it-disaster-recovery',
    industry: 'Cross-Industry',
    stage: 'published',
    pricing: { basic: '$1,999/mo (up to 10 VMs)', pro: '$4,999/mo (50 VMs)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/it-disaster-recovery', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Continuous data replication (RPO under 15 min)',
      'Automated failover & failback',
      'DR runbook development & documentation',
      'Quarterly DR testing included',
      '24/7 monitoring & alerting',
      'Multi-region cloud recovery targets',
      'Ransomware recovery with immutable backups',
      'Compliance-ready DR documentation'
    ],
    benefits: [
      'Achieve RTO under 1 hour, RPO under 15 min',
      '60% cheaper than traditional DR sites',
      'Test DR regularly without production impact',
      'Recover from ransomware with clean backups',
      'Meet business continuity compliance requirements'
    ]
  },
  {
    id: 'it-network-infrastructure',
    title: 'Network Infrastructure Design & Support',
    description: 'Complete network infrastructure services from design to ongoing support. Includes LAN/WAN design, SD-WAN deployment, WiFi site surveys, network security hardening, and 24/7 NOC monitoring. Optimize for performance, reliability, and cost. Supports Cisco, Meraki, Ubiquiti, and Aruba environments.',
    category: 'it',
    icon: '🌐',
    href: '/services/it-network-infrastructure',
    industry: 'Cross-Industry',
    stage: 'published',
    pricing: { basic: '$2,499 (design + assessment)', pro: '$7,499 (deployment)', enterprise: 'Custom managed NOC' },
    contactInfo: { website: '/services/it-network-infrastructure', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'LAN/WAN architecture design & documentation',
      'SD-WAN deployment & optimization',
      'WiFi site survey & access point planning',
      'Network security hardening & segmentation',
      'Firewall configuration & management',
      '24/7 NOC monitoring & alerting',
      'Capacity planning & bandwidth optimization',
      'Vendor management & hardware procurement'
    ],
    benefits: [
      'Achieve 99.99% network uptime',
      'Optimize bandwidth costs with SD-WAN',
      'Secure network with zero-trust segmentation',
      'Scale network for growth without redesign',
      '24/7 expert monitoring without hiring NOC staff'
    ]
  }
];
