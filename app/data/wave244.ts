import { Service } from './serviceTypes';

// Wave 244 — Infrastructure as Code, AI Procurement, Synthetic Media Detection,
// WebAssembly Runtimes, and Developer Portals
// Research by @tablet_kleber_bot — 2026-06-07
// New categories: infrastructure-as-code, ai-procurement, synthetic-media-detection,
// webassembly-runtime, developer-portal

export const wave244InfrastructureAsCodeServices: Service[] = [
  {
    id: 'pulumi-infrastructure-as-code',
    title: 'Pulumi — Modern Infrastructure as Code with Real Programming Languages',
    description: 'Pulumi is an open-source Infrastructure as Code platform that lets engineers define cloud infrastructure using real programming languages (TypeScript, Python, Go, C#, Java) instead of YAML or DSLs. With 250,000+ users and adoption by Mercedes-Benz, Atlassian, and Nike, Pulumi manages 100+ cloud providers including AWS, Azure, GCP, Kubernetes, Datadog, and Cloudflare through a single workflow. Its Automation API enables embedding infrastructure provisioning in CI/CD pipelines, and Pulumi ESC (Environments, Secrets, and Configuration) provides enterprise-grade secrets management and environment composition. Pulumi Copilot adds AI-powered infrastructure generation from natural language prompts.',
    category: 'infrastructure-as-code',
    icon: '🏗️',
    href: '/services/pulumi-infrastructure-as-code',
    industry: 'DevOps & Cloud Engineering',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (team of 1, unlimited stacks)', pro: '$100/user/month (team features, SSO, policy)', enterprise: 'Custom (self-hosted, audit logs, dedicated support)' },
    contactInfo: { website: 'https://pulumi.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Real languages: write IaC in TypeScript, Python, Go, C#, or Java — no HCL or YAML required',
      '250+ provider packages: AWS, Azure, GCP, Kubernetes, Datadog, Cloudflare, and more',
      'Pulumi Copilot: AI that generates infrastructure code from natural language descriptions',
      'Automation API: embed provisioning in CI/CD, GUIs, and custom developer platforms',
      'Pulumi Policy as Code: enforce security, cost, and compliance policies with CrossGuard',
      'Pulumi ESC: centralized secrets management with environment composition and OIDC integration'
    ],
    benefits: [
      'Onboard developers 5x faster — use familiar languages and IDEs instead of learning Helm or HCL',
      'Catch misconfigurations before deployment with Policy as Code guardrails',
      'Unify infrastructure and application code in one repo, same PR workflow, same reviews',
      'Trusted by 250,000+ engineers at companies including Mercedes-Benz, Atlassian, and Nike',
      'Pulumi Copilot generates entire cloud architectures from a single sentence in seconds'
    ]
  }
];

export const wave244AiProcurementServices: Service[] = [
  {
    id: 'torq-ai-procurement-automation',
    title: 'Torq — AI-Powered Procurement & Vendor Security Automation',
    description: 'Torq is an enterprise security and procurement automation platform that uses AI to automate security questionnaires, vendor risk assessments, RFP responses, and compliance workflows. Used by enterprises managing thousands of vendor relationships, Torq replaces weeks of manual security review work with AI-driven workflows that analyze SOC 2 reports, ISO 27001 certificates, penetration test results, and privacy policies in minutes. Its AI agent continuously monitors vendor risk posture and alerts teams to changes, reducing vendor onboarding from 4-6 weeks to days. Torq integrates with Salesforce, ServiceNow, Jira, and all major GRC platforms.',
    category: 'ai-procurement',
    icon: '🤝',
    href: '/services/torq-ai-procurement-automation',
    industry: 'Enterprise Security & Procurement',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Not publicly listed — custom enterprise pricing', pro: 'Contact for vendor risk automation quote', enterprise: 'Custom (unlimited vendors + integrations + dedicated CSM)' },
    contactInfo: { website: 'https://torq.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI security questionnaire processing: auto-analyze SOC 2, ISO 27001, and penetration test reports',
      'Vendor risk scoring: continuous AI monitoring of vendor security posture with change alerts',
      'RFP/RFI automation: generate responses from existing security documentation in minutes',
      'Multi-framework mapping: map vendor controls to SOC 2, ISO 27001, NIST, HIPAA, PCI-DSS simultaneously',
      'Workflow orchestration: parallel approvals, escalation rules, and SLA tracking for vendor reviews',
      'Integrations: Salesforce, ServiceNow, Jira, GRC platforms, and Slack for team notifications'
    ],
    benefits: [
      'Reduce vendor security review time from 4-6 weeks to days — accelerate procurement cycles',
      'Never miss a vendor security downgrade with continuous AI monitoring and alerts',
      'Map one vendor assessment to every compliance framework — eliminate redundant reviews',
      'Free up security engineers from repetitive questionnaire review for strategic work',
      'Enterprise-grade: built for organizations managing thousands of vendor relationships'
    ]
  }
];

