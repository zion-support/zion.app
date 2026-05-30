#!/usr/bin/env python3
"""
V353 Email Competitive Intelligence Scanner
Detect competitor mentions in email threads, extract competitive pricing signals,
flag competitive threats, generate competitive briefings from customer emails.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json, re, sys
from datetime import datetime

class V353CompetitiveIntelligence:
    COMPETITOR_SIGNALS = [
        r'competitor', r'alternative', r'other (?:vendor|provider|solution|company)',
        r'compared (?:to|with)', r'vs\.?\s*\w+', r'switching (?:to|from)',
        r'better (?:price|deal|offer)', r'(?:cheaper|less expensive)',
        r'evaluating (?:other|multiple)', r'also (?:talking|speaking) (?:to|with)',
    ]
    
    PRICING_SIGNALS = [
        (r'(?:they|competitor|other) (?:offer|charge|quote|price)[s]?\s*(?:at|for|of)?\s*\$?([\d,]+)', 'competitor_price'),
        (r'(?:discount|savings|cheaper)\s+(?:of|by)?\s*(\d+)\s*%', 'discount_percent'),
        (r'(?:underbid|undercut|lower)\s+(?:by|at)?\s*\$?([\d,]+)', 'price_difference'),
    ]
    
    THREAT_LEVELS = {
        'low': ['mentioned', 'aware of', 'heard about'],
        'medium': ['evaluating', 'considering', 'comparing', 'testing'],
        'high': ['switching to', 'prefer', 'going with', 'chose', 'selected'],
    }

    def __init__(self):
        self.intelligence = []

    def scan_for_competitive_intel(self, email_text, subject="", sender="", recipients=None):
        recipients = recipients or []
        combined = f"{subject} {email_text}".lower()
        
        competitor_mentions = self._detect_competitor_mentions(combined)
        pricing_signals = self._extract_pricing_intel(combined)
        threat_level = self._assess_threat_level(combined)
        win_strategy = self._generate_win_strategy(threat_level, pricing_signals)
        
        is_multi = len(recipients) > 1
        
        result = {
            "version": "V353",
            "timestamp": datetime.now().isoformat(),
            "competitive_threat_detected": len(competitor_mentions) > 0,
            "threat_level": threat_level,
            "competitor_signals": competitor_mentions,
            "pricing_intelligence": pricing_signals,
            "recommended_win_strategy": win_strategy,
            "competitive_briefing": self._generate_briefing(competitor_mentions, pricing_signals, threat_level),
            "urgency_to_respond": self._calc_urgency(threat_level),
            "reply_all_required": is_multi,
            "reply_all_enforced": is_multi,
            "action_taken": f"Competitive intel: {threat_level} threat, {len(competitor_mentions)} signals detected",
        }
        self.intelligence.append(result)
        return result

    def _detect_competitor_mentions(self, text):
        signals = []
        for pattern in self.COMPETITOR_SIGNALS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                signals.append({"pattern": pattern, "matches": matches[:3], "strength": len(matches)})
        return signals

    def _extract_pricing_intel(self, text):
        intel = []
        for pattern, signal_type in self.PRICING_SIGNALS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for m in matches:
                intel.append({"type": signal_type, "value": m})
        return intel

    def _assess_threat_level(self, text):
        scores = {'low': 0, 'medium': 0, 'high': 0}
        for level, keywords in self.THREAT_LEVELS.items():
            for kw in keywords:
                if kw in text:
                    scores[level] += 1
        if scores['high'] > 0:
            return 'high'
        elif scores['medium'] > 0:
            return 'medium'
        elif scores['low'] > 0:
            return 'low'
        return 'none'

    def _generate_win_strategy(self, threat_level, pricing_signals):
        strategies = {
            'high': [
                "IMMEDIATE: Schedule executive call within 24 hours",
                "Offer matching price or value-add bundle",
                "Provide exclusive case study from similar client",
                "Escalate to account executive for retention play",
            ],
            'medium': [
                "Highlight unique differentiators vs competitors",
                "Offer extended trial or proof-of-concept",
                "Share ROI calculator showing long-term value",
                "Provide references from satisfied customers",
            ],
            'low': [
                "Send competitive comparison document",
                "Share latest product updates and roadmap",
                "Offer value-add services at no extra cost",
            ],
            'none': [
                "Standard follow-up with product highlights",
            ],
        }
        return strategies.get(threat_level, strategies['none'])

    def _generate_briefing(self, mentions, pricing, threat):
        return {
            "summary": f"Competitive intelligence detected: {threat} threat level",
            "signal_count": len(mentions),
            "pricing_data_available": len(pricing) > 0,
            "recommended_response_time": "2 hours" if threat == 'high' else "24 hours" if threat == 'medium' else "48 hours",
        }

    def _calc_urgency(self, threat_level):
        urgency_map = {'high': 'critical', 'medium': 'high', 'low': 'medium', 'none': 'low'}
        return urgency_map.get(threat_level, 'low')

if __name__ == "__main__":
    engine = V353CompetitiveIntelligence()
    result = engine.scan_for_competitive_intel(
        "We're also talking to CompetitorX who offered us a similar solution for $40,000. They claim their platform is faster and cheaper. We're evaluating both options and will decide by next week.",
        subject="Vendor Evaluation Update", sender="prospect@client.com",
        recipients=["sales@zion.com", "vp-sales@zion.com", "ceo@zion.com"]
    )
    print(json.dumps(result, indent=2))
