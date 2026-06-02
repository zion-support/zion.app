#!/usr/bin/env python3
"""Insert Wave 152 services into the correct arrays in servicesData.ts"""
import re

with open('app/data/servicesData.ts') as f:
    content = f.read()

changes = 0

# ===== 1. aiServices: replace the closing }]; with new entries + ]; =====
ai_marker = 'industry: "Finance"  }];'
ai_replacement = """industry: "Finance"  },
  {
    id: 'micro-saas-ai-url-monitor',
    title: 'AI Website Uptime & Performance Monitor',
    description: 'Monitor website uptime, performance, and SEO health from 50+ global locations.',
    features: ["Uptime monitoring from 50+ locations", "Core Web Vitals scoring", "AI anomaly detection", "Auto-remediation", "SSL monitoring", "DNS monitoring", "Status page", "Post-mortem templates"],
    benefits: ["Detect outages in 60 seconds", "Predict issues before downtime", "Auto-fix common problems", "Maintain SEO rankings"],
    pricing: { basic: '$29/mo', pro: '$89/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/micro-saas-ai-url-monitor', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔎', href: '/services/micro-saas-ai-url-monitor', popular: true, category: 'ai', industry: 'technology',
  },
  {
    id: 'micro-saas-ai-customer-feedback',
    title: 'AI Customer Feedback Analyzer & NPS Platform',
    description: 'Collect, analyze, and act on customer feedback from all channels.',
    features: ["Multi-channel collection", "AI theme extraction", "Sentiment analysis", "NPS/CSAT scoring", "Automated follow-up", "CRM integration", "Executive dashboard", "Custom alerts"],
    benefits: ["Real-time sentiment insights", "Identify issues before escalation", "Increase NPS by 15+ points", "Unify all feedback channels"],
    pricing: { basic: '$99/mo', pro: '$299/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/micro-saas-ai-customer-feedback', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💬', href: '/services/micro-saas-ai-customer-feedback', popular: true, category: 'ai', industry: 'customer-success',
  },
  {
    id: 'micro-saas-ai-subscription-analytics',
    title: 'AI Subscription Analytics & Revenue Intelligence',
    description: 'Deep analytics for subscription businesses including MRR, churn, and LTV.',
    features: ["MRR/ARR analysis", "Cohort retention", "AI churn prediction", "Expansion revenue ID", "Pricing optimization", "Stripe integration", "Board reports", "Scenario modeling"],
    benefits: ["120%+ net revenue retention", "Predict churn 60 days ahead", "Data-driven pricing", "Automated board reporting"],
    pricing: { basic: '$149/mo', pro: '$449/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/micro-saas-ai-subscription-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈', href: '/services/micro-saas-ai-subscription-analytics', popular: false, category: 'ai', industry: 'finance',
  },
  {
    id: 'micro-saas-ai-legal-doc-review',
    title: 'AI Legal Document Review & Due Diligence',
    description: 'AI-powered legal document review for M&A due diligence and contract analysis.',
    features: ["Bulk document upload", "Clause extraction", "Redline comparison", "M&A checklist", "Compliance analysis", "Privilege log", "Legal tool integration", "Audit trail"],
    benefits: ["90% faster review", "Catch risky clauses", "Accelerate M&A timelines", "60% lower legal costs"],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/micro-saas-ai-legal-doc-review', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️', href: '/services/micro-saas-ai-legal-doc-review', popular: false, category: 'ai', industry: 'legal-tech',
  },
  {
    id: 'micro-saas-ai-event-planner',
    title: 'AI Event Planning & Management Platform',
    description: 'Plan and manage events with AI assistance for logistics, budgeting, and marketing.',
    features: ["AI venue recommendation", "Budget tracking", "AI marketing content", "Registration/ticketing", "Attendee matchmaking", "Live polling", "ROI analytics", "Zoom integration"],
    benefits: ["5x faster planning", "30% cost reduction", "Increased attendance", "Measurable ROI"],
    pricing: { basic: '$199/mo', pro: '$599/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/micro-saas-ai-event-planner', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎉', href: '/services/micro-saas-ai-event-planner', popular: false, category: 'ai', industry: 'events',
  },
  {
    id: 'ai-hr-talent-analytics',
    title: 'AI HR Talent Analytics & Workforce Planning',
    description: 'AI-powered workforce analytics for hiring, retention, and organizational planning.',
    features: ["Attrition prediction", "High-potential ID", "Workforce forecasting", "Compensation benchmarking", "DEI analytics", "Engagement trends", "Workday integration", "Manager dashboards"],
    benefits: ["20-30% lower attrition", "6-month flight risk prediction", "Data-driven planning", "Improved DEI"],
    pricing: { basic: '$1,499/mo', pro: '$3,999/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-hr-talent-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👥', href: '/services/ai-hr-talent-analytics', popular: false, category: 'ai', industry: 'hr-tech',
  },
  {
    id: 'ai-medical-imaging-assistant',
    title: 'AI Medical Imaging Analysis Assistant',
    description: 'AI-powered medical imaging analysis for X-rays, CT scans, MRIs, and pathology.',
    features: ["X-ray/CT/MRI analysis", "Anomaly detection", "Priority flagging", "Report generation", "PACS integration", "Longitudinal comparison", "QA tools", "HIPAA compliant"],
    benefits: ["95%+ sensitivity", "40% faster reading", "Urgent case flagging", "Consistent diagnostics"],
    pricing: { basic: '$4,999/mo', pro: '$12,000/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/ai-medical-imaging-assistant', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏥', href: '/services/ai-medical-imaging-assistant', popular: false, category: 'ai', industry: 'healthcare',
  }
];"""

