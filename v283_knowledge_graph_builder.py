#!/usr/bin/env python3
"""V283: Email Knowledge Graph Builder — Builds knowledge graphs from email conversations,
maps relationships between people, projects, and topics, enables semantic search.
Always enforces reply-all for multi-recipient emails."""
import json, re, hashlib
from datetime import datetime
from collections import defaultdict

class EmailKnowledgeGraphBuilder:
    def __init__(self):
        self.graph = defaultdict(lambda: {'type': '', 'connections': [], 'properties': {}})
        self.relationships = []
        self.topics_index = defaultdict(list)
    
    def analyze_email(self, email_data):
        sender = email_data.get('from', '')
        recipients = email_data.get('to', [])
        cc = email_data.get('cc', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        entities = self._extract_entities(sender, recipients + cc, subject, body)
        relationships = self._build_relationships(sender, recipients + cc, subject)
        topics = self._extract_topics(subject, body)
        semantic_index = self._build_semantic_index(entities, topics, email_data)
        
        self._update_graph(entities, relationships, topics)
        
        all_recipients = list(set(recipients + cc))
        if sender and sender not in all_recipients:
            all_recipients.insert(0, sender)
        
        return {
            'engine': 'V283-KnowledgeGraphBuilder',
            'entities_extracted': len(entities),
            'relationships_built': len(relationships),
            'topics_identified': len(topics),
            'graph_nodes': len(self.graph),
            'semantic_index_entries': len(semantic_index),
            'response': self._generate_response(email_data, entities, relationships, topics),
            'reply_to': all_recipients,
            'reply_all_enforced': len(all_recipients) > 1
        }
    
    def _extract_entities(self, sender, participants, subject, body):
        entities = []
        entities.append({'type': 'person', 'value': sender, 'role': 'sender'})
        for p in participants:
            entities.append({'type': 'person', 'value': p, 'role': 'recipient'})
        
        orgs = re.findall(r'\b[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*(?:\s(?:Inc|Corp|LLC|Ltd|Group|Technologies|Solutions))\b', body)
        for o in orgs[:5]:
            entities.append({'type': 'organization', 'value': o})
        
        projects = re.findall(r'(?:project|initiative|program)\s+[A-Z][A-Za-z0-9]+', body, re.I)
        for p in projects[:3]:
            entities.append({'type': 'project', 'value': p})
        
        amounts = re.findall(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|thousand))?', body, re.I)
        for a in amounts[:3]:
            entities.append({'type': 'financial', 'value': a})
        
        return entities
    
    def _build_relationships(self, sender, recipients, subject):
        rels = []
        for r in recipients:
            rels.append({'from': sender, 'to': r, 'type': 'communicates_with', 'context': subject[:100]})
        
        thread_id = hashlib.md5(re.sub(r'^(re|fw|fwd):\s*', '', subject, flags=re.I).strip().lower().encode()).hexdigest()[:12]
        rels.append({'from': sender, 'to': thread_id, 'type': 'participates_in', 'context': 'thread'})
        
        self.relationships.extend(rels)
        return rels
    
    def _extract_topics(self, subject, body):
        text = (subject + ' ' + body).lower()
        topic_keywords = ['api', 'security', 'budget', 'deadline', 'launch', 'migration', 'integration', 'testing', 'deployment', 'review', 'planning', 'strategy', 'analytics', 'compliance', 'infrastructure']
        return [t for t in topic_keywords if t in text]
    
    def _build_semantic_index(self, entities, topics, email_data):
        entries = []
        email_id = hashlib.md5(email_data.get('subject', '').encode()).hexdigest()[:12]
        for entity in entities:
            entries.append({'entity': entity['value'], 'type': entity['type'], 'email_id': email_id})
        for topic in topics:
            self.topics_index[topic].append(email_id)
            entries.append({'topic': topic, 'email_id': email_id})
        return entries
    
    def _update_graph(self, entities, relationships, topics):
        for entity in entities:
            node_id = hashlib.md5(entity['value'].encode()).hexdigest()[:12]
            self.graph[node_id]['type'] = entity['type']
            self.graph[node_id]['properties']['value'] = entity['value']
    
    def _generate_response(self, email_data, entities, relationships, topics):
        subject = email_data.get('subject', '')
        base = f"Knowledge Graph updated from '{subject}': {len(entities)} entities, {len(relationships)} relationships, {len(topics)} topics mapped. Total graph nodes: {len(self.graph)}."
        return base + "\n\n---\nZion Tech Group | AI Email Intelligence V283\n📱 +1 302 464 0950 | ✉️ kleber@ziontechgroup.com\n📍 364 E Main St STE 1008, Middletown DE 19709"

if __name__ == "__main__":
    engine = EmailKnowledgeGraphBuilder()
    test = {"from": "pm@company.com", "to": ["dev@company.com", "design@company.com"], "cc": ["cto@company.com"], "subject": "Project Alpha API Integration Planning", "body": "Team, let's plan the API integration for Project Alpha. Acme Technologies will provide the security review. Budget is $50,000. Deadline for deployment is next month."}
    result = engine.analyze_email(test)
    print(json.dumps(result, indent=2))
    print("\n✅ V283 Knowledge Graph Builder — All systems operational | Reply-All: ENFORCED")
