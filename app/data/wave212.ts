import { Service } from './serviceTypes';

// Wave 212 — AI Observability, Data Privacy, Cloud FinOps, Security Threat Intel & AI Transparency (5 services)
// Research by @tablet_kleber_bot — 2026-06-14
// New categories: ai-observability, data-privacy, cloud-finops, security-threat-intel, ai-transparency

export const wave212AiObservabilityServices: Service[] = [
  {
    id: 'ai-observability-monitoring-platform',
    title: 'AI Observability & Monitoring Platform',
    description: 'Full-stack AI observability platform that monitors model performance, data drift, prediction quality, and infrastructure health across all ML pipelines in production. Unlike traditional APM tools purpose-built for software, this platform understands ML-specific concepts — feature distributions, embedding drift, concept drift, label quality, and model staleness. Integrated with Kubernetes, SageMaker, Vertex AI, and custom inference endpoints.',
    category: 'ai',
    icon: '📡',
    href: '/services/ai-observability-monitoring-platform',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: '$399/mo', pro: '$1,199/mo', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real-time model performance monitoring with custom ML metrics',
      'Automated data drift detection using statistical tests (PSI, KL divergence, KS test)',
      'Feature attribution tracking and explanation consistency across model versions',
      'Kubernetes-native deployment with Helm charts and operator pattern',
      'Slack/PagerDuty/Teams alerting with ML-specific notification templates',
      'Model registry integration with MLflow, SageMaker, Vertex AI, and custom endpoints'
    ],
    benefits: [
      'Reduce model degradation incidents by 80% with proactive drift detection',
      'Cut ML infrastructure costs by 35% through right-sizing recommendations',
      'Achieve regulatory compliance with full audit trails and explainability reports',
      'Accelerate model deployment cycles with automated quality gates and shadow testing',
      'Unify observability across 100+ models with a single pane of glass dashboard'
    ]
  }
];

export const wave212DataPrivacyServices: Service[] = [
  {
    id: 'data-privacy-consent-management',
    title: 'Data Privacy & Consent Management Platform',
    description: 'Enterprise-grade consent and privacy management platform that automates GDPR, CCPA, LGPD, and POPIA compliance across all customer touchpoints. Provides real-time consent collection, preference centers, data subject request (DSR) automation, privacy impact assessments, and cross-border data transfer management. Designed for organizations processing millions of customer records who need to demonstrate compliance to regulators and auditors.',
    category: 'security',
    icon: '🛡️',
    href: '/services/data-privacy-consent-management',
    industry: 'Legal & Compliance',
    stage: 'published',
    pricing: { basic: '$599/mo', pro: '$1,799/mo', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Universal consent management with SDK for web, mobile, and server-side',
      'Automated data subject access requests (DSAR) with 30-day SLA guarantee',
      'Privacy impact assessment (PIA) automation with risk scoring and mitigation workflows',
      'Cross-border data transfer management with Standard Contractual Clause generation',
      'Real-time violation detection and remediation with audit trail for regulators',
      'Integration with 200+ marketing, analytics, and CRM platforms via API'
    ],
    benefits: [
      'Eliminate manual DSAR processing and reduce response time from weeks to hours',
      'Avoid regulatory fines up to 4% of global revenue with automated compliance workflows',
      'Increase customer trust with transparent preference centers and consent receipts',
      'Reduce legal review costs by 60% with automated privacy impact assessments',
      'Scale compliance across all jurisdictions without adding headcount'
    ]
  }
];

export const wave212CloudFinOpsServices: Service[] = [
  {
    id: 'cloud-finops-governance-platform',
    title: 'Cloud FinOps Governance & Cost Intelligence Platform',
    description: 'Advanced cloud financial operations platform that provides multi-cloud cost allocation, commitment management, anomaly detection, and chargeback automation across AWS, Azure, and Google Cloud. Goes beyond basic cost dashboards with AI-powered waste detection, reserved instance optimization, savings plan recommendations, and unit economics tracking. Designed for engineering-led organizations that want to treat cloud spend as a first-class operational metric.',
    category: 'devops',
    icon: '💰',
    href: '/services/cloud-finops-governance-platform',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: '$799/mo', pro: '$2,499/mo', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-cloud cost allocation with tag enforcement and account hierarchy mapping',
      'AI-powered waste detection identifying idle resources, overprovisioned instances, and orphan volumes',
      'Reserved Instance and Savings Plan optimization with 12-month commitment modeling',
      'Unit economics dashboard tracking cost per transaction, user, API call, and feature delivery',
      'Automated chargeback showback reports with engineering team Slack notifications',
      'Anomaly detection with configurable thresholds and root cause analysis across dimensions'
    ],
    benefits: [
      'Reduce cloud spend by 30-45% through automated waste identification and remediation',
      'Increase Reserved Instance coverage from typical 30% to 85%+ with optimization recommendations',
      'Enable engineering teams to own cloud costs with self-service allocation dashboards',
      'Prevent budget overruns with real-time anomaly detection and automated threshold alerts',
      'Demonstrate cloud ROI to leadership with unit economics and cost-per-delivery metrics'
    ]
  }
];

