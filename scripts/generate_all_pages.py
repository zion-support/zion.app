#!/usr/bin/env python3
"""Full pipeline: restore servicesData.ts, append 15 new services, generate all pages from exact object blocks."""

import re, subprocess
from pathlib import Path

# ── 1. Restore clean original ────────────────────────────────────────────────
subprocess.run("git checkout -- app/data/servicesData.ts", shell=True, capture_output=True)
print("✅ Restored original servicesData.ts")

# ── 2. New service blocks ────────────────────────────────────────────────────
ai_new = """  {
    id: "ai-voice-cloning-emotion",
    href: "/ai-services/voice-cloning-emotion",
    icon: "🎭",
    category: "ai",
    title: "Emotional Voice Cloning Studio",
    description: "Clone any voice with full emotional control — happiness, sadness, anger, urgency — for audiobooks, games, and accessibility. Supports 40+ languages and real-time modulation.",
    features: [
      "Zero-shot voice cloning from 10-second sample",
      "Per-sentence emotion injection (8 basic + complex blends)",
      "Real-time voice conversion during calls",
      "Speaker diarization and multi-voice projects",
      "Ethical consent layer and watermarking"
    ],
    benefits: [
      "Cuts dubbing costs by 70%",
      "Enables dynamic NPC voices in games",
      "Restores speech for ALS patients with their own voiceprint"
    ],
    pricing: { basic: "99", pro: "299", enterprise: "999" }
  },
  {
    id: "ai-code-audit-security",
    href: "/ai-services/code-audit-security",
    icon: "🔐",
    category: "ai",
    title: "AI Code Audit and Security Scanner",
    description: "Deep static analysis that finds complex vulnerabilities — logic bugs, race conditions, crypto misuses — beyond traditional linters. Uses LLMs to understand intent.",
    features: [
      "Detects business logic flaws and privilege escalation",
      "Smart contract audit mode (EVM, Solana, Move)",
      "Patch suggestion with fix diffs",
      "SBOM generation and dependency risk scoring",
      "CI/CD gate integration"
    ],
    benefits: [
      "Prevents 90% of critical vulnerabilities before deployment",
      "Reduces manual code review time by 60%",
      "Meets SOC2 and ISO27001 compliance requirements"
    ],
    pricing: { basic: "149", pro: "399", team: "1299" }
  },
  {
    id: "ai-meeting-intelligence",
    href: "/ai-services/meeting-intelligence",
    icon: "🤖",
    category: "ai",
    title: "AI Meeting Intelligence Suite",
    description: "Autonomous meeting agent that joins Zoom and Teams, transcribes, summarizes decisions, extracts action items with owners and due dates, and pushes to your project tools.",
    features: [
      "Real-time transcription in 60+ languages",
      "Decision to task auto-creation (Asana, Linear, Jira)",
      "Conflict detection on action item assignments",
      "Voice print identification and speaker timeline",
      "Private mode for confidential calls"
    ],
    benefits: [
      "Saves 5–7 hours per week in meeting follow-up",
      "Zero missed action items or unclear owners",
      "Searchable knowledge base of all past discussions"
    ],
    pricing: { basic: "49", pro: "149", business: "499" }
  },
  {
    id: "ai-fraud-detection-realtime",
    href: "/ai-services/fraud-detection-realtime",
    icon: "🛡️",
    category: "ai",
    title: "Real-Time Fraud Detection Engine",
    description: "ML-based fraud detection for fintech, e-commerce, and marketplaces. Adapts to new fraud patterns within hours, not weeks.",
    features: [
      "Custom model training on your transaction history",
      "3D Secure-like challenge without friction",
      "Synthetic identity detection",
      "Chargeback evidence auto-packager",
      "Regulatory reporting dashboard (FFIEC, PSD2)"
    ],
    benefits: [
      "Lowers false positives by 55% vs rule-based systems",
      "Reduces chargebacks by up to 80%",
      "Onboards in 48 hours with existing data"
    ],
    pricing: { starter: "199", growth: "699", enterprise: "contact" }
  },
  {
    id: "ai-document-redaction",
    href: "/ai-services/document-redaction",
    icon: "🔒",
    category: "ai",
    title: "AI Document Redaction and PII Removal",
    description: "Automatically detects and redacts PII, PHI, and sensitive data in documents, PDFs, images, and transcripts. SOC2-compliant audit trail included.",
    features: [
      "Named entity recognition across 50+ PII types",
      "Image-based document OCR and redaction",
      "Bulk processing with S3 and GCS integration",
      "Tamper-evident redaction certificates",
      "Regex custom entity support"
    ],
    benefits: [
      "Preps 10,000 pages for public release in under 1 hour",
      "Eliminates manual review costs — $0.03/page vs $0.45/page",
      "Audit-ready for GDPR, HIPAA, CCPA violations"
    ],
    pricing: { payg: "0.03/page", subscription: "499/mo" }
  },
  {
    id: "ai-legal-drafting",
    href: "/ai-services/legal-drafting",
    icon: "⚖️",
    category: "ai",
    title: "AI Legal Document Drafter",
    description: "Draft contracts, NDAs, term sheets, and privacy policies with jurisdiction-specific clauses. Trained on actual filings from SEC, Companies House, etc.",
    features: [
      "Clause library with risk scoring",
      "Redline comparison against templates",
      "Obligation tracker with deadline reminders",
      "Multi-jurisdiction support — 50+ countries",
      "Law-firm approved templates — ex. Axiom, Latham"
    ],
    benefits: [
      "Cuts first-draft time from 4 hours to 12 minutes",
      "Reduces outside counsel spend by 35%",
      "Identifies non-standard clauses before signature"
    ],
    pricing: { startup: "299/mo", business: "899/mo", enterprise: "contact" }
  },
  {
    id: "ai-video-dubbing",
    href: "/ai-services/video-dubbing",
    icon: "🎬",
    category: "ai",
    title: "AI Video Dubbing and Lip-Sync",
    description: "Translate and dub videos with AI-generated voice plus perfect lip-sync. Supports 70+ languages and preserves speaker intonation and emotion.",
    features: [
      "Voice cloning per original speaker",
      "Phoneme-aware lip movement adjustment",
      "Background music and sound effect retention",
      "Subtitle generation in SRT and VTT",
      "YouTube and TikTok multi-language upload automation"
    ],
    benefits: [
      "Expands global reach without separate shoots",
      "Saves $15K–$50K per video vs traditional dubbing",
      "Maintains brand voice consistency across locales"
    ],
    pricing: { per_minute: "12", monthly: "contact" }
  },
  {
    id: "ai-supply-chain-predictor",
    href: "/ai-services/supply-chain-predictor",
    icon: "🚢",
    category: "ai",
    title: "AI Supply Chain Predictor",
    description: "Predicts supply chain disruptions 14–30 days in advance using multi-source data — weather, geopolitical events, shipping delays, and supplier health scores.",
    features: [
      "Demand forecasting with 94% accuracy",
      "Alternative routing suggestions",
      "Supplier risk scoring",
      "Real-time anomaly alerts"
    ],
    benefits: [
      "Reduces stockouts by 35%",
      "Cuts expedited shipping costs by 22%",
      "Improves supplier negotiation leverage"
    ],
    pricing: { basic: "299", pro: "799", enterprise: "2499" }
  },
  {
    id: "ai-image-upscaling",
    href: "/ai-services/image-upscaling",
    icon: "🖼️",
    category: "ai",
    title: "AI Image Upscaler and Restorer",
    description: "Upscale images 4–16× with detail reconstruction. Removes JPEG artifacts, fixes blur, and even colorizes black and white photos with historical accuracy.",
    features: [
      "Face-aware upscaling — preserves identity",
      "Batch processing via API — 10K images/hr",
      "Lossless PNG optimization post-upscale",
      "Before and after preview with quality metrics",
      "On-premise Docker image for air-gapped environments"
    ],
    benefits: [
      "Makes legacy asset libraries print-ready again",
      "Saves $50K+ in reshoots for archival imagery",
      "Improves product image conversion by 18% on e-commerce"
    ],
    pricing: { payg: "0.05/MP", subscription: "199/mo" }
  },
  {
    id: "ai-chatbot-builder",
    href: "/ai-services/chatbot-builder",
    icon: "💬",
    category: "ai",
    title: "No-Code AI Chatbot Builder",
    description: "Create custom GPT-like chatbots trained on your data — docs, FAQs, past tickets — and embed them anywhere. Fine-tune tone, guardrails, and escalation paths in minutes.",
    features: [
      "Drag-and-drop conversation flow designer",
      "Multi-channel deploy — web, WhatsApp, Slack, FB Messenger",
      "Human handoff with full context preservation",
      "Analytics dashboard — resolution rate, escalation triggers",
      "Custom GPT actions — lookup order, create support ticket"
    ],
    benefits: [
      "Handles 65% of routine queries without agents",
      "Live in <1 hour from data upload",
      "Improves CSAT by 12 points with instant answers"
    ],
    pricing: { starter: "99", business: "299", unlimited: "799" }
  }"""

