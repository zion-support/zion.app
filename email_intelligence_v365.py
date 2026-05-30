#!/usr/bin/env python3
"""
V365: Email Security Threat Hunter
Proactive threat hunting, detect advanced persistent threats (APTs),
identify compromised accounts from behavior changes, hunt for lateral movement,
generate threat intelligence reports.
"""
import re
import json
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

class SecurityThreatHunter:
    def __init__(self):
        self.phishing_patterns = [
            r'verify your (?:account|password|identity)',
            r'urgent.*action required',
            r'click (?:here|this link) (?:immediately|now)',
            r'account (?:suspended|locked|compromised)',
            r'unusual (?:activity|login|sign-in)'
        ]
        self.social_engineering_patterns = [
            r'(?:CEO|executive|manager) (?:request|asking)',
            r'wire transfer', r'gift card', r'confidential.*do not share',
            r'personal email', r'bypass.*procedure'
        ]
        self.malware_indicators = [
            r'\.exe\b', r'\.zip\b.*password', r'encrypted.*attachment',
            r'macro.*enabled', r'enable.*content'
        ]
        self.lateral_movement_patterns = [
            r'forward.*to.*(?:all|everyone|distribution)',
            r'internal.*only.*forward',
            r'sensitive.*document.*share'
        ]
    
    def detect_phishing_attempts(self, emails: List[Dict]) -> Dict:
        """Detect phishing and social engineering attempts"""
        threats = []
        for email in emails:
            body = email.get('body', '').lower()
            subject = email.get('subject', '').lower()
            combined = f"{subject} {body}"
            
            threat_score = 0
            matched_patterns = []
            
            # Check phishing patterns
            for pattern in self.phishing_patterns:
                if re.search(pattern, combined):
                    threat_score += 2
                    matched_patterns.append(f'phishing: {pattern}')
            
            # Check social engineering
            for pattern in self.social_engineering_patterns:
                if re.search(pattern, combined):
                    threat_score += 3
                    matched_patterns.append(f'social_engineering: {pattern}')
            
            # Check for urgency + action combination
            if re.search(r'urgent|immediately|asap', combined) and \
               re.search(r'click|verify|confirm|send', combined):
                threat_score += 2
                matched_patterns.append('urgency_action_combo')
            
            if threat_score > 0:
                threats.append({
                    'email_sender': email.get('sender'),
                    'threat_score': threat_score,
                    'severity': 'high' if threat_score >= 5 else 'medium' if threat_score >= 3 else 'low',
                    'matched_patterns': matched_patterns,
                    'timestamp': email.get('timestamp')
                })
        
        return {
            'threats_detected': len(threats),
            'threats': threats,
            'risk_level': self._calculate_risk_level(threats)
        }
    
    def detect_behavior_anomalies(self, emails: List[Dict], baseline: Dict = None) -> Dict:
        """Detect anomalous behavior that might indicate compromised accounts"""
        anomalies = []
        
        # Analyze sending patterns
        sender_stats = defaultdict(lambda: {'count': 0, 'hours': [], 'recipients': set()})
        
        for email in emails:
            sender = email.get('sender', '')
            timestamp = email.get('timestamp')
            recipients = email.get('recipients', [])
            
            sender_stats[sender]['count'] += 1
            sender_stats[sender]['recipients'].update(recipients)
            
            if timestamp:
                try:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    sender_stats[sender]['hours'].append(dt.hour)
                except:
                    pass
        
        # Detect anomalies
        for sender, stats in sender_stats.items():
            # Unusual sending hours
            if stats['hours']:
                avg_hour = sum(stats['hours']) / len(stats['hours'])
                if avg_hour < 5 or avg_hour > 22:
                    anomalies.append({
                        'type': 'unusual_hours',
                        'account': sender,
                        'avg_hour': round(avg_hour, 1),
                        'severity': 'medium'
                    })
            
            # Unusual recipient count
            if len(stats['recipients']) > 20:
                anomalies.append({
                    'type': 'mass_recipients',
                    'account': sender,
                    'recipient_count': len(stats['recipients']),
                    'severity': 'high'
                })
        
        return {
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'accounts_monitored': len(sender_stats)
        }
    
    def detect_lateral_movement(self, emails: List[Dict]) -> Dict:
        """Detect potential lateral movement patterns"""
        movements = []
        
        for email in emails:
            body = email.get('body', '').lower()
            recipients = email.get('recipients', [])
            
            # Check for forwarding patterns
            if len(recipients) > 5:
                for pattern in self.lateral_movement_patterns:
                    if re.search(pattern, body):
                        movements.append({
                            'type': 'bulk_forward',
                            'sender': email.get('sender'),
                            'recipient_count': len(recipients),
                            'pattern': pattern,
                            'severity': 'high',
                            'timestamp': email.get('timestamp')
                        })
                        break
        
        return {
            'movements_detected': len(movements),
            'movements': movements,
            'risk_level': 'high' if len(movements) > 0 else 'low'
        }
    
    def _calculate_risk_level(self, threats: List[Dict]) -> str:
        """Calculate overall risk level"""
        if not threats:
            return 'low'
        
        max_score = max(t['threat_score'] for t in threats)
        high_severity_count = sum(1 for t in threats if t['severity'] == 'high')
        
        if max_score >= 7 or high_severity_count >= 2:
            return 'critical'
        elif max_score >= 5 or high_severity_count >= 1:
            return 'high'
        elif max_score >= 3:
            return 'medium'
        return 'low'
    
    def generate_threat_report(self, emails: List[Dict]) -> Dict:
        """Generate comprehensive threat intelligence report"""
        phishing = self.detect_phishing_attempts(emails)
        anomalies = self.detect_behavior_anomalies(emails)
        lateral = self.detect_lateral_movement(emails)
        
        # Overall threat assessment
        threat_levels = [phishing['risk_level'], anomalies.get('anomalies_detected', 0) > 0 and 'medium' or 'low', lateral['risk_level']]
        overall_risk = 'critical' if 'critical' in threat_levels else 'high' if 'high' in threat_levels else 'medium' if 'medium' in threat_levels else 'low'
        
        recipients = emails[-1].get('recipients', []) if emails else []
        reply_all_required = len(recipients) > 1
        
        # Recommendations
        recommendations = []
        if phishing['threats_detected'] > 0:
            recommendations.append('Conduct immediate security awareness training')
            recommendations.append('Review and update email filtering rules')
        if anomalies['anomalies_detected'] > 0:
            recommendations.append('Investigate flagged accounts for compromise')
            recommendations.append('Implement additional authentication controls')
        if lateral['movements_detected'] > 0:
            recommendations.append('Review data loss prevention policies')
            recommendations.append('Audit email forwarding rules')
        
        return {
            'engine': 'V365',
            'overall_risk_level': overall_risk,
            'phishing_analysis': phishing,
            'behavior_anomalies': anomalies,
            'lateral_movement': lateral,
            'recommendations': recommendations,
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == '__main__':
    hunter = SecurityThreatHunter()
    sample_emails = [
        {
            'sender': 'suspicious@external.com',
            'recipients': ['employee@company.com'],
            'body': 'Urgent: Your account has been compromised. Click here immediately to verify your password.',
            'timestamp': '2024-01-15T03:00:00',
            'subject': 'Account Security Alert'
        },
        {
            'sender': 'ceo@company.com',
            'recipients': ['finance@company.com', 'hr@company.com', 'it@company.com', 'sales@company.com', 'marketing@company.com'],
            'body': 'Forward this sensitive document to all departments. Internal only, do not share externally.',
            'timestamp': '2024-01-15T02:30:00',
            'subject': 'Confidential: Q4 Financial Data'
        }
    ]
    
    result = hunter.generate_threat_report(sample_emails)
    print(json.dumps(result, indent=2))
