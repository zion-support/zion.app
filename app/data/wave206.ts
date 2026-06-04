import { Service } from './serviceTypes';

// Wave 206 — Underrepresented Categories Focus (10 services)
export const wave206AiServices: Service[] = [
  {
    id: "ai-accessibility-checker",
    title: "AI Accessibility Compliance Checker",
    description: "Automated web accessibility testing platform that scans sites and apps for WCAG 2.1/2.2 compliance. AI-powered remediation suggestions, screen reader simulation, and continuous monitoring for accessibility regressions.",
    category: "ai",
    icon: "♿",
    href: "/services/ai-accessibility-checker",
    industry: "Web Accessibility",
    stage: "published",
    popular: false,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated WCAG 2.1/2.2 AA and AAA compliance scanning",
      "Screen reader simulation with NVDA, JAWS, and VoiceOver testing",
      "AI-powered remediation suggestions with code snippets",
      "Continuous monitoring with regression alerts",
      "VPAT (Voluntary Product Accessibility Template) generation",
      "Integration with CI/CD pipelines for pre-deployment checks"
    ],
    benefits: [
      "Avoid accessibility lawsuits with proactive compliance",
      "Reach 15% more users who have disabilities",
      "Fix accessibility issues 10x faster with AI suggestions",
      "Meet ADA, Section 508, and EN 301 549 requirements"
    ]
  }
];

export const wave206DataServices: Service[] = [
  {
    id: "data-lineage-tracker",
    title: "Data Lineage & Impact Analysis Platform",
    description: "Automated data lineage discovery and visualization platform that maps data flow from source to consumption. Column-level lineage, impact analysis for schema changes, and compliance documentation for data governance.",
    category: "data",
    icon: "🔗",
    href: "/services/data-lineage-tracker",
    industry: "Data Governance",
    stage: "published",
    popular: true,
    pricing: { basic: "$249/mo", pro: "$549/mo", enterprise: "$1199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated lineage discovery across databases, ETL, and BI tools",
      "Column-level lineage with transformation logic capture",
      "Impact analysis for proposed schema or pipeline changes",
      "Data flow visualization with interactive dependency graphs",
      "Compliance documentation with audit-ready lineage reports",
      "Integration with Snowflake, Databricks, dbt, and Airflow"
    ],
    benefits: [
      "Understand exactly where data comes from and how it transforms",
      "Assess impact of changes before making them",
      "Meet GDPR and CCPA data provenance requirements",
      "Reduce time spent on data troubleshooting by 60%"
    ]
  },
  {
    id: "data-contract-testing",
    title: "Data Contract Testing Framework",
    description: "Automated data contract testing platform that validates data quality, schema, and freshness at every pipeline stage. Shift-left data testing with CI/CD integration and automatic breakage alerts.",
    category: "data",
    icon: "✅",
    href: "/services/data-contract-testing",
    industry: "Data Engineering",
    stage: "published",
    popular: false,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Schema contract validation with drift detection",
      "Data quality rule testing with statistical assertions",
      "Freshness SLA monitoring with automatic alerts",
      "CI/CD integration with GitHub Actions and GitLab CI",
      "Contract versioning with backward compatibility checks",
      "Test result dashboard with trend analysis"
    ],
    benefits: [
      "Catch data quality issues before they reach production",
      "Shift data testing left into the development process",
      "Reduce data incident MTTR with automated breakage alerts",
      "Build trust in data with continuous contract validation"
    ]
  }
];

export const wave206CloudServices: Service[] = [];

export const wave206SecurityServices: Service[] = [];