it_new = """  {
    id: "it-quantum-readiness-assessment",
    href: "/it-services/quantum-readiness-assessment",
    icon: "⚛️",
    category: "it",
    title: "Quantum Readiness Assessment",
    description: "Evaluate your cryptographic infrastructure against future quantum threats. We inventory all PKI assets, identify vulnerable algorithms, and produce a migration roadmap to post-quantum cryptography.",
    features: [
      "Automated crypto-asset discovery across clouds and data centers",
      "PQ algorithm readiness score — NIST finalists assessment",
      "Migration cost estimation and phased plan",
      "Hybrid cipher deployment guidance",
      "Executive dashboard with risk heat map"
    ],
    benefits: [
      "Avoids 'harvest now, decrypt later' data breaches",
      "Meets compliance timelines — e.g., NSA CNS 2.0 deadline 2025",
      "Smooth transition with zero downtime"
    ],
    pricing: { assessment: "4999", full_engagement: "contact" }
  },
  {
    id: "it-edge-computing-deployment",
    href: "/it-services/edge-computing-deployment",
    icon: "📡",
    category: "it",
    title: "Edge Computing Deployment and Ops",
    description: "Deploy and manage containerized workloads on distributed edge nodes — factories, retail stores, telco sites. Unified control plane with zero-touch provisioning.",
    features: [
      "Kubernetes at the edge — K3s, k0s, MicroK8s",
      "Over-the-air updates with rollback",
      "Bandwidth-aware workload placement",
      "Edge AI model serving — ONNX, TensorFlow Lite",
      "Offline-first operation and sync queues"
    ],
    benefits: [
      "Reduces latency to <10ms for real-time applications",
      "Lowers bandwidth costs by up to 60%",
      "Enables AI inference in disconnected environments"
    ],
    pricing: { proof_of_concept: "4999", full_deployment: "contact" }
  },
  {
    id: "it-sustainability-dashboard",
    href: "/it-services/sustainability-dashboard",
    icon: "🌱",
    category: "it",
    title: "IT Sustainability Dashboard",
    description: "Track and optimize carbon footprint across your IT estate — data centers, cloud workloads, employee devices, and network. Set reduction targets and auto-generate ESG reports.",
    features: [
      "Cloud carbon calculator — AWS, Azure, GCP",
      "Hardware lifecycle tracking — embodied carbon",
      "Renewable energy usage % per region",
      "Automated sustainability recommendations",
      "ESG report export — GRI, SASB, TCFD frameworks"
    ],
    benefits: [
      "Reduces carbon output by 20–35% in year 1",
      "Meets investor ESG requirements",
      "Saves $200K+ annually via right-sizing and reserved instance optimization"
    ],
    pricing: { basic: "699", enterprise: "contact" }
  },
  {
    id: "it-chaos-engineering",
    href: "/it-services/chaos-engineering",
    icon: "🌪️",
    category: "it",
    title: "Chaos Engineering as a Service",
    description: "Proactively test system resilience by injecting failures — VM kill, network latency, dependency outage — in production-like environments. Improve reliability before incidents happen.",
    features: [
      "Custom experiment design for your architecture",
      "Steady-state hypothesis validation",
      "Automatic blast radius containment",
      "Post-experiment forensic reports",
      "Runbooks updated based on findings"
    ],
    benefits: [
      "Reduces P0 incidents by 50% year-over-year",
      "Builds confidence in auto-scaling and failover",
      "Identifies single points of failure before customers do"
    ],
    pricing: { per_experiment: "199", retainer: "2499/mo" }
  },
  {
    id: "it-cost-optimization-platform",
    href: "/it-services/cost-optimization-platform",
    icon: "💸",
    category: "it",
    title: "Cloud Cost Optimization Platform",
    description: "Automated cost governance for AWS, Azure, and GCP. Right-sizes resources, eliminates waste, and enforces budgets with predictive alerts before overspend.",
    features: [
      "Idle resource detection and auto-stop schedules",
      "Reserved instance and savings plan recommendation engine",
      "Tag-based cost allocation and showback",
      "Anomaly detection with root-cause tagging",
      "Custom budget thresholds with Slack and Teams alerts"
    ],
    benefits: [
      "Saves 25–40% on cloud spend without performance hit",
      "Prevents bill shock with 7-day spend forecast",
      "Provides finance-grade cost reporting"
    ],
    pricing: { basic: "299", pro: "799", enterprise: "contact" }
  }"""

