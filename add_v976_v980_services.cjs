const fs = require('fs');
const path = require('path');

const CONTACT = {
  mobile: "+1 302 464 0950",
  email: "kleber@ziontechgroup.com",
  address: "364 E Main St STE 1008, Middletown, DE 19709"
};

const newServices = [
  // V976 - Thread Visualizer (6 services)
  {
    id: "v976-thread-visualizer",
    name: "AI Email Thread Visualizer V976",
    category: "AI Email Intelligence",
    icon: "📧",
    price: "From $299/month",
    description: "Creates interactive thread graphs showing participants, topics, decision flow, and conversation progression for complex email discussions.",
    features: ["Participant Mapping", "Topic Flow Analysis", "Decision Point Tracking", "Complexity Metrics", "Interactive Graphs", "Thread Summaries"],
    benefits: ["Understand complex threads instantly", "Visualize decision flow", "Track conversation progression"],
    contactInfo: CONTACT,
    link: "/services/v976-thread-visualizer"
  },
  {
    id: "v976-participant-mapper",
    name: "Thread Participant Mapper",
    category: "AI Email Intelligence",
    icon: "👥",
    price: "From $149/month",
    description: "Maps all participants in email threads with role identification and communication patterns.",
    features: ["Role Detection", "Communication Patterns", "Participant Graphs", "Influence Analysis", "Engagement Tracking"],
    benefits: ["Know who's involved", "Understand dynamics", "Identify key stakeholders"],
    contactInfo: CONTACT,
    link: "/services/v976-participant-mapper"
  },
  {
    id: "v976-decision-flow-tracker",
    name: "Decision Flow Tracker",
    category: "AI Email Intelligence",
    icon: "🎯",
    price: "From $199/month",
    description: "Tracks decision points through email threads, showing how decisions evolve and who made them.",
    features: ["Decision Detection", "Evolution Tracking", "Decision Maker ID", "Timeline View", "Audit Trail"],
    benefits: ["Track decision history", "Understand rationale", "Accountability tracking"],
    contactInfo: CONTACT,
    link: "/services/v976-decision-flow-tracker"
  },
  {
    id: "v976-topic-flow-analyzer",
    name: "Topic Flow Analyzer",
    category: "AI Email Intelligence",
    icon: "🔄",
    price: "From $129/month",
    description: "Analyzes how topics flow through email threads, identifying topic shifts and convergences.",
    features: ["Topic Detection", "Flow Visualization", "Shift Tracking", "Convergence Points", "Topic History"],
    benefits: ["Follow topic evolution", "Identify key discussions", "Understand context"],
    contactInfo: CONTACT,
    link: "/services/v976-topic-flow-analyzer"
  },
  {
    id: "v976-complexity-metrics",
    name: "Thread Complexity Metrics",
    category: "AI Email Intelligence",
    icon: "📊",
    price: "From $99/month",
    description: "Calculates thread complexity based on participants, depth, length, and decision density.",
    features: ["Complexity Scoring", "Participant Count", "Depth Analysis", "Length Metrics", "Decision Density"],
    benefits: ["Prioritize complex threads", "Resource allocation", "Time estimation"],
    contactInfo: CONTACT,
    link: "/services/v976-complexity-metrics"
  },
  {
    id: "v976-thread-summary-generator",
    name: "Thread Summary Generator",
    category: "AI Email Intelligence",
    icon: "📝",
    price: "From $179/month",
    description: "Generates comprehensive thread summaries with key participants, decisions, and action items.",
    features: ["Auto-Summarization", "Key Points Extraction", "Decision Summary", "Action Items", "Participant List"],
    benefits: ["Quick thread understanding", "Save reading time", "Better handoffs"],
    contactInfo: CONTACT,
    link: "/services/v976-thread-summary-generator"
  },

  // V977 - Auto-Responder (6 services)
  {
    id: "v977-auto-responder",
    name: "AI Email Auto-Responder V977",
    category: "AI Email Intelligence",
    icon: "🤖",
    price: "From $249/month",
    description: "Context-aware auto-replies for OOO, after-hours, and common queries with intelligent response generation.",
    features: ["Scenario Detection", "Template Generation", "Personalization", "Quality Checking", "Timing Optimization", "Multi-Scenario Support"],
    benefits: ["24/7 intelligent responses", "Professional auto-replies", "Time savings"],
    contactInfo: CONTACT,
    link: "/services/v977-auto-responder"
  },
  {
    id: "v977-ooo-responder",
    name: "Smart OOO Responder",
    category: "AI Email Intelligence",
    icon: "🏖️",
    price: "From $99/month",
    description: "Intelligent out-of-office auto-responder with backup contact routing and return date handling.",
    features: ["OOO Detection", "Backup Routing", "Return Date Handling", "Urgency Filtering", "Custom Templates"],
    benefits: ["Professional OOO messages", "Urgent matter routing", "Seamless coverage"],
    contactInfo: CONTACT,
    link: "/services/v977-ooo-responder"
  },
  {
    id: "v977-common-questions-responder",
    name: "Common Questions Auto-Responder",
    category: "AI Email Intelligence",
    icon: "❓",
    price: "From $149/month",
    description: "Auto-responds to common questions about pricing, features, support, contact, and hours.",
    features: ["Question Detection", "Info Links", "Personalized Responses", "Category Routing", "Quality Scoring"],
    benefits: ["Instant answers", "Reduced support load", "Better customer experience"],
    contactInfo: CONTACT,
    link: "/services/v977-common-questions-responder"
  },
  {
    id: "v977-after-hours-responder",
    name: "After-Hours Auto-Responder",
    category: "AI Email Intelligence",
    icon: "🌙",
    price: "From $79/month",
    description: "Acknowledges after-hours emails with appropriate response time expectations.",
    features: ["Time Detection", "Business Hours Config", "Response Time Setting", "Urgency Handling", "Custom Messages"],
    benefits: ["Set expectations", "Professional acknowledgment", "Work-life balance"],
    contactInfo: CONTACT,
    link: "/services/v977-after-hours-responder"
  },
  {
    id: "v977-response-personalizer",
    name: "Auto-Response Personalizer",
    category: "AI Email Intelligence",
    icon: "🎨",
    price: "From $129/month",
    description: "Personalizes auto-responses with sender name, context, and appropriate tone.",
    features: ["Name Extraction", "Context Awareness", "Tone Matching", "Personalization Scoring", "Template Filling"],
    benefits: ["Human-like responses", "Better engagement", "Professional touch"],
    contactInfo: CONTACT,
    link: "/services/v977-response-personalizer"
  },
  {
    id: "v977-response-quality-checker",
    name: "Auto-Response Quality Checker",
    category: "AI Email Intelligence",
    icon: "✅",
    price: "From $89/month",
    description: "Ensures auto-responses meet quality standards before sending.",
    features: ["Quality Scoring", "Content Review", "Personalization Check", "Link Validation", "Length Optimization"],
    benefits: ["Quality assurance", "Professional responses", "Continuous improvement"],
    contactInfo: CONTACT,
    link: "/services/v977-response-quality-checker"
  },

  // V978 - Email Analytics (6 services)
  {
    id: "v978-email-analytics-dashboard",
    name: "AI Email Analytics Dashboard V978",
    category: "AI Email Intelligence",
    icon: "📊",
    price: "From $349/month",
    description: "Team-wide email metrics: volume, response times, sentiment trends, engagement, and performance analytics.",
    features: ["Volume Tracking", "Response Time Analysis", "Sentiment Analysis", "Engagement Metrics", "Category Distribution", "Team Performance"],
    benefits: ["Data-driven decisions", "Performance insights", "Team optimization"],
    contactInfo: CONTACT,
    link: "/services/v978-email-analytics-dashboard"
  },
  {
    id: "v978-response-time-tracker",
    name: "Response Time Tracker",
    category: "AI Email Intelligence",
    icon: "⏱️",
    price: "From $149/month",
    description: "Tracks email response times with SLA compliance and performance benchmarking.",
    features: ["Time Tracking", "SLA Compliance", "Performance Benchmarking", "Trend Analysis", "Alert System"],
    benefits: ["SLA compliance", "Performance improvement", "Accountability"],
    contactInfo: CONTACT,
    link: "/services/v978-response-time-tracker"
  },
  {
    id: "v978-sentiment-trends",
    name: "Email Sentiment Trends",
    category: "AI Email Intelligence",
    icon: "📈",
    price: "From $179/month",
    description: "Tracks sentiment trends over time to identify customer satisfaction patterns.",
    features: ["Sentiment Tracking", "Trend Analysis", "Polarity Detection", "Alert System", "Historical View"],
    benefits: ["Customer satisfaction insights", "Early warning system", "Trend identification"],
    contactInfo: CONTACT,
    link: "/services/v978-sentiment-trends"
  },
  {
    id: "v978-engagement-metrics",
    name: "Email Engagement Metrics",
    category: "AI Email Intelligence",
    icon: "📉",
    price: "From $129/month",
    description: "Measures email engagement through word count, questions, attachments, and thread depth.",
    features: ["Engagement Scoring", "Word Count Analysis", "Question Detection", "Attachment Tracking", "Depth Metrics"],
    benefits: ["Understand engagement", "Identify hot leads", "Improve communication"],
    contactInfo: CONTACT,
    link: "/services/v978-engagement-metrics"
  },
  {
    id: "v978-category-distribution",
    name: "Email Category Distribution",
    category: "AI Email Intelligence",
    icon: "🗂️",
    price: "From $99/month",
    description: "Categorizes emails by type and tracks distribution across teams and time.",
    features: ["Auto-Categorization", "Distribution Tracking", "Trend Analysis", "Team Breakdown", "Volume Metrics"],
    benefits: ["Workload understanding", "Resource allocation", "Trend identification"],
    contactInfo: CONTACT,
    link: "/services/v978-category-distribution"
  },
  {
    id: "v978-team-performance",
    name: "Team Performance Analytics",
    category: "AI Email Intelligence",
    icon: "👥",
    price: "From $199/month",
    description: "Tracks team-wide email performance metrics with benchmarking and trend analysis.",
    features: ["Team Metrics", "Performance Benchmarking", "Response Analysis", "Sentiment Tracking", "Engagement Scoring"],
    benefits: ["Team optimization", "Performance insights", "Accountability"],
    contactInfo: CONTACT,
    link: "/services/v978-team-performance"
  },

  // V979 - Data Loss Prevention (6 services)
  {
    id: "v979-data-loss-prevention",
    name: "AI Email Data Loss Prevention V979",
    category: "AI Email Intelligence",
    icon: "🔒",
    price: "From $499/month",
    description: "Detects sensitive data (SSN, credit cards, credentials, PII) before sending to prevent data breaches.",
    features: ["Pattern Detection", "Context Analysis", "Risk Assessment", "Compliance Checking", "Attachment Scanning", "Recommendation Engine"],
    benefits: ["Prevent data breaches", "Compliance assurance", "Risk mitigation"],
    contactInfo: CONTACT,
    link: "/services/v979-data-loss-prevention"
  },
  {
    id: "v979-pii-detector",
    name: "PII Detection Engine",
    category: "AI Email Intelligence",
    icon: "🔍",
    price: "From $249/month",
    description: "Detects personally identifiable information (PII) in emails including SSN, credit cards, and personal data.",
    features: ["SSN Detection", "Credit Card Detection", "Email Detection", "Phone Detection", "DOB Detection", "IP Detection"],
    benefits: ["PII protection", "Compliance", "Risk prevention"],
    contactInfo: CONTACT,
    link: "/services/v979-pii-detector"
  },
  {
    id: "v979-credential-scanner",
    name: "Credential Scanner",
    category: "AI Email Intelligence",
    icon: "🔑",
    price: "From $199/month",
    description: "Scans emails for passwords, API keys, tokens, and other credentials before sending.",
    features: ["Password Detection", "API Key Detection", "Token Detection", "Secret Key Detection", "Masking"],
    benefits: ["Credential protection", "Security assurance", "Breach prevention"],
    contactInfo: CONTACT,
    link: "/services/v979-credential-scanner"
  },
  {
    id: "v979-compliance-checker",
    name: "Email Compliance Checker",
    category: "AI Email Intelligence",
    icon: "✅",
    price: "From $179/month",
    description: "Checks emails for compliance with data protection policies and regulations.",
    features: ["Policy Checking", "Violation Detection", "Compliance Scoring", "Recommendation Engine", "Audit Trail"],
    benefits: ["Regulatory compliance", "Policy enforcement", "Risk mitigation"],
    contactInfo: CONTACT,
    link: "/services/v979-compliance-checker"
  },
  {
    id: "v979-attachment-scanner",
    name: "Attachment Security Scanner",
    category: "AI Email Intelligence",
    icon: "📎",
    price: "From $149/month",
    description: "Scans email attachments for sensitive data and security risks.",
    features: ["Filename Analysis", "Content Scanning", "Risk Assessment", "Sensitive Keyword Detection", "Security Alerts"],
    benefits: ["Attachment security", "Data protection", "Risk prevention"],
    contactInfo: CONTACT,
    link: "/services/v979-attachment-scanner"
  },
  {
    id: "v979-risk-assessment",
    name: "Email Risk Assessment Engine",
    category: "AI Email Intelligence",
    icon: "⚠️",
    price: "From $229/month",
    description: "Assesses overall email risk based on content, recipients, and context.",
    features: ["Risk Scoring", "Context Analysis", "Recipient Validation", "Severity Assessment", "Recommendation Engine"],
    benefits: ["Risk awareness", "Informed decisions", "Breach prevention"],
    contactInfo: CONTACT,
    link: "/services/v979-risk-assessment"
  },

  // V980 - Goal Tracker (6 services)
  {
    id: "v980-goal-tracker",
    name: "AI Email Goal Tracker V980",
    category: "AI Email Intelligence",
    icon: "🎯",
    price: "From $299/month",
    description: "Tracks commitments, promises, and goals made in emails to ensure accountability and follow-through.",
    features: ["Commitment Extraction", "Deadline Tracking", "Deliverable Detection", "Goal Identification", "Stakeholder Tracking", "Follow-Up Scheduling"],
    benefits: ["Accountability tracking", "Follow-through assurance", "Goal achievement"],
    contactInfo: CONTACT,
    link: "/services/v980-goal-tracker"
  },
  {
    id: "v980-commitment-tracker",
    name: "Commitment Tracker",
    category: "AI Email Intelligence",
    icon: "✋",
    price: "From $149/month",
    description: "Extracts and tracks commitments made in emails including promises and guarantees.",
    features: ["Promise Detection", "Commitment Extraction", "Severity Assessment", "Tracking System", "Accountability"],
    benefits: ["Track promises", "Accountability", "Follow-through"],
    contactInfo: CONTACT,
    link: "/services/v980-commitment-tracker"
  },
  {
    id: "v980-deadline-tracker",
    name: "Deadline Tracker",
    category: "AI Email Intelligence",
    icon: "📅",
    price: "From $129/month",
    description: "Extracts and tracks deadlines mentioned in emails with follow-up reminders.",
    features: ["Deadline Detection", "Date Extraction", "Reminder System", "Priority Assessment", "Calendar Integration"],
    benefits: ["Never miss deadlines", "Proactive reminders", "Time management"],
    contactInfo: CONTACT,
    link: "/services/v980-deadline-tracker"
  },
  {
    id: "v980-deliverable-tracker",
    name: "Deliverable Tracker",
    category: "AI Email Intelligence",
    icon: "📦",
    price: "From $179/month",
    description: "Tracks deliverables promised in emails with status tracking and reminders.",
    features: ["Deliverable Detection", "Status Tracking", "Reminder System", "Progress Updates", "Completion Tracking"],
    benefits: ["Track deliverables", "Progress visibility", "Accountability"],
    contactInfo: CONTACT,
    link: "/services/v980-deliverable-tracker"
  },
  {
    id: "v980-follow-up-scheduler",
    name: "Follow-Up Scheduler",
    category: "AI Email Intelligence",
    icon: "🔄",
    price: "From $99/month",
    description: "Automatically schedules follow-ups based on commitments and deadlines.",
    features: ["Auto-Scheduling", "Priority-Based Timing", "Reminder System", "Calendar Integration", "Custom Rules"],
    benefits: ["Never forget follow-ups", "Timely reminders", "Better relationships"],
    contactInfo: CONTACT,
    link: "/services/v980-follow-up-scheduler"
  },
  {
    id: "v980-accountability-dashboard",
    name: "Accountability Dashboard",
    category: "AI Email Intelligence",
    icon: "📊",
    price: "From $199/month",
    description: "Dashboard showing all commitments, deadlines, and deliverables with accountability tracking.",
    features: ["Commitment Overview", "Deadline Tracking", "Deliverable Status", "Accountability Scoring", "Trend Analysis"],
    benefits: ["Accountability visibility", "Performance tracking", "Goal achievement"],
    contactInfo: CONTACT,
    link: "/services/v980-accountability-dashboard"
  },
];

// Load current services
const dataPath = path.join(__dirname, 'app', 'data', 'servicesData.json');
let services = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const existingIds = new Set(services.map(s => s.id));

let added = 0;
for (const svc of newServices) {
  if (!existingIds.has(svc.id)) {
    services.push(svc);
    existingIds.add(svc.id);
    added++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(services, null, 2));
console.log(`Added ${added} new services. Total: ${services.length}`);
