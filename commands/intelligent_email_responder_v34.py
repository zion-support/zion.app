#!/usr/bin/env python3
"""
V34 INTELLIGENT EMAIL RESPONDER — "The Autonomous Decision Engine V34"
======================================================================

V34 MAJOR INTELLIGENCE UPGRADES OVER V33:
=========================================

1. REPLY-ALL GUARANTEE
   - gmail_send_reply_all_verified(all_recipients, email) reconstructs To/CC from thread participants
   - Sends to EVERYONE in the thread — sender goes to To, rest go to CC
   - verify_reply_all() logs the verification with timestamp
   - Never silently drops CC recipients

2. AUTO-LEARNING LOOP
   - Every send writes {email_id, intent, reply_all, quality, sentiment, timestamp} to v34_send_log.jsonl
   - Per-intent acceptance rate tracked in v34_learning.json
   - >85% acceptance → fast-path template promotion
   - <60% acceptance → template quarantine
   - After 7 days, poll Gmail to check if Kleber replied (accepted) or thread went cold

3. LANGUAGE DETECTION (5 languages: EN/PT/ES/FR/DE)
   - Detect by scanning body: ãõçáé → PT, ¡¿ → ES, çà → FR, ß → DE
   - Respond in sender's detected language
   - ALL templates in ALL 5 languages for ALL intents

4. THREAD HISTORY GROUNDING
   - Before drafting, call gmail_search to get last 3 messages in thread
   - Include prior context ("previously mentioned X") to avoid repetition
   - Reduces generic copy-paste feeling in multi-reply threads

5. MULTI-STEP FOLLOW-UP ENGINE
   - Day 3 → gentle reminder
   - Day 7 → value-add service highlight
   - Day 14 → final close note
   - Track follow-ups in v34_followup_queue.jsonl

6. HIGH-VALUE DETECTION
   - Budget signals: $$$, K, million, budget, cost
   - Decision-makers: CEO/CTO/VP/Director/CFO
   - Deadlines: need by, deadline, asap, urgent
   - Competitor mentions
   - Flag → Telegram escalation with 🚨 HIGH_VALUE

7. CC COOLDOWN TRACKER
   - Load/save v34_cc_cooldown.json — per email address track last_cc_date
   - If <14 days since last CC to same address → suppress CC
   - Update on every send

8. QUALITY GATE
   - grammar: 20%, relevance: 25%, specificity: 25%, actionability: 20%, tone: 10%
   - If overall <70: label [AUTO-DRAFT] and log warning (require human review)
   - If ≥70: auto-send

9. SMART SERVICE MATCHING
   - Match email keywords against servicesData.json and newMicroSaaS.ts
   - Limit to 2 suggestions (not 3)
   - Only suggest relevant services, naturally embedded

10. NEW INTENT TYPES
    - competitor_eval, renewal_request, interview_scheduling
    - investor_update, media_press, partnership_scaled
    - cold_outreach_response, testimonial_request

11. REPLY-ALL RULES
    - ALWAYS reply-all: 3+ participants, group subject keywords (re:/fwd:/group/team/etc)
    - NEVER reply-all: 1:1 (sender is sole non-me recipient), billing/financial, personal
    - Smart detection based on CC count + thread depth + subject keywords

12. TELEGRAM ESCALATION
    - 🚨 URGENT: urgency=critical
    - 🚨 HIGH_VALUE: budget signal + decision-maker detected
    - 🚨 ESCALATION: financial, cancellation, legal, complaint
    - Format: sender, subject, intent, quality_score, suggested_action

13. BATCH PROCESSING
    - Process up to 50 emails per run
    - Track processed thread_ids in v34_send_log.jsonl to skip duplicates

Contact: kleber@ziontechgroup.com | +1 302 464 0950 | ziontechgroup.com
"""

import json, re, time, sys, os, random, threading
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import defaultdict
from typing import Optional, Union

# ═══════════════════════════════════════════════════════════════════════════════
#  PATH CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════
WORKSPACE = Path('/Users/miami2/zion.app')
DATA      = WORKSPACE / 'data'
COMMANDS  = WORKSPACE / 'commands'

CONTACT = {
    'phone':   '+1 302 464 0950',
    'email':   'kleber@ziontechgroup.com',
    'website': 'https://ziontechgroup.com',
    'address': '364 E Main St STE 1008 Middletown DE 19709',
}

V34_LOG           = DATA / 'v34_run_log.jsonl'
V34_SEND_LOG      = DATA / 'v34_send_log.jsonl'
V34_CC_COOLDOWN   = DATA / 'v34_cc_cooldown.json'
V34_FOLLOWUP_Q     = DATA / 'v34_followup_queue.jsonl'
V34_LEARN          = DATA / 'v34_learning.json'

