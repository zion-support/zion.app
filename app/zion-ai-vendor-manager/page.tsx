import ProductPageLayout from '../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zion AI Vendor Manager | Zion Tech Group',
  description:
    'Manage vendor relationships and procurement workflows with AI-powered scoring and risk assessment.',
  alternates: { canonical: '/zion-ai-vendor-manager' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Vendor Manager',
        category: 'Operations',
        description:
          'Manage vendor relationships and procurement workflows with AI-powered scoring and risk assessment.',
        iconEmoji: '🔄',
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
            "description": "Deploy Zion AI Vendor Manager to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Vendor Manager to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Vendor Manager',
      }}
    />
  );
}
