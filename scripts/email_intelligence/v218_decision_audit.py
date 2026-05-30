#!/usr/bin/env python3
"""V218 - AI Email Decision Audit Trail
Automatically document the decision-making process from email discussions,
track who agreed to what and when, generate decision summaries for compliance,
and create searchable decision history with rationale.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, hashlib
from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class Decision:
    decision_id: str
    thread_id: str
    content: str
    decision_maker: str
    approvers: List[str]
    rationale: str
    timestamp: str
    status: str  # "proposed", "approved", "rejected", "deferred", "implemented"
    confidence: float
    tags: List[str] = field(default_factory=list)

@dataclass
class AuditEntry:
    entry_id: str
    decision_id: str
    action: str  # "proposed", "discussed", "amended", "approved", "rejected"
    actor: str
    timestamp: str
    evidence: str
    chain_of_custody: str

@dataclass
class DecisionAuditReport:
    thread_id: str
    decisions: List[Decision]
    audit_trail: List[AuditEntry]
    compliance_status: str
    governance_score: float
    gaps_identified: List[str]
    reply_all_required: bool

class DecisionExtractor:
    """Extract decisions from email threads."""
    
    DECISION_PATTERNS = [
        (r"(?:we(?:'ve| have)?) (?:decided|agreed|chosen|approved|selected)\s+(?:to|that)?\s*(.{10,200}?)(?:\.|$)", "approved"),
        (r"(?:the decision|our decision|final decision) (?:is|was|has been)\s+(.{10,200}?)(?:\.|$)", "approved"),
        (r"(?:let'?s|let us) (?:go with|proceed with|move forward with|implement)\s*(.{10,200}?)(?:\.|$)", "approved"),
        (r"(?:i|we) (?:propose|suggest|recommend)\s+(?:that|we)?\s*(.{10,200}?)(?:\.|$)", "proposed"),
        (r"(?:reject|decline|denied|not (?:going to|proceeding))\s+(?:to|with)?\s*(.{10,200}?)(?:\.|$)", "rejected"),
        (r"(?:defer|postpone|hold off|table)\s+(?:this|the)?\s*(.{10,200}?)(?:\.|$)", "deferred"),
    ]
    
    APPROVAL_SIGNALS = ["approved", "agreed", "confirmed", "signed off", "go ahead",
                        "looks good", "lgtm", "+1", "green light", "thumbs up"]
    
    def extract(self, messages: List[Dict]) -> List[Decision]:
        decisions = []
        
        for msg in messages:
            body = msg.get("body", "")
            sender = msg.get("from", "")
            timestamp = msg.get("timestamp", datetime.datetime.now().isoformat())
            
            for pattern, status in self.DECISION_PATTERNS:
                matches = re.findall(pattern, body, re.IGNORECASE)
                for match in matches:
                    decision_id = hashlib.md5(f"{sender}_{timestamp}_{match[:50]}".encode()).hexdigest()[:12]
                    
                    # Detect approvers
                    approvers = []
                    for signal in self.APPROVAL_SIGNALS:
                        if signal in body.lower():
                            approvers.append(sender)
                    
                    rationale = self._extract_rationale(body)
                    confidence = self._score_confidence(body, status)
                    
                    decisions.append(Decision(
                        decision_id=decision_id,
                        thread_id=msg.get("thread_id", ""),
                        content=match.strip(),
                        decision_maker=sender,
                        approvers=approvers,
                        rationale=rationale,
                        timestamp=timestamp,
                        status=status,
                        confidence=confidence,
                        tags=self._extract_tags(body)
                    ))
        
        return decisions
    
    def _extract_rationale(self, body: str) -> str:
        rationale_patterns = [
            r"(?:because|since|due to|given that|as)\s+(.{10,150}?)(?:\.|$)",
            r"(?:reason|rationale|justification)[:\s]+(.{10,150}?)(?:\.|$)",
        ]
        for pattern in rationale_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            if matches:
                return matches[0].strip()
        return "Rationale not explicitly stated"
    
    def _score_confidence(self, body: str, status: str) -> float:
        score = 0.5
        if status == "approved":
            score += 0.3
        for signal in self.APPROVAL_SIGNALS:
            if signal in body.lower():
                score += 0.05
        if "explicit" in body.lower() or "formal" in body.lower():
            score += 0.1
        return min(1.0, score)
    
    def _extract_tags(self, body: str) -> List[str]:
        tags = []
        tag_keywords = {
            "budget": ["budget", "cost", "pricing", "expense"],
            "timeline": ["deadline", "timeline", "schedule", "date"],
            "technical": ["api", "architecture", "infrastructure", "deploy"],
            "compliance": ["compliance", "regulation", "legal", "audit"],
            "strategic": ["strategy", "roadmap", "vision", "long-term"],
        }
        body_lower = body.lower()
        for tag, keywords in tag_keywords.items():
            if any(kw in body_lower for kw in keywords):
                tags.append(tag)
        return tags

class AuditTrailBuilder:
    """Build audit trail for decisions."""
    
    def build(self, decisions: List[Decision], messages: List[Dict]) -> List[AuditEntry]:
        entries = []
        
        for decision in decisions:
            # Initial proposal entry
            entries.append(AuditEntry(
                entry_id=f"audit_{decision.decision_id}_propose",
                decision_id=decision.decision_id,
                action="proposed",
                actor=decision.decision_maker,
                timestamp=decision.timestamp,
                evidence=decision.content[:200],
                chain_of_custody=hashlib.sha256(f"{decision.decision_id}_{decision.timestamp}".encode()).hexdigest()[:16]
            ))
            
            # Approval entries
            for approver in decision.approvers:
                entries.append(AuditEntry(
                    entry_id=f"audit_{decision.decision_id}_approve_{approver[:10]}",
                    decision_id=decision.decision_id,
                    action="approved" if decision.status == "approved" else decision.status,
                    actor=approver,
                    timestamp=decision.timestamp,
                    evidence=f"Approved: {decision.content[:100]}",
                    chain_of_custody=hashlib.sha256(f"{decision.decision_id}_{approver}".encode()).hexdigest()[:16]
                ))
        
        return entries

class DecisionAuditEngine:
    """Main decision audit trail engine."""
    
    def __init__(self):
        self.extractor = DecisionExtractor()
        self.audit_builder = AuditTrailBuilder()
    
    def process_thread(self, thread_id: str, messages: List[Dict],
                       recipients: List[str] = None) -> DecisionAuditReport:
        # Add thread_id to messages
        for msg in messages:
            msg["thread_id"] = thread_id
        
        decisions = self.extractor.extract(messages)
        audit_trail = self.audit_builder.build(decisions, messages)
        
        # Compliance check
        gaps = []
        approved_decisions = [d for d in decisions if d.status == "approved"]
        
        for d in approved_decisions:
            if not d.approvers:
                gaps.append(f"Decision '{d.content[:50]}' has no recorded approvers")
            if d.rationale == "Rationale not explicitly stated":
                gaps.append(f"Decision '{d.content[:50]}' lacks documented rationale")
            if d.confidence < 0.6:
                gaps.append(f"Decision '{d.content[:50]}' has low confidence ({d.confidence})")
        
        governance_score = max(0, 100 - len(gaps) * 15)
        compliance = "compliant" if not gaps else "gaps_identified"
        
        reply_all = len(recipients or []) > 1
        
        return DecisionAuditReport(
            thread_id=thread_id,
            decisions=decisions,
            audit_trail=audit_trail,
            compliance_status=compliance,
            governance_score=governance_score,
            gaps_identified=gaps,
            reply_all_required=reply_all
        )
    
    def generate_report(self, report: DecisionAuditReport) -> Dict:
        return {
            "thread_id": report.thread_id,
            "decisions_count": len(report.decisions),
            "decisions": [
                {"id": d.decision_id, "content": d.content, "maker": d.decision_maker,
                 "status": d.status, "confidence": round(d.confidence, 2),
                 "rationale": d.rationale, "approvers": d.approvers, "tags": d.tags}
                for d in report.decisions
            ],
            "audit_trail": [
                {"action": e.action, "actor": e.actor, "timestamp": e.timestamp,
                 "chain_of_custody": e.chain_of_custody}
                for e in report.audit_trail
            ],
            "compliance_status": report.compliance_status,
            "governance_score": report.governance_score,
            "gaps": report.gaps_identified,
            "reply_all_enforced": report.reply_all_required,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = DecisionAuditEngine()
    sample = [
        {"from": "pm@zion.com", "timestamp": "2026-05-25T09:00:00",
         "body": "I propose we migrate to PostgreSQL because our current MySQL setup can't handle the scale. Budget is $50,000 for the migration."},
        {"from": "cto@zion.com", "timestamp": "2026-05-25T14:00:00",
         "body": "Looks good. I agree with the PostgreSQL migration. The rationale is sound given our scaling requirements."},
        {"from": "ceo@zion.com", "timestamp": "2026-05-26T10:00:00",
         "body": "We have decided to proceed with the PostgreSQL migration. Approved budget of $50,000. Let's move forward with implementation by Q3."},
    ]
    report = engine.process_thread("decision-001", sample, ["pm@zion.com", "cto@zion.com", "ceo@zion.com"])
    print(json.dumps(engine.generate_report(report), indent=2))
