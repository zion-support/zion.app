import { Service } from './serviceTypes';

// Wave 250 — AI-Powered DevOps, Cloud Cost Optimization, Data Mesh Platforms,
// AI Customer Support, and Edge AI Platforms
// Research by @tablet_kleber_bot — 2026-06-19

export const wave250AiDevopsPlatformServices: Service[] = [
  {
    id: 'harness-ai-devops-platform',
    title: 'Harness — AI-Powered DevOps Platform',
    description: 'Harness is the industry\'s first AI-powered software delivery platform that automates the entire CI/CD pipeline with machine learning-driven optimization. Founded by Jyoti Bansal (also founder of AppDynamics), Harness uses AI to detect deployment failures before they impact users, automatically roll back bad releases, and optimize cloud spend in real time. The platform serves 600+ enterprise customers including Salesforce, McAfee, and NCR, processing millions of deployments per month.',
    category: 'ai-devops-platform',
    icon: '🚀',
    href: '/services/harness-ai-devops-platform',
    industry: 'DevOps & Software Delivery',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (CI module, 20 builds/month, 1 user)', pro: '$100/user/month (full platform, CD, Feature Flags)', enterprise: 'Custom (SSO, audit logs, dedicated support, SLA)' },
    contactInfo: { website: 'https://harness.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI-powered continuous delivery: ML models predict deployment failures before they reach production',
      'Automated rollback: detect failed deployments in seconds and auto-revert without human intervention',
      'Cloud cost management: AI identifies waste and recommends rightsizing across AWS, Azure, and GCP',
      'Feature flags: decouple deployment from release with progressive delivery and canary analysis',
      'Chaos engineering: automated resilience testing that simulates failures in production safely',
      'Developer-first GitOps: declarative pipelines with visual workflow builder and 100+ integrations'
    ],
    benefits: [
      'Reduce deployment failures by 95% with AI-powered pre-flight checks and automated rollback',
      'Cut cloud costs by 70% with ML-driven waste detection and rightsizing recommendations',
      'Ship 10x faster with automated pipelines that eliminate manual approval bottlenecks',
      'Trusted by 600+ enterprises including Salesforce, McAfee, and NCR for mission-critical delivery',
      'Consolidate 8+ DevOps tools into one AI-powered platform, reducing tool sprawl and cost'
    ]
  }
];

export const wave250CloudCostOptimizationServices: Service[] = [
  {
    id: 'spot-io-netapp-cloud-cost',
    title: 'Spot by NetApp — Cloud Cost Optimization Platform',
    description: 'Spot by NetApp is the leading cloud cost optimization platform that uses predictive analytics and automation to continuously reduce cloud infrastructure costs while maintaining performance and reliability. Processing $2B+ in cloud spend across 2,000+ customers including Samsung, Adobe, and Ticketmaster, Spot\'s AI engine analyzes workload patterns and automatically provisions the most cost-effective compute.',
    category: 'cloud-cost-optimization',
    icon: '💰',
    href: '/services/spot-io-netapp-cloud-cost',
    industry: 'Cloud Infrastructure & FinOps',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (Spot Eco, AWS only, basic recommendations)', pro: '0.5% of managed cloud spend (full platform, multi-cloud)', enterprise: 'Custom (dedicated FinOps team, custom policies, SLA)' },
    contactInfo: { website: 'https://spot.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Predictive AI: analyzes workload patterns and predicts optimal compute purchasing strategy',
      'Spot instance automation: safely run production workloads on spot instances with zero downtime',
      'Continuous rightsizing: automatically match instance types to actual resource utilization',
      'Multi-cloud coverage: optimize AWS, Azure, and GCP spend from a single dashboard',
      'Kubernetes optimization: automatically scale node pools and bin-pack containers',
      'FinOps reporting: executive dashboards showing savings, trends, and cost allocation'
    ],
    benefits: [
      'Reduce cloud compute costs by 60-90% through intelligent spot instance automation',
      'Zero engineering effort: AI continuously optimizes without manual intervention',
      'Trusted by 2,000+ customers including Samsung, Adobe, and Ticketmaster managing $2B+ in cloud spend',
      'Maintain 99.99% availability while using spot instances through predictive interruption handling',
      'Accelerate FinOps maturity with automated cost allocation, showback, and budget alerting'
    ]
  }
];

