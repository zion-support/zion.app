#!/usr/bin/env python3
"""Add the missing IT, Cloud, Security, Data, and Automation services that were lost in merge."""
import re

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

IT_NEW = """,
  {
    id: 'it-asset-lifecycle-manager',
    title: 'IT Asset Lifecycle Manager',
    description: 'End-to-end tracking of hardware and software assets from procurement through retirement. Automates depreciation, license compliance, and disposal workflows with full audit trail.',
    features: ['Procurement-to-retirement tracking', 'Automated depreciation calculations', 'Software license compliance alerts', 'Disposal and e-waste workflow', 'Full audit trail and reporting'],
    benefits: [],
    pricing: {basic:'$199/mo', pro:'$599/mo', enterprise:'$1,999/mo'},
    contactInfo: {website:'/services/it-asset-lifecycle-manager', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '📦',
    href: '/services/it-asset-lifecycle-manager',
    popular: true,
    category: 'it',
    industry: 'Finance',
  },
  {
    id: 'it-runbook-automation-platform',
    title: 'IT Runbook Automation Platform',
    description: 'Convert manual operations runbooks into executable auto-remediation playbooks. Human-approval gates for destructive actions with full execution logging and rollback capability.',
    features: ['Runbook-to-playbook converter', 'Human-approval gates for risky actions', 'Automatic rollback on failure', 'Execution logging and audit trail', 'Integration with PagerDuty and ServiceNow'],
    benefits: [],
    pricing: {basic:'$299/mo', pro:'$799/mo', enterprise:'$2,499/mo'},
    contactInfo: {website:'/services/it-runbook-automation-platform', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '📖',
    href: '/services/it-runbook-automation-platform',
    popular: true,
    category: 'it',
    industry: 'Technology',
  },
"""

CLOUD_NEW = """,
  {
    id: 'cloud-multi-tenant-isolation-validator',
    title: 'Cloud Multi-Tenant Isolation Validator',
    description: 'Continuously verify tenant separation in multi-tenant SaaS deployments. Tests IAM policies, network segmentation, and data boundaries to prevent cross-tenant access.',
    features: ['IAM policy boundary verification', 'Network segmentation testing', 'Data isolation validation', 'Cross-tenant access attempt detection', 'Compliance report generation (SOC2, ISO27001)'],
    benefits: [],
    pricing: {basic:'$499/mo', pro:'$1,499/mo', enterprise:'$4,999/mo'},
    contactInfo: {website:'/services/cloud-multi-tenant-isolation-validator', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🔒',
    href: '/services/cloud-multi-tenant-isolation-validator',
    popular: true,
    category: 'cloud',
    industry: 'Healthcare',
  },
  {
    id: 'cloud-migration-readiness-scanner',
    title: 'Cloud Migration Readiness Scanner',
    description: 'Assess on-premises workloads for cloud migration feasibility with dependency mapping, cost modeling, and risk scoring. Generates prioritized migration waves and runbooks.',
    features: ['Workload dependency mapping', 'Cloud-fit risk scoring per application', 'TCO modeling for target cloud', 'Migration wave grouping and sequencing', 'Automated runbook generation per app'],
    benefits: [],
    pricing: {basic:'$399/mo', pro:'$999/mo', enterprise:'$2,999/mo'},
    contactInfo: {website:'/services/cloud-migration-readiness-scanner', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🚀',
    href: '/services/cloud-migration-readiness-scanner',
    popular: false,
    category: 'cloud',
    industry: 'General',
  },
"""

