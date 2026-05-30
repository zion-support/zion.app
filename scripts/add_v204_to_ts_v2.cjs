const fs = require('fs');
let ts = fs.readFileSync('app/data/servicesData.ts', 'utf8');

// Normalize to LF for searching, then convert back
const hasCRLF = ts.includes('\r\n');
ts = ts.replace(/\r\n/g, '\n');

const newAIEntries = `
  {
    id: 'ai-email-priority-escalation-v204',
    title: 'AI Email Priority Escalation Engine (V204)',
    description: 'Detect when email threads need urgent escalation using sentiment decay tracking, response delay analysis, executive mention detection, and deadline proximity scoring.',
    features: ['Sentiment decay tracking', 'Response delay risk scoring', 'Executive mention detection', 'Deadline proximity analysis', 'Legal keyword detection', '5-level escalation', 'Auto-notify chain', 'Reply-all enforcement'],
    benefits: ['Never miss critical escalation', 'Respond in minutes', 'Protect relationships', 'Avoid compliance risks'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-email-priority-escalation-v204', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚨',
    href: '/services/ai-email-priority-escalation-v204',
    popular: true,
    category: 'ai',
    industry: 'Enterprise Communication',
  },
  {
    id: 'ai-email-knowledge-extraction-v205',
    title: 'AI Email Knowledge Extraction Engine (V205)',
    description: 'Automatically extract decisions, action items, deadlines, commitments, and metrics from every email into a searchable knowledge base.',
    features: ['Decision extraction', 'Action item detection', 'Deadline tracking', 'Commitment extraction', 'Metric detection', 'Searchable knowledge base', 'Full audit trail', 'Reply-all enforcement'],
    benefits: ['Build knowledge automatically', 'Never lose a decision', 'Search any fact instantly', 'Track commitments'],
    pricing: { basic: '$349/mo', pro: '$799/mo', enterprise: '$1999/mo' },
    contactInfo: { website: '/services/ai-email-knowledge-extraction-v205', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧠',
    href: '/services/ai-email-knowledge-extraction-v205',
    popular: true,
    category: 'ai',
    industry: 'Knowledge Management',
  },
  {
    id: 'ai-stakeholder-relationship-mapper-v206',
    title: 'AI Stakeholder Relationship Mapper (V206)',
    description: 'Map organizational relationships from email patterns to identify decision-makers, influencers, gatekeepers, and champions.',
    features: ['Relationship mapping', 'Influence scoring', 'Decision-maker ID', 'Gatekeeper detection', 'Communication clusters', 'Strategic recommendations', 'Role detection', 'Strength scoring'],
    benefits: ['Understand org dynamics', 'Target decision-makers', 'Leverage champions', 'Avoid risks'],
    pricing: { basic: '$449/mo', pro: '$999/mo', enterprise: '$2499/mo' },
    contactInfo: { website: '/services/ai-stakeholder-relationship-mapper-v206', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🕸️',
    href: '/services/ai-stakeholder-relationship-mapper-v206',
    popular: true,
    category: 'ai',
    industry: 'Sales Intelligence',
  },
  {
    id: 'ai-email-response-quality-grader-v207',
    title: 'AI Email Response Quality Grader (V207)',
    description: 'Grade draft emails before sending on clarity, tone, completeness, actionability, and professionalism with improvement suggestions.',
    features: ['Clarity analysis', 'Tone evaluation', 'Completeness checking', 'Actionability scoring', 'Professionalism grading', 'A+ to F grading', 'Rewrite suggestions', 'Reply-all check'],
    benefits: ['Higher quality emails', 'Catch tone issues early', 'Address all points', 'Improve skills'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: '/services/ai-email-response-quality-grader-v207', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⭐',
    href: '/services/ai-email-response-quality-grader-v207',
    popular: true,
    category: 'ai',
    industry: 'Communication Quality',
  },
  {
    id: 'ai-email-workflow-automation-v208',
    title: 'AI Email Workflow Automation Engine (V208)',
    description: 'Detect repetitive email patterns and automatically create workflow rules, smart templates, auto-responses, and routing logic.',
    features: ['Pattern detection', 'Auto-rule generation', 'Smart templates', 'Intelligent routing', 'Auto-responses', 'Follow-up tracking', 'Escalation rules', 'History learning'],
    benefits: ['Automate 80% of repetitive emails', 'Respond instantly', 'Route automatically', 'Improve continuously'],
    pricing: { basic: '$449/mo', pro: '$999/mo', enterprise: '$2499/mo' },
    contactInfo: { website: '/services/ai-email-workflow-automation-v208', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️',
    href: '/services/ai-email-workflow-automation-v208',
    popular: true,
    category: 'ai',
    industry: 'Workflow Automation',
  },
  {
    id: 'ai-contract-analysis-risk-detection',
    title: 'AI Contract Analysis & Risk Detection',
    description: 'Analyze contracts, NDAs, MSAs, and SOWs in seconds. Detect risky clauses, missing protections, and benchmark against industry standards.',
    features: ['Clause risk scoring', 'Missing protection detection', 'Industry benchmarks', 'Redline suggestions', 'Obligation tracking', 'Renewal extraction', 'Liability analysis', 'Multi-jurisdiction compliance'],
    benefits: ['Review 50x faster', 'Catch risky clauses', 'Never miss renewals', 'Benchmark standards'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/ai-contract-analysis-risk-detection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📜',
    href: '/services/ai-contract-analysis-risk-detection',
    popular: true,
    category: 'ai',
    industry: 'Legal Tech',
  },
  {
    id: 'ai-meeting-minutes-action-tracker',
    title: 'AI Meeting Minutes & Action Item Tracker',
    description: 'Auto-generate meeting minutes from calls with action item extraction, deadline detection, and follow-up generation.',
    features: ['Auto-transcription', 'Speaker ID', 'Action item extraction', 'Deadline detection', 'Decision logging', 'Follow-up generation', 'Zoom/Teams/Meet', 'History search'],
    benefits: ['Never take notes again', 'Track to completion', 'Search past meetings', 'Perfect follow-ups'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/ai-meeting-minutes-action-tracker', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📝',
    href: '/services/ai-meeting-minutes-action-tracker',
    popular: true,
    category: 'ai',
    industry: 'Productivity',
  },
  {
    id: 'ai-customer-churn-prediction',
    title: 'AI Customer Churn Prediction Engine',
    description: 'Predict customer churn 90 days in advance using behavioral signals, usage patterns, and engagement scoring.',
    features: ['90-day prediction', 'Behavioral signals', 'Usage monitoring', 'Sentiment tracking', 'Engagement scoring', 'Retention triggers', 'Revenue-at-risk', 'Win-back ID'],
    benefits: ['Predict 90 days early', 'Save 30% more accounts', 'Automate retention', 'Quantify risk'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/ai-customer-churn-prediction', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔮',
    href: '/services/ai-customer-churn-prediction',
    popular: true,
    category: 'ai',
    industry: 'Customer Success',
  },
  {
    id: 'ai-document-summarization-qa',
    title: 'AI Document Summarization & Q&A Platform',
    description: 'Upload any document for instant summaries, natural language Q&A, key data extraction, and multi-document comparison.',
    features: ['Instant summarization', 'NL Q&A', 'Data extraction', 'Multi-doc comparison', 'Cross-doc search', 'Fact verification', 'Table extraction', 'Citation tracking'],
    benefits: ['Summarize in seconds', 'Ask any question', 'Compare side by side', 'Extract automatically'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$1099/mo' },
    contactInfo: { website: '/services/ai-document-summarization-qa', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📖',
    href: '/services/ai-document-summarization-qa',
    popular: true,
    category: 'ai',
    industry: 'Document Intelligence',
  },
  {
    id: 'ai-competitive-intelligence-platform',
    title: 'AI Competitive Intelligence Platform',
    description: 'Monitor competitors across web, social, news, job postings, and patents with automated alerts on critical changes.',
    features: ['Multi-source monitoring', 'Pricing detection', 'Product tracking', 'Job posting analysis', 'Funding monitoring', 'Patent tracking', 'Personnel alerts', 'Competitive briefs'],
    benefits: ['Know moves first', 'Automate research', 'Critical alerts', 'Instant briefs'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/ai-competitive-intelligence-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯',
    href: '/services/ai-competitive-intelligence-platform',
    popular: true,
    category: 'ai',
    industry: 'Business Intelligence',
  },
  {
    id: 'ai-email-ultra-suite-v204-v208',
    title: 'AI Email Ultra Suite (V204-V208)',
    description: 'All 5 new email intelligence engines unified: Priority Escalation, Knowledge Extraction, Stakeholder Mapping, Response Quality, and Workflow Automation.',
    features: ['V204 Priority Escalation', 'V205 Knowledge Extraction', 'V206 Stakeholder Mapper', 'V207 Response Quality', 'V208 Workflow Automation', 'Case-by-case analysis', 'Reply-all guaranteed', 'Enterprise security'],
    benefits: ['Complete email intelligence', 'Every email optimized', 'Automate workflows', 'Most advanced email AI'],
    pricing: { basic: '$1499/mo', pro: '$3499/mo', enterprise: '$8999/mo' },
    contactInfo: { website: '/services/ai-email-ultra-suite-v204-v208', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👑',
    href: '/services/ai-email-ultra-suite-v204-v208',
    popular: true,
    category: 'ai',
    industry: 'Enterprise AI',
  },`;

