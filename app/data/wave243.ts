import { Service } from './serviceTypes';

// Wave 243 — Vector Database, API Documentation, Customer Data Platform,
// Edge Computing, and Test Automation
// Research by @tablet_kleber_bot — 2026-06-07
// New categories: vector-database, api-documentation, customer-data-platform,
// edge-computing-cloud, test-automation-framework

export const wave243VectorDatabaseServices: Service[] = [
  {
    id: 'pinecone-vector-database',
    title: 'Pinecone — Managed Vector Database for AI Applications',
    description: 'Pinecone is the leading purpose-built vector database that provides long-term memory for AI applications at scale. It enables organizations to store, search, and retrieve high-dimensional embeddings with millisecond latency, powering semantic search, RAG (retrieval-augmented generation), recommendation engines, and AI chatbots. Pinecone handles infrastructure, scaling, and indexing automatically so teams can focus on building AI features. With 5,000+ customers including Notion, Gong, and HubSpot, Pinecone stores billions of vectors and serves over 1 billion queries per month with 99.99% uptime.',
    category: 'vector-database',
    icon: '🗃️',
    href: '/services/pinecone-vector-database',
    industry: 'AI Infrastructure & Data',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (100K vectors, 2 indexes)', pro: '$70/month (unlimited indexes, Enterprise features)', enterprise: 'Custom (VPC, dedicated infrastructure, SOC 2)' },
    contactInfo: { website: 'https://pinecone.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Similarity search: find the most relevant vectors in milliseconds across billions of embeddings',
      'Metadata filtering: combine vector similarity with structured filters for precise retrieval',
      'Hybrid search: merge sparse (keyword) and dense (semantic) vectors for best-of-both retrieval',
      'Namespace isolation: partition data by tenant, user, or use case within a single index',
      'Zero-downtime scaling: resize indexes without downtime or data migration',
      'Serverless and pod-based tiers: choose elastic scaling or predictable dedicated capacity'
    ],
    benefits: [
      'Add AI memory to any LLM application — RAG, chatbots, and semantic search in hours',
      'Eliminate infrastructure management: Pinecone handles indexing, replication, and scaling',
      'Search billions of embeddings with single-digit millisecond latency globally',
      'Hybrid search delivers 15-30% better retrieval accuracy than pure semantic search',
      'Trusted by 5,000+ companies including Notion, Gong, HubSpot, and Salesforce'
    ]
  }
];

export const wave243ApiDocumentationServices: Service[] = [
  {
    id: 'readme-api-documentation-platform',
    title: 'ReadMe — Developer-First API Documentation Platform',
    description: 'ReadMe is the leading interactive API documentation platform that transforms OpenAPI/Swagger specs into beautiful, interactive developer portals. Used by 500,000+ companies including Stripe, Twilio, and Plaid, ReadMe provides auto-generated docs, try-it-now API explorers, changelogs, and developer analytics. Its platform includes AI-powered search, personalized onboarding flows, and Usage Insights that show which endpoints generate the most errors, traffic, and revenue. ReadMe reduces support tickets by 40% and improves developer onboarding time from days to minutes.',
    category: 'api-documentation',
    icon: '📖',
    href: '/services/readme-api-documentation-platform',
    industry: 'Developer Experience & API',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (public docs for open-source)', pro: '$99/month (private docs + custom domain)', enterprise: 'Custom (SSO + audit logs + dedicated CSM)' },
    contactInfo: { website: 'https://readme.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Interactive API explorer: developers test endpoints directly in the browser with live responses',
      'Swagger/OpenAPI import: auto-generate docs from OpenAPI 2.0/3.0/3.1 specs in minutes',
      'Developer analytics: track API usage, error rates, developer adoption, and time-to-first-call',
      'Versioning and changelogs: automatic version diffs and human-readable changelog generation',
      'AI-powered search: natural language queries that find the right endpoint or guide',
      'Custom branding: white-label portals with custom CSS, domain, and brand elements'
    ],
    benefits: [
      'Reduce developer support tickets by 40% with self-serve interactive documentation',
      'Improve time-to-first-API-call from days to minutes with guided onboarding',
      'Understand developer behavior: which endpoints drive adoption vs. cause errors',
      'Keep docs and code in sync automatically from OpenAPI specification',
      'Used by 500,000+ companies including Stripe, Twilio, and Plaid'
    ]
  }
];

export const wave243CustomerDataPlatformServices: Service[] = [
  {
    id: 'segment-customer-data-platform',
    title: 'Twilio Segment — Customer Data Platform (CDP)',
    description: 'Twilio Segment is the world\'s leading Customer Data Platform that collects, cleans, and activates customer data across every touchpoint. Segment provides a single API to track customer events from websites, mobile apps, servers, and cloud sources, then routes that data in real-time to 450+ destinations including Google Analytics, Salesforce, Mixpanel, and Snowflake. Used by 25,000+ companies including Instacart, Levi\'s, and FOX, Segment processes over 100 billion API calls per month. Its Identity Resolution engine stitches anonymous and known user data into unified customer profiles for personalized experiences.',
    category: 'customer-data-platform',
    icon: '👥',
    href: '/services/segment-customer-data-platform',
    industry: 'Marketing Technology & Data',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (1,000 tracked users, 2 sources)', pro: '$120/month (unlimited sources, 50K users)', enterprise: 'Custom (unlimited users + Audience Builder + warehouse)' },
    contactInfo: { website: 'https://segment.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Single tracking API: collect customer events from web, mobile, server, and cloud with one library',
      '450+ integrations: route data in real-time to analytics, CRM, advertising, and data warehouse tools',
      'Identity Resolution: stitch anonymous sessions with known profiles for unified customer view',
      'Audiences and Traits: build behavioral segments that sync to every connected destination',
      'Protocol and Tracking Plans: enforce data quality with schema validation and governance rules',
      'Reverse ETL: sync warehouse data (Snowflake, BigQuery) to Salesforce, HubSpot, and ad platforms'
    ],
    benefits: [
      'Replace 10+ vendor SDKs with one tracking implementation — reduce engineering maintenance by 80%',
      'Unify customer data across every touchpoint for a 360-degree customer view',
      'Sync warehouse data to operational tools — activate data warehouse investments instantly',
      'Ensure data quality with enforced tracking plans that prevent bad data at the source',
      'Trusted by 25,000+ companies including Instacart, Levi\'s, FOX, and 1-800-Flowers'
    ]
  }
];

