import { Service } from './servicesData';

// Wave 199 — Next Gen AI & IT Services (10 services)
export const wave199AiServices: Service[] = [
  {
    id: "ai-warehouse-robotics",
    title: "AI Warehouse Robotics Planner",
    description: "Intelligent warehouse automation planning platform that designs optimal robot fleet layouts, pick-path algorithms, and inventory placement strategies. Simulates throughput, identifies bottlenecks, and generates ROI projections for robotics investments.",
    category: "Ai",
    icon: "🤖",
    href: "/services/ai-warehouse-robotics",
    industry: "Logistics & Warehousing",
    stage: "published",
    popular: false,
    pricing: { basic: 149, pro: 349, enterprise: 799 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Robot fleet layout designer with drag-and-drop warehouse mapping",
      "Pick-path optimization using ant colony algorithms",
      "Inventory placement heatmaps based on velocity analysis",
      "Throughput simulation with bottleneck identification",
      "ROI calculator with TCO comparison vs manual operations",
      "Integration with major WMS platforms (SAP, Oracle, Manhattan)"
    ],
    benefits: [
      "Reduce picking time by up to 40% with optimized paths",
      "Increase warehouse throughput without expanding footprint",
      "Make data-driven robotics investment decisions",
      "Minimize robot idle time with intelligent task queuing"
    ]
  },
  {
    id: "ai-deepfake-detector",
    title: "AI Deepfake Detection Suite",
    description: "Enterprise-grade deepfake detection platform that analyzes images, video, and audio for synthetic media manipulation. Uses ensemble models trained on latest generation attacks with real-time API for content moderation workflows.",
    category: "Ai",
    icon: "🔍",
    href: "/services/ai-deepfake-detector",
    industry: "Security & Media",
    stage: "published",
    popular: false,
    pricing: { basic: 199, pro: 449, enterprise: 999 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Image forensics analysis (Error Level Analysis, metadata inspection)",
      "Video deepfake detection with frame-by-frame scoring",
      "Audio synthesis detection (voice cloning, speech generation)",
      "Confidence scores with explainable AI heatmaps",
      "REST API for real-time content moderation pipelines",
      "Batch processing for media library audits"
    ],
    benefits: [
      "Protect brand reputation from synthetic media fraud",
      "Comply with emerging deepfake disclosure regulations",
      "Integrate detection into existing moderation workflows",
      "Stay ahead of evolving generation techniques with monthly model updates"
    ]
  },
  {
    id: "ai-document-processor",
    title: "AI Document Understanding Engine",
    description: "Advanced document AI platform that extracts, classifies, and structures data from any document type — PDFs, scans, forms, contracts, invoices. Goes beyond OCR with contextual understanding, table extraction, and automated workflow triggers.",
    category: "Ai",
    icon: "📄",
    href: "/services/ai-document-processor",
    industry: "Enterprise Software",
    stage: "published",
    popular: true,
    pricing: { basic: 129, pro: 299, enterprise: 649 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-format ingestion (PDF, TIFF, JPEG, PNG, DOCX)",
      "Contextual entity extraction with custom field training",
      "Table and form structure preservation",
      "Document classification with 50+ pre-trained categories",
      "Automated workflow triggers based on extracted data",
      "Human-in-the-loop verification queue with confidence thresholds"
    ],
    benefits: [
      "Reduce manual data entry costs by up to 80%",
      "Process documents 10x faster than manual review",
      "Achieve 99%+ extraction accuracy on structured documents",
      "Scale document processing without adding headcount"
    ]
  }
];

