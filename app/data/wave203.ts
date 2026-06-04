import { Service } from './serviceTypes';

// Wave 203 — Enterprise Platforms & Developer Tools (10 services)
export const wave203AiServices: Service[] = [
  {
    id: "ai-supply-chain-risk",
    title: "AI Supply Chain Risk Monitor",
    description: "Real-time supply chain risk intelligence platform that monitors suppliers, geopolitical events, weather disruptions, and financial health signals. Predicts disruptions 30-90 days in advance and recommends mitigation strategies.",
    category: "ai",
    icon: "🔗",
    href: "/services/ai-supply-chain-risk",
    industry: "Supply Chain",
    stage: "published",
    popular: true,
    pricing: { basic: "$349/mo", pro: "$799/mo", enterprise: "$1699/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-tier supplier mapping with dependency visualization",
      "Geopolitical risk scoring with news and sanctions monitoring",
      "Financial health monitoring of critical suppliers",
      "Weather and natural disaster impact prediction on logistics",
      "Alternative supplier recommendation engine",
      "Disruption simulation with scenario planning"
    ],
    benefits: [
      "Predict supply chain disruptions 30-90 days in advance",
      "Reduce single-source dependency with alternative recommendations",
      "Minimize revenue impact from supplier failures",
      "Build resilient supply chains with data-driven diversification"
    ]
  },
  {
    id: "ai-content-moderation",
    title: "AI Content Moderation Engine",
    description: "Real-time content moderation platform that detects toxic content, spam, misinformation, and policy violations across text, images, and video. Customizable policy engine with human-in-the-loop review queues.",
    category: "ai",
    icon: "🛡️",
    href: "/services/ai-content-moderation",
    industry: "Social Media & Communities",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-modal moderation (text, image, video, audio)",
      "Customizable policy engine with regex and ML rules",
      "Real-time toxicity scoring with granular categories",
      "Human review queue with priority and escalation",
      "Appeal workflow with audit trail",
      "Community guidelines auto-updating from moderation patterns"
    ],
    benefits: [
      "Moderate content at scale without massive human teams",
      "Detect policy violations in 150+ languages",
      "Reduce moderator burnout with AI pre-screening",
      "Maintain brand safety with customizable policies"
    ]
  }
];

export const wave203DataServices: Service[] = [
  {
    id: "data-catalog-platform",
    title: "Enterprise Data Catalog & Discovery",
    description: "Automated data catalog that discovers, profiles, and documents all data assets across the organization. Business glossary, data lineage, quality scoring, and self-service data discovery with natural language search.",
    category: "data",
    icon: "📚",
    href: "/services/data-catalog-platform",
    industry: "Enterprise Data",
    stage: "published",
    popular: true,
    pricing: { basic: "$249/mo", pro: "$549/mo", enterprise: "$1199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated data asset discovery across databases, lakes, and warehouses",
      "Data profiling with statistical summaries and quality scores",
      "Business glossary with term definitions and ownership",
      "End-to-end data lineage with column-level granularity",
      "Natural language search across all data assets",
      "Access request workflow with approval chains"
    ],
    benefits: [
      "Eliminate data silos with a searchable enterprise catalog",
      "Accelerate analytics with self-service data discovery",
      "Meet compliance requirements with documented lineage",
      "Reduce data team overhead with automated profiling"
    ]
  },
  {
    id: "metrics-store-platform",
    title: "Metrics Store & Observability Platform",
    description: "Centralized metrics store that standardizes business and technical metrics across the organization. Single source of truth for KPIs, SLOs, and operational metrics with versioning and access control.",
    category: "data",
    icon: "📐",
    href: "/services/metrics-store-platform",
    industry: "Data Engineering",
    stage: "published",
    popular: false,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Centralized metric definitions with versioning",
      "SLO tracking with error budget burn rate alerts",
      "Business and technical metric unification",
      "Dashboard-as-code with Git integration",
      "Access control per metric and per consumer",
      "Anomaly detection on metric trends"
    ],
    benefits: [
      "Eliminate metric definition conflicts across teams",
      "Track SLOs with automated error budget management",
      "Create a single source of truth for all KPIs",
      "Version control metrics like code for reproducibility"
    ]
  }
];

export const wave203CloudServices: Service[] = [
  {
    id: "serverless-framework-platform",
    title: "Serverless Application Platform",
    description: "Complete serverless development platform with function-as-a-service, API gateway, event routing, and built-in observability. Deploy from Git with automatic scaling, zero cold starts, and pay-per-use pricing.",
    category: "cloud",
    icon: "⚡",
    href: "/services/serverless-framework-platform",
    industry: "Cloud Development",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Function-as-a-service with zero cold start technology",
      "Built-in API gateway with rate limiting and auth",
      "Event-driven architecture with message routing",
      "Automatic scaling from zero to millions of requests",
      "Built-in distributed tracing and logging",
      "Git-based deployment with preview environments"
    ],
    benefits: [
      "Eliminate infrastructure management overhead",
      "Pay only for actual usage with no idle costs",
      "Scale automatically without capacity planning",
      "Deploy faster with Git-based CI/CD pipelines"
    ]
  }
];

