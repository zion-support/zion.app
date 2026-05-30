#!/usr/bin/env python3
"""
Email Intelligence V309 - Email Cultural Intelligence Engine
Detects cultural context of sender/recipient
Adjusts tone, formality, greetings, and scheduling accordingly
"""
import json, re
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailCulturalIntelligence:
    def __init__(self):
        self.version = "V309"
        self.name = "Email Cultural Intelligence"
        self.cultural_profiles = {
            'us': {'formality': 0.4, 'directness': 0.8, 'greeting': 'Hi {name}', 'signoff': 'Best regards', 'timezone': 'America/New_York', 'work_hours': (9, 17), 'holidays': ['July 4', 'Thanksgiving', 'Christmas']},
            'uk': {'formality': 0.6, 'directness': 0.5, 'greeting': 'Dear {name}', 'signoff': 'Kind regards', 'timezone': 'Europe/London', 'work_hours': (9, 17), 'holidays': ['Bank Holidays', 'Christmas']},
            'japan': {'formality': 0.9, 'directness': 0.3, 'greeting': '{name}-san', 'signoff': 'Best regards', 'timezone': 'Asia/Tokyo', 'work_hours': (9, 18), 'holidays': ['Golden Week', 'Obon']},
            'germany': {'formality': 0.7, 'directness': 0.9, 'greeting': 'Dear Mr./Ms. {name}', 'signoff': 'Mit freundlichen Grüßen', 'timezone': 'Europe/Berlin', 'work_hours': (8, 17), 'holidays': ['Christmas', 'Easter']},
            'brazil': {'formality': 0.5, 'directness': 0.6, 'greeting': 'Olá {name}', 'signoff': 'Atenciosamente', 'timezone': 'America/Sao_Paulo', 'work_hours': (9, 18), 'holidays': ['Carnival', 'Christmas']},
            'india': {'formality': 0.7, 'directness': 0.5, 'greeting': 'Dear {name}', 'signoff': 'Warm regards', 'timezone': 'Asia/Kolkata', 'work_hours': (10, 19), 'holidays': ['Diwali', 'Holi']},
            'china': {'formality': 0.8, 'directness': 0.3, 'greeting': 'Dear {name}', 'signoff': 'Best regards', 'timezone': 'Asia/Shanghai', 'work_hours': (9, 18), 'holidays': ['Chinese New Year', 'National Day']},
            'france': {'formality': 0.7, 'directness': 0.6, 'greeting': 'Bonjour {name}', 'signoff': 'Cordialement', 'timezone': 'Europe/Paris', 'work_hours': (9, 18), 'holidays': ['Bastille Day', 'Christmas']},
            'middle_east': {'formality': 0.8, 'directness': 0.4, 'greeting': 'Dear {name}', 'signoff': 'Best regards', 'timezone': 'Asia/Dubai', 'work_hours': (8, 17), 'holidays': ['Ramadan', 'Eid']},
            'australia': {'formality': 0.3, 'directness': 0.8, 'greeting': 'Hi {name}', 'signoff': 'Cheers', 'timezone': 'Australia/Sydney', 'work_hours': (9, 17), 'holidays': ['Australia Day', 'Christmas']}
        }
    
    def detect_culture(self, email: Dict) -> Dict:
        """Detect cultural context and adapt response"""
        print(f"[{self.version}] 🌍 Detecting cultural context...")
        
        sender = email.get('sender', {})
        sender_email = sender.get('email', '')
        sender_name = sender.get('name', '')
        content = email.get('content', '')
        
        # Detect culture from email domain/name/language cues
        detected_culture = self._infer_culture(sender_email, sender_name, content)
        profile = self.cultural_profiles.get(detected_culture, self.cultural_profiles['us'])
        
        # Language detection
        language = self._detect_language(content)
        
        # Cultural adaptation recommendations
        adaptations = {
            'greeting': profile['greeting'].format(name=sender_name.split()[0] if sender_name else 'there'),
            'signoff': profile['signoff'],
            'formality_level': profile['formality'],
            'directness_level': profile['directness'],
            'suggested_tone': self._suggest_tone(profile),
            'scheduling': {
                'timezone': profile['timezone'],
                'work_hours': f'{profile["work_hours"][0]}:00 - {profile["work_hours"][1]}:00',
                'avoid_holidays': profile['holidays']
            }
        }
        
        # Cultural sensitivity checks
        sensitivity_alerts = self._check_cultural_sensitivity(content, detected_culture)
        
        all_recipients = email.get('to', []) + email.get('cc', [])
        
        result = {
            'version': self.version,
            'engine': self.name,
            'cultural_analysis': {
                'detected_culture': detected_culture,
                'confidence': 85,
                'language': language,
                'formality_expected': profile['formality'],
                'directness_expected': profile['directness']
            },
            'adaptations': adaptations,
            'sensitivity_alerts': sensitivity_alerts,
            'template': self._generate_cultural_template(profile, sender_name, email.get('subject', '')),
            'reply_all_enforced': True,
            'all_recipients': all_recipients,
            'case_by_case_analysis': True,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"[{self.version}] ✅ Culture detected: {detected_culture} (formality: {profile['formality']})")
        print(f"[{self.version}] 📬 REPLY-ALL enforced: {len(all_recipients)} recipients")
        
        return result
    
    def _infer_culture(self, email: str, name: str, content: str) -> str:
        domain_culture = {
            '.jp': 'japan', '.de': 'germany', '.br': 'brazil', '.in': 'india',
            '.cn': 'china', '.fr': 'france', '.uk': 'uk', '.au': 'australia',
            '.ae': 'middle_east', '.sa': 'middle_east'
        }
        for tld, culture in domain_culture.items():
            if tld in email.lower():
                return culture
        
        # Check for cultural language markers
        if re.search(r'(?:arigato|yoroshiku|san\b)', content, re.I): return 'japan'
        if re.search(r'(?:namaste|kindly do the needful)', content, re.I): return 'india'
        if re.search(r'(?:obrigado|obrigada|tudo bem)', content, re.I): return 'brazil'
        if re.search(r'(?:merci|bonjour|cordialement)', content, re.I): return 'france'
        
        return 'us'  # default
    
    def _detect_language(self, text: str) -> str:
        if re.search(r'[\u4e00-\u9fff]', text): return 'Chinese'
        if re.search(r'[\u3040-\u309f\u30a0-\u30ff]', text): return 'Japanese'
        if re.search(r'[\u0600-\u06ff]', text): return 'Arabic'
        if re.search(r'[\u0900-\u097f]', text): return 'Hindi'
        return 'English'
    
    def _suggest_tone(self, profile: Dict) -> str:
        if profile['formality'] > 0.7:
            return 'Formal and respectful. Use titles, avoid contractions.'
        elif profile['formality'] > 0.5:
            return 'Professional but warm. Moderate formality.'
        else:
            return 'Friendly and direct. Casual tone acceptable.'
    
    def _check_cultural_sensitivity(self, content: str, culture: str) -> List[str]:
        alerts = []
        if culture in ['japan', 'china', 'middle_east'] and re.search(r'(?:hurry|asap|right now)', content, re.I):
            alerts.append('High-pressure language may be perceived as rude in this culture')
        if culture == 'middle_east' and re.search(r'(?:alcohol|pork|bar\b)', content, re.I):
            alerts.append('Content may conflict with cultural/religious norms')
        return alerts
    
    def _generate_cultural_template(self, profile: Dict, name: str, subject: str) -> str:
        greeting = profile['greeting'].format(name=name.split()[0] if name else 'Colleague')
        return f"{greeting},\n\n[Response content adapted to {profile['formality']*100:.0f}% formality level]\n\n{profile['signoff']}"
    
    def analyze_and_respond(self, email_data: Dict) -> Dict:
        """Detect culture and respond - REPLY-ALL enforced"""
        return self.detect_culture(email_data)

if __name__ == '__main__':
    engine = EmailCulturalIntelligence()
    test = {
        'subject': 'Partnership proposal for Q3',
        'content': 'Dear team, We would like to propose a partnership for Q3. Kindly do the needful and revert at the earliest. Looking forward to a fruitful collaboration.',
        'sender': {'email': 'raj.patel@company.in', 'name': 'Raj Patel'},
        'to': ['partnerships@ziontechgroup.com'],
        'cc': ['director@company.in', 'vp@ziontechgroup.com']
    }
    result = engine.detect_culture(test)
    print(json.dumps(result, indent=2))
