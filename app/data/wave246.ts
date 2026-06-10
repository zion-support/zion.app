import { Service } from './serviceTypes';

// Wave 246 — AI Code Review, Incident Management, Developer Experience,
// Edge AI Inference, and AI Governance
// Research by @tablet_kleber_bot — 2026-06-19
// New categories: ai-code-review-tools, incident-management-platform,
// developer-experience-platform, edge-ai-inference, ai-governance-compliance

export const wave246AiCodeReviewServices: Service[] = [
  {
    id: 'github-copilot-code-review',
    title: 'GitHub Copilot Code Review — AI-Powered Pull Request Review',
    description: 'GitHub Copilot Code Review is an AI-powered code review tool that automatically analyzes pull requests, identifies bugs, security vulnerabilities, and code quality issues, and leaves contextual review comments directly in the PR. Built on OpenAI\'s models and trained on billions of lines of code, it understands code semantics, not just syntax, catching logic errors, race conditions, and anti-patterns that human reviewers often miss. Integrated natively into GitHub\'s pull request workflow, it reduces code review time by 50% and catches 30% more issues than manual review alone. Available for GitHub Team and Enterprise Cloud plans, it scales across repositories with custom rules and team-specific coding standards.',
    category: 'ai-code-review-tools',
    icon: '🔍',
    href: '/services/github-copilot-code-review',
    industry: 'Developer Tools & AI',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Included with GitHub Team ($4/user/month)', pro: 'Included with GitHub Enterprise ($21/user/month)', enterprise: 'Custom (GitHub Enterprise Cloud + Advanced Security)' },
    contactInfo: { website: 'https://github.com/features/copilot', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Automatic PR analysis: AI reviews every pull request and leaves contextual comments',
      'Bug and vulnerability detection: catches logic errors, security flaws, and anti-patterns',
      'Custom review rules: define team-specific coding standards and enforcement policies',
      'Summary generation: auto-summarize PR changes for faster human reviewer context',
      'Suggested fixes: one-click apply AI-generated code fixes directly in the PR diff',
      'Integration with GitHub Actions: block merges on critical AI-detected issues'
    ],
    benefits: [
      'Reduce code review time by 50% — AI catches issues before human reviewers start',
      'Catch 30% more bugs and security vulnerabilities than manual review alone',
      'Enforce coding standards automatically across every repository and team',
      'Scale code review capacity without hiring additional senior engineers',
      'Native GitHub integration — no new tools, no context switching for developers'
    ]
  }
];

export const wave246IncidentManagementServices: Service[] = [
  {
    id: 'pagerduty-incident-management',
    title: 'PagerDuty — Digital Operations and Incident Management Platform',
    description: 'PagerDuty is the leading digital operations management platform that helps organizations detect, triage, and resolve incidents affecting their digital services. Processing over 15 million incidents per year for 25,000+ customers including Salesforce, Shopify, and Netflix, PagerDuty correlates alerts from 700+ monitoring tools, routes them to the right on-call engineer, and orchestrates response workflows. Its AI-powered AIOps engine reduces alert noise by 98% through event grouping and contextual enrichment. PagerDuty\'s platform includes Incident Management, On-Call Scheduling, Automation Actions, and Analytics that measure MTTR, incident frequency, and operational health.',
    category: 'incident-management-platform',
    icon: '🚨',
    href: '/services/pagerduty-incident-management',
    industry: 'DevOps & Site Reliability',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (5 users, basic incident management)', pro: '$21/user/month (on-call scheduling, escalations, automation)', enterprise: '$49/user/month (AIOps, analytics, change events, SSO)' },
    contactInfo: { website: 'https://pagerduty.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Intelligent alert grouping: AI correlates 98% of noise into actionable incidents',
      '700+ integrations: Datadog, New Relic, AWS CloudWatch, Prometheus, Slack, and more',
      'On-call scheduling: automated rotations, escalation policies, and fatigue management',
      'Automated response: trigger runbooks, restart services, or scale infrastructure from incidents',
      'Incident analytics: MTTR trends, incident frequency, and team performance dashboards',
      'Post-incident reviews: blameless post-mortem templates with timeline reconstruction'
    ],
    benefits: [
      'Reduce alert noise by 98% — engineers respond to real incidents, not false positives',
      'Cut MTTR by 60% with automated routing, context, and runbook execution',
      'Eliminate on-call burnout with intelligent scheduling and fatigue detection',
      'Trusted by 25,000+ organizations including Salesforce, Shopify, and Netflix',
      'Measure and improve operational health with incident analytics and trend reporting'
    ]
  }
];

