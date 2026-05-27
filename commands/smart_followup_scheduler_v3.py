#!/usr/bin/env python3
"""
Smart Follow-Up Scheduler - Tracks unanswered emails for automated follow-ups
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, gmail_send_reply_fixed, gmail_batch_modify, gmail_get_or_create_label_id
except:
    def gmail_search(q, limit=20): return []
    def gmail_get(i): return {}
    def gmail_send_reply_fixed(*args): return {'success': True}
    def gmail_batch_modify(*args): pass
    def gmail_get_or_create_label_id(n): return 'label_id'

FOLLOWUP_FILE = WORKSPACE / 'zion.app' / 'data' / 'followup_schedule.json'

def load_followups():
    if FOLLOWUP_FILE.exists():
        return json.loads(FOLLOWUP_FILE.read_text())
    return {'scheduled': {}, 'sent': [], 'patterns': {}}

def save_followups(data):
    FOLLOWUP_FILE.parent.mkdir(exist_ok=True)
    FOLLOWUP_FILE.write_text(json.dumps(data, indent=2, default=str))

def schedule_followups():
    """Find emails that need follow-up based on response time"""
    data = load_followups()
    now = datetime.now(timezone.utc)
    scheduled = 0
    
    # Find sent messages from last 72 hours
    search_query = 'in:sent newer_than:72h'
    sent = gmail_search(search_query, limit=200)
    
    for msg in sent:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            thread_id = full.get('threadId', msg['id'])
            
            # Skip if already scheduled or already followed up
            if thread_id in data.get('scheduled', {}) or thread_id in data.get('sent', []):
                continue
            
            # Check if original sender replied (thread has more than 2 messages)
            thread_messages = gmail_search(f'rfc822msgid:{msg.get("rfc822msgid", "")}', limit=10)
            
            # Schedule follow-up in 48 hours if no reply
            send_time = now + timedelta(hours=48)
            
            data['scheduled'][thread_id] = {
                'thread_id': thread_id,
                'original_sender': headers.get('To', ''),
                'subject': headers.get('Subject', ''),
                'sent_at': headers.get('Date', ''),
                'followup_at': send_time.isoformat(),
                'followup_sent': False,
                'intent': classify_intent_from_subject(headers.get('Subject', ''))
            }
            scheduled += 1
            
        except Exception as e:
            print(f"Error processing message: {e}")
    
    save_followups(data)
    return scheduled

def classify_intent_from_subject(subject):
    subject_lower = subject.lower()
    if any(kw in subject_lower for kw in ['booking', 'reserva', 'reservation']):
        return 'booking'
    elif any(kw in subject_lower for kw in ['quote', 'proposal', 'proposta']):
        return 'sales'
    return 'general'

def send_followup(thread_id, sender, subject, intent):
    """Send intelligent follow-up"""
    templates = {
        'booking': {
            'pt': "Prezado(a),\n\nRetornando sobre sua solicitação de reserva. Ainda está interessado(a)?\n\nAtenciosamente,\nKleber",
            'en': "Following up on your booking inquiry. Are you still interested?"
        },
        'sales': {
            'pt': "Prezado(a),\n\nGostaria de atualizar sobre seu interesse. Podemos avançar com a proposta?\n\nKleber",
            'en': "Checking in on your interest. Shall we proceed with the proposal?"
        },
        'general': {
            'pt': "Prezado(a),\n\nRetornando sobre nossa conversa. Em que posso ajudar?\n\nKleber",
            'en': "Following up on our conversation. How can I help?"
        }
    }
    
    # Detect language from original
    lang = 'pt' if 'prezado' in subject.lower() else 'en'
    template = templates.get(intent, templates['general'])
    reply = template.get(lang, template['en'])
    
    result = gmail_send_reply_fixed(thread_id, f"Re: {subject}", reply, sender)
    return result.get('success', False)

def process_due_followups(execute=True):
    """Process follow-ups that are due"""
    data = load_followups()
    now = datetime.now(timezone.utc)
    sent_count = 0
    
    due = [(tid, info) for tid, info in data.get('scheduled', {}).items() 
           if not info.get('followup_sent') and 
           datetime.fromisoformat(info['followup_at']) <= now]
    
    for thread_id, info in due:
        print(f"⏰ Sending follow-up for thread {thread_id[:10]}...")
        
        if execute:
            success = send_followup(
                thread_id, 
                info['original_sender'], 
                info['subject'],
                info['intent']
            )
            
            if success:
                data['scheduled'][thread_id]['followup_sent'] = True
                data['scheduled'][thread_id]['followup_at_actual'] = now.isoformat()
                data['sent'].append(thread_id)
                sent_count += 1
                print(f"   ✅ Follow-up sent")
            else:
                print(f"   ❌ Failed to send")
    
    save_followups(data)
    return sent_count

def get_followup_stats():
    data = load_followups()
    return {
        'scheduled': len(data.get('scheduled', {})),
        'sent': len(data.get('sent', [])),
        'due_now': len([i for i in data.get('scheduled', {}).values() 
                       if not i.get('followup_sent') and 
                       datetime.fromisoformat(i['followup_at']) <= datetime.now(timezone.utc)])
    }

def main(execute=True):
    print("📅 Smart Follow-Up Scheduler V3")
    
    # Schedule new follow-ups
    scheduled = schedule_followups()
    print(f"\n📋 Scheduled {scheduled} new follow-ups")
    
    # Process due follow-ups
    sent = process_due_followups(execute=execute)
    print(f"\n✅ Sent {sent} follow-ups")
    
    # Stats
    stats = get_followup_stats()
    print(f"\n📊 Stats: {stats['scheduled']} scheduled | {stats['sent']} sent | {stats['due_now']} due now")
    
    return stats

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)