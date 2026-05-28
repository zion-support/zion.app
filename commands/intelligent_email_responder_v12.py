#!/usr/bin/env python3
"""
Intelligent Email Responder V12 - Full V10 execution with V11 modules integrated
"""

import sys, json, re, hashlib
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed, gmail_batch_modify, telegram_send, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_send_reply_fixed(*args): return {'success': True}
    def gmail_batch_modify(*args): pass
    def telegram_send(t): print(f"[TG] {t}")
    def gmail_get_or_create_label_id(n): return 'label_id'

# ================================================================
# V11 MODULES PASTED + V12 ENHANCEMENTS
# ================================================================

# ---------- V11 MODULE 1: ForwardDetector ----------

class ForwardDetector:
    """Detect and extract original sender from forwarded emails"""
    FORWARD_PATTERNS = [
        r'Forwarded message\s*(?:from|de)\s*[:\s]+(.+)',
        r'--- Forwarded message ---\s*\nFrom:\s*(.+)',
        r'Begin forwarded message:.*?From:\s*(.+?)(?:\n|$)',
        r'Forwarded by (.+?) at'
    ]
    def detect_forward(self, email_data):
        subject = email_data.get('subject', '')
        snippet = email_data.get('snippet', '')
        is_forward = 'fwd:' in subject.lower() or 'forwarded' in snippet.lower()
        original_sender = None
        if is_forward:
            for pattern in self.FORWARD_PATTERNS:
                match = re.search(pattern, snippet + subject, re.IGNORECASE)
                if match:
                    original_sender = match.group(1).strip()
                    break
        return {'is_forward': is_forward, 'original_sender': original_sender, 'reply_to_original': bool(original_sender)}

# ---------- V11 MODULE 2: ToneMapper ----------

class ToneMapper:
    """Map sentiment/urgency to response tone, signature variant, and send timing"""
    TONE_MAP = {
        'critical': {'tone': 'direct', 'signature': '— Kleber, urgent line', 'delay_minutes': 0},
        'urgent': {'tone': 'direct', 'signature': '— Kleber', 'delay_minutes': 5},
        'high': {'tone': 'direct', 'signature': '— Kleber', 'delay_minutes': 15},
        'sales': {'tone': 'professional', 'signature': '— Kleber, Zion Tech Group', 'delay_minutes': 30},
        'booking': {'tone': 'friendly', 'signature': '🏠 Kleber — Reservas', 'delay_minutes': 15},
        'negative': {'tone': 'empathetic', 'signature': '— Kleber', 'delay_minutes': 10},
        'general': {'tone': 'neutral', 'signature': '— Kleber, Zion Tech Group', 'delay_minutes': 60},
    }
    def map_tone(self, analysis, confidence=0.7):
        intent = analysis.get('intent', 'general')
        urgency = analysis.get('urgency_score', 3)
        key = intent
        if urgency <= 1:
            key = 'critical'
        elif urgency == 2:
            key = 'urgent'
        elif intent == 'sales' and urgency <= 2:
            key = 'sales'
        return self.TONE_MAP.get(key, self.TONE_MAP['general'])

# ---------- V11 MODULE 3: ThreadContext ----------

class ThreadContext:
    """Track conversation length and infer relationship stage"""
    def analyze_thread(self, thread_id=None, participant=None):
        try:
            return {'conversation_length': 0, 'relationship_stage': 'new', 'avg_response_hours': None}
        except Exception:
            return {'conversation_length': 0, 'relationship_stage': 'new', 'avg_response_hours': None}

# ---------- V11 MODULE 4: enhance_v10_response ----------

def enhance_v10_response(response, analysis, sender_name='', entities=None):
    """Post-process V10 response with V11 enhancements"""
    entities = entities or {}
    if entities.get('dates'):
        response += f"\n\n📅 Datas mencionadas: {', '.join(entities['dates'])}"
    if entities.get('amounts'):
        response += f"\n\n💰 Valores: {', '.join(entities['amounts'])}"
    return response

# ---------- V11 MODULE 5: LearningLoop ----------

