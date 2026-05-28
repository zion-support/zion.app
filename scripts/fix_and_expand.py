#!/usr/bin/env python3
"""
Fix servicesData.ts and add new services across all sections.
Fixes:
  1. ai-telecom-1 missing contactUrl and closing },
  2. Orphaned lines after aiServices array
Additions:
  - 5 new AI services
  - 5 new IT services  
  - 6 new Micro SAAS services
  - 2 new Consulting services
"""

path = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
with open(path, 'r') as f:
    content = f.read()

# ============================================================
# FIX 1: ai-telecom-1 is missing contactUrl and closing },
# After: pricing: { Starter: '$3,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
# (blank line)
# {  <-- ai-digitaltwin-1
#
# Replace with proper closing + blank line before next object
# ============================================================

old_telecom = """    pricing: { Starter: '$3,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },

  {
    id: 'ai-digitaltwin-1',"""

new_telecom = """    pricing: { Starter: '$3,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-digitaltwin-1',"""

if old_telecom in content:
    content = content.replace(old_telecom, new_telecom)
    print("✓ Fixed ai-telecom-1: added missing contactUrl and closing brace")
else:
    print("⚠ Could not find ai-telecom-1 fix pattern")

# ============================================================
# FIX 2: Remove orphaned lines after aiServices array closing
# The correct end should be:
#   contactUrl: '/contact'
#   },
# ];
#
# But we have:
#   contactUrl: '/contact'   <- ai-sustainability-1
#   },                       <- closes ai-sustainability-1
#   }                        <- orphaned (meant for ai-telecom-1)
# ];                         <- closes array
#    contactUrl: '/contact'  <- orphaned
#   },                       <- orphaned
# ];                         <- orphaned duplicate
# ============================================================

old_orphan = """    contactUrl: '/contact'
  },
  }
];
    contactUrl: '/contact'
  },
];"""

new_clean = """    contactUrl: '/contact'
  },
];"""

if old_orphan in content:
    content = content.replace(old_orphan, new_clean)
    print("✓ Fixed orphaned lines after aiServices array")
else:
    print("⚠ Could not find orphan pattern, trying alternate...")
    # Try alternate pattern
    alt_old = """    contactUrl: '/contact'
  },
  }
];"""
    if alt_old in content:
        content = content.replace(alt_old, """    contactUrl: '/contact'
  },
];""")
        print("✓ Fixed orphaned lines (alternate pattern)")
    else:
        print("⚠ No orphan pattern found - may already be fixed")

# ============================================================
# ADD NEW AI SERVICES (after ai-sustainability-1, before array close)
# ============================================================