export const wave246DeveloperExperienceServices: Service[] = [
  {
    id: 'backstage-developer-portal',
    title: 'Backstage — Spotify\'s Open-Source Developer Portal Platform',
    description: 'Backstage is an open-source developer portal platform created by Spotify that provides a unified interface for discovering, managing, and operating software across an organization. It centralizes service catalogs, documentation, CI/CD pipelines, APIs, and infrastructure into a single pane of glass, reducing developer cognitive load and onboarding time. With 30,000+ GitHub stars and adoption by American Airlines, Expedia, and Spotify, Backstage has become the industry standard for internal developer platforms. Its plugin architecture allows teams to extend the portal with custom integrations for any tool, from Kubernetes to Jira to internal microservices.',
    category: 'developer-experience-platform',
    icon: '🎛️',
    href: '/services/backstage-developer-portal',
    industry: 'Developer Tools & Platform Engineering',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, Apache 2.0 license)', pro: 'Free (self-hosted, community plugins)', enterprise: 'Custom (managed hosting via Roadie, Frontside, or internal platform team)' },
    contactInfo: { website: 'https://backstage.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Service catalog: discover every microservice, API, library, and data pipeline in one place',
      'Software templates: scaffold new services with approved patterns in minutes, not days',
      'Tech docs: documentation-as-code with Markdown, searchable alongside service metadata',
      'Plugin ecosystem: 200+ plugins for Kubernetes, CI/CD, monitoring, cost management, and more',
      'API catalog: discover, test, and consume internal APIs with OpenAPI/GraphQL documentation',
      'Custom extensions: build plugins for any internal tool, workflow, or governance requirement'
    ],
    benefits: [
      'Reduce new developer onboarding from weeks to hours with a single portal for everything',
      'Standardize service creation with templates that enforce security, naming, and architecture',
      'Eliminate tool sprawl: one interface for CI/CD, docs, APIs, infrastructure, and monitoring',
      '30,000+ GitHub stars and adopted by Spotify, American Airlines, Expedia, and LinkedIn',
      'Plugin architecture means infinite extensibility for any internal tool or workflow'
    ]
  }
];

export const wave246EdgeAiInferenceServices: Service[] = [
  {
    id: 'nvidia-triton-inference-server',
    title: 'NVIDIA Triton Inference Server — Production AI Inference at the Edge',
    description: 'NVIDIA Triton Inference Server is the leading open-source inference serving platform that standardizes AI model deployment and execution across cloud, data center, and edge environments. It supports every major framework — TensorFlow, PyTorch, ONNX, TensorRT, Python, and custom backends — and optimizes inference on NVIDIA GPUs, x86 CPUs, and ARM processors. Triton powers production AI inference for companies like Microsoft, Tencent, and Siemens, handling billions of inferences per day with features like dynamic batching, model ensemble pipelines, and concurrent model execution. Its integration with NVIDIA\'s Jetson platform makes it the standard for edge AI inference in robotics, autonomous vehicles, and industrial IoT.',
    category: 'edge-ai-inference',
    icon: '🧠',
    href: '/services/nvidia-triton-inference-server',
    industry: 'AI Infrastructure & Edge Computing',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, Apache 2.0 license)', pro: 'Free (self-hosted, community support)', enterprise: 'Custom (NVIDIA AI Enterprise license, production support, SLA)' },
    contactInfo: { website: 'https://developer.nvidia.com/triton-inference-server', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-framework support: serve TensorFlow, PyTorch, ONNX, TensorRT, and custom backends',
      'Dynamic batching: automatically group requests for 5-10x throughput improvement',
      'Model ensembles: chain multiple models into pipelines with shared preprocessing',
      'Concurrent execution: serve multiple models on the same GPU with resource isolation',
      'Edge deployment: optimized for NVIDIA Jetson, DRIVE, and IGX edge AI platforms',
      'Model monitoring: track latency, throughput, and error rates per model in real-time'
    ],
    benefits: [
      'Standardize inference serving across every framework, hardware, and deployment target',
      'Achieve 5-10x throughput improvement with dynamic batching and GPU optimization',
      'Deploy the same model from cloud to edge without code changes',
      'Power production AI for Microsoft, Tencent, Siemens, and millions of edge devices',
      'Open-source core with enterprise support available through NVIDIA AI Enterprise'
    ]
  }
];

export const wave246AiGovernanceServices: Service[] = [
  {
    id: 'arize-ai-observability-governance',
    title: 'Arize AI — Enterprise AI Observability and Governance Platform',
    description: 'Arize AI is the leading enterprise AI observability and governance platform that helps organizations monitor, explain, and improve production AI and LLM applications. It provides end-to-end visibility into model performance, data drift, bias detection, and LLM prompt-response quality, enabling responsible AI deployment at scale. Used by Apple, Airbnb, and Stanford Medicine, Arize AI supports every major ML framework and LLM provider (OpenAI, Anthropic, Google, Cohere) with automatic monitoring, alerting, and root cause analysis. Its Phoenix open-source library provides local debugging and evaluation for LLM applications, while the Arize platform delivers enterprise-grade monitoring, governance dashboards, and compliance reporting.',
    category: 'ai-governance-compliance',
    icon: '🛡️',
    href: '/services/arize-ai-observability-governance',
    industry: 'AI Governance & Responsible AI',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (Phoenix open-source library, local LLM evaluation)', pro: '$250/month (Arize Cloud, 50M predictions monitored)', enterprise: 'Custom (unlimited scale, on-premise, SSO, dedicated support)' },
    contactInfo: { website: 'https://arize.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Model performance monitoring: track accuracy, drift, and degradation in real-time',
      'LLM observability: monitor prompt-response quality, token usage, and hallucination rates',
      'Bias and fairness detection: automated bias scoring across demographic segments',
      'Data drift detection: identify when production data diverges from training distributions',
      'Root cause analysis: automatically trace performance degradation to specific data segments',
      'Compliance reporting: generate audit-ready reports for EU AI Act, NIST, and internal governance'
    ],
    benefits: [
      'Detect model degradation before it impacts customers — proactive monitoring and alerting',
      'Ensure responsible AI with automated bias detection and fairness scoring',
      'Meet EU AI Act and NIST AI RMF compliance with audit-ready governance reports',
      'Monitor every LLM provider (OpenAI, Anthropic, Google) in a unified platform',
      'Trusted by Apple, Airbnb, Stanford Medicine, and leading AI-first companies'
    ]
  }
];
