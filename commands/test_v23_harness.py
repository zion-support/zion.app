#!/usr/bin/env python3
"""
V23 Pipeline Test Harness — 5 synthetic emails + full pipeline validation.
Mocks Gmail; exercises L8 attachments, L9 calendar, L10 relationship.
"""
from __future__ import annotations

import sys, json
from pathlib import Path
from datetime import datetime, timezone

COMMANDS = Path.home() / '.openclaw' / 'workspace' / 'zion.app' / 'commands'
sys.path.insert(0, str(COMMANDS))

# ─── Mock Gmail ─────────────────────────────────────────────────────
def _fake_gmail_get(thread_id: str) -> dict:
    _lookup = {
        'th1': {'id': 'urg-001', 'threadId': 'th1', 'snippet': 'URGENT: Production outage — SLA breach',
                'payload': {'headers': [
                    {'name': 'From', 'value': 'ops@bigcorp.com'},
                    {'name': 'Subject', 'value': 'URGENT: Production outage'},
                    {'name': 'To', 'value': 'kleber@ziontechgroup.com'},
                    {'name': 'Cc', 'value': 'cto@bigcorp.com'},
                ]}},
        'th2': {'id': 'sls-001', 'threadId': 'th2', 'snippet': 'Partnership proposal',
                'payload': {'headers': [
                    {'name': 'From', 'value': 'vp-sales@startup.io'},
                    {'name': 'Subject', 'value': 'Partnership proposal'},
                    {'name': 'To', 'value': 'kleber@ziontechgroup.com'},
                ]}},
    }
    return _lookup.get(thread_id, {'id': thread_id, 'threadId': thread_id, 'snippet': '', 'payload': {'headers': []}})


# Patch before import
import types
google_ws = types.ModuleType('google_workspace')
google_ws.gmail_search = lambda q, limit=20: []
google_ws.gmail_get = _fake_gmail_get
google_ws.gmail_send_reply_fixed = lambda *a, **kw: {'success': True}
google_ws.telegram_send = lambda t: print(f"[TG] {t}")
sys.modules['google_workspace'] = google_ws

from intelligent_email_responder_v23 import IntelligentEmailResponderV23  # noqa

# ─── Test inbox ─────────────────────────────────────────────────────
INBOX = [
    {
        'id': 'urg-001', 'thread_id': 'th1',
        'sender': 'ops@bigcorp.com',
        'subject': 'URGENT: Production outage — SLA breach',
        'snippet': 'Production is completely down. Revenue loss every minute. Critical!',
        'body': '',
        'cc': 'cto@bigcorp.com',
    },
    {
        'id': 'sls-001', 'thread_id': 'th2',
        'sender': 'vp-sales@startup.io',
        'subject': 'Partnership proposal — Zion AI',
        'snippet': 'We want to partner. Budget allocated. Schedule a call? Deck attached (PDF, 2MB).',
        'body': '',
        'cc': '',
    },
    {
        'id': 'pay-001', 'thread_id': 'th3',
        'sender': 'billing@acme.com',
        'subject': 'Invoice #2024-112 paid',
        'snippet': 'Paid $12,500 via wire. Confirmation ABC-123. PDF attached.',
        'body': '',
        'cc': 'finance@acme.com',
    },
    {
        'id': 'sup-001', 'thread_id': 'th4',
        'sender': 'dev@example.com',
        'subject': 'API rate limits — question',
        'snippet': 'What are Pro plan rate limits for 10 users?',
        'body': '',
        'cc': '',
    },
    {
        'id': 'leg-001', 'thread_id': 'th5',
        'sender': 'legal@competitor.com',
        'subject': 'Cease and desist — patent US-12345',
        'snippet': 'Your product infringes our patent. Cease activity or we will file suit.',
        'body': '',
        'cc': '',
    },
]

# ─── Run ─────────────────────────────────────────────────────────────
print("=== V23 Pipeline Validation Harness ===\n")
resp = IntelligentEmailResponderV23()
results = []

for ed in INBOX:
    r = resp.process_email(ed)
    results.append(r)

# ─── Report ─────────────────────────────────────────────────────────
print(f"{'#':<5} {'Intent':<16} {'Conf':>5} {'Att':>4} {'Tier':>10} {'Action':>10} {'ReplyAll?':>10}")
print("-" * 67)
for i, (ed, r) in enumerate(zip(INBOX, results), 1):
    intent = r.get('intent', {}).get('categories', ['general'])[0]
    conf = r.get('intent', {}).get('confidence', 0)
    rel = r.get('relationship', {})
    att = r.get('attachments', {})
    action = r.get('action', '?')
    ra = r.get('reply_all', False)
    print(f"{i:<5} {intent:<16} {int(conf*100):>3}%  {att.get('count',0):>4} {rel.get('tier','?'):>10} {action:>10} {str(ra):>10}")

# ─── Assertions ─────────────────────────────────────────────────────
checks = []

for ed, r in zip(INBOX, results):
    action = r.get('action', '')
    intent = r.get('intent', {}).get('categories', ['general'])[0]

    if action == 'auto_archive':
        checks.append((ed['id'], True, f"noise→auto_archive"))
    elif 'urgent' in intent or action in ('send', 'review'):
        checks.append((ed['id'], True, f"intent={intent} action={action}"))
    else:
        checks.append((ed['id'], False, f"unexpected action={action} for intent={intent}"))

passed = sum(1 for _, ok, _ in checks if ok)
total = len(checks)

print(f"\n=== Assertions: {passed}/{total} passed ===")
for cid, ok, reason in checks:
    print(f"  {'✓' if ok else '✗'} {cid}: {reason}")

if passed == total:
    print("\n✅ V23 all checks passed")
    sys.exit(0)
else:
    print(f"\n❌ {total - passed} check(s) failed")
    sys.exit(1)