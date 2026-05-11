import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Quote Generator | Zion Tech Group',
  description:
    'Generate accurate quotes and proposals from product catalogs with AI-powered pricing and configuration.',
  alternates: { canonical: '/zion-ai-quote-generator' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Quote Generator',
        category: 'Growth',
        description:
          'Generate accurate quotes and proposals from product catalogs with AI-powered pricing, configuration rules, and approval workflows so sales close faster with fewer errors.',
        iconEmoji: '💰',
        features: [
          {
            title: 'Catalog-Driven Configuration',
            description:
              'Build quotes from product catalogs with rules-based configurators. Enforce valid combinations, options, and pricing tiers.',
          },
          {
            title: 'AI-Powered Pricing',
            description:
              'Suggest list, discount, and bundle pricing based on segment, deal size, and history. Keep margins and approval thresholds in check.',
          },
          {
            title: 'Proposal Generation',
            description:
              'Generate professional proposals and PDFs from quote data. Branded templates, terms, and optional e-signature.',
          },
          {
            title: 'Approval Workflows',
            description:
              'Route quotes that exceed discount or margin thresholds to managers. Delegate authority and track approval history.',
          },
          {
            title: 'CRM & CPQ Integration',
            description:
              'Sync with Salesforce, HubSpot, or CPQ. Push quotes to opportunities and convert won quotes to orders.',
          },
          {
            title: 'Analytics & Governance',
            description:
              'Track win rates, discounting, and quote-to-close time. Audit trail for compliance and pricing governance.',
          },
        ],
        useCases: [
          {
            title: 'Configure-Price-Quote',
            description:
              'Sales configures products and options; AI suggests pricing. Generate approved quotes and proposals in minutes instead of days.',
            icon: '⚙️',
          },
          {
            title: 'Complex B2B Deals',
            description:
              'Handle multi-line, multi-year, and bundled deals with consistent rules and approval paths. Reduce pricing errors and rework.',
            icon: '📊',
          },
          {
            title: 'Quote-to-Cash',
            description:
              'Seamless handoff from quote to order. Keep CRM and CPQ in sync so fulfillment and finance have a single source of truth.',
            icon: '🔄',
          },
        ],
        benefits: [
          'Faster quote creation and approval',
          'Consistent pricing and fewer errors',
          'Professional proposals and faster close',
          'CRM and CPQ integration',
          'Governance and audit support',
        ],
        ctaLabel: 'Get Started with Zion AI Quote Generator',
      }}
    />
  );
}
