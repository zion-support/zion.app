import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Talent Analytics | Zion Tech Group',
  description:
    'Track team performance, skill gaps, and retention signals with AI-powered workforce insights.',
  alternates: { canonical: '/zion-ai-talent-analytics' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Talent Analytics',
        category: 'Operations',
        description:
          'Track team performance, skill gaps, and retention signals with AI-powered workforce insights. Make data-driven decisions about hiring, development, and organizational design.',
        iconEmoji: '👥',
        features: [
          {
            title: 'Performance Insights',
            description:
              'Aggregate performance data across projects, goals, and feedback to surface trends and outliers.',
          },
          {
            title: 'Skill Gap Analysis',
            description:
              'Identify skill gaps at team and organizational levels with AI-powered recommendations.',
          },
          {
            title: 'Retention Predictors',
            description:
              'Early warning signals for retention risk with actionable intervention suggestions.',
          },
          {
            title: 'Workforce Planning',
            description:
              'Model headcount, capacity, and succession scenarios with AI-driven forecasting.',
          },
          {
            title: 'Learning & Development',
            description:
              'Track learning progress and recommend development paths aligned to career goals.',
          },
          {
            title: 'Privacy-First Design',
            description:
              'Role-based access and anonymization options to protect sensitive workforce data.',
          },
        ],
        useCases: [
          {
            title: 'HR Strategy',
            description:
              'Align talent strategy with business goals using data on skills, performance, and attrition.',
            icon: '📊',
          },
          {
            title: 'Retention Programs',
            description:
              'Proactively address retention risk with targeted interventions and engagement initiatives.',
            icon: '🎯',
          },
          {
            title: 'Hiring Planning',
            description:
              'Model future hiring needs based on growth, attrition, and skill gap analysis.',
            icon: '📈',
          },
        ],
        benefits: [
          'Data-driven HR decisions',
          'Early retention intervention',
          'Skill gap visibility',
          'Workforce planning insights',
          'Privacy-compliant analytics',
          'Measurable ROI on talent',
        ],
        ctaLabel: 'Get Started with Zion AI Talent Analytics',
      }}
    />
  );
}