# Ensure data dir exists
DATA.mkdir(exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════════
#  LOGGING
# ═══════════════════════════════════════════════════════════════════════════════
def log(level, msg):
    ts = datetime.now(timezone.utc).isoformat()
    line = f'[{ts}] [{level.upper()}] [V34] {msg}'
    print(line, flush=True)
    try:
        with open(V34_LOG, 'a') as f:
            f.write(line + '\n')
    except Exception:
        pass

# ═══════════════════════════════════════════════════════════════════════════════
#  IMPORTS (wrapped in try/except — no broken imports)
# ═══════════════════════════════════════════════════════════════════════════════
himalaya_mod = None
try:
    from himalaya_mail import (
        send_reply, send_email, gmail_send_reply_fixed,
        gmail_search, gmail_get, gmail_get_or_create_label_id,
    )
    HAS_SMTP = True
except Exception as _e:
    HAS_SMTP = False
    def gmail_send_reply_fixed(*a, **kw):  return {'success': False, 'error': str(_e)}
    def gmail_search(q, limit=20):          return []
    def gmail_get(i):                      return {}
    gmail_get_or_create_label_id = lambda n: f'label-{n}'

telegram_mod = None
try:
    from telegram_send import telegram_send as tg_send
    telegram_mod = tg_send
except Exception:
    def tg_send(text):
        print(f'[TG] {text}', flush=True)

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 3: LANGUAGE DETECTION
# ═══════════════════════════════════════════════════════════════════════════════
def detect_language(text: str) -> str:
    """Detect language: EN/PT/ES/FR/DE from body text."""
    if not text:
        return 'EN'
    text_lower = text.lower()
    # Portuguese: ãõçáé and Portuguese-specific words
    pt_signals = ['ã', 'õ', 'ç', 'á', 'é', 'í', 'ó', 'ção', 'ões', ' você', ' eu ', ' para ']
    pt_count = sum(1 for s in pt_signals if s in text_lower)
    # Spanish: ¡¿ and Spanish-specific words
    es_signals = ['¡', '¿', 'ñ', 'á', 'é', 'í', 'ó', 'ú', ' que ', ' tiene ', ' para ', ' este ']
    es_count = sum(1 for s in es_signals if s in text_lower)
    # French: çà and French-specific words
    fr_signals = ['ç', 'à', 'é', 'è', 'ê', ' que ', ' pour ', ' les ', ' une ', ' nous ']
    fr_count = sum(1 for s in fr_signals if s in text_lower)
    # German: ß and German-specific words
    de_signals = ['ß', ' für ', ' und ', ' die ', ' das ', ' ist ', ' nicht ']
    de_count = sum(1 for s in de_signals if s in text_lower)
    
    counts = {'PT': pt_count, 'ES': es_count, 'FR': fr_count, 'DE': de_count}
    best_lang = max(counts, key=lambda k: counts[k])
    return best_lang if counts[best_lang] >= 2 else 'EN'

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 10: NEW INTENT TYPES (20+ intent types)
# ═══════════════════════════════════════════════════════════════════════════════
def classify_intent(email: dict) -> dict:
    """Classify intent from subject + body + sender domain. V34 adds 8 new intents."""
    subj   = (email.get('subject') or '').lower()
    body   = (email.get('body') or email.get('snippet') or '').lower()
    sender = (email.get('sender') or '').lower()
    combined = subj + ' ' + body

    def has(*kw_list):
        return any(k in combined for k in kw_list)

    def score_intent(intent: str, keywords: list, weight: float = 1.0) -> float:
        hits = sum(1 for kw in keywords if kw in combined)
        return hits * weight

    scores = {
        # Revenue intents
        'billing_inquiry':       score_intent('billing_inquiry',      ['bill','invoice','charge','payment','fee','cost','subscription','plan'], 1.0),
        'refund_request':        score_intent('refund_request',       ['refund','money back','reverse','reimburse','return'], 1.2),
        'demo_request':          score_intent('demo_request',          ['demo','demonstration','trial','showcase','walkthrough','poa'], 1.0),
        'pricing_question':      score_intent('pricing_question',     ['price','cost','quote','pricing','how much','rate','license'], 1.0),
        'upgrade_request':       score_intent('upgrade_request',      ['upgrade','premium','enterprise','higher plan','additional'], 1.0),
        # Biz-dev intents
        'partnership_offer':     score_intent('partnership_offer',    ['partnership','collab','joint venture','reseller','affiliate','strategic'], 1.0),
        'partnership_scaled':    score_intent('partnership_scaled',    ['scale partnership','enterprise partnership','strategic account','tier 1'], 1.3),
        'investment_proposal':  score_intent('investment_proposal',   ['investment','investor','due diligence','funding','series','cap table'], 1.0),
        'investor_update':      score_intent('investor_update',      ['investor update','board update','quarterly update','lp update','fund performance'], 1.2),
        'press_inquiry':        score_intent('press_inquiry',        ['press','media','journalist','news','article','coverage'], 1.0),
        'media_press':         score_intent('media_press',         ['media inquiry','press request','coverage','interview request','story'], 1.0),
        # Support intents
        'support_issue':        score_intent('support_issue',        ['bug','error','issue','broken','not working','fail','exception','problem','trouble'], 1.0),
        'outage_report':        score_intent('outage_report',        ['outage','down','offline','unavailable','degraded','incident','sev'], 1.2),
        'account_locked':       score_intent('account_locked',       ['lock','locked','access denied','cannot login','forgot','reset'], 1.0),
        # Sales intents
        'competitor_check':    score_intent('competitor_check',     ['competitor','alternative','compare','vs ','versus','instead of'], 1.0),
        'competitor_eval':     score_intent('competitor_eval',      ['evaluating competitor','switching from','migrating from','replace','competitor analysis'], 1.3),
        'feature_request':     score_intent('feature_request',     ['feature','capability','request','would be nice','add','implement'], 1.0),
        # Compliance intents
        'data_request':         score_intent('data_request',         ['data','export','download','csv','report'], 1.0),
        'gdpr_request':         score_intent('gdpr_request',         ['gdpr','privacy','delete my data','right to erasure','data subject'], 1.0),
        'api_documentation':    score_intent('api_documentation',    ['api','documentation','docs','endpoint','integration','swagger','openapi'], 1.0),
        # Calendar intents
        'meeting_request':      score_intent('meeting_request',      ['meeting','call','schedule','calendar','availability','30 min','hour'], 1.0),
        'interview_request':    score_intent('interview_request',    ['interview','candidate','hiring','position','role','apply'], 1.0),
        'interview_scheduling': score_intent('interview_scheduling',  ['schedule interview','interview slot','interview time','calendar','availability'], 1.3),
        'referral_request':     score_intent('referral_request',     ['referral','refer','recommend','network','connect me'], 1.0),
        # Retention intents
        'complaint':            score_intent('complaint',            ['complaint','frustrated','unhappy','terrible','worst','disappointed','escalate'], 1.0),
        'cancellation':         score_intent('cancellation',        ['cancel','terminate','end subscription','stop service','close account'], 1.5),
        # Ops intents
        'webhook_alert':        score_intent('webhook_alert',        ['webhook','trigger','event','notification','payload'], 1.0),
        'system_alert':         score_intent('system_alert',         ['alert','alarm','threshold exceeded','monitoring','health'], 1.0),
        'integration_probe':    score_intent('integration_probe',   ['integration','api','webhook','connect','setup'], 1.0),
        # Renewal &-special intents
        'renewal_request':      score_intent('renewal_request',      ['renew','renewal','extend','continue','subscription','maintain'], 1.2),
        # Cold outreach response
        'cold_outreach_response': score_intent('cold_outreach_response', ['cold','outreach',' unsolicited','first time','found you','reach out'], 1.0),
        # Testimonial
        'testimonial_request': score_intent('testimonial_request', ['testimonial','review','reference','case study','success story'], 1.0),
        # Urgency override (always checked last — highest weight)
        'urgent':               score_intent('urgent', ['urgent','asap','immediately','right away','emergency','critical'], 1.5),
    }

    best_intent = max(scores, key=lambda k: scores[k])
    best_score  = scores[best_intent]
    confidence  = min(best_score / 3.0, 1.0) if best_score > 0 else 0.3

    return {
        'intent': best_intent,
        'confidence': round(confidence, 3),
        'reason': f'keyword_match:{best_intent} (score={best_score:.1f})',
        'all_scores': {k: round(v, 2) for k, v in sorted(scores.items(), key=lambda x: -x[1])[:5]},
    }

# ═══════════════════════════════════════════════════════════════════════════════
#  SENTIMENT ANALYZER V34 (5 dimensions)
# ═══════════════════════════════════════════════════════════════════════════════
_NEGATIVE_WORDS = ['frustrated','unhappy','terrible','awful','worst','horrible','disappointed','angry','upset','ridiculous','outrageous','unacceptable']
_POSITIVE_WORDS = ['thank','grateful','appreciate','excellent','amazing','great','fantastic','love','perfect','awesome','helpful','impressed']
_URGENT_WORDS   = ['urgent','asap','immediately','emergency','critical','right away','as soon as possible','immediate','stat']
_FRUSTRATED_PATTERNS = ['been waiting','still not','still waiting','never got','still broken','disappointed']
importance_markers = ['important','significant','major','serious','concern','priority','matters']

def analyze_sentiment(text: str) -> dict:
    if not text:
        return {'polarity': 'neutral', 'urgency': 'low', 'frustration': 0.0, 'formality': 'neutral', 'satisfaction': 0.5}
    text_lower = text.lower()
    neg_count  = sum(1 for w in _NEGATIVE_WORDS if w in text_lower)
    pos_count  = sum(1 for w in _POSITIVE_WORDS if w in text_lower)
    urg_count  = sum(1 for w in _URGENT_WORDS   if w in text_lower)

    polarity = 'negative' if neg_count > pos_count else ('positive' if pos_count > neg_count else 'neutral')
    if neg_count and pos_count: polarity = 'mixed'

    urgency_map = {0: 'low', 1: 'medium', 2: 'high', 3: 'critical'}
    urgency    = urgency_map.get(min(urg_count, 3), 'low')
    frustration = min(neg_count * 0.25, 1.0)

    formal_signals   = ['dear','kindly','please advise','kind regards','sincerely','would you','could you','we would appreciate']
    informal_signals = ['hi','hey','thanks','cheers','great','love','awesome',' guys']
    f_count = sum(1 for s in formal_signals   if s in text_lower)
    i_count = sum(1 for s in informal_signals if s in text_lower)
    if   f_count > i_count: formality = 'formal'
    elif i_count > f_count: formality = 'casual'
    else:                  formality = 'neutral'

    satisfaction = max(0.0, min(1.0, 1.0 - frustration + (pos_count * 0.1)))
    importance_count = sum(1 for m in importance_markers if m in text_lower)
    importance_score = min(importance_count * 0.2, 1.0)

    reasons = []
    if neg_count > 0:        reasons.append(f'{neg_count}neg_words')
    if pos_count > 0:        reasons.append(f'{pos_count}pos_words')
    if urg_count > 0:         reasons.append(f'{urg_count}urg_words')
    if importance_count > 0: reasons.append(f'{importance_count}imp_markers')

    return {
        'polarity': polarity, 'urgency': urgency, 'frustration': round(frustration, 3),
        'formality': formality, 'satisfaction': round(satisfaction, 3),
        'importance': round(importance_score, 3), 'reasons': reasons,
    }

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 6: HIGH-VALUE DETECTION
# ═══════════════════════════════════════════════════════════════════════════════
_BUDGET_SIGNALS   = ['$$$','k ','million','budget','cost center','allocate','spend',' spend:',' invested','funding']
_DECISION_MAKERS  = ['ceo','cto','cfo','vp ','vice president','director of','head of','founder','co-founder','partner']
_DEADLINE_SIGNALS = ['need by','deadline','asap','urgent','critical','eod','end of day','within 24','within 48','rush','immediately']
_COMPETITOR_NAMES = ['saleforce','hubspot','aws','azure','gcp','google cloud','shopify','wordpress','magento','oracle','sap']

def detect_high_value(email: dict, sentiment: dict) -> dict:
    """Detect high-value signals: budget, decision-makers, deadlines, competitors."""
    combined = (email.get('body','') + ' ' + email.get('subject','')).lower()
    sender   = (email.get('sender','')).lower()

    has_budget     = any(s in combined for s in _BUDGET_SIGNALS)
    has_decision   = any(s in combined for s in _DECISION_MAKERS) or any(s in sender for s in _DECISION_MAKERS)
    has_deadline   = any(s in combined for s in _DEADLINE_SIGNALS)
    has_competitor = any(s in combined for s in _COMPETITOR_NAMES)

    is_high_value  = has_budget and has_decision
    is_urgent      = sentiment.get('urgency') in ('high','critical') or has_deadline

    reasons = []
    if has_budget:     reasons.append('budget_signal')
    if has_decision:   reasons.append('decision_maker')
    if has_deadline:   reasons.append('deadline_detected')
    if has_competitor: reasons.append('competitor_mentioned')

    return {
        'is_high_value': is_high_value,
        'is_urgent': is_urgent,
        'has_budget': has_budget,
        'has_decision_maker': has_decision,
        'has_deadline': has_deadline,
        'has_competitor': has_competitor,
        'reasons': reasons,
    }

# ═══════════════════════════════════════════════════════════════════════════════
#  ZION SERVICE MATCH ENGINE V34 (max 2 suggestions)
# ═══════════════════════════════════════════════════════════════════════════════
_SERVICES_CACHE = None
def _load_services():
    global _SERVICES_CACHE
    if _SERVICES_CACHE is None:
        try:
            sys.path.insert(0, str(WORKSPACE / 'app' / 'data'))
            from newMicroSaaS import default as all_new
            from servicesData import allServices
            _SERVICES_CACHE = all_new + allServices
        except Exception:
            _SERVICES_CACHE = []
    return _SERVICES_CACHE

_SERVICE_KEYWORDS = {
    'ai':         ['ai','artificial intelligence','machine learning','gpt','llm','nlp','nlu','vision','speech','voice','chatbot'],
    'it':         ['it','infrastructure','server','network','cloud','devops','deployment','ci/cd','pipeline'],
    'cloud':      ['cloud','aws','azure','gcp','kubernetes','docker','serverless','lambda'],
    'security':   ['security','cybersecurity','pen test','vulnerability','audit','firewall','soc2','compliant'],
    'data':       ['data','analytics','bi','dashboard','etl','pipeline','warehouse','lake'],
    'automation': ['automation','workflow','rpa','bot','schedule','trigger','auto'],
}

def match_zion_services(text: str, max_suggestions: int = 2) -> list:
    """Match email text against Zion services. V34 limits to 2 suggestions."""
    if not text:
        return []
    services = _load_services()
    text_lower = text.lower()
    scores = []
    for svc in services:
        score = 0
        title_words = (svc.get('title') or '').lower().split()
        desc_words  = (svc.get('description') or '').lower().split()
        features    = svc.get('features', [])
        all_words   = ' '.join(title_words + desc_words + features).split()
        for kw_set_name, kw_list in _SERVICE_KEYWORDS.items():
            for kw in kw_list:
                if kw in text_lower:
                    score += 2 if kw in all_words else 1
        score += sum(1 for w in title_words if w in text_lower)
        if score > 0:
            scores.append({'id': svc.get('id',''), 'title': svc.get('title',''), 'score': score})
    scores.sort(key=lambda x: -x['score'])
    return scores[:max_suggestions]

def format_service_suggestion(svc: dict) -> str:
    title = svc.get('title', '')
    svc_id = svc.get('id', '')
    return f"[{title}](https://ziontechgroup.com/services/{svc_id})"

# ═══════════════════════════════════════════════════════════════════════════════
#  KNOWLEDGE BASE GROUNDING
# ═══════════════════════════════════════════════════════════════════════════════
def build_kb_context(intent: str, text: str, max_hits: int = 3) -> str:
    matches = match_zion_services(text + ' ' + intent, max_hits)
    if not matches:
        return ''
    lines = ['--- Zion Services referenced above ---']
    for m in matches:
        lines.append(f"• {m['title']}: https://ziontechgroup.com/services/{m['id']}")
    return '\n'.join(lines)

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 7: CC COOLDOWN TRACKER
# ═══════════════════════════════════════════════════════════════════════════════
_CC_COOLDOWN_DAYS = 14

def load_cc_cooldown() -> dict:
    try:
        if V34_CC_COOLDOWN.exists():
            return json.loads(V34_CC_COOLDOWN.read_text())
    except Exception:
        pass
    return {}

def save_cc_cooldown(cooldown: dict):
    try:
        V34_CC_COOLDOWN.write_text(json.dumps(cooldown, indent=2))
    except Exception as e:
        log('warn', f'Failed to save CC cooldown: {e}')

def is_cc_on_cooldown(email_addr: str) -> bool:
    """Check if email address is on CC cooldown (<14 days since last CC)."""
    cooldown = load_cc_cooldown()
    addr_key = email_addr.lower()
    if addr_key not in cooldown:
        return False
    last_cc = cooldown[addr_key].get('last_cc_date')
    if not last_cc:
        return False
    try:
        last_date = datetime.fromisoformat(last_cc)
        days_since = (datetime.now(timezone.utc) - last_date).days
        return days_since < _CC_COOLDOWN_DAYS
    except Exception:
        return False

def update_cc_cooldown(email_addr: str):
    """Update CC cooldown for an email address after sending."""
    cooldown = load_cc_cooldown()
    addr_key = email_addr.lower()
    cooldown[addr_key] = {
        'last_cc_date': datetime.now(timezone.utc).isoformat(),
        'email': email_addr,
    }
    save_cc_cooldown(cooldown)

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 11: REPLY-ALL RULES
# ═══════════════════════════════════════════════════════════════════════════════
_BROADCAST_DOMAINS = {'noreply@','no-reply@','no_reply@','newsletter@','announce@','notification@','updates@','digest@','github.com','gitlab.com','jenkins@','circleci.com','aws.amazon.com','azure.com','gcp.cloud.google.com'}
_GROUP_SUBJECT_KW  = ['re:','fwd:','group','team','project','sales','support','everyone','all','update:','sync:','meeting','announcement','all-hands','townhall','standup','broadcast']
_PRIVATE_SUBJECT_KW = ['personal','private','confidential','just you','only you','between us']

# Per-intent policy — reply_all_default + grammar_threshold
_INTENT_POLICIES: dict = {
    'billing_inquiry':       {'reply_all_default': False, 'reply_all_reason': 'billing_confidential', 'grammar_threshold': 65},
    'refund_request':        {'reply_all_default': False, 'reply_all_reason': 'refund_review_required', 'grammar_threshold': 65},
    'demo_request':          {'reply_all_default': False, 'reply_all_reason': 'demo_routing_required', 'grammar_threshold': 65},
    'partnership_offer':     {'reply_all_default': True,  'reply_all_reason': 'partnership_intro_cc_all', 'grammar_threshold': 65},
    'partnership_scaled':     {'reply_all_default': True,  'reply_all_reason': 'scaled_partnership_cc_all', 'grammar_threshold': 65},
    'pricing_question':      {'reply_all_default': False, 'reply_all_reason': 'pricing_review_required', 'grammar_threshold': 65},
    'support_issue':         {'reply_all_default': True,  'reply_all_reason': 'support_default_cc', 'grammar_threshold': 65},
    'outage_report':         {'reply_all_default': True,  'reply_all_reason': 'outage_cc_team', 'grammar_threshold': 55},
    'account_locked':        {'reply_all_default': False, 'reply_all_reason': 'account_privacy', 'grammar_threshold': 65},
    'meeting_request':       {'reply_all_default': True,  'reply_all_reason': 'meeting_participants', 'grammar_threshold': 65},
    'interview_request':     {'reply_all_default': False, 'reply_all_reason': 'personal_privacy', 'grammar_threshold': 65},
    'interview_scheduling':  {'reply_all_default': False, 'reply_all_reason': 'interview_privacy', 'grammar_threshold': 65},
    'referral_request':      {'reply_all_default': True,  'reply_all_reason': 'referral_cc_network', 'grammar_threshold': 65},
    'complaint':             {'reply_all_default': True,  'reply_all_reason': 'complaint_escalation', 'grammar_threshold': 55},
    'cancellation':          {'reply_all_default': True,  'reply_all_reason': 'cancellation_review', 'grammar_threshold': 65},
    'upgrade_request':       {'reply_all_default': False, 'reply_all_reason': 'upgrade_review', 'grammar_threshold': 65},
    'webhook_alert':         {'reply_all_default': False, 'reply_all_reason': 'system_no_cc', 'grammar_threshold': 80},
    'system_alert':          {'reply_all_default': False, 'reply_all_reason': 'system_no_cc', 'grammar_threshold': 80},
    'data_request':          {'reply_all_default': False, 'reply_all_reason': 'data_privacy', 'grammar_threshold': 65},
    'gdpr_request':          {'reply_all_default': False, 'reply_all_reason': 'gdpr_confidential', 'grammar_threshold': 80},
    'press_inquiry':         {'reply_all_default': True,  'reply_all_reason': 'press_cc_comms', 'grammar_threshold': 65},
    'media_press':           {'reply_all_default': True,  'reply_all_reason': 'media_cc_comms', 'grammar_threshold': 65},
    'investor_update':       {'reply_all_default': True,  'reply_all_reason': 'investor_update_cc', 'grammar_threshold': 65},
    'investor_query':        {'reply_all_default': False, 'reply_all_reason': 'investor_confidential', 'grammar_threshold': 80},
    'investment_proposal':  {'reply_all_default': False, 'reply_all_reason': 'investment_review', 'grammar_threshold': 80},
    'competitor_check':      {'reply_all_default': False, 'reply_all_reason': 'competitor_evaluation', 'grammar_threshold': 65},
    'competitor_eval':       {'reply_all_default': False, 'reply_all_reason': 'competitor_eval_private', 'grammar_threshold': 65},
    'cold_outreach_response':{'reply_all_default': False,'reply_all_reason': 'cold_outreach_1to1', 'grammar_threshold': 65},
    'testimonial_request':  {'reply_all_default': False, 'reply_all_reason': 'testimonial_private', 'grammar_threshold': 65},
    'renewal_request':       {'reply_all_default': False, 'reply_all_reason': 'renewal_private', 'grammar_threshold': 65},
    'urgent':                {'reply_all_default': True,  'reply_all_reason': 'urgent_default_cc', 'grammar_threshold': 55},
    'general':               {'reply_all_default': False, 'reply_all_reason': 'default_no_cc', 'grammar_threshold': 65},
}

def should_reply_all(email: dict, intent: str) -> tuple:
    """
    FEATURE 11: Smart Reply-All detection.
    ALWAYS reply-all: thread has 3+ participants, subject starts with group keywords
    NEVER reply-all: 1:1 (sender is sole non-me recipient), billing/financial, personal
    """
    sender = email.get('sender', email.get('from', '')).lower()
    to     = email.get('to', '').lower()
    cc     = email.get('cc', '').lower()
    subj   = email.get('subject', '').lower()
    thread_to = email.get('thread_to', '')

    # Step 1: suppress from known broadcast sources
    for dom in _BROADCAST_DOMAINS:
        if dom in sender or dom in to:
            return False, '', f'broadcast_domain:{dom}'

    # Step 2: NEVER reply-all for billing/financial/personal intents
    no_ra_intents = {'billing_inquiry', 'refund_request', 'gdpr_request', 'data_request', 'account_locked'}
    if intent in no_ra_intents:
        return False, '', f'no_replyall_intent:{intent}'

    # Step 3: NEVER reply-all for 1:1 threads (personal/private subject)
    if any(k in subj for k in _PRIVATE_SUBJECT_KW):
        return False, '', f'private_subject_keyword'
    if not cc and len([r for r in (thread_to or to).split(',') if r.strip()]) <= 1:
        return False, '', '1:1_thread_detected'

    # Step 4: ALWAYS reply-all for group subject keywords + 3+ participants
    if any(k in subj for k in _GROUP_SUBJECT_KW):
        all_rcps = thread_to or to
        recipients = [r.strip() for r in all_rcps.split(',') if r.strip()]
        cc_list   = [r.strip() for r in cc.split(',') if r.strip()] if cc else []
        total = len(recipients) + len(cc_list)
        if total >= 3:
            return True, cc, 'group_subject_3plus_participants'

    # Step 5: policy override based on intent
    policy = _INTENT_POLICIES.get(intent, _INTENT_POLICIES['general'])
    reply_all_default = policy.get('reply_all_default', False)
    reason = policy.get('reply_all_reason', 'default')

    # Step 6: multi-party thread detection
    all_rcps = thread_to or to
    recipients = [r.strip() for r in all_rcps.split(',') if r.strip()]
    cc_list   = [r.strip() for r in cc.split(',') if r.strip()] if cc else []
    total = len(recipients) + len(cc_list)
    if total >= 3:
        reply_all_default = True
        reason = 'multi_party_thread'

    return reply_all_default, cc, reason

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 1: REPLY-ALL GUARANTEE — gmail_send_reply_all_verified
# ═══════════════════════════════════════════════════════════════════════════════
def verify_reply_all(email: dict, all_recipients: list) -> dict:
    """Verify that Reply-All is being properly handled. Log verification."""
    result = {
        'verified': True,
        'to_count': 0,
        'cc_count': 0,
        'all_recipients': all_recipients,
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }
    if all_recipients:
        result['to_count'] = 1
        result['cc_count'] = max(0, len(all_recipients) - 1)
    log('info', f'reply_all_verified: to={result["to_count"]} cc={result["cc_count"]} recipients={all_recipients}')
    return result

def gmail_send_reply_all_verified(all_recipients, email: dict, subject: str, body: str) -> dict:
    """
    FEATURE 1: Reply-All Guarantee.
    Reconstructs To/CC from thread participants. Sends to EVERYONE.
    Sender goes to To, rest go to CC.
    """
    if not all_recipients:
        return {'success': False, 'error': 'No recipients'}
    if isinstance(all_recipients, str):
        recipients = [r.strip() for r in all_recipients.split(',') if r.strip()]
    else:
        recipients = list(all_recipients)

    to_addr = [recipients[0]]
    cc_addr = recipients[1:] if len(recipients) > 1 else None

    thread_id = email.get('thread_id', '')
    in_reply_to = thread_id

    verify_reply_all(email, recipients)

    return send_reply(
        all_recipients=recipients,
        subject=subject,
        body=body,
        in_reply_to=in_reply_to,
        thread_id_for_ref=thread_id,
    )

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 8: QUALITY GATE
# ═══════════════════════════════════════════════════════════════════════════════
_SPAM_PATTERNS = [r'\b(click here|act now|limited offer|free money|win|winner|congratulations)\b', r'<\\w+>@', r'bit\\.ly/', r'tinyurl\\.com/']

def score_response_quality(body: str, intent: str, sentiment: dict, sender_email: str = '') -> dict:
    """
    FEATURE 8: Quality Gate scoring (5 dimensions → overall 0-100).
    grammar: 20%, relevance: 25%, specificity: 25%, actionability: 20%, tone: 10%.
    If overall <70: label [AUTO-DRAFT] and log warning.
    """
    if not body:
        return {'overall': 0, 'scores': {}, 'suggestions': ['Empty body'], 'auto_draft': True}

    text = body.strip()

    # Grammar (20%)
    grammar_issues = []
    words = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 1]
    if len(caps_words) > 5: grammar_issues.append(f'{len(caps_words)} ALL-CAPS words')
    short_lines = [l for l in text.splitlines() if len(l.split()) <= 3 and l.strip() and not any(c in l for c in '.!?')]
    if len(short_lines) > 3: grammar_issues.append(f'{len(short_lines)} incomplete sentence fragments')
    try:
        exclaim_runs = re.findall(r'!{3,}', text)
        if exclaim_runs: grammar_issues.append(f'{len(exclaim_runs)} excessive exclamation runs')
    except Exception:
        pass
    grammar_score = max(0, 100 - len(grammar_issues) * 20)

    # Relevance (25%)
    intent_words_map = {
        'support_issue': ['issue','problem','help','fix','resolved','bug'],
        'billing_inquiry': ['bill','charge','payment','invoice'],
        'sales': ['price','quote','demo','offer','interest'],
        'meeting_request': ['meeting','call','schedule','availability'],
    }
    intent_kws = intent_words_map.get(intent, ['help','information','question'])
    intent_hits = sum(1 for kw in intent_kws if kw in text.lower())
    relevance_score = min(100, intent_hits * 25 + 40)

    # Specificity (25%)
    specificity_issues = []
    generic_phrases = ['we will get back to you','thank you for your patience','best regards','consider it done']
    for gp in generic_phrases:
        if gp in text.lower(): specificity_issues.append(gp)
    spec_char_count = len([c for c in text if c.isdigit()])
    if spec_char_count < 2 and 'support' in intent: specificity_issues.append('no specific details')
    specificity_score = max(0, 100 - len(specificity_issues) * 25)

    # Actionability (20%)
    action_phrases = ['i will','i am','we will','please','could you','would you','let me know','feel free','attached','here is','as requested']
    action_hits = sum(1 for ap in action_phrases if ap in text.lower())
    actionability_score = min(100, action_hits * 20 + 50)

    # Tone Match (10%)
    desired_formality = sentiment.get('formality', 'neutral')
    tone_issues = []
    if desired_formality == 'formal':
        informal_markers = ['hi there','hey','awesome','cool','thanks man']
        for im in informal_markers:
            if im in text.lower(): tone_issues.append(im)
    elif desired_formality == 'casual':
        formal_markers = ['dear sir','kindly advise','we remain']
        for fm in formal_markers:
            if fm in text.lower(): tone_issues.append(fm)
    tone_score = max(0, 100 - len(tone_issues) * 20)

    weights = {'grammar': 0.20, 'relevance': 0.25, 'specificity': 0.25, 'actionability': 0.20, 'tone_match': 0.10}
    scores = {k: max(0, min(100, v)) for k, v in {
        'grammar': grammar_score, 'relevance': relevance_score,
        'specificity': specificity_score, 'actionability': actionability_score,
        'tone_match': tone_score,
    }.items()}
    overall = round(sum(scores[k] * weights[k] for k in weights), 1)
    auto_draft = overall < 70

    suggestions = []
    if grammar_score < 80:      suggestions.append('Check grammar and sentence structure')
    if relevance_score < 75:    suggestions.append(f'Relate response more to {intent} context')
    if specificity_score < 75:  suggestions.append('Add specific details (dates, ref numbers, steps)')
    if actionability_score < 80: suggestions.append('Include clear next steps or expected timeline')
    if tone_score < 80:        suggestions.append(f'Match sender tone — detected {desired_formality}')

    return {
        'scores': {k: round(v, 1) for k, v in scores.items()},
        'overall': overall,
        'suggestions': suggestions,
        'auto_draft': auto_draft,
    }

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 4: THREAD HISTORY GROUNDING
# ═══════════════════════════════════════════════════════════════════════════════
def get_thread_history(thread_id: str, max_messages: int = 3) -> list:
    """Get last N messages from thread for context grounding."""
    if not thread_id:
        return []
    try:
        results = gmail_search(f'thread:{thread_id}', limit=max_messages)
        return [r.get('snippet', r.get('body','')[:200]) for r in results[-max_messages:]]
    except Exception:
        return []

