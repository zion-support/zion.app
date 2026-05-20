#!/usr/bin/env python3
"""
V26 Wave 1 — Escalation Engine

Monitors incoming emails for signals that demand immediate human attention:
  - Severe negative sentiment (fury, threats)
  - Legal/regulatory language (lawyer, lawsuit, BBB, FTC, GDPR complaint)
  - Churn signals (cancel, unsubscribe, never contact again)
  - Payment disputes with threat of escalation
  - Urgency escalation patterns (ALL CAPS, multiple exclamation marks)

When escalation threshold is met:
  - Sends high-priority Telegram alert to Kleber
  - Skips auto-reply (forces review queue)
  - Logs escalation to data/escalations_v26.jsonl for tracking
"""

import json, re, time
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA      = WORKSPACE / 'data'
ESCAL_LOG = DATA / 'escalations_v26.jsonl'

# ═══════════════════════════════════════════════════════════════
#  ESCALATION SIGNAL PATTERNS
# ═══════════════════════════════════════════════════════════════

# Severity 1 — Immediate escalation (lawyer, lawsuit, regulator, BBB complaint)
_CRITICAL = re.compile(
    r'\b(?:lawyer|law firm|attorney|sue|lawsuit|court|litigation|'
    r'bbb|federal trade commission|ftc|fda|regulator|regulatory|'
    r'hipaa violation|gdpr complaint|data breach|'
    r'call my lawyer|contact.*lawyer|retain.*counsel)\b',
    re.IGNORECASE
)

# Severity 2 — High (fury, threats, BBB report, legal action implied)
_HIGH = re.compile(
    r'\b(?:furious|furious|threat|threatening|'
    r'disgusted|outraged|horrible|worst|terrible|awful|'
    r'never (?:contact|email|message) me|stop (?:contact|email|message)|'
    r'cease and desist|harassment|'
    r'refund.*immediately|cancel.*immediately|'
    r'upper management|speak to manager|supervisor)\b',
    re.IGNORECASE
)

# Severity 3 — Medium-high (cancel subscription, file complaint, bad review)
_MED_HIGH = re.compile(
    r'\b(?:cancel (?:my|all|subscription|membership|account)|'
    r'unsubscribe|no longer need|'
    r'file a complaint|file complaint|'
    r'negative review|bad review|1.star|1 star|'
    r'chargeback|dispute charge|'
    r'terminate.*contract|end.*agreement)\b',
    re.IGNORECASE
)

# Payment dispute escalation indicators
_DISPUTE = re.compile(
    r'\b(?:overcharge|overcharged|incorrect charge|unauthorized(?: charge)?|'
    r'never authorized|didn.*authorize|'
    r'dispute|disputing|chargeback)\b',
    re.IGNORECASE
)

# ALL CAPS lines (shouting)
_ALL_CAPS_LINE = re.compile(r'^[A-Z][A-Z\s!?]{10,}$', re.MULTILINE)
# Multiple exclamation/question marks in sequence
_EXCESSIVE_PUNCT = re.compile(r'[!?]{3,}|[!?]{2,}\s*[!?]{2,}')

# Mirror of polarity_analyzer's negative pattern (tone-adjacent escalation signal)
_NEGATIVE = re.compile(
    r'\b(?:angry|furious|disappointed|frustrat|terrible|awful|horrible|'
    r'problema|erro|falha|ruim|péssim|insatisfeit|reclama|não funciona|'
    r'not working|broken|down|outage|fail)\b',
    re.IGNORECASE
)


def _log(msg: dict):
    try:
        with open(ESCAL_LOG, 'a') as f:
            f.write(json.dumps(msg, ensure_ascii=False) + '\n')
    except Exception:
        pass