new_ai_services = """  {
    id: 'ai-ethics-1',
    title: 'AI Ethics & Fairness Auditing',
    subtitle: 'Detect bias, ensure fairness, and build trust in AI systems with comprehensive ethics audits',
    category: 'ai',
    subcategory: 'AI Ethics',
    description: 'Independent AI ethics auditing service that evaluates your AI systems for bias, fairness, transparency, and regulatory compliance. Includes algorithmic impact assessments and remediation roadmaps.',
    features: [
      'Algorithmic bias detection across protected attributes',
      'Fairness metrics and disparity analysis',
      'Model explainability and transparency reports',
      'EU AI Act and regulatory compliance readiness',
      'AI governance framework design',
      'Stakeholder impact assessments',
      'Ethical AI policy development',
      'Continuous monitoring and drift alerts'
    ],
    benefits: [
      'Mitigate legal and reputational risks from biased AI',
      'Build customer trust through transparent AI',
      'Meet EU AI Act and upcoming regulatory requirements',
      'Ensure fair outcomes across all demographic groups'
    ],
    pricing: { Starter: '$2,999/mo', Professional: '$6,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-supplychain-1',
    title: 'AI Supply Chain Optimization',
    subtitle: 'Intelligent supply chain planning, risk mitigation, and logistics optimization',
    category: 'ai',
    subcategory: 'Supply Chain AI',
    description: 'End-to-end AI-powered supply chain optimization — demand sensing, inventory optimization, supplier risk assessment, and logistics planning for complex global networks.',
    features: [
      'AI demand sensing and forecasting',
      'Dynamic inventory optimization',
      'Supplier risk scoring and monitoring',
      'Multi-echelon inventory planning',
      'Route and logistics optimization',
      'Procurement spend analytics',
      'Disruption detection and response',
      'Carbon-aware supply chain planning'
    ],
    benefits: [
      'Reduce inventory carrying costs by 20-35%',
      'Improve service levels to 98%+',
      'Detect supply disruptions weeks in advance',
      'Optimize working capital across the supply chain'
    ],
    pricing: { Starter: '$3,499/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-devtools-1',
    title: 'AI-Powered Developer Experience Platform',
    subtitle: 'Enterprise AI coding assistant, code review, and developer productivity platform',
    category: 'ai',
    subcategory: 'Developer Tools AI',
    description: 'Transform developer productivity with AI-powered code generation, intelligent code review, automated documentation, and personalized developer coaching — trained on your codebase.',
    features: [
      'Context-aware code completion (supports 30+ languages)',
      'Automated code review with security scanning',
      'AI-generated documentation and changelogs',
      'Technical debt identification and prioritization',
      'Onboarding assistant for new developers',
      'Architecture decision record (ADR) generation',
      'PR review bot with learning from team patterns',
      'IDE integration (VS Code, JetBrains, Neovim)'
    ],
    benefits: [
      'Increase developer velocity by 35-50%',
      'Reduce code review time by 60%',
      'Catch security vulnerabilities before merge',
      'Accelerate onboarding of new team members'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$4,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-simulation-1',
    title: 'AI Simulation & Digital Experimentation',
    subtitle: 'Run thousands of business scenarios and what-if analyses using AI-powered simulation',
    category: 'ai',
    subcategory: 'Simulation & Modeling',
    description: 'Build and run complex business simulations to test strategies, optimize decisions, and de-risk initiatives before real-world deployment — powered by AI agents and Monte Carlo methods.',
    features: [
      'Monte Carlo and agent-based simulation engines',
      'Business scenario modeling and stress testing',
      'Market and competitive dynamics simulation',
      'Financial model simulation and risk analysis',
      'Operational process simulation',
      'Automated experiment design and analysis',
      'Interactive scenario dashboards',
      'Integration with real-time data feeds'
    ],
    benefits: [
      'Test strategies risk-free before investing',
      'Quantify uncertainty and downside risks',
      'Optimize pricing, staffing, and resource allocation',
      'Reduce costly real-world experimentation by 80%'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$6,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-biometrics-1',
    title: 'Biometric Authentication & Behavioral AI',
    subtitle: 'Secure, frictionless identity verification using biometrics and behavioral patterns',
    category: 'ai',
    subcategory: 'Biometric AI',
    description: 'AI-powered biometric authentication including facial recognition, voice verification, behavioral biometrics, and liveness detection for secure and seamless user identity verification.',
    features: [
      'Multi-modal biometric fusion (face + voice + behavioral)',
      'Liveness detection and anti-spoofing',
      'Continuous authentication during sessions',
      'Behavioral biometrics (keystroke, mouse, gait patterns)',
      'FIDO2/WebAuthn integration',
      'Privacy-preserving on-device processing',
      'Real-time risk scoring per authentication',
      'Compliance with NIST SP 800-63 and eIDAS'
    ],
    benefits: [
      'Eliminate password fatigue and phishing risk',
      'Reduce fraud losses by 95%+',
      'Frictionless user experience (1-second verification)',
      'Meet regulatory KYC/AML requirements'
    ],
    pricing: { Starter: '$3,999/mo', Professional: '$9,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }"""

# Insert new AI services before the closing ]; of aiServices
# Find the exact closing pattern
ai_close_pattern = """  {
    id: 'ai-sustainability-1',
    title: 'AI for Climate & Environmental Monitoring',
    subtitle: 'Real-time environmental monitoring and climate risk assessment powered by AI',
    category: 'ai',
    subcategory: 'Environmental AI',
    description: 'Monitor air quality, water quality, deforestation, and climate risks using satellite imagery, IoT sensors, and AI-powered analytics for ESG compliance and environmental protection.',
    features: [
      'Satellite imagery analysis for land use changes',
      'Air and water quality sensor network analytics',
      'Carbon sequestration measurement and verification',
      'Climate risk scoring for assets and supply chains',
      'Biodiversity monitoring and species detection',
      'Pollution source identification',
      'Automated EPA and regulatory reporting',
      'Real-time environmental alerting system'
    ],
    benefits: [
      'Achieve ESG and sustainability compliance',
      'Detect environmental violations before penalties',
      'Quantify and reduce environmental footprint',
      'Generate revenue through carbon credit verification'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
];"""

