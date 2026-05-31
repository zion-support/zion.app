#!/usr/bin/env python3
"""
V957: Email Knowledge Graph Builder Engine
Builds a dynamic knowledge graph from email conversations, tracking entities,
relationships, topics, and context across threads for intelligent case-by-case analysis.
STRICT reply-all enforcement for all multi-recipient responses.
"""

import json
import re
import hashlib
from datetime import datetime, timezone
from collections import defaultdict
from typing import Dict, List, Optional, Any, Tuple


class EmailKnowledgeGraphBuilder:
    """Builds and queries a knowledge graph from email conversations."""

    def __init__(self):
        self.entities: Dict[str, Dict[str, Any]] = {}
        self.relationships: List[Dict[str, Any]] = []
        self.topics: Dict[str, Dict[str, Any]] = {}
        self.thread_contexts: Dict[str, Dict[str, Any]] = {}
        self.reply_all_audit: List[Dict[str, Any]] = []
        self.action_log: List[Dict[str, Any]] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze each email individually, extract entities/relationships,
        update knowledge graph, and determine appropriate action.
        """
        analysis = {
            "engine": "V957",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "knowledge_graph",
        }

        # Extract recipients for reply-all enforcement
        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        # 1. Extract entities
        extracted_entities = self._extract_entities(email)
        analysis["entities_extracted"] = len(extracted_entities)

        # 2. Extract topics
        extracted_topics = self._extract_topics(email)
        analysis["topics_identified"] = extracted_topics

        # 3. Build relationships
        new_relationships = self._build_relationships(email, extracted_entities)
        analysis["relationships_built"] = len(new_relationships)

        # 4. Thread context enrichment
        thread_id = email.get("thread_id", email.get("id", "unknown"))
        context = self._enrich_thread_context(email, thread_id)
        analysis["context_enrichment"] = context

        # 5. Determine action based on knowledge graph insights
        action = self._determine_action_from_graph(email, extracted_entities, extracted_topics, context)
        analysis["recommended_action"] = action

        # 6. REPLY-ALL ENFORCEMENT
        reply_all_check = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all_check

        # 7. Knowledge graph query suggestions
        analysis["graph_insights"] = self._query_graph_insights(email, extracted_entities)

        # Log
        self.action_log.append({
            "email_id": analysis["email_id"],
            "action": action,
            "entities": len(extracted_entities),
            "relationships": len(new_relationships),
            "reply_all": reply_all_check["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _extract_entities(self, email: Dict) -> List[Dict]:
        """Extract named entities from email content."""
        text = email.get("subject", "") + " " + email.get("body", "")
        sender = email.get("from", "")

        entities = []

        # Person entities from sender
        person_match = re.match(r'(.+?)\s*<(.+?)>', sender)
        if person_match:
            name = person_match.group(1).strip()
            email_addr = person_match.group(2).strip()
            entity_id = f"person:{email_addr}"
            self.entities[entity_id] = {
                "type": "person",
                "name": name,
                "email": email_addr,
                "mentions": self.entities.get(entity_id, {}).get("mentions", 0) + 1,
                "first_seen": self.entities.get(entity_id, {}).get("first_seen", datetime.now(timezone.utc).isoformat()),
                "last_seen": datetime.now(timezone.utc).isoformat(),
            }
            entities.append({"id": entity_id, "type": "person", "name": name})

        # Organization entities
        org_patterns = [
            r'\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s+(?:Inc|LLC|Ltd|Corp|Group|Technologies|Solutions|Systems))\.?)\b',
            r'\b((?:Inc|LLC|Ltd|Corp)\.?)\b',
        ]
        for pattern in org_patterns:
            for match in re.finditer(pattern, text):
                org_name = match.group(1).strip()
                entity_id = f"org:{org_name.lower().replace(' ', '_')}"
                if entity_id not in self.entities:
                    self.entities[entity_id] = {
                        "type": "organization",
                        "name": org_name,
                        "mentions": 0,
                    }
                self.entities[entity_id]["mentions"] += 1
                entities.append({"id": entity_id, "type": "organization", "name": org_name})

        # Product/service entities
        product_patterns = [
            r'\b((?:AI|ML|Cloud|SaaS|API|CRM|ERP)\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b',
            r'\b(v\d{2,4})\b',
        ]
        for pattern in product_patterns:
            for match in re.finditer(pattern, text):
                product_name = match.group(1).strip()
                entity_id = f"product:{product_name.lower().replace(' ', '_')}"
                if entity_id not in self.entities:
                    self.entities[entity_id] = {
                        "type": "product",
                        "name": product_name,
                        "mentions": 0,
                    }
                self.entities[entity_id]["mentions"] += 1
                entities.append({"id": entity_id, "type": "product", "name": product_name})

        # Monetary entities
        money_matches = re.findall(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:K|M|B|million|billion|thousand))?', text)
        for money in money_matches:
            entity_id = f"amount:{money.replace(' ', '_').replace(',', '').lower()}"
            self.entities[entity_id] = {"type": "monetary", "value": money}
            entities.append({"id": entity_id, "type": "monetary", "value": money})

        return entities

    def _extract_topics(self, email: Dict) -> List[str]:
        """Extract topics from email content."""
        text = (email.get("subject", "") + " " + email.get("body", "")).lower()

        topic_keywords = {
            "pricing": ["price", "pricing", "cost", "budget", "quote", "estimate", "fee"],
            "technical": ["bug", "error", "api", "code", "deploy", "server", "integration", "sdk"],
            "sales": ["proposal", "deal", "contract", "demo", "trial", "subscription"],
            "support": ["help", "issue", "problem", "ticket", "fix", "troubleshoot"],
            "security": ["security", "vulnerability", "breach", "compliance", "audit", "encryption"],
            "partnership": ["partner", "collaborate", "alliance", "joint", "reseller"],
            "hiring": ["hiring", "interview", "candidate", "position", "resume", "job"],
            "project": ["project", "milestone", "deadline", "sprint", "deliverable", "roadmap"],
        }

        detected_topics = []
        for topic, keywords in topic_keywords.items():
            if any(kw in text for kw in keywords):
                detected_topics.append(topic)
                if topic not in self.topics:
                    self.topics[topic] = {"count": 0, "first_seen": datetime.now(timezone.utc).isoformat()}
                self.topics[topic]["count"] += 1
                self.topics[topic]["last_seen"] = datetime.now(timezone.utc).isoformat()

        return detected_topics

    def _build_relationships(self, email: Dict, entities: List[Dict]) -> List[Dict]:
        """Build relationships between entities found in the same email."""
        new_rels = []
        sender = email.get("from", "")

        # Sender -> Topic relationships
        topics = self._extract_topics(email)
        for topic in topics:
            rel = {
                "from": f"person:{sender}",
                "to": f"topic:{topic}",
                "type": "discusses",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "email_id": email.get("id", "unknown"),
            }
            self.relationships.append(rel)
            new_rels.append(rel)

        # Entity co-occurrence relationships
        for i, e1 in enumerate(entities):
            for e2 in entities[i + 1:]:
                if e1["type"] != e2["type"]:
                    rel = {
                        "from": e1["id"],
                        "to": e2["id"],
                        "type": "related_to",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "email_id": email.get("id", "unknown"),
                    }
                    self.relationships.append(rel)
                    new_rels.append(rel)

        return new_rels

    def _enrich_thread_context(self, email: Dict, thread_id: str) -> Dict:
        """Enrich thread context with accumulated knowledge."""
        if thread_id not in self.thread_contexts:
            self.thread_contexts[thread_id] = {
                "email_count": 0,
                "participants": set(),
                "topics": set(),
                "entities": set(),
                "first_email": datetime.now(timezone.utc).isoformat(),
                "last_email": datetime.now(timezone.utc).isoformat(),
            }

        ctx = self.thread_contexts[thread_id]
        ctx["email_count"] += 1
        ctx["participants"].add(email.get("from", ""))
        ctx["last_email"] = datetime.now(timezone.utc).isoformat()

        return {
            "thread_id": thread_id,
            "email_count": ctx["email_count"],
            "participant_count": len(ctx["participants"]),
            "depth": email.get("thread_depth", ctx["email_count"]),
        }

    def _determine_action_from_graph(self, email: Dict, entities: List, topics: List, context: Dict) -> str:
        """Determine action based on knowledge graph insights."""
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()

        # High-value entity detection
        has_executive = any(e.get("type") == "person" and any(
            kw in e.get("name", "").lower() for kw in ["ceo", "cto", "cfo", "vp", "director"]
        ) for e in entities)

        # Monetary significance
        has_money = any(e.get("type") == "monetary" for e in entities)

        # Topic urgency
        urgent_topics = {"security", "technical"}
        has_urgent_topic = bool(set(topics) & urgent_topics)

        # Thread maturity
        deep_thread = context.get("email_count", 0) > 5

        if has_executive and has_money:
            return "EXECUTIVE_REVIEW_REQUIRED"
        elif has_urgent_topic:
            return "URGENT_SPECIALIST_ROUTING"
        elif has_money:
            return "FINANCE_REVIEW_REQUIRED"
        elif deep_thread:
            return "THREAD_SUMMARY_AND_ESCALATION"
        elif len(topics) >= 3:
            return "MULTI_TOPIC_COORDINATION"
        else:
            return "STANDARD_KNOWLEDGE_CAPTURE"

    def _enforce_reply_all(self, email: Dict, all_recipients: List, is_multi: bool) -> Dict:
        """STRICT reply-all enforcement."""
        result = {
            "is_multi_recipient": is_multi,
            "recipient_count": len(all_recipients),
            "enforced": False,
            "reason": "",
        }
        if is_multi:
            result["enforced"] = True
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients in thread."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "recipients": all_recipients,
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient — standard reply."
        return result

    def _query_graph_insights(self, email: Dict, entities: List) -> Dict:
        """Query the knowledge graph for relevant insights."""
        return {
            "total_entities": len(self.entities),
            "total_relationships": len(self.relationships),
            "total_topics": len(self.topics),
            "active_threads": len(self.thread_contexts),
            "related_entities": [e["name"] if "name" in e else e.get("value", "") for e in entities[:5]],
        }

    def get_stats(self) -> Dict:
        return {
            "total_entities": len(self.entities),
            "total_relationships": len(self.relationships),
            "total_topics": len(self.topics),
            "active_threads": len(self.thread_contexts),
            "emails_analyzed": len(self.action_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


# === Test Suite ===
def test_v957():
    engine = EmailKnowledgeGraphBuilder()

    # Test 1: Multi-recipient with entities
    email1 = {
        "id": "kg-001",
        "from": "John Smith <john@acme.com>",
        "to": ["sales@ziontechgroup.com", "support@ziontechgroup.com"],
        "cc": ["ceo@acme.com"],
        "subject": "AI Cloud Platform proposal - $500K deal",
        "body": "Hi team, we need to discuss the AI Cloud Platform proposal worth $500K. Our CEO wants to review the technical integration details.",
        "thread_id": "thread-001",
        "thread_depth": 3,
    }

    result1 = engine.analyze_email_case_by_case(email1)
    assert result1["reply_all_enforcement"]["enforced"] is True
    assert result1["entities_extracted"] > 0
    assert len(result1["topics_identified"]) > 0
    print(f"✅ Test 1 PASSED: {result1['entities_extracted']} entities, topics: {result1['topics_identified']}")

    # Test 2: Single recipient follow-up
    email2 = {
        "id": "kg-002",
        "from": "alice@startup.io",
        "to": ["support@ziontechgroup.com"],
        "subject": "Bug in API integration",
        "body": "Getting a 500 error when calling the API endpoint.",
        "thread_id": "thread-002",
    }

    result2 = engine.analyze_email_case_by_case(email2)
    assert result2["reply_all_enforcement"]["enforced"] is False
    assert "technical" in result2["topics_identified"]
    print(f"✅ Test 2 PASSED: Technical topic detected, single recipient")

    # Test 3: Knowledge graph stats
    stats = engine.get_stats()
    assert stats["total_entities"] > 0
    assert stats["emails_analyzed"] == 2
    print(f"✅ Test 3 PASSED: Graph has {stats['total_entities']} entities, {stats['total_relationships']} relationships")

    print("\n🎉 V957 ALL TESTS PASSED — Knowledge Graph Builder Engine operational!")
    return True


if __name__ == "__main__":
    test_v957()
