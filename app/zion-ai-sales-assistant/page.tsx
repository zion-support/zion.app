import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Sales Assistant | Zion Tech Group',
  description:
    'Accelerate sales cycles with AI-powered call summaries, follow-up suggestions, competitive intelligence, and next-best-action recommendations.',
  alternates: { canonical: '/zion-ai-sales-assistant' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Sales Assistant',
        category: 'Growth',
        description:
          'Accelerate sales cycles with AI-powered call summaries, follow-up suggestions, competitive intelligence, and next-best-action recommendations so reps close more deals.',
        iconEmoji: '📞',
        features: [
          {
            title: 'Call Summaries & Action Items',
            description:
              'Auto-summarize calls and meetings, extract action items and commitments, and push follow-ups into CRM so nothing falls through the cracks.',
          },
          {
            title: 'Follow-Up Suggestions',
            description:
              'AI suggests next steps, talking points, and optimal timing based on deal stage, engagement history, and similar won deals.',
          },
          {
            title: 'Competitive Intelligence',
            description:
              'Surface competitive mentions from calls and emails. Track win/loss reasons and arm reps with battle cards and positioning.',
          },
          {
            title: 'Deal & Pipeline Insights',
            description:
              'Risk scoring, forecast accuracy, and pipeline analytics so managers see where deals need attention and reps know where to focus.',
          },
          {
            title: 'CRM & Meeting Integration',
            description:
              'Integrate with Salesforce, HubSpot, Gong, or similar. Sync notes, activities, and AI insights into a single place.',
          },
          {
            title: 'Privacy & Compliance',
            description:
              'Configurable retention, redaction, and access controls. Support regulated industries with audit trails and consent handling.',
          },
        ],
        useCases: [
          {
            title: 'Faster Follow-Ups',
            description:
              'Reps get summarized calls and suggested next steps in CRM so they follow up consistently and never miss a commitment.',
            icon: '⚡',
          },
          {
            title: 'Competitive Wins',
            description:
              'Track competitor mentions and win/loss reasons. Arm reps with positioning and battle cards for competitive deals.',
            icon: '🎯',
          },
          {
            title: 'Pipeline Visibility',
            description:
              'Managers see deal risk, next steps, and forecast accuracy. Reps prioritize the right opportunities with AI-guided focus.',
            icon: '📊',
          },
        ],
        benefits: [
          'Shorter sales cycles and higher win rates',
          'Consistent follow-up and fewer dropped balls',
          'Better competitive positioning',
          'Clear pipeline and forecast visibility',
          'CRM-native workflows and compliance support',
        ],
        ctaLabel: 'Get Started with Zion AI Sales Assistant',
      }}
    />
  );
}
