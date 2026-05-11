import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Spend Intelligence | Zion Tech Group',
  description:
    'Gain visibility into spend across categories, vendors, and departments with AI-powered anomaly detection.',
  alternates: { canonical: '/zion-ai-spend-intelligence' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Spend Intelligence',
        category: 'Operations',
        description:
          'Gain visibility into spend across categories, vendors, and departments with AI-powered anomaly detection.',
        iconEmoji: '💵',
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
            "description": "Deploy Zion AI Spend Intelligence to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Spend Intelligence to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Spend Intelligence',
      }}
    />
  );
}
