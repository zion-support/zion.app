#!/usr/bin/env python3
"""
V118: AI Email Security Sentinel
Advanced phishing detection, BEC prevention, impersonation detection, header analysis.
"""
import re, json, hashlib
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum

class ThreatLevel(Enum):
    SAFE = "safe"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ThreatType(Enum):
    PHISHING = "phishing"
    BEC = "business_email_compromise"
    IMPERSONATION = "impersonation"
    MALWARE = "malware"
    SPAM = "spam"
    SOCIAL_ENGINEERING = "social_engineering"
    CREDENTIAL_THEFT = "credential_theft"
    INVOICE_FRAUD = "invoice_fraud"

@dataclass
class SecurityReport:
    email_id: str
    threat_level: ThreatLevel
    threats_detected: List[ThreatType]
    phishing_score: float
    bec_score: float
    impersonation_score: float
    suspicious_urls: List[str]
    suspicious_attachments: List[str]
    header_anomalies: List[str]
    sender_reputation: float
    recommendations: List[str]
    quarantined: bool
    reply_all_blocked: bool

class EmailSecuritySentinel:
    """V118: Advanced email security with phishing, BEC, and impersonation detection."""
    
    PHISHING_KEYWORDS = [
        "verify your account", "confirm your identity", "suspended", "unusual activity",
        "click here immediately", "update your payment", "account will be closed",
        "security alert", "unauthorized transaction", "act now or lose access",
        "urgent action required", "your account has been compromised",
    ]
    
    BEC_PATTERNS = [
        r"\b(wire transfer|bank details|change.*payment|new.*account.*number)\b",
        r"\b(ceo|executive|cfo|president).*request",
        r"\b(urgent|confidential|do not share).*transfer",
        r"\bgift card.*purchase",
        r"\b(send|forward).*w-2\b",
    ]
    
    IMPERSONATION_CHECKS = {
        "lookalike_domains": ["g00gle", "micr0soft", "amaz0n", "paypa1", "app1e", "faceb00k"],
        "suspicious_tlds": [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz"],
    }
    
    SUSPICIOUS_URL_PATTERNS = [
        r"bit\.ly", r"tinyurl", r"is\.gd",  # URL shorteners
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}",  # IP addresses
        r"@\w+\.\w+\.\w+",  # Subdomain tricks
    ]
    
    KNOWN_SAFE_DOMAINS = ["google.com", "microsoft.com", "amazon.com", "linkedin.com", "github.com", "salesforce.com"]
    
    def __init__(self):
        self.scan_history: List[SecurityReport] = []
        self.threat_database: Dict[str, Dict] = {}
        self.quarantine: List[Dict] = []
        self.sender_reputations: Dict[str, float] = {}
    
    def scan_email(self, email: Dict) -> SecurityReport:
        """Perform comprehensive security scan of an email."""
        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        headers = email.get("headers", {})
        attachments = email.get("attachments", [])
        email_id = email.get("id", hashlib.md5(f"{sender}{subject}".encode()).hexdigest()[:12])
        
        # Phishing detection
        phishing_score = self._detect_phishing(body, subject)
        
        # BEC detection
        bec_score = self._detect_bec(body, subject, sender)
        
        # Impersonation detection
        impersonation_score = self._detect_impersonation(sender, headers)
        
        # URL analysis
        suspicious_urls = self._analyze_urls(body)
        
        # Attachment analysis
        suspicious_attachments = self._analyze_attachments(attachments)
        
        # Header analysis
        header_anomalies = self._analyze_headers(headers, sender)
        
        # Sender reputation
        sender_rep = self._check_sender_reputation(sender)
        
        # Aggregate threats
        threats = []
        if phishing_score > 0.6: threats.append(ThreatType.PHISHING)
        if bec_score > 0.5: threats.append(ThreatType.BEC)
        if impersonation_score > 0.5: threats.append(ThreatType.IMPERSONATION)
        if suspicious_urls: threats.append(ThreatType.CREDENTIAL_THEFT)
        if suspicious_attachments: threats.append(ThreatType.MALWARE)
        if any(p in body.lower() for p in ["gift card", "wire transfer"]): threats.append(ThreatType.INVOICE_FRAUD)
        
        # Overall threat level
        max_score = max(phishing_score, bec_score, impersonation_score)
        if max_score > 0.8 or len(threats) >= 3:
            level = ThreatLevel.CRITICAL
        elif max_score > 0.6 or len(threats) >= 2:
            level = ThreatLevel.HIGH
        elif max_score > 0.4 or threats:
            level = ThreatLevel.MEDIUM
        elif max_score > 0.2:
            level = ThreatLevel.LOW
        else:
            level = ThreatLevel.SAFE
        
        # Recommendations
        recommendations = self._generate_recommendations(threats, level, suspicious_urls)
        
        # Quarantine decision
        quarantined = level in [ThreatLevel.CRITICAL, ThreatLevel.HIGH]
        
        # Reply-all blocking for threats
        reply_all_blocked = quarantined and (len(email.get("to", [])) > 1 or len(email.get("cc", [])) > 0)
        
        report = SecurityReport(
            email_id=email_id,
            threat_level=level,
            threats_detected=threats,
            phishing_score=round(phishing_score, 2),
            bec_score=round(bec_score, 2),
            impersonation_score=round(impersonation_score, 2),
            suspicious_urls=suspicious_urls,
            suspicious_attachments=suspicious_attachments,
            header_anomalies=header_anomalies,
            sender_reputation=round(sender_rep, 2),
            recommendations=recommendations,
            quarantined=quarantined,
            reply_all_blocked=reply_all_blocked
        )
        
        self.scan_history.append(report)
        if quarantined:
            self.quarantine.append({"email_id": email_id, "report": report, "timestamp": datetime.now().isoformat()})
        
        return report
    
    def _detect_phishing(self, body: str, subject: str) -> float:
        text = (body + " " + subject).lower()
        hits = sum(1 for kw in self.PHISHING_KEYWORDS if kw in text)
        urgency = sum(1 for w in ["urgent", "immediately", "act now", "expire", "suspended"] if w in text)
        links = len(re.findall(r'https?://', body))
        
        score = hits * 0.15 + urgency * 0.1 + min(0.2, links * 0.05)
        return min(1.0, score)
    
    def _detect_bec(self, body: str, subject: str, sender: str) -> float:
        text = (body + " " + subject).lower()
        score = 0
        for pattern in self.BEC_PATTERNS:
            if re.search(pattern, text, re.I):
                score += 0.2
        
        # Check for authority + urgency combo
        authority = any(w in text for w in ["ceo", "cfo", "president", "executive", "director"])
        urgency = any(w in text for w in ["urgent", "asap", "immediately", "today", "confidential"])
        if authority and urgency:
            score += 0.3
        
        return min(1.0, score)
    
    def _detect_impersonation(self, sender: str, headers: Dict) -> float:
        score = 0
        domain = sender.split("@")[-1].lower() if "@" in sender else ""
        
        # Lookalike domain check
        for lookalike in self.IMPERSONATION_CHECKS["lookalike_domains"]:
            if lookalike in domain:
                score += 0.5
        
        # Suspicious TLD
        for tld in self.IMPERSONATION_CHECKS["suspicious_tlds"]:
            if domain.endswith(tld):
                score += 0.3
        
        # SPF/DKIM/DMARC check (simulated)
        if not headers.get("spf_pass", True):
            score += 0.3
        if not headers.get("dkim_pass", True):
            score += 0.2
        
        return min(1.0, score)
    
    def _analyze_urls(self, body: str) -> List[str]:
        urls = re.findall(r'https?://[^\s<>"]+', body)
        suspicious = []
        for url in urls:
            for pattern in self.SUSPICIOUS_URL_PATTERNS:
                if re.search(pattern, url):
                    suspicious.append(url)
                    break
            # Check for known bad patterns
            if any(d in url for d in ["login", "verify", "secure", "update", "confirm"]) and not any(safe in url for safe in self.KNOWN_SAFE_DOMAINS):
                suspicious.append(url)
        return list(set(suspicious))
    
    def _analyze_attachments(self, attachments: List) -> List[str]:
        suspicious = []
        dangerous_exts = [".exe", ".bat", ".cmd", ".scr", ".vbs", ".js", ".wsf", ".ps1", ".msi"]
        for att in attachments:
            name = att.get("name", "") if isinstance(att, dict) else str(att)
            for ext in dangerous_exts:
                if name.lower().endswith(ext):
                    suspicious.append(f"{name} (dangerous file type: {ext})")
        return suspicious
    
    def _analyze_headers(self, headers: Dict, sender: str) -> List[str]:
        anomalies = []
        if not headers.get("spf_pass", True):
            anomalies.append("SPF validation failed")
        if not headers.get("dkim_pass", True):
            anomalies.append("DKIM signature invalid")
        if headers.get("reply_to") and headers.get("reply_to") != sender:
            anomalies.append(f"Reply-To mismatch: {headers.get('reply_to')} != {sender}")
        return anomalies
    
    def _check_sender_reputation(self, sender: str) -> float:
        domain = sender.split("@")[-1] if "@" in sender else sender
        if domain in self.sender_reputations:
            return self.sender_reputations[domain]
        # Default reputation based on domain type
        if any(d in domain for d in self.KNOWN_SAFE_DOMAINS):
            return 0.95
        if any(domain.endswith(tld) for tld in self.IMPERSONATION_CHECKS["suspicious_tlds"]):
            return 0.2
        return 0.6
    
    def _generate_recommendations(self, threats: List[ThreatType], level: ThreatLevel, urls: List) -> List[str]:
        recs = []
        if ThreatType.PHISHING in threats:
            recs.append("Do NOT click any links in this email")
            recs.append("Verify sender identity through a separate channel")
        if ThreatType.BEC in threats:
            recs.append("Verify wire transfer requests by phone call")
            recs.append("Do not change payment details based on email alone")
        if ThreatType.IMPERSONATION in threats:
            recs.append("Check sender domain carefully for typos")
            recs.append("Contact the supposed sender via known good channel")
        if urls:
            recs.append(f"Found {len(urls)} suspicious URL(s) — do not visit")
        if level == ThreatLevel.SAFE:
            recs.append("Email appears safe — no action needed")
        return recs
    
    def get_stats(self) -> Dict:
        threat_counts = {}
        for report in self.scan_history:
            for t in report.threats_detected:
                threat_counts[t.value] = threat_counts.get(t.value, 0) + 1
        return {
            "total_scanned": len(self.scan_history),
            "quarantined": len(self.quarantine),
            "threat_breakdown": threat_counts,
            "safe_rate": f"{sum(1 for r in self.scan_history if r.threat_level == ThreatLevel.SAFE) / max(1, len(self.scan_history)):.0%}",
            "reply_all_blocked": sum(1 for r in self.scan_history if r.reply_all_blocked),
            "engine_version": "V118"
        }