new_ai_close = """  {
    id: 'ai-sustainability-1',
    title: 'AI for Climate & Environmental Monitoring',
    subtitle: 'Real-time environmental monitoring and climate risk assessment powered by AI',
    category: 'ai',
    subcategory: 'Environmental AI',
    description: 'Monitor air quality, water quality, deforestation, and climate risks using satellite imagery, IoT sensors, and AI-powered analytics for ESG compliance and environmental protection.',
    features: [
      'Satellite imagery analysis for land use changes',
      'Air and water quality sensor network analytics',
      'Carbon sequestration measurement and verification',
      'Climate risk scoring for assets and supply chains',
      'Biodiversity monitoring and species detection',
      'Pollution source identification',
      'Automated EPA and regulatory reporting',
      'Real-time environmental alerting system'
    ],
    benefits: [
      'Achieve ESG and sustainability compliance',
      'Detect environmental violations before penalties',
      'Quantify and reduce environmental footprint',
      'Generate revenue through carbon credit verification'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
""" + new_ai_services + """
];"""

if ai_close_pattern in content:
    content = content.replace(ai_close_pattern, new_ai_close)
    print("✓ Added 5 new AI services (Batch 6)")
else:
    print("⚠ Could not find AI section closing pattern")

# ============================================================
# ADD NEW IT SERVICES (before the closing ]; of itServices)
# ============================================================

new_it_services = """  {
    id: 'it-observability-ai-1',
    title: 'AIOps & Intelligent Observability',
    subtitle: 'AI-powered monitoring that predicts and prevents incidents before they impact users',
    category: 'it',
    subcategory: 'AIOps',
    description: 'Next-generation observability platform with AI-driven anomaly detection, root cause analysis, and predictive alerting — reducing MTTR from hours to seconds.',
    features: [
      'AI-powered anomaly detection across metrics, logs, and traces',
      'Automatic root cause analysis and blast radius assessment',
      'Predictive alerting before incidents occur',
      'Automated incident correlation and deduplication',
      'Natural language incident investigation',
      'Smart dashboards that surface the unknown unknowns',
      'Integration with existing monitoring stack (Prometheus, Datadog, etc.)',
      'SLO-driven alerting and error budget management'
    ],
    benefits: [
      'Detect incidents 10x faster with AI-driven alerting',
      'Reduce MTTR by 80% with automatic root cause analysis',
      'Eliminate alert fatigue with intelligent deduplication',
      'Predict and prevent outages before users are affected'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$4,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-cloudnative-1',
    title: 'Cloud-Native Application Development',
    subtitle: 'Design and build cloud-native applications using microservices, containers, and serverless',
    category: 'it',
    subcategory: 'Cloud-Native Development',
    description: 'Build resilient, scalable, cloud-native applications using microservices architecture, containers, serverless functions, and cloud-native databases and messaging.',
    features: [
      'Microservices architecture design and implementation',
      'Container-based development (Docker, Kubernetes)',
      'Serverless function development (Lambda, Cloud Functions)',
      'Event-driven architecture with message queues (Kafka, SQS)',
      'Cloud-native databases (DynamoDB, Cosmos DB, Cloud Spanner)',
      'CI/CD pipelines for cloud-native apps',
      'Distributed tracing and debugging',
      'Resilience patterns (circuit breaker, retry, saga)'
    ],
    benefits: [
      'Scale individual components independently',
      'Deploy 50x more frequently with zero downtime',
      'Reduce infrastructure costs with pay-per-use models',
      'Build systems that handle millions of concurrent users'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$6,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-compliance-1',
    title: 'Automated Compliance & Audit Platform',
    subtitle: 'Continuous compliance monitoring and automated audit evidence collection',
    category: 'it',
    subcategory: 'Compliance Automation',
    description: 'Automate compliance workflows across SOC 2, ISO 27001, HIPAA, PCI DSS, and GDPR — with continuous monitoring, evidence collection, and audit-ready reporting.',
    features: [
      'Continuous compliance monitoring across frameworks',
      'Automated evidence collection from cloud and on-prem systems',
      'Policy-as-code enforcement and drift detection',
      'Risk register with automated risk scoring',
      'Audit-ready report generation',
      'Control mapping across multiple frameworks',
      'Third-party vendor risk assessments',
      'Real-time compliance dashboards and alerts'
    ],
    benefits: [
      'Cut audit preparation time by 80%',
      'Maintain continuous compliance instead of point-in-time',
      'Reduce compliance costs by 50%+',
      'Identify compliance gaps before auditors do'
    ],
    pricing: { Starter: '$1,499/mo', Professional: '$3,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-architecture-1',
    title: 'Solution Architecture & Technical Design',
    subtitle: 'Expert architecture design for scalable, secure, and maintainable systems',
    category: 'it',
    subcategory: 'Solution Architecture',
    description: 'Enterprise-grade solution architecture services — from system design and technology selection to architecture reviews, scalability planning, and technical specification documentation.',
    features: [
      'Architecture design for greenfield and brownfield projects',
      'Technology selection and evaluation',
      'Scalability and performance modeling',
      'Security architecture and threat modeling',
      'API-first design and microservices decomposition',
      'Architecture decision records (ADRs)',
      'Technical specification and blueprint documentation',
      'Architecture review and modernization assessment'
    ],
    benefits: [
      'Avoid costly architectural mistakes',
      'Build systems that scale to millions of users',
      'Reduce technical debt from day one',
      'Clear roadmap for engineering teams'
    ],
    pricing: { Starter: '$3,999/project', Professional: '$12,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-dataops-1',
    title: 'DataOps & Analytics Engineering',
    subtitle: 'Modernize your data stack with automated pipelines, data quality, and self-serve analytics',
    category: 'it',
    subcategory: 'DataOps',
    description: 'Build and manage modern data stacks with automated ETL/ELT pipelines, data quality monitoring, dbt transformations, and self-serve analytics for data-driven organizations.',
    features: [
      'Automated ETL/ELT pipeline orchestration (Airflow, Dagster)',
      'dbt-based data transformation and modeling',
      'Data quality monitoring and anomaly detection',
      'Data catalog and lineage tracking',
      'Modern data stack setup (Snowflake, BigQuery, dbt, Looker)',
      'Real-time streaming pipelines (Kafka, Flink)',
      'Self-serve analytics enablement',
      'Data governance and access controls'
    ],
    benefits: [
      'Reduce data pipeline maintenance by 60%',
      'Enable business users with self-serve analytics',
      'Improve data quality and trust',
      'Scale data infrastructure with your growth'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }"""

