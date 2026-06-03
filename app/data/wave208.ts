import { Service } from './servicesData';

// Wave 208 — GreenTech, SpaceTech & Advanced Analytics (10 services)
export const wave208AiServices: Service[] = [
  {
    id: "ai-carbon-footprint-tracker",
    title: "AI Carbon Footprint Tracker",
    description: "AI-powered carbon emissions monitoring and reduction platform for enterprises. Tracks Scope 1, 2, and 3 emissions across supply chains, recommends reduction strategies, and automates ESG reporting.",
    category: "ai",
    icon: "🌱",
    href: "/services/ai-carbon-footprint-tracker",
    industry: "Sustainability",
    stage: "published",
    popular: true,
    pricing: { basic: "$299/mo", pro: "$699/mo", enterprise: "$1499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Scope 1, 2, and 3 emissions tracking across operations",
      "AI-powered reduction recommendations with ROI analysis",
      "Automated ESG reporting (GRI, SASB, TCFD frameworks)",
      "Supply chain emissions mapping with supplier scoring",
      "Carbon offset marketplace integration",
      "Real-time emissions dashboard with trend analysis"
    ],
    benefits: [
      "Reduce carbon emissions by 30% with AI-guided actions",
      "Automate ESG reporting and ensure compliance",
      "Identify highest-impact reduction opportunities",
      "Demonstrate sustainability leadership to stakeholders"
    ]
  },
  {
    id: "ai-satellite-imagery-analytics",
    title: "AI Satellite Imagery Analytics Platform",
    description: "Process and analyze satellite and drone imagery with AI for agriculture, urban planning, disaster response, and environmental monitoring. Change detection, object classification, and predictive modeling.",
    category: "ai",
    icon: "🛰️",
    href: "/services/ai-satellite-imagery-analytics",
    industry: "Geospatial Intelligence",
    stage: "published",
    popular: false,
    pricing: { basic: "$499/mo", pro: "$1199/mo", enterprise: "$2499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-spectral and SAR imagery processing",
      "AI object detection and land use classification",
      "Change detection with automated alerts",
      "Crop health monitoring with NDVI analysis",
      "Disaster damage assessment with rapid deployment",
      "Integration with major satellite data providers"
    ],
    benefits: [
      "Monitor vast areas cost-effectively with satellite data",
      "Detect changes and anomalies in near real-time",
      "Make data-driven decisions for land and resource management",
      "Respond faster to natural disasters with damage mapping"
    ]
  }
];

export const wave208DataServices: Service[] = [
  {
    id: "data-mesh-platform",
    title: "Data Mesh Platform",
    description: "Implement data mesh architecture with domain-oriented data ownership, self-serve data infrastructure, and federated governance. Enables scalable data management across large organizations.",
    category: "data",
    icon: "🕸️",
    href: "/services/data-mesh-platform",
    industry: "Data Architecture",
    stage: "published",
    popular: true,
    pricing: { basic: "$599/mo", pro: "$1399/mo", enterprise: "$2999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Domain-oriented data product management",
      "Self-serve data infrastructure portal",
      "Federated data governance with policy automation",
      "Data product discovery and catalog",
      "Cross-domain data sharing with contracts",
      "Automated data quality monitoring per domain"
    ],
    benefits: [
      "Scale data management across hundreds of teams",
      "Reduce data bottlenecks with domain ownership",
      "Maintain governance without central bottlenecks",
      "Accelerate data product delivery by 5x"
    ]
  }
];

export const wave208CloudServices: Service[] = [
  {
    id: "multi-cloud-cost-optimizer",
    title: "Multi-Cloud Cost Optimizer",
    description: "AI-driven cloud cost management across AWS, Azure, and GCP. Identifies waste, recommends reserved instance purchases, and automates resource right-sizing. Real-time cost allocation and chargeback.",
    category: "cloud",
    icon: "💰",
    href: "/services/multi-cloud-cost-optimizer",
    industry: "Cloud FinOps",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$499/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Cross-cloud cost visibility and analytics",
      "AI-powered waste detection and recommendations",
      "Reserved instance and savings plan optimization",
      "Automated resource right-sizing and scheduling",
      "Cost allocation with showback and chargeback",
      "Budget alerts with anomaly detection"
    ],
    benefits: [
      "Reduce cloud spend by 35% on average",
      "Eliminate wasted resources automatically",
      "Accurate cost allocation across teams and projects",
      "Predict and prevent budget overruns"
    ]
  }
];

