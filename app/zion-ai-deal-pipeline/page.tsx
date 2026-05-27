import ProductPageLayout from '../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zion AI Deal Pipeline | Zion Tech Group',
  description:
    'Visualize and optimize sales pipeline with AI-powered forecasting, stage analysis, and win probability scoring.',
  alternates: { canonical: '/zion-ai-deal-pipeline' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Deal Pipeline',
        category: 'Growth',
        description:
          'Visualize and optimize sales pipeline with AI-powered forecasting, stage analysis, and win probability scoring.',
        iconEmoji: '📈',
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
            "description": "Deploy Zion AI Deal Pipeline to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Deal Pipeline to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Deal Pipeline',
      }}
    />
  );
}
