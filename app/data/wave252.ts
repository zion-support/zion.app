import { Service } from './serviceTypes';

// Wave 252 — AI Code Security, Natural Language Data Querying, AI-Powered Recruiting,
// Digital Twin Simulation, and AI Accessibility Testing
// Research by @tablet_kleber_bot — 2026-06-19

export const wave252AiCodeSecurityServices: Service[] = [
  {
    id: 'snyk-ai-code-security',
    title: 'Snyk — AI-Powered Code Security Platform',
    description: 'Snyk is the leading AI-powered code security platform that helps developers find, prioritize, and fix vulnerabilities in code, dependencies, containers, and infrastructure as code. Trusted by 2.2 million+ developers and 1,200+ enterprises including Google, Microsoft, and Salesforce, Snyk scans 3 billion+ tests per month.',
    category: 'ai-code-security',
    icon: '🛡️',
    href: '/services/snyk-ai-code-security',
    industry: 'Application Security & DevSecOps',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (200 tests/month, 1 user, public repos)', pro: '$100/user/month (unlimited tests, private repos)', enterprise: 'Custom (SSO, on-prem, custom policies, SLA)' },
    contactInfo: { website: 'https://snyk.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI-powered vulnerability detection: find security issues in code, dependencies, containers, and IaC',
      'One-click fix: AI generates precise code fixes that developers can apply with a single click',
      'Priority scoring: AI ranks vulnerabilities by exploitability, reachability, and business impact',
      'IDE integration: real-time security scanning in VS Code, IntelliJ, and 20+ environments',
      'Container security: scan Docker images and Kubernetes manifests for misconfigurations',
      'Infrastructure as Code security: detect misconfigurations in Terraform, CloudFormation, and Helm'
    ],
    benefits: [
      'Prevent 1 billion+ vulnerabilities from reaching production with AI-powered scanning',
      'Reduce security noise by 80% with AI prioritization that focuses on what matters',
      'Trusted by 2.2 million+ developers and 1,200+ enterprises including Google and Microsoft',
      'Shift security left: find and fix vulnerabilities during development, not after deployment',
      'One-click remediation: developers fix issues in seconds instead of hours'
    ]
  }
];

export const wave252NaturalLanguageDataServices: Service[] = [
  {
    id: 'vanna-ai-natural-language-sql',
    title: 'Vanna.AI — Natural Language to SQL Query Engine',
    description: 'Vanna.AI is an open-source Python framework that enables natural language queries against databases using AI. Users ask questions in plain English and Vanna generates accurate SQL queries, executes them, and returns results with visualizations. Built on large language models fine-tuned on SQL patterns.',
    category: 'natural-language-data',
    icon: '💬',
    href: '/services/vanna-ai-natural-language-sql',
    industry: 'Data Analytics & Business Intelligence',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, self-hosted)', pro: '$50/month (managed cloud, 100 queries/day, 5 users)', enterprise: 'Custom (unlimited queries, SSO, custom model training)' },
    contactInfo: { website: 'https://vanna.ai', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Natural language to SQL: ask questions in plain English and get accurate SQL',
      'Self-improving AI: learns from each query-result pair to improve accuracy',
      'Multi-database support: works with Snowflake, BigQuery, PostgreSQL, SQL Server, and 20+',
      'Auto-generated visualizations: AI selects the best chart type for each result',
      'Schema-aware: understands your database schema, relationships, and business terminology',
      'Open source: Apache 2.0 license with 10,000+ GitHub stars'
    ],
    benefits: [
      'Democratize data access: non-technical users query databases without SQL',
      'Reduce analytics bottlenecks: business users get answers instantly',
      'Improve query accuracy: AI learns your schema and business context',
      'Open source freedom: self-host for data sovereignty or use managed cloud',
      '10,000+ GitHub stars: battle-tested by Fortune 500 data teams'
    ]
  }
];

