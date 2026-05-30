#!/usr/bin/env python3
"""V181 - AI Email Knowledge Graph Builder
Builds entity-relationship graphs from emails: people, companies, projects, decisions, and connections.
Enables powerful search and relationship discovery with reply-all awareness."""
import json, re, hashlib
from datetime import datetime
from typing import Dict, List, Any, Set
from collections import defaultdict

class KnowledgeGraphBuilder:
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.email_index = defaultdict(list)

    def process_email(self, email: Dict[str, Any]) -> Dict[str, Any]:
        sender = email.get("from", "")
        recipients = email.get("to", []) + email.get("cc", [])
        subject = email.get("subject", "")
        body = email.get("body", "")
        date = email.get("date", datetime.now().isoformat())
        content = f"{subject} {body}"
        sender_node = self._add_person_node(sender)
        recipient_nodes = [self._add_person_node(r) for r in recipients]
        company_nodes = self._extract_companies(content)
        project_nodes = self._extract_projects(content)
        topics = self._extract_topics(content)
        for r in recipient_nodes:
            self._add_edge(sender_node, r, "communicated_with", {"date": date, "subject": subject[:80]})
        for c in company_nodes:
            self._add_edge(sender_node, c, "associated_with", {"context": "mentioned in email"})
        for p in project_nodes:
            self._add_edge(sender_node, p, "working_on", {"date": date})
        self.email_index[sender].append({"date": date, "subject": subject, "recipients": recipients, "topics": topics})
        return {
            "graph_update_id": hashlib.md5(f"{sender}{date}".encode()).hexdigest()[:12],
            "nodes_added": 1 + len(recipient_nodes) + len(company_nodes) + len(project_nodes),
            "edges_added": len(recipient_nodes) + len(company_nodes) + len(project_nodes),
            "total_nodes": len(self.nodes),
            "total_edges": len(self.edges),
            "entities_extracted": {"people": 1 + len(recipient_nodes), "companies": len(company_nodes), "projects": len(project_nodes), "topics": topics[:5]},
            "reply_all_nodes": [r for r in recipients],
            "graph_insights": self._generate_insights(sender)
        }

    def _add_person_node(self, email: str) -> str:
        node_id = f"person:{email}"
        if node_id not in self.nodes:
            name = email.split("@")[0].replace(".", " ").title() if "@" in email else email
            domain = email.split("@")[-1] if "@" in email else ""
            self.nodes[node_id] = {"type": "person", "email": email, "name": name, "domain": domain, "interactions": 0}
        self.nodes[node_id]["interactions"] += 1
        return node_id

    def _extract_companies(self, content: str) -> List[str]:
        patterns = [r"\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s+(?:Inc|LLC|Ltd|Corp|Group|Technologies|Solutions|Systems))\b)"]
        companies = set()
        for p in patterns:
            for match in re.findall(p, content):
                node_id = f"company:{match}"
                if node_id not in self.nodes:
                    self.nodes[node_id] = {"type": "company", "name": match}
                companies.add(node_id)
        return list(companies)

    def _extract_projects(self, content: str) -> List[str]:
        patterns = [r"(?:project|initiative|program)\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s*[.,;]|$)"]
        projects = set()
        for p in patterns:
            for match in re.findall(p, content, re.IGNORECASE)[:3]:
                clean = match.strip()[:50]
                if len(clean) > 3:
                    node_id = f"project:{clean}"
                    if node_id not in self.nodes:
                        self.nodes[node_id] = {"type": "project", "name": clean}
                    projects.add(node_id)
        return list(projects)

    def _extract_topics(self, content: str) -> List[str]:
        words = [w for w in re.findall(r"\b[a-z]{5,}\b", content.lower()) if w not in {"would", "could", "should", "their", "there", "which", "about", "after", "before"}]
        from collections import Counter
        return [w for w, _ in Counter(words).most_common(10)]

    def _add_edge(self, source: str, target: str, relation: str, metadata: Dict = None):
        self.edges.append({"source": source, "target": target, "relation": relation, "metadata": metadata or {}})

    def _generate_insights(self, sender: str) -> List[str]:
        insights = []
        sender_interactions = self.nodes.get(f"person:{sender}", {}).get("interactions", 0)
        if sender_interactions > 10:
            insights.append(f"High-activity contact: {sender_interactions} interactions")
        if len(self.nodes) > 50:
            insights.append(f"Knowledge graph growing: {len(self.nodes)} entities tracked")
        connections = sum(1 for e in self.edges if e["source"] == f"person:{sender}")
        if connections > 5:
            insights.append(f"Well-connected: {connections} direct relationships")
        return insights or ["Building knowledge graph — more emails = richer insights"]

    def query_relationships(self, entity: str, depth: int = 2) -> Dict:
        results = {"entity": entity, "connections": [], "depth": depth}
        visited = set()
        queue = [(f"person:{entity}", 0)]
        while queue:
            node, d = queue.pop(0)
            if d > depth or node in visited:
                continue
            visited.add(node)
            for edge in self.edges:
                if edge["source"] == node:
                    results["connections"].append({"target": edge["target"], "relation": edge["relation"], "depth": d + 1})
                    if d + 1 < depth:
                        queue.append((edge["target"], d + 1))
        return results

if __name__ == "__main__":
    graph = KnowledgeGraphBuilder()
    result = graph.process_email({"from": "alice@ziontechgroup.com", "to": ["bob@client.com", "carol@client.com"], "cc": ["dave@ziontechgroup.com"], "subject": "Project Phoenix - status update", "body": "Hi team, the Project Phoenix milestone has been reached. Client Corp is pleased with progress. Budget review scheduled with Acme Technologies.", "date": "2024-01-15T10:00:00"})
    print(json.dumps(result, indent=2))