# Find IT section closing pattern
it_close_pattern = """    pricing: { Starter: '$3,499/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];"""

new_it_close = """    pricing: { Starter: '$3,499/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
""" + new_it_services + """
];"""

if it_close_pattern in content:
    content = content.replace(it_close_pattern, new_it_close)
    print("✓ Added 5 new IT services (Batch 6)")
else:
    print("⚠ Could not find IT section closing pattern")

# ============================================================
# ADD NEW MICRO SAAS SERVICES (before closing ]; of saasSolutions)
# ============================================================

new_saas_services = """  {
    id: 'saas-onboarding-1',
    title: 'Employee Onboarding Automation',
    subtitle: 'Automate new hire onboarding with workflows, document management, and training assignments',
    category: 'saas',
    subcategory: 'Onboarding',
    description: 'Streamline employee onboarding with automated workflows, digital document collection, training assignment, equipment provisioning, and first-week task checklists.',
    features: [
      'Custom onboarding workflow builder',
      'Digital document collection and e-signatures',
      'Automated training assignment and tracking',
      'IT provisioning automation (accounts, devices, access)',
      'First-week task checklist and manager notifications',
      'Buddy/mentor assignment workflows',
      'Onboarding analytics and time-to-productivity tracking',
      'Multi-location and remote worker support'
    ],
    benefits: [
      'Reduce onboarding time by 60%',
      'Ensure consistent experience for every new hire',
      'Decrease new hire turnover in first 90 days',
      'Eliminate manual paperwork and follow-ups'
    ],
    pricing: { Starter: '$299/mo', Professional: '$799/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-warranty-1',
    title: 'Warranty & Returns Management',
    subtitle: 'Automate warranty claims, returns processing, and product lifecycle management',
    category: 'saas',
    subcategory: 'Warranty Management',
    description: 'End-to-end warranty and returns management platform — automate claim processing, track product serial numbers, manage RMA workflows, and analyze return patterns.',
    features: [
      'Automated warranty claim processing',
      'Serial number and product lifecycle tracking',
      'RMA (Return Merchandise Authorization) workflow',
      'AI-powered return reason analysis',
      'Inventory reintegration tracking',
      'Warranty fraud detection',
      'Multi-channel claim submission (web, email, mobile)',
      'Supplier and manufacturer integration'
    ],
    benefits: [
      'Reduce warranty processing time by 70%',
      'Identify product quality issues early',
      'Decrease fraudulent warranty claims by 40%',
      'Improve customer satisfaction with faster resolutions'
    ],
    pricing: { Starter: '$499/mo', Professional: '$1,299/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-research-1',
    title: 'Market Research & Competitive Intelligence',
    subtitle: 'AI-powered market research, competitor tracking, and industry trend analysis',
    category: 'saas',
    subcategory: 'Market Research',
    description: 'Automated market research platform that monitors competitors, tracks industry trends, analyzes customer reviews, and generates actionable intelligence reports.',
    features: [
      'Automated competitor monitoring and alerts',
      'AI-powered review and sentiment aggregation',
      'Market trend identification and forecasting',
      'Feature gap analysis vs. competitors',
      'Pricing intelligence and positioning analysis',
      'Custom research report generation',
      'Social listening and brand monitoring',
      'Share of voice and brand perception tracking'
    ],
    benefits: [
      'Make data-driven strategic decisions',
      'Identify market opportunities before competitors',
      'Reduce manual research time by 80%',
      'Stay ahead of industry trends and shifts'
    ],
    pricing: { Starter: '$499/mo', Professional: '$1,299/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-affiliate-1',
    title: 'Affiliate Marketing & Partner Management',
    subtitle: 'Build, manage, and optimize your affiliate marketing program with automated tracking and payouts',
    category: 'saas',
    subcategory: 'Affiliate Marketing',
    description: 'Complete affiliate marketing platform — recruit partners, track referrals, automate payouts, and optimize program performance with real-time analytics.',
    features: [
      'Affiliate portal and self-service signup',
      'Real-time referral tracking and attribution',
      'Automated commission calculations and payouts',
      'Multi-tier and multi-level commission structures',
      'Affiliate recruitment and CRM tools',
      'Performance dashboards and reporting',
      'Fraud detection and click validation',
      'Integration with payment gateways (Stripe, PayPal)'
    ],
    benefits: [
      'Scale customer acquisition with partner channels',
      'Pay only for verified results (CPA model)',
      'Reduce affiliate management overhead by 70%',
      'Optimize program ROI with data-driven insights'
    ],
    pricing: { Starter: '$399/mo', Professional: '$999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-appointment-1',
    title: 'Smart Appointment & Queue Management',
    subtitle: 'AI-powered appointment booking, queue management, and customer flow optimization',
    category: 'saas',
    subcategory: 'Queue & Booking Management',
    description: 'Intelligent appointment and queue management for service businesses — salons, clinics, government offices, and retail — with AI-optimized scheduling and wait time predictions.',
    features: [
      'AI-optimized appointment scheduling',
      'Real-time queue management and digital queuing',
      'Wait time predictions and customer notifications',
      'Walk-in and hybrid appointment management',
      'Staff allocation optimization',
      'Customer self-service kiosk mode',
      'No-show prediction and prevention',
      'Analytics on utilization and peak hours'
    ],
    benefits: [
      'Reduce customer wait times by 40%',
      'Increase appointment utilization by 25%',
      'Minimize no-shows with smart reminders',
      'Improve customer satisfaction with transparent wait times'
    ],
    pricing: { Starter: '$299/mo', Professional: '$799/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-virtualevent-1',
    title: 'Virtual Event & Webinar Platform',
    subtitle: 'Host, manage, and monetize virtual events, webinars, and hybrid conferences',
    category: 'saas',
    subcategory: 'Event Management',
    description: 'Full-featured virtual event platform with live streaming, attendee engagement tools, sponsorship management, analytics, and on-demand content delivery.',
    features: [
      'HD live streaming with low latency',
      'Interactive features (Q&A, polls, chat, networking)',
      'Virtual expo booths and sponsor showcases',
      'Ticketing and registration management',
      'Agenda builder and speaker management',
      'On-demand replay and content library',
      'Attendee analytics and engagement scoring',
      'Hybrid event support (in-person + virtual)'
    ],
    benefits: [
      'Host events for 10 to 100,000+ attendees',
      'Generate revenue through ticket sales and sponsorships',
      'Measure engagement with detailed analytics',
      'Reduce event costs by 60% vs. in-person only'
    ],
    pricing: { Starter: '$299/mo', Professional: '$899/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }"""

