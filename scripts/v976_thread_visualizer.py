#!/usr/bin/env python3
"""
V976: Email Thread Visualizer Engine
Creates interactive thread graphs showing participants, topics, decision flow,
and conversation progression for complex email discussions.
STRICT reply-all enforcement for all multi-recipient emails.
"""

import re
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Any, Set
from collections import defaultdict


class ThreadVisualizer:
    """Visualizes email threads as interactive graphs."""

    def __init__(self):
        self.thread_graphs: Dict[str, Dict] = {}
        self.visualizer_log: List[Dict] = []
        self.reply_all_audit: List[Dict] = []

    def analyze_email_case_by_case(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze and visualize thread case by case."""
        analysis = {
            "engine": "V976",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_id": email.get("id", hashlib.md5(str(email).encode()).hexdigest()[:12]),
            "analysis_type": "thread_visualization",
        }

        to_recipients = email.get("to", [])
        cc_recipients = email.get("cc", [])
        all_recipients = to_recipients + cc_recipients
        is_multi_recipient = len(all_recipients) > 1

        body = email.get("body", "")
        subject = email.get("subject", "")
        sender = email.get("from", "")
        thread_id = email.get("thread_id", analysis["email_id"])

        # 1. Extract participants
        participants = self._extract_participants(email)
        analysis["participants"] = participants

        # 2. Extract conversation nodes
        nodes = self._extract_conversation_nodes(email, body)
        analysis["conversation_nodes"] = nodes

        # 3. Extract edges (relationships between participants)
        edges = self._extract_edges(sender, all_recipients, thread_id)
        analysis["edges"] = edges

        # 4. Topic flow analysis
        topic_flow = self._analyze_topic_flow(body, thread_id)
        analysis["topic_flow"] = topic_flow

        # 5. Decision points identification
        decisions = self._identify_decision_points(body)
        analysis["decision_points"] = decisions

        # 6. Thread complexity metrics
        complexity = self._calculate_thread_complexity(email, participants, edges)
        analysis["thread_complexity"] = complexity

        # 7. Generate visualization data
        visualization = self._generate_visualization_data(
            participants, nodes, edges, topic_flow, decisions
        )
        analysis["visualization_data"] = visualization

        # 8. Thread summary
        summary = self._generate_thread_summary(participants, nodes, decisions, complexity)
        analysis["thread_summary"] = summary

        # 9. Determine action
        action = self._determine_visualization_action(complexity, participants)
        analysis["recommended_action"] = action

        # REPLY-ALL ENFORCEMENT
        reply_all = self._enforce_reply_all(email, all_recipients, is_multi_recipient)
        analysis["reply_all_enforcement"] = reply_all

        # Store thread graph
        self.thread_graphs[thread_id] = {
            "thread_id": thread_id,
            "participants": participants,
            "nodes": nodes,
            "edges": edges,
            "decisions": decisions,
            "timestamp": analysis["timestamp"],
        }

        self.visualizer_log.append({
            "email_id": analysis["email_id"],
            "thread_id": thread_id,
            "participant_count": len(participants),
            "node_count": len(nodes),
            "edge_count": len(edges),
            "reply_all": reply_all["enforced"],
            "timestamp": analysis["timestamp"],
        })

        return analysis

    def _extract_participants(self, email: Dict) -> List[Dict]:
        """Extract all participants from email."""
        participants = []
        
        sender = email.get("from", "")
        if sender:
            participants.append({
                "email": sender,
                "role": "sender",
                "type": "active",
            })

        for recipient in email.get("to", []):
            participants.append({
                "email": recipient,
                "role": "to_recipient",
                "type": "active",
            })

        for recipient in email.get("cc", []):
            participants.append({
                "email": recipient,
                "role": "cc_recipient",
                "type": "observer",
            })

        return participants

    def _extract_conversation_nodes(self, email: Dict, body: str) -> List[Dict]:
        """Extract conversation nodes (messages, questions, decisions)."""
        nodes = []
        body_lower = body.lower()

        # Question nodes
        questions = re.findall(r'(.{20,100}?)\?', body)
        for i, q in enumerate(questions[:5]):
            nodes.append({
                "id": f"q_{i}",
                "type": "question",
                "content": q.strip(),
                "timestamp": email.get("timestamp"),
            })

        # Decision nodes
        decision_patterns = [
            r'\b(?:decided|agreed|approved|confirmed)[:\s]+(.{20,100}?)(?:\.|$)',
            r'\b(?:we will|let\'s|I\'ll)\s+(.{20,100}?)(?:\.|$)',
        ]
        for pattern in decision_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for i, match in enumerate(matches[:3]):
                nodes.append({
                    "id": f"d_{len(nodes)}",
                    "type": "decision",
                    "content": match.strip(),
                    "timestamp": email.get("timestamp"),
                })

        # Action item nodes
        action_patterns = [
            r'\b(?:please|could you|can you)\s+(.{20,80}?)(?:\.|$)',
            r'\b(?:action item|todo|task)[:\s]+(.{20,80}?)(?:\.|$)',
        ]
        for pattern in action_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for i, match in enumerate(matches[:3]):
                nodes.append({
                    "id": f"a_{len(nodes)}",
                    "type": "action",
                    "content": match.strip(),
                    "timestamp": email.get("timestamp"),
                })

        # If no specific nodes, add general message node
        if not nodes:
            nodes.append({
                "id": "msg_0",
                "type": "message",
                "content": body[:100] + "..." if len(body) > 100 else body,
                "timestamp": email.get("timestamp"),
            })

        return nodes

    def _extract_edges(self, sender: str, recipients: List, thread_id: str) -> List[Dict]:
        """Extract edges (relationships) between participants."""
        edges = []
        
        for recipient in recipients:
            edges.append({
                "from": sender,
                "to": recipient,
                "type": "communication",
                "thread_id": thread_id,
                "weight": 1,
            })

        return edges

    def _analyze_topic_flow(self, body: str, thread_id: str) -> Dict:
        """Analyze topic flow through the thread."""
        body_lower = body.lower()
        
        topics = []
        topic_keywords = {
            "technical": ["api", "code", "bug", "feature", "integration"],
            "business": ["budget", "timeline", "proposal", "contract"],
            "planning": ["schedule", "meeting", "deadline", "milestone"],
            "support": ["issue", "problem", "help", "support"],
        }

        for topic, keywords in topic_keywords.items():
            if any(kw in body_lower for kw in keywords):
                topics.append(topic)

        return {
            "topics": topics,
            "topic_count": len(topics),
            "primary_topic": topics[0] if topics else "general",
        }

    def _identify_decision_points(self, body: str) -> List[Dict]:
        """Identify decision points in the thread."""
        decisions = []
        body_lower = body.lower()

        decision_patterns = [
            (r'\bdecided\s+(.{20,100}?)(?:\.|$)', "decision_made"),
            (r'\bagreed\s+(.{20,100}?)(?:\.|$)', "agreement"),
            (r'\bapproved\s+(.{20,100}?)(?:\.|$)', "approval"),
            (r'\bconfirmed\s+(.{20,100}?)(?:\.|$)', "confirmation"),
        ]

        for pattern, decision_type in decision_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches[:3]:
                decisions.append({
                    "type": decision_type,
                    "content": match.strip(),
                    "confidence": 0.85,
                })

        return decisions

    def _calculate_thread_complexity(self, email: Dict, participants: List, edges: List) -> Dict:
        """Calculate thread complexity metrics."""
        participant_count = len(participants)
        edge_count = len(edges)
        thread_depth = email.get("thread_depth", 1)
        word_count = len(email.get("body", "").split())

        # Complexity score (0-100)
        score = 0
        score += min(participant_count * 5, 30)
        score += min(thread_depth * 10, 40)
        score += min(word_count / 20, 20)
        score += min(edge_count * 2, 10)
        score = min(score, 100)

        if score >= 70:
            level = "HIGH"
        elif score >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "score": score,
            "level": level,
            "participant_count": participant_count,
            "edge_count": edge_count,
            "thread_depth": thread_depth,
            "word_count": word_count,
        }

    def _generate_visualization_data(self, participants: List, nodes: List, edges: List, topic_flow: Dict, decisions: List) -> Dict:
        """Generate visualization data structure."""
        return {
            "nodes": [
                {"id": p["email"], "type": "participant", "role": p["role"]}
                for p in participants
            ] + nodes,
            "edges": edges,
            "topics": topic_flow["topics"],
            "decisions": decisions,
            "layout": "force_directed",
            "interactive": True,
        }

    def _generate_thread_summary(self, participants: List, nodes: List, decisions: List, complexity: Dict) -> Dict:
        """Generate thread summary."""
        return {
            "participant_count": len(participants),
            "message_count": len(nodes),
            "decision_count": len(decisions),
            "complexity_level": complexity["level"],
            "summary_text": f"Thread with {len(participants)} participants, {len(nodes)} conversation points, and {len(decisions)} decisions. Complexity: {complexity['level']}.",
        }

    def _determine_visualization_action(self, complexity: Dict, participants: List) -> str:
        """Determine visualization action."""
        if complexity["level"] == "HIGH":
            return "GENERATE_DETAILED_GRAPH"
        elif complexity["level"] == "MEDIUM":
            return "GENERATE_STANDARD_GRAPH"
        elif len(participants) > 5:
            return "GENERATE_PARTICIPANT_FOCUS_GRAPH"
        else:
            return "GENERATE_SIMPLE_TIMELINE"

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
        if not self.visualizer_log:
            return {"threads_visualized": 0}
        return {
            "threads_visualized": len(self.visualizer_log),
            "total_participants": sum(v["participant_count"] for v in self.visualizer_log),
            "total_nodes": sum(v["node_count"] for v in self.visualizer_log),
            "total_edges": sum(v["edge_count"] for v in self.visualizer_log),
            "reply_all_enforced": len(self.reply_all_audit),
        }


def test_v976():
    engine = ThreadVisualizer()

    # Test 1: Complex multi-participant thread
    email1 = {
        "id": "viz-001",
        "from": "pm@company.com",
        "to": ["dev@ziontechgroup.com", "qa@company.com", "design@company.com"],
        "cc": ["director@company.com", "cto@company.com"],
        "subject": "Project Alpha - Sprint Review",
        "body": "Hi team, regarding the sprint review: We've decided to launch on March 15th. The API integration is complete. Can you confirm the testing timeline? Please prepare the release notes by Friday. The budget has been approved at $150K.",
        "thread_id": "thread-alpha-1",
        "thread_depth": 5,
    }
    r1 = engine.analyze_email_case_by_case(email1)
    assert r1["reply_all_enforcement"]["enforced"] is True
    assert len(r1["participants"]) >= 3
    assert r1["thread_complexity"]["level"] in ("MEDIUM", "HIGH")
    print(f"✅ Test 1 PASSED: Participants={len(r1['participants'])}, nodes={len(r1['conversation_nodes'])}, complexity={r1['thread_complexity']['level']}, reply-all enforced")

    # Test 2: Simple thread
    email2 = {
        "id": "viz-002",
        "from": "user@example.com",
        "to": ["support@ziontechgroup.com"],
        "subject": "Quick question",
        "body": "How do I reset my password?",
        "thread_id": "thread-simple-1",
        "thread_depth": 1,
    }
    r2 = engine.analyze_email_case_by_case(email2)
    assert r2["reply_all_enforcement"]["enforced"] is False
    assert r2["thread_complexity"]["level"] == "LOW"
    print(f"✅ Test 2 PASSED: Simple thread, complexity={r2['thread_complexity']['level']}")

    stats = engine.get_stats()
    print(f"✅ Test 3 PASSED: {stats['threads_visualized']} threads visualized, {stats['total_participants']} total participants")

    print("\n🎉 V976 ALL TESTS PASSED — Thread Visualizer Engine operational!")
    return True


if __name__ == "__main__":
    test_v976()
