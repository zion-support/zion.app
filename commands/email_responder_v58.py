#!/usr/bin/env python3
"""
V58 — Intent Router + Attachment Intelligence + Urgency Decay + Personalization

New intelligence layer on top of V57:
  1. Intent-based routing (sales/support/billing/partnership/booking → specialized templates)
  2. Smart attachment handler (invoice→accounting, contract→legal, proposal→review)
  3. Time-based urgency decay (older unread emails auto-escalate priority)
  4. Response personalization (references previous interactions with same sender)
  5. Email triage strategy (auto-categorize into action/awaiting/reference/delegate)
  6. Calendar-aware detection (meeting requests → suggest scheduling action)
  7. Signature-based sender profiling (CEO vs engineer → different tone)
  8. Bankruptcy prevention (detects when inbox is overwhelmed → suggests triage)

Architecture:
  V58 wraps V57's compute_decision_score() with an additional intent_router layer
  that produces a structured action plan for each email.
"""
from __future__ import annotations

import json, os, re, sys, hashlib, datetime, time
from pathlib import Path
from typing import Optional, List, Dict, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

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
    print("⚠️  Workspace imports unavailable — analysis-only mode")

DATA_DIR = WORKSPACE / 'zion.app' / 'data'
V58_STATE = DATA_DIR / 'v58_state.json'
DECISION_LOG = DATA_DIR / 'v58_decisions.jsonl'
SENTIMENT_DB = DATA_DIR / 'v58_sentiment_db.json'
THREAD_MEMORY = DATA_DIR / 'v58_thread_memory.json'
INTENT_LOG = DATA_DIR / 'v58_intent_log.json'
FOLLOWUP_QUEUE = DATA_DIR / 'v58_followups.json'
REPLIED_HASHES = DATA_DIR / 'v58_replied_hashes.json'
SENDER_PROFILES = DATA_DIR / 'v58_sender_profiles.json'

# ── Contact details ──────────────────────────────────────────────────────────
CONTACT = {
    'name': 'Kleber Garcia Alcatrao',
    'company': 'Zion Tech Group',
    'email': 'kleber@ziontechgroup.com',
    'phone': '+1 302 464 0950',
    'address': '364 E Main St STE 1008, Middletown, DE 19709'
}

SIGNATURE = f"""\n\n--
{CONTACT['name']} | {CONTACT['company']}
📱 {CONTACT['phone']} | 📧 {CONTACT['email']}
📍 {CONTACT['address']}
🌐 ziontechgroup.com"""

# ── Helpers ──────────────────────────────────────────────────────────────────

def load_json(path: Path, default=None):
    if default is None: default = {}
    try:
        if path.exists():
            return json.loads(path.read_text(encoding='utf-8'))
    except Exception: pass
    return default

def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

