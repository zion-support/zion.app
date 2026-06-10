import { Service } from './serviceTypes';

// Wave 245 — AI Agent Orchestration, Data Product Platforms, Zero Trust Security,
// Synthetic Data Generation, and MLOps Platforms
// Research by @tablet_kleber_bot — 2026-06-19
// New categories: ai-agent-orchestration, data-product-platform, zero-trust-security,
// synthetic-data-generation, mlops-platform

export const wave245AiAgentOrchestrationServices: Service[] = [
  {
    id: 'langchain-langgraph-agent-orchestration',
    title: 'LangChain + LangGraph — AI Agent Orchestration Framework',
    description: 'LangChain and LangGraph are the leading open-source frameworks for building, orchestrating, and deploying autonomous AI agents. LangChain provides the building blocks — LLM integrations, prompt chains, memory, and tool connectors — while LangGraph adds stateful, cyclic agent workflows with human-in-the-loop checkpoints. Together, they power production AI agents at companies like LinkedIn, Uber, and JP Morgan. With 90,000+ GitHub stars, LangChain has the largest AI engineering community, and LangGraph\'s graph-based execution model enables complex multi-agent systems with error recovery, branching logic, and persistent state.',
    category: 'ai-agent-orchestration',
    icon: '🤖',
    href: '/services/langchain-langgraph-agent-orchestration',
    industry: 'AI Engineering & Infrastructure',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, MIT license)', pro: '$100/month (LangSmith observability, 50K traces)', enterprise: 'Custom (self-hosted, SSO, dedicated support, SLA)' },
    contactInfo: { website: 'https://langchain.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'LangGraph stateful agents: cyclic, branching workflows with persistent memory and human-in-the-loop',
      '700+ integrations: OpenAI, Anthropic, Google, Pinecone, PostgreSQL, Slack, GitHub, and more',
      'LangSmith observability: trace every LLM call, debug agent decisions, and evaluate output quality',
      'Multi-agent orchestration: coordinate teams of specialized agents with shared state and task routing',
      'Tool calling and function execution: agents use APIs, databases, code interpreters, and web browsers',
      'Memory management: short-term conversation history and long-term vector store retrieval (RAG)'
    ],
    benefits: [
      'Build production AI agents in days instead of months with pre-built orchestration primitives',
      'Debug and monitor every agent decision with LangSmith\'s visual trace explorer',
      'Scale from prototype to production: same code runs locally or on LangGraph Cloud',
      'Largest AI engineering community: 90K+ GitHub stars, extensive docs, and active Discord',
      'Used by LinkedIn, Uber, JP Morgan, and 100,000+ developers worldwide'
    ]
  }
];

export const wave245DataProductPlatformServices: Service[] = [
  {
    id: 'dbt-data-build-tool',
    title: 'dbt (Data Build Tool) — Analytics Engineering Platform',
    description: 'dbt (data build tool) is the industry-standard analytics engineering platform that transforms raw warehouse data into reliable, tested, documented data models. Created by dbt Labs, it enables analytics engineers to apply software engineering best practices — version control, testing, CI/CD, and modularity — to SQL-based data transformations. With 40,000+ companies using dbt including HubSpot, Vimeo, and Cisco, and a community of 300,000+ analytics engineers, dbt has defined the modern data stack. dbt Cloud provides a hosted development environment with job scheduling, observability, and a semantic layer for consistent metric definitions.',
    category: 'data-product-platform',
    icon: '📊',
    href: '/services/dbt-data-build-tool',
    industry: 'Data Engineering & Analytics',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (dbt Core, open source, unlimited local development)', pro: '$100/developer/month (dbt Cloud, job scheduling, CI/CD)', enterprise: 'Custom (SSO, audit logs, dedicated support, custom hosting)' },
    contactInfo: { website: 'https://getdbt.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'SQL-first transformations: write data models in SQL with Jinja templating for DRY, reusable code',
      'Built-in testing: schema tests, data quality tests, and custom assertions for every model',
      'Documentation auto-generation: data lineage graphs and column-level docs from YAML metadata',
      'Incremental models: process only new data for 10-100x faster pipeline runs',
      'dbt Semantic Layer: define metrics once, consume consistently across every BI tool',
      'dbt Cloud IDE: browser-based development with version control, job scheduling, and observability'
    ],
    benefits: [
      'Transform raw warehouse data into reliable, tested, documented data products',
      'Apply software engineering best practices (Git, CI/CD, testing) to analytics workflows',
      '40,000+ companies trust dbt including HubSpot, Vimeo, Cisco, and Monzo',
      'Define metrics once in dbt Semantic Layer — consistent KPIs across every dashboard',
      'Largest analytics engineering community: 300,000+ practitioners and 700+ packages'
    ]
  }
];