def check_escalation(subject: str, snippet: str, sender: str = '', dry_run: bool = False) -> dict:
    """
    Returns a dict with:
      - escalated (bool)
      - severity (str): critical / high / medium / none
      - signals (list): what triggered escalation
      - action (str): 'force_review' | 'alert_only' | 'proceed'
      - telegram_alert (str or None)
    """
    text = f"{subject} {snippet}"
    text_lower = text.lower()
    
    result = {
        'escalated':  False,
        'severity':   'none',
        'signals':    [],
        'action':     'proceed',
        'telegram_alert': None,
    }
    
    # ── Critical checks ──────────────────────────────────────────
    critical_hits = _CRITICAL.findall(text)
    if critical_hits:
        result['escalated'] = True
        result['severity']  = 'critical'
        result['signals'].append(f"critical_keywords:{critical_hits[0]}")
        result['action']     = 'force_review'
        result['telegram_alert'] = (
            f"🚨 [ESCALATION — CRITICAL] Incoming email from {sender}\n"
            f"Subject: {subject}\n"
            f"Snippet: {snippet[:150]}…\n"
            f"Signal: {critical_hits[0]}\n"
            f"⚠️  Legal/regulatory language detected — DO NOT auto-reply. Human review required."
        )
        _log({'ts': datetime.now(timezone.utc).isoformat(), 'severity': 'critical', 'sender': sender, 'subject': subject, 'signal': critical_hits[0]})
        return result
    
    # ── High severity checks ─────────────────────────────────────
    high_hits = _HIGH.findall(text)
    if high_hits:
        result['escalated'] = True
        result['severity']  = 'high'
        result['signals'].append(f"high_keywords:{high_hits[0]}")
        result['action']     = 'force_review'
        result['telegram_alert'] = (
            f"🔴 [ESCALATION — HIGH] Incoming email from {sender}\n"
            f"Subject: {subject}\n"
            f"Snippet: {snippet[:150]}…\n"
            f"Signal: {high_hits[0]}\n"
            f"Fury or threat language detected — skipping auto-reply."
        )
        _log({'ts': datetime.now(timezone.utc).isoformat(), 'severity': 'high', 'sender': sender, 'subject': subject, 'signal': high_hits[0]})
        return result
    
    # ── Payment dispute checks ───────────────────────────────────
    dispute_hits = _DISPUTE.findall(text)
    if dispute_hits:
        result['escalated'] = True
        result['severity']  = 'medium'
        result['signals'].append(f"payment_dispute:{dispute_hits[0]}")
        result['action']     = 'force_review'
        result['telegram_alert'] = (
            f"🟡 [ESCALATION — PAYMENT DISPUTE] Incoming email from {sender}\n"
            f"Subject: {subject}\n"
            f"Snippet: {snippet[:150]}…\n"
            f"Signal: {dispute_hits[0]}\n"
            f"⚠️  Payment dispute — requires human attention."
        )
        _log({'ts': datetime.now(timezone.utc).isoformat(), 'severity': 'payment_dispute', 'sender': sender, 'subject': subject, 'signal': dispute_hits[0]})
        return result
    
    # ── Medium-high severity checks ─────────────────────────────
    med_high_hits = _MED_HIGH.findall(text)
    if med_high_hits:
        result['escalated'] = True
        result['severity']  = 'medium'
        result['signals'].append(f"churn_signal:{med_high_hits[0]}")
        result['action']     = 'force_review'
        result['telegram_alert'] = (
            f"🟠 [ESCALATION — CHURN] Incoming email from {sender}\n"
            f"Subject: {subject}\n"
            f"Snippet: {snippet[:150]}…\n"
            f"Signal: {med_high_hits[0]}\n"
            f"Possible churn or cancellation — human review recommended."
        )
        _log({'ts': datetime.now(timezone.utc).isoformat(), 'severity': 'churn', 'sender': sender, 'subject': subject, 'signal': med_high_hits[0]})
        return result
    
    # ── Tone-based escalation (ALL CAPS + excessive punctuation) ─
    all_caps  = bool(_ALL_CAPS_LINE.search(text))
    punct_exc = bool(_EXCESSIVE_PUNCT.search(text))
    if all_caps or punct_exc:
        # Also must have some negative signal to qualify
        neg_count = len(_HIGH.findall(text)) + len(_NEGATIVE.findall(text))
        if neg_count > 0:
            result['escalated'] = True
            result['severity']  = 'medium'
            signals = []
            if all_caps:   signals.append('all_caps_shouting')
            if punct_exc:  signals.append('excessive_punctuation')
            result['signals'] = signals
            result['action'] = 'force_review'
            result['telegram_alert'] = (
                f"🟡 [ESCALATION — AGITATED EMAIL] Incoming from {sender}\n"
                f"Subject: {subject}\n"
                f"Snippet: {snippet[:150]}…\n"
                f"Signals: {', '.join(signals)}\n"
                f"Agitated tone + negative sentiment — flagging for review."
            )
            _log({'ts': datetime.now(timezone.utc).isoformat(), 'severity': 'agitated', 'sender': sender, 'subject': subject, 'signals': signals})
            return result
    
    return result
    # ── Self-test ───────────────────────────────────────────────
    tests = [
        ("URGENT: Server down!", "Production is completely down, fix immediately!", "client@example.com"),
        ("Thank you!", "Great work, really appreciated.", "happy@client.com"),
        ("I will sue you", "This is unacceptable, contact my lawyer.", "angry@client.com"),
        ("Cancel subscription", "I want to cancel all my services now.", "churn@client.com"),
        ("Meeting tomorrow?", "Can we meet tomorrow at 2pm to discuss?", "partner@example.com"),
    ]
    
    for subj, snip, sender in tests:
        result = check_escalation(subj, snip, sender)
        status = "🚨 ESCALATED" if result['escalated'] else "✅ OK"
        print(f"{status} | {result['severity']:8s} | {subj[:50]}")
        if result['telegram_alert']:
            print(f"   → {result['telegram_alert'][:100]}…")