export const wave243EdgeComputingCloudServices: Service[] = [
  {
    id: 'cloudflare-workers-edge-computing',
    title: 'Cloudflare Workers — Serverless Edge Computing Platform',
    description: 'Cloudflare Workers is a serverless execution environment that runs code on Cloudflare\'s global network spanning 310+ cities in 100+ countries. Developers deploy JavaScript, TypeScript, Rust, and Python code that runs within milliseconds of users worldwide, eliminating cold starts with Cloudflare\'s isolates architecture. Used by 80% of Fortune 1000 companies, Workers powers edge APIs, A/B testing, bot management, and CDN customization. The platform handles over 57 million requests per second at peak capacity and integrates with KV (key-value storage), Durable Objects (coordinated state), D1 (SQLite database), and R2 (object storage).',
    category: 'edge-computing-cloud',
    icon: '🌐',
    href: '/services/cloudflare-workers-edge-computing',
    industry: 'Cloud Infrastructure & CDN',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (100K requests/day)', pro: '$5/month (10M requests/month)', enterprise: 'Custom (unlimited requests + dedicated support + SLA)' },
    contactInfo: { website: 'https://workers.cloudflare.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Global deployment: code runs in 310+ cities within milliseconds of every internet user',
      'Zero cold starts: V8 isolates spin up in under 1ms — no cold start penalty vs. AWS Lambda',
      'Edge storage: KV (caching), Durable Objects (coordinated state), D1 (SQLite at edge), R2 (S3-compatible)',
      'TypeScript/WASM support: write in JavaScript, TypeScript, Rust, C++, or Python (Beta)',
      'Integrated security: WAF, DDoS protection, bot management, and Zero Trust networking included',
      'Cron Triggers and Queues: schedule recurring background tasks and reliable message processing'
    ],
    benefits: [
      'Sub-millisecond cold starts — 10-100x faster than AWS Lambda or Azure Functions cold starts',
      'Deploy globally in 30 seconds — no regional configuration or capacity planning needed',
      'Pay-per-request pricing: fractional cents per request with a generous free tier',
      'Unified edge platform: compute, storage, databases, and CDN in one platform',
      'Handles 57M+ requests/sec at peak — scales automatically without configuration'
    ]
  }
];

export const wave243TestAutomationFrameworkServices: Service[] = [
  {
    id: 'playwright-test-automation',
    title: 'Playwright — Microsoft\'s End-to-End Test Automation Framework',
    description: 'Playwright is an open-source end-to-end test automation framework created by Microsoft that enables reliable testing across all modern browsers (Chromium, Firefox, WebKit). Built by the original creators of Puppeteer, Playwright delivers auto-wait, retry-agnostic assertions, and multi-tab/multi-browser testing with a single API. With 65,000+ GitHub stars, 4 million weekly npm downloads, and adoption by Adobe, React, and Visual Studio Code, Playwright has become the industry standard for browser testing. Its built-in test runner, Codegen (record-and-playback), and Trace Viewer (time-travel debugging) solve the flaky test problem that plagues E2E testing.',
    category: 'test-automation-framework',
    icon: '🧪',
    href: '/services/playwright-test-automation',
    industry: 'Developer Tools & QA',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, MIT license)', pro: 'Free (Playwright Test Runner included)', enterprise: 'Custom (Playwright Cloud + Grid + enterprise support)' },
    contactInfo: { website: 'https://playwright.dev', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Cross-browser: test on Chromium, Firefox, and WebKit with a single unified API',
      'Auto-wait and retry: built-in assertions that wait for elements — eliminates flaky tests',
      'Codegen: record browser interactions and generate test code in JavaScript, Python, Java, C#',
      'Trace Viewer: time-travel debugger showing DOM snapshots, network, console, and action logs',
      'Parallel execution: sharded test runs across workers and browsers with built-in test runner',
      'Visual regression: pixel-by-pixel screenshot comparison with automated baseline management'
    ],
    benefits: [
      'Eliminate flaky tests with auto-wait and retry-agnostic assertions built into the framework',
      'Test on all browsers with one API — no per-browser test code or configuration',
      'Record tests visually with Codegen, then customize generated code as needed',
      '65,000+ GitHub stars and 4M weekly downloads — the fastest-growing E2E testing framework',
      'Backed by Microsoft with deep integration into VS Code and Azure DevOps CI/CD'
    ]
  }
];
