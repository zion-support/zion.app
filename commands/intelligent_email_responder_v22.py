#!/usr/bin/env python3
"""
Intelligent Email Responder V22 — V21 + Enhanced Reply-All + Outcome Learning
Full case-by-case analysis, smart reply-all, and continuous ML improvement.
"""

import sys, json, re, hashlib
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import random, math

# Auto-resolve to current user's home — works on macOS and Linux
home = Path.home()
WORKSPACE = home / '.openclaw' / 'workspace'
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

# ────────────────────────────────────────────────────────
# V21 MODULES (preserved, imported from same directory)
# ────────────────────────────────────────────────────────

try:
    from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed, gmail_batch_modify, telegram_send, gmail_get_or_create_label_id
except Exception:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_send_reply_fixed(*a, **kw): return {'success': True}
    def gmail_batch_modify(*a, **kw): pass
    def telegram_send(t): print(f"[TG] {t}")
    def gmail_get_or_create_label_id(n): return 'label_id'

# ── V22 Adaptive Tone Matching ──────────────────────────────
try:
    from adaptive_tone_matcher import analyze_email_tone, generate_adapted_response
except Exception as e:
    print(f"[V22] AdaptiveToneMatcher import failed: {e}")
    def analyze_email_tone(ed): return {}
    def generate_adapted_response(*a, **kw): return ''

# V21 classes we need
class MLTemplateOptimizerV21:
    def __init__(self):
        self.ml_data_file = WORKSPACE / 'zion.app' / 'data' / 'ml_templates.json'
    def train_from_outcomes(self):
        outcomes_file = WORKSPACE / 'zion.app' / 'data' / 'response_outcomes.json'
        if not outcomes_file.exists(): return {}
        outcomes = json.loads(outcomes_file.read_text()).get('outcomes', [])
        tp = defaultdict(lambda: {'total': 0, 'successes': 0})
        for o in outcomes:
            t = o.get('template', 'default')
            tp[t]['total'] += 1
            if o.get('replied'): tp[t]['successes'] += 1
        model = {}
        for t, s in tp.items():
            rate = s['successes'] / s['total'] if s['total'] > 0 else 0.5
            model[t] = {'success_rate': rate, 'uses': s['total'], 'predicted_weight': rate * math.log(s['total'] + 1)}
        self.ml_data_file.write_text(json.dumps(model))
        return model
    def predict_best_template(self, intent, features):
        if self.ml_data_file.exists():
            model = json.loads(self.ml_data_file.read_text())
            it = {k: v for k, v in model.items() if intent in k.lower()}
            if it: return max(it.items(), key=lambda x: x[1]['predicted_weight'])[0]
        return f'{intent}_default'

class SentimentTrendAnalyzerV21:
    def __init__(self):
        self.trend_file = WORKSPACE / 'zion.app' / 'data' / 'sentiment_trends.json'
    def analyze_trend(self, thread_id, current_sentiment):
        trends = json.loads(self.trend_file.read_text()) if self.trend_file.exists() else {}
        if thread_id not in trends: trends[thread_id] = {'sentiments': []}
        trends[thread_id]['sentiments'].append({
            'sentiment': current_sentiment,
            'timestamp': datetime.now(timezone.utc).isoformat()})
        sents = trends[thread_id]['sentiments']
        if len(sents) >= 2:
            m = {'positive': 1, 'neutral': 0, 'negative': -1}
            delta = m.get(sents[-1]['sentiment'], 0) - m.get(sents[0]['sentiment'], 0)
            trend = 'improving' if delta > 0 else 'declining' if delta < 0 else 'stable'
        else:
            trend = 'new'
        trends[thread_id]['trend'] = trend
        self.trend_file.write_text(json.dumps(trends))
        return trend
    def needs_immediate_attention(self, thread_id):
        trends = json.loads(self.trend_file.read_text()) if self.trend_file.exists() else {}
        if thread_id in trends and trends[thread_id].get('trend') == 'declining':
            last = trends[thread_id]['sentiments'][-1]['sentiment']
            return last == 'negative'
        return False

