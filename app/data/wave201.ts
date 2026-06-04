import { Service } from './serviceTypes';

// Wave 201 — Specialty Platforms & Emerging Tech (10 services)
export const wave201AiServices: Service[] = [
  {
    id: "ai-cybersecurity-analyst",
    title: "AI Cybersecurity Analyst",
    description: "Autonomous AI security analyst that continuously monitors networks, endpoints, and cloud workloads for threats. Mimics human SOC analyst decision-making with automated triage, investigation, and response — operating 24/7 without fatigue.",
    category: "ai",
    icon: "🔒",
    href: "/services/ai-cybersecurity-analyst",
    industry: "Cybersecurity & AI",
    stage: "published",
    popular: true,
    pricing: { basic: '$449/mo', pro: '$999/mo', enterprise: '$2199/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Continuous network traffic analysis with behavioral baselines",
      "Automated alert triage with false positive suppression",
      "Threat investigation with evidence chain reconstruction",
      "Automated containment actions (isolate, block, quarantine)",
      "MITRE ATT&CK technique mapping for every incident",
      "Natural language incident summaries for management reporting"
    ],
    benefits: [
      "Reduce SOC analyst workload by 80% with automated triage",
      "Detect threats that rule-based SIEM misses",
      "Respond to incidents in minutes instead of hours",
      "Scale security operations without hiring more analysts"
    ]
  },
  {
    id: "ai-revenue-operations",
    title: "AI Revenue Operations Platform",
    description: "AI-powered RevOps platform that unifies sales, marketing, and customer success data. Provides pipeline forecasting, lead scoring, deal health analysis, and automated playbook recommendations to maximize revenue per rep.",
    category: "ai",
    icon: "📈",
    href: "/services/ai-revenue-operations",
    industry: "Sales & Marketing",
    stage: "published",
    popular: true,
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1499/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Unified revenue data model across CRM, marketing, and billing",
      "AI pipeline forecast with deal-by-deal confidence scoring",
      "Lead-to-account matching with intent data enrichment",
      "Deal health scoring with risk factor identification",
      "Automated next-best-action recommendations per deal",
      "Revenue attribution modeling across touchpoints"
    ],
    benefits: [
      "Improve forecast accuracy by 40% with ML predictions",
      "Increase win rates with data-driven deal coaching",
      "Eliminate data silos between sales, marketing, and CS",
      "Identify at-risk revenue before it's lost"
    ]
  }
];

export const wave201DataServices: Service[] = [
  {
    id: "feature-store-platform",
    title: "ML Feature Store Platform",
    description: "Enterprise feature store that manages the complete ML feature lifecycle — creation, storage, versioning, serving, and monitoring. Ensures training-serving skew elimination and feature reuse across teams.",
    category: "data",
    icon: "🧪",
    href: "/services/feature-store-platform",
    industry: "Machine Learning",
    stage: "published",
    popular: false,
    pricing: { basic: '$349/mo', pro: '$799/mo', enterprise: '$1699/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Centralized feature registry with versioning and lineage",
      "Online and offline feature serving with sub-ms latency",
      "Training-serving skew detection and alerting",
      "Feature sharing with access control across teams",
      "Point-in-time correct feature joins for backtesting",
      "Feature freshness monitoring with SLA dashboards"
    ],
    benefits: [
      "Eliminate training-serving skew that degrades model accuracy",
      "Accelerate model development with reusable features",
      "Ensure regulatory compliance with full feature lineage",
      "Scale feature engineering across teams without duplication"
    ]
  },
  {
    id: "data-synthetic-generator",
    title: "Synthetic Data Generation Platform",
    description: "Privacy-preserving synthetic data platform that creates statistically representative artificial datasets from real data. Enables safe data sharing, testing, and ML training without exposing sensitive information.",
    category: "data",
    icon: "🔬",
    href: "/services/data-synthetic-generator",
    industry: "Data Privacy",
    stage: "published",
    popular: false,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Statistical distribution matching with fidelity scoring",
      "Referential integrity preservation across related tables",
      "Differential privacy guarantees with epsilon tuning",
      "Synthetic data quality assessment with utility metrics",
      "Support for tabular, time-series, and text data types",
      "API-based generation for CI/CD testing pipelines"
    ],
    benefits: [
      "Enable data sharing without privacy violations",
      "Accelerate development with realistic test data",
      "Comply with GDPR, HIPAA, and CCPA requirements",
      "Augment rare classes in ML training datasets"
    ]
  }
];

export const wave201CloudServices: Service[] = [
  {
    id: "cloud-migration-assessment",
    title: "Cloud Migration Assessment Tool",
    description: "Automated cloud migration planning platform that inventories on-premises workloads, analyzes dependencies, estimates migration effort, and generates optimized migration waves. Supports AWS, Azure, and GCP target architectures.",
    category: "cloud",
    icon: "🚀",
    href: "/services/cloud-migration-assessment",
    industry: "Cloud Operations",
    stage: "published",
    popular: true,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated agentless discovery of servers, apps, and dependencies",
      "Dependency mapping with network flow analysis",
      "Migration strategy recommendation (rehost, replatform, refactor)",
      "TCO comparison: on-prem vs cloud per workload",
      "Migration wave planning with risk and effort scoring",
      "Target architecture generation for AWS, Azure, or GCP"
    ],
    benefits: [
      "Eliminate guesswork from migration planning",
      "Reduce migration risk with dependency-aware wave planning",
      "Optimize cloud costs before you migrate",
      "Accelerate migration timelines with automated assessment"
    ]
  }
];

