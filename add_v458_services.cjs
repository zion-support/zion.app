const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  // V458 - A/B Testing Services
  {
    "id": "ai-email-ab-testing-platform",
    "title": "AI Email A/B Testing Platform",
    "description": "Test subject lines, content variations, and send times to optimize email performance. Automatically selects winners based on open rates, click-through rates, and conversions. Increases engagement by 25-40%.",
    "category": "Marketing Services",
    "icon": "🧪",
    "price": "$79/month",
    "features": ["Multi-variant testing", "Auto-winner selection", "Performance analytics", "Learning optimization", "ROI tracking"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-subject-line-optimizer",
    "title": "Email Subject Line Optimizer",
    "description": "AI-powered subject line testing and optimization. Generates multiple variants, tests performance, and automatically selects the highest-performing subject line. Boosts open rates by 30%.",
    "category": "AI Services",
    "icon": "📧",
    "price": "$49/month",
    "features": ["Variant generation", "Performance testing", "Auto-selection", "Open rate optimization", "Best practices library"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-send-time-optimizer",
    "title": "Email Send Time Optimizer",
    "description": "Find the perfect time to send emails for maximum engagement. Tests different send times, analyzes recipient behavior patterns, and schedules emails for optimal open and response rates.",
    "category": "Marketing Services",
    "icon": "⏱️",
    "price": "$39/month",
    "features": ["Send time testing", "Behavior analysis", "Optimal scheduling", "Time zone optimization", "Engagement tracking"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // V459 - Meeting Minutes Services
  {
    "id": "ai-meeting-minutes-generator",
    "title": "AI Meeting Minutes Generator",
    "description": "Automatically generates structured meeting minutes from email discussions. Extracts decisions, action items, attendees, and deadlines. Distributes minutes to all participants. Saves 2+ hours per meeting.",
    "category": "Productivity Services",
    "icon": "📝",
    "price": "$59/month",
    "features": ["Auto-generation", "Decision extraction", "Action item tracking", "Attendee logging", "Auto-distribution"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "meeting-action-item-tracker",
    "title": "Meeting Action Item Tracker",
    "description": "Track and follow up on action items from meetings. Automatically assigns tasks, sets deadlines, sends reminders, and monitors completion. Ensures nothing falls through the cracks.",
    "category": "Productivity Services",
    "icon": "✅",
    "price": "$44/month",
    "features": ["Task assignment", "Deadline tracking", "Automated reminders", "Progress monitoring", "Completion reports"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "meeting-decision-logger",
    "title": "Meeting Decision Logger",
    "description": "Automatically captures and logs all decisions made during meetings. Creates searchable decision history, tracks decision rationale, and ensures accountability. Perfect for audit trails.",
    "category": "Productivity Services",
    "icon": "📋",
    "price": "$39/month",
    "features": ["Decision capture", "Searchable history", "Rationale tracking", "Accountability logging", "Audit trails"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // V460 - Backup & Recovery Services
  {
    "id": "ai-email-backup-recovery",
    "title": "AI Email Backup & Recovery",
    "description": "Automated email backup with intelligent recovery. Real-time backups, version history, instant recovery, and AES-256 encryption. 99.99% uptime guarantee with 3x redundancy. Never lose an important email again.",
    "category": "IT Services",
    "icon": "💾",
    "price": "$69/month",
    "features": ["Real-time backup", "Version history", "Instant recovery", "AES-256 encryption", "99.99% uptime"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-compliance-backup",
    "title": "Email Compliance Backup",
    "description": "Compliance-focused email backup for regulated industries. Meets GDPR, HIPAA, PCI-DSS, and SOX requirements. Immutable storage, retention policies, and audit trails. Legal hold support included.",
    "category": "Security Services",
    "icon": "⚖️",
    "price": "$99/month",
    "features": ["GDPR compliance", "HIPAA compliance", "PCI-DSS compliance", "SOX compliance", "Legal hold"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-disaster-recovery",
    "title": "Email Disaster Recovery",
    "description": "Enterprise-grade disaster recovery for email systems. Automated failover, instant recovery, and business continuity. RTO < 1 hour, RPO < 5 minutes. Multi-region redundancy for maximum protection.",
    "category": "IT Services",
    "icon": "🛡️",
    "price": "$149/month",
    "features": ["Automated failover", "Instant recovery", "Business continuity", "Multi-region redundancy", "RTO < 1 hour"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  // Additional diversified services
  {
    "id": "ai-email-performance-analytics",
    "title": "AI Email Performance Analytics",
    "description": "Comprehensive email performance analytics with AI insights. Track open rates, click-through rates, response times, and engagement patterns. Get actionable recommendations to improve email effectiveness.",
    "category": "Analytics Services",
    "icon": "📊",
    "price": "$59/month",
    "features": ["Performance tracking", "Engagement analytics", "AI insights", "Trend analysis", "Improvement recommendations"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "email-deliverability-monitor",
    "title": "Email Deliverability Monitor",
    "description": "Monitor and optimize email deliverability. Track spam scores, authentication (SPF, DKIM, DMARC), inbox placement, and sender reputation. Ensures your emails reach the inbox, not spam folders.",
    "category": "IT Services",
    "icon": "📬",
    "price": "$69/month",
    "features": ["Deliverability tracking", "Spam score monitoring", "Authentication checks", "Reputation management", "Inbox placement"],
    "contactInfo": { "phone": "+1 302 464 0950", "email": "kleber@ziontechgroup.com", "address": "364 E Main St STE 1008 Middletown DE 19709" }
  },
  {
    "id": "ai-email-template-library",
    "title": "AI Email Template Library",
    "description": "Pre-built, AI-optimized email templates for every business scenario. Sales, support, marketing, HR, and more. Customize with AI assistance and track template performance. 500+ professional templates.",
    "category": "Productivity Services",
    "icon": "📄",
    "price": "$29/month",
    "features": ["500+ templates", "AI customization", "Performance tracking", "Multi-category", "Best practices"],
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
