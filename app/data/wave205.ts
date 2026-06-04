import { Service } from './serviceTypes';

// Wave 205 — Emerging Tech & Specialized Solutions (10 services)
export const wave205AiServices: Service[] = [
  {
    id: "ai-speech-analytics",
    title: "AI Speech & Voice Analytics Platform",
    description: "Enterprise speech analytics platform that transcribes and analyzes customer calls, meetings, and support interactions. Real-time sentiment analysis, keyword spotting, compliance monitoring, and agent coaching insights.",
    category: "ai",
    icon: "🎙️",
    href: "/services/ai-speech-analytics",
    industry: "Contact Center",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time transcription with speaker identification",
      "Sentiment analysis with emotion detection",
      "Keyword and phrase spotting with custom dictionaries",
      "Compliance monitoring for regulated industries",
      "Agent scoring with coaching recommendations",
      "Integration with major CCaaS platforms (Genesys, Five9, Twilio)"
    ],
    benefits: [
      "Improve customer satisfaction with real-time sentiment monitoring",
      "Ensure compliance with automated policy violation detection",
      "Coach agents with data-driven performance insights",
      "Reduce average handle time with conversation intelligence"
    ]
  },
  {
    id: "ai-inventory-optimizer",
    title: "AI Inventory Optimization Engine",
    description: "AI-powered inventory management platform that forecasts demand, optimizes reorder points, and balances stock across warehouses. Reduces carrying costs while preventing stockouts with probabilistic demand modeling.",
    category: "ai",
    icon: "📦",
    href: "/services/ai-inventory-optimizer",
    industry: "Retail & Supply Chain",
    stage: "published",
    popular: true,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Probabilistic demand forecasting with confidence intervals",
      "Multi-echelon inventory optimization across warehouses",
      "Automatic reorder point and safety stock calculation",
      "Seasonal and promotional demand modeling",
      "Supplier lead time variability analysis",
      "Integration with ERP systems (SAP, Oracle, NetSuite)"
    ],
    benefits: [
      "Reduce inventory carrying costs by 20-35%",
      "Prevent stockouts with accurate demand forecasting",
      "Optimize warehouse space with intelligent stock placement",
      "Improve cash flow with right-sized inventory levels"
    ]
  }
];

export const wave205DataServices: Service[] = [
  {
    id: "data-observability-suite",
    title: "Data Observability & Reliability Suite",
    description: "End-to-end data observability platform that monitors data pipelines for freshness, volume, schema, and quality issues. Automatic anomaly detection, root cause analysis, and incident management for data teams.",
    category: "data",
    icon: "👁️",
    href: "/services/data-observability-suite",
    industry: "Data Engineering",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated data freshness monitoring with SLA tracking",
      "Volume anomaly detection with statistical baselines",
      "Schema change detection with downstream impact analysis",
      "Data quality rule engine with 100+ built-in checks",
      "Incident management with automatic root cause analysis",
      "Data pipeline dependency mapping with blast radius"
    ],
    benefits: [
      "Detect data issues before they impact downstream consumers",
      "Reduce time spent debugging data pipeline failures",
      "Establish data reliability SLAs with automated monitoring",
      "Understand data lineage and impact of schema changes"
    ]
  }
];

export const wave205CloudServices: Service[] = [
  {
    id: "edge-computing-platform",
    title: "Edge Computing Management Platform",
    description: "Distributed edge computing platform that deploys, manages, and monitors workloads across edge locations. Container orchestration at the edge with centralized management, OTA updates, and offline resilience.",
    category: "cloud",
    icon: "📡",
    href: "/services/edge-computing-platform",
    industry: "Edge Computing",
    stage: "published",
    popular: false,
    pricing: { basic: "$299/mo", pro: "$699/mo", enterprise: "$1499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Container orchestration at the edge with K3s/KubeEdge",
      "Centralized management console for thousands of edge nodes",
      "Over-the-air updates with rollback capability",
      "Offline resilience with local data processing and sync",
      "Edge AI model deployment with hardware acceleration",
      "Bandwidth optimization with intelligent data filtering"
    ],
    benefits: [
      "Process data locally for sub-10ms latency requirements",
      "Reduce bandwidth costs with edge data filtering",
      "Maintain operations during network outages",
      "Deploy AI models at the edge for real-time inference"
    ]
  }
];