const newITEntries = `
  {
    id: 'it-zero-trust-network-access',
    title: 'Zero Trust Network Access (ZTNA) Platform',
    description: 'Implement zero-trust security with identity-based access, micro-segmentation, and continuous verification.',
    features: ['Identity-based access', 'Micro-segmentation', 'Continuous verification', 'Least-privilege', 'Device trust', 'VPN replacement', 'App-level access', 'Threat blocking'],
    benefits: ['Replace VPNs', 'Reduce attack surface 80%', 'Verify every access', 'Enforce least-privilege'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/it-zero-trust-network-access', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔐',
    href: '/services/it-zero-trust-network-access',
    popular: true,
    category: 'it',
    industry: 'Network Security',
  },
  {
    id: 'it-cloud-cost-optimization-finops',
    title: 'Cloud Cost Optimization & FinOps Platform',
    description: 'Optimize cloud spending across AWS, Azure, and GCP with right-sizing and waste detection.',
    features: ['Multi-cloud analysis', 'Right-sizing', 'Reserved instances', 'Waste detection', 'Budget alerts', 'FinOps governance', 'Cost allocation', 'Savings plans'],
    benefits: ['Reduce costs 30-40%', 'Eliminate waste', 'Forecast accurately', 'Implement FinOps'],
    pricing: { basic: '$299/mo', pro: '$699/mo', enterprise: '$1799/mo' },
    contactInfo: { website: '/services/it-cloud-cost-optimization-finops', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💸',
    href: '/services/it-cloud-cost-optimization-finops',
    popular: true,
    category: 'it',
    industry: 'Cloud FinOps',
  },
  {
    id: 'it-incident-response-management',
    title: 'Incident Response & Management Platform',
    description: 'Streamline incident response with automated detection, on-call management, and post-incident reviews.',
    features: ['Incident detection', 'On-call management', 'War room', 'Timeline tracking', 'Post-incident reviews', 'Status pages', 'Runbooks', 'MTTR analytics'],
    benefits: ['Reduce MTTR 60%', 'Automate on-call', 'Coordinate efficiently', 'Learn from incidents'],
    pricing: { basic: '$249/mo', pro: '$599/mo', enterprise: '$1399/mo' },
    contactInfo: { website: '/services/it-incident-response-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚒',
    href: '/services/it-incident-response-management',
    popular: true,
    category: 'it',
    industry: 'IT Operations',
  },
  {
    id: 'it-iac-security-scanner',
    title: 'Infrastructure as Code Security Scanner',
    description: 'Scan Terraform, CloudFormation, K8s YAML, and Helm charts for misconfigurations and compliance violations.',
    features: ['Terraform scanning', 'CloudFormation analysis', 'K8s validation', 'Helm checks', 'CIS/NIST benchmarks', 'Drift detection', 'Policy-as-code', 'CI/CD integration'],
    benefits: ['Catch misconfigs early', 'Security in code', 'Prevent violations', 'Detect drift'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$1099/mo' },
    contactInfo: { website: '/services/it-iac-security-scanner', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍',
    href: '/services/it-iac-security-scanner',
    popular: true,
    category: 'it',
    industry: 'DevSecOps',
  },`;

