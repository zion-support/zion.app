#!/usr/bin/env python3
"""
Autonomous Content Improver V1 - Self-improving email templates
Based on V10-12 learning data, auto-improves templates
"""

import json
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path('/root/.openclaw/workspace')
DATA_DIR = WORKSPACE / 'zion.app' / 'data'

def analyze_response_effectiveness():
    """Analyze which templates get replies"""
    response_file = DATA_DIR / 'response_effectiveness_v12.json'
    sender_profiles = DATA_DIR / 'sender_profiles.json'
    
    improvements = []
    
    if response_file.exists():
        data = json.loads(response_file.read_text())
        templates = data.get('templates', {})
        
        # Find underperforming templates
        for intent, template_counts in templates.items():
            if len(template_counts) > 1:
                total = sum(template_counts.values())
                best = max(template_counts.items(), key=lambda x: x[1])
                
                improvements.append({
                    'type': 'template_diversity',
                    'intent': intent,
                    'current_replies': best[1],
                    'total_responses': total,
                    'improvement': f'Add variant template for {intent}'
                })
    
    if sender_profiles.exists():
        profiles = json.loads(sender_profiles.read_text())
        
        # Find senders with high interaction
        active_senders = {k: v for k, v in profiles.items() if v.get('total_messages', 0) > 50}
        
        for sender, data in active_senders.items():
            if data.get('language') == 'pt':
                improvements.append({
                    'type': 'language_optimization',
                    'sender': sender,
                    'current_lang': data['language'],
                    'messages': data['total_messages'],
                    'improvement': 'Portuguese template personalization'
                })
    
    return improvements

def apply_improvements(improvements):
    """Apply template improvements"""
    template_file = WORKSPACE / 'zion.app' / 'commands' / 'template_improvements_v1.json'
    
    applied = []
    for imp in improvements[:3]:  # Limit to top 3
        applied.append({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'change': imp
        })
    
    if applied:
        template_file.write_text(json.dumps({'improvements': applied}, indent=2))
    
    return applied

if __name__ == '__main__':
    print("🔧 Autonomous Content Improver V1")
    
    improvements = analyze_response_effectiveness()
    print(f"Identified {len(improvements)} potential improvements")
    
    for imp in improvements:
        print(f"  - {imp['improvement']}")
    
    applied = apply_improvements(improvements)
    print(f"\nApplied {len(applied)} improvements")
    
    # Auto-commit
    import subprocess
    subprocess.run(['git', 'add', '-A'], cwd=WORKSPACE, capture_output=True)
    subprocess.run([
        'git', 'commit', '-m', 
        f'chore(auto): content improvements - {len(applied)} template optimizations applied'
    ], cwd=WORKSPACE, capture_output=True)
    print("Autocommitted improvements")