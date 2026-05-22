import ProductPageLayout from '../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zion AI Employee Experience | Zion Tech Group',
  description:
    'Measure and improve employee engagement with pulse surveys, sentiment analysis, and action insights.',
  alternates: { canonical: '/zion-ai-employee-experience' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Employee Experience',
        category: 'Operations',
        description:
          'Measure and improve employee engagement with pulse surveys, sentiment analysis, and action insights.',
        iconEmoji: '👥',
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
            "description": "Deploy Zion AI Employee Experience to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Employee Experience to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Employee Experience',
      }}
    />
  );
}
