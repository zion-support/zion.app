import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Legal Research | Zion Tech Group',
  description:
    'Accelerate legal research with AI-powered case law search, summarization, and citation analysis.',
  alternates: { canonical: '/zion-ai-legal-research' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Legal Research',
        category: 'Compliance',
        description:
          'Accelerate legal research with AI-powered case law search, summarization, and citation analysis.',
        iconEmoji: '⚖️',
        features: [
          {
            "title": "Production-Ready",
            "description": "Enterprise-grade infrastructure with high availability and monitoring."
          },
          {
            "title": "Intelligent Automation",
            "description": "AI-powered workflows that learn from patterns and adapt over time."
          },
          {
            "title": "Seamless Integration",
            "description": "Connect with existing tools via pre-built connectors and webhooks."
          }
        ],
        useCases: [
          {
            "title": "Operational Efficiency",
            "description": "Deploy Zion AI Legal Research to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Legal Research to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Legal Research',
      }}
    />
  );
}