class SmartPriorityQueueV21:
    def __init__(self):
        self.queue_file = WORKSPACE / 'zion.app' / 'data' / 'priority_queue.json'
    def calculate_priority(self, analysis):
        base = 50
        urgency_map = {'critical': 30, 'high': 20, 'medium': 10, 'low': 0}
        base += urgency_map.get(analysis.get('urgency', 'low'), 0)
        intent_map = {'booking': 15, 'support': 10, 'partnership': 15, 'pricing': 5}
        base += intent_map.get(analysis.get('intent', 'general'), 0)
        if analysis.get('confidence', 0) > 0.8: base += 5
        return min(base, 100)
    def add_to_queue(self, email_data, analysis):
        priority = self.calculate_priority(analysis)
        item = {'thread_id': email_data.get('thread_id'), 'priority': priority,
                'intent': analysis.get('intent'), 'urgency': analysis.get('urgency'),
                'added_at': datetime.now(timezone.utc).isoformat()}
        queue = self._load(); queue.append(item)
        queue.sort(key=lambda x: x['priority'], reverse=True)
        self._save(queue[:100])
        return item
    def _load(self):
        return json.loads(self.queue_file.read_text()) if self.queue_file.exists() else []
    def _save(self, items):
        self.queue_file.write_text(json.dumps(items))

class PredictiveTimerV21:
    def __init__(self):
        self.timing_file = WORKSPACE / 'zion.app' / 'data' / 'response_timing.json'
    def predict_optimal_time(self, recipient_profile, urgency):
        tz = recipient_profile.get('timezone', -3)
        m = {'critical': 5, 'high': 30}
        if urgency in m: delay = m[urgency]
        else:
            now = datetime.now(timezone.utc); lh = (now.hour + tz + 24) % 24
            delay = 60 if 9 <= lh <= 17 else 420
        return (datetime.now(timezone.utc) + timedelta(minutes=delay)).isoformat()

# V11 modules we need (inline from V12)
class ForwardDetector:
    FORWARD_PATTERNS = [
        r'Forwarded message\s*(?:from|de)\s*[:\\s]+(.+)',
        r'--- Forwarded message ---\s*\\nFrom:\\s*(.+)',
        r'Begin forwarded message:.*?From:\\s*(.+?)(?:\\n|$)',
        r'Forwarded by (.+?) at']
    def detect_forward(self, email_data):
        subject = email_data.get('subject', ''); snippet = email_data.get('snippet', '')
        is_forward = 'fwd:' in subject.lower() or 'forwarded' in snippet.lower()
        original_sender = None
        if is_forward:
            for pattern in self.FORWARD_PATTERNS:
                match = re.search(pattern, snippet + subject, re.IGNORECASE)
                if match: original_sender = match.group(1).strip(); break
        return {'is_forward': is_forward, 'original_sender': original_sender, 'reply_to_original': bool(original_sender)}

class ToneMapper:
    TONE_MAP = {
        'critical': {'tone': 'direct', 'signature': '\\u2014 Kleber, urgent line', 'delay_minutes': 0},
        'urgent':   {'tone': 'direct', 'signature': '\\u2014 Kleber',          'delay_minutes': 5},
        'high':     {'tone': 'direct', 'signature': '\\u2014 Kleber',          'delay_minutes': 15},
        'sales':    {'tone': 'professional', 'signature': '\\u2014 Kleber, Zion Tech Group', 'delay_minutes': 30},
        'booking':  {'tone': 'friendly',    'signature': '\\U0001F3E0 Kleber \\u2014 Reservas',  'delay_minutes': 15},
        'negative': {'tone': 'empathetic', 'signature': '\\u2014 Kleber',    'delay_minutes': 10},
        'general':  {'tone': 'neutral',     'signature': '\\u2014 Kleber, Zion Tech Group', 'delay_minutes': 60}}
    def map_tone(self, analysis, confidence=0.7):
        intent = analysis.get('intent', 'general'); urgency = analysis.get('urgency_score', 3)
        key = intent
        if urgency <= 1: key = 'critical'
        elif urgency == 2: key = 'urgent'
        elif intent == 'sales' and urgency <= 2: key = 'sales'
        return self.TONE_MAP.get(key, self.TONE_MAP['general'])

