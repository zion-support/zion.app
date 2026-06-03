import { Service } from './servicesData';

// Wave 208 — New Category Expansion (5 services, 5 new categories)
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
