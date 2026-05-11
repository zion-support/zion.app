import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Feedback Summarizer | Zion Tech Group',
  description:
    'Aggregate and summarize feedback from surveys, reviews, and support channels into actionable insights.',
  alternates: { canonical: '/zion-ai-feedback-summarizer' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Feedback Summarizer',
        category: 'Customer Experience',
        description:
          'Aggregate and summarize feedback from surveys, reviews, and support channels into actionable insights.',
        iconEmoji: '📝',
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
            "description": "Deploy Zion AI Feedback Summarizer to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Feedback Summarizer to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Feedback Summarizer',
      }}
    />
  );
}