export const wave208SecurityServices: Service[] = [
  {
    id: "supply-chain-security",
    title: "Software Supply Chain Security",
    description: "End-to-end supply chain security platform that scans dependencies, builds, and deployments for vulnerabilities. SBOM generation, license compliance, and automated remediation.",
    category: "security",
    icon: "🔒",
    href: "/services/supply-chain-security",
    industry: "Application Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$249/mo", pro: "$599/mo", enterprise: "$1299/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Dependency vulnerability scanning (SCA)",
      "SBOM generation and management (SPDX, CycloneDX)",
      "Build pipeline security with signed artifacts",
      "License compliance automation",
      "Container image scanning with CVE matching",
      "Automated pull request remediation"
    ],
    benefits: [
      "Prevent supply chain attacks before they reach production",
      "Automate compliance with SBOM mandates",
      "Reduce vulnerability remediation time by 80%",
      "Maintain license compliance across all dependencies"
    ]
  }
];

export const wave208AutomationServices: Service[] = [
  {
    id: "intelligent-document-processing",
    title: "Intelligent Document Processing (IDP)",
    description: "AI-powered document processing that extracts, classifies, and validates data from any document type. Handles invoices, contracts, forms, and unstructured documents with human-in-the-loop verification.",
    category: "automation",
    icon: "📄",
    href: "/services/intelligent-document-processing",
    industry: "Enterprise Automation",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-format document ingestion (PDF, scan, email, image)",
      "AI classification with 99% accuracy",
      "Structured and unstructured data extraction",
      "Human-in-the-loop verification workflow",
      "ERP and accounting system integration",
      "Continuous learning from corrections"
    ],
    benefits: [
      "Process documents 10x faster than manual entry",
      "Reduce data entry errors by 95%",
      "Free staff from repetitive document handling",
      "Scale document processing without hiring"
    ]
  }
];

export const wave208ItServices: Service[] = [
  {
    id: "digital-experience-monitoring",
    title: "Digital Experience Monitoring (DEM)",
    description: "Monitor end-user experience across web, mobile, and desktop applications. Real user monitoring, synthetic testing, and AI-powered root cause analysis for performance issues.",
    category: "it",
    icon: "📊",
    href: "/services/digital-experience-monitoring",
    industry: "IT Operations",
    stage: "published",
    popular: false,
    pricing: { basic: "$149/mo", pro: "$399/mo", enterprise: "$899/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real user monitoring (RUM) with session replay",
      "Synthetic transaction testing from global locations",
      "AI-powered anomaly detection and root cause analysis",
      "Mobile app performance monitoring",
      "SLA tracking with automated alerting",
      "Integration with ITSM and incident management"
    ],
    benefits: [
      "Detect performance issues before users complain",
      "Reduce MTTR with AI-powered root cause analysis",
      "Optimize user experience across all digital channels",
      "Meet SLA commitments with proactive monitoring"
    ]
  }
];

export const wave208MicroSaasServices: Service[] = [
  {
    id: "churn-prediction-saas",
    title: "Churn Prediction & Prevention Platform",
    description: "AI-powered churn prediction for SaaS and subscription businesses. Identifies at-risk customers, recommends retention actions, and automates win-back campaigns with personalized offers.",
    category: "micro-saas",
    icon: "🎯",
    href: "/services/churn-prediction-saas",
    industry: "SaaS & Subscriptions",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$299/mo", enterprise: "$699/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI churn risk scoring with behavioral signals",
      "Early warning alerts with risk factor breakdown",
      "Automated retention campaign triggers",
      "Personalized win-back offer recommendations",
      "Cohort analysis with lifetime value impact",
      "Integration with CRM and billing systems"
    ],
    benefits: [
      "Reduce churn by 25% with early intervention",
      "Increase customer lifetime value by 30%",
      "Automate retention workflows at scale",
      "Understand why customers leave before they do"
    ]
  }
];

export const wave208HealthcareItServices: Service[] = [
  {
    id: "clinical-trial-management",
    title: "AI Clinical Trial Management Platform",
    description: "Streamline clinical trials with AI-powered patient recruitment, site selection, and protocol optimization. Real-time monitoring, adverse event detection, and regulatory submission automation.",
    category: "healthcare-it",
    icon: "🧪",
    href: "/services/clinical-trial-management",
    industry: "Pharmaceutical",
    stage: "published",
    popular: false,
    pricing: { basic: "$799/mo", pro: "$1799/mo", enterprise: "$3999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI patient recruitment with EHR data matching",
      "Site selection optimization with enrollment forecasting",
      "Protocol deviation detection with automated alerts",
      "Adverse event monitoring with safety signal detection",
      "eCRF data capture with validation rules",
      "Regulatory submission document automation"
    ],
    benefits: [
      "Accelerate patient recruitment by 40%",
      "Reduce trial costs with optimized site selection",
      "Improve data quality with automated validation",
      "Speed regulatory submissions with auto-generated documents"
    ]
  }
];

