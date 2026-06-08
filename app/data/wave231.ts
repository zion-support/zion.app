import { Service } from './serviceTypes';

// Wave 231 — AI, IT & Micro-SaaS Services (5 services)
// Research by @tablet_kleber_bot

export const wave231AiServices: Service[] = [
  {
    id: "ai-supply-chain-demand-forecasting",
    title: "AI Supply Chain Demand Forecasting Engine",
    description: "ML-based demand prediction platform that ingests historical sales data, market signals, and external variables to generate highly accurate demand forecasts. Seasonal trend analysis, inventory optimization recommendations, and supplier lead time forecasting help supply chain teams reduce stockouts, minimize excess inventory, and improve procurement planning.",
    category: "ai",
    icon: "📦",
    href: "/services/ai-supply-chain-demand-forecasting",
    industry: "Supply Chain, Logistics, Retail, Manufacturing",
    stage: "published",
    popular: true,
    pricing: { basic: "$1,299/mo", pro: "$3,499/mo", enterprise: "Custom" },
    contactInfo: { website: "/services/", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "ML-based demand prediction using historical sales, promotions, and external market signals",
      "Seasonal trend analysis with automated decomposition of cyclical, trend, and residual components",
      "Inventory optimization with safety stock calculations and reorder point recommendations",
      "Supplier lead time forecasting to proactively manage procurement and reduce stockout risk",
      "Multi-echelon inventory optimization across warehouses, distribution centers, and retail locations",
      "Real-time forecast accuracy tracking with MAPE, WMAPE, and bias alerts for continuous model improvement"
    ],
    benefits: [
      "Reduce forecast error by up to 50% compared to spreadsheet-based or naive forecasting methods",
      "Decrease inventory carrying costs by 20-35% through optimized safety stock and reorder points",
      "Minimize stockouts and lost sales with proactive supplier lead time predictions",
      "Improve procurement planning with multi-tier visibility across the entire supply network",
      "Scale forecasting to thousands of SKUs without adding headcount or manual effort"
    ]
  },
  {
    id: "ai-sentiment-analysis-social-media",
    title: "AI-Powered Sentiment Analysis for Social Media",
    description: "Real-time brand monitoring and sentiment analysis platform that tracks mentions, conversations, and trends across Twitter, Reddit, Instagram, and other social channels. Advanced NLP models deliver granular sentiment scores, emotion detection, competitor benchmarking, and trend alerts so marketing and PR teams can act on brand perception in real time.",
    category: "ai",
    icon: "💬",
    href: "/services/ai-sentiment-analysis-social-media",
    industry: "Marketing, PR, Brand Management, E-commerce",
    stage: "published",
    popular: true,
    pricing: { basic: "$349/mo", pro: "$899/mo", enterprise: "Custom" },
    contactInfo: { website: "/services/", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time brand monitoring across Twitter, Reddit, Instagram, Facebook, LinkedIn, and YouTube",
      "Granular sentiment scoring (positive, negative, neutral) with emotion detection (joy, anger, fear, etc.)",
      "Competitor analysis with side-by-side sentiment benchmarking and share-of-voice tracking",
      "Trend detection with emerging topic clustering and viral content early-warning alerts",
      "Custom ML models trained on industry-specific language for higher accuracy in niche sectors",
      "Automated alerting for sentiment spikes, PR crises, and unusual mention volume changes"
    ],
    benefits: [
      "Detect PR crises within minutes instead of hours with real-time sentiment monitoring",
      "Benchmark brand perception against competitors with quantitative share-of-voice metrics",
      "Identify emerging trends and viral opportunities before they peak",
      "Reduce manual social listening effort by 90% with automated sentiment classification",
      "Make data-driven marketing decisions backed by real audience sentiment data"
    ]
  }
];

