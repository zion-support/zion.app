import { Service } from './serviceTypes';

// Wave 202 — Industry-Specific & Vertical Solutions (10 services)
export const wave202AiServices: Service[] = [
  {
    id: "ai-crop-yield-predictor",
    title: "AI Crop Yield Predictor",
    description: "Precision agriculture platform that combines satellite imagery, weather data, soil sensors, and historical yield data to predict crop yields with 95%+ accuracy. Helps farmers optimize planting, irrigation, and harvest timing.",
    category: "ai",
    icon: "🌾",
    href: "/services/ai-crop-yield-predictor",
    industry: "Agriculture",
    stage: "published",
    popular: false,
    pricing: { basic: "$99/mo", pro: "$249/mo", enterprise: "$549/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Satellite NDVI imagery analysis with field-level resolution",
      "Weather forecast integration with growing degree day models",
      "Soil moisture sensor data fusion and irrigation recommendations",
      "Pest and disease risk prediction from environmental conditions",
      "Yield forecast with confidence intervals per field zone",
      "Mobile app for field scouting with photo-based diagnosis"
    ],
    benefits: [
      "Increase yields 10-20% with data-driven decisions",
      "Reduce water usage 25% with precision irrigation timing",
      "Minimize crop loss with early pest and disease warnings",
      "Optimize harvest timing for maximum quality and price"
    ]
  },
  {
    id: "ai-energy-grid-optimizer",
    title: "AI Energy Grid Optimizer",
    description: "Smart grid management platform that balances energy supply and demand in real-time using AI forecasting. Integrates renewable generation, battery storage, and demand response to minimize costs and carbon emissions.",
    category: "ai",
    icon: "⚡",
    href: "/services/ai-energy-grid-optimizer",
    industry: "Energy & Utilities",
    stage: "published",
    popular: true,
    pricing: { basic: "$499/mo", pro: "$1199/mo", enterprise: "$2499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Renewable generation forecasting (solar, wind) with 96h horizon",
      "Demand prediction with weather and event correlation",
      "Battery charge/discharge optimization for peak shaving",
      "Demand response orchestration with automated load curtailment",
      "Carbon intensity tracking with emission reduction reporting",
      "Grid stability monitoring with anomaly detection"
    ],
    benefits: [
      "Reduce energy costs 15-30% with optimized dispatch",
      "Maximize renewable utilization and minimize curtailment",
      "Meet carbon reduction targets with measurable tracking",
      "Prevent grid instability with predictive load management"
    ]
  },
  {
    id: "ai-recruitment-screener",
    title: "AI Recruitment Screening Platform",
    description: "Bias-aware AI recruitment platform that screens resumes, ranks candidates, and conducts initial video interview analysis. Ensures fair evaluation while reducing time-to-hire by 60%.",
    category: "ai",
    icon: "👥",
    href: "/services/ai-recruitment-screener",
    industry: "Human Resources",
    stage: "published",
    popular: true,
    pricing: { basic: "$149/mo", pro: "$349/mo", enterprise: "$799/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Resume parsing with skills extraction and experience mapping",
      "Bias detection and mitigation in screening criteria",
      "Video interview analysis with structured competency scoring",
      "Candidate ranking with explainable match scores",
      "Diversity analytics dashboard with pipeline metrics",
      "ATS integration (Greenhouse, Lever, Workday, iCIMS)"
    ],
    benefits: [
      "Reduce time-to-hire by 60% with automated screening",
      "Improve quality of hire with competency-based matching",
      "Ensure fair evaluation with bias detection and removal",
      "Scale recruitment without proportional recruiter hiring"
    ]
  }
];

export const wave202DataServices: Service[] = [
  {
    id: "customer-data-platform",
    title: "Customer Data Platform (CDP)",
    description: "Enterprise customer data platform that unifies customer data from all touchpoints into a single, actionable profile. Real-time identity resolution, segmentation, and activation across marketing, sales, and service channels.",
    category: "data",
    icon: "👤",
    href: "/services/customer-data-platform",
    industry: "Marketing Technology",
    stage: "published",
    popular: true,
    pricing: { basic: "$299/mo", pro: "$699/mo", enterprise: "$1499/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time identity resolution across devices and channels",
      "Unified customer profile with 360-degree view",
      "Behavioral segmentation with dynamic cohort building",
      "Privacy consent management with GDPR/CCPA compliance",
      "Activation connectors for 100+ marketing and ad platforms",
      "Customer journey analytics with attribution modeling"
    ],
    benefits: [
      "Eliminate data silos with a single customer view",
      "Personalize experiences across all channels in real-time",
      "Improve marketing ROI with unified attribution",
      "Maintain privacy compliance with centralized consent"
    ]
  }
];

