import { Service } from './serviceTypes';

// Wave 209 — Data Streaming, Search, DevOps & API Gateway (5 services)
// Research by @tablet_kleber_bot — 2026-06-03

export const wave209DataStreamingServices: Service[] = [
  {
    id: 'data-streaming-kafka-platform',
    title: 'Apache Kafka Data Streaming Platform',
    description: 'Enterprise-grade real-time data streaming platform built on Apache Kafka. Handles millions of events per second with exactly-once processing guarantees, schema registry, and managed connectors for seamless data pipeline orchestration.',
    category: 'data',
    icon: '📡',
    href: '/services/data-streaming-kafka-platform',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: '$499/mo', pro: '$1,299/mo', enterprise: '$3,499/mo' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Managed Kafka clusters with auto-scaling',
      'Exactly-once processing semantics',
      'Schema Registry with Avro/Protobuf/JSON support',
      'Kafka Connect with 100+ pre-built connectors',
      'Real-time stream processing with Kafka Streams',
      'Multi-region replication and disaster recovery'
    ],
    benefits: [
      'Process millions of events per second with sub-second latency',
      'Eliminate data loss with exactly-once delivery guarantees',
      'Reduce integration complexity with managed connectors',
      'Scale seamlessly from prototype to production workloads'
    ]
  }
];

export const wave209SearchServices: Service[] = [
  {
    id: 'search-meilisearch-engine',
    title: 'Meilisearch Instant Search Engine',
    description: 'Lightning-fast, typo-tolerant search engine for modern applications. Delivers relevant results in under 50ms with built-in faceting, filtering, geosearch, and AI-powered relevance tuning. Drop-in replacement for Elasticsearch at 1/10th the cost.',
    category: 'ai',
    icon: '🔍',
    href: '/services/search-meilisearch-engine',
    industry: 'Technology & SaaS',
    stage: 'published',
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: '$799/mo' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Typo-tolerant search with intelligent ranking',
      'Faceted navigation and filtering',
      'Geosearch with radius and polygon filters',
      'AI-powered relevance tuning and synonyms',
      'Multi-tenant search indexes',
      'Real-time indexing with zero downtime'
    ],
    benefits: [
      'Deliver search results in under 50ms',
      'Reduce infrastructure costs vs Elasticsearch by 90%',
      'Improve conversion rates with better search relevance',
      'Deploy in minutes with managed cloud hosting'
    ]
  }
];

export const wave209DevOpsServices: Service[] = [
  {
    id: 'devops-plane-project-management',
    title: 'Plane DevOps Project Management',
    description: 'Open-source alternative to Jira and Linear built for modern engineering teams. Combines issue tracking, sprint planning, cycle analytics, and release management in a blazing-fast interface with AI-powered workload balancing.',
    category: 'devops',
    icon: '✈️',
    href: '/services/devops-plane-project-management',
    industry: 'Technology & SaaS',
    stage: 'published',
    pricing: { basic: '$0 (open source)', pro: '$49/mo', enterprise: '$149/mo' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Issue tracking with custom workflows and states',
      'Sprint planning with capacity forecasting',
      'Cycle time analytics and velocity tracking',
      'Release management with changelog generation',
      'AI-powered workload balancing across teams',
      'GitHub/GitLab/Bitbucket bidirectional sync'
    ],
    benefits: [
      'Replace Jira with a faster, developer-friendly tool',
      'Gain real-time visibility into team velocity and bottlenecks',
      'Automate release notes and changelog generation',
      'Self-host for full data control or use managed cloud'
    ]
  }
];

export const wave209TestingServices: Service[] = [
  {
    id: 'testing-playwright-automation',
    title: 'Playwright Test Automation Suite',
    description: 'End-to-end browser testing framework for modern web applications. Supports Chromium, Firefox, and WebKit with auto-wait, network interception, visual regression testing, and parallel execution across multiple browsers and devices.',
    category: 'automation',
    icon: '🎭',
    href: '/services/testing-playwright-automation',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: '$149/mo', pro: '$399/mo', enterprise: '$999/mo' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Cross-browser testing (Chromium, Firefox, WebKit)',
      'Auto-wait and retry mechanisms for flaky tests',
      'Network interception and API mocking',
      'Visual regression testing with pixel-perfect diffs',
      'Parallel execution across browsers and devices',
      'CI/CD integration with GitHub Actions, GitLab CI'
    ],
    benefits: [
      'Catch bugs before users do with reliable E2E tests',
      'Reduce test flakiness with smart auto-wait',
      'Run tests 10x faster with parallel execution',
      'Integrate seamlessly into existing CI/CD pipelines'
    ]
  }
];

export const wave209ApiServices: Service[] = [
  {
    id: 'api-gateway-kong-enterprise',
    title: 'Kong Gateway API Management',
    description: 'Enterprise API gateway for managing, securing, and scaling microservices. Features rate limiting, authentication, request/response transformation, plugin ecosystem, and real-time analytics. Handles billions of API calls with sub-millisecond latency.',
    category: 'it',
    icon: '🦍',
    href: '/services/api-gateway-kong-enterprise',
    industry: 'Technology & SaaS',
    stage: 'published',
    pricing: { basic: '$299/mo', pro: '$799/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'API routing and load balancing across services',
      'Rate limiting and quota management',
      'OAuth2, JWT, API key, and mTLS authentication',
      'Request/response transformation and validation',
      'Plugin ecosystem with 50+ pre-built extensions',
      'Real-time analytics and observability dashboard'
    ],
    benefits: [
      'Secure APIs with enterprise-grade authentication',
      'Scale to billions of requests with sub-ms latency',
      'Reduce API management overhead by 80%',
      'Gain full visibility into API usage and performance'
    ]
  }
];
