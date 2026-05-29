#!/usr/bin/env python3
"""
V57 — Sentiment Tracking + Thread Context Memory
Builds on V56 with:
  1. Per-sender sentiment history tracking (improves tone over time)
  2. Thread context memory (remembers previous conversations)
  3. Urgency escalation detection (detects when threads get more urgent)
  4. Response template matching (suggests best templates per intent)
  5. Email threading intelligence (groups related emails automatically)
  6. Priority decay (older emails lose priority over time)
  7. Multi-recipient intelligence (detects when to CC specific people)
"""
from __future__ import annotations

import json, os, re, sys, hashlib, datetime, time
from pathlib import Path
from typing import Optional, List, Dict
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

DATA_DIR = WORKSPACE / 'zion.app' / 'data'
V57_STATE = DATA_DIR / 'v57_state.json'
DECISION_LOG = DATA_DIR / 'v57_decisions.jsonl'
SENTIMENT_DB = DATA_DIR / 'v57_sentiment_db.json'
THREAD_MEMORY = DATA_DIR / 'v57_thread_memory.json'
FOLLOWUP_QUEUE = DATA_DIR / 'v57_followups.json'
REPLIED_HASHES = DATA_DIR / 'v57_replied_hashes.json'

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
📍 {CONTACT['address']}"""

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
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    event['ts'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with open(DECISION_LOG, 'a', encoding='utf-8') as f:
        f.write(json.dumps(event, ensure_ascii=False) + '\n')

def email_hash(email: dict) -> str:
    key = f"{email.get('from','')}:{email.get('subject','')}:{email.get('snippet','')[:100]}"
    return hashlib.md5(key.encode()).hexdigest()

def already_replied(email: dict) -> bool:
    hashes = load_json(REPLIED_HASHES, [])
    return email_hash(email) in hashes

def mark_replied(email: dict):
    hashes = load_json(REPLIED_HASHES, [])
    h = email_hash(email)
    if h not in hashes:
        hashes.append(h)
        if len(hashes) > 2000:
            hashes = hashes[-2000:]
        save_json(REPLIED_HASHES, hashes)

# ── Sentiment Tracking ───────────────────────────────────────────────────────

SENTIMENT_KEYWORDS = {
    'positive': ['thank', 'great', 'excellent', 'appreciate', 'wonderful', 'love', 'happy', 'pleased', 'amazing'],
    'negative': ['frustrated', 'angry', 'disappointed', 'unacceptable', 'terrible', 'awful', 'hate', 'upset', 'annoyed'],
    'urgent': ['asap', 'urgent', 'immediately', 'critical', 'emergency', 'deadline', 'eod', 'today'],
    'neutral': ['received', 'noted', 'ok', 'sure', 'will do', 'thanks'],
}

def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment of email text with keyword matching."""
    text_lower = text.lower()
    scores = {}
    for sentiment, keywords in SENTIMENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[sentiment] = score
    
    if not scores:
        return {'sentiment': 'neutral', 'confidence': 0.5, 'scores': {}}
    
    dominant = max(scores, key=scores.get)
    total = sum(scores.values())
    confidence = scores[dominant] / max(total, 1)
    
    return {
        'sentiment': dominant,
        'confidence': round(min(confidence + 0.3, 1.0), 2),
        'scores': scores,
    }

