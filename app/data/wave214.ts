import { Service } from './serviceTypes';

export const wave214DeveloperExperiencePlatformsServices: Service[] = [
  {
    id: 'gitpod-cde',
    title: 'Gitpod Cloud Development Environments',
    description: 'Gitpod is a cloud development environment (CDE) platform that provides on-demand, fully-configured dev environments accessible from any browser. Every commit gets a pre-built workspace — eliminating "works on my machine" and reducing onboarding from days to seconds.',
    category: 'developer-experience-platforms',
    icon: '☁️',
    href: '/services/gitpod-cde',
    industry: 'Developer Tools & DevOps',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (50h/month)', pro: '$9/user/month', enterprise: 'Custom' },
    contactInfo: { website: 'https://gitpod.io', email: 'hello@gitpod.io', phone: 'N/A' },
    features: [
      'Cloud-based VS Code, JetBrains Gateway, and Theia IDE in the browser',
      'Prebuilt workspaces start in seconds with zero local setup',
      'Native GitHub, GitLab, and Bitbucket deep integration',
      'Ephemeral or persistent workspaces with full Linux containers',
      'Dotfiles, SSH keys, extensions, and env vars pre-configured per project'
    ],
    benefits: [
      'Eliminate local dev environment setup for new team members entirely',
      'Standardize tooling across the engineering organization',
      'Run builds, tests, and preview environments on every pull request ',
      'Trusted by SAP, ThoughtWorks, and 800,000+ developers worldwide'
    ]
  }
];

export const wave214AiCodeReviewServices: Service[] = [
  {
    id: 'coderabbit-ai-review',
    title: 'CodeRabbit AI Code Review',
    description: 'CodeRabbit is an AI-powered code review assistant that integrates with GitHub, GitLab, and Bitbucket to provide context-aware, line-by-line review comments on pull requests — helping teams ship higher-quality code with less manual review overhead.',
    category: 'ai-code-review',
    icon: '🐰',
    href: '/services/coderabbit-ai-review',
    industry: 'Developer Tools & AI',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (public repos)', pro: '$12/developer/month', enterprise: 'Custom' },
    contactInfo: { website: 'https://coderabbit.ai', email: 'support@coderabbit.ai', phone: 'N/A' },
    features: [
      'Line-by-line AI review comments on pull requests using large language models',
      'Learns your codebase conventions, style guides, and patterns over time',
      'Works with GitHub, GitLab, Bitbucket, and Azure DevOps',
      'Configurable review policies per repository, branch, and team',
      'Summarizes PR changes and flags security, correctness, and anti-pattern issues'
    ],
    benefits: [
      'Reduce code review cycle time by up to 50% with instant AI feedback',
      'Catch bugs, security vulnerabilities, and anti-patterns before merge',
      'Free up senior engineers from repetitive review tasks',
      'Adopted across thousands of open-source and enterprise repositories'
    ]
  }
];

export const wave214EdgeComputingServices: Service[] = [
  {
    id: 'cloudflare-workers',
    title: 'Cloudflare Workers Serverless Edge',
    description: 'Cloudflare Workers is a serverless execution platform that deploys code to Cloudflare\'s global network of 300+ data centers in over 100 countries. It enables ultra-low-latency application logic at the edge — closer to end users than any traditional cloud region.',
    category: 'edge-computing',
    icon: '🌐',
    href: '/services/cloudflare-workers',
    industry: 'Cloud Infrastructure & CDN',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (100K requests/day)', pro: '$5/month (10M requests)', enterprise: 'Custom' },
    contactInfo: { website: 'https://workers.cloudflare.com', email: 'sales@cloudflare.com', phone: '+1 415 318 9200' },
    features: [
      'Deploy JavaScript, Rust, C, and C++ to 300+ edge locations globally',
      'Zero cold starts with lightweight V8 isolates (no containers)',
      'Integrated KV storage, Durable Objects, and R2 object storage',
      'Built-in DDoS protection, WAF, and automatic SSL/TLS',
      'Cron Triggers and scheduled event support for background jobs'
    ],
    benefits: [
      'Run compute at sub-millisecond latency from the nearest edge location',
      'Eliminate origin server costs for edge-eligible workloads',
      'Scale automatically to millions of requests with zero provisioning',
      'Powers production workloads at United Airlines, DoorDash, and Discord'
    ]
  }
];

export const wave214DataObservabilityServices: Service[] = [
  {
    id: 'monte-carlo-observability',
    title: 'Monte Carlo Data Observability',
    description: 'Monte Carlo is the category-defining data observability platform. It uses machine learning to automatically detect, resolve, and prevent data incidents — giving data teams end-to-end visibility into data health across modern cloud data stacks.',
    category: 'data-observability',
    icon: '🎰',
    href: '/services/monte-carlo-observability',
    industry: 'Data Engineering & Analytics',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free trial (14 days)', pro: 'Usage-based pricing', enterprise: 'Custom' },
    contactInfo: { website: 'https://montecarlodata.com', email: 'sales@montecarlodata.com', phone: 'N/A' },
    features: [
      'Automated anomaly detection across tables, columns, volume, and freshness',
      'End-to-end field-level data lineage from ingestion to dashboard',
      'Integrates with Snowflake, Databricks, BigQuery, Redshift, and Airflow',
      'Define and enforce data SLAs with automated monitoring and alerting',
      'Incident management with root-cause analysis and stakeholder communication'
    ],
    benefits: [
      'Stop wasting 40% of data-team time on manual firefighting',
      'Detect broken dashboards and stale reports before stakeholders notice',
      'Build organization-wide trust in data product quality',
      'Trusted by Autodesk, Levi Strauss, Vimeo, and Fortune 500 companies'
    ]
  }
];

export const wave214IncidentManagementServices: Service[] = [
  {
    id: 'pagerduty-incident-response',
    title: 'PagerDuty Incident Management & AIOps',
    description: 'PagerDuty is the industry-standard incident management and AIOps platform used by DevOps and SRE teams. It combines AI-powered event orchestration, on-call scheduling, automation, and real-time operations to help teams detect, triage, and resolve incidents faster.',
    category: 'incident-management',
    icon: '🚨',
    href: '/services/pagerduty-incident-response',
    industry: 'IT Operations & SRE',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (5 users)', pro: '$21/user/month', enterprise: '$41/user/month' },
    contactInfo: { website: 'https://pagerduty.com', email: 'sales@pagerduty.com', phone: '+1 855 593 8930' },
    features: [
      'AI-powered event grouping and noise reduction with PagerDuty AIOps',
      'Global on-call scheduling with intelligent escalation policies',
      'Real-time incident timeline with Slack, MS Teams, and built-in comms',
      '900+ integrations including Datadog, AWS CloudWatch, Prometheus, ServiceNow',
      'Analytics, post-incident reviews, and blameless retrospective support'
    ],
    benefits: [
      'Reduce mean time to resolve (MTTR) by up to 86% with automated workflows',
      'Eliminate alert fatigue through AI-powered intelligent grouping',
      'Demonstrate operational excellence with SLO/SLA reporting and audit trails',
      'Used by Salesforce, Shopify, and 19,000+ organizations globally'
    ]
  }
];
