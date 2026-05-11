import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Onboarding Pro | Zion Tech Group',
  description:
    'Create personalized onboarding flows that adapt to user behavior and accelerate time-to-value.',
  alternates: { canonical: '/zion-ai-onboarding-pro' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Onboarding Pro',
        category: 'Customer Experience',
        description:
          'Create personalized onboarding flows that adapt to user behavior and accelerate time-to-value. Reduce churn, improve activation, and drive faster adoption with AI-powered onboarding experiences.',
        iconEmoji: '🚀',
        features: [
          {
            title: 'Adaptive Flows',
            description:
              'Onboarding paths that adapt based on user role, behavior, and progress through the checklist.',
          },
          {
            title: 'In-App Guidance',
            description:
              'Contextual tooltips, walkthroughs, and checklists that appear where users need them.',
          },
          {
            title: 'Progress Tracking',
            description:
              'Track completion rates, drop-off points, and time-to-value across the funnel.',
          },
          {
            title: 'A/B Testing',
            description:
              'Test different onboarding sequences to optimize for activation and retention.',
          },
          {
            title: 'Integration-Ready',
            description:
              'Connect to your product, analytics, and CRM for seamless handoffs and tracking.',
          },
          {
            title: 'No-Code Builder',
            description:
              'Design and deploy onboarding flows without engineering involvement for rapid iteration.',
          },
        ],
        useCases: [
          {
            title: 'SaaS Activation',
            description:
              'Guide new users to their first value moment with personalized, step-by-step flows.',
            icon: '✨',
          },
          {
            title: 'Enterprise Rollout',
            description:
              'Onboard teams and departments with role- and department-specific onboarding paths.',
            icon: '🏢',
          },
          {
            title: 'Feature Adoption',
            description:
              'Introduce new features to existing users with targeted, contextual guidance.',
            icon: '📢',
          },
        ],
        benefits: [
          'Faster time-to-value',
          'Higher activation rates',
          'Reduced early churn',
          'Personalized experience',
          'Measurable outcomes',
          'Quick deployment',
        ],
        ctaLabel: 'Get Started with Zion AI Onboarding Pro',
      }}
    />
  );
}