# Find the last SAAS service closing pattern
saas_close_pattern = """  {
    id: 'saas-forms-1',
    title: 'Intelligent Form & Survey Platform',
    subtitle: 'Build smart forms with conditional logic, AI analysis, and automated follow-ups',
    category: 'saas',
    subcategory: 'Forms & Surveys',
    description: 'Create dynamic, intelligent forms and surveys with conditional logic, AI-powered response analysis, automated follow-up workflows, and CRM integration.',
    features: [
      'Drag-and-drop form builder with conditional logic',
      'AI-powered response analysis and summarization',
      'Automated follow-up emails based on responses',
      'CRM integration (Salesforce, HubSpot)',
      'Multi-step and conversational form formats',
      'A/B testing for form optimization',
      'Payment collection within forms',
      'Advanced analytics and submission tracking'
    ],
    benefits: [
      'Capture 40%+ more qualified leads',
      'Automate lead qualification with smart routing',
      'Reduce manual data review time by 80%',
      'Improve response rates with conversational forms'
    ],
    pricing: { Starter: '$99/mo', Professional: '$299/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];"""

new_saas_close = """  {
    id: 'saas-forms-1',
    title: 'Intelligent Form & Survey Platform',
    subtitle: 'Build smart forms with conditional logic, AI analysis, and automated follow-ups',
    category: 'saas',
    subcategory: 'Forms & Surveys',
    description: 'Create dynamic, intelligent forms and surveys with conditional logic, AI-powered response analysis, automated follow-up workflows, and CRM integration.',
    features: [
      'Drag-and-drop form builder with conditional logic',
      'AI-powered response analysis and summarization',
      'Automated follow-up emails based on responses',
      'CRM integration (Salesforce, HubSpot)',
      'Multi-step and conversational form formats',
      'A/B testing for form optimization',
      'Payment collection within forms',
      'Advanced analytics and submission tracking'
    ],
    benefits: [
      'Capture 40%+ more qualified leads',
      'Automate lead qualification with smart routing',
      'Reduce manual data review time by 80%',
      'Improve response rates with conversational forms'
    ],
    pricing: { Starter: '$99/mo', Professional: '$299/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
""" + new_saas_services + """
];"""

