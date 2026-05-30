#!/usr/bin/env python3
"""V204 - Email Thread Priority Escalation Engine
Detects when email threads need urgent escalation based on:
- Sentiment decay over time
- Response delay patterns
- Executive/stakeholder mentions
- Deadline proximity
- Risk indicators (legal, compliance, financial)
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, hashlib, os
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum

class EscalationLevel(Enum):
    NORMAL = 0
    MONITOR = 1
    ELEVATED = 2
    URGENT = 3
    CRITICAL = 4

class RiskCategory(Enum):
    SENTIMENT_DECAY = "sentiment_decay"
    RESPONSE_DELAY = "response_delay"
    EXECUTIVE_MENTION = "executive_mention"
    DEADLINE_RISK = "deadline_risk"
    LEGAL_COMPLIANCE = "legal_compliance"
    FINANCIAL_IMPACT = "financial_impact"
    CUSTOMER_CHURN = "customer_churn"
    REPUTATION = "reputation"

@dataclass
class EscalationSignal:
    category: RiskCategory
    score: float  # 0.0 to 1.0
    evidence: str
    timestamp: datetime.datetime = field(default_factory=datetime.datetime.now)

@dataclass
class EscalationDecision:
    thread_id: str
    level: EscalationLevel
    signals: List[EscalationSignal]
    recommended_action: str
    notify_list: List[str]
    response_deadline: datetime.datetime
    reply_all_required: bool = True
    confidence: float = 0.0
    escalation_path: List[str] = field(default_factory=list)

class SentimentDecayAnalyzer:
    """Track sentiment changes across email thread."""
    NEGATIVE_WORDS = {"angry", "frustrated", "disappointed", "unacceptable", "urgent",
                      "immediately", "escalate", "complaint", "lawsuit", "breach",
                      "cancel", "terminate", "refund", "demand", "deadline", "final"}
    POSITIVE_WORDS = {"thanks", "great", "appreciate", "excellent", "perfect",
                      "wonderful", "pleased", "satisfied", "resolved", "completed"}
    
    def analyze_decay(self, messages: List[Dict]) -> float:
        if not messages:
            return 0.0
        scores = []
        for msg in messages:
            body = msg.get("body", "").lower()
            neg = sum(1 for w in self.NEGATIVE_WORDS if w in body)
            pos = sum(1 for w in self.POSITIVE_WORDS if w in body)
            total = neg + pos + 1
            scores.append((pos - neg) / total)
        if len(scores) < 2:
            return 0.0
        decay = scores[0] - scores[-1]
        return max(0.0, min(1.0, decay))

class ResponseDelayTracker:
    """Track response delays and urgency patterns."""
    URGENCY_KEYWORDS = {"asap", "urgent", "immediately", "critical", "emergency",
                        "time-sensitive", "deadline", "eod", "cob", "today"}
    
    def calculate_delay_risk(self, messages: List[Dict]) -> Tuple[float, str]:
        if len(messages) < 2:
            return 0.0, "insufficient_data"
        delays = []
        has_urgency = False
        for i in range(1, len(messages)):
            prev_time = messages[i-1].get("timestamp", "")
            curr_time = messages[i].get("timestamp", "")
            if prev_time and curr_time:
                try:
                    t1 = datetime.datetime.fromisoformat(prev_time)
                    t2 = datetime.datetime.fromisoformat(curr_time)
                    delay_hours = (t2 - t1).total_seconds() / 3600
                    delays.append(delay_hours)
                except (ValueError, TypeError):
                    pass
            body = messages[i].get("body", "").lower()
            if any(kw in body for kw in self.URGENCY_KEYWORDS):
                has_urgency = True
        avg_delay = sum(delays) / len(delays) if delays else 0
        risk = min(1.0, avg_delay / 48.0)
        if has_urgency:
            risk = min(1.0, risk * 1.5)
        return risk, f"avg_delay={avg_delay:.1f}h, urgency={has_urgency}"

class ExecutiveDetector:
    """Detect executive and stakeholder mentions."""
    EXECUTIVE_TITLES = {"ceo", "cto", "cfo", "coo", "cpo", "ciso", "vp", "vice president",
                       "director", "board member", "stakeholder", "partner", "investor",
                       "president", "founder", "chairman"}
    
    def detect(self, messages: List[Dict]) -> Tuple[float, List[str]]:
        found = []
        for msg in messages:
            body = msg.get("body", "").lower()
            sender = msg.get("from", "").lower()
            for title in self.EXECUTIVE_TITLES:
                if title in body or title in sender:
                    found.append(f"{title} in {msg.get('from', 'unknown')}")
        score = min(1.0, len(found) * 0.3)
        return score, found

class DeadlineRiskAnalyzer:
    """Analyze deadline proximity and risk."""
    DATE_PATTERNS = [
        r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b',
        r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}\b',
        r'\b(today|tomorrow|next week|end of day|eod|cob)\b',
    ]
    
    def analyze(self, messages: List[Dict]) -> Tuple[float, str]:
        now = datetime.datetime.now()
        mentions = []
        for msg in messages:
            body = msg.get("body", "")
            for pattern in self.DATE_PATTERNS:
                matches = re.findall(pattern, body, re.IGNORECASE)
                if matches:
                    mentions.extend([str(m) for m in matches])
        risk = min(1.0, len(mentions) * 0.25)
        return risk, f"deadline_mentions={len(mentions)}"

class PriorityEscalationEngine:
    """Main escalation engine that combines all signals."""
    
    def __init__(self):
        self.sentiment = SentimentDecayAnalyzer()
        self.delay = ResponseDelayTracker()
        self.executive = ExecutiveDetector()
        self.deadline = DeadlineRiskAnalyzer()
        self.escalation_history = {}
    
    def analyze_thread(self, thread_id: str, messages: List[Dict],
                       recipients: List[str] = None) -> EscalationDecision:
        signals = []
        
        # Signal 1: Sentiment decay
        decay_score = self.sentiment.analyze_decay(messages)
        if decay_score > 0.2:
            signals.append(EscalationSignal(
                RiskCategory.SENTIMENT_DECAY, decay_score,
                f"Sentiment decay: {decay_score:.2f}"
            ))
        
        # Signal 2: Response delay
        delay_score, delay_evidence = self.delay.calculate_delay_risk(messages)
        if delay_score > 0.3:
            signals.append(EscalationSignal(
                RiskCategory.RESPONSE_DELAY, delay_score, delay_evidence
            ))
        
        # Signal 3: Executive mentions
        exec_score, exec_found = self.executive.detect(messages)
        if exec_score > 0.1:
            signals.append(EscalationSignal(
                RiskCategory.EXECUTIVE_MENTION, exec_score,
                f"Executives: {exec_found}"
            ))
        
        # Signal 4: Deadline risk
        deadline_score, deadline_evidence = self.deadline.analyze(messages)
        if deadline_score > 0.2:
            signals.append(EscalationSignal(
                RiskCategory.DEADLINE_RISK, deadline_score, deadline_evidence
            ))
        
        # Signal 5: Legal/compliance keywords
        legal_words = ["lawsuit", "litigation", "compliance", "regulation", "gdpr",
                      "hipaa", "breach", "penalty", "fine", "legal action"]
        legal_count = sum(1 for msg in messages
                         for w in legal_words if w in msg.get("body", "").lower())
        if legal_count > 0:
            signals.append(EscalationSignal(
                RiskCategory.LEGAL_COMPLIANCE, min(1.0, legal_count * 0.3),
                f"Legal keywords found: {legal_count}"
            ))
        
        # Calculate escalation level
        if signals:
            weighted_score = sum(s.score * (1 + i * 0.1) for i, s in enumerate(signals))
            avg_score = weighted_score / len(signals)
        else:
            avg_score = 0.0
        
        if avg_score >= 0.8:
            level = EscalationLevel.CRITICAL
        elif avg_score >= 0.6:
            level = EscalationLevel.URGENT
        elif avg_score >= 0.4:
            level = EscalationLevel.ELEVATED
        elif avg_score >= 0.2:
            level = EscalationLevel.MONITOR
        else:
            level = EscalationLevel.NORMAL
        
        # Determine action
        actions = {
            EscalationLevel.NORMAL: "Continue normal response flow",
            EscalationLevel.MONITOR: "Flag for supervisor review within 4 hours",
            EscalationLevel.ELEVATED: "Escalate to team lead, respond within 2 hours",
            EscalationLevel.URGENT: "Escalate to manager + legal, respond within 1 hour",
            EscalationLevel.CRITICAL: "Immediate C-suite notification, all-hands response"
        }
        
        # Reply-all enforcement
        reply_all = len(recipients or []) > 1
        
        response_deadline = datetime.datetime.now() + datetime.timedelta(
            hours={0: 24, 1: 12, 2: 4, 3: 1, 4: 0.5}[level.value]
        )
        
        return EscalationDecision(
            thread_id=thread_id,
            level=level,
            signals=signals,
            recommended_action=actions[level],
            notify_list=recipients or [],
            response_deadline=response_deadline,
            reply_all_required=reply_all,
            confidence=avg_score
        )
    
    def generate_escalation_report(self, decision: EscalationDecision) -> Dict:
        return {
            "thread_id": decision.thread_id,
            "escalation_level": decision.level.name,
            "confidence": round(decision.confidence, 3),
            "signals": [
                {"category": s.category.value, "score": round(s.score, 3), "evidence": s.evidence}
                for s in decision.signals
            ],
            "action": decision.recommended_action,
            "reply_all": decision.reply_all_required,
            "response_deadline": decision.response_deadline.isoformat(),
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = PriorityEscalationEngine()
    sample_thread = [
        {"from": "client@company.com", "body": "We need to discuss the contract renewal ASAP. Our CEO is concerned about the pricing.",
         "timestamp": "2026-05-28T09:00:00"},
        {"from": "manager@zion.com", "body": "I understand your concerns. Let me escalate this to our VP of Sales for a comprehensive review.",
         "timestamp": "2026-05-28T11:30:00"},
        {"from": "client@company.com", "body": "This is urgent. If we don\'t resolve by EOD Friday, we may need to explore alternatives. Our legal team has also raised compliance concerns.",
         "timestamp": "2026-05-28T14:00:00"},
    ]
    recipients = ["client@company.com", "manager@zion.com", "vp@zion.com", "legal@zion.com"]
    decision = engine.analyze_thread("thread-001", sample_thread, recipients)
    report = engine.generate_escalation_report(decision)
    print(json.dumps(report, indent=2))
