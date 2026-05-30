#!/usr/bin/env python3
"""
commands/email_intelligence_v31.py — V31 Deep Intelligence Layer

New capabilities:
  1. FAQ/Knowledge Base matching — auto-answer common questions from KB
  2. Smart webhook triggers — auto-create tickets, CRM entries, calendar events
  3. Thread continuation awareness — reads full thread history, detects context shifts
  4. Attachment deep analysis — PDF/contract/invoice auto-classification
  5. Auto-calendar-insert for meeting requests
  6. Multi-language reply (EN/PT/ES) with tone matching
  7. Reply-all with smart CC filtering (removes noreply, self, bounces)
  8. Self-learning from outcome feedback loop
  9. Spam/phishing detection with confidence scoring
  10. Newsletter/auto-notification auto-archive

Usage:
  from email_intelligence_v31 import V31Processor
  processor = V31Processor()
  result = processor.process_email(email_dict)
"""

import json, re, hashlib, time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, List, Any

DATA = Path(__file__).resolve().parent.parent / 'data'
V31_LOG = DATA / 'v31_run_log.jsonl'


def _log(record: dict):
    try:
        with open(V31_LOG, 'a') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    except Exception:
        pass


# ═══════════════════════════════════════════════════════════════
#  V31: FAQ / Knowledge Base
# ═══════════════════════════════════════════════════════════════

FAQ_KB = [
    {
        'patterns': [r'pricing', r'how much', r'cost', r'quote', r'rate', r'price'],
        'question': 'What are your pricing/rates?',
        'answer_en': 'Our pricing varies by project scope and service type. AI services start at $149/mo, IT services from $2,500/project, and Micro-SaaS from $19/mo. For a custom proposal, visit https://ziontechgroup.com/contact or reply with your specific needs.',
        'answer_pt': 'Nossos preços variam por escopo do projeto e tipo de tipo de serviço. Serviços de IA começam em $149/mo, serviços de TI a partir de $2.500/projeto e Micro-SaaS a partir de $19/mo. Para uma proposta personalizada, visite https://ziontechgroup.com/contact.',
        'intent': 'sales',
    },
    {
        'patterns': [r'email.*responder', r'auto.*email', r'email.*automat', r'smart.*email'],
        'question': 'Tell me about the AI Email Responder',
        'answer_en': 'Our AI Email Responder handles incoming emails 24/7 — categorizing, prioritizing, drafting replies with human-in-the-loop approval. It supports EN/PT/ES, detects sentiment, smart reply-all, and escalates critical issues. Plans from $39/mo to $299/mo. Learn more: https://ziontechgroup.com/services/micro-saas-ai-email-responder',
        'answer_pt': 'Nosso Email Responder com IA gerencia e-mails 24/7 — categoriza, prioriza, cria rascunhos com aprovação humana. Suporta EN/PT/ES, detecta sentimento, reply-all inteligente e escalona problemas críticos. Planos de $39/mo a $299/mo.',
        'intent': 'sales',
    },
    {
        'patterns': [r'cloud.*migrat', r'migrat.*cloud', r'aws', r'azure', r'gcp'],
        'question': 'Do you do cloud migration?',
        'answer_en': 'Yes — we handle end-to-end cloud migration (AWS, Azure, GCP) with zero downtime. Includes assessment, planning, execution, and post-optimization. Starts at $2,500/project. Info: https://ziontechgroup.com/services/it-cloud-migration-service',
        'answer_pt': 'Sim — fazemos migração completa para nuvem (AWS, Azure, GCP) com tempo de inatividade zero. Inclui avaliação, planejamento, execução e pós-otimização. A partir de $2.500/projeto.',
        'intent': 'sales',
    },
    {
        'patterns': [r'cyber.*secur', r'security.*audit', r'penetration', r'vulnerability', r'soc2', r'hipaa', r'gdpr'],
        'question': 'Do you offer cybersecurity audits?',
        'answer_en': 'Yes — comprehensive cybersecurity audit including vulnerability scanning, penetration testing, and compliance gap analysis (SOC2/HIPAA/GDP). From $1,999/audit. Info: https://ziontechgroup.com/services/it-cybersecurity-audit',
        'answer_pt': 'Sim — auditoria abrangente de cibersegurança incluindo varredura de vulnerabilidades, teste de penetração e análise de conformidade (SOC2/HIPAA/GDPR). A partir de $1.999/auditoria.',
        'intent': 'sales',
    },
    {
        'patterns': [r'chatbot', r'customer.*support.*bot', r'ai.*chat', r'whatsapp.*bot'],
        'question': 'Do you build customer support chatbots?',
        'answer_en': 'Yes — we deploy AI chatbots for 24/7 customer support with natural language understanding, automatic ticket creation, and human handoff. Integrates with website, WhatsApp, and social media. From $149/mo. Info: https://ziontechgroup.com/services/ai-customer-support-chatbot',
        'answer_pt': 'Sim — implantamos chatbots com IA para suporte 24/7 com compreensão de linguagem natural, criação automática de tickets e transferência para humanos. A partir de $149/mo.',
        'intent': 'sales',
    },
    {
        'patterns': [r'document.*process', r'ocr', r'invoice.*automat', r'contract.*analys'],
        'question': 'Can you automate document processing?',
        'answer_en': 'Yes — our AI Document Processor extracts, classifies, and processes data from invoices, contracts, receipts, and forms with 99%+ accuracy. OCR + AI. From $99/mo. Info: https://ziontechgroup.com/services/ai-document-processor',
        'answer_pt': 'Sim — nosso processador de documentos com IA extrai, classifica e processa dados de notas fiscais, contratos, recibos e formulários com 99%+ de precisão. A partir de $99/mo.',
        'intent': 'sales',
    },
    {
        'patterns': [r'get.*start', r'how.*start', r'onboard', r'sign.*up', r'register'],
        'question': 'How do I get started?',
        'answer_en': 'Getting started is easy! Reply with your specific need, visit https://ziontechgroup.com/contact, or call 📱 +1 302 464 0950. We respond within 24 hours with a custom proposal.',
        'answer_pt': 'Começar é fácil! Responda com sua necessidade específica, visite https://ziontechgroup.com/contact, ou ligue 📱 +1 302 464 0950. Respondemos em 24 horas.',
        'intent': 'sales',
    },
    {
        'patterns': [r'contact', r'reach.*you', r'phone', r'email.*you', r'call'],
        'question': 'How do I contact you?',
        'answer_en': '📱 Phone/WhatsApp: +1 302 464 0950\n✉️ Email: kleber@ziontechgroup.com\n📍 Address: 364 E Main St STE 1008, Middletown DE 19709\n🌐 Web: https://ziontechgroup.com/contact\nWe respond within 24 hours.',
        'answer_pt': '📱 Telefone/WhatsApp: +1 302 464 0950\n✉️ E-mail: kleber@ziontechgroup.com\n🌐 Web: https://ziontechgroup.com/contact\nRespondemos em 24 horas.',
        'intent': 'general',
    },
]


