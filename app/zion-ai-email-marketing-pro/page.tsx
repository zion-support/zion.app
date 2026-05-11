import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Email Marketing Pro | Zion Tech Group',
  description:
    'Zion AI Email Marketing Pro empowers marketing and revenue teams with AI-driven campaign optimization, lead intelligence, and personalized outreach automat',
  alternates: { canonical: '/zion-ai-email-marketing-pro' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Email Marketing Pro',
        category: 'Growth & Marketing',
        description:
          'Zion AI Email Marketing Pro empowers marketing and revenue teams with AI-driven campaign optimization, lead intelligence, and personalized outreach automation. Turn data into pipeline and pipeline into revenue.',
        iconEmoji: '📈',
        features: [
                  {
                            "title": "Campaign Intelligence",
                            "description": "AI-optimized campaign creation, A/B testing, and performance analysis that maximizes ROI across channels."
                  },
                  {
                            "title": "Lead Scoring & Routing",
                            "description": "Behavioral and firmographic scoring models that prioritize high-intent prospects and route them to the right teams."
                  },
                  {
                            "title": "Personalization Engine",
                            "description": "Dynamic content personalization across email, web, and ad channels based on user behavior and preferences."
                  },
                  {
                            "title": "Attribution Modeling",
                            "description": "Multi-touch attribution that accurately maps the customer journey and identifies your highest-performing channels."
                  },
                  {
                            "title": "Audience Segmentation",
                            "description": "AI-driven segmentation that groups prospects by behavior, intent signals, and lifecycle stage for targeted outreach."
                  },
                  {
                            "title": "Performance Analytics",
                            "description": "Real-time dashboards tracking conversion rates, CAC, LTV, and pipeline velocity with predictive trend analysis."
                  }
        ],
        useCases: [
                  {
                            "title": "Pipeline Acceleration",
                            "description": "Score and route leads automatically so your sales team focuses on the highest-value opportunities.",
                            "icon": "🎯"
                  },
                  {
                            "title": "Campaign Optimization",
                            "description": "Test, iterate, and scale marketing campaigns with AI-driven insights and automated performance tuning.",
                            "icon": "📊"
                  },
                  {
                            "title": "Customer Retention",
                            "description": "Identify churn risk early and trigger personalized re-engagement campaigns before customers leave.",
                            "icon": "🤝"
                  }
        ],
        benefits: ["Higher lead conversion rates","Reduced customer acquisition costs","Improved campaign ROI","Faster pipeline velocity","Better audience targeting","Data-driven content strategy"],
        ctaLabel: 'Get Started with Zion AI Email Marketing Pro',
      }}
    />
  );
}
