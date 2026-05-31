const fs = require('fs');

// Read existing services
const servicesPath = './app/data/servicesData.json';
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

// New services for V586-V590
const newServices = [
  // AI/ML Services (5)
  {
    "id": "ai-document-classifier",
    "title": "AI Document Classifier",
    "description": "Automatically classify and categorize documents using machine learning models. Supports PDFs, Word docs, and emails with 95% accuracy.",
    "icon": "📄",
    "features": ["ML-powered classification", "Multi-format support", "Custom categories", "Batch processing"],
    "benefits": ["Reduce manual sorting time by 90%", "Improve document organization", "Automate filing workflows"],
    "pricing": { "basic": "299", "pro": "799", "enterprise": "1999" },
    "contactInfo": { "website": "/services/ai-document-classifier", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/ai-document-classifier",
    "category": "ai",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "ai-sentiment-analyzer",
    "title": "AI Sentiment Analyzer Pro",
    "description": "Advanced sentiment analysis for customer feedback, reviews, and social media. Detects emotions, sarcasm, and context with 92% accuracy.",
    "icon": "😊",
    "features": ["Multi-language support", "Emotion detection", "Sarcasm recognition", "Real-time analysis"],
    "benefits": ["Understand customer sentiment instantly", "Identify issues before they escalate", "Track brand perception"],
    "pricing": { "basic": "399", "pro": "999", "enterprise": "2499" },
    "contactInfo": { "website": "/services/ai-sentiment-analyzer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/ai-sentiment-analyzer",
    "category": "ai",
    "popular": true,
    "industry": "Technology"
  },
  {
    "id": "ai-text-summarizer",
    "title": "AI Text Summarizer",
    "description": "Generate concise summaries of long documents, articles, and reports. Preserves key information while reducing content by 70-80%.",
    "icon": "📝",
    "features": ["Extractive & abstractive summarization", "Custom summary length", "Multi-document support", "Key point extraction"],
    "benefits": ["Save hours of reading time", "Quick overview of lengthy content", "Improve information retention"],
    "pricing": { "basic": "249", "pro": "699", "enterprise": "1799" },
    "contactInfo": { "website": "/services/ai-text-summarizer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/ai-text-summarizer",
    "category": "ai",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "ai-language-translator",
    "title": "AI Language Translator Pro",
    "description": "Enterprise-grade translation service supporting 100+ languages with context-aware translations and industry-specific terminology.",
    "icon": "🌐",
    "features": ["100+ languages", "Context-aware translation", "Industry terminology", "Real-time translation"],
    "benefits": ["Break language barriers instantly", "Maintain brand voice across languages", "Support global operations"],
    "pricing": { "basic": "349", "pro": "899", "enterprise": "2299" },
    "contactInfo": { "website": "/services/ai-language-translator", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/ai-language-translator",
    "category": "ai",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "ai-code-reviewer",
    "title": "AI Code Review Assistant",
    "description": "Automated code review tool that detects bugs, security vulnerabilities, and code quality issues. Supports 20+ programming languages.",
    "icon": "💻",
    "features": ["Bug detection", "Security scanning", "Code quality analysis", "20+ languages"],
    "benefits": ["Catch bugs before deployment", "Improve code quality", "Reduce security risks"],
    "pricing": { "basic": "449", "pro": "1199", "enterprise": "2999" },
    "contactInfo": { "website": "/services/ai-code-reviewer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/ai-code-reviewer",
    "category": "ai",
    "popular": true,
    "industry": "Technology"
  },

  // Security Services (5)
  {
    "id": "security-vulnerability-scanner",
    "title": "Security Vulnerability Scanner",
    "description": "Comprehensive vulnerability scanning for web applications, APIs, and infrastructure. Identifies OWASP Top 10 and CVEs.",
    "icon": "🔍",
    "features": ["OWASP Top 10 detection", "CVE database", "API scanning", "Automated reports"],
    "benefits": ["Identify vulnerabilities early", "Prevent security breaches", "Compliance reporting"],
    "pricing": { "basic": "599", "pro": "1499", "enterprise": "3999" },
    "contactInfo": { "website": "/services/security-vulnerability-scanner", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/security-vulnerability-scanner",
    "category": "security",
    "popular": true,
    "industry": "Security"
  },
  {
    "id": "security-penetration-testing",
    "title": "Penetration Testing Service",
    "description": "Professional penetration testing with ethical hackers. Simulates real-world attacks to identify security weaknesses.",
    "icon": "🛡️",
    "features": ["Black/white/gray box testing", "Web & network testing", "Social engineering", "Detailed reports"],
    "benefits": ["Discover vulnerabilities before attackers", "Validate security controls", "Meet compliance requirements"],
    "pricing": { "basic": "2999", "pro": "7999", "enterprise": "19999" },
    "contactInfo": { "website": "/services/security-penetration-testing", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/security-penetration-testing",
    "category": "security",
    "popular": false,
    "industry": "Security"
  },
  {
    "id": "security-encryption-service",
    "title": "Enterprise Encryption Service",
    "description": "End-to-end encryption for emails, files, and databases. AES-256 encryption with key management and compliance.",
    "icon": "🔐",
    "features": ["AES-256 encryption", "Key management", "Database encryption", "Compliance ready"],
    "benefits": ["Protect sensitive data", "Meet regulatory requirements", "Prevent data breaches"],
    "pricing": { "basic": "499", "pro": "1299", "enterprise": "3299" },
    "contactInfo": { "website": "/services/security-encryption-service", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/security-encryption-service",
    "category": "security",
    "popular": false,
    "industry": "Security"
  },
  {
    "id": "security-identity-management",
    "title": "Identity & Access Management",
    "description": "Comprehensive IAM solution with SSO, MFA, and role-based access control. Manage user identities across all applications.",
    "icon": "👤",
    "features": ["Single Sign-On", "Multi-factor auth", "RBAC", "User provisioning"],
    "benefits": ["Improve security posture", "Simplify user management", "Reduce password fatigue"],
    "pricing": { "basic": "699", "pro": "1799", "enterprise": "4499" },
    "contactInfo": { "website": "/services/security-identity-management", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/security-identity-management",
    "category": "security",
    "popular": true,
    "industry": "Security"
  },
  {
    "id": "security-compliance-monitor",
    "title": "Compliance Monitoring Platform",
    "description": "Continuous compliance monitoring for GDPR, HIPAA, SOC2, ISO27001. Automated audits and real-time compliance scoring.",
    "icon": "✓",
    "features": ["Multi-framework support", "Automated audits", "Real-time scoring", "Remediation guidance"],
    "benefits": ["Maintain compliance continuously", "Reduce audit preparation time", "Avoid compliance penalties"],
    "pricing": { "basic": "899", "pro": "2299", "enterprise": "5999" },
    "contactInfo": { "website": "/services/security-compliance-monitor", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/security-compliance-monitor",
    "category": "security",
    "popular": false,
    "industry": "Security"
  },

  // Productivity Services (5)
  {
    "id": "productivity-task-automation",
    "title": "Task Automation Platform",
    "description": "Automate repetitive tasks with no-code workflows. Connect 500+ apps and automate processes without programming.",
    "icon": "⚡",
    "features": ["No-code builder", "500+ integrations", "Conditional logic", "Scheduled tasks"],
    "benefits": ["Save 10+ hours per week", "Eliminate manual errors", "Scale operations efficiently"],
    "pricing": { "basic": "199", "pro": "599", "enterprise": "1499" },
    "contactInfo": { "website": "/services/productivity-task-automation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/productivity-task-automation",
    "category": "productivity",
    "popular": true,
    "industry": "Business"
  },
  {
    "id": "productivity-time-tracker",
    "title": "Smart Time Tracker",
    "description": "AI-powered time tracking with automatic activity detection, productivity insights, and team management features.",
    "icon": "⏱️",
    "features": ["Auto time tracking", "Activity detection", "Productivity reports", "Team dashboard"],
    "benefits": ["Understand time usage", "Improve productivity", "Accurate billing"],
    "pricing": { "basic": "149", "pro": "399", "enterprise": "999" },
    "contactInfo": { "website": "/services/productivity-time-tracker", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/productivity-time-tracker",
    "category": "productivity",
    "popular": false,
    "industry": "Business"
  },
  {
    "id": "productivity-meeting-scheduler",
    "title": "AI Meeting Scheduler",
    "description": "Intelligent meeting scheduling that finds optimal times across time zones, manages conflicts, and sends smart reminders.",
    "icon": "📅",
    "features": ["Time zone optimization", "Conflict resolution", "Smart reminders", "Calendar sync"],
    "benefits": ["Eliminate scheduling conflicts", "Save coordination time", "Reduce no-shows"],
    "pricing": { "basic": "129", "pro": "349", "enterprise": "899" },
    "contactInfo": { "website": "/services/productivity-meeting-scheduler", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/productivity-meeting-scheduler",
    "category": "productivity",
    "popular": false,
    "industry": "Business"
  },
  {
    "id": "productivity-document-collaboration",
    "title": "Real-time Document Collaboration",
    "description": "Collaborative document editing with real-time sync, version control, and advanced permissions. Works offline too.",
    "icon": "📋",
    "features": ["Real-time editing", "Version control", "Offline mode", "Advanced permissions"],
    "benefits": ["Collaborate seamlessly", "Never lose work", "Control document access"],
    "pricing": { "basic": "179", "pro": "499", "enterprise": "1299" },
    "contactInfo": { "website": "/services/productivity-document-collaboration", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/productivity-document-collaboration",
    "category": "productivity",
    "popular": true,
    "industry": "Business"
  },
  {
    "id": "productivity-workflow-optimizer",
    "title": "Workflow Optimization Engine",
    "description": "Analyze and optimize business workflows using process mining and AI. Identify bottlenecks and automate improvements.",
    "icon": "🔄",
    "features": ["Process mining", "Bottleneck detection", "AI optimization", "Performance metrics"],
    "benefits": ["Increase efficiency by 40%", "Reduce process time", "Data-driven decisions"],
    "pricing": { "basic": "599", "pro": "1499", "enterprise": "3999" },
    "contactInfo": { "website": "/services/productivity-workflow-optimizer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/productivity-workflow-optimizer",
    "category": "productivity",
    "popular": false,
    "industry": "Business"
  },

  // Analytics Services (5)
  {
    "id": "analytics-predictive-modeling",
    "title": "Predictive Analytics Platform",
    "description": "Build and deploy predictive models without coding. Forecast sales, churn, demand, and more with 85%+ accuracy.",
    "icon": "📊",
    "features": ["No-code model building", "Auto-ML", "Forecast accuracy 85%+", "Real-time predictions"],
    "benefits": ["Predict future trends", "Make data-driven decisions", "Gain competitive advantage"],
    "pricing": { "basic": "799", "pro": "1999", "enterprise": "4999" },
    "contactInfo": { "website": "/services/analytics-predictive-modeling", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/analytics-predictive-modeling",
    "category": "analytics",
    "popular": true,
    "industry": "Analytics"
  },
  {
    "id": "analytics-data-visualization",
    "title": "Advanced Data Visualization",
    "description": "Create stunning interactive dashboards and visualizations. 50+ chart types with real-time data updates.",
    "icon": "📈",
    "features": ["50+ chart types", "Real-time updates", "Interactive dashboards", "Custom themes"],
    "benefits": ["Visualize complex data", "Discover insights faster", "Share data stories"],
    "pricing": { "basic": "299", "pro": "799", "enterprise": "1999" },
    "contactInfo": { "website": "/services/analytics-data-visualization", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/analytics-data-visualization",
    "category": "analytics",
    "popular": true,
    "industry": "Analytics"
  },
  {
    "id": "analytics-customer-insights",
    "title": "Customer Insights Platform",
    "description": "360-degree customer analytics with behavioral tracking, segmentation, and lifetime value prediction.",
    "icon": "👥",
    "features": ["Behavioral tracking", "Customer segmentation", "CLV prediction", "Journey mapping"],
    "benefits": ["Understand customers deeply", "Personalize experiences", "Increase retention"],
    "pricing": { "basic": "599", "pro": "1499", "enterprise": "3999" },
    "contactInfo": { "website": "/services/analytics-customer-insights", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/analytics-customer-insights",
    "category": "analytics",
    "popular": false,
    "industry": "Analytics"
  },
  {
    "id": "analytics-real-time-monitoring",
    "title": "Real-time Analytics Monitoring",
    "description": "Monitor business metrics in real-time with customizable alerts, anomaly detection, and live dashboards.",
    "icon": "📡",
    "features": ["Real-time metrics", "Custom alerts", "Anomaly detection", "Live dashboards"],
    "benefits": ["React to issues instantly", "Prevent problems", "Stay informed 24/7"],
    "pricing": { "basic": "399", "pro": "999", "enterprise": "2499" },
    "contactInfo": { "website": "/services/analytics-real-time-monitoring", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/analytics-real-time-monitoring",
    "category": "analytics",
    "popular": false,
    "industry": "Analytics"
  },
  {
    "id": "analytics-business-intelligence",
    "title": "Business Intelligence Suite",
    "description": "Comprehensive BI platform with data warehousing, ETL, reporting, and advanced analytics in one solution.",
    "icon": "💼",
    "features": ["Data warehousing", "ETL pipelines", "Advanced reporting", "Self-service analytics"],
    "benefits": ["Single source of truth", "Empower decision makers", "Reduce IT dependency"],
    "pricing": { "basic": "999", "pro": "2499", "enterprise": "6999" },
    "contactInfo": { "website": "/services/analytics-business-intelligence", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/analytics-business-intelligence",
    "category": "analytics",
    "popular": true,
    "industry": "Analytics"
  },

  // Integration Services (5)
  {
    "id": "integration-api-gateway",
    "title": "API Gateway & Management",
    "description": "Enterprise API gateway with rate limiting, authentication, analytics, and developer portal. Manage 1000s of APIs.",
    "icon": "🔌",
    "features": ["Rate limiting", "OAuth2/JWT auth", "API analytics", "Developer portal"],
    "benefits": ["Secure API access", "Monitor API usage", "Enable developer ecosystem"],
    "pricing": { "basic": "499", "pro": "1299", "enterprise": "3299" },
    "contactInfo": { "website": "/services/integration-api-gateway", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/integration-api-gateway",
    "category": "integration",
    "popular": true,
    "industry": "Technology"
  },
  {
    "id": "integration-data-sync",
    "title": "Real-time Data Synchronization",
    "description": "Bi-directional data sync across databases, CRMs, ERPs, and cloud services. Conflict resolution included.",
    "icon": "🔄",
    "features": ["Bi-directional sync", "Conflict resolution", "100+ connectors", "Real-time updates"],
    "benefits": ["Eliminate data silos", "Ensure data consistency", "Real-time information"],
    "pricing": { "basic": "399", "pro": "999", "enterprise": "2499" },
    "contactInfo": { "website": "/services/integration-data-sync", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/integration-data-sync",
    "category": "integration",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "integration-webhook-manager",
    "title": "Webhook Management Platform",
    "description": "Manage, monitor, and debug webhooks at scale. Retry logic, payload transformation, and delivery guarantees.",
    "icon": "🪝",
    "features": ["Retry logic", "Payload transformation", "Delivery guarantees", "Debug tools"],
    "benefits": ["Reliable webhook delivery", "Easy debugging", "Scale webhooks easily"],
    "pricing": { "basic": "199", "pro": "599", "enterprise": "1499" },
    "contactInfo": { "website": "/services/integration-webhook-manager", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/integration-webhook-manager",
    "category": "integration",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "integration-microservices-mesh",
    "title": "Microservices Service Mesh",
    "description": "Service mesh for microservices with traffic management, security, observability, and policy enforcement.",
    "icon": "🕸️",
    "features": ["Traffic management", "mTLS security", "Observability", "Policy enforcement"],
    "benefits": ["Simplify microservices", "Improve reliability", "Enhance security"],
    "pricing": { "basic": "799", "pro": "1999", "enterprise": "4999" },
    "contactInfo": { "website": "/services/integration-microservices-mesh", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/integration-microservices-mesh",
    "category": "integration",
    "popular": false,
    "industry": "Technology"
  },
  {
    "id": "integration-etl-pipeline",
    "title": "ETL Pipeline Builder",
    "description": "Visual ETL pipeline builder with 200+ connectors. Extract, transform, and load data without coding.",
    "icon": "🔧",
    "features": ["Visual builder", "200+ connectors", "Data transformation", "Scheduling"],
    "benefits": ["Build pipelines faster", "No coding required", "Automate data workflows"],
    "pricing": { "basic": "449", "pro": "1199", "enterprise": "2999" },
    "contactInfo": { "website": "/services/integration-etl-pipeline", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950" },
    "href": "/services/integration-etl-pipeline",
    "category": "integration",
    "popular": true,
    "industry": "Technology"
  }
];

// Add new services to existing array
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`✅ Added ${newServices.length} new services. Total services: ${services.length}`);
