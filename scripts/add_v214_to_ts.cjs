const fs = require('fs');
let ts = fs.readFileSync('app/data/servicesData.ts', 'utf8');
const hasCRLF = ts.includes('\r\n');
ts = ts.replace(/\r\n/g, '\n');

const newAI = `
  {
    id: 'ai-sentiment-evolution-tracker-v214',
    title: 'AI Sentiment Evolution Tracker (V214)',
    description: 'Track sentiment changes across email threads over time with automated health scoring and proactive intervention.',
    features: ['Sentiment trajectory analysis', 'Relationship health scoring', 'Trend detection', 'Intervention alerts', 'Emotion lexicon', 'Predictive modeling', 'Multi-thread tracking', 'Reply-all enforcement'],
    benefits: ['Detect relationship issues early', 'Score health 0-100', 'Prevent churn', 'Track trends automatically'],
    pricing: { basic: '$349/mo', pro: '$799/mo', enterprise: '$1999/mo' },
    contactInfo: { website: '/services/ai-sentiment-evolution-tracker-v214', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈', href: '/services/ai-sentiment-evolution-tracker-v214', popular: true, category: 'ai', industry: 'Relationship Intelligence',
  },
  {
    id: 'ai-negotiation-strategist-v215',
    title: 'AI Negotiation Strategist (V215)',
    description: 'Real-time negotiation analysis with tactic detection, leverage scoring, and strategic counter-offer recommendations.',
    features: ['7 tactic detection', 'Leverage scoring', 'BATNA assessment', 'Counter-offer generation', 'Concession tracking', 'Phase detection', 'Game theory', 'Reply-all enforcement'],
    benefits: ['Detect tactics instantly', 'Know your leverage', 'Optimal counter-offers', 'Never accept first offer'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/ai-negotiation-strategist-v215', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '♟️', href: '/services/ai-negotiation-strategist-v215', popular: true, category: 'ai', industry: 'Sales Intelligence',
  },
  {
    id: 'ai-crisis-communication-v216',
    title: 'AI Crisis Communication Engine (V216)',
    description: 'Detect crisis situations and auto-generate stakeholder-specific responses with escalation paths.',
    features: ['5 crisis types', 'Severity assessment', 'Auto-response generation', 'Stakeholder routing', 'Escalation mapping', 'Key messages', 'Avoidance guidance', 'Reply-all enforcement'],
    benefits: ['Respond in minutes', 'Never miss stakeholders', 'Best practices', 'Meet SLAs automatically'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2499/mo' },
    contactInfo: { website: '/services/ai-crisis-communication-v216', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚨', href: '/services/ai-crisis-communication-v216', popular: true, category: 'ai', industry: 'Crisis Management',
  },
  {
    id: 'ai-cultural-intelligence-v217',
    title: 'AI Cultural Intelligence Engine (V217)',
    description: 'Deep cultural context analysis for global communication across 10+ regions with taboo detection and formality adaptation.',
    features: ['10+ cultural profiles', 'Region detection', 'Cultural fit scoring', 'Taboo detection', 'Formality adaptation', 'Style matching', 'Greeting guidance', 'Reply-all enforcement'],
    benefits: ['Prevent misunderstandings', 'Adapt tone per region', 'Build global relationships', 'Avoid costly mistakes'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1799/mo' },
    contactInfo: { website: '/services/ai-cultural-intelligence-v217', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌏', href: '/services/ai-cultural-intelligence-v217', popular: true, category: 'ai', industry: 'Global Business',
  },
  {
    id: 'ai-decision-audit-trail-v218',
    title: 'AI Decision Audit Trail (V218)',
    description: 'Automatically document decisions with who decided what, when, rationale, and full audit trail for SOX/SOC2 compliance.',
    features: ['Decision extraction', 'Audit trail generation', 'Chain of custody', 'Compliance gap detection', 'Governance scoring', 'Rationale docs', 'Approver tracking', 'Reply-all enforcement'],
    benefits: ['Pass audits easily', 'Never lose decisions', 'Track approvals', 'Identify governance gaps'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-decision-audit-trail-v218', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📋', href: '/services/ai-decision-audit-trail-v218', popular: true, category: 'ai', industry: 'Compliance & Governance',
  },
  {
    id: 'ai-energy-carbon-tracker-v219',
    title: 'AI Email Energy & Carbon Tracker (V219)',
    description: 'Calculate email carbon footprint, suggest optimizations, and generate ESG sustainability reports.',
    features: ['CO2 calculation', 'Attachment optimization', 'Recipient optimization', 'ESG scoring', 'Sustainability reports', 'Carbon offset tracking', 'Waste analysis', 'Reply-all enforcement'],
    benefits: ['Measure carbon footprint', 'Reduce environmental impact', 'Generate ESG reports', 'Optimize efficiency'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/ai-energy-carbon-tracker-v219', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌱', href: '/services/ai-energy-carbon-tracker-v219', popular: true, category: 'ai', industry: 'ESG & Sustainability',
  },
  {
    id: 'ai-influence-persuasion-v220',
    title: 'AI Influence & Persuasion Analyzer (V220)',
    description: 'Detect 8 persuasion techniques, score influence effectiveness, flag ethical concerns, and suggest ethical strategies.',
    features: ['8 technique detection', 'Effectiveness scoring', 'Ethical flags', 'Diversity analysis', 'Strategic suggestions', 'Cialdini framework', 'Manipulation detection', 'Reply-all enforcement'],
    benefits: ['Detect tactics on you', 'Improve sales ethically', 'Score effectiveness', 'Flag manipulation'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1699/mo' },
    contactInfo: { website: '/services/ai-influence-persuasion-v220', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎭', href: '/services/ai-influence-persuasion-v220', popular: true, category: 'ai', industry: 'Sales & Negotiation',
  },
  {
    id: 'ai-email-ultra-mega-suite-v214-v220',
    title: 'AI Email Intelligence Ultra Suite (V214-V220)',
    description: 'All 7 breakthrough engines unified: Sentiment, Negotiation, Crisis, Cultural, Decision Audit, Carbon, and Influence.',
    features: ['V214-V220 unified', '7 specialized engines', 'Case-by-case analysis', 'Reply-all guaranteed', 'Enterprise security', 'Compliance built-in', 'Real-time analytics', 'Unlimited scalability'],
    benefits: ['Most complete email AI', 'Every email optimized', 'Enterprise compliance', 'Unmatched intelligence'],
    pricing: { basic: '$1999/mo', pro: '$4499/mo', enterprise: '$11999/mo' },
    contactInfo: { website: '/services/ai-email-ultra-mega-suite-v214-v220', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👑', href: '/services/ai-email-ultra-mega-suite-v214-v220', popular: true, category: 'ai', industry: 'Enterprise AI',
  },
  {
    id: 'ai-autonomous-agent-platform',
    title: 'AI Autonomous Agent Platform',
    description: 'Build and deploy autonomous AI agents that plan, reason, use tools, and complete complex tasks without human intervention.',
    features: ['Multi-agent orchestration', 'Tool-use framework', 'Memory and planning', 'Self-correction', 'Task decomposition', 'Progress monitoring', 'Human override', 'Agent marketplace'],
    benefits: ['Automate complex workflows', 'Self-correcting agents', 'Specialized per task', 'Reduce manual work 80%'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/ai-autonomous-agent-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖', href: '/services/ai-autonomous-agent-platform', popular: true, category: 'ai', industry: 'AI Automation',
  },
  {
    id: 'ai-rag-knowledge-platform',
    title: 'AI RAG Knowledge Platform',
    description: 'Enterprise RAG with vector databases, document ingestion, semantic search, and hallucination detection.',
    features: ['Vector DB integration', 'Multi-format ingestion', 'Semantic search', 'Hallucination detection', 'Citation tracking', 'Chunk optimization', 'Multi-model', 'Access control'],
    benefits: ['Accurate AI answers', 'Zero hallucination', 'Search all documents', 'Enterprise access control'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-rag-knowledge-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍', href: '/services/ai-rag-knowledge-platform', popular: true, category: 'ai', industry: 'Knowledge AI',
  },
  {
    id: 'ai-voice-agent-platform',
    title: 'AI Voice Agent Platform',
    description: 'Deploy AI voice agents for customer service, sales, and support with natural conversations and CRM integration.',
    features: ['Natural conversations', 'Multi-language', 'Sentiment detection', 'Call routing', 'CRM integration', 'Call analytics', 'Custom personas', '24/7 availability'],
    benefits: ['Handle 80% of calls', 'Human-like conversations', 'Reduce costs 60%', 'Available 24/7'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1799/mo' },
    contactInfo: { website: '/services/ai-voice-agent-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎙️', href: '/services/ai-voice-agent-platform', popular: true, category: 'ai', industry: 'Voice AI',
  },
  {
    id: 'ai-predictive-maintenance',
    title: 'AI Predictive Maintenance Platform',
    description: 'Predict equipment failures using sensor data, vibration analysis, and ML models. Reduce downtime by 50%.',
    features: ['Sensor analysis', 'Vibration detection', 'Thermal imaging', 'Failure prediction', 'Maintenance scheduling', 'Cost optimization', 'Health scoring', 'IoT integration'],
    benefits: ['Predict failures early', 'Reduce downtime 50%', 'Optimize schedules', 'Extend lifespan'],
    pricing: { basic: '$699/mo', pro: '$1499/mo', enterprise: '$3999/mo' },
    contactInfo: { website: '/services/ai-predictive-maintenance', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔧', href: '/services/ai-predictive-maintenance', popular: true, category: 'ai', industry: 'Industrial AI',
  },`;

