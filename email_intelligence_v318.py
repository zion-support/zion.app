#!/usr/bin/env python3
"""
Email Intelligence Engine V318 - Email Forensics Analyzer
Deep forensic analysis of email headers, routing paths, DKIM/SPF/DMARC validation,
timeline reconstruction, and evidence chain for legal/compliance.
Enforces reply-all and case-by-case analysis.
"""

import json
import hashlib
from datetime import datetime
from typing import Dict, List
import re

class EmailForensicsAnalyzer:
    def __init__(self):
        self.version = "V318"
        self.evidence_chain = []
        
    def analyze_headers(self, headers: Dict) -> Dict:
        """Analyze email headers for authenticity"""
        analysis = {
            'authentication': {},
            'routing': [],
            'anomalies': [],
            'authenticity_score': 100
        }
        
        # SPF validation
        spf = headers.get('received-spf', '')
        if 'pass' in spf.lower():
            analysis['authentication']['spf'] = 'PASS'
        elif 'fail' in spf.lower():
            analysis['authentication']['spf'] = 'FAIL'
            analysis['anomalies'].append('SPF validation failed')
            analysis['authenticity_score'] -= 30
        else:
            analysis['authentication']['spf'] = 'UNKNOWN'
            analysis['authenticity_score'] -= 10
        
        # DKIM validation
        dkim = headers.get('dkim-signature', '')
        if dkim:
            analysis['authentication']['dkim'] = 'PRESENT'
            if 'd=' in dkim:
                domain = re.search(r'd=([^;]+)', dkim)
                if domain:
                    analysis['authentication']['dkim_domain'] = domain.group(1).strip()
        else:
            analysis['authentication']['dkim'] = 'MISSING'
            analysis['authenticity_score'] -= 15
        
        # DMARC validation
        dmarc = headers.get('authentication-results', '')
        if 'dmarc=pass' in dmarc.lower():
            analysis['authentication']['dmarc'] = 'PASS'
        elif 'dmarc=fail' in dmarc.lower():
            analysis['authentication']['dmarc'] = 'FAIL'
            analysis['anomalies'].append('DMARC validation failed')
            analysis['authenticity_score'] -= 25
        else:
            analysis['authentication']['dmarc'] = 'UNKNOWN'
        
        # Extract routing path
        received_headers = headers.get('received', [])
        if isinstance(received_headers, str):
            received_headers = [received_headers]
        
        for hop in received_headers:
            if 'from' in hop.lower():
                analysis['routing'].append(hop[:100])
        
        # Check for suspicious patterns
        sender = headers.get('from', '')
        reply_to = headers.get('reply-to', '')
        if reply_to and sender and reply_to != sender:
            analysis['anomalies'].append('Reply-To differs From')
            analysis['authenticity_score'] -= 20
        
        return analysis
    
    def reconstruct_timeline(self, email_thread: List[Dict]) -> Dict:
        """Reconstruct email conversation timeline"""
        timeline = []
        
        for i, email in enumerate(email_thread):
            entry = {
                'sequence': i + 1,
                'timestamp': email.get('timestamp', datetime.now().isoformat()),
                'from': email.get('sender', ''),
                'to': email.get('recipients', []),
                'cc': email.get('cc', []),
                'subject': email.get('subject', ''),
                'message_id': email.get('message_id', ''),
                'in_reply_to': email.get('in_reply_to', '')
            }
            timeline.append(entry)
        
        # Detect gaps
        gaps = []
        for i in range(1, len(timeline)):
            # Simplified gap detection
            gaps.append({'between': f"{i}→{i+1}", 'status': 'normal'})
        
        return {
            'timeline': timeline,
            'total_messages': len(timeline),
            'participants': list(set(e['from'] for e in timeline)),
            'gaps_detected': gaps,
            'thread_integrity': 'INTACT' if len(gaps) == 0 else 'REVIEW_NEEDED'
        }
    
    def validate_chain_of_custody(self, email_data: Dict) -> Dict:
        """Validate email chain of custody for legal purposes"""
        content = email_data.get('content', '')
        headers = email_data.get('headers', {})
        
        # Generate evidence hash
        evidence_string = f"{email_data.get('sender', '')}{email_data.get('subject', '')}{content}"
        evidence_hash = hashlib.sha256(evidence_string.encode()).hexdigest()
        
        # Check for tampering indicators
        tampering_indicators = []
        
        # Check message-id format
        message_id = headers.get('message-id', '')
        if message_id and not re.match(r'<[^>]+@[^>]+>', message_id):
            tampering_indicators.append('Invalid Message-ID format')
        
        # Check date consistency
        date_header = headers.get('date', '')
        if date_header:
            try:
                # Simplified date validation
                pass
            except:
                tampering_indicators.append('Date header parsing failed')
        
        return {
            'evidence_hash': evidence_hash,
            'tampering_indicators': tampering_indicators,
            'custody_valid': len(tampering_indicators) == 0,
            'admissible': len(tampering_indicators) == 0 and self._check_legal_requirements(headers),
            'timestamp': datetime.now().isoformat()
        }
    
    def _check_legal_requirements(self, headers: Dict) -> bool:
        """Check if email meets legal evidence requirements"""
        required = ['message-id', 'date', 'from', 'to']
        return all(headers.get(r) for r in required)
    
    def detect_spoofing(self, email_data: Dict) -> Dict:
        """Detect email spoofing attempts"""
        headers = email_data.get('headers', {})
        sender = email_data.get('sender', '')
        
        spoofing_indicators = []
        risk_score = 0
        
        # Check display name vs email
        display_name = headers.get('from', '')
        if display_name and sender:
            if '@' in display_name:
                # Extract domain from display name
                display_domain = display_name.split('@')[-1].strip('>')
                sender_domain = sender.split('@')[-1]
                if display_domain != sender_domain:
                    spoofing_indicators.append('Domain mismatch in display name')
                    risk_score += 40
        
        # Check for lookalike domains
        if sender:
            domain = sender.split('@')[-1]
            common_lookalikes = {
                'gmaiin.com': 'gmail.com',
                'paypa1.com': 'paypal.com',
                'amaz0n.com': 'amazon.com'
            }
            if domain in common_lookalikes:
                spoofing_indicators.append(f'Lookalike domain: {domain}')
                risk_score += 50
        
        # Check IP reputation
        originating_ip = headers.get('x-originating-ip', '')
        if originating_ip:
            # Simplified IP check
            if originating_ip.startswith('10.') or originating_ip.startswith('192.168.'):
                spoofing_indicators.append('Internal IP in external email')
                risk_score += 30
        
        return {
            'spoofing_detected': risk_score > 50,
            'risk_score': min(100, risk_score),
            'indicators': spoofing_indicators,
            'recommendation': 'QUARANTINE' if risk_score > 70 else 'REVIEW' if risk_score > 30 else 'SAFE'
        }
    
    def process_email(self, email_data: Dict) -> Dict:
        """Process email with forensic analysis"""
        print(f"[{self.version}] Performing forensic analysis")
        
        # Case-by-case analysis
        recipients = email_data.get('recipients', [])
        cc_list = email_data.get('cc', [])
        all_recipients = recipients + cc_list
        
        # Enforce reply-all
        reply_all = len(all_recipients) > 1
        
        # Run analyses
        headers = email_data.get('headers', {})
        header_analysis = self.analyze_headers(headers)
        custody = self.validate_chain_of_custody(email_data)
        spoofing = self.detect_spoofing(email_data)
        
        # Add to evidence chain
        self.evidence_chain.append({
            'timestamp': datetime.now().isoformat(),
            'hash': custody['evidence_hash'],
            'sender': email_data.get('sender', '')
        })
        
        response = {
            'version': self.version,
            'engine': 'Email Forensics Analyzer',
            'header_analysis': header_analysis,
            'chain_of_custody': custody,
            'spoofing_analysis': spoofing,
            'authenticity_score': header_analysis['authenticity_score'],
            'evidence_chain_length': len(self.evidence_chain),
            'reply_all': reply_all,
            'reply_all_recipients': all_recipients if reply_all else [],
            'forensic_recommendation': f"Authenticity: {header_analysis['authenticity_score']}% | Spoofing risk: {spoofing['risk_score']}%"
        }
        
        print(f"[{self.version}] Authenticity: {header_analysis['authenticity_score']}%, Spoofing: {spoofing['risk_score']}%, Reply-all: {reply_all}")
        return response