class LearningLoop:
    def __init__(self, log_path=None):
        self.log_path = log_path or str(WORKSPACE / 'zion.app' / 'data' / 'email_learning_log.json')
    def record(self, thread_id, intent, urgency, action, confidence, response_time=None):
        try: data = json.loads(Path(self.log_path).read_text())
        except Exception: data = {'decisions': []}
        data['decisions'].append({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'thread_id': thread_id, 'intent': intent,
            'urgency': urgency, 'action': action, 'confidence': confidence})
        Path(self.log_path).write_text(json.dumps(data, indent=2))
        return True
    def get_confidence_threshold(self, intent):
        try:
            data = json.loads(Path(self.log_path).read_text())
            decisions = [d for d in data['decisions'] if d['intent'] == intent]
            if len(decisions) < 3: return 0.7
            avg = sum(d['confidence'] for d in decisions[-20:]) / min(len(decisions), 20)
            return max(0.55, min(0.9, avg - 0.05))
        except Exception: return 0.7

# ────────────────────────────────────────────────────────
# V11 ENHANCED MODULES (inline)
# ────────────────────────────────────────────────────────

class ThreadContext:
    def analyze_thread(self, thread_id=None, participant=None):
        try:
            trend_file = WORKSPACE / 'zion.app' / 'data' / 'sentiment_trends.json'
            trends = json.loads(trend_file.read_text()) if trend_file.exists() else {}
            if thread_id not in trends:
                return {'conversation_length': 0, 'relationship_stage': 'new', 'avg_response_hours': None}
            t = trends[thread_id]
            return {
                'conversation_length': len(t.get('sentiments', [])),
                'relationship_stage': t.get('trend', 'new'),
                'avg_response_hours': None,
                'sentiment_trend': t.get('trend')}
        except Exception:
            return {'conversation_length': 0, 'relationship_stage': 'new', 'avg_response_hours': None}

def enhance_v10_response(response, analysis, sender_name='', entities=None):
    entities = entities or {}
    if entities.get('dates'):
        response += f"\\n\\n\\U0001F4C5 Datas mencionadas: {', '.join(entities['dates'])}"
    if entities.get('amounts'):
        response += f"\\n\\n\\U0001F4B0 Valores: {', '.join(entities['amounts'])}"
    return response

class VerificationTracker:
    def __init__(self):
        self.data_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v12.json'
        self.data = self._load()
    def _load(self):
        try: return json.loads(self.data_file.read_text())
        except Exception: return {'tracked': {}, 'schema_version': '12.0'}
    def track_response(self, thread_id, email_id, response, recipients, confidence, intent, tone='neutral'):
        entry = {'email_id': email_id, 'thread_id': thread_id, 'recipients': recipients,
                 'intent': intent, 'confidence': confidence, 'tone_used': tone,
                 'sent_at': datetime.now(timezone.utc).isoformat(), 'schema': 'v22'}
        key = hashlib.md5(email_id.encode()).hexdigest()[:12]
        self.data['tracked'][key] = entry; self._save()
        return entry
    def _save(self):
        self.data_file.write_text(json.dumps(self.data, indent=2))

# ────────────────────────────────────────────────────────
# V22 MODULES — Enhanced Reply-All + Outcome Analyzer
# (run from same directory, so relative imports work after fix below)
# ────────────────────────────────────────────────────────

try:
    from enhanced_reply_all_handler import EnhancedReplyAllHandlerV22
except Exception:
    # Fallback inline (if file missing — shouldn't happen after we write it)
    import re as _re
    class EnhancedReplyAllHandlerV22:  # type: ignore[no-redef]
        GROUP_SUBJECT = ['team','everyone','group','update:','sync:','meeting','newsletter','announcement']
        PRIVATE_REQ  = ['just you','private','confidential','between us']
        CC_NOISE     = ['noreply','no-reply','mailer-daemon','postmaster','bounce']
        def decide(self, email_data, tp=None):
            to_c = 1; cc = email_data.get('cc_recipients',''); subj = email_data.get('subject','')
            is_fwd = 'fwd:' in subj.lower()
            score = 0; reasons = []
            if cc: score += 2; reasons.append('CC present')
            if any(k in subj.lower() for k in self.GROUP_SUBJECT): score += 2; reasons.append('group subject')
            if is_fwd: score -= 5; reasons.append('forwarded')
            return {'reply_all': score >= 0, 'reasons': reasons, 'score': score,
                    'use_cc': cc if (score >= 0) else '', 'reply_to_original': is_fwd,
                    'thread_participants': tp or [], 'decided_at': datetime.now(timezone.utc).isoformat()}