const newIT = `
  {
    id: 'it-platform-engineering',
    title: 'Platform Engineering & IDP',
    description: 'Build Internal Developer Platforms with self-service infrastructure and golden paths.',
    features: ['Self-service infra', 'Golden paths', 'Service catalog', 'Developer portal', 'CI/CD templates', 'Environment provisioning', 'Cost visibility', 'Productivity metrics'],
    benefits: ['Ship 3x faster', 'Self-service', 'Standardize deployments', 'Reduce ops toil 70%'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/it-platform-engineering', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏗️', href: '/services/it-platform-engineering', popular: true, category: 'it', industry: 'Developer Experience',
  },
  {
    id: 'it-chaos-engineering',
    title: 'Chaos Engineering Platform',
    description: 'Proactively test system resilience with controlled chaos experiments and failure injection.',
    features: ['Failure injection', 'Experiment design', 'Blast radius control', 'Auto rollback', 'Resilience scoring', 'Game days', 'Multi-cloud', 'Compliance-safe'],
    benefits: ['Find weaknesses early', 'Build resilient systems', 'Reduce outages 60%', 'Production confidence'],
    pricing: { basic: '$349/mo', pro: '$799/mo', enterprise: '$1999/mo' },
    contactInfo: { website: '/services/it-chaos-engineering', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💥', href: '/services/it-chaos-engineering', popular: true, category: 'it', industry: 'Site Reliability',
  },
  {
    id: 'it-gitops-platform',
    title: 'GitOps Platform & Infrastructure',
    description: 'Git-native infrastructure management with automated deployments and drift detection.',
    features: ['Git-native deploys', 'Auto sync', 'Drift detection', 'OPA policies', 'Multi-cluster', 'Rollback automation', 'Audit logging', 'Secret management'],
    benefits: ['IaC done right', 'Zero-touch deploys', 'Detect drift', 'Full audit trail'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1699/mo' },
    contactInfo: { website: '/services/it-gitops-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄', href: '/services/it-gitops-platform', popular: true, category: 'it', industry: 'Infrastructure',
  },`;

