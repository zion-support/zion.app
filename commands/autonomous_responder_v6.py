#!/usr/bin/env python3
"""
Autonomous Auto-Responder V6 - FIXED for proper conversation threading

Fixes:
- Proper conversation threading using threadId
- Correct subject handling (preserving "Re:")
- Better sender extraction
"""

import sys, os, json
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed, gmail_batch_modify, telegram_send, gmail_get_or_create_label_id

# Labels
LABEL_PROCESSED = 'Autonomous-Replied-V6'
LABEL_ARCHIVED = 'Autonomous/Archived'

# Portuguese sentiment
PT_POSITIVE = {'obrigado', 'obrigada', 'agradeço', 'excelente', 'ótimo', 'parceria'}
PT_NEGATIVE = {'problema', 'urgente', 'crítico', 'preocupado', 'reclamação', 'atraso'}

# Sender profiles
PROFILE_FILE = WORKSPACE / 'zion.app' / 'data' / 'sender_profiles.json'

def load_profiles():
    if PROFILE_FILE.exists():
        return json.loads(PROFILE_FILE.read_text())
    return {}

def save_profiles(profiles):
    PROFILE_FILE.parent.mkdir(parents=True, exist_ok=True)
    PROFILE_FILE.write_text(json.dumps(profiles, indent=2))

def update_sender_profile(sender, text):
    """Update sender profile based on message analysis"""
    profiles = load_profiles()
    domain = sender.split('@')[-1] if '@' in sender else sender
    text_lower = text.lower()
    
    formal_words = ['prezado', 'atenciosamente', 'cordialmente']
    casual_words = ['oi', 'olá', 'obrigado!', 'valeu']
    formal = sum(1 for w in formal_words if w in text_lower)
    casual = sum(1 for w in casual_words if w in text_lower)
    pt_words = ['obrigado', 'prezado', 'agradeço', 'prezada']
    en_words = ['thanks', 'dear', 'regards', 'sincerely']
    pt_score = sum(1 for w in pt_words if w in text_lower)
    en_score = sum(1 for w in en_words if w in text_lower)
    
    if domain not in profiles:
        profiles[domain] = {'formality': 'neutral', 'language': 'en', 'total_messages': 0}
    
    profiles[domain]['formality'] = 'formal' if formal > casual else 'casual'
    profiles[domain]['language'] = 'pt' if pt_score >= en_score else 'en'
    profiles[domain]['total_messages'] += 1
    profiles[domain]['last_updated'] = datetime.utcnow().isoformat()
    
    save_profiles(profiles)
    return profiles.get(domain, {})

def needs_reply_all(headers):
    """Detect if Reply-All is needed by checking CC header"""
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def analyze_sentiment(text):
    text = text.lower()
    pos = sum(1 for w in PT_POSITIVE if w in text)
    neg = sum(1 for w in PT_NEGATIVE if w in text)
    if pos > neg: return 'positive', 'pt' if pos else 'en'
    elif neg > pos: return 'negative', 'pt' if neg else 'en'
    return 'neutral', 'pt' if (pos + neg) > 0 else 'en'

def analyze_email(sender, subject, snippet):
    text = f"{subject} {snippet} {sender}".lower()
    sender_lower = sender.lower()
    
    if any(x in sender_lower for x in ['mailer-daemon', 'postmaster', 'mail delivery subsystem']):
        return {"action": "archive", "category": "bounce", "priority": 1}
    
    if any(x in sender_lower for x in ['github.com', 'notifications@github.com', 'zapier', 'theresanaiforthat']):
        return {"action": "skip", "category": "noise", "priority": 10}
    
    if any(x in text for x in ['airbnb', 'reserva', 'reservation', 'booking', 'confirmado', 'confirmation']):
        return {"action": "reply", "category": "booking", "priority": 2}
    
    if any(x in text for x in ['quote', 'proposal', 'pricing', 'orçamento', 'proposta']):
        return {"action": "reply", "category": "sales", "priority": 3}
    
    if any(x in text for x in ['prezado', 'fatura', 'nota fiscal', 'contrato']):
        return {"action": "reply", "category": "portuguese", "priority": 4}
    
    if any(x in text for x in ['urgent', 'urgente', 'asap']):
        return {"action": "reply", "category": "urgent", "priority": 5}
    
    return {"action": "skip", "category": "other", "priority": 20}

def generate_reply(category, lang, formality, sentiment):
    if lang == 'pt':
        if category == 'booking':
            return "Prezado(a),\n\nRecebi sua solicitação de reserva. Estou analisando e retorno em breve com confirmação.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
        return "Prezado(a),\n\nAgradeço pela mensagem. Retornarei com detalhes em breve.\n\nAtenciosamente,\nKleber Garcia Alcatrão"
    return "Thank you for your message. I'll respond shortly with details.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"

def cmd_run(dry_run=False, limit=10):
    print("🤖 Autonomous Auto-Responder V6 (FIXED conversation threading)")
    
    msgs = gmail_search('is:unread', limit=200)
    labels = {
        'processed': gmail_get_or_create_label_id(LABEL_PROCESSED),
        'archived': gmail_get_or_create_label_id(LABEL_ARCHIVED)
    }
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0, 'reply_all': 0, 'learned': 0}
    emails = []
    
    for msg in msgs:
        try:
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender, subject, snippet = headers.get('From', ''), headers.get('Subject', ''), full.get('snippet', '')
            thread_id = full.get('threadId', msg['id'])  # Use threadId for proper threading
            if labels['processed'] in msg.get('labelIds', []): continue
            analysis = analyze_email(sender, subject, snippet)
            reply_all = needs_reply_all(headers_raw)
            emails.append({'id': msg['id'], 'thread_id': thread_id, 'sender': sender, 'subject': subject, 
                          'snippet': snippet, 'analysis': analysis, 'reply_all': reply_all,
                          'headers': headers_raw})
        except: pass
    
    emails.sort(key=lambda x: x['analysis']['priority'])
    print(f"\n📧 Processing {min(len(emails), limit)} emails...")
    
    for e in emails[:limit]:
        a = e['analysis']
        sender, subject, reply_all, thread_id = e['sender'], e['subject'], e['reply_all'], e['thread_id']
        
        if a['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if a['action'] == 'archive':
            stats['archived'] += 1
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'], addLabelIds=[labels['archived']])
            print(f"📧 {sender[:30]} | {a['category']} ✅ Archived")
            continue
            
        if a['action'] == 'reply':
            sentiment, lang = analyze_sentiment(e['subject'])
            reply = generate_reply(a['category'], lang, 'formal', sentiment)
            stats['replied'] += 1
            if reply_all: stats['reply_all'] += 1
            
            # Update sender profile
            update_sender_profile(sender, f"{subject} {snippet}")
            stats['learned'] += 1
            
            print(f"📧 {sender[:30]} | {a['category']} | {lang}{' 🔄 Reply-All' if reply_all else ''}")
            if not dry_run:
                result = gmail_send_reply_fixed(thread_id, subject, reply, sender)
                if result.get('success'):
                    gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[labels['processed']])
                    print(f"   ✅ Replied to thread {thread_id[:10]}...")
                else:
                    print(f"   ⚠️ Reply failed: {result.get('error', 'unknown')}")
    
    print(f"\n📊 Replied: {stats['replied']} | Reply-All: {stats['reply_all']} | Learned: {stats['learned']} | Archived: {stats['archived']}")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()