import { Service } from './serviceTypes';

// Wave 218 — Regenerative Agriculture AI, Autonomous Construction, Emotion AI,
// Satellite Internet, AI Legal Assistants, Nuclear Fusion Energy, and Holographic Displays
// Research by @OWL — 2026-06-19
// New categories: regenerative-agriculture-ai, autonomous-construction, emotion-ai,
// satellite-internet, ai-legal-assistants, nuclear-fusion-energy, holographic-displays

export const wave218RegenerativeAgricultureAiServices: Service[] = [
  {
    id: 'indigo-ag-carbon-farming-platform',
    title: 'Indigo Ag — AI-Powered Carbon Farming Platform',
    description: 'Indigo Ag uses satellite imagery, soil sampling AI, and machine learning to help farmers transition to regenerative agriculture practices that sequester carbon in soil. Their platform measures, reports, and verifies (MRV) carbon removal at field level, enabling farmers to sell verified carbon credits to corporations. Over 10 million acres enrolled, with farmers earning $15-40/acre in carbon credit revenue.',
    category: 'regenerative-agriculture-ai',
    icon: '🌾',
    href: '/services/indigo-ag-carbon-farming-platform',
    industry: 'Agriculture & Climate Tech',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (farm enrollment)', pro: 'Revenue share on carbon credits (15%)', enterprise: 'Corporate carbon portfolio ($1M+/year)' },
    contactInfo: { website: 'https://indigoag.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Satellite-based field monitoring: NDVI, soil carbon, moisture, and crop health',
      'AI-powered MRV (Measure, Report, Verify) for carbon credit certification',
      'Practice recommendation engine: cover crops, no-till, crop rotation optimization',
      'Carbon credit marketplace connecting farmers to Fortune 500 buyers',
      'Integration with John Deere, Climate FieldView, and other farm management platforms',
      'Third-party verified carbon credits (Verra, Gold Standard certified)'
    ],
    benefits: [
      'Farmers earn $15-40/acre annually from carbon credit sales',
      'Soil health improvement: 20% yield increase within 3-5 years',
      'Water retention improved by 30% with regenerative practices',
      'Corporations meet Scope 3 emissions targets with verified agricultural offsets',
      '10 million+ acres enrolled — largest agricultural carbon program globally'
    ]
  }
];

export const wave218AutonomousConstructionServices: Service[] = [
  {
    id: 'built-robotics-autonomous-excavators',
    title: 'Built Robotics — Autonomous Heavy Construction Equipment',
    description: 'Built Robotics retrofits existing excavators, bulldozers, and skid steers with AI-powered autonomy, enabling them to dig, grade, and move earth without human operators. Their AI operator (ARI) uses GPS, LiDAR, and computer vision to execute construction plans with millimeter precision. Deployed on 100+ job sites across the US, Built Robotics addresses the construction industry\'s critical labor shortage while improving safety and productivity.',
    category: 'autonomous-construction',
    icon: '🏗️',
    href: '/services/built-robotics-autonomous-excavators',
    industry: 'Construction & Heavy Equipment',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Pilot program (1 machine, 30 days)', pro: '$15,000/month per machine', enterprise: 'Fleet deployment (custom pricing)' },
    contactInfo: { website: 'https://builtrobotics.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Retrofit kit: converts any excavator/bulldozer to autonomous in 48 hours',
      'AI operator (ARI) executes construction plans with ±25mm accuracy',
      '24/7 operation: machines work night shifts without human operators',
      'Safety: eliminates human exposure to hazardous excavation and grading work',
      'Cloud-based fleet management: monitor all machines from a single dashboard',
      'Compatible with Caterpillar, Komatsu, John Deere, and Volvo equipment'
    ],
    benefits: [
      'Address construction labor shortage: 1 autonomous machine = 3 shifts of work',
      'Zero serious safety incidents across 100+ job sites',
      'Projects completed 20-30% faster than manual operations',
      'Operators upskill to fleet management instead of leaving the industry',
      'ROI achieved within 6 months through productivity gains'
    ]
  }
];

