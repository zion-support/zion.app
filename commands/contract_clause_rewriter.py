#!/usr/bin/env python3
"""
Contract Clause Rewriter - Zion

Improves contract language for clarity, legality, and negotiation advantage.
- Detects problematic clauses
- Suggests improvements
- Generates alternative phrasing

Usage:
  python3 contract_clause_rewriter.py --file path/to/contract.docx
  python3 contract_clause_rewriter.py --text "Original clause text here"
"""

import sys, re
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

CLAUSE_PATTERNS = {
    'liability': [
        (r'maximum liability.*\$[0-9]+', 'Increase liability cap from ${match} to ${new} for better protection'),
        (r'shall not be liable', 'Consider "limited liability" instead of full exemption for better negotiation position')
    ],
    'termination': [
        (r'may terminate.*upon (30|60|90) days', 'Consider shortening termination notice to 15 days for flexibility'),
        (r'for cause', 'Define "cause" explicitly to avoid ambiguity')
    ],
    'payment': [
        (r'net ([30|60|90]) days', 'Consider net 15 terms for faster cash flow'),
        (r'due upon receipt', 'Consider net 30 with late fee clause for better protection')
    ],
    'confidentiality': [
        (r'perpetual confidentiality', 'Consider 2-5 year term instead of perpetual for better negotiation position'),
        (r'including but not limited to', 'Simplify to "including" for clarity')
    ]
}

def analyze_clause(text: str) -> dict:
    """Analyze contract clause and suggest improvements."""
    suggestions = []
    
    for category, patterns in CLAUSE_PATTERNS.items():
        for pattern, suggestion_template in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                suggestion = suggestion_template.replace('${match}', match.group(0))
                suggestions.append({
                    'category': category,
                    'original': match.group(0),
                    'suggestion': suggestion
                })
    
    return {
        'analysis': suggestions,
        'improvement_score': min(100, len(suggestions) * 20)
    }

def rewrite_clause(text: str) -> str:
    """Rewrite clause with suggested improvements."""
    # Simplified rewrite logic
    text = re.sub(r'\bshall not be liable\b', 'shall have limited liability', text, flags=re.IGNORECASE)
    text = re.sub(r'\bincluding but not limited to\b', 'including', text, flags=re.IGNORECASE)
    text = re.sub(r'\bperpetual\b', '2-year', text, flags=re.IGNORECASE)
    return text

def cmd_run(text: str = None, dry_run: bool = True):
    print("📝 Contract Clause Rewriter")
    
    if not text:
        print("Usage: python3 contract_clause_rewriter.py --text 'clause text'")
        return
    
    result = analyze_clause(text)
    
    print(f"\n📊 Improvement Score: {result['improvement_score']}/100")
    print("\n💡 Suggestions:")
    for s in result['analysis'][:3]:
        print(f"   [{s['category']}] {s['suggestion']}")
    
    if dry_run:
        print(f"\n📄 Rewritten (dry-run): {rewrite_clause(text)[:100]}...")
    else:
        print(f"\n✅ Rewritten: {rewrite_clause(text)}")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--text', help='Contract clause text to analyze')
    p.add_argument('--file', help='Path to contract file')
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    
    text = args.text or ''
    if args.file:
        text = Path(args.file).read_text()
    
    if text:
        cmd_run(text=text, dry_run=not args.execute)

if __name__ == '__main__':
    main()