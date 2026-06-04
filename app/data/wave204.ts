import { Service } from './serviceTypes';

// Wave 204 — Specialized AI & Business Tools (10 services)
export const wave204AiServices: Service[] = [
  {
    id: "ai-meeting-summarizer",
    title: "AI Meeting Summarizer & Action Tracker",
    description: "AI-powered meeting assistant that transcribes, summarizes, and extracts action items from meetings in real-time. Integrates with Zoom, Teams, and Google Meet. Generates shareable summaries with speaker attribution and decision tracking.",
    category: "ai",
    icon: "📝",
    href: "/services/ai-meeting-summarizer",
    industry: "Productivity",
    stage: "published",
    popular: true,
    pricing: { basic: "$49/mo", pro: "$129/mo", enterprise: "$299/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time transcription with speaker diarization",
      "AI-generated summaries with key decisions and action items",
      "Integration with Zoom, Microsoft Teams, and Google Meet",
      "Searchable meeting archive with topic filtering",
      "Action item tracking with assignee and due date extraction",
      "Meeting analytics (talk time, participation, sentiment)"
    ],
    benefits: [
      "Eliminate note-taking and meeting recaps",
      "Ensure nothing falls through the cracks with tracked action items",
      "Make meetings searchable as institutional knowledge",
      "Reduce follow-up meetings with clear decision documentation"
    ]
  },
  {
    id: "ai-code-security-reviewer",
    title: "AI Code Security Reviewer",
    description: "Static application security testing (SAST) platform powered by large language models. Detects vulnerabilities, insecure patterns, and compliance issues in source code across 30+ languages with fix suggestions.",
    category: "ai",
    icon: "🔐",
    href: "/services/ai-code-security-reviewer",
    industry: "DevSecOps",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Deep code analysis across 30+ programming languages",
      "OWASP Top 10 and CWE vulnerability detection",
      "Context-aware fix suggestions with code patches",
      "Pull request scanning with inline comments",
      "Compliance checking (SOC2, HIPAA, PCI-DSS code requirements)",
      "False positive suppression with team feedback learning"
    ],
    benefits: [
      "Catch security vulnerabilities before code reaches production",
      "Reduce security review time by 70% with AI-powered analysis",
      "Train developers on secure coding with contextual fix suggestions",
      "Meet compliance requirements with automated code scanning"
    ]
  },
  {
    id: "ai-customer-churn-analyzer",
    title: "AI Customer Churn Analyzer",
    description: "Predictive churn analysis platform that combines product usage, billing, support, and engagement data to identify customers at risk of leaving. Prescribes specific retention actions per customer segment.",
    category: "ai",
    icon: "📉",
    href: "/services/ai-customer-churn-analyzer",
    industry: "Customer Success",
    stage: "published",
    popular: false,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-signal churn prediction (usage, billing, support, NPS)",
      "Customer health scoring with trend analysis",
      "Prescribed retention actions per risk segment",
      "Early warning alerts 30-60 days before likely churn",
      "Retention campaign automation with email and in-app triggers",
      "Revenue at risk forecasting with cohort comparison"
    ],
    benefits: [
      "Reduce churn by 25-45% with early intervention",
      "Prioritize CS efforts on highest-impact accounts",
      "Increase net revenue retention with proactive retention",
      "Understand root causes of churn with explainable AI"
    ]
  }
];

export const wave204DataServices: Service[] = [
  {
    id: "change-data-capture",
    title: "Change Data Capture (CDC) Platform",
    description: "Real-time change data capture platform that streams database changes to data warehouses, lakes, and applications with sub-second latency. Supports all major databases with exactly-once delivery guarantees.",
    category: "data",
    icon: "🔄",
    href: "/services/change-data-capture",
    industry: "Data Engineering",
    stage: "published",
    popular: false,
    pricing: { basic: "$249/mo", pro: "$549/mo", enterprise: "$1199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Log-based CDC for PostgreSQL, MySQL, SQL Server, Oracle, MongoDB",
      "Schema evolution handling with backward compatibility",
      "Exactly-once delivery with checkpoint management",
      "Automatic table snapshotting for new subscriptions",
      "Integration with Snowflake, BigQuery, Redshift, Databricks",
      "Schema registry with Avro/Protobuf support"
    ],
    benefits: [
      "Replace batch ETL with real-time streaming data",
      "Reduce database load vs query-based extraction",
      "Keep data warehouse in sync with source systems",
      "Enable real-time analytics without impacting production databases"
    ]
  }
];

