import { Service } from './serviceTypes';

// Wave 229 — Real AI/IT/Micro-SaaS Services (Batch 2)
// AI: AI-Powered Insurance Claims Processing, AI Supply Chain Risk Intelligence
// IT: Zero-Trust Network Architecture Design, Unified Communications as a UCaaS
// Security: Threat Intelligence Platform Management
// Micro-SaaS: Event Registration Platform
// Created by @Kilo_openclaw_kleber_bot — 2026-06-07

export const wave229AiInsuranceClaimsServices: Service[] = [
  {
    id: 'ai-insurance-claims-processing',
    title: 'AI Insurance Claims Processing & Fraud Detection',
    description: 'Automate insurance claims intake, validation, and adjudication with AI. OCR extracts data from claim documents, AI validates against policy rules, detects fraud patterns, and calculates payouts. Reduces claims processing time from weeks to hours.',
    features: ['OCR document extraction (forms, photos, invoices)', 'Policy rule validation engine', 'AI fraud pattern detection', 'Automated payout calculation', 'Regulatory compliance checks', 'Integration with core insurance platforms'],
    benefits: ['Process claims 10x faster', 'Detect 3x more fraud than manual review', 'Reduce claims leakage by 15-20%', 'Improve customer satisfaction with faster payouts', 'Meet regulatory compliance automatically'],
    pricing: {basic: '$2,499/mo', pro: '$5,999/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-insurance-claims-processing', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📋',
    href: '/services/ai-insurance-claims-processing',
    popular: true,
    category: 'ai',
    industry: 'Insurance',
    stage: 'published',
  },
  {
    id: 'ai-supply-chain-risk-intelligence',
    title: 'AI Supply Chain Risk Intelligence Platform',
    description: 'Monitor and predict supply chain disruptions using AI. Analyzes news, weather data, geopolitical events, supplier financial health, and logistics patterns to identify risks before they impact your supply chain.',
    features: ['Real-time disruption monitoring (weather, geopolitics, logistics)', 'Supplier financial health scoring', 'Multi-tier supply chain mapping', 'Alternative supplier recommendations', 'Impact quantification and mitigation planning', 'Integration with SAP, Oracle, Kinaxis'],
    benefits: ['Predict disruptions 30-60 days ahead', 'Map hidden supplier dependencies', 'Quantify financial impact of risks', 'Automate alternative sourcing decisions', 'Reduce supply chain disruption costs by 25%'],
    pricing: {basic: '$1,499/mo', pro: '$3,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/ai-supply-chain-risk-intelligence', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔗',
    href: '/services/ai-supply-chain-risk-intelligence',
    popular: true,
    category: 'ai',
    industry: 'Supply Chain',
    stage: 'published',
  },
];

export const wave229ItZeroTrustNetworkServices: Service[] = [
  {
    id: 'it-zero-trust-network-design',
    title: 'Zero-Trust Network Architecture Design & Implementation',
    description: 'Design and implement a zero-trust network architecture from the ground up. Identity-aware micro-segmentation, continuous verification, no implicit trust. Includes network assessment, architecture design, implementation, and managed monitoring.',
    features: ['Current state network assessment', 'Identity-aware micro-segmentation design', 'Device trust and posture verification', 'Least-privilege access policy framework', 'Implementation and migration planning', 'Ongoing zero-trust monitoring and enforcement'],
    benefits: ['Eliminate implicit trust in your network', 'Reduce breach blast radius by 90%', 'Meet CMMC, NIST 800-207 requirements', 'Secure remote work by design', 'Simplified compliance audits'],
    pricing: {basic: '$5,000/project', pro: '$15,000/project', enterprise: 'Custom'},
    contactInfo: {website: '/services/it-zero-trust-network-design', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🔐',
    href: '/services/it-zero-trust-network-design',
    popular: true,
    category: 'it',
    industry: 'Network Security',
    stage: 'published',
  },
  {
    id: 'it-ucaas-platform',
    title: 'Unified Communications as a Service (UCaaS) Deployment',
    description: 'Deploy and manage a cloud-powered unified communications platform. Voice, video, messaging, and collaboration in one system. HD video conferencing, auto-attendant, call queues, screen sharing, and mobile apps. Replace legacy PBX and fragmented tools.',
    features: ['Cloud voice with HD audio', 'HD video conferencing (up to 500 participants)', 'Team messaging and channels', 'Auto-attendant and call queue management', 'Mobile and desktop apps', 'Integration with CRM and helpdesk'],
    benefits: ['One platform for all communication', '60% cost reduction vs legacy PBX', 'Work from anywhere with full feature parity', 'Integrate calls with CRM for context', 'Scale instantly — add users in seconds'],
    pricing: {basic: '$12/user/mo', pro: '$22/user/mo', enterprise: '$35/user/mo'},
    contactInfo: {website: '/services/it-ucaas-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '📞',
    href: '/services/it-ucaas-platform',
    popular: true,
    category: 'it',
    industry: 'Telecommunications',
    stage: 'published',
  },
];

export const wave229SecurityThreatIntelServices: Service[] = [
  {
    id: 'security-threat-intel-platform',
    description: 'Managed Threat Intelligence Platform that aggregates, enriches, and operationalizes threat data from commercial, open-source, and internal feeds. AI correlates threats to your infrastructure and prioritizes by relevance.',
    title: 'Threat Intelligence Platform Management & Monitoring',
    features: ['Multi-source feed aggregation (commercial + OSINT)', 'AI threat correlation to your infrastructure', 'IOC enrichment (IPs, domains, hashes, TTPs)', 'Automated alert generation for relevant threats', 'Integration with SIEM, EDR, firewalls', 'Weekly threat briefings and reports'],
    benefits: ['Know about threats targeting your industry first', 'Prioritize threats by relevance to your infra', 'Enrich SIEM alerts with threat context', 'Proactive defense, not reactive', 'Data-driven security investment decisions'],
    pricing: {basic: '$1,999/mo', pro: '$4,499/mo', enterprise: 'Custom'},
    contactInfo: {website: '/services/security-threat-intel-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎯',
    href: '/services/security-threat-intel-platform',
    popular: true,
    category: 'security',
    industry: 'Threat Intelligence',
    stage: 'published',
  },
];

export const wave229MicroSaasEventPlatformServices: Service[] = [
  {
    id: 'microsaas-event-registration',
    title: 'Micro-SaaS Event Registration & Ticketing Platform',
    description: 'Launch and manage events with a lightweight registration and ticketing platform. Custom event pages, Stripe payment collection, attendee management, check-in apps, and post-event analytics. Perfect for workshops, conferences, and webinars.',
    features: 'Custom event page builder with themes, Multiple ticket types (early bird, VIP, group), Stripe payment collection, Attendee management and communication, Mobile check-in app, Post-event analytics and surveys'.split(', '),
    benefits: ['Launch an event page in under 10 minutes', 'Collect payments with Stripe at checkout', 'Manage attendees and send updates', 'Check in attendees with mobile app', 'Know what worked with post-event analytics'],
    pricing: {basic: '$49/mo', pro: '$129/mo', enterprise: '$299/mo'},
    contactInfo: {website: '/services/microsaas-event-registration', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950'},
    icon: '🎟️',
    href: '/services/microsaas-event-registration',
    popular: true,
    category: 'micro-saas',
    industry: 'Events',
    stage: 'published',
  },
];
