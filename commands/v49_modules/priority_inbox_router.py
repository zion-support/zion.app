#!/usr/bin/env python3
"""
V49: Email Priority Score + Smart Inbox Router
Every incoming email gets a priority score and is routed to the right queue:
  Urgent (respond now) | Today | This Week | Batch (low priority)

Scoring: priority_score = urgency_weight * urgency_score
                              + sender_weight * sender_importance
                              + thread_weight * thread_value
                              + sentiment_weight * sentiment_penalty

Routing thresholds:
  >= 80 → URGENT queue (immediate response required)
  60-79 → TODAY queue (respond within 4 hours)
  40-59 → THIS WEEK queue (respond within 24-48h)
  < 40  → BATCH queue (respond when bandwidth allows)

Data: data/email_priority_queue.jsonl
"""
import json, re, os, math
from collections import defaultdict
from datetime import datetime, timezone
from typing import Literal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', '..', 'data')
QUEUE_FILE = os.path.join(DATA_DIR, 'email_priority_queue.jsonl')
SENDER_FILE = os.path.join(DATA_DIR, 'email_sender_scores.jsonl')
os.makedirs(DATA_DIR, exist_ok=True)

# ── Urgency keyword weights ─────────────────────────────────────────────────────
URGENCY_KEYWORDS = {
    # Critical (score 10)
    'urgent': 10, 'immediately': 10, 'asap': 10, 'emergency': 10,
    'outage': 10, 'down': 10, 'critical': 10, ' Sev 1': 10, 'severity 1': 10,
    'data breach': 10, 'security incident': 10, 'production down': 10,
    'lawsuit': 10, 'legal action': 10, 'executive escalation': 10,
    # High (score 7)
    'important': 7, 'priority': 7, 'time-sensitive': 7, 'deadline': 7,
    'contract': 7, 'approval needed': 7, 'action required': 7,
    'by friday': 7, 'by monday': 7, 'end of day': 7, 'eod': 7,
    'payment due': 7, 'invoice': 7, 'overdue': 7,
    'complaint': 7, 'escalate': 7, 'unsatisfied': 7,
    # Medium (score 4)
    'question': 4, 'help': 4, 'question about': 4, 'wondering': 4,
    'following up': 4, 'checking in': 4, 'status update': 4,
    'feedback': 4, 'input needed': 4, 'review': 4,
    # Low (score 1)
    'fyi': 1, 'FYI': 1, 'for your information': 1, 'just so you know': 1,
    'newsletter': 1, 'update': 1, 'digest': 1,
}

# ── Sender importance tiers ────────────────────────────────────────────────────
SENDER_TIERS = {
    'executive':  {'tier': 5, 'weight': 1.5},   # CEO, CTO, CFO, President, VP
    'manager':    {'tier': 4, 'weight': 1.3},   # Director, Head, Manager
    'key_account':{'tier': 4, 'weight': 1.3},  # High-value customer
    'finance':    {'tier': 3, 'weight': 1.2},   # Accounting, Billing
    'legal':      {'tier': 3, 'weight': 1.2},   # Legal, Compliance
    'technical':  {'tier': 2, 'weight': 1.0},   # Engineer, Architect
    'general':    {'tier': 2, 'weight': 1.0},   # Standard sender
    'new':        {'tier': 1, 'weight': 0.7},   # First-time sender
    'newsletter': {'tier': 0, 'weight': 0.3},   # Newsletter/auto
    'blocked':    {'tier': -1,'weight': 0.0},   # Blocked/spam
}

# ── Thread value signals ────────────────────────────────────────────────────────
THREAD_VALUE_SIGNALS = {
    'has_attachments': 3,
    'is_reply': 2,
    'has_previous_replies': 1,
    'cc_important': 2,
    'bcc_important': 1,
    'external_participant': 2,
    'executive_in_cc': 3,
}

# ── Sentiment penalty multipliers ───────────────────────────────────────────────
SENTIMENT_PENALTY = {
    'critical': -30,
    'high':     -20,
    'medium':   -10,
    'low':       -5,
    'none':       0,
}

