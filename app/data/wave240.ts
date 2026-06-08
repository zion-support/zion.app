import { Service } from './serviceTypes';

// =============================================================================
// Wave 240 — Services
// =============================================================================
// AI Services (2)
export const wave240AiServices: Service[] = [
  {
    id: 'ai-powered-logistics-route-optimization',
    title: 'AI-Powered Logistics Route Optimization',
    description:
      'Real-time route planning, fuel cost reduction, delivery time prediction, and fleet management powered by machine learning algorithms.',
    features: [
      'Dynamic real-time route planning engine that recalculates optimal paths based on live traffic, weather, road closures, and vehicle constraints',
      'Fuel cost reduction algorithms analyzing historical consumption patterns, idle time, elevation changes, and driver behavior to minimize fuel spend',
      'Delivery time prediction using ML models trained on historical route data, seasonal patterns, and real-time conditions to provide accurate ETAs',
      'Fleet management dashboard with vehicle health monitoring, maintenance scheduling, driver assignment optimization, and utilization analytics',
      'Multi-stop route sequencing that solves complex traveling-salesman problems for hundreds of stops while respecting time windows and capacity limits',
      'Performance analytics with cost-per-mile tracking, on-time delivery rates, route efficiency scores, and benchmarking across fleet segments',
    ],
    benefits: [
      'Reduce fuel costs by up to 22% through intelligent route optimization that eliminates unnecessary mileage and idle time',
      'Improve on-time delivery rates to 97%+ with accurate ETAs that account for real-world conditions and traffic patterns',
      'Cut planning time from hours to seconds by automating complex multi-stop route calculations that overwhelm human dispatchers',
      'Extend vehicle lifespan and reduce breakdowns with predictive maintenance alerts based on actual usage patterns and mileage',
      'Scale fleet operations without adding dispatchers as the AI handles increasing route complexity with zero marginal effort',
    ],
    pricing: {
      basic: '$1,799/mo',
      pro: '$4,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-powered-logistics-route-optimization',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'truck-fast',
    href: '/services/ai-powered-logistics-route-optimization',
    popular: true,
    category: 'ai',
    industry: 'Logistics/Transportation',
    stage: 'published',
  },
  {
    id: 'ai-medical-imaging-analysis-assistant',
    title: 'AI Medical Imaging Analysis Assistant',
    description:
      'X-ray, CT, and MRI analysis with anomaly detection, automated radiology report generation, and seamless DICOM integration.',
    features: [
      'Multi-modality image analysis supporting X-ray, CT, MRI, and ultrasound with specialized detection models trained on millions of annotated studies',
      'Anomaly detection engine that highlights suspicious regions, classifies findings by severity, and flags urgent cases for immediate radiologist review',
      'Automated radiology report generation producing structured draft reports with findings, measurements, impressions, and follow-up recommendations',
      'DICOM integration layer connecting directly to PACS, RIS, and EHR systems for seamless image retrieval, annotation storage, and report delivery',
      'Quality assurance module that detects motion artifacts, positioning errors, and suboptimal scan parameters before analysis to reduce repeat imaging',
      'Clinical decision support dashboard with case prioritization, comparison tools for longitudinal studies, and peer-reviewed confidence scoring',
    ],
    benefits: [
      'Accelerate radiology turnaround times by 50% with AI pre-screening that prioritizes critical cases and auto-generates draft reports',
      'Reduce missed findings by 35% through consistent AI-assisted detection that catches subtle anomalies even during high-volume reading sessions',
      'Eliminate DICOM workflow friction with direct PACS integration that pulls studies, pushes annotations, and delivers reports without manual transfers',
      'Improve diagnostic confidence with AI confidence scores and highlighted regions that guide radiologist attention to areas of concern',
      'Handle growing imaging volumes without proportional radiologist hiring by letting AI handle routine screening and triage',
    ],
    pricing: {
      basic: '$3,999/mo',
      pro: '$8,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-medical-imaging-analysis-assistant',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'medical-bag',
    href: '/services/ai-medical-imaging-analysis-assistant',
    category: 'ai',
    industry: 'Healthcare/Radiology',
    stage: 'published',
  },
];

// IT Services (1)
export const wave240ItServices: Service[] = [
  {
    id: 'identity-access-management-iam-service',
    title: 'Identity & Access Management (IAM) Service',
    description:
      'Single sign-on, multi-factor authentication, privileged access management, access reviews, and compliance reporting in one platform.',
    features: [
      'Single sign-on (SSO) with SAML 2.0, OAuth 2.0, and OpenID Connect supporting hundreds of pre-built integrations for cloud and on-premises applications',
      'Multi-factor authentication (MFA) with adaptive risk-based policies, push notifications, hardware tokens, biometric options, and FIDO2/WebAuthn support',
      'Privileged access management (PAM) with session recording, just-in-time elevation, credential vaulting, and automatic password rotation for admin accounts',
      'Automated access review campaigns with manager attestation workflows, orphaned account detection, and one-click revocation for compliance certifications',
      'Compliance reporting engine generating audit-ready reports for SOC 2, HIPAA, PCI-DSS, and GDPR with continuous control monitoring and evidence collection',
      'Identity lifecycle automation handling joiner-mover-leaver processes with role-based access control templates and automated provisioning across connected systems',
    ],
    benefits: [
      'Eliminate 99.9% of credential-based breaches with MFA enforcement and privileged access controls that prevent lateral movement',
      'Reduce access review preparation time from weeks to days with automated campaigns that route certifications to the right managers',
      'Achieve SOC 2 and HIPAA compliance faster with pre-built control mappings and continuous evidence collection replacing manual audit prep',
      'Cut helpdesk password reset tickets by 80% through self-service password management and SSO reducing authentication friction',
      'Gain complete visibility into who has access to what with real-time access graphs and automated detection of excessive permissions',
    ],
    pricing: {
      basic: '$3/user/mo',
      pro: '$7/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/identity-access-management-iam-service',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'shield-account',
    href: '/services/identity-access-management-iam-service',
    popular: true,
    category: 'it',
    industry: 'Identity Security',
    stage: 'published',
  },
];

// Micro-SaaS Services (2)
export const wave240MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-project-management-gantt-charts',
    title: 'Micro-SaaS Project Management & Gantt Charts',
    description:
      'Task management, interactive Gantt charts, resource allocation, time tracking, and client portals for project-driven teams.',
    features: [
      'Task management with Kanban boards, list views, custom fields, dependencies, subtasks, recurring tasks, and bulk editing for complex project structures',
      'Interactive Gantt chart builder with drag-and-drop scheduling, critical path visualization, milestone tracking, baseline comparison, and zoomable timeline views',
      'Resource allocation engine with workload heatmaps, capacity planning, skill-based assignment suggestions, and automatic overallocation alerts',
      'Time tracking with manual entry, automatic timers, timesheet approvals, billable vs non-billing hour categorization, and payroll-ready export formats',
      'Client portal providing external stakeholders with read-only project visibility, approval workflows, file sharing, and branded status dashboards',
      'Reporting suite with project health scores, budget vs actual tracking, earned value analysis, team velocity charts, and scheduled PDF report delivery',
    ],
    benefits: [
      'Deliver projects 25% faster with visual Gantt scheduling that reveals bottlenecks and dependency conflicts before they cause delays',
      'Eliminate resource overallocation and burnout with workload visibility that balances assignments across your entire team',
      'Increase billable utilization by 15% through accurate time tracking that captures every hour and connects it to the right project and client',
      'Impress clients with professional portals that provide real-time project transparency without exposing internal team discussions',
      'Replace three separate tools with one integrated platform reducing software costs and eliminating data silos between planning and execution',
    ],
    pricing: {
      basic: '$8/user/mo',
      pro: '$15/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/micro-saas-project-management-gantt-charts',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'chart-gantt',
    href: '/services/micro-saas-project-management-gantt-charts',
    category: 'micro-saas',
    industry: 'Project Management',
    stage: 'published',
  },
  {
    id: 'micro-saas-email-warmup-deliverability',
    title: 'Micro-SaaS Email Warmup & Deliverability',
    description:
      'Automated inbox warmup, spam testing, sender reputation monitoring, and blacklist checking to maximize email deliverability.',
    features: [
      'Automated inbox warmup that gradually increases sending volume with AI-generated human-like interactions across a network of real email accounts',
      'Spam testing engine that scores emails against 20+ major spam filters, checks content triggers, and provides actionable remediation suggestions',
      'Sender reputation monitoring tracking domain and IP reputation scores across Google Postmaster, Microsoft SNDS, and major ISP feedback loops',
      'Blacklist checking across 100+ DNSBLs and RBLs with instant alerts when listed and automated delisting request workflows',
      'Deliverability analytics dashboard with inbox placement rates, spam folder rates, bounce categorization, and engagement trend tracking',
      'Seed list testing that sends to real inboxes across Gmail, Outlook, Yahoo, and enterprise providers to verify actual inbox placement before campaigns',
    ],
    benefits: [
      'Achieve 98%+ inbox placement rates by warming up new domains and IPs gradually with realistic engagement patterns that ISPs trust',
      'Avoid costly blacklisting with real-time monitoring that catches reputation drops before they impact campaign delivery and revenue',
      'Increase email revenue by 20-40% by ensuring every campaign reaches the inbox instead of the spam folder where it generates zero ROI',
      'Save hours of manual testing with automated spam scoring that catches deliverability issues before you hit send',
      'Protect sender reputation with proactive alerts that warn you about sending pattern changes that trigger ISP throttling',
    ],
    pricing: {
      basic: '$49/mo',
      pro: '$99/mo',
      enterprise: '$199/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-email-warmup-deliverability',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'email-check',
    href: '/services/micro-saas-email-warmup-deliverability',
    category: 'micro-saas',
    industry: 'Email Marketing',
    stage: 'published',
  },
];