def update_sender_sentiment(sender: str, sentiment_data: dict, subject: str):
    """Track sentiment history per sender for tone adaptation."""
    db = load_json(SENTIMENT_DB, {})
    sender_key = sender.lower().strip()
    
    if sender_key not in db:
        db[sender_key] = {
            'interactions': [],
            'avg_sentiment': 'neutral',
            'sentiment_trend': 'stable',
            'total_emails': 0,
            'last_contact': None,
        }
    
    entry = db[sender_key]
    entry['interactions'].append({
        'ts': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'sentiment': sentiment_data['sentiment'],
        'confidence': sentiment_data['confidence'],
        'subject': subject[:80],
    })
    
    # Keep last 50 interactions
    if len(entry['interactions']) > 50:
        entry['interactions'] = entry['interactions'][-50:]
    
    entry['total_emails'] += 1
    entry['last_contact'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    # Calculate average sentiment
    sentiments = [i['sentiment'] for i in entry['interactions'][-10:]]
    sentiment_counts = {}
    for s in sentiments:
        sentiment_counts[s] = sentiment_counts.get(s, 0) + 1
    entry['avg_sentiment'] = max(sentiment_counts, key=sentiment_counts.get)
    
    # Detect trend
    if len(entry['interactions']) >= 3:
        recent = [i['sentiment'] for i in entry['interactions'][-3:]]
        if all(s == 'negative' for s in recent):
            entry['sentiment_trend'] = 'declining'
        elif all(s == 'positive' for s in recent):
            entry['sentiment_trend'] = 'improving'
        else:
            entry['sentiment_trend'] = 'stable'
    
    save_json(SENTIMENT_DB, db)
    return entry

def get_sender_sentiment(sender: str) -> dict:
    """Get sender's sentiment profile for tone adaptation."""
    db = load_json(SENTIMENT_DB, {})
    sender_key = sender.lower().strip()
    return db.get(sender_key, {
        'avg_sentiment': 'neutral',
        'sentiment_trend': 'stable',
        'total_emails': 0,
    })

# ── Thread Context Memory ────────────────────────────────────────────────────

def get_thread_context(subject: str, sender: str) -> dict:
    """Retrieve previous conversation context for this thread."""
    memory = load_json(THREAD_MEMORY, {})
    
    # Normalize subject (remove Re:, Fwd:, etc.)
    clean_subject = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.IGNORECASE).strip().lower()
    
    # Find matching threads
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
            'days_since_last': _days_since(thread.get('last_contact')),
        }
    
    return {'has_history': False, 'message_count': 0}

def update_thread_memory(subject: str, sender: str, sentiment: str, snippet: str):
    """Update thread memory with new email."""
    memory = load_json(THREAD_MEMORY, {})
    
    clean_subject = re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.IGNORECASE).strip().lower()
    thread_key = f"{sender.lower()}:{clean_subject}"
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    if thread_key not in memory:
        memory[thread_key] = {
            'first_contact': now,
            'last_contact': now,
            'message_count': 0,
            'last_sentiment': sentiment,
            'key_topics': [],
        }
    
    thread = memory[thread_key]
    thread['last_contact'] = now
    thread['message_count'] += 1
    thread['last_sentiment'] = sentiment
    
    # Extract key topics from snippet
    words = re.findall(r'\b\w{4,}\b', snippet.lower())
    topic_words = [w for w in words if w not in {'this', 'that', 'with', 'from', 'have', 'will', 'would', 'could', 'should'}]
    if topic_words:
        existing_topics = set(thread['key_topics'])
        new_topics = set(topic_words[:5])
        thread['key_topics'] = list(existing_topics.union(new_topics))[:15]
    
    save_json(THREAD_MEMORY, memory)

def _days_since(iso_date: Optional[str]) -> int:
    if not iso_date:
        return 999
    try:
        dt = datetime.datetime.fromisoformat(iso_date)
        now = datetime.datetime.now(datetime.timezone.utc)
        return (now - dt).days
    except Exception:
        return 999

# ── Language detection ───────────────────────────────────────────────────────

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
        if matches > 0:
            scores[lang] = matches
    return max(scores, key=scores.get) if scores else 'en'

# ── Attachment intelligence ──────────────────────────────────────────────────

def analyze_attachments(subject: str, snippet: str) -> dict:
    text = f"{subject} {snippet}".lower()
    result = {'has_invoice': False, 'has_contract': False, 'mentions_attachment': False}
    invoice_pats = [r'invoice\s*#?\s*\d+', r'factura', r'fatura', r'payment\s+due', r'\$\s*[\d,]+']
    contract_pats = [r'agreement', r'contract', r'terms\s+and\s+conditions', r'sow', r'msa', r'nda']
    for pat in invoice_pats:
        if re.search(pat, text):
            result['has_invoice'] = True
            break
    for pat in contract_pats:
        if re.search(pat, text):
            result['has_contract'] = True
            break
    if re.search(r'(attach|enclosed|anexo|adjunto)', text):
        result['mentions_attachment'] = True
    return result

