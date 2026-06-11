import { Service } from './serviceTypes';

// Wave 251 — AI Video Generation, Blockchain Identity, Smart Building IoT,
// AI Financial Planning, and Robotic Process Automation
// Research by @tablet_kleber_bot — 2026-06-19

export const wave251AiVideoGenerationServices: Service[] = [
  {
    id: 'runway-ml-ai-video-generation',
    title: 'Runway ML — AI Video Generation Platform',
    description: 'Runway ML is the leading AI video generation and editing platform that enables creators, filmmakers, and marketers to produce professional-quality video content using generative AI. Its Gen-3 Alpha model produces cinematic-quality video from text prompts, images, and reference videos. Used by 3 million+ creators and major studios including Marvel, BBC, and Samsung.',
    category: 'ai-video-generation',
    icon: '🎬',
    href: '/services/runway-ml-ai-video-generation',
    industry: 'Creative AI & Video Production',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (125 credits, 5GB assets, 720p)', pro: '$15/month (625 credits, 100GB, 4K)', enterprise: 'Custom (unlimited credits, team seats, API access)' },
    contactInfo: { website: 'https://runwayml.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Gen-3 Alpha text-to-video: generate cinematic video from text prompts',
      'Image-to-video: animate still images with natural motion and camera movement',
      '30+ AI Magic Tools: object removal, motion tracking, green screen, style transfer',
      'Real-time video editing: AI-powered editing tools with instant preview',
      'Team collaboration: shared projects, version history, and review workflows',
      'API access: integrate generative models into custom applications'
    ],
    benefits: [
      'Produce professional video content 10x faster without expensive equipment',
      'Trusted by 3 million+ creators and major studios including Marvel, BBC, and Samsung',
      'Reduce video production costs by 90% compared to traditional filming',
      'Iterate instantly: generate multiple video variations in minutes',
      'Democratize video creation: anyone can produce cinematic content without expertise'
    ]
  }
];

export const wave251BlockchainIdentityServices: Service[] = [
  {
    id: 'polygon-id-blockchain-identity',
    title: 'Polygon ID — Blockchain-Based Digital Identity',
    description: 'Polygon ID is a blockchain-based digital identity platform that enables self-sovereign identity (SSI) — giving individuals and organizations full control over their identity data without relying on centralized authorities. Built on Polygon\'s Layer 2 blockchain, Polygon ID uses zero-knowledge proofs (ZKPs) to verify identity claims without revealing underlying data.',
    category: 'blockchain-identity',
    icon: '🪪',
    href: '/services/polygon-id-blockchain-identity',
    industry: 'Blockchain & Digital Identity',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open source, self-hosted)', pro: '$0.01/verification (managed service, 10K verifications/month)', enterprise: 'Custom (private chain, custom schemas, dedicated support)' },
    contactInfo: { website: 'https://polygon.technology/polygon-id', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Self-sovereign identity: users own and control their identity data',
      'Zero-knowledge proofs: verify claims without revealing underlying data',
      'W3C Verifiable Credentials: interoperable with global identity standards',
      'Decentralized Identifiers (DIDs): blockchain-anchored identifiers',
      'Privacy-preserving KYC: comply with regulations without storing sensitive data',
      'Selective disclosure: users share only the specific attributes required'
    ],
    benefits: [
      'Eliminate centralized identity databases that are prime targets for data breaches',
      'Reduce KYC costs by 80% with reusable, privacy-preserving verifiable credentials',
      'Comply with GDPR, CCPA, and global privacy regulations by design',
      'Enable seamless cross-platform identity: one credential works across services',
      'Empower users with true data ownership'
    ]
  }
];