// Wave 208B — New Category Expansion (5 services, 5 new categories)
// Created by @OWL — AI/ML Ops, DevSecOps, FinTech, EdTech, IoT

export const wave208AiMlOpsServices: Service[] = [
  {
    id: "mlflow-model-registry",
    title: "MLflow Model Registry",
    description: "Open-source platform for managing the complete machine learning lifecycle — experiment tracking, model versioning, deployment, and monitoring. Provides a centralized model registry with stage transitions (staging → production), A/B testing support, and reproducible pipelines that bridge the gap between data science experimentation and production deployment.",
    category: "ai-ml-ops",
    icon: "🤖",
    href: "/services/mlflow-model-registry",
    industry: "Technology, Data Science, AI/ML Teams, Enterprise, Finance, Healthcare",
    stage: "published",
    popular: true,
    pricing: { basic: "Free (self-hosted)", pro: "Managed from $50/mo", enterprise: "Enterprise: SSO, RBAC, unlimited models" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Experiment tracking: log parameters, metrics, artifacts, and compare runs across model versions",
      "Model Registry with stage transitions (None → Staging → Production → Archived) and approval workflows",
      "Reproducible ML pipelines with Docker/Kubernetes execution — any run can be re-executed identically",
      "Built-in model serving with REST API endpoints, batch inference, and A/B testing traffic splitting",
      "Integration with all major ML frameworks: PyTorch, TensorFlow, scikit-learn, XGBoost, HuggingFace",
      "Plugin architecture: extend with custom backends, storage, and deployment targets (SageMaker, Azure ML, Vertex AI)"
    ],
    benefits: [
      "Eliminates 'it works on my laptop' ML deployment problems with reproducible, versioned pipelines",
      "Centralized model registry gives teams visibility into what's in production, who approved it, and when it was last validated",
      "Reduces time from experiment to production from weeks to hours with automated deployment workflows"
    ]
  }
];

export const wave208DevSecOpsServices: Service[] = [
  {
    id: "snyk-vulnerability-scanner",
    title: "Snyk Vulnerability Scanner",
    description: "Developer-first security platform that finds and fixes vulnerabilities in code, dependencies, containers, and infrastructure-as-code. Integrates directly into CI/CD pipelines, IDEs, and Git workflows to shift security left — catching issues before they reach production rather than after a breach.",
    category: "devsecops",
    icon: "🛡️",
    href: "/services/snyk-vulnerability-scanner",
    industry: "Technology, DevOps, Security, Financial Services, Healthcare, Government",
    stage: "published",
    popular: true,
    pricing: { basic: "Free: 200 tests/mo", pro: "Team from $125/mo per developer", enterprise: "Business: unlimited tests, custom policies, SSO" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Dependency scanning: detects known vulnerabilities (CVEs) in npm, PyPI, Maven, Go, Ruby, and .NET packages",
      "Container image scanning: analyze Docker images layer-by-layer against 1M+ known vulnerabilities",
      "Infrastructure-as-code scanning: catch misconfigurations in Terraform, CloudFormation, Kubernetes YAML, and Helm charts",
      "IDE plugins for VS Code, IntelliJ, and WebStorm — see vulnerabilities as you write code with one-click fix suggestions",
      "CI/CD integration: GitHub Actions, GitLab CI, Jenkins, Azure DevOps — fail builds on critical vulnerabilities",
      "License compliance scanning: identify open-source license risks before they become legal problems"
    ],
    benefits: [
      "Shifts security left: find and fix vulnerabilities during development instead of after deployment (100x cheaper)",
      "Developer-friendly UX means security doesn't slow down shipping — fixes are suggested, not just flagged",
      "Unified platform covers code, dependencies, containers, and IaC — no need for 4 separate security tools"
    ]
  }
];