p = Path('app/data/servicesData.ts')
txt = p.read_text(encoding='utf-8')
ai_end = txt.rfind('];', txt.find('export const aiServices'))
it_end = txt.rfind('];', txt.find('export const itServices'))
txt = txt[:ai_end] + ",\n\n" + ai_new + txt[ai_end:]
txt = txt[:it_end] + ",\n\n" + it_new + txt[it_end:]
p.write_text(txt, encoding='utf-8')
print("✅ Appended new services")

# ── 3. Extract all service objects ───────────────────────────────────────────
content = p.read_text(encoding='utf-8')
lines = content.split('\n')

service_starts = []
for i, line in enumerate(lines):
    if line.strip() != '{':
        continue
    # peek forward for id field
    for j in range(i+1, min(i+7, len(lines))):
        lj = lines[j]
        if ("id: 'ai-" in lj) or ('id: "ai-' in lj) or ("id: 'it-" in lj) or ('id: "it-' in lj):
            cat = 'ai' if ('ai-' in lj) else 'it'
            service_starts.append((i, cat))
            break

print(f"Found {len(service_starts)} service object starts")

def extract_object(lines, start_idx):
    depth = 0
    chars = []
    for i in range(start_idx, len(lines)):
        line = lines[i]
        for ch in line:
            if ch == '{':
                depth += 1
                chars.append(ch)
            elif ch == '}':
                depth -= 1
                chars.append(ch)
                if depth == 0:
                    return ''.join(chars) + '\n'
            else:
                chars.append(ch)
        chars.append('\n')
    return None