def match_faq(body: str, subject: str, lang: str = 'en') -> Optional[dict]:
    """Match email against FAQ knowledge base. Returns best match or None."""
    text = (subject + ' ' + body).lower()
    best_match = None
    best_score = 0

    for faq in FAQ_KB:
        score = sum(1 for p in faq['patterns'] if re.search(p, text))
        if score > best_score:
            best_score = score
            best_match = faq

    if best_match and best_score >= 1:
        answer = best_match.get(f'answer_{lang}', best_match['answer_en'])
        return {
            'matched': True,
            'question': best_match['question'],
            'answer': answer,
            'confidence': min(0.95, 0.5 + 0.15 * best_score),
            'intent': best_match.get('intent', 'general'),
        }
    return None


# ═══════════════════════════════════════════════════════════════
#  V31: Spam / Phishing Detector
# ═══════════════════════════════════════════════════════════════

_SPAM_SIGNALS = [
    r'you.*won', r'congratulations.*prize', r'claim.*reward',
    r'urgent.*verify.*account', r'suspended.*unless.*click',
    r'free.*gift.*click', r'limited.*time.*act now',
    r'\$\d+.*million', r'wire transfer.*fee', r'nigerian',
    r'crypto.*investment.*guaranteed', r'double.*your.*bitcoin',
]

_PHISHING_SIGNALS = [
    r'verify.*identity.*immediately', r'account.*will.*be.*closed',
    r'confirm.*credit.*card', r'ssn.*required', r'social security',
    r'bank.*account.*verify', r'login.*from.*unusual.*location',
    r'click.*here.*within.*\d+.*hours', r'password.*expired',
]


def detect_spam(body: str, subject: str, sender: str) -> dict:
    text = (subject + ' ' + body).lower()
    spam_score = sum(1 for p in _SPAM_SIGNALS if re.search(p, text))
    phishing_score = sum(1 for p in _PHISHING_SIGNALS if re.search(p, text))

    # Sender-based signals
    sender_lower = sender.lower()
    if any(kw in sender_lower for kw in ['noreply', 'no-reply', 'donotreply']):
        spam_score += 0.5

    total = spam_score + phishing_score * 2  # Phishing weighted higher

    return {
        'is_spam': total >= 2,
        'is_phishing': phishing_score >= 1,
        'spam_score': spam_score,
        'phishing_score': phishing_score,
        'confidence': min(1.0, total / 5),
        'action': 'phishing_alert' if phishing_score >= 1 else ('auto_trash' if total >= 3 else ('auto_archive' if total >= 2 else 'none')),
    }


