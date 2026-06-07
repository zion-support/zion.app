import { Service } from './serviceTypes';

export const wave177SecurityServices: Service[] = [
  {
    id: 'w177-security-incident-response',
    title: 'Incident Response Retainer',
    description: '24/7 incident response retainer for breaches, outages, and ransomware. Includes on-call IR team, forensics, containment, communication plan, and post-incident reporting.',
    features: ['24/7 on-call IR team', 'Forensic evidence collection', 'Containment and eradication', 'Stakeholder communication plan', 'Post-incident report'],
    benefits: ['Reduce breach dwell time', 'Meet regulatory disclosure timelines', 'Preserve evidence for insurance and legal', 'Restore trust with stakeholders'],
    pricing: { basic: '$1,499/mo', pro: '$3,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/w177-security-incident-response', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚨', href: '/services/w177-security-incident-response', popular: false, category: 'security', industry: 'Security Services',
  },
];

export const wave177CloudServices: Service[] = [
  {
    id: 'w177-cloud-cost-optimization',
    title: 'Cloud Cost Optimization',
    description: 'Reduce cloud spend 20-40% with rightsizing, reserved instance planning, and waste detection across AWS, Azure, and GCP.',
    features: ['Cost visibility and dashboards', 'Rightsizing recommendations', 'Reserved instance planning', 'Waste detection and cleanup', 'Multi-cloud normalization', 'Anomaly alerts and budgets'],
    benefits: ['Lower spend without performance loss', 'Visibility into every resource', 'Protect against billing surprises', 'Finance and engineering alignment'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/w177-cloud-cost-optimization', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💸', href: '/services/w177-cloud-cost-optimization', popular: false, category: 'cloud', industry: 'Cloud',
  },
];

export const wave177DataServices: Service[] = [
  {
    id: 'w177-data-realtime-pipeline',
    title: 'Realtime Data Pipeline',
    description: 'Kafka/Flink-based streaming pipelines for operational analytics, CDC, and event-driven architectures with schema governance.',
    features: ['Change data capture (CDC)', 'Stream processing and enrichment', 'Schema registry and governance', 'Dead-letter handling and replay', 'Operational dashboards', 'Data quality checks'],
    benefits: ['Insights within seconds, not hours', 'Reduce batch-window complexity', 'Governed data as it flows', 'Resilient pipelines with replay'],
    pricing: { basic: '$1,199/mo', pro: '$3,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/w177-data-realtime-pipeline', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄', href: '/services/w177-data-realtime-pipeline', popular: false, category: 'data', industry: 'Data Engineering',
  },
];

export const wave177AutomationServices: Service[] = [
  {
    id: 'w177-automation-process-mining',
    title: 'Process Mining & Automation Discovery',
    description: 'Discover real workflows from system logs, model optimization paths, and generate automation candidates with ROI estimates.',
    features: ['Process discovery from logs', 'Bottleneck identification', 'Automation opportunity scoring', 'ROI estimation', 'Flow generation for RPA/iPaaS', 'Change impact analysis'],
    benefits: ['Automate what matters most first', 'Prove ROI before building', 'Reduce manual assessment work', 'Continuous improvement loop'],
    pricing: { basic: '$799/mo', pro: '$2,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/w177-automation-process-mining', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⛏️', href: '/services/w177-automation-process-mining', popular: false, category: 'automation', industry: 'Automation',
  },
];

export const wave177MicroSaasServices: Service[] = [
  {
    id: 'w177-micro-saas-workos-auth',
    title: 'WorkOS Auth Kit',
    description: 'Drop-in SSO, directory sync, and audit logs for micro-SaaS: SAML, OIDC, SCIM, and admin APIs.',
    features: ['SSO with SAML/OIDC', 'SCIM directory sync', 'Audit logs and events', 'Admin dashboard', 'Org and role management', 'Security hardening support'],
    benefits: ['Sell to enterprise buyers faster', 'Reduce identity engineering cost', 'Pass SOC2/ISO audits easier', 'Standard auth with less code'],
    pricing: { basic: '$39/mo', pro: '$99/mo', enterprise: '$299/mo' },
    contactInfo: { website: '/services/w177-micro-saas-workos-auth', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧩', href: '/services/w177-micro-saas-workos-auth', popular: true, category: 'micro-saas', industry: 'Developer Tools',
  },
];

export const wave177ItServices: Service[] = [
  {
    id: 'w177-it-backup-recovery',
    title: 'Backup & Disaster Recovery',
    description: 'Policy-driven backups, point-in-time recovery, and DR runbooks for SaaS and infrastructure with RPO/RTO guarantees.',
    features: ['Policy-driven backup schedules', 'Point-in-time recovery', 'DR runbooks and testing', 'Cross-region replication', 'RPO/RTO reporting', 'Compliance retention'],
    benefits: ['Reduce data loss risk', 'Meet recovery objectives', 'Operationalize DR with runbooks', 'Retention compliance without guesswork'],
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/w177-it-backup-recovery', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗄️', href: '/services/w177-it-backup-recovery', popular: false, category: 'it', industry: 'Infrastructure',
  },
];

export const wave177AiServices: Service[] = [
  {
    id: 'w177-ai-meeting-intelligence',
    title: 'Meeting Intelligence Platform',
    description: 'Record, transcribe, summarize meetings, extract action items, and push them to CRM/project tools automatically.',
    features: ['Recording and transcription', 'Summaries and highlights', 'Action item extraction', 'Sentiment and engagement signals', 'CRM/project tool sync', 'Meeting search and replay'],
    benefits: ['Never miss a commitment', 'Summarize meetings in minutes', 'Automate follow-ups', 'Improve team alignment'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$499/mo' },
    contactInfo: { website: '/services/w177-ai-meeting-intelligence', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯', href: '/services/w177-ai-meeting-intelligence', popular: true, category: 'ai', industry: 'Productivity',
  },
];
