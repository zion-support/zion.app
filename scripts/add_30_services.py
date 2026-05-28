#!/usr/bin/env python3
"""Add 30 new services to servicesData.ts and servicesData.json, deduplicated."""
import json, re, sys
from pathlib import Path

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
SD_FILE  = WORKDIR / 'app' / 'data' / 'servicesData.ts'
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'

# ── Load existing TS data ──────────────────────────────────────────────────────
ts_content = SD_FILE.read_text()
existing_ids = set(re.findall(r"id:\s*'([^']+)'", ts_content))
print(f"Existing TS IDs: {len(existing_ids)}")

# ── 30 NEW SERVICES ────────────────────────────────────────────────────────────
NEW = [
    # ── AI (6) ─────────────────────────────────────────────────────────────────
    {"category": "ai", "id": "ai-contract-lifecycle-intelligence", "title": "Contract Lifecycle Intelligence",
     "description": "AI contract lifecycle management: extract clauses and dates, auto-flag risk, renewal calendar, benchmark against market terms, amendment tracker across 200+ contract types.",
     "basic":"2499","pro":"6999","enterprise":"19999","popular":True,
     "features":[
       "Clause extraction matching against 200+ contract type templates",
       "Auto renewal calendar plus amendment tracker with approval chain",
       "Benchmark pricing and T&Cs against anonymised peer market medians",
       "Obligation tracker with reminders at 90, 30, and 7 days pre-renewal"],
     "benefits":[
       "Cut contract review time by 75%",
       "Never miss a renewal window with proactive alerts three months ahead",
       "Negotiate with anonymised industry peer data as leverage",
       "Full audit trail — every change, version, and approval timestamped"]},

    {"category": "ai", "id": "ai-fintech-fraud-graph", "title": "Fintech Fraud Graph",
     "description": "Real-time fraud detection as a knowledge graph: entity resolution across accounts, IP, device, and card fingerprints; ML scoring per transaction in under 15ms; SAR and CTR auto-draft; global rule engine.",
     "basic":"4999","pro":"14999","enterprise":"49999","popular":True,
     "features":[
       "Entity resolution graph across accounts, IPs, devices, cards, and emails",
       "Real-time ML scoring per transaction in under 15ms",
       "SAR and CTR auto-draft — zero compliance team manual data entry",
       "Global rule engine per jurisdiction, instant payment scheme, and card network"],
     "benefits":[
       "Detect synthetic-identity fraud 30 to 60 days earlier than rule-only systems",
       "Reduce false positives by 40% or more with graph entity relationships",
       "Auto-generated SAR reduces compliance team review time by up to 80%",
       "Edge scoring under 15ms means no user-facing checkout or bank transfer delay"]},

    {"category": "ai", "id": "ai-cross-lingual-meeting-bridge", "title": "Cross-Lingual Meeting Bridge",
     "description": "Multi-language meeting platform: real-time simultaneous interpretation across 40+ languages and dialects, live bilingual captions, cultural-adaptation annotations, silent-watch spectator mode, executive summary auto-generation.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "Simultaneous interpretation across 40+ languages and dialects per meeting",
       "Live bilingual captions with per-speaker timestamped transcript",
       "Cultural-adaptation annotations including politeness norms and idiom equivalents",
       "Silent-watch spectator mode and executive summary auto-generated after each call"],
     "benefits":[
       "Run one meeting and serve every team without interpreter coordination delays",
       "Full mixed-language participation without manual channel switching",
       "Cultural nuance layer reduces post-meeting misalignment across regions",
       "Transcripts indexed in the knowledge base — searchable forever"]},

    {"category": "ai", "id": "ai-sustainable-supply-chain-radar", "title": "Sustainable Supply Chain Radar",
     "description": "Supply-chain ESG tracking: carbon-intensity per supplier tier, green-alternative sourcing score, Scope 3 quantification, regulatory dashboard for CSRD and CBAM, and regulatory penalty simulator per scenario.",
     "basic":"3999","pro":"12999","enterprise":"39999","popular":True,
     "features":[
       "Supplier-scope carbon database from tier-1 to tier-n with Scope 3 quantification",
       "Green-alternative sourcing score with cost-impact tradeoff analysis",
       "CSRD and CBAM compliant auto-reports per quarter per jurisdiction",
       "Regulatory penalty simulator — cost-of-non-compliance per scenario"],
     "benefits":[
       "Master Scope 3 emissions as a live dashboard, not a spreadsheet",
       "Find greener alternatives with cost-impact tradeoffs in 1 click",
       "80 percent reduction on regulatory report person-hours",
       "Show C-suite cost-of-inaction before sign-off"]},

    {"category": "ai", "id": "ai-predictive-maintenance-advisor", "title": "Predictive Maintenance Advisor",
     "description": "Asset remaining useful life prediction via multimodal sensor fusion — vibration, thermal, acoustic, and electrical. Plain-English root-cause narration, part recommendation, and HSE safety-risk layer for maintenance managers.",
     "basic":"2999","pro":"8999","enterprise":"29999","popular":False,
     "features":[
       "Multimodal sensor fusion across vibration, thermal, acoustic, and current sensors",
       "Remaining-Useful-Life distribution with three-severity flag per asset",
       "Plain-English root-cause description with part and vendor recommendation",
       "HSE safety-risk layer assessed before scheduling any maintenance work"],
     "benefits":[
       "Predict failures 14 to 90 days out with accuracy above 85 percent",
       "No more surprise downtime dispatches",
       "Root-cause narrative translates ML output for maintenance crews",
       "HSE layer prevents safety incidents from maintenance decisions"]},

    {"category": "ai", "id": "ai-knowledge-graph-search-engine", "title": "Knowledge Graph Search Engine",
     "description": "Semantic graph search engine: turn siloed docs, databases, and APIs into a unified knowledge graph with entity disambiguation, NL query rewriting, and cited ranked answers across 50+ connected tools.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "Multi-source entity and relation extractor from PDF, Notion, Slack, databases, and API specs",
       "Entity disambiguation with canonical identity store",
       "NL query rewriter — 'who reported this bug?' becomes a graph query automatically",
       "Every answer carries a primary-source footnote plus timestamp"],
     "benefits":[
       "Find answers in under 5 seconds instead of 6 hours of searching",
       "Single answer surface across all information silos",
       "Graph context prevents hallucinations — every claim is source-cited",
       "Auto-crawl keeps knowledge base fresh without manual curation"]},

    # ── IT (5) ─────────────────────────────────────────────────────────────────
    {"category": "it", "id": "it-api-management-gateway", "title": "API Management & Gateway",
     "description": "Full API lifecycle management: unified gateway with auth, rate-limit, circuit-breaker, developer portal with auto-generated OpenAPI docs, per-tenant analytics, and API monetisation. Supports REST, GraphQL, and gRPC.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":True,
     "features":[
       "Unified gateway supporting REST, GraphQL, and gRPC with multi-protocol schema registry",
       "Auto-generated developer portal with OpenAPI specification docs and try-it console",
       "Rate-limiting, circuit-breaker, mTLS, and JWT claims context injection per route",
       "Per-tenant and per-method usage analytics with monetisation rules"],
     "benefits":[
       "One gateway for all API types — REST, GraphQL, and gRPC unified",
       "Developer onboarding drops from 2 weeks to 30 minutes via auto-docs",
       "Monetise APIs without writing a single billing rule",
       "Built-in mTLS and OAuth2 means production-ready without extra setup"]},

    {"category": "it", "id": "it-code-quality-pre-merge", "title": "Code Quality & Pre-Merge Automation",
     "description": "Pre-merge quality gate: SAST, secret-scan, dependency-audit, trunk-based branch review, automated PR reviewer with inline comments, per-PR quality score, and merge-blocking on regressions across 25+ languages.",
     "basic":"999","pro":"3499","enterprise":"9999","popular":False,
     "features":[
       "SAST, secret-scan, and dependency-audit running at every pull request",
       "25-plus language ecosystems including TypeScript, Python, Go, Rust, and Java",
       "Automated 1st-pass PR reviewer with inline code comments before human review",
       "Quality score covering maintainability index and cognitive complexity trend"],
     "benefits":[
       "Catch security CVEs before they reach main — no post-release patches",
       "Automated PR comments reduce manual review burden by 40 to 60 percent",
       "Quality score provides team health trend at a glance",
       "Branch protection means no merge can ever skip the quality gate"]},

    {"category": "it", "id": "it-endpoint-security-compliance", "title": "Endpoint Security & Compliance Monitor",
     "description": "EDR and XDR endpoint coverage with compliance attestation: CIS benchmark checks, disk-encrypt status, OS patch-level verification, software-inventory SBOM per asset, CISA KEV auto-detection, and SCAP reporting for regulated assessments.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":False,
     "features":[
       "EDR and XDR with behavioural threat detection and real-time endpoint isolation",
       "CIS benchmark and compliance attestation per device without manual spreadsheet",
       "Software inventory SBOM per asset with CISA KEV automated detection",
       "SCAP-formatted reporting for FedRAMP and regulated customer assessments"],
     "benefits":[
       "Catch rogue or banned software before it becomes a perimeter breach",
       "Demonstrate compliance without a 100-page manual audit package",
       "Built-in CIS and CISA checks reduces GRC overhead by 60 percent",
       "SBOM per asset in KEV format satisfies FedRAMP requirements"]},

    {"category": "it", "id": "it-wifi-6-wifi-7-deployment", "title": "Wi-Fi 6E / Wi-Fi 7 Deployment",
     "description": "Enterprise wireless consulting and deployment: site survey with spectrum analysis, heatmap documentation, capacity planning, PoE-plus switch configuration, multi-SSID policy, User Centric Wi-Fi, visitor isolation, and Wi-Fi Calling support.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":False,
     "features":[
       "Spectrum analysis and heatmap survey per building density tier for dead-zone mapping",
       "Capacity planning with radio-per-user projections and worst-case headroom",
       "Multi-SSID policy per team, device type, and VLAN with 802.1X",
       "Wi-Fi Calling and targeted latency routing per room and zone"],
     "benefits":[
       "Eliminate dead zones — validated per desk before sign-off without debate",
       "Double capacity without additional cabling or AP relocations",
       "Guest network fully network-isolated with zero lateral movement risk",
       "PoE-plus switch configuration pre-checked before rollout commences"]},

    {"category": "it", "id": "it-backup-disaster-recovery-solution", "title": "Backup & Disaster Recovery Solution",
     "description": "Immutable backup engine with RPO as low as 5 minutes, RTO of 30 minutes, off-site air-gapped storage, Lamport-timestamp chain-of-custody for tamper evidence, ransomware-hold per snapshot, point-in-time restore, and automated DR drill scheduling.",
     "basic":"2499","pro":"7999","enterprise":"24999","popular":True,
     "features":[
       "Immutable backup chain with Lamport-signed tamper-evident restore points",
       "RPO of 5 minutes and RTO of 30 minutes SLA guaranteed in the contract",
       "Air-gapped off-site storage with ransomware snapshot hold holding ransom",
       "Automated DR drill scheduling — report sent to board before quarter-end"],
     "benefits":[
       "Ransomware ransom note becomes moot when backups cannot be tampered with",
       "30-minute RTO without expensive custom scripting or runbook hunting",
       "Board-level DR compliance report delivered automatically every quarter",
       "Lamport-timestamp per snapshot provides evidence-grade backup chain-of-custody"]},

    # ── Cloud (6) ──────────────────────────────────────────────────────────────
    {"category": "cloud", "id": "cloud-kubernetes-cost-optimizer", "title": "Kubernetes Cost Optimizer",
     "description": "K8s cluster cost engine: per-container CPU and RAM right-sizing via VPA plus workload profiling, spot-compatible scheduling for bursty workloads, cost attribution per team or namespace, idle resource crawler, and budget alerts.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "Per-container right-sizing via VPA and workload profiling with safe-in-place patch",
       "Spot-compatible scheduling for bursty workloads onto sporadically preemptible instances",
       "Cost allocation per workload to the owning team or namespace by codebase tag",
       "Idle resource crawler — auto-suspend or delete untouched workloads after 7 idle days"],
     "benefits":[
       "30 to 45 percent Kubernetes cluster cost reduction without workload changes",
       "Spot scheduling achieves 70 percent cheaper compute with 30 percent latency tradeoff clearly displayed",
       "Cost per team billed to codebase removes any debate about who spent what",
       "Idle cleanup recovers 15 percent of spend invisible in typical monthly reporting"]},

    {"category": "cloud", "id": "cloud-chaos-engineering-platform", "title": "Chaos Engineering as a Service",
     "description": "Hosted chaos experiment platform: inject latency, packet loss, CPU or memory spikes, or database failover per Kubernetes namespace or instance, blast-radius boundary, auto-generated results report per scenario, and CI integration.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "50-plus experiment recipes — latency injection, packet loss, CPU, OOM, and DB failover",
       "Blast-radius boundary per namespace and region",
       "CI integration — run the chaos suite post-deploy per pull request",
       "Auto-generated results report per scenario per run with evidence screenshots"],
     "benefits":[
       "Break before the requester breaks — find weak region connectors before release",
       "Run chaos suites in CI — no release merged without a passing chaos check",
       "Blast-radius limits mean experiments never take production down",
       "Regress dashboards keep the team honest on SLO targets during incidents"]},

    {"category": "cloud", "id": "cloud-event-driven-microservices", "title": "Event-Driven Microservices Platform",
     "description": "Event backbone as a service: managed Pub-Sub broker, event schema registry, replay from any timestamp, dead-letter queue management, per-service event-sourcing, per-event observability, and fan-out handler groups.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":True,
     "features":[
       "Managed Pub-Sub broker with dead-letter queue and exponential backoff retry",
       "Schema registry with per-service event-sourcing and backward compatibility checks",
       "Replay any consumer topic from any timestamp for incident forensics or backfill",
       "Fan-out handler group — subscriber load-balanced and auto-scaled per event type"],
     "benefits":[
       "Event-driven architecture means resilient async processing with auto-retry",
       "Schema registry prevents schema-drift from breaking downstream consumer pipelines",
       "Replay any consumer topic from any timestamp during incident forensics",
       "Fan-out scales to 10,000 events per second per topic without manual configuration"]},

    {"category": "cloud", "id": "cloud-spot-instance-optimizer", "title": "Spot Instance Optimizer",
     "description": "Multi-cloud spot and preemptible instance optimizer: smart bin-packing job scheduler, diversity-aware fallback strategy, SLA mix-ratio optimizer, graceful preempt handler with state checkpoint, and cost versus SLA trade-off dashboard.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":False,
     "features":[
       "Smart bin-packing job scheduler onto spot per instance-type and availability-zone",
       "Diversity-aware fallback strategy with state checkpoint on preempt signal",
       "SLA mix-ratio optimizer — sets percent on-demand versus percent spot to hold SLA",
       "Graceful preempt handler: two-minute signal with mid-task checkpoint and auto-resume"],
     "benefits":[
       "Up to 70 percent compute cost reduction with SLA-constrained fallback",
       "Spot price trend forecasting lets ops shift batch runs to earliest cheapest slot",
       "State checkpoint means jobs survive preempt instead of rerunning from scratch",
       "Price variance dashboard per instance-family per region"]},

    {"category": "cloud", "id": "cloud-data-lakehouse-platform", "title": "Data Lakehouse Platform",
     "description": "Unified data lakehouse: ingest CSV, JSON, Parquet, and streams; implement ACID semantics with open-table format Delta Lake or Iceberg engine; SQL query with cardinality optimizer; built-in BI tool connectors; schema enforcement at write time.",
     "basic":"2499","pro":"7999","enterprise":"24999","popular":True,
     "features":[
       "Open-table format ACID engine with Delta Lake or Apache Iceberg",
       "SQL front-end with mesh cardinality optimizer — large multi-table joins run fast",
       "Schema enforcement at write path — no orphan columns enter production tables",
       "BI connectors for Looker, Grafana, Metabase, and Tableau ODBC — no ETL layer needed"],
     "benefits":[
       "One lake and one engine replaces data warehouse and data lake silos with a single system",
       "SQL on raw data means no schema needed upfront before every case is known",
       "Schema enforcement prevents schema-drift from breaking live dashboards in production",
       "Join optimizer means 200-table joins run in seconds rather than hours"]},

    {"category": "cloud", "id": "cloud-disaster-recovery-orchestration", "title": "Disaster Recovery Orchestration",
     "description": "Zero-downtime DR orchestration across regions: continuous async replication, warm-standby spin-up automation in 30 seconds, failover runbook executor with per-step human-halt, DR test runner, and RPO and RTO dashboard with graded SLA.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "Asynchronous cross-region replication — zero-downtime writes at primary region",
       "Warm-standby spin-up from snapshot in 30 seconds with no manual scripts",
       "Failover runbook executor: 47-step runbook with per-step human halt available",
       "DR test runner schedules quarterly drills and auto-reports pass or fail to management"],
     "benefits":[
       "RPO as low as 5 seconds and RTO of 30 seconds for most workloads with no code changes",
       "DR tested quarterly — no more paper-based DR plans gathering dust in binders",
       "One-click failover with no incident commander typing commands at 3am",
       "RTO and RTO dashboard with graded SLA means you know your posture 24-7"]},

    # ── Security (6) ───────────────────────────────────────────────────────────
    {"category": "security", "id": "security-privacy-enhancing-technologies", "title": "Privacy Enhancing Technologies",
     "description": "Privacy Enhancing Technologies consulting and implementation: differential privacy budget tracking, homomorphic encryption proof-of-concept, zero-knowledge proof circuits, TEE enclave design, synthetic data generation, and compliance audit-readiness report.",
     "basic":"2999","pro":"9999","enterprise":"34999","popular":False,
     "features":[
       "Differential privacy budget tracker with dataset privacy score per column",
       "Zero-knowledge proof circuit design and deployment audit for selected use cases",
       "TEE Trusted Execution Environment enclave architecture review and threat model",
       "Synthetic data generator — privacy-preserving by construction with attribute correlation learned"],
     "benefits":[
       "Share data safely — privacy budget score shows real risk per dataset before release",
       "Zero-knowledge proof circuits enable compliant verification without data leaving the silo",
       "TEE review catches enclave implementation errors before production PII is processed",
       "Synthetic datasets used in development and testing mean no real PII ever at risk"]},

    {"category": "security", "id": "security-supply-chain-sbom-manager", "title": "Software Bill-of-Materials Manager",
     "description": "Full SBOM lifecycle management: auto-generate SPDX and Cyclone-DX per build, license-compliance check, vulnerability and CVE matching per component, attestation signing, and SBOM consumer portal per vendor release.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":True,
     "features":[
       "Auto-generate SBOM per build in SPDX and Cyclone-DX formats",
       "License compliance matrix covering GPL, Apache, MIT, and commercial licenses",
       "CVE matching per SBOM component auto-updated daily from NVD and vendor feeds",
       "Attestation signing and SBOM consumer portal per vendor per OS release"],
     "benefits":[
       "Executive order SBOM compliance achieved in 1 day with auto-generation per build",
       "License compliance flagging prevents GPL contamination of proprietary builds",
       "CVE auto-match cuts supplier security review time by 80 percent",
       "Vendor self-service SBOM portal reduces vendor questionnaire overhead per customer"]},

    {"category": "security", "id": "security-web-application-firewall", "title": "Web Application Firewall",
     "description": "Managed WAF with OWASP Top-10 rulesets, API-protection for OWASP API Top-10, bot management with human-versus-bot scoring, CDN-integrated DDoS mitigation, rate-limiting, geo-blocking, and custom rule pipeline per region.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":True,
     "features":[
       "OWASP Top-10 core ruleset plus OWASP API Top-10, auto-updated monthly",
       "Bot management with per-request human-versus-bot score and CAPTCHA escalation",
       "DDoS mitigation at CDN edge — SYN flood and HTTP flood absorbed before reaching origin",
       "Geo-block and custom-rule pipeline per region — no platform team PR cycle required"],
     "benefits":[
       "Top-10 ruleset means 80 percent of OWASP attacks are blocked on day one",
       "Bot management reduces scrapers and brute-force attempts by up to 90 percent",
       "DDoS absorbed at edge — the origin stays completely responsive under any load",
       "Ops team can write custom JSON rules without any platform team PR cycle"]},

    {"category": "security", "id": "security-browser-isolation", "title": "Browser Isolation & Web Security",
     "description": "Remote browser isolation for internet access: containerised browser runs in cloud, pixel-streamed to the user, no download can reach the corporate device, URL categorisation, DLP inspection on every render, and SSL inspection for encoded threats.",
     "basic":"1999","pro":"5999","enterprise":"19999","popular":False,
     "features":[
       "Remote container browser — the full browser runs in the cloud, pixel-streamed live",
       "Zero download risk — malware, ransomware, and drive-by exploits never touch the endpoint",
       "URL categorisation and DLP inspection on every rendered page",
       "SSL inspection decrypts TLS streams to detect threats encoded within encrypted sessions"],
     "benefits":[
       "Browse any URL with zero risk to the corporate endpoint device",
       "PVE sessions on BYOD bring personal devices into scope safely without MDM enrollment",
       "Deployed in 1 day without rearchitecting existing permission structures",
       "No more 'we need to check this in a sandbox first' workaround meetings"]},

    {"category": "security", "id": "security-privileged-access-management", "title": "Privileged Access Management",
     "description": "PAM platform: just-in-time privilege elevation, live session recording with playback, FIPS-140-2 certified credential vault, break-glass override, least-privilege policy engine per role, and quarterly access certification auto-workflow.",
     "basic":"2499","pro":"7999","enterprise":"24999","popular":True,
     "features":[
       "Just-in-time privilege elevation for cloud services, databases, and ops tools",
       "Live session recording with video-plus-terminal playback and audit timestamping",
       "FIPS-140-2 certified credential vault — secrets never persisted to disk",
       "Break-glass override with approval chain and board-level notification per use",
       "Least-privilege policy engine auto-generates per role and per system access policies",
       "Access certification per quarter — auto-approve or manager re-approve within 90-day window"],
     "benefits":[
       "Eliminate standing admin credentials — no password-spray takeover possible",
       "Session recording audit trail satisfies SOC2, K-22956, and Korean regulatory exams automatically",
       "JIT elevation means privilege granted for 1 minute before the need arises",
       "Access certification completed before quarter-end with no manual follow-up chase"]},

    # ── Data (4) ───────────────────────────────────────────────────────────────
    {"category": "data", "id": "data-unstructured-data-lake", "title": "Unstructured Data Lake",
     "description": "Unstructured data pipeline and lake: ingest PDF, Images, Audio, and Video at scale; auto-classify per document schema; OCR, ASR, object-detection hooks per file type; natural-language query with cited source passages.",
     "basic":"2499","pro":"7499","enterprise":"22999","popular":False,
     "features":[
       "Ingest PDF, Images, Audio, and Video with automatic format and codec detection",
       "Auto-classify per schema: invoice, contract, report, or document using layout-aware LLM",
       "OCR and ASR and object-detection hooks applied per detected file type",
       "Natural-language query returns retrieved chunks with cited source passages"],
     "benefits":[
       "Query petabytes of unstructured docs as easily as a Google search",
       "Document-type auto-classify eliminates the need for manual tagging and folder sorting",
       "3D model height maps and architectural drawings extracted, not just text",
       "All answers are cited and retrieved — zero hallucinations and zero AI-assumed data"]},

    {"category": "data", "id": "data-graph-analytics-platform", "title": "Graph Analytics & Network Intelligence",
     "description": "Large-scale network analytics: entity relationship graph builder, centrality and community detection, per-edge anomaly scoring, influencer score per node, GNN-ready feature export, and interactive graph visualisation dashboard.",
     "basic":"2999","pro":"9999","enterprise":"34999","popular":True,
     "features":[
       "Entity and relationship graph builder from any structured or semi-structured data",
       "Community detection and centrality scoring per node highlighting key connectors",
       "Per-edge anomaly scoring with three-sigma departure auto-alert",
       "GNN-ready feature export for training ML fraud and influence detection models"],
     "benefits":[
       "Find fraud rings, influencer networks, and spam clusters invisible in tabular views",
       "Community detection surfaces account segregation rings that ML models miss 40 percent of the time",
       "GNN export feeds graph features directly into existing fraud detection pipelines",
       "Network graph visualiser surfaces hidden relationships to any analyst in under a minute"]},

    {"category": "data", "id": "data-realtime-trending-analytics", "title": "Real-Time Trending Analytics",
     "description": "Real-time windowed aggregation engine: 1-minute tumbling and hopping windows per dimension, per-interval top-K ranking, out-of-norm alerting, sigma deviation triggering, and curated drill-down with root-cause dimension linking per window.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":False,
     "features":[
       "Continuous per-interval Top-K aggregation on grouped dimensions with configurable window size",
       "Out-of-norm score per dimension — automatically explains what changed since last window",
       "Sigma-deviation alerting on every time-series window per threshold per metric",
       "Curated drill-down per spike — root-cause dimension linked from the alert context"],
     "benefits":[
       "Detect trend anomalies in real-time rather than reviewing spreadsheets every Monday",
       "Per-window drill-down from alert to root event takes a single click and under a second",
       "Same query runs live on the stream — no reshape scripts or stored procedures needed",
       "GPU-ready windowed frame enables 60 frames per second dashboard refresh on large datasets"]},

    {"category": "data", "id": "data-image-video-search-engine", "title": "Image and Video Search Engine",
     "description": "Visual search engine for media libraries: CLIP-compatible index built from images and video frames up to 60 frames per second; multi-modal query with text or image; auto-cluster same-scene per video clip; people, location, and label auto-tags per frame.",
     "basic":"2999","pro":"8999","enterprise":"29999","popular":False,
     "features":[
       "CLIP-compatible embedding index from any image or video frame up to 60 frames per second",
       "Multi-modal retrieval — text-to-image, image-to-image, and image-to-video query supported",
       "Parent-album auto-cluster — same-scene and same-people clips auto-grouped per video",
       "Auto-detected people, location, and label tags per frame with searchable metadata"],
     "benefits":[
       "Search a 10-million-image library as quickly as Google Images",
       "Complete commercial rights asset audit in 1 day versus 1 week of manual curation",
       "Parent-album auto-clustering saves archivists 20 hours of manual work per first batch",
       "Per-video embedding saved permanently means visual duplicate finder across years of archive"]},

    # ── Automation (4) ──────────────────────────────────────────────────────────
    {"category": "automation", "id": "automation-multi-channel-campaign-orchestrator", "title": "Multi-Channel Campaign Orchestrator",
     "description": "Orchestrate campaigns across email, SMS, WhatsApp, Telegram, and LinkedIn with sequence branching, per-channel A/B testing, delay per touchpoint, re-engagement windows, engaged versus unengaged segment filter, and unified inbound conversation inbox.",
     "basic":"1999","pro":"5999","enterprise":"17999","popular":True,
     "features":[
       "Sequence builder with channel-branch logic, A/B test per touch, and configurable delay steps",
       "Unified send and reply inbox — all channels in one conversation thread without context switching",
       "Re-engagement window auto-switches channel per non-engaged status per subscriber",
       "Campaign analytics per channel with path dropout funnel visualisation and MQL revenue tracking"],
     "benefits":[
       "Unified inbox halves the time spent managing five channels as one conversation",
       "A/B test within sequence means optimising subject lines on 20 percent sample before full blast",
       "Campaign analytics link revenue back to campaign last-touch to prove MQL ROI",
       "Segment save and reuse means no manual re-filtering before each quarterly campaign launch"]},

    {"category": "automation", "id": "automation-integrated-commerce-automation", "title": "Integrated Commerce Automation",
     "description": "End-to-end e-commerce automation: product sync per multi-marketplace including Amazon, Shopify, eBay, and Etsy; inventory sync; order and workflow routing; auto-generated review request post-delivery; shipping and delivery auto-tracking; refund and return auto-processing.",
     "basic":"1499","pro":"4999","enterprise":"14999","popular":False,
     "features":[
       "Multi-channel product sync for Amazon, Shopify, eBay, Etsy — bidirectional per SKU",
       "Inventory sync across channels — stock depletion reflected across every marketplace in 60 seconds",
       "Dropship workflow — auto-route orders to supplier per stock-level threshold",
       "Auto-review generator sends per-buyer review request post-delivery with personalised template",
       "Return and refund auto-process — auto-compute refund amount and inventory return per policy",
       "Carrier shipping auto-label — auto-chooses cheapest carrier per weight and destination"],
     "benefits":[
       "Sync 5,000 SKUs across 4 channels without a single manual spreadsheet copy-paste",
       "No oversold inventory — no stock-out fees from Amazon or account health penalties",
       "Auto-review response lifts conversion by 10 to 15 percent on new product listings",
       "Return and refund automation reduces support tickets from this channel by 70 percent"]},

    {"category": "automation", "id": "automation-legal-document-preparation", "title": "Legal Document Preparation and Filing",
     "description": "Legal document preparation: template-per-case-type, clause auto-match per case facts, e-sign per jurisdiction, deadline tracking, regulatory filing per state and federal authority, and evidence binder auto-compile with exhibit order per relevance score.",
     "basic":"2999","pro":"6999","enterprise":"19999","popular":False,
     "features":[
       "Template library per case type with clause auto-match per case facts entered",
       "E-sign integrates per jurisdiction via DocuSign or HelloSign embedded signing",
       "Deadline auto-calculation per court rules per state",
       "Evidence binder auto-compile with exhibit auto-order by relevance per document",
       "Regulatory filing per authority per batch or per individual case per filing limit",
       "Prior precedent search per case law by citation auto-detected per case type"],
     "benefits":[
       "Draft and file a motion in 1 hour instead of 1 day — returned to billable hours",
       "Deadline tracking means no lost case from missed filing statute",
       "E-sign per jurisdiction eliminates the paper scan cycle per document",
       "Binder compile reduces paralegal manual effort from 8 hours to 1 hour"]},

    {"category": "automation", "id": "automation-process-mining-deep-dive", "title": "Process Mining Deep Dive",
     "description": "Deep-dive process analytics: auto-discover process maps from ERP, CRM, and BPM event logs; conformance checking per transaction; bottleneck and rework hotspot analysis with cycle-time and handover waste; RPA opportunity scoring per step; executive KPI dashboard.",
     "basic":"2999","pro":"7999","enterprise":"24999","popular":False,
     "features":[
       "Auto-discover process maps from ERP, CRM, and BPM event logs including SAP, Oracle, Salesforce, Jira, and ServiceNow",
       "Conformance checking — compare actual behaviour against the ideal process path with deviation scoring per transaction",
       "Bottleneck, rework, and hotspot analysis — queue time, cycle time, and handover waste per step",
       "RPA opportunity score per step — suggests which steps to auto-route with effort estimate",
       "Executive dashboard with process KPIs, SLA drift, and cost-per-transaction trend"],
     "benefits":[
       "Identify hidden bottlenecks invisible in manual process reviews",
       "Quantify RPA and automation ROI before writing a single script",
       "Reduce end-to-end cycle time by 20 to 40 percent on average",
       "Continuous monitoring catches process drift after go-live rather than at the next quarter review"]}
]

