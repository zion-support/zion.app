import { Service } from './serviceTypes';

// Wave 262: Real AI + Micro-SaaS + IT Services
// Research by OWL Agent — 2026-06-19

export const wave262AiServices: Service[] = [
  {
    id: 'ai-supply-chain-optimizer',
    title: 'AI Supply Chain Optimization Platform',
    description: 'End-to-end supply chain visibility and optimization powered by AI. Demand forecasting, inventory optimization, supplier risk scoring, and logistics route planning in a single platform. Reduces inventory costs by 25%, improves forecast accuracy to 94%, and cuts logistics spend by 15%. Integrates with SAP, Oracle, and major ERPs.',
    category: 'ai',
    icon: '🔗',
    href: '/services/ai-supply-chain-optimizer',
    industry: 'Supply Chain',
    stage: 'published',
    pricing: { basic: '$799/mo', pro: '$1,999/mo', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-supply-chain-optimizer', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI demand forecasting (94% accuracy)',
      'Multi-echelon inventory optimization',
      'Supplier risk scoring & monitoring',
      'Logistics route & carrier optimization',
      'Real-time supply chain control tower',
      'Scenario planning & what-if analysis',
      'ERP integration (SAP, Oracle, NetSuite)',
      'Carbon footprint tracking per shipment'
    ],
    benefits: [
      'Reduce inventory holding costs by 25%',
      'Improve forecast accuracy to 94%',
      'Cut logistics spend by 15%',
      'Mitigate supplier disruption risk proactively',
      'Achieve end-to-end supply chain visibility'
    ]
  },
  {
    id: 'ai-financial-close-automation',
    title: 'AI Financial Close & Reconciliation Automation',
    description: 'Automate the month-end close process with AI-powered reconciliation, journal entry automation, variance analysis, and compliance documentation. Reduces close time from 10 days to 3 days. Integrates with QuickBooks, Xero, NetSuite, and SAP. Trusted by CFOs at mid-market and enterprise companies.',
    category: 'ai',
    icon: '💰',
    href: '/services/ai-financial-close-automation',
    industry: 'Finance',
    stage: 'published',
    pricing: { basic: '$599/mo', pro: '$1,499/mo', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-financial-close-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automated intercompany reconciliation',
      'AI journal entry suggestions & posting',
      'Variance analysis with anomaly flagging',
      'Close task management & checklist automation',
      'Multi-GAAP/IFRS compliance support',
      'Audit trail & supporting documentation',
      'ERP/accounting system integration',
      'Real-time close status dashboard'
    ],
    benefits: [
      'Reduce close time from 10 days to 3 days',
      'Eliminate manual reconciliation errors',
      'Free finance team for strategic work',
      'Always audit-ready with full documentation',
      'Standardize close process across entities'
    ]
  },
  {
    id: 'ai-meeting-intelligence',
    title: 'AI Meeting Intelligence & Action Tracking',
    description: 'Automatically records, transcribes, and analyzes meetings across Zoom, Teams, and Google Meet. AI generates summaries, extracts action items, tracks decisions, and follow-ups. Integrates with project management tools. Never miss an action item again. Speakers are identified, sentiment is tracked, and meeting ROI is measured.',
    category: 'ai',
    icon: '🎙️',
    href: '/services/ai-meeting-intelligence',
    industry: 'Productivity',
    stage: 'published',
    pricing: { basic: '$15/user/mo', pro: '$29/user/mo', enterprise: '$49/user/mo' },
    contactInfo: { website: '/services/ai-meeting-intelligence', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automatic recording & transcription (99% accuracy)',
      'AI-generated meeting summaries & highlights',
      'Action item extraction & owner assignment',
      'Decision tracking with timestamps',
      'Speaker identification & talk-time analytics',
      'Sentiment & engagement analysis',
      'Integration with Slack, Jira, Asana, Monday',
      'Searchable meeting knowledge base'
    ],
    benefits: [
      'Save 5+ hours per week on meeting notes',
      'Never lose track of action items',
      'Make meetings searchable and accountable',
      'Reduce unnecessary meetings by 30%',
      'Onboard new teammates with meeting history'
    ]
  },
  {
    id: 'ai-customer-churn-predictor',
    title: 'AI Customer Churn Prediction & Prevention',
    description: 'Predict which customers are at risk of churning 60-90 days before they leave. AI analyzes product usage, support tickets, NPS scores, billing history, and engagement patterns. Automatically triggers retention workflows with personalized offers, outreach, and success interventions. Reduces churn by 25-40% for SaaS and subscription businesses.',
    category: 'ai',
    icon: '🚨',
    href: '/services/ai-customer-churn-predictor',
    industry: 'SaaS, Subscription',
    stage: 'published',
    pricing: { basic: '$299/mo (up to 1,000 accounts)', pro: '$799/mo (10,000 accounts)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-customer-churn-predictor', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Churn risk scoring (60-90 day prediction window)',
      'Multi-signal analysis (usage, tickets, NPS, billing)',
      'Automated retention workflow triggers',
      'Personalized win-back campaign recommendations',
      'Cohort analysis & churn driver identification',
      'CSM dashboard with prioritized action list',
      'CRM integration (Salesforce, HubSpot)',
      'Revenue-at-risk reporting'
    ],
    benefits: [
      'Reduce customer churn by 25-40%',
      'Save accounts 60-90 days before they leave',
      'Prioritize CSM time on highest-risk accounts',
      'Increase net revenue retention to 110%+',
      'Understand root causes of churn across cohorts'
    ]
  },
  {
    id: 'ai-cybersecurity-threat-hunting',
    title: 'AI Cybersecurity Threat Hunting Platform',
    description: 'Proactive threat hunting powered by AI that continuously scours your network, endpoints, and cloud workloads for hidden threats. Detects zero-day attacks, lateral movement, insider threats, and advanced persistent threats that bypass traditional security tools. Integrates with SIEM, EDR, and SOAR platforms. Reduces mean time to detect (MTTD) from 200 days to hours.',
    category: 'ai',
    icon: '🛡️',
    href: '/services/ai-cybersecurity-threat-hunting',
    industry: 'Cybersecurity',
    stage: 'published',
    pricing: { basic: '$1,499/mo', pro: '$3,999/mo', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/ai-cybersecurity-threat-hunting', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Continuous automated threat hunting',
      'Behavioral anomaly detection (UEBA)',
      'Lateral movement & persistence detection',
      'Insider threat identification',
      'MITRE ATT&CK framework mapping',
      'SIEM/EDR/SOAR integration (Splunk, CrowdStrike, Sentinel)',
      'Automated investigation playbooks',
      'Threat intelligence feed enrichment'
    ],
    benefits: [
      'Reduce MTTD from 200 days to hours',
      'Detect threats that bypass traditional tools',
      'Automate 80% of Tier 1 SOC analyst work',
      'Map findings to MITRE ATT&CK for compliance',
      'Proactively hunt instead of reactively respond'
    ]
  }
];