const newSecurityEntries = `
  {
    id: 'security-ai-penetration-testing',
    title: 'AI-Powered Penetration Testing Platform',
    description: 'Automated pentesting using AI to discover vulnerabilities, exploit chains, and attack paths.',
    features: ['AI vulnerability discovery', 'Attack path mapping', 'Exploit chains', 'Web/API/network', 'Continuous testing', 'Remediation guide', 'PCI/SOC2 reports', 'Executive summaries'],
    benefits: ['Continuous pentesting', 'Hidden attack paths', 'Detailed remediation', 'Meet compliance'],
    pricing: { basic: '$999/mo', pro: '$2499/mo', enterprise: '$5999/mo' },
    contactInfo: { website: '/services/security-ai-penetration-testing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯',
    href: '/services/security-ai-penetration-testing',
    popular: true,
    category: 'security',
    industry: 'Cybersecurity',
  },
  {
    id: 'security-data-loss-prevention',
    title: 'Data Loss Prevention (DLP) Intelligence',
    description: 'AI-powered DLP across email, cloud, endpoints, and network with real-time exfiltration detection.',
    features: ['Multi-channel DLP', 'AI classification', 'Exfiltration detection', 'Policy enforcement', 'Investigation tools', 'Behavior analytics', 'GDPR/HIPAA reports', 'Auto remediation'],
    benefits: ['Prevent breaches', 'Auto-classify data', 'Enforce everywhere', 'Investigate fast'],
    pricing: { basic: '$599/mo', pro: '$1299/mo', enterprise: '$3499/mo' },
    contactInfo: { website: '/services/security-data-loss-prevention', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/security-data-loss-prevention',
    popular: true,
    category: 'security',
    industry: 'Data Security',
  },
  {
    id: 'security-identity-governance',
    title: 'Identity Governance & Administration Platform',
    description: 'Manage identities, access reviews, RBAC, and compliance. Automate joiner/mover/leaver processes.',
    features: ['Lifecycle management', 'Access reviews', 'RBAC', 'Segregation of duties', 'PAM', 'SOX/SOC2 reports', 'Auto provisioning', 'Certification workflows'],
    benefits: ['Automate lifecycle', 'Pass audits', 'Least-privilege', 'Reduce insider risk'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/security-identity-governance', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👤',
    href: '/services/security-identity-governance',
    popular: true,
    category: 'security',
    industry: 'Identity & Access',
  },`;

