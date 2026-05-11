import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Document Classifier | Zion Tech Group',
  description:
    'Automatically classify and route documents with ML models that learn from your taxonomy.',
  alternates: { canonical: '/zion-ai-document-classifier' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Document Classifier',
        category: 'Productivity',
        description:
          'Automatically classify and route documents with ML models that learn from your taxonomy.',
        iconEmoji: '📁',
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
            "description": "Deploy Zion AI Document Classifier to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Document Classifier to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Document Classifier',
      }}
    />
  );
}
