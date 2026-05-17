#!/usr/bin/env python3
"""Fix remaining missing services in both files"""

ZION = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
GIT  = '/Users/klebergarciaalcatrao/app/data/servicesData.ts'

# Services missing from zion.app IT section
missing_it = [
    {
        "id": "it-devsecops-1",
        "title": "DevSecOps & Security Automation",
        "subtitle": "Integrate security into every stage of your software delivery pipeline",
        "category": "it",
        "subcategory": "Security Automation",
        "description": "Embed security into CI/CD pipelines with automated SAST, DAST, SCA, container scanning, and infrastructure-as-code security checks — shifting security left without slowing delivery.",
        "features": [
            "Automated SAST/DAST scanning in CI/CD",
            "Software composition analysis (SCA) for dependencies",
            "Container and Kubernetes security scanning",
            "Infrastructure-as-code security validation (Terraform, CloudFormation)",
            "Secrets detection and rotation automation",
            "SBOM generation and vulnerability tracking",
            "Threat modeling automation",
            "Compliance-as-code policy enforcement"
        ],
        "benefits": [
            "Catch vulnerabilities 10x earlier and 100x cheaper",
            "Automate compliance evidence collection",
            "Deploy faster with confidence, not fear",
            "Reduce security incident risk by 80%"
        ],
        "pricing": {"Starter": "$1,499/mo", "Professional": "$4,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "it-platform-engineering-1",
        "title": "Internal Developer Platform (IDP) Engineering",
        "subtitle": "Build a self-service developer platform that boosts engineering productivity by 40%",
        "category": "it",
        "subcategory": "Platform Engineering",
        "description": "Design and build an Internal Developer Platform (IDP) that provides self-service capabilities for developers — spinning up environments, deploying applications, and managing infrastructure through golden paths.",
        "features": [
            "Self-service environment provisioning (Backstage, Port, or custom)",
            "Golden path templates for common architectures",
            "Internal API marketplace and service catalog",
            "Automated deployment pipelines per service type",
            "Developer portal with documentation and onboarding",
            "Abstractions over cloud services for simplicity",
            "Usage tracking and cost attribution per team",
            "Platform observability and SLO management"
        ],
        "benefits": [
            "Reduce time-to-first-deploy from weeks to hours",
            "Empower developers to self-serve without ops bottlenecks",
            "Standardize best practices across all teams",
            "Improve developer satisfaction and retention"
        ],
        "pricing": {"Starter": "$2,999/mo", "Professional": "$8,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "cloud-finops-1",
        "title": "Cloud FinOps & Cost Intelligence",
        "subtitle": "Bring financial accountability to cloud spend with automated cost optimization and FinOps practices",
        "category": "it",
        "subcategory": "Cloud FinOps",
        "description": "Comprehensive cloud cost management service combining automated tooling, reserved instance optimization, anomaly detection, and organizational FinOps culture to reduce cloud spend by 30-40% without performance impact.",
        "features": [
            "Multi-cloud cost visibility and chargeback/showback",
            "AI-driven rightsizing recommendations",
            "Automated reserved instance and savings plan optimization",
            "Real-time cost anomaly detection and budget alerts",
            "Kubernetes cost optimization (HPA, node optimization)",
            "Tag governance and resource ownership tracking",
            "FinOps maturity assessment and roadmap",
            "Monthly cost optimization reviews and savings tracking"
        ],
        "benefits": [
            "Reduce cloud spend by 30-40% sustainably",
            "Eliminate cloud waste and orphaned resources",
            "Allocate costs accurately to teams and projects",
            "Build a culture of cloud cost awareness"
        ],
        "pricing": {"Starter": "$999/mo", "Professional": "$3,499/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    }
]

def fmt_it_zion(svc):
    lines = []
    lines.append("  {")
    lines.append(f'    id: \'{svc["id"]}\',')
    lines.append(f'    title: \'{svc["title"]}\',')
    lines.append(f'    subtitle: \'{svc["subtitle"]}\',')
    lines.append(f"    category: '{svc['category']}',")
    lines.append(f"    subcategory: '{svc['subcategory']}',")
    lines.append(f'    description: `{svc["description"]}`')
    lines.append("    features: [")
    for f_ in svc["features"]:
        lines.append(f"      '{f_}',")
    lines.append("    ],")
    lines.append("    benefits: [")
    for b_ in svc["benefits"]:
        lines.append(f"      '{b_}',")
    lines.append("    ],")
    lines.append("    pricing: {")
    lines.append(f"      Starter: '{svc['pricing']['Starter']}',")
    lines.append(f"      Professional: '{svc['pricing']['Professional']}',")
    lines.append(f"      Enterprise: '{svc['pricing']['Enterprise']}'")
    lines.append("    },")
    lines.append(f"    contactUrl: '{svc['contactUrl']}'")
    lines.append("  }")
    return "\n".join(lines)


def fix_zion():
    with open(ZION, 'r') as f:
        content = f.read()

    original = content

    # Find the IT section closing: "  }\n];\n\n// ═══════════ SECTION 3"
    # Insert missing IT services before the ];
    insertion = ""
    for svc in missing_it:
        insertion += ",\n" + fmt_it_zion(svc)

    # Find and replace the closing of IT array
    # Look for: "  }\n];\n\n// ═══════════════════════\n// SECTION 3"
    pattern = "  }\n];\n\n// ═══════════════════════════════════════\n// SECTION 3: MICRO SAAS SOLUTIONS"
    if pattern in content:
        content = content.replace(
            pattern,
            insertion + ",\n  }\n];\n\n// ═══════════════════════════════════════\n// SECTION 3: MICRO SAAS SOLUTIONS"
        )
        print("✅ Added 3 missing IT services to zion.app")
    else:
        # Try alternate pattern
        pattern2 = "  }\n];\n"
        if pattern2 in content:
            # Find the one right before SECTION 3
            idx = content.find("// ═══════════════════════════════════════\n// SECTION 3")
            if idx > 0:
                # Find the ]; before this
                before = content[:idx]
                last_close = before.rfind("];\n")
                if last_close > 0:
                    new_before = before[:last_close] + insertion + ",\n" + before[last_close:]
                    content = new_before + content[idx:]
                    print("✅ Added 3 missing IT services to zion.app (alt method)")
                else:
                    print("⚠️ Could not find insertion point")
        else:
            print("⚠️ Pattern not found in zion.app")

    with open(ZION, 'w') as f:
        f.write(content)

    # Verify
    with open(ZION, 'r') as f:
        new_content = f.read()

    for svc in missing_it:
        if svc['id'] in new_content:
            print(f"  ✅ {svc['id']} now present in zion.app")
        else:
            print(f"  ❌ {svc['id']} STILL MISSING from zion.app")


def fix_git_tracked():
    with open(GIT, 'r') as f:
        content = f.read()

    # Check if the IT section has proper closing braces
    # The issue is at line 5482 - missing }, between mainframe and devsecops
    # Look for: href: '/it-services/it-mainframe-modernization',\n    category: 'it'\n  }\n  {\n    id: 'it-devsecops-1'
    # Should be: ...category: 'it'\n  },\n  {\n    id: 'it-devsecops-1'

    broken_pattern = "href: '/it-services/it-mainframe-modernization',\n    category: 'it'\n  }\n  {\n    id: 'it-devsecops-1'"
    fixed = "href: '/it-services/it-mainframe-modernization',\n    category: 'it'\n  },\n  {\n    id: 'it-devsecops-1'"

    if broken_pattern in content:
        content = content.replace(broken_pattern, fixed)
        print("✅ Fixed missing comma in git-tracked file (mainframe -> devsecops)")
    else:
        print("⚠️ Pattern not found (may already be fixed)")

    with open(GIT, 'w') as f:
        f.write(content)

    # Verify all new IT services exist
    new_it_ids = ['it-devsecops-1', 'it-platform-engineering-1', 'it-observability-1',
                  'cloud-finops-1', 'it-zero-trust-1']
    for sid in new_it_ids:
        if sid in content:
            print(f"  ✅ {sid} present in git-tracked file")
        else:
            print(f"  ❌ {sid} MISSING from git-tracked file")


if __name__ == '__main__':
    print("=== Fixing zion.app file ===")
    fix_zion()
    print("\n=== Fixing git-tracked file ===")
    fix_git_tracked()
    print("\n✅ Done")