const newDataEntries = `
  {
    id: 'data-real-time-streaming-platform',
    title: 'Real-Time Data Streaming Platform',
    description: 'Process millions of events per second with managed Kafka, Flink, and Spark Streaming.',
    features: ['Managed Kafka', 'Flink processing', 'Real-time analytics', 'Event-driven arch', 'Pipeline management', 'Schema registry', 'Exactly-once', 'Auto-scaling'],
    benefits: ['Millions per second', 'Event-driven systems', 'Real-time analytics', 'Auto-scale'],
    pricing: { basic: '$499/mo', pro: '$1099/mo', enterprise: '$2999/mo' },
    contactInfo: { website: '/services/data-real-time-streaming-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌊',
    href: '/services/data-real-time-streaming-platform',
    popular: true,
    category: 'data',
    industry: 'Data Engineering',
  },
  {
    id: 'data-governance-catalog-platform',
    title: 'Data Governance & Catalog Platform',
    description: 'Discover, catalog, and govern all enterprise data with automated lineage and compliance tracking.',
    features: ['Auto discovery', 'Data lineage', 'Business glossary', 'Access policies', 'Quality rules', 'AI classification', 'GDPR/CCPA tracking', 'Data marketplace'],
    benefits: ['Discover automatically', 'Track lineage', 'Enforce governance', 'Self-service access'],
    pricing: { basic: '$399/mo', pro: '$899/mo', enterprise: '$2299/mo' },
    contactInfo: { website: '/services/data-governance-catalog-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📚',
    href: '/services/data-governance-catalog-platform',
    popular: true,
    category: 'data',
    industry: 'Data Governance',
  },`;

