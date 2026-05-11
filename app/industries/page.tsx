import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import Breadcrumb from '../components/Breadcrumb';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Industry Solutions | Zion Tech Group',
  description:
    'AI workflows tailored to your industry. Explore solutions for financial services, healthcare, ecommerce, manufacturing, legal, education, and 47 verticals.',
  alternates: { canonical: '/industries' },
};

type IndustrySolution = {
  industry: string;
  icon: string;
  headline: string;
  description: string;
  apps: string[];
  href: string;
};

const industries: IndustrySolution[] = [
  {
    industry: 'Financial Services',
    icon: '🏦',
    headline: 'Automate compliance and accelerate lending decisions',
    description:
      'Deploy fraud detection, risk scoring, and regulatory compliance workflows that reduce manual review time and increase approval accuracy.',
    apps: ['AI Fraud Detector', 'AI Financial Forecaster', 'Compliance Manager', 'AI Contract Analyzer'],
    href: '/solutions/financial-services',
  },
  {
    industry: 'Asset Management & Investment',
    icon: '📊',
    headline: 'Portfolio analytics, risk assessment, and compliance reporting',
    description:
      'Deploy AI-powered workflows for portfolio analytics, fraud detection, regulatory reporting, and client communications for wealth managers and investment firms.',
    apps: ['AI Financial Forecaster', 'AI Fraud Detector', 'AI Risk Assessor', 'Compliance Manager'],
    href: '/solutions/asset-management',
  },
  {
    industry: 'Healthcare',
    icon: '🏥',
    headline: 'Streamline records and improve patient communication',
    description:
      'Digitize medical records, automate appointment scheduling, and build AI-assisted patient intake flows with full HIPAA compliance.',
    apps: ['Medical Records Manager', 'AI Document Processor', 'AI Chatbot Builder', 'Security Shield'],
    href: '/solutions/healthcare',
  },
  {
    industry: 'E-Commerce & Retail',
    icon: '🛒',
    headline: 'Personalize shopping and optimize supply chains',
    description:
      'Drive higher conversion with AI-powered recommendations, demand forecasting, and inventory optimization across channels.',
    apps: ['Ecommerce Analytics Pro', 'Smart Inventory Manager', 'AI Sales Predictor', 'AI Marketing Automation'],
    href: '/solutions/ecommerce-retail',
  },
  {
    industry: 'Real Estate & Property',
    icon: '🏠',
    headline: 'Automate property ops and tenant engagement',
    description:
      'Manage listings, automate tenant communications, and generate property performance reports with AI-driven workflows.',
    apps: ['Property Management AI', 'AI Document Processor', 'AI Chatbot Builder', 'Invoice Genius'],
    href: '/solutions/real-estate-property',
  },
  {
    industry: 'Legal & Professional Services',
    icon: '⚖️',
    headline: 'Accelerate contract review and case management',
    description:
      'Reduce time spent on document review, automate client intake, and surface risk clauses with AI-powered legal analysis.',
    apps: ['Legal Document Manager', 'AI Contract Analyzer', 'AI Document Analyzer', 'Compliance Manager'],
    href: '/solutions/legal-professional-services',
  },
  {
    industry: 'Education & Training',
    icon: '🎓',
    headline: 'Scale personalized learning experiences',
    description:
      'Deliver adaptive coursework, automate grading workflows, and generate engagement analytics for learners at any scale.',
    apps: ['Online Learning Platform', 'AI Knowledge Base', 'AI Survey Builder', 'AI Report Generator'],
    href: '/solutions/education-training',
  },
  {
    industry: 'Manufacturing & Industrial',
    icon: '🏭',
    headline: 'Optimize production and predictive maintenance',
    description:
      'Reduce downtime with predictive maintenance, optimize supply chains, and automate quality assurance with AI-powered workflows.',
    apps: ['AI Predictive Maintenance', 'Supply Chain Optimizer', 'AI Quality Assurance', 'AI Document Processor'],
    href: '/solutions/manufacturing-industrial',
  },
  {
    industry: 'Logistics & Supply Chain',
    icon: '📦',
    headline: 'Streamline fulfillment and inventory operations',
    description:
      'Improve demand forecasting, reduce bottlenecks, and automate logistics workflows across warehouses and carriers.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'AI Sales Predictor', 'Workflow Automation'],
    href: '/solutions/logistics-supply-chain',
  },
  {
    industry: 'Technology & SaaS',
    icon: '💻',
    headline: 'Accelerate product development and go-to-market',
    description:
      'Scale engineering velocity, automate customer onboarding, and optimize conversion with AI-powered product workflows.',
    apps: ['AI Code Assistant', 'AI Onboarding Pro', 'AI SEO Optimizer', 'AI Website Analyzer'],
    href: '/solutions/technology-and-saas',
  },
  {
    industry: 'Media & Entertainment',
    icon: '🎬',
    headline: 'Scale content creation and audience engagement',
    description:
      'Automate content workflows, personalize experiences, and analyze audience behavior with AI-driven tools.',
    apps: ['Content Studio', 'AI Video Generator', 'AI Image Generator', 'AI Marketing Automation'],
    href: '/solutions/media-entertainment',
  },
  {
    industry: 'Energy & Utilities',
    icon: '⚡',
    headline: 'Optimize energy consumption and asset performance',
    description:
      'Deploy predictive maintenance, demand forecasting, and energy management with AI-driven insights.',
    apps: ['AI Energy Manager', 'AI Predictive Maintenance', 'AI Data Pipeline', 'Compliance Manager'],
    href: '/solutions/energy-utilities',
  },
  {
    industry: 'Government & Public Sector',
    icon: '🏛️',
    headline: 'Streamline citizen services and compliance',
    description:
      'Automate document processing, citizen intake, and regulatory reporting with secure, audit-ready workflows.',
    apps: ['AI Document Processor', 'AI Contract Analyzer', 'Compliance Manager', 'Security Shield'],
    href: '/solutions/government-and-public-sector',
  },
  {
    industry: 'Insurance',
    icon: '🛡️',
    headline: 'Streamline claims processing and risk assessment',
    description:
      'Automate claims intake, fraud detection, and policy analysis with AI-powered workflows that reduce manual review and improve accuracy.',
    apps: ['AI Document Processor', 'AI Fraud Detector', 'AI Contract Analyzer', 'AI Risk Assessor'],
    href: '/solutions/insurance',
  },
  {
    industry: 'Agriculture & Agritech',
    icon: '🌾',
    headline: 'Optimize yield prediction and farm operations',
    description:
      'Deploy AI for crop monitoring, demand forecasting, supply chain optimization, and resource planning across agricultural workflows.',
    apps: ['AI Predictive Analytics', 'Supply Chain Optimizer', 'AI Data Pipeline', 'Smart Inventory Manager'],
    href: '/solutions/agriculture-agritech',
  },
  {
    industry: 'Banking & Capital Markets',
    icon: '🏛️',
    headline: 'Automate AML, fraud detection, and regulatory reporting',
    description:
      'Deploy AI-powered fraud detection, risk scoring, and compliance workflows for KYC, AML, and regulatory reporting.',
    apps: ['AI Fraud Detector', 'AI Risk Assessor', 'Compliance Manager', 'AI Contract Analyzer'],
    href: '/solutions/banking-and-capital-markets',
  },
  {
    industry: 'Telecommunications',
    icon: '📡',
    headline: 'Optimize network operations and customer experience',
    description:
      'Deploy predictive maintenance for infrastructure, automate customer support, and improve demand forecasting with AI-driven analytics.',
    apps: ['AI Predictive Maintenance', 'AI Chatbot Builder', 'AI Customer Support Pro', 'AI Data Pipeline'],
    href: '/solutions/telecommunications',
  },
  {
    industry: 'Automotive & Mobility',
    icon: '🚗',
    headline: 'Streamline supply chain, quality, and fleet operations',
    description:
      'Optimize parts inventory, predict equipment failures, automate quality assurance, and improve logistics with AI-powered workflows.',
    apps: ['AI Supply Chain Optimizer', 'AI Predictive Maintenance', 'AI Quality Assurance', 'Smart Inventory Manager'],
    href: '/solutions/automotive-mobility',
  },
  {
    industry: 'Renewable Energy & Cleantech',
    icon: '🌱',
    headline: 'Optimize grid performance and asset forecasting',
    description:
      'Improve renewable asset performance, demand forecasting, and sustainability reporting with AI-driven analytics.',
    apps: ['AI Energy Manager', 'AI Predictive Analytics', 'AI Report Generator', 'AI Data Pipeline'],
    href: '/solutions/renewable-energy-cleantech',
  },
  {
    industry: 'Packaging & Materials',
    icon: '📦',
    headline: 'Optimize packaging design and supply chain efficiency',
    description:
      'Deploy AI for demand forecasting, sustainable packaging optimization, and automated quality control across packaging and materials operations.',
    apps: ['AI Predictive Analytics', 'Supply Chain Optimizer', 'AI Quality Assurance', 'Smart Inventory Manager'],
    href: '/solutions/packaging-materials',
  },
  {
    industry: 'Warehousing & 3PL',
    icon: '🏭',
    headline: 'Streamline fulfillment and third-party logistics',
    description:
      'Automate warehouse operations, optimize pick-and-pack workflows, and improve carrier coordination with AI-powered logistics intelligence.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'Workflow Automation', 'AI Document Processor'],
    href: '/solutions/warehousing-3pl',
  },
  {
    industry: 'Mining & Natural Resources',
    icon: '⛏️',
    headline: 'Optimize extraction and supply chain workflows',
    description:
      'Deploy AI for equipment health monitoring, predictive maintenance, demand forecasting, and compliance reporting in mining and natural resources.',
    apps: ['Supply Chain Optimizer', 'AI Predictive Maintenance', 'AI Quality Assurance', 'AI Document Processor'],
    href: '/solutions/mining-natural-resources',
  },
  {
    industry: 'Food & Beverage',
    icon: '🍽️',
    headline: 'Demand forecasting and inventory optimization',
    description:
      'Reduce waste, improve shelf-life management, and automate regulatory reporting with AI-powered demand forecasting and inventory workflows.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'AI Sales Predictor', 'Compliance Manager'],
    href: '/solutions/food-beverage',
  },
  {
    industry: 'Veterinary & Animal Health',
    icon: '🐾',
    headline: 'Appointment scheduling and client communications',
    description:
      'Reduce no-shows, automate reminders, and streamline patient intake with AI-powered scheduling and client engagement tools.',
    apps: ['AI Scheduling Assistant', 'AI Document Processor', 'Smart Inventory Manager', 'AI Chatbot Builder'],
    href: '/solutions/veterinary-animal-health',
  },
  {
    industry: 'Home Services & Contractors',
    icon: '🔧',
    headline: 'Route optimization and technician scheduling',
    description:
      'Improve dispatch efficiency and reduce drive time with AI-powered route optimization, scheduling, and job dispatching for HVAC and plumbing.',
    apps: ['AI Scheduling Assistant', 'Supply Chain Optimizer', 'Smart Inventory Manager', 'Workflow Automation'],
    href: '/solutions/home-services-contractors',
  },
  {
    industry: 'Hospitality & Travel',
    icon: '✈️',
    headline: 'Personalize guest experiences and optimize operations',
    description:
      'Improve booking flows, automate guest communications, and analyze demand patterns with AI-powered tools.',
    apps: ['AI Chatbot Builder', 'AI Customer Support Pro', 'AI Sales Predictor', 'Smart CRM Automation'],
    href: '/solutions/hospitality-travel',
  },
  {
    industry: 'Non-Profit & Social Impact',
    icon: '🤝',
    headline: 'Scale outreach and donor engagement efficiently',
    description:
      'Automate donor communications, manage volunteer coordination, and generate impact reports with limited resources.',
    apps: ['AI Email Marketing Pro', 'AI Survey Builder', 'AI Report Generator', 'Project Master'],
    href: '/solutions/non-profit-social-impact',
  },
  {
    industry: 'Construction & Engineering',
    icon: '🏗️',
    headline: 'Streamline project management and cost estimation',
    description:
      'Automate document workflows, project tracking, resource allocation, and compliance reporting for construction and engineering firms.',
    apps: ['Project Master', 'AI Document Processor', 'AI Contract Analyzer', 'Compliance Manager'],
    href: '/solutions/construction-engineering',
  },
  {
    industry: 'Pharmaceuticals & Life Sciences',
    icon: '🧪',
    headline: 'Accelerate trial data, regulatory submissions, and quality control',
    description:
      'Streamline document workflows for regulatory filings, automate quality assurance checks, and improve data integrity with AI-powered compliance.',
    apps: ['AI Document Processor', 'AI Quality Assurance', 'Compliance Manager', 'AI Contract Analyzer'],
    href: '/solutions/pharmaceuticals-life-sciences',
  },
  {
    industry: 'Aerospace & Defense',
    icon: '✈️',
    headline: 'Secure documentation, compliance, and supply chain visibility',
    description:
      'Deploy ITAR-compliant document workflows, predictive maintenance for critical assets, and supply chain optimization with audit-ready controls.',
    apps: ['AI Document Processor', 'AI Contract Analyzer', 'Compliance Manager', 'AI Predictive Maintenance'],
    href: '/solutions/aerospace-defense',
  },
  {
    industry: 'Maritime & Shipping',
    icon: '🚢',
    headline: 'Optimize fleet operations and port logistics',
    description:
      'Improve vessel maintenance scheduling, cargo forecasting, customs documentation, and port coordination with AI-driven logistics workflows.',
    apps: ['Supply Chain Optimizer', 'AI Predictive Maintenance', 'AI Document Processor', 'Smart Inventory Manager'],
    href: '/solutions/maritime-shipping',
  },
  {
    industry: 'Oil & Gas',
    icon: '🛢️',
    headline: 'Streamline asset operations and regulatory compliance',
    description:
      'Optimize predictive maintenance for equipment, automate compliance reporting, and improve supply chain visibility across upstream and downstream operations.',
    apps: ['AI Predictive Maintenance', 'AI Document Processor', 'Compliance Manager', 'AI Data Pipeline'],
    href: '/solutions/oil-gas',
  },
  {
    industry: 'Environmental & Waste Management',
    icon: '♻️',
    headline: 'Optimize recycling, emissions reporting, and sustainability',
    description:
      'Streamline ESG reporting, waste route optimization, emissions tracking, and compliance documentation with AI-driven environmental workflows.',
    apps: ['AI Report Generator', 'Compliance Manager', 'AI Data Pipeline', 'AI Predictive Analytics'],
    href: '/solutions/environmental-waste-management',
  },
  {
    industry: 'Gaming & Esports',
    icon: '🎮',
    headline: 'Scale content moderation and player analytics',
    description:
      'Deploy AI-powered content moderation, fraud detection, and community analytics for gaming platforms and esports organizations.',
    apps: ['AI Content Moderator', 'AI Fraud Detector', 'AI Chatbot Builder', 'Smart Analytics Dashboard'],
    href: '/solutions/gaming-esports',
  },
  {
    industry: 'Sports & Fitness',
    icon: '🏃',
    headline: 'Enhance member engagement and retention',
    description:
      'Deploy AI-powered member analytics, personalized recommendations, and automated engagement workflows for gyms, fitness apps, and wellness platforms.',
    apps: ['AI Chatbot Builder', 'AI Customer Sentiment Tracker', 'Smart Analytics Dashboard', 'AI Marketing Automation'],
    href: '/solutions/sports-fitness',
  },
  {
    industry: 'Consumer Goods & CPG',
    icon: '📦',
    headline: 'Optimize demand forecasting and retail execution',
    description:
      'Improve shelf availability, demand planning, and trade promotion analytics with AI-driven forecasting and supply chain optimization.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'Supply Chain Optimizer', 'AI Data Pipeline'],
    href: '/solutions/consumer-goods-cpg',
  },
  {
    industry: 'Transportation & Fleet',
    icon: '🚛',
    headline: 'Optimize fleet operations and last-mile delivery',
    description:
      'Deploy route optimization, driver scheduling, predictive maintenance, and demand forecasting for transportation and fleet management operations.',
    apps: ['Supply Chain Optimizer', 'AI Predictive Maintenance', 'AI Scheduling Assistant', 'AI Data Pipeline'],
    href: '/solutions/transportation-fleet',
  },
  {
    industry: 'Marketing & Advertising',
    icon: '📢',
    headline: 'Scale campaign execution and creative analytics',
    description:
      'Automate campaign workflows, optimize ad spend, personalize creative delivery, and measure ROI with AI-driven marketing intelligence.',
    apps: ['AI Marketing Automation', 'Content Studio', 'AI Data Visualizer', 'AI Lead Scoring'],
    href: '/solutions/marketing-advertising',
  },
  {
    industry: 'Chemicals & Materials',
    icon: '🧪',
    headline: 'Optimize supply chain, quality control, and sustainability compliance',
    description:
      'Deploy demand forecasting, batch traceability, regulatory reporting, and supply chain optimization for chemical and materials manufacturers.',
    apps: ['Supply Chain Optimizer', 'AI Quality Assurance', 'Compliance Manager', 'AI Data Pipeline'],
    href: '/solutions/chemicals-materials',
  },
  {
    industry: 'Electronics & Semiconductors',
    icon: '🔌',
    headline: 'Streamline yield optimization and supply chain visibility',
    description:
      'Improve demand forecasting, predictive maintenance for equipment, quality assurance, and compliance workflows for electronics and semiconductor operations.',
    apps: ['AI Predictive Maintenance', 'AI Quality Assurance', 'Supply Chain Optimizer', 'AI Data Pipeline'],
    href: '/solutions/electronics-semiconductors',
  },
  {
    industry: 'Space & Satellite',
    icon: '🛰️',
    headline: 'Optimize orbital operations and ground station management',
    description:
      'Deploy AI for satellite health monitoring, ground station scheduling, orbital analytics, and mission planning with predictive maintenance and data pipeline workflows.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator', 'Compliance Manager'],
    href: '/solutions/space-satellite',
  },
  {
    industry: 'Textiles & Apparel',
    icon: '👕',
    headline: 'Optimize demand forecasting and sustainable supply chains',
    description:
      'Improve seasonal demand planning, raw material sourcing, inventory optimization, and sustainability compliance for textile and apparel manufacturers and retailers.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'Supply Chain Optimizer', 'Compliance Manager'],
    href: '/solutions/textiles-apparel',
  },
  {
    industry: 'Accounting & Tax Services',
    icon: '📒',
    headline: 'Automate bookkeeping, reconciliation, and tax workflows',
    description:
      'Streamline document intake, automate reconciliation, generate financial reports, and manage compliance workflows for accounting firms and tax preparers.',
    apps: ['AI Accounting Assistant', 'AI Document Processor', 'Invoice Genius', 'Compliance Manager'],
    href: '/solutions/accounting-tax-services',
  },
  {
    industry: 'Wholesale & Distribution',
    icon: '📦',
    headline: 'Optimize inventory, fulfillment, and multi-channel distribution',
    description:
      'Deploy demand forecasting, warehouse optimization, order fulfillment automation, and B2B analytics for wholesalers and distributors.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'AI Sales Predictor', 'Workflow Automation'],
    href: '/solutions/wholesale-distribution',
  },
  {
    industry: 'Restaurants & Food Service',
    icon: '🍴',
    headline: 'Optimize demand forecasting and operational workflows',
    description:
      'Deploy demand prediction, inventory optimization, scheduling automation, and compliance tracking for restaurants, catering, and food service operations.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'AI Scheduling Assistant', 'Compliance Manager'],
    href: '/solutions/restaurants-food-service',
  },
  {
    industry: 'Staffing & Recruiting',
    icon: '👥',
    headline: 'Accelerate candidate sourcing and placement',
    description:
      'Automate candidate screening, pipeline management, and client engagement with AI-powered recruitment workflows for staffing agencies and talent teams.',
    apps: ['AI Recruitment Pro', 'AI Talent Analytics', 'AI Lead Scoring', 'Workflow Automation'],
    href: '/solutions/staffing-recruiting',
  },
  {
    industry: 'Facilities & Property Management',
    icon: '🏢',
    headline: 'Optimize maintenance and tenant services',
    description:
      'Deploy work order automation, preventive maintenance scheduling, and tenant request workflows for commercial and multi-site property portfolios.',
    apps: ['AI Scheduling Assistant', 'AI Predictive Maintenance', 'AI Document Processor', 'AI Chatbot Builder'],
    href: '/solutions/facilities-property-management',
  },
];