export const wave208FinTechServices: Service[] = [
  {
    id: "stripe-financial-infrastructure",
    title: "Stripe Financial Infrastructure",
    description: "Complete financial infrastructure platform that enables businesses to accept payments, manage subscriptions, issue cards, lend capital, and handle global compliance — all through a single API. Powers millions of companies from startups to Fortune 500s, handling hundreds of billions in payment volume annually with built-in fraud detection and regulatory compliance.",
    category: "fintech",
    icon: "💳",
    href: "/services/stripe-financial-infrastructure",
    industry: "E-commerce, SaaS, Marketplace, Fintech, Retail, Subscription Businesses",
    stage: "published",
    popular: true,
    pricing: { basic: "2.9% + 30¢ per transaction", pro: "Custom volume pricing from 2.5%", enterprise: "Enterprise: dedicated support, custom interchange optimization" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Global payments: accept 135+ currencies, 40+ payment methods (cards, wallets, bank transfers, buy-now-pay-later)",
      "Subscription billing engine: prorations, metered billing, trial management, dunning, and revenue recognition",
      "Stripe Radar: machine learning fraud detection trained on data from millions of companies — blocks fraud without adding friction",
      "Connect platform: build marketplaces and platforms with split payments, onboarding, and compliance for sub-merchants",
      "Treasury & Banking-as-a-Service: embed financial products (accounts, cards, lending) directly into your product",
      "Revenue recognition, tax calculation (Stripe Tax), and financial reporting — close books faster with automated reconciliation"
    ],
    benefits: [
      "Launch payment infrastructure in days instead of months — no banking partnerships or PCI compliance headaches required",
      "Global reach out of the box: sell in 195+ countries with local payment methods that increase conversion 20-30%",
      "Unified financial stack reduces the need for separate payment, fraud, tax, and accounting tools"
    ]
  }
];

export const wave208EdTechServices: Service[] = [
  {
    id: "moodle-learning-platform",
    title: "Moodle Learning Platform",
    description: "World's most widely adopted open-source learning management system (LMS), powering 250M+ users across 240+ countries. Provides a customizable, standards-compliant platform for creating online courses, managing assessments, tracking learner progress, and building collaborative learning environments — from K-12 to corporate training to university education.",
    category: "edtech",
    icon: "🎓",
    href: "/services/moodle-learning-platform",
    industry: "Education, Corporate Training, Higher Education, K-12, Professional Development",
    stage: "published",
    popular: false,
    pricing: { basic: "Free (self-hosted, open source)", pro: "MoodleCloud from $120/yr for 50 users", enterprise: "Moodle Workplace: custom pricing, multi-tenancy, advanced reporting" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Course builder with drag-and-drop activity types: quizzes, assignments, forums, SCORM packages, H5P interactive content",
      "Competency-based education framework: define learning plans, track competencies across courses, generate completion evidence",
      "Advanced grading: rubrics, marking guides, blind grading, and competency outcome tracking for accreditation compliance",
      "400+ plugins: video conferencing (BigBlueButton), plagiarism detection (Turnitin), gamification, attendance, certificates",
      "Multi-tenancy support (Moodle Workplace): run multiple branded learning portals from a single installation",
      "Mobile app with offline access, push notifications, and native mobile-friendly course rendering"
    ],
    benefits: [
      "Free and open-source core eliminates per-seat licensing costs that make proprietary LMS platforms prohibitively expensive at scale",
      "20+ years of development and 250M+ users means battle-tested reliability and a massive ecosystem of plugins and integrations",
      "Full data ownership and GDPR compliance — critical for educational institutions handling student data"
    ]
  }
];

export const wave208IotServices: Service[] = [
  {
    id: "thingsboard-iot-platform",
    title: "ThingsBoard IoT Platform",
    description: "Open-source IoT platform for device management, data collection, processing, and visualization at scale. Handles millions of devices with real-time telemetry ingestion, rule engine for automated alerts and actions, and customizable dashboards — enabling everything from smart building management to industrial predictive maintenance without vendor lock-in.",
    category: "iot",
    icon: "📡",
    href: "/services/thingsboard-iot-platform",
    industry: "Manufacturing, Smart Cities, Agriculture, Energy, Logistics, Healthcare, Building Automation",
    stage: "published",
    popular: false,
    pricing: { basic: "Free (self-hosted, open source)", pro: "Professional Edition from $10/device/mo", enterprise: "Edge: on-prem processing, unlimited tenants, white-label" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Device management at scale: provision, monitor, and control millions of devices with hierarchical asset relationships",
      "Multi-protocol ingestion: MQTT, CoAP, HTTP, OPC-UA, Modbus, BACnet — connect any industrial or consumer device",
      "Rule engine: chainable processing nodes for filtering, transforming, enriching, and acting on telemetry in real time",
      "Real-time dashboards with 30+ widget types: maps, gauges, charts, control widgets, and custom HTML/CSS widgets",
      "Edge computing: deploy processing rules to edge gateways for offline operation and reduced cloud bandwidth",
      "Integration with Kafka, AWS IoT, Azure IoT Hub, and TimescaleDB for enterprise data pipeline compatibility"
    ],
    benefits: [
      "Open-source core eliminates per-device licensing fees that make proprietary IoT platforms cost-prohibitive at scale",
      "Multi-protocol support means you can connect legacy industrial equipment alongside modern sensors — no rip-and-replace",
      "Edge computing capability enables real-time local processing even when cloud connectivity is intermittent"
    ]
  }
];
