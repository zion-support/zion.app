const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const newServices = [
  // V676 - Meeting Effectiveness Services
  {
    "id": "meeting-roi-calculator",
    "title": "Meeting ROI Calculator",
    "description": "Calculate the return on investment for your meetings by analyzing time cost vs outcomes. Identify which meetings deliver value and which waste resources.",
    "category": "productivity",
    "price": "$299/month",
    "features": ["Time cost calculation", "Outcome tracking", "ROI scoring", "Meeting value reports"]
  },
  {
    "id": "meeting-time-waster-detector",
    "title": "Meeting Time Waster Detector",
    "description": "Automatically detect meetings that waste time and suggest alternatives. Identify recurring meetings without clear purpose.",
    "category": "productivity",
    "price": "$249/month",
    "features": ["Time waster detection", "Alternative suggestions", "Recurring meeting analysis", "Efficiency scoring"]
  },
  {
    "id": "meeting-agenda-optimizer",
    "title": "Meeting Agenda Optimizer",
    "description": "Analyze meeting agendas and suggest improvements for better structure, time allocation, and clear objectives.",
    "category": "productivity",
    "price": "$199/month",
    "features": ["Agenda analysis", "Time allocation suggestions", "Objective clarity", "Structure optimization"]
  },
  {
    "id": "meeting-action-tracker",
    "title": "Meeting Action Item Tracker",
    "description": "Track action items from meetings and monitor completion rates. Ensure accountability and follow-through on meeting decisions.",
    "category": "productivity",
    "price": "$349/month",
    "features": ["Action item extraction", "Completion tracking", "Accountability monitoring", "Follow-up reminders"]
  },
  {
    "id": "meeting-effectiveness-dashboard",
    "title": "Meeting Effectiveness Dashboard",
    "description": "Comprehensive dashboard showing meeting effectiveness metrics, trends, and optimization opportunities across your organization.",
    "category": "productivity",
    "price": "$499/month",
    "features": ["Effectiveness metrics", "Trend analysis", "Organization-wide insights", "Optimization recommendations"]
  },

  // V677 - Communication Pattern Services
  {
    "id": "response-time-analyzer",
    "title": "Response Time Analyzer",
    "description": "Analyze email response times across your team and identify bottlenecks. Optimize communication speed and efficiency.",
    "category": "communication",
    "price": "$279/month",
    "features": ["Response time tracking", "Bottleneck detection", "Team performance metrics", "Speed optimization"]
  },
  {
    "id": "communication-channel-optimizer",
    "title": "Communication Channel Optimizer",
    "description": "Optimize which communication channels your team uses for different types of messages. Improve information flow and reduce noise.",
    "category": "communication",
    "price": "$329/month",
    "features": ["Channel effectiveness analysis", "Information flow mapping", "Noise reduction", "Channel recommendations"]
  },
  {
    "id": "information-density-analyzer",
    "title": "Information Density Analyzer",
    "description": "Analyze the information density of your communications. Identify verbose emails and suggest ways to communicate more efficiently.",
    "category": "communication",
    "price": "$229/month",
    "features": ["Density scoring", "Verbosity detection", "Efficiency suggestions", "Communication quality metrics"]
  },
  {
    "id": "cross-team-collaboration-tracker",
    "title": "Cross-Team Collaboration Tracker",
    "description": "Track collaboration patterns between different teams and departments. Identify silos and improve cross-functional communication.",
    "category": "communication",
    "price": "$399/month",
    "features": ["Cross-team interaction mapping", "Silo detection", "Collaboration scoring", "Integration recommendations"]
  },
  {
    "id": "communication-bottleneck-detector",
    "title": "Communication Bottleneck Detector",
    "description": "Detect communication bottlenecks that slow down your team. Identify where information gets stuck and suggest improvements.",
    "category": "communication",
    "price": "$349/month",
    "features": ["Bottleneck detection", "Flow analysis", "Delay identification", "Process improvement suggestions"]
  },

  // V678 - Knowledge Base Services
  {
    "id": "email-knowledge-extractor",
    "title": "Email Knowledge Extractor",
    "description": "Automatically extract valuable knowledge from emails and organize it into a searchable knowledge base.",
    "category": "knowledge-management",
    "price": "$449/month",
    "features": ["Knowledge extraction", "Auto-categorization", "Searchable database", "Knowledge organization"]
  },
  {
    "id": "faq-auto-generator",
    "title": "FAQ Auto-Generator",
    "description": "Automatically generate FAQs from common questions found in emails. Build a comprehensive knowledge base without manual effort.",
    "category": "knowledge-management",
    "price": "$399/month",
    "features": ["Question detection", "Answer extraction", "FAQ generation", "Knowledge base building"]
  },
  {
    "id": "process-documentation-builder",
    "title": "Process Documentation Builder",
    "description": "Extract process documentation from emails and build comprehensive procedure guides. Capture institutional knowledge automatically.",
    "category": "knowledge-management",
    "price": "$499/month",
    "features": ["Process extraction", "Step documentation", "Procedure guides", "Knowledge capture"]
  },
  {
    "id": "expert-identification-system",
    "title": "Expert Identification System",
    "description": "Identify subject matter experts in your organization based on email communications. Find the right person for any question.",
    "category": "knowledge-management",
    "price": "$379/month",
    "features": ["Expertise detection", "Expert mapping", "Knowledge area identification", "Expert directory"]
  },
  {
    "id": "knowledge-gap-analyzer",
    "title": "Knowledge Gap Analyzer",
    "description": "Analyze your knowledge base to identify gaps and areas that need documentation. Ensure comprehensive knowledge coverage.",
    "category": "knowledge-management",
    "price": "$429/month",
    "features": ["Gap detection", "Coverage analysis", "Documentation needs", "Knowledge completeness scoring"]
  },

  // V679 - Project Risk Services
  {
    "id": "project-risk-detector",
    "title": "Project Risk Detector",
    "description": "Detect project risks from email communications before they become problems. Identify timeline, resource, and scope risks early.",
    "category": "project-management",
    "price": "$549/month",
    "features": ["Risk detection", "Early warning system", "Multi-category risk analysis", "Risk scoring"]
  },
  {
    "id": "timeline-risk-analyzer",
    "title": "Timeline Risk Analyzer",
    "description": "Analyze project timelines for risks and delays. Identify schedule pressure and suggest timeline optimizations.",
    "category": "project-management",
    "price": "$449/month",
    "features": ["Timeline analysis", "Delay detection", "Schedule pressure scoring", "Timeline optimization"]
  },
  {
    "id": "scope-creep-detector",
    "title": "Scope Creep Detector",
    "description": "Detect scope creep in project communications. Identify new requirements and scope changes that could derail projects.",
    "category": "project-management",
    "price": "$479/month",
    "features": ["Scope change detection", "Requirement tracking", "Creep scoring", "Scope control alerts"]
  },
  {
    "id": "resource-constraint-analyzer",
    "title": "Resource Constraint Analyzer",
    "description": "Analyze resource constraints that could impact project success. Identify staffing, budget, and skill gaps early.",
    "category": "project-management",
    "price": "$499/month",
    "features": ["Resource analysis", "Constraint detection", "Gap identification", "Resource optimization"]
  },
  {
    "id": "risk-mitigation-advisor",
    "title": "Risk Mitigation Advisor",
    "description": "Get actionable mitigation strategies for identified project risks. Prevent project failures with proactive risk management.",
    "category": "project-management",
    "price": "$599/month",
    "features": ["Mitigation strategies", "Action recommendations", "Risk prevention", "Proactive management"]
  },

  // V680 - Team Collaboration Services
  {
    "id": "team-collaboration-scorer",
    "title": "Team Collaboration Scorer",
    "description": "Score your team's collaboration effectiveness based on communication patterns, responsiveness, and teamwork indicators.",
    "category": "team-management",
    "price": "$399/month",
    "features": ["Collaboration scoring", "Team effectiveness metrics", "Pattern analysis", "Performance tracking"]
  },
  {
    "id": "team-responsiveness-analyzer",
    "title": "Team Responsiveness Analyzer",
    "description": "Analyze how quickly your team responds to communications. Identify responsiveness patterns and suggest improvements.",
    "category": "team-management",
    "price": "$329/month",
    "features": ["Response time analysis", "Responsiveness scoring", "Pattern detection", "Speed optimization"]
  },
  {
    "id": "inclusivity-communication-analyzer",
    "title": "Inclusivity Communication Analyzer",
    "description": "Analyze the inclusivity of team communications. Ensure all voices are heard and promote inclusive language.",
    "category": "team-management",
    "price": "$379/month",
    "features": ["Inclusivity scoring", "Language analysis", "Participation tracking", "Inclusive communication tips"]
  },
  {
    "id": "collaboration-pattern-identifier",
    "title": "Collaboration Pattern Identifier",
    "description": "Identify positive and negative collaboration patterns in your team. Understand how your team works together.",
    "category": "team-management",
    "price": "$429/month",
    "features": ["Pattern identification", "Collaboration mapping", "Teamwork analysis", "Pattern optimization"]
  },
  {
    "id": "team-improvement-recommender",
    "title": "Team Improvement Recommender",
    "description": "Get personalized recommendations to improve team collaboration. Actionable insights to build a stronger team.",
    "category": "team-management",
    "price": "$449/month",
    "features": ["Improvement recommendations", "Actionable insights", "Team building suggestions", "Collaboration enhancement"]
  }
];

services.push(...newServices);
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log(`Added ${newServices.length} new services. Total: ${services.length} services`);