const newSecurity = `
  {
    id: 'security-soc-automation',
    title: 'SOC Automation & SOAR Platform',
    description: 'Automate Security Operations with playbooks, threat intel integration, and incident response orchestration.',
    features: ['Auto triage', 'Playbook orchestration', 'Threat intel', 'IR automation', 'SIEM correlation', 'Case management', 'MTTR reduction', '24/7 monitoring'],
    benefits: ['Reduce MTTR 80%', 'Automate 70% SOC tasks', 'Correlate threats', 'Scale without headcount'],
    pricing: { basic: '$799/mo', pro: '$1699/mo', enterprise: '$4499/mo' },
    contactInfo: { website: '/services/security-soc-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️', href: '/services/security-soc-automation', popular: true, category: 'security', industry: 'Security Operations',
  },
  {
    id: 'security-supply-chain-security',
    title: 'Software Supply Chain Security',
    description: 'Secure your supply chain with SBOM generation, dependency scanning, and build verification.',
    features: ['SBOM generation', 'Dependency scanning', 'Build verification', 'Artifact signing', 'License compliance', 'Pipeline security', 'Third-party risk', 'SLSA compliance'],
    benefits: ['Know every dependency', 'Prevent supply attacks', 'Verify builds', 'Meet SLSA requirements'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/security-supply-chain-security', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔗', href: '/services/security-supply-chain-security', popular: true, category: 'security', industry: 'DevSecOps',
  },`;

