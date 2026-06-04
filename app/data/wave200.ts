import { Service } from './serviceTypes';

// Wave 200 — Milestone: Next-Gen Platforms & Tools (10 services)
export const wave200AiServices: Service[] = [
  {
    id: "ai-clinical-trial-optimizer",
    title: "AI Clinical Trial Optimizer",
    description: "AI-powered clinical trial management platform that optimizes patient recruitment, site selection, and protocol design. Predicts enrollment timelines, identifies at-risk sites, and recommends adaptive trial designs to accelerate drug development.",
    category: "ai",
    icon: "🧬",
    href: "/services/ai-clinical-trial-optimizer",
    industry: "Healthcare & Pharma",
    stage: "published",
    popular: true,
    pricing: { basic: '$499/mo', pro: '$1199/mo', enterprise: '$2499/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Patient recruitment matching using EHR data analysis",
      "Site performance scoring with predictive enrollment models",
      "Protocol optimization with simulation engine",
      "Risk-based monitoring with automated alerts",
      "Regulatory compliance tracking across jurisdictions",
      "Real-time dashboard with KPI tracking and forecasting"
    ],
    benefits: [
      "Reduce trial timelines by up to 30%",
      "Improve recruitment rates with AI-matched patients",
      "Minimize protocol amendments with pre-trial simulation",
      "Ensure compliance across global regulatory requirements"
    ]
  },
  {
    id: "ai-predictive-maintenance",
    title: "AI Predictive Maintenance Platform",
    description: "Industrial IoT predictive maintenance platform that analyzes sensor data, equipment telemetry, and maintenance logs to predict failures before they occur. Reduces unplanned downtime and optimizes spare parts inventory.",
    category: "ai",
    icon: "🔧",
    href: "/services/ai-predictive-maintenance",
    industry: "Manufacturing & Industrial",
    stage: "published",
    popular: true,
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1499/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time sensor data ingestion and anomaly detection",
      "Failure prediction with remaining useful life estimates",
      "Maintenance scheduling optimization with crew management",
      "Spare parts demand forecasting",
      "Root cause analysis with equipment genealogy",
      "Integration with SAP, Maximo, and other CMMS platforms"
    ],
    benefits: [
      "Reduce unplanned downtime by up to 50%",
      "Extend equipment life with condition-based maintenance",
      "Optimize spare parts inventory carrying costs",
      "Shift from reactive to proactive maintenance culture"
    ]
  },
  {
    id: "ai-legal-research",
    title: "AI Legal Research Assistant",
    description: "AI-powered legal research platform that analyzes case law, statutes, regulations, and legal documents. Provides precedent analysis, contract review, and automated brief drafting with citation verification.",
    category: "ai",
    icon: "⚖️",
    href: "/services/ai-legal-research",
    industry: "Legal Tech",
    stage: "published",
    popular: false,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Natural language search across case law and statutes",
      "Precedent analysis with relevance scoring",
      "Automated contract clause extraction and risk flagging",
      "Brief and memo drafting with citation auto-complete",
      "Regulatory change monitoring with impact assessment",
      "Collaborative workspace for legal team annotations"
    ],
    benefits: [
      "Cut legal research time by 70%",
      "Reduce missed precedents with comprehensive AI search",
      "Accelerate contract review with automated risk detection",
      "Stay current on regulatory changes affecting your cases"
    ]
  }
];