export const wave245ZeroTrustSecurityServices: Service[] = [
  {
    id: 'zscaler-zero-trust-exchange',
    title: 'Zscaler Zero Trust Exchange — Cloud-Native Security Platform',
    description: 'Zscaler Zero Trust Exchange is the world\'s largest cloud-native security platform, built on a zero trust architecture that eliminates implicit trust and continuously validates every digital interaction. Processing over 300 billion transactions per day for 7,300+ enterprise customers including 45% of Fortune 500 companies, Zscaler connects users, devices, and applications over any network without placing traffic through a corporate firewall. Its platform includes Zscaler Internet Access (ZIA), Zscaler Private Access (ZPA), and Zscaler Digital Experience (ZDx), providing secure web gateway, cloud firewall, CASB, DLP, and sandboxing in a single cloud platform.',
    category: 'zero-trust-security',
    icon: '🔒',
    href: '/services/zscaler-zero-trust-exchange',
    industry: 'Cybersecurity & Zero Trust',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Custom (enterprise sales required)', pro: 'Custom (per-user pricing, ZIA + ZPA bundles)', enterprise: 'Custom (full platform, dedicated support, professional services)' },
    contactInfo: { website: 'https://zscaler.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Zero trust network access (ZTNA): replace VPN with direct-to-app access without network exposure',
      'Secure web gateway: inspect all traffic including TLS/SSL with inline threat prevention',
      'Cloud access security broker (CASB): discover, classify, and protect SaaS application data',
      'Data loss prevention (DLP): prevent sensitive data exfiltration across web, email, and cloud',
      'AI-powered threat detection: 300B+ daily transactions analyzed with ML for zero-day threats',
      'Digital experience monitoring: measure and optimize application performance for every user'
    ],
    benefits: [
      'Eliminate VPN complexity and risk with direct-to-app zero trust access',
      'Reduce attack surface by 95% — no inbound firewall rules or exposed network segments',
      'Process 300B+ transactions/day with AI-powered threat detection at global scale',
      'Trusted by 45% of Fortune 500 companies including Siemens, Nestlé, and Accenture',
      'Consolidate 10+ point security products into one cloud-native platform'
    ]
  }
];

export const wave245SyntheticDataGenerationServices: Service[] = [
  {
    id: 'mostly-ai-synthetic-data-platform',
    title: 'MOSTLY AI — Enterprise Synthetic Data Generation Platform',
    description: 'MOSTLY AI is the leading enterprise synthetic data platform that generates statistically accurate, privacy-safe replicas of real-world data. Using state-of-the-art generative AI models, it produces synthetic datasets that preserve the statistical properties, correlations, and distributions of original data while containing zero real personal information. This enables organizations to share, analyze, and train AI models on data that would otherwise be restricted by GDPR, HIPAA, or internal governance. Used by financial institutions, healthcare organizations, and Fortune 500 companies, MOSTLY AI supports tabular, time-series, and relational data with up to 100% statistical fidelity.',
    category: 'synthetic-data-generation',
    icon: '🧬',
    href: '/services/mostly-ai-synthetic-data-platform',
    industry: 'Data Privacy & AI Training',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (up to 100K rows, community support)', pro: '$5,000/year (1M rows, advanced models, email support)', enterprise: 'Custom (unlimited rows, on-premise, dedicated CSM, SLA)' },
    contactInfo: { website: 'https://mostly.ai', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Statistical fidelity: synthetic data preserves 95-100% of original statistical properties',
      'Privacy guarantees: mathematically proven privacy — zero real records in synthetic output',
      'Multi-table support: generate relational datasets with referential integrity preserved',
      'Time-series synthesis: temporal patterns, seasonality, and trends maintained in synthetic data',
      'Bias detection and mitigation: identify and correct representation gaps in training data',
      'On-premise deployment: run within your VPC for air-gapped, maximum-security environments'
    ],
    benefits: [
      'Unlock data sharing across teams, partners, and borders without privacy risk',
      'Train AI models on statistically equivalent data when real data is scarce or restricted',
      'Achieve GDPR and HIPAA compliance — synthetic data is not personal data by definition',
      'Accelerate AI development cycles by generating unlimited training data on demand',
      'Trusted by Fortune 500 financial institutions, healthcare, and government agencies'
    ]
  }
];

export const wave245MlopsPlatformServices: Service[] = [
  {
    id: 'weights-and-biases-mlops',
    title: 'Weights & Biases — MLOps Platform for Experiment Tracking and Model Management',
    description: 'Weights & Biases (W&B) is the leading MLOps platform for experiment tracking, model management, and AI workflow orchestration. Used by over 800,000 AI researchers and engineers at organizations including OpenAI, Google DeepMind, NVIDIA, and Toyota Research, W&B provides a centralized system to log training runs, compare hyperparameters, visualize metrics, and version datasets and models. Its platform includes W&B Experiments (tracking), W&B Artifacts (data/model versioning), W&B Sweeps (hyperparameter optimization), and W&B Launch (distributed training jobs). W&B reduces the time from experiment to production by 60% and is the de facto standard in AI research labs worldwide.',
    category: 'mlops-platform',
    icon: '⚙️',
    href: '/services/weights-and-biases-mlops',
    industry: 'MLOps & AI Infrastructure',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (personal, unlimited experiments, 100GB storage)', pro: '$50/user/month (teams, 1TB storage, advanced reports)', enterprise: 'Custom (SSO, on-premise, dedicated support, custom storage)' },
    contactInfo: { website: 'https://wandb.ai', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Experiment tracking: log metrics, parameters, and outputs from every training run automatically',
      'Hyperparameter optimization: Bayesian search, grid search, and early stopping with W&B Sweeps',
      'Model and dataset versioning: track lineage from raw data through trained models to deployment',
      'Collaborative reports: share interactive visualizations and comparisons with stakeholders',
      'Framework integration: native support for PyTorch, TensorFlow, JAX, Hugging Face, and scikit-learn',
      'Artifact registry: version, store, and retrieve models, datasets, and pipelines programmatically'
    ],
    benefits: [
      'Never lose an experiment — every run is logged, searchable, and comparable',
      'Find optimal hyperparameters 10x faster with Bayesian optimization sweeps',
      'Reproduce any result with complete lineage from data version to model checkpoint',
      'Used by OpenAI, Google DeepMind, NVIDIA, and 800,000+ AI practitioners',
      'Reduce time from experiment to production deployment by 60%'
    ]
  }
];
