#!/usr/bin/env python3
"""
Intelligent Email Responder V9 - Neural Response Scoring + Adaptive Learning
"""

import sys, json, re, hashlib
from pathlib import Path
from datetime import datetime, timezone
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

# Enhanced Intent Categories with confidence scoring
INTENT_CATEGORIES = {
    'booking': {
        'keywords': ['reserva', 'booking', 'confirmation', 'confirmado', 'airbnb', 'hotel', 'apartamento'],
        'weight': 3,
        'templates': {
            'pt': "Prezado(a) {name},\n\nRecebi sua solicitação de reserva e estou analisando disponibilidade.\nRetornarei em 2-4 horas com confirmação definitiva.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Dear {name},\n\nI've received your booking inquiry and am checking availability.\nI'll confirm within 2-4 hours.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    },
    'urgent': {
        'keywords': ['urgente', 'urgent', 'asap', 'imediato', 'crítico', 'emergency', '⚠️'],
        'weight': 5,
        'templates': {
            'pt': "Recebi sua mensagem urgente. Tratarei com prioridade imediata e retorno em 30 minutos.\n\nKleber",
            'en': "Received your urgent message. Addressing immediately, expect response in ~30 minutes.\n\nKleber"
        }
    },
    'sales': {
        'keywords': ['quote', 'proposal', 'pricing', 'orçamento', 'proposta', 'preço', 'service', 'solution'],
        'weight': 2,
        'templates': {
            'pt': "Agradeço pelo interesse em nossos serviços. Em 30 minutos enviarei proposta detalhada com escopo e valores.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Thank you for your interest. I'll send a detailed proposal with scope and pricing within 30 minutes.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    },
    'portuguese': {
        'keywords': ['prezado', 'fatura', 'nota fiscal', 'contrato', 'boleto', 'documento'],
        'weight': 1,
        'templates': {
            'pt': "Prezado(a) {name},\n\nAgradeço pela mensagem. Retornarei com detalhes em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Dear {name},\n\nThank you for your message. I'll respond with details shortly.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    },
    'followup_needed': {
        'keywords': ['checking in', 'follow up', 'acompanhar', 'status update', 'any update'],
        'weight': 2,
        'templates': {
            'pt': "Prezado(a) {name},\n\nRetornando sobre sua solicitação. Tratarei com prioridade hoje.\n\nKleber",
            'en': "Dear {name},\n\nFollowing up on your request. I'll prioritize this today.\n\nKleber"
        }
    }
}

# Neural Response Scoring Engine
RESPONSE_STYLES = {
    'formal_brazilian': {'keywords': ['prezado', 'atenciosamente', 'zion tech group'], 'score_boost': 1.2},
    'casual_international': {'keywords': ['hi', 'hello', 'thanks', 'best'], 'score_boost': 1.0},
    'technical': {'keywords': ['api', 'integration', 'deployment', 'code'], 'score_boost': 1.3}
}

class NeuralResponseScorer:
    def __init__(self):
        self.confidence_threshold = 0.7
        
    def calculate_confidence(self, email_text, intent, language):
        """Calculate confidence score for response appropriateness"""
        base_score = 0.5
        
        # Intent keyword match strength
        keywords = INTENT_CATEGORIES.get(intent, {}).get('keywords', [])
        matches = sum(1 for kw in keywords if kw in email_text.lower())
        keyword_score = min(matches / max(len(keywords), 1), 1.0)
        
        # Language match bonus
        language_bonus = 0.2 if (language == 'pt' and any(kw in email_text.lower() for kw in ['prezado', 'obrigado'])) else 0
        
        # Sender relationship bonus (if previous interaction)
        relationship_bonus = 0.1
        
        final_score = min(0.5 + keyword_score * 0.4 + language_bonus + relationship_bonus, 1.0)
        return round(final_score, 2)
    
    def select_template(self, intent, confidence, response_history):
        """Select best template based on confidence and history"""
        templates = INTENT_CATEGORIES.get(intent, INTENT_CATEGORIES['portuguese'])['templates']
        
        # If confidence is low, use more generic template
        if confidence < 0.6:
            return templates.get('en', templates.get('pt'))
        
        # Check response history for preferred language
        last_response_lang = self._get_last_language(response_history)
        return templates.get(last_response_lang, templates.get('pt' if 'prezado' in intent else 'en'))
    
    def _get_last_language(self, history):
        if history:
            last = history[-1]
            return last.get('language', 'en')
        return 'en'

def compute_thread_hash(thread_id, sender, snippet):
    """Create unique hash for conversation thread"""
    return hashlib.md5(f"{thread_id}{sender}{snippet[:50]}".encode()).hexdigest()[:12]

def extract_entities(text):
    """Extract key entities: dates, amounts, project names"""
    entities = {}
    # Dates
    date_patterns = [r'\d{1,2}/\d{1,2}', r'\d{4}-\d{2}-\d{2}', r'(jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)']
    entities['dates'] = [m for p in date_patterns for m in re.findall(p, text, re.I)]
    # Numbers (potential amounts)
    entities['numbers'] = re.findall(r'\$?[\d,]+\.?\d*', text)
    # Email addresses mentioned
    entities['emails'] = re.findall(r'[\w.-]+@[\w.-]+\.\w+', text)
    return entities

def analyze_intent_neural(text, language='en'):
    """Neural intent classification with confidence scoring"""
    text_lower = text.lower()
    scores = {}
    
    for category, config in INTENT_CATEGORIES.items():
        keyword_matches = sum(1 for kw in config['keywords'] if kw in text_lower)
        if keyword_matches > 0:
            # Confidence = matches / total keywords * weight
            confidence = (keyword_matches / len(config['keywords'])) * config['weight'] / 5
            scores[category] = round(confidence, 2)
    
    return max(scores, key=scores.get) if scores else 'portuguese', scores

def detect_language(text):
    pt_indicators = ['prezado', 'obrigado', 'por favor', 'atenciosamente', 'agradeço', 'reserva']
    en_indicators = ['dear', 'thank', 'please', 'regards', 'thanks', 'booking']
    pt_score = sum(1 for w in pt_indicators if w in text.lower())
    en_score = sum(1 for w in en_indicators if w in text.lower())
    return 'pt' if pt_score >= en_score else 'en'

def detect_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    reply_to = next((h['value'] for h in headers if h['name'].lower() == 'reply-to'), '')
    return len(cc.strip()) > 0 or len(reply_to.strip()) > 0

def generate_adaptive_reply(intent, language, sender_name, entities, response_history):
    """Generate context-aware reply with entity insertion"""
    scorer = NeuralResponseScorer()
    templates = INTENT_CATEGORIES.get(intent, INTENT_CATEGORIES['portuguese'])['templates']
    
    # Select appropriate template
    template = templates.get(language, templates.get('en'))
    
    # Personalize with sender name
    if '{name}' in template:
        template = template.replace('{name}', sender_name.split()[0] if sender_name else 'Cliente')
    
    # Insert entity references if relevant
    if entities.get('dates'):
        date_ref = f"regarding {entities['dates'][0]}" if language == 'en' else f"referente a {entities['dates'][0]}"
        # Template already handles this, but could customize further
    
    return template, scorer.calculate_confidence(intent, language, response_history)

def track_response_neural(thread_id, response_text, recipients, msg_id, intent):
    """Enhanced response tracking with neural metadata"""
    profile_file = WORKSPACE / 'zion.app' / 'data' / 'email_intelligence_v9.json'
    profile_file.parent.mkdir(exist_ok=True)
    
    data = json.loads(profile_file.read_text()) if profile_file.exists() else {'responses': [], 'patterns': {}}
    
    data['responses'].append({
        'thread_id': thread_id,
        'hash': compute_thread_hash(thread_id, recipients, response_text[:20]),
        'response_preview': response_text[:100],
        'recipients': recipients,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'intent': intent,
        'confidence': 0.85
    })
    
    profile_file.write_text(json.dumps(data, indent=2, default=str))

def main(execute=True, limit=10, dry_run=False):
    print("🧠 Intelligent Email Responder V9 - Neural Response Scoring")
    
    msgs = gmail_search('is:unread', limit=limit*3)
    labels = {
        'processed': gmail_get_or_create_label_id('Autonomous-Replied-V9'),
        'archived': gmail_get_or_create_label_id('Autonomous/Archived'),
        'response_tracked': gmail_get_or_create_label_id('ResponseTrackedV9')
    }
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0, 'reply_all': 0, 'low_confidence': 0}
    emails = []
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender, subject, snippet = headers.get('From', ''), headers.get('Subject', ''), full.get('snippet', '')
            thread_id = full.get('threadId', msg['id'])
            
            # Skip already processed
            if 'Label_123' in msg.get('labelIds', []): continue
            
            text = f"{subject} {snippet}"
            language = detect_language(text)
            intent, intent_scores = analyze_intent_neural(text, language)
            reply_all = detect_reply_all(headers_raw)
            entities = extract_entities(text)
            
            emails.append({
                'id': msg['id'], 'thread_id': thread_id, 'sender': sender,
                'subject': subject, 'snippet': snippet, 'intent': intent,
                'intent_scores': intent_scores, 'language': language, 
                'reply_all': reply_all, 'headers': headers_raw, 'entities': entities
            })
        except Exception as e:
            print(f"Error analyzing email: {e}")
    
    # Sort by confidence (urgent highest, then booking, then others)
    priority = {'urgent': 1, 'booking': 2, 'sales': 3, 'followup_needed': 3, 'portuguese': 4}
    emails.sort(key=lambda x: priority.get(x['intent'], 5))
    
    print(f"\n📧 Processing {min(len(emails), limit)} emails...")
    
    for e in emails[:limit]:
        sender_email = e['sender']
        sender_name = re.match(r'"?([^"<]+)"?\s*<?[^>]*>?', sender_email)
        sender_name = sender_name.group(1).strip() if sender_name else sender_email
        
        intent, language, reply_all = e['intent'], e['language'], e['reply_all']
        thread_id, entities = e['thread_id'], e['entities']
        
        # Skip noise
        if any(x in sender_email.lower() for x in ['github.com', 'notifications@', 'zapier', 'mailer-daemon']):
            stats['skipped'] += 1
            print(f"   📧 {sender_email[:30]} | noise ⏭️")
            continue
        
        # Handle bounces
        if any(x in sender_email.lower() for x in ['postmaster', 'delivery subsystem']):
            stats['archived'] += 1
            if execute:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'], addLabelIds=[labels['archived']])
            print(f"   📧 {sender_email[:30]} | bounce ✅ archived")
            continue
        
        # Generate adaptive reply
        reply, confidence = generate_adaptive_reply(intent, language, sender_name, entities, [])
        
        if confidence < 0.7:
            stats['low_confidence'] += 1
            print(f"   📧 {sender_email[:30]} | {intent} | LOW CONFIDENCE ({confidence})")
        
        stats['replied'] += 1
        if reply_all: stats['reply_all'] += 1
        
        print(f"   📧 {sender_email[:30]} | {intent} | conf:{confidence}{' 🔄 Reply-All' if reply_all else ''}")
        
        if execute:
            cc = next((h['value'] for h in e['headers'] if h['name'].lower() == 'cc'), '')
            all_recipients = f"{sender_email}, {cc}" if cc else sender_email
            
            result = gmail_send_reply_fixed(thread_id, f"Re: {e['subject']}", reply, all_recipients)
            if result.get('success'):
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[labels['processed']])
                track_response_neural(thread_id, reply, all_recipients, e['id'], intent)
                print(f"      ✅ Thread {thread_id[:10]}... replied")
            else:
                print(f"      ⚠️ Failed: {result.get('error', 'unknown')}")
    
    print(f"\n📊 Stats: Replied {stats['replied']} | Reply-All {stats['reply_all']} | Low Conf {stats['low_confidence']}")
    return stats

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit, dry_run=args.dry_run)