export const wave244SyntheticMediaDetectionServices: Service[] = [
  {
    id: 'synthia-deepfake-detection',
    title: 'Synthesia — AI Video Generation & Synthetic Media Platform',
    description: 'Synthesia is the world\'s leading AI video generation platform that enables businesses to create professional videos with AI avatars and text-to-speech in 140+ languages. Used by 50,000+ companies including Google, Nike, and the BBC, Synthesia transforms text scripts into polished presenter videos without cameras, studios, or actors. It features 230+ diverse AI avatars, custom avatar creation, real-time video translation, and built-in brand kits for consistent corporate communication. Synthesia generates over 1 million videos per month and has been adopted for training, sales enablement, internal comms, and customer support across 10,000+ enterprises. Its Enterprise plan includes SSO, SCIM provisioning, SOC 2 compliance, and an API for video generation at scale.',
    category: 'synthetic-media-detection',
    icon: '🎬',
    href: '/services/synthia-deepfake-detection',
    industry: 'Synthetic Media & Video AI',
    stage: 'published',
    popular: true,
    pricing: { basic: '$30/month (10 AI videos, 1 seat)', pro: '$99/month (unlimited videos, 5 seats)', enterprise: 'Custom (API access, custom avatars, SSO, SOC 2)' },
    contactInfo: { website: 'https://synthesia.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '230+ AI avatars: diverse, photorepresentative presenters available in 140+ languages',
      'Custom avatar: create a digital twin of a real presenter in a 15-minute recording session',
      'Video translation: instantly translate any generated video into 140+ languages with matching lip-sync',
      'Brand kit: consistent fonts, colors, logos, and intro/outro across every video',
      'API and integrations: generate videos programmatically or from LMS/HRIS/CRM systems',
      'Synthesia for Enterprise: SSO, SCIM, SOC 2 Type II, dedicated CSM, and SLA guarantees'
    ],
    benefits: [
      'Produce professional training videos 10x faster and 10x cheaper than traditional production',
      'Scale content to 140+ languages without hiring translators or re-recording presenters',
      'Update videos instantly when content changes — re-rendering in minutes, not weeks',
      'Used by 50,000+ companies including Google, Nike, BBC, and Shopify',
      'Custom avatars let executives "present" thousands of videos without studio time'
    ]
  }
];

