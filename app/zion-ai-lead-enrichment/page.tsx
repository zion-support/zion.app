import ProductPageLayout from '../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zion AI Lead Enrichment | Zion Tech Group',
  description:
    'Enrich leads with firmographic and technographic data to prioritize high-value opportunities.',
  alternates: { canonical: '/zion-ai-lead-enrichment' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Lead Enrichment',
        category: 'Growth',
        description:
          'Enrich leads with firmographic and technographic data to prioritize high-value opportunities.',
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
            "description": "Deploy Zion AI Lead Enrichment to automate routine tasks and reduce manual errors.",
            "icon": "⚡"
          },
          {
            "title": "Scalable Growth",
            "description": "Use Zion AI Lead Enrichment to handle increasing complexity without proportional headcount.",
            "icon": "📈"
          }
        ],
        benefits: ["Reduced operational costs", "Faster time to value", "Enterprise-grade security"],
        ctaLabel: 'Get Started with Zion AI Lead Enrichment',
      }}
    />
  );
}
