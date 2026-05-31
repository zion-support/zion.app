const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  // AI & Machine Learning (5)
  {
    id: "ai-emotional-intelligence-platform",
    title: "AI Emotional Intelligence Platform",
    description: "Advanced emotional intelligence AI that analyzes customer sentiment, tone, and emotions across all communication channels to improve customer relationships and satisfaction.",
    icon: "💝",
    features: ["Sentiment analysis", "Emotion detection", "Tone matching", "Empathy scoring", "Conflict resolution", "Customer satisfaction tracking"],
    pricing: { basic: "799", pro: "1999", enterprise: "4999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/ai-emotional-intelligence-platform",
    category: "ai",
    popular: true,
    industry: "Customer Service"
  },
  {
    id: "ai-conversation-analytics-suite",
    title: "AI Conversation Analytics Suite",
    description: "Deep learning analytics for all business conversations including emails, chats, and calls with actionable insights and performance metrics.",
    icon: "📊",
    features: ["Multi-channel analysis", "Conversation scoring", "Trend detection", "Performance dashboards", "AI recommendations", "Real-time alerts"],
    pricing: { basic: "599", pro: "1499", enterprise: "3799" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/ai-conversation-analytics-suite",
    category: "ai",
    popular: false,
    industry: "Analytics"
  },
  {
    id: "ai-meeting-intelligence-assistant",
    title: "AI Meeting Intelligence Assistant",
    description: "Automatic meeting transcription, summarization, action item extraction, and follow-up scheduling with calendar integration.",
    icon: "📅",
    features: ["Auto-transcription", "Smart summaries", "Action item extraction", "Calendar sync", "Follow-up automation", "Meeting analytics"],
    pricing: { basic: "299", pro: "799", enterprise: "1999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/ai-meeting-intelligence-assistant",
    category: "ai",
    popular: true,
    industry: "Productivity"
  },
  {
    id: "ai-document-understanding-engine",
    title: "AI Document Understanding Engine",
    description: "Advanced document processing with semantic understanding, data extraction, classification, and intelligent search across all document types.",
    icon: "📄",
    features: ["Semantic search", "Data extraction", "Auto-classification", "OCR with context", "Multi-format support", "Knowledge graphs"],
    pricing: { basic: "499", pro: "1299", enterprise: "3299" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/ai-document-understanding-engine",
    category: "ai",
    popular: false,
    industry: "Document Management"
  },
  {
    id: "ai-workflow-automation-builder",
    title: "AI Workflow Automation Builder",
    description: "Visual workflow builder with AI-powered automation, conditional logic, and 500+ app integrations for complex business processes.",
    icon: "🔄",
    features: ["Visual designer", "AI suggestions", "Conditional logic", "500+ integrations", "Template library", "Performance monitoring"],
    pricing: { basic: "699", pro: "1799", enterprise: "4499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/ai-workflow-automation-builder",
    category: "ai",
    popular: true,
    industry: "Automation"
  },

  // Security & Compliance (5)
  {
    id: "security-compliance-guardian-pro",
    title: "Security Compliance Guardian Pro",
    description: "Real-time compliance monitoring for GDPR, HIPAA, SOC2, PCI-DSS with automated audit trails, violation detection, and remediation workflows.",
    icon: "🛡️",
    features: ["Multi-regulation support", "Real-time monitoring", "Auto-audit trails", "Violation alerts", "Remediation workflows", "Compliance reports"],
    pricing: { basic: "1299", pro: "3499", enterprise: "8999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/security-compliance-guardian-pro",
    category: "security",
    popular: true,
    industry: "Compliance"
  },
  {
    id: "security-advanced-dlp",
    title: "Advanced Data Loss Prevention",
    description: "Enterprise-grade DLP solution with AI-powered sensitive data detection, automatic redaction, and policy enforcement across all channels.",
    icon: "🔒",
    features: ["Sensitive data detection", "Auto-redaction", "Policy enforcement", "Multi-channel protection", "Incident response", "Compliance reporting"],
    pricing: { basic: "999", pro: "2499", enterprise: "6999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/security-advanced-dlp",
    category: "security",
    popular: false,
    industry: "Security"
  },
  {
    id: "security-threat-intelligence-platform",
    title: "Threat Intelligence Platform",
    description: "Real-time threat intelligence with AI-powered threat detection, vulnerability scanning, and automated incident response.",
    icon: "🎯",
    features: ["Threat detection", "Vulnerability scanning", "Incident response", "Threat feeds", "Risk scoring", "Security analytics"],
    pricing: { basic: "1499", pro: "3999", enterprise: "9999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/security-threat-intelligence-platform",
    category: "security",
    popular: true,
    industry: "Cybersecurity"
  },
  {
    id: "security-identity-management-suite",
    title: "Identity & Access Management Suite",
    description: "Comprehensive IAM solution with multi-factor authentication, role-based access control, and privileged access management.",
    icon: "🔐",
    features: ["Multi-factor auth", "Role-based access", "Privileged access", "Single sign-on", "Audit logging", "Compliance monitoring"],
    pricing: { basic: "799", pro: "1999", enterprise: "5499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/security-identity-management-suite",
    category: "security",
    popular: false,
    industry: "Identity Management"
  },
  {
    id: "security-enterprise-encryption",
    title: "Enterprise Encryption Platform",
    description: "Quantum-resistant encryption for data at rest and in transit with key management, certificate automation, and compliance reporting.",
    icon: "🔑",
    features: ["Quantum-resistant", "Key management", "Certificate automation", "Data-at-rest encryption", "Transit encryption", "Compliance reports"],
    pricing: { basic: "899", pro: "2299", enterprise: "5999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/security-enterprise-encryption",
    category: "security",
    popular: false,
    industry: "Encryption"
  },

  // Cloud & DevOps (5)
  {
    id: "cloud-cost-optimization-engine",
    title: "Cloud Cost Optimization Engine",
    description: "AI-powered cloud cost optimization with resource right-sizing, reserved instance recommendations, and automated scaling policies.",
    icon: "💰",
    features: ["Cost analysis", "Resource optimization", "Reserved instances", "Auto-scaling", "Budget alerts", "Multi-cloud support"],
    pricing: { basic: "499", pro: "1299", enterprise: "3299" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/cloud-cost-optimization-engine",
    category: "cloud",
    popular: true,
    industry: "Cloud Computing"
  },
  {
    id: "cloud-kubernetes-management",
    title: "Kubernetes Management Platform",
    description: "Enterprise Kubernetes management with multi-cluster orchestration, auto-scaling, service mesh, and comprehensive monitoring.",
    icon: "☸️",
    features: ["Multi-cluster", "Auto-scaling", "Service mesh", "Monitoring", "Security policies", "Cost optimization"],
    pricing: { basic: "899", pro: "2299", enterprise: "5999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/cloud-kubernetes-management",
    category: "cloud",
    popular: true,
    industry: "Containerization"
  },
  {
    id: "cloud-serverless-framework-pro",
    title: "Serverless Framework Pro",
    description: "Production-ready serverless framework with deployment automation, monitoring, debugging, and cost optimization for AWS, Azure, and GCP.",
    icon: "⚡",
    features: ["Multi-cloud", "Deployment automation", "Monitoring", "Debugging tools", "Cost optimization", "Security scanning"],
    pricing: { basic: "399", pro: "999", enterprise: "2499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/cloud-serverless-framework-pro",
    category: "cloud",
    popular: false,
    industry: "Serverless"
  },
  {
    id: "cloud-infrastructure-automation",
    title: "Infrastructure as Code Automation",
    description: "Automated infrastructure provisioning with Terraform, CloudFormation, and Pulumi with drift detection and compliance validation.",
    icon: "🏗️",
    features: ["Multi-provider", "Drift detection", "Compliance validation", "Auto-remediation", "Cost estimation", "Security scanning"],
    pricing: { basic: "699", pro: "1799", enterprise: "4499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/cloud-infrastructure-automation",
    category: "cloud",
    popular: false,
    industry: "DevOps"
  },
  {
    id: "cloud-disaster-recovery-platform",
    title: "Cloud Disaster Recovery Platform",
    description: "Automated disaster recovery with continuous replication, instant failover, RPO/RTO guarantees, and compliance reporting.",
    icon: "🔄",
    features: ["Continuous replication", "Instant failover", "RPO/RTO guarantees", "Testing automation", "Compliance reports", "Multi-region"],
    pricing: { basic: "999", pro: "2499", enterprise: "6999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/cloud-disaster-recovery-platform",
    category: "cloud",
    popular: true,
    industry: "Disaster Recovery"
  },

  // Data & Analytics (5)
  {
    id: "data-real-time-analytics-platform",
    title: "Real-Time Analytics Platform",
    description: "Stream processing and real-time analytics with sub-second latency, complex event processing, and interactive dashboards.",
    icon: "📈",
    features: ["Stream processing", "Sub-second latency", "Complex events", "Interactive dashboards", "Alerting", "ML integration"],
    pricing: { basic: "799", pro: "1999", enterprise: "4999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/data-real-time-analytics-platform",
    category: "data",
    popular: true,
    industry: "Analytics"
  },
  {
    id: "data-lake-management-suite",
    title: "Data Lake Management Suite",
    description: "Enterprise data lake management with automated ingestion, data quality monitoring, cataloging, and governance.",
    icon: "🏊",
    features: ["Auto-ingestion", "Data quality", "Cataloging", "Governance", "Lineage tracking", "Cost optimization"],
    pricing: { basic: "899", pro: "2299", enterprise: "5999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/data-lake-management-suite",
    category: "data",
    popular: false,
    industry: "Data Management"
  },
  {
    id: "data-privacy-consent-platform",
    title: "Data Privacy & Consent Platform",
    description: "Comprehensive data privacy management with consent tracking, data subject requests, and automated compliance reporting.",
    icon: "🔐",
    features: ["Consent management", "DSR automation", "Data mapping", "Privacy policies", "Compliance reports", "Risk assessment"],
    pricing: { basic: "699", pro: "1799", enterprise: "4499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/data-privacy-consent-platform",
    category: "data",
    popular: false,
    industry: "Privacy"
  },
  {
    id: "data-pipeline-orchestration",
    title: "Data Pipeline Orchestration",
    description: "Visual data pipeline builder with drag-and-drop interface, scheduling, monitoring, and automated error handling.",
    icon: "🔀",
    features: ["Visual builder", "Scheduling", "Monitoring", "Error handling", "Version control", "Multi-source support"],
    pricing: { basic: "599", pro: "1499", enterprise: "3799" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/data-pipeline-orchestration",
    category: "data",
    popular: false,
    industry: "Data Engineering"
  },
  {
    id: "data-ml-feature-store",
    title: "ML Feature Store Platform",
    description: "Centralized feature store for machine learning with feature sharing, versioning, and real-time serving for production models.",
    icon: "🧠",
    features: ["Feature sharing", "Versioning", "Real-time serving", "Batch processing", "Monitoring", "Lineage tracking"],
    pricing: { basic: "799", pro: "1999", enterprise: "4999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/data-ml-feature-store",
    category: "data",
    popular: true,
    industry: "Machine Learning"
  },

  // Micro-SaaS & Productivity (5)
  {
    id: "saas-customer-success-platform",
    title: "Customer Success Platform",
    description: "Proactive customer success management with health scoring, automated workflows, churn prediction, and expansion opportunities.",
    icon: "🌟",
    features: ["Health scoring", "Automated workflows", "Churn prediction", "Expansion tracking", "Playbooks", "Analytics"],
    pricing: { basic: "499", pro: "1299", enterprise: "3299" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/saas-customer-success-platform",
    category: "micro-saas",
    popular: true,
    industry: "Customer Success"
  },
  {
    id: "saas-ai-knowledge-base",
    title: "AI Knowledge Base Builder",
    description: "Self-service knowledge base with AI-powered search, auto-generated articles, and continuous learning from support tickets.",
    icon: "📚",
    features: ["AI search", "Auto-articles", "Learning system", "Multi-format", "Analytics", "Integration hub"],
    pricing: { basic: "299", pro: "799", enterprise: "1999" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/saas-ai-knowledge-base",
    category: "micro-saas",
    popular: true,
    industry: "Knowledge Management"
  },
  {
    id: "saas-customer-feedback-management",
    title: "Customer Feedback Management",
    description: "Collect, analyze, and act on customer feedback with NPS, CSAT, and sentiment analysis across all touchpoints.",
    icon: "💬",
    features: ["NPS surveys", "CSAT tracking", "Sentiment analysis", "Feedback loops", "Action items", "Reporting"],
    pricing: { basic: "199", pro: "499", enterprise: "1299" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/saas-customer-feedback-management",
    category: "micro-saas",
    popular: false,
    industry: "Customer Experience"
  },
  {
    id: "saas-ai-project-management",
    title: "AI Project Management Suite",
    description: "Intelligent project management with AI-powered resource allocation, risk prediction, and automated status reporting.",
    icon: "📋",
    features: ["AI resource allocation", "Risk prediction", "Auto-reporting", "Timeline optimization", "Team analytics", "Integration"],
    pricing: { basic: "399", pro: "999", enterprise: "2499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/saas-ai-project-management",
    category: "micro-saas",
    popular: true,
    industry: "Project Management"
  },
  {
    id: "saas-team-collaboration-hub",
    title: "Team Collaboration Hub Pro",
    description: "Unified team collaboration with real-time messaging, video conferencing, file sharing, and project coordination in one platform.",
    icon: "👥",
    features: ["Real-time messaging", "Video conferencing", "File sharing", "Project coordination", "Integrations", "Mobile apps"],
    pricing: { basic: "249", pro: "599", enterprise: "1499" },
    contactInfo: { mobile: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown, DE 19709" },
    href: "/services/saas-team-collaboration-hub",
    category: "micro-saas",
    popular: false,
    industry: "Collaboration"
  }
];

// Add new services to existing array
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`✅ Added ${newServices.length} new services`);
console.log(`📊 Total services: ${services.length}`);
console.log(`🚀 V596-V600 batch complete!`);
