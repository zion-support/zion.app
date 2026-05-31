#!/usr/bin/env python3
"""
V678 - Email Knowledge Base Builder
Automatically extracts and organizes knowledge from emails into a searchable
database, creating a living knowledge repository from team communications.

Key Features:
- Knowledge extraction and categorization
- FAQ generation from common questions
- Process documentation extraction
- Expert identification
- Knowledge gap detection
- Searchable knowledge indexing
"""

import json
import re
from datetime import datetime
from collections import defaultdict, Counter
from typing import Dict, List, Optional, Tuple
import hashlib

class EmailKnowledgeBaseBuilder:
    def __init__(self):
        self.knowledge_base = defaultdict(list)
        self.faqs = []
        self.processes = []
        self.experts = defaultdict(list)
        self.categories = defaultdict(int)
    
    def extract_knowledge(self, email: Dict) -> Dict:
        """
        Extract knowledge from email and add to knowledge base
        
        Args:
            email: Email dictionary
        
        Returns:
            Dict with extracted knowledge
        """
        text = email.get('body', '') + ' ' + email.get('subject', '')
        sender = email.get('from', '')
        
        # Classify knowledge type
        knowledge_type = self._classify_knowledge_type(email)
        
        # Extract key information
        key_info = self._extract_key_information(text)
        
        # Detect if it's a FAQ
        is_faq, question, answer = self._detect_faq(email)
        
        # Detect process documentation
        is_process, process_steps = self._detect_process(text)
        
        # Extract expertise indicators
        expertise_areas = self._detect_expertise(text, sender)
        
        # Categorize knowledge
        category = self._categorize_knowledge(text)
        
        # Calculate knowledge value
        knowledge_value = self._calculate_knowledge_value(
            knowledge_type=knowledge_type,
            key_info_count=len(key_info),
            is_faq=is_faq,
            is_process=is_process
        )
        
        # Generate knowledge entry
        knowledge_id = self._generate_knowledge_id(email)
        
        knowledge_entry = {
            'knowledge_id': knowledge_id,
            'email_id': email.get('id', ''),
            'knowledge_type': knowledge_type,
            'category': category,
            'key_information': key_info,
            'is_faq': is_faq,
            'faq_question': question,
            'faq_answer': answer,
            'is_process': is_process,
            'process_steps': process_steps,
            'expertise_areas': expertise_areas,
            'knowledge_value': knowledge_value,
            'author': sender,
            'timestamp': email.get('timestamp', datetime.now().isoformat()),
            'searchable_text': self._create_searchable_text(email),
            'reply_all_required': len(email.get('to', [])) > 1
        }
        
        # Add to knowledge base
        self.knowledge_base[category].append(knowledge_entry)
        self.categories[category] += 1
        
        # Add FAQ if detected
        if is_faq:
            self.faqs.append({
                'question': question,
                'answer': answer,
                'category': category,
                'source_email': email.get('id', ''),
                'author': sender
            })
        
        # Add process if detected
        if is_process:
            self.processes.append({
                'process_name': self._extract_process_name(text),
                'steps': process_steps,
                'category': category,
                'source_email': email.get('id', ''),
                'author': sender
            })
        
        # Update expert registry
        for area in expertise_areas:
            self.experts[area].append({
                'expert': sender,
                'email_id': email.get('id', ''),
                'timestamp': email.get('timestamp', datetime.now().isoformat())
            })
        
        return knowledge_entry
    
    def _classify_knowledge_type(self, email: Dict) -> str:
        """Classify the type of knowledge"""
        text = (email.get('body', '') + ' ' + email.get('subject', '')).lower()
        
        if any(kw in text for kw in ['how to', 'steps', 'procedure', 'process']):
            return 'process'
        elif any(kw in text for kw in ['policy', 'rule', 'guideline', 'standard']):
            return 'policy'
        elif any(kw in text for kw in ['best practice', 'recommendation', 'tip', 'advice']):
            return 'best_practice'
        elif any(kw in text for kw in ['decision', 'approved', 'agreed', 'conclusion']):
            return 'decision'
        elif any(kw in text for kw in ['problem', 'solution', 'fix', 'troubleshoot']):
            return 'troubleshooting'
        elif any(kw in text for kw in ['contact', 'resource', 'link', 'reference']):
            return 'resource'
        else:
            return 'general'
    
    def _extract_key_information(self, text: str) -> List[str]:
        """Extract key information points"""
        key_info = []
        
        # Extract URLs
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', text)
        if urls:
            key_info.extend([f"URL: {url}" for url in urls[:3]])  # Limit to 3
        
        # Extract email addresses
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if emails:
            key_info.extend([f"Contact: {email}" for email in emails[:3]])
        
        # Extract numbers/metrics
        numbers = re.findall(r'\b\d+(?:\.\d+)?%?\b', text)
        if numbers:
            key_info.extend([f"Metric: {num}" for num in numbers[:5]])
        
        # Extract dates
        dates = re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', text)
        if dates:
            key_info.extend([f"Date: {date}" for date in dates[:3]])
        
        return key_info
    
    def _detect_faq(self, email: Dict) -> Tuple[bool, Optional[str], Optional[str]]:
        """Detect if email contains a FAQ"""
        subject = email.get('subject', '')
        body = email.get('body', '')
        
        # Check if subject is a question
        is_question = subject.strip().endswith('?') or any(
            kw in subject.lower() for kw in ['what', 'how', 'why', 'when', 'where', 'who']
        )
        
        if not is_question:
            return False, None, None
        
        # Extract answer from body
        lines = [l.strip() for l in body.split('\n') if l.strip()]
        
        # Skip greetings
        answer_lines = []
        skip_patterns = ['hi', 'hello', 'hey', 'dear', 'thanks', 'regards']
        
        for line in lines:
            if not any(line.lower().startswith(p) for p in skip_patterns):
                answer_lines.append(line)
                if len(answer_lines) >= 3:  # Get first 3 meaningful lines
                    break
        
        if not answer_lines:
            return False, None, None
        
        question = subject.strip()
        answer = ' '.join(answer_lines)
        
        return True, question, answer
    
    def _detect_process(self, text: str) -> Tuple[bool, List[str]]:
        """Detect if text contains process documentation"""
        text_lower = text.lower()
        
        # Check for process indicators
        process_indicators = ['step', 'first', 'then', 'next', 'finally', 'after that']
        has_steps = any(ind in text_lower for ind in process_indicators)
        
        if not has_steps:
            return False, []
        
        # Extract steps
        steps = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            # Look for numbered or bulleted items
            if re.match(r'^[\d\-\*•]\s+', line):
                step = re.sub(r'^[\d\-\*•]\s+', '', line)
                if len(step) > 10:  # Meaningful step
                    steps.append(step)
        
        return len(steps) >= 2, steps[:10]  # Limit to 10 steps
    
    def _detect_expertise(self, text: str, sender: str) -> List[str]:
        """Detect areas of expertise from email"""
        text_lower = text.lower()
        expertise_areas = []
        
        # Technical expertise
        tech_keywords = {
            'programming': ['code', 'programming', 'python', 'javascript', 'api'],
            'database': ['database', 'sql', 'query', 'schema'],
            'infrastructure': ['server', 'infrastructure', 'devops', 'cloud'],
            'security': ['security', 'encryption', 'authentication', 'firewall'],
            'analytics': ['analytics', 'data', 'metrics', 'reporting']
        }
        
        for area, keywords in tech_keywords.items():
            if any(kw in text_lower for kw in keywords):
                expertise_areas.append(area)
        
        # Business expertise
        business_keywords = {
            'marketing': ['marketing', 'campaign', 'brand', 'audience'],
            'sales': ['sales', 'revenue', 'customer', 'deal'],
            'finance': ['budget', 'financial', 'cost', 'revenue'],
            'operations': ['operations', 'process', 'efficiency', 'workflow']
        }
        
        for area, keywords in business_keywords.items():
            if any(kw in text_lower for kw in keywords):
                expertise_areas.append(area)
        
        return expertise_areas
    
    def _categorize_knowledge(self, text: str) -> str:
        """Categorize knowledge into appropriate category"""
        text_lower = text.lower()
        
        categories = {
            'technical': ['code', 'api', 'system', 'technical', 'software'],
            'business': ['business', 'strategy', 'revenue', 'market'],
            'hr': ['hiring', 'employee', 'policy', 'benefits'],
            'operations': ['process', 'workflow', 'operations', 'procedure'],
            'product': ['product', 'feature', 'release', 'roadmap'],
            'customer': ['customer', 'support', 'feedback', 'satisfaction']
        }
        
        for category, keywords in categories.items():
            if any(kw in text_lower for kw in keywords):
                return category
        
        return 'general'
    
    def _calculate_knowledge_value(self, knowledge_type: str, key_info_count: int,
                                  is_faq: bool, is_process: bool) -> float:
        """Calculate knowledge value score (0-100)"""
        score = 0.0
        
        # Base score by type
        type_scores = {
            'process': 30,
            'policy': 25,
            'best_practice': 25,
            'decision': 20,
            'troubleshooting': 25,
            'resource': 15,
            'general': 10
        }
        score += type_scores.get(knowledge_type, 10)
        
        # Key information bonus
        score += min(30, key_info_count * 5)
        
        # FAQ bonus
        if is_faq:
            score += 20
        
        # Process bonus
        if is_process:
            score += 20
        
        return min(100, score)
    
    def _generate_knowledge_id(self, email: Dict) -> str:
        """Generate unique knowledge ID"""
        content = email.get('subject', '') + email.get('body', '')
        hash_val = hashlib.md5(content.encode()).hexdigest()[:12]
        return f"KB-{hash_val}"
    
    def _create_searchable_text(self, email: Dict) -> str:
        """Create searchable text from email"""
        parts = [
            email.get('subject', ''),
            email.get('body', ''),
            email.get('from', '')
        ]
        return ' '.join(parts).lower()
    
    def _extract_process_name(self, text: str) -> str:
        """Extract process name from text"""
        # Look for process name patterns
        patterns = [
            r'(?:process|procedure|how to)[:\s]+([^\n]+)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:process|procedure)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "Unnamed Process"
    
    def search_knowledge_base(self, query: str, category: Optional[str] = None) -> List[Dict]:
        """Search the knowledge base"""
        query_lower = query.lower()
        results = []
        
        # Search in specified category or all
        categories_to_search = [category] if category else self.knowledge_base.keys()
        
        for cat in categories_to_search:
            if cat not in self.knowledge_base:
                continue
            
            for entry in self.knowledge_base[cat]:
                if query_lower in entry['searchable_text']:
                    results.append(entry)
        
        # Sort by knowledge value
        results.sort(key=lambda x: x['knowledge_value'], reverse=True)
        
        return results[:10]  # Return top 10 results
    
    def generate_knowledge_report(self) -> Dict:
        """Generate comprehensive knowledge base report"""
        total_entries = sum(len(entries) for entries in self.knowledge_base.values())
        
        if total_entries == 0:
            return {'message': 'Knowledge base is empty'}
        
        # Category distribution
        category_dist = dict(self.categories)
        
        # Knowledge type distribution
        type_dist = Counter()
        for entries in self.knowledge_base.values():
            for entry in entries:
                type_dist[entry['knowledge_type']] += 1
        
        # Average knowledge value
        all_values = [e['knowledge_value'] for entries in self.knowledge_base.values() for e in entries]
        avg_value = sum(all_values) / len(all_values) if all_values else 0
        
        # Top experts
        expert_counts = Counter()
        for area_experts in self.experts.values():
            for expert_entry in area_experts:
                expert_counts[expert_entry['expert']] += 1
        
        top_experts = expert_counts.most_common(5)
        
        # Knowledge gaps
        knowledge_gaps = self._detect_knowledge_gaps()
        
        return {
            'total_knowledge_entries': total_entries,
            'category_distribution': category_dist,
            'knowledge_type_distribution': dict(type_dist),
            'avg_knowledge_value': round(avg_value, 1),
            'total_faqs': len(self.faqs),
            'total_processes': len(self.processes),
            'top_experts': top_experts,
            'expert_areas': len(self.experts),
            'knowledge_gaps': knowledge_gaps,
            'knowledge_coverage': 'high' if total_entries > 50 else 'medium' if total_entries > 20 else 'low',
            'timestamp': datetime.now().isoformat()
        }
    
    def _detect_knowledge_gaps(self) -> List[str]:
        """Detect potential knowledge gaps"""
        gaps = []
        
        # Check for missing categories
        expected_categories = ['technical', 'business', 'hr', 'operations', 'product', 'customer']
        for cat in expected_categories:
            if cat not in self.categories or self.categories[cat] < 3:
                gaps.append(f"Low knowledge in {cat} category")
        
        # Check for missing knowledge types
        expected_types = ['process', 'policy', 'best_practice', 'troubleshooting']
        type_counts = Counter()
        for entries in self.knowledge_base.values():
            for entry in entries:
                type_counts[entry['knowledge_type']] += 1
        
        for knowledge_type in expected_types:
            if type_counts[knowledge_type] < 2:
                gaps.append(f"Missing {knowledge_type} documentation")
        
        # Check for low FAQ count
        if len(self.faqs) < 5:
            gaps.append("Low FAQ coverage - document common questions")
        
        return gaps


def test_v678():
    """Test V678 Email Knowledge Base Builder"""
    builder = EmailKnowledgeBaseBuilder()
    
    # Test 1: Process documentation
    email1 = {
        'id': 'e001',
        'from': 'techlead@company.com',
        'to': ['team@company.com'],
        'subject': 'How to Deploy to Production',
        'body': '''Team,
        
        Here's the deployment process:
        
        1. Run tests: npm test
        2. Build the application: npm run build
        3. Deploy to staging: npm run deploy:staging
        4. Verify in staging environment
        5. Deploy to production: npm run deploy:prod
        6. Monitor for 30 minutes
        
        Contact: devops@company.com
        Documentation: https://docs.company.com/deploy
        
        Best,
        Tech Lead''',
        'timestamp': '2026-05-30T09:00:00'
    }
    
    # Test 2: FAQ
    email2 = {
        'id': 'e002',
        'from': 'manager@company.com',
        'to': ['team@company.com'],
        'subject': 'What is the vacation policy?',
        'body': '''Team,
        
        Our vacation policy is as follows:
        
        - Full-time employees get 20 days per year
        - Part-time employees get pro-rated vacation
        - Vacation must be requested 2 weeks in advance
        - Maximum 10 consecutive days without manager approval
        
        Submit requests through the HR portal.
        
        Thanks,
        Manager''',
        'timestamp': '2026-05-30T10:00:00'
    }
    
    # Test 3: Best practice
    email3 = {
        'id': 'e003',
        'from': 'senior@company.com',
        'to': ['team@company.com'],
        'subject': 'Best Practices for Code Reviews',
        'body': '''Team,
        
        Here are some best practices for code reviews:
        
        - Review within 24 hours of submission
        - Focus on logic and architecture, not style
        - Provide constructive feedback
        - Approve or request changes within 48 hours
        - Use the code review checklist
        
        Resources:
        - Checklist: https://wiki.company.com/code-review
        - Style guide: https://wiki.company.com/style-guide
        
        Senior Developer''',
        'timestamp': '2026-05-30T11:00:00'
    }
    
    # Extract knowledge from all emails
    results = []
    for email in [email1, email2, email3]:
        result = builder.extract_knowledge(email)
        results.append(result)
        
        print(f"\n{'='*50}")
        print(f"Email: {email['subject'][:40]}...")
        print(f"Knowledge Type: {result['knowledge_type']}")
        print(f"Category: {result['category']}")
        print(f"Knowledge Value: {result['knowledge_value']}/100")
        print(f"Is FAQ: {result['is_faq']}")
        print(f"Is Process: {result['is_process']}")
        print(f"Key Info: {result['key_information']}")
        print(f"Expertise Areas: {result['expertise_areas']}")
    
    # Test search
    print(f"\n{'='*50}")
    print("Testing Search:")
    search_results = builder.search_knowledge_base('deployment')
    print(f"Search 'deployment': {len(search_results)} results")
    
    # Generate report
    report = builder.generate_knowledge_report()
    print(f"\n{'='*50}")
    print(f"✅ V678 Knowledge Base Builder Test Complete")
    print(f"Total Entries: {report['total_knowledge_entries']}")
    print(f"Avg Knowledge Value: {report['avg_knowledge_value']}/100")
    print(f"Total FAQs: {report['total_faqs']}")
    print(f"Total Processes: {report['total_processes']}")
    print(f"Expert Areas: {report['expert_areas']}")
    print(f"Knowledge Coverage: {report['knowledge_coverage']}")
    print(f"Knowledge Gaps: {report['knowledge_gaps']}")
    
    return report


if __name__ == '__main__':
    test_v678()
