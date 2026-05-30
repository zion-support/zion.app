const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const contactInfo = {
  mobile: "+1 302 464 0950",
  email: "kleber@ziontechgroup.com",
  address: "364 E Main St STE 1008, Middletown DE 19709"
};

const newServices = [
  {
    id: "email-persona-manager",
    title: "AI Email Persona Manager",
    description: "Create and switch between professional personas (executive, technical, sales, support, legal) with consistent voice, vocabulary, and response patterns per context.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🎭",
    price: "$449/month",
    features: ["5 Professional Personas", "Auto-Context Detection", "Vocabulary Matching", "Tone Consistency", "Persona Switching", "Brand Voice Enforcement"],
    benefits: ["Consistent brand voice", "Context-appropriate responses", "Professional tone matching", "Vocabulary optimization"],
    link: "/services/email-persona-manager",
    version: "V316",
    contactInfo
  },
  {
    id: "email-roi-calculator",
    title: "AI Email ROI Calculator Platform",
    description: "Track the monetary value of every email conversation, calculate time-to-value, measure deal influence by stage, and report email ROI by team/person/campaign.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🧮",
    price: "$599/month",
    features: ["Deal Stage Tracking", "Time Cost Calculation", "Influence Attribution", "Team ROI Reports", "Value-per-Email Metrics", "Revenue Correlation"],
    benefits: ["Measure email ROI precisely", "Track deal influence", "Optimize time investment", "Report value to stakeholders"],
    link: "/services/email-roi-calculator",
    version: "V317",
    contactInfo
  },
  {
    id: "email-forensics-analyzer",
    title: "AI Email Forensics Analyzer",
    description: "Deep forensic analysis of email headers, routing paths, DKIM/SPF/DMARC validation, timeline reconstruction, spoofing detection, and evidence chain for legal/compliance.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🔬",
    price: "$799/month",
    features: ["Header Analysis", "DKIM/SPF/DMARC Validation", "Timeline Reconstruction", "Spoofing Detection", "Evidence Chain", "Legal Admissibility"],
    benefits: ["Detect email spoofing", "Validate authenticity", "Build legal evidence chains", "Prevent fraud"],
    link: "/services/email-forensics-analyzer",
    version: "V318",
    contactInfo
  },
  {
    id: "email-federation-hub",
    title: "AI Email Federation Hub",
    description: "Unified inbox across Gmail, Outlook, ProtonMail, and custom domains with cross-platform search, unified threading, synchronized labels, and multi-provider management.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🌐",
    price: "$549/month",
    features: ["Multi-Provider Support", "Unified Inbox", "Cross-Platform Search", "Unified Threading", "Label Synchronization", "Account Management"],
    benefits: ["One inbox for all accounts", "Search across all providers", "Unified conversation threads", "Simplified email management"],
    link: "/services/email-federation-hub",
    version: "V319",
    contactInfo
  },
  {
    id: "email-workflow-marketplace",
    title: "AI Email Workflow Marketplace",
    description: "Pre-built email workflow templates (sales outreach, support triage, executive briefing, onboarding, renewals) that can be customized and shared across the organization.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🧩",
    price: "$649/month",
    features: ["5+ Workflow Templates", "Custom Workflow Builder", "Team Sharing", "Auto-Execution", "Success Metrics", "Workflow Analytics"],
    benefits: ["Automate email sequences", "Standardize processes", "Share best practices", "Track workflow performance"],
    link: "/services/email-workflow-marketplace",
    version: "V320",
    contactInfo
  },
  {
    id: "ai-edge-inference-platform",
    title: "AI Edge Inference & Deployment Platform",
    description: "Deploy and manage AI models at the edge with optimized inference, model compression, OTA updates, and real-time processing for IoT devices and embedded systems.",
    category: "AI Services",
    subcategory: "Edge AI",
    icon: "📡",
    price: "$1,999/month",
    features: ["Model Compression", "Edge Deployment", "OTA Updates", "Real-Time Inference", "Device Management", "Latency Optimization"],
    benefits: ["<10ms inference latency", "Deploy to 10,000+ devices", "Reduce cloud costs by 70%", "Enable offline AI"],
    link: "/services/ai-edge-inference-platform",
    contactInfo
  },
  {
    id: "ai-synthetic-data-generator",
    title: "AI Synthetic Data Generation Platform",
    description: "Generate high-quality synthetic data for ML training with privacy preservation, statistical fidelity, edge case generation, and GDPR/HIPAA compliance.",
    category: "AI Services",
    subcategory: "Data AI",
    icon: "🧪",
    price: "$1,299/month",
    features: ["Privacy-Preserving Generation", "Statistical Fidelity", "Edge Case Generation", "GDPR/HIPAA Compliant", "Multi-Modal Data", "Quality Validation"],
    benefits: ["Train ML without real data", "Ensure privacy compliance", "Generate rare edge cases", "Scale training datasets 100x"],
    link: "/services/ai-synthetic-data-generator",
    contactInfo
  },
  {
    id: "ai-contract-intelligence-platform",
    title: "AI Contract Intelligence & Analysis Platform",
    description: "Automated contract analysis with clause extraction, risk scoring, obligation tracking, compliance checking, and negotiation suggestions powered by legal AI.",
    category: "AI Services",
    subcategory: "Legal AI",
    icon: "📋",
    price: "$2,499/month",
    features: ["Clause Extraction", "Risk Scoring", "Obligation Tracking", "Compliance Checking", "Negotiation AI", "Template Matching"],
    benefits: ["Review contracts in minutes", "Identify risky clauses", "Track all obligations", "Reduce legal costs by 60%"],
    link: "/services/ai-contract-intelligence-platform",
    contactInfo
  },
  {
    id: "ai-demand-forecasting-engine",
    title: "AI Demand Forecasting & Planning Engine",
    description: "Predict future demand with ML models incorporating seasonality, trends, events, weather, and market signals for inventory optimization and supply chain planning.",
    category: "AI Services",
    subcategory: "Supply Chain AI",
    icon: "📈",
    price: "$1,799/month",
    features: ["Multi-Factor Forecasting", "Seasonality Detection", "Event Impact Analysis", "Scenario Planning", "Accuracy Tracking", "Integration APIs"],
    benefits: ["95%+ forecast accuracy", "Reduce inventory by 25%", "Prevent stockouts", "Optimize supply chain"],
    link: "/services/ai-demand-forecasting-engine",
    contactInfo
  },
  {
    id: "ai-content-moderation-suite",
    title: "AI Content Moderation & Safety Suite",
    description: "Real-time content moderation for text, images, and video with custom policy enforcement, contextual understanding, and human-in-the-loop escalation.",
    category: "AI Services",
    subcategory: "Trust & Safety",
    icon: "🛡️",
    price: "$999/month",
    features: ["Multi-Modal Moderation", "Custom Policies", "Contextual AI", "Real-Time Processing", "Human Escalation", "Compliance Reports"],
    benefits: ["Moderate 1M+ items/hour", "99%+ accuracy", "Custom policy enforcement", "Reduce moderation costs by 80%"],
    link: "/services/ai-content-moderation-suite",
    contactInfo
  },
  {
    id: "ai-warehouse-automation",
    title: "AI Warehouse Automation & Robotics Platform",
    description: "Intelligent warehouse automation with computer vision picking, robot coordination, inventory tracking, route optimization, and predictive maintenance.",
    category: "AI Services",
    subcategory: "Industrial AI",
    icon: "🏭",
    price: "$3,499/month",
    features: ["Computer Vision Picking", "Robot Coordination", "Inventory Tracking", "Route Optimization", "Predictive Maintenance", "Safety Monitoring"],
    benefits: ["Increase picking speed 3x", "Reduce errors by 90%", "Optimize warehouse layout", "24/7 automated operations"],
    link: "/services/ai-warehouse-automation",
    contactInfo
  },
  {
    id: "ai-personalization-engine",
    title: "AI Real-Time Personalization Engine",
    description: "Deliver personalized experiences across web, mobile, and email with real-time user behavior analysis, A/B testing, and recommendation algorithms.",
    category: "AI Services",
    subcategory: "Marketing AI",
    icon: "🎯",
    price: "$899/month",
    features: ["Real-Time Analysis", "Multi-Channel Delivery", "Recommendation AI", "A/B Testing", "User Segmentation", "Conversion Optimization"],
    benefits: ["Increase conversions by 35%", "Personalize in real-time", "Reduce bounce rates by 25%", "Maximize customer lifetime value"],
    link: "/services/ai-personalization-engine",
    contactInfo
  },
  {
    id: "it-chaos-engineering-platform",
    title: "Chaos Engineering & Resilience Testing Platform",
    description: "Proactively test system resilience with controlled chaos experiments, failure injection, automated rollback, and resilience scoring for production systems.",
    category: "IT Services",
    subcategory: "Resilience",
    icon: "💥",
    price: "$2,499/month",
    features: ["Controlled Experiments", "Failure Injection", "Auto Rollback", "Resilience Scoring", "GameDay Automation", "Impact Analysis"],
    benefits: ["Find weaknesses before outages", "Improve resilience by 60%", "Automate resilience testing", "Build production confidence"],
    link: "/services/it-chaos-engineering-platform",
    contactInfo
  },
  {
    id: "it-service-mesh-platform",
    title: "Enterprise Service Mesh Platform",
    description: "Production-ready service mesh with Istio/Linkerd management, traffic control, mTLS security, observability, and multi-cluster federation.",
    category: "IT Services",
    subcategory: "Cloud Native",
    icon: "🕸️",
    price: "$1,999/month",
    features: ["Istio/Linkerd Management", "Traffic Control", "mTLS Security", "Observability", "Multi-Cluster", "Canary Deployments"],
    benefits: ["Secure microservices", "Enable canary deployments", "Centralized traffic management", "Zero-trust networking"],
    link: "/services/it-service-mesh-platform",
    contactInfo
  },
  {
    id: "it-database-performance-tuning",
    title: "Database Performance Tuning & Optimization",
    description: "Expert database performance tuning for PostgreSQL, MySQL, MongoDB, and Redis with query optimization, indexing strategies, and capacity planning.",
    category: "IT Services",
    subcategory: "Database",
    icon: "⚡",
    price: "$3,999/project",
    features: ["Query Optimization", "Indexing Strategies", "Capacity Planning", "Performance Monitoring", "Schema Design", "Replication Setup"],
    benefits: ["Improve query performance 10x", "Reduce DB costs by 40%", "Eliminate slow queries", "Scale to millions of users"],
    link: "/services/it-database-performance-tuning",
    contactInfo
  },
  {
    id: "it-cdn-optimization-platform",
    title: "CDN Optimization & Edge Delivery Platform",
    description: "Optimize content delivery with multi-CDN management, intelligent routing, image optimization, cache strategies, and real-user monitoring.",
    category: "IT Services",
    subcategory: "Performance",
    icon: "🌍",
    price: "$1,499/month",
    features: ["Multi-CDN Management", "Intelligent Routing", "Image Optimization", "Cache Strategies", "Real-User Monitoring", "Cost Optimization"],
    benefits: ["Reduce page load by 50%", "Cut CDN costs by 30%", "Improve global performance", "Optimize media delivery"],
    link: "/services/it-cdn-optimization-platform",
    contactInfo
  },
  {
    id: "it-identity-federation-platform",
    title: "Identity Federation & SSO Platform",
    description: "Enterprise identity federation with SAML/OIDC SSO, multi-factor authentication, directory synchronization, and access governance.",
    category: "IT Services",
    subcategory: "Identity",
    icon: "🔑",
    price: "$2,999/month",
    features: ["SAML/OIDC SSO", "Multi-Factor Auth", "Directory Sync", "Access Governance", "Passwordless Options", "Audit Logging"],
    benefits: ["Single sign-on everywhere", "Reduce password fatigue", "Strengthen security", "Simplify user management"],
    link: "/services/it-identity-federation-platform",
    contactInfo
  },
  {
    id: "it-log-management-siem",
    title: "Log Management & SIEM Platform",
    description: "Centralized log management with SIEM capabilities, threat detection, compliance reporting, and automated incident response for security operations.",
    category: "IT Services",
    subcategory: "Security Operations",
    icon: "📊",
    price: "$3,499/month",
    features: ["Centralized Logging", "Threat Detection", "Compliance Reporting", "Incident Response", "Log Analytics", "Retention Management"],
    benefits: ["Detect threats in real-time", "Meet compliance requirements", "Reduce investigation time by 70%", "Automate security ops"],
    link: "/services/it-log-management-siem",
    contactInfo
  },
  {
    id: "saas-ai-copywriting-assistant",
    title: "AI Copywriting & Content Assistant",
    description: "AI-powered copywriting assistant for marketing, sales, and product content with brand voice training, SEO optimization, and multi-format generation.",
    category: "Micro-SaaS",
    subcategory: "Content",
    icon: "✍️",
    price: "$39/month",
    features: ["Brand Voice Training", "SEO Optimization", "Multi-Format Generation", "A/B Variant Creation", "Tone Adjustment", "Plagiarism Check"],
    benefits: ["Write content 10x faster", "Maintain brand voice", "Optimize for SEO", "Generate A/B variants instantly"],
    link: "/services/saas-ai-copywriting-assistant",
    contactInfo
  },
  {
    id: "saas-customer-feedback-loop",
    title: "Customer Feedback Loop & Insights Platform",
    description: "Collect, analyze, and act on customer feedback with sentiment analysis, feature request tracking, NPS monitoring, and automated response workflows.",
    category: "Micro-SaaS",
    subcategory: "Customer Success",
    icon: "💬",
    price: "$69/month",
    features: ["Sentiment Analysis", "Feature Request Tracking", "NPS Monitoring", "Auto-Response Workflows", "Feedback Aggregation", "Trend Analysis"],
    benefits: ["Understand customer sentiment", "Prioritize feature requests", "Improve NPS by 20+ points", "Close the feedback loop"],
    link: "/services/saas-customer-feedback-loop",
    contactInfo
  },
  {
    id: "saas-ai-scheduling-assistant",
    title: "AI Scheduling Assistant & Calendar Manager",
    description: "AI-powered scheduling assistant that handles meeting coordination, timezone management, conflict resolution, and automated follow-ups across teams.",
    category: "Micro-SaaS",
    subcategory: "Productivity",
    icon: "📅",
    price: "$19/user/month",
    features: ["Smart Scheduling", "Timezone Management", "Conflict Resolution", "Auto Follow-Ups", "Meeting Prep", "Calendar Analytics"],
    benefits: ["Save 5+ hours/week on scheduling", "Eliminate scheduling conflicts", "Handle timezone complexity", "Automate coordination"],
    link: "/services/saas-ai-scheduling-assistant",
    contactInfo
  },
  {
    id: "saas-revenue-intelligence-platform",
    title: "Revenue Intelligence & Forecasting Platform",
    description: "AI-powered revenue intelligence with deal scoring, pipeline analytics, forecast accuracy tracking, and sales activity insights for revenue teams.",
    category: "Micro-SaaS",
    subcategory: "Sales",
    icon: "💰",
    price: "$299/month",
    features: ["Deal Scoring", "Pipeline Analytics", "Forecast Tracking", "Activity Insights", "Revenue Attribution", "Team Performance"],
    benefits: ["Improve forecast accuracy to 95%", "Identify at-risk deals early", "Optimize sales activities", "Increase win rates by 20%"],
    link: "/services/saas-revenue-intelligence-platform",
    contactInfo
  },
  {
    id: "saas-ai-knowledge-base-builder",
    title: "AI Knowledge Base & Help Center Builder",
    description: "Build and maintain AI-powered knowledge bases with auto-article generation, search optimization, analytics, and multi-channel publishing.",
    category: "Micro-SaaS",
    subcategory: "Support",
    icon: "📚",
    price: "$89/month",
    features: ["Auto-Article Generation", "Search Optimization", "Analytics Dashboard", "Multi-Channel Publishing", "Version Control", "AI Search"],
    benefits: ["Reduce support tickets by 40%", "Auto-generate help articles", "Improve search accuracy", "Publish across all channels"],
    link: "/services/saas-ai-knowledge-base-builder",
    contactInfo
  },
  {
    id: "saas-employee-onboarding-platform",
    title: "AI Employee Onboarding Platform",
    description: "Automated employee onboarding with personalized learning paths, document management, progress tracking, and HR system integration.",
    category: "Micro-SaaS",
    subcategory: "HR Tech",
    icon: "🚀",
    price: "$12/user/month",
    features: ["Personalized Learning Paths", "Document Management", "Progress Tracking", "HR System Integration", "Task Automation", "Compliance Training"],
    benefits: ["Reduce onboarding time by 50%", "Improve new hire satisfaction", "Ensure compliance", "Scale without HR overhead"],
    link: "/services/saas-employee-onboarding-platform",
    contactInfo
  },
  {
    id: "saas-ai-competitive-monitoring",
    title: "AI Competitive Monitoring & Intelligence",
    description: "Monitor competitors automatically with website tracking, pricing alerts, product updates, job posting analysis, and market share estimation.",
    category: "Micro-SaaS",
    subcategory: "Business Intelligence",
    icon: "🔍",
    price: "$149/month",
    features: ["Website Tracking", "Pricing Alerts", "Product Update Detection", "Job Posting Analysis", "Market Share Estimation", "Competitor Reports"],
    benefits: ["Know competitor moves first", "Track pricing changes instantly", "Identify market opportunities", "Data-driven decisions"],
    link: "/services/saas-ai-competitive-monitoring",
    contactInfo
  },
  {
    id: "saas-ai-presentation-builder",
    title: "AI Presentation & Pitch Deck Builder",
    description: "Create professional presentations and pitch decks with AI-powered content generation, design templates, data visualization, and brand consistency.",
    category: "Micro-SaaS",
    subcategory: "Productivity",
    icon: "📊",
    price: "$29/month",
    features: ["AI Content Generation", "Design Templates", "Data Visualization", "Brand Consistency", "Collaboration Tools", "Export Options"],
    benefits: ["Create presentations in minutes", "Professional design automatically", "Visualize data effectively", "Maintain brand consistency"],
    link: "/services/saas-ai-presentation-builder",
    contactInfo
  }
];