if saas_close_pattern in content:
    content = content.replace(saas_close_pattern, new_saas_close)
    print("✓ Added 6 new Micro SAAS services (Batch 6)")
else:
    print("⚠ Could not find SAAS section closing pattern")

# ============================================================
# ADD NEW CONSULTING SERVICES (before closing ]; of consultingServices)
# ============================================================

new_consulting_services = """  {
    id: 'consult-startup-2',
    title: 'Venture Due Diligence & Tech Assessment',
    subtitle: 'Technical due diligence for investors, acquirers, and startups preparing for funding rounds',
    category: 'consulting',
    subcategory: 'Technical Due Diligence',
    description: 'Comprehensive technical due diligence for M&A, VC funding, and acquisition scenarios — evaluating code quality, architecture, scalability, security, and technical debt.',
    features: [
      'Source code quality assessment',
      'Architecture scalability review',
      'Security and vulnerability audit',
      'Technical debt quantification',
      'Team and process evaluation',
      'Infrastructure and DevOps maturity',
      'Scalability stress testing',
      'Investment risk scoring and recommendations'
    ],
    benefits: [
      'Identify hidden technical risks before investment',
      'Objective assessment of build vs. rebuild decisions',
      'Negotiate better deal terms with data-driven insights',
      'Accelerate investor confidence and close deals faster'
    ],
    pricing: { Starter: '$9,999/project', Professional: '$24,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'consult-datascience-1',
    title: 'Data Science & Advanced Analytics Consulting',
    subtitle: 'Transform raw data into predictive models and advanced analytics capabilities',
    category: 'consulting',
    subcategory: 'Data Science',
    description: 'End-to-end data science consulting — from data strategy and feature engineering to model development, deployment, and continuous optimization of ML/AI models.',
    features: [
      'Data strategy and maturity assessment',
      'Feature engineering and data pipeline design',
      'Predictive model development and validation',
      'Deep learning and NLP model development',
      'Model deployment and MLOps setup',
      'Experiment design and A/B testing',
      'Causal inference and advanced analytics',
      'Model monitoring and retraining strategy'
    ],
    benefits: [
      'Turn data into competitive advantage',
      'Reduce time-to-insight by 70%',
      'Build production-ready predictive models',
      'Measure and optimize business impact of AI/ML investments'
    ],
    pricing: { Starter: '$7,999/project', Professional: '$19,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }"""