const newData = `
  {
    id: 'data-vector-database-platform',
    title: 'Vector Database Platform',
    description: 'Managed vector database for AI with high-dimensional search, hybrid queries, and auto-scaling for RAG applications.',
    features: ['Vector search', 'Hybrid queries', 'Auto-scaling', 'Multi-tenant', 'Real-time indexing', 'Backup/recovery', 'Monitoring', 'Multi-SDK'],
    benefits: ['Power AI apps', 'Sub-ms latency', 'Billions of vectors', 'Tenant isolation'],
    pricing: { basic: '$199/mo', pro: '$499/mo', enterprise: '$1299/mo' },
    contactInfo: { website: '/services/data-vector-database-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗂️', href: '/services/data-vector-database-platform', popular: true, category: 'data', industry: 'AI Infrastructure',
  },
  {
    id: 'data-data-contracts-platform',
    title: 'Data Contracts Platform',
    description: 'Enforce data contracts with schema validation, SLA monitoring, and breaking change detection.',
    features: ['Schema validation', 'SLA monitoring', 'Breaking change detection', 'Auto testing', 'Contract registry', 'Agreements', 'Version mgmt', 'Quality guarantees'],
    benefits: ['Prevent pipeline breaks', 'Enforce SLAs', 'Detect changes early', 'Build data trust'],
    pricing: { basic: '$249/mo', pro: '$549/mo', enterprise: '$1299/mo' },
    contactInfo: { website: '/services/data-data-contracts-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📜', href: '/services/data-data-contracts-platform', popular: true, category: 'data', industry: 'Data Quality',
  },`;

