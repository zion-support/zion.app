#!/usr/bin/env python3
"""
Intelligent Email Responder V8 - Enhanced with Reply-All support and context awareness
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE/'zion.app'/ 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed, gmail_batch_modify, telegram_send, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_send_reply_fixed(*args): return {'success': True}
    def gmail_batch_modify(*args): pass
    def telegram_send(t): print(f"[TG] {t}")
    def gmail_get_or_create_label_id(n): return 'label_id'

# Config
LABELS = {'processed': 'Autonomous-Replied-V8', 'archived': 'Autonomous/Archived', 'response_tracked': 'ResponseTracked'}
PROFILE_FILE = WORKSPACE / 'zion.app' / 'data' / 'email_intelligence.json'

INTENT_CATEGORIES = {
    'booking': {
        'keywords': ['reserva', 'booking', 'confirmation', 'confirmado', 'airbnb', 'hotel'],
        'template': {
            'pt': "Prezado(a),\n\nRecebi sua solicitação de reserva e estou analisando disponibilidade.\nRetornarei em breve com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Thank you for your booking inquiry. I'm reviewing availability and will confirm shortly.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    },
    'urgent': {
        'keywords': ['urgente', 'urgent', 'asap', 'imediato', 'crítico'],
        'template': {
            'pt': "Recebi sua mensagem urgente. Tratarei com prioridade imediata.\n\nKleber",
            'en': "Received your urgent message. I'm addressing this immediately.\n\nKleber"
        }
    },
    'sales': {
        'keywords': ['quote', 'proposal', 'pricing', 'orçamento', 'proposta', 'preço'],
        'template': {
            'pt': "Agradeço pelo interesse. Em breve enviarei proposta detalhada.\n\nAtenciosamente,\nKleber Garcia Alcatrão",
            'en': "Thank you for your interest. I'll send a detailed proposal shortly.\n\nBest regards,\nKleber Garcia Alcatrão"
        }
    },
    'portuguese': {
        'keywords': ['prezado', 'fatura', 'nota fiscal', 'contrato'],
        'template': {
            'pt': "Prezado(a),\n\nAgradeço pela mensagem. Retornarei com detalhes em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
            'en': "Thank you for your message. I'll respond with details shortly.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
        }
    }
}

def load_intelligence():
    if PROFILE_FILE.exists():
        return json.loads(PROFILE_FILE.read_text())
    return {'sender_profiles': {}, 'response_history': [], 'intent_stats': defaultdict(int)}

def save_intelligence(data):
    PROFILE_FILE.parent.mkdir(exist_ok=True)
    PROFILE_FILE.write_text(json.dumps(data, indent=2, default=str))

def analyze_intent(text, language='en'):
    text_lower = text.lower()
    scores = {}
    for category, config in INTENT_CATEGORIES.items():
        score = sum(1 for kw in config['keywords'] if kw in text_lower)
        if score > 0:
            scores[category] = score
    return max(scores, key=scores.get) if scores else 'general'

def detect_language(text):
    pt_indicators = ['prezado', 'obrigado', 'por favor', 'atenciosamente', 'agradeço']
    en_indicators = ['dear', 'thank', 'please', 'regards', 'thanks']
    pt_score = sum(1 for w in pt_indicators if w in text.lower())
    en_score = sum(1 for w in en_indicators if w in text.lower())
    return 'pt' if pt_score >= en_score else 'en'

def detect_reply_all(headers):
    """Check if CC exists - indicates Reply-All needed"""
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0

def generate_smart_reply(intent, language, sender_name=None):
    template = INTENT_CATEGORIES.get(intent, INTENT_CATEGORIES['portuguese'])
    reply = template['template'].get(language, template['template']['en'])
    if sender_name:
        reply = reply.replace('Prezado(a)', f'Prezado(a) {sender_name.split()[0] if sender_name else ""}'.strip())
    return reply

def extract_sender_name(sender):
    match = re.match(r'"?([^"<]+)"?\s*<?[^>]*>?', sender)
    return match.group(1).strip() if match else sender

def track_response(thread_id, response_text, recipients):
    """Track responses for learning"""
    data = load_intelligence()
    data['response_history'].append({
        'thread_id': thread_id,
        'response': response_text[:100],
        'recipients': recipients,
        'timestamp': datetime.now(timezone.utc).isoformat()
    })
    save_intelligence(data)

def main(execute=True, limit=10):
    print("🧠 Intelligent Email Responder V8 - Enhanced with Reply-All + Context")
    
    msgs = gmail_search('is:unread', limit=limit*3)
    labels = {'processed': gmail_get_or_create_label_id(LABELS['processed']), 'archived': gmail_get_or_create_label_id(LABELS['archived']), 'response_tracked': gmail_get_or_create_label_id(LABELS['response_tracked'])}
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0, 'reply_all': 0}
    emails = []
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender, subject, snippet = headers.get('From', ''), headers.get('Subject', ''), full.get('snippet', '')
            thread_id = full.get('threadId', msg['id'])
            
            if 'Label_123' in msg.get('labelIds', []): continue
            
            text = f"{subject} {snippet}"
            language = detect_language(text)
            intent = analyze_intent(text, language)
            reply_all = detect_reply_all(headers_raw)
            
            emails.append({
                'id': msg['id'], 'thread_id': thread_id, 'sender': sender,
                'subject': subject, 'snippet': snippet, 'intent': intent,
                'language': language, 'reply_all': reply_all, 'headers': headers_raw
            })
        except Exception as e:
            print(f"Error analyzing email: {e}")
    
    priority_order = {'urgent': 1, 'booking': 2, 'sales': 3, 'portuguese': 4}
    emails.sort(key=lambda x: priority_order.get(x['intent'], 5))
    
    print(f"\n📧 Processing {min(len(emails), limit)} emails...")
    
    for e in emails[:limit]:
        sender_email = e['sender']
        sender_name = extract_sender_name(sender_email)
        subject, snippet = e['subject'], e['snippet']
        thread_id = e['thread_id']
        intent, language, reply_all = e['intent'], e['language'], e['reply_all']
        
        if any(x in sender_email.lower() for x in ['mailer-daemon', 'postmaster', 'delivery subsystem']):
            stats['archived'] += 1
            if execute:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'], addLabelIds=[labels['archived']])
            print(f"   📧 {sender_email[:30]} | bounce ✅ archived")
            continue
        
        if any(x in sender_email.lower() for x in ['github.com', 'notifications@', 'zapier']):
            stats['skipped'] += 1
            print(f"   📧 {sender_email[:30]} | noise ⏭️ skipped")
            continue
        
        reply = generate_smart_reply(intent, language, sender_name)
        stats['replied'] += 1
        if reply_all: stats['reply_all'] += 1
        
        print(f"   📧 {sender_email[:30]} | {intent} | {language}{' 🔄 Reply-All' if reply_all else ''}")
        
        if execute:
            # Reply-All detection: include CC recipients
            cc_recipients = next((h['value'] for h in e['headers'] if h['name'].lower() == 'cc'), '')
            all_recipients = f"{sender_email}, {cc_recipients}" if cc_recipients else sender_email
            
            result = gmail_send_reply_fixed(thread_id, subject, reply, all_recipients)
            if result.get('success'):
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[labels['processed']])
                track_response(thread_id, reply, all_recipients)
                reply_marker = "🔄 REPLY-ALL" if cc_recipients else ""
                print(f"      ✅ Replied to thread {thread_id[:10]}... {reply_marker}")
            else:
                print(f"      ⚠️ Reply failed: {result.get('error', 'unknown')}")
    
    print(f"\n📊 Stats: Replied {stats['replied']} | Reply-All {stats['reply_all']} | Archived {stats['archived']}")
    return stats

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit)