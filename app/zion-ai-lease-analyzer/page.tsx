import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Lease Analyzer | Zion Tech Group',
  description:
    'Extract and analyze lease terms, obligations, and renewal dates across property portfolios.',
  alternates: { canonical: '/zion-ai-lease-analyzer' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Lease Analyzer',
        category: 'Operations',
        description:
          'Extract and analyze lease terms, obligations, renewal dates, and options across property portfolios so real estate and finance teams manage risk and plan ahead.',
        iconEmoji: '🏢',
        features: [
          {
            title: 'Lease Extraction',
            description:
              'AI extracts key terms from lease PDFs: parties, dates, rent, escalations, options, termination rights, and obligations. Structured data for reporting and alerts.',
          },
          {
            title: 'Portfolio Dashboard',
            description:
              'View all leases in one place. Filter by expiry, rent, square footage, or location. Track critical dates and option deadlines.',
          },
          {
            title: 'Renewal & Option Alerts',
            description:
              'Get reminders for renewal windows, option exercise dates, and notice requirements so you never miss a deadline.',
          },
          {
            title: 'Obligation Tracking',
            description:
              'Track TI allowances, CAM reconciliations, and other landlord/tenant obligations. Reduce disputes and missed commitments.',
          },
          {
            title: 'Integration & Export',
            description:
              'Export to Excel or property management systems. API access for portfolio and financial reporting tools.',
          },
          {
            title: 'Audit & Compliance',
            description:
              'Audit trail of extracted terms and changes. Support for lease accounting (ASC 842 / IFRS 16) and internal controls.',
          },
        ],
        useCases: [
          {
            title: 'Portfolio Consolidation',
            description:
              'Ingest hundreds of leases and get a searchable, structured portfolio. Identify expirations and renegotiation opportunities.',
            icon: '📋',
          },
          {
            title: 'Renewal Planning',
            description:
              'Never miss a renewal or option deadline. Plan negotiations and space decisions with clear visibility into timing and terms.',
            icon: '📅',
          },
          {
            title: 'Finance & Accounting',
            description:
              'Support lease accounting and reporting with accurate term data, obligations, and audit-ready extraction records.',
            icon: '📊',
          },
        ],
        benefits: [
          'Faster lease abstraction and fewer manual errors',
          'Clear visibility into renewals and options',
          'Proactive obligation and deadline management',
          'Portfolio-wide reporting and export',
          'Audit and compliance support',
        ],
        ctaLabel: 'Get Started with Zion AI Lease Analyzer',
      }}
    />
  );
}
