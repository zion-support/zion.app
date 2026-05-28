#!/usr/bin/env python3
"""
V20 - Multi-Channel Orchestration Engine
Unified response across email, SMS, WhatsApp
"""

import sys
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

class MultiChannelOrchestrator:
    """Routes responses to appropriate channel based on urgency and preferences"""
    
    def __init__(self):
        self.channel_prefs = {}  # sender -> preferred channel
    
    def detect_channel_hint(self, subject, snippet):
        """Detect if sender mentions a preferred channel"""
        text = f"{subject} {snippet}".lower()
        
        hints = {
            'whatsapp': ['whatsapp', 'zap', 'wpp'],
            'sms': ['sms', 'text', 'text me'],
            'email': ['email', 'e-mail'],
            'phone': ['call', 'phone', 'ring']
        }
        
        for channel, keywords in hints.items():
            for kw in keywords:
                if kw in text:
                    return channel
        
        return 'email'  # Default
    
    def route_response(self, sender, urgency, content):
        """Determine which channel to use"""
        preferred = self.channel_prefs.get(sender, 'email')
        detected = self.detect_channel_hint(sender, content[:100])
        
        # Override based on urgency
        if urgency == 'urgent':
            return 'sms'  # Most immediate
        elif urgency == 'booking':
            return preferred  # Respect preference
        
        return detected or preferred or 'email'
    
    def format_for_channel(self, content, channel):
        """Format response for specific channel"""
        formats = {
            'sms': lambda c: c[:160],  # SMS limit
            'whatsapp': lambda c: c,  # Full support
            'email': lambda c: c,  # Full email
            'phone': lambda c: f"VOICE_MESSAGE: {c[:100]}"  # Summary for call
        }
        return formats.get(channel, lambda c: c)(content)

class RevenueIntelligence:
    """Detects upsell and follow-up opportunities"""
    
    def __init__(self):
        self.opportunity_keywords = {
            'upsell': ['upgrade', 'larger', 'more', 'premium', 'luxo', 'melhor'],
            'cross_sell': ['also need', 'looking for', 'similar', 'tambem', 'igual'],
            'follow_up': ['thinking', 'considering', 'still interested', 'ainda', 'pensando']
        }
    
    def detect_opportunities(self, subject, snippet, sender_history):
        """Find revenue opportunities in conversation"""
        text = f"{subject} {snippet}".lower()
        opportunities = []
        
        for opp_type, keywords in self.opportunity_keywords.items():
            score = sum(1 for kw in keywords if kw in text)
            if score > 0:
                opportunities.append({
                    "type": opp_type,
                    "confidence": score / len(keywords),
                    "suggested_action": self._suggest_action(opp_type)
                })
        
        return opportunities
    
    def _suggest_action(self, opp_type):
        actions = {
            'upsell': "Suggest premium upgrade or additional services",
            'cross_sell': "Recommend complementary services",
            'follow_up': "Schedule follow-up reminder"
        }
        return actions.get(opp_type, "Monitor conversation")

if __name__ == '__main__':
    print("📡 Multi-Channel Orchestration + Revenue Intelligence loaded")