export const wave205SecurityServices: Service[] = [
  {
    id: "penetration-testing-platform",
    title: "Automated Penetration Testing Platform",
    description: "Continuous automated penetration testing platform that simulates real-world attacks on web applications, APIs, and networks. AI-driven vulnerability discovery with prioritized remediation guidance.",
    category: "security",
    icon: "🎯",
    href: "/services/penetration-testing-platform",
    industry: "Application Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$299/mo", pro: "$699/mo", enterprise: "$1499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated web application and API scanning",
      "AI-driven attack simulation with exploit chaining",
      "Network vulnerability assessment with service discovery",
      "Prioritized remediation with CVSS and business context",
      "Continuous testing with scheduled and on-demand scans",
      "Compliance reporting for PCI-DSS, SOC2, and ISO 27001"
    ],
    benefits: [
      "Find vulnerabilities before attackers do",
      "Reduce pen testing costs by 80% with automation",
      "Maintain continuous security posture with scheduled scans",
      "Meet compliance requirements with automated reporting"
    ]
  }
];

export const wave205AutomationServices: Service[] = [
  {
    id: "workflow-document-automation",
    title: "Document Workflow Automation Platform",
    description: "End-to-end document workflow automation that handles creation, review, approval, signing, and archival. Template library, conditional routing, e-signature integration, and compliance audit trails.",
    category: "automation",
    icon: "📄",
    href: "/services/workflow-document-automation",
    industry: "Business Process",
    stage: "published",
    popular: false,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Drag-and-drop workflow designer with conditional routing",
      "Document template library with dynamic field population",
      "E-signature integration (DocuSign, Adobe Sign, HelloSign)",
      "Approval chains with delegation and escalation",
      "Version control with full audit trail",
      "Automated archival with retention policy enforcement"
    ],
    benefits: [
      "Reduce document processing time by 80%",
      "Eliminate paper-based workflows entirely",
      "Ensure compliance with complete audit trails",
      "Accelerate contract cycles with automated routing"
    ]
  }
];

export const wave205ItServices: Service[] = [
  {
    id: "unified-communications-platform",
    title: "Unified Communications as a Service (UCaaS)",
    description: "Cloud-native unified communications platform combining voice, video, messaging, and collaboration. PBX replacement with global PSTN connectivity, team chat, and video conferencing in one platform.",
    category: "it",
    icon: "📞",
    href: "/services/unified-communications-platform",
    industry: "Telecommunications",
    stage: "published",
    popular: true,
    pricing: { basic: "$49/mo", pro: "$129/mo", enterprise: "$299/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Cloud PBX with global PSTN connectivity and local numbers",
      "HD video conferencing with screen sharing and recording",
      "Team messaging with channels, threads, and file sharing",
      "Contact center integration with queue management",
      "Mobile and desktop apps with seamless handoff",
      "Call analytics with quality monitoring and reporting"
    ],
    benefits: [
      "Replace legacy PBX with modern cloud communications",
      "Reduce telecom costs by 40-60% with cloud delivery",
      "Enable remote work with full-featured mobile apps",
      "Consolidate vendors with one platform for all communications"
    ]
  }
];

export const wave205MicroSaasServices: Service[] = [
  {
    id: "social-media-scheduler",
    title: "Social Media Management & Scheduler",
    description: "Multi-platform social media management tool with AI-powered content suggestions, optimal posting time analysis, and unified inbox for comments and messages. Analytics with competitor benchmarking.",
    category: "micro-saas",
    icon: "📱",
    href: "/services/social-media-scheduler",
    industry: "Marketing & Social Media",
    stage: "published",
    popular: true,
    pricing: { basic: "$29/mo", pro: "$79/mo", enterprise: "$199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-platform scheduling (Instagram, Twitter, LinkedIn, Facebook, TikTok)",
      "AI content suggestions based on trending topics and brand voice",
      "Optimal posting time analysis per platform and audience",
      "Unified inbox for comments, DMs, and mentions",
      "Competitor benchmarking with share-of-voice analysis",
      "Team collaboration with approval workflows and content calendar"
    ],
    benefits: [
      "Save 10+ hours per week with batch scheduling",
      "Increase engagement with AI-optimized posting times",
      "Never miss a comment or DM with unified inbox",
      "Outperform competitors with data-driven content strategy"
    ]
  }
];

export const wave205HealthcareItServices: Service[] = [];
