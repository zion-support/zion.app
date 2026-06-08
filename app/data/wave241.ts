import { Service } from './serviceTypes';

// =============================================================================
// Wave 241 — Services
// =============================================================================
// AI Services (2)
export const wave241AiServices: Service[] = [
  {
    id: 'ai-powered-smart-contract-auditing',
    title: 'AI-Powered Smart Contract Auditing',
    description:
      'Comprehensive Solidity and smart contract vulnerability detection, gas optimization analysis, compliance checks, and formal verification powered by AI.',
    features: [
      'Automated vulnerability scanning that detects reentrancy, integer overflow, front-running, access control flaws, and logic errors across Solidity smart contracts',
      'Gas optimization analysis identifying inefficient opcodes, storage patterns, and contract structures with specific recommendations to reduce transaction costs by up to 40%',
      'Compliance checking engine that validates contracts against ERC standards, regulatory frameworks, and security best practices with detailed remediation reports',
      'Formal verification module using mathematical proofs to guarantee contract correctness for critical financial logic and state transitions',
      'Continuous monitoring that re-audits deployed contracts when dependencies, compiler versions, or upstream protocols change',
      'Audit report generation producing investor-ready security assessments with severity scoring, exploit scenarios, and prioritized fix recommendations',
    ],
    benefits: [
      'Prevent costly exploits by catching vulnerabilities before deployment when fixes cost 100x less than post-incident remediation',
      'Reduce gas costs by up to 40% through AI-identified optimization opportunities that manual reviews consistently miss',
      'Accelerate time-to-market with automated auditing that delivers comprehensive security reports in hours instead of weeks',
      'Build investor and user confidence with formal verification proofs and published audit reports that demonstrate security rigor',
      'Maintain continuous security posture with automated re-auditing triggered by dependency updates and ecosystem changes',
    ],
    pricing: {
      basic: '$2,999/mo',
      pro: '$7,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-powered-smart-contract-auditing',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'file-document-check',
    href: '/services/ai-powered-smart-contract-auditing',
    popular: true,
    category: 'ai',
    industry: 'Blockchain/Web3',
    stage: 'published',
  },
  {
    id: 'ai-traffic-management-smart-city-analytics',
    title: 'AI Traffic Management & Smart City Analytics',
    description:
      'Real-time traffic flow optimization, congestion prediction, adaptive signal control, and incident detection for modern smart city infrastructure.',
    features: [
      'Real-time traffic flow optimization using computer vision and sensor data to dynamically adjust routing, reduce bottlenecks, and balance network load across corridors',
      'Congestion prediction engine leveraging historical patterns, event data, weather conditions, and special occasions to forecast traffic buildup 30-60 minutes in advance',
      'Adaptive signal control that automatically adjusts traffic light timing based on real-time vehicle counts, pedestrian activity, and emergency vehicle preemption',
      'Incident detection system using AI-powered video analytics to identify accidents, stalled vehicles, debris, and hazardous conditions within seconds of occurrence',
      'Smart city analytics dashboard with intersection performance scoring, corridor throughput metrics, emissions impact tracking, and before-after optimization reports',
      'Multi-agency integration layer connecting traffic management centers, emergency services, public transit systems, and navigation apps for coordinated response',
    ],
    benefits: [
      'Reduce average commute times by 20-30% through intelligent signal coordination and real-time congestion management across entire city networks',
      'Cut emergency response times by dynamically clearing corridors and adjusting signals to create green waves for first responders',
      'Decrease vehicle emissions by 15% through reduced idling and smoother traffic flow that minimizes stop-and-go driving patterns',
      'Enable data-driven infrastructure investment with analytics that identify the highest-impact intersections and corridors for improvement',
      'Scale traffic management without adding operators as the AI handles routine optimization and only escalates complex scenarios',
    ],
    pricing: {
      basic: '$4,999/mo',
      pro: '$12,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-traffic-management-smart-city-analytics',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'traffic-light',
    href: '/services/ai-traffic-management-smart-city-analytics',
    category: 'ai',
    industry: 'Smart Cities/Urban Planning',
    stage: 'published',
  },
];

// IT Services (1)
export const wave241ItServices: Service[] = [
  {
    id: 'api-security-threat-protection-service',
    title: 'API Security & Threat Protection Service',
    description:
      'Comprehensive API security with automated discovery, schema validation, abuse detection, intelligent rate limiting, and advanced bot mitigation.',
    features: [
      'API discovery and inventory that automatically maps all public, internal, and shadow APIs across your infrastructure including undocumented and deprecated endpoints',
      'Schema validation engine enforcing strict OpenAPI/GraphQL specifications to reject malformed requests, prevent data injection, and ensure consistent API contracts',
      'Abuse detection using behavioral analytics to identify credential stuffing, data scraping, API abuse patterns, and anomalous consumption that bypasses traditional WAFs',
      'Intelligent rate limiting with dynamic thresholds per endpoint, user tier, and client reputation that protects backend resources without blocking legitimate traffic',
      'Bot mitigation combining fingerprinting, challenge-response tests, behavioral analysis, and machine learning to distinguish humans from sophisticated automated attacks',
      'Security analytics dashboard with real-time threat feeds, attack trend analysis, API risk scoring, and automated incident response playbooks',
    ],
    benefits: [
      'Eliminate shadow API risk by discovering and cataloging every API endpoint across your entire infrastructure including forgotten and undocumented services',
      'Prevent data breaches through schema validation that blocks injection attacks and malformed requests before they reach your backend systems',
      'Stop API abuse and scraping with behavioral detection that identifies and blocks sophisticated attackers using legitimate credentials',
      'Maintain API availability during traffic spikes with intelligent rate limiting that protects backends while ensuring legitimate users experience no disruption',
      'Reduce security operations workload with automated threat detection and response that handles routine attacks without human intervention',
    ],
    pricing: {
      basic: '$699/mo',
      pro: '$1,799/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/api-security-threat-protection-service',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'shield-api',
    href: '/services/api-security-threat-protection-service',
    popular: true,
    category: 'it',
    industry: 'API Security',
    stage: 'published',
  },
];

// Micro-SaaS Services (2)
export const wave241MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-affiliate-referral-tracking',
    title: 'Micro-SaaS Affiliate & Referral Tracking',
    description:
      'Complete affiliate program management with real-time commission tracking, fraud detection, automated payouts, and performance analytics.',
    features: [
      'Affiliate program management with customizable commission structures, tiered rewards, coupon tracking, and self-service affiliate onboarding portals',
      'Real-time commission tracking with multi-touch attribution models, cookie-less tracking fallback, and granular conversion event logging across all channels',
      'Fraud detection engine using device fingerprinting, IP analysis, conversion pattern recognition, and velocity checks to identify and block fraudulent referrals',
      'Automated payout processing supporting PayPal, bank transfer, Stripe Connect, and crypto with scheduled payouts, tax form collection, and threshold management',
      'Performance analytics dashboard with affiliate leaderboards, conversion funnel analysis, EPC tracking, cohort performance, and ROI by traffic source',
      'Partner communication tools including automated email campaigns, promotional asset libraries, performance notifications, and in-app messaging for affiliate engagement',
    ],
    benefits: [
      'Scale revenue through affiliate channels with automated program management that onboards and manages thousands of partners without manual overhead',
      'Protect affiliate program ROI with fraud detection that identifies and blocks fake referrals before they cost you commission dollars',
      'Increase affiliate retention with reliable automated payouts and transparent real-time dashboards that build trust and motivate top performers',
      'Optimize program profitability with attribution analytics that reveal which affiliates, channels, and campaigns drive the highest-value customers',
      'Launch affiliate programs in days with pre-built templates and integrations that eliminate months of custom development',
    ],
    pricing: {
      basic: '$99/mo',
      pro: '$249/mo',
      enterprise: '$499/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-affiliate-referral-tracking',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'account-group',
    href: '/services/micro-saas-affiliate-referral-tracking',
    category: 'micro-saas',
    industry: 'Marketing',
    stage: 'published',
  },
  {
    id: 'micro-saas-digital-asset-management-dam',
    title: 'Micro-SaaS Digital Asset Management (DAM)',
    description:
      'Centralized digital asset library with version control, AI-powered metadata tagging, brand compliance enforcement, and team collaboration tools.',
    features: [
      'Centralized asset library with intelligent folder structures, advanced search with filters by type, date, usage rights, and custom taxonomy for instant asset retrieval',
      'Version control system tracking every asset revision with side-by-side comparison, rollback capability, and complete audit trails showing who changed what and when',
      'AI-powered metadata tagging that automatically generates keywords, descriptions, alt text, and categorization for uploaded assets using computer vision and NLP',
      'Brand compliance engine that enforces logo usage guidelines, color palette adherence, approved templates, and brand asset expiration dates across all downloads',
      'Team collaboration tools with asset request workflows, approval chains, annotation and commenting, usage rights management, and external sharing with expiration controls',
      'Integration hub connecting with design tools, CMS platforms, social media schedulers, and marketing automation systems for seamless asset distribution',
    ],
    benefits: [
      'Eliminate asset chaos with a single source of truth that ensures every team member finds the right file in seconds instead of searching through scattered folders',
      'Protect brand consistency with automated compliance checks that prevent outdated logos, off-brand colors, and expired assets from being used in marketing materials',
      'Reduce asset creation costs by 30% through AI tagging and smart search that surfaces existing assets teams would otherwise recreate from scratch',
      'Streamline approval workflows with automated routing that moves assets from creation to approval to distribution without email chains and manual handoffs',
      'Scale content operations without adding asset managers as the AI handles tagging, organization, and compliance enforcement automatically',
    ],
    pricing: {
      basic: '$59/mo',
      pro: '$149/mo',
      enterprise: '$349/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-digital-asset-management-dam',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'folder-multiple-image',
    href: '/services/micro-saas-digital-asset-management-dam',
    category: 'micro-saas',
    industry: 'Marketing/Brand Management',
    stage: 'published',
  },
];
