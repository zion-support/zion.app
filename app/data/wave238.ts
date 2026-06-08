import { Service } from './serviceTypes';

// =============================================================================
// Wave 238 — Services
// =============================================================================
// AI Services (2)
export const wave238AiServices: Service[] = [
  {
    id: 'ai-real-estate-valuation-market-analysis',
    title: 'AI-Powered Real Estate Valuation & Market Analysis',
    description:
      'Automated property valuation, market trend analysis, investment scoring, rental yield prediction.',
    features: [
      'Automated property valuation using ML models trained on millions of comparable sales across local, regional, and national markets',
      'Real-time market trend analysis with price momentum indicators, supply-demand forecasts, and neighborhood-level heatmaps',
      'Investment scoring engine that rates properties on ROI potential, risk exposure, cap rate, and cash-on-cash return projections',
      'Rental yield prediction powered by rental comp vacancy modeling, seasonal demand trends, and economic leading indicators',
      'Portfolio dashboard with drill-down analytics, scenario modeling, side-by-side property comparison, and custom alert thresholds',
      'API access for CRM/MLS integration webhook event support bulk valuation batches automated appraisal report generation',
    ],
    benefits: [
      'Reduce valuation time from days to seconds with 95%+ accuracy compared to traditional appraisal methods',
      'Identify undervalued properties and emerging hot spots before competitors by leveraging predictive market signals',
      'Make data-driven investment decisions backed by machine learning rather than gut instinct and stale comps',
      'Maximize rental income with optimized pricing strategies calibrated to real-time local market conditions',
      'Scale your analysis across thousands of properties without hiring additional analysts or appraisers',
    ],
    pricing: {
      basic: '$1,499/mo',
      pro: '$3,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-real-estate-valuation-market-analysis',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'home-analytics',
    href: '/services/ai-real-estate-valuation-market-analysis',
    popular: true,
    category: 'ai',
    industry: 'Real Estate',
    stage: 'published',
  },
  {
    id: 'ai-supply-chain-carbon-footprint-tracker',
    title: 'AI Supply Chain Carbon Footprint Tracker',
    description:
      'Track emissions across supply chain, Scope 1/2/3 reporting, reduction recommendations, compliance.',
    features: [
      'End-to-end supply chain emissions tracking across raw materials, manufacturing, logistics, and last-mile delivery tiers',
      'Automated Scope 1, 2, and 3 GHG Protocol reporting with audit-ready documentation and third-party assured verification',
      'AI-driven reduction recommendations that model cost-benefit of alternative materials, routes, suppliers, and energy sources',
      'Regulatory compliance engine covering EU CSRD CDP questionnaires SEC climate disclosures and regional carbon tax frameworks',
      'Supplier scorecards with real-time ESG benchmarking trend tracking automated outlier flagging and engagement workflows',
      'Scenario simulation sandbox for testing decarbonization strategies and reporting projected carbon savings to stakeholders',
    ],
    benefits: [
      'Eliminate manual spreadsheets and data gaps with automated carbon accounting across your entire value chain',
      'Stay ahead of regulatory deadlines with always-up-to-date compliance templates and automated filing workflows',
      'Reduce carbon emissions by an average of 20% in year one through AI-identified optimization opportunities',
      'Strengthen supplier relationships with transparent scorecards that drive collaborative sustainability improvements',
      'Future-proof your business against carbon border taxes and ESG-linked financing requirements',
    ],
    pricing: {
      basic: '$899/mo',
      pro: '$2,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-supply-chain-carbon-footprint-tracker',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'leaf-network',
    href: '/services/ai-supply-chain-carbon-footprint-tracker',
    category: 'ai',
    industry: 'Sustainability/Supply Chain',
    stage: 'published',
  },
];

// IT Services (1)
export const wave238ItServices: Service[] = [
  {
    id: 'multi-cloud-cost-management-governance',
    title: 'Multi-Cloud Cost Management & Governance',
    description:
      'AWS/Azure/GCP cost optimization, tagging governance, reserved instance planning, chargeback.',
    features: [
      'Unified multi-cloud cost dashboard aggregating AWS, Azure, and GCP billing with normalized metrics and custom tagging views',
      'Intelligent tagging governance policy enforcement auto-remediation drift detection and organizational tag compliance scoring',
      'Reserved instance and savings plan planning with commitment recommendation churn forecasting and amortized cost allocation',
      'Showback and chargeback automation with department-level business unit and project-level cost allocation and invoice generation',
      'Anomaly detection alerts that flag unexpected spend spikes resource waste unattended resources and misconfigured services',
      'FinOps governance workflows including approval chains budget thresholds policy-as-code templates and executive summary reporting',
    ],
    benefits: [
      'Reduce cloud spend by 30% on average through right-sizing recommendations and elimination of idle resources',
      'Eliminate billing surprises with real-time budget tracking automated alerts and predictive monthly spend forecasting',
      'Achieve 100% tagging compliance across all cloud accounts simplifying cost allocation and audit readiness',
      'Empower engineering teams with self-service cost visibility while maintaining centralized governance guardrails',
      'Optimize reserved commitment portfolios saving an additional 15-20% beyond on-demand rate reductions',
    ],
    pricing: {
      basic: '$1,299/mo',
      pro: '$3,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/multi-cloud-cost-management-governance',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'cloud-cog',
    href: '/services/multi-cloud-cost-management-governance',
    popular: true,
    category: 'it',
    industry: 'Cloud Operations',
    stage: 'published',
  },
];

// Micro-SaaS Services (2)
export const wave238MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-customer-feedback-review-manager',
    title: 'Micro-SaaS Customer Feedback & Review Manager',
    description:
      'Collect reviews, respond at scale, sentiment analysis, review monitoring.',
    features: [
      'Automated review collection via customizable email and SMS campaigns triggered by purchase milestones and support resolutions',
      'Bulk AI-powered response generation with brand-voice calibration multi-language support and one-click approval workflows',
      'Real-time sentiment analysis dashboard tracking NPS emerging themes and customer satisfaction trends across all channels',
      'Multi-platform review monitoring aggregation with Google Yelp TripAdvisor G2 Capterra and custom site widgets',
      'Review response templates with smart personalization tokens escalation rules and team assignment round-robin routing',
      'Reporting suite with response time benchmarks review volume trends competitor comparison and exportable client-ready PDF reports',
    ],
    benefits: [
      'Increase review volume by 3x with automated post-purchase collection campaigns that ask at exactly the right moment',
      'Maintain a consistent brand voice across hundreds of responses while cutting response drafting time by 90%',
      'Detect and resolve negative sentiment early before it escalates into public PR crises or churn',
      'Boost your average star rating by systematically addressing gaps and doubling down on what customers love',
      'Save 15+ hours per week by replacing manual review monitoring with automated alerts and AI-drafted responses',
    ],
    pricing: {
      basic: '$39/mo',
      pro: '$89/mo',
      enterprise: '$199/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-customer-feedback-review-manager',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'star-comment',
    href: '/services/micro-saas-customer-feedback-review-manager',
    category: 'micro-saas',
    industry: 'Customer Experience',
    stage: 'published',
  },
  {
    id: 'micro-saas-team-okr-goal-tracker',
    title: 'Micro-SaaS Team OKR & Goal Tracker',
    description:
      'Set OKRs, track progress, alignment mapping, weekly check-ins.',
    features: [
      'Collaborative OKR builder with guided creation templates progress tracking confidence scoring and automated status color-coding',
      'Alignment mapping visualization showing how team OKRs ladder into department and company objectives with dependency highlighting',
      'Structured weekly check-in forms with blockers section wins highlight and next-week commitment tracking',
      'Automated nudges and reminders for overdue check-ins stale OKRs and approaching deadline warnings',
      'Progress dashboards with burndown charts historical trend views team velocity metrics and executive summary snapshots',
      'Integrations with Slack Monday Jira GSuite and Teams for inline goal updates and check-in prompts without context switching',
    ],
    benefits: [
      'Achieve 80%+ OKR completion rates by replacing ad-hoc tracking with structured weekly accountability rituals',
      'Create organizational alignment where every team member understands how their work connects to company strategy',
      'Reduce meeting time by 40% by moving status updates into asynchronous check-ins auto-synced to leadership dashboards',
      'Catch at-risk objectives early with automated confidence scoring before they become end-of-quarter surprises',
      'Foster a goal-oriented culture with visible progress tracking that motivates teams and celebrates milestone wins',
    ],
    pricing: {
      basic: '$5/user/mo',
      pro: '$10/user/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/micro-saas-team-okr-goal-tracker',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'target-account',
    href: '/services/micro-saas-team-okr-goal-tracker',
    category: 'micro-saas',
    industry: 'Team Management',
    stage: 'published',
  },
];