export const wave204CloudServices: Service[] = [
  {
    id: "container-registry-scanner",
    title: "Container Registry & Image Scanner",
    description: "Secure container registry with built-in vulnerability scanning, image signing, and policy enforcement. Blocks deployment of vulnerable or unsigned images with SBOM generation and compliance reporting.",
    category: "cloud",
    icon: "📦",
    href: "/services/container-registry-scanner",
    industry: "Cloud Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Private container registry with geo-replication",
      "CVE scanning on push with severity-based blocking",
      "Cosign/Notary image signing and verification",
      "SBOM generation in SPDX and CycloneDX formats",
      "Policy engine for base image and dependency rules",
      "Retention policies with automated garbage collection"
    ],
    benefits: [
      "Prevent vulnerable images from reaching production",
      "Meet supply chain security requirements with signed images",
      "Generate SBOMs automatically for compliance audits",
      "Reduce image pull times with regional replication"
    ]
  }
];

export const wave204SecurityServices: Service[] = [
  {
    id: "email-security-gateway",
    title: "AI Email Security Gateway",
    description: "AI-powered email security gateway that phishing, BEC attacks, and zero-day malware with 99.9% detection rate. Goes beyond traditional SEGs with natural language understanding for social engineering detection.",
    category: "security",
    icon: "📧",
    href: "/services/email-security-gateway",
    industry: "Email Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI phishing detection with URL sandboxing and time-of-click analysis",
      "Business Email Compromise (BEC) detection using sender behavior analysis",
      "Zero-day malware detection with ML-based attachment analysis",
      "DMARC/DKIM/SPF enforcement and reporting",
      "Email encryption with TLS enforcement and DLP policies",
      "User reporting button with automated threat investigation"
    ],
    benefits: [
      "Stop 99.9% of phishing and BEC attacks",
      "Detect zero-day malware that signature-based tools miss",
      "Prevent wire fraud from compromised executive accounts",
      "Achieve DMARC compliance with automated enforcement"
    ]
  }
];

export const wave204AutomationServices: Service[] = [
  {
    id: "incident-management-platform",
    title: "Incident Management & Response Platform",
    description: "Full-cycle incident management platform that automates detection, triage, communication, and post-mortem. On-call scheduling, escalation policies, status page updates, and blameless post-mortem workflows.",
    category: "automation",
    icon: "🚨",
    href: "/services/incident-management-platform",
    industry: "IT Operations",
    stage: "published",
    popular: true,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated incident creation from monitoring alerts",
      "On-call scheduling with rotation and escalation policies",
      "Multi-channel notification (SMS, phone, Slack, push)",
      "Status page auto-update with subscriber notifications",
      "Incident timeline with automatic event correlation",
      "Blameless post-mortem templates with action item tracking"
    ],
    benefits: [
      "Reduce MTTR with automated triage and escalation",
      "Keep customers informed with automatic status updates",
      "Build institutional knowledge from every incident",
      "Improve on-call experience with fair scheduling"
    ]
  }
];

export const wave204ItServices: Service[] = [
  {
    id: "virtual-desktop-infrastructure",
    title: "Virtual Desktop Infrastructure (VDI)",
    description: "Cloud-hosted virtual desktop platform that delivers Windows and Linux desktops to any device. Centralized management, GPU acceleration for design workloads, and enterprise security with zero-trust access.",
    category: "it",
    icon: "🖥️",
    href: "/services/virtual-desktop-infrastructure",
    industry: "IT Infrastructure",
    stage: "published",
    popular: false,
    pricing: { basic: "$79/mo", pro: "$199/mo", enterprise: "$449/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Windows and Linux virtual desktops from any device",
      "GPU-accelerated instances for CAD, 3D, and video workloads",
      "Centralized image management with version control",
      "Zero-trust access with device posture verification",
      "Session recording for compliance and training",
      "Auto-scaling with per-user cost tracking"
    ],
    benefits: [
      "Enable secure remote work from any device",
      "Reduce endpoint management costs by 60%",
      "Meet data residency requirements with centralized storage",
      "Scale desktops up or down based on workforce needs"
    ]
  }
];

export const wave204MicroSaasServices: Service[] = [
  {
    id: "subscription-analytics",
    title: "Subscription Analytics & Billing Platform",
    description: "SaaS metrics and billing platform that tracks MRR, ARR, churn, LTV, and cohort analysis. Integrated billing with Stripe and Chargebee, dunning management, and revenue recognition automation.",
    category: "micro-saas",
    icon: "💳",
    href: "/services/subscription-analytics",
    industry: "SaaS & Finance",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "MRR/ARR tracking with expansion, contraction, and churn breakdown",
      "Cohort analysis with retention and revenue curves",
      "LTV prediction with payback period calculation",
      "Automated dunning with customizable retry logic",
      "Revenue recognition automation for ASC 606 compliance",
      "Investor-ready metrics dashboard with export"
    ],
    benefits: [
      "Understand true unit economics with accurate LTV:CAC",
      "Reduce involuntary churn with smart dunning",
      "Automate revenue recognition for audit compliance",
      "Report to investors with confidence using accurate metrics"
    ]
  }
];

export const wave204HealthcareItServices: Service[] = [];
