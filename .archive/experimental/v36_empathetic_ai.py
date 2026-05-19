#!/usr/bin/env python3
"""
V36 - Emotion Detection & Empathetic Response Engine
Detects sender emotion and responds with appropriate empathy
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_send_reply, gmail_batch_modify, gmail_get_or_create_label_id

LABEL = 'V36-Empathetic-AI'

class EmotionDetector:
    def __init__(self):
        self.emotion_patterns = {
            'positive': ['obrigado', 'excelente', 'otimo', 'fantastico', 'parabens', 'thank', 'great', 'excellent'],
            'negative': ['problema', 'urgente', 'critico', 'insatisfeito', 'problem', 'urgent', 'critical', 'frustrated'],
            'neutral': ['informacao', 'solicito', 'request', 'inquiry', 'reserva', 'booking'],
            'excited': ['ansioso', 'animado', 'eager', 'excited', 'cant wait', 'mal posso esperar']
        }
    
    def detect_emotion(self, text):
        """Detect emotional tone of message"""
        text_lower = text.lower()
        scores = {}
        
        for emotion, keywords in self.emotion_patterns.items():
            scores[emotion] = sum(1 for kw in keywords if kw in text_lower)
        
        return max(scores, key=scores.get) if any(scores.values()) else 'neutral'
    
    def get_empathetic_response(self, emotion, name, dates):
        """Generate empathetic response based on emotion"""
        templates = {
            'positive': [
                f"Ola {name}!\n\nQue otimo receber seu contato! A Mansao na Riviera esta disponivel nos dias {dates}. Fico feliz em ajudar!\n\nUm forte abraco,\nKleber Garcia Alcatrao",
                f"Prezado(a) {name},\n\nObrigado pela mensagem! Confirmamos disponibilidade para {dates}. Sua satisfacao e nossa prioridade!\n\nCordialmente,\nKleber"
            ],
            'negative': [
                f"Prezado(a) {name},\n\nEntendo sua preocupacao e estou aqui para ajudar. A Mansao esta disponivel: {dates}. Vamos resolver isso juntos.\n\nAtenciosamente,\nKleber Garcia Alcatrao",
                f"Ola {name},\n\nPercebi sua urgencia e ja verifiquei: {dates} estao disponiveis. Estou a disposicao para agilizar seu processo.\n\nKleber"
            ],
            'excited': [
                f"Ola {name}!\n\nQue alegria seu entusiasmo! A Mansao na Riviera pode ser sua nos dias {dates}! Vamos fechar?\n\nAbraco,\nKleber",
                f"Oi {name}!\n\nAnimado tambem! {dates} estao livres para sua experiencia incrivel. Conte comigo!\n\nKleber Garcia Alcatrao"
            ],
            'neutral': [
                f"Prezado(a) {name},\n\nInformamos que a Mansao na Riviera esta disponivel nos dias {dates}. Estamos a disposicao.\n\nAtenciosamente,\nKleber Garcia Alcatrao",
                f"Ola {name},\n\nSua solicitacao foi analisada. Mansao disponivel: {dates}. Aguardo seu retorno.\n\nCordialmente,\nKleber"
            ]
        }
        return random.choice(templates.get(emotion, templates['neutral']))

def get_available_dates():
    today = datetime.now()
    dates = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        if d.weekday() < 5:
            dates.append(d.strftime('%d/%m'))
        if len(dates) >= 3:
            break
    return ', '.join(dates)

def cmd_run(dry_run=False, limit=5):
    print("❤️ V36 Empathetic AI Responder")
    print("   Features: Emotion Detection + Empathetic Tone + Personalized Responses")
    
    detector = EmotionDetector()
    msgs = gmail_search('is:unread from:airbnb.com', limit=20)
    label_id = gmail_get_or_create_label_id(LABEL)
    
    stats = {'replied': 0, 'emotions': {}}
    
    for msg in msgs[:limit]:
        try:
            full = gmail_get(msg['id'])
            headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
            sender = headers.get('From', '')
            subject = headers.get('Subject', '')
            snippet = full.get('snippet', '')
            
            name_part = sender.split('<')[0].strip().strip('"') if '<' in sender else sender
            
            emotion = detector.detect_emotion(f"{subject} {snippet}")
            stats['emotions'][emotion] = stats['emotions'].get(emotion, 0) + 1
            
            dates = get_available_dates()
            response = detector.get_empathetic_response(emotion, name_part, dates)
            
            print(f"❤️ {name_part[:25]} | Emotion: {emotion}")
            print(f"   ✅ {response[:70]}...")
            
            if not dry_run:
                gmail_send_reply(msg['id'], response)
                gmail_batch_modify({'ids': [msg['id']]}, addLabelIds=[label_id])
            
            stats['replied'] += 1
                
        except Exception as e:
            print(f"Error: {e}")
            continue
    
    print(f"\n📊 Replied: {stats['replied']} | Emotions: {stats['emotions']}")

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)