#!/usr/bin/env node

/**
 * AI Advanced AI Services Expansion Agent
 *
 * Creates new enterprise Advanced AI service pages under app/ai-services/* when
 * templates are not yet present. Then other pipelines (e.g. front-page sync)
 * can surface them in navigation and the homepage Advanced AI section.
 *
 * Options:
 *   MAX_NEW_PAGES=2   — Max new directories to create per run (default 1)
 *   DRY_RUN=1         — Log only, no writes
 *
 * Run: node automation/ai-advanced-ai-services-expansion-agent.cjs run
 *      npm run content:advanced-ai-expand
 */

try {
  require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });
} catch (_) {}

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const AI_SERVICES = path.join(ROOT, 'app', 'ai-services');
const REPORT_PATH = path.join(ROOT, 'automation', 'reports', 'advanced-ai-services-expansion-latest.json');
const MAX_NEW_PAGES = Math.max(0, parseInt(process.env.MAX_NEW_PAGES || '1', 10));
const DRY_RUN = process.env.DRY_RUN === '1';

/** Curated Advanced AI topics (slug → rich page data). */
const TEMPLATES = [
  {
    slug: 'ai-agent-safety-evaluation',
    title: 'AI Agent Safety & Evaluation',
    shortTitle: 'AI Agent Safety & Evaluation',
    description:
      'Red-teaming, behavioral evals, and production guardrails for autonomous and semi-autonomous AI agents. Reduce catastrophic failures, prompt injection risk, and unsafe tool use before agents touch customers or critical systems.',
    iconEmoji: '🔬',
    features: [
      {
        title: 'Structured Red-Teaming Programs',
        description:
          'Systematic adversarial testing across jailbreaks, tool misuse, data exfiltration, and privilege escalation. Prioritize findings by blast radius and reproducibility.',
      },
      {
        title: 'Behavioral & Capability Benchmarks',
        description:
          'Track agent reliability on multi-step tasks, recovery from errors, and adherence to policies. Compare releases and catch regressions before rollout.',
      },
      {
        title: 'Runtime Policy & Sandboxing',
        description:
          'Enforce allow-lists for tools, destinations, and data classes. Combine static rules with live monitors that pause or escalate when risk scores spike.',
      },
      {
        title: 'Human-in-the-Loop Escalation',
        description:
          'Route uncertain or high-impact actions to reviewers with full context. Tune thresholds from evaluation data instead of guesswork.',
      },
      {
        title: 'Audit Trails for Compliance',
        description:
          'Immutable logs of prompts, tool calls, and decisions for regulated industries. Export evidence packs for security and legal review.',
      },
    ],
    useCases: [
      {
        title: 'Customer-Facing Copilots',
        description: 'Ship agents that can browse, summarize, and act—without crossing trust boundaries or leaking tenant data.',
        icon: '💬',
      },
      {
        title: 'Internal Workflow Agents',
        description: 'Automate ops and support with agents that respect RBAC and data residency from day one.',
        icon: '⚙️',
      },
      {
        title: 'Vendor & Model Evaluation',
        description: 'Score third-party agents and foundation APIs on safety before standardizing on a provider.',
        icon: '📊',
      },
    ],
    benefits: [
      'Fewer production incidents from agent misbehavior',
      'Faster sign-off from security and compliance',
      'Comparable metrics across model versions',
      'Clear path from eval to production policy',
    ],
    ctaLabel: 'Discuss agent safety',
  },
  {
    slug: 'ai-context-engineering-enterprise',
    title: 'Enterprise Context Engineering',
    shortTitle: 'Enterprise Context Engineering',
    description:
      'Design context windows, retrieval, and memory policies that make LLMs accurate at scale. Bridge product, data, and platform teams with repeatable patterns for prompts, tools, and grounding.',
    iconEmoji: '🔗',
    features: [
      {
        title: 'Context Budgeting & Prioritization',
        description:
          'Allocate tokens across system instructions, retrieved docs, tool outputs, and conversation history. Prevent silent truncation of critical facts.',
      },
      {
        title: 'Retrieval + Prompt Co-Design',
        description:
          'Align chunking, metadata filters, and prompt templates so models see the right evidence at the right time.',
      },
      {
        title: 'Multi-Turn Memory Strategies',
        description:
          'Summarization, structured memory stores, and user-specific profiles—without blowing latency or cost budgets.',
      },
      {
        title: 'Observability for Context Quality',
        description:
          'Trace what the model actually saw for each response. Debug hallucinations caused by wrong chunks or stale cache.',
      },
    ],
    useCases: [
      {
        title: 'Enterprise Assistants',
        description: 'Keep answers grounded in wikis, tickets, and CRM data with transparent context assembly.',
        icon: '🏢',
      },
      {
        title: 'Code & DevOps Copilots',
        description: 'Inject repo structure, runbooks, and incident history without overwhelming the model.',
        icon: '🧑‍💻',
      },
      {
        title: 'Regulated Q&A',
        description: 'Prove which documents informed each answer for audit and legal workflows.',
        icon: '⚖️',
      },
    ],
    benefits: [
      'Higher answer quality per dollar of inference',
      'Reusable playbooks across products',
      'Less trial-and-error for platform teams',
      'Better debugging when things go wrong',
    ],
    ctaLabel: 'Explore context engineering',
  },
  {
    slug: 'ai-memory-agents-long-horizon',
    title: 'Long-Horizon AI Memory & Agents',
    shortTitle: 'Long-Horizon AI Memory & Agents',
    description:
      'Architect durable memory for agents that work across days and weeks: episodic recall, structured knowledge, and forgetting policies. Balance personalization with privacy and compliance.',
    iconEmoji: '🧩',
    features: [
      {
        title: 'Episodic & Semantic Memory Layers',
        description:
          'Separate short-term conversation state from long-term facts learned from prior sessions. Query both with explicit policies.',
      },
      {
        title: 'Forgetting & Retention Policies',
        description:
          'GDPR-friendly erasure, TTLs for sensitive topics, and user controls over what agents are allowed to remember.',
      },
      {
        title: 'Cross-Session Continuity',
        description:
          'Resume complex projects with consistent goals, constraints, and open tasks—without re-explaining context.',
      },
      {
        title: 'Conflict Resolution',
        description:
          'When new information contradicts old memory, resolve with provenance, timestamps, and optional human review.',
      },
    ],
    useCases: [
      {
        title: 'Executive & Sales Assistants',
        description: 'Remember accounts, stakeholders, and commitments across quarters.',
        icon: '📅',
      },
      {
        title: 'Research & Strategy Agents',
        description: 'Accumulate evidence and hypotheses over long-running initiatives.',
        icon: '🔬',
      },
      {
        title: 'Customer Success Automation',
        description: 'Track adoption milestones and prior resolutions without redundant surveys.',
        icon: '🤝',
      },
    ],
    benefits: [
      'More natural multi-day agent workflows',
      'Stronger privacy posture vs. naive chat logs',
      'Reduced repetition for end users',
      'Operational clarity on what agents “know”',
    ],
    ctaLabel: 'Plan long-horizon memory',
  },
  {
    slug: 'ai-finetuning-alignment-pipelines',
    title: 'Fine-Tuning & Alignment Pipelines',
    shortTitle: 'Fine-Tuning & Alignment Pipelines',
    description:
      'Production-grade pipelines for supervised fine-tuning, preference optimization, and safe deployment of custom models. From curated datasets to staged rollouts and rollback.',
    iconEmoji: '🎯',
    features: [
      {
        title: 'Dataset Curation & Governance',
        description:
          'Version training data, filter PII, and track licenses. Tie each model artifact to its source datasets.',
      },
      {
        title: 'SFT & Preference Learning',
        description:
          'Standardize jobs for instruction tuning, DPO-style preference alignment, and evaluation harnesses.',
      },
      {
        title: 'Staged Rollouts & Canary',
        description:
          'Route traffic gradually to new weights. Auto-rollback on quality or safety regressions.',
      },
      {
        title: 'Evaluation Gates',
        description:
          'Block promotion unless benchmarks, red-team suites, and business KPIs pass defined thresholds.',
      },
    ],
    useCases: [
      {
        title: 'Domain-Specific Models',
        description: 'Legal, medical, and financial vocabularies without generic model drift.',
        icon: '📚',
      },
      {
        title: 'Brand-Safe Assistants',
        description: 'Align tone, policies, and refusal behavior to enterprise standards.',
        icon: '✨',
      },
      {
        title: 'Cost-Optimized Endpoints',
        description: 'Smaller fine-tuned models that match larger general models on narrow tasks.',
        icon: '💰',
      },
    ],
    benefits: [
      'Repeatable ML ops for generative models',
      'Clear audit path from data to deployment',
      'Lower inference cost for specialized tasks',
      'Faster iteration with less firefighting',
    ],
    ctaLabel: 'Discuss alignment pipelines',
  },
];

