import { Service } from './serviceTypes';

// Wave 247 — AI Translation, Digital Humans, Predictive Maintenance,
// Uptime Monitoring, and AI Code Generation
// Research by @tablet_kleber_bot — 2026-06-19
// New categories: ai-translation-services, digital-humans-platform,
// predictive-maintenance-ai, uptime-monitoring-service, ai-code-generation

export const wave247AiTranslationServices: Service[] = [
  {
    id: 'deepl-ai-translation',
    title: 'DeepL — AI-Powered Translation for Business',
    description: 'DeepL is the world\'s most accurate AI translation service, powered by proprietary neural machine translation models that consistently outperform Google Translate, Microsoft Translator, and Amazon Translate in blind human evaluations. Serving 1 billion+ translations per month for 100,000+ business customers including Siemens, Sony, and the European Commission, DeepL supports 31 languages with nuanced understanding of context, tone, and industry terminology. Its enterprise platform includes DeepL API (real-time translation integration), DeepL Pro (unlimited text translation with data security), and DeepL Write (AI writing enhancement for grammar, tone, and clarity).',
    category: 'ai-translation-services',
    icon: '🌍',
    href: '/services/deepl-ai-translation',
    industry: 'AI & Language Technology',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (500K characters/month, 5 document translations)', pro: '$8.74/user/month (unlimited text, 100GB document translation)', enterprise: 'Custom (API access, SSO, dedicated infrastructure, SLA)' },
    contactInfo: { website: 'https://deepl.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '31 languages with context-aware translation that preserves tone and nuance',
      'Document translation: translate PDF, Word, PowerPoint while preserving formatting',
      'API integration: real-time translation in apps, websites, and workflows via REST API',
      'Data security: ISO 27001 certified, GDPR compliant, text deleted after translation',
      'Glossary and style guides: enforce brand terminology and preferred translations',
      'DeepL Write: AI writing enhancement for grammar, clarity, and professional tone'
    ],
    benefits: [
      '3x more accurate than Google Translate in independent human evaluations',
      'Translate entire documents while preserving layout, formatting, and images',
      'Enterprise-grade security — text is deleted after translation, never stored or shared',
      'Integrate real-time translation into any application with a simple REST API',
      'Trusted by 100,000+ businesses including Siemens, Sony, and the European Commission'
    ]
  }
];

export const wave247DigitalHumansServices: Service[] = [
  {
    id: 'synthesia-digital-humans-platform',
    description: 'Synthesia is the leading AI video generation platform that creates photorealistic digital human presenters from text. Users type a script, select from 240+ AI avatars (diverse in ethnicity, age, and language), and Synthesia generates a professional video with natural lip-sync, gestures, and voice in 140+ languages. Used by 50,000+ companies including Google, Nike, and the BBC for training, marketing, and internal communications, Synthesia reduces video production costs by 90% and time from weeks to minutes. Its enterprise platform includes custom avatar creation (digital twins of real people), API access, and analytics on viewer engagement.',
    category: 'digital-humans-platform',
    icon: '🧑‍💻',
    href: '/services/synthesia-digital-humans-platform',
    industry: 'AI Video & Synthetic Media',
    stage: 'published',
    popular: true,
    pricing: { basic: '$22/month (10 minutes of video, 70+ avatars)', pro: '$67/month (30 minutes, 140+ avatars, custom branding)', enterprise: 'Custom (unlimited video, custom avatars, API, SSO, dedicated support)' },
    contactInfo: { website: 'https://synthesia.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '240+ diverse AI avatars: choose presenters by ethnicity, age, clothing, and language',
      '140+ languages with natural lip-sync and regional accent accuracy',
      'Custom avatar creation: build a digital twin of a real spokesperson or executive',
      'Video API: generate videos programmatically from your application or workflow',
      'Brand kit integration: logos, colors, fonts, and backgrounds automatically applied',
      'Analytics dashboard: track viewer engagement, completion rates, and click-throughs'
    ],
    benefits: [
      'Reduce video production costs by 90% — no cameras, studios, or actors needed',
      'Create professional videos in minutes instead of weeks',
      'Localize content into 140+ languages without re-recording or dubbing',
      'Trusted by 50,000+ companies including Google, Nike, BBC, and Reuters',
      'Custom avatars let executives and subject matter experts scale their presence'
    ]
  }
];

