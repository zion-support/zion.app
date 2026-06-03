import { Service } from './servicesData';

// Wave 207 — New Category Expansion (5 services, 5 new categories)
// Research by @tablet_kleber_bot

export const wave207ObservabilityServices: Service[] = [
  {
    id: "grafana-observability",
    title: "Grafana Observability Stack",
    description: "Open-source metrics, logs, and traces visualization through composable dashboards. Combined with Loki (log aggregation) and Tempo (distributed tracing), delivers a full-stack observability suite that rivals Datadog and New Relic at zero licensing cost for self-hosted deployments.",
    category: "observability",
    icon: "📊",
    href: "/services/grafana-observability",
    industry: "Technology, DevOps, SRE, Cloud Infrastructure",
    stage: "published",
    popular: true,
    pricing: { basic: "Free (self-hosted)", pro: "Free tier: 10K metrics, 50GB logs", enterprise: "Cloud Pro from $29/mo" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Composable dashboards with 100+ visualization types (time series, heatmaps, geomaps, gauges)",
      "Unified observability: metrics (Prometheus/Mimir), logs (Loki), and traces (Tempo) in a single interface",
      "Alerting engine with multi-channel notifications (Slack, PagerDuty, email, webhooks)",
      "150+ data source plugins: Prometheus, MySQL, PostgreSQL, Elasticsearch, cloud APIs",
      "Grafana Cloud free tier: 10K active metrics, 50GB logs, 50GB traces, 3 users — no credit card",
      "Self-hostable on any infrastructure; Helm chart for Kubernetes, Docker Compose for simpler setups"
    ],
    benefits: [
      "Replaces expensive SaaS observability tools (Datadog, New Relic) that charge $15–$25+/host/mo — self-hosted Grafana stack is free at any scale",
      "Unified metrics/logs/traces in one UI eliminates context-switching between 3+ tools during incident response"
    ]
  }
];

export const wave207IdentityServices: Service[] = [
  {
    id: "keycloak-iam",
    title: "Keycloak Identity & Access Management",
    description: "Full-featured open-source identity and access management (IAM) solution providing single sign-on (SSO), user federation, identity brokering, and multi-tenancy. Supports OAuth 2.0, OpenID Connect, and SAML 2.0 — a drop-in replacement for Auth0, Okta, and Azure AD B2C without per-MAU pricing.",
    category: "identity",
    icon: "🔐",
    href: "/services/keycloak-iam",
    industry: "Technology, Healthcare, Finance, Government, Enterprise SaaS",
    stage: "published",
    popular: true,
    pricing: { basic: "100% Free (OSS)", pro: "Free at any user count", enterprise: "Red Hat support available" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Single Sign-On (SSO) with OpenID Connect, OAuth 2.0, and SAML 2.0 protocol support",
      "User federation against LDAP, Active Directory, and custom user stores",
      "Identity brokering: log in via Google, GitHub, Facebook, or any OIDC/SAML identity provider",
      "Multi-tenant realm architecture — isolate user pools per client, department, or environment",
      "Admin console with fine-grained role-based access control (RBAC), groups, and custom themes",
      "Social login, two-factor authentication (TOTP/WebAuthn), and brute-force detection built in"
    ],
    benefits: [
      "Eliminates per-MAU identity platform costs (Auth0 starts at $23/mo per 1K users; Keycloak is free at any user count)",
      "Full data sovereignty over user credentials and authentication logs — critical for GDPR, HIPAA, and SOC 2 compliance"
    ]
  }
];