function log(msg) {
  console.log(`[AdvancedAIExpand] ${new Date().toISOString()} | ${msg}`);
}

function ensureReportsDir() {
  const dir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function prettyField(obj, baseIndent) {
  return JSON.stringify(obj, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : ' '.repeat(baseIndent) + line))
    .join('\n');
}

function buildPageTsx(t) {
  const canonical = `/ai-services/${t.slug}`;
  const metaTitle = `${t.shortTitle} | Zion Tech Group`;

  return `import ProductPageLayout from '../../components/ProductPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: ${JSON.stringify(metaTitle)},
  description: ${JSON.stringify(t.description)},
  alternates: { canonical: ${JSON.stringify(canonical)} },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: ${JSON.stringify(t.title)},
        category: 'Advanced AI Services',
        description: ${JSON.stringify(t.description)},
        iconEmoji: ${JSON.stringify(t.iconEmoji)},
        features: ${prettyField(t.features, 8)},
        useCases: ${prettyField(t.useCases, 8)},
        benefits: ${prettyField(t.benefits, 8)},
        ctaLabel: ${JSON.stringify(t.ctaLabel)},
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: ${JSON.stringify(t.title)} },
        ],
      }}
    />
  );
}
`;
}

function run() {
  ensureReportsDir();
  if (!fs.existsSync(AI_SERVICES)) {
    log('app/ai-services missing; aborting.');
    fs.writeFileSync(
      REPORT_PATH,
      JSON.stringify({ ok: false, error: 'no_ai_services_dir', at: new Date().toISOString() }, null, 2)
    );
    return { created: [], skipped: [], error: 'no_ai_services_dir' };
  }

  const created = [];
  const skipped = [];

  for (const t of TEMPLATES) {
    if (created.length >= MAX_NEW_PAGES) break;
    const dir = path.join(AI_SERVICES, t.slug);
    const pagePath = path.join(dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      skipped.push(t.slug);
      continue;
    }
    if (DRY_RUN) {
      log(`[DRY_RUN] Would create ${t.slug}`);
      created.push(t.slug);
      continue;
    }
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pagePath, buildPageTsx(t), 'utf8');
    log(`Created ${pagePath}`);
    created.push(t.slug);
  }

  const report = {
    ok: true,
    at: new Date().toISOString(),
    maxNewPages: MAX_NEW_PAGES,
    dryRun: DRY_RUN,
    created,
    skippedExisting: skipped,
    templatesTotal: TEMPLATES.length,
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`Report → ${REPORT_PATH}`);
  return report;
}

if (require.main === module) {
  const cmd = process.argv[2] || 'run';
  if (cmd === 'run') {
    run();
  } else if (cmd === 'summary') {
    if (fs.existsSync(REPORT_PATH)) {
      const r = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
      console.log(JSON.stringify({ created: r.created, skippedExisting: r.skippedExisting }, null, 2));
    } else {
      console.log('{}');
    }
  } else {
    console.log('Usage: node ai-advanced-ai-services-expansion-agent.cjs [run|summary]');
    process.exit(1);
  }
}

module.exports = { run, TEMPLATES };
