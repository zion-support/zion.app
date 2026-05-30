#!/usr/bin/env python3
"""
V363: Email Knowledge Graph Builder
Extract entities (people, companies, topics), build relationship graphs,
map organizational structures, discover hidden connections, create searchable knowledge base.
"""
import re
import json
from datetime import datetime
from typing import Dict, List, Set
from collections import defaultdict

class KnowledgeGraphBuilder:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        self.company_patterns = [r'Inc\.', r'LLC', r'Corp', r'Ltd', r'Company', r'Group']
        self.topic_patterns = [r'project[:\s]+\w+', r'initiative[:\s]+\w+', r'Q[1-4]\s+\d{4}']
    
    def extract_entities(self, text: str) -> Dict:
        """Extract people, companies, and topics from text"""
        entities = {
            'people': set(),
            'companies': set(),
            'topics': set(),
            'emails': set(),
            'phones': set()
        }
        
        # Extract emails and phones
        entities['emails'] = set(re.findall(self.email_pattern, text))
        entities['phones'] = set(re.findall(self.phone_pattern, text))
        
        # Extract companies
        for pattern in self.company_patterns:
            matches = re.finditer(r'(\w+(?:\s+\w+){0,2}\s+' + pattern + ')', text, re.IGNORECASE)
            for match in matches:
                entities['companies'].add(match.group(1).strip())
        
        # Extract topics
        for pattern in self.topic_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                entities['topics'].add(match.group(0).strip())
        
        # Extract names (simple heuristic: capitalized words)
        name_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b'
        potential_names = re.findall(name_pattern, text)
        for name in potential_names:
            if len(name.split()) >= 2 and not any(c in name for c in self.company_patterns):
                entities['people'].add(name)
        
        # Convert sets to lists for JSON serialization
        return {k: list(v) for k, v in entities.items()}
    
    def build_relationship_graph(self, emails: List[Dict]) -> Dict:
        """Build relationship graph from email thread"""
        graph = {
            'nodes': defaultdict(lambda: {'type': 'person', 'connections': set()}),
            'edges': []
        }
        
        for email in emails:
            sender = email.get('sender', '')
            recipients = email.get('recipients', [])
            body = email.get('body', '')
            
            # Add sender node
            graph['nodes'][sender]['type'] = 'person'
            graph['nodes'][sender]['connections'].update(recipients)
            
            # Add recipient nodes
            for recipient in recipients:
                graph['nodes'][recipient]['type'] = 'person'
                graph['nodes'][recipient]['connections'].add(sender)
            
            # Extract entities from body
            entities = self.extract_entities(body)
            for company in entities['companies']:
                graph['nodes'][company]['type'] = 'company'
            
            # Create edges
            for recipient in recipients:
                graph['edges'].append({
                    'from': sender,
                    'to': recipient,
                    'timestamp': email.get('timestamp'),
                    'subject': email.get('subject', '')
                })
        
        # Convert to serializable format
        return {
            'nodes': [{'id': k, **v, 'connections': list(v['connections'])} 
                     for k, v in graph['nodes'].items()],
            'edges': graph['edges'],
            'stats': {
                'total_nodes': len(graph['nodes']),
                'total_edges': len(graph['edges']),
                'people_count': sum(1 for n in graph['nodes'].values() if n['type'] == 'person'),
                'company_count': sum(1 for n in graph['nodes'].values() if n['type'] == 'company')
            }
        }
    
    def discover_connections(self, graph: Dict) -> List[Dict]:
        """Discover hidden connections and patterns"""
        discoveries = []
        nodes = {n['id']: n for n in graph['nodes']}
        
        # Find common connections
        for node_id, node in nodes.items():
            if node['type'] == 'person' and len(node['connections']) > 2:
                discoveries.append({
                    'type': 'hub_person',
                    'entity': node_id,
                    'connection_count': len(node['connections']),
                    'insight': f'{node_id} is a key connector with {len(node["connections"])} direct relationships'
                })
        
        # Find organizational patterns
        edge_counts = defaultdict(int)
        for edge in graph['edges']:
            edge_counts[(edge['from'], edge['to'])] += 1
        
        for (sender, recipient), count in edge_counts.items():
            if count > 3:
                discoveries.append({
                    'type': 'frequent_communication',
                    'from': sender,
                    'to': recipient,
                    'frequency': count,
                    'insight': f'High-frequency communication channel ({count} exchanges)'
                })
        
        return discoveries
    
    def analyze_thread(self, emails: List[Dict]) -> Dict:
        """Full knowledge graph analysis"""
        graph = self.build_relationship_graph(emails)
        discoveries = self.discover_connections(graph)
        
        # Extract all entities
        all_entities = {
            'people': set(),
            'companies': set(),
            'topics': set()
        }
        for email in emails:
            entities = self.extract_entities(email.get('body', ''))
            all_entities['people'].update(entities['people'])
            all_entities['companies'].update(entities['companies'])
            all_entities['topics'].update(entities['topics'])
        
        recipients = emails[-1].get('recipients', []) if emails else []
        reply_all_required = len(recipients) > 1
        
        return {
            'engine': 'V363',
            'knowledge_graph': graph,
            'discovered_connections': discoveries,
            'extracted_entities': {k: list(v) for k, v in all_entities.items()},
            'reply_all_required': reply_all_required,
            'reply_all_enforced': reply_all_required,
            'timestamp': datetime.now().isoformat()
        }

if __name__ == '__main__':
    builder = KnowledgeGraphBuilder()
    sample_thread = [
        {
            'sender': 'john.smith@acme.com',
            'recipients': ['sarah.jones@techcorp.com', 'mike.wilson@acme.com'],
            'body': 'Project Alpha is moving forward. Contact Jane Doe at GlobalTech Inc. for partnership. Call 555-123-4567.',
            'timestamp': '2024-01-15T10:00:00',
            'subject': 'Project Alpha Update'
        },
        {
            'sender': 'sarah.jones@techcorp.com',
            'recipients': ['john.smith@acme.com', 'mike.wilson@acme.com'],
            'body': 'Great! I will reach out to Jane Doe. Q1 2024 timeline looks good.',
            'timestamp': '2024-01-15T11:30:00',
            'subject': 'Re: Project Alpha Update'
        }
    ]
    
    result = builder.analyze_thread(sample_thread)
    print(json.dumps(result, indent=2))