const newAutoEntries = `
  {
    id: 'micro-saas-invoice-automation',
    title: 'Invoice Automation & Payment Tracking',
    description: 'Automate invoice creation, delivery, reminders, and payment tracking with recurring billing.',
    features: ['Auto invoices', 'Smart reminders', 'Recurring billing', 'Multi-currency', 'Tax calculation', 'Stripe/PayPal', 'Payment tracking', 'Revenue recognition'],
    benefits: ['Get paid 2x faster', 'No manual invoicing', 'Reduce late payments 60%', 'Global support'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$399/mo' },
    contactInfo: { website: '/services/micro-saas-invoice-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💰',
    href: '/services/micro-saas-invoice-automation',
    popular: true,
    category: 'micro-saas',
    industry: 'Finance & Accounting',
  },
  {
    id: 'micro-saas-employee-onboarding',
    title: 'Employee Onboarding Workflow Platform',
    description: 'Streamline onboarding with automated workflows, document collection, and compliance tracking.',
    features: ['Automated workflows', 'Document collection', 'Task assignments', 'Training schedules', 'Compliance tracking', 'Equipment provisioning', 'Buddy assignment', 'Check-in automation'],
    benefits: ['Onboard 3x faster', '100% compliance', 'Reduce HR work 80%', 'Track milestones'],
    pricing: { basic: '$99/mo', pro: '$249/mo', enterprise: '$599/mo' },
    contactInfo: { website: '/services/micro-saas-employee-onboarding', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👋',
    href: '/services/micro-saas-employee-onboarding',
    popular: true,
    category: 'micro-saas',
    industry: 'Human Resources',
  },
  {
    id: 'micro-saas-vendor-management',
    title: 'Vendor Management & Procurement Platform',
    description: 'Manage vendors, contracts, and procurement with performance tracking and automated renewals.',
    features: ['Vendor database', 'Contract management', 'Procurement workflows', 'Budget tracking', 'Risk assessment', 'Compliance', 'Spend analytics', 'RFQ/RFP'],
    benefits: ['Reduce costs 15%', 'Never miss renewals', 'Automate procurement', 'Track performance'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/micro-saas-vendor-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤝',
    href: '/services/micro-saas-vendor-management',
    popular: true,
    category: 'micro-saas',
    industry: 'Procurement',
  },
  {
    id: 'micro-saas-customer-portal',
    title: 'Customer Portal & Self-Service Hub',
    description: 'Branded self-service portal for support, knowledge base, invoices, and account management.',
    features: ['Branded portal', 'Ticket management', 'Knowledge base', 'Invoice management', 'Usage analytics', 'Account management', 'White-labeling', 'SSO integration'],
    benefits: ['Reduce tickets 40%', '24/7 self-service', 'Increase satisfaction', 'Centralize interactions'],
    pricing: { basic: '$199/mo', pro: '$449/mo', enterprise: '$999/mo' },
    contactInfo: { website: '/services/micro-saas-customer-portal', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏠',
    href: '/services/micro-saas-customer-portal',
    popular: true,
    category: 'micro-saas',
    industry: 'Customer Success',
  },
  {
    id: 'micro-saas-feature-flag-management',
    title: 'Feature Flag Management Platform',
    description: 'Deploy features safely with flags, A/B testing, gradual rollouts, and instant kill switches.',
    features: ['Flag management', 'Gradual rollouts', 'Segment targeting', 'A/B testing', 'Kill switches', 'Analytics', 'Multi-environment', 'Audit trail'],
    benefits: ['Deploy without risk', 'A/B test everything', 'Roll out gradually', 'Kill instantly'],
    pricing: { basic: '$79/mo', pro: '$199/mo', enterprise: '$499/mo' },
    contactInfo: { website: '/services/micro-saas-feature-flag-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚩',
    href: '/services/micro-saas-feature-flag-management',
    popular: true,
    category: 'micro-saas',
    industry: 'Software Development',
  },
  {
    id: 'micro-saas-feedback-feature-board',
    title: 'User Feedback & Feature Request Board',
    description: 'Collect and prioritize user feedback with voting, status tracking, and roadmap integration.',
    features: ['Feedback board', 'Voting & comments', 'Status tracking', 'Prioritization', 'Roadmap integration', 'User segmentation', 'Jira/Linear', 'Status emails'],
    benefits: ['Build what users want', 'Prioritize by demand', 'Keep users informed', 'Connect to roadmap'],
    pricing: { basic: '$49/mo', pro: '$129/mo', enterprise: '$299/mo' },
    contactInfo: { website: '/services/micro-saas-feedback-feature-board', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💬',
    href: '/services/micro-saas-feedback-feature-board',
    popular: true,
    category: 'micro-saas',
    industry: 'Product Management',
  },
  {
    id: 'micro-saas-subscription-dunning',
    title: 'Subscription Management & Dunning Platform',
    description: 'Manage subscriptions, automate billing, reduce churn with smart dunning and revenue optimization.',
    features: ['Subscription lifecycle', 'Auto billing', 'Smart dunning', 'Upgrade analytics', 'Retention offers', 'Proration', 'MRR/ARR dashboards', 'Churn analytics'],
    benefits: ['Reduce churn 35%', 'Automate billing', 'Optimize revenue', 'Track all metrics'],
    pricing: { basic: '$99/mo', pro: '$249/mo', enterprise: '$599/mo' },
    contactInfo: { website: '/services/micro-saas-subscription-dunning', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄',
    href: '/services/micro-saas-subscription-dunning',
    popular: true,
    category: 'micro-saas',
    industry: 'Revenue Operations',
  },
  {
    id: 'micro-saas-api-analytics-ratelimiting',
    title: 'API Usage Analytics & Rate Limiting',
    description: 'Monitor API usage, enforce rate limits, detect abuse, and generate usage-based billing.',
    features: ['Real-time monitoring', 'Rate limiting', 'Abuse detection', 'Usage billing', 'Per-customer analytics', 'Latency tracking', 'Health dashboards', 'Webhook alerts'],
    benefits: ['Prevent abuse', 'Bill by usage', 'Monitor health', 'Detect anomalies'],
    pricing: { basic: '$149/mo', pro: '$349/mo', enterprise: '$799/mo' },
    contactInfo: { website: '/services/micro-saas-api-analytics-ratelimiting', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡',
    href: '/services/micro-saas-api-analytics-ratelimiting',
    popular: true,
    category: 'micro-saas',
    industry: 'API Management',
  },
  {
    id: 'micro-saas-visual-testing',
    title: 'Automated Visual Testing Platform',
    description: 'Visual regression testing across browsers and devices with pixel-perfect diffs and CI/CD integration.',
    features: ['Visual regression', 'Cross-browser', 'Mobile testing', 'Pixel diffs', 'CI/CD integration', 'Baseline management', 'Flaky detection', 'Accessibility audit'],
    benefits: ['Catch UI bugs early', 'Test 50+ browsers', 'Automate regression', 'CI/CD integration'],
    pricing: { basic: '$99/mo', pro: '$249/mo', enterprise: '$599/mo' },
    contactInfo: { website: '/services/micro-saas-visual-testing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📸',
    href: '/services/micro-saas-visual-testing',
    popular: true,
    category: 'micro-saas',
    industry: 'Quality Assurance',
  },
  {
    id: 'micro-saas-status-page-incident',
    title: 'Status Page & Incident Management',
    description: 'Status pages with automated incident detection, real-time updates, and subscriber notifications.',
    features: ['Status pages', 'Incident detection', 'Real-time updates', 'Notifications', 'Post-incident reports', 'Uptime tracking', 'Component status', 'Custom branding'],
    benefits: ['Build trust', 'Reduce support tickets', 'Automate communication', 'Track SLAs'],
    pricing: { basic: '$49/mo', pro: '$149/mo', enterprise: '$349/mo' },
    contactInfo: { website: '/services/micro-saas-status-page-incident', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🟢',
    href: '/services/micro-saas-status-page-incident',
    popular: true,
    category: 'micro-saas',
    industry: 'Reliability Engineering',
  },`;