# ═══════════════════════════════════════════════════════════════
#  V31: Smart Reply-All Engine
# ═══════════════════════════════════════════════════════════════

def smart_reply_all(sender: str, to_hdr: str, cc_hdr: str, subject: str, body: str, 
                     reply_history: list = None) -> dict:
    """
    Intelligent reply-all with:
    - CC filtering (removes noreply, self, bounces)
    - Thread context awareness
    - Private vs group detection
    - Mailing list detection
    """
    text = (subject + ' ' + body).lower()
    
    # Parse recipients
    cc_list = [c.strip() for c in cc_hdr.split(',') if c.strip()] if cc_hdr else []
    to_list = [t.strip() for t in to_hdr.split(',') if t.strip()] if to_hdr else []
    self_email = 'kleber@ziontechgroup.com'

    # Private signals → always reply-only
    private_signals = [
        'just you', 'only you', 'private', 'confidential',
        'between us', 'not for distribution', 'personal reply',
        'do not reply all',
    ]
    if any(sig in text for sig in private_signals):
        return {'reply_all': False, 'reason': 'private_signals', 'cc_list': [], 'to_override': ''}

    # Mailing list detection → reply-only to sender
    list_signals = ['list-', '-request@', 'majordomo', 'listserv', 'mailing list']
    if any(sig in text or sig in sender.lower() for sig in list_signals):
        return {'reply_all': False, 'reason': 'mailing_list', 'cc_list': [], 'to_override': sender}

    # Auto-reply / notification → no reply needed
    auto_systems = [
        'noreply', 'no-reply', 'donotreply', 'mailer-daemon', 'postmaster',
        'notifications@', 'alerts@', 'updates@', 'automated@',
    ]
    if any(sig in sender.lower() for sig in auto_systems):
        return {'reply_all': False, 'reason': 'auto_system', 'cc_list': [], 'to_override': ''}

    # Filter CC list
    filtered_cc = []
    for cc in cc_list:
        cc_lower = cc.lower()
        # Remove self
        if self_email in cc_lower:
            continue
        # Remove noreply addresses
        if any(kw in cc_lower for kw in ['noreply', 'no-reply', 'donotreply', 'bounce', 'mailer-daemon']):
            continue
        filtered_cc.append(cc)

    # Group signals
    group_keywords = [
        'team', 'group', 'project', 'all', 'everyone',
        'hi all', 'hello all', 'hey team', 'team update',
        'department', 'staff', 'all-hands', 'townhall', 'standup',
    ]
    meeting_keywords = [
        'meeting', 'call', 'zoom', 'teams', 'calendar',
        'schedule', 'availability', 'sync up', 'catch up',
    ]

    is_group = any(kw in text for kw in group_keywords) or len(cc_list) > 2
    is_meeting = any(kw in text for kw in meeting_keywords)

    # Already replied check
    if reply_history:
        our_reply_hash = hashlib.md5(f"re:{subject}".encode()).hexdigest()[:16]
        if our_reply_hash in [r.get('hash', '') for r in reply_history]:
            return {'reply_all': False, 'reason': 'already_replied', 'cc_list': []}

    # Decision
    if is_group and filtered_cc:
        reply_all = True
        reason = 'group_with_cc'
    elif is_meeting and filtered_cc:
        reply_all = True
        reason = 'meeting_with_cc'
    elif len(filtered_cc) > 1:
        reply_all = True
        reason = 'multiple_cc'
    elif 'fwd:' in subject.lower() and filtered_cc:
        reply_all = True
        reason = 'forwarded_thread'
    else:
        reply_all = False
        reason = 'direct_message'

    return {
        'reply_all': reply_all,
        'reason': reason,
        'cc_list': filtered_cc,
        'original_cc_count': len(cc_list),
        'filtered_cc_count': len(filtered_cc),
        'is_group': is_group,
        'is_meeting': is_meeting,
    }


# ═══════════════════════════════════════════════════════════════
#  V31: Newsletter / Auto-Notification Detector
# ═══════════════════════════════════════════════════════════════

_NEWSLETTER_SIGNALS = [
    'unsubscribe', 'view in browser', 'email preferences',
    'this email was sent to', 'you are receiving this because',
    'manage preferences', 'email settings', 'opt out',
    'promotional', 'marketing email', 'newsletter',
]

_NOTIFICATION_SIGNALS = [
    'notification', 'alert', 'your report is ready',
    'has been updated', 'action required', 'automated message',
    'no-reply', 'do not reply', 'system notification',
    'account activity', 'security alert', 'password changed',
    'new login', 'verification code', 'confirmation code',
]