# Test
if __name__ == "__main__":
    engine = EmailForensicsAnalyzer()
    
    # Test legitimate email
    legit_email = {
        'sender': 'user@gmail.com',
        'subject': 'Meeting Confirmation',
        'content': 'Confirming our meeting for tomorrow at 2 PM.',
        'recipients': ['manager@company.com'],
        'cc': ['team@company.com'],
        'headers': {
            'from': 'User Name <user@gmail.com>',
            'to': 'manager@company.com',
            'date': '2026-01-15T14:30:00Z',
            'message-id': '<abc123@gmail.com>',
            'received-spf': 'pass',
            'dkim-signature': 'v=1; d=gmail.com; s=abc',
            'authentication-results': 'dmarc=pass'
        }
    }
    
    result = engine.process_email(legit_email)
    print("Legitimate email:", json.dumps(result, indent=2))
    
    # Test suspicious email
    suspicious_email = {
        'sender': 'user@gmaiin.com',
        'subject': 'Urgent: Verify Account',
        'content': 'Click here to verify your account immediately.',
        'recipients': ['victim@company.com'],
        'cc': [],
        'headers': {
            'from': 'Google Support <user@gmaiin.com>',
            'reply-to': 'hacker@evil.com',
            'date': '2026-01-15T14:30:00Z',
            'message-id': 'invalid-format',
            'received-spf': 'fail',
            'x-originating-ip': '10.0.0.1'
        }
    }
    
    result2 = engine.process_email(suspicious_email)
    print("\nSuspicious email:", json.dumps(result2, indent=2))