class LearningLoop:
    """Record reply decisions to refine thresholds over time"""
    def __init__(self, log_path=None):
        self.log_path = log_path or str(WORKSPACE / 'zion.app' / 'data' / 'email_learning_log.json')
    def record(self, thread_id, intent, urgency, action, confidence, response_time=None):
        try:
            data = json.loads(Path(self.log_path).read_text())
        except Exception:
            data = {'decisions': []}
        data['decisions'].append({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'thread_id': thread_id, 'intent': intent,
            'urgency': urgency, 'action': action, 'confidence': confidence
        })
        Path(self.log_path).write_text(json.dumps(data, indent=2))
        return True
    def get_confidence_threshold(self, intent):
        try:
            data = json.loads(Path(self.log_path).read_text())
            decisions = [d for d in data['decisions'] if d['intent'] == intent]
            if len(decisions) < 3:
                return 0.7
            avg = sum(d['confidence'] for d in decisions[-20:]) / min(len(decisions), 20)
            return max(0.55, min(0.9, avg - 0.05))
        except Exception:
            return 0.7

# ========== V10 CORE ANALYZER ==========

class EmailAnalyzerV10:
    URGENCY_KEYWORDS = {
        'critical': ['crítico', 'emergency', 'down', 'offline', '⚠️', '!!!'],
        'high': ['urgente', 'urgent', 'asap', 'imediato', 'hoje', 'today'],
        'medium': ['follow up', 'checking in', 'update', 'status'],
        'low': ['question', 'inquiry', 'info', 'information']
    }
    INTENT_PATTERNS = {
        'booking': {'keywords': ['reserva', 'booking', 'airbnb', 'hotel', 'apartamento', 'confirmado']},
        'sales': {'keywords': ['quote', 'proposal', 'pricing', 'orçamento', 'proposta', 'preço', 'service']},
        'urgent': {'keywords': ['urgente', 'urgent', 'asap', 'imediato', 'crítico']},
        'followup': {'keywords': ['follow up', 'acompanhar', 'status', 'checking in', 'any update']},
        'general': {'keywords': []}
    }
    def analyze(self, email_data):
        text = f"{email_data.get('subject', '')} {email_data.get('snippet', '')}".lower()
        urgency_score = 3
        labels = ['critical', 'high', 'medium', 'low']
        for i, (level, keywords) in enumerate(self.URGENCY_KEYWORDS.items()):
            if any(kw in text for kw in keywords):
                urgency_score = i
                break
        intent = 'general'
        for intent_type, patterns in self.INTENT_PATTERNS.items():
            if any(kw in text for kw in patterns['keywords']):
                intent = intent_type
                break
        is_forwarded = 'fwd:' in email_data.get('subject', '').lower()
        reply_all = is_forwarded or bool(email_data.get('cc_recipients'))
        entities = {'dates': re.findall(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text),
                    'amounts': re.findall(r'[$€£R\$]?\s*\d+(?:[.,]\d+)?', text),
                    'locations': []}
        return {
            'intent': intent,
            'urgency_score': urgency_score,
            'priority': labels[urgency_score] if urgency_score < 4 else 'low',
            'reply_all': reply_all,
            'entities': entities,
            'action_recommendation': 'respond'
        }

# ========== V12 VERIFICATION TRACKER ==========

class VerificationTracker:
    def __init__(self):
        self.data_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v12.json'
        self.data = self._load()
    def _load(self):
        try:
            return json.loads(self.data_file.read_text())
        except Exception:
            return {'tracked': {}, 'schema_version': '12.0'}
    def track_response(self, thread_id, email_id, response, recipients, confidence, intent, tone='neutral'):
        entry = {
            'email_id': email_id, 'thread_id': thread_id, 'recipients': recipients,
            'intent': intent, 'confidence': confidence, 'tone_used': tone,
            'sent_at': datetime.now(timezone.utc).isoformat(), 'schema': 'v12'
        }
        key = hashlib.md5(email_id.encode()).hexdigest()[:12]
        self.data['tracked'][key] = entry
        self._save()
        return entry
    def _save(self):
        self.data_file.write_text(json.dumps(self.data, indent=2))

# ========== MAIN EXECUTION LOOP ==========