export const wave212SecurityThreatIntelServices: Service[] = [
  {
    id: 'security-threat-intelligence-platform',
    title: 'Security Threat Intelligence & Attack Surface Management',
    description: 'Enterprise threat intelligence platform that continuously monitors your external attack surface, dark web presence, brand impersonation, and adversary infrastructure. Combines automated OSINT collection with curated threat feeds, IOC matching, and machine learning to identify threats before they materialize. Integrates with SIEM, SOAR, and ticketing platforms to automate response workflows. Designed for security teams who need to move from reactive detection to proactive threat anticipation.',
    category: 'security',
    icon: '🔍',
    href: '/services/security-threat-intelligence-platform',
    industry: 'Financial Services & FinTech',
    stage: 'published',
    pricing: { basic: '$1,299/mo', pro: '$3,999/mo', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Continuous external attack surface monitoring across 500+ internet-facing assets',
      'Dark web and criminal forum monitoring for leaked credentials, data dumps, and brand mentions',
      'Brand impersonation detection across domain registrations, social media, and mobile app stores',
      'Automated IOC enrichment and correlation with your SIEM/SOAR platforms',
      'Threat actor profiling with infrastructure tracking and TTP mapping using MITRE ATT&CK',
      'Executive risk dashboard with trend analysis, benchmarking, and quarterly threat reports'
    ],
    benefits: [
      'Reduce mean time to detect (MTTD) threats by 70% with continuous surface monitoring',
      'Prevent credential-stuffing attacks with early warning of leaked employee credentials',
      'Identify and takedown phishing domains and impersonation sites within hours, not weeks',
      'Cut threat intelligence analyst workload by 50% through automated IOC enrichment',
      'Demonstrate security leadership to board with quantified risk reduction reporting'
    ]
  }
];

export const wave212AiTransparencyServices: Service[] = [
  {
    id: 'ai-transparency-explainability-engine',
    title: 'AI Transparency & Explainability Engine',
    description: 'Drop-in AI explainability engine that makes any black-box model transparent and auditable. Provides local explanations (SHAP, LIME, Integrated Gradients) for individual predictions and global explanations for overall model behavior. Designed for regulated industries — healthcare, finance, insurance, and government — where AI decisions must be explainable to regulators, auditors, and affected individuals. Works with any model framework: TensorFlow, PyTorch, scikit-learn, XGBoost, and API-based models.',
    category: 'ai',
    icon: '🔬',
    href: '/services/ai-transparency-explainability-engine',
    industry: 'Healthcare & Life Sciences',
    stage: 'published',
    popular: true,
    pricing: { basic: '$599/mo', pro: '$1,799/mo', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Universal model support — works with any ML framework via model-agnostic SHAP implementation',
      'Local prediction explanations with natural language summaries for non-technical stakeholders',
      'Global feature interaction analysis and partial dependence visualization',
      'Counterfactual explanations showing what input changes would alter model decisions',
      'Regulatory report generator for EU AI Act, SR 11-7, and FDA AI/ML guidance compliance',
      'REST API and Python SDK for integration into existing ML pipelines and applications'
    ],
    benefits: [
      'Meet regulatory requirements for AI explainability in healthcare, finance, and government',
      'Increase model adoption by 40% when stakeholders understand and trust predictions',
      'Identify hidden bias in training data through feature attribution analysis',
      'Reduce model audit preparation time from months to days with automated compliance reports',
      'Enable A/B testing of model explanations to optimize stakeholder communication'
    ]
  }
];
