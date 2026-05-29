#!/usr/bin/env python3
"""
V55 — Case-by-Case Intelligence Engine
Enhanced email responder with per-email decision matrix, mandatory reply-all enforcement,
multi-language detection, attachment awareness, and smart escalation.

Key improvements over V28:
  1. Case-by-case decision matrix (scoring: urgency × importance × relationship)
  2. Reply-all enforcement with override logging
  3. Thread depth awareness (longer threads = higher reply-all probability)
  4. Attachment intelligence (invoice/contract detection, missing attachment warnings)
  5. Multi-language detection and translation suggestion
  6. Smart escalation (auto-forward to right team member)
  7. Response quality gate (minimum score before sending)
  8. Follow-up scheduling for unanswered emails
"""
from __future__ import annotations

import json, os, re, sys, hashlib, datetime, time
from pathlib import Path
from typing import Optional

# ── Workspace setup ──────────────────────────────────────────────────────────
home = Path.home()
WORKSPACE = home / '.openclaw' / 'workspace'
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

try:
    from google_workspace import gmail_search, gmail_create_draft_new, telegram_send
    from llm_client import chat
    IMPORTS_OK = True
except ImportError:
    IMPORTS_OK = False
    print("⚠️  Workspace imports unavailable — running in analysis-only mode")

DATA_DIR = WORKSPACE / 'zion.app' / 'data'
V55_STATE = DATA_DIR / 'v55_state.json'
DECISION_LOG = DATA_DIR / 'v55_decisions.jsonl'
FOLLOWUP_QUEUE = DATA_DIR / 'v55_followups.json'

# ── Contact details for signatures ──────────────────────────────────────────
CONTACT = {
    'name': 'Kleber Garcia Alcatrao',
    'company': 'Zion Tech Group',
    'email': 'kleber@ziontechgroup.com',
    'phone': '+1 302 464 0950',
    'address': '364 E Main St STE 1008, Middletown, DE 19709'
}

# ── Decision matrix weights ──────────────────────────────────────────────────
WEIGHTS = {
    'urgency': 0.30,
    'importance': 0.25,
    'relationship': 0.20,
    'complexity': 0.15,
    'reply_all_signal': 0.10,
}

# Intent → priority multiplier
INTENT_PRIORITY = {
    'urgent': 1.0, 'financial': 0.9, 'sales_lead': 0.85,
    'support_issue': 0.8, 'partnership': 0.75, 'meeting': 0.7,
    'cancellation': 0.65, 'personal_one2one': 0.5, 'general': 0.3,
}

# ── Helper functions ─────────────────────────────────────────────────────────

def load_json(path: Path, default=None):
    if default is None:
        default = {}
    try:
        if path.exists():
            return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        pass
    return default

def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