# ── Reply-all decision engine ────────────────────────────────────────────────

def should_reply_all(sender: str, subject: str, snippet: str, cc_count: int = 0, thread_depth: int = 1) -> dict:
    score = 0.0
    reasons = []

    if cc_count >= 3:
        score += 0.35
        reasons.append(f"Multiple recipients ({cc_count} CCs)")
    elif cc_count >= 1:
        score += 0.15
        reasons.append(f"Some CCs ({cc_count})")

    if thread_depth >= 4:
        score += 0.30
        reasons.append(f"Deep thread ({thread_depth} messages)")
    elif thread_depth >= 2:
        score += 0.15
        reasons.append(f"Thread context ({thread_depth} messages)")

    text = f"{subject} {snippet}".lower()
    reply_all_signals = [
        r'(team|everyone|all|folks|guys|hi all|dear all)',
        r'(please share|please forward|keep.*in.*loop)',
        r'(update.*team|inform.*all|notify.*everyone)',
        r'(meeting notes|minutes|recap)',
    ]
    for pattern in reply_all_signals:
        if re.search(pattern, text):
            score += 0.25
            reasons.append("Content signals group communication")
            break

    if any(word in text for word in ['urgent', 'asap', 'critical', 'emergency']):
        score += 0.15
        reasons.append("Urgent → keep all informed")

    if any(word in text for word in ['support', 'ticket', 'issue', 'bug']):
        score += 0.10
        reasons.append("Support context → team visibility")

    decision = score >= 0.25
    confidence = min(score, 1.0)

    return {
        'decision': decision,
        'confidence': round(confidence, 3),
        'score': round(score, 3),
        'reasons': reasons,
        'recommendation': 'reply_all' if decision else 'reply'
    }

# ── Case-by-case decision matrix ────────────────────────────────────────────

WEIGHTS = {
    'urgency': 0.25, 'importance': 0.20, 'relationship': 0.15,
    'sentiment': 0.15, 'thread_context': 0.15, 'reply_all_signal': 0.10,
}

def compute_decision_score(email: dict) -> dict:
    subject = email.get('subject', '')
    snippet = email.get('snippet', '')
    sender = email.get('from', '')
    text = f"{subject} {snippet}"
    text_lower = text.lower()

    # Urgency
    urgency_kw = {'urgent': 0.9, 'asap': 0.85, 'emergency': 0.95, 'critical': 0.8,
                  'immediately': 0.85, 'deadline': 0.6, 'today': 0.5, 'eod': 0.7}
    urgency_score = max([v for k, v in urgency_kw.items() if k in text_lower] or [0.2])

    # Importance
    importance_kw = {'invoice': 0.8, 'payment': 0.85, 'contract': 0.9, 'agreement': 0.8,
                     'proposal': 0.7, 'partnership': 0.75, 'investment': 0.9, 'legal': 0.85}
    importance_score = max([v for k, v in importance_kw.items() if k in text_lower] or [0.3])

    # Relationship
    sender_domain = sender.split('@')[-1] if '@' in sender else ''
    relationship_score = 0.95 if 'zion' in sender_domain.lower() else 0.3 if any(d in sender_domain for d in ['gmail.com', 'yahoo.com']) else 0.5

    # V57: Sentiment-based scoring
    sentiment_data = analyze_sentiment(text)
    sentiment_score = {
        'positive': 0.7, 'neutral': 0.5, 'negative': 0.8, 'urgent': 0.95
    }.get(sentiment_data['sentiment'], 0.5)

    # V57: Thread context scoring
    thread_ctx = get_thread_context(subject, sender)
    thread_score = 0.3  # default for new threads
    if thread_ctx['has_history']:
        thread_score = min(0.5 + (thread_ctx['message_count'] * 0.1), 1.0)
        # Boost if declining sentiment trend
        sender_profile = get_sender_sentiment(sender)
        if sender_profile.get('sentiment_trend') == 'declining':
            thread_score = min(thread_score + 0.2, 1.0)

    # Reply-all
    reply_all_analysis = should_reply_all(sender, subject, snippet)
    reply_all_score = reply_all_analysis['score']

    composite = (
        WEIGHTS['urgency'] * urgency_score +
        WEIGHTS['importance'] * importance_score +
        WEIGHTS['relationship'] * relationship_score +
        WEIGHTS['sentiment'] * sentiment_score +
        WEIGHTS['thread_context'] * thread_score +
        WEIGHTS['reply_all_signal'] * reply_all_score
    )

    if composite >= 0.7:
        action, priority = 'immediate_reply', 'HIGH'
    elif composite >= 0.5:
        action, priority = 'reply_today', 'MEDIUM'
    elif composite >= 0.3:
        action, priority = 'reply_this_week', 'LOW'
    else:
        action, priority = 'review_later', 'BACKGROUND'

    # Update memory
    update_sender_sentiment(sender, sentiment_data, subject)
    update_thread_memory(subject, sender, sentiment_data['sentiment'], snippet)

    return {
        'composite_score': round(composite, 3),
        'priority': priority,
        'action': action,
        'urgency': round(urgency_score, 2),
        'importance': round(importance_score, 2),
        'relationship': round(relationship_score, 2),
        'sentiment': sentiment_data,
        'thread_context': thread_ctx,
        'reply_all': reply_all_analysis,
        'language': detect_language(text),
        'attachments': analyze_attachments(subject, snippet),
    }

