#!/usr/bin/env python3
"""V924: Email Negotiation Intelligence"""
import re
from datetime import datetime
from typing import Dict, List, Any

class NegotiationIntelligence:
    def __init__(self):
        self.negotiation_keywords = ['discount', 'negotiate', 'offer', 'counter', 'terms', 'price', 'concession', 'deal', 'compromise']
        self.pressure_indicators = ['final offer', 'walk away', 'deadline', 'other options', 'competitor', 'better deal']
        self.agreement_signals = ['agree', 'accept', 'sounds good', 'proceed', 'sign', 'move forward']
        self.negotiation_log = []

    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        recipients = email_data.get('recipients', [])
        full_text = f"{subject} {body}".lower()
        is_negotiation = any(kw in full_text for kw in self.negotiation_keywords)
        if not is_negotiation:
            return {'action': 'no_negotiation', 'is_negotiation': False}
        pressure_level = self._detect_pressure(full_text)
        agreement_likelihood = self._detect_agreement(full_text)
        suggested_strategy = self._recommend_strategy(pressure_level, agreement_likelihood)
        concessions = self._track_concessions(body)
        self.negotiation_log.append({'timestamp': datetime.now().isoformat(), 'pressure': pressure_level, 'agreement': agreement_likelihood})
        response = self._generate_response(pressure_level, agreement_likelihood, suggested_strategy, concessions, recipients)
        return {'action': 'negotiation_analysis', 'is_negotiation': True, 'pressure_level': pressure_level, 'agreement_likelihood': agreement_likelihood, 'suggested_strategy': suggested_strategy, 'concessions': concessions, 'response': response, 'reply_all_required': len(recipients) > 1}

    def _detect_pressure(self, text: str) -> float:
        pressure = 0.0
        for ind in self.pressure_indicators:
            if ind in text: pressure += 20
        return min(pressure, 100)

    def _detect_agreement(self, text: str) -> float:
        agreement = 0.0
        for sig in self.agreement_signals:
            if sig in text: agreement += 25
        return min(agreement, 100)

    def _recommend_strategy(self, pressure, agreement):
        if pressure > 60 and agreement < 30:
            return "HOLD FIRM - Counterparty under pressure. Maintain position."
        elif agreement > 60:
            return "CLOSE DEAL - Strong agreement signals. Finalize terms."
        elif pressure > 40:
            return "STRATEGIC CONCESSION - Small concession to build momentum."
        return "EXPLORE OPTIONS - Gather more information."

    def _track_concessions(self, text: str) -> List[str]:
        concessions = []
        match = re.search(r'(\d+)%\s*discount', text, re.IGNORECASE)
        if match: concessions.append(f"{match.group(1)}% discount offered")
        if 'free' in text.lower(): concessions.append("Free service/addon mentioned")
        if 'extend' in text.lower() and 'trial' in text.lower(): concessions.append("Extended trial period")
        return concessions

    def _generate_response(self, pressure, agreement, strategy, concessions, recipients):
        text = f"Negotiation Analysis\n\nPressure Level: {pressure:.0f}/100\nAgreement Likelihood: {agreement:.0f}/100\n\nRecommended Strategy:\n{strategy}\n\n"
        if concessions:
            text += "Concessions Tracked:\n"
            for c in concessions: text += f"  - {c}\n"
        if len(recipients) > 1: text += f"\nReply All to {len(recipients)} negotiation participants."
        return {'text': text, 'reply_all': len(recipients) > 1, 'strategy_alert': pressure > 60}

def main():
    engine = NegotiationIntelligence()
    tests = [
        {'subject': 'Counter offer on pricing', 'body': 'We need a 15% discount to proceed. This is our final offer. We have other options from competitors.', 'recipients': ['sales@ex.com', 'management@ex.com']},
        {'subject': 'Agreement on terms', 'body': 'The terms sound good. We accept the proposal and are ready to sign.', 'recipients': ['legal@ex.com', 'sales@ex.com', 'finance@ex.com']},
        {'subject': 'Regular update', 'body': 'Here is the weekly status report.', 'recipients': ['team@ex.com']}
    ]
    print("=" * 60)
    print("V924 Negotiation Intelligence")
    print("=" * 60)
    for e in tests:
        r = engine.analyze_email(e)
        print(f"\nSubject: {e['subject']}")
        if r['is_negotiation']:
            print(f"  Pressure: {r['pressure_level']:.0f}, Agreement: {r['agreement_likelihood']:.0f}")
            print(f"  Strategy: {r['suggested_strategy']}")
            print(f"  Reply All: {r['reply_all_required']}")
        else:
            print("  Not a negotiation")
    print("\nV924 Negotiation Intelligence: OPERATIONAL")

if __name__ == '__main__':
    main()