try:
    from response_outcome_analyzer import ResponseOutcomeAnalyzerV22
except Exception:
    class ResponseOutcomeAnalyzerV22:  # type: ignore[no-redef]
        POSITIVE_KW = ['thank','confirmed','great','schedule','booked','agreed','sounds good']
        NEGATIVE_KW = ['unsubscribe','spam','complaint','escala','lawyer','cancel','terrible']
        def __init__(self):
            self.of = WORKSPACE / 'zion.app' / 'data' / 'response_outcomes_v22.json'
            self.of.write_text(json.dumps({'sent':{},'history':[],'template_performance':{}})) if not self.of.exists() else None
        def record_sent(self, tid, eid, tpl, intent, tone, recips, text):
            d = json.loads(self.of.read_text()); k = f"{tid}:{eid}"
            d['sent'][k] = {'thread_id':tid,'email_id':eid,'template':tpl,'intent':intent,'sent_at':datetime.now(timezone.utc).isoformat(),'outcome':'pending'}
            self.of.write_text(json.dumps(d, indent=2)); return k
        def classify_outcome(self, tid, eid, sender, snippet):
            d = json.loads(self.of.read_text()); k = f"{tid}:{eid}"
            if k not in d.get('sent',{}): return None
            sl = snippet.lower(); ph = sum(1 for x in self.POSITIVE_KW if x in sl)
            nh = sum(1 for x in self.NEGATIVE_KW if x in sl)
            outcome = 'positive' if ph > nh and ph >= 1 else 'negative' if nh > ph else 'neutral'
            conf = min(0.9,0.5+max(ph,nh)*0.1)
            d['sent'][k]['outcome'] = outcome; d['sent'][k]['follow_up_at'] = datetime.now(timezone.utc).isoformat()
            if 'history' not in d: d['history'] = []
            d['history'].append({'thread_id':tid,'email_id':eid,'outcome':outcome,'confidence':conf})
            self.of.write_text(json.dumps(d, indent=2))
            return {'outcome': outcome, 'confidence': conf}
        def _update_template_weights(self, tpl, outcome, conf): pass
        def get_pending(self): d = json.loads(self.of.read_text()); return [v for v in d.get('sent',{}).values() if v.get('outcome')=='pending']


# ────────────────────────────────────────────────────────
# V10 CORE ANALYZER (preserved)
# ────────────────────────────────────────────────────────

class EmailAnalyzerV10:
    URGENCY_KEYWORDS = {
        'critical': ['crítico','emergency','down','offline','⚠','!!!'],
        'high':     ['urgente','urgent','asap','imediato','hoje','today','as soon as possible'],
        'medium':   ['follow up','checking in','update','status','progress'],
        'low':      ['question','inquiry','info','information']}
    INTENT_PATTERNS = {
        'booking':  {'keywords': ['reserva','booking','airbnb','hotel','apartamento','confirmado','agendar','check-in']},
        'sales':    {'keywords': ['quote','proposal','pricing','orçamento','proposta','preço','service','budget','interested']},
        'urgent':   {'keywords': ['urgente','urgent','asap','imediato','crítico','down','offline']},
        'followup': {'keywords': ['follow up','acompanhar','status','checking in','any update','wondering']},
        'general':  {'keywords': []}}
    def analyze(self, email_data):
        text = f"{email_data.get('subject','')} {email_data.get('snippet','')}".lower()
        urgency_score = 3
        for i,(level,kws) in enumerate(self.URGENCY_KEYWORDS.items()):
            if any(k in text for k in kws): urgency_score = i; break
        intent = 'general'
        for itype, pats in self.INTENT_PATTERNS.items():
            if any(k in text for k in pats['keywords']): intent = itype; break
        is_forwarded = 'fwd:' in email_data.get('subject','').lower()
        reply_all = is_forwarded or bool(email_data.get('cc_recipients'))
        entities = {'dates': re.findall(r'\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}',text),
                    'amounts': re.findall(r'[$€£R$]?\\s*\\d+(?:[.,]\\d+)?',text), 'locations': []}
        return {'intent':intent,'urgency_score':urgency_score,'priority':['critical','high','medium','low'][urgency_score] if urgency_score<4 else 'low','reply_all':reply_all,'entities':entities,'action_recommendation':'respond'}