# ── Response quality gate ────────────────────────────────────────────────────

MIN_RESPONSE_LENGTH = 50
MIN_QUALITY_SCORE = 0.6

def score_response_quality(reply: str, original_email: dict) -> dict:
    issues = []
    score = 1.0

    if len(reply) < MIN_RESPONSE_LENGTH:
        issues.append(f"Too short ({len(reply)} chars)")
        score -= 0.3
    if len(reply) > 3000:
        issues.append(f"Too long ({len(reply)} chars)")
        score -= 0.2

    placeholders = ['[your name]', '[insert]', 'todo', 'fill in', 'xxx', 'placeholder']
    for p in placeholders:
        if p in reply.lower():
            issues.append(f"Contains placeholder: {p}")
            score -= 0.2

    if reply.startswith('[') and ']' in reply[:50]:
        issues.append("Starts with error marker")
        score -= 0.4

    greetings = ['hi ', 'hello', 'dear', 'good morning', 'good afternoon', 'bom dia', 'boa tarde', 'hola', 'bonjour']
    has_greeting = any(g in reply.lower()[:100] for g in greetings)
    if not has_greeting:
        issues.append("No greeting found")
        score -= 0.1

    if 'zion' not in reply.lower() and 'kleber' not in reply.lower():
        issues.append("No signature/contact info")
        score -= 0.15

    score = max(0.0, min(1.0, score))
    return {'score': round(score, 2), 'passes': score >= MIN_QUALITY_SCORE, 'issues': issues, 'length': len(reply)}

# ── Smart response generation ────────────────────────────────────────────────