export const wave206AutomationServices: Service[] = [
  {
    id: "api-integration-platform",
    title: "API Integration & Orchestration Platform",
    description: "No-code API integration platform that connects SaaS applications, databases, and services with pre-built connectors and custom API orchestration. Event-driven workflows, data transformation, and error handling.",
    category: "automation",
    icon: "🔌",
    href: "/services/api-integration-platform",
    industry: "Integration",
    stage: "published",
    popular: true,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "300+ pre-built connectors for popular SaaS and databases",
      "Visual API orchestration with drag-and-drop workflow builder",
      "Event-driven triggers with webhook and polling support",
      "Data transformation with mapping and formula engine",
      "Error handling with retry, fallback, and alert policies",
      "API mocking and testing environment for development"
    ],
    benefits: [
      "Connect disparate systems without writing integration code",
      "Reduce integration development time by 80%",
      "Handle complex multi-step API orchestration visually",
      "Eliminate point-to-point integration spaghetti"
    ]
  },
  {
    id: "business-process-automation",
    title: "Business Process Automation (BPA) Suite",
    description: "Enterprise BPA platform that discovers, models, and automates complex business processes across departments. Combines workflow automation, document processing, and AI decision-making in one platform.",
    category: "automation",
    icon: "⚙️",
    href: "/services/business-process-automation",
    industry: "Business Process",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Process discovery through system log analysis",
      "Visual BPMN 2.0 process modeling with simulation",
      "AI-powered decision rules with natural language conditions",
      "Document processing with OCR and intelligent extraction",
      "Cross-department process orchestration",
      "Process analytics with bottleneck and compliance reporting"
    ],
    benefits: [
      "Automate 60% of manual cross-functional processes",
      "Reduce process cycle times by 50%",
      "Ensure compliance with auditable process execution",
      "Continuously improve processes with analytics insights"
    ]
  }
];

export const wave206ItServices: Service[] = [
  {
    id: "it-capacity-planning",
    title: "IT Capacity Planning & Forecasting",
    description: "AI-powered IT capacity planning platform that forecasts infrastructure needs based on business growth, seasonal patterns, and application demand. Right-size cloud and on-prem resources to minimize cost while preventing performance issues.",
    category: "it",
    icon: "📊",
    href: "/services/it-capacity-planning",
    industry: "IT Operations",
    stage: "published",
    popular: false,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI demand forecasting with seasonal and growth modeling",
      "What-if scenario planning for business changes",
      "Right-sizing recommendations for cloud and on-prem resources",
      "Budget forecasting with cost optimization suggestions",
      "Performance prediction with bottleneck identification",
      "Integration with monitoring tools (Datadog, Prometheus, CloudWatch)"
    ],
    benefits: [
      "Prevent performance issues with proactive capacity planning",
      "Optimize IT spend by right-sizing before problems occur",
      "Align infrastructure investments with business growth",
      "Reduce emergency capacity purchases by 80%"
    ]
  }
];

export const wave206MicroSaasServices: Service[] = [
  {
    id: "email-warmup-tool",
    title: "Email Warmup & Deliverability Platform",
    description: "Email warmup platform that gradually builds sender reputation for new domains and IPs. Automated email interactions, spam trap monitoring, and deliverability analytics to ensure inbox placement.",
    category: "micro-saas",
    icon: "📧",
    href: "/services/email-warmup-tool",
    industry: "Email Marketing",
    stage: "published",
    popular: true,
    pricing: { basic: "$29/mo", pro: "$79/mo", enterprise: "$199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated email warmup with AI-generated conversations",
      "Spam trap monitoring and blacklist checking",
      "Inbox placement testing across Gmail, Outlook, Yahoo",
      "Sender reputation scoring with improvement recommendations",
      "DMARC, SPF, and DKIM configuration validation",
      "Warmup analytics with engagement rate tracking"
    ],
    benefits: [
      "Achieve 95%+ inbox placement for new sending domains",
      "Build sender reputation naturally without spam risk",
      "Monitor and maintain deliverability continuously",
      "Avoid blacklists with proactive reputation management"
    ]
  },
  {
    id: "knowledge-base-platform",
    title: "AI Knowledge Base & Help Center",
    description: "AI-powered knowledge base platform that creates, organizes, and serves help content. Automatic article suggestions from support tickets, AI chatbot integration, and analytics on content effectiveness.",
    category: "micro-saas",
    icon: "📚",
    href: "/services/knowledge-base-platform",
    industry: "Customer Support",
    stage: "published",
    popular: true,
    pricing: { basic: "$49/mo", pro: "$129/mo", enterprise: "$299/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "AI article generation from resolved support tickets",
      "Smart search with natural language understanding",
      "AI chatbot integration for instant answers",
      "Content effectiveness analytics with gap identification",
      "Multi-language support with automatic translation",
      "Customizable help center with branding and domain mapping"
    ],
    benefits: [
      "Reduce support ticket volume by 40% with self-service",
      "Keep knowledge base current with AI-generated content",
      "Improve customer satisfaction with instant answers",
      "Identify knowledge gaps from search analytics"
    ]
  }
];

export const wave206HealthcareItServices: Service[] = [];