export const wave262MicroSaasServices: Service[] = [
  {
    id: 'microsaas-employee-onboarding',
    title: 'Employee Onboarding & Offboarding Platform',
    description: 'Complete employee lifecycle management from offer letter to exit interview. Automates provisioning (laptops, accounts, access), onboarding checklists, training assignments, and 30/60/90-day check-ins. Offboarding securely revokes access, collects assets, and captures exit insights. Integrates with HRIS, IT ticketing, and identity providers.',
    category: 'micro-saas',
    icon: '👋',
    href: '/services/microsaas-employee-onboarding',
    industry: 'HR, Cross-Industry',
    stage: 'published',
    pricing: { basic: '$99/mo (up to 50 employees)', pro: '$249/mo (200 employees)', enterprise: '$499/mo (unlimited)' },
    contactInfo: { website: '/services/microsaas-employee-onboarding', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automated onboarding workflows by role/department',
      'IT provisioning (accounts, laptop, access)',
      'Training assignment & progress tracking',
      '30/60/90-day check-in surveys',
      'Offboarding access revocation & asset collection',
      'Exit interview & offboarding analytics',
      'HRIS integration (BambooHR, Workday, Ripple)',
      'E-signature for offer letters & documents'
    ],
    benefits: [
      'Reduce time-to-productivity by 40%',
      'Eliminate manual provisioning errors',
      'Ensure zero access gaps during offboarding',
      'Improve new hire retention by 25%',
      'Standardize onboarding across locations'
    ]
  },
  {
    id: 'microsaas-vendor-management',
    title: 'Vendor & Procurement Management Platform',
    description: 'Centralized vendor management with AI-powered procurement workflows. Track contracts, manage renewals, score vendor performance, and automate purchase approvals. Reduces procurement cycle time by 50% and ensures no contract auto-renews unexpectedly. Integrates with accounting and ERP systems.',
    category: 'micro-saas',
    icon: '🏪',
    href: '/services/microsaas-vendor-management',
    industry: 'Procurement, Cross-Industry',
    stage: 'published',
    pricing: { basic: '$79/mo', pro: '$199/mo', enterprise: '$449/mo' },
    contactInfo: { website: '/services/microsaas-vendor-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Centralized vendor database & profiles',
      'Contract lifecycle management',
      'Automated renewal alerts (90/60/30 days)',
      'Vendor performance scorecards',
      'Purchase request & approval workflows',
      'Spend analytics by category/vendor',
      'Document storage & e-signatures',
      'Integration with QuickBooks, SAP, NetSuite'
    ],
    benefits: [
      'Reduce procurement cycle time by 50%',
      'Never miss a contract renewal or deadline',
      'Optimize spend with vendor performance data',
      'Eliminate shadow IT and rogue purchasing',
      'Centralize all vendor communication and docs'
    ]
  }
];