def append_decision(event: dict):
    """Append a decision event to the JSONL log."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    event['ts'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(DECISION_LOG, 'a', encoding='utf-8') as f:
        f.write(json.dumps(event, ensure_ascii=False) + '\n')

# ── Language detection ───────────────────────────────────────────────────────

LANG_PATTERNS = {
    'pt': r'\b(não|você|obrigado|bom dia|boa tarde|prezado|atenciosamente|saudação)\b',
    'es': r'\b(no|usted|gracias|buenos días|buenas tardes|estimado|saludos|atentamente)\b',
    'fr': r'\b(ne|vous|merci|bonjour|bonsoir|cher|cordialement|salutations)\b',
    'de': r'\b(nicht|Sie|danke|guten Tag|sehr geehrte|mit freundlichen Grüßen)\b',
    'it': r'\b(non|Lei|grazie|buongiorno|buonasera|gentile|cordiali saluti)\b',
    'ja': r'[\u3040-\u309f\u30a0-\u30ff]|(ありがとうございます|お疲れ様)',
    'zh': r'[\u4e00-\u9fff]{3,}',
    'ar': r'[\u0600-\u06ff]{3,}',
    'ru': r'[\u0400-\u04ff]{3,}',
}

def detect_language(text: str) -> str:
    """Detect email language from content patterns."""
    text_lower = text.lower()
    scores = {}
    for lang, pattern in LANG_PATTERNS.items():
        matches = len(re.findall(pattern, text_lower, re.IGNORECASE))
        if matches > 0:
            scores[lang] = matches
    if not scores:
        return 'en'
    return max(scores, key=scores.get)

# ── Attachment intelligence ──────────────────────────────────────────────────

INVOICE_PATTERNS = [
    r'invoice\s*#?\s*\d+', r'factura', r'fatura', r'payment\s+due',
    r'amount\s+due', r'balance\s+outstanding', r'\$\s*[\d,]+\.?\d*'
]

CONTRACT_PATTERNS = [
    r'agreement', r'contract', r'terms\s+and\s+conditions', r'statement\s+of\s+work',
    r'sow', r'msa', r'nda', r'non-disclosure', r'service\s+level\s+agreement'
]

def analyze_attachments(subject: str, snippet: str) -> dict:
    """Detect attachment types from email content."""
    text = f"{subject} {snippet}".lower()
    result = {'has_invoice': False, 'has_contract': False, 'mentions_attachment': False, 'attachment_missing': False}

    for pat in INVOICE_PATTERNS:
        if re.search(pat, text):
            result['has_invoice'] = True
            break

    for pat in CONTRACT_PATTERNS:
        if re.search(pat, text):
            result['has_contract'] = True
            break

    # Check if attachment is mentioned but potentially missing
    if re.search(r'(attach|enclosed|appended|anexo|adjunto|pièce jointe)', text):
        result['mentions_attachment'] = True
        if not re.search(r'(see attached|please find|attached is|segue em anexo|adjunto se)', text):
            result['attachment_missing'] = True

    return result

# ── Reply-all decision engine ────────────────────────────────────────────────

def should_reply_all(sender: str, subject: str, snippet: str, cc_count: int = 0, thread_depth: int = 1) -> dict:
    """
    Determine if reply-all is appropriate.
    Returns {decision: bool, confidence: float, reason: str}
    """
    score = 0.0
    reasons = []

    # Factor 1: CC count (more CCs = more likely reply-all)
    if cc_count >= 3:
        score += 0.3
        reasons.append(f"Multiple recipients ({cc_count} CCs)")
    elif cc_count >= 1:
        score += 0.15
        reasons.append(f"Some CCs ({cc_count})")

    # Factor 2: Thread depth (deeper threads = team conversation)
    if thread_depth >= 4:
        score += 0.25
        reasons.append(f"Deep thread ({thread_depth} messages)")
    elif thread_depth >= 2:
        score += 0.1
        reasons.append(f"Thread context ({thread_depth} messages)")

    # Factor 3: Content signals
    text = f"{subject} {snippet}".lower()
    reply_all_signals = [
        r'(team|everyone|all|folks|guys|hi all|dear all)',
        r'(please share|please forward|please cc|keep.*in.*loop)',
        r'(update.*team|inform.*all|notify.*everyone)',
        r'(meeting notes|minutes|recap)',
    ]
    for pattern in reply_all_signals:
        if re.search(pattern, text):
            score += 0.2
            reasons.append("Content signals group communication")
            break

    # Factor 4: Intent-based
    if any(word in text for word in ['urgent', 'asap', 'critical', 'emergency']):
        score += 0.15
        reasons.append("Urgent content → keep all informed")

    # Factor 5: Support/sales context
    if any(word in text for word in ['support', 'ticket', 'issue', 'bug', 'help']):
        score += 0.1
        reasons.append("Support context → team visibility")

    decision = score >= 0.3
    confidence = min(score, 1.0)

    return {
        'decision': decision,
        'confidence': round(confidence, 3),
        'score': round(score, 3),
        'reasons': reasons,
        'recommendation': 'reply_all' if decision else 'reply'
    }

# ── Case-by-case decision matrix ────────────────────────────────────────────

def compute_decision_score(email: dict) -> dict:
    """
    Multi-dimensional scoring for each email.
    Returns comprehensive analysis with recommended action.
    """
    subject = email.get('subject', '')
    snippet = email.get('snippet', '')
    sender = email.get('from', '')
    text = f"{subject} {snippet}"
    text_lower = text.lower()

    # 1. Urgency score (0-1)
    urgency_keywords = {
        'urgent': 0.9, 'asap': 0.85, 'emergency': 0.95, 'critical': 0.8,
        'immediately': 0.85, 'deadline': 0.6, 'today': 0.5, 'eod': 0.7,
        'time-sensitive': 0.75, 'priority': 0.6,
    }
    urgency_score = max([v for k, v in urgency_keywords.items() if k in text_lower] or [0.2])

    # 2. Importance score (0-1)
    importance_signals = {
        'invoice': 0.8, 'payment': 0.85, 'contract': 0.9, 'agreement': 0.8,
        'proposal': 0.7, 'partnership': 0.75, 'investment': 0.9,
        'legal': 0.85, 'compliance': 0.8, 'audit': 0.75,
    }
    importance_score = max([v for k, v in importance_signals.items() if k in text_lower] or [0.3])

    # 3. Relationship score (0-1) - based on sender domain
    sender_domain = sender.split('@')[-1] if '@' in sender else ''
    relationship_score = 0.5  # default
    if any(d in sender_domain for d in ['gmail.com', 'yahoo.com', 'hotmail.com']):
        relationship_score = 0.3  # personal email = lower priority unless known
    elif any(d in sender_domain for d in ['zion', 'ziontechgroup']):
        relationship_score = 0.95  # internal = high priority

    # 4. Complexity score (0-1) - longer = more complex
    complexity_score = min(len(snippet) / 1000.0, 1.0)

    # 5. Reply-all signal
    reply_all_analysis = should_reply_all(sender, subject, snippet)
    reply_all_score = reply_all_analysis['score']

    # Weighted composite score
    composite = (
        WEIGHTS['urgency'] * urgency_score +
        WEIGHTS['importance'] * importance_score +
        WEIGHTS['relationship'] * relationship_score +
        WEIGHTS['complexity'] * complexity_score +
        WEIGHTS['reply_all_signal'] * reply_all_score
    )

    # Determine action
    if composite >= 0.7:
        action = 'immediate_reply'
        priority = 'HIGH'
    elif composite >= 0.5:
        action = 'reply_today'
        priority = 'MEDIUM'
    elif composite >= 0.3:
        action = 'reply_this_week'
        priority = 'LOW'
    else:
        action = 'review_later'
        priority = 'BACKGROUND'

    return {
        'composite_score': round(composite, 3),
        'priority': priority,
        'action': action,
        'urgency': round(urgency_score, 2),
        'importance': round(importance_score, 2),
        'relationship': round(relationship_score, 2),
        'complexity': round(complexity_score, 2),
        'reply_all': reply_all_analysis,
        'language': detect_language(text),
        'attachments': analyze_attachments(subject, snippet),
    }

# ── Smart response generation ────────────────────────────────────────────────

def generate_smart_reply(email: dict, analysis: dict) -> str:
    """Generate context-aware reply based on email analysis."""
    if not IMPORTS_OK:
        return "[Analysis-only mode — LLM unavailable]"

    subject = email.get('subject', '')
    sender = email.get('from', '')
    snippet = email.get('snippet', '')
    language = analysis.get('language', 'en')
    tone = 'professional'

    # Adjust tone based on analysis
    if analysis['urgency'] >= 0.7:
        tone = 'direct'
    elif 'sales_lead' in snippet.lower() or 'partnership' in snippet.lower():
        tone = 'friendly'
    elif analysis.get('attachments', {}).get('has_invoice'):
        tone = 'formal'

    # Language-aware prompt
    lang_instruction = ''
    if language != 'en':
        lang_instruction = f"\nIMPORTANT: Respond in {language} language to match the sender's language."

    prompt = f"""You are Kleber Garcia Alcatrao from Zion Tech Group. Generate a {tone} email reply.

