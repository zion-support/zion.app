#!/usr/bin/env python3
"""
Test Ollama Responder with Airbnb emails
"""

import sys
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/lib')

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_get_or_create_label_id
from datetime import datetime, timedelta
import json
import urllib.request

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"
LABEL_DONE = 'Autonomous-Ollama-V18'

def generate_reply(prompt):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "system": "You are a CEO assistant for Zion Tech Group. Be concise, professional, and helpful.",
        "stream": False,
        "options": {"temperature": 0.7, "max_tokens": 300}
    }
    req = urllib.request.Request(OLLAMA_URL, data=json.dumps(payload).encode(),
                                  headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode()).get('response', '').strip()

# Get Airbnb emails
airbnb = gmail_search('is:unread from:airbnb.com', limit=3)
print(f"Processing {len(airbnb)} Airbnb emails")

label_id = gmail_get_or_create_label_id(LABEL_DONE)

for m in airbnb:
    full = gmail_get(m['id'])
    headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
    sender = headers.get('From', '')
    subject = headers.get('Subject', '')
    snippet = full.get('snippet', '')
    
    # Get availability
    today = datetime.now()
    available = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            available.append(d.strftime('%d/%m'))
        if len(available) >= 3:
            break
    avail_text = ', '.join(available)
    
    # Detect language
    text = f"{subject} {snippet}".lower()
    pt_count = sum(1 for w in ['reserva', 'consulta', 'responder'] if w in text)
    language = 'pt' if pt_count > 0 else 'en'
    
    # Build prompt
    if language == 'pt':
        prompt = f"Email de Airbnb sobre reserva. Assunto: {subject}\n\nResponda profissionalmente em português. Mencione dias disponíveis: {avail_text}. Mantenha tom cordial."
    else:
        prompt = f"Airbnb booking. Subject: {subject}\n\nRespond professionally in English. Available: {avail_text}."
    
    print(f"Sender: {sender[:40]}")
    print(f"Subject: {subject[:50]}")
    print(f"Language: {language}")
    
    reply = generate_reply(prompt)
    print(f"Reply: {reply[:100]}...")
    
    gmail_send_reply(m['id'], reply)
    gmail_batch_modify({'ids': [m['id']]}, addLabelIds=[label_id])
    print("---")