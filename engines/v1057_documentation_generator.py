#!/usr/bin/env python3
"""V1057: Email-to-Documentation Generator
Automatically extract technical requirements from email threads.
Generate API documentation, user guides, and SOPs.
MANDATORY: Reply-all enforcement for multi-recipient emails.
"""

import re
import json
from datetime import datetime
from collections import defaultdict

class DocumentationGenerator:
    def __init__(self):
        self.doc_types = {
            'api_doc': {'trigger': ['api', 'endpoint', 'request', 'response', 'payload', 'json'], 'template': 'api_reference'},
            'user_guide': {'trigger': ['how to', 'steps', 'tutorial', 'guide', 'walkthrough'], 'template': 'step_by_step'},
            'sop': {'trigger': ['procedure', 'process', 'standard', 'workflow', 'protocol'], 'template': 'sop'},
            'faq': {'trigger': ['question', 'faq', 'common', 'frequently asked'], 'template': 'qa'},
            'troubleshooting': {'trigger': ['error', 'issue', 'problem', 'fix', 'debug', 'not working'], 'template': 'troubleshoot'},
            'release_notes': {'trigger': ['release', 'version', 'update', 'changelog', 'new feature'], 'template': 'release'}
        }
        self.generated_docs = []

    def generate_documentation(self, email_data):
        sender = email_data.get('sender', 'unknown')
        recipients = email_data.get('recipients', [])
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        reply_all = len(recipients) > 1

        doc_type = self._detect_doc_type(subject, body)
        sections = self._extract_sections(body)
        requirements = self._extract_requirements(body)
        code_snippets = self._extract_code(body)
        steps = self._extract_steps(body)

        doc = self._build_documentation(doc_type, sections, requirements, code_snippets, steps, email_data)

        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all,
            'documentation_type': doc_type,
            'generated_document': doc,
            'sections_extracted': len(sections),
            'requirements_found': len(requirements),
            'code_snippets': len(code_snippets),
            'steps_extracted': len(steps),
            'quality_score': self._score_quality(doc),
            'export_formats': ['Markdown', 'HTML', 'PDF', 'Confluence', 'Notion'],
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }

    def _detect_doc_type(self, subject, body):
        text = (subject + ' ' + body).lower()
        scores = {}
        for doc_type, config in self.doc_types.items():
            score = sum(1 for t in config['trigger'] if t in text)
            if score > 0:
                scores[doc_type] = score
        return max(scores, key=scores.get) if scores else 'user_guide'

    def _extract_sections(self, body):
        sections = []
        headers = re.findall(r'(?:^|\n)([A-Z][^\n]{5,60})\n', body)
        for h in headers[:10]:
            sections.append({'title': h.strip(), 'content': ''})
        if not sections:
            paragraphs = [p.strip() for p in body.split('\n\n') if len(p.strip()) > 30]
            for i, p in enumerate(paragraphs[:5]):
                sections.append({'title': f'Section {i+1}', 'content': p[:200]})
        return sections

    def _extract_requirements(self, body):
        reqs = []
        patterns = [
            r'(?:must|shall|should|required|need to)\s+([^\.\n]{10,100})',
            r'(?:requirement|specification)[:\s]+([^\.\n]{10,100})'
        ]
        for p in patterns:
            for m in re.finditer(p, body, re.IGNORECASE):
                reqs.append({'text': m.group(1).strip(), 'priority': 'must' if 'must' in m.group(0).lower() else 'should'})
        return reqs[:10]

    def _extract_code(self, body):
        code_blocks = re.findall(r'```[\s\S]*?```', body)
        inline_code = re.findall(r'`([^`]{3,100})`', body)
        return [{'type': 'block', 'content': c[:200]} for c in code_blocks[:5]] + [{'type': 'inline', 'content': c} for c in inline_code[:5]]

    def _extract_steps(self, body):
        steps = []
        numbered = re.findall(r'(?:^|\n)\s*(\d+)[\.\)]\s*([^\n]{10,100})', body)
        for num, text in numbered[:10]:
            steps.append({'step': int(num), 'text': text.strip()})
        if not steps:
            bullets = re.findall(r'(?:^|\n)\s*[-*•]\s*([^\n]{10,100})', body)
            for i, text in enumerate(bullets[:10], 1):
                steps.append({'step': i, 'text': text.strip()})
        return steps

    def _build_documentation(self, doc_type, sections, requirements, code_snippets, steps, email_data):
        title = email_data.get('subject', 'Untitled Documentation').replace('Re:', '').replace('Fwd:', '').strip()
        doc = {'title': title, 'type': doc_type, 'generated_at': datetime.now().isoformat(), 'sections': []}
        if doc_type == 'api_doc':
            doc['sections'] = [{'heading': 'Overview', 'content': f'API documentation for {title}'},
                              {'heading': 'Endpoints', 'content': 'See code examples below'},
                              {'heading': 'Code Examples', 'content': [c['content'] for c in code_snippets]}]
        elif doc_type == 'user_guide':
            doc['sections'] = [{'heading': 'Introduction', 'content': f'Guide for {title}'},
                              {'heading': 'Steps', 'content': [f"Step {s['step']}: {s['text']}" for s in steps]},
                              {'heading': 'Requirements', 'content': [r['text'] for r in requirements]}]
        elif doc_type == 'sop':
            doc['sections'] = [{'heading': 'Purpose', 'content': f'Standard Operating Procedure: {title}'},
                              {'heading': 'Procedure', 'content': [f"Step {s['step']}: {s['text']}" for s in steps]},
                              {'heading': 'Requirements', 'content': [r['text'] for r in requirements]}]
        else:
            doc['sections'] = [{'heading': s['title'], 'content': s.get('content', '')} for s in sections]
        return doc

    def _score_quality(self, doc):
        score = 50
        if doc.get('sections'): score += len(doc['sections']) * 5
        return min(100, score)

if __name__ == '__main__':
    gen = DocumentationGenerator()
    test = {'id': 'e001', 'sender': 'dev@company.com', 'recipients': ['docs@ziontechgroup.com', 'team@ziontechgroup.com'],
            'subject': 'API Integration Guide - REST Endpoints',
            'body': """Here is the API integration guide:\n\n1. Get your API key from the dashboard\n2. Configure the webhook URL\n3. Test the connection using the test endpoint\n\nThe API must authenticate using Bearer tokens.\nThe endpoint should return JSON responses.\n\n```python\nimport requests\nresponse = requests.get('/api/v1/test', headers={'Authorization': 'Bearer token'})\n```"""}
    result = gen.generate_documentation(test)
    print("=== V1057: Email-to-Documentation Generator ===\n")
    print(f"Doc Type: {result['documentation_type']}")
    print(f"Sections: {result['sections_extracted']}")
    print(f"Requirements: {result['requirements_found']}")
    print(f"Code Snippets: {result['code_snippets']}")
    print(f"Steps: {result['steps_extracted']}")
    print(f"Quality: {result['quality_score']}/100")
    print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