export const wave200DataServices: Service[] = [
  {
    id: "real-time-streaming-analytics",
    title: "Real-Time Streaming Analytics Engine",
    description: "High-performance streaming analytics platform that processes millions of events per second with sub-second latency. Supports complex event processing, windowed aggregations, and real-time anomaly detection on live data streams.",
    category: "data",
    icon: "⚡",
    href: "/services/real-time-streaming-analytics",
    industry: "Data Engineering",
    stage: "published",
    popular: true,
    pricing: { basic: '$349/mo', pro: '$799/mo', enterprise: '$1699/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Sub-second latency processing of 1M+ events/sec",
      "Complex event processing with pattern matching",
      "Sliding, tumbling, and session window aggregations",
      "Real-time anomaly detection with adaptive thresholds",
      "SQL-based stream processing with continuous queries",
      "Integration with Kafka, Kinesis, and Pulsar"
    ],
    benefits: [
      "Make decisions on live data with sub-second latency",
      "Detect anomalies in real-time before they impact operations",
      "Replace brittle batch pipelines with continuous processing",
      "Scale horizontally without re-architecture"
    ]
  },
  {
    id: "data-contract-manager",
    title: "Data Contract Governance Platform",
    description: "Data contract management platform that defines, enforces, and monitors data quality agreements between producers and consumers. Ensures schema consistency, freshness SLAs, and semantic correctness across organizational boundaries.",
    category: "data",
    icon: "📋",
    href: "/services/data-contract-manager",
    industry: "Enterprise Data",
    stage: "published",
    popular: false,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Schema contract definition with versioning",
      "Automated freshness and completeness monitoring",
      "Breakage detection with automatic consumer notification",
      "Semantic validation with custom business rules",
      "Contract evolution with backward compatibility checks",
      "Data producer/consumer SLA dashboard"
    ],
    benefits: [
      "Eliminate silent data breakages across teams",
      "Enforce data quality standards contractually",
      "Reduce time spent debugging data pipeline issues",
      "Build trust between data producers and consumers"
    ]
  }
];

export const wave200CloudServices: Service[] = [
  {
    id: "kubernetes-cost-optimizer",
    title: "Kubernetes Cost Optimizer",
    description: "Kubernetes-specific cost management platform that analyzes cluster resource utilization, right-sizes workloads, identifies idle resources, and automates spot instance diversification. Reduces K8s cloud spend by 30-60%.",
    category: "cloud",
    icon: "☸️",
    href: "/services/kubernetes-cost-optimizer",
    industry: "Cloud Operations",
    stage: "published",
    popular: true,
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Per-namespace, per-deployment cost attribution",
      "Right-sizing recommendations with actual usage analysis",
      "Spot instance diversification with fallback strategies",
      "Idle resource detection and auto-reclamation",
      "Savings plan and reserved capacity optimization",
      "Cost anomaly detection with alerting"
    ],
    benefits: [
      "Reduce Kubernetes cloud spend by 30-60%",
      "Eliminate resource waste from over-provisioned pods",
      "Automate spot instance usage for fault-tolerant workloads",
      "Attribute costs accurately to teams and projects"
    ]
  }
];

export const wave200SecurityServices: Service[] = [
  {
    id: "api-threat-protection",
    title: "API Threat Protection Platform",
    description: "Dedicated API security platform that discovers shadow APIs, detects abuse patterns, enforces rate limits, and protects against OWASP API Top 10 threats. Provides real-time threat intelligence and automated response.",
    category: "security",
    icon: "🛡️",
    href: "/services/api-threat-protection",
    industry: "Application Security",
    stage: "published",
    popular: true,
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automatic API discovery including shadow and zombie APIs",
      "Behavioral analysis for abuse and anomaly detection",
      "OWASP API Top 10 threat protection",
      "Token abuse detection and credential stuffing prevention",
      "Real-time threat intelligence feed integration",
      "Automated response with customizable playbooks"
    ],
    benefits: [
      "Discover and secure unknown APIs before attackers do",
      "Stop API abuse without impacting legitimate traffic",
      "Meet API security compliance requirements",
      "Reduce mean time to detect and respond to API threats"
    ]
  },
  {
    id: "zero-trust-network-access",
    title: "Zero Trust Network Access (ZTNA)",
    description: "Enterprise zero trust network access platform that replaces VPN with identity-aware, least-privilege access to internal applications. Continuous verification, device posture assessment, and micro-segmentation included.",
    category: "security",
    icon: "🔐",
    href: "/services/zero-trust-network-access",
    industry: "Network Security",
    stage: "published",
    popular: false,
    pricing: { basic: '$249/mo', pro: '$549/mo', enterprise: '$1199/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Identity-aware access with SSO and MFA integration",
      "Device posture assessment before granting access",
      "Micro-segmentation with per-application policies",
      "Continuous session verification and risk scoring",
      "No inbound firewall rules required (dark network)",
      "Full audit trail with session recording"
    ],
    benefits: [
      "Eliminate VPN vulnerabilities and performance bottlenecks",
      "Enforce least-privilege access to every application",
      "Reduce attack surface with dark network architecture",
      "Maintain compliance with continuous verification logs"
    ]
  }
];

