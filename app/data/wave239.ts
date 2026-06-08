import { Service } from './serviceTypes';

// =============================================================================
// Wave 239 — Services
// =============================================================================
// AI Services (2)
export const wave239AiServices: Service[] = [
  {
    id: 'ai-powered-insurance-claims-triage-processing',
    title: 'AI-Powered Insurance Claims Triage & Processing',
    description:
      'Auto-classify claims by severity, detect fraudulent submissions with ML, estimate damage from photos, calculate accurate payouts.',
    features: [
      'Intelligent claim classification engine that auto-categorizes incoming claims by type severity and urgency routing high-risk flags to senior adjusters',
      'ML-powered fraud detection model trained on historical claim patterns anomaly signals and cross-referenced third-party data to flag suspicious submissions',
      'Photo-based damage estimation using computer vision to assess vehicle property and asset damage from uploaded images with itemized cost breakdowns',
      'Automated payout calculation engine that applies policy terms deductibles coverage limits and depreciation rules to generate accurate settlement amounts',
      'End-to-end claims workflow orchestration with status tracking automated claimant notifications SLA compliance monitoring and escalation triggers',
      'Analytics dashboard with fraud rate trends claims processing time benchmarks adjuster workload distribution and regulatory compliance reporting',
    ],
    benefits: [
      'Reduce claims processing time by 70% through intelligent automation freeing adjusters to focus on complex high-value cases',
      'Cut fraudulent payouts by up to 45% with ML models that catch suspicious patterns invisible to manual review',
      'Improve claimant satisfaction with faster turnaround times transparent status updates and consistent damage assessments',
      'Ensure regulatory compliance with auditable decision trails automated documentation and jurisdiction-specific rule enforcement',
      'Scale claims volume linearly without proportional headcount growth maintaining quality during catastrophic events and seasonal spikes',
    ],
    pricing: {
      basic: '$2,499/mo',
      pro: '$5,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-powered-insurance-claims-triage-processing',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'file-search',
    href: '/services/ai-powered-insurance-claims-triage-processing',
    popular: true,
    category: 'ai',
    industry: 'Insurance',
    stage: 'published',
  },
  {
    id: 'ai-employee-engagement-retention-analytics',
    title: 'AI Employee Engagement & Retention Analytics',
    description:
      'Pulse surveys engagement scoring flight risk prediction and actionable recommendations to reduce turnover.',
    features: [
      'Automated pulse survey engine with customizable question libraries smart scheduling response anonymity and real-time participation tracking',
      'Composite engagement scoring algorithm that synthesizes survey responses interaction patterns and behavioral signals into per-employee indices',
      'Flight risk prediction model using tenure performance communication sentiment and market factors to identify flight-prone employees before they resign',
      'Actionable recommendation engine suggesting targeted interventions manager coaching assignments and policy adjustments based on engagement root causes',
      'Manager dashboards with team-level engagement heatmaps trend lines peer comparison benchmarks and automated alert triggers for declining scores',
      'Exit interview analysis and turnover cost modeling reporting attrition drivers back to leadership with prioritized retention investment recommendations',
    ],
    benefits: [
      'Reduce voluntary turnover by 30% through early identification and proactive intervention for at-risk high performers',
      'Increase employee engagement scores with data-driven action plans tailored to each team unique challenges and culture',
      'Save $50K+ per avoided replacement by predicting and preventing costly departures of experienced institutional talent',
      'Empower managers with real-time visibility into team morale replacing annual survey sadness with continuous listening and rapid response',
      'Build a measurable retention strategy backed by predictive analytics rather than anecdotal exit interview guesswork',
    ],
    pricing: {
      basic: '$4/employee/mo',
      pro: '$8/employee/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-employee-engagement-retention-analytics',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'account-heart',
    href: '/services/ai-employee-engagement-retention-analytics',
    category: 'ai',
    industry: 'Human Resources',
    stage: 'published',
  },
];

// IT Services (1)
export const wave239ItServices: Service[] = [
  {
    id: 'container-security-kubernetes-hardening',
    title: 'Container Security & Kubernetes Hardening',
    description:
      'Image scanning runtime protection network policies and compliance benchmarks for Kubernetes environments.',
    features: [
      'Container image vulnerability scanning integrated into CI/CD pipelines detecting CVEs malware and misconfigurations before deployment',
      'Runtime threat protection with behavioral monitoring process anomaly detection syscall analysis and automatic pod quarantine on compromise',
      'Kubernetes network policy automation that enforces least-privilege pod-to-pod segmentation ingress-egress rules and service mesh integration',
      'Compliance benchmark engine running CIS Kubernetes Docker and NSA hardening checks with remediation playbooks and drift detection',
      'RBAC auditing and least-privilege analysis identifying excessive permissions role binding conflicts and service account abuse patterns',
      'Centralized security dashboard with risk posture scoring namespace-level vulnerability heatmaps compliance status trends and audit-ready reports',
    ],
    benefits: [
      'Prevent 90% of container exploits by catching vulnerabilities at build time and enforcing zero-trust runtime policies',
      'Achieve continuous compliance with CIS benchmarks and eliminate weeks of manual audit preparation through automated evidence collection',
      'Reduce blast radius of compromises with network policies that isolate workloads and alert on lateral movement within minutes',
      'Empower DevOps teams to ship faster with embedded security gates that catch issues early without slowing velocity',
      'Meet SOC2 PCI-DSS and FedRAMP container requirements with policy-as-code enforcement and scheduled compliance scans',
    ],
    pricing: {
      basic: '$999/mo',
      pro: '$2,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/container-security-kubernetes-hardening',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'shield-lock',
    href: '/services/container-security-kubernetes-hardening',
    popular: true,
    category: 'it',
    industry: 'DevSecOps',
    stage: 'published',
  },
];

// Micro-SaaS Services (2)
export const wave239MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-invoice-payment-collection',
    title: 'Micro-SaaS Invoice & Payment Collection',
    description:
      'Recurring invoices payment reminders dunning management and payment gateway integration.',
    features: [
      'Recurring invoice automation with customizable billing cycles proration support multi-currency invoicing and auto-delivery via email or portal',
      'Smart payment reminder engine with configurable escalation sequences personalized messaging A/B testing and channel selection email SMS',
      'Automated dunning management that retries failed payments updates expired cards and gracefully escalates to collections workflow integration',
      'Payment gateway integration supporting Stripe PayPal Square and ACH bank transfers with unified reconciliation and real-time transaction sync',
      'Customer payment portal allowing self-service invoice review online payment method updates download history and receipt generation',
      'Collections analytics dashboard with DSO tracking aging reports churn correlation revenue recovery rates and automated escalation threshold configuration',
    ],
    benefits: [
      'Reduce days sales outstanding by 25% through automated reminders that recover payments before they become overdue',
      'Cut failed payment churn by 60% with intelligent dunning retries and proactive card expiration notifications',
      'Save 10+ hours per week on manual invoicing and chasing payments freeing your finance team to focus on strategic work',
      'Improve cash flow predictability with real-time visibility into outstanding receivables upcoming recurring revenue and collection bottlenecks',
      'Deliver a professional payment experience that customers appreciate with self-service portals and flexible payment options',
    ],
    pricing: {
      basic: '$29/mo',
      pro: '$69/mo',
      enterprise: '$149/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-invoice-payment-collection',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'receipt-text',
    href: '/services/micro-saas-invoice-payment-collection',
    category: 'micro-saas',
    industry: 'Finance/Accounting',
    stage: 'published',
  },
  {
    id: 'micro-saas-knowledge-base-help-center',
    title: 'Micro-SaaS Knowledge Base & Help Center',
    description:
      'Self-service portal article management search analytics and feedback collection.',
    features: [
      'Self-service help center portal with customizable branding category navigation responsive design and multi-language article support',
      'Article management system with WYSIWYG editor version control collaborative drafting workflow publishing schedules and role-based permissions',
      'Search analytics engine tracking query volume top searches zero-click results and content gap identification to prioritize article creation',
      'Visitor feedback collection with per-article helpfulness ratings comment threads CSAT surveys and support ticket deflection tracking',
      'SEO optimization tools including meta tag management automatic sitemaps semantic URL formatting and search-engine-friendly content structuring',
      'Integration suite connecting to Intercom Zendesk Freshdesk and Slack routing unanswered searches into live support ticket queues',
    ],
    benefits: [
      'Deflect up to 40% of support tickets by giving customers instant access to well-organized searchable self-service content',
      'Reduce average resolution time as customers find answers faster through intelligent search that learns from every interaction',
      'Turn your knowledge base into an SEO asset that attracts organic traffic and reduces customer acquisition costs',
      'Identify content gaps using search analytics so every new article addresses real customer pain points not guesses',
      'Scale support without scaling headcount by empowering customers to help themselves across every timezone and channel',
    ],
    pricing: {
      basic: '$49/mo',
      pro: '$129/mo',
      enterprise: '$299/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-knowledge-base-help-center',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'book-open-variant',
    href: '/services/micro-saas-knowledge-base-help-center',
    category: 'micro-saas',
    industry: 'Customer Support',
    stage: 'published',
  },
];
