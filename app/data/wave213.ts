import { Service } from './serviceTypes';

// Wave 213 — AI Code Generation, Digital Human Avatars, Uptime Monitoring,
// AI Translation, and Predictive Maintenance IoT
// Research by @tablet_kleber_bot — 2026-06-21
// New categories: code-generation, digital-humans, uptime-monitoring,
// ai-translation, predictive-maintenance

export const wave213CodeGenerationServices: Service[] = [
  {
    id: 'github-copilot-ai-code-generation',
    title: 'GitHub Copilot — AI-Powered Code Generation',
    description: 'GitHub Copilot is an AI pair programmer that uses large language models trained on billions of lines of code to suggest entire lines or functions inside your editor. Integrated with VS Code, JetBrains, Neovim, and Visual Studio, Copilot understands context from comments, variable names, and surrounding code to generate contextually relevant code in 40+ programming languages. Over 1.8 million paid subscribers and 73,000 enterprise customers use Copilot to accelerate development by up to 55%.',
    category: 'code-generation',
    icon: '🤖',
    href: '/services/github-copilot-ai-code-generation',
    industry: 'Developer Tools & AI',
    stage: 'published',
    popular: true,
    pricing: { basic: '$10/month (Individual)', pro: '$19/month (Business)', enterprise: '$39/user/month (Enterprise)' },
    contactInfo: { website: 'https://github.com/features/copilot', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Context-aware code suggestions in 40+ programming languages and frameworks',
      'Natural language to code: describe what you want in comments, get working code',
      'IDE integration: VS Code, JetBrains, Neovim, Visual Studio, and Xcode',
      'Copilot Chat: conversational AI assistant for debugging, explaining, and refactoring code',
      'Enterprise features: organization-wide policy controls, audit logs, and SOC 2 compliance',
      'Code security: filters suggestions to reduce exposure to vulnerable or copyrighted code'
    ],
    benefits: [
      'Developers complete coding tasks 55% faster on average',
      'Reduce boilerplate writing by 80% — focus on architecture and logic',
      'New team members onboard faster with AI-guided code exploration',
      'Catch bugs earlier with AI-suggested test cases and edge case handling',
      'Used by 73,000+ enterprises including Fortune 500 companies'
    ]
  }
];

export const wave213DigitalHumansServices: Service[] = [
  {
    id: 'synthesia-ai-digital-human-avatars',
    title: 'Synthesia — AI Digital Human Avatar Video Platform',
    description: 'Synthesia is the leading AI video generation platform that creates professional videos featuring photorealistic digital human avatars. Users type text and Synthesia generates a video of a human presenter speaking in 140+ languages with natural gestures and lip sync. With 500,000+ enterprise customers including Google, Nike, and the BBC, Synthesia eliminates the need for cameras, studios, and actors — reducing video production costs by 90% and time from weeks to minutes.',
    category: 'digital-humans',
    icon: '🧑‍💻',
    href: '/services/synthesia-ai-digital-human-avatars',
    industry: 'Media, Marketing & Corporate Training',
    stage: 'published',
    popular: true,
    pricing: { basic: '$22/month (Starter, 10 min video)', pro: '$67/month (Creator, 30 min video)', enterprise: 'Custom (unlimited video + custom avatars)' },
    contactInfo: { website: 'https://synthesia.io', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '140+ AI avatars: diverse, photorealistic digital human presenters',
      '140+ languages and accents with natural lip sync and intonation',
      'Custom avatar creation: clone your own face and voice for branded content',
      'Template library: 500+ video templates for training, sales, and marketing',
      'API and integrations: embed video generation into LMS, CRM, and content platforms',
      'Accessibility: auto-generated captions, translations, and audio descriptions'
    ],
    benefits: [
      'Reduce video production costs by 90% — no cameras, studios, or actors needed',
      'Create training videos in 15 minutes instead of 2-3 weeks',
      'Localize content into 140+ languages without re-recording',
      'Update videos instantly when content changes — no reshoots required',
      'Used by 500,000+ companies including Google, Nike, and the BBC'
    ]
  }
];

