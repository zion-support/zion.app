import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Log Analytics | Zion Tech Group',
  description:
    'Correlate and analyze logs across systems with AI-powered anomaly detection and root cause insights.',
  alternates: { canonical: '/zion-ai-log-analytics' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Log Analytics',
        category: 'Infrastructure',
        description:
          'Correlate and analyze logs across systems with AI-powered anomaly detection and root cause insights.',
        iconEmoji: '📊',
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
            "description": "Deploy Zion AI Log Analytics to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Log Analytics to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Log Analytics',
      }}
    />
  );
}