export const wave231ItServices: Service[] = [
  {
    id: "cloud-finops-cost-optimization",
    title: "Cloud FinOps Cost Optimization Service",
    description: "Multi-cloud cost analysis and optimization platform that identifies wasted resources, manages reserved instances and savings plans, and automates rightsizing recommendations. Provides continuous visibility into AWS, Azure, and GCP spending with actionable insights to reduce cloud bills by 30-50% without impacting performance.",
    category: "it",
    icon: "💰",
    href: "/services/cloud-finops-cost-optimization",
    industry: "Cloud Operations, DevOps, Finance, IT Management",
    stage: "published",
    popular: true,
    pricing: { basic: "$999/mo", pro: "$2,999/mo", enterprise: "Custom" },
    contactInfo: { website: "/services/", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-cloud cost analysis across AWS, Azure, and GCP with unified dashboard and tagging enforcement",
      "Wasted resource detection: idle instances, unattached EBS volumes, orphaned load balancers, unused IPs",
      "Reserved instance and savings plan management with purchase recommendations and coverage optimization",
      "Automated rightsizing with instance family recommendations based on actual CPU/memory utilization trends",
      "Anomaly detection for unexpected cost spikes with root-cause analysis and team-level chargeback",
      "FinOps reporting with budget vs. actual tracking, forecasting, and executive cost optimization scorecards"
    ],
    benefits: [
      "Reduce cloud spending by 30-50% through systematic identification and elimination of waste",
      "Maximize reserved instance savings with data-driven purchase timing and family selection",
      "Eliminate manual cost review cycles with automated, continuous optimization recommendations",
      "Provide finance and engineering teams with shared cost visibility and accountability",
      "Forecast cloud spend accurately to prevent budget overruns and improve financial planning"
    ]
  },
  {
    id: "disaster-recovery-as-a-service",
    title: "Disaster Recovery as a Service (DRaaS)",
    description: "Enterprise-grade disaster recovery platform delivering automated failover, encrypted backups, and DR runbook automation. Guarantees RPO under 1 hour and RTO under 4 hours with continuous replication, regular DR testing, and compliance-ready audit trails. Protects critical workloads across on-premises and cloud environments.",
    category: "it",
    icon: "🛡️",
    href: "/services/disaster-recovery-as-a-service",
    industry: "IT Operations, Enterprise, Healthcare, Finance, Government",
    stage: "published",
    popular: true,
    pricing: { basic: "$2,499/mo", pro: "$5,999/mo", enterprise: "Custom" },
    contactInfo: { website: "/services/", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated failover orchestration with dependency-aware startup sequences for multi-tier applications",
      "Continuous data replication with RPO < 1 hour and RTO < 4 hours for critical production workloads",
      "Encrypted backups with AES-256 encryption at rest and in transit, with geo-redundant storage across regions",
      "DR runbook automation: execute and document recovery procedures with one-click or scheduled DR drills",
      "Non-disruptive DR testing: validate recovery readiness without impacting production environments",
      "Compliance-ready audit trails with RPO/RTO verification reports for SOC 2, HIPAA, and ISO 27001 audits"
    ],
    benefits: [
      "Achieve enterprise-grade disaster recovery without building and maintaining a secondary data center",
      "Meet strict RPO and RTO SLAs with automated, tested, and reliable failover procedures",
      "Reduce DR testing costs and complexity with non-disruptive, automated DR drills",
      "Ensure regulatory compliance with encrypted backups and auditable recovery documentation",
      "Minimize business downtime and revenue loss during outages with sub-4-hour recovery guarantees"
    ]
  }
];

export const wave231MicroSaasServices: Service[] = [
  {
    id: "employee-onboarding-platform",
    title: "Micro-SaaS Employee Onboarding Platform",
    description: "Digital onboarding platform that automates the entire new hire experience from offer letter to day-one readiness. Configurable onboarding workflows, digital document collection with e-signatures, training track assignment, and real-time progress dashboards help HR teams deliver a consistent, engaging onboarding experience at scale.",
    category: "micro-saas",
    icon: "👋",
    href: "/services/employee-onboarding-platform",
    industry: "Human Resources, SMB, Startups, Professional Services",
    stage: "published",
    popular: true,
    pricing: { basic: "$59/mo", pro: "$149/mo", enterprise: "$349/mo" },
    contactInfo: { website: "/services/", email: "kleber@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Digital onboarding workflows with role-based templates for engineering, sales, operations, and executive hires",
      "Document collection with e-signatures for offer letters, NDAs, tax forms, and policy acknowledgments",
      "Training track assignment with LMS integration and automated enrollment in required courses",
      "Progress dashboards for HR, managers, and new hires with milestone tracking and completion percentages",
      "Automated task reminders and escalations to prevent onboarding bottlenecks and missed deadlines",
      "Integration with HRIS (BambooHR, Workday), Slack, and Google Workspace for seamless data flow"
    ],
    benefits: [
      "Reduce time-to-productivity for new hires by 40% with structured, automated onboarding paths",
      "Eliminate paper-based processes and manual follow-ups with digital document collection and e-signatures",
      "Ensure compliance with consistent, auditable onboarding checklists for every new hire",
      "Scale onboarding quality without adding HR headcount as the company grows",
      "Improve new hire retention with a polished, engaging first impression from day one"
    ]
  }
];
