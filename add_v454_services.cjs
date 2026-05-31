const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  // V454 - Time Zone Optimizer Services
  {
    "id": "ai-email-timezone-optimizer",
    "title": "AI Email Time Zone Optimizer",
    "description": "Intelligently schedules email sends for optimal recipient time zones. Detects recipient locations, validates work hours, and suggests best send times for global teams. Never send emails at 3 AM again.",
    "category": "AI Services",
    "icon": "🌍",
    "price": "$39/month",
    "features": ["Time zone detection", "Work hours validation", "Optimal send scheduling", "Global team support", "Calendar integration"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "global-email-scheduler",
    "title": "Global Email Scheduler Pro",
    "description": "Enterprise-grade email scheduling for multinational teams. Automatically detects recipient time zones, respects work-life balance, and ensures emails arrive during business hours across all regions.",
    "category": "Micro-SaaS",
    "icon": "⏰",
    "price": "$59/month",
    "features": ["Multi-timezone support", "Work-life balance", "Regional scheduling", "Team coordination", "Analytics dashboard"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // V455 - Attachment Intelligence Services
  {
    "id": "ai-email-attachment-scanner",
    "title": "AI Email Attachment Scanner",
    "description": "Advanced attachment security and intelligence. Scans files for sensitive data (SSN, credit cards, passwords), validates file types, and prevents accidental data leaks. Essential for compliance.",
    "category": "Security Services",
    "icon": "🔒",
    "price": "$69/month",
    "features": ["Sensitive data detection", "File validation", "Size optimization", "Compliance checking", "Data loss prevention"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-attachment-compliance",
    "title": "Email Attachment Compliance Suite",
    "description": "Ensure email attachments meet GDPR, HIPAA, PCI-DSS, and SOX compliance requirements. Auto-detects PII, PHI, and financial data before sending. Generates compliance audit trails.",
    "category": "Security Services",
    "icon": "⚖️",
    "price": "$89/month",
    "features": ["GDPR compliance", "HIPAA validation", "PCI-DSS scanning", "Audit trails", "Auto-redaction"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // V456 - Workflow Automation Services
  {
    "id": "ai-email-workflow-automation",
    "title": "AI Email Workflow Automation",
    "description": "Automate email-driven workflows with intelligent rules. Auto-create support tickets, sales leads, calendar events, and escalation alerts. Saves 15+ hours per week on manual tasks.",
    "category": "Automation Services",
    "icon": "⚙️",
    "price": "$79/month",
    "features": ["Rule engine", "Auto-ticketing", "Lead creation", "Calendar sync", "Escalation alerts"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-to-crm-automation",
    "title": "Email-to-CRM Automation",
    "description": "Automatically sync emails with your CRM. Create contacts, update deals, log activities, and trigger workflows. Integrates with Salesforce, HubSpot, Pipedrive, and 20+ CRMs.",
    "category": "Automation Services",
    "icon": "🔄",
    "price": "$99/month",
    "features": ["CRM integration", "Auto-sync", "Deal updates", "Activity logging", "Workflow triggers"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "smart-email-routing-system",
    "title": "Smart Email Routing System",
    "description": "Intelligent email routing that automatically directs emails to the right team member based on content analysis, expertise, and workload. Reduces response times by 60%.",
    "category": "IT Services",
    "icon": "🎯",
    "price": "$69/month",
    "features": ["Content-based routing", "Expertise matching", "Load balancing", "Priority queues", "Analytics"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // V457 - Sentiment Prediction Services
  {
    "id": "ai-email-sentiment-predictor",
    "title": "AI Email Sentiment Predictor",
    "description": "Predict how recipients will react to your emails before sending. Analyzes tone, emotions, and engagement risk. Suggests improvements to maximize positive responses and minimize conflicts.",
    "category": "AI Services",
    "icon": "🔮",
    "price": "$49/month",
    "features": ["Sentiment analysis", "Reaction prediction", "Tone suggestions", "Emotion detection", "Engagement scoring"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-tone-analyzer-pro",
    "title": "Email Tone Analyzer Pro",
    "description": "Advanced tone analysis for professional emails. Detects formality, urgency, emotion, and cultural sensitivity. Helps you write emails that resonate with any audience.",
    "category": "AI Services",
    "icon": "🎭",
    "price": "$39/month",
    "features": ["Tone detection", "Formality scoring", "Cultural sensitivity", "Audience adaptation", "Real-time feedback"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // Additional innovative services
  {
    "id": "ai-email-burnout-prevention",
    "title": "AI Email Burnout Prevention",
    "description": "Detects email overload and burnout risk. Monitors response times, email volume, after-hours work, and stress indicators. Provides actionable insights to maintain work-life balance.",
    "category": "Micro-SaaS",
    "icon": "🧘",
    "price": "$34/month",
    "features": ["Burnout detection", "Workload monitoring", "After-hours alerts", "Stress indicators", "Wellness insights"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-translation-hub",
    "title": "AI Email Translation Hub",
    "description": "Real-time email translation with cultural adaptation. Supports 100+ languages with context-aware translations. Preserves tone, formality, and business etiquette across cultures.",
    "category": "AI Services",
    "icon": "🌐",
    "price": "$59/month",
    "features": ["100+ languages", "Cultural adaptation", "Tone preservation", "Business etiquette", "Auto-detection"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-meeting-minutes",
    "title": "AI Email Meeting Minutes Generator",
    "description": "Automatically generates meeting minutes from email discussions. Extracts decisions, action items, attendees, and deadlines. Distributes minutes to all participants.",
    "category": "Micro-SaaS",
    "icon": "📋",
    "price": "$44/month",
    "features": ["Auto-generation", "Decision extraction", "Action tracking", "Attendee logging", "Auto-distribution"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-ab-testing",
    "title": "AI Email A/B Testing Platform",
    "description": "Test subject lines, content, and send times to optimize email performance. Automatically selects winners and learns from results. Increases open rates by 40%.",
    "category": "Marketing Services",
    "icon": "🧪",
    "price": "$69/month",
    "features": ["Subject line testing", "Content variants", "Send time optimization", "Auto-winner selection", "Performance analytics"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-backup-recovery",
    "title": "AI Email Backup & Recovery",
    "description": "Automated email backup with intelligent recovery. Protects against data loss with real-time backups, version history, and instant recovery. 99.99% uptime guarantee.",
    "category": "IT Services",
    "icon": "💾",
    "price": "$49/month",
    "features": ["Real-time backup", "Version history", "Instant recovery", "Encryption", "99.99% uptime"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-signature-generator",
    "title": "AI Email Signature Generator",
    "description": "Create professional, branded email signatures with AI. Includes social links, legal disclaimers, and tracking pixels. A/B test signature variations for maximum engagement.",
    "category": "Micro-SaaS",
    "icon": "✍️",
    "price": "$19/month",
    "features": ["AI design", "Brand consistency", "Social links", "Legal disclaimers", "Tracking pixels"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  }
];

let added = 0;
for (const svc of newServices) {
  if (!services.find(s => s.id === svc.id)) {
    services.push(svc);
    added++;
  }
}

fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log(`✅ Added ${added} new services. Total: ${services.length}`);
