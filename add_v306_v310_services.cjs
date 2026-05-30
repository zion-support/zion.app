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
  // V306-V310 Email Intelligence
  {
    id: "email-predictive-prioritizer",
    title: "AI Email Predictive Prioritizer",
    description: "ML model that predicts which emails will become urgent based on sender behavior, thread velocity, and business context. Prevents missed deadlines with proactive escalation.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🔮",
    price: "$549/month",
    features: ["ML Urgency Prediction", "Thread Velocity Analysis", "Proactive Escalation", "Deadline Detection", "Sender Authority Weighting", "Historical Pattern Learning"],
    benefits: ["Prevent missed deadlines", "Auto-escalate critical emails", "Predict urgency 4h ahead", "Reduce response time by 60%"],
    link: "/services/email-predictive-prioritizer",
    version: "V306",
    contactInfo
  },
  {
    id: "email-goal-alignment-engine",
    title: "AI Email Goal Alignment Engine",
    description: "Maps every email to OKR/KPI goals, tracks time spent per goal, and suggests delegation/deferral for off-goal emails to maximize strategic focus.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🎯",
    price: "$449/month",
    features: ["OKR/KPI Mapping", "Time-per-Goal Tracking", "Delegation Suggestions", "Strategic Focus Scoring", "Weekly Goal Reports", "Off-Goal Filtering"],
    benefits: ["Align 80% of email to goals", "Reduce time waste by 50%", "Track strategic focus", "Automate delegation decisions"],
    link: "/services/email-goal-alignment-engine",
    version: "V307",
    contactInfo
  },
  {
    id: "email-conversation-summarizer-pro",
    title: "AI Email Conversation Summarizer Pro",
    description: "Generates executive summaries of long email threads with decision points, action items, timeline visualization, and thread health assessment.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🔄",
    price: "$399/month",
    features: ["Executive Summaries", "Decision Extraction", "Action Item Tracking", "Timeline Visualization", "Thread Health Score", "Open Question Detection"],
    benefits: ["Save 30 min per long thread", "Never miss action items", "Track all decisions", "Identify stalled threads"],
    link: "/services/email-conversation-summarizer-pro",
    version: "V308",
    contactInfo
  },
  {
    id: "email-cultural-intelligence",
    title: "AI Email Cultural Intelligence Engine",
    description: "Detects cultural context of sender/recipient and adjusts tone, formality, greetings, and scheduling for 10+ cultures including US, Japan, Germany, India, Brazil, China.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "🌍",
    price: "$499/month",
    features: ["10+ Culture Profiles", "Tone Adaptation", "Formality Matching", "Scheduling Intelligence", "Sensitivity Alerts", "Language Detection"],
    benefits: ["Prevent cultural faux pas", "Improve global relationships", "Auto-adapt tone/formality", "Respect cultural holidays"],
    link: "/services/email-cultural-intelligence",
    version: "V309",
    contactInfo
  },
  {
    id: "email-revenue-attribution",
    title: "AI Email Revenue Attribution Engine",
    description: "Tracks how email conversations contribute to revenue, maps email touchpoints to deals, calculates email ROI per team member, and predicts conversion probability.",
    category: "AI Services",
    subcategory: "Email Intelligence",
    icon: "📈",
    price: "$699/month",
    features: ["Deal Stage Detection", "Revenue Signal Analysis", "Email ROI Calculator", "Conversion Prediction", "Team Attribution", "Touchpoint Timeline"],
    benefits: ["Measure email ROI", "Predict deal conversion", "Attribute revenue to teams", "Optimize sales emails"],
    link: "/services/email-revenue-attribution",
    version: "V310",
    contactInfo
  },
  // AI Services (7 new)
  {
    id: "ai-digital-twin-manufacturing",
    title: "AI Digital Twin for Manufacturing",
    description: "Create virtual replicas of manufacturing processes with real-time simulation, predictive quality control, process optimization, and what-if scenario modeling.",
    category: "AI Services",
    subcategory: "Industrial AI",
    icon: "🏭",
    price: "$4,999/month",
    features: ["Real-Time Simulation", "Predictive Quality", "Process Optimization", "What-If Scenarios", "IoT Integration", "3D Visualization"],
    benefits: ["Reduce defects by 60%", "Optimize production by 25%", "Prevent downtime", "Test changes virtually"],
    link: "/services/ai-digital-twin-manufacturing",
    contactInfo
  },
  {
    id: "ai-regulatory-intelligence",
    title: "AI Regulatory Intelligence Platform",
    description: "Monitor and comply with evolving regulations across jurisdictions with automated impact analysis, policy generation, and compliance gap assessment.",
    category: "AI Services",
    subcategory: "RegTech",
    icon: "📜",
    price: "$2,999/month",
    features: ["Regulation Monitoring", "Impact Analysis", "Policy Generation", "Gap Assessment", "Jurisdiction Mapping", "Audit Trail"],
    benefits: ["Stay ahead of regulations", "Reduce compliance costs by 40%", "Automate impact analysis", "Prevent regulatory fines"],
    link: "/services/ai-regulatory-intelligence",
    contactInfo
  },
  {
    id: "ai-autonomous-testing-platform",
    title: "AI Autonomous Testing Platform",
    description: "Self-healing test automation with AI-generated test cases, visual regression testing, cross-browser validation, and intelligent flaky test detection.",
    category: "AI Services",
    subcategory: "Developer Tools",
    icon: "🤖",
    price: "$799/month",
    features: ["Self-Healing Tests", "AI Test Generation", "Visual Regression", "Cross-Browser", "Flaky Detection", "Coverage Analysis"],
    benefits: ["Reduce test maintenance by 80%", "Auto-generate test cases", "Catch visual bugs", "Eliminate flaky tests"],
    link: "/services/ai-autonomous-testing-platform",
    contactInfo
  },
  {
    id: "ai-workforce-planning",
    title: "AI Workforce Planning & Optimization",
    description: "Predict staffing needs, optimize schedules, forecast attrition, and plan workforce capacity with AI-driven scenario modeling and skills gap analysis.",
    category: "AI Services",
    subcategory: "HR Tech",
    icon: "👷",
    price: "$1,299/month",
    features: ["Demand Forecasting", "Schedule Optimization", "Attrition Prediction", "Skills Gap Analysis", "Scenario Modeling", "Capacity Planning"],
    benefits: ["Optimize staffing by 30%", "Reduce overtime by 40%", "Predict attrition early", "Plan skills development"],
    link: "/services/ai-workforce-planning",
    contactInfo
  },
  {
    id: "ai-incident-command-center",
    title: "AI Incident Command Center",
    description: "Unified incident management with AI-powered triage, automated runbook execution, stakeholder communication, and post-incident analysis.",
    category: "AI Services",
    subcategory: "IT Operations",
    icon: "🚨",
    price: "$1,999/month",
    features: ["AI Triage", "Auto Runbooks", "Stakeholder Comms", "Post-Incident Analysis", "SLA Tracking", "War Room"],
    benefits: ["Reduce MTTR by 70%", "Automate incident response", "Improve communication", "Learn from every incident"],
    link: "/services/ai-incident-command-center",
    contactInfo
  },
  {
    id: "ai-personal-data-vault",
    title: "AI Personal Data Vault & Privacy Manager",
    description: "Give customers control over their data with consent management, data access requests, anonymization, and GDPR/CCPA compliance automation.",
    category: "AI Services",
    subcategory: "Privacy Tech",
    icon: "🔐",
    price: "$599/month",
    features: ["Consent Management", "Data Access Requests", "Auto-Anonymization", "GDPR Compliance", "CCPA Compliance", "Data Portability"],
    benefits: ["Achieve GDPR compliance", "Automate DSARs", "Build customer trust", "Reduce privacy risk"],
    link: "/services/ai-personal-data-vault",
    contactInfo
  },
  {
    id: "ai-competitive-war-room",
    title: "AI Competitive War Room Platform",
    description: "Real-time competitive intelligence with market monitoring, pricing analysis, feature comparison, win/loss tracking, and battle card generation.",
    category: "AI Services",
    subcategory: "Business Intelligence",
    icon: "⚔️",
    price: "$1,499/month",
    features: ["Market Monitoring", "Pricing Analysis", "Feature Comparison", "Win/Loss Tracking", "Battle Cards", "Alert System"],
    benefits: ["Know competitor moves first", "Optimize pricing strategy", "Improve win rates by 20%", "Generate battle cards instantly"],
    link: "/services/ai-competitive-war-room",
    contactInfo
  },
  // IT Services (6 new)
  {
    id: "it-quantum-computing-readiness",
    title: "Quantum Computing Readiness Assessment",
    description: "Evaluate organizational readiness for quantum computing with algorithm identification, cryptography migration planning, and quantum-safe security assessment.",
    category: "IT Services",
    subcategory: "Emerging Tech",
    icon: "⚛️",
    price: "$9,999/project",
    features: ["Algorithm Identification", "Crypto Migration Plan", "Quantum-Safe Assessment", "ROI Modeling", "Timeline Planning", "Team Training"],
    benefits: ["Prepare for quantum era", "Protect against quantum threats", "Identify quantum opportunities", "Plan migration roadmap"],
    link: "/services/it-quantum-computing-readiness",
    contactInfo
  },
  {
    id: "it-green-it-optimization",
    title: "Green IT & Carbon Footprint Optimization",
    description: "Measure and reduce IT carbon footprint with energy monitoring, workload optimization, sustainable procurement, and ESG reporting automation.",
    category: "IT Services",
    subcategory: "Sustainability",
    icon: "🌱",
    price: "$1,499/month",
    features: ["Energy Monitoring", "Workload Optimization", "Sustainable Procurement", "ESG Reporting", "Carbon Tracking", "Efficiency Scoring"],
    benefits: ["Reduce IT carbon by 40%", "Lower energy costs by 30%", "Meet ESG targets", "Improve sustainability ratings"],
    link: "/services/it-green-it-optimization",
    contactInfo
  },
  {
    id: "it-api-security-platform",
    title: "API Security & Governance Platform",
    description: "Comprehensive API security with threat detection, schema validation, rate limiting, OAuth management, and API lifecycle governance.",
    category: "IT Services",
    subcategory: "Security",
    icon: "🛡️",
    price: "$1,999/month",
    features: ["API Threat Detection", "Schema Validation", "Rate Limiting", "OAuth Management", "Lifecycle Governance", "Analytics"],
    benefits: ["Prevent API breaches", "Enforce API policies", "Monitor API health", "Govern API lifecycle"],
    link: "/services/it-api-security-platform",
    contactInfo
  },
  {
    id: "it-hybrid-cloud-orchestrator",
    title: "Hybrid Cloud Orchestration Platform",
    description: "Unified management of on-premises, private cloud, and public cloud workloads with intelligent placement, cost optimization, and compliance enforcement.",
    category: "IT Services",
    subcategory: "Cloud Management",
    icon: "☁️",
    price: "$2,999/month",
    features: ["Workload Placement", "Cost Optimization", "Compliance Enforcement", "Unified Dashboard", "Auto-Scaling", "DR Integration"],
    benefits: ["Optimize cloud spend by 35%", "Unified multi-cloud view", "Enforce compliance", "Simplify operations"],
    link: "/services/it-hybrid-cloud-orchestrator",
    contactInfo
  },
  {
    id: "it-enterprise-wifi-6e",
    title: "Enterprise Wi-Fi 6E/7 Network Design",
    description: "Design and deploy next-generation wireless networks with Wi-Fi 6E/7, spectrum analysis, capacity planning, and security hardening for high-density environments.",
    category: "IT Services",
    subcategory: "Networking",
    icon: "📶",
    price: "$4,999/project",
    features: ["Wi-Fi 6E/7 Design", "Spectrum Analysis", "Capacity Planning", "Security Hardening", "Performance Testing", "Coverage Mapping"],
    benefits: ["10x faster wireless", "Support 1000+ devices", "Eliminate dead zones", "Enterprise security"],
    link: "/services/it-enterprise-wifi-6e",
    contactInfo
  },
  {
    id: "it-data-sovereignty-platform",
    title: "Data Sovereignty & Residency Platform",
    description: "Ensure data stays within required jurisdictions with automated residency enforcement, cross-border transfer management, and compliance monitoring.",
    category: "IT Services",
    subcategory: "Compliance",
    icon: "🗺️",
    price: "$1,799/month",
    features: ["Residency Enforcement", "Transfer Management", "Jurisdiction Mapping", "Compliance Monitor", "Audit Logs", "Policy Engine"],
    benefits: ["Ensure data sovereignty", "Automate compliance", "Prevent data violations", "Simplify cross-border rules"],
    link: "/services/it-data-sovereignty-platform",
    contactInfo
  },
  // Micro-SaaS (8 new)
  {
    id: "saas-churn-prediction-engine",
    title: "AI Churn Prediction & Prevention Platform",
    description: "Predict customer churn 90 days in advance with behavioral analysis, engagement scoring, automated retention campaigns, and intervention recommendations.",
    category: "Micro-SaaS",
    subcategory: "Customer Success",
    icon: "🔮",
    price: "$129/month",
    features: ["90-Day Prediction", "Behavioral Analysis", "Engagement Scoring", "Retention Campaigns", "Intervention Alerts", "Revenue Impact"],
    benefits: ["Reduce churn by 35%", "Predict churn 90 days early", "Automate retention", "Save at-risk revenue"],
    link: "/services/saas-churn-prediction-engine",
    contactInfo
  },
  {
    id: "saas-pricing-optimizer",
    title: "AI Pricing Optimization Platform",
    description: "Dynamic pricing optimization with competitor monitoring, price elasticity modeling, A/B testing, and revenue maximization algorithms.",
    category: "Micro-SaaS",
    subcategory: "Revenue",
    icon: "💲",
    price: "$199/month",
    features: ["Dynamic Pricing", "Competitor Monitoring", "Elasticity Modeling", "A/B Testing", "Revenue Maximization", "Price Alerts"],
    benefits: ["Increase revenue by 15%", "Optimize pricing in real-time", "Monitor competitors", "Test pricing strategies"],
    link: "/services/saas-pricing-optimizer",
    contactInfo
  },
  {
    id: "saas-vendor-management",
    title: "Vendor Management & Procurement Platform",
    description: "Manage vendor relationships with contract tracking, performance scoring, risk assessment, spend analytics, and automated renewal management.",
    category: "Micro-SaaS",
    subcategory: "Procurement",
    icon: "🤝",
    price: "$89/month",
    features: ["Contract Tracking", "Performance Scoring", "Risk Assessment", "Spend Analytics", "Renewal Management", "Compliance Monitor"],
    benefits: ["Reduce vendor costs by 20%", "Improve vendor performance", "Mitigate vendor risk", "Automate renewals"],
    link: "/services/saas-vendor-management",
    contactInfo
  },
  {
    id: "saas-content-calendar-ai",
    title: "AI Content Calendar & Publishing Platform",
    description: "AI-powered content planning with topic suggestions, optimal posting times, cross-platform scheduling, and performance analytics.",
    category: "Micro-SaaS",
    subcategory: "Marketing",
    icon: "📆",
    price: "$49/month",
    features: ["AI Topic Suggestions", "Optimal Timing", "Cross-Platform", "Performance Analytics", "Content Recycling", "Team Collaboration"],
    benefits: ["Increase engagement by 40%", "Save 10 hours/week", "Optimize posting times", "Plan content efficiently"],
    link: "/services/saas-content-calendar-ai",
    contactInfo
  },
  {
    id: "saas-meeting-cost-calculator",
    title: "Meeting Cost Calculator & Optimizer",
    description: "Calculate the real cost of meetings, suggest optimizations, enforce agendas, track action items, and reduce meeting overload across the organization.",
    category: "Micro-SaaS",
    subcategory: "Productivity",
    icon: "⏰",
    price: "$9/user/month",
    features: ["Cost Calculator", "Meeting Audits", "Agenda Enforcement", "Action Tracking", "Decline Suggestions", "Productivity Reports"],
    benefits: ["Reduce meeting costs by 50%", "Eliminate unnecessary meetings", "Improve meeting quality", "Reclaim productive hours"],
    link: "/services/saas-meeting-cost-calculator",
    contactInfo
  },
  {
    id: "saas-customer-health-monitor",
    title: "Customer Health Score Dashboard",
    description: "Real-time customer health monitoring with usage analytics, support ticket trends, NPS tracking, expansion opportunity identification, and risk scoring.",
    category: "Micro-SaaS",
    subcategory: "Customer Success",
    icon: "💚",
    price: "$79/month",
    features: ["Health Scoring", "Usage Analytics", "Support Trends", "NPS Tracking", "Expansion ID", "Risk Alerts"],
    benefits: ["Prevent churn proactively", "Identify upsell opportunities", "Improve satisfaction", "Data-driven success plans"],
    link: "/services/saas-customer-health-monitor",
    contactInfo
  },
  {
    id: "saas-freelancer-platform",
    title: "Freelancer & Gig Worker Management Platform",
    description: "Manage freelance workforce with project assignment, time tracking, payment processing, contract management, and performance reviews.",
    category: "Micro-SaaS",
    subcategory: "HR Tech",
    icon: "🎯",
    price: "$29/month",
    features: ["Project Assignment", "Time Tracking", "Payment Processing", "Contract Management", "Performance Reviews", "Tax Documents"],
    benefits: ["Streamline freelancer management", "Automate payments", "Track project costs", "Ensure compliance"],
    link: "/services/saas-freelancer-platform",
    contactInfo
  },
  {
    id: "saas-sla-monitoring-platform",
    title: "SLA Monitoring & Compliance Platform",
    description: "Monitor SLA compliance across all services with real-time dashboards, automated breach alerts, penalty calculations, and customer reporting.",
    category: "Micro-SaaS",
    subcategory: "Operations",
    icon: "📊",
    price: "$149/month",
    features: ["Real-Time Monitoring", "Breach Alerts", "Penalty Calculator", "Customer Reports", "Trend Analysis", "SLA Builder"],
    benefits: ["Maintain 99.9% SLA compliance", "Prevent SLA breaches", "Automate reporting", "Reduce penalty costs"],
    link: "/services/saas-sla-monitoring-platform",
    contactInfo
  }
];