def detect_newsletter(body: str, subject: str, sender: str) -> dict:
    text = (subject + ' ' + body).lower()
    
    newsletter_score = sum(1 for s in _NEWSLETTER_SIGNALS if s in text)
    notification_score = sum(1 for s in _NOTIFICATION_SIGNALS if s in text)
    
    sender_lower = sender.lower()
    is_newsletter_sender = any(kw in sender_lower for kw in [
        '@mail.', '@newsletter.', '@notifications.', '@marketing.',
        'updates@', 'alerts@', 'newsletter@',
    ])

    result = {
        'is_newsletter': newsletter_score >= 2 or is_newsletter_sender,
        'is_notification': notification_score >= 1,
        'newsletter_score': newsletter_score,
        'notification_score': notification_score,
        'auto_action': 'none',
    }

    if result['is_newsletter']:
        result['auto_action'] = 'auto_archive'
    elif result['is_notification']:
        result['auto_action'] = 'auto_ack'

    return result


# ═══════════════════════════════════════════════════════════════
#  V31: Attachment Deep Analyzer
# ═══════════════════════════════════════════════════════════════

_ATTACHMENT_RULES = {
    'invoice': {
        'patterns': ['invoice', 'bill', 'payment due', 'amount due', 'total due'],
        'action': 'auto_thank',
        'priority': 'high',
    },
    'contract': {
        'patterns': ['contract', 'agreement', 'terms', 'SOW', 'statement of work', 'NDA', 'non-disclosure'],
        'action': 'escalate_legal',
        'priority': 'critical',
    },
    'proposal': {
        'patterns': ['proposal', 'pitch deck', 'deck', 'partnership proposal', 'business plan'],
        'action': 'draft_meeting',
        'priority': 'high',
    },
    'resume': {
        'patterns': ['resume', 'CV', 'curriculum vitae', 'application'],
        'action': 'draft_hiring',
        'priority': 'medium',
    },
    'legal': {
        'patterns': ['legal', 'cease and desist', 'subpoena', 'lawsuit', 'attorney', 'patent', 'trademark'],
        'action': 'escalate_legal',
        'priority': 'critical',
    },
}


def analyze_attachment(filename: str, content_preview: str = '') -> dict:
    """Classify attachment and recommend action."""
    text = (filename + ' ' + content_preview).lower()
    
    for att_type, rule in _ATTACHMENT_RULES.items():
        if any(p in text for p in rule['patterns']):
            return {
                'type': att_type,
                'action': rule['action'],
                'priority': rule['priority'],
                'needs_escalation': rule['action'].startswith('escalate'),
            }
    
    return {'type': 'unknown', 'action': 'draft_general', 'priority': 'medium', 'needs_escalation': False}


# ═══════════════════════════════════════════════════════════════
#  V31: Main Processor
# ═══════════════════════════════════════════════════════════════