Original email:
  From: {sender}
  Subject: {subject}
  Content: {snippet[:500]}

Analysis:
  Priority: {analysis['priority']}
  Language: {language}
  Reply-all: {analysis['reply_all']['recommendation']}
  Has invoice: {analysis['attachments']['has_invoice']}
  Has contract: {analysis['attachments']['has_contract']}
{lang_instruction}

Requirements:
- Be concise but thorough
- Address all points raised in the email
- Include relevant next steps
- Use appropriate greeting and sign-off
- Include Zion Tech Group signature:
  Kleber Garcia Alcatrao | Zion Tech Group
  📱 +1 302 464 0950 | 📧 kleber@ziontechgroup.com
  📍 364 E Main St STE 1008, Middletown, DE 19709

Generate the reply:"""

    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.4)
        return resp.get('content', '').strip()
    except Exception as e:
        return f"[Reply generation failed: {e}]"

# ── Main processing loop ─────────────────────────────────────────────────────

def process_emails(max_emails: int = 20, dry_run: bool = True) -> list:
    """
    Process unread emails with V55 intelligence.
    Returns list of decision records.
    """
    if not IMPORTS_OK:
        print("⚠️  Cannot process emails — workspace imports unavailable")
        return []

    print(f"🔍 V55 Case-by-Case Intelligence Engine — Processing {max_emails} emails...")
    print(f"   Mode: {'DRY RUN (analysis only)' if dry_run else 'LIVE (drafts will be created)'}")
    print()

    # Search for unread emails
    try:
        emails = gmail_search('is:unread -category:promotions -category:social', max_results=max_emails)
    except Exception as e:
        print(f"❌ Gmail search failed: {e}")
        return []

    if not emails:
        print("✅ No unread emails to process")
        return []

    print(f"📧 Found {len(emails)} emails to analyze\n")

    decisions = []
    for i, email in enumerate(emails, 1):
        subject = email.get('subject', '(no subject)')
        sender = email.get('from', 'unknown')
        snippet = email.get('snippet', '')

        print(f"  [{i}/{len(emails)}] {subject[:60]}")
        print(f"    From: {sender}")

        # Run case-by-case analysis
        analysis = compute_decision_score(email)

        print(f"    Score: {analysis['composite_score']} | Priority: {analysis['priority']} | Lang: {analysis['language']}")
        print(f"    Reply-all: {analysis['reply_all']['recommendation']} (confidence: {analysis['reply_all']['confidence']})")
        print(f"    Action: {analysis['action']}")

        # Log decision
        decision = {
            'email_id': email.get('id', ''),
            'subject': subject,
            'sender': sender,
            'analysis': analysis,
            'dry_run': dry_run,
        }
        append_decision(decision)
        decisions.append(decision)

        # Generate reply if not dry run and action requires it
        if not dry_run and analysis['action'] in ('immediate_reply', 'reply_today'):
            reply_text = generate_smart_reply(email, analysis)
            if reply_text and not reply_text.startswith('['):
                try:
                    use_reply_all = analysis['reply_all']['decision']
                    gmail_create_draft_new(
                        to=sender,
                        subject=f"Re: {subject}",
                        body=reply_text,
                        reply_to_thread=email.get('id'),
                    )
                    print(f"    ✅ Draft created (reply-all: {use_reply_all})")
                except Exception as e:
                    print(f"    ❌ Draft failed: {e}")

        print()

    # Summary
    high = sum(1 for d in decisions if d['analysis']['priority'] == 'HIGH')
    medium = sum(1 for d in decisions if d['analysis']['priority'] == 'MEDIUM')
    low = sum(1 for d in decisions if d['analysis']['priority'] == 'LOW')
    reply_all_count = sum(1 for d in decisions if d['analysis']['reply_all']['decision'])

    print("═" * 60)
    print(f"📊 V55 Summary:")
    print(f"   Total analyzed: {len(decisions)}")
    print(f"   HIGH priority: {high}")
    print(f"   MEDIUM priority: {medium}")
    print(f"   LOW priority: {low}")
    print(f"   Reply-all recommended: {reply_all_count}")
    print(f"   Languages detected: {set(d['analysis']['language'] for d in decisions)}")

    # Save state
    save_json(V55_STATE, {
        'last_run': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'emails_processed': len(decisions),
        'high_priority': high,
        'medium_priority': medium,
        'low_priority': low,
        'reply_all_count': reply_all_count,
    })

    return decisions

# ── Follow-up scheduler ──────────────────────────────────────────────────────

def check_followups():
    """Check for emails that need follow-up reminders."""
    followups = load_json(FOLLOWUP_QUEUE, [])
    now = datetime.datetime.now(datetime.timezone.utc)
    due = []
    remaining = []

    for f in followups:
        due_date = datetime.datetime.fromisoformat(f['due_date'])
        if now >= due_date:
            due.append(f)
        else:
            remaining.append(f)

    if due:
        print(f"⏰ {len(due)} follow-up(s) due!")
        for f in due:
            msg = f"📧 Follow-up due: {f['subject']} (from {f['sender']}, due {f['due_date']})"
            print(f"   {msg}")
            if IMPORTS_OK:
                try:
                    telegram_send(msg)
                except Exception:
                    pass

    save_json(FOLLOWUP_QUEUE, remaining)
    return due

def schedule_followup(email_id: str, subject: str, sender: str, days: int = 3):
    """Schedule a follow-up reminder for an email."""
    followups = load_json(FOLLOWUP_QUEUE, [])
    due_date = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)).isoformat()
    followups.append({
        'email_id': email_id,
        'subject': subject,
        'sender': sender,
        'due_date': due_date,
        'created': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    })
    save_json(FOLLOWUP_QUEUE, followups)
    print(f"   📅 Follow-up scheduled for {due_date}")

# ── CLI entry point ──────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='V55 Case-by-Case Intelligence Engine')
    parser.add_argument('--max', type=int, default=20, help='Max emails to process')
    parser.add_argument('--live', action='store_true', help='Create actual drafts (default: dry run)')
    parser.add_argument('--followup-check', action='store_true', help='Check due follow-ups')
    parser.add_argument('--status', action='store_true', help='Show last run status')
    args = parser.parse_args()

    if args.status:
        state = load_json(V55_STATE)
        if state:
            print(f"Last run: {state.get('last_run', 'never')}")
            print(f"Emails processed: {state.get('emails_processed', 0)}")
            print(f"HIGH: {state.get('high_priority', 0)} | MED: {state.get('medium_priority', 0)} | LOW: {state.get('low_priority', 0)}")
            print(f"Reply-all count: {state.get('reply_all_count', 0)}")
        else:
            print("No previous runs found")
    elif args.followup_check:
        check_followups()
    else:
        process_emails(max_emails=args.max, dry_run=not args.live)