SECURITY_NEW = """,
  {
    id: 'security-api-key-rotator',
    title: 'Security API Key Rotator',
    description: 'Automate API key and secret rotation on configurable schedules with zero-downtime dual-key strategies. Full audit trail of rotations with integration into vaults and CI/CD pipelines.',
    features: ['Scheduled and on-demand rotation', 'Zero-downtime dual-key strategy', 'Vault integration (HashiCorp, AWS Secrets)', 'CI/CD pipeline key injection', 'Full rotation audit trail'],
    benefits: [],
    pricing: {basic:'$299/mo', pro:'$799/mo', enterprise:'$2,499/mo'},
    contactInfo: {website:'/services/security-api-key-rotator', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🔑',
    href: '/services/security-api-key-rotator',
    popular: true,
    category: 'security',
    industry: 'Finance',
  },
  {
    id: 'security-deception-grid',
    title: 'Security Deception Grid',
    description: 'Deploy and manage honeypots, honeyfiles, and canary tokens across your infrastructure. Alert on attacker interaction with decoys and map lateral movement paths in real-time.',
    features: ['Honeypot deployment and management', 'Canary token distribution (API keys, AWS keys, DB creds)', 'Attacker interaction alerting', 'Lateral movement path visualization', 'Integration with SIEM and SOAR platforms'],
    benefits: [],
    pricing: {basic:'$499/mo', pro:'$1,299/mo', enterprise:'$3,999/mo'},
    contactInfo: {website:'/services/security-deception-grid', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🎭',
    href: '/services/security-deception-grid',
    popular: true,
    category: 'security',
    industry: 'Finance',
  },
  {
    id: 'security-zero-trust-policy-engine',
    title: 'Security Zero-Trust Policy Engine',
    description: 'Define, test, and enforce microsegmentation policies as code. Validates identity, device posture, and context before allowing any network or application access.',
    features: ['Policy-as-code microsegmentation rules', 'Identity + device posture validation', 'Context-aware access decisions', 'Policy simulation and testing sandbox', 'Enforcement across cloud, on-prem, and edge'],
    benefits: [],
    pricing: {basic:'$599/mo', pro:'$1,499/mo', enterprise:'$4,999/mo'},
    contactInfo: {website:'/services/security-zero-trust-policy-engine', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🚧',
    href: '/services/security-zero-trust-policy-engine',
    popular: false,
    category: 'security',
    industry: 'Finance',
  },
  {
    id: 'security-sbom-generator',
    title: 'Security SBOM Generator',
    description: 'Automatically generate Software Bill of Materials (SBOM) in SPDX and CycloneDX formats for your entire dependency tree. Continuous vulnerability scanning with CVE alerting.',
    features: ['SPDX and CycloneDX SBOM generation', 'Full transitive dependency tree mapping', 'Continuous CVE vulnerability scanning', 'License compliance checking', 'Integration with build pipelines and repositories'],
    benefits: [],
    pricing: {basic:'$199/mo', pro:'$599/mo', enterprise:'$1,999/mo'},
    contactInfo: {website:'/services/security-sbom-generator', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '📋',
    href: '/services/security-sbom-generator',
    popular: false,
    category: 'security',
    industry: 'Technology',
  },
  {
    id: 'security-incident-playbook-runner',
    title: 'Security Incident Playbook Runner',
    description: 'Execute automated incident response playbooks with containment, eradication, and recovery steps. Human-in-the-loop for critical actions with evidence preservation and timeline generation.',
    features: ['Automated containment actions', 'Evidence preservation chain of custody', 'Human-in-the-loop approval for critical steps', 'Incident timeline auto-generation', 'Post-incident review report builder'],
    benefits: [],
    pricing: {basic:'$499/mo', pro:'$1,299/mo', enterprise:'$3,999/mo'},
    contactInfo: {website:'/services/security-incident-playbook-runner', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🚨',
    href: '/services/security-incident-playbook-runner',
    popular: false,
    category: 'security',
    industry: 'General',
  },
"""