# ── SLA response windows (minutes) ─────────────────────────────────────────────
SLA_WINDOWS = {
    'urgent':   30,
    'today':   240,
    'this_week': 2880,
    'batch':    None,  # No SLA
}


def classify_sender_tier(sender_email: str, sender_name: str = '') -> tuple:
    """Classify sender into importance tier."""
    combined = f"{sender_email} {sender_name}".lower()

    if any(kw in combined for kw in ['ceo', 'cto', 'cfo', 'cmo', 'cio', 'coo', 'president', 'founder', 'vice president', 'vp of', 'evp']):
        return 'executive', SENDER_TIERS['executive']
    if any(kw in combined for kw in ['director', 'head of', 'manager', 'lead ', 'chief']):
        return 'manager', SENDER_TIERS['manager']
    if any(kw in combined for kw in ['finance', 'accounting', 'billing', 'controller']):
        return 'finance', SENDER_TIERS['finance']
    if any(kw in combined for kw in ['legal', 'compliance', 'counsel']):
        return 'legal', SENDER_TIERS['legal']
    if any(kw in combined for kw in ['engineer', 'developer', 'architect', 'devops', 'technical']):
        return 'technical', SENDER_TIERS['technical']
    if any(kw in combined for kw in ['newsletter', 'no-reply', 'noreply', 'automated', 'system']):
        return 'newsletter', SENDER_TIERS['newsletter']

    # Check sender history
    history = _get_sender_history(sender_email)
    if history:
        reply_rate = history.get('reply_rate', 0.5)
        if reply_rate > 0.8:
            return 'key_account', SENDER_TIERS['key_account']

    return 'general', SENDER_TIERS['general']


def score_urgency(subject: str, body: str = '') -> float:
    """Score urgency 0-10 from subject + body keywords."""
    combined = f"{subject} {body}".lower()
    score = 0.0
    matched = []

    for kw, weight in sorted(URGENCY_KEYWORDS.items(), key=lambda x: -x[1]):
        # Whole-word match
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, combined):
            score = max(score, weight)
            matched.append(kw)

    return min(score, 10.0)


def score_thread_value(email_data: dict) -> float:
    """Score thread value 0-10 from metadata signals."""
    score = 0.0

    if email_data.get('has_attachments'):
        score += THREAD_VALUE_SIGNALS['has_attachments']
    if email_data.get('is_reply'):
        score += THREAD_VALUE_SIGNALS['is_reply']
    if email_data.get('previous_reply_count', 0) > 0:
        score += min(email_data['previous_reply_count'], 3) * THREAD_VALUE_SIGNALS['has_previous_replies']
    if email_data.get('cc') and any(s in str(email_data['cc']).lower() for s in ['manager', 'director', 'ceo', 'cto', 'cfo']):
        score += THREAD_VALUE_SIGNALS['executive_in_cc']
    if email_data.get('from_domain') and email_data.get('to_domain') and email_data['from_domain'] != email_data['to_domain']:
        score += THREAD_VALUE_SIGNALS['external_participant']

    return min(score, 10.0)


