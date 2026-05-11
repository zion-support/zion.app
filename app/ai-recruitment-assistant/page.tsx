import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Recruitment Assistant | Zion Tech Group',
  description:
    'AI Recruitment Assistant modernizes talent operations with AI-powered sourcing, screening, and workforce analytics. Hire faster, develop talent effectively',
  alternates: { canonical: '/ai-recruitment-assistant' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Recruitment Assistant',
        category: 'HR & Talent',
        description:
          'AI Recruitment Assistant modernizes talent operations with AI-powered sourcing, screening, and workforce analytics. Hire faster, develop talent effectively, and make data-driven people decisions.',
        iconEmoji: '👥',
        features: [
                  {
                            "title": "Production-Ready Architecture",
                            "description": "Enterprise-grade infrastructure with high availability, horizontal scaling, and comprehensive monitoring built in from day one."
                  },
                  {
                            "title": "Intelligent Automation",
                            "description": "AI-powered workflows that learn from patterns, adapt to changing conditions, and reduce manual intervention over time."
                  },
                  {
                            "title": "Seamless Integration",
                            "description": "Connect with your existing tools, APIs, and data sources through pre-built connectors and flexible webhook support."
                  },
                  {
                            "title": "Real-Time Analytics",
                            "description": "Live dashboards and reporting that give you instant visibility into performance, usage, and business impact."
                  },
                  {
                            "title": "Security & Compliance",
                            "description": "Built-in security controls, encryption at rest and in transit, and compliance-ready audit trails for enterprise environments."
                  },
                  {
                            "title": "Customizable Workflows",
                            "description": "Tailor processes, rules, and interfaces to match your specific business requirements without custom development."
                  }
        ],
        useCases: [
                  {
                            "title": "Operational Efficiency",
                            "description": "Deploy AI Recruitment Assistant to automate routine tasks, reduce manual errors, and free your team to focus on strategic priorities.",
                            "icon": "⚡"
                  },
                  {
                            "title": "Scalable Growth",
                            "description": "Use AI Recruitment Assistant to handle increasing complexity and volume without proportional headcount growth.",
                            "icon": "📈"
                  },
                  {
                            "title": "Data-Driven Decisions",
                            "description": "Leverage AI Recruitment Assistant analytics and reporting to make faster, more confident decisions backed by real operational data.",
                            "icon": "🎯"
                  }
        ],
        benefits: ["Reduced operational costs","Faster time to value","Improved team productivity","Scalable architecture","Enterprise-grade security","Measurable ROI tracking"],
        ctaLabel: 'Get Started with AI Recruitment Assistant',
      }}
    />
  );
}