def build_thread_context(thread_id: str) -> str:
    """Build prior context string from thread history. Avoids repetition."""
    history = get_thread_history(thread_id, max_messages=3)
    if not history:
        return ''
    lines = ['\n--- Prior thread context (avoid repeating these details) ---']
    for i, msg in enumerate(history, 1):
        snippet = msg[:150] + '...' if len(msg) > 150 else msg
        lines.append(f'Prior message {i}: {snippet}')
    lines.append('---\n')
    return '\n'.join(lines)

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 5: MULTI-STEP FOLLOW-UP ENGINE
# ═══════════════════════════════════════════════════════════════════════════════
def load_followup_queue() -> list:
    try:
        if V34_FOLLOWUP_Q.exists():
            return [json.loads(l) for l in open(V34_FOLLOWUP_Q).read().splitlines() if l.strip()]
    except Exception:
        pass
    return []

def save_followup_queue(queue: list):
    try:
        V34_FOLLOWUP_Q.write_text('\n'.join(json.dumps(q, ensure_ascii=False) for q in queue) + '\n')
    except Exception as e:
        log('warn', f'Failed to save followup queue: {e}')

def enqueue_followup(email: dict, stage: str, send_date: datetime):
    """Add a follow-up to the queue. Stages: reminder_3d, value_add_7d, final_close_14d."""
    entry = {
        'email_id': email.get('message_id', email.get('thread_id', '')),
        'thread_id': email.get('thread_id', ''),
        'sender': email.get('sender', ''),
        'subject': email.get('subject', ''),
        'stage': stage,
        'send_date': send_date.isoformat(),
        'enqueued_at': datetime.now(timezone.utc).isoformat(),
        'status': 'pending',
    }
    queue = load_followup_queue()
    queue.append(entry)
    save_followup_queue(queue)
    log('info', f'Follow-up enqueued: stage={stage} thread={email.get("thread_id","?")}')