export const wave207CmsServices: Service[] = [
  {
    id: "strapi-headless-cms",
    title: "Strapi Headless CMS",
    description: "Leading open-source headless CMS giving developers full control over content architecture while providing a beautiful admin panel for content editors. Self-hostable, API-first, and framework-agnostic — works with Next.js, Nuxt, Gatsby, React, Vue, mobile apps via REST or GraphQL APIs.",
    category: "cms",
    icon: "📝",
    href: "/services/strapi-headless-cms",
    industry: "Technology, Media, E-commerce, Marketing, Education",
    stage: "published",
    popular: false,
    pricing: { basic: "Free (self-hosted)", pro: "Cloud Pro from $99/mo", enterprise: "Cloud Pro: 50K entries, 10 users" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Intuitive admin panel with drag-and-drop content type builder — no coding required for content modeling",
      "REST and GraphQL APIs auto-generated from content types; SDKs for JavaScript, PHP, and more",
      "Role-based access control (RBAC) with granular permissions per content type and field",
      "Media library with image optimization, folder management, and CDN integration (S3, Cloudinary, etc.)",
      "Plugin ecosystem: SEO, Internationalization (i18n), Email, Upload, and 100+ community plugins",
      "Self-host on any infrastructure; database-agnostic (PostgreSQL, MySQL, SQLite, MariaDB)"
    ],
    benefits: [
      "Eliminates SaaS CMS costs that scale with API calls and users (Contentful free tier: only 25K API calls/mo; Strapi is unlimited when self-hosted)",
      "Headless architecture future-proofs content — same backend serves web, mobile, IoT, and any future channel without migration"
    ]
  }
];

export const wave207EcommerceServices: Service[] = [
  {
    id: "medusa-commerce",
    title: "Medusa Composable Commerce",
    description: "Open-source composable commerce platform built for developers who want full control over their e-commerce stack. Headless, modular, and developer-first — built on Node.js with a modern API architecture. Provides the core commerce engine (products, orders, carts, payments, shipping) while letting developers compose exactly the features they need.",
    category: "ecommerce",
    icon: "🛒",
    href: "/services/medusa-commerce",
    industry: "E-commerce, Retail, D2C Brands, Marketplace Operators",
    stage: "published",
    popular: false,
    pricing: { basic: "Free (self-hosted)", pro: "Cloud Pro from $99/mo", enterprise: "Cloud Pro: unlimited orders, 10 admin users" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Headless commerce engine with REST and GraphQL storefront APIs — works with any frontend (Next.js, Remix, mobile)",
      "Modular architecture: pick only the modules you need (products, inventory, orders, payments, notifications, search)",
      "Multi-region and multi-currency support built in — sell globally without plugins",
      "Admin dashboard for order management, customer service, and product catalog",
      "Plugin ecosystem: Stripe, PayPal, Algolia search, Meilisearch, SendGrid, Slack notifications",
      "Self-host on any infrastructure; database-agnostic (PostgreSQL via TypeORM)"
    ],
    benefits: [
      "Zero transaction fees (Shopify charges 2% + payment processing; Medusa has no platform cut on self-hosted)",
      "Composable architecture means you only pay for what you use — no bloated monolith with features you'll never touch"
    ]
  }
];

export const wave207DocumentationServices: Service[] = [
  {
    id: "outline-knowledge-base",
    title: "Outline Knowledge Base",
    description: "Beautiful, open-source knowledge base and documentation platform designed for teams that want a self-hosted alternative to Notion or Confluence. Features a real-time collaborative editor, hierarchical document organization, full-text search, and a clean Slack-like interface that makes documentation enjoyable to write and maintain.",
    category: "documentation",
    icon: "📚",
    href: "/services/outline-knowledge-base",
    industry: "Technology, Engineering Teams, Startups, Remote Teams, Enterprise",
    stage: "published",
    popular: false,
    pricing: { basic: "Free (self-hosted)", pro: "Cloud Team from $10/user/mo", enterprise: "Cloud Team: unlimited documents, 10GB storage" },
    contactInfo: { website: "https://ziontechgroup.com", email: "commercial@ziontechgroup.com", phone: "+1 302 464 0950" },
    features: [
      "Real-time collaborative rich-text editor with Markdown support, code blocks, and embeds",
      "Hierarchical document tree with drag-and-drop organization — structure knowledge like a filesystem",
      "Full-text search across all documents with instant results and highlighted matches",
      "Slack integration: share documents in channels, get notifications on edits, search docs from Slack",
      "SSO authentication via OIDC, SAML, and GitHub — enterprise identity management ready",
      "Self-hosted with Docker; PostgreSQL backend; S3-compatible storage for attachments and images"
    ],
    benefits: [
      "Replaces Confluence ($5.75+/user/mo) and Notion ($8+/user/mo) with a self-hosted option that's free at any team size",
      "Real-time collaboration and beautiful UX drive documentation adoption — teams actually write docs instead of letting them rot"
    ]
  }
];
