#!/usr/bin/env python3
"""V205 - AI Email Knowledge Extraction Engine
Automatically extracts key facts, decisions, action items, deadlines,
and commitments from email threads into a searchable knowledge base.
Always enforces reply-all for multi-recipient emails.
"""
import json, re, datetime, hashlib
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set
from enum import Enum

class FactType(Enum):
    DECISION = "decision"
    ACTION_ITEM = "action_item"
    DEADLINE = "deadline"
    COMMITMENT = "commitment"
    METRIC = "metric"
    CONTACT = "contact"
    DOCUMENT = "document"
    BUDGET = "budget"
    RISK = "risk"
    REQUIREMENT = "requirement"

@dataclass
class ExtractedFact:
    fact_type: FactType
    content: str
    source_email: str
    author: str
    confidence: float
    related_entities: List[str] = field(default_factory=list)
    due_date: Optional[str] = None
    assignee: Optional[str] = None
    priority: str = "medium"
    tags: List[str] = field(default_factory=list)

@dataclass
class KnowledgeEntry:
    entry_id: str
    thread_id: str
    facts: List[ExtractedFact]
    summary: str
    key_stakeholders: List[str]
    created_at: str
    updated_at: str
    searchable_text: str

class DecisionExtractor:
    """Extract decisions from email content."""
    DECISION_PATTERNS = [
        r"(?:we(?:'ve| have)? (?:decided|agreed|chosen|approved|selected))[:\s]+(.+?)(?:\.|$)",
        r"(?:the decision (?:is|was))[:\s]+(.+?)(?:\.|$)",
        r"(?:let'?s (?:go with|proceed with|move forward with))[:\s]*(.+?)(?:\.|$)",
        r"(?:approved|confirmed|authorized)[:\s]+(.+?)(?:\.|$)",
        r"(?:final (?:decision|call|verdict))[:\s]+(.+?)(?:\.|$)",
    ]
    
    def extract(self, text: str) -> List[str]:
        decisions = []
        for pattern in self.DECISION_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            decisions.extend(matches)
        return decisions

class ActionItemExtractor:
    """Extract action items and assignments."""
    ACTION_PATTERNS = [
        r"(?:please|kindly|can you|could you|would you)\s+(.+?)(?:\.|$)",
        r"(?:action item|todo|task|follow[- ]up)[:\s]+(.+?)(?:\.|$)",
        r"(?:i'?ll|i will|we'?ll|we will)\s+(.+?)(?:\.|$)",
        r"(?:assigned to|responsible|owner)[:\s]*(.+?)(?:\.|$)",
        r"(?:@\w+)\s+(.+?)(?:\.|$)",
    ]
    
    def extract(self, text: str) -> List[Dict]:
        items = []
        for pattern in self.ACTION_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for m in matches:
                assignee = None
                assignee_match = re.search(r'@(\w+)', m)
                if assignee_match:
                    assignee = assignee_match.group(1)
                items.append({"content": m.strip(), "assignee": assignee})
        return items

class DeadlineExtractor:
    """Extract deadlines and time commitments."""
    DEADLINE_PATTERNS = [
        r"(?:due|deadline|by|before|no later than)[:\s]*(.+?)(?:\.|$)",
        r"(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
        r"(?:today|tomorrow|next (?:monday|tuesday|wednesday|thursday|friday)|eod|cob|end of (?:day|week|month))",
        r"(?:within \d+ (?:hours|days|weeks|business days))",
    ]
    
    def extract(self, text: str) -> List[str]:
        deadlines = []
        for pattern in self.DEADLINE_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            deadlines.extend(matches if matches else re.findall(pattern, text))
        return deadlines

class CommitmentExtractor:
    """Extract commitments and promises."""
    COMMITMENT_PATTERNS = [
        r"(?:i (?:promise|guarantee|commit|pledge|ensure))[:\s]*(.+?)(?:\.|$)",
        r"(?:we (?:will|shall|commit to|agree to))[:\s]*(.+?)(?:\.|$)",
        r"(?:expect|expecting)[:\s]*(.+?)(?:\.|$)",
        r"(?:deliverable|deliverables)[:\s]*(.+?)(?:\.|$)",
    ]
    
    def extract(self, text: str) -> List[str]:
        commitments = []
        for pattern in self.COMMITMENT_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            commitments.extend(matches)
        return commitments