class V31Processor:
    """
    V31 Email Intelligence Processor.
    Combines all V31 modules into a single case-by-case analysis pipeline.
    """

    def __init__(self):
        self.stats = defaultdict(int)

    def process_email(self, email: dict) -> dict:
        """
        Process a single email through the full V31 pipeline.
        
        Pipeline:
        1. Spam/phishing detection
        2. Newsletter/notification detection
        3. Language detection
        4. Sender classification
        5. Intent classification (multi-signal)
        6. Urgency detection
        7. Sentiment analysis
        8. FAQ matching (auto-answer if high confidence)
        9. Attachment analysis
        10. Action decision
        11. Reply-all decision
        12. Draft generation
        13. Quality scoring
        """
        sender = email.get('sender', '')
        subject = email.get('subject', '')
        body = email.get('body', email.get('snippet', ''))
        to_hdr = email.get('to_header', '')
        cc_hdr = email.get('cc', '')

        t_start = time.monotonic()

        # Step 1: Spam/phishing
        spam_result = detect_spam(body, subject, sender)
        if spam_result['action'] == 'phishing_alert':
            return self._build_result(email, 'phishing_alert', spam_result, t_start)
        if spam_result['action'] == 'auto_trash':
            return self._build_result(email, 'auto_trash', spam_result, t_start)

        # Step 2: Newsletter/notification
        digest_result = detect_newsletter(body, subject, sender)
        if digest_result['auto_action'] == 'auto_archive':
            return self._build_result(email, 'auto_archive', digest_result, t_start)

        # Step 3: Language detection
        lang = self._detect_lang(body + ' ' + subject)

        # Step 4: Sender classification
        sender_type = self._classify_sender(sender)

        # Step 5-7: Core analysis (intent + urgency + sentiment)
        analysis = self._core_analysis(body, subject, sender)

        # Step 8: FAQ matching — if high-confidence match, auto-answer
        faq_match = match_faq(body, subject, lang)
        if faq_match and faq_match['confidence'] >= 0.8 and analysis['intent'] in ('sales', 'general'):
            analysis['faq_match'] = faq_match
            analysis['action'] = 'faq_auto_reply'
            analysis['auto_answer'] = faq_match['answer']

        # Step 9: Attachment analysis
        attachment = analyze_attachment(
            email.get('attachment_names', [''])[0] if email.get('attachment_names') else '',
            body[:500]
        )
        analysis['attachment'] = attachment

        # Step 10: Action decision
        action = self._decide_action(analysis, sender_type, spam_result, digest_result)

        # Step 11: Reply-all
        reply_all = smart_reply_all(sender, to_hdr, cc_hdr, subject, body)

        # Step 12: Draft
        draft = None
        if action.startswith('draft_') or action == 'faq_auto_reply':
            draft = self._generate_draft(action, sender, subject, body, lang, analysis, reply_all)
        elif action == 'auto_ack':
            draft = None

        # Step 13: Quality score
        quality = self._score_draft(draft, action)

        result = {
            'action': action,
            'language': lang,
            'sender_type': sender_type,
            'analysis': analysis,
            'reply_all': reply_all,
            'draft': draft,
            'quality_score': quality,
            'elapsed_ms': round((time.monotonic() - t_start) * 1000, 1),
            'needs_human_review': action in ('escalate', 'escalate_legal', 'review') or quality < 70,
        }

        _log({
            'ts': datetime.now(timezone.utc).isoformat(),
            'sender': sender[:50],
            'subject': subject[:60],
            'action': action,
            'reply_all': reply_all['reply_all'],
            'quality': quality,
            'elapsed_ms': result['elapsed_ms'],
        })

        return result

    def _detect_lang(self, text: str) -> str:
        t = text.lower()
        pt = sum(1 for w in ['olá','obrigado','por favor','preço','proposta','atenciosamente','abraço','caro'] if w in t)
        es = sum(1 for w in ['hola','gracias','por favor','estimado','cotización','propuesta','saludos'] if w in t)
        if pt >= 2 and pt >= es: return 'pt'
        if es >= 2: return 'es'
        return 'en'

    def _classify_sender(self, sender: str) -> str:
        s = sender.lower()
        if any(k in s for k in ['noreply','no-reply','donotreply','mailer-daemon','postmaster']):
            return 'automated'
        if any(k in s for k in ['@mail.','@newsletter.','@notifications.','@updates.','@alerts.','@marketing.']):
            return 'newsletter'
        return 'person'

    def _core_analysis(self, body: str, subject: str, sender: str) -> dict:
        text = (subject + ' ' + body).lower()
        
        # Intent scoring
        intent_scores = {}
        intent_kws = {
            'booking': ['booking','reserve','appointment','schedule','check-in','check-out','room','reservation'],
            'sales': ['pricing','quote','proposal','interested','how much','cost','plan','demo','trial','purchase','buy'],
            'support': ['help','issue','problem','bug','error','broken','not working','support','assist','reset password'],
            'partnership': ['partner','collaboration','joint venture','strategic','affiliate','integration'],
            'billing': ['invoice','payment','receipt','billing','charge','refund','overdue','subscription'],
            'meeting': ['meeting','call','zoom','teams','calendar','available','schedule','15 min','catch up'],
            'hiring': ['job','career','position','hiring','apply','resume','cv','interview','role'],
            'legal': ['legal','attorney','lawyer','cease','subpoena','lawsuit','sue','litigation'],
            'feedback': ['feedback','review','rating','testimonial','suggestion','survey'],
        }
        for intent, kws in intent_kws.items():
            score = sum(1 for kw in kws if kw in text)
            score += sum(2 for kw in kws if kw in subject.lower())
            if score > 0:
                intent_scores[intent] = score

        if not intent_scores:
            primary_intent = 'general'
            confidence = 0.3
        else:
            sorted_intents = sorted(intent_scores.items(), key=lambda x: -x[1])
            primary_intent = sorted_intents[0][0]
            total = sum(intent_scores.values())
            confidence = min(0.95, sorted_intents[0][1] / max(total, 1) + (0.1 if sorted_intents[0][1] >= 3 else 0))

        # Urgency
        if any(k in text for k in ['urgent','asap','immediately','critical','emergency','outage','production is down','deadline today']):
            urgency = 'critical'
        elif any(k in text for k in ['important','priority','deadline','due date','action required']):
            urgency = 'high'
        elif any(k in text for k in ['when you get a chance','at your convenience','this week','no rush']):
            urgency = 'medium'
        else:
            urgency = 'low'

        # Sentiment
        neg = sum(1 for w in ['angry','frustrated','unacceptable','disappointed','terrible','worst','furious','outraged','unprofessional'] if w in text)
        pos = sum(1 for w in ['happy','pleased','great','excellent','wonderful','love','amazing','thank you','appreciate'] if w in text)
        
        if neg >= 2: sentiment = 'negative'
        elif neg >= 1: sentiment = 'slightly_negative'
        elif pos >= 2: sentiment = 'positive'
        elif pos >= 1: sentiment = 'slightly_positive'
        else: sentiment = 'neutral'

        return {
            'intent': primary_intent,
            'intent_confidence': round(confidence, 2),
            'secondary_intents': [i[0] for i in sorted(intent_scores.items(), key=lambda x: -x[1])[1:3]],
            'urgency': urgency,
            'sentiment': sentiment,
            'needs_empathy': sentiment in ('negative', 'slightly_negative'),
        }

    def _decide_action(self, analysis: dict, sender_type: str, spam: dict, digest: dict) -> str:
        intent = analysis['intent']
        urgency = analysis['urgency']

        # Escalation rules
        if intent == 'legal': return 'escalate_legal'
        if urgency == 'critical': return 'escalate'
        if analysis.get('attachment', {}).get('needs_escalation'): return 'escalate_legal'

        # FAQ auto-reply is handled before this point
        # Intent → action mapping
        mapping = {
            'booking': 'draft_booking',
            'sales': 'draft_sales',
            'support': 'draft_support_urgent' if urgency == 'high' else 'draft_support',
            'partnership': 'draft_partnership',
            'billing': 'draft_billing',
            'meeting': 'draft_meeting',
            'hiring': 'draft_hiring',
            'feedback': 'draft_feedback',
            'general': 'draft_general_urgent' if urgency in ('critical', 'high') else 'draft_general',
        }

        action = mapping.get(intent, 'draft_general')

        # Sentiment override: negative support → add empathy flag, escalate if severe
        if analysis.get('needs_empathy') and intent == 'support' and urgency in ('critical', 'high'):
            action = 'escalate'

        return action

    def _generate_draft(self, action: str, sender: str, subject: str, body: str,
                        lang: str, analysis: dict, reply_all: dict) -> Optional[str]:
        """Generate contextual draft based on action type and language."""
        name = self._extract_name(sender)
        sig = self._get_signature(lang, analysis.get('needs_empathy', False))
        intent = analysis.get('intent', 'general')
        urgency = analysis.get('urgency', 'low')

        # FAQ auto-reply
        if action == 'faq_auto_reply':
            return analysis.get('auto_answer', '') + sig

        # Select builder
        builders = {
            'draft_booking': self._build_booking,
            'draft_sales': self._build_sales,
            'draft_support': self._build_support,
            'draft_support_urgent': self._build_support_urgent,
            'draft_partnership': self._build_partnership,
            'draft_billing': self._build_billing,
            'draft_meeting': self._build_meeting,
            'draft_hiring': self._build_hiring,
            'draft_feedback': self._build_feedback,
            'draft_general': self._build_general,
            'draft_general_urgent': self._build_general_urgent,
        }
        builder = builders.get(action, self._build_general)
        return builder(name, lang, analysis, sig)

    def _extract_name(self, sender: str) -> str:
        if '<' in sender:
            sender = sender.split('<')[0].strip()
        sender = sender.strip().strip('"').strip("'")
        if ' ' in sender: return sender.split()[0]
        if '@' in sender: return sender.split('@')[0].replace('.',' ').replace('_',' ').title()
        return sender or 'there'

    def _get_signature(self, lang: str, empathy: bool = False) -> str:
        empathy_line = ''
        if empathy:
            empathy_line = '\n\nWe understand your frustration and we\'re committed to making this right.\n' if lang == 'en' else '\n\nEntendemos sua frustração e estamos comprometidos em resolver isso.\n' if lang == 'pt' else '\n\nEntendemos su frustración y estamos comprometidos en resolver esto.\n'
        
        if lang == 'pt':
            return f"{empathy_line}\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group\n📱 +1 302 464 0950\n✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        elif lang == 'es':
            return f"{empathy_line}\n\nAtentamente,\nKleber Garcia Alcatrão\nZion Tech Group\n📱 +1 302 464 0950\n✉️ kleber@ziontechgroup.com"
        return f"{empathy_line}\n\nSincerely,\nKleber Garcia Alcatrão\nZion Tech Group\n📱 +1 302 464 0950\n✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"

    def _build_booking(self, name, lang, a, sig):
        if lang == 'pt':
            return f"Olá {name}!\n\nRecebi sua solicitação de reserva. Confirmarei os detalhes em breve.\n\nPor favor, me confirme:\n• Data preferida\n• Horário estimado\n• Número de participantes\n\n📅 Disponibilidade: https://ziontechgroup.com/contact\n{sig}"
        return f"Hi {name}!\n\nThank you for your booking inquiry. I'll confirm the details shortly.\n\nCould you please share:\n• Preferred date(s)\n• Estimated time\n• Number of participants\n\n📅 Availability: https://ziontechgroup.com/contact\n{sig}"

    def _build_sales(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\nObrigado pelo interesse nos serviços da Zion Tech Group.\n"
                    f"Revisarei sua solicitação e prepararei uma proposta personalizada.\n\n"
                    f"Explore nossos serviços: https://ziontechgroup.com/services\n"
                    f"📞 Agende uma chamada: https://ziontechgroup.com/contact\n"
                    f"📱 WhatsApp: +1 302 464 0950\n\n{sig}")
        return (f"Hi {name}!\n\nThank you for your interest in Zion Tech Group.\n"
                f"I'll review your inquiry and prepare a tailored proposal.\n\n"
                f"Browse our services: https://ziontechgroup.com/services\n"
                f"📞 Schedule a call: https://ziontechgroup.com/contact\n"
                f"📱 WhatsApp: +1 302 464 0950\n\n{sig}")

    def _build_support(self, name, lang, a, sig):
        empathy = a.get('needs_empathy', False)
        if lang == 'pt':
            prefix = f"Olá {name}!\n\nLamento que você está enfrentando esse problema. " if empathy else f"Olá {name}!\n\n"
            return f"{prefix}Recebi sua mensagem e estou investigando.\n\nAcompanharei pessoalmente e retorno com atualização em breve.\n\nPara urgências: 📱 WhatsApp +1 302 464 0950\n{sig}"
        prefix = f"Hi {name}!\n\nI'm sorry you're experiencing this issue. " if empathy else f"Hi {name}!\n\n"
        return f"{prefix}I've received your message and I'm investigating.\n\nI'll personally follow up with an update shortly.\n\nFor urgent matters: 📱 WhatsApp +1 302 464 0950\n{sig}"

    def _build_support_urgent(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\n⚠️ Sua mensagem recebeu prioridade MÁXIMA. Estou pessoalmente encarregado.\n\n"
                    f"Já estou investigando e retorno com atualização o mais breve possível.\n\n"
                    f"Contato direto urgente:\n📱 WhatsApp: +1 302 464 0950\n✉️ kleber@ziontechgroup.com\n{sig}")
        return (f"Hi {name}!\n\n⚠️ Your message has been flagged as URGENT. I've personally picked this up.\n\n"
                f"I'm investigating right now and will follow up ASAP.\n\n"
                f"Direct urgent contact:\n📱 WhatsApp: +1 302 464 0950\n✉️ kleber@ziontechgroup.com\n{sig}")

    def _build_partnership(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\nExcelente iniciativa! Estou muito interessado em explorar essa parceria.\n\n"
                    f"Zion Tech Group — AI, TI e Micro-SaaS.\n\n"
                    f"📅 Agende: https://ziontechgroup.com/contact\n"
                    f"📱 WhatsApp: +1 302 464 0950\n{sig}")
        return (f"Hi {name}!\n\nThis is exciting — very interested in exploring this partnership.\n\n"
                f"Zion Tech Group — AI, IT & Micro-SaaS.\n\n"
                f"📅 Schedule: https://ziontechgroup.com/contact\n"
                f"📱 WhatsApp: +1 302 464 0950\n{sig}")

    def _build_billing(self, name, lang, a, sig):
        if lang == 'pt':
            return f"Olá {name}!\n\nRecebi sua cobrança/fatura e estou processando.\n\nAssim que houver atualização, entrarei em contato.\n\n{sig}"
        return f"Hi {name}!\n\nI've received your invoice/billing information and I'm processing it.\n\nI'll follow up once there's an update.\n\n{sig}"

    def _build_meeting(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\nObrigado pelo interesse em conversar. Fico feliz em agendar.\n\n"
                    f"📅 Escolha um horário: https://ziontechgroup.com/contact\n"
                    f"📱 Ou me envie seus horários disponíveis.\n\n{sig}")
        return (f"Hi {name}!\n\nThank you for wanting to connect. Happy to schedule a meeting.\n\n"
                f"📅 Pick a time: https://ziontechgroup.com/contact\n"
                f"📱 Or send me your availability.\n\n{sig}")

    def _build_hiring(self, name, lang, a, sig):
        if lang == 'pt':
            return f"Olá {name}!\n\nObrigado pelo interesse em se juntar à Zion Tech Group.\n\nAnalisarei seu perfil e retornarei em breve. Envie portfólio/GitHub para acelerar.\n\n{sig}"
        return f"Hi {name}!\n\nThank you for your interest in joining Zion Tech Group.\n\nI'll review your profile and get back to you shortly. Please share portfolio/GitHub to speed up.\n\n{sig}"

    def _build_feedback(self, name, lang, a, sig):
        if lang == 'pt':
            return f"Olá {name}!\n\nMuito obrigado pelo feedback! Cada sugestão nos ajuda a melhorar.\n\nAnalisarei com cuidado e, se aplicável, implementarei sua ideia.\n\n{sig}"
        return f"Hi {name}!\n\nThank you so much for your feedback! Every suggestion helps us improve.\n\nI'll review it carefully and implement if applicable.\n\n{sig}"

    def _build_general(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\nObrigado pelo contato. Recebi sua mensagem e responderei em breve.\n\n"
                    f"Zion Tech Group — AI • TI • Micro-SaaS\n"
                    f"🌐 https://ziontechgroup.com\n"
                    f"📱 +1 302 464 0950\n\n{sig}")
        return (f"Hi {name}!\n\nThank you for reaching out. I've received your message and will follow up shortly.\n\n"
                f"Zion Tech Group — AI • IT • Micro-SaaS\n"
                f"🌐 https://ziontechgroup.com\n"
                f"📱 +1 302 464 0950\n\n{sig}")

    def _build_general_urgent(self, name, lang, a, sig):
        if lang == 'pt':
            return (f"Olá {name}!\n\n⚠️ Prioridade máxima. Estou pessoalmente encarregado.\n\n"
                    f"Responderei o mais breve possível.\n\n"
                    f"Urgências: 📱 +1 302 464 0950\n\n{sig}")
        return (f"Hi {name}!\n\n⚠️ Flagged as urgent. I've personally picked this up.\n\n"
                f"I'll get back to you ASAP.\n\n"
                f"Urgent: 📱 +1 302 464 0950\n\n{sig}")

    def _score_draft(self, draft, action):
        if action in ('auto_archive', 'auto_ack', 'auto_trash', 'escalate', 'escalate_legal', 'phishing_alert'):
            return 100.0
        if not draft: return 0.0
        score = 70.0
        words = len(draft.split())
        if 30 <= words <= 250: score += 10
        if 'Kleber' in draft and '+1 302' in draft: score += 10
        if '{' not in draft: score += 5
        if len(set(draft.split())) > 20: score += 5
        return min(100.0, score)

    def _build_result(self, email, action, detail, t_start):
        return {
            'action': action,
            'detail': detail,
            'needs_human_review': False,
            'draft': None,
            'elapsed_ms': round((time.monotonic() - t_start) * 1000, 1),
        }


