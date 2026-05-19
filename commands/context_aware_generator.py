#!/usr/bin/env python3
"""Context-Aware Response Generator - Uses conversation history for smarter replies"""

import sys, json
from pathlib import Path
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import gmail_get_thread, gmail_get, gmail_send_reply_fixed
except: pass

HISTORY_FILE = Path('/root/.openclaw/workspace/zion.app/data/conversation_context.json')

def get_thread_context(thread_id):
    """Build context from previous messages in thread"""
    context = {'previous_replies': [], 'sender_history': {}}
    try:
        thread = gmail_get_thread(thread_id)
        for msg in thread.get('messages', []):
            headers = msg.get('payload', {}).get('headers', [])
            sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
            snippet = msg.get('snippet', '')
            context['previous_replies'].append({'sender': sender, 'snippet': snippet})
    except: pass
    return context

def generate_contextual_reply(thread_id, intent, language):
    """Generate reply using conversation history"""
    context = get_thread_context(thread_id)
    
    if language == 'pt':
        if intent == 'booking':
            return f"Olá! Recebi sua mensagem de reserva. Vou verificar disponibilidade e retorno em breve.\n\n[]" 
            + (f"\n\nContexto: Conversa anterior detectada" if context['previous_replies'] else "")
        return "Prezado(a), obrigado pela mensagem. Analisarei e retorno com detalhes.\n\nKleber"
    else:
        templates = {
            'booking': "Hi! Received your booking inquiry. Checking availability and will confirm shortly.",
            'urgent': "Received your urgent message. Taking immediate action.",
            'sales': "Thanks for your interest. Preparing a detailed proposal.",
            'general': "Thank you for your email. I'll review and respond with details."
        }
        return templates.get(intent, templates['general'])

if __name__ == '__main__':
    print("✅ Context-Aware Response Generator ready")