export const wave201SecurityServices: Service[] = [
  {
    id: "identity-governance-platform",
    title: "Identity Governance & Administration",
    description: "Comprehensive identity governance platform that manages the complete identity lifecycle — joiner, mover, leaver processes, access certifications, role management, and compliance reporting. Ensures least-privilege access at scale.",
    category: "security",
    icon: "👤",
    href: "/services/identity-governance-platform",
    industry: "Identity & Access",
    stage: "published",
    popular: false,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated joiner-mover-leaver provisioning workflows",
      "Access certification campaigns with manager attestation",
      "Role mining and role-based access control optimization",
      "Segregation of duties (SoD) violation detection",
      "Privileged access management with session recording",
      "Compliance reporting for SOX, HIPAA, PCI-DSS"
    ],
    benefits: [
      "Reduce access-related security incidents by 80%",
      "Automate compliance audits with continuous certification",
      "Eliminate orphaned accounts and excessive privileges",
      "Scale identity governance without adding headcount"
    ]
  }
];

export const wave201AutomationServices: Service[] = [
  {
    id: "infrastructure-as-code-scanner",
    title: "Infrastructure-as-Code Security Scanner",
    description: "DevSecOps platform that scans Terraform, CloudFormation, Kubernetes manifests, and Ansible playbooks for security misconfigurations, compliance violations, and cost issues before deployment.",
    category: "automation",
    icon: "🏗️",
    href: "/services/infrastructure-as-code-scanner",
    industry: "DevSecOps",
    stage: "published",
    popular: true,
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-framework support: Terraform, CloudFormation, K8s, Ansible",
      "500+ built-in security and compliance policies",
      "Custom policy creation with Rego/OPA",
      "CI/CD integration with GitHub Actions, GitLab CI, Jenkins",
      "Drift detection between code and deployed state",
      "Auto-remediation suggestions with one-click fixes"
    ],
    benefits: [
      "Catch misconfigurations before they reach production",
      "Enforce security standards across all IaC repositories",
      "Reduce cloud security incidents from IaC errors",
      "Meet compliance requirements with continuous scanning"
    ]
  },
  {
    id: "test-data-management",
    title: "Test Data Management Platform",
    description: "Enterprise test data management platform that creates, masks, and provisions realistic test datasets. Ensures data privacy compliance in non-production environments while maintaining referential integrity and data realism.",
    category: "automation",
    icon: "🧪",
    href: "/services/test-data-management",
    industry: "Software Testing",
    stage: "published",
    popular: false,
    pricing: { basic: '$129/mo', pro: '$299/mo', enterprise: '$649/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Subset extraction with referential integrity preservation",
      "Data masking with format-preserving encryption",
      "Synthetic test data generation for edge cases",
      "Self-service test data provisioning for QA teams",
      "Data refresh automation with change detection",
      "Compliance validation (no PII in non-production)"
    ],
    benefits: [
      "Eliminate production data exposure in test environments",
      "Reduce test data provisioning time from days to minutes",
      "Ensure consistent test data across teams and environments",
      "Comply with data privacy regulations in all environments"
    ]
  }
];

export const wave201ItServices: Service[] = [
  {
    id: "digital-experience-monitoring",
    title: "Digital Experience Monitoring (DEM)",
    description: "End-user experience monitoring platform that tracks application performance from the user's perspective. Synthetic monitoring, real user monitoring (RUM), and session replay combined with AI-powered root cause analysis.",
    category: "it",
    icon: "👁️",
    href: "/services/digital-experience-monitoring",
    industry: "IT Operations",
    stage: "published",
    popular: true,
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Synthetic transaction monitoring from global vantage points",
      "Real user monitoring with Core Web Vitals tracking",
      "Session replay with privacy-compliant masking",
      "AI-powered anomaly detection and root cause analysis",
      "Mobile app performance monitoring (iOS and Android)",
      "Business impact correlation (revenue vs performance)"
    ],
    benefits: [
      "Detect performance issues before users complain",
      "Correlate performance degradation with revenue impact",
      "Reduce MTTR with AI-powered root cause analysis",
      "Optimize user experience with data-driven decisions"
    ]
  }
];

export const wave201MicroSaasServices: Service[] = [
  {
    id: "white-label-analytics",
    title: "White-Label Analytics Dashboard",
    description: "Embeddable white-label analytics platform that SaaS companies can rebrand and offer to their own customers. Includes customizable dashboards, report builder, data connectors, and multi-tenant architecture out of the box.",
    category: "micro-saas",
    icon: "📊",
    href: "/services/white-label-analytics",
    industry: "SaaS & Analytics",
    stage: "published",
    popular: false,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-tenant architecture with per-tenant customization",
      "Drag-and-drop dashboard builder with 40+ widget types",
      "White-label branding (logo, colors, domain, email)",
      "Embedded analytics with iframe and JavaScript SDK",
      "Data connector library (SQL, REST, GraphQL, CSV)",
      "Role-based access control per tenant and per user"
    ],
    benefits: [
      "Add analytics to your SaaS product without building from scratch",
      "Generate recurring revenue from analytics as a feature",
      "Reduce time-to-market from months to days",
      "Maintain brand consistency with full white-labeling"
    ]
  }
];

export const wave201HealthcareItServices: Service[] = [];