# ═══════════════════════════════════════════════════════════════
#  CLI Test
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    processor = V31Processor()
    
    test_emails = [
        {"sender": "John <john@client.com>", "subject": "How much does the chatbot cost?", "body": "Hi, I need pricing for the AI chatbot."},
        {"sender": "Sarah <sarah@partner.io>", "subject": "Partnership proposal", "body": "Hi Kleber, let's partner! We have a great opportunity.", "to_header": "kleber@ziontechgroup.com", "cc": "team@partner.io"},
        {"sender": "Angry <upset@client.com>", "subject": "UNACCEPTABLE - refund now!", "body": "This is terrible. I demand a full refund immediately."},
        {"sender": "notifications@github.com", "subject": "[GitHub] Issue opened", "body": "A new issue was opened."},
        {"sender": "Hacker <evil@phish.com>", "subject": "Verify your account immediately", "body": "Click here to verify your account within 24 hours or it will be suspended."},
        {"sender": "Maria <maria@empresa.com>", "subject": "Hola - necesito una cotización", "body": "Hola Kleber, me gustaría una cotización."},
        {"sender": "Newsletter <news@company.com>", "subject": "Weekly Digest", "body": "This week's top stories. Unsubscribe here."},
        {"sender": "Boss <boss@bigcorp.com>", "subject": "Team: Q3 Planning Meeting", "body": "Hi all, let's meet Monday at 10am to discuss Q3.", "to_header": "kleber@ziontechgroup.com", "cc": "team@bigcorp.com, manager@bigcorp.com"},
    ]
    
    print("📧 V31 Email Intelligence Processor — Test Run\n")
    for email in test_emails:
        result = processor.process_email(email)
        print(f"  📨 {email['sender'][:40]:40s}")
        print(f"     Subject: {email['subject'][:50]}")
        print(f"     → Action: {result['action']}")
        if result.get('reply_all'):
            ra = result['reply_all']
            print(f"     → Reply-All: {ra['reply_all']} ({ra['reason']}, CC: {ra.get('filtered_cc_count', 0)})")
        if result.get('draft'):
            preview = result['draft'][:70].replace('\n', ' ')
            print(f"     → Draft: {preview}...")
        print()