export const wave262ItServices: Service[] = [
  {
    id: 'it-cloud-migration',
    title: 'Cloud Migration & Modernization Service',
    description: 'End-to-end cloud migration from on-premises to AWS, Azure, or GCP. Includes discovery & assessment, migration planning, workload migration, optimization, and post-migration support. Handles lift-and-shift, re-platforming, and re-architecting strategies. Zero-downtime migrations with automated rollback. Reduces infrastructure costs by 30-50%.',
    category: 'it',
    icon: '☁️',
    href: '/services/it-cloud-migration',
    industry: 'Cross-Industry',
    stage: 'published',
    pricing: { basic: '$9,999 (assessment + plan)', pro: '$24,999 (migration up to 20 servers)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/it-cloud-migration', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Full infrastructure discovery & assessment',
      'Migration strategy (lift-shift, re-platform, re-architect)',
      'Automated workload migration tooling',
      'Database migration with zero downtime',
      'Post-migration cost optimization',
      'Security & compliance validation',
      'Staff training & knowledge transfer',
      '90-day post-migration support included'
    ],
    benefits: [
      'Reduce infrastructure costs by 30-50%',
      'Achieve zero-downtime migration',
      'Modernize legacy apps during migration',
      'Improve scalability and disaster recovery',
      'Free IT team to focus on innovation'
    ]
  },
  {
    id: 'it-managed-detection-response',
    title: 'Managed Detection & Response (MDR) 24/7',
    description: '24/7 managed cybersecurity monitoring, detection, and response service. Our SOC-as-a-Service provides real-time threat monitoring, incident investigation, containment, and remediation. Includes endpoint detection, network monitoring, cloud security, and threat intelligence. Achieve enterprise-grade security at 40% less than building an internal SOC.',
    category: 'it',
    icon: '🔒',
    href: '/services/it-managed-detection-response',
    industry: 'Cybersecurity',
    stage: 'published',
    pricing: { basic: '$2,499/mo (up to 50 endpoints)', pro: '$5,999/mo (250 endpoints)', enterprise: 'Custom quote' },
    contactInfo: { website: '/services/it-managed-detection-response', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '24/7/365 security monitoring by expert analysts',
      'Endpoint Detection & Response (EDR)',
      'Network traffic analysis & anomaly detection',
      'Cloud workload protection (AWS/Azure/GCP)',
      'Incident investigation & containment',
      'Threat intelligence integration',
      'Monthly security reports & recommendations',
      'Compliance support (SOC 2, HIPAA, PCI DSS)'
    ],
    benefits: [
      'Enterprise security at 40% less than internal SOC',
      '24/7 coverage without hiring night shift',
      'Reduce breach risk with expert monitoring',
      'Meet compliance requirements cost-effectively',
      'Access to elite cybersecurity talent on-demand'
    ]
  }
];
