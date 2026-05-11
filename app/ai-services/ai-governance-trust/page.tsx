import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Governance & Trust | Zion Tech Group',
  description:
    'Enterprise AI governance, compliance, and risk management. Policy enforcement, bias detection, audit trails, and responsible AI frameworks for regulated industries.',
  alternates: { canonical: '/ai-services/ai-governance-trust' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Governance & Trust',
        category: 'Advanced AI Services',
        description:
          'Deploy enterprise AI with full governance, compliance, and trust controls. Policy enforcement, bias monitoring, audit trails, and responsible AI frameworks for regulated industries and high-stakes use cases.',
        iconEmoji: '⚖️',
        features: [
          {
            title: 'Policy & Guardrail Enforcement',
            description:
              'Define and enforce content policies, output filters, and safety guardrails. Block harmful content, PII leakage, and off-topic responses at inference time.',
          },
          {
            title: 'Bias & Fairness Monitoring',
            description:
              'Detect and mitigate bias in model outputs and training data. Fairness metrics, demographic parity checks, and continuous monitoring for high-stakes decisions.',
          },
          {
            title: 'Audit Trails & Traceability',
            description:
              'Full lineage for every AI decision: prompts, context, model version, and outputs. Immutable logs for compliance, debugging, and regulatory audits.',
          },
          {
            title: 'Model Risk Management',
            description:
              'Track model versions, performance drift, and degradation. Approval workflows for model updates and rollback capabilities for production incidents.',
          },
          {
            title: 'Regulatory Compliance',
            description:
              'Frameworks for EU AI Act, GDPR, HIPAA, and industry-specific regulations. Data retention, consent management, and right-to-explanation support.',
          },
          {
            title: 'Responsible AI Frameworks',
            description:
              'Implement transparency, accountability, and human oversight. Explainability reports, human-in-the-loop design patterns, and ethics review workflows.',
          },
        ],
        useCases: [
          {
            title: 'Regulated Industries',
            description:
              'Deploy AI in banking, healthcare, and insurance with audit-ready governance. Meet regulatory requirements for explainability, fairness, and data protection.',
            icon: '🏛️',
          },
          {
            title: 'High-Stakes Decision Support',
            description:
              'AI-assisted lending, hiring, and clinical decisions with full traceability. Bias checks, human review gates, and documented reasoning for every outcome.',
            icon: '📋',
          },
          {
            title: 'Enterprise AI Programs',
            description:
              'Centralized governance for AI across departments. Consistent policies, model registry, and compliance reporting at scale.',
            icon: '🏢',
          },
        ],
        benefits: [
          'Reduce regulatory and reputational risk',
          'Full audit trail for every AI interaction',
          'Bias detection and mitigation',
          'Policy enforcement at inference',
          'EU AI Act and GDPR alignment',
          'Scalable governance across AI portfolio',
        ],
        ctaLabel: 'Explore AI Governance',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Governance & Trust' },
        ],
      }}
    />
  );
}