export const wave218EmotionAiServices: Service[] = [
  {
    id: 'affectiva-emotion-ai-platform',
    title: 'Affectiva (Smart Eye) — Emotion AI & Facial Coding Platform',
    description: 'Affectiva, now part of Smart Eye, pioneered emotion AI — using computer vision and deep learning to detect human emotions, cognitive states, and reactions from facial expressions and voice. Their technology analyzes 7 billion+ face frames across 90 countries, enabling automotive safety (driver monitoring), media testing (ad effectiveness), healthcare (mental health screening), and retail (customer experience optimization).',
    category: 'emotion-ai',
    icon: '😊',
    href: '/services/affectiva-emotion-ai-platform',
    industry: 'AI & Human Experience Analytics',
    stage: 'published',
    popular: true,
    pricing: { basic: 'SDK license ($10K/year)', pro: '$50K/year (media analytics)', enterprise: 'Custom ($200K+/year for automotive OEM)' },
    contactInfo: { website: 'https://smarteye.se', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Detects 7 emotions, 15 facial expressions, and cognitive states in real time',
      'Works with standard RGB cameras — no specialized hardware required',
      'Driver monitoring: detects drowsiness, distraction, and impairment in vehicles',
      'Media testing: measures emotional response to ads, content, and products',
      'Healthcare: screens for depression, anxiety, and pain via facial biomarkers',
      'Privacy-first: processes video locally, no facial images stored or transmitted'
    ],
    benefits: [
      'Automotive: reduce drowsy driving accidents by 40% with real-time alerts',
      'Media companies: predict ad effectiveness with 85% accuracy vs. surveys',
      'Healthcare: objective mental health screening without subjective questionnaires',
      'Retail: optimize store layouts and product placement based on emotional engagement',
      'GDPR/CCPA compliant: no biometric data stored, all processing on-device'
    ]
  }
];

export const wave218SatelliteInternetServices: Service[] = [
  {
    id: 'starlink-satellite-internet',
    title: 'Starlink — Low Earth Orbit Satellite Internet',
    description: 'Starlink, operated by SpaceX, provides high-speed, low-latency internet access globally via a constellation of 6,000+ low Earth orbit satellites. With download speeds of 50-250 Mbps and latency of 20-40ms, Starlink serves rural communities, maritime vessels, aircraft, and enterprise locations where terrestrial internet is unavailable. The network is expanding to 12,000+ satellites with direct-to-cell phone service launching 2025.',
    category: 'satellite-internet',
    icon: '📡',
    href: '/services/starlink-satellite-internet',
    industry: 'Telecommunications & Connectivity',
    stage: 'published',
    popular: true,
    pricing: { basic: '$120/month (residential)', pro: '$250/month (business, 1TB priority)', enterprise: '$5,000/month (maritime/aviation)' },
    contactInfo: { website: 'https://starlink.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '6,000+ LEO satellites providing global coverage including polar regions',
      '50-250 Mbps download, 20-40ms latency — comparable to terrestrial broadband',
      'Self-installing phased-array antenna: plugs in, points at sky, connects automatically',
      'Direct-to-cell service: connect standard smartphones to satellites (2025)',
      'Maritime and aviation plans for ships, aircraft, and mobile command centers',
      'Enterprise SLA: 99.5% uptime with priority traffic routing'
    ],
    benefits: [
      'Connect the unconnected: 4 billion people lack reliable internet access',
      'Disaster recovery: deploy internet anywhere within hours, no infrastructure needed',
      'Rural businesses gain access to cloud services, e-commerce, and remote work',
      'Maritime and aviation: crew welfare and operational connectivity at sea/air',
      'Latency low enough for video conferencing, cloud gaming, and real-time trading'
    ]
  }
];

export const wave218AiLegalAssistantServices: Service[] = [
  {
    id: 'harvey-ai-legal-platform',
    title: 'Harvey AI — Enterprise Legal AI Platform',
    description: 'Harvey AI is a generative AI platform built specifically for law firms and legal departments. Trained on legal data and integrated with Westlaw, LexisNexis, and firm knowledge bases, Harvey performs legal research, contract analysis, due diligence, and document drafting at superhuman speed. Used by 15,000+ lawyers at firms including Allen & Overy, PwC, and KPMG, Harvey reduces legal research time by 80% and contract review by 90%.',
    category: 'ai-legal-assistants',
    icon: '⚖️',
    href: '/services/harvey-ai-legal-platform',
    industry: 'Legal Technology',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Not available (enterprise only)', pro: '$1,000/seat/year (mid-size firms)', enterprise: 'Custom ($500K+/year for AmLaw 100 firms)' },
    contactInfo: { website: 'https://harvey.ai', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Legal research: natural language queries across case law, statutes, and regulations',
      'Contract analysis: review 100+ page agreements in minutes, flag risks and anomalies',
      'Due diligence: automate M&A document review across thousands of contracts',
      'Document drafting: generate memos, briefs, and contracts from natural language prompts',
      'Firm knowledge base: search internal precedents, templates, and expertise',
      'SOC 2 Type II certified, GDPR compliant, with firm-specific data isolation'
    ],
    benefits: [
      'Reduce legal research time by 80% — hours become minutes',
      'Contract review 90% faster with consistent quality across all documents',
      'Lawyers focus on high-value strategy instead of repetitive document review',
      'New associates become productive 3x faster with AI-assisted research',
      'Firms handle 40% more matter volume without adding headcount'
    ]
  }
];

