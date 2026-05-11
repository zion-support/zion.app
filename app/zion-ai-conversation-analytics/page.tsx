import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Conversation Analytics | Zion Tech Group',
  description:
    'Analyze customer conversations across channels to surface insights, trends, and improvement opportunities.',
  alternates: { canonical: '/zion-ai-conversation-analytics' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Conversation Analytics',
        category: 'Customer Experience',
        description:
          'Analyze customer conversations across channels to surface insights, trends, and improvement opportunities.',
        iconEmoji: '💬',
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
            "description": "Deploy Zion AI Conversation Analytics to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Conversation Analytics to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Conversation Analytics',
      }}
    />
  );
}
