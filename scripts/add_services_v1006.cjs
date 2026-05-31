const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "app", "data", "servicesData.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const contactInfo = {
  phone: "+1 302 464 0950",
  email: "kleber@ziontechgroup.com",
  address: "364 E Main St STE 1008, Middletown, DE 19709"
};

const newServices = [
  // V1006 Intent Classifier Services
  {id: "email-intent-classifier", name: "Email Intent Classifier", category: "AI Services", description: "NLP-powered intent detection: request, complaint, inquiry, negotiation, spam. Automatically routes to correct workflow.", price: "$179/month", features: ["9 intent categories", "Confidence scoring", "Workflow routing", "Priority detection", "SLA management", "Real-time classification"], icon: "🎯", link: "/services/email-intent-classifier", contactInfo},
  {id: "smart-email-routing", name: "Smart Email Routing", category: "AI Services", description: "AI routes emails to the right team based on intent, priority, and expertise matching. Zero manual triage.", price: "$219/month", features: ["Intent-based routing", "Team matching", "Priority queues", "SLA tracking", "Escalation rules", "Performance analytics"], icon: "🔀", link: "/services/smart-email-routing", contactInfo},
  {id: "email-priority-engine", name: "Email Priority Engine", category: "AI Services", description: "Automatically prioritize emails by urgency, importance, and business impact. Never miss critical messages.", price: "$149/month", features: ["Urgency detection", "Impact scoring", "Priority ranking", "Smart filtering", "Alert system", "Productivity metrics"], icon: "⚡", link: "/services/email-priority-engine", contactInfo},
  {id: "complaint-detection-ai", name: "Complaint Detection AI", category: "AI Services", description: "Detect customer complaints instantly and escalate to customer success team. Prevent churn with proactive response.", price: "$199/month", features: ["Complaint detection", "Sentiment analysis", "Auto-escalation", "Churn prediction", "Response templates", "Satisfaction tracking"], icon: "😤", link: "/services/complaint-detection-ai", contactInfo},
  {id: "spam-filter-pro", name: "Spam Filter Pro", category: "Security Services", description: "Advanced spam detection using NLP and machine learning. Blocks phishing, scams, and unwanted messages.", price: "$129/month", features: ["NLP spam detection", "Phishing protection", "Scam blocking", "Whitelist management", "Quarantine review", "False positive reduction"], icon: "🛡️", link: "/services/spam-filter-pro", contactInfo},

  // V1007 Analytics Dashboard Services
  {id: "email-analytics-dashboard", name: "Email Analytics Dashboard", category: "Micro SaaS", description: "Real-time email metrics: response times, inbox zero rate, engagement scores, team performance, and productivity insights.", price: "$199/month", features: ["Response time tracking", "Inbox zero rate", "Productivity scoring", "Team analytics", "Trend analysis", "Custom reports"], icon: "📊", link: "/services/email-analytics-dashboard", contactInfo},
  {id: "email-productivity-coach", name: "Email Productivity Coach", category: "AI Services", description: "AI coach that analyzes your email habits and provides actionable recommendations to improve productivity.", price: "$149/month", features: ["Habit analysis", "Productivity scoring", "Personalized tips", "Goal tracking", "Progress reports", "Best practices"], icon: "🎓", link: "/services/email-productivity-coach", contactInfo},
  {id: "team-email-performance", name: "Team Email Performance Tracker", category: "Micro SaaS", description: "Track team email performance: response times, workload distribution, SLA compliance, and collaboration metrics.", price: "$249/month", features: ["Team dashboards", "Workload balancing", "SLA monitoring", "Performance rankings", "Collaboration metrics", "Manager reports"], icon: "👥", link: "/services/team-email-performance", contactInfo},
  {id: "email-sla-monitor", name: "Email SLA Monitor", category: "IT Services", description: "Monitor email SLA compliance in real-time. Get alerts for at-risk responses and track team performance.", price: "$179/month", features: ["SLA tracking", "Breach alerts", "Priority monitoring", "Team compliance", "Escalation automation", "SLA reports"], icon: "⏱️", link: "/services/email-sla-monitor", contactInfo},
  {id: "inbox-zero-tracker", name: "Inbox Zero Tracker", category: "Micro SaaS", description: "Track your inbox zero journey with gamification, streaks, and productivity insights. Make email management fun.", price: "$79/month", features: ["Inbox zero tracking", "Streak counting", "Gamification", "Achievement badges", "Productivity insights", "Daily challenges"], icon: "🎮", link: "/services/inbox-zero-tracker", contactInfo},

  // V1008 Integration Hub Services
  {id: "unified-email-inbox", name: "Unified Email Inbox", category: "IT Services", description: "Gmail + Outlook + Slack + Teams + CRM in one AI-powered interface. Eliminate context switching.", price: "$279/month", features: ["5 platform integration", "Unified search", "Smart deduplication", "Cross-platform sync", "Unified notifications", "Platform analytics"], icon: "📥", link: "/services/unified-email-inbox", contactInfo},
  {id: "email-crm-sync", name: "Email-CRM Sync Pro", category: "IT Services", description: "Automatically sync emails to CRM: log activities, update contacts, track deals, and maintain relationship history.", price: "$199/month", features: ["Auto-logging", "Contact sync", "Deal tracking", "Activity timeline", "Custom fields", "CRM analytics"], icon: "🔄", link: "/services/email-crm-sync", contactInfo},
  {id: "slack-email-bridge", name: "Slack-Email Bridge", category: "IT Services", description: "Bridge Slack and email seamlessly. Convert Slack messages to emails, sync threads, and unify notifications.", price: "$149/month", features: ["Message conversion", "Thread sync", "Notification unification", "Channel mapping", "Search integration", "Activity logs"], icon: "🌉", link: "/services/slack-email-bridge", contactInfo},
  {id: "teams-email-integration", name: "Teams-Email Integration", category: "IT Services", description: "Integrate Microsoft Teams with email: sync messages, share files, schedule meetings, and unify communications.", price: "$169/month", features: ["Message sync", "File sharing", "Meeting scheduling", "Channel integration", "Unified search", "Activity tracking"], icon: "🔗", link: "/services/teams-email-integration", contactInfo},
  {id: "cross-platform-search", name: "Cross-Platform Email Search", category: "IT Services", description: "Search across Gmail, Outlook, Slack, Teams, and CRM from one unified interface. Find anything instantly.", price: "$129/month", features: ["Unified search", "Advanced filters", "Saved searches", "Search analytics", "Cross-platform results", "Quick access"], icon: "🔍", link: "/services/cross-platform-search", contactInfo},

  // V1009 Auto-Responder Pro Services
  {id: "email-auto-responder-pro", name: "Email Auto-Responder Pro", category: "AI Services", description: "AI generates contextual auto-replies for OOO, acknowledgments, FAQ, meetings, and more. Save hours daily.", price: "$159/month", features: ["7 response templates", "Context detection", "Smart triggers", "Spam filtering", "Customization", "Response analytics"], icon: "🤖", link: "/services/email-auto-responder-pro", contactInfo},
  {id: "smart-ooo-responder", name: "Smart OOO Responder", category: "AI Services", description: "Intelligent out-of-office responses with backup contacts, return dates, and urgent matter routing.", price: "$89/month", features: ["Auto-detection", "Backup contacts", "Urgent routing", "Calendar sync", "Custom messages", "Analytics"], icon: "🏖️", link: "/services/smart-ooo-responder", contactInfo},
  {id: "email-acknowledgment-bot", name: "Email Acknowledgment Bot", category: "AI Services", description: "Automatically acknowledge receipt of important emails with personalized responses and expected response times.", price: "$99/month", features: ["Auto-acknowledgment", "Personalization", "Response time estimates", "Priority detection", "Custom templates", "Tracking"], icon: "✅", link: "/services/email-acknowledgment-bot", contactInfo},
  {id: "faq-auto-responder", name: "FAQ Auto-Responder", category: "AI Services", description: "Automatically answer common questions using your knowledge base. Reduce support tickets by 60%.", price: "$179/month", features: ["Knowledge base integration", "Question detection", "Answer generation", "Confidence scoring", "Escalation rules", "Analytics"], icon: "❓", link: "/services/faq-auto-responder", contactInfo},
  {id: "meeting-confirmation-bot", name: "Meeting Confirmation Bot", category: "AI Services", description: "Automatically confirm meetings, send calendar invites, and handle rescheduling requests.", price: "$119/month", features: ["Meeting detection", "Auto-confirmation", "Calendar integration", "Rescheduling", "Reminder sending", "Attendance tracking"], icon: "📅", link: "/services/meeting-confirmation-bot", contactInfo},

  // V1010 Learning System Services
  {id: "email-learning-system", name: "Email Learning System", category: "AI Services", description: "AI learns from your past responses to suggest personalized replies, match your tone, and improve over time.", price: "$229/month", features: ["Pattern learning", "Tone matching", "Personalized suggestions", "Style adaptation", "Common phrases", "Learning reports"], icon: "🧠", link: "/services/email-learning-system", contactInfo},
  {id: "personalized-email-assistant", name: "Personalized Email Assistant", category: "AI Services", description: "AI assistant that learns your communication style and suggests responses that sound like you.", price: "$189/month", features: ["Style learning", "Personalized suggestions", "Tone adaptation", "Phrase suggestions", "Context awareness", "Continuous improvement"], icon: "🎨", link: "/services/personalized-email-assistant", contactInfo},
  {id: "email-tone-matcher", name: "Email Tone Matcher", category: "AI Services", description: "AI matches your preferred tone for different contacts and contexts. Formal for clients, casual for team.", price: "$139/month", features: ["Tone detection", "Context-aware tone", "Contact preferences", "Tone suggestions", "Consistency tracking", "Tone reports"], icon: "🎭", link: "/services/email-tone-matcher", contactInfo},
  {id: "smart-email-templates", name: "Smart Email Templates", category: "Micro SaaS", description: "AI-powered templates that learn from your best responses and suggest improvements automatically.", price: "$109/month", features: ["Smart templates", "Learning system", "Personalization", "A/B testing", "Performance tracking", "Template library"], icon: "📝", link: "/services/smart-email-templates", contactInfo},
  {id: "email-style-coach", name: "Email Style Coach", category: "AI Services", description: "AI coach that analyzes your email style and provides feedback to improve clarity, tone, and effectiveness.", price: "$159/month", features: ["Style analysis", "Improvement suggestions", "Clarity scoring", "Tone feedback", "Best practices", "Progress tracking"], icon: "💡", link: "/services/email-style-coach", contactInfo},

  // Additional innovative services
  {id: "email-decision-support", name: "Email Decision Support AI", category: "AI Services", description: "AI analyzes emails and recommends actions: reply, forward, delegate, snooze, archive, or escalate.", price: "$209/month", features: ["Action recommendations", "Priority scoring", "Smart routing", "Delegation suggestions", "Snooze intelligence", "Decision analytics"], icon: "🎯", link: "/services/email-decision-support", contactInfo},
  {id: "email-workflow-builder", name: "Email Workflow Builder", category: "IT Services", description: "Build custom email workflows without code: auto-route, auto-respond, auto-escalate based on intelligent rules.", price: "$259/month", features: ["Visual builder", "Smart rules", "Auto-routing", "Auto-escalation", "Integration hub", "Workflow analytics"], icon: "⚙️", link: "/services/email-workflow-builder", contactInfo},
];

let added = 0;
const existingIds = new Set(data.map(s => s.id));

for (const svc of newServices) {
  if (!existingIds.has(svc.id)) {
    data.push(svc);
    existingIds.add(svc.id);
    added++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Added " + added + " new services. Total: " + data.length);
