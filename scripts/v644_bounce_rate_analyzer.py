#!/usr/bin/env python3
"""V644 - Bounce Rate Analyzer
Analyze email bounce rates and provide deliverability improvement recommendations.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime
from typing import Dict, List, Any

class BounceRateAnalyzer:
    """Analyze and reduce email bounce rates."""
    
    BOUNCE_TYPES = {
        "hard_bounce": {
            "patterns": ["user unknown", "invalid recipient", "no such user", "mailbox not found", "address rejected"],
            "severity": "high",
            "action": "remove_immediately"
        },
        "soft_bounce": {
            "patterns": ["mailbox full", "over quota", "temporary failure", "try again", "server busy"],
            "severity": "medium",
            "action": "retry_with_limit"
        },
        "block": {
            "patterns": ["blocked", "blacklisted", "spam", "rejected by policy", "authentication failed"],
            "severity": "high",
            "action": "investigate_and_fix"
        },
        "timeout": {
            "patterns": ["timeout", "connection timed out", "server not responding"],
            "severity": "low",
            "action": "retry_later"
        }
    }
    
    def __init__(self):
        self.bounce_history = {}
    
    def analyze_bounce(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email bounce notification."""
        subject = email.get("subject", "")
        body = email.get("body", "")
        
        # Check if it's a bounce notification
        is_bounce = self._is_bounce_notification(email)
        
        if not is_bounce:
            return {
                "engine": "V644",
                "email_subject": subject,
                "is_bounce": False,
                "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
                "timestamp": datetime.now().isoformat()
            }
        
        # Extract bounced email address
        bounced_email = self._extract_bounced_email(body)
        
        # Classify bounce type
        bounce_type = self._classify_bounce(body)
        
        # Extract bounce reason
        bounce_reason = self._extract_bounce_reason(body)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(bounce_type, bounced_email)
        
        # Check for patterns
        pattern_analysis = self._analyze_patterns(bounced_email, bounce_type)
        
        return {
            "engine": "V644",
            "email_subject": subject,
            "is_bounce": True,
            "bounced_email": bounced_email,
            "bounce_type": bounce_type["type"] if bounce_type else "unknown",
            "bounce_severity": bounce_type["severity"] if bounce_type else "unknown",
            "bounce_reason": bounce_reason,
            "recommendation": recommendation,
            "pattern_analysis": pattern_analysis,
            "deliverability_score": self._calculate_deliverability_score(bounce_type),
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _is_bounce_notification(self, email: Dict) -> bool:
        """Check if email is a bounce notification."""
        subject = email.get("subject", "").lower()
        body = email.get("body", "").lower()
        sender = email.get("from", "").lower()
        
        # Check subject
        bounce_subjects = ["bounce", "undeliverable", "delivery failed", "returned mail", "mail delivery"]
        if any(bs in subject for bs in bounce_subjects):
            return True
        
        # Check sender
        bounce_senders = ["mailer-daemon", "postmaster", "mail delivery"]
        if any(bs in sender for bs in bounce_senders):
            return True
        
        # Check body
        bounce_indicators = ["delivery to the following recipient", "message could not be delivered", "unable to deliver"]
        if any(bi in body for bi in bounce_indicators):
            return True
        
        return False
    
    def _extract_bounced_email(self, body: str) -> str:
        """Extract bounced email address from body."""
        # Look for email patterns
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, body)
        
        # Return first match that's not a system email
        for match in matches:
            if not any(sys in match.lower() for sys in ["mailer-daemon", "postmaster", "noreply"]):
                return match
        
        return "Unknown"
    
    def _classify_bounce(self, body: str) -> Dict:
        """Classify bounce type."""
        body_lower = body.lower()
        
        for bounce_type, config in self.BOUNCE_TYPES.items():
            for pattern in config["patterns"]:
                if pattern in body_lower:
                    return {"type": bounce_type, **config}
        
        return None
    
    def _extract_bounce_reason(self, body: str) -> str:
        """Extract bounce reason from body."""
        # Look for common reason patterns
        patterns = [
            r'(?:reason|error|cause)[:\s]+([^\n.]+)',
            r'([^\n]*(?:unknown|invalid|full|blocked|rejected)[^\n]*)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                return match.group(1).strip()[:200]
        
        return "Reason not specified"
    
    def _generate_recommendation(self, bounce_type: Dict, bounced_email: str) -> Dict:
        """Generate bounce handling recommendation."""
        if not bounce_type:
            return {
                "action": "investigate",
                "description": "Unknown bounce type - manual investigation required",
                "priority": "medium"
            }
        
        recommendations = {
            "hard_bounce": {
                "action": "remove_from_list",
                "description": f"Remove {bounced_email} from mailing list immediately - permanent failure",
                "priority": "high",
                "follow_up": "Verify email address through alternative channel"
            },
            "soft_bounce": {
                "action": "retry_with_limit",
                "description": f"Retry sending to {bounced_email} up to 3 times over 48 hours",
                "priority": "medium",
                "follow_up": "If still bouncing after retries, remove from list"
            },
            "block": {
                "action": "investigate_and_fix",
                "description": "Investigate why emails are being blocked - check sender reputation",
                "priority": "high",
                "follow_up": "Review SPF/DKIM/DMARC records and contact recipient's IT team"
            },
            "timeout": {
                "action": "retry_later",
                "description": f"Retry sending to {bounced_email} after 2-4 hours",
                "priority": "low",
                "follow_up": "If persistent timeouts, check recipient server status"
            }
        }
        
        return recommendations.get(bounce_type["type"], {
            "action": "investigate",
            "description": "Unrecognized bounce type",
            "priority": "medium"
        })
    
    def _analyze_patterns(self, bounced_email: str, bounce_type: Dict) -> Dict:
        """Analyze bounce patterns for the email address."""
        # In production, would check historical data
        return {
            "bounce_count": 1,
            "first_bounce": datetime.now().isoformat(),
            "last_bounce": datetime.now().isoformat(),
            "bounce_frequency": "first_occurrence",
            "domain_issues": self._check_domain_issues(bounced_email)
        }
    
    def _check_domain_issues(self, email: str) -> bool:
        """Check if bounce is domain-related."""
        if "@" not in email:
            return False
        
        domain = email.split("@")[1]
        
        # Check for common problematic domains
        problematic_patterns = ["tempmail", "disposable", "fake"]
        return any(pattern in domain.lower() for pattern in problematic_patterns)
    
    def _calculate_deliverability_score(self, bounce_type: Dict) -> float:
        """Calculate deliverability impact score."""
        if not bounce_type:
            return 75.0
        
        severity_scores = {
            "high": 30.0,
            "medium": 60.0,
            "low": 85.0
        }
        
        return severity_scores.get(bounce_type.get("severity", "medium"), 75.0)
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.analyze_bounce(e) for e in emails]
        
        bounces = [r for r in results if r.get("is_bounce")]
        
        bounce_types = {}
        for bounce in bounces:
            bt = bounce.get("bounce_type", "unknown")
            bounce_types[bt] = bounce_types.get(bt, 0) + 1
        
        return {
            "engine": "V644 - Bounce Rate Analyzer",
            "total_processed": len(results),
            "bounces_detected": len(bounces),
            "bounce_rate_percent": round(len(bounces) / len(results) * 100, 2) if results else 0,
            "bounce_type_distribution": bounce_types,
            "hard_bounces": sum(1 for b in bounces if b.get("bounce_type") == "hard_bounce"),
            "soft_bounces": sum(1 for b in bounces if b.get("bounce_type") == "soft_bounce"),
            "average_deliverability_score": round(sum(b.get("deliverability_score", 75) for b in bounces) / len(bounces), 1) if bounces else 100,
            "reply_all_enforced": sum(1 for r in results if r.get("reply_all_enforced")),
            "results": results
        }

if __name__ == "__main__":
    engine = BounceRateAnalyzer()
    test_emails = [
        {"subject": "Mail Delivery Failed", "body": "Delivery to the following recipient failed: user@invalid.com\nReason: User unknown",
         "from": "mailer-daemon@mail.com", "to": ["sender@company.com"]},
        {"subject": "Undeliverable: Meeting Tomorrow", "body": "Unable to deliver message to bob@example.com\nError: Mailbox full, over quota",
         "from": "postmaster@example.com", "to": ["alice@company.com"]},
        {"subject": "Project Update", "body": "Here's the latest update.",
         "from": "manager@company.com", "to": ["team@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