consulting_close_pattern = """  {
    id: 'consult-web3-1',
    title: 'Web3 & DeFi Strategy Consulting',
    subtitle: 'Navigate the decentralized future with expert Web3 and DeFi advisory',
    category: 'consulting',
    subcategory: 'Web3 / DeFi',
    description: 'Strategic consulting for blockchain adoption, DeFi protocol development, DAO governance, tokenomics design, and digital asset strategy.',
    features: [
      'Blockchain adoption strategy and assessment',
      'DeFi protocol audit and risk assessment',
      'DAO governance design and implementation',
      'Tokenomics modeling and token launch support',
      'NFT strategy and digital asset monetization',
      'Smart contract security review'
    ],
    benefits: [
      'Navigate complex and evolving Web3 landscape',
      'Launch blockchain projects with confidence',
      'Mitigate risks in DeFi and token economics',
      'Stay compliant with evolving crypto regulations'
    ],
    pricing: { Starter: '$4,999/project', Professional: '$14,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];"""

new_consulting_close = """  {
    id: 'consult-web3-1',
    title: 'Web3 & DeFi Strategy Consulting',
    subtitle: 'Navigate the decentralized future with expert Web3 and DeFi advisory',
    category: 'consulting',
    subcategory: 'Web3 / DeFi',
    description: 'Strategic consulting for blockchain adoption, DeFi protocol development, DAO governance, tokenomics design, and digital asset strategy.',
    features: [
      'Blockchain adoption strategy and assessment',
      'DeFi protocol audit and risk assessment',
      'DAO governance design and implementation',
      'Tokenomics modeling and token launch support',
      'NFT strategy and digital asset monetization',
      'Smart contract security review'
    ],
    benefits: [
      'Navigate complex and evolving Web3 landscape',
      'Launch blockchain projects with confidence',
      'Mitigate risks in DeFi and token economics',
      'Stay compliant with evolving crypto regulations'
    ],
    pricing: { Starter: '$4,999/project', Professional: '$14,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
""" + new_consulting_services + """
];"""

if consulting_close_pattern in content:
    content = content.replace(consulting_close_pattern, new_consulting_close)
    print("✓ Added 2 new Consulting services (Batch 6)")
else:
    print("⚠ Could not find Consulting section closing pattern")

# ============================================================
# UPDATE CATEGORY METADATA COUNTS
# ============================================================

# Count occurrences in the final file
ai_count = content.count("category: 'ai'")
it_count = content.count("category: 'it'")
saas_count = content.count("category: 'saas'")
consulting_count = content.count("category: 'consulting'")

old_meta = """export const categoryMeta = {
  ai: { label: 'AI Services', icon: 'brain-circuit', count: aiServices.length },
  it: { label: 'IT Services', icon: 'server-cog', count: itServices.length },
  saas: { label: 'Micro SAAS Solutions', icon: 'rocket', count: saasSolutions.length },
  consulting: { label: 'IT Consulting', icon: 'briefcase-badge', count: consultingServices.length },
};"""

# Use actual JS expressions so they auto-update
new_meta = """export const categoryMeta = {
  ai: { label: 'AI Services', icon: 'brain-circuit', count: aiServices.length },
  it: { label: 'IT Services', icon: 'server-cog', count: itServices.length },
  saas: { label: 'Micro SAAS Solutions', icon: 'rocket', count: saasSolutions.length },
  consulting: { label: 'IT Consulting', icon: 'briefcase-badge', count: consultingServices.length },
};"""

# The meta already uses .length so it auto-updates — just confirm it's intact
print(f"\n📊 Category counts (auto-tracked via .length):")
print(f"   AI Services: {ai_count}")
print(f"   IT Services: {it_count}")
print(f"   Micro SAAS: {saas_count}")
print(f"   Consulting: {consulting_count}")

# ============================================================
# WRITE BACK
# ============================================================
with open(path, 'w') as f:
    f.write(content)

total_lines = content.count('\n')
print(f"\n📝 File written: {total_lines} lines")
print(f"✅ All fixes and additions complete!")