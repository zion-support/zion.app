import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Contact Center Analytics | Zion Tech Group',
  description:
    'Track call center performance, agent productivity, and customer satisfaction with AI-powered insights and recommendations.',
  alternates: { canonical: '/zion-ai-contact-center-analytics' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Contact Center Analytics',
        category: 'Customer Experience',
        description:
          'Track call center performance, agent productivity, and customer satisfaction with AI-powered insights and recommendations.',
        iconEmoji: '📞',
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
            "description": "Deploy Zion AI Contact Center Analytics to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Contact Center Analytics to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Contact Center Analytics',
      }}
    />
  );
}