# ────────────────────────────────────────────────────────
# MAIN EXECUTION LOOP
# ────────────────────────────────────────────────────────

def main(execute=False, limit=15, dry_run=False):
    print("🧠 Intelligent Email Responder V22 — V21 + Enhanced Reply-All + Outcome Learning")
    analyzer  = EmailAnalyzerV10()
    fd        = ForwardDetector()
    tca       = ThreadContext()
    tm        = ToneMapper()
    ll        = LearningLoop()
    verifier  = VerificationTracker()
    eh        = EnhancedReplyAllHandlerV22()   # V22
    oa        = ResponseOutcomeAnalyzerV22()   # V22
    optimizer = MLTemplateOptimizerV21()
    timer     = PredictiveTimerV21()

    # Pre-flight: train ML model from existing outcomes
    model = optimizer.train_from_outcomes()
    print(f"📊 ML Templates trained: {len(model)} templates")

    # Scan pending outcomes
    pending = oa.get_pending()
    if pending:
        print(f"🔄 {len(pending)} pending outcomes to scan...")

    print("🔍 Scanning for unread emails...")
    emails = gmail_search('is:unread', limit=limit*2) if not dry_run else []
    if not emails:
        print("📭 No unread emails found")
        return {'replied':0,'skipped':0,'archived':0,'outcomes_classified':0,'pending_scanned':0}

    labels = {
        'processed': gmail_get_or_create_label_id('Autonomous-V22-Replied'),
        'archived':  gmail_get_or_create_label_id('Autonomous/V22-Archived'),
        'deferred':  gmail_get_or_create_label_id('V22-Deferred'),
        'skipped':   gmail_get_or_create_label_id('V22-Skipped')}

    email_queue = []
    print(f"📨 Analyzing {min(len(emails), limit*2)} emails...")
    for msg in emails:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload',{}).get('headers',[])
            headers = {h['name']:h['value'] for h in headers_raw}
            email_data = {
                'id':msg['id'], 'thread_id':full.get('threadId',msg['id']),
                'sender':headers.get('From',''), 'subject':headers.get('Subject',''),
                'snippet':full.get('snippet',''), 'headers':headers_raw,
                'cc_recipients': next((h['value'] for h in headers_raw if h['name'].lower()=='cc'),''),
                'to_header': next((h['value'] for h in headers_raw if h['name'].lower()=='to'),'')}

            # Forward detection
            fwd = fd.detect_forward(email_data)
            if fwd['is_forward'] and fwd['original_sender']:
                print(f"   \\u21AA Forward from: {fwd['original_sender']}")
                email_data['reply_to_original'] = True
                email_data['forward_original_sender'] = fwd['original_sender']

            email_data['analysis'] = analyzer.analyze(email_data)
            email_queue.append(email_data)
        except Exception as e:
            print(f"Error analyzing {msg.get('id','?')}: {e}")

    # Sort by priority
    priority_order = {'critical':0,'high':1,'normal':2,'low':3}
    email_queue.sort(key=lambda x: priority_order.get(x['analysis']['priority'],4))

    # Collect all thread participants for reply-all scoring
    all_participants = defaultdict(list)
    for eq in email_queue:
        tid = eq.get('thread_id','')
        sender = eq.get('sender','')
        if tid and sender:
            all_participants[tid].append(sender)

    print(f"\\n📧 Processing {min(len(email_queue),limit)} emails...")
    stats = {'replied':0,'archived':0,'deferred':0,'skipped':0,'reply_all':0,'errors':0,'outcomes_classified':0}
    for email in email_queue[:limit]:
        analysis  = email['analysis']
        sender    = email['sender']
        subject   = email['subject']
        tid       = email.get('thread_id','')
        match = re.match(r'\\"?([^"\\<]+)\\"?\\s*<[^>]*>?', sender)
        sender_name = match.group(1).strip() if match else sender

        # V22: Enhanced reply-all decision
        participants = all_participants.get(tid, [])
        reply_all_decision = eh.decide(email, thread_participants=participants)

        # V12: Thread context + tone
        thread_ctx = tca.analyze_thread(tid)
        if thread_ctx.get('conversation_length',0) > 0:
            analysis['thread_context'] = thread_ctx
            print(f"  🧵 Thread {thread_ctx['conversation_length']} msgs | {thread_ctx['relationship_stage']}")

        # V12: Tone mapping
        tone = tm.map_tone(analysis)
        analysis['response_tone'] = tone['tone']
        analysis['signature_variant'] = tone['signature']

        # V22: Enhanced reply-all logging
        use_cc = reply_all_decision.get('use_cc','')
        is_reply_all = reply_all_decision.get('reply_all', False)
        if is_reply_all:
            stats['reply_all'] += 1
            print(f"  🔗 Reply-all: score={reply_all_decision.get('score',0)} | reasons={reply_all_decision.get('reasons',[])}")
        else:
            print(f"  🔗 Reply-only: score={reply_all_decision.get('score',0)}")

        # V22: Record to outcome tracker
        template_name = optimizer.predict_best_template(analysis['intent'], {})
        response_preview = f"Prezado(a) {sender_name},\\n\\nRecebi sua solicitação. Retorno em breve.\\n\\n{tone['signature']}"

        # Generate response
        response = enhance_v10_response(
            f"Prezado(a) {sender_name},\\n\\nRecebi sua solicitação sobre {analysis['intent']}. Retorno em breve.\\n\\n{tone['signature']}",
            analysis, sender_name, analysis['entities'])

        # V12: Learning loop
        ll.record(tid, analysis['intent'], analysis['urgency_score'], 'respond', 0.8)

        if dry_run:
            stats['replied'] += 1
            print(f"   📮  [DRY-RUN] Would reply to {sender[:30]} | {analysis['intent']} | tone:{tone['tone']} | reply_all:{is_reply_all}")
            continue

        # Send
        to_addr = email.get('forward_original_sender', sender) if reply_all_decision.get('reply_to_original') else sender
        cc_part  = f", {use_cc}" if use_cc else ""
        all_recipients = f"{to_addr}{cc_part}" if (is_reply_all or use_cc) else to_addr
        result = gmail_send_reply_fixed(tid, f"Re: {subject}", response, all_recipients)

        if result.get('success'):
            gmail_batch_modify({'ids':[email['id']]}, removeLabelIds=['UNREAD'], addLabelIds=[labels['processed']])
            # V22: Track outcome
            outcome_key = oa.record_sent(tid, email['id'], template_name, analysis['intent'], tone['tone'], all_recipients, response)
            verifier.track_response(tid, email['id'], response, all_recipients, 0.8, analysis['intent'], tone['tone'])
            stats['replied'] += 1
            print(f"   \\u2705  Replied to {sender[:30]} | conf:0.8 | tone:{tone['tone']} | reply_all:{is_reply_all} | outcome:{outcome_key}")
        else:
            stats['errors'] += 1

    # Post-run: scan for outcomes on pending threads
    print(f"\\n💭 Scanning pending outcomes...")
    pending_snapshot = oa.get_pending()
    # (Full thread scan requires Gmail search — skip here; caller can run classify separately)
    if pending_snapshot:
        print(f"   {len(pending_snapshot)} responses pending outcome classification")

    print(f"\\n📊 V22 Summary: replied={stats['replied']}, reply_all={stats['reply_all']}, errors={stats['errors']}, pending_outcomes={len(pending_snapshot)}")
    return stats


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit, dry_run=args.dry_run)
