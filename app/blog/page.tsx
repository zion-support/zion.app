import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on AI, automation, enterprise IT, and digital transformation from the Zion Tech Group team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Zion Tech Group',
    description: 'Insights on AI, automation, enterprise IT, and digital transformation.',
    type: 'website',
    url: 'https://ziontechgroup.com/blog',
    siteName: 'Zion Tech Group',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Zion Tech Group',
    description: 'Insights on AI, automation, enterprise IT, and digital transformation.',
  },
};

export default function BlogIndexPage() {
  const POSTS = [
    { slug: '5-proven-ai-automation-strategies-for-enterprise-workflow-optimization', title: '5 Proven AI Automation Strategies for Enterprise Workflow Optimization' },
    { slug: 'ai-agent-frameworks-for-business-automation', title: 'AI Agent Frameworks for Business Automation' },
    { slug: 'ai-finops-and-cloud-cost-optimization-with-machine-learning', title: 'AI FinOps: Cloud Cost Optimization with Machine Learning' },
    { slug: 'ai-for-audit-and-compliance-automation', title: 'AI for Audit and Compliance Automation' },
    { slug: 'ai-for-compliance-and-regulatory-reporting', title: 'AI for Compliance and Regulatory Reporting' },
    { slug: 'ai-for-conversation-and-customer-analytics', title: 'AI for Conversation and Customer Analytics' },
    { slug: 'ai-for-customer-service-and-support-automation', title: 'AI for Customer Service and Support Automation' },
    { slug: 'ai-for-cybersecurity-operations-and-threat-hunting', title: 'AI for Cybersecurity Operations and Threat Hunting' },
    { slug: 'ai-for-cybersecurity-threat-detection', title: 'AI for Cybersecurity Threat Detection' },
    { slug: 'ai-for-digital-transformation-and-change-management', title: 'AI for Digital Transformation and Change Management' },
    { slug: 'ai-for-fintech-and-digital-banking-operations', title: 'AI for Fintech and Digital Banking Operations' },
    { slug: 'ai-for-fleet-and-logistics-operations', title: 'AI for Fleet and Logistics Operations' },
    { slug: 'ai-for-fleet-management-and-logistics-optimization', title: 'AI for Fleet Management and Logistics Optimization' },
    { slug: 'ai-for-government-services-and-public-sector-automation', title: 'AI for Government Services and Public Sector Automation' },
    { slug: 'ai-for-healthcare-analytics-and-clinical-decision-support', title: 'AI for Healthcare Analytics and Clinical Decision Support' },
    { slug: 'ai-for-hr-and-talent-acquisition-streamlining-recruitment', title: 'AI for HR and Talent Acquisition: Streamlining Recruitment' },
    { slug: 'ai-for-insurance-claims-and-underwriting', title: 'AI for Insurance Claims and Underwriting' },
    { slug: 'ai-for-insurance-underwriting-and-claims-automation', title: 'AI for Insurance Underwriting and Claims Automation' },
    { slug: 'ai-for-media-and-content-production', title: 'AI for Media and Content Production' },
    { slug: 'ai-for-procurement-and-vendor-management', title: 'AI for Procurement and Vendor Management' },
    { slug: 'ai-for-product-development-and-innovation', title: 'AI for Product Development and Innovation' },
    { slug: 'ai-for-real-estate-and-property-management', title: 'AI for Real Estate and Property Management' },
    { slug: 'ai-for-retail-analytics-and-personalization', title: 'AI for Retail Analytics and Personalization' },
    { slug: 'ai-for-sales-enablement-and-revenue-operations', title: 'AI for Sales Enablement and Revenue Operations' },
    { slug: 'ai-for-warehousing-and-inventory-optimization', title: 'AI for Warehousing and Inventory Optimization' },
    { slug: 'ai-in-aviation-and-aerospace-operations', title: 'AI in Aviation and Aerospace Operations' },
    { slug: 'ai-in-construction-and-project-management', title: 'AI in Construction and Project Management' },
    { slug: 'ai-in-education-and-learning-systems', title: 'AI in Education and Learning Systems' },
    { slug: 'ai-in-pharmaceuticals-and-life-sciences', title: 'AI in Pharmaceuticals and Life Sciences' },
    { slug: 'ai-in-supply-chain-predictive-inventory-and-demand-forecasting', title: 'AI in Supply Chain: Predictive Inventory and Demand Forecasting' },
    { slug: 'ai-in-sustainability-and-esg-reporting', title: 'AI in Sustainability and ESG Reporting' },
    { slug: 'ai-observability-and-mlops-best-practices', title: 'AI Observability and MLOps Best Practices' },
    { slug: 'ai-powered-customer-success-reducing-churn-and-driving-expansion', title: 'AI-Powered Customer Success: Reducing Churn and Driving Expansion' },
    { slug: 'building-a-tailored-implementation-roadmap-from-proof-of-concept-to-full-deployment', title: 'Building a Tailored Implementation Roadmap: From Proof of Concept to Full Deployment' },
    { slug: 'crm-automation-trends-2026-ai-driven-customer-journey-personalization', title: 'CRM Automation Trends 2026: AI-Driven Customer Journey Personalization' },
    { slug: 'devops-automation-with-ai-reducing-deployment-failures-by-60', title: 'DevOps Automation with AI: Reducing Deployment Failures by 60%' },
    { slug: 'edge-ai-and-iot-deploying-models-at-the-edge', title: 'Edge AI and IoT: Deploying Models at the Edge' },
    { slug: 'generative-ai-for-content-and-creative-workflows', title: 'Generative AI for Content and Creative Workflows' },
    { slug: 'low-code-and-no-code-ai-for-rapid-deployment', title: 'Low-Code and No-Code AI for Rapid Deployment' },
    { slug: 'multimodal-ai-vision-and-language-models-in-enterprise', title: 'Multimodal AI: Vision and Language Models in Enterprise' },
    { slug: 'rag-for-enterprise-knowledge-bases', title: 'RAG for Enterprise Knowledge Bases' },
    { slug: 'responsible-ai-practices-for-enterprise-deployment', title: 'Responsible AI Practices for Enterprise Deployment' },
    { slug: 'securing-ai-models-a-practical-guide-to-threat-mitigation-in-production', title: 'Securing AI Models: A Practical Guide to Threat Mitigation in Production' },
    { slug: 'vector-databases-and-enterprise-rag-systems', title: 'Vector Databases and Enterprise RAG Systems' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-[-10rem] h-[32rem] w-[32rem] rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="mb-16 text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
            Insights &amp; Resources
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Zion Tech Group Blog
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {POSTS.length} articles on AI, enterprise automation, IT infrastructure,
            cloud architecture and digital transformation from the experts at Zion Tech Group.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map(({ slug, title }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-200"
            >
              <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300">
                Read article →
              </span>
              <h2 className="mt-2 text-base font-semibold text-white leading-snug group-hover:text-purple-200 transition-colors">
                {title.replace(' | Zion Tech Group Blog', '')}
              </h2>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact/"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Get Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