export const wave247PredictiveMaintenanceServices: Service[] = [
  {
    id: 'upkeep-predictive-maintenance-ai',
    description: 'Upkeep (formerly Asset Reliability Platform) is the leading AI-powered predictive maintenance platform that uses machine learning to predict equipment failures before they happen. By analyzing sensor data, maintenance logs, and operational patterns, Upkeep identifies anomalies and predicts remaining useful life for critical assets, reducing unplanned downtime by 50% and maintenance costs by 30%. Used by 3,000+ facilities including PepsiCo, Mars, and the US military, Upkeep integrates with existing IoT sensors, SCADA systems, and ERP platforms. Its mobile-first CMMS (Computerized Maintenance Management System) enables technicians to receive AI-generated work orders, access equipment history, and log maintenance activities from the field.',
    category: 'predictive-maintenance-ai',
    icon: '🔧',
    href: '/services/upkeep-predictive-maintenance-ai',
    industry: 'Industrial IoT & Manufacturing',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (up to 5 users, basic CMMS)', pro: '$35/user/month (predictive analytics, IoT integrations)', enterprise: 'Custom (unlimited users, API, dedicated support, custom ML models)' },
    contactInfo: { website: 'https://onupkeep.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'AI failure prediction: ML models analyze sensor data to predict equipment breakdowns',
      'Anomaly detection: identify deviations from normal operating patterns in real-time',
      'Mobile CMMS: technicians receive AI work orders, scan assets, and log repairs from the field',
      'IoT integration: connect to existing sensors, SCADA, PLCs, and ERP systems',
      'Root cause analysis: AI identifies recurring failure patterns and recommends corrective actions',
      'Maintenance scheduling: optimize preventive maintenance schedules based on actual asset health'
    ],
    benefits: [
      'Reduce unplanned downtime by 50% with AI-powered failure prediction',
      'Cut maintenance costs by 30% — fix equipment before it breaks, not on a fixed schedule',
      'Extend asset lifespan by optimizing maintenance timing and procedures',
      'Trusted by 3,000+ facilities including PepsiCo, Mars, and the US military',
      'Mobile-first design: technicians adopt it because it makes their jobs easier'
    ]
  }
];

export const wave247UptimeMonitoringServices: Service[] = [
  {
    id: 'betterstack-uptime-monitoring',
    title: 'Better Uptime (by Better Stack) — Modern Uptime Monitoring and Status Pages',
    description: 'Better Uptime is a modern uptime monitoring platform that combines website/API monitoring, incident management, and public status pages in a single, beautifully designed platform. It monitors endpoints from 20+ global locations with checks as frequent as every 10 seconds, detecting downtime in under 30 seconds. When incidents occur, it automatically creates incident timelines, notifies on-call teams via phone, SMS, Slack, and email, and updates public status pages in real-time. Used by 100,000+ companies including Vercel, Linear, and Retool, Better Uptime is known for its developer-friendly API, generous free tier, and incident management workflows that rival dedicated incident platforms.',
    category: 'uptime-monitoring-service',
    icon: '📡',
    href: '/services/betterstack-uptime-monitoring',
    industry: 'DevOps & Site Reliability',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (10 monitors, 1-minute checks, 1 status page)', pro: '$24/month (unlimited monitors, 10-second checks, call notifications)', enterprise: 'Custom (SSO, audit logs, dedicated support, custom SLA)' },
    contactInfo: { website: 'https://betterstack.com/better-uptime', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Global monitoring: check endpoints from 20+ locations every 10 seconds',
      'Multi-protocol support: HTTP/HTTPS, TCP, ping, DNS, SSL certificate monitoring',
      'Automatic incident creation: downtime triggers incident timeline and team notifications',
      'Public status pages: auto-updated, customizable pages with subscriber notifications',
      'On-call scheduling: rotations, escalation policies, and fatigue management',
      'Incident communication: auto-post status updates to Slack, Teams, and status pages'
    ],
    benefits: [
      'Detect downtime in under 30 seconds with 10-second check intervals',
      'Combine monitoring, incident management, and status pages in one platform',
      'Developer-friendly API and Terraform provider for infrastructure-as-code setup',
      'Trusted by 100,000+ companies including Vercel, Linear, and Retool',
      'Generous free tier: 10 monitors with 1-minute checks, no credit card required'
    ]
  }
];

export const wave247AiCodeGenerationServices: Service[] = [
  {
    id: 'cursor-ai-code-editor',
    title: 'Cursor — AI-First Code Editor for Professional Developers',
    description: 'Cursor is the AI-first code editor built on top of VS Code that integrates large language models directly into the coding workflow. Unlike autocomplete tools, Cursor understands entire codebases, enabling developers to make large-scale changes with natural language prompts, generate functions from docstrings, debug errors with AI context, and navigate unfamiliar code with AI-powered explanations. With 1 million+ developers and $9.9 billion valuation, Cursor has become the fastest-growing developer tool in history. Its features include Cmd+K (inline editing), Cmd+L (AI chat with codebase context), Composer (multi-file AI agent), and automatic import management.',
    category: 'ai-code-generation',
    icon: '💻',
    href: '/services/cursor-ai-code-editor',
    industry: 'Developer Tools & AI',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (limited AI requests, public repos)', pro: '$20/month (unlimited AI requests, private repos, GPT-4/Claude)', enterprise: 'Custom (team management, SSO, audit logs, self-hosted models)' },
    contactInfo: { website: 'https://cursor.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Cmd+K inline editing: select code and describe changes in natural language',
      'Cmd+L AI chat: ask questions about your codebase with full repository context',
      'Composer agent: make coordinated multi-file changes from a single prompt',
      'Auto-import and refactoring: AI manages imports, renames, and structural changes',
      'VS Code compatible: all extensions, keybindings, and settings work unchanged',
      'Codebase indexing: AI understands relationships across your entire project'
    ],
    benefits: [
      'Write code 2-5x faster with AI that understands your entire codebase',
      'Make large-scale refactors with natural language — no more find-and-replace',
      'Onboard to unfamiliar code instantly with AI-powered explanations',
      '1 million+ developers and $9.9B valuation — the fastest-growing dev tool ever',
      'Drop-in VS Code replacement: all your extensions and settings work immediately'
    ]
  }
];