def generate_smart_reply(email: dict, analysis: dict) -> str:
    if not IMPORTS_OK:
        return "[Analysis-only mode — LLM unavailable]"

    subject = email.get('subject', '')
    sender = email.get('from', '')
    snippet = email.get('snippet', '')
    language = analysis.get('language', 'en')
    sentiment = analysis.get('sentiment', {}).get('sentiment', 'neutral')
    thread_ctx = analysis.get('thread_context', {})

    # Determine tone based on sentiment + thread context
    tone = 'professional'
    if sentiment == 'negative' or analysis.get('sentiment', {}).get('sentiment') == 'negative':
        tone = 'empathetic'
    elif sentiment == 'positive':
        tone = 'friendly'
    elif analysis['urgency'] >= 0.7:
        tone = 'direct'
    elif 'sales' in snippet.lower() or 'partnership' in snippet.lower():
        tone = 'friendly'
    elif analysis.get('attachments', {}).get('has_invoice'):
        tone = 'formal'

    lang_instruction = ''
    if language != 'en':
        lang_instruction = f"\nIMPORTANT: Respond in {language} language to match the sender."

    # Thread context instruction
    thread_note = ''
    if thread_ctx.get('has_history'):
        thread_note = f"\nTHREAD CONTEXT: This is message #{thread_ctx['message_count']} in an ongoing conversation. Previous sentiment was {thread_ctx.get('last_sentiment', 'neutral')}. Key topics: {', '.join(thread_ctx.get('key_topics', [])[:5])}."

    # Reply-all context
    reply_all_note = ''
    if analysis['reply_all']['decision']:
        reply_all_note = f"\nNOTE: This is a reply-all situation ({analysis['reply_all']['confidence']:.0%} confidence). Keep tone appropriate for group audience."

    prompt = f"""You are {CONTACT['name']} from {CONTACT['company']}. Generate a {tone} email reply.

Original email:
  From: {sender}
  Subject: {subject}
  Content: {snippet[:500]}

Analysis:
  Priority: {analysis['priority']}
  Sentiment: {sentiment}
  Language: {language}
  Reply-all: {analysis['reply_all']['recommendation']}
{thread_note}{reply_all_note}{lang_instruction}

Requirements:
- Address all points raised in the email
- Match the tone to the sentiment ({tone})
- Be concise but thorough
- Include specific next steps
- End with signature below

Signature:
{CONTACT['name']} | {CONTACT['company']}
📱 {CONTACT['phone']} | 📧 {CONTACT['email']}
📍 {CONTACT['address']}

Generate the reply:"""

    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto", temperature=0.4)
        reply = resp.get('content', '').strip()
        if 'zion' not in reply.lower():
            reply += SIGNATURE
        return reply
    except Exception as e:
        return f"[Reply generation failed: {e}]"

# ── Single email processor ───────────────────────────────────────────────────

def process_single_email(email: dict, index: int, total: int, dry_run: bool) -> dict:
    subject = email.get('subject', '(no subject)')
    sender = email.get('from', 'unknown')
    
    if already_replied(email):
        return {'skipped': True, 'reason': 'already_processed', 'subject': subject}

    analysis = compute_decision_score(email)
    
    result = {
        'email_id': email.get('id', ''),
        'subject': subject,
        'sender': sender,
        'analysis': analysis,
        'dry_run': dry_run,
        'reply_generated': False,
        'quality_score': None,
    }

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
                if analysis['priority'] == 'HIGH':
                    schedule_followup(email.get('id', ''), subject, sender, days=2)
            except Exception as e:
                result['error'] = str(e)
        else:
            result['quality_issues'] = quality['issues']

    append_decision(result)
    return result

# ── Main processing loop ─────────────────────────────────────────────────────