export const wave200AutomationServices: Service[] = [
  {
    id: "low-code-workflow-builder",
    title: "Low-Code Workflow Builder",
    description: "Visual workflow automation platform that enables business users to build complex approval flows, data transformations, and system integrations without code. Includes 200+ pre-built connectors and templates.",
    category: "automation",
    icon: "🔀",
    href: "/services/low-code-workflow-builder",
    industry: "Business Process",
    stage: "published",
    popular: true,
    pricing: { basic: '$99/mo', pro: '$249/mo', enterprise: '$549/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Drag-and-drop workflow designer with branching logic",
      "200+ pre-built connectors (Salesforce, SAP, Slack, etc.)",
      "Data transformation with visual mapping tools",
      "Approval chains with escalation and delegation",
      "Error handling with retry and compensation logic",
      "Version control with rollback and audit trail"
    ],
    benefits: [
      "Build workflows 10x faster than custom development",
      "Empower business users to automate without IT backlog",
      "Connect disparate systems without writing integration code",
      "Iterate quickly with visual debugging and testing"
    ]
  }
];

export const wave200ItServices: Service[] = [
  {
    id: "endpoint-detection-response",
    title: "Endpoint Detection & Response (EDR)",
    description: "Next-generation endpoint security platform that provides real-time threat detection, automated response, and forensic investigation capabilities. Uses behavioral AI to detect fileless attacks, ransomware, and advanced persistent threats.",
    category: "it",
    icon: "🖥️",
    href: "/services/endpoint-detection-response",
    industry: "IT Security",
    stage: "published",
    popular: true,
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Behavioral AI detection for fileless and zero-day attacks",
      "Automated isolation and remediation of compromised endpoints",
      "Full forensic timeline with process tree reconstruction",
      "Ransomware rollback with encrypted file recovery",
      "Threat hunting with MITRE ATT&CK mapping",
      "Centralized management console with role-based access"
    ],
    benefits: [
      "Detect and stop attacks that bypass traditional antivirus",
      "Reduce incident response time from hours to seconds",
      "Investigate threats with complete forensic visibility",
      "Recover from ransomware without paying ransoms"
    ]
  }
];

export const wave200MicroSaasServices: Service[] = [
  {
    id: "churn-prevention-saas",
    title: "Churn Prediction & Prevention Platform",
    description: "SaaS-specific churn prediction platform that analyzes usage patterns, support tickets, billing history, and NPS scores to identify at-risk customers before they cancel. Automated retention playbooks and health scoring.",
    category: "micro-saas",
    icon: "🎯",
    href: "/services/churn-prevention-saas",
    industry: "SaaS & Subscription",
    stage: "published",
    popular: true,
    pricing: { basic: '$79/mo', pro: '$199/mo', enterprise: '$449/mo' },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-signal churn scoring (usage, support, billing, NPS)",
      "Automated health score dashboards per customer",
      "Retention playbook automation with email and in-app triggers",
      "Revenue at risk forecasting with cohort analysis",
      "Integration with Stripe, Chargebee, and major billing platforms",
      "CS team workflow with prioritized intervention queue"
    ],
    benefits: [
      "Reduce churn by 20-40% with early intervention",
      "Prioritize CS efforts on highest-risk accounts",
      "Increase net revenue retention with proactive retention",
      "Forecast churn accurately for board and investor reporting"
    ]
  }
];

export const wave200HealthcareItServices: Service[] = [];
