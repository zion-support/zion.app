import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Copilot & Enterprise Assistants | Zion Tech Group',
  description:
    'Deploy AI copilots and enterprise assistants that augment human work. Context-aware, role-specific AI embedded in your tools and workflows.',
  alternates: { canonical: '/ai-services/ai-copilot-enterprise' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Copilot & Enterprise Assistants',
        category: 'Advanced AI Services',
        description:
          'Embed AI copilots and assistants into your applications and workflows. Context-aware, role-specific AI that augments sales, support, engineering, and operations — with full control over data and behavior.',
        iconEmoji: '👤',
        features: [
          {
            title: 'Context-Aware Assistance',
            description:
              'Copilots that understand your current task, recent actions, and relevant data. Surface suggestions, draft content, and next-best actions in context.',
          },
          {
            title: 'Role-Specific Intelligence',
            description:
              'Tailor copilots by role: sales reps get pipeline insights and email drafts; support agents get resolution suggestions; engineers get code and docs.',
          },
          {
            title: 'Embedded in Your Tools',
            description:
              'Integrate copilots into Slack, Teams, CRM, IDE, or custom apps. Same AI, consistent experience across every touchpoint.',
          },
          {
            title: 'Controlled & Governed',
            description:
              'Define what copilots can access, suggest, and execute. PII handling, compliance boundaries, and approval workflows built in.',
          },
          {
            title: 'Learning & Improvement',
            description:
              'Copilots improve from feedback: accepted suggestions, rejected edits, and explicit ratings. Continuously refine without retraining.',
          },
          {
            title: 'Multi-Modal Interaction',
            description:
              'Support text, voice, and visual inputs. Copilots that can read screenshots, transcribe calls, and generate charts from natural language.',
          },
        ],
        useCases: [
          {
            title: 'Sales Copilot',
            description:
              'Suggest next-best actions, draft outreach, summarize calls, and surface deal risks. Embedded in CRM and email for seamless workflow.',
            icon: '📈',
          },
          {
            title: 'Support Assistant',
            description:
              'Recommend resolutions, draft responses, and escalate intelligently. Reduces handle time while maintaining quality and compliance.',
            icon: '🎧',
          },
          {
            title: 'Engineering Copilot',
            description:
              'Code completion, documentation, refactoring suggestions, and incident triage. Integrated into IDEs and DevOps tools.',
            icon: '💻',
          },
        ],
        benefits: [
          'Faster task completion with in-context assistance',
          'Consistent quality across teams and roles',
          'Reduced context-switching with embedded AI',
          'Full control over data access and suggestions',
          'Improves over time from user feedback',
          'Deploy in weeks, not months',
        ],
        ctaLabel: 'Explore AI Copilots',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Copilot & Enterprise Assistants' },
        ],
      }}
    />
  );
}