export const wave218NuclearFusionEnergyServices: Service[] = [
  {
    id: 'commonwealth-fusion-sparc-reactor',
    title: 'Commonwealth Fusion Systems — SPARC Compact Fusion Reactor',
    description: 'Commonwealth Fusion Systems (CFS), spun out of MIT, is building SPARC — the world\'s first compact, net-energy-gain fusion reactor using high-temperature superconducting magnets. SPARC is designed to produce 140 MW of fusion power from a device the size of a tennis court, achieving Q>2 (more energy out than in). Commercial deployment (ARC power plant) is targeted for the early 2030s, promising unlimited, zero-carbon baseload energy.',
    category: 'nuclear-fusion-energy',
    icon: '⚛️',
    href: '/services/commonwealth-fusion-sparc-reactor',
    industry: 'Energy & Clean Tech',
    stage: 'published',
    popular: false,
    pricing: { basic: 'Research partnership', pro: 'Corporate PPA (power purchase agreement)', enterprise: 'Strategic investment (Series B+)' },
    contactInfo: { website: 'https://cfs.energy', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'High-temperature superconducting (HTS) magnets: 20 Tesla field strength — world record',
      'SPARC reactor: compact tokamak design, 140 MW fusion power output',
      'Net energy gain (Q>2): more fusion energy produced than input heating power',
      'ARC power plant design: 200 MWe commercial fusion plant for grid connection',
      '$2B+ raised from Temasek, Google, Bill Gates, and Equinor',
      'Target: first fusion electricity to grid by early 2030s'
    ],
    benefits: [
      'Unlimited clean energy: fuel from seawater (deuterium) and lithium (tritium)',
      'Zero carbon emissions during operation — no greenhouse gases',
      'No long-lived radioactive waste — fundamentally safer than fission',
      'Baseload power: runs 24/7 regardless of weather, unlike solar and wind',
      'Energy independence: fuel available to every nation on Earth'
    ]
  }
];

export const wave218HolographicDisplayServices: Service[] = [
  {
    id: 'looking-glass-holographic-displays',
    title: 'Looking Glass Factory — Glasses-Free Holographic Displays',
    description: 'Looking Glass Factory produces glasses-free holographic displays that show true 3D images viewable by multiple people simultaneously without headsets. Their displays use a proprietary light field engine that projects 45-100 perspectives of a 3D scene, creating a holographic effect visible to the naked eye. Applications span medical imaging, retail product visualization, digital signage, and creative industries.',
    category: 'holographic-displays',
    icon: '🔮',
    href: '/services/looking-glass-holographic-displays',
    industry: 'Display Technology & Spatial Computing',
    stage: 'published',
    popular: false,
    pricing: { basic: '$399 (Portrait, 6.9")', pro: '$3,500 (32" light field display)', enterprise: '$15,000 (65" wall-sized holographic display)' },
    contactInfo: { website: 'https://lookingglassfactory.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Glasses-free 3D: view holographic content without headsets or special glasses',
      '45-100 simultaneous perspectives: multiple viewers see correct 3D from any angle',
      'Medical imaging: view CT/MRI scans as true 3D holograms for surgical planning',
      'Retail: display products as floating 3D holograms in store windows',
      'Unity/Unreal SDK: import 3D scenes directly into Looking Glass displays',
      'Portrait personal display: 6.9" holographic screen for desktop use'
    ],
    benefits: [
      'Surgeons view patient anatomy as true 3D holograms before operating',
      'Retailers increase engagement 3x with holographic product displays',
      'Designers and artists create and view 3D work without VR headset fatigue',
      'Education: students explore molecular structures, historical artifacts in 3D',
      'No motion sickness: natural viewing experience vs. VR headsets'
    ]
  }
];