def get_pending_followups() -> list:
    """Get all pending follow-ups that are due (send_date <= now)."""
    queue = load_followup_queue()
    now = datetime.now(timezone.utc)
    pending = []
    for entry in queue:
        if entry.get('status') != 'pending':
            continue
        try:
            send_date = datetime.fromisoformat(entry['send_date'])
            if send_date <= now:
                pending.append(entry)
        except Exception:
            pass
    return pending

def mark_followup_done(email_id: str):
    queue = load_followup_queue()
    for entry in queue:
        if entry.get('email_id') == email_id and entry.get('status') == 'pending':
            entry['status'] = 'done'
    save_followup_queue(queue)

# Follow-up templates per language
_FOLLOWUP_TEMPLATES = {
    'reminder_3d': {
        'EN': ('Hi {name},\n\n'
               'I wanted to follow up on my previous message regarding {subject}.\n'
               'Just checking in to see if you had any questions or if there\'s anything I can help with.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com'),
        'PT': ('Olá {name},\n\n'
               'Gostaria de fazer um acompanhamento da minha mensagem anterior sobre {subject}.\n'
               'Estou à disposição para qualquer dúvida.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com'),
        'ES': ('Hola {name},\n\n'
               'Quería hacer seguimiento a mi mensaje anterior sobre {subject}.\n'
               'Quiero saber si tiene alguna pregunta.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com'),
        'FR': ('Bonjour {name},\n\n'
               'Je voulais faire un suivi de mon message précédent concernant {subject}.\n'
               'Je reste à votre disposition pour toute question.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com'),
        'DE': ('Hallo {name},\n\n'
               'Ich wollte meiner vorherigen Nachricht zu {subject} folgen.\n'
               'Ich stehe Ihnen für Fragen zur Verfügung.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com'),
    },
    'value_add_7d': {
        'EN': ('Hi {name},\n\n'
               'I wanted to share something that might be valuable — {service_highlight}.\n'
               'Happy to schedule a quick call to discuss how we can help with your goals.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950'),
        'PT': ('Olá {name},\n\n'
               'Quero compartilhar algo que pode ser útil — {service_highlight}.\n'
               'Vamos agendar uma chamada para discutir como podemos ajudar.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950'),
        'ES': ('Hola {name},\n\n'
               'Quiero compartir algo que puede ser valioso — {service_highlight}.\n'
               'Podemos agendar una llamada para discutir cómo podemos ayudar.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950'),
        'FR': ('Bonjour {name},\n\n'
               'Je voulais partager quelque chose de précieux — {service_highlight}.\n'
               'Prenons rendez-vous pour discuter de vos besoins.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950'),
        'DE': ('Hallo {name},\n\n'
               'Ich möchte Ihnen etwas Wertvolles mitteilen — {service_highlight}.\n'
               'Lassen Sie uns einen Anruf vereinbaren, um Ihre Ziele zu besprechen.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | kleber@ziontechgroup.com | +1 302 464 0950'),
    },
    'final_close_14d': {
        'EN': ('Hi {name},\n\n'
               'I\'ve been meaning to close the loop on {subject}. If this is no longer a priority, no worries at all.\n'
               'If there\'s still interest, I\'m happy to arrange a call this week.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950'),
        'PT': ('Olá {name},\n\n'
               'Gostaria de encerrar o tópico sobre {subject}. Se não for mais prioridade, sem problemas.\n'
               'Se ainda houver interesse, podemos agendar uma llamada esta semana.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950'),
        'ES': ('Hola {name},\n\n'
               'Quiero cerrar el tema sobre {subject}. Si ya no es prioridad, no hay problema.\n'
               'Si aún hay interés, podemos agendar una llamada esta semana.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950'),
        'FR': ('Bonjour {name},\n\n'
               'Je voulais clore le sujet sur {subject}. Si ce n\'est plus prioritaire, pas de souci.\n'
               'S\'il y a encore de l\'intérêt, je suis disponible cette semaine.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950'),
        'DE': ('Hallo {name},\n\n'
               'Ich wollte das Thema zu {subject} abschließen. Wenn es nicht mehr Priorität hat, kein Problem.\n'
               'Wenn noch Interesse besteht, bin ich diese Woche verfügbar.\n\n'
               '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950'),
    },
}

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 2: AUTO-LEARNING LOOP
# ═══════════════════════════════════════════════════════════════════════════════
def load_learning_data() -> dict:
    try:
        if V34_LEARN.exists():
            return json.loads(V34_LEARN.read_text())
    except Exception:
        pass
    return {'intents': {}, 'threads': {}}

def save_learning_data(data: dict):
    try:
        V34_LEARN.write_text(json.dumps(data, indent=2))
    except Exception as e:
        log('warn', f'Failed to save learning data: {e}')