export const wave213UptimeMonitoringServices: Service[] = [
  {
    id: 'uptimerobot-website-uptime-monitoring',
    title: 'UptimeRobot — Website & Service Uptime Monitoring',
    description: 'UptimeRobot is a widely-used uptime monitoring service that checks websites, APIs, ports, and cron jobs every 5 minutes to detect downtime instantly. With over 2 million users, it sends real-time alerts via email, SMS, Slack, Telegram, and 20+ integrations when services go down. UptimeRobot also provides public status pages, SSL certificate monitoring, and heartbeat monitoring for cron jobs and scheduled tasks.',
    category: 'uptime-monitoring',
    icon: '⏱️',
    href: '/services/uptimerobot-website-uptime-monitoring',
    industry: 'Technology & SaaS',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (50 monitors, 5-min intervals)', pro: '$7/month (Pro, 1-min intervals)', enterprise: '$54/month (Pro, 30-sec intervals + SMS)' },
    contactInfo: { website: 'https://uptimerobot.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '5-minute interval checks on 50+ monitors (HTTP, ping, port, keyword, heartbeat)',
      'Real-time alerts via email, SMS, Slack, Telegram, webhook, and 20+ integrations',
      'Public status pages: share uptime status with customers via custom domain',
      'SSL certificate monitoring: alerts before certificates expire',
      'Cron job and heartbeat monitoring: detect missed scheduled task executions',
      'Root cause analysis: traceroute and response time breakdown for incident diagnosis'
    ],
    benefits: [
      'Detect downtime within 5 minutes — minimize revenue and reputation impact',
      'Free tier covers most small-to-medium business monitoring needs',
      'Public status pages build customer trust with transparent uptime reporting',
      'Prevent SSL expiry outages that cause browser security warnings',
      'Used by 2 million+ developers, startups, and enterprises worldwide'
    ]
  }
];

export const wave213AiTranslationServices: Service[] = [
  {
    id: 'deepl-ai-translation-services',
    title: 'DeepL — AI-Powered Translation for Business',
    description: 'DeepL is the world\'s most accurate AI translation service, using proprietary neural networks trained on Linguee\'s billion-pair translation database. DeepL Pro offers unlimited text translation, document translation (PDF, Word, PowerPoint), API access, and CAT tool integrations for professional translators. With 10 million+ Pro subscribers and 500,000+ enterprise users, DeepL supports 31 languages with nuance and context accuracy that consistently outperforms Google Translate and Microsoft Translator in blind evaluations.',
    category: 'ai-translation',
    icon: '🌍',
    href: '/services/deepl-ai-translation-services',
    industry: 'Language Technology & Localization',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (500K chars/month)', pro: '$10.49/month (Pro, unlimited)', enterprise: 'Custom (API + team management + data security)' },
    contactInfo: { website: 'https://deepl.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '31 languages with industry-leading translation accuracy in blind evaluations',
      'Document translation: preserves formatting in PDF, DOCX, PPTX, and XLSX files',
      'API access: integrate DeepL translation into apps, websites, and workflows',
      'CAT tool integration: plugins for SDL Trados, memoQ, and other translation tools',
      'Data security: Pro and Enterprise plans guarantee data is deleted after translation',
      'Glossary feature: enforce consistent terminology across all translations'
    ],
    benefits: [
      '3x more accurate than competing translation engines in professional blind tests',
      'Translate entire documents while preserving layout and formatting',
      'Enterprise data security: GDPR compliant with zero data retention guarantee',
      'Reduce localization costs by 50% with AI-first translation workflows',
      'Used by 500,000+ businesses including Siemens, Sony, and the European Commission'
    ]
  }
];

export const wave213PredictiveMaintenanceServices: Service[] = [
  {
    id: 'augury-predictive-maintenance-iot',
    title: 'Augury — AI-Predictive Maintenance for Industrial Machines',
    description: 'Augury is an AI-powered predictive maintenance platform that uses vibration, temperature, ultrasonic, and magnetic sensors combined with machine learning to detect faults in industrial equipment before they cause unplanned downtime. Augury\'s algorithms analyze machine health in real time, identifying bearing wear, misalignment, imbalance, and lubrication issues weeks or months before failure. Deployed across 100+ countries, Augury has analyzed over 100 million machine health readings and helped manufacturers including Colgate, Hershey\'s, and GSK avoid millions in unplanned downtime costs.',
    category: 'predictive-maintenance',
    icon: '🔧',
    href: '/services/augury-predictive-maintenance-iot',
    industry: 'Manufacturing & Industrial IoT',
    stage: 'published',
    popular: false,
    pricing: { basic: 'Custom (pilot program)', pro: '$50K/year (single facility)', enterprise: 'Custom ($200K+/year multi-site deployment)' },
    contactInfo: { website: 'https://augury.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Wireless sensors: vibration, temperature, ultrasonic, and magnetic field monitoring',
      'AI fault detection: identifies 30+ fault types including bearing wear, misalignment, and imbalance',
      'Machine health scoring: real-time 0-100 health score for every monitored asset',
      'Maintenance recommendations: prioritized work orders with specific repair instructions',
      'Integration with CMMS: auto-generates work orders in SAP, Maximo, and Fiix',
      'Cloud dashboard: fleet-wide machine health visibility across multiple facilities'
    ],
    benefits: [
      'Reduce unplanned downtime by 50% through early fault detection',
      'Extend machine life by 25% with condition-based maintenance scheduling',
      'Reduce maintenance costs by 30% — fix only what needs fixing, when it needs it',
      'Improve safety: detect hazardous equipment conditions before they cause injuries',
      'ROI achieved within 6 months through avoided downtime and reduced spare parts waste'
    ]
  }
];
