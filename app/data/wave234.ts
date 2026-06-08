import { Service } from './serviceTypes';

// Wave 234 — 5 real services across AI, IT, and Micro-SaaS
// Contact: kleber@ziontechgroup.com | +1 302 464 0950

// ── AI Services ──────────────────────────────────────────────

export const wave234AiServices: Service[] = [
  {
    id: 'ai-energy-grid-optimization',
    title: 'AI-Powered Energy Grid Optimization',
    description:
      'Smart grid load forecasting, renewable integration, demand response, and outage prediction powered by machine learning. Helps utilities reduce costs, improve reliability, and accelerate the transition to clean energy.',
    features: [
      'Real-time load forecasting with 98% accuracy across distribution networks',
      'Renewable energy integration modeling for solar, wind, and battery storage',
      'Automated demand-response orchestration for peak shaving and load balancing',
      'Predictive outage detection using weather data, sensor feeds, and historical patterns',
      'Dynamic pricing engine that adjusts tariffs based on demand and grid stress',
      'Interactive grid health dashboard with drill-down analytics and KPI tracking',
    ],
    benefits: [
      'Reduces unplanned outages by up to 40% through predictive maintenance alerts',
      'Increases renewable energy utilization by optimizing generation schedules',
      'Lowers operational costs via intelligent demand-response automation',
      'Improves regulatory compliance with automated reporting and audit trails',
      'Scales to millions of smart-meter data points without performance degradation',
    ],
    pricing: {
      basic: '$3,499/mo',
      pro: '$8,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Zap',
    href: '/services/ai-energy-grid-optimization',
    popular: true,
    category: 'ai',
    industry: 'Energy/Utilities',
    stage: 'published',
  },
  {
    id: 'ai-document-classification-extraction',
    title: 'AI Document Classification & Data Extraction',
    description:
      'Auto-classify documents, extract structured data with OCR, and route workflows intelligently. Eliminate manual data entry and accelerate document-driven processes across finance, legal, and operations.',
    features: [
      'Automatic document classification across 50+ categories with 97% accuracy',
      'Structured data extraction from PDFs, scans, emails, and images using advanced OCR',
      'Intelligent workflow routing that assigns documents to the right team or approver',
      'Custom trainable models for industry-specific document types and templates',
      'Batch processing engine handling thousands of documents per hour',
      'Full audit trail with version history, confidence scores, and human-in-the-loop review',
    ],
    benefits: [
      'Cuts document processing time by 80% through end-to-end automation',
      'Reduces data-entry errors with machine-validated extraction results',
      'Speeds up approvals with smart routing that learns from past decisions',
      'Ensures compliance with tamper-evident audit logs and access controls',
      'Integrates with existing ERP, CRM, and document management systems via API',
    ],
    pricing: {
      basic: '$599/mo',
      pro: '$1,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'FileText',
    href: '/services/ai-document-classification-extraction',
    popular: false,
    category: 'ai',
    industry: 'Enterprise',
    stage: 'published',
  },
];

// ── IT Services ──────────────────────────────────────────────

export const wave234ItServices: Service[] = [
  {
    id: 'email-security-anti-phishing',
    title: 'Email Security & Anti-Phishing Service',
    description:
      'Advanced threat protection with DMARC/DKIM/SPF management, phishing simulation, and incident response. Shields your organization from business email compromise, ransomware, and social engineering attacks.',
    features: [
      'Real-time advanced threat protection analyzing links, attachments, and sender behavior',
      'Managed DMARC, DKIM, and SPF configuration with guided deployment and monitoring',
      'Automated phishing simulation campaigns with difficulty tiers and scheduling',
      '24/7 incident response team with containment, forensics, and recovery playbooks',
      'Security awareness training modules tailored to simulation results and role types',
      'Executive dashboard with threat landscape overview, trends, and compliance scores',
    ],
    benefits: [
      'Blocks 99.7% of phishing, spoofing, and business email compromise attempts',
      'Achieves DMARC enforcement (p=reject) within 90 days of onboarding',
      'Reduces employee click-through rates on phishing tests by up to 85%',
      'Provides sub-1-hour response SLA for confirmed security incidents',
      'Meets compliance requirements for SOC 2, HIPAA, and PCI-DSS email controls',
    ],
    pricing: {
      basic: '$3/user/mo',
      pro: '$6/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Shield',
    href: '/services/email-security-anti-phishing',
    popular: true,
    category: 'it',
    industry: 'Cybersecurity',
    stage: 'published',
  },
];

// ── Micro-SaaS Services ──────────────────────────────────────

export const wave234MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-inventory-order-management',
    title: 'Micro-SaaS Inventory & Order Management',
    description:
      'Multi-channel inventory sync, order tracking, supplier management, and low-stock alerts. Purpose-built for e-commerce sellers who need a lightweight yet powerful operations hub without enterprise complexity.',
    features: [
      'Real-time multi-channel inventory synchronization across Shopify, Amazon, WooCommerce, and more',
      'Unified order tracking with status updates, shipping labels, and delivery notifications',
      'Supplier management portal with lead times, MOQs, and purchase order automation',
      'Intelligent low-stock alerts with reorder-point suggestions based on sales velocity',
      'Barcode and SKU management with bulk import/export and variant support',
      'Sales analytics dashboard with channel performance, turnover rates, and margin tracking',
    ],
    benefits: [
      'Eliminates overselling with sub-second inventory sync across all sales channels',
      'Reduces stockouts by up to 60% with predictive reorder recommendations',
      'Saves 10+ hours per week on manual order processing and supplier follow-ups',
      'Provides a single source of truth for inventory, orders, and supplier data',
      'Scales from 100 to 100,000 SKUs without changing platforms or workflows',
    ],
    pricing: {
      basic: '$69/mo',
      pro: '$149/mo',
      enterprise: '$349/mo',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Package',
    href: '/services/micro-saas-inventory-order-management',
    popular: false,
    category: 'micro-saas',
    industry: 'E-Commerce',
    stage: 'published',
  },
  {
    id: 'micro-saas-hr-leave-attendance-tracker',
    title: 'Micro-SaaS HR Leave & Attendance Tracker',
    description:
      'Leave requests, attendance logging, shift scheduling, and payroll integration in one streamlined app. Designed for small-to-mid-sized teams that need modern HR tools without the bloat of enterprise suites.',
    features: [
      'Self-service leave requests with multi-level approval workflows and calendar sync',
      'Automated attendance logging via mobile app, web check-in, and biometric integrations',
      'Drag-and-drop shift scheduling with conflict detection and overtime alerts',
      'Payroll integration exporting hours, leave balances, and overtime to major payroll providers',
      'PTO policy engine supporting accruals, carryovers, blackout dates, and custom rules',
      'Team dashboard with attendance heatmaps, leave trends, and headcount analytics',
    ],
    benefits: [
      'Reduces HR admin time by 70% through automated leave and attendance workflows',
      'Eliminates payroll errors with accurate, real-time hour and leave balance exports',
      'Improves employee satisfaction with transparent, self-service leave management',
      'Ensures labor law compliance with configurable policies and audit-ready reports',
      'Deploys in under a day with no IT team required — fully cloud-hosted and managed',
    ],
    pricing: {
      basic: '$2/user/mo',
      pro: '$4/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: 'https://ziontechgroup.com',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'Users',
    href: '/services/micro-saas-hr-leave-attendance-tracker',
    popular: false,
    category: 'micro-saas',
    industry: 'Human Resources',
    stage: 'published',
  },
];