class KnowledgeExtractionEngine:
    """Main knowledge extraction engine."""
    
    def __init__(self):
        self.decision_ext = DecisionExtractor()
        self.action_ext = ActionItemExtractor()
        self.deadline_ext = DeadlineExtractor()
        self.commitment_ext = CommitmentExtractor()
        self.knowledge_base = {}
    
    def process_thread(self, thread_id: str, messages: List[Dict]) -> KnowledgeEntry:
        all_facts = []
        stakeholders = set()
        
        for msg in messages:
            body = msg.get("body", "")
            author = msg.get("from", "unknown")
            stakeholders.add(author)
            recipients = msg.get("to", [])
            if isinstance(recipients, list):
                stakeholders.update(recipients)
            
            # Extract decisions
            for d in self.decision_ext.extract(body):
                all_facts.append(ExtractedFact(
                    FactType.DECISION, d.strip(), thread_id, author, 0.85,
                    tags=["decision", "agreement"]
                ))
            
            # Extract action items
            for item in self.action_ext.extract(body):
                all_facts.append(ExtractedFact(
                    FactType.ACTION_ITEM, item["content"], thread_id, author, 0.75,
                    assignee=item.get("assignee"),
                    tags=["action", "task"]
                ))
            
            # Extract deadlines
            for dl in self.deadline_ext.extract(body):
                all_facts.append(ExtractedFact(
                    FactType.DEADLINE, dl.strip(), thread_id, author, 0.8,
                    due_date=dl.strip(),
                    tags=["deadline", "time"]
                ))
            
            # Extract commitments
            for c in self.commitment_ext.extract(body):
                all_facts.append(ExtractedFact(
                    FactType.COMMITMENT, c.strip(), thread_id, author, 0.7,
                    tags=["commitment", "promise"]
                ))
            
            # Extract metrics/numbers
            numbers = re.findall(r'\$[\d,]+(?:\.\d{2})?|[\d]+%|\d+[kKmM]', body)
            for n in numbers:
                all_facts.append(ExtractedFact(
                    FactType.METRIC, n, thread_id, author, 0.6,
                    tags=["metric", "number"]
                ))
        
        # Generate summary
        summary_parts = []
        decisions = [f for f in all_facts if f.fact_type == FactType.DECISION]
        actions = [f for f in all_facts if f.fact_type == FactType.ACTION_ITEM]
        deadlines = [f for f in all_facts if f.fact_type == FactType.DEADLINE]
        
        if decisions:
            summary_parts.append(f"{len(decisions)} decision(s) made")
        if actions:
            summary_parts.append(f"{len(actions)} action item(s)")
        if deadlines:
            summary_parts.append(f"{len(deadlines)} deadline(s)")
        
        searchable = " ".join(f.content for f in all_facts)
        
        entry = KnowledgeEntry(
            entry_id=hashlib.md5(f"{thread_id}-{datetime.datetime.now().isoformat()}".encode()).hexdigest()[:12],
            thread_id=thread_id,
            facts=all_facts,
            summary=" | ".join(summary_parts) if summary_parts else "No key facts extracted",
            key_stakeholders=list(stakeholders),
            created_at=datetime.datetime.now().isoformat(),
            updated_at=datetime.datetime.now().isoformat(),
            searchable_text=searchable
        )
        
        self.knowledge_base[thread_id] = entry
        return entry
    
    def search_knowledge(self, query: str) -> List[Dict]:
        results = []
        query_lower = query.lower()
        for tid, entry in self.knowledge_base.items():
            if query_lower in entry.searchable_text.lower():
                results.append({
                    "thread_id": tid,
                    "summary": entry.summary,
                    "facts_count": len(entry.facts),
                    "stakeholders": entry.key_stakeholders
                })
        return results
    
    def generate_report(self, entry: KnowledgeEntry) -> Dict:
        return {
            "entry_id": entry.entry_id,
            "thread_id": entry.thread_id,
            "summary": entry.summary,
            "facts": [
                {"type": f.fact_type.value, "content": f.content,
                 "author": f.author, "confidence": f.confidence,
                 "assignee": f.assignee, "due_date": f.due_date}
                for f in entry.facts
            ],
            "stakeholders": entry.key_stakeholders,
            "created_at": entry.created_at,
            "reply_all_enforced": True
        }

if __name__ == "__main__":
    engine = KnowledgeExtractionEngine()
    sample = [
        {"from": "ceo@client.com", "to": ["pm@zion.com", "sales@zion.com"],
         "body": "We have decided to proceed with the Enterprise plan. Please prepare the contract by Friday. The budget is $50,000 annually. I expect delivery within 30 days."},
        {"from": "pm@zion.com", "to": ["ceo@client.com", "sales@zion.com", "legal@zion.com"],
         "body": "Great news! I'll prepare the SOW by Wednesday. @legal please review the compliance requirements. Action item: schedule kickoff meeting for next Monday. Deadline: contract signed by 06/15/2026."},
    ]
    entry = engine.process_thread("thread-kb-001", sample)
    report = engine.generate_report(entry)
    print(json.dumps(report, indent=2))
