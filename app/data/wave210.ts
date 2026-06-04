import { Service } from './serviceTypes';

// Wave 210 — Database, Collaboration, Media Streaming, IaC & Low-Code (5 services)
// Research by @tablet_kleber_bot — 2026-06-13
// New categories: database, collaboration, media-streaming, infrastructure-as-code, low-code

export const wave210DatabaseServices: Service[] = [
  {
    id: 'postgresql',
    title: 'PostgreSQL Database Solutions',
    description: "PostgreSQL is the world's most advanced open-source relational database, trusted by millions of developers and enterprises for mission-critical applications. With over 35 years of active development, PostgreSQL offers unparalleled standards compliance, ACID transactions, complex queries, JSON support, full-text search, and extensibility through custom types, functions, and extensions like PostGIS (geospatial), TimescaleDB (time-series), and pgvector (AI vector search).",
    category: 'database',
    icon: '🐘',
    href: '/services/postgresql',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: '$5/mo (managed)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Full ACID compliance with MVCC for reliable concurrent access',
      'Advanced SQL: CTEs, window functions, lateral joins, recursive queries, JSON/JSONB with indexing',
      '1,000+ extensions: PostGIS (geospatial), TimescaleDB (time-series), pgvector (AI vector search)',
      'Built-in full-text search with ranking, stemming, and 30+ language dictionaries',
      'Streaming replication, point-in-time recovery (PITR), logical replication',
      'Kubernetes operators (CrunchyData, Zalando, CloudNativePG) for containerized deployments'
    ],
    benefits: [
      'Eliminates expensive commercial database licensing (Oracle $47,500+/core, SQL Server $15,000+/core)',
      'pgvector extension turns PostgreSQL into a vector database for AI/ML, replacing Pinecone ($70+/mo)',
      'Free at any scale with zero per-core or per-seat fees',
      'Most-loved database in Stack Overflow developer surveys, powers Apple, Spotify, Instagram'
    ]
  }
];

export const wave210CollaborationServices: Service[] = [
  {
    id: 'nextcloud',
    title: 'Nextcloud Self-Hosted Collaboration Platform',
    description: 'Nextcloud is the most widely deployed open-source self-hosted collaboration platform, providing a complete alternative to Google Workspace, Microsoft 365, and Dropbox. It combines file sync & share, collaborative document editing (Collabora/OnlyOffice), video conferencing (Talk), email, calendar, contacts, Kanban boards (Deck), and 300+ community apps — all under your own infrastructure.',
    category: 'collaboration',
    icon: '📂',
    href: '/services/nextcloud',
    industry: 'Government',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (self-hosted)', pro: '$36/user/mo (Enterprise)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'File sync & share with end-to-end encryption, granular permissions, version control, ransomware detection',
      'Integrated online office suite (Collabora Online / OnlyOffice) for real-time collaborative editing',
      'Nextcloud Talk: self-hosted video/voice conferencing with screen sharing, breakout rooms, SIP bridge',
      'Calendar, contacts, mail, Kanban boards (Deck), forms, polls, whiteboards — full productivity suite',
      '300+ community apps: Knowledge Base, Bookmarks, Passwords, Maps, ML-based file classification',
      'Self-hosted on any Linux server; Docker and Kubernetes-ready; scales to 500K+ users'
    ],
    benefits: [
      'Replaces Google Workspace ($12-18/user/mo) and Microsoft 365 ($6-36/user/mo) — 100-person team saves $14,400-$43,200+/yr',
      'Full data sovereignty: all data stays on your infrastructure, zero third-party cloud access',
      'GDPR, HIPAA, SOC2 compliant with audit logging, admin policies, and data locality enforcement',
      'Trusted by 400,000+ organizations including universities and government agencies across Europe'
    ]
  }
];

