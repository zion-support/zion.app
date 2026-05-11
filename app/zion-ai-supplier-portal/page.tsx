import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Supplier Portal | Zion Tech Group',
  description:
    'Streamline supplier onboarding, performance tracking, and collaboration with AI-driven insights, document workflows, and self-service portals.',
  alternates: { canonical: '/zion-ai-supplier-portal' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Supplier Portal',
        category: 'Operations',
        description:
          'Streamline supplier onboarding, performance tracking, and collaboration with AI-driven insights, document workflows, and self-service portals so procurement and suppliers work in one place.',
        iconEmoji: '🔗',
        features: [
          {
            title: 'Supplier Onboarding & Lifecycle',
            description:
              'Guided onboarding with document collection, compliance checks, and approval workflows. Maintain supplier profiles and certifications in one system.',
          },
          {
            title: 'Performance & Risk Scoring',
            description:
              'Track delivery, quality, and compliance metrics. AI-driven risk scores and alerts so you act before issues escalate.',
          },
          {
            title: 'Document & Contract Management',
            description:
              'Centralize contracts, NDAs, and certificates. Version control, e-signature integration, and renewal reminders.',
          },
          {
            title: 'Self-Service Supplier Portal',
            description:
              'Suppliers update profiles, upload documents, and view orders and forecasts. Reduce back-and-forth and keep data current.',
          },
          {
            title: 'Procurement & ERP Integration',
            description:
              'Connect to ERP, P2P, and sourcing tools. Sync orders, forecasts, and performance data for a single source of truth.',
          },
          {
            title: 'Audit & Compliance',
            description:
              'Audit trails, approval workflows, and compliance reporting. Support for regulated industries and supplier diversity programs.',
          },
        ],
        useCases: [
          {
            title: 'Faster Onboarding',
            description:
              'Onboard new suppliers with structured workflows and document collection. Cut onboarding time and ensure compliance from day one.',
            icon: '📋',
          },
          {
            title: 'Supplier Performance',
            description:
              'Track delivery, quality, and risk in one place. Identify underperformers and reward top suppliers with better terms.',
            icon: '📈',
          },
          {
            title: 'Collaboration at Scale',
            description:
              'Give suppliers a single portal for documents, orders, and forecasts. Reduce emails and keep data aligned across teams.',
            icon: '🤝',
          },
        ],
        benefits: [
          'Faster supplier onboarding and fewer bottlenecks',
          'Clear performance and risk visibility',
          'Centralized documents and contracts',
          'Less manual work for procurement and suppliers',
          'Audit-ready workflows and compliance support',
        ],
        ctaLabel: 'Get Started with Zion AI Supplier Portal',
      }}
    />
  );
}