export const wave251SmartBuildingIotServices: Service[] = [
  {
    id: 'building-os-smart-building-iot',
    title: 'BuildingOS — Smart Building IoT Management Platform',
    description: 'BuildingOS is a comprehensive smart building IoT management platform that integrates HVAC, lighting, security, occupancy sensors, and energy systems into a single intelligent dashboard. Using AI-driven analytics, BuildingOS optimizes energy consumption by 25-40%, predicts equipment failures, and automatically adjusts building conditions based on occupancy patterns and weather forecasts.',
    category: 'smart-building-iot',
    icon: '🏢',
    href: '/services/building-os-smart-building-iot',
    industry: 'Smart Buildings & IoT',
    stage: 'published',
    popular: true,
    pricing: { basic: '$2/building/month (basic monitoring, email alerts)', pro: '$8/building/month (AI optimization, predictive maintenance)', enterprise: 'Custom (digital twin, API access, dedicated support)' },
    contactInfo: { website: 'https://buildingos.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Unified building dashboard: monitor HVAC, lighting, security, and energy from one interface',
      'AI energy optimization: automatically adjust systems based on occupancy, weather, and utility rates',
      'Predictive maintenance: ML models detect equipment anomalies 2-4 weeks before failure',
      'Digital twin: virtual building replica for simulation and what-if analysis',
      'Multi-protocol integration: connects to BACnet, Modbus, MQTT, LoRaWAN, and 100+ systems',
      'Sustainability reporting: automated ESG and carbon footprint reporting'
    ],
    benefits: [
      'Reduce energy costs by 25-40% with AI-driven optimization',
      'Prevent equipment failures with predictive maintenance',
      'Manage 10,000+ buildings from a single platform',
      'Achieve sustainability goals with automated carbon tracking',
      'Improve occupant comfort through intelligent climate control'
    ]
  }
];

export const wave251AiFinancialPlanningServices: Service[] = [
  {
    id: 'uplift-ai-financial-planning',
    title: 'Uplift AI — AI-Powered Financial Planning & Analysis',
    description: 'Uplift AI is an AI-powered financial planning and analysis (FP&A) platform that automates budgeting, forecasting, and financial reporting for mid-market and enterprise finance teams. Using machine learning, Uplift AI analyzes historical financial data, identifies trends, and generates accurate forecasts that update in real time.',
    category: 'ai-financial-planning',
    icon: '📈',
    href: '/services/uplift-ai-financial-planning',
    industry: 'Financial Technology & FP&A',
    stage: 'published',
    popular: true,
    pricing: { basic: '$500/month (10 users, 3 data sources, basic forecasting)', pro: '$2,000/month (50 users, unlimited data sources, AI forecasting)', enterprise: 'Custom (unlimited users, dedicated AI training, SLA)' },
    contactInfo: { website: 'https://uplift.ai', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI-powered forecasting: ML models generate accurate financial forecasts in real time',
      'Scenario planning: model best-case, worst-case, and custom scenarios',
      'Automated reporting: generate board-ready financial reports without manual work',
      'ERP integration: connect to SAP, Oracle, NetSuite, QuickBooks, and Xero',
      'Variance analysis: automatically identify budget vs. actual variances',
      'Collaborative planning: multi-user workflows with approval chains and version control'
    ],
    benefits: [
      'Reduce financial planning cycle from weeks to hours',
      'Improve forecast accuracy by 40% compared to spreadsheets',
      'Eliminate manual data consolidation from multiple systems',
      'Enable real-time decision making with continuously updated projections',
      'Trusted by 500+ finance teams for mission-critical planning'
    ]
  }
];

export const wave251RoboticProcessAutomationServices: Service[] = [
  {
    id: 'automation-anywhere-rpa-platform',
    title: 'Automation Anywhere — Enterprise RPA & AI Automation Platform',
    description: 'Automation Anywhere is the world\'s leading robotic process automation (RPA) platform that combines traditional bot-based automation with generative AI to automate complex business processes end-to-end. Used by 4,000+ enterprises including Deloitte, Siemens, and Unilever.',
    category: 'robotic-process-automation',
    icon: '🤖',
    href: '/services/automation-anywhere-rpa-platform',
    industry: 'Enterprise Automation & RPA',
    stage: 'published',
    popular: true,
    pricing: { basic: '$750/month (basic bot, 1 user)', pro: '$2,500/month (unlimited bots, AI skills, 10 users)', enterprise: 'Custom (unlimited bots, dedicated AI training, on-prem option)' },
    contactInfo: { website: 'https://automationanywhere.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI-powered bots: combine RPA with generative AI for unstructured data and complex decisions',
      'No-code automation builder: citizen developers create bots with drag-and-drop designer',
      'Bot Store: 1,200+ pre-built automation templates for common business processes',
      'Enterprise governance: role-based access, audit trails, and compliance controls',
      'Process discovery: AI analyzes user actions to identify automation opportunities',
      'Cloud-native platform: deploy bots on cloud, on-prem, or hybrid with elastic scaling'
    ],
    benefits: [
      'Automate 80% of repetitive business processes with AI-powered bots',
      'Trusted by 4,000+ enterprises including Deloitte, Siemens, and Unilever',
      'Reduce process costs by 50-70% while improving accuracy and compliance',
      'Enable citizen developers: business users build automations without coding',
      'Scale from 1 bot to 1,000+ bots with enterprise-grade governance'
    ]
  }
];
