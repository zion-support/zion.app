#!/usr/bin/env python3
"""V288: Email Security Sentinel — Advanced phishing/malware detection,
sender authentication, attachment/link scanning, threat intelligence.
Always enforces reply-all for multi-recipient emails."""
import json, re, hashlib
from datetime import datetime
from urllib.parse import urlparse

class EmailSecuritySentinel:
    def __init__(self):
        self.threat_database = {
            'known_phishing_domains': ['suspicious-domain.xyz', 'fake-bank.com', 'malware-site.ru'],
            'suspicious_patterns': [
                r'urgent.*verify.*account',
                r'click.*here.*immediately',
                r'account.*suspended.*click',
                r'confirm.*identity.*now'
            ],
            'malware_extensions': ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js']
        }
        self.sender_reputation = {}
        self.threat_log = []
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        attachments = email_data.get('attachments', [])
        
        # Validate sender
        sender_validation = self._validate_sender(sender)
        
        # Scan for phishing
        phishing_scan = self._scan_phishing(subject, body)
        
        # Scan attachments
        attachment_scan = self._scan_attachments(attachments)
        
        # Scan links
        link_scan = self._scan_links(body)
        
        # Calculate threat score
        threat_score = self._calculate_threat_score(
            sender_validation, phishing_scan, attachment_scan, link_scan
        )
        
        # Generate security response
        response = self._generate_security_response(
            email_data, threat_score, sender_validation, phishing_scan, attachment_scan, link_scan
        )
        
        # Log threat
        if threat_score > 50:
            self._log_threat(sender, subject, threat_score)
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V288-SecuritySentinel',
            'threat_score': threat_score,
            'threat_level': self._get_threat_level(threat_score),
            'sender_validation': sender_validation,
            'phishing_scan': phishing_scan,
            'attachment_scan': attachment_scan,
            'link_scan': link_scan,
            'action_recommended': self._get_action(threat_score),
            'response': response,
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1 and threat_score < 70
        }
    
    def _validate_sender(self, sender):
        domain = sender.split('@')[-1] if '@' in sender else sender
        
        # Check domain reputation
        reputation = self.sender_reputation.get(domain, 50)
        
        # Check for suspicious patterns
        suspicious = False
        if re.search(r'\d{5,}', domain):  # Lots of numbers
            suspicious = True
            reputation -= 20
        if '-' in domain and len(domain) > 30:  # Long hyphenated domains
            suspicious = True
            reputation -= 15
        
        # SPF/DKIM/DMARC simulation
        authentication = {
            'spf': 'pass' if reputation > 40 else 'fail',
            'dkim': 'pass' if reputation > 50 else 'fail',
            'dmarc': 'pass' if reputation > 60 else 'fail'
        }
        
        return {
            'domain': domain,
            'reputation': max(0, min(100, reputation)),
            'suspicious': suspicious,
            'authentication': authentication,
            'verified': reputation > 70
        }
    
    def _scan_phishing(self, subject, body):
        text = (subject + ' ' + body).lower()
        threats = []
        
        # Check for suspicious patterns
        for pattern in self.threat_database['suspicious_patterns']:
            if re.search(pattern, text, re.IGNORECASE):
                threats.append({
                    'type': 'phishing_pattern',
                    'pattern': pattern,
                    'severity': 'high'
                })
        
        # Check for urgency tactics
        urgency_words = ['urgent', 'immediately', 'asap', 'emergency', 'account suspended']
        if sum(1 for word in urgency_words if word in text) >= 2:
            threats.append({
                'type': 'urgency_tactics',
                'severity': 'medium'
            })
        
        # Check for credential requests
        if any(word in text for word in ['password', 'ssn', 'social security', 'credit card']):
            threats.append({
                'type': 'credential_request',
                'severity': 'critical'
            })
        
        return {
            'threats_detected': len(threats),
            'threats': threats,
            'phishing_score': min(100, len(threats) * 25)
        }
    
    def _scan_attachments(self, attachments):
        if not attachments:
            return {'attachments_scanned': 0, 'threats': [], 'safe': True}
        
        threats = []
        for attachment in attachments:
            filename = attachment.get('filename', '')
            ext = filename.split('.')[-1].lower() if '.' in filename else ''
            
            # Check for malicious extensions
            if f'.{ext}' in self.threat_database['malware_extensions']:
                threats.append({
                    'filename': filename,
                    'type': 'malicious_extension',
                    'extension': ext,
                    'severity': 'critical'
                })
            
            # Check for double extensions
            if filename.count('.') > 1:
                threats.append({
                    'filename': filename,
                    'type': 'double_extension',
                    'severity': 'high'
                })
        
        return {
            'attachments_scanned': len(attachments),
            'threats': threats,
            'safe': len(threats) == 0
        }
    
    def _scan_links(self, body):
        # Extract URLs
        url_pattern = r'https?://[^\s<>"\']+'
        urls = re.findall(url_pattern, body)
        
        if not urls:
            return {'links_scanned': 0, 'threats': [], 'safe': True}
        
        threats = []
        for url in urls:
            parsed = urlparse(url)
            domain = parsed.netloc
            
            # Check against known phishing domains
            if domain in self.threat_database['known_phishing_domains']:
                threats.append({
                    'url': url,
                    'type': 'known_phishing_domain',
                    'domain': domain,
                    'severity': 'critical'
                })
            
            # Check for URL shorteners (potential masking)
            if any(shortener in domain for shortener in ['bit.ly', 'tinyurl.com', 'goo.gl']):
                threats.append({
                    'url': url,
                    'type': 'url_shortener',
                    'severity': 'medium'
                })
            
            # Check for IP addresses instead of domains
            if re.match(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', domain):
                threats.append({
                    'url': url,
                    'type': 'ip_address_url',
                    'severity': 'high'
                })
        
        return {
            'links_scanned': len(urls),
            'threats': threats,
            'safe': len(threats) == 0
        }
    
    def _calculate_threat_score(self, sender_val, phishing, attachments, links):
        score = 0
        
        # Sender reputation (0-30 points)
        if sender_val['reputation'] < 50:
            score += 30
        elif sender_val['reputation'] < 70:
            score += 15
        
        # Phishing score (0-40 points)
        score += phishing['phishing_score'] * 0.4
        
        # Attachment threats (0-20 points)
        if not attachments['safe']:
            score += 20
        
        # Link threats (0-10 points)
        if not links['safe']:
            score += min(10, len(links['threats']) * 5)
        
        return min(100, int(score))
    
    def _get_threat_level(self, score):
        if score >= 70:
            return 'critical'
        elif score >= 50:
            return 'high'
        elif score >= 30:
            return 'medium'
        elif score >= 10:
            return 'low'
        return 'safe'
    
    def _get_action(self, threat_score):
        if threat_score >= 70:
            return 'quarantine'
        elif threat_score >= 50:
            return 'block_and_alert'
        elif threat_score >= 30:
            return 'warn_user'
        return 'allow'
    
    def _log_threat(self, sender, subject, threat_score):
        self.threat_log.append({
            'timestamp': datetime.now().isoformat(),
            'sender': sender,
            'subject': subject,
            'threat_score': threat_score,
            'logged': True
        })
    
    def _generate_security_response(self, email_data, threat_score, sender_val, phishing, attachments, links):
        subject = email_data.get('subject', '')
        threat_level = self._get_threat_level(threat_score)
        
        if threat_score >= 70:
            icon = "🚨"
            message = "CRITICAL THREAT DETECTED"
        elif threat_score >= 50:
            icon = "⚠️"
            message = "HIGH SECURITY RISK"
        elif threat_score >= 30:
            icon = "⚡"
            message = "MEDIUM SECURITY WARNING"
        else:
            icon = "✅"
            message = "SECURITY CHECK PASSED"
        
        response = f"{icon} {message} for '{subject}'\n\n"
        response += f"Threat Score: {threat_score}/100 ({threat_level.upper()})\n\n"
        
        if phishing['threats_detected'] > 0:
            response += f"• Phishing indicators: {phishing['threats_detected']} detected\n"
        if not attachments['safe']:
            response += f"• Attachment threats: {len(attachments['threats'])} found\n"
        if not links['safe']:
            response += f"• Link threats: {len(links['threats'])} found\n"
        
        response += f"• Sender reputation: {sender_val['reputation']}/100\n"
        response += f"• Action: {self._get_action(threat_score).replace('_', ' ').title()}\n"
        
        response += "\n---\nZion Tech Group | AI Email Intelligence V288\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"
        
        return response

if __name__ == "__main__":
    engine = EmailSecuritySentinel()
    test = {
        "from": "security@bank-alert.com",
        "to": ["user@company.com", "finance@company.com"],
        "cc": ["it-security@company.com"],
        "subject": "URGENT: Your account has been suspended - verify immediately",
        "body": "Your account has been suspended due to suspicious activity. Click here http://suspicious-domain.xyz/verify to confirm your identity now. Please provide your password and SSN to reactivate your account.",
        "attachments": [{"filename": "account_details.exe", "size": 1024}]
    }
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V288 Security Sentinel — All systems operational | Reply-All: ENFORCED (safe emails only)")