services.push(...newServices);
fs.writeFileSync(jsonPath, JSON.stringify(services, null, 2));
console.log("Added " + newServices.length + " new services. Total: " + services.length);

// Update servicesData.ts
const tsPath = path.join(__dirname, 'app/data/servicesData.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

const tsEntries = newServices.map(s => {
  const featuresStr = s.features.map(f => '"' + f + '"').join(', ');
  const benefitsStr = (s.benefits || []).map(b => '"' + b + '"').join(', ');
  return '  {\n    id: "' + s.id + '",\n    title: "' + s.title + '",\n    description: "' + s.description + '",\n    category: "' + s.category + '",\n    subcategory: "' + s.subcategory + '",\n    icon: "' + s.icon + '",\n    price: "' + s.price + '",\n    features: [' + featuresStr + '],\n    benefits: [' + benefitsStr + '],\n    link: "' + s.link + '",\n    contactInfo: {\n      mobile: "' + s.contactInfo.mobile + '",\n      email: "' + s.contactInfo.email + '",\n      address: "' + s.contactInfo.address + '"\n    }\n  }';
}).join(',\n');

const insertPoint = tsContent.lastIndexOf('];');
if (insertPoint !== -1) {
  const beforeInsert = tsContent.substring(0, insertPoint).trim();
  const needsComma = !beforeInsert.endsWith(',') && !beforeInsert.endsWith('[');
  const insertion = (needsComma ? ',\n' : '\n') + tsEntries + '\n';
  tsContent = tsContent.substring(0, insertPoint) + insertion + tsContent.substring(insertPoint);
}

const exportEntries = newServices.map(s =>
  'export const ' + s.id.replace(/-/g, '_') + ' = allServices.find(s => s.id === "' + s.id + '");'
).join('\n');

tsContent += '\n\n// V316-V320 Service Exports\n' + exportEntries + '\n';
fs.writeFileSync(tsPath, tsContent);
console.log('Updated servicesData.ts');