if __name__ == "__main__":
    sentinel = EmailSecuritySentinel()
    
    test_emails = [
        {"id": "sec1", "from": "security@g00gle.com", "to": ["user@company.com", "admin@company.com"], "cc": [], "subject": "URGENT: Verify your account immediately", "body": "Your Google account has been compromised. Click http://bit.ly/verify-now to confirm your identity or your account will be suspended within 24 hours. Act now or lose access.", "headers": {"spf_pass": False, "dkim_pass": False}},
        {"id": "sec2", "from": "ceo@company.com", "to": ["finance@company.com"], "cc": [], "subject": "Urgent wire transfer request", "body": "I need you to process an urgent wire transfer of $45,000 to our new vendor. Please use these new bank details. This is confidential — do not share with anyone. CEO", "headers": {}},
        {"id": "sec3", "from": "john@trusted-partner.com", "to": ["team@company.com", "sales@company.com"], "cc": ["manager@company.com"], "subject": "Meeting notes from today", "body": "Hi team, great meeting today. Here are the action items we discussed. Let me know if I missed anything.\n\nBest,\nJohn", "headers": {"spf_pass": True, "dkim_pass": True}},
    ]
    
    print("=" * 60)
    print("V118: AI Email Security Sentinel")
    print("=" * 60)
    
    for email in test_emails:
        report = sentinel.scan_email(email)
        print(f"\n--- {email['subject'][:50]} ---")
        print(f"  Threat Level: {report.threat_level.value.upper()}")
        print(f"  Phishing: {report.phishing_score:.0%} | BEC: {report.bec_score:.0%} | Impersonation: {report.impersonation_score:.0%}")
        print(f"  Threats: {[t.value for t in report.threats_detected]}")
        print(f"  Suspicious URLs: {report.suspicious_urls}")
        print(f"  Header Anomalies: {report.header_anomalies}")
        print(f"  Sender Reputation: {report.sender_reputation:.0%}")
        print(f"  Quarantined: {report.quarantined}")
        print(f"  Reply-All Blocked: {report.reply_all_blocked}")
        print(f"  Recommendations: {report.recommendations}")
    
    print(f"\n--- Security Stats ---")
    for k, v in sentinel.get_stats().items():
        print(f"  {k}: {v}")