export const wave199DataServices: Service[] = [
  {
    id: "data-mesh-platform",
    title: "Data Mesh Orchestration Platform",
    description: "Self-service data platform that implements data mesh principles — domain-oriented data ownership, data as a product, federated governance. Enables teams to publish, discover, and consume data products with automated quality SLAs.",
    category: "Data",
    icon: "🕸️",
    href: "/services/data-mesh-platform",
    industry: "Enterprise Data",
    stage: "published",
    popular: false,
    pricing: { basic: 299, pro: 699, enterprise: 1499 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Data product catalog with searchable metadata registry",
      "Domain-based access control and ownership management",
      "Automated data quality checks with configurable SLAs",
      "Lineage tracking across domain boundaries",
      "Self-service data provisioning with approval workflows",
      "Usage analytics and cost allocation per domain"
    ],
    benefits: [
      "Eliminate centralized data team bottlenecks",
      "Empower domain teams to own their data products",
      "Maintain governance without sacrificing agility",
      "Discover trusted data products across the organization"
    ]
  },
  {
    id: "data-quality-monitor",
    title: "Real-Time Data Quality Monitor",
    description: "Continuous data quality monitoring platform that profiles datasets, detects anomalies, and enforces quality rules across your entire data pipeline. Sends alerts before bad data reaches downstream consumers.",
    category: "Data",
    icon: "📊",
    href: "/services/data-quality-monitor",
    industry: "Data Engineering",
    stage: "published",
    popular: false,
    pricing: { basic: 149, pro: 349, enterprise: 799 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated profiling for new and changed datasets",
      "Rule builder with 100+ built-in quality checks",
      "Anomaly detection using statistical process control",
      "Drift monitoring for ML feature distributions",
      "Slack, PagerDuty, and email alert integrations",
      "Quality score dashboards with trend analysis"
    ],
    benefits: [
      "Catch data quality issues before they reach reports",
      "Reduce time spent debugging downstream data problems",
      "Establish trust in data across the organization",
      "Meet data compliance requirements with audit trails"
    ]
  }
];

export const wave199CloudServices: Service[] = [
  {
    id: "finops-cloud-optimizer",
    title: "FinOps Cloud Cost Optimizer",
    description: "Comprehensive FinOps platform that analyzes cloud spend across AWS, Azure, and GCP. Identifies waste, recommends rightsizing, automates reserved instance purchases, and provides chargeback reports per team and project.",
    category: "Cloud",
    icon: "💰",
    href: "/services/finops-cloud-optimizer",
    industry: "Cloud Operations",
    stage: "published",
    popular: true,
    pricing: { basic: 199, pro: 449, enterprise: 999 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-cloud cost aggregation and normalization",
      "Idle resource detection with auto-remediation policies",
      "Rightsizing recommendations with performance impact estimates",
      "Reserved instance and savings plan portfolio optimization",
      "Chargeback/showback reports with custom allocation rules",
      "Budget alerts with forecasted overspend warnings"
    ],
    benefits: [
      "Reduce cloud spend by 25-40% through waste elimination",
      "Make informed reserved capacity purchasing decisions",
      "Allocate cloud costs fairly across teams and products",
      "Prevent budget overruns with predictive alerting"
    ]
  },
  {
    id: "multi-cloud-dns-manager",
    title: "Multi-Cloud DNS & Traffic Manager",
    description: "Unified DNS management across cloud providers with intelligent traffic routing, health checks, and failover automation. Supports geo-routing, weighted round-robin, and latency-based routing policies.",
    category: "Cloud",
    icon: "🌐",
    href: "/services/multi-cloud-dns-manager",
    industry: "Cloud Infrastructure",
    stage: "published",
    popular: false,
    pricing: { basic: 99, pro: 249, enterprise: 549 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Single pane of glass for Route53, Cloud DNS, Azure DNS",
      "Geo-location, latency, and weighted routing policies",
      "Automated health checks with instant failover",
      "DNSSEC management and compliance reporting",
      "Change audit log with approval workflows",
      "Terraform integration for infrastructure-as-code DNS"
    ],
    benefits: [
      "Eliminate DNS as a single point of failure",
      "Route users to the fastest endpoint automatically",
      "Manage all cloud DNS from one dashboard",
      "Meet compliance with DNSSEC and audit trails"
    ]
  }
];

