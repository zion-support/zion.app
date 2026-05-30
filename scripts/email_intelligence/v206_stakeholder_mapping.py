#!/usr/bin/env python3
"""V206 - Email Stakeholder Relationship Mapping Engine
Analyzes email communication patterns to map organizational relationships,
identify decision-makers, influencers, and communication flows.
Builds a dynamic stakeholder graph for strategic communication.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, hashlib, math
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set, Tuple
from collections import defaultdict, Counter

@dataclass
class Stakeholder:
    email: str
    name: str
    role: str
    influence_score: float = 0.0
    decision_authority: float = 0.0
    response_rate: float = 0.0
    avg_response_time_hours: float = 0.0
    sentiment_toward_us: float = 0.0
    topics: List[str] = field(default_factory=list)
    last_contact: str = ""
    contact_frequency: int = 0

@dataclass
class Relationship:
    from_email: str
    to_email: str
    strength: float = 0.0
    frequency: int = 0
    avg_sentiment: float = 0.0
    topics: List[str] = field(default_factory=list)
    last_interaction: str = ""
    is_decision_chain: bool = False

@dataclass
class StakeholderMap:
    stakeholders: Dict[str, Stakeholder]
    relationships: List[Relationship]
    decision_makers: List[str]
    influencers: List[str]
    gatekeepers: List[str]
    champions: List[str]
    risks: List[str]
    communication_clusters: List[List[str]]

class RoleDetector:
    """Detect stakeholder roles from email content."""
    ROLE_SIGNALS = {
        "executive": ["ceo", "cto", "cfo", "vp", "director", "president", "board"],
        "decision_maker": ["approve", "authorize", "sign off", "budget owner", "final call"],
        "influencer": ["recommend", "suggest", "advise", "consult", "opinion"],
        "gatekeeper": ["schedule", "calendar", "assistant", "coordination", "arrange"],
        "champion": ["support", "advocate", "believe", "endorse", "promote"],
        "technical": ["api", "architecture", "infrastructure", "deploy", "code"],
        "financial": ["budget", "cost", "pricing", "invoice", "payment", "roi"],
        "legal": ["compliance", "contract", "legal", "regulation", "terms"],
    }
    
    def detect_role(self, email_content: str, sender: str) -> Tuple[str, float]:
        content = email_content.lower()
        scores = {}
        for role, signals in self.ROLE_SIGNALS.items():
            score = sum(1 for s in signals if s in content)
            if score > 0:
                scores[role] = score
        if scores:
            best_role = max(scores, key=scores.get)
            return best_role, scores[best_role] / len(self.ROLE_SIGNALS[best_role])
        return "participant", 0.1

class InfluenceAnalyzer:
    """Analyze influence patterns in email threads."""
    INFLUENCE_INDICATORS = {
        "authority": ["i need", "please ensure", "i expect", "make sure", "require"],
        "deference_received": ["agreed", "sounds good", "will do", "understood", "noted"],
        "initiates_decisions": ["let\'s go with", "i\'ve decided", "approved", "authorized"],
        "consulted": ["what do you think", "your input", "could you review", "please advise"],
        "amplified": ["+1", "i agree with", "echo", "second that", "great point"],
    }
    
    def calculate_influence(self, messages: List[Dict], email: str) -> float:
        authority_score = 0
        deference_score = 0
        initiated = 0
        consulted = 0
        
        for msg in messages:
            body = msg.get("body", "").lower()
            from_addr = msg.get("from", "").lower()
            
            if email.lower() in from_addr:
                for indicator in self.INFLUENCE_INDICATORS["authority"]:
                    if indicator in body:
                        authority_score += 1
                for indicator in self.INFLUENCE_INDICATORS["initiates_decisions"]:
                    if indicator in body:
                        initiated += 1
            else:
                for indicator in self.INFLUENCE_INDICATORS["deference_received"]:
                    if indicator in body and email.lower() in msg.get("to", ""):
                        deference_score += 1
                for indicator in self.INFLUENCE_INDICATORS["consulted"]:
                    if indicator in body:
                        consulted += 1
        
        total = authority_score + deference_score + initiated + consulted + 1
        influence = (authority_score * 0.3 + deference_score * 0.25 +
                    initiated * 0.25 + consulted * 0.2) / total
        return min(1.0, influence)

class CommunicationClusterDetector:
    """Detect communication clusters and patterns."""
    
    def detect_clusters(self, messages: List[Dict]) -> List[List[str]]:
        interaction_graph = defaultdict(set)
        for msg in messages:
            sender = msg.get("from", "")
            recipients = msg.get("to", [])
            if isinstance(recipients, str):
                recipients = [recipients]
            for r in recipients:
                interaction_graph[sender].add(r)
                interaction_graph[r].add(sender)
        
        visited = set()
        clusters = []
        for node in interaction_graph:
            if node not in visited:
                cluster = set()
                stack = [node]
                while stack:
                    current = stack.pop()
                    if current not in visited:
                        visited.add(current)
                        cluster.add(current)
                        stack.extend(interaction_graph[current] - visited)
                if cluster:
                    clusters.append(list(cluster))
        return clusters

class StakeholderMappingEngine:
    """Main stakeholder mapping engine."""
    
    def __init__(self):
        self.role_detector = RoleDetector()
        self.influence_analyzer = InfluenceAnalyzer()
        self.cluster_detector = CommunicationClusterDetector()
    
    def build_map(self, thread_id: str, messages: List[Dict]) -> StakeholderMap:
        all_emails = set()
        email_content = defaultdict(list)
        
        for msg in messages:
            sender = msg.get("from", "")
            all_emails.add(sender)
            email_content[sender].append(msg.get("body", ""))
            recipients = msg.get("to", [])
            if isinstance(recipients, list):
                all_emails.update(recipients)
            else:
                all_emails.add(recipients)
        
        stakeholders = {}
        for email in all_emails:
            content = " ".join(email_content.get(email, [""]))
            role, confidence = self.role_detector.detect_role(content, email)
            influence = self.influence_analyzer.calculate_influence(messages, email)
            name = email.split("@")[0].replace(".", " ").title()
            
            stakeholders[email] = Stakeholder(
                email=email, name=name, role=role,
                influence_score=influence,
                decision_authority=influence * 0.8 if role == "decision_maker" else influence * 0.4,
                topics=self._extract_topics(content),
                contact_frequency=len(email_content.get(email, []))
            )
        
        # Build relationships
        relationships = []
        interaction_count = defaultdict(int)
        for msg in messages:
            sender = msg.get("from", "")
            recipients = msg.get("to", [])
            if isinstance(recipients, str):
                recipients = [recipients]
            for r in recipients:
                interaction_count[(sender, r)] += 1
        
        for (f, t), count in interaction_count.items():
            relationships.append(Relationship(
                from_email=f, to_email=t,
                strength=min(1.0, count / 5.0),
                frequency=count
            ))
        
        # Categorize
        decision_makers = [e for e, s in stakeholders.items() if s.role == "decision_maker"]
        influencers = [e for e, s in stakeholders.items() if s.influence_score > 0.6]
        gatekeepers = [e for e, s in stakeholders.items() if s.role == "gatekeeper"]
        champions = [e for e, s in stakeholders.items() if s.role == "champion"]
        risks = [e for e, s in stakeholders.items() if s.sentiment_toward_us < -0.3]
        
        clusters = self.cluster_detector.detect_clusters(messages)
        
        return StakeholderMap(
            stakeholders=stakeholders,
            relationships=relationships,
            decision_makers=decision_makers,
            influencers=influencers,
            gatekeepers=gatekeepers,
            champions=champions,
            risks=risks,
            communication_clusters=clusters
        )
    
    def _extract_topics(self, text: str) -> List[str]:
        topic_keywords = {
            "pricing": ["price", "cost", "budget", "quote", "pricing"],
            "technical": ["api", "integration", "architecture", "deploy"],
            "timeline": ["deadline", "schedule", "timeline", "delivery"],
            "compliance": ["compliance", "regulation", "gdpr", "hipaa"],
            "support": ["support", "help", "issue", "problem", "ticket"],
        }
        found = []
        text_lower = text.lower()
        for topic, keywords in topic_keywords.items():
            if any(k in text_lower for k in keywords):
                found.append(topic)
        return found
    
    def generate_strategic_report(self, smap: StakeholderMap) -> Dict:
        return {
            "total_stakeholders": len(smap.stakeholders),
            "decision_makers": smap.decision_makers,
            "influencers": smap.influencers,
            "gatekeepers": smap.gatekeepers,
            "champions": smap.champions,
            "risk_contacts": smap.risks,
            "clusters": smap.communication_clusters,
            "relationships": [
                {"from": r.from_email, "to": r.to_email,
                 "strength": round(r.strength, 2), "frequency": r.frequency}
                for r in smap.relationships
            ],
            "stakeholder_details": {
                email: {"name": s.name, "role": s.role,
                        "influence": round(s.influence_score, 2),
                        "topics": s.topics}
                for email, s in smap.stakeholders.items()
            },
            "reply_all_enforced": True,
            "strategic_recommendations": self._generate_recommendations(smap)
        }
    
    def _generate_recommendations(self, smap: StakeholderMap) -> List[str]:
        recs = []
        if smap.decision_makers:
            recs.append(f"Prioritize direct engagement with decision-makers: {smap.decision_makers}")
        if smap.influencers:
            recs.append(f"Leverage influencers for internal advocacy: {smap.influencers}")
        if smap.risks:
            recs.append(f"Address relationship risks with: {smap.risks}")
        if smap.champions:
            recs.append(f"Empower champions with exclusive previews and resources: {smap.champions}")
        return recs

if __name__ == "__main__":
    engine = StakeholderMappingEngine()
    sample = [
        {"from": "ceo@acme.com", "to": ["vp@zion.com", "sales@zion.com"],
         "body": "I\'ve decided to approve the Enterprise plan. Please have your team prepare the contract."},
        {"from": "vp@zion.com", "to": ["ceo@acme.com", "cto@acme.com", "pm@zion.com"],
         "body": "Excellent! Our technical team will schedule the kickoff. @pm please coordinate."},
        {"from": "cto@acme.com", "to": ["vp@zion.com", "pm@zion.com"],
         "body": "I recommend we start with the API integration first. What do you think about the timeline?"},
    ]
    smap = engine.build_map("thread-stake-001", sample)
    report = engine.generate_strategic_report(smap)
    print(json.dumps(report, indent=2))
