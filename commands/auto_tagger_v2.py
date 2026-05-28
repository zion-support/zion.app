#!/usr/bin/env python3
"""
Auto-Tagger v2 — Zion Tech Group

ML-enhanced email categorization using LLM + feedback learning.
Assigns labels like 'Client-Support', 'Sales-Inquiry', 'Invoice-Question',
'Partner', 'Internal', 'Marketing', 'Urgent', 'Needs-Response' based on
content analysis, sender history, and thread context.

Strategy:
  1. Scan unread emails (limit 50)
  2. Extract subject + first 500 chars + sender domain
  3. Query LLM with classification prompt (categorical labels)
  4. Apply labels in batch; record predictions for later review
  5. Learn from manual corrections (tags added/removed by user)

Schedule: Every 30 minutes

Usage: python3 auto_tagger_v2.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_batch_modify, gmail_get_or_create_label_id
from llm_client import chat, extract_json_from_text

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'auto_tagger_v2.json'
LABELS = ['Client-Support', 'Sales-Inquiry', 'Invoice-Question', 'Partner', 'Internal', 'Marketing', 'Urgent', 'Needs-Response']

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'tagged': [], 'feedback': {}, 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def fetch_unread(limit=50):
    return gmail_search('is:unread -label:Auto-Tagged', limit=limit)

def extract_email_context(msg):
    headers = msg.get('payload', {}).get('headers', [])
    sender = next((h['value'] for h in headers if h['name']=='From'), '')
    subject = next((h['value'] for h in headers if h['name']=='Subject'), '')
    snippet = msg.get('snippet','')
    # Extract domain from sender
    domain = ''
    m = re.search(r'@([A-Za-z0-9.-]+\.[A-Za-z]{2,})', sender)
    if m:
        domain = m.group(1).lower()
    return {'sender': sender, 'domain': domain, 'subject': subject, 'snippet': snippet[:500], 'id': msg.get('id')}

def classify_email(ctx):
    prompt = f"""
Classify this email into one or more categories from: {', '.join(LABELS)}.
Also detect if it needs a response (Yes/No).

Email:
  From: {ctx['sender']}
  Domain: {ctx['domain']}
  Subject: {ctx['subject']}
  Snippet: {ctx['snippet']}

Return JSON:
{{"labels": ["Label1","Label2"], "needs_response": true/false, "confidence": 0-100}}
"""
    try:
        resp = chat([{'role':'user','content':prompt}], provider="auto", temperature=0.2)
        content = resp.get('content','{}')
        result = extract_json_from_text(content)
        return result.get('labels', []), result.get('needs_response', True), result.get('confidence', 50)
    except Exception as e:
        print(f"   ⚠️  LLM classify failed: {e}")
        return ['Needs-Response'], True, 30

def apply_labels(msg_ids, labels):
    label_ids = []
    for lbl in labels:
        try:
            lid = gmail_get_or_create_label_id(lbl)
            label_ids.append(lid)
            # Also add parent label for grouping
            if lbl not in ['Urgent', 'Needs-Response']:
                parent = 'Client' if lbl.startswith('Client-') else 'Sales' if lbl.startswith('Sales-') else 'Finance' if lbl=='Invoice-Question' else 'Operations'
                parent_id = gmail_get_or_create_label_id(parent)
                label_ids.append(parent_id)
        except Exception as e:
            print(f"   ⚠️  Label {lbl} creation failed: {e}")
    if label_ids:
        try:
            gmail_batch_modify({'ids': msg_ids}, addLabelIds=label_ids)
            return True
        except Exception as e:
            print(f"   ❌ Batch modify failed: {e}")
            return False
    return False

def cmd_run(dry_run=True, limit=50):
    db = load_db()
    emails = fetch_unread(limit=limit)
    if not emails:
        print("✅ No unread emails to tag.")
        return

    tagged = 0
    for msg in emails:
        mid = msg.get('id')
        if mid in db.get('tagged', []):
            continue
        ctx = extract_email_context(msg)
        labels, needs_response, confidence = classify_email(ctx)

        # Always add Auto-Tagged marker
        labels.append('Auto-Tagged')
        if needs_response and confidence >= 50:
            labels.append('Needs-Response')

        print(f"   🏷️  {ctx['subject'][:50]} → {labels} (conf={confidence}%)")

        if not dry_run:
            if apply_labels([mid], labels):
                db['tagged'].append(mid)
                tagged += 1
        else:
            tagged += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Processed {tagged} emails.")
    if dry_run:
        print("💡 Add --execute to apply labels.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=50)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