DATA_NEW = """,
  {
    id: 'data-lineage-tracker',
    title: 'Data Lineage Tracker',
    description: 'Map end-to-end data flow paths from source through transformations to consumption. Supports impact analysis for schema changes and regulatory compliance attestation.',
    features: ['End-to-end data flow visualization', 'Schema change impact analysis', 'Column-level lineage tracking', 'Regulatory compliance attestation reports', 'Integration with dbt, Spark, Airflow'],
    benefits: [],
    pricing: {basic:'$299/mo', pro:'$799/mo', enterprise:'$2,499/mo'},
    contactInfo: {website:'/services/data-lineage-tracker', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🔗',
    href: '/services/data-lineage-tracker',
    popular: true,
    category: 'data',
    industry: 'Finance',
  },
  {
    id: 'data-quality-firewall',
    title: 'Data Quality Firewall',
    description: 'Validate data at ingestion boundaries with schema checks, range validation, referential integrity, and custom business rules. Rejects or quarantines bad data before it enters your warehouse.',
    features: ['Schema validation at ingest', 'Range and null checks', 'Referential integrity enforcement', 'Custom business rule engine', 'Quarantine and rejection with reason codes'],
    benefits: [],
    pricing: {basic:'$199/mo', pro:'$599/mo', enterprise:'$1,999/mo'},
    contactInfo: {website:'/services/data-quality-firewall', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🧱',
    href: '/services/data-quality-firewall',
    popular: true,
    category: 'data',
    industry: 'Healthcare',
  },
  {
    id: 'data-catalog-auto-discovery',
    title: 'Data Catalog Auto-Discovery',
    description: 'Automatically discover, classify, and index data assets across databases, file stores, and APIs. AI-powered metadata enrichment with PII detection and usage statistics.',
    features: ['Automatic data source scanning', 'PII and sensitivity classification', 'AI-powered metadata enrichment', 'Usage statistics and popularity ranking', 'Self-service search and discovery portal'],
    benefits: [],
    pricing: {basic:'$299/mo', pro:'$799/mo', enterprise:'$2,499/mo'},
    contactInfo: {website:'/services/data-catalog-auto-discovery', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '📚',
    href: '/services/data-catalog-auto-discovery',
    popular: false,
    category: 'data',
    industry: 'General',
  },
  {
    id: 'data-pipeline-retry-engine',
    title: 'Data Pipeline Retry Engine',
    description: 'Intelligent retry management for data pipelines with exponential backoff, error classification, and dead-letter handling. Learns from failure patterns to optimize retry strategies.',
    features: ['Error classification and categorization', 'Adaptive exponential backoff', 'Dead-letter queue management', 'Failure pattern learning and optimization', 'Retry budget and circuit breaker controls'],
    benefits: [],
    pricing: {basic:'$149/mo', pro:'$449/mo', enterprise:'$1,499/mo'},
    contactInfo: {website:'/services/data-pipeline-retry-engine', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🔄',
    href: '/services/data-pipeline-retry-engine',
    popular: false,
    category: 'data',
    industry: 'Technology',
  },
  {
    id: 'data-compression-optimizer',
    title: 'Data Compression Optimizer',
    description: 'Optimize storage costs with intelligent columnar encoding, adaptive compression selection, and tiered storage policies. Benchmarks compression ratios vs query performance trade-offs.',
    features: ['Adaptive compression algorithm selection', 'Columnar encoding optimization', 'Query performance vs compression trade-off analysis', 'Tiered storage policy automation', 'Storage savings dashboard and reporting'],
    benefits: [],
    pricing: {basic:'$199/mo', pro:'$599/mo', enterprise:'$1,999/mo'},
    contactInfo: {website:'/services/data-compression-optimizer', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🗜️',
    href: '/services/data-compression-optimizer',
    popular: false,
    category: 'data',
    industry: 'Technology',
  },
"""