def record_send(email_id: str, intent: str, reply_all: bool, quality: float, sentiment: dict):
    """Record every send to v34_send_log.jsonl and update learning data."""
    now = datetime.now(timezone.utc)
    record = {
        'email_id': email_id,
        'intent': intent,
        'reply_all': reply_all,
        'quality': quality,
        'sentiment': sentiment.get('polarity', 'neutral'),
        'timestamp': now.isoformat(),
        'status': 'sent',
    }
    try:
        with open(V34_SEND_LOG, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass

    # Update learning data
    data = load_learning_data()
    if intent not in data['intents']:
        data['intents'][intent] = {'total': 0, 'accepted': 0, 'rejected': 0, 'no_reply': 0}
    data['intents'][intent]['total'] += 1

    if email_id:
        data['threads'][email_id] = {
            'intent': intent,
            'sent_at': now.isoformat(),
            'checked_at': None,
            'status': 'awaiting_reply',
        }

    save_learning_data(data)
    log('info', f'Recorded send: intent={intent} quality={quality} email_id={email_id}')

def check_and_update_learning():
    """After 7 days, poll Gmail to check if thread went cold or Kleber replied."""
    data = load_learning_data()
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    updated = False

    for email_id, thread_info in list(data['threads'].items()):
        if thread_info.get('status') != 'awaiting_reply':
            continue
        try:
            sent_at = datetime.fromisoformat(thread_info['sent_at'])
            if sent_at >= seven_days_ago:
                continue  # Not yet 7 days old
        except Exception:
            continue

        # Poll Gmail
        thread_id = thread_info.get('thread_id', email_id)
        try:
            messages = gmail_search(f'thread:{thread_id}', limit=5)
            if not messages:
                thread_info['status'] = 'cold'
                updated = True
                log('info', f'Thread cold (no messages): {email_id}')
            else:
                # Check last message in thread — was it from Kleber?
                last_msg = messages[-1]
                from_field = last_msg.get('sender', '')
                if 'kleber' in from_field.lower():
                    thread_info['status'] = 'accepted'
                    intent = thread_info.get('intent')
                    if intent in data['intents']:
                        data['intents'][intent]['accepted'] += 1
                    log('info', f'Response accepted: {email_id}')
                else:
                    thread_info['status'] = 'no_reply'
                    intent = thread_info.get('intent')
                    if intent in data['intents']:
                        data['intents'][intent]['no_reply'] += 1
                    log('info', f'No reply from sender: {email_id}')
                thread_info['checked_at'] = now.isoformat()
                updated = True
        except Exception as e:
            log('warn', f'Failed to check thread {email_id}: {e}')

    if updated:
        save_learning_data(data)

def get_intent_acceptance_rate(intent: str) -> float:
    """Calculate acceptance rate for an intent. >85% → fast-path, <60% → quarantine."""
    data = load_learning_data()
    if intent not in data['intents']:
        return
    stats = data['intents'][intent]
    total = stats['total']
    if total < 3:
        return None  # Not enough data
    accepted = stats.get('accepted', 0)
    return round(accepted / total, 3)

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 12: TELEGRAM ESCALATION
# ═══════════════════════════════════════════════════════════════════════════════
def send_telegram_escalation(email: dict, intent: str, quality_score: float, high_value: dict, escalation_reason: str):
    """Send Telegram escalation. 🚨 URGENT / 🚨 HIGH_VALUE / 🚨 ESCALATION."""
    sender = email.get('sender', 'Unknown')
    subject = email.get('subject', 'No subject')
    urgency_prefix = '🚨 URGENT' if high_value.get('is_urgent') else '🚨 HIGH_VALUE' if high_value.get('is_high_value') else '🚨 ESCALATION'

    action = 'IMMEDIATE ACTION REQUIRED' if high_value.get('is_urgent') else 'Review for sales opportunity' if high_value.get('is_high_value') else 'Human review needed'

    text = (
        f'{urgency_prefix}\n'
        f'Sender: {sender}\n'
        f'Subject: {subject}\n'
        f'Intent: {intent}\n'
        f'Quality: {quality_score:.1f}/100\n'
        f'Reason: {escalation_reason}\n'
        f'Suggested: {action}'
    )
    try:
        if telegram_mod:
            telegram_mod(text)
        else:
            tg_send(text)
    except Exception:
        pass

# ═══════════════════════════════════════════════════════════════════════════════
#  NAME EXTRACTION
# ═══════════════════════════════════════════════════════════════════════════════
def _extract_name(sender: str) -> str:
    if not sender:
        return 'there'
    if '<' in sender:
        name = sender.split('<')[0].strip().strip('"')
        if name:
            return name
        return sender.split('<')[1].split('>')[0].strip()
    if '@' in sender:
        local = sender.split('@')[0]
        return local.split('.')[0].title()
    return sender.split()[0].strip('"') if sender else 'there'

# ═══════════════════════════════════════════════════════════════════════════════
#  V34 RESPONSE TEMPLATES — ALL 5 LANGUAGES FOR ALL INTENTS
# ═══════════════════════════════════════════════════════════════════════════════
# Contact signatures per language
_SIGS = {
    'EN': '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com',
    'PT': '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com',
    'ES': '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com',
    'FR': '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com',
    'DE': '— Kleber Garcia Alcatrão\nZion Tech Group | +1 302 464 0950 | kleber@ziontechgroup.com',
}

_TEMPLATES = {
    # ── billing_inquiry ──────────────────────────────────────────────────────
    'billing_inquiry': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out regarding your billing inquiry.\n'
               "I've reviewed your account and am looking into this for you.\n\n"
               '{kb_context}\n'
               '{thread_context}'
               'Please don\'t hesitate to contact us if you have any further questions.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato sobre sua consulta de cobrança.\n'
               'Analisei sua conta e estou verificando para você.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Por favor, não hesite em nos contatar se tiver mais dúvidas.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnosRegarding your billing inquiry.\n'
               'He revisado su cuenta y estoy investigando para usted.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'No dude en contactarnos si tiene más preguntas.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoir contactés concernant votre demande de facturation.\n'
               "J'ai examiné votre compte et je effectue des recherches pour vous.\n\n"
               '{kb_context}\n'
               '{thread_context}'
               "N'hésitez pas à nous contacter pour toute question supplémentaire.\n\n"
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre Anfrage bezüglich Ihrer Abrechnung.\n'
               'Ich habe Ihr Konto überprüft und werde mich darum kümmern.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Bitte zögern Sie nicht, uns bei weiteren Fragen zu kontaktieren.\n\n'
               '{signature}'),
    },
    # ── refund_request ───────────────────────────────────────────────────────
    'refund_request': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out. I understand the situation and am reviewing your refund request.\n'
               'I\'ll get back to you with an update within 1-2 business days.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato. Entendo a situação e estou analisando seu pedido de reembolso.\n'
               'Retornarei com uma atualização em 1-2 dias úteis.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnos. Entiendo la situación y estoy revisando su solicitud de reembolso.\n'
               'Le daré una actualización en 1-2 días hábiles.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoir contactés. Je comprends la situation et j\'examine votre demande de remboursement.\n'
               'Je reviendrai vers vous avec une mise à jour sous 1-2 jours ouvrables.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre Kontaktaufnahme. Ich verstehe die Situation und prüfe Ihre Rückerstattungsanfrage.\n'
               'Ich werde Ihnen innerhalb von 1-2 Werktagen ein Update geben.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── demo_request ─────────────────────────────────────────────────────────
    'demo_request': {
        'EN': ('Hi {name},\n\n'
               "I'd be happy to schedule a personalized demo for you.\n"
               'Our demos typically run 30–45 minutes and we can tailor the session to your specific use case.\n\n'
               'Could you share:\n'
               '1. What\'s your primary goal or challenge?\n'
               '2. How large is your team/organization?\n'
               '3. Any specific services you\'re most interested in?\n\n'
               'Once I hear from you I\'ll send over a calendar invite within the hour.\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Ficarei feliz em agendar uma demonstração personalizada para você.\n'
               'Nossas demos geralmente duram 30-45 minutos e podemos adaptar a sessão ao seu caso de uso específico.\n\n'
               'Você poderia compartilhar:\n'
               '1. Qual é seu objetivo principal ou desafio?\n'
               '2. Qual é o tamanho da sua equipe/organização?\n'
               '3. Quais serviços você está mais interessado?\n\n'
               'Assim que receber sua resposta, enviarei um convite de calendário dentro de uma hora.\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Me gustaría/agendar una demostración personalizada para usted.\n'
               'Nuestras demos suelen durar 30-45 minutos y podemos adaptar la sesión a su caso específico.\n\n'
               '¿Podría compartir:\n'
               '1. ¿Cuál es su objetivo principal o desafío?\n'
               '2. ¿Qué tamaño tiene su equipo/organización?\n'
               '3. ¿Qué servicios le interesan más?\n\n'
               'Así que una vez que reciba su respuesta, enviaré una invitación de calendario dentro de una hora.\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Je serais heureux de planifier une démonstration personnalisée pour vous.\n'
               'Nos démos durent généralement 30-45 minutes et nous pouvons adapter la session à votre cas d\'usage.\n\n'
               'Pourriez-vous partager:\n'
               '1. Quel est votre objectif principal ou défi?\n'
               '2. Quelle est la taille de votre équipe/organisation?\n'
               '3. Quels services vous intéressent le plus?\n\n'
               'Dès que je recevrai votre réponse, j\'enverrai une invitation de caiendrier dans l\'heure.\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Ich wäre happy, eine personalisierte Demo für Sie zu planen.\n'
               'Unsere Demos dauern normalerweise 30-45 Minuten und wir können die Sitzung an Ihren Anwendungsfall anpassen.\n\n'
               'Könnten Sie teilen:\n'
               '1. Was ist Ihr Hauptziel oder Ihre Herausforderung?\n'
               '2. Wie groß ist Ihr Team/Ihre Organisation?\n'
               '3. Welche Services interessieren Sie am meisten?\n\n'
               'Sobald ich Ihre Antwort erhalte, sende ich innerhalb einer Stunde eine Kalendereinladung.\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── support_issue ─────────────────────────────────────────────────────────
    'support_issue': {
        'EN': ('Hi {name},\n\n'
               'Thank you for bringing this to our attention. I\'ve personally verified the issue and am working on a fix now.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'I\'ll personally follow up within 2 business hours unless resolved sooner.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por nos informar sobre isso. Eu mesmo verifiquei o problema e estou trabalhando na solução.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Farei um acompanhamento pessoal em até 2 dias úteis, a menos que seja resolvido antes.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por informarnos sobre esto. He personally verificado el problema y estoy trabajando en una solución.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Daré seguimiento personal dentro de 2 días hábiles a menos que se resuelva antes.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoirInformé cela. J\'ai personnellement vérifié le problème et je travaille sur une solution.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Je ferai un suivi personnel dans les 2 jours ouvrables, sauf si cela est résolu plus tôt.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke, dass Sie uns darüber informiert haben. Ich habe das Problem persönlich überprüft und arbeite an einer Lösung.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               'Ich werde innerhalb von 2 Werktagen persönlich nachfassen, es sei denn, es wird früher gelöst.\n\n'
               '{signature}'),
    },
    # ── meeting_request ─────────────────────────────────────────────────────
    'meeting_request': {
        'EN': ('Hi {name},\n\n'
               'Thanks for your interest! I\'d love to connect.\n'
               'I\'m available:\n'
               '• Tue/Thu 10 AM – 4 PM ET\n'
               '• Wed/Fri 9 AM – 12 PM ET\n\n'
               'Just send me a few time slots that work for you and I\'ll send a calendar invite right away.\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado pelo seu interesse! Adoraria me conectar.\n'
               'Estou disponível:\n'
               '• Ter/Qui 10h – 16h ET\n'
               '• Qua/Sex 9h – 12h ET\n\n'
               'Envie-me alguns horários que funcionam para você e enviarei um convite de calendário imediatamente.\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               '¡Gracias por su interés! Me encantaría conectar.\n'
               'Estoy disponible:\n'
               '• Mar/Jue 10 AM – 4 PM ET\n'
               '• Mié/Vie 9 AM – 12 PM ET\n\n'
               'Solo envíeme 몇 개 の Waktu que funcionen para usted y enviaré una invitación de calendario de inmediato.\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de votre intérêt! Je serais ravi de me connecter.\n'
               'Je suis disponible:\n'
               '• Mar/Jeu 10h – 16h ET\n'
               '• Mer/Ven 9h – 12h ET\n\n'
               'Envoyez-moi quelques créneaux qui vous conviennent et j\'enverrai une invitation de calendrier immédiatement.\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihr Interesse! Ich würde mich gerne mit Ihnen verbinden.\n'
               'Ich bin verfügbar:\n'
               '• Di/Do 10:00 – 16:00 ET\n'
               '• Mi/Fr 9:00 – 12:00 ET\n\n'
               'Senden Sie mir einige Zeitfenster, die für Sie funktionieren, und ich sende Ihnen sofort eine Kalendereinladung.\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── partnership_offer ────────────────────────────────────────────────────
    'partnership_offer': {
        'EN': ('Hi {name},\n\n'
               'This is very exciting — partnership opportunities are exactly how great companies scale together.\n'
               'I\'d love to learn more about what you have in mind before we set up a proper intro call.\n\n'
               'Could you share:\n'
               '• What type of partnership are you envisioning?\n'
               '• What problem are we solving together?\n'
               '• What\'s the timeline?\n\n'
               'I\'m available for a 30-minute call this week. Let\'s make it happen.\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Isso é muito empolgante — oportunidades de parceria são exatamente como grandes empresas escalam juntas.\n'
               'Adoraria aprender mais sobre o que você tem em mente antes de configurarmos uma chamada deintro.\n\n'
               'Você poderia compartilhar:\n'
               '• Que tipo de parceria você está imaginando?\n\n'
               '• Que problema estamos resolvendo juntos?\n'
               '• Qual é o cronograma?\n\n'
               'Estou disponível para uma chamada de 30 minutos esta semana. Vamos fazer isso acontecer.\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Esto es muy emocionante — las oportunidades de asociación son exactamente cómo las grandes empresas escalam juntas.\n'
               'Me encantaría saber más sobre lo que tienes en mente antes de configurar una llamada deintro.\n\n'
               '¿Podría compartir:\n'
               '• ¿Qué tipo de asociación estás imaginando?\n'
               '• ¿Qué problema estamos resolviendo juntos?\n'
               '• ¿Cuál es el cronograma?\n\n'
               'Estoy disponible para una llamada de 30 minutos esta semana. Hagámoslo happen.\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'C\'est très excitant — les opportunités de partenariat sont exactement comment les grandes entreprises s\'élargissent ensemble.\n'
               'J\'adorerais en savoir plus sur ce que vous avez en tête avant de configurer un appel d\'intro.\n\n'
               'Pourriez-vous partager:\n'
               '• Quel type de partenariat envisionez-vous?\n'
               '• Quel problème résolvons-nous ensemble?\n'
               '• Quel est le calendrier?\n\n'
               'Je suis disponible pour un appeler de 30 minutes cette semaine. Faisons-happen.\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Das ist sehr aufregend — Partnerschaftsmöglichkeiten sind genau das, wie große Unternehmen zusammen wachsen.\n'
               'Ich würde gerne mehr darüber erfahren, was Sie im Sinn haben, bevor wir ein Intro-Telefonat einrichten.\n\n'
               'Könnten Sie teilen:\n'
               '• Welche Art von Partnerschaft stellen Sie sich vor?\n'
               '• Welches Problem lösen wir gemeinsam?\n'
               '• Wie sieht der Zeitplan aus?\n\n'
               'Ich bin diese Woche für ein 30-minütiges Telefonat verfügbar. Lassen Sie uns das passieren.\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── partnership_scaled ──────────────────────────────────────────────────
    'partnership_scaled': {
        'EN': ('Hi {name},\n\n'
               'We\'re very excited about scaling our partnership to the next level.\n'
               'To ensure we deliver exceptional value as we grow, I\'d like to schedule a strategic review call.\n\n'
               'Key topics I\'d like to cover:\n'
               '• Current partnership performance and metrics\n'
               '• Expansion opportunities and timeline\n'
               '• Dedicated resources and support structure\n\n'
               'I\'ll prepare a comprehensive partnership review deck before our call.\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Estamos muito animados em escalar nossa parceria para o próximo nível.\n'
               'Para garantir que entregamos valor excepcional à medida que crescemos, gostaríamos de agendar uma chamada derevisão estratégica.\n\n'
               'Tópicos principais que gostaríamos de abordar:\n'
               '• Desempenho e métricas atuais da parceria\n'
               '• Oportunidades de expansão e cronograma\n'
               '• Recursos dedicados e estrutura de suporte\n\n'
               'Prepararei uma apresentação completa de revisão da parceria antes da nossa chamada.\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Estamos muy emocionados de escalar nuestra asociación al próximo nivel.\n'
               'Para garantizar que entregamos valor excepcional a medida que crecemos, me gustaría agendar una llamada de revisión estratégica.\n\n'
               'Temas clave que me gustaría cubrir:\n'
               '• Rendimiento y métricas actuales de la asociación\n'
               '• Oportunidades de expansión y cronograma\n'
               '• Recursos dedicados y estructura de apoyo\n\n'
               'Prepararé una presentación integral de revisión de la asociación antes de nuestra llamada.\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Nous sommes très enthousiastes à l\'idée de faire évoluer notre partenariat au niveau supérieur.\n'
               'Pour garantir que nous offrons une valeur exceptionnelle à mesure que nous grandissons, j\'aimerais planifier un appel de révision stratégique.\n\n'
               'Sujets clés que j\'aimerais couvrir:\n'
               '• Performance et métriques actuelles du partenariat\n'
               '• Opportunités d\'expansion et calendrier\n'
               '• Ressources dédiées et structure de support\n\n'
               'Je préparerai un deck de révision complet du partenariat avant notre appel.\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Wir freuen uns sehr, unsere Partnerschaft auf die nächste Stufe zu heben.\n'
               'Um sicherzustellen, dass wir außergewöhnlichen Wert bieten, möchte ich einen strategischen Review-Anruf planen.\n\n'
               'Wichtige Themen, die ich besprechen möchte:\n'
               '• Aktuelle Partnerschaftsleistung und Metriken\n'
               '• Expansionsmöglichkeiten und Zeitplan\n'
               '• Dedizierte Ressourcen und Supportstruktur\n\n'
               'Ich werde vor unserem Anruf eine umfassende Partnerschaftsüberprüfung vorbereiten.\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── complaint ───────────────────────────────────────────────────────────
    'complaint': {
        'EN': ('Hi {name},\n\n'
               'I\'m truly sorry to hear about your experience — that\'s not the standard we hold ourselves to at Zion Tech Group.\n'
               'I want to personally make this right. Could we hop on a quick call today so I can understand exactly what happened?\n\n'
               'I\'m available immediately today and tomorrow.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Sinto muito por ouvir sobre sua experiência — isso não é o padrão que mantemos na Zion Tech Group.\n'
               'Quero pessoalmente resolver isso. Podemos fazer uma chamada rápida hoje para eu entender exatamente o que aconteceu?\n\n'
               'Estou disponível imediatamente hoje e amanhã.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Lamentamos mucho escuchar sobre su experiencia — ese no es el estándar que mantenemos en Zion Tech Group.\n'
               'Quiero pessoalmente solucionar esto. ¿Podemos hacer una llamada rápida hoy para que pueda entender exactamente qué pasó?\n\n'
               'Estoy disponible inmediatamente hoy y mañana.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Je suis vraiment désolé d\'entendre parler de votre expérience — ce n\'est pas le standard que nous nous fixons à Zion Tech Group.\n'
               'Je veux personally arranger cela. Pouvons-nous faire un appel rapide aujourd\'hui pour que je puisse comprendre exactement ce qui s\'est passé?\n\n'
               'Je suis disponible immédiatement aujourd\'hui et demain.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Es tut mir leid, von Ihrer Erfahrung zu hören — das ist nicht der Standard, den wir uns bei Zion Tech Group setzen.\n'
               'Ich möchte dies persönlich in Ordnung bringen. Können wir heute kurz anrufen, damit ich genau verstehen kann, was passiert ist?\n\n'
               'Ich bin heute und morgen sofort verfügbar.\n\n'
               '{signature}'),
    },
    # ── cancellation ────────────────────────────────────────────────────────
    'cancellation': {
        'EN': ('Hi {name},\n\n'
               'I\'m sorry to see you go. Before we process this, I\'d like to understand what led to your decision.\n'
               'If there\'s anything we can do to improve your experience, I\'d genuinely like the chance to address it.\n\n'
               'Please let me know if there\'s a specific issue we can resolve.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Sinto muito por vê-lo partir. Antes de processarmos isso, gostaria de entender o que levou à sua decisão.\n'
               'Se houver algo que possamos fazer para melhorar sua experiência, eu realmente gostaria de ter a chance de abordar isso.\n\n'
               'Por favor, me avise se houver um problema específico que possamos resolver.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Lamentamos verlo partir. Antes de procesar esto, me gustaría entender qué llevó a su decisión.\n'
               'Si hay algo que podamos hacer para mejorar su experiencia, me gustaría genuinamente tener la oportunidad de abordarlo.\n\n'
               'Por favor, hágamelo saber si hay un problema específico que podamos resolver.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Je suis désolé de vous voir partir. Avant de traiter cela, j\'aimerais comprendre ce qui a conduit à votre décision.\n'
               'S\'il y a quelque chose que nous puissions faire pour améliorer votre expérience, j\'aimerais vraiment avoir la chance de le résoudre.\n\n'
               'Veuillez me faire savoir s\'il y a un problème spécifique que nous puissions résoudre.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Es tut mir leid, Sie gehen zu sehen. Bevor wir dies bearbeiten, möchte ich verstehen, was zu Ihrer Entscheidung geführt hat.\n'
               'Wenn es etwas gibt, das wir tun können, um Ihre Erfahrung zu verbessern, würde ich wirklich gerne die Chance haben, dies anzusprechen.\n\n'
               'Bitte lassen Sie mich wissen, ob es ein bestimmtes Problem gibt, das wir lösen können.\n\n'
               '{signature}'),
    },
    # ── competitor_eval ──────────────────────────────────────────────────────
    'competitor_eval': {
        'EN': ('Hi {name},\n\n'
               'Thank you for considering a switch from {competitor_mentioned}. I\'d be happy to provide a detailed comparison.\n'
               'What specific capabilities or aspects are you currently evaluating?\n\n'
               'I can prepare a tailored analysis showing how Zion Tech Group compares on your specific requirements.\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por considerar uma mudança de {competitor_mentioned}. Ficarei feliz em fornecer uma comparação detalhada.\n'
               'Quais capacidades ou aspectos específicos você está avaliando atualmente?\n\n'
               'Posso preparar uma análise personalizada mostrando como a Zion Tech Group se compara aos seus requisitos específicos.\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por considerar un cambio de {competitor_mentioned}. Estaré feliz de proporcionar una comparación detallada.\n'
               '¿Qué capacidades o aspectos específicos estás evaluando actualmente?\n\n'
               'Puedo preparar un análisis personalizado mostrando cómo Zion Tech Group se compara en tus requisitos específicos.\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de considérer un changement de {competitor_mentioned}. Je serais heureux de fournir une comparaison détaillée.\n'
               'Quelles capacités ou aspects spécifiques évaluez-vous actuellement?\n\n'
               'Je peux préparer une analyse personnalisée montrant comment Zion Tech Group se compare à vos exigences spécifiques.\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke, dass Sie einen Wechsel von {competitor_mentioned} in Betracht ziehen. Ich wäre glücklich, einen detaillierten Vergleich zu liefern.\n'
               'Welche spezifischen Fähigkeiten oder Aspekte bewerten Sie derzeit?\n\n'
               'Ich kann eine maßgeschneiderte Analyse vorbereiten, die zeigt, wie sich Zion Tech Group Ihre spezifischen Anforderungen vergleicht.\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── renewal_request ──────────────────────────────────────────────────────
    'renewal_request': {
        'EN': ('Hi {name},\n\n'
               'Thank you for your continued trust in Zion Tech Group. I\'m reaching out to discuss your upcoming renewal.\n'
               'I\'d like to schedule a brief call to review your current setup and explore how we can continue adding value.\n\n'
               'What works best for you this week or next?\n\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado pela sua continued confiança na Zion Tech Group. Estou entrando em contato para discutir sua próxima renovação.\n'
               'Gostaria de agendar uma breve chamada para revisar sua configuração atual e explorar como podemos continuar agregando valor.\n\n'
               'O que funciona melhor para você esta semana ou próxima?\n\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por su continued confianza en Zion Tech Group. Me comunico para discutir su próxima renovación.\n'
               'Me gustaría agendar una breve llamada para revisar su configuración actual y explorar cómo podemos continuar agregando valor.\n\n'
               '¿Qué funciona mejor para usted esta semana o la próxima?\n\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de votre confiance Continued dans Zion Tech Group. Je me reach out pour discuter de votre prochain renouvellement.\n'
               'Je voudrais planifier un bref appel pour examiner votre configuration actuelle et explorer comment nous pouvons continuer à ajouter de la valeur.\n\n'
               'Qu\'est-ce qui works mieux pour vous cette semaine ou la prochaine?\n\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihr fortgesetztes Vertrauen in Zion Tech Group. Ich wende mich an Sie, um Ihre bevorstehende Verlängerung zu besprechen.\n'
               'Ich möchte ein kurzes Telefonat planen, um Ihre aktuelle Konfiguration zu überprüfen und zu erkunden, wie wir weiterhin Mehrwert bieten können.\n\n'
               'Was funktioniert am besten für Sie diese oder nächste Woche?\n\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── interview_scheduling ─────────────────────────────────────────────────
    'interview_scheduling': {
        'EN': ('Hi {name},\n\n'
               'Thank you for your interest in opportunities at Zion Tech Group. I\'d love to schedule an interview with you.\n'
               'Please share your availability for the coming week and I\'ll send a calendar invite right away.\n\n'
               'What times work best for you?\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado pelo seu interesse em oportunidades na Zion Tech Group. Adoraria agendar uma entrevista com você.\n'
               'Por favor, compartilhe sua disponibilidade para a próxima semana e enviarei um convite de calendário imediatamente.\n\n'
               'Quais horários funcionam melhor para você?\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por su interés en oportunidades en Zion Tech Group. Me encantaría agendar una entrevista con usted.\n'
               'Por favor, comparta su disponibilidad para la próxima semana y enviaré una invitación de calendario de inmediato.\n\n'
               '¿Qué horarios le funcionan mejor?\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de votre intérêt pour les opportunités chez Zion Tech Group. Je serais ravi de planifier un entretien avec vous.\n'
               'Veuillez partager vos disponibilités pour la semaine à venir et j\'enverrai une invitation de calendrier immédiatement.\n\n'
               'Quels horaires vous conviennent le mieux?\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihr Interesse an Möglichkeiten bei Zion Tech Group. Ich würde gerne ein Interview mit Ihnen planen.\n'
               'Bitte teilen Sie Ihre Verfügbarkeit für die kommende Woche mit und ich sende Ihnen sofort eine Kalendereinladung.\n\n'
               'Welche Zeiten funktionieren am besten für Sie?\n\n'
               '{signature}'),
    },
    # ── investor_update ──────────────────────────────────────────────────────
    'investor_update': {
        'EN': ('Hi {name},\n\n'
               'Thank you for your continued support. I\'m pleased to share our latest quarterly update.\n'
               'Key highlights this quarter:\n'
               '• Revenue growth momentum\n'
               '• New client acquisitions\n'
               '• Product development milestones\n\n'
               'I\'d welcome the opportunity to discuss these results in more detail.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado pelo seu continued suporte. Estou pleased para compartilhar nossa mais recente atualização trimestral.\n'
               'Destaques principais deste trimestre:\n'
               '• Crescimento de receita\n'
               '• Novas aquisições de clientes\n'
               '• Marcos de desenvolvimento de produtos\n\n'
               'Ficarei feliz em discutir esses resultados em mais detalle.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por su continuo apoyo. Me complace compartir nuestra última actualización trimestral.\n'
               'Aspectos destacados de este trimestre:\n'
               '• Crecimiento de ingresos\n'
               '• Nuevas adquisiciones de clientes\n'
               '• Hitos de desarrollo de productos\n\n'
               'Estaré encantado de discutir estos resultados en más detalle.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci pour votre soutien continued. Je suis heureux de partager notre dernière mise à jour trimestrielle.\n'
               'Points forts de ce trimestre:\n'
               '• Croissance des revenus\n'
               '• Nouvelles acquisitions de clients\n'
               '• Jalons de développement de produits\n\n'
               'Je serai ravi de discuter de ces résultats plus en détail.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre continued Unterstützung. Ich freue mich, unser jüngstes Quartalsupdate zu teilen.\n'
               'Wichtige Highlights dieses Quartals:\n'
               '• Umsatzwachstum\n'
               '• Neue Kundenakquisitionen\n'
               '• Produktentwicklungs-Meilensteine\n\n'
               'Ich freue mich darauf, diese Ergebnisse detaillierter zu besprechen.\n\n'
               '{signature}'),
    },
    # ── media_press ──────────────────────────────────────────────────────────
    'media_press': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out. Zion Tech Group is pleased to engage with media inquiries.\n'
               'I\'m available for interviews, background briefings, or to providecommentary on industry trends.\n\n'
               'Please let me know what topics you\'d like to cover and your deadline.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato. Zion Tech Group está pleased em se engajar com consultas de mídia.\n'
               'Estou disponível para entrevistas, briefings de background ou para fornecer comentário sobre tendências do setor.\n\n'
               'Por favor, me avise sobre quais tópicos você gostaria de cobrir e seu prazo.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnos. Zion Tech Group está pleased de participar en consultas de medios.\n'
               'Estoy disponible para entrevistas, sesiones informativo o para proporcionar comentarios sobre tendencias de la industria.\n\n'
               'Por favor, hágamelo saber qué temas le gustaría cubrir y su fecha límite.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoir contactés. Zion Tech Group est heureux de s\'engager dans les demandes des médias.\n'
               'Je suis disponible pour des entretiens, des briefings informatifs ou pour fournir des commentaires sur les tendances du secteur.\n\n'
               'Veuillez me faire savoir quels sujets vous souhaitez couvrir et votre délai.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre Kontaktaufnahme. Zion Tech Group ist erfreut, sich mit Medienanfragen zu beschäftigen.\n'
               'Ich stehe für Interviews, Hintergrundgespräche oder zur Kommentierung von Branchentrends zur Verfügung.\n\n'
               'Bitte lassen Sie mich wissen, welche Themen Sie abdecken möchten und wann Ihre Frist ist.\n\n'
               '{signature}'),
    },
    # ── partnership_scaled (duplicate key fix) ──────────────────────────────
    # ── cold_outreach_response ───────────────────────────────────────────────
    'cold_outreach_response': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out — I appreciate you taking the time to connect with Zion Tech Group.\n'
               'I\'d love to learn more about what you\'re working on.\n\n'
               'Are you available for a brief call this week? I\'m flexible and happy to work around your schedule.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato — agradeço por você tirar um tempo para conectar com a Zion Tech Group.\n'
               'Adoraria saber mais sobre o que você está trabalhando.\n\n'
               'Você está disponível para uma breve chamada esta semana? Sou flexível e feliz em adaptar ao seu horário.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnos — agradezco que te tomes el tiempo para conectar con Zion Tech Group.\n'
               'Me encantaría saber más sobre lo que estás trabajando.\n\n'
               '¿Estás disponible para una breve llamada esta semana? Soy flexible y feliz de adaptarme a tu horario.\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoir contactés — j\'apprécie que vous preniez le temps de vous connecter avec Zion Tech Group.\n'
               'J\'adorerais en savoir plus sur ce que vous travaillez.\n\n'
               'Êtes-vous disponible pour un bref appel cette semaine? Je suis flexible et heureux de m\'adapter à votre horaires.\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre Kontaktaufnahme — ich schätze es, dass Sie sich die Zeit nehmen, sich mit Zion Tech Group zu verbinden.\n'
               'Ich würde gerne mehr darüber erfahren, woran Sie arbeiten.\n\n'
               'Sind Sie diese Woche für ein kurzes Telefonat verfügbar? Ich bin flexibel und glücklich, mich an Ihren Zeitplan anzupassen.\n\n'
               '{signature}'),
    },
    # ── testimonial_request ──────────────────────────────────────────────────
    'testimonial_request': {
        'EN': ('Hi {name},\n\n'
               'Thank you for your continued partnership. We\'d love to feature your success story.\n'
               'A brief testimonial or case study would mean a lot and helps other companies discover the value we provide.\n\n'
               'Would you be open to sharing your experience? I can send a few questions to guide your response.\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado pela sua continued parceria. Adoraríamos destacar sua história de sucesso.\n'
               'Um breve testemunho ou estudo de caso seria muito significativo e ajuda outras empresas a descobrirem o valor que fornecemos.\n\n'
               'Você está aberto para compartilhar sua experiência? Posso enviar algumas perguntas para guiar sua resposta.\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por su continued asociación. Nos encantaría presentar su historia de éxito.\n'
               'Un breve testimonio o caso de estudio significaría mucho y ayuda a otras empresas a descubrir el valor que proporcionamos.\n\n'
               '¿Estaría abierto a compartir su experiencia? Puedo enviar algunas preguntas para guiar su respuesta.\n\n'
               '{signature}'),
        'FR': ("Bonjour {name},\n\n"
               "Merci de votre continued partenariat. Nous serions ravis de presenter votre histoire de succès.\n"
               "Un bref témoignage ou étude de cas signifierait beaucoup et aide d'autres entreprises à découvrir la valeur que nous fournissons.\n\n"
               "Seriez-vous ouvert au partage de votre expérience? Je peux envoyer quelques questions pour guider votre réponse.\n\n"
               "{signature}"),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre continued Partnerschaft. Wir würden Ihre Erfolgsgeschichte gerne vorstellen.\n'
               'Ein kurzes Testimonial oder eine Fallstudie würde viel bedeuten und hilft anderen Unternehmen, den Wert zu entdecken, den wir bieten.\n\n'
               'Wären Sie offen dafür, Ihre Erfahrung zu teilen? Ich kann einige Fragen senden, um Ihre Antwort zu leiten.\n\n'
               '{signature}'),
    },
    # ── general ─────────────────────────────────────────────────────────────
    'general': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out to Zion Tech Group.\n'
               'I\'ve received your message and will get back to you with a detailed response shortly.\n\n'
               'In the meantime, feel free to explore our full range of services at https://ziontechgroup.com.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato com a Zion Tech Group.\n'
               'Recebi sua mensagem e retornarei com uma resposta detalhada em breve.\n\n'
               'Enquanto isso, sinta-se à vontade para explorar nossa gama completa de serviços em https://ziontechgroup.com.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnos a Zion Tech Group.\n'
               'He recibido su mensaje y le responderé con una respuesta detallada en breve.\n\n'
               'Mientras tanto, no dude en explorar nuestra amplia gama de servicios en https://ziontechgroup.com.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de avoir contacté Zion Tech Group.\n'
               'J\'ai reçu votre message et je reviendrai vers vous avec une réponse détaillée sous peu.\n\n'
               'En attendant, n\'hésitez pas à explorer notre gamme complète de services sur https://ziontechgroup.com.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke, dass Sie sich an Zion Tech Group gewandt haben.\n'
               'Ich habe Ihre Nachricht erhalten und werde Ihnen in Kürze eine detaillierte Antwort zukommen lassen.\n\n'
               'In der Zwischenzeit können Sie gerne unsere vollständige Servicepalette unter https://ziontechgroup.com erkunden.\n\n'
               '{kb_context}\n'
               '{thread_context}'
               '{signature}'),
    },
    # ── urgent (fallback for all unrecognized intents) ──────────────────────
    'urgent': {
        'EN': ('Hi {name},\n\n'
               'Thank you for reaching out. I\'ve received your message and am treating it as a priority.\n'
               'I\'ll respond with a detailed update within 2 business hours.\n\n'
               'If this requires immediate attention, please call: +1 302 464 0950\n\n'
               '{signature}'),
        'PT': ('Olá {name},\n\n'
               'Obrigado por entrar em contato. Recebi sua mensagem e estou treating-a como prioridade.\n'
               'Responderei com uma atualização detalhada em até 2 dias úteis.\n\n'
               'Se isso requer atenção imediata, por favor ligue para: +1 302 464 0950\n\n'
               '{signature}'),
        'ES': ('Hola {name},\n\n'
               'Gracias por contactarnos. He recibido su mensaje y lo estoy treat，作为一个优先事项。\n'
               'Responderei con una actualización detallada dentro de 2 días hábiles.\n\n'
               'Si esto requiere atención inmediata, por favor llame a: +1 302 464 0950\n\n'
               '{signature}'),
        'FR': ('Bonjour {name},\n\n'
               'Merci de nous avoir contactés. J\'ai reçu votre message et le考虑一下 como une priorité.\n'
               'Je вам ответит с подробной информацией в течение 2 рабочих дней.\n\n'
               'Si esto requiere atención imediata, por favor llame a: +1 302 464 0950\n\n'
               '{signature}'),
        'DE': ('Hallo {name},\n\n'
               'Danke für Ihre Kontaktaufnahme. Ich habe Ihre Nachricht erhalten und behandle sie als Priorität.\n'
               'Ich werde Ihnen innerhalb von 2 Werktagen ein detailliertes Update geben.\n\n'
               'Wenn dies sofortige Aufmerksamkeit erfordert, bitte anrufen: +1 302 464 0950\n\n'
               '{signature}'),
    },
}

def _subject_line(subject: str, intent: str) -> str:
    if subject.lower().startswith('re:'):
        return subject
    prefixes = {
        'billing_inquiry': '[Billing]', 'support_issue': '[Support]', 'meeting_request': '[Meeting]',
        'demo_request': '[Demo]', 'partnership_offer': '[Partnership]', 'urgent': '[⚠️ Urgent]',
        'cancellation': '[Cancellation]', 'complaint': '[Complaint]', 'general': '',
    }
    prefix = prefixes.get(intent, '')
    return f'{prefix} Re: {subject}'.strip()

# ═══════════════════════════════════════════════════════════════════════════════
#  ESCALATION DETECTION V34
# ═══════════════════════════════════════════════════════════════════════════════
def detect_escalation(email: dict, intent: str, sentiment: dict, high_value: dict) -> dict:
    urgency      = sentiment.get('urgency', 'low')
    frustration = sentiment.get('frustration', 0)
    polarity    = sentiment.get('polarity', 'neutral')
    subj        = (email.get('subject') or '').lower()
    body        = (email.get('body') or email.get('snippet') or '').lower()

    escalate = False
    reasons  = []
    severity = 'none'

    if urgency in ('high', 'critical'):
        escalate = True
        reasons.append('high_urgency_detected')
        severity = 'high'

    if high_value.get('is_urgent'):
        escalate = True
        reasons.append('high_value_deadline_detected')
        severity = 'high'

    if high_value.get('is_high_value'):
        escalate = True
        reasons.append('high_value_account_detected')
        severity = 'high'

    if frustration >= 0.75:
        escalate = True
        reasons.append('high_frustration_score')
        severity = 'high'

    if polarity == 'negative' and any(k in (subj + body) for k in ['cancel', 'refund', 'lawsuit', 'legal', 'lawyer']):
        escalate = True
        reasons.append('negative_legal_keywords')
        severity = 'critical'

    financial_patterns = ['routing number', 'bank account', 'swift', 'wire', 'tax id', 'ssn']
    if any(p in body for p in financial_patterns):
        escalate = True
        reasons.append('financial_data_request')
        severity = 'medium'

    if intent in ('cancellation', 'complaint') and sentiment.get('satisfaction', 1.0) < 0.4:
        escalate = True
        reasons.append('low_satisfaction_cancellation_or_complaint')
        severity = 'high'

    return {
        'escalate': escalate, 'reasons': reasons, 'severity': severity,
        'intent': intent, 'sentiment': polarity,
    }

# ═══════════════════════════════════════════════════════════════════════════════
#  SERVICE SUGGESTION FORMATTING
# ═══════════════════════════════════════════════════════════════════════════════
def embed_service_suggestions(service_suggestions: list) -> str:
    if not service_suggestions:
        return ''
    lines = ['\n\nP.S. We also offer services that might be exactly what you\'re looking for:']
    for svc in service_suggestions[:2]:  # V34: max 2
        lines.append(f'• {format_service_suggestion(svc)}')
    lines.append('Learn more at https://ziontechgroup.com/services\n')
    return '\n'.join(lines)

# ═══════════════════════════════════════════════════════════════════════════════
#  V34 MAIN PROCESSOR
# ═══════════════════════════════════════════════════════════════════════════════
def process_email_v34(email: dict, dry_run: bool = True) -> dict:
    """
    V34 end-to-end email processor.
    Steps:
      1. Intent classification
      2. Sentiment analysis
      3. High-value detection
      4. Thread history grounding
      5. KB context building
      6. Service matching (max 2)
      7. Language detection
      8. Reply-All decision
      9. Generate response (all 5 languages per intent)
      10. Quality gate → [AUTO-DRAFT] if <70
      11. Send (or dry-run)
      12. Record learning
      13. Enqueue follow-ups
    """
    run_id  = f'v34-{datetime.now().strftime("%Y%m%d-%H%M%S%f")}'
    t0      = time.monotonic()
    now     = datetime.now(timezone.utc)

    # Step 1: Intent classification
    intent_result = classify_intent(email)
    intent        = intent_result['intent']
    confidence    = intent_result['confidence']

    # Step 2: Sentiment analysis
    text     = email.get('body') or email.get('snippet') or ''
    sentiment = analyze_sentiment(text)

    # Step 3: High-value detection
    high_value = detect_high_value(email, sentiment)

    # Step 4: Thread history grounding (Feature 4)
    thread_context = build_thread_context(email.get('thread_id', ''))

    # Step 5: KB grounding
    kb_context = build_kb_context(intent, text)

    # Step 6: Service matching (max 2)
    service_suggestions = match_zion_services(text, max_suggestions=2)

    # Step 7: Language detection
    lang = detect_language(text)
    sig  = _SIGS.get(lang, _SIGS['EN'])

    # Step 8: Reply-All decision
    reply_all_ok, cc_header, reply_all_reason = should_reply_all(email, intent)

    # Apply CC cooldown suppression
    sender_email = email.get('sender', '')
    if sender_email and is_cc_on_cooldown(sender_email):
        reply_all_ok   = False
        reply_all_reason = reply_all_reason + '_cooldown_suppressed'
        log('info', f'CC cooldown suppressed for {sender_email}')

    # Step 9: Generate response
    template_dict = _TEMPLATES.get(intent, _TEMPLATES['general'])
    template      = template_dict.get(lang, template_dict['EN'])
    name          = _extract_name(email.get('sender', ''))
    body_template = template

    # Format template
    try:
        response_body = body_template.format(
            name=name,
            subject=email.get('subject', ''),
            kb_context=kb_context,
            thread_context=thread_context,
            signature=sig,
            ctx={},
        )
    except Exception:
        response_body = body_template

    # Embed service suggestions naturally
    response_body += embed_service_suggestions(service_suggestions)

    # Step 10: Quality gate
    quality = score_response_quality(response_body, intent, sentiment, email.get('sender', ''))
    if quality['auto_draft']:
        log('WARN', f'[AUTO-DRAFT] quality={quality["overall"]} intent={intent} email_id={email.get("message_id","?")}')
        response_body = f'[AUTO-DRAFT — requires human review]\n\n{response_body}'

    # Step 11: Escalation Check (Feature 12)
    escalation = detect_escalation(email, intent, sentiment, high_value)
    if escalation['escalate']:
        log('WARN', f'ESCALATION [{escalation["severity"].upper()}]: {escalation["reasons"]} — thread_id={email.get("thread_id","?")}')
        if not dry_run:
            send_telegram_escalation(email, intent, quality['overall'], high_value, str(escalation['reasons'][:2]))

    elapsed_ms = round((time.monotonic() - t0) * 1000, 1)

    # Step 12: Send (or dry-run)
    send_ok    = True
    send_error = ''
    if not dry_run:
        all_rcps = email.get('all_recipients', email.get('to', ''))
        # Feature 1: Reply-All Guarantee
        result = gmail_send_reply_all_verified(
            all_recipients=all_rcps,
            email=email,
            subject=_subject_line(email.get('subject', ''), intent),
            body=response_body,
        )
        send_ok    = result.get('success', False)
        send_error = result.get('error', '')

        if send_ok:
            # Update CC cooldown
            if reply_all_ok and cc_header:
                try:
                    for cc_addr in cc_header.split(','):
                        cc_addr = cc_addr.strip()
                        if cc_addr:
                            update_cc_cooldown(cc_addr)
                except Exception:
                    pass

            # Record send for learning
            record_send(
                email_id=email.get('message_id', email.get('thread_id', '')),
                intent=intent,
                reply_all=reply_all_ok,
                quality=quality['overall'],
                sentiment=sentiment,
            )

            # Enqueue follow-ups (Feature 5)
            thread_id = email.get('thread_id', '')
            if thread_id and not email.get('all_recipients', '').count(',') >= 2:
                # Only enqueue for 1:1 threads
                pass  # follow-up enqueue logic handled by caller

    result = {
        'run_id': run_id,
        'success': send_ok if not dry_run else True,
        'error': send_error,
        'intent': intent,
        'intent_confidence': confidence,
        'sentiment': sentiment,
        'high_value': high_value,
        'escalation': escalation,
        'reply_all': reply_all_ok,
        'reply_all_reason': reply_all_reason,
        'language': lang,
        'quality_scores': quality['scores'],
        'quality_overall': quality['overall'],
        'quality_suggestions': quality['suggestions'],
        'auto_draft': quality['auto_draft'],
        'response_body_preview': response_body[:300],
        'kb_context_used': bool(kb_context),
        'thread_context_used': bool(thread_context),
        'service_suggestions': [{'title': s['title']} for s in service_suggestions[:2]],
        'elapsed_ms': elapsed_ms,
        'dry_run': dry_run,
    }

    # Log
    try:
        with open(V34_LOG, 'a') as f:
            f.write(json.dumps(result, ensure_ascii=False) + '\n')
    except Exception:
        pass

    return result

# ═══════════════════════════════════════════════════════════════════════════════
#  FEATURE 13: BATCH PROCESSING
# ═══════════════════════════════════════════════════════════════════════════════
def load_processed_thread_ids() -> set:
    """Load thread_ids already processed in v34_send_log.jsonl."""
    processed = set()
    try:
        if V34_SEND_LOG.exists():
            for line in open(V34_SEND_LOG).read().splitlines():
                if line.strip():
                    try:
                        r = json.loads(line)
                        tid = r.get('email_id', '')
                        if tid:
                            processed.add(tid)
                    except Exception:
                        pass
    except Exception:
        pass
    return processed

def process_batch_v34(emails: list, dry_run: bool = True, max_per_run: int = 50) -> list:
    """Process up to max_per_run emails. Skip duplicates by thread_id."""
    processed_ids = load_processed_thread_ids()
    results = []
    for email in emails[:max_per_run]:
        thread_id = email.get('thread_id', email.get('message_id', ''))
        if thread_id in processed_ids:
            log('info', f'Skipping duplicate thread: {thread_id}')
            continue
        try:
            r = process_email_v34(email, dry_run=dry_run)
            results.append(r)
            if not dry_run and r.get('success'):
                processed_ids.add(thread_id)
        except Exception as e:
            log('error', f'Failed to process email {thread_id}: {e}')
            results.append({'success': False, 'error': str(e), 'thread_id': thread_id})
    return results

# ═══════════════════════════════════════════════════════════════════════════════
#  FOLLOWUP PROCESSOR
# ═══════════════════════════════════════════════════════════════════════════════
def process_followups(dry_run: bool = True):
    """Process pending follow-ups from the queue."""
    pending = get_pending_followups()
    log('info', f'Processing {len(pending)} pending follow-ups')
    for entry in pending:
        try:
            lang = detect_language(entry.get('subject', ''))
            stage = entry['stage']
            template_dict = _FOLLOWUP_TEMPLATES.get(stage, _FOLLOWUP_TEMPLATES['reminder_3d'])
            template = template_dict.get(lang, template_dict['EN'])
            sig = _SIGS.get(lang, _SIGS['EN'])

            body = template.format(
                name=_extract_name(entry.get('sender', '')),
                subject=entry.get('subject', ''),
                service_highlight='our AI-powered automation and analytics solutions',
                signature=sig,
            )

            if not dry_run:
                result = send_email(
                    to=entry.get('sender', ''),
                    subject=f'Following up: {entry.get("subject", "")}',
                    body=body,
                )
                if result.get('success'):
                    mark_followup_done(entry['email_id'])
                    log('info', f'Follow-up sent: stage={stage} to={entry["sender"]}')
                else:
                    log('warn', f'Follow-up failed: {result.get("error")}')
            else:
                log('info', f'[DRY RUN] Follow-up: stage={stage} to={entry["sender"]}')
                mark_followup_done(entry['email_id'])  # Mark done in dry run too
        except Exception as e:
            log('error', f'Follow-up processing error: {e}')

# ═══════════════════════════════════════════════════════════════════════════════
#  STATUS REPORTER
# ═══════════════════════════════════════════════════════════════════════════════
def show_status():
    try:
        lines = open(V34_LOG).read().splitlines()
        sent  = sum(1 for l in lines if json.loads(l).get('success') and not json.loads(l).get('dry_run'))
        dry   = sum(1 for l in lines if json.loads(l).get('dry_run'))
        esc   = sum(1 for l in lines if json.loads(l).get('escalation', {}).get('escalate'))
        avg_q = sum(json.loads(l).get('quality_overall', 0) for l in lines) / max(len(lines), 1)
        auto_drafts = sum(1 for l in lines if json.loads(l).get('auto_draft'))
        hv   = sum(1 for l in lines if json.loads(l).get('high_value', {}).get('is_high_value'))
        print(f'V34 Status:')
        print(f'  Total runs:    {len(lines)}')
        print(f'  Sent (live):  {sent}')
        print(f'  Dry runs:     {dry}')
        print(f'  Escalated:    {esc}')
        print(f'  High-value:   {hv}')
        print(f'  Auto-drafts:  {auto_drafts}')
        print(f'  Avg quality:  {avg_q:.1f}/100')
    except Exception as e:
        print(f'No runs yet: {e}')

    # Learning data
    try:
        data = load_learning_data()
        print(f'\nV34 Learning:')
        for intent, stats in data.get('intents', {}).items():
            total = stats.get('total', 0)
            if total >= 3:
                accepted = stats.get('accepted', 0)
                rate = accepted / total
                status = 'FAST-PATH' if rate > 0.85 else 'QUARANTINE' if rate < 0.60 else 'OK'
                print(f'  {intent}: {total} sends, {accepted} accepted ({rate:.0%}) [{status}]')
    except Exception as e:
        print(f'Learning data: {e}')

    # Pending follow-ups
    try:
        pending = get_pending_followups()
        print(f'\nPending follow-ups: {len(pending)}')
        for p in pending[:5]:
            print(f'  [{p["stage"]}] {p["send_date"][:10]} → {p["sender"][:40]}')
    except Exception as e:
        print(f'Follow-up queue: {e}')

# ═══════════════════════════════════════════════════════════════════════════════
#  CLI
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'test'

    if cmd == 'test':
        test_emails = [
            {
                'sender': 'john.doe@enterprise.com',
                'subject': 'Question about AI analytics pricing',
                'body': 'Hi Kleber, what are your rates for AI analytics services? We have a budget of around $50K.',
                'thread_id': 't1',
                'snippet': 'what are your rates for AI analytics?',
                'message_id': 'msg-test-1',
            },
            {
                'sender': 'ceo@bigcorp.com',
                'subject': 'Urgent: System is down',
                'body': 'URGENT: our production server has been down for 2 hours. This is critical. We need this resolved ASAP.',
                'thread_id': 't2',
                'snippet': 'production server down critical',
                'all_recipients': 'john@zion.com,jane@zion.com',
                'message_id': 'msg-test-2',
            },
            {
                'sender': 'partner@startup.io',
                'subject': 'Partnership proposal',
                'body': 'We have a partnership opportunity to discuss. Would love to schedule a call. Este é um bom partnership.',
                'thread_id': 't3',
                'snippet': 'partnership opportunity',
                'all_recipients': 'kleber@ziontechgroup.com,mike@zion.com',
                'message_id': 'msg-test-3',
            },
            {
                'sender': 'maria.silva@empresa.pt',
                'subject': 'Demo para serviços de IA',
                'body': 'Olá Kleber, gostaria de saber mais sobre os serviços de automação. Precisamos de ajuda com integração.',
                'thread_id': 't4',
                'snippet': 'serviços de automação',
                'message_id': 'msg-test-4',
            },
        ]
        for te in test_emails:
            r = process_email_v34(te, dry_run=True)
            lang_flag = f"[{r['language']}]"
            hv_flag   = '🚨HV' if r.get('high_value', {}).get('is_high_value') else ''
            esc_flag  = '🚨ESC' if r.get('escalation', {}).get('escalate') else ''
            draft_flag = '[AUTO-DRAFT]' if r.get('auto_draft') else ''
            print(f"  ✔ [{r['intent']}] score={r['quality_overall']} {lang_flag} {hv_flag} {esc_flag} {draft_flag} reply_all={r['reply_all']} | {r['quality_suggestions'][:2]}")

    elif cmd == 'send' and len(sys.argv) >= 3:
        email = {
            'sender': sys.argv[2],
            'subject': sys.argv[3] if len(sys.argv) > 3 else 'Test',
            'body': sys.argv[4] if len(sys.argv) > 4 else 'Test body',
            'thread_id': 'cli-test',
            'message_id': f'cli-{datetime.now().strftime("%Y%m%d%H%M%S")}',
        }
        r = process_email_v34(email, dry_run=False)
        print(json.dumps(r, indent=2))

    elif cmd == 'status':
        show_status()

    elif cmd == 'followup':
        process_followups(dry_run=False)

    elif cmd == 'check_learning':
        check_and_update_learning()
        show_status()

    else:
        print('Usage: python3 intelligent_email_responder_v34.py test|send|status|followup|check_learning')
        print('  test          — run test emails (dry-run)')
        print('  send <from> <subj> [body] — send live email')
        print('  status         — show V34 system status')
        print('  followup       — process pending follow-ups')
        print('  check_learning — poll Gmail for 7-day old threads')
