#!/usr/bin/env python3
"""
Universal Deduplication Helper - Apply to all responders
Prevents duplicate replies to the same email thread
"""

import sys
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search

def get_replied_threads(label_name, limit=500):
    """Get set of thread IDs that have already been replied to"""
    replied = gmail_search(f'label:{label_name}', limit=limit)
    return set(m.get('threadId') for m in replied if m.get('threadId'))

def filter_new_emails(msgs, replied_threads, label_name):
    """Filter out emails that have already been replied to"""
    new_emails = []
    for msg in msgs:
        # Skip if already has our label
        if label_name in msg.get('labelIds', []):
            continue
        # Skip if thread was already replied to
        if msg.get('threadId') in replied_threads:
            continue
        new_emails.append(msg)
    return new_emails

# Usage example:
# replied_threads = get_replied_threads('Autonomous-V6')
# fresh_emails = filter_new_emails(msgs, replied_threads, 'Autonomous-V6')
print("✅ Deduplication helper ready - import to use")