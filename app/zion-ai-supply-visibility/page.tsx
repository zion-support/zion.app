import ProductPageLayout from '../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zion AI Supply Visibility | Zion Tech Group',
  description:
    'Gain real-time visibility into supply chain status, risks, and alternative sourcing options.',
  alternates: { canonical: '/zion-ai-supply-visibility' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Supply Visibility',
        category: 'Operations',
        description:
          'Gain real-time visibility into supply chain status, risks, and alternative sourcing options.',
        iconEmoji: '🔍',
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
            "description": "Deploy Zion AI Supply Visibility to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Supply Visibility to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Supply Visibility',
      }}
    />
  );
}