export const wave252AiRecruitingServices: Service[] = [
  {
    id: 'hirevue-ai-recruiting-platform',
    title: 'HireVue — AI-Powered Recruiting & Talent Acquisition',
    description: 'HireVue is the leading AI-powered recruiting platform that transforms talent acquisition through video interviewing, AI assessments, and predictive analytics. Used by 700+ enterprise customers including Hilton, Unilever, and Delta Air Lines, HireVue processes 20 million+ interviews per year.',
    category: 'ai-recruiting',
    icon: '👥',
    href: '/services/hirevue-ai-recruiting-platform',
    industry: 'Human Resources & Talent Acquisition',
    stage: 'published',
    popular: true,
    pricing: { basic: '$5,000/year (basic video interviewing, 100 assessments)', pro: '$25,000/year (AI assessments, analytics, 1,000 assessments)', enterprise: 'Custom (unlimited assessments, custom AI models, SLA)' },
    contactInfo: { website: 'https://hirevue.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI video interviewing: structured interviews with AI-powered competency assessment',
      'Game-based assessments: evaluate cognitive ability, personality, and job-relevant skills',
      'Predictive analytics: AI predicts job performance and retention',
      'Bias reduction: structured evaluations and regular AI fairness audits',
      'ATS integration: seamless connection with Workday, SAP, Greenhouse, and Lever',
      'Compliance: EEOC, GDPR, and NYC Local Law 144 compliant'
    ],
    benefits: [
      'Reduce time-to-hire by 50% with AI-powered screening and assessment',
      'Improve quality-of-hire by 25% with predictive analytics',
      'Process 20 million+ interviews per year for 700+ enterprise customers',
      'Ensure fair hiring with regular AI bias audits and structured evaluations',
      'Scale recruiting without adding headcount through automation'
    ]
  }
];

export const wave252DigitalTwinSimulationServices: Service[] = [
  {
    id: 'ansys-digital-twin-simulation',
    title: 'Ansys — Digital Twin Simulation & Engineering Platform',
    description: 'Ansys is the global leader in engineering simulation and digital twin technology, providing physics-based simulation software that creates virtual replicas of physical products, systems, and processes. Used by 50,000+ companies including Tesla, Boeing, and Siemens.',
    category: 'digital-twin-simulation',
    icon: '🔬',
    href: '/services/ansys-digital-twin-simulation',
    industry: 'Engineering Simulation & Digital Twins',
    stage: 'published',
    popular: true,
    pricing: { basic: '$5,000/year (Ansys Discovery, basic simulation, 1 user)', pro: '$25,000/year (full physics suite, digital twin builder, 5 users)', enterprise: 'Custom (unlimited users, HPC, custom physics, SLA)' },
    contactInfo: { website: 'https://ansys.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Physics-based simulation: structural, thermal, fluid, electromagnetic analysis',
      'Live digital twins: combine simulation models with IoT sensor data',
      'Predictive maintenance: simulate wear, fatigue, and failure modes',
      'Optimization AI: automatically explore design spaces for optimal configurations',
      'Cloud simulation: run massive simulations on cloud HPC',
      'Industry-specific solutions: automotive, aerospace, energy, healthcare templates'
    ],
    benefits: [
      'Reduce physical prototyping costs by 75% with accurate virtual testing',
      'Accelerate time-to-market by 50% through simulation-driven design',
      'Trusted by 50,000+ companies including Tesla, Boeing, and Siemens',
      'Predict failures before they occur with live digital twins',
      'Explore thousands of design variations in hours instead of months'
    ]
  }
];

export const wave252AiAccessibilityTestingServices: Service[] = [
  {
    id: 'accessibility-inspector-ai-testing',
    title: 'Accessibility Inspector — AI-Powered Accessibility Testing',
    description: 'Accessibility Inspector is an AI-powered accessibility testing platform that automatically detects, prioritizes, and helps fix digital accessibility issues across websites, mobile apps, and documents. Using computer vision, NLP, and machine learning, it identifies WCAG 2.2 violations that traditional rule-based tools miss.',
    category: 'ai-accessibility-testing',
    icon: '♿',
    href: '/services/accessibility-inspector-ai-testing',
    industry: 'Digital Accessibility & Compliance',
    stage: 'published',
    popular: true,
    pricing: { basic: '$99/month (100 pages, basic WCAG 2.1 checks)', pro: '$499/month (1,000 pages, WCAG 2.2, AI fix suggestions)', enterprise: 'Custom (unlimited pages, custom compliance frameworks, SLA)' },
    contactInfo: { website: 'https://accessibilityinspector.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI-powered WCAG 2.2 testing: detect 3x more issues than rule-based tools',
      'Context-aware analysis: understand page semantics to catch issues traditional tools miss',
      'Automated fix suggestions: AI generates specific code fixes for each violation',
      'Continuous monitoring: scheduled scans that alert when new issues are introduced',
      'Compliance reporting: generate VPAT, ACR, and Section 508 documentation',
      'Multi-platform: test websites, mobile apps, PDFs, and digital documents'
    ],
    benefits: [
      'Detect 3x more accessibility issues than traditional rule-based tools',
      'Reduce remediation time by 80% with AI-generated fix recommendations',
      'Ensure WCAG 2.2, ADA, Section 508, and EN 301 549 compliance',
      'Trusted by 5,000+ organizations including government agencies and Fortune 500',
      'Prevent accessibility lawsuits with continuous monitoring'
    ]
  }
];
