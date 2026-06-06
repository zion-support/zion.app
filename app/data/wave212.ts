import { Service } from './serviceTypes';

export const wave212PerformanceTestingServices: Service[] = [
  {
    id: 'k6',
    title: 'k6 Load Testing',
    description: "k6 is a modern load testing tool, building on Load Impact's legacy to become the open source developers love. It helps you test the performance of your APIs, microservices, and websites.",
    category: 'performance-testing',
    icon: '🏃',
    href: '/services/k6',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (50K VUs)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Developer-centric with Go and JavaScript scripting API',
      'Cloud and local execution options',
      'Integrates with CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)',
      'Supports HTTP/1.1, HTTP/2, WebSocket, and more protocols',
      'Provides detailed metrics and trend analysis'
    ],
    benefits: [
      'Catch performance regressions before they reach production',
      'Scale tests from a few virtual users to thousands',
      'Run tests in CI/CD for every pull request',
      'Used by Grafana Labs, Shopify, and Microsoft for performance validation'
    ]
  }
];

export const wave212ChaosEngineeringServices: Service[] = [
  {
    id: 'chaos-mesh',
    title: 'Chaos Mesh Cloud-native Chaos Engineering',
    description: 'Chaos Mesh is a cloud-native Chaos Engineering platform that orchestrates chaos on Kubernetes environments. It helps you improve the resilience of your systems by injecting faults.',
    category: 'chaos-engineering',
    icon: '🌪️',
    href: '/services/chaos-mesh',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (community support)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Kubernetes-native, installed via Helm or Operators',
      'Supports pod, network, filesystem, and time chaos experiments',
      'Provides a web dashboard for experiment management',
      'Integrates with Prometheus for monitoring experiment impact',
      'Supports scheduling and auto-rollback of experiments'
    ],
    benefits: [
      'Proactively identify system weaknesses before they cause outages',
      'Run experiments in production with safety controls',
      'Improve system resilience and mean time to recovery (MTTR)',
      'Used by Alibaba Cloud, ByteDance, and Schneider Electric'
    ]
  }
];

export const wave212ServiceMeshServices: Service[] = [
  {
    id: 'linkerd',
    title: 'Linkerd Service Mesh',
    description: 'Linkerd is a lightweight, ultra-secure service mesh for Kubernetes. It provides observability, reliability, and security without requiring application changes.',
    category: 'service-mesh',
    icon: '🔗',
    href: '/services/linkerd',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (community support)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Zero-trust security with automatic mTLS between services',
      'Fine-grained traffic control (retries, timeouts, circuit breaking)',
      'Deep observability with request-level metrics and distributed tracing',
      'Lightweight data plane (written in Rust) for minimal latency',
      'Simple installation and upgrades via Helm or CLI'
    ],
    benefits: [
      'Secure service-to-service communication without application changes',
      'Improve reliability with automatic retries and timeouts',
      'Gain visibility into service dependencies and performance',
      'Used by PayPal, Expedia, and Homeland Security for zero-trust networking'
    ]
  }
];

export const wave212APIGatewayServices: Service[] = [
  {
    id: 'kong',
    title: 'Kong API Gateway',
    description: 'Kong is a cloud-native API gateway that delivers high performance and extensibility for managing, securing, and orchestrating APIs and microservices.',
    category: 'api-gateway',
    icon: '🚪',
    href: '/services/kong',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (1M requests/month)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'High-performance plugin architecture (authentication, rate limiting, logging)',
      'Supports multiple protocols: HTTP/1.1, HTTP/2, WebSocket, TCP, TLS',
      'Provides declarative configuration via Kong Ingress Controller',
      'Integrates with major identity providers (OAuth2, OpenID Connect, LDAP)',
      'Offers detailed analytics and monitoring through Kong Manager'
    ],
    benefits: [
      'Centralize API management, security, and traffic control',
      'Scale to handle thousands of requests per second with low latency',
      'Extend functionality with custom plugins in Lua, Go, or Python',
      'Used by NASA, Yahoo, and The New York Times for API management'
    ]
  }
];

export const wave212EventStreamingServices: Service[] = [
  {
    id: 'pulsar',
    title: 'Apache Pulsar Event Streaming',
    description: 'Apache Pulsar is a cloud-native, distributed messaging and streaming platform built for geo-replication, multi-tenancy, and high performance.',
    category: 'event-streaming',
    icon: '⚡',
    href: '/services/pulsar',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (community support)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-tenancy and geo-replication built-in',
      'Separation of compute and storage for independent scaling',
      'Schema Registry for data validation and evolution',
      'Functions and IO connectors for lightweight stream processing',
      'Native Kubernetes operator for easy deployment and management'
    ],
    benefits: [
      'Eliminate data silos with seamless cross-region and cross-cloud streaming',
      'Reduce operational overhead with serverless streaming architecture',
      'Ensure data quality and compatibility with schema evolution',
      'Used by Splunk, Tencent, and Yahoo! for mission-critical event streaming'
    ]
  }
];