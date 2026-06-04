import { Service } from './serviceTypes';

// Wave 211 — Monitoring, Logging, Security Scanning, Backup Recovery & Identity Management (5 services)
// Research by @tablet_kleber_bot — 2026-06-14
// New categories: monitoring, logging, security-scanning, backup-recovery, identity-management

export const wave211MonitoringServices: Service[] = [
  {
    id: 'prometheus',
    title: 'Prometheus Monitoring & Alerting',
    description: 'Prometheus is an open-source monitoring and alerting toolkit originally built at SoundCloud. It has become the industry standard for monitoring cloud-native applications, providing a powerful dimensional data model, flexible query language, and efficient storage for time series data.',
    category: 'monitoring',
    icon: '📊',
    href: '/services/prometheus',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (10K samples/sec)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Multi-dimensional data model with time series identified by metric name and key/value pairs',
      'PromQL: powerful flexible query language to leverage dimensionality',
      'No reliance on distributed storage; single server nodes are autonomous',
      'Time series collection happens via a pull model over HTTP',
      'Pushing time series is supported via an intermediary gateway',
      'Targets are discovered via service discovery or static configuration'
    ],
    benefits: [
      'Eliminates vendor lock-in with open source and portable data model',
      'Scales horizontally via federation and horizontal sharding',
      'Reliable against failures as individual nodes are autonomous',
      'Used by Kubernetes, Docker, Istio, Linkerd, and many other CNCF projects',
      'Integrates with Grafana for rich dashboards and Alertmanager for notifications'
    ]
  }
];

export const wave211LoggingServices: Service[] = [
  {
    id: 'loki',
    title: 'Grafana Loki Log Aggregation',
    description: 'Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. It is designed to be very cost effective and easy to operate, as it does not index the contents of the logs, but rather a set of labels for each log stream.',
    category: 'logging',
    icon: '📝',
    href: '/services/loki',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (50 GB/day)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Does not index full text of logs, only metadata (labels) — significantly lower operational cost',
      'Labels support dynamic discovery and rich filtering capabilities',
      'Native integration with Grafana for seamless log exploration within dashboards',
      'Supports multiple storage backends: local filesystem, AWS S3, Google GCS, Azure Blob',
      'Multi-tenant architecture with isolated tenant data and query execution',
      'Horizontal scaling and high availability through replication and load balancing'
    ],
    benefits: [
      'Significantly lower cost than traditional log aggregation solutions (ELK, Splunk)',
      'Operational simplicity: no complex indexing infrastructure to manage',
      'Seamless integration with Grafana and Prometheus for full observability stack',
      'Scales to handle massive log volumes from microservices and containerized applications',
      'Used by Grafana Labs, Shopify, Reddit, and other major technology companies'
    ]
  }
];

export const wave211SecurityScanningServices: Service[] = [
  {
    id: 'trivy',
    title: 'Trivy Comprehensive Security Scanner',
    description: 'Trivy is a comprehensive and versatile security scanner that targets vulnerabilities in container images, file systems, and Git repositories, as well as configuration issues. It detects OS packages and language-specific dependencies with CVEs, IaC files and Kubernetes with misconfigurations, and secrets.',
    category: 'security-scanning',
    icon: '🔍',
    href: '/services/trivy',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS)', pro: 'Free tier (unlimited scans)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Detects vulnerabilities in OS packages (Alpine, RHEL, CentOS, etc.) and language-specific bundles (Bundler, Composer, npm, yarn)',
      'Identifies IaC issues in Terraform, CloudFormation, Kubernetes, and Dockerfiles',
      'Scans for sensitive data exposure: API keys, tokens, passwords, and private keys in repositories',
      'Detects container image vulnerabilities and misconfigurations in one unified scanner',
      'Generates reports in multiple formats: JSON, YAML, SARIF, CycloneDX, and plain text',
      'Easy to install and use: single binary with no dependencies, works in CI/CD pipelines'
    ],
    benefits: [
      'Replaces multiple specialized scanners with one unified tool for images, files, repos, and IaC',
      'Fast scanning: typically completes in seconds to minutes depending on target size',
      'Zero false positives in vulnerability detection for supported package managers',
      'Integrates seamlessly with GitHub Actions, GitLab CI, Jenkins, and other CI systems',
      'Used by Red Hat, Google, Microsoft, and thousands of organizations for DevSecOps'
    ]
  }
];

export const wave211BackupRecoveryServices: Service[] = [
  {
    id: 'velero',
    title: 'Velero Kubernetes Backup and Disaster Recovery',
    description: 'Velero is an open source tool to safely backup and restore, perform disaster recovery, and migrate Kubernetes cluster resources and persistent volumes. It provides a simple, configurable and operationally robust way to back up your application state and associated data.',
    category: 'backup-recovery',
    icon: '💾',
    href: '/services/velero',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: false,
    pricing: { basic: 'Free (OSS, Apache 2.0)', pro: 'Free tier (community support)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Backs up Kubernetes objects and persistent volumes to arbitrary cloud storage',
      'Supports snapshot-based volume backups for AWS EBS, GCE PD, Azure Disk, and more',
      'Enables cluster migration and resource movement between different Kubernetes clusters',
      'Provides built-in integration with AWS, Azure, and GCP for cloud-native volume snapshots',
      'Includes built-in helpers for commonly used cloud providers and CSI drivers',
      'Supports backup encryption, compression, and selective resource inclusion/exclusion'
    ],
    benefits: [
      'Eliminates complex custom backup scripts with standardized, reliable backup/restore',
      'Enables migration between Kubernetes clusters, clouds, and on-premise environments',
      'Provides point-in-time recovery for accidental deletions or cluster corruption',
      'Integrates with CSI drivers for application-consistent snapshots of stateful workloads',
      'Used by Red Hat, VMware, Microsoft Azure AKS, and thousands of Kubernetes clusters'
    ]
  }
];

export const wave211IdentityManagementServices: Service[] = [
  {
    id: 'keycloak',
    title: 'Keycloak Identity and Access Management',
    description: 'Keycloak is an open source identity and access management solution for modern applications and services. It adds authentication to applications and secures them with minimum effort, so you dont have to deal with storing users, authenticating users, or managing users.',
    category: 'identity-management',
    icon: '🔑',
    href: '/services/keycloak',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (OSS, Apache 2.0)', pro: 'Free tier (community support)', enterprise: 'Custom' },
    contactInfo: { website: 'https://ziontechgroup.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Single Sign-On (SSO) for web applications and RESTful APIs with support for OpenID Connect, OAuth 2.0, and SAML 2.0',
      'User Federation: pluggable user storage via LDAP and Active Directory, or custom providers',
      'Identity Brokering: authenticate with external Identity Providers like Facebook, Google, or GitHub',
      'Social Login: enable login with Google, GitHub, Facebook, Twitter, and other social networks',
      'Admin Console: manage realms, roles, users, clients, and configure the server',
      'Account Management: allow users to manage their own account via a user-facing interface'
    ],
    benefits: [
      'Eliminates need to build and maintain custom authentication and authorization systems',
      'Provides enterprise-grade security standards: OpenID Connect, OAuth 2.0, SAML 2.0',
      'Scales to handle millions of users with clustered and distributed deployment options',
      'Integrates with existing LDAP/AD infrastructure for seamless user federation',
      'Used by Red Hat, IBM, Thomson Reuters, and thousands of organizations worldwide'
    ]
  }
];