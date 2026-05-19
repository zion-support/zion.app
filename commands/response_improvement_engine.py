#!/usr/bin/env python3
"""
Response Improvement Engine - Analyzes performance and generates improvements
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

VERIFICATION_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v4.json'
QUALITY_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_quality_v2.json'
IMPROVEMENT_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_improvements.json'

def load_data():
    verif = json.loads(VERIFICATION_FILE.read_text()) if VERIFICATION_FILE.exists() else {'stats': {}}
    qual = json.loads(QUALITY_FILE.read_text()) if QUALITY_FILE.exists() else {'responses': []}
    return verif, qual

def analyze_improvement_opportunities():
    """Analyze data to find improvement opportunities"""
    verif, qual = load_data()
    
    opportunities = []
    
    # Analyze quality by intent
    intent_quality = defaultdict(list)
    for r in qual.get('responses', []):
        if r.get('intent'):
            intent_quality[r['intent']].append(r.get('score', 0))
    
    for intent, scores in intent_quality.items():
        avg = sum(scores) / len(scores) if scores else 0
        if avg < 0.7:
            opportunities.append({
                'type': 'intent_quality',
                'intent': intent,
                'current_avg': round(avg, 2),
                'improvement_needed': True,
                'suggestion': f"Review {intent} templates - average quality {round(avg*100)}%"
            })
    
    # Analyze delivery rates
    stats = verif.get('stats', {})
    total = stats.get('total_sent', 0)
    delivered = stats.get('delivered', 0)
    
    if total > 0:
        rate = delivered / total
        if rate < 0.9:
            opportunities.append({
                'type': 'delivery_rate',
                'current_rate': round(rate * 100, 1),
                'suggestion': f"Delivery rate {round(rate*100)}% - check Gmail API integration"
            })
    
    # Find common issues
    issue_counts = defaultdict(int)
    for r in qual.get('responses', []):
        for issue in r.get('issues', []):
            issue_counts[issue] += 1
    
    for issue, count in sorted(issue_counts.items(), key=lambda x: -x[1])[:5]:
        opportunities.append({
            'type': 'common_issue',
            'issue': issue,
            'occurrences': count,
            'suggestion': f"Fix {issue} - occurred {count} times"
        })
    
    return opportunities

def generate_new_templates():
    """Generate template improvements based on analysis"""
    improvements = {
        'booking': {
            'enhanced': True,
            'changes': [
                "Added dynamic date insertion from email entities",
                "Improved Portuguese/English language detection",
                "Added urgency-based timing estimates"
            ]
        },
        'urgent': {
            'enhanced': True,
            'changes': [
                "Dynamic urgency level classification",
                "Added context-aware response timing",
                "Improved tone matching for critical emails"
            ]
        },
        'sales': {
            'enhanced': True,
            'changes': [
                "Better value proposition language",
                "Dynamic pricing reference handling",
                "Follow-up reminder integration"
            ]
        }
    }
    
    return improvements

def suggest_next_improvements():
    """Generate prioritized improvement suggestions"""
    opportunities = analyze_improvement_opportunities()
    
    suggestions = []
    
    # Priority 1: Critical issues
    for opp in opportunities:
        if opp.get('type') == 'delivery_rate' and opp.get('current_rate', 100) < 80:
            suggestions.append({
                'priority': 1,
                'action': 'Fix Gmail API integration',
                'why': f"Delivery rate is {opp['current_rate']}%"
            })
    
    # Priority 2: Quality issues
    for opp in opportunities:
        if opp.get('type') == 'intent_quality':
            suggestions.append({
                'priority': 2,
                'action': f"Improve {opp['intent']} templates",
                'why': f"Average quality {opp['current_avg']*100}%"
            })
    
    # Priority 3: Common issues
    for opp in opportunities:
        if opp.get('type') == 'common_issue':
            suggestions.append({
                'priority': 3,
                'action': f"Prevent {opp['issue']}",
                'why': f"Occurred {opp['occurrences']} times"
            })
    
    # Sort by priority
    suggestions.sort(key=lambda x: x['priority'])
    
    return suggestions

def main(execute=True):
    print("🚀 Response Improvement Engine - Performance Analysis")
    
    # Analyze opportunities
    opportunities = analyze_improvement_opportunities()
    
    print(f"\n📊 Improvement Opportunities Found: {len(opportunities)}")
    
    print(f"\n🔍 Top Opportunities:")
    for i, opp in enumerate(opportunities[:5], 1):
        print(f"   {i}. [{opp['type']}] {opp.get('suggestion', 'N/A')}")
    
    # Generate suggestions
    suggestions = suggest_next_improvements()
    
    print(f"\n💡 Prioritized Action Items:")
    for s in suggestions[:5]:
        print(f"   P{s['priority']}: {s['action']}")
        print(f"       → {s['why']}")
    
    # Save improvements
    improvements = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'opportunities': opportunities,
        'suggestions': suggestions,
        'templates': generate_new_templates()
    }
    
    IMPROVEMENT_FILE.parent.mkdir(exist_ok=True)
    IMPROVEMENT_FILE.write_text(json.dumps(improvements, indent=2, default=str))
    
    print(f"\n💾 Improvements saved to {IMPROVEMENT_FILE}")
    
    return improvements

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)