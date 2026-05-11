import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: "AI Agent Safety & Evaluation | Zion Tech Group",
  description: "Red-teaming, behavioral evals, and production guardrails for autonomous and semi-autonomous AI agents. Reduce catastrophic failures, prompt injection risk, and unsafe tool use before agents touch customers or critical systems.",
  alternates: { canonical: "/ai-services/ai-agent-safety-evaluation" },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: "AI Agent Safety & Evaluation",
        category: 'Advanced AI Services',
        description: "Red-teaming, behavioral evals, and production guardrails for autonomous and semi-autonomous AI agents. Reduce catastrophic failures, prompt injection risk, and unsafe tool use before agents touch customers or critical systems.",
        iconEmoji: "🔬",
        features: [
          {
            "title": "Structured Red-Teaming Programs",
            "description": "Systematic adversarial testing across jailbreaks, tool misuse, data exfiltration, and privilege escalation. Prioritize findings by blast radius and reproducibility."
          },
          {
            "title": "Behavioral & Capability Benchmarks",
            "description": "Track agent reliability on multi-step tasks, recovery from errors, and adherence to policies. Compare releases and catch regressions before rollout."
          },
          {
            "title": "Runtime Policy & Sandboxing",
            "description": "Enforce allow-lists for tools, destinations, and data classes. Combine static rules with live monitors that pause or escalate when risk scores spike."
          },
          {
            "title": "Human-in-the-Loop Escalation",
            "description": "Route uncertain or high-impact actions to reviewers with full context. Tune thresholds from evaluation data instead of guesswork."
          },
          {
            "title": "Audit Trails for Compliance",
            "description": "Immutable logs of prompts, tool calls, and decisions for regulated industries. Export evidence packs for security and legal review."
          }
        ],
        useCases: [
          {
            "title": "Customer-Facing Copilots",
            "description": "Ship agents that can browse, summarize, and act—without crossing trust boundaries or leaking tenant data.",
            "icon": "💬"
          },
          {
            "title": "Internal Workflow Agents",
            "description": "Automate ops and support with agents that respect RBAC and data residency from day one.",
            "icon": "⚙️"
          },
          {
            "title": "Vendor & Model Evaluation",
            "description": "Score third-party agents and foundation APIs on safety before standardizing on a provider.",
            "icon": "📊"
          }
        ],
        benefits: [
          "Fewer production incidents from agent misbehavior",
          "Faster sign-off from security and compliance",
          "Comparable metrics across model versions",
          "Clear path from eval to production policy"
        ],
        ctaLabel: "Discuss agent safety",
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: "AI Agent Safety & Evaluation" },
        ],
      }}
    />
  );
}