// Now do the insertions
let count = 0;

// AI -> before itServices
let idx = ts.indexOf('];\n\nexport const itServices');
if (idx > -1) {
  ts = ts.slice(0, idx) + newAIEntries + '\n' + ts.slice(idx);
  count += 11;
  console.log('✓ Added 11 AI services');
} else { console.log('✗ AI insertion point not found'); }

// IT -> before cloudServices
idx = ts.indexOf('];\n\nexport const cloudServices');
if (idx > -1) {
  ts = ts.slice(0, idx) + newITEntries + '\n' + ts.slice(idx);
  count += 4;
  console.log('✓ Added 4 IT services');
} else { console.log('✗ IT insertion point not found'); }

// Security -> before dataServices
idx = ts.indexOf('];\n\nexport const dataServices');
if (idx > -1) {
  ts = ts.slice(0, idx) + newSecurityEntries + '\n' + ts.slice(idx);
  count += 3;
  console.log('✓ Added 3 Security services');
} else { console.log('✗ Security insertion point not found'); }

// Data -> before automationServices
idx = ts.indexOf('];\n\nexport const automationServices');
if (idx > -1) {
  ts = ts.slice(0, idx) + newDataEntries + '\n' + ts.slice(idx);
  count += 2;
  console.log('✓ Added 2 Data services');
} else { console.log('✗ Data insertion point not found'); }

// Automation/Micro-SaaS -> before allServices
idx = ts.indexOf('];\n\nexport const allServices');
if (idx > -1) {
  ts = ts.slice(0, idx) + newAutoEntries + '\n' + ts.slice(idx);
  count += 10;
  console.log('✓ Added 10 Micro-SaaS/Automation services');
} else { console.log('✗ Automation insertion point not found'); }

// Convert back to CRLF if needed
if (hasCRLF) {
  ts = ts.replace(/\n/g, '\r\n');
}

fs.writeFileSync('app/data/servicesData.ts', ts);
console.log('Total added:', count, 'services to TS file');
