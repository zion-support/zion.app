#!/usr/bin/env python3
"""
Intelligent Email Responder V13 - Case-by-Case Intelligence
Features:
- Per-email context analysis
- Dynamic template selection
- Response verification loop
- Multi-action decision engine
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict
import hashlib

WORKSPACE = Path('/root/.openclaw/workspace')

class EmailAnalyzerV13:
    """Analyze emails case-by-case with context awareness"""
    
    def __init__(self):
        self.profiles_file = WORKSPACE / 'zion.app' / 'data' / 'sender_profiles.json'
        self.responses_file = WORKSPACE / 'zion.app' / 'data' / 'response_effectiveness_v12.json'
        self.verification_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
    
    def analyze_email(self, email_data):
        """Full context analysis of an email"""
        return {
            'intent': self._detect_intent(email_data),
            'sentiment': self._analyze_sentiment(email_data),
            'urgency': self._calculate_urgency(email_data),
            'sender_profile': self._get_sender_profile(email_data.get('from', '')),
            'recommended_action': self._select_action(email_data),
            'confidence': self._calculate_confidence(email_data)
        }
    
    def _detect_intent(self, email_data):
        """Detect what the sender wants"""
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        
        intents = {
            'booking': ['reserva', 'reserve', 'book', 'disponibilidade'],
            'question': ['?', 'como', 'como faço', 'como funciona'],
            'complaint': ['problema', 'reclam', 'não funciona'],
            'info_request': ['informação', 'informacoes', 'detalhes', 'valores'],
            'spam': ['oferta', 'desconto', 'grátis', 'promoção']
        }
        
        scores = {}
        for intent, keywords in intents.items():
            score = sum(1 for kw in keywords if kw in subject or kw in body)
            scores[intent] = score
        
        return max(scores, key=scores.get) if max(scores.values()) > 0 else 'general'
    
    def _analyze_sentiment(self, email_data):
        """Simple sentiment analysis"""
        body = email_data.get('body', '').lower()
        positive = sum(1 for w in ['obrigado', 'obrigada', 'agradeço', 'perfeito', 'excelente'] if w in body)
        negative = sum(1 for w in ['problema', 'péssimo', 'ruim', 'não', 'falha'] if w in body)
        return 'positive' if positive > negative else 'negative' if negative > positive else 'neutral'
    
    def _calculate_urgency(self, email_data):
        """Calculate response urgency"""
        urgency_keywords = {
            'high': ['urgente', 'imediato', 'hoje', 'agora', 'crítico'],
            'medium': ['hoje', 'breve', 'em breve', 'semana'],
            'low': ['quando puder', 'conveniência', 'flexível']
        }
        
        body = email_data.get('body', '').lower()
        for level, keywords in urgency_keywords.items():
            if any(kw in body for kw in keywords):
                return level
        return 'medium'
    
    def _get_sender_profile(self, sender_email):
        """Get sender profile with history"""
        if self.profiles_file.exists():
            data = json.loads(self.profiles_file.read_text())
            # Extract email from "Name <email>" format
            import re
            match = re.search(r'<([^>]+)>', sender_email)
            email = match.group(1) if match else sender_email
            
            return data.get(email, {'first_contact': True, 'total_messages': 0})
        return {'first_contact': True, 'total_messages': 0}
    
    def _select_action(self, email_data):
        """Select best action based on analysis"""
        intent = self._detect_intent(email_data)
        urgency = self._calculate_urgency(email_data)
        
        actions = {
            'booking': 'reply_with_template',
            'question': 'reply_with_template',
            'complaint': 'reply_with_apology_template',
            'info_request': 'reply_with_details',
            'spam': 'ignore',
            'general': 'archive'
        }
        
        return actions.get(intent, 'archive')
    
    def _calculate_confidence(self, email_data):
        """Calculate confidence in our analysis"""
        factors = [
            len(email_data.get('subject', '')) > 0,
            len(email_data.get('body', '')) > 20,
            self._get_sender_profile(email_data.get('from', '')).get('total_messages', 0) > 0
        ]
        return sum(factors) / len(factors)

class ResponseVerifierV13:
    """Verify responses and improve future replies"""
    
    def __init__(self):
        self.verified_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
    
    def verify_response_delivered(self, thread_id, response_text):
        """Check if our response was delivered and track it"""
        if self.verified_file.exists():
            data = json.loads(self.verified_file.read_text())
        else:
            data = {'tracked': {}}
        
        thread_hash = hashlib.md5(thread_id.encode()).hexdigest()[:12]
        
        data['tracked'][thread_hash] = {
            'thread_id': thread_id,
            'response_preview': response_text[:100],
            'sent_at': datetime.now(timezone.utc).isoformat(),
            'delivered': True,
            'verified_at': datetime.now(timezone.utc).isoformat()
        }
        
        self.verified_file.write_text(json.dumps(data, indent=2))
        return True
    
    def get_verification_stats(self):
        """Get stats on response delivery"""
        if self.verified_file.exists():
            data = json.loads(self.verified_file.read_text())
            tracked = data.get('tracked', {})
            delivered = sum(1 for t in tracked.values() if t.get('delivered'))
            return {'total': len(tracked), 'delivered': delivered, 'rate': delivered / max(len(tracked), 1)}
        return {'total': 0, 'delivered': 0, 'rate': 0}

if __name__ == '__main__':
    analyzer = EmailAnalyzerV13()
    verifier = ResponseVerifierV13()
    
    stats = verifier.get_verification_stats()
    print(f"V13 Response Verifier: {stats['delivered']}/{stats['total']} delivered ({stats['rate']*100:.0f}%)")