if ai_marker in content:
    content = content.replace(ai_marker, ai_replacement, 1)
    changes += 7
    print("✅ aiServices: 7 entries added")
else:
    print("❌ aiServices marker not found")

# ===== 2. itServices: insert before ]; =====
it_export = content.find('export const itServices')
cloud_export = content.find('export const cloudServices')
it_close = content.rfind('];', it_export, cloud_export)
if it_close != -1:
    it_new = """,
  {
    id: 'it-data-warehouse',
    title: 'IT Data Warehouse & Lakehouse Architecture',
    description: 'Design and implement modern data warehouse and lakehouse solutions.',
    features: ["Warehouse architecture", "ETL/ELT pipelines", "Lakehouse setup", "Data governance", "Streaming ingestion", "Data quality", "Cost optimization", "Legacy migration"],
    benefits: ["Unify all data sources", "Query petabytes in seconds", "40% cost reduction", "Self-service analytics"],
    pricing: { basic: '$5,000/mo', pro: '$12,000/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-data-warehouse', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏗️', href: '/services/it-data-warehouse', popular: true, category: 'it', industry: 'technology',
  },
  {
    id: 'it-network-monitoring',
    title: 'IT Network Monitoring & Performance Management',
    description: '24/7 network monitoring with AI-powered anomaly detection.',
    features: ["Network topology mapping", "AI anomaly detection", "Bandwidth monitoring", "SNMP/NetFlow support", "Automated alerting", "Capacity planning", "Cloud monitoring", "Custom dashboards"],
    benefits: ["Detect issues before users notice", "70% faster resolution", "Optimize bandwidth costs", "Data-driven capacity planning"],
    pricing: { basic: '$1,500/mo', pro: '$4,000/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-network-monitoring', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐', href: '/services/it-network-monitoring', popular: false, category: 'it', industry: 'technology',
  }
"""
    content = content[:it_close] + it_new + content[it_close:]
    changes += 2
    print("✅ itServices: 2 entries added")
else:
    print("❌ itServices closing not found")

# ===== 3. securityServices: insert before ]; =====
sec_export = content.find('export const securityServices')
data_export = content.find('export const dataServices')
sec_close = content.rfind('];', sec_export, data_export)
if sec_close != -1:
    sec_new = """,
  {
    id: 'it-vulnerability-management',
    title: 'IT Vulnerability Management & Penetration Testing',
    description: 'Continuous vulnerability scanning with quarterly pen testing.',
    features: ["Continuous scanning", "Risk-based prioritization", "Quarterly pen testing", "Web app assessment", "Red team exercises", "Remediation guidance", "Compliance reporting", "Executive dashboards"],
    benefits: ["Find vulns before attackers", "Prioritize by actual risk", "Meet compliance requirements", "Quantify security posture"],
    pricing: { basic: '$2,000/mo', pro: '$5,000/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-vulnerability-management', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍', href: '/services/it-vulnerability-management', popular: true, category: 'security', industry: 'technology',
  }
"""
    content = content[:sec_close] + sec_new + content[sec_close:]
    changes += 1
    print("✅ securityServices: 1 entry added")
else:
    print("❌ securityServices closing not found")

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

# Verify
ids = re.findall(r"id: '([^']+)'", content)
print(f"\nTotal id: entries: {len(ids)}")
for sid in ['micro-saas-ai-url-monitor', 'it-data-warehouse', 'it-vulnerability-management', 'ai-hr-talent-analytics', 'ai-medical-imaging-assistant']:
    print(f"  {sid}: {'YES' if sid in ids else 'NO'}")
