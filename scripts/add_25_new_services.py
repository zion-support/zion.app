#!/usr/bin/env python3
"""
Add 25 brand-new services across all 6 categories.
Never modify or delete any existing service.
Directly patches servicesData.ts in-place.
"""

import re, sys

WORKDIR = '/Users/klebergarciaalcatrao/zion.app'
path = f'{WORKDIR}/app/data/servicesData.ts'

src = open(path).read()
if len(src) < 1000:
    print("ERROR: file too small")
    sys.exit(1)

# ── 25 new services ────────────────────────────────────────────────────────────
NEW_ENTRIES = [
    # ── AI SERVICES (6) ──────────────────────────────────────────────────────
    {
        "id": "ai-edge-intelligence-fabric",
        "title": "AI Edge Intelligence Fabric",
        "description": "Unified edge AI platform: federated learning across 10k+ edge nodes, on-device model serving (<5ms p99), drift-auto-retrain per node distribution shift, zero-config MQTT/CoAP/HTTP-Clients. Deploy on NVIDIA Jetson / Raspberry Pi / K3s edge clusters.",
        "icon": "🧠",
        "features": [
            "Federated learning across 10,000+ edge nodes without centralised data",
            "On-device inference < 5 ms p99 —< 10 ms on Raspberry Pi / Jetson",
            "Drift-triggered auto-retrain per node without human intervention",
            "MQTT / CoAP / HTTP2-Clients zero-config onboarding per device type",
        ],
        "benefits": [
            "Keep raw data on device = zero GDPR / HIPAA data-leak risk",
            "Inference costs near-zero on edge vs cloud API call",
            "Retrain without draining bandwidth on constrained links",
        ],
        "pricing": {"basic": "999", "pro": "3999", "enterprise": "12999"},
        "contactInfo": {"website": "/services/ai-edge-intelligence-fabric", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-edge-intelligence-fabric",
        "category": "ai",
        "popular": False,
    },
    {
        "id": "ai-carbon-footprint-optimizer",
        "title": "AI Carbon Footprint Optimizer",
        "description": "Scope 1/2/3 GHG emissions tracking per product/region/datacenter: ML-predicted emission factors from utility APIs, auto-recommend load-shifting (cloud-re/zone + renewable PPA match), ESG report generation (CSRD/SECR/TCFD), and yearly carbon cost in P&L.",
        "icon": "🌿",
        "features": [
            "Scope 1/2/3 per-activity emission factors from EPA/EDGAR/openLCA ML",
            "Auto-recommend load-shift: AWS/GCP/Azure greenest zone per hour",
            "ESG report generator: CSRD / SECR / TCFD PDF in 10 mins",
            "Embedded carbon-cost line in monthly P&L per product line",
        ],
        "benefits": [
            "Cut cloud carbon 30-50% with model-guided load scheduling",
            "Comply with CSRD deadline — full report, no external consultant",
            "Carbon cost visible at P&L level drives behaviour change",
        ],
        "pricing": {"basic": "1499", "pro": "4999", "enterprise": "14999"},
        "contactInfo": {"website": "/services/ai-carbon-footprint-optimizer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-carbon-footprint-optimizer",
        "category": "ai",
        "popular": False,
    },
    {
        "id": "ai-chronic-disease-progression-tracker",
        "title": "AI Chronic Disease Progression Tracker",
        "description": "Longitudinal progression model for chronic diseases (diabetes / CVD / CKD) from EHR + wearables: multi-modal fusion (labs + vitals + imaging tokens), risk-decile per patient, personalised intervention recommendation, secure HIPAA-BAA covered per deployment.",
        "icon": "🩺",
        "features": [
            "Multi-modal fusion: EHR labs + continuous vitals + retinal fundus tokens",
            "Progression-decile per patient: 0–10 where each decile maps to 12-month risk",
            "Personalised intervention recommendation: drug + lifestyle per guideline",
            "HIPAA BAA onboarded; data never leaves your VPC",
        ],
        "benefits": [
            "Catch disease progression 6–12 months before clinical diagnosis",
            "Reduce readmission rate by 25% with personalised intervention path",
            "Hospitals save $1.2M/year in avoidable admissions per 10k-patient cohort",
        ],
        "pricing": {"basic": "4999", "pro": "14999", "enterprise": "49999"},
        "contactInfo": {"website": "/services/ai-chronic-disease-progression-tracker", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-chronic-disease-progression-tracker",
        "category": "ai",
        "popular": False,
    },
    {
        "id": "ai-aiops-anomaly-detection",
        "title": "AIOps Anomaly Detection Platform",
        "description": "ML-driven change-point detection for hybrid infra: cloud/ VM / Kubernetes / serverless unified metrics, log-pattern embedding, alert silencer with false-positive <2 %, and auto-generated runbook per anomaly cluster. Integrates with PagerDuty / OpsGenie / Slack.",
        "icon": "📈",
        "features": [
            "Unified metrics across AWS/GCP/Azure + Kubernetes + legacy VMs",
            "Log pattern embedding with transformer — anomaly detection without hand-crafted thresholds",
            "Alert silencer < 2% FP — only on-call when something is broke",
            "Auto-generate runbook per anomaly cluster: steps to triage and resolve",
        ],
        "benefits": [
            "Cut MTTR by 60% — anomaly cluster mapped to runbook in minutes not hours",
            "20-30% reduction in on-call page volume = better engineer quality of life",
            "Single pane of glass replaces 5+ siloed monitoring tools",
        ],
        "pricing": {"basic": "1999", "pro": "5999", "enterprise": "19999"},
        "contactInfo": {"website": "/services/ai-aiops-anomaly-detection", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-aiops-anomaly-detection",
        "category": "ai",
        "popular": True,
    },
    {
        "id": "ai-brand-voice-guardian",
        "title": "AI Brand Voice Guardian",
        "description": "Real-time enforcement of your brand voice guidelines across all customer-facing touchpoints: landing page copy, email drafts, social post, chatbot replies, support tickets. Flags deviations, auto-suggests rewrite. Integrates with HubSpot / Intercom / Email / Slack.",
        "icon": "🗣️",
        "features": [
            "Brand voice profile: tone (formal/casual), terminology, CTA style per brand",
            "Real-time check in HubSpot, Intercom, Gmail, Slack, and any REST endpoint",
            "Deviation flag + one-click suggested rewrite per non-compliant text",
            "Compliance report: volume of non-compliant content per team per month",
        ],
        "benefits": [
            "Maintain brand consistency at scale without manual proofreading every asset",
            "Deviation dashboard: visualise which teams need more training",
            "Integrates into existing CMS / CRM / help-desk = no context-switching",
        ],
        "pricing": {"basic": "299", "pro": "999", "enterprise": "3999"},
        "contactInfo": {"website": "/services/ai-brand-voice-guardian", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-brand-voice-guardian",
        "category": "ai",
        "popular": False,
    },
    {
        "id": "ai-knowledge-base-agent",
        "title": "AI Knowledge Base Agent",
        "description": "Internal knowledge base with agentic crawling: auto-scrape Confluence/Notion/GitHub/Wiki, chunk + embed with tenant-scoped vector DB, query with RAG + citation, escalation to human knowledge manager when uncertain. Includes Slack/Teams Q&A bot.",
        "icon": "📚",
        "features": [
            "Auto-crawl from Confluence/Notion/GitHub/MediaWiki/Hyperpage with OAuth",
            "Tenant-scoped vector DB: data never crosses org boundaries",
            "RAG query with cross-referenced citations (source + timestamp + author)",
            "Slack/Teams bot: ask in-channel, bot replies with cited answer",
        ],
        "benefits": [
            "New hires onboard 40% faster — answers in seconds not days waiting for peer",
            "95% deflection rate on #ask-engineering channels",
            "Management gets visibility: most-asked topics = knowledge gaps to fill",
        ],
        "pricing": {"basic": "499", "pro": "1499", "enterprise": "4999"},
        "contactInfo": {"website": "/services/ai-knowledge-base-agent", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/ai-knowledge-base-agent",
        "category": "ai",
        "popular": True,
    },

    # ── IT SERVICES (5) ──────────────────────────────────────────────────────
    {
        "id": "it-self-healing-kubernetes-platform",
        "title": "Self-Healing Kubernetes Platform",
        "description": "Managed K8s with AI-driven auto-scaling, pod self-healing (OOMKilled/CrashLoopBackOff), workload-aware node autoscaling (spot + on-demand mix), and drift-reconciliation (GitOps + live state sync). Includes 24 × 7 managed control plane.",
        "icon": "🔧",
        "features": [
            "AI-driven HPA/VPA: predicts load 15 min ahead and pre-scales",
            "Pod self-healing: CrashLoopBackOff / OOMKilled auto-fix without human alert",
            "Spot + on-demand mixed node group: 40–70 % cost savings vs on-demand",
            "GitOps drift-reconciliation: live state reconciled to declared config",
        ],
        "benefits": [
            "Cluster uptime SLA > 99.95% — self-heal means 3 AM pages drop 90%",
            "Cloud Kubernetes spend 40–70% lower with spot allocation algo",
            "Zero manual node-pool management: platform runs itself",
        ],
        "pricing": {"basic": "1999", "pro": "5999", "enterprise": "19999"},
        "contactInfo": {"website": "/services/it-self-healing-kubernetes-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/it-self-healing-kubernetes-platform",
        "category": "it",
        "popular": True,
    },
    {
        "id": "it-zero-trust-network-access",
        "title": "Zero-Trust Network Access (ZTNA)",
        "description": "Identity-aware proxy replacing VPN: every connection device posture check per user/context, per-application micro-segment, always-on auth with continuous session trust scoring, and session recording for audit. Integrates with Okta/Azure AD/Google Workspace.",
        "icon": "🔐",
        "features": [
            "Per-application micro-segment: no network-level broad access",
            "Device posture check: OS version / patch level / disk encryption before connect",
            "Continuous session trust scoring: session auto-terminates when trust drops",
            "Full audit log per connection: who, what, when → SIEM / Splunk",
        ],
        "benefits": [
            "Extended enterprise access 3x faster than VPN per user",
            "Zero lateral movement risk from compromised endpoint",
            "PCI DSS and SOC2 Type II: access-log requirement zero manual work",
        ],
        "pricing": {"basic": "999", "pro": "3999", "enterprise": "9999"},
        "contactInfo": {"website": "/services/it-zero-trust-network-access", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/it-zero-trust-network-access",
        "category": "it",
        "popular": True,
    },
    {
        "id": "it-cloud-cost-management-platform",
        "title": "Cloud Cost Management Platform",
        "description": "Multi-cloud FinOps: AWS/GCP/Azure cost aggregation per team/product, anomaly-detection on spend spikes, rightsizing recommendations per resource, RI/SP/CUD purchase Planner, and chargeback/reporting dashboard with Slack billing alerts.",
        "icon": "💰",
        "features": [
            "Multi-cloud cost aggregation: AWS/GCP/Azure/OCI in one dashboard",
            "Anomaly detection: spend spike alert before finance files QBR",
            "Auto-rightsizing: instance type / disk / DB class recommendations per workload",
            "Chargeback/showback tags: per-team/product spend with net margin per SKU",
        ],
        "benefits": [
            "Cut cloud waste 25-40% without manual audit",
            "Rightsizing recs: $2-5/Mo per AWS instance average savings",
            "Chargeback eliminates month-end billing reconciliation spreadsheet",
        ],
        "pricing": {"basic": "499", "pro": "1999", "enterprise": "6999"},
        "contactInfo": {"website": "/services/it-cloud-cost-management-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/it-cloud-cost-management-platform",
        "category": "it",
        "popular": True,
    },
    {
        "id": "it-data-mesh-implementation",
        "title": "Data Mesh Implementation Service",
        "description": "End-to-end data mesh: domain-oriented decentralised data ownership, self-serve data infrastructure (data-product-as-a-service), federated governance (policy-compliance lineage), and infrastructure-as-code templates per domain team.",
        "icon": "🗄️",
        "features": [
            "Domain-oriented decentralisation: each team owns + manages their data product",
            "Self-serve data infrastructure templates = data team leverage x10",
            "Federated governance: policy enforced at infrastructure layer, compliance auto-documented",
            "IaC templates per domain: Terraform + Pulumi + policy-as-code",
        ],
        "benefits": [
            "Eliminate data bottleneck — self-serve without central data team gate",
            "Data governance covered: true ownership, lineage, quality policy auto-documented",
            "Time-to-value for new data product: weeks not quarters",
        ],
        "pricing": {"basic": "2999", "pro": "9999", "enterprise": "34999"},
        "contactInfo": {"website": "/services/it-data-mesh-implementation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/it-data-mesh-implementation",
        "category": "it",
        "popular": False,
    },
    {
        "id": "it-endpoint-management-macos-windows",
        "title": "Endpoint Management — macOS, Windows, iOS, Android",
        "description": "Modern unified endpoint management (UEM): device enrolment (DEP/IMAP/Android Enterprise), patch management, disk encryption enforcement, MDM policy templates, inventory + asset tracking. Includes remote wipe and app-deployment per platform.",
        "icon": "💻",
        "features": [
            "Zero-touch enrolment: DEP/IMAP/Android Enterprise auto-enroll on unbox",
            "Patch management: OS + browser + critical apps auto-approved or scheduled",
            "FileVault / BitLocker enforcement: policy + real-time compliance dashboard",
            "App deployment: self-service catalog per OS platform with version control",
        ],
        "benefits": [
            "Endpoint compliance rate >99% without manual IT ticket per device",
            "Zero-touch saves 15 min per device = 400 hrs saved for 1000-device org",
            "Self-service app catalog: users install approved apps without IT ticket",
        ],
        "pricing": {"basic": "49", "pro": "149", "enterprise": "499"},
        "contactInfo": {"website": "/services/it-endpoint-management-macos-windows", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/it-endpoint-management-macos-windows",
        "category": "it",
        "popular": False,
    },

    # ── CLOUD SERVICES (5) ────────────────────────────────────────────────────
    {
        "id": "cloud-aiops-incident-intelligence-platform",
        "title": "AIOps Incident Intelligence Platform",
        "description": "Cloud-native incident intelligence: no-code alert correlation engine (PagerDuty/OpsGenie/Datadog/Splunk ingestor), AI-Powered RCA with root-cause ranking, runbook auto-recommend, post-incident report generator. No data leaves your VPC.",
        "icon": "☁️",
        "features": [
            "No-code alert correlation: PagerDuty / OpsGenie / Datadog / Splunk ingestor",
            "AI-Powered RCA: ranked root-cause hypothesis per incident with evidence",
            "Auto-recommend runbook per incident type: steps to triage and resolve",
            "Post-incident report: auto-generated PDF with timeline + action items",
        ],
        "benefits": [
            "MTTR reduced 60% with AI-driven RCA before human on-call even starts",
            "PagerDuty alert volume cut 70% — only pages when root-cause score > 0.9",
            "Post-incident report auto-generated = zero manual incident write-up",
        ],
        "pricing": {"basic": "1499", "pro": "4999", "enterprise": "14999"},
        "contactInfo": {"website": "/services/cloud-aiops-incident-intelligence-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/cloud-aiops-incident-intelligence-platform",
        "category": "cloud",
        "popular": True,
    },
    {
        "id": "cloud-data-lakehouse",
        "title": "Cloud Data Lakehouse Platform",
        "description": "Unified data lakehouse: medallion architecture (bronze/silver/gold), Delta Lake/Iceberg table format, ACID guarantees, streaming ingestion (Kafka/Pulsar), time-travel queries, and unified SQL gateway (Trino). Schema enforcement + anomaly detection auto-block bad batches.",
        "icon": "🏔️",
        "features": [
            "Medallion architecture: bronze/rawstream → silver/validated → gold/aggregated",
            "Delta Lake / Iceberg: ACID guarantees, time-travel, schema enforcement",
            "Streaming ingestion: Kafka / Pulsar / Kinesis real-time → bronze layer",
            "Trino SQL gateway: one SQL dialect across data lake + warehouse",
        ],
        "benefits": [
            "Replace data warehouse + data lake + ETL with one platform",
            "Time-travel queries: reproduce any report from 90 days ago in seconds",
            "Schema enforcement auto-blocks bad batches before they corrupt gold",
        ],
        "pricing": {"basic": "2999", "pro": "9999", "enterprise": "34999"},
        "contactInfo": {"website": "/services/cloud-data-lakehouse", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/cloud-data-lakehouse",
        "category": "cloud",
        "popular": False,
    },
    {
        "id": "cloud-kubernetes-gitops-continuous-deployment",
        "title": "Kubernetes GitOps & Continuous Deployment",
        "description": "GitOps for Kubernetes via ArgoCD/Flux: declarative manifests stored in Git, per-environment promotion (dev → staging → prod), automated drift detection & remediation, progressive delivery (canary/blue-green), and automated security scanning (Trivy/OPA Gatekeeper) per commit.",
        "icon": "🚀",
        "features": [
            "Declarative manifests in Git: single source of truth for every cluster state",
            "Per-environment promotion: dev → staging → prod with manual approval gate",
            "Automated drift detection: live state reconciled to Git in real-time",
            "Progressive delivery: canary / blue-green / A/B per workload per release",
        ],
        "benefits": [
            "Deploy to production 10x faster with GitOps — no kubectl apply fever-dream",
            "Drift auto-reconciled = cluster state always matches declared config",
            "Canary deployment = detect broken release at 5% before full roll-out",
        ],
        "pricing": {"basic": "1499", "pro": "4999", "enterprise": "14999"},
        "contactInfo": {"website": "/services/cloud-kubernetes-gitops-continuous-deployment", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/cloud-kubernetes-gitops-continuous-deployment",
        "category": "cloud",
        "popular": False,
    },
    {
        "id": "cloud-hybrid-multi-cloud-networking",
        "title": "Hybrid Multi-Cloud Networking",
        "description": "Unified networking across on-prem + AWS/GCP/Azure: SD-WAN overlay, Transit Gateway cross-cloud peering, centralised firewall policy (NGFW/IDS/IPS), and cloud egress traffic steering. Single control plane for 200+ VPCs per org.",
        "icon": "🌐",
        "features": [
            "SD-WAN overlay: on-prem ↔ AWS/GCP/Azure unified L3/L4 fabric",
            "Transit Gateway cross-cloud peering: zero-cost inter-region VPC traffic",
            "Centralised NGFW/IDS/IPS: policy applied once, enforced everywhere",
            "Egress traffic steering: least-cost path per application per region",
        ],
        "benefits": [
            "One network team, one policy, all clouds + on-prem — no per-cloud config",
            "Cross-cloud data transfer cost cut 50–80% with smart traffic steering",
            "NGFW centralised = zero per-VPC firewall configuration spaghetti",
        ],
        "pricing": {"basic": "2499", "pro": "7999", "enterprise": "29999"},
        "contactInfo": {"website": "/services/cloud-hybrid-multi-cloud-networking", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/cloud-hybrid-multi-cloud-networking",
        "category": "cloud",
        "popular": False,
    },
    {
        "id": "cloud-serverless-api-platform",
        "title": "Serverless API Production Platform",
        "description": "Serverless API platform: per-endpoint Lambda/FaaS deployment, auto-configurable auth (OAuth2/JWT/API Key), rate-limit tiers per plan, request/response body validation, and real-time observability dash. Includes OpenAPI spec auto-generation per endpoint.",
        "icon": "⚡",
        "features": [
            "Lambda / Cloud Functions / Vercel Functions auto-deployed per endpoint",
            "Auth: OAuth2 / JWT / API Key — policy per route, no code",
            "Rate-limit tiers: free tier / pro / enterprise separate limits per plan",
            "OpenAPI 3.1 spec auto-generated per endpoint with live preview",
        ],
        "benefits": [
            "Production-ready API in 48 hours — no ops team needed",
            "Pay-per-request = zero infrastructure idle cost = 80% cheaper than EC2",
            "Per-plan rate-limiting enforced at edge without backend overhead",
        ],
        "pricing": {"basic": "499", "pro": "1999", "enterprise": "6999"},
        "contactInfo": {"website": "/services/cloud-serverless-api-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/cloud-serverless-api-platform",
        "category": "cloud",
        "popular": False,
    },

    # ── SECURITY SERVICES (5) ──────────────────────────────────────────────────
    {
        "id": "security-container-security-runtime-scanner",
        "title": "Container Security & Runtime Scanning",
        "description": "Full container security lifecycle: image vulnerability scan (Trivy/Anchore) per build step, K8s pod runtime threat detection (Falco/Sysdig), secret-detection in image layers (Gitleaks), SBOM auto-generation, and CVE auto-remediation PR per CVE match.",
        "icon": "🔒",
        "features": [
            "Image vulnerability scan per build step: CVE + CWE + severity + fix",
            "Runtime threat detection: Falco / Sysdig rules per K8s pod",
            "SBOM generation (SPDX/CycloneDX) auto-pushed per image push",
            "Auto-remediation PR per CVE:opens PR with patch version bump",
        ],
        "benefits": [
            "Catch critical CVE before it reaches production — zero runtime exploits",
            "SBOM auto-generated = SBOM compliance requirement met without effort",
            "CVE auto-remediation PR: 80% of CVE fixes merged same day without human",
        ],
        "pricing": {"basic": "799", "pro": "2999", "enterprise": "9999"},
        "contactInfo": {"website": "/services/security-container-security-runtime-scanner", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/security-container-security-runtime-scanner",
        "category": "security",
        "popular": False,
    },
    {
        "id": "security-post-quantum-crypto-readiness",
        "title": "Post-Quantum Cryptography (PQC) Readiness Assessment",
        "description": "PQC readiness audit: inventory all asymmetric crypto (TLS/SSH/Code Sign) per asset, classify by post-quantum vulnerability horizon, test NIST-standardised PQC handshake (CRYSTALS-Kyber/Dilithium), generate migration roadmap, and implement PQC key-exchange in selective services.",
        "icon": "🔮",
        "features": [
            "Inventory all asymmetric cryptography: TLS/SSH/Code Sign per asset + version",
            "Classify by harvest-now/decrypt-later vs quantum-breaking horizon per org risk",
            "NIST PQC handshake test: Kyber512/768/1024 on selected live endpoints",
            "Migration roadmap: phased PQC rollout with milestones per criticality",
        ],
        "benefits": [
            "Stay ahead of quantum computing timeline — migration starts now, not post-break",
            "Regulatory compliance: NIS2 / ETSI require PQC readiness by 2025–2026",
            "Full audit trail per-crypto-asset and per-foundation/government deadline",
        ],
        "pricing": {"basic": "4999", "pro": "14999", "enterprise": "49999"},
        "contactInfo": {"website": "/services/security-post-quantum-crypto-readiness", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/security-post-quantum-crypto-readiness",
        "category": "security",
        "popular": False,
    },
    {
        "id": "security-threat-intelligence-platform-security",
        "title": "Threat Intelligence Platform",
        "description": "Private MISP threat intel platform: custom indicator feed per org, STIX/TAXII bi-directional sharing, automated daily/weekly digest per analyst, playbook mapping per IOC, SIEM/EDR forwarding (Splunk/Sentinel/CrowdStrike), dark-web/breach monitoring for brand assets.",
        "icon": "🧐",
        "features": [
            "Private MISP instance: custom intel feed, STIX/TAXII share per org",
            "Dark-web + paste monitoring: brand, domain, executive name alert",
            "Playbook auto-mapped per IOC type: phishing / malware / C2 / ransomware",
            "SIEM / EDR forwarder: Splunk / Sentinel / CrowdStrike auto-ingest per feed",
        ],
        "benefits": [
            "Detect breach attempt on Day 1 — not weeks later when customer reports it",
            "Analyst time saved 70% — IOC auto-enrichment = no more manual Google",
            "Comply FAR / DFARS: threat-intel-sharing requirement self-hosted",
        ],
        "pricing": {"basic": "1499", "pro": "4999", "enterprise": "14999"},
        "contactInfo": {"website": "/services/security-threat-intelligence-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/security-threat-intelligence-platform",
        "category": "security",
        "popular": True,
    },
    {
        "id": "security-ai-threat-hunter",
        "title": "AI Threat Hunter",
        "description": "AI-powered proactive threat hunting: attack surface discovery (external ASM), hypothesis-driven SIEM correlation, kill-chain mapped per tactic, suspicious-Python/bash execution anomaly, and anomaly-correlation across EDR / firewall / cloud-trail in one unified graph visualisation.",
        "icon": "🕵️",
        "features": [
            "External ASM: internal attack surface mapped from public internet perspective",
            "Hypothesis-driven query: attacker perspective vs defender log noise",
            "Kill-chain mapping per tactic: ATT&CK matrix visualisation of found IOCs",
            "Unified graph: EDR / firewall / cloud-trail anomaly correlated in one view",
        ],
        "benefits": [
            "Catch attacker in PRE-breach stage — not post-breach forensic months later",
            "Threat hunting: 10x ROI for SOC, average 500 person-hours/saved quarterly",
            "Unified view eliminates 60% false positives vs siloed tool review",
        ],
        "pricing": {"basic": "3999", "pro": "11999", "enterprise": "39999"},
        "contactInfo": {"website": "/services/security-ai-threat-hunter", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/security-ai-threat-hunter",
        "category": "security",
        "popular": False,
    },
    {
        "id": "security-api-security-api-gateway",
        "title": "API Security & API Gateway",
        "description": "Runtime API gateway with inline security: OAuth2 + mTLS per endpoint, rate-limit + burst protection, schema-validation per OpenAPI spec, anomaly detection per abnormal token patterns, and bot-detection. Integrates with Kong/AWS API GW/NGINX and auto-generates audit logs.",
        "icon": "🔑",
        "features": [
            "OAuth2 + mTLS per endpoint: fine-grained auth without custom middleware",
            "Schema-validation per OpenAPI spec: block malformed request before backend",
            "Anomaly detection per token payload: flag unusual patterns without false positives",
            "Bot-detection: behavioural fingerprinting without CAPTCHA friction",
        ],
        "benefits": [
            "API breach prevented before reaching backend — zero PII exfiltration via API",
            "Comply ISO 27001 / SOC2: API access policy enforced without dev team coding",
            "Drop-in Kong / AWS API GW: configure once, apply across all services",
        ],
        "pricing": {"basic": "999", "pro": "3999", "enterprise": "12999"},
        "contactInfo": {"website": "/services/security-api-security-api-gateway", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/security-api-security-api-gateway",
        "category": "security",
        "popular": False,
    },

    # ── DATA SERVICES (4) ─────────────────────────────────────────────────────
    {
        "id": "data-realtime-feature-store-ml",
        "title": "Real-Time ML Feature Store",
        "description": "Feature store for real-time ML: online serving with <10ms p99 feature read, offline batch backfill, feature staleness alert per 15-min window, training-serving skew detection, and point-in-time correct feature queries. Supports Feast open-source standard.",
        "icon": "⚡",
        "features": [
            "Online serving <10ms p99: Redis/ValKey per real-time inference model",
            "Offline backfill: batch feature computation from historical store",
            "Staleness alert: per-feature freshness SLA with PagerDuty auto-alert",
            "Point-in-time query: prevents training-serving skew = better model quality",
        ],
        "benefits": [
            "Training-serving skew eliminated = model performs as measured offline",
            "Feature dev time cut 70%: data scientists self-serve, no backend tickets",
            "Feature governance lineage = model auditability for regulated industries",
        ],
        "pricing": {"basic": "1999", "pro": "6999", "enterprise": "24999"},
        "contactInfo": {"website": "/services/data-realtime-feature-store-ml", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/data-realtime-feature-store-ml",
        "category": "data",
        "popular": True,
    },
    {
        "id": "data-data-reconciliation-engine",
        "title": "Data Reconciliation Engine",
        "description": "Cross-source data reconciliation: compare row counts + aggregation sums across SQL/NoSQL/S3/datalake, auto-flag record mismatches, root-cause Fowler (null-value, type-mismatch, late-arrival dims), reconciliation SLA tracking, and signed reconciliation report per audit.",
        "icon": "🔍",
        "features": [
            "Cross-source comparison: SQL → NoSQL → S3 → datalake unified reconciliation",
            "Row-count + aggregation sum auto-compare per source pair per schedule",
            "Root-cause typing: null-value / type-mismatch / late-arrival dim per mismatch",
            "Reconciliation report: signed PDF per epoch for auditor / regulator",
        ],
        "benefits": [
            "Catch data drift before it causes financial misstatement or KPI hallucination",
            "Auditor-ready reconciliation report: zero manual spreadsheet reconciliation",
            "Financial data <1% reconciliation time vs monthly manual reconciliation",
        ],
        "pricing": {"basic": "999", "pro": "3999", "enterprise": "12999"},
        "contactInfo": {"website": "/services/data-data-reconciliation-engine", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/data-data-reconciliation-engine",
        "category": "data",
        "popular": False,
    },
    {
        "id": "data-graph-database-analytics",
        "title": "Graph Database & Analytics",
        "description": "Production graph DB + analytics: neo4j/suvorov/TigerGraph managed cluster, Cypher/Gremlin query gateway, relationship traversal analytics (PageRank/Louvain/WCC), knowledge-graph BI template, and CDC streaming to Kafka per node mutation.",
        "icon": "🔗",
        "features": [
            "Managed graph DB: neo4j / surfer DB / TigerGraph with HA failover",
            "Cypher + Gremlin query gateway: one query language, multiple backends",
            "Relationship analytics: PageRank / Louvain / WCC / shortest path auto-run",
            "CDC streaming: Kafka topic per node mutation for real-time ML feature",
        ],
        "benefits": [
            "Find hidden connections (fraud ring / influence network) in < 10 queries",
            "Graph traversal faster than SQL join-for-deep-relationship at scale",
            "Knowledge-graph BI template: pre-built dashboards no analyst setup",
        ],
        "pricing": {"basic": "1999", "pro": "5999", "enterprise": "19999"},
        "contactInfo": {"website": "/services/data-graph-database-analytics", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/data-graph-database-analytics",
        "category": "data",
        "popular": False,
    },
    {
        "id": "data-nlp-pipeline-orchestrator",
        "title": "NLP Pipeline Orchestrator",
        "description": "Orchestrate multi-step NLP pipelines: text classification (zero-shot/few-shot), NER, sentiment, topic-modeling, summarisation, entity-linking — per batch/stream. Includes LLM prompt-template registry, output quality evaluation per run, and model-fallback routing.",
        "icon": "📝",
        "features": [
            "NLP pipeline builder: nodes = classification / NER / sentiment / summarise / link",
            "Zero-shot / few-shot node per pipeline step: switch models without retrain",
            "Output quality eval per run: check expected-label distribution slided",
            "Model-fallback routing: retry on GPT-4o → Claude → local Mistral if cost spikes",
        ],
        "benefits": [
            "NLP pipeline in days not weeks — drag-drop node editor, zero code needed",
            "Output quality auto-checked per run = zero bad label alerting to data science",
            "Failover routing = zero service interruption if a provider rate-limits",
        ],
        "pricing": {"basic": "999", "pro": "3499", "enterprise": "12999"},
        "contactInfo": {"website": "/services/data-nlp-pipeline-orchestrator", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/data-nlp-pipeline-orchestrator",
        "category": "data",
        "popular": False,
    },

    # ── AUTOMATION SERVICES (4) ────────────────────────────────────────────────
    {
        "id": "automation-event-driven-ml-pipeline",
        "title": "Event-Driven ML Pipeline Orchestrator",
        "description": "Event-first ML pipeline: data-change event triggers training, model drift per sliding window auto-retrain, experiment promotion per A/B shadow-promote. Replaces cron-based ML retrain. Works S3/GCS/ADLS + Kafka. MLflow-compatible experiment tracking.",
        "icon": "🔄",
        "features": [
            "Event-triggered training per data-change stream real-time or batch",
            "Drift window auto-retrain per production inference distribution",
            "Shadow-promote per A/B experiment canary in production",
            "MLflow-compatible experiment tracking per pipeline",
        ],
        "benefits": [
            "Model stays current — auto-retrain on drift within hours not nightly cron",
            "Shadow-promote means A/B experimentation per model promotion",
            "Event-driven eliminates nightly cron retrain scheduling overhead",
        ],
        "pricing": {"basic": "199", "pro": "699", "enterprise": "2499"},
        "contactInfo": {"website": "/services/automation-event-driven-ml-pipeline", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/automation-event-driven-ml-pipeline",
        "category": "automation",
        "popular": False,
    },
    {
        "id": "automation-sap-integration-rpa",
        "title": "SAP Integration + RPA for ERP Automation",
        "description": "SAP-specific RPA for ERP: SAP GUI/WebDynpro/Fiori web-bot automation per batch + real-time, IDoc/ALE/RFC protocol integration, month-end close acceleration per report bot + reconciliation automation. SAP-certified per S/4HANA ECC.",
        "icon": "🔧",
        "features": [
            "SAP GUI/WebDynpro/Fiori web-bot per month-end batch + real-time",
            "IDoc/ALE/RFC protocol native SAP integration",
            "Month-end close acceleration per report bot reconciliation",
            "SAP-certified bot per S/4HANA ECC approved integration",
        ],
        "benefits": [
            "Month-end close cut from 10 days to 3 days per bot automation",
            "SAP GUI automation eliminates manual data entry + key-press errors",
            "Certified bot satisfies SAP Basis team change-acceptance review",
        ],
        "pricing": {"basic": "599", "pro": "1999", "enterprise": "6999"},
        "contactInfo": {"website": "/services/automation-sap-integration-rpa", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/automation-sap-integration-rpa",
        "category": "automation",
        "popular": False,
    },
    {
        "id": "automation-intelligent-document-processor",
        "title": "Intelligent Document Processor",
        "description": "OCR-free full-text extraction from PDFs, scanners, images, and low-quality phone photos: LayoutLM/Donut fine-tuned models handle noisy/rotated/multi-column documents—auto-classifies 70+ types (invoice PO/contract/W-9/medical form), extracts structured fields with confidence scoring, auto-routes to downstream systems. Integrates QuickBooks/Xero/DocuSign/NetSuite/Salesforce/PostgreSQL/Slack.",
        "icon": "📄",
        "features": [
            "OCR-free (LayoutLM/Donut): noisy, rotated, multi-column = zero custom rules",
            "Auto-classify 70+ document types with zero-shot & fine-tuned labels",
            "Confidence-field extraction: key-value pairs, tables, checkbox signatures",
            "One-click human-in-the-loop queue: corrections auto-fine-tune model",
        ],
        "benefits": [
            "Cut document processing time 80–95% vs manual data entry",
            "Integration covers QuickBooks/Xero/DocuSign/NetSuite/Salesforce= zero manual rekey",
            "Confidence score auto-routes: high confidence = direct to ERP, low = human queue",
        ],
        "pricing": {"basic": "499", "pro": "1499", "enterprise": "Custom"},
        "contactInfo": {"website": "/services/automation-intelligent-document-processor", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/automation-intelligent-document-processor",
        "category": "automation",
        "popular": False,
    },
    {
        "id": "automation-process-mining-discovery",
        "title": "Process Mining & Discovery",
        "description": "Auto-discover real business processes from ERP/CRM/BPM event logs: conformance checking vs ideal path, bottleneck + wait-time per activity, RPA opportunity scoring (effort + payoff), BPMN output per discovered flow, and continuous process health monitoring.",
        "icon": "⛏️",
        "features": [
            "Auto-discovers process maps from ERP/CRM/BPM event logs (SAP/Oracle/Salesforce/Jira)",
            "Conformance checking: actual vs ideal path deviation score per activity",
            "RPA opportunity scoring: which steps to auto-route + estimated effort",
            "Executive dashboard: process KPIs, SLA drift, cost-per-transaction trend",
        ],
        "benefits": [
            "Identify hidden bottlenecks invisible in manual process review",
            "Quantify RPA/automation ROI before any script is written",
            "Reduce end-to-end cycle time 20–40% average on discovered processes",
        ],
        "pricing": {"basic": "1499", "pro": "3999", "enterprise": "Custom"},
        "contactInfo": {"website": "/services/automation-process-mining-discovery", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": "/services/automation-process-mining-discovery",
        "category": "automation",
        "popular": False,
    },
]

# ── Insert before each array's closing `];` ─────────────────────────────────
arrays = {'ai':'aiServices','it':'itServices','cloud':'cloudServices',
          'security':'securityServices','data':'dataServices','automation':'automationServices'}
added = {v: 0 for v in arrays.values()}

for entry in NEW_ENTRIES:
    cat = entry['category']
    arr_name = arrays[cat]
    k = f'export const {cat}Services: Service[] = ['
    i = src.find(k)
    if i < 0:
        print(f"  SKIP {entry['id']}: {cat}Services not found")
        continue
    depth = 0; started = False
    for j in range(i + len(k) - 1, len(src)):
        if src[j] == '[':
            depth += 1; started = True
        elif src[j] == ']':
            depth -= 1
        if started and depth == 0:
            # insert before the `];`
            close_pos = j
            # Pad with 2-spacer to maintain indentation
            new_lines = [
                '  {\n',
                f"    id: '{entry['id']}',\n",
                f"    title: '{entry['title']}',\n",
                f"    description: '{entry['description']}',\n",
                f"    icon: '{entry['icon']}',\n",
                f"    features: {entry['features']},\n",
                f"    benefits: {entry['benefits']},\n",
                f"    pricing: {entry['pricing']},\n",
                f"    contactInfo: {entry['contactInfo']},\n",
                f"    href: '{entry['href']}',\n",
                f"    category: '{entry['category']}',\n",
                f"    popular: {'true' if entry.get('popular') else 'false'},\n",
                '  },\n',
            ]
            insert_text = ''.join(new_lines)
            src = src[:close_pos] + insert_text + src[close_pos:]
            added[arr_name] += 1
            print(f"  ✅ {arr_name}: {entry['id']}")
            break

print(f"\nTotal added: {sum(added.values())}")
print("By category:", added)

# Write back
open(path, 'w').write(src)
print(f"\nFile written: {path}  ({len(src)//1024} KB)")