const newAuto = `
  {
    id: 'micro-saas-webhook-management',
    title: 'Webhook Management & Delivery',
    description: 'Reliable webhook delivery with retries, payload transformation, and signature verification.',
    features: ['99.99% delivery', 'Auto retries', 'Payload transform', 'Signature verify', 'Monitoring', 'Dead letters', 'Rate limiting', 'Testing tools'],
    benefits: ['Never lose webhooks', 'Transform automatically', 'Verify authenticity', 'Real-time monitoring'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/micro-saas-webhook-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔗', href: '/services/micro-saas-webhook-management', popular: true, category: 'micro-saas', industry: 'API Infrastructure',
  },
  {
    id: 'micro-saas-session-replay',
    title: 'Session Replay & User Analytics',
    description: 'Record and replay user sessions to understand behavior, debug issues, and optimize UX.',
    features: ['Session recording', 'Heatmaps', 'Error tracking', 'Funnel analysis', 'PII masking', 'Consent mgmt', 'Performance', 'Journey mapping'],
    benefits: ['See what users do', 'Debug by replaying', 'Optimize funnels', 'Privacy-compliant'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$399/mo' },
    contactInfo: { website: '/services/micro-saas-session-replay', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎬', href: '/services/micro-saas-session-replay', popular: true, category: 'micro-saas', industry: 'Product Analytics',
  },
  {
    id: 'micro-saas-notification-center',
    title: 'Notification Center & Inbox',
    description: 'In-app notification center with multi-channel delivery and user preferences.',
    features: ['In-app inbox', 'Multi-channel', 'User preferences', 'Delivery analytics', 'Template builder', 'Segmentation', 'Scheduling', 'Read tracking'],
    benefits: ['Centralize notifications', 'User choice', 'Improve engagement 3x', 'Track delivery'],
    pricing: { basic: '$39/mo', pro: '$99/mo', enterprise: '$249/mo' },
    contactInfo: { website: '/services/micro-saas-notification-center', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔔', href: '/services/micro-saas-notification-center', popular: true, category: 'micro-saas', industry: 'User Engagement',
  },
  {
    id: 'micro-saas-feature-adoption',
    title: 'Feature Adoption Analytics',
    description: 'Track feature adoption with funnels, cohort analysis, and automated onboarding nudges.',
    features: ['Adoption funnels', 'Cohort analysis', 'Usage metrics', 'Onboarding nudges', 'Discovery tips', 'Thresholds', 'Segment analysis', 'Revenue correlation'],
    benefits: ['Measure adoption', 'Find underused features', 'Drive with nudges', 'Correlate to revenue'],
    pricing: { basic: '$79/mo', pro: '$199/mo', enterprise: '$499/mo' },
    contactInfo: { website: '/services/micro-saas-feature-adoption', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊', href: '/services/micro-saas-feature-adoption', popular: true, category: 'micro-saas', industry: 'Product Growth',
  },
  {
    id: 'micro-saas-data-export-api',
    title: 'Data Export & API Platform',
    description: 'Self-service data export with scheduled exports, API access, and GDPR data portability.',
    features: ['Self-service export', 'Scheduled exports', 'REST API', 'Webhooks', 'CSV/JSON/Parquet', 'Incremental', 'GDPR portability', 'Access control'],
    benefits: ['Reduce tickets 80%', 'GDPR compliant', 'Automated exports', 'Full API access'],
    pricing: { basic: '$49/mo', pro: '$129/mo', enterprise: '$349/mo' },
    contactInfo: { website: '/services/micro-saas-data-export-api', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📤', href: '/services/micro-saas-data-export-api', popular: true, category: 'micro-saas', industry: 'Data Management',
  },
  {
    id: 'micro-saas-billing-portal',
    title: 'Customer Billing Portal',
    description: 'Self-service billing portal for subscriptions, payment methods, invoices, and plan changes.',
    features: ['Self-service billing', 'Payment mgmt', 'Invoice downloads', 'Plan changes', 'Usage tracking', 'Tax docs', 'Dunning', 'Revenue recognition'],
    benefits: ['Reduce billing support 70%', 'Customer self-service', 'Reduce failed payments', 'Auto invoices'],
    pricing: { basic: '$49/mo', pro: '$129/mo', enterprise: '$299/mo' },
    contactInfo: { website: '/services/micro-saas-billing-portal', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💳', href: '/services/micro-saas-billing-portal', popular: true, category: 'micro-saas', industry: 'Billing & Payments',
  },
  {
    id: 'micro-saas-roadmap-voting',
    title: 'Product Roadmap & Voting Platform',
    description: 'Public roadmap with feature voting, status updates, and customer-informed prioritization.',
    features: ['Public roadmap', 'Feature voting', 'Status tracking', 'Changelog', 'Segmentation', 'Priority scoring', 'Feedback', 'Release notifications'],
    benefits: ['Build what customers want', 'Transparent development', 'Reduce inquiries', 'Data-driven priorities'],
    pricing: { basic: '$29/mo', pro: '$79/mo', enterprise: '$199/mo' },
    contactInfo: { website: '/services/micro-saas-roadmap-voting', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗺️', href: '/services/micro-saas-roadmap-voting', popular: true, category: 'micro-saas', industry: 'Product Management',
  },`;

let count = 0;

let idx = ts.indexOf('];\n\nexport const itServices');
if (idx > -1) { ts = ts.slice(0, idx) + newAI + '\n' + ts.slice(idx); count += 12; console.log('✓ 12 AI'); }

idx = ts.indexOf('];\n\nexport const cloudServices');
if (idx > -1) { ts = ts.slice(0, idx) + newIT + '\n' + ts.slice(idx); count += 3; console.log('✓ 3 IT'); }

idx = ts.indexOf('];\n\nexport const dataServices');
if (idx > -1) { ts = ts.slice(0, idx) + newSecurity + '\n' + ts.slice(idx); count += 2; console.log('✓ 2 Security'); }

idx = ts.indexOf('];\n\nexport const automationServices');
if (idx > -1) { ts = ts.slice(0, idx) + newData + '\n' + ts.slice(idx); count += 2; console.log('✓ 2 Data'); }

idx = ts.indexOf('];\n\nexport const allServices');
if (idx > -1) { ts = ts.slice(0, idx) + newAuto + '\n' + ts.slice(idx); count += 7; console.log('✓ 7 Micro-SaaS'); }

if (hasCRLF) ts = ts.replace(/\n/g, '\r\n');
fs.writeFileSync('app/data/servicesData.ts', ts);
console.log('Total added:', count, 'services');
