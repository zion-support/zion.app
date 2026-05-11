import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Deal Desk | Zion Tech Group',
  description:
    'Streamline quote-to-cash with automated pricing, approval routing, and contract generation.',
  alternates: { canonical: '/zion-ai-deal-desk' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Deal Desk',
        category: 'Growth',
        description:
          'Streamline quote-to-cash with automated pricing, approval routing, contract generation, and governance so deals close faster with consistent terms and full audit trails.',
        iconEmoji: '📋',
        features: [
          {
            title: 'Pricing & Discount Governance',
            description:
              'Enforce pricing rules, discount limits, and approval thresholds. AI suggests pricing based on segment, deal size, and history while keeping margins in check.',
          },
          {
            title: 'Approval Routing',
            description:
              'Route deals to the right approvers by deal size, discount, or exception. Multi-level workflows with delegation and escalation.',
          },
          {
            title: 'Contract Generation',
            description:
              'Generate contracts and order forms from approved quotes. Template-driven with clause libraries and optional e-signature.',
          },
          {
            title: 'Quote-to-Order Handoff',
            description:
              'Convert won deals to orders and sync to ERP or fulfillment. Reduce manual re-entry and ensure contract and order alignment.',
          },
          {
            title: 'CRM & CPQ Integration',
            description:
              'Integrate with Salesforce, HubSpot, or CPQ. Keep opportunities, quotes, and contracts in sync for a single source of truth.',
          },
          {
            title: 'Audit & Compliance',
            description:
              'Full audit trail of pricing, approvals, and contract changes. Support for revenue recognition and internal controls.',
          },
        ],
        useCases: [
          {
            title: 'Complex Deal Approval',
            description:
              'Route large or non-standard deals through the right approvers. Enforce discount and margin rules without slowing down standard deals.',
            icon: '✅',
          },
          {
            title: 'Quote-to-Cash',
            description:
              'From quote to contract to order in one flow. Fewer handoffs, fewer errors, and faster revenue recognition.',
            icon: '🔄',
          },
          {
            title: 'Pricing Governance',
            description:
              'Centralize pricing rules and approval authority. Analytics on discounting and win rates for continuous improvement.',
            icon: '📊',
          },
        ],
        benefits: [
          'Faster deal approval and contract generation',
          'Consistent pricing and approval governance',
          'Quote-to-order and ERP handoff',
          'CRM and CPQ integration',
          'Audit-ready deal and contract history',
        ],
        ctaLabel: 'Get Started with Zion AI Deal Desk',
      }}
    />
  );
}
