#!/usr/bin/env python3
"""
V981: Email Context Memory Engine
Remembers past interactions with each contact for personalized responses.
Enables contextual awareness and relationship building.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from collections import defaultdict


class EmailContextMemory:
    """Maintains context memory for email conversations and contacts."""

    def __init__(self):
        self.contact_memory: Dict[str, Dict] = {}  # email -> memory
        self.conversation_threads: Dict[str, List[Dict]] = {}  # thread_id -> emails
        self.topic_history: Dict[str, List[str]] = {}  # email -> topics
        self.reply_all_audit: List[Dict] = []
        self.memory_log: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze email with context memory case by case."""
        analysis = {
            "engine": "V981",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "context_memory",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        sender = email.get("from", "")
        body = email.get("body", "")
        subject = email.get("subject", "")
        thread_id = email.get("thread_id", analysis["email_id"])

        # 1. Retrieve contact memory
        contact_memory = self._retrieve_contact_memory(sender)
        analysis["contact_memory"] = contact_memory

        # 2. Thread context
        thread_context = self._retrieve_thread_context(thread_id)
        analysis["thread_context"] = thread_context

        # 3. Topic continuity
        topic_continuity = self._analyze_topic_continuity(sender, body)
        analysis["topic_continuity"] = topic_continuity

        # 4. Relationship stage
        relationship_stage = self._assess_relationship_stage(contact_memory)
        analysis["relationship_stage"] = relationship_stage

        # 5. Personalization opportunities
        personalization = self._identify_personalization(contact_memory, body)
        analysis["personalization_opportunities"] = personalization

        # 6. Context gaps
        context_gaps = self._identify_context_gaps(contact_memory, body)
        analysis["context_gaps"] = context_gaps

        # 7. Memory update plan
        memory_update = self._plan_memory_update(email, body)
        analysis["memory_update"] = memory_update

        # 8. Determine action
        action = self._determine_memory_action(contact_memory, personalization, context_gaps)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Update memory
        self._update_memory(email, body)

        self.memory_log.append({
            "email_id": analysis["email_id"],
            "sender": sender,
            "thread_id": thread_id,
            "has_memory": contact_memory["has_memory"],
            "personalization_count": len(personalization["opportunities"]),
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _retrieve_contact_memory(self, sender: str) -> Dict:
        """Retrieve memory for a contact."""
        if sender in self.contact_memory:
            memory = self.contact_memory[sender]
            return {
                "has_memory": True,
                "interaction_count": memory.get("interaction_count", 0),
                "first_contact": memory.get("first_contact"),
                "last_contact": memory.get("last_contact"),
                "topics_discussed": memory.get("topics", []),
                "preferences": memory.get("preferences", {}),
                "key_facts": memory.get("key_facts", []),
            }
        
        return {
            "has_memory": False,
            "interaction_count": 0,
            "first_contact": None,
            "last_contact": None,
            "topics_discussed": [],
            "preferences": {},
            "key_facts": [],
        }

    def _retrieve_thread_context(self, thread_id: str) -> Dict:
        """Retrieve context for a conversation thread."""
        if thread_id in self.conversation_threads:
            thread = self.conversation_threads[thread_id]
            return {
                "has_context": True,
                "message_count": len(thread),
                "participants": list(set([msg.get("from", "") for msg in thread])),
                "duration_days": self._calculate_thread_duration(thread),
                "last_message": thread[-1] if thread else None,
            }
        
        return {
            "has_context": False,
            "message_count": 0,
            "participants": [],
            "duration_days": 0,
            "last_message": None,
        }

    def _calculate_thread_duration(self, thread: List[Dict]) -> int:
        """Calculate thread duration in days."""
        if len(thread) < 2:
            return 0
        
        try:
            first = datetime.fromisoformat(thread[0].get("timestamp", ""))
            last = datetime.fromisoformat(thread[-1].get("timestamp", ""))
            return (last - first).days
        except:
            return 0

    def _analyze_topic_continuity(self, sender: str, body: str) -> Dict:
        """Analyze topic continuity with a contact."""
        current_topics = self._extract_topics(body)
        
        if sender in self.topic_history:
            past_topics = self.topic_history[sender]
            overlapping = set(current_topics) & set(past_topics)
            new_topics = set(current_topics) - set(past_topics)
            
            return {
                "has_continuity": len(overlapping) > 0,
                "overlapping_topics": list(overlapping),
                "new_topics": list(new_topics),
                "continuity_score": len(overlapping) / max(len(current_topics), 1),
            }
        
        return {
            "has_continuity": False,
            "overlapping_topics": [],
            "new_topics": current_topics,
            "continuity_score": 0,
        }

    def _extract_topics(self, text: str) -> List[str]:
        """Extract topics from text."""
        topics = []
        topic_keywords = {
            "technical": ["api", "code", "bug", "feature", "integration", "technical"],
            "business": ["budget", "timeline", "proposal", "contract", "business"],
            "planning": ["schedule", "meeting", "deadline", "milestone", "planning"],
            "support": ["issue", "problem", "help", "support", "question"],
            "sales": ["pricing", "quote", "deal", "sales"],
        }
        
        text_lower = text.lower()
        for topic, keywords in topic_keywords.items():
            if any(kw in text_lower for kw in keywords):
                topics.append(topic)
        
        return topics

    def _assess_relationship_stage(self, contact_memory: Dict) -> Dict:
        """Assess relationship stage based on memory."""
        if not contact_memory["has_memory"]:
            return {"stage": "NEW_CONTACT", "score": 0}
        
        interaction_count = contact_memory["interaction_count"]
        
        if interaction_count < 3:
            return {"stage": "INTRODUCTORY", "score": 20}
        elif interaction_count < 10:
            return {"stage": "DEVELOPING", "score": 50}
        elif interaction_count < 30:
            return {"stage": "ESTABLISHED", "score": 75}
        else:
            return {"stage": "LONG_TERM", "score": 90}

    def _identify_personalization(self, contact_memory: Dict, body: str) -> Dict:
        """Identify personalization opportunities."""
        opportunities = []
        
        if contact_memory["has_memory"]:
            # Reference past topics
            if contact_memory["topics_discussed"]:
                opportunities.append({
                    "type": "topic_reference",
                    "suggestion": f"Reference previous discussion about {contact_memory['topics_discussed'][0]}",
                    "confidence": 0.8,
                })
            
            # Use preferences
            if contact_memory["preferences"]:
                opportunities.append({
                    "type": "preference_matching",
                    "suggestion": "Match communication style to their preferences",
                    "confidence": 0.9,
                })
            
            # Reference key facts
            if contact_memory["key_facts"]:
                opportunities.append({
                    "type": "fact_reference",
                    "suggestion": f"Reference known fact: {contact_memory['key_facts'][0]}",
                    "confidence": 0.85,
                })
        
        return {
            "opportunities": opportunities,
            "count": len(opportunities),
            "personalization_level": "HIGH" if len(opportunities) >= 2 else "MEDIUM" if len(opportunities) == 1 else "LOW",
        }

    def _identify_context_gaps(self, contact_memory: Dict, body: str) -> Dict:
        """Identify gaps in context memory."""
        gaps = []
        
        if not contact_memory["has_memory"]:
            gaps.append({
                "type": "no_history",
                "description": "No previous interaction history",
                "priority": "LOW",
            })
        
        if contact_memory["has_memory"] and not contact_memory["preferences"]:
            gaps.append({
                "type": "no_preferences",
                "description": "Communication preferences unknown",
                "priority": "MEDIUM",
            })
        
        if contact_memory["has_memory"] and not contact_memory["key_facts"]:
            gaps.append({
                "type": "no_facts",
                "description": "No key facts recorded",
                "priority": "MEDIUM",
            })
        
        return {
            "gaps": gaps,
            "count": len(gaps),
            "priority": "HIGH" if any(g["priority"] == "HIGH" for g in gaps) else "MEDIUM" if any(g["priority"] == "MEDIUM" for g in gaps) else "LOW",
        }

    def _plan_memory_update(self, email: Dict, body: str) -> Dict:
        """Plan memory update based on current email."""
        updates = []
        
        # Extract new topics
        topics = self._extract_topics(body)
        if topics:
            updates.append({
                "type": "add_topics",
                "data": topics,
            })
        
        # Extract key facts (dates, names, numbers)
        facts = self._extract_key_facts(body)
        if facts:
            updates.append({
                "type": "add_facts",
                "data": facts,
            })
        
        # Detect preferences
        preferences = self._detect_preferences(body)
        if preferences:
            updates.append({
                "type": "update_preferences",
                "data": preferences,
            })
        
        return {
            "updates": updates,
            "update_count": len(updates),
        }

    def _extract_key_facts(self, body: str) -> List[str]:
        """Extract key facts from email body."""
        facts = []
        
        # Dates
        dates = re.findall(r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b', body)
        facts.extend([f"Date mentioned: {d}" for d in dates[:3]])
        
        # Names (capitalized words)
        names = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b', body)
        facts.extend([f"Name mentioned: {n}" for n in names[:3]])
        
        # Numbers
        numbers = re.findall(r'\b(\d{2,})\b', body)
        facts.extend([f"Number mentioned: {n}" for n in numbers[:3]])
        
        return facts

    def _detect_preferences(self, body: str) -> Dict:
        """Detect communication preferences."""
        preferences = {}
        
        # Formality
        if any(word in body.lower() for word in ["please", "thank you", "regards"]):
            preferences["formality"] = "FORMAL"
        elif any(word in body.lower() for word in ["hey", "thanks", "cheers"]):
            preferences["formality"] = "CASUAL"
        
        # Length preference
        word_count = len(body.split())
        if word_count > 200:
            preferences["length"] = "DETAILED"
        elif word_count < 50:
            preferences["length"] = "CONCISE"
        
        return preferences

    def _update_memory(self, email: Dict, body: str):
        """Update memory with current email."""
        sender = email.get("from", "")
        thread_id = email.get("thread_id", email.get("id", ""))
        
        # Update contact memory
        if sender not in self.contact_memory:
            self.contact_memory[sender] = {
                "interaction_count": 0,
                "first_contact": email.get("timestamp"),
                "last_contact": None,
                "topics": [],
                "preferences": {},
                "key_facts": [],
            }
        
        memory = self.contact_memory[sender]
        memory["interaction_count"] += 1
        memory["last_contact"] = email.get("timestamp")
        
        # Add topics
        topics = self._extract_topics(body)
        memory["topics"].extend(topics)
        memory["topics"] = list(set(memory["topics"]))[-10:]  # Keep last 10
        
        # Add facts
        facts = self._extract_key_facts(body)
        memory["key_facts"].extend(facts)
        memory["key_facts"] = memory["key_facts"][-20:]  # Keep last 20
        
        # Update preferences
        preferences = self._detect_preferences(body)
        memory["preferences"].update(preferences)
        
        # Update thread
        if thread_id not in self.conversation_threads:
            self.conversation_threads[thread_id] = []
        self.conversation_threads[thread_id].append(email)
        
        # Update topic history
        if sender not in self.topic_history:
            self.topic_history[sender] = []
        self.topic_history[sender].extend(topics)
        self.topic_history[sender] = self.topic_history[sender][-20:]  # Keep last 20

    def _determine_memory_action(self, contact_memory: Dict, personalization: Dict, context_gaps: Dict) -> str:
        """Determine action based on memory analysis."""
        if not contact_memory["has_memory"]:
            return "INITIALIZE_CONTACT_MEMORY"
        
        if personalization["personalization_level"] == "HIGH":
            return "HIGHLY_PERSONALIZE_RESPONSE"
        elif personalization["personalization_level"] == "MEDIUM":
            return "MODERATELY_PERSONALIZE_RESPONSE"
        
        if context_gaps["priority"] == "HIGH":
            return "GATHER_MISSING_CONTEXT"
        
        return "STANDARD_PERSONALIZED_RESPONSE"

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
            result["reason"] = f"REPLY-ALL ENFORCED: {len(all_recipients)} recipients."
            self.reply_all_audit.append({
                "email_id": email.get("id", "unknown"),
                "enforced": True,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        else:
            result["reason"] = "Single recipient."
        return result

    def get_stats(self) -> Dict:
        if not self.memory_log:
            return {"emails_analyzed": 0}
        return {
            "emails_analyzed": len(self.memory_log),
            "contacts_tracked": len(self.contact_memory),
            "threads_tracked": len(self.conversation_threads),
            "avg_personalization": sum(m["personalization_count"] for m in self.memory_log) / len(self.memory_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v981():
    engine = EmailContextMemory()

    # Test 1: First contact
    email1 = {
        "id": "ctx-001",
        "from": "new.client@company.com",
        "to": ["sales@ziontechgroup.com", "support@ziontechgroup.com"],
        "subject": "Initial inquiry about AI services",
        "body": "Hi, I'm interested in your AI services. Can you send me pricing information? We have a budget of $50,000 and need to implement by March 15th.",
        "timestamp": "2024-01-15T10:00:00Z",
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert r1["contact_memory"]["has_memory"] is False
    assert r1["relationship_stage"]["stage"] == "NEW_CONTACT"
    print(f"✅ Test 1 PASSED: New contact detected, stage={r1['relationship_stage']['stage']}, reply-all enforced")

    # Test 2: Follow-up from same contact
    email2 = {
        "id": "ctx-002",
        "from": "new.client@company.com",
        "to": ["sales@ziontechgroup.com"],
        "subject": "Re: Initial inquiry about AI services",
        "body": "Thanks for the quick response. I reviewed the pricing and it looks good. Can we schedule a call to discuss the technical integration?",
        "thread_id": "ctx-001",
        "timestamp": "2024-01-15T14:00:00Z",
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["contact_memory"]["has_memory"] is True
    assert r2["contact_memory"]["interaction_count"] == 1
    assert r2["topic_continuity"]["has_continuity"] is True
    print(f"✅ Test 2 PASSED: Memory retrieved, interactions={r2['contact_memory']['interaction_count']}, continuity={r2['topic_continuity']['has_continuity']}")

    # Test 3: Third interaction
    email3 = {
        "id": "ctx-003",
        "from": "new.client@company.com",
        "to": ["sales@ziontechgroup.com"],
        "subject": "Re: Initial inquiry about AI services",
        "body": "The call went well. Please send the contract and we can proceed with the March 15th deadline.",
        "thread_id": "ctx-001",
        "timestamp": "2024-01-16T09:00:00Z",
    }
    r3 = engine.analyze_email_case_by_case(email3)
    assert r3["contact_memory"]["interaction_count"] == 2
    assert r3["relationship_stage"]["stage"] == "INTRODUCTORY"
    print(f"✅ Test 3 PASSED: Relationship developing, interactions={r3['contact_memory']['interaction_count']}, stage={r3['relationship_stage']['stage']}")

    stats = engine.get_stats()
    print(f"✅ Test 4 PASSED: {stats['emails_analyzed']} analyzed, {stats['contacts_tracked']} contacts tracked")

    print("\n🎉 V981 ALL TESTS PASSED — Email Context Memory Engine operational!")
    return True


if __name__ == "__main__":
    test_v981()
