#!/usr/bin/env python3
"""V923: Email Crisis Detection System"""
import re
from datetime import datetime
from typing import Dict, List, Any

class CrisisDetection:
    def __init__(self):
        self.crisis_keywords = ['urgent', 'emergency', 'critical', 'disaster', 'outage', 'breach', 'incident', 'escalation', 'complaint', 'lawsuit', 'media']
        self.sentiment_negative = ['angry', 'furious', 'disappointed', 'unacceptable', 'terrible', 'worst', 'failure']
        self.escalation_triggers = ['ceo', 'legal', 'press', 'attorney', 'regulator', 'compliance officer']
        self.crisis_log = []

    def analyze_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        full_text = f"{subject} {body}".lower()
        crisis_score = self._calculate_crisis_score(full_text)
        crisis_type = self._detect_crisis_type(full_text)
        escalation_needed = crisis_score >= 70
        self.crisis_log.append({'timestamp': datetime.now().isoformat(), 'sender': sender, 'score': crisis_score, 'type': crisis_type})
        response = self._generate_crisis_response(crisis_score, crisis_type, escalation_needed, recipients)
        return {'action': 'crisis_detection', 'crisis_score': crisis_score, 'crisis_type': crisis_type, 'escalation_needed': escalation_needed, 'response': response, 'reply_all_required': True, 'notify_management': crisis_score >= 80}

    def _calculate_crisis_score(self, text: str) -> float:
        score = 0.0
        for kw in self.crisis_keywords:
            if kw in text: score += 15
        for neg in self.sentiment_negative:
            if neg in text: score += 10
        for trig in self.escalation_triggers:
            if trig in text: score += 20
        if '!!!' in text: score += 10
        return min(score, 100)

    def _detect_crisis_type(self, text: str) -> str:
        if any(w in text for w in ['breach', 'hack', 'security']): return 'security_incident'
        elif any(w in text for w in ['outage', 'down', 'unavailable']): return 'service_outage'
        elif any(w in text for w in ['lawsuit', 'legal', 'attorney']): return 'legal_threat'
        elif any(w in text for w in ['press', 'media', 'public']): return 'pr_crisis'
        elif any(w in text for w in ['complaint', 'angry', 'furious']): return 'customer_escalation'
        return 'general_urgent'

    def _generate_crisis_response(self, score, crisis_type, escalate, recipients):
        if score >= 80:
            text = f"CRITICAL CRISIS DETECTED (Score: {score}/100)\nType: {crisis_type.replace('_', ' ').title()}\n\n"
            text += "IMMEDIATE ACTIONS:\n1. Notify management team\n2. Activate crisis response protocol\n3. Document all communications\n4. Prepare official statement\n\n"
            text += f"All {len(recipients)} recipients MUST be included in response (Reply All enforced)."
        elif score >= 50:
            text = f"Elevated Risk Detected (Score: {score}/100)\nType: {crisis_type.replace('_', ' ').title()}\n\nMonitor closely. Reply All to {len(recipients)} recipients."
        else:
            text = f"Standard urgency (Score: {score}/100). Normal protocol."
            if len(recipients) > 1: text += f"\nReply All to {len(recipients)} recipients."
        return {'text': text, 'reply_all': True, 'crisis_protocol': score >= 80}

def main():
    detector = CrisisDetection()
    tests = [
        {'sender': 'angry_customer@ex.com', 'subject': 'URGENT: Service outage affecting production', 'body': 'This is UNACCEPTABLE! Your service has been down for 3 hours. Our CEO is furious. We are considering legal action!!!', 'recipients': ['support@ex.com', 'management@ex.com', 'legal@ex.com']},
        {'sender': 'client@ex.com', 'subject': 'Question about billing', 'body': 'Hi, I have a question about my last invoice.', 'recipients': ['billing@ex.com']}
    ]
    print("=" * 60)
    print("V923 Crisis Detection System")
    print("=" * 60)
    for e in tests:
        r = detector.analyze_email(e)
        print(f"\nSender: {e['sender']}")
        print(f"  Score: {r['crisis_score']}/100, Type: {r['crisis_type']}, Escalate: {r['escalation_needed']}, Notify Mgmt: {r['notify_management']}")
    print("\nV923 Crisis Detection: OPERATIONAL")

if __name__ == '__main__':
    main()
