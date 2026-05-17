#!/usr/bin/env python3
"""Force-add 3 missing IT services to zion.app file before the IT closing bracket"""

ZION = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(ZION, 'r') as f:
    content = f.read()

# Unique pattern: the DataOps service closing right before IT array ends
old = """'Scale data infrastructure with your growth'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];"""

new_services = """'Scale data infrastructure with your growth'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-devsecops-1',
    title: 'DevSecOps & Security Automation',
    subtitle: 'Integrate security into every stage of your software delivery pipeline',
    category: 'it',
    subcategory: 'Security Automation',
    description: 'Embed security into CI/CD pipelines with automated SAST, DAST, SCA, container scanning, and infrastructure-as-code security checks — shifting security left without slowing delivery.',
    features: [
      'Automated SAST/DAST scanning in CI/CD',
      'Software composition analysis (SCA) for dependencies',
      'Container and Kubernetes security scanning',
      'Infrastructure-as-code security validation (Terraform, CloudFormation)',
      'Secrets detection and rotation automation',
      'SBOM generation and vulnerability tracking',
      'Threat modeling automation',
      'Compliance-as-code policy enforcement'
    ],
    benefits: [
      'Catch vulnerabilities 10x earlier and 100x cheaper',
      'Automate compliance evidence collection',
      'Deploy faster with confidence, not fear',
      'Reduce security incident risk by 80%'
    ],
    pricing: { Starter: '$1,499/mo', Professional: '$4,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-platform-engineering-1',
    title: 'Internal Developer Platform (IDP) Engineering',
    subtitle: 'Build a self-service developer platform that boosts engineering productivity by 40%',
    category: 'it',
    subcategory: 'Platform Engineering',
    description: 'Design and build an Internal Developer Platform (IDP) that provides self-service capabilities for developers — spinning up environments, deploying applications, and managing infrastructure through golden paths.',
    features: [
      'Self-service environment provisioning (Backstage, Port, or custom)',
      'Golden path templates for common architectures',
      'Internal API marketplace and service catalog',
      'Automated deployment pipelines per service type',
      'Developer portal with documentation and onboarding',
      'Abstractions over cloud services for simplicity',
      'Usage tracking and cost attribution per team',
      'Platform observability and SLO management'
    ],
    benefits: [
      'Reduce time-to-first-deploy from weeks to hours',
      'Empower developers to self-serve without ops bottlenecks',
      'Standardize best practices across all teams',
      'Improve developer satisfaction and retention'
    ],
    pricing: { Starter: '$2,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'cloud-finops-1',
    title: 'Cloud FinOps & Cost Intelligence',
    subtitle: 'Bring financial accountability to cloud spend with automated cost optimization and FinOps practices',
    category: 'it',
    subcategory: 'Cloud FinOps',
    description: 'Comprehensive cloud cost management service combining automated tooling, reserved instance optimization, anomaly detection, and organizational FinOps culture to reduce cloud spend by 30-40% without performance impact.',
    features: [
      'Multi-cloud cost visibility and chargeback/showback',
      'AI-driven rightsizing recommendations',
      'Automated reserved instance and savings plan optimization',
      'Real-time cost anomaly detection and budget alerts',
      'Kubernetes cost optimization (HPA, node optimization)',
      'Tag governance and resource ownership tracking',
      'FinOps maturity assessment and roadmap',
      'Monthly cost optimization reviews and savings tracking'
    ],
    benefits: [
      'Reduce cloud spend by 30-40% sustainably',
      'Eliminate cloud waste and orphaned resources',
      'Allocate costs accurately to teams and projects',
      'Build a culture of cloud cost awareness'
    ],
    pricing: { Starter: '$999/mo', Professional: '$3,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];"""

if old in content:
    content = content.replace(old, new_services)
    with open(ZION, 'w') as f:
        f.write(content)
    print("✅ Added 3 missing IT services to zion.app")
else:
    print("⚠️ Could not find the unique pattern. Listing nearby content:")
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        if 'Scale data infrastructure' in line:
            for j in range(max(1, i-2), min(len(lines)+1, i+30)):
                print(f"  {j}: {lines[j-1]}")
            break

# Verify
with open(ZION, 'r') as f:
    new_content = f.read()
for sid in ['it-devsecops-1', 'it-platform-engineering-1', 'cloud-finops-1']:
    if sid in new_content:
        print(f"  ✅ {sid} now present in zion.app")
    else:
        print(f"  ❌ {sid} STILL MISSING from zion.app")