// Wave 183 services - OWL
// 10 new services across 7 categories

import { Service } from './serviceTypes';

export const wave183AiServices: Service[] = [
  {
    id: 'ai-employee-engagement-analytics',
    title: 'Employee Engagement Analytics',
    category: 'ai',
    industry: 'Human Resources',
    description: 'AI-powered employee engagement platform that analyzes survey data, communication patterns, and productivity metrics to predict turnover and recommend interventions.',
    features: ["Sentiment Analysis", "Turnover Prediction", "Engagement Scoring", "Action Recommendations", "Anonymous Feedback"],
    benefits: ["Reduce turnover 30%", "Improve satisfaction", "Data-driven HR decisions"],
    pricing: {"basic": "$179/mo", "pro": "$499/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "users",
    href: "/services/ai-employee-engagement-analytics",
    stage: "published",
  },
  {
    id: 'ai-customer-lifetime-value-prediction',
    title: 'Customer Lifetime Value Prediction',
    category: 'ai',
    industry: 'Analytics',
    description: 'ML-powered CLV prediction engine that forecasts customer revenue potential using behavioral data, purchase history, and engagement metrics.',
    features: ["CLV Forecasting", "Behavioral Segmentation", "Churn Risk Scoring", "Retention Recommendations", "Revenue Attribution"],
    benefits: ["Increase retention 25%", "Optimize marketing spend", "Identify high-value segments"],
    pricing: {"basic": "$149/mo", "pro": "$449/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "chart",
    href: "/services/ai-customer-lifetime-value-prediction",
    stage: "published",
  },
  {
    id: 'ai-legal-document-summarizer',
    title: 'Legal Document AI Summarizer',
    category: 'ai',
    industry: 'Legal Tech',
    description: 'AI-powered legal document analysis and summarization tool. Extracts key clauses, obligations, and risks from contracts, briefs, and compliance documents.',
    features: ["Clause Extraction", "Risk Identification", "Obligation Tracking", "Multi-format Support", "Citation Analysis"],
    benefits: ["Reduce review time 80%", "Minimize legal risk", "Standardize analysis"],
    pricing: {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "document",
    href: "/services/ai-legal-document-summarizer",
    stage: "published",
  },
];

export const wave183MicroSaasServices: Service[] = [
  {
    id: 'microsaas-ticket-desk',
    title: 'TicketDesk - Help Desk',
    category: 'micro-saas',
    industry: 'SaaS',
    description: 'Lightweight help desk and ticketing system with SLA tracking, canned responses, and knowledge base integration. Perfect for small teams.',
    features: ["Ticket Management", "SLA Tracking", "Canned Responses", "Knowledge Base", "Team Collaboration"],
    benefits: ["Improve response times", "Reduce ticket backlog", "Scale support easily"],
    pricing: {"basic": "$29/mo", "pro": "$79/mo", "enterprise": "$149/mo"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "ticket",
    href: "/services/microsaas-ticket-desk",
    stage: "published",
  },
  {
    id: 'microsaas-review-tracker',
    title: 'ReviewTracker - Review Management',
    category: 'micro-saas',
    industry: 'Marketing',
    description: 'Monitor and respond to online reviews across Google, Yelp, Trustpilot, and industry-specific platforms. AI-suggested responses and sentiment tracking.',
    features: ["Multi-platform Monitoring", "AI Response Suggestions", "Sentiment Tracking", "Review Widget", "Analytics Dashboard"],
    benefits: ["Boost online reputation", "Save time on responses", "Track sentiment trends"],
    pricing: {"basic": "$25/mo", "pro": "$69/mo", "enterprise": "$129/mo"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "star",
    href: "/services/microsaas-review-tracker",
    stage: "published",
  },
];

export const wave183ItServices: Service[] = [
  {
    id: 'it-disaster-recovery-planning',
    title: 'IT Disaster Recovery Planning',
    category: 'it',
    industry: 'IT Services',
    description: 'Comprehensive disaster recovery assessment, planning, and implementation service. Includes RTO/RPO analysis, backup strategy design, failover testing.',
    features: ["RTO/RPO Analysis", "Backup Strategy", "Failover Testing", "DR Runbooks", "Compliance Mapping"],
    benefits: ["Minimize downtime", "Ensure business continuity", "Meet compliance requirements"],
    pricing: {"basic": "$2,500/project", "pro": "$7,500/project", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "shield",
    href: "/services/it-disaster-recovery-planning",
    stage: "published",
  },
];

export const wave183SecurityServices: Service[] = [
  {
    id: 'security-application-security-audit',
    title: 'Application Security Audit',
    category: 'security',
    industry: 'Cybersecurity',
    description: 'In-depth application security assessment covering OWASP Top 10, API security, authentication flows, and data protection.',
    features: ["OWASP Top 10 Analysis", "API Security Testing", "Manual Pentest", "Automated Scanning", "Remediation Roadmap"],
    benefits: ["Identify vulnerabilities", "Protect customer data", "Achieve compliance"],
    pricing: {"basic": "$3,000/project", "pro": "$8,000/project", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "lock",
    href: "/services/security-application-security-audit",
    stage: "published",
  },
];

export const wave183CloudServices: Service[] = [
  {
    id: 'cloud-container-platform',
    title: 'Managed Kubernetes Platform',
    category: 'cloud',
    industry: 'Cloud Infrastructure',
    description: 'Fully managed Kubernetes platform with automated scaling, monitoring, and security. Includes Helm charts, service mesh, and CI/CD pipeline integration.',
    features: ["Managed K8s Clusters", "Auto-scaling", "Monitoring & Alerts", "Service Mesh", "CI/CD Integration"],
    benefits: ["Reduce ops burden", "Auto-scale on demand", "Built-in security"],
    pricing: {"basic": "$349/mo", "pro": "$999/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "dcos",
    href: "/services/cloud-container-platform",
    stage: "published",
  },
];

export const wave183DataServices: Service[] = [
  {
    id: 'data-metadata-management',
    title: 'Enterprise Metadata Management',
    category: 'data',
    industry: 'Data Governance',
    description: 'Centralized metadata management platform with data cataloging, glossary management, and lineage tracking. Supports 50+ data sources.',
    features: ["Data Catalog", "Business Glossary", "Lineage Tracking", "Impact Analysis", "Tagging & Classification"],
    benefits: ["Find data faster", "Understand data lineage", "Improve governance"],
    pricing: {"basic": "$399/mo", "pro": "$1,099/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "database",
    href: "/services/data-metadata-management",
    stage: "published",
  },
];

export const wave183AutomationServices: Service[] = [
  {
    id: 'automation-digital-process-automation',
    title: 'Digital Process Automation Platform',
    category: 'automation',
    industry: 'Business Process',
    description: 'Low-code digital process automation platform for transforming paper-based and manual workflows into streamlined digital processes.',
    features: ["Low-code Designer", "Form Builder", "Workflow Automation", "E-signatures", "Analytics"],
    benefits: ["Eliminate manual work", "Reduce errors", "Speed up approvals"],
    pricing: {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "workflow",
    href: "/services/automation-digital-process-automation",
    stage: "published",
  },
];
