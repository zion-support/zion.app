const fs = require('fs');
const path = require('path');

const CONTACT = {
  mobile: "+1 302 464 0950",
  email: "kleber@ziontechgroup.com",
  address: "364 E Main St STE 1008, Middletown, DE 19709"
};

const newServices = [
  // V981 - Context Memory (6 services)
  {
    id: "v981-context-memory-engine",
    name: "AI Context Memory Engine V981",
    category: "AI Email Intelligence",
    icon: "🧠",
    price: "From $399/month",
    description: "Remembers past interactions with each contact for personalized responses. Enables contextual awareness and relationship building across email conversations.",
    features: ["Contact Memory Database", "Thread Context Retrieval", "Topic Continuity Analysis", "Relationship Stage Assessment", "Personalization Opportunities", "Context Gap Detection"],
    benefits: ["Build stronger relationships", "Never repeat questions", "Personalized at scale"],
    contactInfo: CONTACT,
    link: "/services/v981-context-memory-engine"
  },
  {
    id: "v981-contact-memory-database",
    name: "Contact Memory Database",
    category: "AI Email Intelligence",
    icon: "💾",
    price: "From $199/month",
    description: "Persistent memory database for all contacts tracking interactions, preferences, topics, and key facts across all communications.",
    features: ["Persistent Storage", "Interaction History", "Preference Tracking", "Topic History", "Key Facts Storage", "Search & Retrieve"],
    benefits: ["Complete contact history", "Instant recall", "Relationship intelligence"],
    contactInfo: CONTACT,
    link: "/services/v981-contact-memory-database"
  },
  {
    id: "v981-thread-context-retrieval",
    name: "Thread Context Retrieval System",
    category: "AI Email Intelligence",
    icon: "🧵",
    price: "From $179/month",
    description: "Retrieves complete context from conversation threads including participants, duration, and message history for seamless continuity.",
    features: ["Thread History", "Participant Tracking", "Duration Analysis", "Context Preservation", "Message Linking", "Conversation Flow"],
    benefits: ["Seamless conversations", "Never lose context", "Better continuity"],
    contactInfo: CONTACT,
    link: "/services/v981-thread-context-retrieval"
  },
  {
    id: "v981-topic-continuity-tracker",
    name: "Topic Continuity Tracker",
    category: "AI Email Intelligence",
    icon: "🔄",
    price: "From $149/month",
    description: "Tracks topic continuity across conversations, identifying overlapping topics and new discussion areas for contextual responses.",
    features: ["Topic Overlap Detection", "New Topic Identification", "Continuity Scoring", "Topic History", "Conversation Themes", "Context Mapping"],
    benefits: ["Maintain conversation flow", "Reference past discussions", "Build on previous topics"],
    contactInfo: CONTACT,
    link: "/services/v981-topic-continuity-tracker"
  },
  {
    id: "v981-relationship-stage-analyzer",
    name: "Relationship Stage Analyzer",
    category: "AI Email Intelligence",
    icon: "📈",
    price: "From $129/month",
    description: "Assesses relationship stage based on interaction frequency and history: new contact, introductory, developing, established, or long-term.",
    features: ["Stage Classification", "Interaction Counting", "Relationship Scoring", "Stage Progression", "Engagement Metrics", "Relationship Health"],
    benefits: ["Appropriate tone", "Relationship building", "Stage-aware communication"],
    contactInfo: CONTACT,
    link: "/services/v981-relationship-stage-analyzer"
  },
  {
    id: "v981-personalization-engine",
    name: "Context-Aware Personalization Engine",
    category: "AI Email Intelligence",
    icon: "✨",
    price: "From $249/month",
    description: "Identifies personalization opportunities based on contact memory including topic references, preference matching, and fact recall.",
    features: ["Opportunity Detection", "Topic References", "Preference Matching", "Fact Recall", "Personalization Scoring", "Context Suggestions"],
    benefits: ["Highly personalized emails", "Better engagement", "Stronger connections"],
    contactInfo: CONTACT,
    link: "/services/v981-personalization-engine"
  },

  // V982 - Meeting Minutes (6 services)
  {
    id: "v982-meeting-minutes-generator",
    name: "AI Meeting Minutes Generator V982",
    category: "AI Email Intelligence",
    icon: "📋",
    price: "From $349/month",
    description: "Auto-extracts action items, decisions, and attendees from meeting emails. Enables zero manual note-taking for meeting follow-ups.",
    features: ["Meeting Detection", "Attendee Extraction", "Action Item Extraction", "Decision Tracking", "Discussion Points", "Follow-Up Extraction"],
    benefits: ["Zero manual notes", "Complete minutes", "Instant distribution"],
    contactInfo: CONTACT,
    link: "/services/v982-meeting-minutes-generator"
  },
  {
    id: "v982-action-item-tracker",
    name: "Meeting Action Item Tracker",
    category: "AI Email Intelligence",
    icon: "✅",
    price: "From $179/month",
    description: "Extracts and tracks action items from meeting emails with assignee identification, priority assessment, and status tracking.",
    features: ["Auto-Extraction", "Assignee Detection", "Priority Assessment", "Status Tracking", "Deadline Extraction", "Progress Monitoring"],
    benefits: ["Never miss action items", "Clear ownership", "Accountability tracking"],
    contactInfo: CONTACT,
    link: "/services/v982-action-item-tracker"
  },
  {
    id: "v982-decision-logger",
    name: "Meeting Decision Logger",
    category: "AI Email Intelligence",
    icon: "🎯",
    price: "From $149/month",
    description: "Captures and logs all decisions made during meetings with confidence scoring and context preservation.",
    features: ["Decision Detection", "Context Capture", "Confidence Scoring", "Decision History", "Rationale Tracking", "Audit Trail"],
    benefits: ["Complete decision record", "Accountability", "Reference for future"],
    contactInfo: CONTACT,
    link: "/services/v982-decision-logger"
  },
  {
    id: "v982-attendee-manager",
    name: "Meeting Attendee Manager",
    category: "AI Email Intelligence",
    icon: "👥",
    price: "From $99/month",
    description: "Extracts and manages meeting attendees from email headers with role classification (organizer, required, optional).",
    features: ["Attendee Extraction", "Role Classification", "Source Tracking", "Attendance History", "Participant Analytics", "Contact Integration"],
    benefits: ["Complete attendee list", "Role awareness", "Meeting analytics"],
    contactInfo: CONTACT,
    link: "/services/v982-attendee-manager"
  },
  {
    id: "v982-meeting-details-extractor",
    name: "Meeting Details Extractor",
    category: "AI Email Intelligence",
    icon: "📅",
    price: "From $129/month",
    description: "Extracts meeting details including date, time, duration, and location/platform from email content.",
    features: ["Date Extraction", "Time Detection", "Duration Parsing", "Location Detection", "Platform Identification", "Details Validation"],
    benefits: ["Complete meeting info", "Calendar integration", "Accurate records"],
    contactInfo: CONTACT,
    link: "/services/v982-meeting-details-extractor"
  },
  {
    id: "v982-minutes-quality-assessor",
    name: "Meeting Minutes Quality Assessor",
    category: "AI Email Intelligence",
    icon: "⭐",
    price: "From $109/month",
    description: "Assesses quality of generated meeting minutes based on completeness of attendees, action items, decisions, and meeting details.",
    features: ["Quality Scoring", "Completeness Check", "Factor Analysis", "Quality Level", "Improvement Suggestions", "Quality Trends"],
    benefits: ["High-quality minutes", "Continuous improvement", "Quality assurance"],
    contactInfo: CONTACT,
    link: "/services/v982-minutes-quality-assessor"
  },

  // V983 - CRM Sync (6 services)
  {
    id: "v983-crm-sync-engine",
    name: "AI CRM Sync Engine V983",
    category: "AI Email Intelligence",
    icon: "🔗",
    price: "From $449/month",
    description: "Bi-directional sync between email data and CRM records. Enables always-current CRM data from email intelligence.",
    features: ["Contact Extraction", "Company Extraction", "Deal Signal Detection", "Activity Logging", "Sync Operations", "Conflict Resolution"],
    benefits: ["Always-current CRM", "Zero manual data entry", "Complete customer view"],
    contactInfo: CONTACT,
    link: "/services/v983-crm-sync-engine"
  },
  {
    id: "v983-contact-sync",
    name: "CRM Contact Sync",
    category: "AI Email Intelligence",
    icon: "👤",
    price: "From $199/month",
    description: "Synchronizes contact information from emails to CRM including name, email, phone, and interaction history.",
    features: ["Contact Creation", "Contact Updates", "Name Extraction", "Phone Detection", "Interaction Tracking", "Duplicate Prevention"],
    benefits: ["Current contact data", "Complete profiles", "Interaction history"],
    contactInfo: CONTACT,
    link: "/services/v983-contact-sync"
  },
  {
    id: "v983-company-sync",
    name: "CRM Company Sync",
    category: "AI Email Intelligence",
    icon: "🏢",
    price: "From $179/month",
    description: "Synchronizes company information from email domains and mentions to CRM records.",
    features: ["Domain Extraction", "Company Detection", "Company Creation", "Company Updates", "Domain Matching", "Company Intelligence"],
    benefits: ["Current company data", "Domain intelligence", "Company insights"],
    contactInfo: CONTACT,
    link: "/services/v983-company-sync"
  },
  {
    id: "v983-deal-signal-detector",
    name: "Deal Signal Detector",
    category: "AI Email Intelligence",
    icon: "💰",
    price: "From $249/month",
    description: "Detects deal signals from emails including monetary values, deal stages, and timelines for CRM opportunity tracking.",
    features: ["Monetary Detection", "Stage Identification", "Timeline Extraction", "Signal Scoring", "Opportunity Creation", "Deal Updates"],
    benefits: ["Capture all opportunities", "Accurate forecasting", "Pipeline visibility"],
    contactInfo: CONTACT,
    link: "/services/v983-deal-signal-detector"
  },
  {
    id: "v983-activity-logger",
    name: "CRM Activity Logger",
    category: "AI Email Intelligence",
    icon: "📝",
    price: "From $129/month",
    description: "Logs all email activities to CRM with type classification, direction tracking, and detailed metadata.",
    features: ["Activity Logging", "Type Classification", "Direction Tracking", "Metadata Capture", "Activity History", "Timeline View"],
    benefits: ["Complete activity history", "Interaction tracking", "Relationship timeline"],
    contactInfo: CONTACT,
    link: "/services/v983-activity-logger"
  },
  {
    id: "v983-conflict-resolver",
    name: "CRM Sync Conflict Resolver",
    category: "AI Email Intelligence",
    icon: "⚖️",
    price: "From $159/month",
    description: "Detects and resolves conflicts during CRM sync operations with manual review workflows and resolution strategies.",
    features: ["Conflict Detection", "Conflict Analysis", "Resolution Strategies", "Manual Review", "Conflict History", "Resolution Tracking"],
    benefits: ["Data integrity", "Conflict prevention", "Quality assurance"],
    contactInfo: CONTACT,
    link: "/services/v983-conflict-resolver"
  },

  // V984 - Legal Compliance (6 services)
  {
    id: "v984-legal-compliance-engine",
    name: "AI Email Legal Compliance Engine V984",
    category: "AI Email Intelligence",
    icon: "⚖️",
    price: "From $499/month",
    description: "GDPR, CAN-SPAM, CCPA compliance checking for outbound emails. Enables regulatory compliance and risk mitigation.",
    features: ["GDPR Compliance", "CAN-SPAM Compliance", "CCPA Compliance", "Data Protection", "Consent Verification", "Unsubscribe Checking"],
    benefits: ["Regulatory compliance", "Risk mitigation", "Legal protection"],
    contactInfo: CONTACT,
    link: "/services/v984-legal-compliance-engine"
  },
  {
    id: "v984-gdpr-compliance-checker",
    name: "GDPR Compliance Checker",
    category: "AI Email Intelligence",
    icon: "🇪🇺",
    price: "From $249/month",
    description: "Checks GDPR compliance including legal basis for data processing, data subject rights, and personal data handling.",
    features: ["Legal Basis Check", "Rights Information", "Data Processing", "Consent Tracking", "Compliance Scoring", "Violation Detection"],
    benefits: ["GDPR compliance", "Avoid fines", "Data protection"],
    contactInfo: CONTACT,
    link: "/services/v984-gdpr-compliance-checker"
  },
  {
    id: "v984-canspam-compliance-checker",
    name: "CAN-SPAM Compliance Checker",
    category: "AI Email Intelligence",
    icon: "🇺🇸",
    price: "From $199/month",
    description: "Checks CAN-SPAM compliance including physical address, unsubscribe mechanism, and subject line accuracy.",
    features: ["Address Checking", "Unsubscribe Verification", "Subject Validation", "Compliance Scoring", "Violation Detection", "Remediation"],
    benefits: ["CAN-SPAM compliance", "Avoid penalties", "Professional emails"],
    contactInfo: CONTACT,
    link: "/services/v984-canspam-compliance-checker"
  },
  {
    id: "v984-ccpa-compliance-checker",
    name: "CCPA Compliance Checker",
    category: "AI Email Intelligence",
    icon: "🏖️",
    price: "From $229/month",
    description: "Checks CCPA compliance including Do Not Sell links, privacy policy references, and personal information handling.",
    features: ["Do Not Sell Check", "Privacy Policy Check", "Personal Info Detection", "Compliance Scoring", "Violation Detection", "California Compliance"],
    benefits: ["CCPA compliance", "California ready", "Consumer protection"],
    contactInfo: CONTACT,
    link: "/services/v984-ccpa-compliance-checker"
  },
  {
    id: "v984-data-protection-scanner",
    name: "Data Protection Scanner",
    category: "AI Email Intelligence",
    icon: "🔒",
    price: "From $279/month",
    description: "Scans emails for sensitive data transmission including SSN, credit cards, and passwords to prevent data breaches.",
    features: ["SSN Detection", "Credit Card Detection", "Password Detection", "Sensitive Data Scanning", "Risk Assessment", "Breach Prevention"],
    benefits: ["Data breach prevention", "Sensitive data protection", "Security assurance"],
    contactInfo: CONTACT,
    link: "/services/v984-data-protection-scanner"
  },
  {
    id: "v984-consent-verifier",
    name: "Email Consent Verifier",
    category: "AI Email Intelligence",
    icon: "✅",
    price: "From $149/month",
    description: "Verifies consent for email communication and identifies transactional vs marketing emails for compliance.",
    features: ["Consent Verification", "Transactional Detection", "Marketing Classification", "Consent Tracking", "Compliance Checking", "Consent History"],
    benefits: ["Consent compliance", "Proper classification", "Legal protection"],
    contactInfo: CONTACT,
    link: "/services/v984-consent-verifier"
  },

  // V985 - Campaign Optimizer (6 services)
  {
    id: "v985-campaign-optimizer",
    name: "AI Email Campaign Optimizer V985",
    category: "AI Email Intelligence",
    icon: "🎪",
    price: "From $399/month",
    description: "Analyzes campaign emails for engagement, timing, and conversion signals. Enables higher campaign ROI through data-driven optimization.",
    features: ["Campaign Detection", "Subject Analysis", "Engagement Analysis", "CTA Analysis", "Timing Optimization", "Personalization Analysis"],
    benefits: ["Higher ROI", "Better engagement", "Data-driven campaigns"],
    contactInfo: CONTACT,
    link: "/services/v985-campaign-optimizer"
  },
  {
    id: "v985-subject-line-optimizer",
    name: "Subject Line Optimizer",
    category: "AI Email Intelligence",
    icon: "📧",
    price: "From $179/month",
    description: "Analyzes and optimizes email subject lines for length, personalization, urgency, and spam avoidance.",
    features: ["Length Optimization", "Personalization Tokens", "Urgency Detection", "Spam Trigger Check", "Score Calculation", "Improvement Suggestions"],
    benefits: ["Higher open rates", "Better engagement", "Spam avoidance"],
    contactInfo: CONTACT,
    link: "/services/v985-subject-line-optimizer"
  },
  {
    id: "v985-content-engagement-analyzer",
    name: "Content Engagement Analyzer",
    category: "AI Email Intelligence",
    icon: "📊",
    price: "From $199/month",
    description: "Analyzes email content for engagement potential including storytelling, social proof, emotional triggers, and optimal length.",
    features: ["Length Analysis", "Storytelling Detection", "Social Proof Check", "Emotional Triggers", "Engagement Questions", "Content Scoring"],
    benefits: ["Higher engagement", "Better content", "Increased conversions"],
    contactInfo: CONTACT,
    link: "/services/v985-content-engagement-analyzer"
  },
  {
    id: "v985-cta-optimizer",
    name: "Call-to-Action Optimizer",
    category: "AI Email Intelligence",
    icon: "🎯",
    price: "From $149/month",
    description: "Analyzes and optimizes CTAs for type, placement, and effectiveness with specific action recommendations.",
    features: ["CTA Detection", "Type Classification", "Placement Analysis", "Effectiveness Scoring", "CTA Optimization", "Conversion Improvement"],
    benefits: ["Higher click rates", "Better conversions", "Clear CTAs"],
    contactInfo: CONTACT,
    link: "/services/v985-cta-optimizer"
  },
  {
    id: "v985-timing-optimizer",
    name: "Email Timing Optimizer",
    category: "AI Email Intelligence",
    icon: "⏰",
    price: "From $129/month",
    description: "Optimizes email send timing based on day of week and time of day analysis for maximum engagement.",
    features: ["Day Analysis", "Time Analysis", "Optimal Timing", "Timing Scoring", "Send Time Recommendations", "Engagement Optimization"],
    benefits: ["Better timing", "Higher engagement", "Optimal delivery"],
    contactInfo: CONTACT,
    link: "/services/v985-timing-optimizer"
  },
  {
    id: "v985-ab-testing-recommender",
    name: "A/B Testing Recommender",
    category: "AI Email Intelligence",
    icon: "🧪",
    price: "From $169/month",
    description: "Generates A/B test recommendations for subject lines, CTAs, and content based on performance analysis.",
    features: ["Test Generation", "Element Selection", "Priority Scoring", "Test Recommendations", "Performance Tracking", "Optimization Insights"],
    benefits: ["Data-driven testing", "Continuous improvement", "Better performance"],
    contactInfo: CONTACT,
    link: "/services/v985-ab-testing-recommender"
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
