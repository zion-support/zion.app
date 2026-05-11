import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: "Fine-Tuning & Alignment Pipelines | Zion Tech Group",
  description: "Production-grade pipelines for supervised fine-tuning, preference optimization, and safe deployment of custom models. From curated datasets to staged rollouts and rollback.",
  alternates: { canonical: "/ai-services/ai-finetuning-alignment-pipelines" },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: "Fine-Tuning & Alignment Pipelines",
        category: 'Advanced AI Services',
        description: "Production-grade pipelines for supervised fine-tuning, preference optimization, and safe deployment of custom models. From curated datasets to staged rollouts and rollback.",
        iconEmoji: "🎯",
        features: [
          {
            "title": "Dataset Curation & Governance",
            "description": "Version training data, filter PII, and track licenses. Tie each model artifact to its source datasets."
          },
          {
            "title": "SFT & Preference Learning",
            "description": "Standardize jobs for instruction tuning, DPO-style preference alignment, and evaluation harnesses."
          },
          {
            "title": "Staged Rollouts & Canary",
            "description": "Route traffic gradually to new weights. Auto-rollback on quality or safety regressions."
          },
          {
            "title": "Evaluation Gates",
            "description": "Block promotion unless benchmarks, red-team suites, and business KPIs pass defined thresholds."
          }
        ],
        useCases: [
          {
            "title": "Domain-Specific Models",
            "description": "Legal, medical, and financial vocabularies without generic model drift.",
            "icon": "📚"
          },
          {
            "title": "Brand-Safe Assistants",
            "description": "Align tone, policies, and refusal behavior to enterprise standards.",
            "icon": "✨"
          },
          {
            "title": "Cost-Optimized Endpoints",
            "description": "Smaller fine-tuned models that match larger general models on narrow tasks.",
            "icon": "💰"
          }
        ],
        benefits: [
          "Repeatable ML ops for generative models",
          "Clear audit path from data to deployment",
          "Lower inference cost for specialized tasks",
          "Faster iteration with less firefighting"
        ],
        ctaLabel: "Discuss alignment pipelines",
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: "Fine-Tuning & Alignment Pipelines" },
        ],
      }}
    />
  );
}
