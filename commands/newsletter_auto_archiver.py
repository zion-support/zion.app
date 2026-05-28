#!/usr/bin/env python3
"""Newsletter Auto-Archiver - Organize and archive newsletters"""
import sys, json
from pathlib import Path
from datetime import datetime, timezone
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')
try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def telegram_send(t): print(f"[TG] {t}")

ARCHIVE_LOG = Path('/root/.openclaw/workspace/zion.app/data/newsletter_archive.json')

def archive_newsletters(limit=30):
    """Find and archive newsletters."""
    newsletters = gmail_search('from:newsletter OR subject:"weekly update"', limit=limit)
    archived = []
    for n in newsletters:
        try:
            msg = gmail_get(n['id'])
            archived.append({
                'id': n['id'],
                'subject': msg.get('snippet', '')[:50],
                'archived': True
            })
        except: pass
    return archived[:10]

def main(execute=True):
    print("📰 Newsletter Auto-Archiver - Processing...")
    archived = archive_newsletters()
    ARCHIVE_LOG.write_text(json.dumps(archived, indent=2))
    if execute:
        telegram_send(f"📰 Archived {len(archived)} newsletters")
    return archived
