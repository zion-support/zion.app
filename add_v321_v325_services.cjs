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
  // V321-V325 Email Intelligence (5)
  {
    id: "email-sentiment-evolution-tracker",
    title: "AI Email Sentiment Evolution Tracker",
    description: "Track sentiment shifts across email threads over time, detect relationship health trends, predict churn risk, and suggest intervention timing with emotional intelligence.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🎨",
    price: "$499/month",
    features: ["Thread Sentiment Tracking", "Relationship Health Scoring", "Churn Risk Prediction", "Intervention Alerts", "Trend Analysis", "Emotional Intelligence"],
    benefits: ["Prevent customer churn", "Detect relationship issues early", "Improve customer satisfaction", "Data-driven interventions"],
    link: "/services/email-sentiment-evolution-tracker",
    version: "V321",
    contactInfo
  },
  {
    id: "email-predictive-response-generator",
    title: "AI Predictive Response Generator",
    description: "Generate contextually perfect responses using transformer models trained on your organization's successful email patterns, with tone matching and personalization.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🔮",
    price: "$699/month",
    features: ["Context-Aware Generation", "Tone Matching", "Personalization Engine", "Quality Scoring", "Pattern Learning", "Template Suggestions"],
    benefits: ["90%+ response quality", "Save 2+ hours daily", "Maintain brand voice", "Personalize at scale"],
    link: "/services/email-predictive-response-generator",
    version: "V322",
    contactInfo
  },
  {
    id: "email-analytics-dashboard-pro",
    title: "AI Email Analytics Dashboard Pro",
    description: "Real-time email performance metrics with response time tracking, engagement scoring, team productivity analytics, and predictive insights for optimization.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "📊",
    price: "$599/month",
    features: ["Response Time Metrics", "Engagement Scoring", "Team Productivity", "Predictive Insights", "Health Score", "Actionable Recommendations"],
    benefits: ["Improve response times by 40%", "Identify team bottlenecks", "Optimize email workflows", "Data-driven decisions"],
    link: "/services/email-analytics-dashboard-pro",
    version: "V323",
    contactInfo
  },
  {
    id: "email-compliance-guardian-pro",
    title: "AI Email Compliance Guardian Pro",
    description: "Automated compliance checking for GDPR, CCPA, HIPAA, SOX with PII detection, data retention policies, audit trails, and automatic redaction for legal safety.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🛡️",
    price: "$899/month",
    features: ["Multi-Framework Compliance", "PII Detection", "Auto-Redaction", "Audit Trails", "Data Retention", "Risk Scoring"],
    benefits: ["100% compliance assurance", "Prevent data breaches", "Automate audit trails", "Reduce legal risk"],
    link: "/services/email-compliance-guardian-pro",
    version: "V324",
    contactInfo
  },
  {
    id: "email-auto-responder-intelligence",
    title: "AI Email Auto-Responder Intelligence",
    description: "Smart auto-responses with context awareness, vacation mode, out-of-office scheduling, intelligent delegation, and human-like personalization for 24/7 coverage.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🤖",
    price: "$549/month",
    features: ["Context-Aware Responses", "Vacation Mode", "Smart Delegation", "Urgent Detection", "Personalization", "24/7 Coverage"],
    benefits: ["Never miss urgent emails", "Professional auto-responses", "Smart delegation", "Maintain work-life balance"],
    link: "/services/email-auto-responder-intelligence",
    version: "V325",
    contactInfo
  },
  // AI Services (7 new)
  {
    id: "ai-multimodal-search-engine",
    title: "AI Multimodal Search Engine",
    description: "Search across text, images, video, and audio with unified embeddings, cross-modal retrieval, semantic understanding, and relevance ranking for enterprise knowledge bases.",
    category: "AI Services",
    subcategory: "Search AI",
    icon: "🔍",
    price: "$1,999/month",
    features: ["Cross-Modal Search", "Unified Embeddings", "Semantic Understanding", "Relevance Ranking", "Real-Time Indexing", "Multi-Format Support"],
    benefits: ["Find anything in seconds", "Search across all formats", "Improve knowledge discovery", "Reduce search time by 80%"],
    link: "/services/ai-multimodal-search-engine",
    contactInfo
  },
  {
    id: "ai-autonomous-research-agent",
    title: "AI Autonomous Research Agent",
    description: "Autonomous AI research agent that gathers information from multiple sources, synthesizes findings, generates reports, and provides citations with fact-checking.",
    category: "AI Services",
    subcategory: "Research AI",
    icon: "🔬",
    price: "$2,499/month",
    features: ["Multi-Source Research", "Auto-Synthesis", "Report Generation", "Citation Tracking", "Fact-Checking", "Source Verification"],
    benefits: ["Research 10x faster", "Comprehensive coverage", "Verified citations", "Reduce research costs by 70%"],
    link: "/services/ai-autonomous-research-agent",
    contactInfo
  },
  {
    id: "ai-code-migration-assistant",
    title: "AI Code Migration & Modernization Assistant",
    description: "Automate legacy code migration with AI-powered code translation, dependency analysis, test generation, and incremental modernization for COBOL, FORTRAN, and legacy Java.",
    category: "AI Services",
    subcategory: "Developer AI",
    icon: "🔄",
    price: "$3,999/project",
    features: ["Code Translation", "Dependency Analysis", "Test Generation", "Incremental Migration", "Legacy Support", "Quality Assurance"],
    benefits: ["Migrate legacy code 5x faster", "Reduce migration risk", "Generate tests automatically", "Modernize without rewrites"],
    link: "/services/ai-code-migration-assistant",
    contactInfo
  },
  {
    id: "ai-customer-journey-orchestrator",
    title: "AI Customer Journey Orchestration Platform",
    description: "Orchestrate personalized customer journeys across all touchpoints with real-time decisioning, predictive next-best-action, and cross-channel coordination.",
    category: "AI Services",
    subcategory: "Customer Experience",
    icon: "🗺️",
    price: "$1,799/month",
    features: ["Journey Orchestration", "Real-Time Decisioning", "Next-Best-Action", "Cross-Channel Coordination", "Personalization", "Journey Analytics"],
    benefits: ["Increase conversions by 40%", "Personalize every touchpoint", "Predict customer needs", "Optimize journey ROI"],
    link: "/services/ai-customer-journey-orchestrator",
    contactInfo
  },
  {
    id: "ai-financial-fraud-detection",
    title: "AI Financial Fraud Detection Platform",
    description: "Real-time fraud detection using graph neural networks, anomaly detection, behavioral biometrics, and transaction pattern analysis for banking and fintech.",
    category: "AI Services",
    subcategory: "FinTech AI",
    icon: "💳",
    price: "$4,999/month",
    features: ["Graph Neural Networks", "Anomaly Detection", "Behavioral Biometrics", "Transaction Analysis", "Real-Time Scoring", "Case Management"],
    benefits: ["Detect fraud in milliseconds", "Reduce false positives by 60%", "Prevent millions in losses", "Meet compliance requirements"],
    link: "/services/ai-financial-fraud-detection",
    contactInfo
  },
  {
    id: "ai-video-understanding-platform",
    title: "AI Video Understanding & Analytics Platform",
    description: "Understand video content with object detection, action recognition, scene segmentation, transcript generation, and semantic search for media and security applications.",
    category: "AI Services",
    subcategory: "Computer Vision",
    icon: "🎥",
    price: "$2,999/month",
    features: ["Object Detection", "Action Recognition", "Scene Segmentation", "Transcript Generation", "Semantic Search", "Real-Time Processing"],
    benefits: ["Analyze videos automatically", "Extract insights from footage", "Improve content discovery", "Enhance security monitoring"],
    link: "/services/ai-video-understanding-platform",
    contactInfo
  },
  {
    id: "ai-regulatory-change-management",
    title: "AI Regulatory Change Management Platform",
    description: "Monitor regulatory changes globally, assess impact on operations, generate compliance roadmaps, and automate policy updates for financial services and healthcare.",
    category: "AI Services",
    subcategory: "RegTech",
    icon: "📜",
    price: "$3,499/month",
    features: ["Global Monitoring", "Impact Assessment", "Compliance Roadmaps", "Policy Automation", "Risk Scoring", "Audit Trails"],
    benefits: ["Stay ahead of regulations", "Reduce compliance costs by 50%", "Automate policy updates", "Minimize regulatory risk"],
    link: "/services/ai-regulatory-change-management",
    contactInfo
  },
  // IT Services (6 new)
  {
    id: "it-kubernetes-security-platform",
    title: "Kubernetes Security & Compliance Platform",
    description: "Comprehensive Kubernetes security with runtime protection, network policies, secret management, vulnerability scanning, and compliance automation for containerized workloads.",
    category: "IT Services",
    subcategory: "Container Security",
    icon: "☸️",
    price: "$2,999/month",
    features: ["Runtime Protection", "Network Policies", "Secret Management", "Vulnerability Scanning", "Compliance Automation", "Threat Detection"],
    benefits: ["Secure Kubernetes clusters", "Prevent container escapes", "Automate compliance", "Reduce security incidents by 80%"],
    link: "/services/it-kubernetes-security-platform",
    contactInfo
  },
  {
    id: "it-api-gateway-management",
    title: "API Gateway & Management Platform",
    description: "Enterprise API gateway with rate limiting, authentication, request transformation, analytics, and developer portal for managing thousands of APIs at scale.",
    category: "IT Services",
    subcategory: "API Management",
    icon: "🚪",
    price: "$2,499/month",
    features: ["Rate Limiting", "Authentication", "Request Transformation", "Analytics", "Developer Portal", "API Versioning"],
    benefits: ["Manage APIs at scale", "Improve API security", "Monetize APIs", "Enhance developer experience"],
    link: "/services/it-api-gateway-management",
    contactInfo
  },
  {
    id: "it-cloud-cost-optimization",
    title: "Cloud Cost Optimization & FinOps Platform",
    description: "Optimize cloud spending across AWS, Azure, and GCP with rightsizing recommendations, reserved instance planning, spot instance automation, and budget alerts.",
    category: "IT Services",
    subcategory: "Cloud FinOps",
    icon: "💸",
    price: "$1,999/month",
    features: ["Multi-Cloud Support", "Rightsizing", "Reserved Instances", "Spot Automation", "Budget Alerts", "Cost Analytics"],
    benefits: ["Reduce cloud costs by 30-40%", "Optimize resource usage", "Predict cloud spending", "Implement FinOps culture"],
    link: "/services/it-cloud-cost-optimization",
    contactInfo
  },
  {
    id: "it-database-migration-service",
    title: "Enterprise Database Migration Service",
    description: "Zero-downtime database migration from legacy systems to modern cloud databases with schema conversion, data validation, and performance optimization.",
    category: "IT Services",
    subcategory: "Database",
    icon: "🗄️",
    price: "$9,999/project",
    features: ["Zero-Downtime Migration", "Schema Conversion", "Data Validation", "Performance Tuning", "Rollback Planning", "Post-Migration Support"],
    benefits: ["Migrate without downtime", "Reduce database costs by 50%", "Modernize legacy systems", "Improve performance 5x"],
    link: "/services/it-database-migration-service",
    contactInfo
  },
  {
    id: "it-network-observability-platform",
    title: "Network Observability & Performance Platform",
    description: "Full-stack network observability with flow analysis, packet capture, latency monitoring, bandwidth optimization, and predictive network analytics.",
    category: "IT Services",
    subcategory: "Network Operations",
    icon: "🌐",
    price: "$2,499/month",
    features: ["Flow Analysis", "Packet Capture", "Latency Monitoring", "Bandwidth Optimization", "Predictive Analytics", "Network Topology"],
    benefits: ["Troubleshoot network issues instantly", "Optimize bandwidth usage", "Predict network problems", "Improve application performance"],
    link: "/services/it-network-observability-platform",
    contactInfo
  },
  {
    id: "it-endpoint-detection-response",
    title: "Endpoint Detection & Response (EDR) Platform",
    description: "Advanced endpoint protection with behavioral analysis, threat hunting, automated response, forensic investigation, and ransomware protection for enterprise endpoints.",
    category: "IT Services",
    subcategory: "Endpoint Security",
    icon: "🛡️",
    price: "$3,999/month",
    features: ["Behavioral Analysis", "Threat Hunting", "Automated Response", "Forensic Investigation", "Ransomware Protection", "Threat Intelligence"],
    benefits: ["Detect threats in real-time", "Respond automatically", "Prevent ransomware", "Investigate incidents quickly"],
    link: "/services/it-endpoint-detection-response",
    contactInfo
  },
  // Micro-SaaS (8 new)
  {
    id: "saas-ai-email-signature-manager",
    title: "AI Email Signature Manager",
    description: "Manage professional email signatures across your organization with brand consistency, dynamic content, campaign banners, and compliance enforcement.",
    category: "Micro-SaaS",
    subcategory: "Email Tools",
    icon: "✉️",
    price: "$5/user/month",
    features: ["Brand Consistency", "Dynamic Content", "Campaign Banners", "Compliance Enforcement", "Analytics", "Template Management"],
    benefits: ["Professional email signatures", "Enforce brand standards", "Run signature campaigns", "Track signature engagement"],
    link: "/services/saas-ai-email-signature-manager",
    contactInfo
  },
  {
    id: "saas-ai-meeting-scheduler",
    title: "AI Meeting Scheduler & Calendar Assistant",
    description: "AI-powered meeting scheduling that finds optimal times across timezones, handles rescheduling, sends reminders, and integrates with all major calendar platforms.",
    category: "Micro-SaaS",
    subcategory: "Productivity",
    icon: "📅",
    price: "$12/user/month",
    features: ["Smart Scheduling", "Timezone Intelligence", "Auto-Rescheduling", "Reminder System", "Calendar Integration", "Meeting Analytics"],
    benefits: ["Save 5 hours/week on scheduling", "Eliminate timezone confusion", "Reduce no-shows by 60%", "Optimize meeting load"],
    link: "/services/saas-ai-meeting-scheduler",
    contactInfo
  },
  {
    id: "saas-customer-success-platform",
    title: "AI Customer Success & Retention Platform",
    description: "Proactive customer success with health scoring, churn prediction, expansion opportunity identification, automated playbooks, and customer journey tracking.",
    category: "Micro-SaaS",
    subcategory: "Customer Success",
    icon: "🌟",
    price: "$199/month",
    features: ["Health Scoring", "Churn Prediction", "Expansion ID", "Automated Playbooks", "Journey Tracking", "Success Analytics"],
    benefits: ["Reduce churn by 35%", "Identify upsell opportunities", "Automate success workflows", "Improve NPS scores"],
    link: "/services/saas-customer-success-platform",
    contactInfo
  },
  {
    id: "saas-ai-proposal-generator",
    title: "AI Proposal & Quote Generator",
    description: "Generate professional proposals and quotes in minutes with AI-powered content, pricing optimization, template library, and e-signature integration.",
    category: "Micro-SaaS",
    subcategory: "Sales",
    icon: "📝",
    price: "$79/month",
    features: ["AI Content Generation", "Pricing Optimization", "Template Library", "E-Signature", "Analytics", "CRM Integration"],
    benefits: ["Create proposals in minutes", "Increase win rates by 25%", "Optimize pricing", "Track proposal engagement"],
    link: "/services/saas-ai-proposal-generator",
    contactInfo
  },
  {
    id: "saas-employee-engagement-platform",
    title: "AI Employee Engagement & Pulse Survey Platform",
    description: "Measure and improve employee engagement with pulse surveys, sentiment analysis, action planning, recognition programs, and retention prediction.",
    category: "Micro-SaaS",
    subcategory: "HR Tech",
    icon: "💪",
    price: "$8/user/month",
    features: ["Pulse Surveys", "Sentiment Analysis", "Action Planning", "Recognition Programs", "Retention Prediction", "Benchmark Data"],
    benefits: ["Improve engagement by 30%", "Reduce turnover by 25%", "Identify issues early", "Build stronger culture"],
    link: "/services/saas-employee-engagement-platform",
    contactInfo
  },
  {
    id: "saas-ai-invoice-processor",
    title: "AI Invoice Processing & AP Automation",
    description: "Automate accounts payable with AI-powered invoice extraction, approval workflows, payment scheduling, vendor management, and ERP integration.",
    category: "Micro-SaaS",
    subcategory: "Finance",
    icon: "🧾",
    price: "$149/month",
    features: ["Invoice Extraction", "Approval Workflows", "Payment Scheduling", "Vendor Management", "ERP Integration", "Audit Trail"],
    benefits: ["Process invoices 10x faster", "Reduce errors by 90%", "Automate approvals", "Improve cash flow"],
    link: "/services/saas-ai-invoice-processor",
    contactInfo
  },
  {
    id: "saas-ai-social-media-manager",
    title: "AI Social Media Management Platform",
    description: "Manage social media across all platforms with AI content generation, optimal posting times, engagement analytics, competitor monitoring, and crisis detection.",
    category: "Micro-SaaS",
    subcategory: "Marketing",
    icon: "📱",
    price: "$89/month",
    features: ["AI Content Generation", "Optimal Posting", "Engagement Analytics", "Competitor Monitoring", "Crisis Detection", "Multi-Platform"],
    benefits: ["Increase engagement by 50%", "Save 10 hours/week", "Grow followers faster", "Detect issues early"],
    link: "/services/saas-ai-social-media-manager",
    contactInfo
  },
  {
    id: "saas-ai-document-comparison",
    title: "AI Document Comparison & Version Control",
    description: "Compare documents intelligently with AI-powered diff detection, semantic understanding, change tracking, approval workflows, and version history.",
    category: "Micro-SaaS",
    subcategory: "Document Management",
    icon: "📄",
    price: "$39/month",
    features: ["Intelligent Diff", "Semantic Understanding", "Change Tracking", "Approval Workflows", "Version History", "Multi-Format Support"],
    benefits: ["Find changes instantly", "Understand semantic differences", "Streamline approvals", "Never lose document history"],
    link: "/services/saas-ai-document-comparison",
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

tsContent += '\n\n// V321-V325 Service Exports\n' + exportEntries + '\n';
fs.writeFileSync(tsPath, tsContent);
console.log('Updated servicesData.ts');
