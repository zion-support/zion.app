import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Security & Responsible AI | Zion Tech Group',
  description:
    'Secure AI systems and responsible deployment. Adversarial robustness, prompt injection defense, data privacy, and AI safety controls for enterprise production.',
  alternates: { canonical: '/ai-services/ai-security-responsible-ai' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Security & Responsible AI',
        category: 'Advanced AI Services',
        description:
          'Deploy AI with security and responsibility built in. We help you harden AI systems against adversarial attacks, prompt injection, and data leakage — while implementing fairness, transparency, and human oversight. From red-teaming and guardrails to privacy-preserving inference and incident response, enterprise-grade AI security and responsible AI practices.',
        iconEmoji: '🛡️',
        features: [
          {
            title: 'Adversarial Robustness & Red-Teaming',
            description:
              'Systematic testing for prompt injection, jailbreaking, and evasion. Red-team exercises and automated adversarial evaluation to find and fix vulnerabilities before production.',
          },
          {
            title: 'Prompt & Input Guardrails',
            description:
              'Validate and sanitize user and system prompts. Block malicious payloads, PII leakage, and policy violations with configurable filters and monitoring.',
          },
          {
            title: 'Data Privacy & Confidentiality',
            description:
              'Differential privacy, federated learning, and secure enclaves for training and inference. Ensure training data and queries never leave controlled environments when required.',
          },
          {
            title: 'Model Supply Chain Security',
            description:
              'Verify model provenance, integrity, and dependencies. Scan for backdoors, poisoned weights, and vulnerable packages in the AI supply chain.',
          },
          {
            title: 'Fairness & Bias Mitigation',
            description:
              'Audit models for discriminatory outcomes across demographics and use cases. Implement fairness constraints, monitoring, and remediation workflows.',
          },
          {
            title: 'Incident Response & Recovery',
            description:
              'Playbooks for AI security incidents: model rollback, prompt leakage containment, and communication. Integrate with SOC and compliance reporting.',
          },
        ],
        useCases: [
          {
            title: 'Secure Customer-Facing AI',
            description:
              'Chatbots, copilots, and agents hardened against prompt injection and data exfiltration for public and authenticated use.',
            icon: '🔐',
          },
          {
            title: 'Regulated & High-Risk AI',
            description:
              'AI systems in healthcare, finance, and legal with documented security controls, fairness audits, and human oversight for regulators.',
            icon: '⚖️',
          },
          {
            title: 'Internal AI Operations',
            description:
              'Secure internal tools and pipelines: access control, audit logs, and data handling aligned with zero-trust and compliance requirements.',
            icon: '🏢',
          },
        ],
        benefits: [
          'Reduce risk of prompt injection and model abuse',
          'Documented security and fairness for audits and regulators',
          'Privacy-preserving options for sensitive data',
          'Faster incident detection and response',
          'Alignment with NIST AI RMF and industry frameworks',
          'Confidence to scale AI across critical workflows',
        ],
        ctaLabel: 'Discuss AI Security',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Security & Responsible AI' },
        ],
      }}
    />
  );
}