services.push(...newServices);
fs.writeFileSync(jsonPath, JSON.stringify(services, null, 2));
console.log(`✅ Added ${newServices.length} new services. Total: ${services.length}`);

// Update servicesData.ts
const tsPath = path.join(__dirname, 'app/data/servicesData.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

const tsEntries = newServices.map(s => {
  const featuresStr = s.features.map(f => `"${f}"`).join(', ');
  const benefitsStr = (s.benefits || []).map(b => `"${b}"`).join(', ');
  return `  {
    id: "${s.id}",
    title: "${s.title}",
    description: "${s.description}",
    category: "${s.category}",
    subcategory: "${s.subcategory}",
    icon: "${s.icon}",
    price: "${s.price}",
    features: [${featuresStr}],
    benefits: [${benefitsStr}],
    link: "${s.link}",
    contactInfo: {
      mobile: "${s.contactInfo.mobile}",
      email: "${s.contactInfo.email}",
      address: "${s.contactInfo.address}"
    }
  }`;
}).join(',\n');

const insertPoint = tsContent.lastIndexOf('];');
if (insertPoint !== -1) {
  const beforeInsert = tsContent.substring(0, insertPoint).trim();
  const needsComma = !beforeInsert.endsWith(',') && !beforeInsert.endsWith('[');
  const insertion = (needsComma ? ',\n' : '\n') + tsEntries + '\n';
  tsContent = tsContent.substring(0, insertPoint) + insertion + tsContent.substring(insertPoint);
}

const exportEntries = newServices.map(s => 
  `export const ${s.id.replace(/-/g, '_')} = allServices.find(s => s.id === "${s.id}");`
).join('\n');

tsContent += '\n\n// V306-V310 Service Exports\n' + exportEntries + '\n';
fs.writeFileSync(tsPath, tsContent);
console.log('✅ Updated servicesData.ts');
