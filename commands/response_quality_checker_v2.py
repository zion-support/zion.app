#!/usr/bin/env python3
"""
Response Quality Checker V2 - Validates responses and learns from feedback
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_batch_modify(*args): pass
    def gmail_get_or_create_label_id(n): return 'label_id'

QUALITY_FILE = WORKSPACE / 'zion.app' / 'data' / 'response_quality_v2.json'

QUALITY_CHECKS = {
    'tone_match': lambda orig, resp: abs(len(orig.split()) - len(resp.split())) < 50,
    'signature_present': lambda resp: 'Kleber' in resp and 'Zion' in resp,
    'language_match': lambda orig, resp: (
        any(w in orig.lower() for w in ['prezado', 'obrigado']) and 
        any(w in resp for w in ['Prezado', 'Atenciosamente'])
    ) or (
        any(w in orig.lower() for w in ['dear', 'thank']) and 
        any(w in resp for w in ['Dear', 'Best regards'])
    ),
    'no_placeholder_leak': lambda resp: '{name}' not in resp and '{date_ref}' not in resp,
    'appropriate_length': lambda resp: 50 < len(resp) < 500,
    'contains_contact_info': lambda resp: any(w in resp for w in ['kleber@ziontechgroup.com', 'Zion Tech Group'])
}

def check_response_quality(original_text, response_text, intent):
    """Run quality checks on response"""
    results = {}
    scores = []
    
    for check_name, check_fn in QUALITY_CHECKS.items():
        try:
            result = check_fn(original_text, response_text)
            results[check_name] = result
            if result:
                scores.append(1)
            else:
                scores.append(0)
        except Exception as e:
            results[check_name] = False
            scores.append(0)
    
    avg_score = sum(scores) / len(scores) if scores else 0
    
    return {
        'checks': results,
        'score': round(avg_score, 2),
        'quality': 'high' if avg_score >= 0.8 else 'medium' if avg_score >= 0.5 else 'low',
        'issues': [k for k, v in results.items() if not v]
    }

def analyze_response_feedback():
    """Analyze patterns in successful vs failed responses"""
    data = load_quality_data()
    
    high_quality = [r for r in data.get('responses', []) if r.get('quality') == 'high']
    low_quality = [r for r in data.get('responses', []) if r.get('quality') == 'low']
    
    patterns = {
        'high_count': len(high_quality),
        'low_count': len(low_quality),
        'improvement_areas': []
    }
    
    # Identify common issues in low quality
    issue_counts = {}
    for r in low_quality:
        for issue in r.get('issues', []):
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
    
    patterns['improvement_areas'] = sorted(issue_counts.items(), key=lambda x: -x[1])[:5]
    
    return patterns

def load_quality_data():
    if QUALITY_FILE.exists():
        return json.loads(QUALITY_FILE.read_text())
    return {'responses': [], 'patterns': {}}

def save_quality_data(data):
    QUALITY_FILE.parent.mkdir(exist_ok=True)
    QUALITY_FILE.write_text(json.dumps(data, indent=2, default=str))

def record_response(original_text, response_text, intent, confidence, quality_result):
    """Record response for pattern learning"""
    data = load_quality_data()
    
    data['responses'].append({
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'intent': intent,
        'confidence': confidence,
        'quality': quality_result['quality'],
        'score': quality_result['score'],
        'issues': quality_result['issues'],
        'original_preview': original_text[:100],
        'response_preview': response_text[:100]
    })
    
    # Keep last 500 responses
    data['responses'] = data['responses'][-500:]
    
    save_quality_data(data)

def suggest_improvements():
    """Generate improvement suggestions based on analysis"""
    patterns = analyze_response_feedback()
    
    suggestions = []
    
    for area, count in patterns.get('improvement_areas', []):
        if area == 'language_match':
            suggestions.append("Improve language detection - ensure Portuguese emails get PT responses")
        elif area == 'signature_present':
            suggestions.append("Enforce signature inclusion in all templates")
        elif area == 'no_placeholder_leak':
            suggestions.append("Add template validation to catch unfilled placeholders")
        elif area == 'appropriate_length':
            suggestions.append("Adjust template length - responses too short or too long")
    
    return suggestions

def main(execute=True):
    print("🔍 Response Quality Checker V2 - Validation & Learning")
    
    # Analyze feedback
    patterns = analyze_response_feedback()
    
    print(f"\n📊 Quality Analysis:")
    print(f"   High quality: {patterns['high_count']}")
    print(f"   Low quality: {patterns['low_count']}")
    
    print(f"\n🔧 Improvement Areas:")
    for area, count in patterns.get('improvement_areas', []):
        print(f"   - {area}: {count} incidents")
    
    suggestions = suggest_improvements()
    print(f"\n💡 Improvement Suggestions:")
    for i, s in enumerate(suggestions, 1):
        print(f"   {i}. {s}")
    
    return patterns

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)