def compute_priority_score(
    subject: str,
    body: str = '',
    sender_email: str = '',
    sender_name: str = '',
    email_data: dict = None,
    escalation: str = 'none',
) -> dict:
    """
    Main entry point: compute priority score and routing for an email.

    Returns:
      { 'priority_score': float, 'route': str, 'urgency_score': float,
        'sender_score': float, 'thread_score': float, 'sentiment_penalty': float,
        'sla_minutes': int, 'sla_label': str, 'factors': list, 'matched_keywords': list }
    """
    email_data = email_data or {}
    urgency_score = score_urgency(subject, body)
    sender_tier, sender_info = classify_sender_tier(sender_email, sender_name)
    thread_score = score_thread_value(email_data)
    sentiment_penalty = SENTIMENT_PENALTY.get(escalation, 0)

    # Weights
    urgency_weight = 0.45
    sender_weight = 0.30
    thread_weight = 0.15
    sentiment_weight = 0.10

    priority_score = (
        urgency_weight * urgency_score * 10
        + sender_weight * sender_info['tier'] * 10 / 5
        + thread_weight * thread_score * 10
        + sentiment_weight * sentiment_penalty
    )
    priority_score = max(0, min(100, priority_score))

    # Route
    if priority_score >= 80 or escalation in ('critical', 'high'):
        route = 'urgent'
    elif priority_score >= 60:
        route = 'today'
    elif priority_score >= 40:
        route = 'this_week'
    else:
        route = 'batch'

    sla_minutes = SLA_WINDOWS.get(route)
    sla_label = f"{sla_minutes} min" if sla_minutes else "No SLA"

    # Factors breakdown
    factors = [
        f"urgency={urgency_score:.1f}/10 (weight 45%)",
        f"sender={sender_tier} tier={sender_info['tier']} (weight 30%)",
        f"thread_value={thread_score:.1f}/10 (weight 15%)",
        f"sentiment={escalation} penalty={sentiment_penalty} (weight 10%)",
    ]

    matched_kws = [kw for kw in URGENCY_KEYWORDS
                    if re.search(r'\b' + re.escape(kw) + r'\b', f"{subject} {body}".lower())]

    return {
        'priority_score': round(priority_score, 1),
        'route': route,
        'urgency_score': round(urgency_score, 2),
        'sender_tier': sender_tier,
        'sender_importance': sender_info['tier'],
        'thread_score': round(thread_score, 2),
        'sentiment_penalty': sentiment_penalty,
        'sla_minutes': sla_minutes,
        'sla_label': sla_label,
        'factors': factors,
        'matched_keywords': matched_kws[:8],
        'escalation': escalation,
    }


def route_email(
    subject: str,
    body: str = '',
    sender_email: str = '',
    sender_name: str = '',
    email_data: dict = None,
    escalation: str = 'none',
) -> dict:
    """
    Full routing: compute score + enqueue + return routing decision.
    """
    result = compute_priority_score(subject, body, sender_email, sender_name, email_data, escalation)

    record = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'subject': subject[:200],
        'sender': sender_email,
        'sender_tier': result['sender_tier'],
        'priority_score': result['priority_score'],
        'route': result['route'],
        'sla_minutes': result['sla_minutes'],
        'escalation': escalation,
    }
    _append_jsonl(QUEUE_FILE, record)

    return result


def get_queue_summary() -> dict:
    """Return count of emails per routing queue."""
    queues = defaultdict(list)
    if os.path.exists(QUEUE_FILE):
        with open(QUEUE_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())
                    queues[entry['route']].append(entry)
                except (json.JSONDecodeError, ValueError):
                    continue

    return {
        'urgent': len(queues.get('urgent', [])),
        'today': len(queues.get('today', [])),
        'this_week': len(queues.get('this_week', [])),
        'batch': len(queues.get('batch', [])),
        'total': sum(len(v) for v in queues.values()),
    }


def update_sender_reply_rate(sender_email: str, replied: bool) -> None:
    """Update sender's reply rate after an interaction."""
    history = _get_sender_history(sender_email)
    n = history.get('interaction_count', 0)
    rate = history.get('reply_rate', 0.5)

    new_rate = (rate * n + (1 if replied else 0)) / (n + 1) if n >= 0 else 0.5
    history['reply_rate'] = new_rate
    history['interaction_count'] = n + 1
    history['last_seen'] = datetime.now(timezone.utc).isoformat()

    _save_sender_history(sender_email, history)


