import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Customer Success | Zion Tech Group',
  description:
    'Proactively identify at-risk accounts and drive expansion with AI-powered health scoring and playbooks.',
  alternates: { canonical: '/zion-ai-customer-success' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Customer Success',
        category: 'Customer Experience',
        description:
          'Proactively identify at-risk accounts and drive expansion with AI-powered health scoring and playbooks.',
        iconEmoji: '🌟',
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
            "description": "Deploy Zion AI Customer Success to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Customer Success to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Customer Success',
      }}
    />
  );
}
