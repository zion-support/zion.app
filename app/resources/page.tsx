import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Resources | Zion Tech Group',
  description:
    'Documentation, guides, case studies, and tools to get the most from Zion Tech Group AI solutions and services.',
  alternates: { canonical: '/resources' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Resources',
        category: 'Company & Resources',
        description:
          'Documentation, guides, case studies, and tools to help you get the most from Zion Tech Group services and products. Find implementation guides, best practices, and real-world examples.',
        iconEmoji: '📚',
        features: [
          {
            title: 'Documentation & Guides',
            description:
              'Technical documentation, API references, and step-by-step guides for implementing and integrating Zion AI solutions with your stack.',
          },
          {
            title: 'Blog & Best Practices',
            description:
              'Articles on AI strategy, implementation patterns, and industry insights. Learn from our team and customer stories.',
          },
          {
            title: 'Case Studies',
            description:
              'Real-world outcomes across industries: support automation, revenue lift, compliance, and operational efficiency with measurable results.',
          },
          {
            title: 'ROI & Planning Tools',
            description:
              'Interactive estimators and planning tools to model savings, payback, and rollout options before you commit.',
          },
          {
            title: 'Support & Training',
            description:
              'Runbooks, training materials, and support options so your team can operate and extend solutions with confidence.',
          },
          {
            title: 'Security & Compliance',
            description:
              'Security overviews, compliance documentation, and audit support for enterprise and regulated environments.',
          },
        ],
        useCases: [
          {
            title: 'Implementation',
            description:
              'Use documentation and guides to deploy Zion solutions quickly and integrate with your existing tools and workflows.',
            icon: '🔧',
          },
          {
            title: 'Strategy & ROI',
            description:
              'Leverage case studies and ROI tools to build business cases and align stakeholders around expected impact.',
            icon: '📊',
          },
          {
            title: 'Ongoing Success',
            description:
              'Access support, training, and best practices to optimize performance and expand use cases over time.',
            icon: '📈',
          },
        ],
        benefits: [
          'Faster implementation with clear documentation',
          'Evidence-based business cases from case studies',
          'Self-service planning and ROI tools',
          'Ongoing support and training',
          'Security and compliance resources',
        ],
        ctaLabel: 'Explore Resources',
      }}
    />
  );
}
