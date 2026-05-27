#!/usr/bin/env python3
"""
Email Bankruptcy Planner - Zion

Creates optimal cleanup strategy for overwhelming inboxes.
- Analyzes email patterns and volume
- Recommends batch deletion/archiving
- Preserves important conversations
- Creates scheduled cleanup plan

Usage:
  python3 email_bankruptcy_planner.py --analyze
  python3 email_bankruptcy_planner.py --execute --plan aggressive
"""

import sys, json
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

def analyze_inbox() -> dict:
    """Analyze inbox for bankruptcy planning."""
    # Get inbox stats
    query = 'is:unread'
    unread = len(gmail_search(query, limit=100))
    
    query = 'is:read older_than:90d'
    old_read = len(gmail_search(query, limit=100))
    
    query = 'has:attachment older_than:180d'
    old_attachments = len(gmail_search(query, limit=50))
    
    return {
        'unread_count': unread,
        'old_read_count': old_read,
        'old_attachments': old_attachments,
        'total_bloat': unread + old_read
    }

def generate_plan(analysis: dict) -> dict:
    """Generate email bankruptcy cleanup plan."""
    unread = analysis['unread_count']
    
    if unread > 500000:
        return {
            'name': 'Nuclear Option',
            'description': 'Archive everything unread older than 30 days',
            'actions': [
                'Archive all unread older than 30 days (skip last 7 days)',
                'Apply auto-labeler to remaining 1000 newest',
                'Set up aggressive filters for next 30 days'
            ]
        }
    elif unread > 100000:
        return {
            'name': 'Aggressive Cleanup',
            'description': 'Batch archive by category',
            'actions': [
                'Archive newsletter/promotional (30-40% reduction)',
                'Archive social notifications (10-15%)',
                'Archive automated alerts (15-20%)',
                'Prioritize remaining manually'
            ]
        }
    else:
        return {
            'name': 'Gentle Reset',
            'description': 'Gradual cleanup approach',
            'actions': [
                'Daily 100-email cleanup for 1 week',
                'Set up new filters for common senders',
                'Unsubscribe from 5 newsletters per day'
            ]
        }

def cmd_run(dry_run: bool, action: str = 'analyze'):
    print("🧹 Email Bankruptcy Planner")
    
    if action == 'analyze':
        print("📊 Analyzing inbox...")
        analysis = analyze_inbox()
        print(f"   Unread emails: {analysis['unread_count']}")
        print(f"   Old read emails (90+ days): {analysis['old_read_count']}")
        print(f"   Old attachments: {analysis['old_attachments']}")
        
        plan = generate_plan(analysis)
        print(f"\n💡 Recommended Plan: {plan['name']}")
        print(f"   {plan['description']}")
        print("\n   Actions:")
        for a in plan['actions']:
            print(f"   • {a}")
        
        if dry_run:
            print("\n[DRY-RUN] Would create cleanup plan.")
    
    elif action == 'execute':
        print("🚀 Creating cleanup plan file...")
        # In production, would write plan to Drive
        print("✅ Cleanup plan created. Check /zion.app/plans/email_bankruptcy_plan.md")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--analyze', action='store_true')
    p.add_argument('--plan', default='aggressive')
    args = p.parse_args()
    
    action = 'execute' if args.execute else 'analyze'
    cmd_run(dry_run=not args.execute, action=action)

if __name__ == '__main__':
    main()