# ── Repack as Service dicts ────────────────────────────────────────────────────
services = []
for s in NEW:
    if s["id"] in existing_ids:
        print(f"  SKIP {s['id']} — already in servicesData.ts")
        continue
    services.append({
        "id":         s["id"],
        "title":      s["title"],
        "description":s["description"],
        "icon":       s.get("icon","★"),
        "features":   s["features"],
        "benefits":   s["benefits"],
        "pricing":    {"basic": s["basic"], "pro": s["pro"], "enterprise": s["enterprise"]},
        "contactInfo":{"website": f"/services/{s['id']}", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href":       f"/services/{s['id']}",
        "category":   s["category"],
        "popular":    s.get("popular", False),
    })

print(f"\nNew services to add: {len(services)}")
by_cat = {}
for svc in services:
    by_cat[svc["category"]] = by_cat.get(svc["category"], 0) + 1
print("By category:", json.dumps(by_cat))

# ── Insert into servicesData.ts ───────────────────────────────────────────────
# Find the exact position right after the last automationServices entry's closing brace + comma
# We want to insert just before ";  }\n];\n\nexport const itSolutions"
tail_marker = "export const itSolutions = itServices;"
pos = ts_content.find(tail_marker)
if pos == -1:
    # fallback: insert before the last ]; before allServices
    pos = ts_content.rfind("];\n\nexport const allServices")

print(f"\nInsert position in TS: char {pos}")
print(f"Context: {repr(ts_content[pos:pos+80])}")

insert_block = ""
for svc in services:
    f_json   = json.dumps(svc["features"])
    b_json   = json.dumps(svc["benefits"])
    p_json   = json.dumps(svc["pricing"])
    c_json   = json.dumps(svc["contactInfo"])
    insert_block += (
        f"\n  {{\n"
        f"    id: '{svc['id']}',\n"
        f"    title: '{svc['title']}',\n"
        f"    description: '{svc['description']}',\n"
        f"    icon: '★',\n"
        f"    features: {f_json},\n"
        f"    benefits: {b_json},\n"
        f"    pricing: {p_json},\n"
        f"    contactInfo: {c_json},\n"
        f"    href: '/services/{svc['id']}',\n"
        f"    category: '{svc['category']}',\n"
        f"    popular: {'true' if svc['popular'] else 'false'},\n"
        f"  }},"
    )

new_ts = ts_content[:pos] + insert_block + "\n" + ts_content[pos:]
SD_FILE.write_text(new_ts)
new_ids = set(re.findall(r"id:\s*'([^']+)'", new_ts))
print(f"New servicesData.ts unique IDs: {len(new_ids)}")

# ── Update servicesData.json ──────────────────────────────────────────────────
with JSON_FILE.open() as f:
    jdata = json.load(f)
jmap = {s["id"]: s for s in jdata}
json_added = 0
for svc in services:
    jmap[svc["id"]] = {
        "id": svc["id"], "title": svc["title"], "description": svc["description"],
        "icon": "★", "features": svc["features"], "benefits": svc["benefits"],
        "pricing": svc["pricing"],
        "contactInfo": {"website": f"/services/{svc['id']}", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
        "href": f"/services/{svc['id']}", "category": svc["category"], "popular": svc["popular"]
    }
    json_added += 1
with JSON_FILE.open('w') as f:
    json.dump(list(jmap.values()), f, indent=2)
print(f"Added {json_added} services to servicesData.json (total: {len(jmap)})")

print("\nDone.")
