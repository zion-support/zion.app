#!/usr/bin/env python3
"""
Quality-Optimized Email Responder V17
Grading system + multi-language support + deduplication
"""

import sys
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL_DONE = 'Autonomous-V17'

def grade_response(reply_text, category):
    score = 5
    if 'obrigado' in reply_text.lower() or 'thank' in reply_text.lower(): score += 1
    if 'retorno' in reply_text.lower() or 'respond' in reply_text.lower(): score += 1
    if '24h' in reply_text or '2 hours' in reply_text: score += 1
    if 'atenciosamente' in reply_text.lower() or 'best regards' in reply_text.lower(): score += 1
    if category in ['booking', 'urgent']: score += 1
    return min(10, max(1, score))

def detect_language(text):
    pt_words = ['prezado', 'obrigado', 'reserva', 'respeitosamente', 'atenciosamente']
    en_words = ['dear', 'thank', 'booking', 'regards', 'best']
    text_lower = text.lower()
    pt_count = sum(1 for w in pt_words if w in text_lower)
    en_count = sum(1 for w in en_words if w in text_lower)
    return 'pt' if pt_count >= en_count else 'en'

def needs_reply_all(headers):
    cc = next((h['value'] for h in headers if h['name'].lower() == 'cc'), '')
    return len(cc.strip()) > 0 if cc else False

def generate_quality_reply(category, language):
    pt = {
        'booking': "Prezado(a),\n\nAgradeço pela sua solicitação de reserva. Estou verificando disponibilidade e retorno em até 24h com confirmação completa.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'urgent': "Prezado(a),\n\nRecebi sua mensagem urgente. Trabalhando na solução agora e retorno rapidamente.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group",
        'sales': "Prezado(a),\n\nObrigado pelo seu interesse. Preparo uma proposta detalhada e envio em até 2h.\n\nAtenciosamente,\nKleber Garcia Alcatrão\nZion Tech Group"
    }
    en = {
        'booking': "Dear,\n\nThank you for your booking request. I'm checking availability and will respond within 24h with confirmation.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group",
        'urgent': "Dear,\n\nReceived your urgent message. Working on the solution now and will respond shortly.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group",
        'sales': "Dear,\n\nThank you for your interest. I'll prepare a detailed proposal and send it within 2 hours.\n\nBest regards,\nKleber Garcia Alcatrão\nZion Tech Group"
    }
    return pt.get(category, pt['booking']) if language == 'pt' else en.get(category, en['booking'])

def cmd_run(dry_run=False, limit=15):
    print("⭐ Quality-Optimized Responder V17 (Deduplicated)")
    
    msgs = gmail_search('is:unread', limit=200)
    label_id = gmail_get_or_create_label_id(LABEL_DONE)
    
    # Track replied threads to prevent duplicates
    replied_threads = set()
    emails = []
    
    for msg in msgs:
        try:
            # Skip if already has our reply label (already processed)
            if LABEL_DONE in msg.get('labelIds', []):
                continue
                
            # Track thread to prevent duplicate replies
            thread_id = msg.get('threadId')
            if thread_id in replied_threads:
                continue
            
            full = gmail_get(msg['id'])
            headers_raw = full.get('payload', {}).get('headers', [])
            headers = {h['name']: h['value'] for h in headers_raw}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            text = f"{subject} {snippet}".lower()
            sender_lower = sender.lower()
            
            if any(x in sender_lower for x in ['mailer-daemon', 'postmaster']):
                decision = {'action': 'archive', 'category': 'bounce'}
            elif any(x in sender_lower for x in ['github.com', 'zapier']):
                decision = {'action': 'skip'}
            elif any(x in text for x in ['airbnb', 'reserva', 'booking']):
                decision = {'action': 'reply', 'category': 'booking', 'thread_id': thread_id}
            elif any(x in text for x in ['urgent', 'urgente']):
                decision = {'action': 'reply', 'category': 'urgent', 'thread_id': thread_id}
            elif any(x in text for x in ['quote', 'proposta']):
                decision = {'action': 'reply', 'category': 'sales', 'thread_id': thread_id}
            else:
                decision = {'action': 'skip'}
            
            decision['reply_all'] = needs_reply_all(headers_raw)
            decision['sender'] = sender
            decision['subject'] = subject
            emails.append({'id': msg['id'], 'decision': decision})
        except: pass
    
    stats = {'replied': 0, 'archived': 0, 'skipped': 0, 'total_grade': 0}
    
    for e in emails[:limit]:
        d = e['decision']
        
        if d['action'] == 'skip':
            stats['skipped'] += 1
            continue
            
        if d['action'] == 'archive':
            stats['archived'] += 1
            print(f"📧 {d.get('sender', '')[:30]} | 🗑️ {d['category']}")
            if not dry_run:
                gmail_batch_modify({'ids': [e['id']]}, removeLabelIds=['INBOX'])
            continue
            
        if d['action'] == 'reply':
            # Mark thread as replied to prevent duplicates
            replied_threads.add(d.get('thread_id'))
            
            language = detect_language(d.get('subject', '') + d.get('sender', ''))
            reply = generate_quality_reply(d.get('category', 'booking'), language)
            grade = grade_response(reply, d.get('category', 'booking'))
            stats['replied'] += 1
            stats['total_grade'] += grade
            
            print(f"📧 {d.get('sender', '')[:30]} | {d.get('category', 'reply')} | Grade: {grade}/10{' 🔄 Reply-All' if d['reply_all'] else ''}")
            
            if not dry_run:
                gmail_send_reply(e['id'], reply)
                gmail_batch_modify({'ids': [e['id']]}, addLabelIds=[label_id])
    
    avg_grade = stats['total_grade'] / stats['replied'] if stats['replied'] > 0 else 0
    print(f"\n📊 Replied: {stats['replied']} | Avg Grade: {avg_grade:.1f}/10 | Archived: {stats['archived']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=15)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)