export const wave203SecurityServices: Service[] = [
  {
    id: "cloud-security-posture",
    title: "Cloud Security Posture Management (CSPM)",
    description: "Continuous cloud security posture assessment across AWS, Azure, and GCP. Detects misconfigurations, compliance violations, and drift from security baselines with automated remediation.",
    category: "security",
    icon: "☁️",
    href: "/services/cloud-security-posture",
    industry: "Cloud Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$249/mo", pro: "$549/mo", enterprise: "$1199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-cloud misconfiguration detection (500+ checks)",
      "Compliance benchmark mapping (CIS, NIST, PCI-DSS, SOC2)",
      "Drift detection from approved security baselines",
      "Auto-remediation with approval workflows",
      "Risk-prioritized findings with blast radius analysis",
      "Executive dashboards with trend and compliance scoring"
    ],
    benefits: [
      "Detect and fix misconfigurations before attackers exploit them",
      "Maintain continuous compliance across all cloud accounts",
      "Reduce cloud security risk with automated remediation",
      "Report security posture to executives with clear metrics"
    ]
  }
];

export const wave203AutomationServices: Service[] = [
  {
    id: "release-management-platform",
    title: "Release Management & Feature Flags",
    description: "Enterprise release management platform with feature flags, progressive delivery, and automated rollback. Decouple deployment from release, run A/B tests, and target specific user segments with zero-downtime releases.",
    category: "automation",
    icon: "🚀",
    href: "/services/release-management-platform",
    industry: "DevOps",
    stage: "published",
    popular: true,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Feature flags with targeting rules and gradual rollout",
      "Progressive delivery with canary and blue-green deployments",
      "Automated rollback on error rate or latency thresholds",
      "A/B testing with statistical significance tracking",
      "Release calendar with dependency and conflict detection",
      "Audit trail for all flag changes and releases"
    ],
    benefits: [
      "Decouple deployment from release to reduce risk",
      "Roll back in seconds without redeploying code",
      "Test features with real users before full rollout",
      "Coordinate releases across teams with visibility"
    ]
  }
];

export const wave203ItServices: Service[] = [
  {
    id: "service-desk-automation",
    title: "AI Service Desk & IT Support",
    description: "AI-powered IT service desk that automates ticket classification, routing, and resolution. Chatbot handles L1 requests automatically, escalates complex issues to human agents, and learns from resolved tickets.",
    category: "it",
    icon: "🎧",
    href: "/services/service-desk-automation",
    industry: "IT Operations",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI chatbot for L1 support with natural language understanding",
      "Automatic ticket classification and priority assignment",
      "Knowledge base auto-generation from resolved tickets",
      "SLA tracking with escalation and breach alerts",
      "Self-service portal with password reset and common fixes",
      "Integration with Slack, Teams, and email for ticket creation"
    ],
    benefits: [
      "Resolve 60% of tickets automatically without human agents",
      "Reduce average resolution time from hours to minutes",
      "Free IT staff from repetitive L1 requests",
      "Improve employee satisfaction with instant support"
    ]
  }
];

export const wave203MicroSaasServices: Service[] = [
  {
    id: "form-builder-pro",
    title: "Advanced Form Builder & Workflow",
    description: "No-code form builder with conditional logic, payment collection, file uploads, and workflow automation. Multi-step forms, calculated fields, and 50+ integrations for lead generation, surveys, and applications.",
    category: "micro-saas",
    icon: "📝",
    href: "/services/form-builder-pro",
    industry: "Business Tools",
    stage: "published",
    popular: false,
    pricing: { basic: "$29/mo", pro: "$79/mo", enterprise: "$199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Drag-and-drop form builder with 40+ field types",
      "Conditional logic with branching and calculated fields",
      "Payment collection with Stripe and PayPal integration",
      "Multi-step forms with progress indicators and save-resume",
      "Workflow automation with email, webhook, and CRM actions",
      "Analytics dashboard with conversion and drop-off tracking"
    ],
    benefits: [
      "Build complex forms without writing code",
      "Increase completion rates with multi-step UX",
      "Automate lead routing and follow-up workflows",
      "Collect payments alongside form submissions"
    ]
  }
];

export const wave203HealthcareItServices: Service[] = [];