export const wave199SecurityServices: Service[] = [
  {
    id: "supply-chain-security",
    title: "Software Supply Chain Security",
    description: "End-to-end software supply chain security platform that scans dependencies, verifies SBOM integrity, detects malicious packages, and enforces artifact signing. Protects against dependency confusion, typosquatting, and compromised build pipelines.",
    category: "Security",
    icon: "🔗",
    href: "/services/supply-chain-security",
    industry: "Application Security",
    stage: "published",
    popular: true,
    pricing: { basic: 249, pro: 549, enterprise: 1199 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "SBOM generation and continuous integrity verification",
      "Malicious package detection across npm, PyPI, Maven, NuGet",
      "Dependency confusion and typosquatting prevention",
      "Artifact signing with Sigstore/cosign integration",
      "Build pipeline provenance attestation (SLSA framework)",
      "Vendor risk scoring for third-party dependencies"
    ],
    benefits: [
      "Prevent supply chain attacks before they reach production",
      "Meet CISA and executive order SBOM requirements",
      "Verify every artifact from source to deployment",
      "Reduce risk from third-party dependency vulnerabilities"
    ]
  }
];

export const wave199AutomationServices: Service[] = [
  {
    id: "intelligent-process-mining",
    title: "Intelligent Process Mining",
    description: "AI-powered process mining platform that discovers actual process flows from event logs, identifies bottlenecks and deviations, and recommends automation opportunities. Bridges the gap between process analysis and RPA implementation.",
    category: "Automation",
    icon: "⛏️",
    href: "/services/intelligent-process-mining",
    industry: "Business Process",
    stage: "published",
    popular: false,
    pricing: { basic: 199, pro: 449, enterprise: 999 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Event log ingestion from ERP, CRM, and BPM systems",
      "Automated process discovery with variant analysis",
      "Conformance checking against reference models",
      "Bottleneck identification with root cause analysis",
      "Automation opportunity scoring per process step",
      "What-if simulation for process change impact"
    ],
    benefits: [
      "Discover how processes actually run vs how they're designed",
      "Prioritize automation investments by impact potential",
      "Identify compliance deviations in operational processes",
      "Simulate process changes before implementing them"
    ]
  }
];

export const wave199ItServices: Service[] = [
  {
    id: "it-asset-management",
    title: "IT Asset Lifecycle Manager",
    description: "Comprehensive IT asset management platform covering hardware, software, and cloud resources from procurement to disposal. Tracks warranties, licenses, maintenance schedules, and automatically flags expirations.",
    category: "It",
    icon: "🖥️",
    href: "/services/it-asset-management",
    industry: "IT Operations",
    stage: "published",
    popular: false,
    pricing: { basic: 79, pro: 199, enterprise: 449 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Auto-discovery of network-connected devices and software",
      "License compliance tracking with true-up reporting",
      "Warranty and maintenance contract expiration alerts",
      "Procurement-to-disposal lifecycle workflow",
      "Cost center allocation and depreciation tracking",
      "Integration with ITSM platforms (ServiceNow, Jira)"
    ],
    benefits: [
      "Eliminate surprise license audit penalties",
      "Extend asset life with proactive maintenance scheduling",
      "Reduce IT spend by identifying unused assets and licenses",
      "Maintain audit-ready asset records year-round"
    ]
  }
];

export const wave199MicroSaasServices: Service[] = [
  {
    id: "url-monetization-platform",
    title: "URL Monetization Platform",
    description: "Smart URL monetization platform that turns any link into revenue. Automatic interstitial ads, link cloaking, click analytics, and A/B testing for affiliates, creators, and marketers. Supports deep links, QR codes, and branded short domains.",
    category: "MicroSaas",
    icon: "🔗",
    href: "/services/url-monetization-platform",
    industry: "Marketing & Affiliate",
    stage: "published",
    popular: false,
    pricing: { basic: 29, pro: 79, enterprise: 199 },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "One-click link monetization with interstitial ad insertion",
      "Link cloaking with 301/302 redirect options",
      "Click analytics with geo, device, and referrer breakdown",
      "A/B split testing for affiliate campaign optimization",
      "Branded short domain support with custom SSL",
      "QR code generation with scan tracking per campaign"
    ],
    benefits: [
      "Monetize existing traffic without creating new content",
      "Protect affiliate IDs from theft and commission loss",
      "Maximize earnings with data-driven link optimization",
      "Build brand trust with clean, branded short links"
    ]
  }
];

export const wave199HealthcareItServices: Service[] = [];
