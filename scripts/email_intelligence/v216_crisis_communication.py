#!/usr/bin/env python3
"""V216 - AI Email Crisis Communication Engine
Detect crisis situations (PR issues, outages, security incidents) and
auto-generate appropriate crisis responses with stakeholder-specific
messaging, timeline tracking, and resolution updates.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class CrisisIndicator:
    indicator_type: str  # "outage", "security_breach", "pr_crisis", "legal", "financial"
    severity: str  # "low", "medium", "high", "critical"
    evidence: List[str]
    affected_stakeholders: List[str]

@dataclass
class CrisisResponse:
    crisis_type: str
    severity: str
    response_template: str
    stakeholders_to_notify: List[str]
    response_deadline_hours: int
    escalation_path: List[str]
    key_messages: List[str]
    things_to_avoid: List[str]
    reply_all_required: bool = True

class CrisisDetector:
    """Detect crisis situations from email content."""
    
    CRISIS_PATTERNS = {
        "outage": {
            "keywords": ["down", "outage", "unavailable", "not working", "error", "500", "503", "timeout",
                        "system failure", "service disruption", "downtime"],
            "severity_boosters": ["complete", "total", "all users", "production", "customer-facing"],
        },
        "security_breach": {
            "keywords": ["breach", "hack", "compromised", "unauthorized", "data leak", "vulnerability",
                        "exploit", "malware", "ransomware", "phishing", "credential"],
            "severity_boosters": ["customer data", "pii", "financial", "widespread", "active"],
        },
        "pr_crisis": {
            "keywords": ["media", "press", "viral", "social media", "complaint", "lawsuit threat",
                        "public statement", "reputation", "brand damage", "boycott"],
            "severity_boosters": ["national", "major outlet", "regulator", "ceo mentioned"],
        },
        "legal": {
            "keywords": ["legal action", "lawsuit", "litigation", "cease and desist", "regulatory",
                        "compliance violation", "subpoena", "investigation", "fine", "penalty"],
            "severity_boosters": ["class action", "government", "federal", "criminal"],
        },
        "financial": {
            "keywords": ["revenue loss", "refund demand", "chargeback", "payment failure",
                        "budget overrun", "financial impact", "penalty", "credit"],
            "severity_boosters": ["material", "significant", "quarterly impact", "investor"],
        },
    }
    
    def detect(self, email: Dict) -> List[CrisisIndicator]:
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        combined = f"{subject} {body}"
        
        indicators = []
        for crisis_type, patterns in self.CRISIS_PATTERNS.items():
            found_keywords = [kw for kw in patterns["keywords"] if kw in combined]
            if not found_keywords:
                continue
            
            found_boosters = [b for b in patterns["severity_boosters"] if b in combined]
            
            if found_boosters:
                severity = "critical" if len(found_boosters) >= 2 else "high"
            elif len(found_keywords) >= 3:
                severity = "high"
            elif len(found_keywords) >= 2:
                severity = "medium"
            else:
                severity = "low"
            
            indicators.append(CrisisIndicator(
                indicator_type=crisis_type,
                severity=severity,
                evidence=found_keywords + found_boosters,
                affected_stakeholders=[email.get("from", "")]
            ))
        
        return indicators

class ResponseGenerator:
    """Generate crisis-appropriate responses."""
    
    RESPONSE_TEMPLATES = {
        "outage": {
            "key_messages": [
                "We are aware of the issue and actively working on a resolution",
                "Our engineering team is investigating the root cause",
                "We will provide updates every 30 minutes until resolved",
                "We understand the impact and take this very seriously"
            ],
            "avoid": ["Blame third parties", "Give specific ETAs without confidence", "Minimize the impact"],
            "deadline_hours": 1,
        },
        "security_breach": {
            "key_messages": [
                "We have identified a potential security incident and are investigating",
                "We have engaged our security team and external forensics experts",
                "We will notify affected parties as required by law",
                "We are taking immediate steps to contain and remediate"
            ],
            "avoid": ["Speculate on cause", "Downplay severity", "Disclose technical details publicly", "Delay notification"],
            "deadline_hours": 2,
        },
        "pr_crisis": {
            "key_messages": [
                "We take these concerns very seriously",
                "We are conducting a thorough internal review",
                "We are committed to transparency and accountability",
                "We will share our findings and action plan"
            ],
            "avoid": ["No comment", "Denial without investigation", "Blaming individuals", "Legal jargon"],
            "deadline_hours": 4,
        },
        "legal": {
            "key_messages": [
                "We have received your communication and are reviewing it carefully",
                "We will respond through appropriate legal channels",
                "We are committed to resolving this matter professionally",
                "We take compliance obligations seriously"
            ],
            "avoid": ["Admitting liability", "Making promises", "Informal language", "Emotional responses"],
            "deadline_hours": 24,
        },
        "financial": {
            "key_messages": [
                "We acknowledge the financial impact and are working to resolve it",
                "We are reviewing the specific charges/amounts mentioned",
                "We will provide a detailed resolution within our SLA",
                "We value our business relationship and want to make this right"
            ],
            "avoid": ["Disputing amounts without evidence", "Delaying resolution", "Generic responses"],
            "deadline_hours": 8,
        },
    }
    
    ESCALATION_MAP = {
        "low": ["Team Lead"],
        "medium": ["Team Lead", "Manager"],
        "high": ["Manager", "Director", "VP"],
        "critical": ["VP", "C-Suite", "Legal", "Board (if material)"],
    }
    
    def generate(self, indicators: List[CrisisIndicator],
                 recipients: List[str] = None) -> Optional[CrisisResponse]:
        if not indicators:
            return None
        
        # Use highest severity indicator
        severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        worst = max(indicators, key=lambda i: severity_order.get(i.severity, 0))
        
        template = self.RESPONSE_TEMPLATES.get(worst.indicator_type, self.RESPONSE_TEMPLATES["outage"])
        escalation = self.ESCALATION_MAP.get(worst.severity, ["Manager"])
        
        all_stakeholders = set()
        for ind in indicators:
            all_stakeholders.update(ind.affected_stakeholders)
        if recipients:
            all_stakeholders.update(recipients)
        
        reply_all = len(recipients or []) > 1
        
        return CrisisResponse(
            crisis_type=worst.indicator_type,
            severity=worst.severity,
            response_template=f"Crisis response for {worst.indicator_type} (severity: {worst.severity})",
            stakeholders_to_notify=list(all_stakeholders),
            response_deadline_hours=template["deadline_hours"],
            escalation_path=escalation,
            key_messages=template["key_messages"],
            things_to_avoid=template["avoid"],
            reply_all_required=reply_all
        )

class CrisisCommunicationEngine:
    """Main crisis communication engine."""
    
    def __init__(self):
        self.detector = CrisisDetector()
        self.generator = ResponseGenerator()
    
    def analyze_email(self, email: Dict, recipients: List[str] = None) -> Dict:
        indicators = self.detector.detect(email)
        response = self.generator.generate(indicators, recipients)
        
        if not response:
            return {"crisis_detected": False, "email_id": email.get("id", "")}
        
        return {
            "crisis_detected": True,
            "crisis_type": response.crisis_type,
            "severity": response.severity,
            "indicators": [{"type": i.indicator_type, "severity": i.severity,
                           "evidence": i.evidence} for i in indicators],
            "response_deadline_hours": response.response_deadline_hours,
            "escalation_path": response.escalation_path,
            "key_messages": response.key_messages,
            "things_to_avoid": response.things_to_avoid,
            "stakeholders_to_notify": response.stakeholders_to_notify,
            "reply_all_required": response.reply_all_required,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = CrisisCommunicationEngine()
    sample = {
        "id": "crisis-001", "from": "ops@acme.com",
        "subject": "URGENT: Complete system outage - all customer data compromised",
        "body": "Our entire platform is down. We're seeing unauthorized access to customer PII data. This is a complete production failure affecting all users. Major tech outlets are already reaching out. We need an immediate response or we will pursue legal action. Our CEO demands answers within the hour."
    }
    result = engine.analyze_email(sample, ["ops@acme.com", "ceo@acme.com", "legal@acme.com", "support@zion.com"])
    print(json.dumps(result, indent=2))
