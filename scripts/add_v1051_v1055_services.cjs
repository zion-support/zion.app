const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'app', 'data', 'servicesData.json');
const services = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const contactInfo = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown DE 19709'
};

const newServices = [
  // V1051: AI Email Negotiation Coach
  {
    id: 'ai-email-negotiation-coach',
    name: "AI Email Negotiation Coach",
    category: "AI Services",
    description: "Real-time coaching during business negotiations. Analyzes counterpart's language patterns and leverage points. Suggests optimal counter-offers and timing strategies.",
    price: "$699/month",
    features: ["Real-time leverage analysis", "Counter-offer suggestions", "Objection handling coaching", "Closing signal detection", "Timing recommendations", "Negotiation stage tracking"],
    icon: '🤝',
    link: '/services/ai-email-negotiation-coach',
    contactInfo
  },
  {
    id: 'sales-deal-accelerator',
    name: "Sales Deal Accelerator",
    category: "AI Services",
    description: "Identify patterns that accelerate deal closure. Get real-time recommendations to move prospects through your sales funnel faster with AI-powered insights.",
    price: "$749/month",
    features: ["Deal velocity optimization", "Acceleration pattern detection", "Real-time recommendations", "Bottleneck identification", "Closing trigger alerts", "Sales funnel analytics"],
    icon: '🚀',
    link: '/services/sales-deal-accelerator',
    contactInfo
  },
  {
    id: 'contract-negotiation-assistant',
    name: "Contract Negotiation Assistant",
    category: "AI Services",
    description: "AI-powered assistance for contract negotiations. Analyze terms, suggest redlines, and ensure favorable outcomes while maintaining relationships.",
    price: "$899/month",
    features: ["Contract term analysis", "Redline suggestions", "Risk assessment", "Precedent matching", "Clause optimization", "Negotiation strategy"],
    icon: '📝',
    link: '/services/contract-negotiation-assistant',
    contactInfo
  },
  {
    id: 'pricing-strategy-optimizer',
    name: "Pricing Strategy Optimizer",
    category: "AI Services",
    description: "Optimize pricing strategies based on negotiation history, market data, and customer segments. Maximize revenue while maintaining competitiveness.",
    price: "$649/month",
    features: ["Dynamic pricing analysis", "Competitor benchmarking", "Customer segment optimization", "Discount strategy", "Revenue maximization", "Margin protection"],
    icon: '💲',
    link: '/services/pricing-strategy-optimizer',
    contactInfo
  },
  {
    id: 'vendor-negotiation-manager',
    name: "Vendor Negotiation Manager",
    category: "AI Services",
    description: "Manage vendor negotiations with AI-powered insights. Track vendor performance, compare offers, and negotiate better terms automatically.",
    price: "$599/month",
    features: ["Vendor performance tracking", "Offer comparison", "Term negotiation", "SLA optimization", "Cost reduction strategies", "Relationship management"],
    icon: '🏢',
    link: '/services/vendor-negotiation-manager',
    contactInfo
  },

  // V1052: Email Workflow Automation Architect
  {
    id: 'email-workflow-automation-architect',
    name: "Email Workflow Automation Architect",
    category: "Automation Services",
    description: "Automatically creates multi-step workflows from email conversations. Triggers actions across apps with conditional logic and native integrations.",
    price: "$549/month",
    features: ["Multi-step workflow creation", "Conditional logic", "Cross-app triggers", "Template-based automation", "Native integrations", "Workflow optimization"],
    icon: '⚙️',
    link: '/services/email-workflow-automation-architect',
    contactInfo
  },
  {
    id: 'zapier-email-integration-pro',
    name: "Zapier Email Integration Pro",
    category: "Automation Services",
    description: "Advanced Zapier integration for email workflows. Create complex multi-step zaps triggered by email content, sender, or metadata.",
    price: "$449/month",
    features: ["Advanced Zapier integration", "Multi-step zaps", "Conditional triggers", "Email content parsing", "Webhook support", "Error handling"],
    icon: '⚡',
    link: '/services/zapier-email-integration-pro',
    contactInfo
  },
  {
    id: 'make-com-email-automation',
    name: "Make.com Email Automation",
    category: "Automation Services",
    description: "Build sophisticated email automation scenarios with Make.com. Visual workflow builder with advanced logic and error recovery.",
    price: "$479/month",
    features: ["Visual scenario builder", "Advanced logic flows", "Error recovery", "Data transformation", "API orchestration", "Monitoring dashboard"],
    icon: '🔧',
    link: '/services/make-com-email-automation',
    contactInfo
  },
  {
    id: 'slack-email-bridge',
    name: "Slack Email Bridge",
    category: "Automation Services",
    description: "Seamlessly bridge email conversations to Slack channels. Auto-route emails to appropriate channels and enable Slack-based email responses.",
    price: "$349/month",
    features: ["Email-to-Slack routing", "Channel auto-assignment", "Slack-based replies", "Thread synchronization", "Notification management", "Search integration"],
    icon: '💬',
    link: '/services/slack-email-bridge',
    contactInfo
  },
  {
    id: 'crm-email-workflow-builder',
    name: "CRM Email Workflow Builder",
    category: "Automation Services",
    description: "Build automated workflows between email and CRM systems. Sync contacts, update deals, and trigger actions based on email interactions.",
    price: "$529/month",
    features: ["CRM synchronization", "Deal stage automation", "Contact enrichment", "Activity logging", "Pipeline triggers", "Reporting integration"],
    icon: '🎯',
    link: '/services/crm-email-workflow-builder',
    contactInfo
  },

  // V1053: AI Email Compliance Guardian Pro
  {
    id: 'ai-email-compliance-guardian-pro',
    name: "AI Email Compliance Guardian Pro",
    category: "Compliance Services",
    description: "Industry-specific compliance checking for HIPAA, GDPR, SOX, PCI-DSS, and FINRA. Auto-redaction of sensitive data with tamper-proof audit trails.",
    price: "$899/month",
    features: ["Multi-framework compliance", "Auto-redaction", "Audit trail generation", "Real-time alerts", "Disclaimer management", "Regulatory updates"],
    icon: '🛡️',
    link: '/services/ai-email-compliance-guardian-pro',
    contactInfo
  },
  {
    id: 'hipaa-email-compliance',
    name: "HIPAA Email Compliance",
    category: "Compliance Services",
    description: "Ensure all healthcare email communications meet HIPAA requirements. Detect PHI, enforce encryption, and maintain audit logs.",
    price: "$799/month",
    features: ["PHI detection", "Encryption enforcement", "Audit logging", "BAA compliance", "Breach prevention", "Staff training alerts"],
    icon: '🏥',
    link: '/services/hipaa-email-compliance',
    contactInfo
  },
  {
    id: 'gdpr-email-guardian',
    name: "GDPR Email Guardian",
    category: "Compliance Services",
    description: "Protect EU citizen data in email communications. Detect personal data, manage consent, and ensure GDPR compliance across all email interactions.",
    price: "$749/month",
    features: ["Personal data detection", "Consent management", "Data residency checks", "Right to erasure support", "DPO notifications", "Compliance reporting"],
    icon: '🇪🇺',
    link: '/services/gdpr-email-guardian',
    contactInfo
  },
  {
    id: 'financial-compliance-scanner',
    name: "Financial Compliance Scanner",
    category: "Compliance Services",
    description: "Ensure financial services emails meet SOX, PCI-DSS, and FINRA requirements. Detect prohibited language and enforce disclosure requirements.",
    price: "$849/month",
    features: ["SOX compliance", "PCI-DSS scanning", "FINRA rule enforcement", "Disclosure management", "Audit trail", "Regulatory reporting"],
    icon: '💰',
    link: '/services/financial-compliance-scanner',
    contactInfo
  },
  {
    id: 'data-loss-prevention-email',
    name: "Data Loss Prevention for Email",
    category: "Security Services",
    description: "Prevent sensitive data from leaving your organization via email. Detect credentials, PII, and confidential information before sending.",
    price: "$699/month",
    features: ["Sensitive data detection", "Credential scanning", "PII protection", "Policy enforcement", "Quarantine workflow", "Incident reporting"],
    icon: '🔒',
    link: '/services/data-loss-prevention-email',
    contactInfo
  },

  // V1054: Email Intelligence API Platform
  {
    id: 'email-intelligence-api-platform',
    name: "Email Intelligence API Platform",
    category: "AI Services",
    description: "Expose all email intelligence features as RESTful APIs. Webhook support, SDK for multiple languages, rate limiting, and usage analytics.",
    price: "$799/month",
    features: ["RESTful API access", "Webhook support", "Multi-language SDKs", "Rate limiting", "Usage analytics", "Authentication"],
    icon: '🔌',
    link: '/services/email-intelligence-api-platform',
    contactInfo
  },
  {
    id: 'email-analysis-api',
    name: "Email Analysis API",
    category: "AI Services",
    description: "API for email sentiment analysis, urgency detection, and routing recommendations. Process thousands of emails per minute with enterprise-grade reliability.",
    price: "$599/month",
    features: ["Sentiment analysis API", "Urgency detection", "Routing recommendations", "Batch processing", "Real-time streaming", "99.9% uptime SLA"],
    icon: '📊',
    link: '/services/email-analysis-api',
    contactInfo
  },
  {
    id: 'email-translation-api',
    name: "Email Translation API",
    category: "AI Services",
    description: "High-quality email translation API supporting 50+ languages. Preserve tone, context, and business terminology across translations.",
    price: "$649/month",
    features: ["50+ language support", "Context preservation", "Business terminology", "Quality scoring", "Batch translation", "Glossary management"],
    icon: '🌐',
    link: '/services/email-translation-api',
    contactInfo
  },
  {
    id: 'compliance-check-api',
    name: "Compliance Check API",
    category: "AI Services",
    description: "API for checking email compliance against multiple frameworks. Real-time validation with detailed violation reports and auto-redaction.",
    price: "$699/month",
    features: ["Multi-framework checking", "Real-time validation", "Violation reporting", "Auto-redaction API", "Audit trail API", "Custom rules"],
    icon: '✅',
    link: '/services/compliance-check-api',
    contactInfo
  },
  {
    id: 'email-webhook-service',
    name: "Email Webhook Service",
    category: "IT Services",
    description: "Real-time webhooks for email events. Get instant notifications for sentiment changes, compliance violations, and workflow triggers.",
    price: "$449/month",
    features: ["Real-time webhooks", "Event filtering", "Retry logic", "Payload signing", "Delivery guarantees", "Monitoring dashboard"],
    icon: '🪝',
    link: '/services/email-webhook-service',
    contactInfo
  },

  // V1055: AI Email Performance Analytics Dashboard
  {
    id: 'ai-email-performance-analytics',
    name: "AI Email Performance Analytics Dashboard",
    category: "Analytics Services",
    description: "Comprehensive analytics on email effectiveness. Response time tracking, conversion rates, team performance, and predictive insights.",
    price: "$499/month",
    features: ["Response time tracking", "Conversion analytics", "Team performance", "Predictive insights", "A/B testing", "Custom dashboards"],
    icon: '📈',
    link: '/services/ai-email-performance-analytics',
    contactInfo
  },
  {
    id: 'email-roi-tracker',
    name: "Email ROI Tracker",
    category: "Analytics Services",
    description: "Track the true return on investment for email communications. Measure revenue per email, campaign effectiveness, and team productivity.",
    price: "$549/month",
    features: ["Revenue attribution", "Campaign ROI", "Productivity metrics", "Cost analysis", "Trend reporting", "Benchmarking"],
    icon: '💵',
    link: '/services/email-roi-tracker',
    contactInfo
  },
  {
    id: 'team-email-analytics',
    name: "Team Email Analytics",
    category: "Analytics Services",
    description: "Analyze team email performance with detailed metrics. Track response times, satisfaction scores, workload distribution, and improvement areas.",
    price: "$429/month",
    features: ["Team performance metrics", "Response time analysis", "Satisfaction tracking", "Workload distribution", "Improvement insights", "Leaderboards"],
    icon: '👥',
    link: '/services/team-email-analytics',
    contactInfo
  },
  {
    id: 'email-ab-testing-platform',
    name: "Email A/B Testing Platform",
    category: "Analytics Services",
    description: "Test subject lines, send times, and content variations. Get statistically significant results with automated winner selection.",
    price: "$399/month",
    features: ["Subject line testing", "Send time optimization", "Content variations", "Statistical significance", "Auto-winner selection", "Results reporting"],
    icon: '🧪',
    link: '/services/email-ab-testing-platform',
    contactInfo
  },
  {
    id: 'predictive-email-insights',
    name: "Predictive Email Insights",
    category: "AI Services",
    description: "AI-powered predictions for email performance. Forecast open rates, reply rates, and conversions. Identify at-risk contacts and upsell opportunities.",
    price: "$599/month",
    features: ["Performance forecasting", "Risk identification", "Opportunity detection", "Best time predictions", "Churn warnings", "Revenue projections"],
    icon: '🔮',
    link: '/services/predictive-email-insights',
    contactInfo
  }
];

services.push(...newServices);
fs.writeFileSync(dataPath, JSON.stringify(services, null, 2));
console.log(`Added ${newServices.length} new services. Total: ${services.length}`);
