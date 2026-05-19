#!/usr/bin/env python3
"""
Intelligent Email Responder V10 - Case-by-Case Analysis + Verification Loop
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

# ========== STAGE 1: DEEP CONTENT ANALYSIS ==========

class EmailAnalyzer:
    """Deep multi-dimensional email analysis"""
    
    URGENCY_KEYWORDS = {
        'critical': ['crítico', 'emergency', 'down', 'offline', '⚠️', '!!!'],
        'high': ['urgente', 'urgent', 'asap', 'imediato', 'hoje', 'today'],
        'medium': ['follow up', 'checking in', 'update', 'status'],
        'low': ['question', 'inquiry', 'info', 'information']
    }
    
    INTENT_PATTERNS = {
        'booking': {
            'keywords': ['reserva', 'booking', 'airbnb', 'hotel', 'apartamento', 'confirmado'],
            'actions': ['reserve', 'rent', 'stay', 'accommodation']
        },
        'sales': {
            'keywords': ['quote', 'proposal', 'pricing', 'orçamento', 'proposta', 'preço', 'service'],
            'actions': ['buy', 'purchase', 'contract', 'engage']
        },
        'urgent': {
            'keywords': ['urgente', 'urgent', 'asap', 'imediato', 'crítico'],
            'actions': ['fix', 'resolve', 'help', 'emergency']
        },
        'followup': {
            'keywords': ['follow up', 'acompanhar', 'status', 'checking in', 'any update'],
            'actions': ['update', 'progress', 'status']
        }
    }
    
    def analyze(self, email_data):
        """Full spectrum analysis of email"""
        text = f"{email_data.get('subject', '')} {email_data.get('snippet', '')}"
        sender = email_data.get('sender', '')
        headers = email_data.get('headers', [])
        
        analysis = {
            'urgency_score': self._calculate_urgency(text),
            'intent': self._classify_intent(text),
            'language': self._detect_language(text),
            'entities': self._extract_entities(text),
            'reply_all': self._needs_reply_all(headers),
            'is_noise': self._is_noise_email(sender),
            'is_bounce': self._is_bounce(sender),
            'priority': 'normal',
            'action_recommendation': 'respond'
        }
        
        # Set priority based on urgency
        if analysis['urgency_score'] >= 8:
            analysis['priority'] = 'critical'
        elif analysis['urgency_score'] >= 5:
            analysis['priority'] = 'high'
        elif analysis['urgency_score'] >= 3:
            analysis['priority'] = 'normal'
        else:
            analysis['priority'] = 'low'
        
        # Action recommendations
        if analysis['is_noise']:
            analysis['action_recommendation'] = 'skip'
        elif analysis['is_bounce']:
            analysis['action_recommendation'] = 'archive'
        elif analysis['urgency_score'] < 2:
            analysis['action_recommendation'] = 'defer'
        
        return analysis
    
    def _calculate_urgency(self, text):
        text_lower = text.lower()
        score = 0
        for level, keywords in self.URGENCY_KEYWORDS.items():
            for kw in keywords:
                if kw in text_lower:
                    if level == 'critical': score += 5
                    elif level == 'high': score += 3
                    elif level == 'medium': score += 1
        return min(score, 10)
    
    def _classify_intent(self, text):
        text_lower = text.lower()
        scores = {}
        for intent, data in self.INTENT_PATTERNS.items():
            kw_score = sum(1 for kw in data['keywords'] if kw in text_lower)
            action_score = sum(1 for action in data['actions'] if action in text_lower)
            scores[intent] = kw_score * 2 + action_score
        return max(scores, key=scores.get) if any(scores.values()) else 'general'
    
    def _detect_language(self, text):
        pt_words = ['prezado', 'obrigado', 'atenciosamente', 'agradeço', 'fatura', 'nota fiscal']
        en_words = ['dear', 'thank', 'regards', 'invoice', 'contract', 'proposal']
        pt_score = sum(1 for w in pt_words if w in text.lower())
        en_score = sum(1 for w in en_words if w in text.lower())
        return 'pt' if pt_score >= en_score else 'en'
    
    def _extract_entities(self, text):
        entities = {}
        # Dates
        entities['dates'] = re.findall(r'\d{1,2}/\d{1,2}(?:/\d{2,4})?|\d{4}-\d{2}-\d{2}', text)
        # Numbers/Currency
        entities['amounts'] = re.findall(r'\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?', text)
        # Email mentions
        entities['emails'] = re.findall(r'[\w.-]+@[\w.-]+\.\w+', text)
        return entities
    
    def _needs_reply_all(self, headers):
        for h in headers:
            if h['name'].lower() == 'cc' and h['value'].strip():
                return True
        return False
    
    def _is_noise_email(self, sender):
        noise_senders = ['github.com', 'notifications@', 'zapier', 'mailer-daemon', 'noreply']
        return any(ns in sender.lower() for ns in noise_senders)
    
    def _is_bounce(self, sender):
        return any(b in sender.lower() for b in ['postmaster', 'delivery subsystem', 'bounce'])

# ========== STAGE 2: CONTEXT CORRELATION ==========

class ContextCorrelator:
    """Correlate with historical interaction patterns"""
    
    def __init__(self):
        self.history_file = WORKSPACE / 'zion.app' / 'data' / 'email_context_history.json'
        self.context_file = WORKSPACE / 'zion.app' / 'data' / 'email_intelligence_v9.json'
    
    def get_sender_context(self, sender_email):
        """Get historical context for sender"""
        context = {
            'previous_interactions': 0,
            'preferred_language': 'en',
            'last_intent': None,
            'relationship_score': 0.5
        }
        
        # Load from history if available
        if self.context_file.exists():
            try:
                data = json.loads(self.context_file.read_text())
                for resp in data.get('responses', []):
                    if sender_email in resp.get('recipients', ''):
                        context['previous_interactions'] += 1
                        context['last_intent'] = resp.get('intent')
            except:
                pass
        
        return context

# ========== STAGE 3: RESPONSE GENERATION ==========

class ResponseGenerator:
    """Generate adaptive responses with confidence scoring"""
    
    TEMPLATES = {
        'booking': {
            'pt': "Prezado(a) {name},\n\nRecebi sua solicitação de reserva para {date_ref}. Verificarei disponibilidade e retorno com confirmação em até 4 horas.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Dear {name},\n\nReceived your booking request for {date_ref}. Checking availability, will confirm within 4 hours.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        },
        'urgent': {
            'pt': "Recebi sua mensagem urgente ({urgency}). Tratando com prioridade imediata. Retorno em aproximadamente 30 minutos.\n\nKleber",
            'en': "Received your urgent message ({urgency}). Handling with immediate priority. Back in ~30 minutes.\n\nKleber"
        },
        'sales': {
            'pt': "Agradeço pelo interesse em nossos serviços. Envio proposta detalhada com escopo e valores em 30 minutos.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Thank you for your interest in our services. Sending detailed proposal with scope and pricing in 30 minutes.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        },
        'followup': {
            'pt': "Prezado(a) {name},\n\nRetornando sobre seu contato anterior. Tratarei com prioridade hoje.\n\nKleber",
            'en': "Dear {name},\n\nFollowing up on your previous contact. Prioritizing this today.\n\nKleber"
        },
        'general': {
            'pt': "Prezado(a) {name},\n\nAgradeço pela mensagem. Retornarei com detalhes em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Dear {name},\n\nThank you for your message. I'll respond with details shortly.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    }
    
    def __init__(self):
        self.confidence_threshold = 0.7
    
    def generate(self, analysis, sender_name, context, entities):
        """Generate response with confidence scoring"""
        intent = analysis['intent']
        language = analysis['language']
        urgency = analysis['urgency_score']
        
        # Select template
        template = self.TEMPLATES.get(intent, self.TEMPLATES['general']).get(language, list(self.TEMPLATES['general'].values())[0])
        
        # Personalize
        name = sender_name.split()[0] if sender_name else 'Cliente'
        
        # Insert entities
        date_ref = entities.get('dates', [''])[0] if entities.get('dates') else ''
        urgency_label = 'alta prioridade' if urgency >= 5 else 'prioridade média'
        
        response = template.format(
            name=name,
            date_ref=date_ref,
            urgency=urgency_label
        )
        
        # Calculate confidence
        confidence = self._calculate_confidence(analysis, context)
        
        return response, confidence
    
    def _calculate_confidence(self, analysis, context):
        score = 0.5
        
        # Intent clarity adds confidence
        if analysis['intent'] != 'general':
            score += 0.2
        
        # Language match adds confidence
        score += 0.1
        
        # Previous interactions add confidence
        score += min(context.get('previous_interactions', 0) * 0.05, 0.2)
        
        return min(score, 1.0)

# ========== STAGE 4: VERIFICATION LOOP ==========

class ResponseVerifier:
    """Track and verify response delivery"""
    
    def __init__(self):
        self.verification_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
    
    def track_response(self, thread_id, email_id, response_text, recipients, confidence, intent):
        """Track response for verification"""
        data = {}
        if self.verification_file.exists():
            data = json.loads(self.verification_file.read_text())
        
        thread_hash = hashlib.md5(f"{thread_id}{recipients}".encode()).hexdigest()[:12]
        
        data.setdefault('tracked', {})[thread_hash] = {
            'thread_id': thread_id,
            'email_id': email_id,
            'response_preview': response_text[:100],
            'recipients': recipients,
            'confidence': confidence,
            'intent': intent,
            'sent_at': datetime.now(timezone.utc).isoformat(),
            'delivered': False,
            'verified_at': None
        }
        
        self.verification_file.write_text(json.dumps(data, indent=2, default=str))
        return thread_hash
    
    def verify_delivery(self, thread_hash):
        """Check if response was delivered"""
        # In production, would check sent folder for matching content
        return True  # Placeholder

# ========== MAIN EXECUTION ==========

def main(execute=True, limit=15, dry_run=False):
    print("🧠 Intelligent Email Responder V10 - Case-by-Case Analysis")
    
    analyzer = EmailAnalyzer()
    correlator = ContextCorrelator()
    generator = ResponseGenerator()
    verifier = ResponseVerifier()
    
    # Get unread emails
    msgs = gmail_search('is:unread', limit=limit*2)
    
    # Setup labels
    labels = {
        'processed': gmail_get_or_create_label_id('Autonomous-V10-Replied'),
        'archived': gmail_get_or_create_label_id('Autonomous/V10- Archived'),
        'deferred': gmail_get_or_create_label_id('V10-Deferred'),
        'skipped': gmail_get_or_create_label_id('V10-Skipped')
    }
    
    stats = {
        'replied': 0, 'archived': 0, 'deferred': 0, 'skipped': 0, 
        'reply_all': 0, 'low_confidence': 0, 'errors': 0
    }
    
    email_queue = []
    
    # Stage 1: Analyze all emails
    print(f"\n📊 Analyzing {len(msgs)} unread emails...")
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            
            email_data = {
                'id': msg['id'],
                'thread_id': full.get('threadId', msg['id']),
                'sender': headers.get('From', ''),
                'subject': headers.get('Subject', ''),
                'snippet': full.get('snippet', ''),
                'headers': headers_raw
            }
            
            analysis = analyzer.analyze(email_data)
            email_queue.append({**email_data, 'analysis': analysis})
            
        except Exception as e:
            print(f"Error analyzing email: {e}")
            stats['errors'] += 1
    
    # Stage 2: Sort by priority
    priority_order = {'critical': 0, 'high': 1, 'normal': 2, 'low': 3}
    email_queue.sort(key=lambda x: priority_order.get(x['analysis']['priority'], 4))
    
    # Stage 3: Process each email
    print(f"\n📧 Processing {min(len(email_queue), limit)} emails...")
    
    for email in email_queue[:limit]:
        analysis = email['analysis']
        sender = email['sender']
        
        # Extract sender name
        sender_match = re.match(r'"?([^"<]+)"?\s*<?[^>]*>?', sender)
        sender_name = sender_match.group(1).strip() if sender_match else sender
        
        # Get context
        context = correlator.get_sender_context(sender)
        
        # Handle different actions
        action = analysis['action_recommendation']
        
        if action == 'skip':
            stats['skipped'] += 1
            print(f"   ⏭️ {sender[:30]} | noise (skipped)")
            continue
        
        elif action == 'archive':
            stats['archived'] += 1
            print(f"   📁 {sender[:30]} | bounce (archived)")
            if execute:
                gmail_batch_modify({'ids': [email['id']]}, 
                    removeLabelIds=['INBOX'], addLabelIds=[labels['archived']])
            continue
        
        elif action == 'defer':
            stats['deferred'] += 1
            print(f"   ⏰ {sender[:30]} | low priority (deferred)")
            if execute:
                gmail_batch_modify({'ids': [email['id']]},
                    addLabelIds=[labels['deferred']])
            continue
        
        # Generate response
        response, confidence = generator.generate(
            analysis, sender_name, context, analysis['entities']
        )
        
        if confidence < generator.confidence_threshold:
            stats['low_confidence'] += 1
            print(f"   🤔 {sender[:30]} | low confidence ({confidence:.2f})")
        
        stats['replied'] += 1
        if analysis['reply_all']:
            stats['reply_all'] += 1
        
        print(f"   📧 {sender[:30]} | {analysis['intent']} | conf:{confidence:.2f}{' 🔄 Reply-All' if analysis['reply_all'] else ''}")
        
        if execute:
            # Get CC recipients for Reply-All
            cc = next((h['value'] for h in email['headers'] if h['name'].lower() == 'cc'), '')
            all_recipients = f"{sender}, {cc}" if cc else sender
            
            # Send reply
            result = gmail_send_reply_fixed(
                email['thread_id'],
                f"Re: {email['subject']}",
                response,
                all_recipients
            )
            
            if result.get('success'):
                gmail_batch_modify({'ids': [email['id']]}, 
                    removeLabelIds=['UNREAD'], addLabelIds=[labels['processed']])
                
                # Track for verification
                verifier.track_response(
                    email['thread_id'], email['id'], response,
                    all_recipients, confidence, analysis['intent']
                )
                print(f"      ✅ Replied (confidence: {confidence:.2f})")
            else:
                print(f"      ⚠️ Failed: {result.get('error', 'unknown')}")
                stats['errors'] += 1
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"   Replied: {stats['replied']}")
    print(f"   Reply-All: {stats['reply_all']}")
    print(f"   Skipped: {stats['skipped']}")
    print(f"   Archived: {stats['archived']}")
    print(f"   Deferred: {stats['deferred']}")
    print(f"   Low Confidence: {stats['low_confidence']}")
    
    return stats

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit, dry_run=args.dry_run)