def _get_sender_history(sender_email: str) -> dict:
    if not os.path.exists(SENDER_FILE):
        return {}
    with open(SENDER_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                entry = json.loads(line.strip())
                if entry.get('email', '').lower() == sender_email.lower():
                    return entry
            except (json.JSONDecodeError, ValueError):
                continue
    return {}


def _save_sender_history(sender_email: str, history: dict) -> None:
    entries = []
    if os.path.exists(SENDER_FILE):
        with open(SENDER_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())
                    if entry.get('email', '').lower() != sender_email.lower():
                        entries.append(entry)
                except (json.JSONDecodeError, ValueError):
                    continue

    history['email'] = sender_email
    entries.append(history)

    with open(SENDER_FILE, 'w', encoding='utf-8') as f:
        for entry in entries:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')


def _append_jsonl(path: str, record: dict) -> None:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(json.dumps(record, ensure_ascii=False) + '\n')


# ── CLI test ──────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("=" * 60)
    print("V49: Email Priority Score + Smart Inbox Router — Test Suite")
    print("=" * 60)

    test_cases = [
        {
            'label': 'Critical escalation from CEO',
            'sender': 'john.doe@enterprise.com',
            'sender_name': 'John Smith, CEO',
            'subject': 'URGENT: Production system down — immediate action required',
            'body': 'Our entire production environment is down. This is critical. '
                    'We need this resolved immediately. CEO escalation.',
            'email_data': {'has_attachments': True, 'is_reply': False},
            'escalation': 'critical',
        },
        {
            'label': 'Invoice from finance department',
            'sender': 'accounting@vendor.com',
            'sender_name': 'Accounts Payable',
            'subject': 'Invoice #4821 — Payment Due in 15 Days',
            'body': 'Please find attached invoice #4821. Payment is due in 15 days. '
                    'Kindly process at your earliest convenience.',
            'email_data': {'has_attachments': True, 'is_reply': False},
            'escalation': 'none',
        },
        {
            'label': 'Newsletter from tech blog',
            'sender': 'newsletter@techcrunch.com',
            'sender_name': 'TechCrunch',
            'subject': 'TechCrunch Weekly Digest — Top 10 AI Stories',
            'body': 'This week in tech...',
            'email_data': {},
            'escalation': 'none',
        },
        {
            'label': 'Meeting follow-up from manager',
            'sender': 'sarah.jones@partner.com',
            'sender_name': 'Sarah Jones, Director of Engineering',
            'subject': 'RE: Architecture Review — Next Steps',
            'body': 'Great meeting yesterday! Following up on the action items we discussed. '
                    'Can you send the updated timeline by Friday?',
            'email_data': {'is_reply': True, 'previous_reply_count': 3},
            'escalation': 'low',
        },
        {
            'label': 'First contact from new prospect',
            'sender': 'new_lead@startup.io',
            'sender_name': 'Mike Johnson',
            'subject': 'Question about your AI services',
            'body': 'Hi, I found your website and I am interested in learning more '
                    'about your AI knowledge graph service. Do you have time for a quick call?',
            'email_data': {},
            'escalation': 'none',
        },
        {
            'label': 'Satisfaction survey from happy customer',
            'sender': 'lisa@enterprise.com',
            'sender_name': 'Lisa Wang, VP Product',
            'subject': 'Quick feedback survey — We appreciate your input!',
            'body': 'Thank you for being a customer! Please take 2 minutes to complete our survey.',
            'email_data': {'has_attachments': True},
            'escalation': 'none',
        },
    ]

    for tc in test_cases:
        print(f"\n{'─'*60}")
        print(f"Test: {tc['label']}")
        print(f"  From: {tc['sender']} ({tc['sender_name']})")
        print(f"  Subject: {tc['subject']}")

        result = route_email(
            subject=tc['subject'],
            body=tc['body'],
            sender_email=tc['sender'],
            sender_name=tc['sender_name'],
            email_data=tc['email_data'],
            escalation=tc['escalation'],
        )

        emoji = '🚨' if result['route'] == 'urgent' else '📅' if result['route'] == 'today' else '📆' if result['route'] == 'this_week' else '📦'
        print(f"\n  {emoji} Route: {result['route'].upper()} | Score: {result['priority_score']:.1f}/100 "
              f"| SLA: {result['sla_label']}")
        print(f"  Sender tier: {result['sender_tier']} | Urgency: {result['urgency_score']:.1f}/10 "
              f"| Thread: {result['thread_score']:.1f}/10")
        print(f"  Escalation: {result['escalation']} | Sentiment penalty: {result['sentiment_penalty']}")
        if result['matched_keywords']:
            print(f"  Keywords: {', '.join(result['matched_keywords'])}")

    print(f"\n{'─'*60}")
    summary = get_queue_summary()
    print(f"Queue summary: {summary}")
