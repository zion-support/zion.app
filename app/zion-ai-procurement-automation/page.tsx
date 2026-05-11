import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Procurement Automation | Zion Tech Group',
  description:
    'Automate sourcing, vendor selection, and purchase workflows with intelligent spend analysis and approval routing.',
  alternates: { canonical: '/zion-ai-procurement-automation' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Procurement Automation',
        category: 'Operations',
        description:
          'Automate sourcing, vendor selection, and purchase workflows with intelligent spend analysis and approval routing.',
        iconEmoji: '🛒',
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
            "description": "Deploy Zion AI Procurement Automation to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Procurement Automation to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Procurement Automation',
      }}
    />
  );
}