export const wave210MediaStreamingServices: Service[] = [
  {
    id: 'jellyfin',
    title: 'Jellyfin Open-Source Media Streaming',
    description: 'Jellyfin is a fully open-source media system that lets you collect, manage, and stream your own media library — a free alternative to Plex, Emby, and Netflix-style self-hosting. Unlike Plex (which requires Plex Pass for hardware transcoding and mobile sync) or Emby (paid model), Jellyfin provides every feature completely free with no premium tier.',
    category: 'media-streaming',
    icon: '🎬',
    href: '/services/jellyfin',
    industry: 'Media & Entertainment',
    stage: 'published',
    popular: false,
    pricing: { basic: '100% Free', pro: 'No paid tiers', enterprise: 'No paid tiers' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Universal media streaming with automatic format transcoding (H.264/H.265/VP9/AV1) for any device',
      'Rich metadata fetching from TMDB, TVDb, OMDb, MusicBrainz — automatic posters, fanart, cast info, reviews',
      'Multi-user support with per-user parental controls, content rating restrictions, watched status',
      'Live TV & DVR with HDHomeRun and M3U tuner support — record and schedule live TV',
      'Plugin ecosystem: Intro Skipper, OPDS catalog, Fanart plugin, Merge Collections, LDAP/SSO auth',
      'Clients on 15+ platforms: Web, Android, iOS, Roku, Fire TV, Apple TV, Samsung/LG smart TVs, PlayStation, Xbox'
    ],
    benefits: [
      '100% free with zero feature restrictions — Plex Pass costs $119.99 lifetime for features Jellyfin includes free',
      'No account or internet connection required — your media library stays entirely on your hardware',
      'No telemetry, no phone-home — completely offline-capable once installed'
    ]
  }
];

export const wave210InfrastructureAsCodeServices: Service[] = [
  {
    id: 'terraform',
    title: 'Terraform Infrastructure-as-Code',
    description: "Terraform is the industry-standard infrastructure-as-code (IaC) tool used by millions of engineers to declaratively provision and manage cloud infrastructure across AWS, Azure, GCP, and 3,000+ other providers. Instead of clicking through cloud consoles, you define infrastructure in HCL and Terraform figures out the exact API calls needed. With plan-apply workflow, you get a preview of every change before it happens.",
    category: 'infrastructure-as-code',
    icon: '🏗️',
    href: '/services/terraform',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS, MPL 2.0)', pro: 'Free tier (500 resources)', enterprise: '$0.00014/hr/resource' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-cloud provisioning across 3,000+ providers (AWS, Azure, GCP, Cloudflare, Datadog, Kubernetes)',
      'Plan-apply workflow with detailed diff — see exactly what will change before making any changes',
      'State management with remote backends (S3, GCS, Terraform Cloud) for team collaboration and drift detection',
      'Module registry with 25K+ community modules for battle-tested infrastructure patterns',
      'Policy-as-code with Open Policy Agent (OPA) and Sentinel for compliance guardrails',
      'CDK for Terraform (CDKTF) — define infrastructure in Python, TypeScript, Java, C#, or Go'
    ],
    benefits: [
      'Eliminates manual cloud console configuration that causes 43% of cloud outages (Gartner)',
      'Every change is version-controlled, reviewed, and auditable',
      'Multi-cloud portability: same skills and modules work across AWS, Azure, GCP — eliminates vendor lock-in',
      'Powers infrastructure at Airbnb, Starbucks, Slack, and thousands of organizations'
    ]
  }
];

export const wave210LowCodeServices: Service[] = [
  {
    id: 'appwrite',
    title: 'Appwrite Self-Hosted Backend-as-a-Service',
    description: 'Appwrite is a self-hosted open-source Backend-as-a-Service (BaaS) platform that provides everything mobile and web developers need — databases, authentication, storage, functions, real-time subscriptions, messaging — as a drop-in replacement for Firebase. Unlike Firebase (Google-owned, vendor lock-in, unpredictable pricing), Appwrite can be self-hosted on any infrastructure with full data control.',
    category: 'low-code',
    icon: '⚡',
    href: '/services/appwrite',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: false,
    pricing: { basic: 'Free (self-hosted)', pro: '$15/mo (Cloud Pro)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'All-in-one backend: Document database, OAuth2/OpenID auth (60+ providers), file storage, cloud functions',
      'Built-in avatars, localization, team management, usage metrics, and health monitoring',
      'Multi-platform SDKs: Flutter, Swift, Kotlin, JavaScript, React, Vue, Angular, Node, Python, PHP, Ruby, Dart',
      'Self-hosted with Docker Compose in under 3 minutes; Kubernetes-ready with Redis-backed caching',
      'Functions marketplace with community templates; scheduled cron functions; async execution with retry logic',
      'Open APIs compatible with OpenAPI 3.1; GraphQL support; Firebase migration compatibility layers'
    ],
    benefits: [
      "Eliminates Firebase's unpredictable pricing ($25+/GB bandwidth, $25+/M document reads) — saves $500-$5,000+/mo",
      'Zero vendor lock-in: all data and infrastructure remain on your servers',
      'Satisfies GDPR/HIPAA requirements that prevent Firebase adoption in healthcare and European government',
      'Trusted by 100,000+ developers with apps from indie projects to enterprise applications'
    ]
  }
];
