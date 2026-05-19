#!/usr/bin/env python3
"""
Sender Relationship Learning - Builds profiles for personalized responses
"""

import json
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
PROFILE_FILE = WORKSPACE / 'zion.app' / 'data' / 'sender_profiles.json'

def load_profiles():
    if PROFILE_FILE.exists():
        return json.loads(PROFILE_FILE.read_text())
    return {}

def save_profiles(profiles):
    PROFILE_FILE.parent.mkdir(parents=True, exist_ok=True)
    PROFILE_FILE.write_text(json.dumps(profiles, indent=2))

def analyze_message(text):
    """Analyze message characteristics"""
    text_lower = text.lower()
    
    # Formality detection
    formal_words = ['prezado', 'atenciosamente', 'cordialmente', 'respeitosamente']
    casual_words = ['oi', 'olá', 'obrigado!', 'valeu', 'td bem']
    
    formal = sum(1 for w in formal_words if w in text_lower)
    casual = sum(1 for w in casual_words if w in text_lower)
    
    # Language detection
    pt_words = ['obrigado', 'prezado', 'atenciosamente', 'prezada', 'agradeço']
    en_words = ['thanks', 'dear', 'regards', 'sincerely', 'best']
    
    pt_score = sum(1 for w in pt_words if w in text_lower)
    en_score = sum(1 for w in en_words if w in text_lower)
    
    # Preferred language
    lang = 'pt' if pt_score >= en_score else 'en'
    
    return {
        'formality': 'formal' if formal > casual else 'casual',
        'language': lang,
        'formal_score': formal,
        'casual_score': casual
    }

def update_sender_profile(sender, subject, snippet):
    """Update profile based on new message"""
    profiles = load_profiles()
    
    domain = sender.split('@')[-1] if '@' in sender else sender
    text = f"{subject} {snippet}".lower()
    
    analysis = analyze_message(text)
    
    if domain not in profiles:
        profiles[domain] = {
            'formality': 'neutral',
            'language': 'en',
            'total_messages': 0,
            'last_updated': None
        }
    
    # Update based on latest message
    profiles[domain]['formality'] = analysis['formality']
    profiles[domain]['language'] = analysis['language']
    profiles[domain]['total_messages'] += 1
    profiles[domain]['last_updated'] = datetime.utcnow().isoformat()
    
    save_profiles(profiles)
    return profiles[domain]

def get_reply_style(sender):
    """Get recommended reply style for sender"""
    profiles = load_profiles()
    domain = sender.split('@')[-1] if '@' in sender else sender
    
    if domain in profiles:
        profile = profiles[domain]
        return {
            'formality': profile.get('formality', 'formal'),
            'language': profile.get('language', 'pt' if 'airbnb' in domain else 'en')
        }
    
    return {'formality': 'formal', 'language': 'pt'}  # Default for Airbnb

if __name__ == '__main__':
    # Test
    test_sender = "Airbnb <express@airbnb.com>"
    profile = update_sender_profile(test_sender, "Reserva para Mansão", "Para sua proteção")
    print(f"Profile: {profile}")