// Add V511-V515 services
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  // V511 - Crisis Communication Engine
  {
    id: "crisis-communication-basic",
    name: "Crisis Communication Basic",
    description: "Detect crisis signals from emails and classify severity levels (Watch to Emergency). Includes basic stakeholder identification and escalation chain setup.",
    category: "email-intelligence",
    price: "$99/mo",
    features: ["Crisis signal detection", "5 severity levels", "Stakeholder identification", "Basic escalation chains", "Crisis type classification"]
  },
  {
    id: "crisis-communication-pro",
    name: "Crisis Communication Pro",
    description: "Advanced crisis management with automated response templates for 8 stakeholder groups, real-time severity tracking, and post-crisis analysis.",
    category: "email-intelligence",
    price: "$249/mo",
    features: ["All Basic features", "8 stakeholder templates", "Real-time tracking", "Post-crisis analysis", "Multi-channel coordination"]
  },
  {
    id: "crisis-communication-enterprise",
    name: "Crisis Communication Enterprise",
    description: "Enterprise-grade crisis management with AI-powered response generation, automated media monitoring, and executive dashboard.",
    category: "email-intelligence",
    price: "$499/mo",
    features: ["All Pro features", "AI response generation", "Media monitoring", "Executive dashboard", "24/7 support"]
  },
  {
    id: "crisis-response-templates",
    name: "Crisis Response Templates",
    description: "Pre-built crisis response templates for customers, employees, investors, media, regulators, partners, board, and legal teams.",
    category: "email-intelligence",
    price: "$49/mo",
    features: ["8 stakeholder templates", "Customizable responses", "Industry-specific templates", "Template library"]
  },
  {
    id: "crisis-escalation-automation",
    name: "Crisis Escalation Automation",
    description: "Automated escalation chains with SLA tracking, multi-level approvals, and notification routing across email, SMS, and Slack.",
    category: "email-intelligence",
    price: "$149/mo",
    features: ["5-level escalation", "SLA tracking", "Multi-channel notifications", "Approval workflows", "Escalation analytics"]
  },

  // V512 - Sales Funnel Optimizer
  {
    id: "sales-funnel-tracker",
    name: "Sales Funnel Tracker",
    description: "Track email conversations through 8 sales stages (Awareness to Closed). Identify stuck deals and measure pipeline velocity.",
    category: "email-intelligence",
    price: "$129/mo",
    features: ["8-stage tracking", "Deal health scoring", "Stuck signal detection", "Pipeline velocity metrics", "Stage progression analytics"]
  },
  {
    id: "sales-funnel-nurturing",
    name: "Sales Funnel Nurturing",
    description: "Generate personalized nurturing sequences for each funnel stage with automated follow-up scheduling and engagement tracking.",
    category: "email-intelligence",
    price: "$199/mo",
    features: ["Stage-specific nurturing", "Personalized sequences", "Auto-scheduling", "Engagement tracking", "Conversion optimization"]
  },
  {
    id: "sales-funnel-velocity",
    name: "Sales Funnel Velocity",
    description: "Advanced pipeline velocity analysis with predictive close dates, conversion probability scoring, and revenue forecasting.",
    category: "email-intelligence",
    price: "$299/mo",
    features: ["Velocity calculations", "Predictive close dates", "Conversion probability", "Revenue forecasting", "Pipeline optimization"]
  },
  {
    id: "deal-health-monitor",
    name: "Deal Health Monitor",
    description: "Monitor deal health with 4-tier status (Healthy, At-Risk, Stalled, Critical). Get root cause analysis for stuck deals.",
    category: "email-intelligence",
    price: "$79/mo",
    features: ["4-tier health status", "Root cause analysis", "Stuck reason identification", "Health trend tracking", "Alert notifications"]
  },
  {
    id: "nurturing-sequence-generator",
    name: "Nurturing Sequence Generator",
    description: "Generate 5-step nurturing sequences with channel recommendations, personalization suggestions, and timing optimization.",
    category: "email-intelligence",
    price: "$99/mo",
    features: ["5-step sequences", "Channel recommendations", "Personalization tips", "Timing optimization", "Sequence templates"]
  },

  // V513 - Knowledge Graph Builder
  {
    id: "knowledge-graph-basic",
    name: "Knowledge Graph Basic",
    description: "Build knowledge graphs from emails with entity extraction (people, projects, technologies) and relationship mapping.",
    category: "email-intelligence",
    price: "$149/mo",
    features: ["Entity extraction", "8 entity types", "Relationship mapping", "Basic visualization", "Simple search"]
  },
  {
    id: "knowledge-graph-semantic",
    name: "Knowledge Graph Semantic Search",
    description: "Advanced semantic search across knowledge graphs with path finding, expertise identification, and knowledge gap detection.",
    category: "email-intelligence",
    price: "$249/mo",
    features: ["Semantic search", "Path finding", "Expertise identification", "Knowledge gap detection", "Advanced queries"]
  },
  {
    id: "knowledge-graph-visualization",
    name: "Knowledge Graph Visualization",
    description: "Interactive knowledge graph visualization with temporal evolution tracking, cross-thread linking, and export capabilities.",
    category: "email-intelligence",
    price: "$349/mo",
    features: ["Interactive visualization", "Temporal evolution", "Cross-thread linking", "Export to PNG/SVG", "Zoom and filter"]
  },
  {
    id: "entity-extraction-engine",
    name: "Entity Extraction Engine",
    description: "Extract 8 entity types from emails: people, organizations, projects, technologies, decisions, topics, documents, and skills.",
    category: "email-intelligence",
    price: "$99/mo",
    features: ["8 entity types", "Context-aware extraction", "Entity disambiguation", "Confidence scoring", "Batch processing"]
  },
  {
    id: "relationship-mapper",
    name: "Relationship Mapper",
    description: "Map 10 relationship types between entities with strength scoring, temporal tracking, and relationship evolution analysis.",
    category: "email-intelligence",
    price: "$129/mo",
    features: ["10 relationship types", "Strength scoring", "Temporal tracking", "Evolution analysis", "Relationship queries"]
  },

  // V514 - Customer Health Monitor
  {
    id: "customer-health-tracker",
    name: "Customer Health Tracker",
    description: "Track customer health with 5-tier status (Excellent to Critical). Analyze satisfaction, engagement, support, expansion, and churn signals.",
    category: "email-intelligence",
    price: "$179/mo",
    features: ["5-tier health status", "6 signal types", "Health score calculation", "Trend analysis", "Alert notifications"]
  },
  {
    id: "customer-health-churn-prediction",
    name: "Customer Health Churn Prediction",
    description: "Predict churn risk with early warning signals, retention action recommendations, and churn probability scoring.",
    category: "email-intelligence",
    price: "$299/mo",
    features: ["Churn risk prediction", "Early warning signals", "Retention recommendations", "Probability scoring", "Churn prevention workflows"]
  },
  {
    id: "customer-health-nps-prediction",
    name: "Customer Health NPS Prediction",
    description: "Predict NPS scores from email sentiment with satisfaction trend analysis and advocacy opportunity identification.",
    category: "email-intelligence",
    price: "$199/mo",
    features: ["NPS prediction", "Satisfaction trends", "Advocacy identification", "Sentiment analysis", "NPS improvement suggestions"]
  },
  {
    id: "customer-lifecycle-tracker",
    name: "Customer Lifecycle Tracker",
    description: "Track customer lifecycle stages (Onboarding to Churn) with stage transition detection and lifecycle optimization.",
    category: "email-intelligence",
    price: "$149/mo",
    features: ["6 lifecycle stages", "Stage transition detection", "Lifecycle optimization", "Stage-specific actions", "Lifecycle analytics"]
  },
  {
    id: "expansion-opportunity-detector",
    name: "Expansion Opportunity Detector",
    description: "Detect expansion opportunities from email signals with upsell recommendations and revenue potential estimation.",
    category: "email-intelligence",
    price: "$249/mo",
    features: ["Expansion signal detection", "Upsell recommendations", "Revenue estimation", "Opportunity scoring", "Expansion workflows"]
  },

  // V515 - Regulatory Compliance Scanner
  {
    id: "regulatory-compliance-scanner",
    name: "Regulatory Compliance Scanner",
    description: "Scan emails for 8 regulatory frameworks (GDPR, HIPAA, SOX, FINRA, CCPA, PCI-DSS, FERPA, GLBA) with industry-specific rules.",
    category: "email-intelligence",
    price: "$399/mo",
    features: ["8 frameworks", "Industry detection", "Rule-based scanning", "Risk scoring", "Compliance reporting"]
  },
  {
    id: "regulatory-compliance-audit",
    name: "Regulatory Compliance Audit Trail",
    description: "Generate comprehensive audit trails with compliance certificates, remediation tracking, and auditor-ready reports.",
    category: "email-intelligence",
    price: "$499/mo",
    features: ["Audit trail generation", "Compliance certificates", "Remediation tracking", "Auditor reports", "Historical compliance"]
  },
  {
    id: "regulatory-compliance-remediation",
    name: "Regulatory Compliance Remediation",
    description: "Automated remediation suggestions with priority ranking, implementation guidance, and compliance verification.",
    category: "email-intelligence",
    price: "$299/mo",
    features: ["Remediation suggestions", "Priority ranking", "Implementation guidance", "Compliance verification", "Remediation tracking"]
  },
  {
    id: "industry-compliance-rules",
    name: "Industry Compliance Rules",
    description: "Industry-specific compliance rules for financial services, healthcare, education, e-commerce, legal, and government sectors.",
    category: "email-intelligence",
    price: "$199/mo",
    features: ["6 industry profiles", "Custom rule sets", "Industry best practices", "Regulatory updates", "Compliance benchmarks"]
  },
  {
    id: "compliance-risk-assessment",
    name: "Compliance Risk Assessment",
    description: "Comprehensive risk assessment with fine potential calculations, violation severity scoring, and risk mitigation strategies.",
    category: "email-intelligence",
    price: "$349/mo",
    features: ["Risk assessment", "Fine calculations", "Severity scoring", "Mitigation strategies", "Risk dashboards"]
  },
];

// Add new services
newServices.forEach(service => {
  if (!servicesData.find(s => s.id === service.id)) {
    servicesData.push(service);
  }
});

// Save updated services
fs.writeFileSync(servicesPath, JSON.stringify(servicesData, null, 2));
console.log(`✅ Added ${newServices.length} services. Total: ${servicesData.length} services`);