export const wave250DataMeshPlatformServices: Service[] = [
  {
    id: 'starburst-data-mesh-platform',
    title: 'Starburst — Data Mesh & Lakehouse Platform',
    description: 'Starburst is the leading data mesh and lakehouse platform that enables organizations to access and analyze data wherever it lives without moving or copying data. Built on the open-source Trino query engine, Starburst provides a single SQL interface to 50+ data sources with enterprise governance and security. Used by 300+ companies including Comcast, Finra, and Samsung.',
    category: 'data-mesh-platform',
    icon: '🕸️',
    href: '/services/starburst-data-mesh-platform',
    industry: 'Data Engineering & Analytics',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (Trino open source, self-managed)', pro: '$100/node/month (Starburst Galaxy, managed, 50+ connectors)', enterprise: 'Custom (Starburst Enterprise, on-prem, SSO, audit)' },
    contactInfo: { website: 'https://starburst.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Universal SQL: query data across 50+ sources with one SQL interface',
      'Data mesh enablement: domain teams publish data products with self-service access and federated governance',
      'Enterprise security: column-level access control, row-level security, and audit logging',
      'Performance optimization: adaptive query planning, caching, and materialized views',
      'Open standards: built on Trino (Apache 2.0), avoiding vendor lock-in',
      'Lakehouse unification: query Delta Lake, Apache Iceberg, and Apache Hudi tables'
    ],
    benefits: [
      'Eliminate data silos: query all data from one place without expensive ETL pipelines',
      'Enable data mesh architecture: domain teams own data products while central governance ensures compliance',
      'Reduce analytics latency from hours to seconds with federated query optimization',
      'Trusted by 300+ companies including Comcast, Finra, and Samsung',
      'Avoid vendor lock-in with open-source Trino foundation and 50+ connector ecosystem'
    ]
  }
];

export const wave250AiCustomerSupportServices: Service[] = [
  {
    id: 'intercom-ai-customer-support',
    title: 'Intercom — AI-Powered Customer Support Platform',
    description: 'Intercom is the leading AI-powered customer support platform that combines messaging, help desk, and proactive engagement into one unified solution. Its AI agent, Fin, resolves 50% of customer conversations autonomously. Used by 25,000+ companies including Amazon, Atlassian, and Lyft, Intercom processes millions of conversations monthly across live chat, email, WhatsApp, and in-app messaging.',
    category: 'ai-customer-support',
    icon: '💬',
    href: '/services/intercom-ai-customer-support',
    industry: 'Customer Support & Experience',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (Starter, 100 people, basic chatbot)', pro: '$74/seat/month (Advanced, Fin AI agent, automation)', enterprise: 'Custom (dedicated success manager, custom AI training, SLA)' },
    contactInfo: { website: 'https://intercom.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Fin AI agent: resolves 50% of customer conversations autonomously with contextual understanding',
      'Omnichannel inbox: unify live chat, email, WhatsApp, and in-app messages in one workspace',
      'AI-powered suggested replies: agents get context-aware response suggestions in real time',
      'Intelligent routing: automatically route conversations to the best agent based on skill and load',
      'Multilingual support: AI understands and responds in 43 languages with automatic translation',
      'Proactive messaging: trigger personalized messages based on user behavior and lifecycle stage'
    ],
    benefits: [
      'Resolve 50% of support conversations instantly with Fin AI, reducing agent workload dramatically',
      'Unify all customer communication channels in one platform instead of juggling 5+ separate tools',
      'Improve CSAT by 20% with faster response times and AI-accurate answers',
      'Trusted by 25,000+ companies including Amazon, Atlassian, and Lyft',
      'Scale support without adding headcount through AI automation and self-service resolution'
    ]
  }
];

export const wave250EdgeAiPlatformServices: Service[] = [
  {
    id: 'nvidia-jetson-edge-ai',
    title: 'NVIDIA Jetson — Edge AI Computing Platform',
    description: 'NVIDIA Jetson is the world\'s leading edge AI computing platform, delivering GPU-accelerated AI inference to embedded devices, robots, drones, and IoT endpoints. The Jetson family enables real-time AI inference at the edge without cloud connectivity, reducing latency from hundreds of milliseconds to single-digit milliseconds. With 1 million+ developers and 1,000+ companies building on Jetson.',
    category: 'edge-ai-platform',
    icon: '📡',
    href: '/services/nvidia-jetson-edge-ai',
    industry: 'Edge Computing & AI Hardware',
    stage: 'published',
    popular: true,
    pricing: { basic: '$99 (Jetson Nano, 5W, 0.5 TFLOPS, hobbyist/education)', pro: '$599 (Jetson Orin NX, 20W, 100 TOPS, production edge AI)', enterprise: 'Custom (Jetson AGX Orin, 60W, 275 TOPS, industrial)' },
    contactInfo: { website: 'https://nvidia.com/en-us/autonomous-machines/embedded-systems/', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'GPU-accelerated edge inference: run complex AI models on-device with 275 TOPS of compute in 60W',
      'JetPack SDK: complete Linux environment with CUDA-X, TensorRT, and pre-trained AI models',
      'Real-time computer vision: object detection, segmentation, and pose estimation at 30-240 FPS',
      'Robotics ready: native ROS 2 support, Isaac Sim simulation, and pre-trained navigation models',
      'Multi-sensor fusion: process camera, LiDAR, radar, and IMU data simultaneously',
      'Scalable architecture: same code runs from Jetson Nano to Jetson AGX Orin'
    ],
    benefits: [
      'Reduce AI inference latency from 200ms (cloud) to under 10ms (edge) for real-time applications',
      'Operate without cloud connectivity — critical for remote, mobile, and air-gapped environments',
      'Trusted by 1,000+ companies and 1 million+ developers for production edge AI deployments',
      'Scale from prototype to production with the same software stack across the entire Jetson family',
      'Power autonomous machines in manufacturing, agriculture, healthcare, and smart cities'
    ]
  }
];
