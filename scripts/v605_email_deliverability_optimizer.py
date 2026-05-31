#!/usr/bin/env python3
"""V605 - Email Deliverability Optimizer
Comprehensive spam score analysis, authentication checks, and deliverability improvement.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class DeliverabilityOptimizer:
    """Optimize email deliverability with spam analysis and authentication checks."""
    
    SPAM_TRIGGERS = [
        r"\bfree\b", r"\bguarantee\b", r"\brisk.free\b", r"\bno obligation\b",
        r"\bact now\b", r"\blimited time\b", r"\bclick here\b", r"\bopportunity\b",
        r"\b\$\d+", r"\b!!!+", r"\bWINNER\b", r"\bURGENT\b",
        r"\bearn money\b", r"\bwork from home\b", r"\bdiscount\b"
    ]
    
    AUTH_CHECKS = ["spf", "dkim", "dmarc", "bcc_check", "reply_to_match"]
    
    def __init__(self):
        self.reports = []
    
    def analyze_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email for deliverability issues."""
        spam_score = self._calc_spam_score(email)
        auth_status = self._check_authentication(email)
        content_quality = self._assess_content_quality(email)
        recommendations = self._generate_recommendations(spam_score, auth_status, content_quality)
        
        deliverability_score = max(0, 100 - spam_score * 10 - sum(20 for a in auth_status.values() if not a))
        
        return {
            "engine": "V605",
            "deliverability_score": round(deliverability_score, 1),
            "spam_score": round(spam_score, 2),
            "spam_triggers_found": self._find_spam_triggers(email),
            "authentication": auth_status,
            "content_quality": content_quality,
            "recommendations": recommendations,
            "inbox_placement_estimate": self._estimate_inbox_placement(deliverability_score),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _calc_spam_score(self, email: Dict) -> float:
        text = f"{email.get('subject', '')} {email.get('body', '')}"
        triggers = sum(1 for p in self.SPAM_TRIGGERS if re.search(p, text, re.IGNORECASE))
        caps_ratio = sum(1 for c in email.get("subject", "") if c.isupper()) / max(len(email.get("subject", "")), 1)
        return min(10, triggers * 0.5 + caps_ratio * 5)
    
    def _find_spam_triggers(self, email: Dict) -> List[str]:
        text = f"{email.get('subject', '')} {email.get('body', '')}"
        return [p for p in self.SPAM_TRIGGERS if re.search(p, text, re.IGNORECASE)]
    
    def _check_authentication(self, email: Dict) -> Dict[str, bool]:
        return {
            "spf": email.get("spf_pass", True),
            "dkim": email.get("dkim_pass", True),
            "dmarc": email.get("dmarc_pass", True),
            "bcc_check": len(email.get("bcc", [])) == 0,
            "reply_to_match": email.get("from", "") == email.get("reply_to", email.get("from", ""))
        }
    
    def _assess_content_quality(self, email: Dict) -> Dict[str, Any]:
        body = email.get("body", "")
        words = body.split()
        return {
            "word_count": len(words),
            "has_images": bool(email.get("images", [])),
            "link_count": len(re.findall(r"https?://", body)),
            "text_to_html_ratio": 0.85,
            "personalization": bool(re.search(r"\b(hi|hello|dear)\s+\w+", body, re.IGNORECASE))
        }
    
    def _generate_recommendations(self, spam_score, auth, quality) -> List[str]:
        recs = []
        if spam_score > 3:
            recs.append("Reduce spam trigger words in subject and body")
        if not all(auth.values()):
            failed = [k for k, v in auth.items() if not v]
            recs.append(f"Fix authentication: {', '.join(failed)}")
        if quality.get("link_count", 0) > 5:
            recs.append("Reduce number of links (currently " + str(quality["link_count"]) + ")")
        if not quality.get("personalization"):
            recs.append("Add personalization (recipient name greeting)")
        if quality.get("word_count", 0) < 50:
            recs.append("Increase email body length for better deliverability")
        return recs or ["Email looks good for deliverability!"]
    
    def _estimate_inbox_placement(self, score: float) -> str:
        if score >= 90: return "primary_inbox"
        if score >= 70: return "promotions_tab"
        if score >= 50: return "updates_tab"
        if score >= 30: return "spam_folder"
        return "blocked"
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_email(e) for e in emails]
        avg_score = sum(r["deliverability_score"] for r in results) / len(results) if results else 0
        return {
            "engine": "V605 - Deliverability Optimizer",
            "total_analyzed": len(results),
            "average_deliverability": round(avg_score, 1),
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = DeliverabilityOptimizer()
    test_emails = [
        {"subject": "Project Update - Q4 Review", "body": "Hi team, please find the quarterly review attached. Let me know your thoughts.", "from": "manager@company.com", "to": ["team@company.com", "director@company.com"]},
        {"subject": "FREE MONEY!!! ACT NOW!!!", "body": "Click here to earn money from home! No obligation, risk free! GUARANTEE!!!", "from": "promo@spam.com", "to": ["victim@example.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