AUTO_NEW = """,
  {
    id: 'automation-digital-twin-simulator',
    title: 'Automation Digital Twin Simulator',
    description: 'Create digital twins of business processes for simulation and optimization before real deployment. Test automation changes safely with what-if scenarios and performance predictions.',
    features: ['Process digital twin creation', 'What-if scenario simulation', 'Performance prediction and bottleneck detection', 'Safe testing before production deployment', 'Continuous sync with live process metrics'],
    benefits: [],
    pricing: {basic:'$399/mo', pro:'$999/mo', enterprise:'$2,999/mo'},
    contactInfo: {website:'/services/automation-digital-twin-simulator', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '👯',
    href: '/services/automation-digital-twin-simulator',
    popular: true,
    category: 'automation',
    industry: 'Manufacturing',
  },
  {
    id: 'automation-event-correlator',
    title: 'Automation Event Correlator',
    description: 'Deduplicate, correlate, and enrich operational events to reduce alert noise by 90%. Groups related events into incidents with root-cause hints and smart escalation rules.',
    features: ['Event deduplication and suppression', 'Cross-source correlation engine', 'Root-cause hint generation', 'Smart escalation rules by severity', 'Alert noise reduction metrics and dashboard'],
    benefits: [],
    pricing: {basic:'$299/mo', pro:'$799/mo', enterprise:'$2,499/mo'},
    contactInfo: {website:'/services/automation-event-correlator', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '📡',
    href: '/services/automation-event-correlator',
    popular: true,
    category: 'automation',
    industry: 'Technology',
  },
  {
    id: 'automation-approval-chain-engine',
    title: 'Automation Approval Chain Engine',
    description: 'Configure multi-level approval workflows with conditional routing, delegation rules, and SLA timers. Supports parallel and sequential approvals with audit logging.',
    features: ['Multi-level sequential and parallel approvals', 'Conditional routing by amount, risk, or type', 'Delegation and out-of-office rules', 'SLA timers and escalation on timeout', 'Full audit trail and approval analytics'],
    benefits: [],
    pricing: {basic:'$149/mo', pro:'$449/mo', enterprise:'$1,499/mo'},
    contactInfo: {website:'/services/automation-approval-chain-engine', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '✅',
    href: '/services/automation-approval-chain-engine',
    popular: false,
    category: 'automation',
    industry: 'Finance',
  },
  {
    id: 'automation-patch-window-optimizer',
    title: 'Automation Patch Window Optimizer',
    description: 'Schedule and optimize patch deployment windows based on system criticality, user traffic patterns, and dependency ordering. Minimizes risk while maintaining compliance deadlines.',
    features: ['Traffic-pattern-aware scheduling', 'Dependency-ordered patch sequencing', 'Risk scoring per patch and target', 'Compliance deadline tracking', 'Canary deployment with automatic rollback'],
    benefits: [],
    pricing: {basic:'$199/mo', pro:'$599/mo', enterprise:'$1,999/mo'},
    contactInfo: {website:'/services/automation-patch-window-optimizer', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '🩹',
    href: '/services/automation-patch-window-optimizer',
    popular: false,
    category: 'automation',
    industry: 'General',
  },
  {
    id: 'automation-chatops-gateway',
    title: 'Automation ChatOps Gateway',
    description: 'Centralized hub for operational commands via Slack, Microsoft Teams, and Discord. Role-based command access, audit logging, and integration with CI/CD, monitoring, and incident tools.',
    features: ['Multi-platform support (Slack, Teams, Discord)', 'Role-based command access control', 'Command audit logging and replay', 'CI/CD pipeline trigger and monitoring', 'Incident management integration'],
    benefits: [],
    pricing: {basic:'$149/mo', pro:'$449/mo', enterprise:'$1,499/mo'},
    contactInfo: {website:'/services/automation-chatops-gateway', email:'commercial@ziontechgroup.com', phone:'+1 302 464 0950'},
    icon: '💬',
    href: '/services/automation-chatops-gateway',
    popular: false,
    category: 'automation',
    industry: 'Technology',
  },
"""

# Insert before the closing ] of each array
def insert_before_close(content, array_marker, new_entries):
    # Find the position of the next export after this array
    idx = content.find(array_marker)
    if idx == -1:
        print(f"WARNING: Cannot find {array_marker}")
        return content
    
    # Find the ]; that closes this array (search forward from marker)
    search_start = idx
    close_pos = content.find('];', search_start)
    if close_pos == -1:
        print(f"WARNING: Cannot find closing ]; for {array_marker}")
        return content
    
    # Make sure this is the right ]; (not from a nested array)
    # Simple heuristic: check if there's another export between marker and ];
    next_export = content.find('export const', search_start + 1)
    if next_export != -1 and next_export < close_pos:
        close_pos = content.find('];', next_export)
    
    # Check for stray commas at insertion point
    line_before = content[close_pos-5:close_pos]
    if line_before.strip().endswith(','):
        pass  # comma already there, just insert
    else:
        new_entries = "," + new_entries
    
    return content[:close_pos] + new_entries + content[close_pos:]

# Apply in reverse order (bottom to top)
content = insert_before_close(content, 'export const automationServices', AUTO_NEW)
content = insert_before_close(content, 'export const dataServices', DATA_NEW)
content = insert_before_close(content, 'export const securityServices', SECURITY_NEW)
content = insert_before_close(content, 'export const cloudServices', CLOUD_NEW)
content = insert_before_close(content, 'export const itServices', IT_NEW)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

# Count
total = content.count("id:")
print(f"✅ Added missing services. Total service entries: {total}")
