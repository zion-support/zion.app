const fs = require('fs');
const path = require('path');

const newServices = [
  // V491 - Sentiment Trajectory Predictor (5 services)
  {
    id: "v491-sentiment-trajectory-predictor",
    name: "AI Sentiment Trajectory Predictor",
    category: "AI Services",
    description: "Predicts the emotional direction of email threads BEFORE escalation happens. Uses temporal sentiment analysis to detect trends and intervene proactively with 72-hour prediction window.",
    features: ["Real-time sentiment trajectory mapping", "Escalation prediction (72-hour window)", "Proactive intervention suggestions", "Emotional momentum tracking", "Relationship health forecasting", "Crisis prevention alerts", "Sentiment velocity measurement", "Thread emotional arc visualization"],
    price: "$89/month",
    benefits: ["Prevent 80% of escalations before they happen", "Improve customer satisfaction by 45%", "Reduce churn with proactive intervention", "Track relationship health across all threads"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v491-sentiment-velocity-tracker",
    name: "AI Sentiment Velocity Tracker",
    category: "AI Services",
    description: "Measures the rate of change in email sentiment to detect acceleration toward crises or breakthroughs in business relationships.",
    features: ["Sentiment acceleration detection", "Momentum scoring", "Trend reversal alerts", "Multi-thread correlation"],
    price: "$69/month",
    benefits: ["Detect sentiment shifts 48 hours early", "Quantify emotional momentum", "Auto-alert on critical changes"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v491-relationship-health-monitor",
    name: "AI Relationship Health Monitor",
    category: "AI Services",
    description: "Continuously monitors the health of business relationships through email sentiment analysis, providing scores and actionable recommendations.",
    features: ["Relationship scoring (0-100)", "Health trend tracking", "Intervention recommendations", "Historical comparison"],
    price: "$79/month",
    benefits: ["Quantify relationship health", "Prevent relationship decay", "Data-driven account management"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v491-crisis-prevention-alerts",
    name: "AI Crisis Prevention Alert System",
    category: "AI Services",
    description: "Proactive alert system that detects email threads heading toward crisis and triggers intervention workflows before damage occurs.",
    features: ["Multi-level alert system", "Auto-escalation workflows", "Intervention templates", "Manager notification"],
    price: "$99/month",
    benefits: ["Prevent PR crises", "Reduce escalation costs by 60%", "Automated intervention triggers"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v491-emotional-momentum-dashboard",
    name: "AI Emotional Momentum Dashboard",
    category: "AI Services",
    description: "Real-time dashboard showing emotional momentum across all email threads, teams, and client relationships with predictive analytics.",
    features: ["Real-time momentum visualization", "Team sentiment heatmap", "Client health overview", "Predictive charts"],
    price: "$109/month",
    benefits: ["360° emotional intelligence view", "Team-level sentiment insights", "Executive-ready dashboards"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },

  // V492 - Meeting Intelligence Hub (5 services)
  {
    id: "v492-meeting-intelligence-hub",
    name: "AI Meeting Intelligence Hub",
    category: "AI Services",
    description: "Automatically extracts meeting details from emails, prepares agendas, generates follow-ups, and tracks action items from meeting discussions.",
    features: ["Automatic meeting detection", "Agenda extraction", "Action item tracking with deadlines", "Meeting minutes generation", "Follow-up scheduling", "Attendee optimization", "Effectiveness scoring", "Cross-meeting context linking"],
    price: "$99/month",
    benefits: ["Save 5+ hours/week on meeting admin", "Never miss an action item", "Auto-generate meeting minutes", "Track completion rates"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v492-auto-meeting-minutes",
    name: "AI Auto Meeting Minutes Generator",
    category: "AI Services",
    description: "Automatically generates comprehensive meeting minutes from email discussions, including decisions, action items, and key discussion points.",
    features: ["Auto-minutes from email threads", "Decision extraction", "Action item assignment", "Distribution automation"],
    price: "$79/month",
    benefits: ["Eliminate manual minute-taking", "Consistent documentation", "Auto-distribute to attendees"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v492-action-item-tracker",
    name: "AI Action Item Tracker Pro",
    category: "Micro SaaS",
    description: "Intelligent action item extraction from emails with deadline tracking, assignee management, and automated follow-up reminders.",
    features: ["AI extraction from emails", "Deadline tracking", "Assignee management", "Automated reminders", "Completion analytics"],
    price: "$69/month",
    benefits: ["99% action item capture rate", "Zero missed deadlines", "Accountability tracking"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v492-meeting-effectiveness-scorer",
    name: "AI Meeting Effectiveness Scorer",
    category: "Micro SaaS",
    description: "Scores meeting effectiveness based on outcomes, action item completion, and follow-through, helping teams improve meeting ROI.",
    features: ["Effectiveness scoring (0-100)", "ROI calculation", "Improvement suggestions", "Team benchmarks"],
    price: "$59/month",
    benefits: ["Improve meeting ROI by 40%", "Reduce unnecessary meetings", "Data-driven meeting culture"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v492-agenda-intelligence",
    name: "AI Agenda Intelligence Engine",
    category: "Micro SaaS",
    description: "Auto-generates meeting agendas from email context, previous meetings, and project status, ensuring productive discussions.",
    features: ["Auto-agenda generation", "Context-aware topics", "Time allocation", "Previous meeting linkage"],
    price: "$49/month",
    benefits: ["Always-prepared agendas", "Context-rich discussions", "Time-efficient meetings"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },

  // V493 - Knowledge Graph Builder (5 services)
  {
    id: "v493-knowledge-graph-builder",
    name: "AI Knowledge Graph Builder",
    category: "AI Services",
    description: "Builds a dynamic knowledge graph from email communications, mapping relationships between people, projects, topics, and decisions for organizational intelligence.",
    features: ["Automatic entity extraction", "Relationship mapping", "Topic clustering", "Decision tracking", "Expertise identification", "Knowledge gap detection", "Cross-thread linking", "Network visualization"],
    price: "$119/month",
    benefits: ["Map organizational knowledge", "Find experts instantly", "Detect knowledge gaps", "Accelerate onboarding by 60%"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v493-expertise-finder",
    name: "AI Expertise Finder",
    category: "AI Services",
    description: "Identifies subject matter experts across your organization by analyzing email communications and project involvement patterns.",
    features: ["Expert identification", "Skill mapping", "Availability tracking", "Routing recommendations"],
    price: "$79/month",
    benefits: ["Find the right expert in seconds", "Reduce knowledge silos", "Optimize resource allocation"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v493-decision-tracker",
    name: "AI Decision Tracker",
    category: "Micro SaaS",
    description: "Automatically extracts and tracks decisions made across email threads, creating an auditable decision history for your organization.",
    features: ["Decision extraction", "Decision history", "Stakeholder mapping", "Impact tracking"],
    price: "$69/month",
    benefits: ["Never lose track of decisions", "Audit-ready documentation", "Decision accountability"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v493-org-network-mapper",
    name: "AI Organization Network Mapper",
    category: "IT Services",
    description: "Maps informal organizational networks from email patterns, revealing communication flows, bottlenecks, and collaboration opportunities.",
    features: ["Network visualization", "Communication flow analysis", "Bottleneck detection", "Collaboration scoring"],
    price: "$89/month",
    benefits: ["Visualize org dynamics", "Identify bottlenecks", "Optimize team structures"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v493-knowledge-gap-detector",
    name: "AI Knowledge Gap Detector",
    category: "AI Services",
    description: "Identifies knowledge gaps in your organization by analyzing email topics, expertise distribution, and unresolved discussions.",
    features: ["Gap identification", "Training recommendations", "Hiring suggestions", "Knowledge base prioritization"],
    price: "$79/month",
    benefits: ["Proactive gap identification", "Targeted training plans", "Smarter hiring decisions"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },

  // V494 - Priority Decay Engine (5 services)
  {
    id: "v494-priority-decay-engine",
    name: "AI Priority Decay Engine",
    category: "AI Services",
    description: "Dynamically adjusts email priorities based on time elapsed, context, deadlines, response expectations, and business impact with intelligent decay models.",
    features: ["Time-decay priority calculation", "Deadline-aware escalation", "Context-sensitive adjustment", "Response expectation tracking", "Business impact scoring", "Auto priority re-ranking", "SLA compliance", "Priority fatigue prevention"],
    price: "$99/month",
    benefits: ["Always-prioritized inbox", "Never miss critical deadlines", "Reduce priority fatigue", "SLA compliance guaranteed"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v494-sla-compliance-monitor",
    name: "AI SLA Compliance Monitor",
    category: "IT Services",
    description: "Monitors email response times against SLA commitments, auto-escalating when deadlines approach and generating compliance reports.",
    features: ["SLA tracking", "Auto-escalation", "Compliance reports", "Breach prevention"],
    price: "$89/month",
    benefits: ["99.9% SLA compliance", "Prevent breaches before they happen", "Audit-ready reports"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v494-smart-inbox-prioritizer",
    name: "AI Smart Inbox Prioritizer",
    category: "Micro SaaS",
    description: "Intelligently prioritizes your inbox using AI that understands business context, deadlines, sender importance, and response expectations.",
    features: ["AI-powered prioritization", "Dynamic re-ranking", "Focus mode", "Batch processing suggestions"],
    price: "$59/month",
    benefits: ["Process inbox 3x faster", "Focus on what matters", "Reduce email anxiety"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v494-deadline-aware-escalation",
    name: "AI Deadline-Aware Escalation",
    category: "IT Services",
    description: "Automatically escalates emails as deadlines approach, using intelligent multi-channel notification to ensure nothing falls through the cracks.",
    features: ["Deadline detection", "Multi-channel escalation", "Smart notification routing", "Escalation history"],
    price: "$79/month",
    benefits: ["Zero missed deadlines", "Intelligent escalation paths", "Multi-channel coverage"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v494-priority-fatigue-prevention",
    name: "AI Priority Fatigue Prevention",
    category: "Micro SaaS",
    description: "Prevents priority inflation and alert fatigue by intelligently managing priority levels across all email communications.",
    features: ["Priority inflation detection", "Alert fatigue scoring", "Auto-rebalancing", "Focus time protection"],
    price: "$49/month",
    benefits: ["Eliminate priority inflation", "Protect focus time", "Reduce alert fatigue by 70%"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },

  // V495 - Compliance Guardian Pro (5 services)
  {
    id: "v495-compliance-guardian-pro",
    name: "AI Compliance Guardian Pro",
    category: "Security Services",
    description: "Advanced multi-framework compliance checking for GDPR, HIPAA, SOX, PCI-DSS, CCPA, and more. Prevents compliance violations before emails are sent.",
    features: ["Multi-framework scanning (8 frameworks)", "PII detection and classification", "Data residency validation", "Consent verification", "Retention policy enforcement", "Audit trail generation", "Risk scoring per email", "Automated remediation"],
    price: "$149/month",
    benefits: ["Prevent costly compliance violations", "Auto-detect PII/PHI/PCI data", "Audit-ready documentation", "Multi-framework coverage"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v495-pii-detection-shield",
    name: "AI PII Detection Shield",
    category: "Security Services",
    description: "Advanced PII detection and classification engine that identifies 12+ categories of sensitive data in emails with auto-masking capabilities.",
    features: ["12+ PII categories", "Auto-masking", "Confidence scoring", "Framework mapping"],
    price: "$89/month",
    benefits: ["Catch 99% of PII in emails", "Auto-mask sensitive data", "Regulatory compliance"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v495-gdpr-email-compliance",
    name: "AI GDPR Email Compliance Checker",
    category: "Security Services",
    description: "Specialized GDPR compliance checker for email communications, covering consent, data transfers, right to erasure, and breach notification requirements.",
    features: ["Art.6-44 compliance checks", "Consent verification", "Transfer safeguards", "Breach detection"],
    price: "$99/month",
    benefits: ["GDPR compliance assurance", "Avoid €20M+ fines", "Consent tracking"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v495-hipaa-email-guardian",
    name: "AI HIPAA Email Guardian",
    category: "Security Services",
    description: "Specialized HIPAA compliance guardian for healthcare email communications, detecting PHI exposure and ensuring encryption requirements.",
    features: ["PHI detection (18 identifiers)", "Encryption verification", "BAA compliance", "Audit logging"],
    price: "$129/month",
    benefits: ["HIPAA compliance assurance", "PHI protection", "Healthcare-grade security"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  },
  {
    id: "v495-compliance-audit-trail",
    name: "AI Compliance Audit Trail Generator",
    category: "Security Services",
    description: "Automatically generates comprehensive audit trails for all email compliance checks, ready for regulatory inspections and internal audits.",
    features: ["Auto audit trail generation", "Regulatory-ready reports", "Timestamp logging", "Violation documentation"],
    price: "$79/month",
    benefits: ["Audit-ready in minutes", "Regulatory compliance", "Legal protection"],
    contactInfo: { phone: "+1 302 464 0950", email: "kleber@ziontechgroup.com", address: "364 E Main St STE 1008, Middletown DE 19709" }
  }
];

// Read existing services
const jsonPath = path.join(__dirname, 'app/data/servicesData.json');
const tsPath = path.join(__dirname, 'app/lib/servicesData.ts');

let existingJson = [];
try {
  existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.log('No existing JSON found, starting fresh');
}

// Add new services (avoid duplicates)
const existingIds = new Set(existingJson.map(s => s.id));
let addedCount = 0;
for (const svc of newServices) {
  if (!existingIds.has(svc.id)) {
    existingJson.push(svc);
    addedCount++;
  }
}

// Write JSON
fs.writeFileSync(jsonPath, JSON.stringify(existingJson, null, 2));
console.log(`Added ${addedCount} new services to servicesData.json (Total: ${existingJson.length})`);

// Generate TS file
const namedExports = existingJson.map(s => {
  const varName = s.id.replace(/[^a-zA-Z0-9]/g, '_');
  return `export const ${varName} = ${JSON.stringify(s, null, 2)};`;
}).join('\n\n');

const allServicesArray = existingJson.map(s => {
  const varName = s.id.replace(/[^a-zA-Z0-9]/g, '_');
  return varName;
}).join(',\n  ');

const tsContent = `// Auto-generated services data - DO NOT EDIT MANUALLY
// Total services: ${existingJson.length}
// Generated: ${new Date().toISOString()}

${namedExports}

export const allServices = [
  ${allServicesArray}
];
`;

fs.writeFileSync(tsPath, tsContent);
console.log(`Updated servicesData.ts with ${existingJson.length} services`);
console.log('Done!');
