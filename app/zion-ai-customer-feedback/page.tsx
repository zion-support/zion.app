import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Customer Feedback | Zion Tech Group',
  description:
    'Aggregate and analyze feedback from surveys, reviews, and support channels with sentiment and theme detection.',
  alternates: { canonical: '/zion-ai-customer-feedback' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Customer Feedback',
        category: 'Customer Experience',
        description:
          'Aggregate and analyze feedback from surveys, reviews, and support channels with sentiment and theme detection.',
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
            "description": "Deploy Zion AI Customer Feedback to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Customer Feedback to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Customer Feedback',
      }}
    />
  );
}