const industriesFaq = [
  {
    q: 'Do you support regulated industries like healthcare and finance?',
    a: 'Yes. We deliver HIPAA, SOC 2, GDPR, and sector-specific compliance support for healthcare, financial services, insurance, and government. Security and audit trails are built into delivery from day one.',
  },
  {
    q: 'Can I combine solutions from multiple industries?',
    a: 'Absolutely. Many clients run cross-functional workflows — for example, document processing (legal) plus CRM automation (sales) plus compliance (finance). We help you map the right app mix to your goals.',
  },
  {
    q: "My industry isn't listed. Can you still help?",
    a: 'Yes. Our team can map your workflows to the right Zion apps, integration architecture, and delivery plan. Book a discovery call to discuss your vertical and use cases.',
  },
];

export default function IndustriesPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Industries' }]} className="mb-6" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Industry Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI workflows tailored to your industry
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Every vertical has unique workflows, compliance requirements, and integration needs.
            Explore how Zion apps map to your industry — from healthcare and financial services to manufacturing, retail, and 40+ more.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Each industry solution includes tailored app combinations, use-case playbooks, and case studies so you can scope, pilot, and scale with confidence.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Book a Discovery Call →
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              Browse All Solutions
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Why industry-specific AI
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Every vertical has unique workflows
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Generic AI tools fall short when workflows, compliance, and integration needs vary by industry. 
            Our solutions map to your vertical&apos;s specific workflows — from compliance to customer engagement to supply chain.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Workflow Mapping</h3>
              <p className="mt-2 text-sm text-slate-300">
                Apps are tailored to your industry&apos;s processes, approvals, and handoffs — not generic templates.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Compliance & Audit</h3>
              <p className="mt-2 text-sm text-slate-300">
                HIPAA, SOC 2, GDPR, and industry-specific regulations built in from day one.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <h3 className="font-semibold text-white">Integration Ready</h3>
              <p className="mt-2 text-sm text-slate-300">
                Pre-built connectors for common tools in your vertical. Faster deployment, fewer custom integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((ind) => (
            <div
              key={ind.industry}
              className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-400/40"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-slate-700 bg-slate-950/70 p-2.5 text-3xl">
                  {ind.icon}
                </span>
                <h2 className="text-lg font-semibold text-white">{ind.industry}</h2>
              </div>
              <p className="mt-2 text-sm font-medium text-purple-300">{ind.headline}</p>
              <p className="mt-2 text-sm text-slate-300">{ind.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ind.apps.map((app) => (
                  <span
                    key={app}
                    className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {app}
                  </span>
                ))}
              </div>
              <a
                href={ind.href}
                className="mt-5 inline-flex text-sm font-semibold text-purple-300 transition hover:text-purple-200"
              >
                Explore solutions →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            From discovery to production
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We map your goals to the right Zion apps, integration architecture, and delivery plan — regardless of your vertical.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">Step 1</span>
              <h3 className="mt-3 font-semibold text-white">Discovery</h3>
              <p className="mt-2 text-sm text-slate-300">Map your workflows and identify highest-value use cases.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">Step 2</span>
              <h3 className="mt-3 font-semibold text-white">App Selection</h3>
              <p className="mt-2 text-sm text-slate-300">Choose the right Zion apps for your industry and goals.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">Step 3</span>
              <h3 className="mt-3 font-semibold text-white">Pilot</h3>
              <p className="mt-2 text-sm text-slate-300">Launch a scoped pilot with clear KPIs and integration checkpoints.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-100">Step 4</span>
              <h3 className="mt-3 font-semibold text-white">Scale</h3>
              <p className="mt-2 text-sm text-slate-300">Expand across departments with runbooks and team handoff.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Industry solutions FAQ</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-300">
            Common questions about industry-specific AI and how we deliver across verticals.
          </p>
          <dl className="mt-6 space-y-6">
            {industriesFaq.map((faq) => (
              <div key={faq.q} className="border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                <dt className="text-base font-semibold text-white">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-300">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/35 via-fuchsia-900/25 to-pink-900/35 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Don&#39;t see your industry?</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-200">
            Our team can map your goals to the right app modules, integration architecture, and
            delivery plan — regardless of your vertical.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
             data-cta-event="cta_discovery" data-cta-label="page">
              Talk to a Specialist
            </a>
            <a
              href="/solutions"
              className="inline-flex items-center rounded-xl border border-slate-500/70 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/60 hover:text-white"
            >
              Browse All Apps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