export const wave202CloudServices: Service[] = [
  {
    id: "disaster-recovery-automation",
    title: "Disaster Recovery Automation Platform",
    description: "Automated disaster recovery platform that orchestrates failover, data replication, and recovery across multi-cloud environments. One-click DR testing, RTO/RPO monitoring, and compliance-ready runbooks.",
    category: "cloud",
    icon: "🔄",
    href: "/services/disaster-recovery-automation",
    industry: "Cloud Operations",
    stage: "published",
    popular: false,
    pricing: { basic: "$249/mo", pro: "$549/mo", enterprise: "$1199/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Automated failover orchestration across regions and clouds",
      "Continuous data replication with RPO monitoring",
      "One-click DR testing without impacting production",
      "Recovery runbook automation with approval gates",
      "RTO/RPO compliance dashboards with SLA tracking",
      "Post-incident reporting with root cause analysis"
    ],
    benefits: [
      "Achieve RTO under 15 minutes with automated failover",
      "Test DR plans monthly without production impact",
      "Meet compliance requirements with documented runbooks",
      "Reduce DR costs with intelligent resource scheduling"
    ]
  }
];

export const wave202SecurityServices: Service[] = [
  {
    id: "data-loss-prevention",
    title: "Data Loss Prevention (DLP) Suite",
    description: "Enterprise data loss prevention platform that monitors, detects, and blocks sensitive data exfiltration across endpoints, cloud apps, and network. Content inspection, user behavior analytics, and automated response policies.",
    category: "security",
    icon: "🚫",
    href: "/services/data-loss-prevention",
    industry: "Data Security",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Content inspection across email, cloud storage, and endpoints",
      "User behavior analytics for insider threat detection",
      "Automated blocking with customizable response policies",
      "Sensitive data classification with ML-based discovery",
      "Cloud app shadow IT discovery and risk assessment",
      "Compliance reporting for PCI-DSS, HIPAA, GDPR"
    ],
    benefits: [
      "Prevent data breaches from both external and insider threats",
      "Automatically classify and protect sensitive data at scale",
      "Detect shadow IT cloud apps handling sensitive data",
      "Meet regulatory compliance with continuous monitoring"
    ]
  }
];

export const wave202AutomationServices: Service[] = [
  {
    id: "robotic-process-automation",
    title: "Robotic Process Automation (RPA) Platform",
    description: "Enterprise RPA platform that automates repetitive business processes using software robots. No-code bot builder, AI-powered document understanding, and centralized bot orchestration with monitoring.",
    category: "automation",
    icon: "🤖",
    href: "/services/robotic-process-automation",
    industry: "Business Process",
    stage: "published",
    popular: true,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "No-code visual bot designer with drag-and-drop actions",
      "AI document understanding for unstructured data processing",
      "Centralized bot orchestration with scheduling and monitoring",
      "Exception handling with human-in-the-loop escalation",
      "200+ pre-built connectors for enterprise applications",
      "Bot performance analytics with ROI tracking"
    ],
    benefits: [
      "Automate 70% of repetitive manual processes",
      "Reduce process costs by 40-60% with unattended bots",
      "Eliminate human errors in data entry and processing",
      "Scale operations without proportional headcount growth"
    ]
  }
];

export const wave202ItServices: Service[] = [
  {
    id: "network-observability-platform",
    title: "Network Observability Platform",
    description: "Full-stack network observability platform that provides real-time visibility into network performance, traffic patterns, and health metrics. Combines flow analysis, packet capture, and synthetic monitoring with AI-powered root cause analysis.",
    category: "it",
    icon: "🌐",
    href: "/services/network-observability-platform",
    industry: "Network Operations",
    stage: "published",
    popular: false,
    pricing: { basic: "$199/mo", pro: "$449/mo", enterprise: "$999/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "NetFlow/sFlow analysis with application-level visibility",
      "Full packet capture with intelligent filtering and storage",
      "Synthetic transaction monitoring for critical applications",
      "AI-powered anomaly detection and root cause analysis",
      "Network topology auto-discovery and mapping",
      "Capacity planning with trend analysis and forecasting"
    ],
    benefits: [
      "Reduce network troubleshooting time by 80%",
      "Detect performance degradation before users notice",
      "Optimize bandwidth allocation with traffic analysis",
      "Plan capacity accurately with AI-driven forecasting"
    ]
  }
];

export const wave202MicroSaasServices: Service[] = [
  {
    id: "review-management-platform",
    title: "Review Management & Reputation Platform",
    description: "Multi-platform review management platform that monitors, responds to, and analyzes customer reviews across Google, Yelp, TripAdvisor, and industry-specific sites. AI-powered response generation and sentiment trend analysis.",
    category: "micro-saas",
    icon: "⭐",
    href: "/services/review-management-platform",
    industry: "Marketing & Reputation",
    stage: "published",
    popular: true,
    pricing: { basic: "$49/mo", pro: "$129/mo", enterprise: "$299/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Multi-platform review monitoring (Google, Yelp, TripAdvisor, etc.)",
      "AI-powered response generation with brand voice matching",
      "Sentiment analysis with trend tracking and alerting",
      "Review request automation via email and SMS",
      "Competitor review benchmarking and analysis",
      "Review widget for website with rich snippets for SEO"
    ],
    benefits: [
      "Improve average rating with proactive review management",
      "Respond to reviews 10x faster with AI-generated drafts",
      "Identify product/service issues from review sentiment",
      "Boost local SEO with increased review volume and ratings"
    ]
  }
];

export const wave202HealthcareItServices: Service[] = [];