services = []
for start_idx, cat in service_starts:
    raw = extract_object(lines, start_idx)
    if raw:
        services.append((raw, cat))
    else:
        print(f"Warning: failed extraction at line {start_idx}")

print(f"Extracted {len(services)} service objects")

# Verify titles
sample_titles = []
for raw, cat in services[:5]:
    m = re.search(r'title\s*:\s*[\'"]([^\'"]+)[\'"]', raw)
    sample_titles.append(m.group(1) if m else '(none)')
print("Sample titles:", sample_titles)

# ── 4. Generate pages ─────────────────────────────────────────────────────────
def to_slug(title):
    s = title.lower()
    s = s.replace(' ','-').replace('—','-').replace('–','-').replace("'",'').replace('/','-').replace('(','').replace(')','').replace('&','and').replace('+','-plus').replace('.','').replace(',','').replace(':','').replace('!','').replace('?','')
    return s

def camel_func(title):
    # Replace special punctuation with words/ removal
    t = title
    t = t.replace('&', 'And')
    t = t.replace('–', 'And')   # en-dash
    t = t.replace('—', 'And')   # em-dash
    t = t.replace('-', '')      # hyphen (remove)
    t = t.replace("'", '')
    t = t.replace('"', '')
    t = t.replace('/', '')
    t = t.replace('(', '')
    t = t.replace(')', '')
    t = t.replace('.', '')
    t = t.replace(',', '')
    t = t.replace(':', '')
    t = t.replace(';', '')
    t = t.replace('!', '')
    t = t.replace('?', '')
    # Collapse multiple spaces
    t = ' '.join(t.split())
    # Capitalize each word
    parts = [w.capitalize() for w in t.split()]
    func = ''.join(parts)
    # If starts with digit, prefix with "Page"
    if func and func[0].isdigit():
        func = 'Page' + func
    return func

template = """import ServiceLayout from '../../components/ServiceLayout';
import type {{ Metadata }} from 'next';

export const metadata: Metadata = {{
  title: "{title} — Zion Tech Group",
  description: "{desc}",
  keywords: "AI services, IT services, {title}",
  openGraph: {{
    title: "{title}",
    description: "{desc}",
    type: "website",
    locale: "en_US",
    siteName: "Zion Tech Group"
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title}",
    description: "{desc}"
  }},
  robots: {{
    index: true,
    follow: true
  }}
}};

const service = {raw_service};

const mergedService = {{
  ...service,
  contactInfo: {{
    website: 'https://ziontechgroup.com',
    email: 'kleber@ziontechgroup.com',
    phone: '+1 302 464 0950',
    address: '364 E Main St STE 1008, Middletown, DE 19709'
  }}
}};

export default function {func_name}Page() {{
  return (
    <ServiceLayout service={{mergedService}} />
  );
}}
"""




written = 0
for raw, cat in services:
    m_title = re.search(r'title\s*:\s*[\'"]([^\'"]+)[\'"]', raw)
    if not m_title:
        continue
    title = m_title.group(1)
    m_desc = re.search(r'description\s*:\s*[\'"]([^\'"]+)[\'"]', raw)
    desc = m_desc.group(1) if m_desc else title
    slug = to_slug(title)
    func = camel_func(title)
    base_dir = Path('app/ai-services') if cat == 'ai' else Path('app/it-services')
    (base_dir / slug).mkdir(parents=True, exist_ok=True)
    page = template.format(title=title, desc=desc, raw_service=raw, func_name=func)
    (base_dir / slug / 'page.tsx').write_text(page, encoding='utf-8')
    written += 1

print(f"✅ Generated {written} pages")
print(f"AI pages: {sum(1 for _,c in services if c=='ai')}")
print(f"IT pages: {sum(1 for _,c in services if c=='it')}")
