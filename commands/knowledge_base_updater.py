#!/usr/bin/env python3
"""
Knowledge Base Auto-Updater - Automatically extract and organize knowledge from interactions

Analyzes emails, meeting notes, and project communications to update
company knowledge base with new insights.
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, drive_list, telegram_send

KB_FILE = WORKSPACE / 'zion.app' / 'data' / 'knowledge_base.json'
KB_DOC_ID = None  # Would store Google Doc ID for knowledge base


def extract_knowledge_from_emails(limit=30) -> List[Dict]:
    """Extract knowledge snippets from emails."""
    knowledge = []
    
    queries = [
        'from:client',
        'subject:"lessons learned"',
        'subject:"best practice"',
        'subject:"insight"',
    ]
    
    seen = set()
    for query in queries:
        emails = gmail_search(query, limit=15)
        for email in emails:
            if email['id'] not in seen:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                snippet = msg.get('snippet', '')
                
                # Extract potential knowledge
                lines = snippet.split('\n')
                for line in lines:
                    line = line.strip()
                    if len(line) > 50 and any(w in line.lower() for w in ['because', 'should', 'must', 'recommended', 'avoid']):
                        knowledge.append({
                            'source': subject[:50],
                            'insight': line[:300],
                            'timestamp': datetime.now(timezone.utc).isoformat(),
                            'confidence': 0.7,
                        })
                seen.add(email['id'])
    
    return knowledge


def extract_knowledge_from_drive() -> List[Dict]:
    """Extract knowledge from Drive files."""
    knowledge = []
    
    files = drive_list(limit=30)
    for f in files:
        if any(kw in f['name'].lower() for kw in ['knowledge', 'best-practice', 'lesson', 'guide']):
            knowledge.append({
                'source': f['name'],
                'insight': f"Document: {f['name']}",
                'timestamp': f.get('modifiedTime', ''),
                'confidence': 0.9,
            })
    
    return knowledge


def categorize_knowledge(knowledge: List[Dict]) -> Dict[str, List]:
    """Categorize knowledge by type."""
    categories = {
        'processes': [],
        'technical': [],
        'client': [],
        'products': [],
        'general': [],
    }
    
    for item in knowledge:
        text = item['insight'].lower()
        
        if any(w in text for w in ['process', 'workflow', 'procedure', 'step']):
            categories['processes'].append(item)
        elif any(w in text for w in ['code', 'api', 'error', 'bug', 'technical']):
            categories['technical'].append(item)
        elif any(w in text for w in ['client', 'customer', 'user', 'feedback']):
            categories['client'].append(item)
        elif any(w in text for w in ['feature', 'product', 'service', 'offering']):
            categories['products'].append(item)
        else:
            categories['general'].append(item)
    
    return categories


def update_knowledge_base(knowledge: List[Dict]) -> Dict:
    """Update the knowledge base with new insights."""
    if KB_FILE.exists():
        kb = json.loads(KB_FILE.read_text())
    else:
        kb = {'entries': [], 'last_updated': ''}
    
    # Add new knowledge
    existing_texts = {e['insight'] for e in kb['entries']}
    new_count = 0
    
    for item in knowledge:
        if item['insight'] not in existing_texts:
            kb['entries'].append(item)
            existing_texts.add(item['insight'])
            new_count += 1
    
    kb['last_updated'] = datetime.now(timezone.utc).isoformat()
    KB_FILE.parent.mkdir(parents=True, exist_ok=True)
    KB_FILE.write_text(json.dumps(kb, indent=2))
    
    return {'new_entries': new_count, 'total': len(kb['entries'])}


def main(execute=True, limit=30):
    """Main execution."""
    print("📚 Knowledge Base Auto-Updater - Extracting insights...")
    
    # Extract from emails
    email_knowledge = extract_knowledge_from_emails(limit)
    print(f"📧 Extracted {len(email_knowledge)} insights from emails")
    
    # Extract from Drive
    drive_knowledge = extract_knowledge_from_drive()
    print(f"📁 Found {len(drive_knowledge)} knowledge documents")
    
    # Combine and categorize
    all_knowledge = email_knowledge + drive_knowledge
    categories = categorize_knowledge(all_knowledge)
    
    # Update knowledge base
    stats = update_knowledge_base(all_knowledge)
    print(f"\n📊 Knowledge Base Updated:")
    print(f"  ✅ New entries: {stats['new_entries']}")
    print(f"  📚 Total entries: {stats['total']}")
    
    # Show categories
    for cat, items in categories.items():
        if items:
            print(f"  {cat}: {len(items)} insights")
    
    if execute and stats['new_entries'] > 0:
        telegram_send(f"📚 Knowledge Base: {stats['new_entries']} new insights added")
    
    return stats


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=30)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)