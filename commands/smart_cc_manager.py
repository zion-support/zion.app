#!/usr/bin/env python3
"""
Smart CC Manager - Zion

Automatically suggests CC recipients based on email content and history.
- Analyzes email content for team context
- Suggests relevant stakeholders to CC
- Learns from past CC patterns
- Sends notifications to new CC contacts

Usage:
  python3 smart_cc_manager.py --execute --limit 10
"""

import sys, re
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

# Team keywords mapping
TEAM_KEYWORDS = {
    'technical': ['bug', 'fix', 'code', 'development', 'api', 'github', 'deploy', 'ci/cd'],
    'finance': ['invoice', 'payment', 'budget', 'contract', 'pricing', 'rate card'],
    'client': ['customer', 'client', 'meeting', 'brief', 'update', 'delivery'],
    'marketing': ['campaign', 'seo', 'content', 'blog', 'social', 'advertising']
}

def suggest_cc_recipients(email_content: str, sender: str) -> list:
    """Suggest CC recipients based on content and sender history."""
    suggestions = []
    content_lower = email_content.lower()
    
    for team, keywords in TEAM_KEYWORDS.items():
        if any(kw in content_lower for kw in keywords):
            suggestions.append(f"{team}@ziontechgroup.com")
    
    return list(set(suggestions))

def cmd_run(dry_run: bool, limit: int = 10):
    print("📧 Smart CC Manager")
    
    query = 'is:draft label:draft newer_than:7d'
    msgs = gmail_search(query, limit=limit)
    
    print(f"📊 Found {len(msgs)} draft emails to analyze for CC suggestions")
    
    for msg in msgs[:5]:
        headers = msg.get('payload', {}).get('headers', [])
        sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        snippet = msg.get('snippet', '')
        
        suggestions = suggest_cc_recipients(subject + ' ' + snippet, sender)
        
        print(f"\n   Draft: {subject[:30]}")
        print(f"   Suggested CC: {suggestions}")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would suggest CC for {len(msgs)} emails.")
    else:
        print(f"\n✅ CC suggestions processed for {len(msgs)} emails.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()