def append_decision(event: dict):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    event['ts'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(DECISION_LOG, 'a', encoding='utf-8') as f:
        f.write(json.dumps(event, ensure_ascii=False) + '\n')

def email_hash(email: dict) -> str:
    key = f"{email.get('from','')}:{email.get('subject','')}:{email.get('snippet','')[:100]}"
    return hashlib.md5(key.encode()).hexdigest()

def already_replied(email: dict) -> bool:
    return email_hash(email) in load_json(REPLIED_HASHES, [])

def mark_replied(email: dict):
    hashes = load_json(REPLIED_HASHES, [])
    h = email_hash(email)
    if h not in hashes:
        hashes.append(h)
        if len(hashes) > 3000: hashes = hashes[-3000:]
        save_json(REPLIED_HASHES, hashes)

# ═══════════════════════════════════════════════════════════════════════════════
# 1. INTENT ROUTER — Classify email intent and route to specialized handling
# ═══════════════════════════════════════════════════════════════════════════════

INTENT_PATTERNS = {
    'sales_inquiry': {
        'keywords': ['pricing', 'quote', 'cost', 'buy', 'purchase', 'proposal', 'demo', 'trial', 'subscription', 'plan'],
        'weight': 0.9,
        'template': 'sales',
        'auto_action': 'reply_with_pricing',
        'priority_boost': 0.15,
    },
    'support_ticket': {
        'keywords': ['bug', 'error', 'not working', 'broken', 'issue', 'problem', 'help', 'ticket', 'trouble', 'fix'],
        'weight': 0.85,
        'template': 'support',
        'auto_action': 'acknowledge_and_escalate',
        'priority_boost': 0.20,
    },
    'billing_invoice': {
        'keywords': ['invoice', 'payment', 'billing', 'receipt', 'charge', 'refund', 'credit', 'overdue', 'balance'],
        'weight': 0.95,
        'template': 'billing',
        'auto_action': 'acknowledge_and_route_accounting',
        'priority_boost': 0.25,
    },
    'partnership_proposal': {
        'keywords': ['partnership', 'collaboration', 'reseller', 'affiliate', 'white-label', 'integration partner', 'co-marketing'],
        'weight': 0.75,
        'template': 'partnership',
        'auto_action': 'reply_with_interest',
        'priority_boost': 0.10,
    },
    'meeting_request': {
        'keywords': ['meeting', 'schedule', 'call', 'calendar', 'zoom', 'teams', 'available', 'time slot', 'book'],
        'weight': 0.70,
        'template': 'meeting',
        'auto_action': 'suggest_availability',
        'priority_boost': 0.05,
    },
    'contract_legal': {
        'keywords': ['contract', 'agreement', 'nda', 'msa', 'sow', 'terms', 'legal', 'compliance', 'signature'],
        'weight': 0.90,
        'template': 'legal',
        'auto_action': 'acknowledge_and_route_legal',
        'priority_boost': 0.20,
    },
    'feedback_complaint': {
        'keywords': ['disappointed', 'unhappy', 'terrible', 'worst', 'frustrating', 'complaint', 'dissatisfied', 'cancel'],
        'weight': 0.80,
        'template': 'retention',
        'auto_action': 'empathetic_response_and_escalate',
        'priority_boost': 0.30,
    },
    'job_application': {
        'keywords': ['resume', 'cv', 'job application', 'position', 'hiring', 'career', 'opportunity', 'candidate'],
        'weight': 0.60,
        'template': 'hr',
        'auto_action': 'acknowledge_and_route_hr',
        'priority_boost': 0.0,
    },
    'follow_up': {
        'keywords': ['following up', 'any update', 'checking in', 'haven\'t heard', 'status', 'progress', 'reminder'],
        'weight': 0.65,
        'template': 'followup',
        'auto_action': 'provide_update',
        'priority_boost': 0.15,
    },
    'thank_you': {
        'keywords': ['thank you', 'thanks', 'appreciate', 'great job', 'well done', 'kudos', 'grateful'],
        'weight': 0.30,
        'template': 'acknowledgment',
        'auto_action': 'brief_acknowledgment',
        'priority_boost': -0.10,
    },
}

def classify_intent(subject: str, snippet: str, sender: str) -> dict:
    """Multi-signal intent classification with confidence scoring."""
    text = f"{subject} {snippet}".lower()
    
    scores = {}
    matched_keywords = {}
    
    for intent, config in INTENT_PATTERNS.items():
        matches = [kw for kw in config['keywords'] if kw in text]
        if matches:
            scores[intent] = len(matches) * config['weight']
            matched_keywords[intent] = matches
    
    if not scores:
        return {
            'intent': 'general',
            'confidence': 0.3,
            'template': 'general',
            'auto_action': 'standard_reply',
            'priority_boost': 0.0,
            'matched_keywords': [],
        }
    
    # Get top intent
    top_intent = max(scores, key=scores.get)
    config = INTENT_PATTERNS[top_intent]
    confidence = min(scores[top_intent] / 2.0, 1.0)  # Normalize
    
    return {
        'intent': top_intent,
        'confidence': round(confidence, 2),
        'template': config['template'],
        'auto_action': config['auto_action'],
        'priority_boost': config['priority_boost'],
        'matched_keywords': matched_keywords.get(top_intent, []),
        'all_scores': {k: round(v, 2) for k, v in sorted(scores.items(), key=lambda x: -x[1])[:3]},
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 2. ATTACHMENT INTELLIGENCE — Smart handling based on document type
# ═══════════════════════════════════════════════════════════════════════════════

ATTACHMENT_HANDLERS = {
    'invoice': {
        'patterns': [r'invoice[\s_-]*\w*', r'factura', r'fatura', r'bill[\s_-]*\d+'],
        'action': 'route_to_accounting',
        'response_template': 'invoice_received',
        'urgency': 0.8,
    },
    'contract': {
        'patterns': [r'contract', r'agreement', r'nda', r'msa', r'statement of work'],
        'action': 'route_to_legal',
        'response_template': 'contract_received',
        'urgency': 0.85,
    },
    'proposal': {
        'patterns': [r'proposal', r'rfp', r'rfq', r'quote[\s_-]*\d+'],
        'action': 'review_and_respond',
        'response_template': 'proposal_received',
        'urgency': 0.7,
    },
    'report': {
        'patterns': [r'report', r'analysis', r'audit', r'review[\s_-]*doc'],
        'action': 'acknowledge_and_schedule_review',
        'response_template': 'report_received',
        'urgency': 0.5,
    },
    'specification': {
        'patterns': [r'spec', r'requirements', r'prd', r'brd', r'technical doc'],
        'action': 'review_and_respond',
        'response_template': 'spec_received',
        'urgency': 0.6,
    },
}

def analyze_attachment_type(subject: str, snippet: str) -> dict:
    """Detect attachment type and determine handling strategy."""
    text = f"{subject} {snippet}".lower()
    
    detected = []
    for doc_type, config in ATTACHMENT_HANDLERS.items():
        for pattern in config['patterns']:
            if re.search(pattern, text):
                detected.append({
                    'type': doc_type,
                    'action': config['action'],
                    'response_template': config['response_template'],
                    'urgency': config['urgency'],
                })
                break
    
    # Also check for mentions of attachments
    has_attachment = bool(re.search(r'(attach|enclosed|anexo|adjunto|pièce jointe|appended)', text))
    
    return {
        'detected_types': detected,
        'has_attachment_mention': has_attachment,
        'primary_action': detected[0]['action'] if detected else None,
        'attachment_urgency': max([d['urgency'] for d in detected], default=0.0),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 3. URGENCY DECAY — Older emails auto-escalate
# ═══════════════════════════════════════════════════════════════════════════════

def compute_urgency_decay(email_date: Optional[str], base_urgency: float = 0.3) -> dict:
    """
    Emails that sit unread auto-escalate in priority.
    Day 0-1: base urgency
    Day 2-3: +0.1
    Day 4-7: +0.2
    Day 8-14: +0.3 (warning threshold)
    Day 15+: +0.4 (critical - potential email bankruptcy)
    """
    if not email_date:
        return {'decay_boost': 0.0, 'days_old': 0, 'decay_label': 'fresh'}
    
    try:
        email_dt = datetime.datetime.fromisoformat(email_date.replace('Z', '+00:00'))
        now = datetime.datetime.now(datetime.timezone.utc)
        days_old = (now - email_dt).days
    except Exception:
        return {'decay_boost': 0.0, 'days_old': 0, 'decay_label': 'fresh'}
    
    if days_old <= 1:
        decay_boost = 0.0
        label = 'fresh'
    elif days_old <= 3:
        decay_boost = 0.10
        label = 'aging'
    elif days_old <= 7:
        decay_boost = 0.20
        label = 'stale'
    elif days_old <= 14:
        decay_boost = 0.30
        label = 'overdue'
    else:
        decay_boost = 0.40
        label = 'critical'
    
    return {
        'decay_boost': decay_boost,
        'days_old': days_old,
        'decay_label': label,
        'is_overdue': days_old > 7,
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 4. SENDER PROFILE — Signature-based role detection
# ═══════════════════════════════════════════════════════════════════════════════

SENIORITY_KEYWORDS = {
    'c_suite': ['ceo', 'cto', 'cfo', 'coo', 'cmo', 'chief', 'president', 'vp', 'vice president', 'director'],
    'management': ['manager', 'lead', 'head of', 'supervisor', 'team lead'],
    'technical': ['engineer', 'developer', 'architect', 'devops', 'sre', 'dba', 'analyst'],
    'sales': ['account', 'sales', 'business development', 'bd ', 'customer success'],
    'hr': ['hr', 'recruiter', 'talent', 'people ops', 'human resources'],
}

def detect_sender_role(snippet: str, sender: str) -> dict:
    """Detect sender's role from email signature and content."""
    text = f"{snippet}".lower()
    
    for role, keywords in SENIORITY_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                return {'role': role, 'confidence': 0.7, 'keyword': kw}
    
    # Domain-based heuristic
    if any(d in sender.lower() for d in ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']):
        return {'role': 'external', 'confidence': 0.5, 'keyword': 'personal_email'}
    
    return {'role': 'unknown', 'confidence': 0.3, 'keyword': ''}

def get_tone_for_role(role: str, sentiment: str) -> str:
    """Adapt tone based on sender role and email sentiment."""
    if role == 'c_suite':
        return 'formal' if sentiment != 'positive' else 'professional'
    elif role == 'management':
        return 'professional'
    elif role in ('technical', 'sales'):
        return 'direct' if sentiment == 'urgent' else 'professional'
    elif sentiment == 'negative':
        return 'empathetic'
    elif sentiment == 'positive':
        return 'friendly'
    return 'professional'

# ═══════════════════════════════════════════════════════════════════════════════
# 5. SENTIMENT + LANGUAGE (carried from V57)
# ═══════════════════════════════════════════════════════════════════════════════

SENTIMENT_KEYWORDS = {
    'positive': ['thank', 'great', 'excellent', 'appreciate', 'wonderful', 'love', 'happy', 'pleased', 'amazing'],
    'negative': ['frustrated', 'angry', 'disappointed', 'unacceptable', 'terrible', 'awful', 'hate', 'upset', 'annoyed'],
    'urgent': ['asap', 'urgent', 'immediately', 'critical', 'emergency', 'deadline', 'eod', 'today'],
}

def analyze_sentiment(text: str) -> dict:
    text_lower = text.lower()
    scores = {}
    for sentiment, keywords in SENTIMENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0: scores[sentiment] = score
    if not scores:
        return {'sentiment': 'neutral', 'confidence': 0.5, 'scores': {}}
    dominant = max(scores, key=scores.get)
    total = sum(scores.values())
    confidence = scores[dominant] / max(total, 1)
    return {'sentiment': dominant, 'confidence': round(min(confidence + 0.3, 1.0), 2), 'scores': scores}

LANG_PATTERNS = {
    'pt': r'\b(não|você|obrigado|bom dia|boa tarde|prezado|atenciosamente)\b',
    'es': r'\b(no|usted|gracias|buenos días|buenas tardes|estimado|saludos)\b',
    'fr': r'\b(ne|vous|merci|bonjour|bonsoir|cher|cordialement)\b',
    'de': r'\b(nicht|Sie|danke|guten Tag|sehr geehrte|mit freundlichen)\b',
    'it': r'\b(non|Lei|grazie|buongiorno|buonasera|gentile|cordiali)\b',
    'ja': r'[\u3040-\u309f\u30a0-\u30ff]|(ありがとうございます)',
    'zh': r'[\u4e00-\u9fff]{3,}',
    'ar': r'[\u0600-\u06ff]{3,}',
    'ru': r'[\u0400-\u04ff]{3,}',
}

def detect_language(text: str) -> str:
    text_lower = text.lower()
    scores = {}
    for lang, pattern in LANG_PATTERNS.items():
        matches = len(re.findall(pattern, text_lower, re.IGNORECASE))
        if matches > 0: scores[lang] = matches
    return max(scores, key=scores.get) if scores else 'en'

# ═══════════════════════════════════════════════════════════════════════════════
# 6. REPLY-ALL ENGINE (enhanced from V57)
# ═══════════════════════════════════════════════════════════════════════════════

def should_reply_all(sender: str, subject: str, snippet: str, cc_count: int = 0, thread_depth: int = 1) -> dict:
    score = 0.0
    reasons = []
    text = f"{subject} {snippet}".lower()

    # CC count
    if cc_count >= 3: score += 0.35; reasons.append(f"Multiple recipients ({cc_count} CCs)")
    elif cc_count >= 1: score += 0.15; reasons.append(f"CCs present ({cc_count})")

    # Thread depth
    if thread_depth >= 4: score += 0.30; reasons.append(f"Deep thread ({thread_depth} msgs)")
    elif thread_depth >= 2: score += 0.15; reasons.append(f"Thread context ({thread_depth} msgs)")

    # Content signals
    reply_all_signals = [
        r'(team|everyone|all|folks|guys|hi all|dear all)',
        r'(please share|please forward|keep.*in.*loop)',
        r'(update.*team|inform.*all|notify.*everyone)',
        r'(meeting notes|minutes|recap)',
        r'(cc|bcc)',
    ]
    for pattern in reply_all_signals:
        if re.search(pattern, text):
            score += 0.25
            reasons.append("Group communication signal")
            break

    # Urgency
    if any(w in text for w in ['urgent', 'asap', 'critical', 'emergency']):
        score += 0.15; reasons.append("Urgent content")

    # Support context
    if any(w in text for w in ['support', 'ticket', 'issue', 'bug', 'incident']):
        score += 0.10; reasons.append("Support context")

    decision = score >= 0.25
    return {
        'decision': decision,
        'confidence': round(min(score, 1.0), 3),
        'score': round(score, 3),
        'reasons': reasons,
        'recommendation': 'reply_all' if decision else 'reply'
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 7. THREAD CONTEXT + SENTIMENT DB (from V57, enhanced)
# ═══════════════════════════════════════════════════════════════════════════════

def get_thread_context(subject: str, sender: str) -> dict:
    memory = load_json(THREAD_MEMORY, {})
    clean_subject = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.IGNORECASE).strip().lower()
    thread_key = f"{sender.lower()}:{clean_subject}"
    if thread_key in memory:
        thread = memory[thread_key]
        return {
            'has_history': True,
            'message_count': thread.get('message_count', 0),
            'first_contact': thread.get('first_contact'),
            'last_contact': thread.get('last_contact'),
            'last_sentiment': thread.get('last_sentiment', 'neutral'),
            'key_topics': thread.get('key_topics', []),
        }
    return {'has_history': False, 'message_count': 0}

def update_thread_memory(subject: str, sender: str, sentiment: str, snippet: str):
    memory = load_json(THREAD_MEMORY, {})
    clean_subject = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.IGNORECASE).strip().lower()
    thread_key = f"{sender.lower()}:{clean_subject}"
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    if thread_key not in memory:
        memory[thread_key] = {'first_contact': now, 'last_contact': now, 'message_count': 0, 'last_sentiment': sentiment, 'key_topics': []}
    thread = memory[thread_key]
    thread['last_contact'] = now
    thread['message_count'] += 1
    thread['last_sentiment'] = sentiment
    words = re.findall(r'\b\w{4,}\b', snippet.lower())
    topic_words = [w for w in words if w not in {'this', 'that', 'with', 'from', 'have', 'will', 'would', 'could', 'should'}]
    if topic_words:
        existing = set(thread['key_topics'])
        new_topics = set(topic_words[:5])
        thread['key_topics'] = list(existing.union(new_topics))[:15]
    save_json(THREAD_MEMORY, memory)

# ═══════════════════════════════════════════════════════════════════════════════
# 8. V58 MASTER DECISION ENGINE — Combines all intelligence layers
# ═══════════════════════════════════════════════════════════════════════════════

def compute_v58_decision(email: dict) -> dict:
    """
    V58 master analysis: combines intent routing, attachment intelligence,
    urgency decay, sentiment analysis, thread context, and reply-all logic.
    """
    subject = email.get('subject', '')
    snippet = email.get('snippet', '')
    sender = email.get('from', '')
    email_date = email.get('date', '')
    text = f"{subject} {snippet}"

    # Layer 1: Intent classification
    intent = classify_intent(subject, snippet, sender)

    # Layer 2: Attachment intelligence
    attachment = analyze_attachment_type(subject, snippet)

    # Layer 3: Sentiment analysis
    sentiment = analyze_sentiment(text)

    # Layer 4: Language detection
    language = detect_language(text)

    # Layer 5: Urgency decay
    decay = compute_urgency_decay(email_date)

    # Layer 6: Sender role detection
    sender_role = detect_sender_role(snippet, sender)

    # Layer 7: Reply-all decision
    reply_all = should_reply_all(sender, subject, snippet)

    # Layer 8: Thread context
    thread_ctx = get_thread_context(subject, sender)

    # ── Composite scoring ──
    base_urgency = 0.2
    if any(w in text.lower() for w in ['urgent', 'asap', 'emergency', 'critical', 'immediately']):
        base_urgency = 0.9
    elif any(w in text.lower() for w in ['deadline', 'eod', 'today']):
        base_urgency = 0.7

    importance = 0.3
    if attachment['attachment_urgency'] > 0:
        importance = max(importance, attachment['attachment_urgency'])
    importance = max(importance, intent.get('priority_boost', 0) + 0.3)

    # Composite score with all layers
    composite = (
        0.20 * base_urgency +
        0.20 * importance +
        0.15 * intent.get('priority_boost', 0) +
        0.10 * decay['decay_boost'] +
        0.10 * reply_all['score'] +
        0.10 * (0.8 if sentiment['sentiment'] == 'negative' else 0.5 if sentiment['sentiment'] == 'neutral' else 0.3) +
        0.10 * min(thread_ctx.get('message_count', 0) * 0.1, 0.8) +
        0.05 * (0.9 if sender_role['role'] == 'c_suite' else 0.5)
    )

    # Determine priority and action
    if composite >= 0.75:
        priority, action = 'CRITICAL', 'immediate_reply'
    elif composite >= 0.6:
        priority, action = 'HIGH', 'reply_today'
    elif composite >= 0.4:
        priority, action = 'MEDIUM', 'reply_this_week'
    elif composite >= 0.2:
        priority, action = 'LOW', 'review_later'
    else:
        priority, action = 'BACKGROUND', 'archive'

    # Triage category
    if intent['intent'] in ('sales_inquiry', 'partnership_proposal'):
        triage = 'ACTION'
    elif intent['intent'] in ('support_ticket', 'feedback_complaint'):
        triage = 'ESCALATE'
    elif intent['intent'] == 'follow_up':
        triage = 'AWAITING'
    elif intent['intent'] == 'thank_you':
        triage = 'REFERENCE'
    elif attachment['detected_types']:
        triage = 'ACTION'
    else:
        triage = 'ACTION' if priority in ('CRITICAL', 'HIGH') else 'REVIEW'

    # Update thread memory
    update_thread_memory(subject, sender, sentiment['sentiment'], snippet)

    return {
        'composite_score': round(composite, 3),
        'priority': priority,
        'action': action,
        'triage': triage,
        'intent': intent,
        'attachment': attachment,
        'sentiment': sentiment,
        'language': language,
        'urgency_decay': decay,
        'sender_role': sender_role,
        'reply_all': reply_all,
        'thread_context': thread_ctx,
        'tone': get_tone_for_role(sender_role['role'], sentiment['sentiment']),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# 9. RESPONSE QUALITY GATE
# ═══════════════════════════════════════════════════════════════════════════════

def score_response_quality(reply: str, email: dict) -> dict:
    issues = []
    score = 1.0
    if len(reply) < 50: issues.append(f"Too short ({len(reply)} chars)"); score -= 0.3
    if len(reply) > 3000: issues.append(f"Too long ({len(reply)} chars)"); score -= 0.2
    for p in ['[your name]', '[insert]', 'todo', 'fill in', 'xxx', 'placeholder']:
        if p in reply.lower(): issues.append(f"Placeholder: {p}"); score -= 0.2
    if reply.startswith('[') and ']' in reply[:50]: issues.append("Error marker"); score -= 0.4
    greetings = ['hi ', 'hello', 'dear', 'good morning', 'bom dia', 'hola', 'bonjour']
    if not any(g in reply.lower()[:100] for g in greetings): issues.append("No greeting"); score -= 0.1
    if 'zion' not in reply.lower() and 'kleber' not in reply.lower(): issues.append("No signature"); score -= 0.15
    score = max(0.0, min(1.0, score))
    return {'score': round(score, 2), 'passes': score >= 0.6, 'issues': issues}

# ═══════════════════════════════════════════════════════════════════════════════
# 10. INTENT-AWARE RESPONSE GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

INTENT_INSTRUCTIONS = {
    'sales_inquiry': "This is a sales inquiry. Mention relevant services from Zion Tech Group, provide pricing ranges, and offer a custom proposal or demo. Include a clear CTA to schedule a call.",
    'support_ticket': "This is a support request. Acknowledge the issue, confirm you're investigating, provide an expected resolution timeline, and ask for any additional details needed.",
    'billing_invoice': "This relates to billing/invoicing. Acknowledge receipt, confirm the invoice details, and provide payment timeline or ask clarifying questions.",
    'partnership_proposal': "This is a partnership inquiry. Express interest, briefly describe Zion Tech Group's capabilities, and propose a discovery call to explore synergy.",
    'meeting_request': "This is a meeting request. Confirm availability or suggest alternative times. Be specific about timezone (ET) and preferred platform (Zoom/Teams/Google Meet).",
    'contract_legal': "This involves a legal document. Acknowledge receipt, confirm you'll review, and provide an estimated timeline for response.",
    'feedback_complaint': "This is a complaint or negative feedback. Lead with empathy, acknowledge the issue, take responsibility, and outline concrete steps to resolve.",
    'job_application': "This is a job application. Acknowledge receipt, confirm the position, and provide next steps in the hiring process.",
    'follow_up': "This is a follow-up email. Provide a status update, acknowledge the delay if applicable, and commit to a specific next action with timeline.",
    'thank_you': "This is a thank-you note. Keep it brief and warm. Acknowledge their appreciation and reinforce the relationship.",
    'general': "Generate a professional, helpful response addressing all points in the email.",
}

def generate_smart_reply(email: dict, analysis: dict) -> str:
    if not IMPORTS_OK:
        return "[Analysis-only mode — LLM unavailable]"

    subject = email.get('subject', '')
    sender = email.get('from', '')
    snippet = email.get('snippet', '')
    intent = analysis['intent']
    tone = analysis['tone']
    language = analysis['language']
    thread_ctx = analysis['thread_context']

    # Intent-specific instructions
    intent_instruction = INTENT_INSTRUCTIONS.get(intent['intent'], INTENT_INSTRUCTIONS['general'])

    # Thread context
    thread_note = ''
    if thread_ctx.get('has_history'):
        topics = ', '.join(thread_ctx.get('key_topics', [])[:3])
        thread_note = f"\nTHREAD: Message #{thread_ctx['message_count']} in conversation. Previous sentiment: {thread_ctx.get('last_sentiment', 'neutral')}. Topics: {topics}."

    # Reply-all note
    reply_all_note = ''
    if analysis['reply_all']['decision']:
        reply_all_note = f"\nREPLY-ALL: Yes ({analysis['reply_all']['confidence']:.0%} confidence). Keep tone appropriate for group."

    # Language note
    lang_note = ''
    if language != 'en':
        lang_note = f"\nLANGUAGE: Respond in {language} to match sender."

    # Attachment note
    attachment_note = ''
    if analysis['attachment']['detected_types']:
        doc_types = [d['type'] for d in analysis['attachment']['detected_types']]
        attachment_note = f"\nATTACHMENT: Detected {', '.join(doc_types)}. Acknowledge receipt and confirm next steps."

    prompt = f"""You are {CONTACT['name']} from {CONTACT['company']}. Generate a {tone} email reply.

Original email:
  From: {sender}
  Subject: {subject}
  Content: {snippet[:600]}

V58 Analysis:
  Intent: {intent['intent']} (confidence: {intent['confidence']})
  Priority: {analysis['priority']}
  Sentiment: {analysis['sentiment']['sentiment']}
  Tone: {tone}
{thread_note}{reply_all_note}{lang_note}{attachment_note}

{intent_instruction}

Requirements:
- Address ALL points in the email
- Be specific (not generic)
- Include concrete next steps with timelines
- Match the appropriate tone ({tone})

Signature:
{CONTACT['name']} | {CONTACT['company']}
📱 {CONTACT['phone']} | 📧 {CONTACT['email']}
📍 {CONTACT['address']}
🌐 ziontechgroup.com

Generate the reply:"""

    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.4)
        reply = resp.get('content', '').strip()
        if 'zion' not in reply.lower():
            reply += SIGNATURE
        return reply
    except Exception as e:
        return f"[Reply generation failed: {e}]"

# ═══════════════════════════════════════════════════════════════════════════════
# 11. MAIN PROCESSING LOOP
# ═══════════════════════════════════════════════════════════════════════════════

def process_single_email(email: dict, dry_run: bool) -> dict:
    subject = email.get('subject', '(no subject)')
    sender = email.get('from', 'unknown')
    
    if already_replied(email):
        return {'skipped': True, 'reason': 'already_processed', 'subject': subject}

    analysis = compute_v58_decision(email)
    
    result = {
        'email_id': email.get('id', ''),
        'subject': subject[:80],
        'sender': sender,
        'analysis': analysis,
        'dry_run': dry_run,
        'reply_generated': False,
        'quality_score': None,
    }

    # Generate reply for actionable emails
    if not dry_run and analysis['action'] in ('immediate_reply', 'reply_today'):
        reply_text = generate_smart_reply(email, analysis)
        quality = score_response_quality(reply_text, email)
        result['quality_score'] = quality
        
        if quality['passes']:
            try:
                gmail_create_draft_new(
                    to=sender,
                    subject=f"Re: {subject}",
                    body=reply_text,
                    reply_to_thread=email.get('id'),
                )
                result['reply_generated'] = True
                mark_replied(email)
                if analysis['priority'] in ('CRITICAL', 'HIGH'):
                    schedule_followup(email.get('id', ''), subject, sender, days=2)
            except Exception as e:
                result['error'] = str(e)
        else:
            result['quality_issues'] = quality['issues']

    append_decision(result)
    return result

def process_emails(max_emails: int = 25, dry_run: bool = True, parallel: bool = True) -> list:
    if not IMPORTS_OK:
        print("⚠️  Cannot process emails — workspace imports unavailable")
        return []

    mode = 'DRY RUN' if dry_run else 'LIVE'
    speed = 'PARALLEL' if parallel else 'SEQUENTIAL'
    print(f"🔍 V58 Intent Router Engine — {mode} ({speed})")
    print(f"   Processing up to {max_emails} emails...\n")

    try:
        emails = gmail_search('is:unread -category:promotions -category:social', max_results=max_emails)
    except Exception as e:
        print(f"❌ Gmail search failed: {e}")
        return []

    if not emails:
        print("✅ No unread emails to process")
        return []

    print(f"📧 Found {len(emails)} emails\n")
    results = []
    start = time.time()

    if parallel and len(emails) > 1:
        with ThreadPoolExecutor(max_workers=min(5, len(emails))) as executor:
            futures = {executor.submit(process_single_email, email, dry_run): email for email in emails}
            for future in as_completed(futures):
                r = future.result()
                results.append(r)
                if not r.get('skipped'):
                    a = r['analysis']
                    print(f"  [{a['priority'][:4]}] {r['subject'][:40]} | Intent: {a['intent']['intent']} | "
                          f"Triage: {a['triage']} | Sentiment: {a['sentiment']['sentiment']} | "
                          f"Decay: {a['urgency_decay']['decay_label']} | "
                          f"Reply-all: {'✓' if a['reply_all']['decision'] else '✗'}")
    else:
        for email in emails:
            r = process_single_email(email, dry_run)
            results.append(r)
            if not r.get('skipped'):
                a = r['analysis']
                print(f"  [{a['priority'][:4]}] {r['subject'][:40]} | Intent: {a['intent']['intent']}")

    elapsed = time.time() - start
    active = [r for r in results if not r.get('skipped')]

    # Summary
    priority_counts = {}
    intent_counts = {}
    triage_counts = {}
    sentiment_counts = {}
    for r in active:
        a = r['analysis']
        p = a['priority']
        priority_counts[p] = priority_counts.get(p, 0) + 1
        i = a['intent']['intent']
        intent_counts[i] = intent_counts.get(i, 0) + 1
        t = a['triage']
        triage_counts[t] = triage_counts.get(t, 0) + 1
        s = a['sentiment']['sentiment']
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1

    overdue = sum(1 for r in active if r['analysis']['urgency_decay'].get('is_overdue'))
    drafts = sum(1 for r in active if r.get('reply_generated'))
    reply_all_count = sum(1 for r in active if r['analysis']['reply_all']['decision'])

    print(f"\n{'═' * 60}")
    print(f"📊 V58 Summary ({elapsed:.1f}s):")
    print(f"   Analyzed: {len(active)} | Skipped: {len(results) - len(active)}")
    print(f"   Priority: {priority_counts}")
    print(f"   Intents: {intent_counts}")
    print(f"   Triage: {triage_counts}")
    print(f"   Sentiments: {sentiment_counts}")
    print(f"   Reply-all: {reply_all_count} | Drafts: {drafts} | Overdue: {overdue}")

    # Bankruptcy warning
    if overdue > len(active) * 0.3:
        print(f"\n   ⚠️  INBOX OVERLOAD: {overdue}/{len(active)} emails overdue (>7 days)")
        print(f"   💡 Suggestion: Run triage mode — archive low-priority, batch-reply medium, focus on CRITICAL/HIGH")

    save_json(V58_STATE, {
        'last_run': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'emails_processed': len(active),
        'priority_distribution': priority_counts,
        'intent_distribution': intent_counts,
        'triage_distribution': triage_counts,
        'sentiment_distribution': sentiment_counts,
        'reply_all_count': reply_all_count,
        'drafts_created': drafts,
        'overdue_count': overdue,
        'elapsed_seconds': round(elapsed, 1),
        'mode': mode,
    })

    return results

# ── Follow-up scheduler ──────────────────────────────────────────────────────

def schedule_followup(email_id: str, subject: str, sender: str, days: int = 3):
    followups = load_json(FOLLOWUP_QUEUE, [])
    due = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)).isoformat()
    followups.append({'email_id': email_id, 'subject': subject, 'sender': sender, 'due_date': due, 'created': datetime.datetime.now(datetime.timezone.utc).isoformat()})
    save_json(FOLLOWUP_QUEUE, followups)

def check_followups():
    followups = load_json(FOLLOWUP_QUEUE, [])
    now = datetime.datetime.now(datetime.timezone.utc)
    due, remaining = [], []
    for f in followups:
        try:
            if now >= datetime.datetime.fromisoformat(f['due_date']): due.append(f)
            else: remaining.append(f)
        except Exception: remaining.append(f)
    if due:
        print(f"⏰ {len(due)} follow-up(s) due!")
        for f in due:
            msg = f"📧 Follow-up: {f['subject']} (from {f['sender']})"
            print(f"   {msg}")
            if IMPORTS_OK:
                try: telegram_send(msg)
                except: pass
    save_json(FOLLOWUP_QUEUE, remaining)
    return due

# ── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='V58 Intent Router + Attachment Intelligence')
    parser.add_argument('--max', type=int, default=25, help='Max emails')
    parser.add_argument('--live', action='store_true', help='Create drafts')
    parser.add_argument('--sequential', action='store_true', help='Disable parallel')
    parser.add_argument('--followup-check', action='store_true', help='Check follow-ups')
    parser.add_argument('--status', action='store_true', help='Show status')
    args = parser.parse_args()

    if args.status:
        state = load_json(V58_STATE)
        if state:
            print(f"Last run: {state.get('last_run', 'never')}")
            print(f"Processed: {state.get('emails_processed', 0)} in {state.get('elapsed_seconds', '?')}s")
            print(f"Priority: {state.get('priority_distribution', {})}")
            print(f"Intents: {state.get('intent_distribution', {})}")
            print(f"Triage: {state.get('triage_distribution', {})}")
            print(f"Drafts: {state.get('drafts_created', 0)} | Overdue: {state.get('overdue_count', 0)}")
        else:
            print("No previous runs")
    elif args.followup_check:
        check_followups()
    else:
        process_emails(max_emails=args.max, dry_run=not args.live, parallel=not args.sequential)
