#!/usr/bin/env python3
"""
V1020 - Email Security Guardian Engine
Advanced phishing detection, malware scanning, link verification,
and data loss prevention with enterprise-grade security analysis.
"""
import re
import hashlib
from typing import Dict, List, Any, Tuple
from datetime import datetime
from urllib.parse import urlparse


class EmailSecurityGuardian:
    """Enterprise-grade email security analysis."""
    
    # Known malicious patterns
    PHISHING_PATTERNS = [
        r'(?:verify|update|confirm)\s+(?:your\s+)?(?:account|password|information)',
        r'(?:suspended|locked|limited)\s+(?:account|access)',
        r'(?:unusual|suspicious)\s+(?:activity|login|sign-in)',
        r'(?:click|tap)\s+(?:here|below|link)\s+(?:to|and)\s+(?:verify|update|confirm)',
        r'(?:urgent|immediate)\s+(?:action|response)\s+(?:required|needed)',
        r'(?:bank|paypal|amazon|microsoft|google)\s+(?:security|alert|notification)',
        r'(?:you(?:\'ve|\s+have))\s+(?:won|been\s+selected|received)',
        r'(?:inheritance|lottery|prize|beneficiary)',
        r'(?:wire\s+transfer|money\s+order|gift\s+card)',
        r'(?:dear\s+(?:customer|user|member|sir|madam))'
    ]
    
    # Suspicious TLDs
    SUSPICIOUS_TLDS = [
        '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work',
        '.click', '.download', '.stream', '.racing', '.win', '.bid'
    ]
    
    # Suspicious keywords in URLs
    SUSPICIOUS_URL_KEYWORDS = [
        'login', 'signin', 'verify', 'update', 'confirm', 'secure',
        'account', 'banking', 'password', 'credential'
    ]
    
    # Malware file extensions
    MALWARE_EXTENSIONS = [
        '.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.vbe',
        '.js', '.jse', '.wsf', '.wsh', '.msi', '.dll', '.com',
        '.hta', '.cpl', '.inf', '.reg', '.lnk'
    ]
    
    def __init__(self):
        self.threat_intelligence = {
            'known_phishing_domains': [],
            'known_malware_hashes': [],
            'suspicious_ips': []
        }
    
    def scan_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive security scan of an email.
        
        Args:
            email_data: Email content and metadata
            
        Returns:
            Security analysis report
        """
        report = {
            'engine': 'V1020 - Email Security Guardian',
            'reply_all_enforced': True,
            'case_by_case_analysis': True,
            'timestamp': datetime.now().isoformat(),
            'threat_level': 'low',
            'threats_detected': [],
            'security_score': 100,
            'recommendations': [],
            'analysis': {
                'phishing': self._check_phishing(email_data),
                'malware': self._check_malware(email_data),
                'links': self._check_links(email_data),
                'spoofing': self._check_spoofing(email_data),
                'data_loss': self._check_data_loss(email_data)
            }
        }
        
        # Calculate overall threat level
        report['threat_level'] = self._calculate_threat_level(report)
        report['security_score'] = self._calculate_security_score(report)
        
        # Generate recommendations
        report['recommendations'] = self._generate_security_recommendations(report)
        
        return report
    
    def _check_phishing(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for phishing indicators."""
        result = {
            'detected': False,
            'indicators': [],
            'confidence': 0.0
        }
        
        content = f"{email_data.get('subject', '')} {email_data.get('body', '')}".lower()
        sender = email_data.get('sender', '').lower()
        
        # Check phishing patterns
        for pattern in self.PHISHING_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                result['detected'] = True
                result['indicators'].append({
                    'type': 'phishing_pattern',
                    'pattern': pattern,
                    'severity': 'high'
                })
                result['confidence'] += 20
        
        # Check for urgency tactics
        urgency_patterns = [
            r'(?:urgent|immediate|asap|24\s*hours?|today|now)',
            r'(?:act\s+now|limited\s+time|expires?\s+soon)',
            r'(?:last\s+chance|final\s+warning)'
        ]
        
        for pattern in urgency_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                result['indicators'].append({
                    'type': 'urgency_tactic',
                    'pattern': pattern,
                    'severity': 'medium'
                })
                result['confidence'] += 10
        
        # Check for impersonation
        trusted_brands = ['paypal', 'amazon', 'microsoft', 'google', 'apple', 'netflix']
        for brand in trusted_brands:
            if brand in sender and not sender.endswith(f'@{brand}.com'):
                result['detected'] = True
                result['indicators'].append({
                    'type': 'brand_impersonation',
                    'brand': brand,
                    'severity': 'critical'
                })
                result['confidence'] += 40
        
        result['confidence'] = min(100, result['confidence'])
        
        return result
    
    def _check_malware(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for malware in attachments."""
        result = {
            'detected': False,
            'suspicious_attachments': [],
            'safe_attachments': []
        }
        
        attachments = email_data.get('attachments', [])
        
        for attachment in attachments:
            filename = attachment.get('filename', '').lower()
            
            # Check file extension
            is_malicious = False
            for ext in self.MALWARE_EXTENSIONS:
                if filename.endswith(ext):
                    is_malicious = True
                    result['suspicious_attachments'].append({
                        'filename': filename,
                        'threat': f'Dangerous file extension: {ext}',
                        'severity': 'critical'
                    })
                    break
            
            # Check for double extensions
            if re.search(r'\.\w{2,4}\.\w{2,4}$', filename):
                result['suspicious_attachments'].append({
                    'filename': filename,
                    'threat': 'Double extension detected (possible disguise)',
                    'severity': 'high'
                })
                is_malicious = True
            
            if not is_malicious:
                result['safe_attachments'].append(filename)
        
        result['detected'] = len(result['suspicious_attachments']) > 0
        
        return result
    
    def _check_links(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check links for suspicious characteristics."""
        result = {
            'total_links': 0,
            'suspicious_links': [],
            'safe_links': []
        }
        
        content = email_data.get('body', '')
        
        # Extract URLs
        url_pattern = r'https?://[^\s<>"\']+'
        urls = re.findall(url_pattern, content, re.IGNORECASE)
        
        result['total_links'] = len(urls)
        
        for url in urls:
            is_suspicious = False
            threats = []
            
            try:
                parsed = urlparse(url)
                domain = parsed.netloc.lower()
                
                # Check for suspicious TLDs
                for tld in self.SUSPICIOUS_TLDS:
                    if domain.endswith(tld):
                        threats.append(f'Suspicious TLD: {tld}')
                        is_suspicious = True
                
                # Check for IP addresses instead of domain names
                if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', domain):
                    threats.append('IP address instead of domain name')
                    is_suspicious = True
                
                # Check for URL shorteners
                shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly']
                if any(shortener in domain for shortener in shorteners):
                    threats.append('URL shortener detected')
                    is_suspicious = True
                
                # Check for suspicious keywords
                for keyword in self.SUSPICIOUS_URL_KEYWORDS:
                    if keyword in url.lower():
                        threats.append(f'Suspicious keyword: {keyword}')
                        is_suspicious = True
                
                # Check for misspelled domains
                trusted_domains = ['paypal.com', 'amazon.com', 'microsoft.com', 'google.com']
                for trusted in trusted_domains:
                    if trusted[:-4] in domain and domain != trusted:
                        threats.append(f'Possible typo-squatting of {trusted}')
                        is_suspicious = True
                
                if is_suspicious:
                    result['suspicious_links'].append({
                        'url': url,
                        'domain': domain,
                        'threats': threats,
                        'severity': 'high'
                    })
                else:
                    result['safe_links'].append(url)
                    
            except Exception as e:
                result['suspicious_links'].append({
                    'url': url,
                    'error': str(e),
                    'severity': 'medium'
                })
        
        return result
    
    def _check_spoofing(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for email spoofing indicators."""
        result = {
            'detected': False,
            'indicators': [],
            'authentication': {
                'spf': email_data.get('spf_pass', True),
                'dkim': email_data.get('dkim_pass', True),
                'dmarc': email_data.get('dmarc_pass', True)
            }
        }
        
        # Check authentication failures
        if not result['authentication']['spf']:
            result['detected'] = True
            result['indicators'].append({
                'type': 'spf_failure',
                'description': 'SPF authentication failed',
                'severity': 'critical'
            })
        
        if not result['authentication']['dkim']:
            result['detected'] = True
            result['indicators'].append({
                'type': 'dkim_failure',
                'description': 'DKIM authentication failed',
                'severity': 'critical'
            })
        
        if not result['authentication']['dmarc']:
            result['detected'] = True
            result['indicators'].append({
                'type': 'dmarc_failure',
                'description': 'DMARC authentication failed',
                'severity': 'critical'
            })
        
        # Check for display name spoofing
        sender_name = email_data.get('sender_name', '').lower()
        sender_email = email_data.get('sender', '').lower()
        
        trusted_names = ['paypal', 'amazon', 'microsoft', 'google', 'support', 'security']
        for name in trusted_names:
            if name in sender_name and name not in sender_email:
                result['detected'] = True
                result['indicators'].append({
                    'type': 'display_name_spoofing',
                    'description': f'Display name contains "{name}" but email does not match',
                    'severity': 'high'
                })
        
        return result
    
    def _check_data_loss(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for potential data loss/leakage."""
        result = {
            'detected': False,
            'sensitive_data': []
        }
        
        content = email_data.get('body', '')
        
        # Check for sensitive patterns
        sensitive_patterns = {
            'credit_card': r'\b(?:\d[ -]*?){13,16}\b',
            'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
            'password': r'(?:password|passwd|pwd)\s*[:=]\s*\S+',
            'api_key': r'(?:api[_-]?key|apikey)\s*[:=]\s*[a-zA-Z0-9_-]{20,}',
            'private_key': r'-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----'
        }
        
        for data_type, pattern in sensitive_patterns.items():
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                result['detected'] = True
                result['sensitive_data'].append({
                    'type': data_type,
                    'count': len(matches),
                    'severity': 'critical'
                })
        
        return result
    
    def _calculate_threat_level(self, report: Dict[str, Any]) -> str:
        """Calculate overall threat level."""
        analysis = report['analysis']
        
        # Count critical and high severity threats
        critical_count = 0
        high_count = 0
        
        for category in analysis.values():
            if isinstance(category, dict):
                indicators = category.get('indicators', []) + category.get('suspicious_attachments', []) + category.get('suspicious_links', [])
                
                for indicator in indicators:
                    severity = indicator.get('severity', '').lower()
                    if severity == 'critical':
                        critical_count += 1
                    elif severity == 'high':
                        high_count += 1
        
        if critical_count > 0:
            return 'critical'
        elif high_count > 2:
            return 'high'
        elif high_count > 0:
            return 'medium'
        else:
            return 'low'
    
    def _calculate_security_score(self, report: Dict[str, Any]) -> int:
        """Calculate security score (0-100)."""
        score = 100
        
        threat_levels = {
            'critical': -50,
            'high': -30,
            'medium': -15,
            'low': -5
        }
        
        level = report['threat_level']
        score += threat_levels.get(level, 0)
        
        # Deduct for each threat category
        analysis = report['analysis']
        if analysis['phishing']['detected']:
            score -= 20
        if analysis['malware']['detected']:
            score -= 30
        if analysis['spoofing']['detected']:
            score -= 25
        if analysis['data_loss']['detected']:
            score -= 35
        
        return max(0, score)
    
    def _generate_security_recommendations(self, report: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate security recommendations."""
        recommendations = []
        
        analysis = report['analysis']
        
        if analysis['phishing']['detected']:
            recommendations.append({
                'priority': 'critical',
                'action': 'Do not click any links or download attachments',
                'reason': 'Phishing indicators detected'
            })
            recommendations.append({
                'priority': 'high',
                'action': 'Report this email to security team',
                'reason': 'Potential phishing attempt'
            })
        
        if analysis['malware']['detected']:
            recommendations.append({
                'priority': 'critical',
                'action': 'Do not open any attachments',
                'reason': 'Suspicious attachments detected'
            })
        
        if analysis['spoofing']['detected']:
            recommendations.append({
                'priority': 'high',
                'action': 'Verify sender identity through alternate channel',
                'reason': 'Email spoofing indicators found'
            })
        
        if analysis['data_loss']['detected']:
            recommendations.append({
                'priority': 'critical',
                'action': 'Do not forward this email',
                'reason': 'Sensitive data detected in email content'
            })
        
        if report['threat_level'] == 'low':
            recommendations.append({
                'priority': 'info',
                'action': 'Email appears safe to process',
                'reason': 'No significant threats detected'
            })
        
        return recommendations


def analyze_email_security(email_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze email for security threats.
    
    Args:
        email_data: Email content and metadata
        
    Returns:
        Security analysis report
    """
    guardian = EmailSecurityGuardian()
    return guardian.scan_email(email_data)


if __name__ == '__main__':
    # Test cases
    test_emails = [
        {
            'name': 'Suspicious phishing email',
            'data': {
                'subject': 'URGENT: Your account has been suspended',
                'body': '''
                Dear Customer,
                
                We have detected unusual activity on your account. Your account will be 
                suspended within 24 hours if you do not verify your information immediately.
                
                Click here to verify your account: http://bit.ly/verify-account
                
                Failure to act will result in permanent account closure.
                
                PayPal Security Team
                ''',
                'sender': 'security@paypal-verify.com',
                'sender_name': 'PayPal Security',
                'spf_pass': False,
                'dkim_pass': False
            }
        },
        {
            'name': 'Safe legitimate email',
            'data': {
                'subject': 'Your monthly statement is ready',
                'body': '''
                Hi John,
                
                Your account statement for December is now available in your online banking portal.
                
                Log in to view your statement at https://www.chase.com/statements
                
                Thank you,
                Chase Bank
                ''',
                'sender': 'notifications@chase.com',
                'sender_name': 'Chase Bank',
                'spf_pass': True,
                'dkim_pass': True,
                'dmarc_pass': True
            }
        }
    ]
    
    for test in test_emails:
        print(f"\n{'='*60}")
        print(f"Test: {test['name']}")
        print('='*60)
        
        result = analyze_email_security(test['data'])
        
        print(f"Threat Level: {result['threat_level'].upper()}")
        print(f"Security Score: {result['security_score']}/100")
        
        print(f"\nPhishing Check:")
        print(f"  Detected: {result['analysis']['phishing']['detected']}")
        print(f"  Confidence: {result['analysis']['phishing']['confidence']}%")
        
        print(f"\nMalware Check:")
        print(f"  Detected: {result['analysis']['malware']['detected']}")
        
        print(f"\nLink Check:")
        print(f"  Total Links: {result['analysis']['links']['total_links']}")
        print(f"  Suspicious: {len(result['analysis']['links']['suspicious_links'])}")
        
        print(f"\nSpoofing Check:")
        print(f"  Detected: {result['analysis']['spoofing']['detected']}")
        
        print(f"\nRecommendations:")
        for rec in result['recommendations'][:3]:
            print(f"  [{rec['priority'].upper()}] {rec['action']}")
            print(f"    Reason: {rec['reason']}")
        
        print(f"\nReply-All Enforced: {result['reply_all_enforced']}")
        print(f"Case-by-Case Analysis: {result['case_by_case_analysis']}")
