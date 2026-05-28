#!/usr/bin/env python3
"""Filter GitHub notifications - Auto-label and archive"""
import sys, json
from pathlib import Path
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')
try:
    from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id, telegram_send
except: pass

def filter_github_notifications(limit=50):
    """Filter and archive GitHub notifications"""
    msgs = gmail_search('from:notifications@github.com', limit=limit)
    label_id = gmail_get_or_create_label_id('GitHub-Filtered')
    count = 0
    for m in msgs:
        gmail_batch_modify({'ids': [m['id']]}, removeLabelIds=['INBOX'], addLabelIds=[label_id])
        count += 1
    return count

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    count = filter_github_notifications()
    print(f"📧 Filtered {count} GitHub notifications")