export const wave244WebassemblyRuntimeServices: Service[] = [
  {
    id: 'fermyon-spin-wasm-runtime',
    title: 'Fermyon Spin — WebAssembly Serverless Runtime for Cloud & Edge',
    description: 'Fermyon Spin is an open-source serverless runtime built on WebAssembly (Wasm) that enables developers to build, deploy, and scale microservices with near-instant cold starts (sub-millisecond), smaller binaries (MBs vs. GBs for containers), and strong sandboxing. Built on the Wasmtime and WasmSpin engines, Spin supports Rust, JavaScript/TypeScript, Go, Python, and .NET with a single CLI. Fermyon Cloud provides a fully managed Tier 0 serverless platform running Spin applications at the edge, and Fermyon Platform enables on-premises Wasm deployment for regulated industries. Used by enterprises for serverless APIs, plugin systems, event-driven functions, and edge compute where cold start and security isolation matter.',
    category: 'webassembly-runtime',
    icon: '⚡',
    href: '/services/fermyon-spin-wasm-runtime',
    industry: 'Cloud Computing & Serverless',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, self-hosted Spin CLI)', pro: 'Fermyon Cloud Free tier (1M requests/month)', enterprise: 'Custom (Fermyon Platform on-prem, dedicated support, SLA)' },
    contactInfo: { website: 'https://fermyon.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Sub-millisecond cold starts: Wasm microVMs boot in under 100µs vs. seconds for containers',
      'Tiny binaries: spin up with MBs instead of GB container images — faster deploys, less bandwidth',
      'Sandboxed execution: each function runs in a capability-based security sandbox with no shared state',
      'Multi-language: Rust, JavaScript, TypeScript, Go, Python, and .NET with unified Spin CLI',
      'Fermyon Cloud: fully managed Tier 0 serverless with global edge deployment and auto-scaling',
      'Component Model: WASI and the WebAssembly Component Model for composable, language-agnostic modules'
    ],
    benefits: [
      'Cold starts 1,000x faster than containers — ideal for APIs, event handlers, and edge compute',
      'Deploy MBs instead of GBs: faster CI/CD, lower registry costs, and reduced attack surface',
      'Strong sandboxing: functions cannot access host resources without explicit capability grants',
      'Language-agnostic: teams write in their language and compose modules at the Wasm component level',
      'Built by co-creators of the Bytecode Alliance and core contributors to Wasmtime and WASI'
    ]
  }
];

export const wave244DeveloperPortalServices: Service[] = [
  {
    id: 'backstage-developer-portal',
    title: 'Backstage — Spotify Open-Source Developer Portal Platform',
    description: 'Backstage is an open-source developer portal platform originally built at Spotify and now a CNCF Graduated project. It provides a unified software catalog, developer self-service templates, plugin ecosystem, and technical documentation hub for engineering organizations. With 3,000+ adopters including American Airlines, Spotify, Southwest, and Zalando, Backstage manages software ownership, tracks service health, and enables developers to scaffold new microservices, create cloud resources, and publish docs from a single interface. Its 1,500+ plugin ecosystem integrates with GitHub, GitLab, Kubernetes, Datadog, PagerDuty, Snyk, and every major cloud and SaaS tool. Backstage reduces onboarding from weeks to hours and enforces golden-path templates for consistent, secure infrastructure.',
    category: 'developer-portal',
    icon: '🏛️',
    href: '/services/backstage-developer-portal',
    industry: 'Developer Experience & Platform Engineering',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, self-hosted, CNCF project)', pro: 'Free (community plugins, 1,500+ integrations)', enterprise: 'Custom (Roadie, Spotify Backstage Managed, or self-hosted with enterprise support)' },
    contactInfo: { website: 'https://backstage.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Software Catalog: auto-discovered inventory of all services, APIs, libraries, and data pipelines',
      'Scaffolder: self-service templates that create repos, CI/CD, cloud resources, and register in catalog',
      'TechDocs: docs-as-code powered by Markdown, searchable across all teams and services',
      '1,500+ plugins: GitHub, GitLab, Kubernetes, Datadog, PagerDuty, Snyk, Jenkins, ArgoCD, and more',
      'Search: unified search across catalog, docs, Stack Overflow, Confluence, and internal wikis',
      'Kubernetes plugin: view deployments, pods, and health directly in the Backstage service page'
    ],
    benefits: [
      'Reduce developer onboarding from weeks to hours with a single pane of glass for all services',
      'Enforce golden-path templates: every new service follows security, naming, and infra standards',
      'Eliminate tribal knowledge: every service has an owner, docs, dependencies, and health status',
      'CNCF Graduated project with 3,000+ adopters including Spotify, American Airlines, and Zalando',
      '1,500+ plugins mean Backstage integrates with every tool in your existing stack'
    ]
  }
];