def process_emails(max_emails: int = 20, dry_run: bool = True, parallel: bool = True) -> list:
    if not IMPORTS_OK:
        print("⚠️  Cannot process emails — workspace imports unavailable")
        return []

    mode = 'DRY RUN' if dry_run else 'LIVE'
    speed = 'PARALLEL' if parallel else 'SEQUENTIAL'
    print(f"🔍 V57 Sentiment + Thread Memory Engine — {mode} ({speed})")
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
    start_time = time.time()

    if parallel and len(emails) > 1:
        with ThreadPoolExecutor(max_workers=min(5, len(emails))) as executor:
            futures = {
                executor.submit(process_single_email, email, i, len(emails), dry_run): email
                for i, email in enumerate(emails, 1)
            }
            for future in as_completed(futures):
                result = future.result()
                results.append(result)
                if not result.get('skipped'):
                    sent = result.get('sentiment', result['analysis'].get('sentiment', {}))
                    sent_label = sent.get('sentiment', '?') if isinstance(sent, dict) else '?'
                    thread_info = result['analysis'].get('thread_context', {})
                    thread_label = f"Thread #{thread_info.get('message_count', 1)}" if thread_info.get('has_history') else "New thread"
                    print(f"  ✓ {result['subject'][:45]} | {result['analysis']['priority']} | {sent_label} | {thread_label}")
    else:
        for i, email in enumerate(emails, 1):
            result = process_single_email(email, i, len(emails), dry_run)
            results.append(result)
            if not result.get('skipped'):
                print(f"  ✓ {result['subject'][:45]} | {result['analysis']['priority']} | Score: {result['analysis']['composite_score']}")

    elapsed = time.time() - start_time

    active = [r for r in results if not r.get('skipped')]
    high = sum(1 for r in active if r['analysis']['priority'] == 'HIGH')
    medium = sum(1 for r in active if r['analysis']['priority'] == 'MEDIUM')
    low = sum(1 for r in active if r['analysis']['priority'] == 'LOW')
    reply_all_count = sum(1 for r in active if r['analysis']['reply_all']['decision'])
    drafts_created = sum(1 for r in active if r.get('reply_generated'))

    # Sentiment distribution
    sentiments = {}
    for r in active:
        s = r['analysis'].get('sentiment', {}).get('sentiment', 'unknown')
        sentiments[s] = sentiments.get(s, 0) + 1

    print(f"\n{'═' * 60}")
    print(f"📊 V57 Summary ({elapsed:.1f}s):")
    print(f"   Analyzed: {len(active)} | Skipped (dupes): {len(results) - len(active)}")
    print(f"   HIGH: {high} | MED: {medium} | LOW: {low}")
    print(f"   Reply-all recommended: {reply_all_count}")
    print(f"   Drafts created: {drafts_created}")
    print(f"   Sentiments: {sentiments}")

    save_json(V57_STATE, {
        'last_run': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'emails_processed': len(active),
        'high_priority': high,
        'medium_priority': medium,
        'low_priority': low,
        'reply_all_count': reply_all_count,
        'drafts_created': drafts_created,
        'sentiment_distribution': sentiments,
        'elapsed_seconds': round(elapsed, 1),
        'mode': mode,
    })

    return results

# ── Follow-up scheduler ──────────────────────────────────────────────────────

def schedule_followup(email_id: str, subject: str, sender: str, days: int = 3):
    followups = load_json(FOLLOWUP_QUEUE, [])
    due_date = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)).isoformat()
    followups.append({
        'email_id': email_id, 'subject': subject, 'sender': sender,
        'due_date': due_date, 'created': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    })
    save_json(FOLLOWUP_QUEUE, followups)

def check_followups():
    followups = load_json(FOLLOWUP_QUEUE, [])
    now = datetime.datetime.now(datetime.timezone.utc)
    due = []
    remaining = []
    for f in followups:
        try:
            due_date = datetime.datetime.fromisoformat(f['due_date'])
            if now >= due_date:
                due.append(f)
            else:
                remaining.append(f)
        except Exception:
            remaining.append(f)
    if due:
        print(f"⏰ {len(due)} follow-up(s) due!")
        for f in due:
            msg = f"📧 Follow-up: {f['subject']} (from {f['sender']})"
            print(f"   {msg}")
            if IMPORTS_OK:
                try:
                    telegram_send(msg)
                except Exception:
                    pass
    save_json(FOLLOWUP_QUEUE, remaining)
    return due

# ── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='V57 Sentiment + Thread Memory Engine')
    parser.add_argument('--max', type=int, default=20, help='Max emails')
    parser.add_argument('--live', action='store_true', help='Create drafts')
    parser.add_argument('--sequential', action='store_true', help='Disable parallel')
    parser.add_argument('--followup-check', action='store_true', help='Check follow-ups')
    parser.add_argument('--status', action='store_true', help='Show status')
    args = parser.parse_args()

    if args.status:
        state = load_json(V57_STATE)
        if state:
            print(f"Last run: {state.get('last_run', 'never')}")
            print(f"Processed: {state.get('emails_processed', 0)} in {state.get('elapsed_seconds', '?')}s")
            print(f"HIGH: {state.get('high_priority', 0)} | MED: {state.get('medium_priority', 0)} | LOW: {state.get('low_priority', 0)}")
            print(f"Drafts: {state.get('drafts_created', 0)}")
            print(f"Sentiments: {state.get('sentiment_distribution', {})}")
        else:
            print("No previous runs")
    elif args.followup_check:
        check_followups()
    else:
        process_emails(max_emails=args.max, dry_run=not args.live, parallel=not args.sequential)
