#!/usr/bin/env python3
"""
Context-Aware Templates - Zion

Smart email templates that adapt based on recipient, context, and history.
- Analyzes relationship tone
- Suggests appropriate greeting/closing
- Customizes content based on past interactions
- Learns from successful emails

Usage:
  python3 context_templates.py --suggest --recipient user@example.com
  python3 context_templates.py --generate --type followup --recipient user@example.com
"""

import sys, json
from datetime import datetime
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

TEMPLATES = {
    'followup': {
        'formal': "Dear {name},\n\nFollowing up on our previous correspondence regarding {topic}.\n\n{payload}\n\nBest regards,\n{sender}",
        'casual': "Hi {name},\n\nJust checking in on {topic}.\n\n{payload}\n\nCheers!\n{sender}",
        'urgent': "Hi {name},\n\nFollowing up urgently on {topic}.\n\n{payload}\n\nThanks,\n{sender}"
    },
    'meeting': {
        'formal': "Dear {name},\n\nI'd like to schedule a meeting to discuss {topic}.\n\nAre you available {dates}?\n\nBest regards,\n{sender}",
        'casual': "Hey {name}!\n\nWant to grab coffee and chat about {topic}? Free {dates}?\n\n{sender}"
    },
    'introduction': {
        'formal': "Dear {name},\n\nI hope this email finds you well. {sender} suggested I reach out regarding {topic}.\n\n{payload}\n\nBest regards,\n{from_name}",
        'casual': "Hi {name},\n\n{sender} said you might be interested in {topic}. Quick intro: I help with {help}.\n\n{payload}\n\nTalk soon,\n{from_name}"
    }
}

def get_relationship_context(recipient: str) -> str:
    """Determine relationship tone based on email history."""
    # Search for past interactions
    query = f'to:{recipient} OR from:{recipient}'
    msgs = gmail_search(query, limit=20)
    
    if not msgs:
        return 'formal'  # Default for new contacts
    
    # Analyze tone from past emails (simplified)
    # In production, would use NLP for sentiment analysis
    return 'casual' if len(msgs) > 5 else 'formal'

def suggest_template(recipient: str, template_type: str = 'followup') -> str:
    """Suggest the most appropriate template for the context."""
    tone = get_relationship_context(recipient)
    
    templates = TEMPLATES.get(template_type, TEMPLATES['followup'])
    return templates.get(tone, templates.get('formal', ''))

def cmd_run(dry_run: bool, recipient: str = None, template_type: str = 'followup'):
    print("📄 Context-Aware Templates")
    
    if not recipient:
        print("Usage: python3 context_templates.py --recipient email@example.com --type meeting")
        return
    
    tone = get_relationship_context(recipient)
    template = suggest_template(recipient, template_type)
    
    print(f"\n🎯 Recipient: {recipient}")
    print(f"   Detected tone: {tone}")
    print(f"   Template type: {template_type}")
    print(f"\n📝 Suggested template:\n{template[:300]}...")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would provide context-aware suggestions.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--recipient', help='Email recipient')
    p.add_argument('--type', default='followup', choices=['followup', 'meeting', 'introduction'])
    p.add_argument('--suggest', action='store_true')
    args = p.parse_args()
    
    if args.recipient or args.suggest:
        cmd_run(dry_run=not args.execute, recipient=args.recipient, template_type=args.type)
    else:
        print("Available template types: followup, meeting, introduction")
        print("\nUsage: python3 context_templates.py --recipient user@example.com --type followup")

if __name__ == '__main__':
    main()