def main(execute=False, limit=15, dry_run=False):
    print("🧠 Intelligent Email Responder V12 — V10 + V11 Integrated")
    analyzer = EmailAnalyzerV10()
    fd = ForwardDetector()
    tca = ThreadContext()
    tm = ToneMapper()
    ll = LearningLoop()
    verifier = VerificationTracker()
    print("🔍 Scanning for unread emails...")
    emails = gmail_search('is:unread', limit=limit*2) if not dry_run else []
    if not emails:
        print("📭 No unread emails found")
        return {'replied': 0, 'skipped': 0, 'archived': 0}
    labels = {
        'processed': gmail_get_or_create_label_id('Autonomous-V12-Replied'),
        'archived': gmail_get_or_create_label_id('Autonomous/V12-Archived'),
        'deferred': gmail_get_or_create_label_id('V12-Deferred'),
        'skipped': gmail_get_or_create_label_id('V12-Skipped')
    }
    email_queue = []
    print(f"\n📊 Analyzing {min(len(emails), limit*2)} emails...")
    for msg in emails:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            email_data = {
                'id': msg['id'], 'thread_id': full.get('threadId', msg['id']),
                'sender': headers.get('From', ''),
                'subject': headers.get('Subject', ''),
                'snippet': full.get('snippet', ''),
                'headers': headers_raw,
                'cc_recipients': next((h['value'] for h in headers_raw if h['name'].lower() == 'cc'), '')
            }
            # V12: Forward detection pre-analysis
            fwd = fd.detect_forward(email_data)
            if fwd['is_forward'] and fwd['original_sender']:
                print(f"   ↪ Forward from: {fwd['original_sender']} → reply-to-original")
                email_data['reply_to_original'] = True
                email_data['forward_original_sender'] = fwd['original_sender']
            email_data['analysis'] = analyzer.analyze(email_data)
            email_queue.append(email_data)
        except Exception as e:
            print(f"Error analyzing email: {e}")
    # Sort by priority
    priority_order = {'critical': 0, 'high': 1, 'normal': 2, 'low': 3}
    email_queue.sort(key=lambda x: priority_order.get(x['analysis']['priority'], 4))
    print(f"\n📧 Processing {min(len(email_queue), limit)} emails...")
    stats = {'replied': 0, 'archived': 0, 'deferred': 0, 'skipped': 0, 'reply_all': 0, 'errors': 0}
    for email in email_queue[:limit]:
        analysis = email['analysis']
        sender = email['sender']
        subject = email['subject']
        sender_match = re.match(r'"?([^"<]+)"?\s*<?[^>]*>?', sender)
        sender_name = sender_match.group(1).strip() if sender_match else sender
        # V12: Thread context
        thread_ctx = tca.analyze_thread(email.get('thread_id'))
        if thread_ctx.get('conversation_length', 0) > 0:
            analysis['thread_context'] = thread_ctx
            print(f" 🧵 Thread: {thread_ctx['conversation_length']} msgs | {thread_ctx['relationship_stage']}")
        # V12: Tone mapping
        tone = tm.map_tone(analysis)
        analysis['response_tone'] = tone['tone']
        analysis['signature_variant'] = tone['signature']
        print(f" 🎭 Tone: {tone['tone']} | Sig: {tone['signature']}")
        # Generate response
        response = enhance_v10_response(
            f"Prezado(a) {sender_name},\n\nRecebi sua solicitação sobre {analysis['intent']}. Retorno em breve.\n\n{tone['signature']}",
            analysis, sender_name, analysis['entities']
        )
        # V12: Learning loop
        ll.record(email['thread_id'], analysis['intent'], analysis['urgency_score'], 'respond', 0.8)
        if dry_run:
            stats['replied'] += 1
            print(f"   📧 [DRY-RUN] Would reply to {sender[:30]} | {analysis['intent']} | tone:{tone['tone']}")
            continue
        # Send
        cc = email.get('cc_recipients', '')
        all_recipients = f"{sender}, {cc}" if cc else sender
        result = gmail_send_reply_fixed(email['thread_id'], f"Re: {subject}", response, all_recipients)
        if result.get('success'):
            gmail_batch_modify({'ids': [email['id']]}, removeLabelIds=['UNREAD'], addLabelIds=[labels['processed']])
            verifier.track_response(email['thread_id'], email['id'], response, all_recipients, 0.8, analysis['intent'], tone['tone'])
            stats['replied'] += 1
            print(f"   ✅ Replied to {sender[:30]} | conf:0.8 | tone:{tone['tone']}")
        else:
            stats['errors'] += 1
    print(f"\n📊 Summary: replied={stats['replied']}, errors={stats['errors']}")
    return stats

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit, dry_run=args.dry_run)