#!/usr/bin/env python3
"""V213 - AI Email Competitive Intelligence Scanner
Detect competitor mentions, pricing comparisons, and switch risks in customer emails.
Generate competitive battle cards and win/loss analysis.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict, Counter

@dataclass
class CompetitorMention:
    competitor: str
    email_id: str
    thread_id: str
    context: str
    sentiment: str  # "positive", "negative", "neutral", "comparison"
    risk_level: str  # "low", "medium", "high", "critical"
    timestamp: str
    sender: str

@dataclass
class SwitchRisk:
    customer_email: str
    customer_name: str
    risk_level: str
    risk_score: float
    competitors_mentioned: List[str]
    pain_points: List[str]
    recommended_action: str
    urgency_hours: int

@dataclass
class CompetitiveBattleCard:
    competitor: str
    mentions_count: int
    positive_mentions: int
    negative_mentions: int
    comparison_mentions: int
    common_objections: List[str]
    winning_arguments: List[str]
    pricing_comparison: Dict
    feature_gaps: List[str]

class CompetitorDetector:
    """Detect competitor mentions in emails."""
    
    # Common competitor patterns (configurable per deployment)
    COMPETITOR_PATTERNS = {
        "microsoft": ["microsoft", "azure", "office 365", "teams", "outlook"],
        "google": ["google", "gcp", "workspace", "gmail", "google cloud"],
        "amazon": ["amazon", "aws", "amazon web services"],
        "salesforce": ["salesforce", "sfdc", "force.com"],
        "hubspot": ["hubspot", "hub spot"],
        "zendesk": ["zendesk"],
        "freshdesk": ["freshdesk", "freshworks"],
        "intercom": ["intercom"],
        "drift": ["drift"],
        "slack": ["slack"],
    }
    
    def detect_mentions(self, email: Dict, thread_id: str) -> List[CompetitorMention]:
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        combined = f"{subject} {body}"
        
        mentions = []
        for competitor, patterns in self.COMPETITOR_PATTERNS.items():
            for pattern in patterns:
                if pattern in combined:
                    # Extract context (sentence containing the mention)
                    sentences = re.split(r'[.!?]+', combined)
                    context = next((s.strip() for s in sentences if pattern in s), "")
                    
                    sentiment = self._analyze_context_sentiment(context)
                    risk = self._assess_risk(sentiment, context)
                    
                    mentions.append(CompetitorMention(
                        competitor=competitor,
                        email_id=email.get("id", ""),
                        thread_id=thread_id,
                        context=context[:200],
                        sentiment=sentiment,
                        risk_level=risk,
                        timestamp=email.get("timestamp", datetime.datetime.now().isoformat()),
                        sender=email.get("from", "")
                    ))
                    break  # One mention per competitor per email
        
        return mentions
    
    def _analyze_context_sentiment(self, context: str) -> str:
        context_lower = context.lower()
        
        comparison_words = ["vs", "versus", "compared to", "better than", "worse than", "cheaper", "more expensive", "alternative"]
        positive_words = ["better", "prefer", "like", "love", "great", "switching to", "impressed"]
        negative_words = ["worse", "expensive", "limited", "frustrating", "disappointed", "switching from", "issues"]
        
        if any(w in context_lower for w in comparison_words):
            return "comparison"
        if any(w in context_lower for w in positive_words):
            return "positive"
        if any(w in context_lower for w in negative_words):
            return "negative"
        return "neutral"
    
    def _assess_risk(self, sentiment: str, context: str) -> str:
        high_risk_signals = ["switching to", "moving to", "considering", "evaluating", "cancel", "too expensive", "better alternative"]
        medium_risk_signals = ["compared to", "vs", "looking at", "also using"]
        
        context_lower = context.lower()
        
        if sentiment == "positive" and any(s in context_lower for s in high_risk_signals):
            return "critical"
        if any(s in context_lower for s in high_risk_signals):
            return "high"
        if any(s in context_lower for s in medium_risk_signals):
            return "medium"
        return "low"

class SwitchRiskAnalyzer:
    """Analyze customer switch risk based on email patterns."""
    
    PAIN_POINTS = {
        "pricing": ["expensive", "cost", "budget", "price", "cheaper", "afford"],
        "features": ["missing", "lack", "don't have", "need", "wish you had", "feature gap"],
        "support": ["slow", "unresponsive", "no help", "frustrated", "unresolved"],
        "reliability": ["downtime", "outage", "slow", "bug", "crash", "unstable"],
        "usability": ["confusing", "difficult", "complex", "hard to use", "clunky"],
    }
    
    def analyze_risk(self, customer_email: str, customer_name: str,
                     emails: List[Dict], competitor_mentions: List[CompetitorMention]) -> Optional[SwitchRisk]:
        if not competitor_mentions and not emails:
            return None
        
        risk_score = 0.0
        pain_points_found = []
        competitors = list(set(m.competitor for m in competitor_mentions))
        
        # Score based on competitor mentions
        high_risk_mentions = [m for m in competitor_mentions if m.risk_level in ("high", "critical")]
        risk_score += len(high_risk_mentions) * 25
        risk_score += len(competitor_mentions) * 5
        
        # Detect pain points
        for email in emails:
            body = email.get("body", "").lower()
            for pain, keywords in self.PAIN_POINTS.items():
                if any(kw in body for kw in keywords):
                    if pain not in pain_points_found:
                        pain_points_found.append(pain)
                    risk_score += 10
        
        # Cap at 100
        risk_score = min(100.0, risk_score)
        
        if risk_score < 20:
            return None
        
        # Determine risk level and action
        if risk_score >= 80:
            risk_level = "critical"
            action = "Immediate executive outreach with retention offer"
            urgency = 4
        elif risk_score >= 60:
            risk_level = "high"
            action = "Manager escalation with competitive counter-proposal"
            urgency = 24
        elif risk_score >= 40:
            risk_level = "medium"
            action = "Proactive check-in with value reinforcement"
            urgency = 72
        else:
            risk_level = "low"
            action = "Monitor and nurture with success stories"
            urgency = 168
        
        return SwitchRisk(
            customer_email=customer_email,
            customer_name=customer_name,
            risk_level=risk_level,
            risk_score=risk_score,
            competitors_mentioned=competitors,
            pain_points=pain_points_found,
            recommended_action=action,
            urgency_hours=urgency
        )

class BattleCardGenerator:
    """Generate competitive battle cards from email intelligence."""
    
    def generate(self, competitor: str, mentions: List[CompetitorMention],
                 all_emails: List[Dict]) -> CompetitiveBattleCard:
        comp_mentions = [m for m in mentions if m.competitor == competitor]
        
        positive = sum(1 for m in comp_mentions if m.sentiment == "positive")
        negative = sum(1 for m in comp_mentions if m.sentiment == "negative")
        comparison = sum(1 for m in comp_mentions if m.sentiment == "comparison")
        
        # Extract common objections
        objections = []
        for m in comp_mentions:
            if m.sentiment in ("positive", "comparison"):
                context_lower = m.context.lower()
                if "expensive" in context_lower:
                    objections.append("Price sensitivity")
                if "feature" in context_lower:
                    objections.append("Feature comparison")
                if "support" in context_lower:
                    objections.append("Support quality")
        
        # Extract winning arguments (where competitor is mentioned negatively)
        winning_args = []
        for m in comp_mentions:
            if m.sentiment == "negative":
                winning_args.append(m.context[:100])
        
        return CompetitiveBattleCard(
            competitor=competitor,
            mentions_count=len(comp_mentions),
            positive_mentions=positive,
            negative_mentions=negative,
            comparison_mentions=comparison,
            common_objections=list(set(objections))[:5],
            winning_arguments=winning_args[:5],
            pricing_comparison={},
            feature_gaps=[]
        )

class CompetitiveIntelligenceEngine:
    """Main competitive intelligence engine."""
    
    def __init__(self):
        self.detector = CompetitorDetector()
        self.risk_analyzer = SwitchRiskAnalyzer()
        self.battle_card_gen = BattleCardGenerator()
        self.all_mentions = []
    
    def scan_emails(self, emails: List[Dict], recipients: List[str] = None) -> Dict:
        all_mentions = []
        
        for email in emails:
            thread_id = email.get("thread_id", email.get("id", "unknown"))
            mentions = self.detector.detect_mentions(email, thread_id)
            all_mentions.extend(mentions)
        
        self.all_mentions.extend(all_mentions)
        
        # Generate competitor summary
        competitor_counts = Counter(m.competitor for m in all_mentions)
        risk_counts = Counter(m.risk_level for m in all_mentions)
        
        # Generate battle cards for top competitors
        battle_cards = {}
        for comp in competitor_counts.most_common(5):
            card = self.battle_card_gen.generate(comp[0], all_mentions, emails)
            battle_cards[comp[0]] = card.__dict__
        
        # Analyze switch risks per customer
        switch_risks = []
        customer_emails = defaultdict(list)
        for email in emails:
            customer_emails[email.get("from", "")].append(email)
        
        for cust_email, cust_emails in customer_emails.items():
            cust_mentions = [m for m in all_mentions if m.sender == cust_email]
            risk = self.risk_analyzer.analyze_risk(
                cust_email, cust_email.split("@")[0].title(),
                cust_emails, cust_mentions
            )
            if risk:
                switch_risks.append(risk.__dict__)
        
        reply_all = len(recipients or []) > 1
        
        return {
            "total_emails_scanned": len(emails),
            "competitor_mentions": len(all_mentions),
            "competitor_breakdown": dict(competitor_counts),
            "risk_breakdown": dict(risk_counts),
            "battle_cards": battle_cards,
            "switch_risks": switch_risks,
            "reply_all_required": reply_all,
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    engine = CompetitiveIntelligenceEngine()
    sample_emails = [
        {"id": "e1", "from": "client@acme.com", "thread_id": "t1", "timestamp": "2026-05-28T10:00:00",
         "subject": "Comparing options", "body": "We're evaluating Salesforce vs your platform. Salesforce seems to have better CRM features but your pricing is more competitive."},
        {"id": "e2", "from": "prospect@beta.com", "thread_id": "t2", "timestamp": "2026-05-28T14:00:00",
         "subject": "Switching from HubSpot", "body": "HubSpot is too expensive for our needs. We're considering switching to your platform. Can you match their features?"},
        {"id": "e3", "from": "client@acme.com", "thread_id": "t1", "timestamp": "2026-05-29T09:00:00",
         "subject": "Re: Comparing options", "body": "Our team is frustrated with the slow support response. Zendesk seems to have better support. This is a concern."},
    ]
    result = engine.scan_emails(sample_emails, ["client@acme.com", "prospect@beta.com", "sales@zion.com"])
    print(json.dumps(result, indent=2, default=str))
